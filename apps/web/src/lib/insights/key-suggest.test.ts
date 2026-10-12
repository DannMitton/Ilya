/**
 * key-suggest.test.ts: N.182, how Ilya suggests a key (QUEUE row 71).
 *
 * THE FIXTURE VOICES, each with a typed range and passaggi (brief, "Tests and
 * proof": at least a soprano, a tenor, and a bass, named; no low-voice norm):
 *   SOPRANO: range C4 to C6, primo F4, secondo F5.
 *   TENOR:   range C3 to C5, primo D4, secondo G4.
 *   BASS:    range D2 to C4, primo G3, secondo C4.
 * Every expected value below is worked from the notes written in the case, not
 * read back from the search.
 */
import { describe, expect, it } from 'vitest';
import type { Measure, ParsedScore, Pitch, VocalLineEvent, VoiceProfileSnapshot } from '@ilya/score-parser';
import type { NoteFacts } from './comments';
import { challengeWeight, measureKey, RANGE_CHALLENGE_MARGIN, stakesOf, suggestKeys, MAX_KEY_GROUPS } from './key-suggest';
import { keyParts, keyWords, moveWords } from './key-lines';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const QUARTER = { base: 'quarter' as const, dots: 0, fraction: { numerator: 1, denominator: 4 } };

function score(pitches: Pitch[]): ParsedScore {
	const vocalLine: VocalLineEvent[] = pitches.map((p, i) => ({ id: `n${i}`, type: 'note', measureIndex: Math.floor(i / 4), rhythmicPosition: { fraction: { numerator: i % 4, denominator: 4 } }, duration: QUARTER, pitch: p }));
	const bars = Math.ceil(pitches.length / 4);
	return {
		source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures: Array.from({ length: bars }, (_, i) => ({ index: i, number: String(i + 1), timeSignature: { beats: 4, beatType: 4 }, expectedDuration: { numerator: 1, denominator: 1 } })) as Measure[],
		keySignatures: [],
		timeSignatures: [],
		tempoMarkings: [],
		vocalLine,
	} as unknown as ParsedScore;
}
const rep = (p: Pitch, n: number) => Array.from({ length: n }, () => p);

const SOPRANO: VoiceProfileSnapshot = { fR1: {}, range: { lowest: P('C', 4), highest: P('C', 6) }, passaggio: { primo: P('F', 4), secondo: P('F', 5) } };
const TENOR: VoiceProfileSnapshot = { fR1: {}, range: { lowest: P('C', 3), highest: P('C', 5) }, passaggio: { primo: P('D', 4), secondo: P('G', 4) } };
const BASS: VoiceProfileSnapshot = { fR1: {}, range: { lowest: P('D', 2), highest: P('C', 4) }, passaggio: { primo: P('G', 3), secondo: P('C', 4) } };

/** A held note at the first event, `toSecondo` semitones from the secondo in the written key. */
const heldAt = (toSecondo: number): NoteFacts[] =>
	[{ chainHead: true, toSecondo, chainSeconds: 4, note: { held: true, measureIndex: 0, eventId: 'n0', vowel: 'a' } }] as unknown as NoteFacts[];

describe('the challenge set and the margin', () => {
	it('reads the range axis: inside, a semitone or a tone beyond is workable, three is not (tenor)', () => {
		const sc = score([P('C', 5), P('G', 4), P('E', 4), P('C', 4)]); // top note C5, the tenor's ceiling
		const input = { score: sc, profile: TENOR, facts: null };
		expect(measureKey(input, 0)!.set.range).toBe('inside');
		const up2 = measureKey(input, RANGE_CHALLENGE_MARGIN)!;
		expect(up2.set.range).toBe('above');
		expect(up2.workable).toBe(true);
		expect(up2.above).toEqual({ count: 1, semitones: 2, bar: '1' });
		expect(measureKey(input, RANGE_CHALLENGE_MARGIN + 1)!.workable).toBe(false);
	});

	it('counts passaggio time as the page does: at or above the primo, strictly above the secondo (bass)', () => {
		// C4 twice and A3 six times: all at or above G3; C4 is the secondo itself, so nothing above it.
		const k = measureKey({ score: score([...rep(P('C', 4), 2), ...rep(P('A', 3), 6)]), profile: BASS, facts: null }, 0)!;
		expect(k.set).toEqual({ range: 'inside', primo: true, secondo: false, held: false });
		expect(k.primoShare).toBe(1);
		expect(k.secondoShare).toBe(0);
	});

	it('moves a held note with the key: on the secondo as written, above it a semitone up', () => {
		const input = { score: score([P('G', 4), P('E', 4), P('C', 4), P('C', 4)]), profile: TENOR, facts: heldAt(0) };
		expect(measureKey(input, 0)!.set.held).toBe(false);
		expect(measureKey(input, 1)!.held).toEqual({ bar: '1' });
	});

	it('has the range axis only without typed passaggi, and no search without a typed range', () => {
		const sc = score([P('G', 3), P('A', 3)]);
		const noPassaggi = { ...TENOR, passaggio: undefined };
		expect(measureKey({ score: sc, profile: noPassaggi, facts: null }, 0)!.set).toEqual({ range: 'inside' });
		expect(suggestKeys({ score: sc, profile: { ...TENOR, range: undefined }, facts: null })).toBeNull();
	});
});

describe('which keys, in what order (rules 4 and 5)', () => {
	// Tenor: G4 twice, E4 twice, C4 four times; a held note on G4 (the secondo).
	// Written: inside, half the time at or above D4, nothing above G4, no held note above it.
	// Up 1 and up to 5: the held G4 rises above the secondo, a new set; up 1 is its smallest move.
	// Up 6: C5 becomes C♯5, a semitone above the range, another set.
	// Down 1 and 2: the same set and the same half: nothing that matters.
	// Down 3 to 5: the same set, but a quarter at or above D4 (25 points less): down 3 is shown.
	// Down 6: nothing at or above D4, a set of its own.
	const sc = score([...rep(P('G', 4), 2), ...rep(P('E', 4), 2), ...rep(P('C', 4), 4)]);
	const input = { score: sc, profile: TENOR, facts: heldAt(0) };

	it('shows one key per challenge set, its smallest move that matters, at most three, and caps the rest into the reveal', () => {
		const s = suggestKeys(input)!;
		expect(s.kind).toBe('keys');
		// Stakes (no answers, each challenge 1.0): down 6 has none (0); down 3, the primo (1); up 1, primo, secondo, held (3); up 6, range above too (4).
		expect(s.shown.map((k) => k.semitones)).toEqual([-6, -3, 1]);
		expect(s.shown.length).toBe(MAX_KEY_GROUPS);
		expect(s.capBound).toBe(true);
		expect(s.reveal.map((k) => k.semitones)).toEqual([6]);
	});

	it('does not show a key that changes nothing that matters (the 10-point test)', () => {
		const s = suggestKeys(input)!;
		expect(s.shown.some((k) => k.semitones === -1 || k.semitones === -2)).toBe(false);
	});

	it('weighs each challenge by the singer’s own answer: 1 to 2 and not sure 1.0, 3 0.75, 4 to 5 0.5', () => {
		expect([1, 2, 3, 4, 5, 'not-sure', undefined].map((p) => challengeWeight(p as never))).toEqual([1, 1, 0.75, 0.5, 0.5, 1, 1]);
		const set = { range: 'above' as const, primo: true, secondo: true, held: true };
		expect(stakesOf(set, undefined)).toBe(4);
		expect(stakesOf(set, { top: 5, passaggi: 5, sustained: 5 })).toBe(2);
		expect(stakesOf({ range: 'both' }, { top: 1, bottom: 4 })).toBe(1.5);
	});

	it('gives the same keys whatever the answers; only the order may change', () => {
		const a = suggestKeys(input)!.shown.map((k) => k.semitones).sort();
		const b = suggestKeys({ ...input, intake: { top: 5, passaggi: 1, sustained: 5 } })!.shown.map((k) => k.semitones).sort();
		expect(b).toEqual(a);
	});
});

describe('the one-line answers', () => {
	it('suggests no key when the written key suits; harder keys wait under the reveal (tenor)', () => {
		// G3 eight times: inside, under D4; up to a tritone (C♯4) is still under D4.
		const s = suggestKeys({ score: score(rep(P('G', 3), 8)), profile: TENOR, facts: null })!;
		expect(s.kind).toBe('none');
		expect(s.shown).toEqual([]);
		// Up a tritone, C♯4, is still under D4, so no key changes the set; the far keys reach past the range and wait.
		expect(s.reveal.every((k) => !k.workable || k.set.range !== 'inside' || k.set.primo === false)).toBe(true);
		expect(keyWords(s, (n) => ({ readout: moveWords(n, 'en') }), 'en', undefined).note).toBe(
			'No key suggested: as written, the song stays inside your range and below your primo, and no other key within a tritone changes that by much.',
		);
	});

	it('finds no workable key for a bass song in a soprano’s range, and says so', () => {
		const s = suggestKeys({ score: score([P('G', 2), P('C', 3), P('E', 3), P('C', 3)]), profile: SOPRANO, facts: null })!;
		expect(s.kind).toBe('noWorkable');
		expect(s.shown).toEqual([]);
		// Every key sits under the reveal, nearest first.
		expect(s.reveal.map((k) => Math.abs(k.semitones))).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
	});
});

describe('vowels past their turn: placeholders never count (rule 6)', () => {
	const sc = score(rep(P('C', 4), 4)); // C4 = 261.6 Hz; [a]'s turn at 500 / 2 = 250 Hz, so every note is past it
	const vowelForEvent = () => 'a';
	it('counts a sung vowel', () => {
		const k = measureKey({ score: sc, profile: { ...TENOR, fR1: { a: 500 }, fR1Source: { a: 'sung' } }, facts: null, vowelForEvent }, 0)!;
		expect(k.pastTurn).toBe(1);
	});
	it('leaves a placeholder out, and with nothing left, says nothing', () => {
		const k = measureKey({ score: sc, profile: { ...TENOR, fR1: { a: 500 }, fR1Source: { a: 'surrogate' } }, facts: null, vowelForEvent }, 0)!;
		expect(k.pastTurn).toBeNull();
	});
});

describe('the words (key-lines.ts)', () => {
	const sc = score([...rep(P('G', 4), 2), ...rep(P('E', 4), 2), ...rep(P('C', 4), 4)]);
	const input = { score: sc, profile: TENOR, facts: heldAt(0) };
	const s = suggestKeys(input)!;
	const name = (n: number) => ({ readout: moveWords(n, 'en') });

	it('names each key by its move and only what differs from the written key, with no recommendation', () => {
		const w = keyWords(s, name, 'en', undefined);
		expect(w.lines.map((l) => l.text)).toEqual([
			'Down a tritone: nothing at or above your primo.',
			'Down a minor third: 25 percent of the singing at or above your primo.',
			'Up a semitone: 25 percent above your secondo; a held note above your secondo, in bar 1.',
		]);
		expect(w.lines.join(' ')).not.toMatch(/recommendation/i);
		expect(w.reveal?.label).toBe('Show keys that reach higher');
		// G4 twice becomes C♯5 twice: two notes a semitone above the range.
		expect(w.reveal?.lines[0].text).toMatch(/^Up a tritone: two notes up to a semitone above your range, the highest in bar 1/);
	});

	it('names a distance past the range beyond a tritone in semitones, never a missing string', () => {
		// The soprano and a bass song: up a tritone, G2 becomes C♯3, still eleven semitones under C4.
		const far = suggestKeys({ score: score([P('G', 2), P('C', 3), P('E', 3), P('C', 3)]), profile: SOPRANO, facts: null })!;
		const text = keyWords(far, name, 'en', undefined).reveal!.lines.map((l) => l.text).join(' ');
		expect(text).not.toMatch(/missing/i);
		expect(text).toContain('down to 11 semitones below your range');
	});

	it('names the passaggi in the register of Q7', () => {
		const down6 = s.shown[0];
		expect(keyParts(down6, s.written, 'en', { acoustics: 1 })).toEqual(['nothing at or above your first passaggio']);
		expect(keyParts(down6, s.written, 'en', { acoustics: 5 })).toEqual(['nothing at or above your primo passaggio']);
	});

	it('adds a clause of why at points 1 to 2, and takes the terse form at 4 to 5, each by its own question', () => {
		const down6 = s.shown[0];
		expect(keyParts(down6, s.written, 'en', { passaggi: 1 })).toEqual(['nothing at or above your primo, where the voice turns']);
		const up6 = s.reveal[0];
		expect(keyParts(up6, s.written, 'en', { top: 1 })[0]).toBe('two notes up to a semitone above your range, the highest in bar 1, past the notes you typed as your limits');
		expect(keyParts(up6, s.written, 'en', { top: 5 })[0]).toBe('2 up to a semitone over the range, bar 1');
	});
});
