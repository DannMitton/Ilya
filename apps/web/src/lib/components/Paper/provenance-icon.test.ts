/**
 * Row 148: no empty circle over a word. «ж» in «Ну-те ж все разом» is read off
 * `processText`'s output, as `typed-hyphens.test.ts` reads `stressSource`, with the
 * real dictionary loaded.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { processText } from '$lib/pipeline';
import { hasProvenanceIcon, ICONED_SOURCES } from './provenance-icon';
import type { WordStackData } from '$lib/types';

const DATA = join(__dirname, '../../../../static/data');

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

const words = (text: string): WordStackData[] => processText(text).flatMap((l) => l.words);

describe('row 148: the provenance frame', () => {
	it('«ж» in «Ну-те ж все разом» is an enclitic whose source has no icon, so it gets no frame', () => {
		const zh = words('Ну-те ж все разом').find((w) => w.cyrillic.toLowerCase() === 'ж');
		expect(zh).toBeDefined();
		// The desk's reading of the code, confirmed: the word carries a source the frame has no icon for.
		expect(zh!.isEnclitic || zh!.isProclitic || zh!.stressSource === 'clitic').toBe(true);
		expect(ICONED_SOURCES.has(zh!.stressSource)).toBe(false);
		expect(hasProvenanceIcon(zh!.stressSource)).toBe(false);
	});

	it('each of the four sources with an icon gets its frame', () => {
		for (const s of ['user-dictionary', 'user-composer', 'user-override', 'yo-restored']) expect(hasProvenanceIcon(s), s).toBe(true);
		expect([...ICONED_SOURCES].sort()).toEqual(['user-composer', 'user-dictionary', 'user-override', 'yo-restored']);
	});

	it('every other source gets none: dictionary, supplement, clitic, inferred, yo-normalized, and no source', () => {
		for (const s of ['dictionary', 'supplement', 'clitic', 'inferred', 'yo-normalized', 'none', undefined]) expect(hasProvenanceIcon(s), String(s)).toBe(false);
	});

	it('an inferred word that is not a clitic keeps its verify treatment: its source is `inferred`, which is not framed', () => {
		const inferred = words('Ну-те ж все разом').filter((w) => w.stressSource === 'inferred' && !w.isEnclitic && !w.isProclitic);
		for (const w of inferred) expect(hasProvenanceIcon(w.stressSource)).toBe(false);
	});

	it('the line carries the sources the desk read: «ж» is `inferred` and enclitic, «Ну-те» and «все» are the supplement’s, «разом» is the dictionary’s', () => {
		const seen = words('Ну-те ж все разом').map((w) => `${w.cyrillic}:${w.stressSource}:${w.isEnclitic ? 'enclitic' : w.isProclitic ? 'proclitic' : '-'}`);
		expect(seen).toEqual(['Ну-те:supplement:-', 'ж:inferred:enclitic', 'все:supplement:-', 'разом:dictionary:-']);
	});
});
