# N.204, phase 1, unit b: the judgement read of `packages/score-parser`, parsers and analysis

r1, 2026-11-19, written by the Opus desk. Plan: `plan-code-audit-maintainability_r2_2026-11-16.md`,
sections 2, 3, 4, 5 (phase 1), 6, and 8. Tree: `Shane` `b79e33e9`. Unit a's read is filed as
`read-fable-n204-unit-a_r1_2026-11-19.md`; read nothing of it, this unit stands alone.

## Why this read exists, in Dann's words

*"This is our last look at the code before we finalize the LEARN and GUIDE sections, so it has
to be done thoroughly and properly."* (2026-11-18 22:47.) Thoroughness decides, never cost. The
tiered read was refused. Read every file whole.

## The unit

27 files, 9,517 lines, 392,643 bytes, about 112k tokens. Measured at `a16c011c`; the desk
confirmed with `git diff --name-only a16c011c b79e33e9 -- packages/score-parser` that the only
paths touched since are `render-score.ts`, `render-seam-review.test.ts`, and two fixtures, none
of them in this unit. The phase 0 figures stand.

```
packages/score-parser/src/analysis-types.ts
packages/score-parser/src/arc-outline.ts
packages/score-parser/src/barline-style.ts
packages/score-parser/src/conditions.ts
packages/score-parser/src/demo-fixture.ts
packages/score-parser/src/diction-marks.ts
packages/score-parser/src/grace.ts
packages/score-parser/src/index.ts
packages/score-parser/src/mnx-parser.ts
packages/score-parser/src/modification-engine.ts
packages/score-parser/src/musicxml-parser.ts
packages/score-parser/src/notations.ts
packages/score-parser/src/overlay-engine.ts
packages/score-parser/src/performance-order.ts
packages/score-parser/src/phonation.ts
packages/score-parser/src/pickup.ts
packages/score-parser/src/stem-legend.ts
packages/score-parser/src/sustain.ts
packages/score-parser/src/tempo-lexicon.ts
packages/score-parser/src/tempo-seam.ts
packages/score-parser/src/tempo-terms.ts
packages/score-parser/src/tessitura.ts
packages/score-parser/src/transposition.ts
packages/score-parser/src/types.ts
packages/score-parser/src/unfold.ts
packages/score-parser/src/verses.ts
packages/score-parser/src/vocal-octave.ts
```

Read first, for the standard you judge against: `docs/house-style/code-conventions.md`,
section 5 (a header comment per file, three permitted purposes, cite a name and never a line
number).

## The outcome this serves

A developer who has never met Dann clones the repository and, in one afternoon, can find where
a singer-visible behaviour lives, read a module and see why it is shaped as it is, see the
relationships no import shows, change a module with the tests telling them what broke, and meet
no dead code, no comment that restates the line below it, and no comment that is false.

## The checklist

ISO/IEC 25010 maintainability, its five qualities as questions: modularity (does a change here
force changes elsewhere; are the boundaries real), reusability (one logic written twice; one
number computed in two sites), analysability (size against the ratchets, names, header
comments, comments that restate or mislead), modifiability (hidden coupling through string
keys, module state, implicit ordering), testability (what behaviour is pinned and what is not;
dead fixtures).

Name every refactoring in Fowler's sense (*Refactoring*, 2nd ed., 2018), by its name.

Two parsers sit side by side here, `musicxml-parser.ts` (1,166 lines) and `mnx-parser.ts`
(1,170). Say plainly what they share, what they must share, and what has drifted. `types.ts` is
999 lines and is the contract everything else in the repository reads.

## What every finding carries

The **name** it anchors to (never a line number); the smell; the refactoring by name; its tier
(**1** dead code, comments, renames inside a file; **2** moves across modules; **3** splitting a
ratcheted hotspot); the risk; and the test or baseline that would prove behaviour unchanged.

Also produce: **the paragraph a developer needs** for the parsers, for the analysis files, and
for `types.ts`; and **the hidden relationships** that no import shows, each proposed as a check
before it is proposed as prose.

## Fixed, and never proposed for change

From the plan's section 4 and `CONTRACT.md` section 8:

- **`VocalLineEvent` is not changed.** Not its shape, not its name, not its home.
- **`analyzePerVerse` is not deleted.** N.20 is built on it.
- Nothing under `score/reconciliation/` is touched, and `underlay-donor.ts` is not made the
  alignment engine. Both are outside this unit; a finding may not propose reaching them.
- No stored-format change. No ratified string changed. No ratchet ceiling raised.
- **Do not unspool a repeat whose text does not vary** (`CONTRACT.md` section 8). `unfold.ts`
  is where that lives.
- Scorer field names `lengthWrong` and `pitchWrong` stay as they are. In prose, a printed page
  that differs from an expectation is outside the expected range, never wrong.
- Grace notes are drawn and never counted in the bar's sum (N.187).

## The two rules that outrank your findings

1. **ONE VOWEL PER NOTE** (`CONTRACT.md` section 0.1). Russian lyric diction sets one vowel per
   note, no more and no less. A word with no vowel takes no note and joins its host as a
   clitic; two vowels under one note is an error; «й» is a consonant in that count; a sung note
   that is not a continuation and carries no syllable is a mistake. This unit holds `verses.ts`
   and `diction-marks.ts`, so it may touch text under notes. **Anything here that writes, counts,
   or trusts a syllable under a note without that check is a blocker finding, not a tier 1
   note.**
2. **Positions come from evidence, never from an arbitrary rule** (`CONTRACT.md` section 0.2).
   A position taken from a proportion or a guess, where the source gives real evidence, is a
   finding of its own.

## What you do not do

You change no file except the one report. You run no gate and no test. You do not write with
git; allowed verbs are `status`, `log`, `diff`, `show`, `ls-files`, always with
`git --no-optional-locks --no-pager`.

If a claim cannot be settled by reading, you may copy files to `/tmp` inside the bridge's VM and
run them there, as unit a's read did. Say "ran" on every claim that rests on it, and delete the
copies.

## NOT ESTABLISHED

NOT ESTABLISHED beats a complete invented answer.

A claim about the code carries a name you read in this session. A memory file, this brief, or
another agent's words are not a read. Where a document and the tree disagree, the tree wins.

This unit's Sonnet packet (plan phase 0 step 5) does not exist. DESK DEFAULT, 2026-11-19: the
read runs without it, as unit a's did; its purpose, checkable citations, is met by your
anchoring every finding to a name you read. The packet stays owed against done-when item 1.

## The report

Write it to `docs/sessions/read-fable-n204-unit-b_r1_2026-11-19.md` with a quoted heredoc
through `device_bash`. Create no `.bak` file; the bridge cannot delete one.

Shape:

```
# N.204 unit b: the judgement read
Files read: <n> of 27. Findings: <n> (tier 1 <n>, tier 2 <n>, tier 3 <n>). Blockers: <n>.

## The paragraph a developer needs
One for the parsers, one for the analysis files, one for `types.ts`.

## Hidden relationships, each proposed as a check

## Findings
Numbered, grouped by tier. Each: name anchor, smell, refactoring by name, tier, risk, the test
or baseline that proves behaviour unchanged.

## Behaviour defects met during the read, if any
Outside the tiers; each changes what a singer sees.

## Dead code candidates

## Comments: false, redundant, or carrying a ruling that needs rehoming

## What I could not establish
```

House style: Canadian spelling, Oxford comma, no em dashes, sentence case headings, no
exclamation marks, and none of "simply", "just", "easy", or "straightforward".
