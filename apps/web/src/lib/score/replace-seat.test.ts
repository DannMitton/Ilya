/**
 * N.157's proof: replacing a score re-derives the seats.
 *
 * THE REPLACEMENT IS BUILT HERE from the tracked fixture, not committed as a
 * second file: `ingestion/fixtures/sunless-01-engraved.musicxml`, the engraving
 * `score-seat.test.ts` reads (96 slots, 39 words). The corrected copy is the
 * same XML string with three edits, each made on the vocal part's note by its
 * event id:
 *
 * - ADDED NOTE, MOVES NOTHING. The last sung note, `m17-5-8` («я.», an eighth),
 *   is split into two sixteenths. Ids are onset fractions within the bar
 *   (`musicxml-parser.ts`, `cursorId`), so the first half keeps `m17-5-8` and
 *   the second is the new id `m17-11-16`. It carries a new final word, «ах», so
 *   the poem rises from 96 slots to 97 at the very end: no existing word's
 *   index shifts, so every stored origin still names the slot it named.
 * - MOVED ONSET, FOR THE ORPHAN PATH. In the first bar «Ком» (a quarter) is
 *   lengthened to a dotted quarter and «нат» (a quarter) shortened to an
 *   eighth. The bar's sum is unchanged; «нат» now begins at 3/8, so its old id
 *   `m1-1-4` is gone and its new id is `m1-3-8`.
 * - CHANGED WORD. «тень» (`m3-0-1`) gains a period in the file's underlay, so
 *   `origin.word` (`cleanWord`) is unchanged and the seat's text should read
 *   «тень.».
 *
 * The poem (`lines`) is built from the corrected file's own words, which is
 * what a singer who had already corrected the text has.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { processText } from '$lib/pipeline';
import { collectScoreWords, scoreWordsText } from './vowel-resolver';
import { seatCliticFolds } from './clitic-seat';
import { buildSlotQueue, mergeOnUpload, type PairingMap } from './pairings';
import { seatScoreWords } from './score-seat';
import { reseatOnReplace } from './replace-seat';
import type { LineData } from '$lib/types';

const original = readFileSync(
	fileURLToPath(new URL('./ingestion/fixtures/sunless-01-finale-lone-v.musicxml', import.meta.url)),
	'utf8',
);

async function parse(xml: string): Promise<ParsedScore> {
	const res = await new MusicXmlScoreParser().parse({
		format: 'musicxml',
		data: parseXml(xml) as unknown as Document,
		sourcePath: 'sunless-01-engraved.musicxml',
	});
	return res.score;
}

/** The nth `<note>` of the vocal part (`P1`) is the nth event of its `vocalLine`, rests included. */
function editNote(xml: string, index: number, edit: (note: string) => string): string {
	const end = xml.indexOf('<part id="P2">');
	const part = xml.slice(0, end);
	let n = -1;
	const edited = part.replace(/<note>[\s\S]*?<\/note>/g, (note) => (++n === index ? edit(note) : note));
	return edited + xml.slice(end);
}

async function correctedXml(): Promise<string> {
	const ids = (await parse(original)).vocalLine.map((e) => e.id);
	const at = (id: string) => ids.indexOf(id);
	let xml = original;
	// Added note: split `m17-5-8` into two sixteenths; the second carries a new final word.
	xml = editNote(xml, at('m17-5-8'), (note) => {
		const first = note.replace('<duration>8</duration>', '<duration>4</duration>').replace('<type>eighth</type>', '<type>16th</type>');
		const second = first
			.replace(/<lyric name="verse" number="1">[\s\S]*?<\/lyric>/, '<lyric name="verse" number="1"><syllabic>single</syllabic><text>ах</text></lyric>')
			.replace(/\s*<lyric name="verse" number="2">[\s\S]*?<\/lyric>/, '');
		return first + '\n      ' + second;
	});
	// Moved onset: «Ком» to a dotted quarter, «нат» to an eighth.
	xml = editNote(xml, at('m1-0-1'), (note) =>
		note.replace('<duration>16</duration>', '<duration>24</duration>').replace('<type>quarter</type>', '<type>quarter</type>\n        <dot/>'),
	);
	xml = editNote(xml, at('m1-1-4'), (note) =>
		note.replace('<duration>16</duration>', '<duration>8</duration>').replace('<type>quarter</type>', '<type>eighth</type>'),
	);
	// Changed word: a period on «тень».
	xml = editNote(xml, at('m3-0-1'), (note) => note.replace('<text>тень</text>', '<text>тень.</text>'));
	return xml;
}

function poemLines(score: ParsedScore): LineData[] {
	return processText(scoreWordsText(collectScoreWords(score, 1)), { language: 'en' });
}

/** What `applyArrival` did to the original on its first arrival: the clitic seat, then the score's. */
function arrive(score: ParsedScore, lines: LineData[]): PairingMap {
	return seatScoreWords(score, seatCliticFolds(score, {}), lines).map;
}

async function setup() {
	const before = await parse(original);
	const after = await parse(await correctedXml());
	const beforeLines = poemLines(before);
	const afterLines = poemLines(after);
	const placed = arrive(before, beforeLines);
	return { before, after, beforeLines, afterLines, placed };
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

describe('N.157 the fixture edits', () => {
	it('the corrected file has 97 slots against 96, and the ids move as designed', async () => {
		const { before, after, beforeLines, afterLines } = await setup();
		expect(buildSlotQueue(beforeLines)).toHaveLength(96);
		expect(buildSlotQueue(afterLines)).toHaveLength(97);
		const was = new Set(before.vocalLine.map((e) => e.id));
		const now = new Set(after.vocalLine.map((e) => e.id));
		expect([...now].filter((id) => !was.has(id)).sort()).toEqual(['m1-3-8', 'm17-11-16']);
		expect([...was].filter((id) => !now.has(id))).toEqual(['m1-1-4']);
	});
});

describe('N.157 reseatOnReplace, on the corrected Sunless no. 1', () => {
	it('keeps every seat on an untouched note, with its id, origin, and text', async () => {
		const { after, afterLines, placed } = await setup();
		const result = reseatOnReplace(placed, after, afterLines);
		const touched = new Set(['m1-1-4', 'm3-0-1']);
		for (const [id, pairing] of Object.entries(placed)) {
			if (touched.has(id)) continue;
			expect(result.map[id]).toEqual(pairing);
		}
	});

	it('reads the current text, period included, on the seat of the changed word', async () => {
		const { after, afterLines, placed } = await setup();
		const result = reseatOnReplace(placed, after, afterLines);
		const was = placed['m3-0-1'];
		const now = result.map['m3-0-1'];
		expect(was).toMatchObject({ kind: 'syllable', cyrillic: 'тень' });
		expect(now).toMatchObject({ kind: 'syllable', cyrillic: 'тень.' });
		if (was.kind === 'syllable' && now.kind === 'syllable') expect(now.origin).toEqual(was.origin);
		expect(result.refreshed).toBe(1);
	});

	it('seats the added note, seats the moved note on its new id, and keeps and counts the old id', async () => {
		const { after, afterLines, placed } = await setup();
		const result = reseatOnReplace(placed, after, afterLines);
		// The added half-note holds the slot the file names for it: the new final word.
		expect(result.map['m17-11-16']).toMatchObject({ kind: 'syllable', cyrillic: 'ах' });
		// The moved note holds «нат» on its new id; the old id is still in the map, as an orphan.
		const old = placed['m1-1-4'];
		expect(old).toMatchObject({ kind: 'syllable', cyrillic: 'нат' });
		expect(result.map['m1-3-8']).toMatchObject({ kind: 'syllable', cyrillic: 'нат' });
		expect(result.map['m1-1-4']).toEqual(old);
		expect(result.seated).toBe(2);
		expect(result.orphaned).toBe(1);
		// The page's own count, `mergeOnUpload`'s, is the same number.
		const sung = after.vocalLine.filter((e) => e.type !== 'rest').map((e) => e.id);
		expect(mergeOnUpload(placed, sung, sung, buildSlotQueue(afterLines), false).orphaned).toHaveLength(result.orphaned);
		// No other id in either bar changed: every key is one the original had, or one of the two new ones.
		for (const id of Object.keys(result.map)) {
			if (['m1-3-8', 'm17-11-16'].includes(id)) continue;
			expect(placed[id]).toBeDefined();
		}
	});

	it('leaves a hand placement alone, and the file does not overwrite it', async () => {
		const { after, afterLines, placed } = await setup();
		// The singer moved the slot of «ма» (m5-1-4) onto «ду» (m5-0-1) by hand.
		const hand = clone(placed);
		hand['m5-0-1'] = clone(placed['m5-1-4']);
		delete hand['m5-1-4'];
		const result = reseatOnReplace(hand, after, afterLines);
		expect(result.map['m5-0-1']).toEqual(hand['m5-0-1']);
		expect(result.map['m5-1-4']).toBeUndefined();
	});

	it('keeps a melisma and an empty decision', async () => {
		const { after, afterLines, placed } = await setup();
		const decided = clone(placed);
		decided['m6-1-2'] = { kind: 'melisma' };
		decided['m6-3-4'] = { kind: 'empty' };
		const result = reseatOnReplace(decided, after, afterLines);
		expect(result.map['m6-1-2']).toEqual({ kind: 'melisma' });
		expect(result.map['m6-3-4']).toEqual({ kind: 'empty' });
	});

	it('with a poem that does not match the file, seats nothing and still refreshes and keeps the live seats', async () => {
		const { after, afterLines, placed } = await setup();
		// One word's letters changed in the poem: the file's word no longer matches, so `align` gives up.
		const text = scoreWordsText(collectScoreWords(after, 1)).replace('Комнатка', 'Комнотка');
		const other = processText(text, { language: 'en' });
		expect(other).not.toEqual(afterLines);
		const result = reseatOnReplace(placed, after, other);
		expect(result.seated).toBe(0);
		expect(result.map['m17-11-16']).toBeUndefined();
		expect(result.map['m1-3-8']).toBeUndefined();
		// The live seats are kept; «тень.» is refreshed because its word is unchanged in this poem too.
		expect(result.map['m3-0-1']).toMatchObject({ cyrillic: 'тень.' });
		expect(result.map['m17-5-8']).toEqual(placed['m17-5-8']);
	});

	it('never mutates its input map', async () => {
		const { after, afterLines, placed } = await setup();
		const copy = clone(placed);
		reseatOnReplace(placed, after, afterLines);
		expect(placed).toEqual(copy);
	});
});
