# Report: row 181, arm J, a Russian row must carry words enough to seat (desk, r1, 2026-11-08)

Brief `brief-desk-row181-armJ-row-floor_r1_2026-11-08.md` (finding 1 of `review-fable-design-r2_r1_2026-11-05.md`, the review's arm R). Built and captured by a Sonnet helper 20:01 to 20:48 (control and arm J, five songs each, one capture per arm, headless Chromium, `?words=read`); the helper was stopped before scoring (the desk's interrupted call of 20:11) and cannot be resumed. Scored by the desk 23:0x with the helper's scorer (`/root/c181j/work/score114_c181.py`, the 2026-11-05 scorer with paths moved). Measure only; nothing committed. Row 114 first file only.

## Answer

| (b) exact of 590 | s1 | s2 | s3 | s4 | s5 | total | (a) |
|---|---|---|---|---|---|---|---|
| control: B0 on arm S, `?rowfloor` off | 49 | 139 | 33 | 82 | 86 | **389** | 429 |
| arm J: `?rowfloor=on` | 49 | 137 | 17 | 82 | 86 | **371** | 409 |

The control reproduces B0 on arm S exactly: 389 per song as reported 2026-11-05, and its ledger equals `ledger-B0_S.tsv` on all 590 syllables (0 differences). The instrument holds.

**Arm J loses 18 seats net (−20, +2).** By system: song 2 p6 s4 −2; song 3 p7 s4 −6, p8 s2 −2, p8 s4 −1, p9 s2 −3, p10 s2 −3, p11 s4 −3, p9 s3 +2.

## Why, from the `[c181J]` console lines

1. **The five junk-row systems are not recovered.** The floor skips their junk rows as designed (song 1 p2 s1 «п з п ь Гг.», song 2 p5 s1 «ее і п», counted 1 word), but the system then goes to the second look, which seats another junk row (song 2 p5 s1: «та ста ѣ іЕѵѵ" ре», 7 units). Seats there: unchanged.
2. **A fixed floor of three counted words throws out true lyric rows in short systems.** Song 3's systems hold two bars each; real rows such as «І Листья шумели у…», «І У гроб, о за…», «ный луной.» count two dictionary words and fail (a). 23 rows skipped in all, every one on (a); none on (b).

## What it changes for the design (r3, rank 2)

The review's rule as written is refuted on row 114 f1. Two leads, untested: a floor that scales with the system's free notes (a two-bar system cannot carry three words); and the second look's own choice (`scoreLook`, `underlay-choose.ts:32` per the 2026-11-05 close), which here keeps a junk look. Rank 2 is held until one of them is measured.

## Not established

Why the second look's chosen row on song 2 p5 s1 passes `rowLanguage`; whether a free-note-scaled floor recovers the five systems; the helper's token count (stopped mid-task).
