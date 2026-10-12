# Brief for Code: row 78a, the ratified strings (r2, 2026-10-11)

QUEUE row 78a. For the cloud lane, Sonnet. Written by the desk (Opus) 2026-10-11 about 19:55 as row 78 r1; split into three by the desk at about 23:05 on Fable's review (`docs/sessions/review-fable-briefs-78-80_r1_2026-10-11.md`), with its amendments applied. Rulings: `docs/memory/OPEN.md`, from "ROW 69's FRENCH AND THE WORD \"SUNG\"" to "`insights.r2.cycles` RATIFIED", 2026-10-11 19:42 to 21:52, and `docs/memory/PRODUCT.md`'s last sections. On `cloud-lane` (row 69 and row 34 are there, not yet in `Shane`). Citations read on `cloud-lane` at `b8b07f8`.

## 1. What was observed

Row 69's report (`report-code-placeholder-vowels-labelled_r1_2026-10-11.md`, "For Dann") and row 34's (`report-code-markup-crossing-squircle_r1_2026-10-11.md`), and Dann's walk of the alias at `8e74f39` on 2026-10-11 from 20:23. Dann's rulings on what he saw are in the files named above.

## 2. What is established, each with its `path:line` (read on `cloud-lane` at `b8b07f8`)

- `apps/web/src/lib/i18n.ts:1793-1794`: `placeholder.line.many` and `.one`; a comment above them says the French singular is DESK-DERIVED.
- `i18n.ts:1798-1800`: `placeholder.comment`, `placeholder.turns.one`, `.many`, under a PROPOSED comment.
- `i18n.ts:1834-1838`: `comment.working.where.above` and `.under` (with "sung" / « chanté »), and the two `…Placeholder` variants without it.
- Row 69's report names the code that chooses between them: `comment-text.ts:295-296`, `:341`, `:446-450`; `InsightsPane.svelte:233`; and the test in `comments.test.ts`.
- Every calibration reading is taken in fry: `i18n.ts:1168`, `calib.welcome.fryAnswer`.

## 3. The work

1. **Ratified, both languages: mark them so.** Replace the PROPOSED and DESK-DERIVED comments over `placeholder.line.one`, `placeholder.comment`, `placeholder.turns.one`, and `.many` with one comment: RATIFIED by Dann 2026-10-11 19:42 to 19:51, `OPEN.md`. Text unchanged except item 2. Also `apps/web/src/lib/analysis/placeholder-line.ts`, whose header (lines 9 to 10) and two doc comments (`placeholderCommentSentence`, `placeholderTurnsSentence`) say PROPOSED; they are RATIFIED.  *(r1 item 1)*
2. **`placeholder.comment` gains a second sentence**, verbatim:
   - en: `This finding rests on a placeholder value for {vowel}. To replace it with your own value, sample {vowel} in vocal fry.`
   - fr: `Ce constat repose sur une valeur par défaut pour la voyelle {vowel}. Pour obtenir votre propre valeur, échantillonnez {vowel} en friture vocale.`  *(r1 item 2)*
3. **"sung" leaves the frame for every vowel.** `comment.working.where.above` becomes `above the first resonance{fR1} of your [{vowel}]` / `au-dessus de la première résonance{fR1} de votre [{vowel}]`; `.under` becomes `a little under the first resonance{fR1} of your [{vowel}]` / `un peu en dessous de la première résonance{fR1} de votre [{vowel}]`. Remove the two `…Placeholder` keys and the code that chooses them, so one frame serves every vowel.  *(r1 item 3)*
4. **Tests.** In `comments.test.ts`, the placeholder test at `:428-439` asserts today that every non-placeholder frame DOES say "sung" (`:438`); invert it so no frame says "sung" or « chanté » for any vowel in either language. The four whole-frame pins at `:148`, `:152`, `:363`, and `:379` carry "chanté" or "sung" and must be re-pinned to the new frames. Pin item 2's strings character for character.  *(r1 item 4)*
5. **Markup's top line ends differently from Insights'** (Dann 20:06). Add Markup-only keys beside `placeholder.line.many` and `.one`, used by `MarkupPane.svelte` only; Insights keeps the existing keys. Text identical to the existing keys except the last sentence, verbatim:
   - many: en `Findings that rest on a placeholder are drawn hollow or dashed.`; fr `Les constats qui en dépendent sont tracés évidés ou en pointillé.`
   - one: en `Findings that rest on it are drawn hollow or dashed.`; fr `Les constats qui en dépendent sont tracés évidés ou en pointillé.`
   Pin all four Markup strings in `placeholder-line.test.ts`.  *(r1 item 8)*
6. **Insights' frame line is rewritten** (Dann 2026-10-11 21:21 and 21:27, `OPEN.md`, "INSIGHTS' FRAME LINE REWRITTEN"). Replace `insights.r2.frame` (`i18n.ts:1735` at `b8b07f8`) in both languages, verbatim, typographic apostrophes as given:
   - en: `Ilya’s advice, from technique building to transposition options, is drawn from the intersection of your voice as you calibrate and describe it, and the demands of the music you are investigating. Citations connect Ilya’s findings to specific voice pedagogy literature. Since a computer program cannot experience your actual singing, discuss anything Ilya suggests with your voice teacher.`
   - fr: `Les conseils d’Ilya, du travail technique aux options de transposition, sont tirés de la rencontre entre votre voix, telle que vous la calibrez et la décrivez, et les exigences de la musique que vous étudiez. Des citations relient les constats d’Ilya à des passages précis de la littérature en pédagogie du chant. Comme un logiciel ne peut pas percevoir votre chant réel, discutez des suggestions d’Ilya avec votre professeure ou professeur de chant.`
   Update its comment to cite the ratification. Pin both strings in a test.  *(r1 item 11)*
7. **`insights.r2.teacherA`** (Dann 21:32, `OPEN.md`): en `Discuss this approach with your voice teacher.`; fr `Discutez de cette approche lors de vos cours de chant.` Update its comment.  *(r1 item 12)*
8. **`insights.r2.teacherC`** (Dann 21:34, `OPEN.md`): en `Review these sources with your voice teacher, who can weigh in on which of them actually apply to your voice.`; fr `Passez ces sources en revue avec votre professeure ou professeur de chant, qui pourra donner son avis sur celles qui s’appliquent effectivement à votre voix.` Update its comment.  *(r1 item 13)*
9. **Bozeman 2025's publisher and ISBN** (supplied by Dann 2026-10-11 21:36; the ISBN's check digit verified by the desk). In `apps/web/src/lib/sources.ts`, entry `bozeman2025` (`:199-216` at `b8b07f8`): `publisher: 'Bloomsbury'`, `isbn: '979-8-7651-6228-6'`; `place: 'New York'` (supplied by Dann 21:37). Replace the NOT ESTABLISHED comment with the source of each value. If a test or the Guide's Sources section prints the entry, confirm it renders in both languages.  *(r1 item 14)*
10. **`comment.tap`** (Dann 21:40 and 21:51, `OPEN.md`): en `Further reading`; fr `Lectures complémentaires`. Update its comment and the test at `singer-blocks.test.ts:104` if it pins the old text.  *(r1 item 15)*
11. **`insights.r2.cycles`** (Dann 21:52, `OPEN.md`): en `Your vocal folds contact about {n} times as you sing this piece.`; fr `Vos plis vocaux entrent en contact environ {n} fois pendant que vous chantez cette pièce.`  *(r1 item 16)*
12. **No em dash in the running head** (`AGENTS.md`, "No em-dashes in user-facing copy"; found by the desk on Dann's walk of Markup page 2, 2026-10-11 21:58). `apps/web/src/lib/page-config.ts:205` joins the names and the title with ` \u2014 `. Replace it with ` | `, the pipe that already joins the names (Dann 2026-10-11 22:00: *"I really like the pipe, yes"*), so the head reads `MUSSORGSKY | GOLENISHCHEV-KUTUZOV | WITHIN FOUR WALLS`, update the comment at `:182`, and the test that pins the old string, `apps/web/src/lib/components/Paper/one-head-one-foot.test.ts:45`.  *(r1 item 17)*

## 4. The rulings this serves

Dann 2026-10-11 19:42 to 22:00, quoted in `OPEN.md` and `PRODUCT.md` at the headings each item names. Dann 2026-10-11 12:36 to 12:42, "STAND-INS ARE LABELLED", `OPEN.md`.

## 5. Constraints

Write no French that is not in this brief; use U+2019 apostrophes as given. Do not touch `tools/e16-harness/`, `third_party/homr-web/`, `apps/web/src/lib/omr/` (row 80 is measuring there on the Mac), or `docs/memory/` beyond this row's State. Other uses of "sung" in `i18n.ts` (for example `calib.roster.oNoteAria`, about the vowel as sung in Russian) are not in scope. **Displaces:** nothing.

## 6. Done when

A grep of `i18n.ts` finds no `…Placeholder` key and no "sung" in `comment.working.where.*`. Pictures: an Insights comment on a placeholder vowel in each language; the Insights frame line in each language; `insights.r2.cycles` in French at print width (whether it fits one line is NOT ESTABLISHED, `OPEN.md`); the running head on Markup page 2. The eight gates pass, with gate 4's and gate 5's counts and their moving tests named. `WRITTEN`; DONE is Dann's walk after the merge.

## 7. Report back

`docs/sessions/report-code-row78a_r1_2026-10-11.md`: what changed, with `path:line`; the pictures; the gates; and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Commit and push `cloud-lane` only (Dann's amendment of 2026-10-02 02:37, `CONTRACT.md` §5; it overrides `AGENTS.md`'s "no agent commits" for this lane only). Set row 78a's State and stop.
