# Report: row 166, step 2, INSIGHTS and MELODY say so (Code, cloud lane, r1, 2026-11-09)

Branch `cloud-lane-39`. Brief: `docs/sessions/brief-code-row166-generic-profiles_r2_2026-11-09.md`, step 2. Steps 2 and 3 are **one commit**, not two: the lede string (step 3) is read by step 2's code and the i18n key index counts both steps' keys together. The step 3 report is separate.

## What changed

- `apps/web/src/lib/insights/identity.ts`: three small pure helpers, so the pane's decisions are tested rather than only drawn.
  - `restsOnSamples(adapted)` = `completeness.formants && !generic`. **Not** `!generic` alone: a contralto with nothing sung is also not `generic`, and `!generic` alone would have printed "calibrated {date}" for a voice with no reading at all.
  - `genericLede(generic, voiceType, language)`: the step 3 string with `{voiceType}` filled by `voiceTypePrint`, the identity line's own label function; null unless `generic`.
  - `methodLineKey({generic, typed})`: see "Decision 2" below.
- `apps/web/src/lib/insights/InsightsPane.svelte` (744 lines, at its ceiling; I did not raise it): identity line takes `restsOnSamples(adapted)`; the header's `note` array is now `[key header, lede, placeholder line]`; the method line takes `methodLineKey`; the `measured` comment says where the old rule no longer holds.
- `apps/web/src/lib/i18n.ts`: `insights.generic.lede` (step 3), and two unratified method strings (below). The key index at the head of the file is 1,189 keys, `insights.` 189, as `i18n-index.test.ts` requires.
- Tests: `identity.test.ts` (new describe), `placeholder-profile-pages.test.ts` (new, in `insights/`; `analysis/` may not import `insights/`, which the ratchet caught).

MELODY: **no change**, as the brief says. With `generic: true`, `showWithheld` (`MarkupPane.svelte:838`) reads false, so the withheld notes column goes; the marks draw from the placeholders; the existing `placeholder.line.markup.many` names the placeholder vowels the page uses; the no-score envelope (`:1108`) still reads the sampled map and is unchanged.

## Item 1: the identity line, and every other census site

Test (`identity.test.ts`): a generic baritone with a stored date (2026-09-12) prints `INSIGHTS for Dann · baritone · not calibrated` and `APERÇUS pour Dann · baryton · sans calibration`, never "calibrated". A voice with one sung vowel still prints "calibrated"; a contralto with nothing, and no type, are `restsOnSamples` false.

Every site where `completeness.formants` reads true for a generic profile, with the decision (from the step 0 census):

| Site | Decision |
| --- | --- |
| `InsightsPane.svelte:200` `measured` | Kept: it is what lets `model` and `commentNotes` compute. |
| `InsightsPane.svelte:278` identity line | **Changed**: `restsOnSamples(adapted)`. |
| `InsightsPane.svelte:289-295` method line | **Changed**: two new strings (Decision 2). |
| `MarkupPane.svelte:838` `showWithheld` | Kept: the placeholders are the point of MELODY's change. |
| `MarkupPane.svelte:811`, `:853` broad note | **Changed, and my first reading of this row was wrong.** The note's gate reads `range`, `tessitura`, `passaggio`, so a generic voice with no typed edges still gets it, which is right; but its text ends "The forecast still reflects your measured resonances." (`analysis.broad.body`), which is false for a placeholder voice. I saw it in the step 4 screenshot. `composeBroadNote` now takes the adapter's `generic` flag and uses `analysis.broad.body.generic`, the same sentence less its last clause. **Unratified, DESK DEFAULT, flagged in `i18n.ts`**; not pinned. Test in `analyze-score-adapter.test.ts`. |
| `MarkupPane.svelte:568` → `:958` `statusLine` | Unaffected: reached only under `hasReadings` (the sampled map), so a generic voice never sees it. |
| `key-suggest.ts:291` | Kept: counts sung and derived vowels only, so for a generic voice the key search has **no vowel evidence** and `pastTurn` stays null. Reported, not changed. |
| the other `fR1` readers (`overlay-engine.ts:165`, `conditions.ts:368`, `comments.ts:164`, `singer-page.ts:186,199`, `modification-engine.ts:68-88`) | Kept: they read a number, and every drawn result carries the existing placeholder mark. |

## Item 2: the lede

`genericLede` fills `{voiceType}` with `voiceTypePrint`. What the five print, **EN and FR** (asserted in `identity.test.ts`, which passes):

| Declared type | English `{voiceType}` | French `{voiceType}` |
| --- | --- | --- |
| soprano | soprano | soprano |
| mezzo-soprano | mezzo-soprano | mezzo-soprano |
| tenor | tenor | ténor |
| baritone | baritone | baryton |
| bass | bass | basse |

A finer label changes the word: a singer who chose "lyric baritone" reads "…for a lyric baritone" and « …pour le type baryton lyrique » (that is what `voiceTypePrint` returns for it; eligibility still rests on the Tier 1 id). The English phrase "for a {voiceType}" takes "a" before every one of the five; it would be wrong before a label starting with a vowel sound ("a Other text", "an octavist"). I did not touch the string (it is Dann's). Where the label is Other's own text it prints as typed.

Placement: the lede is one line in the page header's `note` stack (`TitleHeader`), after the key line and before the placeholder line, so it is above every finding, drawn in the header's own measured height.

## Item 4: the placeholder mark on every comment that names a resonance (checked, not built)

- `InsightsPane.svelte:185` `placeholders = placeholderVowels(analyzed)`: the vowels of events whose `placeholder` is true (`placeholder-line.ts:24-28`).
- `InsightsPane.svelte:376` passes `placeholders` into `singerBlocks`.
- `singer-blocks.ts:241-243` `onPlaceholder(c)` = `placeholders.has(c.comment.vowel)` and the comment names a resonance, a turn, or a `resonance`, `turn`, or `closedU` challenge; `:249` appends `placeholderCommentSentence`. `gates.ts:319-322` does the same for the MELODY watch-list lines; `singer-blocks.ts:325` marks the vowel-turn rows.
- **Tested** (`placeholder-profile-pages.test.ts`, for each of the five types on song 1): every analysed event has `placeholder: true`, `placeholderVowels` equals the set of vowels the events use, and every `fR1Source` is `'surrogate'`.
- **Not exercised, and why:** that the sentence attaches to a *comment* on song 1. With nothing typed no comment fires (Item 5), and my attempts to type edges that make one fire on song 1 produced none, so I have no live comment to assert on. The rule is read from `singer-blocks.ts:241-243`: for a generic voice every vowel of every event is on the list, so any comment that exists names a listed vowel.
- `measuredVowels` (`InsightsPane.svelte:238-244`) is built from the **sampled** `formants` prop, never from `adapted`, so a surrogate vowel is outside it by construction. It decides only whether a suggestion that reads a resonance may lead (`comment-text.ts:122-123`).

## Item 5: the treble comments for a generic soprano with no typed passaggio

- `isTreble(adapted.snapshot)` (`comments.ts:112-115`) is **`undefined`**: it reads `passaggio.secondo`, and none is typed.
- Comments computed: **0**. Hidden as treble: **0**. Kept after `!c.treble && speaks(c)`: **0**.
- This is structural, not a property of song 1: with `treble` undefined no comment can fire on any score. `firesSustained` needs `toSecondo` (`comments.ts:222`); the non-treble `firesTurning` needs `toSecondo` (`:242`); `firesClosedU` needs `treble === false` (`:251`); the treble form needs `treble === true` (`:234`).
- Consequence for the singer: a generic voice with no typed passaggio sees **no note comments at all**, for every one of the five types. The page's findings are then the verdict, the figures, the key lines, and the vowel turns. This is what "treble comments stay hidden as today" produces here, and it is worth Dann knowing: the "moments" section will be empty for a generic voice until the singer types a passaggio. Pinned by `placeholder-profile-pages.test.ts` ("a generic soprano with no typed passaggio").

## Decisions I took

1. **`restsOnSamples`, not `!generic`**, as above.
2. **The method line (not in the brief).** `insights.method.typed` and `.untyped` print "computed from your calibration of {date}". For a generic voice that is false, and `voiceUpdatedAt` is the voice's `updatedAt` (`+page.svelte:353`), so a date would have printed. I added `insights.method.generic.typed` and `.untyped`, naming placeholder values and no date. **They are my words, unratified, flagged DESK DEFAULT in `i18n.ts`, and not pinned in `ratified-lines.test.ts`.** The French is mine and wants Dann's eye. If he would rather not have them, the only alternative that does not print a false calibration is to drop the Method endnote for a generic voice.
   - EN typed: "Method: computed from placeholder values for your voice type, the voice characteristics you typed, and the score as sung, repeats taken."
   - EN untyped: "Method: computed from placeholder values for your voice type and the score as sung, repeats taken."
   - FR typed: « Méthode : calculé à partir de valeurs par défaut pour votre type de voix, des caractéristiques vocales que vous avez indiquées et de la partition telle que chantée, reprises comprises. »
   - FR untyped: « Méthode : calculé à partir de valeurs par défaut pour votre type de voix et de la partition telle que chantée, reprises comprises. »
   (The no-break space before « : » is in the file as ` `.)
3. **The broad note's closing clause**, as in the table: one more unratified string, `analysis.broad.body.generic`, EN "Broad analysis: this score is shown without {items}, because the matching voice characteristics were left blank." and FR « Analyse large : cette partition est présentée sans {items}, car les caractéristiques vocales correspondantes ont été laissées vides. » (no-break space before the colon).
4. **The ratchet.** The pane first came to 748 lines against a ceiling of 744, and a test of mine in `analysis/` imported `insights/`; both were caught by `pnpm ratchets`. The pane is back to 744, the test moved to `insights/`. No ceiling was raised.

## What Code could not establish

- **How it looks:** seen in the step 4 screenshots (`docs/sessions/row166-screens_2026-11-09/`); see the step 4 report.
- **Whether a comment on a generic voice carries the placeholder sentence in the rendered page.** No comment fires on song 1 without a typed passaggio, and I did not find typed edges that fire one. Read, not exercised (Item 4).
- **The English lede's article** ("for a {voiceType}") against a finer or Other label that begins with a vowel sound.
