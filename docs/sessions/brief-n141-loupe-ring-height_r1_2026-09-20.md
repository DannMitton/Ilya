# BRIEF — N.141. The loupe's squircle takes its height from the page's system

**Written 2026-09-20 by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree read for this brief at `2b980e7`, working tree clean.**

Small and self-contained. One rule, three call sites.

---

## 1. THE DEFECT

**Dann ruled on 2026-09-14 that every squircle on a system is ONE HEIGHT**, and on
2026-09-15 that height and width are independent: *"I ruled every box on a system to be
one height, as a means of communicating consistency. Not every squircle will be the same
width."* He also ruled on 2026-09-14 that **the shape is the same on the page and in the
loupe**, and only the re-spacing permission differs: *"A singer learns one shape and
meets it twice."* Both are in `docs/memory/OPEN.md` §N.141.

`ringBox` (`apps/web/src/lib/shane/selection-ring.ts:237`) implements that correctly. It
reads the system it is handed and derives one height for every ring on it.

**N.153 stage 3a and 3b changed what it is handed.** The loupe now renders one measure,
so `sysEl` inside `ringBox` is a one-measure render rather than the page's system.

**Result: the loupe's box height varies measure to measure, and differs from the page's
box for the same note.** The consistency the height rule exists to carry is broken on the
surface where a singer examines notes one at a time.

Code named this and did not resolve it
(`docs/sessions/memo-n153-s3b-derived-spacing_r1_2026-09-20.md`, section on what it could
not establish): *"`ringBox` reads the whole system it is handed for the ring's top and
bottom, so on a measure whose ink is shorter than its page system's, the loupe's ring is
shorter than the page's. Sunless m. 5 looked right; NOT ESTABLISHED elsewhere."*

---

## 2. THE THREE VALUES THAT SHIFT, read this session

All in `selection-ring.ts`, inside `ringBox`.

1. **`systemTop`, `:301-305`.** The minimum `eventInk().top` over every `[data-event-id]`
   in `sysEl`, floored at `staffTop`. One measure's highest ink is not the system's.
2. **`ipaBaseline`, `:323`**, from `ipaBaselineOf(sysEl)`. A measure with no underlay
   falls through to `Math.max(own.bottom, staffBottom) + RING_PAD_Y` at `:327`, a
   different bottom from every other measure's.
3. **The viewBox clamp, `:334-339`.** `top` is clamped to `vb[1] + bleed`. The
   one-measure render's viewBox is tighter than the page system's, so the clamp can pull
   the top down where the page's would not.

---

## 3. WHAT TO BUILD

**The loupe's ring takes its height from the PAGE's system. Its width stays its own.**

Width already follows the taken note's ink plus its IPA syllable (`:264-287`) and is
ruled to vary per note. **Do not touch the width.**

Height means the pair `(y, height)`, that is `top` and `bottom`. Both come from the page.

### 3.1 The channel

`LoupeRenderBundle` (`apps/web/src/lib/shane/loupe-render-bundle.ts`) already carries page
data into the loupe and is assembled inside `VoiceProfilePane.svelte`'s untracked
page-rebuilt effect. **Add the page-derived height there**, computed once per page render
from the page's own system element, and hand it to `ringBox`.

**Prefer extending `ringBox`'s signature with an optional page-supplied
`{ top, bottom }` over duplicating the arithmetic.** One function, one rule, two callers.
When the override is absent, behaviour is exactly as today, so the page path is unchanged
by construction.

### 3.2 Which page system

The held measure's own system on the page, the element `Loupe.svelte:718-719` already
finds as `pageSys`. Not the whole score.

### 3.3 The viewBox clamp

The clamp at `:334-339` exists to keep the ring from being truncated, which is **Dann's
rule 2, never truncated** (`OPEN.md` §N.141). With a page-supplied height the loupe's own
viewBox may be too tight to hold it.

**Do not solve this by clamping, because clamping is what changes the height.** The
loupe's render must make room. Stage 3b already built the mechanism for exactly this: the
loupe derives its own spacing and is permitted to be bigger than the page
(clause 8, ruled 2026-09-18). Extend the render's vertical extent so the page-supplied
box fits with its stroke.

**If that turns out to need more than the render's viewBox, stop and say so in the memo
rather than clamping.** A truncated squircle breaks a ruling; a taller loupe does not.

---

## 4. WHAT YOU MUST NOT DO

- **Do not change the page's ring.** Its behaviour today is ruled and walked. The only
  acceptable diff on the page path is none.
- **Do not make the widths uniform.** `OPEN.md` §N.141: *"Do not make the widths uniform
  in pursuit of consistency. The consistency is carried by the height."*
- **Do not bring back `RING_ASPECT`** or any other coupling of height to width.
- **Do not put a mark in the loupe to say a box could not fit.** `CONTRACT.md` §6.
- **Do not commit and do not stage.**

---

## 5. DEFINITION OF DONE

1. Gate 3 `svelte-check` at baseline, gate 4 at its current number, all five gates at
   baseline.
2. **The page's rendered output is unchanged.** Same method stage 3a used.
3. **Across all 17 held-able measures of `sunless-01-engraved.musicxml`, the loupe's ring
   height is one number**, and that number equals the page's ring height for the same
   note. Report both, per measure, in the memo, from a run.
4. Every ring is closed, with no truncation, on all 17.
5. Report the tallest loupe render the change produced, and whether any measure needed
   more vertical room than stage 3b's spacing gave it.

---

## 6. WHAT YOU COULD NOT ESTABLISH

Fill this section. **NOT ESTABLISHED beats a complete invented answer.**

At minimum, say whether the IPA baseline came out identical on every measure, and what
happens on a measure with no underlay at all.

---

## 7. RETURN MEMO

`docs/sessions/memo-n141-loupe-ring-height_r1_2026-09-20.md`. Short. What changed by file
and line range, the two tables from section 5 item 3, and section 6.
