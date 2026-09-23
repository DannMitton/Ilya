/**
 * N.127 Insights, increment 1: the numbers page one prints.
 *
 * Every expectation below is read off the input, never off `insights.ts`:
 * a compass is the lowest and highest pitch written into the test's own line,
 * a crossing count is counted by eye from the listed pitches, and the struck
 * attribution is compared against the sentence as `i18n.ts` holds it. That is
 * the standing condition on an acceptance test in this repository.
 *
 * The analysis chain is the real one (`analyzeScore`, `resolveAdvice`,
 * `buildWatchList`), fed a minimal score the way `watchlist.test.ts` feeds it.
 */

import { describe, expect, it } from 'vitest';
import {
	analyzeScore,
	resolveVocalReadingOctave,
	shiftVocalOctave,
	type Measure,
	type ParsedScore,
	type Pitch,
	type VocalLineEvent,
	type VoiceProfileSnapshot,
} from '@ilya/score-parser';
import { t } from '$lib/i18n';
import {
	buildInsights,
	countCrossings,
	formatSeconds,
	formatSecondsFine,
	formatTempo,
	groupFindings,
	wholePercents,
	strikeLiederClause,
	tessituragram,
	verdictOf,
	type Finding,
	type RangeRow,
	type TessituraRow,
} from './insights';
import { buildWatchList, type WatchEntry } from './watchlist';
import { resolveAdvice } from './advice-resolver';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

const QUARTER = { base: 'quarter' as const, dots: 0, fraction: { numerator: 1, denominator: 4 } };
const HALF = { base: 'half' as const, dots: 0, fraction: { numerator: 1, denominator: 2 } };

function note(
	id: string,
	measureIndex: number,
	pos: number,
	pitch: Pitch,
	duration: VocalLineEvent['duration'] = QUARTER,
): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex,
		rhythmicPosition: { fraction: { numerator: pos, denominator: 4 } },
		duration,
		pitch,
	};
}

function measure(index: number): Measure {
	return {
		index,
		number: String(index + 1),
		timeSignature: { beats: 4, beatType: 4 },
		expectedDuration: { numerator: 1, denominator: 1 },
	} as Measure;
}

function score(events: VocalLineEvent[], measures: number): ParsedScore {
	return {
		source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures: Array.from({ length: measures }, (_, i) => measure(i)),
		keySignatures: [],
		timeSignatures: [],
		tempoMarkings: [],
		vocalLine: events,
	} as unknown as ParsedScore;
}

/* Bar 1: A2 A2 D3 D3. Bar 2: D3 D3 F3 F3. Bar 3: E♭4 (half) D3 (half).
   Sounding time per pitch, in quavers: A2 4, D3 12, F3 4, E♭4 4. */
const line = [
	note('a', 0, 0, P('A', 2)),
	note('b', 0, 1, P('A', 2)),
	note('c', 0, 2, P('D', 3)),
	note('d', 0, 3, P('D', 3)),
	note('e', 1, 0, P('D', 3)),
	note('f', 1, 1, P('D', 3)),
	note('g', 1, 2, P('F', 3)),
	note('h', 1, 3, P('F', 3)),
	note('i', 2, 0, P('E', 4, -1), HALF),
	note('j', 2, 2, P('D', 3), HALF),
];

const profile: VoiceProfileSnapshot = {
	fR1: { a: 650, o: 450, u: 350, i: 300, e: 400 },
	range: { lowest: P('G', 2), highest: P('F', 4) },
	tessitura: { low: P('C', 3), high: P('A', 3) },
	passaggio: { primo: P('F', 3), secondo: P('D', 4) },
};

describe('N.127 the fit table', () => {
	it('reads the compass off the sung line, spelled as the score spells it', () => {
		const m = buildInsights({ analysisScore: score(line, 3), profile, watchList: null });
		expect(m.range.measured).toEqual({ low: P('A', 2), high: P('E', 4, -1) });
		expect(m.range.reference).toEqual({ low: P('G', 2), high: P('F', 4) });
		expect(m.range.flag).toBe('contained');
	});

	it('counts a crossing on every move across a typed edge, the edge itself counting as above', () => {
		// The line walks MIDI 45 45 50 50 50 50 53 53 63 50. Primo F3 is 53: the
		// move from D3 onto F3 crosses it (on the edge counts as above), and the
		// move from E♭4 down to D3 crosses it again. Two. Secondo D4 is 62: the
		// move up into E♭4 and the move back down. Two.
		const m = buildInsights({ analysisScore: score(line, 3), profile, watchList: null });
		expect(m.crossings.measured).toEqual({ primo: 2, secondo: 2 });
		expect(countCrossings([57, 56, 57, 58], 57)).toBe(2);
		expect(countCrossings([56, 56], 57)).toBe(0);
	});

	it('cuts the tessitura by Pacheco and flags it against the typed tessitura', () => {
		// Tallest bar D3 at 12 quavers, so the line is 6; only D3 reaches it.
		// That is the degenerate case, so the band re-bases on half the
		// second-tallest bar (4, so 2), which every sung pitch reaches: A2 to E♭4.
		const m = buildInsights({ analysisScore: score(line, 3), profile, watchList: null });
		expect(m.tessitura.measured?.low).toEqual(P('A', 2));
		expect(m.tessitura.measured?.high).toEqual(P('E', 4, -1));
		expect(m.tessitura.measured?.basis).toBe('half-second-maximum');
		// A2 to E♭4 against a typed C3 to A3 runs past both ends.
		expect(m.tessitura.flag).toBe('wider');
		expect(m.verdict).toBe('outside-tessitura');
	});

	it('withholds the tessitura, and names the bar, when a measure does not add up', () => {
		// Bar 2's first note becomes a half by notation and three quarters by its
		// parser fraction. The bar then sums to 5/4 one way and 6/4 the other:
		// the readings disagree and neither closes 4/4.
		const bad = line.map((ev) =>
			ev.id === 'e'
				? { ...ev, duration: { ...HALF, fraction: { numerator: 3, denominator: 4 } } }
				: ev,
		);
		const m = buildInsights({ analysisScore: score(bad, 3), profile, watchList: null });
		expect(m.tessitura.measured).toBeNull();
		expect(m.tessitura.withheldFor).toEqual(['2']);
		expect(m.tessitura.flag).toBeNull();
		// The compass does not read a duration, so it still prints.
		expect(m.range.flag).toBe('contained');
		expect(m.verdict).toBe('range-only');
	});

	it('compares nothing it was not given', () => {
		const bare: VoiceProfileSnapshot = { fR1: profile.fR1 };
		const m = buildInsights({ analysisScore: score(line, 3), profile: bare, watchList: null });
		expect(m.range.reference).toBeNull();
		expect(m.range.flag).toBeNull();
		expect(m.crossings).toEqual({ measured: null, reference: null });
		expect(m.tessitura.reference).toBeNull();
		expect(m.tessitura.flag).toBeNull();
		expect(m.verdict).toBe('cannot-say');
	});
});

const AT0 = { fraction: { numerator: 0, denominator: 1 } };
const withTempo = (sc: ParsedScore, extra: Partial<ParsedScore>): ParsedScore => ({ ...sc, ...extra }) as ParsedScore;
const quarter60 = { tempoMarkings: [{ measureIndex: 0, rhythmicPosition: AT0, bpm: 60, beatUnit: 'quarter', beatUnitDots: 0 }] } as Partial<ParsedScore>;
const rest = (id: string, measureIndex: number): VocalLineEvent =>
	({ id, type: 'rest', measureIndex, rhythmicPosition: AT0, duration: { base: 'whole', dots: 0, fraction: { numerator: 1, denominator: 1 } } }) as VocalLineEvent;

describe('N.123 phonation time', () => {
	it('prices phonation and the piece, rests included, at an encoded tempo', () => {
		// 24 sung quavers and one bar of rest, at quarter = 60: a quaver is half
		// a second, so 12 s sung of a 16 s piece.
		const sc = withTempo(score([...line, rest('r', 3)], 4), quarter60);
		const ph = buildInsights({ analysisScore: sc, profile, watchList: null }).phonation;
		expect(ph.timing).toBe('point');
		expect(ph.phonation).toEqual({ kind: 'point', seconds: 12 });
		expect(ph.length).toBe(16);
		expect(formatTempo(ph.tempo!, 'en')).toBe('\u2669\u00a0=\u00a060');
	});

	it('gives a range and no length when the tempo is inferred from a word', () => {
		const sc = withTempo(score(line, 3), { tempoWords: [{ measureIndex: 0, rhythmicPosition: AT0, text: 'Andante' }] });
		const ph = buildInsights({ analysisScore: sc, profile, watchList: null }).phonation;
		expect(ph.timing).toBe('range');
		expect(ph.phonation?.kind).toBe('range');
		expect(ph.length).toBeNull();
		expect(ph.tempo?.printedText).toBe('Andante');
	});

	it('invents no tempo, and still divides the time into shares', () => {
		const ph = buildInsights({ analysisScore: score(line, 3), profile, watchList: null }).phonation;
		expect(ph.timing).toBe('none');
		expect(ph.phonation).toBeNull();
		// Primo F3 is 53, secondo D4 is 62. Below: A2 4 and D3 12. On the primo,
		// so between: F3 4. Above: E♭4 4. Of 24 quavers.
		expect(ph.zones).toEqual({ below: 16 / 24, between: 4 / 24, above: 4 / 24 });
	});

	it('draws no zones without both passaggi', () => {
		const bare: VoiceProfileSnapshot = { fR1: profile.fR1 };
		expect(buildInsights({ analysisScore: score(line, 3), profile: bare, watchList: null }).phonation.zones).toBeNull();
	});

	it('orders vowels by phonation time and marks the ones a finding names', () => {
		const vowelOf: Record<string, string> = { a: 'a', b: 'a', c: 'i', d: 'i', e: 'i', f: 'i', g: 'u', h: 'u', i: 'u', j: 'i' };
		const ph = buildInsights({
			analysisScore: score(line, 3),
			profile,
			watchList: null,
			vowelForEvent: (ev) => vowelOf[ev.id],
		}).phonation;
		// Quarters are 2 quavers, halves 4. a: 2 + 2 = 4; i: 4 x 2 + 4 = 12; u: 2 + 2 + 4 = 8.
		expect(ph.vowels?.map((v) => v.vowel)).toEqual(['i', 'u', 'a']);
		expect(ph.vowels?.every((v) => !v.flagged)).toBe(true);
	});

	it('counts an untrusted bar as written and names it, never dropping it', () => {
		const bad = line.map((ev) =>
			ev.id === 'e' ? { ...ev, duration: { ...HALF, fraction: { numerator: 3, denominator: 4 } } } : ev,
		);
		const m = buildInsights({ analysisScore: withTempo(score(bad, 3), quarter60), profile, watchList: null });
		expect(m.phonation.untrustedMeasures).toEqual(['2']);
		// Bar 2's first note is summed as the half its notation says: 26 quavers, 13 s.
		expect(m.phonation.phonation).toEqual({ kind: 'point', seconds: 13 });
		expect(m.phonation.zones).not.toBeNull();
	});

	it('prints seconds as the page does, and shares that sum to 100', () => {
		expect(formatSeconds(160)).toBe('2\u00a0min\u00a040\u00a0s');
		expect(formatSeconds(39.6)).toBe('40\u00a0s');
		expect(formatSeconds(120)).toBe('2\u00a0min');
		expect(wholePercents([16, 4, 4])).toEqual([67, 17, 16]);
		expect(wholePercents([0, 0, 0])).toEqual([0, 0, 0]);
	});
});

describe('N.123 the tessituragram', () => {
	const finding = (pitch: Pitch, vowel: string, measure = '1'): Finding => ({
		key: `k-${vowel}-${measure}`,
		kind: 'sustain',
		measure,
		pitch,
		vowel,
		instances: 1,
		massQuavers: 1,
	});

	it('gives each sounding pitch one row, named by every spelling the line sings there', () => {
		// B♭3 (half), B3, and A♯3: B♭3 and A♯3 sound alike and share a row.
		const spelled = [
			note('a', 0, 0, P('B', 3, -1), HALF),
			note('b', 0, 2, P('B', 3)),
			note('c', 0, 3, P('A', 3, 1)),
		];
		const f = buildInsights({ analysisScore: score(spelled, 1), profile, watchList: null }).figure!;
		expect(f.rows.map((r) => [r.midi, r.spellings.map((p) => `${p.step}${p.alter}`), r.quavers])).toEqual([
			[58, ['A1', 'B-1'], 6],
			[59, ['B0'], 2],
		]);
		expect(f.longest.midi).toBe(58);
		expect(f.longest.share).toBe(6 / 8);
	});

	it('hangs each finding on its pitch in list order, and follows the typed range for the clef', () => {
		const sc = score(line, 3);
		const m = buildInsights({ analysisScore: sc, profile, watchList: null });
		const findings = [finding(P('D', 3), 'i', '1'), finding(P('E', 4, -1), 'u', '3'), finding(P('D', 3), 'a', '2')];
		const f = tessituragram(sc, profile, findings, m.tessitura, m.range, m.phonation.zones)!;
		const d3 = f.rows.find((r) => r.midi === 50)!;
		expect(d3.quavers).toBe(12);
		expect(d3.tags).toEqual([
			{ measure: '1', vowel: 'i' },
			{ measure: '2', vowel: 'a' },
		]);
		expect(f.rows.find((r) => r.midi === 63)!.tags).toEqual([{ measure: '3', vowel: 'u' }]);
		expect(f.rows[0].tags).toEqual([]);
		expect(f.quiet).toBe(false);
		// Typed G2 to F4: steps 18 and 31, midpoint floored to 24, which is F3: bass.
		expect(f.clef).toBe('bass');
		// Shares 16, 4, 4 of 24 as whole percents.
		expect(f.zones).toEqual({ below: 67, between: 17, above: 16 });
		expect(f.scale).toBe('quavers');
		expect(f.longest.seconds).toBeNull();
	});

	it('names a MusicXML treble-8vb line by the pitches it sounds, A2 to E♭4, as the pane reads it', () => {
		// Sunless no. 2's shape: stored A2 to E♭4 under a G clef with an 8 below.
		const raw = score([note('a', 0, 0, P('A', 2)), note('b', 0, 1, P('C', 3, 1)), note('c', 0, 2, P('E', 4, -1), HALF)], 1);
		const parsed = {
			...raw,
			source: { format: 'musicxml', fidelity: 'native', origin: 'musicxml-direct', sourceWarnings: [] },
			clefs: [{ measureIndex: 0, clef: { sign: 'G', line: 2, octaveChange: -1 } }],
		} as unknown as ParsedScore;
		const shift = resolveVocalReadingOctave(parsed, profile.range);
		const reading = shift !== 0 ? shiftVocalOctave(parsed, shift) : parsed;
		const f = buildInsights({ analysisScore: reading, profile, watchList: null }).figure!;
		expect(f.rows.map((r) => r.spellings.map((p) => `${p.step}${p.alter}${p.octave}`))).toEqual([['A02'], ['C13'], ['E-14']]);
		expect(f.compass).toEqual({ low: P('A', 2), high: P('E', 4, -1) });
	});

	it('draws quietly with no findings, prices the longest bar at a tempo, and keeps a decimal under a second', () => {
		const bare: VoiceProfileSnapshot = { fR1: profile.fR1 };
		const f = buildInsights({ analysisScore: withTempo(score(line, 3), quarter60), profile: bare, watchList: null }).figure!;
		expect(f.quiet).toBe(true);
		expect(f.zones).toBeNull();
		// No typed range: the compass A2 to E♭4 decides, steps 19 and 30, midpoint 24, F3: bass.
		expect(f.clef).toBe('bass');
		expect(f.scale).toBe('seconds');
		// D3, 12 quavers at a half second each.
		expect(f.longest.seconds).toEqual({ kind: 'point', seconds: 6 });
		expect(formatSecondsFine(0.4, 'en')).toBe('0.4\u00a0s');
		expect(formatSecondsFine(0.4, 'fr')).toBe('0,4\u00a0s');
		expect(formatSecondsFine(12.4, 'fr')).toBe('12\u00a0s');
	});
});

describe('N.127 the verdict', () => {
	const range = (flag: RangeRow['flag']): RangeRow => ({ measured: null, reference: null, flag });
	const tess = (flag: TessituraRow['flag']): TessituraRow => ({
		measured: null,
		withheldFor: null,
		reference: null,
		flag,
	});

	it('says the key fits only when the compass and the tessitura are both contained', () => {
		expect(verdictOf(range('contained'), tess('contained'))).toBe('fit');
		expect(verdictOf(range('above'), tess('contained'))).toBe('outside-range');
		expect(verdictOf(range('contained'), tess('below'))).toBe('outside-tessitura');
		expect(verdictOf(range('contained'), tess(null))).toBe('range-only');
		expect(verdictOf(range(null), tess('contained'))).toBe('cannot-say');
	});
});

describe('N.127 the findings', () => {
	function entry(eventId: string, kinds: WatchEntry['kinds'], extra: Partial<WatchEntry> = {}): WatchEntry {
		return { eventId, tier: 1, kinds, bar: '1', vowel: 'a', density: 1, ...extra };
	}

	it('keeps one entry per hazard, anchored by its longest instance, heaviest hazard first', () => {
		const s = score(line, 3);
		const watch = {
			entries: [
				// Two crossings: 'a' is a quarter (2 quavers), 'i' a half (4).
				entry('a', ['crossing'], { bar: '1' }),
				entry('i', ['crossing'], { bar: '3', vowel: 'u', word: 'глубокая' }),
				// One passaggio entry, a half: 4 quavers against the crossings' 6.
				entry('j', ['passaggio'], { bar: '3' }),
			],
		};
		const f = groupFindings(watch, s);
		expect(f.map((x) => x.key)).toEqual(['crossing', 'passaggio']);
		expect(f[0]).toMatchObject({ measure: '3', vowel: 'u', word: 'глубокая', instances: 2, massQuavers: 6 });
		expect(f[0].pitch).toEqual(P('E', 4, -1));
		expect(f[1]).toMatchObject({ instances: 1, massQuavers: 4 });
	});

	it('splits range by direction, because rising above and dropping below are two findings', () => {
		const watch = {
			entries: [
				entry('i', ['range'], { rangeDirection: 'above' }),
				entry('a', ['range'], { rangeDirection: 'below' }),
			],
		};
		expect(groupFindings(watch, score(line, 3)).map((x) => x.key)).toEqual(['range-above', 'range-below']);
	});

	it('reads real watch-list output and says nothing when nothing fired', () => {
		const s = score(line, 3);
		const resolver = () => 'a';
		const analyzed = resolveAdvice(analyzeScore(s, profile, resolver));
		const watch = buildWatchList(s, analyzed, 1, { analysisScore: s, profile, resolver });
		const m = buildInsights({ analysisScore: s, profile, watchList: watch });
		// The two F3 quarters in bar 2 sit on the typed primo, so the watch
		// list's passaggio tier fires on both: one hazard, two instances.
		const passaggio = m.findings.find((f) => f.key === 'passaggio');
		expect(passaggio).toMatchObject({ measure: '2', pitch: P('F', 3), instances: 2, massQuavers: 4 });
		// Every finding names a measure the line has and a pitch it sings.
		for (const f of m.findings) {
			expect(['1', '2', '3']).toContain(f.measure);
			expect(line.some((ev) => JSON.stringify(ev.pitch) === JSON.stringify(f.pitch))).toBe(true);
		}
		expect(groupFindings({ entries: [] }, s)).toEqual([]);
		expect(groupFindings(null, s)).toEqual([]);
	});
});

describe('N.127 the foot', () => {
	it('strikes the lieder.net clause in both languages and leaves the rest of the sentence', () => {
		for (const lang of ['en', 'fr'] as const) {
			const whole = t('footer.attribution', lang);
			const struck = strikeLiederClause(whole);
			expect(whole).toContain('lieder.net');
			expect(struck).not.toContain('lieder.net');
			expect(struck).toContain('kaikki.org');
			expect(struck).toContain('4.0</a>). ');
			// Nothing else goes: the struck copy is the whole less one clause.
			expect(whole.length - struck.length).toBeLessThan(140);
		}
		expect(strikeLiederClause(t('footer.attribution', 'en'))).toContain('CC BY-SA 4.0</a>). Made with love');
		expect(strikeLiederClause(t('footer.attribution', 'fr'))).toContain('CC BY-SA 4.0</a>). Fait avec amour');
	});
});

describe('N.127 the tab name', () => {
	it('carries the French Dann ruled on 2026-09-12', () => {
		expect(t('tab.insights', 'en')).toBe('Insights');
		expect(t('tab.insights', 'fr')).toBe('Aperçus');
	});
});
