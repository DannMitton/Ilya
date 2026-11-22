# Lane 80, QUEUE row 202: one frame for the content of TEXT, MELODY, and INSIGHTS

r2, 2026-11-21, by the Opus desk. r1 was reviewed by Fable 5.2: DO NOT SEND, four blockers, eighteen amendments. All eighteen are applied. r1 is kept and superseded.

Citations are to `e0ca61bf` unless named otherwise. **Lane 79 (row 201) is merging into that tree as this brief is written**; it adds one frame function to `page-config.ts` and puts the three blank states on it. Step 0 re-locates every citation against the tree you have. Where lane 79 already built something asked for here, say so and move on; never undo it.

## 0. What this is for

A singer moves between TEXT, MELODY, and INSIGHTS by tapping three words at the top of one sheet. The sheet must sit still under her hand.

**Ruled by Dann 2026-11-21 22:10** (`OPEN.md`, THE THREE DOCUMENTS SHARE ONE FRAME), transcribed as written: *"Ok I need you to rectify the inconsistencies among these documents. You uynderstand that their content vaires but margins and graphic elements like squircles should aligne properly and appear consistent. resolve these incongruencies, pelase. <Make Ilya look well-considered and professional"*. At 22:12, on the footer: *"Footers shoul be identicalk, and only the legeds that appear above the footre's horizontal divider should change to refelct their content."*

**He ruled this knowing it moves content.** Score pages will shift. That is accepted, and this lane's job is to show him exactly what moved and nothing else.

**Three claims in r1 were wrong and are corrected here.** (1) The legend does not move the divider: `.page-footer` is anchored at `bottom: 48px` and grows upward (`PageFooter.svelte:107-109`, and `:116-127` says so), so the band above the hairline leaves the hairline where it was. What moves the divider is the credit row beneath it. (2) TEXT's ink is not 4 px left of the margin: by the source's arithmetic the first glyph already lands on 96 (window left 88 at `page-config.ts:108`, plus `padLeft` 4 at `TitlePage.svelte:120`, plus the word stack's own 4 at `WordStack.svelte:211`); 92 is the hit box. (3) INSIGHTS ends its pages higher by about 18 px with the 66 px footer lane 78 measured, not 32.

## 1. The shape of the lane: two commits, one control between them

**Commit A changes nothing a singer can see.** Every pane reads one frame function, with today's values; the literals that duplicate the constants are replaced; dead constants go. The step 0 control is re-run and must show identical page counts and identical first and last items per page in all three documents. If anything moved in commit A, something was mis-derived: stop and report it.

**Commit B is every intended move**, and the pictures come from it. Nothing else belongs in commit B.

This split is diagnostic. Mixed together, the before-and-after pictures cannot tell an intended move from an accident of the refactor.

## 2. Step 0. Measure, record, re-locate

Nothing changes until this is reported.

**Five numbers nobody has read from a browser.** At 816 px sheet width:

1. `.running-header` offsetHeight. The CSS arithmetic gives 24.6; `page-config.ts:45`, `:55`, `:61`, `:69` record 29 from 2026-08-15, before `RunningHeader` was rewritten (commit `eec57e07`, 2026-10-11). Both cannot be right.
2. `.page-footer` offsetHeight on each document, on a page with no band and on a page with one.
3. **The divider's distance from the sheet's bottom edge**: `.footer-hairline`'s top, and `.footer-content`'s height, on every page of each document, in English and in French, with a one-digit and a two-digit page count, and on a TEXT page that carries the Richter credit.
4. **TEXT's first glyph**: a `Range` over the first text node of the first `.cyrillic-row`, in sheet coordinates, on page 1 and on a later page.
5. `.header-aside` clientWidth on INSIGHTS, and the computed `font-size` of `html`.

**The control.** For `src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` and `tchaikovsky-op38-3-voice.musicxml` (`e2e/pages-without-gaps.test.ts:21`): page count, and per page the first and last **line number** in TEXT, the first and last **bar** in MELODY, and the first and last **block** in INSIGHTS. Record which fixture, if either, gives two pages in TEXT, and whether either contains a Latin word (the Richter case).

**Re-locate** every citation in this brief against your tree and list any that moved.

## 3. The frame

Lane 79's function returns a blank page's window. This lane makes it every page's window, in all three documents:

- `top` = `MARGINS.vertical` + the header actually drawn, measured, + `HEADER_GAP`.
- `bottom` = `MARGINS.vertical` + the footer's **whole measured height** + `HEADER_GAP`. The band and the fixed block together are that height, so no split is needed for the window, and `onheightchange` keeps reporting the whole.
- `left` = `right` = `MARGINS.horizontal`.

**Which footer each pane measures stays as it is** (`Paper.svelte:98-100`, `:161`: TEXT reserves one footer measured over the whole document, on every page, because a page's own legend depends on which lines land on it, and `page-fit.test.ts:349-354` pins that no real TEXT footer reports its height; `MarkupPane.svelte:1000`, `:1014-1015`: MELODY reserves page 1's footer on every page, notes sheets included). r1's "plus the band that page carries" is struck: it would reopen TEXT's measure-slice-measure loop.

**First paint.** Removing the 80 px floor leaves a window 66 px too tall until the footer reports, which makes TEXT slice and MELODY paginate into the wrong window and then jump. Each pane uses a named fallback equal to the plain footer measured in step 0, the pattern `Paper.svelte:90` already uses for the header. Lane 79's rule that `BlankState` waits for a non-zero height stands; this fallback is for pages with content.

## 4. Commit A, where nothing moves

**A-1. Every pane reads the frame function**, with today's values preserved, so the control is identical. Where a pane's current arithmetic differs from the frame, keep its current value in commit A and move it in commit B, naming which.

**A-2. The literals that ignore the constants.** `TitleHeader.svelte:211-214`, `RunningHeader.svelte:64-67` and `:110`, `PageFooter.svelte:107-111`, `MarkupPane.svelte:1168-1169`, `NotesColumn.svelte:135-136` and `:147-148`, `InsightsPane.svelte:609-610`, and `BlankState.svelte:46` each write 48 or 96 as a literal and read `MARGINS` not at all. CSS in a `<style>` block cannot read a TypeScript constant: each component imports `MARGINS` and sets its own root element's offsets inline. No new global custom property. `InsightsPane.svelte:660-662`'s probe keeps `position: static`.

**A-3. `TEXT_CONTENT` becomes derived**, not a set of magic numbers: `left = MARGINS.horizontal - WORD_STACK_PAD - padLeft`, with the word stack's 4 px named once and `WordStack.svelte:211` untouched. `padTop` of 4 stays and is not folded into the frame.

**A-4. Dead constants go.** After this lane `HEADER_HEIGHTS` has one reader (`MarkupPane.svelte:511`), and `GAP`, `FOOTER_MAX_HEIGHT`, and `contentWidth`'s formula may have none. Delete each one that has no reader, and rewrite the comments that describe the old world: `page-config.ts:38`, `:59-65`, `:74-78`, `:80-84`; `page-fit.ts:20-25`; `MarkupPane.svelte:473-488`; `RunningHeader.svelte:70-73`, which still says MELODY reserves a fixed head height.

**A-5.** `page-fit.ts:23-25` says the 8 px `GAP` keeps the dashed VERIFY box, about 5 px below its word, off the footer. `HEADER_GAP`'s 16 covers it. Say so, so the comment is not read as a prohibition.

Re-run the control. Report it beside step 0's. They must match.

## 5. Commit B, the moves

**B-1. One gap under every rule.** MELODY's local `TITLE_HEADER_GAP = 18` (`MarkupPane.svelte:469`, used at `:471`) goes; the gap is `HEADER_GAP`, 16, as TEXT and INSIGHTS use (`Paper.svelte:90`, `InsightsPane.svelte:286`). `page-config.ts:26-40` already states this rule in Dann's own requirement. Repair the stale comment at `MarkupPane.svelte:464-468`.

**B-2. MELODY's later pages follow the header they draw**, in place of the constant 93 (`MarkupPane.svelte:511`, `HEADER_HEIGHTS.subsequent` 37 plus `GAP` 8; `page-config.ts:38` calls the 37 a number nobody measured). Use `runningHeight || HEADER_HEIGHTS_AT_LETTER.subsequent`, as `InsightsPane.svelte:288` does, because a one-page score draws no running header and pagination runs before page 2 exists; set that constant to step 0's measurement so the first pass and the measured pass agree.

**What B-1 and B-2 move:** `packages/score-parser/src/page-layout.ts:442-454` shares a page's slack between its systems up to `MAX_SYSTEM_GAP_FACTOR`, seats the first system on the window's top, and lets the last page inherit the established gap. So page 1's first system moves by 2 px and every later system on a full page moves by its own share. Report the before and after.

**B-3. INSIGHTS' clear space.** `InsightsPane.svelte:450` reserves `footHeight + CLEAR`, `CLEAR = 40` at `:378`, where the others reserve the footer plus 8 under an 80 px floor. **`CLEAR` goes only once the closed disclosures are counted.** The closed "N more observations" and "show keys that reach higher" blocks ride inside that 40 and are never charged to a page (`InsightsPane.svelte:414-418`, `:447`, `:468-473`); at 16 with them uncounted, a closed summary lands on or past the hairline. Charge each closed screen-only block's closed height, plus the gap before it, to the page it lands on, on screen and in print alike, so print keeps the screen's pages. If this cannot be done inside the 674 ratchet ceiling, stop and report the line count; do not ship 16 with the riders uncounted. The 80 px floor goes with the same step, since the footer's own height is measured.

**B-4. The divider sits still.** Ruled 2026-11-21 22:12. The divider's distance from the sheet's bottom edge is `MARGINS.vertical` + the credit row's height + its 8.5 px margin, and by source the credit row's height varies in three ways: the Richter credit, added inside the row on TEXT pages that show a Latin word (`PageFooter.svelte:59`, `:97`; passed per page at `TitlePage.svelte:152`, `SubsequentPage.svelte:103`); the language, the French credit sentence being longer (`i18n.ts:1030-1033`); and the page-count label's width, which sets the credit column's width through `grid-template-columns: 1fr auto` (`PageFooter.svelte:156-161`).

So:

1. **The band is not restructured.** The legend, the broad note, and the apparatus stay in flow above the hairline, and the window keeps reserving the footer's whole height. Taking the band out of flow is the pre-N.83 defect (`PageFooter.svelte:116-127`) and is forbidden here.
2. **The Richter credit moves above the divider**, as the last line of the band, in the broad note's type (`.broad-legend`, `PageFooter.svelte:213-219`), its wording untouched. **Decided by the desk 2026-11-21 22:2x under `CONTRACT.md` section 1 item 4 (anything under his name: say what you are doing and why; it stands unless he objects), and told to Dann in those terms.** The reason: a credit that grows below the line is exactly what makes the divider move, and his 22:12 ruling gives the line the job of sitting still.
3. **`.pagination-cell` takes a fixed `min-width`** wide enough for the longest label in either language (measure it; « Page 88 sur 88 » is the likely worst case). If that changes the credit's line count in either language, do not apply it and report the numbers.
4. **The divider's distance is one number per language.** If English and French differ, report both and pad neither to match the other.

**B-5. The pins, and the pictures.** See sections 6 and 7.

## 6. Done when

- **Playwright**, extending lane 79's files (`e2e/one-page-frame.test.ts`, `e2e-phone/one-page-frame.test.ts`, and their helper; confirm the names against the tree): a real score and a real text document open in all three documents, at 390 and at 1024, in both languages, page 1 and a later page, and every one of these holds to the pixel: the same left edge and the same column width; the same gap under the title rule and under the running header's rule; the divider the same distance from the sheet's bottom edge; the same sheet and margins. Measurements are in sheet coordinates, divided by the fit scale, since `PageFit` transforms the sheet under 1400 px. Assertions read the window element's box (`.page-content`, `.score-window`, `.column`), never first ink; first ink is reported from step 0, not asserted. Where a fixture gives one page in a document, use the other fixture; if neither gives two, report it and assert page 1 alone. Include a page carrying a Latin word so the Richter case is covered.
- **No content is lost.** For TEXT, across all `.paper-page` sheets, every line number appears exactly once and no `.verse-row` ends below its window. No end-to-end test of this exists today.
- **On every INSIGHTS page, every visible `summary` ends at or above the window's bottom.**
- **Gate 4 pins, named rather than numeric:** none of `TITLE_HEADER_GAP`, `CLEAR`, `HEADER_HEIGHTS.`, `FOOTER_MAX_HEIGHT`, `GAP +`, `left: 96px`, `right: 96px`, `top: 48px`, `bottom: 48px` appears in `Paper`, `TitlePage`, `SubsequentPage`, `MarkupPane`, `NotesColumn`, `InsightsPane`, `TitleHeader`, `RunningHeader`, `PageFooter`, or `BlankState`; and each of the three panes calls the frame function. A bare numeric match is not decidable: `InsightsPane.svelte:375`, `:613`, and `:623` hold a legitimate 16.
- Gates 1, 2, 3, 5, 6, 7 at their baselines (`brief-code-lane79-one-page-frame_r2_2026-11-21.md`, section 5); gate 4's count reported with every test added or changed and what each replaced one protected; gate 8 `ratchets: OK.` with no ceiling raised.
- The five measurements reported, and `page-config.ts`'s stale header-height comments rewritten to say what was measured and when.
- **Pictures:** page 1 and page 2 of `sunless-01-engraved` in TEXT and in MELODY, one INSIGHTS page, and one TEXT page carrying the Richter credit, each before and after, at 390 and at 1024. One line each naming what moved and by how much.

## 7. What breaks

**Pins to update, which fail by design:** `page-fit.test.ts:38` (`windowFor`, the floor and `GAP`) and the window-derived expectations that flow from it, with `:109` and `:122` holding while `padTop` stays; `page-fit.test.ts:348`, keeping `:349-354`, which is the measure-slice-measure loop guard; `page-fit.test.ts:377-381` only if the style strings change; `blank-states.test.ts:100-104` and `:109`; `e2e/pages-without-gaps.test.ts:82`, which hard-codes INSIGHTS' `40 + 16`; `one-head-one-foot.test.ts:69` holds, so keep the `footHeight` line it pins.

**Lane 79's own pins break by design and must be updated with it:** its "the frame function's name appears exactly once in each pane"; its pin on `Paper.svelte:89`'s expression; `blank-states.test.ts`'s assertion that `const TITLE_HEADER_GAP = 18;` exists, which flips to absent; the frame function's doc line saying a page with content never reads it; and lane 79's repaired comment at `MarkupPane.svelte:464-468`.

**A failure in any of these is a real defect, not a pin to move:** `e2e/markup-pages-lose-no-bars.test.ts` (a bar missing, drawn twice, or a system outside its window: `.score-window` is `overflow: hidden` at `MarkupPane.svelte:1170`, so a wrong window clips ink silently, and this is the one place MELODY can lose content); `e2e/print-pages.test.ts`; `e2e/insights-page.test.ts:107-119`; `e2e/pages-without-gaps.test.ts`'s 15 percent rule, where a page newly over the limit is reported with its numbers; `e2e/key-change-melody.test.ts:34` and `strophic-melody.test.ts:51`, which pin system counts that depend on width, so a failure there means a width moved and nothing in this lane should move one.

**Where a moved break could lose rather than move content:** MELODY's clipped score window; INSIGHTS' uncounted closed disclosures and `.part { overflow: hidden }` (`InsightsPane.svelte:643-645`); MELODY's notes, whose `lastNotesTop` (`MarkupPane.svelte:873-876`) is built from `contentTop` or `subsequentTop`, so updating one and not the other lands the notes on the last system, and `NotesColumn`'s `.commentary-window` is also `overflow: hidden`. TEXT's `.page-content` is `overflow: visible`, so an overrun draws over the footer and loses nothing, which is what the line-number assertion catches.

## 8. The same number computed elsewhere

Every site that computes a page window: `Paper.svelte:88`, `:89`, `:90`, `:93`; `TitlePage.svelte:120`; `SubsequentPage.svelte:88`; `page-config.ts:108`, `:110-113`; `MarkupPane.svelte:469`, `:471`, `:491-493`, `:510`, `:511`, `:792`, `:853`, `:873-876`, `:987`, `:993`, `:998`, `:1014`, `:1168-1169`; `NotesColumn.svelte:135-136`, `:147-148`; `InsightsPane.svelte:286`, `:288`, `:373`, `:378`, `:450`, `:576`, `:609-610`; `BlankState.svelte:46`; `TitleHeader.svelte:211-214`; `RunningHeader.svelte:64-67`, `:109-110`; `PageFooter.svelte:107-111`; `page-fit.ts:23-25`, `:57`; `TextFitProbe.svelte:99`. Tests that pin them are in section 7.

What depended on their agreeing: page breaks, which this lane is ruled to move, and only in commit B.

## 9. Constraints

- Runs on Dann's Mac, in the desktop app, on the branch the desk names when it starts, cut from `Shane` once lane 79 is merged. No commit to `Shane`, no pull request; Dann fast-forwards.
- Nothing under `docs/memory/` is written by the lane. The desk corrects `OPEN.md`'s account of the divider's mechanism itself; Dann's words there stand unchanged.
- **Strings: none.** No sentence changes in either language. Moving the Richter credit moves a line that exists; its wording is untouched.
- Ratchets: `MarkupPane.svelte` 1234 and `InsightsPane.svelte` 674 sit at their ceilings (`scripts/ratchets.json:16`, `:18`). Removing arithmetic should shrink both. Do not raise a ceiling.
- Gate 4's figure moved with lane 79; take it from lane 79's report.
- **The paper-size step is not in this lane.** `InsightsPane.svelte:162` hard-codes `PAGE_SIZES.letter` while TEXT and MELODY carry an A4 path, but `+page.svelte:4303` passes `pageSize="letter"` as a literal and passes none to `MarkupPane` (`:4385`) or `InsightsPane` (`:4352`), so A4 is unreachable and untestable in the app. QUEUE row 203.

## 10. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Report every item you could not settle, with its instrument. Known unsettled at the time of writing: every pixel in step 0; whether either fixture gives two TEXT pages or contains a Latin word; and whether the French credit sentence wraps to a second line at either page-count width.

Report to `docs/sessions/report-code-lane80_r1_2026-11-21.md` on the branch.

---

## Addendum, 2026-11-21 22:3x, on Dann's instruction

**His words, transcribed as written:** *"INSIGHTS was built after the other two and nobody threaded [its incidental differences] through. / MAKE. THEM CONSISTENT."* Said after the desk told him INSIGHTS takes no paper size because one line declares the sheet instead of accepting it. This addendum is the desk's, written after Fable's review of r1; its three items are desk amendments and Fable's as-built review reads them.

**1. INSIGHTS is swept, not patched.** Every way INSIGHTS differs from TEXT and MELODY that is not content comes into line in this lane, not only the differences this brief happens to name. Known, and each is already placed:

- the sheet, declared at `InsightsPane.svelte:162` as `PAGE_SIZES.letter` instead of taken from the caller, with `COLUMN` at `:373` and `INSIDE` at `:374` deriving from it (commit A, default letter, nothing moves);
- its own `left: 96px` and `right: 96px` literals at `:609-610` (commit A);
- `CLEAR = 40` at `:378` (commit B, with the closed disclosures counted first);
- **the footer's measurement.** Three mechanisms produce one number today: TEXT measures a probe built over the whole document's legend (`Paper.svelte:98-100`, `:161`), MELODY the drawn footer of page 1 (`MarkupPane.svelte:1000`, `:1014-1015`), INSIGHTS a static probe with no legend (`:406`, `:549-551`, `:660-662`). INSIGHTS passes no legend, so its probe and its drawn footer carry the same height: **INSIGHTS measures its drawn footer, as MELODY does** (commit A; the value is unchanged, and the report shows both numbers to prove it). **TEXT keeps its whole-document probe**, because `page-fit.test.ts:349-354` pins that no real TEXT footer reports its height and removing that guard reopens the measure-slice-measure loop. That reason goes in a comment beside it, so the next reader does not read it as drift.

Report every further INSIGHTS divergence you find, whether you changed it or not, with what it was and why.

**2. The ratchet does not stop this lane.** r2's "stop and report the line count" is replaced. `MarkupPane.svelte` (1234) and `InsightsPane.svelte` (674) sit at their ceilings (`scripts/ratchets.json:16`, `:18`). Where the work cannot fit, move the pane's geometry into a new module beside it (`insights/insights-geometry.ts`, `markup/markup-geometry.ts`) and import it. Never raise a ceiling, and never leave the work undone because of one.

**3. The deadline for a difference is this lane.** If something in the three documents differs and is not content, it is in scope here, whether or not it appears in any list above. A difference deferred is the failure this lane exists to end.

**4. No fixture carries Dann's name.** Lane 79's capture harness seeded `{ name: 'Dann', voiceType: 'baritone' }` (`../sessions/report-code-lane79_r1_2026-11-21/capture.mjs:8`), so its INSIGHTS captures read "INSIGHTS FOR DANN · BARITONE · CALIBRATED 2026-11-21" and he read it as a claim about himself; he is a bass and had never declared a type. Every fixture, seed, and capture harness in this lane uses a neutral name and never states a fact about him. Where a low male voice is needed, the type is bass. Recorded in `ENVIRONMENT.md`, A CAPTURE FIXTURE NEVER CARRIES DANN'S NAME.
