# STATE — where we are

r1 draft, 2026-10-12. Updated at the close of every session; this is the handover. It holds only what is open. Closed rows, superseded floors, and the colophons of 2026-09-19 to 2026-09-22 are in `STATE-archive.md`, verbatim; the older archive is `../sessions/LOG.md`. Tripwire: over 200 lines means something failed to move.

Repository: branch `Shane`. **This file never names HEAD, and cannot.** It names a **floor**: everything below was true at or before the floor, and a tree ahead of it tells you only that work has landed since. **The push range is the check, not the memo.**

**Floor: `234eff3f`** (2026-10-27 14:07, Dann's ship of N.194 r5: the merge `fec528d2` of `cloud-lane-15` at `9b348b3e`, then the notes and the lever 2 report; all eight gates at baseline on the Mac, gate 4 3231; pushed; Vercel `dpl_5ZDB8Hf5jA68nCL5qY2LSD2mqYzT` READY, read through the connector 14:4x). Before it, `0d42e658` (2026-10-26 23:23, the Fable close; its docs-only build CANCELED by the Ignored Build Step, as set), `54c01bc3` (2026-10-26 21:54, N.198), and **`7d3ac4c0`** (2026-10-26 20:38, Dann's merge of `cloud-lane-13` at `a76ced77`, batch C, rows 139, 151, and the «ну-те» entry; all eight gates at baseline on the Mac, gate 4 3012; pushed; Vercel `dpl_9Zyhi8ukpdKNfj9LuWABvPMAV69T`). Before it, `71410f18` (2026-10-26 20:27, the Opus close), `de5e96d0` (2026-10-26 15:00), and `b488bef9` (2026-10-20 15:2x, Dann's ship: the merge of `cloud-lane-12` at `5840aae3`, rows 129, 133, 141, 142, 143, 144, 148, 149, with the desk's notes; all eight gates at baseline, gate 4 2943, gate 5 775). Before it, `dbb97773` (2026-10-20 11:56, Dann's ship: the fast-forward to `6d2bdcfc`, row 128, with the batch briefs and reviews; all eight gates at baseline, gate 4 2865, gate 5 756). Before it, `c68f9a0f` (2026-10-20 02:58, Dann's ship: the merge `209aaeb1` of `cloud-lane-11` at `d3bc6e4`, row 127; gate 4 2862, gate 5 756). Before it, `4e56cea8` (2026-10-19 23:28, the desk close). Before it, `885986ff` (2026-10-19 23:14, Dann's ship: the merge `7b448f52` of `cloud-lane-11` at `61c4e68`, rows 123, 126, 125, with the desk's late notes; all eight gates at baseline, gate 4 2850, gate 5 753). Before it, `99b78c08` (2026-10-19 21:4x, Dann's ship: the fast-forward to `a6f9e3a`, N.188 and row 121, with the desk's evening notes; all eight gates at baseline, gate 4 2847, gate 5 744). Before it, `ba6f0647` (2026-10-19 19:0x, the desk close). Before it, `e58fdabc` (2026-10-19 15:24, Dann's ship: row 108 with its follow-up, the hyphen Guide line, truth kit r2; the ship script commits only after all eight gates at baseline, gate 4 2842). Before it, `4f3bb38d` (2026-10-19 11:2x, Dann's ship: the merge of `cloud-lane-11` at `c838a04`, then the desk's close; all eight gates at baseline, gate 4 2802). Before it, `d3adabe` (2026-10-18 23:49) and `28ee53e0` (2026-10-18 18:50). The earlier floors, `f80836e7` (2026-10-18 18:43), `78bfb39` (2026-10-16 12:19), `01b638a` (2026-10-15 22:5x), `263aa48` (2026-10-15 22:37), `1e76bae` (2026-10-15 16:04), `b21ce8a` (2026-10-15 11:11), `0b0c52a` (2026-10-14 22:58), `6c69161` (2026-10-14 01:24), `1ec2ef2` (2026-10-12 23:32), `72b564f` (2026-10-12), `9f9e896`, `9d1baa6` (2026-09-27, walked by Dann on the alias), `1987157` (2026-09-24), `f6d2184` (2026-09-22, walked in French: *"This looks as it should!"*), and the thirty-nine before them, are listed in `STATE-archive.md` and `../sessions/LOG.md`.

Read the state yourself from the bridge and report it in one line; ask Dann only if the bridge cannot reach it (Dann 2026-10-20 12:32; `CONTRACT.md` §2). From the bridge:

```
git -C "$HOME/mnt/ilya-rewrite" --no-optional-locks --no-pager log -1 --format="%H %cI"; git -C "$HOME/mnt/ilya-rewrite" --no-optional-locks --no-pager status --porcelain
```

---

## THE SHARE (from 2026-11-09; this section wins over everything below it)
**CLOSE OF THE 2026-11-24/25 OPUS DESK** (Opus 5; opened 22:29, Dann present throughout to 00:58; four helpers, never more than two at once; he asked for a fresh thread at 00:58). **THE NEXT DESK STARTS HERE.**

**Floor: `66dfb5f9`** (2026-11-25 00:26, Dann's ship of N.221: the true merge `65196e65` of `cloud-lane-88` at `cc3775e2`, then the night's records; all eight gates at baseline on the Mac, **gate 4 `6944 passed | 1 skipped (6945)` and gate 5 `913 passed | 5 skipped (918)`, both moved by the desk before the run**, backup `~/Downloads/ilya-ship.sh.bak-6857-2026-11-25`; pushed `16644c42..66dfb5f9`). Before it `16644c42` (N.219), `7bf8e6b1` (N.218, lane 89 merged), `51e8a27e` (N.217), `5594904b` (the behaviour baseline).

**BOTH TIER 4 LANES ARE IN `Shane`. Nothing is blocked behind them.** Lane 89 shipped as N.218 at 22:10, which `STATE.md` did not know when this desk opened and which the desk found by reading the tree. Lane 88 took a round 4 on Fable's five fixes, then shipped as N.221.

**THE ONE THING: the five walks of N.220, storyboarded from the running build, not from the design documents.** Vercel builds `66dfb5f9` because it carries code; when it goes READY, walk Ted's path and the other four in Dann's Chrome and write what the beats actually are. `CONTRACT.md` section 0.3 is why: a storyboard written from source is the failure that rule records.

**DANN RULED THE GATE, 2026-11-24 22:49**, transcribed as written: *"The gate is being able to walk the four use cases successfully, and repeat with shifting variables that still work."* **It replaces every earlier reading of what "accurate" means, and it supersedes `DANN.md` D7 as a question**: he set the real gate, so ruling N.204's plan against a separate one is no longer his to do. **The four use cases are the four roads a text takes in**, ratified by him at 23:02: typed Russian; a photographed poem; a `.musx` or MXL file; the words printed under the notes of a scanned score.

**N.220 IS OPEN** (`OPEN.md`, the three sections at the foot): the five walks, the coverage frame, and how a screencap is framed. Walks 1 to 4 are his four characters of 2026-10-31 with two amendments; **walk 5 is new and is the one his own position rests on**, a deliberately rough scan repaired with the Loupe, Syllables, and Corrections. **Marie is amended** because the profile card is N.28 and N.29 and sits after the release; she creates the student's voice herself and carries the eight declared types against ONE song. **He ruled at 23:12 that friction is the colleagues' to report, not his**, so walk 5 tests only that the repair path COMPLETES.

**FOUR RATIFICATIONS TONIGHT.** The slur-evidence sentence, English 00:03 and French 00:05, replacing the clause that was false wherever it fired. `tempo.hint`'s English 00:56, *"Your tempo. Everything Ilya reports follows it."*, with the French unchanged. The screencap framing, 00:33 and 00:39: a plain rectangle, the squircle inside as the callout, in one of GUIDE's own hues.

**TWO FABLE UNITS READ AND FILED: j and l.** `../sessions/read-fable-n204-unit-j_r1_2026-11-25.md` (29 files, 5,453 lines; 216,957 tokens, 16 tool uses, 5.0 min) and `..._unit-l_r1_2026-11-25.md` (55 files, 13,106 lines; 630,541 tokens, 53 tool uses, 11.6 min, over its 560k cap by 70k). **Five Fable units remain: c, i, k, m, n**, with i still behind N.200; o and the tests are Sonnet's. **The plan's own table at `plan-code-audit-maintainability_r10_2026-11-24.md:357-358` is stale: it lists e and f as "ready" and they were read on 2026-11-24.**

**TWO LANES OWED, NEITHER BRIEFED.** (1) **Strings only, no behaviour:** the three text-batch items, plus the slur-evidence pair. (2) **Ilya stops saying things that are not true:** unit l's D2, the tempo seam, which carries the newly ratified `tempo.hint`; and D1's condition, where *"Nothing in this piece is flagged for your voice."* can print above a MOMENTS squircle of observations.

**N.173 IS REBUILT, NOT PATCHED** (Dann 00:56: *"pleaase see that is is well-copnstructed and effective"*). Its only draft is `../sessions/draft-curation-rules_r1_2026-09-24.md`, two months old, predating the two-decider finding, the gates, the blank states, the WYSIWYG ruling, and his redundancy design of 2026-11-22. **DESK DEFAULT, his to overrule:** D1's narrow fix lands before the gate; the arbiter is designed as N.173 and lands after, where he placed the rule set on 2026-11-22.

**OPEN FOR DANN, ASKED AND NOT ANSWERED:** about 1,300 lines of `insights/` are computed on every page and drawn by nothing (the "half the singing" bracket, the centre of gravity, the passaggio-crossings count, the fit table). Three are measures he ruled in and the page stopped drawing them in round 2 on 2026-10-11. Three paths with their costs are in unit l's read, section 9; **the desk's recommendation is to delete the drawing code and keep the three pure measures marked "computed, not drawn".** It gates unit l's L1 and L2.

**THE SEVEN RATCHET CEILINGS CAN COME DOWN NOW** that both tier 4 lanes have landed, measured on the merge: Drawer 1990 to 1986, InspectorPanel 2432 to 2396, LearnContent 4099 to 4097, pipeline 901 to 896, ScoreUploader 867 to 865, pairings 1422 to 1372, CalibrationWizard 1126 to 1124. **The eighth the desk expected, `musicxml-parser`, is not among them.**

**THREE DESK FAULTS, each recorded where it bites.** The desk over-dramatized a measurement, calling item 7 of the done-when a programme when half of it is one helper job and the other half is explicitly not a gate (he named it: *"I made the cheap half look expensive and the non-blocking half look like a blocker"*). It argued against a freeze date that had been struck on 2026-11-22, taken stale out of `STATE.md`, and repeated a pace error the desk had already withdrawn. It offered him a method he had already applied to that exact question on 2026-11-22, against `CONTRACT.md` section 1 item 6a. A fourth, smaller: it typed a 6.5 kB brief into the Code box and every newline sent it (`ENVIRONMENT.md`, A NEWLINE SENDS THE CODE PROMPT).

**ONE RECORD STRUCK, AND IT WAS THE DESK'S.** The held text-batch item rested on a claim that MELODY's count takes in provisional and unstable readings where the VOICE pane's does not. Both apply the same test, `isSung`, over the same ten vowels. **They are the same number and there was no wording to repair.**

**USAGE, his screenshots 22:30 and 00:26:** week 53 then 57 per cent, Fable 56 per cent of its own allowance which is up to half the week, credits CA$0, monthly cap CA$140.36 of CA$141.54, all resetting Sunday 04:00. **He ruled at 00:26: *"Fable is not scarce... It exists to be used."*** The binding constraint is the shared pool the desk itself draws on.

---



## THE ONE THING

Whatever the first paragraph under THE SHARE says it is. The closes of 2026-11-05, 2026-11-08 (evening and night), and 2026-11-09 moved to `STATE-archive.md`, verbatim, on 2026-11-14 (the 200-line tripwire).

## THE TRACKER

> **2026-10-14 22:26, Dann:** every `[~]` row below (shipped, not walked) is ACCEPTED without a walk as a one-time clearing of the backlog; walks resume for new work a singer would see that Dann has not seen (`QUEUE.md`, the note under "Shipped, not walked"). DROPPED the same minute: N.152 (playback) and N.175 (video walkthroughs), and QUEUE rows 6, 26, 31, 32. The Chinese translation question (INBOX 2026-09-30) was abandoned at 22:20.
> **The keep-or-drop walk of 2026-10-14 and 2026-10-15 (36 items) moved to `STATE-archive.md` on 2026-11-21, verbatim**, under `README.md`'s closing step 1. Its two rulings with no other home were rehomed first: N.28 and N.29 to `OPEN.md`, row 97's Guide pictures to `OWED.md`. Open items it kept are in the tracker below; the ones it dropped are gone.

Marks: `[ ]` open · `[D]` Dann's to rule · `[~]` shipped, not walked, or parked. Specs live in `OPEN.md` (from 2026-09-13); build order in `SEQUENCE.md` (from 2026-09-15; six dependencies fix the order and everything else floats); the week plan in `SCHEDULE.md`; debts and unsettled questions in `OWED.md` (from 2026-09-20). Every row below was checked against `git log` on 2026-10-11 19:40, and rechecked by the audit of 2026-10-14 (`../sessions/audit-memory-staleness_r1_2026-10-14.md`), unless its date says otherwise.

### Numbered 2026-11-13 to 2026-11-15

- `[ ]` **N.202. Ilya's name and its version** (the sigil carries the name alone; the version, 2026b, in the footer, the GUIDE, exported files, and the citation; the letter advances each time `main` moves). Ruled by Dann 2026-11-15 13:31; in the release; `PRODUCT.md`, last section; `OPEN.md`, N.202; QUEUE row 193.
- `[ ]` **N.203. VOICE: the intake, its summary, and its place in the DRAWER.** Opened 2026-11-15 18:3x on Dann's messages of 18:13 and 18:14; nothing ruled; the desk is questioning him one question at a time; `OPEN.md`, N.203.
- `[ ]` **N.201. The DRAWER's order** (REPERTOIRE first and folding, ANALYSIS its own band with NOTATION as its first row, a word tap opens ANALYSIS). IN THE TASK LIST, displacing nothing (Dann 2026-11-14 20:36); design: the board as amended by Fable's review. QUEUE row 188. `OPEN.md`, last section.
- `[ ]` **N.200. Ilya encounters the voice as it is** (the extractor measures without priors). `PRODUCT.md`; QUEUE row 186; Steps 0, 1, 2, 3, and 7 SHIPPED `93bf8394` 2026-11-15 (lane 52); Step 4, Dann at the microphone, is next.
- `[ ]` **N.199. The Calibrate redesign.** Steps 0 to 7 SHIPPED `d32429c1`; lane 53 running (QUEUE row 187); Steps 8 and 9 wait on N.200. `OPEN.md`.

### Numbered 2026-10-21

- `[ ]` **N.193. Ilya notices the piano staff's supports to the voice (a doubling, a dynamic, an accent first; a motif, an onomatopoeic passage, dissonance, and harmonic support later) and comments on them in Insights by bar number, drawing none of the piano part.** Asked for by Dann 2026-10-20 23:57; NOT for the 2026-10-30 release (ruled 23:59); DESK DEFAULT number. First brick QUEUE row 136. Spec in `OPEN.md`.
- `[ ]` **N.197. Ilya loads nothing from outside services at run time.** Ruled in 22:08; DESK DEFAULT number. QUEUE row 155, NOT WRITTEN; waits on Dann's answer about `?reader=ilya`.

### Numbered 2026-10-19

- `[~]` **N.188. The reader keeps a note's markings (accents, staccati, and the rest), and Markup draws them.** SHIPPED in `99b78c08` (QUEUE row 120); Dann's look at song 1 found bar 10 (row 126). Asked for by Dann 2026-10-19 12:51; DESK DEFAULT number. Spec in `OPEN.md`.
- `[~]` SHIPPED `eba49310` 2026-11-15 (lane 50, QUEUE row 190); not walked. **N.192. Markup draws a key change where the score changes key** (today only the first key is drawn, `staff-renderer.ts:1680`). Found by the audit 2026-10-19; DESK DEFAULT number. Spec in `OPEN.md`.
- `[ ]` **N.191. An ossia in the voice line is kept whole; the singer chooses, and Markup and Insights follow the choice.** Asked for by Dann 2026-10-19 13:28; DESK DEFAULT number. Spec in `OPEN.md`.
- `[ ]` **N.190. Markup draws the accidentals as the print prints them, courtesies and redundancies included, and Corrections can change only what is drawn.** Asked for by Dann 2026-10-19 13:09; DESK DEFAULT number. Spec in `OPEN.md`.
- `[ ]` **N.189. A system with no voice staff is the voice's bars of rest**, in the truth and in the reader. Found by Dann 2026-10-19 12:49; DESK DEFAULT number. Spec in `OPEN.md`.

### Numbered 2026-10-18

- `[~]` SHIPPED `eba49310` 2026-11-15 (lane 50, QUEUE row 190); not walked; three engraving collisions owed a brief. **N.187. Grace notes are drawn on Markup and editable in Corrections, and never counted in the bar's sum.** Ruled by Dann 2026-10-18 21:32 to 21:34; DESK DEFAULT number. The sum already leaves them out (`metre-witness.ts:169`); the parser drops them (`musicxml-parser.ts:706-708`), so nothing draws them. Finale's handling polled before the Corrections slice; Gould's pages owed by Dann as photographs. Spec in `OPEN.md`, "THE AUDIT OF 2026-10-18".

### Numbered 2026-10-11

- `[ ]` **N.184. Ilya reads the pre-reform spelling (ѣ, ѳ, ѵ, і) in a score's underlay.** Ruled in by Dann 2026-10-11 23:32 (*"We need this capability"*); DESK DEFAULT number. Plan: rows 81 (baseline, measured) and 82 (a fine-tuned Russian model, READY). Spec in `OPEN.md`.

### Numbered 2026-10-01

- `[ ]` **N.177. Dynamics: a layer the singer can add and edit, and dynamics read from MusicXML.** Numbered by Dann 2026-10-01 02:39. After N.120. Spec in `OPEN.md`.
- `[ ]` **N.178. Reading tempo words and dynamics from scans and photographs.** Numbered by Dann 2026-10-01 02:39. Widened to the scan reader; first reading by homr shipped `0976735`; tempo words and dynamics from scans are unbuilt. A research item, measured on real pages before any accuracy is promised. After N.177. Spec in `OPEN.md`.
- `[ ]` **N.175. Video walkthroughs, English and French, on an Ilya YouTube channel.** Numbered by Dann 2026-10-01 01:15. Made from the finished build; the Guide links to them. Spec in `OPEN.md`.

### Numbered 2026-09-24, evening

- `[ ]` **N.173. How Insights chooses what to say: the curation rules.** Numbered by Dann 2026-09-24 23:45, a living draft, deliberately not ruled. 2026-09-25: seven sections on how Insights speaks ruled into `PRODUCT.md`; the rules themselves still a living draft, `../sessions/draft-curation-rules_r1_2026-09-24.md`; spec in `OPEN.md`.

### Numbered 2026-09-23

- `[ ]` **N.168. Insights intake: filling the three stores.** Numbered by Dann 2026-09-23 17:29, *"we should engage in it ASAP."* The plan is `~/Documents/Voice Pedagogy Library/Insights Research/plan-intake_r1_2026-09-23.md` (seven steps: condition map, frequency run, coverage audit, targeted extraction, composing, Dann's vetting, encoding and tests), resting on the five Insights principles ratified the same afternoon (`PRODUCT.md`, "What Insights is for" to "How Insights stays trustworthy"). Steps 1 to 3 done, step 2 shipped `10e090c`, step 4 under way. Spec in `OPEN.md`.
- `[ ]` **N.170. Outside eyes: refine Ilya with singers and outside reviewers.** Numbered by Dann 2026-09-24 15:54; placed by Dann 2026-09-24 21:03 in weeks 5 and 6 (`SCHEDULE.md`). Seven steps, spec in `OPEN.md`; the review packet is step 2.

### Numbered 2026-09-22

- `[ ]` **N.163. Ilya shows a singer a word that is not on the page.** Ruled in by Dann 2026-09-22 from N.146's walk finding 4, on the desk's recommendation that it meets the freeze rule's false-statement test. The OCR read «То» as «Го», and Transcription drew it as `'go` with the gloss "go". Spec in `OPEN.md`. NOT ESTABLISHED: whether the fix belongs at the OCR layer, at the dictionary seam, or in how an unknown word is presented.
- `[ ]` **N.166. A stored scan may need the page reader to redisplay.** DESK DEFAULT number, found 2026-09-22. Established real and measured by Code 2026-09-22: `ScoreUploader.svelte:802` restores by calling `handleFile(file, restore.answers)`, which re-reads the page (one-page PDF: 3.8 s to 61.3 s). Reloads are fast after the first since `bbe524b` (first reload 44 s, later 0.4 s; QUEUE row 38); the first-reload cost remains, and row 13's measure is still owed. The string says "This will only happen once."

### Numbered 2026-09-21

- `[ ]` **N.162. A caret and a note compete for the same thumb.** DESK DEFAULT number, split off at N.153's close on Dann's ruling to close N.153 rather than hold it open for this. Measured by Code 2026-09-21: a caret's hit centre sits 15.6 to 21.4 px from the nearest note's hit centre, and `nearestTarget` pools notes and carets by nearest centre, so the catchment round a caret is about eight to ten pixels. A different mechanism from N.153's spacing (caret-to-caret now clears 44 px). Clause 13's literal words are met and its reasoning is not. NOT ESTABLISHED: whether a note must stay tappable inside Corrections. Clause 3's fallback condition may be live, and Dann hears about it before a chip row is built. Spec not yet written.
- `[ ]` **N.160. The work, and its two views.** DESK DEFAULT number; the model is Dann's (`PRODUCT.md`). Steps 1 to 3 closed 2026-09-21 (`1d18514`, `2fb7516`, `46ac52f`, each walked); the heal wrote 14 of his 96 seats and the dry run reads 91 address, 1 rejected, 4 unfound. Steps 4 and 5 wait until after 2026-10-30. Spec in `OPEN.md`, plan `../sessions/memo-n160b-the-approach_r1_2026-09-21.md`. The deferred ruling is still not asked: five notes, all «одинокая», which Code reads as possibly blocked by a seat that already holds the word; settle that before putting it to Dann.

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

---
*r1 draft of 2026-10-12, from `STATE.md` as of that date. What moved, and where, is in `../sessions/tidy-r1_2026-10-12/CHANGELOG_r1.md`.*

> **The tidy, 2026-10-12 about 14:50.** `CONTRACT.md`, `STATE.md`, `QUEUE.md`, and `README.md` were restructured by Fable into these shapes (drafts and change log `../sessions/tidy-r1_2026-10-12/`); everything moved went verbatim to `CONTRACT-archive.md`, `STATE-archive.md`, and `QUEUE-archive.md` beside them. Dann deferred the administrative choices to the desk at 14:48 (*"it is a managerial and administrative issue that I am happy to defer to you. If you need my ratification, you have it."*, typing corrected). The pre-tidy originals are in git history; the folder `_pre-tidy-2026-10-12/` is not on disk (desk check, 2026-10-14).