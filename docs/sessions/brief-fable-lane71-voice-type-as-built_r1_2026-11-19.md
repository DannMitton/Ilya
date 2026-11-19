# Fable brief: lane 71 as built, the voice-type stand-ins

Written by the desk (Opus 5), 2026-11-19. **You are reviewing built code, not a brief.** Verdict shapes: **MERGE**, **MERGE WITH FIXES** (list them, numbered, each with its file and the line you read), or **DO NOT MERGE** (name each blocker). Dann merges on your verdict and the desk's reading, so say plainly what you would not ship.

## 0. What these lines are for

A singer opens MELODY or INSIGHTS and reads one sentence saying whose resonances the page is working from. That sentence is their only way to know whether a finding describes their own voice or a template. Before this lane, four voice types got no starting profile at all and the pages withheld. Dann ruled on 2026-11-19 that all eight declared types get one, each borrowing named on the page, and that **a sentence never tells a singer the values are their own type's when they are a neighbour's.** Judge the build by whether a singer is told the truth about whose numbers they are reading.

## 1. Read in full before you judge

1. `brief-code-lane71-voice-type-stand-ins_r4_2026-11-19.md` (md5 `5ceb548a`), the brief the lane was given.
2. `ratified-voice-type-stand-ins_2026-11-19.md` (md5 `8d3f8a4f`), the ruling. **Read its section 8 first:** it is Dann's amendment of 11:55 to 11:57 and it withdraws everything about "Not sure" in sections 2, 3, and 6. "Not sure" takes NO starting profile.
3. Every `report-code-lane71-step<n>_r1_2026-11-19.md` on the branch, in full.
4. The branch's own diff against its cut point, `6c0bb4fc`.

Three earlier Fable reviews of the brief are committed beside it; their amendments are already applied in r4, so read them only for reasoning.

## 2. The branch

`cloud-lane-71`, cut from `Shane` `6c0bb4fc`. Clone it shallow and diff against the cut point:

`GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 --branch cloud-lane-71 --single-branch https://github.com/DannMitton/Ilya.git`, then `git fetch --depth 1 origin 6c0bb4fc` and diff the two. The GitHub API is refused for this repository from a cloud session; anonymous git is not.

## 3. What to check, in priority order

**First, the thing a singer meets.** For each of contralto, countertenor, and bass-baritone, and for "Not sure", for no declared type, and for an id the build does not know: render every one of the eleven sites in brief section 4 and read the sentences together. **No page may say two things that cannot both be true.** The declared type's own name must appear in none of the borrowed-value fills; the one exception is the ruling's templated line, which carries both names on purpose.

**Second, the amendment held.** `PLACEHOLDER_PROFILE_TYPES` is EIGHT, not nine. `not-sure` is out, and so is no type at all. The adapter golden moved **three rows and only three**; the `not-sure`, `undefined`, and `''` rows did not move. The lane reports this; confirm it against the file.

**Third, `borrowedStaffLabel`'s four clauses** (brief section 3). In particular: it returns `undefined` for "Not sure" even when Other's text is set, because `voiceTypePrint` returns Other's text before its `not-sure` test; and every site branches on that `undefined`, never on `hasDeclaredType`.

**Fourth, the draw rule for the borrowing line** (brief section 4.7). Both halves are load-bearing: a borrowing type AND the voice is not personal. It must draw for a contralto with nothing sampled, for a contralto with three core vowels, and on INSIGHTS with no score; it must not draw for a tenor, a mezzo-soprano, a contralto with five stable core vowels, "Not sure", or no type.

**Fifth, the strings.** Every string in brief sections 4.4, 4.5, 4.6, and 4.10 and the Guide passage of 4.9 are Dann's ratified text. Compare byte for byte against the brief and the ruling. **Every apostrophe is U+2019 and every French colon carries U+00A0 before it.** The Guide passage goes in whole, in both languages, with nothing struck, including the sentence about the middle of Ilya's five staves.

**Sixth, the sixteen tests of brief section 7**, and every test the lane repaired.

**Seventh, the comments** the widening makes stale, listed in brief section 2. A comment left describing the old rule is a fix, not a nit: this tree is about to be read by Fable for N.204 and by future developers.

## 4. What is NOT this lane's to close, and must not be reported as a defect of it

Brief section 9, verbatim in substance: `capture.hint.placed.typed` stays false once five core vowels are stable, for all eight types; the sources note's first clause is untrue for an undeclared voice; and **the guard and the stand-ins disagree about a countertenor** (`plausibility.ts:135-142` sends him to `union`, `stand-ins.ts:58` to `tenor-mezzo`). The lane was told to leave `bucketFor` alone and report what it sees. Confirm it did.

## 5. Gates

Gate 4 has two baselines. `~/Downloads/ilya-ship.sh:180` sets `6691 passed | 1 skipped (6692)` where python3 has numpy and scipy, and `6687 passed | 5 skipped (6692)` where it does not. **A cloud sandbox usually lacks scipy, and this lane's Step 0 measured the second form on the untouched cut.** Judge the lane's gate 4 against its own Step 0 baseline, not against the Mac's figure. Report both halves.

`e2e-phone/insights-links.test.ts:32` fails about 1 run in 5 with `expect(boundingBox().y).toBeGreaterThanOrEqual(0)` receiving `-0.0625` at line 46. Cause NOT ESTABLISHED, not this lane's doing. Report it if it fires and do not chase it.

Report every ratchet that moved, with its before and after figure. **Nine of the sixteen ratcheted files are within two lines of their ceiling**, so a file that grew is a finding.

## 6. How to report

Write to `docs/sessions/review-fable-lane71-voice-type-as-built_r1_2026-11-19.md`. **Check with `ls` first and say in your report which name you used.** Lane numbers are not unique across subjects here: `review-fable-lane71-brief_r1_2026-11-19.md` already belongs to a different brief, the blank states, and an agent overwrote a committed document on this exact collision earlier today.

**Create no `.bak` file.** The bridge cannot delete one.

You may run code to settle a claim reading cannot settle; copy it to `/tmp`, run it, delete the copy, write nothing into the repository, and mark every claim that rests on a run with the word "ran".

Every claim carries a file and line you read, a command you ran, or the words NOT ESTABLISHED. There is no fourth form. **NOT ESTABLISHED beats a complete invented answer.** Finish with a NOT ESTABLISHED section and a short "For Dann's eye" section naming anything a singer would notice that he has not seen.

Cap: 350,000 tokens.
