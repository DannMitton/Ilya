# Report, N.199 Step 8: the new Calibrate screen for every singer, and the wheel deleted

Cloud lane 55, branch `cloud-lane-55`. This file grows by one part per step; each part is pushed with its step.

## Step 0. Read and report

**Base (A1).** Cut from `origin/Shane` at `e8f91ee7`, message "N.199 Step 8: integrate brief r2 with Fable review" (`git log`, `git rev-parse HEAD`). The local `Shane` ref in the fresh clone was at `649fe49`; `git fetch origin Shane` brought it to `e8f91ee`. Tree clean before any edit. Fresh clone, `pnpm install --frozen-lockfile`, Node v22.23.4, pnpm 10.28.0.

**The eight gates on the untouched tip** (run by one script, each exit 0):

| Gate | Count |
|---|---|
| 1 phonology | 462 passed |
| 2 dictionary | 248 passed |
| 3 web-check | 0 errors, 12 warnings (5 files) |
| 4 web-test | **5662 passed, 1 skipped (5663)** |
| 5 score-parser | 785 passed, 5 skipped (790) |
| 6 blurb | 178 passed |
| 7 integration | 155 passed |
| 8 ratchets | OK |

**Every importer of `calibrateNewOn` / `calibrate-switch`** (grep over `apps`, `packages`, excluding `docs/sessions`), as read:
- Code that calls it: `CalibrationWizard.svelte:49` (import) and `:258` (`const calibrateNew = calibrateNewOn()`), used at `:770`, `:985`, `:998`, `:1380`; `chart/SummarySheet.svelte:8` (import) and `:13`, used at `:16`.
- Its own test: `chart/calibrate-switch.test.ts`.
- Comments only that name `?calibrate=new`: `app.css:170`, `profileStore.ts:134`, `takes.ts:2`, `VowelCapture.svelte:5`, `chart/SummarySheet.svelte:2`, `e2e/calibrate-new.test.ts:2`.
- The address itself is used by `e2e/calibrate-new.test.ts:21` and `chart/stub-switch.test.ts:12-13`.

**Every importer of `lib/voice/pacifier/`:**
- Code import: **one**, `CalibrationWizard.svelte:45` (`import Pacifier from '$lib/voice/pacifier/Pacifier.svelte'`).
- Inside `pacifier/`: `contrast.test.ts:40` imports `./contrast`; `pacifier/count-in.ts` is a re-export of `voice/count-in.ts` (so `count-in` is already outside; nothing moves first, A7).
- Names it in a comment or a test-only path, no import: `lib/i18n.ts:58` and `:88` (the key index, which `i18n-index.test.ts` checks for existing paths: B1), `vowel-names.ts:22`, `engine/readiness.ts:124`, `CalibrationWizard.svelte:569`, `VowelCapture.svelte:5`, `capture-ritual.svelte.ts:4`, `count-in.ts:20`, `ARCHITECTURE.md:119`.
- Outside `lib/voice/`: nothing imports from `pacifier/` (grep over `apps`, `packages`, `scripts`). The desk's open question is closed.

**Other e2e tests that drive the wheel.** `grep -rn "pacifier\|Pacifier"` over `apps/web/e2e` and `apps/web/e2e-phone`: no match. `grep` for `calibrat|wizard|Resonance|wheel` finds only `calibrate-new.test.ts` and four files that seed a stored voice (`insights-page`, `insights-key-lines`, `pages-without-gaps`, `singer-paths`) and never open the wheel. Closed: none other drives the wheel.

**Other readers of the three CSS tokens** (`--surround-voice`, `--arc-green`, `--signal-red`): `Pacifier.svelte` and `pacifier/contrast.ts` and its test only; `+page.svelte:5045` and `app.css:144` name `--surround-voice` in comments.
