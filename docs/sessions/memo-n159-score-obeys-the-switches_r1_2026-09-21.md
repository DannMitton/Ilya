# Memo: N.159 r1, the score obeys the singer's switches

**Written 2026-09-21 by Claude Code, answering `brief-n159-score-markup-responds-live_r2_2026-09-21.md`.
Tree read at `b543620`, branch `Shane`. A design only: no application code was written.**

**Instruments.** I read these files in full this session: `CONTRACT.md`, `WordStack.svelte`,
`reseat.ts`, and `pairings.ts` from `:1` to `:960`. I read `VoiceProfilePane.svelte` from
`:540` to `:700`, plus its render call at `:805-895`. I read `engine.ts:25-36` and `:146-179`,
and the cited ranges of `+page.svelte`. I did not open `LearnContent.svelte` beyond `:985-995`
and `:3026-3034`.

The timings and counts come from the dev server in the browser pane, on a fresh origin
(`n159.localhost:5173`) loaded with `sunless-01-engraved.musicxml`. That fixture seated 97
notes on its own. Your library was not opened and nothing of yours was touched. The staged
copy of the fixture is deleted.

**Words I coined in this memo:** *answered seat*, *unanswered seat*, and *drawn pairing*.
*Drawing step* is the brief's term.

---

## 0. Two corrections to the brief, because the tree disagrees

1. **The score already applies four switches as it draws.** Brief §3 says there is no such
   step. There is one: `VoiceProfilePane.svelte:615` runs `applyNotationPreferences` on
   every note's IPA each time the page is drawn. The stored `Pairing.ipa` holds the engine's
   raw IPA, copied from the slot (`pairings.ts:162-168`, `:334-340`), with no switch baked
   in. The four working switches are not a coincidence of storage. They work because they
   are the only four that the one existing drawing step knows about.
2. **The score already works out its text fresh on every render.** `shownPairings`
   (`+page.svelte:418`) is a `$derived` of `refreshPairings(doc.pairings, slotQueue)`. It
   is recomputed from the live poem each time and never written back
   (`+page.svelte:413-417`). So Dann's framing in 6.3 is half built already. This design
   finishes it.

Neither correction changes what the singer suffers. Measured on the fixture, a switch flip
changes this many notes on the score:

| Switch | Notes changed on Score markup | Words changed on Transcription |
|---|---|---|
| Apply stress acutes | 31 | not counted |
| Default [ʌ] to [ə] | 6 | not counted |
| Palatal nasal | 10 | not counted |
| Separate geminates | 2 (the Shcha cascade, see 6.1) | not counted |
| Shcha notation | 2 | not counted |
| **Reconstitution** | **0** | **20 of 39** |
| **Open syllables** | **0** | **14 of 39** |

---

## 6.1 The singer's experience after the change

The singer opens a placed score on Score markup, opens **Notation** in the drawer, and flips
each switch in turn. Each flip redraws the score in the same moment it redraws
Transcription. For the one exception, see 6.8.

1. **Apply stress acutes.** The acute appears on the stressed vowel of every syllable whose
   word Transcription marks, under the same four conditions: no mark on a clitic, on
   inferred stress, on ё, or on a syllable holding two vowel letters. **This is what
   happens today** (`pairings.ts:833-857`), apart from the unanswered notes in 6.8. On the
   fixture it is 31 notes.
2. **Default [ʌ] / [ə].** Unchanged. It works today, on every note: 6 on the fixture.
3. **Palatal nasal.** Unchanged. It works today: 10 on the fixture.
4. **Separate geminates / Length markers.** This switch also turns Shcha on
   (`NotationFields.svelte:92-94`, a deliberate cascade), so the singer sees Shcha's change.
   **The geminate itself never reaches the score, today or under this design.** The
   substitution needs two identical consonants with a space between them inside one string
   (`engine.ts:175`), and a note holds one syllable. Measured on «ванна»: Transcription
   shows `ˈvɑnːɑ`, and the score shows `ˈvɑn` on one note and `nɑ` on the next.
   **DESK DEFAULT: the score keeps one consonant per note**, so the length reads as the
   doubled consonant across the two notes. Where the length marker belongs across a note
   boundary is an engraving question. It is yours if you want it.
5. **Shcha notation.** Unchanged. It works today: 2 on the fixture.
6. **Reconstitution.** **New.** Every reduced vowel that Transcription restores is restored
   under its note. On the fixture, 19 notes change, and they match Transcription letter for
   letter. «не» goes from `ɲɪ` to `ɲɛ`, «без» from `bʲɪz` to `bʲɛz`, the «щем» of
   «бьющемся» from `ʃʲʃʲɪm` to `ʃʲʃʲɛm`, and the «це» of «сердце» from `ɨ` to `ɛ`. LEARN
   Unit 4's ⟨жена⟩ exercise then holds on the score. **DESK DEFAULT: the acoustic marks
   follow the restored vowel too.** A note drawn `ɛ` must not be forecast as `ɪ`, or the
   page disagrees with itself.
7. **Open syllables.** **New.** The IPA over each note re-divides exactly as Transcription's
   does: «Комнатка» reads `ˈko`, `mnɑ`, `tkʌ`. On the fixture, 32 notes change.
   **DESK DEFAULT: the Cyrillic under the notes keeps the division the singer placed**, and
   only the IPA moves. That is the rule the unpaired path already follows
   (`vowel-resolver.ts:421-424`, which cites a ruling of yours dated 2026-08-06). I read
   that ruling only in the code comment, not in its source document.

**Two controls outside the seven** take the same step, because LEARN names one of them and
§2 says both pages say the same thing about the same word. **DESK DEFAULT: both are
included.**

- **Spot reconstitution / Spot reduction** on a single word (`WordStack.svelte:23`, named at
  `LearnContent.svelte:991` and `:3031`).
- **A per-word syllable boundary** moved in the Inspector (`syllable-utils.ts:258-261`).

---

## 6.2 Where the drawing step goes

There is one new pure function and one new `$derived`. Three reads change to use them.

1. **`drawPairings` in `pairings.ts`.** It is a sibling of `refreshPairings` (`:447`) and
   `stressAcutedCyrillic` (`:833`). It takes the shown map, the raw `lines`, and the switch
   state: open syllables, reconstitution, the spot map, and the boundary overrides. It
   returns a drawn pairing for each event: Cyrillic, IPA, the vowel, whether the syllable
   takes an acute, and whether the seat was answered.
   - It builds a *drawn* copy of `lines` in which each word's syllables are re-sliced
     (`openSyllabify`, `syllable-utils.ts:48`, or `applySyllableOverride`), then
     reconstituted syllable by syllable. The reconstitution uses `applyReconstitution`
     (`reconstitution.ts:43`) with only that syllable's entries from the transcription log.
     A word's vowels never move between syllables when it is re-sliced
     (`syllable-utils.ts:272-277`), so the log entries still line up.
   - It then runs the existing `buildSlotQueue` (`pairings.ts:201`) over the drawn copy. The
     clitic fusion and the punctuation rule are therefore the ones already shipped, not a
     second copy of them.
   - For each stored seat, it looks the seat's origin up in that queue and verifies
     `origin.word`, exactly as `refreshPairings` does at `:458-463`.
2. **`drawnUnderlay` in `+page.svelte`**, directly under `shownPairings` at `:418`. That is
   where `lines` (`:385`), `spotReconstitution` (`:2094`), and `syllableOverrides` all live.
   It is passed as a new optional prop to `VoiceProfilePane` (`:4840-4858`) and to
   `InsightsPane` (`:4816-4829`).
3. **`VoiceProfilePane.svelte`.**
   - `ipaPreview` reads the drawn IPA instead of `paired.ipa` at `:614`. The four
     substitutions at `:615` stay where they are.
   - `cyrPreview` (`:649-652`) takes its acutes from the drawn pairing.
   - `vowelResolver` (`:586-588`) takes the drawn vowel, so the forecast follows
     Reconstitution.
   - The loupe needs nothing. It draws from the same `ipaPreview` and `cyrPreview`
     (`loupe-render.ts:62-64`).
4. **`InsightsPane.svelte:108`** takes the drawn vowel the same way, so Insights names the
   marks the score draws.

**The placement writers do not change, and must not.** `firstPass` (`pairings.ts:334-340`),
`placeSyllable` (`:1179-1181`), and `reseat.ts:216-222` and `:314-320` keep copying the
**raw** slot. Copying the drawn text would bake the singer's current switches into the
record, which is the defect 6.7 rejects.

---

## 6.3 What the score keeps and what it works out fresh

**I agree with Dann's framing, with one qualification.**

The stored pairing keeps **what the singer placed**:

- which nucleus of which word sits on which note (`origin`);
- the text as it was placed, which is R6's record by value (`pairings.ts:13-20`);
- the vowel (R8, `pairings.ts:22-27`).

Everything about **how it is drawn** is worked out on each render from the live word.

**The qualification.** The stored text is still needed, but not to be drawn. It is the
fallback for a seat that the poem can no longer identify (6.8), and it is the evidence of
what the singer decided. For an answered seat, the stored text becomes a record that the
page no longer reads. The same is true of R8's stored vowel. R8 exists because the engine's
transcription log is needed to find the vowel (`pairings.ts:22-27`), and an answered seat
has the live word's log in hand. So the stored vowel becomes a fallback too. R6 and R8 are
attributed to you at E.47 by the code comments. I have not opened E.47.

---

## 6.4 How a freshly drawn syllable learns what it needs

**It asks the live word, only when the seat proves it is that word, and it asks again on
every render.**

- **Nothing is stored, so nothing goes stale.** The four edits §5 names
  (`handleStressAssign` `:2679`, `handleStressRevert` `:2694`, `handleYoCharToggle`
  `:2703`, `handleReset` `:2774`) each call `runPipeline`, which replaces `lines`
  (`:2327`). `drawnUnderlay` is a `$derived` of `lines`, so it redraws from the new word.
  No write to `doc.pairings` is needed, and no text-equality test sits in the way. This is
  why copying the facts onto the pairing fails and this does not.
- **It never asks about a note the poem cannot identify.** The lookup is by the seat's
  `(line, word, slot)` and must match `origin.word`. It is the same test as
  `refreshPairings` (`pairings.ts:460-463`) and `reseat.ts:114`. A seat that fails is
  **unanswered**: it draws its stored text through the four substitutions, as it does
  today. No seat is re-keyed and none is moved, so §4.1 stands.
- **Nothing is sliced twice.** The drawing step re-slices from the engine's raw syllables,
  once. It never reads `effectiveLines` (`+page.svelte:2311-2316`). A paired note never
  passes through the resolver's own `openSyllabify` (`vowel-resolver.ts:428-435`), because
  `ipaPreview` takes the pairing's IPA in place of the resolver's (`:614`). The risk is a
  later change that feeds `effectiveLines` into the drawing step, so the function's comment
  and a test should both say so.

---

## 6.5 What it costs the singer

**Measured on the fixture, 97 notes, dev build, browser pane.**

| What | Time |
|---|---|
| A flip today, from click to the new score SVG in the DOM with layout forced | 4.2 to 23.1 ms (median about 8 ms; the 23.1 ms was the first acute flip) |
| Open syllables today, which already re-runs the resolver, the analysis, and pagination with every note paired | 7.8 to 8.5 ms |
| The prototyped drawing step: drawn lines, queue, and lookup for all 97 seats, with Reconstitution and Open syllables both on | **0.131 ms** (mean of 500 runs) |

The prototype ran in the page console against the app's own modules and dictionary, and was
written nowhere. Its output matched Transcription on every reconstituted note I compared.

**What that means for the singer.** The drawing step adds about a tenth of a millisecond to a
flip that already takes about 8 ms. Reconstitution will now also re-run the analysis and
pagination, as Open syllables already does. So expect Reconstitution to land near Open
syllables' 8 ms rather than its own 4.4 ms today.

**What I did not measure.** Paint. The pane was hidden, and a hidden page does not paint, so
every figure here covers JavaScript and layout only. The first flip after the change on a
visible page is the check.

---

## 6.6 What it breaks

- **Stored data: nothing.** `Pairing` (`pairings.ts:118-127`) and the library schema
  (`library/types.ts:71`) are unchanged, and no field is added. Every song in a library
  loads as it does today.
- **`VocalLineEvent` and `reconciliation/`:** not touched (§4.5).
- **Callers that change:** `VoiceProfilePane.svelte:586-588`, `:614`, and `:649-652`;
  `InsightsPane.svelte:108`; and one new prop at each of `+page.svelte:4816-4829` and
  `:4840-4858`.
- **Callers that must not change:** the four placement writers listed in 6.2, together with
  `refreshPairings` and `reseatByDiff`.
- **Tests.** `pairings.test.ts`, `reseat.test.ts`, `punctuation-slot.test.ts`,
  `clitic-seat.test.ts`, `score-seat.test.ts`, and `loupe-render.test.ts` all test stored
  behaviour, which does not change. They should pass untouched. The new tests are:
  - reconstitution per syllable, with a positive control against Transcription's word;
  - open syllables moving the IPA and not the Cyrillic;
  - a hand-assigned stress redrawing with no write to the map;
  - an unanswered seat drawing its stored text;
  - the stored map left byte-identical after every switch is flipped.
- **The §4 rules it comes near.**
  - §4.1: it reads seats and never writes them.
  - §4.3: see 6.4.
  - §4.4: it adds no mark.
  - §4.2: not touched.
- **The loupe's chip row** (`LoupeSyllables.svelte:168`, `:184`) keeps showing the raw
  Cyrillic of the queue with no acutes. Whether the chips should wear acutes is outside
  this item. I note it and hold it.

---

## 6.7 The designs I rejected, and why

1. **Copy the word's stress facts, or the reconstituted IPA, onto the stored pairing.** This
   was the desk's first suggestion. §5's audit refutes it: it goes stale on the next stress
   edit, and a required field breaks schema 1. The drawing step makes both costs
   unnecessary.
2. **Rewrite `doc.pairings` whenever a switch flips.** This stores the drawn text. It writes
   the singer's record on a display choice. It cannot be undone reliably, because a
   restored `ɛ` cannot be reduced again without the transcription log. And every placement
   made afterwards would copy whichever switches were on at that moment.
3. **Hand the score `effectiveLines` instead of `lines`.** This slices twice through the
   resolver (§4.3, `+page.svelte:4836-4839`), and it moves the Cyrillic under the notes as
   well as the IPA.
4. **Let the resolver draw every note, paired or not.** The resolver describes the
   engraver's syllable at each note, not the one the singer placed there. It would undo
   R7, where the pairing outranks the resolver (`VoiceProfilePane.svelte:584-588`), on
   every note that a melisma or a hand seat has moved.
5. **Rescue the 25 by matching their word text anywhere in the poem.** This re-keys a seat
   by a guess, which is the `b191867` defect (`reseat.ts:76-92`, `:186-193`).
6. **Deferred, not rejected: a second lookup against the score's own words.**
   `readScoreText` already returns `lines` (`clitic-seat.ts:465-478`). A seat made from the
   engraved words could be answered from those lines when the poem has changed. It does
   not help your 25, whose line indexes point into an earlier multi-line poem. I have left
   it out of increment 1.

---

## 6.8 The 25 notes the score cannot answer for

**What the singer sees under this design, if you choose nothing.** Those notes print the text
they were placed with. Default [ʌ], Palatal nasal, and Shcha still change them, because
those three are applied to the stored IPA (`VoiceProfilePane.svelte:615`). Apply stress
acutes, Reconstitution, and Open syllables do not change them, and nothing says so. On your
Sunless song that is 25 of 96 notes, 8 of which carry a stress that never gets its acute
(brief §5; I did not re-measure).

**What the singer should be told is your decision.** The options:

| | What the singer sees | Cost |
|---|---|---|
| **A. Build neither** | The switches silently skip those notes, as in the paragraph above. | The fault §2 names: a switch that did nothing looks like a word that needed nothing. |
| **B. One sentence in the drawer, under Notation, shown only when the count is above zero** | The page is unchanged. The drawer says, for example: *"25 notes hold text from an earlier poem and do not follow these switches."* | The page stays clean (CONTRACT §6: the drawer manipulates, the page displays). The singer is told how many, not which ones. French needed (draft: *« 25 notes portent le texte d'un poème antérieur et ne suivent pas ces réglages. »*, for your ruling). |
| **C. B, plus a way to step to those notes in the loupe** | As B. A press walks the loupe through them one at a time. | More UI in the drawer. It is the natural bridge to the repair that §7 puts out of scope. |
| **D. A quiet mark on those notes only** | The page shows which notes are stale. | CONTRACT §6 bars a page mark that says Ilya is unsure. The case for D is that this is not uncertainty: Ilya knows exactly which notes are stale. 25 of 96 is a quarter of the song, not everything. Printed, the mark would go on the music stand. |
| **E. Answer what can be checked, then A to D for the rest** | A note whose stored text equals the engraved syllable at that same note could draw from the score's own words. | Recovers some notes. How many of your 25 qualify is **NOT ESTABLISHED**. |

I recommend none of them. These are the options, and what each one tells the singer.

---

## 8. What I could not establish

- **Whether `stressSource` ever holds `'clitic'`: NOT ESTABLISHED.** No assignment site in
  the tree sets it. The pipeline copies the dictionary lookup's source
  (`pipeline.ts:665`), and the lookup takes `entry.source || source` (`engine.ts:727`), so
  a dictionary or supplement entry that carries its own `source: 'clitic'` would set it.
  Those data files are fetched at run time, and I did not open them. On the fixture, every
  sampled word read `dictionary`. `pairings.test.ts:650` sets `'clitic'` by hand.
- **Whether anything reads `ReseatResult`'s counts: ESTABLISHED, nothing outside tests.**
  The only call, `+page.svelte:2540-2541`, reads `.map` alone. `removed`, `refreshed`,
  `seated`, `unseated`, and `kept` are read only in `reseat.test.ts` and
  `score-seat.test.ts:140`. They are counted and never shown. `reseat.ts:268` is related:
  it skips an unseated slot of an existing word without counting it at all.
- **Paint time for a flip: NOT MEASURED.** The pane was hidden (6.5).
- **The forecast re-run cost for Reconstitution: inferred, not measured.** It comes from
  Open syllables' 7.8 to 8.5 ms, which is the same chain.
- **Whether the 2026-08-06 open-syllable ruling, and R6 and R8 of E.47, have been amended
  since: NOT ESTABLISHED.** I read each one only in the code comment that cites it
  (tether 17).
- **The 25 and the 8 on your library: taken from brief §5, not re-measured.** Your library
  was not opened.
- **How many of the 25 option E would recover: NOT ESTABLISHED.**
