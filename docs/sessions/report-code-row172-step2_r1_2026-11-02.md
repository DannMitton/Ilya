# Report: row 172, step 2, the pair on TEXT goes (Code, r1, 2026-11-02)

Branch `cloud-lane-29`, on `3c7a93a` (step 1) plus this step.

## What changed

- Deleted `apps/web/src/lib/components/TextWitnessPair.svelte`. `ViewPair.svelte` stays.
- `apps/web/src/routes/+page.svelte`: removed the import (`:97`) and the element (was `:4360`). Two lines out, none in. `chooseWitness` now has one caller, `IntakeViews.svelte:225`.
- No key removed from `i18n.ts`. `a11y.paper` is `Paper.svelte:70`'s; `intake.view.poem` and `intake.view.lyrics` are INPUT's.
- Two references the brief did not name (step 0, item 1 and 2), both handled:
  - `apps/web/src/lib/components/view-pair-fill.test.ts:29` read the deleted file; that one assertion line is removed. The other two (`IntakeViews` passes `activeFill`, `DeskHead` does not) stay.
  - `apps/web/src/lib/i18n.ts:25`, the key index: `lib/components/TextWitnessPair.svelte` becomes `lib/components/Paper/Paper.svelte` on the `a11y.` line, so `i18n-index.test.ts` finds every named path.
- Desk test `apps/web/e2e/text-witness-tools.test.ts`: `#text-tab-poem` and `#text-tab-lyrics` repointed to `#intake-tab-poem` and `#intake-tab-lyrics`. The `aria-selected` assertion (was `:33`) is replaced by an assertion that after a reload TEXT shows Lyrics (the poem's gloss is not on the page). The source line does not exist until step 3, so its text assertion lands there.
- Phone test `apps/web/e2e-phone/text-witness.test.ts`: the pair test is rewritten as the brief says (raise, tap `#intake-tab-*`, lower, assert words and the muted word), and its two "no pair" tests now assert `#text-source` has count 0 (the id step 3 gives the source line; it passes trivially until then). The drawer is lowered and raised with `.drawer-pull`, because `getByRole('button', { name: /paper/i })` no longer matches (step 1 report). Test titles say "no source line".
- `scripts/ratchets.json`: `+page.svelte` 5585 to 5583 (ratchets offered it).
- Unit tests `witness-lines.test.ts:22-38` and `input-views.test.ts:136-142` are unchanged and pass.

## Gates, after step 2

| # | Result |
|---|---|
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 check | 0 errors, 12 warnings |
| 4 web unit | 3843 passed, 1 skipped (3844) |
| 5 root integration | 98 passed |
| 6 blurb | 148 passed |
| 7 score-parser | 785 passed, 5 skipped (790) |
| 8 ratchets | OK, `+page.svelte` ceiling lowered to 5583 |

No count moved from the baseline.

## Playwright, both projects, the whole of each

Run: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm exec playwright test --project=<chromium|phone>` in `apps/web`.

- The rows' own tests PASS: desk `text-witness-tools` (1); phone `text-witness` (11 of 11).
- Desk project: 82 passed, 1 skipped, 7 failed. Six of the seven fail identically on the untouched cut `f9797acb` (checked out detached, same command, same errors): `glue-typed-marks.test.ts:29` and `:39`, `insights-page.test.ts:95`, `loupe-header.test.ts:47`, `print-pages.test.ts:20`, `singer-paths.test.ts:169` (its French LEARN title now reads « chanteuses et chanteurs », the test expects « chanteurs »). They are not this row's. The seventh, `heic-reader-path.test.ts:111` (3.4 minutes, a tesseract path), I did not re-run on the untouched cut: NOT ESTABLISHED whether it fails there; it does not touch TEXT, INPUT's pill, or any file in this step.
- Phone project: 26 passed, 1 skipped, 2 failed.
  - `input-views.test.ts:134` fails identically on the untouched cut (the line it expects, "Your score's sung words are in Lyrics", reads differently now). Not this row's.
  - **`relining.test.ts:95` ("bb. a poem typed key by key lays Lyrics out after the pause, and Text is not rebuilt before it") PASSES on `f9797acb` and FAILS with this row. It is a consequence of the ruling, not of a bug in the edit.** The test taps POEM in INPUT, then types the poem key by key. Step 1 now makes that tap set the witness to Poem, so TEXT shows the poem and rebuilds on every key; the test saw 35 rebuild bursts before the last key where it expects none. This is path (b) from step 0 ("TEXT flips to the poem on the first typed word that differs ... transcribing key by key"), which the brief says to record and not change. I have not changed the app, and I have not edited, skipped, or quarantined the test. It is left red.

## Decision for Dann (relining bb)

The row 108 B guard says Text is not rebuilt until the quiet pause after typing. The ruling of 2026-11-01 13:04 makes the tapped witness what TEXT shows, so typing a poem now rebuilds TEXT per key, with the poem's own transcription not on the pause that Lyrics has. Two ways out, neither mine to choose:

1. Give the poem witness the same quiet pause as Lyrics before TEXT transcribes it (a change in `+page.svelte` near `poemLines`, `:466-468`, outside this brief). Keeps the guard; the test passes unchanged.
2. Accept per-key transcription of the poem and change bb to assert the end state (Lyrics laid out in six lines, seats unchanged) and drop its "no rebuild before the pause" half.

I recommend 1: the guard exists to keep typing from stalling on a rebuild, and a longer poem costs more per rebuild than the 4-line case the test runs. NOT ESTABLISHED: the cost of a per-key rebuild on a long poem on a phone; I did not measure it.

## Ratchets

`pnpm ratchets`: OK. Ceilings offered and taken this step: `+page.svelte` 5585 to 5583.
