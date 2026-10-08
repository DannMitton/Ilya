/**
 * first-staved-page.ts: a PDF that opens with a cover still reaches the reader
 * (QUEUE row 44, `brief-code-cover-page-is-not-a-poem_r1_2026-10-08.md`).
 *
 * `ScoreUploader.take` used to rasterize page 1 only and ask whether it had
 * staves. A cover or title page has none, so an IMSLP scan went down the poem
 * route and the reader never ran. It now looks past the cover: page by page
 * from the first, to the first page with staves, at most `COVER_SEARCH_PAGES`.
 * Staves anywhere in that window send the whole PDF to the reader, which reads
 * every page and drops the ones with no music. None: the poem route, with
 * PAGE 1's ink, as before.
 *
 * One page at a time, one open of the PDF: `rasterizePdf`'s `stop` callback
 * ends the render at the first staved page, so a scan whose music begins on
 * page 2 renders two pages, not four, and a poem PDF renders at most four.
 * (Row 45 adds the text-layer decision below.) A page after the first that cannot be rendered ends the search quietly
 * instead of failing the drop: the poem route would have run without it.
 */

/** How many pages the search looks at, from the first. DESK DEFAULT. */
export const COVER_SEARCH_PAGES = 4;

export interface StavedSearch {
	/** Page 1's ink, which the poem route takes if no page has staves. */
	ink: ArrayBuffer;
	/** The 1-based page that has staves, or null when none of the pages searched did. */
	stavedPage: number | null;
}

/** The pages a render yields to a `stop` callback; `rasterizePdf`'s shape. */
export type Rasterize = (
	limit: number,
	stop: (ink: ArrayBuffer, page: number) => Promise<boolean>
) => Promise<ArrayBuffer[]>;

/**
 * The pure core. `rasterize` renders pages in order up to `limit`, showing each
 * to `stop`; `has` answers "does this page show staves". Throws only if page 1
 * itself cannot be rendered or there is no page at all (`undefined` from the
 * caller's perspective: the caller names that failure).
 */
export async function searchForStaves(
	rasterize: Rasterize,
	has: (ink: ArrayBuffer) => Promise<boolean>,
	limit: number = COVER_SEARCH_PAGES
): Promise<StavedSearch | null> {
	let first: ArrayBuffer | null = null;
	let stavedPage: number | null = null;
	try {
		const pages = await rasterize(limit, async (ink, n) => {
			if (n === 1) first = ink;
			if (await has(ink)) {
				stavedPage = n;
				return true;
			}
			return false;
		});
		first ??= pages[0] ?? null;
	} catch (err) {
		// Page 1 in hand and no staves yet: a later page's failure ends the search, not the drop.
		if (first === null) throw err;
	}
	return first === null ? null : { ink: first, stavedPage };
}

/**
 * QUEUE row 45: AN IMAGE-ONLY PDF GOES TO THE READER WHATEVER THE STAFF CHECK
 * SAYS. The check at the door is a light one (five rows each over 40 percent
 * ink) and refuses worn, skewed scans the reader reads (Grechaninov's *Uznik*:
 * widest rows 0.16, 0.41, 0.22). IMSLP's scans are image-only PDFs, so a PDF with
 * no usable text layer cannot be a typed poem, and the reader is asked; it
 * answers `not_music` for a scanned poem and the poem route then runs as today.
 *
 * "Usable text layer": at least `MIN_TEXT_LETTERS` letters in what
 * `extractPdfText` returns. CHOSEN at 20: the poem PDFs measured carry hundreds
 * of letters (a typed four-line stanza has well over 100), an image-only scan
 * carries none, and 20 stays clear of the stray letters an image scan can hold
 * in a watermark. DESK DEFAULT, reversible.
 */
export const MIN_TEXT_LETTERS = 20;

export const lettersIn = (text: string): number => (text.match(/\p{L}/gu) ?? []).length;

/** Where a PDF goes. `stavesFound` is what the poem route is told if the reader finds no music. */
export type PdfRoute = { to: 'reader'; stavesFound: boolean } | { to: 'poem' };

/** The three branches. Pure. `text` is null when the layer could not be read: then it is treated as a typed PDF (the poem route, as before). */
export function decidePdfRoute(stavedPage: number | null, text: string | null): PdfRoute {
	if (stavedPage !== null) return { to: 'reader', stavesFound: true };
	if (text !== null && lettersIn(text) < MIN_TEXT_LETTERS) return { to: 'reader', stavesFound: false };
	return { to: 'poem' };
}

export interface PdfIntake {
	ink: ArrayBuffer;
	route: PdfRoute;
}

/** The search and the decision on a real PDF. Null when the PDF has no pages. */
export async function routePdf(file: File): Promise<PdfIntake | null> {
	const [{ rasterizePdf, extractPdfText }, { hasStaves }] = await Promise.all([import('$lib/reader/page-pdf'), import('$lib/reader/staff-detect')]);
	const found = await searchForStaves((limit, stop) => rasterizePdf(file, limit, stop), (ink) => hasStaves(ink));
	if (!found) return null;
	let text: string | null = null;
	if (found.stavedPage === null) {
		try {
			text = await extractPdfText(file);
		} catch {
			text = null;
		}
	}
	return { ink: found.ink, route: decidePdfRoute(found.stavedPage, text) };
}
