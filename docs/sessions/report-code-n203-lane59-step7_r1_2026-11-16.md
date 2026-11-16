# Report, Code, N.203 lane 59, Step 7 (words)

r1, 2026-11-16. Branch `cloud-lane-59`. Brief r3 Step 7 with amendments 19 and 20, and the supplement. Lines 22 to 24 and the counted forms were applied in Steps 2 and 6, and lines 15 and 16 in Step 3; this step applies the rest, character for character from `sheet-english_r2`, `sheet-french_r1` (both with their appended sections), and `sheet-supplement_r1`. Tests run: the files these words touch.

## The key map, as applied

- Line 17: new `capture.firstTime` (with `{v}`, the bracketed symbol); `calib.capture.cuePrefix` and `cueSuffix` marked UNUSED and kept; `firstTimeExplanation` (`chart/screen-logic.ts`) now reads the one key.
- Lines 18, 19, 20: `capture.hint.first`, `capture.hint.active`, `capture.hint.finished`. `capture.hint.active` no longer holds `{v}` (the sheet's sentence has none); `hintsFor` still passes it, harmlessly.
- Line 21: `capture.retake` unchanged. Line 26b: `sheet.legend.sung` and `sheet.legend.placeholder`.
- The supplement's nine keys: `capture.hide`, `capture.hidden`, `capture.hint.placed.typed`, `.placed.untyped`, `.toGo`, `capture.button.sung` ("recorded" / « captée »), `sheet.legend.hull`, `pacifier.nowSustain` (Step 3), `capture.chartAlt`. Unchanged as the supplement says: `capture.cue.ready`, `capture.cue.isCaptured`, `capture.cue.allTen`, `pacifier.captured`.
- Line 5b is the VOICE pane's (lane 60); I wrote no key for it. Lines 1 to 14 are lane 60's.
- Header: 1,295 keys, `capture.` 55.

## The pins moved (amendment 20's list, and the ones it missed)

`chart/ratified-strings.test.ts` (every changed entry, a new `capture.firstTime` entry, 71 pins; the `pacifier.` words pinned in their own test), `chart/screen-logic.test.ts` (the hints, the first-time explanation, the button label "recorded"), `VowelCapture.test.ts` (the hints, the explanation, the hide label, the French « captée » in the buttons' names, the French hint), `e2e/calibrate-new.test.ts` (the hint, the hide label and its notice; not run yet). One the review's list did not name: `VowelCapture.test.ts`'s rows test and the buttons' name list (`cardinal-i, recorded`). `chart/VowelSpaceSheet.test.ts` reads the legend and passed unchanged.

Tests: `voice/chart` (all), `VowelCapture.test.ts`, `take-line.test.ts`, `i18n.test.ts`, `i18n-index.test.ts`: all passed (256 in the first two groups, 13 in the i18n pair), including the OQLF sweep.

## Words I did not change, because no sheet reaches them, that now sit beside the new ones

These still say "sing", "sample", or "captured" and will read as a second vocabulary until a later words pass: `capture.hint.retake` ("... only if the new reading is as clear"), `capture.hint.confirmClear`, `capture.uncertain`, `pacifier.rolledBack` ("new sample was less certain"), `pacifier.captured` ("{v} captured."), `capture.cue.isCaptured`, `capture.cue.allTen` ("All ten captured."), `calib.capture.toast*`, the `pacifier.error.*` set (supplement and Fable's review of r2, question 3, name some of them as left). I did not write any.

## Pictures

`step7-phone-en-rest`, `step7-phone-en-breathe`, `step7-phone-fr-rest`, `step7-phone-fr-breathe`, `step7-desk-en-rest`, `step7-phone-en-early-ten`: all opened. They show the new first-time explanation in both languages, the cue, and, at ten, the hint "Tap any vowel to focus on it. Re-take records it again." and "Hide the chart and the readout during a take". The other new hints sit below the chart on a phone and appear in the Step 6 pictures ("Ilya has placed ... as you record" is not in them: those pictures were taken before this step).

## What needs Dann's eye

- The 02:xx French of line 17 has no « tu » or « vous » surprise, but « Chantez-la » refers to the vowel by « la » (feminine, « voyelle »); I did not change it, it is the sheet's.
- The residual vocabulary above.

## What I could not establish

- Whether any other test in the suite pins an old word: I grepped `src` and `e2e` for the old English and French strings and found only the files named above; the full suite at the end of Step 8 settles it.
