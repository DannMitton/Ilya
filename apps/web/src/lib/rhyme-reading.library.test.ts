/**
 * THE LIBRARY PIN (Fable r1, finding 5; Dann's 2026-11-09 20:19 idea, done as a test). The rhyme reading is live and stores
 * no flag, so what the singer will see on a library poem is whatever `processText` does with its text. This runs it over every
 * entry of the built poem file and pins the list of line ends that take the reading. A new entry with such a pair fails the
 * test until someone reads the pair and updates the list (Fable's second review, amendment 9: the lane reports each match as
 * the two lines, the poem's title, and both transcriptions).
 *
 * At lane 49 (library of 327 entries, `dictionary.poems.d77d09cd.json`) the list is EMPTY: five line-final velar -ий words,
 * none with a partner in reach. One near miss is declined by rule 4: «Ночь печальна, как мечты мои…», where «широкой» ends one
 * line and «одинокий» the next, and «одинокий» has no stress in the dictionary, so it stays stage until the singer marks it.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { processText } from '$lib/pipeline';

const DATA_DIR = join(__dirname, '../../static/data');

beforeAll(() => {
	const dictionary: Record<string, any> = {};
	for (const file of ['dictionary.86d83340-a.json', 'dictionary.86d83340-b.json'])
		for (const line of readFileSync(join(DATA_DIR, file), 'utf8').split(/\r?\n/)) {
			if (!line.trim()) continue;
			try {
				const [word, entry] = JSON.parse(line);
				if (entry.e !== undefined || entry.f !== undefined) entry.g = { en: entry.e || '', fr: entry.f || '' };
				dictionary[word] = entry;
			} catch {
				/* skipped, as loader.ts skips it */
			}
		}
	setStressDictionary(dictionary);
	setGlossDictionary(dictionary);
	setSingerSupplement(JSON.parse(readFileSync(join(DATA_DIR, 'singer-supplement.json'), 'utf8')));
});

/** The built file the manifest names, so a rebuild with a new hash is read without an edit here. */
function poemEntries(): { id: string; title: string; textModern: string }[] {
	const manifest = JSON.parse(readFileSync(join(DATA_DIR, 'dictionary-manifest.json'), 'utf8'));
	return JSON.parse(readFileSync(join(DATA_DIR, manifest.poemFiles[0]), 'utf8')).entries;
}

/** The pins: entry id and line index of every line end the matcher takes, with the partner it names. */
const PINNED_MATCHES: string[] = [];

describe('the rhyme reading over the poem library', () => {
	it('matches exactly the pinned list of line ends (read each new pair before updating it)', () => {
		const found: string[] = [];
		for (const entry of poemEntries()) {
			processText(entry.textModern).forEach((line, lineIdx) => {
				const last = line.words[line.words.length - 1];
				const i = last?.result.transcriptionLog.filter((e) => e.features?.exception === 'velar-adjectival-rhyme').pop();
				if (i) found.push(`${entry.id} L${lineIdx} ${last.cleanWord} ~ ${i.features.word}`);
			});
		}
		expect(found).toEqual(PINNED_MATCHES);
	}, 300_000);

	it('declines the one near miss for want of stress, and does not guess', () => {
		const e = poemEntries().find((x) => x.id === '2b82617c1a');
		expect(e).toBeDefined();
		const lines = processText(e!.textModern);
		const trigger = lines[2].words[lines[2].words.length - 1];
		expect(trigger.cleanWord).toBe('одинокий');
		expect(trigger.stressSource).toBe('inferred');
		expect(trigger.ipaContent).toContain('kɨj');
	});
});
