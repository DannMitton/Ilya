import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';
import type { Vowel } from '$lib/voice/engine/types';
import { melodyAsk, melodyNotes, provisionalRuns } from './blank-notes';
import type { BlankPart } from '$lib/components/Paper/blank-state';

/* Lane 78, brief step 2: MELODY's state table. The pane reads `adapted.completeness.formants` and `adapted.generic`; this file reads what each row asks and says. */

const flat = (paragraphs: BlankPart[][]) => paragraphs.map((p) => p.map((r) => r.text).join(''));
const base = { generic: false, sampledCount: 10, personal: true, core: ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'] as Vowel[], provisional: [] as Vowel[], language: 'en' as const };

describe('MELODY with no score: what it asks', () => {
	it('asks for both when the voice has nothing, and for the score otherwise (Dann 2026-11-19 09:35: marking is what MELODY is for)', () => {
		expect(melodyAsk(true)).toBe('both');
		expect(melodyAsk(false)).toBe('score');
	});
});

describe('MELODY with no score: what NOTES says, by the voice’s state', () => {
	it('a type chosen and nothing sung: none; the title line already says whose values', () => {
		expect(melodyNotes({ ...base, generic: true, sampledCount: 0, personal: false, core: [] })).toEqual([]);
	});
	it('sung, not yet complete: the VOICE pane’s own belowCore line, then the provisional sentence if any vowel is provisional', () => {
		const notes = flat(melodyNotes({ ...base, sampledCount: 3, personal: false, core: ['i', 'e', 'u'], provisional: ['e'] }));
		expect(notes[0]).toContain('You have sampled 3 of the 6 core vowels so far');
		expect(notes[1]).toMatch(/^Your \[e\].* is provisional; set it in VOICE\.$/);
		expect(flat(melodyNotes({ ...base, sampledCount: 3, personal: false, core: ['i', 'e', 'u'] }))).toHaveLength(1);
	});
	it('complete: the status line, then the provisional sentence, singular or plural as the count requires', () => {
		const one = flat(melodyNotes({ ...base, provisional: ['e'] }));
		expect(one[0]).toBe('Your profile is now set with ten vowels measured.');
		expect(one[1]).toMatch(/ is provisional; set it in VOICE\.$/);
		const three = flat(melodyNotes({ ...base, provisional: ['e', 'a', 'ɨ'] }));
		expect(three[1]).toMatch(/^Your \[e\].*, \[a\].*, and \[ɨ\].* are provisional; set them in VOICE\.$/);
		expect(flat(melodyNotes({ ...base }))).toEqual(['Your profile is now set with ten vowels measured.']);
	});
	it('in French the sentence is the ratified one, singular and plural', () => {
		const one = flat(melodyNotes({ ...base, language: 'fr', provisional: ['e'] }));
		expect(one[1]).toMatch(/^Votre voyelle \[e\].* est provisoire; réglez-la dans VOIX\.$/);
		const two = flat(melodyNotes({ ...base, language: 'fr', provisional: ['e', 'a'] }));
		expect(two[1]).toMatch(/^Vos voyelles \[e\].* et \[a\].* sont provisoires; réglez-les dans VOIX\.$/);
	});
});

describe('the provisional sentence’s runs', () => {
	it('draw each vowel as an IPA glyph then its informal name, and VOICE or VOIX as the one link', () => {
		const runs = provisionalRuns(['e', 'ɨ'], 'en');
		expect(runs.filter((r) => r.kind === 'ipa').map((r) => r.text)).toEqual(['[e]', '[ɨ]']);
		expect(runs.filter((r) => r.kind === 'link')).toEqual([{ kind: 'link', text: 'VOICE', to: 'voice' }]);
		expect(provisionalRuns(['e'], 'fr').filter((r) => r.kind === 'link')).toEqual([{ kind: 'link', text: 'VOIX', to: 'voice' }]);
	});
	it('use the two ratified sentences and no direction', () => {
		for (const lang of ['en', 'fr'] as const) for (const key of ['profile.provisional.sentenceSingular', 'profile.provisional.sentencePlural']) {
			expect(t(key, lang)).not.toMatch(/DRAWER|TIROIR|\bleft\b|à gauche|de gauche/);
		}
	});
});
