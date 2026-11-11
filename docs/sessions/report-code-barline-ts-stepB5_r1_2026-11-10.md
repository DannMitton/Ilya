# Report: step B5, the head caret (Code, cloud lane 43, r1, 2026-11-10)

Commit: "B5: a note entered at the head caret of a hand-made bar". New: `score/entry-marks.ts`, `score/entry-marks.test.ts` (4), `e2e/barline-head-caret.test.ts` (1). Changed: `score/correction-verbs.svelte.ts` (the two gap-entry sites now call one `#enter`), `routes/+page.svelte` (one line: 5526 of 5534). Also corrected here: the B4 report said "7 files, 100+ tests" for its focused run, which I had not counted; the B4 step's own tests are `barline-record.test.ts` (3) and `e2e/barline-verb.test.ts` (4).

## The finding and the fix (review of 2026-11-10, finding 11 and amendment 11)

A note entered at the head caret of bar k is anchored to the last entry of bar k − 1 and names bar k (`entry.ts` `enterEntry`; `correction.ts:76-85`). Two changes make that right once a bar can be made by a mark:

1. **`entered.measureIndex` is written in READING bars** (`BarMap.toReading`), the coordinate `applyCorrections` and `reflowOnsets` read it in. With no mark on the song the two coordinates are equal, so every stored record reads as it always did (tested: a bar the reading made writes the same record).
2. **`adoptBarMarks`** (`entry-marks.ts`): where the gap is the head of a bar whose first entry carries `barline: 'before'` (a bar she made) or her `timeSignature`, the new entry takes those marks and the old first entry drops them. The new note is then the first of the bar and the old first entry its second. Without it the note was anchored to the bar before the barline and seated in it while the Loupe showed the next.

## Tests

`entry-marks.test.ts`: the new note takes the barline, the old entry drops it, and after the rebar the new note is the first of song bar 4, the old first entry the second, and bar 3 is exactly as it was and adds up; her time signature moves with it; nothing moves where the gap is not a head, no measure is named, or the first entry carries no mark; a bar the reading made keeps its record. Playwright (`barline-head-caret`, pass): add the barline on the fused reading, step to the first note of bar 5, back onto its head caret, enter a quarter: the Loupe stays on bar 5, the readout names a quarter, and bar 4 does not gain a note.

## Gates

| gate | result |
|---|---|
| 1 | 456 passed |
| 2 | 248 passed |
| 3 | 0 errors, 12 warnings |
| 4 | 4796 passed, 1 skipped (266 files) |
| 5 | 785 passed, 5 skipped |
| 6 | 168 passed |
| 7 | 125 passed |
| 8 | OK |

Playwright, both whole suites (this run also covers B4, whose commit changed no source): chromium 148 passed, 7 failed, 1 skipped; phone 25 passed, 4 failed, 1 skipped. The eleven failures are the baseline's own (`534d9981`, run by me, listed in the B3 and T2 reports); nothing new fails. The container was restarted mid-session and this run is the second attempt at it.

## What I could not establish

- A head caret in a bar **joined** by a `'none'` mark: the head of the merged bar is the head of its first reading bar, so `toReading` gives the right bar; not walked in a browser.
- A head caret in a bar that carries a mark AND a hand-entered first entry (two marks on a chain): the marks move onto the new entry once; the chain's earlier entries are untouched. Not tested.
