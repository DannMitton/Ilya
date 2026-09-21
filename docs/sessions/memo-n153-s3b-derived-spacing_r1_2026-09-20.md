# MEMO — N.153 stage 3b. The loupe derives its own spacing, on one measure

**Written 2026-09-20 by Code, in answer to `brief-n153-s3b-derived-spacing_r1_2026-09-20.md`. Tree read at `a1cd0dd`. Nothing is staged and nothing is committed.**

**Status: built, verified in the browser at 390 px and 1440 px, all five gates at baseline (gate 4 is now 1342). Not walked by Dann.**

## 1. What changed

Three files. No file in `packages/`, `VoiceProfilePane.svelte` or `+page.svelte` is touched.

**`apps/web/src/lib/shane/loupe-render.ts`**

- Lines 1 to 25: the module head now states why the render passes no `targetWidth` (the single `stretch` scalar, and why advances are monotone in `minGap` at natural width).
- Lines 71 to 151: `renderLoupeMeasure(bundle, m, minGap)` renders `renderSystemSlice(m, m)` at natural width, `pxPerWhole` held at the page's, `targetWidth` deleted from the options. `deriveMinGap` is the search: probe the page's `minGap`, probe a ceiling, bisect between them. `TAP_FLOOR_PX = 44`.
- Lines 153 to end: `renderLoupeSystem` (stage 3a) stays, marked as no longer called by `Loupe.svelte`. It is the only place this module passes `targetWidth`. The 3a proof tests still use it.

**`apps/web/src/lib/shane/Loupe.svelte`**

- 24, 31: imports. `windowScale` and `nextIds` are no longer used.
- 690 to 720: `spacingCache`, `fingerprint`, `worstSeparation`, `offendingPairs`.
- 753 to 812: the page's own system width gives `unitPx`. The render is one measure, so the render's width no longer says how large the page's notation is. Everything from the render to the frame now sits in an `attempt(minGap, derive)` closure. The early `frame = null; return` exits became `return null`.
- 1215 to 1226: **the scale is no longer fitted.** `scale = unitPx * magnification`. The `fitWidth` clamp is gone. The window height follows (line 1880).
- 1343 to 1364: the squircle is made from the mounted render by `ringBox`, in the loupe's coordinates.
- 1519 to 1712: the caret placement is wrapped in `placeMarks`. A derivation attempt runs it once with no selection and once per entry.
- 2132 to 2224: the search, its cache, the console reports, and the final draw.
- 2804 to 2816: `.loupe-window` is `overflow-x: auto`, `overflow-y: hidden`, `touch-action: pan-x`, `justify-content: safe center`, no visible scrollbar.

**`apps/web/src/lib/shane/loupe-render.test.ts`** adds 9 tests: every measure renders alone and carries no other measure's ids; width is non-decreasing in `minGap` on all 18 measures; the search's five behaviours.

**`~/Downloads/ilya-ship.sh:79`**: gate 4 is now `1342 passed (1342)`. The original is `ilya-ship.sh.bak-gate4-1333-2026-09-20`. New tests: 9.

**Design decisions, all DESK DEFAULT, all reversible**

- **The search is a bisection.** The ceiling is 4 times `max(page minGap, 44 / scale)`, resolution 0.5 native units, budget 14 renders. Every measure took 11 renders at phone width and 10 at 1440 px, about 30 to 37 ms per measure at 1440 px. A tighter ceiling would save a render or two, but the widest answer (82.16, m. 5) is 65 percent of the ceiling, so I did not narrow it.
- **The search is independent of the selection.** It measures the worst separation over "nothing taken" and over every entry taken in turn, because the squircle moves the caret beside the taken note. My first version measured ink only. In the browser the real draw then came out at 36.9 to 40.8 px on m. 2 to m. 7 with the first note taken, under the floor. That version is not what shipped.
- **The answer is cached** on the measure's drawing at the page's spacing plus the page's scale, not on the bundle. The bundle is a new object whenever the page redraws, which a selection causes. Keyed on the bundle, the search re-ran on every raise (measured).

## 2. The five numbers

**1. `tsc`.** There is no root `tsc` script (`pnpm tsc` answers `Command "tsc" not found`). Gate 3, `svelte-check`, is the type check: `found 0 errors and 12 warnings in 5 files`, the baseline.

**2. Gates.** 216 and 235 unchanged. Gate 3 as above. Gate 4 `1342 passed (1342)`. Gate 5 `575 passed | 5 skipped (580)`.

**3. Page and print byte-identical.** `git diff HEAD -- packages apps/web/src/routes apps/web/src/lib/shane/VoiceProfilePane.svelte` is empty. `paginateScore`, `renderAnalyzedStaff` and `renderSystemSlice` are unedited, so their output cannot differ. **I did not re-run stage 3a's 8-layout hash comparison.** The 3a tests, which compare the render against `paginateScore` at 64 page widths, still pass unmodified.

**4. Every measure, phone width (390 x 844), per measure.** All 17 held-able measures (m. 0 carries no entry and opens no loupe) converged. No cap was reached and no console warning fired. "Search worst" is the worst separation over every possible selection, at the derived spacing. "Drawn" is measured off the DOM with the first note taken and the carets open.

| m. | `minGap` (page 14) | renders | search worst px | drawn px | strip px (window 277) |
|---|---|---|---|---|---|
| 1 | 69.41 | 11 | 44.1 | 58.87 | 609 |
| 2 | 54.69 | 11 | 44.2 | 47.34 | 572 |
| 3 | 58.82 | 11 | 44.1 | 49.26 | 484 |
| 4 | 66.91 | 11 | 44.1 | 57.47 | 595 |
| 5 | 82.16 | 11 | 44.0 | 68.82 | 787 |
| 6 | 69.65 | 11 | 44.1 | 58.80 | 609 |
| 7 | 69.33 | 11 | 44.0 | 58.11 | 679 |
| 8 | 68.39 | 11 | 44.0 | 58.21 | 600 |
| 9 | 57.70 | 11 | 44.1 | 44.61 | 473 |
| 10 | 72.79 | 11 | 44.1 | 66.98 | 636 |
| 11 | 66.19 | 11 | 44.1 | 55.00 | 584 |
| 12 | 66.50 | 11 | 44.1 | 55.37 | 587 |
| 13 | 61.16 | 11 | 44.0 | 49.97 | 494 |
| 14 | 61.16 | 11 | 44.0 | 49.97 | 555 |
| 15 | 65.56 | 11 | 44.1 | 58.36 | 646 |
| 16 | 55.81 | 11 | 44.0 | 44.03 | 343 |
| 17 | 66.82 | 11 | 44.0 | 57.73 | 516 |

Worst measure for iterations: all tied at 11. Widest `minGap` asked for: **82.16, m. 5.** Worst drawn separation on the fixture: **44.03 px, m. 16.** The 2026-09-18 baseline was 1.13 to 7.89 px. The "search worst" column is rounded to one decimal and the search tests `>= 44` on the unrounded value; the 44.0 entries are at or above the floor, not below it.

At 1440 px the same search asked for `minGap` 28.06 (m. 2), 25.72 (m. 5) and 29.36 (m. 9), in 10 renders each. I sampled three measures there, not seventeen.

**5. The 27 known collisions.** A run of the whole fixture, 99 interior gaps, at the page's `minGap` (14) and at each derived `minGap`, over every selection. A collision is a room, ink to ink or ink to squircle stroke, under a caret's own width, 3.74 units. I did not reproduce the 2026-09-17 list exactly. The scan found **22** ink and squircle collisions before (the memo counted 18) and **11** gaps a beam spans (that memo counted 9).

- **Ink and squircle collisions: 22 before, 0 after.** Every one is closed. Before: `m1-5-4`, `m2-1-2`, `m2-5-8`, `m2-5-4`, `m4-5-4`, `m5-0-1`, `m5-1-4`, `m5-3-8`, `m5-5-4`, `m6-5-4`, `m7-1-1`, `m7-5-4`, `m8-5-4`, `m10-5-4`, `m11-1-1`, `m11-9-8`, `m12-5-4`, `m14-5-4`, `m15-1-2`, `m15-5-8`, `m15-5-4`, `m17-5-8`.
- **Beam crossings: 11 before, 11 after. None is closed, and none can be.** A beam spans the gap between the two notes it joins at any spacing. The gaps: `m2-9-8`, `m4-9-8`, `m5-9-8`, `m6-9-8`, `m8-9-8`, `m10-9-8`, `m12-9-8`, `m14-9-8`, `m15-3-8`, `m17-3-8`, `m17-1-2`. That the caret's drawn extent touches the beam at each is **not measured**; I measured only that a beam spans the gap.
- **The residue by measure:** m. 2, 4, 5, 6, 8, 10, 12, 14, 15, 17.

## 3. What I could not establish

**Departures from the brief, quoted as asked.**

- **Section 5.5, "both crops go", is not done.** I kept the head panel and the carry panel. The meter panel stands between the key signature and the first note, on one horizontal strip, so the clef and key must be a panel of their own to the left of it. Deleting them would put the meter before the clef. They are still crops of the one-measure render, no longer of the system's. The brief said to leave the meter panel; its position is what forces this. Removing them needs the meter drawn inside the render, which is a different change. If the desk wants it, that is a decision for Dann.
- **Section 5.6, "do not silently re-point" the squircle.** I re-pointed it, loudly, in the comment at `Loupe.svelte:1343`. Stage 3a's page ring stands where the page's note stands, and the loupe's note is now elsewhere. The box is made by `ringBox` from the mounted render.

**Whether the loop converged on every measure.** Yes on 17 of 17 at phone width, and on the three sampled at 1440 px. The cap never fired, so the cap and the console report were **exercised only by unit test**, not against a real measure.

**Whether removing the `fitWidth` clamp broke a layout I did not expect.** Not seen. **NOT ESTABLISHED** for landscape, tablet, or a phone with the drawer open. I looked at m. 5 (the widest strip) at 390 px, scrolled to both ends: the closing barline and the tail stave meet with no seam. Real swipe gestures on a touch device were not tried; the pane emulates a viewport, not touch.

**What now scrolls.** All 17 strips exceed the 277 px window at phone width (the narrowest is 343 px, m. 16). The swipe that dismisses is vertical and `touch-action: pan-x` on the window takes only the horizontal pan, but I did not test a real thumb. **N.140's open question stands**: whether a horizontal gesture may belong to the scroll on a surface where a tap places a syllable.

**Page coordinates feeding a loupe calculation, beyond the squircle.**

- `pageMetrics(container)` (`Loupe.svelte`, the crop's vertical band) reads the page's ink. It is offsets from the staff, and `lineGap` is the same in both, so it holds, but I did not test it against a measure whose ink is taller than any on its page system.
- `pageSys`'s width and bounding box give `unitPx`. That is deliberate and now correct: it is the page's scale.
- `ranges` (system count in the tag) reads the page. It feeds text only.
- **A difference I did not resolve:** `ringBox` reads the whole system it is handed for the ring's top and bottom, so on a measure whose ink is shorter than its page system's, the loupe's ring is shorter than the page's. Sunless m. 5 looked right; **NOT ESTABLISHED** elsewhere.

**The 27.** See number 5. I could not reproduce 18 and 9 exactly, and I say so above rather than force a match.

**Comment and code disagreements.** `loupe.ts` still cites `staff-renderer.ts` line numbers that are stale, as the brief said; I did not touch them. In `Loupe.svelte` the comments naming `staff-renderer.ts:739`, `:908`, `:541`, `:1007-1011` and `:1382-1512` are stale for the same reason; the substance holds. The comment above the head panel says the head and the body are "TWO VIEWPORTS, ONE CLONE": now one render, not a clone of the page's. I left it.

**Dead exports, for stage 4** (not retired, per section 6): `windowScale` and `PageInk.minTotalSpan`'s use for it in `loupe.ts`; `renderLoupeSystem` in `loupe-render.ts`; the `nextIds` prop on `Loupe.svelte` (still passed by `+page.svelte`, no longer read). `measureWindow` is still called, with no next hits.

## 4. For `docs/memory/ENVIRONMENT.md`

- **A page that answers `500 Internal Error` on `http://sunless.localhost:5173` right after `preview_start`.** Seen once, cleared on the next navigate. Symptom that sends the next session looking: a blank 500 page and no server error in `preview_logs`.
- **`sunless.localhost:5173` already holds a stored song** from earlier sessions (`sunless01.musicxml`), so no upload is needed: reload, click the **Score markup** tab, and the 18-measure fixture is on the page. Symptom: `input.hidden-input` exists but the piece is already loaded.
- **The tag reads `m. 5 · system 2 of 8` with a non-breaking space**, or something a plain `startsWith('m. 5 ')` does not match. Match it with `/^m\.\s*(\d+)/`. Symptom: a raise script that reports `failed` while the loupe is up on the right measure.
- **`read_console_messages` drops all but the newest few hundred messages** on this page (about 570 to 2000 dropped per call). Symptom: a `console.debug` line you know fired is missing. Wrap `console.debug` into a `window` array before the walk instead.
- **After an edit to `Loupe.svelte`, a tab that navigated within a second of the write served the old module** (my scan hook did not run until a second reload). Symptom: a `window` variable the new code should set is `undefined`. Reload once more.
