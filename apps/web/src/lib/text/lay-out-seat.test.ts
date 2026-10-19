/**
 * lay-out-seat.test.ts: WHY LYRICS IS NOT YET LAID OUT IN THE POEM'S LINES.
 * N.135 stage 3, ruling default 4 ("Lyrics adopts the poem's line breaks"),
 * built as `layOutLikePoem` and NOT wired, because of what this pins.
 *
 * The score's own seat reads the page's `lines`, and `seatScoreWords` refuses a
 * poem that is not one line (`score-seat.ts`: "The fill inserts no line breaks,
 * so either means the poem is not the text this was built for"). Its callers
 * hand it the page's `lines`: Place from here (`+page.svelte`), the arrival's
 * first seat (`seatFilledPoem`), and the N.157 re-seat on a score replacement
 * (`replace-seat.ts`). Lay Lyrics out in several lines and all three seat
 * nothing, silently. The brief expected four string comparisons to be the only
 * gates; this is a fifth, and it is a different kind. The positive control is
 * the same text in one line, which seats.
 *
 * When `seatScoreWords` and `align` (keyed on `wordIndex` alone) take several
 * lines, this test is the one to change, and `layOutLikePoem` is ready.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { processText } from '$lib/pipeline';
import { collectScoreWords, scoreWordsText } from '$lib/score/vowel-resolver';
import { seatScoreWords } from '$lib/score/score-seat';
import { layOutLikePoem } from './poem-compare';
import { sameWords } from './same-words';

const xml = readFileSync(
	fileURLToPath(new URL('../score/ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)),
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

describe('laying Lyrics out in the poem\'s lines against the score\'s own seat', () => {
	it('the one-line fill seats; the same words in the poem\'s lines seat nothing', async () => {
		const score = await parse();
		const one = scoreWordsText(collectScoreWords(score, 1));
		// A stand-in poem: the file's own words broken into lines of seven. It is
		// a test text, not a published poem.
		const words = one.split(' ');
		const poem = Array.from({ length: Math.ceil(words.length / 7) }, (_, i) => words.slice(i * 7, i * 7 + 7).join(' ')).join('\n');
		const laid = layOutLikePoem(one, poem)!;

		expect(laid.split('\n').length).toBeGreaterThan(1);
		expect(sameWords(laid, one)).toBe(true);

		const seatedOne = seatScoreWords(score, {}, processText(one, { language: 'en' }));
		const seatedLaid = seatScoreWords(score, {}, processText(laid, { language: 'en' }));

		expect(seatedOne.seated).toBeGreaterThan(0);
		expect(seatedLaid.seated).toBe(0);
	});
});
