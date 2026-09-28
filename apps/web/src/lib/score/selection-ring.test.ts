/**
 * Which group a taken entry's ring is read from (calm-loupe slice 7,
 * 2026-09-28). The renderer wraps a rest in an ANONYMOUS group holding its hit
 * rectangle and its glyph (`staff-renderer.ts`, N.92 clause 5), so before this
 * a taken rest drew no ring. The unit suite has no DOM, so the elements are
 * the three properties `entryGroup` reads, written out by hand.
 */
import { describe, expect, it } from 'vitest';
import { entryGroup } from './selection-ring';

interface Fake {
	tagName: string;
	parentElement: Fake | null;
	attrs: string[];
	closest(sel: string): Fake | null;
}

function el(tagName: string, parent: Fake | null, attrs: string[] = []): Fake {
	const self: Fake = {
		tagName,
		parentElement: parent,
		attrs,
		closest(sel) {
			const name = sel.slice(1, -1);
			for (let e: Fake | null = self; e; e = e.parentElement) if (e.attrs.includes(name)) return e;
			return null;
		},
	};
	return self;
}

const system = el('svg', null, ['data-system']);

describe('entryGroup', () => {
	it("a note's group is its data-event-id group", () => {
		const note = el('g', system, ['data-event-id']);
		const hit = el('rect', note, ['data-hit']);
		expect(entryGroup(hit as unknown as Element)).toBe(note);
	});

	it("a rest's group is the anonymous group around its hit rectangle", () => {
		const rest = el('g', system);
		const hit = el('rect', rest, ['data-hit']);
		expect(entryGroup(hit as unknown as Element)).toBe(rest);
	});

	it('a hit rectangle standing in the system itself has no group', () => {
		const hit = el('rect', system, ['data-hit']);
		expect(entryGroup(hit as unknown as Element)).toBeNull();
	});
});
