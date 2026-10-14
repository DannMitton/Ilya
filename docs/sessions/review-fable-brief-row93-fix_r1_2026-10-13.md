# Review: brief-code-row93-seats-under-old-names_r1 (row 93 fix), Fable, 2026-10-13

Read whole: the brief, `report-code-markup-blank-tchaikovsky_r1_2026-10-12.md`, and against the tree at `1ec2ef2`: `musicxml-parser.ts`, `staff-renderer.ts` (the cited lines), `MarkupPane.svelte` (the cited lines), `pairings.ts`, `first-seat.ts`, `clitic-seat.ts` (header), `correction.ts`, `recognized-to-musicxml.ts`, `+page.svelte` (`handleArrival`, `applyArrival`, `transcribeText`, `healFrozenSeats`, `restoreFrom`), `ScoreUploader.svelte` (restore `onMount`), `omr/restore.ts`, `omr/stamp.ts`, `omr/join-pages.ts`, `library/library.ts:85`, `tools/e16-harness/reader/run_page2.py` (id and bar construction), `reader-ids.test.ts`, and the 2026-10-05 restore harness folder `docs/sessions/restore-reads-with-homr_r1_2026-10-05/`. Read-only; nothing in the tree was changed but this file.

## Verdict

SEND WITH AMENDMENTS (8). The diagnosis holds: the stamp in Dann's record equals `READER_STAMP` (`omr/stamp.ts:17,23`: `homr-web@0.2.0-ilya.7/465`), so `restoreScan` returns the kept MusicXML without re-reading (`omr/restore.ts`, `isCurrent`), the parser names every note by cursor (`musicxml-parser.ts:729-731`), the renderer looks text up by `ev.id` (`staff-renderer.ts:3157-3158`), and nothing on any path re-keys a pairing map. Two cited call sites are wrong (amendments 1 and 2), item 4 would undo the fix (amendment 3), the re-key method needs a stronger pairing rule than "counts agree" (amendment 4), the bar base is answerable from code (amendment 5), and the reproduction can be real rather than tampered (amendment 6).

## Citations table

| Brief | Claim | Checked against | Holds |
|---|---|---|---|
| `musicxml-parser.ts:729-731` | cursor id `m{measureIndex}-{num}-{den}` when no `id` | `:729-731` exactly; `honourSuppliedIds` set at `:535` | Yes |
| `staff-renderer.ts:3157-3158` | lookup by event id | `:3157-3158` (`cyrPreview?.[ev.id]`, `ipaPreview?.[ev.id]`) | Yes |
| `MarkupPane.svelte:224-228` | pairings keyed by event id | `:224-228` (the `pairings` prop doc) | Yes |
| `pairings.ts:300` | `syllableTargetIds` | `:300` | Yes |
| `pairings.ts:389-403` | `mergeOnUpload` returns stored map untouched, reports orphans | `:389-403` | Yes |
| `+page.svelte:2381-2387`, `:2390` | `mergeOnUpload` called on reopen; `orphanedCount = 0` | `:2380` guards with `shouldSeatFirstTranscription(doc.pairings, true)`, which is false once any entry is `kind: 'syllable'` (`first-seat.ts`) | **No.** Not on this song's path |
| `correction.ts:636-660` | "the same syntactic test" | `migrateCorrectionIds` at `:665` tests `parts.length !== 4`, a segment count, not a regex | Partly; see amendment 7 |
| `recognized-to-musicxml.ts:138-155` | old reader ids carried into `<note id>` | `:137-155` (`idAttribute`) | Yes |
| `recognized-to-musicxml.ts:141-146` | fragility N.97 removed one layer in | comment at `:140-147` | Yes |

## Amendments

**1. The governing call site is `applyArrival`, not `:2381`.** Replace the bullet "On reopen, `mergeOnUpload` returns the stored map untouched ... called at `apps/web/src/routes/+page.svelte:2381-2387`; `orphanedCount` is set to 0 at `:2390`" with:

> On reopen the uploader remounts under `{#key doc.id}` with `restoreSource` (`+page.svelte:3701-3714`), its `onMount` routes a stored PDF to `restoreStoredScan` (`ScoreUploader.svelte:787-811`), which returns the kept reading because its stamp is current (`omr/restore.ts`, `isCurrent`; `omr/stamp.ts:17,23`), and calls `oningested(..., 'restore')`. `handleArrival` (`+page.svelte:3006`) flushes the transcription and, for origin `'restore'`, calls `applyArrival` at once (`:3031-3034`). `applyArrival` (`:3152`) calls `mergeOnUpload` at `:3263-3269`, keeps the map untouched (`:3270`), skips the clitic fold because the map holds syllables (`shouldFoldOnArrival`, `:3262`, `:3281`), and sets `orphanedCount = merged.orphaned.length` at `:3283`, which is 170 here and is shown by the station at `:4719-4725` (`station.orphaned`). The block at `:2380-2390` is gated by `shouldSeatFirstTranscription` (`first-seat.ts`), which refuses a map with any `kind: 'syllable'` entry, so it never runs for this song.

Evidence: `+page.svelte:3031-3034`, `:3152-3155`, `:3262-3283`, `:2380`; `first-seat.ts` (`shouldSeatFirstTranscription`); `ScoreUploader.svelte:787-811`.

**2. Name where the re-key lives.** In "What to build" item 1, after "On the restore path", add:

> in `applyArrival` (`+page.svelte:3152`), before the `mergeOnUpload` call at `:3263`, for origin `'restore'` and `'upload'` alike (a singer re-dropping the same PDF arrives through `handleArrival`'s decision at `:3036-3049`, which counts orphans before anything re-keys; leave that count alone and say in the report what a re-drop of the same scan onto this song does). The re-key is a pure function in a new module under `apps/web/src/lib/score/` taking the stored map and the parsed `vocalLine`, so it is unit-testable without the page.

**3. Strike item 4.** `seatCliticFolds` after the re-key is what N.161 removed from the restore path: "whenever `isCliticSeated` read a stored seat as unseated it rewrote the run from «в» to the end, up to 60 decided notes, on a plain reload" (`+page.svelte:3273-3281`), and `applyArrival` now folds only where the map held no syllable (`shouldFoldOnArrival`, `first-seat.ts`). Replace item 4 with:

> 4. **Run nothing on the re-keyed map that the restore path does not already run on a stored map.** It goes through `mergeOnUpload` at `:3263` as the stored map does today (every re-keyed id is present, so `orphaned` is the count left under old keys), `orphanedCount` takes that count at `:3283`, and the clitic fold stays gated by `shouldFoldOnArrival`. `refreshPairings` (`:472`), `reseatByDiff` and `healFrozenSeats` (`:2476`) read the map by whatever keys it carries and need no change; say in the report that the dry run of the heal (`:2190` on) and the `N.160 seats` line were read on the reproduction after the fix.

**4. Pair by position inside the bar, not only where counts agree.** The brief's rule leaves a bar orphaned whenever one note in it carries no seat, which on a melismatic song is the usual bar. On the 2026-10-05 fixture of this same PDF (`docs/sessions/restore-reads-with-homr_r1_2026-10-05/after-drop-reload.kept.musicxml`, 222 `<note>`, 174 pitched, 48 rests, 8 `<tie>`/`<tied>`, 99 measures), 170 seats against about 170 syllable targets will agree in most bars, but another singer's song will not. Replace item 2's pairing sentence with:

> Within each bar, order the old seats by `x` and the current reading's syllable targets by onset. Where the counts agree, pair in order. Where they disagree, and homr's reading carries a page position for every note (`<!-- imgpos: x, y -->`, parsed by `omr/join-pages.ts:435-437`), pair each old seat with the target whose `imgpos` x is nearest in bar-relative terms (both x values normalised to the bar's own span: old seats against the old bar's min and max x, targets against the bar's `imgpos` min and max), accepting a pairing only when it is one-to-one; otherwise leave the bar's seats under their old keys and count them. The report gives, per bar, which rule placed it or that it was left.

The old reader sorts a bar's events by `x` itself (`run_page2.py:462-464`), so x order is the reader's own time order; a tie's continuation is excluded from the targets by `syllableTargetIds` (`pairings.ts:300-309`) and could not have taken a seat under either reader. Every old entry is re-keyed, `melisma` and `empty` as well as `syllable` (`pairings.ts:120-132`); Dann's map has only `syllable` entries, so this costs nothing on his song and keeps the method general. Rests take no seat and are ignored on both sides. Record which `imgpos` scale the fixture carries (homr's 300 dpi raster) and that it never has to match the old reader's scale, because only bar-relative positions are compared.

**5. The bar base is answerable from code; what is not is barline agreement.** Replace "First establish, on this song, whether the old reader's `measureIndex` and the parser's count from the same origin; adjust by a constant offset if they differ" with:

> Both count bars from 0: the parser's `measureIndex` is the index into the joined document's measure list (`musicxml-parser.ts:418`, `mi` from 0, ignoring `<measure number>`), and the old reader's is `base[pos] + seg` with `base = cumsum([0] + measures_per_system)` (`run_page2.py:444,464`) plus the envelope's `measureIndexOffset`, 0 on the first page (`envelope.py:55`). What no constant can fix is the two readers segmenting bars differently (a missed or invented barline shifts every later bar on that page). So after the re-key the report gives the old map's highest bar index plus one against the reading's measure count, and the per-bar table of amendment 4; a run of consecutive bars all left under old keys from some bar onward is that shift, and is reported, not repaired here.

Suggestive, not established: Dann's first seat is `r7-2883` and the fixture's first vocal measure is `<measure number="8">`, index 7.

**6. The reproduction can be the real history, and the old reader still runs.** Replace "Reproducing it without Dann's library" with:

> The same PDF is at `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` (319128 bytes, the byte length in Dann's `sources` row; `restore-reads-with-homr_r1_2026-10-05/lib.cjs:5`, `measure-markup-blank_2026-10-12/case.mjs:19`), and the old reader still answers `?reader=ilya` (`ScoreUploader.svelte:286,790`; `omr/scan.ts:25-27`; `seed-old.cjs` drove it on 2026-10-05 in 29 s). So: run case A of row 93's harness with the page opened at `BASE + '?reader=ilya'` so the PDF is read by the old reader and the poem seats under `r{bar}-{x}` ids (the reader's ids reach `<note id>` through `recognized-to-musicxml.ts:137-155` and the parser honours them, `:729-731`); then reopen WITHOUT the flag. The restore finds no current reading, reads with homr (`restore.ts`, `from: 'homr'`), keeps it (`hooks.keep`), and the map is orphaned whole: Markup blank, the bug, with the reader's own x values and no tampering. If the old reader fails to run in this build, fall back to the brief's tamper recipe and say so; take x from the old reader's ids if it ran at all, else from the reading's `imgpos` x, else a strictly increasing integer per bar, and record which.

**7. Correct the correction.ts reference.** Replace "the same syntactic test `apps/web/src/lib/score/correction.ts:636-660` uses for its own re-key" with "the id shape `correction.ts:636-662` documents and `reader-ids.test.ts` guards: `r{measureIndex}-{x}` or `r{measureIndex}-{x}-{ordinal}`; `migrateCorrectionIds` (`:665`) tests a four-segment count, not this regex, and runs at library load (`library/library.ts:85`), before any reading exists, so an r-keyed `corrections` map is re-keyed by this brief's new function in `applyArrival`, not there."

**8. "Done when": make the console count observable.** The `N.160 seats` line (`+page.svelte:2171-2182`) counts map entries through `drawnSeatCount` (`pairings.ts:1055-1063`) whether or not they draw, so it already says "170 seated" on the blank page and will say the same after the fix. Replace the first done-when bullet's clause "with the `N.160 seats` line reporting the re-keyed count and 0 left under old keys" with: "with a new console line on the restore path, `[Ilya] N.1xx re-key: n seats moved, m left under old names, k bars left`, printed only when n + m > 0, reporting 170, 0, 0 on the reproduction; and `orphanedCount` (`:3283`) at 0 so the station's orphan line (`:4719-4725`) does not show." Add a fourth unit-test case: a map with `melisma` and `empty` entries re-keys them with their bar.

House style: the brief passes (Canadian spelling, no em dashes, none of the banned words, no exclamation marks). One nit: "**0 of the 170 seat keys name an event**" is fine; "harm nothing" is fine.

## What does not overturn the diagnosis

- No path re-keys a pairing map on load: `library.ts:85` re-keys `corrections` only; `mergeOnUpload` returns `existing` unchanged (`pairings.ts:401`); `refreshPairings`, `reseatByDiff`, `healFrozenSeats` rewrite values or move between present ids and never invent an id from an `r` key.
- A re-read would not help: the stamp is current, so `restoreScan` never calls homr (`restore.ts`, `isCurrent`), and a homr read carries no `<note id>` anyway (fixture: 222 notes, 0 `id`, 222 `imgpos` comments).
- Collision risk of the re-key with N.160: none found. `reseatByDiff` keys on `eventIds` of the parsed score; the re-keyed map uses exactly those ids.

## Could not establish

- Dann's record itself: not readable from here. The 170 keys, the stamp, and the 222-note count are the desk's reading; the 2026-10-05 fixture matches on byte length, note count, and first vocal bar, and I take it as the same reading, which is an inference.
- Whether the old reader's bars on this PDF coincide with homr's bar by bar. Only the reproduction of amendment 6 answers it.
- Whether `?reader=ilya` still runs in the current build: it ran on 2026-10-05 (`report-code-restore-reads-with-homr_r1_2026-10-05.md:59`) and its code paths are intact at `ScoreUploader.svelte:286,790`; not driven today.
- Whether the N.160 seats effect fires on the blank page: `drawPairings` (`:2160`) is derived from `shownPairings`, which is keyed by the map, and `drawnSeatCount` counts entries, so I expect "170 seated"; Code's report of 2026-10-12 did not reach the stored-song case, so this is not measured.
- The `imgpos` scale of the kept reading in Dann's record: the fixture's comments are integers on homr's raster; not checked against the record.
