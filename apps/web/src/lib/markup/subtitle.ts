/**
 * MELODY's page subtitle (QUEUE row 166, RATIFIED by Dann 2026-11-10 12:54 to 12:59). A voice that has only
 * placeholder values (`AdaptedProfile.generic`) is not given "a map of <voice>'s resonances": it says whose
 * values these are. `{voiceType}` is the label the identity line prints (`voiceTypePrint`).
 */
import { t, type Language } from '$lib/i18n';
import type { VoiceTypeChoice } from '$lib/voice/profileStore';
import { voiceTypePrint } from '$lib/voice/voiceTypes';

export function profileSubtitle(o: { generic: boolean; voiceName?: string; voiceType?: VoiceTypeChoice; language: Language }): string {
	const label = o.generic ? voiceTypePrint(o.voiceType, o.language) : undefined;
	if (label) return t('profile.subtitlePlaceholder', o.language).replace('{voiceType}', label);
	return o.voiceName ? t('profile.subtitleNamed', o.language).replace('{voice}', o.voiceName) : t('profile.subtitleYours', o.language);
}
