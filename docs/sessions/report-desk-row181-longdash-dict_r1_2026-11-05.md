# Report: row 181, long dash decided by the dictionary (arm D), row 114 file 1 (Sonnet helper, r1, 2026-11-05)

Measure only. Nothing committed or pushed. Written only under /root/c181/. The second Mussorgsky file was not opened. One capture per arm per song, headless Chromium 153, `?words=read`, homr on wasm, first file only (590 printed syllables).

## 1. Answer

The rule does NOT keep arm S's seats. Arm D (tree `/root/c181/trees/D`, tip `05db2dac` plus the `?longdash=dict` patch, captures `/root/c181/work/cap/D/s1..s5`) scored exact seats (b) **376 of 590**, the same as the tip's 376 and 9 below arm S's 385. Per-syllable it is identical to the tip: 0 syllables differ.

| (b) exact, of 590 | s1 (81) | s2 (189) | s3 (68) | s4 (121) | s5 (131) | total |
|---|---|---|---|---|---|---|
| arm D, `/root/c181/ledger-D.tsv` | 48 | 139 | 33 | 82 | 74 | 376 |
| tip, `prev/ledger-tip.tsv` (not re-run) | 48 | 139 | 33 | 82 | 74 | 376 |
| arm S, `prev/ledger-armS.tsv` (not re-run) | 48 | 136 | 33 | 82 | 86 | 385 |

(a) nucleus: D 54, 146, 39, 91, 86 = 416; tip 416; S 425. (c) word-exact: D 7, 40, 12, 29, 17 = 105; tip 99 (5, 38, 12, 27, 17); S 126 (10, 42, 13, 34, 27). So D gains 6 in (c) on songs 1, 2, 4 over the tip and loses nothing in (b).

Desk's expectation (>= 385, song 5 at 86, song 2 at 139): song 2 at 139 met, song 5 at 74 missed (so total 376).

## 2. Per-syllable (b) diff

- D against tip: 0 differences in 590 rows.
- D against arm S: 15 differences, all the two known systems. Song 5 page 21 system 3, 12 syllables (D 0, S 1; ду шу не вин ну ю теп лой за ступ ни це). Song 2 page 3 system 1, 3 syllables (D 1, S 0; Дай те бо).
- (c) differs more widely (see section 1); the (c) rows are in `ledger-D.tsv` column c_word.

Why D equals the tip on both systems:
- Song 5 page 21 system 3, row 4: the dashes there are decided `join` / `neither` (left «уш», right empty; both non-words), `/root/c181/junctions-D.tsv`. The row's sewn words are unchanged from the tip, so `rowLanguage` still calls it other (section 4).
- Song 2 page 3 system 1: the dash on row 9 is `join`/`joined-word` (left «бо» not a word, right «і» a word, «боі» counted a word by `isWord`, which is generous with short strings). Row 12's dashes are `same-span`. All join, so the tip's sewing stands and arm S's 3 lost syllables are not lost.

## 3. Junction log

`/root/c181/junctions-D.tsv`: every long-dash decision logged by the build, columns song, page, system, row, token, left, right, left_word, right_word, joined_word, decision, why, row_seated. 275 records (not unique dashes: `seatPage` runs again after a second look and a dash can be logged once per pass; a dash shows once per `seatPage` call that read it, and consecutive identical rows are the same dash seen through successive tokens). Of the 275: join 218 (joined-word 103, neither 65, same-span 50), split 57 (all `one-side`). `same-span` is a case the brief did not name: a printed hyphen already sews `left` and `right` into one word, so there is nothing to decide; I count it as join. Only 73 of the 275 sit in a row that was actually seated (`row_seated` true: 54 join, 19 split). Words are the reader's, so most sides are garbled (ѣ, і, ъ strings); where `right` is empty the dash is the last token of its row.

I did not map the 275 records to the desk's 26 hand-classed junctions (not given to me), so I cannot say which of the desk's 17 / 9 split they hit. NOT ESTABLISHED.

Likeliest failure named in the brief is confirmed in kind: of the 19 seated split decisions, most have one side garbled («чт», «зеш», «чеи», «ют»), and the 54 seated joins are mostly `joined-word` with a garbled or very short side.

## 4. Song 5 page 21 system 3 on the tip: cause

ESTABLISHED, from the console of a control run on the tip path (worktree D build without `?longdash=dict`, label R0, `/root/c181/work/cap/R0/s5/song5.console.txt`, line at 402.7 s, system 3 row 4): the reader's sewn words are «Едушу», «невин», «ную», «теплоп», «заот», «уш». The dictionary knows 0 of the 6, so `rowLanguage` returns `other` (needs known >= 0.3 x counted, `underlay-language.ts:33,56-65`), the row is skipped (`underlay-page.ts:276`), and the system seats nothing: 0 of its 12 syllables. Rescue did not apply (the other row of the system, row 5, is «ѣѣ» and is Russian). The desk's lead is therefore right. Arm S splits at every long dash, giving душу, не, вин, ну, ю, теп, лой, за, ступ, ни, це as separate words, which pass the test.

Build note: for this diagnostic I added one `console.info` line per row to `underlay-page.ts` in the worktree and rebuilt (a measure aid only; no behaviour change), and ran song 5 twice (R0 plain, R1 with `?longdash=dict`). R1's rows for page 21 system 3 are identical to R0's (row 4 still 0 of 6 known), consistent with arm D = tip.

## 5. Control; what I could not establish; cost

Control: the build without `?longdash=dict`, label `ctl` (`cap/ctl/s2`, `cap/ctl/s5`), scored with `score114_c181.py` (scorer reused from the 2026-11-05 night measure, imports `/root/m0/unpacked/desk-n135-a2-lean_2026-10-28/a2/scorer` in place): song 2 = 139, song 5 = 74. Matches the tip exactly. One capture each; the three-capture determinism was not re-run here. The page cuts were made with `qpdf`: pages 1-2 song 1, 3-6 song 2, 7-12 song 3, 13-17 song 4, 18-21 song 5 of the first file; songs 1 to 4 sizes match `run-2026-10-19/songs/song1..4.pdf` byte for byte.

Not established:
- Mapping to the desk's 26 hand-classed junctions.
- Whether a stricter rule (for example, split only when both sides are dictionary words of at least 3 letters) would recover arm S's page 21 gain: not tried (measure only the brief's rule).
- Run-to-run variation (one capture per arm).
- The R0/R1 console build differs from the D build by one log line; ledgers from R0/R1 were not scored.

Files: `/root/c181/ledger-D.tsv`, `/root/c181/junctions-D.tsv`, patch in the worktree `/root/c181/trees/D` (uncommitted), scorer and driver in `/root/c181/work/`.

Token total: NOT MEASURED by me (no counter visible); I estimate well under the 180,000 limit.
