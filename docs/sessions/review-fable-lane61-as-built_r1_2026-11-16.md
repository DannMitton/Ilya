# Fable review of N.203 lane 61 as built

Filed verbatim by the desk 2026-11-16 23:4x. Fable 5.2 subagent, read only; harness count 207,896 tokens, 29 tool uses, 9.0 min (cap 400k). Lane `cloud-lane-61` at `d5e8e4d` against `Shane` `fc6b8abf`.

REVIEW MEMO: N.203 lane 61 as built (origin/cloud-lane-61 d5e8e4d against origin/Shane fc6b8abf). Read only; nothing changed; gates not run (the other agent has them).

VERDICT: MERGE (subject to the other agent's gate counts). No code blocker found. Six fixes after merge, the first one worth its own small lane before release.

BLOCKERS
None.

WHAT I CHECKED AND FOUND SOUND (A, D, E)
- Seam: `setCharacteristic` published (seam.ts:55-56; wizard seam effect, CalibrationWizard.svelte:750-751); its body is the old one, still calling `touchVoice` (wizard :371-383). `'leave'` is in `VoiceRequestKind` only, not `Landing` (seam.ts:19-21, :58). `requestRefused` is not in the diff, so unchanged.
- `calibratedAt`: `touchVoice` is `??=` (profileStore.ts:163-166); intake writes go through `assignToVoice`, which calls the same (:150-156). e2e asserts it for a dated and an undated voice (e2e/voice-stations.test.ts:34-59).
- `openStation` steps 1 to 6 in the brief's order (+page.svelte:1691-1700): `leaveThen`, raise on phone, reveal VOICE band, stop with no voice, reveal station, set target and bump.
- Dropped press: the wizard marks the request answered before the refusal test (wizard :324-328), `onLeave` fires only for an unrefused `leave`, and every `leaveThen` overwrites `afterLeave` first (+page.svelte:1676-1680, :3932). The wizard is mounted unconditionally (+page.svelte:3919-3926), so no remount re-answers a stale request. e2e: voice-pane.test.ts:253-274, insights-links.test.ts:156.
- Reveal over restore: `restoreQueued` / `restoreYields` (Drawer.svelte diff, stow effect and reveal effect). Code's report says the two takeover tests fail with the fix disabled; I did not rerun that.
- Phone one at a time across the station tier: `toggle` filters by tier when `exclusive` (sections.svelte.ts `toggle`); unit test and e2e-phone/voice-stations.test.ts:21.
- Never stored open: both ids in `UNPERSISTED_STATIONS` (sections.svelte.ts:65).
- `tidy` exists once (intake-answers.ts), character for character the old function (Shane InsightsIntake.svelte:43-51).
- The measuring copy of INSIGHTS is `inert` (InsightsPane.svelte:567), so the new buttons there are unreachable.
- Ceilings (wc -l on the lane): +page.svelte 5,530 of 5,534; InsightsPane 742 of 744; Drawer 1,986 of 1,990; wizard 1,126 of 1,126 (lowered from 1,727). None raised.
- i18n.ts: three edits, all comments (index line 87; UNUSED marks above `.title` and `.doneButton`). No string changed.
- Outside the Owns list: `identity.ts` (+5, `isGenericMethodKey`), `singer-blocks.ts` (+8, `noScoreBlocks`, block shape unchanged), new `links.ts`, `IntakeScale.svelte`, `intake-answers.ts`, `characteristics-pairs.ts`. All inside what the brief permits or suggests, except `IntakeScale.svelte`, which Code declared; it keeps one copy of the scaled question's markup and I would keep it.
- Lane 62: no file in common. In-memory trial merge of 61 onto Shane, then 62 onto that: both clean (git merge-tree exit 0). Lane 62's only change to `engine/types.ts` is `picker?: 'open' | 'path'`, which lane 61 does not read. Lane 61 was cut at 55b64d28; Shane has moved since in docs only.

THE DESK'S TWO POINTS (B)
(1) Treble clefs for a bass: yes, and it is the picker, not the lane. NotePicker.svelte:122 reads `clef = value ? clefFor(value, voiceType) : 'treble'`. An empty picker draws treble for every voice type. The station and INSIGHTS read the same stored type: the page's `voiceTypeChoice` feeds INSIGHTS (+page.svelte:4356, printed by `voiceTypePrint`, identity.ts:27) and VoicePane (+page.svelte:4185), which passes `voiceType?.voiceType` to DescribeVoice and on to each picker (DescribeVoice.svelte:67). Once a note is set, a bass gets the bass clef (note-picker.ts:87-92). It was equally true at origin/Shane: NotePicker is untouched by the lane, and the old screen passed the same `voiceType` (Shane CalibrationWizard.svelte:948). One further case: a singer on "Not sure" who typed "bass" in Other prints BASS on INSIGHTS (voiceTypes.ts:86-89) while `clefForVoiceType` returns null, so notes from C4 up draw in treble even when set.
(2) "Both open": the code is right and the picture is wrong. The desk allows both (sections.test.ts "on a desk, both stay open together"; e2e/voice-stations.test.ts:106). `step1-desk-en-both-open.png` and `step1-desk-fr-both-open.png` both show Describe closed and only the INSIGHTS station open (viewed). Why the capture missed is NOT ESTABLISHED (the capture script is not in the branch).

FIXES AFTER MERGE
1. Empty picker clef. In NotePicker.svelte:122, make the empty state `clefForVoiceType(voiceType) ?? 'treble'` (the function is exported, note-picker.ts:54). Same file, :68: the staged octave starts at 4 for everyone, so a bass who picks a letter first stores octave 4 at once; consider 2 or 3 when the type's clef is bass. NotePicker is outside lane 61's Owns list, so this needs its own short brief. It bears on Dann's 2026-10-09 ruling quoted at note-picker.ts:45-46.
2. Retake `step1-desk-en-both-open.png` and `step1-desk-fr-both-open.png` with both stations open, or delete them (the brief asked for each station open, not both).
3. Drawer.svelte:406-407: `restoreYields` is set before the target is looked up. If the selector finds nothing, the restore is cancelled and the Drawer is left at the top. Set the flag only when the target is found. No path reaches this today that I could find.
4. Stale comments naming the deleted file or class: VoiceTypeIntake.svelte:10, :129, :147; intake-symbols.ts:5.
5. GUIDE lines left untrue, as Code lists: GuideContent.svelte:389 (EN), :85 (FR).
6. Page fill: the measurer counts the links line (it is drawn in the measuring pass), print hides it (SingerBlock.svelte:615-617), so a printed notes block is one line shorter than measured. It cannot overflow. Run `pages-without-gaps` on more than the two fixtures before release.

FOR DANN'S EYE
1. The lede opens the station with "the analysis simply stays broad" / « demeure simplement générale »: keep, reword, or strike.
2. L4 reads "Record your vowels" directly under "…until you record your own vowels." (viewed, step4-phone-en-no-score-page.png): echo or reinforcement.
3. L1 and L4 sit on their own line under the Method line, side by side on a phone in English, stacked in French (viewed, step4-phone-fr-L1-L4-notes.png).
4. Describe is about 2,550 px on a 390 px phone (Code's measurement); the header is not sticky (no `sticky` in StationHeader.svelte), so closing it means scrolling back up.
5. Each picker leaves a tall blank between its label and its controls (viewed, step2-desk-en-range-link-landing.png); six of them make most of the length.
6. "What INSIGHTS shares, and how" opens with no intro sentence (DESK DEFAULT in the brief).
7. Closed stations show a name and chevron only, no state line.

FRENCH (C)
No new French. Station names, L1, L4, and ENTRÉE use built keys (viewed in the FR pictures; e2e/insights-links.test.ts:74, :105, :136). Italics on *passaggio* carried through `Italics` (DescribeVoice.svelte:92-93).

WHAT I COULD NOT ESTABLISH
- Any gate or Playwright result first-hand; all counts are Code's.
- Code's claim that the restore defect reproduces with the fix disabled.
- Why the two "both open" pictures were captured with Describe closed.
- Page fill on fixtures beyond Sunless and Tchaikovsky op. 38 no. 3.
- The 2,550 px and 2,784 px heights (Code's numbers; I viewed only the top of the phone station).
- The `openStation` no-voice branch in a browser (no link reaches it; Code says the same).
- I viewed 5 of the 48 pictures: step2-desk-en-range-link-landing, step1-desk-en-both-open, step1-desk-fr-both-open, step4-phone-fr-L1-L4-notes, step4-phone-en-no-score-page.

Terms: none coined; all names are the brief's or the code's.

Tokens used: not known exactly; my estimate is 150k to 170k, under the 400k cap.

From memory: house-style rules (Canadian spelling, no em dashes, the banned-word list) shaped the memo's wording. Nothing new worth saving beyond the findings above.
