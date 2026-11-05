# Brief: row 181, why word-exact (c) fell, three arms on row 114 f1, with the joined pairings dumped (Sonnet helper, r1, 2026-11-04)

Measure only. Keep nothing in any repository. NOT ESTABLISHED beats a complete invented answer.

## The question

On row 114's first file (songs 1 to 5, 590 printed syllables), the evening's re-measure gave exact seats (b) 376 on `cloud-lane-34` tip `05db2dac` against 369 on the control, but word-exact (c) 99 against 121 (the old tip `4e5e5dbc` had 112). Why did (c) fall? The desk's lead, to test, not to assume: step 8a made the print's long dash a joint, so a word now sews across it (`apps/web/src/lib/omr/underlay-tokens.ts:55` at `05db2dac`); on the control it was an empty mark and the word did not sew across it (`:51` at `9088d26c`).

## Read first, in full

- The evening re-measure: `docs/sessions/report-desk-row181-remeasure_r1_2026-11-04.md` on `Shane` (its method is the one to rebuild).
- The first measure: `docs/sessions/report-desk-row181-measure_r1_2026-11-04.md` on `Shane`.
- `/root/m0/BRIEF-m0-ledger_r1_2026-11-02.md` and `/root/m0/report-desk-m0-row114-ledger_r1_2026-11-02.md` (the original method on this file).
- Step 8's reports on `cloud-lane-34`: `docs/sessions/report-code-row181-step8a-8b_r1_2026-11-05.md`, `report-code-row181-step8c_r1_2026-11-05.md`.

## Inputs

- Clone: `/home/claude/ilya` (GitHub `DannMitton/Ilya`, blob-filtered; `git fetch origin <branch>` as needed). Make your own worktrees under `/root/c181/`; do not touch `/home/claude/ilya`'s checkout.
- Row 114 and truth: `/root/m0/_colleague-pages/` (the PDF `mussorgsky-1967-songs-01-05.pdf`, truth in `truth/`). DESK DEFAULT, sealed set: open and score the FIRST file only. Never open the second Mussorgsky file.
- Scorer: `/root/m0/score114.py`. It imports `/root/m0/unpacked/desk-n135-a2-lean_2026-10-28/a2/scorer`; unpack `/root/m0/_desk-2026-10-28/desk-n135-a2-lean_2026-10-28.tgz` into `/root/m0/unpacked/` first. Earlier browser instruments: `/root/m0/_desk-2026-10-29/browser-measure_2026-10-29.tgz` (`runsong.sh`, `runall.sh`), unpack and reuse.
- Reader model: `/root/m0/_desk-2026-10-28/a2-inputs/` (if the build needs it).
- Playwright and Chromium are installed (`require('playwright')`); do not reinstall.

## The three arms, one sitting, same build method and browser

1. **Control:** `Shane` at `bfeb8e9d` (its app code equals `9088d26c`, the 369 control).
2. **Tip:** `cloud-lane-34` at `05db2dac`.
3. **Arm S:** the tip with one line changed in the worktree only: `underlay-tokens.ts:55` back to the control's behaviour, `out.push({ ...token, text: longDash ? '' : text });`. Nothing else.

Each: build the app, serve the preview, run each song's pages in headless Chromium with `?words=read`, wait for the join to finish (its `[ilya] poem join:` console line), fresh context per song, capture the MusicXML the page ingests and the console. **Control the instrument first:** the control must reproduce 369 (48, 136, 29, 82, 74) and (c) 121; if not, stop and report.

## For each arm

1. (b), (a), (c) per song and total, from `score114.py`, and its ledger TSV (rename per arm).
2. **The (c) diff.** Every syllable with c=1 on the control and c=0 on the tip, one row each: song, page, system, truth syllable, truth word, b on each arm, the app's sewn word on control, tip, and arm S, and the cause class: (i) b lost; (ii) b kept, the app word joined a neighbouring word; (iii) b kept, the app word split; (iv) other, said in words. Also the reverse list (c=0 control, c=1 tip). State whether arm S restores (c), and what it does to (b).
3. For classes (ii) and (iii), say whether a long-dash token stands at the join or split, from the console's token lines where they show it; where they do not, NOT ESTABLISHED.

## The joined pairings (tip only)

After the join, dump each song's pairings from the page (the evening's helper rebuilt MusicXML from them with a `pair2xml.py`; find how the app holds them, IndexedDB or the page's store, and say which) to `/root/c181/pairings/songN.json`, unchanged, with the MusicXML captured on the same run beside it. Do not score them; a second helper writes that scorer.

## Rules

- Every number names its arm, tree, and file. One capture per arm; say so.
- Scratch under `/root/c181/work/`. Write no file outside `/root/c181/`.
- Stop at 220,000 tokens and write what you have, saying where you stopped.

## Output

`/root/c181/report-desk-row181-c-drop_r1_2026-11-04.md`: the answer first (the cause of the (c) drop in one sentence with its count, and whether arm S restores it); the counts table for three arms; the (c) diff summary by class with ten example rows; the pairings files written; the control; what you could not establish. The full diff as `/root/c181/c-diff.tsv`. Reply with three lines: the cause and count, arm S's (b) and (c), the report path.
