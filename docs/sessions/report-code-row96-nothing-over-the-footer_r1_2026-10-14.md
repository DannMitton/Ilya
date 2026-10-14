# Report: QUEUE row 96, nothing on an Insights page runs into its footer (r1)

Code (Opus), cloud lane, 2026-10-14. Brief: `brief-code-row96-nothing-over-the-footer_r2_2026-10-14.md`, with the cloud-lane amendments. Branch `cloud-lane-3`, cut from `origin/Shane` at `dbe41af`, in a fresh Linux clone (`pnpm install --frozen-lockfile`). Working tree clean at the start. Playwright 1.58.2 ran against `pnpm dev` with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.

## The answer in three lines

1. Lead 1 is the cause that reproduces: "N more observations" is never counted (`InsightsPane.svelte:446` at `dbe41af`), so opening it on Tchaikovsky's Insights page 2 runs 393.2 px (English) and 176.3 px (French) into the footer. Closed, and in print, nothing overlaps.
2. The fix pages the list at its opened height while it is open, and closes it before printing. Opened, the pages re-flow on screen (6 to 7 pages); closed, every page is as before, and paper always holds the closed six.
3. The new check in `pages-without-gaps.test.ts` was red on exactly that case before the fix and is green after (24 passed). The stroke is 0.098. All eight gates are at this clone's baseline, unmoved.

Dann's exact picture, the vowel chart's rows [ɛ] to [ɑ] over the footer on page 3, did **not** reproduce with this voice: here the chart sits on page 3 and the list on page 2. See "What could not be established".

## Step 1. Measurements, before any change

Instrument: `measure()` from `apps/web/e2e/pages-without-gaps.test.ts:41-86`, copied unchanged into a throwaway spec (not committed; it is in the session scratchpad). `empty` in px per page; an overlap is `empty < 0`. Voice: the test's `storedVoice()` bass (row 79's). Screen at 1440 px; print by `page.emulateMedia({ media: 'print' })`. The list is opened by clicking `.paper-page:visible details.more > summary`.

Overlap column: the most negative `empty` on any page, or "none" when every page's `empty` is at or above zero. Every page's reading follows in brackets.

| Song | Document | Language | List | Medium | Pages | Overlap, px | `empty` per page |
|---|---|---|---|---|---|---|---|
| Without Sun, no. 1 | Text | en | n/a | screen | 1 | none | 321.6 |
| Without Sun, no. 1 | Text | en | n/a | print | 1 | none | 321.6 |
| Without Sun, no. 1 | Text | fr | n/a | screen | 1 | none | 321.6 |
| Without Sun, no. 1 | Text | fr | n/a | print | 1 | none | 321.6 |
| Without Sun, no. 1 | Markup | en | n/a | screen | 3 | none | 22, 22, 746.2 |
| Without Sun, no. 1 | Markup | en | n/a | print | 3 | none | 22, 22, 746.2 |
| Without Sun, no. 1 | Markup | fr | n/a | screen | 3 | none | 22, 22, 725.3 |
| Without Sun, no. 1 | Markup | fr | n/a | print | 3 | none | 22, 22, 725.3 |
| Without Sun, no. 1 | Insights | en | closed | screen | 3 | none | 189.8, 75.4, 158 |
| Without Sun, no. 1 | Insights | en | closed | print | 3 | none | 191.5, 75.4, 158 |
| Without Sun, no. 1 | Insights | en | opened | both | 3 | no "more" block | |
| Without Sun, no. 1 | Insights | fr | closed | screen | 4 | none | 129.1, 268.1, 77.2, 590.4 |
| Without Sun, no. 1 | Insights | fr | closed | print | 4 | none | 130.9, 268.1, 77.2, 590.4 |
| Without Sun, no. 1 | Insights | fr | opened | both | 4 | no "more" block | |
| Tchaikovsky op. 38 no. 3 | Text | en | n/a | screen | 2 | none | 56.3, 598.8 |
| Tchaikovsky op. 38 no. 3 | Text | en | n/a | print | 2 | none | 56.3, 598.8 |
| Tchaikovsky op. 38 no. 3 | Text | fr | n/a | screen | 2 | none | 56.3, 598.8 |
| Tchaikovsky op. 38 no. 3 | Text | fr | n/a | print | 2 | none | 56.3, 598.8 |
| Tchaikovsky op. 38 no. 3 | Markup | en | n/a | screen | 4 | none | 22, 22, 22, 782.8 |
| Tchaikovsky op. 38 no. 3 | Markup | en | n/a | print | 4 | none | 22, 22, 22, 782.8 |
| Tchaikovsky op. 38 no. 3 | Markup | fr | n/a | screen | 4 | none | 22, 22, 22, 782.8 |
| Tchaikovsky op. 38 no. 3 | Markup | fr | n/a | print | 4 | none | 22, 22, 22, 782.8 |
| Tchaikovsky op. 38 no. 3 | Insights | en | closed | screen | 6 | none | 83.6, 45.5, 59.5, 82, 74.2, 550 |
| Tchaikovsky op. 38 no. 3 | Insights | en | closed | print | 6 | none | 83.6, 74.8, 59.5, 82, 74.2, 550 |
| Tchaikovsky op. 38 no. 3 | Insights | en | **opened** | **screen** | 6 | **page 2: 393.2** | 83.6, **−393.2**, 59.5, 82, 74.2, 550 |
| Tchaikovsky op. 38 no. 3 | Insights | en | opened | print | 6 | none | 83.6, 74.8, 59.5, 82, 74.2, 550 |
| Tchaikovsky op. 38 no. 3 | Insights | fr | closed | screen | 6 | none | 70.5, 280.8, 76.4, 80.1, 60.4, 176.6 |
| Tchaikovsky op. 38 no. 3 | Insights | fr | closed | print | 6 | none | 70.5, 310, 76.4, 80.1, 60.4, 176.6 |
| Tchaikovsky op. 38 no. 3 | Insights | fr | **opened** | **screen** | 6 | **page 2: 176.2** | 70.5, **−176.2**, 76.4, 80.1, 60.4, 176.6 |
| Tchaikovsky op. 38 no. 3 | Insights | fr | opened | print | 6 | none | 70.5, 310, 76.4, 80.1, 60.4, 176.6 |

Text and Markup: no overlap on any page, so nothing is left for another row.

Where things sit on Tchaikovsky's Insights, both languages: "N more observations" on page 2, the vowel-turn chart on page 3.

The brief's expectation held in its mechanism. Closed, the list costs 29.3 px on page 2 in English (screen 45.5 against print 74.8; French 280.8 against 310, the same 29.2): one summary line and the 12 px gap, inside `CLEAR`'s 40 px, so no overlap. Opened, it overlaps.

The one overflow `paginate` allows is ruled out by number. The vowel chart measures 371 px (English) and 467 px (French), `heights[k]` read from the measurer's copy. A page after the first has 813 px of room (`room` as at `InsightsPane.svelte:448` at `dbe41af`: 1056 − 48 − footer 66 − `CLEAR` 40 − column top 89). The chart is less than an empty page.

## The control's reading

Throwaway rule in `InsightsPane.svelte`'s stylesheet: `.insights-page .column :global(.block-vowels) { padding-bottom: 100px; }` (`:global` is needed because the block's class lives in `SingerBlock.svelte`; the measurer's copy is outside `.column`, so it does not match). Tchaikovsky, list closed:

- English, page 3: `empty` from 59.5 to **−40.5**, screen and print. Exactly 100 px.
- French, page 3: `empty` from 76.4 to **−23.6**, screen and print. Exactly 100 px.

The chart stayed on page 3. The instrument sees an overlap. The rule was reverted; the file was restored byte for byte from a copy taken before the edit.

## The cause

At `dbe41af`:

- `apps/web/src/lib/insights/InsightsPane.svelte:446`: `printed` drops every `screenOnly` block, so `paginate` never sees "N more observations".
- `InsightsPane.svelte:466-470`: the dropped block is then appended to the segment of the block before it, with no height counted.
- `apps/web/src/lib/insights/singer-blocks.ts:283-292`: the one screen-only block, `kind: 'more'`, a `<details>` (`SingerBlock.svelte:88-92`).

Opened, its observations add their full height to a page already filled to capacity. On Tchaikovsky page 2 that is three observations: 393 px in English, 176 px in French.

Lead 2 (measured before layout lands) is not the cause here: the closed readings and the control both match the arithmetic to the pixel. It is not ruled out for other songs or voices.

Lead 3 is confirmed: the row 79 test never failed on a negative `empty`, and it skipped the last page.

## The fix

**Mechanism.** While the list is open, the pane pages it like any other block at its opened height, breakable between lines; while it is closed, it rides uncounted as before. The measurer always draws it open, so its opened height and its line breaks are known before anyone clicks. On `beforeprint` the pane closes the list and flushes, so print always lays out the closed pages, and on `afterprint` it reopens it.

**Why this one.** It is the only mechanism I found that keeps every closed page exactly where row 79 put it, keeps block order, and never lets the open list reach the footer, however many observations it holds (it breaks across pages rather than overflowing one). The alternatives each broke a "keep": counting the list's closed height always would have moved a block off Tchaikovsky's English page 2 (29.3 px more on a page with 5.5 px to spare above `CLEAR`); reserving its opened height always would have left up to 393 px of empty paper in print; a scrolling box would have had about 5 px to scroll in.

**The pages re-flow when the list opens.** That is for Dann's walk. Tchaikovsky, opened, on screen: 6 pages become 7. The list runs from page 2 to page 3, and the vowel chart moves from page 3 to page 4. Every page's `empty` after the fix:

| Language | List | Medium | `empty` per page |
|---|---|---|---|
| en | closed | screen | 83.6, 45.5, 59.5, 82, 74.2, 550 (unchanged) |
| en | closed | print | 83.6, 74.8, 59.5, 82, 74.2, 550 (unchanged) |
| en | opened | screen | 83.6, 65.3, 329.2, 99.4, 125.6, 98.4, 595 |
| fr | closed | screen | 70.5, 280.8, 76.4, 80.1, 60.4, 176.6 (unchanged) |
| fr | closed | print | 70.5, 310, 76.4, 80.1, 60.4, 176.6 (unchanged) |
| fr | opened | screen | 70.5, 77, 187.8, 73.7, 66, 125.5, 525.1 |

Opened, English page 3 is 329 px empty. INFERENCE from the numbers, not run through row 79's test (which measures the list closed): the next item, the vowel chart at 371 px plus its squircle, needs more than that page's 273 px of room, so row 79's rule would name it FULL, not fail it.

**Print and screen.** Closed, they hold the same pages, as before. Opened, the screen re-flows and print does not, because print closes the list first. Measured with `page.pdf` (which fires `beforeprint` in this Chromium), list opened on screen: English 7 sheets on screen, **6** PDF pages; French the same. After printing, the screen is back at 7 sheets with the list open. Under `emulateMedia('print')` alone, which fires no `beforeprint`, the opened layout prints with the list's space left blank (English page 2 385.3 px, page 3 477.2 px empty); that path is what the check measures, and it does not overlap.

**Changes**, on `cloud-lane-3`:

- `apps/web/src/lib/insights/InsightsPane.svelte:417`: `'more'` joins `BREAKS`, so the open list breaks between lines.
- `InsightsPane.svelte:445-471`: `moreOpen`, the `beforeprint` and `afterprint` handlers, and `printed` now keeps the screen-only block while it is open.
- `InsightsPane.svelte:492`: the uncounted ride applies only while the list is closed.
- `InsightsPane.svelte:541-552`: `blockAt` takes `measuring`; the page copy follows `moreOpen` and reports toggles, the measurer's copy (`:579`) is always open.
- `apps/web/src/lib/insights/SingerBlock.svelte:21-34`, `:93`: `open` and `ontoggle` props on the `more` block's `<details>`; the header comment says the two copies differ there.

Not changed: type sizes, margins, the stave size, `CLEAR`, block order.

## The check, red then green

`apps/web/e2e/pages-without-gaps.test.ts:120-168`, a new test beside row 79's: for both fixtures, all three documents, both languages, every page including the last, screen and `emulateMedia` print, it fails on any `empty < 0`. On Insights it then clicks `.paper-page:visible details.more > summary` and measures again; where there is no "more" block it prints that by name and passes.

Run from `apps/web`: `pnpm test:e2e e2e/pages-without-gaps.test.ts`.

**Before the fix: 2 failed, 22 passed (7.6 min).**

```
Tchaikovsky Op. 38 no. 3, insights, en, list opened, screen, page 2: content runs 393.2 px into the footer
Tchaikovsky Op. 38 no. 3, insights, fr, list opened, screen, page 2: content runs 176.3 px into the footer
NO MORE BLOCK: Without Sun, no. 1, en; the opened case passes
NO MORE BLOCK: Without Sun, no. 1, fr; the opened case passes
```

**After the fix: 24 passed (7.5 min).** The same two NO MORE BLOCK lines. Row 79's twelve tests pass both times, with the same three FULL lines both times:

```
FULL: Tchaikovsky Op. 38 no. 3, insights, fr, page 2: 32.3 percent empty (281 px); page 3's first item needs 262 px, the page has 225
FULL: Without Sun, no. 1, insights, en, page 1: 21.1 percent empty (190 px); page 2's first item needs 148 px, the page has 134
FULL: Without Sun, no. 1, insights, fr, page 2: 30.8 percent empty (268 px); page 3's first item needs 477 px, the page has 212
```

## Pictures

`docs/sessions/row96-shots/`, Tchaikovsky, screen at 1440 px, the bass voice. The page number is in each name.

- Before, the vowel chart's page (page 3): `before-en-closed-page3.png`, `before-en-opened-page3.png`, `before-fr-closed-page3.png`, `before-fr-opened-page3.png`.
- Before, the list's page (page 2), where the overlap is: `before-en-opened-page2.png` shows the list's last observation printed over the footer's attribution. Also `before-en-closed-page2.png`, `before-fr-closed-page2.png`, `before-fr-opened-page2.png`.
- After, closed: `after-en-closed-page2.png`, `after-en-closed-page3.png`, `after-fr-closed-page2.png`, `after-fr-closed-page3.png`.
- After, opened: the list's page `after-en-opened-page2.png` and `after-fr-opened-page2.png` (page 2 of 7, clear of the footer); the vowel chart's page is now page 4, `after-en-opened-page4.png` and `after-fr-opened-page4.png`.

Nothing is called fixed off these pictures until Dann says what he sees.

## Step 4. Row 78b's stroke

`packages/score-parser/src/placeholder-mark.ts:44`: `PLACEHOLDER_HOLLOW_STROKE_SP` from 0.198 to **0.098**. The comment above it (`:35-43`) now says it is the rim's thinnest, chosen by Dann on 2026-10-14 on `docs/sessions/placeholder-shots/hollow-strokes.png`, and quotes his words. Gate 5: 675 passed, 5 skipped (680), unmoved, as expected.

## The gates

The brief's script, `~/Downloads/ilya-ship.sh`, does not exist in this clone, so I ran each gate's command directly. Baseline taken before any change, on `dbe41af`.

| Gate | Before | After | Moved by |
|---|---|---|---|
| 1 phonology | 251 passed | 251 passed | nothing |
| 2 dictionary | 248 passed | 248 passed | nothing |
| 3 web check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files | nothing |
| 4 web test | 2474 passed (141 files) | 2474 passed (141 files) | nothing |
| 5 score-parser | 675 passed, 5 skipped (680) | 675 passed, 5 skipped (680) | nothing |
| 6 blurb | 145 passed | 145 passed | nothing |
| 7 integration | 55 passed | 55 passed | nothing |
| 8 ratchets | OK | OK | nothing |

Gates 4 and 5 match the brief's Mac baselines. Gate 2 reads 248 here; the brief names no number for it, and older reports on file name 235 (`report-code-staves-traced-and-straightened_r1_2026-10-01.md:187`), so whether 248 matches the Mac script today is NOT ESTABLISHED. Gate 8 prints two lines, `CorrectionSurface.svelte: 1265 -> 1259` and `Loupe.svelte: 3013 -> 3012`, before and after alike; this change touches neither file. The e2e check is not one of the eight.

## What could not be established

- **Dann's own overlap.** He saw the vowel chart's rows [ɛ] to [ɑ] over page 3's footer. With row 79's bass voice the chart sits on page 3 and the list on page 2, and the overlap is the list's own last observation on page 2. The mechanism fits his report if, with his voice and settings, the list falls on page 3 above the chart: opening it would push the chart into the footer. That is INFERENCE. His voice, his settings, and whether he had the list open are NOT ESTABLISHED.
- **Lead 2** (a block measured before its layout lands): not seen here, not ruled out elsewhere.
- **The real print dialogue.** `page.pdf` fires `beforeprint` and printed 6 pages with the list open. Safari's and Firefox's print paths, and Chrome's own print dialogue on Dann's Mac, were not run.
- **Opened layout under row 79's rule.** English page 3 at 329 px empty is inferred FULL from the numbers; no test measures row 79's rule with the list open.
- **The phone.** The phone layout is one unpaged column with no footer to reach; it was not measured.
- **The other voices.** Only row 79's bass voice was run.
- **Gate 2's Mac baseline**, as in "The gates".
