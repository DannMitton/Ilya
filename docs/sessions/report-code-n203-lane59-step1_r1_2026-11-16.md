# Report, Code, N.203 lane 59, Step 1 (one microphone per visit)

r1, 2026-11-16. Branch `cloud-lane-59`. Brief r3 section 3 Step 1 with Fable's amendments 1 to 5.

## What changed

- `voice/engine/session.ts`: `CaptureSession` gains `openVisit()` and `closeVisit()`; the contract comment for `cancel()` is rewritten (amendment 2).
- `voice/engine/live.ts`:
  - `visit` flag; `openVisit()` (idempotent, acquires nothing, resumes a suspended held context); `closeVisit()` (silent supersede, then full release).
  - `releaseAudio(force)` is split into `stopTimers()` and `releaseGraph()`. Inside a visit a run's end (`finish`, `finishReadiness`), `reset()`, `cancel()`, and every `fail()` stop the run and keep the stream and context. `fail()` releases them for `MIC_PERMISSION_DENIED`, `MIC_NOT_FOUND`, `NO_AUDIO_INPUT`, and for a graph that could not be built. Outside a visit every path behaves as before.
  - The tap's handler reads `this.gen` when it is called, not when it is built (amendment 1; `onChunk` still drops everything while no run is active).
  - `acquire()` reuses a held graph while its track's `readyState` is `live` and its context is not closed; otherwise it releases and acquires again (amendment 4).
- `voice/engine/stub.ts`: `openVisit()`, `closeVisit()`, and a readable `visitOpen`.
- `voice/visit.ts` (new): the visit helper. `createVisit({ session, endTake, closeTicks, wanted, pageVisible? })` returns `{ open, sync(), resume(), destroy() }`. Wanted turns false: `endTake()`, then `session.closeVisit()`, then `closeTicks()`. Also closes on `pagehide` and when the page is hidden, reopens when visible (DESK DEFAULT, as ruled in section 9).
- `voice/capture-ritual.svelte.ts`: the tick context is made and resumed inside `begin()` (the Start tap), and a new `closeTicks()` closes it without destroying the ritual (amendment 5).
- `voice/VowelCapture.svelte`: new prop `takeoverVisible` (default true); it builds the helper, calls `visit.sync()` in an effect, `visit.resume()` in `startTake`, and `visit.destroy()` on unmount.
- `voice/CalibrationWizard.svelte`: new prop `takeoverVisible` passed to `VowelCapture`. The file stands at 1,727 of 1,727; I freed two lines by shortening the session-prop comment.
- `routes/+page.svelte`: one attribute on the wizard's mount, `takeoverVisible={calibrating}` (the mount is at `:3881-3903`, as you corrected). 5,509 of 5,534.

**Where lane 60 calls the pair:** it creates its own helper with `createVisit` in the wizard (or widens the predicate passed to this one) and passes the same `wanted()`; the prop `takeoverVisible` on the wizard is the one D13 reuses.

## Tests added (26)

- `engine/live.test.ts` (13, new; a fake microphone, a fake AudioContext, fake timers, `synthFry`): two takes in one visit call `getUserMedia` once and both stay live; the second take receives audio and reaches stable fry; no audio between runs reaches the next take; a gate timeout inside a visit keeps the microphone; Stop mid-take keeps the tracks and reports `CANCELLED` once; `closeVisit` between takes releases both and the next take acquires again; `closeVisit` mid-take is silent and stops the tracks; a microphone failure releases; an ended held track is let go; `openVisit` resumes a suspended context and is idempotent; `openVisit` acquires nothing; outside a visit a take and a cancel acquire and release as before; Back, return, then two takes call `getUserMedia` exactly once more; Back mid-take ends it, keeps nothing, stops the tracks. I checked the tests bite: with the handler bound to the build-time generation, three of them fail.
- `visit.test.ts` (8, new; the test environment has no DOM and no jsdom, so `window` and `document` are stubbed event targets).
- `capture-ritual.test.ts` (+3, and the fake session gains the two methods): the tick context is made and resumed in `begin()`; `closeTicks()` closes it and a later `begin()` makes a working one; none when ticks are off.

## Gates

| Gate | Baseline | Got |
|---|---|---|
| 1 | 462 passed (462) | 462 passed (462) |
| 2 | 248 passed (248) | 248 passed (248) |
| 3 | 0 errors, 12 warnings, 5 files | found 0 errors and 12 warnings in 5 files |
| 4 | 6258 passed \| 1 skipped (6259) | 1 failed \| 6283 passed \| 1 skipped (6285): the 6259 plus my 26; the one failure is the same `open-extract.test.ts` 5 s timeout seen on the untouched tip |
| 5 | 894 passed \| 5 skipped (899) | same |
| 6 | 178 | 178 |
| 7 | 159 | 159 |
| 8 | OK | `ratchets: OK.` |

## What I could not establish

- Whether iOS suspends an open AudioContext between takes, and whether `resume()` from the Start tap is enough: untested. Playwright's WebKit is not run here, and the fake context only proves the call is made.
- Whether a held stream changes the guard's first second on a device: not measured. From the code, `start()` clears the buffers and the gate waits for a full second gathered after it (`live.ts` `gateTick`).
- Pictures: none for this step (no visible change).
