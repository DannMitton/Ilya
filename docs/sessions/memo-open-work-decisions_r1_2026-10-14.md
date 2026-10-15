# Open work: what each item is, and what keeping or dropping it means

Prepared 2026-10-15 for Dann Mitton. Read-only investigation of branch `Shane` at `50a5f85`, working tree clean, on branch `cloud-lane-6`. Nothing in `docs/memory/` or the source was edited. This memo does not recommend keeping or dropping anything. Those calls are yours.

## How to read the sections

Each section has five parts: (1) what it is, (2) what it is for, (3) where it stands, (4) what dropping it costs, (5) a size if kept. Three terms recur. The **Loupe** is the magnified one-measure view. A **seat** is the pairing of one syllable with one note. **homr** is the program that turns a picture of music into notes.

States are "built", "part built", or "not built", checked against the code in this branch. Where a record line and the code disagree, the section says so. A size appears only where the record gives a basis; otherwise it reads NOT ESTABLISHED. Paths without a folder are in `docs/memory/`.

Where the trackers and the code disagree, the largest cases are: N.172 and N.123 are built though `STATE.md:67` lists N.172 as open (N.123 is built with its caveat struck); N.19 is built in Insights though the register lists it open; row 71 is built on the `cloud-lane` branch, not in this one.

## Group A: numbered product work (23 items)

### N.173. How Insights chooses what to say (the curation rules)

(1) What it is: the rules deciding which moments in a song Insights comments on and which it leaves silent, so a short song gets few.

(2) What it is for: Dann numbered it 2026-09-24 23:45: "a great starting place but we need to keep working this." A living draft, not ruled. On 2026-09-28 he said "yes" to one set of gates for Markup and Insights, with a trial threshold of 2. (OPEN.md:414-420; draft-curation-rules:115)

(3) Where it stands: part built. The gates and threshold 2 are in code (apps/web/src/lib/analysis/gates.ts:56-63). The rules as a whole stay unruled (STATE.md:66). His 2026-10-14 walk found six pages too long (INBOX.md:227).

(4) If dropped: the gates stay; the finer selection he asked for on 2026-10-14 does not happen. Nothing waits on it: SEQUENCE.md has no N.173 entry.

(5) If kept: NOT ESTABLISHED

### N.172. The singer says how experienced they are (Dreyfus, five stages)

(1) What it is: in the Insights intake, the singer rates themselves on five-point scales (top, bottom, passaggi, sustained notes, soft high singing, acoustics terms), and Insights adjusts. Changeable at any time.

(2) What it is for: Dann, 2026-09-24 23:14: "we can adopt Dreyfus categories in our new intake section." He ratified the intake in both languages on 2026-09-25 (14:27 to 14:51) and ruled "Not sure" is an answer (23:22). (OPEN.md:433-455)

(3) Where it stands: built, as per-area scales, not one global stage. Fields: packages/score-parser/src/analysis-types.ts:115-136. Novice-versus-expert test: apps/web/src/lib/insights/comments.test.ts:223-228. Dann walked them 2026-10-09 (OPEN.md:2928). STATE.md:67 still shows it open: record and tree disagree.

(4) If dropped: singers lose the self-rating; every comment uses the middle default. Nothing in the record waits on it (SEQUENCE.md searched).

(5) If kept: NOT ESTABLISHED

### N.168. Insights intake: filling the three stores

(1) What it is: Insights draws on three stores: facts from the voice literature, principles for what it says, and connections linking a condition in the score and voice to a comment. This item fills them from the books.

(2) What it is for: Dann numbered it 2026-09-23 17:29: "ASAP." (OPEN.md:487-520; STATE.md:71)

(3) Where it stands: part built. Three comment kinds fire: sustained, turning, closed [u] (apps/web/src/lib/insights/comments.ts:190). The record's done-when, every frequent region covered, is not met. The record says the first slice shipped as de802cd (SCHEDULE-archive.md:140-142); that sha is not in this checkout.

(4) If dropped: the three comments stay; no more are added. Markup's watch box stays empty on «Скучай» and Sunless 1 until this supplies passaggio advice (draft-curation-rules r5). Nothing else waits on it.

(5) If kept: NOT ESTABLISHED

### N.123. The cycle dose and its falsetto caveat

(1) What it is: one line on Insights counting how often the vocal folds contact over the piece: "Your vocal folds contact about {n} times as you sing this piece," split by working zone.

(2) What it is for: Dann ruled it a named, cited figure (OPEN.md:182-198) and struck the falsetto caveat 2026-09-30 22:04: "Strike the caveat" (OPEN.md:180). On 2026-10-11 19:15 he closed part 2: "I do not want the two marks back on the new chart." (OPEN.md:3031)

(3) Where it stands: built; the caveat is struck, not missing. The line prints (apps/web/src/lib/insights/singer-blocks.ts:310-311). No code mentions falsetto. QUEUE.md:99 calls its location unestablished; the 22:04 ruling answers that.

(4) If dropped: singers lose the contact count. Nothing in the record waits on it; SEQUENCE.md:140-142 says N.123 feeds N.124, which needs the aggregation layer already built.

(5) If kept: NOT ESTABLISHED

### N.170. Outside reviewers

(1) What it is: a plan to watch singers use Ilya, book a design critique (ADPList), get a code-structure review, then sort the findings.

(2) What it is for: Dann numbered it 2026-09-24 15:54: "We have developed Ilya in a silo and I want to call on outside eyes." At 21:03 he ruled: "I don't want to freeze this stage of the build," and to wait three weeks "until Ilya has really taken shape." (OPEN.md:467-484; SCHEDULE-archive.md:161)

(3) Where it stands: not built. No packet or review build in the record. Steps 3 and 4 sit in the week of 2026-10-26 (SCHEDULE.md:55-58).

(4) If dropped: no outside findings on controls for new users, colour, or code structure. Step 7, building from the findings, waits on it (OPEN.md:467-484). Nothing else in SEQUENCE.md waits on it.

(5) If kept: NOT ESTABLISHED

### QUEUE row 47. Octave line for your range

(1) What it is: Insights and Markup read the voice line an octave up or down to fit your typed range, say so in one quiet line with a circled 8, and one tap returns to the song as written.

(2) What it is for: Dann, 2026-10-08 01:11 to 01:20: on high voices browsing low anthologies, "let it benefit" them. The upward direction is his; the quiet line, circled 8, and tap are the desk's, which he accepted. (brief-code-octave-for-your-range_r1_2026-10-08.md:7-17)

(3) Where it stands: not built. Only a downward reading exists (packages/score-parser/src/vocal-octave.ts:89). No octave.readLower key in apps/web/src. QUEUE.md:32 says started, not completed.

(4) If dropped: a high voice browsing a low song is not shown it read for their range; Markup keeps its long notice. Only row 48 is queued after it (QUEUE.md:33).

(5) If kept: NOT ESTABLISHED

### QUEUE row 48. Tempo estimate and control

(1) What it is: every song gets a tempo, estimated from the metre when none is printed (60 to 72 felt beats a minute, as a range), plus a control to change it.

(2) What it is for: Dann, 2026-10-08 01:28 to 01:40: that when nothing is printed Ilya still returns a tempo the singer can edit. On 2026-10-14: "We must not declare indefensible statements with confidence." He named Jeanne Lamon as fallback authority; her written source is NOT ESTABLISHED. (QUEUE.md:33)

(3) Where it stands: not built. Insights still prints "no tempo" (apps/web/src/lib/insights/InsightsPane.svelte:280). No tempo.change key in apps/web/src. tempo-seam.ts:19 still says "abstain."

(4) If dropped: scanned songs keep the no-tempo sentence and no seconds; singers cannot set a tempo. Corrections slice 8 waits on it (SCHEDULE.md:66).

(5) If kept: NOT ESTABLISHED

### N.92 remainder. Notation editing

(1) What it is: fixing a misread score in the loupe (magnified measure). Remaining: four marks (staccato, tenuto, fermata, breath), a tie to the note before, and a page flag for a measure left over-full.

(2) What it is for: Dann numbered N.92 on 2026-08-24. On 2026-09-17 he ruled the marks by one test (each changes how long the voice sounds) and agreed to flag an overstuffed measure (spec-n92-edit-surface_r1_2026-09-17.md 4.2, 4.3; OPEN.md:1530-1533)

(3) Where it stands: not built. No mark field in apps/web/src/lib/score/correction.ts. Ties run forward only (apps/web/src/lib/score/entry.ts:283-293). The loupe says "over" (Loupe.svelte:2173); the page draws no flag.

(4) If dropped: none of the three; N.152 playback is stated to draw on the marks (OPEN.md:1549).

(5) If kept: the audit gives units, not days (S is an hour or less, M an evening): tie S, page flag M, first mark M, each further mark S (memo-n92-edit-audit:84-96).

### N.151. The measure edit surface, with insert

(1) What it is: editing a measure note by note, including inserting a note at a caret (the small arrow between notes), and getting the edited score back out as a copy.

(2) What it is for: Dann ruled 2026-09-17: "Ideally a corrected score comes back out of Ilya, but we conceded that it is an edited copy." The number is a desk default; the spec calls N.151 "retired" in favour of N.92, while STATE.md:92 keeps it. (OPEN.md:1522-1546; spec lines 7-9)

(3) Where it stands: part built. Insertion exists (apps/web/src/lib/score/correction.ts:66-76; CorrectionSurface.svelte:539-541). The edited-copy export is NOT ESTABLISHED: the audit could not read what the binder export holds. The printed edits line is absent.

(4) If dropped: insertion stays; the edited-copy export and printed line do not come. N.152 playback is placed after it (OPEN.md:1549).

(5) If kept: NOT ESTABLISHED

### N.162: a caret and a note compete for the same thumb

(1) What it is: in the Loupe (the magnified one-measure view) a caret is the small mark between two notes where a syllable can be inserted. A tap near one can land on the neighbouring note instead.

(2) What it is for: it was split off when Dann closed N.153 rather than keep it open for this (`docs/memory/STATE.md:82`). The number is a desk default, not Dann's. The spec is not written.

(3) Where it stands: not built. `nearestTarget` still pools notes and carets and picks the closest centre (`apps/web/src/lib/score/loupe.ts:174`; `Loupe.svelte:2126`). Centres sit 15.6 to 21.4 px apart (`STATE.md:82`).

(4) If dropped: a phone singer can miss a caret. Nothing in the record waits on it: I looked in SEQUENCE.md:225, SCHEDULE.md, and QUEUE.md.

(5) If kept: NOT ESTABLISHED

### N.140: the Loupe scrolls sideways instead of shrinking the notation

(1) What it is: a measure too wide for the Loupe window keeps its note size and scrolls sideways. Still open: whether the sideways swipe may share the surface with a tap (places a syllable) and a downward swipe (dismisses).

(2) What it is for: Dann, 2026-09-14, over the desk's advice to do nothing: *"a contextual horizontal scroll with notation remaining at a pre-set point size seems preferable to shrinking the contents?"* (`OPEN.md:627-650`).

(3) Where it stands: part built. The sideways scroll is in the tree (`apps/web/src/lib/score/Loupe.svelte:2695-2704`). The gesture question and the pixel floor are Dann's to rule (`OPEN.md:674-677`).

(4) If dropped: a wide future measure could draw below the approved size; the scroll never fires on today's scores (SEQUENCE.md:149). Nothing else waits on it (SEQUENCE.md, QUEUE.md searched).

(5) If kept: NOT ESTABLISHED

### N.141, remaining increment: one squircle across a tie, a barline, and a system break

(1) What it is: the squircle is the lavender outline round the note being examined. One outline would cover both notes of a tie, open at the edge where the music continues.

(2) What it is for: Dann, 2026-09-15: *"the tied note is one entity, so the squircle could capture the primary note and its subsequent tied value(s)"* (`OPEN.md:1005-1015`). He ruled that an open edge means the note continues. A melisma keeps one outline per note.

(3) Where it stands: not built. The tie rule it needed shipped as `c868540`. I found no tie handling in the ring code (`MarkupPane.svelte:356`; `selection-ring.ts`).

(4) If dropped: a tied note keeps a closed outline, which Dann flagged on T05 measure 84 (`OPEN.md:1045`). Nothing else waits on it: I looked in SEQUENCE.md:148 and SCHEDULE.md.

(5) If kept: NOT ESTABLISHED

### QUEUE row 5: Corrections slices 4 to 6 (moving the correction code out of the page file)

(1) What it is: no change a singer sees. The note-correction code (tuplet row, rest and tie actions, keys) moves out of the 6,003-line `+page.svelte`.

(2) What it is for: Dann, 2026-09-26 00:21: *"release stable code with a clear documented architecture"*, and 00:25, option 3: Code does hotspot refactors on his machine (`brief-code-audit-correction-station_r2_2026-09-27.md:45-53`).

(3) Where it stands: part built. Slices 1 to 3 are in the tree (`undo-history.svelte.ts`, `correction-cursor.svelte.ts`); their shas (`QUEUE.md:34`) are not in this branch's history. `handleRest`, `handleTie`, `tupletOpen`, and the key handler remain in `+page.svelte:1088,1103,1139,4160`.

(4) If dropped: the page file stays large. Plan slice 5, the new Corrections panel, needs it (`plan-corrections-build_r1_2026-10-08.md`), and slices 6 to 11 follow. The Guide rewrite (N.84) and N.170 wait on plan slice 6 (`SCHEDULE.md:51-52`).

(5) If kept: NOT ESTABLISHED

### N.157: replacing a score keeps the old seats

(1) What it is: a seat is the pairing of one syllable with one note. When a singer swaps in a corrected score file, old seats keep their old text, and a note the new file adds gets no syllable.

(2) What it is for: found after Dann spent an afternoon on what looked like a one-character fix, a missing full stop; desk-default number (`OPEN.md:2227-2234`). The shape of the fix is the desk's inference, his to wave off (`OPEN.md:2247`).

(3) Where it stands: not built. `mergeOnUpload` still returns the existing map untouched (`apps/web/src/lib/score/pairings.ts:389-405`). No source file mentions N.157. The desk hand-patched his library once (`STATE.md:87`).

(4) If dropped: after a replacement the underlay can disagree with the poem. Nothing in the record waits on it: I looked in SEQUENCE.md, QUEUE.md, and SCHEDULE.md.

(5) If kept: NOT ESTABLISHED

### N.160 steps 4 and 5: the work and its two views

(1) What it is: groundwork the singer does not see. Step 4 stops saving IPA and vowel with each new placement. Step 5 saves poem positions, then verses.

(2) What it is for: Dann's model, 2026-09-21: one work, a text joined to a music, with Text and Markup as two views of it (`PRODUCT.md:700-737`). Steps 4 and 5 are dated after the 2026-10-30 release (`OPEN.md:2315-2316`).

(3) Where it stands: not built, and not yet due. A stored seat still carries `ipa` and `vowel` (`pairings.ts:113-115`). Steps 1 to 3 closed 2026-09-21 (`46ac52f`, per `OPEN.md:2310`).

(4) If dropped: songs stay single-verse in storage, and new seats keep the extra stored fields. Nothing in the record waits on it: I looked in SEQUENCE.md, QUEUE.md, and SCHEDULE.md.

(5) If kept: NOT ESTABLISHED

### N.166 with QUEUE row 13: the first reload of a stored scan

(1) What it is: a song made from a scan is re-read by homr (the program that turns a picture of music into notes) at its first reopen. The singer waits, up to about a minute.

(2) What it is for: found by the desk 2026-09-22, desk-default number (`OPEN.md:2480`). Row 13 measures where the time goes and changes nothing (`QUEUE.md:38`).

(3) Where it stands: part built. A reading is now kept with the song and reused when the stamp matches (`omr/restore.ts:5-8,41`). The record says first reload 44 s, later 0.4 s, (commit `bbe524b`, absent from this branch's history; `QUEUE.md:38,67`). The first-reload time is unmeasured.

(4) If dropped: that wait stays. Nothing in the record waits on it: I looked in SEQUENCE.md and SCHEDULE.md:68.

(5) If kept: NOT ESTABLISHED

### N.177: a dynamics layer

(1) What it is: a singer adds and edits dynamic marks (p, f, hairpins) over the vocal line, and Ilya shows those already in a MusicXML file.

(2) What it is for: the desk offered, and Dann ruled in on 2026-10-01 02:39: *"I think this is ready for a brief when the time comes. Yes, number this accordingly."* A piano dynamic arrives only as a suggestion marked "from the piano" (`OPEN.md:2719-2726`).

(3) Where it stands: not built. The parser still skips dynamics (`packages/score-parser/src/musicxml-parser.ts:1002-1004`). I found no dynamic or hairpin code in `apps/web/src` or `packages/*/src`. It follows N.120 (`STATE.md:60`).

(4) If dropped: no dynamics layer, and Insights lacks dynamics for forecasts (`OPEN.md:2726`). Corrections slice 8, the singer's own marks, waits on it (`SCHEDULE.md:66`). N.178 follows it (`STATE.md:61`).

(5) If kept: NOT ESTABLISHED

### N.178: tempo words and dynamics read from scans

(1) What it is: when Ilya reads a scanned or photographed score, it also picks up printed tempo words (Moderato) and dynamics, not only notes.

(2) What it is for: Dann, 2026-10-01 02:37 and 23:06: *"this is new essential functionality that we need to build and install."* It is a research item, measured on real pages before any accuracy is promised (`OPEN.md:2719-2724, 2788`).

(3) Where it stands: not built. `STATE.md:61` says tempo words and dynamics from scans are unbuilt. The reader reads clef, key, metre, beams, and rests, per the spec (`OPEN.md:2724`). MusicXML tempo words are read (`musicxml-parser.ts:399`).

(4) If dropped: a scanned song prints "This score states no tempo" while the print says Moderato (`QUEUE.md:33`). Nothing else waits on it: I looked in SEQUENCE.md, SCHEDULE.md, and QUEUE.md.

(5) If kept: NOT ESTABLISHED

### N.120: the tempo control

(1) A small control where the singer sets a tempo for the song. Without it Ilya estimates or abstains from phonation time in seconds.

(2) Dann, 2026-09-10: the Tempo station overrides what Ilya reads, "nothing hidden". Dann, 2026-09-23 01:07, moved it into the Loupe (the close-up note editor): "Join me in the present" (OPEN.md:235-239, 233).

(3) Not built. The tempo-setting function takes an override (`packages/score-parser/src/tempo-seam.ts:368`, `:412`), but MarkupPane passes none (`apps/web/src/lib/markup/MarkupPane.svelte:759-761`). The pointer string "You may assign tempi manually using the Loupe" is written (`apps/web/src/lib/i18n.ts:1696`) and used nowhere else in the tree (grep). Record and tree agree.

(4) A singer cannot set a tempo. N.177 and N.178 follow N.120 in dependency order (OPEN.md:2724). SEQUENCE.md:130 lists it as "the station grammar itself". Row 48 overlaps it (QUEUE.md:33, :97).

(5) NOT ESTABLISHED

### QUEUE row 71: N.182, how Ilya suggests a key

(1) What it is: Insights offers up to three keys instead of one better key. Each line names only what differs for this singer, in plain fractions ("about a third"), with a "Try this key" button.

(2) What it is for: Dann designed it 2026-10-11 13:38 to 14:09 and ruled the key lines 23:14 to 23:20 (`docs/memory/OPEN.md:3035`). He put it on hold at 23:00 (`docs/memory/QUEUE.md:31`).

(3) Where it stands: built on another branch, not this one. Commit `0bb644b` on `origin/cloud-lane` adds `key-suggest.ts` and `key-lines.ts`. Its report says the new strings are proposed and the French is owed. This branch keeps the single search (`apps/web/src/lib/insights/singer-page.ts:174`).

(4) If dropped: singers keep the single better key. Nothing in `SEQUENCE.md` or `QUEUE.md` names row 71 as a prerequisite.

(5) If kept: NOT ESTABLISHED. The work exists; the merge and the French remain.

### QUEUE row 9: voice type slice B, the courtesy check

(1) Under the Range field, a quiet note appears if the typed range reaches past what Boldrey gives for the declared voice type. The singer may dismiss it.

(2) Dann, 2026-09-30: courtesy verification (23:23), "Yes to the consistency check, I love it" (23:35). He ratified the copy at 12:32 (`docs/sessions/draft-voice-type-slice-b-copy_r1_2026-09-30.md:40`; OPEN.md:2579).

(3) Not built. No `voiceType.check` key exists in `apps/web/src`. The margins it uses are built (`apps/web/src/lib/voice/engine/plausibility.ts:124-125`). The brief waits for the pooled norms table r2 (QUEUE.md:37); only r1 exists (`docs/sessions/draft-voice-type-norms_r1_2026-09-30.md`).

(4) A singer who mistypes a range, such as a tenor writing an octave high, gets no prompt. Draft N.182 Principle 6 names this check as where a label-and-range mismatch is noticed. SCHEDULE.md:67 lists it as waiting on r2.

(5) NOT ESTABLISHED

### QUEUE row 91: reflexive -ся and -ться per Grayson

(1) Reflexive verbs sung in Russian: the ending -ся sounds with a hard "s", and the [ʌ] of -ться is restored toward [ɑ] when the singer asks for fuller vowels.

(2) Dann, 2026-10-12 20:33: "I defer to Grayson" (OWED.md:150-151). The desk read Grayson pp. 109, 128, 282, 284.

(3) Not written. The tree has one table of -ться and -тся, both giving `tːsʌ` (`packages/phonology/src/engine.ts:322-324`). No rule for a bare -ся appears (grep of `packages/phonology/src`). I could not run the engine: node_modules is absent here, so the soft-s output in OWED.md:150 is the record's claim.

(4) Ilya's output differs from Grayson on the consonant and the vowel, as the desk read him. Nothing in the record waits on it (SEQUENCE.md, SCHEDULE.md and QUEUE.md searched for row 91).

(5) NOT ESTABLISHED

### N.84: the Guide rewrite

(1) The Guide is rewritten, in English and French, for the interface as it now is, with new screenshots and the ratified fry essay.

(2) Dann, 2026-10-01: the walkthrough shape, then "Make the other two now" (01:02). The record says it starts once Corrections slice 6 is walked (SCHEDULE.md:51).

(3) Not done. The stale words stand in `apps/web/src/lib/components/Reading/GuideContent.svelte`: "Fit" at :61, :74, :277, :347, :361, :564; "Transcription tab" and "four tabs" at :94, :123, :381, :410. French "tractus vocal" is still at :46. The record's line numbers match the tree. Row 97 removes "Fit" and sits on `origin/cloud-lane-5` (`00517a0`), not in this tree.

(4) Singers read the wrong tab and document names. The fry essay (N.174), the tessituragram paragraph, the walkthroughs, and N.175 videos wait on it (OPEN.md:2701, :2711).

(5) NOT ESTABLISHED (SCHEDULE.md:51: "Its size is NOT ESTABLISHED")

## Group B: old residue (13 items)

### N.45, the remainder of "Transcribe's mobile content view"

(1) On a phone, the Text page was to read as one scrolling document rather than separate sheets. What "the remainder" means is not written anywhere.

(2) Dann's N.45 ruling "keeps the pages in the DOM and removes only the seam" (`ENVIRONMENT.md:897-898`). The line for the remainder is empty (`OWED.md:631`).

(3) Not established. The seam rule it left behind is gone: `Paper.svelte:121-125` says N.73 portrait C put discrete sheets back (record: done, `2f14d73`, `LOG.md:2065`). The only loose end named is a "track switch offered and never answered" (`OWED.md:713`).

(4) Nothing in the record waits on it (`SEQUENCE.md:30-33`: "none of them blocks another"). A singer loses nothing identifiable.

(5) NOT ESTABLISHED.

### N.51, the accent colour past the tab bar

(1) Whether the colour of one tab (sage for Text) may appear in other parts of the screen.

(2) Dann's "record" ruling, session E.43 (`OWED.md:718`). It is listed as a question still unsettled (`OWED.md:650`). The number is ambiguous: its title names a "Fit surface", which the record says was removed (`OWED.md:718`; `c2a01b3` is not in this clone).

(3) Open as a question, not built. On 2026-09-13 Dann ruled that a band takes the hue of the idea it holds (`plan-colour-story_r1_2026-09-13.md:17-20`); the record never links that to N.51. Sage is used at 113 places in `apps/web/src`.

(4) Nothing in the record waits on it (`SEQUENCE.md:30-33`; `OWED.md:718` calls the row moot).

(5) NOT ESTABLISHED.

### N.17, viewport repair (screen height on phones)

(1) Three screen areas are sized to the full browser height, which on a phone can include the part behind the browser's own toolbars.

(2) Numbered in session E.37, 2026-08-10, as "viewport repair" (`OPEN.md:2680`). The register says "partly a no-op as ruled" (`OWED.md:698`); the ruling itself is not in this repository.

(3) Not built. Three `100vh` remain: `apps/web/src/routes/+layout.svelte:15`, `apps/web/src/routes/+page.svelte:5884` and `:5889` (the last two inside a narrow-screen rule). The record agrees (`LOG.md:676`).

(4) Nothing in the record waits on it (`SEQUENCE.md:30-33`).

(5) NOT ESTABLISHED.

### N.19, the calibration date

(1) The date a voice was calibrated, printed where the singer can see it.

(2) Ruled to print, session E.36 section 7.4 (`OWED.md:699`). The desk's default, which Dann had seen, joins the date to Insights' title line, "which would close N.19" (`OPEN.md:1476`).

(3) The register says OPEN, but the tree shows it built in Insights. The Insights title line reads "calibrated {date}" (`i18n.ts:1595`), composed at `apps/web/src/lib/insights/identity.ts:28`; code comments say it closes N.19 (`CalibrationWizard.svelte:168-169`). Not checked in a browser.

(4) Dropping the item removes no code: the date stays on Insights. Text and Markup print no calibration date. Nothing in the record waits on it (`SEQUENCE.md:30-33`).

(5) NOT ESTABLISHED.

### N.61, the watch as a capture device

(1) A question: could a smartwatch's microphone record the voice for Ilya?

(2) Listed OPEN, "a question rather than a feature" (`OWED.md:720`). The number is ambiguous: the record never ties it to Dann's 2026-08-24 smartwatch question (`INBOX.md:36`), though the subject matches. Ilya's "watch band" in Markup is unrelated.

(3) Not built. A 2026-10-01 research note says a watch cannot hand audio to a browser; a native watch app plus a relay would be needed, "a second product" (`memo-overnight-A10-A15_r1_2026-10-01.md:66`). Dann has not ruled.

(4) Nothing in the record waits on it (`SEQUENCE.md:30-33`). Phone and laptop microphones remain the capture path.

(5) NOT ESTABLISHED.

### N.6, stems of notes on ledger lines

(1) Notes written above or below the staff would get engraving-book stem lengths: stems reaching the middle line, shortening outside the staff, and lengthening past two beams.

(2) The record carries no ruling date or quote. The code comment says "NOT implemented from r86, recorded for N.6" (`staff-renderer.ts:1803`), citing Gould rules 86 and 87; I did not open the rule file.

(3) Not built, and the record agrees (`OWED.md:757`). Every stem uses the flat 3.5 stave-space length (`staff-renderer.ts:1808`, used at `:1934`).

(4) Nothing in the record waits on it (`SEQUENCE.md:30-33`). A singer keeps stems slightly off the engraving book's convention.

(5) NOT ESTABLISHED.

### N.122, the capture surface as a landmark

(1) In the voice-calibration wizard, the singing screen would open inside the summary table, so the table stays visible while you sing.

(2) Dann, 2026-09-10: a surface "people will respond well to"; he wants it as a visual landmark "that stays available to view" (`OPEN.md:248-258`). Drawn as `docs/sessions/drawing-calibration-surface_r1_2026-09-10.html`.

(3) Not built. The wizard still swaps whole screens: `CalibrationWizard.svelte:1292`, `:1368` (capture), `:1459` (summary). Record: unplaced (`QUEUE.md:101`). Its gate, ratifying the drawer grammar, is recorded as owed (`SEQUENCE.md:74`) yet already ratified (`PRODUCT.md:495`).

(4) Nothing else waits on it. Plate 5 of the drawing asks four unanswered questions (`OPEN.md:265`).

(5) NOT ESTABLISHED.

### N.115, the singer moves a measure between systems

(1) Select a bar and press an arrow to push it to the next line of music or pull it to the previous one, as in Finale, with the page respacing afterward.

(2) Numbered by Dann, 2026-09-06; extended 2026-09-14 ("You could achieve some unholy collisions that way, but that was part of offering the user control," `OPEN.md:277-300`). On 2026-10-12 21:10 he set it aside: "let's leave it. If users report taste issues we will revisit this" (`OPEN.md:275`).

(3) Not built: lines hold as many bars as fit (`page-layout.ts:255-270`). The number is ambiguous: tests and `ENVIRONMENT.md:2756` use "N.115" for the closed drawer-bands work.

(4) Nothing in the record waits on it; it sits last in its tier (`SEQUENCE.md:115`). A lone final bar stays alone.

(5) One afternoon for the narrower lone-last-bar fix only (`OPEN.md:275`); NOT ESTABLISHED for the full control.

### N.117, a progress bar while Ilya loads

(1) A bar shown during the few seconds the page takes to load on reload.

(2) Dann, 2026-09-07 late, on a walk: "consider a placating message"; then a second mention: "a PROGRESS BAR for the load, not a message" (`INBOX.md:103-104`, `OPEN.md:318-323`).

(3) Not built. What the bar would measure is NOT ESTABLISHED (`OPEN.md:321`; `SEQUENCE.md:134`). The wait indicator in the tree, `ReadingWait.svelte`, covers reading a scanned score (`ReadingWait.svelte:2-4`), not the page load. The dictionary-loading string is unused (`IntakePanel.svelte:533`).

(4) Nothing in the record waits on it; "Independent and small" (`SEQUENCE.md:134`). The singer sees no sign of loading.

(5) NOT ESTABLISHED.

### N.27, the silent save

(1) If the browser refuses to save a voice profile (storage full), the singer is never told.

(2) Numbered in the E.38 slate; Dann's prohibition against adding a second silent save site stands (`CONTRACT.md:125`). The register gates N.28 and N.29 on it (`OWED.md:701`).

(3) Not built. `saveStore` catches the failure and drops it (`profileStore.ts:282-289`). The song save already reports (`library.ts:336-358`), whose comment records the fix and says "NOT BUILT HERE". The two messages needed already exist in the code (`library.ts:351-353`).

(4) Nothing waits on it per the tree; the register says it gates N.28 and N.29 (`OWED.md:701`). Singers lose a warning on a full-storage failure.

(5) NOT ESTABLISHED.

### N.28, exporting to a file

(1) Writing your work out to a file you can keep, move, or give someone else.

(2) Registered as "Export: one voice, all voices, the unexported mark, pseudonymous" (`OWED.md:702`); it ships on the N.67 step 5 binder (`STATE.md:108`). The copyright question is to be revisited before the door is built (`OWED.md:702`).

(3) Part built, and the scope is ambiguous. The song binder exists: "Export all songs" (`RootPanel.svelte:173`, `exchange.ts:83`); the record says it was walked by Dann (`LOG.md:2248`). No voice-profile export exists (no match in `apps/web/src`). The register's "voice" could mean songs or profiles; the record does not say.

(4) N.29, import, is listed with it (`OWED.md:703`). Without it, voice profiles cannot be moved between devices.

(5) NOT ESTABLISHED.

### N.59 step 3, the brace rule

(1) When Ilya reads a scanned score, the rule picks the sung staff: in a three-staff system the staff outside the piano brace is the voice.

(2) Dann's rule, quoted in Fable's brief: "THE STAFF NOT IN THE BRACE IS THE VOICE" (`reader.py:795`); N.60 records it ruled 12 August 2026 (`OWED.md:719`).

(3) Written, not done. Code exists in Ilya's own reader (`tools/e16-harness/reader/reader.py:783`) but "has never once fired" and returned the piano on one piece (`LOG.md:3741`). The scan reader now defaults to homr; the old reader runs only with `?reader=ilya` (`ScoreUploader.svelte:257-259`). N.59 was parked, answered no, 2026-08-18.

(4) Nothing in the record waits on it (`SEQUENCE.md:30-33`). Scans do not use the rule by default.

(5) NOT ESTABLISHED.

### Chrome on iPhone cannot install to the home screen

(1) A singer using Chrome on an iPhone cannot add Ilya as a home-screen app; the install banner never appears there.

(2) The record notes this as "named and never ruled" (`OWED.md:623-626`; `ENVIRONMENT.md:1042-1047`: Dann uses Chrome on his iPhone). The record disagrees with itself: `STATE.md:107` says "Dann to rule", while `LOG.md:660` and `OWED.md:626-627` say "CLOSED AS KNOWN, no build". Who closed it is not named.

(3) Not built, as stated. `InstallPrompt.svelte:82` excludes Chrome and Firefox on iOS. I did not test the claim about Chrome itself.

(4) A Chrome-on-iPhone singer uses Ilya fully in the browser but cannot install it; no steering copy exists (`LOG.md:660-662`). Nothing else waits on it.

(5) NOT ESTABLISHED.

## Summary table

| Item | What it is | State | What dropping costs |
|---|---|---|---|
| N.173 | Rules deciding which moments Insights comments on | part built | Gates stay as built; finer selection for long, repetitive Insights pages is not pursued. |
| N.172 | Singer rates own experience; Insights adjusts its comments | built | Singers lose the self-rating questions; every comment would use the middle default. |
| N.168 | Fill Insights' stores of sourced voice facts and comments | part built | Three comment kinds remain; no further sourced advice for other moments. |
| N.123 | Cycle dose line; falsetto caveat struck | built | Singers lose the fold-contact count line; the falsetto note was already struck. |
| N.170 | Singers watched; outside design and code critique | not built | No outside review findings; later builds from those findings do not happen. |
| Row 47 | Voice line read an octave up or down for your range | not built | Songs outside your range keep the as-written reading; upward reading never exists. |
| Row 48 | Estimated tempo for every song, plus a control to change it | not built | Scanned songs show no phonation seconds; Corrections slice 8 (singer's tempo marks) cannot start. |
| N.92 remainder | Four singer's marks, tie to previous note, page flag for over-full measure | not built | Singers cannot add those marks or tie backward; playback (N.152) loses the marks. |
| N.151 | Insert at a caret; edited score exported as a copy | part built | Insertion stays; no edited-copy export or printed edit line; playback (N.152) follows it. |
| N.162 | Taps near a caret in the Loupe can land on a note instead | not built | Singers on phones can mis-tap carets; nothing else in the record depends on it. |
| N.140 | Loupe scrolls sideways at a fixed note size instead of shrinking | part built | Scrolling already works; dropping leaves the gesture conflict and the size floor unruled. |
| N.141 tie | One squircle spans a tied note, open where the music continues | not built | Tied notes keep closed outlines that Dann has called wrong; nothing else depends on it. |
| QUEUE row 5 | Correction code moves out of the page file; singers see no change | part built | Dropping stalls the new Corrections panel, the bar review, the Guide rewrite, and the outside-reader packet. |
| N.157 | Replacing a score file re-derives seats for the new file | not built | Replaced scores keep stale syllable text and leave a newly added note blank. |
| N.160 steps 4-5 | Stop storing IPA with seats; store poem positions, then verses | not built | Songs stay single-verse in storage; nothing else in the record depends on it. |
| N.166 + row 13 | Measure and shorten the first reopen wait for a scanned song | part built | Later reopens are fast already; the first reopen stays long and unmeasured. |
| N.177 | Singer-editable dynamics layer; dynamics read from MusicXML | not built | No dynamics anywhere; blocks Corrections slice 8 and N.178, and Insights loses a dynamics input. |
| N.178 | Read printed tempo words and dynamics from scans and photographs | not built | Scanned songs show no printed tempo or dynamics; estimates fill the tempo gap only in part. |
| N.120 | Singer-set tempo for the song, in the Loupe | not built | Singers cannot override tempo; N.177, N.178 and the Tempo station in SEQUENCE Tier 3 lose their base. |
| Row 71 | Up to three key suggestions in plain fractions | built on another branch, not merged | Singers keep the single better key; written work sits unmerged on `cloud-lane`. |
| Row 9 | A gentle note when a typed range exceeds the declared voice type's published range | not built | No prompt for mistyped ranges; the key-suggestion draft expects this check for label mismatches. |
| Row 91 | Hard -ся and restored [ɑ] in -ться, following Grayson | not built | Reflexive verbs keep the soft -ся and the unrestored vowel, against Grayson; no dependent work recorded. |
| N.84 | Guide rewritten for the current interface, English and French, with screenshots | not built | Guide keeps outdated names; fry essay, walkthroughs and video scripts wait on it. |
| N.45 remainder | Unwritten leftover of the phone page-view ruling | part built | Nothing identifiable; the seam is already gone from the tree. |
| N.51 | Whether one tab's colour may spread past the tab bar | not built | Nothing visible; the question may already be answered by the 2026-09-13 colour ruling. |
| N.17 | Screen-height units that can misfit on phones | not built | A possible phone layout misfit stays; nothing else waits on it. |
| N.19 | Calibration date printed on the page | built | Record is stale: the tree already prints it in Insights; Text and Markup do not. |
| N.61 | Whether a smartwatch could capture the voice | not built | Nothing; the phone or laptop microphone stays the only route. |
| N.6 | Gould-style shortened stems for ledger-line notes | not built | Stems on very high or low notes stay uniform length. |
| N.122 | Capture screen opens inside the voice summary table | not built | The table disappears while singing; nothing else waits on it. |
| N.115 | Hand control moving a bar between music lines | not built | Orphaned last bars cannot be fixed by hand; Dann set it aside until reported. |
| N.117 | Progress bar during page load | not built | A few seconds of blank load on reload, with no sign Ilya is working. |
| N.27 | Tell the singer when a voice profile fails to save | not built | A failed profile save stays silent; the register links it to export and import. |
| N.28 | Export of voices, with a mark for unexported work | part built | Song export exists; voice export, the unexported mark, and pseudonymous export do not. |
| N.59 step 3 | Brace rule choosing the sung staff in scans | part built | Rule is written but unproven; scans now default to another reader that does not use it. |
| Chrome iPhone install | Home-screen install unavailable on Chrome for iPhone | not built | Those singers keep the browser version; Safari singers keep the install banner. |

## What I could not establish

- **Commit history.** This checkout is shallow, 72 commits. The shas the record cites for older work (`de802cd`, `14e4cb5`, `10e090c`, `bbe524b`, `9fa49b7`, `9ebfdc0`, `7d2fcd6`, `c2a01b3`, `2f14d73`) are not in it, so those claims rest on the record's own lines, cited in each section.
- **Other branches.** I fetched `cloud-lane`, `cloud-lane-2`, `cloud-lane-3`, `cloud-lane-4`, and `cloud-lane-5` only to check three things: row 71 (on `cloud-lane`, `0bb644b`), row 97's removal of "Fit" from the Guide (on `cloud-lane-5`, `00517a0`), and whether other items sit there. I did not read them beyond that.
- **Sizes.** No item except N.92 and N.115 has a size basis in `SEQUENCE.md`, `SCHEDULE.md`, `QUEUE.md`, or the briefs. N.92's unit sizes are from `docs/sessions/memo-n92-edit-audit_r1_2026-09-17.md:84-96`; N.115's one afternoon is for the lone-last-bar fix only (`OPEN.md:275`).
- **Engine output for row 91.** The packages' `node_modules` is not installed here, so I did not run the engine on «учился» or «моюся». The soft -ся is the record's report (`OWED.md:150`).
- **A written source for Jeanne Lamon's tempo principle** (row 48): the record says none was found (`QUEUE.md:33`).
- **Whether the edited-copy export holds a re-notated score or a backup** (N.151): `apps/web/src/lib/library/exchange.ts` was not read in full.
- **N.141:** only the squircle across a tie was traced in the tree. The barline and system-break parts named in the request were not separately found in the spec or the code.
- **N.162's** 15.6 to 21.4 pixel distance is the record's figure, not re-measured.
- **Rulings not in this repository.** The session files for N.17, N.19, N.51, and N.60 (`claude/e3x-*.md`, `claude/e43-*.md`) are absent, so those rulings' own words are unread. Gould rules 86 and 87 behind N.6 were not opened.
- **Meaning of "the remainder" in N.45**, and whether N.28's "voice" means songs or voice profiles: the record does not say (`OWED.md:631`, `OWED.md:702`).
- **Where "Corrections slice 6" points** (`SCHEDULE.md:51-52`): row 5's slice 6 or the plan's slice 6. I read it as the plan's.
- **Record disagreements, left for you.** Chrome on iPhone: `STATE.md:107` says "Dann to rule" while `LOG.md:660` and `OWED.md:626-627` say closed as known. N.122's gate (ratifying the drawer grammar) is listed as owed (`SEQUENCE.md:74`) and as ratified (`PRODUCT.md:495`). N.151 is called retired in the N.92 spec and kept at `STATE.md:92`.
- **Ambiguous numbers.** N.115 is also the number of closed drawer-bands work (`ENVIRONMENT.md:2756`). N.51 and N.61 are not tied in the record to the questions they appear to name. The browser was not run, so nothing here was seen on a screen.

Item count: 36 sections, 23 in Group A and 13 in Group B. N.166 and row 13 share one section, as you listed them together; N.27 and N.28 have one each.
