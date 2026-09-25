# Brief for Code, r1: match the KVP2 p. 141 quotation to the page's punctuation

Written by the desk 2026-09-25 while Dann was away. **Not yet approved by Dann. Do not run until he says so.**

## Why

`apps/web/src/lib/shane/advice-resolver.ts:236-237` quotes Bozeman, *Kinesthetic Voice Pedagogy 2* (2021), p. 141. The words are right. The punctuation is not the page's.

The desk read the page itself on `~/Downloads/IMG_4850.HEIC` (pp. 140 and 141), 2026-09-25. The page reads:

> Formant tracking: the tuning of a resonance to follow or track a specific harmonic, such as fR1:1fo tracking of whoop timbre (upper treble voice strategy) or fR1:2fo tracking of the yell or of belting.

The code has `such as fR1:1fo, tracking of whoop timbre, upper treble voice strategy`: a comma the page does not have after `1fo`, and commas where the page has parentheses.

**Do not change "harmonic" to "formant".** A Sonnet extraction of 2026-09-25 said the page reads "formant" and recommended that change. The desk read the page. It says "harmonic". The extraction row is corrected (`claims_bozeman-KVP2_2026-09-25.csv`, KVP2-052).

The p. 96 quotation on line 234 is exact and needs nothing (KVP2-051, corrected the same way).

## The change

In `GODIN_HOWELL_TRACKING_CITATION`, lines 236 and 237, make the quoted span read exactly:

```
a specific harmonic, such as fR1:1fo tracking of whoop timbre (upper treble voice strategy)
```

so the closing of the quotation reads `...(upper treble voice strategy)");`. Change nothing else in the constant.

## Done when

- `grep -n "fR1:1fo tracking of whoop timbre (upper treble voice strategy)" apps/web/src/lib/shane/advice-resolver.ts` returns one line.
- The five gates are at baseline.
- The string is not shown to a singer in French or English as UI text (it is a citation constant); if it is, report where.

## Report

A memo of five lines or fewer: the diff, the gate results, and anything NOT ESTABLISHED. **NOT ESTABLISHED beats a complete invented answer.**
