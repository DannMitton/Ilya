# CODE BRIEF. N.168 step 2: the frequency run

**Written by the desk 2026-09-23 17:45. For Claude Code, working in `~/Desktop/ilya-rewrite` on branch `Shane`.**

**Serves N.168** (Insights intake, `docs/memory/OPEN.md` N.168; plan at `~/Documents/Voice Pedagogy Library/Insights Research/plan-intake_r1_2026-09-23.md`, step 2). The map this run counts is `~/Documents/Voice Pedagogy Library/Insights Research/condition-map_r1.md`. Read both before starting.

**NOT ESTABLISHED beats a complete invented answer.** Where this brief cites a `path:line`, re-read it before relying on it; the tree wins over this brief.

## Rules of the house

- Do not commit, stage, or run any git command that writes. Tell Dann which new files need `git add`.
- Measure the five gates at HEAD before you change anything, then report each after, against that baseline. (The last recorded baseline, at `ccb790c`: 216, 235, 0 errors and 12 warnings, 1396, 579 + 5 skipped. HEAD is now `b1f58c8`, so measure.)
- Do not change `VocalLineEvent` or the `AnalyzedEvent` type, and do not touch `apps/web/src/lib/shane/reconciliation/`. `CONTRACT.md` §6.
- Do not write IPA by hand. Every vowel comes from Ilya's resolver (`apps/web/src/lib/shane/vowel-resolver.ts`).
- Canadian spelling, no em dashes, in comments and in your report.
- `WRITTEN` is not `DONE`. This run is a measurement, so it is DONE when the table exists and Dann has seen it.

## Part 1. Compute the four missing dimensions, in a new pure module

DESK DEFAULT: a new file `packages/score-parser/src/conditions.ts` (with a test file), which takes a `ParsedScore`, a `VoiceProfileSnapshot`, and the overlay engine's `AnalyzedEvent`s, and returns one condition record per sung note. **It adds; it changes no existing type or output.** Nothing in the app reads it yet.

Per sung note, the record carries everything the overlay engine already gives (fR1 band, passaggio, range status, sustained ceiling exposure, vowel, held or short via `isLongSustain`, `sustain.ts:98`) plus:

1. **Harmonic rung against fR1.** The ladder is ruled (Dann, 2026-07-20, `claude/fit-acoustic-framework_2026-07-20.md` §1, the spine): n·fo meeting fR1, where n = 2 is the existing turn, and n = 3, 4, 5 are the micro-turnings. Report the n in {3, 4, 5} for which n·fo lies within `CROSSING_TOLERANCE_CENTS` (50, `overlay-engine.ts:131`) of fR1, or none.
2. **Harmonic rung against fR2.** Same test, n from 1 to 8 (DESK DEFAULT upper bound; say if it should be higher), only where the profile carries fR2 for that vowel. Absent fR2 means not assessed, never `false`.
3. **Approach.** Semitones from the previous sung note. Bands: repeated (0), step (1 or 2), leap up (3 or more), leap down (3 or more). DESK DEFAULT: a rest does not reset the previous note; add a flag `afterRest`. The first note of the piece has no approach.
4. **Phrase.** A phrase ends at a breath mark or caesura (`types.ts:485-490`, parsed at `musicxml-parser.ts:259`) or at any rest. DESK DEFAULT, and report how often each boundary kind fired. Per note: the phrase's index, its length in seconds, and the note's position in it (first, middle, last).
5. **Position in the piece.** Cumulative phonation seconds at the note's onset, from the same arithmetic as `secondsFor` (`phonation.ts:455`).

**Dynamics stay out.** The parser carries none (`docs/memory/PRODUCT.md`, "The refusal it struck"). Do not start that work.

## Part 2. The run

A script (DESK DEFAULT: `tools/n168-frequency-run/`, run with whatever the repository already uses to run TypeScript outside the app; say what you used). It must use the real vowel resolver, so if that means running inside `apps/web` as a skipped-by-default vitest file, do that and say so.

### The scores: sixteen songs, Dann's own Finale files

In `~/Documents/Finale Files/` (read-only; copy nothing into the repository):

- `Mussorgsky - Sunless 01 - Within four walls.musx` through `Mussorgsky - Sunless 06 - On the river.musx` (six files).
- `Kabalevsky - Shakespeare - T01 ... .musx` through `T10 ... .musx` (ten files; use the `.musx`, never the old `.mus`, and never the `05` or `E01` or `EXPERIMENT` variants).

What the `T` prefix means is NOT ESTABLISHED; do not guess. Read `.musx` the way the app does (denigma, `docs/memory/ENVIRONMENT.md`). **If `.musx` cannot be read outside the browser,** stop at that point and report it; the fallback is the harness's `score.mxl` files under `tools/e16-harness/output/mussorgsky---sunless-0N---*/` for Sunless, and you must say which you used. For each song, report bars read, bars untrusted, and the tempo state (stated, inferred, none).

### The voices

- **Low male voice, Mitton.** fR1 and fR2: `MITTON` in `packages/score-parser/src/modification-engine.test.ts:21-24` (copy the values; do not import a test file). Range A2 to E4 (`claude/fit-acoustic-framework_2026-07-20.md` §2, dataset-primary). Passaggi: search the tree for Mitton's primo and secondo; if none is found, run without them and report passaggio as not assessed. Songs in the key of the file.
- **Treble voice, Godin.** fR1 from the Godin and Howell 2015 poster, by vowel group, as the midpoint of each printed band (DESK DEFAULT): [i] and [u] at G4 (Gb4 to Ab4); [ɪ], [o], and [e] at the midpoint of A4 to Bb4; [ɛ], [ʌ], and [ɑ] at the midpoint of E5 to F5; [a] at the midpoint of G5 to Ab5. **[ɨ] is not in her table: not assessed.** No fR2, no range, no primo: those dimensions are not assessed for her. Songs transposed up an octave (`transposeScore`, `transposition.ts:217`, +12; DESK DEFAULT).

### The weighting

Weight every note by seconds sung. Where the tempo is inferred, use the midpoint of `secondsFor`'s range and say so; where there is none, weight by quaver-equivalents and mark that song.

## The output

Two files in `tools/n168-frequency-run/out/`, markdown and CSV:

1. **Per dimension, per voice:** each band's share of sung time and its note count, across all sixteen songs.
2. **Regions, per voice:** the combination of fR1 band × vowel × held or short × approach, ranked by seconds sung, top 40, with the song count each appears in. (Add passaggio and range where assessed.)

Then a short memo, `docs/sessions/memo-code-n168-frequency-run_r1_2026-09-23.md`: what was built, the gates, each song's read status, every DESK DEFAULT you applied, and a section headed **NOT ESTABLISHED** listing what you could not settle.

## Done when

The two output files exist for both voices, the memo lists every song's status, and the gates are at baseline.
