# Report: what to take from Finale's note entry, and what to leave

Revision 1, 2026-09-17. Written at the desk for Dann, from web research
run by a Sonnet agent at the desk's instruction (137k tokens, 2026-09-17). The
agent's memo is not in the tree; its sources are in the appendix below, and
every product claim here comes from one of them. Every claim about Ilya carries a
`path:line` read this session. Judgments are the desk's and are marked.

## 0. CORRECTION, 2026-09-17, THE SAME NIGHT

**Section 1's premise was wrong, and the desk owns it.** This report said
nothing in Ilya inserts a note. Insertion is BUILT: `correction.ts` carries
`NoteCorrection.entered = { after }` (`:48-100`), `applyCorrections` emits
hand-entered events in their place (`:305-345`), `synthesize` seats them
(`:496`), `reflowOnsets` re-times the measure after them (`:382-433`),
`correction.test.ts:457` tests one, and the string `loupe.undo.entered`
("entry added") is in `i18n.ts:491`. The control is in the Corrections surface:
walking with the prev and next arrows lands the singer IN A GAP, and a duration
cell there enters a note at the ruled arrival pitch
(`CorrectionSurface.svelte:539-541`, and the `inGap` branches from `:470` on).
This is N.92 slice 3, ruled and shipped before tonight.

**The desk found this only when Dann asked for an estimate**, which is the
tether-21 failure in its usual costume: a sentence about what the tree does not
have, written without opening the file that has it. Every "NOT in the tree
today" line in section 4 below is suspect for the same reason and is marked
there.

**What is genuinely new in tonight's design, after the correction:** the way a
singer REACHES an insertion point (a caret between note chips, rather than
walking the arrows into a gap), the fill line that says the measure is short or
over, articulations, and tempo.

## 0. CORRECTION, 2026-09-17, after the audit

**This report's premise was wrong and the desk owns it.** It said nothing in
Ilya inserts a note. **Insertion is built, as N.92 slice 3**, and the audit
(`memo-n92-edit-audit_r1_2026-09-17.md`, by a Sonnet agent, read in full) traced
it end to end: `NoteCorrection.entered` (`correction.ts:66-76`), `enterEntry`
(`entry.ts:183-198`), `synthesize` (`correction.ts:496-526`), `reflowOnsets`
(`correction.ts:382-433`), with the beam and spacing passes following for free
because the renderer lays out from onsets (`staff-renderer.ts:2117`). The
control is the stepper beside the readout: walking into a GAP arms the next
duration, and a duration cell there enters a note
(`CorrectionSurface.svelte:492-507`, `+page.svelte:1122-1137`).

The desk wrote "nothing in Ilya inserts a note" without opening the file that
does, which is tether 21's failure in its usual costume. **What is genuinely new
in tonight's design is how a singer REACHES an insertion point**, plus the
marks, the tempo and the fill line's wording. Every "NOT in the tree today" line
below is corrected in the audit memo, which supersedes this report where they
disagree.

## 1. The question this answers

Dann, 2026-09-17: *"We're not trying to reinvent or duplicate Finale. We're
trying to distil its GUI and approach to intuitive note entry so that we can
offer a condensed, localized, and optimally effective set of controls that will
give the user control over how the score is realized."*

Ilya's user is not writing music. They are repairing a read: the page says six
notes, the reader found five; the page says F sharp, the reader says F. The
tools have to be enough for that, and no more.

## 2. What Finale actually does, in one page

**Four ways in.** Simple Entry (pick a length from a palette, click the staff),
Speedy Entry (a frame over ONE measure, number keys for length, letters or MIDI
for pitch), HyperScribe (play it live), and the Note Mover and Mass Edit tools
for shifting what is already there.

**Speedy Entry is the one that matches us.** It opens an editing frame over a
single measure and shows three things: an insertion bar, a pitch crossbar, and a
voice indicator. That is the loupe, in 1990s clothes.

**The number ladder.** Finale: 1 is a 64th and 8 is a breve, so a quarter note
lands on 5, in the middle of the keypad. MuseScore keeps 4, 5, 6 for eighth,
quarter, half. Dorico runs the ladder the other way, 7 for a half. **Three
products, three incompatible ladders**, which tells you the ladder is muscle
memory, not intuition.

**Insert versus overwrite is a mode everywhere.** Finale: Option or Alt plus the
length inserts, or a menu toggles Insert mode. MuseScore has Insert mode.
Flat.io has an Insert mode with its own toolbar button and the `I` key. All three
document it as a state the user must hold in mind.

**Finale polices a measure that is too FULL and says nothing about one that is
too EMPTY.** Leaving an overfull measure raises "There Are Too Many Beats In This
Measure", with four choices: leave it, delete the extra, push it to the next
measure, or re-bar everything after. The research could find no equivalent
warning for a measure that is short. **Our reader's usual failure is the short
measure.**

**Lyrics.** Finale's Lyrics window has Click Assignment: a viewer shows the next
pending syllable, clicking a note places it and advances, and a modifier-click
distributes the rest automatically. **That is N.147 and the first pass, already
built.** Typing into the score slides the following syllables left when one is
deleted, which is the behaviour Dann ruled out for Ilya on 2026-09-07 in favour
of vacating the notes (`INBOX.md:107`).

**Articulations and tempo are separate tools** in Finale, applied to a selected
note or region from a dialog, with one-letter metatools for the common marks.

**Touch precedents.** Dorico for iPad puts a duration picker and a piano keyboard
in a lower zone at thumb height, with a caret and a button that advances without
entering a rest. StaffPad lets a singer erase and redraw the one stroke that was
misread rather than the whole bar. MuseScore has Re-pitch mode: change the
pitches of a run and leave every duration alone.

## 3. The seven judgments

**J1. Take Speedy Entry's frame, not its keyboard.** The idea worth stealing is
one measure under glass with a cursor in it. The number ladder is muscle memory
for people who used Finale daily for a decade. A singer fixing one note a month
will never build it. **Glyph buttons are the primary control on both surfaces**,
with keys as an accelerator on a computer only.

**J2. Kill the insert mode. Use geometry instead.** Every product studied makes
insert a MODE. The N.151 drawing makes it a PLACE: the caret between two note
chips inserts, the chip itself changes. Nothing is remembered, nothing is
toggled, and the singer points at the gap they can see. **This is the one place
where we should not follow Finale, and it is the heart of the design.**

**J3. Our fill line is a real advance, not a copy.** Ilya is already handed the
measure's actual and expected fill (`Loupe.svelte:90`), so it can say "one eighth
short of 12/8" at the moment the singer is looking at the measure. Finale never
says this. It is also the honest way to surface an OMR miscount: the singer does
not have to count.

**J4. The edit set is small, and it is fixed by what a singer hears.** Length,
pitch, accidental, rest, insert, remove. Ties, because a vocal line is full of
them. Tuplets, because triplets are everywhere in Russian song. **Not** layers,
voices, cross-staff notation, beam control, grace notes, or chords: a vocal line
has one note at a time, and every one of those is a notation-editor feature with
no singer behind it.

**J5. Articulation is not decoration here, it is arithmetic.** Staccato,
tenuto and a fermata change how long the voice actually sounds, and Shane's whole
purpose is phonation time per vowel. **A breath mark belongs in the same set**,
and no notation program treats it as a first-class singer's mark. **DESK
RECOMMENDATION: staccato, tenuto, fermata, breath.** Accent and marcato change
attack rather than duration; they can wait.

**J6. Tempo is an input to the analysis, not a label on the page.** A crotchet
at 60 and the same crotchet at 120 are two different phonation times. If Ilya is
to say anything true about how long a vowel is sung, the singer must be able to
say what the tempo is, and to change it where the score changes it.

**J7. Re-pitch is the second OMR failure and we get it for free.** MuseScore
built a mode for "right rhythm, wrong notes". In the loupe, that is selecting a
chip and nudging the pitch, one note at a time, with no mode at all. Good enough
until a singer complains.

## 4. What goes in, what stays out

| In the edit surface | Why |
|---|---|
| Insert a note at the caret | The reader dropped one. **BUILT (N.92 slice 3); what is new is reaching it by a caret rather than by walking into a gap.** See §0. |
| Remove the selected note | The reader invented one. Exists today (`correct.delete`). |
| Length, including dot and tuplet | Exists today; the reader mis-reads rhythm constantly. |
| Pitch by step, semitone and octave | Exists today. |
| Accidental, including a respell | Exists today. |
| Rest | Exists today. |
| Tie to the note before or after | A vocal line is full of ties. **`NoteCorrection.tied` exists (`correction.ts:48-100`); whether a control reaches it is NOT ESTABLISHED.** |
| Staccato, tenuto, fermata, breath | They change sung duration, which is Shane's arithmetic. No field and no string found for them, checked 2026-09-17. |
| Tempo for the measure, inherited forward | Same reason. NOT in the tree today. |

| Left out | Why |
|---|---|
| Layers, voices, chords | One voice, one note at a time. |
| Cross-staff, beaming, stem direction, grace notes | Engraving, not repair. Ilya engraves. |
| Live MIDI capture (HyperScribe) | A singer is repairing a page, not playing one. |
| Region operations (Mass Edit, Note Mover) | The loupe is one measure. A region tool needs a second surface. |
| Finale's number ladder as the primary control | J1. |
| An insert MODE | J2. |

## 5. The costs, honestly

- **`VocalLineEvent` must not change** (`CONTRACT.md` §6). Articulation, tempo
  and ties are new per-note or per-measure facts. Where they live is NOT
  ESTABLISHED and is Code's first question: the pairings map is the obvious
  precedent, since it already carries per-note facts beside the parsed score.
- **Insert and remove move the syllable seats.** Deleting a word already vacates
  its notes by Dann's ruling of 2026-09-07 (`INBOX.md:107`); deleting a NOTE has
  no ruling yet. **This needs one before Code builds.**
- **Height.** The edit panel is three rows of cells plus the note chips. The
  loupe already fought for room on a phone in N.147 and needed a second clamp.
- **The release.** This is the largest new thing proposed since the sort. It
  belongs after the beta unless Dann rules otherwise, and the checkpoint of
  2026-10-09 is where it would be cut.

## 6. Questions only Dann can answer

1. **Which articulations does a singer actually need here?** The desk proposes
   staccato, tenuto, fermata and a breath mark, on the grounds that all four
   change how long the voice sounds. Is that the right four?
2. **How should tempo be entered?** A number of beats per minute, a tapped
   tempo, or a list of Italian terms with a default speed behind each?
3. **When a note is deleted, what happens to the syllable on it?** It vacates
   (the syllable returns to the queue), or it slides onto the next note, or it
   is simply gone. Your 2026-09-07 ruling covers a deleted WORD, not a deleted
   note.
4. **Does an edited note look edited?** Ilya counts corrections today
   (`correct.state`). Should the page or the loupe show which notes the singer
   changed, and should a printed page say so?

## 7. What you did not ask, and should

- **Does a corrected score round-trip?** If a singer repairs six measures, can
  they get that score out of Ilya, or does the repair live only inside Ilya?
  Nothing in the memory files answers this.
- **Does an edit reach Insights?** If a duration edit changes the phonation
  numbers, the report should say the numbers came from an edited score. An
  uncited number is the thing Ilya exists to refuse.
- **What happens when the singer replaces the file?** Re-uploading a corrected
  score has no stated rule for whether the corrections survive.
- **Is there a keyboard-only path?** Every product studied is weak here, and
  MuseScore's own handbook admits editing needs the mouse. A singer with a
  tremor is in your own touch-geometry ruling's reasoning.
- **What is the stopping rule?** "Repair a read" is a good boundary today. The
  first request for a cadenza, an added breath bar, or a transposed copy is
  where it fails. Write the rule down before the request arrives.

## 8. What the desk recommends, in one line

Build the N.151 surface as drawn (chips, carets, glyph cells, the fill line),
with **insert, remove, tie, and the four singer's marks**, and treat tempo as a
separate, smaller item so it can ship on its own.


## Appendix. Sources for section 2

Finale, MakeMusic's own manuals: Simple Entry
(`usermanuals.finalemusic.com/FinaleMac/Content/Finale/Simple_Entry.htm`);
Speedy Entry (`.../Finale2012Win/Content/Finale/Speedy_Entry.htm`); Speedy Entry
tutorials (`.../Finale2009Mac/.../Tutorial_1b_Speedy_Entry.htm`,
`.../Finale2010Win/.../Tutorial_1b_Speedy_Entry14.htm`,
`.../Finale2011Mac/.../Tutorial_1b_Speedy_Entry8.htm`); Check for Extra Notes
(`.../Finale2012Win/.../ID_MENU_SPEED_CHECK_DUR.htm`); "There Are Too Many Beats
In This Measure" (`.../FinaleMac/.../SPSAVDLG.htm`); keyboard shortcuts, 2014 Mac
and Windows; the Finale 2012 Windows Quick Reference Guide (PDF); HyperScribe
(`.../Finale2009Mac/.../Recording_with_HyperScribe.htm`); Note Mover
(`.../Finale2012Mac/.../Note_Mover_menu.htm`); the Lyrics window
(`.../FinaleWin/.../EDITLYRC.htm`); articulations
(`.../Finale2012Mac/.../ADDARTIC.htm`); tempo marks and dynamics
(`.../FinaleWin/.../Tut6DynamicsArticulationsSlurs1.htm`).

Others: MuseScore handbook, "Entering notes and rests" and "Alternative note
input methods"; MuseScore 2 handbook, "Accessibility"; Dorico for iPad note
input (`blog.dorico.com/2021/08/tip-input-notes-in-dorico-for-ipad/`) and the
Dorico 5 Quick Reference Poster (PDF); StaffPad help centre, "Writing Notes" and
"StaffPad Concepts"; Noteflight's Keyboard Command Summary (PDF); Flat.io help
centre, "Inputting your first notes" and "Insert mode".

**Not established by the research**, and so not relied on above: Finale's key
map for 32nd, 16th and whole notes in Speedy Entry (the manual gives it as an
image); whether Simple Entry distinguishes insert from overwrite at all; any
Finale accessibility documentation; touch-specific note entry in MuseScore's
mobile app and in Noteflight.
