# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

What it names instead is a **FLOOR**: everything described below was true at or
before **`46ac52f`**, "N.160 step 3: the seats diff against a stored seated text, and the heal
writes once, logged per song", shipped 2026-09-21 14:31, all five gates at baseline and walked
by Dann on his own library the same afternoon (the previous floors, `2fb7516`, `1d18514`,
`0f7375c`, `46f1d31`, `9801308`, `a86e985`, `fda5b9c`, `8cb9b51`, `7e28272`, `f4e31a2`, `6e98057`,
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

> ### READ THIS FIRST. Written at the close of 2026-09-21, about 19:15
>
> **THE ONE THING IS N.161: the load path should not write.** The plan is agreed between the
> desk and Code and is in `OPEN.md` §N.161. **It needs a brief and nothing else.** It takes
> week 2 and pushes N.141's last step to week 3, a DESK DEFAULT Dann can overturn.
>
> #### WHAT SHIPPED AND WAS WALKED, three ships in one day
>
> - **`1d18514`, N.159**, and it closed N.136 and N.158 with it. The score obeys every Notation
>   switch, drawn fresh from the live poem, nothing stored.
> - **`2fb7516`, N.160 step 2**, the dry run. It writes nothing and logs every seat's verdict.
> - **`46ac52f`, N.160 step 3**, the stored seated text and the heal. **Walked by Dann on his
>   own library:** *"yes :)"*.
>
> #### WHAT THE HEAL DID ON HIS LIBRARY, and the prediction held
>
> **`wrote 14 of 96 seated = 9 anchor + 5 joined; left 1 rejected + 4 unfound as they were.`**
> The dry run afterwards reads **91 address, 1 rejected, 4 unfound**, which was Code's
> prediction exactly. «Тень», the second «тень», «безответная» and «Дума» carry the poem again,
> and «непроглядная» maps across the poem's two words by the joined-run rule.
>
> #### THE BIGGEST FINDING OF THE DAY, and it is why N.161 exists
>
> **A plain reload was rewriting up to 60 of his stored seats.** `isCliticSeated` compared
> «В бью» to the score's «в бью» with an exact match, decided the fold was unseated, and
> `seatCliticFolds` rewrote notes 37 to 96 into the score's own coordinates. Step 3's case fold
> closes the live case; N.161 removes the mechanism.
>
> #### WHAT IS OWED ON WHAT SHIPPED
>
> - **Paint on a phone is NOT MEASURED.** Every timing is desktop.
> - **`refreshPairings`, `stressAcutedCyrillic`'s lookup, `ownedByPoem` and re-seat rules 1 and
>   2 are all still in the tree.** `memo-n160b` retires them; the desk held them back so the
>   first ship that wrote to a singer's stored work carried no refactor. **They get their own
>   commit.**
> - **Something writes `updatedAt` about seven seconds after every load**, with the record
>   otherwise identical. Code proved the heal is not the cause. Untraced.
> - **Dann's stress acutes switch read `true` at 04:00 and `false` at 15:50.** The desk did not
>   touch it after verifying it. **NOT ESTABLISHED.**
>
> #### THE BUFFER IS SPENT AND WEEK 2 IS FULL
>
> N.160 steps 2 and 3 took the week-5 buffer. N.161 now takes week 2 and pushes N.141's last
> step to week 3 beside N.132. **`SCHEDULE.md`'s rule governs from here: the lowest line in a
> week moves to LATER and the date stands.**

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

**The specs these marks point at live in `OPEN.md` from 2026-09-13.** This
section carries the marks; that file carries the items.

**AND THE ORDER THEY ARE BUILT IN LIVES IN `SEQUENCE.md` from 2026-09-15.** This
section says what is open; that file says what comes first and why. **Six
dependencies fix the order and everything else floats**; the rest of this file
does not repeat them.


### Numbered 2026-09-21

- `[ ]` **N.161. The load path should not write.** DESK DEFAULT number, **raised by Dann**
  2026-09-21 on being told a plain reload could rewrite up to 60 of his stored seats. **IN
  under the freeze rule, on both clauses.** `isCliticSeated` decides by comparing two strings
  (`clitic-seat.ts:398-420`) and `seatCliticFolds` rewrites the fold's whole run when it says
  unseated (`:447-457`); the comparison has drifted twice. **The plan is agreed between the
  desk and Code**, and Code corrected the desk on three points: `+page.svelte:2633` must lose
  the call too, the heal cannot seat a legacy song, and a partial seat is a broken run. Spec
  in `OPEN.md`. **DESK DEFAULT: it takes week 2 and pushes N.141's last step to week 3.**

- `[x]` **N.159. The score obeys the singer's switches. CLOSED 2026-09-21**, shipped `1d18514`
  and walked by Dann on his own library, in his Chrome on the branch alias: *"YEs :)"*. **It
  closed N.136 and N.158 with it.** Measured on his library at the walk: Reconstitution changes
  **16** notes, Open syllables changes **24** and moves no Cyrillic, and the new seat instrument
  reads **67 drawn live, 29 kept as stored, of 96 seated**. Spec and account moved to
  `../sessions/LOG.md` block 27. Brief
  `../sessions/brief-n159-score-markup-responds-live_r3_2026-09-21.md`, memo
  `../sessions/memo-n159-build_r1_2026-09-21.md`. **NOT MEASURED: paint on a phone.**
- `[ ]` **N.160. The work, and its two views.** DESK DEFAULT number. **The model is Dann's**
  (`PRODUCT.md`). **STEPS 1, 2 AND 3 ARE CLOSED 2026-09-21**, shipped `1d18514`, `2fb7516` and
  `46ac52f`, each walked. The heal wrote 14 of his 96 seats and the dry run afterwards reads
  91 address, 1 rejected, 4 unfound. **Steps 4 and 5 wait until after 2026-10-30.** Spec in
  `OPEN.md`, plan in `../sessions/memo-n160b-the-approach_r1_2026-09-21.md`. **The deferred
  ruling is STILL NOT ASKED, and not because the count is missing:** it is five notes, all
  «одинокая», and Code's reading is that they may be blocked by a seat that already holds the
  word rather than orphaned by a word that left. **Settle that before putting it to Dann.**
- `[x]` **N.158. Reconstitution never reaches Score markup. CLOSED 2026-09-21** inside
  `1d18514`. LEARN Unit 4's instruction now holds on the score: 16 notes change on Dann's own
  song. **His account of what reconstitution is moved to `PRODUCT.md` §WHAT RECONSTITUTION IS**
  before the spec went to `../sessions/LOG.md` block 27.
- `[x]` **N.119. The stress acutes reach Score markup. CLOSED 2026-09-21**, shipped `b4320d2`
  and walked. **N.119b** followed in `b543620`: a hand-assigned stress refreshes the stored
  pairing. **Its residue is N.160**, not a further acute defect.

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

- `[ ]` **N.141. The squircle has no grammar. THE HEIGHT RULE CLOSED 2026-09-21**, shipped `6101e01` and walked (*"Yes this is ideal"*). **Dann amended his own one-height ruling on 2026-09-20 to get it**; the amendment is in `OPEN.md` §N.141. **Open here: the squircle across a tie, which waits on N.142**, and the viewBox clamp binding on two notes. No longer `[D]`: the two questions that were his are ruled. Found by Dann on the walk of
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

- `[x]` **N.136. Open syllabification never reaches Score markup's drawn text. CLOSED
  2026-09-21** inside `1d18514`. Found by Dann on the N.118 walk. **24 notes now re-divide on
  his own song and the Cyrillic does not move**, which is the desk default he walked and
  passed. Account in `../sessions/LOG.md` block 27.
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

*Close of 2026-09-21, about 02:50. Four ships walked: `6101e01` (N.141's height rule),
`b4320d2` (N.119, the stress acutes), `b543620` (N.119b), and `345d943` (the N.159 and N.160
design record, no code). **The release path was rehearsed live and is proven**; `SCHEDULE.md`
week 5's "How the release goes out" is closed and `main` carries `2b980e7`. **Dann ruled the
musico-textual model**, transcribed to `PRODUCT.md`, and it reframes N.136, N.158 and N.159
into one item, N.160. **His library was read through the branch alias and holds 25 frozen
seats of 96**, of which 15 carry a word still in the poem. `ENVIRONMENT.md` gained six
sections with index rows, `OPEN.md` gained N.158, N.159, N.160 and N.141's amendment,
`PRODUCT.md` gained the stress acutes' purpose and the work-and-views model, and
`SCHEDULE.md` records that the week-5 buffer is spent. **The desk was wrong loudly and
repeatedly between 00:40 and 01:15**, on four claims it had not read, and the recovery was
reading before speaking. Memory NOT committed.*

*Close of 2026-09-21, about 03:50. One ship, `1d18514`, walked, and it closed three tracker
items: N.159, N.136 and N.158. The score obeys every Notation switch, drawn fresh from the live
poem on every render, with nothing stored. Gate 4 moved 1354 to 1360 with Dann's permission;
backup `~/Downloads/ilya-ship.sh.bak-1354-2026-09-21`. **The seat instrument fired on Dann's
own library for the first time: 67 drawn live, 29 kept as stored, of 96 seated**, so the
planning number for N.160 steps 2 and 3 is 29 rather than 25. His account of what
reconstitution is moved to `PRODUCT.md` before N.158's spec went to the archive.
`ENVIRONMENT.md` gained two sections with index rows, a correction on the execute bit, and a
gate-table update that was 91 tests behind the script. The walk was driven from Dann's own
Chrome and he ruled on the pictures. **NOT MEASURED: paint on a phone. NOT ESTABLISHED: where
the four seats beyond the predicted 25 come from, and whether `ilya:openSyllabification` was
left as it was found.** Memory NOT committed.*

*Close of 2026-09-21, about 19:15. Three ships, all walked: `1d18514` (N.159, closing N.136 and
N.158), `2fb7516` (N.160 step 2, the dry run) and `46ac52f` (N.160 step 3, the stored seated
text and the heal). The floor moves to `46ac52f`. **The heal wrote 14 of Dann's 96 seats and
the dry run afterwards read 91 address, 1 rejected, 4 unfound, which was the prediction
exactly.** Gate 4 moved three times in one day, 1354 to 1360 to 1368 to 1378, with his
permission each time. **N.161 is numbered and its plan is agreed between the desk and Code**,
which corrected the desk on three points; the account is in `../sessions/LOG.md` block 28.
`OPEN.md` gained N.161 and lost N.158 and N.159; `OWED.md` gained the retirement debt, the
`updatedAt` write and the stress-switch drift; `ENVIRONMENT.md` gained the two gate moves and
the wrong-document trap; `BRIEF-TEMPLATE.md` gained a displacement line, because Code had to
mark a displacement NOT ESTABLISHED that was never its to establish. **The bridge dropped
mid-edit at about 16:00 and one `STATE.md` write was lost; it was found by reading the file
rather than assumed, and rewritten.** Memory NOT committed.*

