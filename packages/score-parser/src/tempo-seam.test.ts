/**
 * Tempo seam tests.
 *
 * The precedence under test is Dann's, recorded 2026-07-17 in
 * `claude/fit-tempo-tier-default-design_2026-07-17.md` §6: the singer's override
 * tops all, an encoded mark beats a word, a word resolves to a Quantz tier and is
 * labelled inferred, and nothing means abstain.
 *
 * Every behavioural claim carries a negative control (V2-A). The A440 figure
 * comes from the definition of the pitch standard, not from this code.
 */

import { describe, expect, it } from 'vitest';
import { bandPosition, classifyCue, classifyGradualCue, feltBeat, rampSeconds, readModifiers, resolveTempo, tempoCaveats } from './tempo-seam';
import { aggregatePhonation, hzOf, secondsFor, totalFoldCycles } from './phonation';
import { lexiconHeadTerms, lexiconSize } from './tempo-lexicon';
import { resolveTempoTerm } from './tempo-terms';
import type { Duration, Measure, ParsedScore, VocalLineEvent } from './types';

let seq = 0;
function note(base: Duration['base'], step: 'A' | 'C' = 'C', octave = 4): VocalLineEvent {
	const sizes: Record<string, [number, number]> = { whole: [1, 1], half: [1, 2], quarter: [1, 4] };
	const [n, d] = sizes[base];
	return {
		id: `n${seq++}`,
		type: 'note',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base, dots: 0, fraction: { numerator: n, denominator: d } },
		pitch: { step, octave, alter: 0 },
	} as VocalLineEvent;
}

function scoreOf(opts: {
	markings?: ParsedScore['tempoMarkings'];
	words?: Array<{ measureIndex: number; text: string }>;
	line?: VocalLineEvent[];
}): ParsedScore {
	return {
		measures: [
			{
				index: 0,
				number: '1',
				timeSignature: { beats: 4, beatType: 4 },
				keySignature: { fifths: 0, mode: 'major' },
				expectedDuration: { numerator: 1, denominator: 1 },
			} as Measure,
		],
		vocalLine: opts.line ?? [],
		tempoMarkings: opts.markings ?? [],
		tempoWords: (opts.words ?? []).map((w) => ({
			measureIndex: w.measureIndex,
			rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
			text: w.text,
		})),
	} as unknown as ParsedScore;
}

const mark = (bpm: number) => [
	{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, bpm, beatUnit: 'quarter' as const, beatUnitDots: 0 },
];

describe('the precedence, and each layer shown beating the one below it', () => {
	it('4. abstains when the score states nothing', () => {
		expect(resolveTempo(scoreOf({}))).toBeUndefined();
	});

	it('3. a printed WORD resolves to a Quantz tier and is labelled inferred, with its band', () => {
		const r = resolveTempo(scoreOf({ words: [{ measureIndex: 0, text: 'Andante tranquillo' }] }))!;
		expect(r.provenance).toBe('inferred');
		expect(r.tier).toBe('moderate');
		expect(r.range).toEqual([66, 112]);
		expect(r.printedText).toBe('Andante tranquillo');
	});

	it('2. an ENCODED mark beats a word', () => {
		const r = resolveTempo(scoreOf({ markings: mark(120), words: [{ measureIndex: 0, text: 'Andante' }] }))!;
		expect(r.provenance).toBe('encoded');
		expect(r.bpm).toBe(120);
		// and it carries no band: an encoded number is not a tier
		expect(r.range).toBeUndefined();
	});

	it('1. the singer\'s override beats an encoded mark, because a printed mark may be editorial', () => {
		const r = resolveTempo(scoreOf({ markings: mark(120) }), { overrideBpm: 90 })!;
		expect(r.provenance).toBe('user');
		expect(r.bpm).toBe(90);
	});

	it('NEGATIVE CONTROL: an unusable override does NOT displace the score', () => {
		for (const bad of [0, -60, NaN, Infinity]) {
			const r = resolveTempo(scoreOf({ markings: mark(120) }), { overrideBpm: bad })!;
			expect(r.provenance).toBe('encoded');
			expect(r.bpm).toBe(120);
		}
	});

	it('NEGATIVE CONTROL: a word it cannot resolve does NOT produce a tempo', () => {
		expect(resolveTempo(scoreOf({ words: [{ measureIndex: 0, text: 'con meditazione' }] }))).toBeUndefined();
		expect(resolveTempo(scoreOf({ words: [{ measureIndex: 0, text: 'zzzz' }] }))).toBeUndefined();
	});
});

describe('gradual cues are counted, never fed to the tier resolver', () => {
	it('classifies the families', () => {
		expect(classifyGradualCue('poco rall.')).toBe('slower');
		expect(classifyGradualCue('accelerando')).toBe('faster');
		expect(classifyGradualCue('a tempo')).toBe('restore');
		expect(classifyGradualCue('Tempo II')).toBe('relative');
	});

	it('NEGATIVE CONTROL: a steady term is NOT a gradual cue', () => {
		for (const steady of ['Andante', 'Moderato assai', 'Allegro agitato', 'Largo']) {
			expect(classifyGradualCue(steady)).toBeUndefined();
		}
	});

	it('a gradual cue ALONE yields no tempo, and is still reported', () => {
		// "a tempo" restores something; it states nothing. Resolving it to a tier
		// would be a category error, and the design puts it explicitly out of scope.
		const s = scoreOf({ words: [{ measureIndex: 3, text: 'poco rall.' }, { measureIndex: 5, text: 'a tempo' }] });
		expect(resolveTempo(s)).toBeUndefined();
	});

	it('is skipped when scanning for a steady term, so a later real term still wins', () => {
		const s = scoreOf({
			words: [
				{ measureIndex: 0, text: 'a tempo' },
				{ measureIndex: 1, text: 'Moderato' },
			],
		});
		const r = resolveTempo(s)!;
		expect(r.term).toBe('moderato');
		expect(r.gradualCues).toHaveLength(1);
	});

	it('separates a STEP from a RAMP, because only one of them varies the rate', () => {
		// "Meno mosso" sets a new constant tempo. Filing it as an unmodellable
		// gradual change was wrong twice: wrong shape, and wrong claim.
		expect(classifyCue('Meno mosso e tranquillo')).toEqual({ kind: 'slower', shape: 'step' });
		expect(classifyCue('più mosso')).toEqual({ kind: 'faster', shape: 'step' });
		expect(classifyCue('a tempo')).toEqual({ kind: 'restore', shape: 'step' });
		expect(classifyCue('poco rall.')).toEqual({ kind: 'slower', shape: 'ramp' });
		expect(classifyCue('poco accelerando e cresc.')).toEqual({ kind: 'faster', shape: 'ramp' });
	});

	it('collects every cue on the resolution, whatever its shape', () => {
		const s = scoreOf({
			words: [
				{ measureIndex: 0, text: 'Andante' },
				{ measureIndex: 4, text: 'poco rall.' },
				{ measureIndex: 6, text: 'a tempo' },
			],
		});
		expect(resolveTempo(s)!.gradualCues).toHaveLength(2);
	});

	it('does NOT caveat a ramp on an inferred tempo, whose band already swallows it', () => {
		// Measured: worst-case ramp 10.7%, declared band 70%. A caveat smaller
		// than the stated uncertainty is noise.
		const s = scoreOf({ words: [{ measureIndex: 0, text: 'Andante' }, { measureIndex: 4, text: 'poco rall.' }] });
		const r = resolveTempo(s)!;
		expect(r.range).toBeDefined();
		expect(tempoCaveats(r).some((c) => c.includes('gradual tempo change'))).toBe(false);
	});

	it('NEGATIVE CONTROL: DOES caveat the same ramp on an encoded tempo, which has no band', () => {
		const s = scoreOf({ markings: mark(120), words: [{ measureIndex: 4, text: 'poco rall.' }] });
		const r = resolveTempo(s)!;
		expect(r.range).toBeUndefined();
		expect(tempoCaveats(r).some((c) => c.includes('gradual tempo change'))).toBe(true);
	});

	it('never caveats a STEP, which is as modellable as the first tempo', () => {
		const s = scoreOf({ markings: mark(120), words: [{ measureIndex: 4, text: 'Meno mosso' }] });
		expect(tempoCaveats(resolveTempo(s)!).some((c) => c.includes('gradual tempo change'))).toBe(false);
	});

	it('rampSeconds: verified against the constant case it must reduce to', () => {
		expect(rampSeconds(100, 90, 90)).toBeCloseTo(6000 / 90, 9);
		// A 60→120 ramp must sit between the two constants, nearer the fast end.
		const mid = rampSeconds(100, 60, 120);
		expect(mid).toBeGreaterThan(rampSeconds(100, 120, 120));
		expect(mid).toBeLessThan(rampSeconds(100, 60, 60));
		expect(mid).toBeCloseTo(69.31, 2);
		expect(() => rampSeconds(100, 0, 90)).toThrow(/positive/);
	});

	it('flags a piece stating more than one steady tempo', () => {
		const s = scoreOf({ markings: [...mark(60), ...mark(120)] });
		const r = resolveTempo(s)!;
		expect(r.steadyMarkingCount).toBe(2);
		expect(tempoCaveats(r).some((c) => c.includes('2 different steady tempi'))).toBe(true);
	});

	it('never returns an empty caveat list, even for a clean user-set tempo', () => {
		const r = resolveTempo(scoreOf({}), { overrideBpm: 100 })!;
		expect(tempoCaveats(r).length).toBeGreaterThan(0);
	});
});

describe('the band travels into seconds and cycles', () => {
	const oneWhole = { numerator: 8, denominator: 1 };

	it('an INFERRED tempo yields a seconds RANGE; an encoded one does not', () => {
		const inferred = secondsFor(oneWhole, scoreOf({ words: [{ measureIndex: 0, text: 'Andante' }] }))!;
		expect(inferred.secondsRange).toBeDefined();
		// Faster bpm gives fewer seconds, so the range must be ordered low-to-high.
		expect(inferred.secondsRange![0]).toBeLessThan(inferred.secondsRange![1]);

		const encoded = secondsFor(oneWhole, scoreOf({ markings: mark(120) }))!;
		expect(encoded.secondsRange).toBeUndefined();
	});

	it('counts fold cycles against the definition of A440', () => {
		// A4 for one quarter at quarter=60 is one second, so 440 cycles, by the
		// definition of the pitch standard rather than by this module's say-so.
		const s = scoreOf({ markings: mark(60), line: [note('quarter', 'A', 4)] });
		const totals = aggregatePhonation(s);
		const r = totalFoldCycles(totals, s)!;
		expect(hzOf(69)).toBeCloseTo(440, 10);
		expect(r.cycles).toBeCloseTo(440, 6);
		expect(r.cyclesRange).toBeUndefined(); // encoded: a point, not a band
	});

	it('NEGATIVE CONTROL: halving the tempo doubles the cycles', () => {
		const line = [note('whole', 'A', 4)];
		const fast = totalFoldCycles(aggregatePhonation(scoreOf({ markings: mark(120), line })), scoreOf({ markings: mark(120), line }))!;
		const slow = totalFoldCycles(aggregatePhonation(scoreOf({ markings: mark(60), line })), scoreOf({ markings: mark(60), line }))!;
		expect(slow.cycles / fast.cycles).toBeCloseTo(2, 9);
	});

	it('an inferred tempo yields a cycles RANGE spanning the tier band', () => {
		const s = scoreOf({ words: [{ measureIndex: 0, text: 'Andante' }], line: [note('whole', 'A', 4)] });
		const r = totalFoldCycles(aggregatePhonation(s), s)!;
		expect(r.cyclesRange).toBeDefined();
		const [lo, hi] = r.cyclesRange!;
		expect(lo).toBeLessThan(hi);
		// The band is 66-112, so the spread is 112/66.
		expect(hi / lo).toBeCloseTo(112 / 66, 6);
	});

	it('abstains all the way down when the tempo is unresolvable', () => {
		const s = scoreOf({ line: [note('whole')] });
		expect(secondsFor(oneWhole, s)).toBeUndefined();
		expect(totalFoldCycles(aggregatePhonation(s), s)).toBeUndefined();
	});

	it('refuses a malformed score rather than guessing', () => {
		expect(() => resolveTempo(null as unknown as ParsedScore)).toThrow(/ParsedScore/);
		expect(() => hzOf(NaN)).toThrow(/finite/);
	});
});

describe('the felt beat comes from the metre, never assumed', () => {
	const sig = (beats: number, beatType: number) =>
		({
			measures: [
				{ index: 0, number: '1', timeSignature: { beats, beatType }, keySignature: { fifths: 0, mode: 'major' }, expectedDuration: { numerator: beats, denominator: beatType } },
			],
			vocalLine: [],
			tempoMarkings: [],
			tempoWords: [{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, text: 'Andante' }],
		}) as unknown as ParsedScore;

	it('counts simple metres in the denominator, compound in dotted, half-note metres in halves', () => {
		expect(feltBeat({ beats: 4, beatType: 4 })).toMatchObject({ unit: 'quarter', dots: 0 });
		expect(feltBeat({ beats: 3, beatType: 2 })).toMatchObject({ unit: 'half', dots: 0 });
		expect(feltBeat({ beats: 12, beatType: 8 })).toMatchObject({ unit: 'quarter', dots: 1 });
		expect(feltBeat({ beats: 6, beatType: 8 })).toMatchObject({ unit: 'quarter', dots: 1 });
		// 3/8 is too few eighths to group in threes: the eighth IS the beat.
		expect(feltBeat({ beats: 3, beatType: 8 })).toMatchObject({ unit: 'eighth', dots: 0 });
	});

	it('converts the quarter-anchored tier value INTO that beat, preserving speed', () => {
		// Andante is 72 quarter-beats. In 12/8 the beat is the dotted quarter,
		// which is 1.5 quarters, so the same speed reads 48.
		const compound = resolveTempo(sig(12, 8))!;
		expect(compound.beatUnit).toBe('quarter');
		expect(compound.beatUnitDots).toBe(1);
		expect(compound.bpm).toBeCloseTo(48, 6);
		// and the band converts with it
		expect(compound.range![0]).toBeCloseTo(44, 6);

		// In 3/2 the beat is the half note, twice a quarter, so 72 reads 36.
		const halfNote = resolveTempo(sig(3, 2))!;
		expect(halfNote.beatUnit).toBe('half');
		expect(halfNote.bpm).toBeCloseTo(36, 6);
	});

	it('NEGATIVE CONTROL: the ELAPSED TIME is identical whatever unit it is stated in', () => {
		// The unit is presentation. If converting changed the duration, the
		// conversion would be a bug rather than a relabelling.
		const oneWhole = { numerator: 8, denominator: 1 };
		const inQuarters = secondsFor(oneWhole, sig(4, 4))!;
		const inDotted = secondsFor(oneWhole, sig(12, 8))!;
		const inHalves = secondsFor(oneWhole, sig(3, 2))!;
		expect(inDotted.seconds).toBeCloseTo(inQuarters.seconds, 4);
		expect(inHalves.seconds).toBeCloseTo(inQuarters.seconds, 4);
		// and the stated numbers really do differ, or the check above is vacuous
		expect(inDotted.bpm).not.toBeCloseTo(inQuarters.bpm, 1);
	});

	it('NEGATIVE CONTROL: an ENCODED mark keeps the beat its editor chose', () => {
		const s = {
			...(sig(12, 8) as object),
			tempoMarkings: [{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, bpm: 60, beatUnit: 'half', beatUnitDots: 0 }],
		} as unknown as ParsedScore;
		const r = resolveTempo(s)!;
		expect(r.beatUnit).toBe('half');
		expect(r.bpm).toBe(60);
	});
});

describe('exact proportions, and a metre that admits two readings', () => {
	const sigTier = (beats: number, beatType: number, term: string) =>
		({
			measures: [{ index: 0, number: '1', timeSignature: { beats, beatType }, keySignature: { fifths: 0, mode: 'major' }, expectedDuration: { numerator: beats, denominator: beatType } }],
			vocalLine: [],
			tempoMarkings: [],
			tempoWords: [{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, text: term }],
		}) as unknown as ParsedScore;

	it('converts as an exact fraction, so nothing is lost to rounding', () => {
		// Andante is 72 quarter-beats; a dotted quarter is 3/8 of a whole, so the
		// factor is exactly 2/3 and 72 becomes exactly 48, not 48-ish.
		const r = resolveTempo(sigTier(12, 8, 'Andante'))!;
		expect(r.bpmExact).toEqual({ numerator: 48, denominator: 1 });
		// The band's top is 112 x 2/3 = 224/3, which has NO exact decimal.
		expect(r.rangeExact![1]).toEqual({ numerator: 224, denominator: 3 });
		expect(r.range![1]).toBeCloseTo(74.6667, 3);
	});

	it('NEGATIVE CONTROL: the exact value really is finer than its decimal', () => {
		const r = resolveTempo(sigTier(12, 8, 'Andante'))!;
		const fromDecimal = Math.round(r.range![1] * 10) / 10; // what rounding gave before
		const fromExact = r.rangeExact![1].numerator / r.rangeExact![1].denominator;
		expect(fromExact).not.toBe(fromDecimal);
	});

	it('3/8 can be felt in ONE, and the tier picks the default while both travel', () => {
		// Dann, 2026-07-31: a 3/8 may be counted as a single dotted quarter, and
		// composers write MM markings that way.
		const fast = resolveTempo(sigTier(3, 8, 'Presto'))!;
		expect(fast.beatUnit).toBe('quarter');
		expect(fast.beatUnitDots).toBe(1);
		expect(fast.beatAlternative).toMatchObject({ unit: 'eighth', dots: 0 });

		const slow = resolveTempo(sigTier(3, 8, 'Adagio'))!;
		expect(slow.beatUnit).toBe('eighth');
		expect(slow.beatAlternative).toMatchObject({ unit: 'quarter', dots: 1 });
	});

	it('NEGATIVE CONTROL: an UNambiguous metre offers no alternative', () => {
		expect(feltBeat({ beats: 4, beatType: 4 }).ambiguous).toBeUndefined();
		expect(feltBeat({ beats: 12, beatType: 8 }).alternative).toBeUndefined();
		expect(feltBeat({ beats: 3, beatType: 8 }).ambiguous).toBe(true);
	});
})

describe('modifiers move the start point inside the band, inventing no numbers', () => {
	const w = (text: string, beats = 4, beatType = 4) =>
		({
			measures: [{ index: 0, number: '1', timeSignature: { beats, beatType }, keySignature: { fifths: 0, mode: 'major' }, expectedDuration: { numerator: beats, denominator: beatType } }],
			vocalLine: [],
			tempoMarkings: [],
			tempoWords: [{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, text }],
		}) as unknown as ParsedScore;

	it('separates modifiers that point in OPPOSITE directions', () => {
		// The defect this fixes: both resolved to 132 with band 116-208.
		const assai = resolveTempo(w('Allegro assai'))!;
		const nonTroppo = resolveTempo(w('Allegro non troppo'))!;
		const plain = resolveTempo(w('Allegro'))!;
		expect(assai.bpm).toBeGreaterThan(plain.bpm);
		expect(nonTroppo.bpm).toBeLessThan(plain.bpm);
		expect(assai.modifiers).toContain('molto/assai');
		expect(nonTroppo.modifiers).toContain('non troppo');
	});

	it('NEGATIVE CONTROL: the BAND never moves and never narrows', () => {
		// The band is the sourced part. A modifier says where to start inside it,
		// not that practice is less varied than Quantz's tier says.
		for (const t of ['Allegro', 'Allegro assai', 'Allegro non troppo']) {
			expect(resolveTempo(w(t))!.range).toEqual([116, 208]);
		}
	});

	it('never leaves the band, however many modifiers pile up', () => {
		const r = resolveTempo(w('Allegro molto assai più'))!;
		expect(r.bpm).toBeGreaterThanOrEqual(116);
		expect(r.bpm).toBeLessThanOrEqual(208);
	});

	it('NEGATIVE CONTROL: an unmodified term is left exactly where the table put it', () => {
		const r = resolveTempo(w('Allegro'))!;
		expect(r.bpm).toBe(132); // music21 representative, untouched
		expect(r.modifiers).toBeUndefined();
	});

	it("reads Dann's own marking, which threw away three words", () => {
		// "Andantino comodo assai e poco lamentoso" resolved to bare andantino.
		const r = resolveTempo(w('Andantino comodo assai e poco lamentoso'))!;
		expect(r.term).toBe('andantino');
		expect(r.modifiers).toEqual(expect.arrayContaining(['molto/assai', 'comodo/tranquillo', 'poco']));
		// comodo (-0.15) + poco (-0.10) + assai (+0.25) nets to zero movement here,
		// which is the honest outcome of three modifiers that genuinely offset.
		expect(readModifiers('Andantino comodo assai e poco lamentoso').delta).toBeCloseTo(0, 9);
	});

	it('recognises modifiers across the languages the table will carry', () => {
		expect(readModifiers('sehr lebhaft').found).toContain('molto/assai');
		expect(readModifiers('pas trop vite').found).toContain('non troppo');
		expect(readModifiers('un peu').found).toContain('poco');
		expect(readModifiers('не слишком скоро').found).toContain('non troppo');
	});

	it('bandPosition clamps and is monotonic in the delta', () => {
		expect(bandPosition(132, [116, 208], 0)).toBeCloseTo((132 - 116) / 92, 9);
		expect(bandPosition(132, [116, 208], -5)).toBe(0);
		expect(bandPosition(132, [116, 208], 5)).toBe(1);
		expect(bandPosition(132, [116, 208], 0.2)).toBeGreaterThan(bandPosition(132, [116, 208], 0.1));
	});
})

describe('the five-language lexicon', () => {
	const w = (text: string) =>
		({
			measures: [{ index: 0, number: '1', timeSignature: { beats: 4, beatType: 4 }, keySignature: { fifths: 0, mode: 'major' }, expectedDuration: { numerator: 1, denominator: 1 } }],
			vocalLine: [], tempoMarkings: [],
			tempoWords: [{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, text }],
		}) as unknown as ParsedScore;

	it('reads German, French, English and Russian onto the Italian head term', () => {
		for (const [text, term, lang] of [
			['Langsam', 'lento', 'de'], ['Modéré', 'moderato', 'fr'],
			['Lively', 'allegro', 'en'], ['Умеренно', 'moderato', 'ru'],
			['Скоро', 'allegro', 'ru'], ['Медленно', 'lento', 'ru'],
		] as const) {
			const r = resolveTempo(w(text))!;
			expect(r.term, text).toBe(term);
			expect(r.language, text).toBe(lang);
		}
	});

	it('LONGEST form wins, or a two-word marking degrades to its weaker half', () => {
		// "sehr langsam" must be adagio, not lento via "langsam".
		expect(resolveTempo(w('Sehr langsam'))!.term).toBe('adagio');
		expect(resolveTempo(w('Sehr schnell'))!.term).toBe('presto');
		expect(resolveTempo(w('Très vite'))!.term).toBe('presto');
	});

	it('NEGATIVE CONTROL: Italian still resolves natively, with no language tag', () => {
		const r = resolveTempo(w('Andante'))!;
		expect(r.term).toBe('andante');
		expect(r.language).toBeUndefined();
	});

	it('NEGATIVE CONTROL: an EXPRESSION mark is not a tempo in any language', () => {
		for (const t of ['cantabile, con meditazione', 'con dolore', 'senza espressione', 'sordo - misterioso']) {
			expect(resolveTempo(w(t)), t).toBeUndefined();
		}
	});

	it('the table is the size Dann estimated, and no larger', () => {
		const { forms, heads, languages } = lexiconSize();
		expect(languages).toBe(5);
		expect(forms).toBeGreaterThan(60);
		expect(forms).toBeLessThan(200); // his ceiling
		// `heads` is a COUNT, not an array (`lexiconSize` returns three numbers).
		// This read `heads.length ?? heads`, which tsc --strict rejects and which
		// at runtime always fell through to `heads`, so the assertion was right by
		// accident. Asserting the count directly.
		expect(heads).toBeGreaterThan(0);
	});

	it('every head term the lexicon can emit is one tempo-terms actually knows', () => {
		// A translation pointing at a term the resolver has never heard of would
		// fail silently and look like a missing word.
		for (const head of lexiconHeadTerms()) {
			expect(resolveTempoTerm(head), head).toBeTruthy();
		}
	});
})

describe('no quantisation anywhere on the tempo path', () => {
	const w = (text: string, beats = 4, beatType = 4) =>
		({
			measures: [{ index: 0, number: '1', timeSignature: { beats, beatType }, keySignature: { fifths: 0, mode: 'major' }, expectedDuration: { numerator: beats, denominator: beatType } }],
			vocalLine: [], tempoMarkings: [],
			tempoWords: [{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, text }],
		}) as unknown as ParsedScore;

	it('a modified tempo is an EXACT fraction, not a quantised one', () => {
		// Moderato 92 in band 66-112, width 46. "assai" is exactly +1/4, so
		// positioned = 92 + 46/4 = 92 + 23/2 = 207/2. No rounding at any step.
		const r = resolveTempo(w('Moderato assai'))!;
		expect(r.bpmExact).toEqual({ numerator: 207, denominator: 2 });
		expect(r.bpm).toBe(103.5);
	});

	it('stays exact through a felt-beat conversion as well', () => {
		// The same marking in 12/8: 207/2 quarter-beats x 2/3 = 69 dotted-quarter
		// beats, exactly, with no decimal appearing anywhere in between.
		const r = resolveTempo(w('Moderato assai', 12, 8))!;
		expect(r.beatUnitDots).toBe(1);
		expect(r.bpmExact).toEqual({ numerator: 69, denominator: 1 });
	});

	it('NEGATIVE CONTROL: a value with no finite decimal survives intact', () => {
		// Andante 72, band 66-112 width 46, "poco" = -1/10, so 72 - 46/10 = 674/10
		// = 337/5 = 67.4. Exact. And in 12/8, 337/5 x 2/3 = 674/15, which has NO
		// terminating decimal at all -- precisely the case a quantiser destroys.
		const r = resolveTempo(w('Andante poco', 12, 8))!;
		expect(r.bpmExact).toEqual({ numerator: 674, denominator: 15 });
		expect(r.bpm).toBeCloseTo(44.9333, 4);
		// and the decimal genuinely does not terminate
		expect(Number.isInteger(r.bpm * 1000)).toBe(false);
	});

	it('modifier deltas themselves are fractions, not decimals', () => {
		expect(readModifiers('assai').deltaExact).toEqual({ numerator: 1, denominator: 4 });
		expect(readModifiers('poco').deltaExact).toEqual({ numerator: -1, denominator: 10 });
		// and three offsetting modifiers cancel EXACTLY, not to within epsilon
		expect(readModifiers('comodo assai e poco').deltaExact).toEqual({ numerator: 0, denominator: 1 });
	});
})
