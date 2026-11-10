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
import { voiceTypePrint } from '$lib/voice/voiceTypes';
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
 * the identity line prints, lower-cased as it prints it.
 */
export function genericLede(generic: boolean, voiceType: VoiceTypeChoice | undefined, language: Language): string | null {
	const label = generic ? voiceTypePrint(voiceType, language) : undefined;
	return label ? t('insights.generic.lede', language).replace('{voiceType}', label) : null;
}

/** The Method endnote's string key: a placeholder voice names no calibration and no date (RATIFIED by Dann 2026-11-10; the strings are pinned in `ratified-lines.test.ts`). */
export function methodLineKey(o: { generic: boolean; typed: boolean }): string {
	const kind = o.typed ? 'typed' : 'untyped';
	return o.generic ? `insights.method.generic.${kind}` : `insights.method.${kind}`;
}
