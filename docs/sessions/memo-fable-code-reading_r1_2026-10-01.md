# What Ilya's code is, read firsthand, and what it means for the scan reader

Fable, 2026-10-01, about 23:05. Ordered by Dann at 22:47: "examine the Code now to inform
yourself what Ilya is exactly and how it works." Read at commit `8fdfcde`. Every claim carries
a `path:line` or says NOT ESTABLISHED. Paths are from the repository root. The two September
catalogue memos (`docs/sessions/memo-audit-code-catalogue-a_r1_2026-09-24.md`, `-b_`) served
as a map; nothing below rests on them alone.

Read in full or in the cited parts: `apps/web/src/lib/pipeline.ts`;
`packages/dictionary/src/pre-reform-normalizer.ts`, `poetic-normalizer.ts`;
`packages/phonology/src/engine.ts` (lookup, syllabification);
`apps/web/src/lib/score/` (`vowel-resolver.ts`, `pairings.ts` 1-450, `score-seat.ts`,
`underlay-donor.ts`, `heal.ts` 1-150, `reseat.ts` 1-150, `clitic-seat.ts` 100-200,
`correction.ts` 1-140, `entry.ts` 1-120, `reconciliation/*`, `ingestion/*`,
`ScoreUploader.svelte` 230-790); `apps/web/src/lib/reader/` (`recognized.ts`,
`page-reader.ts`, `page-reader.worker.ts`, `page-pdf.ts`, `staff-detect.ts`);
`apps/web/src/routes/+page.svelte` (the arrival and seating sections);
`packages/score-parser/src/types.ts`, `staff-renderer.ts` (options, withheld mark, tacet),
`tempo-lexicon.ts` head, `unfold.ts` head; `apps/web/src/lib/library/types.ts`;
`tools/e16-harness/src/scorer.ts`, `ground-truth.ts`, `normalized-format.ts`.
NOT read: `mnx-parser.ts`, `musicxml-parser.ts` beyond a grep, `Loupe.svelte`,
`CorrectionSurface.svelte`, `MarkupPane.svelte`, `page-image.ts` beyond its header, the
analysis and insights folders, the library drivers.

## 1. What Ilya is, in five parts

1. **The text path.** `processText` (`apps/web/src/lib/pipeline.ts:266`) is the one door from
   Russian text to a transcription, and this file is the only importer of the phonology,
   dictionary, and blurb packages. Per word: NFC; pre-reform spelling modernised only when the
   dictionary knows the result, with the engraver's spelling kept in `preReformSource`
   (`pipeline.ts:544-571`, `packages/dictionary/src/pre-reform-normalizer.ts:230`); poetic
   contractions tried when the direct lookup misses (`poetic-normalizer.ts`); ё restored when a
   word is unknown with е and known with ё (`packages/phonology/src/engine.ts:698-789`, Phase 2);
   stress from the dictionary; abstention with no stress mark when nothing resolves.
   `isKnownWord` (`pipeline.ts:262`) is the public yes-or-no on a word.
2. **The score path.** Every score format becomes one `ParsedScore`
   (`packages/score-parser/src/types.ts:36`) through `ingestScoreFile`
   (`apps/web/src/lib/score/ingestion/ingest.ts:161`). A vocal line is a list of events, each a
   note or rest with pitch, duration, tie, fermata, articulations, and an optional syllable
   (`types.ts:463-515`). A melisma is the absence of a syllable (`types.ts:495-504`).
3. **The pairing layer.** What the singer decided each note carries: a map from event id to a
   syllable, a melisma, or empty, stored by value (`pairings.ts:120-132`). An absent id is
   undecided.
4. **The correction layer.** A second map keyed by event id: alter, delete, enter, note or rest,
   tie, tuplet (`correction.ts:48-100`, `entry.ts`). It is a diff applied after the read.
5. **The page.** `staff-renderer.ts` draws the vocal line and takes the app's knowledge as
   sets and maps keyed by event id: `ipaPreview`, `cyrPreview`, `melismaPreview`,
   `sylTypePreview`, `withheldIpa` (`staff-renderer.ts:217-330`).

A song is stored as the poem, the two maps, and the source file's bytes
(`apps/web/src/lib/library/types.ts:71-129`). A page read is not stored as its result: the
reader runs again over the stored bytes on every reload (`correction.ts:8-18`,
`library/types.ts:88-96`).

## 2. The scan path as it stands

`take()` (`ScoreUploader.svelte:266-292`) rasterises the first page and asks `hasStaves`
(`reader/staff-detect.ts:56`). Staves found: the reader probes the clef and key
(`ScoreUploader.svelte:522-541`, `:702-719`), the singer confirms them, and the read runs:
`rasterizePdf` at 400 dpi (`reader/page-pdf.ts:52`, `:109`), the Pyodide worker, `ro`
(`reader/recognized.ts:64-70`), `recognizedToMusicXml`
(`ingestion/recognized-to-musicxml.ts:159`), the MusicXML parser. No sung line found: the page
is read as a poem by Tesseract `rus` over the whole page (`ScoreUploader.svelte:433-481`) and
refused when most of its words are unknown (`ingestion/ocr-guard.ts`).

What `ro` carries per event: id, note or rest, measure, onset, duration, midi, the assumed
natural, and abstentions (`recognized.ts:29-50`). Per measure: the metre and its checks
(`:52-62`). **It carries no word, no tie, no slur, no tempo, no dynamic, no hairpin, and no
position on the page.**

What the converter writes: one part named Voice, the key and clef the singer confirmed, the
metre, and notes and rests with the reader's id on each `<note>`
(`recognized-to-musicxml.ts:209-329`). **No `<lyric>`, no `<tie>`, no `<direction>`.** An
abstained pitch is engraved as a natural and an abstained duration as a quarter note, counted
and never marked (`:14-30`, `:175-183`).

## 3. What already exists for "syllables faithful to the scan, checked by the Transcription pipeline"

1. **The whole downstream is built and live for score files.** A score arriving with words into
   an empty poem box fills the box from the score's own syllables
   (`+page.svelte:3259-3263`, `vowel-resolver.ts:199`, `:300`), `handleInput` runs
   `processText` over them, and `seatFilledPoem` seats each word on the notes the file put it
   under (`+page.svelte:3157-3160`, `score-seat.ts:78`). **If the scan reader's MusicXML carried
   `<lyric>` elements, this path would fill, transcribe, and seat them with no new seating
   code.** The parser reads `<lyric>` with its `<syllabic>` role already
   (`musicxml-parser.ts:800-814`).
2. **The checker.** `processText` already does what Dann described at 22:47: it keeps the
   engraver's letters, modernises them when the dictionary agrees, restores ё, and abstains
   honestly.
3. **A drawn "unsure" for a syllable.** The lavender question mark in a ring
   (`staff-renderer.ts:55-121`), drawn where the resolver declined a syllable (`:269`,
   `:3213`, `:3396`), with a legend entry. `buildUnderlayResolvers` reports the set
   (`vowel-resolver.ts:383`).
4. **Three working aligners.** `matchDonors` (`underlay-donor.ts:67`) and `diffWordGrid`
   (`apps/web/src/lib/text-diff.ts`) are exact-word longest-common-subsequence aligners.
   `planHeal` (`heal.ts:147`) aligns seated words against a poem with case and ё folded, a
   joined-run rule (one word against two or more adjacent words whose letters join to the same
   thing, `heal.ts:31-34`), and a guard against lone matches (`:35-37`).
5. **The two-witness design.** `score/reconciliation/` holds the types, the three disparity
   classes with their treatments, and a view model. Its alignment engine was never built
   (`reconciliation/types.ts` header).
6. **Tesseract is already in the app**, loaded only when needed
   (`ScoreUploader.svelte:442-446`).
7. **A scorer and a truth path.** `tools/e16-harness/src/scorer.ts` scores pitch and rhythm
   precision, recall, and F1, tessitura, and Alignment Error Rate for syllables;
   `ground-truth.ts` builds truth from a `.musx` through the product's own parser. The
   harness's schema has a `syllableText` slot the Python never fills
   (`normalized-format.ts`, `RecognizedNote`; `reader/recognized.ts:8`).
8. **Tacet bars draw themselves.** A measure the score declares and the vocal line leaves
   empty is drawn as one rest with a count (`staff-renderer.ts:800-835`). A tacet system needs
   only its empty measures emitted.
9. **Tempo words have a data path.** The parser collects `<direction><words>`
   (`musicxml-parser.ts:501`), a five-language lexicon maps them to Italian head terms
   (`tempo-lexicon.ts`), and the analysis resolves a tempo from them
   (`apps/web/src/lib/analysis/score-metrics.ts:124`).
10. **Ties are understood downstream.** A tie's continuation never takes a syllable
    (`pairings.ts:300-309`) and the renderer draws ties.
11. **Repeats and the pickup.** `unfold.ts` is source-agnostic by its own header; `pickup.ts`
    and `Measure.isPickup` (`types.ts:269`) exist.

## 4. What is needed, and what the code read changes

1. **The seam carries too little.** `ro` and the converter must grow to carry syllables (text,
   role in the word, extender), ties, and tempo words. The parser side already reads all three.
2. **Dynamics have no home anywhere.** No type, no parser branch, no drawing (grep at
   `8fdfcde`: the only hits are comments at `musicxml-parser.ts:136` and `:1004`). Hairpins the
   same. This is new work in three places.
3. **Markup draws no tempo text.** `staff-renderer.ts` has no reference to `tempoWords`. Step 3
   of the plan ("tempo and dynamics above the melody") needs drawing work for both.
4. **"Unsure" for a note has no channel.** The pattern is there: one more set keyed by event
   id beside `withheldIpa`. The reader's ids already reach the page as event ids
   (`recognized-to-musicxml.ts:137-155`). Nothing needs storing, because the read is rebuilt on
   every reload.
5. **A misread vowel withholds the whole word.** The resolver declines a word whose syllable
   count on the score disagrees with the engine's count (`vowel-resolver.ts`, move 2), and
   `seatScoreWords` refuses the same word (`score-seat.ts` header). Correct, and on recognised
   text it will fire often.
6. **The dictionary catches non-words only.** A misread that lands on a real word («день» for
   «тень») passes every check in section 3. Only a second witness (the poem) can catch it.
7. **No one-edit recovery beyond ё.** The ё rule is the template: try a known substitution,
   accept only if the dictionary knows the result. Nothing does this for recognition slips.
   NOT ESTABLISHED: how many of the 172 Tchaikovsky syllables it would recover.
8. **The poem as second witness is unbuilt.** With a poem already typed, a score's words are
   ignored and the first pass counts one syllable per note and never makes a melisma
   (`pairings.ts:311-345`, `+page.svelte:3259-3263`). N.134 increment 2 is this gap
   (`score-seat.ts` header). `planHeal`'s algorithm is the nearest built thing.
9. **Pre-reform endings are not built** (-аго, -ыя, онѣ, ея;
   `pre-reform-normalizer.ts` header), and the OCR guard's word pattern leaves out the
   pre-reform letters (`ocr-guard.ts:48`).
10. **The scorer is too lenient for the ruled measure.** A duration counts as right within 0.2
    of a whole note (`scorer.ts`, `ONSET_TOLERANCE`, used for `rhythmMatch`), so a quarter read
    as an eighth passes. It also assumes the reader's bar numbering agrees with the truth (its
    own header). "95 of 100 in pitch and length" needs an exact test.
11. **Every reader change re-reads every stored page song.** Corrections are keyed by the
    reader's ids, built from measure and x. A change that moves a barline renames the events
    after it and their corrections go orphan, kept and counted (`correction.ts:673`), with a
    migration precedent (`:644`). The straighten step remaps y only, so x holds; a new barline
    reading does not.
12. **Read time is paid on every reload.** Adding word recognition adds to it each time.
    NOT ESTABLISHED: how long a three-page read with words takes in the app.

## 5. What this means for the plan and the first brief

- **Words: scan first, poem second.** Plan r3 put the poem first. The code says the scan-first
  path is nearly wired (section 3, item 1) and the poem path is the unbuilt one (section 4,
  item 8). Dann's 22:47 direction and the code agree. The poem becomes the second witness that
  confirms or corrects, through the reconciliation design already written.
- **Phase 0 is smaller than planned.** A scorer and a truth path exist. They need an exact
  duration test, a words measure by syllable, and truth that does not depend on bar numbering.
- **The experience phase is smaller for words and larger for marks.** The syllable "unsure"
  mark exists. Tempo text and dynamics draw nowhere today.
- **The staves brief stands as the first engineering step.** Two additions: say what happens to
  stored corrections when bar numbering changes, and measure the read time before and after.
