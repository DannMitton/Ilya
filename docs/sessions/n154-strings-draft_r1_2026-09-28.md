# N.154 strings draft, r1, 2026-09-28

A draft for Dann's ruling. Nothing here is in the tree.

Read on branch `Shane` at `9ebfdc0` (`git log --oneline -1`), working tree clean (`git status --porcelain` empty). Every path:line below was read this session.

## What the app now is, as the sources state it

- The three documents are Text, Markup, and Insights; in French « Texte », « Annotation », « Aperçus ». `docs/memory/PRODUCT.md:457`; `ARCHITECTURE.md:19-23`; `apps/web/src/lib/destinations.ts:38`.
- "Insights forecasts, it does not declare." Ruled 2026-09-27; the Guide's shown heading still says Fit and is N.154's. `PRODUCT.md:459`.
- The drawer shows three bands: Piece, Input, Voice. `Drawer.svelte:516`, `:539`, `:553`, with `group.scoreMarkup` reading "Voice" / « Voix » (`i18n.ts:57`). Text is not a band (`Drawer.svelte:544-548`).
- The document switcher is a tab pair at the top of the desk, not tabs at the bottom. `DeskHead.svelte:1-21`, `:111-124`.
- The Transcribe button is gone (N.145). `IntakePanel.svelte:534-536`.

## Already fixed in the tree

- `tab.fit`: deleted in `c2a01b3` (N.174 D.1). No key named `tab.fit` exists in `i18n.ts`.
- `calib.welcome.lede` and `calib.welcome.fryAnswer`: now say "Ilya will measure your voice" and "Ilya reads its resonances" (`i18n.ts:1063`, `:1065`), fixed in `933bbda` ("N.154: four string fixes").
- `a11y.paper`: now "Text" / « Texte », following `tab.text` (`i18n.ts:137-138`, `:143`).

## The table: rendered strings that are stale

French sources used below, all in `apps/web/src/lib/i18n.ts` unless stated:

- « Texte »: `tab.text` `:104`
- « Annotation »: `tab.markedScore` `:115`
- « Aperçus », and « les Aperçus » in running text: `tab.insights` `:119`; `voiceIntake.intro` `:1651`; `voiceIntake.topics.stem` `:1699`
- « Entrée »: `group.input` `:62`
- A band name used bare, without an article: `paper.empty.mobile` `:714` (« Touchez Tiroir »)
- « onglet »: the Learn French being edited (`LearnContent.svelte:672`); `storage.otherTab` `:1320`
- « prévoit », « ne déclare pas »: `GuideContent.svelte:58`
- « Conventions de notation de »: `GuideContent.svelte:71`

| # | Key or file:line | Current English | Current French | Why it is stale | Proposed English | Proposed French | French sources and agreement |
|---|---|---|---|---|---|---|---|
| 1 | `profile.scoreRegionAria` (`i18n.ts:1198`), the Markup paper's region name (`MarkupPane.svelte:991`) | Repertoire fit score | Partition annotée du répertoire | Names Fit, and the French names « Partition annotée », which `tab.markedScore` says is superseded and not to be carried forward (`i18n.ts:108-111`). The document is Markup / « Annotation » (`PRODUCT.md:457`). Precedent: `a11y.paper` follows `tab.text` (`i18n.ts:137-138`). | Markup | Annotation | Taken from `tab.markedScore`. A name alone, no agreement. Spoken only, so no guillemets (`i18n.ts:139`). |
| 2 | `profile.lede` (`i18n.ts:1181`), shown on the Markup page (`MarkupPane.svelte:1133`) | Your repertoire-fit results will appear here after Ilya processes the score you upload. | Vos résultats de correspondance au répertoire apparaîtront ici une fois qu’Ilya aura traité la partition que vous téléversez. | "Repertoire-fit results" names the Fit surface. What appears here is the Markup document. | Markup will appear here after Ilya processes the score you upload. | L’Annotation apparaîtra ici une fois qu’Ilya aura traité la partition que vous téléversez. | « Annotation » from `tab.markedScore`. The rest of the sentence is the current French. **COINED:** « l’Annotation » with an article in running text, on the model of « les Aperçus » (`:1651`). Agreement: « apparaîtra » agrees with « l’Annotation », feminine singular. « aura traité » takes avoir with its object « la partition » after it, so there is no agreement. |
| 3 | `calib.characteristics.lede` (`i18n.ts:1150`), in the wizard (`CalibrationWizard.svelte:1523`) | These optional values sharpen the fit analysis. Any field can stay blank; where a value is missing, the analysis simply stays broad for that dimension. | Ces valeurs facultatives précisent l’analyse de correspondance. Tout champ peut rester vide. Là où une valeur manque, l’analyse demeure simplement générale pour cette dimension. | "The fit analysis" names Fit. The values feed Markup (its broad-analysis legend omits range and passaggio marks when they are blank, `i18n.ts:751-756`) and Insights (`insights.verdict.*`, `:1501-1504`). | These optional values sharpen Markup and Insights. Any field can stay blank; where a value is missing, the analysis simply stays broad for that dimension. | Ces valeurs facultatives précisent l’Annotation et les Aperçus. Tout champ peut rester vide. Là où une valeur manque, l’analyse demeure simplement générale pour cette dimension. | « Annotation » from `tab.markedScore` (the same COINED running-text use as row 2). « les Aperçus » from `voiceIntake.intro`. The second and third sentences are unchanged. Agreement: « précisent » agrees with « Ces valeurs », feminine plural. The alternative that changes least is to drop "fit" and keep "the analysis" / « l’analyse ». |
| 4 | `upload.banner.reader` (`i18n.ts:913`), the banner after a picture is read (`ScoreUploader.svelte:975`) | Read from a picture. … The words are not in a picture; type them in Text. | Lu à partir d’une image. … Les paroles ne sont pas dans une image; saisissez-les dans Texte. | Text is a document now, not a place to type. The poem is typed in the Input band's field (`Drawer.svelte:539`; `IntakePanel.svelte:370`, which shows `intake.placeholder` "Paste, type, or drop your poem here."). | … The words are not in a picture; type them in Input. | … Les paroles ne sont pas dans une image; saisissez-les dans Entrée. | « Entrée » from `group.input`. The bare name without an article follows `paper.empty.mobile`. Agreement: « les » refers to « Les paroles », feminine plural; the participle does not change. The semicolon has no space before it (OQLF), as now. |
| 5 | `Drawer.svelte:749`, a Guide table-of-contents entry (literal) | Fit forecasts, it doesn’t declare | Fit prévoit, il ne déclare pas | Names Fit. Ruled: "Insights forecasts, it does not declare" (`PRODUCT.md:459`). | Insights forecasts, it does not declare | Les Aperçus prévoient, ils ne déclarent pas | « les Aperçus » from `voiceIntake.intro`; the verbs are from `GuideContent.svelte:58`. Agreement: « Aperçus » is masculine plural, so the verbs are plural and the pronoun is « ils ». Must match row 7 word for word. |
| 6 | `Drawer.svelte:751`, a Guide table-of-contents entry (literal) | Fit’s notation conventions | Conventions de notation de Fit | Names Fit. The conventions described (stems, sage noteheads, crossing boxes, `GuideContent.svelte:350`) are the marked-up score, which is Markup. | Markup’s notation conventions | Conventions de notation de l’Annotation | The frame is from `GuideContent.svelte:71`; « Annotation » is from `tab.markedScore` (the COINED running-text use). Agreement: « Conventions » is feminine plural and « de notation » is invariable. Must match row 8. |
| 7 | `GuideContent.svelte:335` (English) and `:58` (French), the Guide's shown heading | Fit forecasts, it doesn't declare | Fit prévoit, il ne déclare pas | Named in `PRODUCT.md:459` as N.154's. | Insights forecasts, it does not declare | Les Aperçus prévoient, ils ne déclarent pas | As row 5. |
| 8 | `GuideContent.svelte:348` (English) and `:71` (French), a shown heading | Fit's notation conventions | Conventions de notation de Fit | As row 6. | Markup's notation conventions | Conventions de notation de l’Annotation | As row 6. |
| 9 | `LearnContent.svelte:2721` (English) and `:672` (French) | Open Ilya's Transcription tab and paste any short Russian text. | Ouvrez l'onglet Transcription d'Ilya et collez un court texte russe. | No Transcription tab exists. The document is Text (`tab.text`; `destinations.ts:38`). | Open Ilya's Text tab and paste any short Russian text. | Ouvrez l'onglet Texte d'Ilya et collez un court texte russe. | « Texte » from `tab.text`; « onglet » is already in this passage. Agreement: « onglet » is masculine and « Texte » is a proper name, so nothing agrees. |
| 10 | `LearnContent.svelte:2795` (English) and `:746` (French) | Paste ⟨стоит⟩ into the Transcription tab. | Collez ⟨стоит⟩ dans l'onglet Transcription. | As row 9. | Paste ⟨стоит⟩ into the Text tab. | Collez ⟨стоит⟩ dans l'onglet Texte. | As row 9. |
| 11 | `LearnContent.svelte:4059` (English) and `:2054` (French) | …inviting you to paste a curated word or phrase into the Transcription tab. | …à coller un mot ou une phrase dans l'onglet Transcription. | As row 9. | …into the Text tab. | …dans l'onglet Texte. | As row 9. |
| 12 | `LearnContent.svelte:4063` (English) and `:2058` (French) | Ilya's notation toggles in the Transcription tab make these choices visible and reversible | Les sélecteurs de notation d'Ilya dans l'onglet Transcription rendent ces choix visibles et réversibles | As row 9. | Ilya's notation toggles in the Text tab make these choices visible and reversible | Les sélecteurs de notation d'Ilya dans l'onglet Texte rendent ces choix visibles et réversibles | As row 9. « rendent » agrees with « Les sélecteurs », which is unchanged. |

The choice in rows 9 to 12 is yours: "tab" or "document". The pair is built as tabs (`role="tab"`, `DeskHead.svelte:111-118`), but `PRODUCT.md:457` calls them documents. The drafts keep "tab" because it changes one word. Pasting actually happens in the drawer's Input band, not on the Text paper. That was already true of the old wording.

## Guide prose: stale passages, listed only (the rewrite is N.84)

| file:line (English / French) | What is stale |
|---|---|
| `GuideContent.svelte:336` / `:60` | The body of the forecast section names *Fit* four times ("*Fit* forecasts; it does not declare…") |
| `:350` / `:73` | "*Fit*'s analysed score uses…" |
| `:369-370` / `:92-93` (the figure's alt text and caption) | "four tabs at the bottom", "four areas: Transcription, Fit, Learn, and Guide", "The Transcription tab is organised into three sections: Metadata, Analysis, and Notation" |
| `:399` / `:122` | "Return to the Transcription tab." |
| `:408-409` / `:131-132` | "with the Transcribe button visible", "click Transcribe". The button is gone (`IntakePanel.svelte:534-536`). |
| `:553` / `:276` | "Fit's analysis model implements…" |
| `:383` / `:106`, heading and section | "Navigating the tabs": Learn and Guide are now links, not tabs (`DeskHead.svelte:9-10`). The captions call them "the LEARN tab" and "the GUIDE tab". |
| `:344` / `:67` | "entered from the profile summary in the drawer". Where the characteristics are entered now is NOT ESTABLISHED; I did not trace it. |

## Stale strings that are not rendered

These are not shown to the singer, so the freeze rule does not bite. No draft is offered.

- `input.transcribe` (`i18n.ts:173`): "Transcribe and fit", with English in the French slot. Unused since N.145 (`IntakePanel.svelte:534-536`; no call site found).
- `inspector.spotRecon.globalOn` (`i18n.ts:571`): "Cosmetic Options" / « Options cosmétiques ». That heading is now "Notation" (`cosmetic.heading`, `:201`). No call site found for any `inspector.spotRecon` key.
- `upload.continue` (`i18n.ts:899`): "Continue to analysis". Removed by N.145 (`ScoreUploader.svelte:963-966`); no call site.

## Correct, but I was unsure

- `calib.welcome.lede` (`i18n.ts:1063`): "…applied to your repertoire to determine how well it suits your voice". "Determine" declares, against `PRODUCT.md:459`. A possible change: "to forecast how well it suits your voice" / « pour en prévoir la correspondance » (« prévoir » from `GuideContent.svelte:58`).
- `insights.fit.heading` (`:1475`) "The fit, in its terms" and `insights.verdict.fit` (`:1501`) "This key seems like a good fit for you.": "fit" is the ordinary word here, not the surface, and the verdict is hedged. I left both.
- The forecast heading (rows 5 and 7). The ruling says Insights. The section's source comment calls it "the statement of what the Markup page is" (`GuideContent.svelte:331-333`), and its body describes timbre turns and passaggio, which Markup marks. The draft follows the ruling.
- `profile.provisional.noneMessage`, `.sentenceSingular`, `.sentencePlural` (`i18n.ts:1182`, `:1186-1187`): "the drawer on the left". This is true on desktop. On the phone the drawer is at the bottom (`paper.empty.mobile`, `:714`). NOT ESTABLISHED whether this Markup page shows these lines on the phone.
- `group.scoreMarkup` « Voix » (`:57`): the comment says it is a desk proposal awaiting your ratification (`:51-53`).
- `PRODUCT.md:507` gives the drawer path as "Piece, Input, Text, Score markup, Voice". The drawer renders three bands, Piece, Input, Voice (`Drawer.svelte:516`, `:539`, `:553`). This is a memory-file discrepancy, not a string.

## English and French that disagree in meaning

- `profile.scoreRegionAria` (`i18n.ts:1198`): "Repertoire fit score" against « Partition annotée du répertoire ». Fixed by row 1.
- `inspector.glossMissing` (`:549`): "No translation available for this form." against « Aucune traduction française disponible… ». The French adds "French".
- `Drawer.svelte:745`, a Guide table-of-contents entry: "Is Ilya an AI tool?" against « Ilya et l’IA ». The French heading it points to is a question (`GuideContent.svelte:39`).
- `insights.fit.heading` (`:1475`): "in its terms" against « terme par terme » ("term by term"). The difference is slight.
- `profile.provisional.noneMessage` « tiroir de gauche » against its siblings' « tiroir à gauche » (`:1182` against `:1186-1187`). The meaning is the same and the form differs.

## Counts

- 12 stale rendered strings were drafted (rows 1 to 12). Rows 5 to 8 are two headings, each with its table-of-contents twin.
- 8 Guide passages were listed without drafts.
- 3 stale strings are unrendered.
- 1 COINED French use: « l’Annotation » as a running-text noun with an article (rows 2, 3, 6, 8).
- Keys whose names contain "fit": 22 (21 `insights.fit.*` and `insights.verdict.fit`), counted with `grep` on `i18n.ts`, not the 35 the brief states.

## Rulings

- **Rows 1 to 4 RATIFIED by Dann 2026-09-28 14:54** (*"ratified"*), exactly as drafted in the table, English and French. Drafted by an Opus agent and put to him by the desk; the coined running-text « l'Annotation » (row 2, row 3) is ratified with them.
- **Rows 5 to 8 RATIFIED by Dann 2026-09-28 14:55** (*"Ratified"*), as drafted: "Insights forecasts, it does not declare" / « Les Aperçus prévoient, ils ne déclarent pas », and "Markup's notation conventions" / « Conventions de notation de l'Annotation », heading and table-of-contents entry alike.
- **Rows 9 to 12 RATIFIED by Dann 2026-09-28 14:58**, REDRAFTED from the table. The desk's redraft, edited by Dann (*"Paste your Russian text into the Input field."*); the desk kept lowercase "the drawer" / « le tiroir » on the rule of `i18n.ts:714` (capital = the button's label, lowercase = the panel):
  - Row 9: "Paste your Russian text into the Input field." / « Collez votre texte russe dans le champ Entrée. »
  - Row 10: "Paste ⟨стоит⟩ into the Input field." / « Collez ⟨стоит⟩ dans le champ Entrée. »
  - Row 11: "…into the Input field." / « …dans le champ Entrée. » (replacing "into the Transcription tab" / « dans l'onglet Transcription »)
  - Row 12: "Ilya's notation toggles, in the drawer, make these choices visible and reversible" / « Les sélecteurs de notation d'Ilya, dans le tiroir, rendent ces choix visibles et réversibles »
- **Row 4 AMENDED, ratified in the same breath:** "…type them into the Input field." / « …saisissez-les dans le champ Entrée. »
- « champ » from `calib.characteristics.lede`; « tiroir » from `paper.empty.mobile`.
