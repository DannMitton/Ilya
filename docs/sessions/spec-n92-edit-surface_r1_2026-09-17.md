# Spec: the measure edit surface Ilya is to have

Revision 1, 2026-09-17. Written at the desk from a design exchange with Dann the
same night. **This is the TARGET, not a description of the tree.** What exists
today is the audit's job (`brief-n92-edit-audit_r1_2026-09-17.md`), and every
"does Ilya do this" question below is answered there, not here.

Numbering: this is N.92's territory (notation editing, numbered by Dann
2026-08-24), not a new cardinal. The desk's working name for the surface is the
**edit surface**. N.151 was the desk's number for it before the desk found N.92;
the two are the same work and N.151 is retired unless Dann says otherwise.

## 1. What the surface is for

A singer has a score Ilya read from a PDF, a photograph or a file. The read is
wrong in the ordinary ways: a note missing, a note invented, a wrong pitch, a
wrong rhythm, a tuplet flattened. The singer fixes it where they are looking at
it, one measure at a time, in the loupe.

**There is no boundary at "repair". Ruled by Dann 2026-09-17:** *"They should be
able to intentionally break a score or even recompose one... they maybe able to
enter a melody from scratch using Ilya only as the composition device! Why not?"*

## 2. The settled model, which nothing here may contradict

From `PRODUCT.md`, "The text and the notes", ruled 2026-09-17:

1. The poem in Input is the text, and only Input changes it.
2. A syllable on a note is a placement, not a copy. Delete the note and the
   placement goes; the syllable returns to the queue, grey.
3. Deleting text happens in Input, and the notes it sat on go quiet.

One act destroys work: deleting text in Input that carries placements, and it
says how much it will free before it acts. Everything in the loupe is a
placement or a correction, and Undo restores it. **Ilya does not warn about a
placement that is merely wrong.** A syllable on the wrong note is the singer's
own business.

## 3. The shape of the surface

The loupe's lower section is shared by two panels under one bar:

- **The bar**, left to right: a **Syllables / Corrections** pair; **Undo** and
  **Redo**; the chevron. The label side is the disclosure (a bar that is a
  button cannot hold buttons). Undo and Redo are the app's existing single
  stack, whose label already says what it will take back.
- **Syllables panel**: N.147's row, shipped 2026-09-17.
- **Corrections panel**: everything in section 4.

The loupe opens on Syllables. The panel swaps without the loupe jumping.

## 4. The edit set

### 4.1 Reaching a note or a gap

- Tapping a note in the loupe selects it (N.147).
- The measure is drawn again as a row of **chips**, one per note, each carrying
  its length and its syllable, with a **caret** between chips.
- **A chip selects a note. A caret selects the gap between two notes.** The
  cursor therefore stands in one of two kinds of place, and that is what
  replaces an insert MODE. On a computer the arrow keys step through the
  measure alternately: note, gap, note, gap.
- **One rule covers both:** choose a length while a note is selected and that
  note changes; choose a length while a gap is selected and a note is inserted
  there.

### 4.2 The verbs

| Verb | Behaviour |
|---|---|
| Length | 16th to whole, dot, tuplet. |
| Pitch | Step, semitone, octave, up and down. |
| Accidental | Sharp, flat, natural, under the ruled spelling policy. |
| Rest | The selected note becomes a rest; in a gap, a rest is entered. |
| Insert | At a caret, at the ruled arrival pitch, with the armed length. |
| Remove | The selected note goes; its syllable returns to the queue. |
| Tie | To the note before or after. |
| Marks | Staccato, tenuto, fermata, breath. **Ruled by Dann 2026-09-17**, on the test that each changes how long the voice sounds. Accent and marcato are out: they shape attack, not length. |

**Out, and to stay out:** layers and voices, chords, cross-staff notation, beam
control, stem direction, grace notes, live MIDI capture, region operations.

### 4.3 The measure's fill

- Ilya states the measure's count in one line: **short**, **adds up**, or
  **over**, in one neutral voice.
- **Over is a normal state while the singer works.** Ruled by Dann 2026-09-17:
  a sextuplet of sixteenths is over the meter until it is bounded as a
  sextuplet, and Ilya must wait rather than refuse, trim or re-bar. Finale's
  "There Are Too Many Beats In This Measure" and its four remedies are not
  adopted.
- **A measure left over is flagged.** The flag persists until the count
  resolves: in the fill line whenever that measure is raised, and quietly on the
  measure itself on the page.

### 4.4 Tempo

- The singer may place a tempo **anywhere**, whether the composer wrote one
  there or not. Ruled by Dann 2026-09-17: it serves the performance they intend,
  and it feeds their own phonation-time figures.
- Ritardando, accelerando and a caesura act over a span rather than on one note
  and belong with tempo rather than with the marks.
- Tempo is its own slice, so it can ship on its own.

## 5. Print and export

- **WYSIWYG, ruled by Dann 2026-09-17:** *"if it appears on Ilya's page, it can
  be printed."*
- A corrected score comes back out of Ilya **as an edited copy**, never as the
  composer's text.
- **The printed page carries one line** saying the tempo or the notes are the
  singer's, **only when that score holds singer edits.** A clean score prints as
  it does today. Nothing of the kind appears on screen: the singer made those
  choices minutes ago.

## 6. Accessibility

No keyboard-only mode and no new chrome. The controls stay reachable by Tab and
keep the labels they already carry. Ruled by Dann 2026-09-17.

## 7. Later, not now

- **N.152, playback of the Markup**, asked for by Dann 2026-09-17: play, pause,
  rewind, fast forward, navigation by measure number, and a choice of timbre
  (choir, flute, saxophone, piano, synthesizer). Its purpose is repertoire
  study: a singer hears the line on a phone instead of finding a piano or a
  recording. Tempo, the marks and the corrected rhythm all feed it, which is why
  the edit surface comes first. The desk owes research on the sound sets and on
  what transport serves study rather than production.

## 8. Open, and Dann's to rule

1. Whether a measure left over may print, and what Insights says about a song
   holding one.
2. What happens to a night of corrections when the singer uses **Replace** on
   the score. The desk's position: that act says what it will lose first.
3. Whether the edit surface ships in the 2026-10-30 release. This waits on the
   audit's cost.
