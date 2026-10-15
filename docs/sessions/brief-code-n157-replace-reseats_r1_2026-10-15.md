# Brief: N.157, replacing a score re-derives the seats (r1)

Desk (Fable 5.1 drafting for Opus), 2026-10-15. For Code (cloud lane, Sonnet), on `cloud-lane-8`, after the Chrome-on-iPhone row. Row 4 of 5. Spec: `docs/memory/OPEN.md`, section "N.157. REPLACING A SCORE DOES NOT RE-DERIVE THE SEATS" (`OPEN.md:2230-2258`). Desk default ruled tonight: a placement whose word no longer exists in the new text is KEPT and counted. Every `path:line` here was read in a clone of `Shane` at `14e2ff8` on 2026-10-15.

## What the singer sees and gains

A singer corrects a score in their engraving program (adds a note the engraver missed, fixes a word's spelling or punctuation) and drops the corrected file onto the song. Today every seat survives with the text it was made with, the added note draws nothing, and the Markup page keeps showing the old text while the Transcription page shows the new (`OPEN.md:2246-2248`: Dann asked four times for a period). After this row: every seat whose note is still there stays; a seat whose word is unchanged reads the current text, punctuation included; the note the corrected file adds is seated from the file's own underlay; and a seat whose note or word is gone is kept out of the way and counted in the existing orphan notice, never deleted. The singer's hand placements are not touched.

## What the tree does today

- `apps/web/src/lib/score/pairings.ts:389-405`, `mergeOnUpload`: with any existing pairing it returns `{ map: existing, proposed: false, orphaned }` unchanged. Only an empty map gets `firstPass`. Its comment at `:376-386` says orphans are "KEPT, NOT DROPPED, and reported as a count".
- `pairings.ts:449-486`, `refreshPairings`: brings a seat's text forward from the slot at the same origin only where `origin.word` matches (`:463-466`); it is applied at display time (`apps/web/src/routes/+page.svelte:473`, `shownPairings`), never written back.
- `apps/web/src/lib/score/score-seat.ts:78-130`, `seatScoreWords`: seats the poem's slots on the notes the file's own underlay names; it refuses a note that already carries a decision and a slot some note already holds (`:111`), aligns the file's words with the poem through `align` (`clitic-seat.ts:182-227`), and returns `{ map, seated, withheld }`. `align` returns `null`, and nothing is seated, when one file word does not match the poem (`clitic-seat.ts:211`).
- The arrival: `+page.svelte:3264-3306`, `applyArrival`. The order is `rekeyOnArrival` (row 93, `old-reader-seats.ts:237-247`), then `mergeOnUpload`, then `seatCliticFolds` only where no syllable was placed before (`shouldFoldOnArrival`, `first-seat.ts:62`), then the score's own seat "ONLY INTO A FRESH MAP" (`:3288`). `orphanedCount = merged.orphaned.length` at `:3284` already feeds the orphan notice.
- Event ids are positional within the bar: `m<measure>-<numerator>-<denominator>` (`packages/score-parser/src/musicxml-parser.ts:729-731`). A note added inside a bar moves the ids of the notes after it in that bar only; later bars keep theirs. The seats on the moved notes become orphans of the old ids.
- `+page.svelte` is at its ratchet ceiling (`scripts/ratchets.json:8`, 6003 lines) and so is `pairings.ts` (`ratchets.json:17`, 1423 lines). The logic goes in a new pure module.
- N.160 (`OPEN.md`, `STATE.md:92`) retires `refreshPairings` in a later step and stores the seated text with the song. It is not built past step 3. This row does not depend on it and must not pre-empt it: use `refreshPairings` as it is.

## The shape

New pure module `apps/web/src/lib/score/replace-seat.ts`, one export:

```ts
export function reseatOnReplace(
	map: PairingMap,           // after rekeyOnArrival and mergeOnUpload
	parsed: ParsedScore,       // the replacement score
	lines: readonly LineData[], // the poem's transcription, +page's `lines`
): { map: PairingMap; refreshed: number; seated: number; orphaned: number }
```

Rules, in order, each a sentence in the file header:

1. **Split the map into live and orphaned.** Live: entries whose event id is a sung note of `parsed` (`vocalLine` minus rests, the list `mergeOnUpload` is given at `+page.svelte:3267`). Orphaned: the rest. Orphans are set aside, not dropped.
2. **Refresh the live seats' text** with `refreshPairings(live, buildSlotQueue(lines))` (`pairings.ts:449`). A seat whose `origin.word` still matches reads the current slot's Cyrillic and IPA, period included; a seat whose word differs is left exactly as stored (`:463-466`), because a different word at the same position is a different decision.
3. **Seat the notes the new file adds** with `seatScoreWords(parsed, refreshedLive, lines)` (`score-seat.ts:78`). It refuses decided notes and placed slots by its own rules, so it writes only onto notes that hold nothing, and only where the file's word matches the poem's. The orphans are not in the map it is given, so a slot an orphan held may be seated again on the note the file now names for it: that is what makes a moved note draw again. Where `align` returns null (a file word that no longer matches the poem), it seats nothing, and the report says so.
4. **Put the orphans back** under their old ids and return the counts. `orphaned` is the number the page already shows.

Wire it in `applyArrival`, after `mergeOnUpload` and before the fold, for a replacement only: `origin === 'upload'` and the map held at least one syllable before the merge (`!shouldFoldOnArrival(doc.pairings)` is that fact, `first-seat.ts:62`). A restore must not pass through it (DESK DEFAULT at `+page.svelte:3234-3238`: a restore "must never be questioned"), and a first upload keeps its existing path. One import line and one or two statement lines in `+page.svelte`; pay for them by trimming a comment you touch, or raise the ceiling by the exact count with the reason in the commit message (`ratchets.json:2` permits it) and say so.

No punctuation rule anywhere: the period is already in the slot text (`OPEN.md:2254`).

## Test fixture

Build the replacement in the test from the tracked fixture, not as a second committed file: `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` (96 slots, 39 words, read by `score-seat.test.ts:1-45`, whose `parse`, `poemLines`, and `arrive` helpers you can copy). The corrected copy is the same XML string edited in the test:

- **One added note:** in one bar, split one sung note into two of half its duration, the second carrying the next syllable's underlay text that the original note carried as a melisma continuation or an extra syllable (choose a bar where the engraving lets the poem's slot count stay 96 or rise to 97; state which and why). The page's story was 96 elements against the file's 97 (`OPEN.md:2244`).
- **One changed word:** one word whose underlay text in the file changes only in punctuation (a period added), so `origin.word` is unchanged and rule 2 refreshes it. Keep the poem (`lines`) built from the corrected file's words, which is what a singer who had already corrected the text has.

Tests in new `apps/web/src/lib/score/replace-seat.test.ts`:

1. Arrive on the original (`arrive`), then `reseatOnReplace` on the corrected copy: every seat on an untouched note keeps its event id, origin, and text.
2. The seat of the changed word reads the current slot text with the period.
3. The added note holds the slot the file names for it; the slots of the split bar's later notes are seated on their new ids; the old ids are returned as orphans, counted, and still present in the map.
4. A hand placement (`placeSyllable` or a literal `syllable` entry you add on a note the file does not name for that slot) survives untouched, and the file's seat does not overwrite it.
5. A `melisma` and an `empty` decision survive.
6. With a poem that does not match the corrected file (change one word's letters in `lines`), `seated` is 0 and the live seats are still refreshed and kept.
7. The function never mutates its input map (compare a deep copy).

## Done when

1. The seven tests pass and the fixture's counts are in the report (slots before and after, seats kept, refreshed, seated, orphaned).
2. In Playwright on the built site: upload the original fixture, wait for the seats to draw, upload the corrected copy written to a temp file, and assert the added note draws a syllable and the changed word's period is on the Markup page. If the build cannot be driven that far in headless Chromium, say which step you reached and rest the claim on the unit tests.
3. A restore (`origin !== 'upload'`) and a first upload take the same code path as before; cite the lines.
4. Neither hotspot grows past its ceiling, or the raise is exact and explained.
5. All eight gates pass; gate 4 rises only by the tests you added, named.

## Gates

The eight commands in `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117`. Baselines after row 98: phonology 251, dictionary 248, web-check 0 errors 12 warnings, web-test 2512, score-parser 675 passed 5 skipped, blurb 145, integration 55, ratchets OK, plus what the earlier rows of this lane added. Cloud notes: `docs/memory/ENVIRONMENT.md`, "THE GATES RUN IN A CLOUD CLONE".

## Constraints

- Commit to `cloud-lane-8` only; no pull request; `docs/memory/` untouched.
- Do not change `mergeOnUpload`, `refreshPairings`, `seatScoreWords`, or `align`. Do not delete an orphan. Do not add a punctuation rule. Do not touch `VocalLineEvent` or `reconciliation/` (CONTRACT §8).
- No new string: the orphan count already has its notice.

## Report

`docs/sessions/report-code-n157-replace-reseats_r1_2026-10-15.md`: the answer in three lines; the four rules with `path:line`; the fixture edit (which bar, which word) and the counts; the Playwright observation or where it stopped; the line counts of the two hotspots before and after; the gates; what you could not establish.

## What you could not establish

Include whether `align` tolerated the edited fixture, and whether any seat was both orphaned and re-seated (the slot held twice, once under a dead id). NOT ESTABLISHED beats a complete invented answer.
