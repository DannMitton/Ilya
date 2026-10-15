# Brief: QUEUE rows 90 and 94, ratified lines into the Guide and Insights (r1)

Desk (Opus 5.5), 2026-10-14 about 16:50. For Code (cloud lane, Sonnet), on `Shane` at `db7fc43` or later. Fable review owed before it is sent (`CONTRACT.md` §1 item 19). Copy every string byte for byte; typographic apostrophes as the surrounding strings use them.

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
