# Draft: Guide captions for the two re-shot screens, r1

Drafted by Fable, 2026-10-15, against `Shane` at `14e2ff8`. Read only; nothing touched the tree. Dann rules on every French line before any of it is seated.

## What this covers

Two figures in the walkthrough, step 01 and step 13, each with a caption and an alt text, in both languages: eight strings at four line pairs. The line numbers are those at `14e2ff8` (the row 97 report cites `:94` and `:381`; two lines moved after it).

Each proposed string describes only what the matching picture in `docs/sessions/row97-guide-shots/` shows. Both pictures are English screens at 1440 x 900. No French screen was drawn, so the French strings name the controls by their ratified French labels in `i18n.ts`, on the assumption that the French Guide will carry a French re-shoot. Choice 1 in the flagged list is about that assumption.

## The pictures, old and new

| Figure | Old file | What the old file shows | What today's screen shows | Verdict |
|---|---|---|---|---|
| Step 01 | `apps/web/static/guide/guide-step-01.webp` (1200 x 1043) | A single-column drawer with METADATA, ANALYSIS, and NOTATION, a bottom bar with three tabs (TRANSCRIPTION, LEARN, GUIDE), a dark semicircle handle, and English and Français as two buttons. | Three stacked bands PIECE, INPUT, and VOICE; INPUT open on a fresh load; TEXT, MARKUP, and INSIGHTS as a three-part control above the Paper; LEARN and GUIDE as two underlined links; one button, Français; no handle, no bottom bar. | Re-shoot. Nothing in the old picture matches the layout. |
| Step 13 | `apps/web/static/guide/guide-step-13.webp` (1200 x 668) | A syllable card for «Онегин», an orange tap marker, the Notation toggle list, and a page of word cards. No metadata fields. | PIECE open, with the fields Aria or song title, Opera, song cycle, opus number, Composer, Poet or librettist, and Translator, a Reset link, and two closed rows, Repertoire and Export and import. | Re-shoot. The old picture never matched its own caption. |

## The table

Apostrophes in the French drafts are typographic (U+2019), as the ratified passages at `:61`, `:74`, and `:277` use; the old captions use straight marks. The French colon carries a no-break space (U+00A0) before it, as `:61` and `:74` do and as `i18n.test.ts:141-153` demands. The French list before « et » takes no comma, as the existing Guide does (« Métadonnées, Analyse et Notation », `:96`). Labels are given in the title case of their `i18n.ts` values; the screen renders the band and tab names in small capitals.

### Step 01, caption

| | EN | FR |
|---|---|---|
| Line | `:386` | `:96` |
| Current | *Ilya* opens with the Drawer on the left and the WYSIWYG Paper on the right. The four tabs at the bottom navigate between *Ilya*'s four areas: Transcription, Fit, Learn, and Guide. The Transcription tab is organised into three sections: Metadata, Analysis, and Notation. | *Ilya* s'ouvre avec le Tiroir déployé à gauche et le document papier à droite. Le Tiroir est organisé en trois sections : Métadonnées, Analyse et Notation. Les quatre onglets au bas de l'écran permettent de naviguer entre les quatre espaces d'*Ilya* : Transcription, Fit, Leçons et Guide. |
| Proposed | *Ilya* opens with the Drawer on the left and the Paper on the right. Above the Paper, three tabs, Text, Markup, and Insights, choose the document that the Paper shows, and two links, Learn and Guide, open the reading pages. The Drawer holds three bands: Piece, Input, and Voice. On a fresh load, Input is open, with the poem field, Notation, and Analysis inside it. | *Ilya* s’ouvre avec le Tiroir à gauche et le Papier à droite. Au-dessus du Papier, trois onglets, Texte, Annotation et Aperçus, choisissent le document que le Papier affiche, et deux liens, Leçons et Guide, ouvrent les pages de lecture. Le Tiroir comprend trois sections : Pièce, Entrée et Voix. Au premier chargement, Entrée est ouverte, avec le champ du poème, Notation et Analyse. |

What changed and why: "four tabs at the bottom", "Transcription", "Fit", "Metadata", and "WYSIWYG" are not on the screen. The screen shows five destinations, in two kinds: a three-part control and two links. "Fresh load" states what the picture shows (INPUT open, PIECE and VOICE closed), because step 13 then asks the reader to open PIECE.

### Step 01, alt text

| | EN | FR |
|---|---|---|
| Line | `:385` | `:95` |
| Current | Ilya opens with the Drawer extended on the left and the paper document on the right, showing three Drawer sections and four navigation tabs. | Ilya s'ouvre avec le Tiroir déployé à gauche et le document papier à droite, affichant trois sections et quatre onglets de navigation. |
| Proposed | Ilya open, with the Drawer on the left showing the Piece, Input, and Voice bands, and the Paper on the right under the Text, Markup, and Insights tabs and the Learn and Guide links. | Ilya ouvert, avec le Tiroir à gauche affichant les sections Pièce, Entrée et Voix, et le Papier à droite sous les onglets Texte, Annotation et Aperçus et les liens Leçons et Guide. |

### Step 13, caption

| | EN | FR |
|---|---|---|
| Line | `:415` | `:125` |
| Current | Return to the Transcription tab. Enter an aria or song title, opus number, or song cycle. These fields (called Metadata in *Ilya*) populate the header at the top of the paper document. | Revenez à l'onglet Transcription. Saisissez un titre d'air ou de mélodie, un numéro d'opus ou un cycle de chansons. Ces champs (appelés Métadonnées dans *Ilya*) alimentent l'en-tête du document papier. |
| Proposed | Open Piece in the Drawer. The first two fields take the aria or song title and the opera, song cycle, or opus number. Composer, Poet or librettist, and Translator follow. What you enter fills the header of the Paper. Repertoire and Export and import sit closed under the fields. | Ouvrez Pièce dans le Tiroir. Les deux premiers champs reçoivent l’aria ou le titre du chant, puis l’opéra, le cycle de mélodies ou le numéro d’opus. Suivent Compositrice ou compositeur, Poète ou librettiste et Traductrice ou traducteur. Ce que vous saisissez remplit l’en-tête du Papier. Répertoire et Exportation et importation restent fermés sous les champs. |

What changed and why: there is no Transcription tab and no section called Metadata; the band is Piece, and it is closed on a fresh load, so the caption opens it. The field list is the one on screen, in screen order. The two closed rows are in the picture, so the caption names them in one clause. The French agreement checked: « restent fermés » agrees with two sections, one masculine (Répertoire) and one feminine (Exportation et importation), so masculine plural; « Entrée est ouverte » (step 01) agrees with the feminine noun Entrée.

### Step 13, alt text

| | EN | FR |
|---|---|---|
| Line | `:414` | `:124` |
| Current | The Metadata section of the Drawer with the aria title field and opera or song cycle field visible. | La section Métadonnées du Tiroir avec les champs de titre d'air, d'opéra ou de cycle de mélodies. |
| Proposed | The Piece band open in the Drawer, with the fields Aria or song title, Opera, song cycle, opus number, Composer, Poet or librettist, and Translator, and the header of the Paper to the right. | La section Pièce ouverte dans le Tiroir, avec les champs Aria ou titre du chant, Opéra, cycle de mélodies, numéro d’opus, Compositrice ou compositeur, Poète ou librettiste et Traductrice ou traducteur, et l’en-tête du Papier à droite. |

## Every French word: adopted or coined

Adopted, with the source:

| French | Source |
|---|---|
| Tiroir | `i18n.ts:206` `drawer.pull`; the Guide, `:96` and throughout |
| Papier | `i18n.ts:115` `drawer.paper`; the Guide, `:106` |
| Texte, Annotation, Aperçus | `i18n.ts:186` `tab.text`, `:197` `tab.markedScore`, `:201` `tab.insights`; ratified passages at `:61` and `:74` |
| Leçons, Guide | `i18n.ts:187` `tab.learn`, `:188` `tab.guide`; the Guide, `:101` |
| Pièce, Entrée | `i18n.ts:135` `group.piece`, `:144` `group.input` |
| Voix | `i18n.ts:139` `group.scoreMarkup`; the file's own comment at `:131-134` says « Voix » is a desk proposal awaiting Dann's ratification, so it is adopted from an unratified string |
| Notation, Analyse | `i18n.ts:283` `cosmetic.heading`, `:798` `console.placeholder`; the Guide, `:96` |
| Aria ou titre du chant | `i18n.ts:271` `meta.title` |
| Opéra, cycle de mélodies, numéro d’opus | `i18n.ts:274` `meta.opus` |
| Compositrice ou compositeur | `i18n.ts:272` `meta.composer` |
| Poète ou librettiste | `i18n.ts:273` `meta.poet` |
| Traductrice ou traducteur | `i18n.ts:276` `meta.translator` |
| Répertoire | `i18n.ts:1547` `songs.heading` |
| Exportation et importation | `i18n.ts:163` `binder.heading` |
| onglet, onglets | the Guide, `:96`, `:168`, `:173` |
| section, sections | the Guide, `:96` (« trois sections ») |
| en-tête | the Guide, `:125`, `:130` |
| champ, champs | the Guide, `:125`, `:130` |
| à gauche, à droite | the Guide, `:96`; `i18n.ts:801` `paper.empty` |
| s’ouvre, ouvert, ouverte | the Guide, `:96` (« s'ouvre »), and twelve « ouvert » forms in the French block |

Coined, by me, with the alternative I weighed:

| French | Note |
|---|---|
| « les pages de lecture » (for Learn and Guide together) | The components live under `components/Reading/`, which is not a word on screen. Alternative: drop the phrase and write « et deux liens, Leçons et Guide » with no verb object. The English « the reading pages » is coined the same way. |
| « deux liens » (for Learn and Guide) | The French Guide has no whole-word « lien »; the screen draws the two as underlined links. Alternative: « deux boutons », which the Guide does use (`:173`), but the screen does not draw them as buttons. |
| « choisissent le document que le Papier affiche » | « document » for the three tabs' content follows the `i18n.ts:189-198` comments (« Studio's second document », « third document »), which is desk prose, not a ratified French string. |
| « Au premier chargement » (for "on a fresh load") | No existing French in the Guide or `i18n.ts` says this. |
| « comprend trois sections » | The old `:96` has « est organisé en trois sections »; shortened. |
| « reçoivent », « remplit », « restent fermés sous les champs », « Suivent … » | Verbs chosen for the new sentences; none is a term. |
| « champ du poème » | From `i18n.ts:730` `intake.placeholder` (« votre poème »), but the noun phrase itself is not in the file. |

The English coinages, for the record: "band" is adopted (Dann's own word for the Drawer's three accordions, `i18n.ts:141-143`, and the `bandHead` snippet in `Drawer.svelte:516-553`); "the reading pages" and "a fresh load" are mine.

## Choices that are Dann's

1. **Whose labels does the French caption name.** Both Guide branches load the same English `.webp`. If the French Guide keeps an English picture, the French captions name controls the French reader cannot see on the picture (Pièce where the picture says PIECE). Recommendation: shoot each step twice, once per language, and give the French branch its own file. Cost: four captures instead of two, and a `src` change at `:95` and `:124`.
2. **"Band" or "section" in English.** The old caption said "sections"; Dann's own word for these accordions is "band" (`i18n.ts:141-143`), and the Guide has never used either for them. The draft uses "band". The French draft uses « section », adopted from `:96`, because the French Guide already has it and « bande » would be a calque. One concept with two words across the languages is the cost.
3. **"Tab" or "document" for Text, Markup, and Insights.** The keys are `tab.*`; the comments call them documents; the screen shows a three-part control. The draft says "tabs" and « onglets », which the Guide already uses.
4. **« Voix »** is adopted from an unratified string (`i18n.ts:131-134`). If he rules a different French for the band, these captions follow it.
5. **Dropping "WYSIWYG".** It is not on screen and the Guide uses "Paper" elsewhere without it. The draft drops it.
6. **« Papier » versus « le document papier ».** The French Guide uses both (one and eight occurrences). The draft uses « Papier », matching `drawer.paper`. If he prefers « le document papier », the four French strings take it; one term per concept says pick one and change the other seven occurrences in a later row.
7. **Casing of labels in prose.** The screen renders PIECE, TEXT, and LEARN in small capitals; the old captions write "LEARN module" in capitals but "Guide" in title case. The draft uses the title case of the `i18n.ts` values throughout.
8. **Spatial words in captions.** "On the left" and "on the right" describe the picture, and `paper.empty` itself says "in the drawer on the left"; the no-directional-language rule targets cross-references in a document. The draft keeps them. If he reads the rule as covering captions, the four strings lose « à gauche » and « à droite » and keep their sense.
9. **Naming the two closed rows in step 13.** Repertoire and Export and import are in the picture but not the step's point. The draft names them in one clause; cutting that clause loses nothing the step needs.

## Not reworded, but contradicted by today's screens

Two captions outside this pair describe things today's screens do not show. They have no matching picture here, so no draft:

- `:391` and `:101` (step 02): "showing English and Français options". Today's screen shows one button, Français (`HeaderBar.svelte:33` draws the other language's name). The old `guide-step-02.webp` was not read.
- `:396` and `:106` (step 04): "the semicircle at the centre left of the screen". Neither of today's screens shows a handle, and `i18n.ts:202-205` says the pull carries no visible word. Whether a semicircle still draws when the Drawer is collapsed is NOT ESTABLISHED from these two screens.
