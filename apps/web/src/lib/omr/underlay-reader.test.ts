/**
 * makeUnderlayReader with fakes: the Worker's half, the reader, and the
 * dictionary. Every failure answers null with one console line; nothing
 * rejects.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeUnderlayReader, type UnderlayParts } from './underlay-reader';
import type { PageLayout, Seams, WordBox } from './underlay-page';

const layout: PageLayout = {
	width: 1200,
	height: 1100,
	unfound: 0,
	systems: [{ staffSpace: 30, hasBand: true, notes: [{ id: 0, x: 100, bar: 1 }, { id: 1, x: 300, bar: 1 }], rows: [{ id: 0, transform: { scale: 1, pad: 16, angle: 0, width: 1200, height: 42 }, offsetX: 0, offsetY: 265 }] }],
};
const seams: Seams = { isWord: (w) => ['мир', 'ты'].includes(w), cut: (w) => [w] };
const word = (text: string, x0: number, x1: number): WordBox => ({ text, x0: x0 + 16, x1: x1 + 16, y0: 16, y1: 48 });

function parts(over: Partial<UnderlayParts<string>> = {}): UnderlayParts<string> & { asked: string[] } {
	const asked: string[] = [];
	return {
		asked,
		prepare: async () => ({ layout, rows: ['row 0'], ms: 1500 }),
		recognize: async (row) => (asked.push(row), [word('мир', 90, 110), word('ты', 290, 310)]),
		seams: async () => seams,
		now: (() => {
			let t = 0;
			return () => (t += 100);
		})(),
		...over,
	};
}

const image = new Blob(['png']);
afterEach(() => vi.restoreAllMocks());

describe('makeUnderlayReader', () => {
	it('prepares the page, reads each row, and seats the words', async () => {
		const p = parts();
		const log = vi.spyOn(console, 'info').mockImplementation(() => {});
		const page = await makeUnderlayReader(p)(image, '<xml/>', []);
		expect(p.asked).toEqual(['row 0']);
		expect(page).toMatchObject({ passes: true, ms: { prepare: 1500, read: 100, seat: 100 } });
		expect(page!.words.map((w) => w.syllables.map((s) => [s.text, s.note]))).toEqual([[['мир', 0]], [['ты', 1]]]);
		expect(log).toHaveBeenCalledTimes(1);
		expect(String(log.mock.calls[0][0])).toContain('page read in 1.7 s (worker 1500 ms, reader 100 ms, seating 100 ms): 1 rows in 1 systems, 2 syllables seated, 0 unseated');
	});

	it('says in the line that a page does not pass, and why', async () => {
		const log = vi.spyOn(console, 'info').mockImplementation(() => {});
		await makeUnderlayReader(parts({ recognize: async () => [word('qq', 90, 110)] }))(image, '<xml/>', []);
		expect(String(log.mock.calls[0][0])).toContain('does not pass (system 1 has no Russian row)');
	});

	it.each([
		['the Worker throws', { prepare: async () => { throw new Error('no 2d context'); } }, 'the Worker failed: no 2d context'],
		['the model does not load', { recognize: async () => { throw new Error('Failed to fetch /omr/models/underlay/rus_prereform_r2_29000.traineddata'); } }, 'the reader failed: Failed to fetch /omr/models/underlay/rus_prereform_r2_29000.traineddata'],
		['the dictionary does not load', { seams: async () => { throw new Error('the dictionary did not load'); } }, 'the dictionary failed: the dictionary did not load'],
		['the seating throws', { seams: async () => ({ isWord: () => { throw new Error('boom'); }, cut: (w: string) => [w] }) }, 'the seating failed: boom'],
	] as const)('answers null with one console line where %s', async (_name, over, why) => {
		const log = vi.spyOn(console, 'info').mockImplementation(() => {});
		const page = await makeUnderlayReader(parts(over as Partial<UnderlayParts<string>>))(image, '<xml/>', []);
		expect(page).toBeNull();
		expect(log).toHaveBeenCalledTimes(1);
		expect(String(log.mock.calls[0][0])).toBe(`[omr] underlay: the page was not read (${why})`);
	});

	it('stops reading rows at the first that fails', async () => {
		vi.spyOn(console, 'info').mockImplementation(() => {});
		const p = parts({ prepare: async () => ({ layout, rows: ['a', 'b', 'c'], ms: 0 }) });
		let n = 0;
		p.recognize = async (row) => {
			p.asked.push(row);
			if (++n === 2) throw new Error('worker_lost');
			return [];
		};
		expect(await makeUnderlayReader(p)(image, '<xml/>', [])).toBeNull();
		expect(p.asked).toEqual(['a', 'b']);
	});

	it('does not ask for the dictionary until the rows are read', async () => {
		vi.spyOn(console, 'info').mockImplementation(() => {});
		const order: string[] = [];
		await makeUnderlayReader(parts({ recognize: async () => (order.push('read'), []), seams: async () => (order.push('seams'), seams) }))(image, '<xml/>', []);
		expect(order).toEqual(['read', 'seams']);
	});

	it('hands the staff boxes and the MusicXML to the Worker\'s half as they came', async () => {
		vi.spyOn(console, 'info').mockImplementation(() => {});
		const seen: unknown[] = [];
		await makeUnderlayReader(parts({ prepare: async (i, x, s) => (seen.push(i, x, s), { layout, rows: [], ms: 0 }) }))(image, '<music/>', [{ cx: 0.5, cy: 0.1, w: 0.8, h: 0.05, index: 3 }]);
		expect(seen).toEqual([image, '<music/>', [{ cx: 0.5, cy: 0.1, w: 0.8, h: 0.05, index: 3 }]]);
	});
});
