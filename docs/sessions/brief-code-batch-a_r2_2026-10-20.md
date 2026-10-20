# Brief: batch A, seven rows of drawing and pages (QUEUE rows 129, 133, 141, 142, 143, 144, 148)

r1, written by the desk (Opus) 2026-10-20 about 04:30; **r2, about 05:00, applies Fable's review** (`review-fable-batch-a_r1_2026-10-20.md`, SEND WITH AMENDMENTS, 19 amendments; the desk's choices where the review left one to it are marked DESK DEFAULT). Written for Code in the cloud session already running row 128 on `cloud-lane-12`. Every ruling below is Dann's unless marked DESK DEFAULT; a DESK DEFAULT is the desk's choice, his to overrule, and you follow it. Line numbers were read on `Shane` at `c68f9a0f`; row 128 may have moved some, so find each place by its name.

## How to run the batch

1. Work on `cloud-lane-12`, after row 128, in the order below. Each row is its own commit with the subject given, then a push. Never `Shane` or `main`; no pull request; do not merge or rebase `Shane` or `main` into the lane.
2. Do not edit `docs/memory/`. Never commit a `brief-code-*` file; this brief lives in your `/tmp/briefs` only.
3. After each row, run all eight gates. Baselines are the counts your row 128 commit left (its report states them), plus each row's new tests; phonology 267, dictionary 248, web-check 0 errors and 12 warnings, blurb 145, integration 55, ratchets OK. No size ceiling is raised; where a file at its ceiling must change, move code out first, and lower a ceiling a file shrinks below.
4. Each row gets its own report, `docs/sessions/report-code-row<N>_r1_2026-10-20.md`: the diff by file and line, test counts, pictures where asked, and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer.
5. **The contract's line on shared numbers** (Dann 2026-10-19 23:49): where a row changes how a number is computed, its report names every other site that computes the same number and says what depended on them agreeing. Rows 129, 141, 144, and 148 do this; each names its known sites below.
6. Dann's standing rules that bind every row: nothing collides or overlaps on the page (2026-10-11 03:42); no control is part of the printed page, and anything that floats above it never prints (`CONTRACT.md` §8); a touch target under a coarse pointer meets the 44 px floor, and no new touch-geometry exemption is created; six systems a page is the balance Dann likes (2026-10-20 03:24), so no row changes the score's vertical spacing.
7. Pictures go in `docs/sessions/batch-a-shots/`, at 1,440 px and 390 px, English, and French where a string changed. Fixtures: the in-tree Tchaikovsky op. 38 no. 3 voice line (`apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml`, as row 127 used) where a real song serves; Dann's song 2 and song 1 are not in the tree, so build their cases in tests from the bars this brief describes.
8. If a row cannot be done as written, stop that row, report why, and go on to the next.

## Row 129. A beamed triplet is drawn as the publisher draws it

Commit subject: `Row 129: a beamed triplet drawn without a bracket, its 3 over the middle stem`

**Dann 2026-10-19 23:21:** *"The original score does not use the tuplet brackets. This is not an error, just a style differnce. If you want to emulate the publisher, don't use the brackets but be sure to centre the 3 of the bracketless triplet directly over the meeting of the stem terminus with the beam. Human eyes look for that alignment to understnad that the 3 marks the middle note of the desired triple without brackets."* And: *"The slur should change contours slightly to reflect more room because no bracket contradicts it"* (transcribed as written).

**The print** (read by the desk, song 1 p. 2): a triplet whose three notes share one beam has no bracket, its 3 centred over the middle note; with stems up the 3 sits above the beam over the point where the middle note's stem meets the beam; with stems down (eighths in bar 9) the 3 sits above the middle notehead, above any slur. A triplet whose notes are not all under one beam keeps its bracket (two eighths beamed and one flagged).

**Today:** the bracket pass, `packages/score-parser/src/staff-renderer.ts`, "Tuplet pass" (about `:2267-2328`), brackets every run; the record and markup are in `tuplet-bracket.ts` (`BracketRec`, `numeralBox`, `bracketMarkup`); row 126's slur clearance reads `numeralBox`. The parser keeps no `bracket` attribute (`musicxml-parser.ts`).

**Build:**
1. A run qualifies when its count is odd and every one of its notes has an entry in `beamStemById` from the same beam group; the group may hold notes outside the run (DESK DEFAULT, from the print: song 1 bar 10's sixteenth triplet is drawn without a bracket though its beam carries the notes before it). A qualifying run draws no bracket: only the numeral, centred on the middle note's stem x (`beamStemById.get(id).sx`) when the stems are up, and on the middle notehead's x (`placed[k].x`) when they are down, as the print shows; its y clears the beam (stems up) or the middle notehead and any slur over it (stems down), by the bracket pass's present clearances. Any other run, an even-count run included, keeps today's bracket. Keep `data-tuplet="<n>"` on the bracketless group.
2. Row 126's slur clearance clears the numeral's box alone when there is no bracket, so the slur's arch drops to the room that leaves (Dann's second sentence). Keep the numeral clear of the slur and the slur clear of the numeral: no collision.
3. `staff-renderer.ts` is at its ceiling (3432): put the new logic in `tuplet-bracket.ts`.

**Shared numbers to name:** the numeral's box, read by the bracket markup and by row 126's slur clearance.

**Tests:** a beamed triplet (stems up, stems down) draws no bracket and its numeral's centre x equals the middle stem's x (stems up) or the middle notehead's x (stems down) within 0.5 units; a triplet of two beamed notes and one flagged keeps its bracket; an even-count run keeps its bracket; the slur over a bracketless triplet sits lower than over a bracketed one and clears the numeral. Rewrite `row126-slur-clearance.test.ts`'s `brackets()` reader (about `:51-52`) for both forms; `staff-renderer.test.ts` about `:632-635` keeps its `data-tuplet="3"` expectation. **Expected to change:** the six approved SVGs under `packages/score-parser/src/approval/__approved__/` that carry `data-tuplet="3"` (`renderDemo`, `renderDemoDotted`, `renderDemoUnmeasured`, each `.smufl` and `.primitive`; the demo fixture's triplet is beamed, `demo-fixture.ts` about `:105-107`); re-approve them, and the report lists each with its numeral's position before and after and confirms nothing else in them moved. **Pictures:** `packages/score-parser/src/fixtures/row126-song1-bars-9-10.musicxml` (bar 9 and bar 10), before and after; the report also gives that fixture's system height (viewBox height) before and after, since a lower slur can change where pages break.

## Row 133. The loupe says "Dotted quarter", and French rests take their own names

Commit subject: `Row 133: the loupe and the tempo chips name dotted values in words`

**Ratified by Dann 2026-10-19 23:41** (`docs/sessions/ratified-loupe-dot-words_2026-10-19.md`, which is in the tree: read it and copy every string from it exactly).

**Notes**, in the loupe's readout and in a tempo chip's spoken beat name:

| Value | Dotted, EN · FR | Double-dotted, EN · FR |
|---|---|---|
| Whole | Dotted whole · Ronde pointée | Double-dotted whole · Ronde doublement pointée |
| Half | Dotted half · Blanche pointée | Double-dotted half · Blanche doublement pointée |
| Quarter | Dotted quarter · Noire pointée | Double-dotted quarter · Noire doublement pointée |
| Eighth | Dotted eighth · Croche pointée | Double-dotted eighth · Croche doublement pointée |
| Sixteenth | Dotted sixteenth · Double croche pointée | Double-dotted sixteenth · Double croche doublement pointée |
| Thirty-second | Dotted thirty-second · Triple croche pointée | Double-dotted thirty-second · Triple croche doublement pointée |
| Sixty-fourth | Dotted sixty-fourth · Quadruple croche pointée | Double-dotted sixty-fourth · Quadruple croche doublement pointée |

**Rests:** English keeps the readout's rule that a rest leads with the word: "Rest · Dotted eighth". French names the rest by its own word, alone, in place of « Silence · <value> »:

| Rest | Plain | Dotted | Double-dotted |
|---|---|---|---|
| Whole | Pause | Pause pointée | Pause doublement pointée |
| Half | Demi-pause | Demi-pause pointée | Demi-pause doublement pointée |
| Quarter | Soupir | Soupir pointé | Soupir doublement pointé |
| Eighth | Demi-soupir | Demi-soupir pointé | Demi-soupir doublement pointé |
| Sixteenth | Quart de soupir | Quart de soupir pointé | Quart de soupir doublement pointé |
| Thirty-second | Huitième de soupir | Huitième de soupir pointé | Huitième de soupir doublement pointé |
| Sixty-fourth | Seizième de soupir | Seizième de soupir pointé | Seizième de soupir doublement pointé |

Example: « B♭3 · Noire · Point » becomes « B♭3 · Noire pointée »; "B♭3 · Quarter · Dot" becomes "B♭3 · Dotted quarter".

**The English of the rest keys** (every key in `i18n.ts` holds both languages): each rest key's English value is the English readout fragment, built only from existing words: "Rest · Eighth", "Rest · Dotted eighth", "Rest · Double-dotted eighth", and so for every value, with U+00B7 between spaces as `parts.join(' · ')` writes it. The function returns the whole fragment for a rest in either language, so neither readout pushes `loupe.rest` itself any more (`loupe.rest` stays: `CorrectionSurface.svelte` about `:695` uses it).

**The beat clause** (`loupeNoteLine`, `+page.svelte` about `:1163-1185`, pushes rest or pitch, then the beat clause, then the value and dot): the rest's name takes the first slot and the value slot is left empty, « Demi-soupir pointé · temps 2 »; English keeps its shape, "Rest · beat 2 · Dotted eighth" (DESK DEFAULT).

**A base the tables do not name** (`'128th'`, `'breve'`; `NoteBase`, `types.ts` about `:588`) keeps today's readout: `durationWord(base)` then `correct.dot` or `loupe.doubleDot`. No new string; `loupe.doubleDot` stays.

**Today:** `apps/web/src/routes/+page.svelte`, the two readouts (about `:1112-1127` and `:1176-1185`) push the value word, then `correct.dot` or `loupe.doubleDot`; a rest pushes `loupe.rest` first. `apps/web/src/lib/tempo/beat-glyph.ts`, `beatName`, appends `correct.dot`; pinned at `apps/web/src/lib/tempo/tempo.test.ts` about `:186`.

**Build:** one pure function that returns the value's name from base, dots, rest or note, and language, built from string keys holding the tables' words (DESK DEFAULT: whole phrases as keys, not words assembled by grammar, so the French agreement stays as ratified). Both readouts and `beatName` call it. `+page.svelte` is at its ceiling (5641): the readouts may only get shorter. Unchanged: the Corrections dot cell keeps "Dot" / « Point » (`CorrectionSurface.svelte`, the dot cell), a control, not the readout. No string other than the tables' is added or changed. Rewrite two comments to the new fact: `beat-glyph.ts` about `:10-14` (no dotted adjective exists; the label owed to Dann) and `+page.svelte` about `:1140-1146` (the DESK DEFAULT that "dotted quarter" would be a second name); the page's comment edit makes the file shorter, not longer.

**Tests:** every cell of both tables in both languages, read from `i18n.ts` and compared code point by code point with this brief's table; the readout for a dotted note, a double-dotted note, and a dotted rest in both languages; `beatName('half', 1, 'en')` is "Dotted half". **Pictures:** the loupe on a dotted quarter and on a dotted eighth rest, EN and FR.

## Row 141. A run of empty bars stays one rest, and no system runs past the line

Commit subject: `Row 141: a tacet run is packed whole, and a system is measured as it is drawn`

**Dann 2026-10-20 03:01**, on song 2: *"why is bar 28 truncated at the end of its system? Why is a multimeasure rest (bar 28) followed by an additional measure of rest (bar 29)?"*

**Reproduced by the desk** on `f726044b` with his file: bars 23 to 29 are empty, one tacet run (indices 22 to 28; `tacetRuns`, `staff-renderer.ts` about `:849`). Two causes:
1. The packer in `paginateScore` (`packages/score-parser/src/page-layout.ts`, "Pack measures into systems", about `:260-276`) adds one measure at a time and may close a system inside a tacet run, so the run of 7 draws as 6 and then 1.
2. The packer's measure of a range (`sliceWidth`, about `:144`) and the render of the same range disagree. With `paginateScore(parsed, analyzed, { pageWidth: 816, marginLeft: 0, marginRight: 0 })` and the clef treble or treble-8vb, the system of indices 18 to 27 measured 813 by `sliceWidth` and rendered 923 wide, so its end was cut off (the 6 above the rest, and the closing barline).

**Build:**
1. A tacet run is packed whole: a system never ends inside one. A run too wide for a fresh system still goes alone on its own (it is narrow in practice; `TACET_REST`).
2. Find why `sliceWidth` and the render differ for a range ending in a tacet run, and make them agree. Start at `layoutColumns`'s run filter (`staff-renderer.ts` about `:1657-1659`, which keeps a run only when it lies wholly inside the range, while the render's slice sees a partial run as whole); the review reads this as the single cause of both symptoms, not run. If it is, the fix is in a file at its ceiling (3432): move the filter and `openRun` out, or change it in place without adding a line. State the cause in the report with the lines.
3. No repack guard (DESK DEFAULT r2, on the review's cost note: it renders every system twice). The test below holds the line instead.
4. Vertical spacing does not change.

**Reproduce it in a test:** build a 3/4 score of 109 measures whose voice part is empty in measures 1 to 6, 23 to 29, 66 to 68, and 104 to 109, with three quarters or a half and a quarter elsewhere; key A major; treble clef. At page widths 640, 700, 760, and 816, with `marginLeft: 0` and `marginRight: 0` as the reproduction did, no system ends inside a tacet run, and no rendered system is wider than its line.

**Shared numbers to name:** a range's width, computed by `sliceWidth` and by the render (`renderSystemSlice` and the renderer's column layout); the desk found a second disagreement at page width 700 (systems 62 to 66 and 67 to 70 rendered 789) and at 760 (101 to 107): include them. Also `apps/web/src/lib/score/loupe-render.ts` about `:91` and `:267`, which call `renderSystemSlice` on one measure and on a range.

**Pictures:** the run before and after, at 1,440 and 390.

## Row 142. The notes begin on the last page of music when they fit

Commit subject: `Row 142: Markup's notes start below the last system when they fit`

**Ruled by Dann 2026-10-20 03:03:** *"Page ;ayout for pages 3 and 4 waste space. There is not reason the prose onm page 4 can't be delivered on page 3 with no crowding . Make it so."* (transcribed as written). This replaces, where the notes fit, his ruling of 2026-07-18 that the notes always open their own sheet (cited in `MarkupPane.svelte` about `:748` and `:885`).

**Today:** `apps/web/src/lib/markup/MarkupPane.svelte` builds `notesSheets` with `packNotes` (`apps/web/src/lib/markup/notes-pages.ts`), each a separate `commentary-page` after the score pages; `NotesColumn` measures the column once.

**Build (DESK DEFAULT on the details):**
1. `paginateScore` reports, for its last page, the y where its last system ends (`y + s.height`, `page-layout.ts` about `:446`) and the gap that page used (`gap`, about `:417-427`, the carried gap, not always `o.systemGap`); the placement reads those. The notes (the withheld statement, the octave notice, the watch band) begin below the last system on the last page of music, after that gap, when at least their first piece fits whole above the footer. What does not fit runs on to further sheets exactly as `packNotes` does today.
2. When the first piece does not fit, nothing changes: the notes open their own sheet.
3. The running header, the footer, and the page count stay right; the page count drops by one where the notes move up.
4. `MarkupPane.svelte` is at its ceiling (1370): move code out first (`packNotes` takes the first window's height; the placement lives in a module or component of its own).
5. No collision with the last system's lyrics or markings.
6. The measuring `NotesColumn` (`MarkupPane.svelte` about `:1051-1053`, inside the first notes sheet) renders even when no notes sheet remains: move it out of the `{#each notesSheets}` loop.

**Shared numbers to name:** the page count, at `MarkupPane.svelte` about `:902` (`totalPages`), `:1007` (`profile.scorePageAria`'s total), `:1035` and `:1054` (both footers' `pageNumber` and `totalPages`); what depends on them agreeing is the footer numbering across the two kinds of page.

**Tests:** `packNotes` with a first window short enough for nothing, for the octave notice alone, and for everything; the page count in each case. **Pictures:** song 2's last two pages before and after (rebuild its case: a score whose last page holds two systems, with the octave notice), and a case where the notes still need their own sheet.

## Row 143. One credit in all three footers

Commit subject: `Row 143: the footer credit is the same on Text, Markup, and Insights`

**Ruled by Dann 2026-10-20 03:08 and 03:27:** *"make the footers identical, Credit lieder.net on GUIDE but not in the footers"*; *"the line should still take each document's colour,"*. This replaces his ruling of 2026-09-11 that Insights alone strikes the LiederNet clause.

**Build:**
1. `footer.attribution` (`apps/web/src/lib/i18n.ts` about `:872-875`) loses its LiederNet clause in both languages: in English ", test text via <a ...>www.lieder.net</a>"; in French ", textes d'essai via <a ...>www.lieder.net</a>" (the apostrophe as the file has it). The period that closed the clause now closes the sentence before it. Nothing else in the string changes; write no new French.
2. `strikeLiederClause` and `LIEDER_CLAUSE` (`apps/web/src/lib/insights/insights.ts` about `:793-815`) are removed, and Insights passes no `attribution` override, so all three tabs print `footer.attribution` as it is.
3. The line keeps each document's colour: unchanged.
4. **The Guide already credits LiederNet** in both languages (`apps/web/src/lib/components/Reading/GuideContent.svelte`, the "Texts." paragraph, about `:585` and the French at about `:289`): nothing to add there. Confirm it renders in both.

5. Remove `PageFooter.svelte`'s `attribution` prop (about `:39-40`, `:56`, `:60`) and its comment; delete the N.127 foot test at `insights.test.ts` about `:436-451` and its import at about `:35`.

**Tests** (no DOM test environment is installed; read `.svelte` files as text where a component is involved, as `install-prompt-gate.test.ts` does): `t('footer.attribution', lang)` contains no "lieder.net" in either language and still contains "kaikki.org" and "4.0</a>). "; the sources of `InsightsPane.svelte`, `MarkupPane.svelte`, and the Text page's footer calls pass no `attribution` to `PageFooter`; `GuideContent.svelte` about `:289` and `:585` still carry the LiederNet link.

## Row 144. The clef choice speaks once on the Paper, then lives in the clef

Commit subject: `Row 144: the clef choice on the Paper, once, then in the clef itself`

**Ruled by Dann 2026-10-20 03:15**, on his need of 03:11 and 03:14: *"What I doin't yet see is the easy control for changing clefs at will"*; *"the user will propbaly only want this control the first time they view thier score. the Control should not persist... What is possible to accommodate a vital control that must recede until it is needed again? It must also work for mobile."* (transcribed as written). He chose: the first time a song is drawn, a floating chip beside page 1's first clef names the reading and offers the choices; it recedes once the singer chooses or scrolls on; afterwards a tap on the drawn clef brings the same choices back; on a coarse pointer the choices open as a sheet from the foot of the screen. Nothing prints. The Input band's Clef row stays as the permanent home, as text (Dann 2026-10-20 03:44: no glyphs in its menu for now).

**Today:** row 127 built the Clef row (`apps/web/src/lib/score/ClefReceipt.svelte`), shown only for a treble-printed line read an octave lower; `clef-choice.ts` (`readingClef`, `ClefChoice` = 'ottava' | 'bass' | 'as-written') makes 'bass' inert outside that case; `clef-ui.svelte.ts` holds the state; `staff-renderer.ts` marks the clef group `data-clef` (about `:2178`).

**Build (DESK DEFAULTS, each the desk's):**
1. **The choices, and what each draws** (DESK DEFAULT r2; the desk's table, which you follow and do not extend). Stored values: `null` stays "for your range" (Ilya's suggestion, `resolveVocalReadingOctave`); `'as-written'` and `'bass'` stay; add `'ottava'` (treble with an 8 below, chosen) to `OctaveReading` (`types.ts` about `:39`, `library.ts` about `:242`, `document.svelte.ts` about `:100`, `:290`, `:344`). Old stored songs read exactly as before.

| Printed clef | For your range (`null`) | As written | Treble with an 8 below (`'ottava'`) | Bass (`'bass'`) |
|---|---|---|---|---|
| Treble | today's rule: suggested shift -1 draws treble with an 8 below, shift -1 (row 127); suggested 0 draws treble, shift 0; suggested +1 draws as today | treble, shift 0 | treble with an 8 below, shift -1 | bass, shift -1 |
| Treble with an 8 below | today's rule | treble with an 8 below, shift 0 | same as as written | bass, shift 0 |
| Bass | today's rule | bass, shift 0 | treble with an 8 below, shift 0 | same as as written |

Where two choices draw the same thing, the menu offers one of them, "As written" (DESK DEFAULT). When the stored value is not `null`, the menu also offers "Read for your range" (`octave.toForRange`, ratified), which stores `null`. The Clef row in the Input band shows on every song with a voice line, with the same choices; its as-written option takes `octave.toAsWritten` on every song (`ClefReceipt.svelte` about `:19-23` labels it "Treble" today, wrong off a treble line).
2. **The chip:** beside page 1's first clef, above the Paper, never printed. Its text uses only ratified strings: the reading's sentence (`octave.readLower`, `octave.readHigher`, or `octave.asWrittenState`) and the choices (`upload.ask.clefTrebleOttava`, `upload.ask.clefBass`, `octave.toAsWritten`, and `octave.toForRange` where item 1 offers it). If you need any other string, stop and report it; do not write one.
3. **When it shows:** once per song, on the song's first drawing in Markup; it recedes when the singer chooses, presses Escape, or scrolls page 1's first system out of view. Store that it was shown with the song (DESK DEFAULT; one boolean on the song record, validated as `library.ts` validates `octaveReading`).
4. **Afterwards:** the drawn clef on any page is a button (a hit area over the `data-clef` group, invisible, at least 44 by 44 px under a coarse pointer), with an accessible name built from `upload.ask.clef` and the current choice; it opens the same choices.
5. **On a phone** (coarse pointer): the choices open as a sheet from the foot of the screen, each target at least 44 px tall. On a fine pointer: a small menu beside the clef.
6. Keyboard: the chip and the clef button are reachable by Tab, the choices by arrows, Escape closes. Screen readers hear the sentence and the choices. The chip, the clef button, the menu, and the sheet are hidden under `@media print` (`CONTRACT.md` §8).
7. `MarkupPane.svelte` (1370) and `+page.svelte` (5641) are at their ceilings: the chip and the clef button are a component of their own; the pages may only get shorter.

8. **Insights reads the same octave as Markup:** today `InsightsPane.svelte` about `:163-165` takes `suggestedShift` from `resolveVocalReadingOctave` and `octaveShift` from the boolean prop `octaveAsWritten` (`+page.svelte` about `:4473`). After this row Insights takes its shift from `readingClef`, so the two tabs never disagree; the compass stave keeps `chooseClefForSpan`.

**Shared numbers to name:** the reading's octave shift and clef, computed in `clef-choice.ts` (`readingClef`), `resolveVocalReadingOctave` (score-parser), Markup's pagination, the Loupe (through the bundle's clef), the print, `InsightsPane.svelte` about `:163-165` and `+page.svelte` about `:4473`, and Insights' compass stave (which follows the range and does not change).

**Tests:** under vitest, as pure functions: every cell of item 1's table, for a low range, a high range, and no range; old stored values read as before; the shown-once flag. In a Playwright test in `apps/web/e2e/` (the eight gates do not run it; the report says it was run and how): the chip on the first drawing only; the clef button opens the choices; Escape closes; under a coarse pointer at 390 px the hit area is at least 44 by 44 CSS px after the page's scale (the 816 px page draws at about 0.48 there); nothing of the chip prints. **Pictures:** the chip on page 1, the menu, and the phone sheet, at 1,440 and 390, EN and FR.

## Row 148. No empty circle over a word

Commit subject: `Row 148: the provenance circle draws only with its icon`

**Dann 2026-10-20 03:33**, on Text of song 2, the enclitic «ж»: *"why is this empty sigil circle assigned to this enclitic?"*

**Read by the desk** in `apps/web/src/lib/components/Paper/WordStack.svelte`: the icon area shows when `showProvenance && !isInferred` (about `:155`); `showProvenance` excludes only the sources dictionary, supplement, clitic, and none (about `:110-116`); a clitic is never `isInferred` (about `:107` and `:119`); a word with no stress data gets the source 'inferred' (`apps/web/src/lib/pipeline.ts` about `:666-671`); the frame's four icons cover only 'user-dictionary', 'user-composer', 'user-override', and 'yo-restored' (about `:157-167`). So a clitic whose source is 'inferred' draws the frame empty. That «ж» takes this path is the desk's reading of the code: confirm it in a test first.

**Build:** the provenance frame draws only when one of its four icons applies (DESK DEFAULT). The condition moves to a pure function (the four iconed sources, as a set) in a `.ts` module `WordStack.svelte` imports. No other behaviour changes: an inferred non-clitic word keeps its verify treatment. One more source is silenced by the same change: `'yo-normalized'` (`packages/phonology/src/engine.ts` about `:779`, carried by `pipeline.ts` about `:664`), which draws the empty frame today too; the report names it. `pipeline.ts` is at its ceiling (1022) and this row does not touch it.

**Shared numbers to name:** whether a word is marked, decided by `showProvenance`, `isInferred`, `isClitic`, and the icon branches in `WordStack.svelte`; `apps/web/src/lib/provenance.ts` about `:60-68` holds a second `showProvenance` with other exclusions and no caller outside its file and tests (leave it, and say so; DESK DEFAULT); no code sets the source `'clitic'`, so the exclusion at `WordStack.svelte` about `:113` is dead (say so in the report; do not remove it); and anything else that reads `stressSource` for display (search for it and list each site).

**Tests:** call the pure function on `processText`'s output, as `typed-hyphens.test.ts` and `old-spelling.test.ts` read `stressSource`: «ж» in «Ну-те ж все разом» gets no frame; each of the four sources gets its icon; an inferred non-clitic word keeps its verify treatment. **Pictures:** the line «Ну-те ж все разом» in Text, before and after.

## When the batch is done

Push, then end with one short message listing each row's commit, its report's path, and the gate counts after the last row. Then stop and wait in this session.
