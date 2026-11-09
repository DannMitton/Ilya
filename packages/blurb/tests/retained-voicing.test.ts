/**
 * QUEUE row 157, step 3: the Inspector blurb for a final consonant that keeps its voicing
 * (`docs/sessions/ratified-retained-voicing-blurb_2026-10-26.md`, RATIFIED by Dann 2026-10-26 21:58, English and French).
 *
 * Reads the real `data/blurb-composer.json`. The strings are pinned by code point: the French has a no-break space
 * (U+00A0) before the colon and none before the semicolon (OQLF; `docs/memory/CONTRACT.md` §7, Fable's review of row 157,
 * finding 1), and « d’un » keeps its U+2019. It checks the data against the ratified words with the one OQLF correction;
 * if the semicolon regains a no-break space, the implication pins fail (a wrong space would reach the singer's
 * Inspector). `i18n.test.ts:103-116` runs the same rule over `i18n.ts` only, not over these templates.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { composeBlurb, deriveRule, setBlurbData } from '../src/index';
import type { TranscriptionLogEntry } from '../src/index';

const data = JSON.parse(readFileSync(fileURLToPath(new URL('../../../data/blurb-composer.json', import.meta.url)), 'utf8'));
beforeAll(() => setBlurbData(data));

const NBSP = ' ';
const PROCESS_EN = 'When ⟨{char}⟩ ends a preposition or a particle like it does here, and the next word begins with a vowel or a sonorant, it keeps its voicing as [{ipa}].';
const PROCESS_FR = `Lorsque ⟨{char}⟩ termine, comme ici, une préposition ou une particule et que le mot suivant commence par une voyelle ou une sonante, il conserve son voisement${NBSP}: [{ipa}].`;
const IMPLICATION_EN = "An ordinary word's final consonant would devoice here; a preposition or a particle keeps its voicing before a vowel or a sonorant.";
const IMPLICATION_FR = `La consonne finale d’un mot ordinaire se dévoiserait ici; une préposition ou une particule conserve son voisement devant une voyelle ou une sonante.`;
const LETTERS = ['б', 'в', 'г', 'д', 'ж', 'з'];

const entry = (char: string, ipa: string, features: Record<string, unknown> = {}): TranscriptionLogEntry =>
	({ char, ipa, features: { type: 'consonant', retainedVoicing: true, ...features } }) as unknown as TranscriptionLogEntry;

describe('retained-voicing in the data: the ratified pairs, verbatim', () => {
	it.each(LETTERS)('%s has a process and an implication, both languages, the ratified words, citation pp. 251–252', (L) => {
		const p = data.processes[`retained-voicing:${L}`];
		const i = data.implications[`retained-voicing:${L}`];
		expect(p.en).toEqual({ template: PROCESS_EN, citation: 'pp. 251–252' });
		expect(p.fr).toEqual({ template: PROCESS_FR, citation: 'pp. 251–252' });
		expect(i.en).toEqual({ template: IMPLICATION_EN, citation: 'pp. 251–252' });
		expect(i.fr).toEqual({ template: IMPLICATION_FR, citation: 'pp. 251–252' });
	});
	it('puts the French no-break space before the colon only, no space before the semicolon, and the apostrophe', () => {
		const fr = data.processes['retained-voicing:ж'].fr.template as string;
		expect(fr).toContain(`voisement${NBSP}: [{ipa}]`);
		expect(data.implications['retained-voicing:ж'].fr.template).toContain('ici; une');
		expect(data.implications['retained-voicing:ж'].fr.template).toContain('d’un');
	});
});

describe('retained-voicing in the composer', () => {
	it('is the rule for an entry that keeps its voicing', () => {
		expect(deriveRule(entry('ж', 'ʒ'))).toBe('retained-voicing');
	});
	it('comes after silent, regressive-devoicing, and regressive-voicing, and before final-devoicing, genitive, and bog-exception', () => {
		expect(deriveRule(entry('ж', 'ʒ', { silent: true, deletionCluster: true }))).toBe('silent');
		expect(deriveRule(entry('ж', 'ʃ', { voicingAssimilation: true, devoiced: true }))).toBe('regressive-devoicing');
		expect(deriveRule(entry('ж', 'ʒ', { voicingAssimilation: true, voiced: true }))).toBe('regressive-voicing');
		expect(deriveRule(entry('ж', 'ʃ', { finalDevoicing: true }))).toBe('retained-voicing');
		expect(deriveRule(entry('г', 'x', { bogException: true }))).toBe('retained-voicing');
	});
	it('is not the rule for an entry that does not carry it', () => {
		expect(deriveRule({ char: 'д', ipa: 't', features: { type: 'consonant', finalDevoicing: true } } as never)).toBe('final-devoicing');
	});

	// The citation is the identity's pages first (`composer.ts` pushes the identity first), then pp. 251–252.
	it.each([
		['ж', 'ʒ', '(Grayson, pp. 165, 174, 251–252)'],
		['з', 'z', '(Grayson, pp. 143, 251–252)'],
		['б', 'b', '(Grayson, pp. 144, 251–252)'],
		['д', 'd', '(Grayson, pp. 146, 251–252)'],
		['г', 'ɡ', '(Grayson, pp. 145, 251–252)'],
		['в', 'v', '(Grayson, pp. 152, 251–252)'],
	])('composes ⟨%s⟩ → [%s] as identity, process, implication, with the citation %s', (L, ipa, citation) => {
		const out = composeBlurb(entry(L, ipa))!;
		expect(out.citation).toBe(citation);
		expect(out.blurb.en).toContain(PROCESS_EN.replace('{char}', L).replace('{ipa}', ipa));
		expect(out.blurb.en).toContain(IMPLICATION_EN);
		expect(out.blurb.fr).toContain(PROCESS_FR.replace('{char}', L).replace('{ipa}', ipa));
		expect(out.blurb.fr).toContain(IMPLICATION_FR);
		// The identity sentence comes first.
		expect(out.blurb.en.indexOf('The ')).toBe(0);
		expect(out.blurb.en.indexOf('keeps its voicing as')).toBeGreaterThan(out.blurb.en.indexOf('/'));
	});
});
