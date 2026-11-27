# Brief r3: the lyric band cuts the Russian line, and the row Ilya chooses (QUEUE rows 224 and 227)

2026-11-26, written by the desk (Opus 5) for Code on Dann's Mac. Branch: cut from `Shane` at `ebc3a8b7` or later.
Supersedes r2 (md5 `ad186484`), which Fable returned **SEND WITH AMENDMENTS** on, with three required amendments and
eight more (`review-fable-brief-rows224-227_r2_2026-11-27.md`, md5 `87e671bb`); r2 superseded r1 (md5 `1a951462`),
which came back **DO NOT SEND** with five blockers (`..._r1_2026-11-26.md`, md5 `cd7ad4fb`). Every blocker and every
amendment is applied below, and the two sections at the end say how. **Fable's r2 review says this lane needs no
further review.** Serves QUEUE rows 224 and 227.

## What a singer meets, and why this lane exists

She opens a scan of Alyabyev's «Соловей», page 4 of the Jurgenson print, where seven verses are written out as their
own systems with Russian above and German below on every system. MELODY draws her song. On bars 66 to 73 the words
under the notes read `а-и Фе е-ёй е – ка" а-и а-а зе Ѣѳ! vсѢи –`, with IPA seated under that, where the page prints
«По-бы-вай во всѣхъ стра-нахъ». Those are not her words and that is not her language. Looked at in the running app by
the desk 2026-11-26 23:0x, on the branch alias, from `nightingale-p4-only.pdf`. Nothing on the page tells her which
line Ilya read.

## The chain, each link read from the tree at `ebc3a8b7`

1. **The band's top edge lands on the words.** `underlay-band.ts:98` sets the band's top at `bottom + MARGIN * space`
   with `MARGIN = 1.5` (`:27`). The lane's own measure found the first row starting within 1 px of that edge in 16 of
   16 systems (`report-code-staff-finder-light-scan-0c_r1_2026-11-26.md` section 3, `..._0e_r1_2026-11-26.md`
   section 1). **`MARGIN` is Dann's ruled proportion** (2026-10-28 15:57, `INBOX.md:467`) and **no step changes it,
   the area it fixes, or what the first look reads.**
2. **The cut row fails the Russian test.** On system 9 the Russian row at y 3047 reads
   «иш пы наи ноа невхъ стри нахъ, нъде - ренв - няхъ и нъ г» пшоюо дахъ:» and `rowLanguage` does not call it Russian
   (`step3-rows.out.txt`).
3. **The fallback takes the first row that qualifies, not the best one.** `underlay-fallback.ts:60-66` returns the
   first row, top to bottom, whose sewn words pass. Its test at `:63` counts sewn words of two letters or more,
   known or not (`wordKnown(...) !== null`), and `rowLanguage` must then call them Russian (`:64`). On system 9 the
   first row that passes is the German row at y 3082.
4. **Being seated erases the signal.** `underlay-page.ts:413` sets `why: seated ? null : ...`, so a system seated by
   the fallback carries `why = null`.
5. **So the second look never runs.** `underlay-reader.ts:132` collects only systems where `why === 'no Russian row'`.
   The `wide` look (`underlay-looks.ts:39`, `WIDEN = 1` at `:25`) raises the band's top by a staff space, which is
   exactly the rescue this system needs. It is never offered one.

**Links 4 and 5 are the lane.** Ilya already owns the machinery that recovers a cut line; what is broken is which
systems are allowed to use it.

**The lane's declared departure, and it is not from Dann's ruling of 2026-10-28.** The tree states the second look's
licence as "a system with a band that held ink but no Russian row" (`underlay-looks.ts:4`, `underlay-reader.ts:129`).
**This lane widens that licence**, so a system with a seat is looked at again. `MARGIN`, the band, and what the first
look reads are untouched, so the area Dann's 2026-10-28 ruling fixes is untouched. **NOT ESTABLISHED: what his ruling
of 2026-11-04 items 6 (b) and 7, which the second look cites, permits it to do**; a grep of `INBOX.md` for that
timestamp returned a different matter, and the desk settles it before the lane merges.

## A second row-choosing door, which r1 did not name

`underlay-page.ts:303` consults the fallback **only** where no row passes `rowLanguage`. So where a cut Russian row
fails and a German row passes outright, the German row is seated as a true Russian row: `rescue` is null, the system
counts as Russian (`:403`), and `why` is null (`:413`). **That system gets no second look either, and it is the same
fault by another door.** It does not occur on Nightingale page 4 today, because systems 2, 3, 10, 11, and 12 seat
their row 1. **Step 1 covers it**, through the `core[0]` trigger below, which does not care how a system was seated.

## What the share of Cyrillic letters cannot do here

`OPEN.md`, VERSES WRITTEN OUT item 5 carries Dann's ruling of 2026-11-25 02:16: Ilya transcribes the line with the
highest share of Cyrillic letters. **That measure cannot separate these two rows.** The scan reader runs one language
and it is Cyrillic only (`underlay-recognize.ts:31`, used `:120`), so a German line is read back in Cyrillic too. Of
the 41 rows the reader found, **all 41 are 100 per cent Cyrillic with zero Latin letters**, the 16 German lines
included; on system 9 both rows score 1.000. **Bound: that figure is over each row's first 90 characters**, which is
what `step3-rows.mjs` prints. Fable re-derived it from the dump and confirmed it.

**NOT ESTABLISHED: whether the Cyrillic-share rule is built anywhere on the MusicXML path.** A grep of
`apps/web/src/lib/score/ingestion` and `packages/score-parser/src` for a lyric-line chooser by Cyrillic share found
none. r1 said the rule "is implemented there" and carried no line for it; that sentence is struck.

Desk departure under `CONTRACT.md` tether 19, reported to Dann 2026-11-26 23:1x; the reason of his rule, prefer the
Russian line, is what this lane keeps.

## Scope

**In:** which systems are offered a second look, whether a look may replace a seat already made, which row the
fallback chooses, and a field recording which row was read.

**Out:** `MARGIN` and the area it fixes; what the first look reads; `underlay-page.ts:319-320`, the first-Russian-row
seating rule; the bar-line ink level (row 218); `hasStaves` (row 225); `voiceBoxes` (row 226); the written-out verses,
which ride on this lane's result.

## One measure, named once and used everywhere

Three different measures of "what the dictionary makes of a row" exist in the tree today:
`underlay-choose.ts:33` (raw words for which `wordKnown` is true), `underlay-fallback.ts:63` (sewn words of two
letters or more, known or not), and the known-letter total inside `sewByDictionary` (`underlay-fallback.ts:47-51`),
which is computed and never returned.

**This lane defines one and routes every site through it.** Export from `underlay-fallback.ts` (`sewByDictionary` is at `:37-56`, `letterCount` at `:30`, `wordKnown`
imported at `:23`, and `fallbackRow` is its only caller in source, `:62`) a function that returns,
for a row's words, **the share of the row's letters that fall inside sewn words the dictionary knows**.

**A share, not a count, and the reason is on this page:** system 16's row 4 is the publisher's imprint and carries 74
letters against 27 to 38 for a line of song (`step3-rows.out.txt`). A count rewards length; a share does not.

## Steps

### Step 0, measure only, keeps nothing, report before step 1

On Nightingale page 4 and song2 page 1, both:

a. **The key, written by eye from the crops.** For every system, **the top and the bottom of the printed Russian
   line on the page**, not a single y. **A seated row matches the key where the row's centre falls between them.**
   A row that arrives by a look carries a different `offsetY` (`underlay-prepare.ts:280`: the look's window top plus
   the row's own `y0`), so a bare y with a tolerance the lane picks for itself would not survive a look; system 16's
   rows stand 16 px apart where every other system's pair stands 26 to 39. **Every done-when below is read against
   this key**, written before any code changes, by looking at the crops and not by any rule the code already holds.
b. **Whether the band's edge actually cuts ink.** For every system: the first row's `core[0]`
   (`underlay-rows.ts:56`, `:187`). **`core[0]` is the first band line where `on` is true (`:165`, `:179-180`,
   `:187`), so "`core[0]` is 0" and "band line 0 holds ink" are one condition and not two.** **The row's `y0` is
   clamped to the band's top (`:185`), so "the box starts within 1 px of the edge" is also true of whole letters and
   is not evidence of a cut.** r1 measured the box; this measures the ink.
c. **The ink profile of the 1.5 spaces above each band's top**, so the lane knows what stands there before anything
   reads it.
d. **What each of the four looks gives**, per system: its rows, which pass `rowLanguage`, each row's score on the
   measure above, **and each row's letter total beside its score**. Three things come out of it and all three are
   settled before step 1:
   - **Whether the share needs a floor.** A row passes `rowLanguage` on one known word in three
     (`underlay-language.ts:65`, `RUSSIAN_SHARE` 0.3), so a sliver of two short known words scores 1.0 and would beat
     a full line at 0.7. The desk sets a floor from the letter totals, or records that none is needed.
   - **A stop.** Where the measure scores the German row above the key's line on any system, **the lane stops and
     reports before step 2 is built.**
   - **The cost, projected per page before any code changes:** systems tripping each trigger, times looks offered,
     times rows a look, times milliseconds a row. The first look read 41 rows in 5,431 ms on this page, about 132 ms
     a row, inside a 6.2 s page read (`step3-summary.out.txt`). **The desk sets a ceiling on added reader time per
     page from this report, before step 1 is built, and the lane stops where step 1 exceeds it.**
e. **How many pages in the staged sets have a first row with `core[0]` at 0**, with their names. **Where most staged
   pages trip it, the second look has become the normal path of every page, which is a finding for Dann rather than a
   step: the remedy would then be the band's edge and not the trigger.** Stop and report.

Report. No code changes in step 0.

### Step 1, the second look's trigger

`underlay-reader.ts:132` offers the looks to a system where any of these holds:

1. `why === 'no Russian row'` and the system has a band (today's rule, unchanged).
2. The system was seated by the fallback.
3. The first row's `core[0]` is 0, which is the evidence that a line runs through the edge.

**One thing else changes, and r2 said nothing else did.** `core` never leaves the Worker: `RowLayout` carries `id`,
`transform`, `offsetX`, and `offsetY` (`underlay-page.ts:57-64`). **So `prepareUnderlay` sets a flag on
`SystemLayout` (`underlay-prepare.ts:238-244`) for the reader to read.**

**A system that trips trigger 3 alone is offered `up` and `wide` only.** Trigger 3's evidence is ink through the TOP
edge; `up` and `wide` raise the top (`underlay-looks.ts:37-38`), `down` lowers it (`:36`) and would cut the line
further, and `stretch` does not move it (`:39`). The request already takes a list of looks per system
(`underlay-reader.ts:30`, `:138`). This also halves that trigger's cost.

**The looks themselves, `MARGIN`, the band, and what the first look reads are untouched.** Reading above the band's
top happens where it already happens today, inside `up` and `wide`.

### Step 2, a look may not quietly replace a correct seat

Today a look's rows replace the system's rows wherever any look passes (`underlay-reader.ts:154`, `:160-165`, seated
again at `:167`), which is safe only because the system had no seat. Under step 1 it may have one.

**The rule, in two parts, and both must hold:**

1. **The same printed line.** The look's scored row replaces the seat **only where it overlaps the seated row on the
   page**. Both extents are already held (`offsetY` and `transform.height`, `underlay-page.ts:57-64`,
   `underlay-frame.ts:398`). **Without this, `down` cuts the top row further, the top row then fails `rowLanguage`,
   and the look's first Russian row is the next line down**, which on this page is a second verse or the German line.
   Under trigger 1 there is no seat to overlap, so today's rule stands there unchanged.
2. **A better score.** Its row's score beats the seated row's score on the one measure above. Otherwise the seat
   stands and the looks are discarded. A tie does not replace.

**Step 2 reads which row is seated from step 4's field and never recomputes it.** `seatPage` returns no row identity,
and a second copy of the rule in the reader is the fault Fable named in the harness on r1.

**The report must not call a look kept when it lost to the seat.** `underlay-reader.ts:152` writes `kept: i === best`
and `:86` prints it.

`scoreLook` (`underlay-choose.ts:29-36`) moves to the same measure. **It keeps scoring a look by its FIRST Russian
row**, because `underlay-page.ts:319-320` still seats from the first Russian row, which is the dependency
`underlay-choose.ts:6-7` states in the tree's own words. Only the measure changes, never which row is scored.

**That number is printed and typed as a count in three places, and the lane names what each becomes:**
`LookScore.known` (`underlay-choose.ts:24-27`), `LookReport.known` (`underlay-page.ts:203-211`), and the «Russian, N
words» line (`underlay-reader.ts:86`).

### Step 3, the fallback takes the best qualifying row

`underlay-fallback.ts:60-66` returns the row with the highest score among those that qualify, instead of the first.
Ties go to the higher row, so today's behaviour is what a tie falls back to.

**`underlay-page.ts:319-320` is not touched.** r1 proposed changing it; that would have taken first-verse seating out
of Ilya, which the tree states at `underlay-page.ts:20-22` and pins at `underlay-page.test.ts:93-98`, and on a
strophic print with verses stacked under one staff each system could then seat a different verse. **On this page the
first-wins rule is already right on 15 of 16 systems once the top row passes, so changing it buys nothing.**

### Step 4, Ilya records which row it read. BUILT FIRST, because steps 1 to 3 read it

Where a system holds more than one row, the system records **which row was seated, with its extent on the page**,
and how it was chosen. The extent, not only an index: done-when 1 matches a seated row against the key by its centre,
and step 2 needs it to test overlap. **This step is built before steps 1, 2, and 3, which all read it.**

**The field stays absent where it does not apply.** Nine assertions in `underlay-page.test.ts` compare `page.systems`
with `toEqual` against exact objects (`:65`, `:82`, `:89`, `:102`, `:111`, `:115`, `:183`, `:198`, `:211`). Fable read
`:89`, `:102-105`, and `:111` and found them safe under "more than one row"; **`:65`, `:183`, `:198`, and `:211` were
not read, and the lane checks them.**

**It goes in a new optional field on `SystemWords` (`underlay-page.ts:172-188`), never as a new value of `why`.**
Three readers treat `why` as a closed set: `band-strip.ts:123` reads `written = s.why === null`,
`kept-bands.ts:108` rejects any value but null and three known strings, and `underlay-song.ts:105-107` carries it to
the banner. The validator at `kept-bands.ts:101-110` does not inspect new fields.

**Step 4 carries no string.** Dann's ruling of 2026-11-25 02:16 asks that Ilya name the line to the singer; the
English is the desk's to draft and the French is Dann's to rule. Report what the surface needs and stop.

## The numbers this lane changes, and every other site that computes them

`CONTRACT.md` section 4. The number is **which row of a system is chosen**, and the sites are:

| site | what it does | does this lane change it |
|---|---|---|
| `underlay-page.ts:319-320` | seats a system from its first Russian row | **no** |
| `underlay-page.ts:303` | consults the fallback only where no row passes `rowLanguage` | no; step 1 reaches those systems by `core[0]` |
| `underlay-fallback.ts:60-66` | first qualifying sewn row | yes, step 3 |
| `underlay-choose.ts:29-36` | scores a look by its first Russian row | the measure only, step 2 |
| `underlay-choose.ts:39-49` | ranks looks | no |
| `underlay-reader.ts:154`, `:160-165` | the kept look's rows replace the system's | yes, step 2 |

**What depended on them agreeing:** `underlay-choose.ts:6-7` scores a look by the row the seating would use. Step 2
keeps that true by leaving the seating rule alone and moving only the measure. **A step that changes
`underlay-page.ts:319-320` without changing `scoreLook` in the same breath breaks it**, which is why step 3 does not.

**Comments that state the rules this lane moves, and must move with them:** `underlay-fallback.ts:14-15`,
`underlay-reader.ts:129-131`, `underlay-looks.ts:10-11` (its stated four-look limit).

**Pinned tests that move:** `underlay-fallback.test.ts:42`, `underlay-looks.test.ts:65` and `:79`.
**`underlay-page.test.ts:93-98` must stay green untouched**, and is the guard that first-verse seating survives.

## The grep that was run before proposing this

`CONTRACT.md` section 4. Run 2026-11-26 in `apps/web/src/lib/omr/`: `grep -n "fallbackRow\|rowLanguage\|russianRows"`
across `underlay-page.ts`, `underlay-choose.ts`, and `underlay-language.ts`, with full reads of `underlay-band.ts`,
`underlay-looks.ts`, `underlay-fallback.ts`, and `underlay-choose.ts`, and Fable's independent re-read of all of them.
**r1 claimed the row scoring already existed at `underlay-choose.ts:29-49` and did not need building. That was false:
`scoreLook` scores one row and `chooseLook` ranks looks, pinned at `underlay-looks.test.ts:79-82`.** The measure named
above is new and is built once.

## Done when, read against step 0's key

1. **Every one of the 16 systems on Nightingale page 4 is seated, and each from the key's line**, matched by the
   seated row's centre falling between the key's top and bottom, read from step 4's field and never from a harness
   copy of the rule.
2. **A text gate on systems 9 and 16, because row identity alone does not close system 16.** `QUEUE.md` row 224 says
   system 16's noise row IS the cut Russian line, so "seated from the key's line" is already true of it before any
   code changes. For both systems the seated syllables are compared with the print by eye, **the count that match the
   print is reported before and after, and it rises on both.** Reporting alone is not a gate.
3. **No system that is seated from the key's line TODAY loses seated syllables.** r2 said no system may lose any, and
   that is false of a correct repair: system 9 seats 17 syllables today from the German row (`step3-rows.out.txt`),
   and the printed Russian line holds fewer. **A gate that fails on the right answer is not a gate.** Systems whose
   seated line changes to the key's line are judged by items 1 and 2.
4. **No system on any measured page changes its seated line to a DIFFERENT printed line unless the key names the new
   one.** This is what stops a look seating a second verse or the German line.
5. **`underlay-page.test.ts:93-98` is green without being edited**, the guard that first-verse seating survives.
6. **The second look's cost is reported and is inside the ceiling the desk set after step 0**: the `second look`
   line's milliseconds and how many systems took looks (`underlay-reader.ts:169`, `:173`), as added reader time per
   page.
7. **The lane reports what system 9 does with `?looks=off` (`underlay-reader.ts:38`, `:132`), and German is the
   expected answer.** r2 said the repair must not rest on the looks alone; in this design it does, by choice, because
   the looks are the machinery that recovers a cut line. The switch is the desk's and not a singer's
   (`underlay-switch.ts:7-8`, `:22-28`).
8. All eight gates at baseline on the Mac; any baseline moved is reported with both figures.

A look in the running app confirms what the counts say; it is not a done-when on its own.

## What could not be established

- **Whether the band's edge cuts ink on any system.** Both the lane's reports and r1 read documents and boxes, not
  pixels. Step 0 (b) settles it, and if it finds no cut on system 9 the lane stops and reports, because the chain's
  link 1 would then be wrong.
- **Which row step 3 takes on systems 2, 3, 10, 11, and 12**, where a German row passes `rowLanguage` beside the
  Russian one. Step 0 (d) measures it before step 3 is built.
- **Which of system 16's four rows is the printed Russian line.** Its rows 1 and 2 stand 16 px apart where every other
  system's pair stands 26 to 39 px apart. Step 0 (a) settles it by eye.
- **Whether `wide` reaches the whole line on song2's first system.** QUEUE row 224 says so from a report; step 0 (d)
  runs it.
- **What the twenty control staves hold**, and whether they carry underlay at all.
- **Whether any page in the project's sets prints stacked verses** that the first-row rule seats correctly today.

**NOT ESTABLISHED beats a complete invented answer.**

## What changed from r1

| Fable's blocker | What r2 does |
|---|---|
| 1. Step 3 removed first-verse seating | `underlay-page.ts:319-320` is out of scope. Only `fallbackRow` changes |
| 2. The row scoring does not exist | One measure is defined and exported; the false "already exists" sentence is struck; `scoreLook` moves to it while still scoring the first Russian row |
| 3. Done-when could pass with the fault on the page | Every item is read against step 0's key, written by eye before any code changes |
| 4. A look could replace a correct fallback seat | Step 2 states the replacement rule: a look must beat the seated row, and a tie does not replace |
| 5. Step 1 read ink in the area Dann's ruling fixes | r1's grow-the-row mechanism is gone. The lane widens the second look's trigger instead, so reading above the band happens only where it already happens today |

Four of Fable's amendments corrected citations r1 got wrong: `underlay-fallback.ts:63` counts by length and not known
words; the known-letter figure at `:47-51` is never returned; first-wins is `underlay-page.ts:319-320` and not `:309`;
and `underlay-page.ts:303` is a row-choosing site r1 did not name.

## Reporting

One report per step, written to `docs/sessions/` by the lane itself. Commit nothing. The lane stops and reports where
a measurement contradicts the chain stated above.
