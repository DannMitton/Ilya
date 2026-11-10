/**
 * The poem matcher (poem library, build 1, step 3), held to the reference.
 *
 * The library is the committed `data/dictionary.poems.<hash8>.json`; the queries
 * are `tools/poems/fixtures/*.lyrics.txt` (twelve read Lyrics, public-domain
 * poems only); the reference scores are `expected_r2.txt`, written by
 * `tools/poems/reference_sw_match.py`. A score here equals the reference's to
 * three decimals, or the matcher is not the reference.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { decodeOffsets, type PoemEntry, type PoemLibrary } from './poem-library';
import {
	align,
	ENTRY_TIE,
	evaluate,
	foldLetters,
	matchPoem,
	MAX_LENGTH_RATIO,
	MIN_MARGIN,
	MIN_QUERY_LETTERS,
	MIN_SCORE,
	rankWorks,
	SHORTLIST,
	shortlist,
} from './poem-match';

const ROOT = join(__dirname, '../../../../..');
const manifest = JSON.parse(readFileSync(join(ROOT, 'data/dictionary-manifest.json'), 'utf8'));
const library: PoemLibrary = JSON.parse(readFileSync(join(ROOT, 'data', manifest.poemFiles[0]), 'utf8'));
const fixture = (name: string): string => readFileSync(join(ROOT, 'tools/poems/fixtures', `${name}.lyrics.txt`), 'utf8');

interface Expected {
	name: string;
	letters: number;
	top: string;
	topScore: string;
	second: string;
	secondScore: string;
	margin: string;
}
const expected: Expected[] = readFileSync(join(ROOT, 'tools/poems/fixtures/expected_r2.txt'), 'utf8')
	.split('\n')
	.filter((l) => l.trim() !== '')
	.map((l) => {
		const m = /^(\S+)\s+(\d+)l \| (\S+)\s+([\d.]+) \| (\S+)\s+([\d.]+) \| m ([\d.]+)$/.exec(l);
		if (!m) throw new Error(`expected_r2.txt: cannot read "${l}"`);
		return { name: m[1], letters: Number(m[2]), top: m[3], topScore: m[4], second: m[5], secondScore: m[6], margin: m[7] };
	});

describe('the fold (reference_sw_match.py)', () => {
	it('lowercases, folds й ё ѣ і ѳ ѵ, drops ъ, and keeps only а-я', () => {
		expect(foldLetters('Дайте бокалы!')).toBe('даитебокалы');
		expect(foldLetters('ЁЖ Ёлка, Й')).toBe('ежелкаи');
		expect(foldLetters('Ѣсть, міръ, ѳита, ѵижица')).toBe('есть' + 'мир' + 'фита' + 'иижица');
		expect(foldLetters('объявление')).toBe('обявление');
		expect(foldLetters('abc 123 — … «»')).toBe('');
		expect(foldLetters('')).toBe('');
	});

	it('agrees with the build on every entry in the shipped library (poems and libretti)', () => {
		for (const e of library.entries) expect(foldLetters(e.textModern)).toBe(e.letters);
	});
});

describe('align: local alignment, +2 / -1 / -2', () => {
	const toCodes = (s: string) => Uint16Array.from([...s].map((c) => c.charCodeAt(0)));

	/** A plain full-matrix Smith-Waterman with a traceback, to hold the one-row version to. */
	function naive(q: string, p: string): { score: number; qs: number; qe: number; ps: number; pe: number } {
		const H = Array.from({ length: q.length + 1 }, () => new Array<number>(p.length + 1).fill(0));
		let best = 0;
		let bi = 0;
		let bj = 0;
		for (let i = 1; i <= q.length; i += 1) {
			for (let j = 1; j <= p.length; j += 1) {
				H[i][j] = Math.max(0, H[i - 1][j - 1] + (q[i - 1] === p[j - 1] ? 2 : -1), H[i - 1][j] - 2, H[i][j - 1] - 2);
				if (H[i][j] > best) {
					best = H[i][j];
					bi = i;
					bj = j;
				}
			}
		}
		let i = bi;
		let j = bj;
		while (best > 0 && H[i][j] > 0) {
			const here = H[i][j];
			if (here === H[i - 1][j - 1] + (q[i - 1] === p[j - 1] ? 2 : -1)) {
				i -= 1;
				j -= 1;
			} else if (here === H[i - 1][j] - 2) i -= 1;
			else j -= 1;
		}
		return { score: best, qs: i, qe: bi - 1, ps: j, pe: bj - 1 };
	}

	/** A small seeded generator, so a failure repeats. */
	function rng(seed: number): () => number {
		let s = seed;
		return () => {
			s = (s * 1664525 + 1013904223) % 4294967296;
			return s / 4294967296;
		};
	}
	const word = (r: () => number, n: number) => Array.from({ length: n }, () => 'абвгд'[Math.floor(r() * 5)]).join('');

	it('scores as a full-matrix alignment does, on 300 random pairs', () => {
		const r = rng(7);
		for (let k = 0; k < 300; k += 1) {
			const q = word(r, 1 + Math.floor(r() * 30));
			const p = word(r, 1 + Math.floor(r() * 60));
			expect(align(toCodes(q), toCodes(p)).score, `${q} / ${p}`).toBe(naive(q, p).score);
		}
	});

	it('names a stretch that starts and ends on a matched letter and holds the whole score', () => {
		const r = rng(11);
		for (let k = 0; k < 300; k += 1) {
			const q = word(r, 3 + Math.floor(r() * 30));
			const p = word(r, 3 + Math.floor(r() * 60));
			const a = align(toCodes(q), toCodes(p));
			if (a.score === 0) continue;
			expect(q[a.queryStart], `${q} / ${p}`).toBe(p[a.poemStart]);
			expect(q[a.queryEnd], `${q} / ${p}`).toBe(p[a.poemEnd]);
			expect(a.queryStart).toBeLessThanOrEqual(a.queryEnd);
			expect(a.poemStart).toBeLessThanOrEqual(a.poemEnd);
			// Aligning the named stretches alone finds the same score: nothing of the best alignment lies outside them.
			const inside = align(toCodes(q.slice(a.queryStart, a.queryEnd + 1)), toCodes(p.slice(a.poemStart, a.poemEnd + 1)));
			expect(inside.score, `${q} / ${p}`).toBe(a.score);
		}
	});

	it('says so, with no stretch, where nothing matches', () => {
		expect(align(toCodes('абв'), toCodes('еёж'))).toEqual({ score: 0, queryStart: -1, queryEnd: -1, poemStart: -1, poemEnd: -1 });
		expect(align(toCodes(''), toCodes('абв')).score).toBe(0);
		expect(align(toCodes('абв'), toCodes('')).score).toBe(0);
	});
});

describe('every fixture scores as the reference does (expected_r2.txt, three decimals)', () => {
	it('reads the twelve reference rows', () => {
		expect(expected.map((e) => e.name)).toEqual(['P', 'S', 'T', 'U1', 'U4', 'U5', 'U6', 'r114-song1', 'r114-song2', 'r114-song3', 'r114-song4', 'r114-song5']);
	});

	/**
	 * The reference scores every work; the matcher scores the `SHORTLIST` sharing the most trigrams (the library has 42 works, so the
	 * shortlist engages). The TOP work and its score are the reference's on all twelve rows. A second work outside the shortlist is
	 * not seen, so the matcher's second is never above the reference's, and on one row (U4, a song with no library poem) it is a
	 * different work. That row does not fill either way (its top is below the floor), and the test pins it.
	 */
	const SECOND_DIFFERS = ['U4'];

	for (const e of expected) {
		it(`${e.name}: ${e.letters} letters, top work ${e.top} ${e.topScore}, second ${e.second} ${e.secondScore}, margin ${e.margin}`, () => {
			const letters = foldLetters(fixture(e.name));
			expect(letters.length).toBe(e.letters);
			const ranked = rankWorks(letters, library);
			expect(ranked[0].work).toBe(e.top);
			expect(ranked[0].score.toFixed(3)).toBe(e.topScore);
			if (SECOND_DIFFERS.includes(e.name)) {
				expect(ranked[1].work).not.toBe(e.second);
				expect(ranked[1].score).toBeLessThanOrEqual(Number(e.secondScore) + 0.0005);
				expect(matchPoem(fixture(e.name), library)).toBeNull();
			} else {
				expect(ranked[1].work).toBe(e.second);
				expect(ranked[1].score.toFixed(3)).toBe(e.secondScore);
				expect((ranked[0].score - ranked[1].score).toFixed(3)).toBe(e.margin);
			}
		});
	}
});

describe('when it fills', () => {
	it('fills P, S, T, U1, U6, and row 114 songs 2 to 5', () => {
		for (const name of ['P', 'S', 'T', 'U1', 'U6', 'r114-song2', 'r114-song3', 'r114-song4', 'r114-song5']) {
			expect(matchPoem(fixture(name), library), name).not.toBeNull();
		}
	});

	it('names the poem each fixture sets', () => {
		const title = (name: string) => matchPoem(fixture(name), library)?.entry.title;
		expect(title('r114-song2')).toBe('Весёлый час');
		expect(title('r114-song3')).toBe('Могила');
		expect(title('r114-song4')).toBe('Русская песня');
		expect(title('S')).toBe('Мцыри');
		expect(title('U1')).toBe('В четырёх стенах');
	});

	it('fills nothing for U4, U5, and row 114 song 1 (no poem in the library): below the score rule', () => {
		for (const name of ['U4', 'U5', 'r114-song1']) {
			const o = evaluate(fixture(name), library);
			expect(o.ok, name).toBe(false);
			if (!o.ok) expect(o.reason, name).toBe('low-score');
		}
	});

	it('fills nothing for a five-song concatenation of fixtures', () => {
		const sets = [
			['r114-song1', 'r114-song2', 'r114-song3', 'r114-song4', 'r114-song5'],
			['S', 'T', 'U1', 'U6', 'P'],
			['r114-song2', 'r114-song3', 'r114-song4', 'r114-song5', 'U1'],
			['U4', 'U5', 'r114-song1', 'U4', 'U5'],
		];
		for (const names of sets) expect(matchPoem(names.map(fixture).join('\n'), library), names.join('+')).toBeNull();
	});

	it('refuses a Lyrics more than three times the poem, whatever its score and margin (amendment 12)', () => {
		const e = library.entries.find((x) => x.title === 'Весёлый час')!;
		const times = (n: number) => Array.from({ length: n }, () => e.textModern).join('\n');
		const three = evaluate(times(3), library);
		expect(three.ok).toBe(true); // exactly 3 x: allowed
		const four = evaluate(times(4), library);
		expect(four.ok).toBe(false);
		if (!four.ok) {
			expect(four.reason).toBe('too-long');
			// The control that makes this test able to fail: the score and the margin alone would have filled it.
			expect(four.top!.score).toBeGreaterThanOrEqual(MIN_SCORE);
			expect(four.top!.score - (four.second?.score ?? 0)).toBeGreaterThanOrEqual(MIN_MARGIN);
		}
	});

	it('the rules are the brief’s numbers, and the desk’s floor', () => {
		expect([MIN_SCORE, MIN_MARGIN, MAX_LENGTH_RATIO, SHORTLIST, ENTRY_TIE]).toEqual([0.15, 0.1, 3, 20, 0.01]);
		expect(MIN_QUERY_LETTERS).toBe(80);
	});

	it('answers null for no letters', () => {
		expect(evaluate('', library)).toEqual({ ok: false, reason: 'empty' });
		expect(evaluate('Hello, world 123', library)).toEqual({ ok: false, reason: 'empty' });
	});

	it('refuses a Lyrics of fewer than 80 letters, though a stretch of it stands word for word in a poem', () => {
		const e = library.entries.find((x) => x.title === 'Мцыри')!;
		// 6 letters taken from «Мцыри» itself: a perfect local score, which is the failure the floor is for.
		const word = e.textModern.slice(2000, 2040).replace(/[^А-Яа-яЁё]/g, '').slice(0, 6);
		expect(evaluate(word, library)).toEqual({ ok: false, reason: 'too-short' });
		expect(matchPoem('Привет', library)).toBeNull();
		// The control: with the floor lifted by length, the same words fill. 80 letters from the same place:
		const long = e.textModern.slice(2000, 2200).replace(/[^А-Яа-яЁё]/g, '').slice(0, MIN_QUERY_LETTERS);
		expect(foldLetters(long).length).toBe(MIN_QUERY_LETTERS);
		expect(evaluate(long, library).ok).toBe(true);
		expect(evaluate(long.slice(0, MIN_QUERY_LETTERS - 1), library)).toEqual({ ok: false, reason: 'too-short' });
	});

	it('the floor is measured: windows cut from the three songs with no library poem', () => {
		const windows = (k: number): string[] => {
			const out: string[] = [];
			for (const name of ['U4', 'U5', 'r114-song1']) {
				const letters = foldLetters(fixture(name));
				for (let at = 0; at + k <= letters.length; at += Math.max(1, Math.floor(k / 4))) out.push(letters.slice(at, at + k));
			}
			return out;
		};
		// The floor lifted (the rules without it), to count what it holds back.
		const fills = (k: number) => windows(k).filter((w) => {
			const o = evaluate(w, library);
			return o.ok || o.reason !== 'too-short' ? o.ok : evaluateWithoutFloor(w);
		}).length;
		function evaluateWithoutFloor(w: string): boolean {
			const ranked = rankWorks(foldLetters(w), library);
			const second = ranked[1]?.score ?? 0;
			return ranked[0].score >= MIN_SCORE && ranked[0].score - second >= MIN_MARGIN && w.length <= MAX_LENGTH_RATIO * ranked[0].entry.letters.length;
		}
		// The control: without the floor, short windows of songs that have no poem here do fill.
		// (Row 182: with 42 works there is more to compete with, so fewer short windows fill: 213 of 963 and 40 of 313, from 440 and 94.)
		expect(fills(6)).toBeGreaterThan(100); // 213 of 963 when measured on the library of 42 works
		expect(fills(15)).toBeGreaterThan(20); // 40 of 313
		// At the floor and above, none do, with or without it.
		expect(fills(MIN_QUERY_LETTERS)).toBe(0);
		expect(fills(100)).toBe(0);
		for (const w of windows(MIN_QUERY_LETTERS)) expect(matchPoem(w, library)).toBeNull();
	}, 60_000); // about 10 s with 42 works (3 s with 13): the same 2,300 matches over a library three times as long

	it('keeps every song in the build set: the shortest true fixture has 113 letters', () => {
		const lengths = ['P', 'S', 'T', 'U1', 'U6', 'r114-song2', 'r114-song3', 'r114-song4', 'r114-song5'].map((n) => foldLetters(fixture(n)).length);
		expect(Math.min(...lengths)).toBe(113);
		expect(Math.min(...lengths)).toBeGreaterThan(MIN_QUERY_LETTERS);
	});

	it('refuses by margin when two works fit alike', () => {
		const a = library.entries.find((x) => x.title === 'Могила')!;
		const twin: PoemEntry = { ...a, id: 'twin', work: 'twin-work' };
		const two: PoemLibrary = { version: 1, entries: [a, twin] };
		const o = evaluate(fixture('r114-song3'), two);
		expect(o.ok).toBe(false);
		if (!o.ok) expect(o.reason).toBe('low-margin');
	});
});

describe('which entry of a work fills (amendment 10)', () => {
	const hymn = library.entries.filter((e) => e.work === 'f1a88510');

	it('the library holds a pre-reform and a modern entry of one work', () => {
		expect(hymn.map((e) => e.spelling).sort()).toEqual(['modern', 'pre-reform']);
	});

	it('takes the modern entry when the two score within 0.01', () => {
		const m = matchPoem(fixture('r114-song5'), library)!;
		expect(m.work).toBe('f1a88510');
		expect(m.entry.spelling).toBe('modern');
	});

	it('takes the modern entry when the pre-reform one scores a little higher, within 0.01', () => {
		const pre = hymn.find((e) => e.spelling === 'pre-reform')!;
		// The modern text is the pre-reform text with one letter changed: a slightly lower score, listed second.
		const at = pre.textModern.indexOf('а');
		const textModern = pre.textModern.slice(0, at) + 'о' + pre.textModern.slice(at + 1);
		const modern: PoemEntry = { ...pre, id: 'modern-twin', spelling: 'modern', textModern, letters: foldLetters(textModern) };
		const lib: PoemLibrary = { version: 1, entries: [pre, modern] };
		const ranked = rankWorks(foldLetters(pre.textModern), lib);
		const scoreOf = (id: string) => align(Uint16Array.from([...foldLetters(pre.textModern)].map((c) => c.charCodeAt(0))), Uint16Array.from([...(id === pre.id ? pre.letters : modern.letters)].map((c) => c.charCodeAt(0)))).score / (2 * pre.letters.length);
		expect(scoreOf(pre.id) - scoreOf(modern.id)).toBeGreaterThan(0); // the pre-reform entry is the higher
		expect(scoreOf(pre.id) - scoreOf(modern.id)).toBeLessThan(ENTRY_TIE); // ... by less than the tie
		expect(ranked[0].entry.id).toBe('modern-twin');
		expect(ranked[0].score).toBeCloseTo(scoreOf(pre.id), 10); // the work still scores as its best entry does
	});

	it('takes the pre-reform entry when it scores clearly better', () => {
		const pre = hymn.find((e) => e.spelling === 'pre-reform')!;
		const modern = hymn.find((e) => e.spelling === 'modern')!;
		// A modern entry cut to half its text scores about half as well on the whole poem.
		const half = modern.textModern.slice(0, Math.floor(modern.textModern.length / 2));
		const worse: PoemEntry = { ...modern, textModern: half, letters: foldLetters(half), at: [] };
		let here = 0;
		const offsets: number[] = [];
		for (let i = 0; i < half.length; i += 1) if (foldLetters(half[i]) !== '') offsets.push(i);
		for (const o of offsets) {
			worse.at.push(o - here);
			here = o;
		}
		const lib: PoemLibrary = { version: 1, entries: [worse, pre] };
		const m = matchPoem(pre.textModern, lib)!;
		expect(m.entry.id).toBe(pre.id);
		expect(m.entry.spelling).toBe('pre-reform');
	});
});

describe('the matched stretch (amendment 1)', () => {
	it('is where the Lyrics sit in the poem: offsets map to the first and last matched letters', () => {
		for (const name of ['P', 'S', 'T', 'U1', 'U6', 'r114-song2', 'r114-song3', 'r114-song4', 'r114-song5']) {
			const m = matchPoem(fixture(name), library)!;
			const offsets = decodeOffsets(m.entry.at);
			expect(m.start, name).toBe(offsets[m.letterStart]);
			expect(m.end, name).toBe(offsets[m.letterEnd] + 1);
			expect(m.start, name).toBeGreaterThanOrEqual(0);
			expect(m.end, name).toBeLessThanOrEqual(m.entry.textModern.length);
			expect(m.start, name).toBeLessThan(m.end);
			expect(foldLetters(m.entry.textModern[m.start]), name).toBe(m.entry.letters[m.letterStart]);
			expect(foldLetters(m.entry.textModern[m.end - 1]), name).toBe(m.entry.letters[m.letterEnd]);
		}
	});

	it('fixture S sets a passage of «Мцыри»: the fish’s song, a small part of the poem', () => {
		const m = matchPoem(fixture('S'), library)!;
		const stretch = m.entry.textModern.slice(m.start, m.end);
		expect(stretch).toContain('Останься здесь со мной');
		expect(m.end - m.start).toBeLessThan(m.entry.textModern.length / 10);
		expect(m.start).toBeGreaterThan(0);
	});

	it('row 114 song 2 sets the whole of «Весёлый час»', () => {
		const m = matchPoem(fixture('r114-song2'), library)!;
		const len = m.entry.textModern.length;
		expect(m.end - m.start).toBeGreaterThan(len * 0.9);
	});
});

describe('the shortlist (a large library on a phone)', () => {
	/** A seeded stand-in for a large library: `n` invented works of about 300 letters. */
	function invented(n: number): PoemEntry[] {
		let s = 99;
		const next = () => {
			s = (s * 1664525 + 1013904223) % 4294967296;
			return s / 4294967296;
		};
		return Array.from({ length: n }, (_, k) => {
			const letters = Array.from({ length: 300 }, () => String.fromCharCode(0x430 + Math.floor(next() * 32))).join('');
			return {
				id: `inv${k}`,
				work: `inv${k}`,
				title: 'x',
				incipit: 'x',
				author: 'x',
				translator: null,
				source: { site: 's', url: 'u' },
				spelling: 'modern' as const,
				verified: false,
				textModern: letters,
				letters,
				at: letters.split('').map((_, i) => (i === 0 ? 0 : 1)),
			};
		});
	}
	const big: PoemLibrary = { version: 1, entries: [...library.entries, ...invented(200)] };

	it('with 20 works or fewer, the shortlist is everything (the 14 poems are 13 works)', () => {
		const poems: PoemLibrary = { version: 1, entries: library.entries.filter((e) => e.kind === undefined) };
		expect(shortlist(foldLetters(fixture('P')), poems).size).toBe(13);
		const firstTwenty = new Set(library.entries.map((e) => e.work)).values();
		const keep = new Set(Array.from({ length: 20 }, () => firstTwenty.next().value));
		const twenty: PoemLibrary = { version: 1, entries: library.entries.filter((e) => keep.has(e.work)) };
		expect(shortlist(foldLetters(fixture('P')), twenty).size).toBe(20);
	});

	it('row 182: the shipped library has 42 works, so the shortlist engages, and each fixture\'s poem lands in it', () => {
		expect(new Set(library.entries.map((e) => e.work)).size).toBe(42);
		for (const name of ['P', 'S', 'T', 'U1', 'U4', 'U5', 'U6', 'r114-song1', 'r114-song2', 'r114-song3', 'r114-song4', 'r114-song5']) {
			expect(shortlist(foldLetters(fixture(name)), library).size, name).toBe(SHORTLIST);
		}
		for (const name of ['P', 'S', 'T', 'U1', 'U6', 'r114-song2', 'r114-song3', 'r114-song4', 'r114-song5']) {
			const match = matchPoem(fixture(name), library)!;
			expect(shortlist(foldLetters(fixture(name)), library).has(match.work), name).toBe(true);
			// and the shortlist took the true work, as the reference (all works) names it
			expect(match.work, name).toBe(expected.find((e) => e.name === name)!.top);
		}
	});

	it('aligns only the 20 works sharing the most trigrams, and finds the true one among them', () => {
		for (const name of ['P', 'T', 'U1', 'U6', 'r114-song2', 'r114-song5']) {
			const letters = foldLetters(fixture(name));
			const list = shortlist(letters, big);
			expect(list.size, name).toBe(SHORTLIST);
			const ranked = rankWorks(letters, big);
			expect(ranked, name).toHaveLength(SHORTLIST);
			const full = rankWorks(letters, library);
			expect(ranked[0].work, name).toBe(full[0].work);
			expect(ranked[0].score, name).toBeCloseTo(full[0].score, 10);
		}
	});

	it('still fills and still refuses on the large library', () => {
		expect(matchPoem(fixture('r114-song2'), big)?.entry.title).toBe('Весёлый час');
		expect(matchPoem(fixture('U5'), big)).toBeNull();
		expect(matchPoem(fixture('r114-song1'), big)).toBeNull();
	});
});

describe('purity', () => {
	it('does not change the library, and gives the same answer twice', () => {
		const before = JSON.stringify(library);
		const a = evaluate(fixture('T'), library);
		const b = evaluate(fixture('T'), library);
		expect(JSON.stringify(library)).toBe(before);
		expect(JSON.stringify(a)).toBe(JSON.stringify(b));
	});
});
