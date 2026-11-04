# Report: poem library build 1, step 7, part 2, the header (Code cloud lane, r1, 2026-11-04)

Brief: `brief-code-poem-library-build1-step7_r4_2026-11-03.md`, Part 2, with `review-fable-poem-build1-step7_r1_` amendments 7 to 10 and `_r2_` amendment 12. Branch `cloud-lane-31`, on top of part 1.

## Where TEXT chooses which text it transcribes (the brief asks for file and line)

- `shown` is `apps/web/src/routes/+page.svelte:463`: `shownWitness(lyricsHas, poemHas, witnessDiffer, inputViews.witnessChoice[doc.id] ?? 'lyrics')`.
- `shownWitness` is `apps/web/src/lib/text/witness-lines.ts:116-119`: no Lyrics and a Poem prints the poem; Lyrics and Poem that do not differ print Lyrics; with both and different, the poem only where the TEXT pair is on it.
- `textLines` branches on it at `+page.svelte:476` (`shown === 'poem' ? poemLines : lines.length > 0 ? lines : derivedLines`), and `effectiveLines` feeds `Paper` from it. The pair on TEXT already shows `shown` (`TextWitnessPair`, `witness={shown}`). So the pill that can disagree with the page is INPUT's view, not TEXT's.

**The label is driven from `shown` and from nothing else** (r1 amendment 8): one prop, `witness`, passes `+page.svelte` (`<Paper ... witness={shown}`, the same line as before, so the page stays at its 5,586 lines) to `Paper.svelte`, to `TitlePage.svelte` and `SubsequentPage.svelte`, which derive their tab name from it. Neither page reads INPUT's view or `witnessChoice`; a test fails if they do.

## What was built

| File | State |
|---|---|
| `lib/text/text-header.ts` | new, pure: `textTabKey(witness, hasLines)` |
| `lib/i18n.ts` | `paper.headerPoem`, `paper.headerLyrics` added next to `tab.text`, with the ratification date (2026-11-03 20:21) in the comment; the index header counts 1,133 keys and `paper.` 4 |
| `Paper.svelte`, `TitlePage.svelte`, `SubsequentPage.svelte` | the `witness` prop and a derived `tabName`; page 1's mark and every later running head use it |
| `routes/+page.svelte` | `witness={shown}` on the existing `<Paper>` line |
| tests | `text/text-header.test.ts` (14), `e2e/text-header.test.ts` (14), and `one-head-one-foot.test.ts` updated |

Strings (ratified): `paper.headerPoem` EN "TEXT: POEM", FR « TEXTE : POÈME »; `paper.headerLyrics` EN "TEXT: LYRICS", FR « TEXTE : PAROLES », with a no-break space before the colon as the file's French has it. MELODY and INSIGHTS heads are unchanged (a test reads them).

**The empty state** (r1 amendment 7, DESK DEFAULT, reversible): with no lines at all the page prints no text (the empty directive is hidden in print), so the label is the bare `tab.text`. `shownWitness` returns `'lyrics'` for that state, which would have read TEXT: LYRICS over a page that prints nothing; `textTabKey` takes whether the document has any line.

**One thing worth knowing, as Fable's review says, so it is not "fixed":** a singer who kept a library poem that is identical to her Lyrics gets no pair (`witnessDiffer` is false) and the page prints Lyrics, so it reads TEXT: LYRICS. That is correct by the rule.

## The updated test (r1 amendment 10)

`one-head-one-foot.test.ts` asserted the literal `tabName={t('tab.text', language)}` in both Text pages. I changed it to the new shape and did not loosen it: it now requires `{tabName}` on both running heads and the exact derivation `const tabName = $derived(t(textTabKey(witness, documentHasLines), language));` on both pages. The Markup and Insights assertions are untouched.

## The state table, run in the browser (r1 amendment 9)

Each state in English and French, **on screen and under `emulateMedia('print')`, on page 1's mark and on every later page's running head** (the fixture is 30 lines, so the song has more than one page; the test fails if it does not): Lyrics only; Poem only with INPUT on LYRICS (reads POEM); both the same (no pair offered, `#text-tab-poem` absent; reads LYRICS); both different with the pair on LYRICS; with the pair on POEM; a POEM view with an empty POEM (reads LYRICS); and nothing entered (the bare TEXT, TEXTE). **28 browser checks, all green** (14 tests, 2 media each). The unit test runs the same table through the real `shownWitness`.

**Control:** removing `witness={shown}` from the `<Paper>` line makes the "Poem only" browser test read `TEXT: LYRICS` where it expects `TEXT: POEM`; restored.

## Gates after part 2

| Gate | Part 1 | Now |
|---|---|---|
| web unit | 4120 + 1 skipped | **4134** + 1 skipped |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings (993 files) |
| ratchets | OK | OK (`+page.svelte` 5586 of 5586) |
| build | succeeded | succeeded |
| e2e | | `e2e/text-header.test.ts` 14 of 14. The whole suite is Part 5's. |
| the other packages | | not rerun (no change in them) |

## NOT ESTABLISHED

- Whether a longer label on page 2 shortens the piece's ellipsis visibly: the running head ellipsizes the piece (`RunningHeader.svelte`), the tab slot does not shrink; I did not look at the width on a long title.
- Anything on a printed POEM page that tells a coach what grey words mean (r1; outside this brief).
