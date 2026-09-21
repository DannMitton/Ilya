# BRIEF — N.159 r2. The score obeys the singer's switches

**Written 2026-09-21, 01:50, by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree read for this brief at `b543620`.**

**Supersedes `brief-n159-score-markup-responds-live_r1_2026-09-21.md` entirely.** That
draft was written from the code outward and never said what a singer was trying to do.
Dann corrected it. Ignore r1.

**Numbered N.159, DESK DEFAULT.** **PROPOSE, DO NOT BUILD.** See section 6.

Read `docs/memory/CONTRACT.md` in full before you start.

---

## 1. WHAT THE SINGER IS DOING, AND WHAT HAPPENS TO THEM

A singer is learning a Russian song. Ilya gives them two documents: the poem on
Transcription, and the score on Score markup. **The score is the one that goes on the music
stand.** It is the document they sing from.

In the drawer there is a panel called Notation with seven switches. Each one is a decision
about how to sing: whether to open the syllables, whether to reconstitute a reduced vowel
on a sustained note, whether to mark the stresses so they can read the Cyrillic on its own.

**The singer flips a switch. The poem changes. The score does not.**

The header above the switches says `1 of 7 changed`, so Ilya tells them something changed,
beside a page that did not change.

Three switches behave this way today, and they are not obscure ones:

- **Open syllables.** A teacher's instruction, applied to the poem and not to the music.
- **Reconstitution.** The whole point of it is sustained notes, which is to say the score.
  **LEARN Unit 4 tells the singer to use it and names the result** (`LearnContent.svelte:3031`
  and `:991`, both languages): switch it on and watch ⟨жена⟩ restore to `[ɛ]`. On the score
  it will not.
- **Apply stress acutes.** Works on most notes and silently not on others.

**And the two documents now disagree with each other.** A singer comparing them has no way
to tell which page is right, or that one of them is stale. Nothing on either page says so.

**Dann's ruling, 2026-09-21, 01:37:**

> *"as I experiment with Ilya's interface I notice that while Transcription responds in
> realtime to toggles, Score Markup does not. This must change. We must have Score Markup
> respond instantaneously to the Notation toggles just like Transcription does."*

---

## 2. WHAT THE SINGER SHOULD GET

**They flip a switch and the score changes under their eyes.** No reload, no re-placing the
score, no flipping something else to make it take.

**Both pages always say the same thing about the same word**, because they are two views of
one decision, not two documents.

**And a switch that cannot take effect on a given note never pretends otherwise.** On
Dann's own song, 25 of 96 notes are in a state where the score cannot answer for the word
at all. Today those notes fail silently. Whatever they should do, failing invisibly is the
part that costs the singer most: they cannot tell a switch that did nothing from a word
that needed nothing.

---

## 3. WHY IT HAPPENS, in one paragraph each

The code facts, as cost rather than as the frame.

**The poem is alive and the score is a photograph.** Transcription draws each word fresh
from `lines` and applies the switches as it draws (`WordStack.svelte:23`, `:32-51`,
`:55-77`). Score markup draws stored text out of the singer's library,
`Pairing.cyrillic` and `Pairing.ipa`, which is only refreshed when that stored text no
longer matches the queue (`pairings.ts:468`). **There is no step anywhere on the score that
applies a switch as it draws.**

**The four switches that do work are a coincidence.** `applyNotationPreferences`
(`engine.ts:155-179`) happens to be four text substitutions on an IPA string, so they
survive being baked into stored text. Nothing designed that.

**Open syllables cannot reach the score by the current route, and that is correct.** The
score deliberately takes the raw poem, not the open-syllabified view, because its own
resolver applies open syllabification itself and applying it twice would slice the words
twice (`+page.svelte:4836-4839`, `vowel-resolver.ts:389-395`, Dann's N.10 of 7 August).

**Reconstitution has nowhere to travel.** It produces a different string, `ipaReconstituted`,
and the score's data carries only `cyrillic`, `ipa`, `vowel` and `origin`
(`pairings.ts:107-115`).

**The stress acute has to ask the poem who the word was**, at `pairings.ts:844`, and on a
note whose word the poem can no longer identify it gives up with a bare `continue`, no
count and no log.

---

## 4. WHAT MUST NOT BE TAKEN AWAY FROM THE SINGER

These are protections, stated as what they protect.

1. **A singer's placement survives a change to the poem.** If they seated a syllable and
   then edit the text, Ilya must not silently move their work. `reseat.ts:186-196` carries
   the rule and names the defect Dann walked on `b191867`, where seats were re-keyed by
   position and quietly reinterpreted. **The score's stored placement must stay the
   singer's, independent of the poem.**
2. **The poem the singer types wins**, N.112, shipped 2026-09-07. Do not undo it.
3. **Nothing is sliced twice**, per item 3 above.
4. **No mark that appears on everything.** `CONTRACT.md` §6: a mark on every note says
   nothing.
5. **Do not change `VocalLineEvent`**, and do not rebuild
   `apps/web/src/lib/shane/reconciliation/`.

---

## 5. WHAT THE AUDITS ALREADY SETTLED. Do not spend time re-deriving these

Two read-only audits ran 2026-09-21.

**One design is already refuted, including the desk's own first suggestion.** Copying the
word's stress facts onto the stored pairing **would go stale on the singer's very next
edit**. `handleStressAssign`, `handleStressRevert`, `handleYoCharToggle` and `handleReset`
(`+page.svelte:2679`, `:2694`, `:2703`, `:2774`) all call `runPipeline()` only, and
`runPipeline` (`:2317-2335`) never writes `doc.pairings`. `refreshPairings` compares text
equality, so a change that leaves the text identical passes unnoticed. **That is the exact
staleness this session spent two hours removing. Do not rebuild it.**

**A new required field on a stored pairing would break every song already in a singer's
library.** `library/types.ts:71`, schema 1, the only one ever shipped.
`library.ts:173-174` checks only that `pairings` is an object with string keys and never
looks inside a pairing. There is no migration mechanism. The house pattern is an optional
field with explicit `undefined` handling at every read (`pairings.ts:441-443`).

**Measured on Dann's own library through the branch alias:** 96 pairings on his Sunless
song, **25 whose `origin.lineIndex` does not exist** in the current one-line poem, **8 of
those carrying a stress mark**, so eight acutes withheld with no sign. Four origin words
gone from the poem entirely: «Тень», «непроглядная», «безответная», «Дума».

**Other places a singer loses work silently**, found in the same audit and worth naming
because they are the same fault: `reseat.ts:268`, and `keepSurvivingGlosses`
(`+page.svelte:2757-2771`), which drops a singer's own gloss override without a word.

---

## 6. WHAT TO DO. PROPOSE FIRST, BUILD NOTHING

**Write a design memo and no application code.** Dann wants to confer before this is built.

Write it from the singer's seat. Every section says what the singer sees or does; the code
follows as the means.

1. **The singer's experience after your change.** Walk it: they open a placed score, flip
   each of the seven switches, and you say what happens on the page each time.
2. **Where the drawing step goes**, with `path:line` for every seam.
3. **What the score keeps and what it works out fresh.** Dann's framing, offered as a test
   to argue with rather than an instruction: the stored pairing holds **what the singer
   placed**, and **how it is drawn** is worked out on every render. Say whether you agree.
4. **How a freshly drawn syllable learns what it needs** without storing facts that go
   stale (§5) and without asking the poem about a note the poem cannot identify (§4.1).
5. **What it costs the singer.** Does the page still feel instant at 97 notes while they
   flip a switch? Measure, do not assume.
6. **What it breaks**, every caller and test, and any rule in §4 it comes near.
7. **The design you rejected and why.** Dann was handed one recommendation tonight that an
   audit then refuted. He is better served seeing what you discarded.
8. **The 25 notes the score cannot answer for.** Say what a singer sees on those notes
   under your design. **Frame the choice for Dann; do not make it.** A console count is not
   visible to a singer, and a mark on every affected note is what §4.4 forbids. This one is
   his, and it is a question about what a singer should be told, not a coding question.

**Read before you propose, and cite it:** `WordStack.svelte` in full,
`VoiceProfilePane.svelte` from `:568` to `:650`, `buildSlotQueue`, `refreshPairings` and
`stressAcutedCyrillic` in `pairings.ts`, `reseat.ts` in full, and `engine.ts:155-179`.

---

## 7. NOT THIS ITEM

- **Word repair, text curation, OCR, and line reconstruction.** Separate.
- **The engraver's word division.** «не» carries `syllabic=single` in the MusicXML, so Ilya
  is honouring the engraver over the poet's spelling. That is a ruling of Dann's to make,
  not a defect.
- **Fixing the 25 stale seats.** Section 6.8 asks what the singer sees, not for a repair.

---

## 8. WHAT YOU COULD NOT ESTABLISH

Fill it. **NOT ESTABLISHED beats a complete invented answer.**

Two the audits left open:
- whether `stressSource` ever actually holds `'clitic'`, which `pairings.ts:847` and
  `WordStack.svelte:105` both test and no assignment site sets;
- whether anything reads `ReseatResult`'s `kept` / `removed` / `seated` / `unseated`, or
  whether they are counted and never shown.

---

## 9. RETURN MEMO

`docs/sessions/memo-n159-score-obeys-the-switches_r1_2026-09-21.md`. A design memo, no
code. Sections 6.1 to 6.8, then section 8.
