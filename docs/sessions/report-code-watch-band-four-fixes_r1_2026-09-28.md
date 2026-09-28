# Report from Code: the watch band's four fixes

**Code report r1, 2026-09-28.** Answers `brief-code-watch-band-says-less_r1_2026-09-28.md`, section "Four fixes found on Dann's look" only, as Dann instructed in chat. The gates (the brief's update of 16:28) are not built. Branch `Shane`, base `8127e01`, working tree dirty with this work and the desk's own edits to `STATE.md`, the brief, and the curation draft.

## What changed

1. **The heading reads as the box's title.** `.watch-band-header` was 0.8rem sans small caps, weight 400, in the outline lavender `#9585A2`. It is now Insights' `.section-head` recipe (`InsightsPane.svelte:904`, itself `TitleHeader.svelte`'s `.metadata-line`): 14 px, weight 600, 1.5 px tracking, all small caps, in `--lavender-ink` (`#554660`). The withheld statement's heading moves with it, since the two boxes are twins. DESK DEFAULT: the sister document's box title, in Markup's label ink.
2. **Nothing is cut.** The notes no longer sit on one fixed sheet. `NotesColumn.svelte` lays the column out unseen at the text width and reports where each piece sits; `notes-pages.ts` packs the pieces into as many sheets as they need. The band splits between lines, never inside one, and a continued box repeats its heading (DESK DEFAULT). The page count and footers follow. The measure uses `offsetTop`, so `PageFit`'s scaling does not skew it, and it re-runs on a language switch or a font load.
3. **Quoted words are bare.** `watchEntryLine` strips leading and trailing punctuation from the word, with the same expression as Insights' `wordOf`. « разлуки, » now reads « разлуки ».
4. **No duplicate line.** `watchBandLines` drops an entry whose line, rendered at opener 1, matches one already kept. The line leads with its bar, so same text means same sentence at the same bar. The comparison runs before the opener rotation, so two identical findings cannot slip through by differing only in their opener.

The notes column and its styles left `MarkupPane.svelte`, which fell from 1490 to 1359 lines; the ceiling in `scripts/ratchets.json` is lowered to match. No new strings.

## Checked

- Unit tests: 1646 pass, 90 files, including new tests for the packing (`notes-pages.test.ts`), the bare word, and the duplicate line.
- `svelte-check`: 0 errors. `node scripts/ratchets.mjs`: OK.
- «Скучай» (`Mussorgsky - Sunless 04 - Be bored.musx`) in the browser pane at a clean origin, `watchband.localhost:5173`, with the pane's test voice. This is not Dann's voice, so his count differs: here the band carries 59 lines. English: three notes sheets, pages 3 to 5 of 5; each box ends inside its window (784, 797, 219 of 801 px). French: four sheets, each box ending at or under 770 of 783 px. No line repeats in either language.

## For Dann

- French: `watch.line.passaggioWord` and its neighbours print « passaggio; attendez-vous » with no space before the semicolon. French typography sets a narrow no-break space there. The string is his.
