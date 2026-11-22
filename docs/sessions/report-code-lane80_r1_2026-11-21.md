# Report, lane 80 (QUEUE row 202): one frame for the content of TEXT, MELODY, and INSIGHTS

r1, 2026-11-21, by the Code lane. Brief: `brief-code-lane80-one-frame-for-content_r2_2026-11-21.md`. Branch `cloud-lane-80`, cut from `origin/Shane` at `18db8ec5` after `git fetch origin`. The working tree carried two uncommitted files (`docs/memory/QUEUE.md`, `STATE.md`) which I did not write and do not commit.

Brief note: the message said "both addenda"; the file holds **one** addendum (four items, "on Dann's instruction", 22:3x). NOT ESTABLISHED whether a second exists elsewhere.

Instrument for everything below: `report-code-lane80_r1_2026-11-21/measure.mjs` (Playwright, Chromium, 1440 px viewport, so the sheet is 816 px at scale 1), readings in `before-1440.json` (taken on the tree at `18db8ec5`, before any edit), summarised by `summarize.py`. Voice: a bass called "Voice 1"; no fixture carries Dann's name. The dev server on :5173 was the maintainer's own, serving this tree.

## 1. Step 0, the five numbers

1. **`.running-header` offsetHeight: 25** (every later page, all three documents). The CSS arithmetic said 24.6, `page-config.ts` says 29 (2026-08-15). The browser says 25. The 29 is stale (`HEADER_HEIGHTS_AT_LETTER.subsequent`). The title header is 105 (TEXT, blank-state INSIGHTS), 127 (INSIGHTS with a score), 154 (MELODY page 1, with its key line and legend); `HEADER_HEIGHTS_AT_LETTER.title` says 127.
2. **`.page-footer` offsetHeight: 66 with no band** (every plain page, all three documents, both languages), **90 with a one-row legend** (TEXT, Tchaikovsky pages 1 and 2: band 32), **109 with the Richter credit and a legend** (band 32, credit four lines). MELODY and INSIGHTS pages here all measure 66 (their bands are empty on these fixtures: the broad note did not draw).
3. **The divider's distance from the sheet's bottom edge: 114 on every page of every document and both languages, except the Richter page, 133.** `.footer-content` is 57 high (three credit lines) and 76 with Richter (four). A two-digit page count (40 pages, both languages) does **not** move it (114): the label widens from 56 to 61.4 (one digit, EN) to 66.9 (two digits, EN), and 62.3 to 67.8 / 73.2 in French, and never changes the credit's line count. English and French agree. So by measurement the only thing that moves the divider is the Richter credit; the brief's other two mechanisms (language, label width) do not on any case I could reach.
4. **TEXT's first glyph: left 96 on page 1 and on every later page** (Range over the first text node of the first `.cyrillic-row`, sheet px). The window box (`.page-content`) is at 88, so the brief's arithmetic (88 + 4 + 4) is confirmed. MELODY's `.score-window` and INSIGHTS' `.column` are at 96.
5. **`.header-aside` clientWidth on INSIGHTS: 80 and 79 (Sunless, EN, FR), 74 and 70 (Tchaikovsky, EN, FR). `html` font-size: 16px.**

## 2. Step 0, the control (1440 px; page count, then first and last item per page)

TEXT, first and last line index per page; MELODY, first and last system's bar range; INSIGHTS, the page's `.part` count and the first and last block's opening words (full table: `before-1440.json`).

| Fixture | TEXT | MELODY | INSIGHTS |
|---|---|---|---|
| Sunless | 1 page, lines 0 to 9 | 2 pages: 0-2 .. 10-11 (5 systems), 12-13 .. 17-17 (3) | EN 3 pages, FR 4 |
| Tchaikovsky | 3 pages: 0-8, 9-18, 19-19 | 3 pages: 0-8 .. 32-39 (5), 40-46 .. 74-80 (6), 81-87 .. 96-98 (3) | EN 6 pages, FR 6 |

- **Neither fixture contains a Latin word.** Sunless gives **one** TEXT page, Tchaikovsky three, so page 2 comparisons in TEXT use Tchaikovsky.
- The Richter case is a typed text: "sanguis atque caulis" plus two Russian lines. Its footer is 109, hairline 133.
- A forty-page TEXT (160 typed lines) was used for the two-digit page label.
- Closed disclosures on Tchaikovsky INSIGHTS (EN): "Show keys that reach higher" ends at y 554 on page 1, "3 more observations" at y 376 on page 3.

## 3. Step 0, the numbers today (so commit A has something to match)

- TEXT window: top 169 (page 1, header 105) or 191 (header 127), 89 later; bottom 920 (footer reserve floored at 80), 910 with a 90 footer; box left 88.
- MELODY: top 220 (header 154 + 18), later pages 93 (37 + 8 + 48), bottom 920, left 96.
- INSIGHTS: `.column` top 191 (127 + 16), later pages 89 (25 + 16 + 48), left 96. No bottom: the column is as tall as its blocks.
- So the three documents' later pages begin at 89, 93, 89 today, and page 1 under the rule at 16, 18, 16.

## 4. Citations that moved (brief cites `e0ca61bf`; tree is `18db8ec5`)

Lane 79 merged. `page-config.ts` now has `BlankFrame`, `BLANK_ANCHOR`, `blankFrame` (`:43-77`), so every later `page-config.ts` line moved by about 37. `MarkupPane.svelte` is 1232 lines (was 1234): `TITLE_HEADER_GAP` is at `:466` (brief `:469`), `contentTop` `:468`, `contentBottom` `:488-490`, `subsequentTop` `:508`, `page1WindowHeight` `:789`, `laterPageHeight` `:850`, `lastWindowTop` `:870`, `notesPlan` `:873`, score windows `:984`, `:990`, `NotesColumn` `:1011`, `.score-window` `:1166-1167`. The e2e files are `e2e/one-page-frame.ts` (a body), `e2e/one-page-frame.test.ts`, `e2e-phone/one-page-frame.test.ts`. `page-fit.test.ts` is at `src/lib/page-fit.test.ts`, not in `components/Paper/`.

## 5. Commit A (`6db53262`): nothing moved

`pageFrame(header, footer, gaps)` in `page-config.ts`; `blankFrame` is built on it. TEXT, MELODY, and INSIGHTS compute their windows from it with today's numbers (MELODY passes its 18 and 8, INSIGHTS its 40). The 48 and 96 literals in `TitleHeader`, `RunningHeader` (both rules), `PageFooter`, `NotesColumn` (both roots), MELODY's `.score-window`, and INSIGHTS' `.column` are now `MARGINS`, set inline on each root. `TEXT_CONTENT` is derived: `left = MARGINS.horizontal - WORD_STACK_PAD - padLeft` (88). INSIGHTS takes `pageSize` from its caller (default letter) and `COLUMN` and `INSIDE` derive from it. `BlankState.svelte` held no literal (its offsets were already inline from the frame).

**INSIGHTS measures its drawn footer.** The probe read 66 (`before-1440.json`, `.page-footer` offsetHeight on every INSIGHTS page, which is what the legendless probe draws too); the drawn footer of page 1 reads 66 in the control after the change. Both numbers are 66.

**The control.** The **16 jobs** (two fixtures by three documents by two languages is 12, plus the Richter text and a forty-page text, each in both languages, is 4) were re-run on commit A's tree. `compare.py before-1440.json after-A-1440.json`: **0 differences** in page counts, first and last items per page, header and footer heights, hairline distance, window box (top, bottom, left, right), footer box, first glyph, and `.header-aside` width.

## 6. Commit B (`df00f148`): the moves

- **B-1.** MELODY's `TITLE_HEADER_GAP` (18) is gone; page 1's window top is 218 (was 220), a 16 px gap under the rule.
- **B-2.** MELODY's later pages follow the running header they draw (`runningHeight || HEADER_HEIGHTS_AT_LETTER.subsequent`, now 25, measured): window top 89 (was 93).
- **B-3.** `FOOTER_MAX_HEIGHT`, `GAP`, `HEADER_HEIGHTS` and INSIGHTS' `CLEAR` are deleted. Every pane reserves the footer's whole measured height (`FOOTER_FALLBACK`, 66, until it reports) plus `HEADER_GAP`. INSIGHTS charges each closed screen-only block (its summary's height and the gap before it) to the page it lands on, in `insights/insights-geometry.ts` (new; `InsightsPane.svelte` 674 to 668, `MarkupPane.svelte` 1234 to 1231; **ceilings lowered to 1231 and 668, none raised**).
- **B-4.** The Richter credit is the band's last line above the divider, in `.broad-legend`'s type, wording unchanged. `.pagination-cell` has `min-width: 74px` (the widest label, « Page 88 sur 88 », measures 73.2).
- `HEADER_HEIGHTS_AT_LETTER` is now `{ title: 105, subsequent: 25 }` (was 127 and 29): TEXT's title header measures 105. The title value is TEXT's first-paint fallback only.

**What moved** (`compare.py after-A-1440.json after-B-1440.json`; window boxes in sheet px; the sheet is 816 px wide at 390, 1024, and 1440, so these hold at every width):

| Where | Before | After |
|---|---|---|
| MELODY page 1 window (Sunless, Tchaikovsky; both languages) | top 220, bottom 920 | top 218, bottom 926 |
| MELODY pages 2 and 3 | top 93, bottom 920 | top 89, bottom 926 |
| TEXT, a plain page (Sunless p1) | bottom 920 | bottom 926 |
| TEXT, Tchaikovsky (footer reserve 90 from the whole document's legend) | bottom 910 on all 3 pages | bottom 902 on all 3 pages |
| TEXT, 160 typed lines, each of which wraps to two rows | 40 pages of 4 lines (8 rows) | 33 pages: pages 2 onward hold a fifth **line** (10 rows), not a fifth row. Mechanism: the window grows 6 px at the bottom (920 to 926, from the 80 px floor and the 8 px gap going to the measured 66 and 16); five lines of two rows need 10 rows, and the review's reading is that the old pages sat 0.16 px short of fitting them (I did not re-derive the 0.16). The last page holds line 159 |
| INSIGHTS, pages 2 and later | content ends at, e.g., Sunless EN p2 839, p3 815 | 895 and 759; **page counts unchanged** (3, 4, 6, 6); first and last blocks per page changed on Sunless FR p3/p4, Tchaikovsky EN p2/p3, Tchaikovsky FR p4/p5 |
| Richter page: divider from the sheet's bottom | 133 | **114** |
| Richter page: footer height, credit-row lines | 109, 4 lines | 111, 3 lines |
| Richter page: window bottom | 891 | 881 |
| **Every page of every document, both languages: the credit sentence under the divider re-breaks** | breaks at the old width | `.pagination-cell`'s `min-width: 74px` narrows the credit column (`1fr` beside it) by about 18 px in English (cell 56.0 to 74) and about 12 in French (cell 62.3 to 74), so the sentence breaks at different words on every page, still three lines. Nothing said in either language changes. |
| Richter credit, typography | small caps, in the row under the divider | upright sentence case, in the band above it (`.broad-legend`'s type, as ruled) |
| Every page of every document, both languages | divider 114 (133 on a Richter page) | **114 on all 105 pages read, credit row 3 lines** |

Page counts of the two score fixtures are the same in all three documents before and after. MELODY's first and last system per page are the same bars before and after (`pages-without-gaps` and `markup-pages-lose-no-bars` pass).

**The divider by measurement.** Language and page-count width never moved it: one-digit and two-digit labels (56.0 to 66.9 in English, 62.3 to 73.2 in French) all left it at 114 and the credit at three lines before the `min-width`. The Richter credit was the one mover. The `min-width` therefore changes no line count (all 105 pages after: three lines, 114); it is a guard, not a repair.

## 7. Pictures (`report-code-lane80_r1_2026-11-21/pic-{before,after}-*.png`, English, at 390 and 1024; the sheet is 816 px in both, scaled)

`before` is commit A's tree (visually identical to the base, per the control). Retakes were made from commit A's tree extracted with `git archive 6db53262` into the scratchpad and served on port 5180 with its own Vite cache directory (not the live `node_modules/.vite`), then stopped; the live server on 5173 answers 200. Port 5174 was in use by a process I did not start and I left it alone.

**Retaken.** (1) After commit B: the two Richter "before" pictures, from commit A's tree. (2) After the as-built review: `pic-{before,after}-melody-sunless-p1-{390,1024}.png`, with the "Voice line as written" chip dismissed (Escape; `ClefControls.svelte` says it recedes on Escape), because the chip floated over MELODY's title block in the first set. **p2 of the same two loads was retaken with them** (`pic-{before,after}-melody-sunless-p2-*`), since a load yields both pages; it was not asked for. I looked at `pic-after-melody-sunless-p1-1024.png`: the title block is clear and the chip is gone. I did not look at the other three of the four.

**Added** (review amendment 3): Tchaikovsky INSIGHTS, English, pages 2 and 3 (`pic-{before,after}-insights-tchaikovsky-p{2,3}-{390,1024}.png`), and one French page, page 4 (`pic-{before,after}-insights-tchaikovsky-fr-p4-{390,1024}.png`), the page whose blocks changed in the control.

One-line captions (measured numbers from `compare.py`; picture-read where stated):
- `text-richter` p1: the credit leaves the row under the divider for the band above it, in upright sentence case instead of small caps; divider 133 to 114; the row is three lines. Looked at the 1024 pair.
- `melody-sunless` p1: window 220 to 218 at the top, 920 to 926 at the bottom. p2: 93 to 89 at the top, 920 to 926 at the bottom.
- `text-sunless` p1: window bottom 920 to 926. `text-tchaikovsky` p1 and p2: window bottom 910 to 902.
- `insights-sunless` p1: no change to page 1's window; later pages re-flow (table above).
- **`insights-tchaikovsky` EN p2 (looked at the 1024 pair): before, page 2 ends with the m. 51 comment whole and the content ends at y 853.9 (DOM, 1440 run), leaving room above the footer. After, the content ends at y 904.9, nearer the footer's 16 px clearance, and the page ends with the heading "m. 78 · C♯4 · [u]" and ONE line of that comment's text, "This [u] on C♯4 sits just under your secondo passaggio and above the first resonance of"; the rest of the comment is on page 3.** That is the "comment newly cut across the break". Whether a label and one line is an acceptable last thing on a page is Dann's call; `paginate.ts` allows a cut that leaves two line boxes above it (the label counts as one), and I changed no rule. Not looked at: the page 3 pair, the French page, and the 390 pairs. The DOM shows the same page counts (6) before and after.
- The Richter case is a typed text ("sanguis atque caulis", plus two Russian lines), because neither fixture contains one.
- Where inside MELODY's window each system moved (the brief's "page 1's first system moves by 2 px") I did **not** measure: no PNG reader was available (Pillow in this Python fails to load). NOT ESTABLISHED; instrument: a per-system `getBoundingClientRect` run on both trees.

## 8. Done-when

- **Playwright, new:** `e2e/one-frame.ts` (the body), `e2e/one-frame.test.ts` (chromium, 1024 by 1366) and `e2e-phone/one-frame.test.ts` (390). In each, per language: a real score (Tchaikovsky: 3, 3, and 6 pages, so page 1 and later pages) and a typed text with a Latin word. Asserted on every page: sheet 816 by 1056; window right edge 720 and left edge 96 (88 for TEXT, see section 10); a gap under the rule of 16 (±0.5); the footer's box 96 to 720; at least 16 above the footer (TEXT, MELODY); every visible INSIGHTS `summary` ends at or above the window's bottom; the divider the same distance on every page of all three documents (114 on the Richter page); the Richter credit above the hairline and absent from the row below it; **every TEXT line number once, in order, and no `.verse-row` below its window** (20 lines on the score, 70 on the typed text). **4 of 4 in chromium at 1024 and 4 of 4 in the phone project at 390.** Positive control: MELODY's top gap set to 18 failed the test with "en markup page 1 gap under the rule 18.23"; restored (`git diff` shows only the lane's edits).
- **Existing Playwright, chromium, one run (10.4 min), 55 passed, 0 failed:** `markup-pages-lose-no-bars`, `print-pages`, `insights-page`, `pages-without-gaps` (its INSIGHTS reserve `40 + 16` is now `16 + 16`, and its fixture voice is now "Voice 1"), `key-change-melody`, `strophic-melody`, `one-page-frame` (lane 79's), `insights-no-score`, `melody-no-score-count`. The 15 percent rule reports two FULL pages with their numbers, both unchanged by this lane (the page's content bottom is the same before and after): Sunless INSIGHTS EN page 1 (16.4 percent; page 2's first item needs 148, the page has 116) and FR page 2 (36.5 percent; needs 477, has 286).
- **The eight gates, after commit B:** 1 `test:phonology` 462 passed (462); 2 `test:dictionary` 248 passed (248); 3 `@ilya/web check` 0 errors and 12 warnings in 5 files; 4 `@ilya/web test` **6801 passed | 1 skipped (6802)** (lane 79's final: 6795 | 1 (6796); six added); 5 `score-parser test` 904 passed | 5 skipped (909); 6 `test:blurb` 178; 7 `test:integration` 159; 8 `ratchets: OK.` with two ceilings lowered.
- **Gate 4: what was added or changed, and what each protected.** Added: `insights/insights-geometry.test.ts`, four tests (no riders is plain `paginate`; a closed summary and its gap move block 1 to the next page; a rider that fits is not charged to a page it does not land on; a rider rides with the part that ends its block). `blank-states.test.ts`: "every pane takes its window from `pageFrame` and none writes the margins as a number" (commit A); "none of the retired window constants appears in any page component" (the brief's named pins: `TITLE_HEADER_GAP`, `CLEAR`, `HEADER_HEIGHTS.`, `FOOTER_MAX_HEIGHT`, `GAP +`, `left: 96px`, `right: 96px`, `top: 48px`, `bottom: 48px`, with comments stripped and `GAP +` matched whole-word so `LEGEND_GAP +` in `TitleHeader` does not trip it). Changed, by design: lane 79's "TITLE_HEADER_GAP is still 18" now says it is gone and `firstFrame` is `pageFrame(headerHeight, footerReserve)`; its "80 px floor and GAP stay in Paper" now pins `footerMeasured || FOOTER_FALLBACK` and `frameOf(0).bottom`; its `has no floor` test reads `pageFrame` in place of the deleted `GAP`; `one-head-one-foot.test.ts:68` (**the brief said this line holds; the addendum's decision to measure INSIGHTS' drawn footer made it fail by design**) now pins no `footProbe` and `onheightchange={n === 0 ? (h) => (footHeight = h) : undefined}`; `page-fit.test.ts`: `windowFor` is `pageFrame`, the 80 floor case becomes the measured 66, expected windows 711 and 735 (were 719 and 729), gaps 23 and 26 (were 24 and 26), A4 778; "Paper reserves ... floored at the old constant" now pins no floor. `page-fit.test.ts:349-354`, the measure, slice, measure guard (no real TEXT footer reports its height), is untouched and still passes.
- **Comments rewritten:** `page-config.ts` (the header heights say what was measured and when; `HEADER_GAP` names the other side), `page-fit.ts` (the 8 px `GAP` comment: the 16 covers the dashed box, "a reason, not a prohibition"), `Paper.svelte` (why TEXT keeps its whole-document footer probe, beside it), `MarkupPane.svelte` (geometry, the 18, the page-1 window), `InsightsPane.svelte` (the clear space and the riders), `RunningHeader.svelte`'s "reserves a fixed head height" line (rewritten after the gates ran; a comment only).

- **Both Playwright projects in full (review amendment 5), on the tip of the lane (two runs, no test or source line changed to make any pass).** Chromium: **312 passed, 3 failed** (39.3 min). Phone: **66 passed, 4 failed, 1 skipped** (8.0 min). Every failure, with its file and line, what it said, and what it did on **commit A's tree** (served from a `git archive` copy on port 5180, with a scratch `playwright.config.ts` and storage state pointed at it, the failing files only):
  1. `e2e/repertoire-recedes.test.ts:27` (chromium): "strict mode violation: `getByRole('button', { name: /^Input$/i })` resolved to 2 elements", the band's INPUT toggle and the blank state's INPUT link. **Fails the same way on commit A's tree.** Cause is the blank state's INPUT link (lane 78 and 79), not this lane's geometry.
  2. `e2e-phone/input-views.test.ts:146` (phone): expected the line "Your score's sung words are in Lyrics", received "The words as sung, as the score sets them. Coloured words differ from the poem: ..." (a copy change). **Fails the same way on commit A's tree.**
  3. `e2e-phone/phrase-ends.test.ts:38` (phone): `[data-word-index="0-77"]` not found. **Fails the same way on commit A's tree.**
  4. `e2e-phone/relining.test.ts:74` ("y.", phone): "the drop leaves one line", expected 1, received 10. **Fails the same way on commit A's tree.**
  5. `e2e-phone/relining.test.ts:108` ("bb.", phone): expected line lengths `[7,7,7,7,7,4]`, received `[4,1,2,7,7,7,7,4]`. **Fails the same way on commit A's tree.**
  6. `e2e/heic-offline.test.ts:43` (chromium): "listen EADDRNOTAVAIL: address not available 127.0.0.2:4173": the test binds a second loopback address this Mac does not have. Fails in 0 ms, before any page loads. A re-run on the lane tree fails identically. I did not run it on commit A's tree beyond the first batch, where it did not report; it does not load a page, so it cannot depend on the geometry.
  7. `e2e/heic-fallback.test.ts:19` (chromium): "Execution context was destroyed, most likely because of a navigation" at 693 ms in the full run. **Passed on commit A's tree and passed on the lane tree when re-run on its own (283 ms).** A one-off in the full run; I did not find the navigation that destroyed the context. NOT ESTABLISHED why it failed once.
  Of the seven, none is in a file this lane touched, none reads a window or footer box, and the five that load pages fail identically on commit A's tree except number 7, which passed there. That is evidence these are not caused by the lane, not a proof for number 7.

## 9. INSIGHTS, swept (addendum item 1), and divergences found

Changed (commits A and B): the sheet (`pageSize`), the 96 literals, `CLEAR`, and the footer's measurement (above). Divergences found and left:
1. INSIGHTS' `.column` has no `bottom`: it is as tall as its blocks, where TEXT's `.page-content` and MELODY's `.score-window` have both. Its bottom is a pagination limit, not an element edge; `.part { overflow: hidden }` clips cut parts. Not changed: the done-when reads its left and width and the pin reads its summaries.
2. INSIGHTS' first-page header is 127 against TEXT's 105 and MELODY's 154 (its compass stave, and MELODY's key line and legend): content, not frame.
3. `+page.svelte` hands INSIGHTS and MELODY no paper size and passes `"letter"` to TEXT as a literal, so A4 is unreachable (QUEUE row 203, out of scope).

## 10. What I could not establish, with the instrument

1. **Brief says "both addenda"; the file has one.** Instrument: ask the desk whether a second exists.
2. **TEXT's left edge and the brief's "same left edge and the same column width".** TEXT's window element is at 88 with `padLeft` 4 and the word stack's own 4, so first ink is at 96 (step 0 reading, every page); MELODY's `.score-window` and INSIGHTS' `.column` are at 96. The test pins TEXT's box at 88, the others at 96, and all three right edges at 720. First ink for TEXT is reported (`measure.mjs`), not asserted, as the brief says; moving TEXT's box to 96 would move its ink to 104, and `WordStack.svelte` is untouched by order.
3. **Per-system positions inside MELODY's windows, before and after** (the brief's "first system moves by 2 px"). Not measured; instrument: `getBoundingClientRect` of `svg[data-system]` on commit A and B.
4. **A closed INSIGHTS summary landing within 16 px of the window's bottom, in a browser.** No fixture reaches it (the summaries sit at y 554 and 376). The arithmetic is covered by the four synthetic tests; the 16 px edge is not reproduced end to end. Instrument: a fixture with a closed disclosure at a page's end.
5. **`chargeRiders` has six passes and then keeps the last cut.** It settles on the cases tried; I did not look for one that does not.
6. **The first-paint jump (lane 79, section 5) and the pre-measure pass of TEXT's new 105 fallback.** Not re-probed (`jump.mjs`).
7. **A one-page score's MELODY page 2 (it draws no running header).** The measured `runningHeight` stays 0 and the 25 fallback stands; I did not draw a page that shows it.
8. **Not run:** Safari and a real iPhone. (The full chromium and phone projects were run after the review; section 8.)
9. **The name "Dann" in older fixtures: fifteen files in the tree carry `name: 'Dann'`** (`grep -l "name: 'Dann'"` over `apps` and `packages`). I changed `pages-without-gaps.test.ts` and wrote none. Not changed, listed: `e2e/borrowing-with-score.test.ts`, `calibrate-new.test.ts`, `insights-links.test.ts`, `insights-no-score.test.ts`, `insights-page.test.ts`, `melody-no-score-count.test.ts`, `one-page-frame.ts` (lane 79's), `voice-links.test.ts`, `voice-pane.test.ts`, `voice-stations.test.ts`; **`e2e-phone/insights-links.test.ts`, `e2e-phone/voice-stations.test.ts`, `e2e-phone/wizard-begin.test.ts`**; and two unit tests, `src/lib/voice/takes.test.ts` and `voiceTypes.test.ts`. Eight capture and repro scripts under `docs/sessions/` carry it too (`head-foot-shots`, `insights-r2-shots`, `measure-markup-blank_2026-10-12`, `report-code-lane79_r1_2026-11-21/capture.mjs`, `row93-rekey_2026-10-13`, `rows-78-79-shots` x4). The addendum's rule is about the lane's own fixtures; these are older.
10. **Working tree.** `docs/memory/QUEUE.md` and `STATE.md` were modified on arrival and are not mine; neither is committed. Nothing was pushed.
