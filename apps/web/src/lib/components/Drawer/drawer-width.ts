/**
 * drawer-width.ts — the Inspector drawer's width, from the word it shows.
 *
 * Moved out of `+page.svelte` unchanged (N.94 slice 1, the brief's addendum
 * of 2026-09-28 21:40), so the page shell could take the Transposition
 * ruler's wiring and stay at its size ceiling (`ARCHITECTURE.md` invariant 12).
 */
import type { WordStackData } from '$lib/types';

// ── Dynamic drawer width: pure calculation from ribbon content ──
// Atoms are fixed 32px. Gaps, borders, and padding are constants.
// Width is computed before render (no DOM measurement, no flicker).
export function calculateDrawerWidth(word: WordStackData): number {
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
