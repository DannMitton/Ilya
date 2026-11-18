# The desk's as-built read of lane 65 (the walk fixes)

r1, filed by the desk 2026-11-17 20:5x. The desk was on Fable 5.2 for this turn, so this read stands as the lane's Fable review as built (DESK DEFAULT, as for lanes 50 and 52 on 2026-11-15). No helper ran. Read only: nothing pushed, nothing committed. Brief: `brief-code-lane65-walk-fixes_r2_2026-11-17.md`. Lane tip `cloud-lane-65` `f3061279` (Steps 0 to 3), cut from `Shane` `55be2629`. Paths are under `apps/web/src/lib/` unless they begin with `apps/` or `docs/`.

## Verdict

**MERGE.** No blocker. Three follow-ups for lane 66 (findings 1 to 3) and one item for Dann's eye at the walk (finding 4).

## What the desk read and ran

- `git ls-remote`, 20:2x: `Shane` `fdf0e9f4`, `cloud-lane-65` `f3061279`.
- The whole code diff, `git diff origin/Shane...origin/cloud-lane-65 -- apps/` (7 files), and the four step reports, in full.
- All 26 pictures: the 21 phone pictures at 390 px wide, three to a sheet; `desk-en-2-rest-type-and-readings.png` whole at 1440 by 900; the other five desk pictures as crops of the Drawer at that scale.
- Trial merge of `f3061279` onto `Shane` `fdf0e9f4` in the desk's workspace: no conflict, merge `2a57fcd2`, tree `10ff945f`. Read on that tree: `components/Drawer/VoicePane.svelte:36-182`, `components/Drawer/StationHeader.svelte:80-150`, `voice/chart/measure-switch.ts:1-15`, `voice/chart/stub-switch.ts:29-32`, `voice/engine/capture-file.ts:198`, `:223-225`, `:236`, `voice/CalibrationWizard.svelte:205`, and `i18n.ts:1340` by code point.
- The eight gates on that merge, in the desk's workspace (two cores, Python with numpy and scipy). The desk expected gate 4 at 6589 (lane 64's 6584 plus the lane's 5) before the run, and did not say so to Dann until the count was in: a miss against the control rule (`CONTRACT.md` section 4).

| Gate | Result on `2a57fcd2` |
|---|---|
| 1 phonology | 462 passed (462) |
| 2 dictionary | 248 passed (248) |
| 3 web-check | found 0 errors and 12 warnings in 5 files |
| 4 web-test | 6589 passed, 1 skipped (6590); 357 files; 498 s |
| 5 score-parser | 904 passed, 5 skipped (909) |
| 6 blurb | 178 passed (178) |
| 7 integration | 159 passed (159) |
| 8 ratchets | OK |

- Playwright on that merge (pre-installed Chromium, `--trace off`, one worker). Desktop: `calibrate-new` 37, `insights-links` 13, `voice-links` 6, `voice-pane` 24, `voice-stations` 8, in all 88 passed of 88 (17.6 min). Phone: `voice-stations` and `insights-links`, 9 passed of 9 (1.1 min). The lane had not run `insights-links` or `voice-links`, and it tested before lane 64 landed on `Shane`.
- NOT ESTABLISHED by the desk: the rest of the Playwright suite; anything on a real phone; gate 4 without numpy and scipy (6585 passed, 5 skipped is derived from the four `burg.test.ts` tests, not run).

## The steps against the brief

1. **Step 1, the pane's order and the voice type row: as written.** Order in the tree: switcher, voice type row, Describe, INSIGHTS, sentence, doors (`components/Drawer/VoicePane.svelte:64-126`). The row is a `StationHeader` with `ontoggle`, `expanded`, and `controls` (`:77-82`); its open state is local (`:56`). `StationHeader` sets `aria-controls` only while open (`components/Drawer/StationHeader.svelte:138`), so the id of an unmounted body is never referenced. `.vp-type` is gone, and nothing outside the pane used it (grep of `src`, `e2e`, `e2e-phone`). Kept: both `data-station` attributes, `.vp-sentence`, `.vp-door`, both body ids. Seen in the pictures, English and French, phone and desk: three rows of one width and weight, the sentence under them, the doors last.
2. **Step 2, the wizard's line: as ratified.** Both values equal Dann's words of 2026-11-17 15:46 and 15:47 character for character: U+00A0 inside the guillemets, U+2019 three times, curly quotes around "Not sure" (`i18n.ts:1340`, read by code point). One use, `voice/VoiceTypeFirst.svelte:28`. Pinned by a literal test (`voice/chart/ratified-strings.test.ts:104`). Seen on the wizard's first screen in `step3-phone-5-wizard-first-screen.png`.
3. **Step 3, the recorder panel: as written.** A folded tab, 14 px wide, 130 px tall, flush right, 140 px above the foot. Seen covering no control on the seven phone pictures of the take path. The unfolded card seen with "Picker in use: open" and "Picker in use: shipped". The lane's stated cost stands: a 14 px target at the screen's edge is small for a thumb. That is a look for Dann at the next phone walk.

## Findings

### 1. LANE 66. The panel names the picker of the first session of a page load, not of the session in use

`mountRecorderPanel` returns when the panel already exists (`voice/engine/capture-file.ts:224`), before it sets `panelPicker` (`:225`), and the card's line is written once (`:236`). The wizard builds a session each time it mounts (`voice/CalibrationWizard.svelte:205`), and each call reads the address again (`voice/chart/stub-switch.ts:29-32`). So when a second session is built in one page load with another picker, the take is stamped with the new picker and the panel still names the old one. A full reload mounts the panel again, so the label is right after any address typed into the browser. The cause of the 2026-11-17 anomaly (five takes stamped `path` after `?measure=shipped`) is NOT ESTABLISHED, and the instrument built to settle it has to follow the session.

Fix: set the picker and rewrite the line on every call; show the picker stamped on the last held take, which is the evidence itself; default `'path'` at `:198` and `:223` and in the pin at `voice/engine/capture-file.test.ts:173` (finding 6 of the lane 64 review).

### 2. LANE 66. On a phone the voice type row stays open when a station opens

The lane reported it, as the brief asked (Step 1 report; `phone-en-5-…` and `phone-fr-5-…`, seen). Dann ruled three rows of equal weight (2026-11-17 15:04). On a phone the two stations close one another (`components/Drawer/sections.svelte.ts`, the station tier), and the first row does not join them, because its state is local (`components/Drawer/VoicePane.svelte:56`). With the type control and Describe both open, the pane is several screens long. DESK DEFAULT: on a phone the voice type row joins the one-at-a-time rule, still never stored and closed on arrival.

### 3. LANE 66. Stale comments

`components/Drawer/reveal-scroll.ts:32` ("a station under the VOICE pane's doors") and `apps/web/src/routes/+page.svelte:4179-4180` (the pane's contents and order): both read by the desk; the lane listed them and left them, as told. The header of `voice/chart/ratified-strings.test.ts` (`:2`) says the file pins the calibration screen's and the sheet's strings; it now pins the wizard's line too.

### 4. FOR DANN'S EYE. With a type chosen, the first row reads "Bass" alone

Seen in `phone-en-2-…`, `phone-fr-2-…` (« Basse »), `desk-en-2-…`, and `desk-fr-2-…`. Beside "Describe your voice" and "What INSIGHTS shares, and how", the bare word does not say what it is. The lane said the same (Step 1 report, its section 7 answer). The desk's recommendation, his to rule, in words that are his: the row keeps a name and shows the type as its state at the right, through `StationHeader`'s `status` slot (`components/Drawer/StationHeader.svelte:113`, `:142`). Nothing changes until he rules.

## What the desk could not establish

- Why `?measure=shipped` gave `path` on 2026-11-17. The lane could not either (Step 0 report, section 7).
- Whether the folded tab can be hit reliably on Dann's iPhone.
- Tokens: no helper ran; the read was the desk's own.

Terms: "as-built read" is the desk's. "Station", "door", "pane", and "row" are the tree's and Dann's.
