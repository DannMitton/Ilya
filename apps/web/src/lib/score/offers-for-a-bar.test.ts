/**
 * offers-for-a-bar.test.ts: what Ilya can offer for a bar to confirm.
 *
 * Expectations are written from plain beat counts and the brief's own ten bars
 * (docs briefs, QUEUE row 51 slice 2, section 7), never from the mechanism
 * under test.
 */

import { describe, it, expect } from 'vitest';
import { MusicXmlScoreParser } from '@ilya/score-parser';
import type { Measure, NoteBase, ParsedScore, VocalLineEvent } from '@ilya/score-parser';
import { durationFraction } from './correction';
import { barsToConfirm } from './bars-to-confirm';
import { offersForABar } from './offers-for-a-bar';
import { parseXml } from './ingestion/mini-dom';

interface Spec {
	base: NoteBase;
	dots?: number;
	rest?: boolean;
	/** Already marked as a tuplet, with its own parser-computed fraction. */
	tuplet?: { actual: number; normal: number };
}

const event = (m: number, i: number, s: Spec): VocalLineEvent => {
	const dots = s.dots ?? 0;
	const whole = durationFraction(s.base, dots);
	const fraction = s.tuplet
		? { numerator: whole.numerator * s.tuplet.normal, denominator: whole.denominator * s.tuplet.actual }
		: whole;
	return {
		id: `m${m}-${i}`,
		type: s.rest ? 'rest' : 'note',
		measureIndex: m,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: {
			base: s.base,
			dots,
			fraction,
			...(s.tuplet
				? { tuplet: { actualNotes: s.tuplet.actual, normalNotes: s.tuplet.normal, normalType: s.base } }
				: {}),
		},
		...(s.rest ? {} : { pitch: { step: 'G' as const, octave: 3, alter: 0 } }),
	};
};

/** One bar of the given notes, in the given metre. */
function bar(specs: Spec[], beats = 4, beatType = 4) {
	const measure: Measure = {
		index: 0,
		number: '1',
		timeSignature: { beats, beatType },
		keySignature: { fifths: 0 },
		expectedDuration: { numerator: beats, denominator: beatType },
	};
	const score = { measures: [measure], vocalLine: specs.map((s, i) => event(0, i, s)) } satisfies Pick<
		ParsedScore,
		'measures' | 'vocalLine'
	>;
	const [named] = barsToConfirm({ ...score, measures: [{ ...measure, repeatStart: false }, { ...measure, index: 1 }] });
	return { score, named };
}

const offers = (specs: Spec[], beats = 4, beatType = 4) => {
	const { score } = bar(specs, beats, beatType);
	return offersForABar(score, { measureIndex: 0, number: '1', actual: 0, expected: beats });
};

const q: Spec = { base: 'quarter' };
const run = (r: { label: string; start: number; n: number; ratio: { n: number; m: number } }) => ({
	label: r.label,
	start: r.start,
	n: r.n,
	ratio: r.ratio,
});

describe('what Ilya can offer for a bar to confirm', () => {
	it('(a) 4/4 half, eighth, eighth: one offer, the half dotted', () => {
		const o = offers([{ base: 'half' }, { base: 'eighth' }, { base: 'eighth' }]);
		expect(o.kind).toBe('note');
		expect(o.note).toMatchObject({ index: 0, type: 'half', dots: 0 });
		expect(o.change).toEqual({ what: 'dot', to: 'half', dots: 1 });
		expect(o.runs).toBeUndefined();
	});

	it('(b) 3/4 dotted half, quarter: one offer, the dot removed', () => {
		const o = offers([{ base: 'half', dots: 1 }, q], 3, 4);
		expect(o.kind).toBe('note');
		expect(o.note).toMatchObject({ index: 0, type: 'half', dots: 1 });
		expect(o.change).toEqual({ what: 'undot', to: 'half', dots: 0 });
	});

	it('(c) 4/4 half, quarter: no kind 1 offer, both candidates reported', () => {
		const o = offers([{ base: 'half' }, q]);
		expect(o.note).toBeUndefined();
		expect(o.change).toBeUndefined();
		expect(o.kind).toBe('none');
		expect(o.rejected).toHaveLength(1);
		expect(o.rejected[0]).toContain('2 single-note changes');
		expect(o.rejected[0]).toContain('dot event 0');
		expect(o.rejected[0]).toContain('longer event 1');
	});

	it('(d) 3/4 four quarters: A is 3:2 over quarters 0 to 2, B is 4:3 over all four', () => {
		const o = offers([q, q, q, q], 3, 4);
		expect(o.kind).toBe('tuplet');
		expect(o.runs?.map(run)).toEqual([
			{ label: 'A', start: 0, n: 3, ratio: { n: 3, m: 2 } },
			{ label: 'B', start: 0, n: 4, ratio: { n: 4, m: 3 } },
		]);
	});

	it('(e) 4/4 three quarters, half: the half as a quarter, and one 3:2 run', () => {
		const o = offers([q, q, q, { base: 'half' }]);
		expect(o.kind).toBe('note');
		expect(o.note).toMatchObject({ index: 3, type: 'half' });
		expect(o.change).toEqual({ what: 'shorter', to: 'quarter', dots: 0 });
		expect(o.runs?.map(run)).toEqual([{ label: 'A', start: 0, n: 3, ratio: { n: 3, m: 2 } }]);
	});

	it('(f) 4/4 five quarters: A is 3:2 at quarter 0, B is 3:2 at quarter 2, none at quarter 1', () => {
		const o = offers([q, q, q, q, q]);
		expect(o.kind).toBe('tuplet');
		expect(o.runs?.map(run)).toEqual([
			{ label: 'A', start: 0, n: 3, ratio: { n: 3, m: 2 } },
			{ label: 'B', start: 2, n: 3, ratio: { n: 3, m: 2 } },
		]);
	});

	it('(g) 6/8 two quarters: one 2:3 run, no kind 1 offer (two candidates reported)', () => {
		const o = offers([q, q], 6, 8);
		expect(o.kind).toBe('tuplet');
		expect(o.note).toBeUndefined();
		expect(o.runs?.map(run)).toEqual([{ label: 'A', start: 0, n: 2, ratio: { n: 2, m: 3 } }]);
		expect(o.rejected.join(' ')).toContain('2 single-note changes');
	});

	it('(h) 4/4 four quarters plus a quarter already under 3:2: it is not offered again', () => {
		const marked: Spec = { base: 'quarter', tuplet: { actual: 3, normal: 2 } };
		const o = offers([q, q, q, q, marked]);
		expect(o.kind).toBe('none');
		expect(o.runs).toBeUndefined();
		expect(o.rejected.join(' ')).toContain('event 4 (quarter) already carries a tuplet');
	});

	it('(i) a bar whose only fix is a grace note: nothing, because the parser drops the grace note', async () => {
		// Three quarters and a 32nd, plus a grace note whose length would be the "fix".
		// Divisions 8: a quarter is 8, a 32nd is 1.
		const note = (type: string, d: number, grace = false) =>
			`<note>${grace ? '<grace/>' : ''}<pitch><step>G</step><octave>3</octave></pitch>${grace ? '' : `<duration>${d}</duration>`}<type>${type}</type></note>`;
		const xml = `<?xml version="1.0"?><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>8</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>${note('quarter', 8)}${note('quarter', 8)}${note('quarter', 8)}${note('eighth', 0, true)}${note('32nd', 1)}</measure></part></score-partwise>`;
		const result = await new MusicXmlScoreParser().parse({
			format: 'musicxml',
			data: parseXml(xml) as unknown as Document,
			sourcePath: 'grace.musicxml',
		});
		const score = result.score as ParsedScore;
		expect(score.vocalLine).toHaveLength(4);
		const o = offersForABar(score, { measureIndex: 0, number: '1', actual: 0, expected: 4 });
		expect(o.kind).toBe('none');
		expect(o.note).toBeUndefined();
		expect(o.runs).toBeUndefined();
	});

	it('(j) a bar with no candidate: nothing', () => {
		const o = offers([{ base: 'whole' }, { base: '16th' }, { base: '16th' }, { base: '16th' }, { base: '16th' }]);
		expect(o.kind).toBe('none');
		expect(o.note).toBeUndefined();
		expect(o.runs).toBeUndefined();
	});
});

describe('the edges of the rules', () => {
	it('never wraps the printed type: a whole note does not step longer, a 16th does not step shorter', () => {
		// 4/4 holding a whole and a 16th: the only fix would be a shorter 16th, which is not on the ladder.
		const o = offers([{ base: 'whole' }, { base: '16th' }]);
		expect(o.kind).toBe('none');
	});

	it('a rest is a candidate and its offer carries no pitch', () => {
		// 4/4 holding a dotted half and an eighth rest is 7/8: the eighth rest, as a quarter rest, is the one fix.
		const o = offers([{ base: 'half', dots: 1 }, { base: 'eighth', rest: true }]);
		expect(o.kind).toBe('note');
		expect(o.note).toEqual({ index: 1, type: 'eighth', dots: 0 });
		expect(o.note?.pitch).toBeUndefined();
		expect(o.change).toEqual({ what: 'longer', to: 'quarter', dots: 0 });
	});

	it('a rest may stand in a run', () => {
		const o = offers([q, { base: 'quarter', rest: true }, q, q], 3, 4);
		expect(o.runs?.map((r) => r.start)).toContain(0);
	});

	it('4:3 is not offered in simple metre other than 3 beats', () => {
		const o = offers([q, q, q, q, q]);
		expect(o.runs?.every((r) => r.ratio.n === 3)).toBe(true);
	});

	it('says so where only two runs together would fit, and offers no tuplet', () => {
		// 4/4 holding six quarters is 6/4: no single 3:2 run removes the half a beat that two do.
		const o = offers([q, q, q, q, q, q]);
		expect(o.runs).toBeUndefined();
		expect(o.rejected.join(' ')).toContain('two tuplet runs together');
	});

	it('offers none of a kind where three or more runs fit, and reports them all', () => {
		// 4/4 holding nine eighths is 9/8: a 3:2 run at event 0, 2, 4, or 6 each fits.
		const e: Spec = { base: 'eighth' };
		const o = offers([e, e, e, e, e, e, e, e, e]);
		expect(o.kind).toBe('none');
		expect(o.runs).toBeUndefined();
		expect(o.rejected.join(' ')).toContain('4 tuplet runs fit');
	});
});
