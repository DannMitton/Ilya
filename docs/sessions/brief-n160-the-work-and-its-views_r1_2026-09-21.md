# BRIEF — N.160. The work, and its two views

**Written 2026-09-21, 02:20, by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree read for this brief at `b543620`.**

**Numbered N.160, DESK DEFAULT.** **AUDIT AND PROPOSE. WRITE NO APPLICATION CODE.**

Read `docs/memory/CONTRACT.md` in full before you start.

**N.159 becomes a consequence of this item rather than a separate one.** Its memo,
`memo-n159-score-obeys-the-switches_r1_2026-09-21.md`, is good work and its measurements
stand. Read it. This brief asks whether its design is the right shape or a good patch on
the wrong one.

---

## 1. THE MODEL. Dann's, 2026-09-21, and it is the frame for everything below

> *"this gets simpler when we consider the Platonic musico-textual creation that both
> surfaces (Transcription and Markup) are reflections of. Why don't you conceptually start
> there instead of trying to fuse two disparate sources?"*

And, extending it:

> *"Thinking of it as reflections of a musico-textual object will allow us to easily process
> different text underlays for familiar melodies, and new melodies for familiar texts.
> There is no conflict here, just a bunch of musico-textual objects that need careful
> profiling."*

**There is one work: a text joined to a music. Transcription and Score markup are two views
of it. Neither view owns anything. Both render.**

A text and a music are separately reusable. Two verses are one music with two texts. A poem
set by two composers is one text with two musics. **The join of one text to one music, plus
the singer's decisions about it, is the object.**

### What Dann wants a singer to get, in his words

> *"Seamlessness, instantaneous correct information, carefully rendered and defensible."*

And his ruling on what the singer cares about:

> *"I don't think the user cares about which syllable was seated in another poem? That is
> irrelevant to their need for accurate representation of the poem they arrive with now."*

---

## 2. THE EVIDENCE THAT THE TREE ALREADY WANTS THIS

Read 2026-09-21 at `b543620`.

**The engine is verse-aware everywhere.** `analyzePerVerse` (`analyze-per-verse.ts`), and a
`verseNumber` parameter on `buildUnderlayResolvers`, `collectScoreWords`, `readScoreText`
(`clitic-seat.ts:467`), `findCliticFolds` (`clitic-seat.ts:145`), `seatScoreWords`
(`score-seat.ts:82`) and `watchlist.ts:333`. `analyze-per-verse.ts`'s own header states the
model plainly: *"Each verse sings the same notes with different text."*

**The stored song is verse-blind.** `apps/web/src/lib/library/types.ts` contains the word
"verse" zero times. **Every one of those calls defaults to `verseNumber = 1`, and nothing
in the tree passes anything else.** Confirm that last clause; the desk grepped it but did
not read every call site.

**So the model exists in the engine and is flattened at the storage layer.** That is a seam
today, not a future requirement.

---

## 3. THE CRITIQUE OF THE SHAPE WE HAVE. Attack it

The desk's reading, offered to be destroyed rather than adopted.

**The work already exists in the code as `doc`**: the text, the score, the glosses, the
corrections, the settings.

**But one field of the work stores a rendering instead of a decision.** `doc.pairings`
(`pairings.ts:118-127`) keeps `cyrillic` and `ipa` as finished strings. A rendering is what
a view produces. The moment the work holds one, the score stops being a view and becomes a
second model, and two models must then be reconciled.

**Everything the desk and Dann fought on 2026-09-20 and 21 is that reconciliation:**

| what broke | the reconciliation machinery involved |
|---|---|
| 25 of 96 notes frozen at old text | `ownedByPoem` (`reseat.ts:162`) and the coordinate re-key |
| Reconstitution and Open syllables absent from the score | the stored copy predates the setting |
| The stress acute silently missing | `pairings.ts:844` resolving a coordinate into the poem |
| A hand-assigned stress not following | `refreshPairings` comparing only `cyrillic`, fixed in `b543620` by also comparing `ipa` |

**And the key is the least stable thing available.** A seat remembers WHERE a word was
(`lineIndex`, `wordIndex`). Dann's poem went from several lines to one and every address
above line 0 became meaningless, although the words were mostly still there. **Measured on
his library, through the branch alias, 2026-09-21:** 96 pairings, 25 with a dead
`lineIndex`; of those 25, **15 carry a word that is still in the poem** (13 appearing
exactly once, 2 being «тень» which appears twice), and only 10 are genuinely gone, those
being «непроглядная» and «безответная», the two words the engraver split.

---

## 4. THE SHAPE THE DESK WOULD ARGUE FOR. Test it, do not assume it

**A seat stores the singer's decision and nothing else: this syllable of this word sings on
this note.** Not the text of that syllable. The text is read from the work, live, whenever
a view draws.

What should follow, if it holds:

- **Nothing can go stale**, because nothing is stored that could.
- **Every setting reaches every view for free**, including ones not yet invented, because
  both views render the same live word. N.159 then needs no drawing step of its own.
- **The reconciliation machinery shrinks or goes.** `refreshPairings`, the text comparison,
  the coordinate re-key, and possibly `ownedByPoem`.
- **Failure becomes honest and rare.** A seat loses its word only when the word genuinely
  leaves the text: 10 notes on Dann's song, not 25, and visibly rather than silently.
- **Verses become expressible**, because a seat that references the work's text by identity
  can reference verse 2's text as easily as verse 1's.

---

## 5. WHAT COULD SINK IT. These are the audit's real questions

**Answer each with `path:line` or NOT ESTABLISHED.**

1. **What is a stable reference to a word?** Position is not. The word's own text plus which
   occurrence is better but needs a tiebreak: «тень» appears twice in Dann's poem and two
   seats point at it. **Propose the reference and say what breaks it.** Consider that
   `SlotOrigin.word` already exists as *"THE DISCRIMINATOR between a re-division and a
   re-transcription"*, ruled by Dann 2026-08-13 (`pairings.ts:81-93`).

2. **Does a score's own lyric become the work's text, or stay a separate source?**
   `reseat.ts:186-196` protects seats made from the score's own words because their
   coordinates are `readScoreText`'s single joined line, not the poem's. **If a score's
   words become the work's text, that rule has nothing left to protect.** If they cannot,
   the model has a seam and this audit must name it rather than let it be discovered later.
   Dann's ruling in §1 bears directly on this.

3. **What does a view need that only the work can supply?** The acute needs stress
   provenance and clitic status; the loupe, Insights, the vowel forecast and the watchlist
   all read seated text. List every consumer and what each one asks for.

4. **Can a live read be fast enough?** N.159 measured its drawing step at 0.131 ms over 97
   notes, against a flip that already costs about 8 ms. **Paint was never measured.**
   Establish the real cost of rendering wholly from the work, at 97 notes and at the
   largest score in `~/Downloads`.

5. **What happens to a singer's existing library?** `library/types.ts:71` is schema 1, the
   only one ever shipped, and `library.ts:126-128` refuses a newer schema without ever
   upgrading an older one. **A change to what a seat stores needs a migration, and there is
   no mechanism.** Say what it would take, and whether a stored pairing's existing text can
   seed the migration.

6. **Is this one change or a sequence?** If it is a sequence, give the order and say which
   step delivers a singer-visible improvement first. **The release is 2026-10-30.**

---

## 6. WHAT MUST NOT BE TAKEN FROM THE SINGER

1. **Their placement survives a text change.** `reseat.ts:186-196` names the defect Dann
   walked on `b191867`, where seats were re-keyed by position and silently reinterpreted.
   **Whatever replaces that mechanism must protect the same thing.**
2. **The poem the singer types wins.** N.112, 2026-09-07.
3. **No mark that appears on everything.** `CONTRACT.md` §6.
4. **Do not change `VocalLineEvent`**, and do not rebuild
   `apps/web/src/lib/shane/reconciliation/`.

---

## 7. WHAT IS NOT THIS ITEM

- Repairing text: splits, joins, OCR garble, line reconstruction.
- The engraver's word division («не» carries `syllabic=single` in the MusicXML). A ruling
  of Dann's, not a defect.
- Building verses. **This audit says only whether the shape permits them**, not how they
  are drawn.

---

## 8. WHAT TO DO

**Audit, then propose. Write no application code.**

The memo carries, in this order:

1. **The singer's experience under your proposal.** They open a song, flip each setting,
   edit the text, and place a syllable. Say what they see at each step. Dann has told the
   desk twice tonight to lead from the singer, not the code.
2. **Your verdict on §3's critique.** Is the duplication the root, or is the desk wrong?
3. **Your verdict on §4's shape**, and the shape you would build instead if it is not that.
4. **Each question in §5, answered.**
5. **What the work is, stated as a type**, and what a view is allowed to hold.
6. **The sequence, with the first singer-visible step named.**
7. **What you would not do**, and what you would defer past 2026-10-30.

---

## 9. WHAT YOU COULD NOT ESTABLISH

Fill it. **NOT ESTABLISHED beats a complete invented answer.**

---

## 10. RETURN MEMO

`docs/sessions/memo-n160-the-work-and-its-views_r1_2026-09-21.md`. A design memo, no code.
