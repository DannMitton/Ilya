# Guide formatting review against the ratified convention (2026-10-31)

Source read: `apps/web/src/lib/components/Reading/GuideContent.svelte`, branch Shane, working tree state NOT ESTABLISHED (not a git repository in this sandbox). French runs lines 16 to 309, English lines 311 to 598. Labels checked against `apps/web/src/lib/i18n.ts` and the control inventory. No repository file was edited.

Conventions used in the tables: `<strong class="ui-button">` is a placeholder class name for the future chip style, as instructed. Excerpts use ordinary spaces; the Guide's French uses a non-breaking space before colons and inside guillemets, and the proposals keep that practice. "Alt" means the text sits in an `alt` attribute, where markup cannot go, so only plain-text changes (quotation marks, word corrections) are possible there.

## Summary

| Measure | French | English |
|---|---|---|
| Proposed formatting changes (Table A rows; a row is one sentence-level edit and may mark several labels) | 26 | 29 |
| Of those, conditional on a content finding being settled first | 6 | 5 |
| Content findings (Table B rows; all but B-10 cover both languages) | 17 | 16 |
| Parity issues noticed in passing (Table C rows) | 12 | |

Link count confirmed by anchor, not by line: French has 10 external links, English has 6. A line count gives 9 and 4 because two lines carry two anchors each. Explained in Table C, row C1.

Rule coverage: rule 1 (places) is the bulk of the work. Rule 2 (buttons) applies to Print, Reset, a clear button, the spot checkbox, and Dictionary when it is pressed. Rule 3 (messages) applies in one place only, "Full entry unavailable", and only in alt text. Rule 4 (terms) applies to six terms. Rule 5 needs no edit. No interface label is currently in quotation marks in either language. No message is currently in italics. Both of those checks passed.

DESK DEFAULT: the convention has no rule for toggles, switches, and checkboxes. I treated a control the singer presses as a button under rule 2.

DESK DEFAULT: where one word is both a place and a defined term (Poem and Lyrics, in the witnesses paragraph), rule 1 wins and the sentence carries the definition, so those words are bold, not italic.

DESK DEFAULT: the generic nouns Drawer and Paper are not bolded. On a desk screen neither has a visible label (the pull button that carries them exists only on a phone: `Drawer.svelte:884-887`), and bolding about 40 occurrences would clutter. See "Considered and not proposed".

## Table A: formatting changes

Rule numbers: 1 place, 2 button, 3 message, 4 defined term, 5 directive. "After B-n" means the proposal depends on the content finding in Table B being settled, and the label shown is the current one.

### French

| ID | Line | Lang | Current text (excerpt) | Proposed text | Rule |
|---|---|---|---|---|---|
| A-FR-1 | 30 | FR | `Le module LEÇONS s'adresse à vous` | `Le module <strong>Leçons</strong> s'adresse à vous` (label case, see B-11) | 1 |
| A-FR-2 | 38 | FR | `Le champ Entrée contient deux versions du texte d’un chant. Poème est le poème ... Paroles est le texte ...` | `Le champ <strong>Entrée</strong> contient ... <strong>Poème</strong> est le poème ... <strong>Paroles</strong> est le texte ...` | 1 |
| A-FR-3 | 38 | FR | `Texte transcrit ce que vous collez, saisissez ou déposez dans Entrée, quel que soit le champ affiché (Poème ou Paroles).` | `<strong>Texte</strong> transcrit ce que vous collez, saisissez ou déposez dans <strong>Entrée</strong>, quel que soit le champ affiché (<strong>Poème</strong> ou <strong>Paroles</strong>).` | 1 |
| A-FR-4 | 38 | FR | `le champ Paroles s’en remplit ... Le champ Paroles met en couleur ... le champ Poème grise ... le champ Paroles affiche en sauge ... Par défaut, Texte transcrit le champ Paroles` | the same sentences with `<strong>Paroles</strong>` (four times), `<strong>Poème</strong>`, and `<strong>Texte</strong>` | 1 |
| A-FR-5 | 38 | FR | `choisissez Poème dans l’onglet Texte` | `choisissez <strong>Poème</strong> dans l’onglet <strong>Texte</strong>` | 1 |
| A-FR-6 | 40 | FR | `Dans le champ Paroles, vous pouvez diviser ... Texte affiche le mot tel que vous l’avez saisi.` | `Dans le champ <strong>Paroles</strong> ... <strong>Texte</strong> affiche le mot ...` | 1 |
| A-FR-7 | 48 | FR | `couverte dans le module LEÇONS` | `couverte dans le module <strong>Leçons</strong>` | 1 |
| A-FR-8 | 56 | FR | `dans le bloc de transcription d'analyse du tiroir` | `dans la section <strong>Analyse</strong> du Tiroir` (wording change for parity with English line 351; after B-13) | 1 |
| A-FR-9 | 76 | FR | `l'ambitus (les notes confortables la plus grave et la plus aiguë), la tessiture (là où la voix vit, non ses extrêmes)` | `l'<em>ambitus</em> (...), la <em>tessiture</em> (...)` (`passaggio` is already italic on this line) | 4 |
| A-FR-10 | 102 | FR | `trois sections : Métadonnées, Analyse et Notation. Les quatre onglets ... : Transcription, Fit, Leçons et Guide.` | keep the surviving labels bold: `<strong>Analyse</strong>`, `<strong>Notation</strong>`, `<strong>Leçons</strong>`, `<strong>Guide</strong>`; the other three names are outdated (B-1, B-2) | 1 |
| A-FR-11 | 119 | FR | `Le module Leçons présente un cours complet` | `Le module <strong>Leçons</strong> présente ...` | 1 |
| A-FR-12 | 124 | FR | `L'onglet Guide contient les explications` | `L'onglet <strong>Guide</strong> contient ...` | 1 |
| A-FR-13 | 131 | FR | `Revenez à l'onglet Transcription.` | `Revenez à l'onglet <strong>Texte</strong>.` (after B-3) | 1 |
| A-FR-14 | 136 | FR | `Le champ Compositrice ou compositeur propose une liste de recherche.` | `Le champ <strong>Compositrice ou compositeur</strong> propose ...` (matches `meta.composer`, i18n.ts:275) | 1 |
| A-FR-15 | 148 | FR | `organisée en Piles de mots sur le Papier : API en haut, cyrillique source au milieu et glose de dictionnaire en bas.` | `organisée en <em>Piles de mots</em> sur le Papier ...` (defining sentence; first French use of the term) | 4 |
| A-FR-16 | 153 | FR | `Sa Pile de mots apparaît dans la section Analyse du Tiroir.` | `... dans la section <strong>Analyse</strong> du Tiroir.` | 1 |
| A-FR-17 | 160 | FR | `Le Ruban syllabique de l'Inspecteur offre un compte rendu règle par règle` | `Le <em>Ruban syllabique</em> de l'Inspecteur offre ...` (see B-14: not an on-screen label) | 4 |
| A-FR-18 | 165 | FR | `L'onglet Dictionnaire présente la transcription API` | `L'onglet <strong>Dictionnaire</strong> présente ...` (matches `inspector.dictionary`, i18n.ts:703; see B-9 on "onglet") | 1 |
| A-FR-19 | 165 | FR | `Une case à cocher Reconstitution ponctuelle permet de déroger` | `Une case à cocher <strong class="ui-button">Reconstitution ciblée</strong> permet de déroger ...` (current label, after B-8; the label swaps with the global setting) | 2 |
| A-FR-20 | 179 | FR | Alt: `Un mot signalé comme Entrée complète indisponible dans l'onglet Dictionnaire, avec le bouton Mon choix visible.` | `Un mot signalé par le message « Entrée complète indisponible » dans l'onglet Dictionnaire, ...` (alt: quotation marks only, with non-breaking spaces inside the guillemets) | 3 |
| A-FR-21 | 185 | FR | `La section Notation du Tiroir contient sept commutateurs.` | `La section <strong>Notation</strong> du Tiroir contient sept commutateurs.` (seven confirmed: inventory C063 to C069) | 1 |
| A-FR-22 | 193 | FR | `cliquez sur Imprimer.` | `cliquez sur <strong class="ui-button">Imprimer</strong>.` (`input.print`, i18n.ts:263) | 2 |
| A-FR-23 | 195 | FR | `Cliquez sur Réinitialiser pour effacer les champs de métadonnées` | `Cliquez sur <strong class="ui-button">Réinitialiser</strong> pour ...` (`meta.reset`, i18n.ts:281) | 2 |
| A-FR-24 | 195 | FR | `Cliquez sur Effacer le texte pour repartir de zéro.` | `Cliquez sur <strong class="ui-button">Retirer</strong> ...` (current label; after B-6, which button is meant is undecided) | 2 |
| A-FR-25 | 262 | FR | `les sept sections pédagogiques du module APPRENDRE` | `... du module <strong>Leçons</strong>` (after B-10) | 1 |
| A-FR-26 | 305 | FR | `Exporter un chant écrit un fichier de sauvegarde` | `<strong class="ui-button">Exporter ce chant</strong> écrit un fichier de sauvegarde ...` (after B-17; `binder.export`, i18n.ts:1569) | 2 |

### English

| ID | Line | Lang | Current text (excerpt) | Proposed text | Rule |
|---|---|---|---|---|---|
| A-EN-1 | 325 | EN | `The LEARN module is for users who appreciate` | `The <strong>Learn</strong> module is for users ...` (case, see B-11) | 1 |
| A-EN-2 | 333 | EN | `The Input field holds two instantiations of song text. Poem is the authoritative poem ... Lyrics is the text that the composer set` | `The <strong>Input</strong> field holds ... <strong>Poem</strong> is ... <strong>Lyrics</strong> is ...` | 1 |
| A-EN-3 | 333 | EN | `Text transcribes whatever you paste, type, or drop into Input, regardless of its view (Poem or Lyrics).` | `<strong>Text</strong> transcribes whatever you paste, type, or drop into <strong>Input</strong>, regardless of its view (<strong>Poem</strong> or <strong>Lyrics</strong>).` | 1 |
| A-EN-4 | 333 | EN | `Lyrics fills with that text ... Lyrics applies colour ... Poem greys any words ... Lyrics renders repeats ... Text transcribes Lyrics by default` | the same sentences with `<strong>Lyrics</strong>` (three times), `<strong>Poem</strong>`, `<strong>Text</strong>`, and `<strong>Lyrics</strong>` | 1 |
| A-EN-5 | 333 | EN | `choose Poem in Text` | `choose <strong>Poem</strong> in <strong>Text</strong>` | 1 |
| A-EN-6 | 335 | EN | `In Lyrics, you can divide a word ... Text shows the word as you typed it.` | `In <strong>Lyrics</strong>, ... <strong>Text</strong> shows ...` | 1 |
| A-EN-7 | 343 | EN | `covered in the LEARN module` | `covered in the <strong>Learn</strong> module` | 1 |
| A-EN-8 | 351 | EN | `the Drawer's Analysis Word Stack` | `the Drawer's <strong>Analysis</strong> Word Stack` (see B-13 and C-8) | 1 |
| A-EN-9 | 362 | EN | `the song’s relationship to your zona di passaggio` | `... your <em>zona di passaggio</em>` (French italicises it at line 67) | 4 |
| A-EN-10 | 370 | EN | `Voice characteristics: range, tessitura, and passaggio` (heading) | `... and <em>passaggio</em>` (French heading, line 74, italicises it) | 4 |
| A-EN-11 | 372 | EN | `range (the lowest and highest comfortable notes), tessitura (where the voice lives, not its edges), and passaggio (the lower and upper turns that bound the zona di passaggio; ...)` | `<em>range</em> (...), <em>tessitura</em> (...), and <em>passaggio</em> (... the <em>zona di passaggio</em>; ...)` | 4 |
| A-EN-12 | 398 | EN | `Transcription, Fit, Learn, and Guide. The Transcription tab is organised into three sections: Metadata, Analysis, and Notation.` | keep the surviving labels bold: `<strong>Learn</strong>`, `<strong>Guide</strong>`, `<strong>Analysis</strong>`, `<strong>Notation</strong>`; the other three names are outdated (B-1, B-2) | 1 |
| A-EN-13 | 415 | EN | `The LEARN module presents a complete course` | `The <strong>Learn</strong> module presents ...` | 1 |
| A-EN-14 | 420 | EN | `The Guide tab contains explanatory material` | `The <strong>Guide</strong> tab contains ...` | 1 |
| A-EN-15 | 427 | EN | `Return to the Transcription tab.` | `Return to the <strong>Text</strong> tab.` (after B-3) | 1 |
| A-EN-16 | 432 | EN | `The Composer field offers a searchable list.` | `The <strong>Composer</strong> field offers ...` (`meta.composer`, i18n.ts:275) | 1 |
| A-EN-17 | 444 | EN | `Output is arranged in Word Stacks on the Paper: IPA above, Cyrillic source text in the middle, and a dictionary gloss below.` | `... arranged in <em>Word Stacks</em> on the Paper: ...` (defining sentence; the first use is earlier, at line 351, see C-8) | 4 |
| A-EN-18 | 449 | EN | `Its Word Stack appears in the Analysis section of the Drawer.` | `... in the <strong>Analysis</strong> section of the Drawer.` | 1 |
| A-EN-19 | 456 | EN | `The Inspector's syllable-level Ribbon provides a rule-by-rule account` | `The Inspector's syllable-level <em>Ribbon</em> provides ...` (see B-14) | 4 |
| A-EN-20 | 461 | EN | `The Dictionary tab shows the IPA transcription` | `The <strong>Dictionary</strong> tab shows ...` (`inspector.dictionary`, i18n.ts:703; see B-9) | 1 |
| A-EN-21 | 461 | EN | `A Spot reconstitution checkbox allows you to override` | `A <strong class="ui-button">Spot reconstitution</strong> checkbox allows ...` (the label reads "Spot reduction" when global reconstitution is on, B-8) | 2 |
| A-EN-22 | 466 | EN | `Click Dictionary to make the gloss field editable.` | `Click <strong class="ui-button">Dictionary</strong> to make the gloss field editable.` | 2 |
| A-EN-23 | 475 | EN | Alt: `A word flagged as Full entry unavailable in the Dictionary tab, with the My assignment tab visible alongside.` | `A word flagged with the message “Full entry unavailable” in the Dictionary tab, ...` (alt: quotation marks only; "My assignment tab" see B-9) | 3 |
| A-EN-24 | 481 | EN | `The Notation section of the Drawer contains seven toggles.` | `The <strong>Notation</strong> section of the Drawer contains seven toggles.` | 1 |
| A-EN-25 | 489 | EN | `click Print.` | `click <strong class="ui-button">Print</strong>.` (`input.print`, i18n.ts:263) | 2 |
| A-EN-26 | 491 | EN | `Click Reset to clear the metadata fields` | `Click <strong class="ui-button">Reset</strong> to clear ...` (`meta.reset`, i18n.ts:281) | 2 |
| A-EN-27 | 491 | EN | `Click Clear text to start fresh.` | `Click <strong class="ui-button">Clear</strong> to start fresh.` (current label; after B-6) | 2 |
| A-EN-28 | 558 | EN | `the seven LEARN Teaching Layer sections` | `the seven <strong>Learn</strong> Teaching Layer sections` (after B-11) | 1 |
| A-EN-29 | 592 | EN | `Exporting a song writes a backup file to your own device` | `<strong class="ui-button">Export this song</strong> writes a backup file ...` (after B-17; `binder.export`, i18n.ts:1569) | 2 |

Rows conditional on Table B: FR A-FR-8, 13, 19, 24, 25, 26 (6 rows); EN A-EN-15, 21, 27, 28, 29 (5 rows).

Note added by the desk after review: rulings of 2026-10-31 and 2026-11-01 supersede several rows. Ribbon and Inspector are retired (A-FR-17 and A-EN-19 no longer apply; Inspector becomes Analysis); `[#]` takes code type; see `brief-code-row171-guide-names-audit_r1_2026-10-31.md` for every ruling.

### Collisions with existing bold (not rule applications, recorded for the owner)

Once buttons and places are bold or chip-styled, other uses of `<strong>` will read as controls. Decision is the owner's (taste).

| Line | Lang | Current | Problem | Suggestion |
|---|---|---|---|---|
| 84 | FR | `<strong>[#]</strong>` | A typed symbol, not a control. | `<code>[#]</code>, as LearnContent.svelte does for IPA (line 3027)` |
| 380 | EN | `<strong>[#]</strong>` | Same. | Same. |
| 285, 287, 289, 292, 302, 304, 305 and list items 294 to 299 | FR | run-in headings such as `<strong>Recherche savante.</strong>` | Bold is used as a heading, not a place or button. | a distinct element or class (for example a run-in heading class) |
| 581, 583, 585, 587, 589, 591, 592 | EN | `<strong>Scholarship.</strong>` and the rest | Same. | Same. |

### Considered and not proposed (the convention says to leave a sentence alone when a rule would clutter it)

- Markup, Insights, Annotation, and Aperçus when they are the subject of a sentence (FR 67, 69, 82, 285; EN 362, 364, 378, 581). They are not directing the singer anywhere.
- FR 107 and EN 403 ("le module Leçons, le Guide", "the LEARN module, the Guide"): named as content, not as a destination.
- The seven notation toggles in FR 187 and EN 483: the Guide uses descriptive names that do not match the labels, so bolding them would point the singer at words that are not on screen. See B-12.
- Drawer, Paper, Tiroir, and Papier throughout (taste; see the DESK DEFAULT above).

## Table B: content findings (outdated or mismatched names)

| ID | Line | Lang | What the Guide says | What the current interface says |
|---|---|---|---|---|
| B-1 | FR 102 (alt 101); EN 398 (alt 397) | FR + EN | The Drawer has "three sections: Metadata, Analysis, and Notation". | The Studio drawer bands are Piece / Pièce (`group.piece`, i18n.ts:135), Input / Entrée (`group.input`, i18n.ts:144), and Voice / Voix (`group.scoreMarkup`, i18n.ts:139). Notation (`cosmetic.heading`, i18n.ts:286) and Analysis / Analyse (`console.placeholder`, i18n.ts:882) are stations inside the Input band (inventory C062, C070). Whether the Voice band shows without the build wall is NOT ESTABLISHED. |
| B-2 | FR 102; EN 398 (alts FR 101, EN 397) | FR + EN | "four tabs ... Transcription, Fit, Learn, and Guide", placed "at the bottom" of the screen. | Tabs are Text / Texte (`tab.text`, i18n.ts:186), Markup / Annotation (`tab.markedScore`, i18n.ts:197), Insights / Aperçus (`tab.insights`, i18n.ts:201), plus Learn / Leçons (`tab.learn`, i18n.ts:187) and Guide / Guide (`tab.guide`, i18n.ts:188). Markup and Insights show only when `PUBLIC_INCLUDE_MARKUP_INSIGHTS` is true (inventory C003, C004). Learn and Guide are set-apart links beside the tab list (`DeskHead.svelte:115-131`). "Fit" was the tool's shown name until N.174 (AGENTS.md; i18n.ts:181-185 and 195-196), so no tab by that name exists. Inference, flagged: the Guide's "Fit" most likely stands for the Markup and Insights pair; the owner decides the wording. Whether the bar sits at the bottom of the screen is NOT ESTABLISHED. |
| B-3 | FR 131; EN 427 | FR + EN | "Return to the Transcription tab" / "Revenez à l'onglet Transcription". | The tab is Text / Texte (`tab.text`, i18n.ts:186). |
| B-4 | FR 131 (alt 130); EN 427 (alt 426) | FR + EN | The fields are "called Metadata in Ilya" / "appelés Métadonnées dans Ilya". | `meta.heading` (Metadata / Métadonnées, i18n.ts:273) has no reader in any component (searched `apps/web/src`). The fields sit in the Piece / Pièce band. The Guide's defined term is no longer on screen. |
| B-5 | FR 140 (alt), 141; EN 436 (alt), 437 | FR + EN | "click Transcribe" / "cliquez sur Transcrire"; "the Transcribe button visible". | No component reads `input.transcribe` ("Transcribe and fit", with the same English in the French slot, i18n.ts:258). Cmd+Enter or Ctrl+Enter "skips the quiet pause" (`IntakeViews.svelte:213-219`; inventory C048), which means transcription otherwise follows a pause. How the Guide's step should now read is the owner's call. |
| B-6 | FR 195; EN 491 | FR + EN | "Clear text" / "Effacer le texte". | `input.clear` (i18n.ts:262) is marked UNUSED since N.108 (comment at i18n.ts:259-261). The buttons now read Clear / Retirer (`intake.clear`, i18n.ts:846): one per receipt, at `IntakePanel.svelte:451-454` (Poem and Lyrics text) and `:459-463` (score). Which one "start fresh" means is undecided. |
| B-7 | FR 111-112 (alt 111); EN 407-408 (alt 407) | FR + EN | "The Drawer Handle is the semicircle at the centre left ... Click it to collapse the Drawer." | On the desk the pull "does not exist" (`Drawer.svelte:884-886`) and the desk drawer "needs no handle" (`Drawer.svelte:181-185`). On a phone the pull is a button reading Drawer or Paper (`Drawer.svelte:887-900`; `drawer.pull` i18n.ts:206, `drawer.paper` i18n.ts:115; French Tiroir and Papier). The Guide describes a control that is not on the desk. |
| B-8 | FR 165; EN 461 | FR + EN | A checkbox named "Spot reconstitution" / "Reconstitution ponctuelle". | The label is a literal that swaps with the global setting: "Spot reduction" or "Spot reconstitution"; French "Réduction ciblée" or "Reconstitution ciblée" (`InspectorPanel.svelte:58-62`). The French "Reconstitution ponctuelle" is the legend wording (`legend.spot-reconstitution`, i18n.ts:914) and an unused key (`inspector.spotRecon.right`, i18n.ts:721). The checkbox is drawn at the word stack's edge (`InspectorPanel.svelte:1010-1023`), not stated to be inside the Dictionary panel. |
| B-9 | FR 164-165, 179; EN 460-461, 475 | FR + EN | "The Dictionary tab"; "the My assignment tab". | Dictionary / Dictionnaire is a button that opens a panel (`inspector.dictionary`, i18n.ts:703; inventory C071, `aria-expanded`). My assignment / Mon choix is a button in the stress chooser (`inspector.stressAssign.myAssignment`, i18n.ts:738). Neither is a tab. French alt line 179 already says "bouton Mon choix". |
| B-10 | FR 262 | FR | "le module APPRENDRE". | The destination is Leçons (`tab.learn`, i18n.ts:187). English line 558 says "LEARN Teaching Layer". |
| B-11 | FR 30, 48; EN 325, 343, 403, 414 (alt), 415, 419 (alt), 558 | FR + EN | LEÇONS, LEARN, "GUIDE tab" in capitals. | Labels are Learn / Leçons and Guide (i18n.ts:187-188). Case only, low. Whether the tab bar capitalises by style is NOT ESTABLISHED. |
| B-12 | FR 187; EN 483 | FR + EN | Toggles are called "open syllabification", "stress acutes", "shcha, geminate, and palatal nasal toggles", "reduced vowel pair", "reconstitution". | Labels come in pairs (i18n.ts:287-300): "Default syllabification" and "Open syllables"; "No stress marks" and "Apply stress acutes"; "Shcha notation [ʃʲʃʲ]" and "Length marker [ʃʲː]" (French "Notation chtcha"); "Separate geminates [tt]" and "Length markers [tː]"; "Palatal nasal [ɲ]" and "Palatalized nasal [nʲ]"; "Default [ʌ]" and "Display [ə] instead"; "Default reduction" and "Reconstitution". Only "Reconstitution" matches word for word. |
| B-13 | FR 56; EN 351 | FR + EN | "bloc de transcription d'analyse du tiroir" / "the Drawer's Analysis Word Stack". | The station is Analysis / Analyse (`console.placeholder`, i18n.ts:882). "Word Stack" is not an on-screen label. The two languages also say different things (C-8). |
| B-14 | FR 148, 153, 160; EN 444, 449, 456 | FR + EN | "Word Stack / Pile de mots", "Ribbon / Ruban syllabique", "Inspector / Inspecteur". | No on-screen label uses these names. The nearest strings are "Character breakdown" / "Décomposition par caractère" (`inspector.ribbon`, i18n.ts:696, an aria-label) and "Phonological notes" (i18n.ts:697). Who coined each term is NOT ESTABLISHED. |
| B-15 | FR 106 (alt); EN 402 (alt) | FR + EN | The toggle shows "English and Français options". | The button shows one name, the other language's (`HeaderBar.svelte:23-24`, :56; inventory C001). |
| B-16 | FR 131, 135 (alt); EN 427 | FR + EN | "Enter an aria or song title, opus number, or song cycle"; French alt "Le champ Compositeur". | Field labels are "Aria or song title" (`meta.title`, i18n.ts:274), "Opera, song cycle, opus number" (`meta.opus`, i18n.ts:277), and French "Compositrice ou compositeur" (i18n.ts:275). Loose naming, low. |
| B-17 | FR 305; EN 592 | FR + EN | "Exporter un chant" / "Exporting a song". | The button reads Export this song / Exporter ce chant (`binder.export`, i18n.ts:1569) inside the Export and import / Exportation et importation station (`binder.heading`, i18n.ts:163). |

Not verified (no label confirmed in i18n.ts or the inventory): "profile summary" and "note picker" (FR 76, EN 372).

## Table C: parity issues noticed in passing

| ID | Lines | What differs |
|---|---|---|
| C-1 | FR 240, 287, 289, 294, 295, 296, 297, 298, 299 (10 anchors); EN 536, 583, 585, 587 (6 anchors) | Link count confirmed: French 10, English 6. Six are shared: dannmitton.com (FR 240, EN 536); kaikki.org (FR 287, EN 583); the CC BY-SA 4.0 deed (FR 287 `deed.fr`, EN 583 `deed.en`, a deliberate language switch); LiederNet (FR 289, EN 585); the OQLF spacing page (FR 294, EN 587); Roberge's guide (FR 295, EN 587). The four extra French anchors are all in the French "Langue" list: OQLF 23991 on name doublets (line 296), Roberge `04-notes.htm` on pitch names (297), DeCS on "plis vocaux" (298), and the OQLF bibliographic notice (299). English has a single sentence for Language (587) and no counterpart to the four conventions. Counting lines gives 9 and 4 because lines 287 and 583 hold two anchors each and EN 587 holds two. The four conventions govern French usage, so a French-only list is defensible; whether English readers should see them is a taste call for the owner. |
| C-2 | FR 291 to 300; EN 587 | The French "Langue" entry is a list of six conventions with sources; English is one sentence naming two sources. Same cause as C-1. |
| C-3 | FR 124; EN 420 | French adds "Le Guide combine des passages rédigés directement en français et des passages traduits de l'anglais, certains encore à valider." English has no counterpart. |
| C-4 | FR 168-171; EN 464-467 | The step-25 captions describe different features. French (170) explains that ё always carries the stress; English (466) explains custom glosses (twenty characters, persistence). The French intro (96) promises custom glosses ("rédigeons des gloses personnalisées") and the Guide never explains them in French. The limit of twenty characters agrees with `inspector.dictCapacity` (i18n.ts:707). |
| C-5 | FR 173-181; EN 469-477 | Captions for step 32 and step 35 do not match their own alt text in either language (schwa caption beside a Dictionary alt; printing caption beside a "Full entry unavailable" alt). Same in both, so not a parity gap, but the pairing looks wrong. Image content NOT ESTABLISHED (images not opened). |
| C-6 | FR 67, 74, 76, 78; EN 362, 370, 372 | French italicises `zona di passaggio` and `passaggio`; English does not. French line 295 states the convention for Italian musical terms. Covered by A-EN-9 to A-EN-11. |
| C-7 | FR 256; EN 552 | Nested `<em>` inside `<em>` in the Game Changer note, in both languages. The inner title will not read as distinct. |
| C-8 | FR 56, 148; EN 351, 444 | English uses "Word Stack" at line 351, about ninety lines before it is defined at line 444. French avoids the term at 56 ("bloc de transcription d'analyse") and first uses "Pile de mots" at 148, which is the defining sentence. |
| C-9 | FR 94, 195, 260, 262, 266, 274; EN 390, 491, 556, 558, 562, 570 | Em dashes in user-facing copy, six lines in each language. AGENTS.md says no em dashes in user-facing copy. |
| C-10 | FR 60; EN 355 | French uses guillemets for « à la manière de » (non-breaking spaces, matching the Guide's practice). English uses straight quotation marks around "in the style of" while the rest of the English Guide uses curly marks (for example lines 540 and 550). |
| C-11 | FR 102; EN 398 | The caption sentences are in a different order, and English adds "WYSIWYG Paper" and says the Transcription tab holds the three sections; French says the Drawer does. Both are outdated (B-1). |
| C-12 | FR 305; EN 592 | In both languages the Exportation paragraph writes Ilya without `<em>`, unlike the rest of the Guide. |
