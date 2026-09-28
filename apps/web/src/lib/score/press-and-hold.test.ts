/**
 * The press-and-hold repeat, moved out of `+page.svelte` by the audit's
 * phase 4, slice 2 (2026-09-27). These pin the behaviour the page had at
 * `eab54f9`: no repeat before 400 ms, one every 110 ms after, and a stop on
 * any of the three ending events, on `stopHold`, or on a fresh press.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPressAndHold, HOLD_DELAY, HOLD_EVERY } from './press-and-hold';

/** A stand-in for the button: an event target that can be disabled. */
function button(disabled = false) {
	const target = Object.assign(new EventTarget(), { disabled });
	const press = { currentTarget: target } as unknown as PointerEvent;
	return { target, press };
}

describe('createPressAndHold', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('keeps the ruled timings: 400 ms before the first repeat, 110 ms between', () => {
		expect(HOLD_DELAY).toBe(400);
		expect(HOLD_EVERY).toBe(110);
	});

	it('does not fire before the delay: a tap is a tap', () => {
		const { onhold } = createPressAndHold();
		const fire = vi.fn();
		const { target, press } = button();
		onhold(fire)(press);
		vi.advanceTimersByTime(HOLD_DELAY + HOLD_EVERY - 1);
		expect(fire).not.toHaveBeenCalled();
		target.dispatchEvent(new Event('pointerup'));
		vi.advanceTimersByTime(10_000);
		expect(fire).not.toHaveBeenCalled();
	});

	it('repeats every 110 ms once the delay has passed', () => {
		const { onhold } = createPressAndHold();
		const fire = vi.fn();
		onhold(fire)(button().press);
		vi.advanceTimersByTime(HOLD_DELAY + HOLD_EVERY);
		expect(fire).toHaveBeenCalledTimes(1);
		vi.advanceTimersByTime(HOLD_EVERY * 4);
		expect(fire).toHaveBeenCalledTimes(5);
	});

	for (const type of ['pointerup', 'pointercancel', 'pointerleave']) {
		it(`stops on ${type}, and removes its listeners`, () => {
			const { onhold } = createPressAndHold();
			const fire = vi.fn();
			const { target, press } = button();
			const remove = vi.spyOn(target, 'removeEventListener');
			onhold(fire)(press);
			vi.advanceTimersByTime(HOLD_DELAY + HOLD_EVERY * 2);
			expect(fire).toHaveBeenCalledTimes(2);
			target.dispatchEvent(new Event(type));
			vi.advanceTimersByTime(10_000);
			expect(fire).toHaveBeenCalledTimes(2);
			expect(remove.mock.calls.map(([t]) => t).sort()).toEqual([
				'pointercancel',
				'pointerleave',
				'pointerup',
			]);
		});
	}

	it('stops when stopHold is called, as dismissLoupe does', () => {
		const { onhold, stopHold } = createPressAndHold();
		const fire = vi.fn();
		onhold(fire)(button().press);
		vi.advanceTimersByTime(HOLD_DELAY + HOLD_EVERY);
		stopHold();
		vi.advanceTimersByTime(10_000);
		expect(fire).toHaveBeenCalledTimes(1);
	});

	it('stopHold before the delay cancels the hold outright', () => {
		const { onhold, stopHold } = createPressAndHold();
		const fire = vi.fn();
		onhold(fire)(button().press);
		vi.advanceTimersByTime(HOLD_DELAY - 1);
		stopHold();
		vi.advanceTimersByTime(10_000);
		expect(fire).not.toHaveBeenCalled();
	});

	it('takes no hold on a disabled button', () => {
		const { onhold } = createPressAndHold();
		const fire = vi.fn();
		const { target, press } = button(true);
		const add = vi.spyOn(target, 'addEventListener');
		onhold(fire)(press);
		vi.advanceTimersByTime(10_000);
		expect(fire).not.toHaveBeenCalled();
		expect(add).not.toHaveBeenCalled();
	});

	it('takes no hold with no target', () => {
		const { onhold } = createPressAndHold();
		const fire = vi.fn();
		onhold(fire)({ currentTarget: null } as unknown as PointerEvent);
		vi.advanceTimersByTime(10_000);
		expect(fire).not.toHaveBeenCalled();
	});

	it('a second press ends the first hold: only one repeat runs at a time', () => {
		const { onhold } = createPressAndHold();
		const first = vi.fn();
		const second = vi.fn();
		onhold(first)(button().press);
		vi.advanceTimersByTime(HOLD_DELAY + HOLD_EVERY);
		onhold(second)(button().press);
		vi.advanceTimersByTime(HOLD_DELAY + HOLD_EVERY * 3);
		expect(first).toHaveBeenCalledTimes(1);
		expect(second).toHaveBeenCalledTimes(3);
	});

	it('gives each instance its own timers', () => {
		const a = createPressAndHold();
		const b = createPressAndHold();
		const fire = vi.fn();
		a.onhold(fire)(button().press);
		b.stopHold();
		vi.advanceTimersByTime(HOLD_DELAY + HOLD_EVERY);
		expect(fire).toHaveBeenCalledTimes(1);
	});
});
