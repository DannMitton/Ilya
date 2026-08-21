# Brief to Code: the Finale disclosure goes, and every header retracts

**Serves N.65. Written 2026-08-20 evening. Floor: `1101d94`, branch `Shane`.**

**This consolidates two things: one deletion Dann ruled on his walk, and ship
two of `brief-to-code-drawer-stations_r1_2026-08-20.md` §4, which was written
this morning and never started. Build from this document; §4 is superseded by
it.**

Read `docs/memory/CONTRACT.md` in full first, including tether 17 and tether 18.
Read `docs/memory/STATE.md`'s entry **THE DRAWER'S STATIONS**, which carries
Dann's eight rulings and the measurements behind them.

**Two ships. Do not fuse them.** Ship A is one deletion. Ship B is the
retraction. Each ends in a deploy and a walk.

---

## SHIP A. The older-Finale disclosure goes

Dann: "Let's eliminate the 'have an older Finale file' subsection. It is
useless. That will let the button row beneath it snug up to the input like the
buttons and input field above it."

Remove the `.mus-help` block in `ScoreUploader.svelte`, its `mus-trigger`
button, the `musHelpOpen` state, and its styles. The Output row then sits
against the score box the way Clear and Transcribe sit against the textarea,
which is the point.

**It is redundant, and record it that way rather than as a loss.** Dropping a
`.mus` file already returns `upload.err.mus`: "Resave it as .musx in Finale 2014
or later, or export it to MusicXML, then upload again." That is the
disclosure's options 1 and 3. Option 2 was "print to PDF and upload the PDF.
(PDF import is coming soon.)" and **PDF import has since shipped**, so PDF is
named in the drop zone's own sentence. Only the trial-version line has no other
home.

**The i18n keys.** `upload.mus.trigger`, `.intro`, `.opt1`, `.opt2`, `.opt3`,
and `.trial` exist for this block. **Check every one for another consumer before
deleting it and report what you found. Do not delete `upload.err.mus`**, which
is the error path and is now the only guidance a `.mus` user gets.

**E.27 §3.3 names "older Finale files" as an example of the native disclosure
pattern.** That is a fifteen-day-old example inside a document tether 17 calls a
source rather than law, and Dann has ruled. Note it; it is not a blocker.

## SHIP A, second item. The bottom-most divider goes lavender

The rule immediately above the voice anchor is sage. **Dann has ruled it
lavender.**

This is his own system applied rather than an exception to it: sage marks
transcription work, lavender marks score and voice work. The rule above SHIFT
LYRICS went lavender in the last pass for the same reason, and **the rule above
the voice anchor belongs to the voice, which is lavender's carrier under the S0
ruling of 2026-08-19.**

Use the same token the SHIFT LYRICS rule now uses. **Do not introduce a second
lavender.** Report which token and confirm the two rules measure identically.

### Ship A done when

1. No older-Finale disclosure anywhere in the drawer.
2. The Output row sits against the score box with the same gap Clear and
   Transcribe have to the textarea. **Report both gaps.**
3. A `.mus` file still produces `upload.err.mus` with its guidance intact.
4. The rule above the voice anchor is lavender and measures identically to the
   rule above SHIFT LYRICS. **Report both.**
5. Every other station rule in the drawer is still sage. **List them.**
6. Five gates at baseline: 216, 235, 0 errors and 7 warnings in 4 files, 682,
   444 passed and 5 skipped. **Ask Dann before moving any count.**

---

## SHIP B. Every header retracts

Dann, on his walk: "I'd like a retraction chevron applied to every header.
Every header begins a section that is retractable and expandable."

### B.1 What retracts

**Every station that has a header.** As the tree stands that is Piece
(METADATA), NOTATION, SOURCE, REPERTOIRE, ANALYSIS, and SHIFT LYRICS.
**Including the pinned anchors:** a retracted anchor is still pinned, it is
just short.

**THE VOICE ANCHOR IS EXCLUDED AND THIS IS DANN'S EXPLICIT RULING.** It has a
header and no contents: a dot, a status, and a button on one line. There is
nothing to retract, and collapsing it would hide `Calibrate`, the only entry to
the ritual, for no height. His words: "I agree with you about the voice anchor,
yes, Calibrate needs to be visible."

**One station has no header at all: Output.** See §B.6.

### B.2 One mechanism, and it already exists

`Drawer.svelte` holds `expandedSections` as a `Set<string>` with a
`toggleSection(id)`, driving Learn and Guide's table of contents through
`.toc-chevron` and `.toc-children`. **Extract it so the drawer has one
mechanism. Do not write a second.**

`NotationFields` already does exactly what this asks, correctly, including
`aria-expanded`. **It is the pattern, not the exception.** Every other station
gets the same chevron, in the same position, at the same size.

**The native `<details>` element stays for asides**, per E.27 §3.3: one
mechanism for structure, one for asides.

### B.3 The chevron's direction is already ruled and already cost a repair

**It points the way the panel will grow.** Down when shut, up when open, for a
panel that opens downward. Do not re-derive it. `NotationFields` carries the
rule in a comment above its two rotations after the N.73 S3 walk repair.

### B.4 The open set persists per device

One new key, `ilya:` namespaced like the others. **Say the exact key string in
the memo.**

**One exception, deliberate: NOTATION does not join the persisted set.**
`+page.svelte` states the reason in its own comment: "a remembered collapse
hides the toggles from a singer who forgot they exist." It keeps its ruled
collapsed-on-arrival default. **Do not tidy this away.**

**An unrecognised or corrupt stored value falls back to the first-run default
and does not throw.** N.73 S3 ship two established that pattern for
`ilya:activeTab`; follow it.

### B.5 First run

Per E.27 §3.6, which nothing has amended: **Piece and Source open, everything
else closed.** That is what stops a new singer meeting a wall of shut headers.

### B.6 There is no Output station. RULED BY DANN 2026-08-20

The coordinating desk put a naming question to him and he dissolved it instead.
His words: **"I do not think we need an Output section articulated. What I want
is the appearance that the Print/Export/Import row shares the same relationship
to the score field as the Clear text/Transcribe row does to the text field above
it."**

**So: no label, no heading, no chevron, and no orphan-control problem.** The row
is the score field's action row, exactly as `Clear text` and `Transcribe` are
the textarea's. Both pairs belong to SOURCE.

**BUILD THE RELATIONSHIP, NOT A STATION.** The gap from the score box to
`Print`, `Export this song`, `Import a song` matches the gap from the textarea
to `Clear text` and `Transcribe`. Same distance, same alignment, same treatment.
**Report all four measurements: each field's bottom edge and each row's top
edge.** They must differ by the same number.

**CONSEQUENCE DANN HAS BEEN TOLD ABOUT AND WILL RULE ON HIS WALK:** the row now
sits inside SOURCE, so collapsing SOURCE takes `Print` with it. Build it that
way, say so in the memo, and do not solve it.

### B.7 What NOT to build

- **No phone exclusivity.** E.27 §3.4 rules "Phone: exactly one open at a
  time." Opus flagged that on 2026-08-05 as an unrequested override of Dann's
  standing "we leave this to the user." **He has been asked twice and has not
  granted it.** Any number open, on both displays.
- **No auto-collapse on populate.** E.27 §3.3 forbids it in advance: "Calm
  Authority means the drawer does not fidget. Nothing else ever moves without
  the user." The retraction is the singer's gesture.
- **No closed-header status line.** E.27 §3.6 wants a right-aligned quiet status
  on every shut header ("defaults", "no profile yet", "nothing to print yet").
  **That copy is Dann's and he has not written it.** Build the structure so the
  slot can be added later without rework and say where it would go. **Do not
  invent the strings.**

### B.8 Ship B done when

Dann walks these on a deploy.

1. Every station listed in §B.1 opens and shuts on a click of its header, on
   the desk and on the phone, and every one shows a chevron.
2. Every chevron points down when shut and up when open.
3. **Shutting the metadata anchor gives the middle its height back. Measure
   `.drawer-content`'s `clientHeight` with metadata open and shut, at 430x932,
   390x844, 393x727, 375x667, and 360x640. Ten numbers.**
   **The coordinating desk's expectation, stated before the measurement: shut
   returns roughly 270 px, and the middle clears 365 px at every one of the five
   sizes.** 365 is `RootPanel.svelte`'s `.console-placeholder-body` reserve.
4. A reload restores the open set exactly, except NOTATION, which is collapsed
   again by design.
5. A fresh browser opens with Piece and Source open and everything else shut.
6. Any number of stations can be open at once on the phone.
7. The voice anchor has no chevron and `Calibrate` is visible at all times.
8. Five gates at baseline.

---

## The memo

`docs/sessions/retraction-shipA_r1_2026-08-20.md` and
`retraction-shipB_r1_2026-08-20.md`, each committed with its own ship, or say
why you chose otherwise.

Each carries: what shipped with `path:line`; every place the tree disagreed with
this brief and which you followed; the measurements each done-list asks for; the
gate counts; every decision this brief did not rule, stated as a decision; and
**NOT ESTABLISHED**, with what would settle each. **NOT ESTABLISHED BEATS A
COMPLETE INVENTED ANSWER.**

---

## NOT ESTABLISHED at the time of writing

1. **Output's label, English and French.** Settled by Dann, one string each.
2. **The populated Inspector's height.** 365 px is what the placeholder
   reserves. The figure it was chosen against sits in E.36 §2.2, which this desk
   has not opened.
3. **Whether the metadata anchor collapses to exactly its header.** The 302.7 px
   figure is the open block on a phone, measured on `63c2bb4`. The collapsed
   height is not established. Settled by §B.8's ten numbers.
4. **Whether a real window resize leaves `bind:clientHeight` stale**, which you
   raised on the silhouette pass and left as NOT ESTABLISHED. Not this brief's
   to settle, but if you see it while working, say so.

---
*Written by the coordinating desk, 2026-08-20 evening. Ship B is
`brief-to-code-drawer-stations_r1_2026-08-20.md` §4 with Dann's chevron ruling
made explicit and Output's missing header named; that §4 is superseded by this
document.*
