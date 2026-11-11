# Ledger of open work, r1, 2026-11-09

This ledger holds 127 open or doubtful items, merged across the tracker files. By true status: 14 are IN TONIGHT'S LANES (the integration branch, row 166, B0, the arias, saved word marks, the barline and time-signature tools, the poem harvest, the rhyme matcher, and the -кий Inspector note); 40 are RULED-NOT-BUILT; 20 are IDEAS; 15 are BLOCKED ON DANN; 16 are NOT ESTABLISHED (I could not verify them from the repository); 14 are STALE TRACKER rows inside the tables; 4 are BRIEF WRITTEN; 4 are SHIPPED and waiting only for a walk. By recommendation: 31 IN THE SHARE (14 of them are tonight's lanes, so 17 need work or a decision from Dann that no lane carries), 76 AFTER, and 20 DROP. A further 30 rows in the closing section, "Stale tracker rows", are done in the repository and still read open or running in a tracker file.

**How to read it.** Each row is one item, merged across QUEUE, INBOX, STATE, OWED, SCHEDULE, SEQUENCE, and OPEN. Status is checked against `cloud-lane-38` at tip `534d9981` (read-only, in `/home/claude/gates`) by `git log`, `git grep`, and file reads; where I could not check, the status says NOT ESTABLISHED. Source references use the line numbers of the files as staged from Dann's Mac at about 22:45 on 2026-11-09 (QUEUE.md `Q`, STATE.md `S`, INBOX.md `I`, OPEN.md `O`, OWED.md `W`, SCHEDULE.md `H`; the review is `consolidation`). Tonight's lanes are listed once, as IN TONIGHT'S LANES, and not as open work. Two things the review of this morning got wrong or left open are corrected here: the teacher-as-intermediary paragraph (row 94) is seated and pinned (`apps/web/src/lib/insights/ratified-lines.test.ts:43`, gates green on the tip), and the integration lane has since done IN-1 to IN-7 and IN-9 of that review.

**Limits.** OWED.md holds about 220 bullet items from August to October; I classified the ones that are still live in the latest sections and the nine N.146 findings, and grouped the rest in one row (L67). The three Tuesday briefs, the Fable reviews of 2026-11-10, and the desk workspace files are not in the repository at the tip, so their contents are taken from OPEN.md and STATE.md only.

**Status words.** SHIPPED; BUILT-NOT-MERGED; IN TONIGHT'S LANES; BRIEF WRITTEN; RULED-NOT-BUILT; IDEA; BLOCKED ON DANN; STALE TRACKER (done but not marked); NOT ESTABLISHED.

## Scan reading

| Id | What a voice teacher would see | Recorded | True status | Evidence | Rec |
|---|---|---|---|---|---|
| L1 | Scan words are read for every colleague by default, with the ratified banner (no `?words=read` switch) | consolidation IN-1; I640; O3534-3540 | IN TONIGHT'S LANES | integration step 8a and 8b `b17a3675` (switch gone, `UNDERLAY_READER` joins `READER_STAMP`); step 10 `82508305` (banner on every scan); step 12 `ad200461` (× on each banner) | IN THE SHARE (lane 38) |
| 181a | POEM joined to LYRICS on a scan: band pictures, print strip in the Loupe, "Choose a bar", unread-bars banner | Q133; O3438; I604-I614; H36 | IN TONIGHT'S LANES | step 2 merge `e5c6c7d8`; steps 7a to 7g; step 7c `4f8c7415` (a long dash ends the word: 385 of 590 on row 114 against the joint's 376) | IN THE SHARE (lane 38) |
| 181b | B0 and B0g: where the reader's count settles, the poem fills by vowel (syllables by vowel) | Q133; S19 (THE SHARE), S56 | IN TONIGHT'S LANES | cloud-lane-40, gate 389 (STATE.md THE SHARE) | IN THE SHARE (lane 40 decides) |
| 181c | A row floor for the join (arms J and J2, "rank 2") | Q133, Q1-Q4 updates | STALE TRACKER (measured and refuted, work closed) | arm J 371, J2 388, control 389 (`report-desk-row181-armJ2-scaled-floor_r1_2026-11-08.md`) | DROP (refuted twice; design r3 rank 2 closed) |
| 111 | A scan's misread word is repaired from the poem's aligned word | Q63; consolidation DROP? | RULED-NOT-BUILT, folded into 181a | joining design items 1 to 16 (O3438); step 2 merge | DROP (duplicate of 181) |
| 112 | A poem block printed on a score's page (or before it in one PDF) is found | Q64; consolidation AFTER | RULED-NOT-BUILT | Q64 "NOT WRITTEN, after stage 2a"; first page decides the file today (`ScoreUploader.svelte:280-299`, per consolidation, not re-read) | AFTER (needs the text reader first) |
| 150 | The text-seating design: three tiers for a scan's differing word | Q101; H39 | RULED-NOT-BUILT (design ratified 2026-10-20 22:43) | Q101; overlaps 181 | AFTER (partly met by 181) |
| 105 | Next reader model trained on photocopy-like rows (r4) | Q58; H30, H32 | BRIEF WRITTEN (r4, not Fable-reviewed; r3 and r5 gained nothing) | Q58; `report-code-row105-next-model_r2_2026-10-29.md` | AFTER (two rounds gained nothing; r2 stays) |
| 158 | Reader review: TrOCR and PaddleOCR as teachers or readers | Q108; H35 | IDEA (desk reading done 2026-10-28, measures not run) | `memo-desk-b0-reader-review-reading_r1_2026-10-28.md` (Q108) | AFTER (research; no colleague path) |
| 161 | Second look: post-reading correction from confusion pairs | Q111 | STALE TRACKER (REDESIGN, parked; successor row 160 SHIPPED `e5bad5a6`) | Q111, Q110; `e5bad5a6` is an ancestor of the tip | DROP (successor shipped) |
| 162 | Four fixes for 425 split or merged syllables | Q112 | STALE TRACKER (REDESIGN, parked; successor row 160) | Q112 | DROP (successor shipped) |
| 82 and 81 | Fine-tuned pre-reform reader model and underlay baseline | Q141, QUEUE-archive rows 81, 82 | STALE TRACKER for 82's brief (retrain SHIPPED `01b638ad`); the open remainder is N.184 | `01b638ad` in the log; S93 | DROP for the r3 brief; N.184 is the next row |
| N.184 | The reader reads pre-reform spelling (ѣ, ѳ, ѵ, і) in an underlay | S93; consolidation AFTER | RULED-NOT-BUILT (Dann 2026-10-11, "We need this capability") | S93; r3 and r5 did not beat r2 | AFTER (research-grade) |
| 135 | A measured figure for phone photographs, with a truth file per page | Q86; S150 | BLOCKED ON DANN (the photographs are his to take) | Q86 "the photographs are Dann's to take" | AFTER (state the gap in the packet) |
| 132 | A wider net of time signatures for the metre reader | Q83 | RULED-NOT-BUILT (measure first; each IMSLP download needs his yes) | Q83 | AFTER |
| 136 and N.193 | Piano doubling checks the voice's pitches; Insights comments on piano supports | Q87; S69; H98 | IDEA (measured: reach at most 11 notes on row 114) | H98 | AFTER (Dann ruled N.193 not for this release, S69) |
| L2 | THE TARGET: 9 of 10 syllables read without anyone typing the poem | S34; H5, H7; I640 | IDEA (target unmet: 385 of 590 is 65 percent on row 114 file 1) | `4f8c7415`; Dann 2026-11-09 11:56 amended the gate to a preview label | AFTER (the preview banner carries the share) |
| L3 | Song 3's misreads: alto clef read on p. 13, double flat read as a flat on p. 15, p. 16 unread | H46; consolidation AFTER | IDEA (no open row holds the double flat) | H46, H114 | AFTER |
| N.189 | A system with no voice staff is the voice's bars of rest | S81 | RULED-NOT-BUILT | S81 "Spec in OPEN.md" | AFTER |
| N.163 | A word the OCR misread (То read as Го) is shown with a gloss, as if printed | S124; W235 | RULED-NOT-BUILT (where the fix belongs NOT ESTABLISHED) | S124; the new reader banner is the mitigation | AFTER (name it in the known-issues line) |
| N.166 | A stored scan may need the page reader again on reload | S125 | RULED-NOT-BUILT (first reload cost remains; later reloads 0.4 s) | S125; row 13 report `ef16bb63` | AFTER |
| N.157 | Replacing a score re-derives the seats | S134; Q154 (row 101) | STALE TRACKER (S134 still `[ ]`; row 101 SHIPPED) | `b21ce8a` is an ancestor of the tip | DROP (done; mark it) |
| 114 | Sealed set for THE TARGET (songs 1 to 10), measure and fixes | Q66 | SHIPPED as a measure (fixes continue in 181 and 176) | Q66 | AFTER (no new work separate from 181) |

## Text and IPA

| Id | What a voice teacher would see | Recorded | True status | Evidence | Rec |
|---|---|---|---|---|---|
| L4 | The Inspector note on unstressed -кий/-гий/-хий (Grayson pp. 301 to 303, Avanesov 1989 p. 660) | O3569; I645-I646 | IN TONIGHT'S LANES (brief owed; strings owed EN then FR) | O3569; the Inspector has no such note at the tip (grep for `Avanesov` finds only LEARN prose and dictionary data) | IN THE SHARE (Dann 21:09) |
| L5 | The rhyme matcher: flags -кий/-ой rhymes in a poem, chained groups, partner adjective or noun | O3570-O3571; I647 | IN TONIGHT'S LANES (brief owed; no `rhyme` code at the tip) | O3570; grep `rhyme` finds only comments in `pre-reform-normalizer.ts:103-105` | IN THE SHARE (Dann 21:09, 21:11) |
| L6 | The poem harvest: every ethically usable poem from the repertoire checklists, attributed | I597, I638; STATE.md "Helper running" | IN TONIGHT'S LANES (running; this is the item that sat in an archived status note) | S26 (THE SHARE, "Helper running"); `tools/poems/library.json` holds 3 top-level keys (contents not counted) | IN THE SHARE (it feeds the share's library) |
| 182 | 89 aria texts (92 less three removed) in the poem library, with opera metadata and the title rule | Q134; O3601-O3603; I598 | IN TONIGHT'S LANES | cloud-lane-41, data r3 md5 76dd8f46 (STATE.md THE SHARE) | IN THE SHARE (Dann 20:22) |
| L7 | The 17 arias that have no usable text yet | Q134 ("Then the 17 arias without a usable text") | IDEA (no data file; the harvest may reach some) | Q134; consolidation AFTER table, row 182 | AFTER (needs sources found) |
| 173 | A consonant before a palatalized labial gets a blurb naming the real rule | Q123 | STALE TRACKER (SUPERSEDED by row 175, SHIPPED `ce5dc96f`) | `ce5dc96f` is an ancestor of the tip | DROP (done by 175) |
| 175 | Palatalization brought back into integrity with Grayson | Q135 | STALE TRACKER for "not walked" only; SHIPPED | `ce5dc96f` | DROP (done; one walk optional) |
| 91 | Reflexive -ся read hard; -ться/-тся's [ʌ] | Q143; W150-W151 | STALE TRACKER (Q143 says brief written; SHIPPED) | `cd983fa9` "the reflexive -ся reads a hard с and the vowel [ʌ]" is an ancestor | DROP (done; mark it) |
| 87 | A doubled word-final hard sign from OCR is read as one | QUEUE-archive row 87 | STALE TRACKER (shown RUNNING) | `aac19492` is in the log | DROP (done) |
| 147 | A check that every printed ё carries its dieresis | Q98; consolidation DROP? | RULED-NOT-BUILT, ruled unneeded by Dann 2026-11-08 ("Ilya already restores the dieresis on every ё") | O3524; I638 area; not measured by a desk | DROP (Dann's ruling) |
| L8 | A period or era switch for the poem (and the жж/зж default) | I639, I645-I646; O3521 | STALE TRACKER (the era control CLOSED by Dann 2026-11-09 20:53: "No date switch, no Year field, no period setting") | O3564-O3565 | DROP (closed) |
| L9 | A control on the POEM pane to show the old spelling or the modernized one (modern by default) | I621; O3471 | RULED-NOT-BUILT (library cards say "modernized", `PoemLibraryCard.svelte:53`; I found no spelling toggle on the pane, NOT ESTABLISHED) | O3471 | AFTER |
| 131 | A word's own hyphen («Люблю-ли») drawn as the print draws it | Q82; S148 | RULED-NOT-BUILT | Q82; no matching code found (grep `own hyphen`) | AFTER (small; Dann: "I don't want Ilya dropping hyphens") |
| 179 | An edited gloss keeps its language and is reused (a French reader sees an English edit only after editing) | Q130; I600-I601 | BRIEF WRITTEN (r3, Fable-reviewed; READY, waits) | `brief-code-gloss-language-and-reuse_r3_2026-11-03.md` is in the repo; no gloss-language field in `library/library.ts` | AFTER (a defect, but limited to edited glosses) |
| L10 | Inspector exposes Grayson's gemination exception in «по-русски» and the Alphabet Song | I642 | STALE TRACKER (answered: p. 288 gives it; engraving agrees) | I642; LEARN step 5d `b409a1d0` | DROP (answered) |
| L11 | "Latin in Russian songs", option 2: [w] and Richter's page | W860-W871 | BLOCKED ON DANN (a photograph of Richter's page) | W866 | AFTER |
| L12 | Engine defects: a second ё in one word falls through as a Cyrillic letter; reflexive -ся without т | W149-W151 | NOT ESTABLISHED for the second ё (not re-run); -ся fixed by row 91 | W149; `cd983fa9` | AFTER (check the ё case once) |
| L13 | Post-stress ⟨а⟩ and silent ⟨з⟩ ⟨с⟩ explanations, content questions to Dann | W884-W890 | BLOCKED ON DANN (two content questions) | W886-W890 | AFTER |
| L14 | The always-hard consonants (ц, ш, ж) and Grayson's exceptions | W837-W858 | NOT ESTABLISHED (ruled 2026-09-26 09:34: follow Grayson; QUEUE-archive:184 lists `lexical-palatalization.ts` as built; whether the word list is complete is unchecked) | W855; `packages/phonology/src/lexical-palatalization.ts` listed in QUEUE-archive:184 | AFTER (verify only if a colleague reports) |
| 107 | The wider Clear warning: deleting text that carries placements says how many syllables it frees | Q140; W1037 | RULED-NOT-BUILT (Dann's question first) | Q140; grep `frees` finds nothing in `IntakePanel.svelte` | AFTER |
| 137 | A printed or saved page takes a file name that keeps a growing library in order | Q88; I-2026-09-10 22:12 | RULED-NOT-BUILT (brief owed, not written) | grep `document.title` in `apps/web/src` finds none | AFTER |

## INSIGHTS and voice

| Id | What a voice teacher would see | Recorded | True status | Evidence | Rec |
|---|---|---|---|---|---|
| 166 | INSIGHTS and MELODY open from a declared voice type alone (generic stand-in values), so a colleague who skips calibration is not met by a withheld INSIGHTS | Q116; S39 (item 6b); O3542-O3545 | IN TONIGHT'S LANES | cloud-lane-39, brief r2 md5 a1f83b50, strings ratified 16:13 | IN THE SHARE |
| 71 | INSIGHTS suggests a key only when it has fewer challenges; 43 `insights.key.*` strings, EN and FR | Q132, Q139, Q148; O3484-O3503; consolidation IN-3 | IN TONIGHT'S LANES (done on the integration branch) | step 5 `58679982`; no `TODO-FR` left in `apps/web/src` at the tip (grep count 0) | IN THE SHARE (lane 38) |
| 180 | INSIGHTS Further reading as one consolidated list, topic shared by every work rising to a header | Q131; O3530-O3532 | STALE TRACKER (Q131 says RUNNING; lane 33 is an ancestor of the tip; the header is step 5c `eeab1c8e`) | `git merge-base --is-ancestor` lane 33 `ae96511a` yes; `eeab1c8e` | DROP (done; mark it) |
| 130 and N.173 | INSIGHTS explains each demand once and points back by bar; the curation rules; today repeats are counted ("One further instance, in the score.") | Q81; S113; consolidation ND-5 | RULED-NOT-BUILT (N.173 is a living draft, deliberately not ruled) | `i18n.ts:1838` still carries "One further instance, in the score." | AFTER (say in the packet that INSIGHTS prose is a draft) |
| L15 | The packet statement that INSIGHTS prose is a draft, and the known-issues line | consolidation ND-5; H92; S48 (item 10) | BLOCKED ON DANN (desk drafts after the freeze; he ratifies) | S48 "after 8" | IN THE SHARE |
| 119 | The three INSIGHTS questions to colleagues, each on a calibrated voice, in writing | Q70; O3573-O3575; H66 | BLOCKED ON DANN (reviewers named 21:21 to 21:23: Howell, Gautereaux, possibly Silverstein, St-Pierre, Doucet; French of the questions owed, desk drafts) | O3573-O3575 | IN THE SHARE |
| L16 | The review packet: one economical packet with all questions, ten merged into eight | O3575; H80, H92 | BRIEF WRITTEN (draft r2, not ratified; the first draft is `draft-review-packet-questions_r1_2026-10-30.md`, in the repo) | O3575; S48 | IN THE SHARE |
| 167 | Expand the generic profiles from four to Dann's seven voice types | Q117 | IDEA (TO RESEARCH) | Q117 | AFTER |
| 168 | A voice profile card a student can export, separate from the song binder | Q118; INBOX 2026-10-20 22:19; W702 | RULED-NOT-BUILT (brief not written; whether formant values are personal information under Canadian privacy law is NOT ESTABLISHED) | Q118 | AFTER |
| 9 | Voice type slice B: the courtesy check (a declared type compared with the measured fields) | Q157; QUEUE-archive row 9 | RULED-NOT-BUILT (brief owed; copy ratified 2026-09-30 12:32; waits on the pooled norms table r2) | only a comment at `VoiceTypeIntake.svelte:5` mentions it | AFTER |
| N.168 | The INSIGHTS intake: filling the three stores (steps 1 to 3 done, step 4 under way) | S118 | RULED-NOT-BUILT in part (steps 5 to 7 open); research | S118 | AFTER |
| N.170 | Outside eyes: expert critique, code review, synthesis (steps 4 to 7) | S119; H94 | RULED-NOT-BUILT; begins after the share | H94 | AFTER |
| N.123 | The cycle dose: where a falsetto caveat is computed is NOT ESTABLISHED; `cycleDose` returns null when a score has no tempo | Q175 (open work); S63 | NOT ESTABLISHED | S63 (Dann wants the contact count always shown) | AFTER |
| L17 | The INSIGHTS pitch figure clips its comfortable-zone label at 390 px in French | W1030 | NOT ESTABLISHED (not re-measured) | W1030 | AFTER |
| L18 | A small marker beside the tessitura band for a doubtful bar, or the page-two note is enough | W962 | BLOCKED ON DANN (new copy in both languages if a marker) | W962 | AFTER |
| L19 | INSIGHTS pointers to LEARN passages as in-text links ("see the passage in LEARN") | I424-I425; consolidation | IDEA (no pointer in `further-reading.ts`) | I424-I425; grep `learn` in `further-reading.ts` finds nothing | AFTER |
| L20 | A phoneme-cluster difficulty measure from the IPA chart, read within syntactic units | I426-I427 | IDEA | I426-I427 | AFTER |

## Interface and Loupe

| Id | What a voice teacher would see | Recorded | True status | Evidence | Rec |
|---|---|---|---|---|---|
| 138 and L21 | A barline verb in Corrections (Add a barline, Remove a barline), the arithmetic split offered, a time-signature control, and "Rebar the notes" completed in full, with ties across split points | Q89; O3572, O3576-O3578, O3587-O3592; I52 | IN TONIGHT'S LANES | cloud-lane-43, "Rebar never cut" (Dann 22:06) | IN THE SHARE (lane 43) |
| L22 | Inspector word marks (stress, ё, syllable boundaries, Spot Reconstitution) saved with the song, for Lyrics and Poem | O3561-O3562, O3604 | IN TONIGHT'S LANES | cloud-lane-42; today session state (`word-marks.svelte.ts:11-13` per O3562) | IN THE SHARE (lane 42) |
| L23 | Corrections slice 3, the singer's per-bar answers kept | Q-update 2026-11-08; H72; consolidation IN-5 | IN TONIGHT'S LANES (done on the integration branch) | step 1 merge `d645d127`; step 7g `f30cb8c5` | IN THE SHARE (lane 38) |
| L24 | The poem-join repair marks survive a reload | consolidation (Fable amendment 7); O3552-O3553 | STALE TRACKER (RULED session-only by Dann 20:32; amendment 7 closed) | O3553 | DROP (ruled) |
| L25 | Corrections slice 5: the rail and the fixed panel (six stations) | H73; I625 | RULED-NOT-BUILT (no Code brief; plan `plan-corrections-build_r1_2026-10-08.md`) | H73; I625 | AFTER |
| L26 | Corrections slice 6: the mark, the line, and the review of bars to check | H74; O3555-O3556; consolidation ND-2 | RULED-NOT-BUILT (Dann 20:40: waits until after the share; no longer gates the Guide) | O3555-O3556; grep `barsToConfirm` finds only `bar-answers.ts` and `bars-to-confirm.ts` | AFTER (Dann's ruling) |
| L27 | Corrections slices 7 to 11 | H112 ("moved after the 30th") | RULED-NOT-BUILT | H112 | AFTER |
| N.92 | Notation editing remainder: the singer's marks, tie to the note before, a page flag for an over-full measure | S143 | RULED-NOT-BUILT (slices 1 to 3 shipped) | S143 | AFTER |
| N.162 | A caret and a note compete for the same thumb | S129 | NOT ESTABLISHED (whether a note must stay tappable inside Corrections) | S129 | AFTER |
| N.140 | The Loupe scrolls sideways without stealing a syllable tap | S149 | RULED-NOT-BUILT in its last part | S149 | AFTER |
| N.141 | The squircle across a tie, barline, and system break | S148; Q-open work | RULED-NOT-BUILT | S148 | AFTER |
| N.187 | Grace notes drawn and editable; the drop is silent today | S85; I618 (Dann's ruling of 2026-11-05 00:19: a grace note takes no syllable) | RULED-NOT-BUILT | `musicxml-parser.ts:700-702` pushes a warning and skips the grace note | AFTER (name it in known issues) |
| N.188 rest | An accent below a stem drawn above; two slurs from one note (rows 124 and 126 remainder) | Q75, Q77 | RULED-NOT-BUILT (each "a look for Dann first") | Q75, Q77; `1e9358dd` shipped the first fix | AFTER |
| N.190 | Accidentals as the print prints them, courtesies included | S80 | RULED-NOT-BUILT | S80 | AFTER |
| N.191 and 146 | An ossia kept whole; song 2 bars 99 to 102 draw crossing ties | S79; Q97 | RULED-NOT-BUILT (no ossia code beyond a comment at `omr/metre-model.ts:141`) | S79; Q97 | AFTER |
| N.192 | Markup draws a key change where the score changes key | S78 | RULED-NOT-BUILT as the tracker says; I did not confirm whether later signatures draw (`transposition.ts:323` handles a later change for transposition only) | S78; `staff-renderer.ts` takes one `fifths` per call | AFTER (a song with a key change would show it; name it in known issues) |
| 145 | Slurs with an engraver's shape (tapered, flattened), and bars 82 and 86 of song 2 | Q96; I283-I284 | RULED-NOT-BUILT (measure first) | Q96 | AFTER |
| N.120 and N.177 and N.178 | A tempo control across a song; dynamics a singer can add, read from MusicXML and from scans | S107-S108; S70 | RULED-NOT-BUILT (row 48 gave each song an estimated tempo, `eeb055cd`) | S107-S108; `insights.phonation.tempoPointer` shown at `i18n.ts:1906` | AFTER |
| L28 | The hairpin gesture poll (Finale, Dorico, Sibelius, MuseScore) before slice 8 and N.177 | W1039 | IDEA | W1039 | AFTER |
| L29 | A bigger, more reassuring sign that a dropped file arrived (haptics on a phone) | I287-I288 | IDEA | I287-I288 | AFTER |
| L30 | More daylight between the key signature and the time signature in the Loupe | I280 | IDEA | I280 | AFTER |
| L31 | A click on a key signature or time signature opens the Loupe preset to its controls | I289 | IDEA (the time-signature control is part of lane 43; the click-invoke is not named there) | I289; O3587 | AFTER |
| L32 | Mobile Notation opens fully expanded and hides the metadata fields | I1 | NOT ESTABLISHED (a 2026-08-14 note; I did not re-walk the phone layout) | I1 | DROP (old; Dann to wave off if he agrees) |
| 174 | Move `+page.svelte`'s large blocks into their own files | Q124 | RULED-NOT-BUILT (Mac lane after the consistency batches); step 7e lowered the ceiling to 5534 (`61a46b25`) | Q124 | AFTER |
| 164 | The Loupe's lavender header (LOUPE; Undo, Redo, Close) | Q114, Q138 | SHIPPED `3a52f05e`; two open questions: the two-row phone bar, a real iPhone | Q138 | IN THE SHARE (a walk, see L50) |
| 163 | The first open after a deploy never blank; # drawn apart; Input's pill | Q113, Q137 | SHIPPED `dcb36850`; step 1 "not DONE until seen on a Vercel build" | Q137 | IN THE SHARE (a walk, see L50) |
| 165 | The ratified colour story | Q115, Q136 | SHIPPED `6f740dbf`; not walked | Q136 | IN THE SHARE (a walk, see L50) |
| N.160 | The work and its two views (steps 4 and 5; steps 1 to 3 closed) | S130 | RULED-NOT-BUILT (waits until after 2026-10-30; five notes all «одинокая» unresolved) | S130 | AFTER |
| N.156 | The Sunless 01 fixture's line-2 lag (a fixture, not a singer path) | S135 | NOT ESTABLISHED (whether the lyric-line disagreement is fixed) | S135 | AFTER |
| N.167 | A French singer reads English during the reader wait | S123; W274-W300 | NOT ESTABLISHED (shipped `350a2e5`; whether Dann saw it in French is not recorded) | S123 | AFTER (one look in French during L50) |

## GUIDE and LEARN

| Id | What a voice teacher would see | Recorded | True status | Evidence | Rec |
|---|---|---|---|---|---|
| N.84 | The GUIDE and LEARN rewritten to describe the app as it is, in Dann's authorial voice, EN then FR. Today the GUIDE still says "Transcription, Fit, Learn, and Guide", "the Transcription tab", "Metadata", and "four tabs" | S47 (item 9); Q171 (open work, N.84); I636; O3506-O3515; consolidation IN-8 | RULED-NOT-BUILT (after the freeze; voice profile r2 first) | `apps/web/src/lib/components/Reading/GuideContent.svelte:398` and `:427` still carry the old names; `names.ts:97` lists "Transcription tab" as retired | IN THE SHARE (Dann 11:56: GUIDE and LEARN rewritten by Thursday) |
| L33 | The fry essay "Why Ilya listens to your fry", ratified EN 2026-09-30 19:28 and FR 19:45, seated as its own h4, with its six works in `sources.ts` | Q171 (N.84 paragraph); `draft-guide-fry-essay_r1_2026-09-30.md` | RULED-NOT-BUILT (rides on N.84) | grep `fry` in `GuideContent.svelte` finds nothing | IN THE SHARE (inside N.84) |
| L34 | The Guide says how to find and fix a misread bar with the Loupe, and names the barline and time-signature tools; claims no accessibility level | O3556; row 140 ruling; I-2026-11-09 | RULED-NOT-BUILT (rides on N.84) | O3556 | IN THE SHARE (inside N.84) |
| 169 | The singer-facing text convention applied across the Guide, Learn, and the interface | Q119 | RULED-NOT-BUILT (ratified 2026-10-31 19:56; brief not written) | Q119 | IN THE SHARE (done as the rewrite is written; no separate brief) |
| 171 | The Guide names what is on screen today (names audit) | Q121 | BRIEF WRITTEN (r1, not Fable-reviewed); superseded by the rewrite | `retired-names.test.ts` exists already (cited at `ratified-lines.test.ts:40`) | DROP (folded into N.84; the guard test exists) |
| 159 | The Guide's licence paragraph names the HEIC decoder and its patents, EN and FR | Q109; I461-I463; consolidation IN-9 | IN TONIGHT'S LANES (done on the integration branch) | step 5b `8d9b5c02`, pinned in `ratified-lines.test.ts` | IN THE SHARE (lane 38) |
| L35 | LEARN's letter names read from the engine (row 11 «и краткое» missing [i]; a test pins them) | I642-I643 | IN TONIGHT'S LANES (done on the integration branch) | steps 5d `b409a1d0` and 9 `99ad94d8` | IN THE SHARE (lane 38) |
| L55 | LEARN's Glyph Table cursive columns show the placeholder «SVG» on every row; Dann will hand-write the letterforms for the desk to clean, crop, and trace | I644; `LearnContent.svelte:215-230` | BLOCKED ON DANN (template sent: `ilya-cursive-template_r1_2026-11-09.pdf`, 33 letters) | `LearnContent.svelte:229-230` still reads `SVG` in both cursive cells | IN THE SHARE (a colleague opening LEARN meets "SVG" 33 times) |
| C1 | LEARN's toggle wording; the capitals of `binder.heading`; `app.title` carries an em dash | Q125; consolidation ND-8 | BLOCKED ON DANN | `i18n.ts:183` (`EXPORT AND IMPORT`), `:2475` (`app.title` with an em dash) | IN THE SHARE (small; one question each) |
| 170 | The Markup tab renamed Melody in English and « Chant » in French | Q120 | STALE TRACKER (Q120 says brief not written) | `i18n.ts:224`: `'tab.markedScore'` reads MELODY and CHANT | DROP (done; mark it) |
| N.116 | Learn as a book | consolidation, AFTER table (row 169, N.116, N.175) | IDEA | consolidation; N.175 (video walkthroughs) was dropped 2026-10-14 (S62) | AFTER |
| 140 | A WCAG 2.2 accessibility audit, then a named level | Q91; INBOX 2026-08-18 | RULED-NOT-BUILT (claim no level before the audit) | Q91 | AFTER (the Guide must claim none) |
| L56 | The Guide walkthrough French, sections 1 to 4 | W984 | NOT ESTABLISHED (paused 2026-10-01; likely replaced by the rewrite) | W984 | DROP (replaced by N.84) |
| 99 and 100 | The install banner's Chrome-on-iPhone body (`ios_chrome_body` is `null`) and the `write-failed` sentence | Q152-Q153; Q39 of SEQUENCE.md | BLOCKED ON DANN (strings owed; check the iPhone menu path first) | `InstallPrompt.svelte:41` and `:51` read `ios_chrome_body: null, // owed to Dann` | AFTER (a Chrome-on-iPhone colleague cannot install; name it in known issues) |

## Data and library

| Id | What a voice teacher would see | Recorded | True status | Evidence | Rec |
|---|---|---|---|---|---|
| L37 | A singer's edited gloss: collect, preserve, or share (opt-in Send, curated French glosses shipped in a dictionary update, never overwriting the singer's own) | I600; O3374 | IDEA ("Later, not built") | O3374 | AFTER |
| L38 | Library cleanups: "Put it in this song" makes a new song; a text PDF's words land in a new song; New song needs two clicks; a fresh profile opens with a song listed; Delete's confirmation reads as an error | W228-W263 (the N.146 findings, nine live) | NOT ESTABLISHED (not re-run on the tip) | W215-W263 | AFTER |
| L39 | Lamm scan PNG draws as nonsense; a 23-page PDF takes 97 s with eleven pages unread; the cause of "not recognised as a score" on a normal JPEG | W222, W240, W254 | NOT ESTABLISHED | W222, W240, W254 | AFTER |

## Infrastructure

| Id | What a voice teacher would see | Recorded | True status | Evidence | Rec |
|---|---|---|---|---|---|
| L50 | Dann's walks of what has shipped and not been looked at: row 163 step 1 (first open after a deploy, "not DONE until seen on a Vercel build"), rows 164, 165, 175, 176, 177, 178, 180, C1, C2, and the integration branch | consolidation ND-7; Q125-Q131, Q135-Q138 | BLOCKED ON DANN (walks were waived only for the backlog before 2026-10-14, Q-note after line 160) | Q137, Q138 ("Not walked") | IN THE SHARE (one pass before the freeze) |
| L51 | One walk with a typed range and a treble song: every walk so far was on one voice, and whether the calibration wizard behaves on a treble voice is NOT ESTABLISHED | consolidation ND-9; W182-W214 | BLOCKED ON DANN | W182 ("EVERY WALK HAS BEEN ON ONE VOICE") | IN THE SHARE (most users may be sopranos) |
| L52 | The frozen build: format walk, print walk, N.83 (one song end to end), both languages; then `main` moved and invitations sent. `main` was 533 commits behind `Shane` this morning | S47-S50 (items 8 to 12); H89-H94; consolidation IN-10 | BLOCKED ON DANN (the freeze follows the work: Dann 22:06, "Friday is an artificial date. Quality over speed") | O3592; S19-S26 | IN THE SHARE (the share itself) |
| L53 | Eleven Playwright failures, red on `Shane` as well as on the integration branch; CI 22:38Z on `e4eeaa9` also failed e2e desktop with three annotations | S19-S24 (STATUS 21:1x and 20:1x) | NOT ESTABLISHED (which defects they are; none triaged in the files I read) | S19-S24; `ilya-ship.sh` does not run Playwright (W129) | IN THE SHARE (triage only: is any a real defect a colleague would meet) |
| L54 | Vercel Deployment Storage 10 GB limit on team dannmittons-projects and the open build-size question | Dann's memory note (not a repository file); the 8 Oct cleanup | NOT ESTABLISHED (I did not query Vercel) | memory listing only | IN THE SHARE (one number to read before `main` moves) |
| 155 and N.197 | Ilya loads nothing from outside services: the Google fonts and the jsDelivr entries in the content policy | Q106; S73; H88 | RULED-NOT-BUILT after the retirement of `?reader=ilya` (`9540610f` SHIPPED) | `apps/web/src/app.html:46-49` still preconnects to fonts.googleapis.com; `vercel.json:37` still allows `cdn.jsdelivr.net` and fonts | AFTER (Dann: fonts move layout and print) |
| L57 | 24 `upload.*` keys newly unread after row 155 | Q106; consolidation AFTER | IDEA (Dann to keep or drop) | Q106 | AFTER |
| N.58 and N.59 step 3 | MIDI import deferred; the brace rule `WRITTEN` and not `DONE` | S154 | RULED-NOT-BUILT | S154 | AFTER |
| L58 | A dead-code audit, an optimization pass, and a structural-intuitiveness pass for open-source contributors | I28-I30 (2026-08-24); W894-W912 | IDEA (the audit's list is "for Dann's ruling, nothing deleted") | W894 | AFTER |
| L68 | The visible list built only if a day finishes early (N.45 remainder, N.51, N.17, N.19, N.61, N.6) and unplaced N.115, N.117, N.122 | S155; Q175 (open work) | IDEA | S155 | AFTER |
| L59 | Small residue: i18n citations off by 77 lines or more (name the key instead); unused `station.startOver` and `loupe.undo.startOver`; `insights.fit.*` has no comment on why its name stayed | W969-W971 | NOT ESTABLISHED (not re-checked) | W969-W971 | AFTER |

## Research

| Id | What a voice teacher would see | Recorded | True status | Evidence | Rec |
|---|---|---|---|---|---|
| L60 | Two papers for the alignment design, read in full and filed (Yalniz and Manmatha 2011; Fremerey, Müller, and Clausen 2010) | W1038 | IDEA | W1038 | AFTER |
| L61 | A Quebec source for octave numbering in French (a lead through Karine St-Pierre) | W1026 | BLOCKED ON DANN (his call) | W1026 | AFTER |
| L62 | Which underlay line a truth file scores when the voice changes language (held-out set 3) | W1027 | IDEA (no standing rule) | W1027 | AFTER |
| L63 | Dann's reader directions of 2026-10-02 (analysis by synthesis, the stave as vectors, voice zones, Gould-placed dots): a fitted-shapes trial ran and did not pass | W995-W1004, W1015-W1021; QUEUE-archive row 24 | IDEA (trial measured 2026-10-02, no gain adopted) | QUEUE-archive row 24 | AFTER |
| L64 | Gould: a re-shoot of four spots, and rules 26 to 40 still unread | W110, W163 | BLOCKED ON DANN (photographs; the book is not on the cloud machine) | W110, W163 | AFTER |
| L65 | The Tchaikovsky Op. 38 No. 2 truth is a draft by eye that Dann has not proofed | W940, W943 | BLOCKED ON DANN | W940 | AFTER |
| L66 | Rows 52, 55, 76, 80, 81, 86, 88 (held-out sets, TrOCR teacher): measures on old builds | QUEUE-archive rows 52 to 88 | NOT ESTABLISHED for rows 86 and 88 (still read READY or WRITTEN, no commit found by `git log --grep`); rows 52, 55, 76, 80, 81 read MEASURED | QUEUE-archive | DROP for 86 and 88 (superseded by row 158 and the stage 2b measures; Dann to confirm) |
| L67 | The remaining OWED.md residue: about 100 older items (Aug to Oct) on walks, storage notices, receipts, copy gaps, and register rows | W20-W1043 | NOT ESTABLISHED (not individually checked; the consolidation also left them unclassified) | W20-W935 | AFTER (one desk pass to close or carry each; not for the share) |

## Stale tracker rows

Rows to mark done or closed. Each is shipped, merged, or ruled closed in the repository or in OPEN.md, and the tracker still reads open, running, or not written. "IN" means the commit is an ancestor of the tip `534d9981`.

| Row | Tracker says (file:line) | Truth | Evidence |
|---|---|---|---|
| QUEUE 103 | Stage 2a "NOT STARTED" (Q151) | Stage 2a SHIPPED; stage 2b SHIPPED | `48c36afd`, `f6c8ae43` both IN |
| QUEUE 113 | "NOT WRITTEN; cloud lane" (Q65) | SHIPPED (iPhone HEIC photos open) | `fb2d2e37` IN |
| QUEUE 120, 121 | RETURNED, not merged (Q71, Q72) | SHIPPED (N.188 and row 121 merged) | `99b78c08` IN |
| QUEUE 122 | Brief r1, "NOT Fable-reviewed" (Q73); SCHEDULE.md:48 already says shipped | SHIPPED; the receipt says PDF or photograph | `b6a186a7` IN; `apps/web/src/lib/score/format-label.ts` exists |
| QUEUE 123, 125, 126 | RETURNED or RATIFIED (Q74, Q76, Q77) | SHIPPED | `f93b9e5e`, `61c4e689`, `1e9358dd` IN |
| QUEUE 129, 133, 141, 142, 143, 144, 148, 149 | "BUILT on cloud-lane-12" (Q80, Q84, Q92 to Q95, Q99, Q100) | SHIPPED (merge `b488bef9`; Dann's looks 2026-10-20) | `b488bef9` IN; STATE floor paragraph |
| QUEUE 134 | Brief r1 written (Q85) though the first cell says DONE by Dann's look | SHIPPED and DONE | `cdae3be4` IN; Q85, H82 |
| QUEUE 153, 154 (N.195, N.196) | "BRIEF WRITTEN, NOT Fable-reviewed" (Q104, Q105); STATE.md S71, S72 still `[ ]` | SHIPPED and measured by the desk 2026-10-30 | `c13cc3fb`, `0202fd63` both IN; H83, H84 |
| QUEUE 170 | "RATIFIED; brief not written" (Q120) | BUILT: MELODY and CHANT | `i18n.ts:224` |
| QUEUE 173 | "SUPERSEDED by row 175" (Q123) | Close | `ce5dc96f` IN |
| QUEUE 176 | "RUNNING from 2026-11-02" (Q127) | SHIPPED `e74ee1b2` (363); row 114 later 369 | `e74ee1b2` IN; H34 |
| QUEUE 180 | "RUNNING on cloud-lane-33" (Q131) | SHIPPED (lane 33 an ancestor; the header is step 5c) | `ae96511a` IN; `eeab1c8e` |
| QUEUE 91 | "BRIEF WRITTEN ... REVIEWED" (Q143) | SHIPPED | `cd983fa9` IN |
| QUEUE 157, 172, 71, and the row at Q132 | "BUILT, NOT MERGED, NEVER READ BY A DESK" (Q132), "r3 READY" (Q139), "RULED ... r2 NOT written" (Q122), "BRIEF r1 WRITTEN" (Q107) | Integrated on `cloud-lane-38`: row 157 step 3, row 172 step 4, row 71 step 5 (lane 29 itself is not an ancestor, its work was re-applied) | `2f633daf`, `67033c4d`, `58679982` |
| QUEUE 159 | "NOT WRITTEN" (Q109) | Built on the integration branch (not yet on `Shane`) | `8d9b5c02` |
| QUEUE 181 | "design r3 written" (Q133) | Join built and integrated; B0 now lane 40; rank 2 closed | steps 2 and 7; arm J2 report |
| QUEUE 161, 162 | REDESIGN, "parked" (Q111, Q112) | Close: row 160 is the successor and is SHIPPED | `e5bad5a6` IN |
| QUEUE 147 | "NOT WRITTEN" (Q98) | Close: Dann's ruling of 2026-11-08 | O3524 |
| QUEUE 82 (r3 brief) | "READY, Fable-reviewed, for Code on the Mac" (QUEUE-archive row 82) | Retrain SHIPPED | `01b638ad` IN |
| QUEUE 83, 84, 87 | BUILT, READY, RUNNING (QUEUE-archive rows 83, 84, 87) | SHIPPED | `e7acf7fe`, `9e1af16e`, `aac19492` all IN |
| QUEUE 5, 13, 47, 48 (archive entries) | READY (QUEUE-archive rows 5, 13, 47, 48) | SHIPPED `263aa48a` (rows 47, 48 `32eb13c6`, `eeb055cd`) | Q149, Q150, Q156, Q158 |
| STATE N.157 | `[ ]` (S134) | Row 101 SHIPPED | `b21ce8a` IN |
| STATE N.186 | `[ ]` (S89) | Row 110 SHIPPED (Text transcribes Lyrics by default) | `eb30b03` IN |
| STATE N.195, N.196 | `[ ]` (S71, S72) | SHIPPED | as above |
| SCHEDULE H72 | Slice 3 `[ ]` | Merged on the integration branch | `d645d127` |
| SCHEDULE H54 | Row 147 `[ ]` | Closed by ruling | O3524 |
| SCHEDULE H65 | Row 71 "BUILT ... NOT MERGED" | Integrated | `58679982` |
| SCHEDULE H1 and H5 | "the checklist to Friday 2026-10-30" | The plan's dates are history; the share's plan is STATE.md THE SHARE | S19, O3592 |
| SCHEDULE H74, SEQUENCE.md:31 | Slice 6 "gates the Guide and the share" | Superseded: it waits until after the share | O3555-O3556 |
| STATE S63 or Q-update lines naming rank 2 | rank 2 "next" | refuted | arm J2 report |

## Notes for the desk

1. **From memory, not the repository.** L54 (Vercel Deployment Storage) comes from Dann's memory notes; I did not query Vercel.
2. **What I did not do.** I changed no code and no memory file. I ran no gate and no browser; every BUILT or NOT BUILT claim rests on `git log`, `git merge-base --is-ancestor`, `git grep`, and file reads at the tip.
3. **Duplicates merged.** Row 71 with rows 139, 148, and N.182; row 172 with rows 122, 132; row 157 with rows 107, 132, and N.198's leftovers; row 181 with rows 111, 150, and the joining items 1 to 16; N.151 into N.92; rows 146 and 191 (ossia); N.195 to N.197 with rows 153 to 155; N.183 with row 75; row 138 with the barline and time-signature items.
4. **A correction to the review of this morning.** It listed the teacher-as-intermediary paragraph (row 94) as not seated because a grep for "intermediary" found no match in the Guide. The paragraph is pinned by `ratified-lines.test.ts:43`, and the gates are green on the tip, so row 94 is SHIPPED.
5. **Where Dann's decision is needed and no lane carries it.** L15 (the packet statement), L16 (packet ratification), 119 (French of the questions), L50 (the walks), L51 (a treble walk), L52 (the frozen build), L55 (cursive letterforms), C1 (three wording questions), N.84 (the rewrite), 99 and 100 (the install banner string).
