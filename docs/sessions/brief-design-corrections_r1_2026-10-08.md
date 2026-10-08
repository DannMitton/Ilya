# Brief for Design: the Loupe's Corrections, redesigned for what the reader gets wrong and what the singer wants to mark (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 01:55, at Dann's request. For Claude Design, with the repository `DannMitton/Ilya` connected on branch `Shane`. Everything cited is in the repository.

## Who uses Corrections, and what they should feel

A classical singer has dropped a scanned song. Ilya's reader has drawn the vocal line, and it is never perfect: on eight songs it had never seen, it read 935 of 960 printed notes right, and drew 61 notes that are not on the page. The singer opens the Loupe, a floating magnifier over one bar of the Paper, and switches to its **Corrections** pill to fix what is wrong. Later, the same singer wants to **mark their own performance**: a tempo, a dynamic, a hairpin. These marks change Ilya's readouts (phonation time, the cycle dose).

Dann, 2026-10-06 23:34: today's Corrections are *"not logically organized, not visually appealing, and not intuitively organized (yet)."* He asks for three things: (1) the controls a singer actually needs to adjust any element of Ilya's output; (2) controls that work and are easy to find; (3) an arrangement that aligns with **Calm Authority**, Ilya's design idea: helpful, quiet, exact, and tethered to its sources. And: *"forecast which elements are likeliest to be routinely error-prone by our reader, and make the controls that edit those elements intuitive for the user and easy to find."* Ilya is a scholarly tool, not engraving software.

Dann, 2026-10-08 01:47: **"Be inspired by Finale's flexibility; use what we can learn from their interfaces."**

## Read first, whole

1. `docs/sessions/report-corrections-inventory_r1_2026-10-07.md`: every control in Corrections today (39 controls and keys), each driven at desk and phone size; what cannot be edited; the planned work not yet in the tree. Its screenshots are in a cloud folder that did not survive; the report's table is the record.
2. `docs/sessions/report-dynamics-tempo-hairpins-facts_r1_2026-10-07.md`: what Ilya holds for tempo, dynamics, and hairpins (tempo yes, dynamics and hairpins nothing), what the reader gives (none of the three), which readouts depend on them, and **Finale's and MuseScore's models, quoted from their manuals**: expressions attached to a note or a measure and dragged to reassign; hairpins as two endpoints attached to notes or measures, edited by handles; Finale's song-wide tempo with a choice of beat unit.
3. `docs/sessions/code-audit-correction-station-map_r1_2026-09-27.md`, `brief-code-corrections-fixed-panel_r1_2026-09-28.md` (a fixed-size panel, not yet built), and `brief-code-calm-loupe_r1_2026-09-28.md`.
4. In `docs/memory/OPEN.md`, the sections whose headings contain `THE LOUPE'S TWO MODES`, `THE CARET`, and `N.149`; and `N.162` in `docs/memory/STATE.md` (a caret and a note compete for the same thumb on a phone).
5. The code: `apps/web/src/lib/score/Loupe.svelte`, `apps/web/src/lib/score/CorrectionSurface.svelte`, and the handlers in `apps/web/src/routes/+page.svelte` the inventory names.

## What the reader gets wrong, measured (the forecast)

From the blind read of eight unseen songs (`docs/sessions/report-heldout-blind-read_r1_2026-10-07.md`) and the build-song reports (`report-day-4_r1_2026-10-06.md`, `report-night-1_r1_2026-10-06.md`, `report-night-2_r1_2026-10-06.md`):

| What goes wrong | How often, measured | Where |
|---|---|---|
| Notes that are not the voice (a piano staff read as voice, whole bars of chords or octaves) | 61 extra notes in 2 of 8 unseen songs; 154 in 2 build songs before a fix | whole systems at a time |
| Triplets not marked (lengths a half too long), or a printed 3 read as a note | 12 of 17 length misreads on the unseen set, all in one song; 55 lengths in *Sunless* 3 before a fix | runs of notes |
| Accidentals: a semitone or two off; double sharps read as naturals; a natural not carried through its bar | 8 pitch misreads on the unseen set, each one or two semitones; 6 double sharps in one build song | single notes, and the rest of a bar |
| A single length or dot | a handful per song | single notes |
| Missing notes | 0 on the unseen set | rare |
| Tempo, dynamics, hairpins | absent on every scan, by construction | the whole song |
| Metre, key, clef | rarely wrong; no control exists if they are | whole song or a passage |

**The desk's reading of that table (DESK INFERENCE, for Design to weigh):** the controls a singer needs most are, in order: (1) say that a stretch of bars or notes **is not the voice** and remove it in one act; (2) make and unmake a **triplet over a run** of notes; (3) set an **accidental**, including a double sharp, and say whether it **carries** through the bar; (4) length and dot on one note, as now. Then the performance marks: (5) a **tempo** at a caret; (6) a **dynamic** at a caret; (7) a **hairpin** from one caret to another. Then rare repairs: metre, key, clef, a barline.

## What Dann has decided about the new marks (2026-10-07 and 2026-10-08)

Each is a default with its reason. Who offered what is marked.

1. **Marks live at points, and the caret is the point** (Dann's observation, 01:33: tempo marks at points *"align very conveniently with our caret system"*). A caret is already a position in time, the gap before a note. A tempo or a dynamic attaches at one caret; a **hairpin runs from one caret to another**, which is Finale's two endpoints without drag handles. The desk's caution, accepted: the caret must not grow new taps of its own (N.162); the singer takes a caret as now, and the panel offers the station (today a note or a rest there; then **Tempo here**, **Dynamic**, **Hairpin from here**).
2. **Gradual tempo changes by termini** (Dann, 01:34: *"identifying termini for the rall, rit, and accel"*; the shape is the desk's, accepted): start at a caret with rit., rall., or accel.; by default the change runs to the next tempo mark or *a tempo* (ruling in `OPEN.md`, "held until a tempo"); the singer may end it at a second caret; the arrival tempo shows at the end, defaulting to 75 percent for rit. and rall. and about 133 percent for accel., nudged with − and +. Drawn as print: "rit." with a dashed line to the arrival tempo. No tempo graph to edit.
3. **A song-wide tempo, always present** (QUEUE row 48, being built): estimated from the metre when none is printed, shown as a range, and set by the singer in a small floating control with **two note chips** for the beat unit (the denominator's note and its grouping, for example 3/4 in quarters or a dotted half) and a number. Design's Corrections must sit beside this control without duplicating it.
4. **Provenance sigils** (`apps/web/src/lib/provenance.ts`): a printed mark carries no sigil; the singer's own mark carries the torso; a value Ilya estimated carries **≈**. Every sigil that prints is decoded in the legend (Dann, 2026-08-21).
5. **Nothing on the Paper is a control; layers float above it and never print** (`CONTRACT.md` section 6, ruled 2026-09-28). The Loupe is such a layer; so are the wait squircle and the tempo control.
6. **Marks for the reader's faults** (QUEUE, the desk's queue after row 48): Ilya will mark bars whose reading fails three checks (a span over two octaves, a chord in the voice, a leap beyond an octave), never changing a note. Design should show where such a mark sends the singer: straight to the bar in Corrections.

## What to learn from Finale (Dann's instruction of 01:47)

Read section 4 of the dynamics report for the quotations. The desk's summary of what transfers, for Design to accept or improve:

- **Attachment, then adjustment.** Finale attaches a mark to a note or a measure, then lets it be dragged to reassign. Ilya's equivalent is the caret, then nudges.
- **One tool per kind of thing**, chosen first (Finale's Expression tool, Smart Shape tool), then applied where the cursor is. Corrections could have **stations** in the same spirit: Pitch, Length, Accidental, Rest, Tuplet, Remove, and the new Tempo, Dynamic, Hairpin, chosen first, then applied at the note or caret in focus.
- **Keyboard flexibility for a desk user**: Finale is driven from the keyboard as much as the mouse. Corrections already has keys (`+page.svelte:1239-1275`); Design should keep and extend them, and show them quietly.
- **What not to copy**: Finale's density, its dialog boxes, and its tempo graphs. A singer is not an engraver.

## Constraints

- Phone and desk both. On a phone every target is at least 44 px; the caret and note competition (N.162) must not get worse. On a 1440 x 900 desk, today's panel shows only Duration and Pitch before scrolling (the inventory, "Plan against tree" item 5): the most-needed controls must be visible without scrolling.
- Existing colour tokens only (`apps/web/src/app.css`); Corrections sits in the Loupe on any tab.
- Both languages: list every new label in English; the desk drafts the French for Dann. Write no French.
- Undo and Redo stay as they are (one pill at a time in the bar), and every new act is undoable.

## Return

Drawings at desk (1440 x 900) and phone (390 x 844): the Corrections panel at rest; with a note in focus; with a caret in focus; removing a stretch that is not the voice; making a triplet over a run; setting a double sharp and its carry; placing a tempo, a dynamic, and a hairpin; a rit. with its termini. A short note per decision with its cost, a ranked list of the controls by how often a singer will need them (with the forecast row that justifies each), the new English labels, and a section listing what you could not establish. NOT ESTABLISHED beats a complete invented answer. Write the return into `docs/sessions/` as `design-corrections_r1_2026-10-08.*`.
