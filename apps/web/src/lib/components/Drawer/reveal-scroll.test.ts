/**
 * N.201 step 2, amendment A9: where the Drawer scrolls on a word tap. The
 * expectations are the brief's: phone to the top on every tap; desktop only
 * when the ANALYSIS head is outside the window, head to the window's top.
 */
import { describe, it, expect } from 'vitest';
import { revealScrollTop } from './reveal-scroll';

const win = { top: 100, bottom: 700 };

describe('revealScrollTop', () => {
	it('takes a phone to the top, whatever the head and the scroll', () => {
		expect(revealScrollTop({ phone: true, scrollTop: 0, window: win, head: { top: 300, bottom: 340 } })).toBe(0);
		expect(revealScrollTop({ phone: true, scrollTop: 480, window: win, head: null })).toBe(0);
	});
	it('leaves a desktop alone when the head is inside the window', () => {
		expect(revealScrollTop({ phone: false, scrollTop: 50, window: win, head: { top: 300, bottom: 340 } })).toBeNull();
		expect(revealScrollTop({ phone: false, scrollTop: 50, window: win, head: { top: 100, bottom: 140 } })).toBeNull();
	});
	it('leaves a desktop alone when there is no head to find', () => {
		expect(revealScrollTop({ phone: false, scrollTop: 50, window: win, head: null })).toBeNull();
	});
	it('aligns the head to the window top when it is below the foot', () => {
		expect(revealScrollTop({ phone: false, scrollTop: 10, window: win, head: { top: 760, bottom: 800 } })).toBe(670);
	});
	it('aligns the head to the window top when it is above the window', () => {
		expect(revealScrollTop({ phone: false, scrollTop: 400, window: win, head: { top: 60, bottom: 100 } })).toBe(360);
	});
	it('never asks for a negative scroll', () => {
		expect(revealScrollTop({ phone: false, scrollTop: 10, window: win, head: { top: 40, bottom: 80 } })).toBe(0);
	});
	it('treats a head that straddles the foot as outside', () => {
		expect(revealScrollTop({ phone: false, scrollTop: 0, window: win, head: { top: 680, bottom: 720 } })).toBe(580);
	});
});
