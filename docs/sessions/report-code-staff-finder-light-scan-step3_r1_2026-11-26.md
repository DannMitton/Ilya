# Report r1: step 3 of the staff finder lane, Nightingale page 4 end to end

2026-11-26, Code, Mac, on `mac-staff-finder` at `7ae519b9` with steps 1 and 2 uncommitted. Answers step 3 of
`brief-code-staff-finder-light-scan_r2_2026-11-25.md` and the step 3 instruction Dann pasted into the session, with
its one addition on Without Sun page 23. A report, not a repair. No code changed in this step. Nothing is committed.

All files named here are in `measure-staff-finder-light-scan_2026-11-25/`.

## The four figures

| | Nightingale page 4 |
|---|---|
| voice notes `systemsOf` assigns to a staff | **383 of 383** (410 notes and rests in homr's part) |
| systems the band found | **16** of 16 staves; none unfound |
| rows cut for the OCR | **41** at the first look, none at a second look |
| metre | **2/4 stated at 6 of the 7 printed signatures;** nothing elsewhere |

Per system (`step3-summary.out.txt`):

| system | bars | notes | rows | syllables seated | metre windows | printed 2/4 | reader states |
|---|---|---|---|---|---|---|---|
| 1 | 1 to 8 | 22 | 2 | 15 | 5 | yes | **2/4** |
| 2 | 9 to 16 | 27 | 3 | 15 | 4 | no | nothing |
| 3 | 17 to 24 | 19 | 3 | 16 | 5 | no | nothing |
| 4 | 25 to 32 | 21 | 2 | 18 | 8 | no | nothing |
| 5 | 34 to 41 | 22 | 2 | 12 | 5 | yes | **2/4** |
| 6 | 42 to 49 | 27 | 3 | 11 | 6 | no | nothing |
| 7 | 50 to 57 | 22 | 2 | 16 | 4 | yes | **2/4** |
| 8 | 58 to 65 | 27 | 3 | 13 | 5 | no | nothing |
| 9 | 66 to 73 | 22 | 2 | 17 | 4 | yes | **2/4** |
| 10 | 74 to 81 | 27 | 3 | 13 | 3 | no | nothing |
| 11 | 82 to 89 | 22 | 2 | 13 | 3 | yes | **nothing: missed** |
| 12 | 90 to 97 | 27 | 3 | 16 | 5 | no | nothing |
| 13 | 98 to 105 | 22 | 2 | 11 | 4 | yes | **2/4** |
| 14 | 106 to 113 | 27 | 3 | 14 | 4 | no | nothing |
| 15 | 114 to 121 | 22 | 2 | 14 | 3 | yes | **2/4** |
| 16 | 122 to 129 | 27 | 4 | 16 | 6 | no | nothing |

The 41 rows are 16 Russian lines, 16 German lines, six refrain notes, «Allegro.» (system 2), one row with no text
(system 3), and the publisher's line (system 16).

## A new failure: system 9 is seated from the German line

**Named, and stopped at. It needs its own row.**

- **What the singer meets:** bars 66 to 73 carry the German line spelled in Cyrillic, with IPA under it, where the
  page prints «По-бы-вай во всѣхъ стра-нахъ» (`step3-melody-bars70-83.png`, `step3-page-system9.png`).
- **What happens** (`step3-rows.out.txt`): neither row of system 9 passes the Russian test. The sewing fallback
  (`underlay-fallback.ts`) then takes the first row, top to bottom, that qualifies. The Russian row does not, and the
  German row does.
- **What sets it off** is the known fault in `QUEUE.md` row 224: the band's top edge cuts the Russian line, so its row
  reads badly.
- **The new part** is that the fallback can seat the other language. The Russian test also passes the German row
  outright in systems 2, 3, 10, 11, and 12. That does no harm today only because the Russian row comes first.

The replay of `seatPage` on the run's own rows gives the run's counts: 41 rows, 16 systems, 230 syllables, one system
by the fallback.

## Faults already on file, met on this page

- **Row 224, the clipped Russian line:** the first row starts on the band's top edge in 16 of 16 systems. In system
  16 the edge cuts through the middle of the line, the row reads as noise, it still passes the Russian test, and it
  is seated on bars 122 to 129 (`step3-page-system16.png`).
- **The metre miss at system 11,** the first staff of verse 5, is the same miss step 0c measured. The score states no
  signature at bar 82; the 2/4 stated at bar 66 is the last one before it.

## What the reader returned, whole

- **The score:** one part, 129 measures, 409 notes, 230 syllables, 2/4 stated at bars 1, 34, 50, 66, 98, and 114, and
  no other time signature.
- **The words:** 230 syllables seated and none unseated. The reader's own count: 111 sung notes with no syllable, 113
  notes breaking one vowel per note, 42 grace notes skipped.
- **On screen,** looked at: MELODY draws the song with Cyrillic and IPA under the notes. The title is still the
  placeholder. The app found Delvig's «Соловей мой, соловей» and filled 15 syllables from it, so some words on
  screen differ from the stored reading.
- **Time:** 84.5 s on WebAssembly.

## Without Sun page 23, box 2: the late left end

**It costs no bar line, no metre window, and no lyric row** (`step3-ws23.out.txt`, `step3-ws23-metre.out.txt`). The
third column is the built tree with this staff's left end put back to today's value, which isolates the left end.

| | shipped | pair | pair, left end put back |
|---|---|---|---|
| left end | 261 | 319 | 261 |
| bar lines | 1579, 2524, 3516 | the same three | the same three |
| metre windows | 4; start 261 to 729 | 4; start 319 to 787 | 4; start 261 to 729 |
| `readPageMetres` on the box | all state nothing | the same | the same |
| lyric band | 2054 to 2287 | 2054 to 2288 | 2054 to 2288 |
| lyric rows | 3 | 3, the last 1 px longer | 3, the same as the pair |

The one pixel comes with the pair and not with the left end. The staff prints no time signature, so no signature's
reading was tested; the late window still begins well left of the key signature's end, where one would stand.

## How it was run

- **The page:** `pdfseparate` cut page 4 into a one-page PDF. It renders to the same bytes as step 0a's raster (md5
  `5bb97b1e`).
- **The app:** the dev server, headless Chromium, a fresh profile, the welcome sheet dismissed, and the file given to
  the app's own file input (`step3-e2e.mjs`). The script wraps `Worker` only to copy answers.
- **Check:** the app's layout equals `prepareUnderlay` on step 0c's homr output.
- **The run's own files** are in `~/Downloads/_desk-staffin-2026-11-25/work/code-lane/step3/`.
- **Gates** were not run again: no code changed after steps 1 and 2.

## Not established

- Whether system 9 would seat the Russian line if the band showed it whole.
- How accurately the OCR read any line. Other lines carry wrong letters, and they were not counted.
- The other five pages of the PDF, and the join across them.
- A read on WebGPU, or in any browser but headless Chromium.
