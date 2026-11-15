# Review: brief-code-strophic-lane-a_r4_2026-11-15.md

r1, 2026-11-15, Fable. Read-only; no code changed, no git write (one read-only `git fetch origin cloud-lane-50`). Code lines are from `/home/claude/n199/ilya` at `Shane` `4e5b4ad9` unless marked "lane 50" (`origin/cloud-lane-50` at `8cf6e5c7`). Read in full: the r4 brief, r3, my r2 review, `unfold.ts`, `performance-order.ts`, `verses.ts`, `printed-marks.ts`, `page-layout.ts:100-467`, the 12:58 and 13:41 entries of `OPEN.md`, lane 50's diff of `page-layout.ts` and `types.ts`, lane 50's `key-change.ts`. Read in part: `MarkupPane.svelte`, `staff-renderer.ts`, `Loupe.svelte`, `loupe.ts`, `loupe-ink.ts`, `selection-ring.ts`, `vowel-resolver.ts`, `rebar.ts`, `types.ts`, `unfold.test.ts`, the scout packet sections 2 to 5, `CONTRACT.md`.

Terms I coined: "later-pass bar" (a printed bar whose events carry derived ids), "mixed system" (a system holding later-pass bars and other bars), "printed index" (a bar's place in the render score), "source index" (its place in the notated score). "Render score", "verse view", and "pass" are the brief's.

## Verdict

**SEND WITH AMENDMENTS.** Fourteen. The core design (a performance-order render score from `unfold`, derived ids, one paginated stream) is sound and is simpler than r3's: the page-1 window, `lastPage`, the short-last-system rule, and the final barline all work on one stream with no new code (`page-layout.ts:262`, `:300`, `:375-402`, `:461`). The faults are in what the design leaves unsaid. Four would put a wrong page in front of a singer: A1 (a third verse is never printed), A2 (stacked verses vanish when any other repeat is present), A3 (the bars after a second ending print as "verse 2" and go inert), and A7 (the Loupe names the wrong system for every bar after the passage).

## Amendments

**A1. D3.1: the pass count comes from the verses, not from `unfold`'s default.** `unfold` plays a backward repeat twice unless the file gives `times` (`unfold.ts:249`, `:622`; `types.ts:290`). A plain repeat over three stacked verses yields passes 1 and 2 only, so verse 3 is never printed, and Step 3's own test ("passage three times") fails on the fixture as described. This is a limit Dann did not ask for; 13:41 says "once per verse". Add to D3.1:

> Before `unfold` runs, on the lane's own copy of the markers: for each backward repeat that no ending governs, `times` is the larger of the file's `times` (default 2) and the count of sung verses with words inside that repeat's span. The analysis path (`MarkupPane.svelte:591`) is not changed, so MELODY can print three passes where INSIGHTS counts two; say so in the interim limits (lane C). Fixture 1 carries no `times` attribute.

**A2. D3: routing leaves verses unprinted, and a repeat from the top with endings flags.** (a) D3.2 applies only "without marks, or when `unfold` flags". A file with stacked verses and no repeat around them, plus any unvaried repeat elsewhere, takes D3.1, keeps no later pass, and falls to D3.3: verses 2 and up are not printed at all. (b) Endings with no forward repeat flag `volta-multi-span` (`unfold.ts:190`, `startRepeatCount !== 1`), although `unfold` itself returns to the top for a plain repeat (`unfold.ts:215`; `unfold.test.ts:50-52`). On D3.2 as written, the first ending's bars would then print in every pass with verse 1's words. Replace D3.2's opening and add:

> 2. **When D3.1 keeps no later pass and the score carries later verses** (no marks, a flag, or marks that do not enclose the verses): ...
> On the lane's copy of the markers, where endings exist and no bar carries a forward repeat, bar 0 takes one (the rule `unfold.ts:215` applies to a plain repeat). On the D3.2 path, a bar whose `ending.passes` does not include k is left out of pass k.

**A3. D3.1: "the span carries words" is undefined, and `unfold`'s pass number overruns the passage.** After the last ending nothing resets `pass` (`unfold.ts:229-264`; the reset at `:256-258` runs only on an exhausted backward repeat), so every bar from the second ending to the end of the song comes back as pass 2. I read this from the loop; no test in `unfold.test.ts` has a plain bar after a last ending (`:57-58` ends on the second ending's own bars). D4 reports "its pass" per bar and D7 tags by pass, so the ending of a volta song would carry derived ids, go inert, and read "· verse 2". On a jump return, pass is an occurrence count (`unfold.ts:574-578`), and "span" has no meaning there. Replace D3.1's second sentence with:

> A **later run** is a maximal stretch of consecutive entries of `unfold`'s order with the same pass p above 1. It is **kept** when some note in its source bars carries words for the p-th sung verse (D1's count); otherwise the run is dropped and those bars print once, as notated. Inside a kept run, a bar is a later-pass bar (derived ids, verse place p) only when its source bar was printed in an earlier pass or it carries `ending`. Every other bar of the run is outside the passage: it keeps its ids, takes no tag, and reads verse 1.

**A4. D4: the render score has more to rewrite than `measures` and event ids.** Each item below is keyed by source index or by event id and is read between the render score and the page:

- `VocalLineEvent.measureIndex`: `sliceScore` filters and rebases by it (`page-layout.ts:136-138`); D4 does not say it becomes the printed index.
- `tied.partnerEventId` and `slurs[].partnerEventId` (`types.ts:625`, `:636`). `slurEndsAcross` and `slursThrough` look the partner up in a map keyed by id (`printed-marks.ts:69-70`, `:90-91`). A later-pass slur whose partner pointer still names the pass-1 id reads as a slur leaving its system (`:75-77`). A pass-1 slur that starts in the passage's last bar and stops in the bar after the repeat is drawn through every system of the passes between (`:94-100`).
- Ties are joined to the next placed note by adjacency, with no pitch test (`ties-and-slurs.ts:133-143`). A tie that leaves a pass's last note would be drawn into the next pass's first note.
- `tempoMarkings` are sliced by source `measureIndex` (`page-layout.ts:133-135`); left alone, a mark on the ending lands on a later-pass bar. `keySignatures`, `timeSignatures`, and `clefs` carry the same field (`types.ts:371-456`).
- Lane 50's `graceNotes` hang on `principalId` (lane 50 `grace.ts:166-169`); with derived principals, a later pass loses its grace notes.
- D4 strips repeat and ending markers from every printed bar; a repeat that stays notated needs them for lane D.

Add to D4:

> Each printed event's `measureIndex` is its bar's printed index. In a later-pass bar, every `partnerEventId` (tie and slur) is rewritten to the partner's copy in the same pass; where the partner is not printed in that pass or in the outside bar that follows or precedes it directly, the pointer is removed, and a tie whose next printed note is not its partner is removed with it. The same test applies to pass 1's last and first bars. `tempoMarkings`, `keySignatures`, `timeSignatures`, `clefs`, and any other list keyed by `measureIndex` are rebuilt on printed indices, one entry per printed copy of the source bar. `graceNotes` of a later-pass principal are copied with the derived `principalId`. Markers are removed only from bars of a repeat this function unfolded. Fixture 1 gains one slur inside the passage and one tempo mark on the ending, each with a test.

**A5. D2: three gaps in the verse view.**

- A note with one lyric line carries no `versesInfo`; its verse is `syllable.verseNumber` (`vowel-resolver.ts:216-221`; `musicxml-parser.ts:823`). "Verse N's entry" must read both shapes, as `verseSyllableOf` does.
- `dictionMarks.vacatedTailEventIds` is keyed by event id and verse number (`types.ts:138`), and the resolver abstains by it for the verse it is asked for (`vowel-resolver.ts:653`; `diction-marks.ts:298`). A view that presents verse N as verse 1 and spreads the score carries verse 1's record: the verse-N resolver abstains on verse 1's vacated notes and misses its own.
- r3's Step 0 item on verse 1 is gone. On a note where verse 1 holds a slur and verse 2 sings, the note's own syllable is verse 2's (`musicxml-parser.ts:823`), and the renderer prints the note's own syllable (`staff-renderer.ts:3149`). Fixture 1's bar 5 is that case, so pass 1 may print verse 2's word beside verse 2's own pass.

Add to D2:

> "Verse N's entry" is the note's `versesInfo` entry for N or, with no `versesInfo`, the note's syllable when its `verseNumber` is N. The view's `dictionMarks` holds verse N's records only, renumbered to verse 1. Where a bar carries some later verse's words but not verse N's, verse N is left a continuation and the step report lists the bars. Step 0 establishes on a two-line test score what pass 1 prints today under a note where verse 1 holds a slur and verse 2 sings; if it prints verse 2's word, then in a score with a kept later pass, pass 1's events take the verse-1 view's syllables (ids unchanged), and the report says so.

**A6. D4 and Step 0: the `~` check fails after lane 50.** Lane 50's grace ids are the principal's id plus `~g1` or `~a1` (lane 50 `grace.ts:28-31`, `:149`). Replace "no id in the tree contains `~`" with:

> Step 0 checks that no event or grace id in any tracked score contains `~v`. A later-pass grace note's id is its derived principal's id plus the grace suffix (`m3-1-2~v2~g1`). The attribute rename matches on `~v<k>` anywhere in the value.

**A7. D6: `data-system` carries printed indices, and the Loupe reads it with a source index.** The wrapper writes `fromMeasure-toMeasure` of the paginated score (`page-layout.ts:455`). The Loupe parses every range (`Loupe.svelte:1055-1058`) and looks the held bar up in them (`Loupe.svelte:1996`; `loupe.ts:57-58`); the held bar's index comes from the corrected, notated line (`+page.svelte:1037`). For every bar after the passage the printed index is larger than the source index, so "system 2 of 5" names the wrong system or none. Also, "a system whose every sung event is a later pass" is vacuously true of a system of tacet bars in the introduction. Replace D6's second sentence with:

> A system that holds any bar that is not a later-pass bar keeps `data-system`, and its value is the first and last **source** index of those bars. A system that holds later-pass bars only carries `data-verse-system` with printed indices. Step 0 lists every reader of the value of `data-system` and `data-tacet`.

**A8. D6: "every sweep sees verse 1 only" is false inside a mixed system.** The rename hides later passes from lookups by id. It does not hide them from walks over a system's elements:

- `pageMetrics` walks every element of every `[data-system]` (`loupe-ink.ts:199`, `:215-252`) and skips hit rectangles by the name `data-hit` (`:229`). A renamed rectangle counts as ink 11 stave-gaps tall and can open the Loupe's frame for the whole song. The verse label counts as ink above the staff the same way.
- The same function takes a system's head from its leftmost `[data-hit]` (`loupe-ink.ts:255-256`), and `musicInk` gates on the first `MUSIC_MARK` (`loupe-ink.ts:102`; `loupe.ts:347`). In a system that opens with later-pass bars both land mid-system.
- `ipaBaselineOf` reads any `<text>` at `CYR_FONT_SIZE` as the Cyrillic row unless it carries `data-bar-number` (`selection-ring.ts:193-199`). D7 sets the label at that size.

Add to D6, and narrow the lane line "nothing in the Loupe" to "nothing in `Loupe.svelte`":

> The rename covers lookups by id. For element walks inside a mixed system, this lane may add guards in `loupe.ts`, `loupe-ink.ts`, and `selection-ring.ts` only: `rect[data-verse-hit]` and `[data-verse-label]` are skipped as ink; a system's head and its music gate also accept the `data-verse-` names. Step 0 lists every walk; Step 4 tests that `pageMetrics` gives the same `above` and `below` for fixture 1 as for a copy of it with lyric lines 2 and 3 removed, and reports any difference with its cause.

**A9. D6 and D7: name the seam, and cover the re-render.** The rename, the tag, and the label act on a system's markup after `renderSystemSlice` returns it. `paginateScore` calls that at two sites: every system (`page-layout.ts:299-304`) and the last system again at natural width (`:378-401`). A strophic song commonly ends on the passage, so the re-rendered last system is where later-pass bars are; if only the first site is covered, it ships live `data-hit` rectangles with derived ids. The label must change the system's `minY` and `height` before stacking (`:303`, `:318`). Add to D7:

> One function (in the lane's new `score-parser` module) takes a system's markup and its printed range and returns the markup with the rename, the tag, and the label applied, its `viewBox` grown for the label. `paginateScore` takes it as one optional option and calls it after both `renderSystemSlice` calls (`page-layout.ts:299`, `:378`) and for the wrapper attribute (`:455`). With the option absent, `paginateScore`'s output is byte-identical; D8 tests that.

**A10. D7: four placement gaps.**

- The number is centred on the clef (`staff-renderer.ts:2243-2244`, `text-anchor="middle"`), so a longer string grows leftward. D7 forbids ink left of the edge and also says the number stays where it is drawn; it gives no rule for when both cannot hold.
- When a pass begins on a system's first bar, D7 draws the label and the tag on the same bar. 13:41 says "tagged where needed".
- Consecutive tacet bars merge into one multibar rest unless the meter changes (`staff-renderer.ts:851-869`; packed at `page-layout.ts:274`). A passage that closes on a tacet bar and opens on one (a repeat from the top with a piano introduction and interlude) merges across the pass boundary: the label's bar disappears inside a rest counted across two passes.
- Every reader that names the bar number out does it by `data-bar-number` (`selection-ring.ts:196`; `loupe-ink.ts:107`, `:136`, `:228`; `Loupe.svelte:952`, `:1102`).

Add to D7:

> The tag is written inside the existing `<text data-bar-number>` element. If the centred string would cross x = 0, the element is re-anchored at its start with x = 0 and the step report says on which systems (DESK DEFAULT). A system whose first bar carries the label takes no tag (DESK DEFAULT). A multibar rest never spans a pass boundary: this needs one clause at `staff-renderer.ts:861`; say so in the Step 0 report before the edit, and add a fixture case and a test.

**A11. D5: say how the verses meet in one call.** `paginateScore` takes one `AnalyzedScore` and one options object (`page-layout.ts:254-258`). D5 names three channels; the renderer reads five by event id (`ipaPreview` `staff-renderer.ts:3150`; `cyrPreview` `:3149`; `sylTypePreview` `:1015-1016`, `:3168`; `melismaPreview` `:2424`, `:3148`; `withheldIpa`). `analyzeScore` keys `events` by the source id (`analysis-types.ts:153-154`). The Loupe draws from the bundle's score by source index (`MarkupPane.svelte:925-941`; `Loupe.svelte:1814`). Add:

> The new module returns one render score, one merged `AnalyzedScore` (verse 1's `global`; `events` is verse 1's plus each later verse's re-keyed to derived ids), and one options object whose five channels are verse 1's plus each later verse's under derived ids. Each later verse is analysed on `scoreInPerformanceOrder(view).score`. The bundle handed to `onpagesdrawn` (`MarkupPane.svelte:925-941`) keeps the notated `readingScore`, verse 1's `analyzed`, and verse 1's channels. Interim limit to add: a refrain's IPA in a later pass comes from the fallback pipeline, so it can differ from pass 1's where the singer edited verse 1.

**A12. Ratchets.** "Extract before adding" names no extraction, and `MarkupPane.svelte` has two lines of room (1362 of 1364, `scripts/ratchets.json`; `wc -l`). Add:

> The `paginateScore` call and its options (`MarkupPane.svelte:853-877`) move into the new `apps/web/src/lib/markup/` module in Step 4's first commit, with no change in output (D8 holds); the wiring then lands in the room that frees. After lane 50, `staff-renderer.ts` is 3412 of 3427 (lane 50 at `8cf6e5c7`); Step 0 re-measures.

**A13. D8, fixtures, and steps.**

- D8 hashes `paginateScore` alone. The lane's risk is the new decision in front of it. Add: "The baseline is taken through the function MarkupPane will call. For every tracked file other than the four new fixtures, that function returns its input score by reference; the test names any exception."
- Fixture 1: "Make the passage end on beat 2 of a system's width at 390 px if you can" is not testable. Replace with: "A test asserts that a later pass begins mid-system at desktop width and at 390 px; lengthen the introduction until both hold."
- Fixture 2: two files, one with a forward repeat and one repeating from the top (A2), each with one bar after the second ending (A3). A test asserts that bar keeps its ids and takes no tag.
- Step 3 gains tests for A1 (three passes with no `times`), A3, and A4.
- Step 4 is three designs and the wiring in one step. Divide it: 4a, the extraction of A12, D5, D6, and the wiring, with pictures; 4b, the label and the tag (D7, A9, A10), with pictures at both widths.
- Step 0 adds: the walks of A8; the readers of A7; confirm the corrected score still carries repeat and ending markers (I read `rebar.ts:359-381`, which keeps them).

**A14. "Computations this lane changes": name the sites (CONTRACT §4, `CONTRACT.md:87`).** The brief defers both to Step 0; the rule asks the brief to name them. Replace the two bullets' tails with:

> `sungVerseNumbers`: its one non-test caller is `analyze-per-verse.ts:42`; `analyzePerVerse` has no non-test caller at `4e5b4ad9` (grep). Sung order: MELODY's render score will differ from the three sites that call `scoreInPerformanceOrder` (`MarkupPane.svelte:591`, `InsightsPane.svelte:169`, `transposition-ruler.ts:302`) wherever A1 raises the pass count or D3.2 applies; phonation totals and the tessitura band then count fewer passes than MELODY prints, until lane C.

## Boundaries r4 adds that the ruling does not

- Two passes at most without `times` (A1) and no verses printed beside an unrelated repeat (A2a): unintended; removed by the amendments.
- D3.2's "a refrain after the last bar carrying a later verse's words prints once": a real boundary, stated plainly in the brief. See the question.
- The no-Cyrillic rule (D1) and "the bracketed courtesy number takes no tag": needed or harmless; no change.
- "Later verses cannot be tapped", "stress acutes in verse 1 only", "Lyrics shows verse 1 only": these follow the 01:44 lane split (`OPEN.md:3726`), not r4.

## Question for Dann

1. On a file with stacked verses and no repeat marks, a one-line stretch after the last multi-verse bar: print it once at the end (r4), or in every pass as a refrain? Recommendation: once, as r4 has it, because the file states no return and the report lists the songs; cost of the other path is a refrain invented where the composer wrote an ending.

## Cited lines found wrong

None at `4e5b4ad9`. Confirmed: `unfold.ts:150`, `:85-90`, `:103-111`, `:677`; `performance-order.ts:64`; `verses.ts:22`; `MarkupPane.svelte:606`, `:733`, `:855`; `Loupe.svelte:1131-1141`; the three ratchet figures; CONTRACT §8's three quotations (`CONTRACT.md:147-148`); `OPEN.md:2686`, `:3736`, `:3747-3750`. Three notes:

- The D3 quotation ("we need each verse to receive its own set of pitches...") is not in `docs/memory/`; grep finds it only in the r1 and r3 briefs, which cite a project file. `OPEN.md:2686` holds the short form only.
- "`staff-renderer.ts` 3426 of 3427" is true at the citation base and will not be true at the lane's base (A12).
- D4's "the renderer draws none today" holds: no `repeatStart`, `repeatEnd`, or `.ending` in `staff-renderer.ts` or `page-layout.ts` (grep).

## Sizing

**3 Code sessions; 4 if Dann's walk finds a fix round.** Judgement, not timed. r3 was 2 to 3. r4 drops r3's division of `paginateScore` and gains: the render-score module with A1 to A6, four to five fixtures, the seam function with its `viewBox` arithmetic (A9), the mixed-system guards (A8), one renderer clause (A10), and the extraction (A12). Likely split: Steps 0 to 3 in one session, 4a in one, 4b and 5 in one.

## What I could not establish

- I ran no code. Every failure mode above is read from the lines cited, not observed on a page.
- Whether MusicXML from Finale, Sibelius, MuseScore, or Dorico writes `times` on a repeat over three verses (A1 holds either way).
- How large the renamed hit rectangles' effect on the Loupe's frame is (A8); I read the skip and the rectangle's height rule (`loupe-ink.ts:210-211`, `:229`), not a measurement.
- Whether a derived-id event group reports an x the seam can read for the label (the brief's own Step 0 item).
- Whether the scan reader returns more than one verse or reads repeat barlines.
- Whether any tracked fixture has a real second verse (scout packet, section 6; not re-checked).
- Whether lane 50's key-change drawing reads well at a pass boundary. Its test reads per-bar snapshots (lane 50 `accidental-carry.ts:41-46`, `:30-34`), so the mechanism holds on a render score; no picture exists.
- Whether a supplied `<note id>` in a singer's own file can contain `~v` (`musicxml-parser.ts:903-925` refuses only duplicates and cursor-shaped ids).
- Whether the Loupe's courtesy accidentals on a second ending's first bar differ from the page's, since the Loupe reads the notated predecessor.
- How the browser breaks MELODY's sheets when printing a long unfolded song.
- The text of the E.36 record behind D3.
