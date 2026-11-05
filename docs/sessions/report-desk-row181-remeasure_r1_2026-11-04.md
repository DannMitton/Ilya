# Row 181 re-measure on branch step 8 (Sonnet helper, 2026-11-04)

## Answer first

r6 scores 376 of 590 exact seats (b), against 369 for the control (+7) and 332 for the old tip 4e5e5dbc (+44). Per song 1..5: 48, 139, 33, 82, 74 (control 48, 136, 29, 82, 74). Against the control it gains 7 syllables and loses none. Nucleus (a) 416 (control 408). Word (c) 99 (control 121, old tip 112): (c) is lower; I did not investigate why.

Tree: `cloud-lane-34` new tip 05db2dacef5f4f898ee93f13726b3fa45357fd3f (two commits after 4e5e5dbc: 3b6a9088 step 8a/8b, 05db2dac step 8c). Lockfile unchanged, so no install. Rebuilt with `pnpm build` in apps/web (the same script chain as build-br.log; log build-br2.log), preview on 4174. Query `words=read` (extender off, second look on), `--join` wait, fresh context per song, headless Chromium. Captured once: run-to-run variance NOT ESTABLISHED. Files: cap/r6, scoreout/r6.tsv.

## Counts

| | (b) of 590 | song 1..5 | (a) | (c) |
|---|---|---|---|---|
| control r1ctl | 369 | 48,136,29,82,74 | 408 | 121 |
| old tip r2a | 332 | 47,109,33,72,71 | 378 | 112 |
| r6 | 376 | 48,139,33,82,74 | 416 | 99 |

Gained against the control (7): s2 p3 sys1 "Дай те бо" (+3); s3 p8 sys4 "о"; s3 p11 sys4 "листь я шу" (+3). Lost: none.
Against r2a: gained 59 (all of r2a's 56 losses less none are back, plus the ones above: s1 p1 sys2 "ту чер"; s2 p3 sys0/1/2/3, p4 sys0/1/2/4; s4 p13 sys4, p14 sys4, p15 sys3, p17 sys3; s5 p18 sys3/4, p19 sys4, p20 sys2, p21 sys1/2/4), lost 15 seats' worth in 4 places: s1 p1 sys1 "ты,"; s2 p3 sys3 "дру"; s4 p13 sys4 "доль"; s5 p21 sys3 "ду шу не вин ну ю теп лой за ступ ни це". Those four were the old tip's gains over the control, so r6 is at the control there, not below it. (The gain count of 59 is the scorer's per-syllable tally in the list printed by my diff; treat the per-syllable counts as indicative, the totals 376, 369, 332 as exact.)

## Console: extenders and second look

Extender marks are off: every page's line reads "extenders (arm off)" with 0 notes marked. Token counts (hyphen / long-dash, summed over pages): song 1 25 / 47; song 2 41 / 52; song 3 34 / 89; song 4 41 / 42; song 5 59 / 48. (My awk summed the notes field wrongly; the line itself says 0 notes marked on every page I read; not re-summed for every page.)
Second look (on): song 1 one system, kept (wide, 1 word), 2.0 s; song 2 one system, kept (wide, 2 words), 3.4 s; song 3 five looked-at pages, several systems kept (up 1 word; wide 5 words; wide 2; stretch 1; down 1, down 1, down 1), 6.5 + 9.2 + 4.7 + 3.5 + 8.9 s; song 4 one system, nothing found, 2.9 s; song 5 one system, kept (down, 1 word), 2.7 s. Per-try lines: cap/r6/sN/*.console.txt, "second look:".

## The join (`[ilya] poem join:`)

- Song 1: no join line (no library text, as before). The dry run lists 65 seated of 65 (address).
- Song 2: 1 repaired, 0 filled, 4 kept as the composer's, 25 offered (count, real-close, both-fail, inside-word, unanchored), 14 runs of notes with no word, 0 not placed, 0 dropped by the one-vowel check, 0 faults on the second pass. (On the old tip song 2 refused: "does not line up with its words". It now joins.)
- Song 3: 1 repaired, 0 filled, 1 kept, 9 offered (count, unanchored), 6 runs, 0 not placed, 0 dropped, 0 faults. (Old tip: 1 repaired, 5 kept, 9 offered, 5 runs.)
- Song 4: 1 repaired, 0 filled, 4 kept, 20 offered (count, real-close, repeat, inside-word, unanchored), 13 runs, 0 not placed, 0 dropped, 0 faults. (Old tip: refused.)
- Song 5: 1 repaired, 1 filled, 1 kept, 23 offered (both-fail, count, real-close, inside-word, unanchored, count-refused), 19 runs, 0 not placed, 0 dropped, 0 faults. (Old tip: refused.)
No refusal line appeared in any song this run. The word "disagreement" appears in no song's console.

Scoring the join: score114.py reads only the MusicXML the page ingests, and the join changes LYRICS and the pairings, not that file, so the 376 above does NOT include the join. I rebuilt MusicXML from the post-join pairings (pair2xml.py; scoreout/r6-join.tsv: 196). That figure is NOT a valid comparison and I report no join score: the pairings' ids are not found in the MusicXML for song 1 (52 of 65), song 3 (11 of 43), song 4 (55 of 107), song 5 (35 of 93); only song 2 matches fully (0 missing) and scores 127 against 139 for the page MusicXML, a gap that is the pairings' coverage (155 pairings for 203 notes), not a measure of the join's correctness. The join's effect on exact seats is NOT ESTABLISHED. What is established: the join ran on four of five songs and made no faults, drops, or unplaced syllables by its own counts.

## Not established
- Run-to-run variance (one capture).
- Why (c) fell from 121 to 99 while (b) rose.
- The join's effect on seats and whether each repair is right.
- Which of the step 8 commits (8a/8b extender default, 8c token map) accounts for the recovery from 332: not bisected.
