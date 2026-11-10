# Review: the barline correction (QUEUE row 138), arithmetic and a Loupe verb (Fable, r1, 2026-11-10)

For the desk. Brief: `/home/claude/brief-fable-barline-correction_r1_2026-11-09.md`. Code read at `/home/claude/gates`, detached at `e4eeaa96` after `git fetch origin cloud-lane-38`, working tree clean. Nothing built, committed, or pushed. One scratch folder written on the Mac, named in section 9.

## Verdict: PROCEED WITH CHANGES

1. **B (the verb) is the control Dann ruled for, and it ships first.** It is one stored field and one pure function, placed as a layer over the reading.
2. **A (the arithmetic) solves nothing on any stored reading.** In 37 stored readings by the present reader (1,409 bars holding notes), 120 bars are over-full and none is an exact multiple of its metre. A splits 0, refuses 120, and splits 0 wrongly. Every over-full bar is a misread length or a misread metre, not a missed barline.
3. **The 29-eighths case is refused by A.** The metre is 3/2, 12 eighths to the bar. 29 = 2 × 12 + 5. Condition 2 fails.
4. **A changes from automatic to offered.** Same conditions, plus one guard, shown as a one-tap offer in the CORRECTIONS pane. Two of Dann's rulings point there (finding 3). Automatic or offered is his call (section 7).
5. **The split is a correction layer, never a change to the reading.** A reading-time split renames every event id after it and spends a second re-read of every stored scan.

## 1. What I measured

Scripts and outputs: `~/Downloads/_desk-2026-11-09/barline-measure/` (`ba.py`, `sim.py`, `ba-out.txt`, `sim-out.txt`).

**Stored readings, all by `homr-web` through the join (MusicXML as kept):**

| set | where | readings | with truth |
|---|---|---|---|
| row 114 f1, songs 1 to 4 (Dann's scans, 1967 Mussorgsky) | `~/Downloads/_colleague-pages/run-2026-10-19/run/drops/` | 4 | 4 |
| the 17 songs of metre round 6 | `~/Downloads/_code-metre-r6/after/scored/` | 17 | 17 |
| round 6 private sets and rehearsals, row 114 rehearsal K and M | `_code-metre-r6/run4/private-*/drops/`, `run-2026-10-19/run/rehearsal/drops/` | 16 (3 are second readings of grech, k04, varl) | 0 |

Method: per bar, voice 1's notes and rests summed against the `<time>` in force, as `barFacts` does (`metre-witness.ts:157-180`). Where a truth file exists, reader notes are aligned to truth notes by pitch, and a bar is "fused" when its notes belong to two or more truth bars.

| result | count |
|---|---|
| bars holding notes | 1,409 |
| over-full bars | 120 |
| over-full and an exact multiple of the metre (A's condition 2) | 0 |
| A splits right | 0 |
| A splits wrongly | 0 |
| A refuses | 120 |
| fused by truth | 1 candidate (k07, last sung bar, sum 3 of 3 in 6/8; not over-full, so A does not see it; I did not open it, and it may be an alignment artifact) |

Where the 120 come from: 94 are grech, read twice, every bar summing 3 quarters under a stated 4/8 (a metre misread, not fusion). The rest are single bars one eighth or one sixteenth over (sun1 bar 17, sun5 bar 61, gur bar 7, f1 song 4 bars 41 and 46, and four in the private sets).

Row 114 f1 bar counts, from the kept score files: song 1 read 28 of 31, song 2 109 of 109, song 3 55 of 55, song 4 48 of 52. The missing bars in songs 1 and 4 are bars where the voice is silent (the reader's unpaired bars sit in the tacet stretches); no bar holding notes is fused.

**Simulation on the 28 truth files** (`sim.py`), because the stored readings hold no case:

| case | trials | strict A (conditions 1 to 4) | "fill from the first note, cut at each full bar" (greedy) |
|---|---|---|---|
| 2, 3, or 4 full bars fused, every length right | 2,655 | splits right 2,655 | same |
| the same with one error (a rest dropped, or one length halved or doubled) | 68,377 | refuses 68,377; wrong 0 | a wrong barline in 20,308 (30 percent) |

So: strict A is right exactly when every fused bar was read with its right total, and it is safe under a single misread. Dann's "fill up presumed measures" in its greedy form places a wrong barline in three of ten single-error cases. A stays strict.

## 2. The 29-eighths case, worked

- **Where it was seen.** Dann's slice 3 walk, on the Lamm scan of Sunless 1, `m. 1 · system 1 of 4 · 29 of 8` and `m. 2 · … · 6 of 1` (`docs/sessions/memo-mobile-slice3_r1_2026-08-26.md:434-435`). That was the in-house page reader of that date. Scans now go through `readScanAsScore` (`ScoreUploader.svelte:69`, `omr/scan.ts:73`).
- **The metre.** 3/2 in every bar (`tools/e16-harness/output/truth/mussorgsky_sunless-01_within-four-walls.truth.json`, `measureDurations`, 18 of 18). L = 12 eighths.
- **The arithmetic.** 29 = 2 × 12 + 5. Not k × L. The first-bar clause does not rescue it: the voice enters on a downbeat (truth bar 2, onset 0), and the last bar holds 12.
- **Why.** Five eighths of misreading sit inside the fused bar. The truth's first three sung bars hold 11, 10, and 12 eighths of notes with 1, 2, and 0 of rests. A bar that lost its barlines and also a rest or a length cannot be re-barred by arithmetic; a fill from the first note would put every later barline in the wrong place.
- **A's answer:** refuse, flag as today. **B's answer:** the singer adds two barlines against the print strip, then repairs lengths.
- **m. 2, "6 of 1"** is 48 eighths, 4 × 12, an exact multiple. Whether its boundaries fall between notes is NOT ESTABLISHED: that reading is not stored.
- **The present reader on the Lamm scan:** no stored reading found. The last stored count is the in-house reader's of 2026-10-02: 18 measures, the truth's number (`docs/sessions/measure-bars_r1_2026-10-02/lamm-worker3.json`, `"measures": 18`).

## 3. Findings

1. **A's four conditions are right and need one more.** Condition 1 ("the metre is known") cannot be tested on the parsed score, because every `Measure` carries a `timeSignature` whether read or defaulted (`packages/score-parser/src/types.ts:265-266`), and the reading can state a metre the bars do not keep (grech: 4/8 over 47 bars of 3 quarters). If a stated metre were half the true one (3/4 over 3/2, 2/4 over 4/4), every bar would be an exact multiple and A would halve the whole song. Add **condition 5, coined here as "the metre is kept by its neighbours":** under the same signature, at least two other bars sum to exactly L, and they outnumber the bars A would divide.

2. **The pickup clause goes.** Of 28 truth files, two open with a short bar (Sunless 2 and 3, 2 of 4 quarters). In both the last bar holds 4, so "pickup plus last bar = one bar" fails in 2 of 2. These are voice lines, so the test is weak, but it gives no support. A leaves a short first bar and a short last bar alone and divides full multiples only.

3. **Two rulings stand against an automatic A.** Dann, 2026-09-17: Ilya "never re-bars on its own" (`OPEN.md:1536`), with over-full tolerated while a tuplet is in progress. Dann, 2026-10-08 15:50, as quoted in code: "The page is the authority, not the arithmetic", so the offers "ask" and "never repair" (`offers-for-a-bar.ts:6-9`). Dann's question of 2026-11-09 asks whether arithmetic can do it; it does not overrule either. The survey agrees: OMR tools flag and none auto-splits. **Better design:** A is a third kind of offer for a bar that does not add up, one tap, stored as B's marks. If Dann rules for automatic, the same function feeds the layer directly; in either form A reads the reading only, never the singer's corrections, so a bar she is overfilling is never touched.

4. **A reading-time split is ruled out by the ids.** homr's notes carry no `id`, so the parser builds `m{measureIndex}-{num}-{den}` (`musicxml-parser.ts:732-734`). A split inside the kept MusicXML renames every event from the split to the end. Corrections are keyed by event id (`correction.ts:108-109`; `library/types.ts:107-115`), as are pairings, so every stored repair after the split is orphaned on a stored song. B cannot be reading-time at all: it is the singer's.

5. **Stamp.** A kept reading is reused only while its stamp equals `READER_STAMP` (`stamp.ts:5-9`, `:50`), and the stamp was changed on 2026-11-09, spending "the one silent re-read every stored scan gets" (`stamp.ts:28-31`). A layer changes no kept MusicXML: no bump. Reading-time needs a bump and a second re-read of everything two days later.

6. **The grammar.** One additive field on `NoteCorrection`, beside `tied?: 'start' | 'none'` (`correction.ts:102`): **`barline?: 'before' | 'none'`** (coined). `'before'`: a barline stands before this entry that the reading does not have. `'none'`: the reading's barline before this entry is removed. Keyed by event id, so it survives a re-read like every other correction. On the entry that opens the new bar, so the barline's place does not move when the note before it is deleted (deleted entries stay in the map, `correction.ts:408-414`).

7. **`withCorrection` would delete the verb.** It prunes a record that carries none of seven named fields (`correction.ts:317-328`). A record holding only `barline` is pruned on its first write. The field joins that list. Whether `validateRecord` keeps an unknown `NoteCorrection` field through save, load, and binder: NOT ESTABLISHED (I read `library.ts:300-325` only); step B4 tests it.

8. **One function, one place.** `rebar` (coined): after `applyCorrections`, walk the line, open a new bar at each `'before'`, close none at each `'none'`, and return the line with `measureIndex` and onsets recomputed, a rebuilt `measures` list, every change list re-indexed, and a two-way map between **reading bars** and **song bars** (both coined). Today the page replaces `vocalLine` only (`+page.svelte:948-966`, `:961`), and `correctedLine` (`:804`) feeds the fill line (`:836`), the cursor (`:787`), and the Loupe (`:1076`, `:1137`, `:1199`). `rebar` goes at `:804`, and `correctedScore` takes its measures and lists. The short-circuit at `:951` (`correctedCount === 0`) stays valid while A is an offer.

9. **Removing a barline.** The merged bar keeps the first bar's `Measure` and reads over (for example `8 of 4`). That is a ruled normal state, flagged when left (`OPEN.md:1537-1541`). No refusal, no re-timing. The verb is not offered where the second bar opens with a change of metre, key, or clef, or the barline is a repeat (`types.ts:286-288`): a `Measure` holds one signature (`types.ts:265-275`).

10. **Straddling notes.** B places a barline between entries only, so nothing straddles. A refuses a straddle (condition 3), the brief's default; Dann has not ruled tie-or-refuse and nothing here needs him to.

11. **One edge in entry.** A note entered at the head caret of bar k is anchored to the last entry of k − 1 and names k (`entry.ts:228-233`; `correction.ts:76-85`, `:483-490`). Two changes: the stored `entered.measureIndex` is written in reading bars (through the map; equal to today's value on every song with no barline mark, so stored records read as before), and where the bar's first entry carries `'before'`, the new entry takes the mark and the old first entry drops it.

## 4. Every site keyed by bar

| site | read at | under the layer | verdict |
|---|---|---|---|
| corrections by event id | `correction.ts:108-109`, `library/types.ts:107-115` | ids unchanged | SURVIVES |
| `entered.measureIndex` | `correction.ts:76-85`, `entry.ts:228-233` | finding 11 | CHANGE, small |
| `reflowOnsets`, by read measure | `correction.ts:444-514` | runs before `rebar` | SURVIVES |
| `orphanIds` | `correction.ts:738-757` | a mark on a vanished id is counted as lost, which is right | SURVIVES |
| bar answers, keyed `String(measureIndex)` with a fingerprint | `bar-answers.ts:12-19`, `:107-112`, `:153-158`; `library.ts:315-325` | answers after a split sit under a shifted index; the fingerprint fails and the bar is asked again. A wrong answer is honoured only if two unequal-to-metre bars share one rhythm | DEGRADES SAFELY; re-key to reading bars after the share |
| `barsToConfirm` | `bars-to-confirm.ts:38-75` | takes `measures` and `vocalLine`; give it the rebarred score | SURVIVES |
| print strip: `strip(bar)`, `systemOfBar`, `KeptSystem.bars`, `barXs` | `loupe-print.svelte.ts:114-120`, `kept-bands.ts:36`, `:44-48`, `:113-116` | reading bars, kept with the reading | BREAKS unless fed reading bars |
| the strip's bar from the Loupe | `Loupe.svelte:2298-2299` (`measureLabel` parsed as the bar) | becomes a song bar after `rebar` | CHANGE: pass the reading bar from the map. Both halves of a divided bar then show the same strip, which is what she needs |
| `firstNoteOfBar` | `loupe-print.svelte.ts:188-192`; `loupe-print-wiring.ts:81-85` | measures come from the ingested score (reading), the line from the corrected line (`:74-75`) | CHANGE: lend the line before `rebar` |
| `tagFor`, `position`, Previous and Next | `loupe-print.svelte.ts:88-105` | list is reading bars | CHANGE: same conversion |
| unread-bars banner | `banner-bars.ts:18-41`, `unread-bars.ts:31`, `+page.svelte:3990` | numbers are written at reading time; after a split they disagree with MELODY by the shift | CHANGE: show the song bar, link by the reading bar |
| poem join runs | `poem-join-wire.ts:137-151`; `loupe-print-wiring.ts:53` | events lent are the ingested line, ranges are reading bars: one coordinate | SURVIVES |
| underlay systems and seating | pipeline position only (`scan.ts:98`); `underlay-band.ts` and `underlay-page.ts` not opened | upstream of the kept MusicXML | SURVIVES (by position; not read) |
| metre witness | `metre-witness.ts:157-238` | reading-time, on MusicXML strings | SURVIVES |
| tempo, clef, and key controls | `+page.svelte:970-977` | read `correctedScore` | SURVIVES once `rebar` rebuilds `measures`, `timeSignatures`, `keySignatures`, `clefs`, `tempoMarkings`, `tempoWords`, `metricModulations` (`types.ts:58-80`, `:369-378`, `:408-412`, `:437-460`) |
| MELODY and PAPER bar numbers | `+page.svelte:4368`, `:4403` (handed `correctedScore`); renderer not opened | `Measure.number` is rebuilt in order; a pickup keeps `'0'` (`types.ts:257-263`) | SURVIVES by construction; walk it |
| INSIGHTS findings and key passages | NOT ESTABLISHED which score it is handed (`+page.svelte:1465` says one consumer was moved off `correctedScore`) | | CODE CHECKS in step B2 |
| the stamp | `stamp.ts:5-9`, `:28-31`, `:50-63` | no kept byte changes | SURVIVES, no bump |

## 5. Strings (EN drafts; French is Dann's)

Existing words kept: CORRECTIONS (`loupe.station.corrections`, `i18n.ts:701`), SYLLABLES (`loupe.syllables`, `:539`), the one-word button faces Rest and Tie (`loupe.rest` `:553`, `loupe.tie` `:592`), "Remove this note" (`correct.delete`, `:363`).

| key (coined) | EN | note |
|---|---|---|
| `loupe.barline` | Barline | button face, beside Rest and Tie; coined as a face |
| `correct.barlineAdd` | Add a barline after this note | the desk's wording, adopted |
| `correct.barlineRemove` | Remove the barline after this note | changed from "Remove this barline": the Loupe holds a note, never a barline |
| `loupe.divideOffer` | This bar holds %k bars of %m. | A, as an offer; "divide" adopted from the desk's "divided" |
| `loupe.divide` | Divide it by the metre | the offer's button |
| `correct.dividedNote` | Divided by the metre's arithmetic. Check it against your score. | only if Dann rules A automatic |
| `receipt.barsDivided` | Bars divided by the metre: %n | only if A is automatic; the receipt's existing keys were not found, so its home is NOT ESTABLISHED |

No string for a refusal: a bar A cannot divide is flagged as today.

## 6. Build plan for Code, Tuesday 2026-11-10

To ratify first: the three B strings (EN), and section 7 question 1.

| step | work | done when |
|---|---|---|
| B0 | Fixtures. (a) f1 song 1's kept MusicXML with the barline between bars 4 and 5 removed (a clean fusion), and the same with one rest dropped (a refusal). (b) Read the Lamm scan on the tip, keep its MusicXML, and count over-full bars and exact multiples | two fixtures in `omr/fixtures/`; one line in the report: fused bars on the Lamm scan, yes or no |
| B1 | `score/rebar.ts`, pure: the `barline` field, `rebar(score, line, map)`, the reading-bar map. `barline` added to the prune list (`correction.ts:317-325`) | vitest: split, join, split then join returns the reading's bars exactly; ids unchanged; onsets start at 0 in each new bar; change lists re-indexed; a barline-only record is not pruned; an empty map returns the same objects |
| B2 | Wire at `+page.svelte:804` and `:948`. Reading bars to the strip, the tag, Previous and Next, and the banner. Check what INSIGHTS is handed | on fixture (a), one barline gives the truth's bar count; the strip shows on both halves; the banner's numbers match MELODY's; type check and the full unit suite pass |
| B3 | The verb: `Barline` in the CORRECTIONS pane beside Rest and Tie (`CorrectionSurface.svelte:663-695`), through `correction-verbs.svelte.ts` as `toggleRest` and `toggleTie` go (`:382`, `:390`), so Undo names it. Shown as Remove where a barline follows the held note, hidden where finding 9 says | Playwright: add, Undo, Redo, remove, in both orders |
| B4 | Persistence: save, reload, binder out and in | the mark survives all three; `validateRecord` test |
| B5 | Finding 11, the head caret | a note entered at the head of a hand-made bar lands in that bar |
| A1 | `metreSplits(score)`, pure, conditions 2 to 5, full multiples only, on the reading's line | vitest on fixture (a): one split, right; on the dropped-rest variant, grech, and a halved-metre fixture: none |
| A2 | The offer line and button in the pane on a qualifying bar; a tap writes B's marks | Playwright on fixture (a); Undo restores |

**Cut order if the day runs short:** A2 and A1 first, then B5 (hide the head caret in a hand-made bar instead), then the banner's renumbering. B1 to B4 are never cut.

**If only one fits: B.** It answers Dann's ruling ("a control to respond to it") and every case, including the 29 eighths. A answers a case no stored reading holds.

**One lane?** B1 to B4 fit one Code lane on Tuesday. A as an offer fits the same lane after them if B's gates are green by mid-afternoon. A as an automatic repair does not ship before B0(b) shows a fused bar it divides right.

## 7. Questions only Dann can answer

1. **A: automatic, or offered?** Recommendation: offered, one tap. Automatic costs a re-barring made on arithmetic alone, against his words of 2026-09-17 and 2026-10-08; offered costs her one tap on a case not yet seen on the present reader.
2. **The verb's face:** "Barline" as one word beside Rest and Tie, or the full sentence as the visible label (taste).
3. **French** for the strings in section 5, once the English is ratified.

## 8. What I could not establish

- The reading that showed 29 of 8: not stored. The present reader's reading of the Lamm scan: none stored; B0(b) makes it.
- Whether the present reader fuses bars on any page at all. On 37 stored readings it does not; that is a count of what is stored, not a rate.
- k07's last sung bar (the one fused candidate): not opened.
- `underlay-band.ts`, `underlay-page.ts`, the renderers, INSIGHTS, `CorrectionSurface.svelte` beyond lines 663 to 695, `validateRecord` beyond `library.ts:300-325`, and the undo history: not read. The table marks each.
- A change of metre, key, or clef read inside a fused bar (condition 4): the parsed score snapshots one signature per measure, so where such a change lands after parsing is NOT ESTABLISHED. No stored reading holds one inside an over-full bar.
- The receipt's keys and where a count of divided bars would sit.
- The survey (`/home/claude/barline/survey-barline-handling_r1_2026-11-09.md`): read to the end of the MusicXML section; "What Ilya can adopt" not read. Adopted from it: a stable internal identity with a derived display number, split-before-note and join as the two verbs, flag and never auto-split as the OMR norm.

## 9. Housekeeping

- Written on the Mac: `~/Downloads/_desk-2026-11-09/barline-measure/` (`ba.py` md5 `75d6ea09`, `sim.py` `a5f05077`, `ba-out.txt` `2c648c58`, `sim-out.txt` `2e17fb66`). Nothing in the repository was touched.
- Terms coined in this review: `barline` (the field), `rebar`, reading bar, song bar, "the metre is kept by its neighbours", and the string keys of section 5. Adopted: "divide" (the desk), the two verb sentences (the desk, one reworded).
- Corrected errors: none reported this session.
