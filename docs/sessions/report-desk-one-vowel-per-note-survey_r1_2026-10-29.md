# One vowel per note: survey report, r1, 2026-10-29

Read-only. Nothing in the clone or the truth folder was changed. Checker: `/tmp/claude-0/-home-claude/89f71d22-12cc-5a77-97a6-d4d4821e7d40/scratchpad/survey/check.py`, driver `run.py`, diff `diff.py` (all run with `python3 -I`). Raw per-note breaches are in `mxml.json` beside them.

Checker rule as implemented: vowel letters are а е ё и о у ы э ю я ѣ і ѵ and capitals; й is not one. A note with a lyric whose text contains a letter is a breach if it has zero vowels ("zero") or two or more ("multi"). A note with no lyric (melisma or tie continuation) and a lyric with no letters (hyphen, underscore, punctuation) is not tested. A verse counts as Cyrillic if any of its texts holds a Cyrillic character. Elision text is joined to the syllable.

## (a) Positive control: PASSED

- Fixture `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`, part P1, verse 1: 97 Cyrillic notes, exactly 1 breach: bar 8, «в», zero vowels. Flagged.
- Truth `mussorgsky_sunless-01_within-four-walls.truth.json`: 96 Cyrillic notes, 0 breaches. Bar 8 reads «в бью» on one note. Not flagged.
- No checker fix was needed.

## (b) Breaches by file

Tracked files matching .musicxml, .xml, .mxl: 199 (198 .musicxml, 1 .xml, 0 .mxl). Files with `<lyric>` at all: 6. Skipped for no Cyrillic lyrics: 193. Parse errors: 0. (A raw grep for numeric Cyrillic character references found none, so no hidden Cyrillic in the skipped files.)

| File | Cyrillic notes | Zero-vowel | Two-plus-vowel | First examples (bar:text) |
|---|---|---|---|---|
| apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml | 97 | 1 | 0 | 8:в |
| packages/score-parser/src/fixtures/n188-markings.musicxml | 22 | 2 | 0 | 1:знь, 4:в |
| apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml | 172 | 0 | 0 | none |
| docs/sessions/assembly-a-scan-to-a-seated-song_r1_2026-10-04/tch-op38-3-from-scan_as-printed.musicxml | 172 | 0 | 0 | none |
| docs/sessions/assembly-a-scan-to-a-seated-song_r1_2026-10-04/tch-op38-3-from-scan_modern.musicxml | 172 | 0 | 0 | none |
| docs/sessions/measure-phase1_r1_2026-10-02/tchaikovsky-op38-3-voice.musicxml | 172 | 0 | 0 | none |

Total across the six: 3 breaches, all zero-vowel, no two-vowel notes. Note the "first examples" bar is the ordinal measure position (1-based); in n188-markings the measure numbers equal the ordinals.

Not Cyrillic-lyric files (193), e.g. the session drops (sun1, sun4 to sun6, tch, k01 to k10 and so on): none carries `<lyric>`, so they are MusicXML without words and cannot breach.

Truth files (16 of 16 have Cyrillic verse 1; 0 skipped):

| Truth file | Cyrillic notes | Zero | Multi |
|---|---|---|---|
| kabalevsky_shakespeare_t01 to t10 | 146, 146, 146, 146, 146, 140, 148, 140, 146, 146 | 0 | 0 |
| mussorgsky_sunless-01 | 96 | 0 | 0 |
| mussorgsky_sunless-02 | 68 | 0 | 0 |
| mussorgsky_sunless-03 | 204 | 0 | 0 |
| mussorgsky_sunless-04 | 108 | 0 | 0 |
| mussorgsky_sunless-05 | 251 | 0 | 0 |
| mussorgsky_sunless-06 | 144 | 0 | 0 |

Truth files: 0 breaches in all 16.

IPA verse (verse 2) note counts versus the Cyrillic verse (notes with text):
- Equal in 14 files.
- sunless-04: IPA 107, Cyrillic 108. Bar 17: Cyrillic has 5 texts (от, ве, ча, я, на), IPA has 4 (ɑ, tʲvʲe, ˈtʃʲɑ, jɑ #).
- sunless-05: IPA 247, Cyrillic 251. Bar 27: Cyrillic 7 texts, IPA 6 (the IPA fuses «то, пре» into «to prʲɪ»). Bar 43: Cyrillic has 3 texts (шо, пот,, у), IPA has none.
- Why these differ is NOT ESTABLISHED (see section e).

## (c) Sunless 1: fixture versus truth

Fixture compared on part P1 only (the fixture has two parts; the second is not the voice). Both files have verse 1 (Cyrillic) and verse 2 (IPA). Comparison is per sung note, in order within the bar; a note with no lyric reads as empty.

Verse 1 (Cyrillic). Bars 1 to 7 are identical. Bars 8 to 18 differ, every one by the same cause: the fixture seats «в» alone on bar 8 note 1, so each later syllable sits one note late.

| Bar | First diverging note | Fixture | Truth |
|---|---|---|---|
| 8 | 1 | в | в бью |
| 9 | 1 | на | деж |
| 10 | 1 | я, | быст |
| 11 | 1 | мгно | ве |
| 12 | 1 | я; | взор |
| 13 | 1 | на | сча |
| 14 | 1 | е; | мно |
| 15 | 1 | я, | мно |
| 16 | 1 | я. | Вот |
| 17 | 1 | я, | ночь |
| 18 | 1 | ди | но |

Bar 8 fixture in full: в, бью, щем, ся, серд, це. Truth: в бью, щем, ся, серд, це, на. Bar 18 holds 4 notes with text in the fixture against 3 in the truth (the fixture ends one syllable later; its last note carries «я.», same as the truth's last).

Verse 2 (IPA). Bars 1 to 3 identical. Bars 4 to 18 differ.

| Bar | First diverging note | Fixture | Truth |
|---|---|---|---|
| 4 | 6 | jɑ | jɑ # |
| 5 | 1 | # | tʲeɲ |
| 6 | 1 | jɑ | ˈdu |
| 7 | 1 | jɑ | ˈpʲe |
| 8 | 1 | jɑ | ˈvʲbʲu |
| 9 | 1 | nɑ | ˈdʲɛ |
| 10 | 1 | jɑ | ˈbɨ |
| 11 | 1 | mɡnɑ | ˈvʲe |
| 12 | 1 | jɑ | vzor |
| 13 | 1 | nɑ | ˈʃʲːɑ |
| 14 | 1 | jɛ | ˈmno |
| 15 | 1 | jɑ | ˈmno |
| 16 | 1 | ɲi | vot |
| 17 | 1 | mɑ | notʃʲ |
| 18 | 1 | ɑ | ˈno |

The IPA verse in the fixture is one note late from bar 5 (the truth fuses «#» onto «jɑ» in bar 4; the fixture gives «#» its own note at bar 5 note 1). The IPA verse is therefore displaced two bars before the Cyrillic verse is. The meaning of «#» is NOT ESTABLISHED here.

## (d) Code paths that put Cyrillic syllable text onto notes (apps/web/src, plus the scan reader)

Only one writer of `<lyric>` exists in apps/web/src: `lib/omr/underlay-words.ts:187` and `:192` (inside `lyricFor`, called from `writeLyrics` at `:208`). Everything else seats into the in-memory pairing map, which the renderer draws over the file's own text.

| # | Site (file:line, read) | What it does | Syllable source | Can it give a vowelless word its own note, or two vowels one note? |
|---|---|---|---|---|
| 1 | lib/score/pairings.ts:202 `buildSlotQueue` | Builds the queue. Word without a Cyrillic vowel (test at :212) takes no slot; it is fused into the previous slot (enclitic, :222) or held for the next host (proclitic, :225, joined with NBSP at :241). One slot per syllable of a vowel-bearing word (:229-246). | the pipeline's `WordStackData.syllables` | Vowelless: no, with one gap: a vowelless word with no host on its line (a line of only «в», or a proclitic at line end) is not given a slot and its text is dropped (pending text is declared per line at :207 and never written if no vowel-bearing word follows). Two vowels: only if the syllabifier returns a syllable with two vowel letters. NOT ESTABLISHED, no test run. |
| 2 | lib/score/pairings.ts:330 `firstPass` (writes at :337) | One slot per target note | queue from #1 | Inherits #1. Never creates a melisma (comment above :330). |
| 3 | lib/score/pairings.ts:1373 `placeSyllable` (writes at :1384) | Hand placement of a tapped syllable on the selected note | `Slot` passed in; `+page.svelte:699` | The slot comes from `slotQueue` (`+page.svelte:398-399`: `poemQueue` = `buildSlotQueue(lines)` at :398, else `scoreTextQueue` at :396, from `readScoreText`, which calls `buildSlotQueue` at `clitic-seat.ts:496`). Inherits #1. |
| 4 | lib/score/pairings.ts:448 `refreshPairings` (writes at :473) | Brings stored text forward from the queue | queue passed in; the page passes `slotQueue` (`+page.svelte:491`) | Inherits #1. |
| 5 | lib/score/pairings.ts:998 | Draw-time underlay over a re-cut copy of the lines | `buildSlotQueue(drawnLines)` | Inherits #1. Falls back to the stored pairing text at :1015 when the slot is gone. |
| 6 | lib/score/score-seat.ts:115, writes at :146-152 | Seats the poem's slots on notes the score's own underlay names | `buildSlotQueue(lines)`; text is `carryPunctuation(slot.cyrillic, cell.text)` | Inherits #1. It refuses a word whose note count disagrees with the slot count (:136-139), so a vowelless file note is never seated here. |
| 7 | lib/score/clitic-seat.ts:455 `seatCliticFolds`, writes at :318 | Repairs a vowelless clitic alone on a note (the Sunless 1 bar 8 case) by seating the fused slot; leaves following notes undecided | queue from `readScoreText` (:496) = `buildSlotQueue` | Vowelless: this is the repair path. Two vowels: NO. Header :38-41 says "One-vowel-per-note is not built"; a composer setting several syllables on one duration is withheld, not repaired. |
| 8 | lib/score/reseat.ts:147 `reseatByDiff` (writes :218, :316) | Re-seats after a text edit | `slotQueue` passed from `+page.svelte:2078` | Inherits #1. |
| 9 | lib/score/replace-seat.ts:74 | Re-seats when a score is replaced | `refreshPairings(live, buildSlotQueue(lines))`, then `seatScoreWords` | Inherits #1. |
| 10 | lib/score/heal.ts:152 and :459 (write :471) | Heals seats | `buildSlotQueue(lines)` | Inherits #1. |
| 11 | lib/score/waiting-seat.ts:45-46 | Composes #7 and #6 | `seatCliticFolds`, `seatScoreWords` | Inherits #6, #7. |
| 12 | routes/+page.svelte:663-667, :2012, :2724, :2853-2868 | Call sites for #6, #7, #8, #9 | as above | Inherits. |
| 13 | **packages/score-parser/src/musicxml-parser.ts:808-850** (outside apps/web/src, read for context) and **packages/score-parser/src/staff-renderer.ts:1029, :2433** | A file's own `<lyric>` text is read verbatim into `ev.syllable.text` and drawn as-is wherever no pairing overrides it (`cyrPreview?.[id] ?? ev.syllable?.text`) | the MusicXML file | **Does not go through `buildSlotQueue`.** Draws whatever the file says, so the fixture's lone «в» is drawn on its note until the clitic fold (#7) covers it. A two-vowel note in a file is drawn as is. |
| 14 | **lib/omr/underlay-seat.ts:156 `seatTokens`**, `kindOf` at :99 | Scan reader: seats reader tokens on notes by `monotone` (called at `underlay-page.ts:177`) | OCR tokens | **Does not go through `buildSlotQueue`.** `kindOf` calls any token with a letter a `syllable` (:99-104), so a vowelless token such as «в» is seated on a note of its own. No clitic fusion anywhere in `lib/omr/underlay-*.ts` (grep for clitic, NBSP, u00a0 returned nothing). |
| 15 | **lib/omr/underlay-units.ts:38 `cutUnits`** | Splits a token with two or more vowels into the engine's syllables | `GraysonEngine.syllabify` via `seams.cut` | **Does not go through `buildSlotQueue`.** If the engine's pieces do not add up (:55-60) the token stays whole with two or more vowels and is counted `mismatched`, so two vowels can land on one note. |
| 16 | **lib/omr/underlay-words.ts:59 `oneToANote`, :101 `sewWords`** | Two tokens that seat on one note are joined into one syllable (text join at :74) | OCR tokens | **Does not go through `buildSlotQueue`.** Two tokens with a vowel each can become one note's text (two vowels). A vowelless token that seats alone stays alone. |
| 17 | **lib/omr/underlay-words.ts:208 `writeLyrics`**, `<lyric>` at :187, :192 | The only writer of `<lyric>` in apps/web/src | `Word[]` from #16, built in `underlay-page.ts:190` | Writes exactly what #14 to #16 produced, one syllable to a note, with no check of the vowel count. |
| 18 | lib/omr/underlay-song.ts:105 | Applies #17 per page | `pages[i].words` | Inherits #17. |

Summary of what does not go through `buildSlotQueue`: rows 13 to 18, that is the file's own lyric (read by the parser, drawn by the renderer) and the whole scan reader (`underlay-seat`, `underlay-units`, `underlay-words`, `underlay-song`). Rows 1 to 12 all do.

The scan path's output is later folded by #7 when it arrives in the page (`+page.svelte:2012`, `:2868`), so a lone vowelless token written into the scanned `<lyric>` is repaired in the pairing map, not in the XML. Whether the exported or stored XML keeps the breach is NOT ESTABLISHED.

## (e) NOT ESTABLISHED

1. Whether the syllabifier (`packages/phonology/src/engine.ts` `syllabify`, and the pipeline's syllables that feed `buildSlotQueue`) can emit a syllable holding two vowel letters. I did not read it or run it over any word list.
2. What `#` means in the Sunless 1 IPA verse (fixture bar 5 note 1, truth bar 4 note 6 «jɑ #»). It looks like a placeholder or fold mark (`diction-marks`, `vowel-resolver.ts:643-651` mention a folded `#`), but I did not read that code, so this is an inference only.
3. Why the sunless-04 and sunless-05 IPA verses have fewer texted notes than the Cyrillic verse (bar 17 of 04; bars 27 and 43 of 05). Bar 27 looks like the truth fusing «то, пре» in IPA, but I did not confirm it.
4. How the truth files were produced (so whether a truth file is independently correct beyond passing this rule). I only tested the rule.
5. Whether the exported or stored MusicXML of a scanned score keeps a vowelless note after the fold (row 14 note above).
6. Behaviour of the checker on a note with several `<lyric>` verses with different numbers inside Cyrillic-numbered verses beyond verse 1/2; the six files only have verses 1 and 2 (Sunless 1) or one verse. Not tested on multi-verse Cyrillic files because none is tracked.
7. Whether the other 193 tracked MusicXML files would be Cyrillic-bearing after a scan-to-lyrics run. They carry no lyrics now; I did not run the scan reader.
8. A vowelless word with no host on its line (row 1) was read in the code at pairings.ts:207-250 only; no test was run to confirm the dropped text.
9. Test files were excluded from the code-path search; whether any test asserts the one-vowel rule was not surveyed.
