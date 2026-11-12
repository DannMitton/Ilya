# Report: closing polish lane, step 12 and the close (Code, cloud-lane-48, r1, 2026-11-12)

Branch `cloud-lane-48`, pushed at `03ee51b`. No pull request.

## First, two things the desk must know

1. **I had already merged `Shane` before your "do not merge Shane yet" arrived.** The merge is `8b9ddbb` ("Merge Shane into cloud-lane-48"), `Shane` at `b2d4ef8`, which brought 11 files, all under `docs/` (desk documents; no code, no `docs/memory`: `git diff --name-only HEAD...origin/Shane | grep -v '^docs/'` was empty). It is pushed. I did not rewrite history. If the desk wants the lane without it, the merge commit is one commit and its parents are the lane's tip and `b2d4ef8`.
2. **Two of my own earlier steps had broken gates that I found only now**, and both are fixed and pushed: step 1's test fixtures had 18 type errors (`CalibratedFormant` needs `source`; CI's type-check caught it; `8680620`), and step 9b moved the LiederNet sentence, which `components/footer-credit.test.ts` pinned (found by the full unit run; `868e617`). I had run only the touched tests after those steps, not gate 3 and the whole suite. CI run 1075 on `868e617` is green for type-check, ratchets, all tests, and build.

## (a) The three stale pins, to the ruled behaviour (no app code)

- `e2e/glue-typed-marks.test.ts:29`: now «я #на дом» becomes `я` U+00A0 `#` space `на дом` on leaving the field (QUEUE row 163 step 3, Dann 2026-10-30 14:27); renamed; comment says what it pinned before.
- `:39`: no longer claims Control+Z restores the plain space; it checks the tidy value stays (`я иду домой` U+00A0 `#`) after the undo key, and says why (the tidy goes up as a value set from code, which the textarea's undo history does not hold; `IntakeViews.svelte` `onBlur`'s comment).
- `e2e/insights-page.test.ts:95`: looks for the current frame's opening, "Ilya’s advice is drawn from the intersection of your voice" (`i18n.ts:1877`), not "Ilya does not invent advice".
All three pass.

## (b) L17: the comfortable-zone label wraps (`insights/PitchSeconds.svelte`)

The label is one `<text class="bracket-label">` with a `<tspan>` per line, cut at word spaces from widths read in the real font (`getSubStringLength` of a hidden whole copy, after `document.fonts.ready`, and again when the width or the language changes): two lines cut at the most even space where two fit, more only where a word would still overrun. The lines are centred on the bracket's middle, the typed range stays one line under them, and the figure's vertical extent grows by the added lines. The whole-label measurer lives in a sibling svg of its own (a first version put it in the figure's svg and `insights-page.test.ts:123` caught it).

Measured at 390 × 844 in Chromium, seeded voice with a typed tessitura (`e2e-phone/insights-label.test.ts`; screen pixels from the DOM; the figure's right edge is x = 333.0):
| | lines | widest line's right edge | against the figure's right edge |
|---|---|---|---|
| English, G3 to D4 | 2 («your comfortable» / «working zone, typed») | 329.3 | 3.7 px inside |
| English, G3 to A3 (two semitones) | 2, the same | 329.3 | 3.7 px inside |
| French, G3 to D4 | **4** («votre zone de travail» / «confortable, telle» / «que vous l’avez» / «indiquée») | 329.6 | 3.4 px inside |
| French, G3 to A3 | **4**, the same | 329.6 | 3.4 px inside |
Before (step 11): the French label ran 164 px past the figure and 107 px past the window; the English ran 67 px past the figure and 10 px past the window.
**Two lines are not enough in French at 390 px**: the room right of the bracket there is 84 px (the figure is 276 px wide and the bars take their 50 px floor), and each half of the French label is about 124 px. So French takes four lines; I did not shorten the ratified text or move the bracket. The desk may want a different answer (a smaller bar floor to give the label more room, for one).
The test asserts, in both languages and both zones: each line's right edge is at or left of the figure's, no line is above or below the figure, no line overlaps another text in the figure, and the lines' words, joined, are `insights.r2.yourTessitura`. It passes (4 tests). I looked at the figure in French at 390 px (screenshots in the scratchpad, not committed): the four lines read inside the bracket's column; the «secondo passaggio B3» name already sits close to the bracket before this change.
Not done: a print of INSIGHTS to PDF in French at letter size with the label (L17 step 3); at 1,440 px the label was never clipped (step 11) and is not wrapped there (it fits).

## (c) MELODY's blank third page (`print-pages.test.ts:20`): fixed in the app

Cause: **`apps/web/src/app.css:321`**, `.paper-page:last-child { break-after: auto }`. MELODY's last sheet is not its parent's last child: **`lib/markup/MarkupPane.svelte:1047`** draws a zero-height `<div>` (the notes measurer, `<NotesColumn>`) after the sheets, so the last sheet kept `break-after: page` (`app.css:303-304`) and Chromium printed a blank page after it. Found by reading the printed PDF (page 3 blank, "Page 1 of 2" and "Page 2 of 2" on the first two), the elements at or below y = 2112 in print media (only that wrapper's), and by trying `display: none` on the wrapper (no change: `:last-child` counts hidden siblings). Fix: the selector is now `.paper-page:last-child, .paper-page:last-of-type` (the last `article`, whatever follows it), with a comment. `print-pages.test.ts` passes; `lib/print-last-sheet.test.ts` pins the rule.

## (d) INSIGHTS "1 page against 2 sheets" (`pages-without-gaps.test.ts:248`): **not an app fault; the test**

I reproduced it. In print media nothing is hidden: both sheets are there, and `page.pdf()` of INSIGHTS right after MELODY gives 2 pages when the page has not been touched by `overlaps()`. The cause is in the test, **`e2e/pages-without-gaps.test.ts:135`** (now `:137`): `overlaps()` ends with `await page.emulateMedia({ media: 'screen' })`, which leaves a media override set, and `page.pdf()` prints with the overridden media (Playwright's own note on `pdf()`: it uses `print` CSS unless told otherwise). So the PDF the caller takes after `overlaps()` is a screen-media print, and INSIGHTS' screen layout flows to one page. I ran: before the toggle 2 sheets, under print 2, back on screen 2, PDF 1 page. Fix: `emulateMedia({ media: null })` (resets the override), with a comment. The test passes (`:229` now). I changed the test, not the app, because no app element is hidden; this is the opposite of what the desk expected, so please check it.

## (e) Gates and the seven Playwright files (desktop)

Final tree `03ee51b` (last code change: L17's measurer, `03ee51b`'s parent):
| gate | result |
|---|---|
| 1 `pnpm test:phonology` | 456 passed |
| 2 `pnpm test:dictionary` | 248 passed |
| 3 `pnpm --filter @ilya/web check` | 0 errors, 12 warnings |
| 4 `pnpm --filter @ilya/web test` | 5283 passed, 1 skipped (5284) |
| 5 `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped |
| 6 `pnpm test:blurb` | 168 passed |
| 7 `pnpm test:integration` | 159 passed |
| 8 `pnpm ratchets` | OK |
Gates 1, 2, 5, 6, 7 were last run one commit earlier (`3f519ee`); the later change touches only `PitchSeconds.svelte`, so those five are not affected (gates 3, 4, and 8 were re-run on the final tree). Step 0's counts were 456, 248, 0/12, 5190 + 1, 785 + 5, 168, 155, OK; the web suite grew by 93 tests and the integration suite by 4.
Seven Playwright files (`glue-typed-marks`, `heic-reader-path`, `insights-page`, `loupe-header`, `pages-without-gaps`, `print-pages`, `singer-paths`), desktop, one worker, Chromium 1243 at `/opt/pw-browsers/chromium`: **52 passed, 1 failed** (12.9 minutes). The one failure is **`loupe-header.test.ts:47`** (the drag moves the card 30 px, not 40, at `:59`; CI fails the same test at `:65` with 4.5 against < 2), untouched by this step: **which side is wrong is NOT ESTABLISHED** (see step 11). I did not run the phone suite or the whole desktop suite in this final pass (a full desktop run of the earlier head was in progress when the desk's instruction arrived and I stopped it).
One flake seen once, not reproduced in 15 isolated runs: `lib/text/syntactic-break-unit.test.ts` ("property: breakTarget agrees with unitEnd ... on random songs") failed in one full unit run and passed in every other; its generator is seeded, so I suspect a time limit under load, but I did not see its message.

## CI

Run 1066 never finished (cancelled by later pushes; the step 11 report now says so). Run 1075 (head `868e617`) is the one completed run: job 1 green, job 2 failed with the six tests above plus `loupe-header:97` flaky. A run on `03ee51b` was started by the last push and had not finished when I wrote this; its result is not in this report.

## What I could not establish

- `loupe-header.test.ts:47`: the room the card has to move; and the CI-only `loupe-header.test.ts:97` flake.
- Whether the French label should take four lines at 390 px or the room should change (the desk's call).
- The CI result for `03ee51b`.
- A print of INSIGHTS with the wrapped label (L17 step 3).
