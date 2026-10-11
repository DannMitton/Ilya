# Report: one running head and one footer for Text, Markup, and Insights (r1, 2026-10-11)

**QUEUE row 64, state: WRITTEN on the code, pushed to `cloud-lane`. DONE is Dann's look.** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-one-head-one-foot_r1_2026-10-11.md`. Built on `cloud-lane` at `9ad40822` (fast-forwarded from `841aae5`; the working tree was clean before the first edit).

## Rules this session ran under

The brief's constraint "no git command that writes" is the Mac's rule. Dann's instruction for this cloud session, under `CONTRACT.md` §5's cloud-lane amendment of 2026-10-02, is to commit and push `cloud-lane` after each row. So this row is one commit on `cloud-lane`. Nothing was pushed to `Shane` or `main`, no pull request was opened, and no history was rewritten.

## What changed

1. **One running head.** `apps/web/src/lib/components/Paper/RunningHeader.svelte` now takes `tabName`, `accent` (the rule's colour), `accentInk`, and `tabOnly`. The piece sits on the left and the tab's name sits on the right, in the same type as before (14 px, 600, all small caps, 1.5 px tracking). The rule takes the tab's colour.
   - Text, page 2 on: `components/Paper/SubsequentPage.svelte:78`, `t('tab.text')`, sage rule (default).
   - Markup, page 2 on and its notes sheets: `markup/MarkupPane.svelte:980` and `:998`, `t('tab.markedScore')`, lavender rule `#9585A2`. The piece is now `formatRunningHeader(composer, title, poet)` (`MarkupPane.svelte:912`), where it was the title alone. `MarkupPane` gained `composer` and `poet` props, passed from `routes/+page.svelte`.
   - Insights, pages 2 and 3: `insights/InsightsPane.svelte:720` and `:762`, `t('tab.insights')`, rose rule. Its hand-drawn head and its `.running-*` styles are gone. The piece is `formatRunningHeader(composer, title, poet)` (`InsightsPane.svelte:514`). `InsightsPane` gained a `poet` prop. The identity line ("Insights for Dann · Bass · calibrated …") left the running head and stays on page 1.
2. **Page 1 names its tab.** The tab's name alone, right-aligned to the content edge, in the running head's type and the tab's ink, no rule: `TitlePage.svelte:152`, `MarkupPane.svelte:958` (score) and `:1043` (empty envelope), `InsightsPane.svelte:626`.
3. **One footer.** Insights now draws `PageFooter.svelte` (`InsightsPane.svelte:596`). `PageFooter` gained three props:
   - `apparatus`, a snippet drawn above the line after the legend and the broad note (`PageFooter.svelte:38`, `:90`). Insights puts its footnote and method line there. **Choice stated, as the brief asks: a snippet, not two string props**, because the footnote carries HTML, a superscript, and the "citation not yet verified" span.
   - `attribution`, an override of the credit line (`:56`, `:60`). Insights keeps its own form of the credit, with the lieder.net clause struck (`strikeLiederClause`), as built.
   - `element`, bindable (`:78`), so Insights' page-one fit still reads the footer's `offsetTop` directly. `footHeights` now arrives through `onheightchange`. The page still reserves the footer's exact height: `e2e/insights-page.test.ts` "fits above its foot" passes.
   - The line is 0.5 px in rose (`hairlineAccent="var(--rose, #ab7f7f)"`). The credits moved below the line, beside the page count, in `PageFooter`'s type.
4. **Tests.** New `apps/web/src/lib/components/Paper/one-head-one-foot.test.ts` (6 tests) holds the shape: each tab names itself on page 1 and on later pages, Markup and Insights print the piece as Text does, the identity line stays out of the head, and Insights draws `PageFooter` and still measures it. `e2e/insights-page.test.ts:124` now finds the footer by `.page-footer`, where it read `.insights-foot`.

No new string. The tab names are the existing `tab.text`, `tab.markedScore`, and `tab.insights` (« Texte », « Annotation », « Aperçus »).

## DESK DEFAULTS taken

- **Page 1's mark sits in the top margin, from 24 px to about 44 px, right-aligned to the 96 px content edge.** The brief says "at the top margin … above the title block", and on Insights "above the floating compass, which keeps its place". The compass and the title block both start at 48 px, so the mark sits above 48 px and nothing on page 1 moves.
- **Page 1's mark is in the tab's ink** (`--sage-ink`, `--lavender-ink`, `--rose-ink`), not the light accent, so it reads at 14 px small caps. On later pages the tab's name is in the running head's grey, as Dann's drawing shows it.
- **A piece too long for the line ends in an ellipsis rather than wrapping.** Markup reserves a fixed head height (`HEADER_HEIGHTS.subsequent`, 37 px), so a second line would run into its score. Page 1 prints the piece in full.
- **Markup with no title keeps its old fallback,** the profile subtitle. Insights with no title prints only the tab's name on the right.
- **The method line is in sentence case**, as Dann's drawing of 2026-10-11 has it. It was all small caps.
- **`+page.svelte` sat at its size ceiling** (6,003). The new props share the line `scoreTitle=` already used, so the file is 6,002 lines and no ceiling was raised.

## The pictures

`docs/sessions/head-foot-shots/`, 28 files, taken with `shots.mjs` (in the same folder) against the dev build in headless Chromium, 1440 by 1300. The "before" set was taken before the first edit.

- `before-` and `after-` × `text-p1`, `markup-p1`, `markup-p2`, `insights-p1`, `insights-p2` × `en`, `fr`: 20 pictures of *Without Sun*, no. 1 from the tracked fixture `sunless-01-engraved.musicxml`.
- **Text has no page 2 for this song**: its poem sets one Text page. So `text-typed-p1` and `text-typed-p2` (8 pictures) are the same poem typed three times, with the title, Mussorgsky, and Golenishchev-Kutuzov chosen in the drawer. That is the only way this session found to show Text's running head.
- The app's tab bar overlaps the top of each page-1 picture, before and after alike. It is the screen's sticky head over a page scrolled to the top, not part of the page.
- Insights' pictures use a synthetic stored voice (bass, typed range D2 to F4), the same one `e2e/insights-page.test.ts` uses.

## The eight gates

| # | Gate | Baseline `9ad40822` | After row 64 |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 251 passed (251) | 251 passed (251) |
| 2 | `pnpm test:dictionary` | 235 passed (235) | 235 passed (235) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 2088 passed (2088) | **2094 passed (2094)** |
| 5 | `pnpm --filter @ilya/score-parser test` | 650 passed, 5 skipped (655) | 650 passed, 5 skipped (655) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | OK | OK |

Gate 4 moved by +6, all in the new `one-head-one-foot.test.ts`. Outside the eight, `e2e/insights-page.test.ts` (3 tests) and `e2e/print-pages.test.ts` (1 test) passed against the edited code. Ratchets now say `InsightsPane.svelte` can drop from 1,351 to 1,186 and `MarkupPane.svelte` from 1,358 to 1,314; `scripts/ratchets.json` is untouched.

## Could not establish

- **Print.** The print guard passes, so each tab still prints the pages it numbers. I did not look at a printed page to check the 0.5 px rose line or the page-1 mark on paper.
- **Dann's own songs and voice.** Every picture is the fixture and a synthetic voice.
- **Markup page 2's empty upper half** (in both "before" and "after") is how the paginator places that song's last systems. This row does not touch it, and I did not establish why.
- **The phone.** Pages are whole on the phone (N.73 portrait C), so the head and foot should scale with them. I did not take phone pictures.
- **The em dash in the running head** ("Mussorgsky | Golenishchev-Kutuzov — Title") is `formatRunningHeader`'s, as built, and it is in the format Dann said "yes" to at 03:23. The house rule bars em dashes in user-facing copy. This row leaves it as ruled; it is Dann's to confirm.
