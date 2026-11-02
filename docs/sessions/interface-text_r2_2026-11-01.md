# Ilya's interface text: how Ilya names and presents its own parts to a singer

Draft r2, 2026-11-01 22:3x, written by the desk (Opus) for Dann's ratification. r2 applies Fable's twelve amendments (`docs/sessions/review-fable-style-guides_r1_2026-11-01.md`, Part 1) and Dann's rulings of 2026-11-01 (`docs/memory/INBOX.md`, 12:12 to 22:14). On ratification it becomes `docs/house-style/interface-text.md`. `SKILL.md` keeps the house style for all writing (Canadian spelling, Oxford comma, no em dashes, voice, tense); this page adds what is particular to text a singer reads inside Ilya. Each convention carries its reason. Where a rule describes the tree after a build that has not landed, it says which; the list of those is at the end.

## 1. Scope

Everything a singer reads: every interface string (`apps/web/src/lib/i18n.ts`), every message Ilya shows, the GUIDE, LEARN, and the printed pages, in English and French. Code comments and the contributors' legend follow `code-conventions_r2_2026-11-01.md`.

## 2. One term per concept, in both languages

**Rule.** Each part of Ilya has one name in English and one in French, matched one to one. **Reason:** a singer who meets two names looks for two things; the audit found one control under three French names.

**The record.** Until consistency batch 1 creates `apps/web/src/lib/names.ts`, the key column of this table is the record. After it, `names.ts` is, and this table is its summary for people.

| concept | key | English | French | gender | capitals |
|---|---|---|---|---|---|
| transcription document | `tab.text` | TEXT | TEXTE | m. | yes |
| score document | `tab.markedScore` (to be `tab.melody`) | MELODY | CHANT | m. | yes |
| analysis document | `tab.insights` | INSIGHTS | APERÇUS | m. pl. | yes |
| lessons | `tab.learn` | LEARN | LEÇONS | f. pl. | yes |
| help | `tab.guide` | GUIDE | GUIDE | m. | yes |
| the panel of controls | `drawer.pull` | DRAWER | TIROIR | m. | yes (Dann 22:12) |
| piece band | `group.piece` | PIECE | PIÈCE | f. | yes |
| voice band | `group.scoreMarkup` | VOICE | VOIX | f. | yes |
| input band | `group.input` | INPUT | ENTRÉE | f. | yes |
| published text field | `intake.view.poem` | POEM | POÈME | m. | yes |
| sung text field | `intake.view.lyrics` | LYRICS | PAROLES | f. pl. | yes |
| repertoire station | `songs.heading` | REPERTOIRE | RÉPERTOIRE | m. | yes |
| export station | `binder.heading` | EXPORT AND IMPORT | EXPORTATION ET IMPORTATION | f. | yes |
| notation station | `cosmetic.heading` | NOTATION | NOTATION | f. | yes |
| analysis station | `console.placeholder` | ANALYSIS | ANALYSE | f. | yes |
| dictionary tab | `inspector.dictionary` | DICTIONARY | DICTIONNAIRE | m. | yes |
| the magnifier over a note | (component) | LOUPE | LOUPE | f. | yes |
| stations of the LOUPE | `loupe.station.*` | DURATION, PITCH, ACCIDENTAL · ENTRY, UNDERLAY | DURÉE, HAUTEUR, ALTÉRATION · SAISIE, PLACEMENT DES PAROLES | f., except PLACEMENT m. | yes (Dann 22:13) |
| panels of the LOUPE | `loupe.station.corrections`, `loupe.syllables` | CORRECTIONS, SYLLABLES | CORRECTIONS, SYLLABES | f. pl. | yes |
| the sheet under the DRAWER | `drawer.paper`, `a11y.paper` | the page | la page | f. | no: an ordinary word (Dann 22:13) |
| a syllable's place under a note | | placement | placement | m. | no |
| spot controls | `inspector.spotRecon.*` | Spot reduction, Spot reconstitution | Réduction ponctuelle, Reconstitution ponctuelle | f. | no: controls (§4) |

Open for Dann (French, flagged by the audit): the storage messages say "syllable placements" / « Vos syllabes »; `a11y.drawer` names the DRAWER "Controls" / « Commandes ». Each needs one ruling.

## 3. Named places in capitals

**Rule.** A place in Ilya is written in capitals wherever a singer reads it: every row marked "yes" above. French keeps every accent, cedilla, and tréma on capitals (OQLF, Vitrine linguistique, « Accents, trémas et cédilles aux lettres majuscules »). **Reason (Dann 12:19, 13:26):** capitals set the place apart from the ordinary word: open TEXT, but read the text; type in LYRICS, but sing the lyrics.

**What counts as a place:** something on screen, with a visible name, that a singer goes to: a tab, a band, a field, a station, a panel, the DRAWER. A tab, a band, a station, and the DRAWER's pull are places even though a singer taps them: capitals, no chip. Not a control that does something (§4), not a mark on the page, not the page itself.

**Where the capitals live.** The value in `i18n.ts` carries them. CSS `text-transform` may remain where it is, but it is never the only source, so the printed page, a test, and the screen show the same word.

**Legibility, the condition Dann set (13:26):**
- Capitals mark the name only. Articles, prepositions, and possessives stay lower case: "in the LOUPE", « dans le CHANT ».
- No possessive on a place name: "the notation conventions used by MELODY" (Dann 22:10), never "MELODY's".
- Never pluralize a place name. Verb agreement follows the word: "INSIGHTS forecasts", « Les APERÇUS prévoient ».
- In French, prefer a classifier before the name: « le champ ENTRÉE », « l'onglet GUIDE », « la station ANALYSE ». The article agrees with the classifier, the reader learns what kind of place it is, and no apostrophe meets a capital. Where elision cannot be avoided, the apostrophe stays lower case: « l'ENTRÉE », as French sets « l'ONU ».
- **Text only a screen reader speaks stays in ordinary case** (Dann 22:14): `a11y.*` and every `*Aria` key name the place by its word ("Melody" / « Chant »). The capitals' reason is visual; a listener does not hear them, and some screen readers spell short capitalized words letter by letter.
- The same name may appear twice on one screen (the LEARN tab, the contents heading, the page heading): legible, allowed.
- Where capitals would make a sentence hard to read, rewrite the sentence; do not drop the rule.

## 4. Controls, messages, terms, and steps

- **A button** is named by its exact label, in bold inside an outline chip drawn like Ilya's own buttons. **Reason:** the singer matches shape and words to what is on screen; the chip says "this is something you press".
- **A checkbox, a toggle, or a field's label** is named in bold by its exact label, no chip. **Reason:** bold says "find these words on screen".
- **A message Ilya shows** is quoted exactly, in quotation marks (« » in French).
- **A term defined on first use** is italic, once. **A foreign term** in English is italic everywhere, as the French sets it (*zona di passaggio*; Dann 12:22).
- **A directive** is a numbered step, one action per step, the condition before the action.
These apply where they help a singer find the way, never as decoration (ratified 2026-10-31).

## 5. Musician's words, not the machine's

A string speaks the notation: a bar, a note, a dotted half, your score (`CONTRACT.md` §3 tether 22). Never a flag, a token, a reading, a seat. Pitches name the letter and the octave index in both languages (A4, C4). « plis vocaux », never « cordes vocales ».

## 6. Where text lives

Every interface string lives in `i18n.ts` and is read through its key; no label is typed into a component as a language choice. **Reason:** one place to change a name, and the tests can see it. Today the tree holds 117 language choices in components, 93 of them labels; consistency batch 1 moves those 93. The GUIDE and LEARN keep their prose in their components, and every place or control they name uses the term in §2.

## 7. French

French follows `CONTRACT.md` §7: OQLF spacing, the feminine-first pair for a person (« votre professeure ou professeur ») or a neutral wording, and Dann rules every French string before it reaches `Shane`. The desk drafts each with a recommendation and its reason.

## 8. How the rules are kept

Tests enforce what a test can see. Today: `apps/web/src/lib/no-fit-name.test.ts` keeps one retired name out of `i18n.ts` and the GUIDE. After row 171 it becomes `retired-names.test.ts` and reads every retired name from `names.ts`. Planned for batch 4: a test that every i18n key has a reader, and a test that every control the GUIDE names matches a drawn label. A rule no test can check is checked in review.

## Not yet true at `6f740dbf`

`names.ts` and `tab.melody` (batch 1, running on `cloud-lane-24`); the capitals in `i18n.ts` values, "the page", UNDERLAY (batch 1); `retired-names.test.ts` (row 171); the unread-key and GUIDE-controls tests (batch 4).
