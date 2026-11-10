# Review of every open item against this week's share

r1, 2026-11-09. Read-only review of `Shane` at `4d73284b` (cloned to `/home/claude/cr/ilya`), with `cloud-lane-34`, `cloud-lane-35`, and `cloud-lane-29` counted as IN (their tips read from GitHub: `05db2dac`, `989a6615`, `0ceeb22a`). Nothing in any repository was changed.

Method and limits are stated in section 5. In short: `STATE.md`, `SCHEDULE.md`, `QUEUE.md` (all open rows), and `INBOX.md` (all of it, the older lines in a truncated form) were read; `OPEN.md` and `OWED.md` were searched, not read through; code claims were checked by grep and are cited by file and line.

## 1. Summary

| Class | Count |
|---|---|
| IN | 10 |
| NEEDS DANN | 9 |
| AFTER | 41 table rows (several cover more than one item) |
| DROP? (proposals) | 5 |
| Built or shipped, only the tracker is stale (not a class) | 8 |

Duplicates merged: row 71 (rows 71, 139, 148, N.182), row 172 (rows 122, 132, 172), row 157 (rows 107, 132, 157 and N.198's leftovers), row 152 (N.194), N.151 into N.92, N.188 with rows 120, 124, 126, rows 191 and 146 (ossia), N.195 to N.197 with rows 153 to 155, N.183 with row 75.

Three findings change the plan and are worth reading before the tables:

1. **The scan-words reader is off for every colleague today.** It runs only when the address carries `?words=read` (`apps/web/src/lib/omr/underlay-switch.ts:19-27`, used at `apps/web/src/lib/omr/homr-reader.ts:458`). The banner that every scan gets still says "Ilya does not read the words printed in an image" (`apps/web/src/lib/i18n.ts:1169` and `:1521`). The word "preview" appears in no singer-facing string about scan words (grep of `i18n.ts`: the only hit is the macOS app named Preview, `:1217`). So "scan words ship as a preview" is not built; it is IN-1 below.
2. **`STATE.md` has no section called THE SHARE.** Its first section is THE ONE THING (row 181's reader-data work). `SCHEDULE.md` still plans for 2026-10-30 and its Meta 5 says Corrections slice 6 "gates the Guide and the share" (`SCHEDULE.md:70`, `SEQUENCE.md:31`); slice 6 is unbuilt and has no caller (grep for `barsToConfirm` and `offersForABar` outside their own files and tests finds none). That conflict is NEEDS DANN-2.
3. **The three merging lanes carry untranslated or outdated French.** `cloud-lane-29` holds English where French belongs (`i18n.ts:826` and `:2275` on the lane, marked TODO-FR) and a French Guide sentence that points to a control the app no longer offers (`GuideContent.svelte:38` on the lane). Dann ratified the French for both on 2026-11-05 (`OPEN.md:3473-3480`, `:3500`), so the seating is a small job, not a question.

## 2. The IN list, ordered by criterion, then size

Criterion 1 is a string or path that shows a colleague something false or misleading; 2 is no recovery from a scan misread; 3 is built or nearly built and needs a merge, a string, or a small fix; 4 is a Guide or Learn that cannot be true without it.

| # | What a singer would see | Source | Built state and evidence | Crit. | Reason | Size |
|---|---|---|---|---|---|---|
| IN-1 | A scan's words are read by default, and labelled as a preview wherever scan words appear (banner, receipt, TEXT). Today a colleague gets no words unless the address carries `?words=read`, and the banner says Ilya does not read words. | `STATE.md:23` (stage 2b measured); `SCHEDULE.md:31`; `underlay-switch.ts:1-37`; Dann's decision of 2026-11-09 as given in the task | Reader built and merged behind the switch (`f6c8ae43`, 2026-10-29); `homr-reader.ts:458` still gates on `underlayOn()`; the stamp comment says `UNDERLAY_READER` joins `READER_STAMP` "in the commit that removes the switch, after Dann has ratified the banner's new words" (`underlay-switch.ts:14-16`); no preview string exists. The banner for words read on some systems and not others is built (`ingest.ts:92-124`, `i18n.ts:1528-1529`). | 1 | Without it the banner lies the moment the reader is on, and a fully read but misread scan carries no caution (the partly-read banner fires only for unread bars). Also covers N.163, the word that is not on the page. | MEDIUM |
| IN-2 | French mode shows English where the Poem and Lyrics source line reads « D’après PAROLES » or « D’après POÈME », and the French Guide still tells the singer to choose Poème "dans l’onglet Texte", a control the app no longer offers. | Row 172; `OPEN.md:3473-3480`; `INBOX.md:629-630` | Lane `cloud-lane-29`: `i18n.ts:826` (French stays English, TODO-FR), `GuideContent.svelte:38` (stale French sentence). Ratified French exists. | 1 | A French colleague meets English strings and a false instruction. | SMALL |
| IN-3 | INSIGHTS offers a suggested key. In French mode its 43 `insights.key.*` strings carry the English; and the lane was built before Dann's rule of 2026-11-05 11:49 that a key shows only when it reduces the challenges. | Rows 71, 139, 148 (N.182); `OPEN.md:3484-3503` | Lane `cloud-lane-29`: `i18n.ts:2275` ("CARRIES THE ENGLISH (TODO-FR)"); `key-suggest.ts` (344 lines) has no reduce-only test (grep for reduce, fewer, trade finds only arithmetic at `:281-282`). Whether the lane can offer a key that trades one challenge for another is NOT ESTABLISHED. | 1 | English in French mode, and possibly a rule Dann ruled out. The STATE note says a Code brief for the rule is still owed. | MEDIUM |
| IN-4 | The scan path's POEM-to-LYRICS joining: band pictures, proportional positions, the Loupe's print strip on every bar with pinch zoom, "Choose a bar" with Previous and Next, the unread-bars banner tappable. | Row 181; `OPEN.md:3438` (joining items 1 to 16); `INBOX.md:604-614` | Lane `cloud-lane-34`, steps 0 to 8, tip `05db2dac`; row 114 file 1 reads 376 of 590 on the lane against 369 on `Shane` (`QUEUE.md` row 181). Step 8 reports not read in full by a desk; Fable as built not done; Dann has not played with it. | 2 | It is the colleague's way to see and repair what the reader got wrong. The next measures (B0, B0g, rank 2) are AFTER. | LARGE |
| IN-5 | Nothing visible. Corrections slice 3 keeps what the singer answered per bar. | Corrections plan; `brief-code-corrections-slice3-answers-kept_r2_2026-11-05.md` | Lane `cloud-lane-35` tip `989a6615`; the desk's read was clean (`STATE.md:23`); Fable as built owed. It has no caller yet. | 3 | Merging it changes nothing a colleague meets. It is on the list because it is being merged. | SMALL |
| IN-6 | The Inspector explains «бог» and a voiceless final before a vowel; six French blurb lines carry `ici ; une` with a space before the semicolon. | Row 157 (N.198's leftovers) | Lane `cloud-lane-29` (`c16b9b81` to `0ceeb22a`); Fable as built said MERGE WITH AMENDMENTS (`STATE.md:23`): six French implications at `data/blurb-composer.json:1766-1816` and one test pin, cherry-picks clean onto `Shane`. | 3 | French typography fault inside a merge that is ready. | SMALL |
| IN-7 | TEXT follows INPUT's Poem or Lyrics pill; the pair on TEXT goes; one source line. | Row 172 | Lane `cloud-lane-29`, steps 0 to 4. The helper's merge trial found a conflict at `+page.svelte:4361-4367` (keep the lane's source line and `Shane`'s `witness={shown}`) (`QUEUE.md` row 132). | 3 | Built; the merge needs a hand. | MEDIUM |
| IN-8 | The GUIDE and LEARN describe the app as it is. Today the GUIDE says "Fit", "the Transcription tab", "Metadata", and "four tabs" (`GuideContent.svelte:398`, `:427`; the French figcaption at `:102`); the fry essay, the key-suggestion explanation, the teacher-as-intermediary statement (row 94), the break paragraph, and the re-shot pictures are not seated. | N.84; rows 97, 169, 171, 90, 94; `INBOX.md:636` (voice profile first), `OPEN.md:3506-3515` (six jobs) | Not built. `GuideContent.svelte` is 640 lines; grep for the intermediary statement finds none. Row 171's brief (r1, not Fable-reviewed) is folded in here: the Wednesday rewrite makes a separate names audit unnecessary, but its guard test idea (`retired-names.test.ts`) stands. | 4 | Guide and Learn cannot be true without it. | LARGE |
| IN-9 | The Guide's licence paragraph names the HEIC decoder and its licences, in both languages. | Row 159; `INBOX.md:461-463` ("We credit and attribute as best as we are able") | Ratified 2026-10-28 15:28 (`ratified-guide-heic-licences_2026-10-28.md`); HEIC support shipped `fb2d2e37`; grep for heic, libheif, libde265 in `GuideContent.svelte` finds nothing. | 4 | A credit Dann called an obligation is absent from the shipped Guide. Do it inside IN-8's rewrite or before it. | SMALL |
| IN-10 | The frozen build: the format walk, a print walk, N.83 (one song end to end), both languages, then the move of `main` and the invitations. | `SCHEDULE.md:89-94`; `ENVIRONMENT.md:3917-3932` | Not done. `main` is 533 commits behind `Shane` (`git rev-list --count origin/main..origin/Shane`); the release is a known 90-second push of `main` and no promote step (`ENVIRONMENT.md:3919-3924`). | 4 | The share itself; also the last chance to catch what the lanes' merges break. | MEDIUM |

## 3. NEEDS DANN, one question each

| # | Question | Source | Gates |
|---|---|---|---|
| ND-1 | What are the preview label's words in English and French, and the French of the two banners that now say Ilya does not read words (`upload.banner.reader`, `i18n.ts:1169`; `upload.banner.noLyricsScan`, `:1521`)? Recommendation: one short line beside the scan receipt and in the banner, "Preview: check every word against your score." | `SCHEDULE.md:35` ("N.135's two banner strings, French to Dann"); `INBOX.md:230` | IN-1 |
| ND-2 | Does Corrections slice 6 (the mark, the line, and the review of bars to check) still gate the Guide and the share? Recommendation: no. The Loupe's Corrections station exists, row 181 adds the print strip and the unread-bars banner, and slice 6 has no code behind it. | `SCHEDULE.md:70`, `SEQUENCE.md:31`, `SEQUENCE.md:41` ("N.84 after slice 6 is walked") | IN-8 |
| ND-3 | When the reader fuses two measures (the Lamm read, measure 1 read as 29 of 8), the singer has no verb to split them (no barline verb in `correction.ts` or `entry.ts`; row 138). Build one for this share, or rely on the banner and the Loupe? Recommendation: after, and name the limit in the Guide. | `QUEUE.md` row 138; `INBOX.md:52` | Criterion 2 |
| ND-4 | Which colleagues receive the three Insights questions, and in which language? The questions are ratified in English; French waits for the names (row 119); the packet's four questions are drafted (`draft-review-packet-questions_r1_2026-10-30.md`). | `QUEUE.md` row 119; `SCHEDULE.md:66`, `:80` | The review packet (SCHEDULE Meta 6) |
| ND-5 | Do colleagues judge INSIGHTS in this share as it reads now? Repeats are still counted, "One further instance, in the score." (`i18n.ts:1822-1823`) and "One more observation" (`:2112`), which Dann disliked on 2026-10-14. The curation rules (N.173) and the explain-once pass (row 130) are unbuilt. Recommendation: say plainly in the packet that Insights prose is a draft. | `QUEUE.md` row 130; `INBOX.md:227` | SCHEDULE Meta 4 |
| ND-6 | MELODY and INSIGHTS open with only "Calibrate your voice to begin." (`i18n.ts:1468`). A colleague without a fry sample sees nothing. Row 166 (four generic profiles, every value marked a stand-in) is ratified but its brief is not written. Do colleagues calibrate, or do they get a profile of yours to load (the 2026-11-08 voice profile exists as a file)? | `QUEUE.md` row 166; `MarkupPane.svelte:22` | Whether colleagues can judge two of three documents |
| ND-7 | Which of the shipped, never walked rows do you want to look at before Thursday? Candidates: row 163 step 1 (the first open after a deploy, "not DONE until seen on a Vercel build"), rows 164, 165, 175 (the comments in the panel not seen in a browser), 176, 177, 178, 180. Walks were waived for the backlog before 2026-10-14 only. | `QUEUE.md` rows 163, 164, 165, 175 | IN-10 |
| ND-8 | LEARN's toggle wording and `binder.heading` capitals are the two items consistency batch 1 left for you (`QUEUE.md` row C1); `app.title` carries an em dash. Which wording for the LEARN toggle? | `QUEUE.md` row C1 | IN-8 (LEARN) |
| ND-9 | Nothing in the record has been walked on a treble voice or treble repertoire (`OWED.md:182-214`), and you suspect most users are sopranos. Do you want one walk with a typed range and a treble song before Thursday? Whether the calibration wizard behaves on a treble voice is NOT ESTABLISHED. | `OWED.md:182-214` | Criterion 1 risk |

## 4. AFTER and DROP?

### AFTER (real, kept, not needed for colleagues to use and judge Ilya)

Built state is "not built" unless stated. Sizes are the desk's own where one is given, else NOT ESTABLISHED.

| Id | What a singer would see | Source | Evidence and reason | Size |
|---|---|---|---|---|
| N.192 | Markup draws only the first key signature, so a song with a key change loses its later signatures. | `STATE.md:43` | Grep for key change in `staff-renderer.ts` and `musicxml-parser.ts` finds nothing; the cited `staff-renderer.ts:1680` is stale. Real, but which songs colleagues bring is NOT ESTABLISHED. Candidate for the one criterion-1 item not made IN. | MEDIUM |
| N.190 | Accidentals drawn as the print prints them, courtesies included. | `STATE.md:45`; N.102 | Not built. Cosmetic. | MEDIUM |
| N.191 with row 146 | An ossia kept whole; song 2 bars 99 to 102 draw crossing ties. | `STATE.md:44`; `QUEUE.md` row 146 | Not built; affects ossia scores only. | LARGE |
| N.189 | A system with no voice staff is the voice's bars of rest. | `STATE.md:46` | Not built. | MEDIUM |
| N.187 | Grace notes drawn and editable. | `STATE.md:50`; `musicxml-parser.ts:700-712` (skipped with a warning) | Ruled 2026-11-05 00:19 that a grace note takes no syllable. Colleagues' scores may carry them; the drop is silent. | LARGE |
| N.188 leftovers (row 124) with row 126's remainder | Accent below a stem drawn above; two slurs from one note. | `QUEUE.md` rows 124, 126 | Each "a look for Dann first". | SMALL each |
| Row 145 | Slurs with engraved shape and a span limit. | `QUEUE.md` row 145; `INBOX.md:283-284` | Cosmetic by Dann's word. | MEDIUM |
| Row 131 | A word's own hyphen («Люблю-ли») drawn as the print draws it. | `QUEUE.md` row 131 | Dann: "I don't want Ilya dropping hyphens" (`STATE.md:113`). Not re-walked since 2026-10-14. | SMALL |
| Row 132 | Wider net of time signatures for the metre reader. | `QUEUE.md` row 132 | Measure and train; Dann's yes needed per IMSLP download. | LARGE |
| Row 135 with N.90, N.99, N.100 | A measured figure for phone photographs. | `QUEUE.md` row 135 | The share can say photographs are not yet measured. Dann takes the photographs. | LARGE |
| Row 136 (N.91) | Piano doubling checks the voice's pitches. | `SCHEDULE.md:98` | Measured: reach at most 11 notes on row 114. | LARGE |
| Row 137 | A printed page takes a library-ordered file name. | `QUEUE.md` row 137 | Grep found no `document.title` set; brief owed. | SMALL |
| Row 140 | WCAG 2.2 audit, then a named level. | `QUEUE.md` row 140; `INBOX.md:250` | Ruled: claim no level before the audit. The Guide in IN-8 must not claim one. | LARGE |
| Song 3's misreads | Alto clef read on p. 13, double flat read as a flat on p. 15, p. 16's notes unread. | `SCHEDULE.md:46` | Song 3 at 84.5, three reader causes, no open row holds the double flat. | MEDIUM each |
| N.163 | A word the OCR misread is shown with a gloss. | `STATE.md:89` | Where the fix belongs is NOT ESTABLISHED. IN-1's preview label is the mitigation for this week. | NOT ESTABLISHED |
| N.166 | A stored scan may need the page reader again. | `STATE.md:90`; `ScoreUploader.svelte:802` | Later reloads measured fast (0.4 s). The first reload cost remains. | SMALL |
| N.162 | A caret and a note compete for the same thumb. | `STATE.md:94` | Spec not written; whether a note must stay tappable inside Corrections is NOT ESTABLISHED. | NOT ESTABLISHED |
| N.140, N.141 | Loupe scroll against a syllable tap; squircle across a tie. | `STATE.md:113-114` | Mostly built or specified. | MEDIUM |
| N.156 | Sunless 01 fixture's line-2 lag. | `STATE.md:100` | A fixture, not a singer path. | SMALL |
| N.160 steps 4 and 5 | The work and its two views. | `STATE.md:95` | Dated after 2026-10-30. | LARGE |
| N.92 remainder (with N.151) | The four singer's marks, a tie to the note before, a page flag for an over-full measure. | `STATE.md:108` | Slices 1 to 3 shipped; the rest is later. | LARGE |
| N.120, N.177, N.178 | Tempo control across a song, dynamics, tempo words and dynamics from scans. | `STATE.md:72-73` | Row 48 gave every song an estimated tempo. | LARGE each |
| N.168 | Insights intake: filling the three stores. | `STATE.md:83` | Steps 1 to 3 done, step 4 under way; research. | LARGE |
| N.170 steps 4 to 7 | Expert critique, code review, synthesis. | `STATE.md:84` | Begins after this share. | LARGE |
| N.193 (row 136's first brick) | Piano supports to the voice commented in Insights. | `STATE.md:34` | Ruled not for this release. | LARGE |
| N.184 with rows 81, 82, 105 | The scan reader reads pre-reform spelling. | `STATE.md:58` | Row 82's retrain and the float form are shipped; r3 and r5 did not beat r2. | LARGE |
| Row 105 r4 | A next reader model trained on photocopy-like rows. | `QUEUE.md` row 105 | r4 not Fable-reviewed; two rounds gained nothing. | LARGE |
| B0 and B0g Code brief (row 181 next) | Poem fills where the reader's count settles. | `STATE.md:19` | Measured +6 and −2 of 590 per syllable. Needs Fable's session first. | MEDIUM |
| Row 158 step 2 | Reader review of TrOCR and PaddleOCR. | `QUEUE.md` row 158 | Desk reading done; measures wait. | LARGE |
| Row 112 | Region rule: a poem block on a score page. | `QUEUE.md` row 112 | Today the first page decides the file (`ScoreUploader.svelte:280-299`). | MEDIUM |
| Row 150 | Text-seating design (three tiers for a scan's differing word). | `QUEUE.md` row 150 | Ratified; briefs wait. Partly overlaps row 181. | LARGE |
| Row 182 | 92 aria texts for the poem library, then 17 more. | `QUEUE.md` row 182 | Brief r1, not Fable-reviewed; lane `cloud-lane-37` not cut. | MEDIUM |
| Row 179 | An edited gloss keeps its language and is reused. | `QUEUE.md` row 179; `library.ts:122` | READY (Fable-reviewed r3). A French reader sees a singer's English edit only after that singer edits one. | MEDIUM |
| Row 174 | Move `+page.svelte`'s blocks out. | `QUEUE.md` row 174 | Mac lane; ruled after consistency batches. | LARGE |
| Rows 100, 99 | Chrome-on-iPhone install banner (`ios_chrome_body: null`, `InstallPrompt.svelte:41`, `:104`); the `write-failed` sentence. | `QUEUE.md` rows 99, 100 | Strings owed to Dann; the iPhone menu path is checked first. | SMALL |
| Row 155 remainder, N.197 | Fonts from Google (`app.html:46-49`) and jsDelivr in the content policy (`vercel.json:37`). | `QUEUE.md` row 155 | Ruled after the share; fonts move layout and print. | MEDIUM |
| Row 155's 24 `upload.*` keys newly unread | Dead strings. | `QUEUE.md` row 155 | Dann's to keep or drop. | SMALL |
| Rows 9, 167, 168; N.28, N.29, N.98 | Courtesy check on voice type; seven generic profiles; the voice profile card. | `QUEUE.md` rows 9, 167, 168 | Row 168 waits on a copyright question (`OWED.md:702`). | LARGE |
| Row 169, N.116, N.175 | Text convention across Learn; Learn as a book; video walkthroughs. | `QUEUE.md` row 169; `STATE.md:74` | N.175 was dropped 2026-10-14; the other two follow the Guide. | LARGE |
| Row 107 | Wider Clear warning. | `QUEUE.md` row 107 | Dann's question first; not built. | SMALL |
| Period switch and the eight-offer follow-ups | Poem period toggle (3.2). | `INBOX.md:639`; `OPEN.md:3521` | Design owed; parked 2026-11-08 22:14. | MEDIUM |
| Untracked INBOX asks | A bigger sign that a dropped file arrived (2026-10-20 20:39 to 20:41); daylight between key and meter signature in the Loupe (15:42); a click on a key signature opens the Loupe's key controls (20:44); pointers from Insights to Learn passages (2026-10-26 15:36 to 15:38; `further-reading.ts` holds no Learn pointer); a phoneme-cluster difficulty measure (2026-10-26 16:34). | `INBOX.md:287-289`, `:280`, `:424-427` | Grep of `OPEN.md`, `QUEUE.md`, `STATE.md` finds no row for these. Kept; Dann may rule any of them in. | SMALL to MEDIUM each |

### DROP? (proposals for Dann to rule)

| Id | What | Later ruling or code | Source |
|---|---|---|---|
| Rows 161 and 162 | Second look and syllable-break briefs. | Both came back REDESIGN and are parked; the successor, row 160, shipped `e5bad5a6`. | `QUEUE.md` rows 160 to 162 |
| Row 82's r3 brief | Fine-tune a pre-reform model. | Retrain shipped `01b638a`; row 105 is the next model and r3 and r5 both failed to beat r2. | `QUEUE.md` row 82; `SCHEDULE.md:30-32` |
| Row 111 | The poem repairing a scan's words. | Folded into row 181's joining design and its tiers (`OPEN.md:3438`; `INBOX.md:604`). | `QUEUE.md` rows 111, 181 |
| Row 147 | A check that every printed ё carries its dieresis. | Dann 2026-11-08: "Ilya already restores the dieresis on every ё" (`OPEN.md:3513`; `INBOX.md:638`). Not measured by the desk. | `QUEUE.md` row 147 |
| Row 148 (older held brief for row 71) | Superseded brief r2. | r3 is the build (merged here as IN-3). | `QUEUE.md` row 148 |

### Built or shipped, only the tracker is stale (not counted)

Row 122's receipt label (`apps/web/src/lib/score/format-label.ts` exists and is called at `ScoreUploader.svelte:650`); row 170's MELODY rename (`i18n.ts:222`); rows 163, 164, 165, 175, 176, 177, 178, and 180 are shipped per `QUEUE.md`, only unwalked. `QUEUE.md` still reads "Not written" on rows 170 and 122.

## 5. What I could not establish

- **No section THE SHARE exists in `STATE.md`.** I took the week's plan from the task text and `SCHEDULE.md` (whose dates are 2026-10-30 and stale).
- **I read `OWED.md` and `OPEN.md` only by index and search.** `OWED.md` lines 20 to 1023 hold many older debts; I classified only the ones the INBOX or QUEUE pointed to (the treble-voice walk, the Clear warning, row 168's copyright question). Others, for example the nine live N.146 walk findings (`OWED.md:215-271`), are not classified and are most likely AFTER.
- **INBOX lines 23 to 74 (August) were not re-read**; their items were already curated on 2026-10-01 (`inbox-curated_r1_2026-10-01.md`) and 2026-10-14 (`memo-open-work-decisions_r1_2026-10-14.md`), neither of which I opened. Lines 75 to 274 were read at 230 characters, lines 275 to 560 at 210; a request hidden beyond those cuts could be missing.
- **What the three lanes contain beyond their diffs.** I counted them IN as instructed and read only file lists and the TODO-FR lines. Whether `cloud-lane-29`'s key suggestion can show a trade (IN-3) is untested. Whether `cloud-lane-34`'s step 8 reports hold open defects is unread.
- **Whether any of Dann's three songs or the row 114 set carries a key change, a grace note, or an ossia**, which would raise N.192, N.187, and N.191 into criterion 1.
- **Why nothing in the repository says the reader is ready to be the default.** Row 114's 376 of 590 (64 percent) is below THE TARGET's 9 of 10, so the preview label carries the honesty; I did not measure photographs.
- **Walk state of shipped rows.** Many are "Not walked"; I cannot say any of them works on the alias.
- **No test or build was run.** All built-state claims come from reading files and git.
