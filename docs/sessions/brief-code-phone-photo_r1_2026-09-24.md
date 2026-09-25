# CODE BRIEF. A real phone photo of a score does not get through

**Written by the desk 2026-09-24 19:25. For Claude Code, in `~/Desktop/ilya-rewrite` on branch `Shane`.** No git writes, gates before and after, Canadian spelling, no em dashes. **NOT ESTABLISHED beats a complete invented answer.** Diagnose first; report before building anything.

## What the desk saw

The last format of the per-format walk (UNSETTLED-6), on the sha deployment `ilya-4cm3cvf4k-dannmittons-projects.vercel.app` (an empty origin), in Dann's Chrome on his Mac, tab in front:

1. **`~/Downloads/IMG_5635.HEIC`**, Dann's iPhone photo of page 63 of his printed Sunless (song 1, first three systems, voice and piano, Cyrillic lyrics, a hand and the book's edge in frame). Ilya showed `upload.err.imageUndecodable`: "This browser cannot open that picture. A JPEG or a PNG will work." The sniff accepts HEIC (`apps/web/src/lib/shane/ingestion/format-detection.ts:79-120`); Chrome on macOS cannot decode it, and the tree has no HEIC decoder (grep for `heic2any` and `libheif`: none).
2. **`~/Downloads/IMG_5635-as-jpeg.jpg`**, the same photo converted to JPEG by the desk (3024 x 4032). Ilya showed "No text recognized in image." and drew nothing. **It appears to have taken the picture as a poem and looked for words, not as a score.** The N.146 poem-or-score detection is the first suspect; establish, do not assume.

Dann's own workflow is exactly this: iPhone photos, HEIC, into Chrome on a Mac.

## Establish, with evidence

1. Why the JPEG was routed where it was (which detector, which score or threshold, `path:line`), and whether the page reader, run on it directly, reads the vocal line.
2. Whether "No text recognized in image." is true of this picture (it carries Cyrillic lyrics). If it is false, say so plainly; that meets the freeze rule's exception.
3. For HEIC: the options and their cost, with the byte count any decoder adds to `static/` (CONTRACT §6 requires the count): a WASM or JS HEIC decoder; or a better message that tells a Mac user how to get a JPEG. Do not build either yet.

## Return

A memo of at most 300 words with a section headed "NOT ESTABLISHED", saved as `docs/sessions/memo-code-phone-photo_r1_2026-09-24.md`. Stop before any build; the desk brings the options to Dann.
