/**
 * N.108 increment 1a: THE SWIPE.
 *
 * Ruled by Dann 2026-09-02: on the phone "a vertical swipe in the motion's
 * direction is a second way, and it must not fire while the loupe is up or a
 * station body is scrolling."
 *
 * The two exclusions he named are the first two tests below, and they are
 * tested with a gesture that would otherwise fire, so what is being pinned is
 * the exclusion and not the threshold.
 */

import { describe, it, expect } from 'vitest';
import { readSwipe, MIN_TRAVEL, DOMINANCE, MAX_DURATION } from './gesture';

const clear = { blocked: false, canScrollFurther: false };
/** A gesture that fires: well past the floor, straight, and quick. */
const firm = { dx: 0, dy: 120, ms: 200 };

describe('N.108 increment 1a the swipe', () => {
	it('reads a firm downward gesture as down and an upward one as up', () => {
		expect(readSwipe(firm, clear)).toBe('down');
		expect(readSwipe({ ...firm, dy: -120 }, clear)).toBe('up');
	});

	/* Dann's first exclusion. The loupe is surgery on one note and the drawer
	   arriving over it would take the singer out of it. */
	it('does not fire while the loupe is up', () => {
		expect(readSwipe(firm, { ...clear, blocked: true })).toBeNull();
		expect(readSwipe({ ...firm, dy: -120 }, { ...clear, blocked: true })).toBeNull();
	});

	/* Dann's second. A body scrolled halfway down belongs to the body until it
	   reaches its end. */
	it('does not fire while a station body can still scroll that way', () => {
		expect(readSwipe(firm, { ...clear, canScrollFurther: true })).toBeNull();
		expect(readSwipe({ ...firm, dy: -120 }, { ...clear, canScrollFurther: true })).toBeNull();
	});

	/* A gesture that is excluded is never measured, so no threshold can let a
	   blocked one through by being generous. */
	it('excludes before it measures', () => {
		const huge = { dx: 0, dy: 4000, ms: 1 };
		expect(readSwipe(huge, { ...clear, blocked: true })).toBeNull();
		expect(readSwipe(huge, { ...clear, canScrollFurther: true })).toBeNull();
	});

	it('ignores a tap with a tremor in it', () => {
		expect(readSwipe({ dx: 0, dy: MIN_TRAVEL - 1, ms: 100 }, clear)).toBeNull();
		expect(readSwipe({ dx: 0, dy: MIN_TRAVEL, ms: 100 }, clear)).toBe('down');
		expect(readSwipe({ dx: 0, dy: 0, ms: 100 }, clear)).toBeNull();
	});

	/* A drawer that rose on a diagonal would fight every sideways gesture the
	   page has. */
	it('ignores a gesture that is not clearly vertical', () => {
		expect(readSwipe({ dx: 100, dy: 120, ms: 200 }, clear)).toBeNull();
		expect(readSwipe({ dx: 120 / DOMINANCE, dy: 120, ms: 200 }, clear)).toBe('down');
		expect(readSwipe({ dx: 120 / DOMINANCE + 1, dy: 120, ms: 200 }, clear)).toBeNull();
	});

	/* A slow drag that ended lower than it started is a scroll, not a swipe. */
	it('ignores a gesture that took too long', () => {
		expect(readSwipe({ ...firm, ms: MAX_DURATION }, clear)).toBe('down');
		expect(readSwipe({ ...firm, ms: MAX_DURATION + 1 }, clear)).toBeNull();
	});

	it('reads sideways travel as nothing at all', () => {
		expect(readSwipe({ dx: 300, dy: 0, ms: 200 }, clear)).toBeNull();
	});
});
