/**
 * crossing-ring.test.ts: Markup's crossing squircle in the selection ring's
 * shape (QUEUE row 34), standing outside it since row 78c. The unit suite has
 * no layout, so the box itself is measured on the live page (the report's
 * table); here, what the ring is made of and where the selection ring stands
 * against it.
 */
import { describe, expect, it } from 'vitest';
import { CROSSING_RING_OFFSET, CROSSING_RING_REACH, CROSSING_RING_HEADROOM, PLACEHOLDER_DASH } from '@ilya/score-parser';
import { CROSSING_INK, CROSSING_STROKE, crossingBox, crossingRingAttributes, selectionAnchorIndex } from './crossing-ring';
import { RING_PAD_X, RING_RADIUS, RING_STROKE } from './selection-ring';

const BOX = { x: 10, y: 20, width: 26, height: 84 };

describe('the crossing ring', () => {
	it('is the box it is given, with a corner concentric with the selection ring’s, in the crossing’s red at its old weight', () => {
		const a = Object.fromEntries(crossingRingAttributes(BOX, false));
		expect([a.x, a.y, a.width, a.height].map(Number)).toEqual([10, 20, 26, 84]);
		expect(a.rx).toBe(String(RING_RADIUS + 4));
		expect(a.stroke).toBe('#b23b3b');
		expect(CROSSING_INK).toBe('#b23b3b');
		expect(a['stroke-width']).toBe(String(CROSSING_STROKE));
		expect(a.fill).toBe('none');
	});

	it('stands outside the selection ring: its box grown by the selection stroke plus an equal gap on every side (row 78c)', () => {
		expect(CROSSING_RING_OFFSET).toBe(RING_STROKE * 2);
		expect(crossingBox(BOX)).toEqual({ x: 6, y: 16, width: 34, height: 92 });
	});

	it('tells the renderer how far it reaches: the padding, the offset, and half its stroke (row 78c)', () => {
		expect(CROSSING_RING_REACH).toBeCloseTo(RING_PAD_X + 4 + CROSSING_STROKE / 2, 9);
		expect(CROSSING_RING_HEADROOM).toBeCloseTo(4 + CROSSING_STROKE / 2, 9);
	});

	it('keeps the analysis handle, so the loupe and the ink survey still drop it', () => {
		const a = Object.fromEntries(crossingRingAttributes(BOX, false));
		expect(a['data-analysis']).toBe('crossing');
		expect('data-crossing-ring' in a).toBe(true);
	});

	it('is solid on a sung vowel and dashed on a placeholder (QUEUE row 69)', () => {
		const solid = Object.fromEntries(crossingRingAttributes(BOX, false));
		expect('stroke-dasharray' in solid).toBe(false);
		expect('data-placeholder' in solid).toBe(false);
		const dashed = Object.fromEntries(crossingRingAttributes(BOX, true));
		expect(dashed['stroke-dasharray']).toBe(PLACEHOLDER_DASH);
		expect(dashed['data-placeholder']).toBe('true');
	});
});

describe('the selection ring stands over a crossing ring', () => {
	it('goes past the crossing rings at the front of the system', () => {
		expect(selectionAnchorIndex([{ crossing: true }, { crossing: true }, { crossing: false }], 0)).toBe(2);
	});
	it('goes to the front when there is none', () => {
		expect(selectionAnchorIndex([{ crossing: false }, { crossing: false }], 0)).toBe(0);
	});
	it('starts after the ground', () => {
		expect(selectionAnchorIndex([{ crossing: false }, { crossing: true }, { crossing: false }], 1)).toBe(2);
	});
});
