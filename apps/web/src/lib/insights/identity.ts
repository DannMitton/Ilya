/**
 * Insights' identity line, lifted from `InsightsPane.svelte` by voice type
 * slice A (2026-09-30) so its composition is tested.
 *
 * "Insights for Dann · basso cantante · calibrated 2026-09-12" (Dann's
 * placement, ruled 2026-09-30). With no voice type, or "Not sure", the line is
 * exactly what it was before the slice: the `{voiceType}` segment and its
 * separator go together, so no empty separator prints.
 */
import { t, type Language } from '$lib/i18n';
import type { VoiceTypeChoice } from '$lib/voice/profileStore';
import { borrowedStaffLabel, fillVoiceType, voiceTypePrint } from '$lib/voice/voiceTypes';
import type { AdaptedProfile } from '$lib/analysis/analyze-score-adapter';

export interface IdentityInput {
	voiceName?: string;
	/** When the readings were written, ISO 8601 (`calibratedAt`, else `updatedAt`). Prints as the calibration date (N.19). */
	voiceUpdatedAt?: string;
	/** Whether the voice has measured formants; without them the line says so. */
	measured: boolean;
	voiceType?: VoiceTypeChoice;
	language: Language;
}

export function composeIdentityLine({ voiceName, voiceUpdatedAt, measured, voiceType, language }: IdentityInput): string {
	const date = /^\d{4}-\d{2}-\d{2}/.exec(voiceUpdatedAt ?? '')?.[0] ?? null;
	const voice = voiceName?.trim() ? voiceName.trim() : t('insights.yourVoice', language);
	const label = voiceTypePrint(voiceType, language);
	const template = t(measured && date ? 'insights.identity' : 'insights.identityUncalibrated', language);
	const withType = label ? template : template.replace(' · {voiceType}', '');
	// One pass, so a name or an Other label that contains "{date}" prints as typed.
	const vars: Record<string, string> = { voice, voiceType: label ?? '', date: date ?? '' };
	return withType.replace(/\{(voice|voiceType|date)\}/g, (_, k: string) => vars[k]);
}

/**
 * QUEUE row 166: whether the findings rest on the singer's own samples. A voice
 * with only placeholders (`generic`) has numbers, so `completeness.formants` is
 * true, but it is not calibrated: the identity line says so, not "calibrated".
 */
export function restsOnSamples(adapted: Pick<AdaptedProfile, 'completeness' | 'generic'>): boolean {
	return adapted.completeness.formants && !adapted.generic;
}

/**
 * The line above the findings for a voice that has only placeholders (RATIFIED,
 * Dann 2026-11-09 16:13), or null for any other voice. `{voiceType}` is the label
 * `placeholderLabel` gives: the staff the values came from (`borrowedStaffLabel`), so a bass who typed octavist reads "bass" (lane 74, item 3).
 */
export function genericLede(generic: boolean, voiceType: VoiceTypeChoice | undefined, language: Language): string | null {
	const label = placeholderLabel(generic, voiceType, language);
	return label ? fillVoiceType(t('insights.generic.lede', language), label, language) : null;
}

/** The label for the sentences that say whose placeholder values a page uses (`borrowedStaffLabel`: the staff the values came from, on the Tier 1 id alone), or undefined for any other voice. "Not sure" and no type take no placeholder profile (ruling of 2026-11-19, section 8), so `generic` is false for them and they never reach it. */
export function placeholderLabel(generic: boolean, voiceType: VoiceTypeChoice | undefined, language: Language): string | undefined {
	return generic ? borrowedStaffLabel(voiceType?.voiceType, language) : undefined;
}

/**
 * The Method endnote's string key. With a score: a placeholder voice names no calibration and no date (RATIFIED by Dann 2026-11-10; the strings are pinned in
 * `ratified-lines.test.ts`). With no score (`noScore`, N.203 lane 59 Step 8; sheet lines 28 and 29, RATIFIED 2026-11-16): the line reads what the voice rests on,
 * not the model, which a page with no score never has: `samples` (the voice rests on the singer's own samples, `restsOnSamples`), else `generic` (the eight
 * declared types' placeholder values, nothing usable recorded; QUEUE row 167, ruling of 2026-11-19), else neither ("Not sure", no type, or an id this build does not know), which returns `null`: that page asks for both the voice and a score and carries no NOTES (lane 78; the companion's table, section 2 and its correction 1, supersedes Dann's line of 2026-11-16 01:28).
 */
export function methodLineKey(o: { generic: boolean; typed: boolean; noScore?: boolean; samples?: boolean }): string | null {
	if (o.noScore) return o.samples ? 'insights.method.noScore.samples' : o.generic ? 'insights.method.noScore.generic' : null;
	const kind = o.typed ? 'typed' : 'untyped';
	return o.generic ? `insights.method.generic.${kind}` : `insights.method.${kind}`;
}

/** Whether a Method line key is one of the three generic ones (`insights.method.generic.typed`, `.untyped`, `insights.method.noScore.generic`): the lines that say the findings rest on placeholder values (N.203 lane 61, link L4). */
export function isGenericMethodKey(key: string | null): boolean {
	return key === 'insights.method.generic.typed' || key === 'insights.method.generic.untyped' || key === 'insights.method.noScore.generic';
}
