/**
 * QUEUE row 108 B: the comparisons and Lyrics in the poem's lines. Tests o to
 * aa and dd of the brief
 * (`docs/sessions/brief-code-row108-lyrics-lines_r3_2026-10-19.md`); bb, y,
 * and the undos are `e2e-phone/relining.test.ts`.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { processText, wordGrid } from '$lib/pipeline';
import { collectScoreWords } from '$lib/score/vowel-resolver';
import { buildSlotQueue, drawPairings, drawnSeatCount, type PairingMap } from '$lib/score/pairings';
import { seatCliticFolds } from '$lib/score/clitic-seat';
import { rekeySeatsToLines, seatScoreWords } from '$lib/score/score-seat';
import { reseatByDiff } from '$lib/score/reseat';
import { seatedTextDiff } from '$lib/score/seated-text';
import { musicPhraseEnds } from '$lib/score/phrase-ends';
import { inLines, loadFixture, loadRealDictionary, oneLine, SUNLESS, TCHAIKOVSKY } from '$lib/score/row108.support';
import today from '$lib/score/phrase-ends.today.json';
import { comparePoem, layOutLikePoem, tokenize } from './poem-compare';
import { lyricsInPoemLines } from './relining';
import { sameWords } from './same-words';

beforeAll(loadRealDictionary, 60_000);

const lineLengths = (t: string) => t.split('\n').map((l) => l.split(' ').length);
const syllables = (m: PairingMap) => Object.entries(m).filter(([, p]) => p.kind === 'syllable');
const switches = { openSyllabification: false, reconstitution: false };
const PUSHKIN = 'Я помню чудное мгновенье:\nПередо мной явилась ты,\nКак мимолетное виденье,\nКак гений чистой красоты.';
const typedOf = (w: { cells: Array<{ text: string }> }) => w.cells.map((c) => c.text).join('-');

/** The arrival's seat on whatever Lyrics holds: the fold, the word seat, the fold, the re-key. */
function arrive(score: Awaited<ReturnType<typeof loadFixture>>, text: string): PairingMap {
	const lines = processText(text);
	const seated = seatScoreWords(score, seatCliticFolds(score, {}), lines).map;
	return rekeySeatsToLines(seatCliticFolds(score, seated), lines).map;
}

describe('o. sameWords folds a syllable hyphen, and nothing else', () => {
	it('«Ком-нат-ка тес-на-я» holds «Комнатка тесная»; a capital, and a free-standing dash, do not fold', () => {
		expect(sameWords('Ком-нат-ка тес-на-я', 'Комнатка тесная')).toBe(true);
		expect(sameWords('Ком‐нат‑ка', 'Комнатка')).toBe(true);
		expect(sameWords('комнатка', 'Комнатка')).toBe(false);
		expect(sameWords('Комнатка — тесная', 'Комнатка тесная')).toBe(false);
		expect(sameWords('Комнатка - тесная', 'Комнатка тесная')).toBe(false);
		expect(sameWords('Комнатка,\nтесная', 'Комнатка, тесная')).toBe(true);
	});
});

describe('p. the `from score` tag follows sameWords', () => {
	it('shows on the laid-out text and on the divided text, and clears on a changed capital', async () => {
		const score = await loadFixture(SUNLESS);
		const one = oneLine(score);
		const divided = collectScoreWords(score, 1).map(typedOf).join(' ');
		expect(sameWords(inLines(one), one)).toBe(true);
		expect(sameWords(divided, one)).toBe(true);
		expect(sameWords(one.replace('Комнатка', 'комнатка'), one)).toBe(false);
	});
});

describe('q, r, s. Lyrics takes the poem’s lines', () => {
	it('q. on arrival, with a Poem present: 7,7,7,7,7,4, and 96 seats on the same notes as without a Poem', async () => {
		const score = await loadFixture(SUNLESS);
		const one = oneLine(score);
		const laid = lyricsInPoemLines(one, inLines(one), '', one)!;
		expect(lineLengths(laid)).toEqual([7, 7, 7, 7, 7, 4]);
		const withPoem = arrive(score, laid);
		const without = arrive(score, one);
		expect(syllables(withPoem)).toHaveLength(96);
		expect(Object.keys(withPoem).sort()).toEqual(Object.keys(without).sort());
	});

	it('r. on a later Poem: re-lined 7,7,7,7,7,4, and the ordinary transcription path carries 96 of 96 seats on the same notes, drawn live', async () => {
		const score = await loadFixture(SUNLESS);
		const one = oneLine(score);
		const before = arrive(score, one);
		const laid = lyricsInPoemLines(one, inLines(one), '', one)!;
		expect(lineLengths(laid)).toEqual([7, 7, 7, 7, 7, 4]);
		const lines = processText(laid);
		const { diff, before: grid } = seatedTextDiff(one, laid);
		const eventIds = score.vocalLine.filter((e) => e.type !== 'rest').map((e) => e.id);
		const after = reseatByDiff(before, eventIds, buildSlotQueue(lines), diff, grid).map;
		expect(Object.keys(after).sort()).toEqual(Object.keys(before).sort());
		const text = (m: PairingMap) => Object.fromEntries(Object.entries(m).map(([id, p]) => [id, p.kind === 'syllable' ? p.cyrillic : p.kind]));
		expect(text(after)).toEqual(text(before));
		expect(drawnSeatCount(drawPairings(after, lines, switches))).toEqual({ live: 96, stored: 0 });
	});

	it('s. a divided Lyrics: re-lined 7,7,7,7,7,4, the hyphens kept, 96 seats', async () => {
		const score = await loadFixture(SUNLESS);
		const one = oneLine(score);
		const divided = collectScoreWords(score, 1).map(typedOf).join(' ');
		const laid = lyricsInPoemLines(divided, inLines(one), '', one)!;
		expect(lineLengths(laid)).toEqual([7, 7, 7, 7, 7, 4]);
		expect(laid).toContain('Ком-нат-ка');
		expect(syllables(arrive(score, laid))).toHaveLength(96);
	});
});

describe('t, u, v, z. what is not re-lined', () => {
	it('t. no adoption once a word is edited', async () => {
		const one = oneLine(await loadFixture(SUNLESS));
		expect(lyricsInPoemLines(one.replace('тесная', 'тесный'), inLines(one), '', one)).toBeNull();
	});

	it('u. no match: the Pushkin quatrain leaves Lyrics one line', async () => {
		const one = oneLine(await loadFixture(SUNLESS));
		expect(lyricsInPoemLines(one, PUSHKIN, '', one)).toBeNull();
		const tch = oneLine(await loadFixture(TCHAIKOVSKY));
		expect(lyricsInPoemLines(tch, PUSHKIN, '', tch)).toBeNull();
	});

	it('v. the agreement test: two unrelated songs share a few short words and leave each other alone (r1’s any-match rule would re-line both)', async () => {
		const sun = oneLine(await loadFixture(SUNLESS));
		const tch = oneLine(await loadFixture(TCHAIKOVSKY));
		expect(layOutLikePoem(sun, inLines(tch))).not.toBeNull(); // some word matches
		expect(lyricsInPoemLines(sun, inLines(tch), '', sun)).toBeNull();
		expect(layOutLikePoem(tch, inLines(sun))).not.toBeNull();
		expect(lyricsInPoemLines(tch, inLines(sun), '', tch)).toBeNull();
	});

	it('z. her own lines stand: four lines of her own, then the stand-in pasted into Poem', async () => {
		const one = oneLine(await loadFixture(SUNLESS));
		const own = inLines(one, 10);
		expect(own.split('\n')).toHaveLength(4);
		expect(lyricsInPoemLines(own, inLines(one), '', one)).toBeNull();
	});
});

describe('w, aa. a partial match, and a repeating song', () => {
	it('w. row 104’s 33-word test text: Lyrics in two lines 33,6, 96 seats, and all 39 words read as on one line', async () => {
		const score = await loadFixture(SUNLESS);
		const one = oneLine(score);
		const w = one.split(' ');
		const poem = [...w.slice(0, 10), 'ИЗМЕНЁННОЕ', ...w.slice(11, 33)].join(' ');
		const laid = lyricsInPoemLines(one, poem, '', one)!;
		expect(lineLengths(laid)).toEqual([33, 6]);
		const map = arrive(score, laid);
		expect(syllables(map)).toHaveLength(96);
		const lines = processText(laid, { phraseEnds: musicPhraseEnds(score, map, wordGrid(laid)) });
		expect(lines.flatMap((l) => l.words).map((x) => x.ipaDisplay)).toEqual(today['sunless:one']);
	});

	it('aa. Lyrics that sing the song three times, or twice, against the stand-in: laid out', async () => {
		const one = oneLine(await loadFixture(SUNLESS));
		for (const times of [3, 2]) {
			const sung = Array(times).fill(one).join(' ');
			const laid = lyricsInPoemLines(sung, inLines(one), '', sung);
			expect(laid, `${times} times`).not.toBeNull();
			expect(sameWords(laid!, sung)).toBe(true);
			expect(laid!.split('\n').length).toBeGreaterThan(6);
		}
	});
});

describe('x. a singer’s own lines', () => {
	it('four lines of her own, no Poem: the score’s mapping still seats 96', async () => {
		const score = await loadFixture(SUNLESS);
		const one = oneLine(score);
		const own = inLines(one, 10);
		expect(sameWords(own, one)).toBe(true);
		expect(syllables(arrive(score, own))).toHaveLength(96);
		expect(lyricsInPoemLines(own, '', '', one)).toBeNull();
	});
});

describe('dd. the layout is a fixed point, and Ilya’s own lines are recognised by it', () => {
	it('layOutLikePoem(layOutLikePoem(L, P), P) equals layOutLikePoem(L, P) on every pair above', async () => {
		const sun = oneLine(await loadFixture(SUNLESS));
		const tch = oneLine(await loadFixture(TCHAIKOVSKY));
		const w = sun.split(' ');
		const test33 = [...w.slice(0, 10), 'ИЗМЕНЁННОЕ', ...w.slice(11, 33)].join(' ');
		const pairs: Array<[string, string]> = [
			[sun, inLines(sun)],
			[sun, test33],
			[sun, PUSHKIN],
			[tch, inLines(tch)],
			[Array(3).fill(sun).join(' '), inLines(sun)],
			[sun, inLines(tch)],
		];
		for (const [l, p] of pairs) {
			const once = layOutLikePoem(l, p);
			if (once === null) continue;
			expect(layOutLikePoem(once, p)).toBe(once);
		}
	});

	it('a later Poem re-lines Lyrics Ilya laid out, and only that', async () => {
		const one = oneLine(await loadFixture(SUNLESS));
		const first = inLines(one);
		const laid = lyricsInPoemLines(one, first, '', one)!;
		const second = inLines(one, 10);
		const again = lyricsInPoemLines(laid, second, first, one)!;
		expect(lineLengths(again)).toEqual([10, 10, 10, 9]);
		// the previous Poem is the witness that the breaks were Ilya’s: with a different one, they are hers
		expect(lyricsInPoemLines(laid, second, inLines(one, 5), one)).toBeNull();
	});
});

describe('the named undo across a re-lining (section 5, item 6): simulated, not driven in a browser', () => {
	it('restores pairings and seatedText but not Lyrics; reports what is drawn', async () => {
		const score = await loadFixture(SUNLESS);
		const one = oneLine(score);
		const stepBefore = arrive(score, one); // the undo step pushed by a placement: pairings (and seatedText = the one-line text)
		const laid = lyricsInPoemLines(one, inLines(one), '', one)!;
		const lines = processText(laid);
		// the undo restores the step: one-line coordinates against six-line Lyrics
		const drawn = drawPairings(stepBefore, lines, switches);
		const { live, stored } = drawnSeatCount(drawn);
		expect(live + stored).toBe(96);
		// the next transcription re-keys them: the restored seatedText is the one-line text, so the diff to the six-line text carries every seat
		const { diff, before } = seatedTextDiff(one, laid);
		expect(diff.unchanged).toBe(false);
		const eventIds = score.vocalLine.filter((e) => e.type !== 'rest').map((e) => e.id);
		const healed = reseatByDiff(stepBefore, eventIds, buildSlotQueue(lines), diff, before).map;
		expect(drawnSeatCount(drawPairings(healed, lines, switches))).toEqual({ live: 96, stored: 0 });
		const ends = musicPhraseEnds(score, stepBefore, wordGrid(laid));
		const polyot = processText(laid, { phraseEnds: ends }).flatMap((l) => l.words)[20];
		// MEASURED 2026-10-19: until the next transcription, 18 seats draw live and 78 from their stored text; «полёт» reads as the six lines do with no phrase end to cross
		expect({ live, stored, ipa: polyot.ipaDisplay, keys: ends.size }).toEqual({ live: 18, stored: 78, ipa: 'pɑ ˈlʲot', keys: 6 });
	});
});

describe('the agreement rule: matched pairs against Lyrics’ distinct words (follow-up, 2026-10-19)', () => {
	const distinctOf = (text: string) => new Set(tokenize(text).map((t) => t.folded).filter(Boolean)).size;

	it('measures every pair, and re-lines exactly where the pairs reach half of Lyrics’ distinct words', async () => {
		const sun = oneLine(await loadFixture(SUNLESS));
		const tch = oneLine(await loadFixture(TCHAIKOVSKY));
		const w = sun.split(' ');
		const test33 = [...w.slice(0, 10), 'ИЗМЕНЁННОЕ', ...w.slice(11, 33)].join(' ');
		const rows: Array<[string, string, string, boolean]> = [
			['stand-in against Sunless (q, r, s)', sun, inLines(sun), true],
			['row 104 text against Sunless (w)', sun, test33, true],
			['Pushkin against Sunless (u)', sun, PUSHKIN, false],
			['Pushkin against Tchaikovsky (u)', tch, PUSHKIN, false],
			['Tchaikovsky in sevens against Sunless (v)', sun, inLines(tch), false],
			['Sunless in sevens against Tchaikovsky (v)', tch, inLines(sun), false],
			['Sunless sung three times against the stand-in (aa)', Array(3).fill(sun).join(' '), inLines(sun), true],
			['Sunless sung twice against the stand-in (aa)', Array(2).fill(sun).join(' '), inLines(sun), true],
			['Tchaikovsky against its own lines of seven', tch, inLines(tch), true],
			['the first five words as Poem against Sunless', sun, w.slice(0, 5).join(' '), false],
		];
		const measured = rows.map(([name, lyrics, poem, relines]) => {
			const cmp = comparePoem(lyrics, poem)!;
			const pairs = cmp.pairs.length;
			const d = distinctOf(lyrics);
			expect(lyricsInPoemLines(lyrics, poem, '', lyrics) !== null, name).toBe(relines);
			expect(2 * pairs >= d, name).toBe(relines);
			return `${name}: ${pairs} pairs, ${d} distinct Lyrics words, ${relines ? 're-lined' : 'left'}`;
		});
		expect(measured).toHaveLength(rows.length);
	});

	it('the stand-in’s first five words as Poem leave Lyrics on one line', async () => {
		const sun = oneLine(await loadFixture(SUNLESS));
		expect(lyricsInPoemLines(sun, sun.split(' ').slice(0, 5).join(' '), '', sun)).toBeNull();
		// a Poem typed key by key never gets Lyrics re-lined before it reaches half of Lyrics' distinct words
		const poem = sun.split(' ');
		for (let n = 1; n <= 10; n += 1) expect(lyricsInPoemLines(sun, poem.slice(0, n).join(' '), '', sun), `${n} words`).toBeNull();
	});
});

describe('a Poem typed key by key', () => {
	it('ends with Lyrics in the poem’s lines: the partial poem’s layout is not a fixed point, so Ilya’s own last text is the witness', async () => {
		const one = oneLine(await loadFixture(SUNLESS));
		const poem = inLines(one);
		const run = (witness: boolean) => {
			let lyr = one;
			let prev = '';
			let last = '';
			for (let i = 1; i <= poem.length; i += 1) {
				const p = poem.slice(0, i);
				const laid = lyricsInPoemLines(lyr, p, prev, one, witness ? last : '');
				if (laid !== null) [lyr, last] = [laid, laid];
				prev = p;
			}
			return lineLengths(lyr);
		};
		expect(run(true)).toEqual([7, 7, 7, 7, 7, 4]);
		// without the witness, the previous-Poem test lets go half-way (the defect this fixes)
		expect(run(false)).toEqual([7, 7, 13, 12]);
	});
});
