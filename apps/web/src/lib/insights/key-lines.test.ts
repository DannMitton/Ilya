/**
 * N.182 (row 71): the words of the key lines. Every expectation is read off the test's own input.
 * The rulings these pin: no percent, no pitch, no count of notes, "sustained" and never "held" (Dann 2026-10-11,
 * 2026-11-01), the answers choose the wording and never the keys, and the French slot is filled so `t()` never prints [MISSING].
 */
import { describe, expect, it } from 'vitest';
import type { IntakeAnswers, Measure, ParsedScore, Pitch, VocalLineEvent, VoiceProfileSnapshot } from '@ilya/score-parser';
import { keyParts, keyWords, moveWords, whereWords, type NameKey } from './key-lines';
import { suggestKeys, type Beyond, type KeyOption } from './key-suggest';
import { stringKeys, t } from '$lib/i18n';

const base: KeyOption = { semitones: 0, workable: true, set: { range: 'inside' }, above: null, below: null, primoShare: null, secondoShare: null, sustained: null, pastTurn: null, stakes: 0 };
const key = (over: Partial<KeyOption>): KeyOption => ({ ...base, ...over });
const beyond = (semitones: number, ...bars: Array<[string, string]>): Beyond => ({ semitones, passages: bars.map(([from, to], i) => ({ from, to, time: 10 - i })) });
const intake = (over: Partial<IntakeAnswers> = {}): IntakeAnswers => ({ top: 3, bottom: 3, passaggi: 3, sustained: 3, acoustics: 3, ...over }) as IntakeAnswers;
const parts = (k: KeyOption, w: KeyOption, i: IntakeAnswers | undefined = intake(), language: 'en' | 'fr' = 'en') => keyParts(k, w, language, i);

describe('the move and the passages', () => {
	it('says the move from the key read, in the ruler’s own interval words', () => {
		expect(moveWords(-2, 'en')).toBe('Down a whole tone');
		expect(moveWords(5, 'en')).toBe('Up a perfect fourth');
	});
	it('names a passage by its bars: a bar, or a run of bars', () => {
		expect(whereWords(beyond(1, ['12', '12']), 'en')).toBe('bar 12');
		expect(whereWords(beyond(1, ['54', '55']), 'en')).toBe('bars 54 to 55');
	});
	it('names the two that matter most, and says "and elsewhere" past two, never a count', () => {
		expect(whereWords(beyond(1, ['54', '55'], ['12', '12']), 'en')).toBe('bars 54 to 55 and bar 12');
		expect(whereWords(beyond(1, ['54', '55'], ['12', '12'], ['3', '3']), 'en')).toBe('bars 54 to 55 and bar 12, and elsewhere');
	});
});

describe('a key line says only what differs, for this singer', () => {
	const written = key({ set: { range: 'above', primo: true, secondo: true }, above: beyond(1, ['54', '55']), primoShare: 0.75, secondoShare: 0.5 });

	it('says a range challenge gone as "stays inside your range"', () => {
		expect(parts(key({ set: { range: 'inside', primo: true, secondo: true }, primoShare: 0.75, secondoShare: 0.5 }), written)).toEqual(['stays inside your range']);
	});
	it('says where a range challenge sits, never which pitch, and never how many notes', () => {
		const p = parts(key({ set: { range: 'above' }, above: beyond(2, ['54', '55'], ['12', '12']) }), key({}));
		expect(p).toEqual(['reaches above your range in bars 54 to 55 and bar 12']);
	});
	it('says a share as a fraction, "some" when too small for one, and "nothing" when the challenge is gone', () => {
		const w = key({ set: { range: 'inside', primo: true }, primoShare: 0.9 });
		expect(parts(key({ set: { range: 'inside', primo: true }, primoShare: 0.33 }), w)).toEqual(['about a third of the singing sits at or above your primo']);
		expect(parts(key({ set: { range: 'inside', primo: true }, primoShare: 0.1 }), key({ set: { range: 'inside', primo: false }, primoShare: 0 }))).toEqual(['some of the singing sits at or above your primo']);
		expect(parts(key({ set: { range: 'inside', primo: false }, primoShare: 0 }), w)).toEqual(['nothing sits at or above your primo']);
	});
	it('leaves a share out when it did not move by ten points and no challenge changed', () => {
		const w = key({ set: { range: 'inside', primo: true }, primoShare: 0.5 });
		expect(parts(key({ set: { range: 'inside', primo: true }, primoShare: 0.55 }), w)).toEqual([]);
	});
	it('names a sustained note by its bar, and says "sustained", never "held"', () => {
		const withNote = key({ set: { range: 'inside', secondo: true, sustained: true }, secondoShare: 0.2, sustained: { bar: '12' } });
		const without = key({ set: { range: 'inside', secondo: true, sustained: false }, secondoShare: 0.2 });
		expect(parts(withNote, without)).toEqual(['a sustained note above your secondo, in bar 12']);
		expect(parts(without, withNote)).toEqual(['no sustained note above your secondo']);
	});
	it('describes the vowels past their turn only where the keys differ by ten points and the share can be said as a fraction', () => {
		expect(parts(key({ pastTurn: 0.45 }), key({ pastTurn: 0.1 }))).toEqual(['nearly half of the singing sits past where your vowels turn']);
		expect(parts(key({ pastTurn: 0.12 }), key({ pastTurn: 0.4 }))).toEqual([]);
		expect(parts(key({ pastTurn: 0.45 }), key({ pastTurn: 0.4 }))).toEqual([]);
		expect(parts(key({ pastTurn: null }), key({ pastTurn: 0.4 }))).toEqual([]);
	});
});

describe('the singer’s answers choose the words, in each challenge’s own question', () => {
	const w = key({ set: { range: 'inside', primo: true }, primoShare: 0.9 });
	const k = key({ set: { range: 'above', primo: false }, above: beyond(1, ['12', '12']), primoShare: 0 });
	it('adds a clause of why at points 1 to 2, keeps the plain part at point 3, and goes terse at points 4 to 5 (range above: Q1)', () => {
		expect(parts(k, w, intake({ top: 1 }))[0]).toBe('reaches above your range in bar 12, past the notes you typed as your limits');
		expect(parts(k, w, intake({ top: 3 }))[0]).toBe('reaches above your range in bar 12');
		expect(parts(k, w, intake({ top: 5 }))[0]).toBe('above your range in bar 12');
	});
	it('reads the range below by Q2, not Q1', () => {
		const below = key({ set: { range: 'below' }, below: beyond(1, ['9', '9']) });
		expect(parts(below, key({}), intake({ top: 5, bottom: 1 }))[0]).toBe('reaches below your range in bar 9, past the notes you typed as your limits');
	});
	it('adds why to a passaggio challenge by Q3 and names the passaggi in the register of Q7', () => {
		const some = key({ set: { range: 'inside', primo: true }, primoShare: 0.33 });
		const none = key({ set: { range: 'inside', primo: true }, primoShare: 0.9 });
		expect(parts(some, none, intake({ passaggi: 1, acoustics: 5 }))).toEqual(['about a third of the singing sits at or above your primo passaggio, where the voice turns']);
		expect(parts(some, none, intake({ passaggi: 3, acoustics: 3 }))).toEqual(['about a third of the singing sits at or above your primo']);
		expect(parts(some, none, intake({ passaggi: 4, acoustics: 1 }))).toEqual(['about a third of the singing sits at or above your first passaggio']);
	});
	it('does not change which keys are shown', () => {
		const sc = tenorScore();
		const shown = (i: IntakeAnswers) => suggestKeys({ score: sc, profile: TENOR, voiceType: 'tenor', facts: null, intake: i })!.shown.map((x) => x.semitones).sort();
		expect(shown(intake({ top: 1, passaggi: 1, sustained: 1, acoustics: 1 }))).toEqual(shown(intake({ top: 5, passaggi: 5, sustained: 5, acoustics: 5 })));
	});
});

// A tenor whose key is high for him.
const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const TENOR: VoiceProfileSnapshot = { fR1: { a: 650 }, range: { lowest: P('C', 3), highest: P('A', 4) }, passaggio: { primo: P('D', 4), secondo: P('G', 4) } };
function tenorScore(): ParsedScore {
	const Q = { base: 'quarter' as const, dots: 0, fraction: { numerator: 1, denominator: 4 } };
	const pitches = [...Array(8).fill(P('A', 4)), ...Array(4).fill(P('E', 4)), ...Array(4).fill(P('C', 4))] as Pitch[];
	const events = pitches.map((p, i) => ({ id: `n${i}`, type: 'note', measureIndex: Math.floor(i / 4), rhythmicPosition: { fraction: { numerator: i % 4, denominator: 4 } }, duration: Q, pitch: p }) as unknown as VocalLineEvent);
	return { source: {}, vocalPart: {}, measures: Array.from({ length: 4 }, (_, i) => ({ index: i, number: String(i + 1) })) as unknown as Measure[], keySignatures: [], timeSignatures: [], tempoMarkings: [], vocalLine: events } as unknown as ParsedScore;
}

describe('the lines, the one-line answers, and the reveal', () => {
	const nameKey: NameKey = (s) => ({ keyName: `K${s}`, stop: { semitones: s, fifths: 0 } });
	const s = suggestKeys({ score: tenorScore(), profile: TENOR, voiceType: 'tenor', facts: null })!;

	it('writes a line as the move, the key it lands in, and what differs, with the stop to try', () => {
		const w = keyWords(s, nameKey, 'en', intake());
		expect(w.lines.length).toBe(s.shown.length);
		for (const line of w.lines) {
			expect(line.text).toMatch(/^(Down|Up) [a-z ]+ · K-?\d: .+\.$/);
			expect(line.text).not.toMatch(/Ilya.s recommendation/);
			expect(line.stop).toBeDefined();
		}
		expect(w.note).toBeNull();
	});
	it('names the move alone when the score names no key', () => {
		const w = keyWords(s, () => ({}), 'en', intake());
		expect(w.lines[0].text).toMatch(/^(Down|Up) [a-z ]+: /);
		expect(w.lines[0].stop).toBeUndefined();
	});
	it('puts the keys that reach beyond the range under a label that says which way, each saying where and how far', () => {
		const w = keyWords(s, nameKey, 'en', intake());
		expect(w.reveal).not.toBeNull();
		expect(w.reveal!.label).toMatch(/^Show keys that reach (higher|lower|higher or lower)$/);
		const far = w.reveal!.lines.find((l) => /by (a|an|\d)/.test(l.text));
		expect(far).toBeDefined();
		expect(far!.text).toMatch(/reaches above your range in bars? [\d ]+(to \d+)?, by /);
	});
	it('gives the one-line answers, the "suits" line by the axes the voice has', () => {
		const easy = tenorScoreLow();
		const suits = suggestKeys({ score: easy, profile: TENOR, voiceType: 'tenor', facts: null })!;
		expect(keyWords(suits, nameKey, 'en', intake()).note).toBe('No key suggested: as it stands, the song stays inside your range and below your primo.');
		expect(keyWords(suits, nameKey, 'en', intake({ acoustics: 1 })).note).toBe('No key suggested: as it stands, the song stays inside your range and below your first passaggio.');
		const soprano = suggestKeys({ score: easy, profile: { ...TENOR, range: { lowest: P('C', 3), highest: P('C', 6) } }, voiceType: 'soprano', facts: null })!;
		expect(keyWords(soprano, nameKey, 'en', intake()).note).toContain('below your secondo.');
		const rangeOnly = suggestKeys({ score: easy, profile: { fR1: { a: 650 }, range: TENOR.range }, voiceType: 'tenor', facts: null })!;
		expect(keyWords(rangeOnly, nameKey, 'en', intake()).note).toBe('No key suggested: as it stands, the song stays inside your range.');
		expect(keyWords({ ...s, kind: 'noneBetter' }, nameKey, 'en', intake()).note).toBe('No other key within a tritone changes these challenges by much.');
		expect(keyWords({ ...s, kind: 'noWorkable' }, nameKey, 'en', intake()).note).toContain('is yours to decide');
	});
});

function tenorScoreLow(): ParsedScore {
	const sc = tenorScore();
	return { ...sc, vocalLine: sc.vocalLine.map((e) => ({ ...e, pitch: P('A', 3) })) } as ParsedScore;
}

describe('no line breaks a ruling of Dann’s', () => {
	const S = suggestKeys({ score: tenorScore(), profile: TENOR, voiceType: 'tenor', facts: null })!;
	const all: string[] = [];
	for (const q of [1, 3, 5]) for (const a of [1, 3, 5]) {
		const w = keyWords(S, (n) => ({ keyName: `C minor`, stop: { semitones: n, fifths: 0 } }), 'en', intake({ top: q as 1, bottom: q as 1, passaggi: q as 1, sustained: q as 1, acoustics: a as 1 }));
		all.push(...w.lines.map((l) => l.text), ...(w.reveal?.lines.map((l) => l.text) ?? []), w.note ?? '');
	}
	it('has lines to check', () => {
		expect(all.filter(Boolean).length).toBeGreaterThan(20);
	});
	it('says no percent, no pitch with an octave, and no count of notes', () => {
		for (const line of all) {
			expect(line, line).not.toMatch(/%|percent/i);
			expect(line, line).not.toMatch(/\b[A-G](♯|♭|#)?\d\b/);
			// "past the notes you typed as your limits" is a why clause; what is banned is a number of notes.
			expect(line, line).not.toMatch(/\b(\d+|a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(more\s+)?notes?\b/i);
		}
	});
	it('says "sustained" and never "held"; names no tab', () => {
		for (const line of all) {
			expect(line, line).not.toMatch(/\bheld\b/i);
			expect(line, line).not.toMatch(/\b(text|melody|insights|learn|guide)\b/i);
		}
	});
	it('has every insights.key.* string in both languages, none missing, none with an em-dash, none saying "held"', () => {
		const keys = stringKeys().filter((k) => k.startsWith('insights.key.'));
		expect(keys.length).toBe(43);
		for (const k of keys) for (const lang of ['en', 'fr'] as const) {
			const v = t(k, lang);
			expect(v, `${k} ${lang}`).not.toMatch(/MISSING/);
			expect(v.length, `${k} ${lang}`).toBeGreaterThan(0);
			expect(v, `${k} ${lang}`).not.toMatch(/—/);
			expect(v, `${k} ${lang}`).not.toMatch(/\bheld\b/i);
		}
	});
});
