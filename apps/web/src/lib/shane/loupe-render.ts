/**
 * N.153 stage 3a. The loupe's drawing of a system, rendered from the score
 * rather than cloned out of the page.
 *
 * `renderAnalyzedStaff` returns a string, and a string has no layout, so
 * nothing here measures. `Loupe.svelte` mounts the result off-screen and reads
 * it there (`getBBox` on a detached element answers all zeros), and it parses
 * the same string again, detached, for the markup it draws.
 *
 * It renders the SYSTEM the held measure stands in, not the measure alone, and
 * at the width the page drew that system. A one-measure render at the page's
 * own spacing is 17 to 71 percent narrower than the page's justified measure
 * on the fixture (measured 2026-09-20), so it would change what the singer
 * sees. Deriving a spacing of the loupe's own is stage 3b.
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

/**
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
