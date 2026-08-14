# STATE — where we are

**Updated at the close of every session. This is the only file that changes often.**

Repository: branch `Shane` at `25d2246`. **Expected, unverified.** Ask Dann for the
state in one line; you do not run git.

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

---

## THE ONE THING

> **Wire the drift count into the drawer.** `reconcilePairings` is correct and
> tested at `2868d58`, and NOTHING CALLS IT. `auditPairings` had no callers
> before it either, so no behaviour visible to Dann has changed yet.
>
> Then **N.55b's station shape**, §11.3. Dann has ruled the direction:
> Finale's running text, hyphenated at slot boundaries, ONE moving highlight,
> a read-out rather than a field, the whole verse present, the pane at full
> height carried by the drawer's own scroll. **Shift Lyrics commands live in
> the pane**, per design §8: to the End of the Lyric, to the Next Open Note,
> Rotate. Every one is a permutation of a map, free to undo, testable without
> a browser. **Accepted: this is easier on desktop than on mobile.**
>
> **The tab must be FOREGROUND.** Backgrounded, Chrome throttles the 12.8 MB
> dictionary from about 8 seconds to about 40. `document.hidden` is only a
> proxy; the direct hydration test is whether the app reacts to input.

### The walk, four steps

All three scores in `~/Downloads` carry lyrics. **`no-lyrics-control.musicxml` is
the instrument**: the Pushkin fixture with its five `<lyric>` elements stripped,
same six notes.

1. Transcribe some Russian, or the queue is empty and nothing draws.
2. Switch to Fit **before touching any file input.**
3. Upload `no-lyrics-control.musicxml`, press *Continue to analysis*.
4. **Expect:** the station in the drawer at `5 / 5`, the syllables under the
   notes, the rest bare, **and no dashed boxes.**

**THE FIXTURE, READ OUT OF THE FILE 2026-08-13. Do not re-derive it.**
`no-lyrics-control.musicxml` holds **five pitched notes and one half rest**:
C4 D4 E4 F4 quarters, G4 half, then a half rest. **It is NOT six notes.**
The stripped lyric line was five syllables. Its header title is a different
text from its lyric line, which is why a queue drawn from the title gives a
different count from one drawn from the lyrics.

**WALKED 2026-08-13: `5 / 5`. Five syllables onto five notes, nothing on the
rest, no dashed boxes. The feature is correct.** The E.47/E.48 opener was
wrong twice in one sentence: it said "same six notes" and expected `4 / 5`.
Both are struck.

After the walk: the reconciliation, checking **two citations by opening the files**,
one of them E.47's. Then **one** question for Dann, not several.

---

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[F]` farmed

### The blocking seven, and one is ready to close

| | item | state |
|---|---|---|
| `[x]` | **N.55b** Click Assignment | **2B CLOSED by Dann, 2026-08-13**, on the observed `5 / 5`. Increments 1, 2A and 2B all observed |
| `[D]` | **N.55b station shape** | **The design's own §11.3 is UNRULED: what the slot station IS.** Dann's reference is Finale's Lyrics window: the poem kept whole and hyphenated at slot boundaries, ONE moving highlight, click a note to place and advance. **Question put to him and unanswered:** is the station a read-out rather than a field, given §7 says Transcribe is the Lyrics window and only one of the two may take typing |
| `[x]` | **N.32** the no-lyrics banner | **DONE.** `07225ce`, five gates at baseline, **walked on the deployed build 2026-08-13 in EN and FR**, both strings read out of the DOM verbatim |
| `[x]` | **N.55a** the score with no underlay | **CLOSED by Dann, 2026-08-13. The blocking number is SIX.** Observed twice with a negative control: E.47 on `08a0dae` (4 pairings on the stripped score, 0 on the same music with lyrics), and on `07225ce` in EN and FR. **No written done-test for it ever existed anywhere in the estate; the standard applied was the register's own definition of `DONE`, a browser observation.** |
| `[D]` | **N.56** draw the withheld page badly, once | R7 shrank it. Not yet placed in the order. |
| `[ ]` | **N.58** MIDI import | cheap to parse, behind N.55a and N.55b |
| `[ ]` | **N.59** the reader in the browser | **Pyodide, not a rewrite. PIN THE VERSIONS.** |
| `[ ]` | **N.32** four false claims left | two are Dann's prose; two may belong to N.33 |
| `[ ]` | **N.47** print, from a phone, once | ten minutes, Dann's |

### What N.55b still needs, and it is short

- **Storage.** `ilya:pairings` is deliberately unbuilt. `savePairings` is written
  and unused, because a save that must not swallow needs a visible failure message,
  **and that needs French Dann has not seen. Bring him the string table, not a
  question about whether to have one.**
- **Tests for `pairings.ts`.** None exist. **Tell Dann the new gate number before he
  runs the ship script.**
- **Then the walk decides the rest.** Do not plan increments past what he has
  looked at.

### The GUI track. Ruled, none started, displaces nothing

**N.66** Studio · **N.42** the selector · **N.64** the shared intake · **N.65** the
anchors.

**Fable's timing ruling: none of it is built before the beta closes.** Its §S0 is
six one-line rulings Dann owes first. Open
`claude/e44-fable-ruling-studio-architecture_2026-08-13.md` before any GUI opinion.

### The visible list. Built only if a day finishes early

**N.62** · **N.63** · **N.45's remainder** · the **French colon spacing** (eight
sites, mechanical) · **N.51** · **N.17** · **N.19** · **N.27** · **N.61** · **N.6**
(Gould r86/r87 stem lengths, OPEN and unbuilt).

---

## RULINGS DANN OWES. Ask one at a time, at the right moment

- **Does N.55a close?**
- **N.63.** Killing the interstitial is ruled; **where the honest residue goes is
  not.** Asked in E.45, still unanswered.
- **N.45's remainder.**
- **N.56's place** in the order.
- **N.67's displacement**, or it waits.
- **The French question mark.** Eleven strings carry U+00A0 before `?`, which is
  France's practice; the OQLF opts for none.
- *(Not yet: what a deliberately empty note draws. Nothing depends on it. Do not
  raise it until something does.)*

---

## THE SCHEMA. It has survived seven sessions

1. Only blocking work gets built.
2. **A new cardinal displaces a named one or waits. Say which.**
3. Half of every build day is reserved for what the previous day's walk found.
4. Every build day ends in a deploy and a walk.
5. N.48 may be unclosable; it needs a `[u]` that fails.
6. Rebuild the tracker at the close.

---

## STILL UNSETTLED. Not yours to settle alone

- "The page carries no chrome."
- "Do not introduce a slider."
- **N.51:** whether per-tab colour may propagate past the tab bar.
- Whether `claude/shane-project-map_2026-07-25.md` is stale. **Unopened after nine
  sessions.**
- **D3's Job A**, per-verse reprints, ruled in E.36 and still unnumbered.
- **The per-format score arrival audit**, asked for in E.45 and never written.
- **The teacher-with-a-studio copyright case**, raised by Dann and unanswered.
- **`stripBackingRect` matches `fill="#FFFFFF"` while `staff-renderer.ts` paints
  `#F0EBE0`.**

---

## Register corrections owed

**The N.55a row in `claude/ILYA-REGISTER_2026-08-11.md` is FALSE.** It reads
`RULED`, unbuilt, and "AND IT REACHES NOTHING: no component in `apps/web/src`
reads parse warnings." Both were true at revision 10 and both were falsified by
`08a0dae` the same day. **N.55a is now CLOSED. The register needs revision 11 and
the blocking number there is SIX, not seven.**


The register at `claude/ILYA-REGISTER_2026-08-11.md` says "ten cardinals" over a
list of twelve. **Five actually remain, and none is in the tree at all: N.1, N.2,
N.3, N.18, N.21.** **N.6 is OPEN and unbuilt** and belongs on the visible list.
Fix the register, or fold it into this file and retire it.

---

## Log

| date | what changed |
|---|---|
| 2026-08-13 | **`2868d58`: an Inspector re-division propagates instead of reporting drift.** `SlotOrigin` gains `word`, the discriminator; new `reconcilePairings`; `auditPairings` defined in terms of it. **Eight tests, web-test 408 to 416.** **Dann ruled the distinction:** a re-division moves consonants within one word, nuclei never move, slot count cannot change, so the pairing is stale rather than wrong and is refreshed. A re-transcription is a different decision and stays drift. **VERIFIED IN THE TREE, not inferred:** `openSyllabify` is a `map` over its input; `InspectorPanel.svelte:781-818` only ever moves a boundary value, never pushes or splices. **The design document's §4.3 claim that boundary edits change how many slots a word has is WRONG.** |
| 2026-08-13 | **RULED, Dann: the notes never move; the syllables slide along them.** Recorded in `PRODUCT.md`. |
| 2026-08-13 | **N.55a CLOSED. The blocking number is SIX.** |
| 2026-08-13 | **N.32 WALKED on `ilya-9r34lgd7j`, EN and FR. `DONE`.** Station `SYLLABES 5 / 5`, rest bare, no dashed boxes. |
| 2026-08-13 | **N.55b increment 2B walked and CLOSED.** Five syllables onto five notes, nothing on the rest, no dashed boxes. |
| 2026-08-13 | **`07225ce`** the no-lyrics banner rewritten from the singer's side, EN and FR. The old copy promised a per-syllable mark struck in E.47 and an accept action that does not exist. New EN: "This score has no words in it. Your text is under the notes, one syllable per note. Click a note to move a syllable." French ratified by Dann; `se trouve` is his correction of my calque. Five gates at baseline. **Not walked.** |
| 2026-08-13 | This folder created. Project memory moved out of Claude project knowledge and into the repository. 35 superseded thread openers and one superseded map SVG removed from project knowledge; the SVG is archived at `docs/sessions/artifacts/`. Project knowledge went 1,714,457 to 1,495,255 units, 85.7% to 74.8%, measured. |

---
*SOURCED from `claude/e48-thread-opener_v1_2026-08-13.md`, read in full 2026-08-13.
The 2026-08-13 log line is measured directly by `project_info`.*
