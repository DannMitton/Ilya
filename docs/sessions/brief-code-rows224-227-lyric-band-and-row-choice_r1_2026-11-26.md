# Brief r1: the lyric band cuts the Russian line, and the row Ilya chooses (QUEUE rows 224 and 227)

2026-11-26, written by the desk (Opus 5) for Code on Dann's Mac. Branch: cut from `Shane` at `ebc3a8b7` or later.
Serves QUEUE rows 224 and 227. Row 224 is the repair; row 227 is the guard that stops the same fault choosing a
language. Everything cited below was read from the tree this session.

## What a singer meets, and why this lane exists

She opens a scan of Alyabyev's «Соловей», page 4 of the Jurgenson print, where seven verses are written out as their
own systems with Russian above and German below on every system. MELODY draws her song. On bars 67 to 73 the words
under the notes read `а-и Фе е-ёй е – ка" а-и а-а зе Ѣѳ! vсѢи –`, with IPA seated under that, where the page prints
«По-бы-вай во всѣхъ стра-нахъ». Those are not her words and that is not her language. Looked at in the running app
by the desk 2026-11-26 23:0x, on the branch alias, from `nightingale-p4-only.pdf`.

Every other system on that page gives her the printed Russian. One system gives her the German line, transcribed as
though it were Russian, and nothing on the page tells her which line Ilya read.

## The chain, each link read this session

1. **The band's top edge lands on the words.** `underlay-band.ts:98` sets the band's top at `bottom + MARGIN * space`
   with `MARGIN = 1.5` (`:27`). On Nightingale page 4 the first row of words starts within 1 px of that edge in 16 of
   16 systems, and on song2's first system the edge runs through the middle of the letters (lane reports
   `report-code-staff-finder-light-scan-0c_r1_2026-11-26.md` section 3, `..._0e_r1_2026-11-26.md` section 1).
   **`MARGIN` is Dann's ruled proportion** (2026-10-28 15:57, `INBOX.md`: the area for inspection is 1.5 spaces under
   the vocal stave to 1.5 spaces above the piano staff below it), and it also sets the band's lower edge (`:101`) and
   where `topLineBelow` starts its search (`underlay-below.ts:65`). **The number is not the defect and is not what
   this lane changes.**
2. **The cut row fails the Russian test.** On system 9 the Russian row at y 3047 reads
   «иш пы наи ноа невхъ стри нахъ, нъде - ренв - няхъ и нъ г» пшоюо дахъ:» and `rowLanguage` does not call it Russian
   (`step3-rows.out.txt`, system 9).
3. **The fallback takes the first row that qualifies, not the best one.** `underlay-fallback.ts:60-66` returns the
   first row, top to bottom, whose sewn words hold `MIN_WORDS` known words and pass `rowLanguage`. On system 9 that is
   the German row at y 3082.
4. **Being seated erases the signal that something went wrong.** `underlay-page.ts:413` sets `why: seated ? null :
   ...`, so a system seated by the fallback carries `why = null`.
5. **So the second look never runs.** `underlay-reader.ts:132` collects only systems where `why === 'no Russian row'`.
   The `wide` look (`underlay-looks.ts:39`, `WIDEN = 1` at `:25`) raises the band's top by a staff space and on song2's
   system reaches the whole line, which is exactly the rescue this system needed. It is never offered one.

**Link 4 and link 5 are new. Neither row recorded them**, and without them a repair aimed at links 1 to 3 alone would
leave the rescue path still switched off for every fallback system.

## What the share of Cyrillic letters cannot do here

`OPEN.md`, VERSES WRITTEN OUT item 5 carries Dann's ruling of 2026-11-25 02:16: Ilya transcribes the line with the
highest share of Cyrillic letters. **That measure cannot separate these two rows.** The scan reader runs one language
and it is Cyrillic only: `underlay-recognize.ts:31` sets `UNDERLAY_LANG = 'rus_prereform_r2_29000'` and `:120` is its
only use, so a German line is read back in Cyrillic too. Measured across the page: of the 41 rows the reader found,
**all 41 are 100 per cent Cyrillic with zero Latin letters**, the 16 German lines included; on system 9 both rows
score 1.000.

**His rule holds where the underlay arrives as real text**, as in a MusicXML file whose lyrics carry German words, and
it is implemented there, not here. On the scan path the measure this lane uses is **how much of a row the Russian
dictionary actually seats**, which `underlay-fallback.ts:62-63` already computes and throws away. Desk departure under
`CONTRACT.md` tether 19; the reason of his rule, prefer the Russian line, is what is kept.

## Scope

**In:** the lyric band's top edge on a scanned system, the row a system is seated from, the trigger for the second
look, and a line that tells the singer which row was read where more than one was found.

**Out:** `MARGIN`'s value; the bar-line reader's ink level (row 218); the picture path's `hasStaves` gate (row 225);
`voiceBoxes` on a one-part page (row 226); the written-out verses themselves, which ride on this lane's result.

## Steps

### Step 0, measure only, keeps nothing, report before step 1

Answer the three things row 224 left NOT ESTABLISHED, on Nightingale page 4 and on song2 page 1, both:

a. **What the cut costs the reader.** For every system, run the recognizer on the band as it stands and on the same
   band with its top edge raised by one staff space, and report per system: the row text each gives, whether
   `rowLanguage` calls it Russian, and how many sewn words the dictionary knows.
b. **Where the first row's box sits against the band's top edge**, in pixels and in staff spaces, for every system.
c. **Whether any other page in the project's sets is clipped the same way.** Run the same edge measure over the sets
   the staff finder lane already had staged and report the count and the pages.

Report. Do not change code in step 0.

### Step 1, the row's top comes from the ink

The band's top edge is a proportion and the words' top is evidence, so the row's extent is taken from the ink rather
than from the edge (`CONTRACT.md` section 0.2). A row whose box touches the band's top edge grows upward until the ink
above it stops, bounded so it cannot reach the staff's own bottom line. `MARGIN` is not changed and the band's lower
edge and `topLineBelow` are not touched.

### Step 2, a system seated by the fallback is still a system that was looked at once

`underlay-reader.ts:132` gains the fallback case: a system seated by `fallbackRow` is offered the same four looks as a
system with no Russian row, and the look whose row the dictionary likes best is kept, by the path that already exists
(`underlay-choose.ts`). A system seated from a true Russian row is not looked at again.

### Step 3, the best row, not the first row

Both sites that choose a row take the best by the dictionary's own count rather than the first in the list:

- `underlay-page.ts:309`, which seats a system from its FIRST Russian row.
- `underlay-fallback.ts:60-66`, which returns the FIRST qualifying sewn row.

On a tie, the higher row wins, so today's behaviour is what a tie falls back to.

### Step 4, Ilya says which line it read

Where a system holds more than one row and Ilya seats one of them, the singer is told which, in a musician's terms and
on the page she is looking at. Dann's ruling of 2026-11-25 02:16 asks for this and it is unbuilt. **The English string
is the desk's to draft and the French is Dann's to rule, so step 4 carries no string: it carries the place the string
goes and the data behind it.** Report what the surface needs and stop.

## The numbers this lane changes, and every other site that computes them

`CONTRACT.md` section 4: a brief that changes how a number is computed names every other site that computes the same
number and says what depended on them agreeing.

The number is **which row of a system is chosen**. Three sites compute it:

1. `underlay-page.ts:309`, the first Russian row.
2. `underlay-fallback.ts:60-66`, the first qualifying sewn row.
3. `underlay-choose.ts:29-49`, `scoreLook` and `chooseLook`, which already take the row with the most known
   dictionary words.

**What depended on them agreeing:** `underlay-choose.ts:6-7` says in the tree's own words that `seatPage` seats a
system from its FIRST Russian row, and scores each look by that row for exactly that reason. **Change site 1 without
site 3 and a look is scored by a row the seating will not use.** Steps 2 and 3 move together or not at all.

## The grep that was run before proposing this

`CONTRACT.md` section 4: a brief that proposes new work names the grep it ran and what came back. Run 2026-11-26 in
`apps/web/src/lib/omr/`: `grep -n "fallbackRow\|rowLanguage\|russianRows"` across `underlay-page.ts`,
`underlay-choose.ts`, and `underlay-language.ts`, and a full read of `underlay-band.ts`, `underlay-looks.ts`,
`underlay-fallback.ts`, and `underlay-choose.ts`. **The row-scoring this brief asks for already exists at
`underlay-choose.ts:29-49` and is not rebuilt**; steps 2 and 3 route the other two sites through the same idea.

## Done when, measured on the rendered page

1. On Nightingale page 4, **system 9 (bars 66 to 73) seats the printed Russian line**, and MELODY draws Cyrillic that
   matches «По-бы-вай во всѣхъ стра-нахъ» token for token against the print, looked at in the running app at the same
   width as step 0's look.
2. **System 16 (bars 122 to 129) no longer seats the noise row.**
3. Across the 16 systems, **the count of systems seated from a row that is not the printed Russian line is 0**,
   counted the way step 0 counted it.
4. **No system that reads the Russian line today loses it**, on Nightingale page 4, on song2 page 1, and on the twenty
   control staves the staff finder lane used.
5. All eight gates at baseline on the Mac. Any baseline the lane moves is reported with both figures.

A screenshot is not a done-when on its own: every count above comes from the harness, and the look in the app confirms
what the counts say.

## What could not be established, and what to do about it

- Whether the German rows that pass the Russian test on systems 2, 3, 10, 11, and 12 would still pass once step 1
  gives the Russian rows their full extent. Step 0 part (a) measures it.
- Whether any page outside the project's staged sets is clipped. Step 0 part (c) bounds it to what is staged.
- What a repaired reading does to the metre reader on this page. Out of scope here; row 218 holds it.

**NOT ESTABLISHED beats a complete invented answer.**

## Reporting

One report per step, written to `docs/sessions/` by the lane itself. Commit nothing. The lane stops and reports if a
step's measurement contradicts this brief's statement of the chain above.
