# Brief: QUEUE row 181, joining POEM to LYRICS on a scan (Code, r2, 2026-11-04, Fable-reviewed)

Written by the desk (Opus). Lines cited were read by the desk on `Shane` at `0c3977f9` on 2026-11-04 11:5x to 12:1x unless marked `cloud-lane-31:` (read there by the desk's census helper, `report-desk-row181-census_r1_2026-11-04.md`, and to be re-read by you in step 0). Every desk choice below is marked DESK DEFAULT; Dann may strike any of them. **NOT ESTABLISHED beats a complete invented answer.**


**r2 applies all 21 amendments of Fable's review** (`review-fable-brief-row181_r1_2026-11-04.md`, SEND WITH AMENDMENTS, 201,005 Fable tokens). They are reproduced verbatim in section 8 and **override sections 0 to 7 wherever they differ**: read section 8 before you start step 0. Desk rulings on the review:
- Amendment 5 is applied without a question to Dann: his 2026-11-04 10:12 item 1 ("garbled or not") already rules it (`CONTRACT.md` §1 item 6a); the walk's item 1 stands as written.
- Amendment 13's design (a), crop on demand, is the DESK DEFAULT; Dann's taste answers on the two questions at the review's end are recorded in section 9 when he gives them, and step 3 and step 4.4 wait for them.

## 0. What the singer meets (the walk, written first)

Marina drops her photocopy of a Musorgsky song. Ilya reads the notes and most of the words. It recognises the poem and fills POEM from its library, naming the source. Then:

1. Under the notes she sees the composer's words, as the print sets them. Where the print was smudged and Ilya read «тсб», she sees the poem's «тебя» with a quiet dotted underline; one tap shows what the print seemed to say and puts it back if she wants.
2. Where a line of the print could not be read at all, but the poem's line fits those notes exactly, the syllables are there, marked the same way. Where the fit is not exact, the notes stay empty and the banner names the bar.
3. Where the composer changed a word («иль» for «или»), Ilya keeps the composer's word, coloured as a difference from the poem (sage in LYRICS, ratified 2026-10-16). Ilya never changes POEM.
4. Where a note holds the syllable before it (a tie, a slur's melisma, an extender line printed under the notes), it stays wordless, and nothing is flagged.
5. The banner lists the bars to check. Each bar number is a link. A tap opens the Loupe on that bar with the print's own strip above Ilya's syllables, "Fill from the poem" beside it, and Previous and Next ("Bar 14, 1 of 3"). Nothing pops up unasked.
6. LYRICS' receipt line says, in effect, "6 syllables filled from your poem", with Revert and a list (stage 3 item 8).

## 1. The rulings this builds (read them in full first)

`docs/memory/OPEN.md`: "JOINING POEM TO LYRICS ON A SCAN" (items 1 to 8, Dann 2026-11-04 10:12 to 12:02); "N.135 STAGE 3, HOW ILYA SEATS TEXT ON NOTES" (ratified 2026-10-20, items 1 to 11 and the rule over all of it); "N.135 STAGE 3: TWO VIEWS OF INPUT"; "THE POEM LIBRARY FILLS FROM ATTRIBUTED SOURCES" (2026-11-04 09:40). `docs/memory/CONTRACT.md` §0.1 (one vowel per note, no more, no less, NO EXCEPTIONS) and §0.2 (positions from the ink, never an arbitrary proportion). Where this brief and a ruling differ, the ruling wins and you say so in the step report.

Amendments in force from the joining design: stage 3 item 1's "only where the reader saw ink" is lifted (item 2); Lyrics wins a real-word disagreement and POEM is never altered (item 3); repeats and omissions are the composer's licence (item 4).

## 2. What the tree does today (each re-read by you in step 0)

- A kept reading is `{ musicXml, stamp }` only (`apps/web/src/lib/omr/stamp.ts:52-56`); no band picture, position, or ink measure survives the read. `UNDERLAY_READER = 'underlay@3'` (`stamp.ts:50`).
- A band is in page pixels with the page size known (`omr/underlay-band.ts:45-55`, `lyricBand` `:94-104`); it is cropped, cut into rows, and framed in `prepareUnderlay` (`omr/underlay-prepare.ts:167-194`).
- `NotePlace.underExtender` is declared (`omr/underlay-seat.ts:93`) and read by `isContinuation` (`:108-110`, the ONLY reader of the three continuation flags), and set nowhere: the scan path builds `NotePlace` without it (`underlay-prepare.ts:180`). Ties: `:134`; slur stack pairing: `:86-110`.
- Token kinds: letters = `syllable`, hyphen-only = `joint`, underscore-only = `extender`, else `mark` (`underlay-seat.ts:142-153`). A hyphen-only token wider than half the ink height becomes an empty mark (`omr/underlay-tokens.ts:50-51`). Tokens carry page-pixel `x0`, `x1` (`underlay-tokens.ts:62-64`).
- `seatPage`: a row is read only if `rowLanguage` calls it Russian or it is the fallback row (`omr/underlay-page.ts:207-213`); one vowel per note is enforced by `assertVowelPerNote` (`:240`); the per-system slur gate (`:242-257`, the test at `:251`); the sung notes go to `vowelsPerNote`, counted, never repaired (`:266`, `:292`; `omr/vowels-per-note.ts:73-95`).
- An unread system reports `'no Russian row'` whether its band held ink or not (`underlay-page.ts:281-285`). `applyUnderlay` turns unread systems into bar ranges (`omr/underlay-song.ts:69-112`), written into the file by `markUnreadBars` (`omr/homr-reader.ts:418`; `omr/unread-bars.ts:80`) and shown as the partly-read banner.
- POEM to LYRICS today: word pairs only, `comparePoem` (`text/poem-compare.ts:162-168`); `layOutLikePoem` changes whitespace only (`:232`). The library match is a local alignment that returns a span and score, no letter map (`cloud-lane-31:apps/web/src/lib/text/poem-match.ts:104-173`). No code writes a poem's word into LYRICS or under a note in the files read (repo-wide: NOT ESTABLISHED; step 0 greps).

## 3. Where the join lives (DESK DEFAULT)

The poem may arrive after the scan is read (the library fills POEM from LYRICS' own words, `cloud-lane-31:text/poem-offer.svelte.ts`), so the join is **not** inside `seatPage`. It is a pure module, `apps/web/src/lib/text/poem-join.ts`, run after ingest and again whenever POEM or LYRICS changes (on the 600 ms pause, stage 3 item 6). Its inputs: the sung notes in song order (id, bar, continuation, the seated syllable or none, the syllable's provenance); the unread systems with their bars and whether their band held ink; POEM's text. Its output: a list of proposals per note (`fill`, `repair`, `keep-composer`, `offer`), each with its evidence. Applying them goes through the existing LYRICS and seat paths; step 0 names those paths. POEM is read, never written.

## 4. Steps (one commit and one report each, `docs/sessions/report-code-row181-step<n>_r1_<date>.md`; stop after each report for the desk)

### Step 0. Read, measure the control, no change
1. Re-read every line in section 2; report each that moved.
2. Read and report: the path from a MusicXML lyric to LYRICS' text and the stored seats (`score/pairings.ts`, `score/score-seat.ts`, `score/ingestion/ingest.ts`); where a kept reading is stored (`omr/restore.ts`, `library/`); the Loupe component and how it opens on a note; where the partly-read banner is drawn and its strings (`upload.banner.*`); `sewWords` beyond `omr/underlay-words.ts:80` (what `sustained` does); `omr/underlay-recognize.ts`.
3. Grep the tree for any writer of poem words into LYRICS or under a note.
4. Control: on `Shane` merged with `cloud-lane-31` (the poem build), row 114 first file on the singer's path with `?words=read`, the desk's scorer (`~/Downloads/_desk-2026-11-02/m0/`, staged by the desk): expect **369 of 590** (48, 136, 29, 82, 74). A different number stops the row.

### Step 1. The band says whether it held ink; extender lines are read (scan path)
1. `SystemLayout` gains the band's ink share (pixels below `paper - INK_BELOW_PAPER`, the constant `cutRows` already uses, `omr/underlay-rows.ts`), and `systems[].why` distinguishes `'no ink'` from `'no Russian row'`. Name every site that reads `why` (`CONTRACT.md` §4).
2. **Extenders.** After `pageTokens`, an `extender` token, or a mark that was a long dash (`underlay-tokens.ts:50-51`), standing after a syllable on the same row, sets `underExtender` on every free note whose x lies inside its `x0..x1` other than the note the syllable took. Set it on the `NotePlace` copies the gate reads, so `isContinuation` stays the only reader. **Two arms, measured, the better ships (DESK DEFAULT):** (a) underscore tokens and long dashes only; (b) (a) plus the notes spanned by a hyphen joint between two syllables of one word. Report both on row 114 f1 against 369, with two-vowel and `no-syllable` counts.
3. A system with no ink whose every sung note is a continuation is not unread (Dann 10:24, item 6 (c)): it leaves the banner.

### Step 2. The second look (item 6 (b), item 7)
For a system with ink and no Russian row: at most **four** further looks (DESK DEFAULT; each loop's limit stated in a comment, the 2026-11-01 comment rule): the cut shifted by plus and minus half a staff space; the band widened by one staff space each way; contrast stretched to the band's own ink and paper tones. Keep the look whose row has the most dictionary words, if it passes `rowLanguage`; else the system stays unread. Report the seconds each look adds per page and the row 114 f1 count.

### Step 3. The band pictures are kept (item 1, item 8)
Each system's band crop (greyscale, losslessly compressed) is kept with the reading, with its position as **page fractions** and its staff space as a fraction of page height (Dann 10:26: proportions, not fixed pixels), its page, system, and bars. The reading's stamp moves (`underlay@4`). `CONTRACT.md` §8 permits storing the reading of a scan when stamped. Report the bytes per page and per song on row 114; the desk tells Dann before any merge.

### Step 4. `poem-join.ts`, pure, with tests
1. **Words first:** `comparePoem` pairs LYRICS' words with POEM's (`text/poem-compare.ts:162`). Repeats and omissions are allowed (item 4): a jump in the poem is accepted at a phrase end (stage 3 item 9; phrase ends from row 108's code).
2. **Syllables inside a paired word:** the poem's word is cut by the engine (`GraysonEngine.syllabify`, `packages/phonology/src/engine.ts:843`). Where the scan's syllable count for the word equals the poem's, syllables pair one to one; otherwise the word is not repaired syllable by syllable, and Lyrics keeps it.
3. **The tiers per syllable** (stage 3 item 6, tier 3 tested before tier 2): tier 1 repair where the scan's word fails the dictionary (`isKnownWord`, `pipeline.ts:225-227`, after `modernisePreReform`) and the poem's passes and the scan's token is gibberish by the character-set test of stage 3 item 6, or the two differ only at letters inside the repaired syllables; tier 2 keep the composer's real word, marked; tier 3 offer, never applied. A word the singer typed or placed by hand follows the rule over all of it.
4. **Blank notes (item 2):** a non-continuation sung note with no syllable, inside a run of notes whose neighbours are both paired with the poem, takes the poem's next aligned syllable, marked. **Unread systems (item 6 (d), option C):** fill only where the systems before and after are both paired and bracket exactly one stretch of the poem whose syllable count equals the system's non-continuation sung notes; otherwise propose nothing and leave the bar in the banner.
5. **Every proposal passes the one-vowel check before it is returned**: no proposal puts a vowelless, a many-vowel, or no syllable on a note it fills (`CONTRACT.md` §0.1; the same `vowelsPerNote` the scan path counts with). A proposal that would breach it is dropped and counted.
6. **Cross-checks** (item 7): after proposals are applied in memory, the join re-runs once on its own output; a second pass that changes anything is a fault, counted and reported, never looped further.
7. Tests: the walk's six cases; a repeat and an omission; a hand-edited word; a blank under an extender (stays blank); the one-vowel refusals; mutants on the tier order and the bracket rule.

### Step 5. Wiring
Apply the proposals through the paths step 0 found. LYRICS shows filled and repaired syllables with the dotted underline (`WordStack.svelte:110-116` pattern, stage 3 item 6); a tap acknowledges; Revert restores the scan's syllable. The receipt line's count and list (stage 3 item 8). POEM untouched; a test pins it byte for byte across a join.

### Step 6. The print waits at the bar (item 8)
The banner's bar numbers become links; a tap opens the Loupe on the bar's first note with the kept band picture above the syllables, cropped to the bar by its notes' x, "Fill from the poem" (one tap applies option C's proposal for that system even when the bracket rule failed, marked), and Previous and Next over the banner's bars. Phone and desktop. Strings: keys only, English and French text from `docs/sessions/strings-row181_r1_2026-11-04.md` (to be written by the desk and ratified by Dann before this step starts; until then, stop before this step).

### Step 7. Measure and gates
Row 114 first file on the singer's path, POEM filled by the library as a singer would get it (songs 2 to 5 match; song 1 has no library text), against 369; per song; two-vowel, `no-syllable`, and empty-note counts; how many syllables came from the poem, by tier. The second file stays sealed. All eight gates; report the counts the ship script needs.

## 5. Sites that compute the same numbers (`CONTRACT.md` §4)
- Continuation: `isContinuation` (`underlay-seat.ts:108-110`) on the scan path; `syllableTargetIds` (`score/pairings.ts:297-307`) and `slurContinuationIds` (`score/slur-seat.ts:41-54`) on the typed path. An extender read on the scan becomes a continuation on the scan path only; whether the stored song carries it to the typed path (a MusicXML `<extend>` written by `writeLyrics`) is a step 0 question, and the two paths must agree on the stored file.
- Unread bars: `applyUnderlay` (`underlay-song.ts:69-112`) and the banner; a system reclassified by step 1 changes both.
- One vowel per note: `assertVowelPerNote` (`omr/assert-vowel-per-note.ts:56-65`), `vowelsPerNote` (`omr/vowels-per-note.ts:73-95`), `CYRILLIC_VOWEL` (`score/vowel-resolver.ts:159`); the join uses these, never a new vowel list.

## 6. Ceilings
`pipeline.ts` is at 925 of 925 and `+page.svelte` at its ceiling; touch neither (new files instead). `pairings.ts` 1420 of 1422. Other files under the default 1,000.

## 7. Return memo, per step
What changed, with files and lines; tests added and their controls; gates; the row 114 f1 count where the step measures; anything you could not establish; any departure from this brief or a ruling, with the reason.

## 8. Fable's amendments, verbatim (in force; they override the sections above)

#### 1. The extender must survive the stored file, or the fill breaks the walk's item 4 after a reload

Reason. The join runs "after ingest and again whenever POEM or LYRICS changes" (brief §3). After a reload the song is ingested from the kept MusicXML (`omr/restore.ts:40-52`, `omr/unread-bars.ts:11-18`). `writeLyrics` writes `<syllabic>` and `<text>` only (`omr/underlay-words.ts:174-178`, `:199-201`); `Syllable.sustained` is "Not written to the lyric" (`:33`). The score parser reads no `<extend>` (grep of `packages/score-parser/src/musicxml-parser.ts`: no hit; `types.ts:511-516` encodes a melisma by the absence of a syllable). On the typed path a note with no syllable is a sustain with no cell and no pairing (`score/vowel-resolver.ts:270-276`; `score/score-seat.ts` header), continuations are ties (`score/pairings.ts:297-307`) and the slur gate (`score/slur-seat.ts:41-54`, `:62-70`) only, and an inserted word takes open notes (`score/reseat.ts:9`). So after a reload every extender note is an open, non-continuation, blank note: step 4.4 fills it, the one-vowel "none" check cannot see it, and the walk's item 4 fails on the second opening of the song. The same holds for `noSyllableCount` (`score/ingestion/fixture-rule.test.ts:83-95`, ties only).

Replacement text, add to step 1 as item 4:
> 4. **The extender rides with the reading.** `writeLyrics` writes `<extend type="start"/>` inside the `<lyric>` of a `sustained` syllable (standard MusicXML). The ingestion reads it at the one seam every MusicXML passes (`ingest.ts:135`, the `withUnreadBars` pattern; a new convention file beside `unread-bars.ts`, writer and reader together) and writes a `{ kind: 'melisma' }` pairing (`pairings.ts:128`) on every sung note after that syllable up to the next note that carries a lyric, before `seatScoreWords` runs; a note that carries a decision is never taken by a reseat (`slur-seat.ts:72`). The typed path's continuation for the join is ties, the slur gate's marks, and these pairings. Test: a scan read with an extender, stored, reopened: the extender notes are continuations on both paths and the join proposes nothing on them. The parser path (reading `<extend>` in `musicxml-parser.ts`) is the cleaner alternative and costs a package change; Code names the cost in the step 1 report and ships the seam unless the desk says otherwise.

#### 2. Arm (b) of the extender rule takes a position from an inference, not from ink (`CONTRACT.md` §0.2), and hides a dropped syllable

Reason. Arm (b) marks "the notes spanned by a hyphen joint between two syllables of one word" as continuations. A hyphen of ordinary width between two syllables that sit several notes apart is not ink under those notes; it is the pairing of two seats. Where the reader dropped a syllable token between them (the common OCR failure on row 114), arm (b) marks the dropped syllable's note a continuation, `vowelsPerNote` then skips it (`omr/vowels-per-note.ts:80-83`, a continuation with no text is not `no-syllable`), and step 4.4 never fills it. The loss is silent, which is the one failure the rule exists to prevent. Arm (a) reads the token's own box, which is ink.

Replacement text for step 1 item 2, the two arms:
> **Two arms, measured, the better ships (DESK DEFAULT):** (a) `extender` tokens only; (b) (a) plus a `joint` token or a long dash whose OWN box (`x0..x1`, `underlay-seat.ts:76-80`) spans at least one free note's x. In both arms the evidence is the token's box, never the distance between two seats. A hyphen that spans no note marks nothing. Report both on row 114 f1 against 369, with two-vowel, `no-syllable`, and empty-note counts, and the number of `extender`, `joint`, and long-dash tokens the reader emitted per song: NOT ESTABLISHED that tesseract at PSM 7 emits an underscore line as a token at all, and if it emits none the arms are moot and the step reports so.

#### 3. The long dash loses its identity before the join can read it

Reason. `splitTokens` turns a wide hyphen-only token into `text: ''` (`omr/underlay-tokens.ts:50-51`); `kindOf('')` is `'mark'` (`omr/underlay-seat.ts:147-152`: no letter, the hyphen and underscore tests fail on an empty string) and `sewWords` drops a mark (`omr/underlay-words.ts:105`). So "a mark that was a long dash" (brief step 1.2) is not a thing the code can find after `pageTokens`.

Replacement text, add to step 1 item 2 before "After `pageTokens`":
> `splitTokens` keeps the long dash as an `extender` token (`text: '_'`, its box unchanged) instead of an empty mark, so `kindOf` and `sewWords` treat it as the print's line; test the kind and that `sewWords` marks the syllable before it `sustained`. The step report says how many long dashes row 114 f1 has and whether any sat between two syllables of one word (NOT ESTABLISHED; a stretched hyphen inside a word already splits the word today and this brief does not change that).

#### 4. "Other than the note the syllable took" needs a seat that does not exist yet; use geometry

Reason. `underExtender` must be set before `tiesOnly` and `free` are made (`omr/underlay-page.ts:197-199`), because `free` feeds the rescue decision and `foldClitics` (`:207`, `:230`); the tokens are read after them (`:201-205`); and the seat of the syllable is known only at `seatTokens` (`:275`). The brief's order ("after `pageTokens`" and "other than the note the syllable took") is circular.

Replacement text for the sentence in step 1 item 2:
> Read the rows (`:201-205`) before `tiesOnly` and `free` (`:197-199`). For each `extender` token standing after a `syllable` token on the same row, set `underExtender` on every note of `system.notes` whose x lies inside the extender's own `x0..x1`, except the note nearest the syllable token's centre (`nearestOf`, `underlay-seat.ts:156`). No seat is consulted. Then make `tiesOnly` and `free` as today; `tiesOnly` spreads every field (`:197`), so both copies carry the flag and `isContinuation` stays the only reader.

#### 5. Tier 1 in step 4.3 contradicts the walk's item 1 and Dann's 10:12 ruling; Dann confirms which stands

Reason. The walk's item 1 applies the poem's «тебя» over a misread «тсб» with one tap to put the print back: tier 1 behaviour. Step 4.3 keeps the 2026-10-20 gibberish test (character set only), under which a garble made of real Cyrillic letters "falls to tier 3" (`OPEN.md` stage 3 item 6, shown and never applied). The 2026-11-04 item 1 says "each syllable position the scan shows under a note, garbled or not, is a place the poem's aligned syllable can fill", and item 3 limits Lyrics' win to "a real-word disagreement". Also «тсб» has no vowel, so it never reaches LYRICS: `assertVowelPerNote` refuses it before seating (`omr/underlay-page.ts:240-241`) and its notes arrive blank. The walk's item 1 is in fact the blank-note case, not a repair.

Replacement text for step 4.3, tier 1:
> Tier 1 repair, applied and marked: the scan's word fails the dictionary after normalizing (`isKnownWord`, `pipeline.ts:225-227`; `Seams.isWord`, `underlay-seams.ts:35`) and the poem's aligned word passes, and the count of vowel-bearing units is equal on both sides (amendment 7). The character-set test of 2026-10-20 is no longer a gate on tier 1 (Dann 2026-11-04 10:12, item 1: "garbled or not"); it stays as the test that marks a hand-edited word provably wrong (the rule over all of it). Tier 3 keeps its two real-word cases (one letter or one confusion apart) and the case where both fail and the poem's word is not close by the alignment. **Dann confirms this reading of item 1 against item 6's 2026-10-20 wording before step 4 starts**; if he keeps the character-set gate, the walk's item 1 is rewritten to "shown, one tap applies".

#### 6. A run of blank notes is filled by the same count rule as option C, or the word is cut in half

Reason. Step 4.4 fills each blank non-continuation note "with the poem's next aligned syllable". Where two blank notes stand between two paired words and the poem has three syllables there, the rule seats two and strands the third, which no path can place; where it has one, the second note takes the next word's first syllable and every later syllable slides. Option C already states the right test at system scale.

Replacement text for step 4.4, first sentence:
> **Blank notes (item 2):** a maximal run of non-continuation sung notes with no syllable, standing between two notes whose words are paired with poem words p and q (p < q), takes the poem's words p+1 .. q-1 in order, marked, only where the run's length equals the number of vowel-bearing units of those words (amendment 7); the song's start and end count as paired anchors (p = -1, q = the poem's length). Otherwise the run is an offer (tier 3 shape), never applied, and its bars stay in the banner. Where q = p+1 the run is a composer's repeat with no words read: offer, never applied.

#### 7. "Syllable count" is the slot count after clitic fusion, from one site

Reason. `CONTRACT.md` §0.1: a vowelless word takes no note and fuses to its host. `GraysonEngine.syllabify` (`engine.ts:843`) cuts one word and knows nothing of «в», «ль», «ж». `buildSlotQueue` (`score/pairings.ts:203`) is the one site that gives one slot per vowel-bearing unit with clitics fused (`:224-226`, `:241`), and the typed path seats by it. A second counter is a §4 breach and a cascade waiting to happen.

Replacement text, add to step 4 as item 0:
> 0. **The count.** Every count of "syllables" in this step is the number of slots `buildSlotQueue` returns for the words in question (one per vowel-bearing unit, clitics fused), never `syllabify`'s length. The scan side's count is its seated notes carrying a syllable. A proposal names, per filled note, the slot it fills.

#### 8. Option C's bracket needs the slur reading for the unread system, or it fails closed on every melisma

Reason. The slur gate runs only inside the seated branch (`omr/underlay-page.ts:242-257`, after `continue` at `:213`), so an unread system's continuations are ties only (and extenders, which an unread band cannot give). A system with any slurred melisma then has more "notes that need a syllable" than the poem has units, the count never matches, and option C proposes nothing. Safe, but it leaves exactly the systems the second look was for.

Replacement text, add to step 4.4 after the unread-systems sentence:
> For an unread system the join tests two free counts, ties-only and ties-plus-slur (`slurSpans`, `underlay-prepare.ts:86-110`, carried on the notes), against the bracketed stretch's slot count (amendment 7); it proposes where exactly one matches, or both do (no slur); where neither matches it proposes nothing. A slur that crosses a page break marks nothing (`underlay-prepare.ts:84`), a known gap, reported not fixed.

#### 9. "Fill from the poem" on a failed bracket must say what it does with the surplus

Reason. Step 6 applies "option C's proposal for that system even when the bracket rule failed", but when the rule failed there is no proposal of equal count. The singer taps and must see a defined result.

Replacement text for the parenthesis in step 6:
> ("Fill from the poem": one tap inserts the poem's words between the two paired neighbours into LYRICS at that place, marked; the existing reseat seats them on the open notes in order (`reseat.ts:9`); words past the last open note stay in LYRICS unseated, as stage 3 item 5 does, and the bar stays in the banner until she places them.)

#### 10. Repeats inside a phrase have no aligned word under "jumps at phrase ends"

Reason. `comparePoem` is an LCS where the earliest copy matches and a repeat is unmatched (`text/poem-compare.ts:112-116` header, `:117-153`). A repeated word mid-phrase («грустно, грустно», the 2026-10-14 walk's bars 77 to 78) then has no poem word to repair from, and a garbled repeat falls outside every tier.

Replacement text for step 4.1, after "phrase ends from row 108's code":
> An unmatched LYRICS word standing between pairs (i, p) and (j, q) whose folded form equals, or is one confusion pair from, a poem word in p .. q (the window, which includes the earlier copy) is a repeat and takes that poem word as its aligned word for the tiers and for the blank-run count; it stays coloured as a repeat in Lyrics (default 5). A jump outside the window is accepted at a phrase end only.

#### 11. The hand-or-not fact does not exist in the document; step 4's inputs assume it

Reason. The join's input "the syllable's provenance" (brief §3) and step 4.3's "a word the singer typed or placed by hand" need a stored fact. `Pairing` holds kind, cyrillic, ipa, vowel, origin (`score/pairings.ts:122-128`); `SlotOrigin` holds indices and the word (`:79-100`); nothing says who placed it. `OPEN.md` stage 3 DESK DEFAULT (a) names this as a precondition and the tree still stores none.

Replacement text, add to step 5 before "Apply the proposals":
> Each `syllable` pairing and each Lyrics word gains an additive `by: 'print' | 'poem' | 'hand'` (absent reads as `'print'` for a scan and `'file'` for a score file; `validateRecord` fills it). The join reads it; a Lyrics edit by the singer writes `'hand'` on the words it changed; Revert restores `'print'` and the print's text. The test pins that a reload keeps it.

#### 12. The join's input for unread systems is not in the kept reading

Reason. After a reload the join has the kept MusicXML and the unread bars (`unread-bars.ts:80`, read at `ingest.ts:135-136`), but not which bars form a system nor whether its band held ink (step 1's `why` lives in `SystemLayout`, runtime only, `underlay-page.ts:61-69`, `:284`).

Replacement text, add to step 3:
> The kept reading gains, per voice system of each page, `{ page, system, bars: [first, last], why: null | 'no ink' | 'no Russian row' }` beside the band geometry; the join reads option C's inputs from it, never from the banner's merged ranges.

#### 13. Step 3's storage: measure the crop-on-demand design before storing pictures

Reason. The scan is already kept byte for byte (`CONTRACT.md` §8, the second exception), so the strip the Loupe shows can be cut from the stored scan when the Loupe opens, with the band's geometry (a few numbers) as the only new stored thing. A 2,480-pixel-wide band of two to three staff spaces is on the order of 200,000 greyscale pixels per system before compression; five systems a page, five pages a song, before any number is measured. The walk needs the strip for the unread bars only (item 5), and "what the print seemed to say" (item 1) is the reader's text, not a picture.

Replacement text for step 3:
> Step 3. The band is kept as geometry; the picture is cut when asked for. Each system's band is kept with the reading as page fractions (x0, x1, y0, y1 over the page's width and height) and its staff space as a fraction of page height (Dann 10:26), with the fields of amendment 12. The stamp moves to `underlay@4`; every reading kept under `underlay@3` is read again once on its next opening (`restore.ts:40-52`), through the reading-wait, and the step report says so in one line for Dann. Measure on row 114 f1, on the phone and the desktop: (a) the time to render the page from the stored scan and cut one band when the Loupe opens; (b) the bytes per page and per song of greyscale lossless crops of the unread systems only; (c) the same for every system. DESK DEFAULT: ship (a) where it is under one second on the phone, cached in memory for the session; else (b). (c) is Dann's call (taste, below). `KeptReading` stays `{ musicXml, stamp }` plus additive fields; a record without them reads as before.

#### 14. Step 2's loop has no home named

Reason. `prepareUnderlay` frames the rows in the worker (`underlay-prepare.ts:167-194`), the recognizer runs in the page thread (`underlay-recognize.ts` header), and the only site that holds prepare, recognize, and `seatPage` together is `makeUnderlayReader` (`underlay-reader.ts:71-99`, the three stages at `:77`, `:82`, `:87`). A second look is a loop over all three for one system.

Replacement text, add to step 2:
> The loop lives in `makeUnderlayReader` (`underlay-reader.ts:71-99`): after `seatPage`, for each system whose `why` is `'no Russian row'`, call a new `prepareSystem(page, system, look)` in `underlay-prepare.ts` (one system, one look: the cut shifted, the band widened, or the contrast stretched), recognize its rows, and seat that system alone through a `seatSystem` split out of `seatPage` (`underlay-page.ts:191-287` is the per-system body; extract it, no behaviour change, with the gate's tests still passing). Limit: four looks, stated in a comment at the loop. The page image must reach the loop: say in the step 0 report whether `parts.prepare` keeps it or the worker must be asked again.

#### 15. "No ink" needs a threshold measured against blank bands, not a share alone

Reason. A band under a staff with no words still holds ink: slurs, hairpins, a dynamic, the piano's stems. `cutRows` already calls a line a text line at `LINE_SHARE` 0.02 of the band's width (`underlay-rows.ts:62`, `:149`). A raw share will send hairpin bands to four wasted looks and, worse, could call a faint extender-only band "no ink" and mark its system silent under step 1.3.

Replacement text for step 1 item 1, after "the constant `cutRows` already uses":
> `'no ink'` is ruled by a threshold set in step 1 from row 114 f1's own bands: the ink share of every band whose system was written against every band that holds no text row; the step report gives both distributions and the chosen threshold with the count of bands it misclassifies on each side. A band with any text-line candidate from `cutRows` is never `'no ink'`.

#### 16. Section 5 (`CONTRACT.md` §4) misses six sites

Reason, each read. Continuation: `freeNoteXs` (`omr/underlay-counts.ts:43-45`) reads `isContinuation`; `observedTargets` (`score/slur-seat.ts:62-70`); `collectScoreWords`' sustain on a note with no syllable (`score/vowel-resolver.ts:270-276`); `noSyllableCount` (`score/ingestion/fixture-rule.test.ts:83-95`, ties only, which amendment 1 must widen to the melisma pairing or its count drifts from the join's). Unread bars: `withUnreadBars` (`score/ingestion/ingest.ts:135-136`) and the console line (`omr/underlay-reader.ts:67`). The vowel set: `VOWEL` (`omr/underlay-units.ts:24`, the source `vowels-per-note.ts:39-41` builds from) and a third copy `HAS_VOWEL` in `score/phrase-ends.ts:30`, which the join's phrase ends read.

Replacement text: add those seven lines to section 5 under their headings, and under the vowel set: "`phrase-ends.ts:30` is a third copy; it is not changed by this row and the step 0 report says whether its letters equal `VOWEL`."

#### 17. The `why` readers, named now so step 1 does not search

`omr/underlay-song.ts:95` (into `Unread.why`) and `:104` (the console line); `omr/underlay-reader.ts:67`; tests `underlay-song.test.ts:26, :60, :66, :80, :120`, `underlay-page.test.ts:67, :74, :89, :96, :100, :161, :174`, `underlay-integration.test.ts:59, :142`, `underlay-reader.test.ts:62`; the doc comment `underlay-song.ts:47`. The banner itself reads the merged ranges, not `why` (`unread-bars.ts`, `i18n.ts:1494-1495`). Replace the brief's "Name every site that reads `why`" with this list.

#### 18. `+page.svelte` is at its ceiling and steps 5 and 6 need a hook in it

Reason. `scripts/ratchets.json:8` holds `+page.svelte` at 5586; the file is 5585 lines on `Shane` and 5586 on `cloud-lane-31`. The join must be called at the 600 ms pause and at the arrival sites (as `poem-offer.svelte.ts` is, its header), and the banner's bar links are drawn where the banner is. "Touch neither" cannot hold for a hook.

Replacement text for section 6:
> `pipeline.ts` is at 925 of 925: new files only. `+page.svelte` is at its ceiling: a hook may be added only in a commit that moves at least as many lines out of the file into a named module (the `poem-offer` shape), and the step report gives the line count before and after. `pairings.ts` 1420 of 1422: the `by` field of amendment 11 goes in a new file if two lines do not suffice.

#### 19. The control and the arm measurements run on one machine in one session

Reason. The floor of 0 is "the floor of this machine and this instrument" (`report-desk-t0-t1-row114_r1_2026-11-02.md`, caveat). Arms (a) and (b) will differ by a handful of syllables; a cross-machine comparison cannot tell that from noise.

Replacement text, add to step 0 item 4: "The control and every later count in this row are taken on the same machine, in the same browser build, in one sitting; a count taken elsewhere is reported as unanchored."

#### 20. Step 7 must name the artefact the scorer reads, and wait for the join

Reason. The join applies proposals through LYRICS and the seats (brief §3), not into the kept MusicXML. If the desk's scorer reads the captured MusicXML or a lyrics file written at read time (NOT ESTABLISHED: `~/Downloads/_desk-2026-11-02/m0/` is not reachable from this run), the filled syllables are invisible to it and the measure cannot move. The library fills POEM after the read and the join runs on the pause.

Replacement text, add to step 7: "The capture is taken after the library's fill and the join's pause have run (a settled DOM, the receipt line's count present); the scorer reads the seated text under the notes as Markup draws it, and the step report says which file the capture is and that it is the same artefact the 369 control was scored on. Where it is not, the control is re-taken from that artefact first."

#### 21. Citation repairs

- `omr/underlay-song.ts:69-112` for `applyUnderlay`: the function is `:73-114`; `:69-71` is `barsWithNotes`.
- `omr/underlay-tokens.ts:62-64` as "tokens carry page-pixel x0, x1": those lines are the proportional split of a run-together token (the §0.2 occasion's twin). The token shape is `omr/underlay-seat.ts:76-80`; page pixels come from `pageTokens` (`omr/underlay-page.ts:156-163`).
- `WordStack.svelte:110-116` as "the dotted underline pattern": `:110-113` close a `$derived`; the provenance test is `:115-121` and the frame rule `:126-127`. No dotted underline exists in `components/Paper/` (grep "dotted": no hit). Write: "a new style after the provenance-icon pattern (`WordStack.svelte:115-127`, `:353`)".
- `omr/underlay-seat.ts:142-153`: `kindOf` is `:147-153`; `:142-145` are its patterns. Fine as a range; say so.
- Brief §2 "no code writes a poem's word into LYRICS or under a note": agreed for the files read here (`poem-compare.ts`, `poem-offer.svelte.ts:1-80`: the fill only changes Lyrics' line breaks, its header). Repo-wide stays NOT ESTABLISHED until step 0's grep.

## 9. Dann's taste answers

1. The print in the Loupe for every bar, or for the unread bars only: **EVERY BAR** (Dann 2026-11-04 13:52: *"Your recommnendation, every bar."*, transcribed as written). Step 3 ships design (a), the strip cut from the stored scan when the Loupe opens, on any bar of a scanned song.
2. A filled run the count rule refuses, an offer or nothing: **NOTHING ON THE PAGE; THE EMPTY NOTES ARE THE DOOR** (desk design 1 of three, 13:59; Dann 2026-11-04 14:00: *"the crop is always an assistive device never printed. SO the croip needs to be seated in its familiar Loupe context, so this scenario should invoke the Loupe with the scan fragment"*, transcribed as written). The refused run proposes nothing on the page and its bar stays in the banner; a tap on any empty note of the run, or on the banner's bar, opens the Loupe on that bar with the print strip and "Fill from the poem". The Loupe opens on her tap, never by itself (item 8: nothing pops up unasked).

## 10. Added by the desk after r2 was sent (applies at step 6)

- **The print strip zooms** (`OPEN.md`, JOINING item 10, Dann 2026-11-04 13:58): a pinch on the strip enlarges it on a phone, drawn from the stored scan at its own resolution; on a desktop a trackpad pinch or a tap opens it larger. The pinch acts on the strip alone and never on the drawn notes' taps or the Loupe's swipe. Step 0 reports whether anything in Ilya pinch-zooms today and which gestures the Loupe already claims.
- **The Loupe opens itself once, on arrival** (`OPEN.md`, JOINING item 12, Dann 2026-11-04 14:02): when a reading arrives with bars to check, the Loupe opens once on the first, with Previous and Next; a click outside dismisses it; it never opens by itself again for that song. This amends section 9 answer 2's "never by itself".
- **Fable's critique of the Loupe and the print** (`memo-fable-loupe-print-strip_r1_2026-11-04.md`, 13 findings, 156,196 Fable tokens against 100k stated): its findings are in force for step 6 as DESK DEFAULTS; its three taste questions are Dann's and their answers are added here as he gives them. Lead findings: the self-opened Loupe must switch to MELODY, lower the drawer, set the cursor, then open, or the drawer closes it at once (`+page.svelte:1477-1479`, `:1013-1018`); a pinch must count pointers so it never reads as the dismiss swipe (`+page.svelte:1417-1437`, `loupe.ts:205-207`); the strip is a framed picture with its bar ends at the window's ends, never cut per note (`loupe-render.ts:193-197`); "opens once" keys on a drop, not a restore; a focus target and alt text for the strip.
- **Taste answer 1 (Fable memo):** the strip is always open on every bar, no fold (`OPEN.md`, JOINING item 13, Dann 14:19). No note-for-note alignment is sought or tested (Dann 14:18: a nonissue).
- **Taste answer 2 (Fable memo):** the Loupe's minus and plus scale the strip with the drawn notes (`OPEN.md`, JOINING item 14, Dann 14:21).
- **Taste answer 3 (Fable memo):** order in the Loupe is header, strip, drawn notes, then syllables and IPA (`OPEN.md`, JOINING item 15, Dann 14:22); the header stays fixed and the strip begins the scrolling part (DESK DEFAULT).
