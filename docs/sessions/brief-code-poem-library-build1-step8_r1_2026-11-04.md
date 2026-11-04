# Brief: poem library build 1, step 8, the as-built review's amendments (r1, 2026-11-04)

Branch `cloud-lane-31`, after part 6 (`adebd32`). Source: Fable's review as built, `review-fable-poem-build1-as-built_r1_2026-11-04.md` (SHIP WITH AMENDMENTS, 7; amendments 1 to 4 must land before ship, 5 lands here too). The review is not in the tree yet; everything you need from it is in this brief, with its line citations, which you re-read before you change anything. Desk lines are marked DESK DEFAULT. Commit each part with its own report, `docs/sessions/report-code-poem-build1-step8-part<n>_r1_2026-11-04.md`, push, and stop after part 5. Do not touch `docs/memory/`, `Shane`, or `main`; open no pull request.

## The singer's walk this step protects

She pastes or scans a song. If Ilya's library holds the poem and the poem's text is verified against a critical edition, POEM fills with the whole poem she sings (or, for a long poem of which she sings a part, the passage she sings) and the card names it. If the text is not verified, Ilya fills nothing and shows no card: an unverified text is never presented as the poet's. Nothing she reads carries web-page code, a stray heading, or a glued line number.

## Part 1. Only a verified entry fills POEM (review amendment 1; ruling `OPEN.md`, 2026-11-03 19:54)

1. `tools/poems/library.json`: each entry gains `verification: { "state": "verified" | "unverified", "edition": string | null, "witness": string | null }`. All 14 entries today are `"unverified"`, `edition` and `witness` null (DESK DEFAULT: every source is Russian Wikisource, web-only under rule 1, and no second witness is recorded under rule 2). Do not mark any entry verified.
2. `scripts/build-poem-library.mjs` ships `verified: boolean` per entry (true only for `"verified"`), and the manifest's `poemHash` changes with the file.
3. The matcher or the offer (`poem-match.ts` `rankWorks` or `evaluate`, your choice; say which) skips an unverified entry: it is never ranked, never fills, never shows the card. Tests: an unverified best match fills nothing and shows no card; a verified one fills as today.
4. The existing poem tests that need a fill run against a test library whose entries are marked verified (test data only, never the shipped file).
5. **For Dann's walk only** (DESK DEFAULT, his to strike): the URL parameter `?poems=unverified` makes Ilya treat every entry as verified for that page load. Nothing stores it, nothing links to it, and no string mentions it. Test that without the parameter an unverified entry fills nothing.

## Part 2. A whole poem unless she sings a passage of a long one (review amendment 2)

`stanzaCut` (`text/poem-source.ts:66-81`) today cuts to the stanzas holding the alignment's single monotone stretch, so a garbled opening or a reordered stanza drops stanzas the song sings (review: fixture P fills 2 of 5, `r114-song4` 3 to 5 of 5, `r114-song5` 1 to 2 of 4). Rule (DESK DEFAULT numbers): cut to a passage only when the alignment covers at least 80 percent of the Lyrics' letters (`queryEnd - queryStart + 1` against the Lyrics' letter count) **and** the entry has more than `MAX_LENGTH_RATIO` (3) times the Lyrics' letters; otherwise fill the whole body. Tests: P, `r114-song4`, and `r114-song5` fill whole; S («Мцыри») still cuts to the fish's song; the walk item 8 test stands. Report each fixture's coverage and ratio.

## Part 3. Clean data, and a check that keeps it clean (review amendment 3)

1. In `tools/poems/library.json`, remove from `textModern` (and `textEdition` where the same fault sits there): the MediaWiki style block in `419e40dd3c` («С чужой стороны»), its U+200E marks, and the line number glued to «Про юную пальму»; the heading line «ИЗ ГЕЙНЕ.» (and «ИЗЪ ГЕЙНЕ.») from `cb6998d772`; the underscore rule in «Мцыри» (about offset 549); and «1840Москва» (find it; restore the line break or space the source page has, read from the entry's own `source.url` text if reachable, else report the case and leave the words). Change no word of any poem. Log each removal in the report with entry id and the removed characters' count.
2. Rebuild with `node scripts/build-poem-library.mjs`.
3. A build-time check in the script refuses an entry whose `textModern` holds `{`, `}`, `.mw-`, U+200E, U+200F, a run of three or more underscores, or a digit glued to a letter; a test feeds it each fault.

## Part 4. The French card's guillemets take OQLF spaces (review amendment 4; `CONTRACT.md` §7, settled)

`PoemLibraryCard.svelte:45`: `['« ', ' »']` with U+00A0 inside each mark, as the French strings under POEM already have. The pin at `e2e/poem-library.test.ts:377` changes with it. No word changes.

## Part 5. The title is not printed twice (review amendment 5)

In `naming` (`PoemLibraryCard.svelte:41-52`), omit the first-line line when `cardLine(firstLine)` equals the title and the fill is not a passage. Test on P.

## Not in this step

Review amendment 6 (the fourth rule's rung in the source line) lands with the verification data. Amendment 7 (`+page.svelte` one-liners under the ratchet): leave as is (DESK DEFAULT).

## Gates and done

Run all eight gates and the full browser suite after part 5; compare the browser failures by name with step 0's eight, as part 5 of step 7 did. Done: parts 1 to 5 pushed with reports; the eight gates at their part 6 counts plus this step's tests; browser failures exactly the baseline's eight; an unverified entry fills nothing without the parameter. Every report has a NOT ESTABLISHED section. NOT ESTABLISHED beats a complete invented answer.
