# Fable review: Code briefs for rows 95, 90 and 94, and 97 (r1, 2026-10-14)

Reviewed against the snapshot at `/home/claude/audit` (code identical to `db7fc43`). Every `path:line` below was read this session. Line numbers are at `db7fc43`.

## Verdicts

| Brief | Verdict |
|---|---|
| 1. Row 95, the words on a scan | SEND WITH AMENDMENTS (1 to 4) |
| 2. Rows 90 and 94, ratified Guide and frame lines | SEND WITH AMENDMENTS (5 to 12) |
| 3. Row 97, Fit out of the Guide | SEND WITH AMENDMENTS (13 to 21) |

No brief needs a rewrite. The ratified strings in all three match their sources character for character. The amendments are about typographic form the gates enforce, two internal contradictions in brief 3, one stale constraint in brief 2, and the order the three briefs run in.

## Citations checked

Brief 1
- `apps/web/src/lib/i18n.ts:1353` (`upload.banner.noLyrics`): CONFIRMED.
- `apps/web/src/lib/i18n.ts:1021` (`upload.banner.reader`): CONFIRMED. Its French uses typographic apostrophes (« d’une image », « de l’encre »).
- `apps/web/src/routes/+page.svelte:4458` (draws `noLyrics`, `.replace('%s', noLyricsFile)`): CONFIRMED. `noLyricsFile` is set at `+page.svelte:3204` from the `no-lyrics-found` warning (`:3203`).
- `CONTRACT.md` §1 item 19 (Fable review before Code): CONFIRMED at `docs/memory/CONTRACT.md:25`.

Brief 2
- `GuideContent.svelte:283` (row 67 comment): CONFIRMED. The list follows at `:284` to `:290` (`<p><strong>Langue.</strong> …</p>` then `<ul>` of five `<li>`).
- `i18n.ts:1742` (`insights.r2.frame`): CONFIRMED; typographic apostrophes.
- `ratified-lines.test.ts:10-21`: WRONG. The frame pins are `apps/web/src/lib/insights/ratified-lines.test.ts:10-19`. Lines 20 to 27 pin teacher A and C, which do not change.
- `GuideContent.svelte:74` and `:361` (Markup conventions paragraph with "Fit", "sage"/« sauge », red rounded box): CONFIRMED.
- `~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/draft-musical-analysis-module_r1_2026-10-13.md` lines 162 to 168: CONFIRMED against `/home/claude/audit/voicelib/draft-musical-analysis-module_r1_2026-10-13.md:162-168`. That file is on Dann's Mac, not in the repository; Code cannot read it. The brief's quotation is Code's only copy, and it is exact (see strings below).
- `docs/sessions/draft-french-owed_r1_2026-10-12.md` section C items 1 and 3: CONFIRMED (`:46` and `:48`).
- `OPEN.md` "INSIGHTS' FRAME LINE REWRITTEN", the amendment: CONFIRMED at `docs/memory/OPEN.md:2988`.

Brief 3
- `i18n.ts:186-201` (Texte, Annotation, Aperçus): CONFIRMED (`:186`, `:197`, `:201`).
- `i18n.ts:255` (`input.transcribe`, "Transcribe and fit" in both slots): CONFIRMED.
- `GuideContent.svelte:347`, `:61`, `:361`, `:74`, `:564`, `:277` (via `ratified-guide-abc_2026-10-14.md:3`): all CONFIRMED, each the paragraph named.
- `GuideContent.svelte:381` and `:94` (four tabs caption), `:410` and `:123` ("Return to the Transcription tab"): CONFIRMED. The pictures are `guide-step-01.webp` (`:380`, `:93`) and `guide-step-13.webp` (`:409`, `:122`).
- `PRODUCT.md` "Naming, ruled" (N.174): CONFIRMED at `docs/memory/PRODUCT.md:455-468`.

## Strings checked, character for character

- Brief 1, strings 1a, 1b, and 2, EN and FR: identical to `docs/memory/OPEN.md:3049-3051`. (OPEN.md names the brief as the text's home, so the two are one record; both carry straight apostrophes in « d'une syllabe ».)
- Brief 2 §1, both French lines: identical to `draft-french-owed_r1_2026-10-12.md:46` and `:48`, including the ASCII space before each colon and the straight apostrophes.
- Brief 2 §2, frame first sentence EN and FR: identical to `OPEN.md:2988`, typographic apostrophes.
- Brief 2 §3, teacher paragraph EN and FR: identical to `draft-musical-analysis-module_r1_2026-10-13.md:168` (EN, aligned) and `:167` (FR, final). Straight apostrophes, as the brief says.
- Brief 3 §1 points at `ratified-guide-abc_2026-10-14.md`, which I read in full. It carries no NBSP, no typographic apostrophe, and ASCII spaces before every French colon.

No string differs from its source. The differences that matter are between the sources and the file conventions the gates test, below.

## Executability

Brief 1, telling a scan from a file. The mechanism exists. `apps/web/src/lib/score/ingestion/ingest.ts:50-56` types `provenance` as a union, and its last member is `{ format: 'musicxml'; via: 'reader'; sourceFormat: 'pdf' | 'image' }`; the reader path sets `via: 'reader'` at `ingest.ts:227`. `ScoreUploader.svelte:912-913` already branches the fidelity banner on `ui.ingested.provenance` and draws `upload.banner.reader` when the tier is `'reader'` (`:993`). At `+page.svelte:3204` the same `ingested.provenance.via === 'reader'` is in scope. Brief 1 is executable as written.

Brief 2, the French conventions list. It exists at `GuideContent.svelte:284-290`, the form `<li><strong>Heading.</strong> body</li>`, each authority linked with `<a href="…" target="_blank" rel="noopener">`, U+00A0 written as `&#160;` before colons and inside guillemets, typographic apostrophes, and `<em>Ilya</em>`. The existing item « Noms de personnes » (`:287`) already states feminine-first order without a source. The English Guide has a one-paragraph "Language." counterpart at `:570`, not a list.

Brief 2, "the Insights section" of the Guide. There is none. "Insights" occurs once in the Guide's shown text, the heading at `:346` ("Insights forecasts, it does not declare"; FR `:59` « Les Aperçus prévoient, ils ne déclarent pas »), whose paragraph (`:347`, FR `:61`) is paragraph A that brief 3 replaces.

Brief 3, the pictures. The 39 files `apps/web/static/guide/guide-step-01.webp` to `-39.webp` are in the tree (`ls-files.txt:447-485`) and the Guide references 15 of them; the snapshot holds no binaries, so their pixel size is NOT ESTABLISHED here. Each `<img>` sets `width="1200"` (`:93`, `:380`), a display width, not the file's.

Brief 3, `input.transcribe`. Nothing draws it. The only reference outside `i18n.ts` is a comment at `apps/web/src/lib/components/Drawer/IntakePanel.svelte:532-535`, which records N.145 (2026-09-16): the button was removed and `input.transcribe` and `input.transcribeLoading` "stay in `i18n.ts`, unused … a ratified string is not this ship's to delete." `input.transcribeLoading` (`i18n.ts:256`) is also undrawn.

Brief 3, other user-facing "Fit". `i18n.ts` values: none (the one hit, `:84`, is a comment). `.svelte` shown text: only the six Guide paragraphs and the two captions at `GuideContent.svelte:381` and `:94`. `LearnContent.svelte`: none. `alt` attributes: none. E2E: none. Every other hit is a code comment.

Gates the new French must pass. `apps/web/src/lib/i18n.test.ts:101-160` reads the French branch of `GuideContent.svelte` (from `{#if language === 'fr'}` to `{:else}`) and every French `i18n.ts` value and fails on any colon not preceded by U+00A0 (`:111`), any « without U+00A0 after it, or any » without one before (`:112-113`). `apps/web/src/lib/french-italics.test.ts:89-110` reads the same French branch and requires Italian musical terms, *zona di passaggio* among them, in `<em>`.

## Amendments

### Brief 1 (row 95)

1. Line 25, "Copy each string byte for byte." Add: "French apostrophes are typographic (U+2019), as every French value in `i18n.ts` writes them (`:1021` « d’une image »); the ratified text's straight marks in « d'une syllabe » become ’. Words, punctuation, and spacing stay as ratified." Reason: the ratified French carries straight apostrophes inside what will be a single-quoted TypeScript string, and the file's French uses ’ throughout (96 occurrences, no escaped straight mark).

2. Line 30, "How the code tells a scan from a file is yours." Add the lead: "`ingested.provenance.via === 'reader'` (`apps/web/src/lib/score/ingestion/ingest.ts:56`, set at `:227`), the field `fidelityBanner` already reads at `ScoreUploader.svelte:912-913`." Reason: saves a search and keeps one mechanism for both banners.

3. Line 9, "A test pins … which arrival draws 1a or 1b." Add: "Put the choice of key in a pure function (for example in `apps/web/src/lib/score/`), test that function on a `provenance` with `via: 'reader'` and one with `via: 'direct'`, and cite the one call site in `+page.svelte`." Reason: `+page.svelte` is over 5,000 lines and runes are inert under vitest (`docs/memory/ENVIRONMENT.md:653`), so a test of the component itself would not test the choice.

4. Line 7, add after the `reader` citation: "drawn at `apps/web/src/lib/score/ScoreUploader.svelte:993`." Reason: completeness; the brief cites where `noLyrics` is drawn but not where `reader` is.

### Brief 2 (rows 90 and 94)

5. Section 1, line 7 to 10. Replace "in the list's existing form" with the form itself: "as new `<li>` items in the `<ul>` at `GuideContent.svelte:284-290`, in that list's form: U+00A0 (written `&#160;`) before each colon, typographic apostrophes (« l’OQLF », « l’ordre », « l’adjectif », « s’accorde »), `<em>Ilya</em>`, and the OQLF linked with `<a href="…" target="_blank" rel="noopener">` as `:285` does. The words stay as ratified." Reason: the brief's "byte for byte" and "typographic apostrophes" conflict with each other and with the OQLF spacing gate (`i18n.test.ts:111`, `:141-153`), which fails on the ratified lines' ASCII space before each colon.

6. Section 1. Say where item 1 sits relative to « Noms de personnes » (`:287`), which already says « le féminin en premier » without its source. Recommendation (reversible, the desk's call): seat item 1 as the sentence after `:287`'s existing text inside the same `<li>`, and item 3 as a new `<li>` after « Plis vocaux » (`:289`). Reason: two items on one convention read as duplication; the ratified words are unchanged either way.

7. Section 1, line 10. Replace "If the list links each authority" with "The list links each authority (`:285`, `:286`, `:288`, `:289`); link both OQLF pages the same way." And replace "The English Guide has no counterpart list unless the tree shows one" with "The English Guide's counterpart is one paragraph, `:570`, not a list; add no English." Reason: both facts are in the tree; Code need not hunt.

8. Section 2, line 17. Change `ratified-lines.test.ts:10-21` to `:10-19`. Reason: lines 20 to 27 pin teacher A and C, which do not change.

9. Section 3, line 21, "near the Insights section". The Guide has no Insights section. Replace with: "as a new paragraph directly after paragraph A (the paragraph under the heading `guide-markup-forecast`, `GuideContent.svelte:346-347` EN, `:59-61` FR), after row 97 has replaced that paragraph." Reason: `grep` of the Guide's shown text finds "Insights" only in that heading; paragraph A is the one that speaks of Ilya's forecast and the teacher, so the teacher paragraph belongs beside it.

10. Section 3, line 24, "use the apostrophe form the surrounding Guide text uses". The Guide is mixed (FR branch: 118 typographic, 194 straight; EN branch: 58 typographic, 41 straight). Replace with: "typographic (U+2019), matching `:564` and `:277`, which is also what the new paragraphs of row 97 use." Reason: an instruction that depends on a mixed neighbourhood gives Code no rule. Also add: "French colons, if any are introduced, take U+00A0 before them (`i18n.test.ts:111`)." The ratified teacher paragraph has none, so this is a guard only.

11. Constraints, line 33, "Note, do not fix: the Guide's Markup conventions paragraph (`:74` and `:361`)". Brief 3 §1 replaces that paragraph (B). Make the item conditional: "If row 97 has not yet replaced it, list it under Found, not fixed; if it has, omit." Reason: run in sequence after brief 3, the item would be false.

12. Section 3, line 21. Add: "The source file is on Dann's Mac and not in the repository; the text above is your copy, verified by Fable against it on 2026-10-14." Reason: Code in the cloud lane cannot open `~/Documents/…`, and the brief's report asks it to quote "from the tree".

### Brief 3 (row 97)

13. Done-when, line 5, "no string a singer can see … contains 'Fit'", and §4, line 21. Section 2 keeps the two captions at `GuideContent.svelte:381` and `:94`, which contain "Fit". As written the done-when cannot be met and the guard fails on first run. Amend both: "…contains 'Fit' as the tool's name, except the two `<figcaption>` elements at `:381` and `:94`, which §2 measures for a later row; the guard skips `<figcaption>` content and lists those two as its known exceptions, with their line numbers." Reason: internal contradiction between lines 5, 13, and 21.

14. Section 1, line 9. Add the French typographic rule: "French colons take U+00A0 before them, as `:61` and `:74` already do (the ratified file writes ASCII spaces; the gate at `i18n.test.ts:141-153` fails on them). Guillemets, if any, take U+00A0 inside." Reason: the ratified FR A and B carry « votre voix : où », « sémantique : hampe », « chantée : pleines » with ASCII spaces; the gate reads the French branch of this file.

15. Section 1, line 9, "Typographic apostrophes as the surrounding Guide text uses them; say which." Replace with a rule: "Typographic (U+2019) in all six paragraphs, as `:564` and `:277` already use; `:61`, `:74`, `:347`, and `:361` use straight marks and are being replaced." Reason: the neighbourhood is mixed (amendment 10's counts).

16. Section 1, line 9. Say how the ratified Markdown italics and bare names map to markup: "*Russian Lyric Diction*, *Ilya*, and *zona di passaggio* in `<em>`; *f*R1/*f*o as `<em>f</em><sub>R1</sub>/<em>f</em><sub>o</sub>` (`:361`); every other `Ilya` in A and B as `<em>Ilya</em>`, the Guide's body practice (`:564`, `:277`; 105 occurrences against 40 bare, the bare ones in headings, alt text, and biographies); Text, Markup, Insights, Texte, Annotation, Aperçus bare, as the headings at `:346`, `:359`, `:59`, `:72` write them; the EN A paragraph's 'zona di passaggio' stays roman, as `:347` has it, while FR A keeps `<em>` (the French gate at `french-italics.test.ts:109` requires it)." Reason: the ratified file marks italics with asterisks and leaves Ilya bare; Code would otherwise choose, and the French italics gate would fail on a roman « zona di passaggio ».

17. Section 2, line 13. Scope and method: (a) "each step's screen" names 15 pictures; limit §2 to `guide-step-01.webp` (caption `:381`, `:94`) and `guide-step-13.webp` (caption `:410`, `:123`), the two captions the row is about. (b) Replace "at the same viewport the old pictures used (read their pixel size)" with "read each old picture's pixel size and report it; set the viewport to that width divided by its device scale factor if the file is a 2x capture, and never below 1,440 px, because the desk layout needs at least 1,400 (`ENVIRONMENT.md:4393-4395`)." (c) Drop "beside a copy of each old picture"; the old pictures are already in the tree at `apps/web/static/guide/`, and committing copies adds binaries to `docs/sessions/`. Reason: a pixel size is not a viewport, the desk-layout threshold is a known trap, and the brief's scope is the two captions.

18. Section 3, line 17, "if none does, remove the key and say so." `IntakePanel.svelte:532-535` records N.145's decision to keep `input.transcribe` and `input.transcribeLoading` unused because "a ratified string is not this ship's to delete." Either (a) keep both keys, exempt them from the guard by name, and report them, or (b) remove both and rewrite that comment. Recommendation: (a), because the guard is case-sensitive and word-bounded on "Fit" and "Transcribe and fit" never trips it, so nothing is gained by deleting, and the N.145 record stays true. Whichever the desk picks, the brief must name `input.transcribeLoading` (`i18n.ts:256`) and the comment. Reason: as written the brief leaves a stale comment naming a removed key and departs from a recorded practice without saying so.

19. Section 4, line 21, "the rendered text of the Guide". Rendering a Svelte component under vitest is not how the tree's Guide tests work. Point Code at the precedent: "read `GuideContent.svelte` as `french-italics.test.ts:89-96` and `i18n.test.ts:141-153` do, strip `<!-- -->` comments, split at `{#if language === 'fr'}` and `{:else}`, strip `<figcaption>…</figcaption>` (amendment 13), and search the remainder for `/\bFit\b/`." Reason: comments in the file carry "Fit" (`:343`), and the two existing tests show the mechanism the gates already run.

20. Add to Constraints a "Found, not fixed" line: "The headings at `:346` and `:59` ('Insights forecasts, it does not declare' / « Les Aperçus prévoient, ils ne déclarent pas ») carry the line Dann struck from the statement on 2026-09-23 (`PRODUCT.md:213`) and again from paragraph A on 2026-10-14 (`OPEN.md:3057`). `PRODUCT.md:468` ruled this heading's wording on 2026-09-27. List it; change nothing." Reason: brief 3 replaces the paragraph under that heading and says nothing about the heading; the desk brings the case to Dann.

21. Report, line 30. Add: "the pixel size of each old picture, and whether a cloud Playwright run could draw each screen (the reader's Pyodide cannot load there, `ENVIRONMENT.md:4552`)." Reason: NOT ESTABLISHED items need a named place in the report.

## Running the three in one session

Files two briefs both edit:
- `apps/web/src/lib/i18n.ts`: brief 1 (`:1021`, `:1353`, one new key), brief 2 (`:1742`), brief 3 (`:255` and `:256` if removed). No two touch the same key; line numbers shift after brief 1 inserts a key.
- `apps/web/src/lib/components/Reading/GuideContent.svelte`: brief 2 (§1 adds to the list at `:284-290`; §3 adds a paragraph after `:347` and `:61`) and brief 3 (§1 replaces `:347`, `:361`, `:564`, `:61`, `:74`, `:277`). Brief 2 §1 adds lines before `:347`, so brief 3's English line numbers move by that count.

Order: brief 1, then brief 3, then brief 2. Brief 2 §3 seats the teacher paragraph beside paragraph A, which must already be the ratified text (amendment 9), and brief 2's "Found, not fixed" item (amendment 11) is resolved by brief 3. Brief 1 is independent. Tests do not collide: brief 2 edits `ratified-lines.test.ts`; briefs 1 and 3 add new files. All three say "Run all eight gates before and after"; in one session the "before" is the session's first run and each brief's "after" is the next brief's "before", which the reports can say.

## What I could not establish

- The pixel size of any `guide-step-*.webp`: the snapshot holds no binaries.
- Whether a cloud Playwright run can draw the Text screen with a score for `guide-step-13`; the reader's Pyodide is blocked there (`ENVIRONMENT.md:4552`), and the Text screen may not need it.
- Where the eight gates are enumerated for Code. `ENVIRONMENT.md:4551` says all eight run in a cloud clone and `AGENTS.md:27` names four; I found no list of eight in `AGENTS.md`, `README.md`, `CONTRACT.md`, or the partial `ENVIRONMENT.md` in the snapshot. Earlier cloud sessions ran them, so a list exists somewhere Code reads.
- Whether Dann's ruling on `input.transcribe` (N.145, "not this ship's to delete") still stands or was incidental; amendment 18 brings the case to the desk rather than deciding it.
- Whether `+page.svelte:3204` runs for a restored score (`origin === 'restore'`, `ScoreUploader.svelte:805`) so that a restored scan draws 1b; the handler looks shared, and the brief's test will show it.
