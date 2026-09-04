# Memo: N.111, the clitic seat. Increments 1 and 2. From Code

Written 2026-09-04 by Code, against
`docs/sessions/brief-n111-clitic-seat_r2_2026-09-03.md`, read in full.
Floor: `8fbc8d7`. Commit message: `N.111: the clitic seat`.

**Built: increments 1 and 2, in one commit. Increment 3, the hand, is NOT
built**, as instructed. Nothing was shipped and no git command was run.

**`claude/e24-the-unused-boolean_2026-08-04.md` is NOT READ.** There is no
`claude/` directory in this tree and no copy of that file anywhere under
`/Users/dannmitton`. Every E.24 citation below is the brief's quotation of it,
taken as the source on Dann's instruction, and is marked as such in the code.

---

## 1. What changed

| file | what |
|---|---|
| `apps/web/src/lib/shane/clitic-seat.ts` | NEW. `findCliticFolds` (`:108`) and `applyCliticSeat` (`:286`). The whole comparison and the whole seat |
| `apps/web/src/lib/shane/clitic-seat.test.ts` | NEW. Ten tests on the engraved fixture, with the negative controls |
| `apps/web/src/lib/shane/CliticSeat.svelte` | NEW. One sentence and one button per fold |
| `apps/web/src/lib/shane/ingestion/mini-dom.ts` | NEW. The dependency-free XML reader, lifted verbatim out of `recognized-to-musicxml.test.ts` so the app carries one copy rather than one per test file |
| `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml` | NEW. The fixture. See §6 |
| `apps/web/src/lib/shane/vowel-resolver.ts:137-152`, `:214`, `:233` | `ScoreWord.cells`, additive. Nothing else reads it and the resolver's behaviour is unchanged |
| `apps/web/src/lib/shane/vowel-resolver.ts:157` | `cleanForAlignment` is exported. Same function, same body |
| `apps/web/src/lib/shane/CorrectionSurface.svelte:65-78`, `:140`, `:764` | A `seat?: Snippet` prop, rendered at the foot of the LYRIC station in BOTH variants |
| `apps/web/src/lib/shane/ingestion/recognized-to-musicxml.test.ts:16` | Imports `parseXml` instead of carrying its own copy. Its 94 lines of mini-DOM are gone; no test in it changed |
| `apps/web/src/lib/i18n.ts:218-235` | Five new keys. See §4 |
| `apps/web/src/routes/+page.svelte:116-117` | The imports |
| `apps/web/src/routes/+page.svelte:332-373` | `cliticFolds`, `openCliticFolds`, `dockCliticFolds`, `handleCliticSeat` |
| `apps/web/src/routes/+page.svelte:3482-3486`, `:3948-3952` | The snippet, at both `CorrectionSurface` sites |

**Not touched, as the brief required:** `VocalLineEvent`,
`apps/web/src/lib/shane/reconciliation/`, `ParsedScore`. No phonological
predicate is hand-rolled: `isVowellessClitic`, `isProclitic` and `isEnclitic`
come from `pipeline.ts:927` and `:972`, which set them only off the engine's
own clitic tables. No `empty` pairing is ever written.

---

## 2. The §4 establishment, answered before any code was written

**Question 1: do `pairedCyrillic` / `withPairedVowel` already override the
file's underlay per event id at render time on a lyric-bearing score, or does
that path read the file's lyrics directly?**

**They override, and the override is unconditional.** The renderer reads
`options.cyrPreview?.[ev.id] ?? ev.syllable?.text ?? ''`
(`packages/score-parser/src/staff-renderer.ts:709`, identically `:2462`), so a
pairing wins over the file's own cell wherever one exists and the file's cell
shows through wherever one does not. The same shape holds for the IPA line
(`VoiceProfilePane.svelte:728-741`) and the acoustic vowel
(`withPairedVowel`, `pairings.ts:496`). Nothing needed changing to make the
seat visible; that is why increment 2 is small.

**One consequence, and it is the finding in §7.1:** on a lyric-bearing score
"undecided" does not draw bare. It draws the FILE'S text.

**Question 2: how does `vowel-resolver.ts` reconstruct the file's words today
(its move 2), so N.111 reuses that reconstruction?**

`collectScoreWords(parsed, verseNumber)` (`vowel-resolver.ts:198`) walks the
vocal line, opening a word on `whole`/`start` and closing it on `whole`/`end`,
reading the verse's syllable through `versesInfo` when present. Move 2 is then
one line: `processText(scoreWords.map((w) => w.raw).join(' '))`
(`vowel-resolver.ts:427`).

**N.111 makes the same two calls on the same reconstruction**, so the two
surfaces cannot disagree about the text. What it needed and `collectScoreWords`
did not give is the EVENT of a cell whose syllable carries no vowel: `slots`
counts nuclei, so «в» contributes no slot and its event id was dropped
entirely. That is correct for the resolver and useless here, so `ScoreWord`
gained `cells`, additive, taken before the merge that unshifts a vowelless
syllable's events onto a neighbour.

**A third thing had to be established and was not in the brief.** The
alignment cannot be strict one-to-one. A CORRECTLY engraved score puts «в бью»
in a single cell, so the file reads 38 words where the pipeline reads 39, and a
strict guard would refuse every correct engraving outright. `align`
(`clitic-seat.ts:153`) therefore uses the resolver's own join rule, one
pipeline word or two where the two clean to the file's one
(`vowel-resolver.ts:462-473`). A walk that loses sync returns null and proposes
nothing at all, which is stricter than the resolver's latch.

---

## 3. What the comparison does, in one paragraph

Reconstruct the file's words, run them through `processText`, build the queue
with `buildSlotQueue`, and align each score word to its pipeline word and its
span of the queue, carrying a running **offset** of cells minus slots. Offset
zero means the file and the queue agree; a vowelless clitic seated alone takes
it to one and it stays at one until the two re-align. A **clitic fold** is a
word with exactly one cell, no Cyrillic vowel in that cell, `isVowellessClitic`
true, a host in the direction the clitic table gives, a queue slot that
actually fused it, offset zero before and one after. Its **run** is every cell
from the clitic's own to the point where the offset stops being one, to the
next fold, or to the end of the queue. Everything else the walk finds is
withheld, exactly as the resolver withholds today. One-vowel-per-note is not
built.

---

## 4. New strings, every one of them, with its key

All five are ENGLISH ONLY. **French is owed**, and each carries the English in
both slots for the reason the N.108 block above it already gives: `t()` prints
`[MISSING: key]` for an absent variant, which would put that literal in a
French singer's drawer. That is not a translation.

| key | English |
|---|---|
| `clitic.alone` | `%s sits alone on a note.` |
| `clitic.seatWith` | `Seat it with %s?` |
| `clitic.moves` | `%s notes move.` |
| `clitic.movesOne` | `One note moves.` |
| `clitic.seat` | `Seat` |

The three sentence keys are the desk's own wording from brief §5.1, split
because the dictionary's `%s` habit carries one placeholder per entry and a
numbered second one would be a convention nobody ruled. The Undo pill reuses
`loupe.undo.lyrics` («syllables shifted»); no new undo string.

---

## 5. The gates

Run before any edit and again at the end.

| gate | baseline | after | |
|---|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` | at baseline |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` | at baseline |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same | at baseline |
| 4 web-test | `959 passed (959)` | **`969 passed (969)`** | **MOVED, +10** |
| 5 score-parser | `534 passed \| 5 skipped (539)` | same | at baseline |

**Gate 4's line in `~/Downloads/ilya-ship.sh:79` must read
`969 passed (969)` or the ship refuses.** The ten are `clitic-seat.test.ts`.
No other line of the ship script changes.

---

## 6. The fixture, and where it went

**`apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`**,
copied byte for byte from
`~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`
(121 624 bytes).

The brief offered `docs/sessions/fixtures/` or the existing fixture directory
if there is one, and said to say which. **There is one, and the fixture went
there:** `apps/web/src/lib/shane/ingestion/fixtures/`, which already holds
`recognized-mussorgsky-01-p1.json`. A test can read it from where it sits;
under `docs/` it would be reachable only by climbing out of the package.

**Nothing was shipped into `static/`.** The walk needed the file fetchable by
the browser, so a copy sat in the gitignored `apps/web/static/reader/` for the
build and **has been deleted**. `apps/web/build/` is gitignored.

---

## 7. The walk, on a local production build

`pnpm --filter @ilya/web build`, then `vite preview` on port 4173, restarted
after the build so it could not serve a stale one. Desk viewport 1500 × 950,
then the phone at 375 × 812.

Every reading below is the RENDERED underlay, read out of the score SVG's own
text nodes at the Cyrillic baseline, in x order. No console errors at any
point.

**Before.** Drop the file on the intake, Continue to analysis, Score markup.
The system carrying bar 8 reads:

> `пес ня у ны ла я;` **`в`** `бью щем ся серд це на деж да за вет на`

«в» alone on the E quarter, and every syllable after it one note late, which is
what Dann saw.

**The proposal.** Score markup, Corrections, at the foot of the LYRIC station:

> **в sits alone on a note. Seat it with бью? 59 notes move.** [ Seat ]

**After the press.** The same system reads:

> `пес ня у ны ла я;` **`в бью`** `щем ся серд це на`

and the next one begins `деж да за вет на я`. That is the printed score
exactly: «в бью» on the first quarter, `щем · ся · серд` on the other three,
`це` on the D eighth, `на` of надежда on the C eighth. The fused cell carries
U+00A0 between the two words, verified by code point. The IPA line moved with
it: `vbʲju` over the clitic's note.

**A correction to the brief, and it is only the bar number.** Brief §6 expects
`я,` on "the last F eighth of bar 8". Bar 8 has no F eighth; the file's bar 8
is `E C D F` quarters, a D eighth, two rests and a C eighth. `я` lands on the
**second F eighth of bar 9**, which is where the print puts it. Everything else
in §6's expectation is met verbatim.

**The reload holds.** After `location.reload()` the system still reads
`… я; в бью щем ся серд це на`, and the proposal stays retired, because a fold
whose clitic note already carries the fused text is answered.

**Undo works.** The dock's pill reads `↰ Undo: syllables shifted`; pressing it
restores the file's own seating and brings the proposal back.

**On the note, on the phone.** With the E quarter taken, the loupe's dock
carries the same sentence and the same button, and pressing it there seats the
clitic and updates the loupe in place: the dock's readout becomes
`E3 · Quarter · в бью`. **Positive and negative control both run:** with the
clitic's note taken there are two `.clitic-status` elements in the DOM, one in
the drawer's panel and one in the dock; with the D3 eighth taken there is one,
in the panel only.

### 7.1 THE ONE FINDING, and it is visible on the last note

**The last note of the piece now reads `ка` twice.**

The file carries 96 lyric cells and the text carries 95 nuclei, so the seat's
run stops one cell short of the end. The brief rules that leftover note
UNDECIDED, never `empty`, and that is what is written. **But undecided does not
draw bare on a lyric-bearing score.** Per §2, the renderer falls back to
`ev.syllable?.text`, so the note keeps the file's own `ка` while the note
before it has just taken `ка` from the queue. The final system reads:

> `ночь о ди но` **`ка ка`**

with no IPA over the second one, since nothing was paired there.

**This is not a bug in the seat; it is the arithmetic being honest.** The
engraving spent one note on «в» that the print did not, so after the repair one
note at the end has no syllable left. The print almost certainly slurs `ка`
across those two notes.

**It is Dann's to rule, because both ways out are things Ilya is forbidden to
do on its own.** `empty` is refused by E.46. A `melisma` pairing is what the
music actually is, and `firstPass`'s own doc comment says "IT NEVER CREATES A
MELISMA (Dann, E.46)". **My recommendation: let the seat write a `melisma`
pairing on the one note the run leaves over, and only there.** It is not a
guess about text; it is the direct consequence of a rule he has already ruled
has no exceptions, and it is the only reading under which the note count and
the syllable count can both be right. I did not build it, because reversing a
ruling of his is not mine to do.

### 7.2 A second, smaller finding: the re-seated cells lose their punctuation

The file's cell reads `я,`; the queue's slot reads `я`, because
`cyrOfSyllable` slices `cleanWord`, which has had punctuation stripped. Every
cell the seat rewrites therefore loses any comma or semicolon it carried, and
the ones before the fold keep theirs. On this file that is four marks.

**Not fixed here.** Carrying the file's punctuation across is new behaviour on
a path shared with `firstPass`, which has always placed unpunctuated slots, and
the brief did not ask for it. Worth an inbox line.

---

## 8. DESK DEFAULTS, all reversible, waved off freely

1. **The proposal sits at the FOOT of the LYRIC station**, after the two shift
   rows, in both containers. Dann ruled that station's arrangement on his walk
   of `2238e8b` (boxed text, then the shift rows); appending is the only
   placement that does not reorder a ruled arrangement.
2. **The dock offers only the fold on the taken entry; the drawer offers them
   all.** The dock is about the note in hand.
3. **A seated fold retires itself** by comparing the clitic note's pairing to
   the fused text. The comparison reads the file, which never changes, so
   without this the proposal would stand forever.
4. **The button is `VoiceAnchor`'s pill** in geometry, fill, type and its
   44 px coarse-pointer floor, so the drawer keeps one button shape.
5. **The count printed is `fold.seat.length`**, the number of notes the press
   rewrites, so the number the singer reads and the number the press moves are
   the same by construction. On this file it is 59, not the brief's
   illustrative 5.
6. **The mini-DOM reader moved to its own module** rather than being copied a
   third time. One implementation in the app; the score-parser package still
   carries its own, untouched.

---

## 9. NOT ESTABLISHED

**"NOT ESTABLISHED beats a complete invented answer."**

- **`claude/e24-the-unused-boolean_2026-08-04.md` is not read.** No such file
  exists on this machine. Its §5, §6 and §7 are cited here and in the code only
  as the brief quotes them.
- **What the printed score does with the last two notes of the piece** is not
  established. I have not read the photograph
  (`docs/sessions/n111-sunless-01-p63_2026-09-03.jpg` shows p. 63, which is the
  opening, not the close). §7.1's "almost certainly slurs" is an INFERENCE from
  the note and syllable counts, and it is named as one.
- **Whether the correction count should rise by the number of notes the seat
  moved** (brief §5.2) is not established, and it does not rise. That counter
  reads `doc.corrections`, the note-correction map, which the seat does not
  touch; a pairing is not a correction anywhere else in the tree, and making
  this one count as 59 would be a new meaning for a shipped number. Raised
  rather than decided.
- **A score with more than one fold has no test.** The code handles it (a run
  ends at the next fold's clitic) and nothing exercises it, because no file to
  hand carries two. Stated rather than claimed.
- **An ENCLITIC fold has no test either.** The direction is read from
  `isEnclitic` and the fused slot from the host's LAST slot, which mirrors
  `buildSlotQueue`, and no fixture exercises that half.
- **Performance was not measured.** `findCliticFolds` runs `processText` once
  per ingested score, derived on `ingestedScore` rather than per render, and
  `buildUnderlayResolvers` already makes the same call on the same text. No
  slowness was observed on this 96-note score; nothing was timed, so nothing is
  claimed.
- **The exact untracked set is from the session-opening `git status` snapshot
  plus the files I made.** I did not run git, so I cannot confirm nothing else
  became untracked in between.

---

## 10. Before the ship

**Gate 4's expected line must move first**, or the ship refuses:

`~/Downloads/ilya-ship.sh:79` — `"959 passed (959)"` becomes `"969 passed (969)"`.

**Then the untracked files.** The ship script refuses outright on any untracked
file, so all seven need adding:

```bash
git -C ~/Desktop/ilya-rewrite add apps/web/src/lib/shane/clitic-seat.ts apps/web/src/lib/shane/clitic-seat.test.ts apps/web/src/lib/shane/CliticSeat.svelte apps/web/src/lib/shane/ingestion/mini-dom.ts apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml docs/sessions/brief-n111-clitic-seat_r2_2026-09-03.md docs/sessions/n111-sunless-01-p63_2026-09-03.jpg docs/sessions/memo-n111-clitic-seat_r1_2026-09-04.md
```

**One more untracked file, and it is YOURS to decide, not mine.**
`docs/sessions/_to_delete/brief-n111-clitic-seat_r1_2026-09-03.md` is revision 1
of this brief, moved there by the desk to be deleted. The ship refuses while it
sits untracked, so it is either committed or removed, and removing it is
irreversible:

```bash
rm -rf ~/Desktop/ilya-rewrite/docs/sessions/_to_delete
```

That is what I would run, since `_to_delete/` means deleted and committing it
would mean the opposite. Say the word and I will, or add it instead.

**Also already modified, by the desk and not by me, and `git add -u` will stage
them with the rest:** `docs/memory/INBOX.md`, `docs/memory/STATE.md`.

Then:

```bash
sh ~/Downloads/ilya-ship.sh "N.111: the clitic seat"
```

---
*Increment 3, the hand, is not built and is not started.*
