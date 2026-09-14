# Memo from Code: N.118, punctuation travels in the slot

**Answers** `brief-n118-punctuation-travels_r1_2026-09-12.md`, read in full this
session, with the four amendments Dann gave on 2026-09-14. `CONTRACT.md` was read
in full first.

**Tree.** Branch `Shane`, HEAD `e973afc` (N.134, committed, not shipped). The
only other change in the tree is one untracked file that is not mine,
`docs/sessions/brief-colour-stage4_r1_2026-09-14.md`. Nothing is staged and
nothing is committed. No git command that writes was run.

---

## 1. Gates

| gate | baseline | after N.118 |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216) |
| dictionary | 235 passed (235) | 235 passed (235) |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |
| web-test | 1131 passed (1131) | **1144 passed (1144)** |
| score-parser | 547 passed, 5 skipped (552) | 547 passed, 5 skipped (552) |

**Web-test moves 1131 to 1144.** The 13 new tests are in
`punctuation-slot.test.ts`, and every test passes. `~/Downloads/ilya-ship.sh:79`
reads `gate 4 web-test "1131 passed (1131)"`, so the script refuses this ship
until that line moves to 1144. I did not edit the script, per amendment 2.

**Instrument.** I did not re-run the baseline column in this session. It is
read from `ilya-ship.sh:79` for gate 4, and from the N.134 session's own run for
all five, which was on the same code that is now `e973afc`. The after column
was run twice in this session: once after the build, and once after the
comment-only citation repairs in §2.3. Both runs gave the same numbers.

## 2. What changed

### 2.1 The build

| file | change |
|---|---|
| `apps/web/src/lib/shane/pairings.ts` | `buildSlotQueue` (`:201`). The word's last syllable gets `WordStackData.punctuation` (`:237-238`). A vowelless clitic's text carries its own punctuation (`:216`). An enclitic joins a hyphen-ending slot with no space (`:220-221`). The doc comment at `:184-199` says so. |
| `apps/web/src/lib/shane/clitic-seat.ts` | `isCliticSeated` (`:391-403`) ignores trailing punctuation when it compares. §4.2 gives the reason. |
| `apps/web/src/lib/shane/punctuation-slot.test.ts` | **new**, 13 tests |

**The test fails on today's tree.** Run against `e973afc` before the build,
12 of the 13 failed. The one that passed is "the fold carries the punctuation
once, never twice". It passes today because `carryPunctuation` already puts
the file's mark on the fold's seats, and it stays as the guard against a
doubled mark now that the slot carries one too.

### 2.2 DESK DEFAULTS

- **A vowelless clitic's own punctuation follows its own text inside the fused
  slot, in the order the poem wrote it.** Examples: `да б,`, `В, бью`, `да, б`.
- **An enclitic after a hyphen joins with no space.** The pipeline leaves the
  hyphen on a host it split off a particle, so `места-б,` gives `та-б,` rather
  than `та-` + NBSP + `б,`.
- **The `isCliticSeated` guard** in §4.2.

### 2.3 Citations repaired by name

My edit shifted line numbers in `pairings.ts`. Nine citations into it gave a
number, and **every one was already stale before this change**. Each one already
named its function, so I replaced the number with the name:

- `i18n.ts`, the `savePairings` note
- `library/driver.ts`, two notes
- `library/types.ts`, two notes
- `library/library.ts`
- `SyllableStation.svelte`
- `clitic-seat.ts` header
- `+page.svelte`, the Shift Lyrics note

These are comments only. The second gate run covers them.

## 3. The brief's citations and the amendments, checked this session

| claim | status |
|---|---|
| `cyrOfSyllable` slices `cleanWord`, `pairings.ts:152-160` | **holds** (`:152-160`) |
| `cleanWord` is "Cyrillic stripped of punctuation and dashes", `types.ts:48-49` | **holds** (`:48-49`) |
| `WordStackData.punctuation`, `types.ts:50-51`; `cyrillic`, `:46-47` | **holds** |
| `pairedCyrillic` overrides mapped ids only, `pairings.ts:694-705` | **held** before the edit (`:694`); now `:715` |
| `applyBlank` writes an explicit empty string, `pairings.ts:703` | **partly.** `:703` was the call inside `pairedCyrillic`. The write was `:782` and is now `:803`. |
| N.113b's word-position comment, `pairings.ts:713-720` | **held** (`:712-720`) before the edit |
| `buildSlotQueue` at `:184`, `pendingCyr` at `:187-190` | **held** before the edit; now `:201` and `:204-207` |
| `underlay-widths.ts:53`, `:61`, `:690`, `:826-831` | **holds, at a path the brief did not give:** `packages/score-parser/src/underlay-widths.ts` |
| Amendment 1: N.134 did not touch `pairings.ts` | **holds.** `git show --name-only e973afc` lists six code files and one memo, and `pairings.ts` is not among them. |
| Amendment 3: `refreshPairings` overwrites a stored seat's text | **holds.** `pairings.ts:402` (was `:381`) replaces a seat's text when the slot is the same word and `current.cyrillic !== p.cyrillic`. The page reads that result: `+page.svelte:412` (`shownPairings`) feeds `VoiceProfilePane`, whose `cyrPreview` is `pairedCyrillic(pairings, blankUnderlay)` (`VoiceProfilePane.svelte:821`). The renderer draws `cyrPreview` first (`staff-renderer.ts:2546`). |

**Amendment 3 in practice: fixing the queue fixed the display.** No rendering
code changed. The N.134 walk song in the pane's library stores 14 seats with
punctuation. On 2026-09-14 it drew 0 marks. With N.118 it draws 14 (§5, walk 1).
A seat stored before N.118 without a mark is brought forward on the page by the
same refresh, and a test pins that.

## 4. The §3 clitic finding, and the §4 proof

### 4.1 Can a clitic end a word that carries punctuation?

**Yes: a vowelless clitic is itself a whole word, so it can carry the
punctuation.** The engine's vowelless clitics are `в к с` (proclitic) and
`ль ж б` (enclitic), read from `GraysonEngine.cliticData` in a probe run. The
pipeline sets `punctuation` on them like any word. Measured on `e973afc`, before
the build:

| poem | clitic | queue before N.118 | queue after |
|---|---|---|---|
| `Когда б, я пришёл` | `б,` enclitic | `да б` | `да б,` |
| `Когда, б я` | `б` attached by the queue's fallback (`pairings.ts:217`), host punctuated | `да б` | `да, б` |
| `места-б, мне` | `б,` after a hyphen | `та б` | `та-б,` |
| `В, бью` | `В,` proclitic | `В бью` | `В, бью` |

What I did is in §2.2. The pipeline refuses an enclitic after a punctuated host
(`pipeline.ts:823-828`, the `prevHasPunct` guard). The queue's own
fallback still attaches one (`pairings.ts:217`), which is why row 2 exists. A
proclitic at the end of a line, with no nucleus after it, is still dropped with
its punctuation. That was true before N.118 and is unchanged.

**The fixture has no clitic carrying punctuation.** Its one vowelless clitic is
`в`, which carries none.

### 4.2 A trap the brief did not name, guarded

`isCliticSeated` compared the stored seat's text with the fold's text exactly
(`clitic-seat.ts:393` before the edit). With N.118, a fold whose host ends its
word (`в ночь,`) builds its seat with the comma. A seat stored before N.118 has
no comma. The exact comparison would call that seat unseated.
`seatCliticFolds` (`clitic-seat.ts:437`) would then rewrite every note in the
run on the next arrival, restore, or re-seat, the singer's corrections included.
The comparison now ignores trailing punctuation on both sides, and a test pins
it.

**It does not bite on Without Sun no. 1**, whose fold seat is `в бью`, which is
not word-final. It is guarded for any other song with that shape. Read from
code, not walked in the browser.

### 4.3 Proof that no hyphen or extender decision changed

1. **By reading.** `pairedSyllableType` (`pairings.ts:758-780`) reads only
   `p.kind`, whether `p.cyrillic` is empty (`:765`, `:772`), and `p.origin`
   (`:762`, `:777`). A seat's text is never read past emptiness, and a syllable
   seat's text is never empty. The renderer takes the word position from
   `sylTypePreview` (`staff-renderer.ts:2565`) and the text separately
   (`:2546`). `SyllableStation`'s drawer hyphen reads `origin` too
   (`SyllableStation.svelte:138-141`).
2. **By test.** "leaves the word position every hyphen and extender reads
   exactly as it was" builds one map with punctuation and the same map with it
   stripped, and asserts that `pairedSyllableType` returns identical results.
3. **On the page.** In walk 2, the melisma press on a note holding `я,` drew the
   extender after `на`, with the melisma note blank (§5).

## 5. Definition of done, walked in the browser pane

The fixture is `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls
(engraved).musicxml`, staged in the gitignored `apps/web/static/reader/`, and
deleted afterwards. Every song used lives only in the pane's own library, and
Dann's library is not in this browser. **The staging needed a second attempt:**
`pnpm dev` empties `static/reader/` at startup, so the copy I made before
starting the server was gone and the upload read HTML. I re-staged the file after
the server was up.

### Walk 1. A song seated entirely by N.134

This is the N.134 walk song, reopened. It has 95 of 95 slots placed and 14
stored punctuated seats.

- **Expected:** 14 marks draw, and `m17-1-2` stays bare.
- **Observed:** 95 Cyrillic cells on 96 notes, **14 marks** (`я, я, я; я, я;
  я, я; я, я; е; я, я. на, я,`), and the last drawn cell is `ка`. Before N.118,
  on 2026-09-14, the same record drew 0.

### Walk 2. Placed cells against unplaced cells (amendment 4)

**How I got a partly placed song:** on a new song, I pasted the score's own text
into the box, then dropped the file and answered **Put it in this song**. A box
with text blocks the N.134 fill and seat. Only `seatCliticFolds` places, and it
places from `в` to the end.

**Expected:** `59 / 95 placed`. The 36 unplaced notes draw the file's cells with
7 marks, and the 59 placed notes draw the queue's text with 7 marks.

| step | expected | observed |
|---|---|---|
| arrival | `59 / 95`; unplaced 7 marks, placed 7 | **`59 / 95 placed`; unplaced `я, я, я; я, я; я, я;`; placed `я, я; е; я, я. на, я,`.** Same form on both sides. |
| **re-seat:** append ` я` to the poem | `я` takes the open `m17-1-2`; `60 / 96`; 14 marks survive | **`m17-1-2` = `я`; `60 / 96 placed`; 96 cells; 7 plus 7 marks; stored `я,` seats unchanged** |
| **shift:** loupe on `m8-5-4` (`я,` of `заветная,`), Syllables to the end of the lyric, forward | `я,` moves to `m9-0-1`; `m8-5-4` undecided | **`m9-0-1` = `я,`; `m8-5-4` undecided; page 95 cells, 14 marks** |
| shift back | restores | **`m8-5-4` = `я,`, `m9-0-1` = `быст`, 14 marks** |
| **melisma:** Melisma on `m8-5-4` | `m8-5-4` = melisma and draws nothing; `я,` moves to `m9-0-1` | **`m8-5-4` = `melisma`; `m9-0-1` = `я,`; page 95 cells on 96 notes, and every other note carries a seat; 14 marks; the loupe shows `на` with an extender and nothing under the melisma note** |

So the same syllable, `я,` of `заветная,`, survived placement, a shift, and a
re-seat. A melisma-blanked cell drew nothing. The forward shift also pushed the
appended `я` off the end of the line, which is `shiftToEndOfLyric`'s documented
displacement and not N.118's.

**Placement by the hand** (arm a slot and click a note) was not walked. Its
code path copies `slot.cyrillic` (`+page.svelte:627`), like `firstPass`, and the
placement test covers `firstPass`.

## 6. For Dann: punctuation that is not trailing, unanswered and not fixed

**What the tree does today**, measured through `processText` and
`buildSlotQueue`:

| written | `punctuation` | what the slot carries | what is lost |
|---|---|---|---|
| `«Ночь»,` | `,` | `Ночь,` | both guillemets |
| `ночь!»` | empty | `ночь` | the `!` as well as the `»`, because `TRAILING_PUNCT_REGEX` (`pipeline.ts:47`) has no `»`, so the match stops |
| `ночь…` | empty | `ночь` | the ellipsis; `…` is in `PUNCTUATION_REGEX` (`:46`) but not in the trailing set |
| `(ночь)` | empty | `ночь` | both parentheses |
| `кое-что` | empty | `ко` `еч` `то` | the internal hyphen; the syllabifier also divides across it |
| `тень — не` | n/a | `тень` `не` | the free-standing dash; a token with no letters is dropped at `pipeline.ts:213-216` |
| `велит-ли` | `-` on `велит-` | `лит-` then `ли` | nothing lost; the host's hyphen now draws inside its cell |

**In his three scores:**

- **Which three scores are "his three" is NOT ESTABLISHED.** `STATE.md` says "all
  three of Dann's own scores carry lyrics" without naming them.
- **Sunless no. 1, the engraved MusicXML: none.** Its Cyrillic verse uses only
  `,`, `;`, and `.`, read from all 192 `<text>` elements of the file. Verse 2 is
  IPA.
- **The `.musx` files in `~/Downloads`** (Sunless no. 4, Kabalevsky T05 and
  T09): NOT ESTABLISHED. Their `score.dat` goes through the denigma WASM route in
  the browser, which I did not run.

## 7. The separate question: does the last note draw bare, and why

**Expected, stated before measuring:** it draws bare. The cause is
`seatCliticFolds`, and the missing `я` is not the cause.

**Measured:** the file's vocal line has **96 pitched notes and 96 lyric cells**,
which confirms the desk's count. The last note is `m17-1-2`, and the file's cell
on it is `ка`, the last syllable of `одинока`. The file has no note carrying
`я`, and nothing in the file is bare.

**The mechanism, which is the right explanation:**

1. The file spends a note on `в` alone (`m7-0-1`). That note owns a cell but no
   slot, so from `в` on there are 60 cells for 59 slots.
2. `foldAt` seats the run cell by cell: the clitic's note takes the fused
   `в бью`, and each later note takes the next slot
   (`clitic-seat.ts:294-306`). The queue runs out one cell before the cells do.
3. The cell left over is `m17-1-2`, which goes into `blanked`
   (`clitic-seat.ts:312-315`). The comment there names this note.
4. `blankUnderlay` adds it while it is undecided (`+page.svelte:477`). On a
   fully placed song, `vacatedNotes` adds it too, because the queue is exhausted
   (`pairings.ts:602`, read at `+page.svelte:492`).
5. `pairedCyrillic` writes `''` for it through `applyBlank` (`pairings.ts:803`),
   and the renderer draws `''` (`staff-renderer.ts:2546`).

**Measured result:** `ка` draws one note earlier, on `m17-3-8`, and `m17-1-2`
draws nothing.

**The missing `я` is not why the note is bare.** The engraving has no note for
it, so it takes no note away. The poem lacks it too, so the queue has no slot
that could fill the note afterwards, which is why nothing refills it. My N.134
return linked the two ("the missing `я` shows on the page instead"), and that
link was wrong. Walk 2 shows it: once `я` is appended to the poem, the re-seat
puts it on `m17-1-2` and the note draws.

**So yes: a note that carries a syllable in the file draws nothing on Ilya's
page.** `m17-1-2` carries `ка` in the file and draws bare on the page, because
the clitic fold ruled by Dann on 2026-09-04 moved `ка` one note earlier.

According to the comment at `clitic-seat.ts:309-311`, the print does not spend a
note on `в`. I did not check that against the printed page in this session.

## 8. NOT ESTABLISHED

- Which three scores are "his three", and whether the `.musx` files carry
  non-trailing punctuation (§6).
- **Hand placement** of an armed slot on a note was not walked in the browser.
  It is covered by reading `+page.svelte:627` and by the `firstPass` test.
- **The `isCliticSeated` guard** was not walked on a real song with a fold on a
  word-final host. No such song is to hand.
- **The comma's width** is priced from the Source Serif 4 table
  (`underlay-widths.ts:690`, `estimateCyrillicWidthPx` at `:826-831`) while the
  page draws Source Sans 3. It carries the same error as every other character,
  and I did not remeasure it, per the brief.
- **Whether the print puts `я` on the last note.** It is inferred from the
  comment at `clitic-seat.ts:309-311` only.

## 9. Found in passing, not changed

- **Switching songs from Repertoire left Score markup reading "Calibrate your
  voice to begin"** with no notation until I reloaded the page. After the
  reload, the song's score drew. Seen once, and the cause was not investigated.
- **`carryPunctuation` in `score-seat.ts` and `clitic-seat.ts` is now a no-op on
  a fixture like this one**, because the slot already carries the mark. It still
  matters where the poem's punctuation and the file's differ, which is N.134
  increment 2.
