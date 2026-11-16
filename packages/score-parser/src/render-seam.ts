/**
 * The seam between a rendered system and the page (strophic lane A, brief r5, D6
 * and D7).
 *
 * `paginateScore` takes it as one optional option and calls it after each system
 * is rendered (both calls: the packed width and the last system again at its
 * natural width) and for the wrapper attribute. With the option absent,
 * `paginateScore`'s output is byte-identical (D8 tests that).
 *
 * D6: every element drawn for a later-pass event names it with a derived id
 * (`<id>~v<k>`). Here the four attributes the page and the Loupe look events up
 * by (`data-hit`, `data-event-id`, `data-of-event`, `data-ipa-of`) are renamed
 * with a `data-verse-` prefix on such an element, and the element gains
 * `data-verse="k"`, so every lookup by id sees verse 1 only. A system that holds
 * a bar that is not a later-pass bar keeps `data-system`, its value the first and
 * last SOURCE index of those bars (the Loupe parses every range and looks the
 * held bar up by its source index); a system of later-pass bars only carries
 * `data-verse-system`, with printed indices.
 */
import type { RenderBar } from './render-score';
import { BAR_NUMBER, CYR_FONT_FAMILY, CYR_FONT_SIZE } from './staff-renderer';

export interface SeamResult {
	/** The system's markup, renamed. */
	svg: string;
	/** The whole attribute that stands on the system's wrapper: `data-system="a-b"` or `data-verse-system="a-b"`. */
	attr: string;
}

/** `(markup, firstPrintedBar, lastPrintedBar) => the markup and the wrapper's attribute`. */
export type SystemSeam = (svg: string, fromMeasure: number, toMeasure: number) => SeamResult;

const LOOKUP_ATTRIBUTES = /\sdata-(hit|event-id|of-event|ipa-of)="([^"]*)"/g;

/** The D6 rename over one system's markup. Markup that names no later-pass event is returned as it is. */
export function renameLaterPassAttributes(svg: string): string {
	if (!svg.includes('~v')) return svg;
	return svg.replace(/<[A-Za-z][^<>]*>/g, (tag) => {
		if (!tag.includes('~v')) return tag;
		let verse: string | undefined;
		const renamed = tag.replace(LOOKUP_ATTRIBUTES, (whole, name: string, value: string) => {
			const k = /~v(\d+)/.exec(value)?.[1];
			if (!k) return whole;
			verse ??= k;
			return ` data-verse-${name}="${value}"`;
		});
		return verse ? renamed.replace(/(\/?>)$/, ` data-verse="${verse}"$1`) : tag;
	});
}

/** The two ratified strings, handed in by the page (this package holds no copy of its own). */
export interface SeamText {
	/** "Verse 2": the label above the first bar of a later pass. */
	label: (place: number) => string;
	/** "12 · verse 2": the bar number's tag at a system start inside a later pass. */
	tag: (bar: string, place: number) => string;
}

const esc = (t: string): string => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const round2 = (v: number): number => Math.round(v * 100) / 100;
/** An upper bound on an italic serif string's width in em per character, so the tag never passes the left edge. JUDGEMENT; e2e measures the real ink. */
const EM_PER_CHAR = 0.62;

/** The x of the leftmost ink of the group that is `id`'s own, not counting its hit rectangle. Undefined where there is no such group. */
function groupLeft(svg: string, id: string): number | undefined {
	const open = svg.search(new RegExp(`<g data-(?:verse-)?event-id="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
	// A rest is drawn in an anonymous group (`<g pointer-events="none">`) whose first child is its hit rectangle, so it is found by that.
	const at = open >= 0 ? open : svg.search(new RegExp(`<rect data-(?:verse-)?hit="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
	if (at < 0) return undefined;
	const body = svg.slice(at, svg.indexOf('</g>', at)).replace(/^<rect data-(?:verse-)?hit="[^>]*>/, '');
	const xs: number[] = [];
	for (const m of body.matchAll(/<rect x="([-\d.]+)"/g)) xs.push(Number(m[1]));
	for (const m of body.matchAll(/<ellipse cx="([-\d.]+)" cy="[-\d.]+" rx="([-\d.]+)"/g)) xs.push(Number(m[1]) - Number(m[2]));
	for (const m of body.matchAll(/<text [^>]*?\bx="([-\d.]+)"/g)) xs.push(Number(m[1])); // a notehead drawn as a font glyph starts at its x
	return xs.length > 0 ? Math.min(...xs) : undefined;
}

/** The x of a tacet group's left end. The markup names a run by its printed index (`staff-renderer.ts`, `runFrom`). */
function tacetLeft(svg: string, printed: number): number | undefined {
	const open = svg.search(new RegExp(`<g data-tacet="${printed}-`));
	if (open < 0) return undefined;
	const body = svg.slice(open, svg.indexOf('</g>', open));
	const xs = [...body.matchAll(/\s(?:x|x1)="([-\d.]+)"/g)].map((m) => Number(m[1]));
	return xs.length > 0 ? Math.min(...xs) : undefined;
}

/** D7: the label above each bar of this system that opens a later pass, the system's box grown to hold it. */
function withLabels(svg: string, slice: readonly RenderBar[], from: number, text: SeamText): string {
	const labelled = slice.map((b, i) => ({ b, i })).filter((x) => x.b.label !== undefined);
	if (labelled.length === 0) return svg;
	const vb = /viewBox="0 ([-\d.]+) ([\d.]+) ([\d.]+)"/.exec(svg);
	if (!vb) return svg;
	const [minY, width, height] = [Number(vb[1]), Number(vb[2]), Number(vb[3])];
	const fs = CYR_FONT_SIZE;
	const baseline = round2(minY - 0.35 * fs);
	const band = round2(1.4 * fs);
	const marks = labelled.map(({ b, i }) => {
		const x = (b.first ? groupLeft(svg, b.first) : undefined) ?? tacetLeft(svg, from + i) ?? 0;
		return `<text data-verse-label="${b.label}" x="${round2(x)}" y="${baseline}" text-anchor="start" font-size="${fs}" font-family="${CYR_FONT_FAMILY}" fill="${BAR_NUMBER.fill}">${esc(text.label(b.label!))}</text>`;
	});
	const grown = svg
		.replace(vb[0], `viewBox="0 ${round2(minY - band)} ${width} ${round2(height + band)}"`)
		.replace(/^(<svg[^>]*?) height="[\d.]+"/, `$1 height="${round2(height + band)}"`);
	return grown.replace(/<\/svg>\s*$/, `${marks.join('\n')}\n</svg>`);
}

/** D7: at a system start inside a later pass, the bar number carries the tag, kept off the left edge. */
function withTag(svg: string, first: RenderBar, text: SeamText): string {
	if (!first.later || first.label !== undefined) return svg;
	return svg.replace(/<text data-bar-number="([^"]*)" x="([-\d.]+)" y="([-\d.]+)" text-anchor="middle"([^>]*)>([^<]*)<\/text>/, (whole, bar: string, x: string, y: string, rest: string, shown: string) => {
		if (shown !== bar) return whole; // the bracketed courtesy number after a long rest takes no tag
		const tag = text.tag(bar, first.place);
		const half = (tag.length * EM_PER_CHAR * CYR_FONT_SIZE) / 2;
		const left = Number(x) - half < 0;
		return `<text data-bar-number="${bar}" x="${left ? 0 : x}" y="${y}" text-anchor="${left ? 'start' : 'middle'}"${rest}>${esc(tag)}</text>`;
	});
}

/** The seam for one render score's bars. */
export function systemSeam(bars: readonly RenderBar[], text?: SeamText): SystemSeam {
	return (svg, fromMeasure, toMeasure) => {
		const held = bars.slice(fromMeasure, toMeasure + 1);
		const own = held.filter((b) => !b.later).map((b) => b.source);
		const attr = own.length > 0 ? `data-system="${Math.min(...own)}-${Math.max(...own)}"` : `data-verse-system="${fromMeasure}-${toMeasure}"`;
		let out = renameLaterPassAttributes(svg);
		if (text) {
			out = withTag(out, held[0], text);
			out = withLabels(out, held, fromMeasure, text);
		}
		return { svg: out, attr };
	};
}
