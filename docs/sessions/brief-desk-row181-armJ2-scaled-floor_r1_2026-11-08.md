# Brief: row 181, arm J2, a row floor that scales with the system's free notes, and the second look's choice on song 2 p5 s1 (Sonnet helper, r1, 2026-11-08)

Measure only. Keep nothing in any repository: no commit, no push. NOT ESTABLISHED beats a complete invented answer.

Design: `docs/sessions/design-desk-reader-data-r3_r1_2026-11-08.md`, rank 2. Previous arm: `docs/sessions/report-desk-row181-armJ-row-floor_r1_2026-11-08.md` (arm J, a fixed floor of `MIN_WORDS` counted words: 371 against control 389, refuted). Read both in full before you build. QUEUE row 181.

## The question

Arm J failed two ways (its report, "Why"): (1) a fixed floor threw out true two-word rows in song 3's two-bar systems (23 rows skipped, all on test (a)); (2) on song 2 p5 s1 the floor skipped the junk row, then the second look seated another junk row («та ста ѣ іЕѵѵ" ре», 7 units). This arm asks:

- **A.** Does a floor that scales with the system's free notes keep song 3's true rows and still refuse the five junk systems?
- **B.** Why does the second look keep a junk row on song 2 p5 s1, and does the same floor, applied where the second look seats, refuse it?

## The rule (arm J2), behind `?rowfloor=scaled&k=<K>`

Start from the arm J harness (below), whose `work/patchJ.py` already adds `countedWords`, the `[c181J]` logging, and the gate in `apps/web/src/lib/omr/underlay-page.ts`. Read the lines it patches on your tree and cite what you read.

1. **The floor:** `floor = min(MIN_WORDS, max(1, ceil(free / K)))`, where `free` is the system's count of notes that take a new syllable, the same `free` the rescue line tests (`free.length > 0` in `patchJ.py`'s target line; confirm on your tree what `free` holds and cite it). `MIN_WORDS` is imported from `underlay-fallback.ts`, not copied. If `free` is not the right count of notes needing a syllable, say so, use the right one, and name it.
2. **Every site that seats a system from a row applies the same floor and the same test (b)** (at least one unit after `assertVowelPerNote`): the first look's loop, the rescue (fallback) row, and the second look. Find each site, cite it, and list them in the report. If a site cannot take the floor without changing more than the gate, say so and leave it as built.
3. A row that fails is logged and the next row tried, as arm J does. Add `free`, `floor`, and `k` to every `[c181J]` line (`skipped row` and `seat`).
4. With `rowfloor` absent the build must behave as B0 on arm S, byte for byte. `?rowfloor=on` must still give arm J's 371 (do not run it; keep its code path unchanged).

## B: the second look on song 2 p5 s1

On the control build and on J2 with K=4, log every look the second look makes on song 2 page 5 system 1: for each look, its index, how its cut differs, every row's words, `rowLanguage`'s answer, `countedWords`, units after `assertVowelPerNote`, and the score `scoreLook` gives it (`underlay-choose.ts:32` per the 2026-11-05 close; read and cite on your tree), and which look it keeps and why. Prefix `[c181J2look]`. Answer in plain words: what in `scoreLook` or `rowLanguage` lets «та ста ѣ іЕѵѵ" ре» win.

## Inputs (all on Dann's Mac through the bridge; stage them into your workspace)

- `~/Downloads/_desk-2026-11-08/desk-row181-armJ-harness_2026-11-08.tgz` (the arm J harness: `work/` with `patchS.py`, `patchB0.py`, `patchJ.py`, `run1.sh`, `measure_b0.mjs`, `score114_c181.py`, `sc.py`, the five PDFs, `ledger-ctl.tsv`, `ledger-J.tsv`; `cap/ctl/` and `cap/J/`). Start from it.
- `~/Downloads/_desk-2026-11-02/m0-inputs_2026-11-02.tgz` (row 114's truth under `_colleague-pages/`, the reader model, the a2 scorer), only if the harness tarball lacks something the scorer reads. Sealed set: open and score the FIRST file only. Never open the second Mussorgsky file.
- `~/Downloads/_desk-2026-11-04/desk-row181-b0-data_2026-11-05.tgz` (`ledger-B0_S.tsv`, the control's truth ledger).
- Repository: clone `https://github.com/DannMitton/ilya` with `--filter=blob:none`; fetch `cloud-lane-34`; worktree at `05db2dac`; apply `patchS.py`, then `patchB0.py`, then `patchJ.py`, then your J2 patch. Arm J's report records the tree it measured; match it.

Stage into `/root/c181j2/` in your workspace (Linux, Node, Playwright Chromium; `run1.sh` sets `PW_CHROMIUM_PATH`, check it exists on your machine and change it if not). If a path above is missing, say so and stop.

## Runs, one build, one capture per arm

1. **Control:** no `rowfloor`, all five songs, with B's logging. (b) must be 389 (49, 139, 33, 82, 86) and the ledger equal `ledger-B0_S.tsv` on all 590 syllables. If not, stop and report the difference.
2. **J2, K=4:** `?words=read&rowfloor=scaled&k=4`, all five songs, with B's logging.
3. **J2, K=6:** `?words=read&rowfloor=scaled&k=6`, all five songs.

Run at most two captures at once.

The desk's expectation, before the measure: K=4 keeps most of song 3's 23 rows (two-bar systems hold few free notes) and refuses the junk rows where 7 or more seats were lost; (b) between 380 and 420 for the better K; the second look on song 2 p5 s1 still keeps a junk row unless the floor reaches it, because `scoreLook` ranks looks by dictionary words in the first Russian row and short junk strings pass `isWord`. Likeliest failure: no K separates the true short rows from the junk rows, because both carry one or two counted words in systems of similar size.

## Report

`/root/c181j2/report-desk-row181-armJ2-scaled-floor_r1_2026-11-08.md`, ledgers beside it as `ledger-ctl2.tsv`, `ledger-J2k4.tsv`, `ledger-J2k6.tsv`:

1. The answer first: (b) and (a) of 590 for control, K=4, K=6, per song.
2. The five junk systems (song 2 p5 s1, song 1 p2 s1, song 5 p19 s1, song 5 p20 s1, song 5 p21 s3) under each K: the row seated before and after, its counted words, `free`, `floor`, seats gained and lost.
3. Every row tried under each K, as one table: song, page, system, row, words, counted words, `free`, `floor`, passed or which test failed, and whether the arm J report or the ledger shows that row as the system's true lyric row. This table is what lets the desk choose K from data.
4. Per-syllable (b) diff of each K against the control: gained, lost, by system.
5. B's answer: the looks on song 2 p5 s1, their scores, which won, why, in plain words, with the lines read.
6. The seating sites found and patched (step 2 of the rule), each with its file and line.
7. Breaches (two-vowel or empty sung notes); the control; what you could not establish; your token total.

Reply with three lines: (b) for each K and per song; the five systems' outcome and B's answer in one line; the report path.

## Rules

- Every number names its arm, tree, and file. One capture per arm; say so.
- Write nothing outside `/root/c181j2/`. Nothing on the Mac but reading the inputs and writing the tarball below.
- Stop at 260,000 tokens and write what you have, saying where you stopped.
- Before you stop, whatever the result, save your working harness (scripts, patches, scorer, ledgers, logs, report; not `node_modules`, not the clone) as one tarball to the Mac at `~/Downloads/_desk-2026-11-08/desk-row181-armJ2-harness_2026-11-08.tgz`, so the next measure starts from it.
