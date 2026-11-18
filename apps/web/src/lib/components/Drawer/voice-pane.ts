/**
 * THE VOICE PANE AT REST, as data (N.203 lane 60, Step 2; plan r4 sections 4.1 and 4.2). The pane's sentence, the name of its door to
 * recording, and whether "Your vowel space" shows. Pure, so the seven sentence states are tested without a browser. The eighth state of the
 * pane, with no voice saved, is the first-launch form (`ProfileSwitcher.svelte`), not a sentence.
 *
 * BELOW FIVE CORE VOWELS (lane 67) the sentence says how many core vowels are recorded and how many more unlock the singer's own profile; the count of the other states is
 * every sung vowel. "Recorded" means sung: the count the closed pane's line prints (`usableReadingCount`, `profileStore.ts`; `isSung`, `voice/engine/sung.ts`), so a
 * reading beyond Ilya's reference values counts as a kept one does (lane 66, Step 5), and a stored estimate or a take with no first resonance does not,
 * where the summary's table, which draws every stored reading, draws them.
 */
import { t, type Language } from '$lib/i18n';
import { PERSONAL_CORE_MIN } from '$lib/voice/engine/sung';
import { hasPlaceholderProfile } from '$lib/voice/engine/stand-ins';
import { fillVoiceType, isTier1, voiceTypePrint } from '$lib/voice/voiceTypes';

export interface PaneSentenceInput {
	/** `usableReadingCount(voiceFormants)`, 0 to 10. */
	usable: number;
	/** `coreCount(voiceFormants)`, 0 to 6 (`voice/engine/sung.ts`): how many of the six core vowels are sung. Under five, what is recorded unlocks nothing personal (lane 67). */
	core: number;
	/** The stored Tier 1 id, if any. An id this build does not know counts as none. */
	voiceType?: string;
	/**
	 * True when every vowel left can be worked out from the ones recorded (lane 59's `finishEarlyState(...).kind === 'work-out'`,
	 * `voice/chart/finish-early.ts`). Until that lane is merged the page passes `false`.
	 */
	restWorkedOut: boolean;
}

export type PaneState = 'none' | 'typed-generic' | 'typed-none' | 'not-sure' | 'core-generic' | 'core' | 'some-fills' | 'some-works-out' | 'all';

export function paneState(i: PaneSentenceInput): PaneState {
	if (i.usable >= 10) return 'all';
	// Anything sung and fewer than five core vowels (a voice with only a hard vowel sung has `usable >= 1` and `core` 0): what is recorded is kept and shown, and says
	// how many more core vowels are needed. With a type that has generic values it says Ilya uses them until then (lane 67; Dann 2026-11-17 23:31).
	if (i.usable >= 1 && i.core < PERSONAL_CORE_MIN) return isTier1(i.voiceType) && hasPlaceholderProfile(i.voiceType) ? 'core-generic' : 'core';
	if (i.usable >= 1) return i.restWorkedOut ? 'some-works-out' : 'some-fills';
	if (!isTier1(i.voiceType)) return 'none';
	if (i.voiceType === 'not-sure') return 'not-sure';
	return hasPlaceholderProfile(i.voiceType) ? 'typed-generic' : 'typed-none';
}

const KEY: Record<Exclude<PaneState, 'core-generic' | 'core' | 'some-fills' | 'some-works-out'>, string> = {
	none: 'calib.pane.none',
	'typed-generic': 'calib.pane.typedGeneric',
	'typed-none': 'calib.pane.typedNone',
	'not-sure': 'calib.pane.notSure',
	all: 'calib.pane.all'
};

/** The sentence. Numerals in the count; the counted forms for one vowel left are the ratified "last one" forms. */
export function paneSentence(i: PaneSentenceInput, language: Language): string {
	const state = paneState(i);
	if (state === 'core-generic' || state === 'core') {
		const m = PERSONAL_CORE_MIN - i.core;
		const base = state === 'core-generic' ? 'calib.pane.coreGeneric' : 'calib.pane.core';
		const text = t(m === 1 ? `${base}One` : base, language).replace('{n}', String(i.core)).replace('{m}', String(m));
		return state === 'core-generic' ? fillVoiceType(text, voiceTypePrint({ voiceType: i.voiceType }, language) ?? '', language) : text;
	}
	if (state === 'some-fills' || state === 'some-works-out') {
		const m = 10 - i.usable;
		const base = state === 'some-fills' ? 'calib.pane.fills' : 'calib.pane.worksOut';
		return t(m === 1 ? `${base}One` : base, language).replace('{n}', String(i.usable)).replace('{m}', String(m));
	}
	const text = t(KEY[state], language);
	if (state === 'typed-generic' || state === 'typed-none') {
		// The type's own name, not a finer label: "a {type} voice" must read with "a" for every type Ilya has generic values for.
		return fillVoiceType(text, voiceTypePrint({ voiceType: i.voiceType }, language) ?? '', language);
	}
	return text;
}

/** The door to recording, named for the state: 0 usable, 1 to 9, 10. */
export function recordDoorKey(usable: number): string {
	return usable >= 10 ? 'calib.pane.door.again' : usable >= 1 ? 'calib.pane.door.carryOn' : 'calib.pane.door.record';
}

/**
 * "Your vowel space" shows when the voice has a stored reading, or a declared type with generic values. It does not show for a contralto,
 * countertenor, bass-baritone, "Not sure", or no type with nothing stored: the chart would draw ten placeholders for them on the screen
 * after a sentence that says Ilya has none (review amendment 9, DESK DEFAULT; it narrows plan r4 section 4.1 item 3).
 */
export function showVowelSpaceDoor(hasStoredReading: boolean, voiceType?: string): boolean {
	return hasStoredReading || hasPlaceholderProfile(voiceType);
}

/** The voice type as the pane's control prints it: the built label, and for "Not sure" (which `voiceTypePrint` leaves empty) its own name. */
export function typeControlLabel(choice: { voiceType?: string; voiceTypeSpecific?: string; voiceTypeOther?: string } | undefined, language: Language): string | undefined {
	const printed = voiceTypePrint(choice, language);
	const label = printed ?? (choice?.voiceType === 'not-sure' ? t('voiceType.type.not-sure', language) : undefined);
	return label ? label.charAt(0).toLocaleUpperCase(language) + label.slice(1) : undefined;
}
