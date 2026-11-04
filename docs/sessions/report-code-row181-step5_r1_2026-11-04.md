# Report: row 181, step 5 (wiring), Code, r1, 2026-11-04

Branch `cloud-lane-34`, on top of step 4 (`48822eba`). The join of step 4 now runs on a scan's Lyrics when its Poem arrives or changes, applies repairs and fills as one Lyrics edit, marks what it wrote, shows a receipt with Revert, and never writes the Poem. **Nothing has been run in a browser.** Everything below is WRITTEN, not DONE, and no row 114 count is given (the desk's step 7). NOT ESTABLISHED marks what I could not establish.

## 1. What changed

| File | What |
|---|---|
| `text/poem-join-wire.ts` (new) | the inputs from the page: `tokenMapOf`, `buildRuns`, `byFromScan`, `tokensIn`, and the engine-facing `joinIsWord` and `slotsFor` |
| `text/poem-join.svelte.ts` (new) | `PoemJoin`: `schedule` (the 600 ms pause), `run`, `receipt`, `marks`, `revert`, and the one console line |
| `text/poem-offer.svelte.ts` | `onPoemEdit` calls `poemJoin.schedule()` (not for `'boot'`) |
| `components/Drawer/IntakeViews.svelte` | the dotted underline (`::highlight(intake-poemwritten)`), the receipt line with Revert, and the tap note |
| `i18n.ts` | `lyrics.receipt.fromPoem`, `lyrics.receipt.fromPoemOne`, `lyrics.filled.note`, English and French exactly as ratified (items 6 to 8 of `strings-row181_r1_2026-11-04.md`; `{n}` stands for the example's 6); Revert reuses `loupe.restore` as the strings file says |
| `routes/+page.svelte` | **5586 before, 5586 after.** Two existing lines edited in place: the `poemOffer` import line now also imports `poemJoin`, and the existing `poemOffer.attach(...)` line also carries `poemJoin.attach({...})` (the scan's state lent to the join in one expression). No line was added, so amendment 18's "move out as many" did not arise |
| tests | `text/poem-join-wire.test.ts` (14), `text/poem-join.svelte.test.ts` (10) |

## 2. How it runs

- **When.** Poem arrives or is edited: the library's fill goes through `put` to `handlePoemEdit`, which calls `poemOffer.onPoemEdit`, which now schedules the join; a pasted or typed Poem does the same. The join runs once the 600 ms pause (`JOIN_PAUSE_MS`, the pause Lyrics typing uses, `+page.svelte` `QUIET_MS`) has passed since the last Poem edit. **Answer to Fable's open question:** a Poem edit did not start that pause before; it does now, for the join only.
- **For which songs.** Only where the page lends a state: a scan whose score carries words (`ingestedScore` and a non-empty `scoreText`), with the dictionary loaded (`!loaderState.isLoading && loaderState.entryCount > 0`, the test `+page.svelte:2539` uses). Without the dictionary every word would fail and every word would be repaired, so it waits. It skips a read-only song, an empty Poem, and a poem the singer has Reverted (this session).
- **What it reads.** `comparePoem(Lyrics, Poem)`; the dictionary after normalizing (`joinIsWord`: `isKnownWord`, then `isKnownWord` of `modernisePreReform`, the test `Seams.isWord` makes, `underlay-seams.ts`); the slot count (`slotsFor`: `processText` on the words laid out as one line, then `buildSlotQueue`, each slot tagged with its word). The notes: the parsed events, the pairings, and the unread bars from the `words-partly-read` warning.
- **The runs (`buildRuns`).** A note needs a word where it is not a continuation (a tie into it, or a `melisma` decision) and carries no decision. **So the print's extender, which step 1 turns into melisma decisions on arrival, can never be in a run: a blank under an extender stays blank and is filled by nothing.** Tested. A decided-empty note and a syllable the token map cannot place end a run with an unanchored side. A run has two counts where a slur crosses it (all notes, and all notes less those under a slur: amendment 8), and one where none does. A run in a bar the banner lists is an unread system (`kind: 'unread'`). **Bars are the event's `measureIndex + 1`; NOT ESTABLISHED that this equals the song's bar for every scan** (for a scan the join renumbers bars continuously from 1, `omr/join-pages.ts`, which I did not re-read).
- **The self-check.** `tokenMapOf` checks every transcribed word against the LYRICS token it should be, by folded form; any disagreement, or a count that differs, gives no map and the join does nothing and says so (tested: a transcription that has not caught up with an edit). After the plan, the pure cross-check applies it and runs the tiers on the result; a repair found the second time is a fault, counted. The join prints one console line for the desk: `[ilya] poem join: N repaired, N filled, N kept as the composer's, N offered (reasons), N run(s) of notes with no word, N syllable(s) not placed, N dropped by the one-vowel check, N fault(s) on the second pass`. That line is the measure of the join on a real song.
- **The edit.** The applied plan is one Lyrics text sent through `handleInput(text, 'paste')`, the path a typed edit takes (`setLyrics`), so the seats follow by the diff (`score/reseat.ts`: an inserted word takes open notes, a replaced word takes the notes the old one vacated) and the pipeline runs as for any edit. Poem is not written: a test pins `publishedPoem` byte for byte across a join.
- **The marks, the receipt, the note, Revert.** The written words are underlined with a dotted line (the CSS Custom Highlight API, like the sage and grey; no colour of their own). The receipt reads "6 syllables filled from your poem" (the syllables are the slots of the words written) with Revert (`loupe.restore`). Tapping a repaired word shows "Filled from your poem. Your score's print read “бапа”." Revert puts the Lyrics back as they were and the join does not run again for that poem; a different poem is a new occasion.

## 3. Departures and what is not built

1. **Provenance `by` (amendment 11) is derived, not stored.** The review asked for a stored `by: 'print' | 'poem' | 'hand'` on each pairing and Lyrics word, filled by `validateRecord`. I did not change the stored record. `byFromScan` derives it each time: a LYRICS word the score's own text has is the print's; a word this join wrote (while its marks stand) is the poem's; any other is the singer's hand. The reason: the stored form is a schema change to pairings (`pairings.ts` is at 1420 of 1422) and to the record, with a migration, that a pure derivation avoids for the one decision it serves (what the join may repair). The cost: a word the singer retypes to equal the score's reads as the print's; a hand word after the score is replaced reads as hand only while its text differs. The test of the rule over all of it (a hand word is never repaired, and only offered where provably wrong) holds on the derivation.
2. **The marks, receipt, and Revert are session memory, not stored**, as `poemOffer`'s Revert is. They stand only while the Lyrics still have the words the join left (compared by folded words, so a change of line breaks does not end them); the first edit to those words ends them. After a reload they are gone; the repaired words stay, because the Lyrics text is the stored song's. A Reverted song, reloaded, would be joined again by the next Poem edit.
3. **A Lyrics edit does not start the join.** The brief says "again whenever POEM or LYRICS changes". Only a Poem arrival or edit does. Lyrics edits go through `handleInput`, which a keystroke reaches; hooking it needs a line in `+page.svelte` or a change to a shared function. NOT BUILT.
4. **No per-word Revert and no list.** The receipt has one Revert (the whole join). Stage 3 item 8 names "Revert and a list"; the list is not built (the tap note on each repaired word is the nearest thing). The tap note exists for repairs only: the strings file has no sentence for a filled word, which has no print to quote, so a filled word has the underline and no note.
5. **The dotted underline needs the CSS Custom Highlight API.** Where a browser lacks it (`IntakeViews` already draws the sage and grey with inline spans there), the written words are not underlined; the receipt and Revert still show. NOT ESTABLISHED which browsers lack it.
6. **Phrase-end jumps** are not built (step 4's report).

## 4. Tests

| Test | What it pins |
|---|---|
| `poem-join-wire.test.ts` (14) | the token map across lines and its refusal where the words do not line up or a punctuation token intervenes; a run between two words; the song's start and end; a melisma note (an extender) is no run; a tie and a rest; a decided-empty note; a syllable the map cannot place; two counts under a slur; an unread bar; `byFromScan`; `tokensIn` |
| `poem-join.svelte.test.ts` (10) | a repair as one Lyrics edit and the poem unchanged; the mark, the receipt count, and the print's word; marks through a line-break change and ended by an edit; Revert and no second join; no loop; no run without a scan, a poem, the dictionary, or a writable song; a stale transcription does nothing and says so; the pause; the console line |

## 5. Gates (this sandbox, Linux)

| Gate | Result |
|---|---|
| web unit | The first full run: **4318 passed, 1 skipped, 2 failed** (238 + 4 files). The two were `i18n-index.test.ts`: the hand-written key index at the head of `i18n.ts` had no line for the new `lyrics.` prefix and the total was 3 short. I added the line and the total (1,142 keys) and re-ran that file (5 passed). **I did not re-run the whole suite after the fix**; step 6's run covers it. After step 4: 4297 passed; +21 tests |
| web-check (`svelte-check`) | 0 errors, 12 warnings (equal to baseline) |
| ratchets | OK. `+page.svelte` 5586, `pipeline.ts` 925, `pairings.ts` 1420 |
| others | not run: nothing outside `apps/web` changed |

## 6. Not established

Every browser behaviour (the underline, the receipt, the tap note, Revert); the join on a real song (the console line is the first measure); the event-to-song bar equality; whether the transcription of Lyrics (`lines`) has always caught up by 600 ms after a Poem edit (where it has not, the join does nothing and says so, and a later Poem edit retries).
