/**
 * WHERE A BLOCK MAY BREAK (QUEUE row 79; Dann 2026-10-11 21:50, `PRODUCT.md`
 * "No empty space mid-document", rule 2): "inside a paragraph between lines,
 * with at least two lines on each page". The measuring pane reads each prose
 * block's rendered lines; a break is the top of a line, so every line above it
 * stands whole on the first page and every line from it on the next. Between
 * paragraphs, between a comment's suggestions, and between an endnote's
 * references are breaks of the same kind, since each starts a line.
 *
 * `lineBoxes` reads the DOM; `breakOffsets` is pure, so the unit suite can
 * check the rule on numbers.
 */

/** One printed line of a block, in px from the block's top. */
export interface LineBox {
	top: number;
	bottom: number;
}

/**
 * The block's printed lines: every text fragment's line rectangles, merged
 * where they overlap vertically (two columns side by side, a superscript, an
 * italic run), so no offset this returns falls inside a line. Text inside an
 * SVG (a figure's labels) is not read: a figure never breaks.
 */
export function lineBoxes(el: HTMLElement): LineBox[] {
	const top = el.getBoundingClientRect().top;
	const spans: LineBox[] = [];
	const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
	const range = document.createRange();
	for (let n = walker.nextNode(); n; n = walker.nextNode()) {
		if (!n.textContent?.trim() || n.parentElement?.closest('svg')) continue;
		range.selectNodeContents(n);
		for (const r of range.getClientRects()) if (r.height > 0) spans.push({ top: r.top - top, bottom: r.bottom - top });
	}
	return mergeLines(spans);
}

/** Overlapping spans merged into lines, top to bottom. Pure. */
export function mergeLines(spans: readonly LineBox[]): LineBox[] {
	const sorted = [...spans].sort((a, b) => a.top - b.top);
	const out: LineBox[] = [];
	for (const s of sorted) {
		const last = out[out.length - 1];
		if (last && s.top < last.bottom - 0.5) last.bottom = Math.max(last.bottom, s.bottom);
		else out.push({ ...s });
	}
	return out;
}

/** The offsets where a block may break: the top of each line that leaves at least `min` lines on either side. Pure. */
export function breakOffsets(lines: readonly LineBox[], min = 2): number[] {
	const out: number[] = [];
	for (let j = min; j <= lines.length - min; j++) out.push(Math.floor(lines[j].top));
	return out;
}
