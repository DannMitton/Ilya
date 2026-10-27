import { expect, it } from 'vitest';
import { unitEnd, terminalSlotIndex, breakTarget, type UnitWord } from './syntactic-break-unit';

// w('p') proclitic, w('e') enclitic, w('h') hyphen to next, w('') plain.
const w = (flags = ''): UnitWord => ({ isProclitic: flags.includes('p'), isEnclitic: flags.includes('e'), hyphenToNext: flags.includes('h') });
const line = (...f: string[]) => f.map(w);

// Tables. Each reads as a line of words; the answer is the unit's last word.
it('plain words: each is its own unit', () => {
	const l = line('', '', '');
	expect([0, 1, 2].map((i) => unitEnd(l, i))).toEqual([0, 1, 2]);
});
it('proclitic chain leans onto its host: не в силах', () => {
	const l = line('p', 'p', '', '');
	expect([0, 1, 2, 3].map((i) => unitEnd(l, i))).toEqual([2, 2, 2, 3]);
});
it('enclitic leans back: сказал бы', () => {
	const l = line('', 'e', '');
	expect([0, 1, 2].map((i) => unitEnd(l, i))).toEqual([1, 1, 2]);
});
it('hyphen host plus particle: велит-ли', () => {
	const l = line('h', '', '');
	expect([0, 1, 2].map((i) => unitEnd(l, i))).toEqual([1, 1, 2]);
});
it('enclitic chain and hyphen together', () => {
	const l = line('h', 'e', 'e', '');
	expect([0, 1, 2, 3].map((i) => unitEnd(l, i))).toEqual([2, 2, 2, 3]);
});
it('proclitic, host, enclitic: one unit', () => {
	const l = line('p', '', 'e', '');
	expect([0, 1, 2, 3].map((i) => unitEnd(l, i))).toEqual([2, 2, 2, 3]);
});
it('a proclitic after a plain word begins the next unit', () => {
	const l = line('', 'p', '');
	expect([0, 1, 2].map((i) => unitEnd(l, i))).toEqual([0, 2, 2]);
});
it('a hyphen into a proclitic keeps leaning forward', () => {
	const l = line('h', 'p', '');
	expect([0, 1, 2].map((i) => unitEnd(l, i))).toEqual([2, 2, 2]);
});
it('proclitic as the last word has nothing to lean on: stays', () => {
	expect(unitEnd(line('', 'p'), 1)).toBe(1);
});
it('hyphen on the last word is ignored', () => {
	expect(unitEnd(line('', 'h'), 1)).toBe(1);
});
it('bad input returns null, never throws', () => {
	const l = line('', '');
	for (const bad of [-1, 2, 1.5, NaN, Infinity]) expect(unitEnd(l, bad)).toBe(null);
	expect(unitEnd([], 0)).toBe(null);
});

// Oracle: union-find over adjacent links, written independently of unitEnd.
function oracle(words: UnitWord[], at: number): number {
	const link = (i: number) => words[i].isProclitic || words[i].hyphenToNext || words[i + 1].isEnclitic;
	let end = at;
	while (end < words.length - 1 && link(end)) end++;
	return end;
}
let seed = 20261021;
const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
const randomLine = (): UnitWord[] =>
	Array.from({ length: 1 + Math.floor(rnd() * 9) }, () => ({
		isProclitic: rnd() < 0.2, isEnclitic: rnd() < 0.2, hyphenToNext: rnd() < 0.15,
	}));

it('property: 20000 random lines, results agree with the oracle and the laws hold', () => {
	for (let t = 0; t < 20000; t++) {
		const l = randomLine();
		for (let i = 0; i < l.length; i++) {
			const r = unitEnd(l, i)!;
			expect(r).toBe(oracle(l, i));
			expect(r >= i && r < l.length).toBe(true);              // never moves left, never leaves the line
			expect(unitEnd(l, r)).toBe(r);                   // idempotent
			for (let j = i; j <= r; j++) expect(unitEnd(l, j)).toBe(r); // one answer for the whole unit
		}
	}
});

it('terminalSlotIndex: last syllable of the unit, same line only', () => {
	const slots = [
		{ origin: { lineIndex: 0, wordIndex: 0 } }, { origin: { lineIndex: 0, wordIndex: 0 } }, // word 0, two syllables
		{ origin: { lineIndex: 0, wordIndex: 1 } },                                              // word 1
		{ origin: { lineIndex: 1, wordIndex: 0 } },                                              // next line
	];
	expect(terminalSlotIndex(slots, 0, 0, 0)).toBe(1); // tap first syllable of a polysyllabic word: jumps to its last
	expect(terminalSlotIndex(slots, 0, 0, 1)).toBe(2); // a unit of two words
	expect(terminalSlotIndex(slots, 0, 2, 2)).toBe(null); // a vowelless word with no slot of its own: none in range
	expect(terminalSlotIndex(slots, 1, 0, 0)).toBe(3);
});


// breakTarget: the syllable the squircle jumps to, from any syllable of the unit.
const sl = (lineIndex: number, wordIndex: number) => ({ origin: { lineIndex, wordIndex } });
it('breakTarget: song 1 m. 4, a tap on ляд jumps to я (тень | неп-рог-ляд-на-я)', () => {
	const lines = [line('', '')];
	const slots = [sl(0, 0), sl(0, 1), sl(0, 1), sl(0, 1), sl(0, 1), sl(0, 1)];
	for (const tapped of [1, 2, 3, 4, 5]) expect(breakTarget(lines, slots, tapped)).toEqual({ lineIndex: 0, wordIndex: 1, slotIndex: 5 });
	expect(breakTarget(lines, slots, 0)).toEqual({ lineIndex: 0, wordIndex: 0, slotIndex: 0 });
});
it('breakTarget: a hyphened particle owns its own syllable, and the jump lands on it', () => {
	const lines = [line('h', '', '')]; // ве-лит- ли, then a word
	const slots = [sl(0, 0), sl(0, 0), sl(0, 1), sl(0, 2)];
	expect(breakTarget(lines, slots, 0)!.slotIndex).toBe(2);
	expect(breakTarget(lines, slots, 2)!.slotIndex).toBe(2);
	expect(breakTarget(lines, slots, 3)!.slotIndex).toBe(3);
});
it('breakTarget: a vowelless enclitic has no slot, the host syllable that carries it is the target', () => {
	const lines = [line('', 'e', '')];  // host, б (no slot), next word
	const slots = [sl(0, 0), sl(0, 0), sl(0, 2)];
	expect(breakTarget(lines, slots, 0)).toEqual({ lineIndex: 0, wordIndex: 1, slotIndex: 1 });
});
it('breakTarget: a proclitic tap lands on its host, never leaves the line', () => {
	const lines = [line('', 'p', ''), line('')];
	const slots = [sl(0, 0), sl(0, 2), sl(0, 2), sl(1, 0)];
	expect(breakTarget(lines, slots, 1)!.slotIndex).toBe(2);
	expect(breakTarget(lines, slots, 3)!.slotIndex).toBe(3);
});
it('breakTarget: bad input returns null', () => {
	const lines = [line('')];
	const slots = [sl(0, 0)];
	for (const bad of [-1, 1, 0.5, NaN]) expect(breakTarget(lines, slots, bad)).toBe(null);
	expect(breakTarget([], slots, 0)).toBe(null);
});
it('property: breakTarget agrees with unitEnd and stays inside the unit, on random songs', () => {
	for (let t = 0; t < 3000; t++) {
		const lines = Array.from({ length: 1 + Math.floor(rnd() * 3) }, randomLine);
		const slots: { origin: { lineIndex: number; wordIndex: number } }[] = [];
		lines.forEach((l, li) => l.forEach((_, wi) => { const k = rnd() < 0.2 ? 0 : 1 + Math.floor(rnd() * 3); for (let s = 0; s < k; s++) slots.push(sl(li, wi)); }));
		for (let k = 0; k < slots.length; k++) {
			const r = breakTarget(lines, slots, k)!;
			const { lineIndex, wordIndex } = slots[k].origin;
			expect(r.wordIndex).toBe(unitEnd(lines[lineIndex], wordIndex));
			expect(r.slotIndex >= k).toBe(true);                                  // jumps forward or stays
			expect(slots[r.slotIndex].origin.lineIndex).toBe(lineIndex);   // same line
			expect(slots[r.slotIndex].origin.wordIndex <= r.wordIndex).toBe(true);  // inside the unit
			const nx = slots[r.slotIndex + 1];
			expect(!(nx && nx.origin.lineIndex === lineIndex && nx.origin.wordIndex <= r.wordIndex)).toBe(true); // it is the LAST syllable of the unit
			expect(breakTarget(lines, slots, r.slotIndex)!.slotIndex).toEqual(r.slotIndex); // idempotent
		}
	}
});
