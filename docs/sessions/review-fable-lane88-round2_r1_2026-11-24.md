# Review: lane 88, round 2, the arrival seam (Fable), r1

Written 2026-11-24 by a Fable subagent for the desk. A delta read of `cloud-lane-88`, `6c84747d..92c03cca`, in a scratch clone outside the Mac (deleted at the end). Read whole: the first review (`review-fable-lane88-as-built_r1_2026-11-24.md`), the round-2 brief, the lane's round-2 report. Every path:line below was read this session on the lane's tree at `92c03cca`. Paths under `apps/web/src/lib/` are written `W/`.

## Verdict: MERGE WITH FIXES

Both blockers are closed. All six fixes are built. The count gate in `W/score/slur-seat.ts` is byte-identical to `6c84747d`. Nothing the first review cleared is broken. Four fixes follow the merge; none of them is a reason to hold it. Fix A is the one to build first.

## 1. Blocker 1: closed

Built at `W/score/ingestion/melisma-evidence.ts:39-46` (`scopeOf`): the base verse takes every sung note, a later verse only the sung notes in bars where it has words of its own. The deal reads it at `W/score/ingestion/vowelless-fold.ts:321`; the count reads it from the deal at `W/score/ingestion/underlay-count.ts:66-69`.

Measured by my own probe (`ingestScoreFile`, then `verseView`, then `buildUnderlayResolvers(view, 1)`, with the record and with `dictionMarks` taken off). Vowels and IPA kept with the record, over the figure without it:

| Fixture | Verses | Vowels | IPA | First review's loss |
|---|---|---|---|---|
| `strophic-volta` | 1, 2 | 24/24 each | 24/24 each | 12 and 12 in verse 2 |
| `strophic-volta-from-top` | 1, 2 | 24/24 each | 24/24 each | 12 and 12 in verse 2 |
| `strophic-volta-23` | 1, 2, 3 | 24/24 each | 24/24 each | 12 and 12 in verses 2 and 3 |
| `strophic-stacked` | 1, 2, 3 | 24/24 each | 24/24 each | 8 and 8 in verses 2 and 3 |
| `strophic-tacet-boundary` | 1, 2 | 12/12 each | 12/12 each | 4 and 4 in verse 2 |
| `strophic-repeat`, `-key`, `-meter`, `-grace` | 1, 2, 3 | 30/32 each | 30/30 each | 18 vowels and 16 IPA in verses 2 and 3 |
| `repeat-one-verse` | 1 | 16/16 | 16/16 | not in the first table |

The record is empty on the five volta, stacked, and tacet files. My figures match the lane's table.

The committed test is `W/score/ingestion/round2.test.ts:36-56`. It asserts the brief's condition (`:41`) over every `strophic-*` file and `repeat-one-verse` (`:23`). I ran it: passed.

## 2. The 2 vowels per verse in the repeat files: not the old fault, but the lane's account of them is half wrong

The old fault deleted vowels and IPA on notes that carry words. None of the notes lost now shows a syllable in its verse's view (probe: `viewSyl` null on every one), and no IPA is lost. So this is not blocker 1 in a smaller coat.

What the two notes are, read in `packages/score-parser/src/fixtures/strophic-repeat.musicxml` (the three siblings give the same ids):

| Verse | Note | Print bar | What the file holds |
|---|---|---|---|
| 1 | `m5-1-4` | 6, note 2 | No verse 1 word. Verses 2 and 3 sing «лот» and «ребр» there. Verse 1 holds «Свет» across it. No slur, no tie, no extender. |
| 1, 2, 3 | `m6-1-4` | 7, note 2 | No word in any verse. **It is the stop of a printed slur** that starts on note 1 («Спит», «Спят», «Тих»). |
| 2, 3 | `m4-1-4` | 5, note 2 | Verse 1's «кой» only. Verses 2 and 3 hold «Лес» and «Дол» across it. No slur, no tie, no extender. |

The fixture's own header says so: "In the passage bar 2, verse 1 sings two syllables on two notes that verses 2 and 3 sing as one; in bar 3 the reverse. Bar 4 of the passage has a slur over its first two notes in every verse."

So, per verse:

- **One note is what the lane says it is**: textless, no print evidence, recorded as the r5 rule orders.
- **The other is not.** `m6-1-4` has print evidence, a slur. It loses its vowel because the count gate fails over the verse: verse 1 has 32 notes in scope, 30 syllables, 1 slur continuation, and 30 is not 31 (`melisma-evidence.ts:54`). The single unslurred note above is what makes the count fail. This is the gate's all-or-nothing reach, already open for Dann, and it is not a misfire of round 2.

Two statements in the lane's report are wrong and are corrected here:

1. "Textless notes with no print evidence" is true of one note per verse, not two. The first review said the same of verse 1 and was wrong in the same way.
2. "Two sit in verse 1's own record (bars 6 and 7), carried into the later verses' views through a one-line bar." Not so. The record I read names `m4-1-4` and `m6-1-4` under verses 2 and 3 themselves, and neither bar is a one-line bar. Verse 1's `m5-1-4` is not lost in verses 2 and 3, where it carries «лот» and «ребр».

**For Dann's gate ruling**: a strophic song in which the verses differ by one syllable on one unslurred note fails the gate in every verse, and every slurred melisma in it then comes up with no vowel. The repeat fixtures are that case, measured.

## 3. Blocker 2: closed

Built at `vowelless-fold.ts:322-326`: a fragment fused backward (`:282`) is released from the deal when its note is tied in (`tied.type` of `stop` or `continue`) or is in the evidence's held set (an extender, or a slur continuation under the gate). Released notes are left with no syllable (`:332`) and are not seats (`:328`).

The lane's hand-built fixtures (`round2.test.ts:59-93`) cover the control, a tied note, a slur's last note under the gate, and a slur's last note not under the gate. **They do not cover the extender case.** I probed the three cases the test file leaves out:

| Probe | Result |
|---|---|
| Hand-built, the fragment's note named in `extenderIds` | `жизнь, none, мо, ря`; the note is `evidenced`, the count agrees |
| Hand-built, a tie of `continue` on the fragment's note | `жизнь, none, none, мо, ря`; not damaged |
| A tied fragment through the real parser and `ingestScoreFile` | `жизнь, none, мо, ря`; no record |
| A slurred fragment through the real parser and `ingestScoreFile` | `жизнь, none, мо, ря`; no record |

All three kinds of claim hold. Hand-built fixtures in the test file are sufficient for the tie and the slur; the extender wants one line added (fix B).

## 4. The six fixes

| Fix | Built | Where | Note |
|---|---|---|---|
| 1, double count | Yes | `W/score/ingestion/ingest.ts:411`; pinned at `underlay-record.test.ts:39-40` | |
| 2, no Cyrillic letter | Yes | `vowelless-fold.ts:244-248`, why `foreign` | Probe through the parser: «ты, o, дом, мой» stays as printed, the «o» is counted |
| 3, a mark alone | Yes | `vowelless-fold.ts:244-248`, why `mark`; `underlay-count.ts:86` | See finding 6.2 |
| 4, extender-held notes off before the gate | Yes | `melisma-evidence.ts:50-54`; test `round2.test.ts:118-131` | The formula's shape is the first round's: syllables equal notes less continuations |
| 5, the seam off `$lib/pipeline` | Yes | `vowelless-fold.ts:68`; `W/score/sung-notes.ts:50-59`, `:72-84` | See below |
| 6, two untrue strings | Yes | `ingest.ts:417-427`; `vowelless-fold.ts:202-212`; `slur-seat.ts:81-87` | Internal record strings, English. No French owed |

**Fix 5, confirmed.** I cut `syllableTargetIds` out of `pairings.ts` at `6c84747d` and out of `sung-notes.ts` at the tip and compared them with `cmp`: identical. The same for `slurContinuationIds` against `slur-seat.ts` at `6c84747d`: identical. `pairings.ts:258` and `slur-seat.ts:22-23` re-export them. The seam's imports, read: `vowelless-fold.ts:65-69`, `underlay-count.ts:21-23`, `melisma-evidence.ts:17-18`, `sung-notes.ts:7`. None reaches `$lib/pipeline`, `vowel-resolver`, `pairings`, or `slur-seat`. `W/omr/underlay-units.ts:17` imports one type only. The lane used the leaf copy of the vowel letters (`underlay-units.ts:24`) and did not move `CYRILLIC_VOWEL` (`vowel-resolver.ts:159`); the two are held equal by `omr/underlay-units.test.ts:16-18`. That is acceptable.

## 5. What the first review found sound

- **The gate: untouched.** `observedTargets` at `slur-seat.ts:41-49`, compared by `cmp` against `6c84747d`: identical. The delta in that file is the moved function, the moved type, and the comment.
- The vowel test, the re-deal, and the carrier: no change of shape in the delta. The deal now skips pinned and released notes (`vowelless-fold.ts:328`); the control case still closes up (`round2.test.ts:61-64`, and through the parser in my probe).
- Tests I ran: every test file under `W/score` plus `omr/underlay-units.test.ts`, 85 files, 1454 passed. `pnpm run ratchets`: OK.
- **Gate 4 whole: NOT ESTABLISHED.** I tried once; it did not finish in 570 seconds in my sandbox. The lane's `6860 passed, 5 skipped` is the lane's figure, not mine.

## 6. What a singer would meet that neither the brief nor the first review intended

1. **The base verse is still counted over bars it does not own.** `scopeOf` gives the base verse every sung note (`melisma-evidence.ts:41-42`). Where a bar is lettered under a later verse only (a second ending whose words sit on the verse 2 line), verse 1 is counted textless there. Probe, `strophic-volta.musicxml` with bar 5 relettered as verse 2: a record on four notes under verse 1 and the message "Verse 1: 24 sung note(s), 20 syllable(s); 4 note(s) with no syllable in bar(s) 5." Probe, two bars, a slurred melisma in bar 1 and bar 2 lettered as verse 2 only: verse 1's gate fails and **the slurred note loses its vowel ([o] to nothing)**; the same file with bar 2 lettered as verse 1 loses nothing. This is older than round 2 (round 1 counted every verse over the whole file) and the first review missed it, because every tracked fixture letters its one-line bars as verse 1. NOT ESTABLISHED: how common that lettering is in real files.
2. **A mark alone, or a foreign token, now fails the gate for its verse.** A pinned note stays in scope and is not a syllable, so the count cannot come out even (`melisma-evidence.ts:54`). Probe through the parser, «ты» slurred over two notes, then «—», then «дом»: the slurred note is recorded and loses its vowel. At round 1 the mark counted as a syllable and the gate passed. The cause is fix 3 meeting the gate, and the remedy touches what the gate is given, so it is Dann's.
3. **The two gates now differ.** Fix 4 is in the seam's copy (`melisma-evidence.ts:50-54`). The seating gate (`slur-seat.ts:41-49`) was left alone, as ordered, and still counts extender-held notes. A song mixing an extension line and a slur passes one and fails the other. NOT ESTABLISHED: whether any page shows the difference.
4. **Outside the delta, seen in passing.** In my probe a «—» alone on a note left every later word of the line with no vowel and no IPA, with the record and without it («ты, —, дом, мой»: only «ты» resolves). A Latin «o» in the same place does not do this. `vowel-resolver.ts` is not in the delta, and the score reaching it is the same as at round 1, so this is older than the lane. Cause NOT ESTABLISHED.

## Fixes to carry after the merge

- **A.** Count the base verse over the bars it shows, not the whole file: leave out a bar where another sung verse has words and the base verse has none. A few lines in `scopeOf`, and a fixture with a second ending lettered as verse 2.
- **B.** Add the extender case to `round2.test.ts`, "blocker 2" (one hand-built case; my probe shows it passes).
- **C.** For Dann, with his gate ruling: whether pinned notes come off before the gate, as extender-held notes now do; and the repeat-file measurement in section 2.
- **D.** Correct the two statements in the lane's report named in section 2, or let this review stand as the correction.

## Not established

Gate 4 whole; `svelte-check`; the build; Playwright; an MNX file; the live strophic page; how often a second ending is lettered under verse 2 in real files; the cause of finding 6.4.

## Terms

Coined here: "fix A" to "fix D", "the probe". Adopted from the lane, the brief, and the first review: scope, pinned, released, claimed, held, re-deal, vacated, unexplained, carrier, close-up, base verse.

## Spend

A subagent cannot read its own meter. Estimate: 115,000 tokens of the 300,000 cap.
