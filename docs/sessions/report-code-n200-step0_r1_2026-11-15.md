# Report, N.200 Step 0: read and report (nothing changed)

Cloud lane 52, branch `cloud-lane-52`. This file is Step 0 of `brief-code-n200-voice-as-it-is_r3_2026-11-14.md`. Read in a fresh clone; Node v22.23.4, pnpm 10.28.0, `pnpm install --frozen-lockfile`.

## Base

The local `Shane` ref in the clone was at `649fe49`. `git fetch origin Shane` brought it to `4e5b4ad` ("N.200: brief r3, re-cited after lane 55, with the ratified strings as Step 7"). `cloud-lane-52` was cut from `4e5b4ad9`. Tree clean before any edit.

## The eight gates on the untouched tip

(Run by one script, each exit 0; commands as in `.github/workflows/ci.yml`: the package `test` scripts, `pnpm --filter @ilya/web check`, root `vitest run --config vitest.config.ts`, `node scripts/ratchets.mjs`.)

| Gate | Count |
|---|---|
| 1 phonology | 462 passed |
| 2 dictionary | 248 passed |
| 3 web-check | 0 errors, 12 warnings (5 files) |
| 4 web-test | **5740 passed, 1 skipped (5741)** |
| 5 score-parser | 785 passed, 5 skipped (790) |
| 6 blurb | 178 passed |
| 7 integration | **159 passed** |
| 8 ratchets | OK (809 source files checked) |

These match the baseline the task named (gate 4 5740 passed, 1 skipped; gate 7 159 passed). The Step 0 report file was added while gate 4 was running; the count is unchanged.

## Every reader, with `path:line`, as read in this tree

All lines below were read in this session at `4e5b4ad`.

**`MITTON`** (the table, `engine/extract.ts:4-7`, exported, ten vowels, one bass). Production readers: `extract.ts:53` (`ltasFormants`), `:82` (`lpcFormants`), `:135` (`extractCore`). Test readers of the table itself: none (`stand-ins.test.ts` and `stand-ins-snapshot.test.ts` read `MITTON_FR2`, a different table in `stand-ins.ts`; `insights/comments.test.ts:44` names a fixture `MITTON`; `analysis/advice-resolver.ts:179` is a comment on Mitton's own synthesis).

**`pe1`, `pe2`** (locals from `MITTON[vowel]`): `extract.ts:53` to `:61` (`ltasFormants`: `nearestPeak` at `:57`, `:61`); `:82` to `:86` (`lpcFormants`: nearest at `:84`, `:86`); `:135` to `:159` (`extractCore`: fR1 nearest at `:140`, `closedPhaseF1(cp, pe1, F1R)` at `:148`, `prior: [pe1, pe2]` into the trace at `:151`, fR2 nearest at `:159`).

**`prior`**: the parameter of `closedPhaseF1` (`closed-phase.ts:192`, the reduce at `:196`); the trace field `ExtractTrace.prior` (`extract.ts:113`), written at `:151`; named in a comment at `capture-file.ts:12`. No other code reader. (The other hits for "prior" in the tree are English prose.)

**`plausibility`** (the field, `engine/types.ts:63`): written by `checkPlausibility` (`engine/plausibility.ts:246`, `:260`) and `buildPlausibilityEvent` (`:284`, `:306`), and at the wizard boundary `CalibrationWizard.svelte:300` (inside `withPlausibility`, `:297`). Read at `resolve-values.ts:51`, `:54`, `:59`, `:65` (`judgeUnchecked`), `derivations.ts:86`, `outside.ts:22`, `plausibility.ts:317-318` (`isUsable`). `engine/plausibility.ts` also owns the bands the verdict compares to (`CORE_BANDS`, `windowFor`, `bucketFor`), read by `stand-ins.ts:35`, `chart/zones.ts:27`, `note-picker.ts:23`.

**`plausibilityOverride`** (`types.ts:72`): written only by `keepReading` (`plausibility.ts:328`). Read at `resolve-values.ts:51`, `:59`; `derivations.ts:86`; `plausibility.ts:318`; `outside.ts:22`; shown at `CalibrationWizard.svelte:959`.

**`isUsable`** (`plausibility.ts:317-319`). Imported and called at: `resolve-values.ts:132` (fR1), `:148` (fR2, with `f2Quality !== 'absent'`), `:207` (the `implausible` list); `insights/InsightsPane.svelte:241`; **`profileStore.ts:197`** (`usableReadingCount`). The inline copy: `derivations.ts:86` (comment `:85`). **The brief omits `profileStore.ts:197`.** Its callers: `routes/+page.svelte:1652` (`voiceCalibrated`, the Drawer's anchor "calibrated") and `:1737` (the Voice band's count); `components/Drawer/bandState.ts:231` names it in a comment. Step 5.2 must list these: removing the `implausible` gate changes the count the Drawer prints.

**`keepReading`** (`plausibility.ts:327-329`): one caller, `CalibrationWizard.svelte:758` inside `keepOutside` (`:753-762`). (`document.keepReading` in `library/document.svelte.ts:531` and `omr/restore.ts:116` is the scan reader's, unrelated.) The restore at `:328` sets `reading` to `provisional` if `confidence === 'low'` and `captured` otherwise.

**`applyIghDivergence`** (`divergence.ts:11-21`): one caller, `CalibrationWizard.svelte:272`, inside `withIghPass` (`:266-275`), called at `:739` in `commitReading`. It sets `reading = 'provisional'` at `divergence.ts:15` (a missing or provisional anchor) and `:19` (divergent). **A fact the brief does not state:** `withIghPass` deletes `isDivergent` from the clone at `CalibrationWizard.svelte:273` right after computing it, so `isDivergent` reaches no reader today; Step 5.10's "keeps computing `isDivergent` as description" needs a place for it to be read. `divergence.ts:7` (`usable`) requires `f.reading !== 'provisional'` of [i] and [u], so a provisional [i] or [u] (including one demoted at `CalibrationWizard.svelte:301-302`) takes the `:15` branch.

**`f2Quality`**: computed at `analyze.ts:60-66`, called at `:107` with `g.reading === 'Captured'` (the guard's verdict) and `ex.f2Prom`. Read at `resolve-values.ts:148` (excludes only `absent`, as the brief says), `takes.ts:28`, `:38` (copied into the take record), written by `stub.ts:59` (always `clear`). **No reader tells `clear` from `marginal`**: confirmed.

**`agreement`**: computed at `extract.ts:171` from `lpcFormants` (prior-picked, `:82-86`); declared on `ExtractResult` (`:125`), returned at `:166`, `:167`, `:172`. **Nothing reads it** except the recorder, which writes `ExtractTrace.chosen` (the whole `ExtractResult`) into the JSON (`extract.ts:129`, `capture-file.ts:55-56`). No test reads `.agreement`.

**`coarseFormants`** (`guard.ts:13-28`): called once, `guard.ts:136`, per 100 ms frame; its output feeds the guard's `fr1`/`fr2` coefficients of variation (`T_FR1_CV`, `T_FR2_CV`, `guard.ts:4`). Prior-free: confirmed (the function takes `fr`, `sr` only). `analyze.ts:7-25` says the guard no longer makes a take Provisional on its own; `guard.reading` still reaches `f2Quality` (`analyze.ts:107`) and `fullWindow` reaches `confidence` (`:101`).

**`reading === 'provisional'`** (and its writers):
- Writers: `analyze.ts:103` (from `confidence === 'low'`); `CalibrationWizard.svelte:301-302` (demotion for `implausible`); `divergence.ts:15`, `:19`; `plausibility.ts:328` (restore); `stub.ts:64`, `:69` (the development stub).
- Readers: `divergence.ts:7`; `capture-ritual.svelte.ts:229` (the rule that a provisional re-take never replaces a captured reading), `:234` (the say key); `takes.ts:53` (the take's `outcome`); `markup/MarkupPane.svelte:447` (`provisionalVowels`, the status line, via `profile-status.ts`); `CalibrationWizard.svelte:804` (roster label), `:949` (class `is-provisional`), style `:1541`. Not a reader of the field, but of the verdict: `outside.ts:22`.
- **Use by ruling:** `resolve-values.ts:110-120` records that provisional readings are used (Dann 2026-07-15); confirmed by the code at `:132`, `:148`, which test `isUsable` and not `reading`.
- `hold` and the wheel: grep for `hold`, `implausible`, `plausibility` in `lib/voice/` finds no `hold.ts`. Surviving "hold" hits are English prose, `.wizard-hold-actions` (a CSS class for the reset-confirm buttons, `CalibrationWizard.svelte:1177`, `:1680`, `:1684`, `:1695`), and comments (`CalibrationWizard.svelte:288`, "hold copy"). No hold logic survives.

## Every site that computes a resonance or a status (`CONTRACT.md` §4)

**Resonance (a number in Hz):**
1. `extract.ts:133-173` `extractCore`: fR1 from the closed phase (`:148`) or the envelope (`:139-141`), fR2 from the envelope (`:157-161`), or LPC (`:163-168`). This is the path the app takes (`analyze.ts:85`, `:38`).
2. `extract.ts:51-63` `ltasFormants`: **no production caller**; its only caller is `i-extractor.test.ts:28`, `:57`. It repeats the prior-picked rule.
3. `extract.ts:65-88` `lpcFormants`: called at `extract.ts:164`, `:169` (the fallback, and the `agreement` value).
4. `closed-phase.ts:192-197` `closedPhaseF1`, over `closedPhaseResonances` (poles, `ORDER` 12 at `:35`, `MIN_BW`/`MAX_BW` at `:188`).
5. `guard.ts:13-28` `coarseFormants` (the guard's own estimate; does not reach a reading).
6. `analyze.ts:36-41` `f1Steadiness`: calls `extractFormants` on each half (`:38`); decides `confidence` (`:100`) and so `reading` (`:103`).
7. `engine/derivations.ts` (derived placeholders for the unsung vowels, from the anchors) and `engine/stand-ins.ts` (`fillStandIns`): numbers that are not measured; out of scope here, and they read measured readings through `isUsable` (see above).
8. `engine/stub.ts` (development only): fixed numbers.

**Status (`reading`, `confidence`, `f2Quality`, `plausibility`):** `analyze.ts:97-103` (confidence, reading), `:60-66` (`f2Quality`); `CalibrationWizard.svelte:297-310` (`withPlausibility`, demotion), `:266-275` (`withIghPass`), `:753-762` (`keepOutside`); `divergence.ts:11-21`; `plausibility.ts:246-260` (the verdict), `:327-329` (`keepReading`); `capture-ritual.svelte.ts:229-234` (rollback rule); `resolve-values.ts:48-68` (`judgeUnchecked`, a per-render verdict, nothing stored); `stub.ts:63-69`.

**What depended on the sites agreeing** (`CONTRACT.md` §4): `f1Steadiness` runs the same `extractFormants` as the reading (`analyze.ts:38` and `:85`), so the split-half check and the reading use one picker; if Step 3 gives the reading a new picker, `f1Steadiness` must take it too (brief Step 3.9), or the steadiness verdict will judge a different number than the one stored. `ltasFormants` is not used by the app but is pinned by `i-extractor.test.ts`; a prior-free change to `extractCore` leaves it prior-picked unless it is changed or retired with its test.

## What the brief misstates (read against the tree)

1. **`isUsable` readers are incomplete.** The brief's Step 5.2 lists `resolve-values.ts:132`, `:148`, `:207`, `InsightsPane.svelte:241`, `derivations.ts:86`. It omits `profileStore.ts:197` (`usableReadingCount`) and its callers `routes/+page.svelte:1652`, `:1737`.
2. **`closed-phase.ts:189`** (Step 3.2) is not the spare pole: line 188 is `const MIN_BW = 25, MAX_BW = 400` (the doc comment above it is `:186-187`). The spare pole is a consequence of `ORDER = 12` (`:35`, comment `:34`) with up to five resonances under 4 kHz. The "1070 to 1800 Hz, bandwidth 135 to 400" figures are the review's synthetic measurement (`review-fable-brief-n200_r1_2026-11-13.md`, line 13), not a value in the code.
3. **`isDivergent` is discarded** at `CalibrationWizard.svelte:273` (above).
4. **Stale citations inside the code** that Step 5.8 should correct with the comments it already names: `resolve-values.ts:114` cites "analyze.ts:30-34" and "analyze.ts:26-29" for where `reading` is set; in this tree it is set at `analyze.ts:103`. `types.ts:59-63` and `:65-71`, and the block at `CalibrationWizard.svelte:277-296`, are the ones the brief names.
5. The brief's line for the recorder, `capture-file.ts:15-17`, `:22-25`, `:42-48`, `:51`, and `live.ts:684`, `:688`, `:693` (and the comments at `live.ts:681-683`), all read as the brief states.
6. The extractor lines the brief cites (`extract.ts:4-7`, `:9`, `:53`, `:54`, `:59`, `:78`, `:82`, `:85`, `:135`, `:136`, `:140`, `:148`, `:149`, `:157`, `:159`, `:166`, `:171`; `closed-phase.ts:35`, `:149`, `:192-197`; `guard.ts:13-28`; `analyze.ts:36-41`, `:78`, `:125`; `divergence.ts:11-21`; `plausibility.ts:317-319`, `:327-329`; `resolve-values.ts:48-68`, `:113-120`, `:132`, `:148`, `:206-212`) were read and stand.

## Could not establish

- The cited behaviour on real fry: nothing here runs a microphone.
- Whether a golden case moves (Step 5.11): not run at Step 0.
- `engine/fry-synth.ts:94` and `tools/n168-frequency-run/` were not read at Step 0; Step 2 reads them.
- `static/sw.js:124-133` was not read at Step 0; Step 1 reads it.
