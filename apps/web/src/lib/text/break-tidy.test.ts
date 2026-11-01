/**
 * QUEUE row 163 step 3: leaving the Lyrics field tidies every typed # to «<unit> #», and changes no placement
 * for a # that stands after a word in its own line.
 */
import { beforeAll, describe, expect, it } from 'vitest';
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
import { loadRealData } from '$lib/syntactic-break.support';
import { lyricsOnLeave, tidyBreaks } from './break-tidy';
import { BREAK_MARK } from './break-text';

beforeAll(loadRealData, 60_000);

const NB = ' ';

describe('tidyBreaks: every typed form of # becomes «<unit> #»', () => {
	it.each([
		['no space', 'полёт# да', `полёт${NB}# да`],
		['one space', 'полёт # да', `полёт${NB}# да`],
		['many spaces', 'полёт    # да', `полёт${NB}# да`],
		['a tab', 'полёт \t# да', `полёт${NB}# да`],
		['already glued', `полёт${NB}# да`, `полёт${NB}# да`],
		['a no-break space and a space', `полёт ${NB}# да`, `полёт${NB}# да`],
		['a mix', `полёт ${NB} \t# да`, `полёт${NB}# да`],
		['the # leading the next word', 'полёт #да', `полёт${NB}# да`],
		['the # inside a word', 'ва#с да', `вас${NB}# да`],
		['two # together', 'полёт ## да', `полёт${NB}# да`],
		['two # apart', 'полёт # # да', `полёт${NB}# да`],
		['at the end of the line', 'я иду #', `я иду${NB}#`],
		['with nothing after it', 'я иду#', `я иду${NB}#`],
	])('%s', (_, typed, tidy) => {
		expect(tidyBreaks(typed)).toBe(tidy);
	});

	it('writes the mark as BREAK_MARK', () => {
		expect(BREAK_MARK).toBe(`${NB}#`);
		expect(tidyBreaks('я иду#')).toBe(`я иду${BREAK_MARK}`);
	});

	it('moves a # after a proclitic to the end of its unit: «в# доме» to «в доме #»', () => {
		expect(tidyBreaks('в# доме')).toBe(`в доме${NB}#`);
		expect(tidyBreaks('в # доме')).toBe(`в доме${NB}#`);
	});

	it('moves a # before an enclitic to the end of its unit', () => {
		expect(tidyBreaks('сказал # бы я')).toBe(`сказал бы${NB}# я`);
	});

	it('leaves everything else as it was: spacing, line breaks, a text with no # at all', () => {
		expect(tidyBreaks('я  иду\n\nтуда')).toBe('я  иду\n\nтуда');
		expect(tidyBreaks('')).toBe('');
		expect(tidyBreaks('я # на\nправду')).toBe(`я${NB}# на\nправду`);
	});

	it('a # at the start of a line moves to the end of the line before', () => {
		expect(tidyBreaks('я иду\n# туда')).toBe(`я иду${NB}#\nтуда`);
		expect(tidyBreaks('я иду\n#туда')).toBe(`я иду${NB}#\nтуда`);
		expect(tidyBreaks(`я иду\n${NB}# туда`)).toBe(`я иду${NB}#\nтуда`);
	});

	it('a line holding only a # goes, and its # ends the line before', () => {
		expect(tidyBreaks('я иду\n#\nтуда')).toBe(`я иду${NB}#\nтуда`);
	});

	it('a # with no word before it is removed', () => {
		expect(tidyBreaks('# я иду')).toBe('я иду');
		expect(tidyBreaks('#\nя иду')).toBe('я иду');
		expect(tidyBreaks('я\n\n# иду')).toBe('я\n\nиду');
	});

	it('is idempotent', () => {
		for (const typed of ['я # на # да #', 'в# доме ## да', 'я\n#\nна', 'ва#с # да']) {
			const once = tidyBreaks(typed);
			expect(tidyBreaks(once)).toBe(once);
		}
	});
});

describe('lyricsOnLeave', () => {
	it('gives the new text where a # was tidied, and null where nothing changes', () => {
		expect(lyricsOnLeave('я #', false)).toBe(`я${NB}#`);
		expect(lyricsOnLeave('я на', false)).toBeNull();
		expect(lyricsOnLeave(`я${NB}#`, false)).toBeNull();
	});
	it('changes nothing where the field shows the score’s derived words', () => {
		expect(lyricsOnLeave('я #', true)).toBeNull();
	});
});

describe('on Sunless 1 with a # typed in every form, the tidy moves no placement', () => {
	const xml = readFileSync(fileURLToPath(new URL('../score/ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)), 'utf8');
	// One # after the 3rd, 9th, 20th, 30th, 40th, and 50th word, in each typed form. A form writes the gap that
	// follows the word (`gap`) and, for the last, what the # leads (`led`: the # touches the NEXT word).
	const forms: [string, string, boolean][] = [
		['a space', ' # ', false],
		['no space', '# ', false],
		['many spaces', '   # ', false],
		['no-break and ordinary spaces', ` ${NB}# `, false],
		['led onto the next word', ' #', true],
		['two together', ' ## ', false],
	];
	const at = [2, 8, 19, 29, 39, 49];
	const type = (words: string[], gap: string, led: boolean): string =>
		words.map((w, i) => (i === words.length - 1 ? w : at.includes(i) ? w + gap : w + ' ')).join('').replace(led ? /$/ : /$^/, '');

	const shape = (lines: ReturnType<typeof processText>) =>
		lines.map((l) => l.words.map((w) => [w.cleanWord, !!w.syntacticBreak, w.ipaContent, w.ipaDisplay, w.syllables.map((s) => [s.cyrillic, s.ipa])]));

	it.each(forms)('%s: words, syllables, seats, and IPA are as they were', async (_name, gap, led) => {
		const score = (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'x.musicxml' })).score;
		const base = scoreWordsText(collectScoreWords(score, 1));
		const typed = type(base.split(' '), gap, led);
		const tidy = tidyBreaks(typed);
		expect(tidy).not.toBe(typed);
		// Two typed # can land on one unit (a clitic and its host), and a unit holds one.
		expect(tidy.split(`${NB}#`).length - 1).toBe(processText(typed, { language: 'en' })[0].words.filter((w) => w.syntacticBreak).length);
		expect(tidy).not.toMatch(/[^\u00A0]#|#[^\s]/u);

		expect(wordGrid(tidy)).toEqual(wordGrid(typed));
		const a = processText(typed, { language: 'en' });
		const b = processText(tidy, { language: 'en' });
		expect(shape(b)).toEqual(shape(a));
		expect(buildSlotQueue(b).map((s) => [s.cyrillic, s.ipa, s.origin])).toEqual(buildSlotQueue(a).map((s) => [s.cyrillic, s.ipa, s.origin]));

		const seatsA = seatScoreWords(score, {}, a).map;
		const seatsB = seatScoreWords(score, {}, b).map;
		expect(seatsB).toEqual(seatsA);
		const ids = syllableTargetIds(score.vocalLine);
		const { diff, before } = seatedTextDiff(typed, tidy);
		expect(diff.unchanged).toBe(true);
		expect(reseatByDiff(seatsA, ids, buildSlotQueue(b), diff, before).map).toEqual(seatsA);
	});

	it('a line-initial # is the one form that changes meaning: dropped before the tidy, a break on the line before after it', () => {
		const typed = 'я иду\n# туда';
		const before = processText(typed, { language: 'en' });
		const after = processText(tidyBreaks(typed), { language: 'en' });
		expect(before[0].words.some((w) => w.syntacticBreak)).toBe(false);
		expect(after[0].words.filter((w) => w.syntacticBreak)).toHaveLength(1);
		expect(after[0].words[after[0].words.length - 1].syntacticBreak).toBe(true);
	});
});
