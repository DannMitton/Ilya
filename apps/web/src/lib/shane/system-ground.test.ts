/**
 * Where a mark goes so the paper does not cover it. The orders below are the
 * ones observed on the engraved Without Sun song 1, m. 18, 2026-09-14, plus the
 * cases the rule must hold for whichever effect runs first.
 */

import { describe, it, expect } from 'vitest';
import { afterGroundIndex, type SystemChild } from './system-ground';

const W = 241.25;
const ground: SystemChild = { tagName: 'rect', width: W, marked: false };
const held: SystemChild = { tagName: 'rect', width: 185.26, marked: true };
const ring: SystemChild = { tagName: 'rect', width: 15, marked: true };
const staffLine: SystemChild = { tagName: 'line', width: Number.NaN, marked: false };

describe('a mark inserted into a system', () => {
	it('lands after the ground on a bare system', () => {
		expect(afterGroundIndex([ground, staffLine], W)).toBe(1);
	});

	it('lands after the ground when the loupe\'s rectangle already stands first', () => {
		// The observed failure: held-measure first, so a skip over LEADING
		// full-width rects stopped at index 0 and put the ring under the paper.
		expect(afterGroundIndex([held, ground, staffLine], W)).toBe(2);
	});

	it('lands after the ground when a ring already stands before it', () => {
		expect(afterGroundIndex([ring, ground, staffLine], W)).toBe(2);
	});

	it('lands after the ground when both marks stand before it', () => {
		expect(afterGroundIndex([held, ring, ground, staffLine], W)).toBe(3);
	});

	it('never reads a full-width mark as the ground', () => {
		const wideRing: SystemChild = { tagName: 'rect', width: W, marked: true };
		expect(afterGroundIndex([ground, wideRing, staffLine], W)).toBe(1);
	});

	it('goes to the front of a system that paints no ground', () => {
		expect(afterGroundIndex([staffLine, staffLine], W)).toBe(0);
		expect(afterGroundIndex([], W)).toBe(0);
	});

	it('does not read a ground on a system of no width', () => {
		expect(afterGroundIndex([ground], 0)).toBe(0);
	});
});
