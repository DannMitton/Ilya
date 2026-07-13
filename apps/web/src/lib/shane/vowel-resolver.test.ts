/**
 * buildVowelResolver tests (v38 §E.5, the Shane↔Ilya seam).
 *
 * The contract under test is the MAPPING, not the IPA: the vowels
 * themselves come verbatim from GraysonEngine via processText, so the
 * expected values here are extracted from the same pipeline output the
 * resolver reads (independent extraction path in the test, same ground
 * truth). What the tests pin down is the plumbing that could silently
 * lie: word reconstruction from syllabic roles, the vowelless-syllable
 * merge («сь»), melisma sustain across syllable-less notes, the rest
 * boundary, the ten-vowel membership guard, and the honest-bail rules
 * (alignment loss, syllable-count mismatch, no lyrics at all).
 */

import { describe, expect, it } from 'vitest';
import { demoScore } from '@ilya/score-parser';
import type { ParsedScore, Pitch, VocalLineEvent } from '@ilya/score-parser';
import { processText } from '$lib/pipeline';
import { buildVowelResolver } from './vowel-resolver';

const TEN_VOWELS = new Set(['i', 'e', 'ɪ', 'ɨ', 'ɛ', 'a', 'ɑ', 'ʌ', 'o', 'u']);

// ── Synthetic-score helpers (shape mirrors demo-fixture.ts) ─────────

const P = (step: Pitch['step'], octave: number): Pitch => ({ step, octave, alter: 0 });

function note(
	id: string,
	syllable?: { text: string; type: 'whole' | 'start' | 'middle' | 'end'; verse?: number }
): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
		pitch: P('C', 4),
		...(syllable
			? {
					syllable: {
						id: `s-${id}`,
						text: syllable.text,
						type: syllable.type,
						verseNumber: syllable.verse ?? 1,
						// wordContext is required by SyllableInfo; the resolver
						// never reads it, so the syllable text suffices here.
						wordContext: syllable.text
					}
				}
			: {})
	};
}

function rest(id: string): VocalLineEvent {
	return {
		id,
		type: 'rest',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } }
	};
}

function scoreOf(events: VocalLineEvent[]): ParsedScore {
	return {
		source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures: [],
		keySignatures: [],
		timeSignatures: [],
		tempoMarkings: [],
		vocalLine: events
	};
}

/** Independent extraction: the single vowel of word `w`, syllable `k`,
 * straight from a fresh processText run (the resolver's ground truth). */
function expectedVowel(text: string, wordIdx: number, sylIdx: number): string | undefined {
	const words = processText(text)[0]?.words ?? [];
	const w = words[wordIdx];
	if (!w) return undefined;
	const entries = w.result.transcriptionLog.filter(
		(e) => e.features?.type === 'vowel' && e.syllableIndex === sylIdx
	);
	if (entries.length !== 1) return undefined;
	return entries[0].ipa.replace(/[ˈˌ]/g, '');
}

// ── The demo fixture: the package's own Russian vocal line ──────────

describe('buildVowelResolver on the demo score', () => {
	const parsed = demoScore();
	const resolve = buildVowelResolver(parsed);
	const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
	const at = (id: string) => resolve(byId.get(id)!);

	it('resolves every sung note to one of the ten sung vowels', () => {
		for (const ev of parsed.vocalLine) {
			if (ev.type !== 'note') continue;
			const v = at(ev.id);
			expect(v, `event ${ev.id}`).toBeDefined();
			expect(TEN_VOWELS.has(v!), `event ${ev.id} resolved to ${v}`).toBe(true);
		}
	});

	it('resolves rests to undefined', () => {
		for (const ev of parsed.vocalLine) {
			if (ev.type === 'rest') expect(at(ev.id)).toBeUndefined();
		}
	});

	it('sustains the melisma: n19 and n20 carry n18’s vowel', () => {
		expect(at('n18')).toBeDefined();
		expect(at('n19')).toBe(at('n18'));
		expect(at('n20')).toBe(at('n18'));
	});

	it('merges the vowelless «сь» into «зи»: n6 carries n5’s vowel', () => {
		expect(at('n5')).toBeDefined();
		expect(at('n6')).toBe(at('n5'));
	});

	it('matches an independent pipeline extraction for «пять» and «тьма»', () => {
		// The reconstructed line, exactly as buildVowelResolver feeds it.
		const line = 'Ты погрузись но чу по го ди тьма на ста пять по';
		expect(at('n13')).toBe(expectedVowel(line, 7, 0)); // тьма
		expect(at('n16')).toBe(expectedVowel(line, 10, 0)); // пять
	});
});

// ── Honest-bail behaviours ───────────────────────────────────────────

describe('buildVowelResolver bail rules', () => {
	it('resolves nothing for a score with no lyrics', () => {
		const parsed = scoreOf([note('a1'), note('a2'), rest('r1'), note('a3')]);
		const resolve = buildVowelResolver(parsed);
		for (const ev of parsed.vocalLine) expect(resolve(ev)).toBeUndefined();
	});

	it('does not sustain across a rest', () => {
		const parsed = scoreOf([
			note('b1', { text: 'вас', type: 'whole' }),
			rest('r1'),
			note('b2') // melisma-shaped, but phonation stopped at the rest
		]);
		const resolve = buildVowelResolver(parsed);
		const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
		expect(resolve(byId.get('b1')!)).toBeDefined();
		expect(resolve(byId.get('b2')!)).toBeUndefined();
	});

	it('re-joins a hyphenated-particle split («велит-ли»)', () => {
		// The pipeline expands «велит-ли» into two tokens; the score
		// carries it as one three-syllable word. The two-word join must
		// keep the alignment and resolve all three syllables.
		const parsed = scoreOf([
			note('c1', { text: 'ве', type: 'start' }),
			note('c2', { text: 'лит-', type: 'middle' }),
			note('c3', { text: 'ли', type: 'end' }),
			note('c4', { text: 'вас', type: 'whole' })
		]);
		const resolve = buildVowelResolver(parsed);
		const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
		for (const id of ['c1', 'c2', 'c3', 'c4']) {
			const v = resolve(byId.get(id)!);
			expect(v, `event ${id}`).toBeDefined();
			expect(TEN_VOWELS.has(v!)).toBe(true);
		}
	});

	it('ignores syllables from other verses (verse-1 rule)', () => {
		const parsed = scoreOf([
			note('d1', { text: 'вас', type: 'whole' }),
			note('d2', { text: 'нет', type: 'whole', verse: 2 })
		]);
		const resolve = buildVowelResolver(parsed);
		const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
		const v1 = resolve(byId.get('d1')!);
		expect(v1).toBeDefined();
		// The verse-2 note reads as a continuation of verse 1: it sustains.
		expect(resolve(byId.get('d2')!)).toBe(v1);
	});
});
