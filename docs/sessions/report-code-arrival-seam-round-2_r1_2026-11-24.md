# Report: the arrival seam, round 2 (Code, cloud lane 88 continued), r1

Written on `cloud-lane-88`, 2026-11-24, against `brief-code-arrival-seam-round-2_r1_2026-11-24.md` and `review-fable-lane88-as-built_r1_2026-11-24.md`. I ran `git fetch origin` and `git merge origin/Shane` first (documents only, no conflict). The rule, the vowel test, the re-deal, and the carrier are unchanged. The shape of the count gate in `score/slur-seat.ts` is unchanged. Nothing was merged, nothing went to `Shane`, `ilya-ship.sh` was not run, and no French was written. Paths below are under `apps/web/src/lib/score/` unless they say otherwise.

## Blocker 1: a later verse is counted only over the notes it owns

Built. `ingestion/melisma-evidence.ts:39` (`scopeOf`) gives the base verse (the first of `sungVerseNumbers`) every sung note, and a later verse only the sung notes in bars where that verse has words of its own, the same line `verseView` draws. The deal reads the scope (`ingestion/vowelless-fold.ts:321`) and `underlay-count.ts:60` reads it from the deal, so the count and the record both follow it. This is option (a) of the brief with the bar test taken from `verses.ts:96-99`.

Figures after the repair (a probe through `ingestScoreFile`, `verseView`, `buildUnderlayResolvers(view, 1)`, with the record and without it; vowels with the record over vowels without):

| Fixture | Verses | Vowels | IPA |
|---|---|---|---|
| `strophic-volta`, `-from-top`, `-23` | 1, 2 (and 3) | 24/24 each | 24/24 each |
| `strophic-stacked` | 1, 2, 3 | 24/24 each | 24/24 each |
| `strophic-tacet-boundary` | 1, 2 | 12/12 each | 12/12 each |
| `strophic-repeat`, `-key`, `-meter`, `-grace` | 1, 2, 3 | 30/32 each | 30/30 each |

Before the repair Fable measured 12 of 24 vowels and 12 IPA lost in the volta files, 8 in stacked, 4 in tacet, and 18 of 32 vowels in verses 2 and 3 of the repeat files. The first three groups now lose nothing. **The four repeat files still lose 2 vowels in every verse**, and no IPA. Those are the notes the rule names on purpose: textless notes with no print evidence. Two sit in verse 1's own record (bars 6 and 7), carried into the later verses' views through a one-line bar (`verses.ts` `marksOf`). One more is verse 2's and verse 3's own: the note `m4-1-4` carries «кой» in verse 1 only, in a bar where verses 2 and 3 have words. That is the rule working as ordered, not a misfire, and I did not try to remove it.

Committed test: `ingestion/round2.test.ts`, "blocker 1", over every `strophic-*` fixture and `repeat-one-verse`. It asserts that no record names a note that shows a syllable in that verse's view, and that a later verse loses a vowel only on a note the base verse's record names or in a bar where that verse has its own words.

## Blocker 2: amendment 10's exception

Built. `vowelless-fold.ts:297` onward. `foldVowelessSyllables` takes the extender ids; a fragment fused backward is "claimed" (`:322-326`) when its note is tied into the one before, is held by an extender, or is a slur continuation under the gate. A claimed note is skipped by the deal: the fragment's text goes onto the host, the note is left with no syllable, and every later syllable stays where the print put it. The gate is read through `evidenceFor` with the verse's syllable count, which the deal knows before it places anything.

Test: `round2.test.ts`, "blocker 2". The fixtures are built by hand in the test file, not as files. Four cases: the control (nothing claims, the tail closes up), a tied note, the last note of a slur under the gate, and the last note of a slur not under the gate (a phrasing mark, the tail closes up as before).

## The six fixes

1. **Double count.** Built. `ingest.ts:411` joins `vacated` and `unexplained` by note id. The Finale copy's message now reads "1 note(s)" (pinned in `underlay-record.test.ts`).
2. **A token with no Cyrillic letter.** Built. `vowelless-fold.ts:245` leaves it on its own note, undealt, and counts it (`pinned`, why `foreign`). The tokens around it are dealt around it.
3. **A mark alone.** Built, same place, why `mark`. It no longer counts as a syllable, so the count does not come out even over it. DESK DEFAULT: it is counted in the message but not added to the abstention record, because the resolver already finds no vowel in it.
4. **Extender-held notes before the gate.** Built. `melisma-evidence.ts:49`. The gate's formula is unchanged; only what it is given changed. Test: a song mixing an extension line and a slur now passes the gate and both are evidence.
5. **The seam no longer loads `$lib/pipeline`.** Built, by two moves. The vowel letters come from `$lib/omr/underlay-units` (`VOWEL`, the same letters, held equal to `CYRILLIC_VOWEL` by `omr/underlay-units.test.ts`), imported at `vowelless-fold.ts:68`. `syllableTargetIds` and `slurContinuationIds` (with their two event types) moved, code unaltered, to the new leaf `sung-notes.ts`, which imports only a type; `pairings.ts` and `slur-seat.ts` re-export them so no caller changed. A test reads the import lines of the seam files and rejects `pipeline`, `vowel-resolver`, `pairings`, and `slur-seat`. I did not move `CYRILLIC_VOWEL` itself, as the brief words it; I used the existing leaf copy instead, which asks nothing of `vowel-resolver.ts`. That is a guess about which you prefer.
6. **Two untrue strings.** Built. The record names the case for what it is: a token of two vowels or more that is not one run of letters says "not divided" and the engine is never named for it, and only a token the engine was asked and could not divide says "the engine could not divide". The stale comment at `slur-seat.ts:81-87` now says the parser reads `<extend>` in any file. These are internal record strings, English only, no singer-facing text. **Nothing here needs a French draft.**

## Gates

| Gate | Result |
|---|---|
| Gate 4, `apps/web` unit suite, whole | **6860 passed \| 5 skipped (6865)** against the baseline `6810 passed \| 1 skipped (6811)` |
| Skip split | 4 `burg` tests skipped for want of `scipy` (`python3 -c "import scipy"` still fails here; I did not install it), 1 `heic` test skipped for its own environment variable. So yes: this sandbox skipped the same four. |
| `@ilya/score-parser` | 913 passed, 5 skipped |
| `pnpm run ratchets` | OK. It reports `pairings.ts` 1422 to 1372, a ceiling that could be lowered; I left `scripts/ratchets.json` alone. |
| `pnpm run check` | 0 errors, 12 warnings, all in five `.svelte` files not touched |
| Build, Playwright | not re-run this round |

## Left undone, and why

- The behaviour baseline was not re-captured this round. The brief did not ask for it, and only the record's reach changed. The Tchaikovsky INSIGHTS line stays as round 1 explained it.
- Fable's "NOT ESTABLISHED" list (live strophic page, `readingScore` carrying `dictionMarks`, an MNX file, the print of Tchaikovsky bars 58 and 93) is still open.
- The all-or-nothing reach of the gate is Dann's to rule, as the brief says.

## Where I guessed

1. Option (a) over option (b) for blocker 1. Reversible.
2. The leaf copy of the vowel letters instead of moving `CYRILLIC_VOWEL`.
3. A claimed fragment is skipped by the deal and left with no syllable; I read "the tail stays where the print put it" that way.
4. A claim by extender can never apply to a fragment in practice, because an extender's span stops at the next syllable. I kept it in the claim set because the brief names it.
5. The base verse is the first of `sungVerseNumbers`, for the scope.
6. The repeat files' residual 2 vowels per verse are left as the rule's intended reach.
