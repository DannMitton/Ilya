# Report, lane 79 (QUEUE row 201): one window for the blank page of TEXT, MELODY, and INSIGHTS

**Sections 1 to 9 describe the first commit (`995f1647`), in which the squircle was centred between the rules. Dann's ruling of 22:55 replaced centring with an anchored top edge; section 11 records that, and where it contradicts an earlier section, section 11 stands.**

r1, 2026-11-21, by the Code lane. Brief: `brief-code-lane79-one-page-frame_r2_2026-11-21.md`. Branch `cloud-lane-79`, cut from `origin/Shane` at `e0ca61bf` after `git fetch origin`. Not a commit to `Shane`, no pull request, nothing written under `docs/memory/`, no string changed in either language **in the first commit (995f1647); section 10 records the one change made afterwards, on Dann's instruction**.

Read from: this checkout, Mac, branch `cloud-lane-79`. The working tree was dirty on arrival with one file, the brief itself (its section 5 first bullet already reads "Mac lane ... `mac-row201`"); I left that edit uncommitted and did not touch it. The branch name is the one your message gave (`cloud-lane-79`), not the one that bullet names. **`docs/memory/INBOX.md` and `docs/memory/OPEN.md` also changed in the tree while I worked (13 added lines), and I did not write them.** I left them out of the commit.

Setup note: `@tesseract.js-data/rus` was in the lockfile but missing from `node_modules`, so `pnpm dev` failed at `copy-underlay-model.mjs`. I ran `pnpm install --frozen-lockfile --offline`. It changed `node_modules` only; no tracked file moved.

## 1. What changed

- `apps/web/src/lib/page-config.ts`: `BlankFrame` and `blankFrame(header, footer)`, after `HEADER_GAP`. `top = MARGINS.vertical + header + HEADER_GAP`, `bottom = MARGINS.vertical + footer + HEADER_GAP`, `left = right = MARGINS.horizontal`. The comment names this brief and the three asks, and says a page with content never reads it.
- `components/Paper/BlankState.svelte`: one required `frame: BlankFrame` prop in place of `top`, `bottom`, `left`, `right`; the 96 defaults are gone; header comment rewritten.
- TEXT: `Paper.svelte` passes `frame={titleHeader > 0 && footerMeasured > 0 ? blankFrame(titleHeader, footerMeasured) : null}` to `TitlePage` (never `footerReserve`); `TitlePage` takes it as one new prop and draws the blank state only when it is non-null. TEXT no longer passes `TEXT_CONTENT.left + padLeft` or `TEXT_CONTENT.right`.
- MELODY: `{#if headerHeight > 0 && footerHeight > 0}` around the tag, `frame={blankFrame(headerHeight, footerHeight)}`. The stale comment at the 18 is rewritten as step 2 asks.
- INSIGHTS: `{:else if headerHeight > 0 && footHeight > 0}` and `frame={blankFrame(headerHeight, footHeight)}`.
- Comments rewritten (step 6): `BlankState.svelte` header, `TitlePage.svelte`, `MarkupPane.svelte` (both), `InsightsPane.svelte`, and the file header of `blank-states.test.ts`.

**TEXT's guard is in `Paper` and `TitlePage` rather than in the component, and the prop type there is `BlankFrame | null`.** `BlankState`'s prop is the plain, required `BlankFrame`, so no call site can hand it a partial window; the null exists only on `TitlePage`, which has to hold a value before the footer reports.

Line counts: `MarkupPane.svelte` 1234 to 1232, `InsightsPane.svelte` 674 to 674. No ceiling raised, none lowered. `pnpm ratchets` prints "these ceilings can be lowered" and `ratchets: OK.`; the MELODY ceiling (1234) could now drop to 1232, and I left `scripts/ratchets.json` alone.

## 2. Step 0, the diff control

`git diff -U0` of `Paper.svelte`, `TitlePage.svelte`, `MarkupPane.svelte`, `InsightsPane.svelte`, and `page-fit.test.ts` shows no change to any held line:

- `Paper.svelte`: the import line (`:7`) and one added line (`:193`, the `frame` prop). `:88-93` untouched.
- `MarkupPane.svelte`: the import, the comment above `:469` (five lines to two, so every later line moves up 3; the held lines' text is identical), the BlankState tag, and a `{#if}`/`{/if}` pair. `:469-471` and the footer lines are untouched in text.
- `InsightsPane.svelte`: the import and the blank branch at `:574-576`. `:286`, `:288`, `:378`, `:450-454`, `:571` untouched; I left `:286` as it was.
- `page-fit.test.ts`: not in the diff.

**Before and after, Playwright (chromium project):** `e2e/pages-without-gaps.test.ts`, `e2e/markup-pages-lose-no-bars.test.ts`, `e2e/print-pages.test.ts`.
- Before (this tree at `e0ca61bf`, before any edit): 34 passed, 9.0 min.
- After: 34 passed (the same 34, inside a run of 92; section 7).

**Measured, blank pages only** (`report-code-lane79_r1_2026-11-21/measurements.json`, 36 rows: 3 documents, 2 widths, 2 languages, 3 voice states; all in sheet px, so the sheet's own 0.4191 scale at 390 is divided out). At 390 and at 1024, in 34 of 36 rows: header 105, footer 66, window top 169, window bottom 130. The two exceptions are MELODY in French with a voice type chosen and nothing sampled, one at each width (header 127, window top 191; section 4). The values are the same at both widths because the sheet is 816 px wide at both.

## 3. What was measured against the done-when

All 36 rows: squircle left 96, width 624, to the pixel, on all three pages. Every squircle's midpoint is within 0.5 px of the midpoint of its own title rule (lower edge) and footer hairline (upper edge); the largest difference in the 36 rows is 0.19 px (MELODY, French, voice type chosen, 558.5 against 558.69). Where the three rules sit at one height (10 of the 12 states, a state being a width, a language, and a voice state), one midpoint: 547.5 (547.49 to 547.5).

Against lane 78's reading: midpoints 545, 546, 548 against a window midpoint of 548; left 92 against 96; width 628 against 624. All three are now 547.5, 96, 624. (The window midpoint here is 547.49, not 548, because I measure the rule's lower edge at 152.98 where lane 78 rounded it to 154; I did not reconcile the two readings. NOT ESTABLISHED why they differ by 1 px.)

**The pin works.** With `top` in `blankFrame` set to `+ 3`, `e2e/one-page-frame.test.ts` fails on "text midpoint against its own rules" (Received 1.51). Restored; the file is as written.

## 4. Step 3: states in which the three headers differ

One reachable state of the 36: **French, voice type chosen, nothing sampled (at both widths).** TEXT and INSIGHTS draw a 105 px header with the rule at 152.98. MELODY draws 127 px with the rule at 175.38, 22.4 px lower. Its squircle follows its own rules (midpoint 558.5) and is not dragged to the shared line, as the brief rules. What makes it taller, from the header's text: the subtitle line reads "PROFIL DE RÉSONANCES : VALEURS PAR DÉFAUT POUR UNE VOIX TYPE DE BARYTON, PAS ENCORE VOS PROPRES RÉSONANCES." That is a long line in the French. I did not instrument the wrap, so "it wraps to a second line" is inferred from the extra height, not observed.

Not tried, so **NOT ESTABLISHED**: whether INSIGHTS' blank header draws taller with a note (`InsightsPane.svelte:493`, `placeholder-line.ts:108-118`). None of the 36 states drew one; I found no way to reach it in the three voice states I used. Instrument: the 36 rows only.

## 5. Step 4: the first paint

Instrument: `report-code-lane79_r1_2026-11-21/jump.mjs`, which records the squircle's sheet-px midpoint on every animation frame from navigation, at 390, per page, in both languages (`jump.txt`).

**A jump was seen on all six**: the midpoint appears at **538.5** and moves to **547.5** (9 px) once, early in the load. The squircle is not drawn before both heights are above zero (the guard works: no value near the unguarded position was recorded), but the first non-zero measurement is not the settled one. I did not find which of the two measurements moves (the header's and the footer's both report after fonts load). I did not fix it: the brief asks for the guard and a report, and a stricter gate (wait for fonts) is a design call. **NOT ESTABLISHED:** whether the base tree jumped the same way before this lane; I could not run `e0ca61bf`'s render and this lane's side by side without a writing git command.

(An earlier version of the probe recorded the squircle's top, which moves 9 px with the squircle's own height as the font swaps, and produced a misleading signal. The midpoint is the figure above.)

## 6. Step 5: the pins

**Gate 4** (`components/Paper/blank-states.test.ts`, `insights/links.test.ts`): 6790 passed | 1 skipped (6791), with numpy and scipy present (the baseline is 6785 | 1 (6786)): five more tests.

- **Replaced:** the single `it` at the old `:105-110` ("the squircle's window is each page's own", four `toContain` assertions, two of which already equalled the new frame numerically). It protected only that each call site wrote its own expression. It is now three tests: (i) each of the three `<BlankState` tags passes `{frame}` or `frame={...}` and contains none of `top=`, `bottom=`, `left=`, `right=`, `MARGINS`, `HEADER_GAP`, `GAP`, `TEXT_CONTENT`, `contentTop`, `contentBottom`; (ii) `blankFrame(` is called exactly once in each of `Paper.svelte`, `MarkupPane.svelte`, `InsightsPane.svelte` (and not in `TitlePage.svelte`), and `Paper.svelte` reads `blankFrame(titleHeader, footerMeasured)` and no `footerReserve` inside it; (iii) one pin for `Paper.svelte:89`'s expression, `const contentBottom = $derived(MARGINS.vertical + footerReserve + GAP);`.
- **Added:** a `describe` of three tests for `blankFrame`'s arithmetic (134/130/96/96 for 70/66; no floor; one input, one window).
- **Changed:** "does not move the score's first-page window" (`:100-104`, kept) now also asserts MELODY's `<BlankState` tag reads neither `contentTop` nor `contentBottom`. "TitlePage draws the blank state for `enter` and `loading`" now expects `{#if !hasContent && emptyNotice !== 'quiet' && frame}`; it protected the exact `{#if}` line, which gained the guard.
- **Changed** (a different file): `insights/links.test.ts:73` passes `frame: blankFrame(0, 0)` in place of `top: 0, bottom: 0`.

The `<BlankState` tag is found by a scanner that counts braces, because INSIGHTS' tag carries a `>` inside an attribute (`blocks.length > 0`).

**Playwright** (`e2e/one-page-frame.ts` as the body, `e2e/one-page-frame.test.ts` and `e2e-phone/one-page-frame.test.ts` as the two entries, the second at 390): six cases per project (English and French, three voice states each). Each reads the three squircles against their own sheet in sheet px and asserts the same left and width to 0.05 px, each midpoint on its own rules within 0.5 px, and, where the three title rules sit at one height, one midpoint. Both projects: 6 of 6 passed. Playwright is not one of the eight gates.

## 7. The eight gates, and the rest

| Gate | Baseline | Result |
|---|---|---|
| 1 `test:phonology` | 462 passed (462) | 462 passed (462) |
| 2 `test:dictionary` | 248 passed (248) | 248 passed (248) |
| 3 `@ilya/web check` | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files |
| 4 `@ilya/web test` | 6785 passed \| 1 skipped (6786) | 6790 passed \| 1 skipped (6791) |
| 5 `score-parser test` | 904 passed \| 5 skipped (909) | 904 passed \| 5 skipped (909) |
| 6 `test:blurb` | 178 passed (178) | 178 passed (178) |
| 7 `test:integration` | 159 passed (159) | 159 passed (159) |
| 8 `ratchets` | `ratchets: OK.` | `ratchets: OK.` |

**Playwright, after** (chromium project, one run, 11.7 min): **92 passed, 0 failed.** The files: `pages-without-gaps`, `markup-pages-lose-no-bars`, `print-pages` (the three the brief names; 34 tests, the same 34 as before, all passing), plus `insights-no-score`, `insights-links`, `melody-no-score-count`, `core-loop`, `singer-paths` (the suites that read the blank pages, chosen because lane 78 changed them) and the new `one-page-frame` (6). The phone project ran `one-page-frame` only (6 of 6). **The full 372-test suite, and the phone project's other tests, were not run**, so lane 78's five known failures (brief section 6, item 2) were neither reproduced nor shown fixed; none of those five is among the files run here.

## 8. Twelve captures

`blank-{text,markup,insights}-{phone,tablet}-{en,fr}.png` in `report-code-lane79_r1_2026-11-21/`, a stored voice with samples, taken by `capture.mjs`. "Phone" is 390 by 844 at 3x with touch; "tablet" is 1024 by 1366 at 2x. Lane 78's `tablet` width is not stated in its report, so I chose 1024 to match the width this brief names. The files are named `markup`, not `melody` (the code's name; lane 78 named them `melody`). The captures are the viewport, not the full page, and I did not look at them: the numbers are the check, not the pictures.

## 9. What I could not establish

1. **Why my rule reads 152.98 where lane 78's read 154.** Instrument: both measurements.json files. Likely a rounding or a different edge; not settled.
2. **A note on INSIGHTS' blank header** (section 4). Instrument: none reached it.
3. **Which measurement moves in the 9 px first-paint jump, and whether the base tree did it** (section 5). Instrument: `jump.mjs`.
4. **Safari and a real iPhone.** Everything here is Chromium; Dann's report was an iPhone.
5. **The five Playwright failures lane 78 left on its base** (brief section 6, item 2): not run and not looked at (section 7).
6. **The wrap of MELODY's French subtitle** (section 4): inferred, not instrumented.
7. **`paginateMelody` and page 1's gaps** (brief section 6, item 3): not examined, as the brief allows.
8. **The e2e run is not the full suite.** Section 7 names the files run. The full 372-test suite was not run.

## 10. Addendum, on Dann's instruction after the lane: TEXT's blank state in two paragraphs

**This is the one string change in the lane and it was asked for in so many words.** `i18n.ts` `paper.blank` is split at the sentence boundary so that TEXT reads like MELODY and INSIGHTS: a blurb, then an ask.

- `paper.blank` keeps the first sentence: "TEXT transcribes the words you give it, syllable by syllable, into IPA." and « Le TEXTE transcrit en API, syllabe par syllabe, les mots que vous lui donnez. »
- New `paper.blank.ask` takes the second: "Add your score\u2019s words as LYRICS, or its source poem as POEM, in INPUT to begin." and « Ajoutez le texte chanté de votre partition comme PAROLES, ou son poème source comme POÈME, dans ENTRÉE pour commencer. » Both sentences are byte for byte as before; only the single space between them is no longer in either string. INPUT / ENTRÉE, the link, is now in the ask.
- `TitlePage.svelte:141`: `paragraphs={emptyNotice === 'loading' ? [t('dict.loading', language)] : [t('paper.blank', language), t('paper.blank.ask', language)]}`. The `loading` case keeps its one paragraph; `quiet` still draws nothing.
- The key index at the head of `i18n.ts` (`1,347` to `1,348` keys; `paper.` 3 to 4) is updated, because `i18n-index.test.ts` pins it. You did not list that file; it failed without it.

**Pins updated:** `blank-state.test.ts` (`:38` the key list gains `paper.blank.ask`; `:45-46` the INPUT / ENTRÉE link is now asserted on the ask, and the blurb is asserted to carry no link); `blank-states.test.ts` (`:34` the words table is two entries, the first sentence and the ask; `:87` the no-directional-word list gains the new key; `:185` the `paragraphs=` line). **Also changed, not on your list:** `e2e/core-loop.test.ts:41` and `:234` read the squircle's whole text as one string and failed on the split (`toHaveText` reads `textContent`, which joins the two paragraphs with no space); they now assert the two paragraphs as an array.

**New counts.**
- Gate 4: **6791 passed | 1 skipped (6792)**, with numpy and scipy present (was 6790 | 1 (6791) after the lane, 6785 | 1 (6786) at baseline). The one added test is the new key's row in the words table.
- Gate 3: 0 errors and 12 warnings in 5 files. Gate 8: `ratchets: OK.` Gates 1, 2, 5, 6, 7 not re-run: nothing they cover changed.
- `one-page-frame`, both projects: 6 of 6 chromium and 6 of 6 phone. The three midpoints agree: 547.5, 547.5, 547.5 in English; 547.49, 547.49, 547.5 in French; widths 624 on all three. In French with a voice type chosen and nothing sampled, MELODY is still 558.5 (the header difference in section 4 stands; its own midpoint, and the other two still 547.49).
- `e2e/core-loop.test.ts`: 21 of 21. `singer-paths`, `insights-no-score`, `melody-no-score-count`: passed in the same run (36 with core-loop's earlier two failures, which are the two now fixed).
- Captures: the three phone captures were retaken (`blank-{text,markup,insights}-phone-{en,fr}.png`; `capture.mjs` now takes `ONLY=phone`, and writes `measurements-phone.json`, 18 rows, beside the original `measurements.json`, which is not rewritten). Only the two TEXT files differ in bytes. I looked at `blank-text-phone-en.png`: two paragraphs, INPUT underlined as the link, the squircle centred. I did not look at the French or the other four.
- The two tablet captures and `measurements.json` predate the split, so the TEXT tablet pictures still show the one-paragraph state. **Not retaken: you asked for the phone ones.**

**Not established:** the 9 px first-paint jump (section 5) was not re-probed after the split; the squircle is now taller on TEXT, which does not move its midpoint, but I did not run `jump.mjs` again.

## 11. Second addendum, Dann's ruling of 22:55: the squircle's first line is the anchor, not the box's centre

**The anchor: `BLANK_ANCHOR = 315.2` px**, in `page-config.ts`, the distance from the window's top (the rule's `HEADER_GAP` below) to the squircle's top edge.

**Derivation, as ruled:** all 36 states (3 documents, 390 and 1024, English and French, no voice, a type chosen with nothing sampled, and samples), measured after TEXT's blurb and ask were split. **The smallest squircle is H = 86.6 px** (measured 86.59; INSIGHTS and MELODY in English). The largest is 127.19 (INSIGHTS, French). The window is 1056 - 169 - 130 = **757 px**. (757 - 86.6) / 2 - 20 = 335.2 - 20 = **315.2**. I kept the fraction rather than rounding to 315; every page gets the same number, so the edges still agree. The 169 and the 130 are the measured window top and bottom in the 34 states where the three headers agree (header 105, footer 66); in the one state where MELODY's header is taller (section 4) the window is 22 px shorter and the anchor is unchanged.

**What changed.**
1. `blankFrame(header, footer)`: `top` is now `MARGINS.vertical + header + HEADER_GAP + BLANK_ANCHOR`, the squircle's top edge. `bottom` is still the measured window's lower edge (no floor) and now positions nothing; the footer is still measured and still guards the first paint.
2. `BlankState.svelte`: the `1fr auto 1fr` grid is gone. `.blank-window` is a flex column; the squircle's top edge is the window's, it grows downward, and NOTES follows under it. No `grid-row` remains.
3. **Pins.** Gate 4 (`blank-states.test.ts`): the grid pin is replaced by "no `grid-template-rows` or `grid-row`, flex column"; the `blankFrame` arithmetic `describe` is rewritten (anchor value; the top does not read the footer; no floor; one header, one top, and a header 22 px taller moves it 22). **Playwright** (`e2e/one-page-frame.ts`, both projects): in place of the shared midpoint, in every state the three squircles share left edge and width (0.05 px), sit the same distance below their own title rules, and, where the three rules share a height (10 of the 12 states), share a top edge to 0.05 px; and each page's top, measured below its own rule, is the same in English and in French (the test now opens both languages in each voice state, in two pages of one context, and runs three cases per project rather than six). **The absolute pin:** the squircle's top is `16 + 315.2` below its rule, written as a literal in the test, because a test that imports the constant moves with it.
4. **The as-built amendments.** `blank-states.test.ts` now pins `Paper.svelte`'s whole expression, `frame={titleHeader > 0 && footerMeasured > 0 ? blankFrame(titleHeader, footerMeasured) : null}`, as one exact string; bans `...` and `top:` inside all three frame expressions; and pins the two-height guard in front of each blank state (`Paper.svelte`, the `{#if headerHeight > 0 && footerHeight > 0}` before MELODY's tag, the `{:else if headerHeight > 0 && footHeight > 0}` in INSIGHTS, and `TitlePage`'s `&& frame`). Stale comments fixed: `i18n.ts` (the "sentence pair" is two keys), `one-action.ts` (the sentence is two paragraphs), `e2e/core-loop.test.ts` (both), and the "centred" comments in `BlankState`, `TitlePage`, `MarkupPane` (twice), `InsightsPane`, and the file header of `blank-states.test.ts`.

**Positive control.** First attempt: I put 3 px into the anchor and the Playwright suite **passed**, because the test imported the constant and moved with the app; only the gate 4 pin failed. I rewrote the Playwright pin with the ruled number as a literal. Second attempt, `BLANK_ANCHOR` 318.2: the gate 4 pin fails, and `one-page-frame` fails in both projects ("en text top edge below its rule", received 3.003). Restored to 315.2 (`git diff` of the file shows only the intended change).

**What moved** (measured, 36 rows, `measurements.json`, replaced):
- The squircle's top edge is **484.19** on all three pages, in both languages, at both widths, in every voice state where the three headers agree (34 of 36 rows), and 506.19 on MELODY in French with a voice type chosen (the header is 22 px taller; the squircle follows its own rule and still sits 331.2 below it). **So "one top edge in every state" is true of the distance below each page's rule, not of the page's absolute height in that one state.** It is 330.81 against 331.21 there (0.4 px), because the header's height is measured as a whole pixel (`offsetHeight`) and its rule sits at 175.38; the pin allows 0.5 px for that comparison and 0.05 px where the rules agree. English and French tops are equal on every page.
- Left 96 and width 624 on every squircle.
- The squircle's midpoint is no longer shared. It now ranges with its height; the old pin ("one midpoint, 547.5") no longer holds and is not asserted. Lane 78's three centres (545, 546, 548) and the first commit's single 547.5 are history.
- TEXT in French starts at the same height as TEXT in English, which was the ruling's point.
- `MarkupPane.svelte` 1232 lines (ceiling 1234), `InsightsPane.svelte` 674 (ceiling 674); no ceiling touched.

**New counts.** Gate 4: **6795 passed | 1 skipped (6796)** with numpy and scipy present (6791 before this addendum, 6785 at baseline); four added, from one more `blankFrame` test and three for the frame expressions. Gates 1, 2, 5, 6, 7, re-run on this tree: 462, 248, 904 | 5 skipped (909), 178, 159, all at baseline. Gate 3: 0 errors and 12 warnings in 5 files. Gate 8: `ratchets: OK.` Playwright: `one-page-frame` 3 of 3 in each of the chromium and phone projects; `core-loop`, `singer-paths`, `insights-no-score`, `insights-links`, `melody-no-score-count`, `print-pages` together 53 of 53 (chromium). I did not re-run `pages-without-gaps` or `markup-pages-lose-no-bars` after this addendum; nothing in them reads the blank state, but I did not prove it.

**Captures.** All twelve retaken (`blank-{text,markup,insights}-{phone,tablet}-{en,fr}.png`, a stored voice with samples), with `measurements.json` (36 rows, replaces the earlier file; `measurements-phone.json` removed). I looked at `blank-markup-phone-fr.png` and `blank-text-phone-en.png` (the latter in the earlier addendum): the squircle sits above the middle, NOTES under it. I did not look at the other ten.

**Not established.** The 9 px first-paint jump (section 5) was not re-probed; with an anchored top edge it should now be the header or footer measurement moving the top by the difference, but I did not run `jump.mjs`. Whether 20 px is "one line of its own type" is the ruling's arithmetic, which I used as given; I did not check it against the squircle's line height.
