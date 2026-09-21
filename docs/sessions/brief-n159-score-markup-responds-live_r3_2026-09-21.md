# Brief: N.159 r3. Build the drawing step

**This brief is the desk's. Do not edit, rename, or replace it.**

**Written 2026-09-21 by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree state read this session: HEAD `9f45e97`, working tree clean.**

**This is a BUILD brief.** It follows `brief-n159-score-markup-responds-live_r2_2026-09-21.md`,
which said propose and do not build, and `memo-n159-score-obeys-the-switches_r1_2026-09-21.md`,
which is your own proposal. Dann accepted it. **Build your memo section 6.2. Do not redesign
it.**

Read `docs/memory/CONTRACT.md` in full before you start.

---

## 1. What was observed

A singer opens **Score markup**, the page that goes on the music stand, opens **Notation** in
the drawer, and flips a switch. **Transcription changes. The score does not.** The header
above the switches says `n of 7 changed`, beside a page that did not change.

Three switches behave this way: **Open syllables**, **Reconstitution**, and **Apply stress
acutes** on some notes.

**LEARN Unit 4 instructs the singer to use reconstitution and names the result**, in both
languages: switch it on and ⟨жена⟩ restores to `[ɛ]`. On the score it does not.

**Dann's words, 2026-09-21, 01:37:** *"We must have Score Markup respond instantaneously to
the Notation toggles just like Transcription does."*

---

## 2. What is established

**The desk did not open the tree this session. Every `path:line` below is YOUR memo's, read
by the desk this session in that memo, and it is a lead until you re-read it.** The desk's own
reads this session are `docs/memory/` and `docs/sessions/`.

From `memo-n159-score-obeys-the-switches_r1_2026-09-21.md`, your own:

- The score already applies four switches as it draws, at `VoiceProfilePane.svelte:615`
  (`applyNotationPreferences`, `engine.ts:155-179`). The other three have no route.
- `shownPairings` (`+page.svelte:418`) is already a `$derived` recomputed from the live poem
  and never written back.
- Measured on the Sunless fixture, 97 notes: Reconstitution and Open syllables change **0**
  notes on the score today, while changing 20 and 14 of 39 words on Transcription. Your
  console prototype changed **19** and **32**, matching Transcription letter for letter, at
  **0.131 ms** mean over 500 runs.

From `memo-n160b-the-approach_r1_2026-09-21.md`, also yours: step 1 carries an instrument, a
count logged once per load of seats drawn live and seats kept as stored.

**Both memos measured at `b543620`. HEAD is `9f45e97`.** Two commits have landed since.

---

## 3. Measure before you change anything

Your r1 memo did the measuring and the desk is not asking for it again. **One thing only,
because the tree has moved:** re-run the prototype's two counts at `9f45e97` and report them
before you write code. If Reconstitution and Open syllables no longer read 0 on the score, or
the prototype no longer reads 19 and 32, say so and stop.

**State your expectation before each measurement and report against it**, per `CONTRACT.md`
§5's control rule.

---

## 4. The rulings this serves

- **Dann, 2026-09-21, 01:37**, quoted in section 1. Nothing has amended it.
- **Dann's musico-textual model, 2026-09-21**, transcribed at `docs/memory/PRODUCT.md`
  §THE WORK, AND ITS TWO VIEWS: *"this gets simpler when we consider the Platonic
  musico-textual creation that both surfaces (Transcription and Markup) are reflections
  of."* **There is one work; Transcription and Score markup are two views of it. The
  Notation toggles belong to the work, so a view that ignores them is not rendering the
  work.** That makes this correctness, not a feature.
- **Dann, 2026-09-21, 02:12:** *"I don't think the user cares about which syllable was
  seated in another poem? That is irrelevant to their need for accurate representation of
  the poem they arrive with now."* **So there is no category called "seated under an older
  poem", and nothing in this build announces one.**
- **The standard he set for it:** *"Seamlessness, instantaneous correct information,
  carefully rendered and defensible."*

**The desk defaults below are the DESK'S, not Dann's**, per `CONTRACT.md` §3's
ratification-is-not-authorship rule. He can wave any of them off with a word.

---

## 5. Constraints

### Build

Your memo section 6.2, items 1 to 4, with section 6.4 governing how a drawn syllable gets
what it needs. **Nothing is stored.**

**Plus the instrument:** a count, logged once per load, of seats drawn live and seats kept as
stored. **N.160 step 2's dry run is planned against that number and it is the first real
count of how many of a singer's seats are frozen.** Log it; draw nothing on the page and put
nothing in the drawer.

### Desk defaults, from `OPEN.md` §N.159

- Open syllables re-divides the IPA only. The Cyrillic keeps the division the singer placed.
- The acoustic marks follow a restored vowel: a note drawn `ɛ` is not forecast as `ɪ`.
- Spot reconstitution and a per-word syllable boundary are included.
- Separate geminates cannot reach the score at all, because the substitution needs two
  identical consonants inside one string and a note holds one syllable. Leave it. **Where a
  length marker belongs across a note boundary is an engraving question and it is Dann's.**

### What must not change

- **The four placement writers keep copying the RAW slot:** `firstPass`
  (`pairings.ts:334-340`), `placeSyllable` (`:1179-1181`), and `reseat.ts:216-222` and
  `:314-320`. Copying drawn text bakes the singer's current switches into their record,
  which your own 6.7 rejects.
- `VocalLineEvent`, and anything in `apps/web/src/lib/shane/reconciliation/`.
- **No new field on a stored pairing, required or optional.** `library/types.ts:71` is
  schema 1 and there is no migration mechanism.
- **No new mark on the page.** `CONTRACT.md` §6.
- A seat the poem cannot identify draws its stored text, as it does today. It is never
  re-keyed, moved, or erased.

### `refreshPairings` stays in this ship. DESK DEFAULT

`memo-n160b` §2 step 1 retires `refreshPairings` and `stressAcutedCyrillic`'s own lookup.
**Not in this ship.** Your r1 design composes over `shownPairings` and says the existing
suites pass untouched; retiring it moves those suites in the same commit as the first
singer-visible change, which makes the walk and the gate move harder to read. **It retires
with step 3, where the heal touches the same code.** The cost of keeping it is one extra
lookup per render against a step that measures 0.131 ms. Dann can overturn this.

### Out of scope

- **What a singer is told about seats that hold text from an earlier poem.** Your 6.8.
  Dann's ruling of 02:12 above removes the category. Build no message, no counter in the
  drawer, and no control. The log line in section 5 is an instrument, not a surface.
- **Repairing those seats.** N.160 steps 2 and 3.
- **The loupe's chip row** (`LoupeSyllables.svelte:168`, `:184`). Your 6.6 holds it. Keep
  holding it.
- **The second lookup against the score's own words.** Your 6.7 item 6.

---

## 6. Done when

1. On the Sunless fixture, flipping Reconstitution changes **19** notes on Score markup and
   Open syllables changes **32**, each matching Transcription letter for letter.
2. **Apply stress acutes** marks every syllable Transcription marks, under the same four
   suppressions: no mark on a clitic, on inferred stress, on ё, or on a syllable holding two
   vowel letters.
3. The stored pairing map is **byte-identical** after every switch has been flipped on and
   off.
4. The frozen-seat count is logged once per load and is readable from the console.
5. The five new tests your 6.6 names pass, and `pairings.test.ts`, `reseat.test.ts`,
   `punctuation-slot.test.ts`, `clitic-seat.test.ts`, `score-seat.test.ts` and
   `loupe-render.test.ts` pass **untouched**. **If one of them needs editing, stop and say so
   in the memo.** That is a signal the design moved.
6. A comment on the new function and a test both say it never reads `effectiveLines`
   (`+page.svelte:2311-2316`).
7. All five gates run, with the new gate 4 number reported.

**Gates.** The script is the instrument: `~/Downloads/ilya-ship.sh:76-80`, read by the desk
2026-09-21, holds phonology `216`, dictionary `235`, web-check `0 errors and 12 warnings in 5
files`, web-test `1354 passed (1354)`, score-parser `575 passed | 5 skipped (580)`.
`ENVIRONMENT.md`'s table is behind the script. **Five new tests take gate 4 to about `1359`.
Say your expected number before you run.** The desk moves the script's literal before the
ship, with Dann's permission; do not `sed` it yourself.

**`WRITTEN` is not `DONE`.** These tests are the code's. Dann's walk on his own library is
what closes it, and a green test on the fixture path is not evidence about his screen
(`ENVIRONMENT.md` §`THE PAGE RENDERS HIS LIBRARY, NOT YOUR FIXTURE`). **Paint on a phone is
NOT MEASURED** and is not yours to settle.

---

## 7. Report back

`docs/sessions/memo-n159-build_r1_2026-09-21.md`: the results against section 6, the gate
numbers, and **what could not be established.**

**NOT ESTABLISHED beats a complete invented answer.**

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`, `restore`,
`clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`. To measure a before state, copy
the file aside and copy it back.** Tell Dann what to commit and let him do it.
