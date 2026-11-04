# Review (Fable): the poem library, build 1, as built (r1, 2026-11-04)

Reviewed: `cloud-lane-31` at `adebd32` against `origin/Shane` (`a891e109`; the lane merged Shane at `39c42c9`). Read in full: the two briefs, the design r2, the ratification r1, OPEN.md 3380 to 3418, CONTRACT §0.1 and §0.2, and all 14 of Code's reports. Every `path:line` below was read this session in the worktree. Unit tests run here: `pnpm install --frozen-lockfile`, then `pnpm test` in `apps/web`: 232 files, 4146 passed, 1 skipped, exit 0. The browser suite (Playwright) was not run here; Code's 120 of 128 with the baseline's 8 by name is Code's claim, not mine.

## 1. Verdict

**SHIP WITH AMENDMENTS.** The walk as the brief wrote it is built and sound: the card, the fold to a quiet line, the decline with Undo, the edit that keeps attribution, the re-check after the library loads, the header driven from `shown`, the measured page fit, the dating line out of POEM, the ratified strings. Four things must land first: the `verified` rule is not in the build; the stanza cut gives three of the nine filling fixtures a POEM missing stanzas the song sings; one shipped entry carries 2,265 characters of MediaWiki CSS inside its text; and the French card quotes without OQLF spaces.

## 2. Amendments

**1. The `verified` rule is not honoured; nothing in the build knows what verified is. Must land before ship.**
What the singer meets: a Wikisource text presented as the poem, with no sign of its standing. OPEN.md 19:54: *"Only `verified` entries fill POEM; the others stay in the library file with their status, unused."* The shipped entry carries `id, work, title, incipit, author, translator, source, spelling, textModern, letters, at` and no status (`scripts/build-poem-library.mjs:103-116`); `tools/poems/library.json` has `status: "canada"` on all 14 and no verification field (read with Python this session); `poem-match.ts:238-257` ranks every entry; `poem-offer.svelte.ts:98-121` fills any match. Under rule 1 a web-only source is `unverified`, so by the ruling every entry today is unused. Fix: the data build ships a `verified: boolean` per entry (from a field Dann's data build sets); `rankWorks` or `evaluate` (`poem-match.ts:238`, `:281`) skips unverified entries, with a test that an unverified best match fills nothing. Which of the 14 entries are marked verified is Dann's (section 3); if none, the library ships dark until verification, which is the ruling's consequence.

**2. The stanza cut drops stanzas the song sings when the scan is poor or the setting reorders. Must land before ship.**
What the singer meets: POEM holds part of her poem; LYRICS colours her own first stanza as a departure; the card calls a whole poem "a passage". Measured here (scratch test, removed) on the shipped file: fixture P (Tchaikovsky, «Средь шумного бала») aligns 40 of its 121 letters and fills stanzas 1 to 2 of 5 as a passage; `r114-song4` («Русская песня») sings stanza 1 (its first 75 letters, garbled) then 3, 4, 5, and fills stanzas 3 to 5 only (cut 147 to 383 of 405); `r114-song5` («Молитва») sings stanzas 1, 3, 2 and fills 1 to 2 (cut 0 to 273 of 574). Cause: `stanzaCut` (`poem-source.ts:66-81`) cuts to the stanzas holding the alignment's stretch, and Smith-Waterman's stretch is one monotone run (`poem-match.ts:104-173`), so a garbled opening or a reordered stanza falls outside it. Fix: fill the whole body unless the entry dwarfs the Lyrics; cut to a passage only when the alignment covers most of the Lyrics' letters (`alignment.queryEnd - queryStart + 1` against `queryLetters`, say 80 percent) and the entry's letters exceed the Lyrics' by more than `MAX_LENGTH_RATIO` (3). S («Мцыри», 94 percent, 58 times) still cuts; P (33 percent), song 4 (73 percent, 1.1 times) and song 5 (2.1 times) fill whole. The constants are desk defaults; the principle is that the decision reads the alignment's own coverage, not the stretch alone. Tests: the three fixtures fill whole; S still cuts; walk item 8's test stands.

**3. «С чужой стороны» (`419e40dd3c`) ships MediaWiki CSS inside `textModern`. Must land before ship.**
What the singer meets: a stanza of `.mw-parser-output .linenum{position:absolute;…}` in POEM, and the line «5 Про юную пальму» with a glued line number. Read from `data/dictionary.poems.a97f2074.json` this session: the entry is 2,500 characters, of which one blank-line block of 2,265 is CSS, standing between stanzas 4 and 5; `stanzas()` (`poem-source.ts:14-32`) counts it as a stanza, so a whole fill or a passage spanning it prints it. Code's step 4 report names the U+200E marks in this entry and not the CSS. Fix: data, `tools/poems/library.json`, then `node scripts/build-poem-library.mjs`; a build-time check that `textModern` holds no `{`, `}`, `.mw-`, or U+200E, with a test. The same pass takes the «ИЗ ГЕЙНЕ.» heading out of `cb6998d772` (it is the first line, so a whole fill prints it and `lineAt` names it on the card), the underscore rule in «Мцыри» at offset 549, and «1840Москва».

**4. The French card quotes the title and first line without OQLF spaces. Must land before ship (French: the fix is mechanical, the wording is unchanged).**
What the singer meets: «Весёлый час» on the card and « Весёлый час » on the line under POEM, in one screen. `PoemLibraryCard.svelte:45` sets `['«', '»']` with no ` `; `i18n.ts` French strings carry `« {title} »` (`'intake.poemLibrary.passage'`, `'intake.view.libraryPoem'`). CONTRACT §7 and the ruling of 2026-11-02 make OQLF typography settled. Fix: `['« ', ' »']` at `:45`; the pin at `e2e/poem-library.test.ts:377` (`'«Весёлый час»'`) changes with it.

**5. The card prints the title twice when the first line is the title. Can follow.**
What the singer meets: “Средь шумного бала, случайно” on one line and “Средь шумного бала, случайно” on the next (after amendment 2 fills P whole; `cardLine` strips the trailing comma, `poem-source.ts:159-165`). The entry's title equals its first line (read from the file). Fix: in `naming` (`PoemLibraryCard.svelte:41-52`), omit `line` when `cardLine(firstLine)` equals the title and the cut is not a passage.

**6. The fourth rule's "which rung its text stands on, in its source line" is not shown. Can follow, with amendment 1.**
OPEN.md 20:27: every entry says plainly which rung its text stands on, in its record and in its source line. The card's source line is `cardSource`, "From {site}." only (`PoemLibraryCard.svelte:50`). The data has no rung. Lands when the data does.

**7. `+page.svelte` is held under its ratchet by joining statements on one line. Can follow.**
`routes/+page.svelte:2362-2363` (two statements and a comment per line), `:2372` (`attach(...)` appended to `let lastLaid = '';`, so the old comment now describes the wrong thing), `:2388`, `:3977`. Readable code was traded for one line of ratchet headroom (`scripts/ratchets.json:8`, 5586). Whether to raise the ceiling is in section 3.

## 3. The owner's to rule

1. Whether any of the 14 entries is `verified` under rules 1 and 2 (all are web-only Wikisource texts, so none is, as the rules read), and so whether build 1 ships with a dark library until the data is verified.
2. The passage rule's two numbers in amendment 2 (coverage 80 percent, ratio 3), and whether a whole poem is ever cut at all for a short poem.
3. The `+page.svelte` ratchet: raise it by the lines this build needs, or keep the one-liners.
4. French: amendment 4's spaces are OQLF; nothing else in the French changed from the ratified table (read against `i18n.ts:860-877`).
5. The passage wording after a sentence end keeps the capital («Весело на пашне. Ну, тащися, сивка», `poem-source.ts:113-114`): Code's desk default, his to keep.
6. Page 1 of the Tchaikovsky song is nine rows at a 24 px gap, not ten (the ten were an overrun by 7.4 px); the 18 px floor stands as he ruled.
7. Button order (Not this poem, then Keep this poem), as the ratification resolved it.

## 4. Dann's walk of this build

1. Open Ilya, LYRICS view, empty song. Paste the text of `tools/poems/fixtures/r114-song2.lyrics.txt`. Arrival: within a few seconds a sage card stands between the view lines and the field, reading "Ilya found this poem for your song:", “Весёлый час”, “Дайте бокалы!”, Алексей Васильевич Кольцов, "From Russian Wikisource.", the colours sentence, then **Not this poem** and **Keep this poem**. The caret is still in the field. Words in LYRICS are coloured.
2. Tap the POEM pill. Arrival: the poem, ending at «Видит заря!» with no «1830»; the card still above the field; the line reads the ordinary POEM line.
3. Tap **Keep this poem**. Arrival: the card is gone; under POEM the line reads "Алексей Васильевич Кольцов, “Весёлый час”, from Russian Wikisource."; under LYRICS the ordinary line.
4. Type one letter into POEM. Arrival: the line reads "Based on Алексей Васильевич Кольцов, …".
5. New song. Paste the same fixture, tap **Not this poem**. Arrival: POEM empty; LYRICS exactly as pasted; "Poem removed. Undo" where the card was, in both views; tap Undo: the poem and the card return.
6. New song. Paste `tools/poems/fixtures/S.lyrics.txt`. Arrival: the card reads “Мцыри”, "a passage beginning “Дитя моё, останься здесь со мной”", Михаил Юрьевич Лермонтов; POEM holds the fish's song only.
7. Switch to French (the language pill). Paste song 2 again. Arrival: « Ilya a trouvé ce poème pour votre chant : », « Tiré de Wikisource en russe. », « Pas ce poème », « Conserver ce poème ». Look at the title's guillemets: today they have no inner spaces (amendment 4).
8. Drop `apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml`. Arrival: the card for «Средь шумного бала»; open TEXT: the top right reads TEXT: LYRICS; no row touches the footer on any page; page 1 holds nine rows. Choose POEM on the TEXT pair (if the pair shows): the header reads TEXT: POEM. Print preview: the same.
9. Paste `tools/poems/fixtures/r114-song4.lyrics.txt` into a new song and open POEM. Arrival today: three stanzas, all beginning «Много есть у меня», and LYRICS' first line coloured as a departure. That is amendment 2; after it, five stanzas.

## 5. NOT ESTABLISHED

- The browser suite's result on this machine; the 8 baseline failures' causes (Code's, unrun here).
- A scan end to end (homr not run here); the fixtures stand in for the reader's output.
- Whether a Lyrics text that already carries a U+00A0-fused proclitic («в тревоге») keeps it through the relining a fill triggers: `WORD_TOKEN` (`break-glue.ts:15`) keeps only ` ` before `#`, and `layOutLikePoem` rejoins with a plain space (`poem-compare.ts:276-283`). That path predates this build (a hand-pasted poem takes it) and writes nothing under notes; the one-vowel rule (§0.1) is not touched by this build, since the poem is never seated.
- The visible reflow on TEXT between the estimated first slice and the measured one (`Paper.svelte:85-87`, `:115-127`), and the probe's cost on a long song or a phone.
- The card on a phone-width drawer and in a screen reader (read from the DOM by Code, not heard).
- Which songs set «С чужой стороны» (Tyutchev after Heine), so how likely amendment 3 fires before verification.
- Whether a decline after a reload (no memory of the pre-fill Lyrics) leaves a scan's re-lined Lyrics in the poem's lines: Code says so (`poem-offer.svelte.ts:25-27`); not run here.
