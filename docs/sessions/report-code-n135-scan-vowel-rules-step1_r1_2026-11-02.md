# Report: N.135 scan vowel rules, step 1, rule 1 (cloud lane, branch cloud-lane-28, 2026-11-02)

Read on `cloud-lane-28`, parent `b747898` (step 0), from `f9797ac`. The tree was clean before this step.

## What changed

A unit of the row with no vowel letter takes no note on the scan path (`CONTRACT.md` §0.1). The desk departure at `underlay-clitics.ts:28-34` is removed.

- **New file `apps/web/src/lib/omr/assert-vowel-per-note.ts`.** `assertVowelPerNote(units, whole)` returns `{ kept, refused }`. A unit with a letter and no `VOWEL` letter is refused as `vowelless`. A unit that is its whole token and whose only letter is one і, ѣ, or ѵ is refused as `stray`. A unit with no letter (a joint, an extender, a mark) is kept, because `sewWords` reads those. `wholeTokenOf(cutOrigin, origin)` builds `whole`: a unit is its whole token where it is the only unit `cutUnits` made of that token, so a piece `cutUnits` cut keeps its «ѣ» («по-ѣ-ду»). Step 4 makes this the one shared file; this step puts the scan on it.
- **`underlay-page.ts` `seatPage`.** After the `if (seams.clitics)` block, on `units`, the drop runs where no calls are passed too. `foldClitics` keeps folding. `foldClitics` now also returns `origin` for the units it keeps, so the whole-token test can read it after a fold. The new stat `stats.dropped = { vowelless, stray }` counts what was dropped. The rescue row and `underlay-fallback.ts` go through the same loop (`for (const [r, row] of system.rows.entries())`), so they are covered by the same line. A dropped unit is never written to `<lyric>`; the print's letters are not altered.
- **`counts.left`** now reads as the clitics dropped for want of a host (`underlay-clitics.ts` field comment, `underlay-page.ts` stats comment). Its value does not change: the unit that `foldClitics` leaves unfolded is the one that is now dropped, and `dropped.vowelless` includes it.
- **`underlay-clitics.ts` header** rewritten to say this and cite §0.1 (replaces the "DELIBERATE DEPARTURE" paragraph).

## Pins changed, with was and now

| Pin | Was | Now |
| --- | --- | --- |
| `underlay-clitics.test.ts:48` | vowelless «т», no clitic call: stays a unit, `['мой','т','друг']` | dropped, `['мой','друг']`, refused as `vowelless` |
| `:54` | proclitic «в» with no host: stays, `['тебя','в']`, `left: 1` | dropped, `['тебя']`, `left: 1` still |
| `:60` | enclitic «ж» with no host: stays, `['ж','мой']` | dropped, `['мой']`, `left: 1` still |
| `:71` | a lone «ѣ» token counts as a vowel (2 units) | dropped as `stray`; the ѣ/і/ѵ-as-vowel assertion moved onto «гѣ», which stays |
| `underlay-page.test.ts:191` | a lone «в» with no call takes note 0, notes `[0,1,2]` | dropped, notes `[1,2]`, `dropped: { vowelless: 1, stray: 0 }` (this pin is not in the brief's list; it is the same departure seen through `seatPage`) |
| `underlay-integration.test.ts:47`, `underlay-song.test.ts:24` | stats literals without `dropped` | `dropped: { vowelless: 0, stray: 0 }` added (type check) |

The `fold` helper in `underlay-clitics.test.ts` now runs `foldClitics` then `assertVowelPerNote`, as `seatPage` does. The new unit tests of step 3 are not in this commit.

## Gates, on the tree of this commit

| Gate | Result |
| --- | --- |
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 type check | 0 errors, 12 warnings (after fixing two stats literals the first run caught: 2 errors) |
| 4 web | 3844 passed, 1 skipped (3845), 219 files. The baseline was 3843: +1 is the split of the `:71` test into two |
| 5 score-parser | 785 passed, 5 skipped (790) |
| 6 blurb | 148 passed |
| 7 root integration | 98 passed |
| 8 ratchets | OK |
| build | exit 0 |

Honest note: gate 4 ran once, before the two stats literals were fixed. After that fix I re-ran gate 3 and the whole `src/lib/omr` directory (34 files, 546 passed), not gate 4 in full. The fix only added a field to two expected literals.

## What I could not establish

- The effect on row 114 (328 to 355 in the brief). The desk measures that; it needs the scan PDFs and a browser read, which are not in the cloud.
- Whether the review text differs from r3 anywhere. The review is not on `origin/Shane`.
