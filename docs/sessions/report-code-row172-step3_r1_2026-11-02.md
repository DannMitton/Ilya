# Report: row 172, step 3, the source line (Code, r1, 2026-11-02)

Branch `cloud-lane-29`, on `e359832` (step 2) plus this step.

## What changed

- New `apps/web/src/lib/components/TextSourceLine.svelte` (47 lines; props `language`, `witness`). A `<p id="text-source">` with the key for the witness, in 0.7rem type, `--ink-secondary`, flush right with the sheet's width (`--sheet-width`, as the pair it replaces). Text, not a control: no button, no role, no handler. Its own `@media print { .text-source { display: none; } }`, as `TextWitnessPair.svelte:52-56` had.
- `apps/web/src/routes/+page.svelte`: one import line (beside `InstallPrompt`, `:96`) and one element line, `{#if witnessDiffer}<TextSourceLine {language} witness={shown} />{/if}`, first in `transcriptionPaper` (`:4359`). Shown only when both texts exist and differ (`witnessDiffer`, `:461`, the pair's own condition). The page ends at 5585 lines.
- `apps/web/src/lib/i18n.ts`: two keys, `text.source.lyrics` "From LYRICS" and `text.source.poem` "From POEM" (Dann 2026-11-01 13:26, capitals), placed after `intake.view.lyrics`. The key index gains the line `text.  2  lib/components/TextSourceLine.svelte` and the total reads 1,121.
- New unit test `apps/web/src/lib/components/text-source-line.test.ts` (3 tests: the two texts; one paragraph with the id and no control; the print rule).
- E2E tests now assert the line's text: desk `e2e/text-witness-tools.test.ts` ("From POEM" after the tap, "From LYRICS" after the tap back and after the reload), phone `e2e-phone/text-witness.test.ts` ("From LYRICS", "From POEM", "From LYRICS" after each lower). The "no source line" tests from step 2 now have a real element to be absent.

## TODO-FR, for the desk to draft for Dann

Both French values stay the English, per the brief. Nothing French reaches `Shane` before he rules.

| Key | Value now (fr) |
|---|---|
| `text.source.lyrics` | `From LYRICS`  // TODO-FR |
| `text.source.poem` | `From POEM`  // TODO-FR |

The comment above the two entries in `i18n.ts` says so. A French singer sees an English line until Dann rules. The desk's draft, from `intake.view.*` (« PAROLES », « POÈME »), would be « D'après PAROLES » and « D'après POÈME »; that is a suggestion for the desk, not written into the file.

## Print preview check

Run on the real page (desk project, texts differing, drawer open): on screen the line is `display: block` and reads "From POEM", and under `page.emulateMedia({ media: 'print' })` its computed `display` is `none`; `page.pdf()` rendered. The throwaway spec was not committed. A screenshot of the line on screen was read: small grey type at the sheet's right edge above the page, below the tab row. NOT ESTABLISHED: a PDF text extraction showing the string absent; the computed style is the evidence.

## Gates, after step 3

| # | Result |
|---|---|
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 check | 0 errors, 12 warnings |
| 4 web unit | 3846 passed, 1 skipped (3847) (+3, the new unit test) |
| 5 root integration | 98 passed |
| 6 blurb | 148 passed |
| 7 score-parser | 785 passed, 5 skipped (790) |
| 8 ratchets | OK |

Playwright: phone `text-witness` 11 of 11 pass; desk `text-witness-tools` passes. The full-project result of step 2 is unchanged by this step (the one new element is behind `witnessDiffer`); I did not re-run the whole of both projects. `relining.test.ts:95` stays red for the reason in step 2's report and awaits Dann.

## Ratchets, and a correction to step 2's report

Step 2 lowered the `+page.svelte` ceiling to 5583 because `pnpm ratchets` offered it. Step 3 adds two lines (import and element), so the file is 5585. I set the ceiling to 5585. That is one under the ceiling the file had at the cut (5586), so the brief's "the page ends at or under its ceiling" holds against the ceiling as the cut had it. The ceiling I lowered myself in step 2 was not the cut's; I raised my own lowering back by two. `pnpm ratchets` offers nothing now. `TextSourceLine.svelte` is 47 lines against the new-file ceiling of 1000.
