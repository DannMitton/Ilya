# Brief to Code: N.203 lane 59, the take (slice 1, slice 5, and tonight's additions)

r1, 2026-11-16, written by the desk (Opus 5.5). For a cloud Code session on branch `cloud-lane-59`, cut from the tip of `Shane` **after lanes 56, 57, and 58 have merged**. Not sent until Fable has reviewed it (`CONTRACT.md` §1 item 19).

Paths are under `apps/web/src/lib/` unless they begin with `docs/`, `apps/`, or `e2e/`. Line numbers were read by the desk at `Shane` `d9af5ac9` (2026-11-16 01:1x) or by plan r4 at `2c07ab75`, which differs from `d9af5ac9` in `docs/` only. Lanes 56 to 58 touch none of the files this lane owns except `i18n.ts`; Step 0 re-reads every cited line on the merged tip.

## 1. What the singer gets

On the screen with the ten vowels (VOICE, inside the Drawer's takeover):

1. A tap on a vowel focuses it: the symbol, the side view, and the vowel space chart move to it. Nothing records.
2. **Start** records the focused vowel. A take runs in four named parts shown on one line: Breathe (2 s), Sing (4 s, four soft ticks), Shape (2 s), Fry (the wait for steady fry, then the 3 s measure).
3. The vowel space chart sits **below** the prompt, the ten buttons, and Start. A tap on a vowel's zone in the chart focuses that vowel, as its button does.
4. The microphone opens once per visit to this screen and closes when the singer leaves it, so Chrome on iOS announces it once.
5. The singer can stop early: before the six anchor vowels are recorded, **Use what I've recorded**; once [i e ɛ ɑ o u] are recorded, **Let Ilya work out the other four**.
6. With all ten recorded, the main button reads **Re-take [v]**, and **See your vowel space** opens the summary.
7. INSIGHTS: the ratified sentence for a piece with no score, and a true method line for a measured voice and for a type-only voice.

## 2. The rulings, in Dann's words

All in `docs/memory/INBOX.md` and `docs/memory/OPEN.md`, N.203, transcribed as written there.

| When | His words (short) | What it rules |
|---|---|---|
| 2026-11-15 18:54 | "Can the Breath and Keep the shape segments be the same shorter length while the Sing and Fry match a lottle longer?" | Breathe = Shape, shorter; Sing = Fry, longer. DESK DEFAULT 2, 4, 2, 4 s. |
| 2026-11-15 19:16 | "I LOVE the chart's zoom toward the vowel ... for the switch to every vowel" | The chart glides on every change of focus. |
| 2026-11-15 19:23 | "yes" | A tap selects; Start records. Replaces "a tapped vowel starts at once" (2026-11-12). |
| 2026-11-15 18:54 | "the Pacifier has been made obsolete" | The take line replaces the single bar and the spoken count. |
| 2026-11-16 00:32 | "the vowel space chart ... belongs under the per-vowel prompt and the ten buttons. And the vowel space map was supposed to be touch-sensitive" | The chart moves below the buttons; a tap on the chart focuses a vowel. |
| 2026-11-16 00:42 | "The three two one coun tdown is misleading" | The spoken count leaves the take; Breathe is silent and named. |
| 2026-11-16 00:42 | "there is no option to stop and use what the user has given ... We need to give the use agency over such a choice." | The finish-early button, Step 6. |
| 2026-11-16 00:44 | "keep the microphone open for as long as you are on the screen with the ten vowels, and close it when you leave." | Step 1. |
| 2026-11-16 01:13 | "I just don't think I want to express what we do in vocal fry as singing" | "Sing" names the modal part only; the singer's act for a vowel is "record". |
| 2026-11-16 01:13 | "Yes to all your responses" | The English sheet r2 is ratified (Step 7). |

DESK DEFAULTS this brief applies (Dann may strike any): four ticks on the seconds of Sing, none elsewhere; after a capture the chart rests 1.4 s on the new dot, then glides 800 ms; Back or Escape during a take ends it and keeps nothing; a tap on another vowel during a take does nothing; the side view stays in view when the chart and readout are hidden.

## 3. Steps

Each step is its own commit, test first where a test applies, and its own short report section with pictures. Push after each step.

### Step 0. Read and report. Change nothing.

On the merged tip: run the eight gates and record each count; re-read every line this brief cites and list any that moved; record the line counts of every file this lane owns against `scripts/ratchets.json`; read `docs/sessions/n203-voice-intake/plan-voice-in-the-drawer_r4_2026-11-15.md` section 4.4 and `prototype-synchronized_r3_2026-11-15.html` (the take's behaviour and timing; its layout is superseded by Step 4 below).

### Step 1. One microphone per visit.

Today every take and the readiness check stop the tracks and close the AudioContext when they end (`engine/live.ts:629`, `:661`, through `releaseAudio()` at `:707`; `reset()` `:258-273` also releases). Chrome on iOS shows its "Microphone access allowed" banner at each reopening (seen by Dann 2026-11-16 00:37).

- Add to `CaptureSession` (`engine/session.ts:68-87`) a visit scope: `openVisit()` and `closeVisit()`. Inside a visit, `finish()`, the readiness end, and `reset()` stop recording and clear buffers but keep the stream and the context; `closeVisit()` and `cancel()` outside a take release them. The first `start()` or `startReadiness()` of a visit acquires (`acquire()` `:326-370`); later runs reuse the stream. A run must still see a fresh graph state: no buffered audio from the previous take may reach the next (test it).
- `stub.ts` implements the same API.
- The wizard opens the visit when the capture screen mounts and closes it when the screen unmounts, on Back (`routes/+page.svelte:1643-1648` flips a page flag while the wizard stays mounted, `components/Drawer/Drawer.svelte:846`, so the close must be driven by the takeover's visibility, not by unmount alone), on Finish, and on `pagehide`. Lane 60 calls the same pair around the test fry; leave a one-line note in the report saying where.
- If the context is suspended between takes (iOS may suspend it), `resume()` it inside the Start handler (a user gesture).
- Tests: two takes in one visit call `getUserMedia` once; Back between takes releases the tracks; a take after `closeVisit()` acquires again; the tick context (Step 3) and the capture context are separate and both close on `closeVisit()`.

### Step 2. A tap focuses; Start records.

- `tapVowel` (`VowelCapture.svelte:231-239`) ends at `selected = v`; `startTake(v)` at `:238` goes. During a take a tap on any vowel does nothing (the second-tap cancel at `:234` goes).
- `pressMain` (`:240-244`) records the focused vowel. Stop and Escape end a take (`:245-264`, kept).
- At ten recorded, `mainButton` (`chart/screen-logic.ts`, the `done` branch, `:77` by plan r4) returns `retake` for the focused vowel; the summary is reached by **See your vowel space** (the control at `VowelCapture.svelte:397-399`, relabelled).
- The tick's AudioContext is made and resumed inside the Start handler (today it is made inside the tap, `count-in.ts:41`, because the first step fires at once; with Breathe first the first tick comes 2 s later, outside the gesture).

### Step 3. The take line.

- The ritual (`capture-ritual.svelte.ts`) runs Breathe 2.0 s, Sing 4.0 s, Shape 2.0 s, then Fry: the session's wait for steady fry (up to 10 s, `engine/live.ts`), then the 3.0 s sweep (`SWEEP_MS`, `:37`). Replace `RitualPhase` (`:45`) values or map them; the screen reads one new field, `{ part: 'breathe' | 'sing' | 'shape' | 'fry', within: 0..1 }`. During the wait for fry the line holds at the first quarter of Fry and the cue stays.
- The count in words ("Three. Two. One.", `count-in.ts:27-33` steps `sing`, `two`, `one`) leaves the take. Four ticks sound on the four seconds of Sing, none elsewhere. `PAUSE_MS` (`count-in.ts:22`) becomes the 2 s Shape.
- The line: one element with four labelled parts in the proportion 2, 4, 2, 4, one `role="progressbar"` for the whole take, replacing the bar at `VowelCapture.svelte:302-311`. Under reduced motion it fills in coarser steps (`PROGRESS_STEP_REDUCED_MS`, `:42`).
- **Build it as a component that takes its parts and their proportions as data**, because lane 60 reuses it for the test fry with three parts, Quiet, Breathe, Fry (Dann 2026-11-16 00:33). Say its name and props in the report.
- The microphone still opens at the Fry part within a visit's first take, as today. Dann's iPhone trial of 2026-11-16 00:37 to 00:39 recorded ten vowels on today's build with the microphone opening 6 s after the tap, so no earlier opening is needed (`INBOX.md`).
- The dwell: after a capture the chart rests 1.4 s on the new dot, then the focus moves by Ilya's own rule (`chart/tour.ts:23-37`) and the chart glides there. The dwell holds under reduced motion; only the glide goes (today the ritual goes idle at once under reduced motion, `capture-ritual.svelte.ts:237` by plan r4).
- Unchanged: the re-take rule, the rollback, the uncertain reading, the errors, the take record.

### Step 4. The screen, in order (Dann 2026-11-16 00:32).

1. The head and its count (`VowelCapture.svelte:275-278`, kept).
2. The vowel's row: the symbol in its circle (6rem), the name and the drawing's credit, and the side view in its squircle (`:280-294`, kept as built). The readout of the two resonances joins this row.
3. The take line (Step 3).
4. The cue, alone in its row (`:312-313`).
5. The first-time explanation until a take has begun (`:324-326`).
6. The ten buttons, two rows of five (`:328-344`, kept; 44 px touch size).
7. The main button and the second button (`:346-349`), then the finish-early button (Step 6).
8. **The vowel space chart** (`:296-301` today, inside the sticky stage), now here, below the buttons.
9. The hint, the sentence on the dots, the folded readings, the hide toggle (`:352-395`, kept).

- The sticky stage (`.stage`, `:296`, and its styles near `:504-517` by plan r4) goes: the controls are now above the chart.
- The chart rests on the focused vowel by the built `zoomTarget` (`chart/geometry.ts:93` by plan r4) and glides on every change of focus in about 800 ms; under reduced motion it jumps. Today the view moves only when the ritual's phase changes (`VowelCapture.svelte:141-164` by plan r4); add the focus as a trigger, and let the idle branches rest on the focused vowel's view.
- The focused vowel's zone deepens while a take runs, as built.
- Done when, on a 390 by 844 phone and in a desk Drawer 900 px high, with Ilya's own fonts, everything from the VOICE header to the Start row is in view without scrolling, first visit and after. Measure and report the pixel heights.

### Step 5. A tap on the chart focuses a vowel.

- The chart takes taps (today it takes none: no pointer handler in `chart/VowelChart.svelte` or `chart/ChartLayers.svelte`, grep 2026-11-16 00:3x). A tap inside one or more zones focuses the vowel whose dot (sung or placeholder) is nearest the tap, in chart space. A tap outside every zone does nothing.
- Same effect as the button: it focuses, never records; ignored during a take.
- The buttons stay the keyboard and screen-reader path; the chart's tap layer is `aria-hidden` and takes no focus.
- Tests: overlapping zones resolve to the nearest dot; a tap during a take changes nothing.

### Step 6. Finish early.

A second action below Start and Stop, shown from the first recorded vowel, hidden during a take and once all ten are recorded:

- Fewer than the six anchors ([i], [e], [ɛ], [ɑ], [o], [u]) recorded: **Use what I've recorded**, with the line "Ilya fills the other {m} from your voice type."
- All six anchors recorded and fewer than ten: **Let Ilya work out the other four** if exactly the four derived vowels remain, with the line "You have recorded the six vowels Ilya needs. From them, it works out [ɪ], [ɨ], [a], and [ʌ]." If six anchors and some of the four are recorded, the button reads **Use what I've recorded** and its line names the {m} Ilya works out.
- Either button does what Return to summary does today (`onReturn`, `:397-399`). Read where the four are derived (`derivations.ts`; `resolve-values.ts:206-212`; `stand-ins.ts`) and say in the report which code fills each unrecorded vowel in each state; if the button's words would be untrue for any state, stop and report.
- The stale invitation "Sing the three Ilya derived for you" (`CalibrationWizard.svelte:894-903` by plan r4) is lane 60's; leave it.

### Step 7. Words.

English, ratified 2026-11-16 01:13: `docs/sessions/n203-voice-intake/sheet-english_r2_2026-11-16.md`, lines 15 to 24 and 26b (the take, the hints, the buttons, the legend), and 27 to 29 (INSIGHTS, Step 8). Use them character for character; typographic apostrophes.

French: the desk sends Dann's ratified French to this session as an amendment. Until it arrives, each new key carries the English in its `fr` value and the report lists those keys; do not write French. When it arrives, apply it and run the OQLF sweep (`i18n.test.ts:155`).

Every new or retired key moves the key index at the head of `i18n.ts` and `i18n-index.test.ts`, and any key under `capture.` or `sheet.` moves `chart/ratified-strings.test.ts`; update both with the words. A retired key is marked UNUSED and kept, as the tree does.

### Step 8. INSIGHTS (slice 5).

- `insights.silence.noScore` (`i18n.ts:1833` by plan r4) takes sheet line 27: "INSIGHTS measures a piece from its score, and connects it to your voice. Add a score in the INPUT pane to begin."
- The method note for no score (`insights/InsightsPane.svelte:284-293` by plan r4) reads `restsOnSamples` (`insights/identity.ts:41-43`) where today it reads the model, and prints sheet line 28 for a measured voice and line 29 for a type-only voice (a type-only voice counts as measured in `analysis/analyze-score-adapter.ts:97`, so test that it gets line 29).
- `InsightsPane.svelte` stands at its ceiling (744 of 744, S1 read 2026-11-16 00:0x; 743 after lane 58). Free lines before adding any; do not raise the ceiling.
- `insights/ratified-lines.test.ts` pins four method lines; update it with the words.

## 4. What this lane owns, and what it leaves

Owns: `voice/VowelCapture.svelte`, `voice/capture-ritual.svelte.ts`, `voice/count-in.ts`, `voice/chart/screen-logic.ts`, `voice/chart/VowelChart.svelte`, `voice/chart/ChartLayers.svelte`, `voice/chart/geometry.ts` (view only), `voice/engine/live.ts`, `voice/engine/session.ts`, `voice/engine/stub.ts`, the new take-line component, `insights/InsightsPane.svelte`, `insights/identity.ts` (read), their tests, and in `e2e/calibrate-new.test.ts` everything except the entry helpers `open` and `toCapture` (`:13-34`), which lane 60 owns.

Touches with care: `voice/CalibrationWizard.svelte` only to open and close the visit (Step 1) and to wire the finish-early action; it stands at 1,726 of 1,727 lines, so free lines first or move the wiring into a helper module. Lane 60 also edits this file.

Leaves: the VOICE pane at rest, Welcome, the test fry, the summary, voice characteristics, MELODY's empty state (lane 60).

**Other sites that compute the same number.** The take's timing is read by the ritual, by `count-in.ts`, and by the tests that pin it (`count-in.test.ts`, `capture-ritual.test.ts` literals 1000, 3000, 3000, 900, 6000, `screen-logic.test.ts`, `VowelCapture.test.ts`, `e2e/calibrate-new.test.ts` items 2 to 6, 8, 9, 14 by plan r4). The readiness check keeps its own clock (`engine/readiness.ts:133-134`, `READINESS_PREP_MS` 2100, `READINESS_CAPTURE_MS` 3000), which lane 60 replaces; do not couple them here. The microphone's lifetime is decided in `engine/live.ts` alone; `stub.ts` mirrors it.

## 5. Constraints

- Change nothing under `docs/memory/`, and do not edit, rename, or replace a brief.
- No new dependency. No change to `static/` without the byte count in the report.
- Line ceilings hold; a new file stays under 1,000 lines.
- Push only `cloud-lane-59`; open no pull request.
- Every new string a singer reads speaks the singer's words (`docs/house-style/interface-text.md`): "pane", never "band"; "record" for a vowel, "sing" for the modal part only.

## 6. Pictures and gates

After Steps 3, 4, 5, and 6: pictures at 390 by 844 (phone, English and French) and in a desk Drawer at 1440 by 900, at rest, mid-take in each of the four parts, at the dwell after a capture, with the chart focused by a tap, and for each finish-early state. Look at every picture before you push it. All eight gates at the end, with counts, and the Playwright suites `calibrate-new` and `singer-paths`.

## 7. What the desk could not establish

NOT ESTABLISHED beats a complete invented answer.

- Whether iOS suspends an open AudioContext between takes in a visit, and whether `resume()` from the Start tap is enough. Test it on WebKit in Playwright if it runs; otherwise say it is untested.
- Whether keeping the stream open changes the guard's first second of a take (the room between takes is now in the same stream).
- How a square or wide frame below the buttons best takes the built view (`chart/model.ts:12-13`, 484 by 280); choose, and show it.
- The exact code that fills each unrecorded vowel in each finish-early state (Step 6 asks you to read it).

## 8. Reports

`docs/sessions/report-code-n203-lane59-step<N>_r1_<date>.md` for each step, pictures beside them in `docs/sessions/report-code-n203-lane59-pictures/`. Each report: what changed, with file and line; the tests added; the gates; what you could not establish; anything that needs Dann's eye.
