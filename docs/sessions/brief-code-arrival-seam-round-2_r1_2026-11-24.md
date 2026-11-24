# Brief: the arrival seam, round 2, closing Fable's two blockers (Code, cloud lane 88 continued), r1

Written by the desk (Opus 5), 2026-11-24. **This is not a new lane.** Check out `cloud-lane-88` at `6c84747d` and keep going on it. Dann merges the branch once this round is done and reviewed.

Your predecessor on this branch built the rule correctly. A Fable review then found two blockers and six fixes: `docs/sessions/review-fable-lane88-as-built_r1_2026-11-24.md`. Read that review first, whole. Its governing brief is `brief-code-arrival-seam-closes-up_r5_2026-11-24.md`, which still stands: nothing here revises the rule, and **you do not touch the vowel test, the re-deal, or the carrier.**

## Blocker 1: the record deletes real vowels in every later verse of a strophic song

`ingestion/underlay-count.ts:68,74,80` takes every sung note of the FILE as each verse's notes. For a later verse that only owns some bars, every note the base verse owns is counted `textless`, so `withUnderlayRecord` in `ingestion/ingest.ts` writes an abstention for it, `packages/score-parser/src/verses.ts:124-131` carries that into the verse's view, and `vowel-resolver.ts:653-656` then deletes the vowel and the IPA.

Measured by Fable: `strophic-volta.musicxml` verse 2 loses 12 of 24 vowels and 12 IPA, at bars 4, 5, and 6, which carry words. The four `strophic-repeat` files lose 18 of 32 in verses 2 and 3. Verse 1 is correct.

**What a singer meets:** on a strophic song, the second ending, the refrain, and the coda come up blank from verse 2 on, with no IPA and no phonation time.

**Build:** count each sung verse over the bars where that verse has its own words. `verseView` already holds the `oneLine` test (`verses.ts:96-99`); either use it or run the count on `verseView(score, v)` per verse. Your choice, reversible, do not ask.

**Done when:** no record names a note that shows a syllable in that verse's view, as a committed test over every `strophic-*` fixture, and the six fixtures in Fable's table lose nothing.

## Blocker 2: amendment 10's exception is not built

`ingestion/vowelless-fold.ts` (whole) reads no `tied`, no `slurs`, and no extender ids, and the deal at `:292-300` is by index, so a backward fusion always closes the tail onto the fragment's note. Amendment 10 of r5 says the close-up does not happen where a tie, an extender, or a slur under the gate claims that note.

**Done when:** a fixture puts a fragment on a slur's last note and on a tied note, and the tail stays where the print put it.

## The six fixes

1. **The record double-counts.** `noteless` joins `vacated` and `unexplained` in `withUnderlayRecord`, and a vacated note is also textless, so the Finale copy's message says 2 notes for 1 and n188 says 8 for 6. A singer reads this in Corrections. Dedupe.
2. **A Latin-letter token in a Cyrillic verse** is read as a fragment (`vowelless-fold.ts:80` tests any letter, the vowel set is Cyrillic), so it fuses and now shifts the whole tail. A token with no Cyrillic letter is left in place and counted.
3. **A mark alone** («—» on a note) is dealt as a syllable (`vowelless-fold.ts:228-230`), so the count comes out even over a note that sings nothing and nothing is recorded. Count it instead.
4. **Extender-held notes are not taken off before the slur gate**, so a song that mixes an extension line with a slur fails the gate and loses both. Take them off first.
5. **The seam now loads `$lib/pipeline`**: `vowelless-fold.ts:65` imports a constant from `../vowel-resolver`, and `vowel-resolver.ts:89` imports `processText`. Move the constant so the seam does not pull the pipeline in.
6. **Two untrue strings.** The record's "a token the engine could not divide" is written for a case where the engine is never asked (`vowelless-fold.ts:197`); name that case for what it is. The comment at `score/slur-seat.ts:106-107` is stale since `<extend>` reached the typed path.

If fix 6 changes any user-visible string, give the English only and flag it for a French draft. **You do not write French.**

## Not yours this round

The reach of the count gate over a whole song (`score/slur-seat.ts:63-66`) is Dann's own ruling and he is looking at it. Leave the gate's shape alone. Fix 4 is a correction inside it, not a change to it.

## Constraints

- `CONTRACT.md` governs. Read `docs/memory/README.md` first and follow its read order.
- No hand-rolled phonological predicate. The division stays a named call.
- Nothing deleted that the audit has not ruled dead.
- Keep `packages/score-parser/src/musicxml-parser.ts` under 1200 lines.
- Run gate 4 whole and report the figure. Your predecessor's sandbox skipped four `burg` tests for want of `scipy`; say whether yours did.
- Do not merge, do not push to `Shane`, do not run `ilya-ship.sh`.

## Return memo

Write `docs/sessions/report-code-arrival-seam-round-2_r1_2026-11-24.md` on the branch and end your session with a memo of at most 400 words: each blocker and fix, built or not, with the path:line; the strophic figures after the repair; gate 4 whole with its skip split; anything you left undone and why; and every place you guessed.
