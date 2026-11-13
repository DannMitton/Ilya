/**
 * The capture screen's decisions, as pure functions (N.199 Step 4b): what each vowel's button says, which hint to show, what the main
 * button reads, what the cue says. The component (`VowelCapture.svelte`) calls them; they are tested here without mounting anything.
 * Words are `i18n.ts`'s, English and French, through `t()` and `tv()` (N.199 Step 7).
 */
import { t, tv, type Language } from '$lib/i18n';
import type { Vowel } from '../engine/types';
import { VOWELS } from '../engine/types';
import { spoken, spokenName } from '../vowel-names';
import type { RitualCue } from '../capture-ritual.svelte';

/** The bracketed symbol the eye reads in a sentence. */
export const bracket = (v: Vowel): string => `[${v}]`;

/** A vowel's button: sung (a stored reading), or placed (a placeholder stands for it), each with `selected` on top. */
export type ButtonState = 'sung' | 'placed';

export function buttonStates(sung: ReadonlySet<Vowel>): Record<Vowel, ButtonState> {
	return Object.fromEntries(VOWELS.map((v) => [v, sung.has(v) ? 'sung' : 'placed'])) as Record<Vowel, ButtonState>;
}

/** The button's accessible name: the vowel's spoken name, then its state, then "selected" when it is. */
export function buttonLabel(v: Vowel, state: ButtonState, selected: boolean, language: Language): string {
	const parts = [spokenName(v, language), tv(state === 'sung' ? 'capture.button.sung' : 'capture.button.placed', language)];
	if (selected) parts.push(tv('capture.button.selected', language));
	return parts.join(', ');
}

/** Whether a declared voice type is a real one (the placeholder says "your voice type"); "Not sure" and none are not. */
export const hasDeclaredType = (voiceType?: string): boolean => !!voiceType && voiceType !== 'not-sure';

export interface HintInput {
	/** The ritual is mid-take (any phase but idle and landing). */
	active: boolean;
	/** The singer has tapped Start over once. */
	confirmingClear: boolean;
	/** The vowel in the selection. */
	selected: Vowel;
	sung: ReadonlySet<Vowel>;
	voiceType?: string;
}

export interface Hint {
	key: string;
	vars: Record<string, string | number>;
}

/**
 * The hint line: one sentence about the moment, and, when idle with some vowels sung and some not, a second about what is left.
 * One at a time while a take runs or a clear is being confirmed.
 */
export function hintsFor(h: HintInput): Hint[] {
	const v = { v: bracket(h.selected) };
	if (h.confirmingClear) return [{ key: 'capture.hint.confirmClear', vars: {} }];
	if (h.active) return [{ key: 'capture.hint.active', vars: v }];
	const all = h.sung.size === VOWELS.length;
	if (all) return [{ key: 'capture.hint.finished', vars: {} }];
	if (h.sung.size === 0) return [{ key: 'capture.hint.first', vars: {} }];
	const out: Hint[] = [];
	out.push(
		h.sung.has(h.selected)
			? { key: 'capture.hint.retake', vars: v }
			: { key: hasDeclaredType(h.voiceType) ? 'capture.hint.placed.typed' : 'capture.hint.placed.untyped', vars: v }
	);
	out.push({ key: 'capture.hint.toGo', vars: { count: VOWELS.length - h.sung.size } });
	return out;
}

export const hintText = (hints: Hint[], language: Language): string => hints.map((x) => tv(x.key, language, x.vars)).join(' ');

export type MainButton = { kind: 'start' | 'retake' | 'inProgress' | 'done'; label: string; disabled: boolean };

/** The main button: Start, Re-take, "in progress" (disabled), or Done when all ten are sung and nothing is running. */
export function mainButton(active: boolean, sung: ReadonlySet<Vowel>, selected: Vowel, language: Language): MainButton {
	const v = { v: bracket(selected) };
	if (active) return { kind: 'inProgress', label: tv('capture.inProgress', language, v), disabled: true };
	if (sung.size === VOWELS.length) return { kind: 'done', label: tv('capture.done', language), disabled: false };
	return sung.has(selected)
		? { kind: 'retake', label: tv('capture.retake', language, v), disabled: false }
		: { kind: 'start', label: tv('capture.start', language, v), disabled: false };
}

/** What the secondary button reads: Stop while a take runs, "Clear all" once Start over is tapped, "Start over" otherwise. */
export function stopLabel(active: boolean, confirmingClear: boolean, language: Language): string {
	if (active) return tv('capture.stop', language);
	return confirmingClear ? tv('capture.clearAll', language) : t('calib.summary.startOverButton', language);
}

/** The cue as the eye reads it (bracketed symbol) and as the ear hears it (the spoken name), from the ritual's key and vowel. */
export function cueText(cue: RitualCue, language: Language): { eye: string; ear: string } {
	if (!cue.key) return { eye: '', ear: '' };
	const raw = t(cue.key, language);
	const eye = cue.vowel ? raw.split('{v}').join(bracket(cue.vowel)) : raw;
	const ear = cue.vowel ? raw.split('{v}').join(spoken(cue.vowel, language)) : raw;
	return { eye, ear };
}

/** The cue when no take is running and nothing needs saying about the last one: Ilya's invitation for the selection. */
export function idleCue(selected: Vowel, sung: ReadonlySet<Vowel>): RitualCue {
	if (sung.size === VOWELS.length) return { key: 'capture.cue.allTen', vowel: null };
	return { key: sung.has(selected) ? 'capture.cue.isCaptured' : 'capture.cue.ready', vowel: selected };
}

/** Cues that stay on the screen after a take ends because the singer needs to read them: everything but a plain capture. */
export const staysAfterTake = (key: string): boolean => key !== 'pacifier.captured';

/**
 * The first-time explanation of sing, stop, and fry (the tree's ratified sentence, `calib.capture.cuePrefix` + the vowel + `cueSuffix`),
 * which shows under the cue line until the first take begins.
 */
export function firstTimeExplanation(v: Vowel, language: Language): string {
	return `${t('calib.capture.cuePrefix', language)} ${bracket(v)} ${spokenName(v, language)} ${t('calib.capture.cueSuffix', language)}`;
}

/** Board D's optical nudges for each vowel's symbol in the circle, in em, in `VOWELS` order (Dann 2026-11-12: "visually centre the vowel"). */
export const GLYPH_NUDGE: Record<Vowel, [number, number]> = {
	i: [0, -0.022],
	e: [-0.002, -0.133],
	ɪ: [0, -0.134],
	ɨ: [0, -0.022],
	ɛ: [-0.008, -0.133],
	a: [0.016, -0.133],
	ɑ: [0.014, -0.133],
	ʌ: [0, -0.134],
	o: [0, -0.133],
	u: [0.003, -0.138]
};
