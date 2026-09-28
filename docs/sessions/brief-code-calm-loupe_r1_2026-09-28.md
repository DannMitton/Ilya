# Brief for Code: the calm loupe

**Desk brief r1, 2026-09-28. Shape: `BRIEF-TEMPLATE.md`.** Tree: `9ebfdc0` plus slice 3 of the Correction Station (the cursor), uncommitted. **Leave slice 3 in place and build on it; it ships with the first calm-loupe slice after one walk.**

**DELEGATED BY DANN 2026-09-28 01:36:** *"Can you just solve this? Take best practices and apply them to this interface and make the Loupe work elegantly for us."* Every design choice below that is not quoted from Dann is the desk's, under that delegation. **Code does not bring design questions to Dann. It brings them to the desk**, in its report, and carries on with the desk's default. The desk verifies each slice in its cloud clone before Dann sees it; Dann walks once at the end.

## 1. What was observed

Dann, walking «Скучай. Ты создана для» (`Mussorgsky - Sunless 04 - Be bored.musx`) on a desktop Chrome window about 1,630 CSS px wide, 2026-09-27 and 2026-09-28, with screenshots:

1. **The card jumps as the cursor moves inside one measure.** Right arrow from note to note, and from note to gap, changes the card's width (m. 3: about 1,867 px on a note, about 1,957 px in a gap, measured from his screenshots). His words: *"Right arrow from note to note makes the Loupe jump."*
2. **The tag block in the top left is one line or two** (the second line is the readout, for example `F♯4 · beat 1, pulse 2 · Eighth`, and it is absent in a gap), so the card's height changes with it.
3. **On m. 3 the right end of the staff shows no closing barline**, and the next measure's first note and its syllable «для» are drawn, clipped at the edge, although the card has room for the whole measure.
4. **An accidental appearing widens the card** (2026-09-27 20:03, m. 2 of another song).
5. **Stepping a pitch far off the staff makes the card taller, half up and half down**, so the correction buttons slide out from under a held pointer (2026-09-27 21:19, two screenshots, ▼ step about 56 px lower at A0 than at A3). A hold walked a note to E-13.
6. **With the panel closed, the carets are not drawn, but the right arrow stops in the gaps.**
7. **Clicking the filled mode pill does not close the panel.**
8. **The notation is larger than it needs to be**, so a measure that would fit scrolls sideways.

## 2. What is established, each line carrying its `path:line`

Read by the desk at `9ebfdc0`:

- The card's width is recomputed from its contents on every redraw: `stripWidth` and `width`, `apps/web/src/lib/score/Loupe.svelte:2119-2121`.
- The card hangs from `anchorTop`, which centres the card's fixed part `.loupe-top` on the page: `Loupe.svelte:2384-2391`, `centreOnPage` at `apps/web/src/lib/score/loupe.ts:891`. `topH` is the measured height of `.loupe-top` (`Loupe.svelte:2435`), which holds the tag, the window, and the bar.
- `.loupe-window` is `overflow-x: auto; overflow-y: hidden; touch-action: pan-x` (`Loupe.svelte:2828-2830`); the vertical swipe on it dismisses the loupe (comment at `:2821-2827`).
- `.loupe-panel` scrolls inside itself with a derived `max-height` (`Loupe.svelte:2695`, `:2957-2961`).
- The desk magnification on a desk is `min(DESKTOP_MAX, max(DESKTOP_MIN, DESKTOP_TARGET_LINE_GAP / drawnLineGap))` (`Loupe.svelte:1064` region), with `DESKTOP_TARGET_LINE_GAP = 12` and `DESKTOP_MIN = 1.2` (`:239-240`), `DESKTOP_MAX = 2.4` (`:241`).
- `handleMove` never consults the loupe's mode: `+page.svelte:1052` at `9ebfdc0`, now in `lib/score/correction-cursor.svelte.ts`.
- The mode pills call `onmode(m)` (`Loupe.svelte:2652`); `handleLoupeMode` sets the mode and opens the panel (`+page.svelte:1468` region); the fill is `mode === m && syllablesOpen` (`Loupe.svelte:2646`).
- `stepPitch` and `octavePitch` (`apps/web/src/lib/score/correction.ts:164-174`) and `semitonePitch` (`:189-194`) are unbounded.
- Lead, not verified: `memo-loupe-window-sizing_r1_2026-09-27.md` (the window's height, `frame.windowHeight` at `Loupe.svelte:1886`, and where the selected note's y is known, `stripRing`, `loupe.ts:719-734`).

**Why items 1, 3 and 6 happen is NOT ESTABLISHED by the desk.** Code finds it.

## 3. Measure before you change anything

1. For each observation in §1, find and report the cause with `path:line`, before writing code.
2. Report which of the rulings in §4 the tree already meets and which it does not.
3. Propose slices small enough to walk one at a time. The desk's suggested order: 7 and 6 (small), then 2, then 1 and 4, then 3, then 8, then 5.

## 4. The rulings this serves

- `docs/memory/OPEN.md` §THE CARET, **clause 12, ruled by Dann 2026-09-18:** *"THE SIZE IS KEYED TO THE HELD MEASURE, NEVER TO THE SELECTION. Within one measure the card holds still while the singer steps from note to gap to note. It resizes only when the loupe is raised on a different measure."* **Not met in the tree (observation 1).**
- **Clause 7, 2026-09-18:** *"There should not be any information in the Loupe from adjacent measures."* **Not met (observation 3).**
- **Clause 11, 2026-09-18:** the closing barline stays, with the tail panel behind it. **Not met on m. 3 (observation 3).**
- **Clause 8, 2026-09-18, AMENDED by Dann 2026-09-28 01:34.** The loupe may exceed the page's width (stands). *"The notation's point size is the fixed quantity"* is amended: **the notation's size is set once per song**, chosen so the song's ordinary measures fit the room without scrolling; only a measure that still cannot fit (a dense one) scrolls sideways. Offered by the desk; Dann: *"I guess? Maybe include a zoom/pan control as courtesy to users who need finer control."*
- **Zoom, offered by Dann 2026-09-28 01:34 as a courtesy.** DESK DEFAULT shape: a small − and + in the loupe's bar, beside Undo; the chosen zoom holds for the session and applies to every measure; at a zoom that no longer fits, the measure scrolls sideways (that is the pan). Browser zoom is untouched.
- **Ruling 6, Dann 2026-09-20:** *"the music sits at one vertical, every time; sections grow downward; when the contents exceed the room the accordion scrolls inside itself rather than the card moving."*
- **The top segment is the anchor, Dann 2026-09-28 01:31:** *"consider the Loupe bisected and have the top segment be the anchor"*, and *"I suggest placeholdering a second line of text even when it's not present."* So the tag block always reserves two lines. (The desk recommended reserved space over an overlay, because reserved space cannot collide with the notation.)
- **Width while on one measure, RATIFIED by Dann 2026-09-27 20:07**, offered by the desk: the frame may grow but never shrinks, the magnification may drop to keep every note visible but never climbs back, growth eased about 150 ms (none under reduced motion), reset on a new measure or a close. With clause 12 met, growth should be rare (an accidental or a far note).
- **Height while on one measure, direction agreed with Dann 2026-09-27 21:22 to 21:46** (the scroll was Dann's proposal): the music window holds its height while the singer stays on a measure; a note stepped beyond it scrolls inside the window, and the window follows the selected note. It never scrolls by a finger drag, so the vertical swipe keeps dismissing (DESK DEFAULT). The card and the buttons never move.
- **Pitch limits, RATIFIED by Dann 2026-09-27 21:26:** steps stop at **C1 and C7**. At a bound the key and the hold do nothing and nothing is pushed to Undo.
- **The cursor stops only where the singer can see a stop.** DESK DEFAULT, 2026-09-28: when no carets are drawn (panel closed, or Syllables), the arrow keys move note to note; in Corrections, note, gap, note.
- **A second click on the filled mode pill closes the panel.** Dann's proposal 2026-09-27 20:05. The chevron keeps its `aria-expanded` role.
- **The music keys do nothing in Syllables mode.** DESK DEFAULT 2026-09-27: Up, Down, `+`, `-`, digits, `.` and Delete; Left, Right, Escape, Undo and Redo work in both modes.

## 5. Constraints

- Do not change `VocalLineEvent` or anything in `lib/score/reconciliation/` (`docs/memory/CONTRACT.md` §6).
- No git command that writes; no `vitest -u`; no second dev server (`docs/memory/ENVIRONMENT.md`). Stage each slice's patch to the desk before running Playwright a second time.
- Every slice: `pnpm test`, `pnpm ratchets` (ceilings may only fall), `pnpm check` 0 errors, Playwright 28 of 28. The screenshot compare is expected to CHANGE for this work; the desk reviews each changed capture by eye instead.
- When you touch `Loupe.svelte:682-687`, record clause 8's retraction and today's amendment in that comment (clause 8 asks for it).
- French: the zoom buttons need `aria-label`s in both languages. Draft the French; Dann rules it before it ships.
- **Displaces:** slices 4 to 6 of the Correction Station wait until this closes (DESK DEFAULT: the loupe is what Dann is walking, and it hurts now).

## 6. Done when, for each slice

- The gates in §5 pass.
- `WRITTEN` on the code. `DONE` is Dann's walk, on a real song, with the arrow keys and a held button.

## 7. Report back

Per slice: the causes found, the change, the gates, the line counts, and what could not be established. **NOT ESTABLISHED beats a complete invented answer.**
