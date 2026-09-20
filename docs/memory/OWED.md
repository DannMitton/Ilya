# OWED — the standing debts and the unsettled questions

**Split out of `STATE.md` on 2026-09-20, on Dann's ruling.** `STATE.md` had reached
1,141 lines against its own 600-line tripwire, and the tripwire's premise had stopped
holding: what was left was not material that had failed to move to `LOG.md`, it was
long-lived OPEN material that cannot move, because nothing in it has closed.

**The division of labour.** `STATE.md` holds the session's state: the one thing, the
tracker, the schema and the fixture. **This file holds what is open and not moving:**
what the desk owes, what Dann owes, what has never been settled, and the retired
register's live rows.

**NOT part of the opening read.** Open it when one of its items comes up, when Dann
asks what is outstanding, or when the one thing closes and the next is being chosen.

**Nothing here was reworded in the move.** Every section is verbatim from `STATE.md`.

---

## OWED, RULED BUT NOT YET DONE

- **N.128'S TWO OTHER CONSUMERS. Carried out of the narrative 2026-09-13 and
  SHARPENED; the question is now a single one.** Both `sustain.ts:61-84` and
  `watchlist.ts:229-244` hold **the same duplicated `activeTempoAt`**, which
  compares `ev.rhythmicPosition.fraction` against each tempo marking's position.
  That is the field N.128 found stale. **What is newly established, read
  2026-09-13:** N.128's fix at `correction.ts:358-435` is not a beam-key patch.
  It is a line-wide pass that recomputes the onset of every event whose
  predecessors' durations changed and returns a new event carrying the corrected
  `rhythmicPosition` (`:431`). **So the whole question is which side of that pass
  these two read from.** If they consume the corrected line they are already
  right; if they consume the reader's events they are still wrong. The desk did
  not find the call chain and stopped rather than guess: **NOT ESTABLISHED.**
  Whoever picks this up answers one question, not three. **The duplication is its
  own small finding:** the same function lives in `packages/score-parser` and in
  `apps/web`, so a fix to one does not reach the other.
- **`columnAdvance` reserves no room for the turning layer**, and N.106
  widens what a turning unit can occupy on the right. Nothing crowds on
  Without Sun song 1. Closing it means teaching the layout pass an
  analysis-layer measurement; it belongs with N.103's spacing work. Source:
  `docs/sessions/memo-n106-turning-right_r1_2026-09-02.md`, NOT ESTABLISHED.
- **THREE RESIDUES OF N.104's LOUPE FIX. None is a regression, all three predate
  it, and all three want numbers.** (1) `Loupe.svelte:276-277` still bounds
  `pageMetrics`' head on `[data-hit]`, which is a different question from the
  head's crop: bringing it onto `MUSIC_MARK` makes system 1's tacet measure a
  candidate measure and resizes the loupe's window on every system of the page.
  (2) `Loupe.svelte:218` skips a whole system from the page's ink survey when it
  carries no notes, so a system of nothing but a tacet run draws a numeral the
  survey never sees. **Cannot bite on this document**, where every system with a
  run also carries notes. (3) **`MUSIC_MARK` is pinned by no test.**
  `headBound`'s arithmetic is pinned eight ways; the selector is not, because
  `apps/web`'s vitest has no DOM environment. Source:
  `docs/sessions/memo-n104-loupe-head_r1_2026-08-29.md` §4 and §9.

- **TWO DOCUMENTS FROM 2026-08-17/18 LIVE IN PROJECT KNOWLEDGE, NOT HERE.**
  Nothing else in this folder names them and a session that does not read this
  line will never find them.
  - `claude/gould-beams-delta-pp16-25_2026-08-18.md` — Gould rules 245 to 284,
    Ground Rules pp. 16 to 25, closing v7's gaps item 1 beam pages. **Two
    independent readings, cross-checked.** One flat contradiction on p. 18's
    three-beam rule is recorded UNRESOLVED; do not implement three-beam outer
    placement from it. Four diagram numerals remain unverified.
  - `claude/ruling-semantic-stems-vs-gould-priors_2026-08-18.md` — **Dann's
    ruling: an engraving convention is a PRIOR, not a law.** His Appendices
    assign stem direction a semantic function, stems up for close timbre and
    stems down for open. A Gould prior may bound a DIMENSION; it may not decide
    a MEANING; where a score carries a legend, the legend outranks Gould.
    **This is a constraint on N.59 tier 3, not on tier 2.**
- **Trace `stem_dir`'s consumers in the reader.** `beams.py:264-265` computes
  it and `:310` carries it into the note record. **Whether any stage treats it
  as evidence is NOT ESTABLISHED.** If one does, it is a defect against Dann's
  own scores, which a photograph of Ilya's own output would expose.
  `beams.py:133` reads "S5: one rule, both directions, no directional term",
  read out of a grep and not in context; confirm it.
- **`staff-renderer.ts`'s `positionalUp` now has its citation.** v7 records that
  the helper's beamed-group stem direction is an inference derived from a chord
  rule. Gould p. 24 states it for beams directly, confirmed by both readers:
  the note furthest from the centre of the stave dictates the group's stem
  direction. **Apply the citation the next time that file is touched.**
- **The Gould re-shoot, four spots, would settle every open number.** p. 18's
  three-beam paragraph, and the small diagram numerals on pp. 16, 19, and 21.
- **Step 5's export, single-song half.** Established 2026-08-16: exporting one
  song and restoring a one-song binder into an emptied library both work without
  the list. It is the only thing that would give the chimera warning a detour
  instead of a stop sign. **Dann's ruling: deferred, recorded as owed against
  step 5, NOT folded into 4a.**
- **Remove `bits-ui` from `apps/web/package.json`.** Ruled 2026-08-16: native
  `<dialog>` + `showModal()` is the answer for the delete confirmation AND the
  fingerprint prompt, not bits-ui. **Dann's ruling on timing: not in step 4's
  commit.** It costs zero bytes while nothing imports it, so removing it is
  hygiene, not weight, and it is a lockfile operation. **Do it clean, on its own.**
  Measured before the ruling: one `AlertDialog` cost **+18.7 KB gzipped**
  (392,547 to 411,292), against Fable's ~8 KB budget for all of N.67.

## RULINGS DANN OWES. Ask one at a time, at the right moment

- **RULED 2026-09-16, BUILD OWED: « placement recommencé » / "placement started
  over"**, in `../sessions/spec-loupe-french_r1_2026-09-14.md`. ~~**THE UNDO SENTENCE FOR "START PLACEMENT OVER". Dann's to rule, English and
  French, then one line in Code.**~~ Carried out of the 2026-09-10 walk narrative
  on 2026-09-13 before that narrative moved to `../sessions/LOG.md` block 12.
  **Confirmed live against the tree 2026-09-13:** the button exists
  (`i18n.ts:1328`, `station.startOver`, en "Start placement over", fr
  « Recommencer le placement »), it is drawn at `IntakePanel.svelte:554`, and
  **no `loupe.undo.*` clause fits it.** The clause list at `i18n.ts:377-392` and
  `:470-472` holds `deleted`, `dotOn`, `dotDouble`, `dotOff`, `lyrics`,
  `restored`, `placed`, `melisma`, `melismaOff`, `entered`, `rest` and `tie`,
  and none of them says that a whole placement was started over.
- **SUPERSEDED 2026-09-16: THESE THREE ARE RULED, NOT OWED.** Dann ruled all
  three on 2026-09-14 (« syllabe placée », « mélisme défini », « mélisme
  effacé »), with `loupe.redo` « Refaire\u00a0: %s », `loupe.melisma`,
  `loupe.lyric.melisma` and `calib.common.retake`, in
  `../sessions/spec-loupe-french_r1_2026-09-14.md`. **What is owed is the BUILD:
  the tree still carries English in all of those slots (`i18n.ts:387-392`,
  `:419`, `:422`, read 2026-09-16).** The desk offered them to him again on
  2026-09-16 before tether 16 caught it. `loupe.beat` and `loupe.beatPulse`
  were RULED 2026-09-16 (« temps %b », « temps %b, division %p »), same spec.
  **The loupe's French is now fully ruled and wholly unbuilt.**
  ~~**THREE FRENCH STRINGS ARE ENGLISH, found 2026-09-13 while checking the clause
  list above.** `i18n.ts:388` `loupe.undo.placed` reads fr 'syllable placed';
  `:391` `loupe.undo.melisma` reads fr 'melisma set'; `:392`
  `loupe.undo.melismaOff` reads fr 'melisma cleared'. **A singer in French mode
  is shown English in the loupe's undo line.** French is Dann's; nothing is
  coined here.~~
- **THE RELEASE DATE, RULED BY DANN 2026-09-16: FRIDAY 2026-10-30.** The desk
  proposed it as the far end of the 2026-09-13 estimate; his words: *"By
  Hallowe'en? Sounds good."* **It is a target that the scope gives way to, not
  a wall:** what does not fit by the date goes to FLAGGED or LATER. The dialogue
  that produced it continues below, one question at a time. The sort of the
  inventory into IN, FLAGGED and LATER is still owed.
- **SORT RULINGS, 2026-09-16** (proposal `../sessions/sort-release_r1_2026-09-16.md`): **N.94 IN**, and its place is ruled: *"it belongs in the Score Markup section between Corrections and Voice."* (supersedes the 2026-09-13 note placing it in a `Melody` band station). **N.131 IN**, whole. **N.123 IN** (his word, over the desk's LATER), restated 2026-09-16: *"we absolutely need to have this visual. Non-negotiable."* **The visual, in his words 2026-09-16:** *"'this visual' means the range and the tessituragram with passaggio zone indicated."* So **N.127 increment 2 (the compass stave: the piece's range against the singer's) is IN**, and N.123's tessituragram carries the passaggio zone shaded (already in its spec as "the singer's turning points shaded"). **N.85 IN, N.86 IN, N.87 LATER** (his words: *"this is fine as you have marked them"*); **N.88: Dann's own optional afternoon task, probably 2026-10-29** (his words: *"if I feel like it"*). **THE SORT IS DONE 2026-09-16 AND THE FREEZE RULE IS IN FORCE.** IN: 24 rows, listed in `../sessions/sort-release_r1_2026-09-16.md`. **SIZED 2026-09-16, DESK INFERENCE on Dann's request:** `../sessions/estimate-release_r1_2026-09-16.md`. About 45 to 75 build cycles needed against about 100 available at the week's pace: **achievable if the freeze holds, the three design rows (N.94, N.123, N.84) start early, and the pace holds.** DESK DEFAULT checkpoint: **Friday 2026-10-09**; a design row not in Code by then moves to LATER and the date stands. **THE SCHEDULE: `SCHEDULE.md`, written 2026-09-16, starts 2026-09-17.** INBOX-37 (the loupe tap) is numbered **N.147**, DESK DEFAULT number.
- ~~**FOR THE SORT: START PLACEMENT OVER CANNOT BE UNDONE.**~~ **FIXED BY N.144, `ceeb214`.** Established by
  Code 2026-09-16 (`memo-loupe-french-build_r1_2026-09-16.md`):
  `handleStartPlacementOver` never calls `pushUndo`, yet it rebuilds every
  placement. A singer who presses it by mistake loses their hand placements.
  **DESK READING: that is lost work, so it meets the freeze rule's exception.**
  The undo clause is ruled and built as a key, unwired.
- **N.142 STEP 2 IS WAITING ON A COUNT FROM DANN'S BROWSER.** Whether any song
  in his library holds a placement on a tie's continuation is a fact about his
  IndexedDB, which Code cannot read (`memo-n142-tie-prolongation_r1_2026-09-16.md`
  §5). The desk can read it through Chrome on the branch alias.
- **THE FREEZE RULE, RULED BY DANN 2026-09-16.** His word: *"I accept."* The
  wording he accepted: **"From the day the sort is done, a new finding goes to
  LATER by default. It joins this release only if Ilya would otherwise tell a
  singer something false, or lose a singer's work."** Cases put to him with it:
  "1 lines" goes to LATER; the loupe tap that reassigns syllables joins the
  release (lost work); N.143 would have joined (Transcription empty). **The
  desk's advice, given with it: keep the exception narrow; "confusing" and
  "ugly" are not in it.**
- **THE RELEASE CUT, and it is the biggest thing he owes. Raised 2026-09-13
  when he asked how close a fully working app is.** The answer is in
  `../sessions/memo-footprint-and-release-arithmetic_r1_2026-09-13.md` §4, and
  the arithmetic is this: about thirty-five units of ruled and unbuilt work
  stand open, throughput runs two to three units per session, so **twelve to
  eighteen sessions, three to six weeks, DESK INFERENCE and a range.** That
  range assumes nothing new is numbered. **In the seven days 2026-09-07 to
  2026-09-13, fifteen new numbers arrived, N.115 to N.129, and nine units
  closed, of which only N.128 was one of the fifteen.** The queue grew faster
  than it drained. **So the release date is set by when he stops numbering, not
  by how fast Code builds.** The ask, when the moment is right: name the items
  the next public iteration of Ilya contains (Ilya has been public since
  January, corrected by Dann 2026-09-16; see `PRODUCT.md`), freeze that list, and move the rest to a
  post-release file the way `OPEN.md` now holds unstarted specs. **Do not put
  this to him mid-item, and do not raise it twice.**
- **THE RELEASE ORDER CONTRADICTS ITSELF, and both halves are his. Found
  2026-09-13.** His ruling of 2026-08-24 set the order **N.83, N.84, N.85,
  N.86, N.87, N.88**, with walkthrough prep first, and N.82 and N.89 riding
  between (`../sessions/LOG.md`, the 2026-08-24 numbers table). His
  text-to-score sequence of 2026-09-06 lists it as **the release order N.85 to
  N.88, then N.84, then N.83**, which reverses both ends. Per tether 17 the
  later ruling stands, but **N.83 is the item that produces the first honest
  end-to-end reader accuracy datum, and nothing else in the tree produces one**,
  so putting it last has a cost he may not have intended. **One question,
  whichever order he wants.**
- The binding squircle's footprint on Insights page one: Design proposes two
  treatments, Dann rules (2026-09-11).

### New from N.104, 2026-08-29. One left, not blocking the walk

The bar numbers were ruled on 2026-09-11 and are now N.126, below. The loupe's
typeface closed with `246c17c` on 2026-09-13 and moved to `../sessions/LOG.md`
block 11.9. The tacet question is the one that is still his.

- ~~THE BAR-NUMBERS DRAWING IS WAITING ON HIM.~~ **RULED 2026-09-11 00:40,
  numbered N.126, measure numbers on Score markup, UNPLACED.** Size: the
  lyric underlay's point size. Weight: regular, italic (Gould p484-d
  agrees). Clearance: "legible without emphasis", DESK DEFAULT 1.0
  stave-space (the drawing's middle of 0.6 / 1.0 / 1.4). The SYSTEM-START number is bare, never
  parenthesized ("to orient collaborating musicians quickly, not to trumpet
  our editorial decision"). **AMENDED 2026-09-15: the POST-REST courtesy number
  takes SQUARE BRACKETS**, Dann's ruling, because square brackets mean editorial
  in a score and that number is Ilya's own addition rather than standard
  practice. Post-rest anchor: DESK DEFAULT the closing
  barline of the rest, explained to Dann and not waved off. System-start
  number above the clef per Gould p484 and his 2026-08-29 ruling. Drawing:
  `docs/sessions/drawing-bar-numbers_r1_2026-08-29.html`; source
  `gould-bar-numbers-p484_2026-08-29.md`. The original text it superseded moved
  to `../sessions/LOG.md` block 11.8 on 2026-09-13.
- **What the correction surface does over a tacet run.** Three proposals in
  `docs/sessions/memo-n104-tacet_r1_2026-08-27.md` §7, unruled since
  2026-08-27. The ship changed nothing there **on desk inference rather than on
  his word**, which is stated so he can wave it off.

### New from N.67 step 5, 2026-08-18. Three copy gaps, all named by Code, none invented

**Code refused to coin a string in all three, which was correct.** The approved
table has no word for these cases, and inventing one would have been writing
French Dann has not seen.

- **A run that only replaced or only skipped says NOTHING.** `importNoticeKey`
  returns null, so answering *Take* on a song you are not in produces no
  sentence. Code's reasoning: the song rises to the top of the list, which is
  visible. **If that reads as silence, it needs a "replaced" string in both
  languages.**
- **A PARTIAL WRITE FAILURE SAYS THE WRONG THING.** Two songs land, one refuses,
  and `binderError` shows `songs.err.write`, which ends "Nothing has changed."
  **Something did change.** The old code was worse, so this is an improvement on
  a defect rather than a new one, but it is not right and no approved string
  fits.
- **`(2) (2)`.** Re-importing a binder of a copy named `… (2)` produces
  `… (2) (2)`, because `uniqueName` numbers the base it is given and the base
  genuinely was `… (2)`. Correct per design §2.3, and it looks odd. Cosmetic.

### New from N.67 step 4b, 2026-08-18. Four, all small, none blocking

- **Boot does not transcribe; a switch does.** Switching songs runs the pipeline
  and draws the transcription; a reload leaves the poem sitting there until the
  singer presses Transcribe. Code named the asymmetry in its memo §6.4 and asked
  which way to close it. **Observed on the deploy 2026-08-18 and confirmed:** the
  reload after the delete showed the poem present, the dictionary loaded, and
  nothing drawn. **Recorded honestly: the coordinator claimed the opposite from a
  pair of screenshots twenty seconds apart, which could not distinguish Ilya
  transcribing from Dann pressing the button, and had to withdraw it.**
- **A song named from its poem never picks up a better name from the score.**
  Memo decision 6.1: the name is written the first time there is material to
  build one from, and is the singer's from then on. Observed: a song auto-named
  `Я тебя любил` from the poem kept that name after a score arrived carrying
  `Я вас любил` and a composer. The rule cannot tell "Ilya guessed" from "Dann
  chose." Rename fixes it in one gesture, so this is a preference, not a defect.
- **The door is on the Transcription tab only.** The Fit tab has the twinned
  binder row by Dann's ruling of 2026-08-16 but no song list, so switching songs
  while working on a score means changing tabs. Code says twinning it is six
  lines and did not do it because the brief named one place.
- **Pressing Delete on a song you are not in appears to switch you into it before
  it asks.** Observed on the deploy: the open song was `Pushkin, control fixture`
  and the dialog opened over an emptied drawer with `Untitled` marked open.
  **NOT ESTABLISHED whether the Delete press caused it or Dann clicked the row
  first; he was asked and the walk moved on.** If Delete does move the singer,
  choosing Keep leaves them somewhere they did not ask to be. Nothing is lost,
  because saving is continuous.

- **A singer on Chrome for iPhone can never install Ilya to the home screen.**
  Chrome on iOS offers no Add to Home Screen and `InstallPrompt.svelte:48`
  already excludes `CriOS` and `FxiOS`. Established by reading, carried over
  from N.72 where it was named and never ruled.
- ~~**N.63.** Where the honest residue goes~~ **RULED 2026-08-21: SAY NOTHING.**
  Still owed: deleting the gate itself, if it still ships. NOT ESTABLISHED
  whether it does; the last evidence is Fable's finding F5 of 2026-08-18.
- **N.45's remainder.**
- ~~**The French question mark.**~~ **RULED 2026-08-21: no space before `?` in
  Canadian French, a hard space before `:`.** It was 47 sites, not eleven. Shipped
  in `9f11490`. **The 63 `!` and `;` sites are NOT done.**
- *(Not yet: what a deliberately empty note draws.)*

---

## STILL UNSETTLED. Not yours to settle alone

- **Where the storage notices belong.** They render in the FIT drawer only, so a
  singer working in Transcription never sees a save failure or the two-tab
  notice. Inherited from when they were pairing notices; not moved in E.54
  because moving them is a placement decision, not a build step.
- **The three storage strings still say "syllable placements"** and the save is
  now the whole song. Design §7 puts that copy in step 6, with the French shown
  to Dann first, so it was left alone rather than rewritten twice.

- "The page carries no chrome." · "Do not introduce a slider."
- **N.51:** whether per-tab colour may propagate past the tab bar.
- Whether `claude/shane-project-map_2026-07-25.md` is stale. **Unopened for
  twelve sessions.**
- **D3's Job A**, per-verse reprints, ruled in E.36 and still unnumbered.
- **The per-format score arrival audit**, asked for in E.45 and never written.
- ~~`stripBackingRect` matches `fill="#FFFFFF"` while `staff-renderer.ts` paints
  `#F0EBE0`.~~ **SETTLED 2026-09-07 by Dann's print preview: the cream prints. Ruled: the page prints white. Paste written (INBOX), not yet run.** **BUILT 2026-09-14 as N.133, uncommitted.** The paste was never found: `INBOX.md:97` records it only as sent to a second Code thread, and no commit touches `stripBackingRect`. Its aim, no cream on paper, is part of N.133, which removed both rectangles and `stripBackingRect`.
- **The marks on the printed page.** E.51's prints carry a dashed `VERIFY` box
  and a `USER OVERRIDE` badge on paper. CONTRACT §6 forbids a mark that says Ilya
  is unsure. **Whether these are the ruled exception was not checked.**
- **`VoiceProfilePane.svelte:295-313` duplicates the old header arithmetic.**
  Fit's paper does not yet share the Transcribe paper's single `HEADER_GAP`.
- **Whether `.mscz` ingest actually succeeds in a browser.** The path is live in
  code (`ScoreUploader.svelte:106-137`) but `i18n.ts:272` still carries a
  "coming soon" string for it. Nobody has run it.

---

## THE REGISTER IS RETIRED, 2026-09-19. Its live rows are below

**Ruled by Dann 2026-09-19, over revision 11:** *"retire it into `STATE.md` and
`LOG.md`"*. `claude/ILYA REGISTER_2026-08-11.md` was revision 10, E.46,
13 August 2026, 233 lines. **Its closed rows, its E.46 measurements, its
primary-source verifications, and its corrections are in `../sessions/LOG.md`
block 24, verbatim. What was still live is here.** Nothing else points at it,
and the file in project knowledge can be deleted.

**WHY IT WAS RETIRED RATHER THAN REVISED, and the finding is against this file,
not against the register.** The instruction to produce revision 11 said **"The
blocking number is now THREE."** That is stale against this file's own
**"THE BLOCKING SET IS EMPTY, 2026-08-21."** Revision 11 as specified would have
written a stale number into canon. **Two further errors, found 2026-09-19:** the
register's own header and colophon both claim the blocking number is SEVEN while
only SIX of its rows carry the `BLOCKING` mark; and its gaps sentence says "ten
cardinals" over a list of twelve.

**THE REGISTER'S ROW FORMAT IS KEPT AS IT WAS**, because the value of these rows
is the primary source in the fourth column, and rewording them would cost that.
Its state vocabulary is in `../sessions/LOG.md` block 24.

### The live rows, 27 of them, verbatim from revision 10

**Read the state column against this file first.** These rows were last touched
on 13 August 2026, so any row this file contradicts is settled by this file.

| # | item | state | primary source |
|---|---|---|---|
| **N.15** | The touch-target repair | `RULED`, increment 1 specified and unapplied | `claude/e36-session-record_2026-08-10.md` §7.5; increment 1 at `claude/sonnet-memo-n15-inc1-touch-token-and-mapping_2026-08-10.md`. **E.46: N.55b's hit targets are 27.5 to 48.3 px wide, below the 44 px floor, and the column spacing is the bound. Not a third exemption; a constraint the engraving imposes** |
| **N.17** | Viewport repair. Partly a no-op as ruled | `OPEN` | `claude/e38-handover_v1_2026-08-10.md` §10 |
| **N.19** | The calibration date | `OPEN` | `claude/e38-ratified-goal-ledger-CORRECTED_2026-08-10.md` §3. Ruled to print, E.36 §7.4 |
| **N.22** | The English-only Fit drawer, in French | **`WRITTEN`** | `claude/e40-handover_v1_2026-08-11.md` §6. Its surviving `aria-label`s are inside **N.62** |
| **N.27** | The silent save. `saveStore` swallows its exception | `OPEN` | `profileStore.ts:220-224`. Gates N.28–N.29. **E.46: N.55b's `ilya:pairings` must NOT repeat it. A second silent save site is the same defect written twice** |
| **N.28 / N.28a / N.28b** | Export: one voice, all voices, the unexported mark, pseudonymous | `OPEN` | slate, revision 3. **E.45: this is where the copyright question is revisited, before the door is built** |
| **N.29** | Import, identity by id | `OPEN` | slate, revision 3 |
| **N.30** | Re-key the override maps from positional to linguistic | `OPEN`, deferred by Dann in E.40 | slate, revision 3. **Keys are `${lineIndex}-${wordIndex}`, verified E.45 at `+page.svelte` and `pipeline.ts:229`** |
| **N.31** | User glosses persist as `user-override` | `OPEN` | blocked behind N.30. **E.45, offered and unanswered: a user gloss is one bare string with no language on it, while the dictionary's glosses are bilingual `{en, fr}`** |
| **N.32a** | Say plainly that Ilya transmits nothing | `OPEN` | slate, revision 3. **E.45 verified it: every outbound call in `src` is a GET for Ilya's own assets** |
| **N.33** | The Guide's screenshot recapture, on Playwright | `RULED`, waits for the GUI | Fable, E.44: unblocked by N.66 |
| **N.35** | `SPOKEN_NAME` and `spoken()` are English | **`PART DONE`** | Shipped `6829161`. The four error captions are inside **N.62** |
| **N.37** | The stale `e16-harness` README | `OPEN` | slate, revision 3 |
| **N.38** | The C8 field audit | `RULED`, unscoped | slate, revision 3 |
| **N.39** | Scope the Learn overhaul | `RULED`, unstarted | `claude/e38-handover_v1_2026-08-10.md` §9 |
| **N.42** | The desk selector. **It selects a document, not a destination** | `RULED`, build-ready | `claude/e41-n42-assigned-desk-selector_2026-08-11.md`, **whose §2 is WRONG**. Two genuinely open: the luminance-keyed inks, and chip cream versus light |
| **N.45** | Transcribe's mobile content view | **`PART DONE`** | **E.45 DIAGNOSIS, RE-VERIFIED E.46 at `Paper.svelte:113-117`: the ruling said bypass pagination; the build set `gap: 0` instead. Portrait renders a STACK OF PAGES with the seam hidden.** **And the comment at `Paper.svelte:109-112` still asserts the pages must stay in the DOM for print, which Dann overruled. It is a live trap for the next reader.** Track switch offered and never answered |
| **N.46** | Fit's mobile presentation, shape A | **`PART DONE`**, shipped `4ec2840`, `b624631` | Landscape DONE, observed by Dann. UNOBSERVED: the provenance legend |
| **N.48** | The inescapable vowel | **`WRITTEN`**, shipped `f18c6ce`. **NOT EXERCISED** | Still needs a failing `[u]` |
| **N.49** | `[u]` extraction; the voice type never reaches the extractor | **`OPEN`** | `claude/e43-n49-assigned-extraction_2026-08-12.md`. INTERMITTENT |
| **N.50** | NotePicker joins the dictionary | **`PART DONE`**, shipped `f18c6ce` | Scope B, ten of fourteen. Eight strings inside N.62 |
| **N.51** | The Fit surface wears Transcription's accent | **`OPEN`** | E.43, Dann's `record` ruling. `--sage` at 39 sites across 12 files |
| **N.60** | The brace rule: the staff the brace does not span is the voice | `RULED` by Dann, 12 August 2026 | `claude/e43-n59-the-reader-in-a-browser_2026-08-12.md` §2 |
| **N.61** | The watch as a capture device | **`OPEN`, a question rather than a feature** | Whether a web app can reach that microphone is NOT ESTABLISHED |
| **N.64** | **Transcribe and Fit share one media input, the E.27 "Source" station** | **`RULED`, unstarted** | **`claude/e44-fable-ruling-studio-architecture_2026-08-13.md`, header table. E.46 CORRECTION: this is the INTAKE, not the text beside the notes. Opus mis-cited it from this register's own one-line summary** |
| **N.65** | The drawer's anchors | **`RULED`, half built** | `claude/e36-session-record_2026-08-10.md` §1.4. Built in the E.29 shape, not the E.36 shape. **E.46: N.55b's syllable station is a new tenant of this scroll** |
| **N.66** | The Studio consolidation | **`RULED`, unstarted** | `claude/e44-fable-ruling-studio-architecture_2026-08-13.md`. **E.46: Studio shows ONE document at a time. It would not put the text beside the stave, and Fable overturned the continuous packet page explicitly** |

### Ten rows closed since the register was written. Not carried

- **N.32** closed/parked table, LOG block 9
- **N.47** closed/parked table, LOG block 9
- **N.55a** closed/parked table, LOG block 9
- **N.55b** closed/parked table, LOG block 9
- **N.56** closed/parked table, LOG block 9
- **N.58** DEFERRED TO FUTURE DEVELOPMENT by Dann 2026-08-21
- **N.59** PARKED AT TIER 2, answered no, 2026-08-18 (step 3, the brace rule, still open)
- **N.62** closed/parked table, LOG block 9
- **N.63** closed/parked table, LOG block 9
- **N.67** CLOSED WHOLE 2026-08-18

### The gaps, carried forward and CORRECTED

**The register said "ten cardinals" and listed twelve.** Verbatim, its list was
N.1 through N.6, N.8, N.9, N.11, N.13, N.18, and N.21. **N.10b came off that
list in E.46**, located at `fit-legend.ts:80-104`.

**RECONCILED 2026-09-19. THE FIVE STANDS AND THE REGISTER'S TWELVE WAS STALE.**

**Method, so it can be checked:** a word-boundary grep for each cardinal
(`\bN\.<n>\b`, which does not match N.10 or N.146) across `docs/`, and
separately across `apps`, `packages` and `tools`.

**SEVEN OF THE TWELVE ARE IN THE TREE, each with an identity the register never
recorded:**

| # | what it is | read at |
|---|---|---|
| **N.4** | the unmeasured page | `packages/score-parser/src/staff-renderer.test.ts:1065`; `staff-renderer.ts:895`, `:2282` |
| **N.5** | the singer's notation preferences, 2026-08-05 | `apps/web/src/lib/shane/VoiceProfilePane.svelte:164`, `:844`, `:861` |
| **N.6** | ledger-line notes' stems, **recorded and NOT implemented** | `packages/score-parser/src/staff-renderer.ts:1791` |
| **N.8** | the singer's open-syllable preference, 2026-08-06 | `apps/web/src/lib/shane/vowel-resolver.ts:411`; `VoiceProfilePane.svelte:174` |
| **N.9** | the clitic rule: a word with no vowel can never own a slot | `apps/web/src/lib/shane/pairings.ts:102`, `:173`; `vowel-resolver.ts:512` |
| **N.11** | a hyphen's ink stays inside the gap between two syllables | `packages/score-parser/src/staff-renderer.ts:1175`, `:3404`; `staff-renderer.test.ts:53` |
| **N.13** | voicing preserved before a voiced-obstruent-initial word at a soft boundary | `packages/phonology/tests/notation-edge-cases.test.ts:528`, `:551` |

**N.6 BEING LOCATED IS THE ONE THAT MATTERS**, because it is on the visible list
as a live item, which a genuinely unlocated number could not be. Its code
comment says what it is and says it is not built.

**FIVE REMAIN GENUINELY UNLOCATED: N.1, N.2, N.3, N.18, N.21.** Zero references
in `apps`, `packages` or `tools`, and in `docs/` they appear **only inside the
gap listings themselves**. Nothing anywhere says what they are.

**The rows below are the register's, kept verbatim as its record. They are
superseded by the table above wherever the two disagree.**

Their rows, verbatim:

| # | item | state | primary source |
|---|---|---|---|
| N.1 – N.6 | — | **SUPERSEDED 2026-09-19: N.4, N.5 and N.6 are located; N.1, N.2, N.3 are not** | not located. See §Gaps |
| N.8 – N.9 | — | **SUPERSEDED 2026-09-19: both located** | not located |
| **N.10a, N.10b** | sub-items of N.10 | **N.10b LOCATED, E.46:** the withheld-syllable legend entry, `fit-legend.ts:80-104`. N.10a still NOT ESTABLISHED | **E.46: N.10b's French was replaced by Dann.** See §RULED |
| N.11 | — | **SUPERSEDED 2026-09-19: located** | not located |
| N.13 | — | **SUPERSEDED 2026-09-19: located** | not located |
| **N.14a, N.14b** | sub-items of N.14 | **NOT ESTABLISHED** | named in the commit history per the E.38 slate |
| N.18, N.21 | — | **NOT ESTABLISHED, confirmed 2026-09-19** | not located, and named nowhere but here |
| **N.20** | Built on `analyzePerVerse`. **Do not delete that function** | **NOT ESTABLISHED** | named in the E.41 opener §7.4; scope not located |

**Filling them is archaeology and it is optional. N.20's scope is genuinely
unknown**, and it matters more than the others. **The C-series is a separate
numbering** and was not in the register.

### Unnumbered and outstanding, carried forward

**5 of the register's 13 unnumbered rows are already in this file and are not
repeated here** (D3's Job A, French `?` spacing, French colon spacing, per-format score arrival audit, stripBackingRect). The
remaining 8 are:

| item | source | note |
|---|---|---|
| Three `notation.*.desc` keys write bare vowel glyphs | `e40-handover` §8 | |
| The stress-acutes toggle governs Transcription only | `NotationFields.svelte:14-21` | never numbered |
| A third touch-geometry exemption for the Notation header | E.41 | still unanswered |
| Three elements still measured in `100vh` | `+layout.svelte:12-17` | N.17 |
| The toggles are not freely combinable | E.38 audit | the Guide says *"freely combined"* |
| The rotation lock | E.44 | no string or code fixes it |
| **The teacher-with-a-studio copyright case** | E.45, raised by Dann, unanswered | |
| `ILYA_PROJECT_MAP_2026-08-10_r7.svg` has no cards for N.23 through N.67 | E.41 | **the map is an archive; the tracker is the instrument** |
