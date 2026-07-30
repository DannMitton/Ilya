/**
 * Shane pacifier: WCAG contrast verification.
 *
 * Pure functions for computing WCAG 2.1 contrast ratios, plus the
 * registry of contrast obligations for the pacifier's vowel-circle states.
 *
 * Why this exists: contrast ratios for the pacifier states were, at one
 * point, asserted by hand and carried errors that survived several review
 * rounds (lavender-on-lavender values quoted as 3.55:1 when the true
 * figure was ~1.1:1). This module computes the ratios from first
 * principles so no human estimates them again, and the companion test
 * (contrast.test.ts) fails loudly if any locked state's styling drifts
 * below its threshold.
 *
 * Route B reconciliation (2026-05-22): this registry now matches the
 * Route B / spec-v6 prototype as built. Route B moved the active glyphs
 * off the lavender gradient onto white circle interiors, retired the
 * `processing` state and the deselected `=~` indicator, subdued the
 * resting states, and added the green progress arc and the capture/retake
 * badges. Every obligation below was recomputed from the real palette
 * under that scheme. The geometry: each 28px white disc is welded inset
 * inside the 39px `surround-shane` band on a white field, so a glyph sits
 * on white, while an outline or the arc has white on its inner edge and
 * the band on its outer edge. For every Route B outline and arc colour the
 * band is the lower-contrast of those two adjacencies, so the band governs
 * (WCAG 2.1 SC 1.4.11 asks for 3:1 against the adjacent colours, and the
 * band is the worse adjacency). Glyphs and badge marks are measured on
 * their white interior; outlines, the arc, and badge disc edges are
 * measured against the band.
 *
 * v11 update (2026-06-09): the prep-countdown flash token `prep-amber`
 * (#BC7E08, spec §6.2a, §13) is added to the palette and registered below as
 * two locked obligations. The flash renders as a full-opacity fill on the
 * white circle interior, inset 2px so it never touches the band (Dann and
 * Kimi, 2026-06-09): 3.43:1 on white, compliant, with the IPA glyph still
 * legible over it at 5.25:1. The interior geometry is what makes the amber
 * compliant; against the band it would be 2.29:1, and any translucent fill
 * falls below 3:1, so the flash peaks at full opacity.
 *
 * Reference: WCAG 2.1 relative luminance and contrast-ratio definitions.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

// ---------------------------------------------------------------------------
// Core colour maths
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Shane palette (spec v6 §13 + Ilya tokens referenced by name)
//
// These values mirror Ilya's Calm Authority palette, and `app.css` is
// authoritative for every one of them that it declares. That mirroring is no
// longer maintained by hand: R20's check in contrast.test.ts reads `app.css`
// at check time and fails if any value here disagrees with the token of the
// same name, so a token change upstream breaks the build rather than
// silently invalidating this file.
//
// CORRECTION, 2026-07-30. This comment previously stated that `arc-green` and
// `signal-red` are "Shane-specific additions (spec v6 §13) not present in
// Ilya's app.css". That is false as of `app.css` md5
// cf7bd6350fed1945c9aba775f957d618, read 2026-07-30: `arc-green`,
// `signal-red`, `prep-amber`, `surround-shane`, and `light-lavender` are all
// declared in its `:root` block, under a header reading "Shane pacifier
// (fourth tab)". The sentence was the source R20's original exemption list
// was written from, and it exempted from the drift check the five tokens most
// likely to drift. This note asserts present falsity only and makes no claim
// about whether the sentence was true when it was written. See Fable's
// Ruling 1 and Ruling 2 amendment three, both 2026-07-30.
//
// `prep-amber` (v11, spec §13) is the prep-countdown flash, a full-opacity
// fill on the white interior, registered below as two locked obligations.
// ---------------------------------------------------------------------------

export const PALETTE = {
	'muted-lavender': hexToRgb('#A89BB5'),
	'light-lavender': hexToRgb('#C4BACF'),
	'deeper-lavender': hexToRgb('#8E7E9B'),
	'surround-shane': hexToRgb('#D8D0E0'),
	'paper-cream': hexToRgb('#F0EBE0'),
	'ink-primary': hexToRgb('#1A1612'),
	'ink-secondary': hexToRgb('#4A4540'),
	'ink-tertiary': hexToRgb('#6A655F'),
	'white': hexToRgb('#FFFFFF'),
	'arc-green': hexToRgb('#1DB954'),
	'signal-red': hexToRgb('#A32D2D'),
	'prep-amber': hexToRgb('#BC7E08')
} as const;

export type Token = keyof typeof PALETTE;

/**
 * Membership asserts one thing only: `app.css` declares no token of this name.
 *
 * It is not a statement about ownership, provenance, or which product a colour
 * belongs to. R20 checks membership in both directions, so a key listed here
 * fails if `app.css` ever gains a token of that name, and a key absent from
 * here fails if `app.css` has none. Measured 2026-07-30 against `app.css` md5
 * cf7bd6350fed1945c9aba775f957d618: `white` is the only such key.
 *
 * SCOPE, stated in the rule (Fable, Ruling 2 amendment two, 2026-07-30): R20
 * governs the values of keys that exist in PALETTE. It is not a completeness
 * guarantee. Deleting a key removes it from the rule.
 */
export const NO_UPSTREAM_TOKEN: readonly Token[] = ['white'];

// ---------------------------------------------------------------------------
// WCAG thresholds
// ---------------------------------------------------------------------------

export const WCAG = {
	/** Normal text, AA. */
	TEXT_AA: 4.5,
	/** Large text (>=18pt / 24px, or >=14pt bold), AA. */
	LARGE_TEXT_AA: 3.0,
	/** Non-text UI components and graphical objects (WCAG 2.1 SC 1.4.11). */
	UI_COMPONENT: 3.0
} as const;

// ---------------------------------------------------------------------------
// Contrast obligations for the pacifier states (spec v6 §6.1-6.7)
//
// `kind`:
//   'glyph' : the IPA symbol or a badge mark; treated as text (TEXT_AA 4.5:1)
//   'ui'    : an outline, the progress arc, a circle fill, or a badge disc
//             edge; non-text UI component (UI_COMPONENT 3:1)
//
// `fgToken` / `fgAlpha`     : the element's colour and opacity.
// `fillToken` / `fillAlpha` : the immediate surface the element sits on.
// `backgroundToken`         : the opaque colour the fill resolves to.
//   Route B: glyphs and badge marks sit on the white interior, so their
//   fill and background are `white`. Outlines, the arc, and badge disc
//   edges are measured against the band (`surround-shane`), the governing
//   adjacency for the welded geometry (see the header note).
//
// `status`:
//   'locked'          : settled; the test asserts it must pass.
//   'owned-exception' : a settled, accepted sub-threshold deviation, a
//                       deliberate design call by Dann, recorded with its
//                       true computed ratio. The test reports it and
//                       asserts it is in fact sub-threshold, so if a
//                       later change lifts it to compliance the suite flags
//                       it for reclassification to 'locked'. This is the
//                       opposite of disguising the deviation as compliant.
//   'policy-pending'  : a conscious deferral, still under design review.
//                       The test records the number but neither requires it
//                       to pass nor requires it to fail. None at present (the
//                       v11 prep flash resolved to two locked obligations).
//
// Distinction that matters: 'policy-pending' means undecided; an
// 'owned-exception' is decided and accepted. The two are kept separate so
// the test output never labels a closed decision as still open.
// ---------------------------------------------------------------------------

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
	status: 'locked' | 'owned-exception' | 'policy-pending';
	note?: string;
}

export const OBLIGATIONS: readonly ContrastObligation[] = [
	// --- Glyphs, on the white interior (spec v6 §6.1-6.5) ----------------------
	{
		state: 'dormant', element: 'glyph', kind: 'glyph',
		fgToken: 'ink-primary', fgAlpha: 0.5,
		fillToken: 'white', fillAlpha: 1.0, backgroundToken: 'white',
		threshold: WCAG.TEXT_AA, status: 'owned-exception',
		note: 'Resting glyph deliberately subdued at 50% (spec v6 §6.1). Below 4.5 text; part of the resting-subduing owned exception. Lifting to ~60% would clear 4.5 if it reads too faint in use.'
	},
	{
		state: 'deselected', element: 'glyph', kind: 'glyph',
		fgToken: 'ink-primary', fgAlpha: 0.7,
		fillToken: 'white', fillAlpha: 1.0, backgroundToken: 'white',
		threshold: WCAG.TEXT_AA, status: 'locked'
	},
	{
		state: 'listening', element: 'glyph', kind: 'glyph',
		fgToken: 'ink-secondary', fgAlpha: 1.0,
		fillToken: 'white', fillAlpha: 1.0, backgroundToken: 'white',
		threshold: WCAG.TEXT_AA, status: 'locked'
	},
	{
		state: 'working', element: 'glyph', kind: 'glyph',
		fgToken: 'ink-secondary', fgAlpha: 1.0,
		fillToken: 'white', fillAlpha: 1.0, backgroundToken: 'white',
		threshold: WCAG.TEXT_AA, status: 'locked'
	},
	{
		state: 'captured', element: 'glyph', kind: 'glyph',
		fgToken: 'ink-primary', fgAlpha: 1.0,
		fillToken: 'white', fillAlpha: 1.0, backgroundToken: 'white',
		threshold: WCAG.TEXT_AA, status: 'locked'
	},

	// --- Outlines, against the band (spec v6 §6.1-6.5; band-governed) ----------
	{
		state: 'dormant', element: 'outline', kind: 'ui',
		fgToken: 'ink-primary', fgAlpha: 0.35,
		fillToken: 'surround-shane', fillAlpha: 1.0, backgroundToken: 'surround-shane',
		threshold: WCAG.UI_COMPONENT, status: 'owned-exception',
		note: 'Faint resting outline at 35% (spec v6 §6.1, §6a). Below 3:1; owned with the white resting interiors. Agreed fix if too faint in use: a stronger dormant outline (50%+), not a fill change.'
	},
	{
		state: 'deselected', element: 'outline', kind: 'ui',
		fgToken: 'ink-tertiary', fgAlpha: 1.0,
		fillToken: 'surround-shane', fillAlpha: 1.0, backgroundToken: 'surround-shane',
		threshold: WCAG.UI_COMPONENT, status: 'locked'
	},
	{
		state: 'listening', element: 'outline', kind: 'ui',
		fgToken: 'ink-secondary', fgAlpha: 0.4,
		fillToken: 'surround-shane', fillAlpha: 1.0, backgroundToken: 'surround-shane',
		threshold: WCAG.UI_COMPONENT, status: 'owned-exception',
		note: 'Deliberately faint transient outline at 40% (spec v6 §6.3). Below 3:1; tracked as the faintest point of the dormant-to-captured outline progression. The listening state is independently legible via the dark glyph (9.47:1) and caption.'
	},
	{
		state: 'working', element: 'outline', kind: 'ui',
		fgToken: 'ink-secondary', fgAlpha: 0.7,
		fillToken: 'surround-shane', fillAlpha: 1.0, backgroundToken: 'surround-shane',
		threshold: WCAG.UI_COMPONENT, status: 'locked'
	},
	{
		state: 'captured', element: 'outline', kind: 'ui',
		fgToken: 'deeper-lavender', fgAlpha: 1.0,
		fillToken: 'surround-shane', fillAlpha: 1.0, backgroundToken: 'surround-shane',
		threshold: WCAG.UI_COMPONENT, status: 'owned-exception',
		note: 'Settled ring at 2.50:1 against the band. Its inner edge against the white interior is 3.74:1, where its legibility comes from in practice; recorded as sub-threshold under the band-governing rule, owned by Dann (2026-05-22).'
	},

	// --- Progress arc, against the band (spec v6 §6.6) -------------------------
	{
		state: 'working', element: 'progress-arc', kind: 'ui',
		fgToken: 'arc-green', fgAlpha: 1.0,
		fillToken: 'surround-shane', fillAlpha: 1.0, backgroundToken: 'surround-shane',
		threshold: WCAG.UI_COMPONENT, status: 'owned-exception',
		note: 'Bright green arc, owned exception (spec v6 §6.6). 1.73:1 against the band, 2.59:1 against the white interior, both below 3:1. Dann chose the bright green for signalling clarity over the compliant #15803D. NOT a WCAG-permitted waiver: WCAG has no contrast exemption for animated elements; this is an accepted deviation.'
	},

	// --- White resting interior, the §6a owned choice, made explicit ----------
	{
		state: 'resting', element: 'fill', kind: 'ui',
		fgToken: 'white', fgAlpha: 1.0,
		fillToken: 'surround-shane', fillAlpha: 1.0, backgroundToken: 'surround-shane',
		threshold: WCAG.UI_COMPONENT, status: 'owned-exception',
		note: 'White resting interior shared by dormant and deselected (spec v6 §6a). 1.50:1 against the band (1.00:1 against the white field), so the resting fill does not identify the circle on its own and the circle reads by outline. Dann chose white interiors throughout; recorded as the owned choice it is.'
	},

	// --- Badges, on white marks and band-governed disc edges (spec v6 §6.7) ---
	{
		state: 'captured', element: 'badge-mark', kind: 'glyph',
		fgToken: 'ink-secondary', fgAlpha: 1.0,
		fillToken: 'white', fillAlpha: 1.0, backgroundToken: 'white',
		threshold: WCAG.TEXT_AA, status: 'locked',
		note: 'Check mark on the white badge disc.'
	},
	{
		state: 'captured', element: 'badge-disc', kind: 'ui',
		fgToken: 'ink-secondary', fgAlpha: 1.0,
		fillToken: 'surround-shane', fillAlpha: 1.0, backgroundToken: 'surround-shane',
		threshold: WCAG.UI_COMPONENT, status: 'locked',
		note: 'White badge disc edge; the badge touches the circumference so its outer edge can sit against the band. Band-governed.'
	},
	{
		state: 'retake', element: 'badge-mark', kind: 'glyph',
		fgToken: 'signal-red', fgAlpha: 1.0,
		fillToken: 'white', fillAlpha: 1.0, backgroundToken: 'white',
		threshold: WCAG.TEXT_AA, status: 'locked',
		note: 'Reset arrow on the white badge disc.'
	},
	{
		state: 'retake', element: 'badge-disc', kind: 'ui',
		fgToken: 'signal-red', fgAlpha: 1.0,
		fillToken: 'surround-shane', fillAlpha: 1.0, backgroundToken: 'surround-shane',
		threshold: WCAG.UI_COMPONENT, status: 'locked',
		note: 'Retake badge disc edge; band-governed as above.'
	},

	// --- v11 prep-countdown flash (spec §6.2a, §13): locked, interior fill ----
	{
		state: 'preparing', element: 'prep-flash', kind: 'ui',
		fgToken: 'prep-amber', fgAlpha: 1.0,
		fillToken: 'white', fillAlpha: 1.0, backgroundToken: 'white',
		threshold: WCAG.UI_COMPONENT, status: 'locked',
		note: 'v11 prep-countdown flash: a full-opacity fill on the white circle interior, inset 2px so it never touches the band (Dann and Kimi, 2026-06-09). 3.43:1 on white, compliant. The interior geometry is what makes the amber compliant; a translucent flash falls below 3:1 (30 percent is about 1.4:1), so the flash peaks at full opacity.'
	},
	{
		state: 'preparing', element: 'glyph', kind: 'glyph',
		fgToken: 'ink-primary', fgAlpha: 1.0,
		fillToken: 'prep-amber', fillAlpha: 1.0, backgroundToken: 'prep-amber',
		threshold: WCAG.TEXT_AA, status: 'locked',
		note: 'IPA glyph legibility at the peak of the full-opacity amber flash: ink-primary on solid prep-amber, 5.25:1, clears text AA.'
	}

	// Retired in Route B and intentionally absent (spec v6 §6.8):
	//   - the `processing` state (folded into the captured settle);
	//   - the deselected `=~` indicator (the dashed outline carries the
	//     deselected affordance);
	//   - the decorative pulse rings (carried no information).
];

// ---------------------------------------------------------------------------
// Evaluation
// ---------------------------------------------------------------------------

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
