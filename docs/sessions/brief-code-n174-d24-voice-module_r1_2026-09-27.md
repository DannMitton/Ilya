# Brief for Code, r1: N.174 slice D.2.4, the `voice/` module

Written by the desk 2026-09-27 after D.2.3 shipped at `f0fbf33`. Spec, plan, and module map
as in D.2.1's brief. Every `path:line` here was read by the desk at `f0fbf33` this session.
If the tree has moved, the tree wins; say where.

**What the singer sees must not change.** No shown string changes. The desk compares the 84
screenshots once you are done. **Voices a singer has saved must still load:** the storage
keys do not change in this slice.

## Before you start

Fetch `Shane` and confirm HEAD is `f0fbf33` or a descendant. One writer on `Shane` at a time.

**Take the "before" reading first, before you edit anything.** No `git stash`, `checkout`,
`restore`, `worktree`, or any other git command that writes. To read old code mid-slice, use
`git show f0fbf33:<path>`, or `git archive f0fbf33 | tar -x -C <scratch dir>`.

## Part 1. The move

All paths are under `apps/web/src/lib/` unless given in full. Use `git mv`. **The two
subfolders keep their shape** (DESK DEFAULT): `shane/engine/X` becomes `voice/engine/X`,
and `shane/pacifier/X` becomes `voice/pacifier/X`, so relative imports inside each subfolder,
and `pacifier/contrast.test.ts:277` (`../../../app.css`, same depth), keep working.

The 27 files:

- Top level: `CalibrationWizard.svelte`, `InsightsIntake.svelte`, `NotePicker.svelte`, `ProfileSwitcher.svelte`, `note-picker.ts`, `note-picker.test.ts`, `profileStore.ts`.
- `engine/`: `analyze.ts`, `analyze.test.ts`, `derivations.ts`, `detector.ts`, `detector.test.ts`, `divergence.ts`, `dsp.ts`, `extract.ts`, `guard.ts`, `live.ts`, `plausibility.ts`, `plausibility.test.ts`, `readiness.ts`, `readiness.test.ts`, `session.ts`, `stub.ts`, `types.ts`.
- `pacifier/`: `Pacifier.svelte`, `contrast.ts`, `contrast.test.ts`.

**What stays in `shane/engine/`** until later slices: the reader files (`score-reader*`,
`page-reader*`, `page-image.ts`, `page-pdf.ts`, `mscz-converter*`, `staff-detect*`,
`reader-ids.test.ts`, `vendor/`), `notation-fonts.ts`, and `errors.ts` (Part 2).

Importers outside the moved set, `$lib/shane/…` to `$lib/voice/…` (the desk's scan at
`f0fbf33`; `pnpm --filter @ilya/web check` catches any it missed):

- `routes/+page.svelte:98`, `:111`, `:114`, `:205`, `:209`.
- `markup/legend.ts:42`, `markup/legend.test.ts:20`, `markup/MarkupPane.svelte:60`, `:61`.
- `analysis/analyze-score-adapter.ts:36`, `:37`, `analysis/analyze-score-adapter.test.ts:21`.
- `insights/insights.ts:44`, `insights/Tessituragram.svelte:26`, `insights/comment-text.ts:22`, `insights/InsightsPane.svelte:41`, `:61`.
- `tools/n168-frequency-run/frequency-run.run.ts:61`, `:62`.
- Inside the moved files, every `$lib/shane/<moved file>` becomes `$lib/voice/…`; every `$lib/shane/<staying file>` (for example `engine/notation-fonts`) stays.

`scripts/ratchets.json:14`: the key becomes `apps/web/src/lib/voice/CalibrationWizard.svelte`.

## Part 2. Split `errors.ts`

`shane/engine/errors.ts` holds three tiers. Capture's tier moves with voice; the reader's
two stay until D.2.5.

1. New `voice/engine/errors.ts` holds `CaptureError` and `CaptureErrorCode` (today `errors.ts:37-46`), with the header comment's capture half.
2. `shane/engine/errors.ts` keeps `DenigmaError`, `DenigmaErrorCode`, `ResourceError`, `ResourceErrorCode`. Delete `ShaneEngineError` and `ShaneEngineErrorCode` (`:67-70`).
3. **Narrow each capture-side use of `ShaneEngineError` to `CaptureError`** (DESK DEFAULT, module map redraw 7): `engine/session.ts:25`, `:44`, `:66`; `engine/live.ts:86`, `:293`, `:300`, `:692`; `CalibrationWizard.svelte:57`, `:560`; `pacifier/Pacifier.svelte:32`, `:528`. `engine/analyze.ts:2` imports `CaptureError` from the new file.
4. **If `svelte-check` shows a Denigma or Resource error flowing into a capture site**, do not force the narrowing. Instead define `export type VoiceEngineError = CaptureError | DenigmaError | ResourceError` in `voice/engine/errors.ts`, importing the two reader types from `$lib/shane/engine/errors`, use it at those sites, and say so in the memo.
5. Reader-side importers keep `./errors` and are untouched: `engine/score-reader.ts:28`, `score-reader.worker.ts:25`, `mscz-converter.ts:52`; `ingestion/ingest.ts:37`. The two comments in `score-reader.ts:8`, `:52` that say `ShaneEngineError` name `DenigmaError` or `ResourceError` instead.

## Part 3. The names in plain strings, which the compiler does not check

1. **The audio worklet.** `voice/engine/live.ts:133` `WORKLET_NAME = 'shane-capture-tap'` becomes `'voice-capture-tap'`; the class `ShaneCaptureTap` (`:141`, `:165`) becomes `VoiceCaptureTap`. The name is registered (`:165`) and used (`:462`) through the one constant, so both follow. **This is the one change in the slice that could stop the microphone.** The unit tests cannot reach an AudioWorklet; see "Done when".
2. **Log tags.** `'[shane-live]'` (`live.ts:175`) becomes `'[voice-live]'`; `'[shane] plausibility'` (`CalibrationWizard.svelte:316`, and the comment at `:841`) becomes `'[voice] plausibility'`. Search `apps/web/e2e*` and the tests for either old tag first; if anything reads them, change it too.
3. **The colour token.** `--surround-shane` becomes `--surround-voice`: `app.css:194` (and the comment at `:142`), `pacifier/Pacifier.svelte:758`, `pacifier/contrast.ts:22`, `:113`, `:127`, `:181`, and the eighteen `fillToken`/`backgroundToken` values at `:256-330`; `pacifier/contrast.test.ts:430`, `:433`; the comment at `routes/+page.svelte:5741`. The contrast test compares `app.css` to the palette by name, so it fails loudly if one side is missed.
4. **Unchanged on purpose:** the storage keys `shane.profile.v1` and `shane.profiles.v2` (`profileStore.ts:66-67`). Add one comment above them: the names predate N.174 and stay because a singer's saved voices are stored under them (`ARCHITECTURE.md` invariant 10). `InsightsIntake.svelte` keeps its name.

## Part 4. Words

Comments naming the moved files by their old path, in `apps`, `tools`, `packages`, and
`docs/memory` (not `docs/sessions/`), name the new path. A cited line number stays only if it
is still true. `ARCHITECTURE.md`: a `src/lib/voice/` entry, and these files leave the
`lib/shane/` listing.

## Done when

- `apps/web/src/lib/voice/` holds the 27 files plus the new `engine/errors.ts`.
- `node scripts/ratchets.mjs` passes with no `MODULE` breach. **State your expectation first.** The desk expects none: `voice/` may import only `reader/` and `score/`, which do not exist yet, and `shane/`, which is outside the table. `markup/`, `analysis/`, and `insights/` may import `voice/`.
- All eight gates pass, web-test still 1493.
- Playwright desktop 28 and phone 2 stay green.
- **The microphone, by hand, on localhost:** with the slice in place, open the calibration wizard, start one vowel, and confirm the capture runs and ends with a reading or a named error, not a silent hang. State your expectation first. If the Mac has no microphone permission for the browser, say so; Dann walks it instead.
- **A saved voice still loads:** a voice saved in `shane.profiles.v2` before the edit (seed one before you start) is listed in the wizard afterwards.
- A memo of fifteen lines or fewer in `docs/sessions/memo-code-n174-d24_r1_2026-09-27.md`: what moved, the errors split and whether it narrowed, the worklet check, the saved-voice check, the gates, and a section titled "NOT ESTABLISHED". **NOT ESTABLISHED beats a complete invented answer.**

## Do not

- Do not move `engine/notation-fonts.ts`, any reader file, or anything in `ingestion/`.
- Do not rename a storage key or `InsightsIntake.svelte`.
- Do not change any string a singer sees.
- Do not use `git stash`, `checkout`, `restore`, `worktree`, or any other git command that writes. Do not commit. Dann ships with `ilya-ship.sh`; `git add` the new paths first.
