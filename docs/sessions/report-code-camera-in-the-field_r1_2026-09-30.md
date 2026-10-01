# Report from Code: a camera glyph in the Input field

Answers `brief-code-camera-in-the-field_r1_2026-09-30.md`, queue row 2e. All four steps are built.

Read on branch `Shane` at `477ba5b`. The working tree was not clean at the start: row 2d's two engine files, the desk's five `docs/memory/` files, and two session documents were already in it. No git writes. `git show` and `git log` were used read-only to recover the glyph.

## Summary

- **On a phone**, a viewfinder glyph sits in the top-right corner of the Input field. Pressing it opens a chooser that asks for the rear camera. The photograph goes into the same handler as a picked file.
- **On the desk**, the glyph and its input are not rendered.
- **Not established:** whether the iPhone's camera hands the page HEIC or JPEG. It needs Dann's walk; see "For Dann's walk" below.
- **Gates:** all eight pass. Gate 4 reads 1750 against a baseline of 1747. The difference is row 2d's three tests; this row adds none.

## What was built

| Step | Where | What |
|---|---|---|
| 1. The glyph | `IntakeCamera.svelte` (new, 102 lines) | The old OCR icon's drawing, recovered from `8fbc8d7c^` (the parent of N.108-4): four corner brackets and a scan line, 18 px. It is a viewfinder, not a camera body, and it is reused unchanged, as the brief asked. |
| 2. The camera | the same file | A second hidden input, `type="file" accept="image/*" capture="environment"`. Its change handler passes the event to `IntakePanel`'s existing `onPick`. The one picker and `acceptList` are untouched. |
| 3. Where it shows | `IntakePanel.svelte` | `{#if isMobile}<IntakeCamera … />{/if}`. Disabled while the dictionary loads, the same rule the textarea follows. |
| 4. Name and tooltip | `i18n.ts` | `intake.camera`: EN "Take a photograph", FR « Prendre une photographie », with a comment carrying Dann's ratification (2026-09-30 20:34). |

**Why a new file.** Built inline, the change took `IntakePanel.svelte` from 998 to 1098 lines, which tripped gate 8 (1000 lines is the limit for a file without a ceiling). The camera is now its own component, and `IntakePanel.svelte` is at **999 lines**, one under the limit. The next addition to that file will trip gate 8.

**Both comments are rewritten**, as the brief asked:

- The markup comment where the old icon stood now says the icon returned on 2026-09-30, and why the 2026-09-03 reason does not reach it.
- The `THE OCR MOVED OUT` comment in the script now says the icon returned as a different control.
- I also rewrote two notes about `.intake`'s `position: relative`. Both said there was no longer a camera to contain.

### Departures, to rule on

1. **The brief's premise about `take` is out of date.** The brief says the photograph will be asked "whether it is the poem or the score". Since N.146, `ScoreUploader.take` no longer asks. It sends a picture with staves to the score reader and one without to the poem's OCR. The photograph takes exactly the one picker's road, as the brief asked, and my comments say what that road now does. Headless, a JPEG of an abstract wallpaper went straight to the poem's OCR without a question.
2. **Restyled. JUDGEMENT.** The old button rested at 30% opacity on a white chip and came up to full only on hover. A phone has no hover, so it would have rested at 30% permanently. It now draws in `--ink-tertiary` at full strength with no chip, on the field's own `--paper-light` fill. Contrast is about 5.2:1, against 3:1 for a UI control.
3. **Inset 6 px. MEASURED.** Placed flush in the frame's corner, the 44 px box put the glyph's brackets on the textarea's rounded border. 6 px in from the frame's corner, where the old button sat, the glyph sits 7 px inside the field's border on both edges.
4. **Padding beside the glyph, on a phone only.** The textarea gains `padding-right: 38px` so typed lines wrap before they reach the glyph. This changes the field's text width on a phone, from 296 px wide with 9.6 px of padding to 38 px of padding. The desk is unchanged.
5. **A measurement line.** The camera's change handler logs one `[Ilya] camera:` console line: MIME type, file name, byte size, and pixel dimensions, or "not decodable here". It exists for Dann's walk and should go once the answer is recorded.

## Measured

Headless Chromium (Playwright, from a scratchpad script), against `localhost:5173` with these changes.

| Viewport | Measurement |
|---|---|
| Desktop, 1440 × 900 | No `.camera-btn`, no `input[capture]`. The one picker keeps its `accept` list. The textarea's right padding is 9.6 px, as before. |
| Phone, 390 × 844, touch, drawer raised | One button, 44 × 44 px. Glyph 18 × 18 px. A hit test at the glyph's centre lands on the button. Accessible name and tooltip: "Take a photograph". Full opacity once the dictionary is loaded, after 1.9 s. |
| Phone, tap | A file chooser opens: single file, `capture="environment"`, `accept="image/*"`. |
| Phone, a 1600 × 900 JPEG | Logged `image/jpeg photo.jpg 514654 bytes 1600 x 900`. It reached `take` and was read as a poem by OCR. |
| Phone, a real HEIC (`ftypheic`) | Logged `image/heic shot.heic 28342 bytes not decodable here`. Ilya showed `upload.err.imageHeic`. This is Chromium, which cannot decode HEIC; it says nothing about Safari. |

Headless Chromium cannot open a camera. It proves the plumbing, not the camera.

## For Dann's walk: what the camera hands the page

**NOT ESTABLISHED.** It needs Dann's iPhone on the branch alias. Walk it once the change is committed and deployed; until then it is on `localhost:5173` only.

1. Raise the drawer, press the glyph in the Input field's top-right corner, and photograph a page.
2. **What he will see.** If the photograph is read (as a poem, or as a score with its clef-and-key question), the camera works end to end. If he sees "Ilya cannot yet open iPhone photos in HEIC format", Safari handed the page a HEIC it could not decode. In that case the feature is dead on arrival and should not ship as it stands.
3. **To record the exact answer** (MIME type, extension, pixel dimensions), connect the iPhone to the Mac, open Safari's Develop menu, choose the phone's page, and read the `[Ilya] camera:` line in the console.

One fact narrows the risk without settling it. `upload.err.imageHeic` fires only when the browser fails to decode the picture (`ScoreUploader.svelte:489`, through `toGreyscalePng`). A HEIC that iOS Safari can decode would be read like a JPEG. Whether iOS transcodes to JPEG, and whether its Safari decodes HEIC in `createImageBitmap`, are both NOT ESTABLISHED.

## Gates

| Gate | Result |
|---|---|
| 1 phonology | 251 passed (251) |
| 2 dictionary | 235 passed (235) |
| 3 web check | 0 errors and 12 warnings in 5 files, unchanged |
| 4 web test | 1750 passed (1750); baseline 1747, moved by row 2d's three tests, not by this row |
| 5 score parser | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | OK. `IntakePanel.svelte` is at 999 of 1000 lines. |

The gates ran from the scratch copy of `ilya-ship.sh` that cannot stage. On the first run, gate 8 failed at 1098 lines; that failure is why the component exists.

## Files

- `apps/web/src/lib/components/Drawer/IntakeCamera.svelte`: new, untracked.
- `apps/web/src/lib/components/Drawer/IntakePanel.svelte`: modified.
- `apps/web/src/lib/i18n.ts`: one key added.
- This report: untracked.

The test images (a JPEG made from a macOS wallpaper, and a HEIC made from a system desktop picture) and the Playwright script are in the scratchpad, not in the repository.
