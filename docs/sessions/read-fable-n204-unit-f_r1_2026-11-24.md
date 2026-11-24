# read-fable-n204-unit-f_r1_2026-11-24

**N.204 step 4, unit f: the seating, the page, and the score controls.** Judgement read by Fable under `brief-fable-n204-unit-f_r1_2026-11-24.md` and `plan-code-audit-maintainability_r9_2026-11-23.md` (md5 `6d0cd1e1`, confirmed this session). Tree: `Shane` at `50315f2e`, confirmed with `git rev-parse HEAD`.

**Nothing in the repository was changed except this file.** No gate was run. No subagent was spawned.

**Conventions in this report.** A path with no folder is under `apps/web/src/lib/score/`. Every claim about the code carries a `path:line` read this session. A claim that rests on a run carries the word "ran". **Only two things were ran: the colour census script and `grep`.** The app's own tests could not be run from the bridge (section 8), so every behaviour claim here is read, not ran, and says so.

**Terms.** Adopted from the tree: seat, slot, queue, fold, layer, reading bar, song bar, mark, opener. Coined here, for this report only: "the waiting trio" (three modules nothing calls yet), "the overlay kit" (the shared parts of the three floating cards), `pairingFromSlot`, `standingOwners`, `withoutMark` (proposed function names, the desk's to approve).

---

## 1. The developer's paragraph

**In a musician's terms.** This unit is the part of Ilya that decides which syllable stands under which note, and the small controls a singer uses to correct what the page says about the music itself. A song arrives as a file or a scan. Ilya reads its notes, and either copies the words the file already carries under them or lays the singer's typed poem under the notes one syllable per note. From then on the singer owns the result: she can move a syllable, mark a note as a melisma, clear a bar, or edit the poem, and each edit moves only what it has to. Around that sit four correction controls for what a scan often gets wrong: the clef and octave, the time signature, the key signature, and the barlines. One rule governs all of it: a note takes exactly one vowel.

**In the code's terms.** The centre is a sparse map from a note's id to what the singer decided it carries (`pairings.ts:122-135`). It is fed by a queue of slots built from the transcription, where a vowelless word is already fused to its host (`pairings.ts:204-253`, `slot-pieces.ts:47-71`). Eight writers copy a slot onto a note: the first pass (`pairings.ts:329`), a hand placement (`pairings.ts:1372`), the refresh (`pairings.ts:447`), the re-seat after a poem edit (`reseat.ts:147`), the score's own words (`score-seat.ts:107`), the clitic seat (`clitic-seat.ts:382`), the heal (`heal.ts:453`), and place-from-here (`placement-scope.ts:112`). A second family draws from the map without writing (`pairings.ts:977`, `:802`, `:1093`). The arrival seam is `ingestion/ingest.ts:221`, where every file is detected, parsed, and repaired for the vowel rule (`ingest.ts:337`). The barline, time signature, and key signature corrections are a layer applied over the reading and never a change to it (`rebar.ts:9-15`, `key-signature.ts:8-11`, `bar-layer.ts:52-71`). Four small singletons carry the controls' state to components two levels down (`barline-ui.ts:28`, `clef-ui.svelte.ts:114`, `key-signature-ui.svelte.ts:68`, `time-signature-ui.svelte.ts:92`).

**What a newcomer most needs to know.** The same few facts are written out many times in this unit, and several pairs of functions must agree with nothing checking that they do. Sections 3 and 6 list them. The two files at their size ceilings are `pairings.ts` (1,421 of 1,422) and `ScoreUploader.svelte` (865 of 867), `scripts/ratchets.json:17` and `:19`.

---

## 2. Findings

**Count by tier: tier 4, five; tier 3, two; tier 2, fourteen; tier 1, twenty-one. Total forty-two.**

**Blockers under ONE VOWEL PER NOTE: none raised by any proposal here.** No refactoring in this report changes which text reaches a note. One existing condition that meets `CONTRACT.md` section 0.1 head-on is reported as F4-1, and the desk may wish to treat it as a blocker of its own.

### Tier 4: behaviour defects, in the order a singer meets them

Each is its own lane. None is refactoring.

**F4-1. A file that gives a clitic its own note is repaired two ways, and the way Dann ruled can no longer run.**
- **Anchors:** `foldVowelessSyllables` (`ingestion/vowelless-fold.ts:83`) and `findCliticFolds` (`clitic-seat.ts:146`).
- **What a singer reads differently.** Take a Finale export that sets «в» alone on a note and «бью» on the next. Today the arrival joins them as «в бью» on the SECOND note and leaves the first note with no syllable; every later syllable stays where the file put it, one note later than the print, to the end of the song. Under Dann's ruling of 2026-09-04 the first note takes «в бью», every later syllable closes up by one note, and the page matches the print.
- **How it was established (read, not ran).** Every arriving score passes `withVowelPerNote` (`ingest.ts:337`, `:369-374`). That fold empties the clitic's own note and joins its text to the host (`vowelless-fold.ts:115-122`) and states that "no later syllable moves" (`vowelless-fold.ts:18-19`). The clitic seat looks for a word whose single cell holds no vowel (`clitic-seat.ts:268-269`). After the fold no such cell exists in a Cyrillic verse, so `foldAt` returns null for every word and `seatCliticFolds` (`clitic-seat.ts:455-465`) returns its input. Every call in the page hands it the ingested score: `apps/web/src/routes/+page.svelte:561`, `:687`, `:690`, `:2007`, `:2730`, `:2874`.
- **Why the tests do not show it.** The clitic tests read the lone-«в» fixture straight from the parser, never through the arrival seam (`row108.support.ts:37-40`, `:43-49`).
- **Three rulings meet here, and the desk rules which governs.** (1) Dann 2026-09-04, the clitic's note takes the fused slot and the tail closes up (`clitic-seat.ts:23-31`, `score-seat.ts:43-45`). (2) The desk ruling of 2026-10-29 that a clitic always joins its host and its note is left empty, because the close-up is "the cascade `CONTRACT.md` §0.1 forbids" (`apps/web/src/lib/omr/underlay-clitics.ts:41-46`). (3) Dann 2026-11-02 14:34, a sung note that carries no syllable and is not a continuation is a mistake, counted by the same check (`docs/memory/CONTRACT.md:11`). Today's arrival produces exactly the state ruling 3 calls a mistake, and nothing on the file path counts it: `vowelsPerNote` runs only on the scan path (`apps/web/src/lib/omr/underlay-page.ts:424`).
- **Consequence for the refactoring pass.** If ruling 2 governs, about 250 lines of `clitic-seat.ts` and the page's `cliticFolds` wiring (`+page.svelte:560-570`) are unreachable and become tier 1. If ruling 1 governs, the arrival fold must leave a proclitic for the seat. **Nothing is deleted until the desk says which.**
- **Proof of behaviour:** a new test that runs the lone-«в» fixture through `ingestScoreFile` and then `seatCliticFolds`, pinned to whichever ruling stands.

**F4-2. A key change set on a bar is lost when the bar's first note is deleted; a time signature set the same way is kept.**
- **Anchors:** `marksIn` (`key-signature.ts:46-54`) against `effectiveMarks` (`rebar.ts:131-168`).
- **What a singer reads differently.** She sets three sharps from bar 9, then deletes the wrong note that opens bar 9. The key change disappears from the page. Had she set 6/8 there, it would have stayed.
- **How it was established (read, not ran).** `marksIn` skips a record that is deleted (`key-signature.ts:49`) and a record whose entry is not in the line (`key-signature.ts:50-51`). The time signature layer carries a deleted entry's mark to the next entry standing (`rebar.ts:156-166`), by a stated principle: "the singer deleted a note, not the bar" (`rebar.ts:28-29`). `key-signature.ts:4` calls itself the sibling of `time-signature.ts`. `key-signature.test.ts` holds no line containing "deleted" (ran: `grep`).
- **Risk:** low. **Proof:** a characterization test of today's result first, then the lane's before and after.

**F4-3. A vowelless word that ends a line of the poem may vanish from the underlay.**
- **Anchor:** `buildSlotQueue` (`pairings.ts:204`).
- **What a singer may read differently.** A line that ends in «в», «к», or «с» (an enjambed line) would lose that letter from the syllable tray and from the next syllable's IPA.
- **How it was established (read, not ran).** The waiting proclitic text is reset at the top of each line (`pairings.ts:209-210`) and a proclitic is held there until the next nucleus in the same line (`pairings.ts:226-227`). The comment says a clitic never reaches across a line break (`pairings.ts:207-208`). **Whether the pipeline flags such a word `isProclitic` at a line end is NOT ESTABLISHED** (`pipeline.ts` is another unit). If it does not, `pairings.ts:220` treats the word as an enclitic and nothing is lost.
- **Proof:** one test with a two-line poem whose first line ends in «в».

**F4-4. The reading-failure message for a picture is written in the component, not in the string table.**
- **Anchor:** `readAsPoemByOcr` (`ScoreUploader.svelte:377-382`).
- **What a singer reads differently:** nothing today. The message is chosen by `language === 'en'`, so any language that is not English reads the French sentence.
- **Lane note.** The French sentence is moved verbatim; a change to its wording is Dann's. The comment at `ScoreUploader.svelte:353-359` records that the literals came from `RootPanel.svelte` unchanged.

**F4-5. The tap areas over a drawn time signature do not resize when the pointer type changes.**
- **Anchor:** the pointer effect in `TimeSignatureControls.svelte:89-95`.
- **What a singer reads differently:** on a tablet that gains or loses a mouse mid-session, the tap areas keep their old size until the next scroll, resize, or redraw.
- **How it was established (read, not ran).** The clef overlay re-measures on a pointer change (`ClefControls.svelte:87-90`); the time signature overlay's effect sets `coarse` and schedules nothing (`TimeSignatureControls.svelte:91`), while `measure` reads `coarse` (`TimeSignatureControls.svelte:48`).
- **Risk:** trivial. Smallest of the five.

### Tier 3: the two ratcheted hotspots

The plan holds that a hotspot is split toward the framework chosen at step 7, never because its ceiling is full (plan section 3). So these name the seams the files already draw, not where to cut.

**F3-1. `pairings.ts` holds four jobs.** Its own banner comments mark them: the queue (`:137`), the first pass and the merge (`:255`, `:345`), the refresh (`:404`), the melisma (`:486`), storage (`:688`), the drawing step (`:879`), the shift verbs (`:1169`). **Smell:** Large Class, Divergent Change. **Refactoring:** Move Function along two lines the code already keeps apart: what the map IS and who may write it, against what each seated note DRAWS (`drawPairings` says it "is read and never mutated", `:967`). **Risk:** medium; the file has more than thirty importers. **Proof:** `pairings.test.ts`, `draw-pairings.test.ts`, `shift-lyrics.test.ts`, `punctuation-slot.test.ts`, `queue-vowel-per-note.test.ts`, unchanged and passing. **Room without a split:** the tier 1 deletions F1-1 to F1-3 remove about 130 lines, and 691 of its 1,421 lines are comment (ran: `grep`).

**F3-2. `ScoreUploader.svelte` holds an engine inside a component.** The routing (`take`, `:198-233`), the two poem routes (`:312-409`), and the error-to-copy table (`classify`, `:552-611`) are logic with no test, because the component is inert under vitest (`format-label.ts:12-13` says so of the same file). **Smell:** Large Class, logic in the view. **Refactoring:** Move Function. `classify` becomes a pure function returning a string key and its argument, as `scanNotice` already does (`ingestion/ingest.ts:115-121`); the route becomes a getter class on the pattern of `BarLayer` (`bar-layer.ts:10-14`). **Risk:** medium; the phone and desktop suites drive this path. **Proof:** a characterization test of `classify` over every `IngestError` code first (`ingestion/ingest.ts:183-193`), then `ingest.test.ts` and the e2e suites. **Room without a split:** 196 of its 865 lines are comment, most of it a record of what left the file (section 4).

### Tier 2: moves across modules

| # | Anchor | Smell | Refactoring | Risk | Proof |
|---|---|---|---|---|---|
| F2-1 | `gcd`, `frac`, `add`, `sub`, `cmp` at `rebar.ts:86-104`, `rebar-notes.ts:31-44`, `offers-for-a-bar.ts:84-93` | Duplicated Code | Extract Module (one fraction module) | **Medium: the three `gcd` differ at zero and on sign** (`rebar.ts:87`, `rebar-notes.ts:32`, `offers-for-a-bar.ts:84`) | Characterization tests of each caller's zero and negative cases first; then `rebar.test.ts`, `rebar-notes.test.ts`, `offers-for-a-bar.test.ts` |
| F2-2 | the slot's key, built at `pairings.ts:450`, `:458`, `:998`, `:1004`, `reseat.ts:48`, `heal.ts:158`, `:190`, `:460`, `:466`, `placement-scope.ts:95` | Duplicated Code | Extract Function, exported from `pairings.ts` | Low | Existing suites; one new test that `wordKey(l, w)` plus `-s` equals the slot key, which `reseat.ts:201` relies on |
| F2-3 | the slot-to-pairing literal at `pairings.ts:334-340`, `:472-478`, `:1381-1387`, `reseat.ts:216-222`, `:314-320`, `heal.ts:469-475`, `clitic-seat.ts:385-391`, `score-seat.ts:145-154` | Duplicated Code | Extract Function (`pairingFromSlot`) | Low. **It also gives the vowel rule one place to stand for every typed writer** | `queue-vowel-per-note.test.ts` and each writer's suite |
| F2-4 | the carry rule, three times: `rebar.ts:147-166`, `time-signature.ts:73-92`, `rebar-notes.ts:95-114` | Duplicated Code, Shotgun Surgery | Extract Function (`standingOwners`) | Medium: the three walk the same line and return different shapes | `rebar.test.ts`, `time-signature.test.ts`, `rebar-notes.test.ts`, `entry-after-rebar.test.ts` |
| F2-5 | `withBarlineMark` (`rebar-notes.ts:78-86`) is `withBarline` (`barline-marks.ts:57-65`) line for line; `withoutTimeSignature` (`time-signature.ts:115-122`) and `withoutKey` (`key-signature.ts:149-156`) are the same shape | Duplicated Code | Remove the copy; Parameterize Function (`withoutMark`) | Low | The four suites named in F2-4 and `key-signature.test.ts` |
| F2-6 | "one pipeline word, or two": `vowel-resolver.ts:508-521` and `clitic-seat.ts:208-217` | Duplicated Code; the second says it is the first's rule (`clitic-seat.ts:173-175`) | Extract Function | Low | `vowel-resolver.test.ts`, `clitic-seat.test.ts`, `score-seat.test.ts` |
| F2-7 | a verse's entry on a note: `vowel-resolver.ts:210-221` and `ingestion/vowelless-fold.ts:49-55` | Duplicated Code | Move Function to the one the parser package holds (`packages/score-parser/src/verses.ts:50`, seen by `grep`, not read) | Low | `vowel-resolver.test.ts`, `vowelless-fold.test.ts`, `sunless-verses.test.ts` |
| F2-8 | the vowel letters: `phrase-ends.ts:30` repeats `vowel-resolver.ts:159`; `pairings.ts:870` is a third list, without ѣ, і, ѵ | Duplicated Code | Replace with the one export | **Low, with one caution: the letter set must not change.** `VOWEL` is held equal to `CYRILLIC_VOWEL` by a test (`apps/web/src/lib/omr/assert-vowel-per-note.ts:15-17`) | `phrase-ends.test.ts`, `pairings.test.ts`, `underlay-units.test.ts` |
| F2-9 | the overlay kit: `portal` at `ClefControls.svelte:162-165`, `TimeSignatureControls.svelte:111-114`, `KeySignatureCard.svelte:41-44`; the coarse-pointer effect at `:85-101`, `:89-95`, `:22-28`; the card and sheet styles at `ClefControls.svelte:266-299`, `TimeSignatureControls.svelte:202-232`, `KeySignatureCard.svelte:81-93` | Duplicated Code | Extract Function (a shared action), Extract Component | Medium: the e2e suites read the `data-` handles | `e2e/clef-controls.test.ts`, `e2e/key-signature-card.test.ts`, the phone suites |
| F2-10 | `compound` (`offers-for-a-bar.ts:105-106`) copied from `triplets.ts`, which now exports it (`apps/web/src/lib/omr/triplets.ts:193`) | Duplicated Code; the stated reason has lapsed | Replace with the import | Low | `offers-for-a-bar.test.ts` |
| F2-11 | `ingestion/mini-dom.ts` is test support (its own header, `:2`; 52 test files import it, none other, ran: `grep`) under a production name | Misplaced file | Rename File to the `.support.ts` form `row108.support.ts` uses | Low, wide: 52 imports | The whole unit suite |
| F2-12 | `PlacementControls` and `BreakControl` (`placement-scope.ts:34-54`) are a component's props, in a file that calls itself pure (`placement-scope.ts:7`) | Misplaced type | Move to the Loupe's module | Low | `pnpm check` |
| F2-13 | the uploader picks its label and its warm-up by file NAME (`ScoreUploader.svelte:439-447`); dispatch picks by content and then name (`ingestion/format-detection.ts:23-28`, `:191-196`) | Two homes for one decision | Substitute the detected format | Low | `format-detection.test.ts`, `ingest.test.ts` |
| F2-14 | two parameters nothing reads: `page` on `oningested` (`ScoreUploader.svelte:98-101`, "Always `undefined`"), and `p` on `noLyricsNoticeKey` (`ingestion/ingest.ts:84-85`) | Dead parameter | Change Function Declaration | Low; the first touches `+page.svelte` | `no-lyrics-notice.test.ts`, `pnpm check` |

### Tier 1: dead code, comments, and renames inside a file

**Proven dead by reading and by `grep` over `apps/web/src`, tests included.**

- **F1-1. `savePairings`, `loadPairings`, `SaveOutcome`, and `storage`** (`pairings.ts:690-740`). No call anywhere, in a test or out of one (ran: `grep` for each name followed by an opening bracket finds only the two definitions). The page says so itself (`apps/web/src/routes/+page.svelte:45-47`). `PAIRINGS_KEY` stays: `apps/web/src/lib/library/driver.ts:17` imports it. **Refactoring:** Remove Dead Code. **Care:** the ruling it carries, no second silent save site (`pairings.ts:703-706`), is in force and now belongs with the library's own save; comments in `apps/web/src/lib/library/driver.ts:9`, `apps/web/src/lib/library/types.ts:278`, and `apps/web/src/lib/library/library.ts:17` cite these functions by name as the contract's model and need the same edit.
- **F1-2. `minGapFor` and `MIN_GAP_RATIO`** (`engraving.ts:44-50`). No user in any file (ran: `grep`).
- **F1-3. `rotateSyllables`** (`pairings.ts:1324-1354`). Called only from a test (ran: `grep`).
- **F1-4. `melismaRuns` and `MelismaRun`** (`pairings.ts:560-611`). Called only from a test. Its comment calls it "the canonical statement" of the rule the renderer draws by (`pairings.ts:585-588`). The renderer's own comment, dated 2026-11-22, states a different rule: a run opens on a note that draws a word and continues over notes that draw none (`packages/score-parser/src/staff-renderer.ts:2316-2319`; those lines read, the file not). **So a test pins a rule the page no longer draws by.** The desk's call whether it goes or is re-stated.
- **F1-5. The `soon` state of the uploader** (`ScoreUploader.svelte:166`, `:479`, `:589-590`, `:660-664`, and the `.note` rules at `:801-818`). It is reached only from `MSCZ_CONVERTER_UNAVAILABLE`, which `ingest.ts:281` returns only when no converter is passed, and the one caller always passes one (`ScoreUploader.svelte:466`; ran: `grep` finds no other caller of `ingestScoreFile` outside tests). The string `upload.soon.mscz` stays in the table (desk default: no i18n key deleted).
- **F1-6. `ACCEPTED_EXTENSIONS`** (`ingestion/format-detection.ts:50-54`). Read only by a test. Its comment calls it the uploader's `accept` attribute; the uploader has no file input (`ScoreUploader.svelte:20-28`) and the picker's list is `apps/web/src/lib/components/Drawer/IntakePanel.svelte:479`'s own.
- **F1-7. A branch that cannot be false:** `at !== -1` (`pairings.ts:550-551`) follows a guard that has already returned when the id is absent (`pairings.ts:546`).

**Not dead, not wired: the waiting trio.**

- **F1-8. `bars-to-confirm.ts` (138 lines), `offers-for-a-bar.ts` (218), and the reads in `bar-answers.ts` (`:90-174`).** `barsToConfirm`, `offersForABar`, `fingerprintOfBar`, `withBarAnswer`, `answeredBars`, `stillToConfirm`, and `barsToAsk` are called only from their own tests (ran: `grep` over `apps/web`, the two e2e folders included). The record shape IS in use: the library stores `barAnswers` (`apps/web/src/lib/library/library.ts:25`, `:115`, `:169`). So a song record carries a field nothing fills. The headers name a later slice that reads and writes it (`bar-answers.ts:9-10`). **This is the desk's to keep or strike, not a deletion a reader may propose.** A singer sees none of it today.

**Exports nothing outside the file uses** (convention section 6; ran: `grep`): `withBarline` (`barline-marks.ts:57`), `hasLayer` (`rebar.ts:107`), `hasKeyMarks` (`key-signature.ts:56`), `DRY_RUN_PREFIX`, `describeCase`, `HEAL_PREFIX` (`heal.ts:406`, `:413`, `:482`), `OLD_READER_ID` and the four thresholds (`old-reader-seats.ts:58`, `:100-104`), `printedSpelling` (`vowel-resolver.ts:176`), `withObservedMelismas` (`slur-seat.ts:73`). **F1-9: remove the `export` keyword from each.**

**Renames.**

- **F1-10.** Two functions named `align` do unrelated work: `clitic-seat.ts:183` (score words against pipeline words) and `heal.ts:344` (seated words against poem words).
- **F1-11.** Two functions named `slotKey` build different keys: three parts at `reseat.ts:47`, two parts at `score-seat.ts:74`.
- **F1-12.** `foldVowelessSyllables` (`ingestion/vowelless-fold.ts:83`) is spelled with one l; its file and its type are spelled with two (`:40`).
- **F1-13.** `tsUi` (`time-signature-ui.svelte.ts:92`) beside `keyUi`, `clefUi`, `barlineUi`; and `bind` (`clef-ui.svelte.ts:40`) beside `attach` in the other three (`barline-ui.ts:17`).
- **F1-14.** One item under two names: the header says "Row 93" (`old-reader-seats.ts:2`), the console line says "N.185" (`old-reader-seats.ts:259`).

**Tidying inside one file.**

- **F1-15.** `rebar.ts`: one return written twice (`:222-227`, `:231-236`); one mapping body written three times (`:407-418`). Extract Function.
- **F1-16.** `barline-marks.ts:45` and `:50` compare a tuplet field by field; `rebar-notes.ts:71-75` already names that test `sameTuplet`.
- **F1-17.** `old-reader-seats.ts:266-296`: `byPosition` and `byRawPosition` share their pick-and-check loop. `pairings.ts:1222-1242` and `:1334-1351`: `shiftRange` and `rotateSyllables` share their read and write loops (moot if F1-3 lands).
- **F1-18.** `ScoreUploader.svelte`: `.btn-secondary` is declared twice in a row (`:840-849`, `:851-855`); the comment opened at `:705` is never closed and ends only because the next comment closes it at `:726`.
- **F1-19.** Imports in the middle of a file: `vowel-resolver.ts:102-105`, `ingestion/format-detection.ts:71`.
- **F1-20.** `pairings.ts:139-142` is the doc comment of `syllableIpa`, stranded 25 lines before it (`:167`); `pairings.ts:874-875` carries one tab too many.
- **F1-21.** `clef-choice.ts:86` and `key-signature.ts:37` each hold a rule in one long expression. Decompose Conditional.

---

## 3. The hidden relationships

What depends on what, with no import saying so. Each names how it was established.

1. **The arrival fold pre-empts the clitic seat.** `ingestion/vowelless-fold.ts:115-122` removes the very cell `clitic-seat.ts:268-269` looks for. Read; see F4-1. **The single most consequential relationship in the unit.**
2. **Two vowel classes are held equal by a test, and a third copy is outside it.** `apps/web/src/lib/omr/assert-vowel-per-note.ts:15-17` records that `VOWEL` and `CYRILLIC_VOWEL` are pinned together; `phrase-ends.ts:30` repeats the letters and is pinned to neither. Read.
3. **A slot key is built from a word key by string.** `reseat.ts:201` appends `-slotIndex` to what `diff.moved` returns, so it works only while `wordKey` (`apps/web/src/lib/text-diff.ts:32-34`) and `slotKey` (`reseat.ts:47-49`) keep the same separator and order. Read.
4. **Score-made seats and poem-made seats share one coordinate space.** A score's words are read as ONE line (`clitic-seat.ts:495`), so a seat from them carries line 0 and a running word index, which collides with the poem's first line. Three places defend against it by checking `origin.word`: `reseat.ts:113-114`, `pairings.ts:1098`, `score-seat.ts:93-95`. Read; the comments say so (`reseat.ts:76-82`).
5. **The no-break space is the join AND the test.** `clitic-seat.ts:283-284` recognises a fused slot by finding the clitic plus U+00A0 inside the slot's text, which `pairings.ts:227` and `slot-pieces.ts:67` write. The constant has four homes in this unit (`pairings.ts:63`, `slot-pieces.ts:37`, `clitic-seat.ts:66`, `ingestion/vowelless-fold.ts:36`); `clitic-seat.ts:62-64` says a test holds two of them together. Read.
6. **The stress mark is a private fact of the engine, repeated three times** (`vowel-resolver.ts:96-101`, `pairings.ts:47`, `slot-pieces.ts:22`), and the rule "a proclitic tucks in behind it" is written twice in this unit (`vowel-resolver.ts:622-626`, `slot-pieces.ts:62-65`). Read.
7. **Three walks must agree on which standing entry inherits a deleted entry's mark:** `rebar.ts:156-166`, `time-signature.ts:82-92`, `rebar-notes.ts:105-114`. The key signature layer follows none of them (F4-2). Read.
8. **The barline verb asks the layer instead of copying its rules** (`barline-marks.ts:10-15`, `:82-87`). A good relationship, kept by construction; named here so no one "simplifies" it into a second copy of `mergeBlocked` (`rebar.ts:181-191`).
9. **`rebar` re-keys the bar-keyed lists by hand** (`rebar.ts:405-418`) and passes every other field through (`rebar.ts:427`). A new list keyed by bar on `ParsedScore` would silently stay in reading bars. `accompaniment` and `dictionMarks` already pass through (`packages/score-parser/src/types.ts`, `ParsedScore`, read by `grep` only). **Whether either carries a bar index a singer can see is NOT ESTABLISHED.**
10. **Song bars and reading bars.** `bar-layer.ts:16-19` names which members are in which coordinate. A caller that hands `heldBar` the post-layer line instead of `preLine` gets a wrong bar with no error (`bar-layer.ts:118-121`, `time-signature.ts:97`). Read.
11. **The cards and the renderer meet through the DOM.** The overlays find the page by selector: `.markup-paper-container .score-page [data-clef]` (`ClefControls.svelte:55`), `[data-meter]` (`TimeSignatureControls.svelte:36`), `[data-hit]` and `[data-verse-hit]` (`ClefControls.svelte:66`, `TimeSignatureControls.svelte:41`), and the `~v` suffix on a later-pass copy (`TimeSignatureControls.svelte:45`). `system-ground.ts:70-73` and `crossing-ring.ts:87-98` read four more handles. Read.
12. **A z-index ladder kept in comments.** 44 (`TimeSignatureControls.svelte:182`), 45 (`ClefControls.svelte:258`), 80 (`ClefControls.svelte:270`), 9290 and 9300 (`TimeSignatureControls.svelte:198`, `:205`; `KeySignatureCard.svelte:80`, `:84`), against the drawer's 60, the pull bar's 70, the toast's 200, and the Loupe's 9100, which these files know only from their own comments (`ClefControls.svelte:243-245`, `TimeSignatureControls.svelte:178-179`). Read.
13. **`ClefReceipt.svelte` restates another component's rule by hand** and says "change one and change both" (`ClefReceipt.svelte:11-14`, against `apps/web/src/lib/components/Drawer/IntakePanel.svelte:606`). Read.
14. **`old-reader-seats.ts` reads homr's MusicXML with regular expressions** (`:117-124`) and depends on the reader's `imgpos` comment through `placeOf` (`:126`). Read.
15. **The test support names the shipped dictionary by its hash** (`row108.support.ts:21`). A rebuilt dictionary breaks every test that calls it. Read.
16. **`readingClef` must be given the unshifted score** (`clef-choice.ts:21-22`); nothing in its type says so. Read.

---

## 4. The comment census

**Test applied:** does this comment curate the code for a developer arriving cold (plan section 3; `docs/house-style/code-conventions.md:47-54`). A comment carrying one of Dann's rulings stays, with its date and words.

**Figures (ran: `grep` and `wc` over the 55 files).**

| Measure | Figure |
|---|---|
| Files that open with a comment | 54 of 55. `format-label.ts:1-2` opens with imports; its comment starts at `:4` |
| Lines citing a line number in another file | 54, in 14 files: `pairings.ts` 20, `vowel-resolver.ts` 12, `clitic-seat.ts` 6, `offers-for-a-bar.ts` 3, eight files with 1 or 2 |
| Lines naming Dann with a date, or "ruled by Dann" | 55 |
| Lines marked DESK DEFAULT | 19 |
| Comment share of the largest files | `pairings.ts` 691 of 1,421; `vowel-resolver.ts` 354 of 675; `clitic-seat.ts` 242 of 497; `ScoreUploader.svelte` 196 of 865 |

**Verdict.** The comments in this unit are, on the whole, the best curation in it: the rulings are dated and quoted, and the "why" is rarely missing. Three kinds fail the test.

**A. Stale: the comment now says something false. These are the ones a cold reader is hurt by.**

- `clitic-seat.ts:40`: "One-vowel-per-note is not built." It is the governing rule (`CONTRACT.md` 0.1) and `ingest.ts:363-374` enforces it. **Dann's two quotations in that header stay (`clitic-seat.ts:23-28`, `:38-40`); the desk's closing sentence goes.**
- `heal.ts:2-4` and `:50-53`: the file "WRITES NOTHING". `applyHeal` (`heal.ts:453-479`) is the write.
- `pairings.ts:585-588`: "the canonical statement" (F1-4).
- `ingestion/format-detection.ts:13-17` and `:86-88`: the header says PDF and picture inputs are recognised and then refused, with an "images are coming soon" note. They are routable (`:198-205`).
- `ScoreUploader.svelte:161-163` and `:629-631`: "a picture or PDF's read report" and "the clef and key question". Both left on 2026-10-27 (`ScoreUploader.svelte:55-58`).
- `ScoreUploader.svelte:688`: "`:421` above still renders `upload.err.mus`". That line is `:558`.
- `offers-for-a-bar.ts:105`: "that file is being changed and is not imported from" (F2-10).
- `row108.support.ts:62-65`: "the ad hoc version the Part C tests need before it exists". The real one exists (`score-seat.ts:86`).
- Three comments name `reconcilePairings`, renamed `refreshPairings` (`pairings.ts:1185`, `clitic-seat.ts:377`, `reseat.ts:144`; the rename is recorded at `pairings.ts:409-410`). Two name `placeArmedSyllable`, which no longer exists (`pairings.ts:1361`, `:1400`; ran: `grep`).
- Line numbers that have moved inside their own file: `vowel-resolver.ts:544-545` cites `:181`, `:183`, `:188` for code now at `:244-253`; `reseat.ts:80` cites `clitic-seat.ts:449` for code now at `:495`.

**B. Line-number citations (54 lines).** The convention is to cite a name, never a line (`code-conventions.md:51`). Every one becomes a name. The three files that carry most of them are also the three with the heaviest comment share.

**C. History that curates nothing.** `ScoreUploader.svelte` keeps lists of what was deleted from it: the identifiers at `:23-26`, the block at `:139-152`, the markup notes at `:620-633` and `:672-691`, the style notes at `:705-724` and `:861-864`. **The rulings inside them stay, each with its date and words** (2026-08-21 at `:142`, N.70 at `:148-152`, 2026-08-20 at `:676-679`, the three at `:711-724`). The inventories of removed class names and functions come out; git holds them. The same holds for `clitic-seat.ts:430-440`, where Dann's words on the courtesy warning stay (`:434-436`) and the account of the removed function may shrink to its last sentence.

**What stays untouched, by ruling.** Every dated quotation of Dann's; the E.46 statements that Ilya never creates a melisma or an `empty` note (`pairings.ts:29-32`, `:312`, `clitic-seat.ts:42-44`, `reseat.ts:25-27`); the 2026-09-07 re-seat rulings (`reseat.ts:4-11`); the Finale model (`time-signature.ts:4-6`, `rebar.ts:4-7`); the DESK DEFAULT labels, which tell a reader what Dann has not ruled.

**One comment worth adding, once the desk rules F4-1:** where `withVowelPerNote` is called (`ingest.ts:337`), what it does to the clitic seat downstream.

---

## 5. The colour-literal census

**Ran: `node docs/sessions/census-colour-tokens.mjs`, on `50315f2e`.** It reports **296 literals in 51 files, 174 matching a token, 122 needing judgement.** The plan's figures of 299, 177, and 52 files (plan section 4a) are three lower today.

**The script counts hex literals only.** For unit f it lists 20 rows, one of them inside a comment. A `grep` of the unit's files (ran) adds 8 `rgba()` values and 1 named colour the script does not see. **The desk may want the script widened before the count enters the ratchet.**

**Hard-coded `font-family` in unit f: none.** Every declaration reads a custom property (`ClefControls.svelte:277`, `ClefReceipt.svelte:44`, `:59`, `KeySignatureCard.svelte:90`, `ScoreUploader.svelte:702`, `:842`, `TimeSignatureControls.svelte:211`).

Token values are from `apps/web/src/app.css:28-31`, `:42-81`. The hue rule (`app.css:33-41`) is kept: nothing here moves a value into a hue that names a different idea.

| # | Literal | Where | Class | Token, proposal, or reason |
|---|---|---|---|---|
| 1 | `#1a1612` as a `var()` fallback | `ClefControls.svelte:274`, `KeySignatureCard.svelte:87`, `:96`, `TimeSignatureControls.svelte:208`, `:297` | MIGRATE | `var(--ink-primary)`, fallback dropped |
| 2 | `#4a4540` as a `var()` fallback | `ClefControls.svelte:305`, `KeySignatureCard.svelte:95`, `:101`, `TimeSignatureControls.svelte:287`, `:332` | MIGRATE | `var(--ink-secondary)`, fallback dropped |
| 3 | `#f6f1e6` as the fallback of `--paper-cream` | `ClefControls.svelte:273`, `KeySignatureCard.svelte:86`, `TimeSignatureControls.svelte:207` | MIGRATE | `var(--paper-cream)`, fallback dropped. **The fallback is not the token's value** (`--paper-cream` is `#F0EBE0`, `app.css:78`) nor `--paper-light`'s (`#F5F1E8`, `app.css:79`). It can never show, because the token is always defined, and it would be the wrong cream if it did |
| 4 | `#fff` as text on a jewel fill | `ClefControls.svelte:337`, `KeySignatureCard.svelte:104`, `TimeSignatureControls.svelte:267` | NEEDS A TOKEN | Ink tier: `--ink-on-jewel`. `app.css:37` already states the idea ("jewel: buttons, pills, active states, with white text") and gives it no name |
| 5 | `#fff` as a typed field's ground | `KeySignatureCard.svelte:96`, `TimeSignatureControls.svelte:296` | NEEDS A TOKEN | A surface, not a hue: `--paper-field`, beside `--paper-cream` and `--paper-light`. The desk's to approve; it adds no hue family |
| 6 | `white` as a button's ground | `ScoreUploader.svelte:853` | NEEDS A TOKEN | The same idea as row 5; one token serves both |
| 7 | `rgba(26, 22, 18, 0.18)` as a card's shadow | `ClefControls.svelte:276`, `KeySignatureCard.svelte:89`, `TimeSignatureControls.svelte:210` | NEEDS A TOKEN | `--float-shadow` exists (`app.css:150-153`) but holds a different, three-layer value ruled for the Loupe, so this is not a MIGRATE. Either these three cards join that family, which changes how they look and is Dann's taste, or a `--card-shadow` is named |
| 8 | `rgba(26, 22, 18, 0.18)` as a scrim | `KeySignatureCard.svelte:80`, `TimeSignatureControls.svelte:199` | NEEDS A TOKEN | Ink tier: `--ink-scrim` (ink-primary at 18 percent) |
| 9 | `rgba(26, 22, 18, 0.08)` as a hairline | `ClefReceipt.svelte:40` | NEEDS A TOKEN | Ink tier: `--ink-hairline`. It restates `apps/web/src/lib/components/Drawer/IntakePanel.svelte`'s receipt rule (`ClefReceipt.svelte:11-14`), so the token is that file's as much as this one's |
| 10 | `#b45309` as refusal text | `ScoreUploader.svelte:826` | NEEDS A TOKEN | Ink tier: `--ink-refusal`. Amber is none of the five hues and is not forced into one. `apps/web/src/lib/components/Drawer/IntakePanel.svelte:539` and `:749` use a different amber, `#d97706`, for the same idea (seen by `grep`), so one token would settle two files |
| 11 | `rgba(217, 119, 6, 0.06)` as a refusal's wash | `ScoreUploader.svelte:821` | NEEDS A TOKEN | `--refusal-wash`, paired with row 10 |
| 12 | `rgba(0, 0, 0, 0.03)` as the "coming soon" note's ground | `ScoreUploader.svelte:812` | LOCAL BY RIGHT | **Reason: the rule dresses the `soon` state, which cannot be reached (F1-5).** It leaves with that state and needs no token. If the state is kept, it joins row 9's family |
| 13 | `#b23b3b` | `crossing-ring.ts:32` | LOCAL BY RIGHT | **Reason: it is a word in a comment, not a value.** The value is imported as `CROSSING_INK` from the parser package (`crossing-ring.ts:40`, `:70`). The script counts it because it reads comments. That constant's own class belongs to the unit that owns `ring-geometry.ts` |

`ScoreUploader.svelte:775` mixes `var(--lavender)` with transparent and holds no literal. **Also noted for section 4a's focus-ring item:** the five focus rings in this unit all use `var(--lavender)` (`ClefControls.svelte:262`, `:341`, `KeySignatureCard.svelte:106`, `TimeSignatureControls.svelte:191`, `:354`), which fits the hue rule, since these are MELODY's controls.

---

## 6. The duplication contributions

Counted tree-wide by `grep` (ran) over `apps/web/src`, `packages`, and `scripts`, tests excluded unless said. In this table only, a path outside unit f is written from `apps/web/src/lib/` (or from `apps/web/src/` for `routes/`), to keep the rows readable. A pattern search can miss a copy spelled another way, so each figure is a floor.

| Fact | Homes in unit f | Homes tree-wide | Evidence |
|---|---|---|---|
| `gcd` | 3: `rebar.ts:86`, `rebar-notes.ts:31`, `offers-for-a-bar.ts:84` | **10**, and an 11th in a test | `omr/triplets.ts:98`, `omr/metre-witness.ts:83`, `correction.ts:227`, `entry.ts:475`, `packages/score-parser/src/phonation.ts:55`, `mnx-parser.ts:170`, `musicxml-parser.ts:198`; test: `ingestion/fixture-rule.test.ts:255`. **Confirms the desk's ten** |
| The Cyrillic vowel letters | 3: `vowel-resolver.ts:159`, `phrase-ends.ts:30`, `pairings.ts:870` | **14 sites in 12 files**. The desk's corrected figure was eight | `omr/underlay-units.ts:24`, `:25`, `rhyme-reading.ts:59`, `components/Paper/WordStack.svelte:57`, `components/Drawer/InspectorPanel.svelte:546`, `:929`, `typed-hyphens.ts:43`, `syllable-utils.ts:23`, `packages/phonology/src/reflexive.ts:64`, `scripts/build-homographs.mjs:51`, `scripts/build-dictionary.ts:80`. **Two different sets are in play: with ѣ, і, ѵ (5 sites) and without (9)** |
| The slot key, `line-word-slot` | 10 sites (F2-2) | 15 | plus `LoupeSyllables.svelte:61`, `:71`, `:86`, `routes/+page.svelte:525`, `:529` |
| The word key, `line-word` | 5: `phrase-ends.ts:59`, `:67`, `heal.ts:159`, `:214`, `pairings.ts:991` | at least 13, one of them the named home, `text-diff.ts:33` | `provenance.ts:216`, `components/Paper/VerseLine.svelte:42`, `components/Paper/shown-ipa.ts:84`, `:118`, `components/Paper/WordStack.svelte:144`, `syllable-utils.ts:303`, `text/witness-lines.ts:84`, `text/gloss-edit.ts:142`, `routes/+page.svelte:2271` |
| The stress mark U+02C8 as a constant | 3: `pairings.ts:47`, `slot-pieces.ts:22`, `vowel-resolver.ts:101` | 3 as a named constant; the engine's own table is a fourth home (`vowel-resolver.ts:96-98` says so) | |
| The no-break space as a constant | 4: `pairings.ts:63`, `slot-pieces.ts:37`, `clitic-seat.ts:66`, `ingestion/vowelless-fold.ts:36` | 5 | `omr/underlay-clitics.ts:60`, the only exported one |
| Fold ё to е | 2: `clitic-seat.ts:426`, `heal.ts:109` | 10 | `text/gloss-survival.ts:12`, `text/poem-compare.ts:90`, `:92`, `text/witness-lines.ts:97`, `omr/underlay-language.ts:49`, `pipeline.ts:683`, `packages/phonology/src/engine.ts:762`, `lexical-gk.ts:27`. `heal.ts:22-23` says its fold is `glossAnchorForm`'s and cites `+page.svelte`; that function now lives in `text/gloss-survival.ts` |
| A verse's entry on a note | 2 (F2-7) | 4 | `packages/score-parser/src/diction-marks.ts:131`, `verses.ts:50` |
| A longest-common-subsequence table | 2: `underlay-donor.ts:81`, `heal.ts:351` | 4 | `text-diff.ts:115`, `text/poem-compare.ts:136`. **`underlay-donor.ts` is fixed by ruling and is not proposed for merging** |
| Drop a field from a correction, and the record if it is left empty | 4: `barline-marks.ts:60`, `rebar-notes.ts:81`, `time-signature.ts:117`, `key-signature.ts:151` | 6 | `entry-marks.ts:41`, `correction.ts:429` |
| The map with deletions undone | 3: `rebar.ts:151`, `time-signature.ts:77`, `rebar-notes.ts:99` | 3 | the same line, comment included |
| Slot-to-pairing literal | 8 sites (F2-3) | 8 in this unit; other units not searched | |
| A tiny XML reader for tests | 1: `ingestion/mini-dom.ts` | 4 | `packages/score-parser/src/mini-xml.test-support.ts`, `musicxml-parser.test.ts`, `approval/musicxml-parser.approval.test.ts` |
| `portal` to `<body>` | 3 (F2-9) | 4 | `components/Welcome/WelcomeSheet.svelte:60` |
| The coarse-pointer query | 3 (F2-9) | 3 | |
| `compound` metre | 1: `offers-for-a-bar.ts:106` | 2 | `omr/triplets.ts:193` |
| `groupBy` a list by bar | 3: `old-reader-seats.ts:310`, `bars-to-confirm.ts:59-64`, `rebar.ts:240-245` | not searched | |
| The picker's accepted formats | 1: `ingestion/format-detection.ts:54` | 2 | `components/Drawer/IntakePanel.svelte:479` (F1-6) |

---

## 7. Token spend

**About 420,000 tokens of the 650,000 cap, and that figure is an estimate.** A subagent cannot read its own meter, so the exact spend is NOT ESTABLISHED. Roughly 200,000 went to reading the 55 files whole, and about 30,000 was wasted on one mis-built `grep` whose error lines flooded the output; its results were sound and are used in F1-8 and F1-9.

---

## 8. What I could not establish

1. **No behaviour claim was ran.** The bridge is Linux on aarch64 and the repository's `node_modules` holds only the darwin builds of esbuild and rollup (ran: `ls`), so vitest cannot start there. F4-1, F4-2, F4-3, and F4-5 rest on reading. Each names the one test that would settle it.
2. **F4-3 depends on the pipeline**, which is another unit: whether a line-final vowelless word is flagged `isProclitic`.
3. **Which of the three rulings in F4-1 governs.** That is a ruling, not a reading.
4. **Whether the waiting trio (F1-8) is still planned.** `docs/memory` was not read beyond `CONTRACT.md` 0.1, as briefed.
5. **Whether `accompaniment` or `dictionMarks` carry bar indices a singer sees after a re-bar** (hidden relationship 9). `packages/score-parser/src/types.ts` was searched, not read.
6. **Whether the renderer's melisma rule and `melismaRuns` differ in any case a singer can produce** (F1-4). Five lines of `staff-renderer.ts` were read, not the loop.
7. **The parser facts cited in two headers** (`bars-to-confirm.ts:20-26`, `offers-for-a-bar.ts:36-39`) were not checked against the parser.
8. **The tests are unit t.** They were consulted by name and by `grep` only; no test file was read whole.
9. **The exact colour count the ratchet would take.** The script and a hand `grep` disagree by nine values in this unit alone (section 5).

## 9. Files read: 55 of 55, each whole

`ClefControls.svelte`, `ClefReceipt.svelte`, `KeySignatureCard.svelte`, `ScoreControls.svelte`, `ScoreUploader.svelte`, `TimeSignatureControls.svelte`, `bar-answers.ts`, `bar-layer.ts`, `barline-marks.ts`, `barline-ui.ts`, `bars-to-confirm.ts`, `clef-choice.ts`, `clef-ui.svelte.ts`, `clitic-seat.ts`, `crossing-ring.ts`, `engraving.ts`, `first-seat.ts`, `format-label.ts`, `heal.ts`, `held-measure.ts`, `ingestion/first-staved-page.ts`, `ingestion/format-detection.ts`, `ingestion/ingest.ts`, `ingestion/mini-dom.ts`, `ingestion/ocr-guard.ts`, `ingestion/poem-or-score.ts`, `ingestion/vowelless-fold.ts`, `key-signature-ui.svelte.ts`, `key-signature.ts`, `offers-for-a-bar.ts`, `old-reader-seats.ts`, `page-systems.ts`, `pairings.ts`, `phrase-ends.ts`, `placement-scope.ts`, `reading-wait.svelte.ts`, `rebar-notes.ts`, `rebar.ts`, `reconciliation/taxonomy.ts`, `reconciliation/types.ts`, `reconciliation/witnesses.ts` (these three for context; nothing is proposed for them), `replace-seat.ts`, `reseat.ts`, `row108.support.ts`, `scan-banner-state.svelte.ts`, `score-seat.ts`, `seated-text.ts`, `slot-pieces.ts`, `slur-seat.ts`, `system-ground.ts`, `time-signature-ui.svelte.ts`, `time-signature.ts`, `underlay-donor.ts` (read; fixed by ruling, nothing proposed that makes it the alignment engine), `vowel-resolver.ts`, `waiting-seat.ts`.

Line total confirmed with `wc -l`: 10,644.
