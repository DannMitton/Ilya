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
