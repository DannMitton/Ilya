# CODE BRIEF. Two defects found by the desk's walk of 5e22d03, and N.142 step 2's count

**Written by the desk 2026-09-24 15:20. For Claude Code, in `~/Desktop/ilya-rewrite` on branch `Shane`. Run AFTER `brief-code-meter-provenance_r1_2026-09-24.md`.** House rules: no git writes, gates before and after, Canadian spelling, no em dashes, `WRITTEN` is not `DONE`. **NOT ESTABLISHED beats a complete invented answer.**

The desk walked `5e22d03` in Dann's Chrome on the alias (read only), and the per-format walk on the sha deployment `ilya-4cm3cvf4k-dannmittons-projects.vercel.app` (an empty origin, so nothing of Dann's was touched). Four of five `5e22d03` checks passed: Cupid's Texte shows the score's words, the receipt reads « 1 ligne » with Replace and no Clear, Insights on Cupid prints all ten vowels, and Sunless 2 Markup shows 4/4 once at bar 1. `.mxl` and `.mscz` both arrived, filled the poem, and drew Markup.

## Defect 1. A valid MNX file is refused as "not an MNX score"

`~/Downloads/Sharp Excerpt.fin27.mnx` (87,483 bytes; top-level keys `global`, `layouts`, `mnx`, `parts`, `scores`; `"mnx": {"version": 4, ...}`) was refused on upload with `upload.err.jsonNotMnx`, "This JSON file is not an MNX score." **Cause, read by the desk:** `apps/web/src/lib/shane/ingestion/format-detection.ts:57` sets `SNIFF_LENGTH = 2048`, and `:196` looks for `"mnx"\s*:` only inside that head. In this file the `"mnx"` key starts at byte 7,702, because the keys are in alphabetical order. **This meets the freeze rule's exception:** Ilya tells a singer something false about a valid file.

**DESK DEFAULT:** when a JSON head lacks the key, parse the whole file and check the top level for an `mnx` object before refusing. Keep the fast path. Add a test with the key past 2,048 bytes. Then upload this file and say what Markup shows.

## Defect 2. Insights page one overprints its foot on first render

Seen on the alias, French, Cupid (Kabalevsky T05), opened from the library then Aperçus: the vowel chart stayed on page one, and « Sans l'ambitus… » and « Ce qui est signalé… » printed over the footnote and the foot. The tab was visible (`document.hidden` false). Switching Texte and back did not fix it. Switching to English and back to French did: the chart moved to page two and the page fit. **This is the caveat in your own memo** (`memo-code-vowel-chart-all-ten_r1_2026-09-24.md`, first render 74.8 px past the foot until a language switch), now confirmed on a visible tab. **Find why the fit does not re-measure when a song opens or its content changes, fix it, and show page one fitting on first render for Cupid and Sunless 1, both languages.**

## N.142 step 2. The count

`docs/memory/OWED.md`: whether any song in Dann's library holds a placement on a tie's continuation. You imported his export this morning. Using `~/Downloads/Ilya, September 21, 2026.ilya`, parse each song's score with the tree's own parsers and `syllableTargetIds` (`apps/web/src/lib/shane/pairings.ts`), and count, per song, stored placements whose event id is a tie continuation (present in the non-rest list, absent from the targets). **Read only; change nothing.** Report the per-song counts. If every count is zero, say so: step 2 then builds nothing.

## Not walked by the desk, for the record

The PDF path reached the reader: it read the clef as treble and the key as two sharps from the Lamm scan, then sat at "Reading the page…" for over a minute while the extension's tab was in the background (`ENVIRONMENT.md`, the hidden-tab entry). Whether it completes is NOT ESTABLISHED. No phone photograph of a score has been found.

## Return

A memo of at most 300 words with a section headed "NOT ESTABLISHED", saved as `docs/sessions/memo-code-afternoon-findings_r1_2026-09-24.md`. Stop before shipping.
