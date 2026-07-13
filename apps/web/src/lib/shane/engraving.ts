/**
 * Fit engraving preferences: the user-adjustable notation geometry.
 *
 * Born from the Appendix B/C proportions work (Dann's ruling,
 * 2026-07-13): the stave size serves the page; the goal is a document
 * legible to a singer, with meaningful markup presented as a
 * traditional score, never page-count minimization.
 *
 * The defaults below are Dann's browser-tuned values against the
 * dissertation appendices (stave ≈3% of page height). `minGap` rides
 * `pxPerWhole` at a fixed ratio in the user-facing control so
 * proportional rhythmic spacing survives density changes; the raw
 * value is still stored so the renderer contract stays explicit.
 */

export interface EngravingValues {
	/** px between adjacent staff lines (stave size). */
	lineGap: number;
	/** Horizontal px per whole note of onset time (note spacing). */
	pxPerWhole: number;
	/** Minimum px between successive events. */
	minGap: number;
	/** Vertical px between stacked systems. */
	systemGap: number;
	/** x where staff content begins, after clef and key signature. */
	leftMargin: number;
}

/** Appendix-derived defaults (Dann at the browser, 2026-07-13). */
export const ENGRAVING_DEFAULTS: EngravingValues = {
	lineGap: 5.5,
	pxPerWhole: 110,
	minGap: 14,
	systemGap: 6,
	leftMargin: 76,
};

/** The fixed minGap:pxPerWhole ratio the user-facing spacing control keeps. */
export const MIN_GAP_RATIO = ENGRAVING_DEFAULTS.minGap / ENGRAVING_DEFAULTS.pxPerWhole;

/** Derive the coupled minGap for a given note spacing. */
export function minGapFor(pxPerWhole: number): number {
	return Math.min(40, Math.max(10, Math.round(pxPerWhole * MIN_GAP_RATIO)));
}
