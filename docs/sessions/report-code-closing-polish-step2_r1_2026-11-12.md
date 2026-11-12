# Report: closing polish lane, step 2, the placeholder-voice lines (Code, cloud-lane-48, r1, 2026-11-12)

## Strings changed (old, then new)

| key | old | new |
|---|---|---|
| `profile.subtitlePlaceholder` (`i18n.ts:1489`) | FR « Profil de formants : valeurs par défaut pour le type générique {voiceType}, pas encore vos propres résonances. » | FR « Profil de formants : valeurs par défaut pour une voix type de {voiceType}, pas encore vos propres résonances. » (EN unchanged) |
| `insights.generic.lede` (`:1891`) | EN "These findings use placeholder values for a {voiceType}, not your specific voice." FR « Ces constats reposent sur des valeurs par défaut pour le type {voiceType}, et non sur votre voix en particulier. » | EN "These findings use placeholder values for a generic {voiceType}, not your specific voice." FR « Ces constats reposent sur des valeurs par défaut pour une voix type de {voiceType}, et non sur votre voix en particulier. » |
| `insights.r2.vowels.against.generic` (new, after `:2030`) | none | EN "against where each vowel turns in a generic {voiceType}" FR « selon la hauteur où chaque voyelle change de timbre pour une voix type de {voiceType} » |

(Every French colon keeps its no-break space.) The key index at the head of `i18n.ts` moved with the new key: total 1,222 to 1,223 (`:19`), `insights.` 189 to 190 (`:46`).

## What changed in code

- `voice/voiceTypes.ts`: new `fillVoiceType(template, label, language)`. In French, « de {voiceType} » becomes « d’{voiceType} » when the label begins with a vowel letter (a, e, i, o, u, y; accented forms tested by decomposing the first letter), never before h. English fills as it was. Used by all three fills.
- `markup/subtitle.ts:12` and `insights/identity.ts:52` use it. `identity.ts` gains `placeholderLabel(generic, voiceType, language)` (the label for a placeholder voice, else undefined); `genericLede` uses it.
- `insights/singer-blocks.ts`: `BlockInputs.voiceTypeLabel?: string` (Amendment 5); `:334` uses `insights.r2.vowels.against.generic` filled by `fillVoiceType` when `i.generic` and a label is present, and keeps `insights.r2.vowels.against` otherwise.
- `insights/InsightsPane.svelte`: passes `voiceTypeLabel: placeholderLabel(adapted.generic, voiceType, language)` on the line that already passed `generic` (`:348` call), and imports it on the existing import line. The file stays 744 of 744 lines.
- The identity line (`identity.ts:28`) is unchanged: « · {voiceType} », no « de ».

## Pins moved

`insights/ratified-lines.test.ts:406-411` (lede and subtitle, plus a new pin of the new key, EN and FR); `markup/subtitle.test.ts:6-7`; `insights/identity.test.ts:88-93`.

## Tests added

- `voice/voiceTypes.test.ts`: `fillVoiceType`: « d’octaviste », « de basse », « de heldentenor », « d’écrivain », « d’Yodleur »; English unchanged.
- `markup/subtitle.test.ts`: a typed « octaviste » and « heldentenor » in French.
- `insights/singer-blocks.test.ts`: the chart caption on a placeholder page (EN; FR with « d’octaviste » and « de basse »), the old line with no label, and the old line on a non-placeholder page. No test covered `:334` before.

## Gates

Web unit suite: 282 files, 5206 passed, 1 skipped (5201 after step 1). Ratchets OK. Type check runs at step 12.

## What I could not establish

- A browser capture of the three lines (MELODY subtitle, INSIGHTS lede, the vowel chart's caption) on a placeholder voice. The strings are pinned by unit tests only.
- The elision helper tests the first letter only. A typed label beginning with a digit, an apostrophe, or a capital vowel with a diacritic outside Latin-1 is not specially handled (« Œ… » would not elide; the ruling does not name it).
