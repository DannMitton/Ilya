/**
 * Row 181 step 2: the geometry of the second looks (`underlay-looks.ts`) and the choice between them (`underlay-choose.ts`).
 */
import { describe, expect, it } from 'vitest';
import { INK_PERCENTILE, LOOKS, MIN_CONTRAST, SHIFT, WIDEN, lookWindow, stretchBand } from './underlay-looks';
import { chooseLook, scoreLook, type LookRead } from './underlay-choose';
import type { RowLayout, Seams, WordBox } from './underlay-page';

describe('LOOKS', () => {
	it('is four looks, each once, and the limit of the second look', () => {
		expect([...LOOKS]).toEqual(['down', 'up', 'wide', 'stretch']);
	});
});

describe('lookWindow', () => {
	it('shifts the cut by half a staff space down and up, in staff spaces and not pixels', () => {
		expect(lookWindow(265, 455, 30, 1100, 'down')).toEqual([265 + SHIFT * 30, 455 + SHIFT * 30]);
		expect(lookWindow(265, 455, 30, 1100, 'up')).toEqual([265 - SHIFT * 30, 455 - SHIFT * 30]);
		// A different staff space gives a different shift: nothing is a fixed pixel count.
		expect(lookWindow(265, 455, 60, 1100, 'down')).toEqual([265 + SHIFT * 60, 455 + SHIFT * 60]);
	});

	it('widens the band by a staff space each way, and leaves it alone for the stretch', () => {
		expect(lookWindow(265, 455, 30, 1100, 'wide')).toEqual([265 - WIDEN * 30, 455 + WIDEN * 30]);
		expect(lookWindow(265, 455, 30, 1100, 'stretch')).toEqual([265, 455]);
	});

	it('stays on the page, and gives null where no row is left', () => {
		expect(lookWindow(10, 100, 30, 1100, 'up')).toEqual([0, 85]);
		expect(lookWindow(1000, 1090, 30, 1100, 'wide')).toEqual([970, 1100]);
		expect(lookWindow(1100, 1100, 30, 1100, 'stretch')).toBeNull();
	});
});

describe('stretchBand', () => {
	const band = (ink: number, paper: number) => {
		const data = new Uint8Array(1000).fill(paper);
		for (let i = 0; i < 100; i++) data[i * 10] = ink;
		return { width: 100, height: 10, data };
	};

	it('sends the band\'s own ink tone to black and its own paper tone to white, and says its paper is white', () => {
		const out = stretchBand(band(215, 255));
		expect(out.paper).toBe(255);
		expect(Math.min(...out.data)).toBe(0);
		expect(Math.max(...out.data)).toBe(255);
	});

	it('leaves a band whose ink and paper are closer than MIN_CONTRAST as it was', () => {
		const flat = band(255 - (MIN_CONTRAST - 1), 255);
		expect(stretchBand(flat)).toBe(flat);
	});

	it('names its ink share', () => {
		expect(INK_PERCENTILE).toBeGreaterThan(0);
	});
});

const seams: Seams = { isWord: (w) => ['мир', 'ты', 'бала'].includes(w.toLowerCase()), cut: (w) => [w] };
const row = (id: number): RowLayout => ({ id, transform: { scale: 1, pad: 16, angle: 0, width: 1200, height: 42 }, offsetX: 0, offsetY: 265 });
const w = (text: string, x0: number, x1: number): WordBox => ({ text, x0: x0 + 16, x1: x1 + 16, y0: 16, y1: 48 });
const look = (name: LookRead['look'], ...rows: WordBox[][]): LookRead => ({ look: name, layoutRows: rows.map((_, i) => row(i)), reads: rows });

describe('chooseLook', () => {
	it('keeps the look whose first Russian row holds the most dictionary words', () => {
		const got = chooseLook([look('down', [w('мир', 0, 40), w('qq', 80, 120)]), look('up', [w('мир', 0, 40), w('ты', 80, 120), w('бала', 160, 200)]), look('wide', [w('мир', 0, 40), w('ты', 80, 120)])], seams);
		expect(got).toBe(1);
	});

	it('keeps none where no look passes rowLanguage, and the system stays unread', () => {
		expect(chooseLook([look('down', [w('Wohl', 0, 40), w('dem', 80, 120)]), look('up')], seams)).toBeNull();
		expect(chooseLook([], seams)).toBeNull();
	});

	it('takes the earlier look on a tie', () => {
		expect(chooseLook([look('down', [w('мир', 0, 40), w('ты', 80, 120)]), look('up', [w('мир', 0, 40), w('ты', 80, 120)])], seams)).toBe(0);
	});

	it('scores a look by its first Russian row, the row seatPage would seat, not by a later one', () => {
		const first = look('wide', [w('мир', 0, 40), w('qq', 80, 120)], [w('мир', 0, 40), w('ты', 80, 120), w('бала', 160, 200)]);
		expect(scoreLook(first, seams)).toEqual({ russian: true, known: 1 });
	});
});
