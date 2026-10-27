/**
 * N.194 r5, section 5a: every site that splits Lyrics on whitespace or reads a score's folded mark, on the glued
 * form «я\u00A0#» (Dann 2026-10-25 23:52). Each test fails on a tree where its site uses a plain `\s` or `\S`.
 * The no-break space is written as the escape, never as a literal character.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { MusicXmlScoreParser, type ParsedScore, type ScoreParser } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { ingestScoreFile, type IngestDeps } from '$lib/score/ingestion/ingest';
import type { ScoreReader } from '$lib/reader/score-reader';
import { collectScoreWords } from '$lib/score/vowel-resolver';
import { carryPunctuation } from '$lib/score/clitic-seat';
import { proposeName } from '$lib/library/songs';
import { wordGrid } from '$lib/pipeline';
import { loadRealData } from '$lib/syntactic-break.support';
import { comparePoem, layOutLikePoem, lyricsSegments, poemSegments } from './poem-compare';
import { sameWords } from './same-words';

beforeAll(loadRealData, 60_000);

const note = (step: string, text?: string, syllabic = 'single') =>
	`<note><pitch><step>${step}</step><octave>3</octave></pitch><duration>1</duration><voice>1</voice><type>quarter</type>${
		text === undefined ? '' : `<lyric number="1"><syllabic>${syllabic}</syllabic><text>${text}</text></lyric>`
	}</note>`;
const sunless04Shape = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list>
<part id="P1"><measure number="1"><attributes><divisions>1</divisions><time><beats>5</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>
${note('C', 'я')}${note('D', '#')}${note('E', 'на')}${note('F', 'прав', 'begin')}${note('G', 'ду', 'end')}
</measure></part></score-partwise>`;
const musicxmlParser: ScoreParser = {
	canParse: () => true,
	parse: (input) => new MusicXmlScoreParser().parse({ ...input, data: parseXml(input.data as string) as unknown as Document }),
};
const inertReader: ScoreReader = { convert: async () => { throw new Error('not reached'); }, dispose: () => {} };
const deps: IngestDeps = { scoreReader: inertReader, musicxmlParser };
async function ingest(): Promise<ParsedScore> {
	const out = await ingestScoreFile(new File([sunless04Shape], 'sunless-04-shape.musicxml'), deps);
	if (!out.ok) throw new Error(`ingest failed: ${JSON.stringify(out.error)}`);
	return out.ingested.result.score;
}

describe('site 1: the tokenizer', () => {
	it('wordGrid of the glued form is that of the bare form', () => {
		expect(wordGrid('я\u00A0# на правду')).toEqual(wordGrid('я# на правду'));
		expect(wordGrid('я\u00A0# на правду')).toEqual([['я', 'на', 'правду']]);
	});
});

describe('site 4: sameWords', () => {
	it('the glued form folds as the bare form', () => {
		expect(sameWords('я\u00A0# на правду', 'я на правду')).toBe(true);
		expect(sameWords('я на правду', 'я\u00A0# на правду')).toBe(true);
		expect(sameWords('я\u00A0# на', 'я# на')).toBe(true);
		expect(sameWords('я\u00A0#на правду', 'я#на правду')).toBe(true); // the case a plain \s split gets wrong
		expect(sameWords('я\u00A0# на правду', 'я на правду!')).toBe(false);
	});
});

describe('site 5: the Lyrics-to-Poem comparison and its layout', () => {
	it('laying the Lyrics out in the poem’s lines keeps Ilya’s own «я\u00A0#» glued', () => {
		const laid = layOutLikePoem('я\u00A0# на правду', 'Я на\nправду');
		expect(laid).not.toBeNull();
		expect(laid).toContain('я\u00A0#');
		expect(laid).not.toContain('я #');
	});
	it('the comparison colours nothing for the glued form', () => {
		const lyrics = 'я\u00A0# на правду';
		const cmp = comparePoem(lyrics, 'я на правду')!;
		expect(cmp.differing).toBe(0);
		expect(cmp.omitted).toBe(0);
		expect(lyricsSegments(lyrics, cmp).every((s) => s.kind === 'plain')).toBe(true);
		expect(poemSegments('я на правду', cmp).every((s) => s.kind === 'plain')).toBe(true);
	});
});

describe('site 6: the name of an unnamed song', () => {
	it('opens on the words, with no # in it', () => {
		expect(proposeName({ metadata: { composer: '', title: '' }, poem: 'Я\u00A0# на правду', publishedPoem: '' } as never)).toBe('Я на правду');
		expect(proposeName({ metadata: { composer: '', title: '' }, poem: 'Я# на правду, # а ты', publishedPoem: '' } as never)).toBe('Я на правду, а');
	});
});

describe('site 7: the score’s words', () => {
	it('collectScoreWords on the fold’s output gives one word «я\u00A0#», and the cells hold the mark with its space', async () => {
		const words = collectScoreWords(await ingest(), 1);
		expect(words.map((w) => w.cells.map((c) => c.text).join(''))).toEqual(['я\u00A0#', 'на', 'правду']);
	});
});

describe('site 9: the punctuation a re-seated cell carries', () => {
	it('keeps the file’s punctuation and never the # or the space before it', () => {
		expect(carryPunctuation('я', 'я\u00A0#')).toBe('я');
		expect(carryPunctuation('я', 'я,\u00A0#')).toBe('я,');
		expect(carryPunctuation('я', 'я#')).toBe('я');
		expect(carryPunctuation('я', 'я,')).toBe('я,');
		expect(carryPunctuation('я', 'ты\u00A0#')).toBe('я');
	});
});
