# Report: row 163, step 2 (the # drawn apart)

2026-11-01, Code (Sonnet), branch `mac-row163`, on `6f1aabfa`. Review amendments 5 to 11 applied. Copy and export are untouched: every IPA string (`graftBreak`, `vowel-resolver.ts:617-618`, `syllable-utils.ts:315-319`, `clitic-merge.ts:41-46`) still ends in `#`; the drawing sites split it off at render time.

## Where the # is split off and drawn (the four string sites keep appending; these draw)

- **Markup** (`packages/score-parser/src/staff-renderer.ts`): the underlay collector splits the trailing # (`splitBreak`), so the host's `<text data-ipa-of>` holds no #, and a second `<text data-ipa-break-of>` stands at the host's right edge plus one word space (`estimateIpaWidthPx(' ', 12)`, 256/1000 em), `text-anchor="start"`, same baseline and colour. It carries no `data-ipa-of`, so the squircle (`selection-ring.ts:296-305`) and the Loupe's hold rows (`loupe-hold.ts:180`) keep the host's box and the # stands outside it. DESK DEFAULT (amendment 8), Dann's to overrule. The Loupe's magnified score reuses the renderer (`loupe-render.ts:58-69`) and needs no code; its rendering was not separately screenshotted.
- New module `packages/score-parser/src/break-mark.ts` (split, extent, halves, element). `staff-renderer.ts` is **3427 lines against its ceiling of 3429**: it did not grow, and I lowered the ceiling to 3427 in `scripts/ratchets.json` (the ratchet's own rule). No ceiling was raised.
- **Text** (`apps/web/src/lib/components/Paper/WordStack.svelte`): the trailing # is split after `applyNotationPreferences` (`splitBreakMark` in `syntactic-break.ts`) and drawn in `<span class="ipa-break">`, whose gap is `margin-inline-start: 0.256em` in `app.css`, a margin and never a character. Nothing sits between host and # in the markup, so a browser copy reads «tkʌ#»; margin prints, so the print block keeps the gap. Both IPA-row branches (word, and clitic arrow) use it.
- **Inspector header IPA** (`InspectorPanel.svelte`, the `word-ipa` line): same span and gap. The file is at its ceiling (2432 of 2432) and stays there: the change is one line replaced by one line, with the CSS shared from `app.css`.
- Not drawn apart, by design: the Loupe's Syllables list (step 4) and anything that copies or exports strings.

## The width, and every caller (`CONTRACT.md` §4)

`underlayHalfWidth` (`staff-renderer.ts`) now takes a side. The left half is the widest of Cyrillic, host IPA, and sigla; the right half is that, or the host's right edge plus the space and the #, whichever reaches further (`underlayHalves`). Callers, all inside `columnAdvance`: the previous column's `'right'` half and the next column's `'left'` half. `columnAdvance` is called from `layoutColumns` at three places; `page-layout.ts` reaches it only through `layoutColumns` and needed no edit. No other caller exists (grep over `packages` and `apps/web/src`). Withheld sigla logic is unchanged for strings without a #.

## Measured: Sunless no. 1, a # after every word (step 0's probe, rerun)

- 34 #s drawn as their own elements, none inside a host string; 96 host IPA texts.
- **Columns that moved: 0 of 96** against step 0's reading, and 0 of 96 against the same song with no #. The # fits inside room the Cyrillic already asks for. Step 2's unit test shows the spacing does respond where the # reaches further: a # after the previous syllable widens `columnAdvance` by exactly the space plus the mark, and a # after the next syllable changes nothing.
- Picture: `docs/sessions/row163-step2_2026-11-01/markup-sunless01-hash-after.png` (Chromium with the page's fallback fonts; Lato IPA is not loaded in that render, so glyph shapes differ from the app's). «jɑ #» stands with a space, the host centred on its Cyrillic «я,». The probe is kept beside it as `.txt`.

## Tests

- `break-mark.test.ts` (9, new): split, extent (256 + 580 per 1000 em), halves, element position for centred and left-anchored hosts, no `data-ipa-of`, spacing through `columnAdvance`.
- `word-stack-break.test.ts` (3, new): server-renders `WordStack` with the real dictionary; # in its own span, nothing between, no # in the host text.
- `syntactic-break.test.ts` (+3): `splitBreakMark`, and that the parts rejoin to the engine's string.
- `syntactic-break-surfaces.test.ts`: the Markup test that pinned `ˈjɑ#` now pins `ˈjɑ` and a separate `#` with its own handle.

## Gates

| Gate | Baseline | Now |
|---|---|---|
| 1 phonology | 291 | 291 |
| 2 dictionary | 248 | 248 |
| 3 web check | 0 errors, 12 warnings, 5 files | same |
| 4 web test | 3726 after step 1 (3718 at baseline) | **3732 passed, 1 skipped (3733)** |
| 5 score-parser | 775 passed, 5 skipped | **784 passed, 5 skipped (789)** (+9) |
| 6 blurb | 145 | 145 |
| 7 integration | 55 | 55 |
| 8 ratchets | OK | OK |

## Not established

- **Can a singer tell the analysis `[#]` (`staff-renderer.ts`, `data-analysis="phonation-break"`) from the typed #** once both stand alone on the IPA line? Report only. No bar of the fixtures holds both, so no screenshot.
- The Markup gap is about 3 px at the 12 px IPA size (one word space of the table). Whether that reads as «obvious spacing» (Dann 14:07) on the live page was not judged here; Dann's mock of 14:17 is the reference.
- The Text gap uses the page's sans face with a margin of 0.256 em; the Lato IPA table's value is used as the number, as the review prescribes.
- Not run: the Playwright suite, and a live-page measurement of Text in a browser (the server render proves the markup, not the pixels).
