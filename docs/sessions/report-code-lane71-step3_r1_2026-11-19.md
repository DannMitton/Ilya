# Report, lane 71, step 3: the sentences that say whose values these are (brief 4.1 to 4.6, 4.8)

2026-11-19. Branch `cloud-lane-71`, on `182d7bfc` (step 2) plus this step. Paths are under `apps/web/src/lib/`.

## 1. What each site became

| Brief | Site | Change |
| --- | --- | --- |
| 4.1 | `markup/subtitle.ts:11` | the fill is `placeholderFillLabel` (new, `voice/voiceTypes.ts`). A contralto reads "Resonance profile: placeholder values for a generic mezzo-soprano, not yet your own resonances." |
| 4.2 | `insights/identity.ts:56-58` `placeholderLabel`, so `genericLede` (`:50-53`) | the fill is `placeholderFillLabel` |
| 4.3 | `insights/singer-blocks.ts:337` | no edit: it receives `voiceTypeLabel` from `InsightsPane.svelte:373`, which calls `placeholderLabel`, now `placeholderFillLabel` |
| 4.4 | `i18n.ts:1897`, `:1898`, `:1905` | the three Method strings, EN and FR, as brief 4.4 prints them (words read back below). `insights.method.noScore.none` (`:1906`) untouched |
| 4.5 | `i18n.ts:1075` | the closing sentence only: EN "The forecast uses placeholder values.", FR « La prévision repose sur des valeurs par défaut. » |
| 4.6 | `components/Drawer/voice-pane.ts` | `typed-none` removed: the state in `PaneState` (`:33`), the return (`:43`, now `return 'typed-generic'` after the `not-sure` test), the `KEY` entry (`:49`), and the branch (`:64`, now `state === 'typed-generic'` alone). The fill is `borrowedStaffLabel(i.voiceType, language)` on the Tier 1 id |
| 4.6 | `i18n.ts:1433` `calib.pane.typedNone` | kept, with its ratified French, and marked unused in place by a comment above it ("UNUSED SINCE LANE 71 ...") in this file's convention (`:1437`) |
| 4.6 | `i18n.ts:1434` `calib.pane.notSure` | replaced whole with the text Dann ratified 2026-11-19 11:59, EN and FR (ruling section 8), with a comment citing it |
| 4.6 | `voice-pane.ts:81-83` `showVowelSpaceDoor` | no code change: it reads `hasPlaceholderProfile`, which has eight members since Step 1, so the door opens for contralto, countertenor, and bass-baritone with nothing stored and stays shut for "Not sure" and no type. The comment at `:77-79` was repaired in Step 1 |
| 4.8 | `markup/MarkupPane.svelte:865-866`, `analysis/gates.ts:302`, `:323` | read, no change, as the brief says (`:866` `filledHeads: !adapted.generic`; `gates.ts:323` calls `placeholderCommentSentence(..., generic)`, whose string `placeholder.comment.generic`, `i18n.ts:2075`, names no voice type) |

**`placeholderFillLabel(choice, language)` and the decision of Step 2's report, section 3.** For the three borrowing types it returns `borrowedStaffLabel` (the principle of ruling section 6). For the five published types it returns `voiceTypePrint` on the whole choice, so Tier 2 labels and Other's text still print at 4.1 to 4.3, which brief 9.6 says the lane keeps. For "Not sure", no type, and an id this build does not know it returns `undefined`, whatever Other's text holds. At 4.6 `borrowedStaffLabel` (Tier 1 id) is used, as the brief says. If Dann wants the five published types on the Tier 1 label at 4.1 to 4.3 as well, it is a one-line change in `placeholderFillLabel`. I did not stop on this: the brief's two statements conflict, and I took the narrower reading.

## 2. The strings, read back from the file

- `insights.method.generic.typed`: EN "Method: computed from placeholder values, the voice characteristics you typed, and the score as sung, including repeats."; FR "Méthode : calculé à partir de valeurs par défaut, des caractéristiques vocales que vous avez indiquées et de la partition telle que chantée, reprises comprises."
- `insights.method.generic.untyped`: EN "Method: computed from placeholder values and the score as sung, including repeats."; FR "Méthode : calculé à partir de valeurs par défaut et de la partition telle que chantée, reprises comprises."
- `insights.method.noScore.generic`: EN "Method: from placeholder values, until you record your own vowels."; FR "Méthode : à partir de valeurs par défaut, jusqu’à ce que vous captiez vos propres voyelles."
- `calib.pane.notSure`: EN "Not knowing is a fine answer. Record your vowels in vocal fry and Ilya works from your own voice, which also gives you evidence in your own search. Or choose a voice type, and Ilya starts from published values for it."; FR "Ne pas savoir est une réponse valable. Captez vos voyelles en friture vocale et Ilya travaille à partir de votre propre voix, ce qui vous donne aussi des indices dans votre propre recherche. Ou choisissez un type de voix, et Ilya part de valeurs publiées pour celui-ci."

The three Method French strings use ` ` before the colon and `’` for the apostrophe, in the escape form the file already uses (`i18n.ts:1897`). The `notSure` strings carry no colon and no apostrophe. Step 7's test 14 checks the characters.

## 3. Other readers of `voiceTypePrint`, found by `grep -rn "voiceTypePrint(" apps/web/src` (non-test)

Two remain: `components/Drawer/voice-pane.ts:88` (`typeControlLabel`, the control's own label, which prints the declared type and is not a statement about values) and `insights/identity.ts:28` (`composeIdentityLine`: "INSIGHTS for Dann · contralto · ..."). The identity line names the singer's declared type, not whose values the page works from, so it did not change. Whether the identity line for a contralto on placeholders reads cleanly beside "a generic mezzo-soprano" in the lede is judged in Step 7's whole-page test (brief test 13).

## 4. What it breaks, and gates

Whole suite, `pnpm exec vitest run --reporter=json` from `apps/web`: `6670 passed | 17 failed | 5 skipped (6692)`. Step 1 left 12; the 5 new are the Step 3 strings and the removed state:

- `analysis/analyze-score-adapter.test.ts`: 1 (the broad note for a placeholder voice, the old closing sentence)
- `insights/ratified-lines.test.ts`: 3 (the no-score page's three method lines; the method lines' two placeholder forms; the broad note)
- `components/Drawer/voice-pane.test.ts`: 4 (was 3: "a type with none", "Not sure" now fails on the new text, the French elision test, the door); the file also holds the type error below
- the 12 of Step 1 (`adapter-golden` 1, `stand-ins-snapshot` 5, `identity.test` 1, `resolve-values.test` 2, `voice-pane.test` 3 of the four above)

All in brief section 7's list. Nothing outside it failed.

**Gate 3 is red at this commit, on purpose:** `svelte-check found 1 error and 12 warnings in 6 files`. The one error is `components/Drawer/voice-pane.test.ts:15:43`, `Type '"typed-none"' is not assignable to type 'PaneState'`, because the test still names the removed state; Step 7 repairs the test. The twelve warnings are the baseline's. Gate 8: `ratchets: OK.`, with the nine unchanged "could be lowered" notices; no ratchet moved. Gates 1, 2, 5, 6, and 7 were not re-run.

## NOT ESTABLISHED

1. How the lede, the Method line, and the chart caption read together for each of the three types in French. Nothing renders them in this step; Step 7's whole-page test does.
2. That no other string in `i18n.ts` still says "your voice type" or "pour votre type de voix" about placeholder values. Step 7's test 5 names six keys; the others were not searched here.
3. Whether `calib.pane.typedNone` is flagged as unused by `knip` or another tool (brief 9.5). None was run.
4. That `voice-pane.ts`'s header comment ("the seven sentence states", "The eighth state") is still right with `typed-none` gone. I did not recount it, and I left it as written.
5. That the typed-generic sentence reads naturally for a contralto ("... for a mezzo-soprano voice ...") and a countertenor ("... for a mezzo and tenor voice ..."). That is the ratified sentence with the ratified fill. Whether Dann wants "a mezzo and tenor voice" is his, and brief 9.4 already records the neighbouring problem.
