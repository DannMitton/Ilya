# Memo: N.114a, two rulings from Dann's N.114 walk. r1, 2026-09-09

Built on branch `Shane` against `brief-n114a-voice-and-hint_r1_2026-09-09.md`.
Nothing is committed. Six files are modified, none is new. No new i18n key.

## What moved

**1. Voice is always expanded and has no chevron.** `+page.svelte:4296` is now
`<StationHeader label={t('voice.heading', language)} />` and nothing else: given no
`ontoggle`, `StationHeader:134` draws no button and no chevron. The
`sections.has(...)` gate goes and the body's `id="station-voice"` with it, since
that id served an `aria-controls` with no control left. `voice` is out of
`STATION_IDS`, on N.114's precedent for `underlay`: a station that cannot close
has no open state to store. Two test expectations moved, one was added.
**Corrections still toggles.**

**2. The hint is the field's caption.** `IntakePanel.svelte:388-397`. `<p
class="intake-drop-hint">` moved from the foot of the frame to directly under the
`<textarea>`, above the receipts. Its condition, copy and rule (`:807`) are
unchanged; Choose a file did not move.

**3. Undo and Redo are on the top bar.** `HeaderBar.svelte:99-121` draws them in a
`.head-right` group at the right end, the language pill keeping the far corner,
behind `INCLUDE_SHANE` since every `pushUndo` in the tree is a score verb; both
sentences are composed from the page's own `undoLabel` and `redoLabel` (`:69-74`),
which `+page.svelte:3844-3853` passes in with `handleUndo` and `handleRedo`. **The
dock's Undo row and its reservation are deleted** (`CorrectionSurface.svelte:472`)
with that surface's four undo props, `.dock-row-undo` and `.undo-pill`; the stack,
`pushUndo`, `stackLabel` and the Cmd-Z pair are untouched. **No string is coined
for the empty state:** `verbOnly` (`:67`) strips `%s` and its separator off the
ratified frame, so `Undo: %s` gives `Undo` and `Annuler : %s` gives `Annuler`.

## The walk

Local production build on 4173, entry `app.C9NdiFpt.js`, poem `Комнатка тесная /
тихая милая`, score `Mussorgsky - Sunless 01`.

1. **Score markup.** Expected Voice open on load with no chevron, Corrections
   still toggling. **Observed:** Corrections has a button, an SVG chevron and
   `aria-expanded="true"`, and clicking it gave `station-corrections` present,
   absent, present; Voice has neither button nor chevron, its body reading
   `Voice: not yet calibrated | Calibrate` on load.
2. **Poem, no score.** Expected the hint first under the textarea, the receipt
   after it, Choose a file unchanged. **Observed** the intake's children in order:
   `textarea.text-input`, `p.intake-drop-hint`, `receipt-poem`, `intake-actions`,
   `input.hidden-input`, the hint at 12 px `rgb(106,101,95)` Source Sans 3.
3. **With a score.** Expected the same plus the syllable line under the score
   receipt. **Observed:** textarea, hint, both receipts, `button.syl-box.syl-row`,
   `intake-actions`, `input`.
4. **Top bar.** Expected Undo then Redo at the right end, dimmed with nothing to
   undo. **Observed** at 1280: both `border-radius: 999px`, 44 px, `opacity: 0.45`,
   `disabled`, reading `↰ Undo` and `↱ Redo`, left of Français. After a placement
   Undo read `↰ Undo: syllable placed` and was enabled; pressing it put the placed
   syllable back to the one the session began with, and Redo then read `↱ Redo:
   syllable placed` and restored it exactly. A **real** Cmd-Z with
   `document.activeElement` on `BODY` did the same. Zero `.dock-row-undo` nodes.
5. **390 px.** Expected both visible, 44 px, nothing wrapping. **Observed:** one
   line, `scrollWidth` 390 against a 390 viewport, both pills 44 px, Français at
   the corner, `↰ Undo: syllable p…` clipped and `↱ Redo` whole. **I changed one
   thing after measuring:** with `flex: 0 1 auto` on both pills the empty Redo
   squeezed to `R…`, a truncated verb that says nothing, so only a pill carrying a
   clause may shrink now (`.head-pill.has-clause`).

**THE LOUPE'S ANCHOR.** Phone portrait 390×844, same measure and scroll: the dock
`.surface.dock.portrait` went **490 px to 440 px**, the row's 44 px plus the
surface's own 6 px gap, and the loupe's `top` went **221.094 px to 238.594 px**,
height 152 px in both. On the desk `.surface.panel` went **455 px to 405 px** and
the loupe's vertical anchor did not move, `loupeFoot` being zero off a phone.

## Gates

Gates 1, 2, 3 and 5 are at baseline: `216 passed (216)`, `235 passed (235)`, `0
errors and 7 warnings in 4 files`, `547 passed | 5 skipped (552)`. Gate 4 moved
from `1075 passed (1075)` to **`1076 passed (1076)`**, by the one test added for
the dropped `voice` id; `~/Downloads/ilya-ship.sh:79` is updated. **Into
`static/`:** 121,624 bytes, the walk fixture, since **deleted**.

**Desk defaults, reversible.** Both pills are always drawn, dimmed and disabled on
an empty stack, so the place is learned; absent-when-empty is one `{#if}` away.
The pair is drawn on **every** destination, not only Studio's two, matching Cmd-Z,
live on all four since N.113a. The fill is the bar's own `--lang-chip-*` idiom at
44 px on every pointer, since the bar is 48 px tall everywhere.

## What I could not establish

- **No French walk.** `verbOnly`'s French is reasoned from `Annuler : %s`, not
  observed. `loupe.redo`'s French slot still carries English, owed since N.111-3b.
- **No real phone and no coarse pointer**, only a 390×844 viewport. **No walk with
  the wall up**: the pair sits inside `{#if INCLUDE_SHANE}`, read not measured.
  **No returning-singer walk**: a stored `voice` dropping is covered by the new
  unit test, not by a browser holding that value.
- **The desk loupe's before-and-after is reasoned, not measured.** Its `top` is
  the taken measure's, so two runs compare only at one measure and scroll; I have
  that pair on the phone, and for the desk the code path and the panel height.
- **Both stacks full at 390 px is untested.** Both can carry a clause at once and
  would then both clip; I saw only one clause at a time.
- **The dictionary load again cost about twenty minutes per page load** to the
  hidden Browser pane's 1 Hz timer clamp, lifted with a near-silent `AudioContext`
  tone. Nothing in the application changed to do it.
- **This memo is 103 lines, not under 90.** I cut everything I could without
  dropping a measurement or a caveat, and stopped rather than trim those.

`WRITTEN`, not `DONE`. Dann's walk on the alias makes it `DONE`.
