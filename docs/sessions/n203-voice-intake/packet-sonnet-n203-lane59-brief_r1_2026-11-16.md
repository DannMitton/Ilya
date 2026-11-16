# Citation packet for the N.203 lane 59 brief (scout S6)

r1, 2026-11-16. Read-only. Repository `https://github.com/DannMitton/Ilya.git`, scratch clone `/home/claude/s6/ilya`. Nothing pushed, nothing installed, no test run.

Brief checked: `/mnt/user-data/outputs/brief-code-n203-lane59-the-take_r1_2026-11-16.md` (155 lines, read in full).

Paths below are under `apps/web/src/lib/` unless they begin with `apps/`, `docs/`, or `scripts/`. "d9af" is `Shane` at `d9af5ac9` (committed 2026-11-15 23:57 -0500). "Merged" is d9af plus lanes 56, 57, 58, merged in that order in a scratch branch.

## 0. Set-up facts

- `origin/Shane` is `d9af5ac9`. `origin/cloud-lane-56` is `590a3655`. `origin/cloud-lane-58` is `0b4b5517`.
- **`origin/cloud-lane-57` is `419ce634`, not `70449563`.** `70449563` exists and is an ancestor of `419ce634` (`git merge-base --is-ancestor`). Seven commits lie between them (`git log 70449563..origin/cloud-lane-57`, from `c6ad6de1` to `419ce634`). They touch only the welcome sheet's own files (`components/Welcome/*`, `e2e/welcome-sheet.test.ts`), images, and one report; no voice, insights, or `i18n.ts` file (`git diff --name-only 70449563 origin/cloud-lane-57`).
- Merge-bases with d9af: lanes 56 and 58 `2c07ab75`; lane 57 `fb9d829e`.
- The merge order 56, 57, 58 conflicts in exactly one place, `lib/i18n.ts:19` (the key count in the header: lane 56 wrote 1,272, lane 57 wrote 1,278). **Neither number is right for the merged file.** By a regex count of `'key': {` lines, d9af has 1,171 (header says 1,270), lane 56 has 1,173 (+2), lane 57 has 1,179 (+8), lane 58 has 1,171 (+0), merged has 1,181 (+10). So the merged header must read 1,280. This is a regex count, not `stringKeys()`; `i18n-index.test.ts` (which uses `stringKeys()`) would confirm it. The merged file carries the glosses `markup. 2` and `welcome. 8` (diff of d9af to merged at `i18n.ts:54` and `:92`).
- `docs/sessions/n203-voice-intake/sheet-english_r2_2026-11-16.md` is **absent** on every ref checked: d9af, Shane, and lanes 56, 57, 58 (`git ls-tree -r --name-only <ref> | grep -i sheet-english` returns nothing for each). Nothing in `docs/` mentions it by name.
- The plan of record is present: `docs/sessions/n203-voice-intake/plan-voice-in-the-drawer_r4_2026-11-15.md` (489 lines). `prototype-synchronized_r3_2026-11-15.html` is present in the same folder.
- The brief says its rulings are "All in `docs/memory/INBOX.md` and `docs/memory/OPEN.md`". At d9af, the two 2026-11-15 quotes I tested are there (`INBOX.md:744`, 18:54; `INBOX.md:748`, 19:16). None of the 2026-11-16 quotes (00:32, 00:42, 00:44, 01:13) is in the tree: `grep -i` for "keep the microphone open", "no option to stop and use", "express what we do in vocal fry", "Yes to all your responses", "touch-sensitive", and "belongs under the per-vowel" finds nothing in either file. The brief's wording of those is NOT ESTABLISHED from the repository.

## 1. Every cited file:line, read at d9af

Status key: MATCHES, MOVED (right line given), WRONG (what is there). "Lanes" says whether lane 56, 57, or 58 changes the line (each diffed against its own merge-base for that file; `git diff --numstat <base> <lane> -- <file>`). Among all files the brief cites, only four are touched by any lane: `i18n.ts`, `InsightsPane.svelte`, `routes/+page.svelte`, and `insights/ratified-lines.test.ts`. Every other cited file shows no change in any lane.

### Step 1

| Brief cites | At d9af | Status | Lanes |
|---|---|---|---|
| `engine/live.ts:629` | `this.releaseAudio();`, inside `finishReadiness` (`:610`) | MATCHES | none |
| `engine/live.ts:661` | `this.releaseAudio();`, inside `finish` (`:648`) | MATCHES | none |
| `engine/live.ts:707` | `private releaseAudio(): void {` | MATCHES | none |
| `reset()` `:258-273` | `private reset(): void {` ... `this.releaseAudio();` at `:272`, `}` at `:273` | MATCHES | none |
| `acquire()` `:326-370` | `:326` is the middle of the doc comment (`:324` opens it). `private async acquire(gen: number)` is `:330`. `getUserMedia` is `:341`. `new AudioContext({ sampleRate: TARGET_SR })` is `:364`, fallback `new AudioContext()` `:366`. The method closes at `:392`. `:370` is `dbg('audio context: ...')` inside it. | WRONG range: the method is `:330-392` | none |
| `engine/session.ts:68-87` | `:68` blank; `export interface CaptureSession {` is `:69`; `cancel(): void;` is `:86`; `}` is `:87` | MATCHES (interface is `:69-87`) | none |
| `routes/+page.svelte:1643-1648` | `function enterCalibration() { calibrating = true; }` and `function exitCalibration() { calibrating = false; }` | MATCHES at d9af. In merged: `:1644-1649` (lane 57 adds one import at `:13`) | lane 57 (+3 -0) and lane 58 (+3 -2), neither inside these lines; they shift them by one |
| `components/Drawer/Drawer.svelte:846` | `<div class="drawer-takeover" class:stowed={!takeoverActive}>` | MATCHES | none |

### Step 2

| Brief cites | At d9af | Status | Lanes |
|---|---|---|---|
| `tapVowel` `VowelCapture.svelte:231-239` | `function tapVowel(v: Vowel) {` `:231` ... `}` `:239` | MATCHES | none |
| `startTake(v)` at `:238` | `startTake(v); // a tapped vowel starts at once and takes precedence` | MATCHES | none |
| second-tap cancel at `:234` | `if (v === ritual.vowel) ritual.cancel();` | MATCHES | none |
| `pressMain` `:240-244` | `function pressMain() {` ... `startTake(selected);` `:243` `}` `:244`. `:241` is `if (main.kind === 'done') return onReturn();`, which the brief does not mention. | MATCHES | none |
| Stop and Escape `:245-264` | `pressStop` `:245-258`, `onKeydown` `:259-264` | MATCHES | none |
| `mainButton` `done` branch `chart/screen-logic.ts:77` | `if (sung.size === VOWELS.length) return { kind: 'done', label: tv('capture.done', language), disabled: false };` | MATCHES | none |
| "the control at `VowelCapture.svelte:397-399`" | `{#if returnShown}` / `<button ... class="return" onclick={onReturn}>{t('calib.capture.returnToSummary', language)}</button>` / `{/if}` | MATCHES | none |
| tick's AudioContext "made inside the tap, `count-in.ts:41`" | `count-in.ts:41` is `if (at === 0) onStep(step);`, the immediate call for the first step. The context is made in `capture-ritual.svelte.ts:130` (`audioCtx ??= new AudioContext();`), inside `tick()` (`:127-144`), called at `:174` from the `runCountIn` callback (`:165-175`). It is closed only in `destroy()` (`:268`). Plan r4 section 4.4 cites both places (`count-in.ts:41`; `capture-ritual.svelte.ts:130`, `:173-174`). | WRONG file for where the context is made; `count-in.ts:41` is the synchronous trigger | none |

### Step 3

| Brief cites | At d9af | Status | Lanes |
|---|---|---|---|
| `SWEEP_MS`, `:37` | `capture-ritual.svelte.ts:36` is `export const SWEEP_MS = 3000;`. `:37` is the `LANDING_MS` comment. (`live.ts:111` has `SWEEP_S = 3.0`; there is no `SWEEP_MS` in `live.ts`.) | MOVED to `:36` (plan r4 cites `:36`) | none |
| `RitualPhase` (`:45`) | `export type RitualPhase = 'idle' \| 'sing' \| 'pause' \| 'listening' \| 'sweep' \| 'landing';` is `:43`. `:45` opens the `RitualCue` doc comment. | MOVED to `:43` | none |
| wait for steady fry "up to 10 s, `engine/live.ts`" | `live.ts:117` `const LISTEN_TIMEOUT_MS = 10_000;`, used at `:404` | MATCHES (no line given in the brief) | none |
| `count-in.ts:27-33` | `COUNT_IN` array, steps `sing`, `two`, `one`, `pause`, `fry` | MATCHES | none |
| `PAUSE_MS` `count-in.ts:22` | `export const PAUSE_MS = 3000;` | MATCHES | none |
| bar `VowelCapture.svelte:302-311` | `<div class="bar" role="progressbar" ...>` `:302` ... `</div>` `:311` | MATCHES | none |
| `PROGRESS_STEP_REDUCED_MS`, `:42` (read as `VowelCapture.svelte`) | `VowelCapture.svelte:42` is `voiceType,` (a prop). The constant is `capture-ritual.svelte.ts:41` (`PROGRESS_STEP_REDUCED_MS = 250`); `:40` is `PROGRESS_STEP_MS = 50`. | WRONG file; right place is `capture-ritual.svelte.ts:41` | none |
| `chart/tour.ts:23-37` | `nextVowel` body: `if (pass) {` `:23` ... `return null;` `:37`; the function is `:22-38` | MATCHES | none |
| ritual goes idle at once under reduced motion, `capture-ritual.svelte.ts:237` | `if (deps.reducedMotion()) toIdle();` | MATCHES | none |

### Step 4

| Brief cites | At d9af | Status | Lanes |
|---|---|---|---|
| head and count `:275-278` | `<header class="head">` ... `</header>` | MATCHES | none |
| vowel's row `:280-294` | `<div class="glyph-row">` `:280` ... `</div>` `:292`; `:293` blank; `:294` is `<div class="stage" ...>` | MATCHES (range runs two lines into the stage's opening) | none |
| cue "alone in its row" `:312-313` | `<div class="cue-row">` `:312`, `<p class="cue" ...>` `:313`. **The row is not cue-alone today:** `:314-322` puts the readout (`.readout`, `aria-hidden`) in the same row. Step 4 item 2 moves the readout out; consistent with the brief, but `:312-313` alone is not the whole row. | MATCHES (row ends `:323`) | none |
| first-time explanation `:324-326` | `{#if showExplain}` / `<p class="explain-first">` / `{/if}` | MATCHES | none |
| ten buttons `:328-344` | `<div class="buttons" ...>` ... `</div>` | MATCHES | none |
| main and second button `:346-349` | `<div class="actions">` `:346`; `.main` `:347`; `.stop` `:348`; `</div>` `:349` | MATCHES | none |
| hint to hide toggle `:352-395` | `<p class="hint">` `:352` ... `</label>` `:395` | MATCHES | none |
| chart `:296-301` "inside the sticky stage" | `{#if hiding}` `:296` ... `{/if}` `:300`, `</div>` `:301`. The chart sits in `.chart-box` (`:295`) inside `.stage`. | MATCHES | none |
| "`.stage`, `:296`" | `<div class="stage" class:flows={stageFlows}>` is **`:294`**. `:296` is the `{#if hiding}` line. | WRONG: `:294` | none |
| `.stage` styles "near `:504-517`" | `.stage { position: sticky; ... }` `:504-513`; `.stage.flows` `:515-517`; comment `:503`. Note `.stage` also wraps the buttons and actions (it closes at `:350`), so removing it moves the controls too. | MATCHES | none |
| view moves on phase change `:141-164` | the `$effect` on `ritual.phase`/`ritual.vowel` | MATCHES | none |
| `zoomTarget` `chart/geometry.ts:93` | `export function zoomTarget(full: View, zone: Zone, readings: ...)` | MATCHES | none |

### Step 5, 6, 7, 8, and section 4

| Brief cites | At d9af | Status | Lanes |
|---|---|---|---|
| "no pointer handler in `chart/VowelChart.svelte` or `chart/ChartLayers.svelte`" | `grep -n "pointer\|onclick\|on:click\|role="` finds only `VowelChart.svelte:37` `<svg ... role="img" ...>`. No handler in either file. | MATCHES | none |
| `derivations.ts`; `resolve-values.ts:206-212`; `stand-ins.ts` | `derivations.ts` is `voice/engine/derivations.ts` (there is no `voice/derivations.ts`). `resolve-values.ts:206-212`: `const implausible = ...` through `const standIns = ... fillStandIns(...)`. | MATCHES (see section 3) | none |
| `CalibrationWizard.svelte:894-903` | `{#snippet challengingInvite()}` ... `{/snippet}`; its button key `calib.challengingInvite.button` reads "Sing the three Ilya derived for you" (`i18n.ts:1276`) | MATCHES | none |
| `i18n.test.ts:155` | `it('every French value in i18n.ts follows the table', ...)` | MATCHES | none |
| `insights.silence.noScore` `i18n.ts:1833` | `'insights.silence.noScore': { en: 'No score has been added, so there is nothing of this piece to measure.', ...` | MATCHES at d9af; **`:1835` in merged** | lanes 56, 57, 58 all edit `i18n.ts` (+5 -1, +17 -1, +2 -2); none edits this key |
| `InsightsPane.svelte:284-293` | `hasTypedCharacteristics` `:284-286`; `methodLine` `:288-293`, which reads `!model ? T('insights.method.silent') : fill(T(methodLineKey({ generic: adapted.generic, typed: ... })), ...)` | MATCHES | lane 58 deletes one line at `:520` (`versionAccent="var(--rose-ink)"`), below the cited block; file is 744 at d9af, 743 merged |
| `insights/identity.ts:41-43` | `export function restsOnSamples(...) { return adapted.completeness.formants && !adapted.generic; }` | MATCHES | none |
| `analysis/analyze-score-adapter.ts:97` | `formants: Object.keys(s.fR1).length > 0,` (inside `completenessOf`, `:95-102`) | MATCHES (see the caveat in section 3) | none |
| `e2e/calibrate-new.test.ts:13-34` | `async function open(` `:13` ... `}` `:27`; `async function toCapture(` `:29` ... `}` `:34` | MATCHES | none |
| `engine/readiness.ts:133-134` | `READINESS_PREP_MS = 2100;` `READINESS_CAPTURE_MS = 3000;` | MATCHES | none |
| `chart/model.ts:12-13` | `CHART_W = 484;` `CHART_H = 280;` | MATCHES | none |
| `Drawer.svelte`, `CalibrationWizard.svelte` 1,726 of 1,727 | 1,726 lines; ceiling 1,727 (`scripts/ratchets.json`) | MATCHES | none |

### The brief's header claim about the lanes

Line 5 says "Lanes 56 to 58 touch none of the files this lane owns except `i18n.ts`." That is not accurate for the owned set in section 4 of the brief:

- Lane 58 edits `insights/InsightsPane.svelte` (-1 line at `:520`). The brief itself says "743 after lane 58" at Step 8, so the header contradicts its own Step 8.
- Lane 56 edits `insights/ratified-lines.test.ts` (+11 lines, a new `describe` for the strophic verse strings at `:465-475`). The brief owns "their tests" and Step 8 says to update that file.
- Lane 58 and lane 57 edit `routes/+page.svelte` (not owned, but cited at Step 1).

## 2. The microphone's lifetime and the take's timing: call sites

Method: `git grep -n <name> d9af5ac9 -- apps/web/src apps/web/e2e apps/web/e2e-phone`. No lane touches any voice file, so the merged tree gives the same list.

### The microphone and the session

- `releaseAudio`: `live.ts:272` (in `reset()`), `:295` (in `cancel()`), `:319` (in `fail()`), `:629` (`finishReadiness`), `:661` (`finish`), `:707` (definition). **The brief names `:629`, `:661`, `:707`, and `reset()`; it does not name `cancel()` (`:295`) or `fail()` (`:319`), which also release.** `start()` calls `reset()` at `:240` and `startReadiness()` calls `reset()` at `:251`, so today every start releases the previous run's stream before it acquires.
- `acquire`: definition `live.ts:330`; called at `:395` (capture, `run`) and `:409` (readiness, `runReadiness`). The only other `acquire(` hits in the tree are `omr/homr-reader.ts` (unrelated).
- `getUserMedia`: `live.ts:341` (the one call), `:334` (the feature test). Other hits are comments (`live.ts:5`, `:183`, `:326`; `session.ts:7`, `:18`; `readiness.ts:4`; `CalibrationWizard.svelte:210`) and `reader/vendor/webmscore.js:34` (a vendored file, unrelated). **No test mocks or counts `getUserMedia`.** There is no `engine/live.test.ts`; `LiveCaptureSession` is referenced only in `live.ts`, `chart/stub-switch.ts`, and `chart/stub-switch.test.ts` (an `instanceof` check, `:16`).
- `cancel(` on the session: `live.ts:280` (definition), `session.ts:86` (interface), `stub.ts:192` (definition), `stub.ts:136` (`start` calls `this.cancel()`), `stub.ts:167` (`startReadiness` calls `this.cancel()`), `capture-ritual.svelte.ts:254` (in the ritual's `cancel`), `:266` (in `destroy`), `CalibrationWizard.svelte:458` (`resetFlow`, only when `phase === 'readiness'`). Test doubles: `capture-ritual.test.ts:25` defines `cancel()`; the test asserts `session.cancels` at `:243`, `:257`, `:282`, `:415`, `:424`. The ritual's own `ritual.cancel()` is called at `VowelCapture.svelte:234`, `:247`, `:262`.
- `startReadiness`: `session.ts:78` (interface), `live.ts:250`, `stub.ts:166`, `CalibrationWizard.svelte:659` (the only caller), `capture-ritual.test.ts:24` (a no-op double).
- `session.start(`: `capture-ritual.svelte.ts:183` (the only caller; it runs when the count-in reaches `fry`, `:167`).
- The session is created once per wizard: `CalibrationWizard.svelte:211` (`session: captureSession = captureSessionFor()`), handed to `VowelCapture` at `:1138`.
- `pagehide`, `visibilitychange`, `onDestroy`: none in `voice/` (grep). `VowelCapture.svelte:174-184` is an `onMount` whose cleanup calls `ritual.destroy()` (`:182`); that is the only unmount hook, and the wizard stays mounted when the takeover is stowed (Drawer `:846`), so a take begun before Back runs on (plan r4 section 7.1 says the same).

### The count-in, the take, the sweep

- `runCountIn`: `count-in.ts:39` (definition), `capture-ritual.svelte.ts:30` (import), `:165` (the call in `begin`), `count-in.test.ts:8` (import), `:20` (the test's `begin`).
- `COUNT_IN`: `count-in.ts:27` (definition), `:40` (loop). No other file reads it.
- `PAUSE_MS`: `count-in.ts:22` (definition), `:32` (`3 * SING_BEAT_MS + PAUSE_MS`). The tests do not import it; they hold their own literal (below).
- `SING_BEAT_MS`: `count-in.ts:16` (definition `= 1000`), `:29`, `:30`, `:31`, `:32`; comments at `chart/view-motion.ts:8` and `CalibrationWizard.svelte:663`.
- `SWEEP_MS`: `capture-ritual.svelte.ts:36` (definition `= 3000`), `:208`, `:211`; comments at `CalibrationWizard.svelte:536`, `:553`, `engine/readiness.ts:124`, `:130`. The engine has its own `SWEEP_S = 3.0` (`live.ts:111`), used at `:560`.
- `LANDING_MS`: `capture-ritual.svelte.ts:38` (definition `= 900`), `:238`; `VowelCapture.svelte:23` (import), `:155` (`motion.to(model.full, ms(LANDING_MS))`).
- The tick: `capture-ritual.svelte.ts:110` (`let audioCtx`), `:127-144` (`tick()`), `:130` (creation), `:174` (call), `:268` (close in `destroy`). Today three ticks sound, on the `sing`, `two`, `one` steps (`:173-174`), at 0, 1,000, and 2,000 ms after the tap; none on `pause` or `fry`.
- Today's count-in runs from the tap: 0 `sing`, 1,000 `two`, 2,000 `one`, 3,000 `pause`, 6,000 `fry` (`count-in.ts:27-33`); the session starts at 6,000 ms (`capture-ritual.test.ts:13`).
- The engine's own waits: `GATE_WINDOW_S = 1.0` (`live.ts:105`), `GATE_HOP_MS = 250` (`:107`), `LISTEN_TIMEOUT_MS = 10_000` (`:117`), readiness `READINESS_PREP_MS = 2100`, `READINESS_CAPTURE_MS = 3000` (`readiness.ts:133-134`).
- The stub's clock (`engine/stub.ts`): stable fry after `500 + Math.random() * 500` ms (`:139`), complete 3,000 ms later (`:140`); readiness: a 1,000 ms timer (`:188`) and `READINESS_PREP_MS + READINESS_CAPTURE_MS` (`:186`).

### Tests that pin a timing literal

- `voice/capture-ritual.test.ts:12`: `const BEAT = 1000, PAUSE = 3000, SWEEP = 3000, LANDING = 900;` and `:13`: `const FRY_AT = 3 * BEAT + PAUSE; // 6000`. Its header comment (`:3`) says the literals are held here, not imported, so a silent change fails. Further literals in the same file: `advanceTimersByTime(FRY_AT + 4000)` `:126`, `1500` `:131` `:133` `:411`, `1000` `:140` `:255` `:344`, `SWEEP + 2000` `:152`, `30_000` `:245` `:337` `:413`, `50` `:177`, `SWEEP + 500` `:268`, `3 * BEAT + PAUSE` `:385`, `LANDING - 1` `:163`, a test titled "lands for 900 ms" `:158`, and a fixture `actualMs: 900, minimumMs: 2000` `:325` (an engine error payload, not a ritual timing). The `BEAT`/`PAUSE` boundary checks are at `:85-95`.
- `voice/count-in.test.ts:10`: `const BEAT = 1000, PAUSE = 3000;`; `advanceTimersByTime(3 * BEAT + PAUSE)` `:47`, `(3 * BEAT + PAUSE - 1)` `:63`, `(10 * BEAT)` `:87`. Header `:4` states "1000 ms a beat and a 3000 ms pause".
- `voice/chart/view-motion.test.ts:26`, `:48`, `:51`, `:52`, `:61`, `:63`: literals 1000 and 2000, but these are `motion.to(B, 1000)` durations of the view animation, not the take's timing.
- `voice/VowelCapture.test.ts`: no timing literal (grep for `1000|2000|3000|900|6000|advanceTimers|setTimeout` finds none). It pins `role="progressbar"` at `:96` and mounts `StubCaptureSession` (`:9`, `:22`).
- `voice/chart/screen-logic.test.ts`: no timing literal found.
- `apps/web/e2e/calibrate-new.test.ts` (the stub session's real clock):
  - `:83` `waitForTimeout(2500)` (zoom reached during a take), `:87` `100`, `:91` `700` (the cancel's zoom-out).
  - `:117` comment "The count-in is 6 s (three beats, a 3 s pause); the stub's stable fry comes 0.5 to 1 s after it, its sweep 3 s after that."; `:118` `for (const ms of [500, 4500, 6150, 8200])` (one cancel per phase: sing, pause, listening, sweep); `:121`.
  - `:133`, `:137` `800` (before Stop and before Escape).
  - `:359` `400`, `:388` `600`, `:362` timeout `20_000`.
  - Generic waits `40_000` at `:41`, `:56`, `:105`, `:149`, `:156`, `:170`, `:207`, `:284`, `:313`; `45_000` `:23`; `30_000` `:32`, `:381`; `test.setTimeout(120_000)` `:114`.
  - Tests that start a take by clicking a vowel button (the behaviour Step 2 removes): the full tour (`:44`), the cancel/zoom test (`:74`), the manual pick (`:96`), cancel in each phase (`:113`), the rolled-back re-take and error (`:142`), hidden mode (`:199`), the soprano test (`:232`), and the `.stage` and button-line tests at `:244`, `:288`, `:322`, `:371`, `:392`. This list is my reading of the file's `btn(page, /^cardinal-i/).click()` use; I did not run it.
  - **Tests that assert `.stage` is sticky or static:** `:244-264` ("scrolled until the stage sticks ...") and `:322-370` (`position(page)` reads `.stage` computed `position`, `:324`, `:333`, `:360`, `:363`). Step 4 removes `.stage`, so these break, not merely "depend on how it is built" (plan r4 section 6 lists item 16 as depending, and item 13 as depending).
- `apps/web/e2e/singer-paths.test.ts`: no capture, take, or timing-literal use of the voice session (its waits are `300`, `500`, `2_000` at `:74`, `:78`, `:113`, `:141`, `:145`, for other flows). It is not in the grep for `capture=stub`.
- `welcome-sheet.test.ts` (lane 57, new): not examined for capture timing; it is a welcome-sheet suite.

## 3. Step 6: which code fills an unrecorded vowel

Files read in full: `voice/engine/derivations.ts` (109 lines), `voice/engine/resolve-values.ts` (215), `voice/engine/stand-ins.ts` (238). (The brief's name "voice/derivations.ts" is `voice/engine/derivations.ts`.)

### What the code does

- "Recorded" on the capture screen is `VowelCapture.svelte:88`: `profile[v] && profile[v]!.reading !== 'estimated' && profile[v]!.f1 > 0`. That counts a reading the guard judged implausible, and a reading with no fR2.
- The chart's dots and zones come from `chart/zones.ts:88-129` (`computeZones`): `now = resolveVowelValues(profile, voiceType, { placeholders: 'always' })` (`:93`), and an unrecorded vowel's dot takes `source: src === 'derived' ? 'derived' : 'surrogate'` (`:125`). INSIGHTS uses the same function with `{ placeholders: 'declared-types' }` (`analysis/analyze-score-adapter.ts:132`). The wizard's roster has a third reader: `profile[g] ?? deriveFrom(g, profile)` (`CalibrationWizard.svelte:828`).
- `resolveVowelValues` runs in this order: judge unjudged readings (`resolve-values.ts:103`, `:48-68`); take usable sung fR1 (`:131-136`, `isUsable` = not implausible unless kept, `plausibility.ts:317-319`) and fR2 (`:147-152`, also requires fR2 > 0 and `f2Quality !== 'absent'`); derive each of the four from sampled anchors (`:183-195`, through `deriveFrom`, `derivations.ts:96-109`); then, if `anySung || generic || placeholders === 'always'` (`:209-212`), `fillStandIns` (`stand-ins.ts:191-238`).
- The derivation table is `DERIVE_ANCHORS` (`derivations.ts:49-54`): [ɨ] from [i] and [u]; [ɪ] from [e] and [i]; [ʌ] from [ɑ] and [ɛ]; [a] from [ɑ]. **[o] is in the brief's six anchors but no derivation reads it.** A derivation needs every anchor to have f1 > 0, f2 > 0, and not be implausible-and-unkept (`usableAnchor`, `derivations.ts:77-88`); any miss returns `undefined` (`:105`).
- `fillStandIns` fills, in this order: each of the six Bozeman vowels still lacking fR1 or fR2 with the fitted template, flagged `surrogate` (`stand-ins.ts:202-213`); then each of the four still lacking a value, derived from "whatever anchors now stand", flagged `surrogate` if any anchor was a surrogate and `derived` otherwise (`:215-232`).
- The template is the voice type's bucket (`standInBucket`, `:63-70`) for fR1 (centres of `CORE_BANDS`, `:97-101`) and Mitton's fR2 scaled by the bucket (`:102-105`), then shifted by the recorded vowels: one or two recorded vowels shift it, three or more that span the arc (one of [i]/[e], one of [ɛ]/[ɑ], one of [o]/[u]) shift and spread (`fitResonance`, `:125-142`); a recorded vowel more than `OFF_SHAPE_SEMITONES` off the fit is dropped from the fit and reported (`fitWithoutOutliers`, `:151-169`; report `:233-237`).

### (a) Fewer than the six anchors recorded (at least one recorded)

- Each unrecorded vowel among the six: `fillStandIns` (`stand-ins.ts:202-213`), `surrogate`, from the voice type's staff shifted (and from three vowels, spread) by what is recorded.
- Each of the four whose anchors are all recorded and usable: `deriveFrom` (`resolve-values.ts:183-195`), `derived`, from the singer's own vowels, not from the voice type. Example: [i] and [u] recorded gives a derived [ɨ].
- Each of the four with a missing anchor: `stand-ins.ts:215-232`, `surrogate` if any anchor was itself a surrogate.
- Caption "Ilya fills the other {m} from your voice type." The voice type picks the starting staff only; the recorded vowels move it, and some of the {m} are derived from recorded vowels with no voice type involved. **The caption is true in outline for typed voices and untrue as written for a voice with no type or "Not sure" (see (c)), and it does not describe the derived ones.** Whether it is acceptable is the reviewer's call; what the code does is above.

### (b) All six recorded

- If all six are usable and the five that feed derivations ([i], [e], [ɛ], [ɑ], [u]) each have f2 > 0: nothing is missing. The six are `sung` (`resolve-values.ts:131-152`); the four are `derived` by `deriveFrom` (`:183-195`); `fillStandIns` runs (`anySung` is true, `:212`) but finds no gap (`stand-ins.ts:203`, `:208`, `:216`).
- If one of the six is recorded but implausible and not kept, or has no fR2: it is treated as absent. Its own fR2 (or fR1) gets a `surrogate` (`stand-ins.ts:203-212`), any derivation that needs it fails (`derivations.ts:105`) and falls to `stand-ins.ts:215-232`, flagged `surrogate`.
- Caption "You have recorded the six vowels Ilya needs. From them, it works out [ɪ], [ɨ], [a], and [ʌ]." True when every anchor above is usable. Untrue in the two cases in the previous bullet (a recorded vowel with no usable fR2 or an implausible reading), because the button state `sungSet.size` (`VowelCapture.svelte:88`) cannot see either condition. The six also include [o], which the derivations do not use.

### (c) Contralto, countertenor, bass-baritone, "Not sure", and no type

- With at least one recorded vowel, `anySung` is true (`resolve-values.ts:209`) so stand-ins run for every type, chart and INSIGHTS alike (`:212`). The type only chooses the bucket (`stand-ins.ts:63-70`): contralto and countertenor map to `tenor-mezzo` (`:66`; the countertenor mapping is flagged "DESK INFERENCE", `:60`), bass-baritone maps to `bass` (`:68`), and "Not sure", no type, or any other string maps to `middle` (`:69`; "the middle of all five staves", `:91-96`, `:101`).
- Caption (a) "from your voice type": true as a mapping for contralto, countertenor, and bass-baritone; **not true for "Not sure" or no type**, where the staff is the middle of five and no type was given.
- With nothing recorded, the chart fills all ten for every type (`'always'`, `zones.ts:91`, `:93`), but INSIGHTS does not for these four types and "no type": `hasPlaceholderProfile` is false (`stand-ins.ts:81-87`), so `standIns` is undefined (`resolve-values.ts:210-212`) and `generic` is false (`:210`). The finish-early button does not appear in that state (brief: "shown from the first recorded vowel"; today `returnShown` is `sungSet.size >= 1`, `VowelCapture.svelte:265`).

### Step 8's "a type-only voice counts as measured in `analyze-score-adapter.ts:97`"

- True only for the five types with a placeholder profile: soprano, mezzo-soprano, tenor, baritone, bass (`stand-ins.ts:81`). For them, with nothing sung, stand-ins fill `fR1` (`resolve-values.ts:212`), so `completenessOf` returns `formants: true` (`analyze-score-adapter.ts:97`) and `generic` is true; `restsOnSamples` is therefore false (`identity.ts:41-43`).
- For contralto, countertenor, bass-baritone, "Not sure", and no type with nothing sung: `fR1` is empty, so `completeness.formants` is false, `generic` is false, `restsOnSamples` is false, and `model` is null (`InsightsPane.svelte:201-210`). Such a voice is neither "measured" nor "type-only with placeholders" in the code. If the brief's rule is "line 28 when `restsOnSamples`, otherwise line 29", it prints the type-only line (29) for a voice that has no type at all. The text of lines 28 and 29 is not available (the sheet is absent), so I cannot say whether that wording fits. The existing key choice at `InsightsPane.svelte:291` (`methodLineKey({ generic: adapted.generic, ... })`) separates by `generic`, not by `restsOnSamples`.

## 4. Line counts (method of `scripts/ratchets.mjs:63`)

Method as in the script: `text.split('\n').length - (text.endsWith('\n') ? 1 : 0)`. Test files (`/\.(test|spec)\.ts$|\.d\.ts$/`, `ratchets.mjs:37`) are exempt from the size check. A file with no entry in `scripts/ratchets.json` `ceilings` is held to `newFileMaxLines` = 1,000. `i18n.ts` is in `exempt`. Computed by `/home/claude/s6/count.py` over `git show <rev>:<path>`.

`scripts/ratchets.json` differs between d9af and merged only in two ceilings lowered by lane 56: `packages/score-parser/src/staff-renderer.ts` 3,427 to 3,414 and `apps/web/src/lib/markup/MarkupPane.svelte` 1,364 to 1,353. Neither file is owned by lane 59.

| File | d9af | merged | Ceiling | Free lines (merged) |
|---|---|---|---|---|
| `voice/VowelCapture.svelte` | 817 | 817 | none (1,000 for a file without one) | 183 |
| `voice/capture-ritual.svelte.ts` | 295 | 295 | none (1,000) | 705 |
| `voice/count-in.ts` | 63 | 63 | none (1,000) | 937 |
| `voice/chart/screen-logic.ts` | 127 | 127 | none (1,000) | 873 |
| `voice/chart/VowelChart.svelte` | 71 | 71 | none (1,000) | 929 |
| `voice/chart/ChartLayers.svelte` | 219 | 219 | none (1,000) | 781 |
| `voice/chart/geometry.ts` | 280 | 280 | none (1,000) | 720 |
| `voice/engine/live.ts` | 760 | 760 | none (1,000) | 240 |
| `voice/engine/session.ts` | 87 | 87 | none (1,000) | 913 |
| `voice/engine/stub.ts` | 202 | 202 | none (1,000) | 798 |
| `insights/InsightsPane.svelte` | 744 | 743 | 744 | 1 (0 at d9af) |
| `insights/identity.ts` | 64 | 64 | none (1,000) | 936 |
| `voice/CalibrationWizard.svelte` (touch only) | 1,726 | 1,726 | 1,727 | 1 |
| `lib/i18n.ts` | 2,593 | 2,613 | exempt | not applicable |
| `voice/count-in.test.ts` | 91 | 91 | test, exempt | |
| `voice/capture-ritual.test.ts` | 429 | 429 | test, exempt | |
| `voice/VowelCapture.test.ts` | 198 | 198 | test, exempt | |
| `voice/chart/screen-logic.test.ts` | 145 | 145 | test, exempt | |
| `voice/chart/ratified-strings.test.ts` | 111 | 111 | test, exempt | |
| `lib/i18n-index.test.ts` | 65 | 65 | test, exempt | |
| `insights/ratified-lines.test.ts` | 464 | 475 | test, exempt | |
| `apps/web/e2e/calibrate-new.test.ts` | 401 | 401 | test, exempt | |

Notes:

- The brief's "1,726 of 1,727" (wizard) and "744 of 744, 743 after lane 58" (`InsightsPane.svelte`) are both confirmed. The Step 8 sentence "Free lines before adding any" is a real constraint: one free line after lane 58, and the pane's own `methodLine` block is `:288-293`.
- `VowelCapture.svelte` has no ceiling in `ratchets.json`, so the 1,000-line limit for a file without a ceiling applies to it. It has 183 lines of room. Step 4 moves a block and adds a take-line component (a new file); Steps 5 and 6 add handlers and a button to it.
- `live.ts` has 240 lines of room for Step 1.
- Merged `i18n.ts` has 2,613 lines (+20 over d9af); `i18n-index.test.ts` pins the header count (see section 0: the merged header must read 1,280).
- I did not check the brief's claim that a new file "stays under 1,000 lines" beyond the rule at `ratchets.mjs:62-66`.

## 5. Contradictions with plan r4 section 4.4 and section 7.2

Excluded as the brief says Dann changed them on 2026-11-16: chart below the buttons; tap on the chart in this lane; microphone per visit; finish early; spoken count gone. Everything below is something else. "Plan" means `plan-voice-in-the-drawer_r4_2026-11-15.md`.

1. **The side view's size and the two-square stage.** Plan 4.4, "The stage": two equal squares, side view first, vowel space detail second (Dann 19:45; `plan:28-55` table), and "The side view: ... a square of the stage's half width: about 220 px in a desk Drawer and 155 px on a 390 px phone ... Its line is re-weighted for that size". The brief Step 4 item 2 keeps the side view "in its squircle (`:280-294`, kept as built)", never mentions the 220 px and 155 px sizes or the line re-weighting (`SagittalDrawing.svelte:1-6`), and its rulings table does not list the 19:45 ruling as superseded. The chart move explains why there is no second square; it does not by itself drop the plan's side-view size. NOT covered by Dann's 2026-11-16 list.
2. **Who owns the wizard's Back and take-ending.** Plan 7.1: "leaving the takeover tells the wizard, which ends any take (D13)" is part of lane 60's seam, and plan 7.2 gives lane 59 no lines of `voice/CalibrationWizard.svelte`. The brief gives lane 59 the wizard for the visit's open, close, and Back handling (Step 1) and for the finish-early wiring (Step 6), and sets the DESK DEFAULT "Back or Escape during a take ends it and keeps nothing" (brief section 2). The brief does say "Lane 60 also edits this file", but the ownership split differs from plan 7.2, and the Back/take-end behaviour is the same thing plan 7.1 gives to lane 60. Mic per visit does require a Back hook, so some wizard contact is implied by Dann's change; the overlap with D13 is not addressed in the brief.
3. **The no-score sentence.** Plan section 2 records Dann's 18:45 ratified English as "INSIGHTS measures a piece from its score. Choose one under INPUT to begin." The brief's Step 8 gives the ratified sentence (sheet line 27) as "INSIGHTS measures a piece from its score, and connects it to your voice. Add a score in the INPUT pane to begin." These are different sentences. The brief attributes the second to the sheet ratified at 01:13 on 2026-11-16 ("Yes to all your responses"); that sheet and that message are not in the repository (section 0), so I cannot confirm the later wording replaced the earlier one. Flag for the reviewer.
4. **Engine files.** Plan 4.4 (microphone bullet): keep the engine as it is unless Dann's iPhone trial fails, in which case "lane 59's file list gains `engine/live.ts` and `engine/session.ts`, and the choice goes to Dann (D9)". The brief puts `live.ts`, `session.ts`, and `stub.ts` in lane 59's ownership for mic-per-visit (Dann's change) and cites the trial result as passing (`INBOX.md` 2026-11-16 00:37-00:39). That passing trial is not in the tree (section 0). Not a contradiction of the plan so much as an unverifiable premise.
5. **The tick's context.** Plan 4.4 cites `count-in.ts:41` and `capture-ritual.svelte.ts:130`, `:173-174`; the brief keeps only `count-in.ts:41` (section 1, Step 2 row). The plan's cite is the more accurate of the two.
6. **Third tick context.** The brief's Step 1 test: "the tick context (Step 3) and the capture context are separate and both close on `closeVisit()`". Today the tick's context is closed only by `ritual.destroy()` (`capture-ritual.svelte.ts:268`), when `VowelCapture` unmounts, not by any session call, and the ritual does not know the session's visit. The plan is silent; the brief does not say which object closes the tick context on `closeVisit()` (the session never sees it). Flag as a design gap, not a fact error.
7. **`pressMain`'s `done` branch.** Plan 4.4 cites `VowelCapture.svelte:241` (`if (main.kind === 'done') return onReturn();`) as what "See your vowel space" takes over. The brief Step 2 says `mainButton` returns `retake` at ten and the summary is reached by the relabelled control at `:397-399`, but does not name `:241`, which becomes dead or must change.
8. **Reading "alone in its row".** Plan 4.4 item 5: the cue "alone in its row", with the readout moved to item 2. Brief Step 4 items 2 and 4 say the same. Consistent. (Noted only because `:312-313` today share the row with the readout, `:314-322`.)
9. **Tests the plan lists as depending versus the brief.** Plan section 6 says `e2e/calibrate-new.test.ts` "items 2, 3, 4, 5, 6, 8, 9, and 14 break, and items 1, 7, 10, 12, 13, 15, and 16 depend on how it is built". Brief section 4 repeats "items 2 to 6, 8, 9, 14 by plan r4". The `.stage` sticky assertions at `:244-264` and `:322-370` (section 2) break outright once the sticky stage goes (plan section 4.4 "Height" and brief Step 4 both remove it).
10. **What the plan says is "first to cut".** Plan 4.4 closes with the tap on a zone as "Last, and first to cut". The brief makes it Step 5, before Step 6 and Step 8, per Dann's change. Consistent with the change; the plan's cut order is no longer the build order.
11. **Section 7.2, slice 5.** Plan: lane 59 "last step, or lane 61". Brief: Step 8, lane 59. Consistent.
12. **Section 7.2 and `e2e/calibrate-new.test.ts` ownership.** Plan: lane 60 owns `open` and `toCapture` (`:13-34`) "and nothing else in it"; lane 59 owns the rest. Brief section 4 repeats this exactly. Consistent. (Plan 7.2 adds "lane 60's seam merges before lane 59 rebases"; the brief does not repeat this, and says instead that lane 59 is cut after lanes 56-58 and "Lane 60 also edits this file".)
13. **Part names and lengths.** Plan table: Breathe 2.0, Sing 4.0, Shape 2.0, Fry (1.0 to begin, then 3.0). Brief: 2, 4, 2, 4 with Fry as the wait plus 3 s measure. Consistent; the plan treats "1.0 s to begin" as nominal (`live.ts:105`, `:107`, `:520-524` by plan) and the brief says the line holds at the first quarter.
14. **Timing of the first Fry tick context versus the mic.** Plan: the microphone opens at Fry, 8 s after Start with Breathe first. Brief Step 3: "The microphone still opens at the Fry part within a visit's first take". Consistent (8 s, not 6 s; the brief's "6 s after the tap" refers to today's build).

## Could not establish

- The text of `sheet-english_r2_2026-11-16.md` (absent from every ref). So I cannot check sheet lines 15-24, 26b, and 27-29, nor whether line 27 matches Step 8, nor what lines 28 and 29 say. It is uncommitted on Dann's Mac as stated.
- Any 2026-11-16 quotation in the brief's section 2 table (00:32, 00:42, 00:44, 01:13), and Dann's iPhone trial of 00:37-00:39. The tree ends at 2026-11-15 23:57.
- The exact `stringKeys()` total of the merged tree. My count (1,280) is a regex count of `'key': {` lines compared across refs; vitest was not run.
- Which of the numbered e2e items (1 to 18) are which. I counted `test(` calls in file order from `calibrate-new.test.ts` (18 at `:44`, `:74`, `:96`, `:113`, `:142`, `:164`, `:173`, `:183`, `:199`, `:214`, `:222`, `:232`, `:244`, `:267`, `:288`, `:326`, `:375`, `:392`); the plan's item numbers may count differently.
- Whether the `welcome-sheet` e2e (lane 57) or `e2e-phone` suites reach the capture screen. I did not read them.
- Behaviour on a device: iOS suspension of an open AudioContext between takes, the Chrome iOS banner, whether keeping the stream changes the guard's first second. Brief section 7 already lists these as untested; I did not add evidence.
- Whether the eight gates run clean on the merged tip. Nothing was installed or run.
- Whether `VowelChart.svelte`'s `role="img"` svg affects a tap layer that must be `aria-hidden` (Step 5). I read only that no pointer handler exists.
