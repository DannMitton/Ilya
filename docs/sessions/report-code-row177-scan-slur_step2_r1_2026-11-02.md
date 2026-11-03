# Report, row 177, step 2 (r1), 2026-11-02: the gate, per system

Lane: `cloud-lane-30`, on step 1. Read on the tree before changing it: `omr/underlay-page.ts` (all, as it stood), `omr/underlay-seat.ts:70-260`, `omr/underlay-counts.ts` (all), `omr/underlay-clitics.ts:36-145`, `score/slur-seat.ts:41-80`, `omr/underlay-reader.ts:53-61`. Nothing under `docs/memory/`; no push to `Shane` or `main`; no pull request.

## What changed, and what this step deliberately does not do

**This step decides and records the gate; it does not apply it.** Seating, `freeNoteXs`, the sung notes' `continuation`, and every number derived from the free set still read ties and extenders only, so words and breaches are unchanged (a test pins that). Step 3 applies the decision at every site together (`CONTRACT.md` §4). Step 2 alone is therefore not the row's behaviour: do not measure this commit for (b).

- `omr/underlay-seat.ts:108`: `export function isContinuation(note)`, tied into or under an extender or `inSlur`. Step 3 makes it the only reader of the three flags at the other two sites.
- `omr/underlay-page.ts`, in `seatPage`:
  - `:197` `tiesOnly`: a copy of `system.notes` with `inSlur` false. `:198` `free` is `freeNoteXs(tiesOnly)`, the same number as before (`freeNoteXs` does not read `inSlur` yet).
  - `:247-250` the gate, after `assertVowelPerNote` (`:238`) has produced the units, at the point where the units were counted. `syllableUnits` is the count `perSystem` already took (units holding a letter). `slurFree` is the system's notes that are not a continuation under the three flags. `slurReading` is `slurFree === syllableUnits` **and** at least one note that is free by ties alone is `inSlur` (so the ties-only count differs). That is `observedTargets`' test (`slur-seat.ts:62-70`): strict equality with at least one observed continuation. The comment cites the ruling (`OPEN.md`, Dann 2026-10-20 03:37), `slur-seat.ts`, the per-system scope as DESK DEFAULT, and that "equal or nearer" is not built.
  - `:252` the `sung.push` moved after the gate, as the brief says. Its `continuation` is still ties and extenders, from `tiesOnly`, because this step applies nothing. Step 3 switches it to the notes the system took.
  - `perSystem` entries gained `slurFree` and `slurReading` (`UnderlayStats`, `:127`).

## Gate lines

Real systems: **NOT ESTABLISHED.** Row 114's captures are not in this workspace, and the console does not print `slurFree` or `slurReading` until step 3's console change. What I can show is the gate on the cases the brief names, from `underlay-page.test.ts` (new `describe` at the end of the file):

| case | free (ties) | slurFree | units | slurReading |
|---|---|---|---|---|
| song 2 bar 8 shape: «ка» over two slurred notes, the next syllable after them | 3 | 2 | 2 | **true** |
| phrasing slur over a syllabic passage (three units on three notes) | 3 | 1 | 3 | false |
| the slur leaves more free notes than units | 4 | 3 | 2 | false |
| a tie and a slur on the same notes | 3 | 2 | 2 | **true** |
| the only slurred note is already tied into | 1 | 1 | 1 | false |

## Pins changed (was, now)

`underlay-page.test.ts`, three `perSystem` expectations (`:261`, `:270`, `:275` before this step): was `{ system: 1, free: 3, units: 1 }`, now `{ system: 1, free: 3, slurFree: 3, units: 1, slurReading: false }`; was `{ system: 1, free: 1, units: 1 }`, now `{ system: 1, free: 1, slurFree: 1, units: 1, slurReading: false }`; was `{ system: 1, free: 2, units: 1 }`, now `{ system: 1, free: 2, slurFree: 2, units: 1, slurReading: false }`. Nothing else changed.

## Gates

| gate | step 1 | now |
|---|---|---|
| phonology | 407 | 407 |
| dictionary | 248 | 248 |
| web check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| web test | 3908 passed, 1 skipped | **3914 passed, 1 skipped** (+6, all in the gate `describe`) |
| score-parser | 785, 5 skipped | 785, 5 skipped |
| blurb | 148 | 148 |
| integration | 98 | 98 |
| ratchets | OK | OK |

## NOT ESTABLISHED

- How many real systems take the slur reading, per song, and whether they agree with the truth's melisma marks (song 1 is where homr's slurs disagree with the truth). Needs the captures and the console line of step 3; the desk's re-run gives it.
- A system whose units are zero and whose notes are all slurred: `slurFree` 0 equals 0 units, so the gate would pass (the brief's rule, built literally). I did not add a `units > 0` guard because the brief does not ask for one and the desk expects the strict arm's number exactly. Whether such a system exists in the five songs: not established.
