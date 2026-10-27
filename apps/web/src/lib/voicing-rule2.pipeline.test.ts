/**
 * N.198 through `processText` with the real dictionary: Grayson (2012) p. 251,
 * rule 2, and the p. 252 examples. The engine-level pins are in
 * `packages/phonology/tests/voicing-rule2.test.ts`, on hand-built words; this
 * file is the one that cannot lie about a boundary, because `boundaries.ts`
 * sets it. The dictionary is loaded as `approval/ipa-corpus.approval.test.ts`
 * loads it (its header says why `loadDictionary` cannot run under node).
 *
 * REGRESSION GUARD marks a pin that passes before N.198 as well (the word
 * already keeps its voicing). Grayson prints [mʲeʐ nas] and [bʲez ˈanɪ];
 * Ilya's proclitic reduces the vowel, so those pins assert the consonant.
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
	for (const file of ['dictionary.86d83340-a.json', 'dictionary.86d83340-b.json']) {
		for (const line of readFileSync(join(DATA_DIR, file), 'utf8').split(/\r?\n/)) {
			if (!line.trim()) continue;
			try {
				const [word, entry] = JSON.parse(line);
				if (entry.e !== undefined || entry.f !== undefined) entry.g = { en: entry.e || '', fr: entry.f || '' };
				dictionary[word] = entry;
			} catch {
				// A malformed line is skipped, as loader.ts does.
			}
		}
	}
	setStressDictionary(dictionary);
	setGlossDictionary(dictionary);
	setSingerSupplement(JSON.parse(readFileSync(join(DATA_DIR, 'singer-supplement.json'), 'utf8')));
}, 30_000);

/** The line's words as the singer reads them. A clitic merged into its host shows as an arrow. */
function line(text: string) {
	const [t] = processText(text);
	return t?.words ?? [];
}
const display = (text: string) => line(text).map((w) => w.ipaDisplay);
/** The line's IPA with the merge arrows dropped. */
const sung = (text: string) => display(text).filter((d) => d !== '→' && d !== '←').join(' ');

describe('N.198: boundaries.ts gives the boundary the rule reads', () => {
	it.each(['сад', 'друг', 'глаз', 'вокруг', 'сквозь', 'близ', 'средь', 'из-под', 'вслед', 'вглубь', 'промеж'])(
		'%s is a soft boundary: not a proclitic, so the preposition set (not the clitic list) keeps its voicing',
		(w) => {
			expect(line(`${w} нас`)[0].rightBoundary).toBe('soft');
		},
	);

	it.each(['без', 'из', 'под', 'об', 'меж'])('%s is a clitic boundary (a proclitic)', (w) => {
		expect(line(`${w} нас`)[0].rightBoundary).toBe('clitic');
	});

	it('cleanWord holds «изпод» for «из-под»: the dash is dropped, so the set is keyed without it', () => {
		expect(line('из-под Анны')[0].cleanWord).toBe('изпод');
	});
});

describe('N.198: an ordinary word devoices before a vowel or sonorant (p. 252)', () => {
	it.each([
		['сад наш', 'ˈsɑt'],
		['сад Анны', 'ˈsɑt'],
		['сад ваш', 'ˈsɑt'],
		['друг мой', 'ˈdruk'],
		['глаз открыт', 'ˈɡɫɑs'],
	])('%s: the first word is %s', (text, first) => {
		expect(display(text)[0]).toBe(first);
	});
});

describe('N.198: a preposition keeps its voicing (REGRESSION GUARD for the p. 252 pair)', () => {
	it('меж нас keeps [ʒ]', () => {
		expect(sung('меж нас')).toMatch(/ʒ ˈnɑs$/);
	});

	it('без Анны keeps [z]', () => {
		expect(sung('без Анны')).toMatch(/z ˈɑn/);
	});

	it('из окна and об этом keep their voicing at the clitic boundary', () => {
		expect(sung('из окна')).toMatch(/^iz /);
		expect(sung('об этом')).toMatch(/^ɑb /);
	});

	it('если б мог: the contraction б stays [b] (Learn prints /ˈjeslʲi b mok/)', () => {
		expect(sung('если б мог')).toMatch(/b ˈmok$/);
	});

	it('разлука: a prefix before a root inside one word is unchanged', () => {
		expect(sung('разлука')).toBe('rɑz ˈɫu kɑ');
	});

	it('сад ли: the enclitic boundary keeps [d] (NOT ESTABLISHED in Grayson; left as it was)', () => {
		expect(sung('сад ли')).toBe('ˈsɑd lʲi');
	});

	it('кот бы: rule 4, an enclitic after a voiced obstruent', () => {
		expect(sung('кот бы')).toBe('ˈkod bɨ');
	});
});

describe('N.198: the eight-word preposition set (Dann, 2026-10-26 17:26; REGRESSION GUARD, voiced before and after)', () => {
	it.each([
		['сквозь нас', 'ˈskvozʲ'],
		['вокруг нас', 'vɑk ˈruɡ'],
		['близ Анны', 'ˈblʲiz'],
		['средь нас', 'ˈsrʲedʲ'],
	])('%s: the first word is %s', (text, first) => {
		expect(display(text)[0]).toBe(first);
	});

	it('из-под Анны: the first word ends in [d]', () => {
		expect(display('из-под Анны')[0]).toMatch(/pʌd$/);
	});
});

describe('N.198: в is ignored where it would influence (p. 251)', () => {
	it.each([
		['сад вдали', 'ˈsɑd'],
		['сад в доме', 'ˈsɑd'],
		['глаз вдруг', 'ˈɡɫɑz'],
		['муж вдовы', 'ˈmuʒ'],
		['друг взглянул', 'ˈdruɡ'],
		['сад взор', 'ˈsɑd'],
	])('%s keeps its voicing (REGRESSION GUARD, right by accident before N.198): %s', (text, first) => {
		expect(display(text)[0]).toBe(first);
	});

	it('сад в траве devoices, and the в word devoices at its own boundary', () => {
		expect(display('сад в траве')[0]).toBe('ˈsɑt');
		expect(sung('сад в траве')).toMatch(/ftrɑ ˈvʲɛ$/);
	});

	it.each([
		['без встречи', 'bʲɪs ˈfstrʲe tʃʲi'],
		['без всех', 'bʲɪs ˈfsʲɛx'],
	])('%s: в + voiceless is already [f] within the word (REGRESSION GUARD)', (text, ipa) => {
		expect(sung(text)).toBe(ipa);
	});
});

describe('N.198: the «бог» exception (Grayson p. 144, [box]; REGRESSION GUARD through the pipeline)', () => {
	it('Бог мой and Бог один keep [x]', () => {
		expect(display('Бог мой')[0]).toBe('ˈbox');
		expect(display('Бог один')[0]).toBe('ˈbox');
	});

	it('Как дай вам Бог любимой keeps [x] inside the corpus line', () => {
		expect(sung('Как дай вам Бог любимой быть другим.')).toContain('ˈbox');
	});
});
