/**
 * N.134's proof, on the file the brief names: Dann's engraving of Musorgsky's
 * *Without Sun* no. 1, the same fixture `clitic-seat.test.ts` reads, identical
 * byte for byte to `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls
 * (engraved).musicxml` (checked with `cmp`, 2026-09-14).
 *
 * The expectations are the brief's own, read off the fixture directly: 39
 * words beginning `Комнатка тесная, тихая, милая;`, and the file's own
 * divergences (`не проглядная`, `без ответная`, `одинока` without its final
 * `я`) standing as the file's.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { processText } from '$lib/pipeline';
import { collectScoreWords, scoreWordsText } from './vowel-resolver';
import { findCliticFolds, seatCliticFolds } from './clitic-seat';
import { buildSlotQueue, type PairingMap } from './pairings';
import { seatScoreWords } from './score-seat';
import type { LineData } from '$lib/types';

const NBSP = ' ';

const xml = readFileSync(
	fileURLToPath(new URL('./ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)),
	'utf8',
);

async function parse(): Promise<ParsedScore> {
	const res = await new MusicXmlScoreParser().parse({
		format: 'musicxml',
		data: parseXml(xml) as unknown as Document,
		sourcePath: 'sunless-01-engraved.musicxml',
	});
	return res.score;
}

/** The poem the box is filled with, transcribed the way `runPipeline` does. */
function poemLines(score: ParsedScore): LineData[] {
	return processText(scoreWordsText(collectScoreWords(score, 1)), { language: 'en' });
}

const key = (o: { lineIndex: number; wordIndex: number; slotIndex: number }) =>
	`${o.lineIndex}-${o.wordIndex}-${o.slotIndex}`;

/** Every slot key a syllable pairing in `map` carries, repeats included. */
function seatedKeys(map: PairingMap): string[] {
	return Object.values(map).flatMap((p) => (p.kind === 'syllable' ? [key(p.origin)] : []));
}

/** What `applyArrival` does to a fresh map: the clitic seat, then this one. */
function arrive(score: ParsedScore, lines: LineData[]): PairingMap {
	return seatScoreWords(score, seatCliticFolds(score, {}), lines).map;
}

describe('N.134 the fill text', () => {
	it('is 39 words, beginning with the first line of the poem, punctuation included', async () => {
		const text = scoreWordsText(collectScoreWords(await parse(), 1));
		expect(text.split(' ')).toHaveLength(39);
		expect(text.startsWith('Комнатка тесная, тихая, милая;')).toBe(true);
		// The file's own last word, «одинокая.», whole since N.156.
		expect(text.endsWith(' одинокая.')).toBe(true);
		expect(text).not.toContain('\n');
	});
});

describe('N.134 seating from the score, on the engraved Sunless no. 1', () => {
	it('places every slot of the poem exactly once', async () => {
		const score = await parse();
		const lines = poemLines(score);
		const queue = buildSlotQueue(lines);
		expect(queue).toHaveLength(96);
		const keys = seatedKeys(arrive(score, lines));
		expect(new Set(keys).size).toBe(keys.length);
		expect(queue.filter((s) => keys.includes(key(s.origin)))).toHaveLength(96);
	});

	it('copies the file mapping before the clitic, carrying the file punctuation', async () => {
		const score = await parse();
		const map = arrive(score, poemLines(score));
		const words = collectScoreWords(score, 1);
		const fold = findCliticFolds(score)[0];
		const cells = words.flatMap((w) => w.cells);
		expect(cells.findIndex((c) => c.eventId === fold.cliticEventId)).toBe(36);
		// The fourteen words before «в». Every note the file engraved a syllable
		// under carries one, and each word reads back as the file printed it.
		// The DIVISION is Ilya's, not the engraver's: the file prints про/гляд
		// and the seat carries прог/ляд, which is what every seat in this tree
		// carries (the queue's text, N.55b) and what the fold already writes on
		// the tail.
		for (const w of words.slice(0, 14)) {
			const seated = w.cells.map((c) => {
				const p = map[c.eventId];
				expect(p?.kind).toBe('syllable');
				return p?.kind === 'syllable' ? p.cyrillic : '';
			});
			expect(seated.join('')).toBe(w.raw);
		}
		const tesnaya = words[1].cells.map((c) => map[c.eventId]);
		expect(tesnaya.map((p) => (p?.kind === 'syllable' ? p.cyrillic : ''))).toEqual(['тес', 'на', 'я,']);
	});

	it('leaves the clitic run as the fold ruled it, the last note undecided', async () => {
		const score = await parse();
		const map = arrive(score, poemLines(score));
		const fold = findCliticFolds(score)[0];
		const p = map[fold.cliticEventId];
		expect(p?.kind === 'syllable' ? p.cyrillic : '').toBe('в' + NBSP + 'бью');
		for (const id of fold.blanked) expect(map[id]).toBeUndefined();
		expect(seatCliticFolds(score, map)).toEqual(map);
	});

	it('run on its own, puts the fused slot on the note the file gave бью', async () => {
		const score = await parse();
		const { map, seated, withheld } = seatScoreWords(score, {}, poemLines(score));
		// The file's last word «одинокая.» now has 5 cells for its 5 slots, so it is
		// seated like every other word and nothing is withheld.
		expect(seated).toBe(96);
		expect(withheld).toBe(0);
		const fold = findCliticFolds(score)[0];
		expect(map[fold.cliticEventId]).toBeUndefined();
		const host = collectScoreWords(score, 1)
			.flatMap((w) => w.cells)
			.find((c, i, all) => all[i - 1]?.eventId === fold.cliticEventId);
		const onHost = host ? map[host.eventId] : undefined;
		expect(onHost?.kind === 'syllable' ? onHost.cyrillic : '').toBe('в' + NBSP + 'бью');
	});

	it('never overwrites a decided note, and never seats a slot twice', async () => {
		const score = await parse();
		const lines = poemLines(score);
		const first = collectScoreWords(score, 1)[0].cells[0].eventId;
		const decided: PairingMap = { [first]: { kind: 'melisma' } };
		const { map } = seatScoreWords(score, decided, lines);
		expect(map[first]).toEqual({ kind: 'melisma' });
		const again = seatScoreWords(score, map, lines);
		expect(again.seated).toBe(0);
		expect(again.map).toEqual(map);
	});

	it('withholds a word whose two counts disagree, and seats the rest', async () => {
		const score = await parse();
		const lines = poemLines(score);
		// Комнатка, with its engine syllables cut from three to two.
		const [w0, ...rest] = lines[0].words;
		const cut: LineData[] = [
			{ ...lines[0], words: [{ ...w0, syllables: w0.syllables.slice(0, 2) }, ...rest] },
		];
		const { map, seated, withheld } = seatScoreWords(score, {}, cut);
		expect(withheld).toBe(2);
		expect(seated).toBe(93);
		for (const cell of collectScoreWords(score, 1)[0].cells) {
			expect(map[cell.eventId]).toBeUndefined();
		}
	});

	it('seats nothing against a poem that is not the score text', async () => {
		const score = await parse();
		const other = processText('Я помню чудное мгновенье', { language: 'en' });
		const { map, seated } = seatScoreWords(score, {}, other);
		expect(seated).toBe(0);
		expect(map).toEqual({});
	});
});
