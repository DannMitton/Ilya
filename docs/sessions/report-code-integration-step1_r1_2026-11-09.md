# Report: integration step 1, merge of cloud-lane-35 (Corrections slice 3), 2026-11-09

Branch `cloud-lane-38`, cut from `origin/Shane` at `4d73284b`. Step 1 merged `origin/cloud-lane-35` (merge base `2e3803da`). Nothing pushed to `Shane` or `main`, no pull request, nothing under `docs/memory/` touched.

## What was done

`git merge origin/cloud-lane-35` ran with the `ort` strategy and **no conflicts**. It brought in 8 files: `score/bar-answers.ts` and its test, `library/bar-answers-record.test.ts`, edits to `library/library.ts`, `library/types.ts`, `library/document.svelte.ts`, and the lane's two reports.

## Conflicts

None. I also checked for a silent overlap: `git diff 2e3803da origin/Shane -- apps/web/src/lib/library apps/web/src/lib/score/bar-answers.ts` printed nothing, so Shane did not change those files after the lane was cut, and there was nothing for the merge to keep from both sides.

## Gates (baseline on Shane, then this branch)

| Gate | Baseline | Now | Move |
|---|---|---|---|
| 1 phonology | 407 passed (407) | 407 passed (407) | none |
| 2 dictionary | 248 passed (248) | 248 passed (248) | none |
| 3 web check | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files | none |
| 4 web unit | 4198 passed, 1 skipped (4199) | 4232 passed, 1 skipped (4233) | +34, the lane's new tests (22 in `bar-answers.test.ts`, 12 in `bar-answers-record.test.ts`) |
| 5 score-parser | 785 passed, 5 skipped (790) | same | none |
| 6 blurb | 148 passed (148) | 148 passed (148) | none |
| 7 integration | 125 passed (125) | 125 passed (125) | none |
| 8 ratchets | OK. | OK. | none |

Gate 8 also prints six ceilings that could be lowered (`Drawer.svelte`, `LearnContent.svelte`, `Loupe.svelte`, `pairings.ts`, `CalibrationWizard.svelte`, `staff-renderer.ts`). They were already lowerable on Shane (none of the six is a file this merge touches). I did not edit `scripts/ratchets.json`.

## Playwright (both projects, once, on this branch)

`pnpm --filter @ilya/web exec playwright test --project=chromium --project=phone --trace off`, Chromium from `/opt/pw-browsers/chromium`: 142 passed, 14 failed, 2 skipped (39.8 min).

I re-ran the 14 red specs' files on a clean `origin/Shane` checkout (`4d73284b`): the **same 14 are red on Shane** (14 failed, 27 passed across those files). So none is new.

| Project | Red test | Red on Shane? |
|---|---|---|
| chromium | `glue-typed-marks.test.ts:29` leaves «я #на» as typed | yes |
| chromium | `glue-typed-marks.test.ts:39` Control+Z after the blur | yes |
| chromium | `heic-reader-path.test.ts:111` HEIC poem with no staves | yes |
| chromium | `insights-page.test.ts:95` the page runs the frame, the conclusion, then the moments | yes |
| chromium | `loupe-header.test.ts:47` a drag on the desk moves the card | yes |
| chromium | `print-pages.test.ts:20` Text, Markup, and Insights each print the pages Ilya numbers | yes |
| chromium | `singer-paths.test.ts:169` Learn and Guide open and show their first heading | yes |
| phone | `input-views.test.ts:134` a poem typed into Poem moves no seat | yes |
| phone | `phrase-ends.test.ts:26` Tchaikovsky onto an empty song | yes |
| phone | `relining.test.ts:70` y. a poem pasted into Poem | yes |
| phone | `relining.test.ts:95` bb. a poem typed key by key | yes |
| phone | `text-witness.test.ts:153` both texts differing | yes |
| phone | `text-witness.test.ts:193` both texts the same words | yes |
| phone | `text-witness.test.ts:204` only a poem or only Lyrics | yes |

## What a singer sees

Nothing new. The lane's own report states the module is pure and wired to no page.

## What I could not establish

- **Why the 14 tests are red on Shane.** I did not open their failure output. They are red on a clean Linux checkout of Shane; the maintainer's Mac may differ. Causes may be the sandbox (a headless Chromium at a fixed path, no network), the tests, or the code. NOT ESTABLISHED.
- **Whether the Shane Playwright rerun matches a full Shane run.** I re-ran only the ten files that held a red test, not all of Shane's suite. A test that is green here and was red on a full Shane run would not show. I judge that unlikely and did not measure it.
- **Anything about `bar-answers` in a browser.** Nothing is wired; the lane's report says so and I have not contradicted it.
- **The lane's own NOT ESTABLISHED items** (a real scan's bars, ties, pitch, shifted-bar numbering, scale) carry over unchanged.
