# Report: N.203 lane 61, Step 1 (the two stations)

Branch `cloud-lane-61`. Pictures: `docs/sessions/report-code-n203-lane61-pictures/step1-*.png` (390 by 844 phone and 1440 by 900 desk Drawer, English and French; I looked at the closed pane, the Describe station open, the Describe station scrolled to its last question, the INSIGHTS station open, and both open on a desk).

## What changed

- `lib/voice/seam.ts`: `CharacteristicField` moved here from the wizard; the seam gains `setCharacteristic(field, pitch | undefined)`. The wizard publishes its existing function (`CalibrationWizard.svelte`, seam effect) and its body is unchanged, so it still calls `touchVoice`.
- New `lib/voice/intake-answers.ts` (the one module): `Scaled`, `BEFORE_TOPICS`, `TOPICS`, `POINTS`, `tidy`, and the writers `withPoint`, `withTopic`, `withSuggestions`, `withImagery`. Both stations call these, so there is one `tidy`.
- New `lib/voice/characteristics-pairs.ts`: the inverted-pair tests, as a pure function.
- New `lib/voice/DescribeVoice.svelte`: the lede `calib.characteristics.lede` (DESK DEFAULT, as the brief says; it still contains "simply" / « simplement », for Dann to strike or reword), the six `NotePicker`s with headings, hints, and inverted notes, then `voiceIntake.intro` counted `BEFORE_TOPICS.length` (Five / Cinq), then the five questions. Loads the notation font itself. Holds no state.
- New `lib/voice/InsightsShares.svelte`: the topics, the acoustics question, "How comments appear". No intro. Holds no state.
- New `lib/voice/IntakeScale.svelte`: **my addition, not in the brief's list.** The scaled question (radio group, "Not sure", "Clear answer", the acoustics symbols) was one snippet drawn by both halves; copying it would have meant two copies of the markup and its CSS. One small shared component keeps one source. Reversible: say so and I inline it.
- `lib/voice/InsightsIntake.svelte` deleted (`git rm`).
- `lib/voice/CalibrationWizard.svelte` (1,293 to 1,187 lines; ceiling lowered at the end of the lane): its characteristics phase now draws `DescribeVoice` and `InsightsShares` instead of its inline pickers and `InsightsIntake`, so "Add your range" still lands on a working screen until Step 2 retires the phase. Removed the notation-font load, the two `$derived` inverted tests, the three `.charx-*` rules that became unused (to hold svelte-check at 12 warnings), and the imports `NotePicker`, `Italics`, `loadNotationFont`, `pitchToMidi` (the brief expected the imports to go at Step 2; they went here because the pickers moved here).
- `lib/components/Drawer/sections.svelte.ts`: `STATION_IDS` gains `describeVoice` and `insightsShares` (wire values); both join `UNPERSISTED_STATIONS`.
- `lib/components/Drawer/VoicePane.svelte`: the two doors at the old `:69-70` are gone. Two stations stand below the remaining doors, each with `StationHeader` (`ontoggle`, `expanded`, `controls`). New props `sections`, `characteristics`, `intake`.
- `routes/+page.svelte`: the existing `<VoicePane` lines gain `{sections} characteristics={voiceCharacteristics} intake={voiceIntake}`. Net line count unchanged (5,523); the `voice-pane-usable.test.ts` patterns still match.
- `lib/i18n.ts`, line 87 only: the hand-written index at the head named `lib/voice/InsightsIntake.svelte`, and `i18n-index.test.ts` fails on a path that does not exist. I changed that path list to the three new files. No string touched.

## Tests

- New: `intake-answers.test.ts` (5), `characteristics-pairs.test.ts` (4), five more cases in `sections.test.ts` (ids, never stored, phone one at a time including NOTATION, desk both open, reload closed), `e2e/voice-stations.test.ts` (8), `e2e-phone/voice-stations.test.ts` (1).
- Moved: `intake-symbols.test.ts` now renders `InsightsShares` for the acoustics symbols and `DescribeVoice` for the `<em>passaggi</em>` and `<em>piano</em>` stems; I added "the acoustics question is in one station and not the other" and "the intro counts five". None lost.
- Rewritten: `e2e/voice-pane.test.ts` lines 120 to 130 (the doors opened the takeover) now check each station opens in place, no takeover, and `calibratedAt` unchanged. This is in Step 1, not Step 2, because the doors leave in Step 1. The range-link test (`:247-264`) is untouched and still passes; Step 2 rewrites it.
- `calibratedAt`: tested for a voice that has it (stays `2026-11-01T10:00:00.000Z`) and for a voice that never had one (becomes the previous `updatedAt` on the first write, then stays).

## Gates (end of Step 1)

phonology 462 passed (462); dictionary 248 (248); svelte-check 0 errors, 12 warnings, 5 files; web 6497 passed, 1 skipped (6498) (baseline 6481 plus 16 new); score-parser 904 passed, 5 skipped (909); blurb 178 (178); root 159 (159); ratchets OK. Playwright: `voice-pane` 19 of 19 and `voice-stations` 8 of 8 on desktop; `voice-stations` 1 of 1 on the phone project. `calibrate-new` 37 of 37 (desktop). `singer-paths`, `print-pages`, `pages-without-gaps` run at Steps 3 and 4, where INSIGHTS changes.

## What I could not establish, and for Dann's eye

- **Six staves on a phone: they fit in width, and are long in height.** At 390 px the Describe body is 322 px wide and 2,550 px tall in English (2,784 px in French); the Range group alone is 461 px. The pickers wrap as designed. Nothing is cut off. The cost is length: a singer scrolls the Drawer a long way inside one station. That is a measurement, not a verdict.
- The lede reads "analysis simply stays broad" at the head of the station (picture `step1-phone-en-describe-open.png`). Dann's to keep, reword, or strike.
- The `IntakeScale.svelte` addition above.
- Closed stations show the name and a chevron only. No state line, as ruled.
