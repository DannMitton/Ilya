# Review of three Code briefs: QUEUE rows 78, 79, and 80 (r1, 2026-10-11)

Reviewer: Fable, as a subagent of the desk. Read: the three briefs; `OPEN.md` lines 2949 to 2957 (the nine headings named in the task) and `PRODUCT.md` lines 1123 to 1189 (the last five sections); `BRIEF-TEMPLATE.md`; `AGENTS.md`; row 77's report; and the code on `cloud-lane` at `b8b07f8` (clone at `/home/claude/dannmitton/ilya`, clean working tree, nothing changed). Every `path:line` below was read in that clone. Where I could not verify, I say NOT ESTABLISHED.

## Verdicts

| Row | Brief | Verdict | Amendments |
|---|---|---|---|
| 78 | `brief-code-row69-french-settled_r1_2026-10-11.md` | HOLD, then split into three and SEND each | 14 |
| 79 | `brief-code-pages-without-gaps_r1_2026-10-11.md` | SEND WITH AMENDMENTS | 9 |
| 80 | `brief-code-the-russian-line-by-its-underlay_r1_2026-10-11.md` | Already running: one correction to send now | 2 |

**The finding that matters most.** Row 80's section 2 states as established that homr's MusicXML does not carry note positions. It does: `third_party/homr-web/src/musicxml/generate-main.ts:22` and `:495-504` write an `<!-- imgpos: x, y -->` comment into every note, and Ilya already parses it (`apps/web/src/lib/omr/join-pages.ts:435-437`, `placeOf`; used at `metre-model.ts:97` and `metre-witness.ts:105`). Code is hunting inside `third_party/homr-web/` for a value that is already in the reading it has in hand.

## Strings: every string in row 78 checked character for character

I compared each English and French string in the brief against the ruling text in `OPEN.md` by script. All nineteen match exactly, including the typographic apostrophes in `insights.r2.frame` and `teacherC`, except one pair: the two French legend entries. The brief writes « d’après » (U+2019); `OPEN.md` line 2957 records « d'après » (U+0027) in both entries. No string in the brief carries a French colon, so the non-breaking-space rule (`i18n.test.ts:100-112`) is not engaged. No em dash in any of the three briefs.

---

## Row 78: HOLD, split, then send

### Why hold

Three different kinds of work are in one brief for one Sonnet session: thirteen string edits with tests (items 1 to 4, 8, 11 to 17), a new drawn mark with a legend and pictures (items 5 to 7), and a change to the renderer's spacing and system heights that moves line counts and pagination (items 9 and 10). The third kind can shift every Markup page of every song with a crossing, and row 79 measures pagination "after row 78". If items 9 and 10 land late or wrong, they take the string work down with them in one revert, and they confound row 79's before table.

### Where to split

- **78a, strings** (Sonnet): items 1, 2, 3, 4, 8, 11, 12, 13, 14, 15, 16, 17. Report section "Row 78a".
- **78b, the hollow head and its legend** (Sonnet): items 5, 6, 7. Report section "Row 78b". Depends on nothing in 78a except item 8's words, which it does not touch.
- **78c, the red ring and the room for it** (Opus, because it reasons about layout, viewBox height, and pagination): items 9 and 10. Must land before row 79's "before" measurements, or row 79's table is of a page that no longer exists. Report section "Row 78c".

The amendments below are numbered against the r1 text and apply to whichever part inherits the item.

### Amendments

1. **Item 4, the tests that pin "sung".** Change "The placeholder test in `comments.test.ts` becomes: no frame says "sung" or « chanté » for any vowel, in either language." to: "In `comments.test.ts`, the placeholder test at `:428-439` asserts today that every non-placeholder frame DOES say "sung" (`:438`); invert it so no frame says "sung" or « chanté » for any vowel in either language. The four whole-frame pins at `:148`, `:152`, `:363`, and `:379` carry "chanté" or "sung" and must be re-pinned to the new frames." Reason: the brief names one test; five assertions break, and Code that "fixes the test named" leaves four red.

2. **Item 1, the comments to update.** Add after "Text unchanged except item 2.": "Also `apps/web/src/lib/analysis/placeholder-line.ts`, whose header (lines 9 to 10) and two doc comments (`placeholderCommentSentence`, `placeholderTurnsSentence`) say PROPOSED; they are RATIFIED." Reason: the brief updates `i18n.ts`'s comments only; the module that builds the sentences keeps saying "proposed".

3. **Item 5, where the dashed outline lives.** Add after "Where row 69 draws a turning notehead as a dashed outline": "(`packages/score-parser/src/placeholder-mark.ts:36-46`, the `'outline'` style, drawn at `staff-renderer.ts:3052` in SMuFL mode and `:3054` in primitive mode; the ledger lines take their dash at `:3036` with `'stroke'`, which becomes `'tag'`). Rewrite `placeholder-mark.ts`'s header, which explains the dashed outline, and retire `PLACEHOLDER_OUTLINE` and `PLACEHOLDER_DASH_FINE` if nothing else uses them; update `placeholder-mark.test.ts`." Reason: without the lines, Code may add a circle beside the outline rather than in its place, and the header would then describe a mark that no longer exists.

4. **Item 5, the rim measurement.** After "measure the half-note head's rim at its thickest and thinnest from the glyph", add: "The font metrics Ilya loads give bounding boxes only (`staff-renderer.ts:678`, `bBoxNE`/`bBoxSW`), not stroke weight. Rasterise `noteheadHalf` at 3x and measure the rim, or read the outline from the font file; if either costs more than half an hour, use 0.12, 0.16, and 0.20 staff spaces as the three candidates (DESK DEFAULT) and say so." Reason: "from the glyph" has no path in the tree; Code could spend the session on it or invent a number.

5. **Item 5, opacity.** Add: "Keep `opacity="0.85"` as the filled head has (`staff-renderer.ts:3052`, `:3054`)." Reason: otherwise the hollow and filled marks differ in two ways, and the picture will not tell Dann which one he dislikes.

6. **Item 6, who draws it and when the filled entry shows.** Add: "The entries are drawn by `apps/web/src/lib/components/Paper/LegendItems.svelte`, which draws the stems entries from `packages/score-parser/src/stem-legend.ts`; add the two head icons there, and the flags to `buildMarkupLegend`'s options, set from `MarkupPane.svelte:791`. The filled entry shows whenever the page draws a turning head (the condition the stems entries use, `hasAcousticMarks`); the hollow entry only when at least one is hollow (DESK DEFAULT, as the brief says)." Reason: the brief states the hollow entry's condition and not the filled one's, and names no drawing surface.

7. **Item 6, the apostrophe.** Add: "The record in `OPEN.md` line 2957 has straight apostrophes in « d'après »; the strings here use U+2019, as `legend.ts:63` already does (« n’est »). Build with U+2019." Reason: the brief's section 5 says "where the spelling test asks for them", and I found no test in `apps/web/src` that enforces the apostrophe in legend copy (NOT ESTABLISHED that one exists); Code needs the decision, not a pointer to a test.

8. **Item 9, the corner.** Replace "keep the corner proportion the selection ring uses" with: "The outer ring's corner radius is `RING_RADIUS` plus the offset (6 + 4 = 10), so the two rings are concentric at the corners (DESK DEFAULT; `crossing-ring.ts:55` sets `rx` today to `RING_RADIUS`, which is a constant, not a proportion)." Reason: "proportion" has no referent in the code; `rx` is 6. Two readings exist (keep 6, or grow with the box), and they look different when nested.

9. **Item 9, the viewBox clamp.** Add: "`ringBox` clamps its top to the viewBox plus half a stroke (`selection-ring.ts:388-393`), and the renderer's headroom is one staff space above the highest ink (`staff-renderer.ts:3482`), so a red box 4 px larger will stand outside the viewBox on every crossing whose selection box is at the clamp. Widen the headroom in the renderer (the `top` term at `:3482`) for a system that holds a crossing, not by patching the viewBox in the page, so print and screen agree and `paginateScore` sees the new height." Reason: items 9 and 10 each say "widen the viewBox" without saying where; a page-side patch and a renderer-side change are two different builds, and only one survives printing.

10. **Item 10, where the reach is added.** Replace "In `columnAdvance` ... add the red ring's reach beyond that column's ink ... to the clearance" with: "`columnAdvance` (`staff-renderer.ts:1562`) receives `ColumnInk` (left, right, turningDisplaced; `:1461-1468`), not the event, but `columnInk` (`:1500-1504`) already receives the `AnalyzedEvent`, so `a.crossing` is known there. Carry the ring's reach as a field on `ColumnInk` and add it in `columnAdvance`'s ink term (`:1598-1603`) AND its text term (`:1577-1583`): the ring encloses the IPA syllable (`ringBox` reads `[data-ipa-of]`, `selection-ring.ts:310-317`), so where the IPA is wider than the head, the reach is measured from the syllable's edge, and the text term is the one that governs. A barline counts as neighbouring ink: where a crossing opens or closes a measure, `BARLINE_ROOM` grows by the same reach." Reason: added to the ink term alone, the ring still lands on the next syllable's IPA and on barlines, and Code will have met the brief's words while the picture shows a collision.

11. **Item 10, the approved SVGs.** Replace "the approved SVGs without one stay byte for byte" with: "`packages/score-parser/src/approval/__approved__/renderDemo*.svg` (six files, `staff-renderer.approval.test.ts`) stay byte for byte where the fixture has no crossing; say which of the six have one." Reason: "the approved SVGs" is not a path; whether any renderDemo fixture carries a crossing is NOT ESTABLISHED.

12. **Item 17, the lines.** Change `page-config.ts:204` to `:205` and `:181` to `:182`; add "the test that pins the old string is `apps/web/src/lib/components/Paper/one-head-one-foot.test.ts:45`." Reason: both citations are off by one; the test is findable but the brief says "every test" and there is one.

13. **Section 6, done when.** It covers items 1 to 4 only. Add, per part: 78a: pictures of the Insights frame line in both languages, of `insights.r2.cycles` in French at print width (the ruling at `OPEN.md` line 2955 leaves "fits one line" NOT ESTABLISHED and names pictures), and of the running head on Markup page 2. 78b: the three-stroke picture from item 5 (stave size and 3x, named `placeholder-shots/hollow-strokes.png` or like), and Markup page 1 in each language with both legend entries. 78c: the item 9 and 10 pictures as written, plus the before and after line counts per page and the gap table. Reason: the template asks for observable tests on every case; as written, Dann cannot judge 13 of 17 items by eye from what the report must contain.

14. **Section 5, the omr constraint.** Change "(row 77 is working there on the Mac)" to "(row 80 is measuring there on the Mac)". Reason: row 77 has reported; the live occupant is row 80.

Not amended, noted: the brief appends its report to row 69's report file. If split, each part needs its own report file or section name, or the three sessions write over one another.

Also noted, not a fault of the brief: `AGENTS.md`'s write protocol (v34) says no agent commits, while the brief says "Commit and push `cloud-lane` only". `CONTRACT.md:640` records Dann's amendment of 2026-10-02 02:37 permitting the cloud lane to push one dedicated branch. `AGENTS.md` has not been updated to say so.

---

## Row 79: SEND WITH AMENDMENTS

### Amendments

1. **Item 4 against item 6: the two rules collide.** Rule 4 caps the share-out at a maximum gap and leaves the rest at the foot; rule 6 fails any page more than 15 percent empty. A Markup page with two systems and a capped gap fails rule 6 by design. Add to item 6: "A page whose emptiness is what rule 4's maximum leaves is not a failure; the test reports it as CAPPED with the figure. Text's sixth-system concession (`PRODUCT.md`, the section's scope line) is exempt likewise and named." Reason: as written, Code either breaks the cap to pass the test or marks the test red and stops.

2. **Item 4, the Gould file.** Replace "Check `gould-vocal-engraving-rules_v6` for vertical justification first" with either the quoted rule (if the desk has it) or "No copy of the extraction is in the repository (grep of `b8b07f8`); `AGENTS.md` names v6 and two earlier briefs cite `claude/gould-vocal-engraving-rules_v7_2026-08-05.md` in project knowledge, which a cloud session cannot read (`ENVIRONMENT.md:4694`). Mark the maximum JUDGEMENT unless the desk pastes the rule into this brief." Reason: Code cannot reach the file from the cloud lane, and which version is current is NOT ESTABLISHED.

3. **Item 4, beyond the maximum.** Add after "up to a maximum gap": "beyond it the rest stays at the foot (`PRODUCT.md` rule 4)." Reason: the brief drops the half of the rule that says what happens past the cap.

4. **Item 7, where the method line is today.** Replace "the method line (`insights.method.typed` / `.untyped`, today above page 1's footer)" with "the method line (`insights.method.typed`, `.untyped`, or `.silent`, `InsightsPane.svelte:268-271`), which today prints in the apparatus of EVERY page (`:478`, rendered per page at `:564`), not page 1 only." Reason: two facts are wrong; the second one changes the arithmetic, since removing the line frees room on every page.

5. **Item 7, the method line's place and the phone.** Add: "The method line is the LAST item of the Notes section (`PRODUCT.md` rule 7). The phone's one-column flow (`InsightsPane.svelte:532-545`) has no pages and carries the apparatus in its one footer; the Notes section appears there too, at the end, and the footer loses the footnote and method line alike." Reason: the brief orders neither, and the phone would otherwise keep the footnote in its footer.

6. **Item 7, boxed or free.** Add: "The Notes section is unboxed (`group: 'free'`), in the small type `insights.r2.sourcesLine` uses (`singer-blocks.ts:356`, `small: true`) (DESK DEFAULT). `PRODUCT.md`'s organizing guide says a fifth kind of content is a case for Dann, not a fifth box; the desk is choosing 'not a box' and should say so to Dann in one line." Reason: Code could build a fourth squircle, which the page's own guide forbids.

7. **Item 2, Text's poem.** Add: "In Text, a stanza is treated as a paragraph for rule 2 (DESK DEFAULT; two lines minimum on each page). If Text sets no prose that can break, say so and move on." Reason: "apply wherever they set prose" leaves Code to decide whether verse is prose; that is a desk default, not Code's.

8. **Item 6, the fixtures.** Replace "a test over the fixture songs" with the fixture names. `sunless-01-engraved` is in `packages/score-parser/src/approval/__approved__/`; whether a Tchaikovsky Op. 38 no. 3 fixture exists in the tree is NOT ESTABLISHED (none found by name). Reason: a test "over the fixture songs" with one fixture is a test over one song.

9. **Section 3 and 6, sequencing with row 78c.** Add to section 3: "Take the before table only after row 78's red-ring items (9 and 10) are merged into the lane; they change system heights and line counts." Reason: otherwise the before table measures a page that row 78c will have moved.

Also noted: the brief names Sonnet "or Code on the Mac". This work rewrites pagination in three documents, with figure floating and line-level splitting, and the pictures alone run to about a hundred. Opus.

---

## Row 80: running; two things to tell Code now

1. **The positions are already in the MusicXML.** Section 2's second bullet is wrong. Every note homr-web writes carries `<!-- imgpos: x, y -->` (`third_party/homr-web/src/musicxml/generate-main.ts:22`, `:495-504`, from `symbol.imageCoordinates`), and Ilya reads it (`apps/web/src/lib/omr/join-pages.ts:435-437`, `placeOf`; `metre-model.ts:97`; `metre-witness.ts:105`). Step 1's question narrows to: in which image frame are `imageCoordinates` taken (the 400 dpi input, or homr's internal resize), and is the mapping back to the page linear. Code need not instrument the port for positions.

2. **400 dpi has a cap.** `apps/web/src/lib/reader/page-pdf.ts:52` sets `TARGET_DPI = 400`, but `renderScaleFor` (`:74-82`) reduces the scale for a page that claims to be larger than tabloid. For S and T, Code should state the scale actually used, not assume 400.

Everything else in row 80 checks: `tuplet-number.ts:37` says what the brief says; row 77's report says what section 1 quotes (bars, counts, "no stem direction, no cue size", `report-code-set3-four-below_r1_2026-10-11.md:100-106`, `:149-151`); N.135 is in `OPEN.md` at line 2741. Whether K and M are songs with a single Russian underlay is NOT ESTABLISHED from what I read (row 77 lists them only as "same" in the regression table, `:264`, `:266`).

---

## Could not establish

- Whether any test enforces U+2019 in legend or i18n copy (none found by grep; the brief's "spelling test" has no referent I could find).
- Which version of the Gould extraction is current, and where Code can read it.
- Whether a Tchaikovsky Op. 38 no. 3 fixture exists in the tree.
- Whether any of the six `renderDemo*` approved SVGs carries a crossing.
- The "eight gates" (named in rows 78 and 79): defined elsewhere; not checked here.
- Bozeman 2025's publisher and place (supplied by Dann); the ISBN's check digit I recomputed: 979-8-7651-6228-6 is valid.
