# Report, N.199 Step 3: the ritual, written fresh

2026-11-13, cloud lane, branch `cloud-lane-51`. Nothing a singer sees: no component calls it yet (Step 4b mounts it behind the switch). `Pacifier.svelte` is not touched in this step.

## What changed, with path:line

**`apps/web/src/lib/voice/capture-ritual.svelte.ts` (new, rune state).** `createCaptureRitual(deps)` `:97`.
- **In:** `session`, `voiceType()`, `previous(vowel)` (the wizard's guarded reading), `reducedMotion()`, `ticks` (default on), and the three events (`CaptureRitualDeps` `:56`).
- **Out, reactive:** `phase` (`RitualPhase` `:43`: `idle | sing | pause | listening | sweep | landing`), `vowel` (null when idle), `progress` 0 to 1, `cue` as `{ key, vowel }` (`RitualCue` `:51`), and `cancellable` (my addition: true in every phase before the reading is delivered). The module never calls `t`.
- **Calls:** `begin(vowel)` `:156`, `cancel()` `:248`, `destroy()` `:260`. `begin` and `cancel` return a boolean so the screen knows whether the gesture took.
- **Events:** `onCaptured(vowel, formant)`, `onRolledBack(vowel, rejected)`, `onFailed(vowel, error)`. It holds no formant map and emits no profile.
- **The rulings of the brief, where each is:**
  - Timing: the count-in's three 1 s beats and 2 s pause come from `count-in.ts` through `runCountIn`; the session starts at the fry step (`startListening` `:179`); the wait for stable fry is the session's; the bar starts at `onStableFry` (`startSweep` `:199`) and fills over `SWEEP_MS` 3000 (`:36`). The bar's updates run at 50 ms, and at 250 ms under reduced motion (`:40-41`): it still advances.
  - Re-take rule: `maybeDeliver` `:221` compares a Provisional result against `previous(vowel)` and rolls back only when that is `captured`.
  - Cancel: `cancel` `:248` works in `sing`, `pause`, `listening`, `sweep` (including after the clock is out and before the result), and is refused in `landing` and `idle`; delivery happens at the moment the clock and the result are both in, so a cancel after that is impossible and "Nothing is saved from it" stays true through the 900 ms landing (`LANDING_MS` `:38`; none under reduced motion).
  - A tap on another vowel mid-take: `begin` returns false. So does a tap during the landing; that is mine, not the brief's, and flagged below.
  - Take ids: every callback checks the id of its take; a late `CANCELLED`, result, or stable fry from an earlier take does nothing.
  - Audio tick: `tick` `:127`, a 660 Hz sine on the three sung beats, not the pause; `destroy` closes the context.
- **`errorCueKey` `:95`:** the wheel's `errorCaption` mapping (`Pacifier.svelte`), key for each code, `pacifier.error.default` for any other.

**`voice/count-in.ts` and `voice/count-in.test.ts`:** moved from `pacifier/` by `git mv`, unchanged (7 tests). **`voice/pacifier/count-in.ts`** is now one line, `export * from '../count-in'`, so `Pacifier.svelte`, which imports `./count-in`, needs no edit. It goes with `pacifier/` in Step 8b. This is how I held both "count-in moves beside the ritual" and "`Pacifier.svelte` is not touched".

**`voice/capture-ritual.test.ts` (new, 39 tests):** a fake `CaptureSession`, fake timers, nothing mounted.

## The transition table the tests pin

| Case | Tests |
|---|---|
| Intervals and cues at 0, 1000, 2000, 3000, 5000 ms; nothing starts the session at 4999 | 1 |
| Voice type read at the fry step | 1 |
| A tap on the same or another vowel in any phase is refused | 1 |
| Bar at 0 during a long wait for stable fry, half at 1.5 s, full at 3 s | 1 |
| Delivery with the result first, with the clock first, landing 900 ms, then idle; `begin` refused in the landing | 3 |
| Reduced motion: lands at once, the bar still advances in at most seven distinct values over 1.2 s | 1 |
| Re-take rule: rolled back over `captured`; taken over nothing, over `provisional`, over `estimated`; a Captured re-take is captured | 3 |
| Cancel at 500 ms, 2500 ms, 4000 ms, in the wait for stable fry, in the sweep, in the sweep after the clock; each ends the take once, calls `session.cancel` only if the session had started, and nothing it set going fires later | 6 |
| Cancel refused after delivery (`captured` stays 1, `failed` stays 0, no session cancel) | 1 |
| The session's own late `CANCELLED` after a cancel is dropped | 1 |
| A late `CANCELLED`, result, and stable fry from take 1 do not disturb take 2 | 1 |
| Each error code (`MIC_PERMISSION_DENIED`, `MIC_NOT_FOUND`, `NO_AUDIO_INPUT`, `SAMPLE_TOO_SHORT`, `EXTRACTION_FAILED`, `CANCELLED` from the session): in the wait for stable fry and in the sweep: the take ends, the cue is the code's own, `onFailed` fires once, a new take can begin | 12 |
| Tick: three on the beats and none on the pause, closed on destroy; none with ticks off; a throwing context never blocks the count | 3 |
| Destroy: in the count, stops everything, tells no one, refuses a new take; in the sweep, tears down the session once, fires nothing, safe twice | 2 |

**Mutants run against it, each failing at least one test:** cancel allowed in the landing; the id check removed from `onError`; the re-take rule rolling back every Provisional; `session.cancel` never called (3 tests failed); the bar not advancing under reduced motion; the pause shortened to 1000 ms in `count-in.ts` (2 failed). Each was restored; the file on disk is the unmutated one.

## Choices beyond the brief, for Dann to strike

1. **A cancelled take is reported through `onFailed`** with `{ code: 'CANCELLED' }`, once, whether the singer or the session ended it. The brief names three events, and Step 5 records every take's outcome, cancels included; this keeps three events and uses the session's own vocabulary. A real failure is any other code.
2. **`begin` is refused during the 900 ms landing.** A tap on a vowel during it does nothing. The brief ruled "a tap on another vowel during a take is ignored" and did not say whether the landing is part of the take. If it should start the next take, `begin` accepts `landing` and the landing is cut short; that is a one-line change and I did not make it.
3. **The cue for a Provisional reading is `capture.uncertain`**, the brief's proposed key, not the tree's `pacifier.sampleUncertain`, whose "Tap to retry" is false once the selection has moved. It is a draft string and goes into `draft-strings.ts` in Step 4b; the ritual only emits the key.
4. **`vowel` is null when idle.** The brief said `vowel` is out, reactive, and did not say what it is at rest.
5. **`cancellable`** is an addition: the screen needs to know whether Stop and the vowel's second tap do anything.

## Gates after Step 3

| Gate | Baseline | After Step 3 |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | **5522 passed, 1 skipped** (298 files) |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |

5483 after Step 2 plus 39: exactly the new ritual tests. The moved `count-in` tests are the same 7.

## Could not establish

- **That the ritual behaves against the real session.** `LiveCaptureSession` (`engine/live.ts`) was not exercised: no microphone here. The tests use a fake that follows the contract in `engine/session.ts`. What I read of the real one: the listening timeout is 10 s from mic-live (`live.ts:117` region) and it calls `onError(CANCELLED)` only from a non-terminal state (the contract's comment). Whether it calls `onStableFry` before `onComplete` on every path is the contract's claim, not something I traced in `live.ts`.
- **That `cancel()` during the sung count, which never starts the session, is the right teardown.** I call `session.cancel()` only when the session had started. If a real session holds something earlier (a warmed microphone), this leaves it; the wheel called `session.cancel()` unconditionally. I judged an unconditional call a needless teardown. NOT ESTABLISHED against the live session.
- **How the 50 ms bar steps look.** Timing is tested; smoothness is not. The screen's CSS can ease between steps.
- **The stub cannot produce an error.** `engine/stub.ts`'s `forced` outcome gives `captured`, `provisional-low`, or `provisional-divergent` only; Step 6's browser test of an error needs the stub extended, which is in Step 6's scope.
- **Whether jsdom-less rune state is read correctly inside a Svelte effect.** The tests read `ritual.phase` outside any effect, which Svelte 5 allows; reading inside an `$effect` or a template is Step 4b's first use.
