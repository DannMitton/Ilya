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

---

## 10. Appended: the desktop walk's three rulings and its defect

**§1 through §9 shipped as `1069fe9`**, "N.92: slice 4, the desktop
homecoming", so everything above is in history and this section's work is what
is dirty: `RootPanel.svelte`, `i18n.ts`, `CorrectionSurface.svelte`,
`Loupe.svelte`, `+page.svelte`, and this memo.

**One new string, coined nothing. Gate 4 holds at 872.**

### Ruling 1. The insertion bar is lavender

`Loupe.svelte:404`. Measured: the bar draws `rgb(142, 126, 155)`, which is
`--deeper-lavender`, and the held-measure rectangle draws `rgb(139, 154, 125)`,
which is `--sage`. **Two marks, two colours, two jobs**: sage says which measure
the page is working on, lavender says where in it the singer stands.

### Ruling 2. A click outside the loupe retires it, on a desk

`+page.svelte:1210`, gated to fine pointers. Recorded in the code as **an
accepted disparity**, with your reasoning beside it: on glass a stray tap is
the easiest gesture to make by accident and no Undo restores a lost place; a
mouse does not stray, a click is aimed, and on a desk the page is large enough
that clicking it is the natural way to say "not that measure, this one".

**One thing had to be learned to make it work** (`:1224`). `elementFromPoint`
could not serve, because while the loupe is up the page is DEAF by the ruling
that put it in its second state, so the topmost element at a page coordinate is
never a sheet. The click did nothing at all until it became a geometry question
instead of a hit-testing one. The loupe and the surface are excluded by the
click's own target first, so a point inside a sheet's box is a click on the
page and nothing else.

Measured: on a desk the outside click retires the loupe; **on a phone a stray
tap outside it stays dead**, which is the disparity holding in the direction it
was ruled.

### The chevron defect: cause, and it was two things

**The cause I can name and prove is that the panel's chevron stood there with
nothing to dismiss.** Measured, with the loupe down: the panel is still
rendered in the drawer, its chevron is still rendered, and clicking it changes
nothing — no loupe to put away, page already at full ink. The panel is a
permanent tenant of the drawer and the loupe is not, so the chevron was idle
for most of every session. `CorrectionSurface.svelte:483` makes it absent when
it cannot act, which is the Undo pill's own rule applied to the second control
on this surface that can be idle, with its 44 px reserved so the row does not
move. The dock keeps its chevron always, because the dock only exists while the
loupe does.

**A second thing turned up while I was proving the first, and it is not a
defect.** With Corrections moved to the foot of the scroll (ruling 3), the
chevron at 1400 by 900 sits BELOW the scroll's visible box: measured, the
chevron's rectangle is outside `.drawer-content`'s. A locator click, which
scrolls first as a wheel does, reaches it and it dismisses correctly. **My own
first probe clicked raw coordinates and reported a failure that was the
probe's**, which is worth recording because I nearly logged it as a defect.

**What it means for the singer is real even though it is not a bug**: on a
900 px desk the readout, the stepper and the chevron are below the fold, and
reaching them means scrolling the drawer. Escape and the outside click both
dismiss without scrolling, so the loupe is never trapped. **Named for your
eye**, because it is a cost of the reorder rather than a mistake in it.

### Ruling 3. One header, one contextual line, LYRIC as a row

`CorrectionSurface.svelte:410`. DURATION, PITCH and ACCIDENTAL · ENTRY lose
their labels to one `Corrections` header. They named the ROWS, which a singer
can already tell apart by the shapes in them, and they crowded the one thing
worth naming. **LYRIC keeps its label** because it is the one row that cannot
be told by shape: two lines of prose and four arrows look like prose and
arrows.

**The contextual line** is `:421`, and here is the proposal you asked for,
with its reasoning.

All three state sentences are GAP sentences: takes-the-pitch, take-a-note and
the gap line are each true only while the bar stands between two entries. So
"only one at a time" is a choice among three, and the choice is **the
arrival**, because it is the one fact the singer cannot read anywhere else on
the surface.

- **Where the bar is** is already on the readout below, and reads well there:
  `after C♯3 · the next duration enters here`.
- **Why the lyric row is idle** is on the lyric row's own label, where
  principle 8 wants it, sitting with the thing it explains:
  `Lyric · take a note to shift its syllable`.
- **What a fresh note will be** has nowhere else to go, so the line carries it:
  `Pitch · takes the pitch of C♯3`, or `Pitch · arrives on the middle line`.

Both strings are the ratified ones, unchanged; only where they are drawn moved.
**Its row is reserved**, the Undo pill's rule again, so the surface holds still
as the bar steps in and out of a gap.

**If you would rather the gap sentence took the line**, it is a swap of two
expressions and the readout would then need something else to say in a gap,
which is the part nobody has ruled.

### The drawer's order

`+page.svelte:3185` moved Corrections out of the pinned NOTATION anchor and
into the scroll's music half; `RootPanel.svelte:205` moved Analysis to the top
of the scroll.

**The anchors survive**, which this slice's own constraint requires: metadata
and NOTATION still hold the pinned top, the voice still holds the pinned
bottom. What moved is the scroll's tenant. Corrections sat in the pinned anchor
from your ruling of 2026-08-24, when it was one line of prose idle; it is four
rows of controls now, and a region that never scrolls is the wrong home for the
tallest tenant in the drawer.

**Analysis is the transcription's own console**, so it belongs with the text
tools, and it now rides directly under the pinned NOTATION where the scroll
begins. That inverts your ruling of 2026-08-20 by its own logic: the
performance still sits together at the bottom, and Analysis is no longer part
of it.

Measured order, read off the rendered drawer: **Metadata, Notation, Analysis,
Repertoire, Source, Corrections, Lyric.**

### The strings table

| key | English | French | coined or adopted |
|---|---|---|---|
| `loupe.station.corrections` | Corrections | Corrections | **adopted, and it is the same word in both.** `correct.count` already says "You have corrected %s notes" / « Vous avez corrigé %s notes », and `notation.orphans` says « corrections » outright |

**Two keys are now drawn nowhere**: `loupe.station.pitch` and
`loupe.station.accidental`, whose labels this ruling consolidated.
`loupe.station.duration` survives inside the Nolet row's own label
(`DURATION · TUPLET`). **I left the two in the file rather than deleting them**,
because they are ratified strings and a ruling that brings a label back should
not have to re-ratify its words. Say the word and they go.

### What I looked at

**Desktop, 1400 by 900:**

| check | got |
|---|---|
| the header | `Corrections` |
| station labels left | `["Lyric"]` |
| the drawer's order | `Metadata, Notation, Analysis, Repertoire, Source, Corrections, Lyric` |
| the contextual line on an entry | empty |
| the contextual line in a gap | `Pitch · takes the pitch of C♯3` |
| the readout in a gap | `after C♯3 · the next duration enters here` |
| the LYRIC label in a gap | `Lyric · take a note to shift its syllable` |
| the bar and the mark | `rgb(142, 126, 155)` and `rgb(139, 154, 125)` |
| a click on the page outside the loupe | retires it |
| the chevron with the loupe down | **absent**, its space reserved |
| the chevron with the loupe up | dismisses |

**Phone, 430 by 932 and 932 by 430:**

| check | got |
|---|---|
| the header | `Corrections` |
| the 44 px floor | zero breaches |
| portrait dock height | **438**, down from 477: the consolidation gave back 39 px |
| a stray tap outside the loupe | **stays dead**, the ruled disparity |
| landscape dock | 380 by 430, `scrollHeight` equal to `clientHeight` |

### Gates, re-run

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `872 passed (872)` | `872 passed (872)` |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

**All five at the baseline the ship script holds, and gate 4 did not move.** No
test was added: these are labels, colours, a guard, and two block moves, and
the pure logic underneath is untouched. `~/Downloads/ilya-ship.sh` needs no
edit.

### Not established, new with this round

- **Whether the surface below the fold is acceptable on a short desk.** At
  900 px it needs a scroll to reach; at a taller window it does not. Escape and
  the outside click both dismiss without scrolling.
- **Whether the contextual line chose the right one of the three.** §10 argues
  it; the other two are one expression away.
- **Whether the two consolidated keys should be deleted or kept.**

---

## 11. Appended: the desktop walk of `9c49fb8`

**Four built, two measured and STOPPED, one proposed and not built.** One new
string pair, coining nothing. **Gate 4 holds at 872.**

### 1. The divider above ANALYSIS. Built, and the cause was mine

`RootPanel.svelte:911`. The exemption that keeps the first station in the
scroll from drawing a rule was hard-coded onto `.song-section`, because
Repertoire was first when it was written. **The comment beside it said, in as
many words, that the exemption follows the POSITION and must move if the order
changes again.** Slice 4's reorder moved Analysis to the top and left the
exemption behind, so the anchor's own down-facing rule and Analysis's top rule
landed on the same y and painted as one 4px line, and the
Analysis-to-Repertoire boundary went blank.

**I read that warning while writing the reorder and did not act on it.**

The rule is positional now: `.section + .section` draws the rule, so it appears
only BETWEEN two stations and never above the first. That is the recipe in CSS
rather than in prose, and a reorder cannot leave it behind. Measured after:
Analysis `0px`, Repertoire `2px`, Source `2px`, anchor `2px`. One rule per
boundary, and the boundary that had gone blank is back.

### 2. The loupe never exceeds the page. Built

`Loupe.svelte`. The width was the room the viewport left; it is the lesser of
that room and **the sheet's own measured width**. Measured on the sheet rather
than computed from `PAGE_SIZES`, because on a phone the sheet is already scaled
by PageFit and the loupe is a crop of what is on screen.

| | loupe | sheet | viewport |
|---|---|---|---|
| desktop, drawer open | 816 | 816 | 1400 |
| desktop, drawer closed | **816** | 816 | 1400 |
| phone, portrait | 382 | 382 | 430 |

### 3. The augmentation dot, in engraving proportion. Built, and look at it

`CorrectionSurface.svelte`. The dot had its own set and its own target height,
10 px against the notes' 26, which is about four times its engraving
proportion. **It joins the notes' own common box now**, so one box means one
scale and the dot is drawn at the size it has beside a notehead.

Measured ink widths in the rendered cells: sixteenth **14.92 px**, whole
**10.56 px**, dot **2.63 px**.

**That is the ruled proportion and it is small.** A 2.63 px dot in a 44 px cell
is correct engraving and a modest target for an eye. It is what "engraving
proportion through the same ink measurement" produces, so it is what I built,
and I am flagging the number rather than quietly splitting the difference.
**If it reads as too small on glass, the honest fix is a ruling that the
control surface may draw this one glyph larger than the page does, not a
number I choose.**

### 4. The dot cycles dot, double dot, none. Built

`+page.svelte`, `handleDotCell`. Cumulative like the accidentals, on both
surfaces, and in a gap it arms the same three states. Walked on the desktop:
`C♯3 · Quarter` → `· Dot` → `· Double dot`, the pill reading `dot added` then
`double dot added`; and on the phone the same, ending `↰ Undo: double dot
added`.

**The readout names the state**, which is what makes a cumulative cell honest:
one dot and two dots are different durations and the sentence has to say which.

### The strings, for your eye

| key | English | French | coined or adopted |
|---|---|---|---|
| `loupe.undo.dotDouble` | double dot added | double point ajouté | **adopted.** « double » from `correct.len16th` (« Double croche »), « point » from `correct.dot` |
| `loupe.doubleDot` | Double dot | Double point | same two words |

### 5. The courtesy natural. MEASURED, and I have STOPPED

You asked me to measure the automatic rule first so the manual verb could never
contradict it. **It contradicts it, so I built nothing.**

**What fires today** is `staff-renderer.ts:963`. The renderer keeps a
per-measure accidental state, reset at each barline (`:922`), and draws an
accidental **if and only if `pitch.alter !== inEffect`**, where `inEffect` is
the measure's carried alter or the key signature's. It then records the new
alter (`:976`).

**So what the slice 2 walk saw was not a courtesy natural.** Correcting a G4 to
G♯4 put `1` in force for G4 in that measure; the later G4 then differed from
what was in force, so a natural was drawn. **That is the REQUIRED cancellation,
not a courtesy**, and it is drawn unparenthesized because it is mandatory.

**The three conflicts, each measured:**

1. **A courtesy accidental is by definition one that is NOT required**, and
   this rule draws an accidental exactly when it IS required. There is no state
   in which the renderer would draw a courtesy, so a manual "courtesy natural"
   would have to change the rule, not ride it.
2. **The third state, "none", would suppress a REQUIRED accidental.** After a
   sharp earlier in the bar, a G with no natural sounds sharp. "None" is
   therefore not a display choice; it is an engraving error the singer could
   reach in two taps.
3. **There are no parenthesis glyphs.** `SMUFL_CODEPOINTS`
   (`smufl-metadata.ts:71-109`) carries none, so a parenthesized accidental
   cannot be drawn from the loaded face without adding codepoints, and the diff
   has no field for "draw this in parentheses" — `NoteCorrection` carries
   pitch, not display.

**There is a fourth thing worth saying.** The flat, natural and sharp cells
change the PITCH, cumulatively to doubles. A courtesy accidental changes no
pitch at all. Cycling one cell through a pitch change and two display states
would put two different kinds of thing on one control, which is the one thing
this surface has been careful never to do.

**What a ruling would need to settle**: whether the renderer gains a courtesy
rule of its own (Gould's cautionary conditions), whether the diff gains a
display field, and whether the parenthesis codepoints are added to the package.
I have measured all three and built none of them.

### 6. The tie. MEASURED and PROPOSED, not built

**What draws it today**: `staff-renderer.ts:1200-1209`. One quadratic Bézier,
`fill="none"`, `stroke="#1a1612"`, `stroke-width="1.1"`, constant end to end.
Depth is `lineGap × 0.9` with a nudge to clear a staff line (`:1205-1208`);
endpoints sit at the two noteheads' edges plus 1 (`:1199-1200`); direction is
chosen by the syllabic slur, then by timbre, then by staff position
(`:1191-1196`). **You are right about the fault: there is no taper, because a
stroked path cannot have one.**

**Option B does not exist.** Composing Maestro's own tie segments was the
alternative, and the face carries none: searching all 2,728 glyph names in
`FinaleMaestro.json` for `tie` or `slur` returns `doubleTongueAboveNoSlur`,
`doubleTongueBelowNoSlur`, `textTie`, and the two triple-tongue names. `textTie`
is the elision character for lyrics, not a notation tie of variable span. SMuFL
has no composable tie. **So the choice is between the stroked path today and a
filled outline; there is no third.**

**Gould is not held on this, and I will not pretend she is.** The extracted
priors memo says so twice, at its own line 3 and line 229: ties and slurs are
**rules 150 to 175** of `gould-vocal-engraving-rules_v7_2026-08-05.md` and were
**excluded from the extraction**, "not because it is unquantified". The source
document is not in this repository and is not on this machine, so **the centre
thickness, the terminal taper, and the endpoint offsets are NOT ESTABLISHED in
anything the project holds.** Quoting a number here would be inventing Gould.

**The proposal**, therefore, is a shape with one named unknown:

> Two curves and a close: out along the outer edge from terminal to terminal,
> back along the inner edge with its control point pulled toward the chord by
> the centre thickness, filled rather than stroked. The endpoints stay exactly
> where they are today, so the join to the noteheads and the stem-direction
> logic are untouched. The one number to rule is the centre thickness.

**The rendered comparison is attached**, at true size and at eight times, with
the current tie beside three candidate thicknesses of 0.29, 0.40 and 0.51 stave
spaces. The difference is what you described: today's is a ribbon of one width;
the filled shapes come to points at both terminals and swell at the middle.

**What each costs.** The filled outline is a change to one `parts.push` in
`staff-renderer.ts`, inside the package: about a dozen lines, no new geometry
elsewhere, and it reaches gate 5. I measured that exposure: the renderer's
tests use `includes` and regular expressions rather than byte-exact snapshots,
and none of them asserts the tie's `d` attribute or its stroke, so **the change
would not move gate 5's count and would not break an existing assertion.** The
work that is NOT small is choosing the numbers, and that is the part the source
would answer if it were here.

### 7. The clone filter. MEASURED, and I have STOPPED

**Two of the three analysis layers have a clean handle. The third does not.**

| overlay | drawn at | handle |
|---|---|---|
| turning-pitch noteheads and their accidentals | `:1027`, `:1031`, `:1050`, `:1052` | `fill="#8B9A7D"` (`TURNING_COLOUR`, `:293`) |
| crossing squircle | `:1123` | `stroke="#b23b3b"` |
| phonation break `[#]` | `:1311` | **none** — drawn in `fill="#1a1612"`, the notation ink |

**The two colours are not a heuristic I invented**: the package's own tests
already identify that layer by exactly those strings, at
`staff-renderer.test.ts:235, 240, 244, 278, 281, 357, 375, 393, 394`. A palette
change would break the gate loudly rather than mis-fire the loupe quietly. An
inventory of every literal ink in the renderer confirms both are unique to the
analysis layer: the notation itself uses only `#1a1612` and `#3a352f`.

**The phonation break has no equal handle.** It is a `<text>` reading `[#]` in
full notation ink on the IPA line, chosen deliberately "for attention". It can
be matched only by its exact text content, which is a weaker thing than a
colour and is pinned by no test.

**So I stopped, as ruled.** Filtering the two and leaving the third is exactly
the half-suppression the ruling forbids: the loupe would hide the sage
noteheads and still show an analysis mark.

**The clean structural alternative, measured**: a `data-analysis` attribute on
all three in `staff-renderer.ts`, which the loupe could then filter by one
selector. It reaches gate 5, and I measured that exposure the same way as the
tie: no byte-exact snapshot exists, and adding an attribute leaves every
existing assertion true, **so gate 5 would neither move nor break.** That is
your ruling to make, because it puts a display concern of the loupe's into the
package.

**One thing that softens the urgency**: with no voice calibrated the engine
omits every event, so `analyzed.events` is empty and none of the three overlays
draws at all. On the walk documents the loupe shows no analysis marks today
because there are none to show.

### Gates

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `872 passed (872)` | `872 passed (872)` |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

**All five at the baseline the ship script holds, and gate 4 did not move.** No
test was added: the four built items are a CSS selector, a width cap, a glyph
set membership, and a modulo, and the pure logic underneath is untouched.

### One consequence of the outside-click ruling, noticed while walking

**Changing measures on a desk now takes two clicks**: one on the page retires
the loupe, and a second raises it on the new measure. That follows from the
ruling as written and my walk hit it as a surprise, so it is worth your eye.
The phone is unaffected, where a page tap moves the loupe directly because a
stray tap stays dead.

---

## 12. Appended: the four rulings on §11's open items

**Two built, two closed by ruling. No new strings. GATE 5 MOVES**, disclosed
below; gate 4 holds at 872.

### 1. The courtesy accidental is withdrawn and numbered N.102

Nothing built, and the natural cell is exactly as it was. My §11 measurement
stands as the reason: `staff-renderer.ts:963` draws an accidental if and only
if it is required, so courtesy accidentals do not exist in Ilya today and what
the slice 2 walk read as one was the mandatory cancellation. They get their own
control, their own French, and their own parenthesis-glyph question under
N.102, never a cycle on a cell that changes pitch.

### 2. The tie is a filled taper at 0.40. Built

`staff-renderer.ts:1268` draws it; `:311` holds the constant.

Out along the outer edge and back along the inner, sharing both terminals, so
the shape meets at points and swells at the middle. **Everything that decided
where the tie goes is untouched**: the terminals are still the two noteheads'
own edges, the height is still `lineGap × 0.9` with the staff-line nudge, and
the direction is still the syllabic slur, then timbre, then staff position.

**The constant records whose eye it is.** `TIE_CENTRE_SP = 0.4`, with the
provenance in the comment: **Dann's eye, 2026-08-27, from the rendered
comparison, and NOT Gould.** Her rules 150 to 175 are excluded from the priors
memo, which says so at its own lines 3 and 229, and the book is off this
machine. The comment says to check the number against her if that source is
ever photographed, and why the replacement would then be a one-line change.

Walked on a tie the walk had to make, since the engraved song carries none:
`fill="#1a1612"`, **no stroke**, two curves, closed, bowing down, the inner
control inside the outer, **centre thickness 2.2 px**, which is 0.40 × 5.5
exactly.

**One shipped test had to change, and it is worth saying why.**
`staff-renderer.test.ts:208` asserts Gould r174, that the tie bows opposite the
syllabic slur, and it matched the old markup literally, down to
`stroke-width="1.1"`. The RULE it tests is untouched; the SHAPE changed by
ruling. So the pattern follows the markup and the assertion follows the rule,
**and I strengthened it**: it now also asserts the inner control sits between
the terminals and the outer one, which is the taper itself. Gate 5's count did
not move for this.

### 3. Every analysis overlay has a real handle, and the loupe filters on it. Built

`staff-renderer.ts:311-333` adds `analysisMark`, and four marks now carry
`data-analysis`: `turning-notehead`, `turning-accidental`, `crossing`, and
**`phonation-break`**, which is the one §11 stopped on. `Loupe.svelte` removes
`[data-analysis]` from the clone.

**Marking first is what made this clean.** Two of the four could be found by
their ink and the phonation break could not, because it is drawn in full
notation ink on purpose; a colour filter would have suppressed three quarters
of a layer and left the fourth standing with nothing to explain it. **The
colours are untouched**, so every existing assertion about them still holds.

**One filter serves both surfaces**, because both render one component, and it
serves both viewports, because the head and the body are two crops of one
clone.

Walked. The engraved song emits no overlay at all with no voice calibrated, so
the walk planted one mark of each kind into the live page, including one inside
the head crop's own x range:

| | count |
|---|---|
| planted on the page | 4 |
| **inside the loupe** | **0** |
| **inside the head crop** | **0** |
| notes the loupe still draws | 28 |
| ties the loupe still draws | 2 |

The filter took the analysis layer and nothing else.

### 4. The dot stays at 2.63 px

Nothing built. Ruled: context makes it obvious and the surface keeps one rule
for glyph sizing. The question is closed and the measurement stands.

### Gates

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `872 passed (872)` | `872 passed (872)` |
| 5 score-parser | `461 passed \| 5 skipped (466)` | **`462 passed \| 5 skipped (467)`** |

**GATE 5 MOVES, 461 to 462**, and this is the disclosure. The one added test
asserts that all four analysis marks carry their handle, and that nothing the
engraving draws carries one. It exists because the loupe's filter now depends
on those attributes: without it a later edit could drop one silently and the
loupe would start showing a mark nobody meant it to show.

**`~/Downloads/ilya-ship.sh:80` says `461 passed | 5 skipped (466)` and needs to
say `462 passed | 5 skipped (467)`. I have not touched it.** Gate 4's line at
`:79` is unchanged at 872 and needs no edit.

### Not established

- **The tie's centre thickness is a judgement, not a measurement.** 0.40 is
  Dann's eye against three candidates. It is one constant, and the comment says
  where to look if Gould is ever photographed.
- **The analysis filter is verified against planted marks, not real ones.** No
  voice is calibrated on any walk document, so the engine emits no overlay; the
  handles themselves are asserted in the package's own test against a rendered
  SVG that does carry analysis. A calibrated walk would close the loop.
- **The tie's taper is unverified on an UPWARD tie in a real document.** The
  arithmetic is `depth - sign(depth) × thickness`, which is symmetric, and the
  walk's tie bowed down. A score with a high-staff tie would show the other
  direction.

### Housekeeping

A stray `apps/web/undefined/` directory was created by one of my walk scripts
writing a screenshot to an unresolved path. **Removed**, and the tree is clean
of it.

---

## 13. Appended: the loupe centres on the page

**§12 shipped as `fd8bc47`**, "N.92: the tapered tie, the marked analysis
layer, and the walk's repairs", so this section's work is the only dirty code:
`Loupe.svelte`, and this memo.

`Loupe.svelte`. Built, and it took two changes rather than one: the placement,
and the moment it is measured.

### The numbers, before and after

Offset is the loupe's horizontal centre minus the sheet's. Zero is the ruling
satisfied.

| | before | after |
|---|---|---|
| desktop 1400, drawer OPEN | **−8.0** | **0.0** |
| desktop 1400, drawer CLOSED | **−272.2** | **0.0** |
| phone portrait 430 | 0.0 | 0.0 |
| phone landscape 932 | +181.7 | **+183.3** |

### What was wrong, and it was the width cap's shadow

While the loupe filled whatever room it was given, its left edge and the
sheet's nearly agreed and nobody could see the difference. §11's width cap
stopped it filling that room, and it kept the old left edge: `dockInset + 24`,
which is the desk's edge and not the page's. With the drawer closed at 1400 the
sheet starts at 296.2 and the loupe still started at 24, so its centre sat
**272.2 px** left of the page's.

It centres on the sheet's own measured axis now, and is then clamped clear of
the dock or the open drawer, which the older ruling still requires.

### The second change: the page can move under the loupe

**The first fix made the drawer-closed case worse, not better**, and the
measurement is what caught it: the loupe landed **255.8 px to the RIGHT** of
the sheet's centre.

The cause is timing. Closing the drawer widens the desk and slides the sheet
sideways over the drawer's own 180 ms, and `dockInset` changes at the START of
that. So the effect re-ran, measured the sheet where it had been, and centred
the loupe on a rectangle that was already leaving.

A `ResizeObserver` on the page's container answers it: the container's width
really does change when the drawer moves, so the observer fires when the layout
has settled rather than when the intention was formed. **It covers every other
way the page can move too**, a window resize, a rotation, a re-pagination, and
it cannot loop, because it watches the page and the loupe is not inside the
page.

**It does not make the loupe travel.** A ResizeObserver fires on layout change,
and stepping the insertion bar is not one. Checked on both surfaces: twelve
steps carrying the bar from `m. 5` into `m. 6`, and the loupe's box identical
before and after, `[552, 314.4, 816, 277.8]` on the desk and
`[24, 304.4, 382, 165.6]` on the phone.

### The one case that is not zero, and why I did not force it

**Phone landscape is +183.3 px off the page's axis**, and that is two rulings
meeting rather than a defect left standing.

In landscape the dock holds the left 380 px and the page is not fitted, so the
sheet is 816 px wide starting at 64.7 and its centre falls at 472.7 — **under
the dock**. Centring the loupe there would put it behind the surface the singer
is working from, which the older ruling forbids: the loupe never overlaps the
dock or the open drawer.

So the clamp wins and the loupe sits as close to the page's axis as it can, at
404. **I did not force the centring**, because the alternative is a loupe under
the dock, and I did not quietly reinterpret the newer ruling either. Both are
stated here for you to settle. The underlying cause is the one carried since
slice 2: landscape does not miniaturize the page, so the sheet is wider than
the room beside the dock.

### Gates

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `872 passed (872)` | `872 passed (872)` |
| 5 score-parser | `462 passed \| 5 skipped (467)` | `462 passed \| 5 skipped (467)` |

**No gate moved this round.** No test was added: this is a placement expression
and an observer, both inside a Svelte component, and the numbers that matter
are the walk's.

**`~/Downloads/ilya-ship.sh:80` already says `462 passed | 5 skipped (467)`**,
moved with the `fd8bc47` ship that carried §12. I read it rather than edited
it, and nothing in this round asks it to move again.

---

## 14. Appended: the frame is cut to the page's ink

**Ruled by Dann**, from the walk on `00637e3`: the loupe is too loose around
its content, and empty loupe is page the singer cannot see. Tighten the frame
to the held measure's actual ink, top and bottom, with only enough breathing
room for the tallest marks the measure carries. **Constraint:** the frame must
not resize as the singer steps between measures within a page; if that means
sizing to the page's worst case rather than each measure, measure both and
report the numbers before choosing.

### First, a measurement I had to throw away

My first survey said the page's systems carried **138.25 units** of ink inside
a **106-unit** viewBox — ink standing taller than the box containing it, which
cannot be true. The cause is one this session has now hit three times:
**`getBBox()` on an SVG `<text>` returns the font's LAYOUT box, not its ink.**
The underlay's line box is far taller than its glyphs.

Re-measured with canvas `measureText`'s `actualBoundingBox*` — the same
instrument the glyph cells already use (`CorrectionSurface.svelte`) — the
numbers came back coherent, and every number below is from that second pass.
I am recording the false start because the first set looked plausible enough
to have built on.

### The two schemes, measured

| | height, staff units | behaviour |
|---|---|---|
| **A.** each measure, its own ink | 68.15 – 80.89 (median 80.03) | **resizes at nearly every step** |
| **B.** the page's ink band | 82.49 (13.88 above the staff + 68.61 below) | **constant, clips nothing** |
| what the frame took before | 103 crop / 106 window | constant, but reserved not inked |

**A is ruled out by your constraint**, and by a margin that is not marginal:
across this document's seventeen measures the frame would swing by 12.74 units,
nearly 16%, and would change at most steps rather than a few.

**B is what B ought to be.** Note that the page's worst-case measure *height*
(80.89) is **not** a safe constant on its own: measures put their ink at
different heights as well as different depths, so a frame 80.89 tall could
still clip one that sits lower. The union — furthest above the staff, furthest
below it — is 82.49, only 1.6 units more, and contains every measure on the
page. That union is what shipped.

**The band is anchored to `staffTop`**, not to the system's viewBox. `staffTop`
is the one landmark every system shares; a system's viewBox top drifts with
whatever that system's own highest note happened to be, which is exactly the
looseness being removed. Half a staff space of air is added top and bottom —
the band already *contains* every ledger line, stem, tuplet bracket and tie on
the page, so the pad only keeps the tallest of them off the frame's edge.

**What the loupe does not draw does not set its frame.** The survey skips the
hit rectangles, the paper behind the system, the page's own held-measure
rectangle, and the analysis layer — the same four things §12's clone filter
strips. Otherwise a phonation break standing above the staff would push the
frame open for ink the loupe then removes.

### A second source of empty loupe, found while measuring

Landscape showed a **254.4 px window around a 212.4 px drawing** — 42 px of
nothing that the ink band alone would not have fixed. The cause is the width
cap: a measure too wide for the capped loupe is shown *whole* at less than full
magnification (slice 2's "THE HEAD SHARES THE FIT"), so its drawing is shorter,
while the window stayed at full magnification.

The window still cannot follow the held measure — that is your constraint — so
it now follows **the widest drawing the page can produce, which is the narrowest
measure's**, found from the page's barlines in the same survey. It is bounded
above by the full-magnification height it always had, so the estimate is
deliberately understated: running small costs a little air, running large would
clip.

### Before and after, all three surfaces

Held measure stepped across m. 2, m. 3, m. 4 on each.

| surface | loupe box | window | drawing | air inside the window |
|---|---|---|---|---|
| **desk 1400×900** | 277.8 → **238.5** (−14%) | 231.3 → **192.0** (−17%) | 224.7 → **192.0** | 6.6 → **0** |
| **phone portrait 430×932** | 165.6 → **145.4** (−12%) | 119.1 → **98.9** (−17%) | 115.7 → **98.9** | 3.4 → **0** |
| **phone landscape 932×430** | 300.9 → **235.1** (−22%) | 254.4 → **188.6** (−26%) | 212.4 → **181.4** | 42.0 → **7.2** |

The crop itself went from 103 units to **87.99** (82.49 of ink, 5.5 of pad).

**Verified, not assumed.** At every step on all three surfaces the window height
is one number — 192.0, 98.9, 188.6 — so the frame does not breathe. And an ink
sweep of the loupe's own clone, run at each step with the same canvas
measurement, reports **0 units outside the crop**: nothing visible is clipped.
Landscape keeps 7.2–9.5 px because its measures are still width-capped and are
drawn at slightly different scales; that residue is the cap, not the frame.

### Where the reasoning lives

The two decisions are pure and are now in `loupe.ts` — `inkCrop` and
`windowScale` — where they can be tested; `Loupe.svelte` keeps only the
measuring and hands them the survey. The survey is memoized per page against
the systems' viewBoxes, so stepping does not re-measure the score.

**No new user-facing strings this round, so no French table.**

### Gates

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `872 passed (872)` | **`880 passed (880)`** |
| 5 score-parser | `462 passed \| 5 skipped (467)` | `462 passed \| 5 skipped (467)` |

**Gate 4 moved, 872 → 880.** Eight tests on `inkCrop` and `windowScale`. The
one worth naming pins the constraint itself: three measures at three staff
positions on one page must yield **one** crop height. A regression there would
otherwise be silent, visible only to an eye on a walk.

**`~/Downloads/ilya-ship.sh:79` still says `872 passed (872)` for gate 4** and
must move to `880 passed (880)` when this ships. I read it rather than edited
it; **no commits, no ship**.

---

## 15. Appended: the loupe as an appliance resting on the page

**Ruled by Dann**, from the walk on `9fabbf1`: the loupe must read as an
appliance resting above the page, not as part of it. Three changes, all
geometry; everything else already ruled about the loupe unchanged.

### What it was, measured

| surface | page | loupe | side gaps | foot |
|---|---|---|---|---|
| desk 1400×900 | x 292.3, w 816 | x 292.3, w **816** | **0 / 0** | 24 above the viewport's edge |
| phone portrait 430×932 | x 24, w 382 | x 24, w **382** | **0 / 0** | 23.6 above the dock |
| phone landscape 932×430 | x 58.4, w 816 | x 404, w 504 | 345.6 / **−33.7** | none; vertically centred |

Exactly the footer reading: the frame the width of the page, its edges on the
page's edges. Landscape was worse than a footer — the frame **overhung the
page's right edge by 33.7 px**, which had not been caught before.

### The fractions, proposed from measurement

**The side inset is a sixteenth of the page's width, 6.25%.** It is not a
number I picked: MEASURED, the sheet already sits inside the desk by 24 px on a
382-wide page in portrait — **6.28% of its own width** — and by 58.4 px on an
816-wide page in landscape, **7.15%**. A sixteenth is the round number those
two straddle, so the loupe standing inside the page repeats the rhythm the page
already makes against the desk. In portrait this lands the loupe 23.9 px inside
the page, within a tenth of a pixel of the 24 px gutter the page itself keeps.

**The foot is 1.4 × the side inset.** A mathematically equal bottom gap reads
as *smaller* — the mat-cutter's problem — so "slightly larger, optically" has
to be overshot rather than met. I rendered the desk's bottom-left corner at
three weights and looked:

| weight | foot | reads as |
|---|---|---|
| 1.2 | 61 px | **equal to the sides**, which is the failure being corrected |
| **1.4** | **71 px** | **slightly larger — chosen** |
| 1.7 | 87 px | larger enough that the band reads as its own zone, not a lift |

The weight is also the loupe's own: its frame is padded `10px 10px 12px`,
bottom heavier than top, and 1.4 repeats that judgement one level out.

### The stage

Both insets are taken off **the stage** — as much of the page as the singer can
actually see: the sheet, clipped to the room beside the dock and above it.
Where the page fits the room the stage *is* the page, so a fraction of the
stage is a fraction of the page's own width as ruled. On the phone the stage's
floor is the dock's top edge rather than the viewport's, which is your
"within the space above the dock" clause; on the desk the page runs past the
viewport, so the viewport's floor is where the page stops being visible.

The vertical anchor is now **one anchor on all three surfaces** — the loupe's
own bottom edge, lifted off the stage's floor. Portrait's dock anchor and
landscape's viewport centring are both gone. Pinning the bottom is what states
"lifted off that edge by this much" directly, and it puts the frame as low as
the foot allows, which is the lower third wherever the stage has one.

### What it is now

| surface | loupe box | side gaps | foot | centre in the page's lower third |
|---|---|---|---|---|
| **desk 1400×900** | 343.3, 590.1, **714 × 238.5** | **51 / 51** | **71.4** | **yes** (lower third opens at y 640.6, centre 709.4) |
| **phone portrait 430×932** | 47.9, 315.2, **334.3 × 145.4** | **23.9 / 23.9** | **33.0** | **yes** (opens at 369.1, centre 387.9) |
| **phone landscape 932×430** | 404, 174.4, **441 × 211.5** | 345.6 / **29.4** | **44.1** | **no — see below** |

Verified across m. 2, m. 3 and m. 4 on each: the box does not move as the
singer steps.

### Two things to report rather than bury

**1. Landscape cannot reach its lower third.** The visible page is 391.2 px
tall there and the loupe is 211.5 — **54% of it**. With the foot honoured, the
frame's centre lands at 280.2 where the lower third opens at 299.6, missing it
by 19.4 px. Lifting it lower would put its top through the page's top edge. The
foot and the insets are honoured; the third is not, because there is no third
to sit in. **I did not quietly redefine the third to make it fit.**

**2. Landscape's left inset is still the dock's, not the page's.** 345.6 px on
the left against 29.4 on the right. This is the disparity carried since slice 2
and named in §13: landscape does not miniaturize the page, so the sheet is
wider than the room beside the dock and the loupe is clamped clear of the dock
rather than centred on the page. **It did improve**: the frame no longer
overhangs the page's right edge, going from −33.7 px outside to 29.4 px inside.

### What the shadow needs to sell the lift

**Not built — you scoped this round to geometry, so this is a proposal.**

The geometry change is the precondition. Before it there was nowhere for a
shadow to fall: with the frame flush to the page's width, its side shadows were
cut at the page's edge and read as the page's own edge treatment. There are now
51 px of paper on each side and 71 px below for a shadow to land on.

Today's shadow is two layers, `0 4px 10px rgba(46,42,38,.17)` and
`0 10px 26px rgba(46,42,38,.09)`, and one of them is doing two jobs. Three
things would sell the lift:

1. **Split the contact shadow from the mid shadow.** A 1–2 px contact line
   anchors the object to the surface; a lift is read from the *gap* between
   that line and the diffuse mass, and at `0 4px` there is no gap.
2. **Drop and spread the ambient layer further** — around `0 20px 44px`.
   Perceived height comes from how far the shadow's centre falls below the
   object, and 10 px reads as a card lying on the page.
3. **Lower the opacity as the blur rises.** On cream paper a warm black past
   roughly 8% at that blur stops reading as shadow and starts reading as dirt.

Concretely, `0 1px 2px rgba(46,42,38,.20)`, `0 8px 16px rgba(46,42,38,.13)`,
`0 20px 44px rgba(46,42,38,.07)`. Say the word and it is a one-line change.

**No new user-facing strings this round, so no French table.**

### Gates

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `880 passed (880)` | **`887 passed (887)`** |
| 5 score-parser | `462 passed \| 5 skipped (467)` | `462 passed \| 5 skipped (467)` |

**Gate 4 moved, 880 → 887.** Seven tests on `pageInset` and `restingFoot`. One
of them caught me rather than the code: I asserted a clamped foot of −14 px,
and the function was right to floor it at 0.

**`~/Downloads/ilya-ship.sh:79` still says `872 passed (872)` for gate 4** and
must move to `887 passed (887)` when this ships — §14's `880` never shipped
either, so one edit carries both. I read it rather than edited it;
**no commits, no ship.**

---

## 16. Appended: the shadow, built

**Ruled by Dann**: build §15's shadow proposal into this same ship, at the
values proposed. Done, exactly as specified:

```css
box-shadow:
    0 1px 2px rgba(46, 42, 38, 0.2),
    0 8px 16px rgba(46, 42, 38, 0.13),
    0 20px 44px rgba(46, 42, 38, 0.07);
```

replacing `0 4px 10px rgba(46,42,38,.17)` and `0 10px 26px rgba(46,42,38,.09)`.

### Does the lift read? Looked at, on all three

Full views and a 3× crop of the frame's bottom-left corner on each, where the
contact line, the gap and the ambient mass are all in one frame.

| surface | does the lift read | what carries it |
|---|---|---|
| **desk 1400×900** | **yes** | the diffuse mass falls about 40 px down and left across 51 px of bare paper before it dies; the frame reads as held above the sheet rather than printed on it |
| **phone portrait 430×932** | **yes**, a little quieter | the same mass across a 23.9 px side gap — less paper for it to fall on, so less of it is visible, but the graduation is unmistakable |
| **phone landscape 932×430** | **yes, most strongly of the three** | here the shadow falls across the *underlay text* of the system below, and you can see the Cyrillic dimmed underneath it. Text darkened by a shadow is the least ambiguous depth cue on the page |

Nowhere does the ambient layer read as dirt: at 7% over 44 px of blur it stays
a graduation on cream rather than a stain.

### A prediction of mine that measurement overturned

Looking at the corners, I thought the `0 1px 2px` contact layer was being
**masked by the 1.4 px `stone-700` border** — that the border was already doing
the anchoring and the contact layer was buying nothing. Rather than write that
down as an impression, I rendered the frame with the contact layer removed and
compared the two images pixel by pixel.

**I was wrong.** At the row where the frame's bottom border sits, the contact
layer darkens the paper by **24.4 levels out of 255** — 173.9 against 198.3,
about a tenth of the available range. It is a real, visible line. What fooled
me is that it is confined to two or three rows: averaged over the whole crop
the difference between the two renders is **0.41 levels**, which is why they
read as identical at a glance.

So the mechanism is the one §15 proposed. The contact line anchors the frame to
the sheet, the mass sits well below it, and the gap between them is what the
eye reads as height.

**No new user-facing strings this round, so no French table.**

### Gates

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `887 passed (887)` | `887 passed (887)` |
| 5 score-parser | `462 passed \| 5 skipped (467)` | `462 passed \| 5 skipped (467)` |

**No gate moved.** This round is three CSS values; the numbers that judge it are
the walk's and the pixel comparison's, not a test's.

**`~/Downloads/ilya-ship.sh:79` now reads `887 passed (887)`**, moved by Dann,
and agrees with gate 4 as run. Nothing in this round asks it to move again. I
read it rather than edited it; **no commits, no ship.**

---

## 17. Appended: centred, not in the lower third

**Ruled by Dann**, correcting §15: the loupe is **centred vertically on the
page**, not placed in its lower third. The lower third was **this desk's own
narrowing of his words and was never his ruling**, and the result sat below the
eyeline. The side insets stay; the foot becomes whatever centring leaves rather
than a ruled gap.

That is my error to own. §15's brief said "lift it clear of the page's bottom
edge" and "place it in the page's lower third"; I took the second phrase as a
specification and built a `FOOT_WEIGHT` constant to serve it, then reported at
length on landscape's failure to reach a third that was never ruled in the
first place. The constant is gone.

### What changed

`restingFoot` is replaced by `centreOnPage`, which returns the y the frame's
CENTRE sits on rather than the distance its bottom edge is lifted. Everything
else already ruled holds: fixed and never travelling, horizontally centred,
capped at page width, cut to its ink, inset a sixteenth on both sides, and the
shadow as built in §16.

### A first attempt that measured wrong, and why

Computing a bottom edge from the stage and the frame's height put the frame
**6.5 px off true centre** on both phone orientations — MEASURED, 111.0 px of
air above against 117.1 below in portrait. The cause was the frame's height:
the code carried `windowHeight + 40` from an older pass, where the chrome
actually measures **46.5** (the tag's row, 10 px of padding over 12, two 1.4 px
borders). A height 6.5 short lifts the frame by half that and splits the
difference into the two gaps, which is exactly the 6.1–6.5 px seen.

Rather than correct the constant and keep depending on it, the frame now hangs
off its own centre with `translateY(-50%)` and **CSS does the centring**. It is
exact whatever the chrome measures, and a later change to the tag's type cannot
put it off centre again. `CHROME = 46.5` survives only for the clamps, which
decide the degenerate case and would have to be wrong by tens of pixels to
decide it differently. The rise animation carries the same `-50%`, or the frame
would drop half its height as the animation ended.

### The resulting boxes

| surface | loupe box | side gaps | air above | air below | centred |
|---|---|---|---|---|---|
| **desk 1400×900** | 343.3, 391.6, **714 × 238.5** | 51 / 51 | **269.9** | **269.9** | **yes** |
| **phone portrait 430×932** | 47.9, 234.4, **334.3 × 145.4** | 23.9 / 23.9 | **114.2** | **113.8** | **yes** |
| **phone landscape 932×430** | 404, 128.6, **441 × 211.5** | 345.7 / 29.3 | **89.9** | **89.9** | **yes** |

Portrait's 0.4 px is subpixel rounding on a 2× device, not a lean.

**The clamps do not bite on any of the three.** Centring is possible everywhere,
including landscape, where §15 had to report that the lower third was
unreachable — the frame stands 211.5 tall in 391.2 of visible page, which is
too tall for a third and comfortably short enough for a centre. Correcting the
ruling dissolved that whole problem rather than solving it.

Walked at m. 2, m. 3 and m. 4 on each: the box does not move as the singer
steps. Looked at on all three; the shadow of §16 still sells the lift, and on
the desk the loupe now sits at the eyeline with page above it and below it.

### One thing worth naming about the probe

The desk run reported zero rendered measures twice in a batch of three and
rendered correctly when run alone. It is the probe's own first-context upload
timing, not the app: the same build renders 96 hit rectangles on the desk on
every standalone run. I am recording it rather than quietly re-running until it
looked clean.

**No new user-facing strings this round, so no French table.**

### Gates

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `887 passed (887)` | **`889 passed (889)`** |
| 5 score-parser | `462 passed \| 5 skipped (467)` | `462 passed \| 5 skipped (467)` |

**Gate 4 moved, 887 → 889.** The `restingFoot` tests are gone with the function
and six on `centreOnPage` replace them, net two. One of them asserts the thing
that was got wrong: that the frame's centre is **not** in the page's lower
third.

**`~/Downloads/ilya-ship.sh:79` now says `887 passed (887)`**, moved by Dann
after §16, and must move again to `889 passed (889)` when this ships. I read it
rather than edited it; **no commits, no ship.**

---

## 18. Appended: the tap band, bounded

**DEFECT**, from Dann's walk on `893ccb4`: the page's measure tap band is
unbounded vertically, so a click an inch below the staff still raises the
loupe. **Ruled**: a tap must land on or near the staff to count, bounded in
STAVE-SPACES rather than pixels so it holds at every zoom.

### The cause, named

`+page.svelte:1315` handed every hit rectangle on the sheet to `nearestTarget`,
which takes the nearest centre **with no limit on how far away that centre is**
(`loupe.ts`). So the sheet was carved into Voronoi cells: every point on the
page belonged to some measure, and a tap in the title, in the margins, or below
the last system was simply nearer to one staff than to any other.

Its signature in the measurement is unmistakable. Scanning downward from a
staff, **there was no offset at which a tap did nothing** — on any of the three
surfaces. One band ended only where the next began.

### The two figures, proposed from measurement

**Fine pointers: 2.5 spaces beyond the staff.** Two ledger lines, plus the
half-space a notehead sitting on the second of them occupies. It is also this
document's own number: MEASURED for §14, the highest ink on the page stands
13.88 units above the staff's top line against a 5.5-unit space, which is
**2.52 spaces**. The band covers every note the engraving actually draws.

**Coarse pointers: 7 spaces beyond the staff**, and this number is the thumb's,
not the music's. MEASURED on the portrait thumbnail, **one stave-space is
2.57 px** and the renderer's own hit rectangle is **28.3 px tall — well under
the 44 px floor this project holds for touch.** Clearing 44 needs 17.1 spaces
of total band, so seven beyond the staff gives 18 spaces and 46.3 px.

That is the finding worth flagging: **the drawn rectangle is not a thumb-sized
target on the thumbnail, so the coarse band has to exceed what the renderer
draws.** Geometry answers modality (principle 7) — the same staff, read twice.

The pointer is read per tap from `(pointer: coarse)` rather than stored, so a
trackpad plugged into a tablet is answered as it is used.

### Before and after, measured on all three

Scanning down in 2 px steps from a staff's centre, recording which measure
answers:

| surface | space | **before** | **after** | thumb floor |
|---|---|---|---|---|
| **desk 1400×900** (fine) | 5.50 px | band ran to 56 px, **never silent** | **±24 px**, 2.36 spaces beyond the staff | 48 px total — clears 44 |
| **phone portrait 430×932** (coarse) | 2.57 px | band ran to 26 px, **never silent** | **±22 px**, 6.54 spaces beyond | **44 px total — clears 44 exactly** |
| **phone landscape 932×430** (coarse) | 5.50 px | band ran to 56 px, **never silent** | **±50 px**, 7.09 spaces beyond | 100 px total — clears 44 |

The scan's 2 px step rounds each figure down from the ruled 2.5 and 7.

**A thumb-sized target still lands.** Portrait's band is 44.0 px, at the floor
rather than over it, which is the tightest of the three and the one that
mattered.

### What happens to a tap outside the band

**Nothing at all** — no loupe, no cursor moved, and nothing already up is
dismissed. It keeps the same silence a stray tap beside the loupe already
keeps, and for the same reason: no Undo restores a lost place.

Tested at the points that made the report:

| tap | before | after |
|---|---|---|
| an inch below the last staff (portrait) | **raises m. 17** | **nothing** |
| in the title block above the first staff | **raises m. 2** | **nothing** |
| in the left margin, level with a staff | raises m. 2 | **raises m. 2**, unchanged |
| on the staff itself | raises m. 3 | raises m. 3 |

The margin case is deliberate: **only the vertical is bounded.** A tap to the
side of a system, level with its staff, still takes the nearest measure in it,
because the ruling is about height and because a measure's own width is where
the horizontal answer already lives.

Between systems there is now a genuine dead zone: **62 px of it on the desk**
(the band ends at 26 px, the next system takes over at 90 px). On the portrait
thumbnail it is only 4 px, because the systems are pitched 49 px apart and a
44 px band very nearly fills that. **Said plainly rather than buried**: on a
phone in portrait, a tap between two systems still picks whichever staff is
nearer rather than nothing. That is the price of the thumb floor at that zoom,
and the reported defect — taps far from any staff — is fixed regardless.

The loupe's own tap targets are left unbounded on purpose. They live inside a
window that is cropped and `overflow: hidden`, so the window is already the
bound and a second one would only be somewhere for the two to drift apart.

**No new user-facing strings this round, so no French table.**

### Gates

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `889 passed (889)` | **`900 passed (900)`** |
| 5 score-parser | `462 passed \| 5 skipped (467)` | `462 passed \| 5 skipped (467)` |

**Gate 4 moved, 889 → 900.** Eleven tests on `tapBand` and on the bounded
`nearestTarget`. Two of them pin the defect directly: a target an inch above a
tap answers **null**, and the coarse band clears 44 px on the thumbnail where
the drawn rectangle does not.

**`~/Downloads/ilya-ship.sh:79` now says `889 passed (889)`**, moved by Dann
after §17, and must move again to `900 passed (900)` when this ships. I read it
rather than edited it; **no commits, no ship.**

---

## 19. Appended: the Corrections stations turn lavender

**Ruled by Dann**, from the walk on `6846d5f`: the Corrections header and the
divider above it are LAVENDER, not sage, and the Lyric label inside it likewise.
Lavender codes music and voice and these are the music stations; this also
completes the drawer's ruled gradient — sage text stations at the top, lavender
music stations at the foot.

The token is `--deeper-lavender` (`#8E7E9B`). VERIFIED it is the one already in
use: the voice anchor at the drawer's foot renders `rgb(142, 126, 155)`, and so
does the loupe's insertion bar (`Loupe.svelte:664`). `--lavender` is not a
defined token at all; `--light-lavender` is `#C4BACF`, too pale for text.

### What changed, and the one thing that had to follow

Three by ruling — `.surface.panel`'s 2 px rule, `.surface-header`, and
`.station-label` — and one by consequence:

**The Nolet row's back chevron.** It lives *inside* a `.station-label`, and a
button does not inherit colour from its parent, so its sage was pinned rather
than cascaded. Left alone it would have been the one thing not to follow the
label above it, splitting a single header line across two hues. This is what
the check for inheritance turned up.

`.station-count`, N.65's placed-syllable counter, sets no colour of its own and
sits inside the Lyric label, so it inherits lavender — which is right, the
counter belongs to the label.

### The gradient, measured top to bottom in the drawer

| station rule | before | after |
|---|---|---|
| Notation | sage | sage |
| Repertoire | sage | sage |
| Source | sage | sage |
| **Corrections** | **sage** | **LAVENDER** |
| the voice anchor | lavender | lavender |

Corrections' new rule renders `rgb(142, 126, 155)`, the same value the voice
anchor below it has always drawn. The gradient reads as ruled.

### Both surfaces

| surface | header | Lyric label | rule above |
|---|---|---|---|
| desk, drawer panel | **LAVENDER** | **LAVENDER** | **2 px LAVENDER** |
| phone portrait, dock | **LAVENDER** | **LAVENDER** | 1 px stone — see below |
| phone landscape, dock | **LAVENDER** | **LAVENDER** | none |

One component in two containers, so the header and label change on both by
construction. **The divider clause has no counterpart on the phone**: the dock
is a floating shell rather than a tenant of the drawer's scroll, so it has no
station rule above its header — only its own 1 px shell edge in portrait, and
nothing at all in landscape. Nothing was invented to fill that gap.

### What is still sage inside the surface, and not ruled on

Not named in the ruling, so left alone and reported instead:

- **`.cell.engaged`** — the armed duration's border and text, the marker saying
  which duration a fresh entry will take.
- **the focus ring** on every cell, mark and the Undo pill.

Both are state markers on music verbs, so the principle would put them in
lavender too; neither was enumerated, and each is a visible change. **One line
from you settles it either way.** Nothing else in the drawer moved: the only
other sage left is a 1 px input border inside the Source station, which is a
text station and correctly sage.

---

## 20. Appended: the turning pitches turn lavender

**Ruled by Dann** in the same walk: the Score Markup's formant-derived turning
pitches change from sage to lavender. They are voice data, and sage — which
codes the score document and its text — has been miscoding them.

`staff-renderer.ts`'s `TURNING_COLOUR` goes `#8B9A7D` to `#8E7E9B`, the same
token. The original ruling (2026-07-12) was to use the existing colour story
rather than invent an estimate, and sage was the accent to hand; the correction
is that the colour story has since become specific.

### The loupe's filter is unaffected — and this is the handle's whole argument

CONFIRMED. The filter matches `[data-analysis]` (`Loupe.svelte:591`), not ink,
so **the colour moved and the filter needed no edit at all.** §12's ruling to
mark first and filter on the handle rather than on colour is what made a later
ruling on colour free. A filter written against `#8B9A7D` would have broken
here silently.

Pinned by a new test: every `data-analysis="turning-*"` mark must carry both
its handle and the current ink, so the two cannot come apart.

### The contrast, measured rather than asserted

The page in the harness has no formant analysis — the voice is not calibrated,
so there are no turning marks on it to sample. I measured the renderer's own
geometry instead: the ellipse copied verbatim from `staff-renderer.ts:1098`
(`rx="6" ry="4.4" opacity="0.85" rotate(-18)`), on the paper the renderer
actually paints (`#F0EBE0`, read off the system's own background rect),
rasterised at the portrait thumbnail's MEASURED scale of 0.4681 px per unit —
one stave-space of 2.5748 px.

| | sage `#8B9A7D` | lavender `#8E7E9B` |
|---|---|---|
| nominal contrast on `#F0EBE0` | 2.52 : 1 | **3.15 : 1** |
| **rendered at the thumbnail's scale** | **2.15 : 1** | **2.58 : 1** |
| inked pixels | 27 | 27 |
| darkest pixel | rgb(154, 166, 140) | rgb(157, 142, 166) |

**The marks are more legible than they were, by 20%**, and the footprint is
identical to the pixel — 27 either way — so nothing about the mark's size or
shape changed.

**Said plainly rather than left implied: 2.58 : 1 does not clear WCAG's 3:1 for
non-text contrast.** At that scale the ellipse is about 2.8 × 2.1 px, so
antialiasing blends most of it toward the paper and the darkest pixel never
reaches the colour itself — which is why the rendered figure sits below the
nominal one. Lavender clears 3:1 nominally where sage did not. These are
analytical overlays on a thumbnail rather than text or a control, and the
singer reads them at full size or in the loupe; the change improves the number
and does not fix it.

### Print — a conflict to report rather than assert away

The ruling says colour on paper stays parked behind N.83, so print is
unchanged. **I changed no print rule.** But I could not confirm the second half
and think it is not true as stated:

- **No print rule references the analysis layer.** Grepped: nothing in any
  `@media print` block matches `data-analysis`, and nothing hides it by class.
- **In print media the sheet itself still renders** — measured with the print
  medium emulated.
- The turning marks are emitted whenever the rendered score carries analysis
  (`staff-renderer.ts:1057`), into the same SVG the sheet prints.

So an analysed score, printed, will carry these marks in the new colour. I
could not demonstrate it end to end, because turning pitches need a calibrated
voice and the harness has no microphone; the two findings above are a grep and
a print-media probe, and I am labelling them as such rather than dressing them
as a printed page. **If "print is unchanged" was a constraint on the outcome
rather than on the code, this change reaches paper and one constant reverses
it.**

**No new user-facing strings in either round, so no French table.**

### Gates

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `900 passed (900)` | `900 passed (900)` |
| 5 score-parser | `462 passed \| 5 skipped (467)` | **`464 passed \| 5 skipped (469)`** |

**Gate 5 moved, 462 → 464.** Two tests: the turning layer draws lavender and no
sage survives in it, and every turning mark carries its handle alongside its
ink. Gate 4 did not move — §19 is four CSS declarations, judged by the measured
computed styles above.

**`~/Downloads/ilya-ship.sh` now reads `900 passed (900)` at line 79**, moved by
Dann, and agrees with gate 4 as run. **Line 80 says `462 passed | 5 skipped
(467)` and must move to `464 passed | 5 skipped (469)`** when this ships. I read
it rather than edited it; **no commits, no ship.**

---

## 21. Appended: the last two sage marks

**Ruled by Dann**, closing §19's open question: the armed duration's marker
(`.cell.engaged`) and the focus ring inside the Corrections surface both go
lavender. They are state markers on music verbs and were the last sage marks
left inside a lavender section.

Both take `--deeper-lavender`, the token §19 and §20 already carry. **There is
now no `var(--sage)` anywhere in `CorrectionSurface.svelte`** — grepped, none
left, on either variant.

### A measurement I had to throw away first

I focused a cell with `.focus()` and read its computed outline. It reported
**`outline-width: 0px`** and a colour of `rgb(142, 126, 155)` — which looked
like the right answer and was not one. **`:focus-visible` does not match a
scripted focus in Chromium**, so no ring rule applied at all, and the colour I
read was `currentColor` leaking through `outline-color`'s default. Had the rule
still said sage, that probe would have reported lavender just the same.

Re-done with a real keyboard arrival — tabbing until `activeElement` is a cell
that matches `:focus-visible` — the ring is verified on all three:

| surface | element found | ring | `:focus-visible` |
|---|---|---|---|
| desk | `surface panel` | 2 px, 2 px offset, `rgb(142, 126, 155)` | **true** |
| phone portrait | `surface dock portrait` | 2 px, 2 px offset, `rgb(142, 126, 155)` | **true** |
| phone landscape | `surface dock tight` | 2 px, 2 px offset, `rgb(142, 126, 155)` | **true** |

### The contrast, measured

**The ring sits OUTSIDE the cell, not on it.** `outline-offset: 2px` puts all
of it on the surface behind, so the contrast that decides whether it can be
seen is against the surface — measured `rgb(250, 248, 245)`, the drawer's own
ground. The cell's fill is `rgb(245, 241, 232)`; both are reported because the
ring reads against the cell's edge as well.

| | sage, before | **lavender, after** | WCAG 3:1 for non-text |
|---|---|---|---|
| ring against the surface it sits on | 2.82 : 1 | **3.53 : 1** | **now clears** — did not before |
| ring against the cell it outlines | 2.66 : 1 | **3.32 : 1** | **now clears** — did not before |
| engaged cell's border and glyph, against its own fill | 2.66 : 1 | **3.32 : 1** | **now clears** — did not before |

**The ring did not merely keep its contrast, it gained about 25% and crossed
the 3:1 line on both grounds, where sage cleared neither.** Lavender is simply
the darker of the two against a warm ground: `#8E7E9B` against `#8B9A7D`.

Looked at on the phone with a cell focused: the ring reads as a ring, its 2 px
gap holding it clear of the cell's own border, and it does not collide with the
engaged cell beside it — the engaged state is a coloured border *and* a coloured
glyph with no gap, the ring is an offset outline with one, so two lavender marks
side by side still say different things.

**No new user-facing strings this round, so no French table.**

### Gates

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `900 passed (900)` | `900 passed (900)` |
| 5 score-parser | `464 passed \| 5 skipped (469)` | `464 passed \| 5 skipped (469)` |

**No gate moved.** This round is three CSS declarations; what judges it is the
computed styles and the contrast figures above.

**`~/Downloads/ilya-ship.sh` agrees with both moved gates as run**: line 79
reads `900 passed (900)` and line 80 now reads `464 passed | 5 skipped (469)`,
moved by Dann for §20's tests. **Nothing in this round asks either to move
again.** I read the file rather than edited it; **no commits, no ship.**
