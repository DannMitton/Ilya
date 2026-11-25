# Read: N.204 phase 1b, unit l (`insights/`, `analysis/`, `melody/`, `tempo/`)

Fable 5.2, 2026-11-25. Read-only. Nothing was written to the tree, no `.bak` file was created, no git command other than `--no-optional-locks` reads was run. Filed verbatim by the desk.

## 0. What was read, and three things the desk needs first

**The tree.** Branch `Shane`, HEAD `66dfb5f9`, one commit past the `65196e65` the brief names. `git diff --stat 65196e65 HEAD` lists seven files, all under `docs/`; no file of unit l differs, so this read holds for both.

**Read whole, every line, 55 files, 13,106 lines:** all 29 non-test files of `insights/`, all 8 of `analysis/`, all 13 of `melody/`, all 5 of `tempo/`. The plan sizes unit l at "about 140k", which matches the non-test source, and the tests are unit t's in the plan's table.

**Not read whole, named exactly:** the 48 test files in the four folders (8,862 lines). Every `describe` and `it` title in all of them was read, and whole: `insights/placeholder-profile-pages.test.ts` and lines 86 to 125 of `insights/singer-blocks.test.ts`. The two data files were not read: `analysis/__golden__/adapter-snapshots.json` (9,826 lines) and `melody/strophic-byte-baseline.json` (210 lines).

**Three things first.**
1. **About 1,300 lines of `insights/` are drawn by nothing.** `Tessituragram.svelte`, `FitTable.svelte`, `cycle-dose.ts`, and all but four exports of `tessituragram-layout.ts` have no importer in the app (section 3, L1). Two of Dann's ruled measures, "half the singing" and the centre of gravity, are still computed on every page and drawn nowhere. That is a product question before it is a deletion (section 9).
2. **Both panes sit exactly on their ceilings:** `MarkupPane.svelte` 1,231 of 1,231 and `InsightsPane.svelte` 668 of 668 (`scripts/ratchets.json:16`, `:18`). 647 of MarkupPane's 1,231 lines are comment lines (ran, section 5), so a comment lane alone makes room there without a split.
3. **Ten behaviour defects**, ranked in section 2. The first is a sentence that contradicts the squircle under it.

---

## 1. The paragraph a developer needs

These four folders are where a parsed score meets a voice and becomes words. **`analysis/`** is the seam: `analyze-score-adapter.ts` turns a stored voice into the engine's snapshot (absence is omitted, never defaulted), `advice-resolver.ts` adds the five sourced advice cases to the engine's forecast as a post-pass, `watchlist.ts` turns per-note marks into ranked entries and also holds the watch band's copy and the key-naming functions, `gates.ts` decides which entries are worth saying (the one set of gates MELODY's box and INSIGHTS both call), and `placeholder-line.ts` names the vowels that rest on stand-in values. **`melody/`** is one large pane (`MarkupPane.svelte`) that runs the chain and hands the score to the package's renderer through five channels, plus the Transposition ruler (pure rules in `transposition-ruler.ts`, state in `transposition-ruler-state.svelte.ts`, two components for desk and phone) and the trailing notes (`notes-pages.ts`, `NotesColumn.svelte`). **`insights/`** runs the same chain again in `InsightsPane.svelte`, then splits into two independent deciders: `insights.ts` builds the numbers (range, tessitura, phonation, the figure's rows) and groups the gated watch list into findings; `comments.ts` decides the note comments from `noteConditions` by its own firing tests, `comment-text.ts` words them, `comment-sources.ts` cites them. `singer-blocks.ts` turns everything into an ordered list of blocks, `paginate.ts` breaks measured blocks into pages, and `SingerBlock.svelte` draws one block. `key-suggest.ts` and `key-lines.ts` are the key search and its words. **`tempo/`** puts the singer's tempo on the score object (`withSingerTempo`), so every reader that goes through `resolveTempo` follows it with no argument threaded. **Start by knowing three things no import shows:** the analysis chain is written twice, once per pane, and must be changed in both; INSIGHTS has two engines that decide what to say and neither knows the other; and `melody/` and `insights/` may not import each other (`scripts/ratchets.mjs:83-84`), which is why interfaces and constants are declared twice across that line.

---

## 2. Behaviour defects, tier 4, ranked by what a singer meets

Each is read from the code unless marked "ran". None was reproduced in a browser.

**D1. "Nothing in this piece is flagged for your voice." can print directly above a MOMENTS squircle of observations.** `noneFlagged` is true when the gated watch list yields no finding (`insights/InsightsPane.svelte:322`), and it appends `insights.findings.none` to the verdict (`insights/singer-blocks.ts:192-194`; the words are `i18n.ts:1860`). The observations come from a different engine, `noteComments` (`InsightsPane.svelte:235-245`), whose firing tests (`insights/comments.ts:220-253`) need no watch-list advice. An open vowel held past its turn near the secondo fires a comment (`comments.ts:228-246`) and carries no advice case (`analysis/advice-resolver.ts:333-339` lists only [i], [ɔ], [o], and the two exposure cases), so gate 2 drops it (`analysis/gates.ts:205-207`) and the findings are empty. The unit's own fixture builds exactly that page: `noneFlagged: true` (`insights/singer-blocks.test.ts:64`) with a comment (`:88`). **Whether a real song and voice reach it is NOT ESTABLISHED by a run**; the logic permits it. **Repair:** `noneFlagged` also requires no comment shown and none hidden by settings. One condition, in the pane. **Proof:** a characterization test in `singer-blocks.test.ts` pinning the paragraph with and without comments; the INSIGHTS families of the behaviour baseline. **A singer reads:** the sentence disappears when the page has observations.

**D2. The singer's tempo does not reach the hazard advice, although the control says "Your tempo. Every figure follows."** (`i18n.ts:1910`). The long-sustain test behind the cover, tracking, and turnover hazards reads the printed markings alone: `packages/score-parser/src/overlay-engine.ts:221-222` calls `isLongSustain(ev, parsed.tempoMarkings)`, and the package says so itself (`conditions.ts:327`: "it reads `parsed.tempoMarkings` alone"). `analysis/watchlist.ts:271-285` and `:434` do the same in a private copy. `conditions.ts:323-337` honours the singer's tempo and the estimate, and that feeds the comments and the gates' endurance demand. So at a slower tempo of the singer's own, INSIGHTS can say a note is sustained for four seconds while MELODY's box withholds the [o] cover advice for the same note; and a score with no printed tempo can never earn a duration-based hazard, only a fermata one. The test also reads one note, not its tie chain (`sustain.ts:98-102`). **Home:** unit b's file, consumed here. **Repair:** one sustain test, the one in `conditions.ts`, read by the engine and the watch list. **Risk:** changes which hazards print; `watchlist.test.ts:177`, `advice-resolver.test.ts:93-121`, and the adapter golden move.

**D3. The TEMPO receipt states a metronome figure as "printed" where the score prints a word.** `tempoSource` maps every provenance but `user` and `estimated` to `printed` (`tempo/singer-tempo.ts:34-36`), and the receipt shows a band only for `estimated` (`tempo/TempoReceipt.svelte:34`), so "Andante" reads as one rounded number, "printed". INSIGHTS says a range and the word for the same song (`insights/phonation-headline.ts:58-62`). The control pre-fills the same midpoint (`tempo/TempoControl.svelte:40`). **Repair:** show the band for `inferred` as for `estimated`. The three source words are ratified, so whether "printed" stands beside a band is Dann's.

**D4. A singer who typed no passaggi gets no MOMENTS at all, whatever type they declared, and the page does not say why.** `isTreble` reads the typed secondo only (`comments.ts:112-115`) and its comment says "Ilya asks no voice type" (`:66-68`), which stopped being true on 2026-09-30. `placeholder-profile-pages.test.ts:53-63` pins the consequence in its own words: "no comment can fire, on any score". `key-suggest.ts:75-78` decides the same kind of question from the declared type. Two modules, two tests of what voice this is. **Whether the page explains the silence is NOT ESTABLISHED.** Dann's to rule: which test governs.

**D5. "Use Ilya's estimate" is offered where clearing returns a printed tempo.** The button shows whenever a choice exists (`TempoControl.svelte:164-166`) and clearing falls back to whatever `resolveTempo` gives (`tempo/tempo-ui.svelte.ts:46-54`), which for a score with a printed metronome mark is the printed mark. Ratified string; the state is the defect.

**D6. Tapping a beat chip turns an estimate into "your tempo" at a figure the singer never chose.** `pickChip` converts `start`, which is the estimate's midpoint when no choice exists, and stores it (`TempoControl.svelte:83-91`). The receipt then reads "your tempo".

**D7. The pitch figure names a row by its lowest letter, not by the spelling the piece sings more.** `PitchSeconds.svelte:133` takes `spellings[0]`, sorted low letter first (`insights/insights.ts:622`). The rule Dann's QUEUE row 43 asked for, more sung time wins, lives in `spellingOf` (`tessituragram-layout.ts:101-110`), which only the dead figure calls; `spellingQuavers` is still computed for it (`insights.ts:611`, `:628`).

**D8. A typed decimal tempo is rounded without a word.** The field invites a decimal (`TempoControl.svelte:153`, `:96`), and `clampBpm` rounds (`singer-tempo.ts:74`).

**D9. The metronome note is drawn two ways in sibling sentences.** A printed mark uses text characters from `BEAT_GLYPH` (`insights.ts:749-762`); the singer's and the estimate's sentences use the notation face (`phonation-headline.ts:50`, `:68`). The singer's also joins with breaking spaces where `formatTempo` uses no-break ones (`insights.ts:761`). **Whether the serif face draws U+1D15E is NOT ESTABLISHED.**

**D10. `PieceKeyLine`'s hairline asks for a token that does not exist.** `var(--stone-200, #e7e5e4)` (`melody/PieceKeyLine.svelte:50`); `app.css` defines no `--stone-200` (ran: `grep -c` returns 0). It draws, from the literal, and no skin could reach it.

---

## 3. Findings, tiers 1 to 3

Format: name; smell; refactoring; tier; risk; proof.

### Dead code

**L1. `Tessituragram.svelte`, `FitTable.svelte`, `cycle-dose.ts`, and most of `tessituragram-layout.ts`.** Dead code. No importer in `src`, `e2e`, `tools`, or `scripts` (ran: grep). `SingerBlock.svelte:141` draws `PitchSeconds`; nothing draws the other two. From `tessituragram-layout.ts` only `STAVE_LINES` (`:192-195`) and the types `Measure`, `GlyphBox`, `GlyphOf` (`:35-38`) are live (`compass-stave.ts:17`, `CompassStave.svelte:16`). Remove Dead Code; Move the four survivors into `compass-stave.ts`. Tier 1. Risk: 526 lines of `tessituragram-layout.test.ts` and `cycle-dose.test.ts` test only this. Fourteen i18n keys become unreferenced and stay, under the plan's no-key-deleted default (for example `insights.fit.colTerm`, `insights.figure.halfMass`, `insights.flag.noThreshold`; ran). Proof: `tsc`, the suite, the INSIGHTS baseline families unchanged. **Gate on section 9's question first.**

**L2. What only the dead figure reads.** `TessituragramModel.longest`, `.quiet`, `.zones`, `.halfMass`, `.centre` (`insights.ts:233-247`), `FigureRow.tags` (`:220`), `VowelTime.flagged` (`:166`), `halfMassBand` and `centreOfGravity` (`singing-measures.ts:32-99`), `vowelChartRows` (`insights.ts:683-711`), `PAGE_ONE_FINDINGS` (`:804-817`), `crossingsRow`, `CrossingsRow`, `countCrossings` (`:92-100`, `:313-328`, `:351-362`), `accidentalParts` (`text-parts.ts:23-33`). Dead code, Speculative Generality. Remove Dead Code. Tier 1 after L1.

**L3. `Finding` is built in full and read for its length.** The live page reads `model.findings.length === 0` and nothing else (`InsightsPane.svelte:322`); anchor, mass, and seconds (`insights.ts:439-487`, `:780-781`) feed only L2's fields. Lazy Element. Replace with a boolean, or keep if D1's repair wants the list. Tier 1.

**L4. `metrics` in MarkupPane.** A `$derived` nothing reads (`MarkupPane.svelte:780-786`), under a 29-line comment (`:751-779`) whose last paragraph is false: it says the diction-mark fold has not landed, and `score-metrics.ts:44-53` says it has. With it go the `scoreMetrics` import (`:102`) and the unused `MARGINS` import (`:50`). Remove Dead Code. Tier 1. Frees about 37 lines under the ceiling. `score-metrics.ts` then has no app caller, only `tools/n168-frequency-run` and three tests; whether it moves to `tools/` is tier 2.

**L5. Small dead things.** `hasComments` (`InsightsPane.svelte:269-271`) and the `Italics` import (`:32`); `readoutFor` on both sides of the seam (`insights.ts:68-69`, `transposition-ruler-state.svelte.ts:133-136`); `matters`, kept "so a test pins that the two differ" (`key-suggest.ts:217-220`); `TITLE`, `TITLE_BASELINE`, the `'title'` kind (`tessituragram-layout.ts:52`, `:66`, `:201`); `watchBandLines` (`watchlist.ts:685-695`), called by a tool and a test and no longer by the app, which calls `gatedLines`. Tier 1.

**L6. `analyzePerVerse` has no caller but its test.** Fixed by Dann's ruling (plan section 4), so it stays. Its header (`analyze-per-verse.ts:22-24`) needs one line saying the live later-verse path is `melody-pages.ts:85-104`, which does the same work without it. Tier 1, comment only.

### Code that cannot do what it says

**L7. `resolveAdvice` computes a target it cannot use.** `advice-resolver.ts:372-376`: both arms of the conditional yield `hit.sourcedTarget`. The call to `modificationTarget` changes nothing, and the header's "read and confirmed" (`:351-355`) describes no effect. Remove Dead Code: `target = hit.sourcedTarget`. Tier 1. Proof: `advice-resolver.test.ts`, 25 tests.

**L8. `isAdviceBearing` returns true for every input** (`watchlist.ts:322-324`), kept for a clause that was since wired another way (`:333-335`). Inline Function. Tier 1.

**L9. Branches that cannot run.** `ph.length ?? ph.phonation.seconds` (`phonation-headline.ts:67`, `:73`): `length` is null only when timing is not a point (`insights.ts:541-542`). The `timing === 'none'` caption (`singer-blocks.ts:336`), which `phonation-headline.ts:15-16` says never occurs. The second `topicOn` test (`comments.ts:351`), already applied at `:319`. `frenchOwed`, false on all seven suggestions (`comment-text.ts:80-88`). The 300 px column default the inline style always overrides (`SingerBlock.svelte:505`, `:162`). `GATE_DEFAULTS.notableRare`, empty (`gates.ts:85`), and the `dynamic` demand, which never fires (`:91-95`). `COMMENT_DEFAULTS.rarity`, off, with `applyRarity` behind it (`comments.ts:71-74`, `:404-424`). Tier 1 for the first five; the last three are parked features with a ruling pending and stay, each with one line saying so.

**L10. `NoteComment` fields no sentence reads:** `phraseTop`, `ceiling`, `leap`, `descent` (`comments.ts:278-291`). `frameRuns` reads none (`comment-text.ts:361-399`). `comments.ts:278` says comments 2 and 3 name the phrase top; `comment-text.ts:11-12` says the phrase's top no longer prints. One of the two is false. Tier 1.

### Structure

**L11. The analysis chain is written twice.** `MarkupPane.svelte:503`, `:545`, `:565-609`, `:724-749` and `InsightsPane.svelte:169-204` are the same ten derivations. `InsightsPane.svelte:25-26` says so: "repeated rather than shared". One difference today: Insights passes `intake` to the adapter and Markup passes `undefined` (`:169` against `:545`); the package reads intake nowhere (ran: grep), so the two agree, by coincidence of today's code. Duplicated Code. Extract Function into `analysis/`, one pure `songAnalysis(inputs)` returning the chain's values, each pane keeping its `$derived` wrappers. Tier 2. Risk: reactivity granularity; one function recomputes more per change than ten deriveds. Proof: `performance-order-seam.test.ts`, `insights.test.ts:609` ("Insights says what Markup says"), the MELODY and INSIGHTS baseline families.

**L12. `watchlist.ts` holds three unrelated things.** The model and its build (`:103-515`), the watch band's copy (`:545-695`), and how any key is named (`keyTonic`, `keyName`, `:567-594`), which the ruler imports (`transposition-ruler.ts:31`, `transposition-ruler-state.svelte.ts:32`). A developer looking for "how Ilya names a key" will not look in a file called watchlist. Divergent Change. Move Function: `key-name.ts`, `watch-copy.ts`. Tier 2.

**L13. `composeBroadNote` is words in the adapter** (`analyze-score-adapter.ts:177-198`). Move Function beside `placeholder-line.ts`. Tier 2.

**L14. `insights.ts` is five modules in one file** (861 lines): the row types and fit rows, findings, phonation, the figure, and four formatters (`formatSeconds`, `formatSecondsFine`, `formatTempo`, `wholePercents`). Its header still describes "increment 1: the numbers page one prints, and nothing else" and says N.123 "is NOT built here" (`:2`, `:19`), while `phonationSection` at `:522` is N.123. Large Class. Extract Module along those five lines. Tier 2, ordered by step 7's framework.

**L15. `layoutTessituragram` is a 395-line function** (`tessituragram-layout.ts:397-792`). Moot if L1 removes it.

**L16. The key search builds a whole Insights model thirteen times to read two shares.** `measureKey` calls `buildInsights` (`key-suggest.ts:271`) for each of thirteen keys (`:317-323`); each build runs `aggregatePhonation` three times (`insights.ts:370`, `:528`, `:597`), the doubt readings, the figure, and `secondsPerQuaver` three times, and `vowelTurns` adds another aggregation (`:290`). It reads `zones` only (`:273-274`). Performance efficiency, time behaviour. Extract Function `passaggioZones(score, profile)` from `insights.ts:544-555` and call that. Tier 2. Proof: `key-suggest.test.ts`, 32 tests, results unchanged. Cost not measured.

**L17. One build aggregates the same score three times and prices it three times** (`insights.ts:370`, `:528`, `:597`; `:529`, `:640`, `:780`). Compute once in `buildInsights` and pass down. Tier 2 with L14.

**L18. `noteFacts` runs twice per change** (`InsightsPane.svelte:239` and `:325`). Reuse the derived. Tier 1.

**L19. `TranspositionRuler.svelte` and `TranspositionDock.svelte` repeat each other.** `same`, `counted`, the `line` derived, the arrow-and-Escape handler, and the pill CSS (`TranspositionRuler.svelte:58-88`, `:262-287`; `TranspositionDock.svelte:59-70`, `:141-152`, `:395-415`). Move the three pure ones into `transposition-ruler.ts`. Tier 2.

**L20. `CompassStave.svelte` and `Tessituragram.svelte` share 40 lines of font loading and canvas measuring** (`CompassStave.svelte:27-64`, `Tessituragram.svelte:48-88`). Resolved by L1.

**L21. `ratified-lines.test.ts` sits in `insights/` and pins the Guide, the Input view, scan banners, the HEIC refusal, break buttons, and a blurb line** (its `describe` titles at `:46`, `:97`, `:213`, `:263`, `:292`). A developer changing a Guide string will not look here. Move File to `lib/`. Tier 2, unit t's to confirm.

**L22. `strophic-byte-baseline.test.ts` writes into the tree when `UPDATE_STROPHIC_BASELINE=1`** (`:72-78`). Not a defect; a fact any lane running the suite with a stray environment needs.

**L23. A fake event is passed to the resolver.** `vowelResolver?.({ id } as never)` (`InsightsPane.svelte:352`). It works only while the resolver reads `.id` alone. Give `firstOutsideRange` the event. Tier 1.

**L24. Batch 3's remaining renames, tier 1, seen here:** the component name `MarkupPane`, the class `.markup-paper-container` (`MarkupPane.svelte:1152`, also queried at `:351` and `:409`), `tab.markedScore` (`:937`), the `profile.*` and `markup.*` key families, `MARKUP_*` in `legend.ts`, and "Markup" throughout the comments of all four folders.

**L25. The two ceilings.** MarkupPane: L4 and the comment lane clear well over 300 lines; then L11 takes the chain out. A split is not needed to make room. InsightsPane: L5, L11, and L18 make room; its measuring-and-paging block (`:380-479`) is the natural Extract Module if step 7 wants one. Tier 3.

---

## 4. Hidden relationships

1. **The chain, twice** (L11). Change one pane and the other silently disagrees.
2. **Two deciders in INSIGHTS** (D1): the gated watch list and `comments.ts`. They share `noteConditions` and no selection rule.
3. **Paging numbers written in script and in CSS.** `GEOMETRY = { gap: 16, inner: 12, pad: 17, openPad: 5 }` and `INSIDE = COLUMN - 2 * 27` (`InsightsPane.svelte:384-385`) restate `.column { gap: 16px }`, `.squircle { gap: 12px; padding: 16px 26px; border: 1px }`, and the 5 px open padding (`:612`, `:618-625`, `:632`, `:639`). No test joins them; a CSS edit makes blocks collide with the footer.
4. **The folded watch line depends on every `watch.line.*` template opening with `watch.lead.one`** (`gates.ts:307-308`). Pinned: `gates.test.ts:206`.
5. **The later-verse id form `~v<k>` is parsed by regex in two places** (`MarkupPane.svelte:316`, `melody-pages.ts:154`) against `derivedId` in the package. No inverse function exists.
6. **`SungKey` (`insights.ts:59-72`) is the ruler state's shape, redeclared**, because `insights/` may not import `melody/`. Structural typing is the only check, and it checks at the page shell.
7. **Constants written twice across a boundary, each with a "change both" comment:** `leapSemitones` 8 (`gates.ts:72`, `comments.ts:60`); `KEY_SEARCH_WINDOW` 6 against the package's private `DEFAULT_MAX_SEMITONES` (`singer-page.ts:42`, `transposition.ts:37`); the interval names cover one to six because of that window (`watchlist.ts:532-534`).
8. **Markup's legend copy is not in `i18n.ts`** (`legend.ts:53-86`), ratified as built. `ARCHITECTURE.md`'s "search `i18n.ts` for the words" fails for these five strings.
9. **`tempo/` is in no module of the ratchet map** (`ratchets.mjs:78-85`), so nothing limits what imports it or what it imports. It imports `$lib/score` and `$lib/library`.
10. **The tempo is state on the score object.** `withSingerTempo` (`singer-tempo.ts:26-29`) works only where a reader goes through `resolveTempo` and where every derived score spreads its parent. Two readers do not (D2).
11. **`tempoUi` is a module-level singleton bound once by the page shell** (`tempo-ui.svelte.ts:65`, `:25`); a second page or a test that forgets `bind` reads a null score.
12. **Tests that pin source by text.** `markup-pages.test.ts:28-36` reads MarkupPane's stylesheet for the child selector at `:1175`; `every-sung-reading-counts.test.ts:125` asserts no source file tests the verdict.
13. **`{@html block.footnote}`** (`SingerBlock.svelte:174`) trusts `insights.footnote.tessitura` to be markup from the string table.
14. **MELODY's selection ring and crossing rings are DOM surgery on the renderer's SVG** (`MarkupPane.svelte:334-414`), keyed on `data-hit`, `data-system`, and `.markup-paper-container`; the Loupe clones the result. The comments there are load-bearing and stay.
15. **`NotesColumn` reads `MARGINS.horizontal` directly** (`NotesColumn.svelte:116`, `:120`) while the score window reads `pageFrame` (`MarkupPane.svelte:985`). Equal today (`page-config.ts:92-93`).

---

## 5. Comment census

**Counted by script (ran; an `awk` pass over lines opening with `//`, `/*`, `*`, or `<!--`; approximate at the margins): 55 files, 13,106 lines, 3,838 comment lines in 1,047 blocks, 29 percent.** By folder the heaviest are `MarkupPane.svelte` 647 of 1,231 (53 percent, 101 blocks), `advice-resolver.ts` 243 of 388 (63 percent), `score-metrics.ts` 83 of 135, `watchlist.ts` 274 of 695, `insights.ts` 288 of 861.

**The verdict against section 3's test.** Most blocks in the pure modules pass: they carry a ruling with its date, or a consequence a reader cannot reconstruct. Three classes fail.

**A. False comments, 22 blocks, about 150 lines, removed or rewritten:**
- `MarkupPane.svelte:1-45`, the header: "interim Voice Profile envelope pane", "French values placeholder (English verbatim) pending Dann's copy pass", "Still no score-input CONTROL".
- `MarkupPane.svelte:108-111` and `:536-544`: "fills each missing dimension with a permissive default" and "the sentinel proof". The adapter does the opposite (`analyze-score-adapter.ts:13-27`).
- `MarkupPane.svelte:776-779` (L4); `:805`, `:813`, `:820`, `:1050`: line references that no longer point at what they name.
- `watchlist.ts:20-21` ("DEFERRED, not yet wired") against `:328-330` ("now WIRED"); `:676-683` ("starts at opener 1", "the pool holds five", "compared at opener 1") against the code's opener 2 and pool of three (`:564`, `:688`, `:694`).
- `packages/score-parser/src/sustain.ts:10-11`: "the watch list imports it back". It does not (`watchlist.ts:47-60`). Unit b's file, this unit's evidence.
- `insights.ts:1-25` (L14); `comments.ts:66-68` (D4); `comments.ts:278` (L10); `key-lines.ts:4-5` ("Every string is PROPOSED and its French owed", while `key-strings.test.ts:68` pins 43 ratified strings and the French is at `i18n.ts:2405-2412`).
- `advice-resolver.ts:20-31`, `:351-355` (L7); `placeholder-line.ts:97`, which cites its own lines `:27` and `:76` and they have moved.
- `gates.ts:287-293`: the docblock for `gatedLines` is stranded above an unrelated constant.

**B. Tombstones, comments describing code that is gone: 9 blocks, about 215 lines, removed.** `MarkupPane.svelte:421-434`, `:449-461`, `:511-514`, `:1019-1032`, `:1039-1053`, `:1184-1221`; `legend.ts:10-19` keeps Dann's words of 2026-09-28 and stays, shortened to the ruling; `watchlist.ts:99-101`; `advice-resolver.ts` citation prose that repeats the constant it sits on (`:99-106`, `:136-142`, `:221-229`, `:273-283`).

**C. Comments on dead code, removed with it:** `Tessituragram.svelte` 44, `FitTable.svelte` 10, `cycle-dose.ts` 10, `tessituragram-layout.ts` about 140.

**Totals, counted separately as asked. Marked for removal: about 570 comment lines in 44 blocks** (A 150, B 215, C 204). **Added: about 12 lines in 9 blocks:** one line each at L6, L9's three parked features, hidden relationships 3, 5, and 6, the D2 seam in `watchlist.ts`, and a two-line header for `MarkupPane` saying what it is today. The figures for A and B are line counts from the listings; C is the script's.

---

## 6. Duplication census: facts with two or more homes

| # | The fact | Homes |
|---|---|---|
| 1 | The analysis chain | `MarkupPane.svelte:503-749`; `InsightsPane.svelte:169-204` |
| 2 | Is this note a long sustain | `analysis/watchlist.ts:85-86`, `:215-285`; `packages/score-parser/src/sustain.ts:24-102` (verbatim); a third, different, test at `conditions.ts:323-337` |
| 3 | A bar's printed number | `watchlist.ts:518-523`; `insights.ts:308-311`; `singer-page.ts:87-89`; `key-suggest.ts:172-174`; `InsightsPane.svelte:280-282` |
| 4 | Fill a template's placeholders (`fill`) | `watchlist.ts:550`; `comment-text.ts:285`; `cycle-dose.ts:14`; `further-reading.ts:44`; `singer-blocks.ts:123`; `key-lines.ts:52`; `tessituragram-layout.ts:196`; `InsightsPane.svelte:163`; `FitTable.svelte:25`; `transposition-ruler.ts:33` (a variant that keeps unknown names) |
| 5 | Hz of a MIDI number | `comments.ts:146`; `singing-measures.ts:123`; `singer-page.ts:192`; the package's `pitchToHz` |
| 6 | Where a vowel turns (fR1 divided by 2) | `comments.ts:166`; `singer-page.ts:197`, `:210`; `watchlist.ts:480-481`; the engine's `turningPitch` |
| 7 | A list in the language's own form | `placeholder-line.ts:34-47`; `profile-status.ts:66-72`; `singer-blocks.ts:127-131`; `gates.ts:303` (`Intl.ListFormat`) |
| 8 | A count in words | `singer-page.ts:230-241` (arrays); `profile-status.ts:20-22` (`profile.count.N` keys) |
| 9 | The roster's vowel order | `placeholder-line.ts:24`; `MarkupPane.svelte:440` |
| 10 | « de » or « d'» before an action | `watchlist.ts:554-556`; `comment-text.ts:289-291` |
| 11 | A word less its engraver's punctuation | `watchlist.ts:627-629`; `text-parts.ts:11-13` |
| 12 | Kind counts over watch entries | `watchlist.ts:290-303`; `gates.ts:218-222` |
| 13 | De-duplicate and rotate the band's lines | `watchlist.ts:685-695`; `gates.ts:310-323` |
| 14 | The 10-point `moved` test | `key-lines.ts:80`; `key-suggest.ts:187` |
| 15 | The longest held note above the secondo | `singer-page.ts:97-118`; `key-suggest.ts:277-285` (omits the `chainSeconds` guard) |
| 16 | The metronome note's glyph | `insights.ts:749-755`; `tempo/beat-glyph.ts:23-26` |
| 17 | Split a line into faces (IPA, accidentals, fR1) | `text-parts.ts:16-21`, `:28-33`, `:52-70`; `comment-text.ts:301-314`; `Tessituragram.svelte:95-100` |
| 18 | The calibration date from a timestamp | `identity.ts:26`; `InsightsPane.svelte:285` |
| 19 | Stave step of a pitch | `insights.ts:572-577`; `tessituragram-layout.ts:70-75` |
| 20 | Accidental glyph names | `compass-stave.ts:24`; `CompassStave.svelte:69` |
| 21 | The clef's anchor line (24 or 32) | `compass-stave.ts:93`; `tessituragram-layout.ts:755` |
| 22 | Least-squares spreading | `tessituragram-layout.ts:81-94`; `:118-137` (the first is the second with equal gaps) |
| 23 | Two `KeyChoice`s are the same stop | `TranspositionRuler.svelte:58-59`; `TranspositionDock.svelte:59-60`; inline at `transposition-ruler.ts:70`, `:105` |
| 24 | Leap threshold, search window | hidden relationship 7 |
| 25 | The page stack and paper sheet CSS | `InsightsPane.svelte:592-606`; `MarkupPane.svelte:1140-1158` (each says it is byte-identical to `Paper.svelte`'s) |
| 26 | The receipt row's look | `TempoReceipt.svelte:55-82`, restating `IntakePanel`'s (`:8-13` says so) |
| 27 | Load the notation font and measure text | `CompassStave.svelte:27-64`; `Tessituragram.svelte:48-88`; font loading again at `MarkupPane.svelte:521-534` |

**Twenty-seven.** Items 2, 3, 5, 6, and 16 are capabilities for the in-house glossary: held note, bar number, pitch to frequency, turning pitch, beat glyph.

---

## 7. Token table (section 4a)

**Ran:** `node docs/sessions/census-colour-tokens.mjs` on this tree gives **296 literals, 174 class 1, 122 needing judgement, 51 files**. The script is still in `docs/sessions/`, not `scripts/`; `ls scripts/` shows `ratchets.json` and `ratchets.mjs` only. It counts hex only, so the 12 `rgb()` and `white` values below are outside its figure.

### Colour, 28 hex and 12 others

| Where | Literal | Class | Becomes, or why |
|---|---|---|---|
| `SingerBlock.svelte:309`, `:337`, `:345`; `TempoControl.svelte:286` | `var(--ink-tertiary, #6a655f)` | MIGRATE | `var(--ink-tertiary)`; the fallback equals the token |
| `NotesColumn.svelte:166`, `:207`, `:223`, `:232`; `TempoControl.svelte:191` | `var(--ink-secondary, #4a4540)` | MIGRATE | `var(--ink-secondary)` |
| `TempoControl.svelte:183` | `var(--ink-primary, #1a1612)` | MIGRATE | `var(--ink-primary)` |
| `CompassStave.svelte:68`; `tessituragram-layout.ts:626`, `:627`; `Tessituragram.svelte:107` | `var(--ink-stave, #1a1612)` | MIGRATE | `var(--ink-stave)`. **The fallback is wrong:** the token is `#3A352F` (`app.css:31`); `#1a1612` is `--ink-primary`. Three of the four go with L1 |
| `TempoControl.svelte:181` | `var(--paper-cream, #f6f1e6)` | MIGRATE | `var(--paper-cream)`. **The fallback is wrong:** the token is `#F0EBE0` (`app.css:78`) |
| `PieceKeyLine.svelte:50` | `var(--stone-200, #e7e5e4)` | NEEDS A TOKEN | `--stone-200` is undefined (D10). Either define it in the stone tier or use `--stone-300` |
| `PieceKeyLine.svelte:67`; `TranspositionRuler.svelte:274`; `TranspositionDock.svelte:259`, `:406`; `TempoControl.svelte:278` | `#fff` as a control's ground | NEEDS A TOKEN | Proposed `--control-ground`, in the paper tier. Five homes of the plan's most repeated unmatched value |
| `TranspositionRuler.svelte:231`, `:280`; `TranspositionDock.svelte:331`, `:412`; `TempoControl.svelte:235` | `#fff` as ink on `--lavender-jewel` | NEEDS A TOKEN | Proposed `--ink-on-jewel`, an ink tier. One idea: text on a filled jewel, whatever the hue |
| `TranspositionRuler.svelte:219`; `TranspositionDock.svelte:319` | `#e8e4dc`, the printed key's grey box | NEEDS A TOKEN | Proposed `--paper-shade`, paper tier. It equals no token; nearest is `--desk-surface` `#D8D4C8`, a different idea |
| `TranspositionRuler.svelte:158`; `TranspositionDock.svelte:227`, `:363`, `:368` | `rgba(250, 248, 243, …)` | NEEDS A TOKEN | A floating layer's ground. `#FAF8F3` is two units off `--drawer-bg` `#FAF8F5` (`app.css:80`); whether it was meant to be that token is NOT ESTABLISHED. Proposed `--float-ground`, with the alpha by `color-mix` |
| `InsightsPane.svelte:604`; `MarkupPane.svelte:1144`; `TranspositionRuler.svelte:161`; `TranspositionDock.svelte:230` | `rgba(0, 0, 0, …)` shadows | NEEDS A TOKEN | Proposed `--shadow-sheet` and `--shadow-float`; a dark skin cannot keep black shadows |
| `TempoControl.svelte:182`; `TempoReceipt.svelte:60` | `rgba(26, 22, 18, …)` | MIGRATE | `color-mix(in srgb, var(--ink-primary) 18%, transparent)` and 8 percent; the triple is `--ink-primary` |
| `InsightsPane.svelte:661`; `MarkupPane.svelte:1228` | `background: white` in `@media print` | LOCAL BY RIGHT | Print only: the sheet is the paper |

### Font family, 14 outside the three tokens

| Where | Value | Class | Becomes, or why |
|---|---|---|---|
| `SingerBlock.svelte:358`; `TempoControl.svelte:256`; `TempoReceipt.svelte:85` | `'Finale Maestro', serif` | NEEDS A TOKEN | Proposed `--font-notation`. No token names the notation face |
| `TempoControl.svelte:138` | `font-family="Finale Maestro"` on SVG text | NEEDS A TOKEN | The same token, as `style` |
| `CompassStave.svelte:80`, `:91`, `:93`; `Tessituragram.svelte:141` | `font-family={font.family}` | LOCAL BY RIGHT | The loaded font's own family name, from `loadNotationFont`; it cannot be a CSS constant while the loader names the face |
| `Tessituragram.svelte:112` | `'Lato IPA', var(--font-sans)` | NEEDS A TOKEN | The one IPA-face token the plan asks for; goes with L1. **The live page sets IPA in `var(--font-sans)`** (`SingerBlock.svelte:348-350`), so the two figures disagreed about the IPA face |
| `NotesColumn.svelte:162`, `:204`, `:220`, `:228` | `var(--font-serif, 'Source Serif 4', serif)` | MIGRATE | `var(--font-serif)`; the fallback omits two of the token's faces (`app.css:23`) |
| `NotesColumn.svelte:193` | `var(--font-sans, 'Source Sans 3', sans-serif)` | MIGRATE | `var(--font-sans)` |

**Focus ring.** This unit rings in three colours: `--lavender-ink` (`TranspositionRuler.svelte:251`, `TranspositionDock.svelte:345`), `--lavender` (`TempoControl.svelte:242`, `SingerBlock.svelte:380`), and none at all on `.try-key`, `.offer-link`, `.offer-decline`, and `.pill` (`SingerBlock.svelte:554-595`, `TranspositionRuler.svelte:263-287`). Evidence for the missing focus-ring token.

**One hue question for the desk.** INSIGHTS' "Change the tempo" link is lavender on a rose page (`SingerBlock.svelte:373`, `:380`). Under `app.css:33-41` lavender is the melody and rose is your voice. Tempo is a fact of the music, so it reads as deliberate; no comment says so.

---

## 8. NOT ESTABLISHED

- Whether D1 occurs on a real song with a real voice. Not run: the bridge VM has Node 22 and no way to run the suite without writing a cache into the tree.
- Whether the page tells a singer without typed passaggi why MOMENTS is empty (D4).
- Whether the page's serif face draws U+1D15D and U+1D15E (D9).
- Whether `#FAF8F3` was meant to be `--drawer-bg` (section 7).
- The time cost of L16 and L17. Calls were counted, not milliseconds.
- Whether the 43 `insights.key.*` strings' French is ratified or drafted; `key-strings.test.ts:68` says ratified 2026-11-05 and its body was not read.
- Anything about the 48 test files beyond their titles and the two passages named in section 0.

---

## 9. For the desk, before GUIDE and LEARN

**One question, Dann's, because it is taste and it gates L1 and L2.** Round 2's page stopped drawing three things he ruled in: the "half the singing" bracket and the centre of gravity (`singing-measures.ts:23-99`; his wording is recorded at `i18n.ts:1959-1968`), the passaggio-crossings count (`insights.ts:313-328`), and the fit table. All three are still computed, tested, and translated. **Fable's recommendation: delete the drawing code and keep the three pure measures, each marked "computed, not drawn, since round 2 (2026-10-11)".** Cost of that path: about 1,150 lines leave, 14 string keys stay unreferenced, and GUIDE and LEARN describe only what prints. Cost of deleting the measures too: about 150 more lines leave and three of his rulings have no code. Cost of restoring them to the page: a design round.

**What GUIDE and LEARN can rely on from this read:** INSIGHTS' printed order is the one in `singer-blocks.ts:152-368`; a key is offered only when it has fewer challenges (`key-suggest.ts:213-215`); the tessitura is withheld only when a doubtful bar can move it (`tessitura-robust.ts:40-73`); a placeholder value is always said on the page (`placeholder-line.ts`, `gates.ts:320-322`, `singer-blocks.ts:247-254`); the ruler, the dock, and the tempo control never print (`TranspositionRuler.svelte:289-293`, `TranspositionDock.svelte:417-421`, `TempoControl.svelte:315-319`). **What they cannot say until D2 is repaired:** that every figure follows the singer's tempo.

---

## 10. Counts

- **Findings:** 25 structural (L1 to L25), 10 behaviour defects (D1 to D10), 0 blockers for the read. D1 and D2 are the two Fable would not ship GUIDE text over.
- **Hidden relationships:** 15. **Duplicated facts:** 27. **Token rows:** 40 colour values, 14 font-family values, plus the focus ring.
- **Comment census:** 3,838 comment lines in 1,047 blocks; about 570 lines in 44 blocks marked for removal; about 12 lines in 9 blocks to add.
- **Claims marked "ran":** the dead-code greps, the census script (296), the comment count, the `--stone-200` count, the intake grep, the orphaned-key grep.
- **Terms.** Coined by Fable in this report: "tombstone" for a comment about deleted code, "the chain" as shorthand for the ten derivations (the panes' own comments call it "the analysis chain"). Proposed token names are proposals, the desk's to approve. Everything else is the tree's.

**For the estimates table.** Tool uses: 51. Tokens: about 430,000 by Fable's own estimate from the volume read, with no meter, so plus or minus 40,000. **Harness count: 630,541.** Elapsed minutes: NOT MEASURED by the agent.
