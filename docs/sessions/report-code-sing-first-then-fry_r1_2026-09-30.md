# Report from Code: sing the vowel first, pause, then fry (row 2d, part 3)

Answers `brief-code-sing-first-then-fry_r1_2026-09-30.md`. Built on branch `Shane` at `93bc639`, on top of part 2b (uncommitted, `report-code-detector-median_r1_2026-09-30.md`). During the session another writer modified six `docs/memory/` files and added three `docs/sessions/` files; this session did not touch them. No git writes.

## Summary

- **Built as ratified.** One tap begins. The sung count runs at 1000 ms a beat and is not recorded, then a 2000 ms pause, then the fry, where capture begins exactly as before. A tap during the count or the pause cancels; long-press still skips.
- **All four strings seated verbatim,** English and French, under a comment carrying the 21:00 ratification.
- **Seen in the dev server, English and French** (headless Chromium against `localhost:5173`, synthetic microphone; timings below).
- **Gates:** all eight pass. Gate 4 moved 1753 → **1760**: seven new tests. The ship script now expects 1760 (backup `~/Downloads/ilya-ship.sh.bak-1753-2026-09-30`).
- **`pacifier.wheelAria` is proposed below and not shipped.** One more proposal goes with it: the caption the wizard's pointer shows.

## What changed

| File | Change |
|---|---|
| `apps/web/src/lib/voice/pacifier/count-in.ts` (new, 59 lines) | The schedule (`SING_BEAT_MS = 1000`, `PAUSE_MS = 2000`, both DESK DEFAULT), `runCountIn()`, and `tapAction()`. It lives outside the component because `Pacifier.svelte` was at 994 of the 1000-line cap, and so the sequence can be tested without mounting it. |
| `apps/web/src/lib/voice/pacifier/count-in.test.ts` (new) | Seven tests (below). |
| `apps/web/src/lib/voice/pacifier/Pacifier.svelte` | 994 → 972 lines. `beginPrepare()` runs the count-in; new node state `pausing`, drawn like `preparing` without the amber flash; `onActivate()` is one tap; `activateVowel()` no longer begins anything; `COUNT_INTERVAL` removed. |
| `apps/web/src/lib/i18n.ts` | `calib.capture.cueSuffix` and `pacifier.beginPhonating` replaced; `pacifier.singFirst` and `pacifier.pause` added; `pacifier.preparing`, `pacifier.selected`, `pacifier.armed`, and `pacifier.armedRetake` removed. |
| `apps/web/src/lib/voice/CalibrationWizard.svelte` | One comment reworded in place: the readiness count said it matched `COUNT_INTERVAL`, which no longer exists. Still 2123 lines, its ceiling. |

The readiness step's own count (`CalibrationWizard.svelte:697-718`) is unchanged. It reads `READINESS_PREP_MS`, not the Pacifier's constant.

## How one tap was fitted to the wizard

The wizard's `activateVowel()` (`Pacifier.svelte`, called at seven sites in `CalibrationWizard.svelte`) was the first of the two taps: it armed the vowel the tour waits on, and the singer's tap began. Left as it was, it would now start the count the moment the tour advanced, with no tap at all.

**DESK DEFAULT:** `activateVowel()` now only points. It draws the vowel in the `armed` style and announces `pacifier.tapToCapture` ("Tap a vowel to capture it."), an existing ratified string. The singer's one tap begins. Two consequences, both reversible:

- Before, `activateVowel()` on a Provisional vowel or on a vowel already armed began a capture straight away. Now it only points, so a re-take from the hold or the summary is also one tap by the singer.
- A tap on a skipped vowel now begins its capture in one tap. Before, it restored the vowel without capturing (`pacifier.selected`).

## Strings retired

Nothing else reads them after this change. Searched `apps/`, `packages/`, and `scripts/`; the only other hits are in built output under `.svelte-kit/`.

| Key | Why it went |
|---|---|
| `pacifier.preparing` | Replaced by `pacifier.singFirst`, as the brief says. |
| `pacifier.armed`, `pacifier.armedRetake` | They said "Tap again to begin", and there is no second tap now. |
| `pacifier.selected` | The select step is gone. |

## Seen in the dev server

The walk used headless Chromium against the dev server already running on this working tree at `localhost:5173`. The Browser pane was hidden, so clicks could not land there. A synthetic 40 Hz fry fed the microphone. The wizard was walked from its first screen (voice type Bass), through readiness, to the vowel wheel. Times are in ms from the tap, read from the live caption and from the moment the page asked for the microphone.

**English, [i], one tap:**

| ms | Caption |
|---|---|
| 46 | Sing the cardinal-i vowel as you usually do. Three. |
| 1053 | Two. |
| 2052 | One. |
| 3051 | Stop, and keep the shape. |
| 5051 | *(the microphone is requested; none before this)* |
| 5149 | Now the cardinal-i vowel in vocal fry. |
| 6431 | Now sustain. Sample recording. |
| 10553 | the cardinal-i vowel captured. |

The cue above the wheel read: "Tap the [i] cardinal-i vowel to begin. First sing it as you usually do, to set the shape of your vocal tract. Then stop, keep that shape, and begin again in vocal fry. Ilya measures only the fry."

**English, [e], a second tap 1.5 s in:** "Sing the close-e vowel as you usually do. Three.", "Two.", then "Capture cancelled." No microphone request followed.

**French, [e], one tap:** « Chantez la voyelle e fermé comme d’habitude. Trois. », « Deux. », « Un. », « Arrêtez, et gardez la forme. », « Maintenant, la voyelle e fermé en friture vocale. », « Soutenez maintenant. Échantillon en cours d’enregistrement. », at the same intervals; the microphone was requested at 5031 ms. The cue read: « Touchez la voyelle [e] e fermé pour commencer. Chantez-la d’abord comme d’habitude, pour régler la forme de votre conduit vocal. Puis arrêtez, gardez cette forme et recommencez en friture vocale. Ilya ne mesure que la friture. »

Not walked: a phone, a real microphone, and reduced motion. Dann's walk is at:

```
http://localhost:5173/
```

Arrival: Drawer, Voice, Calibrate. After the readiness step the cue above the wheel begins "Tap the [i] cardinal-i vowel to begin. First sing it…". One tap on [i] starts the sung count.

## Tests

`count-in.test.ts`; every interval is the brief's number, quoted rather than imported:

1. A tap begins from every resting state: dormant, estimated, the wizard's pointer, captured, provisional, and skipped.
2. The tap is answered at once with the sung cue.
3. The steps fire in order: sing at 0, two at 1000, one at 2000, pause at 3000, fry at 5000.
4. No capture session has started 1 ms before the fry step; exactly one has started at it.
5. A tap during the count or the pause maps to cancel; a tap during the fry is ignored.
6. and 7. A cancel during the count, or during the pause, starts no session afterwards.

**Mutation control:** with `SING_BEAT_MS` set back to 700, two of the seven fail. Restored afterwards.

**NOT ESTABLISHED by unit test:** the wiring inside `Pacifier.svelte`. The app has no component-test setup. The dev-server walk above is the evidence for it.

## Gates

| Gate | Result |
|---|---|
| 1 phonology | 251 passed (251) |
| 2 dictionary | 235 passed (235) |
| 3 web check | 0 errors and 12 warnings in 5 files |
| 4 web test | **1760 passed (1760)**; was 1753 after part 2b |
| 5 score parser | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | OK |

## For the desk to ratify (not shipped)

**1. `pacifier.wheelAria`.** It still reads the two-tap flow: "Tap a vowel to select it, tap again to begin capture, long-press to skip."

| | Proposed |
|---|---|
| English | Vowel calibration. Tap a vowel to begin, tap again to cancel, long-press to skip. |
| French | Calibration des voyelles. Touchez une voyelle pour commencer, touchez-la de nouveau pour annuler, appuyez longuement pour l’ignorer. |

**2. The pointer's caption (new key, proposed `pacifier.ready`).** It replaces the DESK DEFAULT above, which does not name the vowel.

| | Proposed |
|---|---|
| English | Tap {v} to begin. |
| French | Touchez {v} pour commencer. |

Coined by Code: every sentence in this section. The French keeps {v} mid-sentence, per the 2026-08-12 ruling.

## Residuals

- The pointer's caption does not change language when the language is switched mid-wizard. The Pacifier stores the caption as text, so this was already true of every caption before this change.
