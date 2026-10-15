# Report: row 97, the old name "Fit" leaves everything a singer reads

Cloud lane, branch `cloud-lane-5`, after row 95 (`02f7c4d`). Built on `Shane` at `50a5f85`.

## The answer in three lines

1. The three ratified passages (A, B, C) are seated in both languages, and the two forecast headings are replaced. No Guide or i18n string a singer sees says "Fit" as the tool's name, except the two `<figcaption>` elements at `GuideContent.svelte:94` and `:381`, which §2 measures and does not reword.
2. A guard (`apps/web/src/lib/no-fit-name.test.ts`, 24 tests) fails if "Fit" returns. Run against the old Guide it fails 18 tests; against the new one it passes.
3. Gates: only web test moved, 2483 to 2507 (+24, all in the new file). Nothing else moved.

## Each passage as built

All six paragraphs are one line each, in place of the old paragraph at the same line number, so no later line moved: A `:347` EN and `:61` FR; B `:361` EN and `:74` FR; C `:564` EN and `:277` FR. Headings: `:346` and `:59`.

The text was extracted from `docs/sessions/ratified-guide-abc_2026-10-14.md` by script, not retyped, then converted by these rules (Fable's amendments 14 to 16):
- **Apostrophes:** typographic U+2019 in all six, as `:564` and `:277` already used. The ratified file's straight marks became ’ (« d’une », « L’Annotation », « Insights’ forecast », « Grayson’s »).
- **French colons:** U+00A0 before each, written as the literal character, as `:61` and `:74` did (the ratified file writes ASCII spaces; `i18n.test.ts:141-153` fails on them). Three colons in A and B. No guillemets in these passages.
- **Markup:** `<em>` on *Russian Lyric Diction*, on every *Ilya* in A, B and C, and on *zona di passaggio* in FR A only (EN A keeps it roman, as `:347` had it; the French italics gate needs the `<em>`). *f*R1/*f*o as `<em>f</em><sub>R1</sub>/<em>f</em><sub>o</sub>`. Text, Markup, Insights, Texte, Annotation, Aperçus bare. C's lead-in in `<strong>`, as before.
- **Struck line:** C no longer carries the attribution to Dann Mitton's *Sung Russian…* (struck 21:31).

Quoted from the tree, the first and last words of each (full text is pinned by the test file and equals the ratified file under the rules above):
- **A EN `:347`:** « From a handful of fry samples on a consumer mic, <em>Ilya</em> measures your resonances, and Insights forecasts … equipping you with specific challenges to bring to your teacher. »
- **A FR `:61`:** « À partir d’une poignée d’échantillons en friture vocale sur un micro grand public, <em>Ilya</em> mesure vos résonances, et les Aperçus prévoient … des défis précis à aborder avec votre professeure ou professeur. »
- **B EN `:361`:** « Markup draws its notation conventions from Mitton (2020, Appendices B and C). … The text underlay offers the same IPA values imported from Text that correspond with the Cyrillic lyrics. »
- **B FR `:74`:** « L’Annotation tire ses conventions de notation de Mitton (2020, annexes B et C). … Sous la portée, le texte reprend les mêmes valeurs API, importées du Texte, en regard des paroles cyrilliques. »
- **C EN `:564`:** « <strong>Scholarship.</strong> The phonological engine operationalizes Craig Grayson’s <em>Russian Lyric Diction</em> … sung-vowel modification advice. »
- **C FR `:277`:** « <strong>Recherche savante.</strong> Le moteur phonologique met en œuvre <em>Russian Lyric Diction</em> de Craig Grayson … des conseils de modification vocalique. »
- **Headings** (`id="guide-markup-forecast"` kept on both): `:346` « What Insights forecasts »; `:59` « Ce que prévoient les Aperçus ».

Wording changes beyond the ratified text: none. The ratified C says "main phonological authority" and the old said "sole"; that is the ratified text.

## §2 The picture captions: measured, not reworded

**Old pictures (`apps/web/static/guide/`), pixel size as stored:** `guide-step-01.webp` 1200 x 1043; `guide-step-13.webp` 1200 x 668. Whether either is a 2x capture, and at what viewport it was taken, is **NOT ESTABLISHED**: the files carry no such record that I could read, and 1200 px is below the 1,400 px the desk layout needs (`ENVIRONMENT.md:4393-4395`), so they are almost certainly scaled exports.

**Today's screens** (`docs/sessions/row97-guide-shots/`), drawn by the dev server in the sandbox's Chromium at 1440 x 900, device scale factor 1, English, a fresh load with no score:
- `today-step-01_1440x900.png`: the app as it opens.
- `today-step-13_1440x900.png`: the same with the PIECE section opened.

Both screens could be drawn here: neither needs the reader (the reader's Pyodide cannot load in the cloud, `ENVIRONMENT.md:4552`). The French screens were **not drawn**; the table reads the English screen, and the French captions (`:94`, `:123`) say the same things.

| Caption | Statement | What the screen shows now |
|---|---|---|
| `:381` EN, `:94` FR (step 01) | "The four tabs at the bottom navigate between Ilya's four areas: Transcription, Fit, Learn, and Guide." | No tabs at the bottom. Above the paper: a three-part control, TEXT, MARKUP, INSIGHTS, and two links at the right, LEARN and GUIDE. Five destinations on screen, not four; "Transcription" and "Fit" are not names on screen. |
| same | "The Transcription tab is organised into three sections: Metadata, Analysis, and Notation." | The drawer has three accordions: PIECE, INPUT, VOICE. Notation and Analysis are two subsections inside INPUT; "Metadata" is not on screen (it is PIECE). Nothing on screen is called "Transcription tab"; the open document is TEXT. |
| same | "Ilya opens with the Drawer on the left and the WYSIWYG Paper on the right." | Drawer on the left and paper on the right still holds. The words "Drawer" and "WYSIWYG Paper" are not on screen, so the terms are neither confirmed nor contradicted. |
| `:380`/`:93` alt text of step 01 (not a caption) | "…showing three Drawer sections and four navigation tabs." | Three accordions, but not those three; five navigation items. Same fault as the caption. |
| `:410` EN, `:123` FR (step 13) | "Return to the Transcription tab." | No Transcription tab. The document is TEXT. |
| same | "Enter an aria or song title, opus number, or song cycle." | Holds: the fields read "Aria or song title" and "Opera, song cycle, opus number", plus Composer, Poet or librettist, Translator. |
| same | "These fields (called Metadata in Ilya) populate the header at the top of the paper document." | The header at the top of the paper does fill from them ("Aria or song title"). The drawer section is called PIECE, not Metadata. |
| same | (not stated) | On a fresh load PIECE is closed and INPUT is open; the singer has to open PIECE to see the fields. |

**A finding about the old picture itself.** Read by eye, `guide-step-13.webp` does not show the metadata fields at all. It shows a syllable-correction card for «Онегин», an orange tap marker, a Notation toggle list, and a page of word cards. So the picture is already out of step with its own caption and its alt text (`:409`, `:122`: "The Metadata section of the Drawer…"). The other old picture, step 01, shows a layout with "English | Français" as two buttons, a bottom tab bar (TRANSCRIPTION, LEARN, GUIDE, three tabs not four), and a single column of METADATA, ANALYSIS, and NOTATION. So even the old step-01 picture shows three tabs, not the four its caption names. Today's screen has one language button, « Français ».

## §3 Every other user-facing "Fit"

Searched `i18n.ts` values, `GuideContent.svelte`, `LearnContent.svelte`, every `.svelte` and `.ts` file under `apps/web/src`, `alt`, `aria-label`, and `title` attributes, `app.html`, and `static`'s HTML and JSON. The PDF and print path draws from the same components and strings; no separate string file was found.

- **Drawn, still reading "Fit":** only the two figcaptions (`GuideContent.svelte:94`, `:381`), §2's.
- **`i18n.ts` values:** none say "Fit". The values of the `insights.fit.*` keys (`:1609-1629`) are ordinary words about measurement; the key names are legacy and the file's own comment (`:83-86`) says so. `insights.verdict.fit` (`:1638`) says "a good fit for you" (the English noun, lowercase), not the tool's name.
- **`input.transcribe` (`i18n.ts:255`):** "Transcribe and fit" in both languages. **Not drawn by any component.** The only reference outside `i18n.ts` is a comment at `IntakePanel.svelte:532-535`, which records N.145's decision to keep `input.transcribe` and `input.transcribeLoading` (`i18n.ts:256`) unused. Following the desk default (a), both keys stay, are exempted from the guard by name, and the N.145 record stays true. The key's value is lowercase "fit", so the guard's pattern would not trip on it anyway; the exemption is documentation.
- **Code comments naming "Fit"** (history, left): `i18n.ts:84, 181, 185, 195-196`; `PageFit.svelte:29` (the verb, not the name); `NotationFields.svelte:12`; `MetadataFields.svelte:4`; `DeskHead.svelte:63`; `ProfileSwitcher.svelte:187`; `CalibrationWizard.svelte:1124, 1260, 1745`; `MarkupPane.svelte:210, 800`; `Loupe.svelte:2499`; `vowel-resolver.ts:469`; `+page.svelte:5039`; and `GuideContent.svelte` comments such as `:343`. `voice/engine/stand-ins.ts` uses `Fit` as a TypeScript type name for a curve fit, not the product.

## §4 The guard

`apps/web/src/lib/no-fit-name.test.ts`, 24 tests:
- The pattern `/\bFit\b/` (case-sensitive, so it matches `<em>Fit</em>` and `Fit’s` and not `fit`, `Profit`) is itself tested.
- No `i18n.ts` value says Fit in English or French, excluding the two exempt keys named above; the exemption is shown not to be vacuous.
- The Guide is read as source, as `french-italics.test.ts:89-96` and `i18n.test.ts:141-153` do: `<!-- -->` comments stripped, split at `{#if language === 'fr'}` and `{:else}`, `<figcaption>` stripped, the remainder searched. Both branches clean.
- The figcaptions that still say Fit may only be at the two listed lines, 94 and 381; a third fails the test, and when a later row rewrites them the list can be emptied.
- Both headings read as ruled and keep their `id`; the old "it does not declare" wording is absent.
- 13 pins for the opening and closing of A, B and C in both languages, the three French colons with U+00A0, and the struck attribution gone from C (scoped to the C paragraph, because the title *Sung Russian for the Low Male Voice Classical Singer* is properly cited elsewhere in the Guide).

Mutation check: with the old `GuideContent.svelte` restored, 18 tests fail; with the new one, none.

## The eight gates

| Gate | Baseline (`50a5f85`) | After row 95 | After row 97 |
|---|---|---|---|
| 1 phonology | 251 | 251 | 251 |
| 2 dictionary | 248 | 248 | 248 |
| 3 web check | 0 errors, 12 warnings in 5 files | same | same |
| 4 web test | 2474 | 2483 | **2507** (+24, `no-fit-name.test.ts`) |
| 5 score-parser | 675 passed, 5 skipped | same | same |
| 6 blurb | 145 | 145 | 145 |
| 7 integration | 55 | 55 | 55 |
| 8 ratchets | OK | OK | OK |

`french-italics.test.ts`'s "the Guide sets passaggio in italics" still passes (the French Guide has other `<em>passaggio</em>`). `+page.svelte` untouched.

## Could not establish

- **The viewport and scale factor the old pictures were taken at** (§2). Only their stored pixel sizes are known.
- **The French screens.** Not drawn; the French captions were compared by text only.
- **A reading by Dann of the passages.** They are Dann's ratified text; no one has seen the built page. I rendered no screenshot of the Guide itself, only the two app screens above.
- **The Learn page.** No "Fit" in `LearnContent.svelte`; the page was not otherwise read for other stale names, which is outside this row.
