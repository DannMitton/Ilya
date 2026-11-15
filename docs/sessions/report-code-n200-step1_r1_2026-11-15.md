# Report, N.200 Step 1: the recorder, on the lane's own deployment

Cloud lane 52, branch `cloud-lane-52`. Brief: `brief-code-n200-voice-as-it-is_r3_2026-11-14.md`, Step 1. Step 0: `report-code-n200-step0_r1_2026-11-15.md`.

## What changed (all read in this tree)

- `apps/web/vite.config.ts`: two build-time constants. `__ILYA_RECORDER__` is true on the development server, and in a build only when `PUBLIC_RECORDER=1` is set and `VERCEL_ENV` is not `production`; otherwise the literal `false`. `__ILYA_BUILD__` is the commit (`VERCEL_GIT_COMMIT_SHA`, else `git rev-parse`). Declared in `apps/web/src/app.d.ts`.
- `vercel.json` (this lane only): `deploymentEnabled` gains `"cloud-lane-52": true` (every other branch is off, so without it no preview exists), and `buildCommand` becomes `if [ "$VERCEL_GIT_COMMIT_REF" = "cloud-lane-52" ]; then export PUBLIC_RECORDER=1; fi; pnpm --filter @ilya/web build`. If this file reaches `Shane`, the ref test is false there and the flag is never set; a test pins the exact shape. **Dann: merge decision on `vercel.json` is yours; the guard makes it safe either way, but the `cloud-lane-52` line is dead weight on `Shane`.**
- `engine/capture-file.ts` (rewritten): takes are held in memory; one button saves all as one ZIP; names `ilya-capture-asked-<v>-sung-<v>-<stamp>`; the JSON carries `asked`, `sung`, `build` besides the old fields. The enable test and the three calls in `engine/live.ts` (`:684`, `:688`, `:693`, now `__ILYA_RECORDER__ &&`) replace `import.meta.env.DEV`. Comments at the old `capture-file.ts:15-17` and `live.ts:681-683` are rewritten. The panel mounts from `chart/stub-switch.ts` (`captureSessionFor`) when the Calibrate screen opens.
- **Desk default (mine, not in the brief):** a ZIP, not many files, because one file is one download and needs no "download multiple files" permission; the panel has a one-character "Sung vowel" field, because changing `&sung=` in the address reloads the page and loses held takes. The field also rewrites the address with `history.replaceState`. Takes live in memory only: closing the tab loses unsaved takes, so a `beforeunload` warning fires while any are unsaved. Not persisted to IndexedDB.
- Which picker made the reading: not stamped yet (Step 3, as the brief says).

## Evidence

1. **The production bundle does not contain the path.** `pnpm --filter @ilya/web build` with no flag; `grep -rl "ilya-recorder-panel\|ilya-capture-asked\|Recorder. Sung\|ilya-captures-"` over `apps/web/build`: no hit. The same build with `PUBLIC_RECORDER=1`: one chunk hits. (Both run in this session, this tree.)
2. **One save, on a tap, in a browser.** Chromium (the pre-installed Playwright build, headless, not Chrome stable, not Dann's Mac) on the development server, with a fake microphone fed a synthetic fry WAV (`fry-synth`, 300/800 Hz, 70 Hz rate). Address `/?harness=1&sung=u`; Voice, Calibrate, Begin, Continue, one take with [i] asked. The panel read "Save 1 take, 1 not saved"; one click gave one download, `ilya-captures-437a65d6-<stamp>.zip` (246,555 bytes); the panel then read "all saved". `unzip -t`: no errors. Python `zipfile`: one `.wav` (244,012 bytes) and one `.json` named `ilya-capture-asked-i-sung-u-<stamp>`, JSON `asked: i`, `sung: u`, `build: 437a65d6`, trace keys `prior, envelopePeaks, envelopeF1, closedPhase, closedPhaseF1, closedPhaseSetAside, lpc, chosen`. **Not established:** that Chrome stable on a Mac raises no prompt; the single-gesture design is what makes that unlikely, and a test on his Mac settles it.
3. **Pictures** (looked at: `docs/sessions/pictures-n200-step1/`): `step1-panel-empty.png` (panel bottom right, sung field "u", "Save 0 takes"; I saw that the empty button looked as live as a full one and dimmed it), `step1-panel-one-take.png` ("Save 1 take, 1 not saved"; the panel overlaps only the sheet's lower edge, not the Drawer), `step1-panel-saved.png` ("all saved").
4. **A side observation, one take, synthetic, not a measurement:** with [i] asked and a [u]-like source (fR2 800 Hz), the shipped picker returned fR1 300 and fR2 2472 Hz (`step1-panel-one-take.png`, readout). This is the prior-led fR2 the brief describes; Step 3 addresses it.
5. **Privacy.** `capture-file.test.ts` strips comments and asserts no `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `EventSource`, `importScripts`, `postMessage`, `FormData`, or URL in `capture-file.ts`. No recording is in the repository: the three pictures are of the app, and the WAV used was synthetic and is not committed.
6. **Tests added (11), `engine/capture-file.test.ts`:** CRC32 check value; ZIP round trip read by an independent parser; names; held takes, one ZIP, JSON stamps; sung null until stated; off with no address; privacy; every use in `live.ts` and `stub-switch.ts` behind `__ILYA_RECORDER__ &&`; only those two files import the recorder; `vercel.json` shape; `vite.config.ts` production guard.

## The URL Dann opens

**Established from Vercel's API (read-only, 2026-11-15):** pushing `e3ecc7b` created deployment `dpl_9uvLUPKgKkav5PvTo3CAcHeiUj3Y` for `githubCommitRef: cloud-lane-52`, URL `https://ilya-mj0ezv499-dannmittons-projects.vercel.app`, state READY (inspector: `https://vercel.com/dannmittons-projects/ilya/9uvLUPKgKkav5PvTo3CAcHeiUj3Y`). The deployment exists only because of the `cloud-lane-52` line in `vercel.json`. **NOT ESTABLISHED:** that the recorder is inside that bundle, that is, that Vercel passes `VERCEL_GIT_COMMIT_REF` to this project's build. The sandbox cannot reach `vercel.app`, so I could not look. Dann's check, one step: open `https://ilya-mj0ezv499-dannmittons-projects.vercel.app/?harness=1&sung=u`, Voice, Calibrate, Begin, Continue. A black bar at the bottom right reading "Recorder. Sung vowel" means the flag took; no bar means it did not, and the fix is to set `PUBLIC_RECORDER=1` for the Preview environment of that branch in Vercel's settings.
Older note on the address pattern, not verified: The project is `ilya` in team `dannmittons-projects` (read from Vercel: its domains include `ilya-git-main-dannmittons-projects.vercel.app`). By that pattern the branch URL should be `https://ilya-git-cloud-lane-52-dannmittons-projects.vercel.app/?harness=1&sung=u`.

## The eight gates after Step 1

462; 248; 0 errors, 12 warnings (5 files); **5751 passed, 1 skipped (5752)** (+11 from 5740); 785, 5 skipped; 178; 159; ratchets OK.

## Could not establish

- Chrome stable on a Mac; a real microphone; that Vercel exposes `VERCEL_GIT_COMMIT_REF` to this project's builds (see the URL section).
- `static/sw.js:124-133` was read: the page is network-first with a cached fallback, so a stale bundle is possible; the `build` field in every JSON is the guard, and Dann should compare it with the commit he expects.
