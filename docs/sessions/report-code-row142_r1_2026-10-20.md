# Report: row 142, Markup's notes start below the last system when they fit

Branch `cloud-lane-12`, after row 141 (`61844c9`). Brief: batch A r2, row 142.

## The diff, by file

- `packages/score-parser/src/page-layout.ts`: `PaginatedScore.lastPage` (new, `{ index, endY, gap } | null`): the last page's index, where its last system ends in the page SVG's own y (`endY`, `y - gap` after the loop, below the system's ink), and the gap that page used (the carried one, `gap` at the page loop). Set in the page loop for the last group; returned.
- `apps/web/src/lib/markup/notes-pages.ts`: `packNotes(m, height, firstHeight = height)`: the first sheet's window is `firstHeight`; when the first piece does not fit it, the first sheet is returned empty and the notes begin on the next, as before. New `planNotes(m, height, lastRoom, provisional)` returns `{ onLast, sheets }`: `onLast` is the share that goes on the last page of music (null when the first piece does not fit, or when the room is unknown), `sheets` are the sheets of their own. Before the column is measured, one provisional sheet of its own, as before.
- `apps/web/src/lib/markup/MarkupPane.svelte` (1370 to 1366, ceiling lowered): `paginated` holds the whole pagination and `scorePages` is its pages; `lastWindowTop`, `lastNotesTop`, `notesPlan`, `notesSheets` replace the old `notesSheets` derivation (a long comment moved into this report and `notes-pages.ts`); the last score page renders the `onLast` share with `NotesColumn` (sheet mode) at `top = window top + endY + gap`, above the footer; the measuring `NotesColumn` is out of the `{#each notesSheets}` loop, once, in a zero-height host of the page's width, so it renders even when no notes sheet remains.
- `apps/web/src/lib/markup/notes-pages.test.ts` (+6 tests), `packages/score-parser/src/page-layout.test.ts` (+1 test).
- `scripts/ratchets.json`: `MarkupPane.svelte` 1370 to 1366.

Where the first piece (the withheld statement, the octave notice, or the band's first line with its head) fits whole above the footer, the notes start under the last system. What does not fit runs on to sheets of its own exactly as `packNotes` did. The footer numbering is unchanged in kind: score pages carry `i + 1`; notes sheets carry `totalPages - notesSheets.length + j + 1`, where `notesSheets` now counts only the sheets of their own.

## Gates

phonology 267, dictionary 248, blurb 145, integration 55, web-test 2890 (2890) (2884 plus 6), web-check 0 errors and 12 warnings, score-parser 775 passed and 5 skipped (780) (774 plus 1), ratchets OK.

## Pictures

`docs/sessions/batch-a-shots/row142-{before,after}-withheld-{1440,390}-p{1,2}.png`: the Tchaikovsky op. 38 no. 3 fixture with no voice in the profile, so the withheld statement is the note. Before: 4 pages, the statement alone on page 4. After: 3 pages ("Page 3 of 3"), the statement under the last system of page 3 with the carried gap. `p1` and `p2` are the last two pages (before: pages 3 and 4; after: pages 2 and 3). The desk's own header floats over the top of some of these screenshots; it is the scroll position, not the page.

## Shared numbers

The page count: `totalPages` (`MarkupPane.svelte` about `:897`, scores plus own-sheet notes), the footers' `pageNumber` and `totalPages` (about `:1036` and `:1049`), and `profile.scorePageAria`'s total (about `:1006`, which still counts score pages only and always did: it reads "page n of <score pages>" on score pages, so after this row on the page that also carries the notes it still names the score pages' count; I left it). What depends on them agreeing is the footers' numbering across the two kinds of page: confirmed in the browser as "Page 1 of 3, Page 2 of 3, Page 3 of 3". I did not read Text's or Insights' page counts.

## Could not establish

- **A case where the notes still need their own sheet, in the app.** I found no fixture whose last page is full enough; the unit tests cover it (`packNotes` and `planNotes` with room for nothing, for the octave alone, and for everything).
- **Song 2's case** (a last page of two systems with the octave notice): the file is not in the tree. The octave-notice-alone case is a unit test, not a picture.
- **The French footers and the print.** I did not print or take a French picture; the notes' own styles are unchanged and `NotesColumn`'s `.commentary-window` is the one that already printed.
- **No collision with the last system's lyrics or markings** rests on `endY` being the system's SVG height (its cropped ink box) plus the carried gap; I looked at one picture, not measured the clearance.
- **A phone-width check of the 390 picture was by eye on two images only.**
