/**
 * Row 181 step 4: the join (`poem-join.ts`). The walk's cases, a repeat and an omission, a hand-edited word, the one-vowel
 * refusals, and mutants on the tier order and the bracket rule. The dictionary and the slot count are stubs.
 */
import { describe, expect, it } from 'vitest';
import { applyProposals, crossCheck, distance, isClose, planJoin, type By, type JoinInput, type JoinRun, type SlotLike } from './poem-join';

const REAL = new Set(['мыла', 'средь', 'шумного', 'бала', 'в', 'тревоге', 'мирской', 'или', 'иль', 'дума', 'мысль', 'весел', 'день', 'тебя', 'люблю', 'грустно']);
const VOWELS = /[аеёиоуыэюя]/giu;

/** A stub of `buildSlotQueue`: one slot per vowel letter; a word with none (a clitic) has none. */
const slotsOf = (words: readonly string[]): SlotLike[] => words.flatMap((w, word) => (w.match(VOWELS) ?? []).map((cyrillic) => ({ word, cyrillic })));
const input = (lyrics: string, poem: string, extra: Partial<JoinInput> = {}): JoinInput => ({ lyrics, poem, slotsOf, isWord: (w) => REAL.has(w), ...extra });
const run = (over: Partial<JoinRun>): JoinRun => ({ id: 'r1', kind: 'blank', afterWord: 1, beforeWord: 2, needs: [2], bars: [3, 3], ...over });
const POEM = 'Средь шумного бала, в тревоге мирской';

describe('distance and isClose', () => {
	it('counts letters apart, and a confusion pair of the same length as close', () => {
		expect(distance('иль', 'или')).toBe(1);
		expect(isClose('иль', 'или')).toBe(true);
		expect(isClose('весел', 'вес')).toBe(false); // two letters apart
		expect(isClose('вссел', 'весел')).toBe(true); // е and с are a confusion pair
		expect(isClose('дума', 'мысль')).toBe(false);
		expect(isClose('дума', 'дума')).toBe(false);
	});
});

describe('tier 1: repair', () => {
	it('puts the poem\'s word where the scan gave a word the dictionary does not know, when the slot counts are equal', () => {
		const inp = input('Средь шумного бапа в тревоге мирской', POEM);
		const r = planJoin(inp);
		expect(r.proposals).toEqual([{ kind: 'repair', lyricsToken: 2, poemToken: 2, from: 'бапа', to: 'бала' }]);
		const applied = applyProposals(inp, r);
		expect(applied.text).toBe('Средь шумного бала в тревоге мирской');
		expect(applied.written.map((w) => [applied.text.slice(w.start, w.end), w.kind, w.was])).toEqual([['бала', 'repair', 'бапа']]);
	});

	it('is not gated on the character set: a garble of real Cyrillic letters is repaired too (amendment 5)', () => {
		expect(planJoin(input('Средь шумного бупи в тревоге мирской', POEM)).proposals.map((p) => p.kind)).toEqual(['repair']);
	});

	it('keeps the scan\'s punctuation at the word\'s ends', () => {
		const inp = input('Средь шумного «бапа», в тревоге мирской', POEM);
		expect(applyProposals(inp, planJoin(inp)).text).toBe('Средь шумного «бала», в тревоге мирской');
	});

	it('leaves the word and offers when the slot counts differ', () => {
		const r = planJoin(input('Средь шумного бпл в тревоге мирской', POEM));
		expect(r.proposals).toEqual([{ kind: 'offer', lyricsToken: 2, poemToken: 2, why: 'count' }]);
	});

	it('repairs a garbled repeat from the poem word the repeat stands for (amendment 10)', () => {
		const r = planJoin(input('мыла мила день', 'мыла день'));
		expect(r.proposals).toEqual([{ kind: 'repair', lyricsToken: 1, poemToken: 0, from: 'мила', to: 'мыла' }]);
		expect(r.aligned.get(1)).toEqual({ poem: 0, how: 'repeat' });
	});

	it('proposes nothing for a plain repeat of a real word, which stays coloured as a repeat', () => {
		expect(planJoin(input('весел весел день', 'весел день')).proposals).toEqual([]);
	});
});

describe('tiers 2 and 3: the composer\'s word, and the offer', () => {
	it('keeps the composer\'s real word where it is far from the poem\'s', () => {
		expect(planJoin(input('дума', 'мысль')).proposals).toEqual([{ kind: 'keep-composer', lyricsToken: 0, poemToken: 0 }]);
	});

	it('offers, never applies, where both are real and one letter apart («иль» for «или»): the composer\'s word stays', () => {
		const inp = input('иль', 'или');
		const r = planJoin(inp);
		expect(r.proposals).toEqual([{ kind: 'offer', lyricsToken: 0, poemToken: 0, why: 'real-close' }]);
		expect(applyProposals(inp, r).text).toBe('иль');
	});

	it('keeps the composer\'s real word where the poem\'s is not in the dictionary (a poetic form)', () => {
		const r = planJoin(input('дума', 'думка'));
		expect(r.proposals.map((p) => p.kind)).toEqual(['keep-composer']);
	});

	it('offers where both fail', () => {
		expect(planJoin(input('ббб', 'ввв')).proposals).toEqual([{ kind: 'offer', lyricsToken: 0, poemToken: 0, why: 'both-fail' }]);
	});

	it('mutant: the tier-3 test comes before the tier-2 keep, or «иль» would be kept as a far word and never offered', () => {
		expect(planJoin(input('иль', 'или')).proposals[0].kind).toBe('offer');
		expect(planJoin(input('дума', 'мысль')).proposals[0].kind).toBe('keep-composer');
	});
});

describe('a word the singer typed or placed by hand', () => {
	const hand = (): (i: number) => By => (i) => (i === 2 ? 'hand' : 'print');

	it('is never repaired, and gets an offer only where provably wrong', () => {
		const plain = planJoin(input('Средь шумного бапа в тревоге мирской', POEM, { by: hand() }));
		expect(plain.proposals).toEqual([]);
		const wrong = planJoin(input('Средь шумного бaла в тревоге мирской', POEM, { by: hand() })); // a Latin a
		expect(wrong.proposals).toEqual([{ kind: 'offer', lyricsToken: 2, poemToken: 2, why: 'hand-wrong' }]);
		expect(applyProposals(input('Средь шумного бaла в тревоге мирской', POEM), wrong).text).toBe('Средь шумного бaла в тревоге мирской');
	});

	it('leaves a word this join already wrote alone', () => {
		const r = planJoin(input('Средь шумного бапа в тревоге мирской', POEM, { by: (i) => (i === 2 ? 'poem' : 'print') }));
		expect(r.proposals).toEqual([]);
	});
});

describe('the runs: blank notes and unread systems', () => {
	const lyrics = 'Средь шумного тревоге мирской';

	it('fills a run with the poem\'s words between its anchors when their slot count is the run\'s (a clitic takes no note)', () => {
		const inp = input(lyrics, POEM, { runs: [run({})] });
		const r = planJoin(inp);
		expect(r.proposals).toEqual([{ kind: 'fill', run: 'r1', afterWord: 1, poemFrom: 2, poemTo: 3, slots: 2 }]);
		const applied = applyProposals(inp, r);
		expect(applied.text).toBe('Средь шумного бала, в тревоге мирской');
		expect(applied.written.map((w) => applied.text.slice(w.start, w.end))).toEqual(['бала, в']);
	});

	it('refuses a run whose count is not the poem\'s: an offer, nothing applied, the words named for the Loupe', () => {
		const r = planJoin(input(lyrics, POEM, { runs: [run({ needs: [3] })] }));
		expect(r.proposals).toEqual([{ kind: 'offer', lyricsToken: null, poemToken: null, run: 'r1', why: 'count-refused', poemFrom: 2, poemTo: 3 }]);
		expect(applyProposals(input(lyrics, POEM), r).text).toBe(lyrics);
	});

	it('mutant: the bracket is the poem words p+1 .. q-1, no more and no fewer', () => {
		// needs [2] is the count of «бала в»; a bracket that took one word too many (3) or too few (1) must not pass.
		expect(planJoin(input(lyrics, POEM, { runs: [run({ needs: [3] })] })).proposals[0].kind).toBe('offer');
		expect(planJoin(input(lyrics, POEM, { runs: [run({ needs: [1] })] })).proposals[0].kind).toBe('offer');
		expect(planJoin(input(lyrics, POEM, { runs: [run({ needs: [2] })] })).proposals[0].kind).toBe('fill');
	});

	it('tests an unread system on both counts, ties alone and ties with the slur, and proposes where one matches', () => {
		expect(planJoin(input(lyrics, POEM, { runs: [run({ kind: 'unread', needs: [3, 2] })] })).proposals[0].kind).toBe('fill');
		expect(planJoin(input(lyrics, POEM, { runs: [run({ kind: 'unread', needs: [5, 4] })] })).proposals[0].kind).toBe('offer');
	});

	it('takes the song\'s start and end as anchors', () => {
		const start = planJoin(input('тревоге мирской', 'Средь шумного бала в тревоге мирской', { runs: [run({ afterWord: -1, beforeWord: 0, needs: [6] })] }));
		expect(start.proposals[0]).toMatchObject({ kind: 'fill', poemFrom: 0, poemTo: 3 });
		const text = applyProposals(input('тревоге мирской', 'Средь шумного бала в тревоге мирской'), start).text;
		expect(text).toBe('Средь шумного бала в тревоге мирской');
		const end = planJoin(input('Средь шумного бала в', POEM, { runs: [run({ afterWord: 3, beforeWord: 4, needs: [5] })] }));
		expect(end.proposals[0]).toMatchObject({ kind: 'fill', poemFrom: 4, poemTo: 5 });
	});

	it('offers, and does not fill, where the run is a composer\'s repeat with no words read (q = p+1), or the anchors are out of order, or one is unaligned', () => {
		expect(planJoin(input('Средь шумного бала в тревоге мирской', POEM, { runs: [run({ afterWord: 1, beforeWord: 2, needs: [1] })] })).proposals[0]).toMatchObject({ kind: 'offer', why: 'repeat' });
		// A repeat is aligned to the earlier poem word, so a run before it has its anchors out of order.
		expect(planJoin(input('Средь шумного шумного тревоге', POEM, { runs: [run({ afterWord: 1, beforeWord: 2 })] })).proposals[0]).toMatchObject({ kind: 'offer', why: 'order' });
		expect(planJoin(input('Средь жжж тревоге', POEM, { runs: [run({ afterWord: 1, beforeWord: 2 })] })).proposals[0]).toMatchObject({ kind: 'offer', why: 'unanchored' });
		expect(planJoin(input(lyrics, POEM, { runs: [run({ afterWord: 1, beforeWord: 1 })] })).proposals[0]).toMatchObject({ kind: 'offer', why: 'inside-word' });
	});

	it('makes no offer to fill from a poem that is not there', () => {
		expect(planJoin(input(lyrics, '', { runs: [run({})] })).proposals).toEqual([{ kind: 'offer', lyricsToken: null, poemToken: null, run: 'r1', why: 'no-poem' }]);
	});

	it('leaves a composer\'s omission alone: poem words the song never sets, with no run, propose nothing', () => {
		expect(planJoin(input(lyrics, POEM)).proposals).toEqual([]);
	});
});

describe('every proposal passes the one-vowel check', () => {
	const twoVowels = (words: readonly string[]): SlotLike[] => words.map((_, word) => ({ word, cyrillic: 'аб' + 'а' })); // one slot, two vowels
	const vowelless = (words: readonly string[]): SlotLike[] => words.map((_, word) => ({ word, cyrillic: 'тст' })); // one slot, no vowel

	it('drops a repair whose slot has two vowels, or none, and counts it', () => {
		for (const stub of [twoVowels, vowelless]) {
			const r = planJoin(input('Средь шумного бапа в тревоге мирской', POEM, { slotsOf: stub }));
			expect(r.proposals.filter((p) => p.kind === 'repair')).toEqual([]);
			expect(r.dropped.repair).toBe(1);
		}
	});

	it('drops a fill whose slots break it, counts it, and offers instead', () => {
		const r = planJoin(input('Средь шумного тревоге мирской', POEM, { runs: [run({ needs: [2] })], slotsOf: () => [{ word: 0, cyrillic: 'аа' }, { word: 0, cyrillic: 'б' }] }));
		expect(r.proposals).toEqual([{ kind: 'offer', lyricsToken: null, poemToken: null, run: 'r1', why: 'vowel', poemFrom: 2, poemTo: 3 }]);
		expect(r.dropped.fill).toBe(1);
	});
});

describe('the cross-check', () => {
	it('finds nothing to repair a second time in its own output', () => {
		const inp = input('Средь шумного бапа в тревоге мирской', POEM);
		const r = planJoin(inp);
		expect(crossCheck(inp, r)).toEqual({ text: 'Средь шумного бала в тревоге мирской', fault: 0 });
	});

	it('reports a fault when a second pass would still repair (a plan that did not apply)', () => {
		const inp = input('Средь шумного бапа в тревоге мирской', POEM);
		const none = { ...planJoin(inp), proposals: [] };
		expect(crossCheck(inp, none).fault).toBe(1);
	});

	/* Integration step 7d: the second pass reads who wrote each word, as the first did. A hand word the first pass left alone is no fault. */
	it('does not count a hand word as a fault, though a second pass that took it for the print would repair it', () => {
		const inp = input('Средь шумного бапа в тревоге мирской', POEM, { by: (i) => (i === 2 ? 'hand' : 'print') });
		const r = planJoin(inp);
		expect(r.proposals).toEqual([]);
		expect(crossCheck(inp, r)).toEqual({ text: 'Средь шумного бапа в тревоге мирской', fault: 0 });
		// With no `by`, the same words are the print's and are repaired: that is the mistake the hand mark prevents.
		expect(planJoin(input('Средь шумного бапа в тревоге мирской', POEM)).proposals.map((p) => p.kind)).toEqual(['repair']);
	});

	it('is deterministic: the same input gives the same plan', () => {
		const inp = input('Средь шумного бапа тревоге мирской', POEM, { runs: [run({ afterWord: 2, beforeWord: 3, needs: [2] })] });
		expect(planJoin(inp)).toEqual(planJoin(inp));
	});

	it('never writes the poem: the join takes it as text and returns none', () => {
		const inp = input('Средь шумного бапа в тревоге мирской', POEM);
		const before = inp.poem;
		applyProposals(inp, planJoin(inp));
		expect(inp.poem).toBe(before);
	});
});
