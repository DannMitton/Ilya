/**
 * The tween between the loupe's two modes (loupe remainder brief, item 1,
 * 2026-10-02). The numbers are the ones `loupe-tween.svelte.ts` cites from
 * `docs/memory/OPEN.md`, THE LOUPE'S TWO MODES, ruling 3, as the brief
 * restates them: about 220 ms in, 150 ms out, the toggle locked while it runs.
 * Expected values are written by hand.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { animatePanel, ModeTween, TWEEN_IN_MS, TWEEN_OUT_MS, tweenDirection, tweenMs } from './loupe-tween.svelte';

const shut = { carets: false, panel: false };
const syllables = { carets: false, panel: true };
const corrections = { carets: true, panel: true };

describe('which way a change runs', () => {
	it('carets appearing is in, and going is out', () => {
		expect(tweenDirection(syllables, corrections)).toBe('in');
		expect(tweenDirection(corrections, syllables)).toBe('out');
	});

	it('a shut panel losing its carets is out, and the chevron reopening Corrections is in', () => {
		expect(tweenDirection(corrections, shut)).toBe('out');
		expect(tweenDirection(shut, corrections)).toBe('in');
	});

	it('the chevron alone, in Syllables, opens as in and shuts as out', () => {
		expect(tweenDirection(shut, syllables)).toBe('in');
		expect(tweenDirection(syllables, shut)).toBe('out');
	});

	it('nothing changed is no direction', () => {
		expect(tweenDirection(corrections, corrections)).toBeNull();
		expect(tweenDirection(shut, shut)).toBeNull();
	});
});

describe('the durations', () => {
	it('is 220 ms in and 150 ms out', () => {
		expect(TWEEN_IN_MS).toBe(220);
		expect(TWEEN_OUT_MS).toBe(150);
		expect(tweenMs('in')).toBe(220);
		expect(tweenMs('out')).toBe(150);
	});
});

describe('the tween and its lock', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('records the first state and starts nothing: a loupe raised in Syllables does not tween', () => {
		const t = new ModeTween();
		expect(t.update(shut, false)).toBeNull();
		expect(t.locked).toBe(false);
	});

	it('locks the toggle for 220 ms going in, then frees it', () => {
		const t = new ModeTween();
		t.update(syllables, false);
		expect(t.update(corrections, false)).toBe('in');
		expect(t.locked).toBe(true);
		vi.advanceTimersByTime(219);
		expect(t.locked).toBe(true);
		vi.advanceTimersByTime(1);
		expect(t.locked).toBe(false);
	});

	it('locks it for 150 ms going out', () => {
		const t = new ModeTween();
		t.update(corrections, false);
		expect(t.update(syllables, false)).toBe('out');
		vi.advanceTimersByTime(149);
		expect(t.locked).toBe(true);
		vi.advanceTimersByTime(1);
		expect(t.locked).toBe(false);
	});

	it('a change during a tween restarts the clock on the new direction', () => {
		const t = new ModeTween();
		t.update(syllables, false);
		t.update(corrections, false);
		vi.advanceTimersByTime(100);
		expect(t.update(shut, false)).toBe('out');
		vi.advanceTimersByTime(149);
		expect(t.locked).toBe(true);
		vi.advanceTimersByTime(1);
		expect(t.locked).toBe(false);
	});

	it('under reduced motion starts nothing and locks nothing', () => {
		const t = new ModeTween();
		t.update(syllables, true);
		expect(t.update(corrections, true)).toBeNull();
		expect(t.locked).toBe(false);
	});

	it('a repeat of the same state starts nothing', () => {
		const t = new ModeTween();
		t.update(corrections, false);
		expect(t.update(corrections, false)).toBeNull();
		expect(t.locked).toBe(false);
	});

	it('dispose frees the lock and stops the timer', () => {
		const t = new ModeTween();
		t.update(syllables, false);
		t.update(corrections, false);
		t.dispose();
		expect(t.locked).toBe(false);
		expect(vi.getTimerCount()).toBe(0);
	});
});

describe('the perimeter', () => {
	const el = (height: number, animate?: ReturnType<typeof vi.fn>) =>
		({ offsetHeight: height, animate }) as unknown as HTMLElement;

	it('animates the height from before to after, over the direction\'s duration', () => {
		const animate = vi.fn();
		animatePanel(el(120, animate), 40, 'in');
		expect(animate).toHaveBeenCalledWith([{ height: '40px' }, { height: '120px' }], { duration: 220, easing: 'ease-out' });
		animatePanel(el(40, animate), 120, 'out');
		expect(animate).toHaveBeenLastCalledWith([{ height: '120px' }, { height: '40px' }], { duration: 150, easing: 'ease-out' });
	});

	it('does nothing where the height did not change, there is no direction, or the browser cannot animate', () => {
		const animate = vi.fn();
		animatePanel(el(80, animate), 80.4, 'in');
		animatePanel(el(120, animate), 40, null);
		expect(animate).not.toHaveBeenCalled();
		expect(() => animatePanel(el(120), 40, 'in')).not.toThrow();
	});
});
