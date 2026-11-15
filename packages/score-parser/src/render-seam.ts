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

/** The seam for one render score's bars. */
export function systemSeam(bars: readonly RenderBar[]): SystemSeam {
	return (svg, fromMeasure, toMeasure) => {
		const held = bars.slice(fromMeasure, toMeasure + 1);
		const own = held.filter((b) => !b.later).map((b) => b.source);
		const attr = own.length > 0 ? `data-system="${Math.min(...own)}-${Math.max(...own)}"` : `data-verse-system="${fromMeasure}-${toMeasure}"`;
		return { svg: renameLaterPassAttributes(svg), attr };
	};
}
