<script lang="ts">
	import { onMount, tick, untrack } from 'svelte';
	import { updated } from '$app/state';
	import { transcribeWord } from '@ilya/phonology';
	import type { NotationPreferences } from '@ilya/phonology';
	import { loadDictionary, type LoaderState } from '$lib/loader';
	import { processText } from '$lib/pipeline';
	import { applyOpenSyllabificationToLines } from '$lib/syllable-utils';
	import type { LineData, WordStackData, SongMetadata, UserStressOverride, YoToggle, SyllableOverride } from '$lib/types';
	import { t, type Language } from '$lib/i18n';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import Drawer from '$lib/components/Drawer/Drawer.svelte';
	import {
		buildSlotQueue,
		firstPass,
		reconcilePairings,
		shiftToEndOfLyric,
		shiftToNextOpenNote,
		mergeOnUpload,
		type ShiftDirection,
	} from '$lib/shane/pairings';
	// N.67 step 0: the song document owns the per-song state and is the only
	// thing that talks to storage. `savePairings` / `loadPairings` are no
	// longer called from here; the legacy driver writes the same key.
	import { SongDocument, LEGACY_SONG_ID } from '$lib/library/document.svelte';
	import { Library } from '$lib/library/library';
	import { createMemoryDriver } from '$lib/library/driver';
	import { emptySongRecord } from '$lib/library/types';
	import { formatBytes } from '$lib/library/quota';
	import { hashBytes, fingerprintVocalLine } from '$lib/library/fingerprint';
	import type { OpenedLibrary } from '$lib/library';
	import SyllableStation from '$lib/shane/SyllableStation.svelte';
	import ShiftLyricsControl from '$lib/shane/ShiftLyricsControl.svelte';
	import RootPanel from '$lib/components/Drawer/RootPanel.svelte';
	import InspectorPanel from '$lib/components/Drawer/InspectorPanel.svelte';
	import Paper from '$lib/components/Paper/Paper.svelte';
import InstallPrompt from '$lib/components/InstallPrompt.svelte';
	import ReadingPaper from '$lib/components/Paper/ReadingPaper.svelte';
	import TabBar from '$lib/components/Drawer/TabBar.svelte';
	import type { TabId } from '$lib/components/Drawer/TabBar.svelte';
	import { INCLUDE_SHANE } from '$lib/wall';
	import CalibrationWizard from '$lib/shane/CalibrationWizard.svelte';
	import VoiceProfilePane from '$lib/shane/VoiceProfilePane.svelte';
	import ScoreUploader from '$lib/shane/ScoreUploader.svelte';
	import { ENGRAVING_DEFAULTS, type EngravingValues } from '$lib/shane/engraving';
	import {
		dropTagsForEdits,
		onScoreIngested,
		revertToScoreHeader,
		type MetadataField,
		type MetadataState,
	} from '$lib/metadata-provenance';
	import MetadataFields from '$lib/components/Drawer/MetadataFields.svelte';
	import NotationFields from '$lib/components/Drawer/NotationFields.svelte';
	import type { IngestedScore } from '$lib/shane/ingestion/ingest';
	import type { Vowel, CalibratedFormant, VoiceCharacteristics } from '$lib/shane/engine/types';
	// Engine connectivity check
	const engineReady = typeof transcribeWord === 'function';
	// Dictionary loading state
	let loaderState = $state<LoaderState>({
		isLoading: true,
		error: null,
		entryCount: 0,
		durationMs: 0,
		progress: 0
	});
	// Language
	let language = $state<Language>('en');
	let { data }: { data: { opened: OpenedLibrary | null } } = $props();

	// N.67 steps 0 and 1, the socket and the vault. The per-song state, all
	// seven pieces of it, lives on this object and no longer on this component:
	// the poem, the metadata and its provenance tags, the glosses and their
	// anchors, the open-syllabification choice, and the pairing map. The page
	// reads and writes `doc.<field>` and never touches storage again.
	//
	// LOADED BEFORE IT EXISTS, WHICH IS THE WHOLE POINT. `+page.ts`'s load
	// function opened the vault, ran the migration, and read the record before
	// this component existed, and the document is constructed FROM that result.
	// There is no interval in which an unrestored default could be saved over
	// real work, which is why `pairingsRestored` and its apology are gone
	// rather than moved.
	//
	// The `?? ` fallback covers the prerender pass only, where there is no
	// browser to read: it produces an empty in-memory song that is replaced the
	// moment a real load lands.
	// Read ONCE, on purpose, and said so with `untrack`: the document owns the
	// song for the life of this component, and rebuilding it when `data`
	// changed identity would throw away the singer's unsaved edits. Song
	// switching is `close()` then `open()`, at step 4, not a prop change.
	const opened = untrack(() => data.opened);
	const library = opened?.library ?? new Library(createMemoryDriver());
	const doc = SongDocument.fromLoaded(
		library,
		opened?.loaded ?? { record: emptySongRecord(LEGACY_SONG_ID, new Date().toISOString()) },
	);
	// Pipeline state
	let lines = $state<LineData[]>([]);
	let transcribeError = $state('');
	let transcribeMs = $state(0);
	let selectedWord = $state<WordStackData | null>(null);
	let lastFocusedWord = $state<{ line: number; word: number } | null>(null);
	// Drawer state
	let drawerCollapsed = $state(false);
	// N.43: Notation collapse. Deliberately NOT persisted: a remembered
	// collapse hides the toggles from a singer who forgot they exist.
	let notationExpanded = $state(true);
	// Tab state
	let activeTab = $state<TabId>('transcription');
	// Shane: the active voice's stored readings and name, published by the
	// wizard in the drawer (the workshop) so the main pane (the gallery,
	// the Voice Profile envelope) mirrors the voice the drawer is working
	// on. The wizard owns the profile store; this is a read-only reflection.
	let shaneFormants = $state<Partial<Record<Vowel, CalibratedFormant>>>({});
	let shaneVoiceName = $state<string | undefined>(undefined);
	let shaneCharacteristics = $state<VoiceCharacteristics | undefined>(undefined);
	// The most recently ingested score from the Fit uploader. Live wiring
	// (handover v35 §E.7) connects this into the renderer and analysis path.
	let ingestedScore = $state<IngestedScore | null>(null);
	// N.67 step 3: placements whose note the newly uploaded score does not
	// contain. Kept, reported, never dropped. Cleared by the next upload.
	let orphanedCount = $state(0);
	// N.55b: the N.55a courtesy notice's file name. The pairing map itself is
	// `doc.pairings` now, and the save still does not swallow its exception:
	// `doc.saveFailure` and `doc.loadFailure` carry the reason the whole song
	// save or load reported, and the drawer shows it exactly as before.
	// French ratified by Dann, 2026-08-14.
	let noLyricsFile = $state<string | null>(null);
	// The syllable the NEXT note click will place. Finale's insertion point.
	let pairingCursor = $state(0);
	const slotQueue = $derived(buildSlotQueue(lines));
	// N.55b: the pairing layer, wired. `reconcilePairings` (pairings.ts:318)
	// is the ONE rule for what counts as drift. A re-division moves consonants
	// within a word, so the nucleus the singer paired is still the same nucleus
	// and its text is refreshed. A re-transcription is a different decision and
	// stays drift, and R6 holds: the page prints what the singer decided.
	//
	// PROJECTED, NOT WRITTEN BACK. The refreshed map is derived from the live
	// queue on every render, so nothing derived is stored (CONTRACT s6) and
	// `pairings` stays the singer's own record. R5's `ilya:pairings` will save
	// the raw map, not this one.
	const reconciliation = $derived(reconcilePairings(doc.pairings, slotQueue));
	const shownPairings = $derived(reconciliation.map);
	const driftCount = $derived(reconciliation.drift.length);

	// N.55b Shift Lyrics (§8). Notes, in document order, one slot per note
	// until one side runs out — the SAME order `firstPass` consumes them in,
	// below. `shiftToEndOfLyric` / `shiftToNextOpenNote` (pairings.ts:558,
	// :592) index into this, not into `slotQueue`: they operate on notes
	// already carrying a decision, not on the syllable queue.
	const eventIds = $derived(
		ingestedScore ? ingestedScore.result.score.vocalLine.filter((ev) => ev.type !== 'rest').map((ev) => ev.id) : [],
	);

	// The anchor, confirmed with Dann 2026-08-14: not the cursor itself (it
	// indexes `slotQueue`, a different sequence), but the note that CURRENTLY
	// holds the pairing whose origin matches the cursor's slot. Read from
	// `pairings`, the singer's own record (R6), not `shownPairings`: a
	// reconciled/refreshed origin could match a slot that drifted away from
	// what the singer actually decided, and shifting from the wrong note
	// silently would be worse than the button doing nothing.
	function shiftAnchorEventId(): string | null {
		const slot = slotQueue[pairingCursor];
		if (!slot) return null;
		const o = slot.origin;
		for (const id of eventIds) {
			const p = doc.pairings[id];
			if (
				p &&
				p.kind === 'syllable' &&
				p.origin.lineIndex === o.lineIndex &&
				p.origin.wordIndex === o.wordIndex &&
				p.origin.slotIndex === o.slotIndex
			) {
				return id;
			}
		}
		return null;
	}
	const shiftDisabled = $derived(shiftAnchorEventId() === null);

	// Never silently dropped (`ShiftResult.displaced`, pairings.ts:474): a
	// displaced pairing's note returns to undecided and its syllable shows
	// unplaced again in the station, both already visible without a toast.
	// Nothing else consumes `displaced` yet; if that turns out not to be
	// enough, it is a UI decision layered on top of this, not a change here.
	function handleShift(scope: 'end' | 'nextOpen', direction: ShiftDirection): void {
		const anchor = shiftAnchorEventId();
		if (anchor === null) return;
		const fromIndex = eventIds.indexOf(anchor);
		if (fromIndex === -1) return;
		const result =
			scope === 'end'
				? shiftToEndOfLyric(doc.pairings, eventIds, fromIndex, direction)
				: shiftToNextOpenNote(doc.pairings, eventIds, fromIndex, direction);
		doc.pairings = result.map;
	}

	/**
	 * N.67 step 3, design §2.6. THE ONLY DESTRUCTIVE REBUILD, and it is the
	 * singer's own act, never a side effect of an upload.
	 *
	 * It runs the first pass again from scratch, exactly as an upload into an
	 * empty map does, so "start over" means the same thing here as it meant the
	 * first time. Disabled when there is nothing to start over from.
	 */
	function handleStartPlacementOver(): void {
		if (!ingestedScore) return;
		doc.pairings = firstPass(
			ingestedScore.result.score.vocalLine.filter((ev) => ev.type !== 'rest').map((ev) => ev.id),
			buildSlotQueue(lines),
		);
		orphanedCount = 0;
		pairingCursor = Math.min(Object.keys(doc.pairings).length, Math.max(0, slotQueue.length - 1));
	}

	function handleNotePick(eventId: string): void {
		const slot = slotQueue[pairingCursor];
		if (!slot) return;
		doc.pairings = {
			...doc.pairings,
			[eventId]: {
				kind: 'syllable',
				cyrillic: slot.cyrillic,
				ipa: slot.ipa,
				vowel: slot.vowel,
				origin: slot.origin,
			},
		};
		// Advance, and stop at the end rather than wrapping: a wrap would
		// silently start overwriting from the top.
		pairingCursor = Math.min(pairingCursor + 1, slotQueue.length - 1);
	}
	// Fit engraving geometry: the fixed stave target (Kimi Q2, 2026-07-15).
	// No user control; the Appendix-derived defaults are the product, and the
	// renderer reads them as a constant. Kept as state for VoiceProfilePane.
	let engraving = $state<EngravingValues>({ ...ENGRAVING_DEFAULTS });
	// Q3 wizard collapse (Kimi §A.28): successful-render counter and the
	// wizard's collapse state, both held here so they survive the shane
	// panel's unmount on tab switches. The pane reports a render once per
	// mount; renderCountedFor dedupes by score identity across remounts,
	// so returning to the Fit tab never re-collapses an expanded wizard.
	let scoreRenders = $state(0);
	let wizardCollapsed = $state(false);
	let renderCountedFor: IngestedScore | null = null;
	function handleScoreRendered() {
		if (!ingestedScore || renderCountedFor === ingestedScore) return;
		renderCountedFor = ingestedScore;
		scoreRenders += 1;
	}
	let updateDismissed = $state(false);
	// Active heading for TOC sync
	let activeHeadingId = $state<string | null>(null);
	// Tab transition animation
	// Fit (engine codename 'shane') sits adjacent to Transcription; the
	// slide-direction order matches the visible tab order (Dann, 2026-07-12).
	const TAB_ORDER: TabId[] = ['transcription', 'shane', 'learn', 'guide'];
	let tabTransitionClass = $state('');
	// Mobile awareness
	let isMobile = $state(false);
	let mobileDismissed = $state(false);
	let mainContentEl: HTMLElement | undefined = $state(undefined);
	async function handleMobileDismiss() {
		mobileDismissed = true;
		loadDictionary({
			onStateChange(state) {
				loaderState = state;
			}
		});
		await tick();
		if (mainContentEl) {
			// Centre the Paper's hint text area in the viewport.
			// Horizontal: centre the content area (96px margin + 624px/2 = 408px).
			// Vertical: hint text sits roughly 400px from page top (header + padding-top 6rem).
			const contentCentreX = 408;
			const hintAreaY = 400;
			const drawerLip = 24;
			const viewportWidth = window.innerWidth - drawerLip;
			const viewportHeight = window.innerHeight;
			const scrollX = Math.max(0, contentCentreX - viewportWidth / 2);
			const scrollY = Math.max(0, hintAreaY - viewportHeight / 2);
			mainContentEl.scrollTo({
				left: scrollX,
				top: scrollY,
				behavior: 'smooth',
			});
		}
	}
	// Song metadata: `doc.metadata`, N.67 step 0.
	// Notation preferences -- persisted to localStorage
	let notationPrefs = $state<NotationPreferences>({
		reducedVowel: false,
		shcha: false,
		palatalNasal: false,
		geminate: false,
		reconstitution: false,
	});
	// Display preferences
	let showStressDiacritics = $state(false);
	// The open-syllabification choice is `doc.openSyllabification`, N.67 step
	// 0. Its localStorage key is unchanged, and stays the default for new
	// songs when step 4 makes songs plural (design §2.2).
	// Spot reconstitution: ephemeral per-word overrides, keyed by "lineIndex-wordIndex"
	// Cleared on every transcribe or clear action
	let spotReconstitution = $state<Map<string, boolean>>(new Map());
	// User stress overrides: keyed by "lineIndex-wordIndex"
	// Cleared on every fresh transcription
	let userStressOverrides = $state<Map<string, UserStressOverride>>(new Map());
	// Character-level ё toggles: keyed by "lineIndex-wordIndex-charIndex"
	// Cleared on every fresh transcription
	let yoToggles = $state<Map<string, YoToggle>>(new Map());
	// Per-word syllable boundary overrides: keyed by "lineIndex-wordIndex"
	// Cleared when the global open syllabification toggle changes in either direction,
	// and on every fresh transcription or clear action.
	let syllableOverrides = $state<Map<string, SyllableOverride>>(new Map());
	// Per-word gloss overrides are `doc.glossOverrides`, keyed by
	// "lineIndex-wordIndex", cleared on every fresh transcription or clear
	// action, and by per-word reset.
	//
	// N.57: `doc.glossAnchors` holds the Cyrillic word each gloss was written
	// for, same keys. A gloss survives a re-transcription only where that word
	// is still at that position; otherwise it falls away rather than
	// re-attaching to whatever moved into the slot.
	// Breath animation state
	// paperBreathClass: animates Paper content only (transcription trigger)
	// viewBreathClass: animates entire app content (language toggle)
	let paperBreathClass = $state('');
	let viewBreathClass = $state('');
	function triggerPaperBreathIn() {
		paperBreathClass = 'breath-in';
		setTimeout(() => { paperBreathClass = ''; }, 300);
	}
	function triggerViewBreathCycle(callback: () => void) {
		viewBreathClass = 'breath-out';
		setTimeout(() => {
			callback();
			viewBreathClass = 'breath-in';
			setTimeout(() => { viewBreathClass = ''; }, 300);
		}, 150);
	}
	// ── Dynamic drawer width: pure calculation from ribbon content ──
	// Atoms are fixed 32px. Gaps, borders, and padding are constants.
	// Width is computed before render (no DOM measurement, no flicker).
	function calculateDrawerWidth(word: WordStackData): number {
		const ATOM_W = 32;
		const ATOM_GAP = 2;
		const MOL_PAD_BORDER = 9; // 3px padding × 2 + 1.5px border × 2
		const SYLLABLE_GAP = 12;
		const CLITIC_COL_W = ATOM_W + MOL_PAD_BORDER; // 41px
		const OVERHEAD = 70; // 32px panel padding + 24px lip + borders/scrollbar
		// Count atoms per syllable from displayLog
		const syllableAtomCounts = new Map<number, number>();
		for (const entry of word.displayLog) {
			const si = entry.syllableIndex ?? 0;
			syllableAtomCounts.set(si, (syllableAtomCounts.get(si) ?? 0) + 1);
		}
		let ribbonWidth = 0;
		const syllableCount = syllableAtomCounts.size;
		// Sum molecule widths
		for (const [, atomCount] of syllableAtomCounts) {
			ribbonWidth += atomCount * ATOM_W + (atomCount - 1) * ATOM_GAP + MOL_PAD_BORDER;
		}
		// Gaps between syllable columns
		if (syllableCount > 1) {
			ribbonWidth += (syllableCount - 1) * SYLLABLE_GAP;
		}
		// Clitic arrow columns (standalone, outside molecules)
		if (word.isProclitic) ribbonWidth += CLITIC_COL_W + SYLLABLE_GAP;
		if (word.isEnclitic) ribbonWidth += CLITIC_COL_W + SYLLABLE_GAP;
		return Math.max(520, Math.min(720, ribbonWidth + OVERHEAD));
	}
	// Derived
	const showInspector = $derived(selectedWord !== null);
	// Reading mode means the long-form reading tabs. Shane is a
	// paper-on-desk gallery like Transcription (Dann's consistency ruling,
	// 2026-07-12): its page sits exactly where the transcription page
	// sits, sharing the full 2rem desk padding rather than reading mode's
	// trimmed 1rem.
	const isReadingMode = $derived(activeTab === 'learn' || activeTab === 'guide');
	const drawerWidth = $derived(
		activeTab === 'transcription'
			? (selectedWord ? calculateDrawerWidth(selectedWord) : 520)
			: 520
	);
	const canTranscribe = $derived(
		doc.inputText.trim().length > 0 && !loaderState.isLoading && loaderState.entryCount > 0
	);
	const hasResults = $derived(lines.length > 0);
	const wordCount = $derived(
		lines.reduce((sum, l) => sum + l.words.length, 0)
	);
	// Apply open syllabification as a display-time transform (no pipeline re-run).
	// Per-word syllable overrides take precedence when present.
	const effectiveLines = $derived.by(() => {
		if (doc.openSyllabification || syllableOverrides.size > 0) {
			return applyOpenSyllabificationToLines(lines, syllableOverrides, doc.openSyllabification);
		}
		return lines;
	});
	function runPipeline() {
		transcribeError = '';
		try {
			const start = performance.now();
			const result = processText(doc.inputText, {
				language,
				userStressOverrides: userStressOverrides.size > 0 ? userStressOverrides : undefined,
				yoToggles: yoToggles.size > 0 ? yoToggles : undefined,
			});
			transcribeMs = Math.round(performance.now() - start);
			lines = result;
			// Update selected word to reflect new pipeline results
			if (selectedWord) {
				const newWord = result[selectedWord.lineIndex]?.words?.[selectedWord.wordIndex];
				if (newWord) selectedWord = newWord;
			}
		} catch (e: unknown) {
			transcribeError = e instanceof Error ? e.message : String(e);
			console.error('[Ilya] Transcription error:', e);
		}
	}
	function handleTranscribe() {
		if (!canTranscribe) return;
		transcribeError = '';
		selectedWord = null;
		lastFocusedWord = null;
		spotReconstitution = new Map();
		userStressOverrides = new Map();
		yoToggles = new Map();
		syllableOverrides = new Map();
		// N.57: glosses are deliberately NOT wiped here. runPipeline() rebuilds
		// `lines`, then keepSurvivingGlosses() drops only the ones whose word
		// moved. The Guide has promised this since before it was true.
		runPipeline();
		keepSurvivingGlosses();
		if (lines.length > 0) {
			// Breath animation: content appears with breath-in
			triggerPaperBreathIn();
			// Console output for verification
			console.group('[Ilya] Transcription result');
			lines.forEach((line, li) => {
				console.group(`Line ${li}`);
				line.words.forEach((w) => {
					console.log(
						`${w.cleanWord} → ${w.ipaDisplay}`,
						{
							stress: w.stressIndex,
							source: w.stressSource,
							boundary: w.rightBoundary,
							proclitic: w.isProclitic,
							enclitic: w.isEnclitic,
							gloss: w.gloss,
						}
					);
				});
				console.groupEnd();
			});
			console.groupEnd();
			// Focus first WordStack after render
			requestAnimationFrame(() => {
				const first = document.querySelector<HTMLElement>('[data-word-index="0-0"]');
				first?.focus();
			});
		}
	}
	function handleClear() {
		doc.inputText = '';
		lines = [];
		transcribeError = '';
		transcribeMs = 0;
		selectedWord = null;
		lastFocusedWord = null;
		spotReconstitution = new Map();
		userStressOverrides = new Map();
		yoToggles = new Map();
		syllableOverrides = new Map();
		doc.glossOverrides = new Map();
		doc.glossAnchors = new Map();
		// The document writes the cleared poem and the cleared glosses itself.
		// Clearing used to REMOVE the gloss key and write an empty poem; it now
		// writes an empty list and an empty poem, which restores identically.
	}
	function handlePrint() {
		window.print();
	}
	function handleWordClick(word: WordStackData) {
		selectedWord = word;
		lastFocusedWord = { line: word.lineIndex, word: word.wordIndex };
		// Auto-expand drawer if collapsed when user clicks a word
		if (drawerCollapsed) {
			drawerCollapsed = false;
		}
		// Switch to Transcription tab if clicking a word from another tab
		if (activeTab !== 'transcription') {
			activeTab = 'transcription';
			try {
				localStorage.setItem('ilya:activeTab', 'transcription');
			} catch {
				// localStorage unavailable
			}
		}
		console.log('[Ilya] Selected:', word.cleanWord, word.ipaDisplay, {
			stress: word.stressIndex,
			source: word.stressSource,
			gloss: word.gloss,
			displayLog: word.displayLog,
		});
	}
	function handleNotationChange(prefs: NotationPreferences) {
		notationPrefs = prefs;
		try {
			localStorage.setItem('ilya:notationPrefs', JSON.stringify(prefs));
		} catch {
			// localStorage unavailable (private browsing)
		}
	}
	function handleStressDiacriticsChange(value: boolean) {
		showStressDiacritics = value;
		try {
			localStorage.setItem('ilya:showStressDiacritics', JSON.stringify(value));
		} catch {
			// localStorage unavailable
		}
	}
	function handleOpenSyllabificationChange(value: boolean) {
		doc.openSyllabification = value;
		// Spec requirement: toggling global in either direction clears all per-word overrides
		syllableOverrides = new Map();
	}
	// Toggle spot reconstitution for the currently selected word
	function handleSpotReconToggle() {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		const newMap = new Map(spotReconstitution);
		if (newMap.has(key)) {
			newMap.delete(key);
		} else {
			newMap.set(key, true);
		}
		spotReconstitution = newMap;
	}
	// ── Stress assignment handler ────────────────────────────────
	function handleStressAssign(syllableIndex: number, source: string) {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		const existingOverride = userStressOverrides.get(key);
		const isClitic = selectedWord.isProclitic || selectedWord.isEnclitic || existingOverride?.promotedFromClitic;
		const newMap = new Map(userStressOverrides);
		newMap.set(key, {
			stressIndex: syllableIndex,
			stressSource: source as UserStressOverride['stressSource'],
			...(isClitic ? { promotedFromClitic: true } : {}),
		});
		userStressOverrides = newMap;
		runPipeline();
	}
	// ── Stress revert handler ────────────────────────────────────
	function handleStressRevert() {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		const newMap = new Map(userStressOverrides);
		newMap.delete(key);
		userStressOverrides = newMap;
		runPipeline();
	}
	// ── Character-level ё toggle handler ─────────────────────────
	function handleYoCharToggle(charIndex: number, source: string | null) {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}-${charIndex}`;
		const newMap = new Map(yoToggles);
		if (source === null) {
			// Revert: remove the toggle
			newMap.delete(key);
		} else {
			newMap.set(key, { source: source as YoToggle['source'] });
		}
		yoToggles = newMap;
		runPipeline();
	}
	// ── Per-word syllable override handler ────────────────────────
	function handleSyllableOverride(lineIndex: number, wordIndex: number, override: SyllableOverride) {
		const key = `${lineIndex}-${wordIndex}`;
		const newMap = new Map(syllableOverrides);
		newMap.set(key, override);
		syllableOverrides = newMap;
	}
	// ── Per-word syllable override removal ────────────────────────
	function handleSyllableOverrideClear(lineIndex: number, wordIndex: number) {
		const key = `${lineIndex}-${wordIndex}`;
		const newMap = new Map(syllableOverrides);
		newMap.delete(key);
		syllableOverrides = newMap;
	}
	// ── Per-word gloss override handler ───────────────────────────
	function handleGlossOverride(gloss: string | null) {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		const newMap = new Map(doc.glossOverrides);
		const newAnchors = new Map(doc.glossAnchors);
		if (gloss === null) {
			newMap.delete(key);
			newAnchors.delete(key);
		} else {
			newMap.set(key, gloss);
			newAnchors.set(key, selectedWord.cleanWord);
		}
		doc.glossOverrides = newMap;
		doc.glossAnchors = newAnchors;
	}
	// ---- N.57: gloss persistence and the survival guard -------------
	//
	// The comparison is lowercased and yo-folded, because the dictionary is
	// keyed by lowercase word form (curated-glosses.ts) and a yo toggle
	// re-spells a word without making it a different word.
	function glossAnchorForm(word: string): string {
		return word.toLowerCase().replace(/\u0451/g, '\u0435');
	}
	// The gloss rows are assembled and written by the library now
	// (`library.ts`, `recordFromFields`), in the same shape and under the same
	// key. `persistGlosses()` is gone: assigning the maps is the save.
	function keepSurvivingGlosses() {
		const nextGloss = new Map<string, string>();
		const nextAnchor = new Map<string, string>();
		for (const [key, gloss] of doc.glossOverrides) {
			const anchor = doc.glossAnchors.get(key);
			if (!anchor) continue;
			const [lineIdx, wordIdx] = key.split('-').map(Number);
			const word = lines[lineIdx]?.words?.[wordIdx];
			if (word && glossAnchorForm(word.cleanWord) === glossAnchorForm(anchor)) {
				nextGloss.set(key, gloss);
				nextAnchor.set(key, anchor);
			}
		}
		doc.glossOverrides = nextGloss;
		doc.glossAnchors = nextAnchor;
	}
	// ── Per-word reset: clear all overrides for the selected word ──
	function handleReset() {
		if (!selectedWord) return;
		const wordKey = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		let needsPipeline = false;
		// Clear stress override
		if (userStressOverrides.has(wordKey)) {
			const newStress = new Map(userStressOverrides);
			newStress.delete(wordKey);
			userStressOverrides = newStress;
			needsPipeline = true;
		}
		// Clear ё toggles for this word (keys are "lineIndex-wordIndex-charIndex")
		const yoPrefix = `${wordKey}-`;
		const hasYoToggles = [...yoToggles.keys()].some(k => k.startsWith(yoPrefix));
		if (hasYoToggles) {
			const newYo = new Map(yoToggles);
			for (const k of [...newYo.keys()]) {
				if (k.startsWith(yoPrefix)) newYo.delete(k);
			}
			yoToggles = newYo;
			needsPipeline = true;
		}
		// Clear syllable override
		if (syllableOverrides.has(wordKey)) {
			const newSyll = new Map(syllableOverrides);
			newSyll.delete(wordKey);
			syllableOverrides = newSyll;
		}
		// Clear spot reconstitution
		if (spotReconstitution.has(wordKey)) {
			const newSpot = new Map(spotReconstitution);
			newSpot.delete(wordKey);
			spotReconstitution = newSpot;
		}
		// Clear gloss override
		if (doc.glossOverrides.has(wordKey)) {
			const newGloss = new Map(doc.glossOverrides);
			newGloss.delete(wordKey);
			doc.glossOverrides = newGloss;
			const newAnchors = new Map(doc.glossAnchors);
			newAnchors.delete(wordKey);
			doc.glossAnchors = newAnchors;
		}
		if (needsPipeline) runPipeline();
	}
	function handleInput(text: string) {
		doc.inputText = text;
	}

	/* ── N.67 step 2: the source survives ──────────────────────────── */

	// The stored score, handed to the uploader so it can re-ingest it once at
	// boot. Read from the load result, not from the document: the document
	// carries the score's provenance, never its bytes.
	const restoreSource = opened?.source
		? { fileName: opened.source.fileName, bytes: opened.source.bytes }
		: null;

	/**
	 * Keep the singer's own file, byte for byte.
	 *
	 * Two hashes, doing two different jobs (design §2.3, §2.4): `contentHash`
	 * names these exact bytes and can never go stale, and `fingerprint` answers
	 * "have I met this music before" for the recognition prompt step 4 builds.
	 * Neither is identity; the song id is.
	 */
	async function attachUploadedSource(ingested: IngestedScore, file: File): Promise<void> {
		const bytes = await file.arrayBuffer();
		// THE HASHES ARE BEST EFFORT; THE BYTES ARE NOT. `crypto.subtle` is
		// absent outside a secure context, and losing it must cost recognition
		// (a step 4 convenience) and never the singer's file. An empty hash is
		// honestly empty and recomputable at any time from the stored bytes.
		let contentHash = '';
		let fingerprint = '';
		try {
			[contentHash, fingerprint] = await Promise.all([
				hashBytes(bytes),
				fingerprintVocalLine(ingested.result.score.vocalLine),
			]);
		} catch (err) {
			console.error('[Ilya] score kept, but it could not be hashed:', err);
		}
		const importedAt = new Date().toISOString();
		doc.attachSource(
			{ songId: doc.id, fileName: ingested.fileName, bytes, byteLength: bytes.byteLength, contentHash, importedAt },
			{ fileName: ingested.fileName, byteLength: bytes.byteLength, importedAt, contentHash, fingerprint },
		);
	}
	function handleLanguageChange(lang: Language) {
		const doSwap = () => {
			language = lang;
			try {
				localStorage.setItem('ilya:language', lang);
			} catch {
				// localStorage unavailable
			}
			// Re-run pipeline to update glosses in the new language
			if (hasResults && doc.inputText.trim().length > 0) {
				runPipeline();
			}
		};
		// If there's content visible, use breath cycle; otherwise swap immediately
		if (hasResults) {
			triggerViewBreathCycle(doSwap);
		} else {
			doSwap();
		}
	}
	function handleMetadataChange(meta: SongMetadata) {
		// A "from score" tag fades on the field's first edit (Kimi's Q1
		// refinement, 2026-07-13). The callers below set the tags AFTER
		// calling this, so their own writes do not clear them.
		const kept = dropTagsForEdits(doc.metadata, meta, doc.fromScoreFields);
		if (kept !== doc.fromScoreFields) setFromScoreFields(kept);
		doc.metadata = meta;
	}

	// ── §A.6 metadata provenance ──
	// The transitions live in $lib/metadata-provenance, where vitest can
	// reach them; the document holds the state and the library persists it.
	// Kimi's rulings, 2026-07-13, on filling blanks and fading a tag on a
	// hand edit; Dann's ruling, 2026-08-04, on what a second score does to
	// the first score's identity.
	//
	// The tags are persisted beside the values, in the same record now, so
	// the provenance can no longer come back without its values or the values
	// without their provenance.
	function setFromScoreFields(next: ReadonlySet<MetadataField>) {
		doc.fromScoreFields = next;
	}

	function commitMetadataState(next: MetadataState) {
		handleMetadataChange(next.metadata);
		setFromScoreFields(next.fromScore);
	}

	// Kimi's Q2 safety net: restore the header's fields verbatim (fields
	// the header does not carry are left untouched).
	function handleRevertToScoreHeader() {
		const wm = ingestedScore?.result.score.workMetadata;
		if (!wm) return;
		commitMetadataState(revertToScoreHeader({ metadata: doc.metadata, fromScore: doc.fromScoreFields }, wm));
	}

	// Q4 provenance line (Kimi's §A.28 ruling, 2026-07-13): an arranger
	// detected in the score header surfaces as a small line beneath the
	// Metadata block — never a drawer field — and is omitted entirely when
	// absent. The format label names where it was detected; in practice
	// only MusicXML-parsed scores can carry one (MNX defines no work
	// metadata anywhere, v38 §A.27).
	const PROVENANCE_FORMAT_LABELS: Record<IngestedScore['provenance']['format'], string> = {
		musicxml: 'MusicXML',
		mnx: 'MNX'
	};
	let arrangerProvenance = $derived.by(() => {
		const s = ingestedScore;
		const name = s?.result.score.workMetadata?.arranger;
		if (!s || !name) return null;
		return `${t('meta.arrAbbr', language)} ${name} · ${t('meta.detectedFrom', language)} ${PROVENANCE_FORMAT_LABELS[s.provenance.format]}`;
	});
	function handleDrawerToggle() {
		drawerCollapsed = !drawerCollapsed;
		try {
			localStorage.setItem('ilya:drawerCollapsed', JSON.stringify(drawerCollapsed));
		} catch {
			// localStorage unavailable
		}
	}
	function handleTabChange(tab: TabId) {
		const oldIndex = TAB_ORDER.indexOf(activeTab);
		const newIndex = TAB_ORDER.indexOf(tab);
		// Compute direction: moving right in tab order → content enters from right
		const direction = newIndex > oldIndex ? 'tab-enter-from-right' : 'tab-enter-from-left';
		activeTab = tab;
		tabTransitionClass = direction;
		try {
			localStorage.setItem('ilya:activeTab', tab);
		} catch {
			// localStorage unavailable
		}
		// Clear animation class after it completes (175ms + buffer)
		setTimeout(() => {
			tabTransitionClass = '';
		}, 200);
	}

	/* ── Heading navigation from Drawer TOC ────────────────── */

	/**
	 * Scroll a lazily-rendered anchor to the top of the reading pane,
	 * robust against post-scroll reflow. LearnContent/GuideContent fire
	 * their ready signal in onMount, before the web fonts swap in and the
	 * large glyph table settles, so a one-shot scrollIntoView undershoots:
	 * the target moves down after the scroll has already landed. This
	 * retries until the element exists, scrolls once, then re-snaps to the
	 * target after the fonts are ready and across a short settle window,
	 * correcting for that late reflow. Caught by Dann's sung-[o] deep link
	 * landing at the Section 3 head instead of the note (2026-07-12).
	 */
	function scrollToAnchor(id: string, smoothFirst = true) {
		let attempts = 0;
		const snap = (behavior: ScrollBehavior) =>
			document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
		const find = () => {
			if (!document.getElementById(id)) {
				if (attempts++ < 90) requestAnimationFrame(find);
				return;
			}
			snap(smoothFirst ? 'smooth' : 'auto');
			// Corrective re-snaps: font swap and late layout shift the
			// target after the first scroll. Instant, so they only close
			// the residual gap rather than re-animating.
			[120, 300, 600].forEach((ms) => setTimeout(() => snap('auto'), ms));
			if (typeof document !== 'undefined' && 'fonts' in document) {
				document.fonts.ready.then(() => snap('auto')).catch(() => {});
			}
		};
		find();
	}

	function handleHeadingNavigate(id: string) {
		activeHeadingId = id;
		history.pushState(null, '', `#${id}`);
		scrollToAnchor(id);
	}

	/* ── Lazy reading content: readiness signal ──────────── */

	let readingContentEpoch = $state(0);

	function handleReadingContentReady() {
		readingContentEpoch++;
		handleHashNavigation();
	}

	/* ── N.40: mirror the language state onto <html lang> ────
	   app.html:2 hardcodes lang="en" and nothing ever wrote the
	   attribute afterwards, so a screen reader announced every French
	   string with English pronunciation rules. It also governs
	   hyphenation and quote rendering.

	   This tracks `language` itself rather than its three writers (the
	   initialiser, handleLanguageChange, and the onMount restore), so
	   no path can miss it.

	   RESIDUAL, stated rather than hidden: the served document is
	   lang="en" until hydration, because the language is restored from
	   localStorage on the client and the server cannot know it. */
	$effect(() => {
		document.documentElement.lang = language;
	});

	/* ── IntersectionObserver for scroll-based active heading ─ */

	$effect(() => {
		void readingContentEpoch; // re-run when lazy reading content mounts
		if (activeTab !== 'learn' && activeTab !== 'guide') return;
		if (!mainContentEl) return;

		// Collect all heading elements with ids inside main-content
		const headings = mainContentEl.querySelectorAll('[id^="learn-"], [id^="guide-"]');
		if (headings.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				// Find the topmost intersecting heading
				const visible = entries
					.filter(e => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible.length > 0) {
					activeHeadingId = visible[0].target.id;
				}
			},
			{
				root: mainContentEl,
				rootMargin: '-25% 0px -60% 0px',
				threshold: 0,
			}
		);

		headings.forEach(h => observer.observe(h));
		return () => observer.disconnect();
	});

	/* ── Handle URL hash on page load ──────────────────────── */

	function handleHashNavigation() {
		const hash = window.location.hash.slice(1);
		if (hash) {
			activeHeadingId = hash;
			scrollToAnchor(hash);
		}
	}
	onMount(() => {
		// N.67 step 1. The first reading of `navigator.storage.estimate()` this
		// project has ever taken: it had never been called anywhere in the tree
		// before this step. Logged rather than drawn, because the storage COPY
		// is step 6's work and inventing a surface for it now would be building
		// ahead of the design. Matches the house console style at
		// `handleWordClick`.
		if (opened) {
			console.log('[Ilya] storage', {
				driver: opened.driverKind,
				songId: opened.songId,
				migration: opened.migration.kind,
				usage: opened.storage.usage !== undefined ? formatBytes(opened.storage.usage) : 'not reported',
				quota: opened.storage.quota !== undefined ? formatBytes(opened.storage.quota) : 'not reported',
				persisted: opened.storage.persisted,
				vaultError: opened.vaultError,
			});
		}
		// Restore persisted state.
		//
		// N.67 step 0: the six per-song keys are NOT read here any more. The
		// document read them before this component rendered, which is why the
		// pairings guard flag could be deleted rather than moved. What is left
		// in this block is the device preferences, which are not a song and do
		// not move (design §2.2).
		try {
			const savedLang = localStorage.getItem('ilya:language');
			if (savedLang === 'en' || savedLang === 'fr') {
				language = savedLang;
			}
			const savedPrefs = localStorage.getItem('ilya:notationPrefs');
			if (savedPrefs) {
				const parsed = JSON.parse(savedPrefs);
				notationPrefs = { ...notationPrefs, ...parsed };
			}
			const savedDiacritics = localStorage.getItem('ilya:showStressDiacritics');
			if (savedDiacritics) {
				showStressDiacritics = JSON.parse(savedDiacritics);
			}
			const savedCollapsed = localStorage.getItem('ilya:drawerCollapsed');
			if (savedCollapsed) {
				drawerCollapsed = JSON.parse(savedCollapsed);
			}
			const savedTab = localStorage.getItem('ilya:activeTab');
			if (savedTab === 'transcription' || savedTab === 'learn' || savedTab === 'guide' || (savedTab === 'shane' && INCLUDE_SHANE)) {
				activeTab = savedTab;
			}
		} catch {
			// localStorage unavailable
		}
		// N.57's note, kept because it still governs: keepSurvivingGlosses() is
		// deliberately NOT called at boot. The pipeline has not run, so `lines`
		// is empty and the guard would drop every gloss. It runs on the next
		// Transcribe, which is also the first moment the glosses can be seen.
		loadDictionary({
			onStateChange(state) {
				loaderState = state;
			}
		});
		// Mobile detection
		function checkMobile() {
			isMobile = window.innerWidth < 768;
		}
		checkMobile();
		window.addEventListener('resize', checkMobile);
		// On mobile, default drawer to collapsed unless user has a saved preference
		if (isMobile) {
			try {
				if (!localStorage.getItem('ilya:drawerCollapsed')) {
					drawerCollapsed = true;
				}
			} catch {
				drawerCollapsed = true;
			}
		}
		handleHashNavigation();
		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;1,400&family=Noto+Serif:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
</svelte:head>
{#if isMobile && !mobileDismissed}
<div class="mobile-overlay">
	<div class="mobile-card">
		<div class="mobile-logo">
			<span class="logo-bracket">[</span><span class="logo-ilya">Ilya</span><span class="logo-bracket">]</span>
		</div>
		<h1 class="mobile-heading">{t('mobile.heading', 'en')}</h1>
		<p class="mobile-body">{t('mobile.body', 'en')}</p>
		<button class="mobile-continue" onclick={handleMobileDismiss}>
			{t('mobile.continue', 'en')} / {t('mobile.continue', 'fr')}
		</button>
		<div class="mobile-divider"></div>
		<h1 class="mobile-heading">{t('mobile.heading', 'fr')}</h1>
		<p class="mobile-body">{t('mobile.body', 'fr')}</p>
	</div>
</div>
{/if}
<div class="screen-only">
	<HeaderBar {language} {activeTab} onlanguagechange={handleLanguageChange} />
<InstallPrompt {language} />
</div>
<div class="app-content {viewBreathClass}">
	<Drawer
		width={drawerWidth}
		collapsed={drawerCollapsed}
		{isMobile}
		{language}
		{activeTab}
		{activeHeadingId}
		{tabTransitionClass}
		ontogglecollapse={handleDrawerToggle}
		ontabchange={handleTabChange}
		onheadingnavigate={handleHeadingNavigate}
	>
			{#snippet rootPanel()}
				<RootPanel
					inputText={doc.inputText}
					{loaderState}
					{canTranscribe}
					{hasResults}
					{wordCount}
					{transcribeMs}
					{transcribeError}
					{language}
					metadata={doc.metadata}
					{showInspector}
					oninput={handleInput}
					ontranscribe={handleTranscribe}
					onclear={handleClear}
					onprint={handlePrint}
					onmetadatachange={handleMetadataChange}
				>
					{#snippet consoleContent()}
						{#if selectedWord}
							{@const wordKey = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`}
							{@const wordYoToggles = (() => {
								const prefix = `${wordKey}-`;
								const m = new Map<number, import('$lib/types').YoToggle>();
								for (const [k, v] of yoToggles) {
									if (k.startsWith(prefix)) {
										const ci = parseInt(k.substring(prefix.length), 10);
										if (!isNaN(ci)) m.set(ci, v);
									}
								}
								return m;
							})()}
							<InspectorPanel
								word={selectedWord}
								{language}
								{notationPrefs}
								openSyllabification={doc.openSyllabification}
								{showStressDiacritics}
								syllableOverride={syllableOverrides.get(wordKey) ?? null}
								spotReconstituted={spotReconstitution.has(wordKey)}
								promotedFromClitic={userStressOverrides.get(wordKey)?.promotedFromClitic ?? false}
								yoCharToggles={wordYoToggles}
								onspotrecontoggle={handleSpotReconToggle}
								onstressassign={handleStressAssign}
								onstressrevert={handleStressRevert}
								onyochartoggle={handleYoCharToggle}
								onsyllableoverride={(override) => handleSyllableOverride(selectedWord!.lineIndex, selectedWord!.wordIndex, override)}
								onsyllableoverrideclear={() => handleSyllableOverrideClear(selectedWord!.lineIndex, selectedWord!.wordIndex)}
								onreset={handleReset}
								glossOverride={doc.glossOverrides.get(wordKey)}
								onglossoverride={handleGlossOverride}
							/>
						{/if}
					{/snippet}
				</RootPanel>
			{/snippet}
			{#snippet shanePanel()}
				{#if INCLUDE_SHANE}
					<!-- One shared column, identical to the Transcription drawer's
					     .root-panel (20px top, 1rem sides, 40px bottom, 6px gaps),
					     so both drawers read as one surface. -->
					<div class="shane-panel">
						<!-- Shared chrome: same Metadata block as Transcription, one
						     source of truth (Kimi placement ruling). -->
						<MetadataFields
							metadata={doc.metadata}
							{language}
							onchange={handleMetadataChange}
							fromScore={doc.fromScoreFields}
							onrevert={ingestedScore?.result.score.workMetadata ? handleRevertToScoreHeader : undefined}
						/>
						{#if arrangerProvenance}
							<!-- Q4 provenance line (Kimi §A.28): beneath the Metadata
							     block, never a drawer field, omitted when absent.
							     Clamped to one line (Dann's ruling, 2026-07-13, on the
							     Gretchen IMSLP-blob evidence): verbatim, never parsed,
							     but the drawer stays quiet; title carries the full
							     string on hover. -->
							<p class="shane-provenance" title={arrangerProvenance}>{arrangerProvenance}</p>
						{/if}
					<!-- The drop surface sits full-width directly beneath the
					     Metadata block, twinning Ilya's headerless textarea. The
					     EngravingControls panel is removed and the stave target
					     is fixed (Dann's ruling, 2026-07-15; Kimi Q1 and Q2). -->
					<ScoreUploader
						{language}
						{isMobile}
						restore={restoreSource}
						oningested={(ingested, file, origin) => {
							// N.67 step 2. The singer's own bytes go down with the song,
							// in one transaction, so a reload brings the score back. Only
							// a real upload writes: a restore's bytes came from the vault.
							if (origin === 'upload') void attachUploadedSource(ingested, file);
							// Live-wired (§E.7 slice 1): VoiceProfilePane renders this
							// as paginated notation in the Fit main pane.
							ingestedScore = ingested;
							// N.55b R3: the first pass runs on accept, and the N.55a courtesy
							// message arrives in the same moment or it has no moment at all.
							//
							// It runs ONLY where the file carried no lyrics. Where the score has
							// an underlay, Ilya READS it (`vowel-resolver.ts`), and proposing over
							// it would be Ilya claiming where the score already speaks. That is an
							// INFERENCE from R3 and N.55a together, not a ruling of Dann's.
							const noLyrics = ingested.result.warnings.some((w) => w.code === 'no-lyrics-found');
							noLyricsFile = noLyrics ? ingested.fileName : null;
							// N.67 step 3, design §2.6. THE MERGE RULE, and where N.68
							// closes: an upload never destroys placements; only the
							// singer does, on purpose, with Start placement over below.
							//
							// This line used to replace the map unconditionally, so
							// re-uploading rebuilt over the singer's decisions and a
							// score WITH lyrics erased them outright. Now the first pass
							// runs only into an EMPTY map, which keeps N.55a's behaviour
							// on the genuinely fresh path: one slot per note, in document
							// order, rests skipped because they have no hit target
							// (`staff-renderer.ts:920-928`) and can never be clicked.
							const merged = mergeOnUpload(
								doc.pairings,
								ingested.result.score.vocalLine.filter((ev) => ev.type !== 'rest').map((ev) => ev.id),
								buildSlotQueue(lines),
								noLyrics,
							);
							doc.pairings = merged.map;
							// Kept, never dropped, and reported as a count.
							orphanedCount = merged.orphaned.length;
							// The cursor lands on the first syllable the pass did not
							// reach. Only moved where the pass actually ran: a re-upload
							// must not walk the singer's insertion point back.
							if (merged.proposed) {
								pairingCursor = Math.min(Object.keys(doc.pairings).length, Math.max(0, slotQueue.length - 1));
							}
							// A new score arrives: clear whatever the previous score
							// filled, then fill the blanks from this score's header
							// if it carries one. A score with no header still
							// clears, and that case is the whole point: at E.23,
							// Musorgsky's Sunless 1 rendered under the Schubert's
							// title, composer, and poet, because a header-less score
							// reached no code that touched metadata at all.
							commitMetadataState(
								onScoreIngested(
									{ metadata: doc.metadata, fromScore: doc.fromScoreFields },
									ingested.result.score.workMetadata,
								),
							);
						}}
					/>
					{#if noLyricsFile}
						<!-- N.55a's courtesy message (Dann, E.47). It lives in the DRAWER and
						     not on the page because it names the FILE, and a file name dates a
						     printed study sheet to an export rather than to a song. Unstyled on
						     purpose for the first walk. -->
						<p class="shane-no-lyrics">{t('upload.banner.noLyrics', language).replace('%s', noLyricsFile)}</p>
					{/if}
					<SyllableStation
						slots={slotQueue}
						pairings={shownPairings}
						drift={driftCount}
						cursor={pairingCursor}
						{language}
						oncursor={(i) => (pairingCursor = i)}
					/>
					<ShiftLyricsControl {language} disabled={shiftDisabled} onshift={handleShift} />
					{#if orphanedCount > 0}
						<!-- N.67 step 3. Reported, not acted on: the placements are
						     KEPT and this only says how many have no note to sit on in
						     the score just uploaded. Twins the drift surface in
						     restraint, and unstyled on purpose like its neighbours. -->
						<p class="shane-storage-notice">
							{t('station.orphaned', language).replace('%s', String(orphanedCount))}
						</p>
					{/if}
					{#if slotQueue.length > 0 && ingestedScore}
						<!-- N.67 step 3, design §2.6. The ONLY thing that may destroy a
						     placement, and it is the singer pressing it. An upload never
						     rebuilds. Placed after Shift Lyrics because it undoes what
						     Shift Lyrics does, and it is the last resort of the two. -->
						<button type="button" class="start-over" onclick={handleStartPlacementOver}>
							{t('station.startOver', language)}
						</button>
					{/if}
					{#if doc.saveFailure}
						<!-- R5, N.27: the save does not swallow its exception. Unstyled
						     on purpose, matching 'shane-no-lyrics' below. N.67 step 0:
						     this now reports the WHOLE song's save, not the pairing
						     map's alone, so the five sites that used to fail in silence
						     (the poem, the metadata, its tags, the glosses, and the
						     syllabification choice) report here too. Same two strings. -->
						<p class="shane-storage-notice">
							{t(doc.saveFailure === 'quota-exceeded' ? 'storage.saveFailed.quota' : 'storage.saveFailed.generic', language)}
						</p>
					{:else if doc.loadFailure}
						<p class="shane-storage-notice">{t('storage.loadFailed', language)}</p>
					{/if}
					{#if doc.remoteChange}
						<!-- N.67 step 1, socket §4.1. Last-write-wins WITH the notice.
						     A clean tab reloads silently and never reaches here; this
						     is only the tab that had unsaved work, and its work is
						     kept. Placed beside the storage notice because that is
						     where storage speaks today. -->
						<p class="shane-storage-notice">{t('storage.otherTab', language)}</p>
					{/if}
					<!-- The Fit print control (item 1.8). TWINNED, not invented, and
					     twinned in POSITION as well as in style (Dann's walk ruling,
					     2026-08-05: the first pass was full width at the foot of the
					     panel, which shouted and hid at the same time).

					     The Transcription drawer's Print button is
					     RootPanel.svelte:213-219, sitting in a .button-row grid of
					     `1fr 1fr 2fr`, immediately after the input and before the
					     display options. This mirrors that grid and takes the same
					     column, so the print control occupies the SAME x-position and
					     the same width on both tabs and does not move when a singer
					     switches between them. It sits after the score drop zone for
					     the same reason: that is Fit's analogue of Transcription's
					     textarea, the input the page is made from.

					     The label reuses `input.print`, so one word means one thing
					     on both surfaces: EN "Print", FR "Imprimer".

					     `handlePrint` is a bare window.print() with no tab coupling
					     (see handlePrint above), and app.css:200-205 already hides .header-bar,
					     .drawer, .drawer-lip, .tab-bar and .ribbon at print time, so
					     printing from Fit emits the page alone. OBSERVED in a browser
					     on ea9556f, 2026-08-05: one sheet, no chrome, in both
					     languages. The capability was always reachable by Cmd-P; what
					     was missing was any way to SEE it.

					     Disabled when the page holds nothing worth putting on paper:
					     no score ingested AND no reading captured. In that state
					     VoiceProfilePane.svelte's .profile-empty renders the single line
					     "Calibrate your voice to begin", which is honest and is not a
					     result. OBSERVED greyed out on a fresh voice. -->
					<div class="shane-button-row">
						<button
							class="shane-print-btn"
							disabled={!ingestedScore && Object.keys(shaneFormants).length === 0}
							onclick={handlePrint}
						>
							{t('input.print', language)}
						</button>
					</div>
					<CalibrationWizard
						{language}
						{scoreRenders}
						bind:collapsed={wizardCollapsed}
						onActiveProfileChange={(f, name, characteristics) => {
							shaneFormants = f;
							shaneVoiceName = name;
							shaneCharacteristics = characteristics;
						}}
						onOpenLearnNote={() => {
							// The sung-[o] glyph's deep link: Learn tab, then the
							// note's anchor. handleHeadingNavigate already retries
							// while the lazy Learn content mounts, and the return
							// path is the Shane tab itself (the wizard rehydrates
							// to the summary).
							handleTabChange('learn');
							handleHeadingNavigate('learn-u3-note-o');
						}}
					/>
					</div>
				{/if}
			{/snippet}
			{#snippet notationPanel()}
				<!-- NOTATION (item N.7). ONE instance, anchored by the Drawer
				     below its scrolling panel, shown on Transcription and Fit.
				     The state was always document-level and persisted (the notationPrefs and
				     openSyllabification declarations and their writers) and Fit obeyed it:
				     both reach VoiceProfilePane through its own props of
				     those names. Only the CONTROL was tab-scoped, which made its
				     placement lie about its scope.

				     Rendering it once rather than once per panel is Dann's
				     improvement on my first pass: two instances sharing state
				     can drift, and one cannot.

				     The accent follows the tab (Dann's ruling, 2026-08-06):
				     sage on Transcription, deeper-lavender on Fit, that
				     surface's identity colour (Drawer.svelte:587). Twinned on
				     TitleHeader and PageFooter, which take accents the same way.

				     KNOWN GAP, accepted and unnumbered: the stress-acutes toggle
				     will appear on Fit and change nothing there, because
				     showStressDiacritics never reaches VoiceProfilePane
				     (it is never given that prop). Fit's IPA stress mark is a separate and
				     unconditional thing (pipeline.ts:711). -->
				<NotationFields
					{notationPrefs}
					{showStressDiacritics}
					openSyllabification={doc.openSyllabification}
					{language}
					accent={activeTab === 'shane' ? 'var(--deeper-lavender)' : 'var(--sage)'}
					onnotationchange={handleNotationChange}
					onstressdiacriticschange={handleStressDiacriticsChange}
					onopensyllabificationchange={handleOpenSyllabificationChange}
					expanded={notationExpanded}
					onexpandedchange={(v) => (notationExpanded = v)}
				/>
			{/snippet}
	</Drawer>
	<main
		class="main-content tab-{activeTab} {paperBreathClass} {tabTransitionClass}"
		class:drawer-open={!drawerCollapsed}
		class:reading-mode={isReadingMode}
		bind:this={mainContentEl}
		tabindex="0"
	>
		{#if activeTab === 'transcription'}
			<Paper lines={effectiveLines} {notationPrefs} {language} metadata={doc.metadata} pageSize="letter" {isMobile} {showStressDiacritics} {spotReconstitution} glossOverrides={doc.glossOverrides} onwordclick={handleWordClick} />
		{:else if activeTab === 'shane'}
			<!-- The Voice Profile envelope (handover v30 §C.1, page furniture
			     per Dann's review ruling): the interim main pane, a fixed
			     letter page with the Paper system's header and footer. The
			     wizard in the drawer publishes the active voice's readings
			     and name into the state above. -->
			<!-- N.10 (Dann, 7 August): Fit consumes Transcription's output.
			     `lines` is passed RAW, not `effectiveLines` — the Fit resolver
			     applies its own open syllabification, so the display view would
			     be sliced twice. -->
			<VoiceProfilePane
				transcribedLines={lines}
				pairings={shownPairings}
				onnotepick={handleNotePick}
				formants={shaneFormants}
				voiceName={shaneVoiceName}
				characteristics={shaneCharacteristics}
				{language}
				ingested={ingestedScore}
				scoreTitle={doc.metadata.title}
				{engraving}
				{notationPrefs}
				openSyllabification={doc.openSyllabification}
				onrendered={handleScoreRendered}
			/>
		{:else}
			<ReadingPaper {language}>
				{#snippet content()}
					{#if activeTab === 'learn'}
						{#await import('$lib/components/Reading/LearnContent.svelte') then mod}
							{@const LearnContent = mod.default}
							<LearnContent {language} onready={handleReadingContentReady} />
						{/await}
					{:else}
						{#await import('$lib/components/Reading/GuideContent.svelte') then mod}
							{@const GuideContent = mod.default}
							<GuideContent {language} onready={handleReadingContentReady} />
						{/await}
					{/if}
				{/snippet}
			</ReadingPaper>
		{/if}
	</main>
	{#if isMobile && drawerCollapsed}
		<button
			class="paper-handle"
			onclick={handleDrawerToggle}
			aria-label={t('drawer.expand', language)}
			data-tab={activeTab}
		>
			<span class="paper-handle-shape" aria-hidden="true">
				<svg class="paper-handle-chevron" width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="2,10 10,2 18,10" />
				</svg>
			</span>
		</button>
	{/if}
</div>
{#if isMobile}
	<div class="mobile-tabbar">
		<TabBar {activeTab} {language} ontabchange={handleTabChange} />
	</div>
{/if}
{#if updated.current && !updateDismissed}
	<div class="update-toast screen-only" role="status">
		<span class="update-toast-text">{t('update.notice', language)}</span>
		<!-- N.54: location.reload() alone lands the singer back on the OLD build.
		     static/sw.js serves the app shell stale-while-revalidate, so a plain
		     reload returns the cached document and only then fetches the new one.
		     Dropping the caches that worker owns (same 'ilya-' prefix it filters
		     on in its own activate handler) sends the reload to the network. -->
		<button
			class="update-toast-action"
			onclick={async () => {
				try {
					const keys = await caches.keys();
					await Promise.all(
						keys.filter((k) => k.startsWith('ilya-')).map((k) => caches.delete(k))
					);
				} catch {
					// No CacheStorage, or it refused. Reload anyway: no worse than before.
				}
				location.reload();
			}}>{t('update.action', language)}</button
		>
		<button class="update-toast-dismiss" aria-label={t('update.dismiss', language)} onclick={() => (updateDismissed = true)}>×</button>
	</div>
{/if}

<style>
	/* ── Fit drawer column: identical to RootPanel's .root-panel, so the
	   Transcription and Fit drawers share one layout (Dann, 2026-07-13). The
	   CalibrationWizard's own outer padding is dropped in favour of this. */
	.shane-panel {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 20px 1rem 40px;
	}

	/* Fit surfaces use the tab's lavender for the focus ring, not the global
	   sage, so focusing a Fit field mirrors the sage ring in purple. */
	.shane-panel :global(:focus-visible) {
		outline-color: var(--deeper-lavender);
	}

	/* The Fit print control (item 1.8). RootPanel's .button-row, .action-btn
	   and .btn-secondary are all scoped to that component, so their values are
	   twinned here rather than imported: the same `1fr 1fr 2fr` grid, the same
	   6px gap, the same padding, weight, radius and border.

	   The grid is the point. Print takes column 2 on both tabs, so the control
	   lands at the same x-position and the same 25% width whichever surface a
	   singer is on, and it does not move when they switch. The first pass made
	   it full width at the foot of the panel; Dann walked it and called it
	   excessive and an afterthought, and he was right on both counts.

	   One deliberate departure, named: it carries a disabled style, which
	   RootPanel's Print button does not. A control that cannot be used should
	   not look identical to one that can. RECORDED, NOT CHASED:
	   RootPanel.svelte:213-219 has no :disabled rule at all, so
	   Transcription's Print button looks enabled while disabled. */
	.shane-button-row {
		display: grid;
		grid-template-columns: 1fr 1fr 2fr;
		gap: 6px;
		margin-top: 4px;
		margin-bottom: 6px;
	}

	.shane-print-btn {
		grid-column: 2;
		padding: 0.45rem 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ink-secondary);
		background: white;
		border: 1px solid var(--stone-600, #57534e);
		border-radius: 4px;
		cursor: pointer;
		transition: opacity 0.12s;
	}

	.shane-print-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	/* N.67 step 3. Twins .shane-print-btn rather than inventing a look, and
	   sits inline rather than full width: it is the destructive control on
	   this panel and should not be the loudest thing on it. */
	.start-over {
		align-self: start;
		padding: 0.45rem 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ink-secondary);
		background: white;
		border: 1px solid var(--stone-600, #57534e);
		border-radius: 4px;
		cursor: pointer;
		transition: opacity 0.12s;
	}

	/* The Q4 provenance line: tertiary, one quiet line beneath the
	   Metadata block, sharing the drawer's content edges. Clamped to a
	   single line with an ellipsis (Dann's ruling, 2026-07-13): real
	   headers carry IMSLP credit blobs and URLs; the text stays verbatim
	   (no parsing of publisher habits) but never wraps. */
	.shane-provenance {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.75rem;
		color: var(--ink-tertiary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* ── Glyph Table (LEARN Section 1) ─────────────────── */

	:global(.gt-table) {
		border-collapse: collapse;
		width: max-content;
		table-layout: fixed;
	}

	:global(.gt-table thead) {
		position: sticky;
		top: 0;
		z-index: 10;
	}

	:global(.gt-table thead th) {
		background: #f5f7f3;
		border-bottom: 2px solid #3c3a36;
		border-right: 1px solid #c8c8c3;
		padding: 6px 2px;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.5rem;
		font-weight: 600;
		text-align: center;
		vertical-align: bottom;
		line-height: 1.3;
		color: #3c3a36;
		min-width: 48px;
		max-width: 48px;
		width: 48px;
		white-space: normal;
		word-wrap: break-word;
		overflow-wrap: break-word;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	:global(.gt-table thead th:last-child) { border-right: none; }

	:global(.gt-num-h) { min-width: 30px !important; width: 30px !important; }
	:global(.gt-label-h) { min-width: 56px !important; width: 56px !important; }

	:global(.gt-col-sub) {
		font-weight: 400;
		font-size: 0.45rem;
		color: #8a8780;
		white-space: normal;
		text-transform: uppercase;
	}

	:global(.gt-cursive-h) {
		border-bottom-color: #8ba48b !important;
		border-bottom-width: 3px !important;
	}

	:global(.gt-table tbody tr) { border-bottom: 1px solid #c8c8c3; }
	:global(.gt-table tbody tr:nth-child(even) td) { background: #fcfdfc; }
	:global(.gt-table tbody tr:last-child) { border-bottom: none; }

	:global(.gt-table td) {
		border-right: 1px solid #c8c8c3;
		text-align: center;
		vertical-align: middle;
		height: 48px;
		min-width: 48px;
		max-width: 48px;
		width: 48px;
		aspect-ratio: 1;
		padding: 0;
	}

	:global(.gt-table td:last-child) { border-right: none; }

	:global(.gt-num) {
		min-width: 30px !important;
		width: 30px !important;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.6rem;
		color: #aaa8a0;
	}

	:global(.gt-label) {
		min-width: 56px !important;
		width: 56px !important;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.75rem;
		text-align: right !important;
		padding-right: 8px !important;
		white-space: nowrap;
		overflow: hidden;
	}

	:global(.gt-cell) {
		font-size: 1.5rem;
		line-height: 1;
	}

	:global(.gt-serif) { font-family: 'Noto Serif', 'DejaVu Serif', serif; font-style: normal; }
	:global(.gt-sans) { font-family: 'Noto Sans', 'DejaVu Sans', sans-serif; font-style: normal; }
	:global(.gt-serif-it) { font-family: 'Noto Serif', 'DejaVu Serif', serif; font-style: italic; }
	:global(.gt-sans-obl) { font-family: 'Noto Sans', 'DejaVu Sans', sans-serif; font-style: italic; }

	:global(.gt-cursive) {
		background: #ebeee8 !important;
		color: #8ba48b;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-style: normal;
		font-size: 0.6rem !important;
		letter-spacing: 0.03em;
	}

	:global(.gt-null) {
		font-size: 1.15rem !important;
		font-weight: 700;
		letter-spacing: 0.12em;
		line-height: 48px;
		color: var(--dusty-rose, #A67B7B);
	}

	:global(.gt-hi) {
		background: #F0D8D8 !important;
		box-shadow: inset 0 0 0 1.5px #C28888;
	}

	:global(.gt-obsolete td) { background: #f8f6f0 !important; }
	:global(.gt-obsolete .gt-label),
	:global(.gt-obsolete .gt-num) { color: #96918a !important; }

	:global(.gt-divider td) {
		background: #fff !important;
		border-bottom: 2px solid #a0a09b !important;
		padding: 6px 8px !important;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.7rem !important;
		color: #a0a09b;
		letter-spacing: 0.04em;
		height: auto !important;
		text-align: left !important;
	}
	.app-content {
		display: flex;
		flex: 1;
		overflow: hidden;
		background-color: var(--drawer-bg, #FAF8F5);
	}
	.main-content {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: var(--desk-surface, #D8D4C8);
		transform: none;
	}

	/* ── Floating Paper: tab-specific surrounds (Approach A) ── */

	.main-content.tab-transcription {
		background-color: var(--surround-transcription, #D8D4C8);
	}

	.main-content.tab-learn {
		background-color: var(--surround-learn, #E5E1D6);
	}

	.main-content.tab-guide {
		background-color: var(--surround-guide, #F2EFE6);
	}

	.main-content.tab-shane {
		/* One desk, many papers (Dann's consistency ruling, 2026-07-12,
		   superseding the Round 8 lavender surround for this surface only):
		   the Shane gallery shares the transcription desk tone, and Shane's
		   lavender identity lives in the tab bar, the drawer handle, and
		   the Pacifier band (--surround-shane, unchanged). Carry this to
		   the next Kimi relay with provenance. */
		background-color: var(--surround-transcription, #D8D4C8);
	}

	/* ── Floating Paper: tab-specific shadows ─────────────── */

	.main-content.tab-transcription :global(.paper-page) {
		box-shadow: 0 2px 8px rgba(45, 45, 45, 0.06);
	}

	.main-content.tab-learn :global(.reading-paper) {
		box-shadow: 0 4px 20px rgba(45, 45, 45, 0.10);
	}

	.main-content.tab-guide :global(.reading-paper) {
		box-shadow: 0 3px 12px rgba(45, 45, 45, 0.08);
	}

	/* ── Transcription mode: Paper centres naturally within flex ── */

	/*
	 * Reading mode: no translateX offset. The Reading Paper fills available
	 * width naturally via flex. When the Drawer collapses, the flex container
	 * grows and ReadingPaper's max-width centres it. Smooth width transition
	 * handled by the Drawer's own 1000ms cubic-bezier.
	 */
	.main-content.reading-mode {
		transform: none;
		justify-content: flex-start;
		padding-top: 1rem;
	}

	/* ── Tab transition animations ──────────────────────── */

	@keyframes tabSlideFromRight {
		from {
			opacity: 0;
			transform: translateX(12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes tabSlideFromLeft {
		from {
			opacity: 0;
			transform: translateX(-12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.main-content.tab-enter-from-right {
		animation: tabSlideFromRight 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.main-content.tab-enter-from-left {
		animation: tabSlideFromLeft 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	/* screen-only wrappers: visible on screen, hidden in print */
	.screen-only {
		display: contents;
	}
	@media print {
		.screen-only {
			display: none !important;
		}
		.app-content {
			display: block;
			overflow: visible;
		}
		.main-content {
			display: block;
			flex: none;
			padding: 0;
			overflow: visible;
			transform: none;
		}
	}
	/* Breath animation: two-phase CSS transitions for moments of meaning */
	@keyframes breathOut {
		from { opacity: 1; transform: translateY(0); }
		to   { opacity: 0; transform: translateY(-2px); }
	}
	@keyframes breathIn {
		from { opacity: 0; transform: translateY(-2px); }
		to   { opacity: 1; transform: translateY(0); }
	}
	:global(.breath-out) {
		animation: breathOut 150ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	:global(.breath-in) {
		animation: breathIn 250ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	/* Respect reduced motion preferences */
	@media (prefers-reduced-motion: reduce) {
		:global(.breath-out),
		:global(.breath-in) {
			animation: none !important;
		}
		.main-content {
			transition: none !important;
		}
		.main-content.tab-enter-from-right,
		.main-content.tab-enter-from-left {
			animation: none !important;
		}
	}
	/* ── Editorial mark callout (scholarly departure/note) ──── */
	:global(.learn-callout) {
		border-left: 4px solid var(--dusty-rose, #A67B7B);
		border-top: none;
		border-right: none;
		border-bottom: none;
		background: none;
		padding: 0 0 0 1rem;
		margin: 2rem 0;
		border-radius: 0;
		font-size: 0.92em;
		position: relative;
	}
	:global(.learn-callout)::before {
		content: "NOTE";
		display: block;
		font-variant: small-caps;
		font-weight: 600;
		letter-spacing: 0.05em;
		color: var(--dusty-rose, #A67B7B);
		margin-bottom: 0.5rem;
		margin-left: -4px;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.85rem;
	}
	:global(.learn-callout p:last-child) {
		margin-bottom: 0;
	}
	/* Variant labels via data attribute */
	:global(.learn-callout[data-label="departure"])::before {
		content: "DEPARTURE";
	}
	:global(.learn-callout[data-label="method"])::before {
		content: "METHOD";
	}
	:global(.learn-callout[data-label="context"])::before {
		content: "CONTEXT";
	}
	/* ── Placeholder content within ReadingPaper ──────────── */
	.placeholder-content {
		text-align: center;
		padding: 4rem 0;
	}

	/* ── Guide question headers: welcoming landmarks ───────── */
	.main-content.tab-guide :global(.reading-inner h4) {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.35rem;
		font-weight: 500;
		color: var(--ink-primary, #1a1612);
		margin-top: 3rem;
		margin-bottom: 0.75rem;
		line-height: 1.35;
	}

	/* Tab-scoped heading colours */

	.main-content.tab-learn :global(.reading-inner h1),
	.main-content.tab-learn :global(.reading-inner h2),
	.main-content.tab-learn :global(.reading-inner h3),
	.main-content.tab-learn :global(.reading-inner h4) {
		color: var(--dusty-rose, #A67B7B);
	}

	.main-content.tab-guide :global(.reading-inner h1),
	.main-content.tab-guide :global(.reading-inner h2),
	.main-content.tab-guide :global(.reading-inner h3),
	.main-content.tab-guide :global(.reading-inner h4) {
		color: var(--quiet-cobalt, #5C739E);
	}

	.main-content.tab-guide :global(.reading-inner h3) {
		border-top-color: var(--quiet-cobalt, #5C739E);
	}

	/* ── Text input field: sage border (item 6) ──────────── */
	/* Targets textarea within the Drawer's transcription panel */
	:global(.drawer-content textarea) {
		border: 3px solid var(--sage, #8B9A7D) !important;
		transition: border-color 150ms ease;
	}
	:global(.drawer-content textarea:focus) {
		border-color: var(--deeper-sage, #7A8A6C) !important;
	}
	/* ── Mobile awareness ──────────────────────────────────── */
	.mobile-overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: var(--desk-surface, #D8D4C8);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}
	.mobile-card {
		max-width: 360px;
		text-align: center;
	}
	.mobile-logo {
		font-size: 2rem;
		margin-bottom: 1.5rem;
		color: var(--sage);
	}
	.mobile-logo .logo-bracket {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-weight: 400;
	}
	.mobile-logo .logo-ilya {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-style: italic;
	}
	.mobile-logo .logo-version {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.5rem;
		font-weight: 400;
		vertical-align: super;
		margin-left: 0.1em;
		color: var(--sage);
		text-transform: lowercase;
		letter-spacing: 0.02em;
	}
	.mobile-heading {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--ink-primary, #1a1612);
		margin-bottom: 0.5rem;
	}
	.mobile-body {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.95rem;
		color: var(--ink-secondary, #4a4540);
		line-height: 1.6;
		margin-bottom: 1rem;
	}
	.mobile-divider {
		width: 40px;
		height: 0;
		border-top: 0.5px solid var(--stone-300, #d6d3d1);
		margin: 0.75rem auto 1.25rem;
	}
	.mobile-continue {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.85rem;
		color: var(--ink-tertiary, #7a756e);
		background: none;
		border: 1.5px solid var(--sage, #8B9A7D);
		border-radius: 4px;
		padding: 0.5rem 1.25rem;
		margin-top: 1rem;
		cursor: pointer;
		transition: border-color 150ms ease, color 150ms ease;
	}
	.mobile-continue:hover {
		border-color: var(--sage);
		color: var(--ink-primary, #1a1612);
	}
	/* Responsive layout for narrow viewports */
	@media (max-width: 767px) {
		.app-content {
			position: relative;
			height: 100vh;
			overflow: hidden;
		}

		.main-content {
			height: 100vh;
			overflow: auto;
			padding: 0.5rem;
			width: 100%;
			align-items: flex-start;
			-webkit-overflow-scrolling: touch;
			transform: none;
	
			/* The bottom 92px of the viewport is fixed furniture: the tab bar
			   at 56px (.mobile-tabbar) and the paper handle sitting on it at 36px
			   (.paper-handle). Without this the last line of the document cannot
			   be scrolled clear of them. Dann found it under the attribution's
			   final line, 11 August 2026.

			   Padding rather than a shorter scroll region, deliberately: the
			   tab bar is an overlay on the desk by design, and shortening the
			   region would end the desk colour above it and cut the paper's
			   surround short. The overlay stays; the content gets room.

			   On .main-content rather than .paper-container because this is
			   the scroll region for all four destinations, and Learn and Guide
			   have the same defect unlooked-at. */
			padding-bottom: calc(56px + 36px + 0.5rem);
		}
	}

	/* Paper handle: upward-facing semicircle, fixed bottom, tab-aware */
	.paper-handle {
		display: none;
	}

	@media (max-width: 767px) {
		.paper-handle {
			display: flex;
			align-items: flex-start;
			justify-content: center;
			position: fixed;
			bottom: 56px;
			left: 50%;
			transform: translateX(-50%);
			width: 72px;
			height: 36px;
			padding: 0;
			border: none;
			background: transparent;
			z-index: 90;
			cursor: pointer;
			-webkit-tap-highlight-color: transparent;
		}

		.paper-handle-shape {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 72px;
			height: 36px;
			border-radius: 72px 72px 0 0;
			box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.12);
		}

		.paper-handle-chevron {
			color: #FAF8F5;
			margin-bottom: 4px;
		}

		.paper-handle[data-tab="transcription"] .paper-handle-shape {
			background: var(--sage, #8B9A7D);
		}

		.paper-handle[data-tab="learn"] .paper-handle-shape {
			background: var(--dusty-rose, #A67B7B);
		}

		.paper-handle[data-tab="guide"] .paper-handle-shape {
			background: var(--quiet-cobalt, #5C739E);
		}

		.paper-handle[data-tab="shane"] .paper-handle-shape {
			background: var(--deeper-lavender, #8E7E9B);
		}
	}

	/* ── Mobile tab bar: fixed footer ────────────────────── */
	.mobile-tabbar {
		display: none;
	}

	@media (max-width: 767px) {
		.mobile-tabbar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 56px;
			z-index: 50;
			display: block;
		}
	}

	/* ── Update notice toast ─────────────────────────── */

	/* N.53. The shape did not hold: a shrink-wrapped flex row with no width
	   let the French string wrap to five lines, and border-radius 999px on a
	   tall box is a squircle rather than a pill. Width is now determinate
	   (left/right + margin auto + max-width) instead of shrink-to-fit, so the
	   radius always resolves against a known height. Dann, E.43: keep the
	   pill, bind it in a thicker lavender border. */
	.update-toast {
		position: fixed;
		bottom: 1.25rem;
		left: 1rem;
		right: 1rem;
		margin: 0 auto;
		max-width: 30rem;
		z-index: 200;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 0.9rem 0.6rem 1.1rem;
		background: var(--paper, #faf7f2);
		border: 2px solid var(--muted-lavender, #A89BB5);
		border-radius: 999px;
		box-shadow: 0 4px 16px rgba(40, 38, 35, 0.18);
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.88rem;
		color: var(--ink-secondary, #4a4540);
	}
	/* The sentence takes the slack; the two controls never shrink. */
	.update-toast-text {
		flex: 1 1 auto;
		min-width: 0;
	}

	.update-toast-action {
		flex: 0 0 auto;
		border: none;
		border-radius: 999px;
		padding: 0.35rem 0.9rem;
		background: var(--sage, #8a9b7e);
		color: #fff;
		font-family: inherit;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.update-toast-action:hover {
		filter: brightness(0.95);
	}

	.update-toast-dismiss {
		border: none;
		background: none;
		color: var(--ink-secondary, #4a4540);
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
		padding: 0.2rem;
	}

	/* N.53: clear the fixed tab bar rather than sit on it. .mobile-tabbar is
	   bottom 0, height 56px, z-index 50; this was bottom 1.25rem at z-index
	   200, so it covered the bar's upper 36px. Same breakpoint as the bar. */
	@media (max-width: 767px) {
		.update-toast {
			bottom: calc(56px + 0.75rem);
		}
	}

	@media print {
		.update-toast {
			display: none;
		}
	}
</style>
