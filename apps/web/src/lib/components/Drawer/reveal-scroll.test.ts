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

/* N.203 lane 61, Step 2: a link's target. The word tap's expectations above are unchanged. */
describe('revealScrollTop for a link (Dann 2026-11-16 20:13)', () => {
	it('on a phone, leaves the Drawer alone when the target is inside the window (a word tap would send it to 0)', () => {
		expect(revealScrollTop({ phone: true, link: true, scrollTop: 480, window: win, head: { top: 300, bottom: 340 } })).toBeNull();
	});
	it('on a phone, aligns the target to the window top when it is below the foot or above the window', () => {
		expect(revealScrollTop({ phone: true, link: true, scrollTop: 10, window: win, head: { top: 760, bottom: 800 } })).toBe(670);
		expect(revealScrollTop({ phone: true, link: true, scrollTop: 400, window: win, head: { top: 20, bottom: 60 } })).toBe(320);
	});
	it('on a phone, does nothing when the target is not found, and on a desk behaves as the word tap does', () => {
		expect(revealScrollTop({ phone: true, link: true, scrollTop: 480, window: win, head: null })).toBeNull();
		expect(revealScrollTop({ phone: false, link: true, scrollTop: 10, window: win, head: { top: 760, bottom: 800 } })).toBe(670);
	});
	it('a target that straddles the foot counts as outside', () => {
		expect(revealScrollTop({ phone: false, link: true, scrollTop: 0, window: win, head: { top: 680, bottom: 720 } })).toBe(580);
	});
});
