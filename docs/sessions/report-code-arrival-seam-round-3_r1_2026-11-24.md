# Report: the arrival seam, round 3 (Code, cloud lane 88 continued), r1

Written on `cloud-lane-88`, 2026-11-24. Round 3 builds Dann's ruling on the count gate, Fable's fixes A and B, and one DESK DEFAULT. **NOT ESTABLISHED: Fable's round 2 review.** `review-fable-lane88-round2_r1_2026-11-24.md` is on the Mac, not in the repository (I searched every remote branch), so I built fixes A and B from the wording in my orders. Nothing was merged, nothing went to `Shane`, `ilya-ship.sh` was not run, no French was written, and `slur-seat.ts`'s own formula is untouched. Paths are under `apps/web/src/lib/score/` unless they say otherwise.

## The ruling: a failed gate seats the verse as 5594904b seated it, with one record

Built. The gate keeps its shape (`ingestion/melisma-evidence.ts`, `evidenceFor`). What changed is what a failure means, in `ingestion/ingest.ts` (`withUnderlayRecord`):

- For a verse whose gate is `failed`, **no per-note abstention is written** (neither the unexplained notes nor the vacated tail), and its slurs are not claimed.
- **One record per failed verse**: a `ParseWarning` with the new code `slur-evidence-unchecked` (added to the existing union line in `packages/score-parser/src/types.ts`, which stays at 1000 lines).
- Where the gate passes, or there is no slur in the verse (`none`), everything stays as built in round 2, including the per-note record for a textless note with no print evidence.

**The sentence for Corrections** (`ingest.ts`, `slurUncheckedText`). **DRAFT, owed to Dann for ratification, and flagged for a French draft:**

> The slurs in verse N could not be checked against the number of syllables, so please check where this verse holds a note.

**Proof, committed** (`ingestion/round2.test.ts`, "round 3, the ruling"):

- `ingestion/fixtures/base-5594904b-strophic-seating.json` holds, per event and per verse, the vowel and IPA that the base seam gives for every `strophic-*` fixture and `repeat-one-verse`. I generated it with the old fold taken from `git show 5594904b:` run through the same parse, `foldDictionMarks`, `verseView`, and resolver, then deleted the scratch copy. I did not check out and run the whole base tree; the old fold is the one piece of the seam that differs on these files.
- The test compares the current result with it for every verse of all ten files: **identical**. On `strophic-repeat` and its three siblings every verse keeps 32 vowels and 30 IPA, as the base gives. Round 2 left 30 vowels.
- A second test proves each fixture's verses with a failed gate carry exactly one `slur-evidence-unchecked` record and no abstention for that verse, and a third that all four repeat files fail the gate in all three verses, so the test has something to hold.
- A fourth test pins that Tchaikovsky (gate `none`) keeps its two per-note records.

**Two readings of the ruling to check.**

1. "Seats exactly as the base seats it" is built as: no abstention and no slur claims. The text re-deal (fusion and division) is not undone for a failed-gate verse. On the ten strophic files that makes no difference, since none needs fusion or division. On a song that has both a fusion and a failed gate, the text would differ from the base's (the tail closes up). Your call whether the ruling reaches that far.
2. "Exactly one record" is one `slur-evidence-unchecked` warning per failed verse. A failed verse that also has text with no note, a mark alone, or an undivided token still has those items in the `underlay-count` warning, which is a separate record about other things. None of the ten fixtures has both.

**Consequence for `n188-markings.musicxml`.** Its gate fails, so it now carries one record and no abstention. Its two vacated tail notes (`ко`, `нец`) therefore have no abstention, and the resolver sustains a vowel across them as the base did. `underlay-record.test.ts` is rewritten to say that.

## Fix A: the base verse is counted over the bars it shows

Built, `melisma-evidence.ts` (`scopeOf`). A later verse shows the bars where it has words; the base verse shows every bar except one that carries words only on a later verse's line. New fixture `packages/score-parser/src/fixtures/second-ending-verse-2.xml` (`.xml` so the strophic baseline list is untouched): three bars of verse 1, then a fourth bar lettered as verse 2 only, with a slur on «День». Verse 1 is counted over 12 notes against 12 syllables (gate `none`, nothing recorded); verse 2 over 4 notes against 3 syllables (gate `passed`, the slur's second note keeps its vowel). Before the fix verse 1 counted 16 notes, failed the gate, and recorded bar 4's four notes. The test asserts the post-fix numbers; I did not re-run the pre-fix code to confirm the 16, so that figure is reasoned, not measured.

## Fix B: the extender case

Built, `round2.test.ts` "round 3, fix B": a fragment on an extender-held note leaves the note with no syllable and the tail in place; the control without the extender id closes the tail up.

## DESK DEFAULT: pinned notes come off the count before the gate

Built, as ordered. `evidenceFor` takes the pinned notes (a mark alone, a token with no Cyrillic letter) and removes them from the scope before the gate, as extender-held notes come off. A mark alone beside a slurred melisma no longer fails the gate (`round2.test.ts`). The pinned note stays counted as damage in the `underlay-count` message, and `sung` in the count now excludes it.

## Where the seam's gate and the seating gate differ

Read, not run. The seam's gate is `melisma-evidence.ts:73-80` (`evidenceFor`). The seating gate is `observedTargets` at `slur-seat.ts:41-49`, whose formula I did not change. They differ in five ways:

| | Seam gate | Seating gate |
|---|---|---|
| Notes counted | the verse's scope (bars it shows) | every sung note of the file |
| Extender-held notes | taken off first (fix 4) | not taken off |
| Pinned notes | taken off first (this round) | not taken off |
| Syllable count | the verse's syllables after the deal | the poem's slot count (`queue.length`) |
| On failure | one record, no abstention, nothing claimed | `{ targetIds: targets, marks: {} }`: one syllable per note, no melisma marks |

**What a page would show for a song that passes one and fails the other.** They run on different paths. `slur-seat.ts`'s own header says seating observes slurs at the first seating only, for a score that carries no words, with a typed poem; a score with its own words goes to `seatScoreWords`, which copies the file's cells. So for a song with its own words the seating gate is not consulted, and the seam's gate alone decides: pass means its slurs are evidence, fail means one record and the base's seating. For a wordless score with a typed poem the seam does not run (no Cyrillic verse in the file) and only the seating gate decides. The one visible case is a file with words that is later seated from a poem, which I did not find a path for; if one exists, a song with an extension line and a slur would pass the seam (both held) and fail seating (its extension line's notes still count as sung notes), so the slur notes would take a syllable each. NOT ESTABLISHED by running the page.

## Gates

| Gate | Result |
|---|---|
| Gate 4, `apps/web` unit suite, whole | **6886 passed \| 5 skipped (6891)** against the baseline `6810 passed \| 1 skipped (6811)` |
| Skip split | 4 `burg` tests skipped for want of `scipy` (`import scipy` still fails here; not installed), 1 `heic` test skipped for its own environment variable |
| `@ilya/score-parser` | 913 passed, 5 skipped |
| `pnpm run ratchets` | OK |
| `pnpm run check` | 0 errors, 12 warnings, all in five untouched `.svelte` files |
| Build, Playwright | not run this round |

## Left undone

- Fable's round 2 review, unread (above).
- The baseline was not re-captured; the Tchaikovsky and Sunless numbers do not move this round.
- The sentence is in English only, and nothing puts it on a page: that is slice 6R.

## Where I guessed

1. The two readings of the ruling above.
2. The exact words of the sentence.
3. The base snapshot comes from the old fold plus the current parser, not a full base checkout.
4. "Bars it shows" for the base verse: a bar with no words at all counts as shown.

## Addendum: the ratified sentence, seated and pinned (2026-11-24)

**The two decisions are confirmed.** Text moves: a failed gate does not undo the re-deal, so a song with both a fusion and a failed gate seats its text by the re-deal. `n188-markings`: corrected in round 4. Its two vacated tail notes take no vowel, because a rest at `m6-0-1` ends the sustain (`vowel-resolver.ts:265-266`), so n188 does not show the harm of a sustained vowel on an emptied note. Round 4 step 2 repairs that harm where no rest intervenes. The first decision needed no change; it was built that way.

**The strings.** Dann's ratified English and French (2026-11-24 21:43) replace my draft word for word.

- **Key: `upload.banner.slurEvidenceUnchecked`**, in `lib/i18n.ts`, after `upload.banner.wordsPartlyReadOne`. I chose the `upload.` prefix because it already lists `ingestion/ingest.ts`, so the key index needed only its two numbers moved (`upload.` 50 to 51; the file's total 1,348 to 1,349), and `i18n-index.test.ts` passes.
- **The two counts:** `{n}` is the verse's syllables and `{m}` its sung notes. No derived figure. One detail: `{m}` is the verse's sung notes less any note the deal left on its own (a mark alone, or a token with no Cyrillic letter), because those come off the count before the gate. A note holding an extension line stays in `{m}`. Say if you want `{m}` to be every sung note of the verse instead.
- **French:** every apostrophe is U+2019, and the text holds no punctuation that takes a no-break space, so the OQLF spacing rule has nothing to apply to it. A test checks that no straight apostrophe is present.
- **Pin:** `ingestion/ratified-slur-line.test.ts`, character for character in both languages, in the manner of `insights/ratified-lines.test.ts`, plus a check that each language carries `{n}` and `{m}` and nothing else.
- **The carrier now fills the English** (`ingest.ts`, `slurUnchecked`) and carries `verse` and `counts` on the `ParseWarning` (two optional fields, added on an existing line of `types.ts`, still 1000 lines), so Corrections can fill the French from the same key. My draft's `slurUncheckedText` is removed. The `n188-markings` test now checks the message against the key with its own counts.

**Gate 4 whole: 6889 passed | 5 skipped (6894)**, against 6886 passed | 5 skipped (6891) before. Skip split unchanged: 4 `burg` tests skipped for want of `scipy` (not installed here), 1 `heic` test skipped for its own environment variable. The score-parser suite (913 passed, 5 skipped), ratchets, and `svelte-check` (0 errors, 12 warnings in the same five untouched files) pass. Build and Playwright were not run. Nothing was merged, nothing went to `Shane`, and `ilya-ship.sh` was not run.

**Addendum 2 (2026-11-24): `{m}` is every sung note in the verse, pinned ones included.** A desk ruling, 2026-11-24, until Dann rules it: she counts noteheads, and a mark alone is still one. `{m}` now reads `Evidence.notes` (`melisma-evidence.ts`), the verse's whole scope before pinned notes come off the gate; `ingest.ts` `slurUnchecked` fills `{m}` and `counts` from it. The gate still takes pinned notes off its own count. `ratified-slur-line.test.ts` pins this with a verse holding a mark alone (3 syllables, 6 sung notes, the mark counted), so a later lane cannot narrow it. **Gate 4 whole: 6890 passed | 5 skipped (6895)**, skips unchanged (4 `burg` for want of `scipy`, 1 `heic`). Ratchets OK; `svelte-check` 0 errors, 12 warnings as before. Not merged, not pushed to `Shane`, `ilya-ship.sh` not run. The lane is finished.
