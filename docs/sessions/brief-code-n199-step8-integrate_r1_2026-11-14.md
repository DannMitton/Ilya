# Brief for Code, N.199 Step 8: the new Calibrate screen for every singer, and the wheel deleted

r1, 2026-11-14 21:1x, written by the desk (Opus 5.5). NOT YET REVIEWED (`CONTRACT.md` section 1 item 19). Branch: `cloud-lane-55`, cut from `Shane` at its tip after lane 53 ships (the commit whose message begins "N.199: lane 53, the readings list and chart layout"). Release 2026-11-20.

## What the singer needs

Dann, 2026-11-14 21:03 (as written): *"the new screen is no longer behind the switch. Integrate it now."* Every singer who taps Calibrate meets the one-vowel screen (`VowelCapture.svelte`), with its chart, drawings, readings list, and printable sheet. The vowel wheel (the "pacifier") is gone (Dann 2026-11-12 23:15: *"I believe we eliminated the pacifier altogether in exchange for the current prototype C?"*).

## Read first, in full

`docs/memory/OPEN.md`, section "N.199. THE CALIBRATE REDESIGN" (every entry binding; the newest wins, including "THE NEW SCREEN FOR EVERY SINGER, NOW"); `docs/sessions/brief-code-n199-calibrate-single-vowel_r5_2026-11-13.md` section 5, Step 8 (8a and 8b), which this brief carries out; `docs/sessions/report-code-n199-readings-list-and-chart-layout_r1_2026-11-13.md`, the section "A finding that changes what was accepted"; `apps/web/src/lib/voice/CalibrationWizard.svelte`; `lib/voice/chart/calibrate-switch.ts`; `lib/voice/chart/SummarySheet.svelte`; `lib/voice/chart/stub-switch.ts`; `lib/voice/VowelCapture.svelte`; `lib/voice/pacifier/` (every file); `lib/voice/count-in.ts`. Brief r5's line numbers are a day old: read each line before you rely on it.

## Step 0. Read and report

Run the eight gates on the untouched tip and report the counts. List every importer of `calibrateNewOn` (the desk found `CalibrationWizard.svelte:49`, `:258` and `SummarySheet.svelte:8`, `:13` at `62dc2b2f`) and of anything under `lib/voice/pacifier/` (the desk's grep at `62dc2b2f` named `lib/i18n.ts`, `lib/voice/count-in.ts`, `VowelCapture.svelte`, `vowel-names.ts`, `CalibrationWizard.svelte`, `capture-ritual.svelte.ts`, `engine/readiness.ts`: confirm which import code and which only name it in a comment). Push the report, then continue.

## Step 8a. The handover

As brief r5 Step 8a says, with these points made explicit:

1. The capture phase mounts `VowelCapture` for every singer. `calibrate-switch.ts` and its test are deleted; `?calibrate=new` in an address does nothing and breaks nothing.
2. `SummarySheet.svelte` shows the vowel-space sheet for every singer.
3. The development stub (`stub-switch.ts`, `?capture=stub` on a development server only) stays: the browser tests use it.
4. Everything brief r5 Step 8a lists as going goes; everything it lists as staying stays (`withPlausibility`, `withIghPass`, persistence, `logAnnounce`).
5. The browser tests in `e2e/calibrate-new.test.ts` run without `?calibrate=new`. Any other e2e test that drove the wheel is rewritten for the new screen or deleted, each named in the report with its reason.
6. One commit.

## Step 8b. The deletion

As brief r5 Step 8b says. `pacifier/` is deleted whole. Any helper another file still needs (for example `count-in`) is already outside it or moves out first; say which. Strings only the wheel spoke are marked `UNUSED SINCE N.199` in `i18n.ts`, not deleted. One commit.

## Step 8c. Two layout repairs found in lane 53's pictures

1. **The readings list under the sticky stage.** Today `.stage` (`VowelCapture.svelte:502-511`, `position: sticky; top: 0`) stays in view during a scroll, and the readings list's rows slide under it: open, only the last three or four rows show at a time, and on phones shorter than 844 px even its closed line ends under the stage (lane 53's report, its table). DESK DEFAULT, Dann's to strike on his walk: while the readings list is open and no take is running, `.stage` is not sticky. During a take nothing changes (the list is closed or hidden then). Measure and report, phone 390 by 844 and 375 by 667 and desktop 1440 by 900, English and French: with the list open and scrolled to its end, every row is in view at some scroll position and none lies under the stage; the closed line is clear of the stage at the end of the scroll at 375 by 667.
2. **« Commencer [i] » on two lines** at 390 px (lane 53's picture `step1-phone-fr-open-scrolled.png`). `.main` (`:647-652`) has `flex: 2` and no `white-space` rule; `.stop` beside it is `nowrap` with « Tout recommencer ». Make the main button's label hold one line in both languages at 320 px and up, by layout only (no change to a word): for example `white-space: nowrap` on both and the row wrapping as a whole when the two do not fit. Report the widths in both languages at 320, 375, and 390 px, with pictures.

One commit.

## Step 9. Not in this brief

Brief r5's Step 9 ([ɨ] before its anchors) is not run here. The [ɨ] ruling of 2026-11-13 15:13 is carried by N.200, Step 5.10.

## Pictures and walk

English and French, phone 390 by 844 and desktop Drawer at 1440 by 900, from a build with no switch in the address: the Calibrate entry; the capture screen at rest; a take landing (on the stub); all ten sung; the summary with the sheet; the readings list open and scrolled. Look at each yourself before you report it. Dann walks the build on the `Shane` alias after the ship.

## Done when

All eight gates pass on the tip, with gate 4's count before and after; the whole of `e2e/calibrate-new.test.ts` passes on the chromium project with no switch in the address; the report `docs/sessions/report-code-n199-step8-integrate_r1_2026-11-14.md` and its pictures in `docs/sessions/report-code-n199-step8-pictures/`; a grep showing no import of `pacifier/` and no use of `calibrateNewOn` remains; the branch pushed.

## Constraints

- No new English or French. If a word proves necessary, stop that step and report it.
- Do not touch the extractor (`engine/extract.ts`, `engine/closed-phase.ts`), `engine/plausibility.ts`, or `engine/divergence.ts`: N.200 owns them.
- Do not touch the Drawer's bands (`Drawer/sections.svelte.ts`, `Drawer/Drawer.svelte`, `Drawer/RootPanel.svelte`, `Drawer/SongList.svelte`, `Drawer/AnalysisStation.svelte`): N.201 (lane 54) owns them and runs beside this lane. Where both lanes touch `lib/i18n.ts` (this lane's UNUSED marks; lane 54's four new keys and the key index at `i18n.ts:19`), say so in the report; the second lane to ship merges `Shane` first.
- Lower the ratchet ceilings that the deletion lowers (`scripts/ratchets.json`), and say which.

## What you could not establish

End the report with a section of this name. NOT ESTABLISHED beats a complete invented answer.

Handed to you as not established by the desk: which e2e tests other than `calibrate-new.test.ts` drive the wheel; whether anything outside `lib/voice/` imports from `pacifier/`; the rendered effect of Step 8c.1 on a phone in Safari.
