/**
 * Watch-list generator tests (design C; §7.2 tiers, §A.117 sustain, §A.126
 * passaggio edge, §A.135 density-within-tier, show-all list).
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
import { t } from '$lib/i18n';
import { buildWatchList, watchBandLines, watchEntryLine, type WatchEntry, type WatchOpener } from './watchlist';
import { resolveAdvice } from './advice-resolver';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
/** The English line, with the advice's opener (1 unless given). */
const en = (e: WatchEntry, opener?: WatchOpener) => watchEntryLine(e, 'en', opener);
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
		expect(en(wl.entries[0])).toContain('rises above');
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
		// No transposition input supplied → the fact alone (§A.150 fallback).
		expect(en(wl.entries[0])).toBe('Bar 1 drops below the range you gave.');
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
	});
});

describe('buildWatchList — sort and show-all', () => {
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

	it('shows every entry, hard tiers sorted ahead of soft (no cap)', () => {
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
		expect(wl.entries.map((e) => e.tier)).toEqual([1, 2, 5, 5, 5]);
		expect(wl.entries[0].eventId).toBe('nRange');
		expect(wl.entries[1].eventId).toBe('nCross');
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
		expect(t('watch.header', 'en')).toBe('For your consideration');
		expect(
			en({ eventId: 'e', tier: 1, kinds: ['range'], bar: '12', vowel: 'a', density: 1 })
		).toBe('Bar 12 rises above the range you gave.');
		expect(
			en({ eventId: 'e', tier: 2, kinds: ['crossing'], bar: '9', vowel: 'i', density: 1 })
		).toBe(
			'Bar 9: your [i] meets your first resonance here, so the tone will want to turn full and heady, toward a whoop.'
		);
		expect(
			en({ eventId: 'e', tier: 3, kinds: ['passaggio'], bar: '4', vowel: 'a', word: 'край', density: 1 })
		).toBe("Bar 4: 'край' falls near your passaggio; expect the turn to want managing.");
		expect(
			en({
				eventId: 'e',
				tier: 4,
				kinds: ['timbre'],
				bar: '7',
				vowel: 'a',
				word: 'слава',
				timbreDirection: 'open-to-close',
				density: 1
			})
		).toBe("Bar 7: your [a] on 'слава' turns open to close inside the word, so the colour shifts as you sing it.");
	});

	it('names the most severe kind when a note stacks several', () => {
		const line = en({
			eventId: 'e',
			tier: 1,
			kinds: ['range', 'crossing'],
			bar: '3',
			vowel: 'a',
			density: 1
		});
		expect(line).toContain('rises above the range you gave');
	});

	it('renders the closed sustain line ("pitch of turning", "sustain")', () => {
		expect(
			en({ eventId: 'e', tier: 5, kinds: ['sustain'], bar: '5', vowel: 'o', density: 1 })
		).toBe(
			'Bar 5: the longer [o] here sits on its pitch of turning, so the colour may feel unsteady as you sustain it.'
		);
	});

	it('appends resolved advice to the crossing line, space-joined (§A.168/§A.169)', () => {
		expect(
			en({
				eventId: 'e',
				tier: 2,
				kinds: ['crossing'],
				bar: '37',
				vowel: 'i',
				advice: { action: 'iCrossing', target: 'ɪ' },
				density: 1
			})
		).toBe(
			'Bar 37: your [i] meets your first resonance here, so the tone will want to turn full and heady, toward a whoop. Consider relaxing the jaw and leaning the vowel toward [ɪ], giving it a touch more space, which can lift your first resonance clear of the pitch.'
		);
	});

	it('renders the crossing line alone when no advice resolved (additive dial, ruling B)', () => {
		expect(
			en({ eventId: 'e', tier: 2, kinds: ['crossing'], bar: '9', vowel: 'e', density: 1 })
		).toBe(
			'Bar 9: your [e] meets your first resonance here, so the tone will want to turn full and heady, toward a whoop.'
		);
	});
});

describe('buildWatchList — adaptive dial (§A.149)', () => {
	it('shows rare markup-visible marks but hides routine ones (provisional threshold)', () => {
		// Each A4 on /i/ (fR1 440) is a crossing. At or below the provisional
		// rarity ceiling they surface; above it they recede to the staff mark.
		// Couples to RARE_KIND_MAX_NOTES; revisit when Dann calibrates it.
		const snap: VoiceProfileSnapshot = { fR1: { i: 440 }, range: WIDE_RANGE, tessitura: WIDE_TESS };
		const three = [0, 1, 2].map((i) => note(`c${i}`, { pitch: P('A', 4), measureIndex: i }));
		const four = [0, 1, 2, 3].map((i) => note(`c${i}`, { pitch: P('A', 4), measureIndex: i }));
		const p3 = scoreOf(three);
		const p4 = scoreOf(four);
		expect(buildWatchList(p3, analyze(p3, snap, { c0: 'i', c1: 'i', c2: 'i' })).entries).toHaveLength(3);
		expect(
			buildWatchList(p4, analyze(p4, snap, { c0: 'i', c1: 'i', c2: 'i', c3: 'i' })).entries
		).toHaveLength(0);
	});

	it('an exposed [i] crossing always surfaces, even when routine crossings recede (H2 refinement)', () => {
		// fR1 440 → A4 is a crossing; ceiling A4 → an A4 [i] sits at the ceiling.
		// Four crossings (above the rarity ceiling) so routine ones recede; the one
		// with a fermata is also sustained-at-ceiling (exposed) and must stay.
		const events = [
			note('c0', { pitch: P('A', 4) }),
			note('c1', { pitch: P('A', 4), measureIndex: 1 }),
			note('c2', { pitch: P('A', 4), measureIndex: 2 }),
			note('exposed', { pitch: P('A', 4), measureIndex: 3, fermata: true })
		];
		const parsed = scoreOf(events);
		const snap: VoiceProfileSnapshot = {
			fR1: { i: 440 },
			range: { lowest: P('C', 3), highest: P('A', 4) },
			tessitura: { low: P('C', 4), high: P('A', 4) }
		};
		const analyzed = resolveAdvice(analyze(parsed, snap, { c0: 'i', c1: 'i', c2: 'i', exposed: 'i' }));
		expect(analyzed.events.exposed.sustainedCeilingExposure).toBe(true);
		expect(analyzed.events.c0.sustainedCeilingExposure).toBe(false);
		const wl = buildWatchList(parsed, analyzed);
		expect(wl.entries).toHaveLength(1);
		expect(wl.entries[0].eventId).toBe('exposed');
		expect(wl.entries[0].kinds).toEqual(['crossing']); // still a crossing, not tracking
	});
});

describe('buildWatchList — transposition wiring (§A.151)', () => {
	const snap: VoiceProfileSnapshot = {
		fR1: { a: 600 },
		range: { lowest: P('C', 3), highest: P('C', 5) },
		tessitura: { low: P('C', 3), high: P('C', 5) }
	};
	const resolver = resolverOf({ n1: 'a' });
	// E5 (76) sits above the C5 ceiling; down a major third resolves it to C5.
	const outOfRange = (mode?: 'major' | 'minor'): ParsedScore => ({
		...scoreOf([note('n1', { pitch: P('E', 5) })]),
		keySignatures: [{ measureIndex: 0, signature: { fifths: 0, ...(mode ? { mode } : {}) } }]
	});

	it('fills the range line with a named key when the score declares a mode', () => {
		const parsed = outOfRange('major'); // C major
		const analyzed = analyze(parsed, snap, { n1: 'a' });
		const wl = buildWatchList(parsed, analyzed, 1, { analysisScore: parsed, profile: snap, resolver });
		expect(wl.entries[0].kinds).toContain('range');
		// C major down a major third (E5 → C5) is A flat major.
		expect(en(wl.entries[0])).toContain('you may want to transpose to A flat major');
	});

	it('falls back to an interval when the score declares no mode', () => {
		const parsed = outOfRange(); // fifths, no mode
		const analyzed = analyze(parsed, snap, { n1: 'a' });
		const wl = buildWatchList(parsed, analyzed, 1, { analysisScore: parsed, profile: snap, resolver });
		expect(en(wl.entries[0])).toContain('you may want to transpose down a major third');
	});

	it('names the fact alone when no transposition input is supplied', () => {
		const parsed = outOfRange('major');
		const analyzed = analyze(parsed, snap, { n1: 'a' });
		const wl = buildWatchList(parsed, analyzed, 1);
		expect(en(wl.entries[0])).toBe('Bar 1 rises above the range you gave.');
	});
});

describe('buildWatchList: the [o]→[ɑ] cover (clause 3, §A.185)', () => {
	it('renders the cover hazard line with the advice appended', () => {
		expect(
			en({
				eventId: 'e',
				tier: 2,
				kinds: ['cover'],
				bar: '70',
				vowel: 'o',
				advice: { action: 'oCover', target: 'ɑ' },
				density: 1
			})
		).toBe(
			'Bar 70: the [o] at the top of your range and sustained here is an exposed spot where the vowel can tighten. Consider allowing the vowel to open and darken toward [ɑ]; that can be a more comfortable option than a close [o] this high.'
		);
	});

	it('always earns a line: a sustained close [o] at the ceiling, advice appended', () => {
		const parsed = scoreOf([note('n1', { pitch: P('E', 4), fermata: true })]);
		const snap: VoiceProfileSnapshot = {
			fR1: { o: 489 },
			range: { lowest: P('C', 2), highest: P('E', 4) },
			tessitura: { low: P('C', 3), high: P('C', 4) }
		};
		const analyzed = resolveAdvice(analyze(parsed, snap, { n1: 'o' }));
		expect(analyzed.events.n1.sustainedCeilingExposure).toBe(true);
		const wl = buildWatchList(parsed, analyzed);
		expect(wl.entries).toHaveLength(1);
		expect(wl.entries[0]).toMatchObject({ eventId: 'n1', kinds: ['cover'] });
		expect(en(wl.entries[0])).toContain('open and darken toward [ɑ]');
	});
});

describe('buildWatchList: the exposed active-open (tracking) hazard (H2)', () => {
	it('renders the tracking hazard line with the articulatory advice appended', () => {
		expect(
			en({
				eventId: 'e',
				tier: 2,
				kinds: ['tracking'],
				bar: '52',
				vowel: 'e',
				advice: { action: 'openTracking' },
				density: 1
			})
		).toBe(
			'Bar 52: the [e] at the top of your range and sustained here is an exposed spot where the vowel can tighten. Consider letting the jaw drop to open the vowel here, raising your first resonance to the pitch; that can ease the sound rather than keeping a close [e] squeezed this high.'
		);
	});

	it('always earns a line: a sustained close [e] carried above its fR1 routes to tracking, advice appended', () => {
		// Whoop side (§A.190): A5 (880 Hz) is above fR1 440, so aboveFirstResonance
		// holds and the tracking case (not the turnover case) fires.
		const parsed = scoreOf([note('n1', { pitch: P('A', 5), fermata: true })]);
		const snap: VoiceProfileSnapshot = {
			fR1: { e: 440 },
			range: { lowest: P('C', 3), highest: P('A', 5) },
			tessitura: { low: P('C', 4), high: P('C', 5) }
		};
		const analyzed = resolveAdvice(analyze(parsed, snap, { n1: 'e' }));
		expect(analyzed.events.n1.sustainedCeilingExposure).toBe(true);
		expect(analyzed.events.n1.aboveFirstResonance).toBe(true);
		const wl = buildWatchList(parsed, analyzed);
		expect(wl.entries).toHaveLength(1);
		expect(wl.entries[0]).toMatchObject({ eventId: 'n1', tier: 2, kinds: ['tracking'] });
		expect(en(wl.entries[0])).toContain('raising your first resonance to the pitch');
	});

	it('routes an exposed [o] to the cover, not tracking (the vowel split)', () => {
		const parsed = scoreOf([note('n1', { pitch: P('E', 4), fermata: true })]);
		const snap: VoiceProfileSnapshot = {
			fR1: { o: 489 },
			range: { lowest: P('C', 2), highest: P('E', 4) },
			tessitura: { low: P('C', 3), high: P('C', 4) }
		};
		const analyzed = resolveAdvice(analyze(parsed, snap, { n1: 'o' }));
		const wl = buildWatchList(parsed, analyzed);
		expect(wl.entries[0].kinds).toEqual(['cover']);
	});
});

describe('buildWatchList: the male turnover hazard, turned side (§A.190)', () => {
	it('renders the turnover hazard line with the articulatory advice appended', () => {
		expect(
			en({
				eventId: 'e',
				tier: 2,
				kinds: ['turnover'],
				bar: '52',
				vowel: 'e',
				advice: { action: 'maleTurnover' },
				density: 1
			})
		).toBe(
			'Bar 52: the [e] at the top of your range and sustained here is an exposed spot where the tone can spread or press. Consider letting the [e] turn and gather here rather than spreading it open for more sound; up this high the ring tends to come from letting it settle, not from pushing it wider.'
		);
	});

	it('always earns a line: a sustained close [e] below its fR1 routes to turnover, advice appended', () => {
		// Turned side (§A.190): E4 (330 Hz) is below fR1 489, so aboveFirstResonance
		// is false and the male turnover case (not tracking) fires. This is the very
		// fixture the tracking routing used before the guard.
		const parsed = scoreOf([note('n1', { pitch: P('E', 4), fermata: true })]);
		const snap: VoiceProfileSnapshot = {
			fR1: { e: 489 },
			range: { lowest: P('C', 2), highest: P('E', 4) },
			tessitura: { low: P('C', 3), high: P('C', 4) }
		};
		const analyzed = resolveAdvice(analyze(parsed, snap, { n1: 'e' }));
		expect(analyzed.events.n1.sustainedCeilingExposure).toBe(true);
		expect(analyzed.events.n1.aboveFirstResonance).toBe(false);
		const wl = buildWatchList(parsed, analyzed);
		expect(wl.entries).toHaveLength(1);
		expect(wl.entries[0]).toMatchObject({ eventId: 'n1', tier: 2, kinds: ['turnover'] });
		expect(en(wl.entries[0])).toContain('turn and gather');
	});
});

describe('buildWatchList: the [ɔ] crossing advice (H1)', () => {
	it('surfaces an exposed [ɔ] crossing with its whoop advice appended', () => {
		const parsed = scoreOf([note('n1', { pitch: P('A', 4), fermata: true })]);
		const snap: VoiceProfileSnapshot = {
			fR1: { 'ɔ': 440 },
			range: { lowest: P('C', 3), highest: P('A', 4) },
			tessitura: { low: P('C', 4), high: P('A', 4) }
		};
		const analyzed = resolveAdvice(analyze(parsed, snap, { n1: 'ɔ' }));
		expect(analyzed.events.n1.crossing).toBe(true);
		const wl = buildWatchList(parsed, analyzed);
		expect(wl.entries).toHaveLength(1);
		expect(wl.entries[0].kinds).toEqual(['crossing']);
		const line = en(wl.entries[0]);
		expect(line).toContain('toward a whoop'); // the descriptive crossing line
		expect(line).toContain('can settle the tone rather than straining'); // the H1 advice appended
	});
});

describe('watch-band copy in French (N.82, ruled 2026-09-28)', () => {
	const fr = (e: WatchEntry, opener?: WatchOpener) => watchEntryLine(e, 'fr', opener);
	const base = { eventId: 'e', density: 1 } as const;

	it('reads the ratified French lines, IPA in square brackets', () => {
		expect(t('watch.header', 'fr')).toBe('À considérer');
		expect(fr({ ...base, tier: 1, kinds: ['range'], bar: '12', vowel: 'a', rangeDirection: 'below' })).toBe(
			'Mesure 12\u00a0: la note descend sous l\u2019ambitus que vous avez indiqué.'
		);
		expect(fr({ ...base, tier: 2, kinds: ['crossing'], bar: '9', vowel: 'i' })).toBe(
			'Mesure 9\u00a0: votre [i] rencontre ici votre première résonance, de sorte que le son voudra devenir plein et de tête, vers le youhou.'
		);
		expect(fr({ ...base, tier: 2, kinds: ['tracking'], bar: '52', vowel: 'e' })).toBe(
			'Mesure 52\u00a0: le [e], au sommet de votre ambitus et prolongé ici, est un endroit exposé où la voyelle peut se resserrer.'
		);
		expect(fr({ ...base, tier: 3, kinds: ['passaggio'], bar: '4', vowel: 'a', word: 'край' })).toBe(
			'Mesure 4\u00a0: «\u00a0край\u00a0» tombe près de votre passaggio\u202f; attendez-vous à devoir gérer le changement de timbre.'
		);
		expect(
			fr({ ...base, tier: 4, kinds: ['timbre'], bar: '7', vowel: 'a', word: 'слава', timbreDirection: 'close-to-open' })
		).toBe(
			'Mesure 7\u00a0: votre [a] sur «\u00a0слава\u00a0» passe de fermé à ouvert à l\u2019intérieur du mot, de sorte que la couleur change pendant que vous le chantez.'
		);
		expect(fr({ ...base, tier: 5, kinds: ['sustain'], bar: '5', vowel: 'o' })).toBe(
			'Mesure 5\u00a0: le [o] plus long, ici, se pose sur sa hauteur de changement de timbre, de sorte que la couleur peut sembler instable pendant qu\u2019il se prolonge.'
		);
	});

	it('names keys in solfège, lowercase, and repeats « en »', () => {
		const range = { ...base, tier: 1 as const, kinds: ['range' as const], bar: '3', vowel: 'a' };
		const keys = { semitones: [-4, -2], keys: [{ fifths: -3, mode: 'major' as const }, { fifths: -5, mode: 'major' as const }] };
		expect(fr({ ...range, transposition: keys })).toBe(
			'Mesure 3\u00a0: la note monte au-dessus de l\u2019ambitus que vous avez indiqué\u202f; vous pouvez songer à transposer en mi bémol majeur ou en ré bémol majeur.'
		);
		expect(en({ ...range, transposition: keys })).toBe(
			'Bar 3 rises above the range you gave; you may want to transpose to E flat major or D flat major.'
		);
		const minor = { semitones: [3], keys: [{ fifths: 6, mode: 'minor' as const }] };
		expect(fr({ ...range, transposition: minor })).toContain('transposer en ré dièse mineur.');
		expect(en({ ...range, transposition: { semitones: [2], keys: [{ fifths: 0, mode: 'major' }] } })).toContain(
			'transpose to C major.'
		);
	});

	it('names intervals, a shared direction said once and mixed directions each named', () => {
		const range = { ...base, tier: 1 as const, kinds: ['range' as const], bar: '3', vowel: 'a' };
		expect(fr({ ...range, transposition: { semitones: [-4, -5] } })).toContain(
			'transposer d\u2019une tierce majeure ou d\u2019une quarte juste vers le bas.'
		);
		expect(en({ ...range, transposition: { semitones: [-4, -5] } })).toContain(
			'transpose down a major third or a perfect fourth.'
		);
		expect(fr({ ...range, transposition: { semitones: [-1, 2] } })).toContain(
			'transposer d\u2019un demi-ton vers le bas ou d\u2019un ton vers le haut.'
		);
		expect(en({ ...range, transposition: { semitones: [-1, 2] } })).toContain('transpose down a semitone or up a whole tone.');
		expect(fr({ ...range, transposition: { semitones: [6] } })).toContain('transposer d\u2019un triton vers le haut.');
	});

	it('leads the advice with an opener and elides « de » before a vowel', () => {
		const e: WatchEntry = { ...base, tier: 2, kinds: ['crossing'], bar: '9', vowel: 'ɔ', advice: { action: 'openOCrossing' } };
		expect(fr(e, 3)).toContain('. Il peut être intéressant d\u2019accepter le changement de timbre');
		expect(fr(e, 2)).toContain('. Vous pouvez songer à accepter');
		expect(fr(e, 4)).toContain('. Une piste à explorer\u00a0: accepter');
		expect(fr({ ...e, vowel: 'i', advice: { action: 'iCrossing', target: 'ɪ' } }, 3)).toContain(
			'. Il peut être intéressant de relâcher la mâchoire et orienter la voyelle vers [ɪ], en lui donnant un peu plus d\u2019espace, ce qui peut dégager votre première résonance de la hauteur chantée.'
		);
	});

	it('reads every English opener with every action', () => {
		for (const action of ['iCrossing', 'openOCrossing', 'oCover', 'openTracking', 'maleTurnover'] as const) {
			for (const opener of [2, 3, 4] as const) {
				const line = en({ ...base, tier: 2, kinds: ['crossing'], bar: '1', vowel: 'e', advice: { action, target: 'ɑ' } }, opener);
				expect(line).not.toContain('[MISSING');
				expect(line).toMatch(/\. (Consider|You can experiment with|One thing to explore is) [a-z]+ing /);
				expect(line.endsWith('.')).toBe(true);
			}
		}
	});

	it('rotates the three openers down the band, with no "try" (Dann, 2026-09-29 22:51)', () => {
		const adv = (id: string): WatchEntry => ({ ...base, eventId: id, tier: 2, kinds: ['crossing'], bar: id, vowel: 'ɔ', advice: { action: 'openOCrossing' } });
		const lines = watchBandLines(
			[adv('1'), { ...base, eventId: 'x', tier: 5, kinds: ['sustain'], bar: '2', vowel: 'o' }, adv('3'), adv('4'), adv('5'), adv('6')],
			'en'
		);
		const leads = lines.filter((l) => l.includes('allowing the turn')).map((l) => l.split('. ')[1].split(' allowing')[0]);
		expect(leads).toEqual(['Consider', 'You can experiment with', 'One thing to explore is', 'Consider', 'You can experiment with']);
		expect(lines.join(' ')).not.toMatch(/\btry\b/i);
		expect(lines[1]).toBe('Bar 2: the longer [o] here sits on its pitch of turning, so the colour may feel unsteady as you sustain it.');
	});
});

describe("the band on Dann's look (2026-09-28)", () => {
	const base = { eventId: 'e', density: 1 } as const;
	it('quotes a word without the punctuation the engraver set against it', () => {
		const e: WatchEntry = { ...base, tier: 1, kinds: ['passaggio'], bar: '12', vowel: 'u', word: 'разлуки,' };
		expect(watchEntryLine(e, 'en')).toContain('разлуки');
		expect(watchEntryLine(e, 'en')).not.toContain('разлуки,');
		expect(watchEntryLine(e, 'fr')).not.toContain('разлуки,');
	});

	it('prints one line where two entries would print the same sentence for the same bar', () => {
		const adv = (id: string, bar: string): WatchEntry => ({ ...base, eventId: id, tier: 2, kinds: ['crossing'], bar, vowel: 'ɔ', advice: { action: 'openOCrossing' } });
		const lines = watchBandLines([adv('a', '7'), adv('b', '7'), adv('c', '8')], 'en');
		expect(lines).toHaveLength(2);
		expect(lines[0].startsWith('Bar 7')).toBe(true);
		expect(lines[1].startsWith('Bar 8')).toBe(true);
	});
});
