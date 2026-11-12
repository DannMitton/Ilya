/**
 * The two notes on ⟨и⟩ of an unstressed -кий/-гий/-хий (rhyme lane 49, step 4). RATIFIED by Dann:
 * the stage note 2026-11-11 22:53, the rhyme note R1 22:54 (`docs/memory/OPEN.md`), in both languages, pinned character
 * for character (U+2019 apostrophes, a no-break space U+00A0 before the French colon, Cyrillic that is Cyrillic).
 *
 * Process `velar-adjectival` (the stage reading, [ɨ]) had no entry until now, and `composeBlurb` returned null for it: the
 * Inspector drew "No phonological note for this character." Process `velar-adjectival-rhyme` ([ʌ], from the engine's
 * 'literary' value) names the partner word in `features.word`. Both are standalone: the identity of ⟨и⟩ ("neither stress
 * nor position reduces it") would contradict them (Fable, 2026-11-12, amendment 1).
 * WHEN IT FAILS: the Inspector's note differs from what Dann ratified, or a note has gone back to opening with the identity.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { composeBlurb, deriveRule, setBlurbData } from '../src/index';
import type { TranscriptionLogEntry } from '../src/index';

const DATA = JSON.parse(readFileSync(fileURLToPath(new URL('../../../data/blurb-composer.json', import.meta.url)), 'utf8'));
beforeAll(() => setBlurbData(DATA));

const i = (ipa: string, exception: string, word?: string): TranscriptionLogEntry =>
	({ char: 'и', ipa, features: { type: 'vowel', position: 'posttonic-immediate', exception, ...(word ? { word } : {}) } }) as unknown as TranscriptionLogEntry;

const STAGE_EN = '⟨и⟩ is [ɨ] and the velar before it stays hard: the stage reading of the unstressed ending ⟨-ий⟩, which Grayson calls more appropriate for lyric diction. Avanesov records this reading and the soft one as both literary, the hard one following the older Moscow norm. Where the poem rhymes this ending with an unstressed ⟨-ой⟩, Ilya reads it [ʌj] instead, so that the rhyme holds (Grayson, p. 302).';
const STAGE_FR = '⟨и⟩ se prononce [ɨ] et la vélaire qui le précède reste dure : c’est la prononciation scénique de la terminaison inaccentuée ⟨-ий⟩, que Grayson juge plus appropriée à la diction lyrique. Avanesov consigne cette prononciation et la prononciation molle comme toutes deux littéraires, la dure suivant l’ancienne norme moscovite. Lorsque le poème fait rimer cette terminaison avec un ⟨-ой⟩ inaccentué, Ilya la prononce plutôt [ʌj], afin que la rime soit respectée (Grayson, p. 302).';
const R1_EN = '⟨и⟩ is [ʌ] here, and the velar before it stays hard, so that the ending rhymes with «глубокой». In older Russian verse an unstressed ⟨-ий⟩ after a velar rhymes with an unstressed ⟨-ой⟩, and Grayson gives the rhyme precedence.';
const R1_FR = '⟨и⟩ se prononce ici [ʌ], et la vélaire qui le précède reste dure, afin que la terminaison rime avec «глубокой». Dans la poésie russe ancienne, un ⟨-ий⟩ inaccentué après une vélaire rime avec un ⟨-ой⟩ inaccentué, et Grayson donne la priorité à la rime.';
const IDENTITY_EN = 'usually sounds like /i/';
const IDENTITY_FR = 'se prononce généralement /i/';

describe('the stage note on ⟨и⟩ of -кий (process velar-adjectival)', () => {
	it('is the key the engine\'s exception yields', () => {
		expect(deriveRule(i('ɨ', 'velar-adjectival'))).toBe('velar-adjectival');
	});
	it('says the ratified sentences, in both languages', () => {
		const b = composeBlurb(i('ɨ', 'velar-adjectival'))!;
		expect(b).not.toBeNull();
		expect((b.blurb as { en: string }).en).toBe(STAGE_EN);
		expect((b.blurb as { fr: string }).fr).toBe(STAGE_FR);
	});
	it('prints both sources: Grayson pp. 301–303 and Avanesov 1989, p. 660', () => {
		expect(composeBlurb(i('ɨ', 'velar-adjectival'))!.citation).toBe('(Grayson, pp. 301–303; Avanesov 1989, p. 660)');
	});
	it('holds U+00A0 before the French colon, and no plain space there', () => {
		expect(STAGE_FR).toContain('dure :');
		expect(DATA.processes['velar-adjectival:и'].fr.template).toContain('dure : c’est');
		expect(DATA.processes['velar-adjectival:и'].fr.template).not.toContain('dure : c’est');
	});
	it('is standalone: it does not open with the identity of ⟨и⟩', () => {
		const b = composeBlurb(i('ɨ', 'velar-adjectival'))!.blurb as { en: string; fr: string };
		expect(DATA.processes['velar-adjectival:и'].standalone).toBe(true);
		expect(b.en).not.toContain(IDENTITY_EN);
		expect(b.fr).not.toContain(IDENTITY_FR);
		expect(b.en.startsWith('⟨и⟩ is [ɨ]')).toBe(true);
	});
});

describe('the rhyme note on ⟨и⟩ of -кий (process velar-adjectival-rhyme)', () => {
	it('is the key the engine\'s literary exception yields', () => {
		expect(deriveRule(i('ʌ', 'velar-adjectival-rhyme', 'глубокой'))).toBe('velar-adjectival-rhyme');
	});
	it('says the ratified sentences, naming the partner, in both languages', () => {
		const b = composeBlurb(i('ʌ', 'velar-adjectival-rhyme', 'глубокой'))!;
		expect(b).not.toBeNull();
		expect((b.blurb as { en: string }).en).toBe(R1_EN);
		expect((b.blurb as { fr: string }).fr).toBe(R1_FR);
	});
	it('prints one source: (Grayson, p. 302)', () => {
		expect(composeBlurb(i('ʌ', 'velar-adjectival-rhyme', 'глубокой'))!.citation).toBe('(Grayson, p. 302)');
	});
	it('is standalone: it does not open with the identity of ⟨и⟩', () => {
		const b = composeBlurb(i('ʌ', 'velar-adjectival-rhyme', 'глубокой'))!.blurb as { en: string; fr: string };
		expect(DATA.processes['velar-adjectival-rhyme:и'].standalone).toBe(true);
		expect(b.en).not.toContain(IDENTITY_EN);
		expect(b.fr).not.toContain(IDENTITY_FR);
	});
});

describe('the two notes together', () => {
	it('have no em dash, and the same placeholders and citation in both languages', () => {
		for (const k of ['velar-adjectival:и', 'velar-adjectival-rhyme:и']) {
			const p = DATA.processes[k];
			expect(p.en.template + p.fr.template).not.toContain('—');
			expect(p.fr.citation).toBe(p.en.citation);
			expect(p.fr.template.match(/\{\w+\}/g)?.sort()).toEqual(p.en.template.match(/\{\w+\}/g)?.sort());
		}
	});
});
