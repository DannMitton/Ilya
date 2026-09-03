# Brief: N.110, the [i] extractor. Increment 1, the diagnostic harness

Written 2026-09-02 by the desk. Floor: `dfb790a`. Item: **N.110**, opened by
Dann 2026-09-02 on his own roster: [i] fR1 reads 1063 Hz, captured in fry as
the ritual asks, and "[i]'s fR1 is known to be the lowest of all the sung
vowels." His words on the cause: "something in the analysis is refusing to
see a peak near 270 Hz." **This increment builds no fix.** It builds the
instrument that lets a fix be verified against his voice, which
`claude/e43-n49-assigned-extraction_2026-08-12.md` (read in full by the
desk) requires before the extractor is touched, and which no path in the
application provides today: "No path in this application writes a capture
buffer to disk."

## 1. What is established

- `apps/web/src/lib/shane/engine/extract.ts:3-8`: one prior table (`MITTON`,
  [i] = 296 / 1705), `PREEMPH = 0.97`, `LIFTER_MS = 8`, `PROM_DB = 3`, F1
  search window `[150, 1200]`.
- `:47-58` (`ltasFormants`): peaks of the cepstral envelope with at least
  3 dB prominence inside the window; the one nearest the prior wins.
  `:60-` (`lpcFormants`): the LPC path, order 18 at 8 kHz, pre-emphasized.
- Dann's stored [i] is 1063 Hz, Provisional, with no plausibility verdict
  (a pre-E.26 record whose verdict was erased; `CalibrationWizard.svelte:826-846`).
  [u] at 274 Hz came through the same extractor, so a low fR1 is findable;
  something specific to [i] loses the peak. Desk hypothesis, marked as one:
  pre-emphasis tilts a lone low peak into the rising slope, where [u]'s two
  close resonances prop each other up.
- The ritual asks for fry on [i] by design (Dann, 2026-09-02).
- `analyze.ts:36-42` has no F1-dependent route to Provisional; rejected
  takes are discarded (N.49 §1, §5A).

## 2. What to build

### 2.1 The capture file, dev-only

A control in the capture phase, shown only when a query flag is present
(`?harness=1`, or an env-gated build constant; say which and why), that
after a take saves the capture buffer as a 16-bit mono WAV at the engine's
sample rate to a browser download named
`ilya-capture-<vowel>-<iso-timestamp>.wav`. Nothing is stored in the app,
nothing is transmitted, and the control does not exist in a normal build.
State in the memo exactly which buffer is saved (the frames the extractor
saw, after any gating, or the raw microphone stream; both if cheap).

### 2.2 The offline harness

A Node script under `tools/`, `tools/extractor-harness/harness.mjs`, that
takes a WAV and a vowel and runs **the same `extract.ts` code the app
runs**, imported, not copied, so the harness cannot drift from the app.
Output: one self-contained SVG (or HTML with inline SVG) per run,
`harness-<vowel>-<timestamp>.svg`, drawing on one frequency axis from 0 to
3000 Hz:

1. the raw averaged magnitude spectrum in dB;
2. the cepstral envelope the app searches;
3. every peak `findPeaks` returned, with its prominence in dB written
   beside it, the ones inside the F1 window marked;
4. the F1 window `[150, 1200]` and the Mitton prior for the vowel as
   vertical rules;
5. the value the app would report, marked, with the number;
6. the LPC path's answer beside it, marked differently.

Then, as **labelled overlays that change nothing in the app**, the same
envelope computed with pre-emphasis off, with `LIFTER_MS` at 12 and 16, and
with `PROM_DB` at 1.5, each with its own reported f1. These are hypothesis
tests, not proposals; the memo reports what each did to the [i] peak and
draws no conclusion the plot does not show.

### 2.3 The series, N.49 §5A

In the capture phase, retain every attempt at a vowel in memory for the
session: attempt number, outcome (accepted, stationarity, fry, SNR), and the
computed fR1 and fR2. Show them in the harness mode only, as a small table
under the roster, and include them in the WAV's sidecar JSON. Nothing is
persisted to the profile. This is the series N.49 §4 needs to tell scatter
from drift, and it costs no DSP.

## 3. Definition of done

1. Gates at baseline (disclose gate 4's move; the harness has unit tests
   for the WAV writer and the SVG's peak table against a synthetic signal
   with a known 270 Hz resonance, which the harness must find and draw).
2. On a local production build with the flag, Dann records fry [i] and fry
   [u] (the control: the vowel that succeeds), three takes each; six WAVs
   land in Downloads with sidecars; the harness produces six plots.
3. The memo reports, per plot: the peaks found in the F1 window with
   prominence, what the app reported, what LPC reported, and what each
   overlay did, in a table. **No fix is proposed in this memo.** If the
   plots make the cause obvious, say so in one sentence under NOT
   ESTABLISHED as a hypothesis for increment 2.
4. Nothing in a normal build changes: the ritual, the extractor, the
   profile, the strings. Prove it with a grep for the flag and a build
   without it.

## 4. Constraints

- `THIS DESK DOES NOT BUILD`; you do. You do not run git.
- **Do not change `extract.ts`, `dsp.ts`, or `analyze.ts`** in this
  increment. The harness imports them.
- The recording is Dann's, on Dann's machine, made only by his press of a
  dev-only control. Do not write it anywhere but the download. Do not add
  telemetry.
- Do not store anything derived in the profile.
- House style in the memo; `NOT ESTABLISHED` never smoothed.

## 5. Return format

A memo at `docs/sessions/memo-n110-harness_r1_<date>.md`: what was built
with `path:line`, how to run the harness in three commands, the six plots
(as files under `docs/sessions/n110-plots/`, named), the per-plot table,
gates, and a NOT ESTABLISHED section. **"NOT ESTABLISHED beats a complete
invented answer."** Commit message: `N.110: the extractor harness`.
