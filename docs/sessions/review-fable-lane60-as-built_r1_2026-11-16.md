# Fable review, lane 60 as built (`cloud-lane-60` at 38ec37c2, against `Shane` at bb556024), r1, 2026-11-16

Filed verbatim by the desk (Opus 5.5) at 16:5x. Harness count 264,395 tokens, 39 tool uses, 6.4 min; cap told to Dann 400k. Preceded by the Sonnet scout's packet `packet-sonnet-lane60-as-built_r1_2026-11-16.md` (237,902 tokens against a 150k cap, over by 88k). Desk check of blocker 1, 16:5x: `VowelCapture.svelte:144` hands up a fresh hooks object and `:191` sets `onVisitHooks?.(null)` unconditionally on unmount; `CalibrationWizard.svelte:340` bumps `captureKey`, and `:927` remounts the screen inside `{#key captureKey}`; read at `38ec37c2`. The mount order is the reviewer's reading of Svelte's source, not run.

---

Read only; no file changed, no git write, no worktree made. I ran no vitest file, no gate, and no Playwright. Paths are under `/home/claude/scout60/repo/apps/web/src/` unless they begin with `apps/`, `docs/`, or `e2e/`. I read the brief r3, the amendments review section 2, the three word sheets, the scout's packet, the Step 4 report in full and the "For Dann's eye" parts of Steps 2 and 5, and these files on head: `lib/voice/seam.ts`, `readiness-view.ts`, `visit.ts`, `chart/finish-early.ts`, `components/Drawer/voice-pane.ts`, `VoicePane.svelte`, `CalibrationWizard.svelte:130-1038`, the lane's diff to `VowelCapture.svelte`, `engine/stub.ts`, `routes/+page.svelte`, `chart/readings.ts`, `chart/VowelSpaceSheet.svelte:40-169`, `e2e/voice-pane.test.ts`, and the two new unit tests. One outside read: the source of Svelte 5.50.1's key block (`dom/blocks/key.js`, `dom/blocks/branches.js`, from unpkg; the version is the lock's, `pnpm-lock.yaml:1137`), to settle blocker 1. Term I coined: "orphaned take". Nothing in this review comes from memory. I cannot read a harness token counter.

## Verdict

**DO NOT MERGE as it stands; MERGE WITH FIXES once blocker 1 is closed.** The blocker is a few lines. Everything else ruled is built: the pane's seven sentences and doors, the verdict (`readiness-view.ts:32`, heard AND accepted, `null` refused), Finish writing nothing, the one table with the marks, the words. The seam is small and clean.

## Blockers

1. **After the singer re-enters the capture screen through the pane's door, Back or a hidden page no longer ends a take, and the microphone can open again on a screen she has left.** Found by reading, not by running.
   - The wizard holds the take's hooks in `visitHooks` (`lib/voice/CalibrationWizard.svelte:573`), set by the capture screen in its script body (`lib/voice/VowelCapture.svelte:144`) and cleared in its unmount (`VowelCapture.svelte:191`, `onVisitHooks?.(null)`).
   - A `record` request that finds the wizard stowed on the capture screen bumps `captureKey` (`CalibrationWizard.svelte:340`), which remounts the screen inside `{#key captureKey}` (`:927`). In Svelte 5.50.1 the new branch is created first (`branches.js`, `ensure`: `this.#onscreen.set(key, branch(...))`) and the old one destroyed after (`#commit`, `pause_effect(effect, on_destroy, false)`). So the new screen hands up its hooks, then the old screen's unmount sets them to `null`.
   - From then on the visit's `endTake` (`CalibrationWizard.svelte:576`) reaches no ritual. On Back mid-take, `visit.close()` (`lib/voice/visit.ts:47-53`) still calls `closeVisit()`, which ends the engine's run silently (`lib/voice/engine/live.ts:270-284`), and the ritual never hears. Its count-in keeps running behind the Drawer at rest with its ticks (`lib/voice/capture-ritual.svelte.ts:241-248`; `closeTicks` is not reached either), and at Fry it calls `session.start` (`:258`), which outside a visit acquires the microphone itself (`lib/voice/engine/session.ts:95-99`). A sound the detector accepts is then stored and re-dates the profile (`CalibrationWizard.svelte:717-720`).
   - Singer-facing effect: the path is the ordinary one (capture screen, Back, "Carry on recording" or "Record a vowel again", Start, Back or switch tabs). Ticks sound on a screen she left, the microphone opens against the ruling of 2026-11-16 00:44 ("close it when you leave"), and no CANCELLED take record is written. I call this an orphaned take.
   - The change: clear the hooks only if they are still the ones that screen set. For example, the screen keeps `const hooks = { endTake, closeTicks }`, hands it up at `:144`, and passes it back on unmount; the wizard's handler at `:928` sets `visitHooks = null` only when `visitHooks === hooks`. Add one browser test: four readings stored, door, Back, door again, Start, Back mid-take; assert the pane shows, a CANCELLED take is recorded, and after eight seconds no reading was added and the stub session started no run. No test on head covers Back during a vowel take at all (`grep takeover-back e2e`: only `e2e/voice-pane.test.ts:65`, `:80`, `:140`, `:158`, none mid-take).

## Fixes

1. **The pane's "works out" sentence is wired in one untested, unpictured line.** `routes/+page.svelte:4180` passes `finishEarlyState(...).kind === 'work-out'`. `voice-pane.test.ts` tests the pure function with the flag passed in; `voice-pane-usable.test.ts:17-25` pins `usable` and `hasStoredReading` in the page source and not this prop; no browser test stores the six anchors; no picture shows the state (brief section 6 and amendment 24 ask for each state). Effect: a regression to `false` would print "fills" where "works out" is true, and nothing would fail. Change: one browser test with the six anchors stored asserting line 5b, and the phone French picture.
2. **`backToTen` repeats the `record` rule by hand and leaves the Start over question open.** `CalibrationWizard.svelte:746-750` against `seam.ts:47-49`. The landing is the same for the singer (packet point 2: yes, equivalent). Two differences: the rule now lives in two places, and `confirmingReset` is not cleared, so a singer who taps Start over, then "Back to the ten vowels", returns to a summary still asking the question (`:937-944`). Change: `const to = landingFor('record', hasAnyReadings(profile))` and `confirmingReset = false` in `backToTen`.
3. **Amendment 16's browser path is built short.** It asks for refusal, Try again, acceptance; `e2e/voice-pane.test.ts:122-134` runs refusal, Try again, refusal, Continue. The stub's outcome is read once at construction (`lib/voice/chart/stub-switch.ts:33`). Effect: nothing proves an accepted run after a refused one clears the refusal and stores the rate. Change: let the test set the outcome between runs.
4. **INSIGHTS' "Add your range" has no browser test on either new branch:** refused over the capture screen (`CalibrationWizard.svelte:338`), and the no-voice branch that only reveals the band (`routes/+page.svelte:1666-1669`). The unit tests cover the pure rule only (`seam.test.ts`). Low.
5. **Stale comments in the wizard, about 20 lines against a ceiling lane 61 needs:** `:139-145` ("Finish on the Profile summary"), `:583-595` (the roster, which is gone), `:950-953` ("Done returns to the summary"; Done now closes, `:1031`).
6. **Re-run after the blocker's fix:** `voice-pane` and `calibrate-new` on the merge result. `Shane` differs from the lane's base by `docs/memory/` only (packet section 1), so the other gates stand as reported; I ran none.
7. **For lane 61's brief, no change to this lane.** (a) The seam publishes `setOwn` and not `setCharacteristic` (`seam.ts:28-39`; `CalibrationWizard.svelte:408-420`), so range, tessitura, and passaggio cannot be written from the pane until it is added. (b) Both doors and "Add your range" send the one kind `characteristics` (`VoicePane.svelte:69-70`; `routes/+page.svelte:4358`). (c) The page has 11 lines free, `Drawer.svelte` 7, `MarkupPane.svelte` 2 (packet section 6); the pane component (142 lines) is where growth belongs. (d) If the desk lowers the wizard's ceiling to 1,314 at this merge, lane 61 starts with none free there.

## For Dann's eye

1. **First-launch words, now in the pane.** "Veuillez nommer votre profil afin que nous puissions…" with « Démarrer », and three taps later the test fry's Start is « Commencer » (sheet line 10). Two French words for Start on one path, and a Start that starts nothing. The desk already holds this as a words-only amendment.
2. **"What INSIGHTS shares, and how" opens the same screen as "Describe your voice", at its top.** The singer who taps it meets the voice type and the range pickers first; the INSIGHTS questions are the last group (`CalibrationWizard.svelte:1028-1030`). That is the floor the brief ruled until lane 61. His call whether it ships that way.
3. **Finish sits at the foot of "Your vowel space", below the legend, the sources, and Print** (`CalibrationWizard.svelte:934-936`). In the desk picture none of Finish, Back to the ten vowels, or Start over is in the first view. Back at the head leaves too. Taste.
4. **A marked row is taller, and with marks the ten rows no longer fit one view.** In the French phone picture « Au-delà des valeurs de référence d’Ilya » takes two lines under the name and [u] is off the screen. The lane reports 43 to 65 px over.
5. **Line 13 for an unmeasurable room.** When `fryHeard` is `null` the test fry refuses, as ruled, and says "Ilya heard the room, but no vocal fry." For that case the first clause is not known to be true. The words are his.
6. **Try again quiet, Continue filled** on the refusal screen (DESK DEFAULT; seen in the French phone picture).
7. **"Your vowel space" shows for a typed voice with nothing recorded,** and opens ten placeholders (amendment 9, DESK DEFAULT; the lane flagged it).

## Not established

- Blocker 1 in a browser. It rests on reading the framework's source at the locked version and the tree; I ran nothing.
- The order of the capture screen's unmount and the wizard's `visit.sync()` effect on an ordinary phase change (`CalibrationWizard.svelte:580`). If the effect ran first, a CANCELLED take could be written to a voice just switched to (the hazard `visit.ts:90-94` describes). My reading is that the block's teardown runs first; not run.
- Whether a real rustle is refused, and how often real fry is refused in the three-second window. Every fixture is synthetic (`readiness-view.test.ts:4-5`).
- Whether the microphone prompt on iOS fires `visibilitychange`. If it does, `fryToBefore` (`CalibrationWizard.svelte:565-569`) would end the first run at the prompt and return the singer to Start.
- Whether lowering the Drawer on a phone during the test fry ends the run: `takeoverVisible` is `calibrating` (`routes/+page.svelte:3898`), which lowering does not change, as far as I read.
- Whether INSIGHTS shows "Add your range" with no voice saved.
- Any pixel height, the print page count, any gate or suite count: the lane's own, not re-measured.
- Which two keys the desk's "removes 2" meant. The lane's Step 4 report says the index test failed at 1,323 and passes at the actual count.

## Packet spot-checks

Rows I checked against the tree, all correct: 1.4 (`seam.ts:47-49`), 1.5 (`seam.ts:57-59`), 1.6 (`routes/+page.svelte:1670`), 1.9 (`routes/+page.svelte:3900`; `CalibrationWizard.svelte:761-763`), 2.8 (`voice-pane.ts:61-63`), 4.6 (`readiness-view.ts:32`), 4.9 (`CalibrationWizard.svelte:896-900`), 4.12 (`:574-579`), 5.5 (`VowelSpaceSheet.svelte:115`), 6.2 (`lib/i18n.ts:1493`). Two it left open, now closed: the pane's mount is inside the wall (`{#if}` at `routes/+page.svelte:4124`, its `{/if}` at `:4272`), and `.vp-door` is unfilled (`VoicePane.svelte:113-124`, `background: transparent`).

The packet's five points:

1. **`VowelCapture.svelte` gaining `visit` and `onVisitHooks`:** the design is right and needed (one helper, or the microphone closes and reopens between the fry and the first vowel), it is small, and it is disclosed. Its unmount line carries blocker 1.
2. **`backToTen`:** equivalent landing for the singer; see fix 2.
3. **Key count:** consistent. My own count of key lines in `lib/i18n.ts` gives 1,328, `calib.` 120, `capture.` 55, matching the header (`:19`, `:30`, `:31`); 17 UNUSED marks for this lane; `i18n-index.test.ts:53-57` compares the header with `stringKeys()` and holds no literal.
4. **`calib.roster.kept`:** the code is right. `docs/house-style/` holds no apostrophe rule (grep), but the tree does, ratified by Dann 2026-08-18: typographic ’ for every possessive and elision, matched to the tree where a ratified table was typed straight (`lib/i18n.ts:1610-1614`; the same at `:514-515`). The English sheet is typed straight throughout ("I've"), and lane 59 set that line typographic too (`:2563`). The key predates the lane. No change.
5. **No "works out" picture:** a gap against brief section 6 and amendment 24; see fix 1.

Pictures I looked at (six): `step2-pane-phone-fr-three`, `step2-pane-phone-fr-first-launch`, `step4-fry-phone-fr-breathe` (« Silence », « Respiration », « Friture » whole), `step4-fry-phone-fr-refused`, `step5-phone-fr-marked`, `step5-desk-en-ten`.
