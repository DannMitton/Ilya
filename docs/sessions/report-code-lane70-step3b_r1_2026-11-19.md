# Report, lane 70, step 3b: the taps, measured

2026-11-19. Branch `cloud-lane-70`, on top of step 3. Brief section 3, step 3b. **Nothing was changed**: no size, padding, hit area, or coarse-pointer rule. This is a measurement, and the design question it raises is Dann's.

## 1. How it was measured

- 390 by 844, English, Chromium, the Sunless no. 1 engraved fixture, one script run twice with the same code: **before** on the unrepaired tree (`e4804780`, the step 0 commit, `InsightsPane.svelte` still holding the `{#if isMobile}` column) and **after** on the repaired tree (`ab0733e3`, steps 1 and 2).
- Each box is `getBoundingClientRect()` of the on-screen copy (any element with `.closest('.measurer')` excluded), in CSS pixels. After the repair, that box is the **scaled** box: the browser reports the transform. This is the size under the finger. The scale is 0.419118 (step 3).
- States visited: no voice, and the voices TENOR_T, BASS_B1, BASS_B2, NOVICE_N, SOPRANO_S, BARITONE (the named voices of `e2e/insights-key-lines.test.ts`), plus `NORANGE` (a baritone with no range, which shows the range offer) and `TIGHT` (a bass with range C3 to E3). A control's box did not vary between states or between its instances (the script reports distinct width-by-height pairs, with a count).

## 2. The table

| Control | Where it is (file and line) | Before: width x height | After: width x height | Instances seen | Before / after |
| --- | --- | --- | --- | --- | --- |
| `.try-key` ("Try this key") | button, `SingerBlock.svelte:69`; rule `:563` | 76.3 x 21.3 | 32.0 x 8.9 | 51 after (TENOR_T, BASS_B1, BASS_B2, NOVICE_N, SOPRANO_S, BARITONE, TIGHT) | x0.419 |
| `.offer-link`, "Add your range" | `SingerBlock.svelte:95`; rule `:585` | 102.6 x 20.3 | 43.0 x 8.5 | 1 (NORANGE) | x0.419 |
| `.offer-link`, "What INSIGHTS shares, and how" | `SingerBlock.svelte:180`; rule `:585` | 181.2 x 16.1 | 76.0 x 6.7 | 11 after, every state with a voice | x0.419 |
| `.offer-decline` ("No thanks") | `SingerBlock.svelte:95`; rule `:593` | 67.3 x 20.3 | 28.2 x 8.5 | 1 (NORANGE) | x0.419 |
| `.tempo-link` ("Change the tempo") | `SingerBlock.svelte:186`; rule `:370` | 125.2 x 23.5 | 52.5 x 9.8 | 8 after | x0.419 |
| `.more summary` | `SingerBlock.svelte:121`; rule `:600` | **no instance** | **no instance** | 0 | NOT ESTABLISHED |
| `.reveal summary` ("Show keys that reach ...") | `SingerBlock.svelte:116`; rule `:608` | 310.0 x 17.3 | 261.5 x 7.2 | 7 after (TENOR_T, BASS_B1, BASS_B2, SOPRANO_S, NOVICE_N, BARITONE, TIGHT) | width x0.844, height x0.416 |

Reading the table:

- Every button shrinks by the scale, as `PageFit` guarantees: the height of "Try this key" goes from 21.3 to 8.9 px and its width from 76.3 to 32.0 px. The two numbers (the answer to "how large is the thing under the finger") are 32.0 by 8.9, 43.0 by 8.5, 28.2 by 8.5, 52.5 by 9.8, 76.0 by 6.7, and 261.5 by 7.2.
- The `.reveal summary` width is not 0.419 of 310 (that would be 130). Its "before" width of 310 was the full column (the summary fills its block); after, it is 261.5 = 0.419 x 624, which is the page's content column (624 px, the 816 px page less 2 x 96 px margins). That agrees with the source (`.column` at `InsightsPane.svelte:612-613`: `left: 96px; right: 96px`; 816 less 192 is 624).
- **Every one of these is under any usual minimum for a touch target after the repair.** I report that as a measurement. I am not quoting a threshold: the brief gave none, and I did not read one in this repository for this step. The design question the numbers raise is Dann's, by the brief's own instruction, and I did not repair, widen, or add a rule for any of it.
- The "before" heights (16.1 to 23.5 px) were already small. The repair multiplies a small number by 0.419.

## 3. What I did not measure

- The drawer controls and the tab bar are outside INSIGHTS and not part of this step.
- The `input-link` form of `.offer-link` (`SingerBlock.svelte:63`, "no score") needs a state I did not set up. Not measured.
- A real device. The numbers are Chromium's at 390 by 844 with a device scale factor of 2.

## NOT ESTABLISHED

1. `.more summary` (`SingerBlock.svelte:121`): I found no state that draws it. It appears when the page has more comments than it shows (`singer-blocks.ts:272`), and none of the eight states did. Neither its before size nor its after size is established. Its rule is at `SingerBlock.svelte:600`. After the repair its size will be its before size times 0.419, but that is arithmetic, not a measurement.
2. The `.input-link` variant (section 3).
3. Whether any of these is below a minimum target that this project has set for itself. I did not search the repository for one in this step.
4. Behaviour on a real touch device: `hasTouch` and `isMobile` were not set in this measurement; the layout is the same, since `isMobile` in the app is a width test.
