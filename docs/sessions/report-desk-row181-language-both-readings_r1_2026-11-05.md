# Report: row 181, the Russian test on both readings of a row (arm L), row 114 file 1 (Sonnet helper, r1, 2026-11-05)

Measure only. Nothing committed or pushed. Written only under /root/c181/. One capture per arm per song, headless Chromium, `?words=read`, first file only (590 printed syllables). Resumed on 2026-11-08 after a limit reset; the captures were intact, nothing was re-run.

## 1. Answer

Arm L did NOT recover song 5 page 21 system 3. (b) is 376 of 590, identical to the tip, syllable by syllable. The desk's expectation (388) is not met; song 2 stays at 139 and no seat is lost anywhere.

| (b) exact, of 590 | s1 (81) | s2 (189) | s3 (68) | s4 (121) | s5 (131) | total |
|---|---|---|---|---|---|---|
| arm L, tree `/root/c181/trees/L`, `/root/c181/ledger-L.tsv` | 48 | 139 | 33 | 82 | 74 | 376 |
| tip `05db2dac`, `/root/c181/prev/ledger-tip.tsv` (not re-run) | 48 | 139 | 33 | 82 | 74 | 376 |
| arm S, `/root/c181/prev/ledger-armS.tsv` (not re-run) | 48 | 136 | 33 | 82 | 86 | 385 |

(a) nucleus: L 54, 146, 39, 91, 86 = 416; tip 416; S 425. (c) word-exact: L 5, 38, 12, 27, 17 = 99; tip 99; S 126 (10, 42, 13, 34, 27).

Per-syllable (b) diff: L against `ledger-tip.tsv`, 0 differences in 590. L against `ledger-armS.tsv`, 15: song 5 page 21 system 3 (12 syllables, L 0, S 1) and song 2 page 3 system 1 (3 syllables, L 1, S 0). Same 15 as arm D.

## 2. Control

Build without `?lang=both` (tree L, label ctlL, `/root/c181/work/cap/ctlL/s2`, `s5`), scored with `/root/c181/work/score114_c181.py`: song 2 = 139, song 5 = 74. Matches. Gate passed.

## 3. Callers of `rowLanguage` in the scan path (tree L, files read)

- `underlay-page.ts:279` (the rescue gate: no row Russian, so try `fallbackRow`). Left unchanged.
- `underlay-page.ts:286` (the seat decision: a row that is not the rescue row and not Russian is skipped, `continue`). This is the one that decides whether a row's words are seated. Arm L applies the rule here only, as `isRussianRow` = sewn passes OR split passes; seating still uses the sewn tokens.
- `underlay-fallback.ts:64` (`fallbackRow`, over dictionary-sewn words; only reached from :279). Unchanged.
- `underlay-choose.ts:32` (`scoreLook`, picks the second look to keep for a system that gave no Russian row). Unchanged.
So four call sites, one decides seating. Because :279 is unchanged, a system whose only Russian row passes on its split reading alone is still sent to the rescue path first; that is as the brief stated, not tested further.

## 4. Why no gain: the split reading of page 21 system 3 row 4 is the sewn reading

Console of the L capture, `/root/c181/work/cap/L/s5/song5.console.txt` (line at 395.3 s): row 4 sewn «Едушу», «невин», «ную», «теплоп», «заот», «уш», language other; the split reading (every `longDash` joint made an empty mark) is the same six words, language other. The junction log of arm D (`/root/c181/junctions-D.tsv`, song 5 page 21 system 3 row 4) shows the row has exactly one token flagged `longDash`, the last one, with nothing to its right. So in this build there is no long dash inside those words to split. The brief's premise (that arm S's words «душу», «не», «вин», «теплой» come from splitting long dashes of this row) does not hold for the `longDash` flag as the tip sets it (`underlay-tokens.ts:50`). Arm S's tree is not in `/root/c181/trees/`, and its patch (`/root/c181/prev/patch.py`) is the b0 patch, not the S split, so I could not read what arm S did differently (its letters differ: «душу» not «Едушу», «теплой» not «теплоп»). NOT ESTABLISHED: what arm S changes in this row.

## 5. Rows whose Russian call changed (from `[c181L]` console lines, distinct rows)

Both readings are logged for every row. Calls that differ, all in songs 2, 3, 5 (song 1 and 4: none):

Pass only on the split reading (L turns other into Russian):
- Song 2 system 1 row 2: sewn «і», «а», «цш», «тэъѣѣ» (other); split «і», «а», «цш», «тэъ», «ѣѣ» (Russian).
- Song 3 system 3 row 8: sewn «а:»сП» (other); split «а:»с», «П» (Russian).
- Song 3 system 5 row 11: sewn «иій» (other); split «иі», «й» (Russian).
These three are junk (garbled letters), the failure the desk expected. None seated anything new: (b), (a) and (c) are identical to the tip, and the lyric tags of all five captures match arm D's (`<lyric>` elements compared). In each, a sibling row of the system was Russian on the sewn reading (song 2 s1 rows 2/3 and others; song 3 s3 row 5/7 Russian; song 3 s5 row 10 Russian), and the first Russian row seats (`if (seated) continue`), so the new passes were not reached. This is read from the console and the scores, not from a seating trace: NOT ESTABLISHED as the cause for each.

Pass only on the sewn reading (the split reading fails; L keeps them Russian, same as the tip): song 2 s2 row 3 «іІ»; song 2 s3 row 6; song 3 s1 row 1; song 3 s3 row 7; song 5 s1 row 1 «тІ»; song 5 s2 row 3; song 5 s3 row 5 «ѣѣ». No change from the tip.

## 6. What I could not establish

- What arm S does that gets «душу», «не», «вин» on page 21 system 3 (see 4).
- Run-to-run variation (one capture per arm); the three-capture determinism was not re-run.
- Whether applying the rule also at `underlay-page.ts:279` would change anything; not tried.
- The `<syllabic>` flags in the L captures differ from the arm D captures on a few notes (songs 1 to 4), lyric text identical; not analysed (L has no D patch). Scores equal the tip.
- Token total: NOT MEASURED (no counter visible); under the 120,000 limit by estimate.

Files: tree `/root/c181/trees/L` (worktree on `05db2dac`, uncommitted patch: `underlay-page.ts`, `underlay-tokens.ts`, `underlay-switch.ts`, `underlay-client.ts`, `underlay-reader.ts`), captures `/root/c181/work/cap/L/s1..s5`, `/root/c181/work/cap/ctlL/s2,s5`, ledger `/root/c181/ledger-L.tsv`, runner `/root/c181/work/runarm-L.sh`.
