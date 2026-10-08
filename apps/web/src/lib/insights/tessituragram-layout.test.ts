/**
 * The tessituragram's layout (QUEUE row 42). Every expectation is read off the
 * brief and Design's drawing, not off the layout: no label touches a line, a
 * bar, the band, or another label; the bars are the same length in both
 * languages; the key lists only what the figure draws; and the leader, which no
 * real song has needed, draws when its label has nowhere else to go.
 *
 * Text is measured by a stand-in (5 px a character at 10 px, close to Source
 * Sans 3's average), so these run without a canvas. The live render is measured
 * separately, in the browser.
 */
import { describe, expect, it } from 'vitest';
import { writeFileSync } from 'node:fs';
import type { Pitch } from '@ilya/score-parser';
import type { FigureRow, TessituragramModel } from './insights';
import { contacts, firstClear, layoutTessituragram, slotWithLeader, type Box, type Layout, type Measure } from './tessituragram-layout';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const measure: Measure = (text, size) => text.length * size * 0.5;
/** Maestro's boxes in staff spaces, roughly: enough for the clef and heads to take their room. */
const glyph = (name: string) => {
	if (name === 'fClef') return { widthSp: 2.7, top: 1.1, bottom: -3.2 };
	if (name === 'gClef') return { widthSp: 2.7, top: 4.4, bottom: -2.6 };
	if (name === 'noteheadBlack') return { widthSp: 1.18, top: 0.5, bottom: -0.5 };
	return { widthSp: 1.1, top: 1.4, bottom: -1.4 };
};

const SHARP = new Set([49, 51, 54, 56, 58, 61]);
const SPELL: Record<number, Pitch> = {
	47: P('B', 2),
	49: P('C', 3, 1),
	50: P('D', 3),
	51: P('D', 3, 1),
	52: P('E', 3),
	54: P('F', 3, 1),
	55: P('G', 3),
	56: P('G', 3, 1),
	57: P('A', 3),
	58: P('A', 3, 1),
	59: P('B', 3),
	61: P('C', 4, 1),
	62: P('D', 4),
	64: P('E', 4),
};
const row = (midi: number, quavers: number, tags: FigureRow['tags'] = []): FigureRow => ({ midi, spellings: [SPELL[midi]], quavers, tags });

/** Tchaikovsky, Op. 38 No. 3, as Design drew it (drawing 1): the lengths are the drawing's, read off its rects. */
function tchaikovsky(): TessituragramModel {
	const q: Array<[number, number]> = [[47, 22.8], [49, 22.8], [50, 32.3], [51, 3.8], [52, 24.7], [54, 152.1], [55, 45.6], [56, 7.6], [57, 72.2], [58, 11.4], [59, 150.2], [61, 140.7], [62, 64.6], [64, 15.2]];
	return {
		clef: 'bass',
		rows: q.map(([m, n]) => row(m, n)),
		compass: { low: P('B', 2), high: P('E', 4) },
		longest: { midi: 54, quavers: 152.1, share: 0.199, seconds: null },
		scale: 'quavers',
		quiet: false,
		tessitura: { low: P('F', 3, 1), high: P('C', 4, 1) },
		passaggio: { primo: P('A', 3), secondo: P('E', 4, -1) },
		zones: { below: 41, between: 57, above: 2 },
		halfMass: { low: 54, high: 59, share: 0.5 },
		centre: { value: 57.1, midi: 57, pitch: P('A', 3) },
		cycles: null,
	};
}

const base = (rows: FigureRow[], patch: Partial<TessituragramModel> = {}): TessituragramModel => {
	const longest = rows.reduce((a, b) => (b.quavers > a.quavers ? b : a));
	const midis = rows.map((r) => r.midi);
	const lo = rows.find((r) => r.midi === Math.min(...midis))!;
	const hi = rows.find((r) => r.midi === Math.max(...midis))!;
	return {
		clef: 'bass',
		rows,
		compass: { low: lo.spellings[0], high: hi.spellings[0] },
		longest: { midi: longest.midi, quavers: longest.quavers, share: longest.quavers / rows.reduce((a, r) => a + r.quavers, 0), seconds: null },
		scale: 'quavers',
		quiet: false,
		tessitura: null,
		passaggio: null,
		zones: null,
		halfMass: null,
		centre: null,
		cycles: null,
		...patch,
	};
};

const draw = (f: TessituragramModel, lang: 'en' | 'fr' = 'en') => layoutTessituragram(f, lang, measure, glyph);

describe('the tessituragram layout: Design drawing 1', () => {
	it('touches nothing: no label on a line, a bar, the band, or another label, in either language', () => {
		for (const lang of ['en', 'fr'] as const) expect(contacts(draw(tchaikovsky(), lang))).toEqual([]);
	});

	it('draws the bars the same length in English and in French', () => {
		const en = draw(tchaikovsky(), 'en');
		const fr = draw(tchaikovsky(), 'fr');
		expect(fr.barMax).toBe(en.barMax);
		expect(fr.barMax).toBe(Math.min(en.barMaxByLanguage.en, en.barMaxByLanguage.fr));
	});

	it('keeps the band behind the bars only: it starts at the bars and stops 4 px past the longest', () => {
		const l = draw(tchaikovsky());
		expect(l.band!.x).toBe(l.barX - 4);
		expect(l.band!.x + l.band!.width).toBeCloseTo(l.barX + l.barMax + 4, 6);
		// The two bracket serifs sit left of the barline's name columns: beside the barline, not under the names.
		expect(l.tessBracket[0].x1).toBe(l.barline + 6);
		expect(l.tessBracket[1].x1).toBe(l.barline + 10);
	});

	it('sets every name at 10 px, weight 500, in rose ink: every name is a sung pitch', () => {
		const l = draw(tchaikovsky());
		for (const x of l.texts.filter((t) => t.kind === 'sungName')) expect([x.size, x.weight, x.fill]).toEqual([10, 500, 'var(--rose-ink)']);
		expect(l.texts.every((t) => t.size === 10)).toBe(true);
	});

	const names = (l: Layout, side: 'left' | 'right') => {
		const xs = [...new Set(l.texts.filter((x) => x.kind === 'sungName').map((x) => x.x))].sort((p, q) => p - q);
		return l.texts.filter((x) => x.kind === 'sungName' && x.x === (side === 'left' ? xs[0] : xs[1])).map((x) => x.text);
	};

	it('names every sung natural on the left, on a line or a space, and every sung sharp on the right (QUEUE row 43)', () => {
		const l = draw(tchaikovsky());
		expect(names(l, 'left')).toEqual(['B2', 'D3', 'E3', 'G3', 'A3', 'B3', 'D4', 'E4']);
		expect(names(l, 'right')).toEqual(['C♯3', 'D♯3', 'F♯3', 'G♯3', 'A♯3', 'C♯4']);
	});

	it('names a natural on a space (E3, B3, D4) and no line the song does not sing (F3, C4)', () => {
		const all = draw(tchaikovsky()).texts.map((x) => x.text);
		for (const n of ['E3', 'B3', 'D4']) expect(all).toContain(n);
		for (const n of ['F3', 'C4', 'G2']) expect(all).not.toContain(n);
		// Faint lines stay as they were: the stave lines and the ledger lines under the bars.
		expect(draw(tchaikovsky()).faint.length).toBeGreaterThan(0);
	});

	it('names each row once, with the spelling with more sung time, then the less altered on a tie', () => {
		const rowOf = (q: number[]): FigureRow => ({ midi: 58, quavers: 6, tags: [], spellings: [P('A', 3, 1), P('B', 3, -1)], spellingQuavers: q });
		const nameFor = (q: number[]) => draw(base([rowOf(q)])).texts.find((x) => x.kind === 'sungName')!.text;
		expect(nameFor([2, 4])).toBe('B♭3');
		expect(nameFor([4, 2])).toBe('A♯3');
		// Both alter by one: a tie goes to the first listed (lower letter).
		expect(nameFor([3, 3])).toBe('A♯3');
		// A natural against a sharp on a tie: the natural.
		const mixed: FigureRow = { midi: 59, quavers: 4, tags: [], spellings: [P('A', 3, 2), P('B', 3)], spellingQuavers: [2, 2] };
		expect(draw(base([mixed])).texts.find((x) => x.kind === 'sungName')!.text).toBe('B3');
	});

	it('steps 11 px, draws bars 6 and 4.5, and keeps the passaggi lines in rose ink', () => {
		const l = draw(tchaikovsky());
		expect(l.staveYs[0] - l.staveYs[1]).toBe(22);
		expect(new Set(l.rows.map((r) => r.height))).toEqual(new Set([6, 4.5]));
		expect(l.passLines.every((s) => s.stroke === 'var(--rose-ink)')).toBe(true);
	});

	it('takes "centre A3" its second place, just above the tick, because the primo line crosses the level one', () => {
		const l = draw(tchaikovsky());
		const centre = l.texts.find((t) => t.kind === 'centre')!;
		const tick = l.halfBracket[3].y1;
		expect(centre.y).toBeCloseTo(tick - 2.5, 6);
		expect(l.leaders).toEqual([]);
	});

	it('puts "half the singing" above the bracket, left of the serifs', () => {
		const l = draw(tchaikovsky());
		const half = l.texts.filter((t) => t.kind === 'half');
		expect(half).toHaveLength(1);
		expect(half[0].y).toBeCloseTo(l.halfBracket[1].y1 - 4, 6);
		expect(half[0].x).toBe(l.halfBracket[1].x1);
	});

	it('breaks "la moitié du temps chanté" after "du" when one line will not fit', () => {
		// A wide right-hand column leaves the one-line French no room above the bracket.
		const wide: Measure = (text, size) => text.length * size * 0.62;
		const l = layoutTessituragram(tchaikovsky(), 'fr', wide, glyph);
		const half = l.texts.filter((t) => t.kind === 'half').map((t) => t.text);
		expect(half.join(' ')).toBe('la moitié du temps chanté');
		expect(contacts(l)).toEqual([]);
	});
});

describe('the key under the figure', () => {
	const keyOf = (l: Layout) => l.texts.filter((t) => t.kind === 'key').map((t) => t.text);

	it('lists the tessitura, the passaggi, and the ledger lines this figure draws, left-aligned with the bars', () => {
		const l = draw(tchaikovsky());
		expect(keyOf(l)).toEqual(['tessitura', 'your passaggi', 'ledger line']);
		expect(l.keyMarks.map((m) => m.kind)).toEqual(['tessitura', 'passaggi', 'ledger']);
		expect(l.keyMarks[0].x).toBe(l.barX);
		expect(keyOf(draw(tchaikovsky(), 'fr'))).toEqual(['tessiture', 'vos *passaggi*', 'ligne supplémentaire']);
	});

	it('omits the tessitura entry with no tessitura, the dashed entry with no passaggi, the dotted entry with no ledger line', () => {
		const f = tchaikovsky();
		expect(keyOf(draw({ ...f, tessitura: null }))).toEqual(['your passaggi', 'ledger line']);
		expect(keyOf(draw({ ...f, passaggio: null, zones: null }))).toEqual(['tessitura', 'ledger line']);
		// Every sung pitch on the stave: no ledger line under the bars.
		const onStave = base([row(50, 10), row(52, 20), row(55, 5)], { tessitura: { low: P('D', 3), high: P('G', 3) } });
		expect(keyOf(draw(onStave))).toEqual(['tessitura']);
		expect(keyOf(draw(base([row(50, 10), row(52, 20)])))).toEqual([]);
	});
});

describe('the extremes', () => {
	it('one pitch', () => {
		const l = draw(base([row(54, 10)]));
		expect(contacts(l)).toEqual([]);
		expect(l.notes).toHaveLength(1);
		expect(l.rows[0].length).toBeCloseTo(l.barMax, 6);
	});

	it('two pitches a semitone apart: both bars thin, both labels clear', () => {
		const l = draw(base([row(54, 10), row(55, 6)]));
		expect(contacts(l)).toEqual([]);
		expect(l.rows.map((r) => r.height)).toEqual([4.5, 4.5]);
	});

	it('two octaves, a stated tempo (seconds), passaggi, no tessitura, and a bar with two findings', () => {
		const rows: FigureRow[] = [
			{ midi: 41, spellings: [P('F', 2)], quavers: 10, tags: [] },
			{ midi: 45, spellings: [P('A', 2)], quavers: 30, tags: [] },
			{ midi: 52, spellings: [P('E', 3)], quavers: 60, tags: [] },
			{ midi: 57, spellings: [P('A', 3)], quavers: 20, tags: [] },
			{ midi: 63, spellings: [P('E', 4, -1)], quavers: 8, tags: [] },
			{ midi: 65, spellings: [P('F', 4)], quavers: 12, tags: [{ measure: '14', vowel: 'i' }, { measure: '22', vowel: 'u' }] },
		];
		const f = base(rows, {
			scale: 'seconds',
			longest: { midi: 52, quavers: 60, share: 0.4, seconds: { kind: 'point', seconds: 38 } },
			passaggio: { primo: P('A', 3), secondo: P('E', 4, -1) },
			zones: { below: 63, between: 34, above: 3 },
			halfMass: { low: 45, high: 57, share: 0.5 },
			centre: { value: 52, midi: 52, pitch: P('E', 3) },
		});
		for (const lang of ['en', 'fr'] as const) {
			const l = draw(f, lang);
			expect(contacts(l)).toEqual([]);
			expect(l.band).toBeNull();
			expect(l.texts.filter((t) => t.kind === 'barLabel' && t.y > 0).length).toBe(3);
			expect(l.texts.filter((t) => t.kind === 'barLabel').map((t) => t.weight)).toContain(600);
			// The two findings are stacked 12.5 px apart.
			const two = l.texts.filter((t) => t.kind === 'barLabel' && t.text.includes('['));
			expect(Math.abs(two[0].y - two[1].y)).toBe(12.5);
			expect(l.texts.find((t) => t.text === '38 s')).toBeTruthy();
		}
	});

	it('a bar with a finding stays dark; the rest draw in the chip tone (checked in the component)', () => {
		const f = tchaikovsky();
		f.rows = f.rows.map((r) => (r.midi === 61 ? { ...r, tags: [{ measure: '9', vowel: 'a' }] } : r));
		const l = draw(f);
		expect(l.rows.filter((r) => r.dark).map((r) => r.midi)).toEqual([61]);
		expect(contacts(l)).toEqual([]);
	});

	it('no passaggi: no right-hand column, so the bars may run longer than with them', () => {
		const withP = draw(tchaikovsky());
		const without = draw({ ...tchaikovsky(), passaggio: null, zones: null });
		expect(contacts(without)).toEqual([]);
		expect(without.barMax).toBeGreaterThan(withP.barMax);
	});

	it('a treble clef, with a sharp compass note, makes room for its accidental', () => {
		const rows: FigureRow[] = [
			{ midi: 66, spellings: [P('F', 4, 1)], quavers: 10, tags: [] },
			{ midi: 79, spellings: [P('G', 5)], quavers: 20, tags: [] },
		];
		const f = base(rows, { clef: 'treble', compass: { low: P('F', 4, 1), high: P('G', 5) } });
		const l = draw(f);
		expect(contacts(l)).toEqual([]);
		// The accidental's left edge clears the clef's right edge.
		expect(l.notes[0].accX!).toBeGreaterThan(4 + 2.7 * l.lineGap);
	});
});

describe('the leader', () => {
	const wall = (x0: number, y0: number, x1: number, y1: number): Box => ({ x0, y0, x1, y1 });
	const hitsBox = (a: Box, b: Box) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

	it('takes the first clear place when there is one', () => {
		const a = { box: wall(0, 0, 10, 10) };
		const b = { box: wall(20, 0, 30, 10) };
		expect(firstClear([a, b], [wall(0, 0, 12, 12)])).toBe(b);
		expect(firstClear([a, b], [wall(0, 0, 40, 12)])).toBeNull();
	});

	it('draws a short diagonal to a free slot when every near place is taken, and the leader crosses nothing', () => {
		// A wall of obstacles hems the anchor in on its right, leaving a gap well above and below.
		const anchor = { x: 100, y: 100 };
		const obstacles = [wall(104, 88, 300, 112)];
		const slot = slotWithLeader(anchor, 50, 10, obstacles)!;
		expect(slot).not.toBeNull();
		expect(slot.leader.x1).toBe(anchor.x);
		expect(slot.leader.y1).toBe(anchor.y);
		// Diagonal, not parallel to the anchor's bracket: it moves sideways and up or down.
		expect(slot.leader.x2).toBeGreaterThan(slot.leader.x1);
		expect(Math.abs(slot.leader.y2 - slot.leader.y1)).toBeGreaterThanOrEqual(8);
		// The label is clear of every obstacle, and ends short of the leader's tip.
		expect(slot.box.x0 > obstacles[0].x1 || slot.box.y0 > obstacles[0].y1 || slot.box.y1 < obstacles[0].y0).toBe(true);
		expect(slot.leader.x2).toBeLessThan(slot.box.x0);
	});

	/** The forced case: a realistic song, with a wall standing where "centre" and "half the singing" would sit. */
	function forced() {
		const f = tchaikovsky();
		const open = draw(f);
		const spine = open.halfBracket[0].x1;
		const top = open.halfBracket[0].y1;
		const bottom = open.halfBracket[0].y2;
		// The wall covers every place the labels try, beside and above and below the bracket.
		const wall: Box = { x0: spine - 6, x1: spine + 120, y0: top - 30, y1: bottom + 24 };
		return { f, wall, spine, top };
	}

	it('is used by the layout when "centre" and "half the singing" have no near place: a 0.6 px hairline, solid, rose ink, and the figure still touches nothing', () => {
		const { f, wall } = forced();
		for (const lang of ['en', 'fr'] as const) {
			const l = layoutTessituragram(f, lang, measure, glyph, { extraObstacles: [wall] });
			expect(l.texts.find((t) => t.kind === 'centre')).toBeTruthy();
			expect(l.texts.some((t) => t.kind === 'half')).toBe(true);
			expect(l.leaders.length).toBe(2);
			for (const s of l.leaders) {
				expect([s.width, s.stroke, s.dash]).toEqual([0.6, 'var(--rose-ink)', undefined]);
				// A diagonal, not a second bracket: it moves sideways and up or down.
				expect(s.x2).toBeGreaterThan(s.x1);
				expect(s.y2).not.toBe(s.y1);
			}
			// The labels the leaders serve stand outside the wall.
			for (const t of l.texts.filter((t) => t.kind === 'centre' || t.kind === 'half')) expect(hitsBox(t.box, wall)).toBe(false);
			expect(l.unplaced).toEqual([]);
			expect(contacts(l)).toEqual([]);
		}
	});

	it('is not used when a near place is clear', () => {
		const { f } = forced();
		expect(draw(f).leaders).toEqual([]);
	});

	it('dumps the forced leader for the screenshot when asked', () => {
		const path = process.env.TESSITURAGRAM_DUMP;
		if (!path) return;
		const { f, wall } = forced();
		const quiet = layoutTessituragram(f, 'en', measure, glyph, { extraObstacles: [wall] });
		writeFileSync(path, JSON.stringify({ en: quiet, fr: layoutTessituragram(f, 'fr', measure, glyph, { extraObstacles: [wall] }), tchai: draw(tchaikovsky()) }));
	});
});
