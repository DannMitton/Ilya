/**
 * reconcilePairings tests (N.55b).
 *
 * THE CONTRACT UNDER TEST is the distinction Dann drew on 2026-08-13: a
 * re-division and a re-transcription are not the same event, and only the
 * second is drift.
 *
 * A re-division moves consonants between slots of one word. Nuclei ARE the
 * syllables, so they never move, the slot count cannot change, and the
 * singer's pairing still refers to the same nucleus. Its text is stale, not
 * wrong, so it is refreshed.
 *
 * A re-transcription puts a different word at the same position. That is a
 * different decision, so R6 holds and it stays drift.
 *
 * The fixtures are hand-built rather than driven through the engine: the
 * rule under test is the reconciliation, and routing it through processText
 * would test the syllabifier instead.
 */

import { describe, expect, it } from 'vitest';
import { reconcilePairings, auditPairings } from './pairings';
import type { PairingMap, Slot } from './pairings';

const slot = (cyrillic: string, ipa: string, vowel: string | undefined, slotIndex: number, word: string): Slot => ({
	cyrillic,
	ipa,
	vowel,
	origin: { lineIndex: 0, wordIndex: 0, slotIndex, word },
});

/** Moscow, as the engine divides it. */
const BEFORE: Slot[] = [slot('мос', 'mos', 'o', 0, 'москва'), slot('ква', 'kva', 'a', 1, 'москва')];

/** The same word after an Inspector drag moves the consonant rightward. */
const REDIVIDED: Slot[] = [slot('мо', 'mo', 'o', 0, 'москва'), slot('сква', 'skva', 'a', 1, 'москва')];

/** A different word at the same position, with the same vowel count. */
const RETRANSCRIBED: Slot[] = [slot('бо', 'bo', 'o', 0, 'болото'), slot('лото', 'loto', 'o', 1, 'болото')];

const paired = (): PairingMap => ({
	e1: { kind: 'syllable', cyrillic: 'мос', ipa: 'mos', vowel: 'o', origin: { lineIndex: 0, wordIndex: 0, slotIndex: 0, word: 'москва' } },
});

describe('reconcilePairings', () => {
	it('refreshes a re-divided pairing and reports no drift', () => {
		const r = reconcilePairings(paired(), REDIVIDED);
		expect(r.drift).toEqual([]);
		expect(r.refreshed).toBe(1);
		const p = r.map.e1;
		expect(p.kind === 'syllable' && p.cyrillic).toBe('мо');
		expect(p.kind === 'syllable' && p.ipa).toBe('mo');
	});

	it('reports drift for a re-transcription and does not refresh it', () => {
		const r = reconcilePairings(paired(), RETRANSCRIBED);
		expect(r.refreshed).toBe(0);
		expect(r.drift).toEqual([{ eventId: 'e1', stored: 'мос', current: 'бо' }]);
		const p = r.map.e1;
		expect(p.kind === 'syllable' && p.cyrillic).toBe('мос');
	});

	it('leaves an unchanged queue alone', () => {
		const r = reconcilePairings(paired(), BEFORE);
		expect(r.drift).toEqual([]);
		expect(r.refreshed).toBe(0);
	});

	it('reports drift when the origin no longer exists', () => {
		const r = reconcilePairings(paired(), []);
		expect(r.refreshed).toBe(0);
		expect(r.drift).toEqual([{ eventId: 'e1', stored: 'мос', current: undefined }]);
	});

	it('passes melisma and empty pairings through untouched', () => {
		const map: PairingMap = { e1: { kind: 'melisma' }, e2: { kind: 'empty' } };
		const r = reconcilePairings(map, REDIVIDED);
		expect(r.drift).toEqual([]);
		expect(r.refreshed).toBe(0);
		expect(r.map).toEqual(map);
	});

	it('falls back to the text comparison for a pairing stored before origin.word existed', () => {
		const legacy = {
			e1: { kind: 'syllable', cyrillic: 'мос', ipa: 'mos', vowel: 'o', origin: { lineIndex: 0, wordIndex: 0, slotIndex: 0 } },
		} as unknown as PairingMap;
		const r = reconcilePairings(legacy, REDIVIDED);
		expect(r.refreshed).toBe(0);
		expect(r.drift).toEqual([{ eventId: 'e1', stored: 'мос', current: 'мо' }]);
	});

	it('does not mutate the map it was given', () => {
		const original = paired();
		reconcilePairings(original, REDIVIDED);
		const p = original.e1;
		expect(p.kind === 'syllable' && p.cyrillic).toBe('мос');
	});
});

describe('auditPairings', () => {
	it('returns exactly the reconciliation drift, so a re-division is never reported', () => {
		expect(auditPairings(paired(), REDIVIDED)).toEqual([]);
		expect(auditPairings(paired(), RETRANSCRIBED)).toEqual(reconcilePairings(paired(), RETRANSCRIBED).drift);
	});
});
