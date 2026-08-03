/**
 * Diction-mark folding tests.
 *
 * The fixture below is the real shape of the defect, transcribed from Sunless 4
 * measures around note 70 (Cyrillic against IPA, read from the score on
 * 2026-07-30). Expected values come from what the Russian actually is, never
 * from the module: ⟨на⟩ is [nɑ] and ⟨прав⟩ is [ˈprɑ] whatever this code does.
 *
 * Every behavioural claim is paired with a negative control (V2-A).
 */

import { describe, expect, it } from 'vitest';
import {
	PHONATION_BREAK_MARK,
	foldDictionMarks,
	phonationBreakEventIds,
	vowelResolverAbstentions,
} from './diction-marks';
import type { ParsedScore, SyllableInfo, VocalLineEvent } from './types';

function ev(id: string, cyr?: [string, SyllableInfo['type']], ipa?: [string, SyllableInfo['type']]): VocalLineEvent {
	const base = {
		id,
		type: 'note' as const,
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter' as const, dots: 0, fraction: { numerator: 1, denominator: 4 } },
		pitch: { step: 'C' as const, octave: 4, alter: 0 },
	};
	if (!cyr && !ipa) return base as VocalLineEvent;
	const versesInfo = [
		...(cyr ? [{ verseNumber: 1, text: cyr[0], type: cyr[1] }] : []),
		...(ipa ? [{ verseNumber: 2, text: ipa[0], type: ipa[1] }] : []),
	];
	return {
		...base,
		syllable: {
			id: `s-${id}`,
			text: versesInfo[0].text,
			type: versesInfo[0].type,
			verseNumber: versesInfo[0].verseNumber,
			versesInfo,
		},
	} as VocalLineEvent;
}

function scoreOf(vocalLine: VocalLineEvent[]): ParsedScore {
	return { vocalLine, measures: [], tempoMarkings: [] } as unknown as ParsedScore;
}

/** The real defect, transcribed from Sunless 4 around note 70. */
function sunless4Shape(): ParsedScore {
	return scoreOf([
		ev('n69', ['я', 'end'], ['jɑ', 'end']),
		ev('n70', ['на', 'whole'], ['#', 'whole']),
		ev('n71', ['прав', 'start'], ['nɑ', 'whole']),
		ev('n72', ['ду', 'end'], ['ˈprɑ', 'start']),
		ev('n73', ['и', 'whole'], ['ˈdu', 'end']),
	]);
}

const ipaOf = (score: ParsedScore, id: string) =>
	score.vocalLine.find((e) => e.id === id)?.syllable?.versesInfo?.find((v) => v.verseNumber === 2)?.text;
const cyrOf = (score: ParsedScore, id: string) =>
	score.vocalLine.find((e) => e.id === id)?.syllable?.versesInfo?.find((v) => v.verseNumber === 1)?.text;

describe('folding # out of the syllable slot', () => {
	it('puts each syllable back on the note its Cyrillic names', () => {
		const { score } = foldDictionMarks(sunless4Shape());
		// Before: ⟨на⟩ carried '#' and ⟨прав⟩ carried [nɑ]. After, each word has its own.
		expect(ipaOf(score, 'n70')).toBe('nɑ');
		expect(cyrOf(score, 'n70')).toBe('на');
		expect(ipaOf(score, 'n71')).toBe('ˈprɑ');
		expect(cyrOf(score, 'n71')).toBe('прав');
		expect(ipaOf(score, 'n72')).toBe('ˈdu');
		expect(cyrOf(score, 'n72')).toBe('ду');
	});

	it('concatenates the mark onto the preceding phoneme rather than discarding it', () => {
		// Dann's ruling: the boundary must survive where it separates the two
		// phonemes, so a later pass can still stop assimilation across it.
		const { score } = foldDictionMarks(sunless4Shape());
		expect(ipaOf(score, 'n69')).toBe(`jɑ${PHONATION_BREAK_MARK}`);
		// And no slot anywhere still holds the bare mark.
		const bare = score.vocalLine.filter((e) =>
			e.syllable?.versesInfo?.some((v) => v.text === PHONATION_BREAK_MARK),
		);
		expect(bare).toHaveLength(0);
	});

	it('carries the syllabic role with the text it belongs to', () => {
		const { score } = foldDictionMarks(sunless4Shape());
		const roleOf = (id: string) =>
			score.vocalLine.find((e) => e.id === id)?.syllable?.versesInfo?.find((v) => v.verseNumber === 2)?.type;
		expect(roleOf('n70')).toBe('whole'); // [nɑ] was 'whole' on n71 and stays 'whole'
		expect(roleOf('n71')).toBe('start'); // [ˈprɑ] was 'start' and stays 'start'
	});

	it('reports the break anchored to the note it follows, for phonationBreak', () => {
		const fold = foldDictionMarks(sunless4Shape());
		expect(fold.breaks).toHaveLength(1);
		expect(fold.breaks[0].afterEventId).toBe('n69');
		expect(fold.breaks[0].vacatedEventId).toBe('n70');
		expect(fold.breaks[0].verseNumber).toBe(2);
		expect([...phonationBreakEventIds(fold)]).toEqual(['n69']);
	});

	it('leaves the tail ABSENT rather than inventing a syllable for it', () => {
		// Closing a gap costs the verse one entry at the end. That note has no
		// text in this verse and must abstain.
		const { score, vacatedTailEvents } = foldDictionMarks(sunless4Shape());
		expect(vacatedTailEvents).toBe(1);
		expect(ipaOf(score, 'n73')).toBeUndefined();
		expect(cyrOf(score, 'n73')).toBe('и'); // the untouched verse keeps its own
	});

	it('repairs only the verse that carries a mark, never its neighbour', () => {
		const fold = foldDictionMarks(sunless4Shape());
		expect(fold.affectedVerses).toEqual([2]);
		for (const id of ['n69', 'n70', 'n71', 'n72', 'n73']) {
			expect(cyrOf(fold.score, id)).toBe(cyrOf(sunless4Shape(), id));
		}
	});

	it('closes by exactly one note per mark, not by one for the whole score', () => {
		const s = scoreOf([
			ev('a', ['1', 'whole'], ['a', 'whole']),
			ev('b', ['2', 'whole'], ['#', 'whole']),
			ev('c', ['3', 'whole'], ['b', 'whole']),
			ev('d', ['4', 'whole'], ['#', 'whole']),
			ev('e', ['5', 'whole'], ['c', 'whole']),
			ev('f', ['6', 'whole'], ['d', 'whole']),
		]);
		const { score, breaks, vacatedTailEvents } = foldDictionMarks(s);
		expect(breaks).toHaveLength(2);
		// Each mark folds onto whatever precedes it IN THE UNDERLAY SEQUENCE, not
		// onto whatever precedes it on the page. Here the second mark directly
		// follows syllable [b] in the sequence, so both breaks land early and the
		// tail loses two entries rather than one.
		expect(ipaOf(score, 'a')).toBe('a#');
		expect(ipaOf(score, 'b')).toBe('b#');
		expect(ipaOf(score, 'c')).toBe('c');
		expect(ipaOf(score, 'd')).toBe('d');
		expect(ipaOf(score, 'e')).toBeUndefined();
		expect(ipaOf(score, 'f')).toBeUndefined();
		expect(vacatedTailEvents).toBe(2);
		expect(breaks.map((b) => b.afterEventId)).toEqual(['a', 'b']);
	});

	it('steps over a melisma note instead of shifting a syllable onto it', () => {
		// A note with no lyric at all is a melisma continuation. Closing the gap
		// must not fill it: that was the defect in the first attempt at this
		// measurement, which collapsed the melisma holes along with the marks.
		const s = scoreOf([
			ev('a', ['ты', 'whole'], ['tɨ', 'whole']),
			ev('mel'), // no syllable in any verse
			ev('b', ['и', 'whole'], ['#', 'whole']),
			ev('c', ['да', 'whole'], ['i', 'whole']),
			ev('d', ['но', 'whole'], ['dɑ', 'whole']),
		]);
		const { score } = foldDictionMarks(s);
		expect(score.vocalLine.find((e) => e.id === 'mel')?.syllable).toBeUndefined();
		expect(ipaOf(score, 'a')).toBe('tɨ#');
		expect(ipaOf(score, 'b')).toBe('i');
		expect(ipaOf(score, 'c')).toBe('dɑ');
	});

	it('NEGATIVE CONTROL: a score with no mark is returned BY REFERENCE, untouched', () => {
		// The repair must be a provable no-op where there is nothing to repair.
		// Sunless 2 is this case in the real corpus and it is the control that
		// makes the other five songs' improvement believable.
		const s = scoreOf([ev('a', ['да', 'whole'], ['dɑ', 'whole']), ev('b', ['нет', 'whole'], ['ɲɛt', 'whole'])]);
		const fold = foldDictionMarks(s);
		expect(fold.score).toBe(s); // identity, not a deep-equal copy
		expect(fold.breaks).toEqual([]);
		expect(fold.shiftedEvents).toBe(0);
		expect(fold.vacatedTailEvents).toBe(0);
	});

	it('NEGATIVE CONTROL: the input score is never mutated', () => {
		const s = sunless4Shape();
		const before = JSON.stringify(s);
		foldDictionMarks(s);
		expect(JSON.stringify(s)).toBe(before);
	});

	it('NEGATIVE CONTROL: a different mark leaves # alone, and vice versa', () => {
		// A mark is a parameter, not a hardcoded assumption about one corpus.
		const s = sunless4Shape();
		const other = foldDictionMarks(s, { mark: '§' });
		expect(other.score).toBe(s);
		expect(other.breaks).toEqual([]);
		expect(() => foldDictionMarks(s, { mark: '' })).toThrow(/non-empty mark/);
	});

	it('handles a mark in the very first slot, where there is nothing to anchor to', () => {
		const s = scoreOf([ev('a', ['—', 'whole'], ['#', 'whole']), ev('b', ['да', 'whole'], ['dɑ', 'whole'])]);
		const { score, breaks } = foldDictionMarks(s);
		expect(breaks).toHaveLength(1);
		expect(breaks[0].afterEventId).toBeUndefined(); // no predecessor: no false anchor
		expect(ipaOf(score, 'a')).toBe('dɑ');
	});

	it('refuses a malformed score rather than returning an empty repair', () => {
		expect(() => foldDictionMarks({ vocalLine: undefined } as unknown as ParsedScore)).toThrow(/ParsedScore/);
	});
});

describe('the vacated tail must be distinguishable from a melisma', () => {
	it('names the vacated events so a resolver can abstain instead of carrying a vowel', () => {
		// A vacated event and a melisma event both carry no lyric after the fold,
		// and they mean opposite things. Measured cost of confusing them: 1.6
		// percentage points of per-vowel agreement, silently.
		const s = scoreOf([
			ev('a', ['да', 'whole'], ['dɑ', 'whole']),
			ev('b', ['и', 'whole'], ['#', 'whole']),
			ev('c', ['но', 'whole'], ['i', 'whole']),
			ev('d', ['ты', 'whole'], ['no', 'whole']),
		]);
		const fold = foldDictionMarks(s);
		const skip = vowelResolverAbstentions(fold, 2);
		expect([...skip]).toEqual(['d']);
		expect(fold.vacatedTailEventIds).toEqual([{ eventId: 'd', verseNumber: 2 }]);
	});

	it('NEGATIVE CONTROL: a genuine melisma is NOT listed as an abstention', () => {
		const s = scoreOf([
			ev('a', ['да', 'whole'], ['dɑ', 'whole']),
			ev('mel'), // melisma: sustains [ɑ], must NOT be skipped
			ev('b', ['и', 'whole'], ['#', 'whole']),
			ev('c', ['но', 'whole'], ['i', 'whole']),
		]);
		const fold = foldDictionMarks(s);
		const skip = vowelResolverAbstentions(fold, 2);
		expect(skip.has('mel')).toBe(false);
		expect(skip.has('c')).toBe(true);
	});

	it('NEGATIVE CONTROL: a verse with no mark contributes no abstentions', () => {
		const s = scoreOf([ev('a', ['да', 'whole'], ['dɑ', 'whole'])]);
		expect([...vowelResolverAbstentions(foldDictionMarks(s), 2)]).toEqual([]);
		expect([...vowelResolverAbstentions(foldDictionMarks(sunless4Shape()), 1)]).toEqual([]);
	});
});
