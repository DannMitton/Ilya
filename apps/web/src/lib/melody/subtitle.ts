/**
 * MELODY's page subtitle (QUEUE row 166, RATIFIED by Dann 2026-11-10 12:54 to 12:59). A voice that has only
 * placeholder values (`AdaptedProfile.generic`) is not given "a map of <voice>'s resonances": it says whose
 * values these are. `{voiceType}` is the staff the values came from (`borrowedStaffLabel`, on the Tier 1 id alone; QUEUE row 167, ruling of 2026-11-19 section 6, RATIFIED 10:08), so a bass who typed octavist reads "bass" (lane 74, item 3).
 */
import { t, type Language } from '$lib/i18n';
import type { VoiceTypeChoice } from '$lib/voice/profileStore';
import { borrowedStaffLabel, fillVoiceType } from '$lib/voice/voiceTypes';

export function profileSubtitle(o: { generic: boolean; voiceName?: string; voiceType?: VoiceTypeChoice; language: Language }): string {
	const label = o.generic ? borrowedStaffLabel(o.voiceType?.voiceType, o.language) : undefined;
	if (label) return fillVoiceType(t('profile.subtitlePlaceholder', o.language), label, o.language);
	return o.voiceName ? t('profile.subtitleNamed', o.language).replace('{voice}', o.voiceName) : t('profile.subtitleYours', o.language);
}
