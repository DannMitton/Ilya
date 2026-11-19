# SCHEDULE: what stands before the release, and what comes after

r6, written by the desk (Opus 5.5) 2026-11-16 13:2x at Dann's request of 13:17 ("Yes please save a version of this as a document for us to use to keep track of these details"). It replaces r5, which is in `SCHEDULE-archive.md` verbatim, last section. **Its reading copy for Dann is the Claude doc "Ilya: the road to release, and after", https://claude.ai/artifact/MSLx3mN7Fmv5scnAexsRcC (Dann 13:25: "I'd rather have a doc in Claude too"). The desk keeps the two in step: a change here is made there in the same turn.** Tree: `Shane` `a16c011c`.

**The date is Dann's, and it serves the work** (Dann 2026-11-16 13:17, transcribed as written: *"A reminder that the release date is synthetic and wholly invented by me with no external pressures forcing it. I picked a date because you seem to want one. A review of our record shows that we revise the date to accommodate whatever enhancements I desire. This does not change because you interpret a date as an edict. SO help me build an excellent tool I can be proud of, instead of exposing the public to ain incomplete tool that disappoints."*; the same rule as `CONTRACT.md` section 1 item 7). The working date is Friday 2026-11-27, freeze Thursday 2026-11-26 12:00 (DESK DEFAULT). When work and date disagree, the date moves. No item below is cut, switched off, or deferred to hold it.

**How it is kept.** Each item says what it is, why it matters to a singer, where it stands, and Dann's part. Tick at every close with the commit or file that closes it (`README.md`, closing step 3). Moving an item from "After" to "Before" is Dann's call.

---

## BEFORE THE RELEASE

### 1. VOICE, finished (N.203)
*What:* how a singer records and describes their voice. *Why:* the way into every personal reading INSIGHTS and MELODY give.
- [x] **Lane 59, the take** (SHIPPED `3fd9a13f` 2026-11-16 14:0x; walk owed) (breath, then Sing, Shape, Fry; the side view and the vowel space in view; a tap looks, Start sings; finish early). Built; Fable as built MERGE WITH FIXES (`../sessions/review-fable-lane59-as-built_r1_2026-11-16.md`); fixes running from 12:57. *Dann:* one merge paste, a walk on his phone.
- [x] **Lane 60, the VOICE pane** (SHIPPED `079ce6d8` 2026-11-16 19:4x, with Fable's seven fixes; walk owed) (your voice, its type, doors; a voice type alone is a start; one vowel-space view with one table). Steps 0 to 3, 5, 6 built; Step 4 waits for lane 59 on `Shane`. *Dann:* one merge paste, a walk.
- [x] **Lane 61, "Describe your voice" and "What INSIGHTS shares, and how"** (SHIPPED `74371b54` 2026-11-17 06:5x, `INBOX.md:817`; walk owed) in their own places, open without the microphone, with links from INSIGHTS. Brief r3 after two Fable reviews (`../sessions/brief-code-n203-lane61-describe-and-insights_r3_2026-11-16.md`, shipped `55b64d28`); RUNNING from 20:3x, https://claude.ai/code/session_01Vk7wM42xWaTsQTDK2smP8N, at Step 3 of 4 at 22:3x. *Dann:* a merge paste, a walk.

### 2. Strophic songs, last fixes (lane 56): both rounds SHIPPED (`a16c011c`, `3fd9a13f`); walk owed
*What:* MELODY prints a song of several verses in the order it is sung. Five fixes SHIPPED `a16c011c`; a second round of five (unusual endings, a later-verse grace note, a text correction on a live second ending, the clef's tap box, two tests) running from 12:57. *Dann:* one merge paste.

### 3. N.200, Ilya measures the voice as it is, solved well
*What:* Ilya measures a singer's resonances without assuming what that voice type "should" give. *Why:* a measure a singer cannot trust undermines everything built on it. *Where it stands:* Steps 0 to 3 and 7 SHIPPED `93bf8394`. Step 4 scored his 13 takes (`~/Downloads/_desk-2026-11-16/n200-step4-score/`): neither method meets the bars on that score. **Read by the desk 13:2x: the reference the takes were scored against is itself suspect on [o] and [u]** (it gives fR1 669 Hz for [o] and 648 to 691 Hz for [u], against 253 Hz for [i]; DESK INFERENCE, from the vowel space's usual shape, that a reference giving [u] a first resonance near [a]'s has read the wrong peaks). So the instrument is checked first (tether 11), then the method. The desk's recommendation of 13:0x to ship it switched off is WITHDRAWN (Dann 13:17). *Next:* a diagnosis plan from the desk. *Dann:* more takes at the microphone, and one treble voice before any singer sees it.

- **2026-11-16 22:3x (late desk):** plan r2 written and Fable-critiqued (`../sessions/plan-n200-voice-as-it-is_r2_2026-11-16.md`); P0 (the three papers read in full and filed), P0b (the prior-free cross-check, 12 of 13 of Dann's takes accepted, the 13th correctly flagged), and P1 (Bozeman bands checked) DONE, reports in `~/Downloads/_desk-2026-11-16/n200-p0/`, `n200-p0b/`, `n200-p1/`. Lane 62, the path picker (brief r3, `../sessions/brief-code-n200-path-picker_r3_2026-11-16.md`, shipped `d20f6f10`), RUNNING from 22:2x, https://claude.ai/code/session_01Vk7wM5enJiVyf2wzCyx1kB. Then: the desk scores Dann's 13 takes with the lane's tool on his Mac; Fable as built; merge; the switch-on lane (plan P5). Separate lane owed: correct `CORE_BANDS` against PVA2 Fig. 19.1 (Dann 21:54).

### 4. A code audit for future developers (new, Dann 2026-11-16 13:17)
*What:* Fable reads the whole code and prepares it for the people who will improve it after Dann: dead code removed, modules and their relationships assessed, comments economical and helpful, redundant ones gone, the non-obvious relationships written down. *Schema (desk, to be refined in the audit's plan):* the maintainability characteristic of ISO/IEC 25010 (modularity, reusability, analysability, modifiability, testability) as the checklist; refactoring in Fowler's sense (behaviour unchanged, every step under the gates) as the method; a refactoring period rather than scattered single changes. *Order (DESK DEFAULT):* the read and the plan start once the size and cost are told to Dann; the changes run as Code lanes after lane 61 merges and before the walks, so the walks see the final code. *Size:* about 154,500 lines of source outside tests and docs, and about 82,900 lines of tests (desk count 13:2x). *Dann:* yes to the cost; the plan, in words.

### 5. GUIDE and LEARN rewrite
*What:* how a colleague learns Ilya without Dann in the room. The desk drafts in his voice, English first, after the interface is final. *Dann:* ratify the English, rule the French.

### 6. The four Guide characters
*What:* Ted, James, Marie, and Maxime, worked examples walked through the finished app. *Dann:* read them with the GUIDE.

### 7. Walks
*What:* a look at each finished screen on a real device. Owed: lanes 48, 50, 52, 54, 55 (key changes and grace notes; the Drawer's order; the new Calibrate screen); the take on an iPhone (four iOS questions are NOT ESTABLISHED in lane 59's review); print in both languages, the French INSIGHTS print; `loupe-header.test.ts:47`; six phone Playwright tests that fail on `Shane` with causes NOT ESTABLISHED (lane 58 report r2). *Dann:* the walks a singer's eye needs; the desk does format and print.

### 8. Review packet, known-issues line, reviewers
*What:* a note for colleagues: what to try, what is known to be rough. Reviewers to include: Joanne Bozeman (Dann 13:17, name as he wrote it; Ilya's sources cite Kenneth Bozeman's books). *Dann:* ratify the draft and the list.

### 9. The Ilya page images
*What:* retake the six pictures on dannmitton.com/ilya after the gloss fixes and the new sigil (Dann 13:17: yes). *Dann:* a yes before publishing.

### 10. Release day
`main` moves to the new Ilya; version 2026b with a git tag and a GitHub release; `CITATION.cff` dated; the announcement, ratified by Dann, says once that Ilya is now under the AGPL. *Dann:* the commands and the announcement.

---

## AFTER THE RELEASE (on file; none needs Dann now; each is checked against the code before it is planned)

- **An explainer video** in the style of a mathematical animation (Dann 13:17: *"only after the build is stablizied in its final form for release"*). The desk has a video skill; whether it meets his picture of the result is shown with a short test first.
- **Reading scans:** N.135, the scan reader's words to 9 of 10; N.184, pre-1918 letters; N.178, tempo and dynamics words from the page; N.189, systems with no voice staff.
- **MELODY and notation:** strophic lanes B to E; N.191 ossias; N.190 accidentals as printed; N.177 dynamics; N.92's remainder; three grace-note collisions; slur shapes (row 145).
- **INSIGHTS:** N.193 the piano's support; N.173 curation rules; N.168 the knowledge stores; the vowel space inside INSIGHTS (ideas of 2026-11-15).
- **VOICE:** starting values for contralto, countertenor, bass-baritone (row 167); the voice profile card (row 168).
- **The whole app:** N.170 outside eyes; a WCAG 2.2 audit (row 140); N.197 no outside services; page names on print (row 137); Vercel's storage setting.

---

## Changes
- r6 ticked 2026-11-18 22:5x (evening Opus desk close): lane 69 SHIPPED `fe1e0e30` (MELODY's page with no score says where the voice stands; the `i18n.ts` comment order), with its as-built review's three fixes. Item 4, the audit: **RULED by Dann 22:47, Fable reads all the source, never tiered or trimmed; his reason is that this is the last look at the code before GUIDE and LEARN are finalized** (`OPEN.md`, "N.204: FABLE READS ALL THE CODE"). Item 7, walks: Dann's walk of lanes 59 to 68 on his iPhone is the next thread's one thing, at his ask of 22:50. New and owed, between items 1 and 7: the DRAWER lane, eleven string lines named to their section instead of a direction (ruled 22:28 and 22:35). The Claude doc copy is still NOT updated since 2026-11-16 13:2x (owed).
- r6 ticked 2026-11-18 16:1x (Opus desk close): lanes 66, 67, 68 SHIPPED (`f2b87049`, `753f1506`, `aba5f76b`): every sampled vowel counts from the first; the profile completes at five stable core vowels; one calm flag on unstable takes; the far-off [ɨ] choice built; Dann's lines ratified. Owed: lane 69 (two small fixes), the bands lane, N.204, the walk of lanes 59 to 68. The Claude doc copy is still NOT updated since 2026-11-16 13:2x (owed).
- r6 ticked 2026-11-17 22:02 (Fable desk close): lane 65 (the walk fixes) SHIPPED `2201330b`; lane 66 (the follow-ups of lanes 63 to 65: every sung reading counts, the VOICE rows on a phone, the recorder panel) RUNNING from 21:5x on brief r3, shipped `ab67b836`. Owed under item 3, and found unlisted by this desk: the far-off [ɨ] choice at the summary (ruled 2026-11-13, not built); then the bands lane. Item 4, the audit: the first unit's read is held for the 5-hour limit. The Claude doc copy is still NOT updated since 2026-11-16 13:2x (owed).
- r6 ticked 2026-11-17 20:1x (desk close): lane 61 SHIPPED; N.200 path picker (lane 62) and its switch-on (lane 64) SHIPPED `a058646b`; lane 65 (walk fixes) running; lane 66 (lane 64 follow-ups) owed. The Claude doc copy is still NOT updated since 2026-11-16 13:2x (owed).
- r6 ticked 2026-11-16 22:3x (late desk): lane 61 and N.200 lines. The Claude doc copy is NOT updated since 13:2x (owed).
- r6, 2026-11-16 13:2x: rewritten at Dann's request as the one tracking document, before and after the release. N.200 moved from "a decision on what ships" to "solved well" (Dann 13:17). Added: the code audit, the video (after), Joanne Bozeman, the page images yes.
