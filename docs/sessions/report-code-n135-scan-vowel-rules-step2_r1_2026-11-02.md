# Report: N.135 scan vowel rules, step 2, rule 2 (cloud lane, branch cloud-lane-28, 2026-11-02)

Read on `cloud-lane-28`, parent `HEAD` of step 1, from `f9797ac`. The tree was clean before this step.

## What changed

`apps/web/src/lib/omr/underlay-seat.ts`:

- **`FAR_FACTOR = 2`**, one named, commented constant (JUDGEMENT: the brief's value, not a sourced number). **`medianGap(xs)`** is the median of the gaps between consecutive free notes; it is 0 with fewer than two notes.
- **In the `monotone` branch of `seatTokens`:** a syllable token whose centre is more than `FAR_FACTOR * medianGap(free notes)` from its nearest free note is left out of the alignment, so it comes back `unseated: true`, `by: 'monotone'`, `note: null`. It is removed **before** `monotone` runs, not after. Reason: if it stayed in, it would still claim a note in the alignment (this is what «Дудка» did to the voice's first two notes), and removing it afterwards would leave the later syllables where they slid. Removed first, it takes no note and moves none.
- **The rule does not apply** with fewer than two free notes, or when the median gap is 0 (notes on one x; a threshold of 0 would call every token far). The second guard is mine, not the brief's; I added it because a zero reach would unseat every token not exactly on a note.
- **Rule scope: `monotone` only.** `nearest` and `order` are unchanged. The scan path calls `seatTokens(units, system.notes, 'monotone')` (`underlay-page.ts`), so it is the path that matters; the other two rules are used only by tests and the harness (I did not trace other callers; see below).
- **Comments rewritten:** the header paragraph on `monotone` (was `:18-23`, "a token never without a note") and the `Seat.unseated` doc (was `:86`).
- **`freeNoteXs`** (`underlay-counts.ts`) is unchanged in behaviour: it applies the same filter as `seatTokens`' `free` (not tied into, not under an extender), sorted. Its comment now says so. I did not add a test that holds the two equal; step 3 should (listed below).

No existing test changed: the 567 tests in `src/lib/omr` and `underlay-seams.test.ts` passed unchanged.

## Gates, on the tree of this commit

| Gate | Result |
| --- | --- |
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 type check | 0 errors, 12 warnings |
| 4 web | 3844 passed, 1 skipped (3845), 219 files |
| 5 score-parser | 785 passed, 5 skipped (790) |
| 6 blurb | 148 passed |
| 7 root integration | 98 passed |
| 8 ratchets | OK |
| build | exit 0 |

## What I could not establish

- The effect on «Дудка» on song 1 (355 to 363 in the brief). It needs the scan and a browser read.
- Whether `nearest` or `order` has a production caller besides tests. I did not grep for it; the brief names only the `monotone` call.
- Whether 2x the median gap is right for a sparse system (few notes, one wide gap among them). The median is robust to one wide gap, but a system of exactly two free notes has one gap and the median is that gap. JUDGEMENT; the desk's measure will show it.
