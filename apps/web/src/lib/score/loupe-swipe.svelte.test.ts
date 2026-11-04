/**
 * Row 181 step 6: the swipe that dismisses the Loupe, moved out of the page, and the pointers it counts so that a pinch on the print
 * strip is never read as it (memo finding 2).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoupeSwipe } from './loupe-swipe.svelte';

const surface = { closest: (sel: string) => (sel.includes('.loupe') ? {} : null) };
const off = { closest: () => null };
const ev = (id: number, x: number, y: number, target: unknown = surface) => ({ pointerId: id, clientX: x, clientY: y, target }) as unknown as PointerEvent;

describe('LoupeSwipe', () => {
	let dismissed = 0;
	let phone = true;
	let open = true;
	const make = () => new LoupeSwipe({ phone: () => phone, open: () => open, dismiss: () => void dismissed++ });
	beforeEach(() => {
		dismissed = 0;
		phone = true;
		open = true;
		vi.stubGlobal('requestAnimationFrame', (f: () => void) => f());
	});
	afterEach(() => vi.unstubAllGlobals());

	it('dismisses on a phone for a swipe down that began on the loupe', () => {
		const s = make();
		s.down(ev(1, 100, 100));
		s.up(ev(1, 102, 170));
		expect(dismissed).toBe(1);
	});

	it('does not dismiss for a short swipe, a sideways one, one that began off the surface, on a desk, or with the Loupe shut', () => {
		const s = make();
		s.down(ev(1, 100, 100));
		s.up(ev(1, 100, 130));
		s.down(ev(1, 100, 100));
		s.up(ev(1, 200, 170));
		s.down(ev(1, 100, 100, off));
		s.up(ev(1, 100, 200));
		phone = false;
		s.down(ev(1, 100, 100));
		s.up(ev(1, 100, 200));
		phone = true;
		open = false;
		s.down(ev(1, 100, 100));
		s.up(ev(1, 100, 200));
		expect(dismissed).toBe(0);
	});

	it('does not dismiss when two pointers are down, nor for the pointerup that ends either (a pinch)', () => {
		const s = make();
		s.down(ev(1, 100, 100));
		s.down(ev(2, 140, 100));
		s.up(ev(2, 140, 200));
		s.up(ev(1, 100, 200));
		expect(dismissed).toBe(0);
		// A swipe after the pinch has ended is a swipe again.
		s.down(ev(1, 100, 100));
		s.up(ev(1, 100, 200));
		expect(dismissed).toBe(1);
	});

	it('stands on the surface for a pinch that began on it with either finger, and clears when the gesture ends', () => {
		const s = make();
		s.down(ev(1, 100, 100, off));
		s.down(ev(2, 140, 100));
		expect(s.onSurface).toBe(true);
		s.up(ev(2, 140, 100));
		s.up(ev(1, 100, 100));
		expect(s.onSurface).toBe(false);
	});

	it('is cleared by a gesture the browser takes away', () => {
		const s = make();
		s.down(ev(1, 100, 100));
		s.down(ev(2, 140, 100));
		s.cancel(ev(2, 0, 0));
		s.cancel(ev(1, 0, 0));
		expect(s.onSurface).toBe(false);
		s.down(ev(1, 100, 100));
		s.up(ev(1, 100, 200));
		expect(dismissed).toBe(1);
	});
});
