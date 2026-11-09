# Brief: row 181, the long dash decided by the dictionary, one arm on row 114 f1 (Sonnet helper, r1, 2026-11-05)

Measure only. Keep nothing in any repository: no commit, no push. NOT ESTABLISHED beats a complete invented answer.

## The question

On row 114's first file (songs 1 to 5, 590 printed syllables), `cloud-lane-34` tip `05db2dac` sews a word across every long dash (`apps/web/src/lib/omr/underlay-tokens.ts:50-55`): exact seats (b) 376. Arm S splits at every long dash: (b) 385. The desk classed 26 long-dash junctions against the print by hand: always-join is right on 17, always-split on 9, and the rule below on 20. Does the rule below keep arm S's seats and the tip's?

Seats differ between tip and arm S on two systems only (ledgers in `/root/c181/prev/`): song 5 page 21 system 3 (tip 0, arm S 12) and song 2 page 3 system 1 (tip 3 more than arm S). Why the tip seats nothing on song 5 page 21 system 3 is NOT ESTABLISHED; the desk's lead, untested, is that its long unknown sewn words fail `rowLanguage` (`RUSSIAN_SHARE` 0.3, `underlay-language.ts:33`). Settle it from the console lines if you can.

## The rule (arm D)

At each long-dash token (`Token.longDash === true`), decide join or split by Ilya's own dictionary, the same `isWord` that `rowLanguage` uses (find where it is passed; cite the lines you read):

- `left` is the word the row's tokens sew up to and including the syllable before the dash; `right` is the word they sew from the syllable after the dash, as if the dash split there. Compare letters only: lower case, ё as е, no punctuation.
- **Join** when `left + right` is a dictionary word, or when neither `left` nor `right` is one.
- **Split** otherwise (the dash then behaves as on arm S: `out.push({ ...token, text: '' })`, the control's line).

Build it behind a URL switch `?longdash=dict` in a worktree only, so one build serves both arm D and its control. Where joins chain (a word across two dashes), decide each dash left to right, with `left` the word built so far.

## Read first

- `/root/c181/prev/work/measure_c181.mjs`, `runarm.sh`, `score114_c181.py`: the method of the 2026-11-05 night measure, to reuse. The scorer imports `/root/m0/unpacked/desk-n135-a2-lean_2026-10-28/a2/scorer` (in place).
- `/root/m0/BRIEF-m0-ledger_r1_2026-11-02.md` and `/root/m0/report-desk-m0-row114-ledger_r1_2026-11-02.md`.

## Inputs

- Clone `https://github.com/DannMitton/ilya` to `/root/c181/ilya` with `--filter=blob:none`; fetch `cloud-lane-34`; worktree at `05db2dac` under `/root/c181/trees/D`. Playwright Chromium is at `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
- Row 114 and truth: `/root/m0/_colleague-pages/` (`mussorgsky-1967-songs-01-05.pdf`, truth in `truth/`). Sealed set: open and score the FIRST file only. Never open the second Mussorgsky file. Cut the PDF into `song1.pdf` to `song5.pdf` as the earlier measure did (find how from its files; say how).
- Reader model: `/root/m0/_desk-2026-10-28/a2-inputs/` if the build needs it.

## Runs, one sitting, one build

1. **Control the instrument:** the build without `?longdash=dict` on songs 2 and 5 must give the tip's 139 and 74 exactly (deterministic over three captures, per `docs/sessions/report-desk-row181-b0_r1_2026-11-05.md`). If not, stop and report.
2. **Arm D:** all five songs with `?words=read&longdash=dict`, waiting for the join's `[ilya] poem join:` line as before.

The desk's expectation, stated before the measure: (b) at least 385, song 5 at 86 if page 21 system 3 is read, song 2 at 139. Likeliest failure: the rule decides a dash on a garbled `left` or `right` (a misread is not a dictionary word), so it joins where the print splits.

## Report

`/root/c181/report-desk-row181-longdash-dict_r1_2026-11-05.md`:

1. The answer first: arm D's (b) of 590 against tip 376 and arm S 385, per song, with (a).
2. Per-syllable (b) diff of arm D against `ledger-tip.tsv` and `ledger-armS.tsv`.
3. A junction log: every long dash on the five songs, with song, page, system, `left`, `right`, the decision, and whether each side was a dictionary word.
4. The cause of song 5 page 21 system 3 on the tip, or NOT ESTABLISHED.
5. The control; what you could not establish; your token total.

Also the ledger as `/root/c181/ledger-D.tsv`. Reply with three lines: arm D's (b) and per song, the cause on song 5 page 21 system 3, the report path.

## Rules

- Every number names its arm, tree, and file. One capture per arm; say so.
- Write nothing outside `/root/c181/` and `/root/m0/`.
- Stop at 180,000 tokens and write what you have, saying where you stopped.
