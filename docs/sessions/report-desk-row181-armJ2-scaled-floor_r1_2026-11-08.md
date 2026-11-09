# Report: row 181, arm J2, a row floor that scales with the system's free notes (Sonnet helper, r1, 2026-11-09)

Brief `brief-desk-row181-armJ2-scaled-floor_r1_2026-11-08.md` (md5 75d9222fe1b3754d647f606b3d98fcff). Measure only; nothing committed or pushed; one capture per arm (headless Chromium, `?words=read`, `--nojoin`); five songs each, row 114 first files only (the truth `.truth.json` and `.txt` of `p02` and `f1-001` to `f1-020`; no `f2-*` file opened). Tree: `trees/S`, a worktree of `DannMitton/ilya` at `05db2dac` (branch `cloud-lane-34`), with `work/patchS.py`, `patchB0.py`, `patchJ.py`, then `work/patchJ2.py` applied in that order, one build for all three arms. Scorer: `work/score114_c181.py`, unchanged. Every number below names its arm: control = `cap/ctl2/`, K=4 = `cap/J2k4/` (`?words=read&b0=full&rowfloor=scaled&k=4`), K=6 = `cap/J2k6/` (`...&k=6`). `&b0=full` is on in all three arms (the control of arm J ran with it: its `b0 counts` line shows non-zero counts and my control musicxml is byte-identical to arm J's control capture on all five songs).

## Answer

| (b) exact of 590 | s1 | s2 | s3 | s4 | s5 | (b) | (a) |
|---|---|---|---|---|---|---|---|
| control, `cap/ctl2`, `rowfloor` absent | 49 | 139 | 33 | 82 | 86 | **389** | 429 |
| K=4, `cap/J2k4` | 49 | 139 | 32 | 82 | 86 | **388** | 428 |
| K=6, `cap/J2k6` | 49 | 139 | 32 | 82 | 86 | **388** | 428 |

- **A. The floor keeps song 3's true rows.** Arm J skipped 23 rows (21 distinct) on test (a), 15 distinct in song 3. Under K=4 and K=6 the same row decisions are made (identical seat and skip lines in all 83 row-by-system entries of the two arms: 0 differences; only the floor values differ, 47/19/17 floors of 3/2/1 at K=4 against 26/27/30 at K=6, and no decision turns on that). Song 3 loses one syllable, not 16: song 3 p11 s4 «листь» (below). Row 114 f1 (b) is 388 against the control's 389, not arm J's 371.
- **A, the five junk systems: the floor refuses two of five, and a refusal gains nothing.** Refused with no row seated: song 1 p2 s1 and song 5 p19 s1 (the second look's every look fails the floor, so no look is kept). Not refused: song 2 p5 s1 (the second look seats another junk row, counted 4, units 7), song 5 p20 s1 (counted 2 against floor 2, at K=4 and K=6), song 5 p21 s3 (the control seats a true row from the second look, 12 of the system's syllables right; it is not a junk system on this base). (b) in all five systems is the same under both K as in the control: 0 gained, 0 lost in every one. The floor does not reach the 61 seats the design hoped for.
- **B. Why the second look keeps a junk row on song 2 p5 s1:** its «та ста ѣ іЕѵѵ" ре» is the first Russian row of the `wide` look, and `scoreLook` ranks looks by the count of dictionary words in that row. «та», «ста», and «ре» are dictionary entries, so it scores 3; the `up` look scores 1. The system's 18 truth syllables are not in any row of any look, read by eye. `rowLanguage` calls it Russian because 3 of its 4 counted words are known (share 0.75 against `RUSSIAN_SHARE` 0.3). The floor cannot reach it: counted 4, floor 3. The floor is `min(MIN_WORDS, ...)`, so it never exceeds 3 and no K changes that; refusing this row needs a floor of 5 or a different test (the share of letters the dictionary words cover, or whether words are 1 to 2 letters).
- **Finding the brief did not ask for.** The one seat lost is the rescue's doing. With floor 1 on song 3 p11 s4 (free 3), `fallbackRow` now qualifies the first look's row «л и стья шу» (counted 2, sewn) and seats it as a rescue (6 units), so the second look never runs on that system. In the control the system had no rescue, took the second look, and its `stretch` look gave «І листья шуп» (5 units, «листь» right). The rescue site made two more new rescue seats (song 3 p8 s3, song 3 p12 s3) with no (b) change. Control: 5 rescue seats; K=4 and K=6: 10 each.
- **Expectation check.** (b) between 380 and 420: yes (388). "Refuses the junk rows where 7 or more seats were lost": two of five, but neither of those two seated a syllable right in the control, so refusing them returns nothing. "No K separates the true short rows from the junk rows": not tested as such, because no K has to: one true row only (song 3 p11 s4) is touched, and only through the rescue, not the first look's floor. The five junk rows in the first look are counted 1, 1, 1, 2, and 7 (p21 s3 is not junk), true song 3 rows counted 2 to 4; at counted 2 the junk row of song 5 p20 s1 and the true rows of song 3 coincide, so a floor high enough to refuse it (3, MIN_WORDS) is arm J's floor.

## 1. Detail, (b) and (a) of 590 by song

| arm (tree: S = 05db2dac + patchS + patchB0 + patchJ + patchJ2; `&b0=full`) | s1 | s2 | s3 | s4 | s5 | (b) total | (a) total |
|---|---|---|---|---|---|---|---|
| control (`cap/ctl2/`) | 49 | 139 | 33 | 82 | 86 | **389** | 429 |
| K=4 (`cap/J2k4/`) | 49 | 139 | 32 | 82 | 86 | **388** | 428 |
| K=6 (`cap/J2k6/`) | 49 | 139 | 32 | 82 | 86 | **388** | 428 |

Control against `ledger-B0_S.tsv` (song, page, system, truth syllable, seated text, b): 590 reference rows, 590 mine, **0 differences**.

## 2. The five junk systems

"before" is the control seat line (final `seatPage` run of the page); "after" is the arm's. Gained and lost are per-syllable (b) in that system against the control.

| system | arm | seated row (final run) | counted | free | floor | rescue | units | (b) in system | gained | lost |
|---|---|---|---|---|---|---|---|---|---|---|
| song 2 p5 s1 | control | «ее і п» | 1 | 18 | 3 | False | 6 | 0 | - | - |
| song 2 p5 s1 | K=4 | «та ста ѣ іЕѵѵ" ре» | 4 | 18 | 3 | False | 7 | 0 | 0 | 0 |
| song 2 p5 s1 | K=6 | «та ста ѣ іЕѵѵ" ре» | 4 | 18 | 3 | False | 7 | 0 | 0 | 0 |
| song 1 p2 s1 | control | «п з п ь Гг.\» | 1 | 21 | 3 | False | 7 | 0 | - | - |
| song 1 p2 s1 | K=4 | «(no row seated)» | - | - | - | - | - | 0 | 0 | 0 |
| song 1 p2 s1 | K=6 | «(no row seated)» | - | - | - | - | - | 0 | 0 | 0 |
| song 5 p19 s1 | control | «І І ст» | 1 | 10 | 3 | False | 2 | 0 | - | - |
| song 5 p19 s1 | K=4 | «(no row seated)» | - | - | - | - | - | 0 | 0 | 0 |
| song 5 p19 s1 | K=6 | «(no row seated)» | - | - | - | - | - | 0 | 0 | 0 |
| song 5 p20 s1 | control | ««аъъъ «аълъъ» | 2 | 7 | 3 | False | 3 | 0 | - | - |
| song 5 p20 s1 | K=4 | ««аъъъ «аълъъ» | 2 | 7 | 2 | False | 3 | 0 | 0 | 0 |
| song 5 p20 s1 | K=6 | ««аъъъ «аълъъ» | 2 | 7 | 2 | False | 3 | 0 | 0 | 0 |
| song 5 p21 s3 | control | «душу не вин ну. ю теплой за ступнице» | 7 | 13 | 3 | False | 19 | 12 | - | - |
| song 5 p21 s3 | K=4 | «душу не вин ну. ю теплой за ступнице» | 7 | 13 | 3 | False | 19 | 12 | 0 | 0 |
| song 5 p21 s3 | K=6 | «душу не вин ну. ю теплой за ступнице» | 7 | 13 | 3 | False | 19 | 12 | 0 | 0 |

## 3. Every row tried (every `[c181J]` line: `skipped row` and `seat`)

Rows `rowLanguage` called not Russian are not logged by the build and not in this table. "run" is the `seatPage` run of the page (1 = first look; 2 = after the second look, where one was made). "truth?" is a desk proxy: the share of the row's counted-length words (2+ letters) found as a substring of the truth syllables of that page and system; "true" at 0.5 or more. Proxy, not a ruling.

| arm | song | page | system | run | row | words | counted | free | floor | result | truth share | true row? | arm J skipped it? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| K=4 | 1 | 1 | 1 | 1 | 0 | «ДудкаГде ты звездочкаАхгде ты,» | 4 | 16 | 3 | seated, 12 units | 0.75 | yes | no |
| K=4 | 1 | 1 | 2 | 1 | 1 | «яс на я? Иль затмила ся тучеп чер ноюу) ч у зеш» | 9 | 23 | 3 | seated, 24 units | 0.67 | yes | no |
| K=4 | 1 | 1 | 3 | 1 | 1 | «І черною, ту чеи гроз но ют» | 6 | 15 | 3 | seated, 14 units | 0.83 | yes | no |
| K=4 | 1 | 1 | 4 | 1 | 0 | «е Ггде ты, девица, где ты,» | 5 | 9 | 3 | seated, 10 units | 0.80 | yes | no |
| K=4 | 1 | 2 | 2 | 1 | 0 | «милого, ненагляд ного» | 3 | 13 | 3 | seated, 18 units | 1.00 | yes | no |
| K=4 | 1 | 2 | 3 | 1 | 0 | «І Туча черная скрыла звездочку, земля ѣѣ» | 6 | 21 | 3 | seated, 18 units | 1.00 | yes | no |
| K=4 | 1 | 2 | 4 | 1 | 0 | «хладная взяла деви» | 3 | 9 | 3 | seated, 16 units | 1.00 | yes | no |
| K=4 | 2 | 3 | 2 | 1 | 0 | «ікаль!! Дайте вивы! Радостьмтновень е; пейте до дна! Громкие» | 8 | 19 | 3 | seated, 21 units | 0.62 | yes | no |
| K=4 | 2 | 3 | 3 | 1 | 0 | «ѵ пес ни гряньте, друзья! Пусть нас веселых видит заря а» | 9 | 15 | 3 | seated, 22 units | 0.89 | yes | no |
| K=4 | 2 | 3 | 1 | 2 | 1 | «ѣЕ: І» | 1 | 3 | 1 | seated, 3 units | 0.00 | no | yes |
| K=4 | 2 | 3 | 2 | 2 | 0 | «ікаль!! Дайте вивы! Радостьмтновень е; пейте до дна! Громкие» | 8 | 19 | 3 | seated, 21 units | 0.62 | yes | no |
| K=4 | 2 | 3 | 3 | 2 | 0 | «ѵ пес ни гряньте, друзья! Пусть нас веселых видит заря а» | 9 | 15 | 3 | seated, 22 units | 0.89 | yes | no |
| K=4 | 2 | 4 | 1 | 1 | 0 | «ѣз Ныне пи рует» | 4 | 5 | 2 | seated, 8 units | 0.33 | no | no |
| K=4 | 2 | 4 | 2 | 1 | 0 | «юностьна час, нынче ве селье, радость у нас! Завтра что» | 9 | 16 | 3 | seated, 18 units | 1.00 | yes | no |
| K=4 | 2 | 4 | 3 | 1 | 0 | «будетзнаю льдрузья? Пусть нас ве се. лых видит заря! Пусть нас ве» | 12 | 18 | 3 | seated, 21 units | 1.00 | yes | no |
| K=4 | 2 | 4 | 4 | 1 | 1 | «селых ви дит заря Дай те бокалы! Дайте ви на!» | 10 | 16 | 3 | seated, 20 units | 0.90 | yes | no |
| K=4 | 2 | 5 | 1 | 1 | 0 | «ее і п» | 1 | 18 | 3 | (a) counted 1 < floor 3 | 0.00 | no | yes |
| K=4 | 2 | 5 | 2 | 1 | 0 | «Пусть нас веселых видит за ря! ѣ» | 6 | 9 | 3 | seated, 12 units | 1.00 | yes | no |
| K=4 | 2 | 5 | 3 | 1 | 0 | «Шум нораз тульно пойте, друзья! Лейте в бокалы» | 7 | 14 | 3 | seated, 22 units | 0.86 | yes | no |
| K=4 | 2 | 5 | 4 | 1 | 0 | «больше вина! Ну те жвсе разомвыпьем до дѣа Пусть нас ве» | 11 | 17 | 3 | seated, 22 units | 0.82 | yes | no |
| K=4 | 2 | 5 | 1 | 2 | 0 | «та ста ѣ іЕѵѵ" ре» | 4 | 18 | 3 | seated, 7 units | 0.00 | no | no |
| K=4 | 2 | 5 | 2 | 2 | 0 | «Пусть нас веселых видит за ря! ѣ» | 6 | 9 | 3 | seated, 12 units | 1.00 | yes | no |
| K=4 | 2 | 5 | 3 | 2 | 0 | «Шум нораз тульно пойте, друзья! Лейте в бокалы» | 7 | 14 | 3 | seated, 22 units | 0.86 | yes | no |
| K=4 | 2 | 5 | 4 | 2 | 0 | «больше вина! Ну те жвсе разомвыпьем до дѣа Пусть нас ве» | 11 | 17 | 3 | seated, 22 units | 0.82 | yes | no |
| K=4 | 2 | 6 | 1 | 1 | 0 | «Радостьмгновень пейте до дна Громкие песни» | 6 | 31 | 3 | seated, 19 units | 0.00 | no | no |
| K=4 | 2 | 6 | 2 | 1 | 0 | «Ігряньте, дру зья! Пусть нас веселых видл з» | 7 | 12 | 3 | seated, 14 units | 0.00 | no | no |
| K=4 | 2 | 6 | 3 | 1 | 0 | «і. заря о І» | 1 | 2 | 1 | seated, 4 units | 0.00 | no | yes |
| K=4 | 3 | 7 | 1 | 1 | 0 | «І Листь я шумели у г» | 2 | 6 | 2 | seated, 10 units | 0.00 | no | yes |
| K=4 | 3 | 8 | 1 | 1 | 1 | «ѵѣ ѳ,ѣу а у» | 2 | 3 | 1 | seated (rescue), 29 units | 0.00 | no | no |
| K=4 | 3 | 8 | 2 | 1 | 1 | «реве ноч» | 2 | 6 | 2 | seated, 8 units | 0.50 | yes | yes |
| K=4 | 3 | 8 | 3 | 1 | 1 | «м м»» | 0 | 1 | 1 | seated (rescue), 5 units | 0.00 | no | no |
| K=4 | 3 | 8 | 1 | 2 | 1 | «ѵѣ ѳ,ѣу а у» | 2 | 3 | 1 | seated (rescue), 29 units | 0.00 | no | no |
| K=4 | 3 | 8 | 2 | 2 | 1 | «реве ноч» | 2 | 6 | 2 | seated, 8 units | 0.50 | yes | yes |
| K=4 | 3 | 8 | 3 | 2 | 1 | «м м»» | 0 | 1 | 1 | seated (rescue), 5 units | 0.00 | no | no |
| K=4 | 3 | 8 | 4 | 2 | 0 | «ЕѵруГроб ошу» | 2 | 3 | 1 | seated, 11 units | 0.00 | no | yes |
| K=4 | 3 | 9 | 2 | 1 | 0 | «І У гроб, о за» | 2 | 4 | 1 | seated, 9 units | 1.00 | yes | yes |
| K=4 | 3 | 9 | 3 | 1 | 1 | «г тѣ т те о-——: І» | 2 | 4 | 1 | seated, 4 units | 0.00 | no | yes |
| K=4 | 3 | 9 | 1 | 2 | 0 | «га тІ ті Рі РІ Рі РІ Ре! ѲІ т т І т І ж і ѵ і ѵ і ѵ і ѵ ое і» | 10 | 4 | 1 | seated, 12 units | 0.00 | no | no |
| K=4 | 3 | 9 | 2 | 2 | 0 | «І У гроб, о за» | 2 | 4 | 1 | seated, 9 units | 1.00 | yes | yes |
| K=4 | 3 | 9 | 3 | 2 | 1 | «г тѣ т те о-——: І» | 2 | 4 | 1 | seated, 4 units | 0.00 | no | yes |
| K=4 | 3 | 10 | 1 | 1 | 0 | «ѣч т ѣ: снавкн» | 2 | 4 | 1 | seated (rescue), 4 units | 0.00 | no | no |
| K=4 | 3 | 10 | 2 | 1 | 0 | «ный луной.» | 2 | 3 | 1 | seated, 5 units | 1.00 | yes | yes |
| K=4 | 3 | 10 | 3 | 1 | 0 | «Тихо, без пла ча, зары і ли» | 6 | 9 | 3 | seated, 11 units | 0.00 | no | no |
| K=4 | 3 | 11 | 1 | 1 | 0 | «и удали лись все прочь, І» | 4 | 7 | 2 | seated, 10 units | 1.00 | yes | no |
| K=4 | 3 | 11 | 2 | 1 | 0 | «то лько, скло» | 3 | 3 | 1 | seated, 8 units | 1.00 | yes | no |
| K=4 | 3 | 11 | 3 | 1 | 0 | «г ІН ЯСЬ н ад мо і гплои,» | 5 | 5 | 2 | seated, 8 units | 0.75 | yes | no |
| K=4 | 3 | 11 | 4 | 1 | 0 | «л и стья шу» | 2 | 3 | 1 | seated (rescue), 6 units | 1.00 | yes | no |
| K=4 | 3 | 12 | 3 | 1 | 0 | «и"е "г о г е ѣ» | 1 | 18 | 3 | seated (rescue), 9 units | 0.00 | no | no |
| K=4 | 3 | 12 | 5 | 1 | 0 | «че Ркз н» | 2 | 5 | 2 | seated, 3 units | 0.00 | no | yes |
| K=4 | 3 | 12 | 1 | 2 | 0 | «я іі ач» | 2 | 8 | 2 | seated, 5 units | 0.00 | no | yes |
| K=4 | 3 | 12 | 3 | 2 | 0 | «и"е "г о г е ѣ» | 1 | 18 | 3 | seated (rescue), 9 units | 0.00 | no | no |
| K=4 | 3 | 12 | 4 | 2 | 1 | «ѵмІ еТАэ т» | 2 | 6 | 2 | seated, 8 units | 0.00 | no | yes |
| K=4 | 3 | 12 | 5 | 2 | 0 | «че Ркз н» | 2 | 5 | 2 | seated, 3 units | 0.00 | no | yes |
| K=4 | 4 | 13 | 1 | 1 | 0 | «І Много есть у меня теремов и саІ» | 5 | 11 | 3 | seated, 16 units | 0.00 | no | no |
| K=4 | 4 | 13 | 2 | 1 | 0 | «дов, п раздоль .ных полей, п дре» | 5 | 10 | 3 | seated (rescue), 11 units | 0.00 | no | no |
| K=4 | 4 | 14 | 1 | 1 | 0 | «ІМ учи х лесов, А рѵ» | 4 | 6 | 2 | seated, 10 units | 1.00 | yes | no |
| K=4 | 4 | 14 | 2 | 1 | 0 | «му ч и х, дре .му .чи х ле сов.» | 6 | 7 | 2 | seated, 11 units | 1.00 | yes | no |
| K=4 | 4 | 14 | 3 | 1 | 0 | «много есть ме» | 3 | 5 | 2 | seated, 8 units | 1.00 | yes | no |
| K=4 | 4 | 14 | 4 | 1 | 0 | «ня жемчугов и мехов, разно» | 4 | 9 | 3 | seated, 14 units | 1.00 | yes | no |
| K=4 | 4 | 15 | 1 | 1 | 0 | «цветньъх о дежд, дра гоцѳн .ных ковров.,» | 6 | 10 | 3 | seated (rescue), 11 units | 0.67 | yes | no |
| K=4 | 4 | 15 | 2 | 1 | 0 | «много естьъ у меня для пи ров серео» | 7 | 13 | 3 | seated, 17 units | 0.71 | yes | no |
| K=4 | 4 | 15 | 3 | 1 | 0 | «ра, для бесед крас ных слов, для ве» | 8 | 10 | 3 | seated, 13 units | 1.00 | yes | no |
| K=4 | 4 | 15 | 4 | 1 | 0 | «сель я вп на, для ве селья ви» | 7 | 12 | 3 | seated, 12 units | 0.86 | yes | no |
| K=4 | 4 | 16 | 2 | 1 | 0 | «е жѣ! тоеннинстео низтоетоезет» | 3 | 1 | 1 | seated, 16 units | 0.00 | no | no |
| K=4 | 4 | 17 | 1 | 1 | 0 | «заѵ, м зна. ю, на что трав вол І» | 6 | 8 | 2 | seated, 8 units | 0.33 | no | no |
| K=4 | 4 | 17 | 2 | 1 | 0 | «шебных, вол. шебных ищу; но я» | 5 | 9 | 3 | seated, 13 units | 0.80 | yes | no |
| K=4 | 4 | 17 | 3 | 1 | 0 | «знаю, знаю, о чем сам о собою грущу... г» | 6 | 13 | 3 | seated, 19 units | 1.00 | yes | no |
| K=4 | 5 | 18 | 1 | 1 | 0 | «»і, матерь бо .жия. нътне с мо» | 5 | 11 | 3 | seated, 13 units | 0.00 | no | no |
| K=4 | 5 | 18 | 2 | 1 | 0 | «литво ю пред тво и м образом, яр ким спянием,» | 7 | 17 | 3 | seated, 22 units | 0.00 | no | no |
| K=4 | 5 | 18 | 3 | 1 | 0 | «н е з а сво ю мо лю душу пустынну ю.» | 5 | 16 | 3 | seated, 18 units | 0.20 | no | no |
| K=4 | 5 | 19 | 2 | 1 | 0 | «да и еп сопутников. полны х вн и» | 5 | 9 | 3 | seated, 15 units | 0.80 | yes | no |
| K=4 | 5 | 19 | 3 | 1 | 0 | «п им, молодость св е тлую.» | 4 | 10 | 3 | seated, 16 units | 0.75 | yes | no |
| K=4 | 5 | 19 | 4 | 1 | 1 | «я сра цу не» | 3 | 11 | 3 | seated, 6 units | 0.67 | yes | no |
| K=4 | 5 | 20 | 1 | 1 | 1 | ««аъъъ «аълъъ» | 2 | 7 | 2 | seated, 3 units | 0.00 | no | yes |
| K=4 | 5 | 20 | 2 | 1 | 0 | «вани я. о матерь» | 2 | 6 | 2 | seated, 9 units | 1.00 | yes | no |
| K=4 | 5 | 20 | 3 | 1 | 0 | «і божи я, тебя молю!» | 3 | 7 | 2 | seated, 10 units | 1.00 | yes | no |
| K=4 | 5 | 21 | 1 | 1 | 0 | «за душу стран ника, в ми ре обез родно го,» | 9 | 12 | 3 | seated, 16 units | 0.89 | yes | no |
| K=4 | 5 | 21 | 2 | 1 | 0 | «і ѣѣ но я вручить хоз у» | 4 | 6 | 2 | seated, 10 units | 0.33 | no | no |
| K=4 | 5 | 21 | 4 | 1 | 1 | «Ге" мира хоподнохо» | 3 | 10 | 3 | seated, 13 units | 0.33 | no | no |
| K=4 | 5 | 21 | 1 | 2 | 0 | «за душу стран ника, в ми ре обез родно го,» | 9 | 12 | 3 | seated, 16 units | 0.89 | yes | no |
| K=4 | 5 | 21 | 2 | 2 | 0 | «і ѣѣ но я вручить хоз у» | 4 | 6 | 2 | seated, 10 units | 0.33 | no | no |
| K=4 | 5 | 21 | 3 | 2 | 0 | «душу не вин ну. ю теплой за ступнице» | 7 | 13 | 3 | seated, 19 units | 1.00 | yes | no |
| K=4 | 5 | 21 | 4 | 2 | 1 | «Ге" мира хоподнохо» | 3 | 10 | 3 | seated, 13 units | 0.33 | no | no |
| K=6 | 1 | 1 | 1 | 1 | 0 | «ДудкаГде ты звездочкаАхгде ты,» | 4 | 16 | 3 | seated, 12 units | 0.75 | yes | no |
| K=6 | 1 | 1 | 2 | 1 | 1 | «яс на я? Иль затмила ся тучеп чер ноюу) ч у зеш» | 9 | 23 | 3 | seated, 24 units | 0.67 | yes | no |
| K=6 | 1 | 1 | 3 | 1 | 1 | «І черною, ту чеи гроз но ют» | 6 | 15 | 3 | seated, 14 units | 0.83 | yes | no |
| K=6 | 1 | 1 | 4 | 1 | 0 | «е Ггде ты, девица, где ты,» | 5 | 9 | 2 | seated, 10 units | 0.80 | yes | no |
| K=6 | 1 | 2 | 2 | 1 | 0 | «милого, ненагляд ного» | 3 | 13 | 3 | seated, 18 units | 1.00 | yes | no |
| K=6 | 1 | 2 | 3 | 1 | 0 | «І Туча черная скрыла звездочку, земля ѣѣ» | 6 | 21 | 3 | seated, 18 units | 1.00 | yes | no |
| K=6 | 1 | 2 | 4 | 1 | 0 | «хладная взяла деви» | 3 | 9 | 2 | seated, 16 units | 1.00 | yes | no |
| K=6 | 2 | 3 | 2 | 1 | 0 | «ікаль!! Дайте вивы! Радостьмтновень е; пейте до дна! Громкие» | 8 | 19 | 3 | seated, 21 units | 0.62 | yes | no |
| K=6 | 2 | 3 | 3 | 1 | 0 | «ѵ пес ни гряньте, друзья! Пусть нас веселых видит заря а» | 9 | 15 | 3 | seated, 22 units | 0.89 | yes | no |
| K=6 | 2 | 3 | 1 | 2 | 1 | «ѣЕ: І» | 1 | 3 | 1 | seated, 3 units | 0.00 | no | yes |
| K=6 | 2 | 3 | 2 | 2 | 0 | «ікаль!! Дайте вивы! Радостьмтновень е; пейте до дна! Громкие» | 8 | 19 | 3 | seated, 21 units | 0.62 | yes | no |
| K=6 | 2 | 3 | 3 | 2 | 0 | «ѵ пес ни гряньте, друзья! Пусть нас веселых видит заря а» | 9 | 15 | 3 | seated, 22 units | 0.89 | yes | no |
| K=6 | 2 | 4 | 1 | 1 | 0 | «ѣз Ныне пи рует» | 4 | 5 | 1 | seated, 8 units | 0.33 | no | no |
| K=6 | 2 | 4 | 2 | 1 | 0 | «юностьна час, нынче ве селье, радость у нас! Завтра что» | 9 | 16 | 3 | seated, 18 units | 1.00 | yes | no |
| K=6 | 2 | 4 | 3 | 1 | 0 | «будетзнаю льдрузья? Пусть нас ве се. лых видит заря! Пусть нас ве» | 12 | 18 | 3 | seated, 21 units | 1.00 | yes | no |
| K=6 | 2 | 4 | 4 | 1 | 1 | «селых ви дит заря Дай те бокалы! Дайте ви на!» | 10 | 16 | 3 | seated, 20 units | 0.90 | yes | no |
| K=6 | 2 | 5 | 1 | 1 | 0 | «ее і п» | 1 | 18 | 3 | (a) counted 1 < floor 3 | 0.00 | no | yes |
| K=6 | 2 | 5 | 2 | 1 | 0 | «Пусть нас веселых видит за ря! ѣ» | 6 | 9 | 2 | seated, 12 units | 1.00 | yes | no |
| K=6 | 2 | 5 | 3 | 1 | 0 | «Шум нораз тульно пойте, друзья! Лейте в бокалы» | 7 | 14 | 3 | seated, 22 units | 0.86 | yes | no |
| K=6 | 2 | 5 | 4 | 1 | 0 | «больше вина! Ну те жвсе разомвыпьем до дѣа Пусть нас ве» | 11 | 17 | 3 | seated, 22 units | 0.82 | yes | no |
| K=6 | 2 | 5 | 1 | 2 | 0 | «та ста ѣ іЕѵѵ" ре» | 4 | 18 | 3 | seated, 7 units | 0.00 | no | no |
| K=6 | 2 | 5 | 2 | 2 | 0 | «Пусть нас веселых видит за ря! ѣ» | 6 | 9 | 2 | seated, 12 units | 1.00 | yes | no |
| K=6 | 2 | 5 | 3 | 2 | 0 | «Шум нораз тульно пойте, друзья! Лейте в бокалы» | 7 | 14 | 3 | seated, 22 units | 0.86 | yes | no |
| K=6 | 2 | 5 | 4 | 2 | 0 | «больше вина! Ну те жвсе разомвыпьем до дѣа Пусть нас ве» | 11 | 17 | 3 | seated, 22 units | 0.82 | yes | no |
| K=6 | 2 | 6 | 1 | 1 | 0 | «Радостьмгновень пейте до дна Громкие песни» | 6 | 31 | 3 | seated, 19 units | 0.00 | no | no |
| K=6 | 2 | 6 | 2 | 1 | 0 | «Ігряньте, дру зья! Пусть нас веселых видл з» | 7 | 12 | 2 | seated, 14 units | 0.00 | no | no |
| K=6 | 2 | 6 | 3 | 1 | 0 | «і. заря о І» | 1 | 2 | 1 | seated, 4 units | 0.00 | no | yes |
| K=6 | 3 | 7 | 1 | 1 | 0 | «І Листь я шумели у г» | 2 | 6 | 1 | seated, 10 units | 0.00 | no | yes |
| K=6 | 3 | 8 | 1 | 1 | 1 | «ѵѣ ѳ,ѣу а у» | 2 | 3 | 1 | seated (rescue), 29 units | 0.00 | no | no |
| K=6 | 3 | 8 | 2 | 1 | 1 | «реве ноч» | 2 | 6 | 1 | seated, 8 units | 0.50 | yes | yes |
| K=6 | 3 | 8 | 3 | 1 | 1 | «м м»» | 0 | 1 | 1 | seated (rescue), 5 units | 0.00 | no | no |
| K=6 | 3 | 8 | 1 | 2 | 1 | «ѵѣ ѳ,ѣу а у» | 2 | 3 | 1 | seated (rescue), 29 units | 0.00 | no | no |
| K=6 | 3 | 8 | 2 | 2 | 1 | «реве ноч» | 2 | 6 | 1 | seated, 8 units | 0.50 | yes | yes |
| K=6 | 3 | 8 | 3 | 2 | 1 | «м м»» | 0 | 1 | 1 | seated (rescue), 5 units | 0.00 | no | no |
| K=6 | 3 | 8 | 4 | 2 | 0 | «ЕѵруГроб ошу» | 2 | 3 | 1 | seated, 11 units | 0.00 | no | yes |
| K=6 | 3 | 9 | 2 | 1 | 0 | «І У гроб, о за» | 2 | 4 | 1 | seated, 9 units | 1.00 | yes | yes |
| K=6 | 3 | 9 | 3 | 1 | 1 | «г тѣ т те о-——: І» | 2 | 4 | 1 | seated, 4 units | 0.00 | no | yes |
| K=6 | 3 | 9 | 1 | 2 | 0 | «га тІ ті Рі РІ Рі РІ Ре! ѲІ т т І т І ж і ѵ і ѵ і ѵ і ѵ ое і» | 10 | 4 | 1 | seated, 12 units | 0.00 | no | no |
| K=6 | 3 | 9 | 2 | 2 | 0 | «І У гроб, о за» | 2 | 4 | 1 | seated, 9 units | 1.00 | yes | yes |
| K=6 | 3 | 9 | 3 | 2 | 1 | «г тѣ т те о-——: І» | 2 | 4 | 1 | seated, 4 units | 0.00 | no | yes |
| K=6 | 3 | 10 | 1 | 1 | 0 | «ѣч т ѣ: снавкн» | 2 | 4 | 1 | seated (rescue), 4 units | 0.00 | no | no |
| K=6 | 3 | 10 | 2 | 1 | 0 | «ный луной.» | 2 | 3 | 1 | seated, 5 units | 1.00 | yes | yes |
| K=6 | 3 | 10 | 3 | 1 | 0 | «Тихо, без пла ча, зары і ли» | 6 | 9 | 2 | seated, 11 units | 0.00 | no | no |
| K=6 | 3 | 11 | 1 | 1 | 0 | «и удали лись все прочь, І» | 4 | 7 | 2 | seated, 10 units | 1.00 | yes | no |
| K=6 | 3 | 11 | 2 | 1 | 0 | «то лько, скло» | 3 | 3 | 1 | seated, 8 units | 1.00 | yes | no |
| K=6 | 3 | 11 | 3 | 1 | 0 | «г ІН ЯСЬ н ад мо і гплои,» | 5 | 5 | 1 | seated, 8 units | 0.75 | yes | no |
| K=6 | 3 | 11 | 4 | 1 | 0 | «л и стья шу» | 2 | 3 | 1 | seated (rescue), 6 units | 1.00 | yes | no |
| K=6 | 3 | 12 | 3 | 1 | 0 | «и"е "г о г е ѣ» | 1 | 18 | 3 | seated (rescue), 9 units | 0.00 | no | no |
| K=6 | 3 | 12 | 5 | 1 | 0 | «че Ркз н» | 2 | 5 | 1 | seated, 3 units | 0.00 | no | yes |
| K=6 | 3 | 12 | 1 | 2 | 0 | «я іі ач» | 2 | 8 | 2 | seated, 5 units | 0.00 | no | yes |
| K=6 | 3 | 12 | 3 | 2 | 0 | «и"е "г о г е ѣ» | 1 | 18 | 3 | seated (rescue), 9 units | 0.00 | no | no |
| K=6 | 3 | 12 | 4 | 2 | 1 | «ѵмІ еТАэ т» | 2 | 6 | 1 | seated, 8 units | 0.00 | no | yes |
| K=6 | 3 | 12 | 5 | 2 | 0 | «че Ркз н» | 2 | 5 | 1 | seated, 3 units | 0.00 | no | yes |
| K=6 | 4 | 13 | 1 | 1 | 0 | «І Много есть у меня теремов и саІ» | 5 | 11 | 2 | seated, 16 units | 0.00 | no | no |
| K=6 | 4 | 13 | 2 | 1 | 0 | «дов, п раздоль .ных полей, п дре» | 5 | 10 | 2 | seated (rescue), 11 units | 0.00 | no | no |
| K=6 | 4 | 14 | 1 | 1 | 0 | «ІМ учи х лесов, А рѵ» | 4 | 6 | 1 | seated, 10 units | 1.00 | yes | no |
| K=6 | 4 | 14 | 2 | 1 | 0 | «му ч и х, дре .му .чи х ле сов.» | 6 | 7 | 2 | seated, 11 units | 1.00 | yes | no |
| K=6 | 4 | 14 | 3 | 1 | 0 | «много есть ме» | 3 | 5 | 1 | seated, 8 units | 1.00 | yes | no |
| K=6 | 4 | 14 | 4 | 1 | 0 | «ня жемчугов и мехов, разно» | 4 | 9 | 2 | seated, 14 units | 1.00 | yes | no |
| K=6 | 4 | 15 | 1 | 1 | 0 | «цветньъх о дежд, дра гоцѳн .ных ковров.,» | 6 | 10 | 2 | seated (rescue), 11 units | 0.67 | yes | no |
| K=6 | 4 | 15 | 2 | 1 | 0 | «много естьъ у меня для пи ров серео» | 7 | 13 | 3 | seated, 17 units | 0.71 | yes | no |
| K=6 | 4 | 15 | 3 | 1 | 0 | «ра, для бесед крас ных слов, для ве» | 8 | 10 | 2 | seated, 13 units | 1.00 | yes | no |
| K=6 | 4 | 15 | 4 | 1 | 0 | «сель я вп на, для ве селья ви» | 7 | 12 | 2 | seated, 12 units | 0.86 | yes | no |
| K=6 | 4 | 16 | 2 | 1 | 0 | «е жѣ! тоеннинстео низтоетоезет» | 3 | 1 | 1 | seated, 16 units | 0.00 | no | no |
| K=6 | 4 | 17 | 1 | 1 | 0 | «заѵ, м зна. ю, на что трав вол І» | 6 | 8 | 2 | seated, 8 units | 0.33 | no | no |
| K=6 | 4 | 17 | 2 | 1 | 0 | «шебных, вол. шебных ищу; но я» | 5 | 9 | 2 | seated, 13 units | 0.80 | yes | no |
| K=6 | 4 | 17 | 3 | 1 | 0 | «знаю, знаю, о чем сам о собою грущу... г» | 6 | 13 | 3 | seated, 19 units | 1.00 | yes | no |
| K=6 | 5 | 18 | 1 | 1 | 0 | «»і, матерь бо .жия. нътне с мо» | 5 | 11 | 2 | seated, 13 units | 0.00 | no | no |
| K=6 | 5 | 18 | 2 | 1 | 0 | «литво ю пред тво и м образом, яр ким спянием,» | 7 | 17 | 3 | seated, 22 units | 0.00 | no | no |
| K=6 | 5 | 18 | 3 | 1 | 0 | «н е з а сво ю мо лю душу пустынну ю.» | 5 | 16 | 3 | seated, 18 units | 0.20 | no | no |
| K=6 | 5 | 19 | 2 | 1 | 0 | «да и еп сопутников. полны х вн и» | 5 | 9 | 2 | seated, 15 units | 0.80 | yes | no |
| K=6 | 5 | 19 | 3 | 1 | 0 | «п им, молодость св е тлую.» | 4 | 10 | 2 | seated, 16 units | 0.75 | yes | no |
| K=6 | 5 | 19 | 4 | 1 | 1 | «я сра цу не» | 3 | 11 | 2 | seated, 6 units | 0.67 | yes | no |
| K=6 | 5 | 20 | 1 | 1 | 1 | ««аъъъ «аълъъ» | 2 | 7 | 2 | seated, 3 units | 0.00 | no | yes |
| K=6 | 5 | 20 | 2 | 1 | 0 | «вани я. о матерь» | 2 | 6 | 1 | seated, 9 units | 1.00 | yes | no |
| K=6 | 5 | 20 | 3 | 1 | 0 | «і божи я, тебя молю!» | 3 | 7 | 2 | seated, 10 units | 1.00 | yes | no |
| K=6 | 5 | 21 | 1 | 1 | 0 | «за душу стран ника, в ми ре обез родно го,» | 9 | 12 | 2 | seated, 16 units | 0.89 | yes | no |
| K=6 | 5 | 21 | 2 | 1 | 0 | «і ѣѣ но я вручить хоз у» | 4 | 6 | 1 | seated, 10 units | 0.33 | no | no |
| K=6 | 5 | 21 | 4 | 1 | 1 | «Ге" мира хоподнохо» | 3 | 10 | 2 | seated, 13 units | 0.33 | no | no |
| K=6 | 5 | 21 | 1 | 2 | 0 | «за душу стран ника, в ми ре обез родно го,» | 9 | 12 | 2 | seated, 16 units | 0.89 | yes | no |
| K=6 | 5 | 21 | 2 | 2 | 0 | «і ѣѣ но я вручить хоз у» | 4 | 6 | 1 | seated, 10 units | 0.33 | no | no |
| K=6 | 5 | 21 | 3 | 2 | 0 | «душу не вин ну. ю теплой за ступнице» | 7 | 13 | 3 | seated, 19 units | 1.00 | yes | no |
| K=6 | 5 | 21 | 4 | 2 | 1 | «Ге" мира хоподнохо» | 3 | 10 | 2 | seated, 13 units | 0.33 | no | no |

## 4. Per-syllable (b) diff against the control

**K=4** (`cap/J2k4` against `cap/ctl2`): gained 0, lost 1, net -1.

| song | page | system | gained | lost |
|---|---|---|---|---|
| 3 | 11 | 4 | 0 () | 1 (листь) |

**K=6** (`cap/J2k6` against `cap/ctl2`): gained 0, lost 1, net -1.

| song | page | system | gained | lost |
|---|---|---|---|---|
| 3 | 11 | 4 | 0 () | 1 (листь) |

## 5. B: the second look on song 2 p5 s1 (the `[c181J2look]` lines)

Song 2's third page (ledger page 5). Control, `cap/ctl2/s2`: the first look seats the junk row «ее і п» (counted 1, free 18, 6 units; `[c181J] seat` run 1), so no second look is made on this system in the control: there are no `[c181J2look]` lines for it. K=4, `cap/J2k4/s2`: the floor 3 skips «ее і п» (counted 1), the system has no Russian row, and the second look makes four looks (K=6 gives the same four, floor 3, same text). Free 18, floor 3. Each look cuts three rows (system band split into text lines; the `cut` field of each `[c181J2look]` line holds each row's `offsetY` and `transform`; `down` and `up` shift the band by half a staff space, `wide` widens it by one each way, `stretch` rescales the grey tones: `underlay-looks.ts`, `lookWindow` and `stretchBand`).

| look (index) | row 0 words, counted, `rowLanguage` | first Russian row | counted | known | units after `assertVowelPerNote` | `scoreLook` |
|---|---|---|---|---|---|---|
| down (0) | none; row 1 none; row 2 «А ч Мепо шоззо» (2, other) | none | | | row 2: 7 | not Russian, 0 |
| up (1) | «у і жо» (1, other); row 2 «Мо и п зи паао о» (3, russian) | row 2 | 3 | 1 | 10 | Russian, 1 |
| **wide (2), kept** | **«та ста ѣ іЕѵѵ" ре» (4, russian)**; row 2 «Аз ѣ Мепо шовззо п» (3, russian) | row 0 | 4 | 3 | 7 | Russian, **3** |
| stretch (3) | «Р і» (0, other); row 2 «л. щ Мепо шоззо» (2, other) | none | | | row 2: 6 | not Russian, 0 |

Kept: `wide`, because `chooseLook` (`underlay-choose.ts:40-51`) keeps the look with the greatest `known` among those that pass, and 3 is greater than `up`'s 1. In plain words: `scoreLook` (`underlay-choose.ts:29`) counts only how many words of the first Russian row the dictionary holds, not whether the row's letters make words that fit the notes (units 7 against 18 free notes) and not how much of the row is junk. «та», «ста», and «ре» are short real words; «іЕѵѵ"» is counted and unknown, and «ѣ» is one letter so it is not counted. `rowLanguage` (`underlay-language.ts`, share 0.3 of counted words known) takes 3 known of 4 counted as Russian. The row is then seated in `seatPage` with 7 units on 18 free notes: (b) 0 in the system under the control and under both K. The truth lyric of the system is «Радость мгновень е; пейте до дна! Громки е песни грянь те, друзья!» (ledger `ledger-ctl2.tsv`); read by eye, no look's row carries any of its words (not machine-checked beyond the section 3 proxy). Rows in the `wide` look's row 2 «Аз ѣ Мепо шовззо п» also pass (a) at counted 3 and are not seated because the system seats once.

## 6. The seating sites found and patched (the rule's step 2), on `trees/S` after `patchJ2.py`

All three read on the tree this session; lines are of the patched files.

1. **First look's loop**, `apps/web/src/lib/omr/underlay-page.ts:321` (test (a): `floorOn && countedWords(words, seams.isWord) < floor`), the skip log at `:322`, test (b) at `:353` (`floorOn && units.length === 0`, after `assertVowelPerNote` at `:351`), `seated` set at `:357`. `free` read here is `freeNoteXs(tiesOnly)` (`:309`): the x of every note of the system that is not a continuation (`isContinuation`, `underlay-seat.ts:116`: tied into, under an extender, or in a slur); `free.length` is the count of notes that take a new syllable on the ties-only reading, which is what the rescue line already tested (`free.length > 0`, `:314`). I used it as the brief says; the slur-aware count (`seatFree`) differs by one or two on some systems and is read after the gate. The floor: `floorFor` at `:217`, set per system at `:311`.
2. **The rescue (fallback) row**, `underlay-page.ts:313-314` (`passes`, now `>= floor`) and the `fallbackRow` call with `floor` as its new third parameter; `apps/web/src/lib/omr/underlay-fallback.ts:60` (`minWords`, default `MIN_WORDS`, so every other caller is unchanged) and `:64`. The rescue row takes test (b) at the shared line `:353`. `MIN_WORDS` is imported from `underlay-fallback.ts` (`underlay-page.ts` imports it; not copied).
3. **The second look**, in two places. (i) The choice: `apps/web/src/lib/omr/underlay-choose.ts:29-33` (`scoreLook` takes `floor`, skips a row with fewer counted words) and `:40-44` (`chooseLook`); called with the system's floor at `apps/web/src/lib/omr/underlay-reader.ts:141-145`. This applies test (a) only. (ii) The seating: the kept look's rows are seated by the same `seatPage` (`underlay-reader.ts`, the re-seat after `kept.size > 0`), so sites 1 and 2 apply to it unchanged, including test (b). Test (b) is NOT applied inside `scoreLook`: it would need `cutUnits`, `foldClitics`, and `assertVowelPerNote` in the chooser, more than the gate. Consequence, not seen in these captures: a look that passes (a) in the chooser and has no unit after (b) in `seatPage` leaves the system unseated though another look might have passed.
4. `?rowfloor=on` (arm J): its code path is unchanged in behaviour (`floorOn` is true, `floor` is `MIN_WORDS`, the chooser's floor is 0). Its log lines gain `counted`, `free`, `floor`, `k` fields, and its `failed` text is unchanged. I did not run it.

## 7. Breaches, the control, what is not established, tokens

**Breaches** (the reader's console counter, "note(s) breaking one vowel per note over the sung notes (N with no syllable)", summed over a song's page lines, `work/sc.py`'s reading): control `cap/ctl2` 183 notes, 175 with no syllable (two-vowel: 8); K=4 `cap/J2k4` and K=6 `cap/J2k6` 145 notes each, 135 with no syllable (two-vowel: 10). Fewer empty sung notes (−40) because two systems are no longer seated from a junk row; two more notes with two vowels: NOT ESTABLISHED where (the counter has no system label; not searched).

**Control.** `rowfloor` absent: (b) 389 (49, 139, 33, 82, 86), (a) 429, the ledger `ledger-ctl2.tsv` equals `ledger-B0_S.tsv` on all 590 syllables (0 differences), and the musicxml of all five songs is byte-identical to the control capture of arm J (`cmp`).

**One build, one capture per arm.** The first two attempts were discarded and not scored: the first build lacked `static/omr/models/underlay/` (the page's tesseract worker failed to start, 0 syllables), the second had the model but not `&b0=full`. Both captures were thrown away (`failed/`, `failed2/`, `failed3/` in the workspace, not in the tarball) and the final captures were made from the same build with `&b0=full`. For the next measure: the underlay model comes from `omr-underlay/rus_prereform_r2_29000.traineddata` (md5 2ff2af3e33461cd64e7d2015ef21d10d, from `~/Downloads/_desk-2026-10-28/a2-inputs/`), `node apps/web/scripts/copy-underlay-model.mjs` after the build, and the three files copied to `apps/web/.svelte-kit/output/client/omr/models/underlay/` (vite preview serves that folder, not `build/`).

**Not established.** (1) Whether the 2 extra two-vowel notes of the K arms are on song 3's three new rescue systems. (2) The truth-row column of section 3 is a desk proxy (share of counted words found in the system's truth syllables), not a ruling. (3) Test (b) in the chooser, see section 6 item 3. (4) K=4 and K=6 decide every row the same; other K (1 to 3, 5, above 6) not run. (5) Why the control's first look on song 3 p11 s4 had no passing row while the rescue floor of 1 passes «л и стья шу»: the rescue sews words by the dictionary, `fallbackRow` in `underlay-fallback.ts`; the row's counted was 2 in both.

Token total: NOT ESTABLISHED as a count (no meter is visible to me); the work was long-running captures with short polls, and I did not reach the 260,000 ceiling by my own reckoning. Stopped at the end of the brief.

Harness: `/root/c181j2/` as `desk-row181-armJ2-harness_2026-11-08.tgz` (patches, scripts, scorer, ledgers, captures, console logs, report).
