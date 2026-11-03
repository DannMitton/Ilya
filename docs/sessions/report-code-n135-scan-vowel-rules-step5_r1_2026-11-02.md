# Report: N.135 scan vowel rules, step 5, `no-syllable` and one token to a note (cloud lane, branch cloud-lane-28, 2026-11-02)

Read on `cloud-lane-28`, parent `4084c1d` (step 4), from `f9797ac`. The tree was clean before this step. Source: Fable's review of the desk's reader plan (`docs/sessions/review-fable-plan-one-vowel-and-underlay_r1_2026-11-02.md`, read from `origin/Shane` at `83e8610` after `git fetch origin Shane`), finding 3 and section A. `Shane` was not merged into the lane. I read the review's finding 3, section A, and its tests section (T1); I did not read the rest of its 28 kB.

## (a) A third breach kind, `no-syllable`

- **`omr/vowels-per-note.ts`.** `BreachKind` gains `'no-syllable'`. A note with no text that is not a `continuation` is reported; a continuation with no text is not. `continuation` is an input of the caller, never a rule in the check. A lone hyphen or underscore (a joint, an extender) is still not tested. New option `noSyllable` (default on) turns the kind off for a caller that lists only notes with text. Count only: no repair, no block.
- **The scan caller, `omr/underlay-page.ts`.** It now hands the check every sung note of each seated system (`system.notes`), with `continuation = tiedInto || underExtender`, and the text of the first sewn syllable seated on that note. Before, it passed `words.flatMap` only.
- **The console line** (`omr/underlay-reader.ts`, `counted`): `note(s) breaking one vowel per note over the sung notes (N with no syllable)`, then `free notes against syllable units after the vowelless drop, by system: 1: F against U, ...`. The per-system numbers are `stats.counted.perSystem` (`free` from `freeNoteXs`, `units` the units with a letter after step 1's drop).
- **The file path.** `fixture-rule.test.ts`: `noSyllableCount(xml)` counts the verse-1 sung notes of every lyric-bearing part that are not tie continuations (ties built as at the old `:63`, from `<tie>`/`<tied>` stop and continue) and carry no text. It is counted, never failed on. Two earlier checks in that file pass `noSyllable: false` so they keep their old meaning.

### `no-syllable` counts per tracked fixture (verse 1, raw file bytes, ties only, slurs not read)

| Fixture | no-syllable | sung notes |
| --- | --- | --- |
| `fixtures/sunless-01-engraved.musicxml` | 0 | 96 |
| `fixtures/sunless-01-engraved.musicxml.bak-before-ja-2026-09-20` | 0 | 96 |
| `fixtures/sunless-01-finale-lone-v.musicxml` | 0 | 97 |
| `fixtures/tchaikovsky-op38-3-voice.musicxml` | 2 | 174 |
| `docs/sessions/assembly-a-scan-to-a-seated-song_r1_2026-10-04/tch-op38-3-from-scan_as-printed.musicxml` | 0 | 174 |
| `docs/sessions/assembly-a-scan-to-a-seated-song_r1_2026-10-04/tch-op38-3-from-scan_modern.musicxml` | 0 | 174 |
| `docs/sessions/measure-phase1_r1_2026-10-02/tchaikovsky-op38-3-voice.musicxml` | 2 | 174 |
| `packages/score-parser/src/fixtures/n188-markings.musicxml` | 4 | 26 |

These are the raw files, before the arrival repair of step 4 (which leaves the note of a folded vowelless syllable with no syllable on purpose, so the count after arrival would be higher for the copy of Sunless 1 and `n188-markings`). I did not count after arrival. I did not inspect which notes the 2 and the 4 are.

## (b) A note takes at most one token

- **`omr/underlay-words.ts` `oneToANote`.** It no longer joins the texts. Of the syllable seats on a note, the first in x order keeps it; each other becomes `note: null, unseated: true`. `sewWords` treats it like any unseated piece (`:128-146` as it stood): its letters join the open word where a hyphen says the word goes on, and a whole unseated word is left out. The lone hyphen between the two is no longer dropped; it glues as any joint does.
- **`omr/underlay-seat.ts` header** (was `:20-23`): a paragraph now says a note takes at most one token in the words, that `monotone` never shares, and that `nearest` and `order` can (flagged `shared`) and are resolved by `oneToANote`.
- **Counted as many-vowels:** `manyVowelsMerged` (`underlay-counts.ts`) is unchanged, and the console line now reads "N many-vowels merge(s) refused (a second token on a note is unseated)". It counts a refusal only where the joined text would hold two vowels or more.

### Two findings the review did not state

1. **`monotone`, the only rule the scan calls (`underlay-page.ts`), never seats two tokens on a note** (`seatTokens`: each note is taken once in both the `swap` and the plain case). So on the scan path (b) is reachable only through `nearest`, `order`, and direct callers of `sewWords`; I did not find a path by which the merge fired in production. The review attributes the many-vowel lyrics on the captures (1, 1, 3, 3, 1; «тере», «саІ», «обез») to `oneToANote`. I did not reproduce those captures, so whether they come from the merge or from elsewhere (a cut unit of two vowels carried whole, or `sewWords` joining letters, below) is NOT ESTABLISHED.
2. **A refused token's letters can still land in a many-vowel syllable.** Where a hyphen says the word goes on («су-» then «е», one note), the refused token joins the open word's last syllable, as the review asks. The result is «суе» on one note, the same as before. (b) removes the merge, not that carry. The after-the-fact check (`vowelsPerNote` over the written words) still counts it as `many-vowels`. A repair would be to leave such a token out rather than carry it; that is not what the brief asks and I did not do it.

### Reported, not changed

`writeLyrics` (`underlay-words.ts`, the `byNote` map and its `!byNote.has` guard in the first lines of the function, and the `HAS_LYRIC` skip in the note loop) keeps the first syllable it meets for a note and drops a second, and leaves a note that already has a lyric. I did not change it. After (b) two syllables on one note cannot come from `oneToANote`.

## Pins changed, with was and now

| Pin | Was | Now |
| --- | --- | --- |
| `vowels-per-note.test.ts` ("does not report a note with no text, or a joint") | `of(null, '', '-', '_', ' ')` is `[]` | `of('-','_')` is `[]`; `of(null, '', ' ')` is three `no-syllable` |
| `underlay-words.test.ts` "joins the texts of two tokens on one note…" | one syllable «суе» (merge) | same text, by the carry (hyphen at the end of «су-»); renamed |
| `underlay-words.test.ts` "gives two tokens on one note, under nearest, one syllable…" | «суе» on note 2 | «су» on note 2; «е» unseated and left out |
| `underlay-words.test.ts` "joins two tokens on one note in the order given…" | «аб» either order | «а» either order (first given keeps the note) |
| stats literals in `underlay-integration.test.ts`, `underlay-song.test.ts` | no `perSystem` | `perSystem: []` |

## Tests and mutants

Added: `underlay-page.test.ts` (3: every sung note goes to the check; continuation from `tiedInto` and `underExtender`; units counted after the drop, only for a seated system), `vowels-per-note.test.ts` (continuation as an input, the option), `underlay-words.test.ts` (never two syllables for one note), `fixture-rule.test.ts` (the counts, and a synthetic positive control). **Mutants run:** `noSyllable` defaulting off fails 4 tests; the old merge restored fails 3 tests; both restored.

## Gates, on the tree of this commit

| Gate | Result |
| --- | --- |
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 type check | 0 errors, 12 warnings |
| 4 web | 3898 passed, 1 skipped (3899), 222 files (step 4: 3891) |
| 5 score-parser | 785 passed, 5 skipped (790) |
| 6 blurb | 148 passed |
| 7 root integration | 98 passed |
| 8 ratchets | OK |
| build | exit 0 |

## Other sites that compute free notes or syllable targets (CONTRACT §4)

Agree with this one, in the sense that the same note must be a continuation in each:

- `omr/underlay-seat.ts:197` `free` in `seatTokens` (`!tiedInto && !underExtender`). **Must agree**; it is the notes the tokens are seated on.
- `omr/underlay-counts.ts:43` `freeNoteXs`. **Must agree**; it feeds rule 2's reach (step 2) and the console's "free" count. Same filter.
- `omr/underlay-page.ts:216` the new `continuation` (`tiedInto || underExtender`). **Must agree** with the two above, or the console would count a note free that the check calls a continuation. Same predicate, written a third time; a shared helper would be better, not done.
- `omr/underlay-prepare.ts:70` the source of `tiedInto` on the scan path: `<tie type="stop">` in homr's MusicXML. `underExtender` is read at `underlay-seat.ts` and `underlay-counts.ts` but I found no non-test site that sets it, so on the scan path continuation is ties only today, as the brief says.
- `score/pairings.ts:297` `syllableTargetIds`: the syllable targets of the file and typed path, from the PREVIOUS note's tie `start` or `continue`. **Must agree in effect**, not in code: a different input (parsed events, not homr's MusicXML). `fixture-rule.test.ts` `noSyllableCount` builds ties from `stop`/`continue` in the file's XML, a third way to the same question. The file path has the slur-seat rule beside it (`score/slur-seat.ts:15-21`, "these sit beside it"); I read only its header and did not establish what it makes a continuation. The later row that adds slur interiors and extenders will have to change every site above together.
- `score/old-reader-seats.ts:151`, `score/placement-scope.ts:30`, `score/heal.ts:144`, `routes/+page.svelte:1187`: callers of `syllableTargetIds` or users of its result. I did not read them for this step.

## What I could not establish

- Whether the many-vowel lyrics on the row 114 captures come from `oneToANote` (see finding 1 above).
- What the 2 notes in the Tchaikovsky fixtures and the 4 in `n188-markings` are.
- The per-system free-against-units numbers on real scans: they need a browser read.
