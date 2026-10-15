# Brief: QUEUE row 97, the old name "Fit" leaves everything a singer reads (r1)

Desk (Opus 5.5), 2026-10-14 about 21:45. For Code (cloud lane, Sonnet), on `Shane` at `db7fc43` or later. Fable review owed before it is sent (`CONTRACT.md` §1 item 19). Dann 2026-10-14 16:39: *"Fit keeps cropping up and it needs to be rectified."* The names are ruled: Text, Markup, Insights (N.174, `PRODUCT.md`, "Naming, ruled"); French Texte, Annotation, Aperçus (`apps/web/src/lib/i18n.ts:186-201`).

**Done when:** no string a singer can see, in English or French, on screen or in print, contains "Fit" as the tool's name; the three Guide passages read as ratified; a test fails if "Fit" returns to a user-facing string.

## 1. Seat the three ratified Guide passages

Text, both languages, in `docs/sessions/ratified-guide-abc_2026-10-14.md` (A, B, C), RATIFIED by Dann 2026-10-14 21:40. Replace each whole paragraph named there, byte for byte, keeping the existing `<em>` and `<sub>` markup for titles, *zona di passaggio*, and fR1/fo. Typographic apostrophes as the surrounding Guide text uses them; say which.

## 2. Measure, do not rewrite: the picture captions

`GuideContent.svelte:381` and `:94` ("The four tabs at the bottom navigate between Ilya's four areas: Transcription, Fit, Learn, and Guide") and `:410` and `:123` ("Return to the Transcription tab") describe screenshots of an older screen (`/guide/guide-step-*.webp`). Do not reword them. Instead: take a screenshot of each step's screen as the app draws it today at the same viewport the old pictures used (read their pixel size), save them to `docs/sessions/row97-guide-shots/` beside a copy of each old picture, and list, for each caption, every statement that no longer matches the screen. The desk drafts new captions from your list for Dann's ruling; that is a later row.

## 3. Find every other user-facing "Fit"

Search every string a singer can see: `apps/web/src/lib/i18n.ts` values, `GuideContent.svelte`, `LearnContent.svelte`, any `.svelte` markup text, `alt` attributes, `aria-label`s, and the PDF/print path. Code comments are history and stay. Report each hit with `path:line` and whether it is drawn. Known lead: `'input.transcribe'` (`i18n.ts:255`) reads "Transcribe and fit" in both languages; report whether any component draws it; if none does, remove the key and say so; if one does, report it and change nothing.

## 4. The guard

Add a test that fails if "Fit" (word-bounded, case-sensitive, also inside `<em>Fit</em>`) appears in any `i18n.ts` value or in the rendered text of the Guide in either language.

## Constraints

- Change no wording beyond step 1 and the dead key in step 3. Do not edit `docs/memory/`.
- Run all eight gates before and after; report counts and the files that moved them.

## Report

`docs/sessions/report-code-row97-fit-out-of-the-guide_r1_2026-10-14.md`: the answer in three lines; each passage as built, quoted from the tree; the caption table (caption, statement, what the screen shows now) with the picture paths; every other hit; the guard; the gates; what could not be established. NOT ESTABLISHED beats a complete invented answer.
