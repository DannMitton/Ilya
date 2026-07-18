/**
 * Watch-list generator tests (design C; §7.2 tiers, §A.117 sustain, §A.126
 * passaggio edge, §A.135 density-within-tier, §7.4 cap).
 *
 * The generator is fed REAL overlay output: each test builds a minimal
 * `ParsedScore` plus a `VoiceProfileSnapshot`, runs the unchanged
 * `analyzeScore`, and asserts what `buildWatchList` makes of it. So the tiers
 * are pinned against the same populated events the app produces, not a
 * hand-faked overlay.
 */

import { describe, expect, it } from 'vitest';
import {
	analyzeScore,
	type Measure,
	type ParsedScore,
	type Pitch,
	type SyllableInfo,
	type TempoMarking,
	type VocalLineEvent,
	type VoiceProfileSnapshot,
	type VowelResolver
} from '@ilya/score-parser';
import { WATCH_HEADER, buildWatchList, watchEntryLine, watchOverflowLine } from './watchlist';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
type SylType = SyllableInfo['type'];

interface NoteOpts {
	pitch: Pitch;
	measureIndex?: number;
	duration?: VocalLineEvent['duration'];
	fermata?: boolean;
	syllable?: { text: string; type: SylType };
}

function note(id: string, opts: NoteOpts): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex: opts.measureIndex ?? 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: opts.duration ?? { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
		pitch: opts.pitch,
		...(opts.fermata ? { fermata: {} } : {}),
		...(opts.syllable
			? {
					syllable: {
						id: `s-${id}`,
						text: opts.syllable.text,
						type: opts.syllable.type,
						verseNumber: 1,
						wordContext: opts.syllable.text
					}
				}
			: {})
	};
}

function scoreOf(
	events: VocalLineEvent[],
	extra: { measures?: Measure[]; tempoMarkings?: TempoMarking[] } = {}
): ParsedScore {
	return {
		source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures: extra.measures ?? [],
		keySignatures: [],
		timeSignatures: [],
		tempoMarkings: extra.tempoMarkings ?? [],
		vocalLine: events
	};
}

/** Stub resolver: the operative vowel per event id (Ilya's seam in the app). */
function resolverOf(vowels: Record<string, string>): VowelResolver {
	return (ev) => vowels[ev.id];
}

const WIDE_RANGE = { lowest: P('C', 3), highest: P('C', 7) };
const WIDE_TESS = { low: P('C', 4), high: P('C', 6) };

function analyze(parsed: ParsedScore, snapshot: VoiceProfileSnapshot, vowels: Record<string, string>) {
	return analyzeScore(parsed, snapshot, resolverOf(vowels), {
		generatedAt: '2020-01-01T00:00:00.000Z'
	});
}

describe('buildWatchList — tiers', () => {
	it('tier 1: a note above the given range flags out-of-range', () => {
		const parsed = scoreOf([note('n1', { pitch: P('C', 6) })]);
		const snap: VoiceProfileSnapshot = {
			fR1: { a: 700 },
			range: { lowest: P('C', 4), highest: P('C', 5) },
			tessitura: { low: P('C', 4), high: P('C', 5) }
		};
		const wl = buildWatchList(parsed, analyze(parsed, snap, { n1: 'a' }));
		expect(wl.entries).toHaveLength(1);
		expect(wl.entries[0]).toMatchObject({ eventId: 'n1', tier: 1, kinds: ['range'], rangeDirection: 'above' });
		expect(watchEntryLine(wl.entries[0])).toContain('rises above');
	});

	it('tier 1: a note below the given range flags below, with its own copy', () => {
		const parsed = scoreOf([note('n1', { pitch: P('C', 3) })]);
		const snap: VoiceProfileSnapshot = {
			fR1: { a: 700 },
			range: { lowest: P('C', 4), highest: P('C', 5) },
			tessitura: { low: P('C', 4), high: P('C', 5) }
		};
		const wl = buildWatchList(parsed, analyze(parsed, snap, { n1: 'a' }));
		expect(wl.entries).toHaveLength(1);
		expect(wl.entries[0]).toMatchObject({ tier: 1, kinds: ['range'], rangeDirection: 'below' });
		expect(watchEntryLine(wl.entries[0])).toBe(
			'Bar 1 drops below the range you gave; you may want a transposition.'
		);
	});

	it('tier 2: the fundamental on the first resonance flags a crossing', () => {
		const parsed = scoreOf([note('n1', { pitch: P('A', 4) })]); // A4 = 440 Hz
		const snap: VoiceProfileSnapshot = { fR1: { i: 440 }, range: WIDE_RANGE, tessitura: WIDE_TESS };
		const wl = buildWatchList(parsed, analyze(parsed, snap, { n1: 'i' }));
		expect(wl.entries).toHaveLength(1);
		expect(wl.entries[0]).toMatchObject({ tier: 2, kinds: ['crossing'], vowel: 'i' });
	});

	it('tier 3: flags within ±1 semitone of a declared edge, leaves the interior quiet', () => {
		const parsed = scoreOf([
			note('edge', { pitch: P('E', 4) }), // on the primo
			note('interior', { pitch: P('F', 4, 1) }) // F#4, a whole tone above primo, ~a min-3 below secondo
		]);
		const snap: VoiceProfileSnapshot = {
			fR1: { o: 1500 }, // far from any of these pitches: isolates the passaggio tier
			range: WIDE_RANGE,
			tessitura: WIDE_TESS,
			passaggio: { primo: P('E', 4), secondo: P('A', 4) }
		};
		const wl = buildWatchList(parsed, analyze(parsed, snap, { edge: 'o', interior: 'o' }));
		expect(wl.entries).toHaveLength(1);
		expect(wl.entries[0]).toMatchObject({ eventId: 'edge', tier: 3, kinds: ['passaggio'] });
	});

	it('tier 3: nothing flags when the singer declared no passaggio', () => {
		const parsed = scoreOf([note('edge', { pitch: P('E', 4) })]);
		const snap: VoiceProfileSnapshot = { fR1: { o: 1500 }, range: WIDE_RANGE, tessitura: WIDE_TESS };
		const wl = buildWatchList(parsed, analyze(parsed, snap, { edge: 'o' }));
		expect(wl.entries).toHaveLength(0);
	});

	it('tier 4: a timbre flip between syllables of one word flags the word', () => {
		const parsed = scoreOf([
			note('n1', { pitch: P('C', 4), syllable: { text: 'ла', type: 'start' } }), // 261 Hz < 350 → open
			note('n2', { pitch: P('A', 4), syllable: { text: 'ва', type: 'end' } }) // 440 Hz > 350 → close
		]);
		const snap: VoiceProfileSnapshot = { fR1: { a: 700 }, range: WIDE_RANGE, tessitura: WIDE_TESS }; // turn @ 350 Hz
		const wl = buildWatchList(parsed, analyze(parsed, snap, { n1: 'a', n2: 'a' }));
		expect(wl.entries).toHaveLength(1);
		expect(wl.entries[0]).toMatchObject({
			eventId: 'n2',
			tier: 4,
			kinds: ['timbre'],
			word: 'лава',
			timbreDirection: 'open-to-close'
		});
	});

	it('tier 5: a fermata on the turning pitch flags a sustain', () => {
		const parsed = scoreOf([note('n1', { pitch: P('F', 4), fermata: true })]); // F4 = the turn for fR1 700
		const snap: VoiceProfileSnapshot = { fR1: { a: 700 }, range: WIDE_RANGE, tessitura: WIDE_TESS };
		const wl = buildWatchList(parsed, analyze(parsed, snap, { n1: 'a' }));
		expect(wl.entries).toHaveLength(1);
		expect(wl.entries[0]).toMatchObject({ tier: 5, kinds: ['sustain'] });
	});

	it('tier 5: a long note by tempo flags; a short one on the same pitch does not', () => {
		const tempoMarkings: TempoMarking[] = [
			{ measureIndex: 0, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, bpm: 60, beatUnit: 'quarter', beatUnitDots: 0 }
		];
		const longNote = note('long', {
			pitch: P('F', 4),
			duration: { base: 'whole', dots: 0, fraction: { numerator: 1, denominator: 1 } } // 4 beats @ 60 = 4 s
		});
		const shortNote = note('short', {
			pitch: P('F', 4),
			measureIndex: 1,
			duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } } // 1 s
		});
		const parsed = scoreOf([longNote, shortNote], { tempoMarkings });
		const snap: VoiceProfileSnapshot = { fR1: { a: 700 }, range: WIDE_RANGE, tessitura: WIDE_TESS };
		const wl = buildWatchList(parsed, analyze(parsed, snap, { long: 'a', short: 'a' }));
		expect(wl.entries).toHaveLength(1);
		expect(wl.entries[0].eventId).toBe('long');
	});

	it('zero challenge: a comfortable note lists nothing', () => {
		const parsed = scoreOf([note('n1', { pitch: P('E', 4) })]);
		const snap: VoiceProfileSnapshot = { fR1: { a: 700 }, range: WIDE_RANGE, tessitura: WIDE_TESS };
		const wl = buildWatchList(parsed, analyze(parsed, snap, { n1: 'a' }));
		expect(wl.entries).toHaveLength(0);
		expect(wl.overflowCount).toBe(0);
	});
});

describe('buildWatchList — sort and cap', () => {
	it('within a tier, the more acute (higher, lower d) note sorts first', () => {
		const parsed = scoreOf([
			note('nC6', { pitch: P('C', 6) }),
			note('nC7', { pitch: P('C', 7) })
		]);
		const snap: VoiceProfileSnapshot = {
			fR1: { a: 700 },
			range: { lowest: P('C', 4), highest: P('G', 4) }, // both notes out-of-range
			tessitura: { low: P('C', 4), high: P('G', 4) }
		};
		const wl = buildWatchList(parsed, analyze(parsed, snap, { nC6: 'a', nC7: 'a' }));
		expect(wl.entries.map((e) => e.eventId)).toEqual(['nC7', 'nC6']);
		expect(wl.entries[0].density).toBeLessThan(wl.entries[1].density);
	});

	it('hard tiers sort ahead of soft; soft tiers cap at 2 with an honest overflow', () => {
		const parsed = scoreOf([
			note('nRange', { pitch: P('C', 6) }), // tier 1
			note('nCross', { pitch: P('A', 4) }), // tier 2
			note('sus1', { pitch: P('F', 4), measureIndex: 1, fermata: true }), // tier 5
			note('sus2', { pitch: P('F', 4), measureIndex: 2, fermata: true }), // tier 5
			note('sus3', { pitch: P('F', 4), measureIndex: 3, fermata: true }) // tier 5
		]);
		const snap: VoiceProfileSnapshot = {
			fR1: { i: 440, a: 700 },
			range: { lowest: P('C', 4), highest: P('B', 4) },
			tessitura: { low: P('C', 4), high: P('B', 4) }
		};
		const vowels = { nRange: 'a', nCross: 'i', sus1: 'a', sus2: 'a', sus3: 'a' };
		const wl = buildWatchList(parsed, analyze(parsed, snap, vowels));
		expect(wl.entries.map((e) => e.tier)).toEqual([1, 2, 5, 5]);
		expect(wl.entries[0].eventId).toBe('nRange');
		expect(wl.entries[1].eventId).toBe('nCross');
		expect(wl.overflowCount).toBe(1);
	});

	it('reads the bar from the measure number, not measureIndex + 1', () => {
		const measures: Measure[] = [
			{
				index: 0,
				number: '7',
				timeSignature: { beats: 4, beatType: 4 },
				keySignature: { fifths: 0 },
				clef: { sign: 'G', line: 2 },
				expectedDuration: { numerator: 1, denominator: 1 }
			}
		];
		const parsed = scoreOf([note('n1', { pitch: P('C', 6) })], { measures });
		const snap: VoiceProfileSnapshot = {
			fR1: { a: 700 },
			range: { lowest: P('C', 4), highest: P('C', 5) },
			tessitura: { low: P('C', 4), high: P('C', 5) }
		};
		const wl = buildWatchList(parsed, analyze(parsed, snap, { n1: 'a' }));
		expect(wl.entries[0].bar).toBe('7');
	});
});

describe('watch-list copy', () => {
	it('renders each tier with the ruled voice, leading with the bar', () => {
		expect(WATCH_HEADER).toBe('Places to watch');
		expect(
			watchEntryLine({ eventId: 'e', tier: 1, kinds: ['range'], bar: '12', vowel: 'a', density: 1 })
		).toBe('Bar 12 rises above the range you gave; you may want a transposition.');
		expect(
			watchEntryLine({ eventId: 'e', tier: 2, kinds: ['crossing'], bar: '9', vowel: 'i', density: 1 })
		).toBe('Bar 9: your /i/ sits on your first resonance, so the vowel may lock or whistle.');
		expect(
			watchEntryLine({ eventId: 'e', tier: 3, kinds: ['passaggio'], bar: '4', vowel: 'a', word: 'край', density: 1 })
		).toBe("Bar 4: 'край' falls near your passaggio; expect the turn to want managing.");
		expect(
			watchEntryLine({
				eventId: 'e',
				tier: 4,
				kinds: ['timbre'],
				bar: '7',
				vowel: 'a',
				word: 'слава',
				timbreDirection: 'open-to-close',
				density: 1
			})
		).toBe("Bar 7: your /a/ on 'слава' turns open to close inside the word, so the colour shifts as you sing it.");
	});

	it('names the most severe kind when a note stacks several', () => {
		const line = watchEntryLine({
			eventId: 'e',
			tier: 1,
			kinds: ['range', 'crossing'],
			bar: '3',
			vowel: 'a',
			density: 1
		});
		expect(line).toContain('rises above the range you gave');
	});

	it('overflow line matches the ruled shape', () => {
		expect(watchOverflowLine(2)).toBe('and 2 more places to watch');
	});
});
