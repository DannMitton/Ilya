import { describe, expect, it } from 'vitest';
import type { Vowel } from '../engine/types';
import { VOWELS } from '../engine/types';
import { stringKeys, t } from '$lib/i18n';
import {
	GLYPH_NUDGE, bracket, buttonLabel, buttonStates, cueText, firstTimeExplanation, hasDeclaredType, hintText, hintsFor, idleCue, mainButton, staysAfterTake, stopLabel
} from './screen-logic';

const S = (...vs: Vowel[]) => new Set<Vowel>(vs);
const ALL = S(...VOWELS);

describe('the ten buttons', () => {
	it('are sung or placed, and are named by the spoken name, the state, and selected', () => {
		const states = buttonStates(S('i'));
		expect(states.i).toBe('sung');
		expect(states.e).toBe('placed');
		expect(buttonLabel('i', 'sung', true, 'en')).toBe('cardinal-i, sung, selected');
		expect(buttonLabel('ɨ', 'placed', false, 'en')).toBe('velar-i, placeholder');
		expect(buttonLabel('ɨ', 'placed', false, 'fr')).toBe('i vélaire, valeur par défaut');
	});
	it('carry a nudge for every vowel', () => {
		for (const v of VOWELS) expect(GLYPH_NUDGE[v]).toHaveLength(2);
	});
});

describe('the hint', () => {
	const base = { active: false, confirmingClear: false, selected: 'i' as Vowel, sung: S(), voiceType: 'bass' };
	it('names the first move when nothing is sung', () => {
		expect(hintText(hintsFor(base), 'en')).toBe('Start follows Ilya’s order. Or tap any vowel to sing that one now.');
	});
	it('says what ends a take while one runs, and only that', () => {
		expect(hintsFor({ ...base, active: true, sung: S('i') })).toEqual([{ key: 'capture.hint.active', vars: { v: '[i]' } }]);
		expect(hintText(hintsFor({ ...base, active: true }), 'en')).toBe('Stop, or a second tap on [i], ends this take. Nothing is saved from it.');
	});
	it('asks for the second tap on Clear all, and only that', () => {
		expect(hintText(hintsFor({ ...base, confirmingClear: true, sung: S('i') }), 'en')).toBe('Tap Clear all to clear every reading for this voice.');
		expect(hintsFor({ ...base, confirmingClear: true, active: true })).toHaveLength(1);
	});
	it('invites a re-take of a sung vowel, then says how many remain', () => {
		const t = hintText(hintsFor({ ...base, sung: S('i', 'e'), selected: 'i' }), 'en');
		expect(t).toBe('A re-take replaces [i] only if the new reading is as clear. 8 to go, in any order. Ilya keeps a placeholder for each until you sing it.');
	});
	it('says a placeholder stands in for an unsung selection, from the voice type or from typical voices, never that it is wrong', () => {
		const typed = hintText(hintsFor({ ...base, sung: S('i'), selected: 'ɑ', voiceType: 'bass' }), 'en');
		expect(typed).toBe('Ilya has placed [ɑ] from your voice type for now. Its placeholder moves as you sing. 9 to go, in any order. Ilya keeps a placeholder for each until you sing it.');
		for (const type of [undefined, '', 'not-sure']) {
			expect(hintText(hintsFor({ ...base, sung: S('i'), selected: 'ɑ', voiceType: type }), 'en')).toContain('from typical voices');
		}
		expect(hasDeclaredType('countertenor')).toBe(true);
		expect(hasDeclaredType('not-sure')).toBe(false);
	});
	it('invites any vowel again once all ten are sung', () => {
		expect(hintText(hintsFor({ ...base, sung: ALL }), 'en')).toBe('Tap any vowel to sing it again.');
	});
	it('counts to go in digits in both languages (Dann 2026-11-13 11:52)', () => {
		const some = { ...base, sung: S('i', 'e', 'u') };
		expect(hintText(hintsFor(some), 'en')).toContain('7 to go, in any order.');
		expect(hintText(hintsFor(some), 'fr')).toContain('Il en reste 7, dans l’ordre de votre choix.');
		expect(hintText(hintsFor({ ...base, sung: S('i', 'e', 'u', 'o', 'a', 'ɑ', 'ɛ', 'ɨ', 'ɪ') }), 'en')).toContain('1 to go');
	});
	it('every hint reads in French too, with its vowel filled and no [MISSING]', () => {
		for (const selected of ['i', 'ɨ'] as Vowel[]) {
			for (const sung of [S(), S('i'), S('e', 'u'), ALL]) {
				for (const flags of [{}, { active: true }, { confirmingClear: true }]) {
					for (const voiceType of ['bass', undefined]) {
						const fr = hintText(hintsFor({ ...base, selected, sung, voiceType, ...flags }), 'fr');
						expect(fr).not.toMatch(/MISSING|\{/);
					}
				}
			}
		}
	});
});

describe('the main button', () => {
	it('is Start for an unsung vowel, Re-take for a sung one, in progress and disabled mid-take, and Done at ten', () => {
		expect(mainButton(false, S('i'), 'e', 'en')).toEqual({ kind: 'start', label: 'Start [e]', disabled: false });
		expect(mainButton(false, S('i', 'e'), 'e', 'en')).toEqual({ kind: 'retake', label: 'Re-take [e]', disabled: false });
		expect(mainButton(true, S('i'), 'e', 'en')).toEqual({ kind: 'inProgress', label: '[e] in progress', disabled: true });
		expect(mainButton(false, ALL, 'e', 'en')).toEqual({ kind: 'done', label: 'Done', disabled: false });
	});
	it('the secondary button is Stop mid-take, Clear all once Start over is tapped, and the tree’s Start over otherwise', () => {
		expect(stopLabel(true, false, 'en')).toBe('Stop');
		expect(stopLabel(false, true, 'en')).toBe('Clear all');
		expect(stopLabel(false, false, 'en')).toBe('Start over');
		expect(stopLabel(false, false, 'fr')).toBe('Tout recommencer');
	});
});

describe('the cue', () => {
	it('shows the bracketed symbol to the eye and the spoken name to the ear', () => {
		expect(cueText({ key: 'pacifier.singFirst', vowel: 'ɨ' }, 'en')).toEqual({
			eye: 'Sing [ɨ] as you usually do. Three.',
			ear: 'Sing the velar-i vowel as you usually do. Three.'
		});
		expect(cueText({ key: 'capture.cue.ready', vowel: 'i' }, 'en').eye).toBe('Ready for [i].');
		expect(cueText({ key: 'capture.cue.ready', vowel: 'i' }, 'en').ear).toBe('Ready for the cardinal-i vowel.');
		expect(cueText({ key: 'calib.readiness.countTwo', vowel: 'i' }, 'en')).toEqual({ eye: 'Two.', ear: 'Two.' });
		expect(cueText({ key: '', vowel: null }, 'en')).toEqual({ eye: '', ear: '' });
	});
	it('reads a tree key in the language and a draft key in English', () => {
		expect(cueText({ key: 'pacifier.pause', vowel: 'i' }, 'fr').eye).toBe('Arrêtez de chanter, mais gardez la forme de votre conduit vocal pour cette voyelle.');
		expect(cueText({ key: 'capture.uncertain', vowel: 'e' }, 'fr').eye).toBe('[e] est noté, même si cette prise était moins nette. Une reprise peut le remplacer.');
	});
	it('every key the ritual can emit has words in both the draft and the tree: no [MISSING]', () => {
		const keys = [
			'pacifier.singFirst', 'calib.readiness.countTwo', 'calib.readiness.countOne', 'pacifier.pause', 'pacifier.beginPhonating', 'pacifier.nowSustain',
			'pacifier.captured', 'pacifier.rolledBack', 'capture.uncertain', 'pacifier.cancelled', 'pacifier.error.micPermission', 'pacifier.error.micNotFound',
			'pacifier.error.noAudio', 'pacifier.error.tooShort', 'pacifier.error.default'
		];
		for (const language of ['en', 'fr'] as const) {
			for (const key of keys) expect(cueText({ key, vowel: 'i' }, language).eye, `${language} ${key}`).not.toMatch(/MISSING|^$/);
		}
	});
	it('the idle cue invites the selection, says it is captured, or says all ten', () => {
		expect(idleCue('i', S())).toEqual({ key: 'capture.cue.ready', vowel: 'i' });
		expect(idleCue('i', S('i'))).toEqual({ key: 'capture.cue.isCaptured', vowel: 'i' });
		expect(idleCue('i', ALL)).toEqual({ key: 'capture.cue.allTen', vowel: null });
	});
	it('a plain capture gives way to the invitation; everything else stays until the singer acts', () => {
		expect(staysAfterTake('pacifier.captured')).toBe(false);
		for (const k of ['pacifier.rolledBack', 'capture.uncertain', 'pacifier.cancelled', 'pacifier.error.default']) expect(staysAfterTake(k)).toBe(true);
	});
});

describe('the first-time explanation', () => {
	it('is the tree’s ratified sentence about sing, stop, and fry, for the vowel in the selection', () => {
		const en = firstTimeExplanation('i', 'en');
		expect(en.startsWith('Tap the [i] cardinal-i vowel to begin. First sing it as you usually do')).toBe(true);
		expect(en).toContain('Ilya measures only the fry.');
		expect(firstTimeExplanation('i', 'fr')).toContain('[i] i cardinal');
	});
});

describe('the words', () => {
	it('say nothing of a goal, a target, or a fault', () => {
		for (const k of stringKeys().filter((k) => k.startsWith('capture.') || k.startsWith('sheet.'))) {
			expect(t(k, 'en').toLowerCase(), k).not.toMatch(/\bgoals?\b|\btargets?\b|\bheld\b|\bwrong\b|\bfault\b|\bimplausible\b/);
			for (const lang of ['en', 'fr'] as const) expect(t(k, lang), `${k} ${lang}`).not.toContain('\u2014');
		}
	});
	it('brackets a symbol', () => {
		expect(bracket('ɪ')).toBe('[ɪ]');
	});
});
