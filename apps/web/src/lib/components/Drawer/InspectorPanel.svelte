<script lang="ts">
	import type { WordStackData, YoToggle, SyllableOverride } from '$lib/types';
	import type { DisplayLogEntry } from '@ilya/blurb';
	import type { DictionaryEntry } from '@ilya/dictionary';
	import { applyNotationPreferences } from '@ilya/phonology';
	import type { NotationPreferences } from '@ilya/phonology';
	import { t, type Language } from '$lib/i18n';
	import { resolveFullGloss } from '$lib/gloss-resolve';

	import { openSyllabify, buildCharToSyllableMap, rebuildIpaFromSyllables, applySyllableOverride, computeBoundaries } from '$lib/syllable-utils';

	interface Props {
		word: WordStackData;
		language: Language;
		notationPrefs: NotationPreferences;
		openSyllabification?: boolean;
		showStressDiacritics?: boolean;
		/** Per-word syllable boundary override for this word, or null if none. */
		syllableOverride?: SyllableOverride | null;
		spotReconstituted?: boolean;
		/** True when this word was promoted from clitic status via user stress assignment. */
		promotedFromClitic?: boolean;
		/** Character-level ё toggles for this word, keyed by charIndex. */
		yoCharToggles?: Map<number, YoToggle>;
		onspotrecontoggle?: () => void;
		onstressassign?: (syllableIndex: number, source: string) => void;
		onstressrevert?: () => void;
		/** Character-level ё toggle: source = provenance, or null to revert. */
		onyochartoggle?: (charIndex: number, source: string | null) => void;
		/** Per-word syllable boundary override committed from drag-and-drop. */
		onsyllableoverride?: (override: SyllableOverride) => void;
		/** Clear per-word syllable override, reverting to global behaviour. */
		onsyllableoverrideclear?: () => void;
		/** Reset all per-word overrides (stress, ё, syllable, spot reconstitution). */
		onreset?: () => void;
		/** Current gloss override for this word, or undefined if none. */
		glossOverride?: string;
		/** Callback when the user edits the gloss in the Dictionary panel. */
		onglossoverride?: (gloss: string | null) => void;
	}

	let { word, language, notationPrefs, openSyllabification = false, showStressDiacritics = false, syllableOverride = null, spotReconstituted = false, promotedFromClitic = false, yoCharToggles = new Map(), onspotrecontoggle, onstressassign, onstressrevert, onyochartoggle, onsyllableoverride, onsyllableoverrideclear, onreset, glossOverride, onglossoverride }: Props = $props();

	// Whether this word is a proclitic or enclitic (no independent stress).
	// Declared here, ahead of displayCyrillic below, because it depends only
	// on word and nothing declared between here and its old position.
	const isClitic = $derived(word.isProclitic || word.isEnclitic);

	// ── Reconstitution derivations (bidirectional) ─────────────
	// Spot override always inverts the global setting for this word.
	// Global reduced (default) + spot checked = reconstitute this word.
	// Global reconstituted + spot checked = reduce this word.
	const reconActive = $derived(
		spotReconstituted ? !notationPrefs.reconstitution : notationPrefs.reconstitution
	);

	// Contextual label: checkbox always offers the inverse of the global setting
	const spotCheckboxLabel = $derived(
		notationPrefs.reconstitution
			? (language === 'en' ? 'Spot reduction' : 'Réduction ciblée')
			: (language === 'en' ? 'Spot reconstitution' : 'Reconstitution ciblée')
	);

	// Whether this word has distinct reduced/reconstituted forms
	const canSpotToggle = $derived(
		!!word.ipaOwnReconstituted && !!word.ipaContent && word.ipaOwnReconstituted !== word.ipaContent
	);

	// Per-entry reconstituted IPA map (index → reconstituted IPA for entries that differ)
	const reconstitutedIpaMap = $derived.by((): Map<number, string> => {
		if (!word.ipaContent || !word.ipaOwnReconstituted) return new Map();
		if (word.ipaContent === word.ipaOwnReconstituted) return new Map();

		const strip = (s: string) => s.replace(/[\sˈ]/g, '');
		const orig = strip(word.ipaContent);
		const recon = strip(word.ipaOwnReconstituted);

		if (orig.length !== recon.length) return new Map();

		const map = new Map<number, string>();
		let pos = 0;
		for (let i = 0; i < word.displayLog.length; i++) {
			const entryIpa = word.displayLog[i].ipa ?? '';
			if (entryIpa.length === 0) continue;
			const reconIpa = recon.substring(pos, pos + entryIpa.length);
			if (reconIpa !== entryIpa) {
				map.set(i, reconIpa);
			}
			pos += entryIpa.length;
		}
		return map;
	});

	// Cyrillic display: respect stress diacritics toggle (mirrors Paper WordStack pattern).
	// Acute accent is a confidence signal: suppress for clitics (no independent stress)
	// and inferred/VERIFY words (stress uncertain).
	const displayCyrillic = $derived(
		showStressDiacritics && !isClitic && word.stressSource !== 'inferred'
			? word.stressedCyrillic
			: word.cleanWord
	);

	// Header IPA: use ipaContent (pre-merge) for analysis, not ipaDisplay (fused clitic)
	const headerIpa = $derived.by(() => {
		const useReconstituted = reconActive && word.ipaOwnReconstituted;

		if (!useReconstituted && word.syllables?.length > 0) {
			// Check per-word override first, then global open syllabification
			if (syllableOverride) {
				const charIpas = word.displayLog.map(e => e.ipa ?? '');
				const resliced = applySyllableOverride(word.syllables, charIpas, syllableOverride);
				const base = rebuildIpaFromSyllables(resliced);
				return applyNotationPreferences(base, notationPrefs, true);
			}
			if (openSyllabification) {
				const resliced = openSyllabify(word.syllables);
				const base = rebuildIpaFromSyllables(resliced);
				return applyNotationPreferences(base, notationPrefs, true);
			}
		}

		const base = useReconstituted ? word.ipaOwnReconstituted : word.ipaContent;
		return base ? applyNotationPreferences(base, notationPrefs, true) : '';
	});

	// ── Open syllabification: compute effective syllables for Ribbon ──
	// Priority: per-word override > global open syllabification > engine default
	const effectiveSyllables = $derived.by(() => {
		if (!word.syllables || word.syllables.length <= 1) return word.syllables;
		if (syllableOverride) {
			const charIpas = word.displayLog.map(e => e.ipa ?? '');
			return applySyllableOverride(word.syllables, charIpas, syllableOverride);
		}
		if (openSyllabification) {
			return openSyllabify(word.syllables);
		}
		return word.syllables;
	});

	const charToSyllableRemap = $derived.by((): Map<number, number> | null => {
		if ((!openSyllabification && !syllableOverride) || !word.syllables || word.syllables.length <= 1) return null;
		return buildCharToSyllableMap(effectiveSyllables);
	});

	// ── Ribbon interaction state ────────────────────────────────
	let selectedCellIndex = $state(-1);
	let focusedCellIndex = $state(0);

	// Reset selection when the inspected word changes
	$effect(() => {
		void word.cleanWord;
		selectedCellIndex = -1;
		focusedCellIndex = 0;
		assigningSyllable = null;
		hoverDragIndices = new Set();
		hoverPreview = null;
		if (hoverDwellTimer) { clearTimeout(hoverDwellTimer); hoverDwellTimer = null; }
	});

	// ── Ribbon entries with clitic arrows ────────────────────────
	interface RibbonEntry {
		type: 'character' | 'clitic-arrow';
		entry?: DisplayLogEntry;
		char: string;
		ipa: string;
		index: number;
		/** Index in word.displayLog / cleanWord chars. -1 for clitic arrows. */
		displayLogIndex: number;
		direction?: 'proclitic' | 'enclitic';
		syllableIndex: number;
	}

	const ribbonEntries = $derived.by((): RibbonEntry[] => {
		const entries: RibbonEntry[] = [];
		let idx = 0;

		if (word.isEnclitic) {
			entries.push({
				type: 'clitic-arrow',
				char: '←',
				ipa: '',
				index: idx,
				displayLogIndex: -1,
				direction: 'enclitic',
				syllableIndex: -1,
			});
			idx++;
		}

		for (let di = 0; di < word.displayLog.length; di++) {
			const entry = word.displayLog[di];
			const baseIpa = entry.ipa ?? '';
			const displayIpa = reconActive && reconstitutedIpaMap.has(di)
				? reconstitutedIpaMap.get(di)!
				: baseIpa;
			const originalSi = entry.syllableIndex ?? 0;
			const si = charToSyllableRemap ? (charToSyllableRemap.get(di) ?? originalSi) : originalSi;
			// Apply combining acute accent to stressed vowel (ё/Ё are inherently stressed, never marked).
			// Suppress for clitics (no independent stress) and inferred/VERIFY words (stress uncertain).
			let displayChar = entry.char;
			if (showStressDiacritics && !isClitic && word.stressSource !== 'inferred' && entry.features?.type === 'vowel' && entry.features?.position === 'stressed' && entry.char !== 'ё' && entry.char !== 'Ё') {
				displayChar = entry.char + '\u0301';
			}
			entries.push({
				type: 'character',
				entry,
				char: displayChar,
				ipa: applyNotationPreferences(displayIpa, notationPrefs),
				index: idx,
				displayLogIndex: di,
				syllableIndex: si,
			});
			idx++;
		}

		if (word.isProclitic) {
			entries.push({
				type: 'clitic-arrow',
				char: '→',
				ipa: '',
				index: idx,
				displayLogIndex: -1,
				direction: 'proclitic',
				syllableIndex: -1,
			});
			idx++;
		}

		return entries;
	});

	// ── Syllable groups for Grayson positional headers ──────────
	interface SyllableGroup {
		syllableIndex: number;
		positionKey: string | null;
		entries: RibbonEntry[];
	}

	function getGraysonPositionKey(syllableIndex: number, stressIndex: number): string | null {
		if (stressIndex < 0) return null;
		if (syllableIndex === stressIndex) return 'ribbon.stressed';
		if (syllableIndex === stressIndex - 1) return 'ribbon.immediatePre';
		if (syllableIndex < stressIndex - 1) return 'ribbon.remotePre';
		if (syllableIndex === stressIndex + 1) return 'ribbon.immediatePost';
		return 'ribbon.remotePost';
	}

	const syllableGroups = $derived.by((): SyllableGroup[] => {
		const charEntries = ribbonEntries.filter(re => re.type === 'character');
		if (charEntries.length === 0) return [];

		const groups: SyllableGroup[] = [];
		let currentGroup: SyllableGroup | null = null;

		for (const re of charEntries) {
			if (!currentGroup || currentGroup.syllableIndex !== re.syllableIndex) {
				currentGroup = {
					syllableIndex: re.syllableIndex,
					positionKey: getGraysonPositionKey(re.syllableIndex, word.stressIndex),
					entries: [],
				};
				groups.push(currentGroup);
			}
			currentGroup.entries.push(re);
		}

		return groups;
	});

	const showSyllableGroups = $derived(syllableGroups.length > 0);

	const selectedRibbonEntry = $derived(
		selectedCellIndex >= 0 && selectedCellIndex < ribbonEntries.length
			? ribbonEntries[selectedCellIndex]
			: null
	);

	// ── Caret positioning via DOM measurement ───────────────
	let caretLeft = $state(0);
	let ribbonEl: HTMLElement | undefined = $state(undefined);

	$effect(() => {
		if (selectedCellIndex < 0 || !ribbonEl) return;
		const cell = ribbonEl.querySelector<HTMLElement>(
			`[data-cell-id="${word.lineIndex}-${word.wordIndex}-${selectedCellIndex}"]`
		);
		if (!cell) return;
		const ribbonRect = ribbonEl.getBoundingClientRect();
		const cellRect = cell.getBoundingClientRect();
		caretLeft = cellRect.left - ribbonRect.left + cellRect.width / 2;
	});

	let dragJustEnded = $state(false);

	function handleCellClick(index: number) {
		// Ignore click if a drag just completed (pointer up after drag)
		if (dragJustEnded) {
			dragJustEnded = false;
			return;
		}
		const entry = ribbonEntries[index];
		// Clitic arrows have no blurb
		if (entry?.type === 'clitic-arrow') return;
		if (selectedCellIndex === index) {
			selectedCellIndex = -1;
		} else {
			selectedCellIndex = index;
		}
		focusedCellIndex = index;
	}

	function handleRibbonKeydown(e: KeyboardEvent) {
		const len = ribbonEntries.length;
		if (len === 0) return;

		switch (e.key) {
			case 'ArrowRight': {
				e.preventDefault();
				const next = focusedCellIndex + 1;
				if (next < len) {
					focusedCellIndex = next;
					focusCellByIndex(next);
				}
				break;
			}
			case 'ArrowLeft': {
				e.preventDefault();
				const prev = focusedCellIndex - 1;
				if (prev >= 0) {
					focusedCellIndex = prev;
					focusCellByIndex(prev);
				}
				break;
			}
			case 'Enter':
			case ' ': {
				e.preventDefault();
				handleCellClick(focusedCellIndex);
				break;
			}
			case 'Escape': {
				if (selectedCellIndex >= 0) {
					e.preventDefault();
					e.stopPropagation();
					selectedCellIndex = -1;
				}
				break;
			}
		}
	}

	function focusCellByIndex(index: number) {
		requestAnimationFrame(() => {
			const el = document.querySelector<HTMLElement>(
				`[data-cell-id="${word.lineIndex}-${word.wordIndex}-${index}"]`
			);
			el?.focus();
		});
	}


	// ── Rubric label HTML with hard line breaks ─────────────────
	function getRubricHtml(positionKey: string, lang: Language): string {
		const text = t(positionKey, lang);
		if (positionKey === 'ribbon.stressed') return text;
		return text.replace(' ', '<br>');
	}

	// ── Stress assignment state ─────────────────────────────────
	const isUserStress = $derived(
		word.stressSource === 'user-dictionary' ||
		word.stressSource === 'user-composer' ||
		word.stressSource === 'user-override'
	);

	// Whether this word has any per-word overrides (controls reset button visibility)
	const hasOverrides = $derived(
		isUserStress || promotedFromClitic || yoCharToggles.size > 0 || syllableOverride !== null || spotReconstituted || glossOverride !== undefined
	);

	const syllableCount = $derived(word.syllables?.length ?? 0);

	const canAssignStress = $derived(syllableCount > 0);

	let assigningSyllable = $state<number | null>(null);

	const showRevertOption = $derived(
		assigningSyllable !== null &&
		assigningSyllable === word.stressIndex &&
		isUserStress
	);

	function handleCircleClick(syllableIndex: number) {
		if (!canAssignStress) return;
		// Close ё chooser if open (mutual exclusion)
		yoTogglePending = null;
		if (assigningSyllable === syllableIndex) {
			assigningSyllable = null;
		} else {
			assigningSyllable = syllableIndex;
		}
	}

	function handleProvenanceChoice(syllableIndex: number, source: string) {
		onstressassign?.(syllableIndex, source);
		assigningSyllable = null;
	}

	function handleRevert() {
		onstressrevert?.();
		assigningSyllable = null;
	}

	// ── Stress circle icon SVGs (match WordStack provenance icons) ──
	function getStressIconSvg(stressSource: string): string {
		switch (stressSource) {
			case 'dictionary':
			case 'supplement':
			case 'user-dictionary':
				// Open book: two pages with visible spine crease
				return '<path d="M8 2C6.5 1 4 .5 1 1v11c3 0 5.5.5 7 2 1.5-1.5 4-2 7-2V1c-3-.5-5.5 0-7 1z" fill="none" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><line x1="8" y1="2" x2="8" y2="14" stroke="white" stroke-width="1"/>';
			case 'user-composer':
				// Beamed eighth notes: two noteheads, two stems, one beam
				return '<ellipse cx="4" cy="13" rx="2.5" ry="1.8" transform="rotate(-20 4 13)" fill="white"/><ellipse cx="11.5" cy="12" rx="2.5" ry="1.8" transform="rotate(-20 11.5 12)" fill="white"/><rect x="5.5" y="1.5" width="1.3" height="11.5" fill="white"/><rect x="12.5" y="1.5" width="1.3" height="10.5" fill="white"/><rect x="5.5" y="1.5" width="8.3" height="2" rx="0.3" fill="white"/>';
			case 'user-override':
				// Genderless torso (same path as WordStack)
				return '<path d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 14s-1 0-1-1 1-5 6-5 6 4 6 5-1 1-1 1H3z" fill="white"/>';
			case 'inferred':
				// Question mark
				return '<text x="8" y="12" text-anchor="middle" font-size="12" font-weight="700" font-family="var(--font-sans)" fill="white">?</text>';
			default:
				return '<path d="M8 2C6.5 1 4 .5 1 1v11c3 0 5.5.5 7 2 1.5-1.5 4-2 7-2V1c-3-.5-5.5 0-7 1z" fill="none" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><line x1="8" y1="2" x2="8" y2="14" stroke="white" stroke-width="1"/>';
		}
	}

	// ── Blurb helpers ───────────────────────────────────────────
	function hasBlurb(entry: DisplayLogEntry): boolean {
		if (!entry.blurbData?.blurb) return false;
		const b = entry.blurbData.blurb;
		if (typeof b === 'string') return b.length > 0;
		return !!(b.en || b.fr);
	}

	function getBlurbText(entry: DisplayLogEntry, lang: Language): string {
		if (!entry.blurbData?.blurb) return '';
		const b = entry.blurbData.blurb;
		let text: string;
		if (typeof b === 'string') {
			text = b;
		} else {
			text = b[lang] ?? b.en ?? '';
		}
		// Apply notation preferences to IPA symbols in blurb text
		text = applyNotationPreferences(text, notationPrefs);
		// Prevent IPA notation from breaking across lines
		text = text.replace(/\/[^/]+\//g, m => `<span style="white-space:nowrap">${m}</span>`);
		text = text.replace(/\[[^\]]+\]/g, m => `<span style="white-space:nowrap">${m}</span>`);
		text = text.replace(/⟨[^⟩]+⟩/g, m => `<span style="white-space:nowrap">${m}</span>`);
		return text;
	}

	function getBlurbCitation(entry: DisplayLogEntry): string | null {
		return entry.blurbData?.citation ?? null;
	}

	// ── ё sigil interaction ──────────────────────────────────────

	const YO_CHARS = new Set(['е', 'ё', 'Е', 'Ё']);
	const YO_CANDIDATES = new Set(['е', 'Е']); // Only е can be toggled TO ё

	function isYoChar(char: string): boolean {
		return YO_CHARS.has(char);
	}

	/**
	 * Whether a sigil should appear for this entry.
	 * - е characters are candidates (could become ё)
	 * - User-toggled positions always show sigil (for undo)
	 * - Pipeline-confirmed ё characters do NOT show sigil
	 */
	function shouldShowYoSigil(re: RibbonEntry): boolean {
		if (re.type !== 'character') return false;
		if (yoCharToggles.has(re.displayLogIndex)) return true;
		// Use raw entry char (not display char which may have combining acute)
		const rawChar = re.entry?.char ?? re.char;
		return YO_CANDIDATES.has(rawChar);
	}

	/** Whether a character position is currently ё (filled circle). */
	function isYoActive(re: RibbonEntry): boolean {
		const rawChar = re.entry?.char ?? re.char;
		return rawChar === 'ё' || rawChar === 'Ё';
	}

	/** Pending yo toggle: charIndex of sigil awaiting provenance confirmation. */
	let yoTogglePending = $state<number | null>(null);

	// Reset yo pending when word changes
	$effect(() => {
		void word.cleanWord;
		yoTogglePending = null;
	});

	function handleYoSigilClick(re: RibbonEntry) {
		const charIdx = re.displayLogIndex;
		if (charIdx < 0) return;

		// Close stress chooser if open (mutual exclusion)
		assigningSyllable = null;

		// If this position already has a user toggle, clicking reverts (removes it)
		if (yoCharToggles.has(charIdx)) {
			onyochartoggle?.(charIdx, null);
			yoTogglePending = null;
			return;
		}

		// Otherwise, show provenance chooser for this position
		if (yoTogglePending === charIdx) {
			// Clicking same sigil again cancels
			yoTogglePending = null;
		} else {
			yoTogglePending = charIdx;
		}
	}

	function confirmYoToggle(source: string) {
		if (yoTogglePending === null) return;
		onyochartoggle?.(yoTogglePending, source);
		yoTogglePending = null;
	}

	// ── Character classification for drag eligibility ────────────
	const CY_VOWELS_DRAG = new Set('аеёиоуыэюяАЕЁИОУЫЭЮЯ'.split(''));
	const CY_SIGNS_SET = new Set(['ь', 'ъ', 'Ь', 'Ъ']);

	function isCyVowelChar(ch: string): boolean {
		return CY_VOWELS_DRAG.has(ch);
	}

	function isCySignChar(ch: string): boolean {
		return CY_SIGNS_SET.has(ch);
	}

	// ── Drag eligibility (boundary consonants only) ──────────────

	interface DragInfo {
		canDragLeft: boolean;
		canDragRight: boolean;
		/** All ribbon entry indices in this drag unit (self + tethered sign/host). */
		dragUnitIndices: number[];
		/** Syllable group index the atom would land in if dragged left. */
		leftTargetGroup?: number;
		/** Syllable group index the atom would land in if dragged right. */
		rightTargetGroup?: number;
	}

	const dragEligibility = $derived.by((): Map<number, DragInfo> => {
		const map = new Map<number, DragInfo>();
		if (isClitic || syllableGroups.length <= 1) return map;

		for (let gi = 0; gi < syllableGroups.length; gi++) {
			const group = syllableGroups[gi];
			const entries = group.entries;
			if (entries.length === 0) continue;

			const hasPrev = gi > 0;
			const hasNext = gi < syllableGroups.length - 1;

			// RIGHT boundary: last entry(ies) can drag right if next syllable exists
			if (hasNext) {
				const lastIdx = entries.length - 1;
				const lastChar = entries[lastIdx].char;

				if (!isCyVowelChar(lastChar)) {
					let unitIndices: number[];
					if (isCySignChar(lastChar) && lastIdx > 0) {
						// Sign at end: tethered pair with host consonant
						unitIndices = [entries[lastIdx - 1].index, entries[lastIdx].index];
					} else if (!isCySignChar(lastChar)) {
						// Consonant at end
						unitIndices = [entries[lastIdx].index];
					} else {
						continue; // Sign at position 0 with no host: skip
					}

					for (const idx of unitIndices) {
						const existing = map.get(idx);
						if (existing) {
							existing.canDragRight = true;
							existing.rightTargetGroup = gi + 1;
							for (const ui of unitIndices) {
								if (!existing.dragUnitIndices.includes(ui)) {
									existing.dragUnitIndices.push(ui);
								}
							}
						} else {
							map.set(idx, {
								canDragLeft: false,
								canDragRight: true,
								dragUnitIndices: [...unitIndices],
								rightTargetGroup: gi + 1,
							});
						}
					}
				}
			}

			// LEFT boundary: first entry(ies) can drag left if previous syllable exists
			if (hasPrev) {
				const firstChar = entries[0].char;

				if (!isCyVowelChar(firstChar) && !isCySignChar(firstChar)) {
					// Consonant at start
					let unitIndices: number[];
					if (entries.length > 1 && isCySignChar(entries[1].char)) {
						// Consonant followed by sign: tethered pair
						unitIndices = [entries[0].index, entries[1].index];
					} else {
						unitIndices = [entries[0].index];
					}

					for (const idx of unitIndices) {
						const existing = map.get(idx);
						if (existing) {
							existing.canDragLeft = true;
							existing.leftTargetGroup = gi - 1;
							for (const ui of unitIndices) {
								if (!existing.dragUnitIndices.includes(ui)) {
									existing.dragUnitIndices.push(ui);
								}
							}
						} else {
							map.set(idx, {
								canDragLeft: true,
								canDragRight: false,
								dragUnitIndices: [...unitIndices],
								leftTargetGroup: gi - 1,
							});
						}
					}
				}
			}
		}

		return map;
	});

	// ── Hover preview state ─────────────────────────────────────
	let hoverDragIndices = $state<Set<number>>(new Set());
	let hoverPreview = $state<{
		leftTargetGroup?: number;
		rightTargetGroup?: number;
		ghostCount: number;
	} | null>(null);
	let hoverDwellTimer: ReturnType<typeof setTimeout> | null = null;
	const HOVER_DWELL_MS = 150;

	function handleDragAtomEnter(ribbonIndex: number) {
		const info = dragEligibility.get(ribbonIndex);
		if (!info) return;

		// Immediate: highlight the drag unit
		hoverDragIndices = new Set(info.dragUnitIndices);

		// Deferred: show preview slots after dwell
		if (hoverDwellTimer) clearTimeout(hoverDwellTimer);
		hoverDwellTimer = setTimeout(() => {
			hoverPreview = {
				leftTargetGroup: info.canDragLeft ? info.leftTargetGroup : undefined,
				rightTargetGroup: info.canDragRight ? info.rightTargetGroup : undefined,
				ghostCount: info.dragUnitIndices.length,
			};
		}, HOVER_DWELL_MS);
	}

	function handleDragAtomLeave() {
		if (isDragging) return;
		if (hoverDwellTimer) { clearTimeout(hoverDwellTimer); hoverDwellTimer = null; }
		hoverDragIndices = new Set();
		hoverPreview = null;
	}

	// ── Drag interaction (pointer-based) ─────────────────────────

	let isDragging = $state(false);
	let dragOriginX = $state(0);
	let dragOriginY = $state(0);
	let dragRibbonIndex = $state(-1);
	let dragGhostLeft = $state(0);
	let dragGhostTop = $state(0);
	let dragGhostVisible = $state(false);
	/** Which direction(s) the current drag can resolve to. */
	let dragDirections = $state<{ left: boolean; right: boolean }>({ left: false, right: false });

	// Threshold in px: horizontal displacement to commit a drag
	const DRAG_THRESHOLD = 20;
	// Threshold to distinguish click from drag intent
	const DRAG_INTENT_THRESHOLD = 5;

	function handleDragPointerDown(e: PointerEvent, ribbonIndex: number) {
		const info = dragEligibility.get(ribbonIndex);
		if (!info) return;
		if (e.button !== 0) return;

		e.preventDefault();

		dragOriginX = e.clientX;
		dragOriginY = e.clientY;
		dragRibbonIndex = ribbonIndex;
		dragDirections = { left: info.canDragLeft, right: info.canDragRight };
		isDragging = false;
		dragGhostVisible = false;

		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handleDragPointerMove(e: PointerEvent) {
		if (dragRibbonIndex < 0) return;

		const dx = e.clientX - dragOriginX;
		const dy = e.clientY - dragOriginY;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (!isDragging && dist > DRAG_INTENT_THRESHOLD) {
			isDragging = true;
			e.preventDefault();
		}

		if (isDragging) {
			if (ribbonEl) {
				const rect = ribbonEl.getBoundingClientRect();
				dragGhostLeft = e.clientX - rect.left;
				dragGhostTop = e.clientY - rect.top;
				dragGhostVisible = true;
			}
		}
	}

	function handleDragPointerUp(e: PointerEvent) {
		if (dragRibbonIndex < 0) return;

		const wasDragging = isDragging;
		const dx = e.clientX - dragOriginX;
		const info = dragEligibility.get(dragRibbonIndex);

		// Release pointer capture
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			// Already released
		}

		// Reset drag state
		const prevDragIndex = dragRibbonIndex;
		isDragging = false;
		dragRibbonIndex = -1;
		dragGhostVisible = false;
		hoverDragIndices = new Set();
		hoverPreview = null;

		if (!wasDragging || !info) return;

		// Suppress the click event that follows pointerup
		dragJustEnded = true;
		setTimeout(() => { dragJustEnded = false; }, 50);

		// Determine direction and check threshold
		let direction: 'left' | 'right' | null = null;
		if (dx < -DRAG_THRESHOLD && info.canDragLeft) {
			direction = 'left';
		} else if (dx > DRAG_THRESHOLD && info.canDragRight) {
			direction = 'right';
		}

		if (!direction) return; // Snap back: no animation, no commit

		commitDrag(prevDragIndex, direction, info);
	}

	function commitDrag(ribbonIndex: number, direction: 'left' | 'right', info: DragInfo) {
		const re = ribbonEntries[ribbonIndex];
		if (!re || re.type !== 'character') return;

		const currentBoundaries = computeBoundaries(effectiveSyllables);
		if (currentBoundaries.length === 0) return;

		const dragUnitDisplayLogIndices = info.dragUnitIndices
			.map(idx => ribbonEntries[idx]?.displayLogIndex)
			.filter(di => di >= 0)
			.sort((a, b) => a - b);

		if (dragUnitDisplayLogIndices.length === 0) return;

		const currentGroupIdx = re.syllableIndex;
		const newBoundaries = [...currentBoundaries];

		if (direction === 'right' && currentGroupIdx < newBoundaries.length) {
			newBoundaries[currentGroupIdx] -= dragUnitDisplayLogIndices.length;
		} else if (direction === 'left' && currentGroupIdx > 0) {
			newBoundaries[currentGroupIdx - 1] += dragUnitDisplayLogIndices.length;
		} else {
			return;
		}

		// Validate: boundaries must be strictly ascending and non-negative
		for (let i = 0; i < newBoundaries.length; i++) {
			if (newBoundaries[i] < 0) return;
			if (i > 0 && newBoundaries[i] <= newBoundaries[i - 1]) return;
		}

		// Trigger breathing animation on the affected molecules
		breathingSource = currentGroupIdx;
		breathingDest = direction === 'right' ? currentGroupIdx + 1 : currentGroupIdx - 1;
		breathingActive = true;
		setTimeout(() => { breathingActive = false; }, 300);

		onsyllableoverride?.({ boundaries: newBoundaries });
	}

	// ── Breathing animation state (post-drag) ───────────────────
	let breathingActive = $state(false);
	let breathingSource = $state(-1);
	let breathingDest = $state(-1);

	// ── Dictionary panel state ──────────────────────────────────
	let dictPanelOpen = $state(false);
	let dictGlossInput = $state('');
	let dictPanelEl: HTMLElement | undefined = $state(undefined);
	let dictButtonEl: HTMLElement | undefined = $state(undefined);

	// Close dictionary panel when the inspected word changes
	$effect(() => {
		void word.cleanWord;
		dictPanelOpen = false;
	});

	// Sync input field with current gloss (override or dictionary)
	$effect(() => {
		if (dictPanelOpen) {
			dictGlossInput = glossOverride ?? word.gloss ?? '';
		}
	});

	function toggleDictPanel() {
		dictPanelOpen = !dictPanelOpen;
	}

	function handleGlossInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const value = input.value.slice(0, 20);
		dictGlossInput = value;
		if (value === '' || value === word.gloss) {
			// Revert to dictionary default
			onglossoverride?.(null);
		} else {
			onglossoverride?.(value);
		}
	}

	// Click-outside dismissal for dictionary panel
	function handleDictClickOutside(e: MouseEvent) {
		if (!dictPanelOpen || !dictPanelEl || !dictButtonEl) return;
		const target = e.target as Node;
		if (dictPanelEl.contains(target) || dictButtonEl.contains(target)) return;
		dictPanelOpen = false;
	}

	$effect(() => {
		if (dictPanelOpen) {
			const handleEscape = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					e.preventDefault();
					e.stopPropagation();
					dictPanelOpen = false;
				}
			};
			// Defer to next tick so the opening click doesn't immediately close
			const timer = setTimeout(() => {
				document.addEventListener('click', handleDictClickOutside, true);
				document.addEventListener('keydown', handleEscape, true);
			}, 0);
			return () => {
				clearTimeout(timer);
				document.removeEventListener('click', handleDictClickOutside, true);
				document.removeEventListener('keydown', handleEscape, true);
			};
		}
	});

	// ── Dictionary entry formatting helpers ──────────────────────

	/** Get the display gloss for the current language (full or truncated fallback). */
	function getDictDisplayGloss(entry: DictionaryEntry, lang: Language): string {
		if (lang === 'fr') {
			return entry.F || entry.f || entry.E || entry.e || '';
		}
		return entry.E || entry.e || '';
	}

	/** Format POS label from abbreviated dictionary field to readable label. */
	function formatPos(pos: string): string {
		const map: Record<string, string> = {
			'noun': 'noun', 'verb': 'verb', 'adj': 'adjective', 'adv': 'adverb',
			'prep': 'preposition', 'conj': 'conjunction', 'pron': 'pronoun',
			'part': 'particle', 'intj': 'interjection', 'num': 'numeral',
			'det': 'determiner', 'name': 'proper noun',
		};
		return map[pos] || pos;
	}

	/** Build the stress-marked Cyrillic for a dictionary entry's lemma. */
	function getStressedLemma(entry: DictionaryEntry): string {
		const lemma = entry.l || '';
		// entry.s absent means "no stress data": treat the same as the type's
		// own -2 "unknown" sentinel (packages/dictionary/src/types.ts), which
		// already falls into the unmarked-lemma branch below. Same output either way.
		const si = entry.s ?? -2;
		if (si < 0 || !lemma) return lemma;
		// Find the si-th vowel and insert combining acute after it
		const vowels = new Set('аеёиоуыэюяАЕЁИОУЫЭЮЯ'.split(''));
		let vowelCount = 0;
		for (let i = 0; i < lemma.length; i++) {
			if (vowels.has(lemma[i])) {
				if (vowelCount === si) {
					return lemma.slice(0, i + 1) + '\u0301' + lemma.slice(i + 1);
				}
				vowelCount++;
			}
		}
		return lemma;
	}

	// Derived: all dictionary entries for the current word, with stress-matched entry identified
	const dictEntries = $derived(word.allDictEntries ?? []);
	const stressMatchedIdx = $derived.by((): number => {
		if (dictEntries.length <= 1) return 0;
		return dictEntries.findIndex(e => e.s === word.stressIndex) ?? 0;
	});

	/**
	 * N.14b. An entry is a control only when there is a choice to make and the
	 * entry names a real syllable. -1 is the monosyllable sentinel and -2 the
	 * unknown one (packages/dictionary/src/types.ts); neither is somewhere a
	 * stress can be put.
	 */
	function isEntrySelectable(entry: DictionaryEntry): boolean {
		if (dictEntries.length <= 1) return false;
		const s = entry.s;
		return typeof s === 'number' && s >= 0;
	}

	/**
	 * Choosing a reading assigns its stress. The source is 'user-dictionary'
	 * because the dictionary is where this stress came from, and pipeline.ts
	 * writes the override before the engine runs, so the word re-transcribes
	 * rather than merely re-marking: го́ре is ˈɡorʲɪ where горе́ is ɡɑˈrʲɛ.
	 */
	function handleDictEntryClick(entry: DictionaryEntry): void {
		const s = entry.s;
		if (typeof s !== 'number' || s < 0) return;
		if (s === word.stressIndex) return;
		onstressassign?.(s, 'user-dictionary');
	}

</script>

<div
	class="inspector-panel"
	role="region"
	aria-label={displayCyrillic}
	tabindex="-1"
>
	<!-- ═══ Word content (breathes on word change) ═══ -->
	{#key word.cleanWord}
	<div class="word-content">

	<!-- ═══ 2. Word header ═══ -->
	<div class="word-header">
		<div class="word-header-group">
			<div class="word-stack">
				<h2 class="word-cyrillic">{displayCyrillic}</h2>
				<p class="word-ipa">{headerIpa}</p>
				<button
					class="dict-button"
					bind:this={dictButtonEl}
					aria-expanded={dictPanelOpen}
					onclick={toggleDictPanel}
				>
					{t('inspector.dictionary', language)}
				</button>

				<!-- Per-word reset: sigla-style, top-right corner of word stack -->
				{#if hasOverrides}
					<button
						class="reset-button"
						aria-label={language === 'en' ? 'Reset word to engine defaults' : 'Réinitialiser le mot aux valeurs par défaut'}
						onclick={() => onreset?.()}
					>
						<svg viewBox="0 0 16 16" class="reset-svg" aria-hidden="true"><path d="M3.5 6A5 5 0 1 1 4 10.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M1 5l2.5 1 1-2.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
					</button>
				{/if}
			</div>

			<!-- Spot reconstitution/reduction checkbox (tethered to stack's right edge) -->
			<div class="spot-checkbox-slot">
				{#if canSpotToggle}
					<label class="spot-checkbox-label">
						<span class="spot-checkbox-text">{spotCheckboxLabel}</span>
						<input
							type="checkbox"
							class="spot-checkbox"
							checked={spotReconstituted}
							onchange={() => onspotrecontoggle?.()}
						/>
					</label>
				{/if}
			</div>
		</div>
	</div>

	<!-- Dictionary expansion panel (overlay, full drawer width, sage) -->
	{#if dictPanelOpen}
		<div class="dict-expansion-anchor">
			<div class="dict-expansion" bind:this={dictPanelEl}>
				<svg class="dict-caret" width="16" height="10" viewBox="0 0 16 10" aria-hidden="true">
					<polygon points="0,10 8,0 16,10" fill="var(--sage)" />
				</svg>
				<div class="dict-lip" aria-hidden="true"></div>
				<div class="dict-panel">
					<!-- Editable gloss cell -->
					<div class="dict-edit-cell">
						<input
							class="dict-gloss-input"
							type="text"
							maxlength="20"
							value={dictGlossInput}
							oninput={handleGlossInput}
							aria-label={language === 'en' ? 'Edit gloss' : 'Modifier la glose'}
						/>
						<p class="dict-capacity">{t('inspector.dictCapacity', language)}</p>
					</div>

					<div class="dict-separator" aria-hidden="true"></div>

					<!-- Full dictionary entry (read-only) -->
					<div class="dict-entry-cell">
						{#if dictEntries.length === 0}
							<p class="dict-entry-missing">{t('inspector.dictEntryMissing', language)}</p>
						{:else}
							<!-- N.14b: with more than one reading, each entry is the control that
							     chooses it. onstressassign re-runs the pipeline, so the vowels
							     reduce to the new stress and the gloss follows it (pipeline.ts:270). -->
							{#snippet dictEntryBody(entry: DictionaryEntry)}
								{@const fullGloss = resolveFullGloss(entry, language)}
								<span class="dict-lemma">{getStressedLemma(entry)}</span>
								<span class="dict-pos">{formatPos(entry.p || '')}</span>
								{#if fullGloss}
									<span class="dict-senses">
										{#if fullGloss.fallback}
											<span
												class="gloss-lang-chip"
												aria-label={t(fullGloss.source === 'en' ? 'inspector.glossFallbackEN' : 'inspector.glossFallbackFR', language)}
											>{fullGloss.source === 'en' ? 'EN' : 'FR'}</span>
										{/if}{fullGloss.text}
									</span>
								{:else}
									<span class="dict-entry-missing">{t('inspector.dictEntryMissing', language)}</span>
								{/if}
							{/snippet}
							{#each dictEntries as entry, ei}
								{#if isEntrySelectable(entry)}
									<button
										type="button"
										class="dict-entry dict-entry-option"
										class:stress-matched={ei === stressMatchedIdx}
										aria-current={ei === stressMatchedIdx ? 'true' : undefined}
										aria-label={t('inspector.dictChoose', language) + ' ' + getStressedLemma(entry)}
										onclick={() => handleDictEntryClick(entry)}
									>
										{@render dictEntryBody(entry)}
									</button>
								{:else}
									<div class="dict-entry" class:stress-matched={ei === stressMatchedIdx && dictEntries.length > 1}>
										{@render dictEntryBody(entry)}
									</div>
								{/if}
								{#if ei < dictEntries.length - 1}
									<div class="dict-entry-divider" aria-hidden="true"></div>
								{/if}
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if ribbonEntries.length > 0}
		<div class="organism" class:blurb-open={selectedRibbonEntry !== null}>

			<div
				class="ribbon-body"
				role="listbox"
				aria-label={t('inspector.ribbon', language)}
				aria-orientation="horizontal"
				onkeydown={handleRibbonKeydown}
				bind:this={ribbonEl}
				tabindex="-1"
			>
				<!-- Enclitic arrow (standalone atom, no molecule) -->
				{#if word.isEnclitic}
					{@const arrowEntry = ribbonEntries[0]}
					<div class="syllable-column clitic-column">
						<div class="rubric-spacer" aria-hidden="true"></div>
						<div class="clitic-atom-wrap">
							<button
								class="atom clitic-atom"
								role="option"
								aria-selected={false}
								aria-label={t('inspector.cliticArrow.enclitic', language)}
								tabindex={focusedCellIndex === arrowEntry.index ? 0 : -1}
								data-cell-id="{word.lineIndex}-{word.wordIndex}-{arrowEntry.index}"
								onclick={() => handleCellClick(arrowEntry.index)}
							>
								<span class="atom-arrow-icon">{arrowEntry.char}</span>
							</button>
						</div>
						<div class="ordinal-spacer" aria-hidden="true"></div>
					</div>
				{/if}

				<!-- Syllable columns -->
				{#if showSyllableGroups}
					{#each syllableGroups as group, gi}
						<div class="syllable-column" role="group" aria-label="Syllable {group.syllableIndex + 1}">
							<!-- Rubric label (Grayson positional, display only) -->
							<div class="rubric-label">
								{#if isClitic}
									{t('ribbon.unstressed', language)}
								{:else if group.positionKey}
									{@html getRubricHtml(group.positionKey, language)}
								{/if}
							</div>

							<!-- Molecule (syllable bounding box) -->
							<div
								class="molecule"
								class:is-stressed={group.syllableIndex === word.stressIndex && !isClitic}
								class:breathing-source={breathingActive && group.syllableIndex === breathingSource}
								class:breathing-dest={breathingActive && group.syllableIndex === breathingDest}
							>
								<div class="atom-row">
									<!-- Drag preview: ghost slot at start (atom dragging right INTO this group) -->
									{#if hoverPreview?.rightTargetGroup === gi}
										{#each Array(hoverPreview.ghostCount) as _}
											<div class="drag-preview-slot" aria-hidden="true"></div>
										{/each}
									{/if}
									{#each group.entries as re, ai}
										{@const isDraggable = dragEligibility.has(re.index)}
										<button
											class="atom"
											class:stressed-vowel={re.entry?.features?.stressed && !isClitic}
											class:selected={selectedCellIndex === re.index}
											class:has-blurb={re.entry ? hasBlurb(re.entry) : false}
											class:draggable={isDraggable}
											class:drag-highlight={hoverDragIndices.has(re.index)}
											class:is-dragging={isDragging && hoverDragIndices.has(re.index)}
											role="option"
											aria-selected={selectedCellIndex === re.index}
											tabindex={focusedCellIndex === re.index ? 0 : -1}
											data-cell-id="{word.lineIndex}-{word.wordIndex}-{re.index}"
											onclick={() => handleCellClick(re.index)}
											onmouseenter={isDraggable ? () => handleDragAtomEnter(re.index) : undefined}
											onmouseleave={isDraggable ? handleDragAtomLeave : undefined}
											onpointerdown={isDraggable ? (e) => handleDragPointerDown(e, re.index) : undefined}
											onpointermove={isDraggable ? handleDragPointerMove : undefined}
											onpointerup={isDraggable ? handleDragPointerUp : undefined}
										>
											<span class="atom-char">{re.char}</span>
											<span class="atom-arrow">↓</span>
											<span class="atom-ipa">{re.ipa || '∅'}</span>
											{#if shouldShowYoSigil(re)}
												<!-- svelte-ignore a11y_no_static_element_interactions -->
												<span
													class="yo-sigla"
													class:pending={yoTogglePending === re.displayLogIndex}
													class:toggled={yoCharToggles.has(re.displayLogIndex)}
													class:is-yo={isYoActive(re)}
													role="button"
													tabindex={-1}
													aria-label={isYoActive(re) ? 'ё → е' : 'е → ё'}
													onclick={(e) => { e.stopPropagation(); handleYoSigilClick(re); }}
													onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); handleYoSigilClick(re); } }}
												>
													<span class="sigil-yo-char">ё</span>
												</span>
											{/if}
										</button>
									{/each}
									<!-- Drag preview: ghost slot at end (atom dragging left INTO this group) -->
									{#if hoverPreview?.leftTargetGroup === gi}
										{#each Array(hoverPreview.ghostCount) as _}
											<div class="drag-preview-slot" aria-hidden="true"></div>
										{/each}
									{/if}
								</div>
							</div>

							<!-- Ordinal with stress circle -->
							<div class="ordinal">
								<span class="ordinal-num">{group.syllableIndex + 1}</span>
								{#if canAssignStress}
									<button
										class="stress-circle"
										class:is-stressed={group.syllableIndex === word.stressIndex}
										class:is-assigning={assigningSyllable === group.syllableIndex}
										aria-label="{t('inspector.syllable', language)} {group.syllableIndex + 1}"
										onclick={() => handleCircleClick(group.syllableIndex)}
									>
										{#if group.syllableIndex === word.stressIndex}
											<svg class="stress-icon" viewBox="0 0 16 16" width="9" height="9" aria-hidden="true">
												{@html getStressIconSvg(word.stressSource)}
											</svg>
										{/if}
									</button>
								{/if}
							</div>
						</div>
					{/each}
				{:else}
					<!-- Fallback: flat ribbon when no syllable data -->
					{#each ribbonEntries.filter(re => re.type === 'character') as re}
						<div class="syllable-column">
							<div class="rubric-spacer" aria-hidden="true"></div>
							<div class="molecule">
								<div class="atom-row">
									<button
										class="atom"
										class:selected={selectedCellIndex === re.index}
										class:has-blurb={re.entry ? hasBlurb(re.entry) : false}
										role="option"
										aria-selected={selectedCellIndex === re.index}
										tabindex={focusedCellIndex === re.index ? 0 : -1}
										data-cell-id="{word.lineIndex}-{word.wordIndex}-{re.index}"
										onclick={() => handleCellClick(re.index)}
									>
										<span class="atom-char">{re.char}</span>
										<span class="atom-arrow">↓</span>
										<span class="atom-ipa">{re.ipa || '∅'}</span>
									</button>
								</div>
							</div>
							<div class="ordinal-spacer" aria-hidden="true"></div>
						</div>
					{/each}
				{/if}

				<!-- Proclitic arrow (standalone atom, no molecule) -->
				{#if word.isProclitic}
					{@const arrowEntry = ribbonEntries[ribbonEntries.length - 1]}
					<div class="syllable-column clitic-column">
						<div class="rubric-spacer" aria-hidden="true"></div>
						<div class="clitic-atom-wrap">
							<button
								class="atom clitic-atom"
								role="option"
								aria-selected={false}
								aria-label={t('inspector.cliticArrow.proclitic', language)}
								tabindex={focusedCellIndex === arrowEntry.index ? 0 : -1}
								data-cell-id="{word.lineIndex}-{word.wordIndex}-{arrowEntry.index}"
								onclick={() => handleCellClick(arrowEntry.index)}
							>
								<span class="atom-arrow-icon">{arrowEntry.char}</span>
							</button>
						</div>
						<div class="ordinal-spacer" aria-hidden="true"></div>
					</div>
				{/if}
			</div>

			<!-- Drag ghost overlay -->
			{#if dragGhostVisible && dragRibbonIndex >= 0}
				{@const dragEntry = ribbonEntries.find(re => re.index === dragRibbonIndex)}
				{#if dragEntry}
					<div
						class="drag-ghost"
						style="left: {dragGhostLeft}px; top: {dragGhostTop}px;"
						aria-hidden="true"
					>
						<span class="drag-ghost-char">{dragEntry.char}</span>
						<span class="drag-ghost-arrow">↓</span>
						<span class="drag-ghost-ipa">{dragEntry.ipa || '∅'}</span>
					</div>
				{/if}
			{/if}

			<!-- Yo provenance chooser (inside organism, below ribbon) -->
			{#if yoTogglePending !== null}
				<div class="yo-chooser-wrapper">
					<div class="yo-chooser">
						<span class="yo-chooser-label">
							{t('inspector.yoToggle', language)}:
						</span>
						<button class="provenance-choice" onclick={() => confirmYoToggle('user-dictionary')}>
							{t('inspector.stressAssign.dictionary', language)}
						</button>
						<button class="provenance-choice" onclick={() => confirmYoToggle('user-composer')}>
							{t('inspector.stressAssign.composer', language)}
						</button>
						<button class="provenance-choice" onclick={() => confirmYoToggle('user-override')}>
							{t('inspector.stressAssign.myAssignment', language)}
						</button>
					</div>
				</div>
			{/if}

			<!-- Stress provenance chooser (inside organism, below ribbon) -->
			{#if assigningSyllable !== null}
				<div class="stress-chooser-wrapper">
					<div class="stress-chooser">
						<span class="chooser-label">
							{t('inspector.syllable', language)} {assigningSyllable + 1}:
						</span>
						<button class="provenance-choice" onclick={() => handleProvenanceChoice(assigningSyllable!, 'user-dictionary')}>
							{t('inspector.stressAssign.dictionary', language)}
						</button>
						<button class="provenance-choice" onclick={() => handleProvenanceChoice(assigningSyllable!, 'user-composer')}>
							{t('inspector.stressAssign.composer', language)}
						</button>
						<button class="provenance-choice" onclick={() => handleProvenanceChoice(assigningSyllable!, 'user-override')}>
							{t('inspector.stressAssign.myAssignment', language)}
						</button>
						{#if showRevertOption}
							<button class="provenance-choice revert-choice" onclick={handleRevert}>
								{t('inspector.stressAssign.default', language)}
							</button>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Blurb area (inside organism, below ribbon body) -->
			<div class="blurb-wrapper" class:open={selectedRibbonEntry !== null}>
				<div class="blurb-inner">
					{#if selectedRibbonEntry}
						<div class="blurb-container">
							<!-- SVG caret: filled sage, matching dict-caret pattern -->
							<svg
								class="blurb-caret"
								width="16"
								height="10"
								viewBox="0 0 16 10"
								aria-hidden="true"
								style="left: {caretLeft}px"
							>
								<polygon points="0,10 8,0 16,10" fill="var(--sage)" />
							</svg>
							<div class="blurb-lip" aria-hidden="true"></div>
							<div class="blurb-box" aria-live="polite">
								{#if promotedFromClitic}
									<p class="blurb-promotion">
										{language === 'en'
											? 'This word was originally identified as an unstressed clitic. Independent stress has been assigned, and the word now receives its own phonological treatment.'
											: 'Ce mot a été identifié comme un clitique atone. Un accent indépendant lui a été attribué, et il reçoit désormais son propre traitement phonologique.'}
									</p>
									<div class="blurb-promotion-divider"></div>
								{/if}
								{#if selectedRibbonEntry.entry}
									<p class="blurb-header">
										<span class="blurb-char">{selectedRibbonEntry.char}</span>
										<span class="blurb-arrow-sep">→</span>
										<span class="blurb-ipa">{selectedRibbonEntry.ipa || '∅'}</span>
									</p>
									{#if hasBlurb(selectedRibbonEntry.entry)}
										<p class="blurb-text">{@html getBlurbText(selectedRibbonEntry.entry, language)}</p>
										{#if getBlurbCitation(selectedRibbonEntry.entry)}
											<p class="blurb-citation">{getBlurbCitation(selectedRibbonEntry.entry)}</p>
										{/if}
									{:else}
										<p class="blurb-no-text">{t('inspector.noBlurb', language)}</p>
									{/if}
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- ═══ 4. Provenance section: REMOVED (Phase A vertical optimization) ═══ -->

	<!-- ═══ 5. Spot reconstitution: RELOCATED to below word card ═══ -->

	</div>
	{/key}

	<!-- ═══ 6. Notation indicator: REMOVED (Phase A vertical optimization) ═══ -->
</div>

<style>
	.inspector-panel {
		display: flex;
		flex-direction: column;
		gap: 0;
		padding: 1.5rem;
	}

	/* ═══ Word-change breath (sections 2–5) ══════════════════════ */

	.word-content {
		animation: breathIn 300ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes breathIn {
		from { opacity: 0; transform: translateY(-2px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.word-content {
			animation: none;
		}
	}

	/* ═══ 2. Word header ═════════════════════════════════════════ */

	.word-header {
		margin-bottom: 0.5rem;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 0.5rem;
		/* N.24: symmetric with .organism. The right margin cancels all 40px of
		   inset and the left must too, or the box is 16px narrower on the left
		   and its contents centre 8px right of the drawer's true centre. */
		margin-left: -2.5rem;
		margin-right: -2.5rem;
		width: calc(100% + 5rem);
	}

	.word-header-group {
		display: inline-flex;
		flex-direction: column;
		align-items: stretch;
	}

	.word-stack {
		display: inline-flex;
		flex-direction: column;
		align-items: flex-start;
		border: 1.5px solid var(--stone-400, #a8a29e);
		border-radius: 6px;
		padding: 0.5rem 0.75rem;
		background: var(--paper-cream);
		position: relative;
	}

	.word-cyrillic {
		font-family: var(--font-serif);
		font-size: 1.6rem;
		font-weight: 600;
		color: var(--ink-primary);
		margin-bottom: 0.1rem;
		line-height: 1.3;
	}

	.word-ipa {
		font-family: var(--font-sans);
		font-size: 1.15rem;
		color: var(--ink-secondary);
		margin-bottom: 0.15rem;
		line-height: 1.3;
	}

	.word-gloss {
		font-family: var(--font-serif);
		font-size: 0.85rem;
		color: var(--sage);
		font-style: italic;
		line-height: 1.3;
	}

	.word-gloss-missing {
		font-family: var(--font-serif);
		font-size: 0.8rem;
		color: var(--ink-tertiary);
		font-style: italic;
		line-height: 1.4;
	}

	/* ═══ Dictionary panel ═══════════════════════════════════════ */

	.dict-button {
		display: block;
		width: 100%;
		min-width: 160px;
		padding: 0.4rem 0.75rem;
		margin-top: 0.25rem;
		background: var(--sage);
		color: #fff;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		text-align: center;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 150ms ease, opacity 150ms ease;
	}

	.dict-button:hover {
		background: var(--deeper-sage, #7A8A6C);
	}

	.dict-button:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: 2px;
	}

	.dict-button[aria-expanded="true"] {
		background: #6B7B5E;
	}

	.dict-expansion-anchor {
		position: relative;
		z-index: 20;
		/* N.24: symmetric with .organism. The right margin cancels all 40px of
		   inset and the left must too, or the box is 16px narrower on the left
		   and its contents centre 8px right of the drawer's true centre. */
		margin-left: -2.5rem;
		margin-right: -2.5rem;
		width: calc(100% + 5rem);
	}

	.dict-expansion {
		padding: 0 1rem;
		animation: dictFadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1) both;
	}

	@keyframes dictFadeIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dict-expansion {
			animation: none;
		}
	}

	.dict-caret {
		display: block;
		margin: 0 auto -1px;
		overflow: visible;
	}

	.dict-lip {
		height: 6px;
		background: var(--sage);
		border-radius: 3px 3px 0 0;
	}

	.dict-panel {
		background: var(--paper-cream, #FDFBF7);
		border: 2px solid var(--sage);
		border-top: none;
		border-radius: 0 0 6px 6px;
		overflow: hidden;
	}

	.dict-edit-cell {
		padding: 0.5rem 0.6rem 0.3rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		background: #fff;
	}

	.dict-gloss-input {
		width: 100%;
		font-family: var(--font-serif);
		font-size: 0.85rem;
		font-style: italic;
		color: var(--sage);
		padding: 0.3rem 0.4rem;
		border: 1px solid var(--sage);
		border-radius: 3px;
		background: #fff;
		outline: none;
		box-sizing: border-box;
		transition: border-color 150ms ease, box-shadow 150ms ease;
	}

	.dict-gloss-input:focus {
		border-color: var(--sage);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--sage) 25%, transparent);
	}

	.dict-capacity {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--sage);
		text-align: right;
		margin: 0;
	}

	.dict-separator {
		height: 1px;
		background: color-mix(in srgb, var(--sage) 20%, transparent);
	}

	.dict-entry-cell {
		padding: 0.6rem;
		background: #F0F3EE;
	}

	.dict-entry {
		font-weight: 400;
	}

	.dict-entry.stress-matched {
		font-weight: 600;
	}

	/* N.14b: an entry that can be chosen. Reset to the surrounding type rather
	   than a button's, so the panel reads as prose until it is touched. */
	.dict-entry-option {
		display: block;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		font: inherit;
		color: inherit;
		padding: 0.25rem;
		margin: -0.25rem;
		border-radius: 3px;
		cursor: pointer;
	}

	.dict-entry-option:hover {
		background: color-mix(in srgb, var(--sage) 12%, transparent);
	}

	.dict-entry-option:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: 1px;
	}

	.dict-entry-option[aria-current='true'],
	.dict-entry-option[aria-current='true']:hover {
		cursor: default;
		background: none;
	}

	.dict-lemma {
		display: block;
		font-family: var(--font-serif);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ink-primary);
		margin-bottom: 0.1rem;
	}

	.dict-pos {
		display: block;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		color: var(--ink-tertiary);
		font-style: italic;
		margin-bottom: 0.25rem;
	}

	.gloss-lang-chip {
		font-family: var(--font-sans);
		font-size: 0.65rem;
		font-variant-caps: all-small-caps;
		letter-spacing: 0.08em;
		color: var(--ink-tertiary);
		border: 1px solid var(--ink-tertiary);
		border-radius: 3px;
		padding: 0 0.3em;
		margin-right: 0.45em;
		vertical-align: 0.08em;
		font-style: normal;
	}

	.dict-senses {
		display: block;
		font-family: var(--font-serif);
		font-size: 15px;
		color: var(--ink-primary);
		line-height: 1.6;
	}

	.dict-entry-missing {
		display: block;
		font-family: var(--font-serif);
		font-size: 0.8rem;
		color: var(--sage);
		font-style: italic;
	}

	.dict-entry-divider {
		height: 1px;
		background: color-mix(in srgb, var(--sage) 15%, transparent);
		margin: 0.5rem 0;
	}

	/* ═══ 3. Organism (ribbon frame) ═════════════════════════════ */

	.organism {
		position: relative;
		background: rgba(139, 154, 125, 0.15);
		border-radius: 0;
		padding: 2px 1rem 10px;
		margin-left: -2.5rem;
		margin-right: -2.5rem;
		margin-bottom: 0.5rem;
		width: calc(100% + 5rem);
	}

	/* ── Ribbon body: flex row of syllable columns ─────────────── */

	.ribbon-body {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	/* ── Syllable column: rubric + molecule + sigla + ordinal ── */

	.syllable-column {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0;
		flex-shrink: 0;
	}

	.clitic-column {
		/* Uniform structure: rubric-spacer + clitic-atom-wrap + ordinal-spacer */
	}

	/* ── Rubric labels (Grayson positional headers) ───────────── */

	.rubric-label {
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 400;
		font-variant-caps: all-small-caps;
		letter-spacing: 0.08em;
		color: var(--ink-secondary);
		line-height: 1.2;
		text-align: center;
		min-height: 34px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: 0 2px 4px;
		width: 100%;
	}

	.rubric-spacer {
		min-height: 34px;
		padding-bottom: 4px;
	}

	/* ── Molecules (syllable bounding boxes) ─────────────────── */

	.molecule {
		position: relative;
		display: flex;
		gap: 2px;
		padding: 3px;
		border: 1.5px solid var(--stone-400, #a8a29e);
		border-radius: 6px;
		transition: border-color 150ms ease, box-shadow 150ms ease;
	}

	.molecule.is-stressed {
		border: 2.5px solid var(--sage);
		padding: 2px;
		box-shadow: 0 0 0 2px rgba(139, 154, 125, 0.2);
	}

	.atom-row {
		display: flex;
		gap: 2px;
	}

	/* ── Yo sigla (ejected from bottom of atom) ────────────────── */

	.yo-sigla {
		margin-top: auto;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 1px solid var(--stone-500, #78716c);
		background: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.25;
		cursor: pointer;
		transition: opacity 150ms ease, background-color 150ms ease, border-color 150ms ease;
		pointer-events: auto;
	}

	.yo-sigla:hover {
		opacity: 1;
	}

	.yo-sigla:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: 1px;
		opacity: 1;
	}

	.yo-sigla.pending {
		opacity: 0.8;
		border-color: var(--sage);
	}

	.yo-sigla.is-yo {
		opacity: 0.4;
		background: var(--sage);
		border-color: var(--sage);
	}

	.yo-sigla.is-yo .sigil-yo-char {
		color: white;
	}

	.yo-sigla.is-yo:hover {
		opacity: 1;
	}

	.yo-sigla.toggled {
		opacity: 0.6;
		border-color: var(--sage);
	}

	.sigil-yo-char {
		font-family: var(--font-sans);
		font-size: 9px;
		font-weight: 700;
		line-height: 1;
		color: var(--stone-700, #44403c);
	}

	/* ── Yo provenance chooser (inside organism) ─────────────── */

	.yo-chooser-wrapper {
		padding: 8px 0 4px;
		border-top: 1px solid var(--stone-200, #e7e5e4);
		margin-top: 8px;
	}

	.yo-chooser {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		align-items: baseline;
		animation: blurbFadeIn 200ms ease both;
	}

	.yo-chooser-label {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-secondary);
		margin-right: 0.25rem;
	}

	.stress-chooser-wrapper {
		padding: 8px 0 4px;
		border-top: 1px solid var(--stone-200, #e7e5e4);
		margin-top: 8px;
	}

	.stress-chooser {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		align-items: baseline;
		animation: blurbFadeIn 200ms ease both;
	}

	.chooser-label {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-secondary);
		margin-right: 0.25rem;
	}

	.revert-choice {
		border-style: dashed;
	}

	/* ── Atoms (glyph cells) ─────────────────────────────────── */

	.atom {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: 6px;
		width: 32px;
		height: 100px;
		padding: 18px 0 4px;
		background: var(--paper-cream);
		border: 1px solid var(--stone-300);
		border-radius: 4px;
		cursor: pointer;
		font-family: inherit;
		transition: border-color 150ms ease, background-color 150ms ease;
		user-select: none;
	}

	.atom:hover {
		background: #faf8f4;
		border-color: var(--sage);
	}

	.atom:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: -2px;
		z-index: 1;
	}

	.atom.stressed-vowel {
		background: #fdf6e8;
	}

	.atom.selected {
		background: #FAF7F2;
		border-color: var(--sage);
		box-shadow: inset 0 0 6px rgba(139, 154, 125, 0.15);
	}

	/* Subtle blurb indicator dot */
	.atom.has-blurb::after {
		content: '';
		display: block;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--sage);
		opacity: 0.4;
		margin-top: 1px;
	}

	.atom.selected.has-blurb::after {
		opacity: 0.8;
	}

	/* Suppress blurb dot when yo sigla is present */
	.atom:has(.yo-sigla).has-blurb::after {
		display: none;
	}

	/* ── Drag eligibility visual affordance ──────────────────── */

	.atom.draggable {
		cursor: grab;
	}

	.atom.drag-highlight {
		border-color: var(--sage);
		background: #faf8f4;
		box-shadow: 0 0 0 1px rgba(139, 154, 125, 0.25);
	}

	/* ── Drag preview ghost slot ────────────────────────────── */

	.drag-preview-slot {
		width: 6px;
		height: 80px;
		align-self: center;
		border: 1px dashed var(--stone-300, #d6d3d1);
		border-radius: 2px;
		opacity: 0.7;
		flex-shrink: 0;
	}

	/* ── Atom during active drag ────────────────────────────── */

	.atom.is-dragging {
		opacity: 0.3;
		border-style: dashed;
	}

	/* ── Drag ghost (follows cursor) ────────────────────────── */

	.drag-ghost {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: 6px;
		width: 32px;
		height: 100px;
		padding: 18px 0 4px;
		background: var(--paper-cream);
		border: 1.5px solid var(--sage);
		border-radius: 4px;
		opacity: 0.4;
		pointer-events: none;
		z-index: 10;
		transform: translate(-50%, -50%);
		box-shadow: 0 2px 8px rgba(26, 22, 18, 0.12);
	}

	.drag-ghost-char {
		font-family: var(--font-serif);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink-primary);
		line-height: 1;
	}

	.drag-ghost-arrow {
		font-size: 0.7rem;
		color: var(--ink-tertiary);
		line-height: 1;
	}

	.drag-ghost-ipa {
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--ink-secondary);
		line-height: 1;
	}

	/* ── Breathing animation (post-drag commit) ─────────────── */

	.molecule.breathing-source {
		animation: breatheCompress 300ms ease;
	}

	.molecule.breathing-dest {
		animation: breatheExpand 300ms ease;
	}

	@keyframes breatheCompress {
		0%   { transform: scaleX(1); }
		40%  { transform: scaleX(0.92); }
		100% { transform: scaleX(1); }
	}

	@keyframes breatheExpand {
		0%   { transform: scaleX(1); }
		40%  { transform: scaleX(1.06); }
		100% { transform: scaleX(1); }
	}

	@media (prefers-reduced-motion: reduce) {
		.molecule.breathing-source,
		.molecule.breathing-dest {
			animation: none;
		}
	}

	.atom-char {
		font-family: var(--font-serif);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink-primary);
		line-height: 1;
	}

	.atom-arrow {
		font-size: 0.7rem;
		color: var(--ink-tertiary);
		line-height: 1;
	}

	.atom-ipa {
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--ink-secondary);
		line-height: 1;
	}

	/* ── Clitic arrow atom (standalone, no molecule) ──────────── */

	.clitic-atom-wrap {
		display: flex;
		padding: 3px;
		border: 1.5px solid transparent;
	}

	.clitic-atom {
		width: 32px;
		height: 100px;
		padding: 10px 0;
		background: transparent;
		border: 1px solid var(--stone-200, #e7e5e4);
		border-radius: 4px;
		cursor: default;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: inherit;
	}

	.atom-arrow-icon {
		font-size: 1.1rem;
		color: var(--stone-400, #a8a29e);
		font-weight: 600;
		line-height: 1;
	}

	/* ── Ordinals ────────────────────────────────────────────── */

	.ordinal {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 3px;
		margin-top: 4px;
		padding-left: 2px;
	}

	.ordinal-num {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--ink-secondary);
		line-height: 1;
	}

	.ordinal-spacer {
		margin-top: 4px;
		min-height: 12px;
	}

	.stress-circle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 1px solid var(--stone-500);
		background: transparent;
		opacity: 0.25;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
		transition: opacity 150ms ease, background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
	}

	.stress-circle:hover {
		opacity: 1;
		border-color: var(--sage);
	}

	.stress-circle.is-stressed {
		background: var(--sage);
		border-color: var(--sage);
		opacity: 1;
	}

	.stress-circle.is-stressed:hover {
		background: var(--deeper-sage, #7A8A6C);
		border-color: var(--deeper-sage, #7A8A6C);
	}

	.stress-circle.is-assigning {
		border-color: var(--sage);
		opacity: 1;
		box-shadow: 0 0 0 2px rgba(139, 154, 125, 0.3);
	}

	.stress-icon {
		display: block;
	}

	/* ═══ Blurb (inside organism, below ribbon body) ══════════════ */

	.blurb-wrapper {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 250ms ease;
	}

	.blurb-wrapper.open {
		grid-template-rows: 1fr;
	}

	.blurb-inner {
		overflow: hidden;
	}

	.blurb-container {
		position: relative;
		margin-top: 14px;
		padding-bottom: 4px;
		animation: blurbFadeIn 250ms ease both;
	}

	@keyframes blurbFadeIn {
		from {
			opacity: 0;
			transform: scale(0.98) translateY(4px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.blurb-caret {
		position: absolute;
		top: -9px;
		margin-left: -8px;
		margin-bottom: -1px;
		z-index: 1;
		overflow: visible;
		transition: left 200ms ease;
	}

	.blurb-lip {
		height: 6px;
		background: var(--sage);
		border-radius: 3px 3px 0 0;
	}

	.blurb-box {
		background: #F5F0E8;
		border: 2px solid var(--sage);
		border-top: none;
		border-radius: 0 0 6px 6px;
		padding: 16px;
		max-height: 200px;
		overflow-y: auto;
		box-shadow: 0 4px 12px rgba(26, 22, 18, 0.08);
	}

	.blurb-header {
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
		margin-bottom: 0.5rem;
	}

	.blurb-char {
		font-family: var(--font-serif);
		font-size: 1rem;
		font-weight: 600;
		color: var(--ink-primary);
	}

	.blurb-arrow-sep {
		font-size: 0.7rem;
		color: var(--ink-tertiary);
	}

	.blurb-ipa {
		font-family: var(--font-sans);
		font-size: 0.95rem;
		color: var(--ink-secondary);
	}

	.blurb-text {
		font-family: var(--font-serif);
		font-size: 15px;
		line-height: 1.6;
		color: var(--ink-primary);
	}

	.blurb-no-text {
		font-family: var(--font-serif);
		font-size: 0.85rem;
		color: var(--ink-tertiary);
		font-style: italic;
	}

	.blurb-promotion {
		font-family: var(--font-serif);
		font-size: 0.8rem;
		line-height: 1.5;
		color: var(--ink-secondary);
		font-style: italic;
	}

	.blurb-promotion-divider {
		width: 100%;
		height: 0;
		border-top: 0.5px solid var(--stone-300, #d6d3d1);
		margin: 0.5rem 0;
	}

	.blurb-citation {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-tertiary);
		opacity: 0.7;
		margin-top: 0.35rem;
		line-height: 1.4;
	}

	/* ═══ 4. Provenance section: REMOVED (Phase A) ══════════════════════ */

	/* ── Provenance choice buttons (shared by stress and ё choosers) ── */

	.provenance-choice {
		background: var(--paper-cream);
		border: 1px solid var(--stone-300);
		border-radius: 3px;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		color: var(--ink-secondary);
		cursor: pointer;
		padding: 2px 8px;
		white-space: nowrap;
		transition: border-color 150ms ease, background-color 150ms ease;
	}

	.provenance-choice:hover {
		border-color: var(--sage);
		background: #faf8f4;
		color: var(--ink-primary);
	}

	/* ═══ 5. Spot reconstitution/reduction checkbox ═════════════════════ */

	.spot-checkbox-slot {
		min-height: 24px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 0.35rem;
	}

	.spot-checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		cursor: pointer;
	}

	.spot-checkbox {
		width: 14px;
		height: 14px;
		accent-color: var(--sage);
		cursor: pointer;
		margin: 0;
		flex-shrink: 0;
	}

	.spot-checkbox-text {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-secondary);
		line-height: 1;
		user-select: none;
	}

	/* ═══ 6. Notation indicator: REMOVED (Phase A) ══════════════════════ */

	/* ═══ 7. Per-word reset button (sigla, top-right of word stack) ══════════ */

	.reset-button {
		position: absolute;
		top: 0.4rem;
		right: 0.35rem;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border: 1px solid var(--stone-400, #a8a29e);
		border-radius: 50%;
		background: var(--paper-cream);
		color: var(--ink-secondary);
		cursor: pointer;
		padding: 0;
		opacity: 0.5;
		transition: opacity 150ms ease, border-color 150ms ease, color 150ms ease;
	}

	.reset-button:hover {
		opacity: 1;
		border-color: var(--sage);
		color: var(--sage);
	}

	.reset-button:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: 2px;
	}

	.reset-svg {
		width: 12px;
		height: 12px;
	}
</style>
