# Brief r2: the lyric band cuts the Russian line, and the row Ilya chooses (QUEUE rows 224 and 227)

2026-11-26, written by the desk (Opus 5) for Code on Dann's Mac. Branch: cut from `Shane` at `ebc3a8b7` or later.
Supersedes r1 (md5 `1a951462`), which Fable returned **DO NOT SEND** on, with five blockers and fourteen amendments
(`review-fable-brief-rows224-227_r1_2026-11-26.md`, md5 `cd7ad4fb`). Every blocker is applied below and the section
"What changed from r1" says how. Serves QUEUE rows 224 and 227.

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

**This lane defines one and routes every site through it.** Export from `underlay-fallback.ts` a function that returns,
for a row's words, **the share of the row's letters that fall inside sewn words the dictionary knows**.

**A share, not a count, and the reason is on this page:** system 16's row 4 is the publisher's imprint and carries 74
letters against 27 to 38 for a line of song (`step3-rows.out.txt`). A count rewards length; a share does not.

## Steps

### Step 0, measure only, keeps nothing, report before step 1

On Nightingale page 4 and song2 page 1, both:

a. **The key, written by eye from the crops.** For every system, the y of the row that is the printed Russian line.
   **Every done-when below is read against this key**, so it is written before any code changes, and it is written by
   looking at the crops, not by any rule the code already holds.
b. **Whether the band's edge actually cuts ink.** For every system: the first row's `core[0]` (`underlay-rows.ts:56`,
   `:188`) and whether band line 0 holds ink by `cutRows`' own line test (`:165`). **The row's `y0` is clamped to the
   band's top (`:185`), so "the box starts within 1 px of the edge" is also true of whole letters and is not evidence
   of a cut.** r1 measured the box and this measures the ink.
c. **The ink profile of the 1.5 spaces above each band's top**, so the lane knows what stands there before anything
   reads it.
d. **What each of the four looks gives**, per system: its rows, which pass `rowLanguage`, and each row's score on the
   measure above. This says whether `wide` recovers the cut line before a trigger is widened to call it.
e. **How many pages in the staged sets have a first row with `core[0]` at 0**, with their names.

Report. No code changes in step 0.

### Step 1, the second look's trigger

`underlay-reader.ts:132` offers the looks to a system where any of these holds:

1. `why === 'no Russian row'` and the system has a band (today's rule, unchanged).
2. The system was seated by the fallback.
3. The first row's `core[0]` is 0 and band line 0 holds ink, which is the evidence that a line runs through the edge.

**Nothing else changes.** The looks themselves, `MARGIN`, the band, and what the first look reads are untouched, so
the area Dann's ruling of 2026-10-28 fixes is untouched. Reading above the band's top happens where it already
happens today, inside `wide`.

### Step 2, a look may not quietly replace a correct seat

Today a look's rows replace the system's rows wherever any look passes (`underlay-reader.ts:154`, `:160-165`, seated
again at `:167`), which is safe only because the system had no seat. Under step 1 it may have one.

**The rule:** a look replaces the seat already made **only where its row's score beats the seated row's score**, on the
one measure above. Otherwise the seat stands and the looks are discarded. `down` is tried first and wins ties
(`underlay-looks.ts:19`, `underlay-choose.ts:5`), and it shifts the cut half a space further into the line, so a tie
must not replace.

`scoreLook` (`underlay-choose.ts:29-36`) moves to the same measure. **It keeps scoring a look by its FIRST Russian
row**, because `underlay-page.ts:319-320` still seats from the first Russian row, which is the dependency
`underlay-choose.ts:6-7` states in the tree's own words. Only the measure changes, never which row is scored.

### Step 3, the fallback takes the best qualifying row

`underlay-fallback.ts:60-66` returns the row with the highest score among those that qualify, instead of the first.
Ties go to the higher row, so today's behaviour is what a tie falls back to.

**`underlay-page.ts:319-320` is not touched.** r1 proposed changing it; that would have taken first-verse seating out
of Ilya, which the tree states at `underlay-page.ts:20-22` and pins at `underlay-page.test.ts:93-98`, and on a
strophic print with verses stacked under one staff each system could then seat a different verse. **On this page the
first-wins rule is already right on 15 of 16 systems once the top row passes, so changing it buys nothing.**

### Step 4, Ilya records which row it read

Where a system holds more than one row, the system records which row was seated and how it was chosen.

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

1. **Every one of the 16 systems on Nightingale page 4 is seated, and each is seated from the key's row**, read from
   the seating's own output and never from a harness copy of the rule. This is the item that cannot pass with the
   German line on system 9, and it replaces r1's items 1, 2, and 3, all of which could.
2. **System 16 is seated from the key's row**, and its seated text is reported, so a repair is told apart from the
   same noise row seated again.
3. **No system loses seated syllables**, on Nightingale page 4, song2 page 1, and the twenty control staves: the
   seated text per system is reported before and after, not just the row index.
4. **`underlay-page.test.ts:93-98` is green without being edited.**
5. **The second look's cost is reported**: the `second look` line's milliseconds and how many systems took looks
   (`underlay-reader.ts:169`, `:173`). `?looks=off` (`:38`, `:132`) turns the looks off, so the lane says what system
   9 does with the looks off, and the repair must not rest on step 1 alone.
6. All eight gates at baseline on the Mac; any baseline moved is reported with both figures.

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
