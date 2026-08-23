# MEMO. N.80: judge the fry on its best window

Built against floor `d0a1895`, branch `Shane`, working tree dirty only with this
work and the three session documents already untracked at the open. Brief:
`docs/sessions/brief-n80-judge-the-fry-on-its-best-window_r1_2026-08-23.md`.

Done. One file changed, one test file added. `runCapture` now runs the
stationarity guard first and shows the detector and the extractor the longest
passing stretch, not the whole recording. A take that holds steady for a second
and a half and falls apart afterwards returns a reading at `medium` instead of
`{"outcome":"reprompt","reason":"not-fry","failed":["c5_cv"]}`.

**Gate 4 moves from 705 to 718.** Thirteen new tests. That `sed` is yours, and
the ship script also refuses until `analyze.test.ts` is tracked.

## Two things you did not ask for and should know before the walk

**The pipeline never saw 3.5 seconds.** The brief says the post-sweep `detect()`
asks for a regular 3.5 s. It asks for about 2.5 s. `live.ts:665` trims
`TRIM_S = 0.5` from each end of the recording before `runCapture` is called, so
a 0.5 s preroll plus a 3.0 s sweep arrives as roughly 2.5 s of audio. My own
local run measured it: `analysing 169984 samples at 48000 Hz`, and the guard
reported the full window as `spanS: 2.45`.

This changes the size of the concession, not its direction. `MIN_STABLE_S` is
1.5 s (`guard.ts:3`), so the steady stretch has to be about 60 percent of what
reaches the extractor, not 43 percent. A take that wobbles in the first half
second and settles has room; a take that is steady only for the last second
still fails. Nothing in the brief depends on which number is right, and I moved
no threshold, but the walk protocol does: if all six [u] takes come back
`reprompt` with `spanS` under 1.5, the answer is that 1.5 s is a large fraction
of 2.5 s, and that is a threshold question for you, not a bug in this build.

**`live.ts` is untouched.** The brief allowed one log line at `live.ts:684`. The
guard verdict rides out on the `CaptureOutcome` instead, and that line already
reads `dbg('outcome:', JSON.stringify(outcome))`, so the four fields print with
no edit at all. A second print of the same four numbers on the same line would
be noise. If you want them broken out of the JSON, say so and it is one line.

## The change

### `apps/web/src/lib/shane/engine/analyze.ts`

`analyze.ts:4`. The import now also takes the `GuardResult` type.

`analyze.ts:21-31`. `analyze` grows a fifth parameter, `outerGuard?: GuardResult`,
and `analyze.ts:33` reads `const g = outerGuard ?? guard(y, sr)`. Absent the
parameter the guard runs on `y` exactly as it did, so `detector.test.ts:150` and
`:155`, the only other callers, are unchanged. The parameter exists for one
field. Re-running the guard on a 1.5 s slice reports `fullWindow: true` for that
slice, and `analyze.ts:49` reads `fullWindow` to decide `high`. Without the
threading, a sub-window take would be promoted to `high` on the strength of the
sub-window being wholly itself, which is a claim about steadiness the singer
never made.

`analyze.ts:62-68`. `CaptureOutcome` carries `guard: GuardResult` on the
`reading` and `reprompt` arms, and `guard?: GuardResult` on `error`, because the
two structural errors return before the guard has run. `live.ts:677` and
`:684-691` are the only consumers of this type in the tree and neither needed a
change.

`analyze.ts:71-93`. `runCapture`, in order: the two structural checks unchanged,
then `guard(y, sr)`, then the slice, then `detect(yw, sr)`, then
`analyze(yw, sr, vowel, voiceType, g)`. The slice is
`y.subarray(Math.round(g.segmentS[0] * sr), Math.round(g.segmentS[1] * sr))`
when `segmentS` is present and `y` itself when it is null.

Both degenerate cases collapse to the old pipeline by construction, which is why
there is no branch for them. When the whole buffer passes, `guard.ts:83` returns
`segmentS: [0, y.length / sr]` and the slice is the whole buffer. When nothing
passes, `guard.ts:92` returns `segmentS: null` and the slice is skipped.

`MIN_BUFFER_S` stays 0.5. `detector.ts`, `guard.ts`, and `extract.ts` are
untouched, and no threshold anywhere moved.

### Cost

`guard()` used to run once, inside `analyze`. It still runs once, now inside
`runCapture`, and its result is handed down. `detect()` still runs twice, once
in `runCapture` and once in `analyze`, as before. Both now run on the slice
rather than the buffer, so a sub-window take does slightly less work than it did.

## The tests

`apps/web/src/lib/shane/engine/analyze.test.ts`, new, 13 tests, the first this
file has had.

Test name, for the record: **`a take that is steady for part of its length is
judged on that part`**, five tests, and the fixture the brief specified.

The fixture is 3.5 s at 48 kHz: 1.8 s of pulses at 40 Hz with about 5 percent
jitter on each interval, then pulses alternating 9 ms and 200 ms, all of it an
impulse train through two 2-pole resonators at 300 and 750 Hz with 80 Hz
bandwidth, normalized to 0.3 with a bed of uniform noise at 0.0005. Every
random number comes from a fixed-seed xorshift32, so the fixture never drifts.

Your standing condition holds: no asserted value comes from the mechanism under
test. The interval CV above 1.0 is computed in the test from the pulse schedule
the test wrote. The 300 Hz that `f1` must land within 30 Hz of is the resonator
the test put in the signal. The 1.5 s is `MIN_STABLE_S`, quoted from `guard.ts:3`
rather than imported, so a silent move there fails a test here.

What the five assert: the whole buffer still fails `detect()` on `c5_cv`; the
guard finds a sub-window and reports `fullWindow: false` with `spanS` at least
1.5; `runCapture` returns `reading`; `f1` is within 30 Hz of 300; the confidence
is not `high`.

Three controls, because a negative result on its own proves nothing:

- **Positive.** The same fry, regular for the whole 3.5 s, still returns
  `reading` at `high` with `fullWindow: true`.
- **Negative.** The same fry, irregular end to end, has `segmentS: null` and
  still returns `reprompt`.
- **The rule, stated directly.** The regular 3.5 s buffer earns `high` on its own
  guard. Handed a `GuardResult` that says `fullWindow: false`, the same buffer
  returns `medium`.

### Controls run while the file was written

**The defect, reproduced.** With the pre-N.80 `analyze.ts` swapped back in and
this same fixture, `runCapture` returned
`{"outcome":"reprompt","reason":"not-fry","failed":["c5_cv"]}`, which is your
console line from 2026-08-23 character for character. The positive control
returned `reading`, `high`, `f1` 298.892 Hz on both the old code and the new,
which is the proof that the change moves only the case it was written for.

Six of the thirteen fail against the pre-N.80 file. One of those six,
`still reads a fry that is regular for the whole take at high confidence`, fails
there only because `out.guard` does not exist on the old outcome type; its
confidence assertion passes either way. So five tests bite on behaviour and one
bites on shape.

**Mutant A**, `const cf = analyze(yw, sr, vowel, voiceType)`, dropping the
threaded guard: 12 passed, 1 failed, and the one is
`tops the confidence out at medium, because a second and a half is not 3.5
seconds`. That is the brief's "do not promote a sub-window take above medium",
and exactly one test catches its violation.

## The five gates

Run on this machine on 2026-08-23, after every edit in this memo.

| gate | baseline | this build |
|---|---|---|
| phonology | 216 | 216 passed |
| dictionary | 235 | 235 passed |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |
| web-test | 705 | **718 passed** |
| score-parser | 444 passed, 5 skipped | 444 passed, 5 skipped |

Gate 4 is the only move, and it is the 13 new tests. Nothing that passed before
fails now. The `sed` in `~/Downloads/ilya-ship.sh:79` changes
`"705 passed (705)"` to `"718 passed (718)"`, and `ENVIRONMENT.md`'s gate table
wants the same number.

The script also refuses on untracked files, and `analyze.test.ts` is untracked.
It needs `git add` before the run, alongside the three session documents that
were already untracked when I opened.

## The bundle byte count

Clean rebuilds both times: `rm -rf apps/web/build apps/web/.svelte-kit/output`
before each. The before figure is a real build of the floor, with `analyze.ts`
restored and `analyze.test.ts` removed from the tree, not a figure from memory.

| measure | before | after | delta |
|---|---|---|---|
| all client JS under `build/_app` | 1,768,882 | 1,769,008 | +126 |
| whole `build/` tree | 203,306,490 | 203,306,616 | +126 |

The `CACHE_VERSION` stamp is the same length in both builds, so it is not
confounding the delta. `build/` was deleted again afterwards, so nothing from
either build is in the tree.

## The console line, as it now prints

Two real captures through the running app, `pnpm --filter @ilya/web dev` in the
browser pane, `PUBLIC_INCLUDE_SHANE=true` from `apps/web/.env`, the calibration
wizard driven end to end. Verbatim, both lines:

A take steady for 1.8 s after the confirm, then irregular:

```
[shane-live] outcome: {"outcome":"reading","formant":{"f1":299.18143402294345,"confidence":"medium","reading":"captured","source":"measured-user","f2Quality":"clear","noiseFloor":"measured","f2":760.614091083784},"guard":{"reading":"Captured","fullWindow":false,"segmentS":[0,1.9],"spanS":1.9}}
```

The same take, steady throughout:

```
[shane-live] outcome: {"outcome":"reading","formant":{"f1":298.9112147706464,"confidence":"high","reading":"captured","source":"measured-user","f2Quality":"clear","noiseFloor":"measured","f2":760.8615563252997},"guard":{"reading":"Captured","fullWindow":true,"segmentS":[0,2.498666666666667],"spanS":2.45}}
```

All four fields are there: `reading`, `fullWindow`, `segmentS`, `spanS`. The
first take is the whole point of the change, and the wizard accepted it and
advanced to vowel 2 of 7.

**How the audio got there, stated plainly, because it is not a microphone.** The
browser pane has no working input, so I replaced `navigator.mediaDevices
.getUserMedia` in the page with a shim returning a `MediaStreamAudioDestination
Node` fed by the same synthetic fry the test file builds, and switched it to the
irregular pulse train 1.8 s after `stable fry confirmed` appeared on the console.
Everything downstream of the microphone is the real engine: the worklet tap, the
live gate, the sweep, `runCapture`, the plausibility check, the wizard. The gate
line read `rms 0.0660 | pulses 40 | rate 40.0 Hz | cv 0.03 | decay 0.03 |
flatness 0.011 | snr 45.4 dB | ACCEPT`.

**This is not a walk.** It is one synthetic signal through the real chain, which
is what the brief asked for. Your six takes are the walk.

## Verification against your voice

Stated in the brief before the edit, and unchanged by anything I found.

Before: three [u] takes on `9d314de`, two `reprompt c5_cv`, one `provisional`.

After: sing [u] six times on the new deploy and paste the six `outcome:` lines.
The change is a fix if takes that were rejected for `c5_cv` now return a reading,
and the fR1 values scatter within about 30 Hz rather than drifting upward across
the six. If they drift, that is the reshaping signature the N.49 document warns
about, and it is not a fix.

The new line gives you a third thing to read that was not there before. If a take
still comes back `reprompt`, `spanS` says whether the guard found nothing at all
(`segmentS: null`, `spanS: 0`, so the take never held) or found a stretch the
detector then refused anyway (`segmentS` present and a `failed` list). Those are
different problems and the console used to collapse them.

## What I could not establish

- **Whether this fixes your [u].** The fixture is synthetic. It reproduces the
  console line you got, which is evidence that the mechanism is the one that
  fired, and it is not evidence about your voice. Only the six takes settle it.
- **Whether the two takes that failed on 2026-08-23 had a passing sub-window.**
  The buffers were not retained and `guard()`'s verdict was computed and
  discarded. NOT ESTABLISHED, and unrecoverable from anything in the tree.
- **Whether the SNR route is still live.** This change addresses the guard route
  only. The research memo's other candidate, proxy SNR under 12 dB, is untouched
  and would still land a quiet take at `low`. Your gate lines read 30.3 to 37.8
  dB, so it did not fire on those three takes, but a quieter sitting could.
- **Whether 1.5 s is the right floor now that the analyzed window is 2.5 s.** I
  did not move `MIN_STABLE_S` and the brief forbids it. Whether 60 percent of a
  take is the right demand is a threshold question, and per the research memo a
  threshold may only move on a distribution.
- **The N.49 document.** It is not in this repository. `docs/` has no file
  matching it and the only mentions are the three pointers in `CONTRACT.md:347`,
  `STATE.md:49`, and `INBOX.md:28`. I acted on the brief's statement of the
  reshaping warning, which is second-hand. I did not read the document.
- **Whether the browser honoured the capture constraints on your device.** Still
  open from the research memo. My local run reported
  `track settings: {"channelCount":2,...,"sampleRate":48000,"sampleSize":16}`
  for a synthetic stream, which says nothing about your microphone.
- **Anything about iOS Safari.** No observation exists for this build.
