# Report: lane 65, Step 1 (the VOICE pane's order and the voice type row)

2026-11-17, Code (cloud session), branch `cloud-lane-65`, on top of Step 0.

## What changed

`apps/web/src/lib/components/Drawer/VoicePane.svelte` only, and tests in `apps/web/e2e/voice-pane.test.ts`.

- New order inside `.voice-pane`: switcher; the voice type row; the Describe station; the INSIGHTS station; `.vp-sentence`; `.vp-doors`. This is Dann's option 2 (2026-11-17 15:04).
- The voice type row is a `StationHeader` with `ontoggle`, `expanded`, and `controls="voice-type-body"`, inside `<div class="vp-station" data-vp-row="voiceType">`. Its label is today's: `typeLabel ?? T('calib.pane.chooseType')`. Its body is today's `VoiceTypeIntake` in `<div class="vp-station-body" id="voice-type-body">`. The open state is the local `typeOpen`, never stored, closed on arrival (DESK DEFAULT, as the brief says). `STATION_IDS` and `sections.test.ts` are untouched.
- `.vp-type`, `.vp-type-body`, and their focus and coarse-pointer rules are removed; nothing else used them (`grep` over `src`, `e2e`, `e2e-phone`: no hits).
- Header comment rewritten to the new order, citing Dann 2026-11-17 15:04.
- No new words, no new key. Kept: `[data-station="describeVoice"]`, `[data-station="insightsShares"]`, `.vp-sentence`, `.vp-door`, `#describe-voice-body`, `#insights-shares-body`. `[data-describe="range"]` lives in `DescribeVoice.svelte`, untouched. New id: `#voice-type-body`. New attribute: `data-vp-row="voiceType"`, chosen over `data-station` so no selector that reads `[data-station]` finds a third station.
- `voice-pane.ts` not touched (no rule moved).

## Tests

Added to `e2e/voice-pane.test.ts` (five tests): the order of `.voice-pane`'s children for a voice with no type (and after choosing Bass), with a type, and with nine readings; the row names the type when one is chosen; the row opens and closes the control in place and is closed on arrival; the three rows' disclosure buttons have the same width. `e2e/voice-pane.test.ts` and `e2e/voice-stations.test.ts` (32 tests) pass on the desk project with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`. No existing assertion asserted the old order, so no existing test was changed. The phone `voice-stations` suite runs once at the end, with the full set.

## What a phone does with the voice type row (the brief asked me to say)

The row is not a station of the tier, so the one-at-a-time rule in `sections.svelte.ts` does not reach it. At 390 by 844, with the type row open, opening "Describe your voice" leaves the type row open: both are open together (`phone-en-5-…`, `phone-fr-5-…`; the script read `aria-expanded=true` on the type row after the Describe tap, in both languages). Nothing was changed. If the desk wants the type row to close when a station opens on a phone, that needs a rule in `sections.svelte.ts`, which this lane leaves.

## Stale comments in other files (listed, not edited)

- `components/Drawer/reveal-scroll.ts:32`: "a station under the VOICE pane's doors". The stations now stand above the doors.
- `routes/+page.svelte:4180`: the comment says the pane holds "sentence, its doors, and (lane 61) its two stations". Order and contents are now: type row, two stations, sentence, doors.

## Section 7, second question (type row reads as one of three when its label is a type)

On the pictures: with "Bass" (or « Basse ») as the label, the row reads as a row of the same weight and shape as the two station rows, with the same chevron. What it does not say, from the label alone, is that "Bass" is the voice type; the picture with no type ("Choose a voice type") says it. Whether that is enough is Dann's. NOT ESTABLISHED beyond the pictures.

## Pictures (`report-code-lane65-pictures/`), each looked at before this push

Taken from the development server (`?capture=stub`), 2x, a voice named Dann, desk 1440 by 900 and phone 390 by 844, English and French.

- `desk-{en,fr}-1-rest-no-type.png`, `desk-{en,fr}-2-rest-type-and-readings.png` (Bass, nine readings), `desk-{en,fr}-3-type-row-open.png`.
- `phone-{en,fr}-1-rest-no-type.png`, `phone-{en,fr}-2-rest-type-and-readings.png`, `phone-{en,fr}-3-type-row-open.png`.
- `phone-{en,fr}-4-describe-open-doors-below.png` and `…-4b-describe-open-doors-scrolled.png`: the Describe station open on a phone; 4b is scrolled to the foot, where the INSIGHTS row, the sentence, and the doors stand below the open station.
- `phone-{en,fr}-5-after-type-open-then-describe.png`: the type row and Describe both open.

Seen: the order is as ruled in every picture; the three rows are the same width and weight; the doors are still quiet pills below the sentence. In some phone pictures one door shows a lavender border (for example "Carry on recording" in `phone-en-2`, "Votre espace vocalique" in `phone-fr-2`): the screenshot script's last tap left a hover state on the pill; I did not change any door's style.
