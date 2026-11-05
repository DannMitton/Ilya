/**
 * Row 181 step 5: what the join needs from the page (`poem-join-wire.ts`): the token map, the runs of notes with no word, and who
 * placed each word. The lines and events are stubs shaped as the pipeline and the parser give them.
 */
import { describe, expect, it } from 'vitest';
import type { LineData } from '$lib/types';
import type { Pairing, PairingMap } from '$lib/score/pairings';
import { processText } from '$lib/pipeline';
import { buildRuns, byFromScan, describeFailure, tokenMapOf, tokenMapReport, tokensIn, type RunEvent } from './poem-join-wire';

const lines = (...texts: string[][]): LineData[] => texts.map((words, i) => ({ lineNumber: i + 1, words: words.map((cleanWord) => ({ cleanWord, lineIndex: i })) })) as unknown as LineData[];
const syl = (lineIndex: number, wordIndex: number): Pairing => ({ kind: 'syllable', cyrillic: 'x', ipa: 'x', vowel: undefined, origin: { lineIndex, wordIndex, slotIndex: 0, word: 'x' } });
const note = (id: string, measureIndex = 0, extra: Partial<RunEvent> = {}): RunEvent => ({ id, type: 'note', measureIndex, ...extra }) as RunEvent;

describe('tokenMapOf', () => {
	it('places each transcribed word on the LYRICS token it is, across lines', () => {
		const map = tokenMapOf(lines(['Средь', 'шумного'], ['бала']), 'Средь шумного\nбала,');
		expect([...map!.entries()]).toEqual([['0:0', 0], ['0:1', 1], ['1:0', 2]]);
	});

	it('gives null where the words do not line up, so the join does nothing and never guesses', () => {
		expect(tokenMapOf(lines(['Средь', 'шум']), 'Средь шумного')).toBeNull();
		expect(tokenMapOf(lines(['Средь']), 'Средь шумного')).toBeNull();
		expect(tokenMapOf(lines(['Средь', 'шумного', 'бала']), 'Средь шумного')).toBeNull();
	});

	it('skips a token that is only punctuation, on both sides', () => {
		expect(tokenMapOf(lines(['Средь', 'бала']), 'Средь — бала')?.get('0:1')).toBe(2);
	});
});

describe('buildRuns', () => {
	const map = new Map([['0:0', 0], ['0:1', 1], ['0:2', 2]]);
	const evs = (...ids: string[]) => ids.map((id) => note(id));

	it('makes a run of the notes between two words that have none, with the word either side', () => {
		const pairings: PairingMap = { a: syl(0, 0), d: syl(0, 2) };
		const { runs, unmapped } = buildRuns(evs('a', 'b', 'c', 'd'), pairings, map, [], 3);
		expect(unmapped).toBe(0);
		expect(runs).toEqual([{ id: 'run-b', kind: 'blank', afterWord: 0, beforeWord: 2, needs: [2], bars: [1, 1] }]);
	});

	it('takes the song\'s start and end as anchors: -1 before the first word, the token count after the last', () => {
		const pairings: PairingMap = { b: syl(0, 0) };
		const { runs } = buildRuns(evs('a', 'b', 'c'), pairings, map, [], 3);
		expect(runs.map((r) => [r.afterWord, r.beforeWord])).toEqual([[-1, 0], [0, 3]]);
	});

	it('leaves a note under an extender out: its melisma decision makes it a continuation, so the blank stays blank and is no run', () => {
		const pairings: PairingMap = { a: syl(0, 0), b: { kind: 'melisma' }, c: syl(0, 1) };
		expect(buildRuns(evs('a', 'b', 'c'), pairings, map, [], 3).runs).toEqual([]);
	});

	it('leaves a note tied into out, and does not break a run on a rest', () => {
		const events = [note('a'), note('b'), note('t', 0, { tied: { type: 'stop' } }), { id: 'r', type: 'rest', measureIndex: 0 } as RunEvent, note('c'), note('d')];
		const { runs } = buildRuns(events, { a: syl(0, 0), d: syl(0, 1) }, map, [], 3);
		expect(runs.map((r) => r.needs)).toEqual([[2]]);
	});

	it('ends a run at a note the singer decided empty, with no word to anchor on that side', () => {
		const pairings: PairingMap = { a: syl(0, 0), c: { kind: 'empty' }, e: syl(0, 2) };
		const { runs } = buildRuns(evs('a', 'b', 'c', 'd', 'e'), pairings, map, [], 3);
		expect(runs.map((r) => [Number.isNaN(r.afterWord) ? 'nan' : r.afterWord, Number.isNaN(r.beforeWord) ? 'nan' : r.beforeWord])).toEqual([[0, 'nan'], ['nan', 2]]);
	});

	it('counts a syllable the map cannot place, and anchors its neighbours nowhere', () => {
		const { runs, unmapped } = buildRuns(evs('a', 'b'), { a: syl(5, 5) }, map, [], 3);
		expect(unmapped).toBe(1);
		expect(runs).toHaveLength(1);
		expect(Number.isNaN(runs[0].afterWord)).toBe(true);
	});

	it('gives a run two counts where a slur crosses it (amendment 8), and one where none does', () => {
		const events = [note('a'), note('b', 0, { slurs: [{ type: 'start', partnerEventId: 'c' }] as RunEvent['slurs'] }), note('c'), note('d')];
		const { runs } = buildRuns(events, { a: syl(0, 0), d: syl(0, 1) }, map, [], 3);
		expect(runs[0].needs).toEqual([2, 1]);
	});

	it('calls a run in a bar the banner lists an unread system, and counts bars from 1', () => {
		const events = [note('a', 0), note('b', 4), note('c', 5), note('d', 6)];
		const { runs } = buildRuns(events, { a: syl(0, 0), d: syl(0, 1) }, map, [[5, 6]], 3);
		expect(runs[0]).toMatchObject({ kind: 'unread', bars: [5, 6] });
	});
});

describe('byFromScan and tokensIn', () => {
	it('calls a word the score\'s text has the print\'s, one the join wrote the poem\'s, and any other the singer\'s hand', () => {
		const by = byFromScan('Средь шумного бала тут', 'Средь шумного бала', new Set([1]));
		expect([0, 1, 2, 3].map(by)).toEqual(['print', 'poem', 'print', 'hand']);
	});

	it('finds the tokens inside a range, whatever the line breaks', () => {
		expect(tokensIn('Средь шумного\nбала', [{ start: 6, end: 13 }])).toEqual([1]);
		expect(tokensIn('Средь шумного\nбала', [{ start: 0, end: 18 }])).toEqual([0, 1, 2]);
	});
});

describe('tokenMapOf against the real transcription, one synthetic lyric of each shape (row 181 step 8c)', () => {
	const real = (text: string) => tokenMapOf(processText(text), text);

	// Shapes that lined up before and must still: the map has one entry for every transcribed word.
	const lined: Record<string, string> = {
		plain: 'Средь шумного бала, в тревоге мирской',
		'syllable hyphens inside a word': 'Ком-нат-ка тес-ная',
		'a hyphenated word that is no particle': 'кто-то там',
		'a no-break space before a #': 'я\u00A0# на',
		'a # trailing its word': 'я# на',
		'a # alone': 'я # на',
		'a punctuation-only token': 'Средь — бала',
		'«не» before a word': 'не проглядная ночь',
		'pre-reform letters': 'гдѣ мір',
		'an old genitive ending': 'шумнаго бала',
		'ё': 'всё ёлка',
		'guillemets': '«Средь» бала',
		'an ellipsis': 'Средь… бала',
		'a digit': '2 раза',
		'a Latin word': 'hello бала',
		'two lines': 'Средь шумного\nбала в',
		'a blank line': 'Средь\n\nбала',
	};
	for (const [name, text] of Object.entries(lined)) {
		it(`lines up: ${name}`, () => {
			expect(real(text), text).not.toBeNull();
		});
	}

	// Shapes that did NOT line up before step 8c, each found in the code and fixed in `tokenMapReport`.
	it('lines up where the pipeline splits a hyphenated particle off its host: both words are the one Lyrics token (typed-hyphens.ts:146-161)', () => {
		for (const [text, tokens] of [['велит-ли он', ['велитли', 'он']], ['ска-же ты', ['скаже', 'ты']], ['места-б, там', ['местаб', 'там']], ['мог-ль он', ['могль', 'он']], ['так-ж он', ['такж', 'он']], ['ты-бы там', ['тыбы', 'там']]] as const) {
			const lines = processText(text);
			const map = tokenMapOf(lines, text);
			expect(map, text).not.toBeNull();
			expect(lines.flatMap((l) => l.words).length, `${text}: the pipeline made more words than tokens`).toBeGreaterThan(tokens.length);
			// Every word of the host token maps to token 0, and the next token's word to token 1.
			expect([...map!.values()].filter((v) => v === 0).length).toBe(2);
			expect(Math.max(...map!.values())).toBe(1);
		}
	});

	it('lines up where a dash or a bracket stands inside a word, which `fold` keeps and `cleanWord` strips', () => {
		for (const text of ['Сред—ь бала', 'Сред–ь бала', 'Сре(д)ь бала', 'Сре,дь бала']) {
			expect(real(text), text).not.toBeNull();
		}
	});

	it('still refuses what is not the same words, and names the first disagreement', () => {
		const lines = processText('Средь шумного бала');
		const bad = tokenMapReport(lines, 'Средь шумного бал');
		expect(bad.map).toBeNull();
		expect(bad.failure).toMatchObject({ line: 1, word: 2, transcription: 'бала', token: 2, tokenRaw: 'бал', tokenFolded: 'бал', words: 3, tokens: 3 });
		expect(describeFailure(bad.failure!)).toBe('the transcription of Lyrics does not line up with its words, so nothing is joined: at line 1, word 2, the transcription\'s «бала» against Lyrics token 2 «бал» (folded «бал»); 3 transcribed word(s) and 3 Lyrics token(s) with letters');
	});

	it('names a transcription that has more words than Lyrics, and Lyrics that has more tokens', () => {
		const more = tokenMapReport(processText('Средь шумного бала'), 'Средь шумного');
		expect(more.failure).toMatchObject({ line: 1, word: 2, transcription: 'бала', token: null, tokenRaw: null });
		expect(describeFailure(more.failure!)).toContain('against no further token');
		const fewer = tokenMapReport(processText('Средь шумного'), 'Средь шумного бала');
		expect(fewer.failure).toMatchObject({ line: null, token: 2, tokenRaw: 'бала' });
		expect(describeFailure(fewer.failure!)).toContain('after the last transcribed word');
	});

	it('names the words read toward a token that a split word did not complete', () => {
		const f = tokenMapReport(processText('велит-ли он'), 'велит-ли-ка он').failure!;
		expect(f).toMatchObject({ line: 1, word: 2, transcription: 'он', read: 'велитли', token: 0, tokenFolded: 'велитлика' });
	});
});
