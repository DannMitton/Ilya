# Brief for Code: poem library build 1, step 7 (desk, r3, 2026-11-03 21:0x)

Follows `brief-code-poem-library-build1_r3_2026-11-03.md` and your reports `report-code-poem-build1-step0` to `step6` on `cloud-lane-31`. Same lane, same rules: one commit and one report per part, push after each, never `Shane` or `main`, never `docs/memory/`. Fable-reviewed: `review-fable-poem-build1-step7_r1_2026-11-03.md` (SEND WITH AMENDMENTS, 14). **Read it in full and apply all 14 amendments**, except where this r2 says otherwise (Part 1's order, below, and amendment 13, D4). r1 and r2 are superseded.

## The singer's walk (this governs)

1. **She prints TEXT for a song whose POEM holds a poem.** Every page ends above its footer: no word, gloss, or IPA line touches the footer, on screen or in print, in English or French. Where the song needs another page, the next row starts page 2; there is no empty band in the middle of the document (`PRODUCT.md` rule 2, `page-config.ts:145-150`).
2. **She, or her coach, reads a printed page and knows which text it holds.** The top-right header reads **TEXT: POEM** when the page transcribes the poem and **TEXT: LYRICS** when it transcribes the sung words. It names what the page actually prints, never which pill is lit: a POEM view with an empty POEM prints LYRICS, so it reads TEXT: LYRICS (Dann 2026-11-03 20:17 to 20:19: *"they must correspond"*).
3. **She sees a library poem in POEM without its dating line.** «Весёлый час» ends at «Видит заря!», not «1830» (Dann 19:50: *"keep the date in the library's record but leave it out of POEM"*).
4. **The card's wording is the ratified wording** (D1 to D4 below).

## Parts

0. **Merge `origin/Shane` (`ee3a1d72`, row 177 shipped) into `cloud-lane-31`.** Report conflicts, if any, and the eight gates after the merge.
1. **The page fit (walk item 1): fix it correctly and for posterity** (Dann 20:37 to 20:39: *"more code than a corrected sum is fine. You know I prefer quality over speed"*; *"Unconditional ... fix it correctly and for posterity"*). Build on Dann's layout of 2026-02-20 (`46829627`, "flex-column page layout resolves word stack collision": rows grow with their wrap under a hanging indent and push the next row down, so words never collide); keep it, and keep his rule: try 10 rows, drop to 9 or 8 when the gap falls below 18 px.
   - **What the desk measured itself, on `e4105a84` in a browser (2026-11-03 20:4x to 21:0x; scratch diff, never committed, `desk-probe-and-sum.diff` beside this brief):**
     1. Reproduced: `pages-without-gaps.test.ts:142`, Tchaikovsky Op. 38 no. 3, text, en and fr, screen and print, page 1: **7.4 px** into the footer.
     2. Correcting the sum alone (subtracting the content window's 4 px `padding-top`, `TitlePage.svelte` `.page-content`, and flooring the gap instead of rounding it, `rowConfig`) leaves **1.1 px**. The sum is part of the cause, not all of it.
     3. A probe of page 1 found three fixed values that are not what the page draws: each `.verse-row` is **56.3 px**, not `ROW_HEIGHT` 56 (`page-config.ts`); each row's ink reaches **1.1 px** below its box; and the footer is not 80 px (`FOOTER_MAX_HEIGHT`, `page-config.ts:84`): with the poem filled, page 1 carries a **provenance legend** («ё stress») whose top sits at **918 px**, above the content window's bottom edge at 920 px. The content's lowest ink is at 919.1 px, so it touches the legend. The footer grew; the page reserved a constant.
   - **The fix, all of it:** (a) the sum corrected (padding counted, gap floored); (b) the footer measured on every Text page (`PageFooter`'s `onheightchange`, amendment 2), so a legend that grows the footer shrinks the content window; (c) the rows measured as drawn, ink included, not assumed at 56 px (amendments 3 to 5: every page, one measurement passed to a pure slicer, print equal to screen). The 10, 9, 8 rule then decides from true heights.
   - **Tests (amendment 6), plus:** the Tchaikovsky case above; a page whose footer carries one legend and a page whose footer carries two; a song of at least 25 one-row lines; lines whose gloss or line wraps; both languages, both media, A4 and Letter.
   - **Comments for posterity:** where the code takes a measured height instead of a constant, say why in one comment that cites this brief and the three measured facts above, so no one restores the constants later.
   - Unchanged: the footer's own design, the 18 px minimum gap, rule 2 (no mid-document empty band), and the line-cut rule (at least two rows on each side).
2. **The header (walk item 2).** The running header's tab name (`RunningHeader.svelte`, passed as `t('tab.text')` from `TitlePage.svelte:155` and `SubsequentPage.svelte:81`) becomes the label for the text actually printed. Find, with file and line, where TEXT chooses which text it transcribes, and drive the label from that, not from the pill. Strings RATIFIED by Dann 20:21: `paper.headerPoem` EN "TEXT: POEM", FR « TEXTE : POÈME »; `paper.headerLyrics` EN "TEXT: LYRICS", FR « TEXTE : PAROLES » (no-break space before the colon, as the file's French does). MELODY and INSIGHTS headers are unchanged. Test: each label in each state, including POEM view with an empty POEM.
3. **The dating line (walk item 3).** A trailing dating line (your `bodyStanzas` test, `text/poem-source.ts:42`) is never filled into POEM; `library.json` keeps it. A song that sets the whole poem fills the body verbatim without it, and is still not called a passage.
4. **Strings D1 to D4, ratified by Dann 20:01 (all poem-card and gloss strings ratified 20:21; mark the comment in `i18n.ts` accordingly).**
   - D1: a Russian title or line is quoted in the sentence's own language: English “…”, French « … ». Applies to `intake.poemLibrary.passage`, `intake.view.libraryPoem`, `intake.view.libraryPoemEdited` (English side only changes).
   - D2: `intake.poemLibrary.cardColours` EN "Coloured words in LYRICS now show where your song departs from this poem."; FR « Les mots en couleur du champ PAROLES montrent maintenant où la mise en musique s’écarte de ce poème. »
   - D3: the site's name per language: EN "Russian Wikisource", FR « Wikisource en russe » (not the data's English `source.site` in French).
   - D4 (amendment 13, resolved here as DESK DEFAULT, Dann may revise): join the passage's lines with a space from its first line until the running count reaches four words; drop the closing punctuation; lower the first letter of each joined line, as the ratified example does: «Дитя моё, останься здесь со мной» is the oracle. Report any library entry where a joined line begins with a proper noun (none is known today).
5. **Gates, the walk, and the e2e baseline.** The eight gates; the e2e suite against the 8 baseline failures by name, with the two step 6 failures now green; a test for each walk item 1 to 4.

## Done

Parts 0 to 5 pushed with reports; no page overruns its footer for any fixture; the header matches the printed text in every state; nothing else changes.
