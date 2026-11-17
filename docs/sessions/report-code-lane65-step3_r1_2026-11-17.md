# Report: lane 65, Step 3 (the recorder panel on a phone), and the lane's gates

2026-11-17, Code (cloud session), branch `cloud-lane-65`. Last report of the lane.

## What I chose, and why

The panel now rests **folded as a vertical tab in the page's right-hand gutter**, 14 px wide, 130 px tall, flush to the right edge, 140 px above the bottom (clear of the 44 px DRAWER bar). Its face reads `rec · <picker> · <takes held>`, with a star after the count while takes are unsaved (and an amber ground), for example `rec · shipped · 0`. Tapping it unfolds the card (picker line, sung vowel field, Save, count, Fold); Fold or the tab folds it again. It is folded on every load. The wrapper takes no touches (`pointer-events:none`); only the tab and, unfolded, the card do.

Why: I measured every visible control on the six screens at 390 by 844 (probe script, scratchpad, development server, no panel). No single band of the screen is free on all six: the Drawer's rows span x 16 to 374 on screen 4, the wizard's radios and Begin sit mid-screen, the welcome sheet's footer and the Home Screen card fill the bottom. The one place nothing reaches is the right gutter: the rightmost control edge on any screen is x 374 (Français, the Drawer rows), which leaves 16 px. A 14 px tab fits inside it. The cost, stated plainly: a 14 px by 130 px target is small to hit, and the panel is no longer in view as a card while a take is sung; Dann unfolds it to Save or to change the sung vowel. When unfolded it covers what it covers (picture 7) until folded; that is the singer's choice, not a resting state.

Not done, and why: no e2e test was added for the placement. The brief's Owns list names `capture-file.ts` and its test only, and the tree has no DOM test environment, so the placement is pinned from the exported measures and the source (below) and was measured in a browser, with pictures.

## The picker label

`mountRecorderPanel(picker: Picker = 'shipped')`; `Picker` is already imported from `./analyze` in `capture-file.ts`, which still imports only `./analyze` and `./extract` (`capture-file.test.ts:104`, unchanged and passing). `voice/chart/stub-switch.ts:31` now reads `if (__ILYA_RECORDER__ && captureFileEnabled()) mountRecorderPanel(measurePicker(search));`, still on one line behind `__ILYA_RECORDER__ &&` (`capture-file.test.ts:108-117`). `measure-switch.ts` and `vercel.json` untouched. The panel's words are English only.

A bug I caught on the way, so it is on the record: my first version set `card.hidden = true` beside an inline `display:flex`, which overrides `hidden`; the folded card was invisible to me in the code but still stood open and intercepted taps (my own script could not tap the Drawer). The card now toggles `style.display`, with a comment saying why.

## Tests added (`voice/engine/capture-file.test.ts`, four tests)

- `panelFace` words: `rec · open · 0`, `rec · shipped · 3`, `rec · shipped · 3*`, and a path face contains `path`.
- The address reaches the face: `measurePicker('?harness=1&measure=open')` gives a face containing `open`; `?measure=shipped` gives `shipped`. No test pins the label for an address with no `measure` (lane 64 changes that default).
- `PANEL_TAB_WIDTH_PX` (14) is at most 16, and `PANEL_TAB_BOTTOM_PX` (140) is at least 44 + 16.
- The source: wrapper `position:fixed;right:0;bottom:${PANEL_TAB_BOTTOM_PX}px`, `pointer-events:none`, no `right:12px;bottom:12px`, the `mountRecorderPanel(picker: Picker = 'shipped')` signature, and the `stub-switch.ts` line above.

## Measured on the six screens (390 by 844, `?capture=stub&harness=1&measure=shipped`)

Panel rect x 376, y 574, 14 by 130 on every screen. The probe lists each visible, topmost control and checks overlap with the panel: **covered = none** on all of: welcome sheet (fresh storage), Home Screen card (iPhone Safari user agent, waited for the card), page with the Drawer down, Drawer up with VOICE open, wizard first screen (no voice type), wizard Welcome with Begin (voice type set), and the take screen (stub, through Begin, Start, Continue). The unfolded card, folded again with Fold, and the picker line for `?measure=open` and `?measure=shipped` were read by tapping in the same browser: card hidden before, shown after the tab tap, hidden after Fold; picker line `Picker in use: open` and `Picker in use: shipped`.

## Pictures (`report-code-lane65-pictures/`), each looked at before this push

`step3-phone-1-welcome-sheet.png`, `-2-home-screen-card.png`, `-3-page-drawer-down.png`, `-4-drawer-up-voice-open.png`, `-5-wizard-first-screen.png`, `-5b-wizard-welcome-begin.png`, `-6-take-screen.png` (the tab visible and covering nothing), and `-7-unfolded-open.png`, `-7-unfolded-shipped.png` (the card open, over the page, with the picker line). Seen as well: picture 5 shows Step 2's new line on the wizard's first screen, "Ilya can use generic values with your guidance, until you record your own vowels. This doesn’t change what Ilya measures. “Not sure” is a valid answer."

## Section 7, first question

Why `?measure=shipped` did not select the shipped picker on Dann's iPhone: NOT ESTABLISHED. Step 0 has what the code shows; nothing found since changes it. The face now shows the picker in use on the next walk.

## The eight gates and the Playwright suites, on the lane's final tree

Python 3.13 with numpy and scipy 1.18.1 present. The gates ran on the tree with Steps 1 to 3 (Step 3's code and tests uncommitted at that moment, committed with this report).

| Gate | Result |
|---|---|
| 1 phonology | 462 passed (462) |
| 2 dictionary | 248 passed (248) |
| 3 web-check | 0 errors, 12 warnings in 5 files |
| 4 web-test | **6565 passed, 1 skipped (6566)**: baseline 6560 + 1 (Step 2) + 4 (Step 3) |
| 5 score-parser | 904 passed, 5 skipped (909) |
| 6 blurb | 178 passed (178) |
| 7 integration | 159 passed (159) |
| 8 ratchets | OK (no ceiling touched) |

Playwright, with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, `--trace off`: desk project `voice-pane`, `voice-stations`, and `calibrate-new` together, **69 passed**; phone project `voice-stations`, **4 passed**. (An earlier run of the desk set was cut off at test 30 when the session's worker restarted; this is the complete rerun.)

Gate 4 is 6565 with Python, numpy, and scipy; without them it would be 6561 passed, 5 skipped, by the baseline's own difference. I did not run the no-Python case.

## What I did not touch

Everything under `docs/memory/`, every brief, `vercel.json`, `measure-switch.ts`, `CalibrationWizard.svelte`, `sections.svelte.ts`, `voice-pane.ts`, every engine file but `capture-file.ts`. I opened no pull request and pushed only `cloud-lane-65`.
