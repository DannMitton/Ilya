# Brief to Code: N.134, a score's words fill the poem box and seat themselves

**Supersedes** `brief-n134-underlay-fills-the-poem-box_r1_2026-09-14.md`, which
was written before Dann ruled the seating question. Do not build from r1.

**Serves:** N.134. Closes the unbuilt half of N.121.

**Authority, two rulings.**

1. **2026-09-10**, in `docs/memory/PRODUCT.md`: a score arriving with words into
   an EMPTY poem box fills that box and tags the poem receipt `from score`. No
   question. No narration. **A singer's own words are never overwritten.**
2. **2026-09-14**, new, same file: a score that arrives carrying words **seats
   them on its own notes**, copying the mapping the file already states rather
   than counting from the top. This overturns the desk inference at
   `+page.svelte:3004-3008`, which labelled itself an inference rather than
   Dann's ruling. His words: *"this saves the user the manual labour while they
   retain control of small inevitable fixes."*

**Scope, increment 1 only. DESK DEFAULT, Dann can widen it with a word.** Build
the case where the poem box is EMPTY when the score arrives. In that case the
poem and the score's words are identical by construction, so the mapping is
direct. The case where the singer already has their own different poem needs
alignment between two different texts, which is increment 2 and is not this
commit.

---

## What is already built. Do not rebuild any of it

| what | where | what it gives you |
|---|---|---|
| the rejoining | `vowel-resolver.ts:198-235`, `collectScoreWords(parsed, 1)` | `ScoreWord[]`. `raw` (`:210`) is one word's syllables joined, so `Ком` `нат` `ка` returns `Комнатка`. **`slots` is the seating**: per vowel nucleus, the event ids it occupies. |
| the text seam | `+page.svelte:2686-2690`, `handleInput(text, how)` | writes `doc.inputText`, calls `nameIfUnnamed`, runs the pipeline. Already the caller for PDF-extracted text (`ScoreUploader.svelte:276`) and photographed OCR (`:316`), both through `onpoem`, wired at `+page.svelte:4221`. Its own comment says the `paste` default exists because those callers "arrive whole, the way a paste does." A score's underlay arrives whole in the same way. |
| the clitic seat | `+page.svelte:3033`, `seatCliticFolds`, ruled by Dann 2026-09-04 | already runs after the merge in `applyArrival`, seats a vowelless clitic with its host, no proposal and no button |
| the string | `i18n.ts:758`, `meta.fromScore`, en `from score`, fr « de la partition » | **nothing is coined** |
| the tag slot | `IntakePanel.svelte:483-484`, the poem receipt's `<span class="tag">` | where the tag goes |
| the provenance pattern | `metadata-provenance.ts`, and its keep-or-drop pass at `:133-140` | how the Piece fields already do exactly this |

## The change

In `applyArrival` (`+page.svelte:2989`), when the arriving score **carries
lyrics** and `doc.inputText.trim()` is empty:

1. **Fill the box.** Build the text from `collectScoreWords(ingested.result.score, 1)`
   by joining each `raw` with a single space, and pass it through `handleInput`.
   Punctuation already travels inside the syllable text, verified 2026-09-14 in
   the fixture below. **Add no punctuation and insert no line breaks.** Line
   shape is a separate item.
2. **Seat from the score's own mapping**, not from `firstPass`. For each
   `ScoreWord`, each nucleus in `slots` names the event ids that syllable
   occupies. Write those as pairings against the poem queue's matching slot.
3. **Tag the poem receipt** with `meta.fromScore`, following the Piece fields'
   provenance pattern rather than a new one. The tag clears when the singer
   edits the text, as a Piece field's tag does.
4. **Nothing happens when the box has any text in it.** No fill, no seat, no
   message.

`mergeOnUpload`'s `scoreCarriesNoLyrics` branch is no longer the only path to a
seated line. Say in your memo what you did with that function rather than
leaving its shape implicit.

## Establish these. Do not assume any of them

1. **Ordering against the merge.** `mergeOnUpload` is called at
   `+page.svelte:3014-3019` with `buildSlotQueue(lines)`, and `lines` is empty
   until the pipeline has run. State your reading of the correct order before
   you change anything, then report what you found.
2. **The two syllable counts differ by exactly one, and the cause is PROVEN.**
   Measured 2026-09-14 by running `CYRILLIC_VOWEL` (`vowel-resolver.ts:155`)
   verbatim over verse 1 of the fixture: **96 lyric entries, 95 of them
   vowel-bearing, and exactly one that is not.** That one is index 36, text
   `в`, marked `<syllabic>single</syllabic>`, between `я;` and `бью`. It is the
   `в` of `В бьющемся`. `collectScoreWords` opens a slot only on a vowel
   (`:217`), so the score yields 95 slots from 96 syllables, which is also why
   the drawer showed `95` on 2026-09-13.

   **What you must establish is the other side:** how Ilya's own transcription
   of the filled text counts that `в`. The Transcription page draws `В` as a
   separate proclitic word, so the poem's queue may carry it where the score's
   slots do not. `seatCliticFolds` (`+page.svelte:3033`, ruled by Dann
   2026-09-04) exists for exactly this shape and already runs after the merge.
   Say whether it resolves the difference. **Where a word's two counts disagree,
   leave that word unseated rather than guessing.**
3. **Whether `reseat.ts` fires on the fill and seats anything itself.** Its ruled
   behaviour is that an inserted word takes OPEN notes only (Dann 2026-09-07).
   Every note is open here. If the fill alone seats the line, say so, and say
   whether your explicit seating then duplicates or conflicts with it.
4. **`nameIfUnnamed`.** Say whether the fill renames the song and against what.
5. **Whether the tag survives a reload**, which asks whether provenance is
   stored or derived.

## Verification

**Fixture:** a NEW, empty song, then
`~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`
dropped into it. **Do not verify on `Modest Mussorgsky …, Without Sun, no. 1`
in Dann's library.** That song carries 71 of 95 placements, and it is the one
case where a mistake costs him an afternoon.

**State your expectation before each observation, then report against it.**

Expected, from a direct read of the fixture on 2026-09-14:

- the box fills with **39 words**, beginning `Комнатка тесная, тихая, милая;`
- the poem receipt reads `poem` and carries the tag `from score`
- Transcription draws
- the placement counter moves off `0` and reports **most or all of the line
  seated**. A shortfall of one or two is expected and is the file's own: the
  engraving's last word is `одинока`, missing its final `я`, matching the note
  recorded against N.111 on 2026-09-04.

**Three divergences are the file's and are not defects.** The engraving writes
`не проглядная` and `без ответная` where the poet writes them closed, giving 39
words against the poem's 38, and the missing final `я` above.

All five gates at baseline before and after.

## While you are there, one line, only if free

`i18n.ts:164`, `input.watermark`, reads `poem` in both languages, so a French
singer sees an English word. It belongs with N.131 and is named here only so it
is not lost.

## Return

One memo to `docs/sessions/memo-n134-underlay-fills-and-seats_r1_<date>.md`:
what you changed, what you established for each of the five questions, the gate
numbers, and a section listing what you could not establish.

**NOT ESTABLISHED beats a complete invented answer.**

House style: Canadian spelling, no em dashes, one idea per sentence, ISO dates,
no aphorisms, no pre-announcing.
