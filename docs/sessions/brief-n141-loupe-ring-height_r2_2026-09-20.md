# BRIEF — N.141 r2. The squircle's height: a floor, and growth for high notes

**Written 2026-09-20, 23:55, by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree read for this brief at `2b980e7`.**

**THIS SUPERSEDES `brief-n141-loupe-ring-height_r1_2026-09-20.md` ENTIRELY.** That file
asked for a page-supplied `{ top, bottom }` channel. **Dann amended the rule at 23:35 and
that channel is no longer wanted.** The r1 file on disk was never updated with the
rewrite; a transfer reported success and wrote stale content. Ignore r1.

**If you already built r1, this brief tells you what to remove.**

---

## 1. THE RULE, AMENDED BY DANN 2026-09-20. It is his, not the desk's

**This amends his own rulings of 2026-09-14 and 2026-09-15**, which said every box on a
system is one height. Both are in `docs/memory/OPEN.md` §N.141 and are otherwise
untouched. Per tether 17, quote this amendment and not the originals.

His words, 2026-09-20, 23:32:

> *"Each measure in the loupe should share a default predetermined common height based on
> the spatial relationship between the musical line and the corresponding row of IPA
> syllables immediately beneath it. The bottom of the squircle is anchored to that IPA is
> its baseline and this should always be the case. But the height of the squircle may
> vary for notes drawen above the staff. There is a minumum default height with the
> possiblity of accommodating higher notes inside the squircle for the notes that require
> the extra height."*

Refining it at 23:35:

> *"the minumum default should capture the distance between the IPA baseline and maybe
> one space above the stave? And notes that require more height (such as those above the
> staff on ledger lines) will get that extra height but the bottom of the squircle will
> always line up with its siblings."*

**The rule, stated so it is buildable:**

1. **BOTTOM: the IPA baseline plus the IPA face's descent.** Unchanged from what is built.
2. **MINIMUM TOP: one stave space above the top stave line.**
3. **A NOTE WHOSE OWN INK REACHES HIGHER takes its own top**, with the same one-space
   clearance. It grows upward only.

**What changes about the existing rule.** Boxes are no longer all one height. They share a
bottom edge and a floor. Height varies upward only, and only for notes that need it.

---

## 2. WHY THIS IS ALSO THE FIX FOR THE LOUPE

`ringBox` (`apps/web/src/lib/shane/selection-ring.ts:237`) derives the top today by
looping every `[data-event-id]` on the system and taking the highest ink (`:301-305`).

N.153 stage 3a and 3b made the loupe render one measure, so that loop sees one measure
while the page's sees a whole system, and the same note gets a different box on each
surface.

**Dann's amendment removes the loop, and with it the divergence.** Every input then
belongs to the taken note or to the stave. **The loupe and the page agree by construction,
with no data passed between them.**

**Your own measurement is the argument for it.** You reported the page's ring height as
70, 74 or 63 units depending on the system. That is three heights in one song, which is
not the consistency the original rule was written for.

---

## 3. WHAT TO REMOVE FIRST, if you built r1

- The optional page-supplied `{ top, bottom }` parameter on `ringBox`.
- The per-system span computation in `VoiceProfilePane` and its plumbing into the loupe.
- Any field added to `LoupeRenderBundle` for it.

**Use file edits. Do not use git.** No agent writes with git (`CONTRACT.md` §5).

---

## 4. WHAT TO BUILD

All inside `ringBox`, `selection-ring.ts:237-343`.

### 4.1 The top. THIS ANSWERS YOUR PADDING QUESTION

**The floor is the top. There is no `RING_PAD_Y` on the vertical any more.** Dann named
the distance itself: the box's edge sits one stave space above the stave. A note that
reaches higher gets the same one-space clearance above its own ink.

So the whole calculation is:

```
const top = Math.min(staffTop, own.top) - gap;
```

- `gap` is already computed at `:244` as `hitH / 11`, with the recovery explained at
  `:239-243`.
- `staffTop` is computed at `:246`.
- `own` is `eventInk(sysEl, group, id)` at `:262`, and already includes the notehead, its
  accidental, its dot, and its stem.
- y grows downward, so `Math.min` picks whichever is higher on the page.

**DESK DEFAULT, and Dann can wave it off with a word:** using one stave space rather than
`RING_PAD_Y`'s fixed `9` (`:29`) makes the clearance scale with the notation and gives the
floor and a high note the same treatment. **Report what `gap` actually is in the fixture**,
so we know whether this made boxes taller or shorter than the `9` they had.

**`RING_PAD_Y` stays exported.** `RING_REACH` at `:41` is built from it and read
elsewhere. **Grep for both before touching either, and report what you find rather than
changing a caller.** `RING_PAD_X` is the width's pad and is untouched.

**A beam is not read**, ruled by Dann 2026-09-14: *"a beam is acceptable for the circle to
bisect. Of course."* Confirm `eventInk` excludes beams and say so in the memo.

### 4.2 The bottom. THIS ANSWERS YOUR SECOND QUESTION

**Your reading is right. Leave it exactly as the original `ringBox` had it:** the IPA
baseline plus `ipaFaceDescent()` plus half the stroke, taken from the render itself
(`:323-327`). `ipaFaceDescent()` reads the face's own `fontBoundingBoxDescent`
(`:220-227`), a font metric rather than the glyphs present, which is what keeps `j` and
`ɲ` inside and gives a melisma the same box. Both surfaces get the same number because
both use the same face.

### 4.3 The viewBox clamp. KEEP IT, AND REPORT IT

**Do not drop the clamp at `:334-339`.** It serves Dann's rule 2, never truncated.

**But it must not silently change a height.** Keep it, and **report every measure where it
binds**, on both surfaces. If it never binds, say so and we are done. If it binds, that is
a finding for a follow-up, not something to fix in this pass.

---

## 5. THE PAGE'S RING CHANGES TOO, AND THAT IS INTENDED

**r1 said the page path must be unchanged. That was wrong**, and it was the desk's error.
`ringBox` is one function with two callers, so deleting the loop changes both.

Dann ruled on 2026-09-14 that **the shape is the same on the page and in the loupe**, and
that only the re-spacing permission differs: *"A singer learns one shape and meets it
twice."* **One function, one rule, both surfaces. Do not branch on which surface is
calling.**

What must NOT change on the page is the **notation**. Only the ring moves.

---

## 6. WHAT YOU MUST NOT DO

- **Do not pass any height between the page and the loupe.** Section 2.
- **Do not touch the width.** It follows the note's own ink plus its IPA syllable
  (`:264-293`) and is ruled to vary per note. `OPEN.md` §N.141: *"Do not make the widths
  uniform in pursuit of consistency."*
- **Do not bring back `RING_ASPECT`** or any coupling of height to width.
- **Do not branch on the calling surface.**
- **Do not put a mark anywhere to say a box could not fit.** `CONTRACT.md` §6.
- **Do not commit and do not stage.**

---

## 7. DEFINITION OF DONE

1. All five gates at baseline. Gate 4 is `1342 passed (1342)`
   (`~/Downloads/ilya-ship.sh:79`). If you add tests, move the line and back up the
   original as previous passes did.
2. **Across all 17 held-able measures of `sunless-01-engraved.musicxml`, report per note:
   the box's top, bottom, and height, on the page and in the loupe.** From a run.
3. **Every bottom is the same number** on both surfaces.
4. **The loupe's box and the page's box for the same note are identical in height.**
5. **Name every note whose box exceeds the floor, and by how much.** Expect only notes
   above the stave. Anything else is a finding.
6. **The page's ring heights before and after, per system.** You measured 70, 74 and 63
   today. Report what the new rule gives, so the change to the page is recorded rather
   than discovered later.
7. **The page's NOTATION output is unchanged.** Only the ring moves.
8. Every ring closed, no truncation, on all 17.
9. **The value of `gap` in the fixture**, and whether the new clearance is larger or
   smaller than the `9` it replaces.

---

## 8. WHAT YOU COULD NOT ESTABLISH

Fill this section. **NOT ESTABLISHED beats a complete invented answer.**

At minimum: whether `eventInk` includes beams, what happens on a measure with no underlay
at all, and whether the viewBox clamp bound anywhere.

---

## 9. RETURN MEMO

`docs/sessions/memo-n141-loupe-ring-height_r2_2026-09-20.md`, a new file. Short. What
changed by file and line range, the tables from section 7, and section 8.
