# MEMO: N.77 ship 4, the drawer's rules, then the button sizes

Code, 2026-08-21. Answers `docs/sessions/brief-n77-ship4-rules-and-buttons_r1_2026-08-21.md`.
Read and built in the tree at `a1b5774`, branch `Shane`. The working tree is
dirty with `apps/web/src/lib/components/Drawer/RootPanel.svelte`,
`apps/web/src/lib/components/Drawer/VoiceAnchor.svelte`,
`apps/web/src/routes/+page.svelte`, and this memo.

---

# PART A. The drawer's station rules

## What changed

### What was drawing the second mark, named

**`Drawer.svelte:839`.** `.drawer-anchor-top` carries
`border-bottom: 2px solid var(--sage)`. That box holds the pinned Metadata and
Notation block (`Drawer.svelte:310-313`), so its bottom border is the boundary
above whatever station is first in the scroll.

Measured on the built phone before any change, with every station shut: two
marks at the **identical y**, 61.6 on the phone and 109.6 on the desk.

* `2px rgb(139, 154, 125)`, bottom of `div.drawer-anchor.drawer-anchor-top`
* `2px rgb(139, 154, 125)`, top of `div.section.song-section.shut`

Same colour, same span, no gap between them. They paint as one 4px rule, which
is Dann's thicker line. The second is `.section`'s own `border-top` at
`RootPanel.svelte:918`.

### The fix

* `RootPanel.svelte:974-994`. The exemption moved from `.source-section` to
  `.song-section`. Source gets `.section`'s standard 2px sage rule back by
  losing its exemption rather than by gaining a declaration, and Repertoire
  stops drawing a second mark under the anchor's.
* `RootPanel.svelte:974-991`. The comment is rewritten, not deleted. It keeps
  the original reasoning about the double line, names `Drawer.svelte:839` as
  the rule that already draws that boundary, records that the Repertoire move
  of `a1b5774` left the exemption behind, and states the rule going forward:
  the exemption follows the position, not the station.
* `RootPanel.svelte:958-969`. The list that names which stations draw a rule
  read "Notation, Repertoire and Analysis draw a `border-top`; Metadata and
  Source do not". It now reads "Notation, Source and Analysis draw a
  `border-top`; Metadata and Repertoire do not", names where each exempt
  station's rule comes from instead, and records that the list was correct when
  written and went stale with the move.

No value was invented. Every station rule is still `2px solid var(--sage)`.

## Part A's six conditions, as observed

Method: `pnpm --filter @ilya/web build`, then
`cd apps/web/build && python3 -m http.server 4200`. Headless Chromium under the
repository's own Playwright. The drawer opened by its lip, every station shut,
then every painted horizontal border inside the drawer enumerated with its
computed width, colour, y, and owning element. A station's boundary is the top
edge of its own box, matched within 1px.

### 1. The six rendered rule heights, with every station shut

| header | marks | weight | drawn by |
|---|---|---|---|
| METADATA | 0 | **0px** | nothing |
| NOTATION | 1 | **2px** sage | own `border-top`, `NotationFields.svelte:225` |
| REPERTOIRE | 1 | **2px** sage | `.drawer-anchor-top`'s `border-bottom`, `Drawer.svelte:839` |
| SOURCE | 1 | **2px** sage | own `border-top`, `RootPanel.svelte:918` |
| ANALYSIS | 1 | **2px** sage | own `border-top`, `RootPanel.svelte:918` |
| SHIFT LYRICS | 1 | **2px** lavender | own `border-top` |

Five of the six are equal at 2px. **METADATA is the one that is not, and it
carries no rule at all.** That is its ruled state, not a defect:
`MetadataFields.svelte:166-173` declares `.section` with no `border-top`, and
its comment gives the reason, that Piece is the first station and the drawer
header already bounds it. It measured 0 marks before this change too.

Identical on the phone at 360px and the desk at 1440px, in English and in
French.

### 2. There is a rule between REPERTOIRE and SOURCE

Before: SOURCE's own boundary carried **0 marks**. The nearest mark above it was
Repertoire's, about 32px up, which is why the two read as one block.

After: SOURCE's boundary carries **1 mark, 2px `rgb(139, 154, 125)`**, the top
border of `div.section.source-section.shut`.

### 3. REPERTOIRE matches NOTATION

Before: REPERTOIRE **2 marks, 4px total**. NOTATION **1 mark, 2px**.

After: REPERTOIRE **1 mark, 2px `rgb(139, 154, 125)`**. NOTATION **1 mark, 2px
`rgb(139, 154, 125)`**. Same weight, same colour, same span.

### 4. SHIFT LYRICS keeps its lavender

**1 mark, 2px `rgb(142, 126, 155)`**, which is `--deeper-lavender`. Untouched at
both widths in both languages.

### 5. The control

**I could not build `2b81f5a`, and I could not build `2b85d13` either, because
both need a `git` checkout and the brief forbids running `git`.** So I built the
next best thing and say exactly what it is: I reversed the Repertoire move in
the working tree, putting the block back below the binder row and the exemption
back on `.source-section`, which is the drawer's arrangement as Dann walked it.
Measured, then restored from a checksummed snapshot
(`11e38e132b5be8c7241196bf2e410cfe`, verified after restoring) and rebuilt.

| header | control | this build |
|---|---|---|
| METADATA | 0 marks | 0 marks |
| NOTATION | 1, 2px sage, own top | 1, 2px sage, own top |
| first in the scroll | SOURCE: 1, 2px sage, anchor's bottom | REPERTOIRE: 1, 2px sage, anchor's bottom |
| second in the scroll | REPERTOIRE: 1, 2px sage, own top | SOURCE: 1, 2px sage, own top |
| ANALYSIS | 1, 2px sage, own top | 1, 2px sage, own top |
| SHIFT LYRICS | 1, 2px lavender, own top | 1, 2px lavender, own top |

One mark, one weight, at every boundary in both, with the anchor drawing for
whichever station is first in the scroll. **The two builds differ only in which
of Source and Repertoire occupies which position**, which is the deliberate
order change.

### 6. Both languages, desk and phone

Every number is from four runs: 360px and 1440px, English and French. The six
rows are identical across all four.

---

# PART B. Button sizes

## What changed

* `+page.svelte:2809-2821`. `.sheet-print-btn` takes the model's two size
  declarations: `font-size` 0.7rem to **0.8rem**, `padding` `0.3rem 0.7rem` to
  **`0.45rem 0.5rem`**. `+page.svelte:2798-2808` records why only those two
  moved. Nothing else was opened: the uppercase, the 0.1em tracking, the 600
  weight, the ink border, the transparent fill, `.sheet-print`'s layout rules,
  and the `@media` blocks are all as they were.
* `VoiceAnchor.svelte:78-84`. `.voice-line` becomes
  `display: grid; grid-template-columns: 1fr 2fr; gap: 6px`, the same
  declaration `.source-actions` carries at `RootPanel.svelte:853-857`.
* `VoiceAnchor.svelte:57-66` and `:96-101`. The dot and the sentence are wrapped
  in a new `.voice-state` span, a flex row keeping their existing 8px gap.
  **A grid gives each child its own cell, and `.voice-line` had three children,
  so without a wrapper the button would have dropped to a second row.** No
  string was touched and no value invented.
* **`New song` was not changed. It did not need to be.** See condition 1.

## Part B's four conditions, as observed

### 1. The five quiet buttons

Rendered heights, desk 1440px, English, every station open:

| button | before | after |
|---|---|---|
| `Clear text` | 34.38px | 34.38px |
| `New song` | **34.38px** | 34.38px |
| `Export this song` | 34.38px | 34.38px |
| `Import a song` | 34.38px | 34.38px |
| `Print` | **26.59px** | **34.38px** |

**THE BRIEF'S PREMISE ABOUT `New song` IS WRONG, AND MEASUREMENT IS HOW I KNOW.**
The brief read the model as `border: none` from `.action-btn`
(`RootPanel.svelte:867-876`) and concluded that `.new-btn`'s
`border: 1px solid var(--stone-600)` adds 2px. But `.btn-ghost`
(`RootPanel.svelte:878-881`) overrides that with the same
`border: 1px solid var(--stone-600, #57534e)`. `Clear text` is
`.action-btn.btn-ghost`, so it already carries the 1px border. The two recipes
are identical, and both measured 34.38px before I touched anything.

So nothing was removed and nothing was compensated for. The border stays,
because there was never a height to reconcile. **The brief's instruction to stop
and report rather than remove the border did not arise.**

`Export` and `Import` share the model's recipe exactly, as the brief said.
Rendered widths, both languages: **158px each on the desk**, **83.33px each at
360px**. `Clear text` renders 160px on the desk and 85.33px at 360px, because
`.output-row` is `repeat(3, 1fr)` and `.source-actions` is `1fr 2fr`. Neither
grid was touched.

**One height caveat, and it is text wrapping, not recipe drift.** At 360px the
drawer is narrow enough that some labels wrap to two lines and the button grows
to 52.38px: `Export this song` and `Import a song` in both languages, and in
French also `Effacer le texte` and `Transcrire`. The recipe is identical in
every case; the box is taller because the label takes two lines. Curing that
means changing the grids or the strings, both ruled out of this ship.

### 2. `Calibrate` against `Transcribe`

| | `Transcribe` | `Calibrate` before | `Calibrate` after |
|---|---|---|---|
| 360px | 170.67px | 72.14px en / 66.30px fr | **170.67px** |
| 1440px | 320px | 72.14px en / 66.30px fr | **320px** |

Exact, in both languages, and by construction: `.voice-line`'s computed
`grid-template-columns` reads `85.3281px 170.672px` at 360px and
`160px 320px` at 1440px, which are `.source-actions`'s own two columns.

Heights are not equal and were not asked to be: `Transcribe` is 34.38px and
`Calibrate` 32.38px, unchanged by this ship. Their line boxes differ by 2px.

### 3. The voice status sentence at 360px, and it is a regression

**Neither string wraps. Both are truncated, which is worse.** `.voice-status`
carries `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`
(`VoiceAnchor.svelte`), so a narrower column clips rather than reflows.

| | column | box for the sentence | sentence needs | result |
|---|---|---|---|---|
| 360px en | 85.3px | 67.3px | 119.5px | **truncated by 52.2px**, 1 line |
| 360px fr | 85.3px | 67.3px | 125.2px | **truncated by 57.9px**, 1 line |
| 393px en | 96.3px | 78.3px | 119.5px | truncated by 41.2px, 1 line |
| 393px fr | 96.3px | 78.3px | 125.2px | truncated by 46.9px, 1 line |
| 1440px en | 160px | 142px | 119.5px | fits, 1 line |
| 1440px fr | 160px | 142px | 125.2px | fits, 1 line |

**On the phone it reads `Voice: not …`.** Screenshotted. The state the sentence
exists to report is gone.

Built and reported as instructed. No string was shortened and no value invented.
**This is Dann's to rule**, and there are three ways out that I did not take:
let the sentence wrap by dropping `white-space: nowrap` inside the grid cell,
keep the flex row below the mobile breakpoint and take the `1fr 2fr` on the desk
only, or accept the truncation. Each is a few lines.

### 4. All five gates at baseline

| gate | baseline | observed |
|---|---|---|
| phonology | 216 | `216 passed (216)` |
| dictionary | 235 | `235 passed (235)` |
| web-check | 0 errors, 7 warnings, 4 files | `found 0 errors and 7 warnings in 4 files` |
| web-test | 682 | `682 passed (682)` |
| score-parser | 444 passed, 5 skipped | `444 passed | 5 skipped (449)` |

---

# What I could not establish

* **The `2b81f5a` control could not be built, and `2b85d13` could not either.**
  Both need a `git` checkout. What I measured instead is a reconstruction of the
  pre-move drawer in the working tree, described in Part A condition 5. It
  reproduces the arrangement, not the commit: anything else that changed between
  `2b81f5a` and `a1b5774` is still present in it. **NOT ESTABLISHED that this
  build matches `2b81f5a` byte for byte in the drawer**, only that the six
  boundaries carry the same one mark at the same weight.
* **The phone was measured, not held.** 360px and 393px Chromium viewports, not
  Dann's device. His two reports reproduce exactly at those widths.
* **I found one doubled mark and I looked only at the drawer.** The enumeration
  covered every element inside `.drawer` with a painted top or bottom border,
  with every station shut. **It did not cover the drawer with stations OPEN**,
  where a station body may draw marks I did not survey. NOT ESTABLISHED.
* **METADATA's 0px is reported, not reconciled.** Condition 1 asked for six
  equal numbers and five of them are equal. I did not add a rule above Metadata,
  because `MetadataFields.svelte:166-170` rules that it has none and this brief
  does not overturn that. If Dann wants six marks rather than five, that is a
  ruling, not a repair.
* **`.new-btn`'s computed `min-height` reads `0px` where the model reads
  `auto`.** It changes nothing at these sizes, both render 34.38px, and I did
  not trace where the `0px` comes from. Recorded rather than chased.
* **Print was measured on the desk and the phone at browser default zoom, and
  its `@media print` rule hides it.** I did not check its size in a print
  context, because it does not appear in one.
* **I did not measure the voice status against a calibrated voice.** Every
  reading is the uncalibrated string. A voice NAME could be longer or shorter,
  and `.voice-status`'s own comment says a long name must never push the control
  off the line. In the grid it cannot, but the truncation would be worse.
  NOT ESTABLISHED for the calibrated states.

**I did not run `git`, and nothing is committed or staged.**

---

## CORRECTION, appended by the desk 2026-08-21, on Dann's ruling

**The `Calibrate` change in Part B was REVERTED before this shipped, and this
memo's Part B overstates what is in the commit.**

Dann's words, after reading the truncation measurement: *"Leave Calibrate the
size it is, the colour contrast between it and the surrounding sage is
sufficient."*

So `VoiceAnchor.svelte` was restored to its state at `a1b5774`. `.voice-line`
keeps its flex row, `.voice-status` keeps its full sentence at every width, and
there is no `.voice-state` wrapper. **`Calibrate` does not match `Transcribe`'s
width, and it is not meant to.**

**The measurement that produced the ruling stands and is worth keeping.** At
360 px the status box is 67.3 px against a sentence needing 119.5 px in English
and 125.2 px in French, so the grid truncated it to `Voice: not …`. That is why
the pairing was dropped rather than adjusted.

Everything else in this memo is as shipped: Part A whole, and in Part B only
`Print` moved, 26.59 px to 34.38 px.
