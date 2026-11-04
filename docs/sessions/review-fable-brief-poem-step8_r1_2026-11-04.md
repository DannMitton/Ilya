# Review (Fable): the step 8 brief, before Code builds it (r1, 2026-11-04)

Reviewed: `brief-code-poem-library-build1-step8_r1_2026-11-04.md` as rewritten after Dann's 09:40 amendment (re-read in full after the coordinator's notice), against `cloud-lane-31` at `adebd32` (worktree `wt31`, read-only) and `origin/Shane` `docs/memory/OPEN.md` 3380 to 3418. Every `path:line` below was read this session. Two source pages were fetched this session (curl, the entries' own `source.url`): «Русская песня» (`oldid=5201296`) and «С чужой стороны» (`oldid=5036885`). A scratch vitest file measured coverage and ratio on the shipped library for every fixture; it was removed and `git status` is clean.

## 1. Verdict

**SEND WITH AMENDMENTS (9).** The walk the brief protects is the right one and the five parts are the right five. What must change before Code starts: the brief cites a ruling that is not in the tree; part 2 asks for a number the match does not carry and omits the CONTRACT §4 line; part 3's list misses the loss of stanza structure in «С чужой стороны», the line break the source prints after «1840», and the Latin letter in «Молитва»; part 3's check would not catch the very line number it names; part 5 has no test surface. The attribution question (Dann 09:40): "From Russian Wikisource." names the source, and that is what the ruling asks. It does not let her check it, because the card shows the site's name and not the page (`PoemLibraryCard.svelte:50` prints `{site}` only; `source.url` is shipped, `build-poem-library.mjs:111`, and shown nowhere: grep this session). No new string is needed; a link is (amendment 8, his taste).

The passage rule's numbers, measured on the shipped file (coverage = `queryEnd - queryStart + 1` over the Lyrics' letters; ratio = entry letters over Lyrics letters):

| fixture | entry | coverage | ratio | today | under the rule |
|---|---|---|---|---|---|
| P | Средь шумного бала | 33.1% | 3.40 | stanzas 1 to 2 of 5 | whole |
| S | Мцыри | 94.2% | 58.4 | stanzas 25 to 28 of 32 | cut |
| T | Спящая княжна | 91.5% | 1.23 | whole | whole |
| U1 | В четырёх стенах | 100% | 1.00 | whole | whole |
| U6 | Над озером | 100% | 1.10 | whole | whole |
| r114-song2 | Весёлый час | 61.4% | 0.69 | whole | whole |
| r114-song3 | Могила | 55.8% | 1.30 | whole | whole |
| r114-song4 | Русская песня | 73.0% | 1.09 | stanzas 3 to 5 of 5 | whole |
| r114-song5 | Молитва (modern) | 93.5% | 2.14 | stanzas 1 to 2 of 4 | whole |

U4, U5, and r114-song1 fill nothing (low score), as before. No fixture lands on the wrong side. Two edges to know: P's ratio (3.40) is past the bound, so a clean scan of the same two stanzas would cut to a passage, which is the rule working; and a poor scan of the fish's song (coverage under 80 percent) would fill all 19,433 characters of «Мцыри» into POEM, which amendment 3 closes.

## 2. Amendments (replacement text for the brief)

**1. The ruling cited is not in the tree.** `origin/Shane:docs/memory/OPEN.md` ends at the Insights ruling of 2026-11-03 22:41 to 22:53 (line 3428); no 2026-11-04 entry exists, and Code is told not to touch `docs/memory/`. Replace, in the part 1 heading and its first paragraph, "`OPEN.md`, last section" with:
> Dann's ruling of 2026-11-04 09:40, quoted here because it is not yet pushed to `OPEN.md`: Wikisource texts are legitimate sources as long as the singer is told where the text came from; unverified entries fill POEM; the card's source line is the attribution.

**2. Part 1 names what the new field touches.** Add after 1.2:
> `verified: boolean` is also added to `PoemEntry` (`apps/web/src/lib/text/poem-library.ts:26-43`) and checked by `isEntry` (`:88-104`, `typeof e.verified === 'boolean'`); the hand-built entries in `loader-poems.test.ts`, `poem-library.test.ts`, and `poem-match.test.ts` gain it. The field pin at `tests/build-poem-library.test.ts:48` gains `'verified'`. The refusal of an entry with no `source.site` is already built (`scripts/build-poem-library.mjs:101`) and tested for a missing `url` (`tests/build-poem-library.test.ts:71`); add the missing-`site` case beside it. Rebuild (`node scripts/build-poem-library.mjs`) in this part, since `tests/build-poem-library.test.ts:111` holds the file on disk to the build byte for byte.

And replace 1.3's last sentence with:
> The attribution is already pinned in the browser for an unverified entry: the English quiet line (`e2e/poem-library.test.ts:25`, asserted at `:136` and `:211`) and the French card and line (`:376-381`). Add one unit test: `shipEntry` of an entry whose `verification.state` is `"unverified"` ships `verified: false` and its `source.site`.

**3. Part 2 names the number's carrier, the other site of the constant, and the long-poem case.** `PoemMatch` (`poem-match.ts:260-274`) carries `letterStart`, `letterEnd`, `start`, `end`, and not the query's span; `offer()` calls `stanzaCut(match.entry.textModern, match.start, match.end)` (`poem-offer.svelte.ts:114`) with no way to know the coverage. Replace the sentence beginning "Rule (DESK DEFAULT numbers)" with:
> `evaluate` (`poem-match.ts:281-310`) adds `coverage` to `PoemMatch`: `(alignment.queryEnd - alignment.queryStart + 1) / letters.length`, from the alignment it already holds (`:293`). `poem-source.ts` gains `cutFor(match: PoemMatch): StanzaCut` beside `stanzaCut`, and `offer()` (`poem-offer.svelte.ts:114`) calls it. Rule (DESK DEFAULT numbers): cut to a passage when the coverage is at least 0.8 **and** `entry.letters.length > MAX_LENGTH_RATIO * match.queryLetters`; **also** cut, whatever the coverage, when `entry.letters.length > LONG_POEM_RATIO * match.queryLetters` with `LONG_POEM_RATIO = 10` (a poor scan of the fish's song must not fill all of «Мцыри» into POEM); otherwise fill the whole body. `stanzaCut` itself does not change, and the tests at `poem-source.test.ts:94-140` keep calling it.
> CONTRACT §4: the coverage is computed nowhere else in the tree (grep `queryStart`, `coverage` under `apps/web/src`, this session: no other site). `MAX_LENGTH_RATIO` is read at `poem-match.ts:292` the other way round (Lyrics at most 3 times the entry, the no-fill rule for a cycle), pinned at `poem-match.test.ts:211`, and re-derived at `:250`; part 2 reads the same constant and changes none of those three. Nothing depended on the two readings agreeing beyond sharing the number.

Add to the tests sentence: "Fable's measured table (coverage and ratio for the nine filling fixtures) is in `review-fable-brief-poem-step8_r1_2026-11-04.md` section 1; the report's figures are checked against it."

**4. Part 3.1 is incomplete: four faults the scan found, each read this session.** Replace 3.1 with:
> 1. In `tools/poems/library.json`, in `textModern` and in `textEdition` where the same fault sits there:
>    (a) `419e40dd3c` («С чужой стороны»): remove the MediaWiki style block (offsets 134 to 2366 of `textModern`, 2,232 characters, from `.mw-parser-output` to the last `}`), the four U+200E marks, and the line number `5` with the U+00A0 after it before «Про юную пальму» (it is not glued: `5 Про`). Then restore the stanza structure: the file has a blank line after every verse line, while the source page (`oldid=5036885`, read 2026-11-04) prints two quatrains with single line breaks inside each and one blank line between them. Change nothing else; the combining grave on «Что̀» is the edition's.
>    (b) `cb6998d772`: remove the heading line «ИЗ ГЕЙНЕ.» (`textModern`) and «ИЗЪ ГЕЙНЕ.» (`textEdition`), each with its line break.
>    (c) `c1964bc3bd` («Мцыри»): remove the line `________` at offset 549, with its line break.
>    (d) `87376c1710` («Русская песня»): the source page (`oldid=5201296`, read 2026-11-04) prints `<i>8 декабря 1840<br />Москва</i>`: a line break. Restore it: `8 декабря 1840\nМосква`. Then widen `isDateline` (`poem-source.ts:42`) to a closing block of at most two lines and four words in all, holding a four-digit year, so the dating block still stays out of POEM; `poem-source.test.ts:113-119` (`ends['Русская песня']`) fails until it is widened, and that failure is the check.
>    (e) `298e556367` («Молитва», pre-reform): the word «покаянiем» (`textModern` offset 130) and «покаянiемъ» (`textEdition` offset 138) carry a Latin `i` (U+0069). Correct it to «и» in `textModern` and to «і» (U+0456) in `textEdition`, as the edition's other nine «і» stand, and log it as a rule 5 correction with this reason. (Dann's to strike: it is a letter of a word.)
>    (f) Collapse every run of three or more line breaks to two: 25 in «Мцыри» (chapter breaks whose numerals are already gone) and 1 in `419e40dd3c`. A fill that spans one prints two blank lines today.
>    Change no word of any poem beyond (e). Log each change in the report with entry id and the characters removed or changed.

**5. Part 3.3's check would miss the line number it names.** `5 Про` is a digit, a no-break space, and a letter, so "a digit glued to a letter" passes it. Replace 3.3 with:
> 3. A build-time check in the script refuses an entry whose `textModern` holds `{`, `}`, `.mw-`, U+200E, U+200F, a run of three or more underscores, a run of three or more line breaks, a Latin letter, a digit glued to a letter, or a line that begins with one to three digits followed by a space or U+00A0 and a letter and holds no four-digit year (a line number; a dating line such as «8 декабря 1840» passes). A test feeds it each fault and the clean library. The Latin-letter rule is safe for today's file: the scan this session found Latin letters only in the style block and in (e) above.

**6. Part 5 has no test surface.** No component test of `PoemLibraryCard.svelte` exists (`grep -rl PoemLibraryCard` this session: the component, `IntakeViews.svelte`, `i18n.ts`, and `poem-library-privacy.test.ts`). Replace part 5 with:
> In `poem-source.ts` add `showsLine(title: string, firstLine: string, passage: boolean): boolean`: false when `!passage && cardLine(firstLine) === cardLine(title)`. `naming` (`PoemLibraryCard.svelte:41-52`) sets `line` to null on false and the template omits `<p class="line">`. Unit test on the shipped entry `21568f1c1e` (title and first line both «Средь шумного бала, случайно», the line with its comma): false whole, true as a passage; and on `0127a63ffe`: true.

**7. Part 4 stands.** `PoemLibraryCard.svelte:45` reads `['«', '»']`; `i18n.ts:863`, `:876`, `:877` carry `« … »`; the pin is `e2e/poem-library.test.ts:377`. No change to the brief.

**8. Attribution: the site name links to the page (Dann's taste; recommended).** Add to part 1 as 1.4:
> 1.4 (taste, Dann's to strike). On the card only, the `{site}` of `cardSource` and `cardSourceModernized` is rendered as a link to `entry.source.url` (`target="_blank" rel="noopener noreferrer"`), the ratified sentence unchanged around it. The privacy test (`e2e/poem-library.test.ts:359-366`) still holds: an unclicked link makes no request; add to it that the link's `href` is the entry's own `source.url`. The quiet line stays text.

**9. The Done line.** Replace "every shipped entry carries its verification state and a named source" with:
> every shipped entry carries `verified` and `source.site`; the nine filling fixtures land as Fable's table has them; no `textModern` fails the part 3 check; «Русская песня» fills ending at «Сам с собою грущу…».

## 3. The owner's to rule

1. **The link on the site name (amendment 8).** Taste. Recommend yes: it is the one thing that turns "told where it came from" into "can check it", with no new string.
2. **The passage rule's numbers:** coverage 0.8 and `MAX_LENGTH_RATIO` 3 (amendment 3), and the long-poem bound of 10. Recommend adopt all three; the table shows no fixture on the wrong side.
3. **The Latin `i` in «Молитва» (amendment 4e).** It is a letter of a word, so his line "change no word" is his to apply. Recommend correct and log under rule 5.
4. **«1840» and «Москва» (amendment 4d):** the source's line break, or a space. Recommend the line break; the 19:50 ruling keeps the dating line "as the source prints it".
5. **A data note, not this step:** `cb6998d772` is titled «На севере диком стоит одиноко» and its text's first line reads «На севере дальнем стоит одиноко» (read from the file). After part 3 the card prints both, one word apart. Which is the title under the fourth rule is NOT ESTABLISHED; it lands with the verification data.
6. **French:** part 4's spaces only. No new French in this step; amendment 8 adds no word.

## 4. NOT ESTABLISHED

- The browser suite's result on this machine (unrun here); Code's baseline of eight is Code's.
- Whether the S cut (stanzas 25 to 28) spans the chapter break at offset 18020 of «Мцыри», so whether a singer sees two blank lines there today: not computed.
- Whether Ilya's transcription reads the combining grave in «Что̀» (U+0300, `419e40dd3c`) as a stress mark or as a stray character.
- For the verification data to come: the «С чужой стороны» page is transcribed from a scan of «Тютчев. Полное собрание сочинений (1913)», page 405, with Wikisource page quality 3 (read from the page this session). Whether that edition satisfies rule 1 is Dann's.
- Tokens used by this review: about 100k of the 180k cap (estimate; the harness does not report it).
