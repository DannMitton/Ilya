# CODE BRIEF. N.171: switch on the `#` repair

Written by the desk 2026-09-24 21:50. Numbered by Dann 2026-09-24 21:40: *"Switch it on."* Spec: `docs/memory/OPEN.md` §N.171. Read it first.

## Step 1. Measure before you change anything (report, then continue)

On the live resolver chain, load a Sunless score that carries a `#` (Sunless 4 is the clearest: `packages/score-parser/src/diction-marks.ts:25-30`). Report whether the singer-visible Transcription and Score markup put syllables one note late today, or only the per-vowel counts in `apps/web/src/lib/shane/score-metrics.ts`. Name the file and line that decides it.

## Step 2. Wire it in

Put `foldDictionMarks` (`diction-marks.ts:141`) into the live resolver chain, with `vowelResolverAbstentions`, which the 8.15% figure requires (`diction-marks.ts:49-51`). Keep Dann's rule: the mark joins the syllable before it and is never discarded, so `phonationBreak` has a source. Update the comment at `score-metrics.ts:43-50`, which says the fold is not applied.

## Step 3. Prove it

- The fold's own tests pass, and Sunless 2 (no mark) is bit-identical before and after.
- A test on the live path shows Sunless 4, notes 70 to 72, with each syllable on its own note.
- Re-run `tools/n168-frequency-run` and report how the per-vowel shares moved for Mitton.
- **THE `#` CARRIES NO DURATION AND CHANGES NO CALCULATION. Dann, 2026-09-24 21:59:** *"Just be sure that the newly situated octothorpes have zero effect on correct duration counts or other calculations."* Prove it with a test on every Sunless score that carries a mark: total sung time, `byPitch`, `total`, `tessitura`, `seconds`, and `foldCycles` are identical before and after the fold (`score-metrics.ts:43-50` says they never consult a syllable; show it, do not assume it). Only the per-vowel attribution (`byVowel`, `byPitchByVowel`) may move. No note's duration changes, and no note is added or removed. Report any number that moves outside the per-vowel breakdown as a failure, not a finding.
- All five gates at baseline. If a baseline moves, say by how much and why; do not edit `ilya-ship.sh`.

## Return

A memo at `docs/sessions/memo-code-n171_r1_2026-09-24.md`: step 1's answer, the diff summary, the gate counts, the frequency-run change, and a NOT ESTABLISHED section. Do not commit; Dann ships.
