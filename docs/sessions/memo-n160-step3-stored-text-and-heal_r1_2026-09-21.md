# Memo: N.160 step 3 r1, the stored text and the heal that writes

**Written 2026-09-21 by Claude Code, answering `brief-n160-step3-stored-text-and-heal_r1_2026-09-21.md`.
Tree at `2fb7516`, branch `Shane`, plus this build in the working tree, uncommitted.**

**Status: WRITTEN, not DONE.** Every browser number here comes from the Sunless fixture on a
local production build (`ilya-prod`, port 4173), on fresh origins in the browser pane. Your
library was not opened. This closes when you open your Sunless song and see «Тень»,
«непроглядная», «безответная», and «Дума» carrying the poem, with acutes where Transcription
has them.

**Instruments.** I read these in full this session: `CONTRACT.md`, the brief, and
`first-seat.ts`. I read these ranges:

- `reseat.ts:1-80` and `:140-260`;
- `clitic-seat.ts:340-470`;
- `score-seat.ts:48-124`;
- `pairings.ts:389-404`;
- `library.ts:30-215`;
- `types.ts:60-100`;
- `document.svelte.ts:55-80` and `:130-305`;
- `driver.ts:245-285`;
- `+page.svelte:215-260`, `:620-680`, `:905-960`, `:1725-1770`, `:2457-2560`, `:2588-2605`,
  `:2990-3040`, `:3180-3230`, and `:3315-3400`.

The memos from steps 2 and N.160b were read earlier this session.

**Words.** *Seated text*, *the heal*, and *dry run* are adopted from memo-n160b. *Fold* is the
tree's own word for the clitic seat's run (`clitic-seat.ts`). `seatedTextDiff`, `applyHeal`,
`healLog`, and `healFrozenSeats` are new identifiers.

---

## 1. Brief §3, answered before the write path was built

### 1.1 What moved the count from 29 to 19

**No Notation switch rewrites a stored seat.** Measured on a frozen fixture (12 address, 85
kept): I flipped all seven switches on and off, then reloaded. The pairing map's hash was
`1488516506` before and after, and so was the stored map's. Open syllables saves the record,
because it is a stored field, but the map in that save was identical. In the code, no switch
handler reaches a writer of `doc.pairings`, and `transcribeText`'s only caller is `joinText`
(`+page.svelte:3030`).

**What did turn up is a load-time writer that rewrites up to 60 stored seats with no switch and
no edit.** Measured on the fixture, and it outranks the rest of this memo:

- **The mechanism.** The clitic seat runs on every load (`+page.svelte:3341`) and after every
  re-seat. It recognizes its own seat by the text on one note, the clitic's
  (`isCliticSeated`). On the fixture that note is `m7-0-1`, and the fold's text is the
  engraved «в бью», lowercase.
- **The trigger.** A singer's poem capitalizes the line's first word: «В бьющемся». Once a
  re-seat or a heal copies the poem's «В бью» onto that note, the test fails. The next load
  then rewrites the whole run of 60 notes, 37 to 96, in the score's own coordinates, where no
  poem address holds.
- **Measured before the fix.** A plain reload rewrote the run, and the heal then re-repaired 55
  of the 60 seats. That happened on every load.
- **Five seats stayed frozen at `0-38`, «о ди но ка я.».** Note 97, the doubled «я.», sits fixed
  on «одинокая» itself, and the heal's search stops short of a fixed seat's own word (§4
  item 3).
- **That is your library's signature:** four «о ди но ка» at `0-38`, plus the neighbouring
  «я.». DESK INFERENCE that it is how yours arose.

**What moved your ten between 03:40 and 04:10: NOT ESTABLISHED.** This writer is deterministic
for a given stored map, so repeated reloads alone would not move the count up and down. Any
action that changed the text stored on note 37, such as a re-seat after an edit, would make
the next load rewrite the run. I cannot see your history. The heal log now makes every write
it causes visible, and after this ship the fold no longer fires on case (§2.4).

### 1.2 The expected outcome on your library, stated before the walk

From the dry run at 04:10: `96 seated = 77 address + 9 anchor + 5 joined + 1 rejected + 4 unfound`.

- **First load after this ships:** one heal line,
  `[Ilya] N.160 heal, song <id>: wrote 14 of 96 seated = 9 anchor + 5 joined; left 1 rejected + 4 unfound as they were.`
- **The dry run on the same load:** `96 seated = 91 address + 0 anchor + 0 joined + 1 rejected + 4 unfound`.
- **N.159's count:** `91 drawn live, 5 kept as stored`.
- **Every later load:** no heal line, and the same dry-run totals.
- **The five left** are all «одинокая»: notes 92 to 95 unfound, and note 96 rejected.

---

## 2. What was built

### 2.1 The seated text

- **`SongRecord.seatedText`**, optional (`types.ts:110`). **No schema bump.** An older Ilya
  drops the field on import (`validateRecord` copies only what it knows). A non-string value is
  reported `malformed` and the rest of the record loads (`library.ts:193-194`).
- **DESK DEFAULT: stored only while it differs from the poem** (`library.ts:95` and `:110`).
  Absence means "the seats describe the poem" (`library.ts:83`). So a song whose seats match
  its poem never gains the field, and its record is unchanged. A record from before this step
  reads the same way.
- **One field on the document** (`document.svelte.ts:82`), saved through the same path as
  `pairings`.
- **In `transcribeText`** (`+page.svelte:2514-2524`):
  - the re-seat diffs the poem against the seated text (`seatedTextDiff`, `seated-text.ts`);
  - `transcribedGrid` keeps its other job, carrying the session's marks;
  - the seated text advances only when the seats could follow (`reseatAcross` now returns that,
    `:2625`). With no score attached, a song that still holds seats keeps the older text.
- **Clear does not touch it.** It is reset only where the seats are cleared and rebuilt:
  **Start over** (`:633`) and a whole-song replace (`:3284`).
- **DESK DEFAULT: Undo carries it** (`:920`, `:944`, `:951`). The undo stack outlives a text
  edit, so an Undo can bring back seats made against an older poem. Without this, those seats
  would freeze.

### 2.2 The heal that writes

- **`applyHeal`** (`heal.ts:453`) writes each `anchor` and `joined` seat from the slot the plan
  found, text and all, the way `reseat.ts` refreshes a moved seat. It never touches a
  `rejected`, `unfound`, or `address` seat. Where it writes nothing, it returns the same map.
- **`healFrozenSeats`** (`+page.svelte:2652`) runs on the first transcription of a session: a
  load, a song switch, or a Clear. It runs after the exact re-seat, so it only ever meets seats
  the diff kept (`reseat.ts:196-201`). It assigns `doc.pairings` only when it wrote. It runs no
  clitic re-seat after itself.
- **`healLog`** (`heal.ts:490`) prints, per song and only when something was written, what was
  written and what was left, in the dry run's format. **A heal line in the console IS the
  record of a write.** A seat that changes on a load with no such line was changed by
  something else.

### 2.3 What was held, as the brief says

- `refreshPairings`, `stressAcutedCyrillic`'s own lookup, `ownedByPoem`, and re-seat rules 1 and
  2 are unchanged.
- `VocalLineEvent` and `reconciliation/` are untouched.
- There is no new mark on the page and nothing new in the drawer.
- N.159's drawing step and both instruments are unchanged.

### 2.4 One change the brief did not name: `isCliticSeated` folds case and ё

`clitic-seat.ts:417`. **DESK DEFAULT, and without it brief §6.2 cannot pass:** the first reload
after a heal re-froze the run (§1.1). The predicate already ignored trailing punctuation for the
same reason (N.118). The new comment says so. A test holds both halves: «В бью» is the fold's
seat, and a different text is not.

---

## 3. Results against brief §6

1. **The three freezing paths no longer freeze a seat.**
   - **Tests:** one per path (`seated-text.test.ts:87`, `:102`, `:114`), plus a control that
     reproduces the old freeze (`:79`).
   - Each path test fails when the seated text is never diffed, and again when it is never
     stored. I made each mutation on a copy and restored the file byte for byte.
   - **Browser walk of path 1**, on a fresh origin: I loaded the fixture, pressed **Clear** (the
     record kept 97 seats and stored the old poem as `seatedText`), then pasted the typed poem.
     Every seat followed. Note 14 reads «неп» of «непроглядная» at `1-1.0`, and note 37 reads «В
     бью» at `3-1.0`. After a reload: `97 seated = 97 address + 0 anchor + 0 joined + 0 rejected + 0 unfound`,
     `97 drawn live, 0 kept`, no heal line, and only `updatedAt` changed.
2. **On a frozen fixture, the heal repairs what the dry run said, and a reload reports those
   seats as address.** This was a legacy freeze: 96 seats from the score's words and the typed
   poem, with no seated text.
   - First load: `wrote 73 of 96 seated = 73 anchor + 0 joined; left 1 rejected + 10 unfound`.
     The dry run on the same load read `85 address + 1 rejected + 10 unfound`.
   - **Field-by-field diff across the heal:** only `pairings` and `updatedAt` changed. Exactly 73
     seats changed. The rejected note 19 and two unfound notes, 14 and 24, are byte-identical.
     No `seatedText` was written.
   - Reload: no heal line, the pairing map byte-identical, only `updatedAt` moved, and the dry run
     unchanged at `85 address + 1 rejected + 10 unfound`.
   - The first such walk, on the 97-seat freeze and before the clitic fix, wrote 74 and was
     undone by the next load (§1.1).
3. **A song with nothing to repair is not written at all.** On the walked songs, across a reload,
   every field except `updatedAt` was identical, and no heal line appeared.
   `recordFromFields` round-trips a clean record byte for byte (`seated-text.test.ts:128`).
   `applyHeal` returns the same map when it writes nothing (`:178`).
4. **The log says what was written, per song, in the dry run's format.** Search the console for
   `N.160 heal`. The totals line first, then one line each for `wrote anchor`, `wrote joined`,
   `left rejected`, and `left unfound`. Each seat reads exactly as in the dry run (step 2
   memo §4).
5. **An unfound or rejected seat still draws its stored text, unchanged.** Its stored pairing is
   byte-identical across the heal (item 2). N.159's drawing step draws the stored text for any
   seat whose address fails, and it is unchanged. **Not observed on the page itself:** I did not
   read the score's rendered notes.
6. **Gates.** Each number was stated before the run.

| Gate | Script literal | Measured |
|---|---|---|
| 1 phonology | `216 passed (216)` | the same |
| 2 dictionary | `235 passed (235)` | the same |
| 3 web-check | `found 0 errors and 12 warnings in 5 files` | the same |
| 4 web-test | `1368 passed (1368)` | **`1378 passed (1378)`**, as predicted: 10 new tests |
| 5 score-parser | `575 passed \| 5 skipped (580)` | the same |

**Gate 4's literal must move to `1378 passed (1378)`.** That edit is the desk's, with your
permission. I did not touch the script.

---

## 4. Findings for the desk

1. **The clitic seat's load-time rewrite** (§1.1). It is fixed for case and ё. Any other text
   difference on the clitic's note still rewrites the whole run on load. Such a difference is
   a hand edit, or a re-division that moves a consonant across the fold's first cell. How often
   that happens is NOT ESTABLISHED.
2. **Clear then a different poem now follows the deletion rule.** A seat whose word is not in
   the pasted poem goes back to undecided, as Dann ruled on 2026-09-07 for a deleted word
   (`reseat.ts:4-11`). Before this step, those seats froze and kept their old syllable. This is
   memo-n160b's plan ("every future edit goes through the diff and the re-seat rules Dann
   already ruled"), but a singer can see it. It is not the ruling Dann owes, which concerns
   seats frozen before the seated text existed.
3. **The heal cannot place a frozen seat on a word that another seat already holds at its
   address.** The search runs strictly between fixed seats. When the fixed seat is on the target
   word itself, as note 97 on «одинокая» is, the frozen seats for that word are unfound. That is
   what left the fixture's five. **So your five may not be a word that left the poem at all.**
   The ruling Dann owes should be asked with that in mind. I did not change the rule: it is the
   memo's design, and this ship adds no heuristic beside its first write.
4. **A fresh upload made before the dictionary loads seats 96 notes, not 97**, with the fold's
   run stored without stress marks. HEAD `2fb7516` does the same, measured with a control build
   on its own origin (96 seats, 13,483 bytes). Nothing in this step causes it, and no heal line
   appeared.

---

## 5. What could not be established

- **Your library: NOT OPENED.** §1.2 is a prediction.
- **What moved your ten seats between 03:40 and 04:10.** §1.1 names a writer that could, and
  does not claim it did.
- **Paths 2 and 3 in the browser.** They are covered by tests through the real record round
  trip, not walked.
- **The rendered score for a rejected or unfound note** (§3 item 5).
- **Whether older Ilya builds import a binder carrying `seatedText`.** By `validateRecord`'s
  reading they drop it; no older build was run.
- **The heal on a song whose score arrives after the dictionary on load.** It runs only with a
  score attached, so such a load heals on the next one. This was not measured.

NOT ESTABLISHED beats a complete invented answer.

---

## 6. For you to commit

```
cd ~/Desktop/ilya-rewrite
```

```
git add apps/web/src/lib/shane/seated-text.ts apps/web/src/lib/shane/seated-text.test.ts docs/sessions/brief-n160-step3-stored-text-and-heal_r1_2026-09-21.md docs/sessions/memo-n160-step3-stored-text-and-heal_r1_2026-09-21.md
```

After gate 4's literal reads `1378 passed (1378)`:

```
sh ~/Downloads/ilya-ship.sh "N.160 step 3: the seats diff against a stored seated text, and the heal writes once, logged per song"
```
