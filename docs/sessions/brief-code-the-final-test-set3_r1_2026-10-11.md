# Brief for Code on the Mac: the final test on held-out set 3, r1

Written by the desk (Opus) 2026-10-11 19:15. QUEUE row 76. For Code on Dann's Mac, Sonnet, after the ship that carries row 74 is deployed. **Measures only: no app code changes and no scorer changes.** Same protocol as row 55 (`brief-code-the-final-test_r2_2026-10-08.md`, read whole), with the changes below.

## Why

THE ONE THING: the reader reads at least 95 of every 100 printed notes on songs it has never seen, on the singer's path. Every earlier unseen song is now opened or spent. Set 3 is ten fresh songs, chosen 2026-10-11 from a treble repertoire list; no reader has run on them. **The set gets one run.**

## What the desk checked before writing this (19:10, through the bridge, node 22.23, tsx)

- `final-line.ts` against each of the ten truth files' own `conv.py` round trips: 10 of 10 score 100.0, octave shift 0, every judged bar's metre as printed; total 1458 of 1458.
- A planted control (one pitch up a semitone, one length changed, one note removed, on one song): 67 of 70, missing 1, pitch misreads 1, length misreads 1.
- The truth files carry two fields row 55's did not, `syllable` and a `reason` on UNSURE entries; the script reads them without fault.

## The run

1. Confirm the deployed site (`https://ilya-git-shane-dannmittons-projects.vercel.app`) serves the commit named in the prompt.
2. **Rehearsal** on K (Ippolitov-Ivanov) and M (Lyadov), corrected truth for K, as row 74 read them: their counts must equal row 74's rule-on lines (`report-code-m-and-p-after-the-metre_r1_2026-10-11.md`, step 3). If one differs, stop and report.
3. **The ten.** Scans: `~/Downloads/_desk-heldout3-private/truth/*.pdf` (the cut single songs; **not** the full sets one folder up, and nothing in `partial/`). Truth: the `.truth.json` of the same stem beside each. Letters Q to Z, in the order the glob returns them. **You do not open, view, list, or print any scan, truth, reading, or bar.** Drop each as in the rehearsal and run
   `tsx docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts song <letter> <webgpu or wasm> <truth.json> <read.json> <private folder>/keep`
4. **A refusal** scores 0, exactly as row 55's step 4.
5. Then `final-line.ts total <private folder>/keep`.

## Known before the run (so the report does not rediscover them)

- 17 notes are marked UNSURE, most in two songs whose voice splits between the Russian and another language's underlay; the truth records the Russian line.
- One song carries 6 grace notes in `graceNotes`, outside the scored events.
- The truth files are drafts by two helpers, checked bar by bar for sums and round trips, not proofed by Dann. One bar was read by Dann.

## What it prints, and then stop

The two rehearsal lines, the ten lines Q to Z, and the total, unedited. **Then stop.** Do not diagnose a BELOW song and do not open `keep`: opening a song is Dann's decision.

## Report

`docs/sessions/report-code-the-final-test-set3_r1_2026-10-11.md`: the commit checked and how, the adapter, the rehearsal lines beside row 74's, the ten lines and the total verbatim, any refusal, and "Could not establish". NOT ESTABLISHED beats a complete invented answer. No git command that writes. Do not edit `docs/memory/`.
