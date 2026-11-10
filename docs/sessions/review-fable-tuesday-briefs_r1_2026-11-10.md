# Review: the three Tuesday briefs (Fable, r1, 2026-11-10)

For the desk. Briefs read in full: `/home/claude/brief-code-barline-and-time-signature_r1_2026-11-09.md`, `/home/claude/brief-code-word-marks-saved_r1_2026-11-09.md`, `/home/claude/brief-code-poem-library-arias_r2_2026-11-09.md`. Code read at `/home/claude/gates`, `534d9981`. Rulings read in `~/Desktop/ilya-rewrite/docs/memory/OPEN.md`, lines 3394 to 3440 and 3547 to 3591. Nothing built, committed, or pushed. Nothing written on the Mac. Two scratch measurements were run in the session scratchpad (section "Housekeeping").

| brief | verdict | amendments |
|---|---|---|
| 1. Barline and time signature | SEND WITH AMENDMENTS | 15 |
| 2. Word marks saved | SEND WITH AMENDMENTS | 10 |
| 3. Arias r2 | SEND WITH AMENDMENTS | 11 |

One amendment is common to briefs 1 and 3: the documents they make part of the brief are not in the tree Code will read (brief 1 amendment 1, brief 3 amendment 1).

---

## Brief 1: the barline and time signature corrections

### Verdict: SEND WITH AMENDMENTS (15)

The layer design holds, and "Rebar the notes" as a one-time computation into stored corrections is sound for Undo: the undo entry snapshots the whole corrections map (`undo-history.svelte.ts:45`), so one write and one push is one step. Three things in the design do not hold as written: a tie across a new barline needs more than "barline and tie corrections" (amendment 3); "Revert of the change removes them together" cannot be kept after a reload (amendment 4); and the time signature change moves numbers the brief does not name, the tempo's beat and every second of phonation (amendment 7). The brief is too large for one lane in one day as scoped; the cut order below moves "Rebar the notes" into its own step.

### Lines the brief cites, checked on the tip

| cited | found |
|---|---|
| `musicxml-parser.ts:732-734` (ids from measure and position) | holds (`:732-734`, `cursorId` at `:732`) |
| `correction.ts:317-328` (the prune list) | holds (`:317-325`, seven fields) |
| `library/types.ts:107-115` (corrections on the record) | holds |
| `types.ts:286-288` (repeat barlines) | holds (`packages/score-parser/src/types.ts:286-288`) |
| `ClefControls.svelte` pattern | holds (`apps/web/src/lib/score/ClefControls.svelte:8-22`: chip, invisible button, menu on a fine pointer, sheet on a coarse one, 44 px) |
| `omr/fixtures/` | the folder is `apps/web/src/lib/omr/fixtures/` |
| Fable's table, `+page.svelte` rows | six one-line shifts between `e4eeaa96` and `534d9981`, all below line 3981 by zero net lines; the rows I re-read (`:795`, `:804`, `:829-836`, `:948-966`, `:970-977`, `:1130`, `:4368`, `:4403`) stand |

### Amendments

1. **The review and the two surveys are not on the lane.** `docs/sessions/` at `534d9981` holds no `review-fable-barline-correction_r1_2026-11-10.md`, no `survey-barline-handling_r1_2026-11-09.md`, and no `survey-metre-change_r1_2026-11-09.md` (directory listing read this session). The brief makes findings 1 to 11, the table, and the build plan "part of this brief". Commit the three files to the lane before Code starts, or attach them to the prompt and say so in the brief's first paragraph.

2. **The time signature lives in the corrections map, decided here, not left to Code.** The brief says "Code confirms where it is stored". Undo covers `corrections` and `pairings` only (`undo-history.svelte.ts:43-46`); a field stored anywhere else is outside Undo. So `timeSignature` is a `NoteCorrection` field, and it joins the prune list with `barline` (`correction.ts:317-325`): the brief names `barline` only, and a record holding only `timeSignature` is deleted on its first write.

3. **A tie across a new barline is a note split, and the brief does not say so.** A correction amends one event or enters one (`correction.ts:48-106`); a tie joins two events of one pitch (`entry.ts:294-303`). To tie a note across a barline, rebar writes four things: a shorter length on the read note (`base`, `dots`), an entered note for the remainder (`entered.after` naming the first half, `nextEnteredId`, `entry.ts:199-208`), `tied: 'start'` on the first half, and `barline: 'before'` on the entered half. The brief's "ordinary `barline` and tie corrections" omits the first two. State them, with these cases:
   - a remainder no single value can hold (five sixteenths) becomes a chain of tied entered notes;
   - a rest that crosses is split with no tie;
   - a tuplet group that crosses a boundary ends the rebar at the bar before it (a stop, as at a key change), since `tupletFraction` gives each member the group's share (`correction.ts:622-626`) and a split member has none.
   The seats survive: a note after a tie start takes no syllable (`pairings.ts:277-303`). Test: a quarter crossing a boundary in 3/8 becomes an eighth tied to an entered eighth, the syllable stays on the first, and one Undo restores the quarter.

4. **"Revert of the change removes them together" holds for Undo only.** Rebar "is not a stored mode", so after a reload nothing records which barlines and split notes came from it, and the undo stack is empty by rule (`undo-history.svelte.ts:18-22`). Replace the sentence: Undo removes them together in the session; afterwards, setting the signature back leaves the barlines, and she rebars again or removes them by hand. A group tag on each record would keep the promise at the cost of one more stored field; not recommended for the share.

5. **Rebar can be run again without changing the signature.** The marks are frozen when written. If she then fixes a misread length inside the scope, every later barline is off by that length and the bars are flagged. The card accepts the signature already in force with "Rebar the notes" checked (Finale's Rebar Music is a utility of its own). One sentence in §3 and one test.

6. **Restore deletes the marks.** `handleRestoreNote` calls `clearCorrection`, which drops the whole record (`correction-verbs.svelte.ts:293-298`; `correction.ts:333-337`). On a note that opens a hand-made bar, "Undo my corrections to this note" (`correct.restore`, `i18n.ts:377`) would also remove her barline and her time signature. Restore keeps `barline` and `timeSignature`; the Barline verb and the card are their own undo. Test it.

7. **The sites that compute from the time signature (`CONTRACT.md` §4).** The brief changes the input to these, and none is named:
   - **the felt beat and the tempo:** `feltBeat` (`tempo-seam.ts:267-287`), `timeSignatureAt` (`:293-300`), `dominantTimeSignature` (`:440-453`), the override's default unit (`:515-517`), the tempo word's conversion (`:565`). The tempo control and MarkupPane are handed `correctedScore` (`+page.svelte:976`, `:4368`, `:4403`), and phonation is computed from it (`analysis/score-metrics.ts:119-124`). On the Gretchaninov shape, 4/8 to 3/4 moves the felt beat from the eighth to the quarter; a tempo she typed without a unit then reads in quarters and every duration in seconds doubles. That is the right answer for a misread signature, and it is a change to INSIGHTS made from the Loupe. The brief says so, and B1 tests it: one song, one typed tempo, the phonation total before and after.
   - **the bar that adds up, two fields:** `measureFill` reads `Measure.timeSignature` (`entry.ts:423-470`; callers `bars-to-confirm.ts:71`, `+page.svelte:836`); the phonation oracle reads `Measure.expectedDuration` first and `timeSignature` second (`phonation.ts:277-296`). `rebar` rebuilds both, and `isPickup`, or the Loupe clears a flag that INSIGHTS still prints (`insights.phonation.untrustedOne`, `i18n.ts:1900`). The offer's "holds %k bars" is computed from `measureFill`'s figure, never a second sum (`bars-to-confirm.ts:11-13` is the precedent).
   - **the drawn signature and the beams:** `staff-renderer.ts:727-728`, `:1952`, `:2118`; `page-layout.ts:132`, `:171`, `:243`; `loupe-fit.ts:181`.
   - **the bar answers:** the fingerprint includes the metre (`bar-answers.ts:92`), so every answered bar under a changed signature is asked again. Degrades safely; say it.
   - **the offers:** `offers-for-a-bar.ts:124`.
   - **reading-time, unchanged:** `metre-witness.ts:157-238`, `pickup.ts:31-45`, `overlay-engine.ts:259-269`.

8. **Page sites that look a measure up in the ingested score by the event's bar.** After `rebar` an event's `measureIndex` is a song bar, and these read the reading's measures: `heldMeasure` (`+page.svelte:829-833`), `keyOf` (`:873-874`), `heldMeasureLabel` (`:1043-1047`), `selectedSignature` (`:1127-1132`), `scoreClef` (`:816-819`), `phraseEnds` (`:2457`, which hands the ingested score with the pairings). My earlier table has `:804`, `:836`, and `:948-966`; these six join B2's CHANGE rows.

9. **A mark on a deleted note.** `applyCorrections` drops a deleted event from the line (`correction.ts:408-414`), so `rebar`, walking the corrected line, never meets a `barline` or `timeSignature` stored on it. `rebar` reads the marks from the map and carries a deleted entry's mark to the next entry standing. Test: delete the note that opens a hand-made bar; the barline and the signature stay.

10. **"In her order" needs two write-time rules, because the map stores no order.** The layer applies signatures, then barlines, whatever order she made them in. Two cases depend on order, and each is settled when she acts:
    - **"To the end of the song" against a later change of her own.** On write, `through: 'end'` removes her own later `timeSignature` marks in the same Undo step (Finale overwrites). A change she makes afterwards on a later bar bounds the earlier one. Then the stored state reads the same in any order. The reading's own later changes are overridden by `'end'` and bound `'next'`.
    - **Remove the barline before a bar that carries her time signature.** Hidden, as finding 9 hides it before a read change of metre. The change is removed first, from the card.
    With those two, the corrections compose in the order she makes them: a signature kept over her barlines, a barline added under her signature, and a rebar that replaces every barline in its scope (hers too, the later act winning, Undo restoring).

11. **The head caret and the time signature.** Finding 11 moves `barline: 'before'` to a note entered at the head of a hand-made bar. `timeSignature` moves with it. If B5 is cut, the head caret is hidden in a bar whose first entry carries either mark.

12. **A split bar and the repeat flags.** A `Measure` carries `repeatStart`, `repeatEnd`, and `repeatTimes` (`types.ts:286-291`). When `rebar` divides a bar, the first half keeps `repeatStart` and the last half keeps `repeatEnd` and `repeatTimes`. One line in B1 and one test; MELODY in performance order reads them.

13. **"Rebar the notes" becomes its own step, T2.** T1 is the card with "keep the barlines" and both scopes. T2 adds the checkbox, the walk, the splits of amendment 3, and the stops. The Barline verb already fixes a right signature with wrong barlines, one barline at a time, and on 37 stored readings no bar is fused (my earlier review, section 1). Whether T2 may be cut is Dann's (question 1).

14. **Undo names every verb, and the names are strings.** "So Undo names it" (my B3) needs a `loupe.undo.*` key per verb; the family is at `i18n.ts:485-529` and `:673-676`. None is in the brief's §5. Also missing: the accessible names of the card's two number fields, and a sentence for the offer on an opening or closing bar, where "This bar holds %k bars of %m." is false by the remainder (21:31 rules). Drafts are in "Questions only Dann can answer", question 2.

15. **A step 0 and a French glossary line.** Add "B-1: report the eight gates' baselines, run by you", as the other two briefs have. For the French drafts, the file already says « chiffrage de mesure » (`insights.fit.withheldOne`, `i18n.ts:1813`); « barre de mesure » is not in the file and would be coined.

### One lane, one day, and the cut order

Not as scoped. B0 to B4 with the six sites of amendment 8 and the strip conversion is most of a day. Order of build: B-1, B0, B1 (with amendments 2, 6, 7, 9, 10, 12), B2, B3, B4, T1 (pane only, keep the barlines), T2, B5, the on-score tap, A1, A2.

**Cut order, first cut first:** A2 and A1; the on-score tap; B5 (hide the head caret, amendment 11); T2 (pending question 1); the banner's renumbering. B1 to B4 and T1 are never cut.

Candour on A1's end rules: the backward and forward counts for an opening and a closing bar are the greedy fill applied at the two ends. In my simulation the greedy fill placed a wrong barline in 20,308 of 68,377 single-error cases (earlier review, section 1). Dann ruled them as an offer, and an offer is one tap and one Undo, so they stand; the offer's sentence must not assert more than the count shows (question 2).

---

## Brief 2: the Inspector's word marks are saved with the song

### Verdict: SEND WITH AMENDMENTS (10)

The record shape is right and every line in §3 holds. The brief's Step 2 is one sentence over four mechanisms it does not name: where the marks live so the document's save can see them, when they load relative to the first transcription, what the anchor is compared with, and what happens to marks when the text was typed but not yet transcribed. Each is below.

### Lines the brief cites, checked on the tip

All hold: `word-marks.svelte.ts:11-14`, `:19-27`, `:30-35`, `:38-44`; `+page.svelte:438-439`, `:464`, `:445-446`, `:1807-1808`, `:1760-1761`, `:1856-1860`, `:2190-2195`, `:2354`, `:3129`; `library.ts:84-96`, `:111-112`, `:142-146`, `:162-163`; `types.ts:211`, `:232`.

### The four interactions asked about

- **`carry()`.** The first transcription of an opened song diffs from an empty grid as unchanged (`+page.svelte:1911-1915`, `emptyDiff()`), so `carry` does nothing and loaded marks keep their keys. That is safe only if the stored marks and the stored text describe the same words. They can part: the text is saved as typed, the marks are re-keyed when the quiet pause transcribes (`:2007`, called from `transcribeText`), and a song switch cancels a pending pause (`:3138`, `cancelQuietTimer()`). Amendment 4.
- **The poem witness.** A Poem edit carries its marks at once (`witness-lines.ts:136-137`, from `+page.svelte:2354`), so the Poem has no such gap. The Poem's anchor check can run at open, since its text is on the record.
- **The open-syllabification clear.** One site, `+page.svelte:2190-2195`, and the setting is the song's own (`doc.openSyllabification`), so saved syllable marks and the setting they were made under travel together. No miss.
- **The anchor check.** The gloss check runs after the pipeline, on `lines` (`gloss-survival.ts:19-36`). Stress and ё marks are inputs to the pipeline (`+page.svelte:1807-1808`), so the marks' check runs before it and on the raw text. Amendments 2 and 3.

### Amendments

1. **The document owns the marks.** The save is an effect inside `SongDocument` over its own fields (`document.svelte.ts:218-253`), and the record is built from its snapshot (`:300-315`, `:332`). The two `WordMarks` are page constants (`+page.svelte:438-439`) the effect cannot see, so "the record builder writes the field from both instances" has no path. Move the two instances onto the document (DESK DEFAULT recommended), so `close()` flushes the outgoing song's marks before the next document exists (`+page.svelte:3111-3113`) and a switch cannot write one song's marks into another. A page effect that mirrors the maps into the document is the alternative; it must be shown not to fire between `:3128` and the assignment of the new document. Test either way: mark song A, switch to B, switch back; A has its mark and B has none.

2. **Loading does not save.** "A new Map is a change to the autosave effect, so assigning always saved every song on open" (`gloss-survival.ts:16-18`). The marks are set inside `#apply`, where the other fields are and where the save effect stands down (`document.svelte.ts:350-377`, the `#applying` guard at `:248`), and the anchor check assigns only when it dropped a row. Test: open a song with marks and close it; `updatedAt` is unchanged.

3. **The anchor is the text's word, ё folded, and it is checked before the first transcription.** A ё toggle changes `cleanWord` (`pipeline.ts:203-208`), so an anchor taken from `lines` after the pipeline fails against the stored text and a restored «ё» would drop its own stress mark on reload. Write and check the anchor from `wordGrid(text)` (`pipeline.ts:212-217`) through `glossAnchorForm` (`gloss-survival.ts:11-13`); `witness-lines.ts:88-108` is the same check on a text. The order matters twice: stress and ё marks feed `processText`, and a clitic promoted by a stress mark (`word-marks.svelte.ts:55-60`) changes the slot queue the stored seats were made against (`+page.svelte:1759-1761`; `pairings.ts:990`), so marks loaded after the first transcription would let the heal at `:1934` judge the seats against the wrong lines.

4. **Close the pause gap at save.** When the record is built, if `wordGrid(doc.inputText)` differs from the transcribed grid, the Lyrics rows are written through `rekeyByWord` and `rekeyByWordChar` over that diff (`text-diff.ts:238`, `:261`; both pure), leaving the live maps alone. Otherwise a mark made, a line typed above it, and a reload inside the pause lands the mark on another word, and the anchor check then drops it. The brief's own test ("edit the text so a word moves, save, reopen, the mark follows it") passes only if the pause fired first; add the case where it did not.

5. **Lyrics that come from the score.** With an empty Lyrics field, Text transcribes the score's own words (`derivedPoem`, `+page.svelte:435`, `:440-452`) and `lyricsMarks` key to them. Those words exist only after the stored scan is read again, after open. For such a song the Lyrics anchor check waits until `scoreText` is known, and until then the marks are held, not applied and not dropped. A re-read that changes a word drops that word's marks by the anchor, which is right.

6. **Three ways a song opens, and two clears that stay.** Boot builds the document from `data.opened` (`+page.svelte:249-262`) and calls no `clear()`; `switchSong` (`:3116-3141`); and the document's own reload of a record (`document.svelte.ts:391-398`). All three load. `handleClear` still clears Lyrics' marks (`:2081-2091`, through `resetSessionState`), and `handleNewSong` (`:3162`) starts empty. "In place of `clear()`" names one of five.

7. **`recordFromFields` drops the old field before it writes.** Its destructuring removes each optional field from `base` (`library.ts:141`) and writes it back only when present. `wordMarks` joins that list, or a song whose marks were all removed keeps the old rows from `base`. Stored only while a row exists, the pattern at `:162-169`.

8. **`validateRecord` checks the value by kind.** `stress`: `stressIndex` a non-negative integer, `stressSource` one of three (`apps/web/src/lib/types.ts:20-25`). `yo`: a three-part key and a `source` (`:28-30`). `syllables`: `boundaries` an array of non-negative integers (`:33-40`). `spot`: `true`. A row that fails is dropped alone, as the brief says.

9. **Comments that now state the opposite.** `word-marks.svelte.ts:12-14`, `:20`, `:26` ("Ephemeral"); `library/types.ts:206-208` ("The poem's stress, ё, syllable, and spot marks are session state"); `+page.svelte:436-437`, `:1845-1849`, `:1996-1997`. Each is corrected in the step that makes it false.

10. **Step 0 reports two things more.** Whether the poem join rewrites Lyrics at open (I did not trace it; a rewrite at open is an edit, and it must reach `carry` like any other). And what the binder does with a record field it does not know (the import path through `validateRecord`).

### One lane, one day, and the cut order

Yes, with amendment 1 as the first commit after Step 0. Order: Step 0; the document owns the marks (no behaviour change, gates green); Step 1; Step 2 with amendments 2 to 7; Step 3; Step 4. **Cut order:** the binder test of Step 3 (the field rides the record either way); nothing else. No string is needed.

---

## Brief 3: 89 aria texts into the poem library (r2)

### Verdict: SEND WITH AMENDMENTS (11)

r2 applies all twelve of my amendments, four with residue (below). The data passes the build as stated: I ran `check-aria-r2.mjs` against the tip and it reports 0 failures, 89 plus 14 entries, 492,927 bytes, `dictionary.poems.ed64d4a5.json`; the file's md5 is `b8706cf9b642f24db14501010595bfa2`. I also ran the matcher (`poem-match.ts`, bundled unchanged) over the merged file: each of the 89 arias, given its own `textModern` as Lyrics, fills its own entry (lowest margin 0.944); the twelve fixtures answer as they do today (nine fill the same poem, three refuse for a low score). Step 7's expectations are met before Code starts.

### The twelve amendments, against r2

| # | amendment | r2 |
|---|---|---|
| 1 | data r2 first, md5 in the brief | applied; md5 matches |
| 2 | ids and works for all; why per opera; the cost | applied (29 works, no id repeats, no work shared with the 14) |
| 3 | non-sung text out of `textModern`; build checks | applied in the data; the build's checks need a scope (amendment 4 below) |
| 4 | one role's lines; cuts recorded in the trail | lines cut in 18 entries; **the per-entry record of what was cut is not in `provenance.notes`** (Pimen's reads "Pushkin's drama dates from 1825…"). `textEdition` keeps the uncut copy, so the cut can be derived |
| 5 | the pre-reform entry | applied («Ариозо Кумы», `spelling: 'pre-reform'`, modern `textModern`) |
| 6 | no DOUBTFUL entry ships | applied (13 resolved with a trail, 2 dropped, 1 held) |
| 7 | provenance normalized; composer a key | applied; "working fields" is not defined (amendment 3 below) |
| 8 | `source.site` a short key | applied (operalib.eu 60, FEB 9, Russian Wikisource 20) |
| 9 | translator | moot: both Judith entries are dropped; `translator` null on 89 |
| 10 | the tests the growth moves | applied; three more pins (amendment 6 below) |
| 11 | the threshold both ways | applied; "nine held-out fixtures" is my error (amendment 7 below) |
| 12 | the byte count | applied; the figure will be higher after step 1 (amendment 8 below) |

### Lines the brief cites, checked on the tip

All hold: `build-poem-library.mjs:100-147`; `poem-library.ts:27-45`; `poem-site.ts:11-19`; `poem-match.ts:54`, `:217`, `:238-257` (the brief says `:243-251`, the body), `:296-297`; `poem-offer.svelte.ts:111`; `poem-library.test.ts:99`; `poem-match.test.ts:142-158`, `:383-384`.

### Amendments

1. **The documents the brief leans on are not on the lane.** `docs/sessions/` at the tip has `brief-code-poem-library-arias_r1_2026-11-08.md` and neither `review-fable-three-briefs_r1_2026-11-09.md` nor `report-aria-r2_r1_2026-11-09.md`. Commit or attach them. See also question 5 before committing the review.

2. **`work` per opera breaks one fallback the brief does not name.** `resolveSource` finds a stored source's entry by `id`, and where a later library has dropped the id, takes "a modern entry of the same `work`, else any" (`poem-source.ts:166-168`). That was written for a pre-reform and a modern text of one poem (`poem-library.ts:28`). With an opera as the work, a song filled from Lensky's aria whose id later changes (the id is a hash of the first sung line, so a corrected first line changes it) would have its card name another Onegin aria. For a `kind: 'libretto'` entry the fallback returns null, and the caller falls back as it does for a missing work. Test it. The other readers of `work` are sound per opera: the shortlist and the rank (`poem-match.ts:213-231`, `:243-255`), the decline key (`poem-offer.svelte.ts:76`, `:111`, `:187`), and the stored source (`library.ts:303-307`).

3. **Say which provenance fields stay.** The data carries sixteen provenance keys. `contributorDates`, `url_people`, and `pageNamesTextContributors` are the rights evidence on the 69 entries that carry them (13 entries have a `rightsTrail`); dropping them as "working fields" would leave rule 5 with no trail for most of the library. Step 3 drops nothing more from `provenance`; the checker's trace test (its part d) becomes a build check over `library.json`. Step 1's `opera` object is mapped, not authored: `composer`, `opera_ru`, `opera_en`, `voice`, and `literary_source` from `provenance`; `librettists` is the entry's `author` string as it stands. `provenance.role` holds the number's English name ("Pimen's Aria"), not a role, so the field is named for what it holds.

4. **The furniture checks apply to libretto entries only, and the roles table comes with them.** A poem may carry an author's own parentheses, and the checker's two unwrapped cases («(как знать?)») show a libretto can too; a build-wide rule against a parenthetical run would refuse a future poem. Scope the new checks to `kind: 'libretto'`. The role-name check depends on the checker's `ROLES` table (29 operas, `check-aria-r2.mjs:53` on); the brief says the table moves into the build beside the check.

5. **Step 5, the Poet field, has no value to fill.** The fill matches "Surname, Given" in English against `COMPOSERS` and `POETS` (`composers-poets.ts:156-181`), and those are the only forms that reach storage. Every entry's `author` is a Russian full name with patronymic, 21 distinct strings in the arias and 7 in the 14 poems («Константин Степанович Шиловский и Пётр Ильич Чайковский»); none matches a `POETS` key, and most librettists are not in `POETS` at all. As written, step 5 puts an unmatched Cyrillic string into Poet, and PAPER prints it raw in both languages. For the share: step 5 fills Title and Composer; Poet fills only where the data carries a `poetKey` that is a `POETS` key (the desk adds it for the authors already in the list, Pushkin and Polonsky among them), and stays empty otherwise. Step 5 also says:
   - what tag a library-filled field shows, since it is neither typed nor "from score" (`metadata-provenance.ts:10-18`, `:42-48`), and what a later score header does to it (`:20-28`);
   - the three moves of the fill: the fill; "Not this poem", which empties only the fields still holding what the fill put there (`poem-offer.svelte.ts:187` keeps what was removed, and grows by these fields); and Undo, which fills them again.
   `metadata-provenance.ts` is missing from step 0's reading list.

6. **Three more pins.** `poem-library-strings.test.ts:36` holds the ratified table at thirteen keys; step 4's two site strings make fifteen and need their ratified text in the table. `apps/web/e2e/poem-library.test.ts` pins the card on row 114 song 2. `loader-poems.test.ts:15` builds its own poem file and is unaffected; say so. The old `data/dictionary.poems.2e56f692.json` is removed when the new file is written.

7. **"Nine held-out fixtures" is my error, carried into r2.** `tools/poems/fixtures/` holds twelve `.lyrics.txt` files, seven outside row 114. Step 7 reads: all twelve answer as `expected_r1.txt` says they do today.

8. **The byte figure Dann hears.** 492,927 is the build before step 1. The `kind` and `opera` fields add about 27,000 bytes over 89 entries (summed this session from the data), so about 520,000.

9. **Report the time, not only the bytes.** The matcher runs where it is called, with no worker (`poem-offer.svelte.ts:106`). The library's letters grow from 19,547 to 71,041. In Node on this machine the twelve fixtures take 33 to 167 ms each against the merged file, and the longest text in the library (15,173 letters) takes 4.4 s against 1.4 s today. Step 7 reports the time for the longest aria's Lyrics on the phone project, before and after. No change to the matcher is asked for.

10. **Two strings behind a failing test contradict step 8.** Step 4 seats the two site strings as `TODO` "behind a failing test until the desk sends Dann's ratified text"; step 8 asks for all eight gates. Ratify the two lines before the lane starts (question 4), or step 4 waits and the card prints the data's own short key, "operalib.eu" and "FEB", which `siteName` already does for a site with no key (`poem-site.ts:16-19`).

11. **Small corrections.** Step 4's heading says "three composers" and names two (Serov left with the Judith entries). "The card names the opera's text" in "What the singer gets" is built by no step: the card prints the entry's title, its author, and the site (`i18n.ts:877-890`; `intake.view.libraryPoem`). Strike the sentence or see question 3. The r1 data file is still tracked at `tools/poems/arias-for-library_r1_2026-11-08.json` (commit `ddba4c38`) with the two traces my earlier review named; step 3 removes it from the tree (question 5 for the history).

### One lane, one day, and the cut order

Yes for steps 0 to 4 and 6 to 8: the data is clean and both threshold tests already pass. Step 5 is the only new behaviour and the only step with open design. Order: 0, 1, 2, 3, 4, 6, 7, 5, 8. **Cut order:** step 5's Poet, then all of step 5 (the arias still fill POEM; the fields stay as she left them), then step 4's two strings (amendment 10's fallback). Steps 1 to 3, 6, and 7 are never cut.

---

## Questions only Dann can answer

1. **May "Rebar the notes" be cut if the day runs short (brief 1)?** Your 21:47 ruling asks that the controls fix either case. With the Barline verb she can fix a right signature with wrong barlines one barline at a time; "Rebar the notes" does it in one act. Recommendation: build it as its own step after the card and the verb, and cut it before the card if Tuesday runs out. Cost of cutting: a fused passage takes one tap per barline. Cost of keeping it uncuttable: the note-splitting is the riskiest part of the build, on the day before the freeze.

2. **Strings, brief 1 (English first, then French).** The six drafts in the brief's §5, and these, which the brief lacks (keys and drafts coined here, in the `loupe.undo.*` family's own shape):
   - `loupe.undo.barlineAdded` "barline added"; `loupe.undo.barlineRemoved` "barline removed"
   - `loupe.undo.timeSignature` "time signature changed"
   - `loupe.undo.divided` "bar divided"
   - the two fields of the card: "Beats" and "Beat value" (coined; Finale's dialog words were not read this session)
   - the offer on an opening or closing bar, where the count is not exact: "This bar holds more than %k bars of %m." (coined), or one sentence for both cases
   French sources in the file: « chiffrage de mesure » (`i18n.ts:1813`), « mesure », « ajouté », « retiré », « modifié » (`:486-488`, `:674-675`). « Barre de mesure » is not in the file.

3. **Aria titles and the card's words (brief 3, taste).** Twenty titles are Russian («Сцена письма Татьяны (Евгений Онегин)») and 69 are English with a Russian opera ("Hermann's arioso (Пиковая дама)"); two pairs repeat ("Marfa's Aria (Царская невеста)", "Hermann's arioso (Пиковая дама)"). The card and the quiet line print the title, and step 5 would put it in Title. The card also says "Ilya found this poem for your song" and "Not this poem" for an aria. Ship as they are, or hold step 5's Title fill until the titles follow one rule? Recommendation: ship the texts and the card as they are, and hold the Title fill.

4. **French, brief 3.** The two site lines from my earlier review, still unratified: `intake.poemLibrary.site.operalib` EN "operalib.eu" / FR « operalib.eu »; `intake.poemLibrary.site.feb` EN "the Fundamental Electronic Library (feb-web.ru)" / FR « la Bibliothèque électronique fondamentale (feb-web.ru) » (the French name is coined). And the two composers' French forms, which the brief marks DESK DEFAULT: 'Verstovski, Alexeï' and 'Nápravník, Eduard' (a Czech spelling standing as the French form).

5. **A saved spot reconstitution means "the opposite of the setting" (brief 2, taste).** The mark inverts the app-wide Reconstitution setting (`InspectorPanel.svelte:49-55`), and that setting lives on the device, not on the song (`+page.svelte:1540-1546`, `:2175-2177`). Saved as it is, a word she marked to be reconstituted reads reduced if she later turns the setting on, and a colleague who imports her binder sees it by their own setting. Recommendation: save it as it is for the share (it is what the Inspector does in a session today), and decide afterwards whether a saved mark names the reading itself.

---

## What I could not establish

- **Brief 1.** Whether a bar where the voice is silent has an entry to carry a mark: I did not read what the reader writes for a tacet bar; B0 reports it. Whether `validateRecord` keeps an unknown `NoteCorrection` field (still unread beyond `library.ts:300-330`). The renderers, the print strip files, and `CorrectionSurface.svelte` beyond `:655-700`. Finale's own dialog words for the card. Whether the tempo's change under a corrected signature surprises on a real song: stated from the code, not walked.
- **Brief 2.** Whether the poem join or the poem offer rewrites Lyrics or Poem at open. The binder's export and import code. How `handleNewSong` and a binder import reach the page's marks. The document's reload path (`document.svelte.ts:391-398`) beyond its guard lines.
- **Brief 3.** Whether Dann ruled the empty-field fill: `QUEUE.md:134` quotes him on adding the texts only, and the row's "empty-field fill" is the desk's wording. The texts themselves against their sources: not read. Twenty `textModern` end without closing punctuation by a crude test (the r2 report says twelve end mid-phrase); not examined. Whether the remote is public today: not checked. Match time on a phone: measured in Node only. `PoemLibraryCard.svelte`, `MetadataFields.svelte`, and `reference_sw_match.py`: not opened.
- **All three.** The cost of each lane: no estimate row for a Code build was found in my earlier review, and I did not reopen `ENVIRONMENT.md`.

## Housekeeping

- Scratch, in the session scratchpad `/tmp/claude-0/-home-claude/44613f83-37e8-5e9d-a26a-acdf71654029/scratchpad/`: `poem-match.mjs` (the tip's `poem-match.ts` bundled by the repository's own esbuild), `measure.mjs`, `m2.mjs`, `m3.mjs`. Nothing in `/home/claude/gates` or on the Mac was touched.
- Terms coined in this review: T2 (the step), `poetKey`, B-1, and the string keys and drafts of question 2. Adopted: every other name is the briefs' or the tree's.
- Corrected error: my earlier review's "nine held-out fixtures" (three-briefs review, amendment 11). The tree holds twelve fixture files, seven outside row 114.
