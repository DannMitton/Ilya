# Report: N.203 lane 61, Step 3 (links L1 and L2)

Branch `cloud-lane-61`. Pictures: `docs/sessions/report-code-n203-lane61-pictures/step3-*.png`: the INSIGHTS notes with L1 and the link's landing (desk and phone, English and French), and the printed INSIGHTS pages (`step3-desk-en-printed-insights-1.png`, `-2.png`, from `page.pdf` in print media). I looked at the desk English notes and landing, the phone French notes, and printed page 2. The other landings are the same layout in the other size and language.

## What changed

- **L1.** New `lib/insights/links.ts`: `InsightsLinks`, one object so the pane's Props and the notes block take one line each (`shares` now; Step 4 adds to it). `SingerBlock.svelte` draws, after the Method line, a paragraph `.notes-links` holding a button styled as `.offer-link` with the built words `calib.pane.door.insights` ("What INSIGHTS shares, and how" / « Ce que partagent les APERÇUS, et comment »). `.notes-links` is `display: none` in print, in the same list as `.try-key`, `.offer-decline`, and `.tempo-link`. No key added.
- `InsightsPane.svelte`: a `links` prop passed through `blockAt` to the block. The notes block's shape is unchanged, so `singer-blocks.test.ts:249` is untouched. To pay for the three lines, the no-score block list moved to `singer-blocks.ts` as `noScoreBlocks(method, language)` (same two blocks, pinned by a test). The pane is at 744 of 744; no free line is left for Step 4 yet, and Step 4 frees its own.
- `routes/+page.svelte` (5,520 lines): `links={voiceSeam?.voices.length ? { shares: () => openStation('insights') } : undefined}`. With no voice saved the link is absent, since the stations do not exist then.
- **L2** is Step 2's work: "Add your range" calls `openStation('describe', 'range')`.
- The link is drawn in the measuring pass as well as on the page, so the page fill counts its line. In print it disappears, which can only make a page a line shorter than measured, never overflow.

## Tests

- `lib/insights/links.test.ts` (new, 5): drawn after the Method line with the built words in both languages; absent without the link; the words themselves; hidden in print by the stylesheet; `noScoreBlocks` equals the blocks it replaced.
- `e2e/insights-links.test.ts` (desk, 5): L1 lands with the VOICE band closed and with INPUT and VOICE open (the Drawer scrolls); absent with no voice; `display: none` in print media with the Method line still there; French words.
- `e2e-phone/insights-links.test.ts` (2): L1 lands, in view, with the Drawer lowered and with it open on VOICE. The pane draws each block twice (once off screen to measure), so the test picks the copy on screen. The first run read the box while the Drawer was still rising; the test now waits for it to settle (that was a test timing issue, not a landing failure).
- Playwright: `print-pages`, `pages-without-gaps`, `insights-no-score`, `insights-page`, `insights-key-lines` together, 56 of 56. The printed PDF (2 pages) contains the Method line and 0 occurrences of "What INSIGHTS shares".

## Gates

phonology 462 (462); dictionary 248 (248); svelte-check 0 errors, 12 warnings, 5 files; web 6507 passed, 1 skipped (6508); score-parser 904 passed, 5 skipped (909); blurb 178 (178); root 159 (159); ratchets OK. `singer-paths` and `calibrate-new` run at Step 4 with the rest.

## What I could not establish

- Whether the page fill is unchanged on every fixture: `pages-without-gaps` passes for the fixtures it covers (Sunless, Tchaikovsky op. 38 no. 3, English and French); other pieces are not run.
- L1 sits as a separate line under the Method line, as the brief says. Whether it reads better beside the Method line on one line is a taste call and was not drawn.
