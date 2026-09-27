# Brief for Code: Latin words stay on the page

**Desk brief r1, 2026-09-26. Shape: `BRIEF-TEMPLATE.md`.**

## 1. What was observed

In Mussorgsky's «Семинарист» the seminarian recites Latin, printed in Latin
letters. Ilya shows none of those words on the page: the singer loses words of
the song, with no mark that anything is missing.

## 2. What is established

- `apps/web/src/lib/components/Paper/VerseLine.svelte:20–21`:
  `const displayWords = $derived(words.filter(w => /[А-Яа-яЁё]/.test(w.cyrillic || '')))`.
  A word with no Cyrillic letter never reaches `WordStack.svelte`. Read by the
  desk at `audit` HEAD, 2026-09-26.
- Lead, not re-verified: `claude/sonnet-memo-verify-frequency-census_2026-07-28.md`
  (project knowledge) found the same filter and named «Семинарист» as affected.
- Grayson's dissertation does not treat the Seminarian or Latin (the desk searched
  the full text, 2026-09-26). Its IPA inventory has no [w].

## 3. Measure before you change anything

1. Find every place a non-Cyrillic word is dropped between the text field and the
   page: tokenizing, the pipeline, `VerseLine`, the reading aid, and print. Report
   each with its `path:line`.
2. Say what a Latin token carries through the pipeline today (IPA, gloss, stress
   source), and what `WordStack` would draw if the filter let it through.
3. Say whether punctuation-only tokens pass the same filter, and make sure they
   stay off the page.

## 4. The rulings this serves

- Dann, 2026-09-26 10:09: *"option 1 now, and option 2 once I can show you
  Richter's page."* Option 1, as offered: keep Latin words on the page, marked as
  Latin, with no IPA under them. Option 2 (a small table of the Seminarian's
  Latin with Richter's transcriptions, [w] as the one documented exception) waits
  for Richter's page and is **out of scope here**.
- `CONTRACT.md` §6: IPA comes only from Ilya; do not write IPA the engine did not
  produce.

## 5. Constraints

- **The word keeps its place in the line**, in the order the poem gives it.
- **No IPA and no gloss** under a Latin word, and no stress mark. **DESK DEFAULT
  for the mark:** the word in italics, which is the engraving convention for text
  in another language, with its IPA and gloss rows left empty. No new string, so
  no French is needed. Dann's walk decides whether the italics are enough.
- Russian words are untouched; every approval file stays byte-identical.
- No git command that writes.
- **Displaces:** nothing scheduled.

## 6. Done when

- «Семинарист»'s Latin lines appear on the page in order, italic, with no IPA,
  on screen and in print.
- A test pins that a Latin word in a line reaches the page and carries no IPA,
  and that a punctuation-only token still does not.
- All gates pass, including `pnpm ratchets` and Playwright.
- `WRITTEN` on the code. `DONE` is Dann's walk on «Семинарист».

## 7. Report back

Section 3's findings, the commit, the results against section 6, and what could
not be established. **NOT ESTABLISHED beats a complete invented answer.**

## ADDENDUM 2026-09-27: option 2 is now in scope, once Dann checks the table

Dann photographed Richter's pages on 2026-09-27. The table of the Seminarian's
thirty Latin words, in Grayson's notation, is
`table-seminarian-latin_r1_2026-09-27.md`. **When Dann has checked its CHECK rows
and ruled on its rights question,** this brief grows by three things:

- A Latin word found in that table shows the table's IPA under it (still no gloss);
  any other Latin word shows none, as section 5 says.
- [w] becomes the one documented exception to Grayson's inventory: named in
  `ARCHITECTURE.md` invariant 4 with Richter p. xii, and allowed by
  `apps/web/src/lib/approval/invariants.test.ts` only for these words.
- A test pins each of the thirty words' IPA from the table.
- **Attribution, as Dann requires (2026-09-27 00:58: "I want unassailable citation
  to preserve our claims of scholarly fair use"):** wherever Ilya shows a Latin
  word's IPA, it credits Richter the way it credits Grayson elsewhere: "(Richter,
  2002, pp. 43–49)", the page range covering both versions of the song. The
  printed page carries the same credit. `NOTICES.md` already carries the full
  reference (added 2026-09-27); the code comment on the table cites p. xii for
  [w].

