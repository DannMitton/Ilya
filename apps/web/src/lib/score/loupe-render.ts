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
import type { LoupeRenderBundle } from '$lib/score/loupe-render-bundle';
import type { SystemRange } from '$lib/score/loupe';

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
 * The options `MarkupPane` gave `paginateScore`, rebuilt from the bundle.
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
 * Float guard on the tap floor, in CSS px: a separation computed as 43.99999
 * meets a 44 px floor, and a real 43.99 does not. Float noise only, never a
 * looser floor (`ENVIRONMENT.md`, the float trap).
 */
export const TAP_FLOOR_EPS_PX = 0.001;

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
	/**
	 * False only where the ceiling itself leaves a pair under the floor. The
	 * render budget never makes it false: the bisection stops on `hi`, which
	 * already clears the floor, so a search cut short by the budget answers
	 * converged, at a `minGap` coarser than `MIN_GAP_RESOLUTION`. So converged
	 * is exactly `worst >= floor - TAP_FLOOR_EPS_PX`.
	 */
	converged: boolean;
	/** The pairs set aside because the ceiling left them under the floor. */
	stuck: string[];
}

/**
 * One render's reading: the smallest separation, the scale, and, where the
 * caller can name them, every adjacent pair's separation by a stable key.
 */
export interface SpacingReading {
	worst: number;
	scale: number;
	pairs?: Readonly<Record<string, number>>;
}

/**
 * Every adjacent pair of carets and its separation in CSS pixels, keyed by the
 * two gaps' own `after` ids (`head` for the first), smallest over every set:
 * each set is one selection's placement, and the floor must hold for all.
 */
export function pairSeparations(
	sets: readonly (readonly { after: string | null; x: number }[])[],
	scale: number,
): Record<string, number> {
	const out: Record<string, number> = {};
	for (const set of sets) {
		const xs = [...set].sort((a, b) => a.x - b.x);
		for (let i = 1; i < xs.length; i++) {
			const key = `${xs[i - 1].after ?? 'head'}>${xs[i].after ?? 'head'}`;
			const px = (xs[i].x - xs[i - 1].x) * scale;
			out[key] = Math.min(out[key] ?? Infinity, px);
		}
	}
	return out;
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
 * non-decreasing in `minGap`, which holds at natural width (module head).
 *
 * A PAIR THE CEILING CANNOT CLEAR IS SET ASIDE, NOT OBEYED (calm-loupe slice
 * 4, 2026-09-28). Until then the search answered the ceiling itself for the
 * whole measure. MEASURED on «Скучай» m. 3: the head caret and the caret
 * after the opening rest stand 18 to 34 px apart at every spacing, because
 * the rest's lead-in does not read `minGap`, so the measure was drawn at
 * minGap 80.67 against the page's 14 and ran 1,298 px into a 907 px window,
 * past its own closing barline. Four measures of that song did the same.
 * Now the pairs under the floor at the ceiling are named in `stuck`, the
 * search clears every other pair at the smallest spacing that does, and the
 * answer stays unconverged so the caller still reports the stuck ones.
 * Where the reading names no pairs, the ceiling is answered as before.
 */
export function deriveMinGap(
	pageMinGap: number,
	worstAt: (minGap: number) => SpacingReading | null,
	floor: number = TAP_FLOOR_PX,
): DerivedSpacing {
	let iterations = 0;
	let scale = 0;
	let skip: ReadonlySet<string> = new Set();
	const read = (g: number): { all: number; rest: number } => {
		iterations++;
		const r = worstAt(g);
		if (!r) return { all: Infinity, rest: Infinity };
		scale = r.scale;
		if (!r.pairs || skip.size === 0) return { all: r.worst, rest: r.worst };
		let rest = Infinity;
		for (const [k, v] of Object.entries(r.pairs)) if (!skip.has(k)) rest = Math.min(rest, v);
		return { all: r.worst, rest };
	};
	const meets = (w: number): boolean => w >= floor - TAP_FLOOR_EPS_PX;
	const start = read(pageMinGap);
	if (meets(start.all)) return { minGap: pageMinGap, worst: start.all, iterations, converged: true, stuck: [] };
	const ceiling = Math.max(pageMinGap, scale > 0 ? floor / scale : floor) * CEILING_FACTOR;
	const top = worstAt(ceiling);
	iterations++;
	if (top) scale = top.scale;
	const topWorst = top ? top.worst : Infinity;
	if (!meets(topWorst)) {
		const stuck = top?.pairs ? Object.keys(top.pairs).filter((k) => !meets(top.pairs![k])) : [];
		if (stuck.length === 0) return { minGap: ceiling, worst: topWorst, iterations, converged: false, stuck };
		skip = new Set(stuck);
		const again = read(pageMinGap);
		if (meets(again.rest)) return { minGap: pageMinGap, worst: again.all, iterations, converged: false, stuck };
	}
	let lo = pageMinGap;
	let hi = ceiling;
	let hiWorst = topWorst;
	while (hi - lo > MIN_GAP_RESOLUTION && iterations < MAX_SPACING_RENDERS) {
		const mid = (lo + hi) / 2;
		const w = read(mid);
		if (meets(w.rest)) {
			hi = mid;
			hiWorst = w.all;
		} else lo = mid;
	}
	return { minGap: hi, worst: hiWorst, iterations, converged: skip.size === 0, stuck: [...skip] };
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
