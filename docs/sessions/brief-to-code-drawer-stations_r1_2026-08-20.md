# Brief to Code: the drawer's stations

**Serves N.65, the drawer architecture. Written 2026-08-20 late by the
coordinating desk, on eight rulings Dann made the same evening. Floor:
`8d5b175`, branch `Shane`.**

Two ships, not one. Each ends in a deploy and a walk by Dann. **Do not fuse
them.** Ship one changes what a singer sees. Ship two changes what a singer can
do. A failed walk on a fused ship cannot say which half broke.

Read `docs/memory/CONTRACT.md` in full first. Every rule in it binds you,
including tether 17, which is new tonight and bears directly on this brief.

---

## 0. What Dann ruled, in his words where possible

He asked for "a cohesive, attractive, sensible organization for the Drawer"
after finding uneven header padding and an unexplained double line under
NOTATION. Then he ruled:

1. **Every header retracts its section on click.**
2. **One consistent relationship between a header and its first section entry.**
3. **"There should be a consistent approach to horizontal dividers: these need a
   semantic function or they should be gone."**
4. **Source needs a label.**
5. **The anchors retract too.** Piece and NOTATION included.
6. **The voice anchor does not.** His words: "I agree with you about the voice
   anchor, yes, Calibrate needs to be visible."
7. **The open set persists**, because his model is that a singer fills the
   metadata once, retracts it, and gives the space to the operands. A drawer
   that forgets turns that gesture into a chore.
8. **"That ruling was three weeks ago and a lot has changed since then. Leave
   room to be malleable."**

`docs/memory/STATE.md` carries the full account with the measurements.

---

## 1. The three defects, measured

**One label, five declarations.** `.section-label` is declared separately in
`RootPanel`, `MetadataFields`, `NotationFields`, `SongList`, and `Drawer`,
because Svelte scopes styles per component. `SongList.svelte` says so in its own
comment: "RootPanel's own `.section-label`, value for value, so the drawer keeps
one." Consistency is maintained by hand, which is why it drifted.
`NotationFields` already differs: it takes `--notation-accent` rather than
`--sage` and adds a `.collapsed` variant with its own spacing. **That is the
uneven padding, and it has no owner.**

**The double line is a seam.** NOTATION is two things at once: a pinned anchor
whose wrapper draws a boundary, and a station that draws its own. Both fire.
Nothing chose it.

**Source is unlabelled.** The textarea and the drop zone sit bare, against the
spec's own first grouping rule, `fable-gui-audit-and-spec_r1_2026-08-18.md`
§3.3: "No orphan controls. Every drawer control lives inside a labelled
station."

---

## 2. What to reuse, and what NOT to touch

**Reuse the TOC accordion.** `Drawer.svelte:87` holds `expandedSections` as a
`Set<string>`; `:131` has `toggleSection(id)`; Learn and Guide drive it through
`.toc-chevron` and `.toc-children`. **Extract it so the drawer has one
mechanism, and do not write a second.**

**Reuse `NotationFields`' disclosure shape.** `NotationFields.svelte:85-95`
already does exactly what ruling 1 asks, correctly, including
`aria-expanded`. It is the pattern, not the exception.

**The native `<details>` element stays for asides.** "Have an older Finale file
(.mus, pre-2014)?" and "what is vocal fry" are micro-help, not structure. E.27
§3.3: "One mechanism for structure, one for asides." **Two mechanisms, and a
horizontal divider is neither.**

**DO NOT retire the other collapse mechanisms in this brief.** E.27 §3.3 says
to retire five of them, and Opus priced that on 2026-08-05 as "the profile
switcher's mode enum, the wizard's hoisted collapse boolean, the uploader's
local boolean, and the searchable select. Four components, not a configuration
change." **That pricing is fifteen days old and those components have all moved
since.** This brief touches the drawer's stations and nothing else. If you find
yourself editing `ProfileSwitcher`, `CalibrationWizard`, or `ScoreUploader`
internals, stop and report it.

---

## 3. SHIP ONE. One label, one seam, no orphans

### 3.1 One owner for the station label

Give `.section-label` a single definition and delete the other four. Where it
lands is yours to choose and to justify in the memo: a `:global` rule, a shared
`StationHeader` component, or a token set consumed by one rule. **Say why you
chose it.**

`NotationFields`' accent variable and `.collapsed` variant are the only real
differences. Carry the accent through as a parameter. **The accent is
unconditionally sage now, ship two of N.73 S3 settled that; do not reintroduce
a per-document colour.**

**Ruling 2 is yours to make into a number.** One value for the gap between a
header and its first entry, applied everywhere, stated in the memo. Pick from
what is already in the tree rather than inventing a new step.

### 3.2 The seam draws one line

NOTATION currently gets a boundary from the anchor wrapper and a border from its
own station. Decide which one owns the line, delete the other, and say which and
why. **The rule that survives should be the anchor's**, because the anchor
boundary is a structural fact and the station's border is decoration, but
measure before you agree with me.

### 3.3 Dividers: semantic function or gone

Find every horizontal rule inside the drawer. For each, state in the memo what
it separates. **Keep only those that mark a station boundary or an anchor
boundary. Delete the rest.** If you find one you believe carries a function
neither of those names, do not keep it silently: name it in the memo and leave
it, and Dann rules.

### 3.4 Source becomes a labelled station, and its actions come with it

- The textarea, the OCR scanner, the score drop zone, and the Finale disclosure
  become one labelled station. **The label's string is `t(...)`-keyed in both
  languages like every other station label.** English "SOURCE". **The French is
  NOT ESTABLISHED and Dann has not seen it: propose it in the memo and do not
  ship a French string he has not approved.** If a key already exists for this,
  use it and say so.
- **`Clear` and `Transcribe` move to Source's foot**, inside the station, above
  Analysis. They act on the textarea and were separated from it when ship two
  moved Analysis up.
- **`Print` moves down and joins `Export this song` and `Import a song`** in
  Output.
- The `1fr 1fr 2fr` grid at `RootPanel.svelte`'s `.button-row` **stops
  existing** rather than being repaired: Source's row is two buttons, Output's
  row is three. `.binder-row`'s comment about column alignment goes with it.

### 3.6 The drawer's two text intakes, from Dann's inbox

Two items, and they are not the same kind. **Read which is ruled and which is
proposed, and do not blur them.**

**RULED by Dann, 2026-08-20: the placeholders match.** `.meta-input::placeholder`
sets colour only. `.text-input::placeholder` sets colour AND
`font-style: italic`. **Delete the italic.** The placeholder is instruction, so
it belongs to the Instrument voice; italic is the paper's mannerism. Dann's
words: "just make it consistent with its twin."

**NOT a defect, do not touch it:** `.text-input`'s body is `var(--font-serif)`.
Its contents are a poem, so the Reading voice is correct there. Only the
placeholder is instruction.

**PROPOSED by the coordinating desk, NOT RULED. Dann rules it on the walk.**
Dann asked for the sage and lavender field perimeters to be "more subtle in
colour" and ruled that the hues themselves are right: **sage names the text
intake, lavender names the score intake, and that is hue naming place, which is
what the system asks for. Do not neutralise either.**

The desk proposes that the dominance is weight, not hue. **`.text-input` is
`3px solid var(--sage)` and `ScoreUploader`'s drop zone is
`3px solid var(--deeper-lavender)`, while `.meta-input` is
`1px solid var(--stone-300)`. Take both from 3px to 1px and change no colour.**

**Why not a lighter hue, measured by the desk against the white field the
borders sit on:** `--sage` #8B9A7D is already at **2.99**, just under WCAG's 3:1
for a control boundary, and every lighter token falls further: `--light-sage`
#A8B5A0 at 2.15, `--muted-lavender` #A89BB5 at 2.62, `--light-lavender` #C4BACF
at 1.86. The white fill gives nothing: `#FFFFFF` on the `#FAF8F5` drawer is
barely above 1:1, so **the border is the only thing identifying the field.**
`--deeper-lavender` #8E7E9B is at 3.74, so the pair only looks matched.

**Report both borders' rendered weight and colour in the memo, and say that the
weight change is unruled**, so Dann's walk is the ruling. If he wants a lighter
hue after seeing 1px, the tokens exist and the numbers above are what he would
be choosing.

### 3.5 Done when

Dann walks these on a deploy, on the desk.

1. Every station label in the drawer measures identically: same size, weight,
   letter-spacing, colour, and the same gap to its first entry. **Report the
   computed values for all of them, one table.**
2. One line under NOTATION, not two.
3. `SOURCE` is labelled, and `Clear` and `Transcribe` sit under the textarea
   rather than under Analysis.
4. `Print` sits beside Export and Import.
5. Every remaining horizontal rule in the drawer is a station or anchor
   boundary, and the memo lists each with what it separates.
6. The textarea's placeholder renders roman, matching the metadata fields.
7. Both text intakes carry a 1 px border in their existing hue, sage for the
   text and lavender for the score. **Dann rules this one by looking at it.**
8. All five gates at baseline: phonology 216, dictionary 235, web-check 0 errors
   and 7 warnings in 4 files, web-test 682, score-parser 444 passed and 5
   skipped. **Ask Dann's permission before moving any gate count.**

---

## 4. SHIP TWO. Retraction, and a drawer that remembers

### 4.1 Every station retracts

Piece, Notation, Source, Analysis, Output, and Songs. **Including the pinned
anchors**: a retracted anchor is still pinned, it is just short.

**The voice anchor is excluded and this is Dann's explicit ruling.** It has a
header and no contents: a dot, a status, and a button on one line. There is
nothing to retract, and collapsing it would hide `Calibrate`, the only entry to
the ritual, for no height.

### 4.2 The open set persists per device

One new key, per E.27 §3.4, which is one of only three parts of that document
nothing has amended. **Namespace it like the others (`ilya:`) and say the exact
key string in the memo.**

**One exception, and it is deliberate: NOTATION does not join the persisted
set.** `+page.svelte` states the reason in its own comment: "a remembered
collapse hides the toggles from a singer who forgot they exist." It keeps its
ruled collapsed-on-arrival default. **Do not tidy this away.**

**An unrecognised or corrupt stored value must fall back to the first-run
default and not throw.** Ship two of N.73 S3 established that pattern for
`ilya:activeTab`; follow it.

### 4.3 First run

Per E.27 §3.6, which nothing has amended: **Piece and Source open, everything
else closed.** That is what stops a new singer meeting a wall of closed
headers.

### 4.4 What NOT to build

- **No phone exclusivity.** E.27 §3.4 rules "Phone: exactly one open at a time."
  Opus flagged that on 2026-08-05 as an unrequested override of Dann's standing
  "we leave this to the user." **Dann has been asked twice and has not granted
  it.** Any number open, on both displays.
- **No auto-collapse on populate.** E.27 §3.3 forbids it in advance: "Calm
  Authority means the drawer does not fidget. Nothing else ever moves without
  the user." The retraction is the singer's gesture.
- **No closed-header status line yet.** E.27 §3.6 wants a right-aligned quiet
  status on every closed header ("defaults", "no profile yet", "nothing to
  print yet"). **That copy is Dann's and he has not written it.** Build the
  structure so the slot can be added later without rework, and say in the memo
  where it would go. **Do not invent the strings.**

### 4.5 Done when

1. Every station opens and shuts on a click of its header, on the desk and on
   the phone.
2. Shutting the metadata anchor gives the middle its height back. **Measure
   `.drawer-content`'s `clientHeight` with metadata open and shut, at 430x932,
   390x844, 393x727, 375x667, and 360x640. Ten numbers.**
   **The coordinating desk's expectation, stated before the measurement: shut
   returns roughly 270 px, and the middle clears 365 px at every one of the five
   sizes.** 365 is `RootPanel.svelte`'s `.console-placeholder-body` reserve.
3. A reload restores the open set exactly, except NOTATION, which is collapsed
   again by design.
4. A fresh browser opens with Piece and Source open and everything else shut.
5. Any number of stations can be open at once on the phone.
6. All five gates at baseline.

---

## 5. The return memo

`docs/sessions/drawer-stations-ship1_r1_2026-08-20.md` and
`drawer-stations-ship2_r1_2026-08-20.md`, each committed with its own ship.

Each carries: what shipped with `path:line` for every anchor you wrote; every
place the tree disagreed with this brief and which you followed; the five gate
counts before and after; the measurements each §Done-when asks for; every
decision this brief did not rule, stated as a decision; and **NOT ESTABLISHED**,
everything you could not determine and what would settle it. **NOT ESTABLISHED
BEATS A COMPLETE INVENTED ANSWER.**

---

## 6. NOT ESTABLISHED at the time of writing

1. **The populated Inspector's height.** 365 px is what the placeholder
   reserves (`RootPanel.svelte`, `.console-placeholder-body`). The measurement
   it was chosen against sits in E.36 §2.2, which this desk has not opened.
   Settled by: measuring the Inspector with a word selected.
2. **The French for the Source station label.** Settled by: Dann, who must see
   the whole table before any French ships.
3. **The gap value for ruling 2.** No document names one. Settled by: you
   choosing from what the tree already uses, and saying so.
4. **Whether any divider carries a function that is neither a station nor an
   anchor boundary.** Settled by: your inventory in §3.3.
5. **Whether the metadata anchor collapses to exactly its header.** The 302.7 px
   figure is the open block on a phone, measured by Code on `63c2bb4`. The
   collapsed height is not established. Settled by: §4.5's ten numbers.

---
*Written by the coordinating desk, 2026-08-20 late. Read in full this session:
`docs/memory/README.md`, `CONTRACT.md`,
`claude/fable-ruling-e27-four-tab-consolidation_2026-08-05.md`,
`claude/e44-fable-ruling-studio-architecture_2026-08-13.md`,
`claude/fable-ruling-s0-slate-closed_2026-08-19.md`. Read in part:
`docs/memory/STATE.md`, `fable-gui-audit-and-spec_r1_2026-08-18.md`,
`Drawer.svelte`, `RootPanel.svelte`, `NotationFields.svelte`, `+page.svelte`.
**E.27 is quoted here as a source, not as law, per tether 17: three of its parts
are already superseded and `STATE.md` names which.**
