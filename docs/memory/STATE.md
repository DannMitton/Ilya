# STATE — where we are

r1 draft, 2026-10-12. Updated at the close of every session; this is the handover. It holds only what is open. Closed rows, superseded floors, and the colophons of 2026-09-19 to 2026-09-22 are in `STATE-archive.md`, verbatim; the older archive is `../sessions/LOG.md`. Tripwire: over 200 lines means something failed to move.

Repository: branch `Shane`. **This file never names HEAD, and cannot.** It names a **floor**: everything below was true at or before the floor, and a tree ahead of it tells you only that work has landed since. **The push range is the check, not the memo.**

**Floor: `0b0c52a`** (2026-10-14 22:58). The earlier floors, `6c69161` (2026-10-14 01:24), `1ec2ef2` (2026-10-12 23:32), `72b564f` (2026-10-12), `9f9e896`, `9d1baa6` (2026-09-27, walked by Dann on the alias), `1987157` (2026-09-24), `f6d2184` (2026-09-22, walked in French: *"This looks as it should!"*), and the thirty-nine before them, are listed in `STATE-archive.md` and `../sessions/LOG.md`.

Ask Dann for the state in one line. Read-only git is allowed (`CONTRACT.md` section 4); asking is still the habit.

```
git -C ~/Desktop/ilya-rewrite --no-optional-locks --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-optional-locks --no-pager status --porcelain
```

---

## THE ONE THING

**The scan reader reads at least 95 of every 100 printed notes on unseen songs, on the singer's path.** Set 3 scored 93.8 (QUEUE row 76); its four low songs were opened and two fixes shipped (row 77, `b80b543`); set 4 was measured 2026-10-12 at 97.5, PASS (row 86), and song 4F then read 98.0 after row 89 (`1ec2ef2`). The goal behind it: a working beta. PDF and photograph stay in it. MIDI is OUT, ruled by Dann 2026-10-01 01:25 (`PRODUCT.md`, "Closed and not to be reopened").

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
---

## THE TRACKER

> **2026-10-14 22:26, Dann:** every `[~]` row below (shipped, not walked) is ACCEPTED without a walk as a one-time clearing of the backlog; walks resume for new work a singer would see that Dann has not seen (`QUEUE.md`, the note under "Shipped, not walked"). DROPPED the same minute: N.152 (playback) and N.175 (video walkthroughs), and QUEUE rows 6, 26, 31, 32. The Chinese translation question (INBOX 2026-09-30) was abandoned at 22:20.
> **Keep-or-drop walk from `../sessions/memo-open-work-decisions_r1_2026-10-14.md` (36 items), begun 23:13:** N.173 KEPT (23:13). N.172 CLOSED AS BUILT (23:16; walked 2026-10-09); Dann: the singer never meets Dreyfus by name, his five stages are the design principle behind expertise. N.168 KEPT (23:18), with Dann's direction to widen it by a broader harvest of texts. N.123 CLOSED AS BUILT (23:25); Dann wants the contact count always shown. Cause of its absence on «Средь шумного бала» found by the desk 23:2x: `cycleDose` returns null when the score has no tempo (`apps/web/src/lib/insights/singing-measures.ts:113-118`, DESK DEFAULT "a count without time is not a count"); that song reads as having no tempo, so the line is not drawn. Restored by QUEUE row 48 (tempo estimated from the metre, which gives the count as a range). No interim "no tempo" line (Dann 23:31, on the desk's advice: Corrections has no tempo control yet, N.120). Row 48 placed next after row 98, provisionally (DESK DEFAULT, Dann 23:31 *"Up to you"*); the whole sequence is set at the end of this review, as Dann asked. N.170 KEPT (23:32). Row 47 KEPT (23:34), both directions (the downward reading exists, `packages/score-parser/src/vocal-octave.ts:89`; the upward is the gap). Row 48 KEPT (moved up, 23:31). N.92 remainder KEPT (23:36). N.151 MERGED INTO N.92 (23:39): its remaining parts (the edited copy out, the printed edits line) travel with N.92. Dann's reason for the editing work, 23:39: *"the impetus for this is Reid's pitch/vowel/intensity triumvirate; I want to make sure the user has control over these aspects through editing just in case scans are less than 100% faithful. The user can also alter pitch for selecting one ossia from its siblings, this is intentional and has desirable consequences for Insights and Markup."* N.162 KEPT (23:41). N.140 RULED (23:43): floor 3.96 px, direction decides the gesture; a small build remains (`OPEN.md` §N.140). N.141 KEPT (23:45). Row 5 KEPT (23:45); a hotspot refactor, so on the Mac per Dann's ruling of 2026-09-26 00:25 (the desk had said cloud lane, corrected). **2026-10-15:** N.157 KEPT (00:23); Dann asked whether the desk can do it autonomously: yes, by the cloud lane, his part the merge and ship; a placement whose word leaves the new text is kept and counted, as `mergeOnUpload` already treats an orphaned seat (`pairings.ts:380-386`), DESK DEFAULT; placed in the sequence when the walk ends. N.160 steps 4 and 5 KEPT (00:26), after the release as dated. N.166 with row 13 KEPT (00:27); row 13 to run in the cloud lane (DESK DEFAULT); the memo's claim that `bbe524b` is absent is wrong (`git merge-base --is-ancestor` true, 2026-10-15). N.177 KEPT (00:28). N.178 KEPT (00:28). N.120 KEPT (00:29); row 48's song-wide control first, N.120 adds changes inside the song in the Loupe (desk's proposal). Row 71 KEPT (00:30): rebuilt fresh from `Shane` in the cloud lane against `OPEN.md` "ROW 71's KEY LINES, RULED", not merged from `cloud-lane` (DESK DEFAULT); desk drafts the French for Dann's ruling. Row 9 KEPT (00:30); its blocker, the pooled norms table r2, is desk work. Row 91 KEPT (00:32); desk ran the engine 2026-10-15 (cloud clone at `0b0c52a`, no stress dictionary): учился `utʃʲiɫsʲɑ`, моюся `mojusʲɑ`, so the soft -ся stands; no commit touches `packages/phonology` since 2026-10-12. N.84 KEPT (00:32), Dann: *"we really need this"*; captions still say four tabs and Fit (`GuideContent.svelte:96`, `:386`), the fry essay is not seated, « tractus vocal » at `:46`. N.45 remainder DROPPED (00:33), overtaken by N.73 portrait C. N.51 DROPPED (00:33), answered by the colour ruling of 2026-09-13. N.17 KEPT (00:34), three lines in the cloud lane, then one look on Dann's phone. N.19 CLOSED AS BUILT (00:35); seen by the desk on the alias in Insights' header 2026-10-15 00:18. N.61 DROPPED (00:35), a watch needs a second product. N.6 KEPT (00:38), the build opens by checking Gould pp. 14 and 15 against rules 86 and 87 (the extract is a paraphrase of photographs; the pages are not in the repository); Dann owes two photos when convenient. N.122 KEPT (00:39), after the release; plate 5's four questions go to Dann one at a time when it is next. N.115 DROPPED (00:39), per his 2026-10-12 21:10 set-aside; revived only by singers' reports. N.117 KEPT (00:41), Dann: *"use the same visual vocabulary"*: the page load takes the reader wait's stave squircle (`ReadingWait.svelte`); placed after the trimming audit, then the remaining load is measured; closes if nothing worth showing remains. N.27 KEPT (00:42). N.28 (voice half) with N.29 KEPT (00:43), after N.27; Dann's reason: *"This functionality will help teachers with large studios; they can import students' formant profiles done remotely and use them to research suitable repertoire"*; the copyright question (OWED.md:702) goes to him before Code starts. N.59 step 3 DROPPED (00:44); his brace rule stays the test of a homr misread under THE ONE THING. Chrome on iPhone KEPT (00:45): Chrome for iOS saves web apps to the home screen since July 2023 (9to5Mac 2023-07-14), so the fix is the banner (`InstallPrompt.svelte` excludes `CriOS`); Chrome's steps checked on Dann's phone before shipping.

Marks: `[ ]` open · `[D]` Dann's to rule · `[~]` shipped, not walked, or parked. Specs live in `OPEN.md` (from 2026-09-13); build order in `SEQUENCE.md` (from 2026-09-15; six dependencies fix the order and everything else floats); the week plan in `SCHEDULE.md`; debts and unsettled questions in `OWED.md` (from 2026-09-20). Every row below was checked against `git log` on 2026-10-11 19:40, and rechecked by the audit of 2026-10-14 (`../sessions/audit-memory-staleness_r1_2026-10-14.md`), unless its date says otherwise.

### Numbered 2026-10-11

- `[ ]` **N.184. Ilya reads the pre-reform spelling (ѣ, ѳ, ѵ, і) in a score's underlay.** Ruled in by Dann 2026-10-11 23:32 (*"We need this capability"*); DESK DEFAULT number. Plan: rows 81 (baseline, measured) and 82 (a fine-tuned Russian model, READY). Spec in `OPEN.md`.
- `[~]` **N.183. The 32nd and the 64th in the editing controls (keys 2 and 1, as in Finale).** SHIPPED `fd1c86a` 2026-10-11 23:51 (QUEUE row 75); not walked. Offered by the desk 18:58 from the Mussorgsky bar; ruled in by Dann 18:59 (*"yes, add Finale's other two digits"*). DESK DEFAULT number. Spec: the brief, QUEUE row 75.

### Numbered 2026-10-09

- `[~]` **N.181. A word after «не» that the dictionary does not hold is looked up joined to «не».** Shipped `d0b65a9`; Dann's walk is not recorded. Offered by the desk 2026-10-09 01:21 from Dann's walk (*Without Sun*, no. 1: «не проглядная» drew [pro], unreduced); ruled in by Dann 01:23 (*"yes"*). DESK DEFAULT number (N.180 was struck as a duplicate of N.135). Spec in `OPEN.md`.

### Found unlisted 2026-10-02

- `[~]` **N.12, increment 2. The old spelling's endings.** Shipped `e3e2c33`; DONE is Dann's walk. Ruled in by Dann 2026-08-08 (*"let's aim for completeness"*, as `packages/dictionary/src/pre-reform-normalizer.ts:90` records it) and never built until Dann met its effect on 2026-10-02 19:40 ([go] under «шумнаго»). The desk takes his words as settling the one question the 2026-08-08 notes left open: -аго is sung as -ого. `QUEUE.md` row 25.

### Numbered 2026-10-01

- `[~]` **N.179. Clear placements by scope, and place from here (after Finale).** Shipped `a3dde11`; 'this measure' and Undo walked 2026-10-09; 'whole piece' and Place from here walked 2026-10-14 01:49 and ratified 02:56 (QUEUE row 14); 'to the end' is not walked. Ruled ready for a brief by Dann 2026-10-01 02:43; DESK DEFAULT number. `QUEUE.md` row 14.
- `[ ]` **N.177. Dynamics: a layer the singer can add and edit, and dynamics read from MusicXML.** Numbered by Dann 2026-10-01 02:39. After N.120. Spec in `OPEN.md`.
- `[ ]` **N.178. Reading tempo words and dynamics from scans and photographs.** Numbered by Dann 2026-10-01 02:39. Widened to the scan reader; first reading by homr shipped `0976735`; tempo words and dynamics from scans are unbuilt. A research item, measured on real pages before any accuracy is promised. After N.177. Spec in `OPEN.md`.
- `[ ]` **N.175. Video walkthroughs, English and French, on an Ilya YouTube channel.** Numbered by Dann 2026-10-01 01:15. Made from the finished build; the Guide links to them. Spec in `OPEN.md`.

### Numbered 2026-09-24, evening

- `[ ]` **N.173. How Insights chooses what to say: the curation rules.** Numbered by Dann 2026-09-24 23:45, a living draft, deliberately not ruled. 2026-09-25: seven sections on how Insights speaks ruled into `PRODUCT.md`; the rules themselves still a living draft, `../sessions/draft-curation-rules_r1_2026-09-24.md`; spec in `OPEN.md`.
- `[x]` CLOSED 2026-10-14 23:16 as built. **N.172. The singer says how experienced they are (Dreyfus's five stages), and Insights adjusts.** Numbered by Dann 2026-09-24 23:14. 2026-09-25: the intake is RATIFIED in both languages (14:27 to 14:51); built with N.168's first slice. Built with the first Insights connections that use the ranking, not before (the desk's placement; agreed by Dann 23:16). Spec in `OPEN.md`.

### Numbered 2026-09-23

- `[ ]` **N.168. Insights intake: filling the three stores.** Numbered by Dann 2026-09-23 17:29, *"we should engage in it ASAP."* The plan is `~/Documents/Voice Pedagogy Library/Insights Research/plan-intake_r1_2026-09-23.md` (seven steps: condition map, frequency run, coverage audit, targeted extraction, composing, Dann's vetting, encoding and tests), resting on the five Insights principles ratified the same afternoon (`PRODUCT.md`, "What Insights is for" to "How Insights stays trustworthy"). Steps 1 to 3 done, step 2 shipped `10e090c`, step 4 under way. Spec in `OPEN.md`.
- `[ ]` **N.170. Outside eyes: refine Ilya with singers and outside reviewers.** Numbered by Dann 2026-09-24 15:54; placed by Dann 2026-09-24 21:03 in weeks 5 and 6 (`SCHEDULE.md`). Seven steps, spec in `OPEN.md`; the review packet is step 2.

### Numbered 2026-09-22

- `[~]` **N.167. A French singer can sit through the whole reader wait reading English.** Shipped `350a2e5`; whether Dann saw it in French is not established. Ruled in by Dann 2026-09-22 on the desk's revised recommendation; found by Code. Code's reading of the mechanism, not established by the desk: the waiting line's text is fixed once from the `language` value in play (at the time of Code's reading; `ScoreUploader.svelte:134` is now a comment, and the tree draws the line at `:978` through `readingWait.line(language)`) and never re-translated. Dann's own screenshot the same morning showed « Préparation du lecteur de page » in French on the alias. Why it is not a tidy-up: `PRODUCT.md` §"Both languages, start to finish". Row 41 (the wait on the Paper) folds it in. Spec in `OPEN.md`.
- `[ ]` **N.163. Ilya shows a singer a word that is not on the page.** Ruled in by Dann 2026-09-22 from N.146's walk finding 4, on the desk's recommendation that it meets the freeze rule's false-statement test. The OCR read «То» as «Го», and Transcription drew it as `'go` with the gloss "go". Spec in `OPEN.md`. NOT ESTABLISHED: whether the fix belongs at the OCR layer, at the dictionary seam, or in how an unknown word is presented.
- `[ ]` **N.166. A stored scan may need the page reader to redisplay.** DESK DEFAULT number, found 2026-09-22. Established real and measured by Code 2026-09-22: `ScoreUploader.svelte:802` restores by calling `handleFile(file, restore.answers)`, which re-reads the page (one-page PDF: 3.8 s to 61.3 s). Reloads are fast after the first since `bbe524b` (first reload 44 s, later 0.4 s; QUEUE row 38); the first-reload cost remains, and row 13's measure is still owed. The string says "This will only happen once."

### Numbered 2026-09-21

- `[ ]` **N.162. A caret and a note compete for the same thumb.** DESK DEFAULT number, split off at N.153's close on Dann's ruling to close N.153 rather than hold it open for this. Measured by Code 2026-09-21: a caret's hit centre sits 15.6 to 21.4 px from the nearest note's hit centre, and `nearestTarget` pools notes and carets by nearest centre, so the catchment round a caret is about eight to ten pixels. A different mechanism from N.153's spacing (caret-to-caret now clears 44 px). Clause 13's literal words are met and its reasoning is not. NOT ESTABLISHED: whether a note must stay tappable inside Corrections. Clause 3's fallback condition may be live, and Dann hears about it before a chip row is built. Spec not yet written.
- `[ ]` **N.160. The work, and its two views.** DESK DEFAULT number; the model is Dann's (`PRODUCT.md`). Steps 1 to 3 closed 2026-09-21 (`1d18514`, `2fb7516`, `46ac52f`, each walked); the heal wrote 14 of his 96 seats and the dry run reads 91 address, 1 rejected, 4 unfound. Steps 4 and 5 wait until after 2026-10-30. Spec in `OPEN.md`, plan `../sessions/memo-n160b-the-approach_r1_2026-09-21.md`. The deferred ruling is still not asked: five notes, all «одинокая», which Code reads as possibly blocked by a seat that already holds the word; settle that before putting it to Dann.

### Numbered 2026-09-20

- `[ ]` **N.157. Replacing a score does not re-derive the seats.** DESK DEFAULT number. A replacement keeps every stored seat with its old text, never seats the note the new file adds, and `refreshPairings` updates a seat only on an exact origin match. Spec in `OPEN.md`. The desk patched Dann's library by hand once (song `39ae51c9`, key `m17-1-2`, « я » to « я. »); that is not the fix.
- `[~]` **N.156. The Sunless 01 fixture is missing its final syllable and a note.** Shipped `b53a6df` and `9801308`; whether the lyric-line disagreement defect (lines 1 and 2 disagree about «непроглядная» from measure 4; line 2 lags by one note at the end) is fixed is not established. Ruled in by Dann 2026-09-20 14:21, who chose the real fix over retagging «ка». Brief `../sessions/brief-n156-sunless01-fixture_r1_2026-09-20.md`.

### Numbered 2026-09-17

- `[x]` MERGED into N.92 2026-10-14 23:39. **N.151. The measure edit surface, with insert.** DESK DEFAULT number. Insertion is built as N.92 slice 3 (`correction.ts:48-100`, `:305-345`, `:496`, `:382-433`, reached through `CorrectionSurface.svelte:539-541`), so the item is tether 22: it exists and is hard to find. It carries nine of Dann's rulings of 2026-09-17, four of them product-level (WYSIWYG, *"if it appears on Ilya's page, it can be printed"*; no stopping rule for the singer; the edited score comes back out as an edited copy with the singer's own tempo counted; deliberate destruction only), transcribed to `PRODUCT.md` on 2026-09-22. Report `../sessions/report-n151-note-entry_r1_2026-09-17.md`. NOT ESTABLISHED: its size, and where it sits against the release.

### Numbered 2026-09-16

- `[ ]` **N.92. Notation editing.** Numbered by Dann 2026-08-24. Slices 1 to 3 shipped, insertion included; the caret reach is drawn (N.153 owned the phone). Open: the four singer's marks, tie to the note before, and the page flag for a measure left over. Spec `../sessions/spec-n92-edit-surface_r1_2026-09-17.md`, audit `../sessions/memo-n92-edit-audit_r1_2026-09-17.md`.
- `[~]` **N.152. Playback of the Markup.** LATER, its own cardinal, asked for by Dann 2026-09-17. Spec in `OPEN.md`.

### Numbered 2026-09-14

- `[ ]` **N.141. The squircle has no grammar.** The height rule closed 2026-09-21, `6101e01`, walked (*"Yes this is ideal"*); Dann amended his own one-height ruling on 2026-09-20 to get it (`OPEN.md` §N.141). Open: the squircle across a tie (no longer waits on N.142; counted zero 2026-09-24; no week carries it), and the viewBox clamp binding on two notes. DESK DEFAULT number. Spec in `OPEN.md`, including the permission to re-engrave the measure for the loupe and its cost. **His ruling of 2026-09-14, "I don't want Ilya dropping hyphens", sits at `OPEN.md:1396` inside this spec and must be rehomed before N.141 closes (`OWED.md`).**
- `[ ]` **N.140. The loupe guarantees a stave space, and scrolls rather than shrinking below it.** Dann's own design, ruled 2026-09-14, over the desk's recommendation to do nothing. Mostly built (code audit 2026-09-24, recorded on his instruction: *"That's great news, please update our records"*); only the sideways scroll against a syllable tap remains (`OPEN.md` §N.140). He owes the floor in CSS pixels, and whether the scroll may take a gesture on a surface where the swipe dismisses and the tap places a syllable.
- `[ ]` **N.135. The page reader reads the text underlay.** Ruled by Dann 2026-09-14. **Ruled a priority by Dann 2026-10-14 02:44**; the text it builds to is `OPEN.md`, "THE TEXT UNDER THE NOTES: A MIXED DEFAULT". Cost measured in `../sessions/memo-n135-ocr-measurement_r1_2026-09-14.md`. N.180's notes sit under it in `OPEN.md`. N.184 and row 81's row reader lean on it.

### Older open residue

- **Nothing blocks the beta** (2026-08-21): N.67, N.72 closed; N.58 (MIDI import) deferred by Dann 2026-08-21; N.59 (the reader in the browser) parked at tier 2, answered no, 2026-08-18. Still open inside them: N.59 step 3, the brace rule, is `WRITTEN` and not `DONE`; a singer on Chrome for iPhone can never install Ilya to the home screen (Dann to rule). Full accounts in `../sessions/LOG.md` block 10; the closed and parked table in block 9.
- **The visible list, built only if a day finishes early:** N.45's remainder · N.51 · N.17 · N.19 · N.61 · N.6. (The watch band's header was listed here as English in French mode; struck 2026-10-14 00:47 as stale: « À considérer », ruled by Dann 2026-09-28 19:48, is in the tree since `8127e01` at `apps/web/src/lib/i18n.ts`, key `watch.header`, drawn through `T()` at `MarkupPane.svelte:1032` and `:1034`, pinned by `watchlist.test.ts:557`. Dann re-ruled 2026-10-14 00:44 that it must offer French in French mode, which the tree already does.) **N.27** has a home in the tree as a comment at the reporting seam (`library.ts`, `Library.save`), recorded by N.67 step 6 and deliberately not built: when N.27 is built, `profileStore.saveStore` (`profileStore.ts:281-289`) routes through that seam; it is the last catch-and-drop of its kind. **N.28** ships on N.67's step 5 binder.
- Open work the rulings audit found not truant (N.84, N.120, N.123, N.122, N.115, N.117, the poem-box warning) is listed in `QUEUE.md`, "Open work, not truant".

---

## THE SCHEMA

1. Only blocking work gets built.
2. A new cardinal displaces a named one or waits. Say which.
3. Half of every build day is reserved for what the previous day's walk found.
4. Every build day ends in a deploy and a walk.
5. N.48 may be unclosable; it needs a `[u]` that fails.

## THE FIXTURE. Read out of the file, do not re-derive it

`~/Downloads/no-lyrics-control.musicxml` is the only instrument that exercises the no-underlay path; all three of Dann's own scores carry lyrics. It holds five pitched notes and one half rest: C4 D4 E4 F4 quarters, G4 half, then a half rest. It is NOT six notes. Its stripped lyric line was five syllables, «Я тебя любил»; its header title is a different text. The walk: transcribe some Russian (or nothing draws); switch to Fit before touching any file input; upload the control; press *Continue to analysis*; expect `5 / 5`, syllables under the notes, the rest bare, no dashed boxes (walked 2026-08-13). The print fixture (E.51): Marshak's Russian of Sonnet 90 under Kabalevsky op. 52 no. 9, fourteen lines, fills exactly two letter sheets. *(DESK DEFAULT: this section belongs in `ENVIRONMENT.md`; it stays here until moved.)*

## Rulings whose only recorded home is this file (flagged for rehoming)

**RULED 2026-08-16, on E.55's walk findings** (N.70, N.71, N.55b are closed; LOG.md blocks 9 and 10 were not checked for these lines):
- The walk's findings come before N.67 step 4, per the schema's own rule that half of every build day is reserved for what the previous walk found.
- N.70 and N.71 are numbered. The third finding, no cursor on a note, is FOLDED INTO N.71 rather than tracked: one CSS declaration on the same element as N.71's fix.
- N.55b's row is corrected rather than left tidy, Dann's words.
- The N.70 fix is Dann's own third option, better than either I posed: filtered on desktop, no `accept` at all on iOS. Named consequence, accepted: the tree's `isMobile` is a WIDTH test, so a narrow desktop window also gets the unfiltered picker.

---
*r1 draft of 2026-10-12, from `STATE.md` as of that date. What moved, and where, is in `../sessions/tidy-r1_2026-10-12/CHANGELOG_r1.md`.*

> **The tidy, 2026-10-12 about 14:50.** `CONTRACT.md`, `STATE.md`, `QUEUE.md`, and `README.md` were restructured by Fable into these shapes (drafts and change log `../sessions/tidy-r1_2026-10-12/`); everything moved went verbatim to `CONTRACT-archive.md`, `STATE-archive.md`, and `QUEUE-archive.md` beside them. Dann deferred the administrative choices to the desk at 14:48 (*"it is a managerial and administrative issue that I am happy to defer to you. If you need my ratification, you have it."*, typing corrected). The pre-tidy originals are in git history; the folder `_pre-tidy-2026-10-12/` is not on disk (desk check, 2026-10-14).
