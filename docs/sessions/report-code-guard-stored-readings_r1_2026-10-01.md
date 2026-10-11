# Report: a stored reading the guard never judged gets its verdict before it anchors anything (r1)

**QUEUE row 11, state: WRITTEN, pushed to `cloud-lane`.** The "after Dann reads it" gate on this row was dropped by the desk (2026-10-11). The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-guard-stored-readings_r1_2026-10-01.md`, on `cloud-lane` after row 25, clean tree before the first edit. The brief says "no git writes"; Dann's instruction for this session hands the row to the cloud lane, so it is one commit on `cloud-lane`. Nothing pushed to `Shane` or `main`, no pull request.

## The fault, confirmed

The brief's reading holds on this tree: the guard runs only in the wizard, on a just-captured reading (`CalibrationWizard.svelte`, `withPlausibility`); the snapshot's gate `isUsable` passes a reading whose `plausibility` is undefined; and `deriveFrom`'s `usableAnchor` passes it too. Measured: with the fix bypassed, an unjudged [i] at 1063 Hz reaches `fR1` and `fR2`, and derives [ɨ] and [ɪ] (the two new tests below fail).

## The change

`apps/web/src/lib/analysis/analyze-score-adapter.ts`:

- `judgeUnchecked` (new, exported): returns a judged copy of the formants. A reading with no `plausibility`, no `plausibilityOverride`, a positive f1, and `reading` other than `estimated` gets `checkPlausibility`'s verdict, with **no voice type** (the union bands, per Dann 2026-09-16). Two passes: the six Bozeman vowels ([i], [e], [ɛ], [ɑ], [o], [u]); then the four anchor-derived vowels, against anchors whose verdict is `plausible` or that the singer kept, so no derived window rests on an unjudged anchor. A kept reading (`plausibilityOverride: true`) is left as stored.
- `buildVoiceProfileSnapshot` reads that copy for the fR1 loop, the fR2 loop, and `deriveFrom`. Its parameter is renamed `sampled`; the stored profile is never written (the standing rule, as the comment there says). The comment on "unchecked is kept" now says what is judged and what is kept.

Not touched, as the brief says: the wizard, `outside.ts`, the roster.

**DESK DEFAULT:** "a verdict other than implausible" for an anchor is read as `plausible` (or kept). `unchecked`, the guard's answer where no window exists, never arises for a Bozeman vowel, so the choice changes nothing today; it keeps an anchor from being a reading nobody could judge.

## Tests (`apps/web/src/lib/analysis/analyze-score-adapter.test.ts`)

- **Rewritten (1):** "keeps readings the guard never judged" becomes "judges a reading the guard never judged": an unjudged [u] at 320 Hz, inside the union window, is kept; an unjudged [i] at 1063 Hz is dropped from fR1 and fR2; a reading already `unchecked` is kept. Why it changed: the old case asserted the behaviour this row removes.
- **New (2):** an unjudged [i] at 1063 Hz derives no [ɨ] or [ɪ], while the same [i] at 300 Hz derives both; an unjudged reading the singer kept stays, `judgeUnchecked` leaves it equal to the stored one, and the formants handed in are not mutated.
- Both gate tests fail with `judgeUnchecked` bypassed and pass with it. No other existing test changed.

## The eight gates

All pass. Gate 4: 2133 → **2135** (+2: one case rewritten, two added). The rest as row 25 left them: 251; 242; 0 errors and 12 warnings in 5 files; 653 passed and 5 skipped (658); 145; 55; ratchets OK.

## Could not establish

- **Dann's own stored profile.** It is in his browser; this session has no copy. The 1063 Hz case is the INBOX note's number, built as a fixture.
- **How many singers' profiles carry unjudged readings.** The E.26 build (b6d2828) is the known source; the count is NOT ESTABLISHED.
- **The roster's display.** The wizard's roster still shows a stored reading's own (absent) verdict; Markup and Insights now judge it. Whether the roster should show the computed verdict is the separate question the brief names.
