/**
 * Integration step 7e: the two `attach` argument builders (`loupe-print-wiring.ts`), run as the page runs them.
 *
 * They check that the join is lent a state only for a scan whose score carries words and whose kept reading is present, and that
 * the print's scan, bars to check, and `openAt` read the page's state as the page's own inline code did. WHY: the code was a line
 * in `+page.svelte`, untestable; a wrong state lends the join to a song that is not a scan, or opens the Loupe on the wrong bar.
 * WHEN IT FAILS: the page's lend and the class's shape have drifted. It relates to `poem-join-gate.test.ts` (the page still routes
 * its state through `joinDeps`).
 */
import { describe, expect, it, vi } from 'vitest';
import { joinDeps, printDeps, type IngestedLend, type JoinLend, type PrintLend } from './loupe-print-wiring';

const ingested: IngestedLend = {
	result: {
		score: { vocalLine: [{ id: 'a', type: 'note', measureIndex: 0 }, { id: 'b', type: 'note', measureIndex: 1 }] as never, measures: [{ index: 0, number: '1' }, { index: 1, number: '2' }] },
		warnings: [{ code: 'other' }, { code: 'words-partly-read', bars: [[2, 2]] as never }],
	},
};
const doc = { id: 's', inputText: 'a', publishedPoem: 'b', readOnly: false };
const join = (over: Partial<JoinLend> = {}): JoinLend => ({ doc: () => doc, setLyrics: () => {}, ingested: () => ingested, scoreText: () => 'слова', lines: () => [], pairings: () => ({}), ready: () => true, hasScan: () => true, ...over });

describe('joinDeps', () => {
	it('lends a state with the score\'s words, events, the warning\'s bars, and readiness, for a scan', () => {
		const s = joinDeps(join()).state()!;
		expect(s.scanText).toBe('слова');
		expect(s.events).toHaveLength(2);
		expect(s.unreadBars).toEqual([[2, 2]]);
		expect(s.ready).toBe(true);
	});
	it('lends nothing without a score, without words, or without the scan\'s kept reading', () => {
		expect(joinDeps(join({ ingested: () => null })).state()).toBeNull();
		expect(joinDeps(join({ scoreText: () => '' })).state()).toBeNull();
		expect(joinDeps(join({ hasScan: () => false })).state()).toBeNull();
	});
});

describe('printDeps', () => {
	const print = (over: Partial<PrintLend> = {}): PrintLend => ({ songId: () => 's', ingested: () => ingested, stored: () => null, line: () => ingested.result.score.vocalLine as never, markupOn: true, show: () => {}, ...over });
	it('lends the stored scan only where its reading has bands, as a pdf or an image by its name', () => {
		expect(printDeps(print()).scan()).toBeNull();
		const bands = [{ page: 1 }] as never;
		expect(printDeps(print({ stored: () => ({ reading: { bands }, bytes: new ArrayBuffer(1), fileName: 'a.PDF' }) })).scan()).toMatchObject({ systems: bands, kind: 'pdf' });
		expect(printDeps(print({ stored: () => ({ reading: { bands }, bytes: new ArrayBuffer(1), fileName: 'a.png' }) })).scan()?.kind).toBe('image');
		expect(printDeps(print({ stored: () => ({ reading: {}, bytes: new ArrayBuffer(1), fileName: 'a.png' }) })).scan()).toBeNull();
	});
	it('lists the banner\'s bars as song bars', () => {
		expect(printDeps(print()).toCheck()).toEqual([2]);
		expect(printDeps(print({ ingested: () => null })).toCheck()).toEqual([]);
	});
	it('opens the Loupe on the first note of the bar, and not with the wall down or on a bar with no note', () => {
		const show = vi.fn();
		printDeps(print({ show })).openAt(2);
		expect(show).toHaveBeenCalledWith('b');
		printDeps(print({ show, markupOn: false })).openAt(2);
		printDeps(print({ show })).openAt(9);
		expect(show).toHaveBeenCalledTimes(1);
	});
});
