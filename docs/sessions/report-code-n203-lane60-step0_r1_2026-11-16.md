# Report: N.203 lane 60, Step 0 (read and report; nothing changed)

2026-11-16. Code (cloud session), branch `cloud-lane-60`, cut from `origin/Shane` at `16922501` ("Welcome sheet (lane 57) merged ..."). Working tree clean at the time of reading. The brief is `docs/sessions/brief-code-n203-lane60-the-voice-pane_r3_2026-11-16.md`, with every amendment of `docs/sessions/review-fable-lane60-brief-r2_r1_2026-11-16.md` section 2 as section 9 makes them part of it. Paths are under `apps/web/src/` unless they begin `docs/`, `apps/`, `packages/`, or `scripts/`.

Order the lane follows (review amendment 1): Step 0, 5, 6, 1, 2, 3, then wait for the desk's word that lane 59 is on `Shane`, then Step 4.

## 1. The eight gates on the untouched tip

Fresh clone state, `pnpm install --frozen-lockfile`, Linux sandbox, 2 cores.

| # | Gate | Baseline | Measured | |
|---|---|---|---|---|
| 1 | `packages/phonology` vitest | 462 passed (462) | 462 passed (462) | matches |
| 2 | `packages/dictionary` vitest | 248 passed (248) | 248 passed (248) | matches |
| 3 | svelte-check (`apps/web`) | found 0 errors and 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files | matches |
| 4 | `apps/web` vitest | 6313 passed \| 1 skipped (6314) | **6312 passed \| 1 failed \| 1 skipped (6314)** | **one test moved** |
| 5 | `packages/score-parser` vitest | 894 passed \| 5 skipped (899) | 894 passed \| 5 skipped (899) | matches |
| 6 | `packages/blurb` vitest | 178 passed (178) | 178 passed (178) | matches |
| 7 | root integration vitest (`vitest.config.ts`) | 159 passed (159) | 159 passed (159) | matches |
| 8 | `node scripts/ratchets.mjs` | ratchets: OK | ratchets: OK | matches |

I matched the baseline's order to the gates by their counts (the brief lists counts only); gate 5's 894 and gate 7's 159 are the score-parser and root runs, not Playwright. The Playwright suites `calibrate-new` and `singer-paths` are not among the eight and are run at the end, as section 6 says.

**Gate 4's one failure, on the untouched tip, in two full runs:** `src/lib/voice/engine/open-extract.test.ts > the open picker is agnostic > gives the same reading whichever vowel is asked`, "Test timed out in 5000ms" (5,800 ms measured). The test loops the open extraction over ten vowels on a synthesized fry. It is a wall-clock timeout, not an assertion, and the full run took 440 s on two cores against a Mac's three minutes. **Run alone afterwards (desk's word, shell restored): `open-extract.test.ts` 9 passed (9), file duration 10.35 s, tests 9.96 s.** So it passes in isolation and the full-run failure is a load-sensitive timeout on this two-core machine. The count is read as "the baseline's 6313 less one timeout under load", not as a regression of this lane (nothing is changed yet).

## 2. Line counts against `scripts/ratchets.json`

| File | Lines now | Ceiling | Free |
|---|---|---|---|
| `lib/voice/CalibrationWizard.svelte` | 1,726 | 1,727 | 1 |
| `routes/+page.svelte` | 5,511 | 5,534 | 23 (the review said 22 on a tip one line longer) |
| `lib/components/Drawer/Drawer.svelte` | 1,981 | 1,990 | 9 |
| `lib/components/Drawer/VoiceAnchor.svelte` | 136 | none (leaves with Step 2) | |
| `lib/voice/ProfileSwitcher.svelte` | 539 | none | |
| `lib/voice/chart/VowelSpaceSheet.svelte` | 401 | none | |
| `lib/voice/chart/readings.ts` | 101 | none | |
| `lib/voice/engine/readiness.ts` | 340 | none | |
| `lib/voice/VoiceTypeIntake.svelte` | 212 | none | |
| `lib/i18n.ts` | 2,613 | exempt | header says 1,280 keys |

The ratchet script's own printout says three ceilings could fall (`pairings.ts` 1422 to 1421, `musicxml-parser.ts` 1167 to 1166, and these two). I do not touch `scripts/ratchets.json` in Step 0. Step 5 frees wizard lines; I will lower the wizard's and the page's ceilings only if the brief or desk says so, and will not raise either (brief section 4).

## 3. Cited lines: held or moved

Read by `grep` and by opening the files on this tip.

- Held at the cited line or within 2: `engine/readiness.ts:108` (`FRY_PRESENCE_MIN_SNR_DB = 6`), `:133-134` (`READINESS_PREP_MS` 2100, `READINESS_CAPTURE_MS` 3000); `engine/stub.ts:99` (`fryAccepted: true`); `engine/stand-ins.ts:84` (`hasPlaceholderProfile`, brief says `:81-87`); `voice/VowelCapture.svelte:88` (`sungSet`); `components/Drawer/bandState.ts:245`; `voice/CalibrationWizard.svelte:237` (`store`), `:202` (`openRequest`), `:321-332` (answer effect; refusal at `:330`), `:836-850` (publication effect), `:1032-1043` (ProfileSwitcher mount, `disabled={phase === 'capture'}` at `:1035`), `:1141-1195` (summary), `:1196-1282` (characteristics), `:916-1002` (roster), `:894-903` (invitation), `:910-914` (characteristics buttons), `:777-783` (`retakeFromSummary`), `:771-774` (`continueTour`), `:785-789` (`finish`), `:213` (`onComplete`), `:419-422` (`setOwn`), `:243-248` (`nextDefaultName`), `:454-458` and `:485`, `:501`, `:522` (`resetFlow`).
- Moved: `routes/+page.svelte` `usableReadingCount` now `:1637` (brief `:1636`); `voiceCalibrated` `:1637`; `enterCalibration` `:1644`; `exitCalibration` `:1647-1649`; `openRangeFields` and `calibrationRequest` `:1656-1661` (brief `:1650-1660`); the wizard mount `:3878-3908` (brief `:3881-3903`); `<VoiceAnchor>` `:4163-4167` (brief `:4160-4165`); the notices begin after `:4196`. `components/Drawer/Drawer.svelte`: the takeover mount `:845-846` (brief `:819-823`), `class:stowed` `:448` (brief `:446-448`), `.stowed` `:1497`. `lib/i18n.ts`: MELODY's empty state is `profile.emptyState` at `:1448` (brief `:1446`); `calib.readiness.quiet` `:1288`, `.prepareLede` `:1289`, `.countThree` `:1290`, `.captureLede` `:1293`, `.noFry` `:1296`, `.guidance` `:1297` (review's key map held).
- The legend in `VowelSpaceSheet.svelte` is `:94-115` and the table `:118` onward (review amendment 19: held).

I did not re-read every line of every file the brief names (the engine's `live.ts` citations, the Drawer's NOTATION mount, `detector.ts`, `zones.ts`). They are not needed until Steps 4 and 2, and I will re-read each where I use it and say so in that step's report.

## 4. Seam B: does it hold?

**Yes, on this tip, with the review's amendments 3 to 7 applied.** Evidence:

- The voices and every write live in the wizard: `store` (`:237`), `createVoice` (`:473`), `duplicateActiveVoice` (`:489`), `selectVoice` (`:495`), `renameActiveVoice` (`:505`), `deleteActiveVoice` (`:512`), `setOwn` (`:419`, which also writes the voice type), `setCharacteristic` (`:404`). All of them call `resetFlow` or `persistStore`, and none depends on the wizard's phase except through `resetFlow`.
- The wizard is mounted whenever the Drawer is on Studio and the wall is down: `Drawer.svelte:845` (`{#if isStudio && voiceTakeover}`), hidden by a class (`:846`), and its snippet is `routes/+page.svelte:3878` under `INCLUDE_MARKUP_INSIGHTS`. So the pane has the store from first paint, as plan r4 section 7.1 says.
- The page already receives six values from the wizard through `onActiveProfileChange` (`:836-850`, `routes/+page.svelte:3888-3895`). The seam adds one object: the voices, the active id, `nextDefaultName`, and the six commands.
- The pane is never on screen beside the capture screen, because the takeover stows the whole Drawer content (`Drawer.svelte:446-448`, the stowed takeover sibling at `:845-846`, `.stowed` at `:1497`). That is why review amendment 3 removes the take-running flag.

What I could not establish from reading alone: whether `ProfileSwitcher` can be mounted outside the wizard without its own tests moving (`ProfileSwitcher.svelte` has its own test file; I will list it in Step 1's report before I change it). Nothing here stops the lane.

## 5. Where the three usable counts will disagree (brief section 4)

Read, not yet run on a fixture:

- `usableReadingCount(voiceFormants)` (`lib/voice/profileStore.ts:196`) counts readings the app may use: it excludes `implausible` readings the singer has not kept.
- `sungSet` (`lib/voice/VowelCapture.svelte:88`) counts every reading that is not `estimated` and has `f1 > 0`, so it **includes** an implausible reading.
- `capturedCount` (`CalibrationWizard.svelte:336`) counts every non-empty entry of the working profile, so it too **includes** an implausible reading, and a reading with no fR2.

So for a voice whose only readings are all implausible: `usableReadingCount` 0, `sungSet.size` and `capturedCount` at least 1. Steps 2 and 5 use `usableReadingCount` for the pane's sentence, as the brief says; I will put numbers on a fixture in Step 2's report.

## 6. What I could not establish, and what is open

- **Gate 4's one timeout on the tip:** two full runs both fail `open-extract.test.ts` at about 5.8 s against a 5 s limit. The platform's safety check failed for a few minutes; the isolated run was done after it recovered (section 1).
- Bash availability: the tool was unavailable for a time after gate 4. The report was written from the gate logs already captured.
- Seam B's cost in lines: not measured until Step 1.
- Nothing was run in a browser in this step.

## 7. For Dann's eye

Nothing needs his ruling in Step 0. The one fact worth his attention: **gate 4 reads 6312 on the untouched tip because one test timed out at 5.8 s against a 5 s limit on this two-core machine**. The isolated pass supports a load cause; it does not prove it (the file takes about 10 s even alone, so it sits near the limit). The desk's harness note (`docs/memory/ENVIRONMENT.md`, "The desk's gate measure, timed") records gate 4 alone at 9.6 minutes on a two-core workspace, so a load-sensitive timeout is plausible, but I have not shown it.
