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
	import { createMemoryDriver, globalStore } from '$lib/library/driver';
	import { emptySongRecord } from '$lib/library/types';
	import { readStorageEstimate, type StorageReading } from '$lib/library/quota';
	// N.67 step 6, the sweep. WHICH SENTENCE, AND WHETHER, is decided in plain
	// TypeScript where a gate can reach it. What is left in this file is looking
	// the key up and drawing the paragraph.
	import { bootNotices, drawerNotices, fillNotice, type NoticeLine } from '$lib/library/notices';
	import { hashBytes, fingerprintVocalLine } from '$lib/library/fingerprint';
	import { arrivalDecision } from '$lib/library/library';
	import { readBinder } from '$lib/library/binder';
	// N.67 step 5, the remainder. Which songs go into a binder, and what happens
	// to each song that comes out of one, are decisions in plain TypeScript for
	// the same reason the door's are: runes are inert under vitest, so a rule
	// written in this file is a rule no gate can reach.
	import {
		binderFailureKey,
		collisionName,
		exportBinder,
		importBinder,
		importNoticeKey,
		type Collision,
		type CollisionAnswer,
	} from '$lib/library/exchange';
	import { newId, writeActiveSongId } from '$lib/library';
	// N.67 step 4b, the library door. Every decision it makes is in this plain
	// TypeScript module, where vitest can reach it; what is left below is wiring.
	import {
		createSong,
		deleteSong,
		libraryRows,
		listSongs,
		nameFor,
		recognize,
		renameSong,
		toRows,
	} from '$lib/library/songs';
	import type { SongSummary } from '$lib/library/driver';
	import type { SongRecord } from '$lib/library/types';
	import type { SourceBytes } from '$lib/library/driver';
	import { version } from '$app/environment';
	import type { OpenedLibrary } from '$lib/library';
	import SyllableStation from '$lib/shane/SyllableStation.svelte';
	import ShiftLyricsControl from '$lib/shane/ShiftLyricsControl.svelte';
	import RootPanel from '$lib/components/Drawer/RootPanel.svelte';
	import InspectorPanel from '$lib/components/Drawer/InspectorPanel.svelte';
	import Paper from '$lib/components/Paper/Paper.svelte';
	import ReadingAid from '$lib/components/ReadingAid.svelte';
import InstallPrompt from '$lib/components/InstallPrompt.svelte';
	import ReadingPaper from '$lib/components/Paper/ReadingPaper.svelte';
	import DeskHead from '$lib/components/DeskHead.svelte';
	import type { TabId } from '$lib/destinations';
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
	import type { PageProvenance } from '$lib/library/types';
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
	// N.67 step 4b. A SLOT, no longer a constant. The comment above still holds
	// for `data`, which is read once: rebuilding the document because a PROP
	// changed identity would throw away unsaved edits. What changes here is that
	// the page may now put a DIFFERENT document in the slot on purpose, which is
	// `switchSong` below, and which is close() then open() exactly as step 0
	// promised. Measured 2026-08-18 before choosing: opening a song costs about
	// 49 ms for a .musicxml and about 343 ms for a real 143 KB .musx, so the
	// reload branch buys nothing and costs the drawer's whole state.
	let doc = $state(
		SongDocument.fromLoaded(
			library,
			opened?.loaded ?? { record: emptySongRecord(LEGACY_SONG_ID, new Date().toISOString()) },
		),
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
	// Mobile awareness. A WIDTH test, which on a phone is also the portrait
	// test: 390 by 844 is under the breakpoint and 844 by 390 is over it, so
	// rotation switches the mode exactly as Dann's rotation ruling says.
	let isMobile = $state(false);
	let mainContentEl: HTMLElement | undefined = $state(undefined);

	/* ── Portrait C: the page and the aid (ruled by Dann 2026-08-18) ──
	   The arrival view is the page. `Read` swaps in the aid, `The page`
	   swaps it back. Both stay mounted: the page has to survive the swap or
	   printing from the aid would emit nothing, and remounting it would
	   re-measure the title header from zero and re-paginate the document
	   under the singer. */
	let portraitView = $state<'page' | 'aid'>('page');
	/* One scroll position each, so neither view loses the singer's place. */
	let pageScrollTop = 0;
	let aidScrollTop = 0;

	async function showPortraitView(next: 'page' | 'aid') {
		if (next === portraitView) return;
		if (mainContentEl) {
			if (portraitView === 'page') pageScrollTop = mainContentEl.scrollTop;
			else aidScrollTop = mainContentEl.scrollTop;
		}
		portraitView = next;
		await tick();
		if (mainContentEl) {
			mainContentEl.scrollTop = next === 'page' ? pageScrollTop : aidScrollTop;
		}
	}

	/* Leaving portrait, or leaving Transcription, returns to the page. The aid
	   is a portrait reading of the transcription and has no meaning anywhere
	   else, and a singer who rotates back should meet the artefact. */
	$effect(() => {
		if (!isMobile || activeTab !== 'transcription') portraitView = 'page';
	});
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
	/**
	 * The per-SESSION state, which is not the song and is never stored.
	 *
	 * Every one of these keys on word positions in the poem that is about to be
	 * replaced, so all three callers drop them together: Transcribe, Clear, and
	 * N.67 step 4b's song switch. They were three copies of one list until the
	 * switch would have made it four.
	 */
	function resetSessionState() {
		transcribeError = '';
		selectedWord = null;
		lastFocusedWord = null;
		spotReconstitution = new Map();
		userStressOverrides = new Map();
		yoToggles = new Map();
		syllableOverrides = new Map();
	}
	function handleTranscribe() {
		if (!canTranscribe) return;
		resetSessionState();
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
		transcribeMs = 0;
		resetSessionState();
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
		nameIfUnnamed();
	}

	/* ── N.67 step 4a: a different piece has arrived ───────────────── */

	// The upload waiting on the singer's answer. NOTHING is mutated while this
	// is set: not the score, not the metadata, not the placements, not the
	// stored source. So "Keep this song" has nothing to undo.
	let pendingArrival = $state<{
		ingested: IngestedScore;
		file: File;
		orphaned: number;
		total: number;
	} | null>(null);
	let replaceDialogEl = $state<HTMLDialogElement | undefined>(undefined);
	let keepButtonEl = $state<HTMLButtonElement | undefined>(undefined);

	/**
	 * N.67 step 5. ONE dialog serves both warnings, because they are the same
	 * act: something is about to replace this song and cannot be undone.
	 *
	 * `title` and `body` are already-resolved strings, so the template holds no
	 * copy decisions, and `replace` is what the destructive button does.
	 */
	/**
	 * One button on the confirmation dialog. THE LAST ANSWER IS THE SAFE ONE.
	 *
	 * `keepOpen` is for the escape hatch: exporting first is not an answer, it is
	 * something you do before answering, so it must not close the dialog.
	 */
	type Answer = { label: string; run?: () => void; destructive?: boolean; keepOpen?: boolean };
	let pendingConfirm = $state<{ title: string; body: string; answers: Answer[] } | null>(null);
	const safeAnswer = $derived(pendingConfirm?.answers.at(-1) ?? null);

	async function askToReplace(title: string, body: string, answers: Answer[]): Promise<void> {
		pendingConfirm = { title, body, answers };
		// RENDERED BEFORE THE DIALOG OPENS. Without this tick the buttons do not
		// exist yet, so `showModal()`'s own focus algorithm settles on the dialog
		// and the explicit focus below reaches nothing. The safe answer is last
		// in the DOM, which is `keepButtonEl`.
		await tick();
		replaceDialogEl?.showModal();
		// Focus the SAFE answer. Done here rather than with `autofocus`, which
		// raises `a11y_autofocus` and would move the web-check gate; and the DOM
		// order is the visual order, so nothing a singer sees disagrees with
		// what a screen reader is told (Dann, 2026-08-16).
		keepButtonEl?.focus();
	}

	/**
	 * Every accepted score comes through here first.
	 *
	 * Before this existed, a second score overwrote the song's title and file in
	 * place while the first song's placements survived onto music they were
	 * never made for (measured at `5c9c7f3`). Now Ilya can tell that a different
	 * piece has arrived, and says so before anything is lost.
	 */
	/** N.59 step 7: the page provenance of the arrival currently being applied. */
	let arrivalPage: PageProvenance | null = null;

	async function handleArrival(
		ingested: IngestedScore,
		file: File,
		origin: 'upload' | 'restore',
		page?: PageProvenance,
	): Promise<void> {
		arrivalPage = page ?? null;
		// A restore is the song's own score coming back from the vault. It is
		// never a new arrival and must never be questioned.
		if (origin === 'restore') {
			applyArrival(ingested, file, origin, false);
			return;
		}
		const eventIds = ingested.result.score.vocalLine.filter((ev) => ev.type !== 'rest').map((ev) => ev.id);
		const present = new Set(eventIds);
		const stored = Object.keys(doc.pairings);
		const orphaned = stored.filter((id) => !present.has(id)).length;

		let incoming = '';
		try {
			incoming = await fingerprintVocalLine(ingested.result.score.vocalLine);
		} catch {
			// No fingerprint means no evidence, and an unprovable suspicion must
			// not stand between a singer and their score.
		}
		const decision = incoming
			? arrivalDecision({
					storedFingerprint: doc.source?.fingerprint,
					incomingFingerprint: incoming,
					orphanCount: orphaned,
				})
			: 'attach';

		// DESIGN §2.6, SECOND BRANCH. From a NEUTRAL state, which is what New
		// song creates, an arriving score is checked against the library before
		// it is attached to anything. A hash may GUIDE; only the singer decides,
		// so the answer is a prompt and never an action, and nothing at all is
		// mutated until they give one. A song that already has a score is not
		// neutral, and that path is `arrivalDecision`'s, untouched.
		if (doc.source === null) {
			const matches = await recognize(library.plural, incoming, doc.id);
			const match = matches[0];
			if (match) {
				void askToReplace(
					t('recognize.title', language),
					t('recognize.body', language).replace(
						'%s',
						toRows([match], t('songs.untitled', language))[0].label,
					),
					[
						{ label: t('recognize.open', language), run: () => void switchSong(match.id) },
						{ label: t('recognize.here', language), run: () => applyArrival(ingested, file, origin, false) },
					],
				);
				return;
			}
		}

		if (decision === 'ask') {
			pendingArrival = { ingested, file, orphaned, total: stored.length };
			void askToReplace(
				t('replace.title', language),
				t('replace.body', language).replace('%s', String(orphaned)).replace('%s', String(stored.length)),
				[
					{
						label: t('replace.replace', language),
						destructive: true,
						run: () => {
							const pending = pendingArrival;
							if (pending) applyArrival(pending.ingested, pending.file, 'upload', true);
						},
					},
					{ label: t('binder.exportFirst', language), run: () => void handleExport(), keepOpen: true },
					{ label: t('replace.keep', language) },
				],
			);
			return;
		}
		applyArrival(ingested, file, origin, false);
	}

	/**
	 * Answer the dialog. Closed FIRST, then acted on, so an act that opens
	 * another dialog is never fighting this one for the modal.
	 */
	function answerWith(answer: Answer): void {
		if (answer.keepOpen) {
			answer.run?.();
			return;
		}
		replaceDialogEl?.close();
		answer.run?.();
	}

	/**
	 * Attach a score to the open song.
	 *
	 * `replaceWholeSong` empties the placements FIRST, so the merge rule below
	 * sees a fresh map and proposes into it: title, score file, and placements
	 * all become the new piece's together, which is the whole point. Without it
	 * this is step 3's behaviour exactly, unchanged.
	 */
	function applyArrival(
		ingested: IngestedScore,
		file: File,
		origin: 'upload' | 'restore',
		replaceWholeSong: boolean,
	): void {
		if (replaceWholeSong) doc.pairings = {};
		// N.67 step 2. The singer's own bytes go down with the song, in one
		// transaction, so a reload brings the score back. Only a real upload
		// writes: a restore's bytes came from the vault.
		if (origin === 'upload') void attachUploadedSource(ingested, file, arrivalPage ?? undefined);
		// Live-wired (§E.7 slice 1): VoiceProfilePane renders this as paginated
		// notation in the Fit main pane.
		ingestedScore = ingested;
		// N.55b R3: the first pass runs on accept, and the N.55a courtesy message
		// arrives in the same moment or it has no moment at all. It runs ONLY
		// where the file carried no lyrics. Where the score has an underlay, Ilya
		// READS it (`vowel-resolver.ts`), and proposing over it would be Ilya
		// claiming where the score already speaks. That is an INFERENCE from R3
		// and N.55a together, not a ruling of Dann's.
		const noLyrics = ingested.result.warnings.some((w) => w.code === 'no-lyrics-found');
		noLyricsFile = noLyrics ? ingested.fileName : null;
		// N.67 step 3, design §2.6. THE MERGE RULE, and where N.68 closed: an
		// upload never destroys placements; only the singer does, on purpose,
		// with Start placement over or with the replace dialog above.
		const merged = mergeOnUpload(
			doc.pairings,
			ingested.result.score.vocalLine.filter((ev) => ev.type !== 'rest').map((ev) => ev.id),
			buildSlotQueue(lines),
			noLyrics,
		);
		doc.pairings = merged.map;
		// Kept, never dropped, and reported as a count.
		orphanedCount = merged.orphaned.length;
		// The cursor lands on the first syllable the pass did not reach. Only
		// moved where the pass actually ran: a re-upload must not walk the
		// singer's insertion point back.
		if (merged.proposed) {
			pairingCursor = Math.min(Object.keys(doc.pairings).length, Math.max(0, slotQueue.length - 1));
		}
		// A new score arrives: clear whatever the previous score filled, then
		// fill the blanks from this score's header if it carries one. A score
		// with no header still clears, and that case is the whole point: at E.23,
		// Musorgsky's Sunless 1 rendered under the Schubert's title, composer,
		// and poet, because a header-less score reached no code that touched
		// metadata at all.
		commitMetadataState(
			onScoreIngested(
				{ metadata: doc.metadata, fromScore: doc.fromScoreFields },
				ingested.result.score.workMetadata,
			),
		);
	}

	/* ── N.67 step 5: the binder ────────────────────────────────────── */

	let importInputEl = $state<HTMLInputElement | undefined>(undefined);
	let binderError = $state<string | null>(null);
	/** What an import added. Cleared by the next export or import, never stale. */
	let binderNotice = $state<string | null>(null);

	/* ── N.67 step 6, the sweep: what storage tells the singer ───────── */

	// The last reading of `navigator.storage.estimate()`. Taken at boot and read
	// again the moment a write refuses for quota, because the boot figure is the
	// one thing a full origin is guaranteed to have moved past.
	let storageReading = $state<StorageReading>(opened?.storage ?? { persisted: null });
	// Decided ONCE, at mount, because deciding it again would show the
	// once-per-device eviction notice a second time: `bootNotices` writes the
	// flag as it decides, which is what makes "once" survive a reload.
	let bootLines = $state<NoticeLine[]>([]);
	const storageLines = $derived(
		drawerNotices({
			boot: bootLines,
			saveFailure: doc.saveFailure,
			loadFailure: doc.loadFailure,
			reading: storageReading,
		}),
	);
	$effect(() => {
		// A REAL FIGURE OR NONE. The notice appends "Storage: x of y used" only
		// where the browser answered with numbers, and the numbers worth showing
		// are the ones from the moment the write refused.
		if (doc.saveFailure !== 'quota-exceeded') return;
		void readStorageEstimate().then((reading) => {
			storageReading = reading;
		});
	});

	/** A date a singer would write, in their own language. */
	function todayInWords(): string {
		return new Date().toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	}

	/**
	 * Write the binder to the singer's own device.
	 *
	 * A Blob and an anchor, which lands in Downloads or the Files app. **NOT
	 * `navigator.share`**, which would be the sharing affordance design §8
	 * rules out: the binder is addressed to nobody, and the moment it is handed
	 * to another person that act is the person's, not the tool's.
	 *
	 * WHICH SONGS is the only difference between the two export controls, which
	 * is design §5's "a binder of one song and a binder of the whole library are
	 * the same object at different sizes". Everything else, the gathering, the
	 * naming, and the open song coming from the document rather than the vault,
	 * is `exchange.ts`, where a gate can reach it.
	 */
	async function writeBinder(ids: string[]): Promise<void> {
		binderError = null;
		binderNotice = null;
		const result = await exportBinder({
			ids,
			openId: doc.id,
			// Taken live: the document holds edits the vault has not seen, and a
			// rename debounces like everything else.
			openRecord: { ...doc.toRecord(), name: doc.name },
			// THE WHOLE LOAD RESULT. A record that failed validation comes back with
			// its raw stored value beside it, and that is what the binder carries:
			// design §4's salvage path, which is the only way anything ever comes
			// back out of a record Ilya has promised never to write to again.
			load: (id) => library.load(id),
			loadSource: (id) => library.loadSource(id),
			appVersion: version,
			exportedAt: new Date().toISOString(),
			today: todayInWords(),
			untitled: t('songs.untitled', language),
		});
		if (!result.ok) {
			binderError = t('binder.err.damaged', language);
			return;
		}
		const url = URL.createObjectURL(new Blob([result.bytes as BlobPart], { type: 'application/zip' }));
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = result.fileName;
		anchor.click();
		URL.revokeObjectURL(url);
	}

	const handleExport = (songId: string = doc.id): Promise<void> => writeBinder([songId]);
	/** Every song the list holds, in the order it draws them. */
	const handleExportAll = (): Promise<void> => writeBinder(songRows.map((row) => row.id));

	/**
	 * Raise design §5's three answers for one colliding song, and wait.
	 *
	 * PROMISE-SHAPED RATHER THAN CALLBACK-SHAPED, because the songs in a binder
	 * are asked about one at a time and each answer must land before the next is
	 * asked.
	 *
	 * **THE PRESS SETTLES IT, NOT THE CLOSE EVENT.** Measured 2026-08-18: in the
	 * browser this walk ran in, `close()` fires NO `close` event at all, on a
	 * bare `<dialog>` with no framework anywhere near it. An answer that waited
	 * for that event waited forever and the import hung on the first collision.
	 * `answerWith` closes before it runs, so the dialog is already shut when
	 * this resolves and the next `showModal()` is safe.
	 *
	 * Escape settles to Keep mine, because closing without answering changes
	 * nothing: nothing is mutated before the answer. Both `cancel` and `close`
	 * are listened for, and whichever arrives first wins; the rest are no-ops,
	 * because a question can only be answered once.
	 */
	let collisionResolve: ((answer: CollisionAnswer) => void) | null = null;

	function settleCollision(answer: CollisionAnswer): void {
		const resolve = collisionResolve;
		collisionResolve = null;
		resolve?.(answer);
	}

	function askCollision(collision: Collision): Promise<CollisionAnswer> {
		// ISO, YYYY-MM-DD: it reads the same in both languages and cannot be
		// misread as a different day (`placeholderName` sets the precedent).
		const mine = collision.mine.updatedAt.slice(0, 10);
		const theirs = collision.incoming.record.updatedAt.slice(0, 10);
		return new Promise((resolve) => {
			collisionResolve = resolve;
			void askToReplace(
				// N.67 step 6, walk finding W1. The title names the song being asked
				// about, so two collisions in a row are two questions rather than one
				// stubborn dialog. The name comes from `exchange.ts`, which knows the
				// placeholder rule for a song that was never named.
				t('collide.title', language).replace('%s', collisionName(collision, t('songs.untitled', language))),
				t('collide.body', language).replace('%s', mine).replace('%s', theirs),
				[
					{ label: t('collide.take', language), destructive: true, run: () => settleCollision('take') },
					{ label: t('collide.both', language), run: () => settleCollision('both') },
					{ label: t('collide.mine', language), run: () => settleCollision('mine') },
				],
			).then(() => {
				// A dialog that never opened must not hang the import forever.
				// Nothing was asked, so nothing is taken.
				if (!replaceDialogEl?.open) settleCollision('mine');
			});
		});
	}

	/**
	 * Read a binder in.
	 *
	 * **AN IMPORT ADDS SONGS TO THE LIBRARY. IT NEVER TOUCHES THE SONG YOU ARE
	 * IN** (Dann's ruling, 2026-08-18). The open-song warning that used to stand
	 * here is RETIRED: it existed because there was only ever one song to
	 * destroy, and songs have been plural since `cb7a15a`. The one question left
	 * is the id collision, and a singer who re-imports a binder of the song they
	 * are working in still meets it, because that is an id collision and that is
	 * the one moment the question is worth asking.
	 */
	async function handleImportFile(file: File): Promise<void> {
		binderError = null;
		binderNotice = null;
		const bytes = new Uint8Array(await file.arrayBuffer());
		const read = await readBinder(bytes, new Date().toISOString());
		if (!read.ok) {
			binderError = t(binderFailureKey(read.reason), language);
			return;
		}
		const outcome = await importBinder({
			songs: read.songs,
			// The ids the vault ACTUALLY holds. `library.load` cannot answer this:
			// an absent id yields an empty record rather than an error, so a check
			// written on it would report "no collision" for every song in the file.
			existing: await listSongs(library.plural),
			save: (record, source) => library.save(record, source),
			// N.67 step 6. A song that could not be read in the origin it left is
			// written back EXACTLY AS THE FILE CARRIES IT, with no stamp and no
			// rebuild, or the round trip would repair what design §4 promised to
			// leave untouched.
			salvage: (raw, id, source) => library.salvage(raw, id, source),
			ask: askCollision,
			newId,
			openId: doc.id,
		});
		if (outcome.failed) binderError = t('songs.err.write', language);
		const notice = importNoticeKey(outcome);
		if (notice) binderNotice = t(notice.key, language).replace('%s', String(notice.count));
		// THE ONLY CASE THAT RELOADS. The live document was replaced underneath,
		// and the document's own guarantee is that it is constructed FROM a
		// record already read, so a reload is the honest way to get that for a
		// record which has just arrived.
		if (outcome.replacedOpen) {
			location.reload();
			return;
		}
		// Every other answer leaves the singer exactly where they were, because
		// an import ADDS. The list is refreshed and the pointer does not move.
		await refreshSongs();
	}

	/* ── N.67 step 4b: the library door ─────────────────────────────── */

	// The library, as the drawer draws it. Read from the vault, refreshed after
	// every act that changes what is in it. The OPEN song's live name is laid
	// over its row below, because a rename debounces like every other write and
	// the singer must see it land immediately.
	let songs = $state<SongSummary[]>([]);
	let libraryError = $state<string | null>(null);
	let switching = false;

	async function refreshSongs(): Promise<void> {
		songs = await listSongs(library.plural);
	}

	const songRows = $derived(
		libraryRows(
			songs,
			{
				id: doc.id,
				name: doc.name,
				createdAt: doc.createdAt,
				updatedAt: doc.createdAt,
				fingerprint: doc.source?.fingerprint ?? null,
			},
			t('songs.untitled', language),
			// N.67 step 6: a song that cannot be written to keeps its STORED name
			// in the list, never the live one, which for a damaged record is a name
			// the page invented and can never save.
			doc.readOnly,
		),
	);

	/**
	 * Open another song. CLOSE() THEN OPEN(), never a prop change and never a
	 * reload.
	 *
	 * Measured 2026-08-18 on this Mac in Chromium, before the branch was chosen,
	 * from the score's bytes reaching the ingest path to a stave in the DOM:
	 * about 49 ms for a .musicxml and about 343 ms for a real 143 KB .musx, plus
	 * a vault read under a millisecond. A `location.reload()` measured 97 ms and
	 * 448 ms for the same two files and additionally throws away the tab, the
	 * drawer, the scroll position, and the loaded dictionary. So the reload
	 * branch costs more and buys nothing.
	 *
	 * `close()` flushes the outgoing song's debounce tail and tears its autosave
	 * down BEFORE the next document exists, so two documents never share an
	 * effect and a switch cannot cross-write one song's work into another's.
	 */
	async function switchSong(id: string): Promise<void> {
		if (id === doc.id || switching) return;
		switching = true;
		try {
			await doc.close();
			writeActiveSongId(localStorage, id);
			const next = await SongDocument.open(library, id);
			const bytes = await library.loadSource(id);
			// Everything belonging to the OUTGOING song, dropped before the new
			// document lands, so nothing of one song is ever drawn against the
			// other's music.
			resetSessionState();
			ingestedScore = null;
			lines = [];
			transcribeMs = 0;
			orphanedCount = 0;
			pairingCursor = 0;
			noLyricsFile = null;
			restoreSource = restoreFrom(bytes, next.source?.page);
			doc = next;
			await refreshSongs();
			// A SWITCH IS NOT A BOOT. The singer just chose this song, so Ilya
			// shows it to them rather than making them press Transcribe to see
			// what they left. It also has to run: `slotQueue` comes from `lines`,
			// so without it the placements would come back looking like drift.
			if (doc.inputText.trim() !== '' && !loaderState.isLoading && loaderState.entryCount > 0) {
				runPipeline();
				keepSurvivingGlosses();
			}
		} finally {
			switching = false;
		}
	}

	async function handleNewSong(): Promise<void> {
		// WRITTEN BEFORE IT IS OPENED, so a reload between the two finds a song
		// that is really there.
		const created = await createSong({ library, newId, now: () => new Date().toISOString() });
		if (!created.ok) {
			libraryError = t('songs.err.write', language);
			return;
		}
		libraryError = null;
		await refreshSongs();
		await switchSong(created.record.id);
	}

	function handleRenameSong(id: string, name: string): void {
		libraryError = null;
		// THE OPEN SONG IS RENAMED THROUGH ITS DOCUMENT. The document holds the
		// live record and would write its own name back over a rename that went
		// round it, so the rename would appear to work and then undo itself.
		if (id === doc.id) {
			// N.67 step 6: except when this song refuses to be written to at all.
			// Reported rather than swallowed, which is N.27's rule, and the sentence
			// already exists.
			if (doc.readOnly) {
				libraryError = t('songs.err.write', language);
				return;
			}
			doc.name = name;
			return;
		}
		void renameSong(library, id, name).then(async (outcome) => {
			if (!outcome.ok) libraryError = t('songs.err.write', language);
			await refreshSongs();
		});
	}

	function handleDeleteSong(id: string): void {
		const row = songRows.find((candidate) => candidate.id === id);
		if (!row) return;
		void askToReplace(
			t('songs.deleteTitle', language),
			t('songs.deleteBody', language).replace('%s', row.label),
			[
				{ label: t('songs.deleteConfirm', language), destructive: true, run: () => void commitDelete(id) },
				{ label: t('binder.exportFirst', language), run: () => void handleExport(id), keepOpen: true },
				{ label: t('replace.keep', language) },
			],
		);
	}

	/**
	 * Remove a song and its bytes together, or neither (design §2.1).
	 *
	 * SWITCH FIRST when the target is the song you are in. Its document is still
	 * autosaving, and a delete underneath a live document would be undone by that
	 * document's next write. `switchSong` closes it and flushes its tail, so what
	 * is deleted is a settled record and the survivor is already open.
	 */
	async function commitDelete(id: string): Promise<void> {
		if (id === doc.id) {
			const survivor = songRows.find((row) => row.id !== id);
			if (!survivor) {
				libraryError = t('songs.err.write', language);
				return;
			}
			await switchSong(survivor.id);
		}
		const outcome = await deleteSong(library.plural, id);
		libraryError = outcome.ok ? null : t('songs.err.write', language);
		await refreshSongs();
	}

	const songLibrary = $derived({
		songs: songRows,
		activeId: doc.id,
		// Six localStorage keys have no room for a second song and are not being
		// given one, so on the legacy driver New song and Delete do not render.
		plural: library.plural !== undefined,
		error: libraryError,
		// N.67 step 6. The two sentences a row may have to say about itself,
		// looked up here because the list holds no dictionary: `SongList.svelte`
		// draws, and every string it draws is handed to it.
		unreadable: t('song.unreadable', language),
		newerIlya: t('song.newerIlya', language),
		onopen: (id: string) => void switchSong(id),
		onnew: () => void handleNewSong(),
		onrename: handleRenameSong,
		ondelete: handleDeleteSong,
	});

	/* ── N.67 step 2: the source survives ──────────────────────────── */

	// The stored score, handed to the uploader so it can re-ingest it once at
	// boot. Read from the load result, not from the document: the document
	// carries the score's provenance, never its bytes.
	/**
	 * What the uploader needs to bring a stored score back.
	 *
	 * N.59 step 7: a page read off a picture comes back with the clef and key it
	 * was read with, so the restore never asks again.
	 */
	function restoreFrom(source: SourceBytes | null, page: PageProvenance | null | undefined) {
		if (!source) return null;
		return {
			fileName: source.fileName,
			bytes: source.bytes,
			answers: page ? { clef: page.clef, octaveChange: page.octaveChange, fifths: page.fifths } : null,
		};
	}

	// N.67 step 4b: STATE, because a switch hands the uploader a different
	// song's bytes. The uploader is keyed on `doc.id`, so it remounts and its
	// own restore runs, which is the same path a reload takes and no other.
	let restoreSource = $state(restoreFrom(opened?.source ?? null, opened?.loaded?.record?.source?.page));

	/**
	 * Keep the singer's own file, byte for byte.
	 *
	 * Two hashes, doing two different jobs (design §2.3, §2.4): `contentHash`
	 * names these exact bytes and can never go stale, and `fingerprint` answers
	 * "have I met this music before" for the recognition prompt step 4 builds.
	 * Neither is identity; the song id is.
	 */
	async function attachUploadedSource(
		ingested: IngestedScore,
		file: File,
		page?: PageProvenance,
	): Promise<void> {
		// N.59 step 7: on the reader route `file` is already the GREYSCALE INK,
		// so these bytes are the ones the retention ruling keeps and the ones a
		// re-read reproduces exactly. The picture the singer supplied is recorded
		// by name and hash inside `page` rather than kept twice.
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
			{ songId: doc.id, fileName: file.name, bytes, byteLength: bytes.byteLength, contentHash, importedAt },
			{
				fileName: file.name,
				byteLength: bytes.byteLength,
				importedAt,
				contentHash,
				fingerprint,
				page: page ?? null,
			},
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
		nameIfUnnamed();
	}

	/**
	 * Design §2.3 layer 3, called where the singer's material arrives: the
	 * metadata, whether typed or filled from a score header, and the poem.
	 *
	 * Not at creation, because a song made a moment ago has nothing to be named
	 * after, and not on every change, because a name the singer has accepted is
	 * theirs and Ilya does not argue with it. `nameFor` holds the rule.
	 */
	function nameIfUnnamed(): void {
		// N.67 step 6. Naming is a WRITE, and a record that could not be read is
		// never written to. Without this the page invents a name for a damaged
		// song on the singer's first keystroke and nothing can ever store it.
		if (doc.readOnly) return;
		if (doc.name !== '') return;
		const named = nameFor(doc.toRecord(), songs);
		if (named !== '') doc.name = named;
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
		// N.67 step 6. Step 1's storage console line is GONE, not moved: it said
		// it was there because "the storage COPY is step 6's work", and this is
		// step 6. What it logged is now drawn, in both languages.
		bootLines = bootNotices(
			{
				loadFailure: doc.loadFailure,
				persisted: opened?.storage.persisted ?? null,
				// A prerender pass has no vault and nothing to have lost.
				pointer: opened?.pointer ?? { stored: false, found: true, songCount: 0 },
			},
			globalStore(),
		);
		// N.67 step 4b. The library, read once at boot and refreshed after every
		// act that changes it. Not awaited into the boot path: a slow list must
		// not hold up the song the singer is already looking at.
		void refreshSongs();
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
<!-- N.73 portrait C, ruling 4: THE INTERSTITIAL IS RETIRED. The gate that
     stood here ("Ilya is designed for desktop / Continue anyway") met every
     phone visit and is Fable's audit finding F5. A portrait visit now arrives
     at the fitted page. Nothing replaced it: no residue, no toast, no
     one-time note, because Dann has never ruled where a residue goes. -->
<div class="screen-only">
	<HeaderBar {language} {activeTab} onlanguagechange={handleLanguageChange} />
<!-- N.67 step 4a. A NATIVE <dialog>, Dann's ruling 2026-08-16: bits-ui's
     AlertDialog measured +18.7 KB gzipped for this one thing, against about
     8 KB budgeted for the whole of N.67, and showModal() gives the modality,
     the focus trap, Escape, and the backdrop for nothing.

     THE SAFE ANSWER IS LAST IN THE DOM, which is both where Tab reaches it
     last and where it is drawn rightmost, which is where macOS puts the default
     and where a tired hand goes (Dann's ruling 2026-08-16, after he met this
     dialog at half past four in the morning). It is focused programmatically on
     open, so keyboard and mouse both land on it. This comment said `row-reverse`
     until N.67 step 5: the CSS reversal was removed when DOM order was made the
     visual order, and the actions row below has said so since. Escape resolves
     to the safe answer, because closing without answering changes nothing:
     nothing is mutated before the answer. -->
<!-- N.67 step 5. ONE hidden input serves both tabs' Import controls.
     `accept` is dropped on mobile for N.70's reason exactly: iOS matches by
     registered type and knows nothing of `.ilya`, so it would grey out every
     binder a singer owns, which would make the AirDrop half of the walk
     impossible. -->
<input
	type="file"
	accept={isMobile ? undefined : '.ilya'}
	bind:this={importInputEl}
	class="binder-input"
	onchange={(e) => {
		const input = e.currentTarget;
		const file = input.files?.[0];
		input.value = '';
		if (file) void handleImportFile(file);
	}}
/>

<dialog
	class="replace-dialog"
	bind:this={replaceDialogEl}
	oncancel={() => settleCollision('mine')}
	onclose={() => {
		// GUARDED ON THE DIALOG BEING SHUT. One collision's close event can arrive
		// after the next collision's dialog has already opened, and unguarded it
		// would blank the question now on screen and answer it for the singer.
		if (replaceDialogEl?.open) return;
		pendingArrival = null;
		pendingConfirm = null;
		settleCollision('mine');
	}}
	aria-labelledby="replace-title"
>
	{#if pendingConfirm}
		<h2 id="replace-title">{pendingConfirm.title}</h2>
		<p>{pendingConfirm.body}</p>
		<!-- DOM ORDER IS THE VISUAL ORDER. It used to be reversed in CSS, which
		     told a screen reader one order and showed a sighted singer another.
		     Keep is last, so it is rightmost where a tired hand goes, and it is
		     focused programmatically on open. -->
		<div class="replace-actions">
			{#each pendingConfirm.answers.slice(0, -1) as answer (answer.label)}
				<button
					type="button"
					class:replace-destructive={answer.destructive}
					onclick={() => answerWith(answer)}
				>
					{answer.label}
				</button>
			{/each}
			{#if safeAnswer}
				<button type="button" bind:this={keepButtonEl} onclick={() => answerWith(safeAnswer)}>
					{safeAnswer.label}
				</button>
			{/if}
		</div>
	{/if}
</dialog>

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
					onexport={() => void handleExport()}
					onimport={() => importInputEl?.click()}
					onexportall={() => void handleExportAll()}
					{songLibrary}
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
					<!-- N.67 step 4b. KEYED ON THE OPEN SONG. A switch replaces the
					     document, and this makes the uploader replace itself with it,
					     so the new song's stored score comes back through the uploader's
					     OWN restore: the same path a reload takes, and no second one. -->
					{#key doc.id}
						<ScoreUploader
							{language}
							{isMobile}
							restore={restoreSource}
							oningested={(ingested, file, origin, page) =>
								void handleArrival(ingested, file, origin, page)}
						/>
					{/key}
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
					{#if binderError}
						<!-- N.67 step 5. The file is untouched in every failure, which is
						     why all three sentences end the same way. -->
						<p class="shane-storage-notice">{binderError}</p>
					{/if}
					{#if binderNotice}
						<!-- N.67 step 5, the remainder. What an import ADDED. A "take the
						     one in this file" adds nothing, so it says nothing: the song it
						     overwrote moves to the top of the list, which is the change
						     the singer can see. -->
						<p class="shane-storage-notice">{binderNotice}</p>
					{/if}
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
					<!-- R5, N.27: no save site is silent. N.67 step 0 made this the
					     WHOLE song's report rather than the pairing map's alone, and
					     N.67 step 6 finalized what it says: quota with its figures,
					     eviction, no storage at all, the partial-loss oddity, an
					     unreadable record, and a record from a newer Ilya. WHICH
					     sentences and in WHAT ORDER is `notices.ts`, where a gate can
					     reach it. Unstyled on purpose, matching its neighbours. -->
					{#each storageLines as line}
						<p class="shane-storage-notice">{fillNotice(t(line.key, language), line.args)}</p>
					{/each}
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
					<!-- N.67 step 5. The SAME two controls in the SAME columns as the
					     Transcription drawer's binder row, so their position does not
					     move when a singer switches tabs (Dann's ruling 2026-08-16). -->
					<div class="shane-binder-row">
						<button class="shane-binder-btn" onclick={() => void handleExport()}>
							{t('binder.export', language)}
						</button>
						<button class="shane-binder-btn" onclick={() => importInputEl?.click()}>
							{t('binder.import', language)}
						</button>
						<!-- The row's third column has stood empty since the row was
						     built. Shown only above one song, because with one song it
						     says the same thing as the button beside it. -->
						{#if songRows.length > 1}
							<button class="shane-binder-btn" onclick={() => void handleExportAll()}>
								{t('binder.exportAll', language)}
							</button>
						{/if}
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
		<!-- THE DESK HEAD (N.73 S1 §2.2). One line across the top of the desk,
		     above the sheet, on every display. It is the cure for audit finding
		     F4: with the tab bar living inside the drawer, closing the drawer
		     took every destination with it. -->
		<DeskHead {activeTab} {language} ontabchange={handleTabChange} />
		{#if activeTab === 'transcription'}
			<!-- ONE Paper, rendered from one snippet in both branches. Two call
			     sites for the same component drift, and a drifted prop list here
			     would mean the phone and the desk stopped showing the same
			     document. -->
			{#snippet transcriptionPaper()}
				<Paper lines={effectiveLines} {notationPrefs} {language} metadata={doc.metadata} pageSize="letter" {isMobile} {showStressDiacritics} {spotReconstitution} glossOverrides={doc.glossOverrides} onwordclick={handleWordClick} />
			{/snippet}
			{#if isMobile}
				<!-- N.73 portrait C. The stage holds both views. The one that is
				     not showing goes off-stage rather than to display:none,
				     because TitleHeader measures itself with bind:offsetHeight
				     and a display:none element measures 0, which would
				     re-paginate the document on every tap. -->
				<div class="portrait-stage">
					<div class="stage-page" class:offstage={portraitView === 'aid'}>
						{@render transcriptionPaper()}
						{#if effectiveLines.length > 0}
							<!-- ONE labelled action, UNDER the page and never on it.
							     It sits in the flow rather than fixed to the bottom
							     of the screen: N.73 S1 deleted the last fixed bottom
							     furniture and gave the phone back its 92px, and this
							     is not the place to put furniture back. -->
							<button
								class="portrait-action"
								type="button"
								onclick={() => void showPortraitView('aid')}
							>
								{t('portrait.read', language)}
								<span class="portrait-action-chevron" aria-hidden="true">&rsaquo;</span>
							</button>
						{/if}
					</div>
					{#if effectiveLines.length > 0}
						<div class="stage-aid" class:offstage={portraitView === 'page'}>
							<ReadingAid
								lines={effectiveLines}
								{notationPrefs}
								{language}
								{showStressDiacritics}
								{spotReconstitution}
								glossOverrides={doc.glossOverrides}
								onreturn={() => void showPortraitView('page')}
							/>
						</div>
					{/if}
				</div>
			{:else}
				{@render transcriptionPaper()}
			{/if}
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
				{isMobile}
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
</div>
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
	/* N.67 step 5. The import input is never seen: both Import controls click
	   it. Not `display: none`, which some browsers refuse to activate. */
	.binder-input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}
	/* Twins .button-row's grid so the two controls land in the same columns as
	   the Transcription drawer's, which is what keeps their position identical
	   across tabs. */
	.shane-binder-row {
		display: grid;
		grid-template-columns: 1fr 1fr 2fr;
		gap: 6px;
		margin-top: 6px;
	}
	.shane-binder-btn {
		padding: 0.45rem 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ink-secondary);
		background: white;
		border: 1px solid var(--stone-600, #57534e);
		border-radius: 4px;
		cursor: pointer;
	}
	/* N.67 step 4a. The replace dialog. Unstyled beyond what modality needs,
	   matching the drawer's register rather than inventing a look. The
	   ::backdrop is the browser's own, dimmed a little. */
	.replace-dialog {
		/* `app.css:88-94` resets margin to 0 on every element, which overrides
		   the user-agent's `dialog { margin: auto }` and drops a modal at the
		   viewport's top-left corner. Measured on the deploy: (0, 0), 512 wide,
		   `:modal` true. Restoring the centring the browser already intended. */
		margin: auto;
		max-width: 32rem;
		padding: 1.25rem 1.5rem;
		border: 1px solid var(--stone-600, #57534e);
		border-radius: 6px;
		background: var(--paper-cream, #f5f0e6);
		color: var(--ink-primary, #1a1612);
		font-family: var(--font-sans);
	}
	.replace-dialog::backdrop {
		background: rgb(0 0 0 / 0.45);
	}
	.replace-dialog h2 {
		margin: 0 0 0.5rem;
		font-size: 1rem;
		font-weight: 600;
	}
	.replace-dialog p {
		margin: 0 0 1rem;
		font-size: 0.85rem;
		line-height: 1.5;
	}
	.replace-actions {
		display: flex;
		/* No `row-reverse` any more: the DOM order IS this order, so nothing a
		   singer sees disagrees with what a screen reader is told. */
		justify-content: flex-end;
		gap: 0.5rem;
	}
	.replace-actions button {
		padding: 0.45rem 0.75rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ink-secondary);
		background: white;
		border: 1px solid var(--stone-600, #57534e);
		border-radius: 4px;
		cursor: pointer;
	}
	/* The destructive one is not the pretty one, and it is not the loud one
	   either: no border, no fill, just the word in the colour of the warning.
	   It has to be findable, not inviting. */
	.replace-actions .replace-destructive {
		color: #7f1d1d;
		background: transparent;
		border-color: transparent;
		font-weight: 500;
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
		/* The desk head is flush with the SHEET's left edge, not the desk's
		   (placement B, ruled by Dann, N.42 §1.3). The two sheets are not the
		   same width, so the desk publishes the width of whichever one it is
		   holding and DeskHead takes its max-width from it. 816px is
		   PAGE_SIZES.letter.width in `$lib/page-config.ts`, which TitlePage
		   and SubsequentPage set on `.paper-page`. Below the mobile
		   breakpoint both sheets go full width and so does the head, so the
		   edges still agree. */
		--sheet-width: 816px;
		/* The desk head sticks to the top of this scroll region, and the
		   region's own top padding would otherwise leave a strip above the
		   head where the sheet slides past in the open. The head pulls itself
		   up by this much and pads itself back down by the same, so it covers
		   the strip and nothing below it moves. Every rule that changes the
		   desk's top padding sets this with it. */
		--desk-pad-top: 2rem;
	}

	/* N.73 S1b §4 deleted the override that stood here. It set --sheet-width
	   to 720px for Learn and Guide because ReadingPaper's max-width was 720px;
	   that max-width is now 816px, the same letter sheet the transcription
	   draws, so all four destinations take the 816px above and the desk head
	   lands on the sheet's left edge on every one of them. */

	/* ── Floating Paper: tab-specific surrounds (Approach A) ── */

	.main-content.tab-transcription {
		background-color: var(--surround-transcription, #D1D7CB);
	}

	.main-content.tab-learn {
		background-color: var(--surround-learn, #DBCACA);
	}

	.main-content.tab-guide {
		background-color: var(--surround-guide, #BEC7D8);
	}

	.main-content.tab-shane {
		/* One hue per working surface. Ruled by Dann 2026-08-19 during the
		   walk, superseding "one desk, many papers" (2026-07-12) and the S1
		   sage desk that carried it: the Marked score is a distinct working
		   surface, so it takes its own desk. --surround-marked is
		   --deeper-lavender tinted 60 percent toward white, parallel to the
		   other three. It is not --surround-shane, which is the calibration
		   pacifier band on white and stays where it is. The bar moves with
		   the desk (HeaderBar.svelte, .header-bar.tab-shane). */
		background-color: var(--surround-marked, #D2CBD7);
	}

	/* ── Floating Paper: the shadow ────────────────────────── */

	/* N.73 S1b §1 deleted three rules that stood here, one per destination,
	   each with its own shadow. They were `.main-content.tab-X :global(.Y)`,
	   which outweighs the sheets' own `.paper-page` and `.reading-paper` by
	   two class selectors, so a sheet's declared shadow never reached the
	   screen and changing it there would have done nothing. There is one
	   ruled shadow now, 0 3px 12px rgba(0, 0, 0, 0.35), and each sheet
	   component declares it. No per-destination differences: the sheet is
	   the same sheet on every desk, and only the desk under it changes. */

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
		--desk-pad-top: 1rem;
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
	/* ── Portrait C: the stage (N.73, ruled by Dann 2026-08-18) ──

	   The eleven rules that stood here dressed the interstitial. Ruling 4
	   retired it, so they are gone with it.

	   The stage exists on the phone and on the Transcription destination
	   only: the desktop renders Paper as a direct child of .main-content, as
	   it always has, and this wrapper is never in its DOM. */
	.portrait-stage {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stage-page,
	.stage-aid {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* NOT display:none. TitleHeader measures its own height with
	   bind:offsetHeight and a display:none element measures 0, so hiding the
	   page that way would collapse the row budget to its 9-row fallback,
	   re-slice the document, and re-slice it again on the way back. Off-stage
	   keeps the layout alive at a coordinate no scroll can reach: a left-to-
	   right document does not scroll into negative space. */
	.offstage {
		position: absolute;
		top: 0;
		left: -100000px;
		width: 100%;
	}

	/* ── The one labelled action ───────────────────────────── */

	.portrait-action {
		flex: 0 0 auto;
		margin: 1.25rem 0 0;
		border: 1px solid var(--ink-primary, #1a1612);
		border-radius: 4px;
		background: var(--ink-primary, #1a1612);
		color: var(--paper-cream, #F0EBE0);
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		/* 0.9rem either side of a 0.85rem line clears the 44px floor. */
		padding: 0.9rem 2.25rem;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.portrait-action-chevron {
		margin-left: 0.4em;
	}

	.portrait-action:focus-visible {
		outline: 2px solid var(--ink-primary, #1a1612);
		outline-offset: 3px;
	}

	/* PRINT EMITS THE PAGE. Whichever view the singer is looking at, the
	   action and the aid leave the sheet, and the page comes back on stage. */
	@media print {
		.portrait-action {
			display: none !important;
		}

		.stage-aid {
			display: none !important;
		}

		.stage-page.offstage {
			position: static !important;
			left: auto !important;
		}
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
			/* N.73 C2: the horizontal padding IS the gutter, so the page below
			   fills what is left and lands on the viewport width less twice
			   this number. The vertical stays where portrait C left it;
			   --desk-pad-top must match the top padding, and does. */
			padding: 0.5rem var(--portrait-gutter, 24px);
			width: 100%;
			align-items: flex-start;
			-webkit-overflow-scrolling: touch;
			transform: none;
			--desk-pad-top: 0.5rem;

			/* This reserved 92px at the bottom of the viewport for two pieces
			   of fixed furniture: the tab bar at 56px and the paper handle
			   sitting on it at 36px. Dann found the need for it under the
			   attribution's final line on 2026-08-11. N.73 S1 deleted both, so
			   the reservation goes with them and the phone gets its 92px back.
			   Nothing is fixed to the bottom of the desk any more; the drawer's
			   pull is on the side. */
			padding-bottom: 0.5rem;
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

	/* N.53 raised the toast to clear the fixed tab bar it was sitting on:
	   the bar was bottom 0, height 56px, z-index 50, and the toast at bottom
	   1.25rem covered its upper 36px. N.73 S1 deleted the bar, so the
	   clearance has nothing left to clear and the toast sits where the phone
	   has room for it. */
	@media (max-width: 767px) {
		.update-toast {
			bottom: 0.75rem;
		}
	}

	@media print {
		.update-toast {
			display: none;
		}
	}
</style>
