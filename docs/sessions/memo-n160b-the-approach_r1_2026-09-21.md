# Memo: N.160b r1, the approach

**Written 2026-09-21 by Claude Code, answering `brief-n160b-converging-on-the-approach_r1_2026-09-21.md`.
Tree at `b543620`, branch `Shane`. A plan: no application code was written.**

**Instruments.** In addition to what N.159 and N.160 read, I read the following this session:

- `SCHEDULE.md` in full;
- `document.svelte.ts:140-200`;
- `+page.svelte:2940-2990`;
- `one-action.ts:41`.

Brief §1 is accepted as written and is not re-argued here.

**Words I coined in this memo:** *seated text*, *the heal*, and *dry run*. *The joined-run rule*
is from N.160.

---

## 0. One correction to my own N.160 memo

N.160 §2 said a reload or a song switch freezes seats. **That was too broad.** A reload and a
song switch each load a poem and seats that were saved together, so the first transcription
correctly finds nothing to move.

The freezing cases are narrower, and all of them are real:

1. **Clear, then a new poem.** Clear keeps the seats but forgets their text
   (`+page.svelte:2552-2562`, `:2374`).
2. **An edit that is saved before it is transcribed, followed by a reload.**
   - The poem autosaves on every change (`document.svelte.ts:147-181`) and flushes when the
     page is hidden (`:183-189`).
   - The re-seat waits for a 600 ms typing pause (`one-action.ts:41`, `+page.svelte:2974`).
   - A reload inside that pause stores a poem that is newer than its seats.
3. **An edit made while the dictionary is still loading.** The verdict is `wait`
   (`+page.svelte:2982-2984`), and the first transcription after the load has no previous grid
   (`:2426`). On a phone the load is the slowest part of a boot.

Which of these froze Dann's 25 is NOT ESTABLISHED.

---

## 1. The answer to §3: store it, and yes, it changes the plan

**Store the seated text: the poem exactly as it was the last time the seats were re-seated.
With it, every future edit, including all three cases in §0, goes through the diff and the
re-seat rules Dann already ruled (`reseat.ts:4-11`). No matching, no heuristic, and no guard
are involved.**

**What it costs in the record:**

- One optional string on `SongRecord`, `library/types.ts:70-97`. It is the length of the poem,
  a few hundred bytes for a song.
- Its default for older records goes in `validateRecord`, the way `corrections` did
  (`library.ts:175-180`).
- One field on the document, one line in its snapshot (`document.svelte.ts:222`), and the
  two conversions in `library.ts:57` and `:86`.
- **No schema bump.** An older Ilya that imports a newer binder drops the unknown field and
  loads normally, because `validateRecord` copies only the fields it knows
  (`library.ts:136-212`). That record then behaves like a legacy record (§2, step 3).

**How it works:**

- It is written wherever the seats are re-seated, in `transcribeText` beside `:2428`.
- **Clear does not erase it.** The seats outlive the poem, so their text must outlive it too.
- It is cleared only where the seats themselves are cleared (`:628`, `:3163`).
- The re-seat diffs the new poem against it rather than against the session's grid.
  `transcribedGrid` keeps its other job, carrying the session's stress, ё, and boundary marks,
  which Clear drops on purpose (`:2354-2375`).

**Belt and braces, or redundant?** Neither is redundant. They cover different time.

- **The stored seated text covers every edit from now on.** It is exact, it applies ruled
  rules, and it can never guess.
- **Re-finding by anchor covers only what is already broken:** seats whose address is dead and
  that have no seated text to diff from. That means Dann's 25 and any record written before
  the field existed. It becomes **a one-time heal at load**, run only for seats whose address
  fails, not a matching step on every render.
- **This makes step 3 smaller than N.160's version.** N.160 §3 resolved seats at render time.
  That is retracted: no view ever runs a heuristic.
- **Re-finding by anchor cannot replace the stored text.** It is a heuristic behind a guard,
  and even a guard that errs toward keeping is a guess. The diff against the seated text is
  the mechanism Dann already ruled, applied to text the system now remembers.

**The joined-run rule is still what makes the heal possible.** It lets the heal recognize an
engraver's split: «непроглядная» against «не» + «проглядная». **Without it, 10 of Dann's 25 seats
would need a text-curation subsystem to repair the split before anything could find them.
With it, the split is not a corruption to repair; it is a match to recognize, and no such
subsystem is built.** The same rule is what a later alignment of a singer's own poem against
the engraved words will need (`score-seat.ts:13-16`, increment 2, not built).

---

## 2. The plan

**The rule that governs every step: a seat that cannot be resolved keeps what it had.** It
draws its stored text through the four switches that already reach it
(`VoiceProfilePane.svelte:615`), and it is counted. Nothing a singer can see disappears
without Dann's ruling (brief §5.5).

### Step 1. The score obeys every switch

1. **What the singer gets.** Every Notation switch changes the score in the same moment it
   changes Transcription:
   - Reconstitution restores the vowel under the note;
   - Open syllables re-divides the IPA over the note;
   - the stress acute appears wherever Transcription marks the word;
   - the vowel marks follow Reconstitution, so a note drawn `ɛ` is not forecast as `ɪ`;
   - Spot reconstitution and a per-word boundary reach the score too.

   Notes whose word Ilya cannot find look exactly as they do today.
2. **What the system gets.** The score and the loupe draw each seated note from the live word.
   This is N.159 memo §6.2's drawing step, with the address check only.
   - **`refreshPairings` retires** (`pairings.ts:447-484`). Every consumer of `shownPairings`
     (`+page.svelte:418`; memo N.160 §4.3's table) reads the drawn record instead.
   - **`stressAcutedCyrillic`'s own lookup into the poem goes** (`pairings.ts:844-848`), because
     the drawing step has already found the word.
   - **A switch can no longer bypass the score**, because there is one drawing step for every
     setting.
   - **Instrument:** a count, logged once per load, of seats drawn live and seats kept as
     stored.
3. **What it costs.** 0.16 ms per redraw at 97 notes and 0.80 ms at 960, measured in headless
   Chromium (N.160 §4.4). NOT ESTABLISHED: phone performance, and the number of evenings the
   step takes.
4. **How it is walked, and by whom.**
   - **Dann, on his phone,** on the branch alias. He opens a placed song, opens **Score
     markup**, and flips **Reconstitution**, **Open syllables**, and **Apply stress acutes**,
     watching the notes change under his thumb. The question is whether it feels instant. That
     is the phone walk the brief asks for, and it replaces further benchmarking.
   - **The desk**, the same night, reads the logged count on his library through Chrome on the
     branch alias. That is the first real number for how many seats are frozen.

### Step 2. The dry run

1. **What the singer gets.** Nothing visible. This step exists so that the only copy of the
   fault is never written to blind.
2. **What the system gets.** The heal (§1) runs read-only and logs what it **would** do. For
   each seat it reports whether the address still holds, whether the anchor found the word,
   whether the joined-run rule found it, and whether the guard rejected the match. Each case
   carries the note and the syllable.
3. **What it costs.** Small: the heal is written here and switched on in step 3. NOT
   ESTABLISHED: the evenings.
4. **How it is walked, and by whom.**
   - **Dann** exports his library to a binder first (`library/exchange.ts`), as the backup.
   - **The desk** then reads the dry-run log on his library through Chrome and names every
     rejected or unfound seat to him by note and syllable.
   - **Expected:** 25 of 25 found, 15 by word and 10 by the joined-run rule (brief N.160 §3's
     counts, not re-measured).
   - **Likeliest failure:** «тень» appears twice, and its two seats resolve to the wrong
     occurrences. The order rule should prevent that, and the log shows it either way.

### Step 3. Dann's song unfreezes, and nothing freezes again

1. **What the singer gets.**
   - The notes that stopped following the poem follow it again: the acute appears, and the
     switches reach them.
   - From now on, a singer can clear the poem and paste it back, or reload in the middle of
     typing, and every placement stays with its word.
   - A note whose word truly left the poem still shows what it showed before (§3).
2. **What the system gets.**
   - The seated text is stored (§1).
   - The heal writes, once per song, only for seats whose address fails, under the guard.
   - **The freeze stops being possible for any song edited after this ships.** The three
     paths in §0 all diff against remembered text.
   - **What does not retire yet:** `ownedByPoem` (`reseat.ts:162`) still guards seats written
     in the score's own coordinates by the clitic seat (`clitic-seat.ts:437-448`). It retires
     at step 5.
3. **What it costs.** The field (§1), the heal's write path, and the re-seat's before-text
   changing source. NOT ESTABLISHED: the evenings, and whether his library holds clitic seats
   in score coordinates, which the dry run's log will show.
4. **How it is walked, and by whom.**
   - **Dann, on his own library, on the branch alias**, with the step 2 binder as the backup.
     He opens the Sunless song, and the notes of «Тень», «непроглядная», «безответная», and
     «Дума» carry the poem again, with acutes where Transcription has them.
   - **The desk**, on a fresh origin, walks the three freezing paths of §0 on the fixture and
     confirms that every seat follows its word.
   - The dry-run count becomes the number Dann's ruling (§3) is made against.

### Step 4, after the release. Stop writing what is never read

New seats stop storing `ipa` and `vowel`. This waits until older builds no longer matter.

### Step 5, after the release. The engraved words become only a source

- The clitic seat writes poem coordinates, through the alignment the joined-run rule enables.
- `ownedByPoem` and the protection at `reseat.ts:186-196` then retire.
- **Verses** follow from this, as a text and a join per sung verse (N.160 §5).

---

## 3. The one ruling left for Dann

**When a word in your poem has truly been removed, what should the note that sang it show?**

- **Keep it.** The note goes on showing the old syllable until you place something else there.
  Nothing on the page changes by itself. This is what Ilya does today, and what it does until
  you rule.
- **Clear it.** The note shows nothing, like any note you have not placed yet, so the page only
  ever shows the poem you have now. You would see it happen, and Undo brings it back.

**Asked after step 3**, against the dry run's count of how often this happens on your own song.
Brief §3 of N.160 predicts that count is zero; if it is, the question may not need an answer
before the release.

---

## 4. What ships before 2026-10-30, and what it displaces

| Step | Ships | Where in `SCHEDULE.md` | Displaces |
|---|---|---|---|
| 1 | Yes | **Already scheduled**: week 2, *"N.136 with N.119: every notation toggle acts at once on Transcription and Markup"* | Nothing |
| 2 | Yes | Week 2, after step 1 | N.132 (names and tab padding) moves to week 3 |
| 3 | Yes | Week 3 | Absorbed by the week-5 buffer, which the schedule reserves for exactly this |
| 4 | No | LATER | |
| 5 | No | LATER | |

**Steps 2 and 3 pass the freeze rule.** Frozen notes are Ilya telling a singer something false
about their own score: an acute withheld, a switch ignored. **DESK DEFAULT on the placement**,
for Dann to move.

---

## 5. Why the guard is right, restated

A false match puts the wrong syllable on a note without a word, and that is the fault this item
exists to end. A rejected match keeps what the note already had. So the guard can only err
toward leaving the page as it is, and every rejection is in the count. **Silence in a
one-singer beta is not evidence**, and N.160's argument from it is withdrawn.

---

## 6. What I could not establish

- **Phone performance of step 1.** Not measured. The step 1 walk is the answer.
- **How many of Dann's seats are frozen, and how many the heal finds.** His library was not
  opened. The count at step 1 and the dry run at step 2 are the answers.
- **Which of the three paths in §0 froze his 25.** DESK INFERENCE only.
- **Whether his library holds clitic seats in the score's own coordinates.** The step 2 log
  will show it.
- **How often composers repeat text** in the songs a singer brings, which is the heal's known
  weak case (N.160 §4.1, case 1).
- **The number of evenings any step takes.** No estimate is offered. The table in §4 is an
  order, not a sizing.
- **Whether other songs in his library carry the same fault.** The count at step 1 covers only
  the song that is open.
