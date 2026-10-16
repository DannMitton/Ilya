# Brief: Input gets two views, Poem and Lyrics (N.135 stage 3's first slice; r1)

Desk (Fable 5.1), 2026-10-16 about 01:10. For Code in the cloud lane, Opus, on a new branch `cloud-lane-11` cut from `origin/Shane` at `01b638a` or later; one dedicated branch, no pull request, Dann merges (`docs/memory/CONTRACT.md` §4). Every `path:line` below was read in a clone of `Shane` at `01b638a` on 2026-10-16 between 00:55 and 01:10. Fable's review of this brief is applied before Code gets it (`CONTRACT.md` §1 item 19).

Ruled by Dann 2026-10-16 00:32 to 00:51 in dialogue with the desk; the ruling, his words, and each default with who offered it are in `docs/memory/OPEN.md`, section "N.135 STAGE 3: TWO VIEWS OF INPUT, POEM AND LYRICS". Read that section whole before anything else, then `docs/memory/CONTRACT.md` whole, then `docs/sessions/memo-n160b-the-approach_r1_2026-09-21.md` (the seated-text re-seat this brief leans on).

## 1. What the singer sees and gains

Today Input is one field. It is labelled "poem" (`apps/web/src/lib/i18n.ts:730`, `:245`), but what seats the notes is whatever is in it, so on 2026-10-14 Dann had to retype Tolstoy's poem as Tchaikovsky set it, repeats and the score's punctuation included, before 172 of 172 notes seated, and the Text tab then showed the retyped text, not the poem (`QUEUE-archive.md:188`). One field cannot hold two texts.

After this brief, above the field's top right corner sits the segmented pair the tab bar already uses, **Poem | Lyrics**. **Poem** is the poet's published text, the origin: lines and stanzas, the poet's punctuation and capitals, no hyphens, no repeats. **Lyrics** is the sung text: the composer's words, repeats, omissions, and alterations, syllabified with hyphens, in the edition's spelling. Under the control, one line always says which view this is. In Lyrics, every word that differs from the poem is coloured sage, repeats included; hyphens are never coloured. In Poem, words the song does not set are muted grey, never altered. A file dropped on the field goes where its content belongs whichever view shows, and the line says where it went. Text and Markup draw from Lyrics, as they draw from the one field today, so nothing the singer sees on the page changes except that the poem has a home.

The singer gains the poem back without losing the seating, and a two-tap comparison of what the composer did to the poem.

## 2. What is established, and what are leads

Established, read 2026-10-16:

- **The one text.** `SongRecord.poem: string` (`apps/web/src/lib/library/types.ts:95`) loads into `doc.inputText` (`library.ts:79`; `document.svelte.ts:66`, snapshot `:263-275`) and is written back as `poem` (`library.ts:117`). Every optional field added since is additive with no schema bump, and `validateRecord` copies only what it knows, so an older Ilya importing a newer binder drops the field (`types.ts:111-127` `seatedText`, `:141` `transposition`, `:158` `octaveReading`, `:167` `tempo`; `RECORD_SCHEMA = 1`, `:195`).
- **What seats.** Text and Markup derive from `doc.inputText`: `lines` are its transcription, `poemQueue` feeds `slotQueue` (`+page.svelte:383-384`); a score's own words seat through `seatScoreWords` only while `doc.inputText === scoreText` (`:400`, `:623-624`, `:2019`).
- **The re-seat that keeps hand placements.** N.160 step 3: a changed text is diffed against the stored `seatedText` and only the changed syllables move (`+page.svelte:1975-1985`; `seated-text.ts:26`, 33 lines; tests `seated-text.test.ts`). This is the mechanism for the ruling's default 2 (an edit in Lyrics re-seats only what changed).
- **The derived poem.** With the field empty and a score carrying words, Text shows the score's words transcribed and the drawer shows them as a poem from the score, derived and never stored until the singer's first act claims them (`+page.svelte:402-419`, Dann's ruling of 2026-09-24 quoted there; `poemFromScore` `:400`; `derivedPoem` `:419`).
- **Clear.** `handleClear` empties `doc.inputText`, the lines, the transcription state, and the glosses (`+page.svelte:2135-2151`); the panel's Clear button is `IntakePanel.svelte:461`, shown only when the poem is not derived.
- **The panel.** `IntakePanel.svelte` (1000 lines): props `oninput`, `onflush`, `onclear` (`:60-70`); the textarea (`:371-381`, placeholder `intake.placeholder`); the drop frame is the whole intake, a file drop is taken and a text drop is not (`:205-222`, `:349-359`); the hint line (`:403`, `intake.dropHint`); the receipts with their tags and Clear/Replace (`:452-473`).
- **The pair control.** `DeskHead.svelte:116-126` is the markup (`button.pair-member`, `role="tab"`, `aria-selected`, roving tabindex, `handlePairKeydown`); its styles are scoped there, `:193-224`.
- **Where a dropped file goes today.** `ScoreUploader.svelte:280-299`: a page with staves goes to the reader; a page without goes to the poem path; a PDF with a text layer yields its text straight to `onpoem` (`:398-407`), else the page is OCR'd as a poem; the OCR reading passes `ocr-guard.ts` (refused when mostly not Russian words, `:1-30`). `pendingPoemFallback` (`:285`) lets a failed score read fall back to the poem path.
- **Modernization and the dictionary** for the comparison: `isKnownWord` (`pipeline.ts:264`); `modernisePreReform` is used at `pipeline.ts:565`.
- **Strings today:** `input.watermark` poem / poème (`i18n.ts:245`), `intake.placeholder` (`:730`), `intake.caption` (`:742`), `intake.clear` and `intake.replace` (`:762-763`), `intake.dropHint` (`:767`), `meta.fromScore` (`:900`). The file's French for the sung words and the score: « paroles imprimées », « votre propre partition », « champ Entrée » (`:1021`); « Ce chant » for a song (`:1454`).
- **Ceilings** (`scripts/ratchets.json`): `+page.svelte` is 5651 lines against a ceiling of 5652; `IntakePanel.svelte` has no ceiling; a new file stays under 1000 lines; `i18n.ts` is exempt. The eight gates at `01b638a`, measured on the Mac 2026-10-15 22:4x and in the desk's clone: phonology 267, dictionary 248, web-check 0 errors and 12 warnings in 5 files, web-test 2657, score-parser 709 passed and 5 skipped, blurb 145, integration 55, ratchets OK.
- **A guard on new strings:** `apps/web/src/lib/no-fit-name.test.ts` fails on the old name "Fit" in anything a singer reads.

Leads, not read this session (close each before you rely on it, or write NOT ESTABLISHED):

- `pairings.ts:380-386`, `mergeOnUpload` keeping an orphaned seat (QUEUE row 101's record, N.157).
- `PRODUCT.md`, "THE TEXT AND THE NOTES": the line "clearing the poem box warns how many placed syllables it frees" (`QUEUE.md`, "Open work, not truant", says it is not built; `IntakePanel.svelte:461`).
- The Text page's component and whether anything there reads `SongRecord.poem` by name rather than `doc.inputText`.
- `binder.ts` and `exchange.ts:40-130`: whether a binder carries the whole `SongRecord` or a projection.
- Which colour token is the field's running text colour, and whether sage is it (section 5).
- `OPEN.md:1396`, the 2026-09-14 ruling "I don't want Ilya dropping hyphens" (cited from `STATE.md`, not re-read).

## 3. The data model: one field name stays, one is added

**Keep `SongRecord.poem` as the text that seats, which the singer now sees as Lyrics. Add one optional field for the Poem view.** Reason: every path that seats, transcribes, diffs, and exports reads `poem` and `inputText` today; keeping them as the Lyrics text changes nothing in seating, and an older Ilya importing a newer binder drops the new field and keeps the seats, as it does with `seatedText` and `tempo` (`types.ts:111-127`). The alternative (rename `poem` to mean the poet's text, add `lyrics`) inverts the field under every existing reader and loses the seating on an older import. Code names the new field (`origin` is the desk's suggestion) and documents the inversion of the English words in the type's comment, in the house voice of that file.

- The new field is optional and additive: absent means no poem has been given. Stored only while non-empty (`recordFromFields` pattern, `library.ts:104-125`); `validateRecord` accepts a string and marks anything else malformed, as `poem` is handled (`library.ts:172-173`).
- **Existing songs change nothing:** their text stays `poem`, which the singer sees as Lyrics; the Poem view starts empty (ruling default 3).
- `doc` gains the matching field and snapshot entry (`document.svelte.ts:263-275`); the save scheduler already covers the record.
- No schema bump. No derived value stored: the colouring and the line breaks (section 5) are computed on render.

## 4. The control and the two views

1. **The control** is a new small component (under 1000 lines, its own test file) that reproduces `DeskHead.svelte:116-126`'s pair exactly: `button.pair-member`, `role="tab"`, `aria-selected`, roving tabindex, the keydown handling, and the styles of `:193-224` moved or copied so the two look the same on the page. Place it above the field's top right corner, inside the intake frame so the drop target stays the whole frame (`IntakePanel.svelte:349-359`). Each member is at least 44 CSS px tall on a coarse pointer (the touch floor; the cursor's 44 px rule in `CONTRACT.md` §8 is the only exemption from plain text and this is a control, not text).
2. **Two texts, one textarea.** The textarea shows the text of the active view and edits it; `oninput` carries which view the text belongs to. Lyrics edits go through the existing path unchanged (`oninput` to `+page.svelte`'s handler, the quiet timer, the re-seat). Poem edits write the new field and run nothing that seats or transcribes.
3. **Which view opens.** The view last used for this song, remembered per song in the record? No: that would store a preference the page can derive. Remember it in memory for the session, per song id; the first time a song opens, Lyrics opens, and where Lyrics is empty and Poem is not, Poem opens (ruling default 3 and his 00:36 line: the populated view takes focus).
4. **The line under the control**, always shown, one per view (section 8's strings): the Poem line says edits here change the poem and the sung words live in Lyrics; the Lyrics line says these are the sung words as the score sets them and coloured words differ from the poem. A third line appears under the Poem line only while there are greyed words. After a drop, the line that says where the content landed replaces the view line until the next edit or view change.
5. **Placeholders:** Poem keeps `intake.placeholder` (ratified). Lyrics gets its own (section 8).
6. **Receipts:** the poem receipt's tag (`input.watermark`, `IntakePanel.svelte:452-464`) becomes the active view's name; the counts stay as they are. Clear on the Lyrics receipt is `handleClear` as today; Clear on the Poem receipt empties only the new field and nothing else. Replace keeps its meaning in both views (`:226-233`).
7. **The derived poem** (`+page.svelte:402-419`) keeps its rule: with Lyrics empty and a score carrying words, Lyrics shows the score's words as derived until the singer's first act claims them. Nothing about the Poem view is derived from a score, ever (Dann 00:38, ruling default 3).

## 5. Colouring, and the poem's line breaks

The comparison is a display-time word alignment, not stage 3's reconciliation. Build it as a pure module with tests (under `apps/web/src/lib/text/`, Code's name), taking two strings and returning, for each Lyrics word, whether it matches a poem word, and for each Poem word, whether it is set.

- **Tokens:** words, split on whitespace; hyphens inside a Lyrics word are joined before comparing and never count as a difference (Dann 00:40). Case folded, punctuation at a token's ends stripped, ё folded to е, both sides passed through `modernisePreReform` where it returns a form (`pipeline.ts:565` is how the pipeline uses it), so an old-spelling word and its modern form match.
- **Alignment:** longest common subsequence over the two token lists in order, so a composer's repeat shows as an extra, unmatched copy in Lyrics (coloured) and a composer's omission as an unmatched poem word (greyed). A reordered passage shows as both; that is the truth of it. A word altered by the composer is unmatched on both sides.
- **Colour:** sage on unmatched Lyrics words (Dann's choice, 00:32 and 00:40). Before applying it, read the field's running text colour token: if the textarea's text is already sage, say so in the report and use the nearest token that reads against it, and the desk brings the colour back to Dann; do not invent a hue. Grey (a muted token already in the sheet) on unmatched Poem words. Because a textarea cannot colour its own text, render the active view as a styled layer behind or beside the textarea, or as a contenteditable; measure both on a phone before choosing, and say which you built and why. The caret, selection, and typing must stay a plain textarea's.
- **Line breaks:** when Lyrics is first filled from a score's words (one line, `vowel-resolver.ts:300` per the plan) and a Poem exists, break the Lyrics text at the points the alignment maps to the poem's line ends; an unmatched run (reordered or omitted) stays on its own line. Once the singer has edited Lyrics, her line breaks stand. When no Poem exists, Lyrics keeps whatever lines it has (the existing restore rule, if any, is left as it is).
- Nothing here writes to the record: the alignment is recomputed on render (`CONTRACT.md` §8, store nothing derived).

## 6. Drops and routing (ruling default 9)

A dropped or chosen file goes where its content belongs, whichever view is showing; the view does not gate the drop.

- A score (file, scan, photograph) takes today's path (`ScoreUploader.svelte:280-299`); its words fill Lyrics as the derived poem today, and the line says so.
- A page with no staves, or a PDF whose text layer yields text (`:398-407`), is a poem: its text goes to the Poem field, through `ocr-guard.ts` as today, and the line says so. **This is the one change of destination:** today `onpoem` lands in `doc.inputText`; after this brief it lands in the Poem field. Where the Poem field already holds text, ask before replacing, on the pattern the score's own Replace uses (`IntakePanel.svelte:471`, `chooseFile`) rather than a browser dialog; say which pattern you used.
- Pasted or typed text goes to the showing view.
- A multi-page PDF with the poem printed before the score: NOT in this brief's scope beyond what today's page routing gives (the region rule is ruling default 13 and belongs to the reader); say in the report what such a file does today, measured on one such file if one is in the tree or the fixtures.

## 7. Clear, export, and old binders

- Clear on Lyrics takes the ruled warning if `PRODUCT.md`'s line (section 2's lead) is clear enough to build: "warns how many placed syllables it frees"; where it is not, leave Clear as it is and report what the line says.
- A binder carries the new field as it carries `tempo`; an older Ilya drops it and keeps the seats. Add the import case to the exchange tests: a record with the new field round-trips; a record without it imports with Poem empty.

## 8. Strings owed to Dann

English approved by Dann is marked; everything else is a desk draft. French is Dann's; nothing French reaches `Shane` until he ratifies it (`CONTRACT.md` §7). Adopted from the file: « poème » (`i18n.ts:245`, `:730`), « paroles » and « partition » (`:1021`), « chant » (`:1454`), « Collez, saisissez, déposez » (`:730`, `:767`). Coined by the desk: « mis en musique », « grisés », « en couleur », « traits d'union ». Agreement checked: « modifications faites », « paroles chantées », « telles que », « modifiez-les », « saisissez-les » with « paroles », feminine plural; « mots … grisés … mis en musique » masculine plural; « Cette page a été lue », feminine singular.

| Key | English | French draft | Status |
|---|---|---|---|
| `intake.view.poem` | Poem | Poème | labels, both drafts (Dann's word "Lyrics" kept; the art-song word "Sung text" is the one alternative, his) |
| `intake.view.lyrics` | Lyrics | Paroles | |
| `intake.view.poemLine` | Edits here change the poem. The sung words come from your score; edit them in Lyrics. | Les modifications faites ici changent le poème. Les paroles chantées viennent de votre partition; modifiez-les dans Paroles. | EN approved 00:43; FR draft |
| `intake.view.lyricsLine` | The sung words, as the score sets them. Coloured words differ from the poem. | Les paroles chantées, telles que la partition les place. Les mots en couleur diffèrent du poème. | drafts |
| `intake.view.omittedLine` | Greyed words are not set in this song. | Les mots grisés ne sont pas mis en musique dans ce chant. | drafts |
| `intake.view.landedLyrics` | Your score's sung words are in Lyrics; paste the poem here. | Les paroles chantées de votre partition sont dans Paroles; collez le poème ici. | drafts |
| `intake.view.landedPoem` | This page read as a poem and is in Poem. | Cette page a été lue comme un poème; elle est dans Poème. | drafts |
| `intake.placeholderLyrics` | The sung words appear here from your score, or type them, one syllable per note, with hyphens. | Les paroles chantées apparaissent ici depuis votre partition, ou saisissez-les, une syllabe par note, avec des traits d'union. | drafts |
| `input.watermarkLyrics` | lyrics | paroles | receipt tag, drafts |

Build with the English as written and the French as drafted, each behind the same key, so the merge carries whatever Dann ratifies and the desk changes only strings before the ship.

## 9. A ruling this brief touches, brought as a case

**N.147, ruled by Dann 2026-09-17** (`IntakePanel.svelte:474-480`): the syllable line that stood in this band was removed because "two copies of the syllabified text confused the singer, and moving between drawer and loupe to place syllables was inconvenient." The Lyrics view brings a syllabified text back into this band. What is different, and why the desk reads the ruling's reason as kept: N.147's line was a second, read-only copy of what Markup showed, with no job of its own; Lyrics is the one editable source of the words, and placing syllables stays in Markup and the loupe, never in the drawer (ruling default 2: Lyrics is the master for the words, Markup for where they sit). The report says this in one line, and Dann sees the Lyrics view on a phone before the flag of this row comes off.

## 10. Gates, ratchets, and tests

- The eight gates at section 2's numbers; a web-test rise is the new tests, counted in the report.
- `+page.svelte` may not pass 5652 lines. The wiring this brief adds there (one new document field, one view-aware `oninput`, the Poem field's clear, the poem destination) must be paid for by moving something out, on the pattern row 5 used (`report-code-row5_r1_2026-10-15.md`); name what moved and its new file.
- New tests: the alignment module (repeats, omissions, an altered word, old against modern spelling, hyphens exempt, line breaks adopted, a reordered stanza); the record round trip with and without the new field; the panel's view state (first open with Lyrics empty and Poem full opens Poem; a song's last view remembered for the session); the drop routing (a poem page lands in Poem whichever view shows, a score's words land in Lyrics); `no-fit-name.test.ts` green on every new string.
- Done when: in headless Chrome on the dev server, on «Within Four Walls» (MusicXML with words) and on the Sunless 01 Lamm scan with a typed poem, the pair shows, each view holds its text, the colours and greys appear where the alignment says, a poem page dropped in Lyrics view lands in Poem, and the seats of the scan song do not move when the poem is pasted (compare `pairings` before and after, count equal, every key equal). WRITTEN until Dann sees it on his phone and the alias; DONE is his look.

## 11. What is Dann's, and when it is brought

- The French in section 8, before the merge.
- The colour, only if sage turns out to be the running text colour (section 5).
- Nothing else: the field name, the alignment, the render technique, and what moves out of `+page.svelte` are Code's, each marked DESK DEFAULT in the report.

## 12. The riskiest assumption

That a coloured, editable text can be rendered inside the intake frame without breaking the textarea's typing, caret, selection, paste, and drop on a phone. If the layered render costs any of those, ship the colouring in a read-only rendering under the textarea in the same view (not a second copy of the text in a second place; the textarea itself is the copy) and say so; the ruling's colour survives, the editing stays plain.

## 13. Report shape

`docs/sessions/report-code-input-two-views_r1_2026-10-16.md`: the answer first (what the singer sees, the three "done when" measures with where they were taken), then the data model as built with the field name, what moved out of `+page.svelte` and its new line count, the render technique chosen and what it cost on a phone, the gates table before and after, the strings as built, the N.147 line, and section 14.

## 14. What you could not establish

A section of its own. NOT ESTABLISHED beats a complete invented answer.
