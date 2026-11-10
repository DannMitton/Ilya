# Report: row 181 B0 and B0g, step 5 (gates and report) (Code, cloud lane 40, r1, 2026-11-09)

Branch `cloud-lane-40`, from `origin/cloud-lane-38` at `534d998`. Before this report: `git fetch origin cloud-lane-38` again, and `git log HEAD..origin/cloud-lane-38` is empty, so there was nothing to merge and the gates below are the final ones. All eight run by me, on the tip, from a clean `pnpm install --frozen-lockfile`.

| # | Gate | Baseline (step 0) | On the tip | Move |
|---|---|---|---|---|
| 1 | `pnpm test:phonology` | 14 files, 456 | 14 files, 456 | none |
| 2 | `pnpm test:dictionary` | 4 files, 248 | 4 files, 248 | none |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings | 0 errors, 12 warnings | none |
| 4 | `pnpm --filter @ilya/web test` | 256 files, 4707 passed, 1 skipped | **257 files, 4734 passed, 1 skipped (4735)** | +1 file, +27 tests, all mine (below) |
| 5 | `pnpm --filter @ilya/score-parser test` | 35 files, 785 passed, 5 skipped | 35 files, 785 passed, 5 skipped | none (no package file touched) |
| 6 | `pnpm test:blurb` | 4 files, 168 | 4 files, 168 | none |
| 7 | `pnpm test:integration` | 7 files, 125 | 7 files, 125 | none |
| 8 | `pnpm ratchets` | OK | OK | none |

Gate 4's +27 tests: `note-kinds.test.ts` (new file) 10; `underlay-units.test.ts` 7; `underlay-tokens.test.ts` 4; `underlay-recognize.test.ts` 1; `underlay-page.test.ts` 3 (one for the letter boxes reaching the token, two for the vowel's ink at the seating); `stamp.test.ts` 1; `underlay-switch.test.ts` 1 (the fifth stamp under which a stored scan is stale). No existing test was loosened. Two existing test fixtures (`underlay-integration.test.ts`, `underlay-song.test.ts`) gained the two new `UnderlayStats` fields, which the type requires.

Ceilings: not raised. No file this build touched is listed in `scripts/ratchets.json`; each is held by `newFileMaxLines` 1000, and the longest is `underlay-page.ts`, which grew from 391 to 427 lines. `ratchets` still lists the five ceilings that could be lowered, none of them mine.

## Files changed (source)

New: `note-kinds.ts`. Changed: `underlay-recognize.ts`, `underlay-page.ts`, `underlay-seat.ts`, `underlay-tokens.ts`, `underlay-units.ts`, `underlay-prepare.ts`, `underlay-reader.ts` (two console segments), `metre-witness.ts` (the three predicates), `stamp.ts`. No string, no component, no `docs/memory/` file, and neither `cloud-lane-39`'s INSIGHTS nor voice-adapter files.

## What the desk should look for in its measure (section 5 item 2)

The page's console line now carries `; skipped notes: G grace, C chord (not skipped, counted: N cue, M voice 2); vowel boxes: P placed by the vowel's ink, fallbacks to the letter share: X token(s) whose letter boxes did not match, Y piece(s) with no vowel`. Expected on row 114 f1 per the B0 report: fallbacks 0. A token whose reader gave no letter boxes counts under `X` (step 3 report, section 2).

## What Code could not establish

- **The desk's measure (389 of 590, per song 49, 139, 33, 82, 86; +6, −2).** Not run: it needs scans that are not in the repository. Stopped here, as instructed.
- That the lane as built reproduces the patch's boxes exactly: the patch (`patch.py`, md5 `d974868c…`) is in the desk's tarball, not in the repository, so I built from the brief's description of it and did not diff against it. Where it differs from the build is the desk's to find in the measure. Two readings I settled are in the step 3 report, section 3 (a vowelless part in `splitTokens` takes the span; a token with no letter boxes counts as a fallback).
- Which kind accounts for song 3's 290 flagged notes (step 2 report).
- Whether the merged-system loss on song 2 page 6 (section 3 of the brief; design r3 rank 7) is touched: not by anything built here. It is outside this brief.
- Whether `silent` (a no-ink system of tied notes that also holds a grace note) should read `live`: left on all notes, as measured; a question for the desk (step 2 report, section 2).
