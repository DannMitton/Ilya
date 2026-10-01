/**
 * QUEUE row 2k: the camera glyph answers to the pointer, not to the width
 * (Dann 2026-08-10, E.36, the sixth clause). A stand-in `matchMedia` plays the
 * browser, in both directions.
 */
import { describe, expect, it } from 'vitest';
import { COARSE_POINTER, watchCoarsePointer } from './input-modality';

function fakeMedia(initial: boolean) {
	let matches = initial;
	const listeners = new Set<(e: MediaQueryListEvent) => void>();
	const asked: string[] = [];
	const matchMedia = (query: string) => {
		asked.push(query);
		return {
			get matches() {
				return matches;
			},
			addEventListener: (_: string, l: (e: MediaQueryListEvent) => void) => listeners.add(l),
			removeEventListener: (_: string, l: (e: MediaQueryListEvent) => void) => listeners.delete(l),
		} as unknown as MediaQueryList;
	};
	const flip = (next: boolean) => {
		matches = next;
		for (const l of listeners) l({ matches: next } as MediaQueryListEvent);
	};
	return { matchMedia, flip, asked, listeners };
}

describe('the coarse pointer', () => {
	it('asks the pointer, never the width', () => {
		const m = fakeMedia(false);
		watchCoarsePointer(() => {}, m.matchMedia);
		expect(m.asked).toEqual([COARSE_POINTER]);
		expect(COARSE_POINTER).toBe('(pointer: coarse)');
	});

	it('reads coarse on a touch screen, and follows it to fine and back', () => {
		const m = fakeMedia(true);
		const seen: boolean[] = [];
		watchCoarsePointer((c) => seen.push(c), m.matchMedia);
		m.flip(false);
		m.flip(true);
		expect(seen).toEqual([true, false, true]);
	});

	it('reads fine with a mouse, and follows it to coarse', () => {
		const m = fakeMedia(false);
		const seen: boolean[] = [];
		watchCoarsePointer((c) => seen.push(c), m.matchMedia);
		m.flip(true);
		expect(seen).toEqual([false, true]);
	});

	it('stops listening when told to', () => {
		const m = fakeMedia(false);
		const stop = watchCoarsePointer(() => {}, m.matchMedia);
		stop();
		expect(m.listeners.size).toBe(0);
	});

	it('reads fine where there is no matchMedia', () => {
		const seen: boolean[] = [];
		watchCoarsePointer((c) => seen.push(c), undefined);
		expect(seen).toEqual([false]);
	});
});
