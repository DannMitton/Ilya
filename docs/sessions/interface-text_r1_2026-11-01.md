# Ilya's interface text: how Ilya names and presents its own parts to a singer

Draft r1, 2026-11-01, written by the desk (Opus) for Dann's ratification and Fable's review. Asked for by Dann 2026-11-01 13:26: "a reasonable, logical, and helpful style guide that governs how we present user-facing text." Built from the consistency audit (`docs/sessions/report-desk-consistency-audit_r1_2026-11-01.md`, sections A2.1 to A2.6) and Dann's rulings of 2026-10-31 and 2026-11-01. `SKILL.md` keeps the house style for all writing (Canadian spelling, Oxford comma, no em dashes, voice, tense); this page adds what is particular to text a singer reads inside Ilya. Each convention carries its reason; a convention without a reason a singer would recognise does not belong here.

## 1. Scope

Everything a singer reads: every interface string (`apps/web/src/lib/i18n.ts`), every message Ilya shows, the GUIDE, LEARN, and the printed pages, in English and French. Not code comments or the contributors' legend; those follow `code-conventions_r1_2026-11-01.md`.

## 2. One term per concept, in both languages

**Rule.** Each part of Ilya has one name in English and one in French, and the two match one to one. A synonym is a second thing to a reader. **Reason:** a singer who meets two names looks for two things (the audit found the spot controls under three French names, A2.1).

**The record.** `apps/web/src/lib/names.ts` (consistency batch 1) holds every name, read through its i18n key. The table below is its human summary; where they differ, `names.ts` wins and the table is corrected.

| concept | English | French | gender in French |
|---|---|---|---|
| the transcription document | TEXT | TEXTE | m. |
| the score document | MELODY | CHANT | m. |
| the analysis document | INSIGHTS | APERÇUS | m. pl. |
| lessons | LEARN | LEÇONS | f. pl. |
| help | GUIDE | GUIDE | m. |
| the band where text is entered | INPUT | ENTRÉE | f. |
| the published text field | POEM | POÈME | m. |
| the sung text field | LYRICS | PAROLES | f. pl. |
| the magnifier over a note | LOUPE | LOUPE | f. |
| the LOUPE's editing station | CORRECTIONS | CORRECTIONS | f. pl. |
| the drawer | the drawer | le tiroir | m. |
| a syllable's place under a note | placement | placement | m. |
| spot controls | Spot reduction, Spot reconstitution | Réduction ponctuelle, Reconstitution ponctuelle | f. |

Open, for Dann (French, flagged by the audit): the LOUPE's lyric station reads "Lyric" / « Texte », which collides with TEXTE; the storage messages say "syllable placements" / « Vos syllabes »; `a11y.drawer` names the drawer "Controls" / « Commandes ». Each needs one ruling and a row.

## 3. Named places in capitals

**Rule.** The name of a place in Ilya is written in capitals wherever a singer reads it: the five tabs, INPUT and its fields POEM and LYRICS, the LOUPE and its stations, and the drawer's named sections. French keeps every accent, cedilla, and tréma on capitals (OQLF, Vitrine linguistique, « Accents, trémas et cédilles aux lettres majuscules »). **Reason (Dann 2026-11-01 12:19 and 13:26):** capitals set the place apart from the ordinary word: open TEXT, but read the text; type in LYRICS, but sing the lyrics. A singer and a coder can both find every mention at a glance.

**What counts as a place:** something on screen with a visible name the singer goes to: a tab, a band, a field, a station, a drawer section. Not a button (see 4), not a mark on the page, not the page itself (call it "the page", never "the Paper").

**Legibility, the condition Dann set (13:26).** Capitals mark the name only, never a phrase around it. Articles, prepositions, and possessives stay lower case: "in the LOUPE", « dans le CHANT », « les APERÇUS ». Avoid the possessive on a place name ("TEXT's line"); rewrite ("the line on TEXT"). Never pluralize a place name. In French, articles and adjectives agree with the noun's gender in the table above (« la LOUPE », « les PAROLES », « le CHANT »). Where a heading is already set in capitals, nothing changes. Where capitals would make a sentence hard to read, the sentence is rewritten, not the rule dropped.

## 4. Controls, messages, terms, and steps

Kept from the ruling of 2026-10-31 (`SKILL.md`, "Interface text that singers read"), with places now in capitals instead of bold:
- **A button** is named by its exact label, in bold inside an outline chip drawn like Ilya's own buttons. **Reason:** the singer matches shape and words to what is on screen.
- **A message Ilya shows** is quoted exactly, in quotation marks (« » in French). **Reason:** the singer can match it letter for letter.
- **A term defined on first use** is italic, once. **A foreign term** in English is italic everywhere, as the French sets it (*zona di passaggio*; Dann 12:22).
- **A directive** is a plain numbered step, one action per step, the condition before the action.
These apply where they help a singer find the way, never as decoration.

## 5. Musician's words, not the machine's

A string speaks the notation: a bar, a note, a dotted half, your score (`CONTRACT.md` §3 tether 22, Dann 2026-10-08). Never a flag, a token, a reading, a seat. Pitches name the letter and the octave index in both languages (A4, C4; Dann 2026-10-11). « plis vocaux », never « cordes vocales ».

## 6. Where text lives

Every interface string lives in `i18n.ts` and is read through its key; no label is typed into a component as a language choice. **Reason:** one place to change a name, and the tests can see it (the audit found 117 typed labels, A2.2; batch 1 moves them). The GUIDE and LEARN keep their prose in their components, but every control or place they name uses the term in section 2.

## 7. French

French follows `CONTRACT.md` §7: OQLF spacing, the feminine-first pair for a person (« votre professeure ou professeur ») or a neutral wording, and Dann rules every French string before it reaches `Shane`. The desk drafts each with a recommendation and its reason.

## 8. How the rules are kept

Tests enforce what a test can see: no retired name in any string a singer reads (`retired-names.test.ts`, row 171); no i18n key without a reader (an allow-list that shrinks); every control the GUIDE names matches a drawn label. A rule no test can check is checked in review.
