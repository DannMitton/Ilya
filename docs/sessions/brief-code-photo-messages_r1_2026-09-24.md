# CODE BRIEF. Two honest photo messages

**Written by the desk 2026-09-24 20:40. For Claude Code, in `~/Desktop/ilya-rewrite` on branch `Shane`.** No git writes, gates before and after, Canadian spelling, no em dashes. Keep the file's escaping convention (`’` for the apostrophe).

## Why

`docs/sessions/memo-code-phone-photo_r1_2026-09-24.md`: a phone photo of a score produced the false "No text recognised in image." (recognition found about 2,300 characters; the Russian guard refused them), and a HEIC photo produced a generic refusal. **Ruled by Dann 2026-09-24 19:43:** honest messages now; curved-photo reading and a HEIC decoder after the release. **Both strings below RATIFIED by Dann 2026-09-24 20:37 to 20:38** (desk-drafted French; "cannot yet" / « pas encore » are his; the subject « Ilya » ruled by him at 20:39).

## The change

1. **The unreadable picture.** `apps/web/src/lib/shane/ScoreUploader.svelte:481` builds this message inline. Move it into `apps/web/src/lib/i18n.ts` as a new key and use it for every refusal that path covers, including the guard's:
   - EN: "Ilya could not read this picture clearly. A flat scan or a PDF works best."
   - FR: « Ilya n’a pas pu lire cette image clairement. Une numérisation à plat ou un PDF donne de meilleurs résultats. »
2. **HEIC only.** When the file sniffs as HEIC or HEIF (`apps/web/src/lib/shane/ingestion/format-detection.ts:79-120`) and the browser cannot decode it, show a new key instead of `upload.err.imageUndecodable`. Every other undecodable picture keeps `upload.err.imageUndecodable` unchanged.
   - EN: "Ilya cannot yet open iPhone photos in HEIC format. On a Mac, open the photo in Preview and choose File, then Export, then JPEG."
   - FR: « Ilya ne peut pas encore ouvrir les photos d’iPhone en format HEIC. Sur un Mac, ouvrez la photo dans Aperçu et choisissez Fichier, puis Exporter, puis JPEG. »

Nothing else changes: no decoder, no threshold change.

## Done when

- Gates at baseline or moved only by tests you name.
- Seen rendered in both languages: `~/Downloads/IMG_5635.HEIC` shows message 2; `~/Downloads/IMG_5635-as-jpeg.jpg` shows message 1. Stage copies only in the gitignored `static/reader/` and delete them after.

## Return

A memo of at most 150 words with "NOT ESTABLISHED", at `docs/sessions/memo-code-photo-messages_r1_2026-09-24.md`. Stop before shipping.
