# Brief: QUEUE row 97, the old name "Fit" leaves everything a singer reads (r2)

Desk (Opus 5.5), 2026-10-14 about 21:45. For Code (cloud lane, Sonnet), on `Shane` at `db7fc43` or later. r2 2026-10-14 about 22:00: Fable reviewed (`review-fable-briefs-95-90-94-97_r1_2026-10-14.md`, SEND WITH AMENDMENTS); its amendments below are part of this brief and override any line above they contradict. Dann 2026-10-14 16:39: *"Fit keeps cropping up and it needs to be rectified."* The names are ruled: Text, Markup, Insights (N.174, `PRODUCT.md`, "Naming, ruled"); French Texte, Annotation, Aperçus (`apps/web/src/lib/i18n.ts:186-201`).

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


## Amendments from Fable's review, binding

13. Done-when, line 5, "no string a singer can see … contains 'Fit'", and §4, line 21. Section 2 keeps the two captions at `GuideContent.svelte:381` and `:94`, which contain "Fit". As written the done-when cannot be met and the guard fails on first run. Amend both: "…contains 'Fit' as the tool's name, except the two `<figcaption>` elements at `:381` and `:94`, which §2 measures for a later row; the guard skips `<figcaption>` content and lists those two as its known exceptions, with their line numbers." Reason: internal contradiction between lines 5, 13, and 21.

14. Section 1, line 9. Add the French typographic rule: "French colons take U+00A0 before them, as `:61` and `:74` already do (the ratified file writes ASCII spaces; the gate at `i18n.test.ts:141-153` fails on them). Guillemets, if any, take U+00A0 inside." Reason: the ratified FR A and B carry « votre voix : où », « sémantique : hampe », « chantée : pleines » with ASCII spaces; the gate reads the French branch of this file.

15. Section 1, line 9, "Typographic apostrophes as the surrounding Guide text uses them; say which." Replace with a rule: "Typographic (U+2019) in all six paragraphs, as `:564` and `:277` already use; `:61`, `:74`, `:347`, and `:361` use straight marks and are being replaced." Reason: the neighbourhood is mixed (amendment 10's counts).

16. Section 1, line 9. Say how the ratified Markdown italics and bare names map to markup: "*Russian Lyric Diction*, *Ilya*, and *zona di passaggio* in `<em>`; *f*R1/*f*o as `<em>f</em><sub>R1</sub>/<em>f</em><sub>o</sub>` (`:361`); every other `Ilya` in A and B as `<em>Ilya</em>`, the Guide's body practice (`:564`, `:277`; 105 occurrences against 40 bare, the bare ones in headings, alt text, and biographies); Text, Markup, Insights, Texte, Annotation, Aperçus bare, as the headings at `:346`, `:359`, `:59`, `:72` write them; the EN A paragraph's 'zona di passaggio' stays roman, as `:347` has it, while FR A keeps `<em>` (the French gate at `french-italics.test.ts:109` requires it)." Reason: the ratified file marks italics with asterisks and leaves Ilya bare; Code would otherwise choose, and the French italics gate would fail on a roman « zona di passaggio ».

17. Section 2, line 13. Scope and method: (a) "each step's screen" names 15 pictures; limit §2 to `guide-step-01.webp` (caption `:381`, `:94`) and `guide-step-13.webp` (caption `:410`, `:123`), the two captions the row is about. (b) Replace "at the same viewport the old pictures used (read their pixel size)" with "read each old picture's pixel size and report it; set the viewport to that width divided by its device scale factor if the file is a 2x capture, and never below 1,440 px, because the desk layout needs at least 1,400 (`ENVIRONMENT.md:4393-4395`)." (c) Drop "beside a copy of each old picture"; the old pictures are already in the tree at `apps/web/static/guide/`, and committing copies adds binaries to `docs/sessions/`. Reason: a pixel size is not a viewport, the desk-layout threshold is a known trap, and the brief's scope is the two captions.

18. Section 3, line 17, "if none does, remove the key and say so." `IntakePanel.svelte:532-535` records N.145's decision to keep `input.transcribe` and `input.transcribeLoading` unused because "a ratified string is not this ship's to delete." Either (a) keep both keys, exempt them from the guard by name, and report them, or (b) remove both and rewrite that comment. Recommendation: (a), because the guard is case-sensitive and word-bounded on "Fit" and "Transcribe and fit" never trips it, so nothing is gained by deleting, and the N.145 record stays true. **The desk picks (a), DESK DEFAULT: keep both keys, exempt them from the guard by name, report them.** Whichever the desk picks, the brief must name `input.transcribeLoading` (`i18n.ts:256`) and the comment. Reason: as written the brief leaves a stale comment naming a removed key and departs from a recorded practice without saying so.

19. Section 4, line 21, "the rendered text of the Guide". Rendering a Svelte component under vitest is not how the tree's Guide tests work. Point Code at the precedent: "read `GuideContent.svelte` as `french-italics.test.ts:89-96` and `i18n.test.ts:141-153` do, strip `<!-- -->` comments, split at `{#if language === 'fr'}` and `{:else}`, strip `<figcaption>…</figcaption>` (amendment 13), and search the remainder for `/\bFit\b/`." Reason: comments in the file carry "Fit" (`:343`), and the two existing tests show the mechanism the gates already run.

20. Add to Constraints a "Found, not fixed" line: "The headings at `:346` and `:59` ('Insights forecasts, it does not declare' / « Les Aperçus prévoient, ils ne déclarent pas ») carry the line Dann struck from the statement on 2026-09-23 (`PRODUCT.md:213`) and again from paragraph A on 2026-10-14 (`OPEN.md:3057`). `PRODUCT.md:468` ruled this heading's wording on 2026-09-27. **SUPERSEDED by Dann 2026-10-14 21:57: replace both headings: EN "What Insights forecasts", FR « Ce que prévoient les Aperçus ». Keep the `id` attribute (`guide-markup-forecast`) so links still work; include both headings in the guard's check.**" Reason: brief 3 replaces the paragraph under that heading and says nothing about the heading; the desk brings the case to Dann.

21. Report, line 30. Add: "the pixel size of each old picture, and whether a cloud Playwright run could draw each screen (the reader's Pyodide cannot load there, `ENVIRONMENT.md:4552`)." Reason: NOT ESTABLISHED items need a named place in the report.

## Running order (from the review)

Files two briefs both edit:
- `apps/web/src/lib/i18n.ts`: brief 1 (`:1021`, `:1353`, one new key), brief 2 (`:1742`), brief 3 (`:255` and `:256` if removed). No two touch the same key; line numbers shift after brief 1 inserts a key.
- `apps/web/src/lib/components/Reading/GuideContent.svelte`: brief 2 (§1 adds to the list at `:284-290`; §3 adds a paragraph after `:347` and `:61`) and brief 3 (§1 replaces `:347`, `:361`, `:564`, `:61`, `:74`, `:277`). Brief 2 §1 adds lines before `:347`, so brief 3's English line numbers move by that count.

Order: brief 1, then brief 3, then brief 2. Brief 2 §3 seats the teacher paragraph beside paragraph A, which must already be the ratified text (amendment 9), and brief 2's "Found, not fixed" item (amendment 11) is resolved by brief 3. Brief 1 is independent. Tests do not collide: brief 2 edits `ratified-lines.test.ts`; briefs 1 and 3 add new files. All three say "Run all eight gates before and after"; in one session the "before" is the session's first run and each brief's "after" is the next brief's "before", which the reports can say.
