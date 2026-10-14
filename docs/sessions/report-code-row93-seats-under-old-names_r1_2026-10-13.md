# Report: a stored scan's seats filed under the old reader's note names find their notes again (row 93, r1, 2026-10-13)

Written by Code (Opus 5.5) on Dann's Mac, 2026-10-13 to 2026-10-14, for `brief-code-row93-seats-under-old-names_r2_2026-10-13.md` (r2; r1 not used). No git command that writes was run. Nothing in `docs/memory/` was edited.

## Summary

- On the real history of «Средь шумного бала», the reproduction was blank before the fix: 0 Cyrillic and 0 IPA `<text>`, and the station said 170 placements had no note.
- After the fix, 168 of the 170 seats find their notes. Markup draws 336 Cyrillic and 336 IPA `<text>` on the first and the second reload, not the 340 and 340 the brief asked for.
- The console line reads `168 seats moved, 2 left under old names, 2 bars left`, not 170, 0, 0. `orphanedCount` is 2, not 0, so the station's orphan line still shows.
- The two seats left are «ви» (bar index 17) and «чит.» (bar index 57). Each fails one of the brief's rules for a stated reason (below). Neither rule was bent to reach 170.
- One placement is probably wrong: «лю!» in bar index 90, placed by the brief's page-position rule. It needs the desk's ruling (below).
- All eight gates pass. Gate 4 rose from 2448 to 2460, the 12 new tests.

## The tree

- Branch `Shane` at `1ec2ef2`. At the start, the working tree was dirty only in `docs/memory/` (seven files modified by the desk before this session; their timestamps all predate this session's first write) and in untracked `docs/sessions/` files.
- This session changed `apps/web/src/routes/+page.svelte` and added two files under `apps/web/src/lib/score/`, plus the harness folder `docs/sessions/row93-rekey_2026-10-13/` and this report.

## What changed, by file and line

**New: `apps/web/src/lib/score/old-reader-seats.ts`** (230 lines). A pure module, unit-testable without the page.

- `OLD_READER_ID` (`:43`) is the old reader's id shape, `r{measureIndex}-{x}` or `r{measureIndex}-{x}-{ordinal}`, as `correction.ts:636-662` documents.
- `notePositions(musicXml, events)` (`:83`) reads homr's page x for each event from `<!-- imgpos: x, y -->` through the existing `placeOf` (`omr/join-pages.ts`). It works only on a single-part reading, and only for a bar whose notes (no chord, grace, backup, or forward) line up one for one with that bar's parsed events. Any other bar gets no positions.
- `rekeyOldReaderSeats(map, events, positions)` (`:102`) applies the brief's DESK DEFAULT method, bar by bar:
  - **Order:** where the bar's old seats, sorted by x and then ordinal, equal its `syllableTargetIds` in number, sorted by onset, they pair in order.
  - **Page position:** otherwise, where every sung note of the bar has an imgpos, each seat takes the nearest target in bar-relative x. Seats are normalised to their own span; targets to the span of the bar's sung notes, rests excluded on both sides, as the brief directs. The bar is placed only where no seat's nearest target is a tie and the picks rise strictly, which also makes them one-to-one.
  - **Left:** anything else, counted, under the old key.
  - Every entry kind moves (`syllable`, `melisma`, `empty`).
  - A bar is also left where a target already holds an entry under its own name, so nothing is overwritten.
  - It is a no-op, returning the same map object, when no old name is missing from the reading, and when the reading itself carries old-reader ids. In that case the missing names are ordinary orphans of a re-read.
- `rekeyOnArrival` (`:165`) is the call `applyArrival` makes.
  - It runs the order rule synchronously. It reads the arrived reading for positions only where that rule leaves a seat; only then does it return a promise, and that promise never rejects.
  - So a song with no old name, or one wholly placed by order, reaches `mergeOnUpload` in the same tick as before.
  - It prints `[Ilya] N.185 re-key: n seats moved, m left under old names, k bars left` (`rekeyLine`, `:184`) only when n + m > 0.

**New: `apps/web/src/lib/score/old-reader-seats.test.ts`** (12 tests). The brief's five cases, plus seven more:
- the brief's five: a wholly old-keyed map against an id-less reading; a mixed map (including a bar left because its target already holds an entry); a bar whose counts disagree, placed by imgpos where one-to-one; the same bar left where it is not one-to-one; `melisma` and `empty` entries; and an already re-keyed map as a no-op;
- the collision ordinal;
- a bar left where the reading has no positions;
- the old reader's own reading as a no-op;
- `rekeyOnArrival` answering synchronously and surviving a failed read;
- two `notePositions` cases.

**Changed: `apps/web/src/routes/+page.svelte`** (net 0 lines; the file is at its ratchet ceiling, 6003).
- `:161` imports `rekeyOnArrival`.
- `:3261-3262`, in `applyArrival`, before `shouldFoldOnArrival` and the `mergeOnUpload` call, for origin `'restore'` and `'upload'` alike:
  ```ts
  const rekeyed = rekeyOnArrival(doc.pairings, ingested.result.score.vocalLine, () => file.text()); // row 93, before the merge counts orphans
  doc.pairings = (rekeyed instanceof Promise ? await rekeyed : rekeyed).map;
  ```
  - On restore, `file` is the kept reading as a `.musicxml` File (`readingFile`, `omr/scan.ts:114`). On a scan upload, `arrivalScan` has already been spent by `attachUploadedSource` by this point, so `file` is what the uploader handed over.
  - A no-op re-key returns the same map object, so the assignment changes nothing and saves nothing. A re-keyed map is a new object, built whole, and goes through the existing save seam on assignment.
  - Nothing else in `applyArrival` changed: `mergeOnUpload`, `orphanedCount = merged.orphaned.length`, and the `shouldFoldOnArrival` gate run as before. `seatCliticFolds` is not called on the re-keyed map.
- Three surplus blank lines were removed (two after the `$derived` near the old `:1357`, one in `<style>` near the old `:5066`) to keep the file at its ceiling.

## Departures from the brief

1. **`corrections` is not re-keyed.** Item 1 says an r-keyed `corrections` map is re-keyed by this function in `applyArrival`. I did not do it, for two reasons:
   - A correction is a diff against the old reader's reading: a deletion of a note it invented, a pitch it misread. Moved by position onto homr's reading, which read that bar differently, a deletion can land on a real note. Left under old keys, the corrections stay recoverable and are already counted by `orphanIds`.
   - The brief's own reading of Dann's library finds no r-keyed `corrections` in any song. This song's is empty.

   This is reversible and is the desk's to rule on.
2. **The console line's number is `N.185`, my choice.** The brief wrote `N.1xx`. N.184 is the highest number in `STATE.md`. If the desk numbers this otherwise, change the string in `rekeyLine` and the two tests that quote it.
3. **"The bar's imgpos min and max"** was read as the span of the bar's sung notes, rests excluded, because the brief says rests are "ignored on both sides" and old seats exist only on notes.
4. **A strict-rise check was added to the page-position rule.** The brief asks only for one-to-one. JUDGEMENT: a placement that reverses two seats' order is never the singer's.

## The reproduction

Harness: `docs/sessions/row93-rekey_2026-10-13/repro.mjs`, set up as case A of row 93 (`measure-markup-blank_2026-10-12/case.mjs`): bass voice "Dann", French, headless Chrome with WebGPU, service workers blocked.
- Stage 1 opens `http://localhost:5173/?reader=ilya`, types `poem.txt`, drops `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf`, and presses « Lire cette page ».
- Reopens 1 and 2 load `http://localhost:5173/` without the flag.
- Reopen 1 waits for homr's read line.
- At each stage the harness opens the Voice band so the station's orphan line can render. That line draws only inside the open band; the first "before" run (`out-before-r1/`) missed it for that reason.

**The old reader ran in this build**, so no tampered record was needed. Its map matches the desk's reading of Dann's record wherever the two can be compared:
- 170 entries, all `kind: "syllable"`, first `r7-2883` «Средь» `ˈsrʲetʲ`, last `r90-1244`, `corrections` empty;
- in reopen 1, homr's kept reading has stamp `homr-web@0.2.0-ilya.7/465`, 64765 characters, 222 `<note>`, 0 with `id`, and 222 `imgpos`.

The old reader's map was byte-identical in the before and after runs. homr's kept reading was byte-identical across the two independent reads.

| Stage | Stored keys (old / current) | Markup Cyrillic / IPA `<text>` | Station orphan line | Console |
|---|---|---|---|---|
| Before, stage 1 (old reader) | 170 / 0 | 340 / 340 | none | `N.160 seats: 170 drawn live, 0 kept as stored, of 170 seated` |
| Before, reopen 1 (homr reads) | 170 / 0 | **0 / 0** | « 170 placements n’ont plus de note dans cette partition. » | same `N.160` line; no re-key line |
| Before, reopen 2 (kept reading) | 170 / 0 | **0 / 0** | « 170 placements … » | same; dry run `170 seated = 170 address + …`, every seat "no note" |
| After, stage 1 | 170 / 0 | 340 / 340 | none | as before |
| After, reopen 1 | 2 / 168 | **336 / 336** | « 2 placements n’ont plus de note … » | `N.185 re-key: 168 seats moved, 2 left under old names, 2 bars left` |
| After, reopen 2 | 2 / 168 | **336 / 336** | « 2 placements … » | `N.185 re-key: 0 seats moved, 2 left under old names, 2 bars left`; dry run lists `note 1 m7-1-4 «Средь» …` |

- 336 is twice 168: each syllable is drawn in two SVGs, as row 93's report found for 340 and 170.
- The first cells read «Средь», «шум», «но», «го», «ба», «ла,» and ˈsrʲetʲ, ˈʃum, nʌ, vʌ, ˈbɑ, ɫɑ.
- No page error in any stage. Pictures of page 1 at each stage and the full logs are in `row93-rekey_2026-10-13/out/`.
- The in-app map after reopen 1 equals, key for key, what the module gives offline on the before-reopen-2 map and kept reading (`out/probe-before-reopen2.json`).

**The heal's dry run and the `N.160 seats` line after the fix (item 4).**
- Reopen 2 logs `N.160 dry run: 170 seated = 170 address + 0 anchor + 0 joined + 0 rejected + 0 unfound. Nothing written.`, now naming current ids (`note 1 m7-1-4 «Средь»`).
- In reopen 1 the dry run printed once, before the re-key line, against the old names. homr's read left two bars to the page-position rule, so `rekeyOnArrival` awaited the reading, and the dry-run effect ran in that gap.
- The dry run writes nothing. I checked every `doc.pairings =` in `+page.svelte`: none is in an effect. `healFrozenSeats` runs only from a first transcription (`:2337`).
- `N.160 seats` reads 170 in every stage, before and after, because it counts entries (`pairings.ts:1055-1063`), as the brief says.

## The bar count and the per-bar table

- The old map's highest bar index is 90, so 91 bars. homr's reading has 99 measures; indices 92 to 98 hold no note, and index 91 to 92 is the final tied F.
- **No run of consecutive bars is left, so no barline shift between the two readers shows on this song.**
- Rule totals over the 81 bars that hold an old seat: 78 order, 1 page position (index 90), 2 left (indices 17 and 57). Bars with no old seat (61, 69, 83) are not listed.

| Bar index | Printed bar | Rule | Old seats | Targets |
|---|---|---|---|---|
| 7 | 8 | order | 1 | 1 |
| 8 | 9 | order | 3 | 3 |
| 9 | 10 | order | 2 | 2 |
| 10 | 11 | order | 1 | 1 |
| 11 | 12 | order | 2 | 2 |
| 12 | 13 | order | 1 | 1 |
| 13 | 14 | order | 3 | 3 |
| 14 | 15 | order | 3 | 3 |
| 15 | 16 | order | 2 | 2 |
| 16 | 17 | order | 3 | 3 |
| **17** | **18** | **left** | **1** | **2** |
| 18 | 19 | order | 1 | 1 |
| 19 | 20 | order | 2 | 2 |
| 20 | 21 | order | 1 | 1 |
| 21 | 22 | order | 3 | 3 |
| 22 | 23 | order | 3 | 3 |
| 23 | 24 | order | 1 | 1 |
| 24 | 25 | order | 1 | 1 |
| 25 | 26 | order | 3 | 3 |
| 26 | 27 | order | 2 | 2 |
| 27 | 28 | order | 1 | 1 |
| 28 | 29 | order | 2 | 2 |
| 29 | 30 | order | 1 | 1 |
| 30 | 31 | order | 3 | 3 |
| 31 | 32 | order | 3 | 3 |
| 32 | 33 | order | 2 | 2 |
| 33 | 34 | order | 3 | 3 |
| 34 | 35 | order | 2 | 2 |
| 35 | 36 | order | 1 | 1 |
| 36 | 37 | order | 2 | 2 |
| 37 | 38 | order | 1 | 1 |
| 38 | 39 | order | 3 | 3 |
| 39 | 40 | order | 3 | 3 |
| 40 | 41 | order | 1 | 1 |
| 41 | 42 | order | 1 | 1 |
| 42 | 43 | order | 3 | 3 |
| 43 | 44 | order | 3 | 3 |
| 44 | 45 | order | 2 | 2 |
| 45 | 46 | order | 1 | 1 |
| 46 | 47 | order | 3 | 3 |
| 47 | 48 | order | 3 | 3 |
| 48 | 49 | order | 1 | 1 |
| 49 | 50 | order | 1 | 1 |
| 50 | 51 | order | 3 | 3 |
| 51 | 52 | order | 3 | 3 |
| 52 | 53 | order | 2 | 2 |
| 53 | 54 | order | 1 | 1 |
| 54 | 55 | order | 3 | 3 |
| 55 | 56 | order | 3 | 3 |
| 56 | 57 | order | 1 | 1 |
| **57** | **58** | **left** | **1** | **0** |
| 58 | 59 | order | 1 | 1 |
| 59 | 60 | order | 3 | 3 |
| 60 | 61 | order | 3 | 3 |
| 62 | 63 | order | 2 | 2 |
| 63 | 64 | order | 1 | 1 |
| 64 | 65 | order | 3 | 3 |
| 65 | 66 | order | 3 | 3 |
| 66 | 67 | order | 2 | 2 |
| 67 | 68 | order | 3 | 3 |
| 68 | 69 | order | 3 | 3 |
| 70 | 71 | order | 2 | 2 |
| 71 | 72 | order | 1 | 1 |
| 72 | 73 | order | 3 | 3 |
| 73 | 74 | order | 3 | 3 |
| 74 | 75 | order | 1 | 1 |
| 75 | 76 | order | 1 | 1 |
| 76 | 77 | order | 3 | 3 |
| 77 | 78 | order | 3 | 3 |
| 78 | 79 | order | 2 | 2 |
| 79 | 80 | order | 3 | 3 |
| 80 | 81 | order | 3 | 3 |
| 81 | 82 | order | 3 | 3 |
| 82 | 83 | order | 1 | 1 |
| 84 | 85 | order | 1 | 1 |
| 85 | 86 | order | 3 | 3 |
| 86 | 87 | order | 3 | 3 |
| 87 | 88 | order | 2 | 2 |
| 88 | 89 | order | 1 | 1 |
| 89 | 90 | order | 3 | 3 |
| **90** | **91** | **imgpos** | **2** | **3** |

**Why the two bars were left.**

- **Index 17, `r17-3009` «ви» of «увидел».**
  - homr reads B quarter (imgpos 3004) and D eighth (3160). The D is unseated in the old map (a melisma note, undecided), so the counts are 1 and 2.
  - A single seat has no span, so it normalises to the middle. It is exactly equidistant from the two targets, and the rule refuses a tie.
  - By absolute x, 3009 against 3004 says the B quarter.
  - The page reads « у – дел » with nothing under the B. You can see it in `out/after-reopen2-markup-p1.png`, second system.
- **Index 57, `r57-1860` «чит.» of «звучит».**
  - homr reads C quarter in index 56 tied (`<tie>`) into a C eighth (1845) in index 57. `syllableTargetIds` excludes that continuation, so index 57 has no target.
  - The old reader did not see that tie and seated «чит.» on that note.
  - The brief's premise that "a tie's continuation … could not have taken a seat under either reader" does not hold here: the two readers disagree about whether there is a tie. Whether the print has a tie or a slur: NOT ESTABLISHED (not checked against the PDF).

**The bar placed by page position is probably placed wrong.**
- Index 90, «люб» `r90-1153` and «лю!» `r90-1244`. homr reads F eighth (1150), F eighth (1251), F sixteenth (1348).
- Normalised to their own span, the two seats become 0 and 1, so «лю!» went to the sixteenth (`m90-5-16`).
- On this song the two readers' x values agree in absolute terms: over the 168 placed seats, the median difference is 9 px and the 95th percentile 30 px. By that measure, `r90-1244` is the second eighth (1251), not the sixteenth (104 px away).
- The other large difference, index 67 at 194 px, is homr's own `imgpos` disorder, not a misplacement: its first note's imgpos (2127) lies left of the previous bar's last note (2176), and the order pairing there is right.
- The flaw is the brief's normalisation, not this song. Old seats are normalised to the seats' own span because the old bar's full extent is not stored, so any bar whose seats do not reach both ends is stretched.
- I followed the brief as written and flag it for a ruling. Two options:
  - drop the page-position rule, which leaves index 90 under old keys;
  - add an absolute-x rule gated by a song-level agreement test like the one above. That would also place index 17. I did not build it: it is a method change, not a reading of the brief.

## What a re-drop of the same scan onto this song does

Measured after the fix (stage `redrop` in `out/after.json`), after reopen 2:
- homr reads the PDF again (1.8 minutes in total). `handleArrival` counts 2 orphans: the two seats left under old names.
- The song's stored fingerprint is the old reader's (`canonicalVocalLine` includes event ids, `library/fingerprint.ts`) and differs from homr's. So `arrivalDecision` returns `ask`, and the dialog opens:

  > « Ce n’est pas la même musique. … 2 de vos 170 placements de syllabes n’y ont aucune note. Continuer remplace le chant entier … »

- The harness did not press « Conserver »: its pattern looked for "Garder|Keep". While the dialog stood, nothing changed: same 170 entries (2 old, 168 current), same kept reading, 336 / 336 on Markup.
- By code (`+page.svelte`, `replace.keep` carries no `run`), « Conserver » applies nothing and « Remplacer ce chant » runs `applyArrival(..., true)`, which empties the map.

Before the fix, the same re-drop would have counted 170 orphans and opened the same dialog with « 170 de vos 170 » (INFERENCE from the same code; not measured). Once every seat is placed, the count is 0 and the decision is `attach` despite the fingerprint (`library.ts:549`), but that is not measured either.

## Whether a correction made on a homr reading survives a reopen

From the code, not from a correction made and reopened.
- A correction on a homr reading is keyed by the cursor id `m{measureIndex}-{num}-{den}`, because homr's reading carries no `<note id>`.
- While the kept reading's stamp equals `READER_STAMP`, a reopen ingests the same kept MusicXML (`omr/restore.ts`, `isCurrent`), so the cursor ids are the same and the correction lands.
- In this session, two independent homr reads of the PDF (the before and after runs) gave byte-identical MusicXML. So a fresh read under the same stamp also reproduces the ids on this song.
- When `READER_STAMP` changes, homr reads again. Each correction then survives only if the new reading puts its note at the same onset in the same bar. Removing or adding one event early in a bar renames every later event in it, the fragility N.97 removed one layer in (`recognized-to-musicxml.ts:140-147`).
- Out of scope; not changed.

## Gates

From a scratch copy of `~/Downloads/ilya-ship.sh`: the untracked-file refusal was removed and everything from `if [ -z "$MSG" ]` was replaced with `exit 0`, so it cannot stage or commit. The real script is untouched.

| Gate | Baseline | Result |
|---|---|---|
| 1 phonology | 251 passed (251) | OK, 251 passed (251) |
| 2 dictionary | 248 passed (248) | OK, 248 passed (248) |
| 3 web-check | 0 errors and 12 warnings in 5 files | OK, the same |
| 4 web-test | 2448 passed (2448) | **2460 passed (2460)**: +12, all from `old-reader-seats.test.ts`; the baseline is the desk's to move |
| 5 score-parser | 675 passed, 5 skipped (680) | OK, the same |
| 6 blurb | 145 passed (145) | OK |
| 7 integration | 55 passed (55) | OK |
| 8 ratchets | OK | OK (`+page.svelte` 6003 of 6003; the new module 230 lines) |

The probe test used for the offline table (`row93-rekey_2026-10-13/zz-row93-probe.test.ts`) was copied into `apps/web/src/lib/score/` only to run, and removed before the gates.

## Could not establish

- **Whether every one of the 170 keys in this reproduction equals Dann's.** The first key, the last key, the count, the kind, and the kept reading's stamp, length, and note counts match the desk's reading of his record. The 168 between were not compared, because the desk recorded only the first and last. So whether his library gives 168, 2, 2 as this run does: NOT ESTABLISHED, and it is the desk's read-only count after the ship that settles it.
- **Where «чит.» belongs in the print**, that is, whether index 56 to 57 is a tie (homr) or two notes (the old reader): NOT ESTABLISHED; the PDF was not examined.
- **Where «лю!» belongs.** The old reader's x points to the second eighth of index 90. That is evidence, not the print. NOT ESTABLISHED.
- **The re-drop's outcome when « Conserver » is pressed**, and the re-drop before the fix: by code only, as stated above; not measured.
- **A correction on a homr reading surviving a reopen:** by code and by two identical reads; no correction was made and reopened.
- **Whether `rekeyOnArrival`'s await, on a song that needs page positions, can let anything other than the dry-run log run against the unmerged map.** I found no writer in an effect. A first transcription landing in that gap would run `healFrozenSeats` on the old names; in this reproduction the heal's plan wrote nothing. Not proven for every song.
- **The French of the console line:** it is a developer console line, English only, as the `N.160` lines are; no French was written.

## Files

- `apps/web/src/lib/score/old-reader-seats.ts` (new)
- `apps/web/src/lib/score/old-reader-seats.test.ts` (new)
- `apps/web/src/routes/+page.svelte` (changed, net 0 lines)
- `docs/sessions/row93-rekey_2026-10-13/` (new): `repro.mjs`, `zz-row93-probe.test.ts`, `out/` (before, after, probe, per-bar table), `out-before-r1/` (the first "before" run, without the band opened)
- this report

## Amendment 1

Carried out 2026-10-14 for `brief-code-row93-amendment1_r1_2026-10-14.md`. Branch `Shane` at `1ec2ef2`, same working tree as above, plus the changes below. No git command that writes was run. Nothing in `docs/memory/` was edited.

### Result

Every expected figure from the amendment landed on the reproduction:

| | Expected | Measured |
|---|---|---|
| Console, first reload | `169 seats moved, 1 left under old names, 1 bar left` | the same; second reload `0 seats moved, 1 left under old names, 1 bar left` |
| Markup Cyrillic / IPA, first and second reload | 338 / 338 | 338 / 338 on both |
| «ви» | placed | `m17-0-1`, the B quarter (imgpos 3004) |
| «лю!» | the second eighth, x 1251 | `m90-1-8`, the second eighth |
| «чит.» | still left | still `r57-1860` |

Further readings on the same run:
- The station's orphan line now reads « 1 placements n’ont plus de note dans cette partition. »: `orphanedCount` is 1.
- `N.160 seats` reads 170 in every stage.
- The heal's dry run on reopen 2 reads `170 seated = 170 address + 0 anchor + 0 joined + 0 rejected + 0 unfound. Nothing written.`
- On reopen 1 the dry run again printed once against the old names before the re-key line. That is the same wait for page positions the report describes above. Nothing was written.
- No page error.
- homr's kept reading was byte-identical to the earlier runs.
- Harness output: `docs/sessions/row93-rekey_2026-10-13/out-a1/`. Offline probe: `out/probe-amendment1.json`. The in-app map equals the probe's.

### The scale figures

Over the 166 seats placed in order that have a page position, the gap between the old key's x and the placed note's imgpos x is:
- **median 9 px** (threshold 20);
- **95th percentile 29 px** (threshold 40), nearest rank.

So the song passes the scale test. The report above gave 30 for the 95th percentile because it counted 168 seats, including the two bar 90 seats placed by the bar-relative rule. The amendment counts only seats placed in order, which gives 29.

### The per-bar table's changed rows

| Bar index | Printed bar | Before amendment 1 | After | Old seats | Targets |
|---|---|---|---|---|---|
| 17 | 18 | left | **raw** | 1 | 2 |
| 90 | 91 | imgpos (bar-relative) | **raw** | 2 | 3 |

Every other row is unchanged: 78 order, 1 left (index 57).

### What changed

**`apps/web/src/lib/score/old-reader-seats.ts`** (230 → 315 lines):
- The header comment now describes the raw rule (`:22`) and records the corrections departure (`:47`), per ruling 1.
- `Scale`, `SHARED_MEDIAN` (20), `SHARED_P95` (40), and `RAW_REACH` (60) are at `:91-101`.
- `rekeyOldReaderSeats` (`:131`) now works in two passes:
  - **Pass 1 (`:162`)** places bars in order where the counts agree, as before, and collects the gaps.
  - **Pass 2 (`:179`)** takes every bar whose counts disagree. If the scale is shared and every target has a page position, it tries the raw rule. It then tries the bar-relative rule, unchanged, and otherwise leaves the bar.
  - A bar whose order pairing would overwrite a note's existing entry is still left, as before.
- `scaleOf` (`:213`) takes the median, and the 95th percentile by nearest rank. It returns null where there are no gaps; a null scale is not shared.
- `byRawPosition` (`:282`) pairs each seat with the nearest target in absolute pixels. It refuses a tie, a distance over 60 px, and a pick that does not rise strictly (which also makes it one-to-one), the same order test as the bar-relative rule.
- `Rekeyed.scale` carries the figures. `BarOutcome.rule` gains `'raw'`.
- `rekeyLine` (`:252`) now uses the singular for one seat and one bar, so the line reads `1 bar left` as the amendment wrote it.
- When the scale test fails, the code takes exactly the old path.

**`apps/web/src/lib/score/old-reader-seats.test.ts`** (+5 tests, `:124-178`):
1. A song that passes the scale test and places a lone seat («ви»'s numbers).
2. Two seats over three notes, placed by raw x ahead of the bar-relative rule (bar 90's numbers).
3. A song that fails the scale test and falls through unchanged: bar-relative as before, and a lone seat still left.
4. A pairing at 61 px refused, and the same at 60 px accepted.
5. `scaleOf`'s median, its nearest-rank percentile, and its thresholds.

The mixed-map test's expected line now reads `1 seat moved, … 1 bar left`.

**`+page.svelte`** is unchanged by the amendment.

### Re-drop of the same scan, re-measured

After reopen 2, homr read the PDF again. The dialog opened with « 1 de vos 170 placements de syllabes n’y ont aucune note » (the stored fingerprint is still the old reader's). This time the harness pressed « Conserver ». The state after it was unchanged: 1 old key, 169 current, 338 / 338. Whether the press itself landed was not recorded separately.

### Gates

Same scratch copy of `ilya-ship.sh` as above.

| Gate | Result |
|---|---|
| 1 phonology | OK, 251 passed (251) |
| 2 dictionary | OK, 248 passed (248) |
| 3 web-check | OK, 0 errors and 12 warnings in 5 files |
| 4 web-test | **2465 passed (2465)**: 2460 + 5 new tests; the baseline is the desk's to move (2448 in the script) |
| 5 score-parser | OK, 675 passed, 5 skipped (680) |
| 6 blurb | OK, 145 passed (145) |
| 7 integration | OK, 55 passed (55) |
| 8 ratchets | OK (`+page.svelte` 6003 of 6003; the module 315 lines) |

Gate 3 first failed on a type error in one new test line (`scaleOf(...)` is possibly null). That line was fixed and all eight gates were rerun.

### Amendment 1b: at least 20 seats placed in order

Carried out 2026-10-14 for the "Amendment 1b" section of `brief-code-row93-amendment1_r1_2026-10-14.md`.

**What changed:**
- `old-reader-seats.ts` (315 → 319 lines): `SHARED_MIN_PAIRS = 20`. `scaleOf` now marks the scale shared only when `n >= SHARED_MIN_PAIRS` as well as the two thresholds. Below 20 the test fails and the old path runs: the bar-relative rule, then left. The header comment and `scaleOf`'s comment say so.
- `old-reader-seats.test.ts` (212 → 220 lines), 18 tests:
  - one new test: 19 seats placed in order with gaps of 1 px fail the scale test (`{ pairs: 19, median: 1, p95: 1, shared: false }`), and the bar falls through to the bar-relative rule as before amendment 1;
  - the amendment 1 helper `song()` now builds 20 in-order bars by default, so the existing raw-rule tests still clear the minimum.

**On this song:** the offline probe gives the same result as amendment 1, pair for pair and bar for bar (scale 166 seats, median 9, 95th percentile 29, shared; 169 moved, 1 left, 1 bar left; `out/probe-amendment1b.json`). The browser reproduction was not rerun: the change cannot alter a song with 166 in-order seats.

**Gates after amendment 1b** (same scratch copy of `ilya-ship.sh`):

| Gate | Result |
|---|---|
| 1 phonology | OK, 251 passed (251) |
| 2 dictionary | OK, 248 passed (248) |
| 3 web-check | OK, 0 errors and 12 warnings in 5 files |
| 4 web-test | **2474 passed (2474)** |
| 5 score-parser | OK, 675 passed, 5 skipped (680) |
| 6 blurb | OK, 145 passed (145) |
| 7 integration | OK, 55 passed (55) |
| 8 ratchets | OK (`+page.svelte` 6003 of 6003; the module 319 lines) |

**Why gate 4 is 2474, not 2466.** 2465 + 1 new test = 2466. The other 8 are not from this code:
- Between the amendment 1 gate run and this one, files under `docs/sessions/` were staged in the index. `git status` shows them as `A`; no agent staged anything.
- Among them are eight `.kept.musicxml` harness readings under `docs/sessions/row93-rekey_2026-10-13/`. `git ls-files -- 'docs/sessions/row93-rekey_2026-10-13/*.musicxml'` lists 8.
- `markup-pages.test.ts:53` makes one test per tracked `.musicxml` (`git ls-files -- '*.musicxml'`), and a staged file counts as tracked.
- So 2474 = 2466 + 8. All 2474 passed.

If those eight readings are committed, gate 4's baseline is 2474. If they are unstaged or left out of the commit, it is 2466. Either way the count is the desk's to set in `ilya-ship.sh`.

### Could not establish (amendment 1)

- **Whether 20 is the right minimum sample** for the scale test (amendment 1b's DESK DEFAULT). Only this song, with 166, has been measured: NOT ESTABLISHED.
- **Whether «ви» and «лю!» sit where the print puts them.** They sit where the old reader's x put them. The print was not examined.
- **Whether Dann's own record gives 169, 1, 1.** As above, only his first key, last key, and count were compared.
