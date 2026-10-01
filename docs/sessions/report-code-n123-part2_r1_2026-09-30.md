# Report from Code: N.123 part 2 (QUEUE row 2h)

Code, 2026-09-30. Brief: `brief-code-n123-part2_r1_2026-09-30.md`. Read on branch `Shane` at `93bc639`, working tree dirty with the uncommitted rows 2b to 2g. No git writes.

## Summary

- **Built:** the bracket "half the singing", its centre tick, and the cycle-dose line under the figure, in both languages, on screen, at phone width, and in print.
- **Already in the tree:** the dashed passaggio lines (item 3). `Tessituragram.svelte` has drawn them dashed (`stroke-dasharray="4 3"`) from just past the barline to the right edge since `687da7c`. No change.
- **One departure from the drawing:** the bracket stands just past the bars' labels, not at the right edge. The zone shares ("between · 48%") sit at the right edge now.
- **French for two figure labels is PROPOSED, not ratified.** One question for Dann at the end.
- **Gates:** gate 4 moves from 1760 to 1772, the 12 new tests, all passing. The other seven are at baseline.

## The measures

New module `apps/web/src/lib/insights/singing-measures.ts` (145 lines), tested in `singing-measures.test.ts` (12 tests, every expected value worked by hand). `tessituragram()` (`insights.ts`) adds three fields to the figure's model: `halfMass`, `centre`, and `cycles`. All three read the figure's own rows, so they agree with the bars to the quaver.

- **Half-mass band:** the narrowest contiguous run of sung pitches holding at least half the sung time; equal width goes to the heavier run. **DESK DEFAULT:** a tie in both goes to the lower run, so the pick is deterministic. "Contiguous" is over the pitches the piece sings, and width is in semitones.
- **Centre of gravity:** Rastall's p via Barcan 2013, p. 37 note vii, over MIDI numbers weighted by sung time. It is shown as the nearest semitone, and a half rounds up.
  - If the piece sings that semitone, the label takes the piece's spelling. **DESK DEFAULT, found on the library:** the least-altered spelling, then the lower letter. Der Mond sings both B♯3 and C4 at MIDI 60; the first build read "B♯3", and it now reads C4.
  - If the piece does not sing it, a natural is named plainly. A black key takes the sharp or flat of the nearest sung accidental, and a sharp if the piece sings none (DESK DEFAULT).
- **Cycle dose:** the sum over sung pitches of f0 × seconds, with f0 at A4 = 440 Hz in equal temperament. The seconds come from the phonation-time section's own pricing (`secondsPerQuaver`), so the dose follows the printed tempo.
  - A chosen key reaches it already: Insights' `analysisScore` is built from `keyRuler.draw(...)` (`InsightsPane.svelte:143-144`).
  - The count rounds to two significant figures and is grouped per language: "14,000" and « 14 000 » with U+00A0.
  - An inferred tempo prints "about {low} to {high}" through `insights.fit.span`.
  - With no tempo, the line is omitted.
  - The comments cite Titze, Švec, and Popolo 2003, *JSLHR* 46(4), pp. 919-932, and Rantala and Vilkman 1999.

## On Dann's library

A scratch probe (not in the tree) ran every `.musx` in `~/Documents/Finale Files` through `buildInsights` with Mitton's profile.

- **38 files:** 1 failed to convert (BWV 1007, as in row 2f), 1 drew no figure (Duparc, *Phydilé*), and **36 drew a figure**.
- **The cycle-dose line prints on 31 and is omitted on 5 for lack of a tempo:** Beatles *Because*, *LMV formant locations*, *Pachecan Tabulation Values*, *Russian Alphabet Song*, and Wagner *Die Meistersinger*. No file has an inferred tempo, so the range form never appeared.
- **Sample values:** Sunless 05: half F♯3 to B♭3 (56%), centre G♯3, about 23,000. T01: half E3 to B♭3 (54%), centre G3, about 32,000. Moffatt and Parsifal *Erkenn'st du ihn* reach about 100,000. Parsifal pp. 216-225 has 3 sung pitches and about 340.
- **The centre lies outside the half-mass band on 5 files:** *LMV formant locations*, *Pachecan Tabulation Values*, Parsifal pp. 216-225, and Kabalevsky T05 and its EXPERIMENT copy. **DESK DEFAULT:** the tick is drawn at its true pitch, and the bracket's spine extends to reach it; the serifs still mark the band.
- **The centre names an unsung semitone on 3 files.** The probe counted them; it did not list which.

## The figure

- **The bracket** is a spine with serifs toward the bars, at the band's top and bottom bar edges. "half the singing" sits above it, end-aligned. The tick points away from the bars, with "centre" stacked over the pitch, as in the drawing.
  - Ink: `--rose-ink` at stroke width 1, the figure's label ink at its stave lines' weight. No new colour.
  - Labels sit on the figure's existing paper halo.
- **Placement, a departure from the drawing.** The drawing put the bracket at the right edge, and the zone shares sit there now. So the bracket stands 10 px past the longest label among the bars it spans, and the centre label stops 6 px short of any zone share at its height.
  - Labels are measured in the figure's own face on a canvas once fonts are ready. A per-character estimate overlapped on Sunless 05 in French and was replaced.
  - **Checked on two songs only.** A song with a long finding label inside the band could still crowd the right edge.
- **The cycle-dose line** prints as the section's prose (serif, 14 px) directly under the figure, inside `Tessituragram.svelte`. `InsightsPane.svelte` is at its ratchet ceiling (1350 lines) and was not touched.

## Screenshots

Headless Chromium at device scale 3, each run in a fresh browser context with a seeded Mitton voice, so Dann's stored library was never touched:

- `report-code-n123-part2_r1_2026-09-30-t01-desk-en.png`: Kabalevsky T01, English, desktop.
- `report-code-n123-part2_r1_2026-09-30-elegy-desk-fr.png`: Sunless 05, French, desktop.
- `report-code-n123-part2_r1_2026-09-30-elegy-phone-en.png`: Sunless 05, English, 390 px. The sheet scales whole, so the figure is the desktop figure, smaller.
- `report-code-n123-part2_r1_2026-09-30-t01-print-en.png`: T01, English, print media.

Not mine, seen in passing: on both songs the row names left of the bars overlap where sung accidentals crowd ("A♯3 / B♭3" over "A3"). That predates this work.

## Strings

`i18n.ts`, beside `insights.figure.caption`, with a comment carrying the approval:

- `insights.figure.cycleDose`, **RATIFIED** (22:03 to 22:04): EN "Cycle dose: about {cycles} (number of fold collisions in this piece)"; FR « Dose de cycles : environ {cycles} (nombre de collisions des cordes vocales dans cette pièce) ».
- `insights.figure.halfMass`: EN "half the singing" (Dann's). FR « la moitié du chant », **PROPOSED by Code, not ratified** (coined).
- `insights.figure.centre`: EN "centre" (the drawing's). FR « centre », **PROPOSED, not ratified** (same word).

## For Dann (French), one question

Is « la moitié du chant » right for "half the singing"? « chant » can also read as "the song", so « la moitié du temps chanté » is the more literal option.

## Gates

| Gate | Before (after row 2g) | After |
|---|---|---|
| 1 phonology | 251 passed (251) | 251 passed (251) |
| 2 dictionary | 235 passed (235) | 235 passed (235) |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 1760 passed (1760) | **1772 passed (1772)**, +12 `singing-measures.test.ts` |
| 5 score-parser | 636 passed, 5 skipped (641) | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) | 145 passed (145) |
| 7 integration | 55 passed (55) | 55 passed (55) |
| 8 ratchets | OK | OK |

The ship script's gate 4 baseline needs to move to 1772; that is the desk's to do.

## Files

- New: `apps/web/src/lib/insights/singing-measures.ts`, `singing-measures.test.ts`, and the four screenshots.
- Changed: `apps/web/src/lib/insights/insights.ts` (+10 lines), `Tessituragram.svelte` (361 to 466 lines), `apps/web/src/lib/i18n.ts` (three keys).
