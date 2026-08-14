# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Updated at the close of E.49,
2026-08-14.** Updated at the close of every session. This is the only file that
changes often, and it is the handover.

Repository: branch `Shane` at `7b1a1d2`, working tree clean. **Expected,
unverified.** Ask Dann in one line; you do not run git.
`7b1a1d2` shipped the `ilya:pairings` storage wiring, all five gates at
baseline, web-test still 438. Nothing is in flight.

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

---

## THE ONE THING

> **NOT ESTABLISHED. Dann's to pick.**
>
> N.55b's three named remaining pieces — the station's shape, Shift Lyrics,
> storage — are all `DONE` now, each browser-observed this session or the one
> before (see the tracker). Rotate syllables is `PARKED`, not blocking.
> **N.55b no longer names the next build.**
>
> Five blocking items sit open with nothing chosen among them: **N.56** (still
> unplaced in Dann's ordering), **N.58** (MIDI import, cheap, was behind
> N.55b, now clear), **N.59** (the reader in the browser, Pyodide, pin the
> versions), **N.32** (Guide's four remaining prose sites), **N.47** (print
> from a phone, a gate not a build, ten minutes, Dann's). A sixth surfaced
> this session, unnumbered — see "A finding this session," below.

---

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule

### The blocking SIX

| | item | state |
|---|---|---|
| `[x]` | **N.55b** Click Assignment | **DONE for its named active scope.** Increments 1, 2A, 2B, and the drift count shipped and OBSERVED before this session. **This session:** the station's ruled shape shipped `87317a8`, walked; Shift Lyrics (to the End of the Lyric, to the Next Open Note) wired with a caller, shipped `ccfdabd`, walked in both languages; `ilya:pairings` storage (save and load, neither swallows a failure) shipped `7b1a1d2`, walked with a distinctive-value proof (see the log). **Rotate syllables `PARKED`**, dropped from active scope by Dann 2026-08-14: built, tested, zero callers, not missed until something needs it |
| `[D]` | **N.56** draw the withheld page badly, once | R7 shrank its scope. **Still unplaced in Dann's ordering. Ask him** |
| `[ ]` | **N.58** MIDI import | cheap to parse, behind N.55b |
| `[ ]` | **N.59** the reader in the browser | **Pyodide, not a rewrite. PIN THE VERSIONS.** `claude/e43-n59-the-reader-in-a-browser_2026-08-12.md` |
| `[ ]` | **N.32** the Guide's false claims, prose only | **`PART DONE`**, shipped `821c5f5`. **FOUR sites remain**, three of them alt text on screenshots nobody has opened; if the images show those tabs, the owner is N.33 |
| `[ ]` | **N.47** print, from a phone, once | a gate, not a build. Ten minutes, Dann's |

**Closed 2026-08-13:** **N.55a**, the score with no underlay. Observed twice with
a negative control. That is what took the number from seven to six.

**A label to correct.** Commit `07225ce`, the no-lyrics banner, is messaged
`N.32`. **That label was mine and it is probably wrong**: N.32 is the Guide's
four remaining prose claims, and the banner is not one of them. The banner fix is
real, shipped, and walked; it is simply unnumbered. **N.32 did not move.**

### N.55b's station shape — RULED by Dann, 2026-08-13

The design's §11.3 asked what the slot station IS. Answered:

- **Finale's Lyrics window is the model**, from the manual and from the image
  Dann supplied: the lyric kept **whole and readable**, hyphenated at slot
  boundaries, with **one moving highlight** marking where you are.
- **A read-out, not a field.** No border, no caret, set in Ilya's own type.
  Transcribe owns every text operation and only one surface may take typing.
- **No IPA row.** Dann's formulation: the station reorients you in the poem as
  source text; the IPA reappears under the note once the correspondence exists.
  Putting IPA in the station states a correspondence before one is made.
- **The whole verse is present**, not a window onto it. The pane grows to full
  height and **the drawer's own scroll carries it** — one scroll, never two.
  Nested scrolling inside the drawer is the failure mode being avoided.
- **The 44 px floor is not spent.** Give the *cursor* a 44 px handle rather than
  every syllable. Direct tapping stays available; pinch-zoom is live and
  deliberately protected (`app.html:5`, and `app.css:247` says
  `maximum-scale=1` is not on the table).
- **Shift Lyrics lives in the pane**, per design §8: *to the End of the Lyric*,
  *to the Next Open Note*, *Rotate syllables*. Each is a permutation of the
  pairing map, so each is free to undo and testable without a browser.
- **Accepted cost:** this is easier on desktop than on mobile, and that is fine.
  On a phone the drawer is the whole screen (`Drawer.svelte:958`), so drawer and
  paper cannot both be visible. Some things are just harder on mobile.

**Arias:** `PRODUCT.md`'s "verse 1 only" does not bound a through-composed text.
Running text scales to it — 400 slots is roughly 25 to 30 lines of prose. The
same 400 as chips is about 1,600 px of boxes. Pagination is downstream layout and
does not touch this: the pairing map is keyed by event id, and events exist
before `paginateScore` runs.

### The GUI track. Ruled, none started, displaces nothing

**N.66** Studio · **N.42** the selector · **N.64** the shared intake · **N.65**
the anchors. **Fable's timing ruling: none of it is built before the beta
closes**, and its §S0 is six one-line rulings Dann owes first. **Open
`claude/e44-fable-ruling-studio-architecture_2026-08-13.md` before any GUI
opinion.** That rule was broken in two consecutive sessions.

### The visible list. Built only if a day finishes early

**N.62** · **N.63** · **N.45's remainder** · the **French colon spacing** (eight
sites, mechanical) · **N.51** · **N.17** · **N.19** · **N.27** · **N.61** ·
**N.6** (Gould r86/r87 stem lengths, OPEN and unbuilt).

---

## RULINGS DANN OWES. Ask one at a time, at the right moment

- **Which of the five open blocking items is next**, now that N.55b no longer
  names it. See THE ONE THING.
- **N.56's place** in the order.
- **N.63.** Killing the interstitial is ruled; **where the honest residue goes is
  not.** Asked in E.45, still unanswered.
- **N.45's remainder.**
- **N.67's displacement**, or it waits.
- **The French question mark.** Eleven strings carry U+00A0 before `?`, which is
  France's practice; the OQLF opts for none.
- **Whether to number this session's finding** (the no-lyrics first pass
  overwriting a restored `ilya:pairings` map). Recommendation: yes, N.68,
  OPEN, not built now. See "A finding this session."
- *(Not yet: what a deliberately empty note draws. Nothing depends on it. Do not
  raise it until something does.)*

---

## A finding this session. Not yet numbered

`+page.svelte:1147-1152`: any no-lyrics score upload sets `pairings =
firstPass(...)` unconditionally, with no check against what is already there.

**Verified in the browser, 2026-08-14.** `ilya:pairings` restores correctly on
reload: a planted, unmistakable value (nonsense Cyrillic at a real syllable's
origin) came back and displayed as the correct live text at the right slot
(`is-placed is-cursor` on the DOM node), proving R6's `origin`-matching works
before any score is re-uploaded. But re-uploading the SAME no-lyrics file
erases it, replaced by a fresh first pass. Since the score itself is never
persisted (only `pairings` is, CONTRACT §6's own exception), re-upload is the
ORDINARY path back into Fit after a reload. R5's save is real and currently
invisible on the one workflow it looks built for.

**Not N.27** (`profileStore.ts:220-224`, a different silent-save site,
voice-calibration, not pairings). **Not ruled in the N.55b design doc**, which
only rules the TEXT-side reconciliation (`origin` compared against the current
slot) and says nothing about SCORE-side re-ingestion. **Not N.67** (that
migrates the storage mechanism, not this logic).

**Recommendation: number it N.68, rule OPEN, do not build now.** Real gap,
nothing downstream depends on it yet, and a fix means deciding how a fresh
first pass should merge against a restored map — a design question, not a bug
fix. Cost of leaving it unnumbered: the next session re-discovers it from
scratch. Cost of numbering it: one line in the register.

---

## THE SCHEMA. It has survived eight sessions

1. Only blocking work gets built.
2. **A new cardinal displaces a named one or waits. Say which.**
3. Half of every build day is reserved for what the previous day's walk found.
4. Every build day ends in a deploy and a walk.
5. N.48 may be unclosable; it needs a `[u]` that fails.

---

## THE FIXTURE. Read out of the file, do not re-derive it

`~/Downloads/no-lyrics-control.musicxml` is the only instrument that exercises
the no-underlay path; all three of Dann's own scores carry lyrics.

**It holds five pitched notes and one half rest:** C4 D4 E4 F4 quarters, G4 half,
then a half rest. **It is NOT six notes** — two sessions in a row counted
`<note>` elements and reported a rest as a note. Its stripped lyric line was five
syllables, «Я тебя любил». **Its header title is a different text from its lyric
line**, which is why a queue drawn from the title gives a different count.

**The walk, four steps.** Transcribe some Russian, or the queue is empty and
nothing draws. Switch to Fit **before touching any file input.** Upload the
control, press *Continue to analysis*. **Expect `5 / 5`, syllables under the
notes, the rest bare, no dashed boxes.** Walked and confirmed 2026-08-13.

---

## STILL UNSETTLED. Not yours to settle alone

- "The page carries no chrome." · "Do not introduce a slider."
- **N.51:** whether per-tab colour may propagate past the tab bar.
- Whether `claude/shane-project-map_2026-07-25.md` is stale. **Unopened for ten
  sessions.**
- **D3's Job A**, per-verse reprints, ruled in E.36 and still unnumbered.
- **The per-format score arrival audit**, asked for in E.45 and never written.
- **The teacher-with-a-studio copyright case**, raised by Dann and unanswered.
- **`stripBackingRect` matches `fill="#FFFFFF"` while `staff-renderer.ts` paints
  `#F0EBE0`.**

---

## Register corrections owed

`claude/ILYA-REGISTER_2026-08-11.md` is at revision 10 and needs revision 11.

- **Its N.55a row is FALSE.** It reads `RULED`, unbuilt, and "AND IT REACHES
  NOTHING: no component reads parse warnings." Both were falsified by `08a0dae`
  on the same day. **N.55a is CLOSED and the blocking number there is SIX.**
- It says "ten cardinals" over a list of twelve. **Five actually remain and none
  is in the tree: N.1, N.2, N.3, N.18, N.21.**
- **N.6 is OPEN and unbuilt** and belongs on the visible list.
- **Its N.55b row is now stale too.** It reads `PART DONE`, increment 1 only.
  As of this session (E.49) the station shape, Shift Lyrics, and storage are
  all shipped and walked; only Rotate syllables is unbuilt, and it is PARKED,
  not blocking. See STATE.md's tracker for the current row.

**Or fold the register into this file and retire it.** It is the last piece of
canon still living in project knowledge.

---

## Log

| date | what changed |
|---|---|
| 2026-08-14 | **`87317a8`: N.55b's station shape rewritten to Finale's Lyrics-window model.** `SyllableStation.svelte` rebuilt from a wrapped chip grid to flowing hyphenated text, one moving cursor, the drawer's own scroll, the 44 px floor on the cursor alone. `CONTRACT.md`'s stale "chips take the floor" line corrected in the same commit. Walked. |
| 2026-08-14 | **`ccfdabd`: Shift Lyrics wired**, two of Finale's three scopes (to the End of the Lyric, to the Next Open Note). `ShiftLyricsControl.svelte` new; `+page.svelte` anchors each scope on the note currently holding the cursor's syllable, found by reverse lookup through `pairings` — **not** the cursor itself, which indexes a different sequence (`slotQueue`, not `eventIds`); confirmed with Dann 2026-08-14 after an initial wrong assumption of mine that the cursor could be reused directly. **Rotate syllables PARKED**: built, tested, zero callers in the tree, grep-confirmed, dropped from active scope on Dann's ruling — the 2-syllable case it existed for is already reachable by click-reassignment. Walked in both languages. |
| 2026-08-14 | **`7b1a1d2`: `ilya:pairings` storage wired.** `savePairings`/`loadPairings` (`pairings.ts:390-422`), neither swallows a failure; both surface in the drawer (`storage.saveFailed.quota`, `storage.saveFailed.generic`, `storage.loadFailed`), French corrected by Dann (*"lorsque"*, not *"si"*). **Verified in the browser**: planted a distinctive value in `localStorage`, reloaded, confirmed it restored and displayed correctly before any upload — R6 holding. **The same walk surfaced a gap: see "A finding this session."** Minor unfixed leftover: `shiftLyrics.forwardAria`/`backAria` in `i18n.ts` still carry straight apostrophes, inconsistent with the file's curly-apostrophe convention elsewhere; mechanical, not yet swept. |
| 2026-08-14 | **Shift Lyrics built: `shiftToEndOfLyric`, `shiftToNextOpenNote`, `rotateSyllables`, plus `ShiftResult` and `ShiftDirection`, in `pairings.ts`.** 22 tests in the new `shift-lyrics.test.ts`; **web-test baseline 416 to 438, moved with Dann's permission** at `ilya-ship.sh:79`. Drafted by a farmed-out Sonnet session, which **could not run either gate and correctly refused to invent a number**: no gate runs on the device VM, and the brief should have said so. **A DEFECT IN THE BRIEF, CORRECTED IN THE CODE:** the brief specified `shiftToNextOpenNote` as stopping one short of the open note, which displaced a pairing while an empty note sat beside it. **The open note is IN the range and absorbs the shift**, which is the only reading under which the undecided state does any work in that scope, and the only one that does not throw away a decision the singer made (R6). It now also searches in the direction of travel, since a gap can absorb only a shift moving toward it. **Three unruled shape decisions stand and are pinned by tests:** out-of-range indices clamp rather than throw, `fromIndex > toIndex` is a no-op rather than a swap, and a duplicated event id resolves to the higher local index. |
| 2026-08-14 | **`0656758`: the drift count reaches the drawer, and `reconcilePairings` has a caller.** `+page.svelte` derives the reconciliation from `pairings` and `slotQueue` and passes `shownPairings` to both `SyllableStation` and `VoiceProfilePane`. **PROJECTED, NEVER WRITTEN BACK**, because storing the refreshed map would store something derived. New string `station.textChanged`, `Text changed` / `Texte modifié`, **ratified by Dann 2026-08-14**: it agrees with `texte`, not with the count, so one string covers every number in both languages. **WALKED AND OBSERVED on `ilya-9cu1dd958`, both languages, with a negative control:** five syllables onto five notes read `SYLLABLES 5 / 5` and **no drift line at all**; re-transcribing to a different text then read `4 / 5` with `Text changed 5` and `Texte modifié 5`. The page went on printing the syllables the singer had placed, which is R6 holding. **N.55b's drift count is DONE.** |
| 2026-08-13 | **STATE.md rewritten clean.** Incremental edits through the session had left it self-contradictory: stale commit, "blocking seven", a closed question still listed as owed, two N.32 rows. **A log that only appends drifts; rewrite this file at the close, do not just patch it.** |
| 2026-08-13 | **`2868d58`: an Inspector re-division propagates instead of reporting drift.** `SlotOrigin` gains `word`, the discriminator; new `reconcilePairings`; `auditPairings` defined in terms of it. Eight tests, **web-test baseline 408 → 416** (`ilya-ship.sh:79`, moved with Dann's permission). **Dann ruled the distinction:** a re-division moves consonants within one word, nuclei never move, slot count cannot change, so the pairing is stale rather than wrong and is refreshed; a re-transcription is a different decision and stays drift. **VERIFIED IN THE TREE:** `openSyllabify` is a `map` over its input; `InspectorPanel.svelte:781-818` only ever moves a boundary value. **The design's §4.3 claim that boundary edits change how many slots a word has is WRONG.** |
| 2026-08-13 | **RULED, Dann: the notes never move; the syllables slide along them.** In `PRODUCT.md`. |
| 2026-08-13 | **RULED, Dann: N.55b's station shape.** See the tracker. |
| 2026-08-13 | **N.55a CLOSED.** The blocking number is SIX. |
| 2026-08-13 | **N.32-labelled banner `07225ce` walked on `ilya-9r34lgd7j` in EN and FR. Done, and unnumbered.** Rewritten from the singer's side; the old copy promised a mark struck in E.47 and an accept action that does not exist. French ratified by Dann, `se trouve` his correction of a calque. |
| 2026-08-13 | **N.55b increment 2B walked and CLOSED.** Five syllables onto five notes, nothing on the rest, no dashed boxes. |
| 2026-08-13 | **This folder created.** Project memory moved out of Claude project knowledge into the repository. 35 superseded openers and one superseded map SVG removed; the SVG archived at `docs/sessions/artifacts/`. Project knowledge 1,714,457 → 1,495,255 units, **85.7% → 74.8%**, measured. |

---
*E.48. Facts above are SOURCED from files read in full this session — the E.48
opener, the E.47 handover, the ILYA-REGISTER, the N.55b design, Fable's Studio
ruling — or measured directly from the tree, the deployed build, or
`project_info`. Where a claim rests on a comment beside code rather than on the
code, it says so.*
