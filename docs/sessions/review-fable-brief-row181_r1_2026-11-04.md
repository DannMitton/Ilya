# Review: brief row 181, joining POEM to LYRICS on a scan (Fable, r1, 2026-11-04)

Reviewed `brief-code-row181-joining-poem-to-lyrics_r1_2026-11-04.md` against `Shane` at `0c3977f9` and `origin/cloud-lane-31` at `a0772f8f`. Every line cited below was read by Fable in this run. NOT ESTABLISHED beats a complete invented answer. Canadian spelling, no em dashes.

## Verdict: SEND WITH AMENDMENTS

The shape is right: the walk first, a pure join module outside `seatPage`, proposals applied through the existing paths, the one-vowel check on every proposal, measurement on row 114 f1 against 369. Three things would hurt the singer as written and must change before Code starts: (1) the stored song loses the extender fact, so after a reload the blank-note fill can put a syllable on a melisma note; (2) arm (b) of the extender rule infers a melisma from a hyphen's pairing, not from ink, and would hide a dropped syllable from the one-vowel check; (3) the brief's tier 1 test contradicts its own walk and Dann's 10:12 ruling. The rest are precision and citation repairs.

## Amendments

### 1. The extender must survive the stored file, or the fill breaks the walk's item 4 after a reload

Reason. The join runs "after ingest and again whenever POEM or LYRICS changes" (brief §3). After a reload the song is ingested from the kept MusicXML (`omr/restore.ts:40-52`, `omr/unread-bars.ts:11-18`). `writeLyrics` writes `<syllabic>` and `<text>` only (`omr/underlay-words.ts:174-178`, `:199-201`); `Syllable.sustained` is "Not written to the lyric" (`:33`). The score parser reads no `<extend>` (grep of `packages/score-parser/src/musicxml-parser.ts`: no hit; `types.ts:511-516` encodes a melisma by the absence of a syllable). On the typed path a note with no syllable is a sustain with no cell and no pairing (`score/vowel-resolver.ts:270-276`; `score/score-seat.ts` header), continuations are ties (`score/pairings.ts:297-307`) and the slur gate (`score/slur-seat.ts:41-54`, `:62-70`) only, and an inserted word takes open notes (`score/reseat.ts:9`). So after a reload every extender note is an open, non-continuation, blank note: step 4.4 fills it, the one-vowel "none" check cannot see it, and the walk's item 4 fails on the second opening of the song. The same holds for `noSyllableCount` (`score/ingestion/fixture-rule.test.ts:83-95`, ties only).

Replacement text, add to step 1 as item 4:
> 4. **The extender rides with the reading.** `writeLyrics` writes `<extend type="start"/>` inside the `<lyric>` of a `sustained` syllable (standard MusicXML). The ingestion reads it at the one seam every MusicXML passes (`ingest.ts:135`, the `withUnreadBars` pattern; a new convention file beside `unread-bars.ts`, writer and reader together) and writes a `{ kind: 'melisma' }` pairing (`pairings.ts:128`) on every sung note after that syllable up to the next note that carries a lyric, before `seatScoreWords` runs; a note that carries a decision is never taken by a reseat (`slur-seat.ts:72`). The typed path's continuation for the join is ties, the slur gate's marks, and these pairings. Test: a scan read with an extender, stored, reopened: the extender notes are continuations on both paths and the join proposes nothing on them. The parser path (reading `<extend>` in `musicxml-parser.ts`) is the cleaner alternative and costs a package change; Code names the cost in the step 1 report and ships the seam unless the desk says otherwise.

### 2. Arm (b) of the extender rule takes a position from an inference, not from ink (`CONTRACT.md` §0.2), and hides a dropped syllable

Reason. Arm (b) marks "the notes spanned by a hyphen joint between two syllables of one word" as continuations. A hyphen of ordinary width between two syllables that sit several notes apart is not ink under those notes; it is the pairing of two seats. Where the reader dropped a syllable token between them (the common OCR failure on row 114), arm (b) marks the dropped syllable's note a continuation, `vowelsPerNote` then skips it (`omr/vowels-per-note.ts:80-83`, a continuation with no text is not `no-syllable`), and step 4.4 never fills it. The loss is silent, which is the one failure the rule exists to prevent. Arm (a) reads the token's own box, which is ink.

Replacement text for step 1 item 2, the two arms:
> **Two arms, measured, the better ships (DESK DEFAULT):** (a) `extender` tokens only; (b) (a) plus a `joint` token or a long dash whose OWN box (`x0..x1`, `underlay-seat.ts:76-80`) spans at least one free note's x. In both arms the evidence is the token's box, never the distance between two seats. A hyphen that spans no note marks nothing. Report both on row 114 f1 against 369, with two-vowel, `no-syllable`, and empty-note counts, and the number of `extender`, `joint`, and long-dash tokens the reader emitted per song: NOT ESTABLISHED that tesseract at PSM 7 emits an underscore line as a token at all, and if it emits none the arms are moot and the step reports so.

### 3. The long dash loses its identity before the join can read it

Reason. `splitTokens` turns a wide hyphen-only token into `text: ''` (`omr/underlay-tokens.ts:50-51`); `kindOf('')` is `'mark'` (`omr/underlay-seat.ts:147-152`: no letter, the hyphen and underscore tests fail on an empty string) and `sewWords` drops a mark (`omr/underlay-words.ts:105`). So "a mark that was a long dash" (brief step 1.2) is not a thing the code can find after `pageTokens`.

Replacement text, add to step 1 item 2 before "After `pageTokens`":
> `splitTokens` keeps the long dash as an `extender` token (`text: '_'`, its box unchanged) instead of an empty mark, so `kindOf` and `sewWords` treat it as the print's line; test the kind and that `sewWords` marks the syllable before it `sustained`. The step report says how many long dashes row 114 f1 has and whether any sat between two syllables of one word (NOT ESTABLISHED; a stretched hyphen inside a word already splits the word today and this brief does not change that).

### 4. "Other than the note the syllable took" needs a seat that does not exist yet; use geometry

Reason. `underExtender` must be set before `tiesOnly` and `free` are made (`omr/underlay-page.ts:197-199`), because `free` feeds the rescue decision and `foldClitics` (`:207`, `:230`); the tokens are read after them (`:201-205`); and the seat of the syllable is known only at `seatTokens` (`:275`). The brief's order ("after `pageTokens`" and "other than the note the syllable took") is circular.

Replacement text for the sentence in step 1 item 2:
> Read the rows (`:201-205`) before `tiesOnly` and `free` (`:197-199`). For each `extender` token standing after a `syllable` token on the same row, set `underExtender` on every note of `system.notes` whose x lies inside the extender's own `x0..x1`, except the note nearest the syllable token's centre (`nearestOf`, `underlay-seat.ts:156`). No seat is consulted. Then make `tiesOnly` and `free` as today; `tiesOnly` spreads every field (`:197`), so both copies carry the flag and `isContinuation` stays the only reader.

### 5. Tier 1 in step 4.3 contradicts the walk's item 1 and Dann's 10:12 ruling; Dann confirms which stands

Reason. The walk's item 1 applies the poem's «тебя» over a misread «тсб» with one tap to put the print back: tier 1 behaviour. Step 4.3 keeps the 2026-10-20 gibberish test (character set only), under which a garble made of real Cyrillic letters "falls to tier 3" (`OPEN.md` stage 3 item 6, shown and never applied). The 2026-11-04 item 1 says "each syllable position the scan shows under a note, garbled or not, is a place the poem's aligned syllable can fill", and item 3 limits Lyrics' win to "a real-word disagreement". Also «тсб» has no vowel, so it never reaches LYRICS: `assertVowelPerNote` refuses it before seating (`omr/underlay-page.ts:240-241`) and its notes arrive blank. The walk's item 1 is in fact the blank-note case, not a repair.

Replacement text for step 4.3, tier 1:
> Tier 1 repair, applied and marked: the scan's word fails the dictionary after normalizing (`isKnownWord`, `pipeline.ts:225-227`; `Seams.isWord`, `underlay-seams.ts:35`) and the poem's aligned word passes, and the count of vowel-bearing units is equal on both sides (amendment 7). The character-set test of 2026-10-20 is no longer a gate on tier 1 (Dann 2026-11-04 10:12, item 1: "garbled or not"); it stays as the test that marks a hand-edited word provably wrong (the rule over all of it). Tier 3 keeps its two real-word cases (one letter or one confusion apart) and the case where both fail and the poem's word is not close by the alignment. **Dann confirms this reading of item 1 against item 6's 2026-10-20 wording before step 4 starts**; if he keeps the character-set gate, the walk's item 1 is rewritten to "shown, one tap applies".

### 6. A run of blank notes is filled by the same count rule as option C, or the word is cut in half

Reason. Step 4.4 fills each blank non-continuation note "with the poem's next aligned syllable". Where two blank notes stand between two paired words and the poem has three syllables there, the rule seats two and strands the third, which no path can place; where it has one, the second note takes the next word's first syllable and every later syllable slides. Option C already states the right test at system scale.

Replacement text for step 4.4, first sentence:
> **Blank notes (item 2):** a maximal run of non-continuation sung notes with no syllable, standing between two notes whose words are paired with poem words p and q (p < q), takes the poem's words p+1 .. q-1 in order, marked, only where the run's length equals the number of vowel-bearing units of those words (amendment 7); the song's start and end count as paired anchors (p = -1, q = the poem's length). Otherwise the run is an offer (tier 3 shape), never applied, and its bars stay in the banner. Where q = p+1 the run is a composer's repeat with no words read: offer, never applied.

### 7. "Syllable count" is the slot count after clitic fusion, from one site

Reason. `CONTRACT.md` §0.1: a vowelless word takes no note and fuses to its host. `GraysonEngine.syllabify` (`engine.ts:843`) cuts one word and knows nothing of «в», «ль», «ж». `buildSlotQueue` (`score/pairings.ts:203`) is the one site that gives one slot per vowel-bearing unit with clitics fused (`:224-226`, `:241`), and the typed path seats by it. A second counter is a §4 breach and a cascade waiting to happen.

Replacement text, add to step 4 as item 0:
> 0. **The count.** Every count of "syllables" in this step is the number of slots `buildSlotQueue` returns for the words in question (one per vowel-bearing unit, clitics fused), never `syllabify`'s length. The scan side's count is its seated notes carrying a syllable. A proposal names, per filled note, the slot it fills.

### 8. Option C's bracket needs the slur reading for the unread system, or it fails closed on every melisma

Reason. The slur gate runs only inside the seated branch (`omr/underlay-page.ts:242-257`, after `continue` at `:213`), so an unread system's continuations are ties only (and extenders, which an unread band cannot give). A system with any slurred melisma then has more "notes that need a syllable" than the poem has units, the count never matches, and option C proposes nothing. Safe, but it leaves exactly the systems the second look was for.

Replacement text, add to step 4.4 after the unread-systems sentence:
> For an unread system the join tests two free counts, ties-only and ties-plus-slur (`slurSpans`, `underlay-prepare.ts:86-110`, carried on the notes), against the bracketed stretch's slot count (amendment 7); it proposes where exactly one matches, or both do (no slur); where neither matches it proposes nothing. A slur that crosses a page break marks nothing (`underlay-prepare.ts:84`), a known gap, reported not fixed.

### 9. "Fill from the poem" on a failed bracket must say what it does with the surplus

Reason. Step 6 applies "option C's proposal for that system even when the bracket rule failed", but when the rule failed there is no proposal of equal count. The singer taps and must see a defined result.

Replacement text for the parenthesis in step 6:
> ("Fill from the poem": one tap inserts the poem's words between the two paired neighbours into LYRICS at that place, marked; the existing reseat seats them on the open notes in order (`reseat.ts:9`); words past the last open note stay in LYRICS unseated, as stage 3 item 5 does, and the bar stays in the banner until she places them.)

### 10. Repeats inside a phrase have no aligned word under "jumps at phrase ends"

Reason. `comparePoem` is an LCS where the earliest copy matches and a repeat is unmatched (`text/poem-compare.ts:112-116` header, `:117-153`). A repeated word mid-phrase («грустно, грустно», the 2026-10-14 walk's bars 77 to 78) then has no poem word to repair from, and a garbled repeat falls outside every tier.

Replacement text for step 4.1, after "phrase ends from row 108's code":
> An unmatched LYRICS word standing between pairs (i, p) and (j, q) whose folded form equals, or is one confusion pair from, a poem word in p .. q (the window, which includes the earlier copy) is a repeat and takes that poem word as its aligned word for the tiers and for the blank-run count; it stays coloured as a repeat in Lyrics (default 5). A jump outside the window is accepted at a phrase end only.

### 11. The hand-or-not fact does not exist in the document; step 4's inputs assume it

Reason. The join's input "the syllable's provenance" (brief §3) and step 4.3's "a word the singer typed or placed by hand" need a stored fact. `Pairing` holds kind, cyrillic, ipa, vowel, origin (`score/pairings.ts:122-128`); `SlotOrigin` holds indices and the word (`:79-100`); nothing says who placed it. `OPEN.md` stage 3 DESK DEFAULT (a) names this as a precondition and the tree still stores none.

Replacement text, add to step 5 before "Apply the proposals":
> Each `syllable` pairing and each Lyrics word gains an additive `by: 'print' | 'poem' | 'hand'` (absent reads as `'print'` for a scan and `'file'` for a score file; `validateRecord` fills it). The join reads it; a Lyrics edit by the singer writes `'hand'` on the words it changed; Revert restores `'print'` and the print's text. The test pins that a reload keeps it.

### 12. The join's input for unread systems is not in the kept reading

Reason. After a reload the join has the kept MusicXML and the unread bars (`unread-bars.ts:80`, read at `ingest.ts:135-136`), but not which bars form a system nor whether its band held ink (step 1's `why` lives in `SystemLayout`, runtime only, `underlay-page.ts:61-69`, `:284`).

Replacement text, add to step 3:
> The kept reading gains, per voice system of each page, `{ page, system, bars: [first, last], why: null | 'no ink' | 'no Russian row' }` beside the band geometry; the join reads option C's inputs from it, never from the banner's merged ranges.

### 13. Step 3's storage: measure the crop-on-demand design before storing pictures

Reason. The scan is already kept byte for byte (`CONTRACT.md` §8, the second exception), so the strip the Loupe shows can be cut from the stored scan when the Loupe opens, with the band's geometry (a few numbers) as the only new stored thing. A 2,480-pixel-wide band of two to three staff spaces is on the order of 200,000 greyscale pixels per system before compression; five systems a page, five pages a song, before any number is measured. The walk needs the strip for the unread bars only (item 5), and "what the print seemed to say" (item 1) is the reader's text, not a picture.

Replacement text for step 3:
> Step 3. The band is kept as geometry; the picture is cut when asked for. Each system's band is kept with the reading as page fractions (x0, x1, y0, y1 over the page's width and height) and its staff space as a fraction of page height (Dann 10:26), with the fields of amendment 12. The stamp moves to `underlay@4`; every reading kept under `underlay@3` is read again once on its next opening (`restore.ts:40-52`), through the reading-wait, and the step report says so in one line for Dann. Measure on row 114 f1, on the phone and the desktop: (a) the time to render the page from the stored scan and cut one band when the Loupe opens; (b) the bytes per page and per song of greyscale lossless crops of the unread systems only; (c) the same for every system. DESK DEFAULT: ship (a) where it is under one second on the phone, cached in memory for the session; else (b). (c) is Dann's call (taste, below). `KeptReading` stays `{ musicXml, stamp }` plus additive fields; a record without them reads as before.

### 14. Step 2's loop has no home named

Reason. `prepareUnderlay` frames the rows in the worker (`underlay-prepare.ts:167-194`), the recognizer runs in the page thread (`underlay-recognize.ts` header), and the only site that holds prepare, recognize, and `seatPage` together is `makeUnderlayReader` (`underlay-reader.ts:71-99`, the three stages at `:77`, `:82`, `:87`). A second look is a loop over all three for one system.

Replacement text, add to step 2:
> The loop lives in `makeUnderlayReader` (`underlay-reader.ts:71-99`): after `seatPage`, for each system whose `why` is `'no Russian row'`, call a new `prepareSystem(page, system, look)` in `underlay-prepare.ts` (one system, one look: the cut shifted, the band widened, or the contrast stretched), recognize its rows, and seat that system alone through a `seatSystem` split out of `seatPage` (`underlay-page.ts:191-287` is the per-system body; extract it, no behaviour change, with the gate's tests still passing). Limit: four looks, stated in a comment at the loop. The page image must reach the loop: say in the step 0 report whether `parts.prepare` keeps it or the worker must be asked again.

### 15. "No ink" needs a threshold measured against blank bands, not a share alone

Reason. A band under a staff with no words still holds ink: slurs, hairpins, a dynamic, the piano's stems. `cutRows` already calls a line a text line at `LINE_SHARE` 0.02 of the band's width (`underlay-rows.ts:62`, `:149`). A raw share will send hairpin bands to four wasted looks and, worse, could call a faint extender-only band "no ink" and mark its system silent under step 1.3.

Replacement text for step 1 item 1, after "the constant `cutRows` already uses":
> `'no ink'` is ruled by a threshold set in step 1 from row 114 f1's own bands: the ink share of every band whose system was written against every band that holds no text row; the step report gives both distributions and the chosen threshold with the count of bands it misclassifies on each side. A band with any text-line candidate from `cutRows` is never `'no ink'`.

### 16. Section 5 (`CONTRACT.md` §4) misses six sites

Reason, each read. Continuation: `freeNoteXs` (`omr/underlay-counts.ts:43-45`) reads `isContinuation`; `observedTargets` (`score/slur-seat.ts:62-70`); `collectScoreWords`' sustain on a note with no syllable (`score/vowel-resolver.ts:270-276`); `noSyllableCount` (`score/ingestion/fixture-rule.test.ts:83-95`, ties only, which amendment 1 must widen to the melisma pairing or its count drifts from the join's). Unread bars: `withUnreadBars` (`score/ingestion/ingest.ts:135-136`) and the console line (`omr/underlay-reader.ts:67`). The vowel set: `VOWEL` (`omr/underlay-units.ts:24`, the source `vowels-per-note.ts:39-41` builds from) and a third copy `HAS_VOWEL` in `score/phrase-ends.ts:30`, which the join's phrase ends read.

Replacement text: add those seven lines to section 5 under their headings, and under the vowel set: "`phrase-ends.ts:30` is a third copy; it is not changed by this row and the step 0 report says whether its letters equal `VOWEL`."

### 17. The `why` readers, named now so step 1 does not search

`omr/underlay-song.ts:95` (into `Unread.why`) and `:104` (the console line); `omr/underlay-reader.ts:67`; tests `underlay-song.test.ts:26, :60, :66, :80, :120`, `underlay-page.test.ts:67, :74, :89, :96, :100, :161, :174`, `underlay-integration.test.ts:59, :142`, `underlay-reader.test.ts:62`; the doc comment `underlay-song.ts:47`. The banner itself reads the merged ranges, not `why` (`unread-bars.ts`, `i18n.ts:1494-1495`). Replace the brief's "Name every site that reads `why`" with this list.

### 18. `+page.svelte` is at its ceiling and steps 5 and 6 need a hook in it

Reason. `scripts/ratchets.json:8` holds `+page.svelte` at 5586; the file is 5585 lines on `Shane` and 5586 on `cloud-lane-31`. The join must be called at the 600 ms pause and at the arrival sites (as `poem-offer.svelte.ts` is, its header), and the banner's bar links are drawn where the banner is. "Touch neither" cannot hold for a hook.

Replacement text for section 6:
> `pipeline.ts` is at 925 of 925: new files only. `+page.svelte` is at its ceiling: a hook may be added only in a commit that moves at least as many lines out of the file into a named module (the `poem-offer` shape), and the step report gives the line count before and after. `pairings.ts` 1420 of 1422: the `by` field of amendment 11 goes in a new file if two lines do not suffice.

### 19. The control and the arm measurements run on one machine in one session

Reason. The floor of 0 is "the floor of this machine and this instrument" (`report-desk-t0-t1-row114_r1_2026-11-02.md`, caveat). Arms (a) and (b) will differ by a handful of syllables; a cross-machine comparison cannot tell that from noise.

Replacement text, add to step 0 item 4: "The control and every later count in this row are taken on the same machine, in the same browser build, in one sitting; a count taken elsewhere is reported as unanchored."

### 20. Step 7 must name the artefact the scorer reads, and wait for the join

Reason. The join applies proposals through LYRICS and the seats (brief §3), not into the kept MusicXML. If the desk's scorer reads the captured MusicXML or a lyrics file written at read time (NOT ESTABLISHED: `~/Downloads/_desk-2026-11-02/m0/` is not reachable from this run), the filled syllables are invisible to it and the measure cannot move. The library fills POEM after the read and the join runs on the pause.

Replacement text, add to step 7: "The capture is taken after the library's fill and the join's pause have run (a settled DOM, the receipt line's count present); the scorer reads the seated text under the notes as Markup draws it, and the step report says which file the capture is and that it is the same artefact the 369 control was scored on. Where it is not, the control is re-taken from that artefact first."

### 21. Citation repairs

- `omr/underlay-song.ts:69-112` for `applyUnderlay`: the function is `:73-114`; `:69-71` is `barsWithNotes`.
- `omr/underlay-tokens.ts:62-64` as "tokens carry page-pixel x0, x1": those lines are the proportional split of a run-together token (the §0.2 occasion's twin). The token shape is `omr/underlay-seat.ts:76-80`; page pixels come from `pageTokens` (`omr/underlay-page.ts:156-163`).
- `WordStack.svelte:110-116` as "the dotted underline pattern": `:110-113` close a `$derived`; the provenance test is `:115-121` and the frame rule `:126-127`. No dotted underline exists in `components/Paper/` (grep "dotted": no hit). Write: "a new style after the provenance-icon pattern (`WordStack.svelte:115-127`, `:353`)".
- `omr/underlay-seat.ts:142-153`: `kindOf` is `:147-153`; `:142-145` are its patterns. Fine as a range; say so.
- Brief §2 "no code writes a poem's word into LYRICS or under a note": agreed for the files read here (`poem-compare.ts`, `poem-offer.svelte.ts:1-80`: the fill only changes Lyrics' line breaks, its header). Repo-wide stays NOT ESTABLISHED until step 0's grep.

## Taste questions for Dann

1. The print in the Loupe for every bar, or for the unread bars only (amendment 13, option (c) against (a)/(b)). Every bar costs storage or render time on each Loupe open and gives her the print beside every repaired word; unread only is what the ruling of 12:02 asked for.
2. A filled run that the count rule refuses (amendment 6): an offer she taps, or nothing until she opens the bar. Both are defensible; the offer is one more mark on the page.

## Could not establish

- Whether tesseract at PSM 7 with `rus_prereform_r2_29000` emits an underscore extender as a token at all (amendment 2); step 1 measures it first.
- Whether a POEM edit runs through the 600 ms pause that LYRICS typing uses (N.160 path 2); `+page.svelte` was not read (5,585 lines). Step 0 reads `handlePoemEdit` and says.
- What `score114.py` reads (amendment 20).
- Whether `+page.svelte` on `cloud-lane-31` already carries the `poem-offer` hooks the join would sit beside (not read).
- The Loupe component's file and how it opens on a note (the Drawer references it at `Drawer.svelte:156`, `:551`; the component itself not located). Step 0 names it.
- Whether `HAS_VOWEL` (`phrase-ends.ts:30`) and `VOWEL` (`underlay-units.ts:24`) are held equal by any test (the `underlay-units.test.ts:16` test covers `CYRILLIC_VOWEL` only).
