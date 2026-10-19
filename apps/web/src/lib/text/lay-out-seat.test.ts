/**
 * lay-out-seat.test.ts: LYRICS LAID OUT IN THE POEM'S LINES STILL SEATS.
 * N.135 stage 3, ruling default 4 ("Lyrics adopts the poem's line breaks").
 *
 * Until row 108 A this test pinned a gap: `seatScoreWords` refused a Lyrics
 * that was not one line, and `align` keyed a queue slot's word by
 * `origin.wordIndex` alone, which restarts at 0 on every line, so laying
 * Lyrics out in several lines made the arrival's seat, Place from here, and
 * the N.157 re-seat seat NOTHING, silently. `align` now takes the flattened
 * lines and `seatScoreWords` takes every line (`score-seat.ts`,
 * `clitic-seat.ts`), so the six-line layout seats exactly what the one-line
 * fill does, each slot on the same note with the same text. The positive
 * control is still the same text in one line.
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
	it('the one-line fill seats 96; the same words in the poem\'s lines seat 96 too', async () => {
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

		expect(seatedOne.seated).toBe(96);
		expect(seatedLaid.seated).toBe(96);
		// the same note, the same text, the same slot, for every seat. (Not the IPA: with no phrase ends passed, the six lines read
		// «полёт» as [ˈlʲot] where the one line reads [ˈlʲod]; Part C's `phrase-ends.test.ts` g holds that.)
		const view = (m: typeof seatedOne.map) =>
			Object.fromEntries(Object.entries(m).map(([id, p]) => [id, p.kind === 'syllable' ? [p.cyrillic, p.origin.word, p.origin.slotIndex] : p.kind]));
		expect(view(seatedLaid.map)).toEqual(view(seatedOne.map));
	});
});
