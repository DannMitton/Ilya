/**
 * Integration steps 10 to 11: the Inspector's line for the г of мягк-, лёгк-, легк- (`lexicalGk`, set by the phonology package's `lexical-gk.ts`).
 *
 * Before the flag was known here, the engine's г = [x] was explained as softening's leftovers: «мягкий» read "⟨г⟩ stays [x]: the sound right
 * after it is not soft." (p. 206) and «мягкие» read "⟨г⟩ softens to [x] before the soft [kʲ]…" (p. 209), both of which misdescribe the rule.
 * The two sentences below are RATIFIED (Dann 2026-11-09 20:12; the desk's step 11c) and pinned here character by character: U+2019
 * apostrophes, a no-break space (U+00A0) before the French colon, Cyrillic letters that are Cyrillic. The citation of the rule is
 * Grayson 2012 p. 240 alone (the composer prints it beside the г identity's own page). This was a held test, written to fail until the
 * ratified text arrived; it passes on it. WHEN IT FAILS: the Inspector's line differs from what Dann ratified, or the rule falls back
 * to "stays" or "softens". It relates to `ratified-lines.test.ts` in the web app, which pins the same two sentences from the data file.
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
	it('says the ratified sentences, in both languages, citing p. 240', () => {
		const b = composeBlurb(entry({ lexicalGk: true }))!;
		expect(b.blurb.en).toContain('Within a word, ⟨г⟩ before ⟨к⟩ is read [x], or [xʲ] before a soft [kʲ]: Grayson’s мягко/мягкий rule, found in a few very common words such as мягкий and лёгкий.');
		expect(b.blurb.fr).toContain('À l’intérieur d’un mot, ⟨г⟩ devant ⟨к⟩ se prononce [x], ou [xʲ] devant un [kʲ] palatalisé\u00a0: c’est la règle мягко/мягкий de Grayson, propre à quelques mots très courants comme мягкий et лёгкий.');
		expect(b.citation).toContain('240');
		expect(b.citation).not.toContain('17');
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
