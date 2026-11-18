# Report: lane 66, Step 3 (on a phone, the three rows open one at a time)

2026-11-18, Code (cloud session). Branch `cloud-lane-66`. Files: `components/Drawer/sections.svelte.ts`, `sections.test.ts`, `VoicePane.svelte`, and `apps/web/e2e-phone/voice-stations.test.ts`. No string changed.

## What changed

- `STATION_IDS` gains `voiceType: 'voiceType'`, and `UNPERSISTED_STATIONS` gains the same id. The id is not `voice` (struck: `sections.test.ts`, the `migrateOpenStations(['voice'])` pin). The new id reaches neither the screen nor storage: `#write` filters unpersisted ids, and only `SUCCESSOR` and tests iterate `STATION_IDS`.
- `VoicePane.svelte`: the type row reads `sections.has(STATION_IDS.voiceType)` and toggles through `sections.toggle(...)`, as the two stations do. The local `typeOpen` is gone. `data-vp-row="voiceType"` and `#voice-type-body` are unchanged.
- **What changes on a desk, said plainly:** the row's state now lives in the page's set, so it stays open across a remount of the pane within one page load, as the two stations do. It is still closed on a fresh load and never stored. On a desk (not `exclusive`) the three rows can still all be open together.
- Comments made false and rewritten: `VoicePane.svelte:12-16` (the "not a station, local state" sentences), `sections.svelte.ts:55-57` (the "two stations" header, now three rows), and the `STATION_IDS` comment (the new id says why it is not `voice`).

## Tests

- `sections.test.ts` (`components/Drawer`, 9 files in that folder: 153 passed): the pinned list at `:85-86` is now `['binder', 'notation', 'voiceType', 'describeVoice', 'insightsShares']`; the row is a station, never first-run, and unpersisted; it is held and never written, with other toggles around it; on a phone, opening it shuts an open station or NOTATION and a station or NOTATION shuts it, and `reveal` shuts NOTATION; on a desk it stays open beside the others; and the id `voice` stays struck.
- `apps/web/e2e-phone/voice-stations.test.ts`, with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` and `--trace off`: 6 passed (4 before, 2 new): the type row open and then Describe (the type row is closed, and the reverse); and the type row open, then the "Add your range" link, with the Drawer lowered over INSIGHTS: Describe opens, the type row is closed, and the Range pickers are in the window. The brief's concern was `reveal-scroll.ts:31`, which assumes nothing closes before its target; it holds here. One detail: the pickers' top lands at -0.09 px, a fraction above the window's top (the reveal aligns the target's top to the window's top). The new test allows one pixel of slack, and says so in a comment; the two older tests, which assert `>= 0`, pass unchanged.

## Pictures (390 by 844, `report-code-lane66-pictures/`), each looked at

- `step3-phone-en-1-type-row-open.png`: VOICE open; the type row is open (the nine types with radios); "Describe your voice" and "What INSIGHTS shares, and how" are closed.
- `step3-phone-en-2-describe-open-type-closed.png`: after Describe is opened, the type row is closed ("Choose a voice type" with a down chevron) and Describe is open (its sentence and the Range pickers).
- `step3-phone-fr-1-type-row-open.png` and `step3-phone-fr-2-describe-open-type-closed.png`: the same in French (« Choisir un type de voix », « Décrire votre voix »), the same states.

## Not changed

`components/Drawer/reveal-scroll.ts`'s code (only its comment, in Step 1).
