# Report, N.199 Step 6: tests and pictures

2026-11-13, cloud lane, branch `cloud-lane-51`. The new screen and the sheet, tested in a browser on the stub and photographed. Everything is behind `?calibrate=new`.

## What changed, with path:line

- **A development stub for the browser.** `apps/web/src/lib/voice/chart/stub-switch.ts` (new): with `?capture=stub` on a development server (`import.meta.env.DEV`), the wizard's capture session is `StubCaptureSession`; otherwise `LiveCaptureSession`. A test scripts takes through `window.__ilyaStubNext`, an array of outcomes taken one per take. `CalibrationWizard.svelte:226` now defaults `session` to `captureSessionFor()`. A production build drops it.
- **The stub can give an error and be scripted.** `engine/stub.ts`: `StubOutcome` gains `'error-no-audio'` (ends the take with `NO_AUDIO_INPUT`) and the constructor a third argument, a per-take `outcomeFor`. Nothing changes without it. Brief: "extend the stub if it cannot give one"; it could not.
- **A fault the browser test found.** `VowelCapture.svelte` (`advanceFrom`): in a re-take pass, a take that leaves a notice to read (a rolled-back or uncertain reading) no longer returns to the summary at once, which would have thrown the notice away; it stays until the singer returns. A clean take still returns by itself.
- **The printed sheet did not fit one letter page.** Measured by PDF in print media: 2 pages, only the provenance line on the second. `VowelSpaceSheet.svelte` (the `.for-print` rules): a 0.4 in top and bottom margin, tighter rows, legend, and provenance on paper. Now **1 page**, with about 0.6 in to spare by eye.
- **Unit tests (3, `stub-switch.test.ts`):** the switch is off by default and on only for `stub`; the scripted outcomes (an error, a Provisional, then the default) run in order.

## The browser suite (`apps/web/e2e/calibrate-new.test.ts`, 8 tests, all pass)

Run on the Vite dev server with Chromium, Drawer on desktop at 1440 by 900, real time (the count-in is 5 s and the stub's sweep about 4 s, so a tour takes about 2 minutes). Not part of the eight gates; the existing Playwright suite was not re-run.

1. **A full tour:** ten captures in Ilya's order ([i e ɛ a ɑ o u ɨ ɪ ʌ]), the cue "All ten captured. This is your vowel space.", Done, the hull drawn whole, no placeholder left, ten stored readings each marked `visibility: zone`, ten take records each with a raw reading, `voiceType` bass, and `visible: zone`; Done opens the summary with the sheet.
2. **A manual pick:** a tap on [u] began its take at once; a tap on [ɛ] mid-take changed nothing; afterwards the selection was [i] (round the seven from [u], wrapping); Return to summary is absent before the first reading and works after it.
3. **A cancel in each phase:** a second tap on the vowel at 0.5 s (sung count), 3.5 s (pause), 5.15 s (wait for stable fry), 7.2 s (sweep): each ends the take with "Capture cancelled.", saves no reading, and records `cancelled` with no numbers; Stop and Escape cancel too.
4. **A rolled-back re-take and an error:** a scripted Provisional re-take of a Captured [i] kept the stored reading (296 Hz), said the previous one was kept, stayed on screen, and recorded `rolled-back`; the next scripted take failed with the tree's "No sound came through" and recorded `failed` with `NO_AUDIO_INPUT`; the main button was live again; Return to summary showed 3 of 10.
5. **A re-take pass** with a clean take returns to the summary by itself.
6. **Start over's two taps:** the first changes the button to Clear all and the hint to "Tap Clear all to clear every reading for this voice." and clears nothing; the second returns to Begin with no readings and no take record in storage.
7. **Hidden mode:** from the tap the chart is replaced by the sentence and no chart is in the DOM; it returns at the capture; the reading and the take record carry `hidden`.
8. **A soprano:** ten zones and ten placeholders with nothing sung, and the first-move hint.

Two of the eight failed on the first run, both wrong expectations in my tests (the stub's default makes [ɨ] and [ʌ] Provisional, whose notice stays on screen by design; and the hint with nothing sung is the first-move sentence). I corrected the tests; the screen was not changed for them.

## Pictures (`docs/sessions/report-code-n199-step6-pictures/`, 2,058,450 bytes together, English, 2 times scale)

Drawer on desktop, cropped to the drawer at 520 by 900: `desktop-1-idle.png`, `desktop-2-mid-take.png`, `desktop-3-captured.png`, `desktop-4-all-ten.png`, `desktop-5-hidden.png`. Phone at 390 by 844: `phone-1-idle.png` to `phone-5-hidden.png`. The printed sheet: `printed-sheet.pdf` (letter, one page, print media).

What I saw in them: the Drawer and the phone both show the circle, name, credit, and squircle in one row; the chart zoomed in on [ɛ] mid-take with its zone deeper and the cue "Two."; the ten buttons in two rows of five, the selected one outlined, the sung ones filled; the readout in black after a capture. On the phone the sticky group (chart, bar, cue, buttons, Start and Stop) fits the 844 px viewport with the hint cut off below, so the takeover scrolls there. The sheet's hull, dots, placeholders, table, and provenance are all legible on paper.

**Mid-take and captured pictures are from a different state than named.** The "captured" picture was taken 7.5 s after the tap, after the landing ended, so it shows the screen at rest on the next vowel with its stored readout, not the 0.9 s landing. A picture of the landing itself was not taken.

## Gates after Step 6

| Gate | Baseline | After Step 6 |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | **5585 passed, 1 skipped** |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |

5582 after Step 5 plus 3. The wizard is 2118 lines, ceiling 2124.

## Checked since the Step 5 report

Duplicating a voice (`CalibrationWizard.svelte:522-526`) calls `createVoice(name, $state.snapshot(profile))`: formants only, so a copy keeps no take record, as the brief says.

## Could not establish

- **That the screen works with a real microphone.** Every full take ran on the stub. With Chromium's fake microphone no stable fry arrived, so a take ended in the listening timeout error; the real `LiveCaptureSession` has never completed a take in this session.
- **The brief's "wrong vowel" question (M0)** and how the screen behaves for a voice that is not a bass: not mine, not run. The soprano test checks only that the screen renders.
- **The landing frame.** See above: the move back out and the dot's landing at 0.9 s were not photographed or observed in a browser.
- **The phone's behaviour in a short window and the sticky group in the phone's landscape.** Not tried.
- **Whether the 1.4 times zoom is visible enough** at a phone's width; it showed in the mid-take picture.
- **The existing Playwright suite.** Not re-run; this session ran only the new file.
- **How the phone's drawer pull and the takeover interact with the new screen's sticky group:** the phone pictures show the group in view with the drawer open; nothing was scrolled.
- **Contrast, focus order, and screen-reader behaviour.** Not measured; the cue's live region was checked only by reading the markup.

## Stopped here, as asked

Step 6 is pushed. Not done, by instruction: M0, Step 7 (words), Step 8 (the handover and the deletion), Step 9, Phase 2. Dann walks the screen next, with `?calibrate=new` on his phone and his desktop; the stub is `?calibrate=new&capture=stub` on a development server only.
