# Brief for Code: row 69's strings settled, "sung" leaves the comment frame, and placeholder heads go hollow (r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 19:55. QUEUE row 78. For the cloud lane, Sonnet, after row 71, on `cloud-lane` (row 69 is there, not yet in `Shane`). Small. The rulings are in `docs/memory/OPEN.md`, "ROW 69's FRENCH AND THE WORD \"SUNG\"", 2026-10-11 19:42 to 19:51.

## 1. What was observed

Row 69's report (`report-code-placeholder-vowels-labelled_r1_2026-10-11.md`, "For Dann") left five strings PROPOSED and the French singular of the top line desk-derived. Dann ruled on all of them 19:42 to 19:51. He also said the vowels are intoned in fry, not sung (19:42), so "your sung [ɑ]" is untrue for every vowel, sampled or not.

## 2. What is established, each with its `path:line` (read on `cloud-lane` at `b8b07f8`)

- `apps/web/src/lib/i18n.ts:1793-1794`: `placeholder.line.many` and `.one`; a comment above them says the French singular is DESK-DERIVED.
- `i18n.ts:1798-1800`: `placeholder.comment`, `placeholder.turns.one`, `.many`, under a PROPOSED comment.
- `i18n.ts:1834-1838`: `comment.working.where.above` and `.under` (with "sung" / « chanté »), and the two `…Placeholder` variants without it.
- Row 69's report names the code that chooses between them: `comment-text.ts:295-296`, `:341`, `:446-450`; `InsightsPane.svelte:233`; and the test in `comments.test.ts`.
- Every calibration reading is taken in fry: `i18n.ts:1168`, `calib.welcome.fryAnswer`.

## 3. The work

1. **Ratified, both languages: mark them so.** Replace the PROPOSED and DESK-DERIVED comments over `placeholder.line.one`, `placeholder.comment`, `placeholder.turns.one`, and `.many` with one comment: RATIFIED by Dann 2026-10-11 19:42 to 19:51, `OPEN.md`. Text unchanged except item 2.
2. **`placeholder.comment` gains a second sentence**, verbatim:
   - en: `This finding rests on a placeholder value for {vowel}. To replace it with your own value, sample {vowel} in vocal fry.`
   - fr: `Ce constat repose sur une valeur par défaut pour la voyelle {vowel}. Pour obtenir votre propre valeur, échantillonnez {vowel} en friture vocale.`
3. **"sung" leaves the frame for every vowel.** `comment.working.where.above` becomes `above the first resonance{fR1} of your [{vowel}]` / `au-dessus de la première résonance{fR1} de votre [{vowel}]`; `.under` becomes `a little under the first resonance{fR1} of your [{vowel}]` / `un peu en dessous de la première résonance{fR1} de votre [{vowel}]`. Remove the two `…Placeholder` keys and the code that chooses them, so one frame serves every vowel.
4. **Tests.** The placeholder test in `comments.test.ts` becomes: no frame says "sung" or « chanté » for any vowel, in either language. Pin item 2's strings character for character.

5. **Placeholder turning noteheads are hollow, not dashed** (Dann 2026-10-11 19:56, `OPEN.md`, "PLACEHOLDER TURNING NOTES ARE HOLLOW"). Where row 69 draws a turning notehead as a dashed outline, draw a hollow circle in lavender, solid stroke, stemless (Dann 20:03 to 20:04, `OPEN.md`, the AMENDED line under "PLACEHOLDER TURNING NOTES ARE HOLLOW"). Its diameter is the height of the font's half-note head (SMuFL `noteheadHalf`, read from the font's bounding box; in primitive mode, the filled head's height), so it sits on a line or in a space as a head does. Its stroke: measure the half-note head's rim at its thickest and thinnest from the glyph, draw the circle at both and at their mean, and send one picture of the three side by side at stave size and at 3x; build with the mean unless the picture shows it too light or too heavy, and say which you chose. Centred where the head would be. Its ledger lines and accidental are solid lavender. The crossing squircle, the Insights comment's rule, and the vowel figure's bars keep their dashes. Keep `data-placeholder="true"` on the head.
6. **Two legend entries on Markup**, after the stems entries, in `apps/web/src/lib/markup/legend.ts` beside `MARKUP_STEMS_COPY`, each drawn with its head in lavender (`--lavender`, #9585A2) before the words, as the stems entries draw their glyphs. Verbatim:
   - filled head: en `= the pitch where this vowel turns, from your voice`; fr `= la hauteur où cette voyelle change de timbre, d’après votre voix`
   - hollow head: en `= the same, from a placeholder value`; fr `= la même, d’après une valeur par défaut`
   The hollow entry shows only when the page draws at least one hollow head (DESK DEFAULT). The comment above them: RATIFIED by Dann 2026-10-11 20:01.
7. Tests for 5 and 6: a placeholder turning head is a hollow circle of the half-note head's height, with no dash; a sampled one is filled; the legend carries the hollow entry only when a placeholder is drawn. One picture of Markup page 1 in each language with both entries showing.
8. **Markup's top line ends differently from Insights'** (Dann 20:06). Add Markup-only keys beside `placeholder.line.many` and `.one`, used by `MarkupPane.svelte` only; Insights keeps the existing keys. Text identical to the existing keys except the last sentence, verbatim:
   - many: en `Findings that rest on a placeholder are drawn hollow or dashed.`; fr `Les constats qui en dépendent sont tracés évidés ou en pointillé.`
   - one: en `Findings that rest on it are drawn hollow or dashed.`; fr `Les constats qui en dépendent sont tracés évidés ou en pointillé.`
   Pin all four Markup strings in `placeholder-line.test.ts`.
9. **The red crossing ring stands outside the selection ring, always** (Dann 20:11 to 20:12, `OPEN.md`, "THE RED CROSSING RING STANDS OUTSIDE THE SELECTION RING"). In `apps/web/src/lib/score/crossing-ring.ts`, grow the box `ringBox` returns by `RING_STROKE` plus a gap of `RING_STROKE` on every side before drawing the red ring; keep the corner proportion the selection ring uses. The selection ring is unchanged. Measure on the live page: the red ring's box inside the system's viewBox on every crossing of *Without Sun*, no. 1 and of the Tchaikovsky song (if one clips, widen the viewBox for that system and say by how much); and one picture each of a crossing unselected and selected, desktop and phone, both rings visible when selected. Update `crossing-ring.test.ts`.
10. **The notes make room for the red ring** (Dann 20:14, `OPEN.md`, same heading as item 9). The renderer knows which events cross before layout (`AnalyzedEvent.crossing`, `packages/score-parser/src/analysis-types.ts:196`). In `columnAdvance` (`staff-renderer.ts`, the ink term at about `:1599-1604`), when the previous or the next column is a crossing, add the red ring's reach beyond that column's ink (item 9's margin, plus the ring's own padding beyond the ink as `ringBox` draws it, plus half its stroke) to the clearance, so the ring meets no neighbour's ink. Share the numbers from one place rather than copying them: if `ringBox`'s padding lives only in `apps/web/src/lib/score/selection-ring.ts`, move the constants to `@ilya/score-parser` and import them in both. Widen the system's viewBox where the ring would reach past it. Nothing changes for a song with no crossing (the approved SVGs without one stay byte for byte). Measure on the live page: on every crossing of *Without Sun*, no. 1 and the Tchaikovsky song, the gap between the red ring and the nearest neighbouring ink, before and after; the line count per page before and after. Same pictures as item 9.
11. **Insights' frame line is rewritten** (Dann 2026-10-11 21:21 and 21:27, `OPEN.md`, "INSIGHTS' FRAME LINE REWRITTEN"). Replace `insights.r2.frame` (`i18n.ts:1735` at `b8b07f8`) in both languages, verbatim, typographic apostrophes as given:
   - en: `Ilya’s advice, from technique building to transposition options, is drawn from the intersection of your voice as you calibrate and describe it, and the demands of the music you are investigating. Citations connect Ilya’s findings to specific voice pedagogy literature. Since a computer program cannot experience your actual singing, discuss anything Ilya suggests with your voice teacher.`
   - fr: `Les conseils d’Ilya, du travail technique aux options de transposition, sont tirés de la rencontre entre votre voix, telle que vous la calibrez et la décrivez, et les exigences de la musique que vous étudiez. Des citations relient les constats d’Ilya à des passages précis de la littérature en pédagogie du chant. Comme un logiciel ne peut pas percevoir votre chant réel, discutez des suggestions d’Ilya avec votre professeure ou professeur de chant.`
   Update its comment to cite the ratification. Pin both strings in a test.
12. **`insights.r2.teacherA`** (Dann 21:32, `OPEN.md`): en `Discuss this approach with your voice teacher.`; fr `Discutez de cette approche lors de vos cours de chant.` Update its comment.
13. **`insights.r2.teacherC`** (Dann 21:34, `OPEN.md`): en `Review these sources with your voice teacher, who can weigh in on which of them actually apply to your voice.`; fr `Passez ces sources en revue avec votre professeure ou professeur de chant, qui pourra donner son avis sur celles qui s’appliquent effectivement à votre voix.` Update its comment.
14. **Bozeman 2025's publisher and ISBN** (supplied by Dann 2026-10-11 21:36; the ISBN's check digit verified by the desk). In `apps/web/src/lib/sources.ts`, entry `bozeman2025` (`:199-216` at `b8b07f8`): `publisher: 'Bloomsbury'`, `isbn: '979-8-7651-6228-6'`; `place: 'New York'` (supplied by Dann 21:37). Replace the NOT ESTABLISHED comment with the source of each value. If a test or the Guide's Sources section prints the entry, confirm it renders in both languages.
15. **`comment.tap`** (Dann 21:40 and 21:51, `OPEN.md`): en `Further reading`; fr `Lectures complémentaires`. Update its comment and the test at `singer-blocks.test.ts:104` if it pins the old text.
16. **`insights.r2.cycles`** (Dann 21:52, `OPEN.md`): en `Your vocal folds contact about {n} times as you sing this piece.`; fr `Vos plis vocaux entrent en contact environ {n} fois pendant que vous chantez cette pièce.`
17. **No em dash in the running head** (`AGENTS.md`, "No em-dashes in user-facing copy"; found by the desk on Dann's walk of Markup page 2, 2026-10-11 21:58). `apps/web/src/lib/page-config.ts:204` joins the names and the title with ` \u2014 `. Replace it with ` | `, the pipe that already joins the names (Dann 2026-10-11 22:00: *"I really like the pipe, yes"*), so the head reads `MUSSORGSKY | GOLENISHCHEV-KUTUZOV | WITHIN FOUR WALLS`, update the comment at `:181`, and every test that pins the old string.

## 4. The rulings this serves

Dann 2026-10-11 19:42, 19:47, 19:48, 19:49, 19:51, quoted in `OPEN.md` at the heading named in the opening line. Dann 2026-10-11 12:36 to 12:42, "STAND-INS ARE LABELLED", same file.

## 5. Constraints

Write no French that is not in this brief. Typographic apostrophes (U+2019) where the spelling test asks for them. Do not touch `tools/e16-harness/`, `third_party/homr-web/`, `apps/web/src/lib/omr/` (row 77 is working there on the Mac), or `docs/memory/` beyond row 78's State. Other uses of "sung" in `i18n.ts` (for example `calib.roster.oNoteAria`, about the vowel as sung in Russian) are not in scope. **Displaces:** nothing.

## 6. Done when

The eight gates pass, with gate 4's count and its moving tests named; a grep of `i18n.ts` finds no `…Placeholder` key and no "sung" in `comment.working.where.*`; one picture of an Insights comment on a placeholder vowel in each language. `WRITTEN`; DONE is Dann's walk after the merge.

## 7. Report back

A section in `docs/sessions/report-code-placeholder-vowels-labelled_r1_2026-10-11.md` headed "Row 78": what changed, with `path:line`; the gates; and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Commit and push `cloud-lane` only. Set row 78's State and stop.
