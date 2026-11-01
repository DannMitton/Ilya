# Fable review of the row 171 brief (the Guide names what is on screen today), r1, 2026-11-01

Brief reviewed: `docs/sessions/brief-code-row171-guide-names-audit_r1_2026-10-31.md`, with `guide-formatting-review_r1_2026-10-31.md` and `inventory-controls_r1_2026-10-31.md`, against the tree at `cab8d205` on `Shane` (read-only, through the bridge). Every `path:line` below was read this session. NOT ESTABLISHED beats a complete invented answer.

**Verdict: SEND WITH AMENDMENTS.** Twelve amendments. Steps 0 to 5 cite the tree correctly (every Table B line and every `i18n.ts` line checked; two citation slips, amendments 9 and 10). Step 6, the guard, cannot pass the gates as written: two of its retired names sit inside ratified Guide passages that the guard itself pins.

**Order assumed.** The brief is written for either order and says so (Scope, "Depends on row 170"). It is correct in both orders for steps 0 to 5. Its one order-dependent instruction, adding "Markup" and « Annotation » to the guard once row 170 has landed, is correct only if row 170 also reworded ratified passages B and C and their pins (`apps/web/src/lib/no-fit-name.test.ts:104-111`), which row 170 cannot do without Dann's ratification of new text. Amendment 2 removes that dependency.

## Amendments

**1. The guard's bare « poignée » fails on ratified passage A.** Evidence: `GuideContent.svelte:67` begins « À partir d’une poignée d’échantillons en friture vocale », pinned at `no-fit-name.test.ts:101`. « poignée » there means a handful, not the drawer handle; the drawer handle is at `:111` (alt) and `:112` (caption) only. Replace, in "Retired names (the guard's list)", French: « poignée » with « poignée du Tiroir », « La poignée », and « sa poignée » (the three forms at `:111-112`; `:67` is exempt by construction). Add the sentence: "Every guard pattern is a phrase, never a bare word, and the guard's own test asserts that `GuideContent.svelte:67` (ratified passage A) still passes."

**2. Drop the conditional "Markup" and « Annotation » guard entries from this row.** Evidence: the Guide names the document at `GuideContent.svelte:376` (heading), `:378` and `:581` (English), `:80` (heading), `:82` and `:285` (French); `:378`, `:581`, `:82`, and `:285` are ratified passages B and C, pinned at `no-fit-name.test.ts:104-111` ("Markup draws its notation conventions", « L’Annotation tire ses conventions », "Markup and Insights implement", « L’Annotation et les Aperçus »). A guard on those words fails those pins. Replace the last sentence of "Retired names" with: "Row 170 owns the Markup and Annotation census, including the ratified passages B and C and their pins; this row adds no guard entry for them."

**3. Step 6 must also retire the figcaption stripping, not only the two exceptions.** Evidence: `no-fit-name.test.ts:36` defines `stripFigcaptions`, `:67` applies it to the Guide branches, and `:73-77` tests that only the two known figcaptions say Fit; after step 2 rewrites `:102` and `:398`, that test is vacuous. Replace "Remove its two `KNOWN_FIGCAPTIONS` exceptions" with: "Remove `KNOWN_FIGCAPTIONS` (`:29`), `stripFigcaptions` (`:36`) and its call (`:67`), and replace the test at `:73-77` with one asserting that no `<figcaption>` in either branch matches any retired pattern. Alt text needs no change to the method: `alt` attributes are already in the branches."

**4. Exempt Contributors by anchor, not by line.** Evidence: the guard's own note at `no-fit-name.test.ts:26-28` says names, not line numbers; the anchors are `<h2 id="guide-contributors">` (`GuideContent.svelte:202`, `:498`) and `<h2 id="guide-licences">` (`:279`, `:575`). Replace "(FR about 202 to 278, EN about 498 to 575)" with: "cut each branch between `<h2 id="guide-contributors">` and `<h2 id="guide-licences">`, and assert both anchors are found."

**5. Give the guard concrete patterns for three names that also occur as ordinary words.** Evidence: « Transcrire » is the section heading at `GuideContent.svelte:144` ("Transcribing" at `:440`), not a button; « métadonnées » lowercase is the ordinary noun at `:96`, `:127` (heading « Renseigner les métadonnées »), `:147`, `:193`, `:195`, and "metadata" at `:392`, `:423`, `:427`, `:489`, `:491`; « Métadonnées saisies » at `:141` is the noun at sentence start. Add to "Retired names": "Patterns: « cliquez sur Transcrire » and "click Transcribe" (the `:144` and `:440` headings stay); "called Metadata", « appelés Métadonnées », « section Métadonnées », « sections : Métadonnées », "sections: Metadata", "The Metadata section" (the lowercase noun stays everywhere)."

**6. Step 3 touches ratified passage A.** Evidence: Table A row A-EN-9 italicises *zona di passaggio* at `GuideContent.svelte:362`, which is passage A, ratified 2026-10-14 21:40 (`ratified-guide-abc_2026-10-14.md`) and pinned by its opening and closing words at `no-fit-name.test.ts:99-100`; the pins would survive, the ratified text would not. Add to step 3: "A-EN-9 alters ratified passage A; apply it only if Dann says yes (one question in the report), otherwise leave `:362` as ratified." The French mirror (`:67`) already carries the italics.

**7. FR 84 and EN 380 are owed a whole replacement.** Evidence: `ratified-guide-break-paragraph_2026-10-21.md` ("the old paragraph at `:380` and `:84` is replaced whole by this one when row 139 is built"); row 139 is DONE (`QUEUE.md:84`); the Guide has no "syntactic break" or « frontière syntaxique » (grep count 0); the ratified text ends « s’écrit alors # sur la ligne API » with no brackets (INBOX 2026-10-25 23:38, "bare octothorpe is fine"). Add to step 3: "Apply `<code>[#]</code>` as ruled, and report that the paragraph at `:84` and `:380` is owed its ratified replacement (`ratified-guide-break-paragraph_2026-10-21.md` as amended by `draft-guide-break-how-to-place_r1_2026-10-21.md`), not this row's work."

**8. One class name for the chip.** Evidence: no `ui-button` and no `guide-key` exists in `apps/web/src` today (grep, 0 hits); the ratified how-to-place text uses `<span class="guide-key">` (`draft-guide-break-how-to-place_r1_2026-10-21.md:15`); the review calls `ui-button` "a placeholder class name" (`guide-formatting-review_r1_2026-10-31.md`, conventions paragraph). DESK DEFAULT: adopt `guide-key`, the ratified text's name, so row 169 builds one class. Replace `class="ui-button"` in step 3 with `class="guide-key"`.

**9. Citation slip, B-15.** Evidence: `HeaderBar.svelte:23-24` is comment text; the label is computed at `:32-33` (`other`, `label`) and drawn at `:56`. Replace "`HeaderBar.svelte:23-24`, `:56`" with "`HeaderBar.svelte:32-33`, `:56`".

**10. Census gap, B-9.** Evidence: "the Dictionary tab" also sits in alt text at `GuideContent.svelte:470` and « l'onglet Dictionnaire » at `:174` (step 32's image). Replace "B-9 | FR 164-165, 179; EN 460-461, 475" with "FR 164-165, 174, 179; EN 460-461, 470, 475".

**11. B-2's new wording must not promise tabs the public build may not draw.** Evidence: `DeskHead.svelte:54` draws Markup and Insights only when `INCLUDE_MARKUP_INSIGHTS` is true; `apps/web/.env:1` sets it true here; which build singers meet is NOT ESTABLISHED (the brief's own last section). Add to B-2: "Name Text first and the two voice documents as 'when your build includes them', or report the build question and name all three; do not assert three tabs as fact."

**12. Step 7 points outside the tree.** Evidence: no file under `docs/` carries a "Capture method" section or a shot "S06-D" except the brief itself (grep over `docs/sessions/*.md`); `INBOX.md:528` places the headless capture script at `~/Desktop/Ilya assets/Guide work 2026-10-31/`, which a cloud Code session cannot read. Replace "with the headless capture method in the storyboard doc ("Capture method")" with the script's exact repository path, or inline the command; otherwise mark step 7's capture NOT ESTABLISHED and have Code use the row 97 method (`report-code-row97-fit-out-of-the-guide_r1_2026-10-14.md`, which rendered two app screens).

## Census (item 2), `GuideContent.svelte` at `cab8d205`, lines by grep

| Name | French lines | English lines | Note |
|---|---|---|---|
| Transcription tab | 102, 131 | 398, 427 | matches Table B |
| Transcribe button | 140 (alt), 141 | 436 (alt), 437 | 144 and 440 are headings, stay |
| Fit as a tab | 102 | 398 | the two caption exceptions |
| Ribbon, Inspector | 159 (alt), 160, 262, 272 | 455 (alt), 456, 558, 568 | 262, 272, 558, 568 are Contributors |
| Metadata as a section | 102, 130 (alt), 131 | 398, 426 (alt), 427 | lowercase noun elsewhere stays |
| Drawer handle | 111 (alt), 112 | 407 (alt), 408 | 67 is « poignée » = handful, ratified |
| Clear text | 195 | 491 | |
| Dictionary tab | 164, 165, 174, 179 | 460, 461, 470, 475 | 174 and 470 missed by B-9 |
| My assignment tab | none (179 says « bouton ») | 475 | |
| LEARN, LEÇONS, APPRENDRE, GUIDE | 30, 48, 262 | 325, 343, 403, 414, 415, 419, 558 | 366 is a comment |
| Score markup, Partition annotée | 0 | 0 | guard entries only |
| Word Stack, Pile de mots | 148, 153 | 351, 444, 449 | kept by ruling |

Learn (`LearnContent.svelte`): none of the retired names appears (Transcription, Transcrire, Fit, Ribbon, Ruban, Inspector, Inspecteur, Metadata, Métadonnées, Clear text, Effacer le texte, Handle, semicircle, Score markup: 0 each). "Transcribe" appears ten times as a verb in exercises (for example `:4008`, `:4014`); LEARN and LEÇONS in capitals appear seven times each (`:26`, `:30`, `:34`, `:676`, `:2015`, `:2041`, `:2049`; `:2062`, `:2066`, `:2070`, `:2712`, `:4020`, `:4046`, `:4054`), outside this row's scope (Learn is out, per Scope) and so for row 169. « la mélodie russe » once, `:2031`, as the brief says; no « romance ».

## Labels confirmed drawn (item 3)

Text, Learn, Guide: `DeskHead.svelte:115-124`, `:128-133` through `label()` at `:57-70`. Language pill: `HeaderBar.svelte:33`, `:56`. Drawer and Paper pull: `Drawer.svelte:887-900`, phone only (`:886`). Piece, Input, Voice: inventory C019, C044, C090 (`Drawer.svelte:486-495`; not re-read, taken from the inventory). Analysis: `AnalysisStation.svelte:67-72`. Dictionary: `InspectorPanel.svelte:989-997`. Spot reduction / Spot reconstitution and the French pair: `:58-62`, drawn `:1010-1023`. My assignment: `:1317-1319` and `:1337-1339`. Clear / Retirer: `IntakePanel.svelte:452`, `:454`, `:462`. Export this song: inventory C042 (`RootPanel.svelte:175`; not re-read). The seven toggles: `i18n.ts:287-300`, inventory C063 to C069. Full entry unavailable: `InspectorPanel.svelte:1054`, `:1073`. Fields: inventory C020 to C022 (`MetadataFields.svelte:100-131`; not re-read). Cmd+Enter: `IntakeViews.svelte:213-219`; the pause is `QUIET_MS = 600` (`one-action.ts:41`, used at `+page.svelte:2556`), which B-5's wording may cite.

## From the singer's side (item 4)

- B-5: on a phone there is no Cmd+Enter. The wording leads with "Ilya transcribes on its own after a short pause" and gives the key chord as the keyboard shortcut. The caption's "about three seconds" (`:141`, `:437`) is NOT ESTABLISHED; drop it or measure it.
- B-11: the tab bar renders its labels in capitals by style (`DeskHead.svelte:201` and `:245`, `text-transform: uppercase`), so a singer sees LEARN and GUIDE on screen. The review left this NOT ESTABLISHED; it is established. Whether the Guide writes Learn or LEARN is taste (Questions for Dann).
- B-9: Dictionary and My assignment appear only after a word is selected and, for My assignment, only while a stress circle or ё sigil chooser is open (`AnalysisStation.svelte:80-81`; `InspectorPanel.svelte:1309-1345`). The new sentence says "select a word, then".
- B-7 French: « Tiroir » and « Papier » are already the file's words (`:102`, `:148`); nothing new.

## Ratified text (item 5)

Touched without saying so: A-EN-9 at `:362` (amendment 6). Slated for replacement: `:84` and `:380` (amendment 7). Safe: the row 123 pins (`ratified-lines.test.ts:150-175`) end at "To review the authoritative poem" / « Pour consulter à tout moment », so A-EN-5 and A-FR-5 ("choose Poem in Text") fall outside them; whether the rest of the `guide-witnesses` paragraph (`:38`, `:333`) is ratified text is NOT ESTABLISHED (commit `757dc61c`, record not read). The teacher paragraph (`:364`, `ratified-lines.test.ts:76-96`) and the Licences lines (rows 90, 94) are untouched by the brief. Contributors: B-10 and A-EN-28 change « APPRENDRE » and "LEARN" at `:262` and `:558`, and step 4 splits em dashes at `:260-274` and `:556-570`, while the DESK DEFAULT says "those credits stay as written"; add one clause to step 6: "stay as written except the module name and the em dashes".

## Ratchets (item 6)

`GuideContent.svelte` is 640 lines, unlisted, under `newFileMaxLines` 1000 (`scripts/ratchets.json:3`). `LearnContent.svelte` is 4086 against a ceiling of 4099 (`ratchets.json:9`); step 5 changes one word. `i18n.ts` is exempt (`ratchets.json:5`); tests are exempt from size (`ratchets.mjs:37`, `:61`). `InspectorPanel.svelte` (ceiling 2432, `ratchets.json:12`) is not touched. No ceiling is at risk.

## French (item 7)

- The app disagrees with itself: the checkbox says « Réduction ciblée » / « Reconstitution ciblée » (`InspectorPanel.svelte:58-62`, literals) and the printed legend says « Reconstitution ponctuelle » (`i18n.ts:914`, mapped at `provenance.ts:154`); English says "Spot reconstitution" in both. A-FR-19 adopts « ciblée » because it is on the checkbox. Dann's call (Questions).
- « Retirer » (A-FR-24), « Texte », « Leçons », « Analyse », « Entrée », « Annotation », « Aperçus », « Tiroir », « Papier » are all in the file or in `i18n.ts`; no new French is written by steps 1 and 2 beyond the marked drafts the brief already requires.
- « Pièce » and « Voix » as band names are `i18n.ts:135` and `:139`, verbatim; the Guide's French has not used them before. Allowed by the brief's French rule.
- `i18n.ts:277` « Opéra, cycle de mélodies, numéro d’opus » names art song as « mélodies »; step 5's convention (Russian art song is « romance ») does not reach a generic label, so it stays; noted so Code does not touch it.

## Questions for Dann

1. Taste: the tab bar shows LEARN and GUIDE in capitals by style (`DeskHead.svelte:201`, `:245`). Write the Guide's references as Learn and Guide (the label as keyed, the brief's choice) or as the singer sees them? Recommendation: as keyed, since the capitals are presentation and the chip or bold already marks the word as a place.
2. French: « Reconstitution ciblée » (the checkbox) or « Reconstitution ponctuelle » (the legend, `i18n.ts:914`)? One should win across the app; this row writes whichever you name into the Guide and reports the other as owed.
3. A-EN-9: italicise *zona di passaggio* inside ratified passage A at `:362`, as the French at `:67` does? Yes or no.

## Not established

- Which build singers meet (with or without `PUBLIC_INCLUDE_MARKUP_INSIGHTS`), so whether three tabs or one are on their screen.
- Whether the tab bar sits at the bottom on any device (unchanged from the brief).
- Whether the `guide-witnesses` paragraph beyond the row 123 sentences is ratified text.
- The storyboard, shot list (S06-D), and headless capture script: not in the tree; `INBOX.md:528` places them under `~/Desktop/Ilya assets/Guide work 2026-10-31/`, which this review did not open.
- The "about three seconds" timing at `:141` and `:437`.
- Lines taken from the inventory and not re-read this session are marked "not re-read" above.
