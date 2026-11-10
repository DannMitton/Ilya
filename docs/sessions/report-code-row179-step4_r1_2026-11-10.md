# Report, row 179, step 4: the walk, the merge, both Playwright projects (cloud-lane-44, 2026-11-10)

Brief: `brief-code-gloss-language-and-reuse_r3_2026-11-03.md`, step 4. Base: `f07cdf9`. This commit also corrects a test count in the step 3 report (14, not 15).

## The merge

`git fetch origin cloud-lane-38` then `git merge origin/cloud-lane-38` printed "Already up to date": the lane has no commit that `cloud-lane-44` lacks. So the eight gates from step 3 stand as the final run; I did not repeat them. Last gate run: all eight exit 0.

## The walk, item by item

| item | where it is tested |
|---|---|
| 1 offer under the field, through blur | `e2e/gloss-reuse.test.ts` (desk, browser); `gloss-offer.test.ts` |
| 2 tap, confirmation, refusal keeps the offer | e2e; `gloss-offer.test.ts`, `glossary.test.ts` |
| 3 the entry follows the field after the tap | coded in `GlossOffer.svelte`; **no browser test** |
| 4 unanswered offer returns; Not now scoped to word and song | e2e; `gloss-offer.test.ts` |
| 5 fill in another song, Stop using, blanking, offer back | e2e; `glossary.test.ts`, `gloss-offer.test.ts` |
| 6 languages apart | e2e; `gloss-edit.test.ts` |
| 7 a corrected dictionary gloss gives no offer | `gloss-offer.test.ts` (unit only) |
| 8 Reset, both languages, and over a fill | `gloss-edit.test.ts`, `glossary.test.ts` |

Also tested: no change to any song's seating, IPA, or text (nothing in this row touches `pairings`, the engine, or the transcription; the full unit suites pass).

## Both Playwright projects

Run on `cloud-lane-44` at `f07cdf9`, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, `--trace off`: **164 passed, 11 failed, 2 skipped** (40.9 minutes). The three new tests (`gloss-reuse` ×3, `gloss-offer` on the phone project) pass.

**All 11 failures also fail on the untouched base.** I checked out `origin/cloud-lane-38` in a clean worktree, ran `pnpm install --frozen-lockfile`, and ran the same specs: the same 10 fail there (`glue-typed-marks` ×2, `insights-page`, `loupe-header`, `print-pages`, `singer-paths` Learn and Guide, `input-views`, `phrase-ends`, `relining` ×2), and the HEIC poem test (`heic-reader-path.test.ts:111`) times out there too (200 s waiting for the OCR input). None touches a gloss. I did not diagnose them. The brief gives no rule for failures that predate the row, so I left them as they are.

## Answers the brief asked for

- **Phone width, keyboard up** (step 3's report has the numbers): the field and the offer stay in view in a 420 px tall viewport; the targets are 44 px on a coarse pointer. The keyboard is emulated by viewport height, not real.
- **A lemma-keyed fill on an inflected form the singer did not write it for** (step 2's report has the detail): it reads as the lemma's meaning, not the case, so a gloss typed for `дому` shows on `дом`. The shipped dictionary gives every personal pronoun the lemma `я`, so pronouns are keyed by their own form.

## Held for the desk

- **No string is a draft.** All six strings the brief marks as ratified are seated exactly, with a test on both languages.
- **Taste:** the pronoun rule (lemma `я` by form, against every `pron` by form); a stored empty edit after blanking a field following the tap; two small ceilings that fell (`+page.svelte` could go 5534 to 5526 in `scripts/ratchets.json`; I left it to avoid a merge conflict with lanes 39 to 43).
- **Recorded for Dann in the brief, not built:** the English short gloss falling back to French unmarked, `WordStack`'s stripping of a leading pronoun from a singer's own edit, and a binder carrying the glossary.

## What I could not establish

- Why the 11 base failures fail. I know only that they fail without my change.
- Walk item 3 in a browser, and a real keyboard (see step 3).
- Whether lanes 39 to 43 will conflict in `+page.svelte`. My edits there are six lines: one import, the derived pair, the handler, the edits map, and two props.
