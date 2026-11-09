# Brief: row 181, arm J, a Russian row must carry words enough to seat, one arm on row 114 f1 (Sonnet helper, r1, 2026-11-08)

Measure only. Keep nothing in any repository: no commit, no push. NOT ESTABLISHED beats a complete invented answer.

Source of the rule: finding 1 of Fable's review `docs/sessions/review-fable-design-r2_r1_2026-11-05.md` (the review calls this arm R; the desk calls it arm J). Read finding 1 in full before you build.

## The question

On row 114's first file (songs 1 to 5, 590 printed syllables), B0 on arm S gives exact seats (b) 389 (per song 49, 139, 33, 82, 86; `report-desk-row181-b0_r1_2026-11-05.md`). Fable's review counts 61 of arm S's 205 lost seats in five systems that `seatPage` seated from a junk row, because `rowLanguage` passes a row with one short dictionary string and the first passing row seats the system and counts it written:

| song | page | system | junk row seated | lost (arm S ledger) |
|---|---|---|---|---|
| 2 | 5 | 1 | `["ее","іп"]` | 18 |
| 1 | 2 | 1 | `["п","з","пь","Гг.\\"]` (second look) | 15 |
| 5 | 19 | 1 | `["І","Іст"]` | 9 |
| 5 | 20 | 1 | `["«аъъъ","«аълъъ"]` | 7 |
| 5 | 21 | 3 | `["ѣѣ"]` | 12 |

Does a floor on the seating row recover those seats without losing any elsewhere?

## The rule (arm J), behind `?rowfloor=on`

In `apps/web/src/lib/omr/underlay-page.ts`, where a row is chosen to seat the system (the review cites `:276-287` and `:303` at `05db2dac`; read the lines on your tree and cite what you read):

1. A row seats the system only where (a) it passes `rowLanguage` with at least `MIN_WORDS` counted words (the fallback's floor, `underlay-fallback.ts:27`; import the constant, do not copy it), and (b) after `assertVowelPerNote` it yields at least one unit.
2. A row that fails (a) or (b) is counted (log `[c181J] skipped row` with song, page, system, row index, its words, and which test failed) and the next row is tried.
3. A system with no row that passes is treated exactly as `no Russian row` today: the second look and the banner as built.

With the switch off, the build must behave as B0 on arm S, byte for byte.

## Read first

- `docs/sessions/review-fable-design-r2_r1_2026-11-05.md`, findings 1 and 5.
- `docs/sessions/report-desk-row181-b0_r1_2026-11-05.md` and `report-desk-row181-language-both-readings_r1_2026-11-05.md` (the harness, the control, the callers of `rowLanguage`).
- The harness scripts, in the archives below: `work/measure_c181.mjs`, `work/runarm.sh`, `work/score114_c181.py`, `measure_b0.mjs`, `patch.py` (B0), `sc.py`.

## Inputs (all on Dann's Mac through the bridge; stage them into your workspace)

- `~/Downloads/_desk-2026-11-02/m0-inputs_2026-11-02.tgz` (row 114's PDFs and truth under `_colleague-pages/`, the reader model, the a2 scorer). Sealed set: open and score the FIRST file only. Never open the second Mussorgsky file.
- `~/Downloads/_desk-2026-11-04/desk-row181-c-drop-data_2026-11-05.tgz` (harness `work/`, ledgers `ledger-tip.tsv`, `ledger-armS.tsv`).
- `~/Downloads/_desk-2026-11-04/desk-row181-b0-data_2026-11-05.tgz` (B0 patch, `ledger-B0_S.tsv`).
- `~/Downloads/_desk-2026-11-02/m0/` (`BRIEF-m0-ledger_r1_2026-11-02.md`, the m0 report, `score114.py`).
- Repository: clone `https://github.com/DannMitton/ilya` with `--filter=blob:none`; fetch `cloud-lane-34`; worktree at `05db2dac`. Arm S is that tip with `underlay-tokens.ts:55` returned to the control's line (`out.push({ ...token, text: '' })` at `9088d26c` `:51`); apply B0 with its `patch.py`. Arm J adds the rule above on that tree.

Stage into `/root/c181j/` in your workspace (Linux, Node, Playwright Chromium). If a path above is missing, say so and stop.

## Runs, one sitting, one build

1. **Control the instrument:** the build without `?rowfloor=on`, all five songs: (b) must be 389 (49, 139, 33, 82, 86) and its ledger equal `ledger-B0_S.tsv` syllable for syllable. If not, stop and report the difference.
2. **Arm J:** all five songs with `?words=read&rowfloor=on`, waiting for the join's `[ilya] poem join:` line as before.

The desk's expectation, stated before the measure: the five systems no longer seat from their junk row; (b) between 389 and 450 (ceiling +61); no system that seated right on the control loses a seat; breaches (two-vowel or empty sung notes) 0. Likeliest failure: the second look on those systems also returns no Russian row, so they fall to the banner and the gain is small; second likeliest, a true lyric row of one or two words now fails (a) and is lost.

## Report

`/root/c181j/report-desk-row181-armJ-row-floor_r1_2026-11-08.md`, with the ledger beside it as `ledger-J.tsv`:

1. The answer first: arm J's (b) of 590 against the control 389, per song, with (a).
2. Per-syllable (b) diff of arm J against the control: gained, lost.
3. Every system whose seated row changed: song, page, system; the old row's words; the new row's words or `no Russian row`; whether the second look ran and what it kept; seats gained and lost there.
4. Every skipped row (the `[c181J]` lines), counted by which test failed.
5. Breaches; the control; what you could not establish; your token total.

Reply with three lines: arm J's (b) and per song, the five systems' outcome in one line, the report path.

## Rules

- Every number names its arm, tree, and file. One capture per arm; say so.
- Write nothing outside `/root/c181j/`. Nothing on the Mac but reading the inputs.
- Stop at 260,000 tokens and write what you have, saying where you stopped.
- Before you stop, whatever the result, save your working harness (scripts, built trees' patches, scorer, ledgers, report; not node_modules, not the clone) as one tarball to the Mac at `~/Downloads/_desk-2026-11-08/desk-row181-armJ-harness_2026-11-08.tgz`, so the next measure starts from it.
