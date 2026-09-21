# MEMO — N.141. The loupe's squircle takes its height from the page's system

**Written 2026-09-20 by Code, in answer to `brief-n141-loupe-ring-height_r1_2026-09-20.md`. Tree read at `2b980e7`. Nothing is staged and nothing is committed.**

**Status: built and measured at 390 px on all 17 held-able measures. All five gates at baseline, gate 4 unchanged at 1342 (no test added). Not walked by Dann.**

**One finding changes how to read section 5 item 3 of the brief: the page's own ring height is not one number across the score. It is 70, 74 or 63 units, by system. The loupe now matches the page on every note; it is not one number across measures, because the page is not.** Section 2 gives the tables.

## 1. What changed

- **`apps/web/src/lib/shane/selection-ring.ts`**
  - 228 to 320: `RingSpan`, and `systemSpan`, the top and bottom arithmetic moved out of `ringBox` whole, order unchanged.
  - 321 to 328: `ringSpanOf(sysEl)`, the page's span for one system as offsets from the staff's top line.
  - 329 to 336, 393 to 410: `ringBox` takes an optional fourth argument, `span`. Absent, it calls `systemSpan` and is what it was. Present, `top` and `bottom` come from the span with **no clamp against the loupe's viewBox**. Where the page's system has no underlay, `span.bottom` is null and the ring keeps the note's own bottom, unclamped.
- **`apps/web/src/lib/shane/loupe-render-bundle.ts`** 14 to 34: `ringSpans`, a map from a page system's `data-system` range to its `RingSpan`.
- **`apps/web/src/lib/shane/VoiceProfilePane.svelte`** 88, 859 to 891: inside the untracked page-rebuilt effect, one `ringSpanOf` per page system, handed on in the bundle.
- **`apps/web/src/lib/shane/Loupe.svelte`** 766 to 770: `pageSpan`, read from the bundle by the held measure's own `pageSys`. 1359 to 1368 and 1701: both `ringBox` calls (the drawn ring, and the derivation's per-entry rings) pass it. The stage 3b comment that named this difference as unestablished is replaced.
- **`apps/web/src/lib/shane/loupe-render.test.ts`** 46: the test bundle carries an empty `ringSpans`.

The width is untouched. There is no `RING_ASPECT`, no mark in the loupe, and no clamp.

## 2. The two tables (section 5 item 3), from a run

Phone width (390 x 844), `sunless-01-engraved.musicxml`, **every one of the 97 notes** on the 17 held-able measures, each raised by a click on its page note. "Page" is the `height` of the page's own `rect[data-selection-ring]`. "Loupe" is the loupe's ring rect height divided by the loupe's scale, in the same units.

**Table 1. Height, per measure.** Page and loupe heights agree on all 97 notes; the largest difference is 0.

| m. | notes | page height | loupe height |
|---|---|---|---|
| 1, 2 | 6, 6 | 70 | 70 |
| 3 to 15 | 6 each | 74 | 74 |
| 16 | 3 | 63 | 63 |
| 17 | 4 | 63 | 63 |

**Table 2. Where the page's height comes from, per page system** (`ringSpans`, offsets from the staff's top line, units):

| system | top | bottom | height |
|---|---|---|---|
| 0-2 | -16 | 54 | 70 |
| 3-5, 6-7, 8-9, 10-11, 12-13, 14-15 | -20 | 54 | 74 |
| 16-17 | -9 | 54 | 63 |

**So the loupe's ring height is one number per page system, as the page's is, and not one number across 17 measures.** The brief's wording asked for one number and for equality with the page. Those cannot both hold, because the page's height moves with each system's highest ink (its top). I chose equality with the page: it is the ruling (*"A singer learns one shape and meets it twice"*), and one number across systems would make the loupe differ from the page. **If Dann wants one height across the whole score, that changes the page's ring too, and section 4 forbids that.**

**Every ring is closed on all 97 notes.** The nearest a ring's stroke comes to the top of the loupe's drawing is 2.9 px (systems 3-5 to 14-15, whose top is -20), and to the bottom 20.9 px. No truncation.

**Tallest loupe render this change produced: the strip is 101.18 px tall (m. 3 to 5; 100.2 to 101.2 across the fixture).** **No measure needed more vertical room than stage 3b's drawing gave it, so nothing was extended.** The loupe's vertical crop is the page's ink band with the ring's reach already added above (`ringRoom`), not the render's viewBox, so the render's own viewBox never bounded the ring. The brief's fallback (stop and say the viewBox is not enough) was not needed.

## 3. The page path is unchanged

- `git diff HEAD -- packages` is empty. The score parser and renderer are untouched.
- **Method, run on the live page:** I loaded the pre-change `selection-ring.ts` from `HEAD` as a second module beside the new one, and called both `ringBox` functions, without a span, on every note of the page. **97 of 97 boxes are identical**, compared as JSON (x, y, width, height).
- Gate 5 (score parser) is `575 passed | 5 skipped (580)`. Stage 3a's 8-layout page hash comparison was **not** re-run; the module comparison above is the proof that stands here.

## 4. Gates

`216 passed`, `235 passed`, `svelte-check found 0 errors and 12 warnings in 5 files`, `1342 passed (1342)`, `575 passed | 5 skipped (580)`. No test was added, so `ilya-ship.sh` stays at 1342. `ringBox` reads layout (`getBBox`, canvas text metrics), which vitest's node environment cannot supply, so the proof above is a browser run rather than a unit test. **If Dann wants a regression test, it needs a browser test runner this repo does not have.**

## 5. What I could not establish

- **Whether the IPA baseline came out identical on every measure.** **NOT ESTABLISHED as a comparison.** The loupe no longer reads its own render's IPA baseline for the ring; it takes the page's. What I can say: the page's bottom is 54 on all 8 systems, so the page's own IPA baseline row sits at one offset from the staff everywhere on this fixture. I did not read the one-measure renders' baselines against it.
- **A measure with no underlay at all.** **NOT ESTABLISHED, not exercised.** Every sung measure on this fixture has underlay, and m. 0 carries no entry. The code path: if the page's system has no underlay, `span.bottom` is null and the loupe uses the note's own bottom plus `RING_PAD_Y`, as the page does, but **unclamped**, where the page clamps to its own viewBox. On a page system with no underlay at all this could differ from the page by the clamp. I did not observe a case.
- **A page system whose held measure has no page ring entry.** `ringSpans` has no entry for a system with no `[data-hit]`, and the loupe then makes the ring as before (from its own render). No such system exists on the fixture.
- **Landscape, tablet, desktop width.** Measured at 390 px only. The height is in the page's own units and does not depend on the loupe's scale, so I expect it to hold, but I did not measure it.
- **The first pass showed a mismatch I did not chase.** A run before a reload showed loupe heights of 74, 74, 74 and 68.5 against page heights of 70, 70, 74 and 74. The page then served an older module; after a reload every note matched. I believe the mismatch was the old code, which is consistent with the brief's account of the defect, but I did not confirm which module served it.

## 6. For `docs/memory/ENVIRONMENT.md`

- **`[data-note-selected]` matches two elements on the page: the ring `rect`, first, then the note's `g`.** A script that reads `querySelector('[data-note-selected]').getAttribute('data-event-id')` gets null. Use `g[data-note-selected]`. Symptom: a raise script that reports failure while the loupe is up on the right note.
- **The first hit of every measure on this fixture is a rest with no `[data-event-id]` group, so it has no ring.** Filter `[data-hit]` on `.closest('[data-event-id]')` before stepping through notes. Symptom: `ringBox` and the page ring both absent for `m1-0-1`.
- **`import('/src/lib/shane/<file>.ts')` from `javascript_tool` loads a dev-server module,** so a `HEAD` copy written beside the working one as an untracked file can be compared in the page against the current one. Delete it afterwards. Symptom: you need before and after of a pure DOM function with no browser test runner.
