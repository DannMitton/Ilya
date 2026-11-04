# Brief: QUEUE row 181, joining POEM to LYRICS on a scan (Code, r1, 2026-11-04, NOT Fable-reviewed)

Written by the desk (Opus). Lines cited were read by the desk on `Shane` at `0c3977f9` on 2026-11-04 11:5x to 12:1x unless marked `cloud-lane-31:` (read there by the desk's census helper, `report-desk-row181-census_r1_2026-11-04.md`, and to be re-read by you in step 0). Every desk choice below is marked DESK DEFAULT; Dann may strike any of them. **NOT ESTABLISHED beats a complete invented answer.**

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
