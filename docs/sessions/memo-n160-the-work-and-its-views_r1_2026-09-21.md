# Memo: N.160 r1, the work and its two views

**Written 2026-09-21 by Claude Code, answering `brief-n160-the-work-and-its-views_r1_2026-09-21.md`.
Tree read at `b543620`, branch `Shane`. An audit and a proposal: no application code was written.**

**Instruments.** `CONTRACT.md`, `reseat.ts`, `pairings.ts:1-960`, and `WordStack.svelte` were
read in full earlier this session, for N.159. This session I read the following in full:

- `library/types.ts`
- `score-seat.ts`
- `text-diff.ts:1-240`
- `library.ts:100-213`
- `+page.svelte:2345-2510`, `:2538-2566`, `:1565-1610`, and `:918-940`

I read excerpts of `migration.ts`, `clitic-seat.ts`, `analyze-per-verse.ts`, and
`reading-aid.ts`.

The timings come from headless Chromium, which is Playwright's, run in a fresh profile
against the dev server with `sunless-01-engraved.musicxml`. The scripts live in the session
scratchpad and not in the repo. Your library was not opened.

**Words I coined in this memo:**

- *the join*: the seats, taken together;
- *resolve* and *resolution*: finding the word a seat belongs to in the current text;
- *anchor*: what a seat keeps so that it can be resolved;
- *the joined-run rule*: a proposed matching rule, defined in §4.1.

*The work* and *view* are Dann's words (brief §1).

---

## 1. The singer's experience under this proposal

1. **They open a song.** Transcription and Score markup show the same words, the same stresses,
   and the same vowels, because both are drawn from one text. The score's notes carry the
   singer's placements. Nothing on either page is left over from an earlier text.
2. **They flip each setting.** Both pages redraw in the same frame. All seven Notation switches
   reach the score, along with spot reconstitution and a per-word boundary.
   - **Measured, today's app:** 8 to 30 ms from a click to a painted frame at 97 notes. The
     browser's own input-to-paint timing reads 16 to 32 ms.
   - The new drawing step adds 0.16 ms (4).
   - The one exception is the geminate length marker. Its two halves fall on different notes,
     as N.159 6.1 recorded, and that stays a DESK DEFAULT.
3. **They edit the text.**
   - Change a word, and the notes that carried the old word take the new one, as today (Dann,
     2026-09-07).
   - Join or split lines, and nothing on the score moves. That is already true within a
     session (`text-diff.ts:84-91`).
   - **New:** they can clear the poem and paste it back as one line, or reload with a changed
     poem. Every note whose word is still in the text keeps following it. That includes a word
     the engraver split in two.
   - This is Dann's own case. Today it leaves 25 of 96 notes frozen (§3).
4. **They place a syllable.** The gesture is the one they have now. The note draws that
   syllable at once, with every setting applied, and it keeps drawing it live after later
   edits.
5. **A seat whose word has left the text draws nothing.** The note reads as undecided. That is
   my reading of Dann's ruling in brief §1 (*"irrelevant to their need for accurate
   representation of the poem they arrive with now"*), and it is a **DESK DEFAULT** for him to
   wave off. It replaces the question that N.159 memo §6.8 framed. The seat stays in storage,
   so an undo can bring it back.

---

## 2. Verdict on §3's critique

**The desk is half right. The stored strings are a symptom. The root is that a seat's link to
its word only holds while the session remembers the previous text.**

- **What the critique gets right.** `Pairing.cyrillic` and `.ipa` are renderings, and the
  score draws them. That is why the score ignores Reconstitution and Open syllables (N.159),
  and why `refreshPairings` (`pairings.ts:447-484`) exists at all.
- **What it gets wrong.** Removing the strings would not have saved the 25 notes. Those notes
  are frozen because their **address** died, not because their text went stale. Here is the
  mechanism, read this session:
  - **The diff's memory of the previous text is not stored.** `transcribeText` diffs against
    `transcribedGrid` (`+page.svelte:2425-2428`). That grid is a plain variable
    (`:2926`), and an empty grid means "no previous text" (`:2426`), so nothing is re-seated.
  - **Three events empty that grid while the seats survive:** a Clear (`handleClear`
    `:2552-2562` calls `resetSessionState`, which sets it to `[]` at `:2374`), a song switch
    (`:3568`), and a reload (`:2926`). **Clear does not touch `doc.pairings`**; I read
    `:2552-2590` and no line writes it.
  - **So a singer who clears the poem and pastes a new form of it keeps every seat at its old
    address, and no re-seat ever runs.** That fits Dann's library exactly: a multi-line poem
    became one line, and the only seats that survived were the ones addressed to line 0.
    **DESK INFERENCE:** I cannot see his history. The code path is real, but that it is how
    his 25 arose is not established.
- **The stored text is also the only thing that can find the seat again.** Once the address is
  dead, the seat's letters and `origin.word` are all that remain. The fix is to split the two
  jobs the string does: keep it as the **anchor** and stop drawing from it.

---

## 3. Verdict on §4's shape, and the shape I would build

**§4 is the right direction. Its one flaw is the phrase "not the text of that syllable".**
Without the text, a seat whose address dies cannot be resolved again. The measured 25 would
all stay lost, not drop to 10.

**The shape I would build.**

- **A seat stores the note, plus an anchor: the word's letters and the syllable's ordinal.**
  All of these are already stored, as `origin.word`, `origin.slotIndex`, and the slot's own
  letters in `cyrillic`.
- **The address `(line, word)` becomes a cache.** A seat that still points at its word takes
  the fast path, which is the whole of today's behaviour.
- **A seat whose address fails is resolved by its anchor**, in note order, against the current
  text (4.1). If that also fails, it is honestly unresolved.
- **Every view draws from the resolved live word and the settings, and from nothing stored.**
  That is N.159's drawing step. **N.159's design is the right shape for the view side.** It
  lacked the identity side. With this, its fallback "draw the stored text" becomes "draw
  nothing" (1.5).

**What this retires:**

- `refreshPairings` (`pairings.ts:447`), because text is never copied, so nothing refreshes;
- `ownedByPoem` (`reseat.ts:162`) and the protection at `reseat.ts:186-196`, because a seat
  is verified by its content, never re-keyed by position (4.2);
- `reseat.ts` rules 1 and 2, which follow from resolution.

**What it keeps:** rule 3, an inserted word taking open notes (Dann, 2026-09-07), because
that is a decision Ilya makes about empty notes, not a rendering.

---

## 4. The §5 questions, answered

### 4.1 A stable reference to a word

**The reference: the word's letters, the syllable's ordinal within that word, and the order of
the notes.** The address is kept as a cache.

- **Order is the tiebreak.** Seats sit on notes, and notes run in time. Two seats that point at
  «тень» are resolved to the first and second «тень» of the text, in the order the music sings
  them. The matching is a longest-common-subsequence over word letters, which is
  `diffWordGrid`'s own algorithm (`text-diff.ts:161-221`) applied to the sequence of seated
  words against the text's words. A seat whose address still holds its word is fixed first
  and bounds the search on either side.
- **The joined-run rule** covers the engraver's splits. An old word may match a run of adjacent
  current words whose letters, joined, are the same: «непроглядная» against «не» + «проглядная».
  Its slots map across in order, because the syllables are the same letters. By brief §3's own
  numbers, 15 of the 25 match whole words and the other 10 are those two split words, so
  **the rule should resolve all 25 on Dann's song. NOT ESTABLISHED until it is run on his
  library.**
- **Matching folds case and ё**, as the gloss guard already does (`+page.svelte:2751-2753`).
  A ё toggle changes `cleanWord` (`:2918-2920`) without changing the word.
- **`SlotOrigin.word` is already the anchor.** Its own comment rules it the discriminator
  between a re-division and a re-transcription (`pairings.ts:81-93`), and nothing new is added
  to it.

**What breaks it:**

1. **Composer text repetition after an edit the session did not see.** The matching is
   monotonic, so a setting that sings «тень» twice where the text has it once resolves only one
   of the two seats. Within a session the address cache holds both, and `placeSyllable` already
   lets one slot sit on two notes (`pairings.ts:1168-1184`). How often this happens in the
   singer's repertoire is NOT ESTABLISHED.
2. **A spurious match after a whole-poem replacement.** Common short words such as «и», «в», and
   «не» can match between two different poems. **Guard, DESK DEFAULT:** accept a match only
   when it sits in a run of two or more matched words, or between two seats already fixed. The
   same exposure exists today for the stress and gloss overrides (`rekeyByWord`,
   `text-diff.ts:238`), and nobody has reported it.
3. **A real change to a word's letters.** This is correctly unresolved.

### 4.2 Does the score's lyric become the work's text?

**Yes, and the tree already does it.** When a score arrives with words and the poem box is
empty, the box fills with those words and is tagged `from score` (N.134, `+page.svelte:387-402`,
ruled by Dann 2026-09-10). Its seats are then made against the poem's own coordinates
(`score-seat.ts:13-16`, `:84-88`).

**The seam that remains, named:**

- **When the poem is empty**, `slotQueue` falls back to `readScoreText`'s queue
  (`+page.svelte:381-386`).
- **The clitic seat always reads the file's own underlay** (`seatCliticFolds`,
  `clitic-seat.ts:437-448`) and writes origins in that line's coordinates.

These are the seats that `reseat.ts:186-196` protects.

**Under this proposal the protection has nothing left to protect.** A seat is resolved by its
letters, so a clitic seat made from the file resolves against the poem whenever the poem
contains that word, and is unresolved when it does not. The engraved underlay becomes a
**source**: it seeds the text and seeds the join, and after that it is a fact about the file,
not a second text. **DESK DEFAULT:** when the poem is empty and the score has words, the work's
text is the score's words. That is the fallback at `:386`, promoted from a queue to the text.

Seats that `mergeOnUpload` carried in from another score (`pairings.ts:379-384`) resolve to
nothing, and are kept.

### 4.3 What each view needs from the work

Every consumer, and what it asks of a seat:

| Consumer | Where | What it needs |
|---|---|---|
| IPA row | `VoiceProfilePane.svelte:597-626` | the syllable's IPA, then the settings |
| Cyrillic row and acute | `:647-652`, `pairings.ts:833-857` | the syllable's letters with case and punctuation; the word's stress index and source, its clitic flags, and ё |
| Hyphen and extender | `:662`, `pairings.ts:889-939` | word identity, slot ordinal, next seat in note order |
| Withheld siglum | `:631-645` | only whether a note is seated |
| Vowel forecast, marks, watchlist | `:586-588`, `:688-692`, `:706`; `InsightsPane.svelte:108`, `:116` | the sung vowel, from the transcription log |
| Blank notes | `+page.svelte:473`, `:483`, `:498` | which notes are seated; whether the queue is exhausted |
| Loupe measure | `loupe-render.ts:62-64` | whatever the score draws (the same previews) |
| Loupe chip row | `LoupeSyllables.svelte:55-105` | seated slots by identity; word grouping |
| Loupe readout and gap sentence | `+page.svelte:1575`, `:1607` | the seat's Cyrillic |
| Placed count | `+page.svelte:425-435` | seated slots by identity |
| First-seat guard | `first-seat.ts:40` | whether any seat exists |
| Undo and redo | `+page.svelte:929`, `:937` | the stored map, whole |
| Export binder | `library/exchange.ts`, `binder.ts` | the stored record, whole |

**Every "needs" in the table except the last two is a fact about the live word**: its entry in
`lines`, which carries `cleanWord`, `punctuation`, `stressIndex`, `stressSource`, `isProclitic`,
`isEnclitic`, `syllables`, and `result.transcriptionLog` (`types.ts:45-137`), together with the
settings. None of them needs a stored string. The undo stack and the binder need the decision
record, and nothing more.

### 4.4 Is a live read fast enough?

**Yes.** Measured in headless Chromium on the dev build.

| What | 97 notes | 960 notes (the text ×10, synthetic) |
|---|---|---|
| A switch flip today, click to painted frame | 8 to 30 ms (each switch, 6 flips) | not measurable: no score this size exists |
| The same flip, browser Event Timing (trusted clicks, 8 ms granularity) | 16 to 32 ms | not measurable |
| Draw every seat from the live words, every setting on | 0.16 ms | 0.80 ms |
| Re-find every seat by anchor, no stored address, one edit | 0.01 ms | 0.42 ms |
| The same, worst case (nothing in common at either end) | 0.04 ms | 0.49 ms |
| The pipeline itself, which a switch does not re-run | 4.9 ms | 22.4 ms |

- **The largest score in `~/Downloads` is this same file.** `Mussorgsky - Sunless 01 - Within
  Four Walls (engraved).musicxml` is 122,058 bytes, the same size as the fixture, and every
  other MusicXML there is under 3 KB. So "97 notes" and "the largest score" are one
  measurement.
- **Rendering wholly from the work adds under 1 ms at ten times the song**, against a flip that
  already costs one to two frames.
- **What I did not measure:** a production build, a real device such as a phone or an iPad,
  and paint for a 960-note score.

### 4.5 The singer's existing library

**No migration and no schema change are needed for the first two steps.**

- **The anchor is already stored in every seat ever written**: `origin.word`,
  `origin.slotIndex`, and `cyrillic` (`pairings.ts:75-96`, `:118-125`). A seat stored before
  `origin.word` existed has `undefined` there. It resolves by its letters alone, or not at all,
  which is what happens to it today (`pairings.ts:443-445`).
- **The healing writes itself.** On the first transcription after a boot, a Clear, or a song
  switch (the empty-grid case at `+page.svelte:2426`), seats whose address fails are resolved
  and their addresses rewritten once. This is the same kind of write as `reseatAcross`
  (`:2519-2524`), which is a decision restated, not a cached derivation. Dann's 25 would heal
  on his first load after it ships.
- **"There is no mechanism" is half true.** There is no version-upgrade path: `library.ts:128`
  refuses a newer schema and nothing upgrades an older one. There is, however, a per-field
  rebuild on every load (`validateRecord`, `library.ts:119-213`). That is where an additive
  field takes its default, exactly as `corrections` did (`:175-180`). A future `verse` on a seat
  goes there, optional and defaulting to 1. `migration.ts` is a separate, one-time move from
  localStorage to IndexedDB.
- **Stored `ipa` and `vowel` stop being read** but are still written. **DESK DEFAULT, until
  after the release**, so that an older Ilya importing a new binder still draws something.
  Whether older builds import binders at all is NOT ESTABLISHED.

### 4.6 One change or a sequence?

A sequence. See §6.

---

## 5. The work, as a type, and what a view may hold

```ts
// A design sketch, not code in the tree.
interface Work {
  texts: Text[];                 // one per sung verse; today exactly one, the poem
  music: { source: SongSource; corrections: CorrectionMap };
  joins: Join[];                 // one per verse, parallel to texts
  settings: Settings;            // the seven switches, plus spot and boundary marks
  glosses: GlossRow[];
}
type Join = Record<EventId, Seat | { kind: 'melisma' } | { kind: 'empty' }>;
interface Seat {
  kind: 'syllable';
  anchor: { word: string; slot: number; letters: string }; // what the singer placed
  at?: { line: number; word: number };                      // a cache, never trusted alone
}
```

**Against the tree:**

- `Seat` is today's `Pairing`, read differently. `anchor.word` is `origin.word`, `anchor.slot`
  is `origin.slotIndex`, `anchor.letters` is `cyrillic`, and `at` is `origin.lineIndex` with
  `origin.wordIndex`.
- `texts` and `joins` are `poem` and `pairings` with an index of 1. A second verse is an
  additive field (4.5).
- A text and a music stay separately reusable, as Dann asks. A second verse is a second text
  and a second join on the same music. A second setting of the same poem is the same text on
  another song record.

**A view may hold:**

- nothing that persists;
- anything derived, recomputed from the work and the settings on each render;
- its own interface state: selection, the loupe, zoom, and which stations are open.

**A view may not hold:**

- a string the work could supply;
- a copy of a decision.

This is `CONTRACT.md` §6 (*"Do not store anything derived"*) applied to both views. R8's stored
vowel stops being an exception, because a resolved seat has the live transcription log.

**One naming collision to hold:** `groupIntoVerses` (`reading-aid.ts:18-38`) calls a **stanza**
of the poem a verse. A sung verse, in the engine's sense (`vowel-resolver.ts:173-194`), is a
different thing. A through-composed song has many stanzas and one sung verse.

---

## 6. The sequence, with the first singer-visible step

1. **The views read the live word (N.159's drawing step), with the fast path only.** A seat
   draws from its word when its address still holds that word.
   - **Singer-visible first:** all seven switches reach the score, and the score's vowel marks
     follow Reconstitution.
   - It is contained to `pairings.ts`, one `$derived` in `+page.svelte`, and three reads in
     `VoiceProfilePane.svelte` and `InsightsPane.svelte` (N.159 memo §6.2).
   - **Fits the release** (NOT ESTABLISHED as an estimate).
2. **Resolution by anchor**, with the joined-run rule and the guard (4.1). It runs at render,
   and it rewrites the address on the empty-grid transcription.
   - **Singer-visible:** Dann's frozen notes follow the poem again, and a Clear-and-paste no
     longer freezes anything.
   - `refreshPairings`, `ownedByPoem`, and reseat rules 1 and 2 retire, and rule 3 stays.
   - **Fits the release if step 1 lands first** (NOT ESTABLISHED as an estimate). This is the
     step whose risk is real (4.1), so it needs a walk on Dann's own library.
3. **Unresolved seats draw nothing** (1.5). It is one line in the drawing step, and it could
   ship with step 2.
4. **After the release:** stop writing `ipa` and `vowel` on new seats.
5. **After the release:** verses, meaning a text and a join per verse, a `verse` field on the
   seat, and the selector.

---

## 7. What I would not do, and what I would defer

**I would not do these at all:**

- **Bump the schema or write a migration.** Nothing in steps 1 to 3 needs one (4.5).
- **Give the text stable ids**, meaning hidden ids in the poem or a word table. The letters and
  the order already identify a word as well as anything the singer could keep stable.
- **Make resolution write on every render.** It writes once, at the moment identity was lost,
  as `reseatAcross` does.
- **Let a syllable-level match run unguarded across different poems.** That is `b191867` by
  another route (4.1, case 2).
- **Touch `VocalLineEvent` or `reconciliation/`.**
- **Rebuild reseat rule 3**, which is ruled.

**Deferred past 2026-10-30:**

- verses (step 5);
- dropping the stored `ipa` and `vowel` (step 4);
- carrying the glosses and the stress, ё, and boundary marks on the same anchor. They still
  rely on the session diff, and a Clear drops them on purpose (`+page.svelte:2354-2375`), so
  they do not freeze and nothing is urgent.

---

## 9. What I could not establish

- **How Dann's 25 became frozen.** The Clear, song-switch, or reload path at
  `+page.svelte:2425-2426` fits the evidence. That it is what happened is DESK INFERENCE.
- **Whether the joined-run rule recovers all 25 on his library.** The rule was not run on his
  data, because his library was not opened. The expectation of 25 of 25 rests on brief §3's
  counts, which I did not re-measure.
- **How often composers repeat text** in the songs a singer brings, and so how often case 1 of
  4.1 bites. NOT ESTABLISHED.
- **Paint on a production build and on a real device**, and paint at 960 notes. Not measured.
  Event Timing reports durations in 8 ms steps and only for events over 16 ms.
- **Whether older Ilya builds import binders written by newer ones.** Not established, and it
  is why the DESK DEFAULT in 4.5 keeps writing `ipa` and `vowel`.
- **The release estimates in §6.** Not established. The step order does not depend on them.
- **E.47's R6 and R8, and N.134's ruling dates.** Read only in the code comments that cite them
  (tether 17).
- **§2 of the brief, confirmed with one correction.** Every call to the verse-aware functions
  passes `1` or takes the default:
  - `+page.svelte:382`, `:391`, `:465`, `:2446`, `:3243`;
  - `VoiceProfilePane.svelte:578`, `:706`;
  - `InsightsPane.svelte:102`, `:116`;
  - `seatCliticFolds` and `seatScoreWords` at their defaults.

  **The correction:** `analyzePerVerse` does pass other verse numbers
  (`analyze-per-verse.ts:42-43`), but nothing outside its own test calls it.
