# Report: Code, N.194 r5, step 4 (the button), 2026-10-26

Lane `cloud-lane-15`, after step 3. Read and run in the Linux cloud sandbox at `Shane` `54c01bc3` plus this lane. Nothing under `docs/memory/` was edited, the brief and its companions were not edited, and no approval was re-approved: the IPA corpus approval and `staff-renderer-real-fixture.approval.test.ts` pass unchanged inside gates 4 and 5, and gate 5's count did not move.

## Correction to my own earlier commits (read this first)

My editor tools turned every `\u00A0` I typed into a literal no-break space in the files they wrote, which the brief forbids ("never as a literal character", section 0). I found it in step 4 and repaired it in this commit, in every file I authored: `text/break-glue.ts`, `text/break-text.ts` and its test, `text/break-at-unit-end.test.ts`, `text/syntactic-break-adapters.ts` and its test (also `\u2010` and `\u2011`, which had become literal hyphens), `syntactic-break.ts`, and the step 2 and step 3 reports. **The step 2 and step 3 commits on the lane (`dd16e48`, `d9e0ec1`, and their reports) still carry the literals in history**; I did not rewrite pushed history, and the tip of the lane is clean. I checked by byte: no file I changed holds a literal U+00A0, U+2010, or U+2011 that the file did not already hold at `54c01bc3`. The step 3 report also gave `break-text.ts` as 104 lines; it is 88.

## What I changed

**The button.**
- `apps/web/src/lib/text/break-here.ts` (new, 134 lines): `breakState`, `planBreak`, `breakControl`, `noteOfOrigin`, with the page's state and hooks as arguments.
- `apps/web/src/lib/score/placement-scope.ts`: `PlacementControls.break: BreakControl` (`onbreak`, `state` as `'insert' | 'remove' | 'off'`, `implied`).
- `apps/web/src/lib/score/LoupePlacementRow.svelte` (95 to 117 lines, no ceiling): a third pill, disabled when `state === 'off'`, labelled `loupe.place.breakRemove` on `'remove'` and `loupe.place.breakAfter` otherwise; and, only when the pill is off and `implied`, one `<span class="loupe-place-reason">`. It sits inside `.loupe-place-row`, which the print stylesheet hides (`@media print`), so the line is not on the page.
- `apps/web/src/routes/+page.svelte` (5581 to 5586): the import (`:198`), the `break:` entry in `placementControls` (`:1202`, five lines), and the third argument to `createUndoHistory` (`:850`). **Ceiling lowered 5597 to 5586** (`scripts/ratchets.json`), never raised. `pipeline.ts` is untouched in this step (925 of 925). `Loupe.svelte` is untouched (3012 of 3013).

**The state, from the engine's verdict on the unit's last word** (`break-here.ts`, `resolve`): off with no reason when no note is selected, the pairing is a melisma, an empty mark, or absent, the note is not a syllable target (a tie's continuation), `lines` is empty, or the pairing's origin is not in the slot queue. Then `breakTarget` resolves the unit and its last syllable. `'remove'` when that last word is `boundarySource === 'user'`. `'off'` with `implied` when it is `hard` from anything else (punctuation, a line's end, a rest). `'insert'` otherwise, so the pill is on before a spaced dash.

**The press** (`breakControl`): push the undo entry with `{ inputText: true }` BEFORE the write, then `handleInput(text, 'paste')`, then move the selection to the note carrying the terminal slot's origin, read from `doc.pairings` AFTER the write. If that syllable is not placed on a note, the selection stays and the `#` is still written.

**The undo** (`undo-history.svelte.ts`, `undo-wiring.svelte.ts`): `UndoState.inputText?`; `push(note, { inputText: true })` snapshots it; `undo` and `redo` snapshot it on the opposite stack only when the entry being taken carries it; the page's write calls `handleInput(entry.inputText, 'paste')` AFTER restoring `pairings` and `seatedText`. The nineteen existing push sites are untouched and none carries text.

**The strings** (`i18n.ts`, all ratified, added and not owed; pinned character for character in `insights/ratified-lines.test.ts`, with the expected values copied from the brief):
- `loupe.place.breakAfter`: "Break after this word" / « Frontière après ce mot »
- `loupe.place.breakRemove`: "Remove break" / « Retirer la frontière »
- `loupe.place.breakImplied`: "A break is already implied here." / « Une frontière est déjà implicite ici. » (the 2026-10-26 addendum)
- `loupe.undo.breakPlaced`: "break placed" / « frontière placée »
- `loupe.undo.breakRemoved`: "break removed" / « frontière retirée »

No key collided with another. The Guide's label pin can read these names.

## Section 5a, site by site

| site | verdict |
|---|---|
| 1 `pipeline.ts` tokenizer | steps 2 and 3: one tokenizer, `matchAll(WORD_TOKEN)` |
| 2 step 3 offsets | step 3 |
| 3 the `#` strip | step 2 |
| 4 `same-words.ts` | CHANGED: `.replace(GLUED_MARK, '')` then `.split(WORD_SPLIT)`. The glued form folds as the bare one. The brief says every test fails on a plain `\s`; for `sameWords('я\u00A0# на', 'я# на')` that is **not so**: the old code also gets it right, because `\u00A0` is whitespace. A case that does distinguish is `я\u00A0#на` against `я#на` (a plain split makes two words and the bare form one); the test pins it and fails on the old code |
| 5 `poem-compare.ts` | CHANGED: `tokenize` takes `WORD_TOKEN` plus its `\n` alternative. `layOutLikePoem` keeps «я\u00A0#» glued (a plain `\S+` turns it into «я #», and the test fails there). The comparison colours nothing for the glued form (that half passes on the old code too: a lone `#` folds to nothing) |
| 6 `library/songs.ts` | CHANGED to `GLUED_MARK` for consistency; **the old code was already right for the glued form** (the `#` was stripped and `\u00A0` is whitespace to the split), so no test fails on the old tree. A regression guard |
| 7 `vowel-resolver.ts` | no change. `collectScoreWords` on the fold's output gives one word whose cells join to «я\u00A0#» (tested) |
| 8 `diction-marks.ts:197` | CHANGED: the fold writes `${last.text}\u00A0${mark}` |
| 9 `clitic-seat.ts` `carryPunctuation` | CHANGED: the carried mark drops the `#` and the `\u00A0` before it. `carryPunctuation('я', 'я\u00A0#')` is «я», `('я', 'я,\u00A0#')` is «я,», and the bare «я#» is now «я» (it was «я#», a `#` in the Russian). Fails without the change |
| 10 staff fallback to `syllable.text` | **MEASURED, NOT FIXED.** Rendering the folded Sunless no. 4 shape with no pairings draws `<text>я\u00A0#</text>`, so a note with no seat shows the fold's mark in the Cyrillic row, as batch C found (its finding 4). Not caused by this step, not covered by any test, and it contradicts Dann's 2026-10-21 00:26 ruling. Dann's call: it needs the staff's fallback text or the fold to change |
| 11 `scoreContentId` | by grep, no reader outside `overlay-engine.ts` but a comment; `sourceScoreId` is a field of the analysis object only. NO stored record keys on it that I could find (`library/`, the storage schema, the drivers). Every score with a `#` now has a new id after this fold |
| 12 `pairings.ts` slot fusion | no change; no slot's Cyrillic holds a `#` on the glued form (tested) |
| 13 not affected | re-read, as listed |

**Site 8 touches more than the brief says.** (a) Four tests pin the old form in `packages/score-parser/src/diction-marks.test.ts` (`:83`, `:140-141`, `:163`, `:177`), not one; plus three expectations in `apps/web/src/lib/analysis/diction-fold-live.test.ts` (`:76`, `:111`, `:113`). I changed each expected string to the escape form. Counts did not move. (b) **The fold runs on every verse, so a score's IPA verse also gains a no-break space: the engraver's «jɑ#» in verse 2 reads «jɑ\u00A0#» after the fold.** The fold cannot tell an IPA verse from a Cyrillic one. The staff-renderer approval did not move (it reads the engraver's verse 2 without the fold). Whether a visible space is wanted in a score's own IPA text is Dann's call.

## Tests added, and which failed before

Gate 4: 3182 to 3231, which is **+49**. Gate 5: 775 passed and 5 skipped (780), unchanged: the fold edit changes expected strings, not the count.

| file | count |
|---|---|
| `apps/web/src/lib/text/break-here.test.ts` (new) | **33** |
| `apps/web/src/lib/text/break-glue-sites.test.ts` (new) | **7** |
| `apps/web/src/lib/score/undo-history.test.ts` | **+5** (21 now) |
| `apps/web/src/lib/insights/ratified-lines.test.ts` | **+4** (30 now) |

Tests that changed an expected string and added none: `packages/score-parser/src/diction-marks.test.ts` (four), `apps/web/src/lib/analysis/diction-fold-live.test.ts` (three).

**Failing on the previous tree** (the previous `undo-history.svelte.ts` and `undo-wiring.svelte.ts` put back, the two undo files run): 5 failed, 49 passed: the saved text, the undo-redo round trip, the Remove entry, text typed after the press, and the Undo pill's byte-for-byte restore. One of my own tests, "undo then redo", passed there for a bad reason (it never checked the text between the two); I added the missing assertion.

**Mutants of the 5a sites** (each edit applied, the file run, restored and diffed identical): `same-words.ts` back to a plain strip and `\s` split fails 1 (the `я\u00A0#на` case); `poem-compare.ts` back to `\S+|\n` fails 1; `carryPunctuation` without the strip fails 1; `songs.ts` back to `/#/g` fails 0, as said above.

**The done-whens.**
1. Song 1, the note under «нат» of «Комнатка»: the pill reads "Break after this word"; a press writes `\u00A0#` after «Комнатка» and nothing else (the text is two characters longer); the IPA of «ка» ends in a bare `#` with no space; the selection is on the note under «ка». The fixture is `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`, the sung verse as one line of 39 words.
2. A press on the note under «ка» alone, and on the one under «Ком», writes the same text and lands on the same note.
3. The pill then reads "Remove break"; a press restores the text byte for byte; the Undo pill reads "break placed" (« frontière placée ») and pressed restores the text byte for byte with `lines` and `doc.pairings` equal to the pre-press ones and the selection back where it was; redo returns the marked text and its IPA; a different verb's Undo after typing leaves the typing; a song switch empties the stacks.
4. Off, one test each: no note selected; `lines` empty; a melisma; an empty mark; no pairing; a tie's continuation; the unit ending in a comma («тень непроглядная,», Dann's 01:38 example, from the note under «ляд»; and song 1's own «не проглядная,»); the last word of a line; a unit ending before a rest. The reason shows for the last three kinds (the comma, the line's end, the rest) and for no other; the rest case is built with `phraseEnds` by hand, because the page derives it from the score's rests and I did not build a fixture for that derivation (NOT RUN).
5. «велит-ли»: the mark lands after the whole token, and the selection jumps to the particle's note.
6. After a press, no slot's Cyrillic and no word field holds a `#`, the IPA holds exactly one, bare; `drawPairings` draws none in the Cyrillic; B3's surface tests pass unchanged. The glued Lyrics reads the same as the bare form.
7. **Song 1's two score marks are NOT in the sung verse.** They are in verse 2, the engraver's IPA verse (`diction-fold-live.test.ts:7-8`, `:66-77`), and Lyrics holds verse 1, so on song 1 the pill never reads "Remove break" for them. I ran the case on the Sunless no. 4 shape, whose mark is in the sung verse: Lyrics holds «я\u00A0# на правду», the pill reads "Remove break" on «я», a press removes the `#` with its `\u00A0`, and `sameWords(doc.inputText, scoreText)` stays true before and after.
8. A spaced dash («слово – слово», the ASCII-hyphen and em-dash forms too): the pill is on, and a press writes the mark.
9. All eight gates, below.

**The sameWords proof.** On song 1, `sameWords(doc.inputText, scoreText)` is true after a press, and after the Remove. It depends on the fold in `same-words.ts`: with that fold put back to a plain strip the glued-form case fails (above). Song 1's `doc.pairings` keys and origins after the press equal those of a fresh seat of the new lines, and `refreshPairings` changes only the `ipa` of the «ка» pairing.

## What the real browser showed

Run in this sandbox on the dev server, in Chromium, on `sunless-01-engraved.musicxml`, scratch scripts kept in the session's scratchpad and not committed. Lyrics fills from the score, I opened the Loupe on the second note of the first bar and chose its Syllables tab.

- The Loupe's row reads "Clear placements", "Place from here", "Break after this word". After the press the Lyrics field reads «Комнатка<NBSP># тесная, …» and differs from the original by those two characters and nothing else; the pill reads "Remove break"; the IPA under the third note reads «kʌ#» (a bare `#`); the Cyrillic reads «Ком-нат-ка» with no `#`; the selection is on the note under «ка».
- The Undo pill's accessible name is "Undo: break placed".
- **Control+Z with the Lyrics field focused did nothing.** The field kept the marked text. The desk's understanding holds: the browser did not walk back a value a script set. No test pins this.
- The Undo pill restored the original text byte for byte. The Redo pill brought the marked text back. Pressing the break pill again removed the mark.
- Off pills: of the first forty notes of the piece, the pill was off on 28, and the reason line "A break is already implied here." showed on 22 of those; on the other 6 it was off with no line (a melisma or an empty note). In French the labels read « Frontière après ce mot » and « Une frontière est déjà implicite ici. » (I read the French reason line on a note whose pill was off). The reason sits to the right of the greyed pill, in the row's own type.

## Where would this wall a singer in?

- **Most of the notes of a real song have a greyed pill.** Sunless no. 1 ends nearly every word with a comma or semicolon, so on 22 of the first 40 notes the singer sees a greyed button and a line. The line does say why, and Dann ruled it that way. But the only words on which the button works here are the few without punctuation, and the singer has no way to ask for a break where the poem already has one.
- **The `#` lands on a word they did not mean.** A coach marks «не в силах»: the press from «не» puts the `#` after «силах», the unit's end. The selection jumps there too, with no sentence saying "the unit ended later". That is Dann's ruling (the unit is the word with what leans on it); it is still a place the squircle moves away from where they pressed.
- **After a press the text and the Lyrics field disagree about a space.** The field shows the `\u00A0` as an ordinary space, so a singer who deletes it by hand and keeps the `#` leaves «Комнатка# тесная,», which still works (the `#` is read where it stands), but their next Remove has to find a `#` typed without the glue, which it does.
- **Undo after typing.** The Undo pill takes the break back and the text typed after it with it; Redo brings both back; a new action after an Undo loses that Redo for good. I tested it and did not hide it, as the brief asks.
- **Control+Z in the field does nothing after the press.** The singer who expects it to work has the Undo pill and nothing tells them which.
- **A score's own `#`** reads as placed and offers Remove break. Nothing on the Loupe says the mark came from the score and not from them. (Song 1's marks are in the IPA verse, so it does not arise there.)
- **A `#` the singer typed inside a word** takes effect at that word's unit end, and the Loupe offers Remove break at that end, not at the word where they typed it.

## The eight gates

Baselines are the task's, measured on `Shane` at `54c01bc3`; my own run before step 0 matched all eight. I could not read the ship script.

| gate | command | baseline | after step 4 |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 291 passed (291) | 291 passed (291) |
| 2 | `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) |
| 3 | `pnpm --filter @ilya/web check` | found 0 errors and 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 3057 passed (3057) | **3231 passed (3231)**: +19, +37, +32, +49 across steps 1 to 4 (steps 1 to 3 gave 3182) |
| 5 | `pnpm --filter @ilya/score-parser test` | 775 passed \| 5 skipped (780) | 775 passed \| 5 skipped (780) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | ratchets: OK. | ratchets: OK. |

Ceilings at the end of the lane: `+page.svelte` 5586 of 5586 (lowered from 5597), `pipeline.ts` 925 of 925, `Loupe.svelte` 3012 of 3013. Gate 8 still prints "these ceilings can be lowered" for `LearnContent.svelte`, `InsightsPane.svelte`, and `Loupe.svelte`, none mine.

## What I could not establish

- The page's own `transcribeText` re-seat after a press or an undo: NOT RUN in a test, because the page cannot be mounted under vitest. The harness re-runs the pipeline and advances the seated text, and the keys and origins are compared with a fresh seat. What I observed in the browser is the press, the Undo pill, Redo, and Remove on one song; it is not a proof for a song with placements made by hand across a text edit.
- Whether `lines` can be non-empty while the dictionary reports loading (the `'wait'` verdict): NOT ESTABLISHED. The pill is off when `lines` is empty, which covers a first load.
- The unit-ends-before-a-rest case from a real score's rests (`phraseEnds`): built by hand only.
- A phone-width run of the pill row (`@media (pointer: coarse)`): NOT RUN.
- `seatCliticFolds` and `clitic-seat.ts` beyond `carryPunctuation`: NOT READ.
- The ship script's gate lines: NOT READ (unreachable).
- Whether the fold's NBSP in an IPA verse bothers anyone (above).

## Strings owed to Dann

None. All five strings this step adds are ratified (Dann 2026-10-21 13:42 and 20:30, and the reason line 2026-10-26 14:56 and 14:57), seated verbatim, and pinned.

## Owed to Dann (rulings and findings)

1. **The staff's Cyrillic still prints a score's folded `#` where a note has no seat** (site 10). It contradicts his 00:26 ruling.
2. **The fold now writes a no-break space into a score's IPA verse too** (site 8b).
3. **«слово- слово» reads as a joiner** (step 1, with the spans test in step 3 showing the fix).
4. **Done-when 6 of step 2** (the inside `#`), which contradicts its own bullet.
5. Whether a button that is off on most words of a punctuated song is what he wants (the reason line is ruled; the count is the observation).
