# Fable review of the Input two-views brief, r1

Reviewer: Fable 5.1, 2026-10-16. Brief: `docs/sessions/brief-code-input-two-views_r1_2026-10-16.md`. Checked against the clone of `Shane` at `01b638a`. One gate run here: web-test. Nothing on the Mac touched; no git write.

## Verdict

SEND WITH AMENDMENTS (14). The brief builds the ruling's defaults and marks the desk's own choices, the data model is the right one, and the done-when is three counts with places. Two findings change what Code builds; the rest is citation repair, closed leads, and French.

1. The brief believes Lyrics arrives "syllabified with hyphens" and tells the singer to type them; it is now known that a score's words fill the field as whole words on one line (`vowel-resolver.ts:255`, `:344-346`) and that a hyphen typed inside a word reaches the dictionary as a letter (`pipeline.ts:582` strips a trailing hyphen only; `packages/phonology/src/engine.ts:701` strips the two dashes and not `-`), so every hyphenated word would read as unknown, with no stress and no gloss (`pipeline.ts:670`, `:734`), which moves hyphens out of this slice.
2. The brief believes `IntakePanel.svelte` "has no ceiling"; it is 1000 lines, and an unlisted file over 1000 breaches (`scripts/ratchets.mjs:68-69`), so the panel has zero headroom and the two-view field has to be its own component.

## Citations

| Citation | Status |
|---|---|
| `types.ts:95`, `:111-127`, `:141`, `:158`, `:167`, `:195`; `library.ts:79`, `:117`, `:172-173`; `document.svelte.ts:66`; `seated-text.ts:26` (33 lines); `pipeline.ts:264`, `:565`; `i18n.ts:245`, `:730`, `:742`, `:762-763`, `:767`, `:900`, `:1021`, `:1454`; `QUEUE-archive.md:188`; the five named files | CONFIRMED |
| `library.ts:104-125`; `document.svelte.ts:263-275` | Ranges end short: `:104-129`, `:263-278` |
| `+page.svelte:383-384`, `:400`, `:402-419`, `:623-624`, `:1975-1985`, `:2019`, `:2135-2151`, `:4032-4050`, `:4088` `onpoem` to `handleInput`, `:2462-2463` | CONFIRMED; `:1994` and `:2883-2887` are two more verbatim sites (amendment 3) |
| `IntakePanel.svelte:60-70`, `:205-222`, `:226-233`, `:349-359`, `:371-381`, `:403`, `:452-473`, `:461`, `:471` | CONFIRMED |
| `IntakePanel.svelte:474-480` N.147 | WRONG: `:476-483`; the props note is `:101-108`; the page's is `+page.svelte:4102-4110` |
| `DeskHead.svelte:116-126`, `:193-224` | Members only; the pair is `:113-128` with its `.pair` wrapper, styles `:179-226` |
| `ScoreUploader.svelte:280-299`, `:285`, `:398-407` | CONFIRMED (`take` routes at `:284-300`; `onpoem(text)` at `:407`) |
| `vowel-resolver.ts:300` one line | WRONG: the one-line join is `scoreWordsText`, `:344-346` |
| `ocr-guard.ts:1-30` | The file is `apps/web/src/lib/score/ingestion/ocr-guard.ts`; the text-layer path does not pass it (amendment 7) |
| `scripts/ratchets.json`: `+page.svelte` 5651 of 5652 | CONFIRMED by `node scripts/ratchets.mjs` |
| Gates: web-test 2657 | CONFIRMED by a run in this clone: 152 files, 2657 passed, 425 s. The other seven are read from `report-code-row48_r1_2026-10-15.md:40-50` and QUEUE rows 91 and 99, not run |
| Lead: `pairings.ts:380-386` | CLOSED: `orphaned` is "KEPT, NOT DROPPED" (`:380-386`); `mergeOnUpload` returns `existing` untouched (`:403`) |
| Lead: `OPEN.md:1396` | CLOSED: the ruling is `:1399-1401`, about the spacer under the notes, not a typed hyphen in Input |
| Lead: `PRODUCT.md`, "THE TEXT AND THE NOTES" | CLOSED: `:632-635` (amendment 9) |
| Lead: the Text page | CLOSED: `Paper` takes `lines={effectiveLines}` (`+page.svelte:4417`), from `doc.inputText`; `record.poem` is read by name only in `library.ts`, `songs.ts:51`, `driver.ts:220`, `:311`, `migration.ts:112` |
| Lead: the binder | CLOSED: the whole record as JSON (`binder.ts:164`), imported through `validateRecord` (`:237-284`) |
| Lead: the field's text colour | CLOSED: `var(--ink-primary)` (`IntakePanel.svelte:782`; `app.css:28`); sage is an accent (amendment 4) |

## The ruling against the brief

Defaults 1 to 7 and 9 to 13 each have a section; default 8 (reconciliation) is kept out, rightly. The brief adds a Lyrics placeholder, a receipt tag, a 44 px member height, and session memory of the last view, each marked or a desk default under section 11. Default 4 (Lyrics adopts the poem's line breaks) is written for poem-then-score; Dann's own case was score-then-poem (`QUEUE-archive.md:188`). Amendment 3.

## The data model

Sound. Every optional field since `seatedText` is additive, `validateRecord` copies only what it knows (`library.ts:149-242`), and a binder carries the record whole, so an older Ilya drops the new field and keeps `poem` and the seats. The rename is rightly rejected. Two things follow the field that the brief does not name: `origin` is taken, and `proposeName` falls back to `record.poem`'s first four words (`songs.ts:51`). Amendment 8.

## The render technique, the fallback, the ceilings, and section 8

The render question is put as it stands and asks for a phone measurement. The fallback is wrong: a read-only coloured copy under the textarea is two copies of the text in this band, the reason N.147 took the syllable row out (`IntakePanel.svelte:101-108`). Amendment 5. `+page.svelte`'s ceiling is handled (row 5's pattern); `IntakePanel.svelte` at the 1000 limit, `ScoreUploader.svelte` at 1358 of 1358, and `pipeline.ts` at 1064 of 1065 are not. Amendment 2. Against `CONTRACT.md` §8: nothing derived is stored, the sage and grey marks are Dann's rulings (defaults 5 and 11) and not marks of uncertainty, and the field rides the document's one save path. Right.

## Amendments

### 1. Hyphens leave this slice

In section 1, replace "syllabified with hyphens, in the edition's spelling" with:

> in the edition's spelling. Syllable hyphens are not part of this slice: a score's words fill the field as whole words on one line (`apps/web/src/lib/score/vowel-resolver.ts:255`, `:344-346`), and a hyphen typed inside a word reaches the dictionary as a letter (`pipeline.ts:582`; `packages/phonology/src/engine.ts:701`), so the word reads as unknown, with no stress and no gloss (`pipeline.ts:670`, `:734`). Teaching the engine that a typed hyphen is a syllable break is its own row after this one (`pipeline.ts` is at 1064 of 1065); the alignment's hyphen rule in section 5 stays so that row changes nothing here. Ruling default 12's hyphen line stands as a desk default for that row.

In section 8, replace the `intake.placeholderLyrics` row's English with "Your score's sung words appear here. You can also paste or type them." and its French with "owed: desk redraft from « à partir de » (`i18n.ts:1021`) and « collez, saisissez » (`:730`); the r1 draft's « apparaissent ici depuis votre partition » is a calque".

### 2. Three more ceilings

Replace the first sentence of section 2's "Ceilings" bullet with:

> `+page.svelte` is 5651 against 5652 (one line). `IntakePanel.svelte` is 1000 lines with no listed ceiling, which puts it at the 1000-line limit for an unlisted file (`scripts/ratchets.mjs:68-69`): zero headroom. `ScoreUploader.svelte` is 1358 against 1358 and is not touched; where a drop landed is known in `+page.svelte` from which callback fired, `onpoem` (`:4088`) or `oningested` (`:4085`). `pipeline.ts` is 1064 against 1065 and is not touched. `i18n.ts` is exempt; a new file stays under 1000.

In section 4, item 2, prepend: "The two-view field (the pair, the line under it, the textarea, its placeholder, the poem receipt's tag) is one new component that `IntakePanel` renders where the textarea stands today, so `IntakePanel` loses lines; name its count before and after."

### 3. The four verbatim gates, and the score-first order

Append to section 5's "Line breaks" bullet:

> Four sites compare `doc.inputText` with the one-line `scoreText` by string equality: the `from score` tag (`+page.svelte:400`), the score's own seat (`:623`, `:2019`), and the waiting seat (`:1994`); the fill itself is `:2883-2887`. Any rewrite of the Lyrics text at fill time, line breaks included, turns all four off and the score's own seating path (N.134, N.144) with them. So the breaks are applied only after the seat has run, and the four comparisons go through one helper that ignores whitespace, with its own test (DESK DEFAULT). The common order is score first, poem later (`QUEUE-archive.md:188`): when a Poem arrives while Lyrics still holds the score's words unedited, the same rule applies; once the singer has edited Lyrics, her breaks stand. Report how many seats moved on the fixture when the breaks were applied; the expectation is zero.

### 4. The colour, closed

Replace section 5's "Colour" bullet with:

> **Colour:** the field's running text is `var(--ink-primary)` (`IntakePanel.svelte:782`; `app.css:28`), not sage, so sage reads. The token is `--sage-ink` (`#455238`, `app.css:189`), the sage family's label ink at OKLCH L 0.420, which the sheet says clears 7.02 on cream (`app.css:186-189`); `--sage` itself (`#839275`, `:42`) is the band colour at L 0.640 and is not an ink. Grey for a poem word the song does not set: `--ink-tertiary` (`app.css:30`, captions and placeholders). DESK DEFAULT on the two tokens; the hue is Dann's (00:32, 00:40). Because a textarea cannot colour its own text, render the active view as a styled layer behind the textarea with the textarea's text transparent and its caret inked, or as a contenteditable; measure both on a phone before choosing, and say which you built and why. The caret, selection, typing, paste, and drop stay a plain textarea's.

Strike section 11's second bullet ("The colour, only if sage turns out...").

### 5. The fallback

Replace section 12's second sentence with:

> If the layered render costs any of those on a phone, ship no colour in the field and put the count in the Lyrics line instead ("4 words differ from your poem", the Corrections pattern the ruling's default 8 names; EN desk draft, FR owed), and say so. Never a second rendering of the text under the textarea: two copies of the text in this band is the reason N.147 removed the syllable row (`IntakePanel.svelte:101-108`). The colour then goes back to Dann with the measurement.

### 6. The replace guard

In section 6, replace "ask before replacing, on the pattern the score's own Replace uses (`IntakePanel.svelte:471`, `chooseFile`) rather than a browser dialog; say which pattern you used" with:

> ask before replacing through `askToReplace` (`+page.svelte:2495-2499`), the one `<dialog>` that serves every "about to replace this song" warning, safe answer last. `chooseFile` (`IntakePanel.svelte:471`) opens the picker and guards nothing. The "N.157 flow" the ruling names is the seat re-derivation on a score replacement (`replace-seat.ts`; `+page.svelte:2915-2917`, shipped `b21ce8a`; `STATE.md:89` is stale), not a dialog.

### 7. The guard's path, and the text-layer path

In section 6, replace "its text goes to the Poem field, through `ocr-guard.ts` as today" with "its text goes to the Poem field by today's two paths: a PDF text layer goes straight to `onpoem` with no guard (`ScoreUploader.svelte:406-409`); an OCR reading passes `decidePoemOrScore` and `apps/web/src/lib/score/ingestion/ocr-guard.ts` first (`:440` on)". In section 2, give the guard that path.

### 8. The field's name, and two readers of `poem`

Append to section 3's first paragraph:

> `origin` is taken twice: a pairing's `origin` is its slot (`pairings.ts:341`) and an arrival's `origin` is `'upload'` or a restore (`+page.svelte:2884`), so Code names the field something else. Two readers follow it: `proposeName` falls back to the first four words of `record.poem` (`songs.ts:51`), so the new field is preferred when non-empty (DESK DEFAULT); and `nameIfUnnamed` runs inside `handleInput` only (`+page.svelte:2462-2466`), so a poem pasted into Poem names an unnamed song too (DESK DEFAULT).

### 9. No warning on Clear in this slice

Replace section 7's first bullet with:

> Build no warning on Clear. The lead is closed: `PRODUCT.md:632-635` says deleting text in Input that carries placements says how many placed syllables it frees; `handleClear` leaves `doc.pairings` and `doc.seatedText` alone (`+page.svelte:2135-2151`) and the next paste re-seats against the seated text (`:1975-1985`, N.160 step 3, 2026-09-21), so a Clear frees nothing a paste does not restore, and the 2026-09-17 line predates that. Clear on Lyrics stays `handleClear`; Clear on Poem empties the new field. The desk brings the wider warning to Dann as its own row.

### 10. N.147, on the facts

Replace section 9's sentence beginning "What is different, and why" with:

> N.147's row was the placing queue, not a read-only copy: it carried `syllablesPlaced`, `syllablesTotal`, and `onstartover` (`IntakePanel.svelte:101-108`), the queue and Start over that N.114 moved under the poem field (`+page.svelte:4222-4224`), so a singer could place from the drawer and from the loupe. Lyrics adds no placing control: it is the source text this band has always shown, edited in place; placing stays in Markup and the loupe (ruling default 2). The one new thing in the band is colour on the words that differ from the poem.

### 11. The pair control: citations and the 44 px line

In section 4, item 1, replace `:116-126` with `:113-128` (the `.pair` wrapper carries the border) and `:193-224` with `:179-226`. Replace the sentence beginning "Each member is at least 44 CSS px tall" with:

> Copy the look exactly, including the 0.3 rem by 0.5 rem padding Dann ruled on screen (N.132, `DeskHead.svelte:202-204`). Meet the drawer's 44 px touch floor (`PRODUCT.md:595`) without changing the drawn height, by a transparent hit area on a coarse pointer, and say how.

### 12. Citation and wording repairs

- Section 2: `IntakePanel.svelte:474-480` to `:476-483`; `document.svelte.ts:263-275` to `:263-278`; `library.ts:104-125` to `:104-129`; the `OPEN.md:1396` lead to "`OPEN.md:1399-1401`: the 2026-09-14 ruling is about the spacer under the notes, not a typed hyphen; a typed hyphen winning is a desk default with no ruling behind it".
- Section 5: `vowel-resolver.ts:300` to "`scoreWordsText`, `vowel-resolver.ts:344-346`".
- Section 4, item 3: replace "No: that would store a preference the page can derive." with "No: the ruling does not ask the last view to survive a reload, and a field for it is more record than the slice needs (DESK DEFAULT)." A last-used view is not derivable.
- Section 8: cite « poème » to `:730` alone (`:725-730`, ruled with its French); `:243-244` says the word at `:245` is unruled.

### 13. Gates and the done-when's places

Replace section 10's first bullet with: "The eight gates at section 2's numbers; web-test 2657 was confirmed by a run in the review clone at `01b638a`, the other seven are read from reports and confirmed by your first run. A web-test rise is the new tests, counted."

Append to the done-when: "«Within Four Walls» is `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` (194 `<lyric>` cells); the Lamm scan is `tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf`, in the tree. Take all three measures on the MusicXML song. Read the scan only if the reader loads in the lane's headless Chrome; otherwise that measure is NOT ESTABLISHED in the lane and Dann's Mac takes it. Say where each was taken."

### 14. French

Agreements checked against their referents, all sound: « modifications faites » (f. pl., modifications), « paroles chantées », « telles que », « modifiez-les », « saisissez-les » (f. pl., paroles), « mots grisés », « mis en musique », « en couleur » (m. pl., mots), « Cette page a été lue » (f. s., page), « ce chant » (m. s.). Nothing changed. Two flags, both Dann's:

- `intake.view.lyricsLine` renders "sets" as « les place » and `intake.view.omittedLine` renders the same verb as « mis en musique »; one term per concept. His choice: « les place » (r1) or « les met en musique » (the brief's own coinage reused). DRAFT FOR DANN either way.
- « dans Paroles », « dans Poème », « elle est dans Poème »: a bare label after « dans », where the file names the field, « le champ Entrée » (`i18n.ts:1021`). His call; no change made.

The `intake.placeholderLyrics` French is struck with its English (amendment 1).

## What I could not establish

- Whether a word with an internal hyphen reaches the dictionary by another route (a poetic-forms retry, a hyphenated entry). Read from `pipeline.ts:582` and `engine.ts:701`; not run as a positive control.
- The other seven gate counts at `01b638a`. Read from reports; only web-test was run here.
- Whether the reader loads in the cloud lane's headless Chrome for the Lamm scan. Amendment 13 has Code say.
- How many seats move when the poem's line breaks are applied to a filled Lyrics text through N.160's re-seat. Amendment 3 has Code count it.
- Whether `--sage-ink` on the cream field is the sage Dann meant at 00:32. He sees it on the walk.
