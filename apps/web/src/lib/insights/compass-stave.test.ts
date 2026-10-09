/**
 * The compass stave (QUEUE row 60, ruling 1 of "THE INSIGHTS PAGE, REARRANGED"):
 * a small stave in the page's corner, at a normal notation size, with the clef,
 * the compass's two notes, and "Compass {low} to {high}" under it. Text is
 * measured by a stand-in (5 px a character at 10 px), so these run without a canvas.
 */
import { describe, expect, it } from 'vitest';
import type { Pitch } from '@ilya/score-parser';
import { COMPASS_LINE_GAP, layoutCompassStave } from './compass-stave';
import type { Measure } from './tessituragram-layout';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const measure: Measure = (text, size) => text.length * size * 0.5;
const glyph = (name: string) => {
	if (name === 'fClef') return { widthSp: 2.7, top: 1.1, bottom: -3.2 };
	if (name === 'gClef') return { widthSp: 2.7, top: 4.4, bottom: -2.6 };
	if (name === 'noteheadBlack') return { widthSp: 1.18, top: 0.5, bottom: -0.5 };
	return { widthSp: 1.1, top: 1.4, bottom: -1.4 };
};
const draw = (low: Pitch, high: Pitch, clef: 'bass' | 'treble' = 'bass', lang: 'en' | 'fr' = 'en') =>
	layoutCompassStave({ low, high }, clef, lang, measure, glyph);

describe('the compass stave', () => {
	it('is a stave at the score’s own size: lines COMPASS_LINE_GAP apart, far under the figure’s 22 px', () => {
		const l = draw(P('C', 3, 1), P('D', 4));
		expect(COMPASS_LINE_GAP).toBe(8);
		expect(l.staveYs).toHaveLength(5);
		expect(l.staveYs[0] - l.staveYs[1]).toBe(8);
		expect(l.lineGap).toBeLessThan(22);
		// A small thing: it does not take a quarter of the page's content width.
		expect(l.width).toBeLessThan(156);
		expect(l.height).toBeLessThan(110);
	});

	it('draws the clef and the two notes, the low one before the high one', () => {
		const l = draw(P('C', 3, 1), P('D', 4));
		expect(l.clef).not.toBeNull();
		expect(l.notes.map((n) => n.pitch)).toEqual([P('C', 3, 1), P('D', 4)]);
		expect(l.notes[0].x).toBeLessThan(l.notes[1].x);
		// The high note stands higher on the stave (smaller y) than the low one.
		expect(l.notes[1].y).toBeLessThan(l.notes[0].y);
	});

	it('says "Compass {low} to {high}" under the stave, in either language', () => {
		const en = draw(P('C', 3, 1), P('D', 4));
		expect(en.text.text).toBe('Compass C♯3 to D4');
		expect(draw(P('C', 3, 1), P('D', 4), 'bass', 'fr').text.text).toBe('Ambitus C♯3 à D4');
		const lowest = Math.max(...en.staveYs, ...en.notes.map((n) => n.y));
		expect(en.text.y).toBeGreaterThan(lowest);
		// Right-aligned to the stave's right edge.
		expect(en.text.x).toBe(en.width);
		expect(en.staveRight).toBe(en.width);
	});

	it('draws one note for a one-note compass', () => {
		expect(draw(P('G', 3), P('G', 3)).notes).toHaveLength(1);
	});

	it('draws ledger lines for a note beyond the stave, and keeps every note and line inside the box', () => {
		// E4 is four steps over a bass stave's top line (A3): two ledger lines.
		const l = draw(P('B', 2), P('E', 4));
		const high = l.notes[1];
		expect(high.ledgers.length).toBeGreaterThanOrEqual(1);
		for (const y of [...high.ledgers, ...l.notes.map((n) => n.y), ...l.staveYs, l.text.y]) {
			expect(y).toBeGreaterThanOrEqual(-0.5);
			expect(y).toBeLessThanOrEqual(l.height);
		}
	});

	it('makes room for a sharp or a flat before its note, clear of the clef', () => {
		const l = draw(P('F', 4, 1), P('G', 5), 'treble');
		const first = l.notes[0];
		expect(first.accX).not.toBeNull();
		expect(first.accX!).toBeGreaterThan(l.staveLeft + 2 + 2.7 * l.lineGap);
		expect(first.accX!).toBeLessThan(first.x - l.headHalf);
	});

	it('is the same stave wherever it is asked for: it depends on the compass and the clef, not on the song', () => {
		expect(draw(P('C', 3, 1), P('D', 4))).toEqual(draw(P('C', 3, 1), P('D', 4)));
	});

	it('before the music font arrives, still has a width and a height (no clef drawn, none missing from the box)', () => {
		const l = layoutCompassStave({ low: P('C', 3), high: P('D', 4) }, 'bass', 'en', measure, () => null);
		expect(l.clef).toBeNull();
		expect(l.width).toBeGreaterThan(0);
		expect(l.height).toBeGreaterThan(0);
	});
});
