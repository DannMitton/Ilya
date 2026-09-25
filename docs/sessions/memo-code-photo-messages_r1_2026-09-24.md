# MEMO. Two honest photo messages

**Claude Code, 2026-09-24, branch `Shane` at `1987157`, tree dirty with the desk's docs and this change. Answers `brief-code-photo-messages_r1`. Nothing committed.**

**Done.** Two keys in `i18n.ts`: `upload.err.pictureUnclear` replaces the inline "No text recognised" at the poem route's final refusal, guard included. `upload.err.imageHeic` replaces `upload.err.imageUndecodable` when `isHeifImage` (new, `format-detection.ts`) sniffs HEIC or HEIF, at both undecodable sites. AVIF keeps the generic refusal.

**Gates.** Tests 1,402 to 1,404: the two new `isHeifImage` tests. svelte-check 0 errors, 12 warnings, as before.

**Seen rendered, English and French, dev server.** `IMG_5635.HEIC` showed message 2; `IMG_5635-as-jpeg.jpg` showed message 1. Staged copies deleted.

**NOT ESTABLISHED.** Safari: not tried, and since it decodes HEIC itself, it should never show message 2. The "OCR processing failed" crash string is unchanged. A scanned PDF with no text now also reads "this picture".
