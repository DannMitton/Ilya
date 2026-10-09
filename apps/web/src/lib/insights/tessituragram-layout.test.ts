/**
 * The tessituragram's layout. QUEUE row 42 drew it; Dann's walk of 2026-10-09
 * (`OPEN.md`, "THE INSIGHTS PAGE, REARRANGED", QUEUE row 60) rearranged it: the
 * compass left for a stave of its own in the page's corner, the left columns of
 * letter names went, and each bar carries one label, its own pitch. Every
 * expectation is read off the ruling and the drawing, not off the layout: no
 * label touches a line, a bar, the band, or another label, and none sits closer
 * than half a pixel to one (a figure can touch nothing and still crowd); the bars
 * are the same length in both languages; the key lists only what the figure
 * draws; and the leader, which a run of semitone neighbours needs, draws where its
 * label has nowhere to stand beside its bar.
 *
 * Text is measured by a stand-in (5 px a character at 10 px, close to Source
 * Sans 3's average), so these run without a canvas. The live render is measured
 * separately, in the browser (`e2e/insights-page.test.ts`).
 */
import { describe, expect, it } from 'vitest';
import { writeFileSync } from 'node:fs';
import type { Pitch } from '@ilya/score-parser';
import type { FigureRow, TessituragramModel } from './insights';
import { pitchLabel } from '$lib/voice/note-picker';
import {
	contacts,
	firstClear,
	planLabelClusters,
	spreadApart,
	spreadByGaps,
	layoutTessituragram,
	slotWithLeader,
	type Box,
	type Layout,
	type Measure,
} from './tessituragram-layout';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const measure: Measure = (text, size) => text.length * size * 0.5;
/** Maestro's boxes in staff spaces, roughly: enough for the clef to take its room. */
const glyph = (name: string) => {
	if (name === 'fClef') return { widthSp: 2.7, top: 1.1, bottom: -3.2 };
	if (name === 'gClef') return { widthSp: 2.7, top: 4.4, bottom: -2.6 };
	if (name === 'noteheadBlack') return { widthSp: 1.18, top: 0.5, bottom: -0.5 };
	return { widthSp: 1.1, top: 1.4, bottom: -1.4 };
};

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
/** The bar labels, and for each its first line, which begins with the bar's own pitch. */
const barLabels = (l: Layout) => l.texts.filter((t) => t.kind === 'barLabel');
/** Contacts, counting anything within half a pixel as touching: touching nothing is not enough if it crowds. */
const crowded = (l: Layout) => contacts(l, -0.5);

describe('the tessituragram layout: Design drawing 1, rearranged 2026-10-09', () => {
	it('touches nothing and crowds nothing: no label on a line, a bar, the band, or another label, nor within half a pixel, in either language', () => {
		for (const lang of ['en', 'fr'] as const) {
			const l = draw(tchaikovsky(), lang);
			expect(contacts(l)).toEqual([]);
			expect(crowded(l)).toEqual([]);
			expect(l.unplaced).toEqual([]);
		}
	});

	it('draws the bars the same length in English and in French', () => {
		const en = draw(tchaikovsky(), 'en');
		const fr = draw(tchaikovsky(), 'fr');
		expect(fr.barMax).toBe(en.barMax);
		expect(fr.barMax).toBe(Math.min(en.barMaxByLanguage.en, en.barMaxByLanguage.fr));
	});

	it('gives the width the left columns freed to the bars: the longest runs past the 196 px it had before', () => {
		const l = draw(tchaikovsky());
		expect(l.barMax).toBeGreaterThan(196);
		// The bars start just after the clef (and the tessitura bracket and word), not after two columns of names.
		expect(l.barX).toBeLessThan(150);
	});

	it('draws no compass, no barline, and no left column of names: the compass is a stave of its own now', () => {
		const l = draw(tchaikovsky());
		expect('notes' in l).toBe(false);
		expect('barline' in l).toBe(false);
		expect(l.texts.some((t) => t.text.startsWith('Compass'))).toBe(false);
		// Every bar label stands at or past the bars' start: nothing is set left of the bars but the tessitura's own word.
		for (const t of barLabels(l)) expect(t.x).toBeGreaterThanOrEqual(l.barX);
		expect(l.texts.filter((t) => t.x < l.barX).map((t) => t.kind)).toEqual(['tessitura']);
	});

	it('keeps the band behind the bars only: it starts at the bars and stops 4 px past the longest', () => {
		const l = draw(tchaikovsky());
		expect(l.band!.x).toBe(l.barX - 4);
		expect(l.band!.x + l.band!.width).toBeCloseTo(l.barX + l.barMax + 4, 6);
		// The bracket stands between the clef and the bars, with its word beside it.
		expect(l.tessBracket[0].x1).toBeLessThan(l.barX - 4);
		const word = l.texts.find((t) => t.kind === 'tessitura')!;
		expect(word.x).toBeGreaterThan(l.tessBracket[1].x1);
		expect(word.box.x1).toBeLessThan(l.barX - 4);
	});

	it('draws the stave behind the bars as quiet lines from the clef to the band, and a clef, and nothing else on it', () => {
		const l = draw(tchaikovsky());
		expect(l.clef).not.toBeNull();
		const stave = l.faint.filter((s) => s.opacity === 0.25);
		expect(stave.length).toBeGreaterThanOrEqual(5);
		expect(Math.min(...stave.map((s) => s.x1))).toBe(0);
		expect(stave.every((s) => s.dash === undefined)).toBe(true);
		// Five lines, each broken only where a label sits on it.
		const ys = new Set(stave.map((s) => s.y1));
		expect([...ys].sort((a, b) => a - b)).toEqual([...l.staveYs].sort((a, b) => a - b));
	});

	it('sets every label at 10 px, in rose ink, 500 or 600 for a finding', () => {
		const l = draw(tchaikovsky());
		for (const x of barLabels(l)) expect([x.size, x.fill, x.weight]).toEqual([10, 'var(--rose-ink)', 500]);
		expect(l.texts.every((t) => t.size === 10)).toBe(true);
	});

	it('carries ONE label a bar, its own pitch: every sung pitch is named once, and nothing else is', () => {
		const l = draw(tchaikovsky());
		const names = barLabels(l).map((t) => t.text.split(' · ')[0]);
		expect(names).toHaveLength(14);
		expect(new Set(names).size).toBe(14);
		expect([...names].sort()).toEqual(['A3', 'A♯3', 'B2', 'B3', 'C♯3', 'C♯4', 'D3', 'D4', 'D♯3', 'E3', 'E4', 'F♯3', 'G3', 'G♯3'].sort());
		// A line the song does not sing has no name.
		for (const n of ['F3', 'C4', 'G2']) expect(l.texts.map((t) => t.text)).not.toContain(n);
	});

	it('puts the longest bar’s value on its one label, after its pitch', () => {
		const l = draw(tchaikovsky());
		const longest = barLabels(l).find((t) => t.text.startsWith('F♯3'))!;
		expect(longest.text).toBe('F♯3 · 20%');
	});

	it('names each row once, with the spelling with more sung time, then the less altered on a tie', () => {
		const rowOf = (q: number[]): FigureRow => ({ midi: 58, quavers: 6, tags: [], spellings: [P('A', 3, 1), P('B', 3, -1)], spellingQuavers: q });
		const nameFor = (q: number[]) => barLabels(draw(base([rowOf(q)])))[0].text.split(' · ')[0];
		expect(nameFor([2, 4])).toBe('B♭3');
		expect(nameFor([4, 2])).toBe('A♯3');
		// Both alter by one: a tie goes to the first listed (lower letter).
		expect(nameFor([3, 3])).toBe('A♯3');
		// A natural against a sharp on a tie: the natural.
		const mixed: FigureRow = { midi: 59, quavers: 4, tags: [], spellings: [P('A', 3, 2), P('B', 3)], spellingQuavers: [2, 2] };
		expect(barLabels(draw(base([mixed])))[0].text.split(' · ')[0]).toBe('B3');
	});

	it('steps 11 px, draws bars 6 and 4.5, and keeps the passaggi lines in rose ink', () => {
		const l = draw(tchaikovsky());
		expect(l.staveYs[0] - l.staveYs[1]).toBe(22);
		expect(new Set(l.rows.map((r) => r.height))).toEqual(new Set([6, 4.5]));
		expect(l.passLines.every((s) => s.stroke === 'var(--rose-ink)')).toBe(true);
	});

	it('puts "half the singing" above the bracket, left of the serifs, or beside it where the labels leave no room', () => {
		const l = draw(tchaikovsky());
		const half = l.texts.filter((t) => t.kind === 'half');
		expect(half.length).toBeGreaterThan(0);
		const bracket = l.halfBracket[0];
		// The bracket stands past every bar label it spans.
		for (const t of barLabels(l)) if (t.y > bracket.y1 && t.y < bracket.y2) expect(t.box.x1).toBeLessThan(bracket.x1);
		expect(contacts(l)).toEqual([]);
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

describe('where a bar’s label stands', () => {
	const NAMES: Array<[Pitch['step'], number]> = [['C', 0], ['C', 1], ['D', 0], ['D', 1], ['E', 0], ['F', 0], ['F', 1], ['G', 0], ['G', 1], ['A', 0], ['A', 1], ['B', 0]];
	const at = (midi: number): Pitch => {
		const [step, alter] = NAMES[midi % 12];
		return P(step, Math.floor(midi / 12) - 1, alter);
	};
	const rowsOf = (midis: number[], weight = 10): FigureRow[] => midis.map((m, i) => ({ midi: m, spellings: [at(m)], quavers: weight + i * 3, tags: [] }));
	const run = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

	it('is at the bar’s end when no semitone neighbour crowds it, with no leader', () => {
		// D3, E3, G3 are whole steps apart (11 px or more): nothing crowds.
		const l = draw(base(rowsOf([50, 52, 55])));
		expect(l.leaders).toEqual([]);
		for (const r of l.rows) {
			const label = barLabels(l).find((t) => t.text.startsWith(at(r.midi).step))!;
			expect(label.x).toBeCloseTo(l.barX + r.length + 4, 6);
		}
	});

	it('is in one aligned column past the run’s longest bar when semitone neighbours crowd, each joined to its bar by a hairline', () => {
		const rows = rowsOf(run(52, 56));
		const l = draw(base(rows));
		const labels = barLabels(l);
		expect(new Set(labels.map((t) => t.x)).size).toBe(1);
		const longestTip = Math.max(...l.rows.map((r) => l.barX + r.length));
		expect(labels[0].x).toBeGreaterThan(longestTip);
		expect(l.leaders.length).toBeGreaterThanOrEqual(rows.length);
		for (const s of l.leaders) expect([s.width, s.stroke, s.dash]).toEqual([0.6, 'var(--rose-ink)', undefined]);
	});

	it('keeps the labels in pitch order, a label\u2019s height apart, so the hairlines never cross', () => {
		const l = draw(base(rowsOf(run(52, 60))));
		const labels = barLabels(l).sort((a, b) => a.y - b.y);
		// Ascending y runs high to low: the labels read as the stave does, top to bottom.
		const expected = run(52, 60).reverse().map((m) => pitchLabel(at(m)));
		expect(labels.map((t) => t.text.split(' · ')[0])).toEqual(expected);
		for (let i = 1; i < labels.length; i++) expect(labels[i].y - labels[i - 1].y).toBeGreaterThanOrEqual(9.9);
		// The last stretch of each hairline ends at its label: ordered by where it starts, they end in the same order.
		const column = labels[0].x - 3;
		const fans = l.leaders.filter((s) => Math.abs(s.x2 - column) < 1e-6).sort((a, b) => a.y1 - b.y1);
		expect(fans).toHaveLength(labels.length);
		const ends = fans.map((s) => s.y2);
		expect([...ends].sort((a, b) => a - b)).toEqual(ends);
	});

	it('a dense chromatic run, every semitone from E3 to G♯3, touches and crowds nothing, English and French', () => {
		const f = base(rowsOf(run(52, 56)));
		for (const lang of ['en', 'fr'] as const) {
			const l = draw(f, lang);
			expect(contacts(l)).toEqual([]);
			expect(crowded(l)).toEqual([]);
			expect(l.unplaced).toEqual([]);
		}
	});

	it('two pitches a semitone apart: both bars thin, both labels clear, one column', () => {
		const l = draw(base([row(54, 10), row(55, 6)]));
		expect(crowded(l)).toEqual([]);
		expect(l.rows.map((r) => r.height)).toEqual([4.5, 4.5]);
		expect(new Set(barLabels(l).map((t) => t.x)).size).toBe(1);
	});

	it('B♯4 with C♯5 above it, a treble run, touches and crowds nothing', () => {
		const spell: Record<number, Pitch> = { 72: P('B', 4, 1) };
		const rows = rowsOf([61, 62, 64, 65, 66, 69, 70, 72, 73, 74], 8).map((r) => ({ ...r, spellings: [spell[r.midi] ?? r.spellings[0]] }));
		const l = draw(base(rows, { clef: 'treble' }));
		expect(contacts(l)).toEqual([]);
		expect(crowded(l)).toEqual([]);
		const names = barLabels(l).map((x) => x.text.split(' · ')[0]);
		expect(names).toContain('B♯4');
		expect(names).toContain('C♯5');
	});

	it('two octaves of every semitone, with passaggi, the half and the centre, touches and crowds nothing', () => {
		const f = base(rowsOf(run(40, 64), 5), { passaggio: { primo: P('A', 3), secondo: P('E', 4, -1) }, zones: { below: 30, between: 40, above: 30 }, halfMass: { low: 50, high: 58, share: 0.5 }, centre: { value: 54, midi: 54, pitch: P('F', 3, 1) }, tessitura: { low: P('D', 3), high: P('B', 3) } });
		for (const lang of ['en', 'fr'] as const) {
			const l = draw(f, lang);
			expect(contacts(l)).toEqual([]);
			expect(l.unplaced).toEqual([]);
		}
	});

	it('keeps Tchaikovsky’s whole run, fourteen pitches over two octaves, clear', () => {
		const l = draw(tchaikovsky());
		expect(barLabels(l)).toHaveLength(14);
		expect(crowded(l)).toEqual([]);
	});
});

describe('planning the label columns', () => {
	const item = (midi: number, cy: number, lines = 1) => ({ midi, cy, lines, barHalf: 2.25 });

	it('spreads by gaps as `spreadApart` does when every gap is equal', () => {
		expect(spreadByGaps([0, 5], [10, 0])).toEqual(spreadApart([0, 5], 10));
		expect(spreadByGaps([0, 100], [10, 0])).toEqual([0, 100]);
	});

	it('spreads by each pair’s own gap when labels differ in height', () => {
		const p = spreadByGaps([0, 1, 2], [20, 10, 0]);
		expect(p[1] - p[0]).toBeGreaterThanOrEqual(20 - 1e-9);
		expect(p[2] - p[1]).toBeGreaterThanOrEqual(10 - 1e-9);
	});

	it('leaves rows 11 px apart or more alone: no cluster, no movement', () => {
		const plan = planLabelClusters([item(50, 0), item(52, 11), item(55, 33)]);
		expect(plan.clusters).toEqual([]);
		expect([...plan.centre.values()]).toEqual([0, 11, 33]);
	});

	it('clusters rows a semitone apart, moves them as little as a label’s height needs, and names the bars that stand beside them', () => {
		const plan = planLabelClusters([item(54, 82.5), item(55, 77), item(56, 71.5), item(40, 20)]);
		expect(plan.clusters).toHaveLength(1);
		expect(plan.clusters[0].members.sort()).toEqual([54, 55, 56]);
		const centres = [56, 55, 54].map((m) => plan.centre.get(m)!);
		for (let i = 1; i < centres.length; i++) expect(centres[i] - centres[i - 1]).toBeGreaterThanOrEqual(9.9);
		// The middle row hardly moves; the outer two make room.
		expect(Math.abs(plan.centre.get(55)! - 77)).toBeLessThan(0.5);
		// A row whose bar stands beside a moved label, though not in the run, is named so the column clears its bar.
		const withNeighbour = planLabelClusters([item(54, 82.5), item(55, 77), item(56, 71.5), item(58, 60.5)]);
		expect(withNeighbour.clusters[0].blockers.concat(withNeighbour.clusters[0].members)).toContain(58);
	});

	it('depends on the rows’ places and line counts only: the same plan in both languages, whatever the bars', () => {
		const a = planLabelClusters([item(54, 82.5), item(55, 77)]);
		const b = planLabelClusters([item(54, 82.5), item(55, 77)]);
		expect(a).toEqual(b);
	});
});

describe('the extremes', () => {
	it('one pitch', () => {
		const l = draw(base([row(54, 10)]));
		expect(contacts(l)).toEqual([]);
		expect(l.rows[0].length).toBeCloseTo(l.barMax, 6);
		expect(barLabels(l).map((t) => t.text.split(' · ')[0])).toEqual(['F♯3']);
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
			// One label a bar: six bars, and the bar with two findings continues them on a second line of its own label.
			expect(barLabels(l).filter((t) => rows.some((r) => t.text.startsWith(r.spellings[0].step))).length).toBeGreaterThanOrEqual(6);
			expect(barLabels(l).map((t) => t.weight)).toContain(600);
			const two = barLabels(l).filter((t) => t.text.includes('['));
			expect(two).toHaveLength(2);
			expect(Math.abs(two[0].y - two[1].y)).toBe(12.5);
			expect(two[0].text.startsWith('F4 · ')).toBe(true);
			expect(l.texts.find((t) => /· 38.s$/.test(t.text))).toBeTruthy();
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

	it('a treble clef draws its own quiet clef, and still no compass', () => {
		const rows: FigureRow[] = [
			{ midi: 66, spellings: [P('F', 4, 1)], quavers: 10, tags: [] },
			{ midi: 79, spellings: [P('G', 5)], quavers: 20, tags: [] },
		];
		const l = draw(base(rows, { clef: 'treble', compass: { low: P('F', 4, 1), high: P('G', 5) } }));
		expect(contacts(l)).toEqual([]);
		expect(l.clef).not.toBeNull();
		// The bars begin after the clef's right edge.
		expect(l.barX).toBeGreaterThan(4 + 2.7 * l.lineGap);
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
		return { f, wall, open };
	}

	it('is used by the layout when "centre" and "half the singing" have no near place: a 0.6 px hairline, solid, rose ink, and the figure still touches nothing', () => {
		const { f, wall, open } = forced();
		for (const lang of ['en', 'fr'] as const) {
			const l = layoutTessituragram(f, lang, measure, glyph, { extraObstacles: [wall] });
			const before = draw(f, lang);
			expect(l.texts.find((t) => t.kind === 'centre')).toBeTruthy();
			expect(l.texts.some((t) => t.kind === 'half')).toBe(true);
			// Two more leaders than the open layout has: the two labels the wall displaced.
			expect(l.leaders.length - before.leaders.length).toBe(2);
			for (const s of l.leaders.slice(before.leaders.length)) {
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
		expect(open.leaders.length).toBeGreaterThan(0);
	});

	it('is not used for "centre" or "half the singing" when a near place is clear', () => {
		const { f } = forced();
		const l = draw(f);
		// The only hairlines are the bar labels' own: none starts at the bracket.
		const bracketX = l.halfBracket[0].x1;
		expect(l.leaders.every((s) => s.x1 < bracketX - 1)).toBe(true);
	});

	it('dumps the forced leader for the screenshot when asked', () => {
		const path = process.env.TESSITURAGRAM_DUMP;
		if (!path) return;
		const { f, wall } = forced();
		const quiet = layoutTessituragram(f, 'en', measure, glyph, { extraObstacles: [wall] });
		writeFileSync(path, JSON.stringify({ en: quiet, fr: layoutTessituragram(f, 'fr', measure, glyph, { extraObstacles: [wall] }), tchai: draw(tchaikovsky()) }));
	});
});
