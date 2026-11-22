# Lane 79, QUEUE row 201: one window for the blank page of TEXT, MELODY, and INSIGHTS

r2, 2026-11-21, by the Opus desk. r1 was reviewed by Fable 5.2 the same evening: DO NOT SEND, three blockers, fifteen amendments. All fifteen are applied here. r1 is kept and superseded (`brief-code-lane79-one-page-frame_r1_2026-11-21.md`).

Every line of code cited was read in the tree at `42df5011` on 2026-11-21, by the desk between 21:40 and 21:55 or by the review between 21:55 and 22:02.

## 0. What this is for

A singer moves between TEXT, MELODY, and INSIGHTS by tapping three words at the top of one sheet. The sheet is meant to sit still under her hand: one page, three documents on it. On an empty page it does not. Ilya's message sits at a different height and a different left edge on each of the three, so the page appears to shift as she moves.

Dann has asked for this three times: 2026-11-19, when he ruled the squircle; 2026-11-20 15:41 on his iPhone (*"I'm botherd that the page layout between TEXT, MELODY, and INSIGHTS is dissimilar. / I askled yesterday to establish consistency."*); and 2026-11-21 21:42 to 21:48 (*"Review the three images and explain to me why I see slight displacements in the squircle and teh flush left origin of text"*, then *"Please find one design template for all three surfaces and make them consistent"*, then *"I already asked you to make these title pages consistent. Why did you ignore me?"*). All transcribed as written; the 2026-11-21 words are in `../memory/INBOX.md` under those times.

Lane 78 built one component for the three blank states and left the window each page hands it alone. Where that came from, precisely: lane 78's r3 done-when at `:118` asked for each squircle "centred in its own page's window", its step 1 released Code from a common midpoint where the three headers differ in height, and Code's own decisions 3 and 4 (its report, section 2) then kept INSIGHTS' bottom formula and TEXT's text column. The three headers do not differ in height today, so nothing justified the 3 px. This lane closes it.

## 1. What is true today

One component draws all three squircles: `apps/web/src/lib/components/Paper/BlankState.svelte`. Radius, border, padding, gap, and type are therefore already identical. What differs is the window each page hands it.

| | call site | top | bottom | left |
|---|---|---|---|---|
| TEXT | `components/Paper/TitlePage.svelte:133-143`, left at `:139`, right at `:140` | `Paper.svelte:90`: `MARGINS.vertical + (titleHeader \|\| HEADER_HEIGHTS_AT_LETTER.title) + HEADER_GAP`, so 127 is used before the header is measured | `Paper.svelte:89`: `MARGINS.vertical + footerReserve + GAP`, where `footerReserve` is `Math.max(FOOTER_MAX_HEIGHT, footerMeasured)` at `:88` | `TEXT_CONTENT.left + padLeft` = 92 |
| MELODY | `markup/MarkupPane.svelte:1073-1082` | `:471`: `MARGINS.vertical + headerHeight + TITLE_HEADER_GAP`, a local 18 at `:469` | `:491-493`: `MARGINS.vertical + Math.max(FOOTER_MAX_HEIGHT, footerHeight) + GAP` | not passed, so 96 (`BlankState.svelte:46`) |
| INSIGHTS | `insights/InsightsPane.svelte:576` | `:286`: `MARGINS.vertical + headerHeight + HEADER_GAP` | `MARGINS.vertical + footHeight + HEADER_GAP` | not passed, so 96 |

Constants, all in `apps/web/src/lib/page-config.ts`: `MARGINS` 48 and 96 at `:21`, `GAP` 8 at `:24`, `HEADER_GAP` 16 at `:41`, `FOOTER_MAX_HEIGHT` 80 at `:84`, `TEXT_CONTENT { left: 88, right: 96, padLeft: 4 }` at `:108`.

The three footer numbers are three different elements: INSIGHTS measures a hidden probe (`InsightsPane.svelte:406`, `:549-551`), TEXT another hidden probe (`Paper.svelte:160-162`), MELODY the drawn footer (`:1087`). On a blank page all three are 624 wide with no legend, and all three measure 66. Step 5's browser test is what proves they keep agreeing.

`page-config.ts:26-40` states Dann's requirement that the negative space under the header rule be identical on every page, and says `HEADER_GAP` replaces TitlePage's local 18. It does not name `MarkupPane.svelte:469`, which still carries an 18, and `page-config.ts:64-65` says `HEADER_HEIGHTS` stays untouched because MarkupPane depends on it. So MELODY's 18 is live, deliberate, and not retired. The comment at `MarkupPane.svelte:467` calling it TitlePage's gap is stale: `TitlePage.svelte` holds no such constant.

**Measured.** Lane 78 measured the live render (`report-code-lane78_r1_2026-11-21/measurements.json`): squircle midpoints TEXT 545, MELODY 546, INSIGHTS 548 against a window midpoint of 548 on all three; title rule 154 and footer hairline 942 on all three; left 92 against 96; width 628 against 624. The footer measures 66 on all three blank pages, and that one number accounts for all three midpoints. INSIGHTS' arithmetic is the only one that lands on the centre the two drawn rules define.

## 2. What to build

### Step 0. The diff control

There is nothing to measure for reflow, because nothing that paginates changes. Prove it instead. The lane's diff leaves these lines unchanged, and the report shows the `git diff` that proves it:

- `Paper.svelte:88-93`
- `MarkupPane.svelte:469-471`, `:490-493`, `:510-511`, `:792`, `:852-853`, `:873-876`, `:987`, `:993`, `:998`, `:1014`
- `InsightsPane.svelte:288`, `:378`, `:450-454`, `:571`
- `page-fit.test.ts:36-39`

`InsightsPane.svelte:286` may be rewritten to read the new frame's top only if the value is identical.

Also record, for the three blank pages only, at 390 and at 1024 wide: measured header height, measured footer height, window top, window bottom. And run `e2e/pages-without-gaps.test.ts`, `e2e/markup-pages-lose-no-bars.test.ts`, and `e2e/print-pages.test.ts` before and after, reporting both runs. The fixtures those tests use are `src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` and `tchaikovsky-op38-3-voice.musicxml` (`e2e/pages-without-gaps.test.ts:21`).

### Step 1. One frame, one place

Add to `page-config.ts` one exported function that returns **the window of a blank page**, the space the squircle is centred in. It takes the measured header height and the measured footer height and returns `{ top, bottom, left, right }`:

- `top` = `MARGINS.vertical + header + HEADER_GAP`
- `bottom` = `MARGINS.vertical + footer + HEADER_GAP`
- `left` = `right` = `MARGINS.horizontal`

The same gap at both ends is what puts the squircle on the centre the title rule and the footer hairline define. Document it in the style of the `HEADER_GAP` comment at `:26-40`, naming this brief and Dann's three asks, and saying in one line that a page with content never reads this function.

### Step 2. The three blank states take it

Each pane computes the frame and hands it to `BlankState`:

- TEXT: `Paper.svelte` computes it from `titleHeader` and **`footerMeasured`**, never `footerReserve`, and passes it to `TitlePage` as one new prop. `TitlePage`'s existing `contentTop` and `contentBottom` props and its verse window at `:120` are unchanged.
- MELODY: from `headerHeight` (`:470`) and `footerHeight` (`:490`).
- INSIGHTS: from `headerHeight` (`:285`) and `footHeight` (`:388`).

`BlankState` takes one required frame prop of that function's return type, in place of `top`, `bottom`, `left`, and `right`, so no call site can hand it a partial window. `BlankState.svelte:46` loses the 96 defaults; the 96 lives in the function alone. Update `insights/links.test.ts:73`, which renders `BlankState` with `top: 0, bottom: 0` and a cast, to pass a frame, and say so in the report.

TEXT stops passing `TEXT_CONTENT.left + padLeft` and `TEXT_CONTENT.right`. The verse column exists so sung lines hang correctly and has no business placing a system message.

Repair the stale comment at `MarkupPane.svelte:464-468` in this step: it now says the 18 is this pane's own, that it governs only pages that carry a score, that the blank state takes the shared frame, and that changing it moves page 1 of every score.

### Step 3. Each squircle is centred on its own page's rules

Ratified 2026-11-19 (`ratified-blank-state-blurbs_2026-11-19.md:9`): the squircle is centred vertically in the space between the title rule and the footer rule. Where the three headers measure the same height, the three midpoints are therefore one number. Where a header is taller on one page, that page's squircle follows its own rule and is not dragged to a shared line. Do not change any header to make them agree.

Report every state in which the three headers differ, with the heights and what made them differ. By source INSIGHTS' blank header can carry a note the other two cannot (`InsightsPane.svelte:493` with `placeholder-line.ts:108-118`, against `MarkupPane.svelte:1057-1070` and `TitlePage.svelte:107-115`); whether it draws taller is NOT ESTABLISHED and is for you to find.

DESK DEFAULT, Dann's to overrule after his walk.

### Step 4. The first paint

With the 80 px floor out of the blank window, TEXT and MELODY would start with a footer of 0 and the squircle would sit about 16 px low until the footer reports. `BlankState` is therefore not drawn until both heights passed to the function are above zero, on all three pages. Report whether a jump was seen at load on each page at 390.

### Step 5. Pin it, in two places

**In gate 4** (`components/Paper/blank-states.test.ts`): replace the whole `it` at `:105-110`. Two of its four assertions (`:106` and `:109`) are already numerically equal to the new frame and would keep passing while three call sites each still computed its own window. The new pins assert that (i) each of the three `<BlankState` tags passes the one frame prop and contains none of `top=`, `bottom=`, `left=`, `right=`, `MARGINS`, `HEADER_GAP`, `GAP`, `TEXT_CONTENT`, `contentTop`, `contentBottom`; (ii) the frame function's name appears exactly once in each of `Paper.svelte`, `MarkupPane.svelte`, `InsightsPane.svelte`; (iii) `Paper.svelte` passes `footerMeasured`, not `footerReserve`. Add a unit test of the function's arithmetic. Add one pin for `Paper.svelte:89`'s expression, which nothing pins today.

`blank-states.test.ts:100-104` **stays**: it guards the score's first-page window, which this lane does not touch. Give it the assertion its own title promises and nothing asserts, that MELODY's `<BlankState` tag reads neither `contentTop` nor `contentBottom`.

**In Playwright** (`e2e/`, the chromium project and the phone project at 390): one test that opens the three blank pages, in English and French, with no voice and with a stored voice, and asserts the same left edge and the same width to the pixel on all three; and for each page that the squircle's midpoint equals the midpoint of that page's title rule's lower edge and footer hairline's upper edge within 0.5 px, since the squircle's own height can be odd. Where the three title rules sit at one height, it also asserts the three midpoints equal. Playwright is not one of the eight gates, so the report carries its run.

### Step 6. The comments that go stale

Rewrite each to the one-frame rule, concisely: `BlankState.svelte:12-13` ("no shared midpoint is forced"), `TitlePage.svelte:131`, `MarkupPane.svelte:1072`, `InsightsPane.svelte:575`, and the file header of `blank-states.test.ts` if its claim changes.

## 3. Done when

- The three squircles measure one left edge and one width in every state tried, and one midpoint in every state where the three title rules sit at one height, at 390 and at 1024, in both languages, with no voice, with a stored voice with samples, and with a voice type chosen and nothing sampled.
- Every squircle is centred between its own page's title rule and footer hairline, within 0.5 px.
- The gate 4 pins fail if any one of the three call sites goes back to computing its own window.
- Gate 4: every test at the baseline still passes or is replaced as this brief names. The report gives the new count and lists each test added, replaced, or changed, with what the replaced one protected. The count will not stay at the old baseline, and that is expected.
- Gates 1, 2, 3, 5, 6, 7, 8 at the baselines in section 5.
- No ratchet ceiling raised.
- Twelve captures as lane 78 took them (TEXT, MELODY, INSIGHTS, by phone and tablet, English and French), plus a `measurements.json` of the three windows and the three squircles.

## 4. The same number computed elsewhere

This brief adds one computation for the blank window and removes three. It changes no window that holds content. Every site in the tree that computes a page window, and its disposition:

| Site | Disposition |
|---|---|
| `Paper.svelte:88` (the floor), `:89` (TEXT's paginated bottom), `:90` (top), `:93` (`windowOf`) | held; `:90`'s value is read by the frame through `titleHeader`, the line itself unchanged |
| `TitlePage.svelte:120`, `SubsequentPage.svelte:88` (the verse window, `TEXT_CONTENT`) | held |
| `page-config.ts:108`, `:111-113` (`TEXT_CONTENT`, `contentWidth`), read by `TextFitProbe.svelte:99` and `page-fit.ts:57` | held |
| `MarkupPane.svelte:471`, `:491-493`, `:510`, `:511` | held |
| `MarkupPane.svelte:792`, `:853`, `:873-876`, `:987`, `:993`, `:998`, `:1014` | held |
| `InsightsPane.svelte:286`, `:288` | `:286` may read the frame's top only if identical; `:288` held |
| `InsightsPane.svelte:450` with `CLEAR = 40` at `:378` (INSIGHTS' paginated bottom, a third formula for that edge) | held |
| `InsightsPane.svelte:373`, `:609-610` (the column's left and right) | held |
| `InsightsPane.svelte:576`, `MarkupPane.svelte:1073-1082`, `TitlePage.svelte:133-143`, `BlankState.svelte:46` | changed, this is the lane |
| `page-fit.test.ts:38` | **held, and not touched.** It reproduces TEXT's pagination window, floor and `GAP` included, as `Paper.svelte:88-89` computes it. It is the pin that keeps those two lines where they are. Rewriting it to the new frame would pull TEXT's paginated window with it and move page breaks in every TEXT document |
| `page-fit.test.ts:348`, `:377-381`, `e2e/pages-without-gaps.test.ts:67-83`, `one-head-one-foot.test.ts:69` | held; they pin today's content windows and must still pass |

What depended on these agreeing: page breaks in paginated scores. There are four bottom formulas in the tree today. After this lane there are still three for pages with content, and exactly one for blank pages.

## 5. Constraints

- **Runs on Dann's Mac**, in the desktop app, from 2026-11-21 22:03. The branch is `cloud-lane-79`, as the session's prompt names it, cut from `Shane` at `e0ca61bf`, which carries this brief; push it when the work is done. No commit to `Shane`, no pull request; Dann fast-forwards. (The name is the cloud era's; the cloud lane's own reason was a credit that expired 2026-11-05, and the gates belong on the machine their baselines were measured on.)
- Nothing under `docs/memory/` is written by the lane.
- **Strings: none.** This lane adds, removes, and rewords no sentence in either language. If you believe a string must change, stop and report it.
- **The ratchets.** `apps/web/src/lib/markup/MarkupPane.svelte` is at 1234 against a ceiling of 1234, and `apps/web/src/lib/insights/InsightsPane.svelte` at 674 against 674 (`scripts/ratchets.json:16`, `:18`). Both edits are line-neutral or shrink the file. If either cannot be, stop and report the line count. Do not raise a ceiling.
- **The eight gates**, read from `~/Downloads/ilya-ship.sh` on 2026-11-21 (`:90-92`, `:182-190`), inlined because that file is outside the repository:
  1. `pnpm -C <repo> test:phonology` → `462 passed (462)`
  2. `pnpm -C <repo> test:dictionary` → `248 passed (248)`
  3. `pnpm -C <repo> --filter @ilya/web check` → `found 0 errors and 12 warnings in 5 files`
  4. `pnpm -C <repo> --filter @ilya/web test` → `6785 passed | 1 skipped (6786)` with numpy and scipy present, `6781 passed | 5 skipped (6786)` without them
  5. `pnpm -C <repo> --filter @ilya/score-parser test` → `904 passed | 5 skipped (909)`
  6. `pnpm -C <repo> test:blurb` → `178 passed (178)`
  7. `pnpm -C <repo> test:integration` → `159 passed (159)`
  8. `pnpm -C <repo> ratchets` → `ratchets: OK.`
- Lane 76 (`cloud-lane-76`, row 199) and lane 77 (row 200) are held and both touch MELODY's NOTES wording. This lane touches geometry only. Do not merge either branch into this one.
- `blank-states.test.ts:66` forbids `isMobile` in `TitlePage.svelte`. Nothing in this lane needs it.

## 6. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Report every item you could not settle, with the instrument you used. Three the desk and the review already know of, and you are not asked to solve them:

1. Whether any reachable blank state draws three headers of different heights (step 3 asks you to look, not to solve).
2. Lane 78 left five Playwright failures that exist on its base (`report-code-lane78_r1_2026-11-21.md`, section 9, items 1 and 2).
3. Whether `paginateMelody` spreads slack across page 1's gaps. It does not matter to this lane, because nothing that paginates changes.

Report to `docs/sessions/report-code-lane79_r1_2026-11-21.md` on the lane.
