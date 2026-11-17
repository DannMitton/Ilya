# Report, N.200 lane 64, Step 1: the fR2 options, each behind its own switch, default off

Cloud lane 64, branch `cloud-lane-64`, on top of `b66b0d9` (Step 0). Working tree clean at the start. Changed: `apps/web/src/lib/voice/engine/path-extract.ts` and `path-extract.test.ts`.

## A note from the desk, recorded as asked

The desk confirmed (after Step 0) that the third synthetic set is exactly the one Step 0's report rebuilt from r1 and Fable's review: take seed `15000 + idx*20 + k`, permutation `rng(17000 + idx*31 + 1)`, truth factor from `rng(19000 + idx)` drawn as `HELD_OUT` draws it. Brief r2 dropped that paragraph by the desk's error; r1 and Fable's review are right. Step 2 builds the set from these numbers.

## What changed

`PathOptions` (`path-extract.ts:92-102`) gains four fields, each default off:

| Field | Acts in | What it does |
|---|---|---|
| `r125` | `crossCheck`, inside the fR2 check (`:213`) | fR2 is kept only when `pathF2 - pathF1 >= RESOLUTION_HZ` (imported from `open-extract.ts`, 1000 / 8 = 125 Hz). |
| `dp` | `crossCheck` (`:208` the search, `:212` the exclusion, `:214` its failure) | The envelope peak within T1 of fR1 is searched in every case (a, b, c, d), and is excluded as fR2's peak in every case. Before, only case (c) did. |
| `p3` | `crossCheck` (`:223-226`) | When track 2 fails `r125` or `dp`, track 3 (`pathF3`) is offered to the same tests. `PathEvidence.fR2Track` (`:81`) records 2, 3, or null. |
| `sqrtWeight` | `fitTrack` (`:139`, `:144`), reached through `scoreCeilings` (`:164`) | Rows are divided by `sqrt(b)` instead of `b`. |

How I read the brief where it left room (DESK DEFAULTS, change on the desk's word):

- "Fails R125 or DP" means: the gap is under 125 Hz, or, with `dp`, the only envelope peak near the value is fR1's peak. A track 2 with no supporting peak at all is **not** a failure of either test, so P3 does not rescue it. P3 alone never fires, as the brief says, and a unit test pins that.
- The options act inside the fR2 check, so with `f2Check` off they change nothing.
- Track 3 is tested exactly as track 2 is: the same gap against fR1, the same peak search with fR1's peak excluded, the same tolerance T2.
- `crossCheck` gains an optional sixth argument (`Fr2Options`: `r125`, `dp`, `p3`, `pathF3`), so every existing call is unchanged. Its return gains `track: 3` and `f2` **only** when P3 promoted track 3. With every option off the returned object is the one it always was (a unit test checks `toEqual({ case: 'a', fR2Kept: true, f2Prom: 5 })`, and the existing `no-fr1` `toEqual` still passes).
- `fitTrack` keeps the division form `v / div`, so with the option off the arithmetic is bit-identical to before.
- `PathEvidence` gains one field, `fR2Track`. Nothing outside the engine reads `PathEvidence` except the scoring tool, which reads named fields.

## Tests (constructed, from the brief's rules, never from the picker's output)

`path-extract.test.ts:99-152`, two new `describe` blocks, 10 tests:

- fR1 640, fR2 647, case (a), one envelope peak at 647: kept with every option off (the fault, documented), **not kept** under R125, under DP, and under both.
- A gap of exactly 125 Hz is kept under R125; 124 Hz is not.
- DP: excludes fR1's peak in cases a, b, c, and d (out-of-range); a second peak near fR2 still keeps it.
- Options change nothing with `f2Check` off.
- With every option off, `crossCheck(640, 1500, ...)` returns exactly `{ case: 'a', fR2Kept: true, f2Prom: 5 }` (no `track`, no `f2`).
- P3 promotes a track-3 value that passes (under R125 and under DP), and refuses one that does not (too close to fR1; no peak under it; fR1's peak again; no track 3).
- P3 alone never fires; and a track 2 with no peak under it, but a clean gap, is not offered a second chance.
- `sqrtWeight` false is exactly the default W; true changes W.

Run, only this step's changed test file: `path-extract.test.ts`, **35 passed (35)** (25 existing, 10 new).

## The golden, options off

`path-600.json` compare mode (`golden.run.ts -t "path picker"`) on this step's code: **passed**: `1 passed | 1 skipped (2)`, so `path-600.json` is byte-equal with every new option off (the skipped test is the shipped-and-open compare, not run here).

## What I could not establish

- Whether R125, DP, or P3 helps a real voice. That is Step 3 on the synthetic set and the desk's run on Dann's takes (the brief's section 8 says the same).
- Whether Fable's "weighting" means what I implemented. Fix 5 says "weights `fitTrack`'s rows by `1/sqrt(b)` instead of `1/b`", which I took literally on the row scale (so squared residuals weigh `1/b`). The brief itself lists "which weighting Weenink (2015) means" as not established.
