# Memo: the pitch cells become a grid of six

**Reply to `brief-n92-pitch-grid_r1_2026-09-17.md`.** Built in Claude Code,
branch `Shane`, on top of `0eb0a95`. The PITCH station is a grid of six: three
columns by distance, two rows by direction.

## 1. What changed, by file and line

**`apps/web/src/lib/i18n.ts:422-431`.** One new key, exactly as ruled:

```
'loupe.pitch.semitone': { en: 'semitone', fr: 'demi-ton' },
```

It sits beside `loupe.pitch.step` and `loupe.pitch.octave`, before `step`, so
the three keys read in the grid's own column order. The comment above them is
updated from "three neighbours" to "five neighbours" (`:423`), since
`correct.semitoneUp`/`Down` joined `correct.stepUp`/`Down` and
`correct.octaveUp`/`Down` as the set of accessible names this key's own word
does not abbreviate.

**`apps/web/src/lib/shane/CorrectionSurface.svelte:598-676`.** The PITCH
station's six buttons are reordered into the grid's row-major reading order,
matching the brief's own diagram exactly:

```
▲ semitone   ▲ step   ▲ octave
▼ semitone   ▼ step   ▼ octave
```

Each button keeps its own verb (`onsemitone`, `onstep`, `onoctave`), its own
`disabled={inGap}`, and its own press-and-hold (`onpointerdown={onhold(...)}`).
The only content change is the two semitone buttons' visible text: it was
`T('correct.semitoneUp')`/`Down` (the full spoken sentence), and is now
`T('loupe.pitch.semitone')` (the short word), matching what step and octave
already did. The `aria-label` on every one of the six buttons is unchanged.

The container's class gained `pitch-grid` (`:625`, alongside the existing
`cells`), and a new rule (`:1035-1048`) gives it `display: grid;
grid-template-columns: repeat(3, 1fr); gap: 4px;`. No other station's markup
or class changed, so DURATION and ACCIDENTAL · ENTRY keep their own flex
wrapping from `.cells` untouched.

## 2. Two decisions the brief left to me

- **The gap between the rows is 4px**, the same value `.cells` already spends
  as its own gap everywhere else on this surface. I used one `gap` value for
  both axes rather than a separate `row-gap`, since nothing in the brief or
  the existing rhythm argued for a different number. This is mine and
  reversible: change `.pitch-grid`'s `gap` to two values
  (`row-gap column-gap`) to split them.
- **The arrow sits before the word**, matching what step and octave already
  did, and matching Dann's own diagram in the brief letter for letter
  (`▲ semitone`, arrow first). This barely counts as a decision: the
  alternative (arrow above the word) was not what the brief showed, so I did
  not build it. If Dann wants it tried, it is a `flex-direction: column` on
  `.cell` for these six buttons only, which the grid does not block.

## 3. Live walk

`pnpm dev`, a real score fed via a synthetic `DragEvent`/`DataTransfer` drop
(`tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/score.mxl`,
staged and removed from the gitignored `apps/web/static/reader/`), in English
and French, at 375×812 and at desktop width.

- **Phone width, English, the phone dock.** The loupe on m. 4 showed the grid
  exactly as drawn above: `▲ semitone`, `▲ step`, `▲ octave` on the first row,
  `▼ semitone`, `▼ step`, `▼ octave` on the second. Tapping `▲ semitone`
  turned the selected D3 into D#3, the loupe's own glyph gaining a sharp and
  the readout reading `D#3 · Quarter · про`. Tapping `▼ semitone` returned it
  to `D3`.
- **`read_page` in the same state**: the six buttons list in DOM order as
  `Up a semitone, Up a step, Up an octave, Down a semitone, Down a step, Down
  an octave`, the grid's own row-major reading order, so tab order needs no
  separate handling.
- **Desktop width, French, the drawer panel.** Same score, same note,
  `variant="panel"` this time: the grid drew identically, `▲ demi-ton`,
  `▲ degré`, `▲ octave` over `▼ demi-ton`, `▼ degré`, `▼ octave`, three even
  columns lined up across both rows.
- Press-and-hold was not re-walked as a separate gesture: `onpointerdown` is
  unchanged on every one of the six buttons, and the click I used to prove
  each verb fires through the same handler `onhold` wraps.

## 4. Gate table

| gate | baseline (`0eb0a95`) | after |
|---|---|---|
| phonology | 216 passed | 216 passed, untouched |
| dictionary | 235 passed | 235 passed, untouched |
| score-parser | 567 passed, 5 skipped (572) | 567 passed, 5 skipped (572), untouched |
| web-test | 1261 passed | **1261 passed, unchanged**: no test file exercises this surface |
| web-check | 0 errors, 12 warnings, 5 files | **0 errors, 12 warnings, 5 files, unchanged** |

No gate moved.

## 5. What I could not establish

- Whether a phone narrower than the three-column floor (3 × 44px cells plus
  two 4px gaps, 140px minimum for the row) exists among Dann's own devices.
  I did not have a way to emulate a narrower width than the 375px preset and
  confirm the grid overflows gracefully rather than clipping. The CSS
  (`grid-template-columns: repeat(3, 1fr)` with no `minmax`) should let the
  row overflow its container rather than crush a cell under 44px, but this is
  reasoning from the rule, not a walk.
- Whether Dann wants the row gap distinct from the column gap. I picked one
  value for both, per §2. Nothing in the brief argued either way.

## 6. Files to `git add`

No new source files. Two existing files changed:

- `apps/web/src/lib/shane/CorrectionSurface.svelte`
- `apps/web/src/lib/i18n.ts`

One new file, this memo: `docs/sessions/memo-n92-pitch-grid_r1_2026-09-17.md`.
