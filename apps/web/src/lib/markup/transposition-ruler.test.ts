import { describe, expect, it } from 'vitest';
import type { ParsedScore, Pitch, TranspositionCandidate, VocalLineEvent, VoiceProfileSnapshot } from '@ilya/score-parser';
import {
	bandLine,
	cleanerTwin,
	countLines,
	dimmedStops,
	rulerOpening,
	stopForSuggestion,
	stopId,
	twinCounts,
	isHome,
	isStopOf,
	openingStops,
	pageHeader,
	printedKey,
	readout,
	stopLabel,
	stopsFor,
	type NamedKey,
} from './transposition-ruler';

const D_MAJOR: NamedKey = { fifths: 2, mode: 'major' };
const B_MAJOR = { semitones: -3, fifths: 5 };
const C_FLAT_MAJOR = { semitones: -3, fifths: -7 };

const candidate = (semitones: number, fifths: number): TranspositionCandidate => ({
	semitones,
	intervalName: '',
	outOfRange: 0,
	crossings: 0,
	resolvesRange: true,
	targetKey: '',
	targetKeySignature: { fifths, mode: 'major' },
});

describe('the Transposition ruler, named', () => {
	it('draws the stops of drawing r4 for a song in D major', () => {
		expect(stopsFor(D_MAJOR).map((s) => stopLabel(s, D_MAJOR, 'en'))).toEqual([
			'A♭', 'A', 'B♭', 'B', 'C♭', 'C', 'C♯', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G♭', 'G', 'A♭',
		]);
		expect(stopLabel(C_FLAT_MAJOR, D_MAJOR, 'fr')).toBe('do♭');
	});

	it('reads out the interval and the key, and the recommendation on its stop only', () => {
		expect(readout(B_MAJOR, D_MAJOR, B_MAJOR, 'en')).toBe('Down a minor third · B major · Ilya’s recommendation');
		expect(readout(C_FLAT_MAJOR, D_MAJOR, B_MAJOR, 'en')).toBe('Down a minor third · C flat major');
		expect(readout(B_MAJOR, D_MAJOR, B_MAJOR, 'fr')).toBe('Une tierce mineure plus bas · si majeur · recommandation d’Ilya');
		expect(readout({ semitones: 5, fifths: 1 }, D_MAJOR, null, 'fr')).toBe('Une quarte juste plus haut · sol majeur');
		expect(readout({ semitones: 0, fifths: 2 }, D_MAJOR, B_MAJOR, 'en')).toBe('D major');
	});

	it('says the key on the Piece band, as printed and transposed', () => {
		expect(bandLine(null, D_MAJOR, 'en')).toEqual({ before: 'Key: ', key: 'D major', after: ', as printed', transposed: false });
		expect(bandLine(B_MAJOR, D_MAJOR, 'fr')).toEqual({ before: 'Tonalité : ', key: 'si majeur', after: ', après transposition', transposed: true });
		expect(bandLine({ semitones: 0, fifths: 2 }, D_MAJOR, 'en').transposed).toBe(false);
	});

	it('prints the header of drawing r4, plate 3, in both languages, and nothing as printed', () => {
		expect(pageHeader(B_MAJOR, D_MAJOR, 'en')).toBe('Transposed down a minor third from D major, at the singer’s choice.');
		expect(pageHeader(B_MAJOR, D_MAJOR, 'fr')).toBe(
			'Transposition d’une tierce mineure vers le bas à partir de ré majeur, au choix de l’interprète.',
		);
		expect(pageHeader(null, D_MAJOR, 'en')).toBeNull();
		expect(pageHeader({ semitones: 0, fifths: 2 }, D_MAJOR, 'en')).toBeNull();
	});

	it('opens on the first suggestion, marks the second, and on the printed key with none', () => {
		expect(openingStops(D_MAJOR, [candidate(-3, 5), candidate(-2, 0)])).toEqual({
			pick: B_MAJOR,
			runnerUp: { semitones: -2, fifths: 0 },
		});
		expect(openingStops(D_MAJOR, [])).toEqual({ pick: null, runnerUp: null });
	});

	it('names no key for a source with no mode, so offers no ruler', () => {
		expect(printedKey({ fifths: 2 })).toBeNull();
		expect(printedKey(undefined)).toBeNull();
		expect(printedKey({ fifths: 2, mode: 'major' })).toEqual(D_MAJOR);
	});

	it('applies a stored choice only when the printed key offers it', () => {
		expect(isStopOf(B_MAJOR, D_MAJOR)).toBe(true);
		expect(isStopOf({ semitones: -3, fifths: 4 }, D_MAJOR)).toBe(false);
		expect(isHome(null, D_MAJOR)).toBe(true);
	});
});

describe('the twins (slice 2, Dann 2026-09-28 21:41)', () => {
	const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
	const QUARTER = { base: 'quarter' as const, dots: 0, fraction: { numerator: 1, denominator: 4 } };
	/** One bar in `key`, a quarter per pitch. */
	function keyed(pitches: Pitch[], key: NamedKey): ParsedScore {
		const vocalLine: VocalLineEvent[] = pitches.map((pitch, i) => ({
			id: `n${i}`,
			type: 'note',
			measureIndex: 0,
			rhythmicPosition: { fraction: { numerator: i, denominator: 4 } },
			duration: QUARTER,
			pitch,
		}));
		return {
			source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
			vocalPart: { partId: 'P1', partName: 'Voice' },
			measures: [{ index: 0, number: '1', timeSignature: { beats: 4, beatType: 4 }, expectedDuration: { numerator: 1, denominator: 1 }, keySignature: key }],
			keySignatures: [{ measureIndex: 0, signature: key }],
			timeSignatures: [],
			tempoMarkings: [],
			vocalLine,
		} as unknown as ParsedScore;
	}
	/* Sunless 1, bar 2: A3 and the flat sixth, B flat 3, in D major. */
	const sunless = keyed([P('A', 3), P('B', 3, -1)], D_MAJOR);

	it('counts the double accidentals each twin draws, and only twins', () => {
		const counts = twinCounts(sunless, D_MAJOR);
		// The flat sixth carried: G natural in B major, A double flat in C flat;
		// A natural in C sharp, B double flat in D flat; D in F sharp, E double
		// flat in G flat.
		expect(counts[stopId(B_MAJOR)]).toEqual({ flats: 0, sharps: 0 });
		expect(counts[stopId(C_FLAT_MAJOR)]).toEqual({ flats: 1, sharps: 0 });
		expect(counts['-1:-5']).toEqual({ flats: 1, sharps: 0 });
		expect(counts['-1:7']).toEqual({ flats: 0, sharps: 0 });
		expect(counts['4:-6']).toEqual({ flats: 1, sharps: 0 });
		// A key without a twin is not counted, so it can never dim.
		expect(Object.keys(counts).sort()).toEqual(['-1:-5', '-1:7', '-3:-7', '-3:5', '4:-6', '4:6']);
	});

	it('dims the twin with more, neither on a tie, and never a key without a twin', () => {
		expect([...dimmedStops(D_MAJOR, twinCounts(sunless, D_MAJOR))].sort()).toEqual(['-1:-5', '-3:-7', '4:-6']);
		// The scale alone draws no double accidental on any stop: every pair ties.
		const scale = keyed([P('D', 4), P('E', 4), P('F', 4, 1), P('G', 4)], D_MAJOR);
		expect(dimmedStops(D_MAJOR, twinCounts(scale, D_MAJOR)).size).toBe(0);
	});

	it('moves a pick that lands on a dimmed twin to the cleaner one', () => {
		const dimmed = dimmedStops(D_MAJOR, twinCounts(sunless, D_MAJOR));
		expect(cleanerTwin(C_FLAT_MAJOR, D_MAJOR, dimmed)).toEqual(B_MAJOR);
		expect(cleanerTwin(B_MAJOR, D_MAJOR, dimmed)).toEqual(B_MAJOR);
		expect(cleanerTwin({ semitones: -2, fifths: 0 }, D_MAJOR, dimmed)).toEqual({ semitones: -2, fifths: 0 });
		// "Try this key" on C flat opens the ruler on B.
		expect(rulerOpening(sunless, D_MAJOR, {} as VoiceProfileSnapshot, null, C_FLAT_MAJOR).selected).toEqual(B_MAJOR);
	});

	it("Ilya's pick lands on the cleaner twin when the search names the busier one", () => {
		// C major, C4 and the flat sixth A flat 4, for a singer from C sharp 4
		// to A4. Only up a semitone fits, and the search names D flat major,
		// where the A flat is B double flat. C sharp major draws A natural.
		const C_MAJOR: NamedKey = { fifths: 0, mode: 'major' };
		const song = keyed([P('C', 4), P('A', 4, -1)], C_MAJOR);
		const profile = {
			fR1: { a: 650, o: 450, u: 350, i: 300, e: 400 },
			range: { lowest: P('C', 4, 1), highest: P('A', 4) },
		} as VoiceProfileSnapshot;
		const opening = rulerOpening(song, C_MAJOR, profile, () => 'a');
		expect(openingStops(C_MAJOR, [candidate(1, -5)]).pick).toEqual({ semitones: 1, fifths: -5 });
		expect(opening.pick).toEqual({ semitones: 1, fifths: 7 });
		expect(opening.selected).toEqual({ semitones: 1, fifths: 7 });
		expect([...opening.dimmed]).toContain('1:-5');
	});

	it('says the count in both languages, one line per kind', () => {
		expect(countLines({ flats: 1, sharps: 0 }, 'en')).toEqual(['Carries 1 double flat']);
		expect(countLines({ flats: 3, sharps: 2 }, 'en')).toEqual(['Carries 3 double flats', 'Carries 2 double sharps']);
		expect(countLines({ flats: 2, sharps: 1 }, 'fr')).toEqual(['Comporte 2 doubles bémols', 'Comporte 1 double dièse']);
		expect(countLines(undefined, 'en')).toEqual([]);
	});
});

describe('"Try this key" from Insights (slice 2)', () => {
	it('finds the stop for a suggestion made against the printed page', () => {
		expect(stopForSuggestion(D_MAJOR, null, -3, 5)).toEqual(B_MAJOR);
		expect(stopForSuggestion(D_MAJOR, null, -3, -7)).toEqual(C_FLAT_MAJOR);
	});

	it("adds the song's move when the suggestion was made against a transposed page", () => {
		// The page is in B major; the watch list says down a whole tone, to A major.
		expect(stopForSuggestion(D_MAJOR, B_MAJOR, -2, 3)).toEqual({ semitones: -5, fifths: 3 });
	});

	it('keeps the tritone on the side the move went, and finds nothing the ruler lacks', () => {
		// D major down a tritone and up a tritone are both A flat major (-4).
		expect(stopForSuggestion(D_MAJOR, null, -6, -4)).toEqual({ semitones: -6, fifths: -4 });
		expect(stopForSuggestion(D_MAJOR, null, 6, -4)).toEqual({ semitones: 6, fifths: -4 });
		expect(stopForSuggestion(D_MAJOR, B_MAJOR, -3, -4)).toEqual({ semitones: -6, fifths: -4 });
		expect(stopForSuggestion(D_MAJOR, null, -3, 4)).toBeNull();
	});
});
