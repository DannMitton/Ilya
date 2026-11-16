# Review of lane 59's brief r2

Filed verbatim by the desk (Opus 5.5), 2026-11-16 02:0x. Reviewer F1 (Fable 5.2), 226,590 tokens (harness count), 22 tool uses, 6.2 min; cap told to Dann 370k.

Reviewer F1 (Fable), 2026-11-16. Read only; nothing changed. Brief reviewed: `/mnt/user-data/outputs/brief-code-n203-lane59-the-take_r2_2026-11-16.md`, md5 `4c8545368e7b3f97a24b40a1c7872d4c` (167 lines), which includes the desk's in-place edit after Dann's 01:28 ruling (section 1 item 5, Step 6, Step 7 amendment 2 re-read as edited). Code read in the scout's clone `/home/claude/s6/ilya`, branch `merged` at `68871a6e` (`Shane` `d9af5ac9` plus lanes 56 to 58). Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `docs/`, or `routes/`. "brief:N" is a line of the brief.

NOT ESTABLISHED beats a complete invented answer.

Terms I coined in this review: "run token", "visit helper", "listening state". All other terms are the brief's or the tree's.

## 1. Verdict (SEND, SEND WITH AMENDMENTS, or HOLD) and blockers, numbered

**SEND WITH AMENDMENTS.** The design is sound and the rulings are carried faithfully. Five points will produce a wrong build if the brief goes as written; each is fixed by an amendment in section 2.

1. **Every take after the first in a visit will hear nothing.** The tap's handler closes over the generation of the run that built it: `engine/live.ts:471` (`this.onChunk(gen, ...)`) and `:479-480` (the ScriptProcessor path). `onChunk` drops any chunk whose `gen` is not the current one (`live.ts:486`), and every `start()` raises the generation through `reset()` (`live.ts:240`, `:259`). Keep the graph across takes, as Step 1 asks, and take 2's audio is discarded at `:486`; the gate never fills its window (`:521-524`) and the take ends in "Stable vocal fry was not detected" after 10 s (`:397-404`). The brief's "fresh graph state" sentence (brief:50) does not name this. Amendment 1.
2. **A missed fry will bring the banner back.** `fail()` releases the audio (`live.ts:319`), and the gate's timeout goes through `fail()` (`live.ts:399-403`). Brief:50 lists `finish()`, the readiness end, and `reset()` as keeping the stream, and says nothing of `fail()`. Its phrase "`closeVisit()` and `cancel()` outside a take release them" also leaves Stop during a take unsettled: the ritual's cancel calls `session.cancel()` mid-take (`capture-ritual.svelte.ts:254`), which releases today (`live.ts:295`). A new singer misses fry often; each miss would reopen the microphone. Amendment 2.
3. **The takeover's visibility has no road to the wizard, and the visit is never reopened.** The flag lives in the page (`routes/+page.svelte:308`, `:1644-1649`), reaches only the Drawer (`:3833`), and the wizard's one mount passes no such prop (`:3885-3887`). `routes/+page.svelte` is in neither list of brief section 4 (brief:134-136), and plan r4 section 7.2 gives it to lane 60. Also: Back hides the takeover with `display: none` (`components/Drawer/Drawer.svelte:846`, `:1497-1498`) while `VowelCapture` stays mounted (`CalibrationWizard.svelte:1122`, `:1138`). Brief:52 opens the visit "when the capture screen mounts", so after Back and a return nothing reopens it, and what `start()` does outside a visit is unstated. Amendment 3.
4. **Two steps place the finish-early action in two places.** Brief:81 (Step 4 item 7) puts it after the main and second buttons. Brief:15 and brief:102 (as edited) put it at the foot, in place of the quiet link at `VowelCapture.svelte:397-399`. Brief:60 puts "See your vowel space" in that same foot slot. At ten recorded the main button no longer reads Done (`chart/screen-logic.ts:77` goes), so on a phone the only door to the summary is then below the chart, the readings, and the hide toggle. Amendment 9.
5. **The finish-early rule can still print an untrue caption.** "Unrecorded" on this screen is `sungSet` (`VowelCapture.svelte:88`), which counts a reading the guard judged implausible and one with no fR2. An [o] recorded but implausible and not kept is treated as absent (`engine/resolve-values.ts:132`) and takes a stand-in (`engine/stand-ins.ts:203-212`), yet by brief:104 the button would read "Let Ilya work out the other three". A recorded anchor with `f2Quality: 'absent'` and a positive f2 passes `usableAnchor` (`engine/derivations.ts:77-88`, no quality test) while its own fR2 is not taken as sung (`resolve-values.ts:148`) and takes a stand-in. And with every recorded vowel unusable, `anySung` is false (`resolve-values.ts:209`), so "Ilya fills the other {m} from what you have recorded so far" is false: the fill is the template alone. Amendment 10.

## 2. Amendments, numbered, each with file:line and the exact change to the brief

**Step 1 (brief:46-54)**

1. After brief:50, add: "The tap's message handler today closes over the generation of the run that built it (`engine/live.ts:471`, `:479-480`) and `onChunk` drops any other generation (`:486`). A kept graph therefore needs a run token the handler reads at call time (read `this.gen`, or rebind `port.onmessage` and `onaudioprocess` at each `start()`); the handler must still drop everything between runs. Test: the second take of a visit receives audio and reaches stable fry."
2. Replace the second sentence of brief:50 with: "Inside a visit only two things release the stream and the context: `closeVisit()`, and a microphone failure (`MIC_PERMISSION_DENIED`, `MIC_NOT_FOUND`, `NO_AUDIO_INPUT`). `finish()`, the readiness end, `reset()`, `cancel()`, and every other `fail()` (the gate's timeout at `live.ts:399-403` above all) stop the run, clear its timers and buffers, and keep both. Outside a visit every path behaves as today, so `start()` and `startReadiness()` with no visit open acquire and release per run, and no existing caller changes. Update the contract comment at `engine/session.ts:79-85`, which says `cancel()` stops the tracks." Add tests: a gate timeout inside a visit does not call `getUserMedia` again on the next take; Stop mid-take inside a visit keeps the tracks live.
3. Replace brief:52 with: "The visit is wanted exactly while the capture screen is mounted AND the takeover is visible AND the page is visible. Put that rule in one small visit helper (a new module under `voice/`, taking the session, the ritual's release, and a `() => boolean`), so lane 60 can widen the predicate to span the test fry without re-implementing it. When wanted turns false: end any take first (keep nothing), then `closeVisit()`, then close the tick's context. When it turns true: `openVisit()`. The takeover's visibility reaches the wizard as one new prop at the wizard's mount (`routes/+page.svelte:3885-3887`, from `calibrating`, `:308`); lane 59 adds that prop and that one attribute, and lane 60 reuses the prop for D13. Add `routes/+page.svelte` (that one attribute) to 'Touches with care' in section 4. Also close on `pagehide` and on `visibilitychange` to hidden (DESK DEFAULT: a tab in the background does not hold the microphone)." Add tests: Back, return, then two takes call `getUserMedia` exactly once more; Back during a take ends it, keeps nothing, and stops the tracks.
4. Replace brief:53 with: "`openVisit()` is idempotent and does not acquire. The Start handler calls it on every tap (a user gesture); when the visit already holds a context that is suspended it resumes it there, because `session.start()` itself runs 8 s later from a timer (`capture-ritual.svelte.ts:165-183`), outside the gesture. At each `start()` inside a visit, check that the held track's `readyState` is `live` and the context is not closed; if either fails (a call, a headset pulled, an interruption), release and acquire again."
5. Replace the last test clause of brief:54 with: "the tick's context is the ritual's, not the session's (`capture-ritual.svelte.ts:110`, `:130`, closed today only in `destroy()`, `:268`); the ritual gains a way to make and resume it inside the Start tap and a way to close it without being destroyed, and the visit helper calls the second. Test that both contexts are closed after the visit ends, and that a later Start makes a working tick again."
6. Add to brief section 7 (after brief:161): "Whether the ticks sound the same on an iPhone once the microphone stays open. From the second take of a visit the ticks play while capture is live, which today never happens (the stream is released at `live.ts:661` before the next count). The reviewer recalls that iOS lowers or re-routes playback while a page is capturing; that recollection was not checked in this review. Ask Dann to listen for it on his walk."

**Step 2 (brief:56-61)**

7. Add to brief:60: "`pressMain`'s `done` branch (`VowelCapture.svelte:241`) goes with the `done` kind (`chart/screen-logic.ts:71`, `:77`). `capture.done` is marked UNUSED and kept. `tapAction` (`count-in.ts:52-63`) has no caller but its own test (`count-in.test.ts:31`, `:72-75`) and describes the retired second-tap cancel; delete both."
8. Add a bullet: "A tap (button or chart) during the 1.4 s dwell ends the dwell at once and focuses the tapped vowel (DESK DEFAULT). Today a tap in any phase but idle is dropped (`VowelCapture.svelte:232-236`), and the main button is disabled through the landing (`:202`, `:210`; `screen-logic.ts:76`), so with the dwell at 1.4 s the screen would ignore the singer for that long after every capture."

**Steps 4 and 6: where the doors sit (brief:81, brief:60, brief:102)**

9. Replace brief:81 with: "7. The main button and the second button (`:346-349`)." Add to brief:83 (item 9): "then, at the foot, the one quiet control at `:397-399`: the finish-early action for one to nine recorded (Step 6)." Add to brief:60: "At ten recorded, 'See your vowel space' sits directly under the main and second buttons, not at the foot (DESK DEFAULT: it is then the way forward, and the main button no longer says Done; Dann's 01:28 ruling on quietness was about a singer still recording). Shown at rest only."

**Step 6 (brief:98-109)**

10. Replace brief:104-106 with: "Compute the state from the chart's own resolution, `resolveVowelValues(profile, voiceType, { placeholders: 'always' })` (`chart/zones.ts:93`). **Let Ilya work out the other {m}** when no vowel's `fR1Source` or `fR2Source` is `surrogate` and at least one vowel is not in the recorded set; `{vowels}` is every vowel not in the recorded set, in `VOWELS` order (`engine/types.ts:26`). **Use what I've recorded** in every other state; its caption prints only when `anySung` is true (`resolve-values.ts:209`), and the button stands alone otherwise. `{m}` is ten less the head's count (`VowelCapture.svelte:88`, `:277`), so the two numbers on the screen add to ten." Add tests: [o] recorded but implausible and not kept shows "Use what I've recorded"; an anchor with `f2Quality: 'absent'` shows "Use what I've recorded"; one recorded vowel, implausible, shows the button with no caption.
    Note for the desk: brief:104's example lists [ɨ], [ɪ], [ʌ]; `VOWELS` order gives [ɪ], [ɨ], [ʌ], matching the order of the ratified line 23. Pick one in the brief; I recommend `VOWELS` order.
11. Add to brief:118: "Line 5b is the VOICE pane's (lane 60). Lane 59 writes no key for it." And see section 4, question 1: `{m}` = 1 has no ratified singular in either language; until Dann rules, the brief must say what prints.

**Step 3 (brief:63-71)**

12. Add to brief:65: "During the wait for fry the held quarter carries a visible listening state (a slow pulse of the fill; a distinct static fill under reduced motion), so a hold of up to 10 s (`live.ts:117`) does not read as a frozen screen. No new words. The first quarter fills over 1.0 s (the gate's window, `live.ts:105`)."
13. Replace brief:68 with: "**Build it as a presentational component** (`voice/TakeLine.svelte`): props are the parts (id, label, weight), the current part, progress within it (0 to 1), a holding flag, the accessible label, and reduced motion. It owns no clock and reads no session; the ritual drives it here, and lane 60's test fry drives it from its own clock (`engine/readiness.ts:133-134`). `aria-valuetext` is the current part's label. Lane 60 imports it and does not edit it."
14. Add after brief:68: "The labels must stay whole and apart at 390 px in French. A part of weight 2 in 12 is about 60 px of a 358 px line (the reviewer's arithmetic, not a measurement), and « Respiration » is the longest label (sheet-french line 15, and line 11 for lane 60). If a label does not fit its part, the label row may space itself apart from the bar's proportions; no truncation, no overlap, no type under 11 px. Show the French phone picture at Breathe."
15. Add to brief:66: "Ticks sound at the start of each of Sing's four seconds (2, 3, 4, and 5 s after Start)."

**Step 4 (brief:73-89)**

16. Add to brief:86: "These sizes come from plan r4's two-square stage, which the 00:32 ruling removed. They are a target. The height criterion below wins, and so does a legible name, credit, and readout in the same row; on a 390 px phone the row has about 107 px left beside a 96 px circle and a 155 px side view (arithmetic from `VowelCapture.svelte:281-291` and the sizes above, not measured). Report the size chosen and why."
17. Add to brief:89: "Also report, at 390 px wide, the distance in px from the top of the viewport to the bottom of the Start row, and how much of the chart is in view at rest. A Playwright viewport of 844 px is taller than what a phone browser shows with its bars up, so the desk needs the number, not only pass or fail. Nothing scrolls by itself, before, during, or after a take."

**Step 5 (brief:91-96)**

18. Add to brief:93: "Use `click`, never `pointerdown` or `touchstart`: the chart now sits where the singer's thumb scrolls, and a scroll that starts on the chart must not change the focus. Read the tap against the view as it stands at that instant (the view may be mid-glide). Update the comment at `chart/VowelChart.svelte:60`, which says a tap does nothing." Add a test: a vertical drag that starts on the chart scrolls and leaves the focus alone.

**Step 7 (brief:111-123)**

19. Add a key map so Code does not guess (existing keys read at `i18n.ts` on the merged tree):
    - Line 15: four new keys for the part labels.
    - Line 16: a new key for "Breathe."; `pacifier.singFirst` (`:1366`) takes "Sing {v} as you usually do."; `pacifier.pause` (`:1368`) takes "Stop. Hold that shape, silently."; `pacifier.beginPhonating` (`:1369`) and `pacifier.nowSustain` (`:1370`) stay as built.
    - Line 17: one new key holding `{v}` (the bracketed symbol, as `cueText` fills it, `chart/screen-logic.ts:93`); `calib.capture.cuePrefix` and `cueSuffix` (`:1302`, `:1306`) become UNUSED, and `firstTimeExplanation` (`screen-logic.ts:111-113`) is rewritten.
    - Lines 18, 19, 20: `capture.hint.first` (`:2505`), `capture.hint.active` (`:2506`), `capture.hint.finished` (`:2511`).
    - Line 21: `capture.retake` (`:2498`), unchanged.
    - Lines 22, 23: new keys, button and caption each.
    - Line 24: a new key; `calib.capture.returnToSummary` (`:1331`) becomes UNUSED.
    - Line 26b: `sheet.legend.sung`, `sheet.legend.placeholder` (`:2483-2484`).
20. Replace the first clause of brief:123's test rule with a named list, because the rule "any key under `capture.` or `sheet.`" misses pins on other keys: `chart/ratified-strings.test.ts:22-23`, `:44`, `:45`, `:50`, and `:81-82` (`pacifier.pause`); `chart/screen-logic.test.ts:32`, `:80`, `:92`, `:102`, `:107`; `capture-ritual.test.ts:84-92` (cue keys) and its `session.cancels` counts (packet section 2); `VowelCapture.test.ts:66-68`, `:119` ("Return to summary", « Retour au sommaire »); `apps/web/e2e/calibrate-new.test.ts:61` (`Done`), `:100`, `:109`, `:160` ("Return to summary"); `count-in.test.ts:31`, `:72-75` (amendment 7).

**Step 8 (brief:125-130)**

21. Add to brief:128: "With a score, nothing changes: `insights.method.silent` when the voice is not measured (`insights/InsightsPane.svelte:289-290`, the block at `:331-342`), and the four built keys otherwise (`:291`). The three new states apply only to the no-score page (`:326-330`). Put the choice in `methodLineKey` (`insights/identity.ts:61-64`), which lane 59 now owns for writing (section 4 lists it as read), so the pane's block at `:288-293` does not grow; update `insights/identity.test.ts:69-73` with it."
22. Add: "On the no-score page the French pitch-key suffix stays off, as today (`InsightsPane.svelte:292` adds it only with a model)."
23. Note for the desk, no change to the lane: with a score the built method lines say "placeholder values for your voice type" (`i18n.ts:1831-1832`, pinned at `insights/ratified-lines.test.ts:418-419`); without one, line 29 says "generic values for your voice type". Sheet r2's one-term rule makes "generic values" the term and "placeholder" the dotted mark, and `engine/stand-ins.ts:79` still records the opposite. One pane, two words for one thing, until a later words pass.

**Section 4 and Step 0**

24. Add to brief:44 (Step 0): "Confirm the key count in the head of `i18n.ts` on the merged tip against `i18n-index.test.ts`; the packet's regex count is 1,280 and lanes 56 and 57 each wrote a different number (packet section 0)."
25. Add to brief:138: "Lane 60: the visit helper's predicate is the place to add the test fry. If the test fry and the first vowel are two visits, the microphone is announced twice on a first journey; one visit across both meets Dann's 'announces it once'."

## 3. What the singer will feel (short)

- **The take itself reads well.** Four named parts, a silent breath, ticks only where there is singing, and a line that says where they are. This is a clear gain over the count.
- **On a phone the chart is out of sight during a take.** The done-criterion puts the header through Start in view, so the chart is below it. The dot lands and the 1.4 s dwell passes unseen unless the singer has scrolled. What they will see is the full line, the cue, and the two resonances in the vowel's row (`VowelCapture.svelte:213-216`), then the row changing to the next vowel. That is a fair result, and it follows from Dann's 00:32 order; say so in the walk notes so it does not read as a defect.
- **The wait for fry.** A line held still for up to 10 s reads as broken. Amendment 12 gives it a listening state.
- **After a capture the screen is deaf for 1.4 s** unless amendment 8 goes in. Eager singers tap the next vowel at once.
- **A missed fry reopening the microphone** would undo the ruling of 00:44 for the singers who most need calm. Amendment 2.
- **A tap on the chart reaches neighbours only.** At rest the chart is moved in so the focused zone fills about half the view (`chart/geometry.ts:43`, `:99`, zoom held between 1.4 and 3.2, `:40-41`). Far vowels are off the frame; the ten buttons reach them. See question 2.
- **Scrolling over the chart** will change the focus by accident unless the tap is a `click`. Amendment 18.
- **The screen will speak two vocabularies.** New lines say "record"; lines the sheet does not cover still say "sing", "sung", and "captured": the hide toggle "while I sing" (`i18n.ts:2503-2504`), "until you sing it" (`:2510`), "moves as you sing" (`:2508-2509`), "Ready for {v}" and "{v} is captured" (`:2494-2496`), the buttons' spoken state "sung" (`:2514`), "{v} captured." (`:1371`), and the hull's legend (`:2486`). See question 3.
- **At ten recorded,** the way to the summary is easy to lose at the foot of a long phone screen. Amendment 9.

## 4. Questions only Dann can answer (taste, the irreversible, French), or "none"

One at a time, in this order. Only the first holds anything up, and only Step 6's strings.

1. **French and English for one vowel left.** "Let Ilya work out the other {m}" / « Laisser Ilya déduire les {m} autres », and both captions, have no singular. With one vowel left the French is wrong as it stands (« les 1 autres »). Also unsettled: `{m}` as a word ("three", as brief:104 and brief:108 show) or a numeral (as lines 5 and 5b do). Recommendation: the desk drafts singular forms in both languages from the ratified lines, words for one to four, and puts them to him as a marked draft. Cost of not asking: Code invents French, which his rules forbid.
2. **Taste: the chart at rest.** His 19:16 ruling keeps the chart moved in on the focused vowel; his 00:32 ruling makes it touch-sensitive. Together, a tap on the chart reaches the neighbouring vowels only. Recommendation: build it as ruled and let him feel it on the walk; the alternative (the whole space at rest, moving in only during a take) costs a second pass on Step 4's view logic.
3. **Words and French: the lines the sheet did not reach** (listed in section 3), and one line inside the sheet that breaks its own rule: line 16 keeps "Now sustain. Sample recording." while the sheet's header says "'Sample' leaves the singer's words", and its French uses « enregistrement » where choice A made « capter » the verb. Recommendation: send lane 59 with the sheet as ratified, and the desk drafts a short supplement for these keys as a words-only step before the walk. Cost of waiting for it: none to the build; the keys are `i18n.ts` only.

## 5. What I could not establish

- Any behaviour on a device. Not read or run in this review: whether iOS suspends or interrupts a held AudioContext between takes; whether `resume()` from the Start tap is enough; whether ticks are lowered or re-routed on an iPhone while capture is live (amendment 6 rests on my recollection, not on a source read today); whether a context made 8 s after the gesture starts running on iOS (Dann's trial covered 6 s, per the brief; that trial is not in the tree, per the packet).
- Whether keeping the stream changes the guard's first second. From the code: `start()` clears the buffers (`live.ts:263-264`) and the gate waits for a full second gathered after it (`:520-524`), so no audio from before the Fry part can reach the gate once amendment 1 holds. What the first second of a warm stream sounds like against a cold one is a device question.
- The pixel claims in amendments 14 and 16. They are arithmetic from the brief's sizes, not measurements. Nothing was rendered.
- Whether the stub's readings pass the amended Step 6 rule after the seven in Ilya's order. I read that the stub sets `f2Quality: 'clear'` (`engine/stub.ts:59`) and did not read the rest of `stubFormant`.
- The two Fable reviews of plan r4, and the prototype HTML. Not read; I spent the budget on the code. Plan r4 sections 4.4 and 7 were read in full; section 6 was not.
- Whether `welcome-sheet.test.ts` or `singer-paths.test.ts` reach the capture screen by visible text. A grep of `apps/web/e2e` for "Return to summary", "Done", and the two INSIGHTS sentences found hits only in `calibrate-new.test.ts`; I did not read the other suites.
- The 2026-11-16 rulings as quoted in the brief (00:32 to 01:28). They are not in the clone (packet section 0); I took them from the brief, the two sheets' headers, and the desk's note.
- The merged tip's gates. Nothing was installed or run.
- Whether lane 60's brief agrees with amendments 3 and 25. I have not seen it.

Nothing in this report came from the user's memory store.
