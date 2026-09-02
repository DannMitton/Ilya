# Brief: N.102 increment 1, the courtesy accidental across a barline

Written 2026-09-02 by the desk for a fresh Claude Code thread. Floor:
`21e9ce2`, 'N.105: "Not now" lasts thirty days'. Item: **N.102**, numbered by
Dann 2026-08-27, placed by him 2026-09-02. `docs/memory/INBOX.md:62` carries
the numbering note.

## 1. What exists today

`packages/score-parser/src/staff-renderer.ts`, read this session:

- `:1335` resets `measureAcc = {}` on every new measure, so nothing carries
  across a barline.
- `:1372-1395` draws an accidental if and only if `pitch.alter` differs from
  what is in effect, where "in effect" is the measure's own state or, failing
  that, the key signature (`keySignatureAlter`, `:272`). Nothing is ever
  drawn for a pitch the key signature already gives.
- So Ilya has no courtesy accidental of any kind. What a walk once read as one
  was a mandatory cancellation (`docs/sessions/memo-mobile-slice4_r1_2026-08-27.md`
  §1).

## 2. The rule to build

Gould, *Behind Bars* p. 81, as distilled in
`claude/gould-vocal-engraving-rules_v7_2026-08-05.md` rule 121: **a pitch
altered in one bar and repeated in the next carries either a restated
accidental or an explicit cancellation, even though the barline has reset it,
and even when the key signature already restores the pitch.**

Build exactly that and nothing wider:

- Track, per (step, octave), the alter that was in effect at the END of the
  previous measure, on the sung line only. Call it `prevMeasureAcc`.
- On a note in the current measure whose (step, octave) appears in
  `prevMeasureAcc` with a different alter from the note's own, and where
  `:1376`'s existing test would draw NOTHING (the note's alter equals the key
  signature and no accidental is yet in effect this measure), draw the note's
  own accidental as a courtesy: the accidental glyph flanked by
  `accidentalParensLeft` (U+E26A) and `accidentalParensRight` (U+E26B).
- Draw it once. After it is drawn, set `measureAcc[key]` so the measure
  behaves as though the accidental were stated, and remove the key from
  `prevMeasureAcc` so a second recurrence in the same bar draws nothing.
- Where `:1376` already draws a required accidental, nothing changes. A
  required accidental is never parenthesized.
- DESK DEFAULT, Dann's to wave off: sung line only. The turning layer
  (`:1489-1506`) keeps its own state and draws no courtesy.
- DESK DEFAULT: parenthesized. Gould allows bare or parenthesized; the
  parenthesis says "you are not misreading" without changing the pitch.

Rule 122 (generous cautionaries in chromatic music, augmented and diminished
intervals) is NOT this increment. Do not build it.

## 3. The glyphs

`apps/web/static/fonts/finale-maestro/FinaleMaestro.otf` maps U+E26A and
U+E26B; `FinaleMaestro.json` carries `glyphBBoxes` for both. Established
2026-09-02 by reading the cmap with fontTools and the JSON. Bravura and Leland
carry them too. Use the same `smufl.glyph(name)` path the accidental itself
uses, and if `RequiredGlyphName` (`smufl-metadata.ts`) does not admit the two
parenthesis names, add them there with a Bravura fallback, the way the file
already handles the rest. Say in the memo whether that changed the
metadata validation.

Layout: parens left, accidental, parens right, laid out from their bounding
boxes with no gap between them, and the whole cluster placed where the bare
accidental would go, using the existing `gx` arithmetic at `:1384` with the
cluster width in place of `accW`. The measure-opening floor
(`newMeasure ? nx - 16`) still applies. **Measure the collision**: on a
measure-opening note the cluster is wider than a bare accidental and may
touch the barline at `nx - 18` or the previous measure's last glyph. Report
the narrowest clearance in units. If it collides, do not fix spacing here;
that is N.103, and the memo names the measure so N.103 has a case.

## 4. Definition of done

1. Tests in `staff-renderer.test.ts`, under a new `describe('courtesy
   accidentals across a barline (N.102 increment 1)')`: B flat in bar 1 then
   B natural in bar 2 in C major draws a parenthesized natural on the bar 2
   note; the same B natural a bar later with nothing altered in between draws
   nothing; a required accidental in bar 2 is drawn bare and not
   parenthesized; the courtesy is drawn once when the pitch recurs twice in
   bar 2; a different octave draws nothing (rule 116, key on step and
   octave); the turning layer draws no courtesy.
2. Five gates at baseline, with gate 5 disclosed if it moves from
   `481 passed | 5 skipped (486)` and gate 4 from `920 passed (920)`. Report
   the new numbers and say which line of `~/Downloads/ilya-ship.sh` must
   change; do not edit that file.
3. A local production build, walked by you, on the engraved Without Sun
   song 1 (`apps/web/static/reader/`, staged after the dev server starts,
   per `memo-n104-head-window-overlap_r1_2026-09-01.md` §9). List every
   courtesy the rule drew, by measure and pitch, and screenshot the first
   one at 3×. Then the control: name one measure where a pitch recurs after
   a barline with NO alteration before it and confirm nothing was drawn.
4. No user-facing string added or changed. No French coined. No control in
   the drawer; that is increment 2.

## 5. Constraints

- `THIS DESK DOES NOT BUILD`; you do. You do not run git. Nothing is
  committed and nothing is shipped by you.
- Do not change `VocalLineEvent`. Do not touch
  `apps/web/src/lib/shane/reconciliation/`.
- Do not store anything derived: the courtesy is computed at render, never
  written into the score or the song.
- Do not put a mark on the page that says Ilya is unsure. A courtesy
  accidental is an engraving convention, not a confidence mark; it is drawn
  in the ink colour `#1a1612`, not lavender.
- House style in the memo: Canadian spelling, no em dashes, `NOT
  ESTABLISHED` never smoothed into prose.

## 6. Return format

A memo at `docs/sessions/memo-n102-courtesy-accidentals_r1_<date>.md`: what
changed with `path:line`, the list of courtesies drawn on Without Sun song 1,
the narrowest clearance measured, gates before and after, citations your
edit moved, and a NOT ESTABLISHED section. **"NOT ESTABLISHED beats a
complete invented answer."** Commit message for Dann to use:
`N.102: the courtesy accidental across a barline`.
