/** The wait's timing: nothing before one second, hold then fade on success, gone at once on failure. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReadingWait } from './reading-wait.svelte';
import type { OmrProgress } from '$lib/omr/homr-reader';

const prog = (page: number, done = 0) => ({ page, pages: 3, stage: 'staff', done, total: 4 }) as OmrProgress;

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('ReadingWait', () => {
	it('shows nothing for a read that ends in 0.4 s', () => {
		const w = new ReadingWait();
		w.begin();
		vi.advanceTimersByTime(400);
		w.progress(prog(1));
		w.complete();
		vi.advanceTimersByTime(5000);
		expect(w.visible).toBe(false);
		expect(w.active).toBe(false);
	});

	it('shows one second after it began, with the staff empty', () => {
		const w = new ReadingWait();
		w.begin();
		vi.advanceTimersByTime(999);
		expect(w.visible).toBe(false);
		vi.advanceTimersByTime(1);
		expect(w.visible).toBe(true);
		expect(w.state.fill).toBe(0);
	});

	it('on success completes, holds 600 ms, fades 300 ms, and goes', () => {
		const w = new ReadingWait();
		w.begin();
		vi.advanceTimersByTime(1000);
		w.progress(prog(2, 2));
		w.complete();
		expect(w.state.fill).toBe(1);
		vi.advanceTimersByTime(599);
		expect(w.leaving).toBe(false);
		vi.advanceTimersByTime(1);
		expect(w.leaving).toBe(true);
		expect(w.visible).toBe(true);
		vi.advanceTimersByTime(300);
		expect(w.visible).toBe(false);
		expect(w.active).toBe(false);
	});

	it('goes at once on a failure or the poem route', () => {
		const w = new ReadingWait();
		w.begin();
		vi.advanceTimersByTime(1500);
		w.cancel();
		expect(w.visible).toBe(false);
		expect(w.leaving).toBe(false);
	});

	it('holds the fill when the second pass restarts, and answers in either language mid-wait', () => {
		const w = new ReadingWait();
		w.begin();
		w.progress(prog(3, 4));
		w.progress(prog(1, 1));
		expect(w.state.fill).toBe(1);
		expect(w.line('en')).toBe('Reading your score · page 3 of 3');
		expect(w.line('fr')).toBe('Lecture de votre partition · page 3 sur 3');
	});

	it('is deaf to progress when no read is going', () => {
		const w = new ReadingWait();
		w.progress(prog(2));
		expect(w.state.page).toBe(0);
	});
});
