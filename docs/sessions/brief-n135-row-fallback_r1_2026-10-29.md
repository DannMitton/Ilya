# Brief: N.135, a fallback when no row passes the word test, r1 (desk, Opus, 2026-10-29)

For an antagonistic review, then Dann's decision. Ruled in by Dann 2026-10-29 19:47 (*"yes, brief that fallback with an Opus review"*). Phase 0 measures only; Phase 1 becomes a Code brief after Phase 0 and Dann's yes. "Fallback" and "syllable-likeness" are the desk's coined terms.

## 0. Why, in the singer's terms

On U5 page 6, system 4 (`~/Downloads/_desk-2026-10-28/a2-inputs/pdfs/U5.pdf`), the reader read the Russian row exactly: «тейской ме ло чи неза. глу. шимый шо пот, У» against the print «тей- ской ме- ло- чи не- за- глу- ши- мый шо- пот, у-». Ilya threw it away and seated nothing, so the singer gets 13 empty notes under a row Ilya had read. The publisher sets wide-spaced syllables with low marks between them (measured by the desk at 400 dpi: the marks' centres about four-fifths of the way down the letter height, where a hyphen sits at mid-height), so the row reads as separate syllables, not words.

## 1. What the code does (read this session, `cloud-lane-21` `d6db949a`, identical in `apps/web/src/lib/omr/` to `Shane` `f6c8ae43`)

- `seatPage` (`apps/web/src/lib/omr/underlay-page.ts:152`), per system, per row in order: forms the row's words (`rowWordSpans(pageTokens(row, reads))`, `:177-180`), skips the row unless `rowLanguage(words, seams.isWord)` is `'russian'` (`:181`), and seats only the first row that passes (`if (seated) continue; seated = true;`, `:189-190`).
- `rowLanguage` (`omr/underlay-language.ts:56`): a row is Russian where at least `RUSSIAN_SHARE` = 0.3 (`:32`) of its words of `MIN_LETTERS` = 2 letters or more (`:25`) are dictionary entries (`wordKnown`, `:46`).
- A system with no row seated is reported to the singer by the unread-bars banner (`omr/underlay-song.ts:83-90`, `unread-bars.ts`), ratified EN and FR 2026-10-28.

## 2. What the desk measured (shipped code, A2's captures, 18 build songs)

Script `rows10.mjs` dumps every row's words, call, and seating with the build's own `pageTokens`, `rowWordSpans`, `rowLanguage`, and `wordKnown`; `rowcall2.py` matches each printed row (truth key `p<page>s<system>r<row>`) to the captured row of that system most like it (`difflib` ratio on letters) and sorts the printed syllables. Archive `~/Downloads/_desk-2026-10-29/drift-look_2026-10-29.tgz` (md5 `204c7d8b`).

| what happened to the printed row | syllables |
|---|---|
| the best-read row is the one seated | 2,316 |
| the best row is called other, and nothing is seated in its system (F) | 73 |
| the best row is called other, and a different row is seated (E) | 12 |
| the best row is called Russian, but a row above it is seated first (D) | 10 |
| no captured row resembles the print (ratio under 0.5) | 74 |
| the system was not captured | 53 |
| total | 2,538 |

Examples of F: U5 p6s4r1 (ratio 1.00, 2 of 9 words known), P p2s4r1 (0.91, 1 of 7: «сътъхъпоръвъмоенъсердцѣ»), B04 p2s3r1 (0.91, 1 of 7). Of D: S p1s1r2 (1.00, 3 of 3 known; a noise row «ѵ Му съпа, пту» above it seated first). Of E: B06 p3s3r1 (0.94, 0 of 7 known: «з вучат», «Б ыл», «н я», words broken by spaces; a noise row «ж ѣѣѣ з в в» seated). 19 of 239 captured systems seat no row (K 5, B10 3, U5 3, B07 2, B09 2, B04 1, B06 1, P 1, U6 1); how many of those are piano-only systems with nothing to seat is NOT ESTABLISHED.

## 3. The design

**R1, the fallback (targets F, 73).** Where no row of a system passes `rowLanguage`, choose the row with the highest syllable-likeness, and seat it only if that score clears a floor Phase 0 sets. Syllable-likeness of a row, from its tokens: the share of tokens made only of Cyrillic letters (modern and pre-reform) and marks; the share of those holding exactly one vowel letter (`CYRILLIC_VOWEL`, «й» a consonant, `CONTRACT.md` §0.1); and the ratio of the row's one-vowel tokens to the system's free notes (`freeNoteXs`, `omr/underlay-counts.ts:40`), near 1 where the row is the lyric. The fallback never seats a row with any Latin letter (the German row) and never seats in a system with no voice notes.

**R2, the best Russian row, not the first (targets D, 10).** Where two or more rows of a system pass `rowLanguage`, seat the one with the highest syllable-likeness instead of the first. Measured separately from R1.

**R3, sew across a broken word before the test (targets part of E, 12).** Before `rowLanguage`, also try joining adjacent tokens with no vowel or one letter («з»+«вучат», «Б»+«ыл»); a row passes if either form passes. Measured separately; the 2026-10-28 harness found a gap rule lost at every threshold for seating, but this joins only for the test, not for seating.

Each rule reports to the console which rule chose the row, and nothing is marked for the singer. The banner still names a system where nothing was seated. The Text view does not change.

## 4. Phase 0: measure first (desk helper, Sonnet)

On A2's captures through the replay at `f6c8ae43` (`replay-scripts_2026-10-29.tgz`, the README's commands; `real7.mjs` and `rows10.mjs` from the two desk archives), with the build's own functions:
1. Controls: the replay reproduces 1,880 / 1,710 / 1,870 / 640 / 79; `rowcall2.py` reproduces section 2's table.
2. R1, R2, R3 each alone, then together, as a copy of `underlay-page.ts` with the rule inserted where `:181-190` decide: read right, (b), (a), (c), vowelless alone, per song, and section 2's table again.
3. **Harm:** every system where a rule seats a different row than today, listed with the row seated, its words, and whether the print's row was the one chosen; and every system where the fallback seats a row of noise.
4. **Held out:** the floor of R1 and the weights of syllable-likeness set on half the songs and reported on the other half; B01 to B10 also held out as one group.
5. The 19 systems with no row seated: for each, whether it holds voice notes (`system.notes`), so a piano-only system is never counted as a loss.

**Decision gate for Dann:** a rule goes to Phase 1 if it gains on the held-out half and seats a noise row in no more than one system in twenty of those it changes (DESK DEFAULT).

## 5. Phase 1 (Code, cloud lane, after Phase 0 and Dann's yes)

The rules that pass, in `omr/` beside `rowLanguage`, pure, with tests and mutants (a mutant that drops the Latin-letter guard must fail); `UNDERLAY_READER` raised one version (`omr/stamp.ts`); behind `?words=read` (`underlay-switch.ts:20-27`, per the browser report).

## 6. Cross-site line (`CONTRACT.md` §4)

Phase 1 changes which row a system seats. Other sites that judge a row or depend on that choice: `rowLanguage` (`underlay-language.ts:56`, also used by `ocr-guard.ts`'s `unknownWordShare` pattern), the unread-bars banner (`underlay-song.ts:83-90`), step 2's per-system failure and step 7's counts (`underlay-page.ts`, `underlay-counts.ts`), and the browser measure's per-row figures. The Phase 1 brief says what depends on them agreeing.

## 7. NOT ESTABLISHED

Every yield; how many of the 19 empty systems hold voice notes; whether the low syllable marks are read as periods elsewhere in this publisher's songs (U5's «неза. глу.» suggests so); whether the 74 "no row resembles the print" are strips cut in the wrong place or letters too damaged; the 53 "not captured" by cause.
