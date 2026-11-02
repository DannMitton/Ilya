# Brief: the scan path keeps one vowel per note, and a word far from every sung note is not a lyric (Code, cloud lane, r2, 2026-11-02)

**SUPERSEDED 2026-11-02 14:0x by r3.** Do not send this version.

Written by the desk (Opus) from a measure on row 114's first file (songs 1 to 5, the diagnosis half; the second file stays sealed for the gate). NOT Fable-reviewed until its review file sits beside it.

## Why

Dann's gate: the words from a scan reach 9 of 10 syllables exactly on row 114. On the app's own path (`Shane` `9fa20430`, built, headless Chromium, `?words=read`), songs 1 to 5 seat **328 of 590** exactly (`~/Downloads/_desk-2026-11-02/m0/report-desk-m0-row114-ledger_r1_2026-11-02.md`, ledger beside it). The desk found two causes by reading the ledger and the pages, then measured each as a scratch change on the same tree, same five PDFs, same scorer (the before-run reproduced 328 exactly):

1. **A vowelless token takes a note on the scan path.** `CONTRACT.md` §0.1 (Dann 2026-10-29 01:18): a word with no vowel letter takes no note. `apps/web/src/lib/omr/underlay-clitics.ts:28-33` departs from it on purpose: "a vowelless word the transcription does not call a clitic stays a unit of its own, because on a scan such a token is often a misread letter". On row 114, 38 notes were seated with a vowelless cut («І», «п», «ч», «т», «н», «м», …), and a stray «І» or «і» (a bar line or bracket read as a letter) counts as a vowel because `VOWEL` holds і (`underlay-units.ts:24`). 47 of the 69 seating losses sat in systems where this happened. Scratch rule: after the folds, a unit with no `VOWEL` letter takes no note, and a unit whose only letters are a single і, ѣ, or ѵ with no modern vowel takes no note. **Result: 328 to 355 (+27).**
2. **Russian text in the score that is not sung is seated.** Song 1 prints the cue «Дудка» over the piano's upper staff (page 2 of the print, bars 1 to 2, while the voice rests); it is read as the lyric row's first word and takes the voice's first two notes, so the line slides two notes. Scratch rule, inside `seatTokens`' `monotone` branch (`underlay-seat.ts`, the call to `monotone`): a syllable token whose nearest free note is more than twice the median gap between consecutive free notes is left unseated. **Result, on top of rule 1: 355 to 363 (+8, all song 1).** Together +35, 55.6 to 61.5 percent.

## Lane

Sonnet. Branch `cloud-lane-28` from `Shane` at its tip. Push only that branch; never `Shane` or `main`; no pull request; nothing under `docs/memory/`; no `brief-*` or `review-*` file. One commit and one report per step at `docs/sessions/report-code-n135-scan-vowel-rules-step<n>_r1_2026-11-02.md`.

## Steps

**Step 0.** All eight gates on the cut; record them.

**Step 1, rule 1.** In `underlay-clitics.ts`, replace the departure: a unit of the row with no vowel letter takes no note on any path; a known proclitic or enclitic still rides its host as today; any other vowelless unit is dropped from the units that are seated (it is not written into `<lyric>`; the print's letters are not altered, the unit is not sung). A unit whose letters are a single і, ѣ, or ѵ alone is a stray mark and dropped likewise. Rewrite the header comment to say this and cite §0.1. Update `vowels-per-note.ts` and the console counts only if a count now reads differently; say what changed.

**Step 2, rule 2.** In `seatTokens` (`underlay-seat.ts`), for `monotone`: a syllable token whose distance to its nearest free note exceeds `FAR_FACTOR` (2) times the median gap between consecutive free notes of the system is left unseated (`unseated: true`, by `monotone`). `FAR_FACTOR` is one named, commented constant. With fewer than two free notes the rule does not apply.

**Step 3, tests.** Unit tests for both rules (a vowelless unit between two syllables; a lone «І» at a row's start; a token over the piano intro while the voice rests; a long note followed by a wide gap, where the token under the long note must still seat). Every pin that changes, with was and now.

## Every other site (CONTRACT §4)

`apps/web/src/lib/score/pairings.ts` (`buildSlotQueue` folds a vowelless non-proclitic word leftward, per the comment at `underlay-clitics.ts:28-30`) decides the same question for typed text; this brief does not change it, and the report says whether the two paths now agree for a vowelless word. `omr/vowels-per-note.ts` checks one vowel per note after seating. `omr/underlay-units.ts` `VOWEL` and `score/vowel-resolver.ts` `CYRILLIC_VOWEL` stay equal.

## Measure (the desk runs it)

The desk re-runs row 114 songs 1 to 5 on the lane's build with its scripts and expects at least 363 of 590 exact; a difference goes to the report.

## Report

What changed; the gate lines; pins changed; what you could not establish. NOT ESTABLISHED beats a complete invented answer.

## r2 (2026-11-02 13:5x): Dann's rule, no exceptions

Dann 2026-11-02 13:46 (`CONTRACT.md` §0.1, NO EXCEPTIONS): a note must be assigned a vowel; singers sing on vowels; no exceptions. Added to this brief, and it wins over anything above:

**Step 4, the rule enforced, not counted.** Every path that writes text under notes (the scan path, `seatTokens` and the clitic fold; typed Lyrics and Poem through `score/pairings.ts`; an imported file's lyrics on arrival; typed edits in the Loupe and Corrections) passes through one shared check before a syllable reaches a note: a syllable with no vowel letter is never written under a note. On the scan path it is dropped (not sung); on every other path a vowelless word joins its host as `buildSlotQueue` does today. `omr/vowels-per-note.ts` stops being a count of breaches and becomes that check or calls it. A test fails if any path can write a vowelless syllable under a note, run over every fixture and truth file in the tree. Name every path you found and the line where it now passes the check.
