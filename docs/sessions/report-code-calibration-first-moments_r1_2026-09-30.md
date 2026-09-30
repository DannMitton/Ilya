# Report: the first moments of calibration

Written by Code 2026-09-30, for `brief-code-calibration-first-moments_r1_2026-09-30.md` (`QUEUE.md` row 2c). Read against branch `Shane` at `6d87638`, working tree dirty with this work and the desk's `QUEUE.md` edit. Nothing committed.

## What the singer gets

1. **One optional question before the first vowel.** The welcome step shows **Your voice type** under the fry expander and above **Begin**: the nine Tier 1 choices in two columns, read downward, "Not sure" last. It shows only if the voice had no `voiceType` when the welcome opened, so an answer does not make it vanish mid-choice, and Start over never asks again. Begin works without an answer. The answer is written to the same `voiceType` field that Voice characteristics edits, so the guard routes from the first take. New component: `apps/web/src/lib/voice/VoiceTypeFirst.svelte`.
2. **No question during capture.** `hold.ts`: `HoldKind` no longer has `'implausible'`. A take the guard judges implausible holds as its confidence earns ("captured" for a normal take, "Noted" for a low one), and the 1.6 s hold advances as usual. The wait, the catcher that made the wheel look dead (row 8d), "Try again?", and the capture-time **Keep my reading** button are gone. The verdict is still computed and logged for every take; `rePromptShown` is now always `false`. The reading is still stored as Provisional until kept, so Markup and Insights still skip it (`isUsable`).
3. **One note at the summary, only if needed.** `apps/web/src/lib/voice/OutsideNote.svelte` heads the summary when any reading carries `plausibility: 'implausible'` without `plausibilityOverride`. It names those vowels in roster order. **Keep them** applies `keepReading` to each one and logs `[voice] plausibility override` per vowel, as the old button did. **Re-take** sings every vowel the note names, one after another, then returns to the summary. The logic is in `outside.ts`: `outsideVowels` picks the vowels and `outsideNote` picks the sentence.

## Strings

Seated verbatim from the brief's ratified table (12:49), in both languages: `calib.voiceTypeFirst.heading`, `calib.voiceTypeFirst.hint`, `calib.summary.outside`, `calib.summary.outsideNoType`, `calib.summary.keepAll`, and the changed `calib.roster.kept`. Typographic apostrophes in both languages; the French colon sits on U+00A0. {type} is the Tier 1 label in lower case.

**Removed, because nothing reads them now:** `calib.capture.hold.implausiblePrefix`, `calib.capture.hold.tryAgain`, and `calib.capture.hold.keep` ("Keep my reading" / « Garder ma lecture », ratified 10:48). The summary's **Re-take** reuses `calib.common.retake`.

## Decisions I made (DESK DEFAULT, reversible)

- **The question sits on the welcome step**, not on a step of its own. One screen fewer, and Begin stays the one action.
- **An implausible take shows the good hold** ("[i] cardinal-i, captured.") when its confidence is normal. The brief says it "moves on as it does for a good reading". The roster under the wheel still prints Provisional for that vowel during capture. That is the stored truth, and the summary note explains it.
- **The note reads the verdict stored at capture**, not a fresh check against the current type. It is the same field Markup and Insights read, so the note and the documents cannot disagree. If the singer changes type later in Voice characteristics, old verdicts stand until a re-take.
- **Countertenor gets the typed sentence** ("for countertenor voices"), as the brief says, although `bucketFor` routes it to the union bands.
- **Re-take with several vowels named** queues them all rather than only the first.

## Proof

**Tests** (`apps/web/src/lib/voice/outside.test.ts`, seven):

1. A take judged implausible holds as good, or as provisional when its confidence is low.
2. Its announcement is "cardinal-i, captured." and contains no question.
3. The note lists exactly the implausible, unkept vowels, in roster order.
4. Keep clears the note, and an in-band re-take clears that vowel.
5. The note picks the typed sentence for a Tier 1 type and the untyped one for "Not sure", no answer, and typed text.
6. The ratified strings are present in both languages, with their placeholders and the French U+00A0.
7. The type chosen first routes the guard: a 247 Hz [i] is in band for a bass and out for a soprano; "Not sure" routes to union.

**Gates**, run with a copy of `~/Downloads/ilya-ship.sh` that skips the untracked-file refusal and stops before staging (the real script refuses while `outside.ts` and the three other new files are untracked):

| Gate | Result |
|---|---|
| 1 phonology | 251 passed (251), at baseline |
| 2 dictionary | 235 passed (235), at baseline |
| 3 web-check | 0 errors and 12 warnings in 5 files, at baseline |
| 4 web-test | **1739 passed (1739)**, baseline 1732; the seven tests |
| 5 score-parser | 636 passed, 5 skipped (641), at baseline |
| 6 blurb | 145 passed (145), at baseline |
| 7 integration | 55 passed (55), at baseline |
| 8 ratchets | OK |

**Gate 4's baseline in `~/Downloads/ilya-ship.sh` moves to 1739.** I did not edit the script. `CalibrationWizard.svelte` is 2123 lines; I lowered its ceiling in `scripts/ratchets.json` from 2124 to 2123. The ratchet also offers `+page.svelte` 6028 → 6016, which predates this work; I left it.

**Browser walk**, in the in-app Browser pane at `http://calib2c.localhost:5173/` (its own storage, so your library is untouched). A shimmed `getUserMedia` fed the app `synthFry` takes at known resonances (fry at 50 Hz). Everything after the microphone was the real engine.

- English: a new voice, "Walk 2c", opened at the welcome with the question. I chose Soprano; `voiceType` was stored as `soprano` and the question stayed on screen. Readiness heard no quiet second and offered Continue, as the fake microphone always makes it do. [i] at a 230 Hz resonance read 230 Hz and was logged `implausible` against the soprano window 277 to 494 Hz, with `rePromptShown: false`. The tour moved to [e] with no stop. The other six were in band. The summary opened with "These readings sit outside the values Ilya draws on for soprano voices: [i] cardinal-i. Keep them as they are, or sing them again."
- Re-take with a 350 Hz [i]: it read 350 Hz, Captured, and the note was gone.
- French, with a 230 Hz [i] again: « Ces lectures se situent hors des valeurs sur lesquelles Ilya s’appuie pour les voix de soprano : [i] i cardinal. … » **Les garder** left [i] at 230 Hz, Captée, with « Au-delà des valeurs de référence d’Ilya » under it. Stored: `plausibility: 'implausible'`, `plausibilityOverride: true`, `reading: 'captured'`.
- Start over (« Tout recommencer », « Recommencer ») landed on the welcome with no question, because the type was kept.
- French, "Not sure", two out-of-band readings seeded in storage: « … pour tous les types de voix : [i] i cardinal, [u] u cardinal. … ». **Réessayer** sang [i] then [u] in turn ("Voyelle 1 sur 2", "Voyelle 2 sur 2") and returned to the summary with the note gone.

Two defects found and fixed on the walk: the nine choices read across rows instead of down columns, and the list dropped the space after its comma.

To see it yourself on the local dev server (Vercel does not show this until it is committed and pushed):

```
http://localhost:5173/
```

Arrival: on a voice with no voice type and no readings, open **Drawer**, **Voice**, **Calibrate**. The welcome shows **Your voice type** above **Begin**.

## What I could not establish

- **A real voice.** Every take was synthetic. Whether your own [i] now passes without a stop is shown by the logic and the walk, not by your voice.
- **The phone layout** of the welcome with the question was not measured at 390 px wide. The two columns are 22 rem at most and should fit, but I did not see it.
- **A screen reader.** The question is a `fieldset` with a `legend`, and the note carries `role="status"`. Neither was heard.
- **Keep my reading's French and English are retired**, as the ruling implies. If you want them kept for another use, they are in `git show 6d87638:apps/web/src/lib/i18n.ts`.
