/**
 * The cursor, moved out of `+page.svelte` by the audit's phase 4, slice 3
 * (2026-09-27). These pin the behaviour the page had at `9ebfdc0`: two
 * fields that are never both set, a cursor read off them, a `set` that
 * writes them together, and a `move` that walks entry, gap, entry and stops
 * at either end rather than wrapping.
 *
 * No expectation here takes its value from the mechanism under test: every
 * expected place is written out by hand from the three-entry line below.
 */
import { describe, expect, it } from 'vitest';
import type { VocalLineEvent } from '@ilya/score-parser';
import { CorrectionCursor } from './correction-cursor.svelte';

/* `stepCursor` reads only `id`, so an event needs nothing else here. */
const ev = (id: string) => ({ id }) as VocalLineEvent;

/** A stand-in for the page: a line the test can change under the cursor. */
function harness(ids: string[] = ['a', 'b', 'c']) {
	let line = ids.map(ev);
	const c = new CorrectionCursor(() => line);
	return {
		c,
		setLine(next: string[]) {
			line = next.map(ev);
		},
	};
}

describe('CorrectionCursor', () => {
	it('starts nowhere: no selection, not in a gap, no cursor', () => {
		const { c } = harness();
		expect(c.selectedEventId).toBeNull();
		expect(c.gapAfter).toBeUndefined();
		expect(c.cursor).toBeNull();
		expect(c.inGap).toBe(false);
	});

	it('set on an entry selects it and leaves every gap', () => {
		const { c } = harness();
		c.set({ kind: 'gap', after: 'a' });
		c.set({ kind: 'entry', id: 'b' });
		expect(c.selectedEventId).toBe('b');
		expect(c.gapAfter).toBeUndefined();
		expect(c.cursor).toEqual({ kind: 'entry', id: 'b' });
		expect(c.inGap).toBe(false);
	});

	it('set on a gap clears the selection', () => {
		const { c } = harness();
		c.set({ kind: 'entry', id: 'b' });
		c.set({ kind: 'gap', after: 'b' });
		expect(c.selectedEventId).toBeNull();
		expect(c.gapAfter).toBe('b');
		expect(c.cursor).toEqual({ kind: 'gap', after: 'b' });
		expect(c.inGap).toBe(true);
	});

	it('the head gap is a gap: `after: null` is in a gap, not nowhere', () => {
		const { c } = harness();
		c.set({ kind: 'gap', after: null });
		expect(c.gapAfter).toBeNull();
		expect(c.inGap).toBe(true);
		expect(c.cursor).toEqual({ kind: 'gap', after: null });
	});

	it('set(null) clears both fields', () => {
		const { c } = harness();
		c.set({ kind: 'gap', after: null });
		c.set(null);
		expect(c.selectedEventId).toBeNull();
		expect(c.gapAfter).toBeUndefined();
		expect(c.cursor).toBeNull();
	});

	it('a gap wins over a selection written straight to the fields', () => {
		/* The page's Undo writes both fields directly, from a snapshot that
		   `set` made. The cursor reads the gap first, as the page's own
		   `$derived` did. */
		const { c } = harness();
		c.selectedEventId = 'a';
		c.gapAfter = 'b';
		expect(c.cursor).toEqual({ kind: 'gap', after: 'b' });
	});

	it('move walks entry, gap, entry forward', () => {
		const { c } = harness();
		c.set({ kind: 'gap', after: null });
		const seen: unknown[] = [];
		for (let i = 0; i < 6; i++) {
			c.move(1);
			seen.push(c.cursor);
		}
		expect(seen).toEqual([
			{ kind: 'entry', id: 'a' },
			{ kind: 'gap', after: 'a' },
			{ kind: 'entry', id: 'b' },
			{ kind: 'gap', after: 'b' },
			{ kind: 'entry', id: 'c' },
			{ kind: 'gap', after: 'c' },
		]);
	});

	it('move walks back, and keeps the fields exclusive on every step', () => {
		const { c } = harness();
		c.set({ kind: 'entry', id: 'b' });
		c.move(-1);
		expect(c.selectedEventId).toBeNull();
		expect(c.gapAfter).toBe('a');
		c.move(-1);
		expect(c.selectedEventId).toBe('a');
		expect(c.gapAfter).toBeUndefined();
	});

	it('move stops at either end rather than wrapping', () => {
		const { c } = harness();
		c.set({ kind: 'gap', after: 'c' });
		c.move(1);
		expect(c.cursor).toEqual({ kind: 'gap', after: 'c' });
		c.set({ kind: 'gap', after: null });
		c.move(-1);
		expect(c.cursor).toEqual({ kind: 'gap', after: null });
	});

	it('move does nothing with no cursor', () => {
		const { c } = harness();
		c.move(1);
		expect(c.cursor).toBeNull();
	});

	it('move does nothing when the line no longer holds the cursor', () => {
		const h = harness();
		h.c.set({ kind: 'entry', id: 'b' });
		h.setLine(['a', 'c']);
		h.c.move(1);
		expect(h.c.cursor).toEqual({ kind: 'entry', id: 'b' });
	});

	it('move reads the line at the time of the move, not at construction', () => {
		const h = harness(['a']);
		h.c.set({ kind: 'gap', after: 'a' });
		h.setLine(['a', 'n']);
		h.c.move(1);
		expect(h.c.cursor).toEqual({ kind: 'entry', id: 'n' });
	});

	describe('with no carets drawn (calm-loupe slice 1)', () => {
		function quiet(ids: string[] = ['a', 'b', 'c']) {
			const line = ids.map(ev);
			let shown = false;
			const c = new CorrectionCursor(
				() => line,
				() => shown,
			);
			return { c, show: (on: boolean) => (shown = on) };
		}

		it('walks note to note, past every gap, both ways', () => {
			const { c } = quiet();
			c.set({ kind: 'entry', id: 'a' });
			c.move(1);
			expect(c.cursor).toEqual({ kind: 'entry', id: 'b' });
			c.move(1);
			expect(c.cursor).toEqual({ kind: 'entry', id: 'c' });
			c.move(-1);
			c.move(-1);
			expect(c.cursor).toEqual({ kind: 'entry', id: 'a' });
		});

		it('stays on the last entry rather than landing in the tail gap', () => {
			const { c } = quiet();
			c.set({ kind: 'entry', id: 'c' });
			c.move(1);
			expect(c.cursor).toEqual({ kind: 'entry', id: 'c' });
			c.set({ kind: 'entry', id: 'a' });
			c.move(-1);
			expect(c.cursor).toEqual({ kind: 'entry', id: 'a' });
		});

		it('leaves a gap for the next entry in the direction of travel', () => {
			const { c } = quiet();
			c.set({ kind: 'gap', after: 'a' });
			c.move(1);
			expect(c.cursor).toEqual({ kind: 'entry', id: 'b' });
			c.set({ kind: 'gap', after: 'a' });
			c.move(-1);
			expect(c.cursor).toEqual({ kind: 'entry', id: 'a' });
		});

		it('asks at the time of the move, so opening the panel brings the gaps back', () => {
			const { c, show } = quiet();
			c.set({ kind: 'entry', id: 'a' });
			show(true);
			c.move(1);
			expect(c.cursor).toEqual({ kind: 'gap', after: 'a' });
		});
	});

	it('set and move keep `this` when handed on bare, as the page does', () => {
		const { c } = harness();
		const { set, move } = c;
		set({ kind: 'entry', id: 'a' });
		move(1);
		expect(c.cursor).toEqual({ kind: 'gap', after: 'a' });
	});
});
