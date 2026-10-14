# Brief for Code: a stored scan's seats filed under the old reader's note names find their notes again (row 93, r1, 2026-10-13)

Written by the desk (Opus 5.5), 2026-10-13 about 23:50. For Code on the Mac, Opus. Fable reviews this brief before Code gets it (`docs/memory/CONTRACT.md` §1 item 19). Supersedes nothing; row 93's measuring brief (`brief-code-markup-blank-tchaikovsky_r2_2026-10-12.md`) is closed by its report and this finding.

## What the singer sees

Dann opens «Средь шумного бала» (Tchaikovsky op. 38 no. 3, a scan with a typed poem) from his library. Text draws the poem and its IPA. Markup draws the notes on three pages and no syllable, no IPA, and no vowel mark under any of them. He seated 170 syllables on that song on 2026-10-01.

## The cause, read by the desk 2026-10-13 in Dann's Chrome on the alias, read-only

The desk opened `manifest.webmanifest` on `ilya-git-shane-dannmittons-projects.vercel.app` (a static file, so no Ilya code ran) and read `ilya-library` with read-only transactions.

- Song `5bac11c4-0b61-4dde-b7bb-b4eec724e100`, created 2026-10-01T19:01Z, updated 2026-10-13T03:50Z. `pairings` holds 170 entries, all `kind: "syllable"`, every key in the old reader's form `r{measureIndex}-{x}`: first `r7-2883` («Средь», `ˈsrʲetʲ`, origin line 0 word 0 slot 0), last `r90-1244`. `corrections` is empty.
- Its `sources` row holds the PDF bytes (319128) and `reading: { musicXml (64765 chars), stamp: "homr-web@0.2.0-ilya.7/465" }`. That MusicXML has 222 `<note>` elements, **0 with an `id` attribute**, and no `<lyric>`.
- With no supplied id, the parser names each event by its cursor, `m{measureIndex}-{num}-{den}` (`packages/score-parser/src/musicxml-parser.ts:729-731`).
- So **0 of the 170 seat keys name an event in the reading Markup draws.** The renderer looks a note's text up by event id (`packages/score-parser/src/staff-renderer.ts:3157-3158`; pairings keyed by event id at `apps/web/src/lib/markup/MarkupPane.svelte:224-228`), finds nothing, and draws a blank.
- On reopen, `mergeOnUpload` returns the stored map untouched and reports every key as orphaned (`apps/web/src/lib/score/pairings.ts:389-403`), called at `apps/web/src/routes/+page.svelte:2381-2387`; `orphanedCount` is set to 0 at `:2390`.
- Why row 93's measuring run could not reproduce it: a song seated today files its seats under today's names. The seats were written by the reader that wrote `r` ids (`apps/web/src/lib/score/ingestion/recognized-to-musicxml.ts:138-155` carries them into `<note id>`); the reading in force since homr became the first reader carries none.
- In Dann's library this is the only song affected: the other eleven hold no `r` key in `pairings` or `corrections`.

## What to build

When a stored song reopens and its seats are filed under names the current reading does not produce, Ilya files each seat under the note it was placed on, so the singer's placements come back as they were. General, not keyed to this song.

1. **Detect.** On the restore path, a stored pairing map whose keys are in the old reader's form (`/^r\d+-\d+(-\d+)?$/`, the same syntactic test `apps/web/src/lib/score/correction.ts:636-660` uses for its own re-key) while the parsed reading's sung events carry none of those names. Apply the same to `corrections` if any of its keys are in that form (Dann's has none; another singer's may).
2. **Re-key, DESK DEFAULT method.** The old key carries the bar and the horizontal position on the page. Within each bar, order the old seats by `x` and the current reading's syllable targets (`syllableTargetIds`, `pairings.ts:300`) by onset, and pair them in order where the counts agree. First establish, on this song, whether the old reader's `measureIndex` and the parser's count from the same origin; adjust by a constant offset if they differ, and say which in the report. Where a bar's counts disagree, do not guess: leave those seats under their old keys and count them.
3. **Keep the singer's work recoverable.** Nothing is dropped. Seats that could not be placed stay in the map under their old keys, where they draw nothing and harm nothing, and the count goes in the console line that already reports seats (`N.160 seats`). The re-keyed map is saved through the existing save seam only after it is built whole.
4. **Re-run the existing seat logic after the re-key** (`seatCliticFolds`, and whatever the restore path runs after `mergeOnUpload` today), so a re-keyed song is indistinguishable from one seated today.

Out of scope, recorded: homr's reading carries no note ids, so a correction made on it is keyed by the cursor, the fragility N.97 removed one layer in (`recognized-to-musicxml.ts:141-146`). Do not fix it here; say in the report whether a correction made on a homr reading today survives a reopen.

## Reproducing it without Dann's library

On the dev server, seat case A of row 93's harness (`docs/sessions/measure-markup-blank_2026-10-12/case.mjs`), then rewrite the stored record's pairing keys into the old form before the reload: for each seat on event `m{b}-{n}-{d}`, the key `r{b}-{x}`, where `x` is the note's horizontal position in the reading's page coordinates if the reading exposes one, else a strictly increasing integer per bar. Reload and confirm Markup is blank (the bug), then confirm the fix draws all 170. Record which `x` source was used.

## Done when

- The reproduction is blank before the fix and draws 340 Cyrillic and 340 IPA `<text>` after it, fresh reload and second reload, with the `N.160 seats` line reporting the re-keyed count and 0 left under old keys.
- Unit tests for detect and re-key: a wholly old-keyed map against an id-less reading; a mixed map; a bar whose counts disagree (its seats stay under old keys, counted); an already re-keyed map (no-op, idempotent).
- All eight gates pass; gate 4 rises by the new tests; say the new count.
- No git command that writes. Nothing in `docs/memory/`.

## The report

`docs/sessions/report-code-row93-seats-under-old-names_r1_2026-10-13.md`: what changed, by file and line; the bar-index finding; the reproduction's counts before and after; the gates table; and a section headed **Could not establish**. NOT ESTABLISHED beats a complete invented answer.

## After Code, for the desk

Ship, then the desk reads Dann's record again on the alias, read-only, and counts the seats that name a note; then Dann walks Markup on the song. That walk also unblocks rows 78a, 78b, and 78c.
