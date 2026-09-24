# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

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

## THE ONE THING

> ### READ THIS FIRST. Written 2026-09-24 11:07. Dann on a break mid-session
>
> **Focus switched by Dann 09:48 from N.168 to the schedule's outstanding items.** The `ccb790c` walk was done in both languages (Insights on Cupid and Sunless 2; Markup on Sunless 2; octave checked on bars 1, 9, and 12 against his dissertation). Its findings shipped as **`5e22d03`**, all five gates at the new baselines (web-test 1401; score-parser 602 + 5 skipped, 607; `ilya-ship.sh` edited with Dann's permission, backup `ilya-ship.sh.bak-1396-2026-09-24`). **`5e22d03` is WRITTEN, not walked.** Brief and memo: `../sessions/brief-code-vowel-chart-all-ten_r1_2026-09-24.md`, `memo-code-vowel-chart-all-ten_r1_2026-09-24.md`.
>
> **Next, in order:** (1) walk `5e22d03` on the alias: Cupid on Texte shows the score's words; Insights shows ten vowels with 0 s rows; the receipt reads « 1 ligne »; Sunless 2 Markup shows 4/4 once. (2) Paste `../sessions/brief-code-meter-provenance_r1_2026-09-24.md` into Code (Code found the Finale files store an actual meter with a different displayed one, and denigma keeps only the actual; Sunless 1 MusicXML still prints 12/8 where the edition prints 6/4). (3) Per-format walk: `.musx` and MusicXML done; `.mxl`, `.mnx`, `.mscz`, PDF, photo remain. (4) CHECK rows: Sonnet memo `../sessions/memo-sonnet-check-rows_r1_2026-09-24.md` says six CLOSED, two need a print by Dann (INBOX-5 colour, UNSETTLED-8 VERIFY box); **its citations are not yet spot-checked by the desk.** (5) N.142 step 2.
>
> **Added 15:25.** `5e22d03` walked by the desk in Dann's Chrome (read only): four checks passed; the fifth found Aperçus page one overprinting its foot on first render. Meter provenance answered (`../sessions/memo-code-meter-provenance_r1_2026-09-24.md`; `ENVIRONMENT.md`, `FINALE PICKUPS AND musx2mxl METERS`). Per-format walk on a sha URL: `.mxl` and `.mscz` pass; `.mnx` was refused by a 2,048-byte sniff; PDF stalled in a hidden tab (NOT ESTABLISHED). Code fixed the `.mnx` sniff and the page-one fit and counted **N.142 step 2: zero, nothing to build** (`../sessions/memo-code-afternoon-findings_r1_2026-09-24.md`). web-test baseline 1401 to 1402 with Dann's permission (backup `ilya-ship.sh.bak-1401-2026-09-24`). CHECK rows: the Sonnet memo's citations spot-checked by the desk and hold; six CLOSED, two await Dann's prints (INBOX-5, UNSETTLED-8). N.168 added to `SCHEDULE.md`. **Left:** walk the afternoon ship; the two prints; the PDF read and a phone photo; N.130's French walk (B2, A).
>
> **Added 15:35.** `d1cc2d3` walked by the desk: Cupid Aperçus in French fits page one on first render. CHECK rows: **UNSETTLED-8 half closed** (the VERIFY box prints, on Save as PDF and on Dann's paper; the override badge untested, no page carries one); **INBOX-5 CLOSED** (Dann's printer prints the sage rule green; the Texte page asks for near-black IPA and glosses, measured from Chrome's PDF). PDF read passes on the sha URL in a front tab (6 systems, melody drawn). Only a phone photo remains of the per-format walk.
>
> **Added 16:05. RULINGS NOT IN THE TREE, per CONTRACT tether 17 as amended today.** The 2026-09-22 Insights rulings are now seated by Code (`../sessions/memo-code-n130-strings_r1_2026-09-24.md`, unshipped at this line). A Fable audit (`../sessions/memo-audit-rulings-vs-tree_r1_2026-09-24.md`) found **ten more**: nine of Dann's N.131 rulings of 2026-09-16 (`../sessions/spec-n131-french_r1_2026-09-16.md:50-56`: « Œuvre », « Saisie », « Exporter et importer », « %s vers », « Retirer », "Drop your file here." / « Déposez votre fichier ici. », two reading strings, the mobile empty line) were overwritten by the unruled desk draft `n131-french_r1_2026-09-19.md`, built in `9dfdab8`; one Learn heading of 2026-08-19. **Dann has walked the as-built names since; whether his 09-16 rulings or the as-built stand is his, one row at a time.** Note the conflict with today's « %s ligne », ruled without the 09-16 « %s vers » in view.
>
> **Added 19:00. THE RULINGS AUDIT IS CLOSED.** Dann ruled all ten rows (the last five on the desk's recommendation, his words 18:53: *"I trust your recommendations for the remaining items. Proceed."*); decisions and reasons in `../sessions/memo-audit-rulings-vs-tree_r1_2026-09-24.md`. Kept as built: « Pièce », « Entrée », « Exportation et importation », « ligne(s) », « Touchez ». Restored and built by Code: « Retirer », the drop hint "Drop your file here." / « Déposez votre fichier ici. », « Lecture des mots du PDF… », « Lecture des mots de l’image… » (`../sessions/memo-code-n131-restored-rulings_r1_2026-09-24.md`). Three code comments still describe the old hint (`i18n.ts:634`, `IntakePanel.svelte:400`, `:415`): cosmetic, not scheduled. **Next session: walk this ship; then N.170 step 1 once the French is settled.**
>
> **Numbered today:** N.169 (Markup against the dissertation's Appendix B; `OPEN.md`). **Still to do at the close:** add N.168 to `SCHEDULE.md`; tick week-1 and week-2 lines as they are walked.

> ### READ THIS FIRST. Written 2026-09-23, about 23:30. SUPERSEDES THE 17:35 BLOCK (moved to `../sessions/LOG.md`)
>
> **THE ONE THING: N.168, Insights intake, step 4 (targeted extraction) is well under way; step 5
> (Fable composes connections) is next.** Plan: `~/Documents/Voice Pedagogy Library/Insights
> Research/plan-intake_r1_2026-09-23.md`. Request folder access to `~/Documents` at the open (the
> library and the Finale scores live there).
>
> **Done tonight.** Step 1: `condition-map_r1.md`. Step 2: built and shipped `10e090c` (condition
> module `packages/score-parser/src/conditions.ts`, frequency run over all sixteen dissertation songs
> from `~/Documents/Finale Files/`, and the `.musx` treble-8vb octave fix, WRITTEN not walked); then
> Mitton's passaggi A-flat3 to D-flat4 added to the run (uncommitted; 44.7% of sung time inside).
> Step 3: `coverage_r1.md`, then `coverage_r2_2026-09-23.md` (1,235 rows; its Journal of Voice search
> list is tomorrow's). Step 4: about 689 new fact rows in `_extraction/` from Miller 2008, St-Pierre
> 2014, 32 JOS articles (downloaded and filed in the library), 12 Mac articles, Henrich 2005, Titze
> et al. 2007, Roubeau 2004 (French), both Millers, four dissertations, Chen 2017 and McKinney 1994
> (photographed pages in `_scans/`). Memos in `_synthesis/`, dated 2026-09-23. Fable read the six
> register papers: `_synthesis/memo-fable-registers_r1_2026-09-23.md`.
>
> **Rulings recorded tonight in `PRODUCT.md`:** "Universal relations, individual values" (20:49) and
> "No faults, no diagnosis: coordination is assessed" (22:39). Standing instructions (bibliography
> leads; manual downloads when a site blocks automation; the vocabulary rule) are in
> `.../Insights Research/needs_r1_2026-09-23.md`.
>
> **Added 2026-09-24 00:45. Step 5 begun, step 6 begun.** Fable composed 11 candidate connections
> (5 dynamics, blocked on the engine; 6 passaggio and turn): `.../Insights Research/_synthesis/
> candidate-cases_pass02_r1_2026-09-23.csv` and `memo-fable-step5_r1_2026-09-23.md`. Dann vetted P1:
> reworked into P1a and P1b (English only; French waits for an agreed English). **Not yet agreed:** the
> P1a English (Fable's full version against the desk's trimmed one). Three rulings recorded in
> `PRODUCT.md` (every voice, Dann the bass exemplar; singer-specific claims are templates with three
> checks; his 00:42 sentence), and the method in the plan's "Revision, 2026-09-24 00:45". **Waiting to
> run in Code:** `docs/sessions/brief-code-n168-six-voices_r1_2026-09-24.md` (six literature-built test
> voices; per-note CSVs; P1a counts). Vetting resumes with P1a once those counts exist.
>
> **Next, in order:** (1) Journal of Voice, once Elsevier access is live: the search list in
> `coverage_r2`, led by the marked-dynamic-to-sound-level link. (2) Step 5, Fable composing
> connections for the best-covered regions (dynamics chain, passaggio and turning). (3) The rest of
> the JOS screen and the Recent Research in Singing digests. **Still parked:** the ccb790c walk
> (below) and N.130's French walk.
>
> ### READ THIS FIRST. Written at the close of 2026-09-23, about 03:55
>
> **THE ONE THING: Dann walks `ccb790c` on the alias, in both languages.** That walk is N.123
> part 1's done-when (`../sessions/brief-code-tessituragram_r2_2026-09-23.md`, §Done when).
> Walk Insights on a song he has measured, then **Score markup on Sunless 2, 3, 5, or 6**:
> the octave fix below changed how those songs print there, and nobody but Code has seen it.
> DESK DEFAULT, and Dann can name another. **The session's first act is to hand him the
> `open` command for the alias** (`ENVIRONMENT.md`, `WALK ON THE ALIAS, NEVER ON A SHA URL`).
>
> **N.130'S FRENCH WALK IS STILL PARKED** at the end of B1 (B2, 30 rows, and A, 19 rows,
> unwalked; instrument `../sessions/insights-french-as-built_r3_2026-09-22.md`).
>
> #### THE TREE AT THIS CLOSE
>
> **HEAD `ccb790c`, pushed 2026-09-23 03:47:27, all five gates at baseline** (216, 235,
> 0 errors and 12 warnings, 1396, 579 + 5 skipped = 584). The alias served it at 03:47:44.
> The floor stays `f6d2184`: **no ship tonight was walked in both languages.** Dann walked
> `0ccda31` in English only (02:40, a screenshot), which produced the r2 redesign.
> The four ships tonight: `1dfee32` phonation time; `0ccda31` the tessituragram on page one,
> page one fitting by measurement; `ccb790c` the redesign and the octave fix. **This close's
> memory edits are uncommitted; Dann ships them with the next build or commits them alone.**
>
> #### WHAT WAS BUILT TONIGHT, N.123 PART 1 AND N.127 INCREMENT 2
>
> The unit on page one of Insights: the heading, the headline sentence ("You phonate for about
> ... of this ... piece"), the tessituragram, and the vowel chart. **Its design rulings are in
> `OPEN.md` N.123, three dated blocks from 2026-09-23.** Every string is ratified in both
> languages. The briefs and memos, in order, are in `../sessions/`: `brief-code-phonation-time_r1`,
> `brief-code-tessituragram_r1`, `-fit_r1`, `_r2`, `-fix_r1`, each with its `memo-code-` twin.
> The drawings Dann chose from: `tessituragram-sparse_r1_2026-09-23.html` is the one built.
>
> **The octave fix** (`ccb790c`, MusicXML) and its `.musx` twin (`10e090c`) are closed: account moved to `../sessions/LOG.md` 2026-09-24.
>
> #### WHAT THE DESK GOT WRONG, 03:55 CLOSE: moved to `../sessions/LOG.md` at the 17:35 close (no rulings in it).
>
> #### STILL NOT MEASURED, carried forward unchanged
>
> **Paint on a phone.** And **whether « PARTITION » fits 62 px in Consolas or Android's
> monospace.**


## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

**The specs these marks point at live in `OPEN.md` from 2026-09-13.** This
section carries the marks; that file carries the items.

**AND THE ORDER THEY ARE BUILT IN LIVES IN `SEQUENCE.md` from 2026-09-15.** This
section says what is open; that file says what comes first and why. **Six
dependencies fix the order and everything else floats**; the rest of this file
does not repeat them.


### Numbered 2026-09-23

- `[ ]` **N.168. Insights intake: filling the three stores.** **NUMBERED BY DANN 2026-09-23 17:29**, *"we should engage in it ASAP."* The plan is `~/Documents/Voice Pedagogy Library/Insights Research/plan-intake_r1_2026-09-23.md` (seven steps: condition map, frequency run, coverage audit, targeted extraction, composing, Dann's vetting, encoding and tests). It rests on the five Insights principles ratified the same afternoon (`PRODUCT.md`, "What Insights is for" to "How Insights stays trustworthy"). Spec in `OPEN.md`. **2026-09-23 late: steps 1 to 3 done, step 2 shipped `10e090c`, step 4 under way (the READ THIS FIRST block).**
- `[ ]` **N.170. Outside eyes: refine Ilya with singers and outside reviewers.** **NUMBERED BY DANN 2026-09-24 15:54.** Seven steps, spec in `OPEN.md`; the review packet is step 2. Unscheduled; the desk proposed weeks 3 and 4.
- `[ ]` **N.169. Ilya's Markup against the dissertation's Appendix B.** **NUMBERED BY DANN 2026-09-24 10:09**, *"Please number this and we will resolve it later."* Unscheduled. Spec in `OPEN.md`.

### Numbered 2026-09-22

- `[ ]` **N.167. A French singer can sit through the whole reader wait reading English.**
  **RULED IN BY DANN 2026-09-22**, on the desk's revised recommendation. **Found by Code**
  while checking its own string ship. **OBSERVED, and this part is solid:** in the browser
  pane the drawer was in French, its toggle offering « English », and the page reader's
  waiting line came up in English and stayed English for the whole wait. **CODE'S READING of
  the mechanism, NOT established by the desk:** the line's text is fixed once from the
  `language` value in play at that moment (`ScoreUploader.svelte:134`) and never
  re-translated, so a restore beginning before the stored language loads stays English
  throughout. **It predates the 2026-09-22 string replacement and is not caused by it.**
  **Dann's own screen disagrees with the pane:** his screenshot the same morning showed
  « Préparation du lecteur de page » in French on the alias, **so whether he ever sees the
  English is NOT ESTABLISHED.** **Why it is not a parity tidy-up:** `PRODUCT.md` §"Both
  languages, start to finish", stated by Dann the same day. A singer who cannot read English
  gets no information at all, for about a minute, **on the one screen whose whole job is to
  explain why nothing is happening.** Spec in `OPEN.md`.

- `[ ]` **N.163. Ilya shows a singer a word that is not on the page.** **RULED IN BY DANN
  2026-09-22** from N.146's walk finding 4, on the desk's recommendation that it meets the
  freeze rule's false-statement test. The OCR read «То» as «Го» (the page shows a stem with
  a bar across both sides; the reading has the bar on the right only), **and Transcription
  then drew it as `'go` with the gloss "go"**, so a false word reached the singer with a
  confident gloss beside it. Spec in `OPEN.md`. **NOT ESTABLISHED: whether the fix belongs
  at the OCR layer, at the dictionary seam, or in how an unknown word is presented.**
- `[ ]` **N.164. Insights states two things at once that cannot both hold.** **RULED IN BY
  DANN 2026-09-22** from N.146's walk finding 7. On a read with no typed range it prints
  *"Without the range you typed, this page cannot say whether this key suits you."*
  **immediately followed by "Nothing in this piece is flagged for your voice."** Also on the
  same screen: a compass of **A3 to F♯6**, implausible for a sung line in that song, and a
  tall empty region at the top of the Insights box. Spec in `OPEN.md`. **All three are NOT
  ESTABLISHED as faults until the code is read.**
- `[ ]` **N.166. A stored scan may need the page reader to redisplay.** DESK DEFAULT number,
  found by the desk 2026-09-22 while investigating N.165. **The same song, the same library,
  the same origin, in the desk's own tab: the score never drew**, and the drawer sat on
  `upload.status.preparingReader` for over twenty seconds with no PARTITION receipt.
  **The desk's instrument was sound**: `Kabalevsky T05` rendered in the same tab, 28 SVGs
  and 834 elements. **If real, every scan-derived song re-runs the reader on every load**;
  Dann's 23-page PDF took 97.2 s on 2026-09-17. **NOT ESTABLISHED**, and the brief says to
  report it rather than fix it. Same brief as N.165. **ESTABLISHED REAL AND MEASURED BY CODE 2026-09-22, and NOT FIXED**,
  per the brief. `ScoreUploader.svelte:771-776` restores a song by calling
  `handleFile(file, restore.answers)`, **which sends the stored ink back through
  `ingestScoreFile` with `readPages`**, so the page is read again from scratch. **Measured
  after a reload of a ONE-page PDF: « Préparation du lecteur de page » showed from 3.8 s to
  61.3 s, and the score appeared at 61.3 s.** Dann's 23-page PDF would pay about its 97.2 s
  read on every reload plus the warm-up, **which is an estimate from the one-page timing,
  not a measurement.** **The string says "This will only happen once."**

### Numbered 2026-09-21

- `[ ]` **N.162. A caret and a note compete for the same thumb.** Numbered 2026-09-21,
  DESK DEFAULT number, split off at N.153's close **on Dann's ruling to close N.153 rather
  than hold it open for this.** **Measured by Code's stage 5 scan, 2026-09-21: a caret's hit
  centre sits 15.6 to 21.4 px from the nearest note's hit centre**, and `nearestTarget` pools
  notes and carets and resolves by nearest centre, so the catchment around a caret is about
  eight to ten pixels. A thumb that drifts past it selects the note and the insert does not
  happen. **It is a different mechanism from N.153's**, which was spacing: caret-to-caret now
  clears 44 px and this does not move with it. **Clause 13's literal words are met and its
  reasoning is not:** the clause was prompted by a caret 22 px from a note, and the distance
  is now worse than that. **NOT ESTABLISHED: whether a note must stay tappable inside
  Corrections**, which decides the shape of any fix; the desk has not read that interaction.
  **Clause 3's fallback condition may be live**, and Dann hears about it before a chip row is
  built. Spec not yet written.

- `[ ]` **N.160. The work, and its two views.** DESK DEFAULT number. **The model is Dann's**
  (`PRODUCT.md`). **STEPS 1, 2 AND 3 ARE CLOSED 2026-09-21**, shipped `1d18514`, `2fb7516` and
  `46ac52f`, each walked. The heal wrote 14 of his 96 seats and the dry run afterwards reads
  91 address, 1 rejected, 4 unfound. **Steps 4 and 5 wait until after 2026-10-30.** Spec in
  `OPEN.md`, plan in `../sessions/memo-n160b-the-approach_r1_2026-09-21.md`. **The deferred
  ruling is STILL NOT ASKED, and not because the count is missing:** it is five notes, all
  «одинокая», and Code's reading is that they may be blocked by a seat that already holds the
  word rather than orphaned by a word that left. **Settle that before putting it to Dann.**
### Numbered 2026-09-20

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

> **N.155's DUPLICATE OPEN ROW WAS STRUCK HERE 2026-09-21.** It said the item was open
> with its spec in `OPEN.md`, while the closed row above says it shipped in `b53a6df` and
> was walked. **Both rows stood from 2026-09-20 to 2026-09-21** and the count of open
> items was wrong by one for a day. The two deferred items it named are carried on the
> closed row, so nothing is lost.

### Numbered 2026-09-17

- `[ ]` **N.151. The measure edit surface, with insert.** Numbered 2026-09-17, DESK
  DEFAULT number. **THIS ROW WAS MISSING UNTIL 2026-09-21 and the item was invisible to
  the read order:** a 695-line spec in `OPEN.md` that `STATE.md`, `SEQUENCE.md`,
  `SCHEDULE.md` and `OWED.md` all failed to name. Found when Dann asked how close the
  open work was. **Insertion is BUILT, as N.92 slice 3** (`correction.ts:48-100`,
  `:305-345`, `:496`, `:382-433`, reached through `CorrectionSurface.svelte:539-541`),
  **so the item is tether 22, not a missing capability: it exists and is hard to find.**
  **IT CARRIES NINE OF DANN'S RULINGS OF 2026-09-17**, and four of them are
  product-level rather than item-level: WYSIWYG (*"if it appears on Ilya's page, it can
  be printed"*), no stopping rule for the singer, the edited score comes back out as an
  edited copy with the singer's own tempo counted, and deliberate destruction only.
  **Those four want transcribing to `PRODUCT.md`; see `OWED.md`.** Report
  `../sessions/report-n151-note-entry_r1_2026-09-17.md`. **NOT ESTABLISHED: its size, and
  where it sits against the release.**

### Numbered 2026-09-16

- `[ ]` **N.92. Notation editing.** Numbered by Dann 2026-08-24. Slices 1 to 3 are
  shipped, insertion included. **The caret reach is DRAWN and shipped over six commits
  2026-09-17 to 2026-09-18, and is not usable on a phone: see N.153, which owns that.**
  Open here: the four singer's marks, tie to the note before, and the page flag for a
  measure left over.
  Spec `../sessions/spec-n92-edit-surface_r1_2026-09-17.md`, audit
  `../sessions/memo-n92-edit-audit_r1_2026-09-17.md`.
- `[~]` **N.152. Playback of the Markup.** LATER, its own cardinal, asked for by Dann
  2026-09-17. Spec in `OPEN.md`.
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

- `[ ]` **N.135. The page reader reads the text underlay.** Ruled by Dann
  2026-09-14. Cost measured the same night in
  `../sessions/memo-n135-ocr-measurement_r1_2026-09-14.md`. Spec in `OPEN.md`.

### Numbered 2026-09-13

- `[ ]` **N.130. Insights has no French.** About 58 entries at `i18n.ts:1417-1475`,
  all English in both languages, found while checking the loupe's undo clauses.
  **Belongs in the release cut's IN bucket:** the ruled release sentence names
  Insights, and a document in the wrong language is wrong rather than
  half-built. Spec in `OPEN.md`. **THE DESK DRAFTS THE FRENCH AND DANN RULES ON IT, ruled 2026-09-19**, superseding *"Dann owes the French; nothing is coined"*. His words: *"I prefer to have you suggest translations that I can react to. That saves me cognitive bandwidth."* **So never hand him blank slates.** Draft from the French already in the file, say which entries the glossary came from, flag the choices that are genuinely his, and let him ratify, edit, or decline. **Nothing reaches the tree until he ratifies it**, which is the one clause of the old rule that survives. **BUILT 2026-09-19: all 59 Insights entries are French** (`71ae880`), drafts and rulings in `../sessions/insights-french_r1_2026-09-19.md`. **UNWALKED.** **AND THE ROW'S OWN RANGE WAS WRONG: only 12 of the 59 sat in `:1417-1475`; the other 47 ran `:1476` to `:1522`.** A brief written to the cited range would have fixed twelve strings and reported Insights done.
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
