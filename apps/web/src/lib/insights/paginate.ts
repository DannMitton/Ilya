/**
 * PAGES FROM MEASURED BLOCKS (QUEUE row 66). The round 2 page flows: a squircle
 * may break across a page, and Dann wants that ("exactly as I imagined",
 * 2026-10-11 03:11), and nothing may collide or clip ("collisions and overlaps
 * are forbidden", 03:42). So the pane measures every block at its printed
 * width, and this function places them, never past a page's capacity unless a
 * single block is taller than a whole page.
 *
 * A squircle that continues onto the next page leaves its bottom open there
 * and its top open on the next, as the accepted drawing shows. Pure.
 */
import type { Group } from './singer-blocks';

export interface Segment {
	group: Group;
	/** Indices into the block list, in order. */
	blocks: number[];
	/** The squircle continues from the page before. */
	openTop: boolean;
	/** The squircle continues onto the page after. */
	openBottom: boolean;
}

export interface Geometry {
	/** Room for content on page `n` (0-based), in px. */
	capacity: (page: number) => number;
	/** Between two segments on a page. */
	gap: number;
	/** Between two blocks inside one squircle. */
	inner: number;
	/** A squircle's border and padding at a closed edge. */
	pad: number;
	/** At an open edge. */
	openPad: number;
}

/**
 * Pages of segments. A free block is a segment of its own; consecutive blocks
 * of one squircle share a segment until a page ends. A block that does not fit
 * starts a new page, unless the page is still empty, where it is placed anyway:
 * a block taller than a page is the one overflow this function allows.
 */
export function paginate(groups: readonly Group[], heights: readonly number[], g: Geometry): Segment[][] {
	const pages: Segment[][] = [[]];
	let used = 0;
	for (let i = 0; i < groups.length; i++) {
		const group = groups[i];
		const h = heights[i] ?? 0;
		const page = () => pages[pages.length - 1];
		const last = () => page()[page().length - 1] as Segment | undefined;
		const boxed = group !== 'free';
		const extends_ = () => boxed && last()?.group === group && last()!.blocks[last()!.blocks.length - 1] === i - 1;
		const continues = boxed && i > 0 && groups[i - 1] === group;

		const cost = () =>
			extends_()
				? g.inner + h
				: (page().length > 0 ? g.gap : 0) + (boxed ? (continues && page().length === 0 ? g.openPad : g.pad) + g.pad : 0) + h;

		if (used + cost() > g.capacity(pages.length - 1) && page().length > 0) {
			const tail = last();
			if (tail && boxed && tail.group === group && tail.blocks[tail.blocks.length - 1] === i - 1) tail.openBottom = true;
			pages.push([]);
			used = 0;
		}
		const c = cost();
		if (extends_()) last()!.blocks.push(i);
		else page().push({ group, blocks: [i], openTop: continues && page().length === 0, openBottom: false });
		used += c;
	}
	return pages.filter((p, n) => p.length > 0 || n === 0);
}
