# Design return: the Loupe's Corrections, redesigned (r1, 2026-10-08)

Answers `docs/sessions/brief-design-corrections_r1_2026-10-08.md`. Written by Claude (Sonnet 5.5) in the desk's session, 2026-10-08, on branch `Shane` at `9cfcd17`, tree dirty with rows 43 to 46. Nothing here is committed and no app code was changed.

## What came back

- **The drawings:** `design-corrections_r1_2026-10-08.html`, twelve states, each at the desk (1440 by 900) and on a phone (390 by 844): 24 artboards. The same 24 as images: `design-corrections_r1_2026-10-08-png/` (`01-rest-desk.png` to `12-rit-second-caret-phone.png`).
- **These notes:** one decision per section with its cost, the ranked control list, the new English labels, and what I could not establish.

**Every drawing is a hand-written mockup, not a capture of the running app.** I tried to capture the live Loupe in headless Chromium and the card laid out 2,255 px tall (the hidden-pane stale-layout fault the memory already records), so I drew from the code's tokens and the inventory instead. Widths and heights below are my own, set for the fixed panel; the real card today runs 661 to 763 px on the desk (inventory, "Plan against tree" item 1).

## The one idea

**Corrections becomes a rail of eight stations, chosen first, then applied where the caret or note is.** It is Finale's "one tool per kind of thing" with Ilya's own attachment point, the caret. The rail is ordered by the forecast, so the repairs the reader most often needs are first and the performance marks follow:

`Not voice · Triplet · Accidental · Length · Pitch · Tempo · Dynamic · Hairpin`

On the desk it is one row, grouped 3 | 2 | 3 (repair a run, repair a note, mark the performance). On a phone it is two rows of four, 44 px tall, in the same order. Under the rail: one sentence saying what is in focus, then the open station's controls in at most two rows, then a footer of verbs for the focus (Delete, Restore, or the mark's own). Panel size is fixed, as the fixed-panel brief asks: 268 px tall on the desk, 316 px on a phone, and no scroll. On a 1440 by 900 desk the whole Loupe is about 520 px tall, so every station is visible without scrolling (the inventory's complaint that only Duration and Pitch showed).

## Decisions, each with its cost

**D1. One rail, eight stations, in forecast order.** Replaces today's stacked accordion (Duration, Pitch, Accidental · Entry, Lyric).
*Cost:* every singer who learned the old arrangement relearns it; the phone's rail takes 92 px.

**D2. Station first, then apply.** The last station used stays chosen. A station that cannot act on the focus goes quiet (it stays readable and focusable); if the open one cannot act, the panel moves to Length. *Source: Finale's Expression and Smart Shape tools, chosen first, applied where the cursor is (facts report §4).*
*Cost:* a task that crosses stations takes one more tap than today's single scroll.

**D3. One "Reach" row for anything that acts on more than one note** (Not voice, Triplet): `This bar · To end of system · From here to…`. "From here to…" arms a range at the taken note or caret; the singer moves its end with the Next and Previous buttons and the arrow keys the Loupe already has; the count in the sentence and on the button updates. **No new taps on the notation, so the caret and note do not compete for more thumb (N.162).**
*Cost:* "To end of system" needs the Loupe to know where a system ends. NOT ESTABLISHED that it does (page layout is known to the Paper; I did not read whether the Loupe can ask it). If it cannot, drop that chip and keep `This bar` and `From here to…`.

**D4. Not voice is the first station (forecast row 1).** One act removes the stretch; the button names the count ("Remove 38 notes"); Undo brings it back as one step.
*Cost:* the corrections model deletes note by note. A range of 38 may mean 38 deletions in one undo step (fine) or a new range record. I did not read the code for it, so which is NOT ESTABLISHED. Whole-range Restore is Undo; the per-note Restore keeps working.

**D5. A flagged bar arrives on Corrections, with Not voice open and "This bar" ready** (drawing 4). Ilya marks a bar whose reading fails a check (a span over two octaves, a chord in the voice, a leap beyond an octave) and never changes a note; the loupe's top line shows the reason ("Check: a chord in the voice") in rose ink with a flag. **The mark on the Paper is information, not a control** (contract section 6): the singer taps the bar as always, and the Loupe opens on Corrections instead of Syllables for that bar.
*Cost:* it breaks "the Loupe opens on Syllables" (`OPEN.md`, two-modes clause 2, which Dann said he might revisit and did not rule) for flagged bars only. How the flag looks on the Paper is not drawn.

**D6. Triplet over a run, default "This beat"** (forecast row 2). The primary button states what it will do ("Triplet over these 3 notes"); `Other…` opens today's "N of M in the space of" row with its One more and One fewer; `Remove triplet` appears when the focus is inside one.
*Cost:* the inventory records that there is no direct unmake today, only Restore per note or Undo. A real unmake needs a code change; the button assumes one.

**D7. Accidental gathers the five accidentals, the semitone nudges, and a "Carries through the bar" switch** (forecast row 3). Double flat, flat, natural, sharp, double sharp in one 44 px row; the switch is on by default, as in print, and the sentence says what it reaches ("1 later G in this bar also reads as a double sharp"). Semitone leaves Pitch, because the reader's pitch errors are one or two semitones.
*Cost:* **how "carry" is stored is NOT ESTABLISHED.** `NoteCorrection` has pitch, not a carry flag. A natural not carried through its bar is a reading fault, so the switch may need a per-bar record or a change in the spelling logic (`spellingContextFor` exists). Needs Code's reading before anyone builds it.

**D8. Length gathers length, dot, rest, and tie** (forecast row 4). Five length glyphs, Dot, Rest, Tie: eight cells in one row on the desk, 4 by 2 on a phone. With a caret in focus the same cells enter a note or a rest, as today.
*Cost:* Rest and Tie leave their own row; breve and 32nd are still not offered (as today).

**D9. Pitch is only step and octave** (2 by 2), because the forecast says single steps are rare once the semitone nudges are elsewhere.

**D10. Tempo at a caret** (forecast row 6): `Steady · rit. · rall. · accel. · a tempo`, then a number with − and +, then `Place here`. **The beat unit is not here:** the song-wide control (QUEUE row 48) alone has the two note chips; this station shows the song's own unit in front of the number. "a tempo" returns to the song's tempo. The sentence shows the torso for a mark the singer placed.
*Cost:* **a mid-song tempo mark changes no readout today.** `secondsFor` uses one tempo per piece (`phonation.ts:437-444`, facts report §3). The panel does not promise otherwise. Whether to say so in a quiet line is the desk's call.

**D11. Gradual changes by termini** (drawings 11 and 12). The caret is the start. Default: it runs to the next tempo mark or *a tempo*, shown as `rit.` with a dashed line and an arrow to the bar where it lands. Arrival defaults to 75 percent for rit. and rall. and about 133 percent for accel., nudged with − and +. "End at another caret" ends it at a second caret, and the arrival tempo then stands at the end of the dashed line. No tempo graph.
*Cost:* where the tempo in force is an estimated range (row 48), 75 percent of a range is a range. The arrival should print as one (with the ≈ sigil); I drew a single value.

**D12. Dynamic: eight chips (`ppp` to `fff`), one tap places it at the caret** (forecast row 6). A dynamic already at the caret is highlighted; "Remove mark" is in the footer.
*Cost:* **no readout reads a dynamic** (the Demand `'dynamic'` never fires, `gates.ts:90-92`), and the renderer draws none (`loupe.ts:586`). The mark would be kept and drawn first in the Loupe and the Paper, and move nothing until a rule is written for it.

**D13. Hairpin: the caret is the first endpoint, the second is "To end of bar" or "To a caret I take"** (Finale's two attached endpoints without the drag handles; MuseScore's "to the end of the measure" as the default). `Move end here` and `Move start here` take the place of handles. Crescendo and Decrescendo are chips, so no one needs to drag one endpoint across the other.
*Cost:* no free positioning inside a bar between notes; endpoints stand at carets only.

**D14. Melisma and the lyric shifts leave Corrections for the Syllables pill.** They are lyric acts; the Syllables panel already holds the syllable. *Cost:* those controls change places. **NOT ESTABLISHED that the Syllables panel has room: I did not read `LoupeSyllables`.** If it does not, Lyric becomes a ninth station on the desk rail, and that breaks the two rows of four on a phone.

**D15. Footer verbs.** `Delete` and `Restore` for a note; `Remove mark` for a mark; `Move here` and `End at another caret` for a tempo or hairpin. Undo and Redo stay as they are, one pill at a time in the bar, and every new act pushes one undoable step.

**D16. Provenance sigils in the sentences and on the marks.** The singer's own mark carries the torso (drawn on the tempo, rit., dynamic, and hairpin); a value Ilya estimated carries ≈ (song tempo, and an estimated arrival). A printed mark would carry none.
*Cost:* the legend must decode every sigil that prints. The torso exists for stress overrides (`provenance.ts:119`); I did not check its legend wording against these new uses.

**D17. Keys (desk), extending today's** (`+page.svelte:1239-1275`): `V` not voice, `T` triplet, `M` tempo (metronome), `D` dynamic, `H` hairpin, `A` accidental station. Today's `↑ ↓ ⇧↑ ⇧↓ + − 3 to 7 . ⌫ ← → Esc` stay. Hints show quietly at the footer's right edge on the desk and not at all on a phone.
*Cost:* the letters are my choice and are **not tested** against the existing handler or browser shortcuts. A key cannot be `⌘3` (it switches browser tabs), which is why triplet is `T`.

**D18. Not designed here: metre, key, clef, barline** (forecast row 7, whole-song, rare). I recommend they stay out of the Loupe and, if wanted, sit in the Piece band's score receipt beside the upload selects. Their data is not editable anywhere after upload (inventory, "Cannot edit").

## What I took from Finale, and what I did not

- **Took:** attachment then adjustment (the caret, then Move here and the nudges); one tool per kind, chosen first (the rail); keyboard flexibility (kept and extended, shown quietly); expression kinds as small sets (Steady, rit., rall., accel., a tempo).
- **Did not take:** density, dialog boxes, tempo graphs, drag handles, positioning offsets, staff assignment, measure-versus-note attachment as a choice the singer makes (the caret is the only attachment).

## The controls, ranked by how often a singer will need them

The forecast rows are the brief's table. **I did not re-read its source reports** (the blind read and the build-song reports); the counts are theirs, as the brief gives them. Frequency for the performance marks is an inference, not a measurement.

| Rank | Control | Station | Forecast row that justifies it |
|---|---|---|---|
| 1 | Remove a stretch that is not the voice | Not voice | Row 1: 61 extra notes in 2 of 8 unseen songs; 154 in 2 build songs before a fix; whole systems at a time |
| 2 | Triplet over a run, and its removal | Triplet | Row 2: 12 of 17 length misreads on the unseen set, all in one song; 55 lengths in *Sunless* 3 |
| 3 | Set an accidental (double sharp too), say whether it carries; nudge a semitone | Accidental | Row 3: 8 pitch misreads, each one or two semitones; 6 double sharps in one build song |
| 4 | Length and dot on one note; Rest; Tie; Delete a stray note | Length (and the footer) | Row 4: a handful per song |
| 5 | Tempo at a caret, and rit./rall./accel. | Tempo | Row 6: absent on every scan, by construction; the song-wide control covers the common case, so a change at a point is rarer than the song-wide one |
| 6 | Dynamic at a caret | Dynamic | Row 6, same |
| 7 | Hairpin between two carets | Hairpin | Row 6, same |
| 8 | Step and octave of a note | Pitch | Row 3: a misread pitch is a semitone or two, which the Accidental station already covers |
| 9 | Enter a missing note or rest at a caret | Length at a caret | Row 5: 0 missing on the unseen set |
| 10 | Metre, key, clef, barline | none (not designed) | Row 7: rarely wrong |

The rail's order follows ranks 1 to 8; ranks 9 and 10 are not stations.

## New English labels

French is for the desk to draft; I wrote none.

**Rail:** Not voice · Triplet · Accidental · Length · Pitch · Tempo · Dynamic · Hairpin (Pitch exists; Accidental exists as "Accidental · Entry"; Length replaces "Duration").
**Reach:** This bar · To end of system · From here to… · This beat.
**Not voice:** Remove {n} notes · "Not the voice: from m. {a}, ending at m. {b} · {n} notes" · "They leave the voice line. Undo brings them back." · "Ilya flagged this bar: a chord in the voice. Nothing has changed." · "The notes are as read. Say whether this bar is the voice." · "Check: a chord in the voice ({k} notes at once)" (and the sibling reasons: a span over two octaves; a leap beyond an octave).
**Triplet:** Triplet over these {n} notes · Other… · Other tuplets… · Remove triplet · "{n} eighths in the space of {m} · m. {x}, notes {a} to {b}" · "Without it these 3 eighths overfill the bar by half a beat."
**Accidental:** Carries through the bar · "Carries: {n} later {letter} in this bar also reads as a {accidental}." (accidental names exist as `notePicker.acc.*`) · ▼ semitone / ▲ semitone (existing).
**Length:** Dot, Rest, Tie (existing).
**Tempo:** Steady · rit. · rall. · accel. · a tempo · Back to the song’s tempo · Arrives ♩ = {n} · Place here · Remove · Move here · End at another caret · "Your tempo from here · ♩ = {n} · m. {x}, beat {b}" · "Your rit. from m. {x}, beat {b} · arrives ♩ = {n} ({p} %)" · "It runs to the next tempo mark, m. {x} (♩ = {n}). Drawn as print." · "Ended at a second caret. After it the tempo holds until a tempo." · "The song’s own tempo stays in the control above the page."
**Dynamic:** ppp pp p mp mf f ff fff · Remove mark · "Your mezzo forte at m. {x}, beat {b}" · "Dynamics are kept and drawn. They do not yet change any readout." (the desk may strike the last sentence)
**Hairpin:** Crescendo · Decrescendo · To end of bar · To a caret I take · Place · Move end here · Move start here · "Your crescendo from m. {x} beat {b} to the end of the bar" · "Move either end by taking another caret."
**Focus lines:** "Take a note or a caret in the bar above." · "Stations repair the reading or mark your performance." · "Gap before {pitch} · m. {x} · beat {b}" · "A length enters a note here. Tempo, Dynamic, and Hairpin mark here."
**Undo labels (new):** tempo placed · tempo removed · rit. placed · dynamic placed · hairpin placed · {n} notes removed.
**Keys (hints):** V not voice · T triplet · M tempo · D dynamic · H hairpin · A accidental.

## Could not establish

- **The live Loupe.** I could not capture it (it laid out wrongly in headless Chromium, 2,255 px tall). Everything drawn is a mockup from the code's tokens and the inventory's measurements. **Real widths, the real card's 661 to 763 px, and whether 268 px of panel plus a 140 px window fits the Loupe's anchored layout are not measured.**
- **Touch targets on a phone.** Chips are 44 px by my drawing; I did not test them on a device, and the N.162 thumb competition is argued from the design (no new notation taps), not tested.
- **Whether the Loupe can find a system's end** (D3), **how a range of removals is recorded** (D4), **how "carry" is stored** (D7), **whether the Syllables panel has room for Melisma and the shifts** (D14), and **whether the keys collide** (D17). Each needs Code's reading first.
- **The forecast's numbers.** They are the brief's; I did not open the blind-read or build-song reports.
- **Finale details.** The quotations are the facts report's. I did not re-fetch the manual, and the report itself says it could not establish how Finale splits a hairpin over a system break or defines its two endpoint attachments in detail.
- **How a flagged bar looks on the Paper** (D5): not drawn. The brief asked where the mark sends the singer; I drew the arrival, not the mark.
- **Where the song-wide tempo control floats.** QUEUE row 48 is being built; I put a small stand-in at the Paper's top right (and in the header on a phone) only to show that Tempo and it do not duplicate each other.
- **Accessibility.** Focus order, aria labels, and reduced-motion behaviour are not designed.
- **French,** by instruction. No French was written, so the longer French labels are not checked against the chip widths (a phone chip is about 70 px; "Accidentel" and « Décrescendo » may not fit).
- **Whether a station memory should survive a song switch or a reload.** I assumed it lasts the session, like the zoom.
