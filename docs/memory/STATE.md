# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Updated at the close of E.50,
2026-08-14.** Updated at the close of every session. This is the only file that
changes often, and it is the handover.

**A label to correct.** Commit `2814fc3` says "close E.50." It was early: the
N.32 walk, N.56's parking, and N.58's scoping all happened in the same
conversation afterward. **This is E.50's real close.** The next session opens
as **E.51**.

Repository: branch `Shane`, HEAD `b5e8777` as of the last ship, working tree
**not clean** — this STATE.md update (N.56 parked, N.58 scoped as unclear,
the marks legend) is written to disk but not yet committed. **Ask Dann to run
the ship command below before treating this file as final.** Expected
resulting HEAD is unverified; ask Dann in one line; you do not run git.

This session (E.50) shipped four commits: `c6fc3ba` (N.68 filed), `4cfa5f0`
(N.32: Composer tab, gloss double-click, Ma traduction to Mon choix; also the
ilya-ship.sh fix noted in `ENVIRONMENT.md`), `b617a4b` (N.32: the French
provenance sentence, the gloss-persistence caveat, Mon choix's noun corrected
to a button), `b5e8777` (N.32 closed, walked and observed on `b617a4b`). All
five gates at baseline throughout, web-test still 438. One more commit is
pending: this file's N.56/N.58 update, below.

```
sh ~/Downloads/ilya-ship.sh "STATE: close E.50, N.56 parked (Dann's ruling, trigger unrecoverable), N.58 scoped as unclear"
```

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
> **N.32 closed this session**, shipped and browser-observed (`4cfa5f0`,
> `b617a4b`). **N.58's "cheap" label does not hold** (see the tracker); its
> real scope is NOT ESTABLISHED. **N.56 PARKED this session**, Dann's ruling:
> the trigger is unrecoverable from memory, and the general mechanism was
> observed working live (see the tracker).
>
> Three blocking items sit open with nothing chosen among them: **N.58**
> (scope unclear, see tracker), **N.59** (the reader in the browser, Pyodide,
> pin the versions), **N.47** (print from a phone, a gate not a build, ten
> minutes, Dann's). A separate, non-blocking finding from this session is
> numbered **N.68** — see the visible list.
>
> **Still owed to Dann from E.50's four-part ask** ("explain N.56 / N.58 /
> N.59 / N.68, one at a time"): N.56 and N.58 delivered this session. **N.59
> and N.68 not yet explained. Start E.51 there before anything else**, then
> N.47 in the afternoon per Dann's own deferral.

---

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

### The blocking SIX

| | item | state |
|---|---|---|
| `[x]` | **N.55b** Click Assignment | **DONE for its named active scope.** Increments 1, 2A, 2B, and the drift count shipped and OBSERVED before this session. **This session:** the station's ruled shape shipped `87317a8`, walked; Shift Lyrics (to the End of the Lyric, to the Next Open Note) wired with a caller, shipped `ccfdabd`, walked in both languages; `ilya:pairings` storage (save and load, neither swallows a failure) shipped `7b1a1d2`, walked with a distinctive-value proof (see the log). **Rotate syllables `PARKED`**, dropped from active scope by Dann 2026-08-14: built, tested, zero callers, not missed until something needs it |
| `[~]` | **N.56** draw the withheld page badly, once | **PARKED, Dann's ruling, 2026-08-14.** The trigger for "once" and the meaning of "R7" are unrecoverable from Dann's memory. This session's own browser observation (branch-alias origin, Dann's real "Dann" profile, 7/10 vowels, a real score uploaded and printed) showed the general withheld-page mechanism rendering correctly and honestly in steady state, no bad draw. That does not prove N.56 is fixed, since the trigger was never identified and so was never tested. Parked, not closed. Revisit only if a bad draw resurfaces on its own |
| `[ ]` | **N.58** MIDI import | **"cheap" does not hold.** `format-detection.ts:14-15,180` marks MIDI detection not-yet-built; `ingest.ts:55-56` references an "OMR/MIDI brief to Kimi" not located in project knowledge this session. Register cites `claude/e44-handover_v1_2026-08-13.md` §3.1 as primary source, unread. Real scope NOT ESTABLISHED. **FARM-OUT proposed, not yet answered**: Sonnet, read `e44-handover` §3.1 and locate (or confirm absent) the Kimi brief, return N.58's real scope. Ask Dann yes/no before writing the brief |
| `[ ]` | **N.59** the reader in the browser | **Pyodide, not a rewrite. PIN THE VERSIONS.** `claude/e43-n59-the-reader-in-a-browser_2026-08-12.md` |
| `[x]` | **N.32** the Guide's false claims, prose only | **`DONE`.** All four remaining sites shipped this session (`4cfa5f0`, `b617a4b`) and OBSERVED on the live `b617a4b` deployment, this session, by reading the rendered DOM text directly (not a screenshot read): the Ribbon replaces "Composer tab" in both languages, "Click Dictionary" replaces "Double-click," the gloss-persistence caveat is live, the French provenance sentence is the ruled replacement, and "le bouton Mon choix" replaced "l'onglet Mon choix." Zero occurrences remain of any of the four original false strings |
| `[ ]` | **N.47** print, from a phone, once | a gate, not a build. Ten minutes, Dann's |

**Closed 2026-08-13:** **N.55a**, the score with no underlay. Observed twice with
a negative control. That is what took the number from seven to six.

**Closed 2026-08-14:** **N.32**, the Guide's four remaining false claims.
Shipped and OBSERVED this session (`4cfa5f0`, `b617a4b`). That is what takes
the SIX to five still open: N.56, N.58, N.59, N.47, plus N.55b's active scope
already closed.

**Parked 2026-08-14:** **N.56**, draw the withheld page badly, once. Dann's
ruling: the trigger and "R7" are unrecoverable from memory; browser-observed
this session, the general mechanism works honestly in steady state. Takes the
five still open down to three not counting N.68: N.58, N.59, N.47.

**A label to correct.** Commit `07225ce`, the no-lyrics banner, is messaged
`N.32`. **That label was mine and it is probably wrong**: the banner fix is
real, shipped, and walked; it is simply unnumbered, and was never part of what
closed N.32 above.

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
**N.6** (Gould r86/r87 stem lengths, OPEN and unbuilt) · **N.68** (no-lyrics
re-upload overwrites a restored `ilya:pairings` map, OPEN, this session's
finding).

---

## RULINGS DANN OWES. Ask one at a time, at the right moment

- **Which of the three open blocking items is next**, now that N.55b no longer
  names it. See THE ONE THING.
- **N.63.** Killing the interstitial is ruled; **where the honest residue goes is
  not.** Asked in E.45, still unanswered.
- **N.45's remainder.**
- **N.67's displacement**, or it waits.
- **The French question mark.** Eleven strings carry U+00A0 before `?`, which is
  France's practice; the OQLF opts for none.
- *(Not yet: what a deliberately empty note draws. Nothing depends on it. Do not
  raise it until something does.)*

---

## N.68. Ruled OPEN, not built now, 2026-08-14

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

**Ruled: N.68, OPEN, not built now.** Real gap, nothing downstream depends on
it yet, and a fix means deciding how a fresh first pass should merge against a
restored map — a design question, not a bug fix.

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
