# Brief: key changes and grace notes in MELODY and Corrections (N.192, N.187)

This brief is the desk's. Do not edit, rename, or replace it.

r2, 2026-11-12, written by the desk (Opus) from the Sonnet scout's packet `scout-packet-n192-n187_r1_2026-11-12.md` (every line it cites was read on `Shane` at `dc078b95`) and the Sonnet survey of Finale, Sibelius, Dorico, and MuseScore `report-survey-grace-key-notation-software_r1_2026-11-12.md` (both filed beside this brief). r3, 2026-11-12: FABLE-REVIEWED, SEND WITH AMENDMENTS (21), appended below and binding; the review is `review-fable-n192-n187-brief-r2_r1_2026-11-12.md`, filed beside this brief. Dann's answers to the review's three questions are recorded at the end when given; until then the review's recommended answers stand as DESK DEFAULTS.

**Changes from r1** (desk error owned 2026-11-12 00:3x: r1 was designed from Ilya's code outward, without the survey): the Corrections part is redesigned from the singer's four tasks on a scan (a grace note missing, a grace note read as a full note, a grace note at the wrong pitch or not there at all, a key change missed or misread); a key change can now be added, corrected, and removed; a double barline is drawn at a key change, as Sibelius and Dorico do by default.

## Lane

- Branch `cloud-lane-50`, cut from `Shane` at the commit the desk names when it starts the lane. Commit and push only that branch. Never `Shane` or `main`. No pull request.
- Take every "before" reading first. To read old code, use `git show <sha>:<path>`. No `git stash`, `checkout` of files, `reset`, or `restore`.
- Report after each step in `docs/sessions/report-code-n192-n187-step<N>_r1_<date>.md`: what changed (file and line), the tests added, the gate counts, screenshots where the step draws, and a section "What I could not establish". NOT ESTABLISHED beats a complete invented answer.
- Two other lanes run beside this one: `cloud-lane-48` (closing polish; touches `i18n.ts`, the Drawer, `latin.ts`, fonts) and `cloud-lane-49` (rhyme; touches `pipeline.ts`, the Inspector, `word-marks`). Stay out of their files where you can; where you cannot (`i18n.ts`), keep your additions in one contiguous block so the merge is clean.

## What the singer gets

- **A song that changes key is drawn as printed.** MELODY draws the new key signature where the key changes, with cancelling naturals where the new key needs them, and a courtesy key signature at the end of the system before a change that falls at a system break. Every accidental is judged against the key in force, so no note carries an accidental the key already gives it.
- **Grace notes are on the page.** MELODY draws each grace note before its principal note, at grace size, with its slur below, outside the bar's count. It takes no syllable unless the singer places one.
- **Grace notes can be corrected, in one action each.** With a note selected in the Loupe, the singer adds a grace note before it (the scan missed one), turns the selected note into a grace note and back (the scan read a grace note as a full note), slashes or unslashes it, re-pitches it with the usual pitch keys, and deletes it.
- **Key changes can be corrected.** From any bar, the singer changes the key from that bar, to the next key change or to the end of the song, chooses whether the notes follow the new key or keep their pitches, and can remove a key change.

## Rulings that bind this lane

All in `docs/memory/OPEN.md`.
- N.192's spec (section "N.192. MARKUP DRAWS A KEY CHANGE WHERE THE SCORE CHANGES KEY"), and "N.192 AND N.187 SHIP WITH THE SHARE" (Dann 2026-11-12 00:23).
- N.187's rulings of 2026-10-18 21:32 to 21:56 (in "THE AUDIT OF 2026-10-18"): a grace note is a sung pitch, drawn, left out of the bar's sum; editable in Corrections, Finale's handling as the model. Gould pp. 125 to 130 as read 2026-10-19 (`docs/sessions/gould-pp125-130-grace-notes_r1_2026-10-19.md`): a little under three quarters of full size; stem about 2¼ stave-spaces; stem up in a single part; a stroke through a lone grace note's flag; the grace slur below, notehead to notehead, one slur per group.
- "A GRACE NOTE TAKES NO SYLLABLE BY DEFAULT" (2026-11-05 00:19).
- 2026-11-12 00:26: grace-note editing ships with the share ("complete solutions, not disappointing promises").
- CONTRACT §0.1, one vowel per note: a grace note takes no syllable by default, so it never puts a second vowel under a note; where the singer places a syllable on one, the one-vowel check applies to it as to any note.
- CONTRACT §8 forbids changing `VocalLineEvent` without a numbered item; N.187 is that item. This brief chooses a design that leaves `VocalLineEvent`'s existing fields alone (step 2).

## Design decisions (DESK DEFAULT, each for Fable's review)

1. **Grace notes live in their own list, not in `vocalLine`.** `ParsedScore.graceNotes: GraceNote[]`, each `{ id, principalId, measureIndex, pitch, base, slash, slurs? }`, in a new file (`packages/score-parser/src/grace.ts`; `types.ts` is 999 of its 1000 lines). Reason: about 45 sites iterate `vocalLine` (scout packet §1e), and most sum durations, count notes, or seat syllables. A separate list keeps every one of them unchanged and keeps grace notes out of every bar sum by construction. The renderer, transposition, corrections, the Loupe, the library fingerprint, and the one INSIGHTS range read the new list explicitly.
2. **A grace note's id** is its principal note's id plus `~g` and its order in the group (`m17-1-2~g1`, `~g2`), so it never equals its principal's id (scout §1c) and is stable across re-parses. A grace note with no following note in its measure takes the last note's id with `~a1` (after-grace). `resolveSuppliedIds` (`musicxml-parser.ts:941`) and its comment (:930-932) change accordingly.
3. **Keys per measure come from the measure's own snapshot** (`Measure.keySignature`, `types.ts:269`), as `meterDeclaredAt` does for the time signature (`staff-renderer.ts:726-731`), because `sliceScore` keeps only the system's first key (`page-layout.ts:130`).
4. **INSIGHTS:** a grace note takes no time, so every time-weighted measure (tessitura, phonation, sustain, cycles) is unchanged. Its pitch is a sung pitch, so the compass (lowest and highest sung note) and the first out-of-range note include grace notes (`insights.ts:290`, `singer-page.ts:109`, `:129`). Nothing else in INSIGHTS reads them.
5. **Corrections start from the singer's task, not from one product.** The survey's pattern: MuseScore is the only one that adds a grace note before a selected note in one action (`/`); Finale, Sibelius, and Dorico all convert a selected note (Finale `;` or `G`, Sibelius `;`); Dorico toggles the slash afterwards in its properties. The singer correcting a scan needs both, so Ilya offers both, each one tap or one key:
   - **Add a grace note before** the selected note: a new grace note at the selected note's pitch, an eighth, slashed, selected at once so the pitch keys move it straight away. Pressed again, it adds another to the group (before the first added). Key `/`, MuseScore's.
   - **Grace note on and off** for the selected note: a full note becomes a grace note of its own value, and a grace note becomes a full note again (it then takes its place in the bar). Key `;`, Finale's and Sibelius's, which `correction-keys.ts` leaves free (step 0 confirms).
   - **Slash** on a selected grace note toggles the stroke.
   - The pitch keys and Delete work on a selected grace note as on any note; selection reaches grace notes by click and by the arrow keys.
   - After-graces are drawn when read; adding one by hand is not offered (no product's manual documents it as a step, survey item 5; DESK DEFAULT).
6. **A key change is corrected from its bar, in a card shaped like the time signature card** (`correct.tsChange` and its card, ruled 2026-11-09 22:08): choose the key; its scope, "To the next key change" or "To the end of the song", as the time signature card's; and what the notes do. Finale's key dialog is the only one of the four that offers this choice (Transpose, or Hold notes to original pitches); Ilya offers the two a singer needs:
   - **The notes follow the new key** (DESK DEFAULT, the scan's case: the reader applied a misread signature, so a note sitting on a line or space takes the new key's sharp or flat): each note whose alteration equals the old key's alteration for its letter takes the new key's; every other note keeps its pitch.
   - **Keep the pitches as they are** (the case where the notes are right and only the signature is missing or wrong): the pitches stay, and the drawing judges their accidentals against the new key.
   - **Remove this key change**: the bar returns to the key before it, with the same choice for the notes.

## Steps

**Before each step, read the Amendments section at the end of this brief for that step. Where an amendment and a step's text disagree, the amendment wins.**

### Step 0. Read and measure

Run all eight gates and record each count. Read every line this brief and the scout packet cite, and report any that has moved. Also establish, and report:
- How the Loupe reads `data-key-signature` (scout "could not establish" 2): read `loupe-ink.ts` and `loupe-render.ts` and every reader of that attribute. A mid-system or courtesy signature must not move the Loupe's head bound.
- Whether the SMuFL metadata in the tree has the glyphs this lane needs: `accidentalNatural` (cancelling naturals), a slashed grace flag or `graceNoteSlashStemUp` / `graceNoteAcciaccaturaStemUp`, and the small flags (`smufl-metadata.ts`, `RequiredGlyphName`).
- Whether `G` (and `;`) are claimed anywhere in the Loupe or the page's key handling.
- The full MODULES import table in `scripts/ratchets.mjs`, so the new modules sit where the layering ratchet allows.
- Whether `tch-3.musicxml`'s key change at P1 measure 9 is at the measure's start.
- How the parser treats a printed barline style at a key change (light double), if at all.

Change nothing.

### Step 1. Fixtures

Add two MusicXML fixtures under `packages/score-parser/src/fixtures/` (or the folder the tree uses for parser fixtures), each with its source written in a comment at its head:
- `key-changes.musicxml`: a vocal line in D major that changes to F major mid-system (measure 5) and back to D major at a system break (measure 9 with the paginator's width set so it opens a system), with notes that test the accidental judgement (an F natural and a B flat after the change; an F sharp after the return), and a lyric line.
- `grace-notes.musicxml`: one lone eighth grace note with `slash="yes"`, a group of two sixteenth grace notes, an after-grace at a measure's end, a grace note with a `<lyric>` (to prove it is ignored by default), a grace note between two tied notes, and a grace note whose slur starts on it. Use `<grace/>` with `<type>` and no `<duration>`, as homr writes them (`third_party/homr-web/src/musicxml/generate-main.ts:435-466`).

### Step 2. The parser keeps grace notes

- `packages/score-parser/src/grace.ts` (new): the `GraceNote` type and the code that reads one.
- `musicxml-parser.ts:700-714`: instead of skipping, push a `GraceNote` to `graceNotes`, keep `return cursor` (the cursor must not advance, so the bar-duration warning stays right, scout §3), and keep the grace note's own slur ends on the grace note. Pay for every added line in the same file (it is at its ceiling, 1167 of 1167): move code into `grace.ts`.
- The principal id: the next kept note in the same voice and measure; an after-grace takes the previous kept note (design decision 2).
- `ParsedScore.graceNotes` is added to the type in the new file's module and threaded through `sliceScore` (`page-layout.ts:122-141`, filtered and rebased by measure as events are), `performance-order.ts:86-102` (grace notes follow their principal), and `engraveInKey` / `transposeScore` (`transposition.ts:217-224`, `:323-352`: grace pitches move with the rest).
- MNX (`mnx-parser.ts:862-867`): DESK DEFAULT, unchanged in this lane (no singer path reads MNX grace notes today); report it.
- Tests: the fixture parses to the expected `graceNotes` and an unchanged `vocalLine` (every `vocalLine`-based test still passes); `musicxml-parser.test.ts:891-897` changes its name and keeps its assertion on `vocalLine`; `n188-markings.test.ts:127` changes to expect the grace note's slur on the grace note.

### Step 3. The renderer draws key changes (N.192)

New module beside `staff-renderer.ts` (it is at its ceiling, 3426 of 3427). Following the N.139 mid-system meter pattern (`meterDeclaredAt` :726-731, `LayoutColumn.meterRoom` :1612-1630, `meterRoomFor` :1694-1708, the barline at :2617-2628):
- A key is declared at a measure when its snapshot differs from the measure before (`keyDeclaredAt`).
- At such a measure inside a system, draw the new signature after the barline, with cancelling naturals first where the new key drops sharps or flats of the old one (and before a switch between sharps and flats), using the system head's glyph positions (`:2205-2222`). Its width goes into the column's room, so `sliceWidth` and the render agree (`page-layout.ts:155-175`).
- At a change that falls at a system break, draw a courtesy signature after the closing barline of the system before, and add its width to that system (`staff-renderer.ts:2014-2023`, `sliceWidth`). The next system's head already shows the new key (`page-layout.ts:130`).
- The accidental carry follows the key in force: `AccidentalCarry.fifths` (`:1412-1432`) changes at a declared measure, and nothing carries across the change (no courtesy accidental from the old key's bar). Every reader that takes one `fifths` takes the key in force: `:1674`, `:1848`, `:2332`, `:2733`, `:2951`, `:1520`, `:1546`, `accidentalStateAtEndOf` (:562-579, its comment at :556-560 rewritten), `page-layout.ts:230`, `:240`, and `transposition.ts:415-424` (`doubleAccidentalCount`).
- The new glyphs carry a data attribute of their own, not `data-key-signature`, unless step 0 shows the Loupe reads it safely.
- Barline before a mid-piece key change: a light double barline, as Sibelius draws automatically and Dorico by default (survey K3); where the print's own barline style is kept by the parser, that wins (report whether it is).
- Tests: the fixture's system breaks and measures; the accidental marks before and after each change; `sliceWidth` equals the drawn width; transposition moves every signature (`transposition.test.ts:489-505` still passes); a song with no key change renders byte-identical to before (an approval snapshot of an existing fixture).
- Screenshots: MELODY at desktop width and 390 px, the fixture and `tch-3.musicxml`, both languages.

### Step 4. The renderer draws grace notes (N.187)

New module beside `staff-renderer.ts`. For each grace note, before its principal note (after it, for an after-grace):
- A notehead scaled to 0.7 of full size (`glyphAt`'s `scale`, the precedent `TURNING_HEAD_SCALE`, :889, :3047-3049); a stem always up, 2¼ stave-spaces from the notehead, bypassing `stemUpFor` and the semantic-stem rule (a grace note has no timbre data; scout §2c); the flag at the same scale, and a slash through a lone grace note's flag where `slash` is set (SMuFL glyph if step 0 found one, else a stroke drawn at Gould's angle); a group of two or more beamed at grace size.
- Its accidental judged by the same carry as a full note, at grace size, and it governs the rest of the bar as a full note's does.
- Its slur below, notehead to notehead, one per group, through the slur planner (`ties-and-slurs.ts`), with a zero-width event allowed.
- The room it takes is added before the principal's column (`columnAdvance`, `columnInk`), so `sliceWidth` and the render agree and the underlay clears.
- A grace note takes no syllable by default: no underlay is drawn under it.
- Tests: the fixture's grace notes drawn in order, at scale, with stems up; a bar with a grace note sums as before (`measureFill`, the Loupe's "short" and "over" labels unchanged); the tie across the grace note still draws; a song with no grace notes renders byte-identical to before.
- Screenshots: as step 3.

### Step 5. INSIGHTS reads grace pitches for the compass only

Design decision 4: `insights.ts:290` and `singer-page.ts:109`, `:129` include grace pitches; everything time-weighted is unchanged. Tests: a grace note above the range moves the compass and the first out-of-range note; tessitura and phonation are unchanged.

### Step 6. Corrections: grace notes (design decision 5)

- `NoteCorrection` (`correction.ts:48-129`) gains `grace?: { slash: boolean } | 'none'` (a note made a grace note, or a read grace note made a full note), and `withCorrection`'s field list (:344-353) gains it. A grace note added by hand is an entered record (`entered`, `entry.ts:221-241`) with `grace` set and its `after` the note it precedes; its id is `hand:N` as every hand entry's (`entry.ts:184`).
- `applyCorrections` (:408-470) moves a note into or out of `graceNotes` as the field says, and `synthesize` (:629-660) builds a hand-entered grace note with no duration in the bar and its principal's onset. A grace note made a full note takes its `base` as its duration and its place in the bar (the bar may then read "over"; that is the singer's choice, and the Loupe says so with its existing label).
- Selection: the arrow keys and clicks reach grace notes (they appear in the Loupe's measure before their principal; `entry.ts:59-105`, `loupe-fit.ts:170-185`), and the pitch verbs (`handleStep`, `handleOctave`, `handleSemitone`, `handleAccidental`) and Delete work on a selected grace note by its id.
- Three controls in `CorrectionSurface.svelte`'s ACCIDENTAL · ENTRY station beside Rest and Tie (`:660-673`): Add grace note, Grace note (engaged when the selected note is one), and Slash (shown only on a selected grace note). Keys `/` and `;` if step 0 finds them free. Undo pushes its own text for each. The Loupe is at its ceiling (3012 of 3012) and `CorrectionSurface.svelte` has 4 lines of room: new code goes in new modules.
- The strings are PENDING DANN (below). Code builds with the keys and the English drafts; the desk replaces the drafts with the ratified text before the lane merges.
- The library fingerprint (`library/fingerprint.ts:41-50`): DESK DEFAULT, unchanged (it hashes `vocalLine`, which grace notes do not enter). Report it.
- Tests: each of the four tasks (add before, convert both ways, slash, re-pitch and delete) with undo; a saved song with grace corrections reloads with them; one vowel per note holds where a singer places a syllable on a grace note.

### Step 6b. Corrections: key changes (design decision 6)

- `NoteCorrection` gains `keySignature?: { fifths: number; through: 'next' | 'end'; notes: 'follow' | 'keep' } | 'remove'` on the first note of the bar, as `timeSignature` is stored (`correction.ts:48-129`; the time signature card's record is the model, `correct.tsChange`), and `withCorrection`'s field list gains it.
- `applyCorrections` sets `Measure.keySignature` for the bars in scope and adds or removes the matching `keySignatures` entry, then, for 'follow', re-spells the notes in scope as design decision 6 says; for 'keep', changes no pitch. The drawing of step 3 then draws what is in force.
- The card opens from a bar in the Loupe, beside the time signature card's control, with a key chooser built from the one the upload's key question uses (read it in step 0 and name it in the report), the two scope choices, the two note choices, Remove (on a bar that holds a change), and Cancel.
- Tests: a misread signature corrected with 'follow' re-spells exactly the notes on the old key's altered letters; 'keep' changes no pitch; scope 'next' stops at the next change; Remove restores the key before; undo restores each; transposition (`engraveInKey`) moves a corrected key as it moves a read one.

### Step 7. Close

Merge `Shane` into the lane, run all eight gates and the Playwright suite (desktop and phone), and write the final report: gate counts against step 0's, the strings added, the screenshots, and any ratchet ceiling moved (with its reason).

## Strings PENDING DANN

English drafts by the desk, from the file's existing shapes (scout §5c: `loupe.rest` "Rest", `loupe.tie` "Tie", `loupe.undo.rest` "rest changed"; the time signature card's ratified strings of 2026-11-09 22:08). Code builds with these keys and the English drafts; Dann rules the English and the French before the lane merges.
- `loupe.graceAdd` "Add grace note"; `correct.graceAdd` (accessible name) "Add a grace note before this note"; `loupe.undo.graceAdded` "grace note added".
- `loupe.grace` "Grace note"; `correct.grace` "Make this a grace note, or a full note again"; `loupe.undo.grace` "grace note changed".
- `loupe.graceSlash` "Slash"; `correct.graceSlash` "Add or remove the slash on this grace note"; `loupe.undo.graceSlash` "slash changed".
- Key card: `loupe.keySignature` "Key signature" (button face); `correct.keyChange` "Change the key from this bar"; `correct.keyToNext` "To the next key change"; `correct.keyToEnd` "To the end of the song"; `correct.keyFollow` "The notes follow the new key"; `correct.keyKeep` "Keep the pitches as they are"; `correct.keyRemove` "Remove this key change"; `loupe.undo.keyChanged` "key changed"; `loupe.undo.keyRemoved` "key change removed".

## Computations this lane changes (CONTRACT §4)

- The key against which an accidental is judged: every site that passes one `fifths` (step 3's list) now passes the key in force; `transposition.ts:415-424` too.
- The key in force at a bar can now be set by the singer (step 6b); every reader of `Measure.keySignature` and `keySignatures` sees the corrected key through `applyCorrections`, as they see a corrected time signature.
- The compass and the first out-of-range note in INSIGHTS (step 5): they now include grace pitches. Every other pitch statistic (`vocal-octave.ts:86-88`, `clef-select.ts:51-55`, `overlay-engine.ts:158-166`, `key-suggest.ts:251-258`) reads `vocalLine` only and is unchanged, by design decision 1.
- No bar sum changes: grace notes never enter `vocalLine`.

## What the desk could not establish

- Everything in the scout packet's last section, which step 0 reads.
- Gould's rule on the barline at a key change (step 3).
- The French term the glossary prefers for a grace note (« appoggiature » or « petite note » or another); the desk drafts it for Dann.

## Amendments from Fable's review, part of this brief


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

