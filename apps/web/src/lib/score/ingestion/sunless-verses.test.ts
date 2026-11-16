/**
 * Strophic lane A, Step 2: the two sunless fixtures carry their IPA as
 * `<lyric number="2">`, and a line with no Cyrillic letter is not a verse (D1),
 * so each gives one verse and `verseView` has nothing to separate.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, sungVerseNumbers, verseGapBars, verseView, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from './mini-dom';

async function parse(name: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never)).score;
}

describe.each(['sunless-01-engraved.musicxml', 'sunless-01-finale-lone-v.musicxml'])('%s', (name) => {
	it('has two lyric lines in the file and one verse', async () => {
		const s = await parse(name);
		const lines = new Set(s.vocalLine.flatMap((e) => e.syllable?.versesInfo?.map((v) => v.verseNumber) ?? (e.syllable ? [e.syllable.verseNumber] : [])));
		expect([...lines].sort()).toEqual([1, 2]);
		expect(sungVerseNumbers(s)).toEqual([1]);
		expect(verseGapBars(s, 1)).toEqual([]);
	});

	it('its view of verse 1 shows, on every note, the verse-1 text the file holds there', async () => {
		const s = await parse(name);
		const view = verseView(s, 1);
		const verse1 = (syl: ParsedScore['vocalLine'][number]['syllable']) =>
			syl ? (syl.versesInfo?.find((v) => v.verseNumber === 1)?.text ?? (syl.versesInfo ? undefined : syl.verseNumber === 1 ? syl.text : undefined)) : undefined;
		let checked = 0;
		s.vocalLine.forEach((e, i) => {
			expect(view.vocalLine[i].syllable?.text).toBe(verse1(e.syllable));
			if (verse1(e.syllable)) checked++;
		});
		expect(checked).toBeGreaterThan(50);
	});
});
