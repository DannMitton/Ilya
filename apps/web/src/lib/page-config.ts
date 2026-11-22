/**
 * Page layout configuration for the layered page model.
 *
 * Pure constants and arithmetic. No DOM measurement, no overflow detection,
 * no fallback logic. The page is a fixed-size box with absolutely positioned
 * header, content, and footer layers.
 *
 * Content rows use min-height in a flex column. If a line wraps, it grows
 * and the next row starts below it. Text's page slicing is `page-fit.ts`.
 */

// ── Page dimensions (px at 96dpi) ────────────────────────────────

export const PAGE_SIZES = {
	letter: { width: 816, height: 1056 },
	a4: { width: 794, height: 1123 },
} as const;

// ── Layout constants ─────────────────────────────────────────────

export const MARGINS = { vertical: 48, horizontal: 96 } as const;

/**
 * Space between a header's horizontal rule and the first line of body text.
 *
 * ONE number, used by BOTH the title page and every subsequent page, because
 * Dann's requirement is that the negative space under the rule be identical
 * on every page. It is identical by construction, not by tuning: both header
 * components END at their rule (nothing renders below it), both report their
 * own measured offsetHeight, and both pages set
 *     contentTop = MARGINS.vertical + measuredHeaderHeight + HEADER_GAP
 * so the space below the rule IS this number on every page.
 *
 * It is also the gap above the footer. Before lane 80 (2026-11-21) TEXT left 8 there, MELODY 8 under an 80 px floor and 18 under its header, INSIGHTS 40;
 * `pageFrame` now gives every page of the three documents this one number on both sides.
 */
export const HEADER_GAP = 16;

/** The window of a blank page, in px from the sheet's own edges: the space the squircle's top edge is anchored in. */
export interface BlankFrame {
	top: number;
	bottom: number;
	left: number;
	right: number;
}

/**
 * WHERE THE SQUIRCLE'S TOP EDGE SITS, in px below the top of a blank page's window (lane 79, second addendum, Dann's ruling of 2026-11-21 22:55).
 *
 * THE FIRST LINE IS THE ANCHOR, NOT THE BOX'S CENTRE. Centring a box whose height follows its words moves the first line, so English and French (and the three
 * documents) began at different heights. The top edge is now one number, the same on all three documents in both languages, and the box grows downward.
 *
 * DERIVED ONCE, 2026-11-21: the three blank pages in English and French, in all three voice states, at 390 and at 1024 (36 states, after TEXT's blurb and ask
 * were split). The smallest squircle is H = 86.6 px (INSIGHTS and MELODY in English). The window is 1056 - 169 - 130 = 757 px, so (757 - 86.6) / 2 - 20 = 315.2:
 * where the shortest box's top sat when it was centred, one line of its own type (20 px) higher. Not re-derived at run time; change it only on a new ruling.
 */
export const BLANK_ANCHOR = 315.2;

/**
 * THE WINDOW OF A BLANK PAGE (lane 79, QUEUE row 201): one function, so TEXT, MELODY, and INSIGHTS cannot each compute their own.
 *
 * Dann asked three times for the three blank pages to sit alike (2026-11-19, 2026-11-20 15:41, 2026-11-21 21:42 to 21:48). Lane 78 built one squircle
 * and left each page to hand it a window. `top` is where the squircle's top edge sits: the title rule's `HEADER_GAP` below, then `BLANK_ANCHOR`. `bottom` is the
 * window's lower edge, measured, with no floor (a blank footer is not 80); it bounds the window and positions nothing. A page with content never reads this function.
 */
export function blankFrame(header: number, footer: number): BlankFrame {
	const frame = pageFrame(header, footer);
	return { ...frame, top: frame.top + BLANK_ANCHOR };
}

/** The gaps a page leaves between its window and the header's rule (`top`) and the footer (`bottom`). Both default to `HEADER_GAP`. */
export interface PageGaps {
	top?: number;
	bottom?: number;
}

/**
 * THE WINDOW OF A PAGE (lane 80, QUEUE row 202): one function for every page of TEXT, MELODY, and INSIGHTS.
 *
 *     top    = MARGINS.vertical + the header actually drawn + the gap under its rule
 *     bottom = MARGINS.vertical + the footer's whole height + the gap above it
 *     left   = right = MARGINS.horizontal
 *
 * `bottom` is an inset from the sheet's lower edge, as a CSS `bottom` is. `gaps` exists for a page that must differ; none does today, and the three documents
 * share `HEADER_GAP` on both sides. `header` is the header actually drawn (measured, or `HEADER_HEIGHTS_AT_LETTER` until it reports); `footer` is the footer's whole
 * measured height (or `FOOTER_FALLBACK`), the band and the fixed block together, so no split is needed.
 */
export function pageFrame(header: number, footer: number, gaps: PageGaps = {}): BlankFrame {
	return {
		top: MARGINS.vertical + header + (gaps.top ?? HEADER_GAP),
		bottom: MARGINS.vertical + footer + (gaps.bottom ?? HEADER_GAP),
		left: MARGINS.horizontal,
		right: MARGINS.horizontal,
	};
}

/**
 * Header heights MEASURED AT LETTER WIDTH (816 px), in Chromium with Source Sans 3 and Source Serif 4 loaded, 2026-11-21 (lane 80, step 0): the running header
 * 25 on every later page of the three documents (it was recorded as 29 on 2026-08-15, before `RunningHeader` was rewritten in `eec57e07`, 2026-10-11), and the
 * title header 105 on TEXT (127 on INSIGHTS with a score, 154 on MELODY page 1, where its key line and legend add to it).
 *
 * These are the heights a page assumes until its own header reports. A live `bind:offsetHeight` is taken at whatever width the page is on screen; the sheet is
 * always 816 px wide (`PageFit` scales it), so the live number and these agree, and a first pass with them is the measured pass.
 *
 * Both header components END at their rule (it is the last child, nothing renders below it), so
 *     visible gap = window top - (MARGINS.vertical + header height)
 * is exactly `HEADER_GAP` on every page.
 */
export const HEADER_HEIGHTS_AT_LETTER = {
	title: 105,
	subsequent: 25,
} as const;

/**
 * The footer a page reserves before its own has reported (px): the plain footer, with no legend and no band, MEASURED at 816 px on 2026-11-21 (lane 80,
 * step 0: 66 on every plain page of TEXT, MELODY, and INSIGHTS in both languages). A pane that paginates before its footer reports uses this, so the first pass
 * and the measured pass agree.
 */
export const FOOTER_FALLBACK = 66;

/** Gap between verse rows (px). Used as baseline for title page. */
export const ROW_GAP = 20;

/**
 * The `min-height` a row is given (px). It is NOT the height a row draws: a row draws 56.3 px, and Text's pages take the
 * drawn height from a measurement (`page-fit.ts`). Wrapping rows grow beyond it naturally via flex layout.
 */
export const ROW_HEIGHT = 56;

// ── Page slicing ─────────────────────────────────────────────────

/*
 * Text's page slicing is `page-fit.ts` (step 7, part 1): rows and gap come from heights the page measured, and the
 * slicer is pure. `LINES_PER_PAGE`, `WORDS_PER_ROW`, `rowsOf` and `sliceLinesToPages`, which budgeted rows by a
 * seven-words-a-row estimate against a constant, are gone with the estimate: see that file for what they got wrong.
 */

/**
 * The content window's insets on the sheet (px), as `TitlePage` and `SubsequentPage` set them and as the probe that
 * measures wraps must reproduce: its width is the sheet's less `left`, `right` and `padLeft`, and its `padTop` is inside
 * the window. One place, so the pages and the probe cannot disagree about the width a line wraps at.
 */
/** The inset a word stack puts inside its own box (`WordStack.svelte`, 4 px), so a window's first glyph is `left + padLeft + WORD_STACK_PAD` from the sheet's edge. */
export const WORD_STACK_PAD = 4;
const TEXT_PAD_LEFT = 4;
export const TEXT_CONTENT = {
	/** 96 - 4 - 4 = 88: the window sits left of the margin by what is spent inside it, so the first glyph lands on `MARGINS.horizontal`. */
	left: MARGINS.horizontal - WORD_STACK_PAD - TEXT_PAD_LEFT,
	right: MARGINS.horizontal,
	padLeft: TEXT_PAD_LEFT,
	padTop: 4,
} as const;

/** The width a verse line wraps at on a sheet of this size (816 - 88 - 96 - 4 = 628 at letter). */
export function contentWidth(pageWidth: number): number {
	return pageWidth - TEXT_CONTENT.left - TEXT_CONTENT.right - TEXT_CONTENT.padLeft;
}

// ── Running header ───────────────────────────────────────────────

/**
 * Extract a surname from a display name string.
 *
 * - Strips parenthesized content (dates, birth/death years)
 * - If name contains a comma, text before the comma is the surname
 * - Otherwise, the last word is the surname
 * - Returns uppercase
 */
export function extractSurname(name: string): string {
	const stripped = name.replace(/\s*\([^)]*\)/g, '').trim();

	if (stripped.includes(',')) {
		return stripped.split(',')[0].trim().toUpperCase();
	}

	const parts = stripped.split(/\s+/);
	return parts[parts.length - 1].toUpperCase();
}

/**
 * Format a running header string for subsequent pages.
 *
 * Returns "COMPOSER SURNAME | POET SURNAME | TITLE" in uppercase: one pipe joins every part, since no
 * em dash is shown to the singer (`AGENTS.md`; the pipe, Dann 2026-10-11 22:00, QUEUE row 78a).
 * Poet omitted if empty. Composer omitted if empty.
 * If title is empty, returns empty string.
 */
export function formatRunningHeader(composer: string, title: string, poet?: string): string {
	if (!title.trim()) {
		return '';
	}

	const titleUpper = title.trim().toUpperCase();

	const nameParts: string[] = [];
	if (composer.trim()) {
		nameParts.push(extractSurname(composer));
	}
	if (poet && poet.trim()) {
		nameParts.push(extractSurname(poet));
	}

	if (nameParts.length === 0) {
		return titleUpper;
	}

	return `${nameParts.join(' | ')} | ${titleUpper}`;
}
