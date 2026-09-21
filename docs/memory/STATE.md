# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

What it names instead is a **FLOOR**: everything described below was true at or
before **`0f7375c`**, "N.153 stage 3a: the loupe draws a render of the system, not a clone of
the page", shipped 2026-09-20 21:39, all five gates at baseline (the previous floors,
`46f1d31`, `9801308`, `a86e985`, `fda5b9c`, `8cb9b51`, `7e28272`, `f4e31a2`, `6e98057`,
`fe4d2c7`, `7c596f7`, `aca2dbb`, `76b24a3`, `eb918ed`,
`d6580af`, `8bb406c`, `78f3db8`, `490c12d` and earlier, are in
`../sessions/LOG.md`). A floor cannot go stale,
because further commits only move HEAD forward and never make the floor false.
If the tree is ahead of it, that is expected and tells you only that work has
landed since.

**The ten superseded floors that used to be listed here, `2b81f5a` through
`2d54185`, are in `../sessions/LOG.md`, block 5.** They are closed, and closed
things do not live in this file.

**The push range is the check, not the memo.** A floor that predates its own content
is the stale number this paragraph exists to prevent.

**Ask Dann for the state in one line. You do not WRITE with git, ever.**
Read-only git is allowed under the narrowed CONTRACT §5, ratified 2026-09-13:
`status`, `log`, `diff`, `show`, `ls-files`, `check-ignore`. Asking Dann is
still the courtesy and still the habit.

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

---

## THE ONE THING

> ### READ THIS FIRST. Written at the close of 2026-09-20, about 22:00
>
> **THE ONE THING IS N.153 STAGE 3b: derive the loupe's own spacing.** Stages 1, 2 and 3a
> are shipped. Stage 3b is the part that actually closes the caret collisions, and it is
> the part nobody has costed.
>
> #### WHAT SHIPPED TONIGHT
>
> - **Stage 2, `c3ca3f5`.** The bundle (`readingScore`, `analyzed`, `clef`, the font and the
>   five preview maps) reaches `Loupe.svelte` as a prop, assembled inside the existing
>   untracked effect. **Walked by Dann on a clean load of the branch alias and passed.**
>   Brief `../sessions/brief-n153-s2-data-channel_r1_2026-09-20.md`, sections 8 and 9 added
>   by the desk.
> - **Stage 3a, `0f7375c`.** The loupe draws a render of the system instead of a clone of the
>   page. `renderSystemSlice` lifted out of `paginateScore` and exported; new
>   `loupe-render.ts`; the render is mounted off-screen and measured there. Page and print
>   output byte-identical across 8 layouts. Brief
>   `../sessions/brief-n153-s3a-render-not-clone_r1_2026-09-20.md`.
>
> #### THE ONE THING OWED ON WHAT SHIPPED
>
> **`0f7375c` IS `WRITTEN`, NOT `DONE`. The real-click tap check was never run.** Code did
> not press any clicks and the desk promised to walk it in Dann's Chrome and did not. Note,
> rest and caret tap resolution on the deployed build is the outstanding item.
> **`ENVIRONMENT.md` §`THE CARETS CARRY NO CLASS`: count the geometry, never a selector.**
>
> #### THE GATE 4 BASELINE MOVED, on Dann's ruling
>
> `~/Downloads/ilya-ship.sh:79` now expects `"1333 passed (1333)"`, up from 1268. The 65 new
> tests are all in `loupe-render.test.ts` (64 from the loop at `:44-45`, 1 at `:79`) and the
> other four suites are unchanged. Original line backed up at
> `~/Downloads/ilya-ship.sh.bak-gate4-1268-2026-09-20`.
>
> #### THE FIXTURE IS EDITED AND UNCOMMITTED. DEAL WITH THIS FIRST
>
> **The desk edited `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`
> and it is sitting uncommitted, with twenty tests failing against it.** The edit set
> measures 17 and 18 to `ground-truth.json`'s reading. **It also deleted two `.bak` files
> from that directory, one of them tracked.** Dann's Downloads copy was overwritten too;
> its backup is `.bak-before-values-2026-09-20` beside it.
>
> **The revert, which Dann has NOT run:**
> `git checkout -- apps/web/src/lib/shane/ingestion/fixtures/`
>
> **Twenty tests in `clitic-seat.test.ts`, `punctuation-slot.test.ts` and `score-seat.test.ts`
> assert on the fixture's contents.** `clitic-seat.test.ts:56-58` holds a helper that undoes
> this afternoon's fixture change; `:114` asserts 97 cells. The corrected file has 96.
>
> #### WHAT DANN ACTUALLY REPORTED, and it is N.157, not the fixture
>
> **He saw a doubled « я. » and a split final value on screen.** The doubled syllable comes
> from the stored seat the desk hand-patched this afternoon (song `39ae51c9`, key
> `m17-1-2`) sitting alongside the note the file supplies. **That is N.157: replacing a
> score does not re-derive the seats.** The desk spent an hour on the fixture instead and
> Dann named the cost: *"When you extemporize and complicate, you actually harm me."*
>
> #### MUSORGSKY'S VALUES, ruled by Dann 2026-09-20 21:44, and they are his, not the desk's
>
> **«о-ди-но-ка-я» is a tuplet on the first two syllables, then a dotted quarter, an eighth,
> and a quarter.** His words: *"The tuplet is two half notes in the space of three
> quarters."* Confirmed against
> `tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/ground-truth.json`,
> parsed from his own Finale file with zero warnings and zero errors.
>
> #### T01 AND T05 WERE SWAPPED IN THE RECORD, corrected by Dann
>
> **T01 is Sunless 01**, `sunless-01-engraved.musicxml`, verified 2 parts and 18 measures.
> **T05 is `Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell.musx`**, 90
> measures. The desk's stage 2 brief named T05 for all three measurements, so **Code's clef
> and live-map numbers describe the wrong piece and must be re-taken on T01.** Recorded in
> that brief's section 9.

## THE ONE THING FOR THE NEXT THREAD: N.129, THE RULER

**Set at the close of 2026-09-20, when N.148, N.149 and N.150 closed together.**

**What `SEQUENCE.md` says, and it is SEQUENCE's claim rather than a reading of the
tree:** N.129 is dependency 1 and comes before every piece of horizontal spacing work.
`underlay-widths.ts:690` declares its table as Source Serif 4 metrics while the page
has drawn Source Sans 3 since the paginator began stripping the serif root, about
**12.2%** out on one measured word (**corrected 2026-09-20 from "about 5%", measured
on `e75d6f3`; see `OPEN.md` §N.129**). **N.153's derived spacing is horizontal spacing work, so it
sits behind this.**

**NOT ESTABLISHED: none of those files was opened on 2026-09-20.** The next thread
opens them before it writes a brief, per tether 21.

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

**The specs these marks point at live in `OPEN.md` from 2026-09-13.** This
section carries the marks; that file carries the items.

**AND THE ORDER THEY ARE BUILT IN LIVES IN `SEQUENCE.md` from 2026-09-15.** This
section says what is open; that file says what comes first and why. **Six
dependencies fix the order and everything else floats**; the rest of this file
does not repeat them.


### Numbered 2026-09-20

- `[x]` **N.155. A word broken across a system takes a hyphen at the line end.**
  Numbered 2026-09-20, DESK DEFAULT number; **design proposed by the desk, ruled in by
  Dann** at 14:07. **CLOSED**, shipped in `b53a6df`, walked. `LINE_END_HYPHEN_OFFSET_PX`
  holds its horizontal position as one value. **Two things were left for a later look and
  are not defects yet:** at a stave size under about 7 the mark would meet the barline,
  and a last syllable that opens a melisma gets its hyphen mid-melisma. Brief
  `../sessions/brief-n155-line-end-hyphen_r1_2026-09-20.md`.
- `[ ]` **N.157. Replacing a score does not re-derive the seats.** Numbered 2026-09-20,
  DESK DEFAULT number. **The defect under the period.** A replacement keeps every stored
  seat with its old text, never seats the note the new file adds, and `refreshPairings`
  updates a seat only on an exact origin match. Spec in `OPEN.md`. **The desk patched
  Dann's own library by hand as a one-off:** song `39ae51c9`, key `m17-1-2`, « я » to
  « я. ». That is not the fix.
- `[ ]` **N.156. The Sunless 01 fixture is missing its final syllable and a note.**
  Numbered 2026-09-20, **ruled in by Dann at 14:21**, who chose the real fix over
  retagging «ка». **Found by N.155's line-end hyphen on the first page it was drawn on.**
  The Lamm scan sets «о-ди-но-ка-я» on five notes; the fixture has four and never closes
  the word. **A second defect rides with it: lyric lines 1 and 2 disagree about
  «непроглядная» from measure 4 and line 2 lags by one note at the end.** Brief
  `../sessions/brief-n156-sunless01-fixture_r1_2026-09-20.md`.

- `[x]` **N.129. The underlay is spaced in the wrong font's metrics, and hyphens are
  never omitted. CLOSED 2026-09-20, both steps walked.** Step 1 shipped `e75d6f3`, the
  Cyrillic underlay drawing in the face its widths were measured from; Dann walked it in
  a browser and in print (*"it looks fabulous"*). Step 2 shipped `7bd3d04`, the omission
  removed and a word-internal gap reserving `HYPHEN_GAP_PX`; Dann walked it on
  « неп-рог-ляд-на-я » in Without Sun no. 1 and passed it. **The face ruling and the
  reading-versus-instrument rule are in `OPEN.md` §N.129.** Brief
  `../sessions/brief-n129-underlay-ruler_r2_2026-09-20.md`, memos
  `../sessions/memo-n129-underlay-ruler_r1_2026-09-20.md` and
  `../sessions/memo-n129-step2-hyphens_r1_2026-09-20.md`.
- `[ ]` **N.155. A word broken across a system takes a hyphen at the line end.** Numbered
  2026-09-20, DESK DEFAULT number. **Design proposed by the desk, ruled in by Dann** at
  14:07. It is the last case of his hyphen ruling of 2026-09-14. Spec in `OPEN.md`.
  **Two things are his and unruled: where the hyphen sits horizontally, and whether a
  melisma extender crossing a break wants the same.**

### Numbered 2026-09-16

- `[x]` **N.146. Ilya tells a poem from a score itself, for a PDF or a picture.** **CLOSED 2026-09-17: walk 5 passed in Incognito; step 2c built nothing (`OPEN.md`, N.146 findings, 9). Spec and account move to `LOG.md` at this session's close.** Numbered 2026-09-16, DESK DEFAULT number; design adopted on Dann's instruction (*"we will go with that"*). Spec `OPEN.md` §N.146. IN. No switch, no new strings (struck by Dann the same night). Brief `../sessions/brief-n146-poem-or-score-detected_r1_2026-09-16.md`. **2026-09-17: steps 1, 2, 2b shipped (`fe4d2c7`, `6e98057`); walk 5 outstanding; step 2c open** (THE ONE THING).
- `[x]` **N.147. CLOSED 2026-09-17.** The syllables moved into the loupe, and a note tap
  only selects. Shipped `55c04d9`, walked by Dann the same evening. Account in
  `../sessions/LOG.md` block 22.
- `[ ]` **N.92. Notation editing.** Numbered by Dann 2026-08-24. Slices 1 to 3 are
  shipped, insertion included. **The caret reach is DRAWN and shipped over six commits
  2026-09-17 to 2026-09-18, and is not usable on a phone: see N.153, which owns that.**
  Open here: the four singer's marks, tie to the note before, and the page flag for a
  measure left over.
  Spec `../sessions/spec-n92-edit-surface_r1_2026-09-17.md`, audit
  `../sessions/memo-n92-edit-audit_r1_2026-09-17.md`.
- `[x]` **N.148. CLOSED 2026-09-20** inside `6ca97db`. Undo and Redo moved into the
  loupe's bar and the Score Markup header's pair is deleted (`Drawer.svelte`, read
  2026-09-20: no `stackActions`, no `undoLabel`, no `onundo`).
- `[x]` **N.149. CLOSED 2026-09-20.** The loupe's two modes, design A's segmented
  pill, and the carets confined to Corrections. Shipped `6ca97db`, walked by Dann on
  desk-driven screenshots the same morning: *"Acceptable for now, but later revision
  needed."* **One finding deferred by him and UNNUMBERED: the duration row wraps, so
  the dot and Tuplet drop to a second row.** Brief
  `../sessions/brief-n149-both-modes_r1_2026-09-20.md`.
- `[x]` **N.150. CLOSED 2026-09-20.** The drawer's band is Voice / « Voix », and
  Corrections left the drawer in the same ship, `c582892`. **« Voix » ratified by
  Dann on screen the same morning.** The key `group.scoreMarkup` is unchanged; only
  its values moved, because `sections.test.ts:67` asserts on `BAND_IDS`.
- `[~]` **N.152. Playback of the Markup.** LATER, its own cardinal, asked for by Dann
  2026-09-17. Spec in `OPEN.md`.
- `[ ]` **N.153. The loupe re-engraves the held measure at its own spacing.**
  Numbered by Dann 2026-09-18. Spec in `OPEN.md`, five stages, each landing on its
  own. **It is what closes the 27 caret collisions**, which are scale-invariant and
  reachable no other way. Account of the stop that produced it:
  `../sessions/memo-n92-loupe-reengraves_r1_2026-09-18.md` §1. **AND IT IS BIGGER THAN
  THAT: measured 2026-09-18, the tap separation between a caret and its neighbour
  runs 1.13 px to 7.89 px at phone width against a 44 px floor, on all 17 measures.
  The insert reach does not work on a phone at all until N.153 lands.**

### Numbered 2026-09-14

- `[D]` **N.141. The squircle has no grammar.** Found by Dann on the walk of
  `d6580af`, 2026-09-14: the ring takes the IPA on one measure and not on three,
  it is trimmed inside the measure region only sometimes, and an accidental of the
  taken note can meet its edge. **Marked `[D]` because two of its three questions
  are his taste, not the desk's:** what the squircle encloses, and whether it may
  extend past the measure's region. The number is a DESK DEFAULT. Spec in
  `OPEN.md`, including the permission to re-engrave the measure for the loupe and
  what that permission costs.

- `[ ]` **N.140. The loupe guarantees a stave space, and scrolls rather than
  shrinking below it.** Dann's own design, ruled 2026-09-14, over the desk's
  recommendation to do nothing; both cases are recorded in `OPEN.md`. **A
  phone-portrait item:** the desktop branch already derives its magnification to
  hit a 12 px target (`Loupe.svelte:152`, `:686-691`), and Dann reads the loupe
  well on his desk. **He owes two things: the floor in CSS pixels, and whether
  the scroll may take a gesture on a surface where the swipe dismisses and the
  tap places a syllable.**

- `[ ]` **N.136. Open syllabification never reaches Score markup's drawn text.**
  Found by Dann on the N.118 walk: the toggle moves, and neither the Cyrillic
  nor the IPA on the page changes. Spec in `OPEN.md`. **Not a regression from
  N.134 or N.118**; those made a partial gap total.
- `[ ]` **N.135. The page reader reads the text underlay.** Ruled by Dann
  2026-09-14. Cost measured the same night in
  `../sessions/memo-n135-ocr-measurement_r1_2026-09-14.md`. Spec in `OPEN.md`.

### Numbered 2026-09-13

- `[ ]` **N.130. Insights has no French.** About 58 entries at `i18n.ts:1417-1475`,
  all English in both languages, found while checking the loupe's undo clauses.
  **Belongs in the release cut's IN bucket:** the ruled release sentence names
  Insights, and a document in the wrong language is wrong rather than
  half-built. Spec in `OPEN.md`. **THE DESK DRAFTS THE FRENCH AND DANN RULES ON IT, ruled 2026-09-19**, superseding *"Dann owes the French; nothing is coined"*. His words: *"I prefer to have you suggest translations that I can react to. That saves me cognitive bandwidth."* **So never hand him blank slates.** Draft from the French already in the file, say which entries the glossary came from, flag the choices that are genuinely his, and let him ratify, edit, or decline. **Nothing reaches the tree until he ratifies it**, which is the one clause of the old rule that survives. **BUILT 2026-09-19: all 59 Insights entries are French** (`71ae880`), drafts and rulings in `../sessions/insights-french_r1_2026-09-19.md`. **UNWALKED.** **AND THE ROW'S OWN RANGE WAS WRONG: only 12 of the 59 sat in `:1417-1475`; the other 47 ran `:1476` to `:1522`.** A brief written to the cited range would have fixed twelve strings and reported Insights done.
- `[ ]` **N.132. The ratified names are not built.** `Text`, `Markup`, `Melody`,
  ruled 2026-09-13 in both languages, and the tree still says "Transcription" and
  "Score markup" (`i18n.ts:106`, `:117`, `:59`). **Found because Dann walked the
  colour deploy and read the tabs.** Carries the ruled tab padding of 0.5 rem,
  which nobody has seen on screen. Spec in `OPEN.md`.
- `[ ]` **N.131. French parity everywhere else.** The 64 or so untranslated
  entries outside Insights. **DESK DEFAULT on splitting this from N.130, and Dann
  can merge them with a word:** the two differ in urgency, and one number would
  bury the release-blocking half. **Its real size is NOT ESTABLISHED** until a
  triage separates the genuinely untranslated from the words that are identical
  in French on purpose. Not release-blocking. Spec in `OPEN.md`.

### THE BLOCKING SET IS EMPTY, 2026-08-21

**Nothing blocks the beta.** N.67 (the save function) CLOSED WHOLE 2026-08-18;
N.72 (no singer can ever receive a fix) CLOSED 2026-08-21; N.58 (MIDI import)
DEFERRED TO FUTURE DEVELOPMENT by Dann 2026-08-21; N.59 (the reader in the
browser) PARKED AT TIER 2, answered no, 2026-08-18. **The four rows with their
full accounts moved to `../sessions/LOG.md` block 10 at the close of
2026-09-10 late.** Still open inside them and carried here: N.59 step 3, the
brace rule, is `WRITTEN` and not `DONE`; a singer on Chrome for iPhone can
never install Ilya to the home screen (Dann to rule).

> **The "Closed and parked" table (N.80, N.81, N.79, N.62, N.63, the colon audit, N.78, N.70, N.71, N.68, N.55b, N.56, N.32, N.55a, N.47, N.69) moved to `../sessions/LOG.md` block 9 at the close of 2026-09-10.** All closed or parked; nothing in it is open.

### The visible list. Built only if a day finishes early

~~**N.62**~~ (now THE ONE THING, 2026-08-23) · ~~**N.63**~~ (closed 2026-08-23) ·
**N.45's remainder** · ~~the **French colon spacing**~~ (closed as the colon
audit, `9d314de`) · **N.51** · **N.17** · **N.19** · **N.61** · **N.6** · and,
unnumbered, **the watch band's English header** (`watchlist.ts:92`, printed
in French mode; Dann to rule).
**N.27 now has a home, and the recommendation is IN THE TREE** as a comment at
the reporting seam (`library.ts`, `Library.save`), recorded by N.67 step 6 and
deliberately not built: when N.27 is built, `profileStore.saveStore`
(`profileStore.ts:217-225`, which the step 6 brief cited as `:216-224`) routes
through that seam. It is the last catch-and-drop of its kind in the tree.
**N.28** ships on N.67's step 5 binder.

---


> **Five sections moved to `../sessions/LOG.md` on 2026-09-01, Dann's ruling.**
> The N.67 document list, the E.54 and 2026-08-16 ruling records, the N.67
> step 4 split, and the second-score measurement. All verbatim, block 4.

## OWED, and the rulings Dann owes, moved to `OWED.md` on 2026-09-20

**Both sections, with their three subsections, are verbatim in `OWED.md`.** They are
open and not moving, which is why they are no longer here.


## THE SCHEMA. It has survived ten sessions

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
then a half rest. **It is NOT six notes.** Its stripped lyric line was five
syllables, «Я тебя любил». **Its header title is a different text from its lyric
line.**

**The walk, four steps.** Transcribe some Russian, or the queue is empty and
nothing draws. Switch to Fit **before touching any file input.** Upload the
control, press *Continue to analysis*. **Expect `5 / 5`, syllables under the
notes, the rest bare, no dashed boxes.** Walked and confirmed 2026-08-13.

**This same walk is N.67 step 3's observation**, with the expectation stated
before the walk: re-uploading the control over placed syllables no longer erases
them.

**The print fixture, E.51.** Marshak's Russian of Shakespeare's Sonnet 90, under
Kabalevsky op. 52 no. 9, fourteen lines. **It fills exactly two letter sheets.**

---

## RULED 2026-08-16, ON E.55'S WALK FINDINGS

- **The walk's findings come before N.67 step 4**, per the schema's own rule
  that half of every build day is reserved for what the previous walk found.
- **N.70 and N.71 are numbered. The third finding, no cursor on a note, is
  FOLDED INTO N.71** rather than tracked: one CSS declaration on the same
  element as N.71's fix.
- **N.55b's row is corrected rather than left tidy**, Dann's words.
- **The N.70 fix is Dann's own third option**, better than either I posed:
  filtered on desktop, no `accept` at all on iOS. Named consequence, accepted:
  the tree's `isMobile` is a WIDTH test, so a narrow desktop window also gets
  the unfiltered picker.

## STILL UNSETTLED and the retired register's live rows moved to `OWED.md` on 2026-09-20

**Verbatim.** Same reason: open, and not moving.



---


---
*Split 2026-09-01; backup `STATE.md.bak-2026-09-01`. The closing colophons of
2026-09-10 to 2026-09-17 (early morning) moved to `../sessions/LOG.md` block 21 at the
close of 2026-09-17, about 02:00.*

*Close of 2026-09-17, about 02:00. N.146 steps 1, 2, and 2b shipped (`fe4d2c7`,
`6e98057`); step 2c under investigation by Code. Findings 1 to 8 of the N.146 walk moved
to `OPEN.md`; the Howell extraction and the previous close's standing-rules paragraph
moved to LOG block 21. `PRODUCT.md` gained "Why Ilya exists"; `ENVIRONMENT.md` gained
`THE ALIAS CHECK THAT WORKED` and `THE EXTENSION CANNOT SEE HIS TAB`; `SCHEDULE.md`
gained the per-format samples. The floor moves to `6e98057`. Memory NOT committed.*

*Close of 2026-09-19, about 22:00. Seven commits, `02dd6d2` to `438f08f`, all
pushed, none walked, so the floor stays at `637acc1`. The ILYA REGISTER is retired
and project knowledge now holds no canon. Insights and N.131's real 25 are French;
N.130's recorded range was wrong and is corrected. The held measure's page mark is
gone and clause 16 is closed. The desk drafts the French from now on, ruled by Dann.
`SCHEDULE.md` gained N.154 and gated N.84 on it; `ENVIRONMENT.md` gained the
transfer fault; `INBOX.md` gained two N.84 notes; `OPEN.md` closed clause 16. The
twelve-versus-five gaps count is reconciled: five remain, and seven were located.
N.153 was not touched. Memory NOT committed.*

*Close of 2026-09-20, about 22:00. N.153 stages 2 and 3a shipped, `c3ca3f5` and `0f7375c`;
stage 2 walked and passed, 3a NOT walked. The floor moves to `0f7375c`. Gate 4's baseline
moved to 1333 on Dann's ruling. The Sunless 01 fixture is edited and uncommitted with
twenty tests failing; the revert is in THE ONE THING and Dann has not run it.
`ENVIRONMENT.md` gained four rows. Memory NOT committed.*
