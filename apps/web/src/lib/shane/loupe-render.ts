/**
 * N.153 stage 3b. The loupe's drawing of ONE measure, rendered from the score at
 * a horizontal spacing the loupe derives for itself.
 *
 * `renderAnalyzedStaff` returns a string, and a string has no layout, so
 * nothing here measures. `Loupe.svelte` mounts the result off-screen and reads
 * it there (`getBBox` on a detached element answers all zeros), and it parses
 * the same string again, detached, for the markup it draws.
 *
 * THE RENDER PASSES NO `targetWidth`, EVER. `renderAnalyzedStaff` stretches
 * every column by one scalar, `targetSpan / naturalSpan`
 * (`staff-renderer.ts`, "const stretch"). Hold a target fixed and raise
 * `minGap`: the natural span rises, the scalar falls, and a gap that was not on
 * the floor gets narrower. Widening for one gap opens another, and the search
 * below need not stop. At natural width each column's advance is
 * `max(minGap, duration term, textNeed, inkNeed)`, and none of the other three
 * reads `minGap`, so every advance is non-decreasing in `minGap` and the search
 * is a search over a monotone quantity. The page's width is not a target the
 * loupe honours (OPEN.md, THE CARET, clause 8).
 *
 * Stage 3a rendered the whole system at the page's width. A one-measure render
 * at the page's own spacing is 17 to 71 percent narrower than the page's
 * justified measure on the fixture (measured 2026-09-20), so narrowing without
 * deriving would have made the drawing worse. This is the deriving.
 */
import { renderSystemSlice, type StaffRenderOptions } from '@ilya/score-parser';
import type { LoupeRenderBundle } from '$lib/shane/loupe-render-bundle';
import type { SystemRange } from '$lib/shane/loupe';

export interface LoupeSystemRender {
	/** The standalone SVG string, exactly as the renderer returned it. */
	svg: string;
	/** The system's box, from the string's own viewBox: `0 minY width height`. */
	minY: number;
	width: number;
	height: number;
}

/**
 * The system as the page wraps it: a nested `<svg>` carrying its own box and
 * its `data-system` range, around the renderer's inner markup. This is
 * `paginateScore`'s own wrapper minus `x` and `y`, which place it on a sheet
 * and mean nothing here. Everything the loupe reads off a system (its width,
 * its height, its viewBox's min-y, its range) is on this element, as it is on
 * the page's. The newlines are the page's own, from joining its parts with
 * one, kept so the two are the same markup and not merely the same drawing.
 */
export function systemMarkup(r: LoupeSystemRender, range: SystemRange): string {
	const inner = r.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
	return `<svg width="${r.width}" height="${r.height}" viewBox="0 ${r.minY} ${r.width} ${r.height}" data-system="${range.fromMeasure}-${range.toMeasure}">\n${inner}\n</svg>`;
}

/**
 * The options `VoiceProfilePane` gave `paginateScore`, rebuilt from the bundle.
 * An absent channel is left out rather than set to `undefined`, as the pane
 * does, so the renderer's own defaults stand.
 */
export function bundleRenderOptions(bundle: LoupeRenderBundle): StaffRenderOptions {
	return {
		...bundle.spacing,
		clef: bundle.clef,
		...(bundle.ipaPreview ? { ipaPreview: bundle.ipaPreview } : {}),
		...(bundle.withheldIpa ? { withheldIpa: bundle.withheldIpa } : {}),
		...(bundle.cyrPreview ? { cyrPreview: bundle.cyrPreview } : {}),
		...(bundle.sylTypePreview ? { sylTypePreview: bundle.sylTypePreview } : {}),
		...(bundle.melismaPreview ? { melismaPreview: bundle.melismaPreview } : {}),
		...(bundle.font ? { font: bundle.font, fontFamily: bundle.fontFamily } : {}),
	};
}

/** The tap floor in CSS pixels: what this surface draws every control at. */
export const TAP_FLOOR_PX = 44;

/**
 * Render measure `m` alone, at natural width, with `minGap` as the one spacing
 * knob. `pxPerWhole` stays the page's, so the engraving keeps the page's
 * rhythmic proportion and only the floor under the short gaps moves.
 */
export function renderLoupeMeasure(bundle: LoupeRenderBundle, m: number, minGap: number): LoupeSystemRender | null {
	const measures = bundle.readingScore.measures.length;
	if (m < 0 || m >= measures) return null;
	const options: StaffRenderOptions = { ...bundleRenderOptions(bundle), minGap };
	delete options.targetWidth;
	const svg = renderSystemSlice(bundle.readingScore, bundle.analyzed, options, m, m, {
		finalBarline: m === measures - 1,
	});
	const box = svg.match(/viewBox="0 ([\d.-]+) ([\d.]+) ([\d.]+)"/);
	return box ? { svg, minY: Number(box[1]), width: Number(box[2]), height: Number(box[3]) } : null;
}

/** What the search settled on. */
export interface DerivedSpacing {
	minGap: number;
	/** The smallest separation, in CSS pixels, at `minGap`. `Infinity` where there is no pair. */
	worst: number;
	/** Renders the search made, the first at the page's own `minGap`. */
	iterations: number;
	/** False where the ceiling or the render budget was reached with a pair still under the floor. */
	converged: boolean;
}

/** Smallest step the search resolves, in native units: under a pixel at any scale this surface draws. */
const MIN_GAP_RESOLUTION = 0.5;
/** The ceiling is this many times the width the floor asks of one column. */
const CEILING_FACTOR = 4;
/** The render budget. Bisection over the ceiling's span needs about eight. */
export const MAX_SPACING_RENDERS = 14;

/**
 * Find the smallest `minGap` at which no adjacent pair of carets stands nearer
 * than the floor, by bisection between the page's `minGap` and a ceiling.
 *
 * `worstAt` renders at a `minGap` and answers the smallest separation in CSS
 * pixels with the scale it was drawn at, or null where it cannot say. The search relies on advances being
 * non-decreasing in `minGap`, which holds at natural width (module head). On the
 * cap it answers the widest spacing reached, unconverged, and the caller says so;
 * it draws nothing to say so.
 */
export function deriveMinGap(
	pageMinGap: number,
	worstAt: (minGap: number) => { worst: number; scale: number } | null,
	floor: number = TAP_FLOOR_PX,
): DerivedSpacing {
	let iterations = 0;
	let scale = 0;
	const probe = (g: number): number => {
		iterations++;
		const r = worstAt(g);
		if (!r) return Infinity;
		scale = r.scale;
		return r.worst;
	};
	const startWorst = probe(pageMinGap);
	if (startWorst >= floor) return { minGap: pageMinGap, worst: startWorst, iterations, converged: true };
	const ceiling = Math.max(pageMinGap, scale > 0 ? floor / scale : floor) * CEILING_FACTOR;
	const ceilingWorst = probe(ceiling);
	if (ceilingWorst < floor) return { minGap: ceiling, worst: ceilingWorst, iterations, converged: false };
	let lo = pageMinGap;
	let hi = ceiling;
	let hiWorst = ceilingWorst;
	while (hi - lo > MIN_GAP_RESOLUTION && iterations < MAX_SPACING_RENDERS) {
		const mid = (lo + hi) / 2;
		const w = probe(mid);
		if (w >= floor) {
			hi = mid;
			hiWorst = w;
		} else lo = mid;
	}
	return { minGap: hi, worst: hiWorst, iterations, converged: true };
}

/**
 * Stage 3a's entry point, no longer called by `Loupe.svelte` since stage 3b and
 * kept because `loupe-render.test.ts` proves with it that a slice renders as the
 * page drew it. It is the one place this module passes `targetWidth`; the
 * loupe's own render never does. Stage 4 decides whether it goes.
 *
 * Render one system at the width the page drew it, `targetWidth`.
 *
 * THE SYSTEM IS RENDERED AT ITS NATURAL WIDTH FIRST, and asked to stretch only
 * when the page's is wider. The page's width is not always a target. A
 * justified system was drawn AT its target, but the last system of the piece,
 * and any system wider than the line, was drawn at its natural width, and that
 * width read back off the page is a number the renderer's own stretch would
 * take for a target a hair past natural: it would stretch a system the page
 * left alone, by under a hundredth of a pixel, and the two would stop being the
 * same drawing. MEASURED on the fixture at page widths 637 and 1042 px
 * (unit test) and on the last system in the browser, 2026-09-20.
 */
export function renderLoupeSystem(
	bundle: LoupeRenderBundle,
	range: SystemRange,
	targetWidth: number,
): LoupeSystemRender | null {
	const measures = bundle.readingScore.measures.length;
	if (range.toMeasure >= measures) return null;
	const options = bundleRenderOptions(bundle);
	const draw = (stretchTo?: number) =>
		renderSystemSlice(bundle.readingScore, bundle.analyzed, options, range.fromMeasure, range.toMeasure, {
			finalBarline: range.toMeasure === measures - 1,
			...(stretchTo !== undefined ? { targetWidth: stretchTo } : {}),
		});
	const read = (svg: string): LoupeSystemRender | null => {
		const m = svg.match(/viewBox="0 ([\d.-]+) ([\d.]+) ([\d.]+)"/);
		return m ? { svg, minY: Number(m[1]), width: Number(m[2]), height: Number(m[3]) } : null;
	};
	const natural = read(draw());
	if (!natural || natural.width >= targetWidth) return natural;
	return read(draw(targetWidth));
}
