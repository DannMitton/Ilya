# N.204, phase 1, unit a: the judgement read of `packages/phonology`, `dictionary`, `blurb`

r1, 2026-11-19, written by the Opus desk. Plan: `plan-code-audit-maintainability_r2_2026-11-16.md`,
sections 2, 3, 4, 5 (phase 1), 6, and 8. Tree: `Shane` `b79e33e9`.

## Why this read exists, in Dann's words

*"This is our last look at the code before we finalize the LEARN and GUIDE sections, so it has
to be done thoroughly and properly."* (2026-11-18 22:47, `OPEN.md`, "N.204: FABLE READS ALL THE
CODE".) Thoroughness decides, never cost. The tiered read was refused. Read every file in the
list whole. Do not sample, skim, or trim.

## The unit

23 files, 5,631 lines, 251,804 bytes, about 72k tokens. Measured at `a16c011c`; the desk
confirmed with `git diff --name-only a16c011c b79e33e9` that not one of these paths has changed
since, so the phase 0 figures stand.

```
packages/blurb/src/cluster-breakdowns.ts
packages/blurb/src/composer.ts
packages/blurb/src/index.ts
packages/blurb/src/types.ts
packages/dictionary/src/curated-glosses.ts
packages/dictionary/src/cyrillic.ts
packages/dictionary/src/gloss.ts
packages/dictionary/src/index.ts
packages/dictionary/src/poetic-normalizer.ts
packages/dictionary/src/pre-reform-normalizer.ts
packages/dictionary/src/types.ts
packages/phonology/src/clitics.ts
packages/phonology/src/engine.ts
packages/phonology/src/index.ts
packages/phonology/src/lexical-exception.ts
packages/phonology/src/lexical-gk.ts
packages/phonology/src/lexical-palatalization.ts
packages/phonology/src/lexical-r.ts
packages/phonology/src/palatalization.ts
packages/phonology/src/prefix-boundary.ts
packages/phonology/src/reflexive.ts
packages/phonology/src/shcha-clusters.ts
packages/phonology/src/voicing-rule2.ts
```

Read first, for the standard you are judging against:
`docs/house-style/code-conventions.md`, section 5 (the comment standard: a header comment per
file, three permitted purposes, cite a name and never a line number).

## The outcome this serves

A developer who has never met Dann clones the repository and, in one afternoon, can find where
a singer-visible behaviour lives, read a module and see why it is shaped as it is, see the
relationships no import shows, change a module with the tests telling them what broke, and meet
no dead code, no comment that restates the line below it, and no comment that is false.

## The checklist

ISO/IEC 25010 maintainability, its five qualities as questions:

1. **Modularity.** Does a change here force changes elsewhere? Are the boundaries between
   `phonology`, `dictionary`, and `blurb` real, or does one reach into another's business?
2. **Reusability.** One logic written twice. One number or one rule computed in two sites.
   `engine.ts` is 2,048 lines; say what it is doing that belongs elsewhere.
3. **Analysability.** Size, names, header comments, comments that restate the line below or
   that are now false.
4. **Modifiability.** Hidden coupling through string keys, module-level state, or an implicit
   ordering between rule files (`lexical-*.ts`, `palatalization.ts`, `voicing-rule2.ts`,
   `prefix-boundary.ts`, `shcha-clusters.ts`, `reflexive.ts`, `clitics.ts`).
5. **Testability.** What behaviour is pinned and what is not. Dead fixtures.

Name every refactoring in Fowler's sense (*Refactoring*, 2nd ed., 2018), by its name.

## What every finding carries

- The **name** it anchors to (a function, a constant, a type). Never a line number, because
  line numbers go stale; that is the tree's own standard.
- The smell.
- The refactoring, by name.
- Its tier: **1** proven-dead code, comments, renames inside a file; **2** moves across
  modules; **3** splitting a ratcheted hotspot.
- The risk.
- The test or baseline that would prove behaviour unchanged.

Also produce, per package:

- **The paragraph a developer needs**: what this package is for, why it is shaped this way,
  and what a newcomer would otherwise get wrong.
- **The hidden relationships**: anything no import shows. One rule applied in two files, an
  ordering that must hold, a string key shared with a caller outside the unit, a test that
  reads source as text. Propose each as a check (a test or a ratchet line) before proposing it
  as prose.

## Fixed, and never proposed for change

From `plan-code-audit-maintainability_r2_2026-11-16.md` section 4 and `CONTRACT.md` section 8:

- No hand-rolled phonological predicate, anywhere, for any reason.
- No ratified string changed, no i18n key deleted, no stored-format change.
- No ratchet ceiling raised.
- `VocalLineEvent`, anything under `score/reconciliation/`, `analyzePerVerse`, and
  `underlay-donor.ts` as the alignment engine are all out of bounds; they are outside this unit
  but a finding may not propose touching them.
- **ONE VOWEL PER NOTE** (`CONTRACT.md` section 0.1) is inviolable. Russian lyric diction sets
  one vowel per note, no more and no less; «й» is a consonant; a vowelless token is a clitic
  that joins its host. If anything you read bends that rule, it is a defect, and it is a
  blocker finding, not a tier 1 note.
- The pre-reform spelling work (`pre-reform-normalizer.ts`) carries Dann's ruling that -аго is
  sung as -ого. A comment that carries one of his rulings keeps a pointer to where the ruling
  lives; it is never deleted as history.

## What you do not do

You do not change a file. This is a read. You do not run the gates. You do not write with git;
allowed verbs are `status`, `log`, `diff`, `show`, `ls-files`, always with
`git --no-optional-locks --no-pager`.

## NOT ESTABLISHED

NOT ESTABLISHED beats a complete invented answer.

A claim about the code carries a name you read in this session. A memory file, this brief, or
another agent's words are not a read. Where a document and the tree disagree, the tree wins.

Known gaps you are not expected to close: the token-per-byte ratio (so every token figure);
whether a fixture binder from a released build exists; the status of consistency batches 3
and 4. This unit's Sonnet packet (plan phase 0 step 5) does not exist. DESK DEFAULT, 2026-11-19:
the read runs without it, because the ruling has you reading all the source yourself and the
packet exists to spare you tokens that are not scarce this week. The packet's purpose, checkable
citations, is met by your anchoring every finding to a name you read. The packet stays owed
against the plan's done-when item 1.

## The report

Write it to `docs/sessions/read-fable-n204-unit-a_r1_2026-11-19.md` with a quoted heredoc
through `device_bash`. Create no `.bak` file; the bridge cannot delete one.

Shape:

```
# N.204 unit a: the judgement read
Files read: <n> of 23. Findings: <n> (tier 1 <n>, tier 2 <n>, tier 3 <n>). Blockers: <n>.

## The paragraph a developer needs
One per package: phonology, dictionary, blurb.

## Hidden relationships, each proposed as a check

## Findings
Numbered, grouped by tier. Each: name anchor, smell, refactoring by name, tier, risk, the test
or baseline that proves behaviour unchanged.

## Dead code candidates
Each with why no caller reaches it and what would prove it.

## Comments: false, redundant, or carrying a ruling that needs rehoming

## What I could not establish
```

House style: Canadian spelling, Oxford comma, no em dashes, sentence case headings, no
exclamation marks, and none of "simply", "just", "easy", or "straightforward".
