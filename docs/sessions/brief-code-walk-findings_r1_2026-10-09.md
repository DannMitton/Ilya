# Brief for Code: four fixes from Dann's walk of 2026-10-09 (r1)

Written by the desk (Opus) 2026-10-09 about 02:00. **For the cloud lane**, Sonnet, after QUEUE rows 51 (slice 1) and 58. Four parts, one commit each, in this order. Each part's rulings are in `docs/memory/OPEN.md` under the heading named.

## What the singer will notice

1. Printing a song gives exactly the pages Ilya numbers: no blank sheet at the end.
2. The key to the stems (up = close timbre, down = open timbre) sits at the top of page 1, beside the subtitle, and page 1 gets its last system back.
3. A bass entering his *passaggio* sees it on a bass clef, like every other note he enters.
4. A poem that prints «не» apart from its word («не проглядная») gets the word's stress and its reduced vowels.

## 1. What was observed

- **Print.** *Without Sun*, no. 1, numbered "Page 2 of 2" by Ilya, prints three pages in Chrome's preview; the third is blank. Seen by Dann 2026-10-09 01:24 and again 01:29 from an ordinary tab (so not the Chrome extension).
- **Legend.** With the stems key at the foot of Markup's page 1, that page holds five systems on this song where it held six before (`docs/memory/OWED.md`, the desk walk of 2026-10-02).
- **Clef.** In Dann's voice characteristics, his secondary *passaggio* D♯4 draws on a treble clef; every other note in the panel draws on a bass clef. His stored voice declares `voiceType: "bass"`.
- **«не».** In *Without Sun*, no. 1, «не проглядная» drew «про» as [pro], unreduced. Joined as «непроглядная», it drew [prɑ].

## 2. What is established (read by the desk 2026-10-09)

- **Print:** every `.paper-page` breaks after (`apps/web/src/app.css:327-328`) except `.paper-page:last-child` (`:345-348`); `@page { size: letter; margin: 0 }`. In the live page the two `.paper-page` elements measured 816 by 1056 px each, and the last was its container's last child (`.markup-paper-container`). After that container came `.sheet-print` (hidden in print), Svelte's `#svelte-announcer` (absolute, 1 px), and scripts.
- **Legend:** the Markup legend is built by `buildMarkupLegend` (`apps/web/src/lib/markup/MarkupPane.svelte:760`; `apps/web/src/lib/markup/legend.ts`) and drawn in the footer (`apps/web/src/lib/components/Paper/PageFooter.svelte:55-67`, the stems drawing by `stemLegendDrawing`), passed to page 1 only (`MarkupPane.svelte:976`, and `:1079` for the empty envelope). The subtitle reaches the header as `composer={subtitle}` (`MarkupPane.svelte:954`, `:1036`), drawn by `apps/web/src/lib/components/Paper/TitleHeader.svelte`. The footer's measured height feeds the page geometry (`MarkupPane.svelte:448-458`, `handleFooterHeight`).
- **Clef:** `clefFor` picks bass below middle C and treble from middle C up, by pitch alone (`apps/web/src/lib/voice/note-picker.ts:43-49`); `NotePicker.svelte:117` uses it. The voice type is `voiceType` on the stored voice (`apps/web/src/lib/voice/profileStore.ts`, the field documented beside `calibratedAt`), a string (`voice/engine/types.ts:35`). A lead, not read: `voice/engine/plausibility.ts:40` sorts types into buckets (`'soprano' | 'tenor-mezzo' | 'baritone' | 'bass' | 'union'`).
- **«не»:** a word the dictionary lacks gets unknown stress (`packages/phonology/src/engine.ts:2274-2275`), and unknown stress keeps every vowel cardinal (`engine.ts:1148`). The dictionary holds «непроглядная» and its forms, not «проглядная» (`data/dictionary.86d83340-a.json`).

## 3. Measure before you change anything

1. **Print:** print Markup, Text, and Insights for a fixture song to PDF in the cloud's Chromium (Playwright `page.pdf`, letter, `preferCSSPageSize`), and count pages against Ilya's own "Page N of M". Find what makes the extra page and state it with its `path:line`. The cause is yours to find.
2. **Legend:** measure the header line's width available beside the subtitle, in English and French, for the subtitle with a long voice name, and the legend's two items' widths.
3. **Clef:** list where `NotePicker` is used and whether each place can reach the stored voice.
4. **«не»:** find where words are looked up with their neighbours in a line (the call that reaches `transcribeWord` or `lookupStress` for a poem). Count, in the tree's poems and fixtures, the words after «не» that miss alone and hit when joined.

## 4. The rulings (Dann, 2026-10-09; `OPEN.md`)

- **Print** ("A BLANK LAST PAGE IN PRINT"): a print holds exactly the pages Ilya numbers.
- **Legend** ("N.176, AMENDED 2026-10-09 01:27"): the legend moves to the subtitle's line, right-aligned, at the subtitle's size and small caps; where they do not fit on one line, the legend's two items stack into two short lines at the right, still above the divider. **DESK DEFAULT:** the whole Markup legend moves (the stems key and, when present, the withheld-syllable sigla), so the keys stay together; the footer keeps the credits and the page number.
- **Clef** ("THE NOTE PICKER'S CLEF FOLLOWS THE SINGER'S VOICE TYPE"): bass, bass-baritone, and baritone take the bass clef; tenor and the treble voices take the treble clef; no type, or "Not sure", keeps the pitch rule. Ledger lines are expected (a bass's F♯4 sits on two).
- **«не»** (N.181): when a word after «не» is not found, look it up joined to «не», and keep the printed spelling on the page. Where both the joined and the separate word are found, the separate word stands as printed (the desk's condition).

## 5. Constraints

- No string changes and no French. Nothing in `apps/web/src/lib/omr/` or `tools/e16-harness/`.
- The page geometry stays WYSIWYG: what the screen shows is what prints.
- Commit and push to `cloud-lane` only (`CONTRACT.md` section 5, 2026-10-02). **What this displaces:** nothing.

## 6. Done when

- PDF page count equals Ilya's "of M" on Markup, Text, and Insights for every fixture song with a score.
- *Without Sun*, no. 1 (the tree's `sunless-01-engraved.musicxml`): page 1 of Markup holds the systems it held before the legend existed, in English and French; screenshots of the header in both languages, one with a long voice name, in `docs/sessions/walk-findings-shots/`.
- Tests: the clef for each bucket and for no type; a «не» word that misses alone and hits joined; one that hits both ways stays as printed.
- All eight gates, against the baselines in `brief-code-bars-to-confirm_r1_2026-10-09.md` section 7 plus the tests rows 51 and 58 add, named.

`WRITTEN` on the code. `DONE` is Dann's look.

## 7. Report back

`docs/sessions/report-code-walk-findings_r1_2026-10-09.md`: section 3's answers first; then each part with its `path:line`, the tests, the gates, the screenshots, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Push, and stop.
