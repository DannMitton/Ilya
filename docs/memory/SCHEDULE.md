# SCHEDULE: the checklist to Friday 2026-10-30

r3, written by the desk (Opus) 2026-10-20 about 02:50, at Dann's request of 02:47: *"Can you generate such a list and use it as a running cheklist to keep us oriented? ... Can you heop m,e by devising a sequential checklist grouped by meta tasks?"* (transcribed as written). It replaces r2 of 2026-10-12, which is in `SCHEDULE-archive.md` verbatim. Floor: `4e56cea8`.

**RULED 2026-10-27 02:49 (Dann, option 3): the share moves until meta 2 is measured at 9 of 10; 2026-10-30 is no longer the share date and the new date is NOT SET. The paragraph below is history.** **What 2026-10-30 is.** The day Dann shares Ilya with colleagues for testing and feedback, at `ilya.dannmitton.com` (ruled 2026-10-18 18:26 and 2026-10-19 19:59; `OPEN.md` §N.170). Not a release; a release date is NOT SET. The date never sizes the work (`CONTRACT.md` §1 item 7): what does not fit moves, and the move is written in "Changes" below.

**What colleagues are meant to meet: THE TARGET** (`PRODUCT.md`, "The target, in Dann's words", ruled 2026-10-18 18:44): a colleague drops a scan, PDF, or photograph of a Russian song; Ilya gives back the correct Text, Markup with the sung syllables seated in IPA and syllabified modern Cyrillic, reading at least 9 of 10 syllables without anyone typing the poem, and Insights that are reasonable, relevant, and human-sounding.

**How it is kept.** Six meta tasks. Each opens with why it matters and what done means; each item says what it solves and what it opens (the shape the desk chose 2026-10-20 03:0x for Dann's ask of 02:59 that each node carry its need, how it solves a problem, and what it enables). The metas are listed in the order they finish. Metas 2 to 5 run side by side across the lanes (Mac, cloud, desk); meta 6 comes last. An item is ticked when Dann has walked it or the desk has measured it, never when it is written. The desk ticks at every close and whenever a row moves, and logs every addition, deferral, and deletion under "Changes" with its date and who decided. Build order inside a meta is `QUEUE.md`'s and `SEQUENCE.md`'s. Sizes are NOT ESTABLISHED unless an item says otherwise. Placements are DESK DEFAULT unless an item names Dann's ruling.

**The budget (Dann 2026-10-20 02:52: *"we need to think economically. Our Cloud credits are almost depleted and I will not be buying more. Our usage has been aggressive and we need to control it to make it last."*).** His screenshot at 02:52: shared pool 57 percent, Fable 65 percent, both resetting Sunday 2026-10-25 05:00; cloud credit $7 of $250 (after it, cloud sessions draw on the plan's usage, as the usage page states); the page forecasts a run-out tomorrow afternoon, limit not named. DESK DEFAULT 02:5x: this week's remainder is paced to last to Saturday (about 8 points of the shared pool and 7 of Fable a day); Fable for rulings, taste, and one review per batch of briefs; small rows batched into one cloud session; row 105 and stage 2b start after Sunday's reset. Dann's play with Ilya costs no usage.

---

## Meta 1. Land what is in flight

**Why:** work already paid for helps no one until it reaches the alias, and landing it costs little. **Done means:** each row shipped and walked.

- [x] **Row 127, the octave clef.** DONE: shipped `c68f9a0f` (merge `209aaeb1`), closed by Dann's look 2026-10-20 03:11. *Solves:* a low voice reading a treble-printed line an octave down saw the key signature an octave too high and had no choice of bass clef; now notes and key sit where the print has them, and bass is the singer's choice. *Opens:* low voices can use Markup on treble-printed songs; Dann's clef ask of 2026-10-14 closes.
- [x] **Row 128, the tempo chips.** SHIPPED `dbb97773` 2026-10-20 11:56; DONE by Dann's look 2026-10-20 13:33. *Solves:* the notes in the tempo buttons sit too high (Dann's screenshot, 2026-10-19 23:18); they get an even margin, like the other buttons. *Opens:* the tempo control looks finished.
- [x] **Row 129, triplets as the publisher draws them.** DONE for the centring (Dann's look 2026-10-20 15:45); its slur remainder travels with row 145. Brief r2 reviewed (batch A). *Solves:* Ilya adds a bracket the print does not have (song 1, bar 10); the 3 goes over the middle stem's meeting with the beam. *Opens:* Markup looks like the page a colleague compares it to.
- [ ] **The uncommitted documents.** *Solves:* records held only on Dann's disk can be lost, and untracked files stop the ship script. *Opens:* every later ship runs clean.

## Meta 2. The words from a scan reach 9 of 10 syllables

**Why:** THE TARGET says a colleague never types the poem. Ilya reads a scan's notes (95.7 on row 114), but its words reached 9 of 10 on 1 song in 16 (QUEUE row 103, 2026-10-15), so today a colleague would type the poem. THE TARGET's largest gap. **Done means:** 9 of 10 syllables on row 114's songs, on the singer's path. Order from `SEQUENCE.md`, section A.

- [x] **Row 117, cleaning the image first** MEASURED 2026-10-27 (`report-desk-row117-image-cleaning_r1_2026-10-27.md`; frame 1,875 to 2,086 of 2,538). (Mac; measure only). *Solves:* photocopies lose words before the reader sees them; this measures whether three clean-ups (thresholding, straightening each row, closing broken strokes) win them back. *Opens:* tells row 105 which training lever matters most.
- [x] **N.135 stage 2a, the pure modules** SHIPPED `48c36afd` 2026-10-27 23:31 (Fable-reviewed as built, step 4 applied; `report-code-n135-stage2a-step{1..4}_r1_2026-10-27.md`). (cloud). *Solves:* even a good reader needs the page cut into lyric rows, words split at their marks, and each syllable seated under its note; these are those parts, built and tested on their own. *Opens:* stage 2b can wire them in.
- [x] **Row 105, the reader's next model** RUN 2026-10-27 on the Mac, r3 did NOT beat r2 (2,029 against 2,086), nothing shipped (`report-code-row105-next-model_r1_2026-10-27.md`). Was: (Mac, after Sunday's reset). *Solves:* the present model fails on photocopies; this trains it on lines degraded like photocopies and phone photographs, with real pre-1918 rows and Ilya's dictionary inside. *Opens:* the reader stage 2b puts in the app.
- [ ] **Stage 2b, the reader in the scan path** RUNNING in the cloud on `cloud-lane-19` from 2026-10-27 (brief r2, Fable-reviewed). Was: (Mac, after Sunday's reset). *Solves:* a scan's words never reach Markup without typing; this runs the reader inside Ilya behind a switch. *Opens:* the measure below; N.135's two banner strings (French to Dann).
- [ ] **Measured on row 114's songs.** *Solves:* says plainly whether THE TARGET's words are met. *Opens:* the decision point.
- **Decision point, Monday 2026-10-26 (DESK DEFAULT):** if the measure is below 9 of 10, what colleagues get on the 30th goes to Dann as one question.
- [x] **The text-seating design interview (QUEUE row 150).** DONE: the design is RATIFIED (Dann 2026-10-20 22:43); the briefs for rows 111 and 150 wait on the alignment measure and Sunday's reset. Was: Q1 to Q6 answered 2026-10-20 (Q6, the three tiers, at 21:20). *Solves:* a scan whose words differ from the poem, or a file with no words, has no agreed rule for what Ilya repairs, marks, or leaves alone. *Opens:* the design in `OPEN.md` for Dann to ratify, then a brief for stage 3.

## Meta 3. Text and Markup read true to the print

**Why:** a colleague checks Ilya against the printed page, and every visible difference costs trust. **Done means:** each fix walked on a song that shows it.

- [x] **Row 149, a printed slur seats a melisma.** CLOSED by Dann 2026-10-20 20:50 as behaves-by-design on song 2 (`QUEUE.md` row 149); the rule stays built and unwalked on a song with matching counts. *Solves:* Ilya seats one syllable per note, so one unread melisma sets every later syllable a note late (song 2 from bar 8), and Insights then pairs pitches with the wrong vowels. *Opens:* correct seating on melismatic songs, and Insights' flags on the right vowels.
- [ ] **Song 3's misreads.** *Solves:* the one song below 90 (84.5) has three causes: p. 13 bars 5 and 6 read in an alto clef, p. 15 bar 2's double flat read as a flat, p. 16's voice notes not read (that page unproofed). Each needs a reader fix; no open row holds the double flat yet. *Opens:* song 3 passes, and the fixes reach any song with the same features.
- [ ] **N.192 with N.190.** *Solves:* Markup draws only the first key (`staff-renderer.ts:1680`) and draws accidentals by rule, not as printed; these draw every key change and the print's own accidentals, courtesies included. *Opens:* Corrections changes only what is drawn (N.190's second half).
- [ ] **Rows 124, 131, 122.** *Solves:* three small faults: N.188's leftovers (an accent printed below drawn above, among others; each a look for Dann first); a word's own hyphen, as in «Люблю-ли», drawn like a syllable break; a scan's receipt saying "MusicXML (direct)". *Opens:* nothing waits on them; they clear distractions from the critique.
- [x] **Rows 141 and 142, found in Dann's play.** DONE by Dann's looks 2026-10-20 15:29 and 15:31 (`QUEUE.md`). *Solves:* a run of empty bars splits across two systems and the first half is cut off at the line's end (song 2, bars 23 to 29); the notes take a page of their own when the last page of music has room for them. *Opens:* layouts a colleague can print without wasted or clipped pages.
- [x] **Row 144, the clef choice on the Paper.** DONE by Dann's look 2026-10-20 15:27 (chip and menu); the phone sheet stays a one-line look for another day (his ruling 23:38). *Solves:* the clef can be changed only from the drawer, and only in one case (Dann 03:11); the choice speaks once beside the clef, then lives in the clef (ruled 03:15). *Opens:* any singer compares Markup with the print in the clef they read.
- [x] **Row 143, one footer.** DONE by Dann's look 2026-10-20 15:51 (Text and Markup; Insights, French, and print not looked at). *Solves:* the three documents' footers differ in colour and credit (Dann 03:05); one footer, with LiederNet credited in the Guide (ruled 03:08). *Opens:* a matched set of pages for the packet.
- [ ] **Row 145, slurs with an engraver's shape.** *Solves:* slurs drawn as even arcs rather than tapered, flattened engraved curves, and slurs that run into a stem (song 2, bars 82 and 86; Dann 03:22). *Opens:* Markup's slurs a colleague can set beside the print.
- [ ] **Row 146, an ossia read as following notes.** *Solves:* song 2's bars 99 to 102 hold six beats and draw crossing ties, because the ossia's lower notes were read one after the other (Dann 03:22 and 03:25). *Opens:* any song with an ossia reads and draws as printed.
- [ ] **Row 147, `ё` always printed.** *Solves:* a source or a typed title without the dieresis would print without it; the rule is Dann's (03:29). *Opens:* every printed word gives a non-Russian singer the vowel it sings.
- [x] **Row 148, the empty circle over a clitic.** DONE by Dann's look 2026-10-20 15:30. *Solves:* Text draws an empty provenance circle over a clitic with no stress data (Dann 03:33). *Opens:* no unexplained mark on the page.
- [~] **Rows 133 and 139.** Row 133 DONE by Dann's look 2026-10-20 15:41; row 139 SHIPPED in batch C, `7d3ac4c0`, 2026-10-26 20:38, not walked (`QUEUE.md`). *Solves:* "Quarter · Dot" becomes "Dotted quarter", with the rests' French names (ratified 2026-10-19 23:41); a singer can type # where a coach says the voicing stops, and the IPA follows (ruled 2026-10-20 00:01). *Opens:* Text can follow a coach's correction without a new rule in the engine.
- [ ] **Row 152 (N.194), click any editable element on the Paper and a card offers its edits, starting with the # break.** RUNNING in the cloud from 2026-10-26 22:04 (`cloud-lane-15`, brief r5; `QUEUE.md`). Ruled into the checklist by Dann 2026-10-21 00:57 (*"I want to move row 152 into our release tasks: I want Ilya to featiure this capability. Make it so."*, transcribed as written). *Solves:* a singer or a coach marks a syntactic break while looking at the passage, on Text or on Markup, without digging through controls; the click-to-card model is the Clef selector's (`ClefControls.svelte`). *Opens:* the same click-a-thing, get-its-card pattern for the Paper's other editable elements, each enumerated first. *Needs, in order:* row 139's engine, pipeline, and boundary work (batch C, brief r2); the desk's enumeration of each element's edits for Dann's ruling; a per-song break map after the gloss map's pattern; a brief per surface, Fable-reviewed after Sunday 2026-10-25 05:00. Whether it fits before the 30th is NOT ESTABLISHED; per `CONTRACT.md` §1 item 7 the date does not size the work, and a move off the 30th is written here when it happens.
- [ ] **Rows 135 and 113.** *Solves:* THE TARGET names photographs, and none has been measured; row 113 decodes iPhone photographs (HEIF). *Opens:* a stated figure for photographs, or a named gap for the packet.

## Meta 4. Insights sounds like Dann

**Why:** THE TARGET asks for reasonable, relevant, human-sounding insights, and two colleagues judge them in writing (Dann 2026-10-18 19:06). **Done means:** the colleagues have the questions and an Insights worth reading.

- [ ] **Row 130 and the humanizing pass (N.173).** *Solves:* a repeat is counted ("One further instance, in the score.") instead of explained once and pointed back to by bar; the pass makes the text read like Dann. *Opens:* Insights ready for the colleagues' reading.
- [ ] **Row 71, how Ilya suggests a key.** *Solves:* the key suggestion, held since 2026-10-11, rebuilt on today's code. *Opens:* key suggestions in Insights, with Dann's French.
- [ ] **Row 119, the questions to two colleagues.** *Solves:* the ratified questions need French once Dann names the colleagues. *Opens:* the colleagues' written judgement of Insights.

## Meta 5. A singer can fix what Ilya misreads

**Why:** no reader is perfect; when Ilya misreads a bar, the singer needs a clear way to fix it. Corrections runs beside the reader work (Dann 2026-10-12 21:50), and slice 6's walk gates the Guide and the share. **Done means:** slice 6 walked by Dann.

- [ ] **Slice 3, the answer kept** (cloud). *Solves:* what a singer answers about a bar (confirmed as printed, changed, or put away) is not kept with the song. *Opens:* slice 6.
- [ ] **Slice 5, the rail and the fixed panel** (Mac). *Solves:* the correction panel becomes six stations with a fixed footer, on phone and desk. *Opens:* slice 6.
- [ ] **Slice 6, the mark, the line, and the review** (Mac). *Solves:* the singer is not shown which bars to check; this marks them, offers fixes, and reviews the result. *Opens:* the Guide rewrite and the share.

## Meta 6. Ready for colleagues

**Why:** critique helps only when colleagues meet a stable, explained Ilya and know what to look at. **Done means:** colleagues invited on Friday 2026-10-30.

- [ ] **N.84, the Guide and Learn, EN and FR.** *Solves:* the Guide describes an older interface. *Opens:* colleagues learn Ilya without Dann beside them.
- [ ] **Row 134, printed colours.** *Solves:* printed pages lose the colour that tells Text, Markup, and Insights apart (Dann 2026-09-24 15:35). *Opens:* the packet's printed pages.
- [ ] **N.195, the dictionary starts with no connection.** Ruled in by Dann 2026-10-21 21:20 (QUEUE row 153; brief r1 written, not Fable-reviewed). *Solves:* the loader fetches a manifest before it reads the stored dictionary, so a colleague opening Ilya with no connection after one online visit gets no dictionary (read, not run). *Opens:* Ilya works on a train or a plane, as the app is meant to.
- [ ] **N.196, security headers.** Ruled in by Dann 2026-10-22 22:08 (QUEUE row 154; brief r1 written, not Fable-reviewed). *Solves:* the site tells the browser nothing about content sniffing, framing, referrers, or device features (read, not run); colleagues are about to open it. *Opens:* an enforcing policy later. DESK DEFAULT placement: before the share.
- [ ] **N.197, nothing loaded from outside services.** Ruled in 22:08 (QUEUE row 155; NOT WRITTEN, waits on Dann's answer about `?reader=ilya`). *Solves:* every visitor's browser contacts Google for fonts, and Ilya's own reader loads Pyodide from jsDelivr. *Opens:* a policy with no outside origins. DESK DEFAULT placement: after the share, because fonts move layout and print.
- [ ] **The format walk, a print walk, and N.83.** *Solves:* catches what the month's changes broke in every format and on paper; N.83 takes one song end to end, the only honest whole-path check. *Opens:* the frozen build.
- [ ] **Dann plays with Ilya** on the alias, whenever the pool runs low before Sunday, and the desk records what he finds (his wish, 2026-10-20 02:52: *"I would love to spend some time playing with Ilya before sedning it out for critique"*). *Solves:* the author's own use is the best check before others look. *Opens:* last fixes, and his confidence in sending it.
- [ ] **Dann plays with the frozen build**, Thursday 2026-10-29 (DESK DEFAULT). *Solves:* a last look at exactly what colleagues will see. *Opens:* the invitations.
- [ ] **The review packet.** *Solves:* colleagues need to know what Ilya is and what Dann most wants answered; he rules its three or four questions, the desk drafts the rest. *Opens:* focused critique instead of scattered impressions.
- [ ] **The review build frozen**, walked once in both languages. *Solves:* every colleague must test the same version while work continues. *Opens:* moving `main`.
- [ ] **Friday 2026-10-30: `main` moved, colleagues invited.** *Solves:* the share itself. *Opens:* N.170 steps 4 to 7: the expert critique, the code review, the synthesis, and the builds that follow.

## After the 30th (deferred; nothing here is lost)

Rows 107, 132, 136, 137, 138, and 140 (the WCAG audit; no level claimed before it, Dann 2026-10-20 00:02). Corrections slices 7 to 11, and slice 8 after N.120 and N.177. N.178. The GUI track, D1 and D2 (`CONTRACT.md` §8). N.88, marketing, Dann's own and optional. N.170 steps 4 to 7. The LATER list of r2 (`SCHEDULE-archive.md`, r2's last section).

## Changes

- 2026-10-27 23:4x, the desk (Opus): meta 2 rows 117 and 2a ticked; row 105 run and failed its measure (r2 stays); stage 2b running in the cloud, not on the Mac (DESK DEFAULT of the 02:5x plan; the desk measures the real page in its workspace). Frame plus seating together: 1,831 of 2,385 exact (76.8 percent) on the build songs, the harness, not row 114.

- 2026-10-20 02:5x, the desk: r3 written as the checklist Dann asked for; placements DESK DEFAULT. Corrections slices 7 to 11 moved after the 30th; the decision point of 2026-10-26 added.
- 2026-10-20 02:5x, the desk: the budget paragraph added on Dann's word of 02:52; two play items added to meta 6 on his wish; row 105 and stage 2b placed after Sunday's reset (DESK DEFAULT).
- 2026-10-20 03:0x, the desk: each meta and item given its why, what it solves, and what it opens, on Dann's ask of 02:59. Corrected: r3 had song 3's double flat as "row 26"; row 26 (the accidental reader) is archived, held since 2026-10-04, and no open row holds the double flat.
- 2026-10-20 03:1x, the desk: rows 141 and 142 added to meta 3, from Dann's play with song 2 (03:01 and 03:03).
- 2026-10-20 03:1x, the desk: row 143 added to meta 3 on Dann's ruling of 03:08.
- 2026-10-20 03:1x, the desk: row 127 ticked on Dann's look of 03:11.
- 2026-10-20 03:1x, the desk: row 144 added to meta 3 on Dann's ruling of 03:15.
- 2026-10-20 03:2x, the desk: row 145 added to meta 3 from Dann's review of song 2 (03:22).
- 2026-10-20 03:2x, the desk: row 145 narrowed to slur shape and bars 82 and 86; row 146 added (the ossia), from Dann's screenshot of 03:25.
- 2026-10-20 03:3x, the desk: row 147 added to meta 3 on Dann's ruling of 03:29.
- 2026-10-20 03:3x, the desk: row 148 added to meta 3 from Dann's screenshot of 03:33.
- 2026-10-20 03:3x, the desk: row 149 added at the head of meta 3 on Dann's ruling of 03:37.
- 2026-10-20 11:5x, the desk: row 128 shipped; batches A and B sent to the cloud.
- 2026-10-21 21:0x, the desk: ticked from `QUEUE.md` and Dann's looks of 2026-10-20 15:27 to 20:50: rows 141, 142, 143, 144, 148, 149 (closed by design), and the text-seating interview; row 133 noted done, row 139 noted in batch C. The ticks had lagged since 2026-10-20 11:5x. Reversible; his to wave off.
- 2026-10-21 21:4x, the desk: N.195 (row 153) added to meta 6 on Dann's ruling of 21:20; DESK DEFAULT placement, before the walks.
- 2026-10-22 22:2x, the desk: N.196 (row 154) and N.197 (row 155) added to meta 6 on Dann's ruling of 22:08; DESK DEFAULT placement.
- 2026-10-27 02:49, Dann: the decision point of meta 2 answered, option 3 of the desk's three (*"No, 3. Just stop stalling and get it done"*, transcribed as written; 02:48 *"2 but make it good"*, superseded a minute later): the share moves until the words read 9 of 10; no new date set. The desk's options and recommendation (option 1) are in `INBOX.md` 2026-10-27 02:44. Meta 2 becomes THE ONE THING (`STATE.md`). N.194 r5 (row 152) measured green and its ship paste given 02:5x.
- 2026-10-26 22:5x, the desk (Fable): row 139 ticked shipped (batch C, `7d3ac4c0`); row 152 noted running; N.198 (row 156, not on this schedule) shipped `54c01bc3`; row 157 added to `QUEUE.md` and not placed here (DESK DEFAULT: with meta 3's rows, after row 152). **The decision point of Monday 2026-10-26 (meta 2) passed with the words measure not taken: rows 117, 2a, 105, and 2b are unticked, so the measure is below 9 of 10 by default, and the question (what colleagues get on the 30th) is owed to Dann by the next desk, one question.**
