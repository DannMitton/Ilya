# Report: strophic lane A, Step 4b (the label, the tag, and the multibar rest: D7)

Brief r5, Step 4b. Branch `cloud-lane-56`. Earlier: Steps 0 to 4a.

## What changed

- **The two strings (ratified 2026-11-12 12:58).** `i18n.ts` gains `markup.verseLabel` ("Verse %s" / « Couplet %s ») and `markup.verseTag` ("%m · verse %v" / « %m · couplet %v »), the words copied from `OPEN.md` and no others. `ratified-lines.test.ts` pins both, with the middle dot between spaces. **One thing to rule on:** `i18n-index.test.ts` fails for a new prefix with no line in the index at the head of `i18n.ts`, so I added `markup.  2  lib/markup/melody-pages.ts` and raised the stated total from 1,270 to 1,272. The line holds a file path and no prose. I wrote no other English or French.
- **The seam (`render-seam.ts`).** `systemSeam(bars, text)` now also: places the label as a `<text data-verse-label="k">` upright at the underlay's type size (`CYR_FONT_SIZE`) in the Cyrillic face, left-aligned to the leftmost ink of the bar's first note (its glyph or head, never the hit rectangle), on a band added above the system's highest ink, and grows the system's `viewBox` and `height` by that band (1.4 type sizes, JUDGEMENT) before `paginateScore` stacks it; and writes the tag inside the existing `<text data-bar-number>` of a system whose first bar is a later-pass bar that does not carry the label. The element's `data-bar-number` keeps the bare number. The bracketed courtesy number takes no tag. A tag that centred would cross x = 0 is re-anchored at its start with x = 0 (estimated at 0.62 em per character, an upper bound, JUDGEMENT). `RenderBar` gains `first`, the id of the bar's first event. `paginateScore` was already calling the seam after both renders and for the wrapper; its `viewBoxOf` now accepts a negative `minY`, which a label can produce.
- **The multibar-rest clause, named in Step 0 and made.** `staff-renderer.ts`: `tacetRuns(parsed, breakAt?, offset = 0)` gains `&& !breakAt?.has(m.index + offset)` on the clause that joins a tacet bar to the run before it; `StaffRenderOptions.breakRunsAt` carries the render score's `boundaries`; the two callers (`layoutColumns` and `paginateScore`) pass it. `staff-renderer.ts` is 3414 lines (ceiling lowered from 3427). `MarkupPane.svelte` passes `language` on the line that already held `verses` and stays at 1353. `loupe.ts` is untouched in this step.

## Tests added

`melody-pages.test.ts` (5 new): the label stands above the first bar of passes 2 and 3 only and reads "Verse 2", "Verse 3" and « Couplet 2 », « Couplet 3 », and its x equals the left of that note's own head; the system's `viewBox` and `height` hold it; tags appear exactly at later-pass system starts that do not open on the label, with the bare number kept on the handle, in French too; a long tag is anchored so its estimated ink stays at or right of x = 0; and a multibar rest stops at a pass boundary on `strophic-tacet-boundary.musicxml` (every run is one bar, against a run of two when the boundary is withheld). Playwright (desktop and phone): the labels read `['Verse 2', 'Verse 3']`, each label's x equals its pass's first head glyph's x, and **no `[data-bar-number]` has ink left of its system's edge, measured with `getBBox`** at 1440 and at 390 px. `ratified-lines.test.ts` (2). The byte baseline holds with the option absent.

**A defect I found and fixed before this report.** My first live picture showed both labels at the left edge, not over their bars. The unit test passed because the unit render draws noteheads as ellipses; the live page draws them as font glyphs (`<text ... font-family="Finale Maestro">`), which my lookup did not read, so it fell back to x = 0. The lookup now reads a glyph's `x`, and the Playwright check above is what would have caught it. The tacet-bar fallback is untested live beyond the one picture below.

## Which systems took a tag (the brief asks the report to say)

Desktop, English, 1440 px (the same at 390 px, the page being one scaled sheet): the system opening at bar 7 reads "7 · verse 2", and the system opening at bar 5 reads "5 · verse 3". The system opening at bar 9 holds pass 1's last bar and then the start of pass 2, so it is not a later-pass system start and carries the plain "9" (and the label "Verse 2" mid-system). **Every tag was re-anchored at x = 0**, in both languages: the bar number is centred on the clef at about x = 17.5, and even the shortest tag's estimated half-width (about 42 px) passes the edge, so each is written `text-anchor="start" x="0"`. In the pictures all four read flush with the staff's left end. The estimate is an upper bound and was not tuned against measured widths; the Playwright `getBBox` check says only that no ink falls left of the edge, not how close.

## Gates (after Step 4b)

| Gate | Count |
| --- | --- |
| phonology | 462 passed (462) |
| dictionary | 248 passed (248) |
| svelte-check | found 0 errors and 12 warnings in 5 files |
| web unit | 6050 passed, 1 skipped (6051) (the `open-extract` timing test passed on this run) |
| score-parser | 890 passed, 5 skipped (895) |
| blurb | 178 passed (178) |
| root integration | 159 passed (159) |
| ratchets | OK |

Playwright, not among the eight: `strophic-melody` desktop (3 passed) and phone (1 passed).

## Pictures (looked at)

In `strophic-a-shots_2026-11-15/`: `step4b-repeat-desktop-en-p1.png`, `-p2.png`, `step4b-repeat-phone-en-p1.png`, `-p2.png`, `step4b-repeat-desktop-fr-p1.png`, `-p2.png`, `step4b-repeat-phone-fr-p1.png`, `-p2.png`, and `step4b-tacet-desktop-en.png`. I looked at the desktop English page 1, the phone French page 1, and the tacet picture. Seen: "Verse 2" stands over «День те-пел за», the first bar of pass 2, in the middle of a system; "Verse 3" stands over «Мгла низка на», the last bar of its system; the tags "7 · verse 2" and "5 · verse 3" (« 7 · couplet 2 », « 5 · couplet 3 ») stand where the bar number does, inside the page edge, in italic; the French labels read « Couplet 2 » and « Couplet 3 ». In the tacet fixture the interlude of pass 1 and the introduction of pass 2 are two rests with a barline between them, not one rest counted across the seam, and "Verse 2" stands over the second. **I did not open the second pages and the phone English and desktop French page 1 pictures**; they carry the same strings from the same code, and the remaining bars of the song are on page 2 because the label bands made the systems taller (the song now spans two sheets where it spanned one).

## What I could not establish

- Whether the label's band (1.4 type sizes above the system's highest ink) is what Dann wants; it is mine, JUDGEMENT, and it pushes the song onto a second sheet.
- Which French tag the estimate re-anchors and which fits unchanged, by measurement.
- A label above a bar whose first event is a grace note or a tied-over note: the left is read from the principal's group, so a grace note stands left of the label. Not seen.
- A label over a tacet bar in a mixed system beyond the one picture.
