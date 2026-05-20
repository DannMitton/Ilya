/**
 * Shane pacifier — WCAG contrast verification.
 *
 * Pure functions for computing WCAG 2.1 contrast ratios, plus the
 * registry of contrast obligations for the pacifier's vowel-circle states.
 *
 * Why this exists: contrast ratios for the pacifier states were, at one
 * point, asserted by hand and carried errors that survived several review
 * rounds (lavender-on-lavender values quoted as 3.55:1 when the true
 * figure was ~1.1:1). This module computes the ratios from first
 * principles so no human estimates them again, and the companion test
 * (contrast.test.ts) fails loudly if any state's styling drifts below its
 * threshold.
 *
 * Reference: WCAG 2.1 relative luminance and contrast-ratio definitions.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

// ─────────────────────────────────────────────────────────────────────────
// Core colour maths
// ─────────────────────────────────────────────────────────────────────────

export type RGB = readonly [number, number, number];

/** Parse a 6-digit hex colour (with or without leading '#') into RGB 0-255. */
export function hexToRgb(hex: string): RGB {
	const h = hex.replace(/^#/, '');
	if (!/^[0-9a-fA-F]{6}$/.test(h)) {
		throw new Error(`Invalid hex colour: "${hex}" (expected 6 hex digits)`);
	}
	return [
		parseInt(h.slice(0, 2), 16),
		parseInt(h.slice(2, 4), 16),
		parseInt(h.slice(4, 6), 16)
	];
}

/**
 * Alpha-composite a foreground colour over an opaque background.
 * `alpha` is 0..1. Used when an element renders at reduced opacity:
 * the apparent colour is what the eye sees after compositing.
 */
export function composite(fg: RGB, alpha: number, bg: RGB): RGB {
	if (alpha < 0 || alpha > 1) {
		throw new Error(`Alpha out of range: ${alpha} (expected 0..1)`);
	}
	return [
		alpha * fg[0] + (1 - alpha) * bg[0],
		alpha * fg[1] + (1 - alpha) * bg[1],
		alpha * fg[2] + (1 - alpha) * bg[2]
	];
}

/** WCAG 2.1 relative luminance of an sRGB colour. */
export function relativeLuminance(rgb: RGB): number {
	const channel = (c: number): number => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	};
	const [r, g, b] = rgb.map(channel) as [number, number, number];
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.1 contrast ratio between two opaque colours. Range 1..21. */
export function contrastRatio(a: RGB, b: RGB): number {
	const la = relativeLuminance(a);
	const lb = relativeLuminance(b);
	const hi = Math.max(la, lb);
	const lo = Math.min(la, lb);
	return (hi + 0.05) / (lo + 0.05);
}

// ─────────────────────────────────────────────────────────────────────────
// Shane palette (spec v5 §13 + Ilya tokens referenced by name)
//
// NOTE: these placeholder hex values mirror Ilya's Calm Authority palette.
// At integration time the Ilya design tokens are authoritative; if any token
// value changes upstream, update it here and the test will re-verify every
// obligation against the new value.
// ─────────────────────────────────────────────────────────────────────────

export const PALETTE = {
	'muted-lavender': hexToRgb('#A89BB5'),
	'light-lavender': hexToRgb('#C4BACF'),
	'deeper-lavender': hexToRgb('#8E7E9B'),
	'surround-shane': hexToRgb('#D8D0E0'),
	'paper-cream': hexToRgb('#F0EBE0'),
	'ink-primary': hexToRgb('#1A1612'),
	'ink-secondary': hexToRgb('#4A4540'),
	'ink-tertiary': hexToRgb('#6A655F')
} as const;

export type Token = keyof typeof PALETTE;

// ─────────────────────────────────────────────────────────────────────────
// WCAG thresholds
// ─────────────────────────────────────────────────────────────────────────

export const WCAG = {
	/** Normal text, AA. */
	TEXT_AA: 4.5,
	/** Large text (>=18pt / 24px, or >=14pt bold), AA. */
	LARGE_TEXT_AA: 3.0,
	/** Non-text UI components and graphical objects (WCAG 2.1 SC 1.4.11). */
	UI_COMPONENT: 3.0
} as const;

// ─────────────────────────────────────────────────────────────────────────
// Contrast obligations for the pacifier states (spec v5 §6.1-6.6)
//
// `kind`:
//   'glyph'  — the IPA symbol; treated as text (TEXT_AA 4.5:1)
//   'ui'     — outline, indicator; non-text UI component (UI_COMPONENT 3:1)
//
// `fgToken` / `fgAlpha` — the element's colour and opacity.
// `fillToken` / `fillAlpha` — the immediate background the element sits on.
//   For welded resting states the fill is surround-coloured, so the element
//   effectively sits on the surround. For active states the fill is the
//   state colour and the glyph sits on it directly.
//
// `status`:
//   'locked'         — settled; the test asserts it must pass.
//   'policy-pending' — a conscious deferral; the test records the number but
//                      does not fail the suite. Used for elements whose WCAG
//                      obligation is still under design review (see notes).
// ─────────────────────────────────────────────────────────────────────────

export interface ContrastObligation {
	state: string;
	element: string;
	kind: 'glyph' | 'ui';
	fgToken: Token;
	fgAlpha: number;
	fillToken: Token;
	fillAlpha: number;
	/** The opaque colour the fill resolves to (what the element sits on). */
	backgroundToken: Token;
	threshold: number;
	status: 'locked' | 'policy-pending';
	note?: string;
}

export const OBLIGATIONS: readonly ContrastObligation[] = [
	// Resting: dormant (welded, full black)
	{
		state: 'dormant', element: 'outline', kind: 'ui',
		fgToken: 'ink-primary', fgAlpha: 1.0,
		fillToken: 'surround-shane', fillAlpha: 1.0, backgroundToken: 'surround-shane',
		threshold: WCAG.UI_COMPONENT, status: 'locked'
	},
	{
		state: 'dormant', element: 'glyph', kind: 'glyph',
		fgToken: 'ink-primary', fgAlpha: 1.0,
		fillToken: 'surround-shane', fillAlpha: 1.0, backgroundToken: 'surround-shane',
		threshold: WCAG.TEXT_AA, status: 'locked'
	},

	// Resting: deselected (welded ghosting, greyed; tappable from initial render)
	{
		state: 'deselected', element: 'outline', kind: 'ui',
		fgToken: 'ink-tertiary', fgAlpha: 1.0,
		fillToken: 'surround-shane', fillAlpha: 0.5, backgroundToken: 'surround-shane',
		threshold: WCAG.UI_COMPONENT, status: 'locked'
	},
	{
		state: 'deselected', element: 'glyph', kind: 'glyph',
		fgToken: 'ink-primary', fgAlpha: 0.7,
		fillToken: 'surround-shane', fillAlpha: 0.5, backgroundToken: 'surround-shane',
		threshold: WCAG.TEXT_AA, status: 'locked'
	},
	{
		state: 'deselected', element: 'indicator', kind: 'ui',
		fgToken: 'ink-secondary', fgAlpha: 0.8,
		fillToken: 'surround-shane', fillAlpha: 1.0, backgroundToken: 'surround-shane',
		threshold: WCAG.UI_COMPONENT, status: 'locked'
	},

	// Active: coloured fill, dark glyph
	{
		state: 'listening', element: 'glyph', kind: 'glyph',
		fgToken: 'ink-primary', fgAlpha: 1.0,
		fillToken: 'light-lavender', fillAlpha: 1.0, backgroundToken: 'light-lavender',
		threshold: WCAG.TEXT_AA, status: 'locked'
	},
	{
		state: 'working', element: 'glyph', kind: 'glyph',
		fgToken: 'ink-primary', fgAlpha: 1.0,
		fillToken: 'muted-lavender', fillAlpha: 1.0, backgroundToken: 'muted-lavender',
		threshold: WCAG.TEXT_AA, status: 'locked'
	},
	{
		state: 'captured', element: 'glyph', kind: 'glyph',
		fgToken: 'ink-primary', fgAlpha: 1.0,
		fillToken: 'deeper-lavender', fillAlpha: 1.0, backgroundToken: 'deeper-lavender',
		threshold: WCAG.TEXT_AA, status: 'locked'
	},
	{
		state: 'processing', element: 'glyph', kind: 'glyph',
		fgToken: 'ink-primary', fgAlpha: 1.0,
		fillToken: 'deeper-lavender', fillAlpha: 1.0, backgroundToken: 'deeper-lavender',
		threshold: WCAG.TEXT_AA, status: 'locked'
	}

	// Progress-arc (focus + sample progress): NOT yet listed. The arc is a
	// design proposal pending Kimi review; it will carry a UI_COMPONENT (3:1)
	// obligation against both the surround and its fill once its colour is
	// settled. Add a 'locked' obligation here when the arc colour is chosen.
	//
	// Decorative outer rings (former listening/working/processing pulse rings):
	// not listed. They are either decorative (exempt) or superseded by the
	// progress arc. Resolve during the progress-arc design review, then add
	// here if they survive as information-bearing elements.
];

// ─────────────────────────────────────────────────────────────────────────
// Evaluation
// ─────────────────────────────────────────────────────────────────────────

export interface ContrastResult extends ContrastObligation {
	ratio: number;
	pass: boolean;
}

/** Resolve one obligation's apparent colours and compute its ratio. */
export function evaluate(o: ContrastObligation): ContrastResult {
	const fillResolved =
		o.fillAlpha < 1.0
			? composite(PALETTE[o.fillToken], o.fillAlpha, PALETTE[o.backgroundToken])
			: PALETTE[o.fillToken];
	const fg =
		o.fgAlpha < 1.0
			? composite(PALETTE[o.fgToken], o.fgAlpha, fillResolved)
			: PALETTE[o.fgToken];
	const ratio = contrastRatio(fg, fillResolved);
	return { ...o, ratio, pass: ratio >= o.threshold };
}

/** Evaluate every obligation. */
export function evaluateAll(): ContrastResult[] {
	return OBLIGATIONS.map(evaluate);
}
