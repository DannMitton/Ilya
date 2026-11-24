# Review: lane 88 as built, the arrival seam (Fable), r1

Written 2026-11-24 by a Fable subagent for the desk. Read: `cloud-lane-88` at `6c84747d`, five commits on `Shane` `5594904b`, in a scratch clone outside the Mac (deleted at the end). Brief: `brief-code-arrival-seam-closes-up_r5_2026-11-24.md`. Lane report: `report-code-arrival-seam_r1_2026-11-24.md`. Every path:line below was read this session on the lane's tree unless it says otherwise. Paths under `apps/web/src/lib/` are written `W/`.

## Verdict: DO NOT MERGE

Two blockers. Both are small to repair. The lane's core (the vowel test, the re-deal, the carrier) is built as ordered and its kept fixtures come out as the brief predicted.

### Blocker 1: the record deletes real vowels and real IPA in every later verse of a strophic song

The lane's own doubt is confirmed, and it is worse than a false alarm.

- The count takes every sung note of the file as each verse's notes: `W/score/ingestion/underlay-count.ts:68` (`sung`), `:74` (`textless` is every sung note with no entry for that verse), `:80` (`unexplained`).
- The record then writes an abstention for each such note under that verse: `W/score/ingestion/ingest.ts`, `withUnderlayRecord`, the `noteless` loop (`abstain.push({ eventId: id, verseNumber: v.verse })`).
- A later verse is drawn and analysed through `verseView`, where in a one-line bar the base verse's syllable stands for every verse: `packages/score-parser/src/verses.ts:96-99`, `:103-104`. `marksOf` keeps the later verse's own records and renumbers them to verse 1: `verses.ts:124-131`.
- The resolver then deletes the vowel and the IPA on each recorded note: `W/score/vowel-resolver.ts:653-656`. The later-verse path is `W/melody/melody-pages.ts:86-87`, called from `:143`, called from `W/melody/MarkupPane.svelte:845`.

Measured by a probe through `ingestScoreFile`, then `verseView`, then `buildUnderlayResolvers(view, 1)`, against the same view with the record taken off:

| Fixture | Verse | Vowels with no record | Vowels lost to the record | IPA lost |
|---|---|---|---|---|
| `strophic-volta.musicxml` | 2 | 24 | 12 | 12 |
| `strophic-volta-from-top.musicxml` | 2 | 24 | 12 | 12 |
| `strophic-volta-23.musicxml` | 2 and 3 | 24 each | 12 each | 12 each |
| `strophic-stacked.musicxml` | 2 and 3 | 24 each | 8 each | 8 each |
| `strophic-tacet-boundary.musicxml` | 2 | 12 | 4 | 4 |
| `strophic-repeat.musicxml`, `-key`, `-meter`, `-grace` | 2 and 3 | 32 each | 18 each | 16 each |

The lost notes carry words. In `strophic-volta.musicxml` they are bars 4, 5, and 6: «Всё тих но ей», «Вот и ко нец», «Ночь ти ха я», which the fixture's own header calls one line of words sung after the repeat. Verse 1 loses nothing in the volta, stacked, and tacet fixtures.

What a singer meets: on a strophic song, verses 2 and up lose their IPA and their phonation time in the second ending, the refrain, and the coda. NOT ESTABLISHED: the last hop on the live page (whether `readingScore` at `MarkupPane.svelte:569` carries `dictionMarks`); I did not run a strophic file through the built app.

Repair, one of two. (a) Count a later verse only over the bars where it has its own words, using the `oneLine` test `verseView` already holds (`verses.ts:96-99`). (b) Run the count on `verseView(score, v)` for each sung verse. Either way, add a test that no record names a note that shows a syllable in that verse's view.

### Blocker 2: amendment 10's exception is not built

The brief: a backward fusion closes up "unless a tie, an extender, or a slur under the gate claims that note". `W/score/ingestion/vowelless-fold.ts` (read whole, 1-319) reads no `tied`, no `slurs`, and no extender ids. The deal is by index onto every note that held text (`:292-300`), so the tail always moves onto the fragment's note. `n188-markings.musicxml` does not exercise it: its slur ends on the textless note before «знь». A fragment sitting on a slur's last note, or on a tied note, now receives the next word.

## 1. The brief, item by item

| Order | Built | Where |
|---|---|---|
| Item 1, `<extend>` read | Yes | `packages/score-parser/src/musicxml-parser.ts:814`, `:685`; `extender-span.ts:13`, `:16-25` |
| Span adopted from `omr/extend-convention.ts` | A second implementation of the same definition, pinned equal by test. The report's "adopted rather than redrawn" overstates it. | `extender-span.ts:16-25` |
| Which reading wins | The parser's | `ingest.ts`, `withExtenders`, first line |
| Am. 3, Cyrillic verses only | Yes | `vowelless-fold.ts:288` |
| Am. 7, NFC | Yes; probe: NFD «мой» stays one syllable | `vowelless-fold.ts:78` |
| Am. 7, named call, rejoin, count where it falls short | Yes; probe: «тѣни» undivided and counted | `vowelless-fold.ts:200-202`, `:236` |
| Am. 8, direction, letter map first | Yes; probe: «въ домъ» fuses forward | `vowelless-fold.ts:178-185` |
| Am. 9, types carried | Yes; probe: «вз»+«дох» comes out `whole` | `vowelless-fold.ts:173`, `:210`, `:240`, `:259` |
| Am. 10, backward close-up | Close-up yes, exception no (blocker 2) | `vowelless-fold.ts:292-300` |
| Am. 11, orphans and overflow recorded | Yes | `vowelless-fold.ts:255-257`, `:262`, `:302` |
| Am. 6, carrier | Yes | `packages/score-parser/src/types.ts:993`; `ingest.ts`, `withUnderlayRecord`, the return |
| Am. 2, recorded so the resolver abstains, with a test | Yes on verse 1; overreaches on later verses (blocker 1) | `underlay-record.test.ts:48-57` |
| Am. 4, tests rewritten, `many-vowels` filter removed | Yes | `fixture-rule.test.ts:424-432`, `:448-459`; `diction-fold-live.test.ts:99-118` |
| Am. 5, step 0, nothing deleted | Yes; `clitic-seat.ts` is not in the lane's diff | diff stat |
| Slur gate as it stands | Same formula | `underlay-count.ts:76-77` against `score/slur-seat.ts:63-66` |
| No `$lib/pipeline` in the seam | Not called. But `vowelless-fold.ts:65` imports a constant from `../vowel-resolver`, and `vowel-resolver.ts:89` imports `processText` from `$lib/pipeline`, so the module is now loaded through the seam. The old fold took its vowel test from `$lib/omr/assert-vowel-per-note` (read at `5594904b`, `:34`). | as cited |
| Kept fixtures | Engraved: no warning. Finale: 97 and 96, bar 18. n188: «жизнь». Tchaikovsky: bars 58 and 93. All reproduced by my probe. | probe |

Gates I ran: the 13 touched test files in `apps/web` (197 passed), `@ilya/score-parser` (913 passed, 5 skipped), ratchets OK, `pnpm build` exit 0. **Gate 4 whole: NOT ESTABLISHED.** It did not finish in my sandbox in two tries.

## 2. The three desk defaults

1. **Elision token is one unit.** Right. The parser joins a print's elision with U+203F (`musicxml-parser.ts:811`), so the token is the print's own two-on-one. Hides nothing of weight.
2. **A token with no letter stays.** Right to leave it, but it is dealt as a syllable (`vowelless-fold.ts:228-230`), so «—» on a note makes the count come out even with a note that sings nothing, and nothing is recorded (probe: `damaged false`). Fix: count it.
3. **Two vowels, not one run of letters, is not divided and is counted.** Right, and the hyphen half is ordered by the brief ("split text at a hyphen"). It is recorded, so it hides nothing. The record's label, "a token the engine could not divide", is untrue for it: the engine is never asked (`vowelless-fold.ts:197`).

**A case the defaults miss.** `hasLetter` is any letter (`:80`) and the vowel set is Cyrillic. A Latin token in a Cyrillic verse is read as a fragment: probe, «Я | o | дом» with a Latin o becomes «Я o | дом | empty», and «мo» with a Latin o fuses onto «ре». The old fold did the same fusion but moved nothing else; now the whole tail shifts. Fix: a token with no Cyrillic letter is left in place and counted.

## 3. The strophic records

Wrong for verses 2 and up, as blocker 1 sets out: the rule is misfiring on notes the verse does not own. The verse 1 records on the four `strophic-repeat` fixtures (2 notes, bars 6 and 7) are the rule working as ordered on textless notes with no evidence.

## 4. The INSIGHTS line: ESTABLISHED

I rebuilt the app twice and captured the Tchaikovsky INSIGHTS text in English with the baseline's own steps (`harness/live-capture.mjs`, cut to that one file).

- Lane as built: one line differs from the baseline, line 153, the [i] row: `10 s to 12 s past`.
- Lane with one change, the abstention on the unexplained notes taken out of `withUnderlayRecord`: **identical to the baseline, no difference.**

So the cause is the abstention on the two notes at bars 58 and 93, and nothing else in the lane. The file holds no slur and no tie on them (probe: `slursRead false`). NOT ESTABLISHED: what the print shows on those two notes. French not re-captured.

## 5. What a singer would meet that the brief did not intend

1. **Blocker 1**, above.
2. **The record's own numbers are wrong.** `noteless` joins `vacated` and `unexplained` (`ingest.ts`, `withUnderlayRecord`), and a vacated note is also textless, so it is counted twice. The Finale copy's message reads "2 note(s)" for one note; n188 reads 8 for 6. Corrections will read this.
3. **The reach of "no evidence".** Intended by the brief, but the desk needs its size. The slur gate is all or nothing over the song (`underlay-count.ts:77`), so one phrasing slur fails it and every slurred melisma becomes unexplained and loses its vowel. n188 loses 4 notes, two of them slur ends. An extender-held note is not taken off before the gate, so a song mixing both fails it too.
4. **Text leaves the page with no notice** until slice 6R: an orphan, an overflow, and the last note of a closed-up verse. A division does not use an empty note beside it (probe: «моя | empty | ты | дом» pushes «дом» off the end and leaves the empty note empty). This follows the brief's re-deal.
5. **Every authored file with `<extend>` now gets melisma decisions** on the typed path (`score/slur-seat.ts:110-114`). Intended by item 1; the comment at `:106-107` is now stale.

## Fixes to carry with the blockers

1. Dedupe `noteless` in the record message.
2. A token with no Cyrillic letter: leave and count.
3. A mark alone: count it, do not deal it as a syllable.
4. Take extender-held notes off before the slur gate.
5. Move the vowel constant so the seam does not load `$lib/pipeline`, or have the desk rule the import acceptable.
6. Correct the "could not divide" label and the stale comment.

## Not established

Gate 4 whole; `svelte-check`; Playwright; the print and binder families; an MNX file; the live strophic page; the print of Tchaikovsky bars 58 and 93.

## Terms

Coined here: "blocker 1", "blocker 2", "the probe". Adopted from the lane and the brief: re-deal, vacated, unexplained, overflow, orphan, undivided, carrier, close-up.

## Spend

A subagent cannot read its own meter. Estimate: 150,000 tokens of the 350,000 cap.
