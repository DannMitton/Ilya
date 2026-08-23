# MEMO. N.80 step 2: which guard test refused the take, and by how much

Built against floor `d491d22`, branch `Shane`, working tree dirty only with this
work and the brief. Brief:
`docs/sessions/brief-n80-instrument-the-guard_r1_2026-08-23.md`. Read first, as
instructed: `docs/sessions/memo-n80-best-window_r1_2026-08-23.md`.

Done. `GuardResult` gains `diag`, which carries the four numbers `windowPasses`
computes and the names of the tests that failed, for the whole take and for the
closest candidate window. `reading`, `fullWindow`, `segmentS`, and `spanS` are
unchanged, and I proved that rather than asserting it. No threshold moved.

**Gate 4 moves from 718 to 724.** Six new tests. That `sed` is yours.

Your three [u] takes returned
`"guard":{"reading":"Provisional","fullWindow":false,"segmentS":null,"spanS":0}`.
The same take through the instrumented build now returns, on the same line:

```
"diag":{"full":{"spanS":2.5,"cv1":0.032,"cv2":0.018,"mincor":0.996,"cvr":0.322,"failed":["rate_cv"]},"best":{...}}
```

That is a synthetic take, not yours. What it demonstrates is that the console
now answers the question the brief asks, in one field, on the line you already
paste.

## The change

### `apps/web/src/lib/shane/engine/guard.ts`

`guard.ts:59-67`, `adjacentCorrelations`. The cosine similarity between each
adjacent pair of band envelopes, lifted out of `windowPasses` and computed once
per call instead of once per candidate window. Same arithmetic, same order, so
the same `Math.min` chain sees the same values.

`guard.ts:72-79`, `measure`. Returns `{cv1, cv2, mincor, cvr}`. The three `cv()`
calls and the `mincor` fold are the lines that were inside `windowPasses`.

`guard.ts:83-91`, `failedIn`. Names the failing tests: `fr1_cv`, `fr2_cv`,
`envcorr`, `rate_cv`, plus `frames` when the window holds fewer than two. Each
test is written as the negation of the old conjunct, `!(m.cv1 < T_FR1_CV)`
rather than `m.cv1 >= T_FR1_CV`, so a NaN, which compares false against
everything, still counts as a failure exactly as it did.

`guard.ts:93-96`, `windowPasses`. Now `failedIn(measure(...)).length === 0`,
with the `hi - lo < 2` early refusal kept verbatim.

`guard.ts:101-103`, `round3`. Three places, and `null` where the quantity could
not be formed. `cv()` returns `Infinity` on fewer than two measurable frames,
`JSON.stringify` writes an infinity as `null` anyway, and an unexplained `null`
on a console line is worse than a stated one. The name still appears in `failed`,
so nothing is hidden by the rounding.

`guard.ts:105-129`, the types. `GuardWindowDiag` is `spanS` plus the four
numbers plus `failed`. `GuardDiag` is `{full, best}`. `GuardResult` gains
`diag: GuardDiag`, required, not optional.

`guard.ts:142-146`. Under two frames the guard returns `Provisional` with an
empty diagnostic. This is not a new refusal: `windowPasses` refused on
`hi - lo < 2` and the sub-window loop could not run, so the verdict was already
`Provisional`. It is stated up front so the diagnostic below can index `idx`
without a bounds check on every line.

`guard.ts:157-166`, the `best` scan. Every window of at least `MIN_STABLE_S` is
measured, and the one with the fewest failing tests wins, ties going to the
longer span and then to the earlier start.

**`best` is a diagnostic choice, not the guard's choice**, and the two agree by
construction rather than by coincidence. The whole buffer is itself a candidate.
When any window passes it has zero failures, so the fewest-failures rule picks a
passing window, and the longer-span tie-break picks the longest one, which is
what `segmentS` already names. When nothing passes, `segmentS` is null and `best`
is the window that came closest, which is the case your [u] takes are in.

`guard.ts:167-177`. The verdict itself: the full-window test, then the
sub-window search, both character-identical to the floor apart from taking `cor`
where they took `envs`. Every return now carries `diag`.

### `live.ts` is untouched, and I confirmed it rather than assuming

`live.ts:684` reads `dbg('outcome:', JSON.stringify(outcome))`, `CaptureOutcome`
already carries the `GuardResult`, and `diag` is plain numbers, strings, and
arrays, so it serializes. Confirmed three ways: a test asserts that a round trip
through `JSON.parse(JSON.stringify(outcome))` preserves `diag.full.cvr`; and two
real captures through the running app printed it, both quoted in full below.

### Nothing is stored

`live.ts:685` passes `outcome.formant` to `onComplete`, not the outcome. `diag`
reaches the console and nothing else. The wizard does not read it and the
profile does not hold it.

### Cost

The `best` scan measures every window of at least `MIN_STABLE_S`, which is
O(nf²) windows over a buffer of nf frames, against the existing search's early
`break`. On the 2.5 s buffer the pipeline actually sees, nf is 49. Precomputing
the adjacent correlations once takes the inner correlation out of every window,
so the added work is roughly 1,200 windows of three `cv()` folds and a `min`
over a slice. It is not measurable next to the 49 order-12 LPC fits and 49 Welch
PSDs the guard already runs to build its frames.

## The proof that the four shipped fields did not move

Not an argument, a run. I put the floor's `guard.ts` back in the tree beside the
new one and compared the two implementations field by field on **56 cases**: 14
signals at each of 4 sample rates, 48000, 44100, 16000, and 8000 Hz.

The signals: steady fry at 3.5 s and 2.5 s; the two-phase take; irregular end to
end; 1.4 s, 0.5 s, 0.15 s, 0.1 s, and empty buffers; a drifting take at 35
percent jitter; 12 Hz and 90 Hz pulse rates, both outside the accepted band;
noise only; and digital silence.

All 56 returned identical `{reading, fullWindow, segmentS, spanS}`. A
coverage assertion in the same file confirmed the set actually exercises all
three verdicts: full-window `Captured`, sub-window `Captured`, and `Provisional`.
Had it not, the parity run would have proved only that two implementations agree
about nothing happening.

That comparison file imported a second copy of the old `guard.ts`, so it could
not stay. **Both scaffolding files were deleted** and the tree holds neither.

## The tests

Six added to `apps/web/src/lib/shane/engine/analyze.test.ts`, in one describe
block, `the guard says which of its four tests refused a take, and by how much`
(`analyze.test.ts:237`). Names and lines:

| line | test |
|---|---|
| `:243` | measures the whole take and names every test the whole take failed |
| `:255` | measures the sub-window it kept, and that one passes all four |
| `:266` | names nothing on a fry that is regular for the whole take |
| `:274` | names the pulse rate alone when the pulse rate alone is what wandered |
| `:285` | offers no candidate window when the take is shorter than the minimum |
| `:294` | rides out on the capture outcome, which is what the console prints |

The four thresholds are quoted at `analyze.test.ts:44` from `guard.ts:4` rather
than imported, on the same rule as `MIN_STABLE_S`, so a silent move there fails
a test here.

**One place where I did less than the brief asked, and why.** The brief says the
existing best-window fixture must report the full window failing *on the quantity
the fixture makes irregular*, singular. It fails on all four: `cv1` 0.358,
`cv2` 0.201, `mincor` 0.495, `cvr` 0.517. That is honest rather than sloppy. A
buffer that is 1.8 s of one thing and 1.7 s of another unsettles the formants
and the band envelope as surely as the rhythm, and no fixture built that way can
move one quantity alone. So `:243` asserts `toContain('rate_cv')`, which is what
the fixture licenses, and the sub-window assertion at `:255` is the exact one the
brief asked for: `failed` empty, and all four inside their thresholds.

**One thing you did not ask for, which the brief's own question needed.** A test
that says "all four failed" does not demonstrate that the instrument can tell the
four apart. So there is a second fixture, `rateWanderBuffer`
(`analyze.test.ts:124-136`): the resonators are fixed for the whole buffer, so
the two formants and the band envelope are identical in kind to every other
fixture in the file, and only the interval between pulses wanders, by up to 95
percent. `:274` asserts `failed` **equals** `['rate_cv']`, and that the other
three sit inside their thresholds. Measured: `cvr` 0.34 against 0.25, `cv1`
0.022 against 0.08, `cv2` 0.017 against 0.12, `mincor` 0.995 against 0.92.

That is the shape a fry that holds its vowel and loses its rhythm makes, and on
the research memo's reading it is the most likely shape for your [u].

### Mutation controls, run while the tests were written

- **Mutant A**, `best` chosen by longest span instead of fewest failures: 2 of 19
  failed, `measures the sub-window it kept` and `rides out on the capture
  outcome`. Without the fewest-failures rule, `best` on a two-phase take is the
  full 3.5 s window, which fails all four.
- **Mutant B**, `failedIn` pushing `fr1_cv` where the rate test failed: 3 of 19
  failed, including `names the pulse rate alone`. A misattributed name does not
  survive.

## The five gates

Run on this machine on 2026-08-23, after every edit in this memo.

| gate | baseline | this build |
|---|---|---|
| phonology | 216 | 216 passed |
| dictionary | 235 | 235 passed |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |
| web-test | 718 | **724 passed** |
| score-parser | 444 passed, 5 skipped | 444 passed, 5 skipped |

Gate 4 is the only move, and it is the six new tests. Nothing that passed before
fails now. `~/Downloads/ilya-ship.sh:79` wants `"724 passed (724)"`, and
`ENVIRONMENT.md`'s gate table wants the same number. Both files are tracked, so
the ship script will not refuse this time; the only untracked file is the brief.

One existing test needed a one-line edit. `analyze.test.ts:223` built a
`GuardResult` as an object literal, and `diag` is required, so the literal no
longer typechecks. It now spreads a real guard result and overrides
`fullWindow`, which is a truer statement of what that test means anyway: the same
verdict, told it was a sub-window.

## The bundle byte count

Clean rebuilds both times, `rm -rf apps/web/build apps/web/.svelte-kit/output`
before each. The before figure is a real build of `d491d22`, with both changed
files restored from the commit by `git show`, not a figure from memory.

| measure | before | after | delta |
|---|---|---|---|
| all client JS under `build/_app` | 1,769,008 | 1,769,923 | +915 |
| whole `build/` tree | 203,306,616 | 203,307,531 | +915 |

The `CACHE_VERSION` stamp is the same length in both builds. `build/` was
deleted again afterwards.

## The console line, as it now prints

Two real captures through the running app, `pnpm --filter @ilya/web dev` in the
browser pane, the calibration wizard's **Re-take** driven end to end on
`[i] cardinal-i`. Verbatim.

A take steady for 1.8 s after the confirm, then irregular. This is the take N.80
step 1 rescued, and `diag` now shows both halves of why:

```
[shane-live] outcome: {"outcome":"reading","formant":{"f1":299.23362280089765,"confidence":"medium","reading":"captured","source":"measured-user","f2Quality":"clear","noiseFloor":"measured","f2":761.0004778285909},"guard":{"reading":"Captured","fullWindow":false,"segmentS":[0,1.95],"spanS":1.95,"diag":{"full":{"spanS":2.5,"cv1":0.353,"cv2":0.168,"mincor":0.563,"cvr":0.444,"failed":["fr1_cv","fr2_cv","envcorr","rate_cv"]},"best":{"spanS":1.95,"cv1":0.006,"cv2":0.001,"mincor":1,"cvr":0.202,"failed":[]}}}}
```

A take whose vowel holds and whose rhythm wanders. This is the shape of your
three [u] takes, `segmentS: null` and `spanS: 0`, and it is the line the brief
was written to get:

```
[shane-live] outcome: {"outcome":"reading","formant":{"f1":300.61232792592176,"confidence":"low","reading":"provisional","source":"measured-user","f2Quality":"marginal","noiseFloor":"measured","f2":759.83528148375},"guard":{"reading":"Provisional","fullWindow":false,"segmentS":null,"spanS":0,"diag":{"full":{"spanS":2.5,"cv1":0.032,"cv2":0.018,"mincor":0.996,"cvr":0.322,"failed":["rate_cv"]},"best":{"spanS":2.5,"cv1":0.032,"cv2":0.018,"mincor":0.996,"cvr":0.322,"failed":["rate_cv"]}}}}
```

One name, `rate_cv`, and the distance: 0.322 against a ceiling of 0.25, with the
other three at a third, a seventh, and well clear of theirs.

The gate line on that take read `rms 0.0426 | pulses 34 | rate 34.6 Hz | cv 0.48
| decay 0.02 | flatness 0.011 | snr 45.0 dB | ACCEPT`, which is the point: the
live gate was happy and the guard was not, and until now the console could not
say which of four things the guard objected to.

**How the audio got there, again stated plainly.** The browser pane has no
working input, so `navigator.mediaDevices.getUserMedia` was replaced in the page
with a shim returning a `MediaStreamAudioDestinationNode` fed by the same
synthetic fry the test file builds. Everything downstream of the microphone is
the real engine. **This is not a walk.**

## How to read your own six takes

`diag.best.failed` is the short answer.

- **Empty**, and `segmentS` is not null: a window passed and you have a reading.
- **`["rate_cv"]`**: the vowel held and the fry rate wandered. `cvr` against 0.25
  says by how much.
- **`["fr1_cv"]` or `["fr2_cv"]`**: the fry held its rhythm and the vowel moved.
  This is the reshaping signature, and a build is not the answer to it.
- **`["envcorr"]`**: the spectrum changed shape frame to frame without either
  formant tracking cleanly out of band. Breath, a shifting noise floor, or the
  fry breaking up.
- **More than one name**: the take has more than one thing wrong, and the numbers
  say which is furthest from its threshold.

If all six name the same one test, that is a distribution and it is the evidence
a threshold move would need. If they scatter across the four, no single threshold
is the answer.

## What I could not establish

- **Which test refused your three [u] takes.** The buffers were not retained and
  the guard's measurements were computed and discarded. NOT ESTABLISHED, and
  unrecoverable. This build makes the next three answerable; it cannot reach back.
- **Whether `rate_cv` is the one.** I built a fixture that isolates it because
  the research memo makes it the likeliest, not because I have evidence about
  your voice. A fixture that fails a test is not a finding about a singer.
- **Whether `T_RATE_CV = 0.25` is right for fry.** The detector's own
  interval-CV ceiling was recalibrated to 1.0 on the finding that "real M0 is
  quasi-periodic with period-doubling" (`detector.ts:92-98`). The guard's
  frame-to-frame rate CV measures a different quantity on a different timescale
  and was not part of that recalibration. Whether the two are consistent is a
  question this build does not answer and no threshold moved.
- **Whether `best` should ever have been allowed to be the whole buffer.** I let
  it, because it makes the passing case agree with `segmentS` without a special
  case and gives a legible answer when nothing passes. If you want `best`
  restricted to windows strictly shorter than the take, say so.
- **Anything about iOS Safari, or about your microphone.** No observation exists
  for this build.
