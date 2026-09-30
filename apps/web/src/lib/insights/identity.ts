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
