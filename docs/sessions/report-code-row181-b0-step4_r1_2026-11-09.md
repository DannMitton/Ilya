# Report: row 181 B0 and B0g, step 4 (the stamp) (Code, cloud lane 40, r1, 2026-11-09)

`stamp.ts` on the lane's tip held `UNDERLAY_READER = 'underlay@4'`, joined to `READER_STAMP` (`homr-web@V/model+underlay@N`) by integration step 8a. Bumped once, to `'underlay@5'`, with its line in the header comment (B0 and B0g; a scan kept as `underlay@4` is read again once, on its next opening). Nothing else carries the number as a literal except `underlay-switch.test.ts`, which pinned `'underlay@4'` and lists the stamps a stored scan is read again under; it now pins `'underlay@5'` and adds `'underlay@4'` to the old ones.

`stamp.test.ts` keeps the relation the tip has (the stamp names the installed `homr-web` and the model; the underlay reader is joined into `READER_STAMP`) and gains one test: the reader is the fifth, and `READER_STAMP` differs from the same stamp under `underlay@4`, so a scan kept before this build is stale. Without the bump a stored reading would be reused and its syllables never seated again.

`stamp.test.ts` and `underlay-switch.test.ts`: 15 tests pass. No version was pre-named by the brief; this is one step from what the tip held.
