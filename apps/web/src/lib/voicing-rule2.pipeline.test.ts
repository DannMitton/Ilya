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
import { composeBlurb, setBlurbData } from '@ilya/blurb';
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
	setBlurbData(JSON.parse(readFileSync(join(DATA_DIR, 'blurb-composer.json'), 'utf8')));
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
		['средь нас', 'ˈsʲrʲedʲ'], // row 175 step 1: с softens before the soft рʲ (dental rule; was ˈsrʲedʲ)
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
		['без встречи', 'bʲɪs ˈfsʲtʲrʲe tʃʲi'], // row 175 step 1: с, т soften before the soft рʲ (Grayson p. 210 сестрёнка; was ˈfstrʲe)
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

describe('row 157: «бог» as ruled (Dann 2026-10-26 21:35): [box] except before a voiced obstruent, where it is [boɣ], through the pipeline', () => {
	it.each([
		['Бог', 'ˈbox'],
		['Бог там', 'ˈbox'],
		['Бог мой', 'ˈbox'],
		['Бог один', 'ˈbox'],
		['Бог ли', 'ˈbox lʲi'],
		['Бог в траве', 'ˈbox'],
		['Бог в мае', 'ˈbox'],
		['Бог, мой', 'ˈbox'],
		['Бог даст', 'ˈboɣ'],
		['Бог в доме', 'ˈboɣ'],
		['Бог же', 'ˈboɣ ʒɨ'],
		['Бог бы', 'ˈboɣ bɨ'],
		['Бог был', 'ˈboɣ'],
	])('%s: the first word reads %s (an enclitic shows inside its host)', (text, expected) => {
		expect(display(text)[0]).toBe(expected);
	});

	it('небог still devoices to [k]', () => {
		expect(display('небог')[0]).toBe('ɲɛ bok');
	});

	it('the Inspector follows the surface: the ribbon says [ɣ] where the IPA does, [x] where it does', () => {
		const ribbon = (text: string) => {
			const log = line(text)[0].displayLog.filter((e: any) => e.features?.type === 'consonant');
			return log[log.length - 1];
		};
		expect(ribbon('Бог даст').ipa).toBe('ɣ');
		expect(ribbon('Бог в доме').ipa).toBe('ɣ');
		expect(ribbon('Бог мой').ipa).toBe('x');
		expect(ribbon('Бог').ipa).toBe('x');
		expect(ribbon('Бог даст').features.bogException).toBe(true);
		// ɣ has no voiceless partner in `voicedToVoiceless`, so the devoicing mark cannot land on it.
		expect(ribbon('Бог даст').features.finalDevoicing).toBe(false);
	});
});

describe('row 157: the в look-through for a voiceless final, through the pipeline (p. 251)', () => {
	const first = (text: string) => display(text)[0];
	it.each([
		['лес вдали', 'ˈlʲɛz'],
		['лес в доме', 'ˈlʲɛz'],
		['кот вдруг', 'ˈkod'],
		['лес в траве', 'ˈlʲɛs'],
		['лес вот', 'ˈlʲɛs'],
		['лес в лесу', 'ˈlʲɛs'],
		['сад вдали', 'ˈsɑd'],
	])('%s: the first word reads %s', (text, expected) => {
		expect(first(text)).toBe(expected);
	});
});

describe('row 157: the Inspector blurb for a kept voicing, through the pipeline (ratified by Dann 2026-10-26 21:58)', () => {
	/** The last consonant entry of a word's ribbon, and the blurb it composes. */
	const ribbon = (text: string, wordIdx = 0) => {
		const log = line(text)[wordIdx].displayLog.filter((e: any) => e.features?.type === 'consonant');
		const entry = log[log.length - 1];
		return { entry, blurb: composeBlurb(entry) };
	};
	const RETAINED = 'it keeps its voicing as [';
	/** The English sentence of a composed blurb (`blurb` is a string or a bilingual pair in the type). */
	const en = (b: { blurb: string | { en?: string } } | null) => (b && typeof b.blurb !== 'string' ? (b.blurb.en ?? '') : '');

	it.each([
		['меж нас', 0, 'ж', 'ʒ', '(Grayson, pp. 165, 174, 251–252)'],
		['без Анны', 0, 'з', 'z', '(Grayson, pp. 143, 251–252)'],
		['если б мог', 1, 'б', 'b', '(Grayson, pp. 144, 251–252)'],
		['сквозь нас', 0, 'з', 'zʲ', '(Grayson, pp. 143, 251–252)'],
		['вокруг нас', 0, 'г', 'ɡ', '(Grayson, pp. 145, 251–252)'],
	])('%s (word %i): the ⟨%s⟩ entry is marked, and the blurb says it keeps its voicing as [%s], citing %s', (text, idx, char, ipa, citation) => {
		const { entry, blurb } = ribbon(text, idx);
		expect(entry.char).toBe(char);
		expect(entry.ipa).toBe(ipa);
		expect(entry.features.retainedVoicing).toBe(true);
		expect(en(blurb)).toContain(`${RETAINED}${ipa}].`);
		expect(en(blurb)).toContain('An ordinary word');
		expect(blurb!.citation).toBe(citation);
	});

	it('сад наш: the ⟨д⟩ entry keeps final-devoicing (REGRESSION GUARD), and is not marked', () => {
		const { entry, blurb } = ribbon('сад наш');
		expect(entry.features.retainedVoicing).toBeUndefined();
		expect(entry.features.finalDevoicing).toBe(true);
		expect(en(blurb)).toContain('devoices to [t]');
	});
	it('муж дома: the ⟨ж⟩ entry is not marked: the branch for a voiced obstruent before a voiced obstruent is not boundary #4 (REGRESSION GUARD)', () => {
		const { entry, blurb } = ribbon('муж дома');
		expect(entry.features.retainedVoicing).toBeUndefined();
		expect(en(blurb)).not.toContain(RETAINED);
	});
	it('под водой: the ⟨д⟩ entry is not marked: the right word begins with в, so the singer sees «водой» and not a vowel', () => {
		const { entry, blurb } = ribbon('под водой');
		expect(entry.features.retainedVoicing).toBeUndefined();
		expect(en(blurb)).not.toContain(RETAINED);
	});
	it('меж нас: the ⟨ж⟩ entry carries retainedVoicing and neither finalDevoicing nor a regressive mark, so the one rule is retained-voicing', () => {
		const { entry } = ribbon('меж нас');
		expect(entry.features.retainedVoicing).toBe(true);
		expect(entry.features.finalDevoicing).toBeFalsy();
		expect(entry.features.voicingAssimilation).toBeFalsy();
	});
	it('сквозь нас: the ⟨з⟩ loses its "softens before the soft sign" blurb for this one, since deriveRule returns one rule', () => {
		const { blurb } = ribbon('сквозь нас');
		expect(en(blurb)).not.toContain('softens to [zʲ] before the soft sign');
	});
});
