> Filed by the desk 2026-11-15 19:3x, verbatim as the helper returned it (its two-space indent removed). One Fable 5.2 helper in the desk's cloud workspace, on a read-only checkout of `cloud-lane-56` at `3ada754` (`/home/claude/lanes/lane56` there). Harness count: 358,790 tokens, 99 tool uses, 17.3 minutes, against a cap of 400k said to Dann. The helper's own figure, "about 300,000", is not the count. The desk has NOT re-read this report's claims in the tree as of filing; the four fixes it names went to the lane's session as the reviewer states them, each to be shown by a failing test before it is fixed.

# Review of lane 56, strophic lane A (cloud-lane-56 at 3ada754), as built

## 1. Verdict

**MERGE WITH FIXES.** One-verse output is proven byte-identical (I recomputed all 207 hashes from the base commit's own source and from the lane's), and the strophic path works on the lane's fixtures, but four defects sit on the strophic path, three of them visible on the page.

Fixes before merge:
1. The verse label lands at the system's left edge when a pass begins on a rest (`render-seam.ts:65-73`, `:95`).
2. The verse label over a tacet bar lands at the left edge in any system that does not begin at printed bar 0 (`render-seam.ts:76-82`, `:95`).
3. Two tacet bars that meet at a pass boundary: the first is drawn as a sliver (`staff-renderer.ts:1624-1639` with the new clause at `:766`).
4. The D8 test never exercises `renderScoreOf`'s answer; add the by-reference assertion (`strophic-byte-baseline.test.ts:58-63`).

Can follow the merge, each needing a ruling or another lane: the Loupe's system count, the time-signature control's binding in a mixed system, the inert second ending, and three small items in section 3.

## 2. The brief's requirements

| Requirement | Where built | State |
| --- | --- | --- |
| D1 no-Cyrillic rule | `packages/score-parser/src/verses.ts:22-44` | BUILT |
| D2 verse view; pass 1 takes the verse-1 view | `verses.ts:92-131`; gap bars `:138-145`; `render-score.ts:205-217`, `:236-238` | BUILT |
| D3.1 passes from repeats | `render-score.ts:97-161` (times `:106-111`, bar 0 `:112-114`, kept runs `:122-149`) | BUILT, one edge: with any ending in the song, every repeat's markers and every `ending` are stripped, kept or not (`:153`, `:160`, `:230`). No visible effect today, a hazard for lane D |
| D3.2 stacked verses, ruled stretch | `render-score.ts:164-183` | BUILT |
| D3.3 one verse returns the input | `render-score.ts:58-66`, `:187`, `:197` | BUILT (0 of 207 tracked scores leave it, my run) |
| D4 render score | `render-score.ts:201-352` | BUILT. The `~v` decline reads event ids only, not grace ids (`:188`) |
| D5 each verse built as verse 1 | `apps/web/src/lib/markup/melody-pages.ts:85-104`, `:137-162`; `MarkupPane.svelte:852-868`; bundle `:915-935` | PARTLY by the letter: later verses ride three channels (`melody-pages.ts:151-153`); `sylTypePreview` and `melismaPreview` are verse 1's only (`:154-155`). The renderer falls back to the event's own syllable (`staff-renderer.ts:945-946`, `:3147`), so I found no visible difference |
| D6 inert later passes | `render-seam.ts:33-49`, `:117-129`; `page-layout.ts:321-324`, `:406`, `:476`; guards `loupe-ink.ts:92-96`, `:112`, `:142-144`, `:235-236`, `:262`; `loupe.ts:347`; `selection-ring.ts:196` | BUILT. `data-verse` is on elements that name the event only (the lane says so) |
| D7 label, tag, multibar rest, seam | `render-seam.ts:85-114`; `staff-renderer.ts:756`, `:766`, `:1545`; `page-layout.ts:292` | PARTLY: defects 1 to 3 |
| D8 byte identity | `strophic-byte-baseline.test.ts`, `.json` | BUILT, with the gap in section 4 |
| Step 0 | report, baseline at 34f064e | BUILT |
| Step 1 | seven fixtures (six, plus `strophic-repeat-key` in Step 5); `strophic-fixtures.test.ts` | BUILT; fixture 1's introduction is three bars, as the brief allows |
| Step 2 | `verses.test.ts`, `sunless-verses.test.ts` | BUILT (test bodies not read by me) |
| Step 3 | `render-score.test.ts` | BUILT |
| Step 4a | `melody-pages.test.ts:47-152`; `e2e/strophic-melody.test.ts` | BUILT; three checks left NOT ESTABLISHED by the lane (Loupe frame, the two controls, `pageMetrics` with marks) |
| Step 4b | `melody-pages.test.ts:154-237` | BUILT, with the label defects untested |
| Step 5 | merge bf57a7f, report, pictures, PDF | PARTLY: the brief says look at every picture; the report lists several it did not open |

## 3. Defects, most serious first

1. **Label at the wrong place when a pass begins on a rest.** `groupLeft` looks for `<g data-event-id>` (`render-seam.ts:66`); a rest is drawn in an anonymous group (`staff-renderer.ts:2624-2639`), and the bar's `first` is its first event of any kind (`render-score.ts:337-338`), so the lookup fails and x falls to 0 (`render-seam.ts:95`). I ran the lane's own code on fixture 1 with the passage's first note made a rest: "Verse 2" moved from x = 198.43 to x = 0, and "Verse 3" from 489.11 to 0. The singer sees "Verse 3" above the start of a system whose tag reads "7 · verse 2". A verse that enters after a rest is a common shape.
2. **Label over a tacet bar, off the first system.** `tacetLeft(svg, i)` passes the slice-relative index (`render-seam.ts:95`); the markup carries the printed index (`staff-renderer.ts:2445-2446`). On the tacet fixture at page width 200 the label is at x = 0; at 624 it is at 442.1 only because that system begins at bar 0. The lane's one tacet picture is that lucky case.
3. **Sliver bar at a tacet pass boundary.** A tacet column's width is owed to the next note column (`staff-renderer.ts:1638`, spent at `:1661-1664`); a second tacet column opened straight after takes `BARLINE_ROOM` only and overwrites the debt (`:1626-1638`). In `step4b-tacet-desktop-en.png` the interlude's whole-bar rest sits between two barlines about one rest-glyph apart, beside a full-width rest bar. It reads as a mistake.
4. **Time-signature control can bind to the wrong bar (inference for the browser half).** `TimeSignatureControls.svelte:41-46` binds each drawn meter to the nearest `[data-hit]` to its right in the same system. With a meter change in the passage's last bar, my run shows a system `data-system="9-10"` whose head draws 3/4 for pass 3's bar, then only `data-verse-hit`, then the ending's live `m9-0-1`. Tapping that 3/4 would open the ending bar's meter. Not run in a browser.
5. **The Loupe's count** (lead a, section 5).
6. **The second ending has no live copy.** In both volta fixtures source bar 4 is printed only as a later-pass bar (my run: live copies 0, 1, 2, 3, 5; none for 4), by the brief's own rule (`render-score.ts:138`). The singer cannot tap the second ending, and its IPA comes from the fallback path with no Lyrics edits or pairings. The reports do not say this plainly. A ruling for Dann, not a build error.
7. **The Loupe and the page can disagree on a word (inference).** The Loupe draws from the notated score (`loupe-render.ts:92`), where a note that verse 1 holds carries a later verse's syllable; the page's pass 1 now prints nothing there. Lane B territory.
8. Small: the index line `markup.` stands before `lyrics.`, out of order (`i18n.ts:53`); the comment at `MarkupPane.svelte:588-590` says the render keeps the notated score, which is no longer true for a strophic song; `step5-volta-from-top-desktop-en.png` is a byte copy of `step5-volta-desktop-en.png`.

## 4. The byte baseline (D8)

- **What the test does.** For each tracked `.musicxml` under `apps/`, `docs/`, `tools/`, and `packages/` it parses, analyses with an empty profile, calls `paginateMelody` at 624 by 727, and compares a SHA-256 with the JSON (`strophic-byte-baseline.test.ts:58-63`, `:84-86`). A second test requires the JSON to name exactly the tracked scores minus a list (`:79-82`).
- **Exempt:** the seven paths in `FIXTURES_ADDED_BY_THE_LANE` (`:32-40`), because they did not exist on the base. The exemption is "new", not "strophic": `repeat-one-verse.musicxml` is exempt and not strophic.
- **Was the baseline regenerated? No.** The JSON's blob is `79f4f7f4` at 34f064e and at 3ada754; one commit touches it; 34f064e's parent is fb9d829e and it changes no code. I extracted fb9d829e's source with `git archive` and recomputed: 207 of 207 equal the JSON. The lane's source: 207 of 207. The switch `UPDATE_STROPHIC_BASELINE=1` (`:68-75`) would rewrite the file silently; git history is the only guard.
- **The gap.** The test passes no `verses`, so `paginateMelody` takes the notated branch whatever `renderScoreOf` answers (`melody-pages.ts:126`). The page always passes `verses` (`MarkupPane.svelte:862`). No committed test asserts by-reference for all tracked files, which the brief's D8 asks. It is true today: my run gives `path` notated and `score === parsed` for all 207, and none has two sung verses.
- **Not covered:** the music font path, acoustic marks, the IPA and Cyrillic channels, any other geometry. The lane's edits to shared drawing code are one clause and option plumbing, which I read (`staff-renderer.ts:756`, `:766`, `:1545`; `page-layout.ts:190-193`, `:292`, `:317-324`, `:406`, `:476`). The renderer clamps a system's top at 0 (`staff-renderer.ts:3410`), so the widened `viewBoxOf` pattern changes nothing for old output.

## 5. The four leads from Step 0

- **(a) The Loupe's "system N".** Measured in Step 4a: "m. 10 · system 4 of 4" on a six-system page. Not fixed; carried to Step 5's list for Dann. `Loupe.svelte` has no diff; it still collects `[data-system]` only (`:1054-1058`) and reports from that (`:1996-1997`), so both N and the total fall short. The Playwright test logs the tag and asserts only that the bar is found on the page.
- **(b) The two controls.** No later step exercised them; Steps 4a and 5 say NOT ESTABLISHED. My reading: `ClefControls.svelte:66` uses hits only to clip its tap area, so on a system that opens with later-pass notes the clef's box is not clipped and can take a tap aimed at the inert first note (inference). `TimeSignatureControls.svelte:41` is defect 4.
- **(c) `loupe.ts`.** One line changed in place (`:347`); 990 lines at d4a6543, c172ffe, 6aa626f, and 3ada754.
- **(d) The clause.** Built as named: `tacetRuns(parsed, breakAt?, offset = 0)` at `staff-renderer.ts:756`, the clause at `:766`. Callers: `page-layout.ts:292` (whole score) and `staff-renderer.ts:1545` (offset from `page-layout.ts:253`; options passed through at `staff-renderer.ts:1863-1866`). Both use printed indices of the whole score. Test: `melody-pages.test.ts:227-236`. Its side effect is defect 3.

## 6. The verse labels

- Keys added: `markup.verseLabel` and `markup.verseTag` (`i18n.ts:1988-1989`).
- Values, by code point, against `OPEN.md:3737`: "Verse %s" and "Couplet %s"; "%m · verse %v" and "%m · couplet %v", each with U+0020 U+00B7 U+0020. Substituted, they equal "Verse 2", « Couplet 2 », "12 · verse 2", and « 12 · couplet 2 » character for character. Pinned at `ratified-lines.test.ts:466-475`.
- Index: stated total 1,272; `stringKeys()` 1,272; sum of the per-prefix counts 1,272; 68 prefixes listed, 68 actual, no mismatch; `markup.` 2. One flaw: order (section 3, item 8).

## 7. The pictures (22 files; I opened 20 PNGs and rasterized the PDF)

| Picture | What it shows | Supports the report |
| --- | --- | --- |
| step4a-repeat-desktop-en | Six systems, no label or tag; systems open on 5, 9, 7, 5, 9; pass 2 begins mid-system 3 | Yes |
| step4a-repeat-phone-en | The same sheet at phone scale | Yes |
| step4b-repeat-desktop-en-p1 | "Verse 2" over bar 2 of system 3, "Verse 3" over the last bar of system 4; "7 · verse 2", "5 · verse 3" flush left | Yes |
| step4b-repeat-desktop-en-p2 | "9 · verse 3", three bars, final barline, commentary | Yes |
| step4b-repeat-desktop-fr-p1, -p2 | « Couplet 2 », « Couplet 3 », « 7 · couplet 2 », « 5 · couplet 3 », « 9 · couplet 3 » | Yes |
| step4b-repeat-phone-en-p1, -p2, -fr-p1, -fr-p2 | The same four sheets at phone scale, legible | Yes |
| step4b-tacet-desktop-en | Two rests with a barline between, "Verse 2" over the second, "3 · verse 2" on system 2 | Yes for what it claims; it also shows defect 3, which the report does not mention |
| step5-key-boundary-desktop-en-p1 | Flat at bar 7; courtesy flat closing system 3; a natural under "Verse 2" and under "Verse 3"; system 5 opens in C | Yes |
| step5-key-boundary-desktop-en-p2 | "9 · verse 3" with one flat in the head | Yes |
| step5-repeat-print-1, -2 | Low-resolution rasters of the two PDF pages | Yes |
| step5-repeat-print-letter.pdf | 2 pages, 612 by 792 pt; labels and tags present on page 1 | Yes |
| step5-volta-desktop-en | Ending 1 in pass 1; "Verse 2" above a plain "1"; ending 2; "6" | Yes |
| step5-volta-desktop-fr, -phone-en, -phone-fr | The same in French and at phone scale | Yes |
| step5-volta-from-top-desktop-en | Byte-identical to step5-volta-desktop-en (same md5) | Cannot show that the from-top fixture was loaded |

Where the engraving looks wrong or may mislead:
- No label collides with notes in any picture. The label floats high, above the bar number's level, about one and a half staff heights over the top line. Taste; the lane marks its band as its own judgement.
- Tagged numbers start at the system's left edge; plain numbers are centred on the clef. A small inconsistency.
- The tacet sliver (defect 3).
- Volta: system 2 opens on "1" and its bars are 1, 2, 3, then 5, with no sign of the skip; the next system's "6" is the only cue.
- Last system of the repeat fixture: the tag says verse 3, and two of its three bars are the ending. Nothing marks where a verse ends.
- No picture of the stacked fixture, and none with acoustic marks.

## 8. The reports' claims

**Checked and true:** 207 baseline entries taken on fb9d829e; no tracked score leaves the notated path; no `~v` in any tracked `.musicxml`; no diff in `vowel-resolver.ts`, `types.ts`, `Loupe.svelte`, or `analyze-per-verse.ts`; `sungVerseNumbers` has one app caller (`analyze-per-verse.ts:42`) and `analyzePerVerse` none outside tests; the printed orders for the repeat, volta, stacked, and tacet fixtures; every tag re-anchored at x = 0; line counts and ceilings at each step; the i18n counts; the Shane merge brought no code; `ratchets: OK`.

**Inexact:**
- "First commit: the extraction." d4a6543 also holds the strophic branch of `melody-pages.ts`, `render-seam.ts`, and the seam hook in `page-layout.ts`. Output was unchanged at that commit because `MarkupPane.svelte` did not yet pass `verses`.
- Step 3's figures (22 bars, labels on 8 and 14) predate the three-bar introduction; the built fixture prints 23 bars with labels on 9 and 15.
- Step 4b's tacet claim holds for the first system only (defect 2).

**The Playwright conclusion.** The report gives a table of outcomes, with no error text, command lines, or logs. On its word, seven of eight failures also fail on fb9d829e, and the other 245 tests passed on the lane; that supports "not the lane's" for those seven if the failures are the same failures, which the report does not show. For the eighth (`loupe-header`, "pressing a header button starts no drag") the evidence is one solo pass and no run on the base. It is a Loupe test, and the lane changed `MUSIC_MARK` and `loupe-ink.ts`, so "load flake" is not established. The sentence "none did" claims more than a partial base run can show.

**Could not check:** every gate count, the two `open-extract` timeouts, the `pageMetrics` numbers, the Loupe's "4 of 4", and Step 0's deleted D2 experiment.

## 9. Ratchets

| File | Count | Ceiling | Note |
| --- | --- | --- | --- |
| `staff-renderer.ts` | 3414 | 3414 | Was 3412 of 3427. File grew by 2; the lane lowered the ceiling by 13 |
| `MarkupPane.svelte` | 1353 | 1353 | Was 1362 of 1364; lowered by 11 |
| `i18n.ts` | 2597 | exempt | |
| `loupe.ts` 990, `page-layout.ts` 488, `selection-ring.ts` 406, `render-score.ts` 352, `loupe-ink.ts` 289, `index.ts` 225, `melody-pages.ts` 163, `verses.ts` 145, `render-seam.ts` 129 | | 1000 default | unlisted |

No ceiling was raised. Both listed files now have no room, so the fix for defect 3 has to fit in place.

## 10. Merge risks

- **Lane 56 into Shane (2c07ab7):** clean in a trial merge.
- **Lane 57:** one conflict, `apps/web/src/lib/i18n.ts:19`: "This file holds 1,272 keys." against "1,278". The resolved figure is 1,280, or `i18n-index.test.ts` fails. The two index lines (`markup.` at `:53`, `welcome.` after `watch.`) and the two key blocks merge cleanly. Lane 56 touches none of `HeaderBar.svelte`, `+page.svelte`, or `playwright.config.ts`; lane 57's shared `storageState` will cover lane 56's two new Playwright files.
- **Lane 58:** no textual conflict expected. The two `versionAccent=` lines are at `MarkupPane.svelte:1002` and `:1087` in lane 56 (1011 and 1096 on Shane), over 120 lines from lane 56's last hunk (ends near 875). `footer.attribution` is at `i18n.ts:1047` in lane 56 (1046 on Shane), far from lane 56's hunks at 19, 53, and 1987-1989. Lane 58's Step 4 edits `i18n.ts:19` again: after all three the total is 1,282. Deleting two lines leaves `MarkupPane.svelte` at 1351 of 1353, which is not a breach.

## 11. What I could not establish

- Anything that needs a browser: the Loupe's count and frame, both controls, real ink widths of the tags, clipping of a label near a system's right edge.
- Whether any real strophic score reaches Ilya in these shapes; da capo with two verses; an elided syllable in a later verse.
- Cost of rebuilding every later verse's analysis on each repagination (`melody-pages.ts:142-148` inside a `$derived`); not measured.
- Whether the baseline JSON would also hold with the music font and marks on.
- Whether the two volta pictures were taken from two fixtures.

## 12. What I read, and what I ran

- **In full:** brief r5; all seven step reports; `verses.ts`, `render-score.ts`, `render-seam.ts`, `melody-pages.ts`; the lane's diff to every existing source file; both baseline test versions; both Playwright tests; `OPEN.md:3736-3751`.
- **In part:** `unfold.ts`, `page-layout.ts`, `staff-renderer.ts`, `accidental-carry.ts`, `Loupe.svelte`, `loupe.ts`, `loupe-render.ts`, `ClefControls.svelte`, `TimeSignatureControls.svelte`, `melody-pages.test.ts`, `i18n.ts`, `i18n-index.test.ts`, `CONTRACT.md` (section 4), lane 57's diff, lane 58's brief (by grep), Fable's review of r4 (headings only).
- **Installed:** nothing. **Test suites run:** none.
- **Ran,** all from `/home/claude/reviews/lane56/`, with the `tsx` already on the machine and the lane's source read in place: `tsx d8.mts <tree> <json>` on the base extract ("entries=207 same=207 differ=0") and on the lane ("same=207 differ=0", "nonNotated-or-multiverse=0 notByReference=0"); `tsx seam.mts`, `tsx meter.mts`, `tsx i18n.mts`; `node scripts/ratchets.mjs` in the lane tree ("ratchets: OK."); `git merge-tree` in a scratch clone; `pdfinfo`, `pdftoppm`, and image crops into scratch. Both trees show a clean `git status` afterward.
- Nothing from memory was used as a fact in this report.

Rough count: about 300,000 tokens.
