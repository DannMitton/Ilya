/**
 * Row 139's tests read the real dictionary and the real singer supplement, as
 * `components/Paper/provenance-icon.test.ts` does, so every IPA below is the engine's.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { processText } from '$lib/pipeline';
import type { WordStackData } from '$lib/types';

const DATA = join(__dirname, '../../static/data');

export function loadRealData(): void {
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
}

export const wordsOf = (text: string): WordStackData[] => processText(text).flatMap((l) => l.words);

/** Each word's printed IPA, as Text draws it. */
export const ipaOf = (text: string): string[] => wordsOf(text).map((w) => w.ipaDisplay);
