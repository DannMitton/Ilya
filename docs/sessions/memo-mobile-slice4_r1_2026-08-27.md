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
