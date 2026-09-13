# Brief: N.121, a score with words fills the poem box

RULED BY DANN 2026-09-10, and **not built**: *a score arriving with words into
an EMPTY box fills the box and tags the poem receipt "from score", following the
Piece fields' own pattern. No question is asked. A singer's own words are never
overwritten. No difference reporting, ever. No narration on score arrival.*

Dann, 2026-09-12, on finding his Score markup full and his Transcription empty:
*"If there is text, it should be fed through the Transcribe pipeline, and we
might as well capture it as a formatting Transcription."*

Read `docs/memory/CONTRACT.md` in full before you start.

## 1. Why nothing happens today, established 2026-09-12

`doc.inputText` is assigned in exactly three places: the field's own input
(`+page.svelte:2679`), the clear (`:2403`), and the restore from a stored song
(`document.svelte.ts:269`). **No path anywhere fills the poem box from an
ingested score's lyrics.**

Storage is not the gap. `SongRecord.poem` exists (`library/types.ts:80`) and is
restored into `inputText` (`library/library.ts:65`). The poem was never written
in the first place.

The consequence Dann saw: Score markup draws a full page of syllables taken from
the score file's own underlay, while the poem box shows its placeholder and the
whole Transcription document is empty, because `lines` are built by transcribing
`doc.inputText` and there is no input.

## 2. What to build

When a score carrying lyrics arrives **and `doc.inputText` is empty**:

1. Rejoin the score's syllables into words.
2. Write the result to `doc.inputText` through the same path a paste takes, so
   the transcription runs live (N.112, the text is authoritative).
3. Tag the poem receipt **`from score`**, the way the Piece fields already are.
4. Say nothing. No dialog, no notice, no narration.

**If `doc.inputText` is not empty, do nothing at all.** That is the ruling and
it has no exceptions.

**Rejoining is available.** The file's own division is parsed and reachable as
`ev.syllable?.type` (`pairings.ts:713-715`): `begin` through `middle` to `end`
concatenates into one word, and `single` is a word on its own. Verified on the
fixture: `Ком[begin] нат[middle] ка[end]` is `Комнатка`.

## 3. THE LINE BREAKS. Read this before you write a heuristic

**The score does not know where the poem's lines are, and the desk proved it
rather than assuming it.** Measured on
`apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`,
2026-09-13:

- **Rests do not mark line ends.** A rest falls mid-line after « ду-ма » in
  measure 6, and two rests fall *inside* the word « серд-це » in measure 8.
- **Punctuation does not mark line ends.** The poem's first line is
  « Комнатка тесная, тихая, милая, », which carries two commas inside it.

**DESK DEFAULT, and Dann may wave it off: fill the box as ONE unbroken stream
of words.** It is the only honest reading of what the file contains. The box is
the singer's own and editable, so they can break it where they want. **Do not
invent a line-breaking rule. Do not break at rests. Do not break at
punctuation.**

## 4. Punctuation rides along, and it is N.118's problem, not yours

The file's lyric text carries punctuation: `я,` and `я;` are the stored strings.
Rejoined words therefore carry it, which is correct for a poem box. **Do not
strip it and do not add any.** How punctuation reaches a *placed syllable* on
the score is N.118 and is briefed separately; nothing here touches it.

## 5. What NOT to do

- Do not write to `doc.inputText` when it is not empty, for any reason.
- Do not report differences between the score's words and the singer's, ever.
- Do not show a dialog, a toast, or a sentence when this fires.
- Do not change `VocalLineEvent` or anything in `lib/shane/reconciliation/`.
- Do not touch the placement or pairing paths. This writes a poem; it does not
  place a syllable.

## 6. Definition of done

- On a fresh profile, drop Dann's `.musx` or the engraved `.musicxml` into an
  empty drawer. **The poem box fills with the song's words, the receipt reads
  `from score`, and the Transcription document draws.** State the expectation
  before you look.
- Type a poem first, then drop the same score. **The typed poem is untouched.**
- Reload. The poem persists, because it is now in `SongRecord.poem`.
- Five gates at baseline; if gate 4 moves, say the number and move
  `~/Downloads/ilya-ship.sh:79` before the ship.

## 7. The return memo

`docs/sessions/memo-n121-score-fills-the-poem_r1_<date>.md`. Files changed with
`path:line`. What the rejoined text looks like for Sunless 01, quoted in full so
Dann can read it. Whether any of his three scores rejoins badly. A section
listing what you could not establish.

**NOT ESTABLISHED beats a complete invented answer.**
