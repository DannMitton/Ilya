# Design brief: the mobile correction interface

Prepared by the desk for Claude Design, 2026-08-25. Commissioned by Dann.
Serves the mobile experience track (N.92 and N.93 territory). Dann reviews
every prototype; nothing ships from this brief without his eye.


## How to run this brief. For the Design session, before anything else

1. Dann attaches the `docs/sessions` folder (or uploads the six files
   named below) in this chat. You have no filesystem or project access of
   your own; work only from what is attached.
2. Read in full, in this order: this brief, then
   `memo-research-mobile-notation_r1_2026-08-25.md`,
   `drawing-n92-loupe-and-surface_r2_2026-08-25.html`,
   `drawing-n92-correction-surface_r1_2026-08-25.html`,
   `drawing-n92-mobile-correction-mode_r1_2026-08-25.html`, and
   `fable-ruling-gui-principles-and-portrait-c_2026-08-18.md` (the Calm
   Authority ruling, filed beside this brief). If any file is missing, say
   so and ask Dann for it; do not proceed on a summary or a guess.
3. Render everything you propose. Dann rules from rendered drawings, never
   from prose. Deliver prototypes as self-contained HTML files into this
   chat, named `design-mobile-correction_r<n>_<ISO date>.html`, revisions
   beside their predecessors, nothing overwritten. Dann files them into the
   repository himself.
4. Show Dann one thing at a time and stop after one question. Once he
   answers, it is answered; do not re-raise.
5. The deliverable is one finished mobile schematic, portrait first with
   the landscape state shown, plus a desktop adaptation note in markdown in
   the same folder. You do not write application code, you do not brief
   Code, and you do not run git.
6. Every word you write follows Google's developer documentation style with
   Canadian spelling and no em dashes. Tell Dann which words you coined and
   which you adopted, every time.

## Purpose, in Dann's words

One app, two screen sizes. Represent 8.5 x 11 constructs plus their control
surfaces on limited mobile real estate, keeping design as consistent as
possible between desktop and mobile. The mobile version must work and be a
pleasure to use: ease of use, intuitive, easy to navigate, reasonable touch
gestures. Users must not feel they have to re-learn the app from desktop to
mobile. The print product of both modalities is identical.

## The product, in one paragraph

Ilya makes a study edition for singers of Russian song. The paper is the
interface: an engraved page carrying notation, IPA, and Cyrillic underlay.
A drawer holds the instruments; the page displays and prints. Scores arrive
by file upload or by optical reading of scanned pages, and the reader's
error rate means EVERY piece needs corrections, so the correction surface
is a primary interface, not an edge case. Design to Calm Authority: the
eleven-principle slate ruled 2026-08-18
(`claude/fable-ruling-gui-principles-and-portrait-c_2026-08-18.md`), of
which the load-bearing ones here are: one term, one control, one meaning,
forever; every mark earns its ink; geometry answers modality, not width;
colour never carries alone; typography is the interface.

## Ruled ground, each item dated. Design within it

1. **The paper on a phone is the true 8.5 x 11 page at readable zoom, a
   window onto the same object the desktop shows whole.** No re-broken
   systems, ever. (Dann, 2026-08-25.)
2. **Portrait and landscape are both interactive, both valid, neither a
   concession the user can feel.** Portrait must yield a workable study
   score; landscape is a natural exploration, not a requirement.
   (Dann, 2026-08-25.)
3. **The loupe.** The active measure magnifies in place over the whole
   page, shadowed, nearest the user, fully editable; the page beneath stays
   visibly itself. A coarse tap near the fault raises the loupe on that
   measure; the stepper walks entries and crosses barlines to adjacent
   measures, Finale-fashion. The loupe persists on desktop and in
   landscape. (Dann, 2026-08-25. The frame-and-insertion-bar grammar is
   adopted from Finale Speedy Entry; the z-axis magnification is Dann's
   own.)
4. **One surface holds every operative control**: step, duration with dot
   and tuplet, pitch, accidentals, rest, delete, tie, and the lyric verbs.
   No modal faces. (Dann, 2026-08-25, overturning the desk's two-face
   draft.)
5. **No confirm anywhere.** A verb changes the note's state instantly; the
   singer alters until satisfied. (Dann, 2026-08-25.)
6. **A visible, named Undo**: attractive, friendly, Calm Authority; it
   tells the user what it will undo. Undo gives the user a sense of
   control. (Dann, 2026-08-25.)
7. **The surface's dismissal is a bare chevron**, consistent with the
   drawer's ruled pull grammar (Dann, 2026-08-19: one pull, no visible
   word, points the way it moves).
8. **Accidentals are direct verbs**, flat, natural, sharp, cumulative to
   doubles, natural resets, spelled through the one spelling policy
   (Dann, 2026-08-24, N.92 slice 2, shipped and walked).
9. **Touch floor 44 px on coarse pointers** (E.36, 2026-08-10); the page's
   own glyphs are exempt because coarse tap plus fine step does the
   precision work.
10. **Corrections are a reversible diff keyed to event ids**, applied after
    every re-read (N.92 slice 1, shipped 2026-08-24). The architecture
    already supports no-confirm editing and undo.
11. **Tuplet input replicates Finale's grammar exactly** (Dann,
    2026-08-25): a quick tier, counts 2 through 8 with triplet foremost
    (Speedy's Option+2..8), and a full tier, "N of [value] in the space of
    M of [value]" with the last definition remembered as default (the
    Tuplet Definition's rhythmic half). Finale's appearance options are
    NOT replicated; engraving answers to Gould here.

## The interaction, as Dann told it

The singer is in portrait, looking at the true page. They know where the
fault is. They tap near it; the loupe rises on that measure, the tapped
note selected. If the tap was a measure off, they arrow over. Verbs land
instantly: duration, pitch, accidental, rest, tuplet, or a lyric shift.
The readout names the selection; Undo names its target. The chevron sends
the surface away and the page stands corrected. Pinch remains available on
the page itself; the loupe spares the singer most of the pinching.

## Deliverables

One finished mobile schematic, portrait-first with the landscape state
shown, plus a desktop adaptation note describing how the loupe and the one
surface join the shipped desktop drawer palette without re-learning.
(Dann, 2026-08-25: one schematic plus a note, not two schematics, so done
work is not redesigned.)

## Open questions for Design. These are yours to propose on, Dann's to rule

1. The tap grammar as one table: tap, double tap, press-and-hold, drag,
   pinch, across page, loupe, and surface, with no collisions.
   Double-tap-to-raise collides with double-tap zoom habits; press-and-hold
   or tap-then-rise are live alternatives.
2. The tuplet count row and Custom form's face and placement.
3. The pitch of a freshly inserted note. Desk proposal: it arrives at the
   previous note's pitch and the pitch verbs finish it.
4. Whether the lyric row dims when the insertion bar sits in a gap between
   notes.
5. The Undo affordance's exact form: pill with named action is the desk's
   sketch, not a ruling.
6. Where the surface lives relative to the drawer on the phone: the same
   drawer slimmed, or a sibling dock sharing the drawer's grammar. The
   drawer's ruled anchors (E.36 §1.4) must survive whichever answer.
7. How the loupe announces which measure it holds (measure number, system
   position) so the singer never loses their place in the whole.

## Materials

- `docs/sessions/drawing-n92-loupe-and-surface_r2_2026-08-25.html`: the
  desk's current sketch of the loupe and the one surface. r1 beside it
  shows the superseded two-face draft.
- `docs/sessions/drawing-n92-mobile-correction-mode_r1_2026-08-25.html`:
  the earlier three-reading exhibit, kept for the record.
- `docs/sessions/memo-research-mobile-notation_r1_2026-08-25.md`: the
  survey of touch notation editors. Headline: portrait phone note-editing
  has almost no precedent; the bottom-docked surface (Soundslice, Newzik)
  is the nearest living pattern; this work is ground-breaking on purpose.
- Error-channel data steering control priority: N.95 measured durations as
  the broken channel (0 of 28 confident before re-derivation, 50
  abstentions on the Lamm read, 0 of 10 rests found) and pitch nearly fine
  (36 of 41). The duration row leads the surface for this reason.

## What could not be established

- Whether any existing product implements a loupe-with-insertion-bar over
  a true page on a phone. The research found none; absence of precedent is
  established only to the survey's depth.
- Finale's exact Simple Entry tuplet keystroke set across versions; the
  grammar above is verified from the 2010/2012 manuals and the current
  FinaleMac/FinaleWin manual pages.
- Real-device behaviour: everything measured this session ran in desktop
  Chrome emulation with a fine pointer. Coarse-pointer geometry and real
  pinch are unverified until a phone walk.

NOT ESTABLISHED beats a complete invented answer.
