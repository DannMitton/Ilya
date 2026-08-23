# BRIEF TO CODE. N.80, step 2: say which guard test [u] fails, and by how much

Serves N.80. Ruled by Dann 2026-08-23, option B, after the walk of `d491d22`.
Floor: `d491d22`. Read the memo of the last ship first,
`docs/sessions/memo-n80-best-window_r1_2026-08-23.md`.

## The finding this acts on

Three [u] takes on `d491d22`, Dann's console: every one returned
`"guard":{"reading":"Provisional","fullWindow":false,"segmentS":null,"spanS":0}`.
No window of 1.5 s or more passed `windowPasses` (`guard.ts:58-68`), so
the best-window slice had nothing to slice. `c5_cv` did not fire on any take.
fR1 was 290, 764, and 289.

`windowPasses` tests four quantities against four thresholds and returns one
boolean: `cv1 < T_FR1_CV (0.08)`, `cv2 < T_FR2_CV (0.12)`,
`mincor > T_ENVCORR (0.92)`, `cvr < T_RATE_CV (0.25)`. **Which one fails on
[u], and by how much, is not established.** No threshold moves in this brief.

## The change

1. In `guard.ts`, make the guard report its measurements. `GuardResult`
   gains a `diag` field carrying, for the full window AND for the best
   candidate sub-window of at least `MIN_STABLE_S` (the one with the fewest
   failing tests; ties to the longer span): `cv1`, `cv2`, `mincor`, `cvr`,
   each rounded to three places, plus `spanS` and which of the four failed.
   Numbers in the result, not strings; the wizard does not read `diag`.
   `reading`, `fullWindow`, `segmentS`, and `spanS` are byte-identical in
   meaning and value.
2. Because `CaptureOutcome` already carries the `GuardResult` and
   `live.ts:684` stringifies it, the console line prints `diag` with no edit
   to `live.ts`. Confirm that, do not assume it.
3. Tests: extend `analyze.test.ts` or add to the guard's own test file.
   The existing best-window fixture must report `diag` with the full window
   failing on the quantity the fixture makes irregular and the sub-window
   passing all four. One regular full-length buffer must report all four
   passing on the full window.

## Done when

- Five gates at baseline; state gate 4's number before the ship script
  runs.
- One local capture through the pane prints `diag` on the `outcome:` line,
  pasted into the memo.
- Bundle byte count before and after.

## Do not

- Do not move `T_FR1_CV`, `T_FR2_CV`, `T_ENVCORR`, `T_RATE_CV`, or
  `MIN_STABLE_S`.
- Do not touch `detector.ts`, `extract.ts`, `live.ts`, or the wizard.
- Do not store `diag` anywhere.

## Return memo

`docs/sessions/memo-n80-guard-diag_r1_<date>.md`: anchors with `path:line`,
the gate numbers, the test names, the byte counts, the console line as it
prints, and `What I could not establish`. NOT ESTABLISHED beats a complete
invented answer.
