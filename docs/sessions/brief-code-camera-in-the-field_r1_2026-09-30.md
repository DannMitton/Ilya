# Brief to Code: a camera glyph in the Input field that opens the phone's camera

From the desk, 2026-09-30 20:40. No git writes (read-only `git show` and `git log` are allowed, to recover the old glyph). Gates before and after. Canadian spelling, no em dashes.

## The request

Dann, 2026-09-30 20:32, on his iPhone: *"I don't see a way to take a photograph directly inside Ilya without exiting, taking a photo, then navigating to it. Please restore the photo glyph in the top right corner of the input field and make it a hotspot invoking the mobile device's camera utility so Ilya users have the impression that they are photographing from inside Ilya."*

## What it amends

N.108 increment 4, ruled by Dann 2026-09-03, removed the camera icon because the icon, Choose a file, and "Read a score from a photograph" *"all serve the same function"* (`apps/web/src/lib/components/Drawer/IntakePanel.svelte:240-244`, `:378-394`). That icon picked a file for OCR. **This one is different: it opens the camera.** No other control does that, so the 2026-09-03 reason does not apply to it. Rewrite both comments to say the icon returned on 2026-09-30 and why.

## The build

1. **The glyph.** Recover the camera glyph and its placement (top-right corner of the field, inside `.intake`, which still has `position: relative`, `IntakePanel.svelte:600`, `:872`) from the last commit before N.108 increment 4. Use `git --no-pager log -S "camera" -- apps/web/src/lib/components/Drawer/` to find it. Reuse its drawing; restyle only if the current tokens require it. Tap target at least 44 px (`CONTRACT.md`, the 44 px floor).
2. **The camera.** A second hidden input, `type="file" accept="image/*" capture="environment"`, opened by the glyph. Its change handler is the existing `onPick` (`IntakePanel.svelte:197`), so the photograph enters the same flow as a picked picture: `ScoreUploader.take` asks whether it is the poem or the score. Do not touch the one picker or `acceptList` (`:187`, N.70).
3. **Where it shows. DESK DEFAULT:** only when `isMobile` is true. A desktop browser ignores `capture` and would open an ordinary file picker, which duplicates Choose a file, the thing 2026-09-03 removed.
4. **Its accessible name and tooltip:** the key `intake.camera`, **RATIFIED by Dann 2026-09-30 20:34** (*"yes"*), desk-drafted from the tree's term (`i18n.ts:641`, `:884`): EN "Take a photograph", FR « Prendre une photographie ». Verbatim, with a comment carrying the ratification.

## Measure and report

- On Dann's iPhone through the branch alias (he walks it; you cannot): does the glyph open the camera, and what does the photo arrive as (MIME type, extension, pixel dimensions)? **Whether the iOS camera hands a web page HEIC or JPEG is NOT ESTABLISHED** (`docs/memory/ENVIRONMENT.md`, the HEIC entry). If it arrives as HEIC, Ilya shows `upload.err.imageHeic` and the feature is dead on arrival; say so before shipping.
- Desktop: the glyph is absent.

## Report

`docs/sessions/report-code-camera-in-the-field_r1_2026-09-30.md`. NOT ESTABLISHED beats a complete invented answer.
