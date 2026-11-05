# Review: Corrections slice 3 brief r1 and plan r2 (Fable, 2026-11-05; filed by the desk)

199,121 Fable tokens against 150,000 stated (over by 49k). Condensed by the desk; every amendment is carried whole into `brief-code-corrections-slice3-answers-kept_r2_2026-11-05.md` ("Amendments") and every plan finding into `plan-corrections-build_r2_2026-11-05.md` (last section).

Read by Fable in full: both documents; plan r1; Design round 3; `OPEN.md` Corrections items 1 to 18, JOINING items 1 to 16, N.157; `CONTRACT.md` §0 to 1 and §8; the row 181 step 6 report; on `origin/Shane` `library.ts`, `document.svelte.ts`, `bars-to-confirm.ts`, `offers-for-a-bar.ts`, `correction.ts`, `entry.ts` (parts), `+page.svelte` (parts); on `origin/cloud-lane-34` `ScanBanner.svelte` and its wiring.

## The brief: SEND WITH AMENDMENTS

1. A malformed answer must not lock the song: `malformed()` sets `readOnly` (`document.svelte.ts:202`) and stops saves (`:313`); validate rows as `publishedGlosses` does (`library.ts:273-279`), dropping a bad answer and keeping the rest.
2. Carry the field through `SongFields`, `fieldsFromRecord`, the strip and write, and `SongDocument` (`document.svelte.ts:288-307`, `:340-363`), or the first autosave deletes the answers.
3. `put-away` has no producer or consumer under plan r2 (`ScanBanner.svelte:29` renders bar links only); keep it, marked NOT WIRED.
4. Fingerprint the corrected line (`+page.svelte:800`, `applyCorrections`, `correction.ts:357`): type, base, dots, tuplet ratio, and the metre; no ids, onsets, or pitch (pitch out is a DESK DEFAULT).
5. Wrong pointer: replacement is `applyArrival` (`+page.svelte:2849-2856`), not `refreshPairings` (`:492`); corrections survive by id, `orphanIds` counts the rest (`correction.ts:738`).
6. Stale answers kept, not pruned.
7. Shape keyed by `String(measureIndex)` (`correction.ts:109`).

Checked correct: every `library.ts` line the brief cites; `barsToConfirm` at `:55`; `offersForABar` at `:119`; no bar field in `SongRecord` (`types.ts:90-223`). Row 181 touched none of slice 3's files.

## The plan

One list is right (Corrections item 4, less mental energy), with unstated costs: different lifetimes (words bars in memory, rhythm answers stored), different keys (0-based `measureIndex` against printed bar numbers). A bar both unread and short: two findings, each with its act. Folding the Paper line into the banner: the banner lives in the drawer, which lowers on a phone; it exists only on scans, so imported scores lose the review's entry; "Not now" loses its home. Paper or drawer is taste (Dann's). Name as desk defaults: the lavender mark on words bars, the Loupe opening itself for rhythm bars on any score. Order sound; the lane for 6R (hotspot files) is missing. Owed: the banner sentence for both kinds, EN and FR.
