# Brief to Design: N.108, the drawer as three finite groups

Written 2026-09-02 by the coordinating desk, from a conversation with Dann the
same afternoon. Numbered N.108 by him. **This is an exploration brief, not a
build brief.** Nothing here is ruled unless marked so; Dann's words are quoted
where the instinct is his, and every departure from an existing ruling is
named as one.

## 0. What Ilya is, in two sentences

Ilya is a rule-based, deterministic tool for singers of Russian art song. It
turns a poem into a phonetic transcription, and a score plus a measured voice
into a marked score. It is not AI and never speaks as an agent. The paper on
the right displays and prints; the drawer on the left is the only thing that
manipulates. That last sentence is principle 2 of the ratified slate and is
not open.

## 1. The instinct, in Dann's words

> "I want to offer contained squircles as the opening state of the drawer
> surface to imply that the controls are finite. To my mind, a set of controls
> that scrolls off the page can feel uneasy to the user since they are not
> sure how many controls exist or what the 'missing' options are. I want to
> solve that by presenting the controls in a state that implies finiteness
> while expanding to obey predictable, progressive disclosure."

> "I want us to adopt the POV of the user, then worry about how to
> reverse-engineer the solutions we come up with afterward."

The principle that came out of the conversation, ruled by Dann: **the opening
state is the map of everything, and it fits without scrolling.** Everything
that exists is visible by name at open; nothing is discovered by scrolling.

## 2. What ships today, and what has been ruled

Today's drawer (read off the deploy 2026-09-02, branch `Shane`): a flat
accordion of Metadata, Notation, Analysis, Repertoire, Source (text box and
score drop together), Corrections, and a voice footer with Calibrate. The
paper carries two documents, Transcription and Score markup, chosen by a pair
of pills above it.

Rulings that govern, all in project knowledge, all read by the desk:

- `claude/fable-ruling-e27-four-tab-consolidation_2026-08-05.md` (Fable,
  2026-08-05): the Packet. Five accordion stations in workflow order (Piece,
  Source, Notation, Voice, Output) plus two takeovers (the inspector, the
  calibration ritual), never entered by a chevron. First run: Piece and
  Source open, the rest closed; a score's first render collapses Source.
  Every closed station header carries a quiet status. Desktop: any number
  open; phone: exactly one.
- `claude/e44-fable-ruling-studio-architecture_2026-08-13.md` (2026-08-13):
  amended E.27; three destinations, the pair chooses the document, tabs die.
- `claude/fable-ruling-gui-principles-and-portrait-c_2026-08-18.md` (ratified
  by Dann 2026-08-18): the eleven principles. Of these, N.108 leans on 6
  (recognition over recall), 10 (progressive disclosure), 11 (siblings behave
  identically), and 8 (colour never carries alone). Operational spec: three
  radii, no fourth; one accent per surface; hue names place, ink names state;
  disclosure levels are pinned anchors, open stations, collapsed expert
  stations, one takeover (calibration); NOTATION opens collapsed; motion is
  one duration, opacity and transform only.
- `claude/fable-ruling-gui-dispositions-and-underlay_2026-08-18.md`: the
  Underlay station (the syllable pairing queue, cursor, slide operations)
  sits between Source and Analysis; English name Underlay, French NOT RULED.
  Drawer pulls: a labelled pull on mobile, a bookmark tab on desktop.

**Tether 17 applies: those rulings are three to four weeks old, and N.108 is
Dann amending them on purpose.** Where this brief departs from one, it says
so in §3.

## 3. The proposed structure, as it stands after the conversation

Three groups, each a squircle, top to bottom. Working names, Dann's to
rename, French owed for all three:

### 3.1 File (open at open state)

The life of a song: choose or create it (Repertoire), name it (Metadata),
feed it (one intake, §3.4), take it out (export, import a binder). Dann's
reason, his words: this "solves a persistent nagging feeling to me that our
file system (open/save/new/import/export) is messy and not well-thought-out."

**Open at open state**, fully, so a singer who arrives to paste a poem pastes
into a waiting field with no click. Dann's words: "the singer who wants to
paste text can paste it straight into the waiting input field without that
extra click to open." It retracts with a click, and per E.27, a score's first
render may collapse it. **Departure from E.27 §3.6:** File replaces Piece and
Source as the open-at-first-run set; same rule, different shape.

### 3.2 Text (closed at open state, headings visible)

What a singer does to a poem already in: Transcribe, Notation (the display
toggles; opens collapsed, ruled), Analysis (the inspector, which E.27 made a
takeover and the 2026-08-18 census made a scrolling station; today it is a
station).

### 3.3 Score markup (closed at open state, headings visible)

What a singer does to a score and a voice already in: Underlay (the pairing
queue, ruled 2026-08-18), Corrections (edits the sung note under the loupe),
Voice (profile, roster, Calibrate).

**The calibration question, Dann's, open for you.** Today calibration is a
full-drawer takeover, ruled at E.27 and reconfirmed 2026-08-18 as "one
takeover". Dann asks: "is there an elegant way to eliminate a second Drawer
surface if we plan responsibly so that the voice sample surface lives on the
Drawer properly with the other controls?" The desk's candidate, not ruled:
the Voice station expands in place into the ritual; for its duration the
other two groups fold to their headings; the phases and the microphone gate
live inside the expanded station exactly as they live inside the takeover
now; E.27's restore-on-exit rule is kept. That amends "never entered by a
chevron" in one respect. Explore it, and say what would have to be true for
it to hold on a phone.

### 3.4 One intake, not two

Dann: "I'm trying to eliminate the need of the user to aim for the right box
with their drag and drop content. One box makes it self-evident."

The rationale agreed in conversation: the singer brings material; Ilya tells
the material apart, not the singer. One field in File accepts paste, typing,
a dropped file of any format Ilya reads, and the photograph scanner. Text
becomes the poem; a score file becomes the score; a photograph goes to the
reader. After material arrives the field shrinks to a receipt line saying
what Ilya received and where it went, and stays a drop target for the other
kind. The receipt copy is French Dann has not seen and is owed; write
English placeholders only and mark them.

Constraint carried from N.70 (ruled 2026-08-16): on a phone the file picker
has no `accept` filter, because iOS greys out every format Ilya reads.

### 3.5 The three stations that moved

Metadata and Repertoire leave the domain groups for File. Source moves whole
into File as the intake. Notation and Analysis are Text; Corrections is
Score markup. Ruled by Dann in conversation 2026-09-02.

### 3.6 Colour

Dann's mnemonic, offered not ruled: "Sage for text, lavender for Score
markup and voice acoustics. I am open to reassigning these if you have a
compelling reason." What the page already does: lavender `#8E7E9B` is the
colour of every analysis mark on the score (turning heads, marks, rings),
and sage `#8B9A7D` is Studio's own hue on the app bar (ruled 2026-08-18).
Two facts to weigh against it: the ratified spec says "one accent per
surface", and principle 8 says colour never carries alone, so a group's
identity must survive greyscale print and a colour-blind singer. Say how
you resolve that, or say the mnemonic should not be colour.

## 4. Questions for you. Each answer states what would have to be true

4.1 **Finiteness on the phone.** Does the opening state, File fully open plus
two closed group headings plus the drawer's own header, fit at 430 × 932
without scrolling? Draw it at that size. If it does not fit, which part of
File closes first, and why that part? The desk's default, vetoable: Metadata
closes before the intake does.

4.0 **The silhouette, Dann's preferred shape.** His words, later the same
afternoon: "preserving the footprint of the Drawer but changing its
presentation. Right now the Drawer presents as a slab, a monolith. Instead we
could reorganize it into a stack of contiguous squircles of the same width as
the current Drawer: only the silhouette of the Drawer would change, really.
There would be little curvy divots at the junction of adjacent squircles. I
think this would communicate topical distinction to the user without eating
up screen real estate with nested margins." Draw this as the primary
candidate and the nested, inset squircles as the comparison. The divot is
defined by the two rounded corners meeting (Dann's words), so its depth is
the radius and its width twice the radius, and the radius is one of the
three ruled ones from `app.css:21-72`; say which, and do not invent a
fourth. Prove two things: that a divot of that radius reads at the drawer's
edge against the desk surround at desktop size, and that on a phone, where the drawer is full-width and the
outer silhouette is invisible, the internal junction reads as a seam on its
own, and say what carries it there (the curve, a hairline, a tint change, or
all three). The desktop bookmark tab belongs to the drawer, not to a group;
say where it sits.

4.2 **Is an expandable squircle the right device, or "tricky chrome"?** Dann's
own doubt, his words: "I'm wondering if making the domain squircles
expandable is a good idea or just tricky chrome?" Compare: (a) the squircle
itself expands and its stations expand inside it, two levels of disclosure;
(b) the squircle is a fixed frame whose station headings are always visible
and only stations expand, one level. Say which serves principle 10 and which
serves principle 6, and what a singer loses under each.

4.3 **Calibration in place.** §3.3. Draw the Score markup group with Voice
expanded into the ritual on desktop and on a phone. Say what breaks.

4.4 **The intake's receipt.** §3.4. Draw the field empty, with a poem
received, with a score received, and with both. Say how a singer replaces
one without losing the other.

4.5 **Build neither.** Say what a singer loses if the drawer stays as it is
today and only the intake is unified. Every choice in this project includes
that option.

## 5. Rules binding on everything

- **Drawer manipulates, page displays and prints.** Nothing on the paper.
- **Three radii, no fourth.** Squircle radius comes from the existing token
  set in `app.css:21-72`; do not invent one.
- **Do not invent a hex value, a token name, or a string.** Every value you
  draw carries where you got it.
- **French:** English placeholders only, marked. Dann has not seen the
  French, and the names of the three groups are his to give.
- **Canadian spelling. Oxford comma. No em dashes.**
- **Agentless voice. Ilya is not AI.** No copy that implies a helper.
- **Geometry answers modality:** 44 px on a coarse pointer.
- **Motion:** one duration, opacity and transform only; the paper never
  animates.
- **Ilya is ecumenical across voice types.** Do not optimise for a low male
  voice; it is the only measured one and it is the anomaly.

## 6. Your return

1. What you designed, and why, in the order of §4.
2. An answer to each of 4.1 to 4.5, each stating what would have to be true.
3. Rendered mockups: desktop at 1400 × 900 and phone at 430 × 932, opening
   state, one group expanded, and calibration in place.
4. Every number and every hex value you drew, with where you got it.
5. A section headed NOT ESTABLISHED. **"NOT ESTABLISHED beats a complete
   invented answer."**
