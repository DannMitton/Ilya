import assert from 'node:assert/strict';
import { unitEnd, toggleBreak, normalizeBreaks, terminalSlotIndex, breakTarget, type UnitWord } from './syntactic-break-unit';

let passed = 0;
const test = (name: string, fn: () => void) => {
	try { fn(); passed++; } catch (e) { console.log('FAIL', name, (e as Error).message); process.exitCode = 1; }
};
// w('p') proclitic, w('e') enclitic, w('h') hyphen to next, w('') plain.
const w = (flags = ''): UnitWord => ({ isProclitic: flags.includes('p'), isEnclitic: flags.includes('e'), hyphenToNext: flags.includes('h') });
const line = (...f: string[]) => f.map(w);

// Tables. Each reads as a line of words; the answer is the unit's last word.
test('plain words: each is its own unit', () => {
	const l = line('', '', '');
	assert.deepEqual([0, 1, 2].map((i) => unitEnd(l, i)), [0, 1, 2]);
});
test('proclitic chain leans onto its host: не в силах', () => {
	const l = line('p', 'p', '', '');
	assert.deepEqual([0, 1, 2, 3].map((i) => unitEnd(l, i)), [2, 2, 2, 3]);
});
test('enclitic leans back: сказал бы', () => {
	const l = line('', 'e', '');
	assert.deepEqual([0, 1, 2].map((i) => unitEnd(l, i)), [1, 1, 2]);
});
test('hyphen host plus particle: велит-ли', () => {
	const l = line('h', '', '');
	assert.deepEqual([0, 1, 2].map((i) => unitEnd(l, i)), [1, 1, 2]);
});
test('enclitic chain and hyphen together', () => {
	const l = line('h', 'e', 'e', '');
	assert.deepEqual([0, 1, 2, 3].map((i) => unitEnd(l, i)), [2, 2, 2, 3]);
});
test('proclitic, host, enclitic: one unit', () => {
	const l = line('p', '', 'e', '');
	assert.deepEqual([0, 1, 2, 3].map((i) => unitEnd(l, i)), [2, 2, 2, 3]);
});
test('a proclitic after a plain word begins the next unit', () => {
	const l = line('', 'p', '');
	assert.deepEqual([0, 1, 2].map((i) => unitEnd(l, i)), [0, 2, 2]);
});
test('a hyphen into a proclitic keeps leaning forward', () => {
	const l = line('h', 'p', '');
	assert.deepEqual([0, 1, 2].map((i) => unitEnd(l, i)), [2, 2, 2]);
});
test('proclitic as the last word has nothing to lean on: stays', () => {
	assert.equal(unitEnd(line('', 'p'), 1), 1);
});
test('hyphen on the last word is ignored', () => {
	assert.equal(unitEnd(line('', 'h'), 1), 1);
});
test('bad input returns null, never throws', () => {
	const l = line('', '');
	for (const bad of [-1, 2, 1.5, NaN, Infinity]) assert.equal(unitEnd(l, bad), null);
	assert.equal(unitEnd([], 0), null);
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

test('property: 20000 random lines, results agree with the oracle and the laws hold', () => {
	for (let t = 0; t < 20000; t++) {
		const l = randomLine();
		for (let i = 0; i < l.length; i++) {
			const r = unitEnd(l, i)!;
			assert.equal(r, oracle(l, i));
			assert.ok(r >= i && r < l.length);              // never moves left, never leaves the line
			assert.equal(unitEnd(l, r), r);                   // idempotent
			for (let j = i; j <= r; j++) assert.equal(unitEnd(l, j), r); // one answer for the whole unit
		}
	}
});

test('toggleBreak inserts on the unit end from any syllable, then removes from any other', () => {
	const l = line('h', '', '');            // велит-ли, then a word
	const a = toggleBreak([], l, 0)!;        // tap the host
	assert.deepEqual([a.breaks, a.end, a.action], [[1], 1, 'insert']);
	const b = toggleBreak(a.breaks, l, 1)!;  // tap the particle
	assert.deepEqual([b.breaks, b.end, b.action], [[], 1, 'remove']);
	assert.equal(toggleBreak([], l, 7), null);
});
test('normalizeBreaks moves, drops, and merges', () => {
	const l = line('h', '', '', 'p', '');
	assert.deepEqual(normalizeBreaks([0, 1, 2, 9, -1], l), [1, 2]);
	assert.deepEqual(normalizeBreaks(normalizeBreaks([0, 3], l), l), normalizeBreaks([0, 3], l));
});
test('property: normalizeBreaks is idempotent and lands only on unit ends', () => {
	for (let t = 0; t < 5000; t++) {
		const l = randomLine();
		const raw = Array.from({ length: 4 }, () => Math.floor(rnd() * (l.length + 2)) - 1);
		const n = normalizeBreaks(raw, l);
		assert.deepEqual(normalizeBreaks(n, l), n);
		for (const b of n) assert.equal(unitEnd(l, b), b);
	}
});

test('terminalSlotIndex: last syllable of the unit, same line only', () => {
	const slots = [
		{ origin: { lineIndex: 0, wordIndex: 0 } }, { origin: { lineIndex: 0, wordIndex: 0 } }, // word 0, two syllables
		{ origin: { lineIndex: 0, wordIndex: 1 } },                                              // word 1
		{ origin: { lineIndex: 1, wordIndex: 0 } },                                              // next line
	];
	assert.equal(terminalSlotIndex(slots, 0, 0, 0), 1); // tap first syllable of a polysyllabic word: jumps to its last
	assert.equal(terminalSlotIndex(slots, 0, 0, 1), 2); // a unit of two words
	assert.equal(terminalSlotIndex(slots, 0, 2, 2), null); // a vowelless word with no slot of its own: none in range
	assert.equal(terminalSlotIndex(slots, 1, 0, 0), 3);
});


// breakTarget: the syllable the squircle jumps to, from any syllable of the unit.
const sl = (lineIndex: number, wordIndex: number) => ({ origin: { lineIndex, wordIndex } });
test('breakTarget: song 1 m. 4, a tap on ляд jumps to я (тень | неп-рог-ляд-на-я)', () => {
	const lines = [line('', '')];
	const slots = [sl(0, 0), sl(0, 1), sl(0, 1), sl(0, 1), sl(0, 1), sl(0, 1)];
	for (const tapped of [1, 2, 3, 4, 5]) assert.deepEqual(breakTarget(lines, slots, tapped), { lineIndex: 0, wordIndex: 1, slotIndex: 5 });
	assert.deepEqual(breakTarget(lines, slots, 0), { lineIndex: 0, wordIndex: 0, slotIndex: 0 });
});
test('breakTarget: a hyphened particle owns its own syllable, and the jump lands on it', () => {
	const lines = [line('h', '', '')]; // ве-лит- ли, then a word
	const slots = [sl(0, 0), sl(0, 0), sl(0, 1), sl(0, 2)];
	assert.equal(breakTarget(lines, slots, 0)!.slotIndex, 2);
	assert.equal(breakTarget(lines, slots, 2)!.slotIndex, 2);
	assert.equal(breakTarget(lines, slots, 3)!.slotIndex, 3);
});
test('breakTarget: a vowelless enclitic has no slot, the host syllable that carries it is the target', () => {
	const lines = [line('', 'e', '')];  // host, б (no slot), next word
	const slots = [sl(0, 0), sl(0, 0), sl(0, 2)];
	assert.deepEqual(breakTarget(lines, slots, 0), { lineIndex: 0, wordIndex: 1, slotIndex: 1 });
});
test('breakTarget: a proclitic tap lands on its host, never leaves the line', () => {
	const lines = [line('', 'p', ''), line('')];
	const slots = [sl(0, 0), sl(0, 2), sl(0, 2), sl(1, 0)];
	assert.equal(breakTarget(lines, slots, 1)!.slotIndex, 2);
	assert.equal(breakTarget(lines, slots, 3)!.slotIndex, 3);
});
test('breakTarget: bad input returns null', () => {
	const lines = [line('')];
	const slots = [sl(0, 0)];
	for (const bad of [-1, 1, 0.5, NaN]) assert.equal(breakTarget(lines, slots, bad), null);
	assert.equal(breakTarget([], slots, 0), null);
});
test('property: breakTarget agrees with unitEnd and stays inside the unit, on random songs', () => {
	for (let t = 0; t < 3000; t++) {
		const lines = Array.from({ length: 1 + Math.floor(rnd() * 3) }, randomLine);
		const slots: { origin: { lineIndex: number; wordIndex: number } }[] = [];
		lines.forEach((l, li) => l.forEach((_, wi) => { const k = rnd() < 0.2 ? 0 : 1 + Math.floor(rnd() * 3); for (let s = 0; s < k; s++) slots.push(sl(li, wi)); }));
		for (let k = 0; k < slots.length; k++) {
			const r = breakTarget(lines, slots, k)!;
			const { lineIndex, wordIndex } = slots[k].origin;
			assert.equal(r.wordIndex, unitEnd(lines[lineIndex], wordIndex));
			assert.ok(r.slotIndex >= k);                                  // jumps forward or stays
			assert.equal(slots[r.slotIndex].origin.lineIndex, lineIndex);   // same line
			assert.ok(slots[r.slotIndex].origin.wordIndex <= r.wordIndex);  // inside the unit
			const nx = slots[r.slotIndex + 1];
			assert.ok(!(nx && nx.origin.lineIndex === lineIndex && nx.origin.wordIndex <= r.wordIndex)); // it is the LAST syllable of the unit
			assert.deepEqual(breakTarget(lines, slots, r.slotIndex)!.slotIndex, r.slotIndex); // idempotent
		}
	}
});

console.log(`${passed} tests passed${process.exitCode ? ', with failures' : ''}`);
