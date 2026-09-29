# Brief for Code: Corrections keeps one fixed size

Written by the desk 2026-09-28 20:05. Draft r1. Queued after Correction Station
slices 4 to 6 (DESK DEFAULT: those slices restructure the same panel; if they have not
started when this reaches you, say so and the desk will reorder).

## The singer's finding, in Dann's words

2026-09-28 16:37, looking at the loupe's Corrections panel on a wide measure: *"I think
the appearance of Corrections in this case is ridiculous. Wouldn't it be easier to
always feature the same fixed-dimension controls for Corrections as opposed to ones
that resize to their window?"*

What his screenshot showed, as the desk described it to him and he did not dispute: on
a wide measure the buttons stretch into long bars, the ♭ is as wide as a word, and the
panel changes shape from measure to measure.

Who offered what: the fixed panel is **Dann's proposal**. The shape below (option 1 of
three) is **the desk's**, recommended to him at 16:38; he agreed to the direction at
16:39 and did not rule on the details. Treat the details as DESK DEFAULT.

## The design (option 1)

- **Every Corrections control keeps one size** wherever the loupe is: about 44 px tall;
  the pitch and duration buttons compact and equal in width.
- **The panel has one width** and sits in the same place under the music, however wide
  or narrow the measure is. ▼ step is always where the hand expects it.
- **If a measure is narrower than the panel, the card widens to the panel.** The panel's
  width becomes the loupe's minimum width.
- Nothing else about the loupe changes: the calm loupe's top segment stays the anchor
  (`docs/memory/OPEN.md` §THE CALM LOUPE), and Syllables is untouched.

## Step 1. Measure before you change anything, and report

The desk did NOT establish which file sizes the loupe's Corrections buttons, or how.
Find it and report, with `path:line`: what makes a button's width follow the loupe's
width today, and the widths on Sunless 1 at its narrowest and widest measures, desk and
phone. Take this reading before any edit. To read old code use `git show` or
`git archive`; do not stash, check out, restore, or use a worktree.

## Step 2. Build it

Fix the control size and the panel width; let the card take the panel's width as its
minimum. Keep the 44 px tap floor (`TAP_FLOOR_EPS_PX`, `loupe-render.ts`). No new
strings expected; if any are needed, draft the French from `i18n.ts` and bring it to
the desk.

## Step 3. Prove it

- The same widths as step 1, after: every Corrections button the same size on the
  narrowest and widest measures, desk and phone.
- All eight ship-script gates at baseline or better; report the count. `check` 0
  errors; ratchets OK, and no hotspot file grows past its ceiling.
- Screenshots of Corrections open on the narrowest and widest measures of Sunless 1 and
  «Скучай», desk and phone, before and after.

## The report

`docs/sessions/report-code-corrections-fixed-panel_r1_<date>.md`: step 1's reading,
what changed with `path:line`, the gate numbers, the screenshots, and **What I could not
establish**. NOT ESTABLISHED beats a complete invented answer. Do not commit or stage.
Dann ships.
