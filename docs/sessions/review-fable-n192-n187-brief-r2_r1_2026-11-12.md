# Review: brief-code-n192-n187-key-changes-grace-notes_r2 (Fable, r1, 2026-11-12)

Read in full: the brief r2, the scout packet r1, the survey r1, Gould pp. 125 to 130 as filed, and the named sections of `OPEN.md` and `CONTRACT.md`. Clone confirmed at `dc078b95` (`git log -1 --format=%h`). The section "N.192 AND N.187 SHIP WITH THE SHARE" is absent from the clone; the rulings were taken as given in the task. Every file:line below was opened this session unless marked otherwise.

## Verdict

**SEND WITH AMENDMENTS.** All twenty-one are applied before Code gets the brief (CONTRACT §1 item 19). Steps 0 to 5 are sound in outline. Steps 6 and 6b name the wrong function for their work and are sent only as rewritten in amendments 6 and 13.

The separate `graceNotes` list (design decision 1) is the right call and I confirm it: because `vocalLine` does not change, every saved song's corrections, pairings, bar answers, and library fingerprint still land after a re-parse, and the bar sums, the seating, and the text-side ordinals (`extend-convention.ts`, `old-reader-seats.ts`, `fixture-rule.test.ts:81-98`) are untouched by construction. Its cost falls on Corrections and the Loupe, which the brief underspecifies. Most amendments are there.

## Amendments

### Data and parser

**1. The grace slur carry onto `vocalLine` stays as it is. The grace note records its slur as well.**
Evidence: `musicxml-parser.ts:703-711` moves a grace note's slur start to the next kept note; `pairSlurs` (`notations.ts:131-160`) then pairs over `vocalLine` only. `n188-markings.test.ts:127-143`, case a (grace start, C, D stop) expects the slur C to D. If the start lives only on the grace note, D's stop finds nothing open (`notations.ts:147-150`), the C to D melisma is lost, and the first-pass seat puts a syllable on D. That moves every later vowel on any saved scan with such a slur, against CONTRACT §0.1. `underlay-prepare.ts:154-160` mirrors the same carry on the text side (scout §6, not opened by me) and would part company with the parser.
Change, step 2, second bullet: replace "and keep the grace note's own slur ends on the grace note" with "and leave the slur carry at :703-711 exactly as it is (`vocalLine` and `pairSlurs` see what they see today); the grace note additionally records `slurred: true` where a slur starts on it". Step 2, tests: replace "`n188-markings.test.ts:127` changes to expect the grace note's slur on the grace note" with "`n188-markings.test.ts:127-143` passes unchanged; a new test reads `slurred` on the grace note". Design decision 1: replace `slurs?` with `slurred?`.

**2. `GraceNote` stores no `measureIndex`.**
Its bar is its principal's. A stored copy goes stale when `rebar` moves the principal to another song bar (`rebar.ts:395-432` re-indexes measures and lists; `graceNotes` would ride through the `...score` spread at :424 in reading bars), and CONTRACT §8 says "Do not store anything derived". Keyed by principal alone, `sliceScore` keeps a grace note when its principal is in the slice, `performance-order.ts:86-102` needs no change (events are reused by reference, so a repeated bar draws its grace notes on each pass), and `rebar` needs none.
Change, design decision 1: the shape is `{ id, principalId, after?: true, pitch, base, slash?, slurred? }`. Step 2, fourth bullet: replace "`sliceScore` (`page-layout.ts:122-141`, filtered and rebased by measure as events are), `performance-order.ts:86-102` (grace notes follow their principal)" with "`sliceScore` (`page-layout.ts:122-141`: keep a grace note whose principal is in the slice); `performance-order.ts` is unchanged, with a test that a repeated bar draws its grace notes on both passes".

**3. The principal rule covers every case.**
Change, step 2, third bullet, to: "The principal is the next kept note (not a rest) in the same measure. With none, the grace note is an after-grace of the last kept note in the measure (`after: true`). With no kept note in the measure, it takes the next note in the line; with none, the last note before it; with no note at all, it is dropped with the existing warning. A supplied `<note id>` on a grace note is never honoured; `resolveSuppliedIds` (`musicxml-parser.ts:941`) keeps skipping grace notes, and only its comment (:930-932) changes."

**4. `types.ts` cannot take the field the way the brief says.**
`ParsedScore` is declared in `types.ts` (999 lines, limit 1000, `scripts/ratchets.json:3`); a field cannot be "added in the new file's module".
Change, step 2: "`types.ts` gains exactly one line, `graceNotes?: import('./grace').GraceNote[];`, optional so that MNX, `demo-fixture.ts`, and every test builder compile unchanged. If step 0 finds the 1000-line limit is exclusive, move one type out of `types.ts` in the same commit."

**5. What a scan's grace note draws as.**
homr writes a bare `<grace/>` with no `slash` attribute (`generate-main.ts:435-438`), so every scanned lone grace note would draw unslashed and the singer would press Slash on each. The parser already knows a file's origin (`musicxml-parser.ts:652-653`, `resolveOrigin`).
Change, design decision 1, add: "`slash` is undefined where the file does not say. DESK DEFAULT: a lone, flagged grace note with `slash` undefined in a file whose origin is the scan reader draws slashed (Gould p. 125: the single grace note is a small quaver with a stroke); in any other file, undefined draws unslashed, as MusicXML defines it. Step 0 counts slashed and unslashed lone grace notes in row 114's truth files and reports the count."

### Corrections: grace notes (step 6)

**6. Step 6 names the wrong function. Rewrite its first two bullets.**
Evidence: `applyCorrections(vocalLine, map): VocalLineEvent[]` (`correction.ts:408-411`) takes and returns events only. It cannot "move a note into or out of `graceNotes`". The corrected score is assembled in `bar-layer.ts:55-60` (`applyCorrections`, then `rebar`). Also, `entered.after` means the entry this one follows (`entry.ts:226-235`; `emitEntered`, `correction.ts:430-450`); the brief's "its `after` the note it precedes" reverses that and would seat a hand grace note as a full note after its anchor.
Replace step 6, bullets 1 and 2, with:
- "`NoteCorrection` gains `grace?: { slash: boolean } | 'none'`, and `withCorrection`'s field list (`correction.ts:344-353`) gains it.
- A read full note with `grace` set is left out of the line by `applyCorrections`, exactly as a deleted note is (entries hung on it still emit, :459-464), so the bar's sum, the onsets, and the seating behave as for a deletion.
- A hand-added grace note is an entered record with `grace` set and `entered.after` the entry it follows, as every entry; `applyCorrections` skips it when emitting the line and still emits what hangs on it.
- A read grace note made a full note (`grace: 'none'` on its own id): `applyCorrections` gains an optional third argument, the read `graceNotes`, and emits that grace note as an event (its own id, its `base` as its duration) immediately before its principal. All four production callers pass it: `bar-layer.ts:55`, `time-signature.ts:80`, `rebar-notes.ts:105`, `rebar.ts:152`.
- A new pure function in a new module (`apps/web/src/lib/score/grace-layer.ts`) returns the corrected grace list from the read list, the map, and the corrected line: read grace notes with their `pitch`, `base`, `slash`, and `deleted` corrections applied; full notes made grace; hand-added ones. Each attaches to the next note standing in the line after its place (a deleted or converted principal passes its grace notes on, as `time-signature.ts:69-91` passes a mark on). `BarLayer` puts the result on `score.graceNotes`.
- `orphanIds` (`correction.ts:789-808`) counts a read grace note's id as live. Today a correction keyed by `m17-1-2~g1` would be reported in the drawer as a correction that did not land (`+page.svelte:818`)."

**7. Selection is specified, not gestured at.**
Evidence: `neighbourId` filters `vocalLine` (`correction.ts:706-717`; called at `correction-verbs.svelte.ts:254`, `:312-313`); `measureHold` lists ids from `score.vocalLine` (`loupe-fit.ts:177-185`); the Loupe treats any marked id outside its own events as foreign ink (`Loupe.svelte:1859-1866`); the renderer gives each event a `data-hit` rectangle (`staff-renderer.ts:2666`, `:2940`).
Replace step 6, bullet 3, with: "Step 0 lists every reader of the selected id (`selectedEvent` in `correction-verbs.svelte.ts`, the `neighbourId` callers, `measureHold`, `positionsInMeasure`, the Loupe's `ownEvents`, the `data-hit` click path). Step 6 serves a grace id at each: one helper in `grace-layer.ts` gives the selection order (each grace note before its principal, an after-grace after it); `measureHold.ids` includes the bar's grace ids; the renderer gives each grace note its own `data-event-id` group and its own `data-hit` rectangle, the width of its own room, never overlapping its principal's. Done when: on desktop, ArrowRight from the note before a grace note lands on the grace note, then on its principal; at 390 px, a tap on the grace note selects it and a tap on its principal selects the principal (Playwright, both)."

**8. Two cells, not three. DESK DEFAULT until Dann rules (question 1).**
The station already holds Rest, Delete, Tie, Barline, Time signature, and Restore (`CorrectionSurface.svelte:660-691`), and this lane adds Key signature. The Rest cell is the precedent: on a note it converts both ways, and "it is the one cell in this station that a gap does not disable" (:658-660), where it enters a rest. A Grace note cell with the same grammar covers both tasks: in a gap it enters a grace note before the note that follows; on a full note it makes it a grace note; on a grace note it makes it a full note again. The `/` key keeps the one-key add from a selected note on desktop.
Change, design decision 5 and step 6, bullet 4: "Two cells beside Rest and Tie: **Grace note** (engaged on a grace note; in a gap it adds one before the next note, at that note's pitch, an eighth, slashed, and selects it) and **Slash** (shown only on a selected lone, flagged grace note; a grouped grace note draws no stroke, Gould p. 125). Keys: `/` adds a grace note immediately before the selected note or grace note (after any already before a selected principal); `;` is the Grace note cell." Remove `loupe.graceAdd` from the strings; `correct.grace` becomes three accessible names by state, as the barline cell's two are.

**9. Say what the other verbs do on a selected grace note.**
Change, step 6, add: "On a selected grace note: the pitch verbs, Delete, Restore, and the duration digits act (a digit sets its `base`; nothing in the bar moves). Dot, Rest, Tie, Barline, Time signature, and the tuplet row are disabled. Test each."

**10. The brief promises a syllable on a grace note and builds no way to place one.**
Evidence: the seat's targets are the line's non-rest ids (scout §1e, `slur-seat.ts:92`, not opened by me); a grace note is not in the line, and no step adds a placing verb. The step 6 test "one vowel per note holds where a singer places a syllable on a grace note" cannot be written.
Change: in "What the singer gets", replace "It takes no syllable unless the singer places one" with "It takes no syllable. Where a print sets a syllable under a grace note, the singer turns it into a full note (Grace note, off), and it takes a syllable as any note does." In the CONTRACT §0.1 bullet, drop the clause after the semicolon. Delete the last test clause of step 6. The desk tells Dann in one line that this is how the 2026-11-05 00:19 ruling's "force this option manually" is met in this lane (the bar may then read "over").

### Drawing key changes (step 3)

**11. The Loupe handle is decided now, and the Loupe's head must show the key in force.**
Evidence: `headerRightOf` takes the rightmost `[data-key-signature]` in the whole system (`loupe-ink.ts:181-193`), so a mid-system signature with that handle would move the head bound to the middle of the system. The Loupe strips the page's mid-system meter from its clone and accounts for its room (`Loupe.svelte:799-822`, `:1104-1108`; `loupe-ink.ts:111`, `:135`). The Loupe's head is the system's own head, so in a bar after a mid-system change it would show the old key while the body's accidentals are judged against the new one.
Change, step 3, replace the bullet "The new glyphs carry a data attribute of their own..." with: "The mid-system and courtesy signatures sit in one group stamped `data-key-change`, never `data-key-signature`. In the Loupe, `data-key-change` is treated at every site that treats `data-meter` (`loupe-ink.ts:111`, `:135`; `Loupe.svelte:806`, `:956`, `:1108`): stripped from the clone, its room not counted as music. The Loupe's head shows the key in force in the held bar; step 0 reads how the head is built and reports the method before step 3 builds it. Done when (Playwright, desktop and 390 px): with the fixture's measure 6 held, the Loupe's head shows one flat and the head bound sits where it does for measure 2." Remove the matching item from step 0's first bullet and from design decision list.

**12. The courtesy signature needs a named mechanism.**
Evidence: a slice holds only its own measures (`page-layout.ts:123-125`), so the renderer cannot see the key of the bar after the slice; N.139 solved the mirror case with `incomingTimeSignature` (`page-layout.ts:243`). The system "ends AT its barline. No empty stave past it" (`staff-renderer.ts:2014-2023`, Dann's ruling of 2026-08-06), and `width = contentRight` is what keeps `sliceWidth` and the render in step.
Change, step 3, third bullet, to: "At a change that falls at a system break, `renderSystemSlice` and `sliceWidth` pass a new option `outgoingKeySignature`, the key of `parsed.measures[toMeasure + 1]` where it differs from the slice's last measure. The system then draws its closing barline, the courtesy signature (cancelling naturals included), and stave lines to the courtesy's right edge, all inside the system's width: the columns justify to the target width less the courtesy's room. This is N.192's own spec (Gould p. 152) and departs from the 2026-08-06 'ends at its barline' ruling at such a system only; say so in the report. `incomingAccidentals` is empty where the slice's first measure declares a key (nothing carries across a change). Tests call `renderSystemSlice` and `sliceWidth` with explicit measure ranges, not a page width chosen to force the break."

**13. Smaller points in step 3, one change each.**
- A bar that changes key and time together: the order is barline, key signature, `METER_KEY_CLEAR_SP`, time signature, as the head has it (`staff-renderer.ts:818-826`). Add such a bar to `key-changes.musicxml` and test the room.
- A key change inside a multibar rest: the run breaks at the change. Step 0 reads how `tacetRuns` (`:854`) breaks at a meter change and step 3 does the same for a key.
- The double barline: delete "where the print's own barline style is kept by the parser, that wins (report whether it is)". The parser reads no barline style (no `bar-style` in `musicxml-parser.ts`; `tch-3.musicxml` carries one at P1 measure 37 that is not read). Add: "a repeat barline or a final barline stands in place of the double barline; at a system break the double barline closes the earlier system." It stays a DESK DEFAULT (question 2).
- `transposition.ts:413-424`: the function is `doubleAccidentalsDrawn`, not `doubleAccidentalCount` (the type's name).

### Corrections: key changes (step 6b)

**14. Step 6b names the wrong function too. Rewrite its first two bullets.**
Evidence: as amendment 6. The time signature mark it copies is applied by `rebar` (`time-signature.ts:7-8`; `rebar.ts:395-432`), with two write-time rules (`time-signature.ts:12-19`), and survives Restore through `clearCorrection` and `amendsNote` (`correction.ts:369-388`).
Replace with:
- "`NoteCorrection` gains `keySignature?: { fifths: number; through: 'next' | 'end'; notes: 'follow' | 'keep' } | 'remove'` on the entry that opens the bar. `withCorrection` (:344-353), `clearCorrection` (:373-378), and `amendsNote` (:386) each gain it, so Restore on the opening note does not take the key mark with it.
- A new module `key-signature.ts`, the sibling of `time-signature.ts`, holds the card's arithmetic, with the same two write-time rules: one mark stands in a bar; 'to the end of the song' removes her own later marks. Marks therefore never overlap.
- The layer is applied where `rebar` builds the corrected score (`rebar.ts:395-432`), not in `applyCorrections`: each bar in scope takes the new key on `Measure.keySignature` (keeping the bar's `mode`), and `keySignatures` is rebuilt from the measures; a mark on the first bar replaces entry 0, so the head, the transposition ruler, and `engraveInKey`'s `printed` (`transposition.ts:332-333`) all see it. `mergeBlocked` (`rebar.ts:180`) reads the corrected keys.
- 'remove' gives the bars to the next change the key of the bar before. It is not offered on the first bar.
- 'follow', bar by bar: the old key is the key that bar had before this mark. A note whose alteration equals the old key's for its letter takes the new key's. It never moves a pitch the singer set (a `pitch` correction or a hand entry), and it applies to grace notes in scope as to notes."

**15. A guard on 'follow', and a measurement.**
The rule is right for the common case, and it also covers the case where the notes were read right and only the signature was wrong: a note already at the new key's alteration is left alone. It does harm in one case. A printed accidental that equals the misread key's alteration (a natural on G under a signature read as two sharps where three are printed) is re-spelled to the new key (G sharp), silently, and so is every later G in that bar that the printed natural governs. homr can mark a printed natural as `<alter>0</alter>` (`generate-main.ts:272-278`, `:455-460`: lift `N`), while a note with no sign carries no `<alter>`; the parser folds the two together (`musicxml-parser.ts:768-770`). No fixture has one (0 of 9 scan fixtures).
Change, step 0, add: "Whether a scan with a printed natural yields `<alter>0</alter>` (read one of row 114's pages with a printed natural and report)." Step 6b, add: "If step 0 finds it does, stop and report before building 'follow': the desk decides whether the parser keeps the printed-natural flag in a side list so 'follow' can leave those notes, and the same pitch later in the bar, alone." Tests, add: "'follow' leaves a hand-set pitch alone; 'follow' re-spells a grace note; with scope 'end' across two reading keys, each bar is judged against its own old key."

**16. The card: one checkbox, and a chooser that exists.**
Evidence: the upload's clef-and-key question is retired (`ScoreUploader.svelte:56`); its strings remain and are ratified (`i18n.ts:1222-1227`: "Key signature" / « Armure », "No sharps or flats", "1 sharp", "%s sharps", "1 flat", "%s flats") and nothing but `i18n.ts` uses them. `lib/score` may import only `reader` (`scripts/ratchets.mjs:78-85`), so `keyName` in `lib/analysis/watchlist.ts:583` is out of reach. The time signature card pairs one checkbox with one help line ("Rebar the notes", `i18n.ts:385`).
Change, design decision 6 and step 6b, third bullet: "The card lists the fifteen signatures by count, with the `upload.ask.key*` strings as their labels (no new option strings, and the same question the singer answered at upload: count the sharps or flats on your paper). No component is taken from `IntakePanel.svelte` (lane 48 is in the Drawer). The note choice is one checkbox, on by default, with one help line, shaped as 'Rebar the notes' is; off is 'keep'. The scope is the two choices of the time signature card. Remove appears only on a bar that opens with a key change and is not the first." Delete "(read it in step 0 and name it in the report)".

**17. A saved transposition and a corrected opening key.**
A saved choice is `{ semitones, fifths }` (`library.ts:271-276`) and `engraveInKey` takes `delta = choice.fifths - printed` (`transposition.ts:332-334`). Correcting the first bar's key changes `printed` under a stored choice.
Change, step 6b, add: "Step 0 reports what a stored transposition does when the opening key is corrected. Test: with a transposition chosen, correct the opening key; MELODY's signature and pitches agree with each other. If they cannot, stop and report."

### INSIGHTS, tests, ratchets, step 0

**18. Step 5 cites one wrong line and one function that feeds more than the compass.**
Evidence: `singer-page.ts:109` finds one held note by id; it reads no range. `pitched()` (`insights.ts:289-292`) feeds `rangeRow`, `crossingsRow`, and `tessituraRow` (`:755-758`).
Change, design decision 4 and step 5: "`pitched()` is unchanged. Grace pitches are added to `rangeRow`'s input only, to the spelling map at `insights.ts:600` (so a compass end that is a grace note can be spelled), and to `firstOutsideRange` (`singer-page.ts:129`). Test: `crossingsRow` and `tessituraRow` give the same answer with and without the fixture's grace notes." Drop `singer-page.ts:109` here and in "Computations this lane changes".

**19. Step 0 items already answered; remove them or mark them confirmed, so Code does not spend on them.**
- Glyphs: `accidentalNatural` is present (`smufl-metadata.ts:103`), as are `flag8thUp` and `flag16thUp` (:96, :98). There is no slashed grace glyph and no small flag. Step 4 therefore reads: "the flag is the full flag at grace scale; the stroke is a drawn line, not a glyph; no name is added to `RequiredGlyphName`."
- The MODULES table is `ratchets.mjs:78-85`: `score` may import `reader` only; `insights` may import `reader`, `score`, `voice`, `analysis`. New web modules go in `lib/score`.
- `tch-3.musicxml`, P1 measure 9: the `<key>` is at the measure's start, after `<print new-system="yes"/>`, three sharps to two (`<key>` at file line 316). Note for the desk: this is the shape a signature misread on a new system takes, so "Remove this key change" with the notes following is likely the singer's most frequent key correction. Whether the print changes key there is NOT ESTABLISHED.
- `;` and `/` are unbound in `correction-keys.ts:104-143`. Other handlers stay a step 0 reading.

**20. Tests this lane moves that the brief does not name.**
Add to the relevant steps: `page-layout.test.ts:115` and `staff-renderer.test.ts:2359`, `:702`, `:1883` (single key; expected to pass unchanged, say so in the report); `rebar.test.ts:147` and `rebar-notes.test.ts:183-193` (key changes re-indexed; step 6b's `keySignatures` rebuild must keep them green); `offers-for-a-bar.test.ts:147-156` (its name says the parser drops the grace note; rename, keep the assertion); `transposition.test.ts:505` (`toBe` on the same array when nothing moves: `graceNotes` keeps its identity too). Step 1's `grace-notes.musicxml` gains: a grace note whose slur start is followed by a two-note melisma (amendment 1's case), a grace note before the first note of a system, and a grace note whose principal carries an accidental. Scout §7 lines not opened by me are marked so below.

**21. Ratchets.**
`Loupe.svelte` is 3012 of 3012 and `CorrectionSurface.svelte` 1223 of 1227 (`ratchets.json`; `node scripts/ratchets.mjs` printed "ratchets: OK" this session). Amendments 7, 8, 11, and 16 all touch them.
Change, Lane, add: "No ceiling is raised in this lane without the desk's word. Every line added to `Loupe.svelte`, `CorrectionSurface.svelte`, `staff-renderer.ts`, or `musicxml-parser.ts` is paid for in the same commit by moving code to a new module; the report names what moved." Step 6b: the key card is its own component beside `TimeSignatureControls.svelte`, with its state in a sibling of `time-signature-ui.svelte.ts`. Correct the citation `correction.ts:48-129` to `:48-133` (the interface closes at :133).

## Questions for Dann

1. **Grace notes in Corrections: two cells or three?** Recommended: two. "Grace note" works as Rest does (in a gap it adds one; on a note it converts it and back), and "Slash" appears only on a lone grace note. Cost of two: adding a missing grace note on a phone is two taps (the gap, then the cell) instead of one. Cost of three: one more cell in a station that already holds six and gains Key signature.

2. **Three drawing defaults where a scan cannot tell Ilya what is printed. Yes to all three?** (a) A light double barline before a key change (Sibelius and Dorico default; Gould's own rule for this not read). (b) A lone grace note from a scan draws slashed until the singer says otherwise. (c) Every grace note draws its slur to its principal, read or not, since it is sung on the principal's syllable. Recommended: yes, yes, yes. Each is reversible.

3. **Strings, English and French.** English as amended: face "Key signature" (exists, ratified, `upload.ask.key`); "Change the key signature from this bar"; "To the next key signature change"; "To the end of the song" (exists); checkbox "The notes follow the new key signature" with a help line, drafted: "A note with no accidental of its own takes the new key signature's sharp or flat. Turn this off to keep every pitch as it is."; "Remove this key change"; Undo "key signature changed", "key change removed". Grace: face "Grace note"; names "Add a grace note before the next note", "Make this a grace note", "Make this a full note again"; face "Slash"; name "Add or remove the slash on this grace note"; Undo "grace note added", "grace note changed", "slash changed". French: the desk drafts from the file's own « Armure » (`i18n.ts:1222`) for the key signature. The file holds no French term for a grace note (no « appoggiature », « petite note », or « note d'agrément » in `i18n.ts`), so that term is his to choose.

## What I could not establish

- Whether homr's note alterations in a bar under a misread signature follow that signature or the print. `tch-3.musicxml` P1 measures 15 and 17 hold G naturals under two sharps, which fits the brief's premise only if the print has three sharps there. The premise behind 'follow' as the default is plausible and unmeasured.
- Whether a scan marks a printed natural as `<alter>0</alter>` in practice (amendment 15).
- How the Loupe builds its head, beyond `headerRightOf` and the clone sites cited; `loupe.ts` and the head crop were not read. Amendment 11 sets the outcome, not the method.
- Gould's rule for the barline at a key change, and Gould p. 152 itself. The tree's memo has only r224, p. 240 (a thin double barline marks non-final section ends), `memo-gould-dimensional-priors_r1_2026-08-24.md:30`.
- The bodies of `synthesize` (`correction.ts:629-660`), `reflowOnsets`, `columnInk`, `columnAdvance`, `stemUpFor`, `tacetRuns`, and `ties-and-slurs.ts` for a zero-width event. Step 4's "through the slur planner, with a zero-width event allowed" is untested by me.
- Scout citations taken on the scout's word, not opened: `types.ts:61`, `:358-379`, `:477-532`; `mnx-parser.ts:862-867`; `underlay-prepare.ts`; `slur-seat.ts:92`; `transposition.test.ts:489-505`; `page-layout.test.ts:115`; `staff-renderer.test.ts` lines; `rebar.test.ts:147`; `rebar-notes.test.ts:183-193`; `offers-for-a-bar.test.ts:147-156`; `document.svelte.ts` save and restore lines; `entry.ts:59-105`.
- Whether the 1000-line limit for unlisted files is inclusive (amendment 4).
- Whether the `upload.ask.key*` strings are slated for removal by lane 48's closing polish, being unused.
- How the undo stack stores a verb that writes two records (amendment 6); `undo-wiring.svelte.ts` was not read.
- Whether six cells plus the new ones fit the station at 390 px. No screenshot was taken; step 6's screenshots settle it.
- The eight gates were not run.
