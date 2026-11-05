# Row 181 steps 1 to 6 measured on row 114 first file (Sonnet helper, resumed run, 2026-11-04)

Trees: control `Shane` 9088d26c (trees/ctl). Branch `cloud-lane-34` tip 4e5e5dbc084da7df03084d66d24c223fcf66bb23 (trees/br). Scorer: score114.py as staged; credit (b) exact seats of 590. Headless Chromium, 2 CPUs, a fresh browser context per song per run, one sitting resumed after a container restart (18:01 to 20:48).
Control NOT re-run on resume: its numbers come from cap/r1ctl and scoreout/r1ctl.tsv (369: 48, 136, 29, 82, 74; re-scored on resume, same). Run 2 song 1 was kept from the earlier capture (complete); songs 2 to 5 were captured on resume. Each arm was captured once: run-to-run variance of the reader is NOT ESTABLISHED.

## Answer first

| Run | Tree | Query | (b) exact of 590 | vs 369 | per song 1..5 | (a) nucleus | (c) word |
|---|---|---|---|---|---|---|---|
| 1 control | Shane 9088d26c | words=read | 369 | 0 | 48,136,29,82,74 | 408 | 121 |
| 2 arm a, looks on | branch 4e5e5dbc | words=read | 332 | -37 | 47,109,33,72,71 | 378 | 112 |
| 3 arm b, looks on | branch | words=read&extender=b | 331 | -38 | 47,108,33,72,71 | 377 | not tabled |
| 4 arm a, looks off | branch | words=read&looks=off | 316 | -53 | 47,109,29,72,59 | 361 | not tabled |
| 5 the join, on run 2 (arm a is the better by one seat) | branch | words=read, then join | page MusicXML unchanged by the join: 332. Pairings as the page holds them: see below, NOT ESTABLISHED | | | | |

No step raised the total over 369. On this sitting the branch scores lower than the control by 37 seats (arm a). Steps 1 and 3 (and whatever else changed on the branch) lose 53 seats against the control (run 4, looks off); step 2 (the second look) gives back 16 of them (316 to 332), all in songs 3 and 5 (+4 song 3, +12 song 5). Arm b is one seat below arm a (song 2 only: 108 vs 109), so no reason to prefer it. I did not bisect which of steps 1, 3 or the branch's other changes causes the 53-seat loss: NOT ESTABLISHED.

## Changed syllables against the control (by song, page, system; system 0 is as the scorer numbers it)

Run 2 (arm a): gained 19, lost 56 (net -37).
- Gained: s1 p1 sys1 "ты,"; s2 p3 sys3 "дру"; s3 p8 sys4 "о"; s3 p11 sys4 "листь я шу"; s4 p13 sys4 "доль"; s5 p21 sys3 "ду шу не вин ну ю теп лой за ступ ни це".
- Lost: s1 p1 sys2 "ту чер"; s2 p3 sys0 "ря!"; s2 p3 sys2 "Дай те ви Ра дость вень е; пей те до дна! Гром ки е"; s2 p3 sys3 "ни грянь зья! за"; s2 p4 sys0 "Дай те бо"; s2 p4 sys1 "ру ет"; s2 p4 sys2 "сель"; s2 p4 sys4 "за ря! ка"; s4 p13 sys4 "раз ных по"; s4 p14 sys4 "жем чу гов раз"; s4 p15 sys3 "для ве"; s4 p17 sys3 "ю гру"; s5 p18 sys3 "ра зом, яр ким"; s5 p18 sys4 "шу пу"; s5 p19 sys4 "цу не"; s5 p20 sys2 "ма терь"; s5 p21 sys1 "ду шу"; s5 p21 sys2 "хо"; s5 p21 sys4 "хо но".
Run 3 (arm b): same gains (19); lost 57: the same as run 2 plus "дит" on s2 p4 sys4.
Run 4 (looks off): gained 3 (s1 p1 sys1 "ты,"; s2 p3 sys3 "дру"; s4 p13 sys4 "доль"); lost the same 56 as run 2. So the losses are not from the second look; the second look's gains are s3 p8 sys4, s3 p11 sys4, s5 p21 sys3 (16 seats).
Full per-note lists: scoreout/r1ctl.tsv, r2a.tsv, r3b.tsv, r4off.tsv.

## Two-vowel notes, no-syllable notes, empty sung notes
The scorer prints (a), (b), (c) only. From the reader's own per-page counter "note(s) breaking one vowel per note over the sung notes" (summed over pages, with its "with no syllable" parenthesis), the totals per song 1..5 are: control 33,45,144,13,27; run 2 44,43,247,12,33; run 3 44,42,247,12,33; run 4 30,41,107,12,25. These are the reader's counts, not the scorer's, and I did not separate "two-vowel" from "no syllable" from "empty sung": NOT ESTABLISHED as the brief asks for them.

## Console counts

Extender tokens (arm a, run 2; summed over pages; underscore / hyphen / long-dash / notes marked under an extender):
song 1: 0 / 25 / 47 / 17. song 2: 0 / 39 / 45 / 11. song 3: 0 / 34 / 86 / 100 (99 of the notes on one page, page 6, from 27 long-dash tokens and 3 hyphens: suspicious, a single system flood; NOT investigated). song 4: 0 / 41 / 42 / 11. song 5: 0 / 56 / 44 / 12.
Totals run 2: 0 underscore, 195 hyphen, 264 long-dash, 151 notes marked (arm a).
Arm b (run 3): same token counts; notes marked song 1 17, song 2 13, song 3 100, song 4 11, song 5 12 = 153 (arm a 151; the two extra are in song 2 pages 2 and 4).
Control has no extender line (tree predates it). Underscores: zero in every song and arm.

Ink bands (run 2, 72 bands; run 3 identical): written (w) 69, not written (u) 3.
- w ink share: min 0.0109, quartiles 0.0336 / 0.0463 / 0.0584, max 0.1386. w text lines: min 53, quartiles 102.5 / 128 / 155, max 363.
- u ink share: 0.0164, 0.0255, 0.0345 (n=3; song 4, song 3, song 3). u text lines: 39, 57, 120.
- Best threshold: ink share at or below 0.0164 catches 1 of 3 u bands and wrongly takes 1 of 69 w bands (3 misclassified in all); text lines at or below 39 catches 1 of 3 u, misclassifies 0 of 69 w (2 misclassified in all). With three u bands the two distributions overlap entirely; no threshold separates them, and 3 is too few to fit one. Say so.

Second look (run 2; looked at again: 8 systems over 8 page-lines, tries up to four: down, up, wide, stretch):
- Seconds added per page (the console's total per looked-at page): song 1 p2 3.3 s; song 2 p? 3.5 s; song 3 6.5, 9.6, 4.3, 9.4 s; song 4 2.8 s; song 5 3.1, 2.1 s. Sum by song: s1 3.3, s2 3.5, s3 29.8, s4 2.8, s5 5.2 (about 45 s over the five songs, against reads of 270 to 420 s per song).
- Per-try detail (seconds, Russian or not, words, kept) is in cap/r2a/sN/*.console.txt on the "second look:" lines; an example: song 1 p2 system 1 down 0.262 s not Russian, up 0.350 s not Russian, wide 0.995 s Russian 1 word kept, stretch 0.316 s not Russian. Tries that found Russian and were kept: 11 systems across the run; a try that is Russian but not kept occurs (up, wide).
- Looks off (run 4) removes these and loses 16 seats, all of which the looks win back (see above).

Step 3, `?strips=measure` (run 5, song 1 only, branch; first attempt printed nothing because the harness closed the page too early; re-run with the join wait): page 1 render 1198 ms, page 2 render 1879 ms (an upper bound: pages 1 to n rendered); 8 strips cut, all written (w), 4400 px wide, 112 to 215 px high, 173,040 to 242,119 bytes each, 216 to 254 ms each; bytes (b) unread systems only: none, 0 B; (c) every system: page 1 842,669 B, page 2 820,347 B, song 1,663,016 B. One song only; other songs NOT ESTABLISHED.

## The join (run 2 and run 3, branch)
Console lines, run 2: song 1 no join line within 20 s (no library text, as the brief says). Song 2, 4 and 5: "the transcription of Lyrics does not line up with its words, so nothing is joined". Song 3: "1 repaired, 0 filled, 5 kept as the composer's, 9 offered (count, unanchored, repeat), 5 run(s) of notes with no word, 0 syllable(s) not placed, 0 dropped by the one-vowel check, 0 fault(s) on the second pass". Run 3 identical. The library filled POEM without a card in all four songs; no card was accepted by hand.
So the join did anything in song 3 only. Evidence of what changed (page's pairings in IndexedDB against the page's MusicXML, run 2 song 3): the pairings differ at 4 places: "ті" to "ти", "тѣ" to "те", "то" to "Толь" (the Lyrics text also changes "токо" to "Только"), and "листь я" to "лис тья"; and the pairings hold 50 syllables against the MusicXML's 54 (4 dropped: "ѵѣ", "у", "ноч", "ЕруГроб"). Whether each is right against the truth I did NOT score: NOT ESTABLISHED. The third and fourth changes look like corrections by the poem text; the first two read as modernising spelling and may count as wrong against a truth that prints the old spelling: NOT ESTABLISHED.

Amendment 20 and the scoring artefact: score114.py reads only the MusicXML the page ingests, which the join does not rewrite, so it cannot see the join. I rebuilt a MusicXML from the post-join pairings (score/pair2xml.py) and scored it (scoreout/r2a-join.tsv: 169 of 590). That figure is NOT a valid comparison: the pairings' note ids (measure and position) do not match the MusicXML's for most of songs 1, 3, 4, 5 (ids not found: 61, 15, 53, 39 of 74, 55, 102, 99), because the pairings use the page's own measure numbering, offset from the MusicXML by 3 to 8 measures; song 2 matched fully (149 seated, 0 missing) and scores 99 against 109 page MusicXML, but the join did nothing in song 2 so that gap is the pairings' coverage, not the join. A control re-taken from the same artefact is not possible (the control capture has no songs.json; the harness was built for the branch). Therefore the join's effect on exact seats is NOT ESTABLISHED. The only certain statement: the join fired once in five songs.

## What could not be established
- Run-to-run variance (each arm run once).
- Which of steps 1, 3, or other branch changes causes the 53-seat loss against the control (looks off still loses 53).
- The join's effect in seats; the right/wrong of its four song-3 changes.
- Two-vowel / no-syllable / empty-note counts as the scorer defines them.
- Step 3 bytes on songs 2 to 5.
- Ink-band threshold (3 u bands only).
- Not inspected: the page-6 song 3 flood of 99 extender-marked notes.

Files: /home/claude/m181/work/cap/{r1ctl,r2a,r3b,r4off,r5strips}, scoreout/*.tsv, progress at /home/claude/m181/progress.txt. Nothing kept in any repository; nothing pushed; row 114's second file never opened.
