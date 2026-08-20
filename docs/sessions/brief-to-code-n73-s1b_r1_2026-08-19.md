# Brief to Code: N.73 S1b, four fixes from Dann's walk

**Item: N.73 S1b. Serves N.42.** Floor `9b2af02`. Four changes, no new features.
Re-derive every line number before you edit.

---

## 1. The paper lost its edge on the phone

**Cause, measured:** S1 changed the desk from `#6B6560` to `#D1D7CB`. Against
cream paper `#F0EBE0` that is a drop from 4.85:1 to 1.24:1. On the phone the
paper runs edge to edge, so its boundary disappears and it reads as a flat box.

**Fix:** strengthen the paper's shadow. `TitlePage.svelte` and
`SubsequentPage.svelte` carry `box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1)` on
`.paper-page`. Take it to `0 3px 12px rgba(0, 0, 0, 0.35)`, the value the
portrait C mockup uses (`docs/sessions/fable-gui-mockup_r2_2026-08-18.html`,
`.fitpage`).

**Do not add a border.** "No edge" is Dann's ruling. The shadow is the only
instrument.

Report the sheet-against-desk contrast at the shipped hexes.

## 2. The marked score carries lavender again

**Ruled by Dann 2026-08-19 during the walk.** Every distinct working surface
carries its own hue. This amends S0 ruling 3 and the app-bar half of the
2026-08-18 ruling 6.

- `HeaderBar.svelte:95`: revert `.tab-shane` from sage to `--deeper-lavender`
  `#8E7E9B`. The three sibling rules at `:154-156`, `:198-200`, and `:221-223`
  are correct as they stand. Leave them.
- `app.css`: add a new desk token for the marked score, `#D2CBD7`, which is
  `--deeper-lavender` tinted 60 percent toward white, parallel to the other
  three desks. **Name it something other than `--surround-shane`**: that token
  is the calibration pacifier band and `contrast.test.ts:428` asserts its
  literal.
- `+page.svelte`: `.main-content.tab-shane` currently takes the transcription
  surround. Point it at the new token. The July "one desk, many papers" comment
  in that block is superseded; rewrite it to cite this ruling.

The four surfaces, for reference:

| surface | banner | desk |
|---|---|---|
| Transcription | `--sage` `#8B9A7D` | `#D1D7CB` |
| Marked score | `--deeper-lavender` `#8E7E9B` | `#D2CBD7` |
| Learn | `--dusty-rose` `#A67B7B` | `#DBCACA` |
| Guide | `--quiet-cobalt` `#5C739E` | `#BEC7D8` |

Report the desk-head ink and card contrast on `#D2CBD7`.

## 3. The drawer tab is too fat on the phone

`Drawer.svelte:554` paints the tab 20 px wide on a fine pointer.
`:585-588` grows the whole visible tab to 44 by 88 on a coarse pointer, which
takes 11 percent of a 390 px screen.

**Fix:** keep the visible tab at 20 px on every pointer. Carry the touch target
to 44 by 88 with a transparent extension, a `::before` or padding, extending
into the desk rather than off-screen.

The target stays 44 px, so this creates no touch-geometry exemption. Say in your
memo what you used and how you confirmed the target's real size.

## 4. Learn and Guide get the transcription's margins

Dann's request: the negative space either side of the sheet should match across
destinations.

`ReadingPaper.svelte:20-25` sets `max-width: 720px` and `padding: 3rem 2rem`.
The transcription page is 816 px wide with 96 px horizontal margins
(`page-config.ts:18`, `:24`).

**Fix:** `max-width: 816px`, `padding: 3rem 96px`. The prose column lands on
624 px, which is exactly the transcription's text column, and the reading
measure gets shorter rather than longer.

**Also:** `border-radius: 4px` on `.reading-paper` goes to `0`. Paper takes no
radius because print has no rounded corners (Fable's ruled spec §3.2). Match its
shadow to the paper's new value from §1.

Learn and Guide share this component, so one change covers both.

---

## What you do not do

- No new features, no drawer surgery, no portrait C, no stations.
- Do not put a control on the paper.
- Do not run `git`. Dann ships.

## Definition of done

Your own local walk, then Dann's on the deploy:

1. The paper reads as a sheet on the phone in portrait.
2. The marked score's bar and desk are lavender; the other three are unchanged.
3. The drawer tab is thin on the phone and still opens on a first press.
4. Learn, Guide, and Transcription have identical margins either side of the sheet.

Run all five gates and report the numbers. Baselines: phonology 216,
dictionary 235, web-check 0 errors and 7 warnings in 4 files, web-test 671,
score-parser 444 passed and 5 skipped.

Ship with `sh ~/Downloads/ilya-ship.sh "N.73 S1b: the paper's edge, lavender for
the marked score, a thinner pull, and matched margins"`.

## The memo

`docs/sessions/n73-s1b_r1_2026-08-19.md`, same commit. Keep it short: what
shipped, the contrast numbers, where the tree beat this brief, the gate numbers,
and what Dann must walk.
