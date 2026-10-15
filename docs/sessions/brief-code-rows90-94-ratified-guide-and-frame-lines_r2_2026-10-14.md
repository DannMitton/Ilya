# Brief: QUEUE rows 90 and 94, ratified lines into the Guide and Insights (r2)

Desk (Opus 5.5), 2026-10-14 about 16:50. For Code (cloud lane, Sonnet), on `Shane` at `db7fc43` or later. r2 2026-10-14 about 22:00: Fable reviewed (`review-fable-briefs-95-90-94-97_r1_2026-10-14.md`, SEND WITH AMENDMENTS); its amendments below are part of this brief and override any line above they contradict. Copy every string byte for byte; typographic apostrophes as the surrounding strings use them.

## 1. Row 90 (a): two lines in the French Guide's conventions list

RATIFIED by Dann 2026-10-12 20:30 (*"I ratify both."*); source `docs/sessions/draft-french-owed_r1_2026-10-12.md`, section C, items 1 and 3. Seat both in the French conventions list that row 67 built (`apps/web/src/lib/components/Reading/GuideContent.svelte:283`, the comment "QUEUE row 67: the conventions Ilya’s French follows"), in the list's existing form:
- « Le féminin en premier : l'OQLF laisse l'ordre libre et recommande de placer le masculin le plus près de l'adjectif qui s'accorde; Ilya place donc le féminin en premier. »
- « Références : selon la notice bibliographique de l'OQLF (lieu, éditeur, année). »
If the list links each authority, link the OQLF pages: https://vitrinelinguistique.oqlf.gouv.qc.ca/23991/ (doublet order) and https://vitrinelinguistique.oqlf.gouv.qc.ca/23245/ (bibliographic notice). The English Guide has no counterpart list unless the tree shows one; report what you find and add no English.

## 2. Row 90 (b): the Insights frame line loses one clause

AMENDED by Dann 2026-10-12 20:55 (`docs/memory/OPEN.md`, "INSIGHTS' FRAME LINE REWRITTEN", the amendment). `insights.r2.frame` (`apps/web/src/lib/i18n.ts:1742`): the first sentence becomes
- EN: "Ilya’s advice is drawn from the intersection of your voice as you calibrate and describe it, and the demands of the music you are investigating."
- FR: « Les conseils d’Ilya sont tirés de la rencontre entre votre voix, telle que vous la calibrez et la décrivez, et les exigences de la musique que vous étudiez. »
The second and third sentences stay as they are. Update the pins in `apps/web/src/lib/insights/ratified-lines.test.ts:10-21` to the new text.

## 3. Row 94: the Guide statement on the teacher as intermediary

RATIFIED by Dann 2026-10-13 23:11 (English) and 23:14 (French, and English aligned to it); source `~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/draft-musical-analysis-module_r1_2026-10-13.md`, lines 162 to 168. Seat it in the Guide near the Insights section (DESK DEFAULT; Code chooses the exact place and reports it), English in the English Guide, French in the French Guide, as one paragraph each:
- EN: "Ilya's advice gathers what a wide range of established singing voice pedagogy literature says about the conditions it finds in a piece and in your voice. Without a teacher in the conversation, that advice can mislead you, or not suit your voice. Bring anything Ilya offers about technique to your voice teacher. Ilya is made to work in partnership with a teacher's informed ear."
- FR: « Les conseils d'Ilya rassemblent ce qu'un large éventail de la littérature établie en pédagogie du chant dit des conditions qu'il relève dans une pièce et dans votre voix. Sans professeure ou professeur de chant dans la conversation, ces conseils peuvent vous induire en erreur, ou ne pas convenir à votre voix. Discutez de tout ce qu'Ilya propose sur la technique avec votre professeure ou professeur de chant. Ilya est conçu pour travailler en partenariat avec l'oreille avertie d'une professeure ou d'un professeur. »
The source writes straight apostrophes; use the apostrophe form the surrounding Guide text uses, and say which.

## Tests

Pin each new or changed string, in both languages where both exist, in the style of `ratified-lines.test.ts`.

## Constraints

- Change no other wording. Do not edit `docs/memory/`.
- Note, do not fix: the Guide's Markup conventions paragraph (`GuideContent.svelte:74` and `:361`) still says "Fit", "sage" noteheads, and "A red rounded box marks an fR1/fo crossing"; that paragraph belongs to N.84's rewrite and to the red squircle definition ruled 2026-10-14 (`PRODUCT.md`). List it under "Found, not fixed".
- Run all eight gates before and after; report counts and the files that moved them.

## Report

`docs/sessions/report-code-rows90-94_r1_2026-10-14.md`: the answer in three lines; where each line was seated (`path:line`); each string as built, quoted from the tree; the tests; the gates; found, not fixed; what could not be established. NOT ESTABLISHED beats a complete invented answer.


## Amendments from Fable's review, binding

5. Section 1, line 7 to 10. Replace "in the list's existing form" with the form itself: "as new `<li>` items in the `<ul>` at `GuideContent.svelte:284-290`, in that list's form: U+00A0 (written `&#160;`) before each colon, typographic apostrophes (« l’OQLF », « l’ordre », « l’adjectif », « s’accorde »), `<em>Ilya</em>`, and the OQLF linked with `<a href="…" target="_blank" rel="noopener">` as `:285` does. The words stay as ratified." Reason: the brief's "byte for byte" and "typographic apostrophes" conflict with each other and with the OQLF spacing gate (`i18n.test.ts:111`, `:141-153`), which fails on the ratified lines' ASCII space before each colon.

6. Section 1. Say where item 1 sits relative to « Noms de personnes » (`:287`), which already says « le féminin en premier » without its source. Recommendation (reversible, the desk's call): seat item 1 as the sentence after `:287`'s existing text inside the same `<li>`, and item 3 as a new `<li>` after « Plis vocaux » (`:289`). Reason: two items on one convention read as duplication; the ratified words are unchanged either way.

7. Section 1, line 10. Replace "If the list links each authority" with "The list links each authority (`:285`, `:286`, `:288`, `:289`); link both OQLF pages the same way." And replace "The English Guide has no counterpart list unless the tree shows one" with "The English Guide's counterpart is one paragraph, `:570`, not a list; add no English." Reason: both facts are in the tree; Code need not hunt.

8. Section 2, line 17. Change `ratified-lines.test.ts:10-21` to `:10-19`. Reason: lines 20 to 27 pin teacher A and C, which do not change.

9. Section 3, line 21, "near the Insights section". The Guide has no Insights section. Replace with: "as a new paragraph directly after paragraph A (the paragraph under the heading `guide-markup-forecast`, `GuideContent.svelte:346-347` EN, `:59-61` FR), after row 97 has replaced that paragraph." Reason: `grep` of the Guide's shown text finds "Insights" only in that heading; paragraph A is the one that speaks of Ilya's forecast and the teacher, so the teacher paragraph belongs beside it.

10. Section 3, line 24, "use the apostrophe form the surrounding Guide text uses". The Guide is mixed (FR branch: 118 typographic, 194 straight; EN branch: 58 typographic, 41 straight). Replace with: "typographic (U+2019), matching `:564` and `:277`, which is also what the new paragraphs of row 97 use." Reason: an instruction that depends on a mixed neighbourhood gives Code no rule. Also add: "French colons, if any are introduced, take U+00A0 before them (`i18n.test.ts:111`)." The ratified teacher paragraph has none, so this is a guard only.

11. Constraints, line 33, "Note, do not fix: the Guide's Markup conventions paragraph (`:74` and `:361`)". Brief 3 §1 replaces that paragraph (B). Make the item conditional: "If row 97 has not yet replaced it, list it under Found, not fixed; if it has, omit." Reason: run in sequence after brief 3, the item would be false.

12. Section 3, line 21. Add: "The source file is on Dann's Mac and not in the repository; the text above is your copy, verified by Fable against it on 2026-10-14." Reason: Code in the cloud lane cannot open `~/Documents/…`, and the brief's report asks it to quote "from the tree".

## Running order (from the review)

Files two briefs both edit:
- `apps/web/src/lib/i18n.ts`: brief 1 (`:1021`, `:1353`, one new key), brief 2 (`:1742`), brief 3 (`:255` and `:256` if removed). No two touch the same key; line numbers shift after brief 1 inserts a key.
- `apps/web/src/lib/components/Reading/GuideContent.svelte`: brief 2 (§1 adds to the list at `:284-290`; §3 adds a paragraph after `:347` and `:61`) and brief 3 (§1 replaces `:347`, `:361`, `:564`, `:61`, `:74`, `:277`). Brief 2 §1 adds lines before `:347`, so brief 3's English line numbers move by that count.

Order: brief 1, then brief 3, then brief 2. Brief 2 §3 seats the teacher paragraph beside paragraph A, which must already be the ratified text (amendment 9), and brief 2's "Found, not fixed" item (amendment 11) is resolved by brief 3. Brief 1 is independent. Tests do not collide: brief 2 edits `ratified-lines.test.ts`; briefs 1 and 3 add new files. All three say "Run all eight gates before and after"; in one session the "before" is the session's first run and each brief's "after" is the next brief's "before", which the reports can say.
