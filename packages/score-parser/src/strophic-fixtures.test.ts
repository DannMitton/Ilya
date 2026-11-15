/**
 * Smoke tests for the strophic lane A fixtures (brief r5, Step 1): each parses
 * with the verses and the markers its head comment states. They test the
 * fixtures, not the unfolding; Step 3 tests that.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import { sungVerseNumbers } from './verses';
import { tacetRuns } from './staff-renderer';
import type { ParsedScore } from './types';

async function load(name: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never)).score;
}
const wordsOf = (s: ParsedScore, bar: number, verse: number): Array<string | null> =>
	s.vocalLine
		.filter((e) => e.measureIndex === bar && e.type === 'note')
		.map((e) => {
			const info = e.syllable?.versesInfo?.find((v) => v.verseNumber === verse);
			if (info) return info.text;
			return e.syllable && !e.syllable.versesInfo && e.syllable.verseNumber === verse ? e.syllable.text : null;
		});

describe('every strophic fixture is free of derived-id text', () => {
	it.each(['strophic-repeat', 'strophic-volta', 'strophic-volta-from-top', 'strophic-stacked', 'repeat-one-verse', 'strophic-tacet-boundary'])('%s', (n) => {
		expect(readFileSync(new URL(`./fixtures/${n}.musicxml`, import.meta.url), 'utf8')).not.toContain('~v');
	});
});

describe('strophic-repeat.musicxml', () => {
	it('has three Cyrillic verses, a forward and a backward repeat with no times, one slur, and one tempo mark on the ending', async () => {
		const s = await load('strophic-repeat.musicxml');
		expect(sungVerseNumbers(s)).toEqual([1, 2, 3]);
		const fwd = s.measures.filter((m) => m.repeatStart);
		const back = s.measures.filter((m) => m.repeatEnd);
		expect(fwd.map((m) => m.number)).toEqual(['3']);
		expect(back.map((m) => m.number)).toEqual(['8']);
		expect(back[0].repeatTimes).toBeUndefined();
		expect(s.measures.some((m) => m.ending)).toBe(false);
		expect(s.measures).toHaveLength(10);
		expect(s.vocalLine.flatMap((e) => e.slurs ?? [])).toHaveLength(2); // one slur: a start and a stop
		expect(s.tempoMarkings).toHaveLength(1);
		expect(s.tempoMarkings[0].measureIndex).toBe(8);
	});
	it('puts the words where the brief says: introduction bare, bar 4 and bar 5 differing, refrain in verse 1 only', async () => {
		const s = await load('strophic-repeat.musicxml');
		const intro = s.vocalLine.filter((e) => e.measureIndex < 2);
		expect(intro.every((e) => e.type === 'rest')).toBe(true);
		// passage bar 4 of the brief (index 3): verse 1 two syllables on two notes, verse 2 one syllable and a continuation
		expect(wordsOf(s, 3, 1).slice(0, 2).every((w) => w !== null)).toBe(true);
		expect(wordsOf(s, 3, 2).slice(0, 2)).toEqual(['Лес', null]);
		// passage bar 5 (index 4): the reverse
		expect(wordsOf(s, 4, 1).slice(0, 2)).toEqual(['Свет', null]);
		expect(wordsOf(s, 4, 2).slice(0, 2).every((w) => w !== null)).toBe(true);
		// refrain bars 7 and 8 (indices 6 and 7): verse 1 only
		for (const bar of [6, 7]) {
			expect(wordsOf(s, bar, 1).every((w) => w !== null)).toBe(true);
			expect(wordsOf(s, bar, 2).every((w) => w === null)).toBe(true);
			expect(wordsOf(s, bar, 3).every((w) => w === null)).toBe(true);
		}
	});
});

describe.each([
	['strophic-volta.musicxml', true],
	['strophic-volta-from-top.musicxml', false],
])('%s', (file, hasForward) => {
	it('has two verses, a repeat with a first and a second ending, and one bar after the second ending', async () => {
		const s = await load(file);
		expect(sungVerseNumbers(s)).toEqual([1, 2]);
		expect(s.measures.filter((m) => m.repeatStart).map((m) => m.number)).toEqual(hasForward ? ['1'] : []);
		expect(s.measures.find((m) => m.repeatEnd)?.number).toBe('4');
		expect(s.measures.find((m) => m.repeatEnd)?.repeatTimes).toBeUndefined();
		expect(s.measures[3].ending?.passes).toEqual([1]);
		expect(s.measures[4].ending?.passes).toEqual([2]);
		expect(s.measures[5].ending).toBeUndefined();
		expect(s.measures).toHaveLength(6);
	});
});

describe('strophic-stacked.musicxml', () => {
	it('has three verses stacked under the music, an introduction, an ending, and no repeat or ending mark', async () => {
		const s = await load('strophic-stacked.musicxml');
		expect(sungVerseNumbers(s)).toEqual([1, 2, 3]);
		expect(s.measures.some((m) => m.repeatStart || m.repeatEnd || m.ending || m.jump)).toBe(false);
		expect(s.vocalLine.filter((e) => e.measureIndex < 2).every((e) => e.type === 'rest')).toBe(true);
		for (const bar of [2, 3, 4, 5]) expect(wordsOf(s, bar, 3).every((w) => w !== null)).toBe(true);
		for (const bar of [6, 7]) expect(wordsOf(s, bar, 2).every((w) => w === null)).toBe(true);
	});
});

describe('repeat-one-verse.musicxml', () => {
	it('has one verse and a repeat', async () => {
		const s = await load('repeat-one-verse.musicxml');
		expect(sungVerseNumbers(s)).toEqual([1]);
		expect(s.measures.filter((m) => m.repeatStart).map((m) => m.number)).toEqual(['1']);
		expect(s.measures.filter((m) => m.repeatEnd).map((m) => m.number)).toEqual(['3']);
	});
});

describe('strophic-tacet-boundary.musicxml', () => {
	it('is a repeat from the top that opens and closes on a tacet bar, with two verses', async () => {
		const s = await load('strophic-tacet-boundary.musicxml');
		expect(sungVerseNumbers(s)).toEqual([1, 2]);
		expect(s.measures.some((m) => m.repeatStart)).toBe(false);
		expect(s.measures.find((m) => m.repeatEnd)?.number).toBe('4');
		const runs = tacetRuns(s);
		expect(runs.map((r) => [r.fromMeasure, r.toMeasure])).toEqual([[0, 0], [3, 3]]);
	});
});
