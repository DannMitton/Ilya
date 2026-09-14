# Memo from Code: N.134, a score's words fill the poem box and seat themselves

**Answers** `brief-n134-underlay-fills-and-seats_r2_2026-09-14.md`. r1 was not
read or used.

**Tree.** Branch `Shane`. Work began on `f74a436`. During the session, HEAD
moved to `7646da4` (Dann, "Memory: the text problem measured, N.134 ruled and
briefed"). That commit touches six files under `docs/` and none of the files in
this memo. Nothing is staged and nothing is committed. No git command that
writes was run.

**Increment 1 only**, the brief's desk default: the box is empty when the score
arrives.

---

## 1. Gates

All five were run in this session, before and after the change.

| gate | before | after |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216) |
| dictionary | 235 passed (235) | 235 passed (235) |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |
| web-test | 1123 passed (1123) | **1131 passed (1131)** |
| score-parser | 547 passed, 5 skipped (552) | 547 passed, 5 skipped (552) |

**Web-test moves 1123 to 1131, and every test passes.** The eight new tests are
in `score-seat.test.ts`. `~/Downloads/ilya-ship.sh:79` still reads
`gate 4 web-test "1123 passed (1123)"`, so the script refuses this ship until
that line moves to 1131. Move it before running the ship, and follow the `sed`
with `chmod +x ~/Downloads/ilya-ship.sh`.

## 2. What changed

| file | change |
|---|---|
| `apps/web/src/lib/shane/score-seat.ts` | **new.** `seatScoreWords(parsed, map, lines)` seats the filled poem's slots on the notes the file's own underlay names. |
| `apps/web/src/lib/shane/score-seat.test.ts` | **new.** Eight tests on the engraved Sunless no. 1 fixture. |
| `apps/web/src/lib/shane/vowel-resolver.ts` | `scoreWordsText(words)` at `:299`, the one join of `raw` with a single space. The resolver's own pipeline call now uses it. |
| `apps/web/src/lib/shane/clitic-seat.ts` | `align` (`:182`) and `carryPunctuation` (`:351`) are exported for their second reader. `readScoreText` uses `scoreWordsText`. No behaviour changed. |
| `apps/web/src/routes/+page.svelte` | The fill, the seat, the waiting seat, the tag, and one reordering inside `applyArrival`. See §3. |
| `apps/web/src/lib/components/Drawer/IntakePanel.svelte` | The `poemFromScore` prop and a `from score` span on the poem receipt (`:497`), styled with `.band-state-tag`'s values (`:822`). |

No string was coined. The tag reads `meta.fromScore` (`i18n.ts:758`).

### 2.1 The seat, exactly

For each score word, `align`'s row gives the poem queue's slots for that word.
The k-th slot goes on the k-th vowel-bearing cell of that word, which is the
note the file engraved that vowel under. A note is written only when both of
these hold:

- The note is undecided.
- No note already carries that slot.

A word whose two counts disagree is withheld whole. A walk that loses sync, or
a poem of more than one line, seats nothing at all.

Two consequences to know about:

- **Melisma continuation notes and notes carrying a vowelless syllable such as
  «сь» receive nothing.** They stay undecided, which is what `firstPass` and the
  clitic seat already leave on such notes. The fixture has none of either: all
  96 notes carry a cell.
- **The syllable division on a seated note is Ilya's, not the engraver's.** The
  file prints `про`/`гляд`, and the seat carries `прог`/`ляд`. Every seat in
  the tree already carries the queue's text, and the clitic fold already writes
  Ilya's division on the tail.

**DESK DEFAULT: the seat carries the file cell's trailing punctuation** through
`carryPunctuation`, under Dann's ruling of 2026-09-04 for a re-seated cell. See
§6.1 for why it does not reach the page.

### 2.2 What I did with `mergeOnUpload`

**I left its shape alone.** It still decides one thing: whether the map is
fresh. Its `scoreCarriesNoLyrics` branch is still the only caller of
`firstPass`. The score's own seat is not folded into it for two reasons. The
seat needs the parsed score's cells. The clitic seat also has to run between the
merge and the seat (§4, question 1). The seat runs only where the merge returned
an empty map and proposed nothing, which is the gate `firstPass` already sits
behind.

## 3. The order inside `applyArrival`, as built

1. Clear placements if the whole song is being replaced. Attach the source and
   set `ingestedScore`. Both are unchanged.
2. **`commitMetadataState`, moved up from the end of the function** (`:3085`).
   Nothing in it changed. §4, question 4, gives the reason.
3. **The fill** (`:3107-3111`). If the origin is `upload`, the file carries
   lyrics, and `doc.inputText.trim()` is empty, then
   `handleInput(scoreWordsText(...))` runs.
4. `mergeOnUpload`, unchanged (`:3121`).
5. `seatCliticFolds`, unchanged (`:3140`).
6. **The seat** (`:3167`). If the fill ran and the merge map is empty, the seat
   runs. It runs at once when `lines` holds this poem. Otherwise it waits in
   `scoreSeatWaiting` (`:3025`), and `transcribeText` spends it (`:2304`) once
   the dictionary lands. It is spent only if the same score is still attached
   and the box still holds that score's words verbatim.

**DESK DEFAULT: the fill runs on an upload only, never on a restore.** A song
saved before this shipped, with an empty box and placements, would otherwise
have its poem written at boot without anyone acting. Dann's own `Without Sun,
no. 1` is that song. Dropping the file onto that song again fills it, because
dropping the file is the singer's act. On that song the map is not empty, so
nothing is seated.

## 4. The five questions

Each question gives the expectation I stated before changing anything, then what
I found.

### Question 1. Ordering against the merge

**Expected.** Fill before the merge, so `lines` is filled when
`buildSlotQueue(lines)` is read. Seat after the merge and after
`seatCliticFolds`.

**Found: the fill goes before the merge, and the seat goes after the clitic
seat. The order was measured, not reasoned.** On the fixture, from a fresh map:

| order | slots placed | a slot on two notes | last note (`m17-1-2`) |
|---|---|---|---|
| clitic seat, then score seat (built) | 95 / 95 | none | undecided, draws nothing |
| score seat, then clitic seat | 95 / 95 | **one** | carries `ка`, so the page reads `ка ка` |

The second order reproduces the `ка ка` close Dann walked on 2026-09-04. The
clitic fold moves the tail back one note and leaves the last note undecided.
Seating first leaves the last syllable on that note, and the fold does not
delete it. `score-seat.test.ts` pins the built order.

**The dictionary case.** The fill transcribes in the same tick only when the
dictionary is ready, because a paste's verdict is `now`. While the dictionary is
still loading the verdict is `wait`, `lines` stays empty, and the seat waits
(§3, step 6). **The waiting path was not walked in the browser.** It is read
from code only, and it is listed in §5.

### Question 2. The two syllable counts, and the `в`

**Expected.** `в` owns no slot in the poem queue either. The difference is in
cells, not slots. `seatCliticFolds` rewrites the run into the ruled arrangement
without resolving a count difference, because no word's counts differ.

**Found, measured on the fixture:**

- **Score side:** 39 words, 96 cells, 95 slots, which confirms the brief's
  measurement.
- **Poem side:** `processText` over the filled text gives 1 line, 39 words, and
  a queue of 95 slots. That matches `readScoreText`'s queue.
- **Word by word, every one of the 39 words agrees.** `в` is 0 score slots
  against 0 queue slots, because `buildSlotQueue` gives a vowelless word no
  slot. `бьющемся` is 3 against 3, and its first queue slot is `в` + NBSP +
  `бью`. **No word is withheld on this fixture.**
- **So the poem's queue does NOT carry `в` where the score's slots do not.**
  Both sides give it no slot. The cell side carries it, 96 cells against 95
  slots, and that is the gap the drawer's `95` came from.
- **`seatCliticFolds` does not resolve a count difference, because there is
  none.** It resolves a placement difference. Copied from the file, the seat
  puts `в бью` on the `бью` note (`m7-1-4`, which carries `щем` once the fold
  has run) and leaves
  the `в` note undecided. The fold then finds `m7-0-1` unseated and applies
  Dann's 2026-09-04 arrangement: `в бью` goes on the `в` note, and the tail
  closes up by one. Built in the §4 question 1 order, the fold runs first. The
  seat then skips all 59 of the fold's slots and fills the 36 before `в`.

The withheld-word rule is built and tested with a manufactured disagreement
(`score-seat.test.ts`, "withholds a word whose two counts disagree"). It is not
exercised by this fixture.

### Question 3. Whether `reseat.ts` fires on the fill

**Expected.** It does not. The previous grid is empty, so the diff is
`emptyDiff()`, whose `unchanged` is `true`, and `reseatAcross` returns at once.

**Found: on a new song, `reseat.ts` seats nothing, so there is nothing for the
explicit seat to duplicate or conflict with.** `transcribeText` passes
`emptyDiff()` when `transcribedGrid` is empty (`text-diff.ts:52-54`), and
`reseatAcross` returns on `diff.unchanged`. `transcribedGrid` is emptied only by
`resetSessionState`, which runs on boot, Clear, and song switch. Browser
evidence: after the fill, the stored map held exactly 95 entries, all placed
once.

**One path where it can fire, read from code and not walked:** a singer
empties an existing song's box by deleting the text instead of pressing Clear,
then drops a score. `transcribedGrid` still holds the old poem, so the diff is
real and `reseatByDiff` runs over whatever placements that song still carries.
In that case the merge map is not empty, so the N.134 seat does not run, and
there is still no duplication from this change.

**After the fill, the seats belong to the poem.** Their origins are the poem's
own `(0, wordIndex, slotIndex, word)`, so `reseatByDiff`'s `ownedByPoem` accepts
them. A later edit moves them by Dann's 2026-09-07 rules. That was not walked.

### Question 4. `nameIfUnnamed`

**Expected.** At the old position of the metadata commit, the fill would name
the song after the poem's first four words, even though the file carries a
title and a composer.

**Found: the fill does rename an unnamed song, against the whole record through
`proposeName` (`songs.ts:36-43`).** Composer and title rank first. The poem's
first four words are used only when both are empty. `handleInput` calls
`nameIfUnnamed` before `commitMetadataState` had filled the header, and the
first name set sticks (`doc.name !== ''`). **So the metadata commit now runs
before the fill** (§3, step 2). Observed in the browser: the new song was named
`Modest Mussorgsky (1839–1881), Without Sun, no. 1: Within Four Walls`. A file
with no header still names the song after the poem's first four words, which is
what a pasted poem does today.

### Question 5. Whether the tag survives a reload

**Expected.** Nothing stores poem provenance today, so the answer depends on
the storage choice.

**Found: it survives, because it is DERIVED, not stored. DESK DEFAULT.**
`poemFromScore` (`+page.svelte:396`) is true exactly while the box holds
`scoreWordsText` of the attached score, verbatim. Both the poem and the score
come back on a reload, so the comparison is made again. No field was added to
`SongRecord`. A stored flag would be a derived value written into the record,
which CONTRACT §6 rules out.

Observed in the browser:

| step | tag |
|---|---|
| after the fill | `from score` |
| after a reload | `from score`, counter still `95 / 95 placed` |
| after an edit adding one space | gone |
| after restoring the exact text | back |

**Where this differs from the Piece fields' stored pattern.** Both are costs of
deriving it:

- An edit that restores the exact text brings the tag back. A Piece field's tag
  stays gone.
- Clearing the score removes the tag while the words stay.

If Dann wants the stored pattern instead, it needs a new `SongRecord` field
threaded through `library.ts`, `document.svelte.ts`, and validation.

## 5. Verification against the brief's expectations

This was a new, empty song in the browser pane. The pane's library was empty
before the run, so Dann's `Without Sun, no. 1` was not in reach. The file was
`~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`,
identical by `cmp` to the repository fixture. It was staged in the gitignored
`apps/web/static/reader/` and deleted afterwards. The dev server was stopped.

| brief's expectation | my stated expectation | observed |
|---|---|---|
| box fills with 39 words, beginning `Комнатка тесная, тихая, милая;` | same | **39 words, beginning `Комнатка тесная, тихая, милая;`, ending `ночь одинока`** |
| poem receipt reads `poem` and carries `from score` | same | **`POEM · 1 lines · 39 words · from score`** |
| Transcription draws | same | **draws, with IPA and glosses** |
| counter moves off 0; most or all seated, a shortfall of one or two expected | **95 / 95**, because the poem also lacks the final `я`, so the queue has no slot for it | **`95 / 95 placed`** |

**Why there is no shortfall.** The poem is the engraving's own text, so it
carries the same missing `я`. The queue has 95 slots and all 95 are placed. The
missing `я` shows on the page instead: the last note, `m17-1-2`, draws nothing.
That is the note `seatCliticFolds` blanks.

**The negative control, also observed.** On a second new song, typing
`Я помню чудное мгновенье` and then dropping the same file kept the typed poem.
The receipt showed no tag, and N.134 seated nothing (`0 / 9 placed`).

**The Score markup page, observed.** It draws 95 Cyrillic cells. `в бью` sits
on `m7-0-1`, and the 96th note is blank.

## 6. What I could not establish, and what I found in passing

### 6.1 The file's punctuation no longer draws on the first 36 notes

**This is visible and it is caused by N.134 reaching those notes.** The stored
seats carry the file's punctuation (`я,`, `я;`). The page draws none: all 95
Cyrillic cells in the SVG were read, and none carries `,`, `;`, or `.`. The cause
is `refreshPairings` (`pairings.ts:364`). It replaces a seat's text whenever the
text differs from the queue slot's, and the queue's text carries no punctuation.

Before N.134, the 36 notes ahead of `в` carried no seat, so they drew the file's
own cell, commas included. **That "before" is read from code
(`staff-renderer.ts` falls back to `ev.syllable?.text`), not observed in this
session.** The clitic fold's tail was already losing its carried punctuation the
same way before this change. This belongs with N.118, "punctuation travels",
which is unbuilt, so I did not touch `refreshPairings`.

### 6.2 NOT ESTABLISHED

- **The waiting seat** (dictionary still loading when the score arrives) was
  not walked. Read from code only. On that path the clitic fold's seats carry
  the IPA of a pipeline run made before the dictionary landed, which is the
  arrival behaviour that stood before N.134.
- **A lyric-bearing score with melisma continuation notes.** The fixture has
  none, so how the page draws a file's melisma after the seat was not observed.
  Read from code, a continuation note inside a seated run is undecided, and
  `vacatedNotes` blanks it.
- **A score where some words' counts disagree**, on a real file. It is covered
  only by the manufactured test.
- **Whether a reseat after a later edit keeps these seats in order.** Question
  3's reading says it does. It was not walked.

### 6.3 Found in passing, not changed

- **The clitic fold runs on every arrival, whatever the poem.** On the negative
  control it wrote 59 score-origin seats into a song whose poem is
  `Я помню чудное мгновенье`, and the counter read `0 / 9`. It has run that way
  since 2026-09-04, and it sits in the increment 2 case this brief excludes.
- **A second score does not clear a poem the first score filled**, unlike the
  Piece fields, which `clearScoreFilled` empties. Not built. A replacement
  score's words into a box the previous score filled is increment 2's
  territory.
- **`i18n.ts:164`, `input.watermark`**, still reads `poem` in French. The
  French word is Dann's to rule, so it was not free. It stays with N.131.
