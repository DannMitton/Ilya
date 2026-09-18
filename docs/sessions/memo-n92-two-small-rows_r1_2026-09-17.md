# Memo: the two small rows, built

**Reply to `brief-n92-two-small-rows_r1_2026-09-17.md`.** Built in Claude Code,
branch `Shane`. Both rows are done: the semitone cells are back on the
Corrections surface, and the loupe's fill tag now says which way a measure
disagrees.

## 1. Row 1: the semitone cells return

**`CorrectionSurface.svelte`.**

- `onsemitone: (direction: 1 | -1) => void;` added to `Props`, beside `onstep`
  and `onoctave` (`:127`), and destructured the same way (`:154`).
- The retirement comment is amended in place, not deleted
  (`:598-604`): it keeps the 2026-08-24 ruling's own words, then records
  today's reversal and why. Dann's 2026-09-17 ruling is quoted in the brief.
  This comment paraphrases it rather than re-quoting it, since the brief
  itself is the record of the exact words.
- Two cells in the PITCH station, after octave-down (`:646-663`): same shape as
  the four step/octave cells (▲/▼ glyph, `class="cell"`, `disabled={inGap}`,
  `onpointerdown={onhold(...)}` for press-and-hold, `onclick`), calling
  `onsemitone(1)` and `onsemitone(-1)`.
- **One judgment call, not settled by the brief: the cells' visible text.**
  `loupe.pitch.step` and `loupe.pitch.octave` supply a short visible word
  ("step", "octave") distinct from the long `aria-label`. No such short word
  exists for semitone, and the brief says no new strings. Rather than invent
  one, both the visible text and the `aria-label` use `correct.semitoneUp` /
  `correct.semitoneDown` directly ("Up a semitone" / "Down a semitone"), so
  the cell reads a full sentence next to the arrow instead of a single word.
  **This is mine and it is reversible**: a short label ("semitone") would
  need one new i18n key Dann would need to approve.

**`+page.svelte`.** `onsemitone={handleSemitone}` added to both
`CorrectionSurface` call sites: the desktop panel (`:4606`) and the phone dock
(`:4994`). `handleSemitone` itself is untouched (`:1007-1014`). No new logic,
no new record shape, exactly as ruled.

**Live walk, phone-width (375×812), `pnpm dev`.** Fed a real score
(`tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/score.mxl`,
staged and removed from the gitignored `apps/web/static/reader/`) via a
synthetic `DragEvent`/`DataTransfer` drop, since the pane's own drag tool
arrives as mouse events. On the phone dock:

- Selected A3, tapped "Up a semitone": the loupe's own note glyph gained a
  sharp, the readout read `A#3 · Quarter · Ком`.
- Tapped "Down a semitone": back to `A3`, glyph plain.
- Both cells are disabled in a gap, inheriting `disabled={inGap}` the same way
  step and octave do. This was not separately walked: it is the same
  conditional on the same element shape, already proven for its neighbours.

**Existing unit test, unchanged and still green**: `semitonePitch` itself is
tested at `correction.test.ts:91-102,249` (respelling across a key). This ship
added no new logic to test. It wired an existing, tested function to a second
input, a tap, beside the existing key.

## 2. Row 2: the fill line's word

**`apps/web/src/lib/i18n.ts:524-530`.** Two keys, exactly as ruled:

```
'loupe.fill.short':  { en: 'short', fr: 'incomplète' },
'loupe.fill.over':   { en: 'over',  fr: 'trop pleine' },
```

**`Loupe.svelte:1337-1374`.** The `tag` derivation's two fill-bearing branches
(`measureTagBoth` and `measureTagFill`) now each end with
`, ${T(fill.actual < fill.expected ? 'loupe.fill.short' : 'loupe.fill.over')}`.
`fill` is `null` exactly where `measureFill` (`entry.ts:381-431`) found the
measure balanced, so nothing is appended there. The two branches that never
see `fill` (`measureTag`, `measureTagShort`) are untouched.

**Live walk, same session, same score, phone width.** On measure 4 (12/8, in
the "тень не проглядная" line):

- Balanced: tag read `m. 4 · system 2 of 6`, no word, as before.
- Deleted one note (Delete cell): tag read `m. 4 · system 2 of 6 · 10 of 12,
  short`, then deleted a second: `8 of 12, short`.
- Set one note's duration to a whole note (pushing the bar past 12): `14 of
  12, over`, confirmed in French as `14 sur 12, trop pleine`.
- Switched language and re-read the short state in French: `10 sur 12,
  incomplète`.
- No colour, icon, or alarm class touches the "over" word: the change is the
  string only, matching the ruling that a measure over the meter mid-edit is
  not an error.

All three states (short, balanced, over) were seen live in both languages.

## 3. Gate table

| gate | baseline (`55c04d9`) | after |
|---|---|---|
| phonology | 216 passed | 216 passed, untouched |
| dictionary | 235 passed | 235 passed, untouched |
| score-parser | 567 passed, 5 skipped (572) | 567 passed, 5 skipped (572), untouched |
| web-test | 1261 passed | **1261 passed, unchanged**: no test file exercises either surface changed tonight |
| web-check | 0 errors, 12 warnings, 5 files | **0 errors, 12 warnings, 5 files, unchanged** |

No gate moved. Nothing here needed a new test file: `handleSemitone` and
`measureFill` are unchanged functions, wired to one more caller and one more
reader respectively.

## 4. What I could not establish

- Whether Dann's exact wording for the 2026-08-24 retirement comment's
  amendment should be closer to a literal strikeout-and-append than the
  paraphrase I wrote. I kept the original sentence and added the reversal
  after it, per the brief's "do not delete the history: amend it." There is
  more than one way to amend a comment, and I picked one.
- Whether a future short semitone label is wanted at all, given §1's judgment
  call. I did not add one. The brief's "no new strings" reads as a hard
  constraint for tonight, not as silence on it.
- I did not run Playwright (`test:e2e`). The brief's five gates are the
  vitest/svelte-check five, and that is what I ran. If a phone-viewport e2e
  suite exists and covers the Corrections surface, it was not in my walk.

## 5. Files to `git add`

No new source files. Four existing files changed:

- `apps/web/src/lib/shane/CorrectionSurface.svelte`
- `apps/web/src/routes/+page.svelte`
- `apps/web/src/lib/shane/Loupe.svelte`
- `apps/web/src/lib/i18n.ts`

One new file, this memo: `docs/sessions/memo-n92-two-small-rows_r1_2026-09-17.md`.
