import { describe, expect, it } from 'vitest';
import { resetScrollAncestors, type Scrollable } from './scroll-top';

type El = Scrollable & { overflow: string };
const chain = (...specs: Array<[string, number]>): El[] => {
	const els: El[] = specs.map(([overflow, scrollTop]) => ({ overflow, scrollTop, parentElement: null }));
	els.forEach((e, k) => (e.parentElement = els[k + 1] ?? null));
	return els;
};
const run = (els: El[]) => resetScrollAncestors(els[0], (e) => (e as El).overflow);

describe('the capture screen opens at the top', () => {
	it('resets every scrollable ancestor, not only the first', () => {
		const els = chain(['visible', 0], ['auto', 326], ['hidden', 40], ['scroll', 90]);
		run(els);
		expect(els.map((e) => e.scrollTop)).toEqual([0, 0, 40, 0]); // a hidden-overflow ancestor is not a scroller and is left as it was
	});
	it('leaves an ancestor already at the top, and a chain with nothing scrollable, alone', () => {
		const els = chain(['auto', 0], ['visible', 12]);
		run(els);
		expect(els.map((e) => e.scrollTop)).toEqual([0, 12]);
	});
	it('does nothing for no start', () => {
		expect(() => resetScrollAncestors(null)).not.toThrow();
	});
});
