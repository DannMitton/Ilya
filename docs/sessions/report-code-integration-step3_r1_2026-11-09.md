# Report: integration step 3, row 157 («бог» and the kept voicing), 2026-11-09

Branch `cloud-lane-38`. Source: `cloud-lane-29`, commits `c16b9b81` to `0ceeb22a` (six commits), brought on as `docs/sessions/review-fable-row157-as-built_r1_2026-11-05.md`, "The cherry-pick onto Shane", says, without rows 172 and 71. Nothing pushed to `Shane` or `main`, no pull request, `docs/memory/` untouched. **Playwright not run** (the desk's order of 12:4x).

## What was done

`git cherry-pick c16b9b81^..0ceeb22a` landed six commits (`83f2d846`, `c8e93fe4`, `b6b0d6c5`, `d8d6c92c`, `15aeb7c3`, `936eeec0` here). Then one commit of Fable's amendments.

## Conflicts

Two, both in `scripts/ratchets.json`, both context-only, as the review predicted. Row 157 lowered `engine.ts`; the lane's rows 172 and 71 (which this pick leaves out) had also lowered `CalibrationWizard.svelte` and `Drawer.svelte` on the neighbouring lines, which this branch has not.

| Commit | Resolution |
|---|---|
| step 1 (`9a2548c5`) | `engine.ts` 2051 to **2049** (the row's value); `CalibrationWizard.svelte` stays 2124 and `Drawer.svelte` stays 1990 (this branch's neighbours) |
| step 2 (`d1f54ab1`) | `engine.ts` to **2048** (the row's value); the two neighbours as above |

`pipeline.ts` 901 merged by itself. No ceiling was raised. The `+page.svelte` 5549 and `Loupe.svelte` 3012 values from step 2 are intact (`json` re-read after each resolution).

## Fable's amendments, each applied

1. **Finding 1 (French implication).** In `data/blurb-composer.json` the six `retained-voicing:<letter>` implications read `ici ; une`; they now read `ici; une` (6 replacements, `git diff --stat` 6 insertions and 6 deletions, JSON parses). The process templates keep their one ` ` before the colon (6 escapes remain in the file). In `packages/blurb/tests/retained-voicing.test.ts`: `IMPLICATION_FR` drops `${NBSP}` before the semicolon, the line that pinned `ici${NBSP}; une` now pins `ici; une`, the header says "before the colon and none before the semicolon", the test's name changed with it, and the comment says what it checks, why, and what follows if it fails. The ratified file `docs/sessions/ratified-retained-voicing-blurb_2026-10-26.md` was not touched, as the review says; the desk records the correction in `OPEN.md`, which I may not edit.
2. **Finding 2 (the report).** `docs/sessions/report-code-row157_r1_2026-11-02.md`: the characters written between the backticks are now the six characters ` ` (the file's casing), and "the existing 68 lines with a literal U+00A0" now reads 46 literals on 41 lines. I recounted on this tree: 46 literal U+00A0 on 41 lines, and 6 escapes. I also added to that sentence that the implication now carries none, so the sentence does not contradict amendment 1.
3. **Findings 3 to 6** are "no change; a lead" or "note": nothing applied. They are carried below.

## Gates (baseline on Shane, then this branch)

| Gate | Baseline | Now | Move |
|---|---|---|---|
| 1 phonology | 407 passed (407) | 435 passed (435) | +28, row 157's phonology tests (the review's pick count was 435 too) |
| 2 dictionary | 248 passed (248) | 248 passed (248) | none |
| 3 web check | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files | none |
| 4 web unit | 4198 passed, 1 skipped (4199) | 4447 passed, 1 skipped (4448) | +249: +34 (step 1), +183 (step 2), +32 (row 157; the review says the row adds 32) |
| 5 score-parser | 785 passed, 5 skipped (790) | same | none |
| 6 blurb | 148 passed (148) | 164 passed (164) | +16, the row's blurb tests (the review's pick count was 164) |
| 7 integration | 125 passed (125) | 125 passed (125) | none |
| 8 ratchets | OK. | OK. (683 source files) | none; five lowerable ceilings are Shane's own (the sixth, `Loupe.svelte`, step 2 lowered) |

The amendment changed no count; it changed one string and its pin.

## What a singer would now see

1. **«Бог» is sung [box]**, and **[boɣ] before a voiced obstruent** («Бог даст», «Бог в доме», «Бог же», «Бог бы», «Бог был», «Бог знает»), as ruled. «небог» stays `ɲɛ bok` (the review's probe).
2. **A voiceless final before «в» takes the voicing through the «в»** (Grayson p. 251): «лес вдали» and «лес в доме» now give `ˈlʲɛz`, «кот вдруг» gives `ˈkod`; «лес в траве», «лес вот», «лес в лесу» stay `ˈlʲɛs`.
3. **The Inspector explains it.** A final consonant that keeps its voicing (the review lists «меж», «без», «б» in «если б мог», «сквозь», «вокруг», «близ», «средь», «из-под», «вслед», «об») now opens a blurb in English and French saying it keeps its voicing, with the pages 251 to 252 citation, in place of the final-devoicing sentence. «сквозь» loses its soft-sign sentence for this one.
4. **The Inspector's ribbon follows the surface** for «бог» lines (⟨г⟩ → [ɣ] or [x]).
5. **A song already seated** takes the new readings through `refreshPairings` (the report's claim, `pairings.ts:444-480`; I did not re-run it).

## Leads the review left open (carried, no change)

- **Finding 3.** `retained-voicing:в` is a template the engine cannot reach (`v` is in `crossWordVSet`). The desk decides whether it stays (row 175 retired unreached templates).
- **Finding 4.** «Бог-то» (hyphenated particle) still sings `bok to`, the ruling says "never [bok]". Dann's call.
- **Finding 5.** `engine.ts:1947` folds two statements onto one line to fit the ceiling.
- **Finding 6.** The bare «в» after a look-through shows the final-devoicing blurb.
- **The lead on `french-parity.test.ts`:** it does not run the `i18n.test.ts` faults check over the blurb templates. Not for this row; I did not add it.

## What I could not establish

- **Anything in a browser.** No Playwright run here; the Drawer walk the lane's report describes was not re-run.
- **Whether the old data would fail the new pin.** I changed data and pin together and did not run the pin against the unamended data to watch it fail.
- **Gate 3 baseline per file.** The five files with warnings are the same five as the baseline's; I did not diff their text.
- **Grayson beyond p. 144** for «бог», and the х → ɣ, ц → dz, ч → dʒʲ boundary allophones: NOT ESTABLISHED, as the lane and the review say.
- **Whether an installed app fetches the larger `blurb-composer.json` on its next online start** (the review's open item; not run).
