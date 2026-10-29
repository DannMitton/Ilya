/**
 * Brief r5 step 2, the stop condition: where a typed word lands. The banner
 * (`upload.banner.wordsPartlyRead`) tells the singer to "type the missing words
 * into Lyrics exactly where they fall in the song". The ratified file left it
 * NOT ESTABLISHED that words typed into Lyrics land in the unread bars and leave
 * the read words seated.
 *
 * The proof runs the app's own functions, in the order the page runs them, on
 * Dann's engraving of Musorgsky's *Without Sun* no. 1 (the fixture
 * `score-seat.test.ts` reads): the score is read with every word; a stretch of
 * its bars loses its words (as a system the reader could not read does); the
 * read words are put in Lyrics and seated from the score (`seatScoreWords`); the
 * singer types the words of the stretch back where they fall in the text
 * (`diffWordGrid`, `reseatByDiff`, as `reseatAcross` in `+page.svelte` calls
 * them). Each retyped word must stand on the notes it stood on in the whole
 * score, and no read word may move.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { processText } from '$lib/pipeline';
import { collectScoreWords, scoreWordsText } from './vowel-resolver';
import { buildSlotQueue, syllableTargetIds, type PairingMap } from './pairings';
import { reseatByDiff } from './reseat';
import { seatedTextDiff } from './seated-text';
import { seatScoreWords } from './score-seat';

const xml = readFileSync(fileURLToPath(new URL('./ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)), 'utf8');

async function parse(text: string): Promise<ParsedScore> {
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(text) as unknown as Document, sourcePath: 'x.musicxml' })).score;
}

/** The score's MusicXML with the `<lyric>` taken off every note of bars `from` to `to`. */
function withoutWords(text: string, from: number, to: number): string {
	return text.replace(/<measure\b[^>]*number="(\d+)"[\s\S]*?<\/measure>/g, (m, n) => (Number(n) >= from && Number(n) <= to ? m.replace(/<lyric\b[\s\S]*?<\/lyric>\s*/g, '') : m));
}

/** What the page does with a text in Lyrics: transcribe it, and seat the score's own words on it. */
function seated(score: ParsedScore, text: string) {
	const lines = processText(text, { language: 'en' });
	return { lines, queue: buildSlotQueue(lines), map: seatScoreWords(score, {}, lines).map };
}

const under = (map: PairingMap, ids: readonly string[]) => ids.map((id) => (map[id]?.kind === 'syllable' ? map[id].cyrillic : null));

/**
 * The seating of the whole score, and of the score with bars `from` to `to`
 * unread and their words then typed back: what each note holds in each, for the
 * notes that differ. `reseatByDiff` is called as `reseatAcross` calls it, with
 * `seatedTextDiff`'s diff and before grid.
 */
async function typedBack(from: number, to: number) {
	const whole = await parse(xml);
	const ids = syllableTargetIds(whole.vocalLine);
	const text0 = scoreWordsText(collectScoreWords(whole, 1));
	const reference = seated(whole, text0).map;
	const part = await parse(withoutWords(xml, from, to));
	const text1 = scoreWordsText(collectScoreWords(part, 1));
	expect(text1).not.toBe(text0);
	const read = seated(part, text1);
	const { diff, before } = seatedTextDiff(text1, text0);
	const queue = buildSlotQueue(processText(text0, { language: 'en' }));
	const result = reseatByDiff(read.map, ids, queue, diff, before).map;
	const got = under(result, ids);
	const want = under(reference, ids);
	return { ids, got, want, wrong: ids.map((_, i) => [i, got[i], want[i]] as const).filter(([, g, w]) => g !== w) };
}

describe('where a typed word lands, the banner\'s second sentence', () => {
	it('starts from a whole score that seats every word', async () => {
		const score = await parse(xml);
		const ids = syllableTargetIds(score.vocalLine);
		expect(under(seated(score, scoreWordsText(collectScoreWords(score, 1))).map, ids).filter((c) => c === null).length).toBeLessThan(5);
	});

	// Stretches that start and end at the edge of a word, hold no vowelless word of their own, and whose
	// first and last words do not repeat their neighbours. The typed words stand where the whole score has them,
	// and no read word moves.
	it.each([[3, 3], [5, 5], [6, 6], [6, 7], [11, 11], [13, 13], [17, 17]] as const)('puts the words typed back for bars %i to %i on the notes they stood on, and moves no read word', async (from, to) => {
		expect((await typedBack(from, to)).wrong).toEqual([]);
	});

	// THE LIMITS, found by this test and reported to the desk (the sentence is untrue here). They are pinned as they
	// are, so a change to the seating path shows as a change here.
	it('LIMIT 1: a lone vowelless word in the stretch (bar 8, «в» on a note of its own) lands one note early, and so does every syllable after it in the stretch', async () => {
		const { wrong } = await typedBack(8, 8);
		expect(wrong.map(([, g, w]) => [g, w])).toEqual([
			['в\u00a0бью', null],
			['щем', 'в\u00a0бью'],
			['ся', 'щем'],
			['серд', 'ся'],
			['це', 'серд'],
			[null, 'це'],
		]);
	});

	it('LIMIT 2: bar 4, whose first word «тень» is also the first word after it, seats none of its words (the cause is NOT ESTABLISHED)', async () => {
		const { wrong } = await typedBack(4, 4);
		expect(wrong).toHaveLength(6);
		expect(wrong.every(([, g]) => g === null)).toBe(true);
	});

	it('LIMIT 3: bars 12 to 14, which begin inside a word (bar 12 opens with the end of «мгновенья»), seat none of their words; not every stretch that begins inside a word fails (bar 10 alone lands), and the cause is NOT ESTABLISHED', async () => {
		const { wrong, got } = await typedBack(12, 14);
		// 18 of the stretch's 19 differing notes stay empty; the nineteenth, the stretch's last, holds a stray "я;" (the word's end) one note late.
		expect(wrong.filter(([, g]) => g === null)).toHaveLength(18);
		expect(wrong).toHaveLength(19);
		expect(got.filter((c) => c !== null).length).toBeGreaterThan(40);
	});
});
