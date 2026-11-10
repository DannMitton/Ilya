/**
 * Integration step 10: the Inspector's line for the г of мягк-, лёгк-, легк- (`lexicalGk`, set by the phonology package's `lexical-gk.ts`).
 *
 * Before the rule's flag was known here, the engine's г = [x] was explained as devoicing's or softening's leftovers: «мягкий» read
 * "⟨г⟩ stays [x]: the sound right after it is not soft." (p. 206) and «мягкие» read "⟨г⟩ softens to [x] before the soft [kʲ]…" (p. 209), both
 * of which misdescribe a plain [x] that the root carries. It checks that the flag selects its own rule and its own line, in English
 * and French, and that without the flag nothing changes. WHEN IT FAILS: the Inspector tells a singer the г "stays" or "softens" to [x].
 * The two sentences are PROPOSED (not yet ratified by Dann); the citation of the rule is Grayson 2012 p. 17, printed beside the identity's page.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { composeBlurb, deriveRule, setBlurbData } from '../src/index';
import type { TranscriptionLogEntry } from '../src/index';

beforeAll(() => setBlurbData(JSON.parse(readFileSync(fileURLToPath(new URL('../../../data/blurb-composer.json', import.meta.url)), 'utf8'))));

const entry = (features: Record<string, unknown>): TranscriptionLogEntry => ({ char: 'г', ipa: 'x', features: { type: 'consonant', ...features } }) as unknown as TranscriptionLogEntry;

describe('lexical-gk', () => {
	it('is its own rule, ahead of softening and devoicing', () => {
		expect(deriveRule(entry({ lexicalGk: true }))).toBe('lexical-gk');
		expect(deriveRule(entry({ lexicalGk: true, soft: true, palReason: 'regressive-homorganic' }))).toBe('lexical-gk');
	});
	it('says the root carries the [x], in both languages, with the page', () => {
		const b = composeBlurb(entry({ lexicalGk: true }))!;
		expect(b.blurb.en).toContain('In the roots мягк- and лёгк-/легк-, ⟨г⟩ before ⟨к⟩ is [x], not the [k] that devoicing would give.');
		expect(b.blurb.fr).toContain('Dans les racines мягк- et лёгк-/легк-, ⟨г⟩ devant ⟨к⟩ se prononce [x], et non le [k] que donnerait le dévoisement.');
		expect(b.citation).toContain('17'); // the page of the rule, beside the г identity's own page
	});
	it('does not say "stays" or "softens" of it (what the Inspector said before)', () => {
		const b = composeBlurb(entry({ lexicalGk: true, soft: true, palReason: 'regressive-homorganic', trigger: 'kʲ' }))!;
		expect(b.blurb.en).not.toMatch(/stays|softens/);
		expect(b.blurb.fr).not.toMatch(/reste|palatalise/);
	});
	it('leaves any other г alone', () => {
		expect(deriveRule(entry({}))).not.toBe('lexical-gk');
	});
});
