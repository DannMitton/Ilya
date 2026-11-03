# Report, row 177, step 4 (r1), 2026-11-02: tests, and the row's whole account

Lane: `cloud-lane-30`, on step 3. Nothing under `docs/memory/`; no push to `Shane` or `main`; no pull request; no `brief-*` or `review-*` file. Gate 4 went 3898 (cut) to **3924** (+26) over steps 1 to 4.

## Step 4's change

One test added, one report line corrected. The brief's test list was written alongside steps 1 to 3 (each test sat with the code it checks); step 4 adds the one case that crosses them, then maps the list.

- `underlay-prepare.test.ts`, `describe('a printed slur, from the MusicXML to the words under the notes')` (+2): a four-note MusicXML with a slur over notes 1 to 3 goes through `prepareUnderlay` and `seatPage` with «ка» at the first note and «мир» at the fourth. With the slur: gate line `free 4, slurFree 2, units 2, slurReading true`, «мир» on note 3, no breach. The same four notes with no slur printed: `slurReading false`, same two seats, and two `no-syllable` breaches (notes 1 and 2). That is the row's reason in one pair of tests.
- Step 3's report cited three lines as `:~205`, `:~236`, `:~252`; corrected to `:207`, `:233`, `:252` (read with `grep -n` on the tree).

## The brief's step 4 list, mapped

| brief item | test |
|---|---|
| a system whose slur makes the counts even takes it (song 2 bar 8: «ка» over two slurred notes, the next syllable on the note after the pair) | `underlay-page.test.ts` "takes the slur reading where the slurred notes make the free notes and the units come out even"; "applies the reading it took at every site"; and the end-to-end pair above |
| a phrasing slur over a syllabic passage, counts disagree, system as today | "leaves a phrasing slur over a syllabic passage as today"; "leaves a system whose counts disagree exactly as it would be with no slur flags at all" |
| a tie and a slur on the same notes | `underlay-prepare.test.ts` "does not mark a tie, and reads a tie and a slur on the same notes"; `underlay-page.test.ts` "reads a tie and a slur on the same notes" and "does not take the reading where the only slurred notes are already tied into" |
| a slur whose start note is the system's last note | `underlay-page.test.ts` "reads a slur whose start note is the last note of one system in the next" |
| a rest inside a slur (the span runs past it) | `underlay-prepare.test.ts` "runs a span past a rest, never marks the rest, and does not end there" |
| `freeNoteXs` equal to `free` with and without the slur reading | `underlay-seat.test.ts` "freeNoteXs lists the notes seatTokens seats on, with and without the slur reading, and with all three flags at once" |
| two slurs with different `number` values nested, the union | `underlay-prepare.test.ts` "takes the union of overlapping and nested spans with different numbers" |
| a `start` with no `stop` marks nothing | `underlay-prepare.test.ts` "marks nothing for a start with no stop, or a stop with no start" |
| a token FAR under the ties-only reading that is near under the slur reading, pinning the reach at `underlay-seat.ts:226` under both | `underlay-seat.test.ts` "pins the FAR reach under both readings" (median gap 50 against 900; the token is unseated, then seated on note 13) |

## Pins that changed in the whole row, with was and now

- `underlay-prepare.test.ts`, the three `voiceNotes` `toEqual` lists and the `prepareUnderlay` notes list: was `{ ordinal, rest, bar, at, tiedInto }` and `{ id, x, bar, tiedInto }`; now each gains `inSlur: false`. (Step 1.)
- `underlay-page.test.ts`, three `perSystem` expectations: was `{ system: 1, free: 3, units: 1 }`, `{ free: 1, units: 1 }`, `{ free: 2, units: 1 }`; now each gains `slurFree` (3, 1, 2) and `slurReading: false`. (Step 2.)
- The console line's wording: was `<system>: <free> against <units>`, now `<system>: ties N, slur-aware N, units N, SLUR|ties`. No test pinned the old text. (Step 3.)
- No other existing test changed.

## Gates at the end of step 4

phonology 407; dictionary 248; web check 0 errors, 12 warnings; web test **3924 passed, 1 skipped**; score-parser 785 passed, 5 skipped; blurb 148; integration 98; ratchets OK; `pnpm --filter @ilya/web build` exit 0. Playwright not run (not one of the eight).

## For the desk's measure

The row stands as the brief's strict arm: per system, strict equality, at least one observed continuation, no "equal or nearer" arm. The desk expects the strict number (369, per song 48, 136, 29, 82, 74) exactly. Differences from the scratch arm that could move a syllable, which I cannot rule out without the captures:

1. Pairing: the brief's rule (each start takes the next stop of its number on a later note; unmatched starts open nothing) differs from the scratch's one-pass shape, which kept an unmatched start open to the end of the part (review 1.5). A system where homr wrote an unmatched start will read differently from the scratch.
2. `foldClitics` is re-run with the slur-aware free notes where the slur reading is taken (`ownNote` only; units unchanged by construction). The scratch re-ran it too (review 1.4). No effect on (b) expected.
3. Gate line wording differs from the scratch's `[ties N, slur-aware N, slur notes N, SLUR|ties]`: mine has `ties N, slur-aware N, units N`, no slur-note count. A script that parses the scratch's line will need the new shape.
4. A within-note order choice: stops before starts (step 1 report).

If the five songs differ from 369, start from points 1 and 4; they are the two places I chose where the brief did not say.

## NOT ESTABLISHED

- The (b) score, the breach counts per system, the per-song systems that took the slur reading and whether they agree with the truth, and the unmatched starts and stops per song: all need row 114's captures and homr, which are not in this workspace. The desk's re-run gives them. What each step's report says about them is restated here, not new.
- How many melismas the unmatched slur ends hide.
- The renderer's draw of a scan arrival with slur continuations and no `<lyric>` (`pairings.ts:8-9` read as cited, renderer not read).
- Playwright and the browser path: not run.
