# SCHEDULE: the checklist to Friday 2026-11-20

r4, written by the desk (Opus 5.5) 2026-11-14 21:4x, at the day desk's close debt and Dann's "Proceed" of 21:30. It replaces r3 (the checklist to 2026-10-30), which is in `SCHEDULE-archive.md` verbatim. Floor: `e8f91ee7`.

**The date.** The release is Friday 2026-11-20 (Dann 2026-11-13 00:47; confirmed 2026-11-14 20:37: *"No our dat is Nov 20 nbext Friday."*). On that day `main` moves to `Shane`, and the public site becomes the new Ilya. Until then the public site does not change (`STATE.md`, the share table, item 12).

**How it is kept.** Four metas, in the order they finish. Each item says what it is, where it stands, and what Dann does. Tick at every close with the commit or file that closes it (README, closing step 3). Quality over speed: when work and date disagree, the date moves (`CONTRACT.md` section 1 item 7).

---

## Meta A. Land what is built

**Why:** work that is finished helps no singer until it is on `Shane`. **Done means:** each lane read, measured on its tip, shipped, and walked.

- [x] **Lane 50: N.192 key changes and N.187 grace notes** (ruled for the release 2026-11-12 00:23). `cloud-lane-50` at `06a5e236` (2026-11-12 18:25), cut from `b1234cf4`; NOT in `Shane` (read 2026-11-14 21:4x). Its step 10 (double barline only where the score marks one) was sent 2026-11-12; whether it landed is NOT ESTABLISHED. Desk: read its reports, merge with `Shane` in a clone, measure; one ship paste. Dann: ship, walk.
  - MEASURED 2026-11-14 22:2x (desk clone, `Shane` e8f91ee7 + lane, one comment conflict in the key index at the head of `i18n.ts`, counts restated): all eight gates pass; gate 4 5708 passed, 1 skipped (5709). Step 10 is NOT DONE: no commit or report for it, and the lane's default draws a light double barline before every key change, the opposite of the ruling. Also owed by the lane's own report: save and reload of grace and key corrections, print, French pictures, a grace note under the clef control at 390 px cannot be tapped. DESK DEFAULT: after lanes 54 and 55 ship, the desk sends step 10 and these four to lane 50, then ships it.
  - SENT 2026-11-14 23:5x to lane 50's session (https://claude.ai/code/session_01Vk7wM7rgUtgUncsPZ7k4p3) as items 10 to 14: merge `Shane` 0b36c229 first; 10 double barline only where the MusicXML marks light-light; 11 save and reload; 12 the grace note under the clef control at 390 px; 13 MELODY print, letter, EN and FR; 14 French pictures. Report due as `docs/sessions/report-code-n192-n187-step10-14_r1_2026-11-14.md`. RUNNING.
  - SHIPPED `eba49310` 2026-11-15 11:55 (Dann; merge `87dd16e6`; all eight gates at baseline on the Mac, gate 4 5788, gate 5 842; the twelve `report-code-n192-n187-*` reports read in full by the desk). Dann's walk owed. Found, and owed a brief: three grace engraving collisions (`STATE.md`, close of 2026-11-15).
- [x] **Lane 48: the closing polish lane with L17** (brief r3). `cloud-lane-48` at `4fe51272` (2026-11-12 19:19), cut from `dc078b95`; NOT in `Shane`. Owed before its ship: the bytes of `static/fonts` and the `rus` model told to Dann (`CONTRACT.md` section 8), and its step 11 report on the CI failures. Same path as lane 50.
  - MEASURED 2026-11-14 22:1x (desk clone, `Shane` e8f91ee7 + lane, two comment conflicts in the key index, counts restated): all eight gates pass; gate 4 5755 passed, 1 skipped (5756). Bytes, told to Dann 22:2x: `static/fonts` grows by 1,911,542 bytes (58 woff2, four OFL.txt, one CSS), from 2,029,108 to 3,940,650; the `rus` model (`omr-underlay/rus_prereform_r2_29000.traineddata`, 7,827,478) is unchanged. Owed: Playwright `loupe-header.test.ts:47` fails, which side is wrong NOT ESTABLISHED; the INSIGHTS French letter-size print with the wrapped label. Step 11's CI report exists.
  - RE-MEASURED 2026-11-14 23:4x on `Shane` af09df90 (after lanes 54 and 55): same two comment conflicts, resolved file `~/Downloads/_desk-2026-11-14/i18n-lane48-resolved.ts` (md5 bb52fbbc); all eight gates pass, gate 4 5740, gate 7 159. DESK DEFAULT: ship now; `loupe-header.test.ts:47` and the French INSIGHTS print stay owed, on the walk list. SHIPPED by Dann 23:4x as `0b36c229`.
- [x] **Lane 54: N.201, the Drawer's order** (QUEUE row 188). SHIPPED `afb5f044` 2026-11-14 22:5x. Dann's walk owed.
- [x] **Lane 55: N.199 Step 8, the new screen for every singer** (QUEUE row 189). SHIPPED `af09df90` 2026-11-14 23:2x. Dann's walk owed.

## Meta B. Build what is ruled and not built

**Why:** each item is ruled into the release. **Done means:** shipped and walked.

- [ ] **N.200, "Ilya encounters the voice as it is"** (QUEUE row 186; `cloud-lane-52`). Brief r2 is Fable-reviewed; it cites lines lane 55 deletes, so it is revised to r3 after lane 55 ships, then reviewed again. Rides with it, all ratified 2026-11-14: the four "Resonance profile" strings; « Reprendre » for the summary's Re-take; the far-off [ɨ] message (2026-11-13 15:29); and the `sources.ts` entries for Titze, Maxfield, and Walker (2017) and Bozeman (2013). **Needs Dann at the microphone** (Step 1, the recorder, then his saved takes, then one treble voice before any singer sees it). The largest item left; at risk for the 20th if the measure does not hold.
  - Steps 0, 1, 2, 3, and 7 SHIPPED `93bf8394` 2026-11-15 12:05 (lane 52; `report-code-n200-step{0,1,2,3,7}_r1_2026-11-15.md`; gate 4 5817). The recorder is live on the lane's build. Next: Step 4, Dann at the microphone; then Steps 5 and 6.
- [ ] **Strophic songs, lane A** (ruled 2026-11-12 13:41: MELODY unfolds the song continuously). Brief r4 WRITTEN 2026-11-15 00:1x by the desk, `~/Downloads/_desk-2026-11-14/brief-code-strophic-lane-a_r4_2026-11-15.md` (not yet in the tree): a performance-order render score built on `unfold`, passes kept only where a later verse has words, derived ids for later passes, the label above the bar where each verse begins. Fable reviewed 2026-11-15 00:2x: SEND WITH AMENDMENTS (14; four would print a wrong page: A1 verse 3 never prints, A2, A3, A7), sized 3 Code sessions, 4 with a fix round; review at `~/Downloads/_desk-2026-11-14/review-fable-strophic-lane-a-r4_r1_2026-11-15.md`. Desk applies all 14 as r5; one question for Dann (a trailing one-line stretch on the stacked path: once, or in every pass; Fable and desk recommend once). Then lane 56, cut after lane 50 ships.
  - Brief r5 in the tree at `93bf8394` (`brief-code-strophic-lane-a_r5_2026-11-15.md`: Fable's review of r4, 14 amendments, and Dann's "A" of 2026-11-15 02:44). Lane 56 NOT STARTED (QUEUE row 191).
- [ ] **The two layout repairs and the "Continue" button** ride lane 55 (Meta A).
- [x] **The Ilya page on dannmitton.com** (Dann 2026-11-15 01:42 to 02:27). https://dannmitton.com/ilya, PUBLISHED 02:27 at Dann's yes; EN then FR, with six page captures; texts in `OPEN.md`, last section. Retake the captures after the gloss and asterisk fixes (`STATE.md`, close of 2026-11-14/15).
- [ ] **The welcome sheet** (ruled 2026-11-15 01:30 and 01:38, EN and FR; OPEN.md last section). Brief r1 `docs/sessions/brief-code-welcome-sheet_r1_2026-11-15.md`, prototypes in `docs/sessions/welcome-sheet/`; SHIPPED to the tree `d022a6f0`. One lane after the brief ships.
  - Brief r2 in the tree at `93bf8394` (`brief-code-welcome-sheet_r2_2026-11-15.md`: r1 with the Fable desk's review, seven amendments). Lane 57 NOT STARTED (QUEUE row 192).

## Meta C. The words

**Why:** the GUIDE and LEARN are how a colleague learns Ilya without Dann in the room. **Done means:** both rewritten in English, ratified, then French ruled.

- [ ] **GUIDE and LEARN rewrite** (structure ruled 2026-11-11 22:43: Getting started, How do I…, the Walkthrough, Reference, About Ilya, Contributors, Licences; LEARN keeps its course and gains a Reference). Desk drafts in Dann's voice (voice profile r2), English first. Carries: the formants sentence ratified 2026-11-14 21:26; the GUIDE lines N.201 makes stale (`GuideContent.svelte:101-102`, `:130`, `:185`, `:397-398`, `:426`, `:481`); the stale screenshots (`guide-step-01`, `-13`, `-18`, `-20`, `-25`, `-32`); the departure from Vennard (N.199, owed since 2026-11-12). Starts after the freeze of the interface (Meta D), so the screenshots are final.
- [ ] **The four Guide characters** (Ted, James, Marie, Maxime) walked through the finished interface before the narratives are written (storyboard, 2026-10-31).

## Meta D. Freeze, walk, release

- [ ] **Freeze the interface.** After lanes 54 and 55 and the Meta A lanes ship, and Dann has walked them. Proposed: Tuesday 2026-11-17 evening. After it, only what would tell a singer something false or lose a singer's work joins (the freeze rule of r3).
- [ ] **Review packet and known-issues line** (share table item 10). Desk drafts; Dann ratifies.
- [ ] **Format walk, print walk, N.83 end to end, both languages** (item 11). Desk, Thursday 2026-11-19.
- [ ] **Release.** Frozen build; `main` moved to `Shane`; invitations. Dann, Friday 2026-11-20. With the move (N.202, Dann 2026-11-15 13:31): the version reads 2026b on the commit `main` moves to; a git tag and a GitHub release named 2026b on that commit (Dann's command); `CITATION.cff` takes `date-released`; the 2026b announcement, drafted by the desk and ratified by Dann, goes out the same day and says once that Ilya is now under the AGPL.

---

## Changes

- r4, 2026-11-14 21:4x: re-planned to 2026-11-20 from `STATE.md`, `QUEUE.md`, `OPEN.md`, and `git log --since=2026-11-11` (read this session). Found while re-planning: lanes 48 and 50 are finished on their branches and not in `Shane`.
- 2026-11-15 12:2x (Fable desk, at its close): ticked from `git log --since="2026-11-15 02:34"` (`87dd16e6`, `eba49310`, `25c4a369`, `93bf8394`). Every lane of Meta A is shipped; none is walked.
