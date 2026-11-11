# Report: row 166, step 6, the ratified strings and the legend (Code, cloud lane, r1, 2026-11-10)

Branch `cloud-lane-39`. Strings ratified by Dann 2026-11-10 12:54 to 12:59, and Fable 5.2's amendments 39-1, 39-3, 39-5. `origin/cloud-lane-38` was fetched at the start and is already merged. Every French colon below is written ` :` in `i18n.ts`.

## What changed

- **(a) `profile.subtitlePlaceholder`** (new key), EN "Formant profile: placeholder values for a generic {voiceType}, not yet your own resonances." FR « Profil de formants : valeurs par défaut pour le type générique {voiceType}, pas encore vos propres résonances. » Printed in place of the two old subtitles when `adapted.generic`. The choice is made in a new pure module, `markup/subtitle.ts` (`profileSubtitle`), which takes the label from `voiceTypePrint`, as INSIGHTS' lede does. `MarkupPane` gets a new prop `voiceTypeChoice` (the whole `VoiceTypeChoice`; `+page.svelte` passes `voiceTypeChoice`), because the existing `voiceType` prop is only the Tier 1 id and carries no label. `MarkupPane.svelte` is 1362 lines against its ceiling of 1364, `+page.svelte` unchanged in length.
- **(b)** `insights.generic.lede` keeps its first sentence only, both languages; pin updated.
- **(c)** `insights.method.generic.typed` and `.untyped`: EN "including repeats" (French unchanged); `insights.method.typed` and `.untyped`: EN "repeats taken" becomes "including repeats" (French unchanged).
- **(d)** `analysis.broad.body.generic` gains its last sentence, EN "The forecast uses placeholder values for your voice type." FR « La prévision repose sur des valeurs par défaut pour votre type de voix. »
- **(e)** The three DESK DEFAULT, UNRATIFIED comments in `i18n.ts` now say RATIFIED by Dann 2026-11-10; all six strings are pinned in `insights/ratified-lines.test.ts` ("row 166: the six ratified placeholder strings", with the two calibrated method lines' EN and the unchanged FR check, and ` ` before each French colon). The i18n key index is 1,191 keys, `profile.` 35.
- **(f) Amendment 39-5:** `buildMarkupLegend` takes `filledHeads?: boolean`, default true; where false it leaves out the filled "from your voice" entry. `MarkupPane` passes `filledHeads: !adapted.generic`. Tests in `legend.test.ts` (false: only the hollow entry; true and default: both) and `markup/subtitle.test.ts` (new).

I also updated the two existing tests that asserted the old lede and old broad note (`identity.test.ts`, `analyze-score-adapter.test.ts`).

## Screenshots (generic baritone, first visit, no stored data)

In `docs/sessions/row166-screens_2026-11-09/`, replacing the step 4 ones of the same name: `baritone-insights-en.png`, `baritone-melody-en.png`, `baritone-insights-fr.png`, `baritone-melody-fr.png` (plus the `-raw` MELODY pair, taken before the clef chooser is dismissed). What they show, read from the page text and the images:
- MELODY EN: "FORMANT PROFILE: PLACEHOLDER VALUES FOR A GENERIC BARITONE, NOT YET YOUR OWN RESONANCES."; the legend lists the stems and only "= the same, from a placeholder value" (no filled head); the footer broad note ends "The forecast uses placeholder values for your voice type."
- MELODY FR: « PROFIL DE FORMANTS : VALEURS PAR DÉFAUT POUR LE TYPE GÉNÉRIQUE BARYTON, PAS ENCORE VOS PROPRES RÉSONANCES. », the legend likewise, the broad note ending with the ratified French sentence.
- INSIGHTS EN: the lede is now one sentence ("These findings use placeholder values for a baritone, not your specific voice."), then the placeholder line. INSIGHTS FR: « APERÇUS POUR VOICE 1 · BARYTON · SANS CALIBRATION ».
- Taken before I moved one line in `MarkupPane` (below); the page's behaviour is the same, and the gates after the move are green.

## Gates, against the start of step 6 (the end of step 5)

| Gate | Result |
| --- | --- |
| 1 phonology | 456 passed, as before |
| 2 dictionary | 248 passed, as before |
| 3 web check | 0 errors, 12 warnings, as before (see "One fix" below) |
| 4 web tests | 258 files, 4741 passed, 1 skipped (was 257 and 4735: the new tests) |
| 5 score-parser | 785 passed, 5 skipped, as before |
| 6 blurb | 168 passed |
| 7 integration | 125 passed |
| 8 ratchets | OK, no ceiling touched |

Playwright was not run (not asked).

**One fix.** My first version put the `subtitle` derived where the old one stood, before `adapted` is declared; `svelte-check` failed (2 errors, "used before its declaration"). I moved the one line to just after `adapted`, with a one-line note; it is the only change after the first gate run.

## What Code could not establish

- **The French subtitle is cut off on screen.** At 1440 wide the French MELODY subtitle ends "PAS ENCORE VOS PROPRE…" with an ellipsis; the ratified sentence is longer than the header line allows once the legend shares it. The English fits. I did not change the string (it is ratified) or the header layout (out of this brief). It wants a ruling: a shorter French, or a header that wraps this line. Phone width was not looked at.
- **Print rendering** of the new subtitle and legend is not seen.
- **The English "a generic {voiceType}"** takes "a" before any label; for a finer label starting with a vowel sound it would read wrongly ("a generic octavist" is fine, "a generic Other text" depends on the text). Not changed.
