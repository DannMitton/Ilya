/**
 * seatTokens: the three rules of the stage 1 harness (4.4), on tokens and
 * notes made by hand. Note ids are 10, 11, 12, ... so a test cannot pass by
 * confusing an id with a position.
 */
import { describe, expect, it } from 'vitest';
import { kindOf, seatTokens, type NotePlace, type SeatRule, type Token } from './underlay-seat';

/** A token whose box is 40 px wide and centred on x. */
const tok = (text: string, x: number, width = 40): Token => ({ text, x0: x - width / 2, x1: x + width / 2 });

/** Notes in bar 1 at the given x, ids from 10. */
const bar1 = (...xs: number[]): NotePlace[] => xs.map((x, i) => ({ id: 10 + i, x, bar: 1 }));

const RULES: SeatRule[] = ['nearest', 'order', 'monotone'];

/** The note id each syllable token sits on, in x order. */
const noteIds = (tokens: Token[], notes: NotePlace[], rule: SeatRule) =>
	seatTokens(tokens, notes, rule)
		.filter((s) => s.kind === 'syllable')
		.map((s) => s.note);

describe('seatTokens, equal counts', () => {
	const notes = bar1(100, 200, 300, 400, 500);
	const tokens = [tok('Ком', 100), tok('нат', 200), tok('ка', 300), tok('тес', 400), tok('ная', 500)];

	it.each(RULES)('%s seats each token under its own note', (rule) => {
		expect(noteIds(tokens, notes, rule)).toEqual([10, 11, 12, 13, 14]);
	});

	it('says which rule placed each token', () => {
		expect(seatTokens(tokens, notes, 'nearest').every((s) => s.by === 'nearest')).toBe(true);
		expect(seatTokens(tokens, notes, 'order').every((s) => s.by === 'order')).toBe(true);
		expect(seatTokens(tokens, notes, 'monotone').every((s) => s.by === 'monotone')).toBe(true);
	});

	it('gives the token\'s centre less the note\'s x as the offset', () => {
		const seats = seatTokens([tok('a', 112), tok('b', 195)], bar1(100, 200), 'nearest');
		expect(seats.map((s) => s.offset)).toEqual([12, -5]);
	});

	it('returns tokens in x order with their own index, whatever order they came in', () => {
		const seats = seatTokens([tok('b', 200), tok('a', 100)], bar1(100, 200), 'nearest');
		expect(seats.map((s) => [s.token, s.text, s.note])).toEqual([[1, 'a', 10], [0, 'b', 11]]);
	});

	it('does not need the notes in x order', () => {
		const notes = [{ id: 12, x: 300, bar: 1 }, { id: 10, x: 100, bar: 1 }, { id: 11, x: 200, bar: 1 }];
		for (const rule of RULES) expect(noteIds([tok('a', 100), tok('b', 200), tok('c', 300)], notes, rule)).toEqual([10, 11, 12]);
	});

	it('seats a token midway between two notes on the left one', () => {
		expect(noteIds([tok('a', 150)], bar1(100, 200), 'nearest')).toEqual([10]);
	});
});

describe('seatTokens, one melisma', () => {
	// Five notes; the third is tied into, so four syllables stand under five notes.
	const notes: NotePlace[] = [
		{ id: 10, x: 100, bar: 1 },
		{ id: 11, x: 200, bar: 1 },
		{ id: 12, x: 300, bar: 1, tiedInto: true },
		{ id: 13, x: 400, bar: 1 },
		{ id: 14, x: 500, bar: 1 },
	];
	const tokens = [tok('Ком', 100), tok('нат', 200), tok('ка', 400), tok('тес', 500)];

	it.each(RULES)('%s leaves the tied note without a token', (rule) => {
		expect(noteIds(tokens, notes, rule)).toEqual([10, 11, 13, 14]);
	});

	it('order uses the tie, where nearest and monotone cannot: a syllable printed 10 px past the tie\'s head', () => {
		const drifted = [tok('Ком', 100), tok('нат', 200), tok('ка', 310)];
		const withTie: NotePlace[] = [...notes.slice(0, 2), notes[2], { id: 13, x: 400, bar: 1 }];
		expect(noteIds(drifted, withTie, 'nearest')).toEqual([10, 11, 12]);
		expect(noteIds(drifted, withTie, 'monotone')).toEqual([10, 11, 12]);
		expect(noteIds(drifted, withTie, 'order')).toEqual([10, 11, 13]);
	});

	it('order reads a note under an extender as it reads a tie', () => {
		const under = notes.map((n) => (n.tiedInto ? { ...n, tiedInto: false, underExtender: true } : n));
		expect(noteIds([tok('Ком', 100), tok('нат', 200), tok('ка', 310), tok('тес', 500)], under, 'order')).toEqual([10, 11, 13, 14]);
	});

	it('order falls back to nearest in a bar whose count differs, and says so', () => {
		const untied = notes.map((n) => ({ ...n, tiedInto: false }));
		const seats = seatTokens(tokens, untied, 'order');
		expect(seats.map((s) => s.by)).toEqual(['nearest', 'nearest', 'nearest', 'nearest']);
		expect(seats.map((s) => s.note)).toEqual([10, 11, 13, 14]);
	});

	it('order falls back where the bar has no sung note at all', () => {
		const allTied = notes.map((n) => ({ ...n, tiedInto: true }));
		expect(seatTokens(tokens, allTied, 'order').map((s) => s.by)).toEqual(['nearest', 'nearest', 'nearest', 'nearest']);
	});
});

describe('seatTokens, a token offset by a head and a half', () => {
	// A head is about 36 px; 54 px is a head and a half. Notes 100 apart.
	const notes = bar1(100, 200, 300);
	const tokens = [tok('Ком', 100), tok('нат', 254), tok('ка', 330)];

	it('nearest puts the offset token on the next note, and marks both tokens as sharing it', () => {
		const seats = seatTokens(tokens, notes, 'nearest');
		expect(seats.map((s) => s.note)).toEqual([10, 12, 12]);
		expect(seats.map((s) => s.shared)).toEqual([false, true, true]);
	});

	it.each(['order', 'monotone'] as const)('%s keeps it on its own note', (rule) => {
		const seats = seatTokens(tokens, notes, rule);
		expect(seats.map((s) => s.note)).toEqual([10, 11, 12]);
		expect(seats.map((s) => s.shared)).toEqual([false, false, false]);
		expect(seats[1].offset).toBe(54);
	});
});

describe('seatTokens, the order rule across bars', () => {
	const notes: NotePlace[] = [
		{ id: 10, x: 100, bar: 1 },
		{ id: 11, x: 200, bar: 1 },
		{ id: 12, x: 300, bar: 2 },
		{ id: 13, x: 400, bar: 2 },
		{ id: 14, x: 500, bar: 2 },
	];

	it('pairs in order in a bar whose count agrees, and falls back in the bar whose count does not', () => {
		// Bar 1: two tokens, two notes: paired. Bar 2: two tokens (one note nearer the bar's edge) for three notes: nearest.
		const seats = seatTokens([tok('a', 100), tok('b', 230), tok('c', 330), tok('d', 480)], notes, 'order');
		expect(seats.map((s) => [s.note, s.by])).toEqual([
			[10, 'order'],
			[11, 'order'],
			[12, 'nearest'],
			[14, 'nearest'],
		]);
	});

	it('counts a token in the bar of its nearest note', () => {
		// 'b' stands at 255: nearest note 300 (bar 2). Bar 1 then holds one token for two notes and is seated by
		// nearest; bar 2 holds three tokens for three notes and is paired in order.
		const seats = seatTokens([tok('a', 100), tok('b', 255), tok('c', 330), tok('d', 430)], notes, 'order');
		expect(seats.map((s) => [s.note, s.by])).toEqual([
			[10, 'nearest'],
			[12, 'order'],
			[13, 'order'],
			[14, 'order'],
		]);
	});
});

describe('seatTokens, the monotone rule', () => {
	it('keeps order and lets a note go without a token', () => {
		const seats = seatTokens([tok('a', 95), tok('b', 405), tok('c', 495)], bar1(100, 200, 300, 400, 500), 'monotone');
		expect(seats.map((s) => s.note)).toEqual([10, 13, 14]);
	});

	it('never lets two tokens share a note, where nearest does', () => {
		const tokens = [tok('a', 190), tok('b', 210)];
		expect(noteIds(tokens, bar1(100, 200, 300), 'nearest')).toEqual([11, 11]);
		expect(noteIds(tokens, bar1(100, 200, 300), 'monotone')).toEqual([11, 12]);
	});

	it('seats the in-order subset of least cost where tokens outnumber notes, and returns the rest unseated with their index', () => {
		// Four tokens for two notes (100, 200): the cheapest in-order pair is b@105 and c@195.
		const tokens = [tok('a', 60), tok('b', 105), tok('c', 195), tok('d', 260)];
		const seats = seatTokens(tokens, bar1(100, 200), 'monotone');
		expect(seats.map((s) => [s.token, s.text, s.note, s.unseated])).toEqual([
			[0, 'a', null, true],
			[1, 'b', 10, false],
			[2, 'c', 11, false],
			[3, 'd', null, true],
		]);
		expect(seats.filter((s) => !s.unseated).every((s) => s.by === 'monotone' && !s.shared)).toBe(true);
		expect(seats.filter((s) => s.unseated).every((s) => s.by === 'monotone' && s.offset === null)).toBe(true);
	});

	it('keeps order in the surplus case: a cheaper pair that crosses is not taken', () => {
		// Tokens are taken in x order: b on 100, a on 200, and c, the farthest, is left over.
		const seats = seatTokens([tok('a', 190), tok('b', 110), tok('c', 400)], bar1(100, 200), 'monotone');
		expect(seats.map((s) => [s.text, s.note])).toEqual([['b', 10], ['a', 11], ['c', null]]);
	});

	it('leaves the surplus token at the end of the row unseated', () => {
		const seats = seatTokens([tok('a', 100), tok('b', 200), tok('c', 300)], bar1(100, 200), 'monotone');
		expect(seats.map((s) => [s.token, s.note, s.unseated])).toEqual([[0, 10, false], [1, 11, false], [2, null, true]]);
	});

	it('leaves the surplus token in the middle of the row unseated, and seats the ones around it', () => {
		const seats = seatTokens([tok('a', 100), tok('b', 150), tok('c', 200)], bar1(100, 200), 'monotone');
		expect(seats.map((s) => [s.token, s.note, s.unseated])).toEqual([[0, 10, false], [1, null, true], [2, 11, false]]);
	});

	it('leaves the surplus token at the start of the row unseated', () => {
		const seats = seatTokens([tok('a', 40), tok('b', 100), tok('c', 200)], bar1(100, 200), 'monotone');
		expect(seats.map((s) => [s.token, s.note, s.unseated])).toEqual([[0, null, true], [1, 10, false], [2, 11, false]]);
	});

	it('does not fold a surplus token onto a neighbour: no note holds two', () => {
		const seats = seatTokens([tok('a', 100), tok('b', 102), tok('c', 104), tok('d', 200)], bar1(100, 200), 'monotone');
		const seated = seats.filter((s) => s.note !== null);
		expect(new Set(seated.map((s) => s.note)).size).toBe(seated.length);
		expect(seated).toHaveLength(2);
		expect(seats.filter((s) => s.unseated).map((s) => s.token).sort()).toEqual([1, 2]);
		expect(seats.every((s) => !s.shared)).toBe(true);
	});

	it('leaves no token unseated, and no note without one, at equal counts', () => {
		const seats = seatTokens([tok('a', 100), tok('b', 200)], bar1(100, 200), 'monotone');
		expect(seats.map((s) => s.unseated)).toEqual([false, false]);
	});

	it('does not mark a hyphen, an extender, or a mark unseated', () => {
		const seats = seatTokens([tok('a', 100), tok('-', 150, 10), tok('b', 200), tok('c', 300)], bar1(100, 200), 'monotone');
		expect(seats.map((s) => [s.text, s.unseated])).toEqual([['a', false], ['-', false], ['b', false], ['c', true]]);
	});

	it('takes the alignment of least total distance', () => {
		const seats = seatTokens([tok('a', 180), tok('b', 260)], bar1(150, 200, 270), 'monotone');
		expect(seats.map((s) => s.note)).toEqual([11, 12]);
	});
});

describe('seatTokens, two syllables run together', () => {
	it('seats a token holding «су-е» on one note, whole, and reports it', () => {
		// One box 100 px wide over two notes at 100 and 160, its centre (140) nearer the second.
		const run: Token = { text: 'су-е', x0: 90, x1: 190 };
		const seats = seatTokens([run, tok('ты,', 300)], bar1(100, 160, 300), 'nearest');
		expect(seats).toHaveLength(2);
		expect(seats[0]).toMatchObject({ text: 'су-е', note: 11, runTogether: true });
		expect(seats[1]).toMatchObject({ text: 'ты,', note: 12, runTogether: false });
	});

	it('does not split it under any rule, and leaves the other note without a token', () => {
		const run: Token = { text: 'Ком.нат', x0: 80, x1: 180 };
		for (const rule of RULES) {
			const seats = seatTokens([run], bar1(100, 160), rule);
			expect(seats).toHaveLength(1);
			expect(seats[0].runTogether).toBe(true);
			expect(seats[0].text).toBe('Ком.нат');
		}
	});

	it('does not call a mark at the end of a syllable a run together', () => {
		const seats = seatTokens([tok('ты,', 100), tok('читъ!', 200), tok('-ры', 300), tok('ма-', 400)], bar1(100, 200, 300, 400), 'nearest');
		expect(seats.map((s) => s.runTogether)).toEqual([false, false, false, false]);
	});

	it('does not call two tokens whose boxes overlap one token', () => {
		const seats = seatTokens([{ text: 'су-', x0: 80, x1: 140 }, { text: 'е', x0: 120, x1: 180 }], bar1(100, 160), 'monotone');
		expect(seats.map((s) => [s.text, s.note, s.runTogether])).toEqual([['су-', 10, false], ['е', 11, false]]);
	});
});

describe('seatTokens, tokens that are not syllables', () => {
	const tokens = [tok('Ком', 100), tok('-', 150, 10), tok('нат', 200), tok('___', 260, 80), tok('.', 330, 6)];

	it('returns a lone hyphen, an extender, and a mark in their place, seated on nothing', () => {
		const seats = seatTokens(tokens, bar1(100, 200), 'monotone');
		expect(seats.map((s) => [s.text, s.kind, s.note, s.by, s.offset])).toEqual([
			['Ком', 'syllable', 10, 'monotone', 0],
			['-', 'joint', null, null, null],
			['нат', 'syllable', 11, 'monotone', 0],
			['___', 'extender', null, null, null],
			['.', 'mark', null, null, null],
		]);
	});

	it('does not count them against the notes: a hyphen standing on a head takes no seat from the syllable beside it', () => {
		const seats = seatTokens([tok('Ком', 100), tok('-', 200, 10), tok('нат', 205)], bar1(100, 200), 'monotone');
		expect(seats.filter((s) => s.kind === 'syllable').map((s) => [s.text, s.note, s.unseated])).toEqual([
			['Ком', 10, false],
			['нат', 11, false],
		]);
	});

	it.each([
		['Ком', 'syllable'],
		['ты,', 'syllable'],
		['ѣ', 'syllable'],
		['-', 'joint'],
		['–', 'joint'],
		['--', 'joint'],
		['_', 'extender'],
		['____', 'extender'],
		['.', 'mark'],
		[',', 'mark'],
		['', 'mark'],
		['1', 'mark'],
	] as const)('reads «%s» as %s', (text, kind) => {
		expect(kindOf(text)).toBe(kind);
	});
});

describe('seatTokens, nothing to seat', () => {
	it.each(RULES)('%s seats no token where the row has no notes', (rule) => {
		const seats = seatTokens([tok('Ком', 100)], [], rule);
		expect(seats).toHaveLength(1);
		expect(seats[0]).toMatchObject({ kind: 'syllable', note: null, offset: null, by: null, unseated: true });
	});

	it.each(RULES)('%s returns nothing for no tokens', (rule) => {
		expect(seatTokens([], bar1(100, 200), rule)).toEqual([]);
	});
});
