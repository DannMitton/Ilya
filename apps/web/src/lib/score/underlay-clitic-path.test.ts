/**
 * Brief r5 step 4, point 5, the whole path: a lyric «в» + U+00A0 + «ти» written
 * by `writeLyrics` reaches Lyrics, and is seated on its note as the slot «в ти»
 * (`seatScoreWords`), and the arrival fold (`clitic-seat.ts`) leaves it as it is.
 * The page runs these in this order on arrival (`+page.svelte`, `applyArrival`:
 * the clitic seat, then the score's seat, as `score-seat.test.ts` `arrive`).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { processText } from '$lib/pipeline';
import { voiceNotes } from '$lib/omr/underlay-prepare';
import { writeLyrics, type Word } from '$lib/omr/underlay-words';
import { collectScoreWords, scoreWordsText } from './vowel-resolver';
import { buildSlotQueue, syllableTargetIds } from './pairings';
import { findCliticFolds, seatCliticFolds } from './clitic-seat';
import { seatScoreWords } from './score-seat';

const NBSP = ' ';
const page = readFileSync(new URL('../omr/fixtures/tch-1.musicxml', import.meta.url), 'utf8');
const notes = voiceNotes(page).filter((n) => !n.rest);
const syl = (i: number, text: string, syllabic: 'single' | 'begin' | 'middle' | 'end') => ({ note: notes[i].ordinal, text, syllabic, sustained: false });
/** «в ти-ши ночи»: the reader's output for the print «в ти-ши но-чи», the «в» folded into «ти». */
const WORDS: Word[] = [
	{ syllables: [syl(0, `в${NBSP}ти`, 'begin'), syl(1, 'ши', 'end')] },
	{ syllables: [syl(2, 'но', 'begin'), syl(3, 'чи', 'end')] },
];

async function score(): Promise<ParsedScore> {
	const xml = writeLyrics(page, WORDS);
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'x.musicxml' })).score;
}

describe('a folded clitic through the whole path', () => {
	it('reaches Lyrics as one word with its host, joined by the no-break space', async () => {
		const s = await score();
		expect(collectScoreWords(s, 1).map((w) => w.raw)).toEqual([`в${NBSP}тиши`, 'ночи']);
		expect(scoreWordsText(collectScoreWords(s, 1))).toBe(`в${NBSP}тиши ночи`);
	});

	it('is seated on its note as the slot «в ти», and the arrival fold leaves it as it is', async () => {
		const s = await score();
		const lines = processText(scoreWordsText(collectScoreWords(s, 1)), { language: 'en' });
		const queue = buildSlotQueue(lines);
		expect(queue.map((q) => q.cyrillic)).toEqual([`в${NBSP}ти`, 'ши', 'но', 'чи']);
		const ids = syllableTargetIds(s.vocalLine);
		const alone = seatScoreWords(s, {}, lines).map;
		const arrived = seatScoreWords(s, seatCliticFolds(s, {}), lines).map;
		const under = (m: typeof alone) => ids.slice(0, 5).map((id) => (m[id]?.kind === 'syllable' ? m[id].cyrillic : null));
		expect(under(alone)).toEqual([`в${NBSP}ти`, 'ши', 'но', 'чи', null]);
		// The arrival fold finds no lone clitic to fold: the seats are the same.
		expect(findCliticFolds(s).length).toBe(0);
		expect(under(arrived)).toEqual(under(alone));
	});
});
