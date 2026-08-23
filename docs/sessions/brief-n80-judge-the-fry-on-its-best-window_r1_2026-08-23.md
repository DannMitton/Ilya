# BRIEF TO CODE. N.80: judge the fry on its best window, not on all 3.5 seconds

Serves N.80, the [u] capture. Ruled by Dann 2026-08-23, option B. Floor:
`d0a1895`. Every anchor below was read on that commit; trust the name over
the number. Research memo, for context only:
`docs/sessions/memo-n80-u-capture-research_r1_2026-08-23.md`.

## The finding this acts on

Dann's console, 2026-08-23, three [u] takes on the deployed build, all with
the live gate accepting at 30.3 to 37.8 dB SNR. Takes 1 and 2 came back
`{"outcome":"reprompt","reason":"not-fry","failed":["c5_cv"]}`. Take 3 came
back `reading: provisional`, `f2Quality: marginal`, 316 / 752 Hz. Level is not
the cause. **The live gate asks for one regular second; the post-sweep
`detect()` at `analyze.ts:67` asks for a regular 3.5 seconds.** A rounded [u]
fry that holds for 1.5 s fails the whole-buffer `c5` and never reaches the
extractor, or reaches it and then fails the stationarity guard on the same
unsteadiness.

The guard already knows how to find the best steady stretch: `guard.ts:90-99`
returns `segmentS`, the longest passing sub-window of at least
`MIN_STABLE_S = 1.5` s. Nothing uses it for the fry check.

## The change, in `apps/web/src/lib/shane/engine/analyze.ts` only

`runCapture` (`analyze.ts:60-72`) today: structural checks, `detect(y)` on the
whole buffer, reject on `!det.accept`, then `analyze(y)`.

After:

1. Structural checks unchanged.
2. Run `guard(y, sr)` first. If it returns a `segmentS`, slice `y` to that
   segment and call it `yw`. If it returns `segmentS: null`, `yw` is `y`, and
   everything below behaves exactly as today.
3. `detect(yw, sr)`. Reject on `!det.accept` as today, same `reprompt` shape.
4. `analyze(yw, sr, vowel, voiceType)`, with one rule: **the confidence tier
   uses the ORIGINAL guard result's `fullWindow`**, not the guard re-run on
   `yw` (which would report `fullWindow: true` for a 1.5 s slice and promote
   a sub-window take to `high`). A sub-window take tops out at `medium`, as
   it does today. Thread the original `GuardResult` into `analyze` however is
   cleanest; `analyze`'s public signature may grow an optional parameter, and
   its behaviour with the parameter absent must be byte-identical.
5. Add the guard verdict to the console line at `live.ts:684`: `reading`,
   `fullWindow`, `segmentS`, and `spanS`, alongside the existing outcome. This
   is the instrument for the verification below. `DEBUG` is already `true`
   at `live.ts:173`.

`MIN_BUFFER_S` stays 0.5. `detector.ts`, `guard.ts`, `extract.ts` are not
touched. No threshold moves.

## Tests

In `analyze.test.ts` (or the engine test file that already covers
`runCapture`; find it), add a synthetic case: 1.8 s of regular fry pulses
(40 Hz, jitter about 5 percent) followed by 1.7 s of irregular pulses
(interval CV above 1.0), at 48 kHz, through a two-resonance filter near
300 and 750 Hz. Assert: before the change this buffer returns `reprompt`
with `c5_cv`; after, it returns `reading` with `confidence` no higher than
`medium` and `f1` within 30 Hz of 300. Keep the existing tests passing
unchanged; a regular full-length buffer must still come back `high`.

## Done when

- Five gates at baseline: 216, 235, 0 errors and 7 warnings in 4 files,
  705 plus the new tests (say the number before the ship script runs), 444
  passed and 5 skipped.
- The console `outcome:` line carries the guard fields.
- Bundle byte count before and after.
- A local run in the browser pane: one real or stub capture shows the new
  line. Dann's own six takes are the walk, not yours.

## Verification against Dann's voice, stated before the edit

Before: three [u] takes on `9d314de`, two `reprompt c5_cv`, one
`provisional`. After: Dann sings [u] six times on the new deploy and pastes
the six `outcome:` lines. The change is a fix if takes that were rejected
for `c5_cv` now return a reading, and the fR1 values scatter within about 30
Hz rather than drifting upward across the six. If they drift, say so: that is
the reshaping signature the N.49 document warns about, and it is not a fix.

## Do not

- Do not change any threshold in `detector.ts` or `guard.ts`.
- Do not touch `extract.ts`, `live.ts` beyond the one log line, or
  `CalibrationWizard.svelte`.
- Do not store anything new in the profile.
- Do not promote a sub-window take above `medium`.

## Return memo

`docs/sessions/memo-n80-best-window_r1_<date>.md`: anchors touched with
`path:line`, gate numbers, the test name, the bundle byte count, the console
line as it now prints, and `What I could not establish`. NOT ESTABLISHED
beats a complete invented answer.
