# Scout packet: strophic unrolling and repeat signs in MELODY (r1, 2026-11-12)

Repository /home/claude/ilya-shane, read-only. `git pull --ff-only`: already up to date. `git log -1 --format=%h`: **dc078b95** (2026-11-11, "Scan reader's model for the build...").
Everything below was read this session at that commit. Line numbers are as read. Where a line says "inference" it is the scout's reading, not a fact from the tree.

---

## 1. Unrolling machinery that exists

### 1a. unfold.ts (699 lines), the order computer
- Input: `MeasureRepeatMarkers[]` (`unfold.ts:44-83`): `startRepeat`, `endRepeat`, `times` (default 2, `:49`, used `:~640`), `endingPasses` (`:53`), plus the jump family `segno`, `coda`, `daCapo`, `dalSegno`, `toCoda`, `fine`, `afterJump`, `timeOnly`, `jumpMarkWithoutSound`, `hasJump` (`:57-82`).
- Output: `UnfoldResult` = `{ ok: true, order: UnfoldedMeasure[] }` or `{ ok: false, flag }` (`unfold.ts:113-116`). `UnfoldedMeasure = { source: number /* 0-based measure index */, pass: number /* 1-based */ }` (`:85-91`). So the order is a list of (source measure, pass) pairs. It carries NO verse number and no events.
- `unfold()` (`:150-167`) routes to `unfoldWithJumps` only when some measure has a jump marker; otherwise `unfoldRepeatsAndVoltas` (`:169`, increment 1).
- Voltas: per-measure pass membership `endingPasses` (header comment `:12-15`); a measure not on the current pass is skipped. One-bar and multi-bar endings handled uniformly (same comment).
- Jumps (`unfoldWithJumps`, `:565-653`): D.C./D.S. fire once on the first traversal (`:633-640`); To Coda fires only on the return (`:611-614`); Fine ends the return traversal (`:593-597`); repeats are suppressed on the return (`:600, :618`); pass on a return traversal is occurrence count (`push`, `:572-577`; header `:35-39` calls this a JUDGEMENT, not a sourced fact).
- Flags (`UnfoldFlag`, `:103-111`): kinds `'unsupported' | 'ambiguous' | 'format-ceiling'`. Codes seen in this read: `nested-repeat` (`:600`), `runaway` (`:584`); header names `volta-with-jump`, `jump-unsupported-v1`. Voltas combined with a jump are FLAGGED (header `:25-27`); `afterJump` and `timeOnly` flag (types `:75-79`). On any flag the caller falls back to as-written.
- `markersFromMeasures` (`:677-698`) bridges `Measure` (repeatStart/repeatEnd/repeatTimes/repeatAfterJump/ending.passes/jump/hasJump) to markers.

### 1b. performance-order.ts (103 lines), the projection
- `scoreInPerformanceOrder(parsed)` (`:64-103`) runs `unfold(markersFromMeasures(parsed.measures))`. On flag: returns `{score: parsed, reordered:false, flags:[flag]}` (`:68-70`). If order equals as-written: returns the input by reference (`:76-81`).
- Otherwise rebuilds ONLY `vocalLine`: groups events by `measureIndex` (`:85-90`), walks `order`, pushes each source measure's events again (`:95-100`), returns `{...parsed, vocalLine}` (`:102`). **`measures` is untouched, and each pushed event is the same object with the same `id` and the original `measureIndex`** (header `:27-35`). So the projection has no pass number on events and cannot by itself be paginated: `sliceScore` filters `vocalLine` by `measureIndex` range (page-layout.ts:~125-137), which would put every pass of a measure into one slice.
- It was deliberately built for analysis only; header `:7-12` says whether the render expands repeats "is the open strophic ruling's to settle (D3, the reprint-per-verse bundle)".
- Callers (grep, non-test): `MarkupPane.svelte:591` (`performanceOrder`), `InsightsPane.svelte:169` (`analysisScore`), `transposition-ruler.ts:302`. Exported `index.ts:62`.

### 1c. analyze-per-verse.ts (47 lines)
- `analyzePerVerse(parsed, profile, options)` (`:36-47`): for each `sungVerseNumbers(parsed)` verse, builds `buildVowelResolver(parsed, verse)` and runs the unchanged `analyzeScore`; returns `Map<verse, AnalyzedScore>`. Header (`:1-25`): `global` and `sourceScoreId` are identical across verses, so caches must key by verse; "nothing here draws anything"; rendering is "parked on Kimi's rulings (§A.107)".
- **Callers: none outside its own test** (`analyze-per-verse.test.ts`). Grep over apps and packages (non-test) finds no import. Confirmed also by `docs/sessions/n174-B-module-map_r1_2026-09-27.md:175`, `memo-n160...:390`, `report-desk-consistency-audit_r1_2026-11-01.md:252`. CONTRACT.md:147 says do not delete it ("N.20 is built on it").
- **Important correction to the brief's wording:** "the analysis unrolls (... analyze-per-verse.ts)" is true of repeats/voltas via performance-order, but per-VERSE analysis is not wired anywhere live. INSIGHTS and MarkupPane analyse verse 1 only (see 1e).

### 1d. verses.ts (34 lines)
- `sungVerseNumbers(parsed)` (`:22-34`): ascending verse numbers present on any note; uses `syllable.versesInfo` when present (authoritative, includes primary), else `syllable.verseNumber`.

### 1e. How verses are represented in the parsed score (types.ts, 999 lines)
- `SyllableInfo` (types.ts ~`:685-760`): `verseNumber` (1-indexed, `:708`), `verseLabel?` (`:723`), `verses?: string[]` (index 0 = verse 1, `:744`), `versesInfo?: VerseSyllable[]` (`:~752`) ordered by verse number, present ONLY when more than one verse sings on that event; includes the primary's own entry. `VerseSyllable` = `{verseNumber, text, type}` only (no wordContext, segments, label, per the comment).
- MusicXML: verse = `<lyric number="N">` (`musicxml-parser.ts:349-361`): verse detection counts every distinct lyric number, with `verseToCanonical` remap to 1..N. The primary syllable is the LOWEST verse (`:823`); `versesInfo`/`verses` set when `verseData.size > 1` (`:834-837`). MNX: from `lineOrder` (types.ts `:698-701`).
- **Hazard, confirmed in fixtures:** `sunless-01-engraved.musicxml` and `sunless-01-finale-lone-v.musicxml` carry `<lyric name="verse" number="2">` on 96 events whose text is IPA (`ˈko`, `mnɑ`), not a second verse. The parser at `:349-361` applies no script filter, so that fixture parses as a two-verse score. NOT ESTABLISHED whether a later step drops or reinterprets lyric 2 (not traced). A strophic unroll keyed on `sungVerseNumbers` would draw an IPA line as "verse 2" on this fixture unless something upstream excludes it.
- Per-verse words: `collectScoreWords(parsed, verseNumber)` (`vowel-resolver.ts:224-320`) with private `verseSyllableOf(ev, verse)` (`:210-221`); returns `ScoreWord[]` with `cells` (one per sung syllable, at onset event) and `slots` (event ids per vowel-bearing syllable) keyed by event id. A note a verse does not sing counts as a sustain continuation (`:268-276`).
- Resolvers are per verse: `buildUnderlayResolvers(parsed, verseNumber = 1, {openSyllabification, transcribedLines})` (`:415-`) builds `byEventVowel`, `byEventIpa`, `byEventCyrillic` Maps and `withheldOnsets` Set, all keyed by event id (`:~424-432`), and abstentions via `vowelResolverAbstentions(parsed.dictionMarks, verseNumber)` (`:653`). `buildVowelResolver` is a `.vowel`-only wrapper (`:673`).

### 1f. The singer's typed Lyrics, seating, pairings
- **Lyrics holds verse 1 only when it comes from a score.** `scoreText = scoreWordsText(collectScoreWords(ingestedScore.result.score, 1))` (`routes/+page.svelte:405`); same literal `1` at `:1943` and `:2786`. `scoreWordsText` (`vowel-resolver.ts:325`) joins words with one space. There is no verse separator in that string because it is one verse.
- **Seating takes one verse:** `seatScoreWords(parsed, map, lines, verseNumber = 1)` (`score-seat.ts:107-112`), `collectScoreWords(parsed, verseNumber)` at `:113`. All production callers omit the argument: `+page.svelte:672, :2681`, `waiting-seat.ts:46`, `replace-seat.ts:76`. `clitic-seat.ts:141, :487` take `verseNumber` but callers use the default (`readScoreText`).
- `watchlist.ts:369` `collectScoreWords(parsed, verseNumber)`; `buildWatchList(readingScore, analyzed, 1, ...)` is called with `1` at `MarkupPane.svelte:~766`.
- **How verses are separated in typed Lyrics: NOT ESTABLISHED.** `witness-lines.ts` (158 lines) is Poem-versus-Lyrics comparison (`witnessLines`, `witnessesDiffer`, `unsetPoemWords`, `:26-62`); it has no verse concept. `LineData[]` lines come from `processText` over the text box; one string. OPEN.md item 11 (`:2851`) describes verse unrolling "into one linear string" and a receipt line "6 verses assumed sung" (ratified string 3, INBOX 2026-10-21 00:22), with "Verse not sung" label (string 4, INBOX:326). Grep of `apps/web/src` finds no code reading those strings (no `verses assumed sung` key in i18n.ts); only `aid.endOfVerse` ("· end of verse %s ·", i18n.ts:1089, used in `components/ReadingAid.svelte:80`). So item 11's verse-picker UI is not built.
- PairingMap: `Record<string, Pairing>` keyed by event id (`pairings.ts:135`); `Pairing` = `{kind:'syllable', cyrillic, ipa, vowel, origin:SlotOrigin} | {kind:'melisma'} | {kind:'empty'}` (`:123-133`); `SlotOrigin = {lineIndex, wordIndex, slotIndex, word}` (`:79-110`) is a breadcrumb "never a key". **No verse field anywhere in Pairing or SlotOrigin.** `Slot`/`buildSlotQueue(lines)` (`:112, :204`). Storage `PAIRINGS_KEY = 'ilya:pairings'` (`:66`).

---

## 2. How MELODY renders

Pipeline in `MarkupPane.svelte` (1362 lines):
1. `parsed` (prop; already corrected and re-barred upstream, see section 3) -> `reading = readingClef(...)` (`:~558`) -> `printedReading = shiftVocalOctave(parsed, octaveShift)` (`:560`) -> `readingScore = keyRuler?.draw(printedReading) ?? printedReading` (`:562`).
2. `performanceOrder = scoreInPerformanceOrder(readingScore)` (`:591`) -> `analysisScore` (`:592`); `analysisNotices` = flags (`:596`), emitted only as `data-analysis-notices` on `.markup-paper-container` (`:~870`). The comment block `:583-589` states the RENDER keeps the notated `readingScore` ("does not pre-empt ... D3").
3. `underlayResolvers = buildUnderlayResolvers(readingScore, 1, {openSyllabification, transcribedLines})` (`:601-610`, verse hard-coded 1) -> `vowelResolver = withPairedVowel(underlayResolvers.vowel, pairings, drawnUnderlay)` (`:~614`).
4. Channels built per event over `readingScore.vocalLine` (`:~620-720`): `ipaPreview` (Record id->IPA, `:~629`), `withheldIpa` (Set, `:~668`), `cyrPreview` (Record, `:~684`), `sylTypePreview` (`:~708`), `melismaPreview` (Set, `:~722`). Each prefers the pairing, then the resolver.
5. `analyzed = resolveAdvice(analyzeScore(analysisScore, snapshot, vowelResolver))` (`:~738`).
6. `paginated = paginateScore(readingScore, analyzed, {clef, pageWidth, pageHeight, laterPageHeight, ..., ipaPreview, withheldIpa, cyrPreview, sylTypePreview, melismaPreview, font...})` (`:~791`). Note: layout is over the NOTATED `readingScore`, while `analyzed` comes from the performance-order score, joined by event id.
7. `scorePages` -> `{@html page}` per page (`:~866-900`). `onpagesdrawn` hands the bundle `{readingScore, analyzed, clef, spacing, font, fontFamily, ipaPreview, withheldIpa, cyrPreview, sylTypePreview, melismaPreview}` to the page shell (`:~808-830`), which is the Loupe's `LoupeRenderBundle` (`loupe-render-bundle.ts`, 29 lines).

`page-layout.ts` (467 lines): `paginateScore` (`:254-467`): packs MEASURES into systems by index range using `sliceWidth` (`:~167-190`), `tacetRuns` (`:~278`), renders each system with `renderSystemSlice(parsed, analyzed, options, from, to, extra)` (`:208-250`), stacks onto pages; `sliceScore` (`:~114-145`) filters `measures` and `vocalLine` by original index and REBASES indices to 0; system wrapper `<svg ... data-system="from-to">` (`:~436`) with ORIGINAL measure indices. `renderSystemSlice` also computes `accidentalStateAtEndOf(parsed, fromMeasure - 1, fifths)` and `incomingTimeSignature: parsed.measures[fromMeasure-1]` (`:~228-236`): both depend on the bar before the slice in `parsed.measures` order. Also `slurEndsAcross/slursThrough` (`printed-marks.ts`).
`staff-renderer.ts` (3426 lines): `renderAnalyzedStaff` consumes the slice; options in `StaffRenderOptions` (`:226-~420`).

### What an unrolled render would collide on (facts, not design)
`sliceScore`, `data-system`, `layoutColumns`, `sliceWidth` and the Loupe all key on `Measure.index` and `VocalLineEvent.id`. `performance-order` today repeats events with the SAME id and original `measureIndex` (1b). Maps keyed by event id that the render or the Loupe reads:

| # | Map / attribute | Where | Per-verse today? |
|---|---|---|---|
| 1 | `PairingMap` (`doc.pairings`) | `pairings.ts:135`; MarkupPane prop `pairings` | No verse key; seated verse 1 only |
| 2 | `drawnUnderlay` (`DrawnUnderlay = Record<string, DrawnSyllable>`) | `pairings.ts:909, :977 drawPairings` | No |
| 3 | `blankUnderlay` (Set) | `applyBlank`, `pairings.ts:1161`; MarkupPane `:~645, :~672` | No |
| 4 | `melismaPreview` / `melismaIds` | `pairings.ts:498`; MarkupPane `:~722` | No |
| 5 | `ipaPreview`, `cyrPreview`, `sylTypePreview`, `withheldIpa` | MarkupPane `:~629-720`; consumed `staff-renderer.ts` (`options.ipaPreview?.[ev.id]` etc., ~`:2463`) | Built from verse-1 resolver |
| 6 | Resolver maps `byEventVowel/Ipa/Cyrillic`, `withheldOnsets` | `vowel-resolver.ts:~424-432` | YES per verse (one `buildUnderlayResolvers` call per verse) |
| 7 | `AnalyzedScore.events: Record<id, AnalyzedEvent>` | `analysis-types.ts:154`; read `staff-renderer.ts:2115, 2140, 2285, 2681, 3422` | Not per verse (verse-1 resolver); `analyzePerVerse` would give one per verse |
| 8 | `CorrectionMap = Record<id, NoteCorrection>` | `correction.ts:136`, applied by `applyCorrections` | n/a (pitch/duration/barline/time signature) |
| 9 | `DictionMarksRecord` `breaks`, `vacatedTailEventIds` (`{eventId, verseNumber}`) | `diction-marks.ts:~70-120`; `parsed.dictionMarks` (`types.ts:124`) | YES, carries `verseNumber` |
| 10 | Renderer-internal: `beamStemById`, `nextXById`, `prevXById` (`staff-renderer.ts:2029, 2450, 2459`), `melismaStart/melismaEndX` (`:2365-2366`), `slurAcross` Set, `slurThrough` | per system, so safe only if ids are unique within a system | n/a |
| 11 | SVG data attributes: `data-event-id` (`:2921`), `data-hit` (rest `:2662`, note `:~2936`), `data-of-event`, `data-ipa-of`, `data-hyphen`, `data-extender`, `data-withheld`, `data-analysis`, `data-system`, `data-tacet`, `data-bar-number` | `staff-renderer.ts` | ids are page-global in DOM queries (below) |
| 12 | Crossing ring / squircle | `crossing-ring.ts:90` queries `[data-hit="id"]` page-wide (`querySelector`, first match) | No |
| 13 | Watch list entries keyed `eventId` | `watchlist.ts:137, :461`; `buildWatchList(..., verse = 1)` | verse param exists, called with 1 |
| 14 | Selection ring | `MarkupPane.svelte:359 querySelector('[data-hit=...]')` (first match only) | No |

Other facts bearing on render: `readingScore` is also the input to `transposition-ruler.ts:302`, and the Loupe bundle carries the same score, so a render score that differs from `readingScore` must reach `LoupeRenderBundle` too (`loupe-render.ts:~50-62 bundleRenderOptions`, `renderSystemSlice` called from Loupe's own re-render).

---

## 3. Corrections and the Loupe on an unrolled score

- Corrections are applied BEFORE `MarkupPane` sees the score: `BarLayer.#get()` does `pre = applyCorrections(score.vocalLine, map)` then `rebar(score, pre, map)` (`bar-layer.ts:52-58`); the result is the page's `correctedLine` and score. `applyCorrections` (`correction.ts:408-`) maps over event ids; `CorrectionMap` keyed by event id (`:136`); fields pitch, base, dots, deleted, entered{after,measureIndex}, type, tied, tuplet, barline, timeSignature (`:48-135`); comment `:~57-63` states "still keyed by event id". **Fact:** because corrections apply to the notated line upstream, an unroll performed downstream of `readingScore` (inference: at the MarkupPane seam) inherits every pitch correction on every pass with no change to `CorrectionMap`. If unrolling is done upstream of `applyCorrections`, ids would multiply (inference).
- Syllable placement: a pairing is keyed by event id with no verse (section 1f), so a placement made on a note today means verse 1 (the only verse seated). A pass-qualified placement would need either a verse field on `Pairing` or a second map per verse (inference). `SlotOrigin` has no verse (`pairings.ts:79`).
- How a click becomes an event id: delegated document listener, `closest('[data-hit]')` -> `getAttribute('data-hit')` -> `onnotepick(id)` (`MarkupPane.svelte:309-320`) -> `handleNotePick(eventId)` (`+page.svelte:740`) -> `selectedEventId` -> `selectedEvent` from `correctedLine` -> `heldMeasureIndex = selectedEvent.measureIndex` (`+page.svelte:1028-1036`). `heldMeasureLabel = layer.labelOf(i)` (`:1042-1046`, `bar-layer.ts:91`). Held ids: `heldMeasureIds` filters `correctedLine` by `measureIndex === heldMeasureIndex` (`:1048-1056`); `nextMeasureIds` (`:1057-`); `positionsInMeasure` (`:1074`).
- What the Loupe reads by id from the DOM: `loupe.ts:66 hitsFor` (`page.querySelector([data-hit="id"])`, first match), `loupe.ts:~346 MUSIC_MARK`, `systemIndexOf(ranges, measureIndex)` over `data-system` ranges (`loupe.ts:~55-63`), `loupe-hold.ts:132`, `loupe-ink.ts:106-255`, `Loupe.svelte:680, 1137-1139 (renames data-hit), 1167, 1323, 1348, 1494`, `TimeSignatureControls.svelte:41-45`, `crossing-ring.ts:90`. Loupe re-renders the held system with `renderSystemSlice` from the bundle (`loupe-render.ts`), from `Measure.index` ranges.
- **What a pass-qualified id would break (facts about the readers):** (a) every `querySelector([data-hit="<id>"])` above is a first-match query; with the same id on two passes the Loupe would find the first pass's rectangle, so a tap on verse 2 would ring verse 1's note; (b) `heldMeasureIndex`/`systemIndexOf` assume one system per measure index (`loupe.ts` comment: "A measure belongs to exactly one system"); (c) `data-system="a-b"` ranges are source measure indices (`page-layout.ts:~436`); (d) `bar-answers`, `bars-to-confirm.ts:105-118` (reads repeatStart/repeatEnd to pair bars), `rebar.ts:184-185,359-380` (clears/keeps repeat and ending flags), `offers-for-a-bar`, `loupe-print.svelte.ts:207 firstNoteOfBar` (finds a measure by `m.number`, first match; with printed numbers repeated across verses it returns the first), `insights.ts:306-308 measureNumber`, `watchlist.ts:520-523 barOf` all treat `Measure.number` as unique-ish; (e) any stored id (corrections, pairings, library records) is the bare id; a qualified id would orphan stored keys (`migrateCorrectionIds`, `orphanIds` exist, `correction.ts:760, :789`, as precedent). NOT ESTABLISHED: whether `+page.svelte`'s remaining readers (the file is 5515 lines) have other first-match assumptions; not exhaustively traced.

---

## 4. Bar numbers

Drawn in `staff-renderer.ts`:
- `BAR_NUMBER` constants `:1137-1177` (italic, `fontSize: CYR_FONT_SIZE`, `clearanceSp 1.0`, fill `#3a352f`, `courtesyAfterBars: 2`). Header `:1125-1136`: first bar of piece not labelled; numbers at the first measure of every system; courtesy `[n]` after a multibar rest mid-system (Dann 2026-08-29, brackets 2026-09-15); printed text is `Measure.number` verbatim, a string.
- System-start number: `:2229-2262`: `barNumber()` helper (`:2243-2244`) emits `<text data-bar-number="N" ...>`; drawn only `if (o.measureOffset > 0)` (`:2246`); text = `parsed.measures.find(m => m.index === 0)?.number` of the SLICE (`:2247`), centred over the clef.
- Post-rest courtesy: `:2603-2612`: `parsed.measures.find(m => m.index === run.toMeasure + 1)?.number`, drawn as `[n]` at `:2610`.
- `measureOffset` comes from `renderSystemSlice` (`page-layout.ts:~232`). Loupe strips `data-bar-number` from its clone (`loupe-ink.ts:227, :136`; `Loupe.svelte:952`).
- No verse label exists in the renderer. The only free-text verse-ish field is `Measure.rehearsalMark` (`types.ts:~339`, "e.g. 'Verse 2'"); grep found no renderer use of it (NOT ESTABLISHED beyond that grep).

Where bars are named elsewhere:
- Loupe: `heldMeasureLabel` (`+page.svelte:1042`) -> `measureLabel` prop (`Loupe.svelte:72`) -> `tag` (`:2155-2192`) using i18n `loupe.measureTag` "m. %m · system %s of %t" (`i18n.ts:468`), `measureTagShort` `:471`, `measureTagCheck` `:711`, `measureTagFill` `:727`, `measureTagBoth` `:734`. `LoupePrintStrip` also gets the bar as an integer (`Loupe.svelte:2298`).
- INSIGHTS: `InsightsPane.svelte:262-272` `commentTag` -> `T('loupe.measureTagShort').replace('%m', commentBar(r))`, `commentBar` = `analysisScore?.measures[r.comment.measureIndex]?.number || index+1` (`:271`); pitch via `analysisScore.vocalLine.find(e => e.id === eventId)` (`:268`, first match; repeated ids resolve to the first pass). `insights.ts:306-308 measureNumber`; `key-suggest.ts:172-173 barLabel`; `singer-page.ts:88`; `watchlist.ts:142, :520-523 barOf`. Comments are shown "in performance order, repeats and later verses unrolled" (`PRODUCT.md:1068`; `comments.ts:436-437`, per `review-fable-insights-further-reading_r1_2026-11-03.md:23,29`).
- PRODUCT.md:1182 ratifies "bar N" as the one address across Text, Markup, Insights, Corrections.
- Ruling (3) in the request ("bar 12, verse 2"; verse labels at system starts): **the 2026-11-12 01:05 ruling is NOT in the repository** (grep of OPEN.md, INBOX.md, STATE.md, PRODUCT.md, sessions found no "verse 2" label ruling). The last INBOX line is 2026-11-11 23:21. It is only in the request text.

---

## 5. Repeat signs and voltas

- `Measure` (types.ts `:251-342`): `repeatStart?: boolean`, `repeatEnd?: boolean` (`:273-274`), `repeatTimes?` (`:~291`, default 2 in unfolder), `repeatAfterJump?`, `ending?: {passes: number[]; startsHere?: boolean; endsHere?: boolean}` (`:~302-306`, comment: "for drawing the bracket later"), `jump?{segno,coda,daCapo,dalSegno,toCoda,fine,timeOnly,markWithoutSound}`.
- Parser sets them: MusicXML `musicxml-parser.ts:576-577` (startsHere/endsHere), `:593-596` (repeatStart/End/Times/AfterJump); MNX `mnx-parser.ts:495-503`. The ending's printed label/number: only `passes`; no label text field (NOT ESTABLISHED beyond the type; `<ending number="1,2">` text handling not read).
- **The renderer draws none of this.** Grep of `staff-renderer.ts` for `repeat|volta|ending|startsHere|endsHere` finds only comments (`:2345, :2758, :2864`, unrelated meanings). Non-parser readers of the flags: `bars-to-confirm.ts:21,111-118`, `rebar.ts:184-185, 359-380`, `unfold.ts`.
- Barlines in `staff-renderer.ts`: mid-system barline per new measure at the left of the first column: `:2621-2629` (`barX = nx - BARLINE_TO_COLUMN_PX - meterRoom`, thin line `x1..x2 staffTop..staffBottom`, `barT = thinBarlineThickness` in SMuFL mode else 1, then meter digits). Closing barline of each system `:3387-3412` (`endBarX = contentRight - endBarT/2`); final thin+thick pair only `if (options.finalBarline)` (`:3394-3408`, thick/thin separation `sp(0.5)`). Tacet barline bounds `:2486` via `closingBarlineStrokeX` (`barline-geometry.ts`). Constants: `BARLINE_TO_COLUMN_PX`, `METER_BARLINE_CLEAR_SP` (`:~145-186`). Layout columns carry `newMeasure` (`layoutColumns`, `:~1600-1700`), so a barline's x is derived from the next column; a repeat sign would need width reserved in `layoutColumns` for `sliceWidth` and render to agree (they share `layoutColumns` by design, `page-layout.ts` header comment `:~70-75`).
- **SMuFL support.** Font files in `apps/web/static/fonts/`: `bravura/` (+`bravura_metadata.json`), `leland/` (+`leland_metadata.json`), `finale-maestro/` (+`FinaleMaestro.json`); product default is Finale Maestro (`notation-fonts.ts:4, :42`). `smufl-metadata.ts` `SMUFL_CODEPOINTS` (`:~85-160`, `RequiredGlyphName` `:160`) lists no repeat, segno, coda or barline glyph (grep of `smufl-metadata.ts`, `staff-renderer.ts` for `repeatDots|repeatLeft|segno` finds only mnx-parser comments); the renderer draws barlines as `<line>` strokes, not glyphs. `glyphBBoxes` presence, read from each metadata JSON this session:

| glyph | Bravura | Finale Maestro | Leland |
|---|---|---|---|
| repeatLeft | yes (bbox NE 1.464,4.0) | yes | NO |
| repeatRight | yes | yes | NO |
| repeatRightLeft | yes | yes | NO |
| repeatDots | yes (NE 0.4,2.68) | yes | yes (NE 0.416,2.712) |
| segno / coda | yes | yes | yes |
| barlineSingle | yes | yes | NO |
| `engravingDefaults.repeatBarlineDotSeparation` | 0.16 | 0.34 | 0.37 |
| `repeatEndingLineThickness` | 0.16 | 0.13 | 0.11 |
| `thinBarlineThickness` / `thickBarlineThickness` | 0.16 / 0.5 | not read | 0.18 / 0.55 |

  Leland's `cmap` (read with fontTools) holds U+E043 and U+E044 among U+E040-E044; Maestro holds E040-E044 and E030-E031. So with Leland, a repeat sign would have to be composed from thick+thin strokes plus `repeatDots` (inference: the engravingDefaults keys above exist for that purpose). `repeatEndingLineThickness` is the volta bracket line weight in all three. The default font is Maestro, which has the whole-glyph set.
- Unknown: the codepoint-to-name mapping for repeat glyphs was not looked up in the SMuFL registry this session (NOT ESTABLISHED); names come from the metadata JSON keys.

---

## 6. Fixtures and tests

Fixtures (`*.musicxml` and `*.xml`, searched with grep counts; 203 xml/musicxml/mxl/mnx paths in tree incl. docs):
- Committed fixtures in the code tree: `packages/score-parser/src/fixtures/` (`n188-markings.musicxml`, `row126-song1-bars-9-10.musicxml`), `apps/web/src/lib/score/ingestion/fixtures/` (`sunless-01-engraved.musicxml`, `sunless-01-finale-lone-v.musicxml`, `tchaikovsky-op38-3-voice.musicxml`, plus `.bak`, provenance notes, JSON truth files). 
- `<repeat`: **0** in every code-tree fixture. `<ending`: **0** in code-tree fixtures; **2** (`<ending number="1" type="start">` at lines 295 and 1281) in `sun4.musicxml`, which exists only under `docs/sessions/` in five copies (measure-checks_r1_2026-10-05, baseline-on-the-singers-path_r1_2026-10-06, measure-m-p-r74_2026-10-11 rule-off and rule-on, measure-set3-four-below_2026-10-11), 29 measures, no `<repeat>`. Not usable as a test fixture from the code tree without copying.
- `<lyric number="2">`: 97 (`sunless-01-finale-lone-v`) and 96 (`sunless-01-engraved`); those are IPA lines (see 1e hazard), 0 `number="3"+`. Tchaikovsky (172 lyric number="1"), n188 (22 number="1"), no verse 2. So **no committed fixture has a real second verse of Cyrillic words, a repeat bar, or a volta.** `<sound dacapo|dalsegno|fine>`: 0 anywhere.
- No `.mxl`/`.mnx` files in tree. `recognized-mussorgsky-01-p1.json` is an OMR result.
- Tests build repeats and verses inline: tests mentioning repeatStart/repeatEnd/ending/`<repeat`/`<ending`: `unfold.test.ts` (281 lines, 39 `it`), `performance-order.test.ts` (147, 7), `musicxml-parser.test.ts`, `mnx-parser.test.ts`, `bars-to-confirm.test.ts` (144, 18), `rebar.test.ts`, `offers-for-a-bar.test.ts`, `barline-marks.test.ts`, `join-pages.test.ts`, library `document-*.test.ts`. Verse tests: `verses.test.ts` (114, 5), `analyze-per-verse.test.ts` (119, 4), `vowel-resolver.test.ts`, `score-seat.test.ts` (173, 8), `musicxml-parser.test.ts`, `mnx-parser.test.ts`, `diction-marks.test.ts`, `fixture-rule.test.ts`, `old-reader-seats.test.ts`, `replace-seat.test.ts`.
- Pins on current render behaviour: `apps/web/src/lib/analysis/performance-order-seam.test.ts` (116 lines, 3 `it`): header says analysis reads performance order while `paginateScore` reads the NOTATED score, and "the strophic-render ruling (D3) is not pre-empted"; a jump-skipped event "still renders as written". Pins on seating one verse: `score-seat.test.ts`. `markup-pages.test.ts` (96, 4 `it`) did not match repeat or notated keywords (NOT ESTABLISHED what it pins). Byte-stable renderer approval: `apps/web/src/lib/approval/staff-renderer-real-fixture.approval.test.ts` (header of `MarkupPane` `:~371` calls the renderer "a package with its own byte-stable fixture gate"); any new drawing on a score without repeats must leave those bytes unchanged (inference from that comment; gate content not read).

---

## 7. Ratchets and line counts

`scripts/ratchets.json` (read), `node scripts/ratchets.mjs` run: "ratchets: OK". New unlisted source file limit: **1000 lines** (`newFileMaxLines`). Module layering (`ratchets.mjs:78-85`): `reader []`, `score [reader]`, `voice [reader, score]`, `analysis [reader, score, voice]`, `markup [reader, score, voice, analysis]`, `insights [reader, score, voice, analysis]`; packages must not import the app.

| file | lines (wc -l) | ratchet ceiling | note |
|---|---|---|---|
| packages/score-parser/src/staff-renderer.ts | 3426 | 3427 | listed |
| apps/web/src/lib/score/Loupe.svelte | 3012 | 3012 | listed, at ceiling |
| apps/web/src/routes/+page.svelte | 5515 | 5534 | listed |
| apps/web/src/lib/markup/MarkupPane.svelte | 1362 | 1364 | listed |
| apps/web/src/lib/score/pairings.ts | 1421 | 1422 | listed |
| apps/web/src/lib/insights/InsightsPane.svelte | 744 | 744 | listed, at ceiling (also under the 1000 new-file limit) |
| packages/score-parser/src/types.ts | 999 | none (1 line under 1000) | any addition breaches the new-file limit unless a ceiling is added in the same commit |
| packages/score-parser/src/unfold.ts | 699 | none | |
| packages/score-parser/src/performance-order.ts | 103 | none | |
| packages/score-parser/src/page-layout.ts | 467 | none | |
| packages/score-parser/src/smufl-metadata.ts | 313 | none | |
| packages/score-parser/src/verses.ts | 34 | none | |
| apps/web/src/lib/analysis/analyze-per-verse.ts | 47 | none | |
| apps/web/src/lib/analysis/watchlist.ts | 695 | none | |
| apps/web/src/lib/score/score-seat.ts | 160 | none | |
| apps/web/src/lib/score/vowel-resolver.ts | 675 | none | |
| apps/web/src/lib/score/correction.ts | 808 | none | |
| apps/web/src/lib/score/loupe.ts | 990 | none (10 under limit) | |
| apps/web/src/lib/score/loupe-render.ts | 278 | none | |
| apps/web/src/lib/score/bar-layer.ts | 129 | none | |
| apps/web/src/lib/score/rebar.ts | 438 | none | |
| apps/web/src/lib/score/clitic-seat.ts | 497 | none | |
| apps/web/src/lib/score/loupe-print.svelte.ts | 212 | none | |
| apps/web/src/lib/insights/insights.ts | 850 | none | |
| apps/web/src/lib/text/witness-lines.ts | 158 | none | |

Other ceilings in the file: LearnContent 4099, InspectorPanel 2432, engine.ts 2048, CalibrationWizard 2124, Drawer 1990, ScoreUploader 867, CorrectionSurface 1227, mnx-parser 1170, musicxml-parser 1167, pipeline.ts 901. (musicxml-parser.ts and mnx-parser.ts exceed 1000 and are listed.)

---

## 8. Prior desk documents

In `docs/memory` (current authority):
- `OPEN.md:2851`, item 11 "Verses" (N.135 stage 3), ruled by Dann 2026-10-20 22:03 to 22:06: unroll strophes into one linear string; the reason is that each vowel/pitch pairing must be met to forecast the voice; score verse numbers decide which verses are sung, else all assumed sung, one tap marks a verse unsung, unconfirmed verses do not feed Insights as established. States seating takes one verse today and that NOT ESTABLISHED whether Insights unrolls the vocal line itself. Last sentence: where verses carry different rhythms on one staff, item 1 applies (Ilya does not guess which notes take the extra syllable).
- `OPEN.md:2686` (E.37 numbering): N.20 = "D3 Job A (per-verse reprint), Job B declined ('unvaried text prints once')". Source doc `claude/e37-numbering-ruled_2026-08-10.md` is NOT in the repo tree (project knowledge only; the find returned nothing).
- `CONTRACT.md:147`: "Do not delete `analyzePerVerse`; N.20 is built on it."; `CONTRACT.md:148`: "Do not unspool a repeat whose text does not vary." (the request's §8 reference; the section numbering not re-checked).
- `OWED.md:653`, `:794`, `:785`: D3's Job A "ruled in E.36 and still unnumbered"; N.20 "scope not located" (older line, superseded by the E.37 identity at OPEN.md:2686). `STATE-archive.md:984`.
- `PRODUCT.md:1068` (Insights comments appear in performance order, repeats and later verses unrolled); `PRODUCT.md:1182` ("bar N" is the one address).
- `INBOX.md:81` (Finale lyric-controls review, 2026-09-04: not adopted "verses (D3's Job A)"); `INBOX.md:242` (D3 there is a different item, "one piece at a time", not strophic); `INBOX.md:324-326` ratified strings: "6 verses assumed sung", "Verse not sung" / « Couplet non chanté ».
- No item, row or ruling dated 2026-11-12 01:05 exists in these files.

In `docs/sessions`:
- `draft-text-seating-design_r1_2026-10-20.md:93-97`: Dann's verbatim rulings on verses and the desk's recommendation (record of OPEN item 11).
- `review-fable-design-text-seating_r1_2026-10-20.md:20-23`: Fable finding 2, strophic edition would grey later verses in Poem; answered by item 11.
- `brief-fable-critique-text-seating_r1_2026-10-20.md:32`: asks whether the alignment holds for strophic songs.
- `memo-fable-manual-edit-outranks-repair_r1_2026-10-20.md:53`: example using "verse 3 (unrolled into one string, item 11)".
- `memo-n160-the-work-and-its-views_r1_2026-09-21.md` (:390) and `brief-n160-the-work-and-its-views_r1_2026-09-21.md:52-56`: engine is verse-aware everywhere but the stored song and library are verse-blind; `analyzePerVerse` called by nothing but its test.
- `memo-n143-musx-verse-fill_r1_2026-09-16.md:84-100`: verse-number handling on T05 (verses [2,3] -> [1,2]); per-verse overlay rendering "parked" (§A.107); staff engraving unaffected.
- `memo-audit-code-catalogue-b_r1_2026-09-24.md:97-99`: unfold.ts "ties to D3's Job A", verses.ts "foundational"; `memo-audit-code-catalogue-a_r1_2026-09-24.md:56-58,145,199`: analyze-per-verse suspect-dead; `n174-B-module-map_r1_2026-09-27.md:175,471-473`, `n174-A-inventory:1519`, `n86-dead-code_r1_2026-09-28.md:42-43`, `brief-code-n174-d23-analysis-module_r1_2026-09-27.md:26-29` (move, never delete), `audit-2026-09-26/invariants.md:14`, `tool-trials.md:75`, `report-desk-consistency-audit_r1_2026-11-01.md:252`: bookkeeping around keeping `analyzePerVerse`.
- `inventory-release_r1_2026-09-13.md:114`, `inventory-release_r2_2026-09-16.md:127`, `ledger-rulings-vs-tree_r1_2026-09-30.md:60`, `LOG.md:6057`: D3 Job A listed as ruled, unnumbered; N.20 identity.
- `review-fable-insights-further-reading_r1_2026-11-03.md:23,29`: two observations from different verses can share a topic line; comments run in performance order.
- Originals NOT in the tree: E.36 §1.14 and §7.7 (D3 ruling), `claude/e37-numbering-ruled_2026-08-10.md`, `claude/e16-vision-and-staged-plan_2026-07-22.md` (cited by OPEN.md:~2870 "the score is the sole authority on repetition and sung structure"), §A.107 (Kimi's rulings "parking" per-verse rendering). The ruling text of D3 Job A / Job B itself is therefore NOT ESTABLISHED from the tree; only OPEN.md:2686's two-clause summary.

---

## What I could not establish

1. The text of the 2026-11-12 01:05 ruling (verse labels, "bar 12, verse 2"); not in the repo.
2. The original D3 / E.36 ruling (Job A reprint per verse, Job B declined) beyond OPEN.md:2686; source docs are project knowledge, absent from the tree.
3. How typed multi-verse Lyrics would be separated (no verse delimiter exists; Lyrics from a score is verse 1 only).
4. Whether anything between the parser and `sungVerseNumbers` filters the IPA-in-lyric-2 case in the sunless fixtures.
5. What `markup-pages.test.ts` and the staff-renderer approval gate pin, and whether the volta label text (`<ending number>`) is kept anywhere.
6. Whether every `+page.svelte` reader of event ids and measure numbers (5515 lines) was found; only the held-measure and pick paths were traced.
7. Maestro's `thinBarlineThickness` and the SMuFL registry codepoints for the repeat glyphs were not read.
8. Exact line numbers marked `~` are approximate (read via section views, not each re-grepped); the unmarked ones were read directly.
