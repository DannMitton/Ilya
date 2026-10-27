/**
 * QUEUE «ну-те» entry: «Ну-те ж все разом» (Mussorgsky, «Весёлый час») glossed «Ну-те» as
 * "chickpea, garbanzo", because the typed hyphen is dropped before lookup and «нуте» is a
 * form of «нут». The singer supplement now carries «нуте» (a modal equivalent, ruled by Dann
 * 2026-10-20 23:22 and 23:23, French ratified 23:39). Read off `processText`'s output with the
 * real data loaded, as `provenance-icon.test.ts` does.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { GraysonEngine, setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { processText } from '$lib/pipeline';
import type { WordStackData } from '$lib/types';

const DATA = join(__dirname, '../../static/data');

beforeAll(() => {
	const dictionary: Record<string, any> = {};
	for (const f of ['dictionary.86d83340-a.json', 'dictionary.86d83340-b.json'])
		for (const line of readFileSync(join(DATA, f), 'utf8').split(/\r?\n/)) {
			if (!line.trim()) continue;
			try {
				const [w, e] = JSON.parse(line);
				if (e.e !== undefined || e.f !== undefined) e.g = { en: e.e || '', fr: e.f || '' };
				dictionary[w] = e;
			} catch {
				/* a malformed line is skipped, as the loader skips it */
			}
		}
	setStressDictionary(dictionary);
	setGlossDictionary(dictionary);
	setSingerSupplement(JSON.parse(readFileSync(join(DATA, 'singer-supplement.json'), 'utf8')));
}, 60_000);

const words = (language: 'en' | 'fr'): WordStackData[] =>
	processText('Ну-те ж все разом', { language }).flatMap((l) => l.words);
const glossOf = (language: 'en' | 'fr', cyrillic: string) =>
	words(language).find((w) => w.cyrillic.toLowerCase() === cyrillic)?.gloss;

describe('«Ну-те ж все разом»: the gloss under «Ну-те»', () => {
	// The word stack prints `gloss` through `truncateGloss`, which strips every parenthetical
	// (`packages/dictionary/src/gloss.ts:336-338`), so the singer reads the ratified gloss
	// without "(urging)". The ratified strings themselves are pinned in the next test.
	it('reads "come now" in English, not "chickpea, garbanzo"', () => {
		expect(glossOf('en', 'ну-те')).toBe('come now');
	});

	it('reads "allons" in French', () => {
		expect(glossOf('fr', 'ну-те')).toBe('allons');
	});

	it('the supplement carries the ratified strings, verbatim', () => {
		const supplement = JSON.parse(readFileSync(join(DATA, 'singer-supplement.json'), 'utf8'));
		expect(supplement['нуте']).toEqual({
			stress: 0,
			gloss: { en: 'come now (urging)', fr: 'allons (exhortation)' },
			source: 'supplement'
		});
	});

	it('«ж» keeps its own gloss, read from the engine\u2019s clitic table', () => {
		const clitic = GraysonEngine.cliticData.get('ж')!.gloss as { en: string; fr: string };
		expect(clitic).toEqual({ en: '(emphasis)', fr: '(emphase)' });
		expect(glossOf('en', 'ж')).toBe(clitic.en);
		expect(glossOf('fr', 'ж')).toBe(clitic.fr);
	});
});
