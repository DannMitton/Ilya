# STATE archive, r1 draft

Created 2026-10-12 from `STATE.md` as it stood that day. Every block is verbatim, with the line range it came from. Nothing here is authoritative; the open record is `STATE_r1-draft.md`. Rulings that appear here also live where the block itself says (`OPEN.md`, `PRODUCT.md`, `OWED.md`, `CONTRACT.md`, or `../sessions/LOG.md`); `CHANGELOG_r1.md` lists each.


## From `STATE.md` lines 1 to 46: the header, the floor history, and the git line (condensed in the draft)

# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

**FLOOR MOVED at the close of N.174, 2026-09-27, to `9d1baa6`**, walked by Dann on the alias (THE ONE THING). **Before that, at the close of 2026-09-24, to `1987157`**, walked on Dann's library in French by the desk; `190cc74` above it is walked in part (THE ONE THING, "The tree at this close"). The older floor text follows for its history.

What it names instead is a **FLOOR**: everything described below was true at or
before **`f6d2184`**, "N.165: the loupe reads measure ownership from the score, not from an
id's spelling", shipped 2026-09-22 13:49, all five gates at baseline and **walked by Dann on
the alias in French 2026-09-22 13:54**: *"This looks as it should!"* (the previous floors,
`1b0d645`, `b29ee8c`,
`b29ee8c`, `8bd1aff`, `5f7be82`, `9b05ddd`, `9782d8e`, `44c5830`,
`46ac52f`, `2fb7516`, `1d18514`,
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

## From `STATE.md` lines 103 to 103: N.180, struck (closed)

- ~~**N.180.**~~ **STRUCK 2026-10-01 14:20 as a DUPLICATE of N.135** ("The page reader reads the text underlay", ruled by Dann 2026-09-14). The desk numbered it at 03:21 without searching the tracker (tether 16). Its notes now sit under N.135 in `OPEN.md`.

## From `STATE.md` lines 107 to 107: N.176, closed and walked

- `[x]` [CHECKED 2026-10-11 19:40 against git log: **Shipped `a3b239e`, walked 2026-10-09, legend moved to the header line.**] **N.176. The Markup legend explains the stems (up = close timbre, down = open timbre).** Asked by Dann 2026-10-01 01:51 from his dissertation, Appendix B; DESK DEFAULT number. Brief `../sessions/brief-code-markup-legend-stems_r1_2026-10-01.md`; French PROPOSED, awaiting his ruling.

## From `STATE.md` lines 116 to 116: N.171, closed

- `[x]` **N.171. Switch on the `#` repair.** CLOSED by Dann 2026-09-28 19:46; shipped `6ede257`. Account in `../sessions/LOG.md`.

## From `STATE.md` lines 148 to 154: N.164, closed

- `[x]` [CHECKED 2026-10-11 19:40 against git log: **Remainder absorbed by the Insights page review (OPEN.md) and rebuilt in `dfad53d` and `88529f8`.**] **N.164. Insights states two things at once that cannot both hold.** **2026-09-25: lines 3 and 4 FIXED, shipped `f5decd3`, seen by the desk on the alias; the compass and the empty region remain.** **RULED IN BY
  DANN 2026-09-22** from N.146's walk finding 7. On a read with no typed range it prints
  *"Without the range you typed, this page cannot say whether this key suits you."*
  **immediately followed by "Nothing in this piece is flagged for your voice."** Also on the
  same screen: a compass of **A3 to F♯6**, implausible for a sung line in that song, and a
  tall empty region at the top of the Insights box. Spec in `OPEN.md`. **All three are NOT
  ESTABLISHED as faults until the code is read.**

## From `STATE.md` lines 211 to 215: the N.155 duplicate row, struck

> **N.155's DUPLICATE OPEN ROW WAS STRUCK HERE 2026-09-21.** It said the item was open
> with its spec in `OPEN.md`, while the closed row above says it shipped in `b53a6df` and
> was walked. **Both rows stood from 2026-09-20 to 2026-09-21** and the count of open
> items was wrong by one for a day. The two deferred items it named are carried on the
> closed row, so nothing is lost.

## From `STATE.md` lines 271 to 281: N.130 and N.131, closed

- `[x]` **N.130. Insights has no French. CLOSED 2026-09-24: walked and every ruling seated, `2f955e6`.** About 58 entries at `i18n.ts:1417-1475`,
  all English in both languages, found while checking the loupe's undo clauses.
  **Belongs in the release cut's IN bucket:** the ruled release sentence names
  Insights, and a document in the wrong language is wrong rather than
  half-built. Spec in `OPEN.md`. **THE DESK DRAFTS THE FRENCH AND DANN RULES ON IT, ruled 2026-09-19**, superseding *"Dann owes the French; nothing is coined"*. His words: *"I prefer to have you suggest translations that I can react to. That saves me cognitive bandwidth."* **So never hand him blank slates.** Draft from the French already in the file, say which entries the glossary came from, flag the choices that are genuinely his, and let him ratify, edit, or decline. **Nothing reaches the tree until he ratifies it**, which is the one clause of the old rule that survives. **BUILT 2026-09-19: all 59 Insights entries are French** (`71ae880`), drafts and rulings in `../sessions/insights-french_r1_2026-09-19.md`. **UNWALKED.** **AND THE ROW'S OWN RANGE WAS WRONG: only 12 of the 59 sat in `:1417-1475`; the other 47 ran `:1476` to `:1522`.** A brief written to the cited range would have fixed twelve strings and reported Insights done.
- `[x]` **N.131. French parity everywhere else.** **[AUDIT 2026-09-30: CLOSED 2026-09-24, `1987157`, `SCHEDULE.md` week 3 and LOG 7556; the account below is history.]** The 64 or so untranslated
  entries outside Insights. **DESK DEFAULT on splitting this from N.130, and Dann
  can merge them with a word:** the two differ in urgency, and one number would
  bury the release-blocking half. **Its real size is NOT ESTABLISHED** until a
  triage separates the genuinely untranslated from the words that are identical
  in French on purpose. Not release-blocking. Spec in `OPEN.md`.

## From `STATE.md` lines 283 to 308: the blocking set, the closed and parked table pointer, and the visible list (condensed in the draft)

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

## From `STATE.md` lines 313 to 321: pointers to LOG.md block 4 and to OWED.md

> **Five sections moved to `../sessions/LOG.md` on 2026-09-01, Dann's ruling.**
> The N.67 document list, the E.54 and 2026-08-16 ruling records, the N.67
> step 4 split, and the second-score measurement. All verbatim, block 4.

## OWED, and the rulings Dann owes, moved to `OWED.md` on 2026-09-20

**Both sections, with their three subsections, are verbatim in `OWED.md`.** They are
open and not moving, which is why they are no longer here.


## From `STATE.md` lines 357 to 373: RULED 2026-08-16 on E.55 (kept in the draft, flagged) and the OWED.md pointer

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


## From `STATE.md` lines 379 to 573: the colophons and addenda of 2026-09-01 to 2026-09-22

*Split 2026-09-01; backup `STATE.md.bak-2026-09-01`. The closing colophons of
2026-09-10 to 2026-09-17 (early morning) moved to `../sessions/LOG.md` block 21 at the
close of 2026-09-17, about 02:00.*

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

*Close of 2026-09-21, about 20:10. **Five ships, every one walked**, and the floor moves to
`9782d8e`: `1d18514` (N.159, closing N.136 and N.158), `2fb7516` and `46ac52f` (N.160 steps 2
and 3), `44c5830` and `9782d8e` (N.161 and N.161b). **Everything `SCHEDULE.md` put in week 2 is
closed on the week's first day.** Gate 4 moved five times, 1354 to 1385, with Dann's permission
each time. **A read-only Sonnet sweep, spawned by the desk on his instruction, found a fourth
call site the desk and Code had both missed**, for 160k tokens against a 200k quote; its one
unverified row is in `OWED.md`. **The desk was corrected by Code four times across the day** and
each correction is recorded in `../sessions/LOG.md` blocks 28 and 29 rather than smoothed away;
the sharpest is that both shapes the desk offered for N.161b were wrong, and obeying the brief
would have built the worse one. `ENVIRONMENT.md` gained the five gate moves, the
wrong-document trap, and how to hold a loading window open. **NOT MEASURED: paint on a phone.
NOT ESTABLISHED: the five «одинокая» notes, `#onRemoteWrite`'s race, and the `updatedAt` write
on every load.** **Memory IS committed this time:** `2cd4094` carries every file named above,
and this corrected line rides the commit after it. A clean `git status` at the next session's
open is expected, not a surprise.*

*Close of 2026-09-21, about 22:20. **One ship, `9b05ddd`, carrying Code's `15b7d1a`**, five
gates at baseline. **N.153 is CLOSED ON SCOPE by Dann's ruling at 22:07** and all five stages
are in: caret-to-caret separation went from 1.13 to 7.89 px on 2026-09-18 to **44.00 to 44.16
px as drawn** on all 17 measures that carry notes. **Stage 4 retired nothing**: `OPEN.md`'s
"mostly retire with the crop" did not survive contact with the tree, because stage 3b
repointed the same arithmetic at the loupe's own render rather than leaving a dead path. A
read-only Sonnet audit established that, **for 268,709 tokens against the desk's 200k quote,
which was the desk's miss.** **The close almost buried two unbuilt parts of Dann's spacing
ruling of 2026-09-20**, which lived only inside N.153's spec; checking before the move is what
caught them, and they now stand as `OPEN.md` §THE CARET clause 16. **Dann ruled clause 15**,
the beam exception, on the desk's recommendation. `OWED.md` gained four debts, `LOG.md` gained
block 30, `ENVIRONMENT.md` gained three traps with index rows, `SEQUENCE.md` discharged
dependency 7, `SCHEDULE.md` recorded the close, and **N.162 is numbered**. **NOT MEASURED:
paint on a phone, still. NOT ESTABLISHED: m. 7's `minGap`, what clause 13's "its neighbour"
covers, and behaviour at any width but 390 px.** Memory NOT committed at the time of writing.*

*Close of 2026-09-21, about 23:40. **Three ships, two of them walked in both languages**,
and the floor moves to `8bd1aff`: `5f7be82` (N.132, the ratified names and the 0.5 rem
padding), `8bd1aff` (N.154's first row, the banner naming a dead tab), and the
« PARTITION » receipt fix riding this close. Five gates at baseline on every one.
**N.132's padding turned out to be load-bearing:** before it, `Insights` and « Aperçus »
were clipped off a 390 px screen entirely, 71 px over in English and 107 px in French, and
`DeskHead.svelte`'s own comment had called that Dann's to rule since N.127 without anyone
asking him. He ruled it off a drawing of three states, then walked the live build.
**Dependency 2 is discharged and N.130 and N.131 are unblocked.** Dann ruled label harmony
into N.131. A read-only Sonnet sweep of all 614 dictionary entries **found no stale string
the desk had not already found by hand**, which bounded the rename's damage to three keys.
`PRODUCT.md`'s tabs table was three names out of date and is corrected, with the
one-padding-value-at-every-width ratification beside it. `OWED.md` gained five debts,
`ENVIRONMENT.md` gained five traps and two corrections with index rows, `LOG.md` gained
block 31, `OPEN.md` lost N.132 and gained N.131's label clause, `SEQUENCE.md` discharged
dependency 2, and `SCHEDULE.md` ticked N.132. **The desk was wrong three times and Code
caught two:** a test grep that missed `apps/web/e2e-phone/` and stated an absence from it,
a fixed 62 px width chosen from one font on one machine, and a token quote low by a factor
of three. **The desk also failed to use `ENVIRONMENT.md`'s own index** and spent four calls
rediscovering `CHROME WILL NOT GO BELOW ABOUT 555 CSS PX`. **Code reported correcting a
stale memory note and no such change was on disk**; the two stale tab names it meant are
repaired at this close by the desk. **NOT MEASURED: paint on a phone, still. NOT
ESTABLISHED: a photograph at 390 px, `resize_window` having reported success without moving
the window twice; whether « PARTITION » fits 62 px in Consolas or Android's monospace; and
why the `zoom` region's coordinate frame is not `frameWidth / innerWidth`.** **The
« PARTITION » walk is the one thing owed from tonight.** Memory IS committed with this
close.*

*Addendum, 2026-09-21 about 23:50, after the close. **Dann asked how close the open work
was and the answer was that the records could not say**, so a bookkeeping audit ran. **Five
faults, four repaired in this pass.** N.155 was marked closed AND open and the ghost row is
struck. N.160's steps 2 and 3 were marked closed AND open in `SCHEDULE.md` and the
duplicate is struck. Week 1's caret-reach box was unchecked while the work had shipped, and
is ticked. **And N.151, "the measure edit surface, with insert", numbered 2026-09-17 with a
695-line spec carrying nine of Dann's rulings, had NO tracker row and appeared in no
sequence, schedule or debt list: nothing in the read order pointed at any of it.** It now
has a row. **The fifth fault is recorded rather than repaired, on purpose:** three closed
items' specs still sit in `OPEN.md` and each carries rulings that a move would bury in the
archive, which is the 2026-09-20 failure exactly. That triage, plus N.151's four
product-level rulings that belong in `PRODUCT.md`, plus four of week 1's boxes whose status
is NOT ESTABLISHED, are all in `OWED.md`. **The desk quoted this audit at twenty minutes
and was wrong for the third time tonight**; the safe part took that long and the triage is
a session of its own.*

*Addendum 2, 2026-09-22 about 13:20. **The ruling triage ran and it was not bookkeeping.**
`OPEN.md` held three closed items' specs, and none was archivable as it stood. **N.146
carried three of Dann's rulings and NINE LIVE WALK FINDINGS**, four of them things a singer
sees: a false word drawn from OCR, a text PDF's words landing in a new song rather than the
one holding the score, "Nothing in this piece is flagged for your voice" printed directly
under a sentence saying nothing could be checked, and New song needing two clicks. **They
are now `OWED.md` §"The N.146 walk findings" and none is numbered.** N.147's five ruled
defaults and N.151's four product-level rulings are transcribed to `PRODUCT.md`, which
gained three sections. N.155's residue is in `OWED.md`. **All three specs are archived in
`LOG.md` blocks 32 and 33, and `OPEN.md` now holds only open items.** **Week 1's four
remaining boxes are ESTABLISHED as never started**, searched across memory, the sessions
folder and `LOG.md`. **And one fault survives at the next level down:** Dann's ruling of
2026-09-14, "I don't want Ilya dropping hyphens", sits at `OPEN.md:1250` nested inside
N.141's 804-line spec, so it will go to the archive the day N.141 closes. Recorded in
`OWED.md`, not fixed, because N.141 is open. **The pattern across the whole triage: every
time the records were checked, more open work appeared, and none of it was new.**

*Addendum 3, 2026-09-22 about 13:30. **Four items numbered, and the tripwire fired
correctly.** Dann ruled in N.163 (Ilya shows a singer a word that is not on the page) and
N.164 (Insights states two things at once that cannot both hold), both from N.146's buried
findings, on the desk's recommendation that they meet the freeze rule's false-statement
test. **He then found a live defect on his own screen:** the loupe opens with no notes in
it, twice, on a song whose measures report « trop pleine ». That is N.165, DESK DEFAULT
number, and **his hypothesis and the desk's are both live and unseparated**, which the brief
puts to Code as its first reading. **N.166 came out of investigating it:** the same song, in
the desk's own tab, never drew at all and sat on the page reader, which for a stored score
it should not. **The desk's instrument was controlled before that was reported.** Brief
`../sessions/brief-n165-n166-blank-loupe-and-the-reloaded-scan_r1_2026-09-22.md`. **The desk
created an empty song `8ff79b63` in Dann's library setting up a control test and did not
delete it**, deletion being destructive and unauthorized; the previously active song was
`0714215b`. **And `STATE.md` crossed its own 600-line tripwire at 601**, which found sixteen
closed rows that had never moved; they are `LOG.md` block 34 and this file is back to under
500. **One dangling citation was repaired on the way**, N.129's row pointing at an
`OPEN.md` §N.129 that no longer exists. **NOT ESTABLISHED: the cause of the blank loupe, the
squircle's missing bottom edge, whether a stored scan re-reads on load, and all three of
N.164's parts.***

*Addendum 4, 2026-09-22 about 22:40, written at the close and **the thread ended because it
compacted**, which is itself the session's sharpest finding. **Three ships closed and walked
in French on the alias**: N.165's blank loupe (`f6d2184`, account now `LOG.md` block 35), the
reader's waiting note in Dann's own ruled words, and the « PARTITION » receipt gap. **N.130's
walk was started and is parked ten rows in at `finding.passaggio`, at Dann's word**, with
nine B1 rulings banked in `../sessions/insights-french-as-built_r3_2026-09-22.md`. **Dann
killed "phonation mass" as the desk's own coinage**, not a term from the literature, and
ruled `PRODUCT.md` §"Clarity for a receptive user, not compactness" over it. **He then ruled
that the code is not a constraint on the product** — *"there is always a way"* — which struck
one of the desk's own refusals the day it was written and **may want to be tether 23**;
that question is `OWED.md` row 3. **Karine St-Pierre's dissertation was read on his
instruction** and produced a memo and a proposal now at r2, whose strongest finding is
**performance length**: the field calls it impractical because a printed guide must name one
number for everyone, and **Ilya does not print for everyone**. **THE TRAP THAT ENDED THE
THREAD: the desk held that census in context intending to report it, and the compaction took
it.** The r2 proposal's figures therefore carry a provenance warning and must be re-verified
against the PDF. Trap and path in `ENVIRONMENT.md` §`A LONG READ DIES AT THE COMPACTION` and
§`THE BRIDGE CARRIES A THIRD FOLDER`. **NOT ESTABLISHED: whether St-Pierre adopted
performance length in her own Chapter 4; whether `fit.heading`'s new "compatibility" is
allowed to break one-term-per-concept against `tab.fit`; paint on a phone; and « PARTITION »
in Consolas.***

## From `README.md`, whole (the r1 README drops its history: the two stale-block incidents, the OWED split of 2026-09-20, the forty-eight openers, the 2026-09-20 near-miss, and the 2026-09-30 schedule note)

# Ilya project memory — START HERE

**This folder is the project's memory. It lives in the repository, beside the code,
under git. It replaces the per-session thread opener.**

Read this page. Then read only what it sends you to. Do not read the whole folder.

---

## THE ONE THING

> **Whatever `STATE.md` says it is. Open that file and read its first section.**
>
> **Do not restate the one thing here.** On 2026-08-14 this block still named a
> commit that `STATE.md` had never heard of, and the session opened on a
> contradiction it had to resolve before it could start.
>
> **It happened again and was caught on 2026-09-13.** This block still carried
> "the syllable station and the note click are `WRITTEN`, not `DONE`" and sent
> the reader to `STATE.md` §The walk. Neither phrase appeared anywhere in
> `STATE.md` any more, and there is no §The walk: the four-step walk lives in
> §THE FIXTURE. **Both lines are struck.** The rule this block states is the rule
> it kept breaking, so: nothing after the first line of this block ever names an
> item, a commit, a state, or a section of `STATE.md`.

Nothing else is in progress. Everything else is in `STATE.md` or `INBOX.md` and is
waiting, on purpose.

---

## Read order for a new session

1. **`CONTRACT.md`** — how we work. The tethers, the ceiling, and the things you
   must not do. **Read this every time. It is the shortest and the most expensive
   to skip.**
2. **`STATE.md`** — the one thing, the tracker, and the rulings Dann owes.
   **Then `QUEUE.md`**, every Code brief that has not shipped (created 2026-09-30). Read it every session; update it at every close.
3. **`ENVIRONMENT.md`** — only when you are about to touch a tool, a path, or a
   gate. It is a lookup table, not a read-through, and since 2026-09-01 it
   opens with an index keyed by symptom. Use the index.
4. **`PRODUCT.md`** — only before forming an opinion about what Ilya should do or
   look like.
5. **`OPEN.md`** — the specs for the numbered items that are open and not
   started. **NOT part of the opening read.** Open it when the one thing closes
   and you need the next item's spec, or when Dann names an item by its number.
   Split out of `STATE.md` on 2026-09-13; nothing in it was reworded.

6. **`SEQUENCE.md`** — the build order for the open cardinals, and the
   dependencies that fix it. **NOT part of the opening read.** Open it when the
   one thing closes and the next is being chosen, or when Dann asks to work
   through the queue. Created 2026-09-15.

7. **`SCHEDULE.md`** — the week-by-week road to the release on 2026-10-30.
   Open it when choosing what to do next, and tick it at every close. Created
   2026-09-16.

8. **`OWED.md`** — the standing debts and the unsettled questions: what the desk
   owes, what Dann owes, what has never been settled, and the retired register's
   live rows. **NOT part of the opening read.** Open it when one of its items
   comes up, when Dann asks what is outstanding, or when the one thing closes and
   the next is being chosen. **Split out of `STATE.md` on 2026-09-20 on Dann's
   ruling**, which took `STATE.md` from 1,141 lines to 547 and under its own
   tripwire for the first time. Nothing was reworded.

`INBOX.md` is append-only and **you do not open it unless Dann asks.**

`../sessions/LOG.md` is the archive behind `STATE.md`, split out 2026-09-01.
**Nothing in the read order opens it.** Go there to check what a superseded
ruling said, and nowhere else.

`../sessions/` holds the archived thread openers, handovers, and returned memos.
Nothing there is authoritative. **The code beats this folder, and this folder
beats the archive.**

---

## The four lifespans, which is why this is split up

| file | changes | who writes it |
|---|---|---|
| `CONTRACT.md` | rarely, when Dann rules a new tether | Dann rules, you transcribe |
| `PRODUCT.md` | rarely, when something is settled | Dann rules, you transcribe |
| `ENVIRONMENT.md` | when a tool, path, or baseline moves | you, when you learn it the hard way |
| `OPEN.md` | when an item is numbered, ruled, or starts | you |
| `SEQUENCE.md` | when an item closes or is numbered | you |
| `OWED.md` | when a debt is incurred or paid, or a question is settled | you |
| `STATE.md` | **every session, at the close** | you |
| `INBOX.md` | any time Dann digresses | you, one line, immediately |

The old openers rewrote all four every time. That is why there were forty-eight of
them and why the project knowledge estate filled up four times in a month.

---

## Opening a session

Dann pastes this and nothing else. Everything it used to say now lives in the
files above, which is the whole point of this folder.

```
Claude, I'm Dann.

Read ~/Desktop/ilya-rewrite/docs/memory/README.md first and follow its read
order. Do not read the whole folder.

Your first call is device_request_folder_access for
/Users/dannmitton/Desktop/ilya-rewrite and /Users/dannmitton/Downloads.
Folder grants do not carry between sessions.

Once the reads are done, emit the sequence-position block from CONTRACT.md §0.
Nothing else happens before it.

Then ask me for the repository state in one line. You do not write with git,
ever. Read-only git is allowed; CONTRACT.md §5 says which commands.

Then start on THE ONE THING in STATE.md. Do not bring me an engineering
choice. Before any helper runs, tell me how long you will be silent.
```

**If that prompt ever needs to grow, something has gone wrong in this folder
instead.** The E.48 opener it replaced ran to about six thousand words, and
forty-seven of its predecessors were written and thrown away.

**Its last line was changed by the desk at the close of 2026-10-05.** It read "Then start on THE ONE THING in STATE.md and stop after one question." Dann's rule of 2026-10-04 22:27 (`CONTRACT.md`) is that he says what he wants and the desk decides how, so the opener no longer invites a question. A DESK DEFAULT, his to overrule.

---

## Closing a session

0. **Check every open line against `git log` first. Added 2026-10-11 19:40 after an audit found 28 stale lines** (`../sessions/audit-memory-vs-git_r1_2026-10-11.md`): N.168 and N.172 read "not walked" two days after Dann walked them, and nine QUEUE rows read "ready" after they shipped. Run `git --no-optional-locks --no-pager log --since=<the last close> --format="%h %s"` and, for every row or item a commit names, set its line in `QUEUE.md`, `SCHEDULE.md`, and `STATE.md` §THE TRACKER in the same pass. A walk Dann reports goes into all three the moment he reports it, not at the close.
1. Update `STATE.md`: the one thing, the tracker marks, what moved. **If an item
   closes, its spec leaves `OPEN.md` in the same pass;** if Dann numbers a new
   one, its spec enters `OPEN.md` and its mark enters `STATE.md` §THE TRACKER.
   **A new debt or an unsettled question goes to `OWED.md`, not here.** `STATE.md`
   is the session's state; `OWED.md` is what is open and not moving.

   **AND CHECK WHERE THE RULINGS LANDED. Learned the hard way 2026-09-20:** moving
   a closed item's account to `LOG.md` can carry Dann's rulings into the archive,
   which this page says is not authoritative. **Six of his rulings went that way in
   one pass and were only caught because the next move was checked first.** Before
   you move an account, grep each ruling it carries and confirm it also lives in
   `OPEN.md`, `CONTRACT.md` or `PRODUCT.md`.
1b. **Tick `SCHEDULE.md` from the day's memos and reports. Added 2026-09-30 after Dann rediscovered a walk done on 2026-09-24 that no schedule line recorded.** For every `memo-*` or `report-*` written today, find the `SCHEDULE.md` or `QUEUE.md` line it answers and mark it there, with the file name. A ruling made inside a brief is copied to `OPEN.md`, `PRODUCT.md`, or `SCHEDULE.md` LATER in the same pass; a brief is not a ruling's home.
2. **Move what closed to `../sessions/LOG.md`.** Ruled by Dann 2026-09-01:
   **`STATE.md` holds only what is open. Anything that closes moves to `LOG.md` at
   the close of the session that closed it.** Size is an output, not a target.
   **Tripwire, not an allowance: over 600 lines means something failed to move.
   Go and find it.**
3. Add anything hard-won to `ENVIRONMENT.md`, **and add its row to the index at
   the top of that file.** A trap nobody can find costs the next session the same
   hour it cost the last one.
4. Ask Dann to commit. **No agent commits, ever, and no agent stages.** The
   narrowed rule, ratified by Dann 2026-09-13, is in `CONTRACT.md` §5: every
   git command that WRITES is forbidden; `status`, `log`, `diff`, `show`,
   `ls-files` and `check-ignore` are allowed.

That is the whole ritual. There is no handover document and no opener to write.

---
*Created 2026-08-13 from `claude/e48-thread-opener_v1_2026-08-13.md`, read in full.
Everything in this folder is SOURCED from that opener unless marked otherwise.*


## Moved from STATE.md at the close of 2026-10-12 23:45

### CLOSE OF 2026-10-12 20:15 (Opus desk; the thread compacted, so Dann closed it). THE NEXT DESK STARTS HERE.

> **Floor unchanged, `9f9e896`.** Nothing shipped since. The order of work, one paste at a time, each after Dann says the last is done:
>
> 1. **Row 88 is DONE** (Code on the Mac, report written 2026-10-12 20:07, `../sessions/report-code-trocr-teacher_r1_2026-10-12.md`; QUEUE row 88 holds the numbers). The model in ink-gap chunks reads ѣ 21 of 21, word-final ъ 98 of 101, syllables 385 of 493; і 6 of 6 only with a one-line map from Latin i. Code recommends it as row 82's teacher. The next desk reads the report whole and amends row 82's brief to use it. The desk wrote "RUNNING" here at 20:15 without checking the disk; corrected 20:17.
> 2. **Row 89's Fable review landed at 20:16: SEND WITH AMENDMENTS, seven of them** (`../sessions/review-fable-brief-row89_r1_2026-10-12.md`, md5 `517ccac4badd299d9e96646b191d3404`). Apply all seven as r2 (`brief-code-4f-quadruplet-and-double-flat_r2_2026-10-12.md`), then set row 89 READY. Headline: the brief named the wrong function (`lookForTupletNumber` answers only a 3; the reader calls `lookOverNotes`). Row 89 runs on the Mac, after the ship.
> 3. **The ship, now unblocked** (row 88 is done). One paste for Dann: merge `origin/cloud-lane-2` (row 83 at `e7acf7f`, row 87 at `aac1949`), add the untracked files of rows 78a to 88, move the ship script's gate baselines (`~/Downloads/ilya-ship.sh:116-117`, with a backup), check for iCloud " 2" duplicates, then ship. Known counts before the merge: gate 4 2479, gate 5 675 passed and 5 skipped, gate 2 242 (row 87 takes it to 248). Row 83 removes ignored files from gate 4's count, so measure the merged gates; do not compute them. Row 79 is partly built (STATE handover below, update 11:42); confirm with Code whether it finished before shipping.
> 4. **After the ship:** row 82 (paste ready); row 84 (fill in the shipped sha); row 84 also carries one sentence in `AGENTS.md` naming the cloud-lane exception (`OWED.md`, found 20:13); then row 89; check row 71 (held on `cloud-lane`) against the ruled voice-family table.
>
> **Dann's rulings this thread, each homed:** baritone and bass families (`PRODUCT.md`); the twelve French strings (row 85, built); "primo passaggio" and "secondo passaggio" in full (`PRODUCT.md`); the tidy's administrative choices deferred to the desk (14:48); 4F opened (19:58); quadruplets matter, "triplets are not the only tuplets" (20:10, row 89).
>
> **Open, not established:** set 4's bar counts above the truth (4A 57 of 54, 4E 45 of 42) and partial metre judging (4D 0 of 24, 4J 23 of 42).
>
> **Set 4's label map** (4A to 4J, glob order) is private: `~/Downloads/_desk-heldout4-private/row86-label-map.md`. Only 4F may be opened.

### HANDOVER OF 2026-10-12, the night thread from 01:28 (Opus desk, Dann asleep from about 01:37). READ FIRST.

> **Floor unchanged, `9f9e896`.** Nothing shipped; nothing committed. THE ONE THING is unchanged: the scan reader reads at least 95 of every 100 printed notes on unseen songs, on the singer's path.
>
> **RESULT 2026-10-12 19:55: THE FINAL TEST ON HELD-OUT SET 4 (row 86) READS 97.5 PASS, 1422 of 1456 printed notes, on the singer's path** (headless Chrome, WebGPU, the deployed alias at `9f9e896`, reader `homr-web@0.2.0-ilya.7/465`, deployment unchanged before and after; `../sessions/report-code-the-final-test-set4_r1_2026-10-12.md`, read whole by the desk). **Nine of ten songs pass; 4F reads 89.2 BELOW** (91.7 with its UNSURE notes set aside). 4F is the song whose truth carries the most uncertainty (the desk holds the label map privately; its truth notes name a blotted note and two bars of double flats); whether its misreads are the reader's or the truth's is NOT ESTABLISHED, and opening it is Dann's call. Unexplained in the lines: bar counts above the truth (4A 57 of 54, 4E 45 of 42) and partial metre judging (4D 0 of 24, 4J 23 of 42). Set 4 is now spent as a verdict for any song that is opened.
>
> **4F OPENED by Dann's word, 2026-10-12 19:58, and corrected.** Of its 11 misreads, 5 were the truth file's (mm. 2, 6, 14, 16, 17 counting the opening bar as m. 1; file indices 1, 5, 13, 15, 16; each checked by the desk against the scan at 300 dpi; the reader was right), 2 are the reader's in m. 22 (it read B♭4 where the print has a double flat, B𝄫4; Dann read mm. 21 to 23 at 20:05 and confirmed the truth), and 4 are the reader's in m. 24 (a printed "4" bracket, four quarters in the time of three, read as triplets). The corrected truth is `truth/<4F>.truth.corrected.json` in the private folder. **Corrected scores: 4F 94.1 BELOW; set 4 in total 97.9 PASS, 1427 of 1456; 9 of 10 songs pass.** The two reader gaps are general: a double flat read as a single flat, and a quadruplet read as a triplet.
>
> **Done this thread (each in its file):**
> 1. **Row 82 is READY** (`../sessions/brief-code-prereform-model_r2_2026-10-12.md`, all fifteen of Fable's amendments). For Code on the Mac after rows 78a to 79. It reads `~/Downloads/_desk-heldout-exclusions_2026-10-12.md` first (set 4 now listed).
> 2. **Held-out set 4 chosen and downloaded, sealed** in `~/Downloads/_desk-heldout4-private/` (ten pre-1918 songs, three bass-clef; J swapped to Glière Op.12 No.6 because set 2 holds Artsybushev Op.5 No.1; manifest there). Truth drafts: two Opus helpers running from about 01:53 (brief in the same folder).
> 3. **Baritone and bass ready to present**: `../sessions/present-voice-families-baritone-bass_r1_2026-10-12.md`. Draft r3 with eight new rows: `Insights Research/_synthesis/draft-voice-families_r3_2026-10-12.md`; claims from eight articles read whole: `claims-baritone-bass_r1_2026-10-12.md` there. Not read: Nava 1899, Nava 1872, Marzo 1906 (no text layer).
> 4. **French owed, drafted for Dann's ruling**: `../sessions/draft-french-owed_r1_2026-10-12.md` (row 66's twelve strings, row 70's five as built, row 67's three items: two now sourced from the OQLF, one closed by his 04:58 ruling).
> 5. **Rows 83 and 84 written and Fable-reviewed** (`../sessions/review-fable-briefs-83-84_r1_2026-10-12.md`). **Row 83 RUNNING in the cloud lane on a new branch `cloud-lane-2`** (session https://claude.ai/code/session_019AMrv87SSa5Rtk4X3pxvBk). Row 84 waits for the ship of rows 78a to 79.
> 6. **Debts paid:** SCHEDULE week 5 housekeeping (`PRODUCT.md` §"A hue names one idea"; INBOX-17 and -31 were already there); St-Pierre §3.1.1 re-verified against the PDF, and her Chapter 4 does give performance lengths (`OWED.md`).
>
> **Update 2026-10-12 11:42.** **Set 4's ten truth files are done**, all self-checked, in `~/Downloads/_desk-heldout4-private/truth/` (manifest updated; 4J is post-reform, so nine of ten are pre-reform). **Row 83 is built** on `cloud-lane-2` at `e7acf7f`, for Dann's merge. **Code on the Mac hit its usage limit:** rows 78a, 78b, 78c are WRITTEN and reported; row 79 is partly built (Text and Insights rules done; Insights line breaks, Markup's shared space, the 15 percent check, the after table, and its gates left). All uncommitted on `Shane`. Gates 4 and 5 moved (2461, 673 + 5 skipped) and the ship script's lines are the desk's to move. Code raised `staff-renderer.ts`'s ratchet 3486 to 3489 (DESK DEFAULT: accepted, the brief put the ring's reach in the renderer). One collision for Dann's eye at the walk: the tie between bars 56 and 57 of the Tchaikovsky song runs through two red rings. The section-heading back-fill is 6 of 19 files (`OWED.md`).
>
> **Not done, and why:** the `section_heading` back-fill (`OWED.md`) waits for a helper slot; it is about 1,700 rows across 25 files and needs a plan before a helper is sent.
>
> **This thread's mistakes, each owned when made:** gave Dann 4F's bars as the files' 0-based indices ("bar 21") while he counts from m. 1, corrected 20:07; told Dann at 14:37 that the ъЪ collapse lifts syllables 295 to 297 (a) and 315 to 317 (c); those are the ѣ rule's gains without the collapse. The collapse's gain with the ѣ rule on is 297 to 304 (a), 310 to 315 (b), 317 to 318 (c) (`../sessions/memo-yat-dictionary-correction_r1_2026-10-12.md`), corrected 14:41; told Dann at 14:13 that set 3's 93.8 was NOT ESTABLISHED on the singer's path without reading row 76's report; it was taken on headless Chrome, WebGPU, the deployed alias, through the file input (`../sessions/report-code-the-final-test-set3_r1_2026-10-11.md`, "The adapter"), corrected at 14:20; stamped six records about forty minutes ahead of the clock, corrected by search and replace (`ENVIRONMENT.md`, night of 2026-10-12); created an empty `docs/sessions/_stage` folder the bridge cannot remove (git ignores it).
>
> Older handovers: all in `../sessions/LOG.md`, the latest block "STATE.md handover of 2026-10-12 01:20, moved at the desk thread of 2026-10-12 01:28 onward".

---

## STATE.md close of 2026-10-12 23:45, moved verbatim at the close of 2026-10-13 23:35

### CLOSE OF 2026-10-12 23:45 (Opus desk; the thread compacted once, and Dann asked to close it). THE NEXT DESK STARTS HERE.

> **Floor `1ec2ef2`** (pushed 23:32; all eight gates at baseline: 251, 248, 0 errors, 2448, 675 + 5 skipped, 145, 55, ratchets OK). The ship before it was `72b564f` (rows 78a to 88, merged with `cloud-lane-2`).
>
> **THE ONE THING, measured:** set 4 now passes on all ten songs. 4F reads 98.0 PASS against its corrected truth (row 89; 4F was opened, so this is not an unseen verdict). The quadruplet in m. 24 is fixed (`apps/web/src/lib/omr/triplets.ts`). The double flat in m. 22 is not: homr's model chooses one flat (`decoder.ts:130`).
>
> **The order of work, one paste at a time:**
> 1. **Row 93 on the Mac, Code tab, a new session** (sent to Dann 23:39; brief `../sessions/brief-code-markup-blank-tchaikovsky_r2_2026-10-12.md`). Measures only, fixes nothing: why Annotation draws no syllables for «Средь шумного бала» (scan plus typed poem). Fable's lead: `MarkupPane.svelte:633-635`. Read its report whole, then write the fix row. Its untracked report files mean the next ship waits for it.
> 2. **Then walk rows 78a, 78b, 78c** (shipped `72b564f`; blocked by row 93).
> 3. **Row 82 on the Mac** (r3 READY, long). Then Corrections slice 4.
> 4. **Briefs owed by the desk, each with a Fable review:** row 90 (the Guide conventions lines; `insights.r2.frame` with its clause cut, `i18n.ts:1742`, pinned at `ratified-lines.test.ts:12`), row 91 (reflexive -ся is hard; the [ʌ] of -ться reconstitutes to [ɑ], after Grayson pp. 109, 128, 284; `OWED.md` N.123), Corrections slice 3.
> 5. **The double flat:** Ilya's own accidental-sign check (row 26, held), placed after row 93. Dann's point (about 23:00): the engraving shows two separate flats; a rule (two flats at the notehead's height, nothing between them) can infer the double.
>
> **Dann's rulings this thread, each homed:** section B and section C items 1 and 3 of the owed French (20:28, 20:30, `../sessions/draft-french-owed_r1_2026-10-12.md`); the frame line amended (20:55, `OPEN.md`); N.123 items 2 and 3 to Grayson (`OWED.md`); N.115 (orphaned last measure) set aside, raised a third time (21:10, `OPEN.md`); the desk may drive Claude Code in his Chrome (20:40, `CONTRACT.md` §4); the Corrections redesign runs beside the reader work; Insights uses two tiers of sources (22:04); Nair 2016 and Nair, *The Tongue as a Gateway*, excluded.
>
> **Insights research (N.168), in `~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/`:** `curation-sources-for-insights_r1_2026-10-12.md` is the working list (tiers, JVoice and JOS additions; Miller 2000 "Countertenoring" and McCoy 2003 confirmed in the JOS index). Seven PDFs filed by his naming convention (Echternach 2016 and 2024, Mainka 2015, Miller and Schutte 2019, Cruz 2026, Garcia 1894, Lablache 1920). Still empty: the contralto and the bass as their own voices. **Open question to Dann, unanswered:** may the desk read `~/Documents/Low Male Voice` for leads.
>
> **Set 4's label map** stays private (`~/Downloads/_desk-heldout4-private/row86-label-map.md`). Row 89's sealed drops are in `apps/web/test-results/_desk-hold/row89-drops_2026-10-12/` (ignored by git); never commit them.
>
> **This thread's mistakes, each owned when made:** pointed Dann at Terminal instead of the Code tab; called the rose bar "purple"; named the tab "Markup" while the app was in French (« ANNOTATION »); sent him to a one-line test fixture for *Within Four Walls*; said the desk would diagnose and then stopped; predicted gate 4 at 2447 when it measured 2448 (`markup-pages.test.ts:47-53` counts P.musicxml); a cloud prompt typed without focus did not land; `os.rename` removed row 93's r1 brief (restored); the web helper spent about 343k tokens against a stated 300k; marked Miller 2000 and McCoy 2003 NOT ESTABLISHED before searching the JOS index.
>
> The closes of 2026-10-12 20:15 and of the night thread are in `STATE-archive.md`, verbatim.


## Moved at the close of 2026-10-14 03:35, verbatim

### CLOSE OF 2026-10-13 23:35 (Opus desk; the thread compacted once, and Dann asked to close it). THE NEXT DESK STARTS HERE.

> **Floor unchanged: `1ec2ef2`.** No code changed this thread. Dann's git status at open (2026-10-12 23:4x): HEAD `1ec2ef2`, branch Shane, +0 -0; `docs/memory` modified, harness untracked.
>
> **THE ONE THING:** row 93 (Markup blank on «Средь шумного бала») is still unexplained. Code's report (`../sessions/report-code-markup-blank-tchaikovsky_r1_2026-10-12.md`) could not reproduce it in 7 cases (340 Cyrillic and 340 IPA each); its lead is `staff-renderer.ts:3157-3158` (`options.ipaPreview?.[ev.id] ?? a?.vowel`), pairings keyed by event id (`MarkupPane.svelte:224-228`). **Next diagnostic:** Dann's own stored record of the song, read-only, in his Chrome on the live alias. The order of work in the 2026-10-12 close (now in `STATE-archive.md`) stands from step 2 on.
>
> **This thread was Insights research (N.168), at Dann's direction.** Everything is in `~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/`:
> - `draft-musical-analysis-module_r1_2026-10-13.md`: the living plan, with every ruling timestamped. Ruled tonight: experience stage used (21:25); self-report live (21:30); two origins labelled (21:33); practice suggestions as "One approach many teachers use: … (Author year, p. n). Ask your teacher or coach whether it suits your voice." (22:01, amends 2026-09-25); the guiding principle (22:03); no overall difficulty grade (22:18); no goal question in intake (23:01); authors' disagreements named (23:04); causal claims only when a source makes them, Ilya a curator not an oracle (23:06); facts, claims, and frames as the comment grammar (23:09); challenges split from a score-facts strip (23:26).
> - **Guide statement RATIFIED, EN 23:11 and 23:14, FR 23:14** (text in the plan). Owed: a QUEUE row to place it (row 94, below).
> - `draft-challenge-list_r1_2026-10-13.md` (23 rows) and `fable-critique-challenge-list_r1_2026-10-13.md` (Fable, about 196k tokens against a stated 150k). **Next: challenge list r2**, applying the 23:26 ruling and the critique's changes 2 to 5 (DESK DEFAULT): merge the critical-note cluster; row 18 sourced from Christensen 2023; repair the miscitations; name the threshold disagreements and merge rows 7 and 8.
> - `ohs-extraction/` (251 claims from ten Oxford Handbook of Singing chapters, two Sonnet helpers, about 492k against a stated 400k); `_ocr-ohs/`, `_ocr-arneson/`; source texts for Christensen 2023, St. Pierre 2016, Ralston 1999.
> - `curation-sources-for-insights_r1_2026-10-12.md`: the ten OHS chapters and about twenty reference-list papers filed by Dann's naming convention; Ralston 1999 (P-R), Christensen 2023, St-Pierre 2016, NATS rubrics, Arneson 2014 (selected pp. 7-70; title page owed by Dann to confirm author order with Athey-Janka).
> - Still owed for step 2: Gobet and Chassy (NOT READ; never cite until read); Grayson 2012 pages for consonant clusters; OHS reference lists for chapters 7 (second read), 8, 10, 13, 29, 30, 52; whether OHS ch. 30 references continue on p. 620.
>
> **This thread's mistakes, each owned when made:** said Dann did not own the OHS; gave iPhone menu steps that were not on his screen; proposed "a way to practise" against the 2026-09-25 ruling; re-asked the already-ruled comment budget; conflated Garyth and Angelika Nair and recorded an opinion of a colleague (removed); guessed a missing p. 599 (it is a part title); cited Gobet and Chassy unread; downloaded a second Nix 2002; moved Dann's St-Pierre download to `_to_delete` (restored at once); left two stray empty files (moved to `_to_delete`); helpers over their stated worst cases twice.
>
> **Stray, untouched:** `~/Downloads/Chapter 8.png`. Files to delete by Dann: `Insights Research/_to_delete/`, `~/Downloads/_to_delete/`.


**N.185**, numbered by the desk 2026-10-14 (DESK DEFAULT, accepting Code's console label): a stored scan's seats filed under the old reader's note names find their notes again. SHIPPED `6c69161`, ratified by Dann 02:56. Closed in the session that numbered it.


## From `STATE.md`, moved at the close of 2026-10-14 23:50: the close of 2026-10-14 03:35, verbatim

### CLOSE OF 2026-10-14 03:35 (Opus desk). THE NEXT DESK STARTS HERE.

> **Floor: `6c69161`** (2026-10-14 01:24, N.185 / row 93). The previous close's stamp of "2026-10-13 23:35" was written about 23:2x by Dann's clock; that desk's clock ran ahead (Dann 23:33). Uncommitted at this close: `docs/memory/` only.
>
> **THE ONE THING is unchanged: the scan reader at 95 on unseen songs, on the singer's path.** Row 93 is DONE: the cause was the song's 170 seats filed under the old reader's note names (`r{bar}-{x}`), which the homr reading (no `<note id>`) never produces; N.185 re-keys them on reopen (`apps/web/src/lib/score/old-reader-seats.ts`, `+page.svelte` `applyArrival`). Dann then re-seated the song on the print's text; 172 of 172 sung notes seated (desk read of his record, 02:31).
>
> **Next, in order:** (1) **QUEUE row 96**: the Insights chart runs into the page footer on «Средь шумного бала» p. 3, *"must not be allowed in production"*. **Brief r1 WRITTEN 2026-10-14 about 03:50 (Opus desk, short session after `dbe41af`): `../sessions/brief-code-row96-nothing-over-the-footer_r1_2026-10-14.md`; it carries row 78b's 0.098. Taken since: the Fable review ran and r2 applies its seven amendments (`../sessions/review-fable-brief-row96_r1_2026-10-14.md`, `../sessions/brief-code-row96-nothing-over-the-footer_r2_2026-10-14.md`), and row 96 is RUNNING in the cloud lane on `cloud-lane-3` (QUEUE row 96).** The desk's lead, not measured: the screen-only "N more observations" block is left out of `paginate` (`InsightsPane.svelte:446`) and added to the page after (`:466-470`). (2) Row 78b's stroke constant 0.098 (`OPEN.md`, ruled 03:11), with row 96. (3) **N.135, ruled a priority by Dann 02:44** (*"We need to buiold that"*): Ilya reads no words from a scan today; rows 81 (measured), 88 (teacher, 385 of 493 syllables), 82 (READY) are its parts; the text it builds to is `OPEN.md`, "THE TEXT UNDER THE NOTES: A MIXED DEFAULT". (4) Row 95 (the scan banner's false "no words", EN and FR drafts put to Dann, not ratified). (5) Rows 47, 48 (tempo; row 48 now carries the body's-step principle, `OPEN.md`, and Dann's walk finding that "states no tempo" is false on a *Moderato* print). (6) Insights curation for tomorrow (INBOX 03:10: six pages too long, repeats, «One more observation», Further reading by source), with challenge list r2 (written this session, `Insights Research/_synthesis/draft-challenge-list_r2_2026-10-14.md`; open item: how many lead).
>
> **Ruled this session** (all in `OPEN.md`): the mixed default for the text under the notes (02:54); the limit of Ilya's changes, tethered to Grayson ch. 8 (02:44, 02:47); the underlay follows the score (N.135 addendum, 01:44, restating July's rulings); open syllables stays a personal option, off by default (INBOX 01:53); the body's-step tempo principle (03:20); placeholder stroke 0.098 sp (03:11).
>
> **Walk findings for the reader** (QUEUE archive, row 93): bar 36 read D♯ where the print has D; bar 40's G♮ read G♯; bars 62 and 70 empty in the reading.
>
> **This session's mistakes, each owned when made:** stated a cause for bar 18 and a lag "to the end" as fact before establishing either; recorded the score-over-poem rule as new without searching the July rulings; modernized «печальныя» in a text against Dann's default; sent an amendment to Code without Fable's review (said so at the time, DESK DEFAULT under §1 item 19).
>
> **Filed:** Quantz 1752, Hauptstück XVII Abschnitte 6-7, in `~/Documents/Voice Pedagogy Library/P-R/` (md5 fcce9c318390ac7f3c852357d9e4fdec); the IMSLP download remains in `~/Downloads/`. Not filed: London, *Hearing in Time*. The library list `Insights Research/_synthesis/library-files_2026-10-12.txt` predates it.
>
> The close of 2026-10-13 23:35 is in `STATE-archive.md`, verbatim.

---

*Moved verbatim from `STATE.md` at the close of 2026-10-15 about 16:10:*

### CLOSE OF 2026-10-14 23:50 (Opus desk, thread of 13:05). THE NEXT DESK STARTS HERE.

> **Floor: `0b0c52a`** (2026-10-14 22:58). Shipped this session: `db7fc43`, `50a5f85` (row 96 and the octopus merge of `cloud-lane-3` and `cloud-lane-4`), `0b0c52a` (rows 95, 97, 90, 94 and the merge of `cloud-lane-5` and `cloud-lane-6`). Uncommitted at this close: `docs/memory/` and four new files in `docs/sessions/` (row 98's brief r2 and review, both already copied in).
>
> **THE ONE THING is unchanged: the scan reader at 95 on unseen songs, on the singer's path.** N.135 (reading the words under the notes) stays the priority with it.
>
> **Running at this close: QUEUE row 98 on `cloud-lane-7`** (Sonnet, https://claude.ai/code/session_01WmwcmtbeAx6AaWKGx3SDJG): one copy of the reader engine, and `vercel.json` builds only `Shane` and `main`. **First thing next session:** read its report from GitHub (`ENVIRONMENT.md`, `READING A CLOUD BRANCH WITHOUT GH`), give Dann the merge and ship steps, then have him read ONE scan on the alias (the WebGPU path the cloud cannot test); revert the commit if that fails. Check that `cloud-lane-7` itself started no Vercel build.
>
> **Then, in order:**
> 1. **Resume the keep-or-drop walk at item 13 of 36, N.157** (replacing a score keeps the old seats; desk recommends keep), from `../sessions/memo-open-work-decisions_r1_2026-10-14.md`. One item at a time: what it is, what it is for, where it stands, if dropped, the desk's recommendation. Decisions so far are in THE TRACKER's note of 22:26 below.
> 2. **When the walk ends, Dann asked for an optimal sequence of every kept item** (23:31). Row 48 is provisionally next after row 98; row 5 runs alone in the cloud lane (it edits `+page.svelte`).
> 3. **The trimming audit, in the cloud lane:** dead code, unused assets, the dictionary loaded on demand (10.7 MB of the first visit), the non-jsep engine pair (13.6 MB, unreferenced per Fable), and the PDF library's `getOrInsertComputed` failure (`ENVIRONMENT.md`). Dann: *"Ask Cloud to audit once we've resolved its greedy consumption"* (22:42), so after row 98 lands.
> 4. **Dann deletes old Vercel builds in the dashboard** (the desk may not delete): keep production and the newest Shane; the list is in `ENVIRONMENT.md`, `EVERY BRANCH BUILDS ON VERCEL`.
> 5. **Row 97's two Guide captions:** the desk drafts new captions from the measurements and pictures in `../sessions/report-code-row97-fit-out-of-the-guide_r1_2026-10-14.md` and `../sessions/row97-guide-shots/`, EN and FR, for Dann's ruling.
> 6. **N.168's next work:** compose connections from the harvest already made (1,701 claims), plus targeted harvests for the gaps (passaggio advice for «Скучай» and *Sunless* 1; treble voice families) and for the red squircle's cited strategies.
>
> **Ruled this session** (all in `PRODUCT.md` or `OPEN.md`): Markup and Insights share one set of observations; the red squircle marks a notable coordination demand (definition in `PRODUCT.md`, "What a red squircle marks"), may mark an opportunity, and many songs carry none; two tiers, no second mark; "your voice" in singer prose; explain once, then "see also mm.", then pointers; style rules are defaults, the finished prose judged by ear; the Guide's three "Fit" passages and the heading "What Insights forecasts"; row 95's strings; N.140's floor 3.96 px and direction-decides gestures; the backlog accepted without walks; drops listed in THE TRACKER's note. Cloud credit is free to spend (`CONTRACT.md` §4).
>
> **Records of this session:** `../sessions/draft-markup-insights-one-set_r1_2026-10-14.md`, `memo-dann-authorial-voice_r2_2026-10-14.md` (his voice rules, with the 15:39 addendum), `memo-research-varied-generation_r1_2026-10-14.md`, the two audits (`audit-memory-staleness_r1_2026-10-14.md`, `audit-memory-staleness-big-three_r1_2026-10-14.md`), `memo-open-work-decisions_r1_2026-10-14.md`.
>
> **This session's mistakes, each owned when made:** the voice brief's sample premise (a bass's pitch meeting [ɑ]'s fR1) was impossible by Dann's thesis; three cost estimates ran over (190k on 150k, 151k on 100k twice); "a later entry carries no citation" misstated his pointer grammar; reported the duplicate engine as unchecked instead of checking it; stated the 2026-09-26 refactor ruling's scope from a summary instead of reading it (it predates the cloud lane). Lesson for the next desk: read the ruling, not the line that cites it.
>
> The close of 2026-10-14 03:35 is in `STATE-archive.md`, verbatim.

## Moved from STATE.md at the close of 2026-10-18 (verbatim)

### CLOSE OF 2026-10-15 about 16:10 (Opus desk, thread of 2026-10-15 00:00). Superseded by the block above.

> **Floor: `b21ce8a`** (2026-10-15 11:11). Shipped this thread: `14e2ff8` (row 98, merge of `cloud-lane-7`), `bf78ff6` (desk documents), `b21ce8a` (fast-forward of `cloud-lane-10`: rows 91, 100, 99, 101, 102). Uncommitted at this close: `docs/memory/`, the N.135 brief and review, the captions draft, row 82's and N.135 stage 1's reports and measure folders (Dann commits them with this close).
>
> **FIRST, a finding that changes a decision (N.135, row 103 stage 1, `../sessions/report-code-n135-underlay-harness_r1_2026-10-15.md`):** it was believed a browser-loadable reader could read the words under the notes; now known: no reader that loads in the browser reaches 9 of 10 syllables (best, (a), seats 65 percent; (c) aborts on Ilya's core; only Sunless 1 passes, under (c)). That is the brief's third outcome: **the question of a server goes to Dann** (brief §10). Also: row 81's row rule merges the Russian row with the German or the piano on 43 rows (stage 2a's `cutRows` must split at ink valleys); the prints' underscore joins cost every reader; splitting tokens at internal marks lifts (a) 1,391 to 1,761 of 2,538. Bring Dann the server question first, framed with its cost; nothing else in N.135 is built until he answers.
>
> **Row 82 finished** (`../sessions/report-code-prereform-model_r1_2026-10-12.md`): the first model meets every floor on S, T, K, M (ѣ 18 of 21, syllables 336 of 493 in its 1 MB integer form, which loads on Ilya's core), but the integer form's held-out error is 15.06 percent against the float form's 1.67, so Code recommends not shipping and training again to 30,000 iterations (about an hour on the Mac). DESK DEFAULT for the next desk: run that retrain (Mac lane, Dann pastes the prompt; the Claude app cannot be driven).
>
> **`cloud-lane-9` finished all four rows** (5, 47, 13, 48; tip `eeb055c`, from `14e2ff8`): not yet read by the desk, not merged. Shane has moved (`bf78ff6`, `b21ce8a`) and both lanes touched `+page.svelte` and `scripts/ratchets.json`, so the merge is not a fast-forward: **measure the merged gates in the desk's own workspace first** (`ENVIRONMENT.md`, "Measure the merged gates before the ship"), move the ship script's baselines (now phonology 267, web-test 2542; backup beside it), then give Dann fetch, merge, ship. Row 13's report says whether a scan dropped today reads again on its first reopen.
>
> **Then, in order:** (1) the N.135 server question to Dann; (2) the row 82 retrain; (3) re-shoot the two Guide pictures (`guide-step-01.webp`, `guide-step-13.webp`), one per language, then captions (`../sessions/draft-guide-captions_r1_2026-10-15.md`; its nine taste flags wait for the pictures); (4) strings owed to Dann, one at a time: row 99's `write-failed` sentence for a voice, row 100's `ios_chrome_body` (EN and FR, after the menu path is walked on his iPhone), N.135's `upload.banner.reader` (only if a reader is chosen); (5) row 102's three dictionary proposals and the pdf.js `getOrInsertComputed` failure (report on `b21ce8a`); (6) the rest of `SEQUENCE.md`, "THE SEQUENCE OF 2026-10-15".
>
> **Ruled this thread** (recorded in THE TRACKER's 2026-10-15 lines, `CONTRACT.md` §4, `QUEUE.md`, and project knowledge `claude/ruling-keep-or-drop-walk_2026-10-15.md`): the keep-or-drop walk finished (27 kept, 8 dropped, N.19 closed as built); row 48's two French sentences ratified 09:09; row 82 on Opus 09:06; rows 5, 47, 48 moved to the cloud lane on his question (DESK DEFAULT).
>
> **This thread's mistakes, each owned when made:** dropped a scan into his open song «Средь шумного бала» instead of a new song (stopped mid-read; the score file stayed; whether anything else changed is NOT ESTABLISHED); promised to drive Code on the Mac before checking the Claude app could be granted (it cannot); cost statements ran over (279k, about 300k against 200k and 250k); a typed prompt sent itself whole. The workspace restart lost eight hours overnight. Lesson: test a capability before promising it; copy agent outputs to the Mac as they land.
