# Report: T2 slur-aware free notes, row 114 first file (desk, r1, 2026-11-02)

Helper B (Sonnet) measured 14 of 15 song runs, then the workspace restarted and the helper was lost before it wrote a report. The desk re-ran the one lost run (ungated arm, song 5) and scored all three arms with B's scorer `score114b.py`. Scratch diff `scratch-t2.diff`; ledgers `ledger-ctl.tsv`, `ledger-t2.tsv`, `ledger-t2u.tsv`.

## Answer (exact seat, (b), of 590)

| song | printed | control | T2 gated (Dann's count rule, 2026-10-20 03:37) | T2u ungated |
|---|---|---|---|---|
| 1 | 81 | 48 | 52 | 52 |
| 2 | 189 | 136 | 137 | 137 |
| 3 | 68 | 29 | 29 | 29 |
| 4 | 121 | 78 | 84 | 87 |
| 5 | 131 | 72 | 71 | 71 |
| total | 590 | 363 | 373 (+10) | 376 (+13) |

Control reproduces helper A's T1 (363) and its per-song numbers exactly. Fable's bar for T2 was +12: the gated arm misses it by 2; the ungated arm meets it, but the ungated arm is not Dann's ratified rule.

## Loss by stage

| stage | control | T2 gated | T2u |
|---|---|---|---|
| seating | 38 | 28 | 24 |
| letters | 32 | 33 | 33 |
| letters, no token carries it | 64 | 62 | 62 |
| token splitting | 28 | 29 | 30 |
| row not cut or read | 57 | 57 | 57 |
| note not read by homr | 8 | 8 | 8 |

The gain is in seating. Song 5 loses 1 in both arms; which syllable is NOT ESTABLISHED in this report (in the ledgers).

## Not established

Song 2 of the gated arm failed once (no MusicXML after 50 minutes) and succeeded on the re-run. Cross-machine spread is not measured. The reason for the 3-syllable difference between arms is not traced.

## Added 2026-11-02 21:4x: the strict arm (Dann's ruling as written)

The slur reading taken per system only where the slur-aware free count equals the units and the ties-only count does not (`VITE_ARM=T2s`, `/root/desk/D/`, one run per song): **369 of 590** (48, 136, 29, 82, 74), +6 over the control; no song below it. Loss by stage: seating 33, letters 33, no token carries it 63, token splitting 27, row not cut 57, note not read 8. From the captured voice-part MusicXML: lyrics 468, notes with two or more vowel letters 5, untied notes without a lyric 210, all equal to the control; the gated "equal or nearer" arm has 466, 7, and 212 (two new notes of two vowels, against `CONTRACT.md` §0.1). Fable's review (`review-fable-row177-and-pw-r2_r1_2026-11-02.md`) rules the strict arm the one Dann ruled; row 177 builds it.
