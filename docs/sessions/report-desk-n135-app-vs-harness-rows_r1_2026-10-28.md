# Report: why the app reads B01 and B04 worse than the harness (helper, 2026-10-28, r1)

Measure only. Nothing was committed or pushed, no artifact was published. Code under test: `/root/lane19`, branch `cloud-lane-19`, head `383187a`. One measurement-only edit was made in the clone (section 8) and restored; `git status` shows only the untracked `apps/web/omr-underlay/` that was already there.

## The answer first

1. **The app's rows are not the reason the words read worse. Its row boxes, framing and recognition give the harness's numbers.** Scored with the harness's own scorer (`score117.py`, row by row) on the harness's Russian rows, the app's readings give B01 133 of 147 and B04 122 of 148. The harness's `f6-h32-B` readings give 133 and 122. The recogniser is the same: 77 of 77 app-framed rows read through my harness-style reader gave the app's words exactly.
2. **What costs B04 its syllables is the call "is this row Russian?"** (`rowLanguage`, fed by `splitTokens`). Of the 11 real text rows in B04 the app calls 7 Russian. The four it calls "other" are read as well as the harness reads them. As built, B04 reads right 50 of 148 with the gate off (the number in the real-page report), against 122 for the harness. Here is where the 72 go:
   - **Lone hyphens read as marks: 46 syllables** (50 to 96 when the width rule is raised to 0.75 or 1.0 of the ink height). Three real rows (p1 s2, p2 s4, p3 s2) are called "other"; in p3 s2 a piano-area row is then seated in the real row's place.
   - **One row that stays "other" after that fix, p2 s3: 18 syllables** (96 to 114 at a Russian share of 0.3, or with the right rows given).
   - **Seating after the right rows: 8 syllables** (114 against 122). Not traced to individual notes.
   - **Framing and recognition: 0.** Row-cut and scoring method: 0 to 1.
3. **The opening of B04's Lyrics field is the first cause in the flesh.** `Когла на люго,у тратът…` is the first Russian-called row of system 1 (`Когла на`) followed by the first row of system 3. System 2 (`суд безмолвных тайных дум я вызываю голоса…`) is read, and read about as well as the harness reads it (14 of 16 syllables), but it is called "other" so no word of it reaches the field.
4. **B01 does not lose syllables.** App 132 (song level, gate on or off), harness 133. All 12 text rows are called Russian. The doubled row count (36 against 18) is real and has a cause (section 5), and it costs B01 nothing.
5. **Why the app has about twice the rows: the band runs too far.** `lyricBand` ends the band at the top of the next staff homr gave a box for. homr gave 8 staves a page on all six pages here, with the piano's upper staff missing from 8 of 12 systems in B01 and all 11 in B04. The band then takes in the piano staff, and `cutRows` cuts its ink into rows. Of the 35 rows only the app has (18 in B01, 17 in B04), 31 start at or below the harness's band end. 30 of the 35 are called "other"; 5 are called Russian (1 in B01, 4 in B04), and one of those (B04 p3 s2) is seated.
6. **The 5-song gap (446 against 470) is not explained by this study.** B01 explains 1 of the 24. The other songs were not examined.

## 1. Controls

Written before any run: `controls-before-measure.md` (written 2026-10-28T19:21:11Z, before any run). It said: the app's extra rows would be non-Russian and cost few syllables, the loss would come from the paired Russian rows, framing would match within rounding, recognition would match on identical pixels. Likeliest failure named: the app's row boxes differ from `rows2/` (the paper tone is taken from the band, not the page), so the crops differ.

Outcome against the expectation:

- **Extra rows non-Russian and nearly free: held** (5 of 35 called Russian, 1 seated; section 5).
- **Loss from the paired Russian rows: failed.** The paired Russian rows read the same as the harness's. The loss comes from the language call on them.
- **Framing within rounding: held in the large, with noise.** Same angle on every same-box pair; 23 same-size same-box pairs differ by a median 0.54 grey levels (mean absolute; largest pair 1.63). One to three letters flip per row, in both directions, net zero syllables.
- **Recognition identical on identical pixels: held** (77 of 77 rows).
- **The named likeliest failure (different boxes from different paper tone): not the cause.** 27 of 42 harness rows have an app box within 2 px at both ends; 12 of the other 15 differ because the app box runs longer (section 4), and 3 text rows differ at the top by 3 to 11 px. Their readings still score as the harness's do.

Positive controls, each run before it was used:

| control | result |
|---|---|
| My harness-framing port (`tools/hframe.py`, steps of `clean.py`: deskew, close 3, height 32, pad 16:0) plus my reader (`tools/read-dir.mjs`) against the stored `ocr2-f6-h32-B` readings of B01 and B04 | 42 of 42 rows identical text |
| `score117.py` on the stored harness readings, through my wrapper (`tools/score_h.py`) | B01 133, B04 122, the figures in `logs/f-h32-B-b9.txt` |
| My reader on the app's own 77 framed rows against the words the app read | 77 of 77 identical |
| My offline row cutting (`tools/replay.mjs`: `staffIn`, `systemsOf`, `cutRows` on the captured page, MusicXML and staff boxes) against the rows the app cut | row boxes equal on all 6 pages (6 of 6) |
| My offline language call (`tools/langcheck.mjs`, the build's dictionary files) against the app's own calls | 77 of 77 |
| My replay of `seatPage` (`tools/seatvar.mjs`, variant `app`) against the real `seatPage` on the captured reads | lyric streams equal on all 6 pages; seated counts 61, 43, 42 and 33, 35, 26 equal the console lines |
| The real-page report's read right for these songs, rebuilt by my replay and the report's `readright_streams` | B01 132 (report 132), B04 50 (report 50, gate off) |
| Song-level against row-level scoring on the harness's own B04 reading | 121 against 122; B01 133 against 133 |

## 2. How the app's side was captured

A measurement-only edit to `underlay-reader.ts` (section 8) printed one `[diag]` line per page: the page image (the PNG the Worker was given), homr's MusicXML, homr's staff boxes, the layout, every framed row as a PNG, tesseract's word boxes, and the app's own language call and sewn words per row. The built app and `measure.mjs` ran B01 and B04 as in the real-page report (same PDFs, Chromium 153, `vite preview`). The captured run reproduced the earlier run's row counts exactly (B01 11, 13, 12; B04 15, 14, 12) and its console numbers. The page raster is 4,400 by 6,222, the harness's 400 dpi. Everything after that ran offline on the dump, without homr.

The model in the clone is `rus_prereform_r2_29000.traineddata`, md5 `2ff2af3e33461cd64e7d2015ef21d10d`, the harness's md5; the core is `tesseract-core-simd-lstm.wasm.js`, tesseract.js 7.0.0 in both.

## 3. Setting differences between the app and the harness, from the code

| step | harness (`clean.py`, `read-dfloat-chrome.mjs`) | app | measured effect |
|---|---|---|---|
| page raster | 400 dpi grey | 400 dpi grey (`rasterizePdf`) | none |
| staves | its own line finder in a 500 px window at the notes' median column (`rowsys.py`) | homr's staff boxes, then `staffIn` (`underlay-prepare.ts:96`) | band end differs (section 5) |
| band end | next staff found minus 1.5 spaces | next staff homr boxed minus 1.5 spaces, else 20 spaces (`underlay-band.ts:98-99`) | the doubled rows |
| paper tone for ink | median of a grid over the page | median of a grid over the band (`underlay-rows.ts:paperOf`, no `paper` passed) | boxes agree within 2 px at both ends on 27 of 42 rows; of the other 15, 12 differ at the lower end (the app box runs on into the piano) and 3 differ at the top end by 3 to 11 px on text rows (B01 p1 s3 r1, B04 p2 s3 r1, B04 p3 s2 r1); the cause of those 3 was not tested |
| row rule | R1 then R2 valley split | same constants (`underlay-rows.ts`) | none on paired text rows |
| deskew angle | sweep, ink < 128, cv2 rotation, border 255 | same sweep (`underlay-frame.ts:skewAngle`), border = paper tone | same angle on all same-box pairs |
| closing | 3 by 3 | `closingKernel` gives 3 at a staff space of 31 | none |
| scale | cv2 `INTER_CUBIC` to ink height 32 | bicubic port (`resizeCubic`), floor of 0.4 staff space | 4 of 27 same-box pairs differ in width by 1.5 percent or less; not traced |
| padding | 16 top and bottom, 0 left and right, white 255 | 16 on every side, paper tone (`padAll`) | none shown: harness crops re-framed with the app's padding and fill read the same as the harness's (`h-framed2`) |
| binarisation | none | none | none |
| tesseract | PSM 7, `preserve_interword_spaces 1`, simd-lstm core | same (`underlay-recognize.ts:65`, `:89`) | none |
| row choice | oracle: the harness's labels say which rows are Russian | `rowLanguage` per row, first Russian row seated per system (`underlay-page.ts:152`, `:160`) | the whole B04 loss |

The last row is the one that matters. The harness's read-right figure is computed on rows chosen by labels; the app has to choose the rows itself.

## 4. Per-row comparison

Row level: the harness's `rows2/` rows against the app rows by overlap on the page's y axis. Boxes are page pixels (y, 400 dpi). "read-right" is the row's count of printed syllables read right by `score117.py` on the harness reading and on the app reading, for rows the harness labels Russian. "app language" is the app's own call. Text is cut to 58 characters and dashes are written as hyphens.

All 42 harness rows have an app row with an overlap; no app row covers two harness rows. The app has 36 rows for B01 (11, 13, 12) and 41 for B04 (15, 14, 12).

### B01: rows the harness has, paired with the app row of greatest overlap

| harness row | label | harness box (y) | app id | app box (y) | dy0 / dy1 | angle h / a | read-right h / a (row level) | app language | harness reading (f6-h32-B) | app reading |
|---|---|---|---|---|---|---|---|---|---|---|
| p1s1r1 | russian | 1261-1319 | 0 | 1262-1319 | 1 / 0 | 0.2 / 0.2 | 10 / 9 | russian | Те - бе ль ме ня при - дет . ся хо-ро- | І Те - бе ль ме ня при - дет . ся хо.ро- |
| p1s2r1 | russian | 2391-2458 | 1 | 2391-2458 | 0 / 0 | 0.1 / 0.1 | 14 / 14 | russian | - нить, иль мне те . бя, - не зна - юо, друг мой ми лый. Н | - нить, иль мне те . бя, - не зна - ю, друг мой ми ль:й. Н |
| p1s2r2 | other | 2513-2549 | 2 | 2513-2574 | 0 / 25 | 0.0 / 0.4 | n/a | other |  А ѣ - " - » і - . |  А » -- ѣ? -а » / з і -. |
| p1s3r1 | russian | 3542-3612 | 5 | 3545-3612 | 3 / 0 | 0.3 / 0.3 | 18 / 18 | russian | - бы тво-ей пре - рвет - ся нить, твой об - раз не ис .чез | - бы тво-ей пре - рвет - ся нить, твой об - раз не ис -чез |
| p1s3r2 | other | 3606-3646 | 6 | 3606-3646 | 0 / 0 | -0.2 / -0.2 | n/a | other |  А - - (ѣоѳ?. ) |  А - - (ѣѳѳт, ) |
| p1s4r1 | russian | 4789-4857 | 7 | 4789-4857 | 0 / 0 | 0.2 / 0.2 | 17 / 16 | russian | Тъх со - хра . нишь и жизнь, и кра.со - ту, а от ме - ня н | Тът со - хра . нишъ и жизнь, и кра.со - Тту, а от ме . ня  |
| p2s1r1 | russian | 456-521 | 0 | 458-521 | 2 / 0 | 0.2 / 0.2 | 12 / 11 | russian | / - нит - ся. На клад - би.ще по . кой я об.ре - ту, |  - Нит - ся. На клад - би.ще по - кой я об.»е - ту, |
| p2s2r1 | russian | 1834-1892 | 3 | 1834-1892 | 0 / 0 | 0.0 / 0 | 10 / 10 | russian | а твой при .- ют - от - кры - та . я гроб - ни - | а твой при - ют - от - кры - та . я гроб - ни - |
| p2s3r1 | russian | 3226-3283 | 6 | 3226-3283 | 0 / 0 | 0.0 / 0 | 10 / 10 | russian | - ца. Твой па - мят.ник -вос - тор - жен - ный мой | - ца. Твой па - мят.ник -вос - тор - жен - ный мой |
| p2s3r2 | other | 3372-3409 | 7 | 3372-3820 | 0 / 411 | 0.0 / 0 | n/a | other |  А - - .- ? - ай " А | зѳе --е- |
| p2s4r1 | russian | 4537-4597 | 8 | 4537-4597 | 0 / 0 | 0.0 / 0 | 9 / 10 | russian | стих. Кто не рож . ден е - ще, е .то у - сельт -. | стих. Кто не рож .- ден е - ще, е .-го у - ельт -. |
| p2s4r2 | other | 4590-4623 | 9 | 4590-4623 | 0 / 0 | 0.2 / 0.2 | n/a | other | і «а "" - . т ------ - --- . | і - е " - -- - - -- -- |
| p3s1r1 | russian | 497-562 | 0 | 497-562 | 0 / 0 | 0.2 / 0.2 | 12 / 12 | russian | - шит. И мир по - вто-рит по - весть дней тво - их, ко-тда | - шит. И мир по - вто-рит по . весть дней тво - их, ко тда |
| p3s2r1 | russian | 1744-1802 | 1 | 1744-1802 | 0 / 0 | 0.0 / 0 | 8 / 11 | russian |  - рут все те, кто ньгне ды - шит. тТы бу - дешь | - рут все те, кто ны-не ды - шит. Ты бу „ дешь |
| p3s3r1 | russian | 3049-3109 | 2 | 3049-3109 | 0 / 0 | 0.1 / 0.1 | 9 / 9 | russian | жить, зем - ной по - ки.нув прах, там , тде жи - | жить, зем - ной по - ки.нув прах, там , тде жи - |
| p3s4r1 | russian | 4414-4471 | 7 | 4414-4471 | 0 / 0 | 0.1 / 0.1 | 4 / 3 | russian |  - вет ДьЬ - ха - нье, -- на у - ста х | - вет дъ - ха - нье , -- на у - стах |
| p3s4r2 | other | 4551-4593 | 8 | 4551-4593 | 0 / 0 | -0.5 / -0.5 | n/a | other | - " ----- і ѵ | ма " ---- і ѵ |
| p3s4r3 | other | 4615-4661 | 9 | 4615-4921 | 0 / 260 | 0.0 / 0 | n/a | other | І А ..- ѵ з ж ег а . - - з= |  |

### B01: rows only the app has

| page | system | app id | box (y) | height | scale | language | where the box lies | reading |
|---|---|---|---|---|---|---|---|---|
| 1 | 2 | 3 | 2555-2824 | 269 | 0.137 | other | below the harness band end (y1 2540) | -------- --- - --- |
| 1 | 2 | 4 | 2805-2852 | 47 | 0.681 | russian | below the harness band end (y1 2540) | ѵІ Т І - --  -- -- .Іа --- -- " -----"  І ----  |
| 1 | 4 | 8 | 4904-4956 | 52 | 0.821 | other | below the harness band end (y1 4888) | „---------- ------------ - ------- -------- ---- ----- - - |
| 1 | 4 | 9 | 4937-5148 | 211 | 0.18 | other | below the harness band end (y1 4888) | ---- --- -- |
| 1 | 4 | 10 | 5136-5218 | 82 | 0.405 | other | below the harness band end (y1 4888) | ѵ т сопті , ѣу і„ . ; . / . |
| 2 | 1 | 1 | 593-968 | 375 | 0.1 | other | below the harness band end (y1 561) | . |
| 2 | 1 | 2 | 980-1040 | 60 | 0.593 | other | below the harness band end (y1 561) | д  І - -; / росо а росо сѵбѣс. |
| 2 | 2 | 4 | 2004-2362 | 358 | 0.115 | other | inside the harness band (y 1820-2016) | --- |
| 2 | 2 | 5 | 2345-2417 | 72 | 0.478 | other | below the harness band end (y1 2016) | «   . - ----------- І » - » |
| 2 | 4 | 10 | 4638-4934 | 296 | 0.139 | other | inside the harness band (y 4522-4651) |  |
| 2 | 4 | 11 | 4915-5012 | 97 | 0.344 | other | below the harness band end (y1 4651) | а -. --   - Іѣ -- - . |
| 2 | 4 | 12 | 4994-5054 | 60 | 0.533 | other | below the harness band end (y1 4651) | н ѣ "-, Ћ т--  - І- -Г " / Ез - |
| 3 | 3 | 3 | 3210-3260 | 50 | 0.821 | other | below the harness band end (y1 3178) | и-ятт --от - т тп т- -- -- |
| 3 | 3 | 4 | 3241-3523 | 282 | 0.127 | other | below the harness band end (y1 3178) | е а) о- |
| 3 | 3 | 5 | 3504-3591 | 87 | 0.444 | other | below the harness band end (y1 3178) | «і --т- і -- -- - -- х / ------ -  |
| 3 | 3 | 6 | 3572-3626 | 54 | 0.593 | other | below the harness band end (y1 3178) | ѣ А  ---  / і ».. . |
| 3 | 4 | 10 | 4906-4967 | 61 | 0.627 | other | below the harness band end (y1 4652) | ( . ---- ---г . - --=-  - "-  |
| 3 | 4 | 11 | 4948-5027 | 79 | 0.421 | other | below the harness band end (y1 4652) | ми " - - -- -- - ------Т іѣ хе»  |

### B04: rows the harness has, paired with the app row of greatest overlap

| harness row | label | harness box (y) | app id | app box (y) | dy0 / dy1 | angle h / a | read-right h / a (row level) | app language | harness reading (f6-h32-B) | app reading |
|---|---|---|---|---|---|---|---|---|---|---|
| p1s1r1 | russian | 1038-1091 | 0 | 1040-1091 | 2 / 0 | -0.3 / -0.3 | 0 / 1 | russian | / ѣ , , . . Ко-гла ва | / ь . . . Ко-гла на |
| p1s1r2 | other | 1082-1116 | 1 | 1082-1116 | 0 / 0 | 0.0 / 0 | n/a | other |  |  |
| p1s2r1 | russian | 2175-2245 | 3 | 2175-2245 | 0 / 0 | -0.3 / -0.3 | 14 / 14 | other | суд без.молв.ных,тай ньъъх дум я вы -зы - ва - ю го - ло - | суд без.молв.ных,тай нътх дум я вы -зы - ва - ю го - ло -  |
| p1s2r2 | notext | 2272-2368 | 4 | 2272-2593 | 0 / 225 | 0.0 / -0.2 | n/a | other | - - - ч іІ з з ) ѣ » з э " і м»з і » |  |
| p1s3r1 | russian | 3327-3398 | 5 | 3327-3398 | 0 / 0 | -0.1 / -0.1 | 11 / 12 | russian | - лю - го,- - у - тра -тът вое при - хо- д'ят мне на ум, и | - лю - го,- " у - тра -тът все при - хо- д'ят мне на ум, и |
| p1s3r2 | notext | 3441-3535 | 6 | 3441-3574 | 0 / 39 | 0.0 / 0 | n/a | russian | - і » »: » « і З « А ) - ) і » | з а » да д о а а о»а оа ат а а |
| p1s4r1 | russian | 4602-4662 | 11 | 4602-4662 | 0 / 0 | 0.0 / 0 | 13 / 12 | russian | - ю я бо-ле . ю сно - ва.. - Из глаз ,не знав.ших слез, я | - Юю я боѳ.ле - ю сно - ва. - Из глаз ,не знав-ших слез, я |
| p1s4r2 | notext | 4695-4786 | 12 | 4695-5035 | 0 / 249 | 0.0 / 0.1 | n/a | other | Т і лАяѵ І ѣ ч З »ѣ ) -і » | еѣ-ѣ-ѣрѣб--те- |
| p2s1r1 | russian | 472-536 | 0 | 472-536 | 0 / 0 | -0.2 / -0.2 | 16 / 16 | russian | сле зъз лью о тех, ко . го во тьме та .ит мо - ги - ла, и  | сле.-зъ: лью о тех, ко . го во тьме та .ит мо - ги - ла, и |
| p2s1r2 | other | 600-635 | 1 | 600-999 | 0 / 364 | 0.0 / -0.1 | n/a | other |  а . ѣ ж# . |  |
| p2s2r1 | russian | 1760-1825 | 2 | 1762-1825 | 2 / 0 | -0.2 / -0.2 | 18 / 18 | russian | . - бовъ по - гиб.шу - ю сво . ю и все,что в жиз ни мне ка | . - бовъ по - гиб-шу - ю сво . ю и все,что в жиз ни мне ка |
| p2s2r2 | other | 1898-1938 | 3 | 1898-1938 | 0 / 0 | -0.7 / -0.7 | n/a | other | " --- : --------- . - | " --- : --------- . - |
| p2s2r3 | other | 1928-1975 | 4 | 1928-2318 | 0 / 343 | 0.0 / -0.1 | n/a | other | І а . - - .... . - --- | --------- ----- |
| p2s3r1 | russian | 3068-3142 | 6 | 3079-3142 | 11 / 0 | 0.0 / 0 | 8 / 10 | other | . Ве . ду ѣ счет пѣ - тё. рян -нб.му мной .и ѵ(. жа. са -  | - Ве - ду а счет - по - те .рян но.му мно й . и у - жа - с |
| p2s3r2 | other | 3242-3288 | 7 | 3242-3314 | 0 / 26 | 0.0 / 0.1 | n/a | other | о ѳѵ о -о Ф& о о» ѳѵ о о»ю » ѣ» о » » а о» -- | -е -- -е - -Р - -- -- -- - --- -- --- -е -. -е- |
| p2s4r1 | russian | 4370-4430 | 11 | 4370-4430 | 0 / 0 | 0.1 / 0.1 | 14 / 14 | other |  вновь по.те. ре каж - дой, и вно вь пла чу я до -ро - го |  вновь по.те. ре каж - дой, и вно вь пла чу я до -ро - го |
| p2s4r2 | other | 4535-4582 | 12 | 4535-4884 | 0 / 302 | 0.0 / 0.1 | n/a | other | І « ѵ е ѵе ѵ --- - - -- | -- ------ - |
| p3s1r1 | russian | 449-507 | 0 | 449-507 | 0 / 0 | -0.1 / -0.1 | 8 / 8 | russian | -- то, ѣа что пла-тил у -же од - наж - дъы  | -- то, ѣа что пла-тил у -же од - наж - дъ  |
| p3s1r2 | other | 598-641 | 1 | 598-974 | 0 / 333 | 0.0 / -0.1 | n/a | other | І мх» . -- -" --- -; . - - |  |
| p3s2r1 | russian | 2999-3068 | 4 | 3008-3068 | 9 / 0 | -0.2 / -0.2 | 12 / 11 | other | --  Но про - шло-е я на хо. жу в те - бе и | -- Но про - шло.е я на -хо.жу в те - бе п |
| p3s2r2 | other | 3061-3100 | 5 | 3061-3100 | 0 / 0 | 0.5 / 0.5 | n/a | other | ь-  -- - - - - - | -- / -- - -- - - - |
| p3s2r3 | other | 3092-3132 | 6 | 3092-3132 | 0 / 0 | 0.1 / 0.1 | n/a | other | - І  . - . | - І  . -- „ |
| p3s3r1 | russian | 4413-4469 | 10 | 4413-4469 | 0 / 0 | 0.0 / 0 | 8 / 6 | russian | -. / все го-тов про-стить сво.ей судъ - бе. | -. / вс е го-тов про-ст ить сво.ей судъ - бе. |
| p3s3r2 | other | 4563-4612 | 11 | 4563-4937 | 0 / 325 | 0.0 / 0.1 | n/a | other |  ІА . п а-- >а ) - і ---- - - З >- |  |

### B04: rows only the app has

| page | system | app id | box (y) | height | scale | language | where the box lies | reading |
|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 2 | 1120-1462 | 342 | 0.115 | other | inside the harness band (y 1036-1127) | -етнец-езвне-н |
| 1 | 3 | 7 | 3555-3636 | 81 | 0.432 | other | below the harness band end (y1 3526) | ‹ Ен -тѣ--т-- -- -- ------ ---- - -- -- - ---- -- - к----- |
| 1 | 3 | 8 | 3617-3685 | 68 | 0.533 | other | below the harness band end (y1 3526) | т------ - -- -------- - -- --------------- |
| 1 | 3 | 9 | 3666-3715 | 49 | 0.8 | russian | below the harness band end (y1 3526) | а вт- - о - - т-ч-- к гт тг- ---- --- -- г- т г- --- - - - |
| 1 | 3 | 10 | 3709-3742 | 33 | 0.97 | other | below the harness band end (y1 3526) | І  о. і - - " і - - - |
| 1 | 4 | 13 | 5016-5086 | 70 | 0.478 | other | below the harness band end (y1 4777) | «І - - / - / - ( - -- -- І |
| 1 | 4 | 14 | 5067-5139 | 72 | 0.485 | russian | below the harness band end (y1 4777) | м т------------ --- -- -- ѵ і / |
| 2 | 2 | 5 | 2299-2371 | 72 | 0.492 | other | below the harness band end (y1 1966) | ч  ж ѣ ) і а е -- э І |
| 2 | 3 | 8 | 3297-3347 | 50 | 0.681 | other | below the harness band end (y1 3279) | -ѵ С  . Н - --------- -т- -- - -- - -- - ---- - - - -- - |
| 2 | 3 | 9 | 3328-3518 | 190 | 0.194 | other | below the harness band end (y1 3279) | ---- --- - -- --- - -- -- - |
| 2 | 3 | 10 | 3528-3588 | 60 | 0.64 | other | below the harness band end (y1 3279) |  |
| 2 | 4 | 13 | 4884-4934 | 50 | 0.727 | other | below the harness band end (y1 4573) | е ке хс.  ѵ ей о ѣ) |
| 3 | 1 | 2 | 955-1038 | 83 | 0.457 | russian | below the harness band end (y1 632) | ѵ ѵ г е » ѵ » - - --- -- і. - -"Т с> - |
| 3 | 1 | 3 | 1019-1070 | 51 | 0.64 | other | below the harness band end (y1 632) | ---- ч . / ч і І -ѣ З а ж ч А - |
| 3 | 2 | 7 | 3166-3493 | 327 | 0.118 | other | inside the harness band (y 3004-3176) | ѣтРѣРИ---ттпетг |
| 3 | 2 | 8 | 3474-3558 | 84 | 0.395 | russian | below the harness band end (y1 3176) | е м - - -  - - л а і -) е / |
| 3 | 2 | 9 | 3539-3579 | 40 | 0.821 | other | below the harness band end (y1 3176) | ч -  . - - - - - ѵ - ..  Еѣа / |
## 5. Rows only the app has, and rows only the harness has

Rows only the harness has: none. Every harness row has an app row that overlaps it.

Rows only the app has: 18 in B01, 17 in B04.

| | B01 | B04 |
|---|---|---|
| systems | 12 | 11 |
| systems where the app's band ends more than 60 px below the harness's | 8 | 11 |
| app rows | 36 | 41 |
| paired with a harness row | 18 | 24 |
| only the app has | 18 | 17 |
| of those, starting at or below the harness's band end | 16 | 15 |
| of those, called Russian | 1 | 4 |
| of those, taller than 200 px (a whole piano staff cut as one row) | 6 | 2 |
| German rows or a split of one row into two | not shown: the app's readings of the rows the harness labels other (B01 6, B04 10 and 3 notext) are strings of dashes and music marks, no German words; I did not look at the crops | same |

What they are: pieces of the piano staff and its dynamics. The boxes begin where the harness's band ended. The cause is in `lyricBand` (`underlay-band.ts:98-99`): B is "the next staff below A in the page's order", from the boxes homr gave. On B01 p1 the staves found are at tops 1090, 1415, 2210, 2899, 3373, 3695, 4615, 5265. System 2's voice staff (2210) is followed by 2899, not by the piano's upper staff, which the harness's band end puts at about 2586. The band then runs 2381 to 2852 where the harness's runs 2379 to 2540. Why homr's list lacks those staves is NOT ESTABLISHED.

Do the app-only rows cost syllables? On B01 none: the real text row is the top row of each system and is seated first. On B04 once: p3 s2, where the real row is called "other" (cause 1) and the next row called Russian, id 8 (a string of dashes and single letters), a piano-area row, is seated on the system's notes in its place. That case is counted under cause 1.

## 6. Ranked causes, with counts

Counts are syllables of the printed text read right, song level, by the report's `readright_streams` on the lyric stream the app would write with the page gate off, from scripts that reproduce the app's numbers (controls in section 1). B01 has 147 printed syllables, B04 148.

| rank | cause | B04 syllables | B01 syllables | where in the app |
|---|---|---|---|---|
| 1 | A lone hyphen wider than half the ink height is read as a mark, not a joint, so the syllables around it are not sewn into words and the row fails the dictionary test. Ordinary hyphens measure 13 to 21 framed px against a limit of 16; real dashes measure 32 and wider. | **46** (50 to 96) | 0 (132 to 132) | `underlay-tokens.ts:50` (`longDash`, limit `0.5 * options.inkHeight`), called with `DEFAULT_INK_HEIGHT / row.transform.scale` at `underlay-page.ts:119` |
| 2 | A real text row still called "other" after cause 1 is out: B04 p2 s3 (`Ве - ду а счет - по - те .рян но.му мно й`) has 2 of 6 sewn words in the dictionary, share 0.33 against 0.5. | **18** (96 to 114) | 0 | `underlay-language.ts:27` (`RUSSIAN_SHARE`), used at `:59` |
| 3 | Seating after the right rows are given: 10 syllable tokens unseated in B04 (3 in B01), one token with a failed engine cut. Not traced note by note. | **8** (114 to 122) | 1 (132 to 133) | `underlay-seat.ts` (`seatTokens`), `underlay-units.ts` (`cutUnits`) |
| 4 | Band runs into the piano staff because homr gave no box for the piano's upper staff: 35 junk rows. Costs a syllable only through cause 1 (B04 p3 s2 seats a junk row). | 0 on its own | 0 | `underlay-band.ts:98-99`, `underlay-prepare.ts:96` |
| 5 | Framing and recognition differences (paper-tone padding, resampling): letter flips both ways, net zero | 0 | 0 | `underlay-frame.ts` |
| 6 | Hybrid cut (`cutUnits`): 1 token cut in B04, 0 in B01; with it removed the figures do not move (50, 132) | 0 | 0 | `underlay-units.ts` |

Checks behind rank 1 to 3, all on the captured reads, with the app's own seating:

| variant | B01 read right | B04 read right | B04 systems seated (of 11) |
|---|---|---|---|
| the app as built | 132 | 50 | 8 |
| long-dash rule off | **114** | 96 | 10 |
| limit at 0.75 of the ink height | 132 | 96 | 10 |
| limit at 1.0 of the ink height | 132 | 96 | 10 |
| limit at 1.25 of the ink height | 132 | 96 | 10 |
| limit at 1.0 and `RUSSIAN_SHARE` 0.4 | 132 | 96 | 10 |
| limit at 1.0 and `RUSSIAN_SHARE` 0.3 | 132 | **114** | 11 |
| the right rows given (labels) | 132 | 114 | 11 |
| harness, row-level scorer on its own labelled rows | 133 | 122 | |

The long-dash rule cannot be removed: with it off B01 drops by 18, because the dash in `при - ют - от - кры - та` (B01 p2 s2) is sewn into one unknown word. The rule is the right idea with the wrong limit.

Gate consequence, as shipped: with the limit at 1.0 the B04 pages still do not pass, because p2 s3 has no Russian row; at share 0.3 all 11 systems have one. B01 passes either way.

## 7. One-line fix for each, the desk's to decide

1. **Cause 1.** Raise the long-dash limit in `underlay-tokens.ts:50` from `0.5 * options.inkHeight` to `1.0 * options.inkHeight` (0.75 gives the same on these two songs). DESK DEFAULT candidate; the other 16 songs are not measured, and the em dash in other prints may sit below 1.0.
2. **Cause 2.** Lower `RUSSIAN_SHARE` in `underlay-language.ts:27` from 0.5 to 0.3 (B04 114, B01 132); the cost is junk rows passing the dictionary test, not measured on the other 16 songs. The alternative is to take the first text-sized row of the system as Russian whenever the system has none (the harness's decision 3, position).
3. **Cause 3.** Leave until the rows are right, then trace the 8.
4. **Cause 4.** Ask for the piano staff when homr omits it: end the band at the first staff-line run found by `staffIn` below A, or at 12 staff spaces under A, when the next box is more than 12 spaces away.
5. **Gate.** Not part of the question. The gate's "every system has a Russian row" turns one misclassified row into a lost page; recorded here.

## 8. Departures

1. **One measurement-only edit in the clone**, `apps/web/src/lib/omr/underlay-reader.ts`: added two imports and a `[diag]` block after `seatPage` that logs the page's data. Saved first as `/root/n135-diag/underlay-reader.ts.orig`, restored from it, `git status` checked (only `apps/web/omr-underlay/` untracked), and the app rebuilt from the restored source (`build-restored.log`, exit 0). The `build/` folder is therefore the unpatched build again.
2. **A second app run** of B01 and B04 with the edit, because the real-page run did not keep the page, the staff boxes or the framed rows. Times: B01 497 s, B04 478 s.
3. **The harness side was rebuilt offline** with the harness's own `clean.py` functions, `score117.py`, `common2.py` and `score42.py` imported unchanged, from the crops in `/root/n135data/crops2/` and the stored readings. The harness's normaliser (`norm.ts` under `/home/claude/ilya`) is not in this container; `tools/hnorm.mjs` runs `modernisePreReform` from the clone instead. The norm cache in the harness folder was not written (checked by `cmp`). Same file at the same commit as the harness's: NOT ESTABLISHED, but the reproductions are exact (133, 122, 42 of 42).
4. **The language call, fixes and seating were replayed**, not run in the app: `langcheck.mjs`, `variants.mjs`, `seatvar.mjs`, `thrrows.mjs` use the clone's own modules (`underlay-language.ts`, `underlay-tokens.ts`, `underlay-seat.ts`, `underlay-units.ts`, `underlay-words.ts`, `underlay-page.ts`) and the build's dictionary files. The replay equals the app in every control; the fix variants change one constant (or the row set) each and were not built.
5. **"The app's recogniser" in the cross-feed is my reader**, `tools/read-dir.mjs`, which makes the same `createWorker` call and `setParameters` as `underlay-recognize.ts` and gave the app's words on 77 of 77 of the app's own rows. The real recogniser was not fed the harness's crops inside the app.
6. **The label used for "real text row"** is the harness's `labels2/` (russian), paired to the app rows by overlap. Where I say "the right rows given", that is this set.
7. **`pkill` at the start of the first run killed my own shell** and the first launch did not start; I recreated `run.sh` and started it again. No result came from the failed launch.
8. The shipped song gate was not applied in the replays; the "as built" lines are the gate-off figures, which is what the real-page report's 50 for B04 is.

## 9. What I could not establish

- **Why homr gave no box for the piano's upper staff** on 8 of 12 systems of B01 and all 11 of B04. I saw the boxes (8 a page); I did not look at homr.
- **The 8 syllables of cause 3** (114 against 122): which notes. The counts say 10 tokens unseated in B04 and a failed cut on one.
- **Why 4 of 27 same-box pairs have framed widths that differ by up to 1.5 percent** (for instance 3,552 against 3,466 px before the padding is removed): the scale factor differs slightly. Not traced; the readings of those rows score as the harness's.
- **Whether the three top-end box differences (B01 p1 s3 r1, B04 p2 s3 r1, B04 p3 s2 r1) come from the paper tone.** Not tested.
- **The effect of the fixes on the other 16 songs.** Nothing here was run on them. In particular the 0.3 share and the 1.0 limit could let junk rows through or fuse real dashes on other prints.
- **The 5-song gap (446 against 470).** B01 explains 1 of the 24; B08 (100 against 124) is the other large one and was not examined.
- **Whether the hyphen widths are specific to this scan size** (the limit is a share of the ink height and the framing fixes the ink height at 32, so a share of it carries over; not tested on a camera picture).

## Files

`/root/n135-diag/`: `controls-before-measure.md`; `app-run/<L>/` (console with the `[diag]` lines, MusicXML, Lyrics); `app/<L>/p<N>/` (page PNG, raw grey, framed rows `row<k>.png`, `data.json`, `replay.json`); `app/<L>/rows.json`; `h-framed/`, `h-framed2/`, `a-framed/` (framed crops) and their readings; `ocr-h/`, `ocr-app/` (harness-shaped readings); `score-h.json`, `score-app.json`; `variants.json`, `seatvar.json`, `langcheck.json`, `hclass.json`, `pairs.json`; `tables.md`; `tools/` (every script named above); `model/`; `underlay-reader.ts.orig`. Archive: `/root/n135-diag.tgz`.
