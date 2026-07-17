import { describe, expect, it } from 'vitest';
import type { ParsedScore, SyllableInfo, VerseSyllable, VocalLineEvent } from './types';
import { sungVerseNumbers } from './verses';

// ── Synthetic-score helpers (shape mirrors the parser fixtures) ─────

function note(
	id: string,
	syllable?: {
		text: string;
		type: SyllableInfo['type'];
		verse?: number;
		versesInfo?: VerseSyllable[];
	}
): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
		pitch: { step: 'C', octave: 4, alter: 0 },
		...(syllable
			? {
					syllable: {
						id: `s-${id}`,
						text: syllable.text,
						type: syllable.type,
						verseNumber: syllable.verse ?? 1,
						wordContext: syllable.text,
						...(syllable.versesInfo ? { versesInfo: syllable.versesInfo } : {})
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

describe('sungVerseNumbers', () => {
	it('returns [] for a score with no lyrics', () => {
		expect(sungVerseNumbers(scoreOf([note('a1'), rest('r1'), note('a2')]))).toEqual([]);
	});

	it('returns [1] for a single-verse score (derived from the notes, not defaulted)', () => {
		const s = scoreOf([
			note('n1', { text: 'вас', type: 'whole' }),
			note('n2', { text: 'нет', type: 'whole' })
		]);
		expect(sungVerseNumbers(s)).toEqual([1]);
	});

	it('collects every verse present in versesInfo, ascending and deduped', () => {
		const s = scoreOf([
			note('m1', {
				text: 'вас',
				type: 'whole',
				versesInfo: [
					{ verseNumber: 1, text: 'вас', type: 'whole' },
					{ verseNumber: 3, text: 'дом', type: 'whole' },
					{ verseNumber: 2, text: 'сад', type: 'whole' }
				]
			})
		]);
		expect(sungVerseNumbers(s)).toEqual([1, 2, 3]);
	});

	it('unions a sparse verse carried only by a single-verse primary on some notes', () => {
		// m1: verses 1 and 2 sing (versesInfo present). m2: only verse 2 sings,
		// stored as the primary with no versesInfo (the §A.98 sparse case). The
		// union is [1, 2], and m2's fallback path is what recovers verse 2 there.
		const s = scoreOf([
			note('m1', {
				text: 'вас',
				type: 'whole',
				versesInfo: [
					{ verseNumber: 1, text: 'вас', type: 'whole' },
					{ verseNumber: 2, text: 'го', type: 'start' }
				]
			}),
			note('m2', { text: 'ре', type: 'end', verse: 2 })
		]);
		expect(sungVerseNumbers(s)).toEqual([1, 2]);
	});

	it('ignores rests and note-less melisma continuations', () => {
		const s = scoreOf([
			rest('r1'),
			note('n1', { text: 'вас', type: 'whole' }),
			note('n2') // melisma continuation, no syllable
		]);
		expect(sungVerseNumbers(s)).toEqual([1]);
	});
});
