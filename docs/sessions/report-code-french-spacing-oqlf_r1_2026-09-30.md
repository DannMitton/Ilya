# Report from Code: French spacing follows the OQLF table (QUEUE row 2g)

Code, 2026-09-30. Brief: `brief-code-french-spacing-oqlf_r1_2026-09-30.md`. Read on branch `Shane` at `93bc639`, working tree dirty with the uncommitted rows 2b to 2f. No git writes. Spacing changed only; no word changed.

## Summary

- **182 breaks fixed.** All but three are a space before « ; » or « ? ». The three are one colon and two guillemets. The table's other signs were already right everywhere Ilya writes French.
- **The built bundle now holds no space of any kind before « ; », « ? », or « ! ».** Before: 135.
- **A test in `i18n.test.ts` now fails on any drift**, and it replaces the test that enforced the reversed 2026-09-28 rule.
- **Beyond the brief's list:** the word explanations (`data/blurb-composer.json`) carried 44 « ; » with U+00A0. Fixed under the same ruling.
- **Gates:** all eight at baseline. Gate 4 stays at 1760.
- **One question for Dann (French)**, at the end.

## Counts per sign, source

"Before" is the tree after row 2f; "after" is now. A break is a sign the table rejects.

| Where | Sign | Before | After |
|---|---|---|---|
| `i18n.ts` French values | « ; » after U+202F | 16 (13 as ` `, 3 as the literal character) | 0 |
| | « ? » after U+202F | 8 (`voiceIntake.*`) | 0 |
| | « ; », « ? », « ! » with no space | 5 « ; » (all inside the footer's `style` attribute, not prose), 13 « ? » | 21 « ? », 16 « ; » in prose |
| | « : » with U+00A0 | 62 | 62 |
| | « : » without | 10, all code: CSS in `footer.attribution`, `{cite:…}` tokens | unchanged |
| | « » with U+00A0 inside | 8 pairs | 8 pairs |
| `LearnContent.svelte`, French body (lines 15 to 2064) | « ; » after `&#8239;` | 84 | 0 |
| | « ; » with no space | 3 | 87 |
| | « ? » / « ! » with no space | 24 / 2 | 24 / 2 |
| | « : » with U+00A0 | 243 | 243 (1 more is inside the English title *Russian Lyric Diction: A practical guide*) |
| | « » with U+00A0 inside | 121 pairs, plus 2 guillemets that a line break separated from their word (a breakable space) | 122 pairs, 0 broken |
| `GuideContent.svelte`, French body (lines 16 to 294) | « ; » after `&#8239;` | 26 | 0 |
| | « ? » with no space | 9 | 9 |
| | « : » with U+00A0 | 36 (2 more inside English titles) | 36 |
| `Drawer.svelte:676` (the Learn table of contents) | « ? » after U+00A0 | 1 (« Qu’est-ce que la palatalisation ? ») | 0 |
| `markup/legend.ts:43` | « : » after an ordinary space | 1 (« différemment : rien ») | 0, now U+00A0 |
| `data/blurb-composer.json` (word explanations) | « ; » after U+00A0 | 44 | 0 |
| | « : » with U+00A0 / « » with U+00A0 | 36 / 8 pairs | unchanged |

The brief's "13 « ; » with U+202F" in `i18n.ts` is 16. The three it did not count are written as the literal character, not as ` `: `upload.banner.reader` and two `comment.working.consequence.*` keys.

« … », « % », and « , » were already right everywhere: no space before an ellipsis (10 in `i18n.ts`), U+00A0 before the one percent sign (`insights.phonation.share`), and no space before a comma.

## Counts per sign, bundle

`pnpm --filter @ilya/web build`, then a byte count over `apps/web/build/` of every way a space can be written before each sign (literal, ` `, `\xa0`, `&#8239;`, `&#160;`, `&nbsp;`, and the rest). The count needs no language test: no English string in Ilya puts a no-break space before « ; ».

| Pattern | Before | After |
|---|---|---|
| U+202F before « ; » | 126 (= 16 + 84 + 26, matching the source) | 0 |
| U+202F before « ? » | 8 | 0 |
| U+00A0 before « ? » | 1 (the Drawer) | 0 |
| an ordinary space before « ; », « ? », « ! » in text | 0 | 0 |
| an ordinary space before « : » in French text | 1 (`legend.ts`) | 0 |
| U+00A0 before « : » | 341 | 342 |
| « » without U+00A0 inside, in text | 0 | 0 (the 12 hits are regular expressions and an English diagnostic string) |

**Not covered by the bundle:** the word explanations load at runtime from `data/blurb-composer.json` (counted from the file, in the source table). The dictionary's French glosses (kaikki.org) were not checked; they are Wiktionary's text, not Ilya's copy.

**A colon with no space at all** in French composed in code: a sweep of the bundle for a letter, a colon, a space, and French on both sides found none. A sweep of component source could not settle it alone, because apostrophes in comments break quote pairing; the bundle sweep is the evidence.

**Checked live** at `http://fitcheck.localhost:5173/` in French: the page text holds 93 « ; » on Leçons and 34 on the Guide (page scripts included), none with a space before; no « ? » with a space before on either.

## The test

`apps/web/src/lib/i18n.test.ts`, "French spacing follows the OQLF table", two tests. It **replaces** "French semicolons carry a narrow no-break space", which enforced the 2026-09-28 rule and would now fail. Its comment cites the 2026-09-30 21:39 ruling and says what it reverses.

- It fails on any French value with a space of any kind before « ; », « ? », or « ! »; without U+00A0 before « : »; or without U+00A0 inside « ».
- It skips tags, entities, a colon between digits (a time), and a colon before `//` (a URL).
- A `{placeholder}` or `{cite:…}` reads as one letter, because each prints as text. A citation prints as "(Miller 1986, p. 158)", so « lui-même {cite:RMR-057}; mais » is right and « lui-même {cite:RMR-057} ; mais » is a fault. My first draft dropped the token, and that misread this key; the positive controls now pin both.
- Not vacuous: it requires at least 16 « ; », 21 « ? », 62 « : », and 8 « in French prose, the counts on 2026-09-30.

The test covers `i18n.ts` only, as the brief asks. Learn, Guide, the Drawer, `legend.ts`, and the blurb data have no drift test.

## Other tests updated for the ruling

- `analysis/watchlist.test.ts:568` and `:584` expected ` ;` in two watch lines. Now `;`.
- `insights/comments.test.ts`, the three r7 French texts (`FR_E4`, `FR_EB4`, `FR_D4`) are ratified with « ; » spaced. Their comment now says the words are the ratified ones and the spacing follows the 21:39 ruling, which postdates the ratification. Three spaces removed, no word changed.

## Comments citing the 2026-09-28 ruling

The only code comment that cited it was the replaced test's. `PRODUCT.md` and `ENVIRONMENT.md` already carry the desk's supersession; Code did not edit them.

## For Dann (French), one question

The Guide's Sources section prints its references the same way in both languages, Chicago style: « Reid, Cornelius L. Voice: Psyche and Soma. New York: Joseph Patelson Music House ». In a French session the colon between place and publisher has no space. Code left the references alone: the titles are English and keep their own colons, and the place-and-publisher colon is reference style, not prose. Should French references take U+00A0 before that colon (« New York : Joseph Patelson »)?

## Gates

Run from a scratch copy of `~/Downloads/ilya-ship.sh` that cannot stage.

| Gate | Before (after row 2f) | After |
|---|---|---|
| 1 phonology | 251 passed (251) | 251 passed (251) |
| 2 dictionary | 235 passed (235) | 235 passed (235) |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 1760 passed (1760) | 1760 passed (1760) |
| 5 score-parser | 636 passed, 5 skipped (641) | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) | 145 passed (145) |
| 7 integration | 55 passed (55) | 55 passed (55) |
| 8 ratchets | OK | OK |

A first "after" run had gate 4 at 3 failed, 1757 passed: the three r7 French texts. The second run, after the update, is the one in the table.

## Files changed

- `apps/web/src/lib/i18n.ts` (24 values; it also carries row 2f's three keys)
- `apps/web/src/lib/i18n.test.ts`
- `apps/web/src/lib/components/Reading/LearnContent.svelte`
- `apps/web/src/lib/components/Reading/GuideContent.svelte`
- `apps/web/src/lib/components/Drawer/Drawer.svelte`
- `apps/web/src/lib/markup/legend.ts`
- `apps/web/src/lib/analysis/watchlist.test.ts`
- `apps/web/src/lib/insights/comments.test.ts`
- `data/blurb-composer.json`
