# Memo: slice 4, the desktop homecoming

For Dann. Branch `Shane`, floor `4553e3c`. No commits, no ship. Six files
touched, two deleted, one renamed.

**No new strings.** Every label, every verb, every sentence on the desktop is a
string the phone already shipped and you already ratified, which is what makes
the two surfaces one thing rather than two.

**Gate 4 holds at 872.** All five at baseline.

## 1. What changed

### One component, two containers

`CorrectionDock.svelte` is renamed `CorrectionSurface.svelte` and takes a
`variant` of `dock` or `panel` (`:55`). **That prop decides only WHERE the
surface sits.** `dock` is the phone's fixed shell, anchored to an edge with its
own `touch-action`, animation, and z-index; `panel` is the desktop drawer's
scrolling tenant, which adds a station rule and a seat and nothing else
(`:693`). Everything above that line, every station, every label, every verb,
every string, is one implementation.

**Two copies could not have stayed identical for a week.** That is the whole
reason the brief asked for one, and it is why the desktop needed no new
strings: there was nothing new to name.

`:385` is the one root with two skins. **The panel carries no accessible name
of its own**: the drawer's `<aside>` already says `Controls` / « Commandes »,
and a nested region repeating it would be one landmark announced twice. The
dock is not inside that aside, so it takes the name itself, which is your
ruling of 2026-08-26 that both containers share one. Verified in the walk and
`i18n.test.ts`'s N.62 assertions still pass untouched.

### Two components deleted

**`CorrectionControls.svelte`** carried the same verbs in a different order
under different labels. **`ShiftLyricsControl.svelte`** carried the two shift
verbs and hosted the syllabified text.

**The syllabified text was not lost with its station.** N.65 ship B put it
first under that label on your walk of `2238e8b`, and the arrangement comes
with the verbs: `CorrectionSurface` takes it as a snippet and renders it first
under LYRIC (`:623`). The drawer passes it; **the dock does not**, because the
dock's stations are sized to fit a phone and a syllable queue is not a verb.
`SyllableStation`'s six props are unchanged.

### The semitone verbs

Gone from both containers with the palette. **The `+` and `-` KEYS still fire
them** (`+page.svelte:896`), and that is a question rather than an oversight:
your ruling retired the verbs the drawer SHOWS, and Finale's own key mapping is
not a shown verb. One line to remove if "everywhere" includes the keyboard.

### The loupe on desktop

`+page.svelte:1015`. One deletion: `isPhone` leaves the availability test. The
loupe was never a phone object; it is Speedy's editing frame, and your ruling
of 2026-08-25 said it persists on desktop.

`:1488` is what it stands clear of: the dock on a phone, **the open drawer on a
desk**, which the brief names. A collapsed drawer takes nothing.

**One rule had to be told it was a phone rule** (`:1303`). Slice 2 r3 made
opening the drawer dismiss the loupe, because on a phone the drawer covers the
whole screen and three surfaces would stack. A desk arrives with its drawer
open, so on desktop that rule dismissed the loupe the instant it rose. Measured
before it was fixed. It is gated on `isPhone` now.

### The lyric anchors unify

`+page.svelte:315`. The station-cursor anchor is gone and `dockShiftAnchor` is
the only one, read by both containers. The interim disagreement the slice 3
memo recorded ends here.

**One defect the walk found on the way** (`:1129`): the line the shift verbs
walk was the READ's, which was right while the only notes were the reader's.
Slice 3 let the singer enter notes, and an entered note is in no read, so with
an entered entry taken all four lyric cells read disabled. It walks the
corrected line now.

### The keyboard

`+page.svelte:896`. Left and right drive the stepper; **Escape dismisses the
loupe** rather than merely dropping the selection, so the surfaces leave
together as they do by every other route.

Two things came with it. The handler was gated on a selected NOTE and is gated
on a CURSOR now, so it does not go dead in a gap. And **every key goes through
the surface's own handler rather than past it**: the digits call
`handleDurationCell` and the dot calls `handleDotCell`, which is what the
DURATION cells call, so a digit in a gap enters an entry exactly as a tap does.
The verbs that need a note stand down in a gap, the same ones the surface
greys.

### Dismissal on a fine pointer

The chevron and Escape. **The swipe is gated to phones** (`:1260`): without it
a mouse dragged down the loupe dismissed it, which is a gesture nobody on a
desk would try on purpose and everybody would trigger by accident. The
chevron's accessible name differs by container and neither is new: the dock
speaks `drawer.collapse`, the panel speaks `correct.deselect`, which is `Done`
/ « Terminé », the word the palette this replaces already used for exactly
that.

## 2. The desktop magnification, and how I chose it

**2.18 on today's engraving, and it is derived rather than picked**
(`Loupe.svelte:105`).

2.4 is a portrait figure: it multiplies a page already shrunk to a thumbnail.
On a desk the page is drawn at full size, so the same multiplier would put one
measure across a monitor.

**So the desktop asks for what the loupe is FOR, which is a readable stave**: a
target stave space in CSS pixels, divided by the one the page is already
drawing. The target is 12 px. Gould sets a vocal score's rastral around 7 mm,
which at 96 dpi is about 26 px of staff height and so about 6.5 px of stave
space; twelve is a little under twice that, which is the register a notation
editor works at and roughly what Finale shows at 100 percent on a modern
display.

Measured at 1400 px on the engraved song: the page draws a **5.5 px** stave
space, the loupe draws **12.0 px**, and the applied magnification is
**2.18**. It follows the engraving rather than fighting it, so if the print
stave ever moves the loupe moves with it.

Clamped to 1.2 and 2.4. Below 1.2 it is not a magnifier and a singer would
wonder what it was for; above 2.4 it would outrun the phone's own ruled figure,
and one grammar means the desk never magnifies harder than the phone does.

## 3. The up-and-down arrows, argued both ways

**They already drive the pitch verbs, and have since slice 1.** So this is not
a question about building something; it is a question about whether to keep
what shipped. I have changed nothing.

**The case for keeping them.** It is Speedy's own grammar: the crossbar moves
by arrow, and Dann knows it in his fingers. It costs nothing, it is already
there, and taking it away would be a loss with no gain. Shift-arrow already
gives the octave, which is the natural extension nobody has to be taught. And
the brief's own principle cuts this way: a singer who learned Finale has
learned this.

**The case against.** Left and right now move the insertion bar through a
sequence that includes GAPS, and up and down change a note's pitch. Those are
two different kinds of act on one pair of keys, and in a gap the vertical pair
does nothing at all, which is a dead key in a live state. Speedy's crossbar was
a cursor, not a verb: in Finale the arrows MOVE the crossbar and typing a pitch
letter or a number sets the note. So the honest Speedy mapping might be
vertical arrows moving a pitch cursor that the next duration would use, which
this build has no such cursor for. Binding them to an immediate pitch change is
the convenient reading of Speedy, not the faithful one.

**My read, offered and not acted on**: keep them. The dead-key-in-a-gap
objection is answered by the PITCH station's own label, which already says in
words what will happen when a note arrives, and the alternative asks for a
pitch cursor nobody has ruled. **Yours to settle.**

## 4. What the re-cut dropped, named rather than buried

**`handleRestoreNote`, the per-note restore** (`+page.svelte:714`). It cleared
every correction on ONE note at once. The four stations carry verbs and "undo
everything I did to this note" is not one of them; the named Undo pill reverses
the last verb, which is the nearer thing and not the same thing.
`clearCorrection` is untouched and still exported, so bringing it back is a
cell and a handler. **Your ruling.**

**N.65 ship B's placed-syllable counter**, which fed the station header this
re-cut dissolved. The rule it encoded is not lost: `SyllableStation` greys a
placed syllable by the same origin key, and that component is untouched and
still under the LYRIC label.

## 5. What I looked at with my own eyes

### Desktop, 1400 by 900, with the engraved song

Each step stated its expectation and its likeliest failure before the
measurement.

| step | expected | got |
|---|---|---|
| the drawer's re-cut | four stations, no palette, no shift station, no semitone cell | `Duration`, `Pitch`, `Accidental · Entry`, `Lyric`; all three absent; syllabified text inside LYRIC |
| the accessible names | drawer named, panel silent | drawer `Controls`, panel carries none |
| the loupe rises | fixed, clear of the drawer, clef and key, page dimmed | `m. 9 · system 3 of 6`, box `[544, 314.4, 832, 277.8]`, **clears the open drawer**, head 122.2 px, page opacity 0.78 and deaf |
| arrow keys walk the bar | the loupe holds, the mark moves | `m. 9` became `m. 10`; loupe box **identical**; mark 250.2 to 439.8 |
| a duration from the panel | it lands, the pill names it | `B♭3 · Quarter` became `B♭3 · Eighth`, pill `↰ Undo: Quarter → Eighth` |
| the gap grammar | the readout names the place, a digit enters | `after B♭3 · the next duration enters here`; `Pitch · takes the pitch of B♭3`; 96 notes became 97, pill `↰ Undo: entry added` |
| rest, tie, Nolet | all three act from the panel | `Rest · Quarter`; tie marks 0 to 1; brackets `["2"]` became `["3","2"]` |
| the lyric verbs | live on the taken entry | all four enabled, no cursor visit |
| Escape and the absent swipe | Escape dismisses, a drag does not | drag left it up; Escape sent it away and the page returned to full ink |
| the reload | corrections survive | 99 notes before, 99 after |
| print | nothing of this reaches the sheet | loupe absent, drawer `none`, the panel does not reach the sheet, page at full ink |

**The `["2"]` before the triplet is the score's own duplet**, not a stray: the
engraved song carries one in its last system. I checked rather than assumed,
because a bracket appearing where I had not put one is exactly the kind of
thing worth being wrong about.

### Phone, 430 by 932 and 932 by 430, spot-checked for zero change

| check | got |
|---|---|
| the dock is still the shell | yes, and the surface is inside it |
| the magnification | **2.4**, the ruled figure, unchanged |
| the stations | same four, same order |
| the syllabified text | **absent from the dock**, as intended |
| the dock's accessible name | `Controls` |
| the 44 px floor | zero breaches |
| the loupe while stepping | held |
| the swipe | still dismisses |
| opening the drawer | still excludes the loupe |
| landscape | dock 380 by 430, `scrollHeight` equal to `clientHeight` |

## 6. Gate results

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `872 passed (872)` | `872 passed (872)` |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

**All five at the baseline the ship script holds.** No test was added and none
was removed: this slice moved a component between containers and deleted two,
and the pure logic underneath it, `entry.ts` and `correction.ts`, is untouched.
`~/Downloads/ilya-ship.sh` needs no edit.

**N.62's assertions still hold**, run on their own to be sure rather than
inside the gate's count.

## 7. Not established

- **Whether a desktop page click should still place a syllable.** It does,
  which is the ruled desktop behaviour slice 3 left alone, and it is now the
  one place the two modalities differ: on a phone a page tap navigates only
  and placement happens inside the loupe. With the loupe on both, that
  asymmetry has no reason left that I can see, but striking it is a behaviour
  change nobody has ruled. **One line, and the nearest thing to unfinished
  business this track has.**
- **The up-and-down arrows**, §3.
- **The per-note restore**, §4.
- **Whether the `+` and `-` keys count as semitone verbs**, §1.
- **The 12 px target.** It is reasoned from Gould's rastral and from what a
  notation editor shows, and no source sets a loupe's stave size. A different
  target is one number.
- **Whether the panel should scroll with the drawer or pin.** It scrolls, as
  every other drawer tenant does, so a long definition row can carry the
  readout off the top of the panel. The dock has no such problem because it is
  the whole surface. Untested against a singer's habit.
- **Everything carried from slice 3 stands**: the overfull bar's arithmetic
  firing on page-read documents, the entered entry not re-timing its measure,
  the tuplet's forward-only run, and iOS Safari specifically.

## 8. Housekeeping

The dev server on port 5174 is stopped. Nothing was copied into the
repository's static directories. Walk scripts and screenshots are in this
session's scratchpad, outside the tree.

---

## 9. Appended: the three rulings

All three built and walked at both widths. **Gate 4 holds at 872**, and one new
string entered, coined nothing.

### Ruling 1. The up-and-down arrows stay on the pitch verbs

Nothing changed, which is the whole of it: they have driven the pitch verbs
since slice 1 and I had argued rather than acted. Recorded here so the next
reader of §3 knows the question is closed.

### Ruling 2. The desktop page click stops placing

`+page.svelte:handleNotePick`. One line went: `if (isPhone) return`. The page
click now navigates on both modalities and placement lives inside the loupe on
both, which ends the last difference between them.

**Recorded as reversible**, by your own ruling: putting that line back restores
the desk's old behaviour exactly, and the comment at the handler says so.

Walked at 1400 px: a click on a mid-page measure left the page's text
**byte-identical** and the loupe took `C♯3 · Quarter`; a click on an entry
inside the loupe placed, and the readout became `E3 · Quarter · Ком`. The phone
was re-checked for the same thing and still places nothing on a page tap.

### Ruling 3. Restore and the counter come back, into the shared surface

**The per-note restore** is a cell in ACCIDENTAL · ENTRY, beside Delete
(`CorrectionSurface.svelte:617`), with `handleRestoreNote` and
`restoreAvailable` at `+page.svelte:743`. It clears every correction on one
entry, which the Undo pill cannot do: the pill reverses the LAST verb and this
reverses all of them here.

**It is offered only where there is something to restore TO**, and that guard
is not decoration. A hand-entered entry's record IS the entry, so clearing it
would DELETE the note rather than restore it, silently, under a word that
promises the opposite. Delete is the verb for that and says so. The test is a
correction on an entry the read still carries.

**The counter** is on the LYRIC station's own label (`:639`), which is where its
verbs now live. Two numbers rather than a formatted string, so the thin-space
pair is drawn once and needs no translation, and drawn only where `total` is
above zero, which is N.65 ship B's own rule: an unconditional counter would say
`0 / 0` on an empty drawer.

**Both are in both containers**, and the phone's geometry did not force a
ruling: see the measurements below.

### The one new string

| key | English | French | coined or adopted |
|---|---|---|---|
| `loupe.restore` | Restore | Rétablir | **adopted.** « Rétablir » is already in the file at `meta.revertToScore`, which says « Rétablir l'en-tête de la partition » |

`correct.restore` stays the cell's accessible name, so a screen reader still
hears the whole shipped sentence, "Undo my corrections to this note", which is
too long for a 44 px cell. **Nothing is coined.**

### What I looked at

**Desktop, 1400 by 900, with lyrics transcribed so the counter had something to
count:**

| check | got |
|---|---|
| a page click places nothing | page text **unchanged**, loupe took `C♯3 · Quarter` |
| a click inside the loupe places | `E3 · Quarter · Ком` |
| Restore present, idle on an uncorrected entry | present, disabled |
| Restore after a correction | enabled; `E3 · Eighth · Ком` returned to `E3 · Quarter · Ком`, pill `↰ Undo: corrections cleared` |
| **Restore on a hand-entered entry** | **disabled**, which is the hazard guarded |
| the LYRIC counter | `1 / 12` |

**Phone, and this is where a ruling could have been forced and was not:**

| check | got |
|---|---|
| Restore in the dock | present |
| the LYRIC counter in the dock | `0 / 12` |
| the 44 px floor | **zero breaches** |
| portrait dock height | 477, unchanged |
| landscape dock | 380 by **430**, `scrollHeight` equal to `clientHeight` |

**The seventh cell did not push landscape over.** The ACCIDENTAL · ENTRY row
now holds seven at 44 px, which is what the DURATION row has always held, and
356 px of content takes seven cells and six gaps with 24 px to spare. So both
containers keep both verbs and no geometry ruling is owed.

### Gates, re-run

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `872 passed (872)` | `872 passed (872)` |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

**All five at the baseline the ship script holds, and gate 4 did not move.** No
test was added: these are two cells, one deleted line, and a counter in a
label, and the pure logic underneath, `entry.ts` and `correction.ts`, is
untouched. `~/Downloads/ilya-ship.sh` needs no edit.

### What this closes, and what it leaves

**§7's first item is closed.** The two modalities now differ in nothing I can
name: same surface, same strings, same verbs, same grammar, same anchors, same
tap meaning. The remaining open items are unchanged and none of them is a
difference between the desk and the phone.

**One thing I did not do and would not without a ruling**: the restore cell has
no confirmation. It can undo a run of corrections on one note in a single tap,
and the Undo pill reverses it as one operation, which is the safety. That
matches the surface's own no-confirm rule and I mention it because it is the
one verb here that can throw away more than one decision at a time.
