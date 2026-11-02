/** Row 164: the phone's top and bottom, with no DOM. */
import { describe, it, expect } from 'vitest';
import { cardTop, isTap, nextEdge, panelRoom, TAP_SLOP_PX } from '$lib/score/loupe-edge';
import { SWIPE_DISMISS_PX } from '$lib/score/loupe';

describe('nextEdge', () => {
	it('flips between the two edges once the card is on one', () => {
		expect(nextEdge('top', 100, 844)).toBe('bottom');
		expect(nextEdge('bottom', 700, 844)).toBe('top');
	});

	it('sends a card in the seat to the edge farther from it', () => {
		expect(nextEdge('seat', 300, 844)).toBe('bottom');
		expect(nextEdge('seat', 600, 844)).toBe('top');
	});
});

describe('isTap', () => {
	it('is a still finger, and not a swipe', () => {
		expect(isTap(0, 0)).toBe(true);
		expect(isTap(3, 4)).toBe(true);
		expect(isTap(TAP_SLOP_PX + 1, 0)).toBe(false);
		expect(isTap(0, SWIPE_DISMISS_PX)).toBe(false);
	});
});

describe('cardTop and panelRoom', () => {
	const vh = 844, foot = 8, gutter = 24, fixed = 330;

	it('pins the top edge at the gutter, and the seat where the loupe seats it', () => {
		expect(cardTop('top', 180, 0, gutter)).toBe(gutter);
		expect(cardTop('seat', 180, 0, gutter)).toBe(180);
		expect(cardTop('seat', 180, 12, gutter)).toBe(192);
	});

	it('hangs the panel below at the top and at the seat', () => {
		expect(panelRoom('top', vh, foot, gutter, fixed, 180, 0)).toBe(vh - foot - (gutter + fixed));
		expect(panelRoom('seat', vh, foot, gutter, fixed, 180, 0)).toBe(vh - foot - (180 + fixed));
	});

	it('raises the panel above the fixed part at the bottom, so the panel can open there', () => {
		const room = panelRoom('bottom', vh, foot, gutter, fixed, 180, 0);
		expect(room).toBe(vh - foot - gutter - fixed);
		expect(room).toBeGreaterThan(0);
		// the card, fixed part and panel together, then ends at the gutter
		expect(room + fixed).toBe(vh - foot - gutter);
	});

	it('never goes below nothing', () => {
		expect(panelRoom('bottom', 400, foot, gutter, 500, 0, 0)).toBe(0);
		expect(panelRoom('top', 400, foot, gutter, 500, 0, 0)).toBe(0);
	});
});
