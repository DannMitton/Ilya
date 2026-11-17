# Brief to Code: lane 65, walk fixes from the iPhone walk of 2026-11-17

r1, 2026-11-17 15:5x, written by the desk (Opus 5.5) from Dann's walk on his iPhone, 2026-11-17 14:52 to 15:31 (`docs/memory/INBOX.md`, lines of 15:00 to 15:07 and 15:10 to 15:3x). For a cloud Code session on branch `cloud-lane-65`, cut from the tip of `Shane` (the desk names the commit). Lane 64 runs at the same time on `cloud-lane-64`; it owns engine files and `CalibrationWizard.svelte`'s `withPlausibility` only.

Paths are under `apps/web/src/lib/` unless they begin with `docs/` or `e2e`. The desk read every cited line at `Shane` `f44eeba8`. Step 0 re-reads them on your tip.

## 1. What the singer gets

1. The VOICE pane, at rest, in this order (Dann 2026-11-17 15:04, his option 2): the voice's name and switcher; three rows of equal weight, "Choose a voice type" (or the type chosen), "Describe your voice", and "What INSIGHTS shares, and how"; the pane's sentence; the doors ("Record your vowels" or its state's words, then "Your vowel space" when shown).
2. "Choose a voice type" is a full-width row like the two station rows, not small underlined lavender type. It opens the built voice type control in place, as today.
3. The wizard's first screen no longer says the voice type "helps Ilya read your voice against the right values" (section 3, Step 2; the words are Dann's to approve).

For the desk's next phone walk, and never seen by a singer:

4. The recorder panel (`?harness=1` on a recorder build) covers no control on any screen of the take path on a phone, and it names the picker in use.

## 2. The rulings

| When | His words (short) | What it rules |
|---|---|---|
| 2026-11-17 15:00 | "'Choose a voice type' is in small lavender type making it disappear as an actionable item." | Item 2. |
| 2026-11-17 15:04 to 15:07 | "I liek Oprion 2"; "So have we agreed, OPtion 2 is better and will be implemented?" | Item 1: the order. |
| 2026-11-13 12:34 | "Yes the voice type is scaffoldiong only." (`docs/memory/PRODUCT.md:1271`) | Item 3: the voice type never reaches the measurement, so the wizard does not say it does. |
| `docs/memory/PRODUCT.md:522` | the Drawer fills one pill at rest | The doors stay quiet pills (`VoicePane.svelte:162-174`); only the first-launch Start is filled. |

## 3. Steps

Each step is its own commit and report section, test first where a test applies, then pushed. After each step run only the tests of the files that step changed; all eight gates and the named Playwright suites once, at the end. Gate 4 baseline at `f44eeba8`: 6560 passed, 1 skipped (6561) with Python, numpy, and scipy; 6556 passed, 5 skipped without.

### Step 0. Read and report. Change nothing.

The gates with counts; every cited line re-read; line counts against `scripts/ratchets.json`.

### Step 1. The VOICE pane's order and the voice type row.

- `components/Drawer/VoicePane.svelte:59-121`. Today: switcher (`:61-71`); the type control as small underlined text (`:73-78`, styled `.vp-type` `:132-143`); the sentence (`:79`); the doors (`:80-85`); the two stations (`:86-118`). New order: switcher; the voice type row; the Describe station; the INSIGHTS station; the sentence; the doors.
- The voice type row uses `StationHeader.svelte` with `ontoggle`, `expanded`, and `controls`, as the two stations do (`:87-92`). Its label is today's (`typeLabel ?? T('calib.pane.chooseType')`, `:74`). Its body is today's `VoiceTypeIntake` (`:77`). Its open state stays local (`typeOpen`, `:53`), never stored, closed on arrival: DESK DEFAULT, because it is not a station of `STATION_IDS` and adding one changes `sections.test.ts`. If the station tier's one-at-a-time rule on a phone (`sections.svelte.ts`) leaves the voice type row open beside an open station, say so in the report; do not change the rule.
- Remove `.vp-type` if nothing uses it. Rewrite the header comment (`:1-18`) to the new order and cite Dann 2026-11-17 15:04.
- No new words: every label is a built key.
- Tests: the order of the pane's children at rest, for a voice with no type, with a type, and with readings; the voice type row opens and closes the control; `e2e/voice-pane.test.ts`, `e2e/voice-stations.test.ts`, and the phone `voice-stations` pass, changed only where they assert the old order.
- Pictures: 390 by 844 and 1440 by 900, English and French: the pane at rest with no type; with a type and some readings; the voice type row open; on a phone, the Describe station open with the doors below it.

### Step 2. The wizard's voice type line.

`i18n.ts:1339`, `calib.voiceTypeFirst.hint`. **Do not change the words until the desk types Dann's approved English and French into this session.** Until then, do Step 3. When they arrive, replace both values character for character, and update any test that pins the old line (grep the key and the English text). Note in the report which sheet holds the approval.

### Step 3. The recorder panel on a phone.

`voice/engine/capture-file.ts:203` places the panel `position:fixed; right:12px; bottom:12px; z-index:2147483000`. On a phone it covered the welcome sheet's Begin, the Home Screen card's button, and the DRAWER bar (Dann's screenshots, 2026-11-17 14:52 to 14:55).

- Move or fold the panel so that at 390 by 844 it covers no control on: the welcome sheet; the Home Screen card; the page with the Drawer down; the Drawer up with VOICE open; the wizard's first screen; the take screen. Your design; say what you chose and why. It stays on a recorder build with `?harness=1` only (`:31` of `chart/stub-switch.ts` mounts it).
- The panel names the picker the session uses, from `measurePicker` (`chart/measure-switch.ts:10-13`): "path", "open", or "shipped". Reason: on 2026-11-17 five takes Dann sang at `?measure=shipped` were read by the path picker, and neither he nor the desk could see why (`docs/memory/INBOX.md`, 15:10 to 15:3x).
- Pictures at 390 by 844 of each screen above, with the panel showing.
- English only in the panel: it is a test instrument (its words today are English only, `capture-file.ts:192`).

## 4. Owns and leaves

**Owns:** `components/Drawer/VoicePane.svelte` and its tests; `voice/engine/capture-file.ts` (the panel's placement and its picker label only) and its test; `i18n.ts:1339` (Step 2 only, on the desk's message); `e2e/voice-pane.test.ts`, `e2e/voice-stations.test.ts`, `e2e-phone/voice-stations.test.ts` where they assert the old order; this lane's reports and pictures.

**Leaves:** every engine file other than `capture-file.ts`; `CalibrationWizard.svelte`; `voice/seam.ts`; `components/Drawer/sections.svelte.ts`; `voice-pane.ts` unless a rule moves there (say so); everything under `docs/memory/`; every string but `calib.voiceTypeFirst.hint`.

## 5. Constraints

No new dependency; no new key; line ceilings hold. Push only `cloud-lane-65`; open no pull request; never push `Shane`. Do not edit, rename, or replace a brief.

## 6. Reports

`docs/sessions/report-code-lane65-step<N>_r1_<date>.md`, pictures in `docs/sessions/report-code-lane65-pictures/`; look at every picture before you push it. The last report carries the eight gates and the Playwright suites `voice-pane`, `voice-stations`, `calibrate-new`, and the phone `voice-stations`.

## 7. What the desk could not establish

- Why `?measure=shipped` did not select the shipped picker on Dann's iPhone on 2026-11-17 (`measure-switch.ts:12` would). If you find a cause in the code, report it; change nothing in `measure-switch.ts` (lane 64 owns it).
- Whether the voice type row and the two stations read as three of a kind when the type row's label is a type ("Bass") rather than an action.
