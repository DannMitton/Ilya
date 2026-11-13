# Report, N.199 Step 4: the screen, behind the switch (four commits)

2026-11-13, cloud lane, branch `cloud-lane-51`. Seen only with `?calibrate=new`. This report grows by one section per commit: 4a, 4b, 4c, 4d. Gate counts are after each commit.

## 4a. The chart

**What changed, with path:line**

- `apps/web/src/lib/voice/chart/VowelChart.svelte` (new): the chart at 484 by 280 in its own units, scaling to the width it is given. It draws `ChartLayers` (Step 2's drawing: zones with no stroke, the grid after them, the hull, placeholders, sung dots, the grid's numbers) for a `model` and a `view` it is handed, so Step 4c can move the view and the drawing stays one. Props: `model`, `view`, `active` (its zone takes opacity 0.5, the others their own).
- `voice/chart/model.ts` (new): `buildChartModel(profile, voiceType)` returns the zones, placeholders, sung dots, the full view, and `allTen`; `CHART_W` and `CHART_H`. `VowelSpaceSheet.svelte` now builds its model here, so the sheet and the screen cannot disagree about a voice.
- `voice/chart/draft-strings.ts`: the whole of the brief's section 7 `capture.*` table added, verbatim, with the sheet's. Nothing enters `i18n.ts`.
- **Each unsung zone carries its symbol** through its placeholder dot (every unsung vowel has one, `computeZones`). Tested: all ten symbols appear with one vowel sung.
- **No outline on any zone:** tested on the markup (`fill`, `fill-opacity`, no `stroke`); and `colours.test.ts` (Step 2) fails if `app.css` declares a stroke or outline token for a zone.

**Tests (11 new):** `VowelChart.test.ts` 8 (ten zones, the grid after the zones, a symbol for every vowel, no stroke, the active zone's deeper opacity with the others unchanged, the bar for a reading with no fR2, the zoomed view drawing the same zone at least 1.3 times wider, the hull dashed until ten, an image role and no "goal" or "target"); `model.test.ts` 3.

**Gates after 4a**

| Gate | Baseline | After 4a |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | **5533 passed, 1 skipped** |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |

5522 after Step 3 plus 11.
