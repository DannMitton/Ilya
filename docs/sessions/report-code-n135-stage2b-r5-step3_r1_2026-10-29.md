# Report: N.135 stage 2b r5, step 3, the piano's upper staff found inside homr's own box (Code, cloud lane, 2026-10-29, r1)

Branch `cloud-lane-21`. One commit, on top of step 2 (`b2ca711b`). Continued after the desk's decision of 01:1x.

## The answer first

1. **Built.** B's top line is now found in the ink (`omr/underlay-below.ts`, `topLineBelow`), with the line finder `staffIn` uses; `lineRows` and `fives` are exported from `omr/metre-windows.ts`, not copied. `omr/underlay-prepare.ts` passes it to `systemsOf` (`omr/underlay-band.ts`, new optional `topBelow` argument), which hands it to `lyricBand` (new optional `bTop`). Without the argument both behave as before, so the older band tests stand unchanged.
2. **The rule, as briefed.** Search from A's bottom line plus 1.5 spaces down to the BOTTOM of the next box homr gave below A (the page's end where none), across the middle half of A's span, in strips two spaces wide. A group of five lines counts at a space within 0.8 to 1.25 of A's; each strip gives its topmost such group. Across strips, take the topmost top line that at least two strips share (within 0.1 space), then the median of the top lines from it down to two spaces below it. No group: the top of homr's next box; no box: `BELOW`. The band then ends 1.5 spaces above that line.
3. **Tests, with mutants** (`omr/underlay-below.test.ts`, 11 tests): a box holding both piano staves where the band must end 1.5 spaces above the upper staff; half the strips on the upper and half on the lower; a ledger line one space above the staff in a third of the strips; a box around the upper staff alone (agrees with `staffIn`'s line); a group at twice A's space (ignored); the fallbacks; a search into the box, not to its top. Mutant "median of every strip" fails the half-and-half test; mutant "minimum" fails the ledger test and both `topFromColumns` tests. Both run, then restored.
4. **A page of the piano alone:** `omr/underlay-song.test.ts`, "does not carry the words written on it into the joined MusicXML". It takes `tch-2` with its voice part removed, writes words on the piano's notes, shows them in that page's XML, and shows the joined file holds the other page's word and none of them (`withoutNotes`, `omr/join-pages.ts`).
5. **Gates:** 1 291 passed (291). 2 248 passed (248). 3 found 0 errors and 12 warnings in 5 files. **4 3618 passed | 1 skipped (3619).** 5 775 passed | 5 skipped (780). 6 145 passed (145). 7 55 passed (55). 8 ratchets: OK.

## Not measured (NOT ESTABLISHED)

- **Each system's band end against the harness's, for B01 and B04.** The brief asks for it. The captured pages (`n135-diag/app/B01/p1/page.raw`, `rowsys.py`'s `y1`) are in the desk's archive, not in this lane. The review's figure (22 of 23 within 10 px) was for its own prototype, not this build. The desk's browser run is the measure.
- Step 3 on the 16 other songs; whether homr's box covers the grand staff on camera pictures.
- How many of the 18 songs' systems the ink search and homr's boxes disagree on (brief section 4, last bullet): needs the pages.

## Departures

- Where strips find a group but no two share a top line, the topmost single strip stands. The brief says only "topmost that at least two share"; it gives no case for none sharing.
- If the search range is shorter than five staff spaces, the box top stands without a search.
- The metre worker still reads homr's boxes only (`omr/metre.worker.ts:42`); nothing depends on the two agreeing.

## Files

`omr/underlay-below.ts` (new), `omr/underlay-below.test.ts` (new), `omr/underlay-band.ts`, `omr/underlay-prepare.ts`, `omr/metre-windows.ts` (two `export`s), `omr/underlay-song.test.ts`, this report.
