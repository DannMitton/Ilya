/**
 * The -кий rhyme reading through `processText` with the real dictionary (step 3 of the rhyme lane). The matcher itself is
 * `rhyme-reading.test.ts`; this file holds what only the pipeline can show: the reading on the page, the partner on the
 * ⟨и⟩ entry, and Reconstitution.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { processText } from '$lib/pipeline';
import type { LineData, YoToggle } from '$lib/types';
import { witnessLines } from './text/witness-lines';
import { WordMarks } from './text/word-marks.svelte';

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

const ipa = (lines: LineData[], line: number, word: number) => lines[line].words[word].ipaContent;
const reconstituted = (lines: LineData[], line: number, word: number) => lines[line].words[word].ipaOwnReconstituted;
const iEntry = (lines: LineData[], line: number, word: number) =>
	lines[line].words[word].result.transcriptionLog.filter((e) => e.char === 'и').pop();

describe('the rhyme reading through processText', () => {
	it('typed on two lines, the pair reads [kʌj] in Text, and the partner is unchanged', () => {
		const lines = processText('глубокой\nвысокий');
		expect(ipa(lines, 1, 0)).toBe('vɨ ˈso kʌj');
		expect(ipa(lines, 0, 0)).toBe('ɡɫu ˈbo kʌj');
	});

	it('the ⟨и⟩ entry carries the partner in features.word, as typed without punctuation', () => {
		const lines = processText('«Глубокой,»\nвысокий');
		const e = iEntry(lines, 1, 0);
		expect(e?.features.exception).toBe('velar-adjectival-rhyme');
		expect(e?.features.word).toBe('Глубокой');
	});

	it('the pair on one line keeps the stage reading', () => {
		const lines = processText('глубокой высокий');
		expect(ipa(lines, 0, 1)).toBe('vɨ ˈso kɨj');
		expect(iEntry(lines, 0, 1)?.features.exception).toBe('velar-adjectival');
	});

	it('a blank line between the pair keeps the stage reading', () => {
		expect(ipa(processText('глубокой\n\nвысокий'), 1, 0)).toBe('vɨ ˈso kɨj');
	});

	it('a trigger with no partner keeps the stage reading', () => {
		expect(ipa(processText('высокий\nтонкий'), 0, 0)).toBe('vɨ ˈso kɨj');
	});

	it('only the line-final word changes: the same word earlier in the line stays stage', () => {
		const lines = processText('высокий, высокий\nглубокой');
		expect(ipa(lines, 0, 0)).toBe('vɨ ˈso kɨj');
		expect(ipa(lines, 0, 1)).toBe('vɨ ˈso kʌj');
	});

	it('Reconstitution keeps the pair rhyming: [ʌ] turns to [ɑ] in both', () => {
		const lines = processText('глубокой\nвысокий');
		expect(reconstituted(lines, 0, 0).endsWith('kɑj')).toBe(true);
		expect(reconstituted(lines, 1, 0).endsWith('kɑj')).toBe(true);
	});

	it('далекий without ё does not match; the ё toggle makes it match', () => {
		expect(ipa(processText('глубокой\nдалекий'), 1, 0)).toContain('kɨj');
		const toggles = new Map<string, YoToggle>([['1-0-3', { source: 'user-override' } as YoToggle]]);
		const toggled = processText('глубокой\nдалекий', { yoToggles: toggles });
		expect(ipa(toggled, 1, 0)).toContain('kʌj');
	});

	it('the user\'s stress override on the partner is honoured', () => {
		// a stressed -кой is not a partner: moving the stress to the last syllable ends the rhyme
		const m = new Map([['0-0', { stressIndex: 2, stressSource: 'user-override' }]]);
		const lines = processText('глубокой\nвысокий', { userStressOverrides: m as any });
		expect(ipa(lines, 1, 0)).toBe('vɨ ˈso kɨj');
	});

	it('русский keeps its lexical reading beside a partner', () => {
		const lines = processText('узкой\nрусский');
		expect(ipa(lines, 1, 0)).toContain('kʲij');
	});
});

describe('the singer\'s set-aside (rhyme lane 49)', () => {
	const aside = (...keys: string[]) => new Set(keys);

	it('ticked: the word reads [kɨj], and still carries its partner so the box stays drawn', () => {
		const lines = processText('глубокой\nвысокий', { rhymeSetAside: aside('1-0') });
		expect(ipa(lines, 1, 0)).toBe('vɨ ˈso kɨj');
		expect(lines[1].words[0].rhymePartner).toBe('глубокой');
		expect(iEntry(lines, 1, 0)?.features.exception).toBe('velar-adjectival');
	});

	it('unticked: [kʌj] returns, and the partner is the same', () => {
		const lines = processText('глубокой\nвысокий', { rhymeSetAside: aside() });
		expect(ipa(lines, 1, 0)).toBe('vɨ ˈso kʌj');
		expect(lines[1].words[0].rhymePartner).toBe('глубокой');
	});

	it('the partner is not changed by the set-aside of the trigger', () => {
		const lines = processText('глубокой\nвысокий', { rhymeSetAside: aside('1-0') });
		expect(ipa(lines, 0, 0)).toBe('ɡɫu ˈbo kʌj');
	});

	it('a set-aside trigger still links its rhyme group: the far trigger keeps the rhyme', () => {
		const text = 'глубокой\nдней\nречей\nвысокий\nлюдей\nдалёкий';
		const lines = processText(text, { rhymeSetAside: aside('3-0') });
		expect(ipa(lines, 3, 0)).toBe('vɨ ˈso kɨj');
		expect(ipa(lines, 5, 0)).toBe('dɑ ˈlʲo kʌj');
	});

	it('a word the matcher does not match carries no partner, so no box is drawn for it', () => {
		const lines = processText('глубокой высокий');
		expect(lines[0].words[1].rhymePartner).toBeUndefined();
		expect(processText('высокий\nтонкий')[0].words[0].rhymePartner).toBeUndefined();
	});

	it('another word\'s set-aside leaves this one alone', () => {
		const lines = processText('глубокой\nвысокий\n\nглубокой\nвысокий', { rhymeSetAside: aside('1-0') });
		expect(ipa(lines, 1, 0)).toBe('vɨ ˈso kɨj');
		expect(ipa(lines, 3, 0)).toBe('vɨ ˈso kʌj');
	});
});

describe('the set-aside through the Poem witness (`witness-lines.ts`)', () => {
	it('takes the reading from the marks of the witness, and the box\'s partner with it', () => {
		const marks = new WordMarks();
		const poem = 'глубокой\nвысокий';
		expect(ipa(witnessLines(poem, 'en', marks), 1, 0)).toBe('vɨ ˈso kʌj');
		marks.toggleRhyme('1-0');
		const aside = witnessLines(poem, 'en', marks);
		expect(ipa(aside, 1, 0)).toBe('vɨ ˈso kɨj');
		expect(aside[1].words[0].rhymePartner).toBe('глубокой');
		marks.toggleRhyme('1-0');
		expect(ipa(witnessLines(poem, 'en', marks), 1, 0)).toBe('vɨ ˈso kʌj');
	});
});
