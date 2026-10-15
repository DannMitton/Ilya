# Report: N.157, replacing a score re-derives the seats (r1)

Code (cloud lane, Sonnet), 2026-10-15, branch `cloud-lane-10`. Brief: `brief-code-n157-replace-reseats_r1_2026-10-15.md`, with the amendments of `review-fable-brief-n157-replace-reseats_r1_2026-10-15.md` applied (the moved-onset fixture, the net-zero `+page.svelte` rule, the single orphan count, and the empty-`lines` window). Desk default applied: a placement whose note or word is gone is KEPT and counted. No string was written.

## The answer in three lines

1. New pure module `apps/web/src/lib/score/replace-seat.ts` exports `reseatOnReplace`, which splits the map into live and orphaned seats, refreshes the live seats' text, seats the notes the new file adds, and puts the orphans back. `applyArrival` calls it for an upload onto a song that already held a syllable, and for nothing else.
2. In the built site, with the poem box holding the corrected words, dropping the corrected file draws the added note's syllable («ах» and its IPA «ˈɑx») on the Markup page; a control build without the wiring draws neither.
3. `+page.svelte` is 6002 lines (ceiling 6003, `ratchets.json` untouched); `pairings.ts`, `score-seat.ts`, `clitic-seat.ts`, `mergeOnUpload`, and `refreshPairings` are unchanged. One finding changes how often the orphan path runs in the page: see "What the page does with orphans".

## The four rules

`apps/web/src/lib/score/replace-seat.ts`, each also a sentence in the file header.

1. **Split.** `:69-72`: live is an entry whose id is a sung note of `parsed` (`vocalLine` minus rests, the list `+page.svelte` gives `mergeOnUpload`); orphaned is the rest, set aside.
2. **Refresh.** `:74`: `refreshPairings(live, buildSlotQueue(lines))`. A seat whose `origin.word` matches reads the current slot's Cyrillic and IPA, punctuation included; a seat whose word differs is left as stored. The count `refreshed` is the live entries whose object changed (`:75`). No punctuation rule was written.
3. **Seat.** `:76`: `seatScoreWords(parsed, refreshedLive, lines)`. The orphans are not in the map it is given, so a slot an orphan held can be seated again on the note the file now names for it. Where `align` returns null it seats nothing (tested).
4. **Put back.** `:78-82`: the orphans are merged back under their old ids and counted.

Nothing is mutated; the test pins it with a deep copy.

Wired at `apps/web/src/routes/+page.svelte:3275-3276`, after `doc.pairings = merged.map` and before the fold: `origin === 'upload' && !foldOnArrival`. `foldOnArrival` is `shouldFoldOnArrival(doc.pairings)` computed after `rekeyOnArrival` (`:3263`), so it is false exactly when the map held a syllable. A restore (`origin !== 'upload'`) and a first upload (`foldOnArrival` true) take the code they took before: `reseated` is null and nothing else on those paths changed. `orphanedCount` is set at `:3289` from the result, `reseated?.orphaned ?? merged.orphaned.length` (amendment 3). The two numbers cannot differ for a replacement: both count the map's ids that are not sung notes of the new score, and a unit test asserts `mergeOnUpload(...).orphaned.length` equals `result.orphaned` on the fixture.

## The fixture edits, and the counts

Built in `replace-seat.test.ts` from the tracked `ingestion/fixtures/sunless-01-engraved.musicxml` (not a second committed file). The nth `<note>` of the vocal part `P1` is the nth `vocalLine` event, so each edit is made by event id. Three edits, per review amendment 1:

- **Added note that moves nothing.** The last sung note `m17-5-8` («я.», an eighth) is split into two sixteenths. The first half keeps `m17-5-8` (ids are onset fractions, `musicxml-parser.ts` `cursorId`); the second is the new id `m17-11-16` and carries a new final word «ах». The poem rises from **96 slots to 97**, at the very end, so no existing word's index shifts and every stored origin still names the slot it named. (I chose a new word at the end rather than a syllable inside a word because an inserted word mid-poem would shift every later `wordIndex`, and the stored origins would then name other words' slots.)
- **Moved onset.** In the first bar «Ком» goes from a quarter to a dotted quarter and «нат» from a quarter to an eighth; the bar's sum is unchanged. «нат» now begins at 3/8: its old id `m1-1-4` is gone and the new id is `m1-3-8`.
- **Changed word.** «тень» (`m3-0-1`) gains a period in the file's underlay. `origin.word` stays `тень`, so rule 2 refreshes the seat to «тень.».

The poem for the corrected file is built from the corrected file's own words, as the brief asked.

| quantity | value (read from a run) |
|---|---|
| slots before, after | 96, 97 |
| stored seats before | 96 |
| entries after | 98 (96 + the added note + the moved note's new id; the old id stays) |
| seats on untouched notes kept as stored | 94 |
| `refreshed` | 1 (`m3-0-1`, «тень» to «тень.») |
| `seated` | 2 (`m17-11-16` «ах», `m1-3-8` «нат») |
| `orphaned` | 1 (`m1-1-4`) |

**Was any seat both orphaned and re-seated?** Yes, one, and I report it plainly: the slot at origin `0-0-1` («нат», word «Комнатка», slot 1) is now held twice, once by the live new id `m1-3-8` and once by the orphan `m1-1-4`. That is what the brief asked for ("put the orphans back under their old ids"), and the orphan is a dead id the score no longer has. I did not trace every reader of the map to see whether any of them counts a slot by iterating all entries; a reader that does would count that slot twice. NOT ESTABLISHED. The pass leaves the last note undecided in the original too (`m17-5-8`, the fold's blank), which is existing behaviour and unchanged.

**Did `align` tolerate the edited fixture?** Yes: with the corrected poem it returned rows and seated two slots. With one word's letters changed in the poem («Комнотка»), `align` returns null, `seated` is 0, and the live seats are still refreshed and kept (tested).

## What the page does with orphans (a finding that bears on the brief)

The orphan path in `reseatOnReplace` is correct and tested, but the page rarely reaches it with an orphan. `arrivalDecision` (`apps/web/src/lib/library/library.ts:535-545`) returns `'ask'` when the stored fingerprint differs from the incoming one **and** at least one placement is orphaned, and `+page.svelte:3081-3100` then raises the "This is not the same music" dialog whose "Replace this song" clears the whole map (`applyArrival(..., true)` at `:3092`, which clears the map at `:3159-3160`). I saw that dialog in the browser when I dropped the moved-onset copy: "1 of your 97 syllable placements have no note in it. Continuing replaces the whole song". So in the page an orphan reaches `reseatOnReplace` only when the song has no stored fingerprint, the fingerprint could not be computed, or the fingerprints match. A moved onset therefore asks the singer first, and a replacement that only adds a note at an unused rhythmic position or corrects a word goes straight through. I did not change `arrivalDecision`. Whether a moved onset should still ask is the desk's question, not this row's.

## The Playwright observation (the built site)

Instrument: `pnpm --filter @ilya/web build`, `python3 -m http.server 5199` over `apps/web/build`, a Node script driving the sandbox Chromium (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, 1440 by 1300) with a seeded voice, as `insights-page.test.ts` seeds one. The corrected file for the browser has the added note and the period only (the moved-onset copy hits the dialog above, so it cannot show the in-page path). Steps and what the Markup page's SVG text showed:

1. Upload the original. Markup: «тень» present, «тень.» absent, «ах» absent (526 text nodes).
2. Fill the poem box with the corrected words (the period on the first «тень», and «ах» at the end). A score replacement does not change the poem; this is "a singer who had already corrected the text", as the brief says.
3. Drop the corrected file. No dialog opened.
4. Markup, with the wiring: «тень.» appears, «ах» appears, «ˈɑx» appears (530 text nodes).
5. **Control:** the same steps on a build with `+page.svelte` as it stood before this row. «тень.» still appears (528 nodes), but «ах» and «ˈɑx» do not. So in this flow **the period reaches the Markup with or without this row** (the page already refreshes a stored seat's text from the poem at display time, `shownPairings`), and the gain the browser shows is the added note drawing. I did not reproduce Dann's original observation of a period missing on the Markup; this flow does not show it.

One run per condition. The control build was made from the unmodified `+page.svelte` (stashed and restored); I did not rebuild with the wiring afterward, and the gates do not use a build.

## Line counts of the two hotspots

| file | before | after | ceiling |
|---|---|---|---|
| `apps/web/src/routes/+page.svelte` | 6003 | 6002 | 6003, `ratchets.json` not edited |
| `apps/web/src/lib/score/pairings.ts` | 1423 | 1423 | 1423, untouched |

`+page.svelte` gained an import and two statements and changed one, and lost the trimmed N.134 comment lines (I condensed that block and kept every rule and date in it; I added the sentence that a replacement in the dictionary-loading window re-seats nothing and is not covered by `scoreSeatWaiting`, per review amendment 4). `ratchets.mjs` prints that the `+page.svelte` ceiling could now be lowered by one; I left that line alone as instructed.

## The empty-`lines` window

`applyArrival` may run with `lines` empty while the dictionary loads. Then rule 2 refreshes nothing and rule 3 seats nothing, and the live/orphan split and count still happen. A replacement during the first seconds of a boot therefore re-seats nothing, and the fresh-map path's `scoreSeatWaiting` does not cover it. I built no waiting path.

## Tests

| gate | baseline | now | added by |
|---|---|---|---|
| 4 web-test | 2534 (after rows 91, 100, 99) | 2542 | +8, `apps/web/src/lib/score/replace-seat.test.ts` |

The brief's seven tests, adjusted by review amendment 1 (test 3): the fixture edits themselves (97 slots against 96, ids moved as designed); every untouched seat keeps its id, origin, and text; the changed word reads «тень.»; the added note holds «ах» and the moved note holds «нат» on its new id, with the old id kept, counted, and the count equal to `mergeOnUpload`'s; a hand placement survives and the file does not overwrite it; a melisma and an empty decision survive; a poem that does not match seats nothing and still refreshes and keeps; the input map is never mutated.

## What I could not establish

- Whether any reader of the pairing map counts a slot by iterating every entry (the doubly held slot above).
- Dann's original observation (Markup without the period) in this flow; the control build shows the period arriving anyway when the poem box holds it.
- The Markup page by eye. The proof reads SVG text nodes, not a rendering.
- Anything about a real corrected file from an engraving program; the fixture edits are synthetic, and the added word «ах» is invented for the test.
- The orphan path through the page for a song with a stored fingerprint: the dialog gates it, as above.
- `gates-scratch.sh:111` is stale for gate 4 (2433); I did not edit the script.

## Gates

| # | gate | expected | result |
|---|---|---|---|
| 1 | phonology | 267 | 267 passed |
| 2 | dictionary | 248 | 248 passed |
| 3 | web-check | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files |
| 4 | web-test | 2542 | 2542 passed |
| 5 | score-parser | 675 passed, 5 skipped | 675 passed, 5 skipped |
| 6 | blurb | 145 | 145 passed |
| 7 | integration | 55 | 55 passed |
| 8 | ratchets | OK | OK (reports that the `+page.svelte` ceiling could be lowered by one; left alone) |
