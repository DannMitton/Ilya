# Brief: poem library build 1, step 8, the as-built review's amendments (r2, 2026-11-04)

r2 applies all nine amendments of Fable's review of r1 (`review-fable-brief-poem-step8_r1_2026-11-04.md`, SEND WITH AMENDMENTS). Branch `cloud-lane-31`, after part 6 (`adebd32`). Source: Fable's review as built, `review-fable-poem-build1-as-built_r1_2026-11-04.md` (SHIP WITH AMENDMENTS, 7). Neither review is in the tree yet; everything you need is in this brief, with line citations you re-read before you change anything. Desk lines are marked DESK DEFAULT. Commit each part with its own report, `docs/sessions/report-code-poem-build1-step8-part<n>_r1_2026-11-04.md`, push, and stop after part 5. Do not touch `docs/memory/`, `Shane`, or `main`; open no pull request.

## The singer's walk this step protects

She pastes or scans a song. If Ilya's library holds the poem, POEM fills with the whole poem she sings (or, for a long poem of which she sings a part, the passage she sings), and the card names it and says where its text came from, with a link to the page, so she can trust it or check it. Nothing she reads carries web-page code, a stray heading, or a line number.

## Part 1. Every entry records its verification state; any attributed entry fills

Dann's ruling of 2026-11-04 09:40, quoted here because it is not yet pushed to `OPEN.md`: Wikisource texts are legitimate sources as long as the singer is told where the text came from; unverified entries fill POEM; the card's source line is the attribution. *"this gives the user agency in trusting or not trusting the content, and they can choose to verify if the source doesn't give them confidence."*

1. `tools/poems/library.json`: each entry gains `verification: { "state": "verified" | "unverified", "edition": string | null, "witness": string | null }`. All 14 entries today are `"unverified"`, `edition` and `witness` null. Do not mark any entry verified.
2. `scripts/build-poem-library.mjs` ships `verified: boolean` per entry; the manifest's `poemHash` changes with the file. `verified: boolean` is also added to `PoemEntry` (`apps/web/src/lib/text/poem-library.ts:26-43`) and checked by `isEntry` (`:88-104`, `typeof e.verified === 'boolean'`); the hand-built entries in `loader-poems.test.ts`, `poem-library.test.ts`, and `poem-match.test.ts` gain it. The field pin at `tests/build-poem-library.test.ts:48` gains `'verified'`. The refusal of an entry with no `source.site` is already built (`scripts/build-poem-library.mjs:101`) and tested for a missing `url` (`tests/build-poem-library.test.ts:71`); add the missing-`site` case beside it. Rebuild (`node scripts/build-poem-library.mjs`) in this part, since `tests/build-poem-library.test.ts:111` holds the file on disk to the build byte for byte.
3. Matching and filling do not read `verified` in this build. No new string. The attribution is already pinned in the browser for an unverified entry: the English quiet line (`e2e/poem-library.test.ts:25`, asserted at `:136` and `:211`) and the French card and line (`:376-381`). Add one unit test: `shipEntry` of an entry whose `verification.state` is `"unverified"` ships `verified: false` and its `source.site`.
4. DESK DEFAULT, applying the 09:40 ruling's "they can choose to verify" (Dann may strike it): on the card only, the `{site}` of `cardSource` and `cardSourceModernized` is rendered as a link to `entry.source.url` (`target="_blank" rel="noopener noreferrer"`), the ratified sentence unchanged around it. The privacy test (`e2e/poem-library.test.ts:359-366`) still holds: an unclicked link makes no request; add to it that the link's `href` is the entry's own `source.url`. The quiet line stays text.

## Part 2. A whole poem unless she sings a passage of a long one

`stanzaCut` (`text/poem-source.ts:66-81`) today cuts to the stanzas holding the alignment's single monotone stretch, so a garbled opening or a reordered stanza drops stanzas the song sings (fixture P fills 2 of 5, `r114-song4` 3 to 5 of 5, `r114-song5` 1 to 2 of 4). `PoemMatch` (`poem-match.ts:260-274`) carries `letterStart`, `letterEnd`, `start`, `end`, and not the query's span; `offer()` calls `stanzaCut(match.entry.textModern, match.start, match.end)` (`poem-offer.svelte.ts:114`).

`evaluate` (`poem-match.ts:281-310`) adds `coverage` to `PoemMatch`: `(alignment.queryEnd - alignment.queryStart + 1) / letters.length`, from the alignment it already holds (`:293`). `poem-source.ts` gains `cutFor(match: PoemMatch): StanzaCut` beside `stanzaCut`, and `offer()` (`poem-offer.svelte.ts:114`) calls it. Rule (DESK DEFAULT numbers): cut to a passage when the coverage is at least 0.8 **and** `entry.letters.length > MAX_LENGTH_RATIO * match.queryLetters`; **also** cut, whatever the coverage, when `entry.letters.length > LONG_POEM_RATIO * match.queryLetters` with `LONG_POEM_RATIO = 10` (a poor scan of the fish's song must not fill all of «Мцыри» into POEM); otherwise fill the whole body. `stanzaCut` itself does not change, and the tests at `poem-source.test.ts:94-140` keep calling it.

CONTRACT §4: the coverage is computed nowhere else in the tree (grep `queryStart`, `coverage` under `apps/web/src`: no other site). `MAX_LENGTH_RATIO` is read at `poem-match.ts:292` the other way round (Lyrics at most 3 times the entry, the no-fill rule for a cycle), pinned at `poem-match.test.ts:211`, and re-derived at `:250`; part 2 reads the same constant and changes none of those three. Nothing depended on the two readings agreeing beyond sharing the number.

Tests: P, `r114-song4`, and `r114-song5` fill whole; S («Мцыри») still cuts to the fish's song; a low-coverage S fixture (synthetic) still cuts; the walk item 8 test stands. Report each fixture's coverage and ratio and check them against Fable's measured table:

| fixture | coverage | ratio | under the rule |
|---|---|---|---|
| P | 33.1% | 3.40 | whole |
| S | 94.2% | 58.4 | cut |
| T | 91.5% | 1.23 | whole |
| U1 | 100% | 1.00 | whole |
| U6 | 100% | 1.10 | whole |
| r114-song2 | 61.4% | 0.69 | whole |
| r114-song3 | 55.8% | 1.30 | whole |
| r114-song4 | 73.0% | 1.09 | whole |
| r114-song5 | 93.5% | 2.14 | whole |

U4, U5, and r114-song1 fill nothing, as before.

## Part 3. Clean data, and a check that keeps it clean

1. In `tools/poems/library.json`, in `textModern` and in `textEdition` where the same fault sits there:
   (a) `419e40dd3c` («С чужой стороны»): remove the MediaWiki style block (offsets 134 to 2366 of `textModern`, 2,232 characters, from `.mw-parser-output` to the last `}`), the four U+200E marks, and the line number `5` with the U+00A0 after it before «Про юную пальму». Then restore the stanza structure: the file has a blank line after every verse line, while the source page (`oldid=5036885`, read 2026-11-04) prints two quatrains with single line breaks inside each and one blank line between them. Change nothing else; the combining grave on «Что̀» is the edition's.
   (b) `cb6998d772`: remove the heading line «ИЗ ГЕЙНЕ.» (`textModern`) and «ИЗЪ ГЕЙНЕ.» (`textEdition`), each with its line break.
   (c) `c1964bc3bd` («Мцыри»): remove the line `________` at offset 549, with its line break.
   (d) `87376c1710` («Русская песня»): the source page (`oldid=5201296`, read 2026-11-04) prints `8 декабря 1840<br />Москва`: a line break. Restore it: `8 декабря 1840\nМосква`. Then widen `isDateline` (`poem-source.ts:42`) to a closing block of at most two lines and four words in all, holding a four-digit year, so the dating block still stays out of POEM; `poem-source.test.ts:113-119` (`ends['Русская песня']`) fails until it is widened, and that failure is the check.
   (e) `298e556367` («Молитва», pre-reform): «покаянiем» (`textModern` offset 130) and «покаянiемъ» (`textEdition` offset 138) carry a Latin `i` (U+0069). Correct it to «и» in `textModern` and to «і» (U+0456) in `textEdition`, as the edition's other nine «і» stand, and log it as a rule 5 correction with this reason. DESK DEFAULT (a letter, not a word; Dann may strike it).
   (f) Collapse every run of three or more line breaks to two: 25 in «Мцыри» and 1 in `419e40dd3c`.
   Change no word of any poem beyond (e). Log each change in the report with entry id and the characters removed or changed.
2. Rebuild with `node scripts/build-poem-library.mjs`.
3. A build-time check in the script refuses an entry whose `textModern` holds `{`, `}`, `.mw-`, U+200E, U+200F, a run of three or more underscores, a run of three or more line breaks, a Latin letter, a digit glued to a letter, or a line that begins with one to three digits followed by a space or U+00A0 and a letter and holds no four-digit year (a line number; a dating line such as «8 декабря 1840» passes). A test feeds it each fault and the clean library.

## Part 4. The French card's guillemets take OQLF spaces (`CONTRACT.md` §7, settled)

`PoemLibraryCard.svelte:45`: `['« ', ' »']` with U+00A0 inside each mark, as the French strings under POEM already have (`i18n.ts:863`, `:876`, `:877`). The pin at `e2e/poem-library.test.ts:377` changes with it. No word changes.

## Part 5. The title is not printed twice

In `poem-source.ts` add `showsLine(title: string, firstLine: string, passage: boolean): boolean`: false when `!passage && cardLine(firstLine) === cardLine(title)`. `naming` (`PoemLibraryCard.svelte:41-52`) sets `line` to null on false and the template omits `<p class="line">`. Unit test on the shipped entry `21568f1c1e` (title and first line both «Средь шумного бала, случайно»): false whole, true as a passage; and on `0127a63ffe`: true.

## Not in this step

The fourth rule's rung in the source line lands with the verification data. The `+page.svelte` one-liners under the ratchet stay (DESK DEFAULT). The title of `cb6998d772` («диком») against its first line («дальнем») lands with the verification data.

## Gates and done

Run all eight gates and the full browser suite after part 5; compare the browser failures by name with step 0's eight, as part 5 of step 7 did. Done: parts 1 to 5 pushed with reports; the eight gates at their part 6 counts plus this step's tests; browser failures exactly the baseline's eight; every shipped entry carries `verified` and `source.site`; the nine filling fixtures land as the table has them; no `textModern` fails the part 3 check; «Русская песня» fills ending at «Сам с собою грущу…». Every report has a NOT ESTABLISHED section. NOT ESTABLISHED beats a complete invented answer.
