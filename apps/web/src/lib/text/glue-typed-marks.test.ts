/**
 * Step 9: leaving the Lyrics field glues a typed `#` to the word before it, and changes no placement.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { processText, wordGrid } from '$lib/pipeline';
import { collectScoreWords, scoreWordsText } from '$lib/score/vowel-resolver';
import { buildSlotQueue, syllableTargetIds } from '$lib/score/pairings';
import { reseatByDiff } from '$lib/score/reseat';
import { seatScoreWords } from '$lib/score/score-seat';
import { seatedTextDiff } from '$lib/score/seated-text';
import { glueTypedMarks, lyricsOnLeave, WORD_TOKEN } from './break-glue';

const NB = ' ';

describe('glueTypedMarks', () => {
	it.each([
		['я #', `я${NB}#`],
		['я  #', `я${NB}#`],
		['я \t#', `я${NB}#`],
		['я # на', `я${NB}# на`],
		['я #\nна', `я${NB}#\nна`],
		['я ##', `я${NB}##`],
		['мой друг #', `мой друг${NB}#`],
	])('turns «%s» into the no-break form', (typed, glued) => {
		expect(glueTypedMarks(typed)).toBe(glued);
	});

	it.each([
		['я #на'], // WORD_TOKEN would read «я #на» as one token and fuse two words
		['я#'],
		['ва#с'],
		[`я${NB}#`],
		['я\n#'],
		['я\n #'],
		['# на'],
		['я'],
		[''],
	])('leaves «%s» as it is', (text) => {
		expect(glueTypedMarks(text)).toBe(text);
	});

	it('never touches a line break: the space before a # on the next line stays, and the line break stays', () => {
		expect(glueTypedMarks('я\n #')).toBe('я\n #');
		expect(glueTypedMarks('я #\n#')).toBe(`я${NB}#\n#`);
	});

	it('does not glue a # that follows another # across a space', () => {
		expect(glueTypedMarks('я # #')).toBe(`я${NB}# #`);
	});

	it('is the mutant that would fuse two words: «я #на» converted reads as ONE token', () => {
		const fused = `я${NB}#на`;
		expect(fused.match(WORD_TOKEN)).toHaveLength(1);
		expect('я #на'.match(WORD_TOKEN)).toHaveLength(2);
		expect(glueTypedMarks('я #на').match(WORD_TOKEN)).toHaveLength(2);
	});

	it('is idempotent', () => {
		const once = glueTypedMarks('я # на # да #');
		expect(glueTypedMarks(once)).toBe(once);
	});
});

describe('lyricsOnLeave', () => {
	it('gives the new text where a # was glued, and null where nothing changes', () => {
		expect(lyricsOnLeave('я #', false)).toBe(`я${NB}#`);
		expect(lyricsOnLeave('я на', false)).toBeNull();
		expect(lyricsOnLeave(`я${NB}#`, false)).toBeNull();
	});
	it('changes nothing where the field shows the score\'s derived words', () => {
		expect(lyricsOnLeave('я #', true)).toBeNull();
	});
});

describe('on Sunless 1 with a # typed after three words, the gluing moves no placement', () => {
	const xml = readFileSync(fileURLToPath(new URL('../score/ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)), 'utf8');

	it('leaves the words, their syllables, every seat, and the IPA as they were', async () => {
		const score = (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'x.musicxml' })).score;
		const base = scoreWordsText(collectScoreWords(score, 1));
		const words = base.split(' ');
		// A # typed, with an ordinary space, after the 3rd, 9th, and 20th words.
		const typed = words.map((w, i) => ([2, 8, 19].includes(i) ? `${w} #` : w)).join(' ');
		const glued = glueTypedMarks(typed);
		expect(glued).not.toBe(typed);
		expect(glued.match(new RegExp(NB + '#', 'g'))).toHaveLength(3);

		expect(wordGrid(glued)).toEqual(wordGrid(typed));
		const a = processText(typed, { language: 'en' });
		const b = processText(glued, { language: 'en' });
		const shape = (lines: typeof a) => lines.map((l) => l.words.map((w) => [w.cleanWord, !!w.syntacticBreak, w.ipaContent, w.ipaDisplay, w.syllables.map((s) => [s.cyrillic, s.ipa])]));
		expect(shape(b)).toEqual(shape(a));
		expect(buildSlotQueue(b).map((s) => [s.cyrillic, s.ipa, s.origin])).toEqual(buildSlotQueue(a).map((s) => [s.cyrillic, s.ipa, s.origin]));
		// The break is on the word before it in both.
		expect(b[0].words.filter((w) => w.syntacticBreak)).toHaveLength(3);

		// Every seat: the score's seats on each text are the same, and the re-seat across the change moves none.
		const seatsA = seatScoreWords(score, {}, a).map;
		const seatsB = seatScoreWords(score, {}, b).map;
		expect(seatsB).toEqual(seatsA);
		const ids = syllableTargetIds(score.vocalLine);
		const { diff, before } = seatedTextDiff(typed, glued);
		expect(diff.unchanged).toBe(true);
		expect(reseatByDiff(seatsA, ids, buildSlotQueue(b), diff, before).map).toEqual(seatsA);
	});
});
