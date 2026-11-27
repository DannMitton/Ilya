# Review r1: brief-code-rows224-227-lyric-band-and-row-choice_r1_2026-11-26.md

2026-11-26, by Fable 5.2 (subagent), for the desk. Brief md5 `1a951462c1cf08fd8d929a686877b84f`, confirmed. Tree: branch
`Shane` at `ebc3a8b7`. Every line cited below was read in this session from that tree. No source file was changed and
no git write was run.

**The tree is not clean as stated:** `docs/memory/DANN.md`, `OPEN.md`, and `QUEUE.md` are modified and the brief is
untracked. No file under `apps/` or `packages/` is modified, so every code citation stands at `ebc3a8b7`.

## Verdict

**DO NOT SEND**

The chain (links 1 to 5) holds. The repair plan does not: step 3 removes first-verse seating, the brief's claim that row
scoring already exists is false, and done-when items 2 and 3 can pass with the fault on the page.

## Blockers

### 1. Step 3 removes first-verse seating, which Ilya ships and tests

- `underlay-page.ts:20-22`: "A system with several Russian rows is seated from the first, the top one, which is the
  first verse."
- `underlay-page.ts:319-320` (`if (seated) continue; seated = true;`) is the line that does it.
- `underlay-page.test.ts:93-98` pins it: rows «Wohl dem», «бала», «мир ты»; the seat is «ба-ла». «бала» holds 1
  dictionary word and the second verse below it («мир», «ты») holds 2. By "the best by the dictionary's own count",
  step 3 seats the second verse.
- Consequence on a strophic print with verses stacked under one staff: each system seats whichever verse counts
  highest, so verses mix from system to system. The brief does not mention stacked verses.
- The same change is latent harm on the brief's own page. `step3-rows.out.txt` shows the German row passing the
  Russian test beside the Russian row on systems 2, 3, 10, 11, and 12. Today row order protects them. Under step 3
  the count decides, and no count for those ten rows has been measured. NOT ESTABLISHED which row wins on each.

**What must change:** take site 1 (`underlay-page.ts:319-320`) out of step 3, or bound it by a margin that step 0
measures on all 41 rows and that keeps `underlay-page.test.ts:93` green. On this page first-wins is already right on
15 of 16 systems once the top row passes, so the site 1 change buys nothing here and risks the five systems above.
Best-of-qualifying inside `fallbackRow` alone is the smaller change.

### 2. The row scoring the brief says "already exists and is not rebuilt" does not exist

- `underlay-choose.ts:30-34`: `scoreLook` walks the rows, skips any that is not Russian, and RETURNS at the first
  Russian row. It scores one row, the first. It does not take the row with the most known words.
- `underlay-choose.ts:39-49`: `chooseLook` takes the LOOK with the highest score. It ranks looks, never rows.
- `underlay-looks.test.ts:79-82` pins this: "scores a look by its first Russian row ... not by a later one".
- Step 3 names two sites to change and leaves `scoreLook` alone. So after step 3 the seating takes the best row and
  `scoreLook` still scores the first. That is the disagreement the brief's own section "What depended on them
  agreeing" forbids. The brief breaks its own condition.
- "The dictionary's own count" is not one number in this tree. Three different measures exist:
  - `underlay-choose.ts:33`: raw words (not sewn) for which `wordKnown` is true.
  - `underlay-fallback.ts:63`: sewn words of two letters or more, KNOWN OR NOT (`wordKnown(...) !== null`).
  - `underlay-fallback.ts:47-51`: known LETTERS, inside `sewByDictionary`, never returned.

**What must change:** name one measure, in one exported function, and say that all three sites call it, `scoreLook`
included. Strike the sentence that the scoring exists. List the pinned tests that move: `underlay-page.test.ts:93`,
`underlay-fallback.test.ts:42`, `underlay-looks.test.ts:65` and `:79`.

### 3. Done-when 3 counts by a method step 0 never defines, and items 2 and 3 pass with the fault on the page

- Item 3 says "counted the way step 0 counted it". Step 0 parts (a), (b), and (c) measure the cut's cost, the box
  position, and other pages. None counts systems seated from a row that is not the printed Russian line.
- The only counter that exists is `measure-staff-finder-light-scan_2026-11-25/step3-rows.mjs`. Its "seated from" line
  is its own copy of the rule (`s.rows.find((r) => r.russian) ?? s.rows.find((r) => r.sewable)`), and it labels rows
  by `rowLanguage`. That label calls the German row Russian on systems 2, 3, 10, 11, and 12 and calls system 16's
  noise row Russian. A counter built on it reports the page as it stands today as one fault, and after step 3 it
  reports a row the seating no longer uses.
- Items 2 and 3 both pass if systems 9 and 16 seat NOTHING. Item 3 counts only seated systems. Item 4 protects only
  systems that read Russian today, and 9 and 16 do not.
- Item 2 ("no longer seats the noise row") also passes if system 16 seats its German row, or its imprint row
  (row 4, 74 letters). And if step 1 works, the repaired line is the same row as today's noise row, so the item as
  worded cannot tell repair from failure.

**What must change:** step 0 writes a key by eye from the crops: for each of the 16 systems, the y of the cut row
that is the printed Russian line. Item 3 becomes "16 of 16 systems are seated, each from the key's row", read from
the seating's own output, not from a harness copy of the rule. Item 2 says what system 16 seats (the key's row) and
what it reads.

### 4. Step 2 can replace a correct fallback seat, because the path it reuses never compares a look with the seat already made

- `underlay-reader.ts:149`: `chooseLook(candidates, seams)` compares the looks with one another only.
- `underlay-reader.ts:154` and `:160-165`: where any look passes, the system's ROWS ARE REPLACED by that look's rows
  and the page is seated again (`:167`).
- Today that is safe: the system had no seat. Under step 2 the system has one. The fallback exists for a row "the
  reader reads exactly and `rowLanguage` throws away" (`underlay-fallback.ts:5-6`), so a fallback seat is often
  right. A look passes on ANY row that passes `rowLanguage`, and on this page German read in Cyrillic passes it on 5
  of 16 systems.
- `down` is tried first and wins ties (`underlay-looks.ts:19`, `underlay-choose.ts:5`). It moves the cut half a space
  further into the Russian line.

**What must change:** step 2 states the rule for replacing: a look replaces the fallback seat only where its score,
on the one measure of blocker 2, beats the score of the row already seated. Add a done-when: no fallback-seated
system on the control pages changes its seated row unless the key says the new row is the Russian line.

### 5. Step 1 departs from Dann's ruling of 2026-10-28 15:57 and does not say so

- `INBOX.md:467`, his words: "the area for inspection was 1.5 spaces under the vocal stave ... the exterior
  horizontal stave lines should be the queivalent of bounding boxes, and rare ledger lines and the notes they
  correspond to should be ignored."
- The constant is untouched, and that is true of every step. But step 1 reads ink ABOVE the ruled edge, on the first
  look, bounded only by the staff's bottom line. The 1.5 spaces it enters are where ledger-line notes, stems, slurs,
  and hairpins stand, which is the ink his ruling names to ignore.
- The trigger fires far more widely than a cut. `underlay-rows.ts:185`: `y0: Math.max(0, Math.trunc(a - PAD *
  staffSpace))`. A row's BOX touches the band's top whenever its ink starts within 0.3 of a space of the edge, cut or
  not. "A row whose box touches the band's top edge" is therefore true of rows whose letters are whole.
- The brief declares one departure under tether 19 (the Cyrillic share). This is a second and it is not declared.

**What must change:** declare it as a departure and put it to Dann, or give the reason of his rule that step 1
keeps. Change the trigger from the box to the ink: the row's `core[0]` is band line 0 (`underlay-rows.ts:56`,
`:165`), which is the only evidence that ink runs through the edge.

## Amendments

1. **Link 3 misstates the fallback's test.** `underlay-fallback.ts:63` counts sewn words of two letters or more,
   known or not. The brief says "`MIN_WORDS` known words". Correct the wording.
2. **"`underlay-fallback.ts:62-63` already computes and throws away" is false as cited.** `:62` returns the sewn
   words; `:63` counts by length. The known-letters figure is at `:47-51` inside `sewByDictionary` and is not
   returned. A step that wants it must export it.
3. **Site 1 is cited at the wrong line.** `underlay-page.ts:309` is the language test. First-wins is `:319-320`.
4. **A row-choosing site the brief does not name: `underlay-page.ts:303`.** The fallback is consulted only where NO
   row passes `rowLanguage`. Where the cut Russian row fails and the German row passes outright, the German row is
   seated as a "true Russian row": `rescue` is null, `stats.systemsRussian` counts it (`:403`), `why` is null
   (`:413`), and step 2 ("A system seated from a true Russian row is not looked at again") gives it no second look.
   That is the reported fault by another door, and step 2's trigger misses it. It does not occur on this page today
   (systems 2, 3, 10, 11, and 12 seat row 1). Say so and say whether the lane covers it.
5. **Other sites that choose or carry the choice, to name under `CONTRACT.md` section 4:**
   - `underlay-reader.ts:154`, `:160-165`: the kept look's rows replace the system's.
   - `underlay-prepare.ts:238` and `:278`: the two `cutRows` call sites. Step 1 must change both, or the looks stop
     being cut "exactly as `prepareUnderlay` does them" (`underlay-prepare.ts:256-257`). Say what step 1 means on
     `up` and `wide`, whose window top is already higher.
   - `step3-rows.mjs` (the measure harness): its own copy of the rule, see blocker 3.
   - Comments that state the old rule and must move with it: `underlay-page.ts:20-22`, `underlay-choose.ts:5-7`,
     `underlay-fallback.ts:14-15`, `underlay-reader.ts:129-131`, `underlay-looks.ts:10-11` (the stated LIMIT of
     which systems get looks).
6. **Step 1's risks, none of which the brief names:**
   - `underlay-frame.ts:387-391`: the frame's scale is `inkHeight` over the crop's ink extent. A row grown into a
     notehead, stem, or slur has a taller extent, so every letter in it is framed smaller and reads differently.
     A row that reads right today can stop passing `rowLanguage` and its system falls to the fallback or to none.
   - `underlay-page.ts:228`: `inkHeight: DEFAULT_INK_HEIGHT / row.transform.scale` feeds `splitTokens`' call on
     which dash is a mark and which a joint. A changed scale moves hyphen and long-dash counts, and with them the
     extender gate.
   - `underlay-rows.ts:178`: a core over 1.6 spaces is split at its valleys. Growth applied after `cutRows` skips
     that split, so words and the ink above them stay one row.
   - "Until the ink above it stops" has no definition. Tie it to `cutRows`' own line test (`underlay-rows.ts:165`,
     ink on more than `LINE_SHARE` of the width) and say whether `MERGE_GAP` applies. A slur or beam under the staff
     can hold that test all the way to the bound.
   - Step 0 gains a part: for every system, the ink profile of the 1.5 spaces above the band's top, so the lane knows
     what step 1 will meet before it builds.
   - `offsetY` (`underlay-prepare.ts:240`, `:280`) has no reader outside `underlay-prepare.ts` (grep, this session),
     so a row top above the band breaks no consumer of it.
7. **Step 0 (b) measures the wrong object.** The box is clamped to the band's top (`underlay-rows.ts:185`), so
   "within 1 px of the edge" is true of whole letters too. Measure `core[0]` and whether band line 0 is ink.
8. **Step 2 and step 4 must not add a value to `why`.** `band-strip.ts:123` reads `written = s.why === null`;
   `kept-bands.ts:108` validates stored systems against null and three strings and rejects any other;
   `underlay-song.ts:105-107` carries `why` to the banner. A seated system keeps `why: null`. The fallback signal
   and step 4's "which row" go in a new optional field on `SystemWords` (`underlay-page.ts:172-188`), which the
   validator at `kept-bands.ts:101-110` does not inspect.
9. **Step 2's cost is not stated.** Each fallback system costs up to four further looks, and the page is decoded
   again (`underlay-reader.ts:27`, `:130`; `underlay.worker.ts:68-75`). Have the lane report the `second look` line's
   milliseconds. `?looks=off` (`underlay-reader.ts:38`, `:132`) turns step 2 off, so system 9's repair must not rest
   on step 2 alone.
10. **Done-when 1.** It does name the reported behaviour and cannot pass with the German line on bars 66 to 73.
    Two repairs: the opening says bars 67 to 73 and the item says 66 to 73 (`step3-summary.out.txt` gives 66 to 73);
    and "token for token against the print" is a reading standard no Russian row on this page meets today
    («со - ло - нен мо» for the first line). Gate on the row (the key's row is seated) and state the text standard
    as its own figure.
11. **Done-when 4 guards the row and not the reading.** A system can keep its Russian row and read it worse after
    step 1. Add: per system, the seated text before and after, with no system losing seated syllables. Whether the
    "twenty control staves" carry underlay at all is NOT ESTABLISHED; they are the staff finder's set.
12. **Done-when 5** is a regression guard and passes with the fault on the page, as any gate line does. No change.
13. **"It is implemented there" (the Cyrillic share on the MusicXML path) carries no line.** A grep of
    `apps/web/src/lib/score/ingestion` and `packages/score-parser/src` for a lyric-line chooser by Cyrillic share
    found none. Cite it or mark it NOT ESTABLISHED.
14. **The measurement's bound.** `step3-rows.mjs` prints `r.text.slice(0, 90)`. The 41-of-41 figure is over each
    row's first 90 characters. `QUEUE.md` row 227 says so; the brief drops it.

## The seven questions, answered

1. **Done-when against the reported fault.** Item 1: cannot pass with the fault on system 9. Item 2: can pass.
   Item 3: can pass. Item 4: can pass (regression guard). Item 5: can pass. See blocker 3.
2. **Capability deleted.** Yes: first-verse seating (blocker 1), and a correct fallback seat can be overwritten
   (blocker 4). On unseating: `fallbackRow` has one caller (`underlay-page.ts:303`); `scoreLook` and `chooseLook`
   are called only from `underlay-reader.ts:149`, `:151`; `seatPage` only from `underlay-reader.ts:128`, `:167`.
   Step 3 at site 1, built as "best of the rows that qualify, ties to the higher", cannot unseat a system that is
   seated today: the set of qualifying rows is unchanged and one is always taken. It can change WHICH row. Step 1
   can unseat (amendment 6, first point).
3. **The dependency.** The stated direction is true (`underlay-choose.ts:6-7`, `:30-34`). The brief's account of
   site 3 is false, and its steps break the dependency (blocker 2). Unnamed sites: amendments 4 and 5.
4. **The measurement.** TRUE, re-derived: 41 rows parsed from `step3-rows.out.txt`; every letter in every row is
   Cyrillic by Unicode name; Latin letters 0; rows with no letter 0. System 9: 48 of 48 and 29 of 29. Bound:
   first 90 characters (amendment 14).
5. **Step 1's risk.** Amendment 6 and blocker 5.
6. **`MARGIN`.** The constant is untouched by every step. Its only uses are `underlay-band.ts:98`, `:101` and
   `underlay-below.ts:65`. The band's lower edge and `topLineBelow`'s start do not move. The inspected area does
   move (blocker 5).
7. **Scope.** No step reaches row 218 (bar-line ink), row 225 (`hasStaves`, `reader/staff-detect.ts:112`), or row
   226 (`voiceBoxes`, `metre-model.ts:93`). Step 0 (c) runs a measure over staged sets and changes nothing.

## Citations checked

| Citation | Verdict | What I read |
|---|---|---|
| `underlay-band.ts:27` | true | `export const MARGIN = 1.5;` |
| `underlay-band.ts:98` | true | `const y0 = Math.ceil(bottom + MARGIN * space);` |
| `underlay-band.ts:101` | true | `y1 = Math.min(height, Math.floor(top !== null ? top - MARGIN * space : bottom + BELOW * space))` |
| `underlay-below.ts:65` | true | `const start = Math.max(0, Math.ceil(bottom + MARGIN * space));` |
| `underlay-fallback.ts:60-66` | partly false | First qualifying row, top to bottom: true. "`MIN_WORDS` known words": false; `:63` counts words of two letters or more, known or not |
| `underlay-fallback.ts:62-63` | false | `:62` sews; `:63` counts by length. No measure of how much the dictionary seats is computed there |
| `underlay-page.ts:309` | partly true | `else if (rowLanguage(words, seams.isWord) !== 'russian') continue;` The first-wins lines are `:319-320` |
| `underlay-page.ts:413` | true | `why: seated ? null : system.hasBand ? (noInk ? 'no ink' : 'no Russian row') : 'no band'` |
| `underlay-reader.ts:132` | true | `failing` keeps systems where `s.why === 'no Russian row'` and the system has a band |
| `underlay-looks.ts:25` | true | `export const WIDEN = 1;` |
| `underlay-looks.ts:39` | true | `look === 'wide' ? [y0 - WIDEN * space, y1 + WIDEN * space]` |
| `underlay-choose.ts:6-7` | true | "`seatPage` seats a system from its FIRST Russian row, so a look is scored by that row" |
| `underlay-choose.ts:29-49` | false | `scoreLook` returns at the first Russian row; `chooseLook` ranks looks. Neither takes the best row |
| `underlay-recognize.ts:31` | true | `export const UNDERLAY_LANG = 'rus_prereform_r2_29000';` |
| `underlay-recognize.ts:120` | true, one note | The only use as the model. `:127` also prints it in an error message |
| Link 2, system 9 row at y 3047 | true, from the dump | `step3-rows.out.txt`: row 1 unmarked, row 2 `sewable` at y 3082 |
| German passes on systems 2, 3, 10, 11, 12 | true, from the dump | Row 2 marked `russian` on each |
| 41 of 41 Cyrillic, 0 Latin | true | Re-derived, first 90 characters of each row |
| `INBOX.md` 2026-10-28 15:57 | true | `INBOX.md:467` |
| `OPEN.md` VERSES WRITTEN OUT item 5 | true | `OPEN.md:4935` and item 5 |

## What I could not establish

- Whether the band's edge cuts ink on any system. I read no pixels. The row dump shows each first row's y equal to its
  band's y0 on the systems the summary lists, which the clamp at `underlay-rows.ts:185` also produces for whole
  letters. The cut rests on the lane's reports 0c section 3 and 0e section 1, which I read as documents only.
- What any dictionary measure scores on any of the 41 rows. I did not run the dictionary. So: which row step 3 would
  take on systems 2, 3, 10, 11, and 12; whether any look gives system 9 a Russian row; whether step 1 makes system 9's
  or system 16's row pass.
- Which of system 16's four rows is the printed Russian line. Rows 1 and 2 stand 16 px apart (y 4763, y 4779), where
  the other systems' pairs stand 26 to 39 px apart.
- That `wide` reaches the whole line on song2's first system. `QUEUE.md` row 224 says so; no run of mine.
- Whether the Cyrillic-share rule is built on the MusicXML path (amendment 13).
- What the twenty control staves are and whether they hold underlay.
- Whether any page in the project's sets prints stacked verses that the current first-row rule seats correctly today.
  The rule and its test exist (`underlay-page.ts:20-22`, `underlay-page.test.ts:93`); a count of pages was not made.

## This review's own cost

17 tool calls. Elapsed time not measured.
