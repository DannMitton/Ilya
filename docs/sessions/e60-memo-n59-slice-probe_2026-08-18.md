# RETURNED MEMO — N.59 tier 2, THE SLICE PROBE

**Returned by an Opus Claude Code session, 2026-08-18, against `58d7888`.**
Transcribed by the coordinating desk, unedited. The brief it answers is
`e60-brief-to-code-n59-probe_2026-08-18.md`.

**HEADLINE: NO, on three independent grounds. N.59 tier 2 is finished.**

---

```
tree:   58d7888, unmodified by me. The two staged entries are the desk's own
        adds. reader.py:15/:284/:376/:378-379 verified as stated.

Q1 END TO END:   NO. Stopped at line grouping, reader.py:291.
Q2 GATE 1:       not run — but FORECLOSED. 0 of 23 fixture pages survive.
Q3 GATE 2:       not run. Also: the three 1.000 pages are undefined anywhere
                 in the tree, so Q3 could not have been run as specified.
Q4 SINGLE s:     not reached — detect_staves raises before returning.
Q5 COST:         16.1x fixtures, 58.8x photograph, 17.1x control.
NEGATIVE CONTROL: stock fails at :376 — yes. Injected does not pass; it
                  raises earlier, at :354.
```

---

## Q1 — the candidate stage works, the grouping collapses

The injection is source surgery: **3 of 98 lines of `detect_staves` replaced, 94
executed verbatim**, with an assert that stops the probe if `reader.py`'s head
differs.

It raised on group sizes `[1,1,1,1,1,5,5,3,1,1,1,1]`. **That list is the
finding.** The tracker delivered 12 staves and 1,271 rows, and the staff-break
threshold cut them into **exactly twelve groups, one per real staff**. Then line
grouping collapsed five lines into one on ten of them.

| staff | shear | inter-line gaps | lines |
|---|---|---|---|
| 5 | −0.35° | −6, −7, −8, −7 | 1 |
| **6** | **−0.12°** | **6, 7, 6, 5** | **5 ✓** |
| **7** | **+0.11°** | **7, 8, 9, 9** | **5 ✓** |
| 8 | +0.19° | 3, 6, 4, 1 | 3 |
| 12 | +1.47° | −46, −47, −47, −48 | 1 |

**A negative gap means two adjacent staff lines overlap in row space.** On
staff 12, line 2 begins 48 rows before line 1 ends. No proximity rule separates
them because they are not separate. `:291` merges at ≤ 3 apart, so lines merge
once `D + thickness + 3 ≥ s`, that is `D ≥ 11` at `s ≈ 19`.

**Only the two staves within ±0.12° of flat survive — the two the existing
deskew was fitted to.** Slicing fixes candidate generation, which was never the
whole problem. I stopped rather than patching the grouping, and did not build
the dewarp.

---

## Two things you should see before deciding

**The control caught a Q2 failure I was not looking for.** On
`ilya-voice-page.png` the injected decider returns the same 8 staves at the same
`s`, but line positions move up to 3 px, and the sentinel goes from 0/40 rows
below `K_S` to **11/40**. So I ran the corpus: **0 of 23 identical, 10 raise
outright, 13 move 1–3 px, 2 change staff count.**

The ten raises are **not** shear; those are clean renders. **The comb matcher
over-detects on a clean page**, finding 9–12 combs where stock finds 6–10
staves: **lyric baselines form five-line combs.** Phase 0 listed this as a way
the instrument could lie, and on the corpus it does. That is the difference
between a diagnostic pointed at a page I already knew, and a decider that must
reject everything else.

I did not raise the peak threshold to suppress it. That is fitting against the
fixture corpus, and the brief withholds the authority.

**Substitution to declare.** I ran the corpus comparison and the timings after
Q1 had already said NO. Grounds: the injection control was mandatory, it is what
exposed the moving line positions, and n = 1 does not support "Gate 1 would
fail." It cost about a minute and turned Q2 from unknown into foreclosed. Q3 and
Q4 I left alone.

---

## The number the dewarp question was missing

**Grouping needs |shear| ≲ 0.12°, and this page carries 2.48° end to end.**

---
*Not committed by any agent. Dann commits.*
