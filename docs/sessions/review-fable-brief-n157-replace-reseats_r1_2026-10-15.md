# Fable review of the N.157 brief (replacing a score re-derives the seats), r1

Reviewer: Fable 5.1, 2026-10-15, independent of the drafting instance. Brief: `brief-code-n157-replace-reseats_r1_2026-10-15.md`. Checked against a clone of `Shane` at `14e2ff8`; every `path:line` below read this session.

## Verdict

SEND WITH AMENDMENTS. The four rules are sound, the pure-module shape respects both ceilings, `refreshPairings` compares `origin.word` as the bare word (`pairings.ts:245`, `w.cleanWord`) so the punctuation case works as the brief says, and the orphan rule matches the 2026-10-15 desk default. One fact in the brief is wrong and it shapes the test fixture: event ids are rhythmic positions, not ordinals, so splitting a note moves no later id. Amendment 1 redesigns the fixture so the orphan path is exercised. Amendment 2 is the `+page.svelte` rule shared with N.27.

## Finding that changes the brief

The brief believes "a note added inside a bar moves the ids of the notes after it in that bar" (its line 15); `musicxml-parser.ts:726-729` builds the id from the cursor's rhythmic position (`m<measure>-<numerator>-<denominator>` of the onset fraction), so splitting a note into two halves keeps every later onset and every later id, the first half keeps the original id, and only the second half is new; the brief's test 3 ("the slots of the split bar's later notes are seated on their new ids; the old ids are returned as orphans") describes an event that does not occur with a split, and the fixture needs a rhythm change that moves an onset to test the orphan path.

## Citations

| Citation | Status |
|---|---|
| `pairings.ts:389-405` `mergeOnUpload` returns existing map; comment `:376-386` "KEPT, NOT DROPPED" | CONFIRMED (`:389-405`; `:380-386`) |
| `pairings.ts:449-486` `refreshPairings`; `:463-466` the `origin.word` match; applied at `+page.svelte:473` | CONFIRMED (`:451-486`; `:461-465`; `+page.svelte:473`) |
| `origin.word` is the bare word | CONFIRMED: `pairings.ts:245` sets `word: w.cleanWord`; the cyrillic carries the punctuation (`:240`) |
| `score-seat.ts:78-130` `seatScoreWords`; `:111` refuses decided notes and placed slots | CONFIRMED (`:78`; `:108`) |
| `clitic-seat.ts:182-227` `align`; `:211` returns null | CONFIRMED (`:182`; `:211`) |
| `+page.svelte:3264-3306` `applyArrival` order; `:3267` the sung-note list; `:3284` `orphanedCount`; `:3288` "ONLY INTO A FRESH MAP"; `:3234-3238` the restore default | CONFIRMED (`:3264-3270`, `:3267`, `:3284`, `:3288`, `:3234-3239`); `foldOnArrival` is computed before the merge at `:3263` |
| `first-seat.ts:62` `shouldFoldOnArrival` | CONFIRMED |
| `old-reader-seats.ts:237-247` `rekeyOnArrival` | CONFIRMED |
| `musicxml-parser.ts:729-731` ids positional | CONFIRMED, with the correction above: positional means the onset fraction, not the index |
| `ratchets.json:8` 6003, `:17` 1423; `wc -l` | CONFIRMED |
| `OPEN.md:2230-2258` N.157; `:2246-2248` four times; `:2254` no punctuation rule; 96 against 97 | CONFIRMED (`:2230-2256`) |
| `STATE.md:92` N.160 | CONFIRMED |
| Fixture `sunless-01-engraved.musicxml`, no `<note id>` attributes | CONFIRMED (grep: 0), so the cursor id is the id |
| `score-seat.test.ts:1-45` helpers | Not opened; the brief's "copy them" is a lead for Code |

## Amendments

### 1. The fixture: a moved onset, not a split

Replace the two fixture bullets ("One added note" and "One changed word") with:

> - **One added note that moves nothing.** In one bar, split one sung note into two of half its duration; the first half keeps its id (ids are onset fractions within the bar, `musicxml-parser.ts:726-729`), the second half is a new id at the midpoint, and every later id in the bar is unchanged. Give the second half the next syllable's underlay. State the bar and why the poem's slot count stays 96 or rises to 97.
> - **One moved onset, for the orphan path.** In a different bar, lengthen one sung note by one eighth and shorten the next by the same, keeping the bar's sum. The second note's onset moves: its old id is an orphan (kept, counted) and its new id is a note the file names for the same slot, which rule 3 seats again.
> - **One changed word:** one word whose underlay text in the file changes only in punctuation (a period added), so `origin.word` (`pairings.ts:245`, the bare `cleanWord`) is unchanged and rule 2 refreshes it. Keep the poem (`lines`) built from the corrected file's words.

And replace test 3 with:

> 3. The added half-note holds the slot the file names for it. The moved note's slot is seated on its new id; its old id is returned as an orphan, counted, and still present in the map; no other id in either bar changes.

Reason: the brief's test 3 cannot pass as written, because a split moves no id; the moved-onset edit is what exercises the orphan path the desk default is about.

### 2. `+page.svelte`: net zero lines, and no change to `ratchets.json:8`

Replace the last sentence of "The shape" ("One import line and one or two statement lines ... and say so.") with:

> One import line and one or two statement lines in `+page.svelte`, inside `applyArrival` after `doc.pairings = merged.map;` (`:3271`) and before the fold (`:3282`), guarded by `origin === 'upload' && !foldOnArrival` (`foldOnArrival` is already computed at `:3263`). A parallel session on `cloud-lane-9` (row 5) is shrinking `+page.svelte` and lowering `ratchets.json:8`; do not raise that ceiling and do not edit `ratchets.json` for this file. Pay for your lines by trimming comment lines inside the N.134 comment block you are editing (`:3285-3304`) so `wc -l` after your commit is 6003 or less. If you cannot, commit the module and its tests, leave `applyArrival` untouched, and write in the report that the wiring waits for row 5's merge.

Reason: the same ceiling line changed on two branches conflicts on merge; the module and tests stand on their own.

### 3. Rule 3 and `orphanedCount`

Append to rule 4: "`+page.svelte:3284` sets `orphanedCount = merged.orphaned.length`. After your call, set it from your result's `orphaned` instead, in the same statement, so the count includes an orphan the merge did not see (none today, since you split the same list) and never counts twice. Say in the report whether the two numbers ever differ."

Reason: two counts of the same thing on one page is the kind of drift this item exists to end.

### 4. Rule 3's `lines` when the dictionary is still loading

Append to "Wire it": "`applyArrival` may run with `lines` empty while the dictionary loads (the N.134 comment at `:3299-3302`, `scoreSeatWaiting`). With an empty queue rule 2 refreshes nothing and rule 3 seats nothing, and the live/orphan split still happens, which is harmless. Do not add a waiting path; say in the report that a replacement during the first seconds of a boot re-seats nothing, and that the fresh-map path's `scoreSeatWaiting` does not cover a replacement."

Reason: the brief does not say what happens in that window; naming it keeps Code from building a second waiting mechanism.

### 5. Branch

Replace every `cloud-lane-8` with `cloud-lane-10`.

### 6. Gate baselines

Add: "`gates-scratch.sh:111`'s expected string for gate 4 is stale (2433); compare against 2512 plus what the earlier rows of this lane added."

## Strings

None added; the orphan count's notice exists (`+page.svelte:3284` feeds it). Nothing owed.

## Executability

The module is pure; the tests build the replacement from the tracked fixture in memory; the Playwright step has an escape clause. Nothing needs a Mac, WebGPU, or a held-out song. The fixture carries no `<note id>`, so cursor ids apply as the brief assumes.

## Collision with cloud-lane-9, and whether N.157 waits for row 5

`+page.svelte`: this brief edits `applyArrival` (`:3264-3306`). Row 5's brief cites `+page.svelte` lines 710 to 1332 (the correction station) and lowers `ratchets.json:8`; row 47's brief cites no `+page.svelte` line; row 13 measures only. The hunks are far apart; the ceiling line is the collision. Under amendment 2, N.157 does not wait for row 5: it is net zero in `+page.svelte` and leaves `ratchets.json` alone. If Code cannot pay for its lines, the module and tests land and the two-line wiring waits for row 5's merge, which is the amendment's fallback. The lane-9 diff is NOT ESTABLISHED (branch not in this clone), so whether row 5 has moved `applyArrival` today cannot be said here. The lane-9 reviews in this folder confirm the collision point: `review-fable-brief-row5_r1_2026-10-15.md` amendment 11 has row 5 lowering `ratchets.json:8` and rows 47 and 48 raising it by their props' lines, at `+page.svelte:4826-4874` and `:862-878`; none of those regions is one this brief edits.

## What I could not establish

- Whether `align` tolerates the edited fixture; the brief already asks Code to report it.
- Whether the N.134 comment block has enough trimmable lines to pay for three; it is 20 lines of prose at `:3285-3304`.
- What cloud-lane-9 has changed in `+page.svelte` today.
