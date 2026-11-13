# Brief to Code: N.199, the single-vowel Calibrate screen and the vowel-space chart

r5, 2026-11-13, from the desk (Fable). Dann 2026-11-13 00:47: the release moves to Friday 2026-11-20, and N.199 is in it (*"Let's be aggressive in our development and integration of this aspect of the build."*). Steps 0 to 6 run without waiting on him; Steps 7 and 8 wait on his walk, the words, and M0. r5 applies the Fable review of r4 (`review-fable-brief-n199_r1_2026-11-12.md`, SEND WITH AMENDMENTS, twelve; all applied, section 12 says where) and Dann's rulings of 2026-11-12 23:15 to 2026-11-13 00:04. Not ratified by Dann as a whole. Filed to `docs/sessions/` 2026-11-13 00:5x for his ship; its companions are in `docs/sessions/n199-calibrate/`.

No git writes. Gates before and after every step. Canadian spelling, no em dashes. One commit and one report per step. No more than two subagents at once.

**NOT ESTABLISHED beats a complete invented answer.**

Tree: `Shane` at `db51cdf5`. Every `path:line` here was read by the desk in that tree on 2026-11-12, unless marked SCOUT (the Sonnet scout's read), REVIEW (the Fable reviewer's read), or NOT READ. `PRODUCT.md` and `CONTRACT.md` are in `docs/memory/`.

Baseline, Dann's ship of `db51cdf5`: phonology 462; dictionary 248; web-check 0 errors and 12 warnings; web-test 5252 passed and 1 skipped; score-parser 785 passed and 5 skipped; blurb 178; integration 155; ratchets OK.

## 1. What the singer gets

One vowel at a time, in the Drawer's calibration takeover, on a phone and on a desktop:

- The vowel's symbol in a circle (Lato IPA), with its spoken name.
- A side view of the mouth and throat for that vowel, in a squircle, changing in place from vowel to vowel.
- A chart of the vowel space: fR2 across (high to low), fR1 down. Each vowel has a flat, translucent colour zone with no outline, under the grid. A zone is a neighbourhood, never a goal.
- **The zones stay where the singer's voice type puts them. What moves is a placeholder dot for every vowel not yet sung**, which shifts as Ilya learns this voice (Dann 2026-11-12 23:49, "1"; 2026-11-13 00:04, "Yes I'm content with my chocie").
- On a take the chart moves in on that vowel's zone. When the reading arrives it lands as a lavender dot, the readout turns black, and the chart moves back out.
- Ten buttons, two rows of five, in Grayson's inventory order. A tap on a vowel starts its take at once. A second tap on it, or Stop, cancels.
- A toggle to hide the chart and the numbers while singing.
- A way back to the summary as soon as one vowel is sung.
- On the summary, a vowel-space sheet of the whole voice with its readings, which prints.

Nothing in capture tells a singer the voice looks wrong (`PRODUCT.md:1096-1103`, Dann 2026-09-30). No string says "goal" or "target".

Design source: https://claude.ai/artifact/C1CLY8Kv3ecxj8wyH3MUWB. Board C (`project/CalibrateZoom.dc.html`) is the phone screen at 390 px. Board D (`project/CalibrateDrawerDesktop.dc.html`) is the same screen in the Drawer on desktop at 520 px. Board B3 (`project/PhoneticColourFlat.dc.html`) is the sheet. The desk files board D's source beside this brief (`docs/sessions/n199-calibrate/n199-board-d-drawer-desktop.dc.html`; its script is board C's, at the Drawer's width); boards C and B3 are on the canvas only. They are references for layout, colour, and behaviour; they simulate their readings and their timing. Where a board and this brief differ, this brief governs.

## 2. The rulings

All are homed in `docs/memory/OPEN.md`, section N.199, with Dann's words where the record kept them; his 47 entries in order are in `docs/sessions/n199-calibrate/dann-rulings-verbatim_2026-11-12.md`. The ones that bind the build:

1. The outcome is a profile the singer can trust; the visualizer is the draw.
2. **The pacifier is eliminated altogether in exchange for prototype C** (23:15).
3. One chart layout, phonetic. No keyboard. No user-chosen axes.
4. Zones: flat translucent fills, one colour per vowel, no outlines, grid over the fills; Voice in lavender; symbols in Lato IPA. Large and vague by intent; overlap is wanted. Always present; the active zone takes a deeper saturation.
5. Zones stay; placeholder dots move (section 1).
6. A reading outside its zone is worth curiosity, never a fault.
7. The chart zooms to the active vowel and back out on capture.
8. A readout beside the cue line: black when captured (grey while live is Phase 2).
9. The hide toggle. Ilya records which way each reading was taken.
10. Ten buttons, Grayson's inventory. A tapped vowel starts at once and takes precedence. A second tap cancels.
11. Ilya's linear order stays (i e ɛ a ɑ o u, then ɨ ɪ ʌ); after a manual pick Ilya carries on from the singer's lead, "promoting a full set of values without being pushy", and curates a way to every vowel still unsung. All ten are placed from the start.
12. The hull is dashed until all ten are sung. Start over takes two taps.
13. The drawing in a squircle, in a shared fixed frame. *"These images are original to me, inspired by Bolla and realized by you."*
14. fR1 and fR2 are set as italic f, small-capital R, subscript numeral.
15. One plain sentence tells the singer what the dot and the axes are.
16. **The screen is adapted to its Drawer use on desktop** (23:52).
17. **Bozeman gives fR2** (23:50, 23:54; `CONTRACT.md` section 8): *Practical Vocal Acoustics*, 2nd ed., p. 35, second resonances lie between about F5 and D7, mostly G5 to C7, about a tenth within one voice; Fig. 5.3, p. 31. What he does not chart is an fR2 band for each vowel by voice type.
18. Calm Authority. Provenance for every source. Practice mode is separate and OUT OF SCOPE here.

## 3. Where it lives today

- The wizard: `apps/web/src/lib/voice/CalibrationWizard.svelte`, 2,112 lines, ratchet ceiling 2,124 (`scripts/ratchets.json:14`). It lives in the Drawer's takeover: mounted at `apps/web/src/routes/+page.svelte:3848-3855`, framed at `apps/web/src/lib/components/Drawer/Drawer.svelte:846-854`. The Drawer is 520 px wide on desktop (`+page.svelte:1598-1599`); the takeover's body is inset 18 px a side and scrolls (`Drawer.svelte:1463-1468`), leaving 484 px; under 1,400 px of window the Drawer is a full-width sheet (`Drawer.svelte:1866-1877`).
- The wheel: `pacifier/Pacifier.svelte`, 972 lines, imported only at `CalibrationWizard.svelte:45`, mounted in the capture phase (`:1368-1458`). Its script holds the capture ritual, `beginPrepare` `:374` to `cancelCapture` `:548`, tangled through its per-vowel `nodes` state (REVIEW). `spokenName` is imported at `CalibrationWizard.svelte:45` and `markup/MarkupPane.svelte:63`. `pacifier/contrast.ts` has no production importer; `contrast.test.ts:40` reads it and reads `app.css` (SCOUT). No test mounts the wheel or the wizard (SCOUT).
- The wizard drives the wheel through `pacifierRef?.activateVowel` at `:760`, `:805`, `:882`, `:950`, `:960`, `:969`, `:981`. The tour ends at the summary in `advance` (`:953-961`). The skip arrives at `handleVowelSkipped` `:865`, wired at `:1391`.
- The tour: `DEFAULT_VOWELS` `:102`, `CHALLENGING_VOWELS` `:103`, `ALL_VOWELS` `:104`. Display order: `VOWELS`, `engine/types.ts:26`.
- The count-in: `pacifier/count-in.ts`: beats `:16-18`, `tapAction` `:48-59`. One tap begins since 2026-09-30.
- The session contract: `engine/session.ts:28`.
- The guard: `engine/plausibility.ts`. Bands `:50-84`; union bands for no declared type `:96-108`; margins `:124-125`; `bucketFor` `:135-143`; `checkPlausibility` `:175-232`. For the six Bozeman vowels the window is a band fixed by voice type; for [ɨ ɪ a ʌ] it is centred on the singer's anchors, and with no anchor it is `unchecked` with no window. Called at `CalibrationWizard.svelte:315` with the declared type and every sung reading as an anchor (`:311-315`), and at `analysis/analyze-score-adapter.ts:146`, `:157` with no type and only plausible or kept anchors (REVIEW).
- `withPlausibility` demotes an implausible `captured` reading to `provisional` (`CalibrationWizard.svelte:317-318`).
- Derivations: `engine/derivations.ts`: `expectedF1` `:19`, `DERIVE_ANCHORS` `:49`, `deriveFrom` `:96`; a second copy of the [ɨ] ratios at `engine/divergence.ts:16`. `applyIghDivergence` marks [ɨ] provisional when an anchor is missing (`divergence.ts:15`).
- Stand-ins: `engine/stand-ins.ts`: `MITTON_FR2` `:54`, `standInBucket` `:63`, `PLACEHOLDER_PROFILE_TYPES` `:81`, `template` `:97`, `fillStandIns` `:191`. The adapter builds its input and calls it at `analyze-score-adapter.ts:171-291` (REVIEW for `:171-290`), withholding stand-ins when nothing is sung and the type is not one of five (`:288-291`, REVIEW).
- The extractor picks the peak nearest the value it expects for the asked vowel, from one table (`engine/extract.ts:4-7`, `:140`). Its fR2 search range is 500 to 3000 Hz, fR1 150 to 1200 Hz (`:9`).
- Strings: `i18n.ts`: `calib.capture.*` `:1383-1406`; `vowel.name.*` `:1420-1429`; `vowel.spoken` `:1430`; `pacifier.*` `:1436-1457`. A key missing either language prints `[MISSING: key]` (`:2539-2543`). Retired strings stay in place, marked `UNUSED SINCE` (`:1325-1328`, SCOUT).
- The symbol: the `frSym` snippet, `CalibrationWizard.svelte:1108-1111`, an upright roman subscript today (`:1664-1672`, REVIEW).
- The store: `voice/profileStore.ts`; optional fields need no schema bump (`:93-99`); nothing strips an unknown field on load (SCOUT). Duplicating a voice copies formants only (`CalibrationWizard.svelte:499-519`, REVIEW).
- Note names: `hzToPitch`, `centsBetween`, `packages/score-parser/src/overlay-engine.ts:76`, `:84`; `pitchName`, `voice/note-picker.ts:150` (SCOUT).
- Tokens: `app.css`: Lato IPA `:14-18`; lavender family `:48-53`; wheel-only tokens `--surround-voice` `:164`, `--arc-green` `:166`, `--signal-red` `:167`; `--prep-amber` `:168` is also the wizard's.
- Module table: `lib/voice/` may import only `lib/reader/` and `lib/score/` (`scripts/ratchets.mjs:76-85`). A new file over 1,000 lines is a breach (`ratchets.json:3`).

## 4. What shapes the order

1. **The pacifier keeps working until the new screen has been walked.** A missing string breaks a screen, French cannot be seated before Dann rules on it, and every step ships. So the new screen is built beside the wheel behind a switch, with its draft English in its own file, and the wheel is deleted last.
2. **The ritual is written fresh.** It cannot be cut out of the wheel and checked, because nothing tests the wheel.
3. **A singer must always have a way out of capture.**
4. **One window, one set of values.** The zone a singer sees is the window the wizard's guard applies, from the same inputs. The placeholder dots are the values the forecast uses, from the same function. `CONTRACT.md` section 4: the sites that compute these numbers are `plausibility.ts:175-232` (read at `CalibrationWizard.svelte:315`, `analyze-score-adapter.ts:146`, `:157`); `stand-ins.ts:97`, `:191` (read at `analyze-score-adapter.ts:291`); `derivations.ts:19`, `:96` (read at `CalibrationWizard.svelte:1049`, `analyze-score-adapter.ts:264`); `divergence.ts:16`. What depends on their agreeing: the roster and the forecast showing one value for one vowel (N.109, `derivations.ts:38-48`). Step 1 moves code so the chart reads these and adds no copy. It changes one computation, named there.
5. **A chart can confirm a wrong vowel.** The extractor looks for the vowel it was asked for (`extract.ts:140`), from one bass's table (`:4-7`). Whether a fried [u] under [i] plots as an [i] is NOT MEASURED. The desk measures it with Dann before Step 8, which is before any singer sees the screen (section 5, M0). The reviewer's reading of that code is an inference, not a result.
6. **Showing a zone can teach a singer what to sing** (`claude/e43-n49-assigned-extraction_2026-08-12.md`, cause 4, Dann's). Re-taking until the dot lands is that loop, slowly. Steps 5 and 9 exist to measure it on his voice.

## 5. Phase 1

The switch: the address carries `?calibrate=new`, read the way `omr/underlay-switch.ts:19-30` reads its own, off by default. Until Step 8 everything new is seen only with it on.

Draft words: until Step 7 the new components take their English from one file, `voice/chart/draft-strings.ts`, never from `i18n.ts`, so no unratified string enters the dictionary and nothing prints `[MISSING]`. With the switch on in French, the draft English shows; that is a development state and never a singer's.

### M0. The desk's measure, before Step 8. Not Code's. Steps 0 to 6 do not wait for it.

On the existing calibration with the development capture file (`engine/capture-file.ts`, NOT READ by the desk): Dann fries [u] when [i] is asked, and [ɑ] when [i] is asked, three takes each. Expectation, stated first: if the extractor follows the asked vowel, the readings will sit near [i]'s expected values and inside its window; if it follows the voice, they will sit near his own [u] and [ɑ]. Keeps nothing. The result decides whether the screen needs a guard before Step 8 shows any singer a dot confirmed.

### Step 0. Read and report. Change nothing.

- The eight gates on your tree against the baseline.
- `Pacifier.svelte:700-972`, `engine/capture-file.ts`, `ProfileSwitcher.svelte`: anything that contradicts this brief.
- Whether `+page.svelte` passes `onProfileChange` to the wizard, and what reads it.
- Where `.visually-hidden` is defined.

### Step 1. One window, one set of values, and the chart's numbers. Pure code with tests. Nothing a singer sees.

1. In `engine/plausibility.ts`: export `windowFor(vowel, voiceType, anchorF1s)`; `checkPlausibility` calls it. Export `anchorF1sFor(profile)`, the loop now inline at `CalibrationWizard.svelte:311-315`; `withPlausibility` calls it.
2. Move the adapter's value resolution (`analyze-score-adapter.ts`, the judged copy through `fillStandIns`, about `:171-291`) into one pure function under `engine/` (the reviewer's name, `resolveVowelValues`). The adapter calls it. A test proves the adapter's output is byte-identical before and after on the existing fixtures.
3. `voice/chart/zones.ts`: for each of the ten vowels, the fR1 window from `windowFor` with the wizard's inputs; the fR2 centre from the resolved values; the fR2 half-height, one named constant of 2.5 semitones whose comment says it is the desk's placeholder and that Bozeman gives the whole axis and the span, not a band per vowel. A personal vowel with no sung anchor has no guard window: its zone is drawn around its placeholder value with the same margins and carries `basis: 'placeholder'`, so the legend never calls it the guard's.
4. `zones.ts` also returns the placeholder dot for every unsung vowel, from the resolved values. **The one computation this brief changes:** the chart asks for placeholders for every voice, including the types the adapter withholds them from (`:288-291`). The forecast's behaviour does not change; the function takes a flag, and the adapter passes today's rule.
5. `voice/chart/geometry.ts`: log-frequency axes. The full view holds every zone, every placeholder, and every reading of this voice with a margin, clamped to Bozeman's F5 to D7 for fR2 where the data allow and never beyond the extractor's search range (`extract.ts:9`). The zoom target for a vowel (1.4 to 3.2 times), widened to contain a reading that lands outside its zone. The eased mix. The hull.
6. `voice/chart/tour.ts`: the next vowel after a capture: round the seven from the singer's last vowel, then the three hardest; `null` when none is left. It takes an optional list (the reviewer's "pass"): given one, it walks that list and then returns `null`.
7. `voice/vowel-names.ts`: `spokenName` and `spoken` moved from `Pacifier.svelte:21-23`; both importers repointed. `voice/FrSym.svelte`: the symbol, lifted from the snippet with the same markup. The change to small capitals (ruling 14) is its own commit in Step 7, because it changes the roster.

Tests: the zone's fR1 window equals the guard's for every vowel, every bucket, and no type; a mutant margin fails; the zones do not move when vowels are sung, and the placeholders do, after one, two, and three sung vowels; the two bucket functions (`bucketFor`, `standInBucket`) are named in a test that pins where they differ (countertenor, no type).

### Step 2. The sheet. Behind the switch.

`voice/chart/VowelSpaceSheet.svelte`, to board B3, on the summary under the roster: all ten, sung dots filled, placeholders hollow, the hull dashed until ten are sung, the readings table (Hz, note name, signed cents from `centsBetween`, "D4 +16"), the legend, the provenance line naming Bozeman's pages, Mitton (2020), and what is the desk's placeholder. It prints on one letter sheet with nothing interactive. It reads the stored profile and touches no capture code, so Dann can look at his own voice first.

### Step 3. The ritual, written fresh. Nothing a singer sees.

`voice/capture-ritual.svelte.ts`, against `CaptureSession` and `count-in.ts` (which moves beside it with its test). `Pacifier.svelte` is not touched.

- In: `session`; `voiceType()`; `previous(vowel)`, the wizard's guarded reading; `reducedMotion()`; `ticks`.
- Out, reactive: `phase` (`idle | sing | pause | listening | sweep | landing`); `vowel`; `progress` 0 to 1; `cue` as a key and a vowel. The module never calls `t`.
- Calls: `begin(vowel)`, `cancel()`, `destroy()`.
- Events: `onCaptured(vowel, formant)`, `onRolledBack(vowel, rejected)`, `onFailed(vowel, error)`.
- It holds no formant map and emits no profile.

Ruled here, because "same as the wheel" cannot be:

- Timing is the tree's: three sung beats of 1 s, a 2 s pause, a wait for stable fry, then the 3.0 s sweep. The progress bar starts at stable fry. Under reduced motion the bar still advances.
- The re-take rule (a provisional re-take never replaces a captured reading) compares against `previous(vowel)`, the guarded profile.
- A second tap on the vowel, Stop, and Escape cancel in every phase up to the moment the reading is delivered. After that the take cannot be cancelled, so "Nothing is saved from it" stays true.
- A tap on another vowel during a take is ignored. DESK DEFAULT; Dann's "when you tap a vowel it takes precedence" was said of the idle screen.
- Each take has an id; a late `CANCELLED` from an earlier take is dropped.
- The audio tick on the sung beats stays; the audio context is closed on `destroy()`.

Tests: a transition table, a fake session, fake timers; every path above, plus each error code.

### Step 4. The screen. Behind the switch. Four commits.

`voice/VowelCapture.svelte` and `voice/chart/VowelChart.svelte`, with the tree's tokens and fonts, never a board's hex values or its Google Fonts link. The six zone colours get named tokens.

- **4a. The chart:** zones, grid, placeholders (hollow, with their symbol), sung dots, hull. Each unsung zone carries its symbol, so no zone is told apart by colour alone.
- **4b. The screen with the ritual:** header and count; glyph circle with the spoken name; cue line (the live region, which speaks the vowel by `vowel.spoken` while the eye sees the bracketed symbol); readout through `FrSym`; progress bar; ten buttons (real buttons, 44 px, named by `vowel.name.*` and their state: sung, placed, selected); hint line; Start and Stop; the toggle; "Return to summary".
  - Width: 484 px in the Drawer on desktop (board D), the phone's width on a phone (board C). One component; the chart takes the width it is given. On desktop the whole screen needs about 860 px of height; shorter than that, the takeover scrolls, and the chart, the cue line, and the buttons stay together in view during a take.
  - The reading lands on `onCaptured`. No live dot in Phase 1.
  - **Capture shows no verdict.** A dot is ringed only when the engine's own `confidence` is `low`. An implausible reading is drawn as an ordinary dot wherever it falls; the summary asks about it, as today.
  - A reading with no fR2 draws a bar at its fR1 across its zone, and the readout uses the tree's "Try again" for the missing number.
  - After a capture the selection moves by `tour.ts` and waits. Nothing starts by itself.
  - "Return to summary" (the tree's string) shows whenever the screen is idle and one vowel is sung. When all ten are sung the main button reads Done and goes to the summary. A re-take from the summary opens the screen on that vowel with its list as the pass, then returns.
  - The first time the screen opens for a voice, the tree's ratified explanation of sing, stop, and fry (`calib.capture.cueSuffix`, `i18n.ts:1388`) shows under the cue line until the first take begins.
- **4c. Zoom and hidden mode.** The zoom runs under the first sung beat. Under reduced motion the view changes with no animation. Hidden mode replaces the chart and readout with one sentence from the tap to the capture.
- **4d. The drawings.** The squircle with a fixed frame and the ten interim drawings (`docs/sessions/n199-calibrate/interim-sagittal/`, 497,371 bytes, told to Dann 2026-11-12). Report the bytes as shipped.

### Step 5. What Ilya keeps. Development switch only.

With `?calibrate=new`: per voice, for every take, its time, outcome, the engine's raw reading with `confidence` and `f2Quality` (absent on a failed take, which has no numbers), the voice type at the time, and what was visible (`hidden | zone`; Phase 2 adds `live`). Written the way `recordReadiness` writes (`CalibrationWizard.svelte:675-681`), never through `persist()`, which moves the calibration date. Fifty takes a vowel, oldest dropped; Start over clears it; a full store drops the record before it refuses the profile. On the kept reading, for every singer: the same visibility mark, one optional field.

### Step 6. Tests and pictures.

Unit tests for every module. A browser test of a full tour on `StubCaptureSession` with the switch on: ten captures, a manual pick, a cancel in each phase, a rolled-back re-take and an error (the stub's `forced` outcome, `engine/stub.ts:122`; extend the stub if it cannot give one), Return to summary after one vowel, Start over's two taps, hidden mode, a soprano's view. Pictures, English: phone 390 by 844 and Drawer 520 by 900, each idle, mid-take, captured, all ten, hidden; the printed sheet. All eight gates.

**Then Dann walks it** with the switch on, on his phone and his desktop.

### Step 7. Words. After the walk.

The ratified table, English and French, moves from `draft-strings.ts` into `i18n.ts`; the draft file is deleted. `FrSym` takes small capitals in its own commit, with a picture of the roster before and after.

### Step 8. The handover, then the deletion. Two commits.

- **8a.** The capture phase mounts `VowelCapture` for everyone; the switch goes. The seven `activateVowel` calls, the queue's auto-advance, the hold banner, Pause, the skip (`handleVowelSkipped`, `:1391`), `handleProfileChange`, and `sameExtraction` go. `withPlausibility`, `withIghPass`, and persistence stay. `logAnnounce` stays as the number's first delivery to a screen reader; `holdAnnounce` goes with the hold. The roster leaves the capture phase and stays on the summary. The wizard's file gets shorter; lower its ratchet.
- **8b.** `pacifier/` is deleted whole, with `--surround-voice`, `--arc-green`, `--signal-red`, and the line in `colour-story.test.ts:7` (SCOUT). Strings only the wheel spoke (`pacifier.tapToCapture`, `pacifier.wheelAria`, `pacifier.ready`, `pacifier.skipped`) are marked `UNUSED SINCE N.199`. The ritual's strings keep their keys. Stale comments are corrected: `CalibrationWizard.svelte:8-16`, `:780`, `:948`; `engine/live.ts` near `:372`; `engine/types.ts:22-25`.

### Step 9. [ɨ] before its anchors. One computation, on its own.

Today a velar-i sung before [i] and [u] is marked provisional and never recovers (`divergence.ts:15`). With manual order that is an ordinary path. Fix: the engine's own reading is kept beside the pass's verdict, and the pass re-judges [ɨ] whenever an anchor arrives. Sites: `divergence.ts:11-17`, `withIghPass` (`CalibrationWizard.svelte`, about `:268-285`). DESK DEFAULT, Dann's to strike.

## 6. Phase 2: the live dot. Not started until Phase 1 has shipped.

- Off unless the address carries `?live=on`.
- `CaptureHandlers` gains an optional `onLive`. Per hop today the gate runs only the fry detector and stops at stable fry (SCOUT and REVIEW: `live.ts:516-559`), so `live.ts` changes: an estimate each 250 ms during the sweep.
- The files `extract.ts`, `closed-phase.ts`, and `analyze.ts` do not change. The brief says plainly what that hides: the live number is the extractor run where it has never been checked, on a 1 s window, with no guard-chosen stretch and no split-half check (REVIEW: `analyze.ts:36-41`, `:140-141`).
- Before any screen work: replay per-hop extraction over saved takes of Dann's voice, offline, and report the live median against the final reading, and how often the estimate jumps between peaks. Measure the cost on a phone; plan a worker if it is tens of milliseconds.
- Before the switch comes off: Dann sings each vowel five times with the live dot and five times hidden, alternating; the pass criterion is written down first; the desk reports spread, trend across takes, and the difference of the means, and says that one expert voice can show only a gross effect.

## 7. Strings, English, PROPOSED. None is seated before Dann ratifies it; French follows as a marked draft.

Adopted from the tree, unchanged: `pacifier.singFirst`, `calib.readiness.countTwo`, `calib.readiness.countOne`, `pacifier.pause`, `pacifier.beginPhonating`, `pacifier.nowSustain`, `pacifier.captured`, `pacifier.rolledBack`, `pacifier.cancelled`, `pacifier.error.*`, `calib.capture.cueSuffix`, `calib.capture.returnToSummary`, `calib.summary.startOverButton`, `vowel.name.*`, `vowel.spoken`. Needs a new wording, because "Tap to retry" is false once the selection has moved: `pacifier.sampleUncertain`.

Coined by the desks, in `{v}` the bracketed symbol for the eye:

| Key (proposed) | English |
|---|---|
| `capture.title` | Your resonances |
| `capture.count` | {n} of 10 |
| `capture.explain` | Each dot is one of your vowels: the higher your tongue, the higher the dot; the further forward, the nearer the front edge. |
| `capture.cue.ready` | Ready for {v}. |
| `capture.cue.isCaptured` | {v} is captured. |
| `capture.cue.allTen` | All ten captured. This is your vowel space. |
| `capture.start` | Start {v} |
| `capture.retake` | Re-take {v} |
| `capture.inProgress` | {v} in progress |
| `capture.done` | Done |
| `capture.stop` | Stop |
| `capture.clearAll` | Clear all |
| `capture.hide` | Hide the chart and numbers while I sing |
| `capture.hidden` | The chart and the numbers are hidden while you sing. They return when this vowel is captured. |
| `capture.hint.first` | Start follows Ilya's order. Or tap any vowel to sing that one now. |
| `capture.hint.active` | Stop, or a second tap on {v}, ends this take. Nothing is saved from it. |
| `capture.hint.retake` | A re-take replaces {v} only if the new reading is as clear. |
| `capture.hint.placed.typed` | Ilya has placed {v} from your voice type for now. Its placeholder moves as you sing. |
| `capture.hint.placed.untyped` | Ilya has placed {v} from typical voices for now. Its placeholder moves as you sing. |
| `capture.hint.toGo` | {count} to go, in any order. Ilya keeps a placeholder for each until you sing it. |
| `capture.hint.finished` | Tap any vowel to sing it again. |
| `capture.hint.confirmClear` | Tap Clear all to clear every reading for this voice. |
| `capture.uncertain` | {v} is noted, though this take was less clear. A re-take can replace it. |
| `capture.button.sung` / `.placed` / `.selected` | sung / placeholder / selected |
| `capture.bar` | Progress of this take |
| `capture.chartAlt` | Chart of the vowel zones. It moves in on the vowel being measured, and a dot shows the reading. |
| `capture.drawingAlt` | Side view of the mouth and throat for {name} |
| `sheet.title` | Your vowel space |
| `sheet.subtitle` | The ten vowels of sung Russian, as your voice shapes them |
| `sheet.readings` | Your readings |
| `sheet.col.vowel` / `.fr1` / `.fr2` | Vowel / Hz and note / Hz and note (the symbol through `FrSym`) |
| `sheet.legend.sung` | A vowel you sang, measured in vocal fry. |
| `sheet.legend.placeholder` | A placeholder: where Ilya expects a vowel you have not sung yet. |
| `sheet.legend.zones` | Each colour is the neighbourhood Ilya draws on for one vowel, for a voice of your type. Where they cross, the colours mix. |
| `sheet.legend.hull` | The outline joins your sung vowels. It is dashed until all ten are sung. |
| `sheet.axis.front` / `.back` / `.open` | tongue forward / tongue back / mouth more open |
| `sheet.provenance` | Zones along the first resonance: Bozeman, Kinesthetic Voice Pedagogy, 2nd ed. (2021), Figs. 8 to 10. The second resonance's range: Bozeman, Practical Vocal Acoustics, 2nd ed. (2025), p. 35. Placeholder values: Mitton (2020), Table 5.3. Each zone's width along the second resonance is Ilya's own estimate. |

The drawing's credit line starts from Dann's words in ruling 13; its final wording is his.

## 8. Out of scope

Practice mode. The Bolla adaptation of the drawings. The guard's margins and bands, the stand-in method, the derivation ratios, the extractor. The Welcome, Readiness, and Characteristics phases. The Guide's explanation of the departure from Vennard, which the desk drafts for Dann.

## 9. What the desk could not establish

- Dann's exact words in the seven condensed messages.
- The result of M0. Whether saved takes of Dann's voice exist on his Mac.
- How the screen behaves for a voice that is not a bass: the extractor's table is one bass's values for every voice type, untested. One walk by a non-bass voice is owed before any share.
- A source for an fR2 band for each vowel by voice type.
- How board D looks rendered; the desk published it and did not open it.

## 10. Reports

`docs/sessions/report-code-n199-step<n>_r1_<date>.md`, one per step, written to disk by Code: what changed with `path:line`, the gate counts, the pictures, and "Could not establish".

## 11. For Dann, one at a time

1. The English strings in section 7, then the French.
2. The credit line's wording.
3. Centring of [i] and [ɨ] in the circle.
4. The M0 takes, when he has five minutes at the microphone.

## 12. Where each amendment of the review went

1 (order, switch): section 4 item 1, section 5 throughout. 2 (ritual fresh): Step 3. 3 (a way out): Step 4b. 4 (zones): Step 1, section 1, ruling 5. 5 (no verdict in capture): Step 4b. 6 ([ɨ]): Step 9. 7 (wrong vowel): M0, section 9. 8 (Phase 2): section 6. 9 (strings): section 7, Steps 4b and 7. 10 (the record): Step 5. 11 (timing): Step 3. 12 (smaller): Steps 1.7, 4, 7, 8. The scout's twelve are carried from r4.
