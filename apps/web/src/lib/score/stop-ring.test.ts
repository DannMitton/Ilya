/**
 * The squircle on every stop (calm-loupe slice 7, 2026-09-28). Native units.
 * `armHalf` 1.87 is 0.34 of the fixture's 5.5-unit stave space (THE CARET,
 * clause 4); the ring's stroke is 2 (`RING_STROKE`) and its padding 4
 * (`RING_PAD_X`), so the floor is 1.87 + 3 = 4.87 and the padded half 5.87.
 */
import { describe, expect, it } from 'vitest';
import { caretRingFloor, caretRingHalf, inkRoom, ringBoundary } from './stop-ring';

const ARM = 1.87;

describe('inkRoom', () => {
	it('is the distance to the nearer ink on either side', () => {
		expect(inkRoom(50, [{ left: 30, right: 40 }, { left: 56, right: 70 }], 0, 100)).toBe(6);
	});

	it('reads every entry, not only the two beside the gap in the list', () => {
		// The carried-rest order: the entry listed first stands right of the caret.
		expect(inkRoom(50, [{ left: 58, right: 70 }, { left: 10, right: 20 }], 0, 100)).toBe(8);
	});

	it('is bounded by the edges where no ink is nearer', () => {
		expect(inkRoom(5, [{ left: 40, right: 50 }], 2, 100)).toBe(3);
	});

	it('is nothing where ink stands on the caret line', () => {
		expect(inkRoom(50, [{ left: 45, right: 55 }], 0, 100)).toBe(0);
	});
});

describe('caretRingHalf', () => {
	it('pads the arrowheads as a notehead is padded, where there is room', () => {
		expect(caretRingHalf(20, ARM)).toEqual({ half: ARM + 4, short: false });
	});

	it('narrows to leave air where the padded ring would reach the ink', () => {
		const { half, short } = caretRingHalf(6, ARM);
		expect(half).toBeCloseTo(4);
		expect(short).toBe(false);
	});

	it('never goes under its floor, and says so', () => {
		const { half, short } = caretRingHalf(3, ARM);
		expect(half + 1).toBeCloseTo(caretRingFloor(ARM));
		expect(short).toBe(true);
	});
});

describe('ringBoundary', () => {
	it('is the ring outer stroke edges', () => {
		expect(ringBoundary({ x: 100, width: 15, stroke: 2 }, 90)).toEqual({ left: 99, right: 116 });
	});

	it('is none for a ring wholly left of the measure window, as a carried rest', () => {
		expect(ringBoundary({ x: 40, width: 15, stroke: 2 }, 90)).toBeNull();
	});

	it('is none where there is no ring', () => {
		expect(ringBoundary(null, 90)).toBeNull();
	});
});
