import type { Vowel } from '$lib/voice/engine/types';
import { t, type Language } from '$lib/i18n';

// Speakable per-vowel names for the button labels and the aria-live caption.
// Sourced from Mitton (2020) §4.6, which names all ten vowels, so a blind
// listener hears the same nicknames sighted users see, and the bare IPA
// glyphs never reach the speech engine. This is the fix for English TTS
// collapsing [ɪ] and [ɨ] onto the [i] ("ee") value: a named label is read
// as words, not a vowel the engine has to guess at. [i] uses Dann's
// 'cardinal-i' (Cardinal Vowel 1), completing the i-triplet with velar-i
// and smallcaps-i; [o] and [u] have no §4.6 nickname, so they keep the
// plain letter rather than an invented term. Keyword anchors (English
// 'as in bit', French mots-repères) are deferred to the bilingual anchor
// work, where they become one designed feature across both languages.
// Shared so the guided-director wizard (wizard spec v1 §3, "Accessibility")
// announces vowels by the identical name a sighted user sees and a
// screen-reader user hears in the capture surface.
// N.35, 2026-08-12: these were English string literals. They now read
// the dictionary, so both take the active language. `spokenName` keeps the
// old Record's shape as a lookup; the keys are 'vowel.name.<glyph>'.
//
// N.199 Step 1: MOVED from `pacifier/Pacifier.svelte`'s module script, so the new capture
// screen need not import the wheel it replaces. Both importers are repointed.
export const spokenName = (g: Vowel, lang: Language): string => t(`vowel.name.${g}`, lang);
export const spoken = (g: Vowel, lang: Language): string =>
	t('vowel.spoken', lang).replace('{name}', spokenName(g, lang));
