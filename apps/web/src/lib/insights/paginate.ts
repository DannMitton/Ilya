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
	/**
	 * QUEUE row 79: a block this segment shows only part of, by its index: the px from its top where the part begins
	 * and ends. The page draws the block whole inside a window of that height, shifted up by the start.
	 */
	cuts?: Record<number, [number, number]>;
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
 *
 * FIGURES FLOAT (QUEUE row 79; Dann 2026-10-11 21:50, `PRODUCT.md` "No empty
 * space mid-document", rule 3). A figure (`figures[i]`) that does not fit where
 * it falls goes to the top of the next page, and the prose blocks after it in
 * the same squircle that fit move up into the space it left. Never more than
 * one page, and never ahead of the block that introduces it: only blocks AFTER
 * the figure move, so a segment's `blocks` may then be out of index order.
 *
 * PROSE BREAKS BETWEEN LINES (the same ruling, rule 2). `breaks[i]` lists the
 * offsets where block `i` may break, each leaving at least two lines above and
 * below (`breakOffsets`). A block that does not fit puts its first part on this
 * page, up to the lowest break that fits, and the rest on the next, where it may
 * break again, two lines on from where it began. A heading rides on its block's
 * first lines, so it never ends a page alone.
 *
 * Without `figures` and `breaks` the answer is the one this function always gave.
 */
export function paginate(
	groups: readonly Group[],
	heights: readonly number[],
	g: Geometry,
	figures: readonly boolean[] = [],
	breaks: readonly (readonly number[])[] = [],
): Segment[][] {
	interface Item {
		i: number;
		from: number;
		to: number;
	}
	const pages: Segment[][] = [[]];
	const order: Item[] = groups.map((_, i) => ({ i, from: 0, to: heights[i] ?? 0 }));
	const floated = new Set<number>();
	let used = 0;
	let prev = -1; // the block placed last, in placement order
	const page = () => pages[pages.length - 1];
	const last = () => page()[page().length - 1] as Segment | undefined;
	/** The breaks a part starting at `from` may take: two lines on from its start. */
	const allowed = (i: number, from: number): readonly number[] => {
		const b = breaks[i] ?? [];
		if (from === 0) return b;
		const k = b.indexOf(from);
		return k < 0 ? [] : b.slice(k + 2);
	};
	for (let q = 0; q < order.length; q++) {
		const it = order[q];
		const i = it.i;
		const group = groups[i];
		const boxed = group !== 'free';
		const continues = boxed && prev >= 0 && groups[prev] === group;
		const joins = (after: number) => boxed && last()?.group === group && last()!.blocks[last()!.blocks.length - 1] === after;
		const cost = (h: number, after: number) =>
			joins(after) ? g.inner + h : (page().length > 0 ? g.gap : 0) + (boxed ? (continues && page().length === 0 ? g.openPad : g.pad) + g.pad : 0) + h;
		const cap = g.capacity(pages.length - 1);

		if (used + cost(it.to - it.from, prev) > cap) {
			if (page().length > 0 && figures[i] && it.from === 0 && !floated.has(i)) {
				// Pull up the prose after the figure, in order, while it fits whole.
				let room = cap - used;
				const pulled: Item[] = [];
				let after = prev;
				for (let r = q + 1; r < order.length; r++) {
					const j = order[r];
					if (groups[j.i] !== group || figures[j.i] || j.from !== 0) break;
					const c = cost(j.to - j.from, after);
					if (c > room) break;
					pulled.push(j);
					room -= c;
					after = j.i;
				}
				floated.add(i);
				if (pulled.length > 0) {
					order.splice(q + 1, pulled.length);
					order.splice(q, 0, ...pulled);
					q--;
					continue;
				}
			}
			// The lowest break whose first part fits here.
			const fits = allowed(i, it.from).filter((b) => b > it.from && b < it.to && used + cost(b - it.from, prev) <= cap);
			if (fits.length > 0) {
				const b = fits[fits.length - 1];
				place({ i, from: it.from, to: b }, cost(b - it.from, prev));
				const tail = last()!;
				if (boxed) tail.openBottom = true;
				pages.push([]);
				used = 0;
				order.splice(q + 1, 0, { i, from: b, to: it.to });
				continue;
			}
			if (page().length > 0) {
				const tail = last();
				if (tail && boxed && tail.group === group && tail.blocks[tail.blocks.length - 1] === prev) tail.openBottom = true;
				pages.push([]);
				used = 0;
				q--; // try it again on the new page, where it may break once more
				continue;
			}
		}
		place(it, cost(it.to - it.from, prev));
	}

	function place(it: Item, c: number): void {
		const group = groups[it.i];
		const boxed = group !== 'free';
		const continues = boxed && prev >= 0 && groups[prev] === group;
		let seg: Segment;
		if (boxed && last()?.group === group && last()!.blocks[last()!.blocks.length - 1] === prev) {
			seg = last()!;
			seg.blocks.push(it.i);
		} else {
			seg = { group, blocks: [it.i], openTop: continues && page().length === 0, openBottom: false };
			page().push(seg);
		}
		if (it.from > 0 || it.to < (heights[it.i] ?? 0)) (seg.cuts ??= {})[it.i] = [it.from, it.to];
		used += c;
		prev = it.i;
	}
	return pages.filter((p, n) => p.length > 0 || n === 0);
}
