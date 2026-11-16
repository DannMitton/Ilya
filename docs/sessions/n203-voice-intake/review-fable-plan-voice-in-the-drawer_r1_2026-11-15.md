# Fable review of the plan "VOICE in the Drawer" r1 (N.203)

Filed verbatim by the desk. Reviewer: a fresh Fable 5.2 subagent, read only, launched 2026-11-15 20:35 America/Toronto, stopped by the five-hour usage limit at 20:4x, resumed 23:31, memo received 23:3x (the clock read 23:39 after filing). Plan reviewed: `plan-voice-in-the-drawer_r1_2026-11-15.md`, md5 `6c23a48a`.

---

**OK WITH FIXES.** The design agrees with the tree and with Dann's rulings in most places, but it has one dead end at ten sung vowels, three seams the plan describes more kindly than the code does, and, in my judgement, six slices do not fit the days left.

Terms that are mine: "phase guard" (the test at `CalibrationWizard.svelte:330`), "dwell" (the pause on a new dot). All paths are under `apps/web/src/` unless they begin with `docs/` or `e2e/`.

## Fixes the plan needs before it is used

1. **Section 4.4, ten sung: no way to sing a vowel again.** `mainButton` returns Done whenever all ten are sung (`lib/voice/chart/screen-logic.ts:77`), and `pressMain` then leaves the screen (`lib/voice/VowelCapture.svelte:241`). Once a tap only selects, a complete voice cannot re-take anything, yet section 5's hint says "Re-take sings it again" and section 4.5 routes every re-take through that button. The prototype carries the same contradiction (its script, lines 109 and 128). Fix: at ten sung the main button reads Re-take {v}; "See your vowel space" takes Done's job.

2. **Section 7.1, the doors and the phase guard.** The plan says a capture "in flight" is never interrupted, "as today". The code refuses every request while the phase is `capture`, take or no take (`CalibrationWizard.svelte:330`). Back only flips a page flag (`routes/+page.svelte:1643-1648`), and the wizard stays mounted and hidden (`lib/components/Drawer/Drawer.svelte:846`). So a singer who leaves by Back from the ten vowels and then taps "Your vowel space" lands on the ten vowels again. A take begun before Back keeps running out of sight, because the ritual ends only on unmount (`VowelCapture.svelte:179-183`). Fix: leaving the takeover tells the wizard, which ends any take; the doors are refused only while a take runs. The band's switcher needs a stated rule in place of `disabled={phase === 'capture'}` (`CalibrationWizard.svelte:1035`).

3. **Section 4.4, the microphone.** "Prepares its audio at the Start tap" has no counterpart in the engine. The session creates its AudioContext after `getUserMedia` returns (`lib/voice/engine/live.ts:341`, `:364`), resumes it best-effort (`:372-375`), and its contract has `start`, `startReadiness`, and `cancel` only (`lib/voice/engine/session.ts:69-87`). Lane 59's file list omits all three engine files. Two further points:
   - The tick's context is created inside the tap today, because the first step fires synchronously (`lib/voice/count-in.ts:41`; `lib/voice/capture-ritual.svelte.ts:130`, `:173-174`). With Breathe first, the first tick comes from a timer 2 s later; on iOS a context made outside a gesture may stay silent. Fix: create and resume the tick's context in the Start handler, and say so in the brief.
   - "1.0 s to begin" is under the engine's floor. The gate evaluates nothing until a full 1.0 s is buffered after the microphone is live, then every 250 ms (`live.ts:105`, `:107`, `:520-524`), after acquisition and the worklet load (`:462`). The line will always hold at the first quarter. Fix: call 1.0 s nominal and design the hold as the normal case.
   - Cheapest proof: today's build already opens the microphone 6 s after the tap. Dann tries one take on an iPhone before lane 59 is briefed. If it works, lane 59 leaves the engine alone.

4. **Section 7.2, lanes 59 and 60 do share a file.** `e2e/calibrate-new.test.ts` enters every test through `toCapture`, which clicks "Calibrate" (`:29-34`). Lane 60 removes that button and the roster's Re-take (items 5, 6, 8, 16); lane 59 owns the file. Fix: one lane owns the entry helpers, and both briefs fix the selectors first.

5. **Section 5, strings that leave use.** `calib.anchor.named` stays in use: the closed band's line reads it (`lib/components/Drawer/bandState.ts:245`), and section 4.1 keeps that line. Unlisted in section 6: `lib/components/Drawer/voice-anchor-usable.test.ts` renders `VoiceAnchor` and pins page source (`:13`, `:40-42`). MELODY's empty state, "Calibrate your voice to begin." (`lib/i18n.ts:1446`), will name a control that no longer exists.

6. **Section 4.1, which count is "sung".** Three exist: usable readings for the closed band (`routes/+page.svelte:1636`; `bandState.ts:246`), any stored reading for the wizard (`CalibrationWizard.svelte:319`, `:336`), and non-estimated readings on the capture screen (`VowelCapture.svelte:88`). The plan's sentence and door names name none. A voice whose readings were all refused would read differently open and closed. Fix: the band uses the usable count throughout.

7. **Section 4.9, the method note.** "Reads the voice" is not enough. A type-only voice counts as measured (`lib/analysis/analyze-score-adapter.ts:97`; `lib/insights/identity.ts:38-43`), so a soprano who has sung nothing would be told "your voice is measured". Fix: test `restsOnSamples`, and write a line for the placeholder voice.

8. **Section 4.4, reduced motion.** The ritual goes idle at once under reduced motion (`capture-ritual.svelte.ts:237`), so the selection moves at once and the new dot is never shown at rest. Fix: the dwell holds under reduced motion; only the glide goes.

9. **Section 4.1, the filled pill.** "The lane reads the path's rule and applies it" hands a ruled grammar question (`docs/memory/PRODUCT.md:522`) to Code. The first-launch Start is already a primary button (`lib/voice/ProfileSwitcher.svelte:251`). Fix: the desk states which control is filled in each of the five states. The plan's "state line" for a sentence in an open band also collides with the ruled term for the closed form (`PRODUCT.md:520`).

10. **Unsaid overrides.** The plan drops "Add voice characteristics" from the summary, ruled by Dann 2026-09-10 as the second of three actions (`CalibrationWizard.svelte:1166-1170`). It divides an intake ratified as "one panel" (`lib/voice/InsightsIntake.svelte:3`). It puts retracting stations in VOICE, where the 2026-09-09 ruling struck the Voice station's chevron (`PRODUCT.md:580`). Each is covered by tonight's rulings in spirit; the plan needs to say so.

## Claims that are wrong or imprecise

- "Lanes 59 and 60 … share no other file": see fix 4.
- "A capture in flight is never interrupted, as today": the guard is the phase (`CalibrationWizard.svelte:330`).
- "The main button sings the selected vowel, as `pressMain` already does": not at ten sung (`VowelCapture.svelte:241`).
- "Where INSIGHTS says its findings use a typical voice (`i18n.ts:1827`)": the English reads "placeholder values for a generic {voiceType}".
- "The components that move are stateless … (their header comments say so)": `ProfileSwitcher` holds `mode` (`ProfileSwitcher.svelte:71`); only `InsightsIntake`'s header says it (`InsightsIntake.svelte:15-16`). The other two headers: NOT ESTABLISHED.
- "Who passes `onComplete`": established. The one mount passes none through `routes/+page.svelte:3881-3896`, and a search of `routes` and `lib` found no other.
- "Whether anything opens the band for a notice": `routes/+page.svelte` never names `scoreMarkup` (search); the toggle is `Drawer.svelte:477`. Stored defaults: NOT ESTABLISHED.
- "Behind the wall … That holds": the notices sit inside the same wall test (`routes/+page.svelte:4106`, `:4257`), so section 4.8 changes a wall-closed build.
- Section 4.5's "one table": the capture screen keeps its own folded table of the ten (`VowelCapture.svelte:357-389`).
- Section 3, part 9 omits the two "inverted" notes (`CalibrationWizard.svelte:1226-1228`, `:1248-1250`).
- Packet: `count-in.ts` has 63 lines; its constants are at `:16`, `:22`, `:27-33`, not 311 to 328. `GATE_WINDOW_S`, `GATE_HOP_MS`, and `PREROLL_S` are at `live.ts:105`, `:107`, `:109`.
- Confirmed: the four line counts and ceilings (`scripts/ratchets.json`), 1,270 keys (`i18n.ts:19`), 48 pinned strings (`lib/voice/chart/ratified-strings.test.ts:68`), and every other line cited in sections 3 and 6 that I opened.

## Risks to the release

1. **The calendar.** Four working days hold: three unmerged lanes, ten decisions, about forty strings in two languages, three briefs and three lanes each with a review, three walks on two devices, N.200 Steps 5 and 6, and the GUIDE rewrite, which waits on a frozen interface (`docs/memory/SCHEDULE.md`, Meta C and D). The GUIDE already describes the summary as the way in (`lib/components/Reading/GuideContent.svelte:372`). `docs/memory/CONTRACT.md:26` says the date never sizes the work. My judgement: all six slices do not fit. **The smallest plan that fits:** lane 59 (slice 1, with fixes 1, 3, 8) and lane 60 with slice 2 only, on the floor of section 4.6, plus the ratified no-score sentence. Slices 3, 4, and 6 and section 4.8 go to the next letter. Unmet until then: one table and no Re-take buttons (18:13, 18:44).
2. **The iPhone microphone.** Reduced by the one-take trial in fix 3.
3. **The wizard has no unit test, and its end-to-end net is rewritten by the same lanes.** Reduced by fix 4 and by merging lane 60's seam before slice 3 starts.
4. **`Drawer.svelte` has 9 lines of headroom** before lane 58. Links L1 and L2 need the reveal generalized from ANALYSIS (`Drawer.svelte:390-405`). Reduced by deferring section 4.8.
5. **A take running out of sight** (fix 2) is in the tree today; the new band gives the singer more to do while it runs.

## For Dann alone

1. If a VOICE lane is not walked by the freeze: (a) the date moves, or (b) that slice ships in the next letter?
2. At ten sung, the main button reads Re-take {v} and Done goes: yes or no?
3. Back during a take ends the take: yes or no?
4. English for the type-only voice: (a) "typical", the plan's new word, or (b) the ratified "placeholder values for a generic …"?
5. « Friture » alone on the take line, where the ratified term is « friture vocale » (`i18n.ts:1367`; `PRODUCT.md:1120`): yes or no?
6. The D3 sentence cannot take "Not sure" ("For a Not sure…", « Pour une voix de Je ne sais pas »), and the chart draws placeholders for all nine types (`lib/voice/chart/zones.ts:91`): a separate sentence for "Not sure" and no type, yes or no?
7. The notices move to the foot of the Drawer (section 4.8, a desk default the plan never puts to you): yes, no, or after the release?
8. "Add voice characteristics" leaves the summary, and the one-panel intake becomes two: confirm both, yes or no?
9. MELODY's "Calibrate your voice to begin." is reworded with the band: yes or no?
10. D9 has a third choice: open the microphone at Shape, 2 s early. Offer it, yes or no?

No French draft would fail the sweep I read (`lib/i18n.test.ts:120-132`), given U+00A0 before each colon.

## What I did not check

- The clone's working tree is at `fb9d829e`, one commit behind `2c07ab75`; the difference is `docs/`, `README.md`, and `NOTICES.md` only. Lane 58 is absent from the clone, and lanes 56 and 57 there are stale.
- No test was run and no screen was measured: heights, widths, and the 452 px figure are unverified.
- iOS behaviour is reasoning from the code, not observation.
- `VoiceTypeIntake`, `NotePicker`, `VowelSpaceSheet`, `readings.ts`, `OutsideNote`, the readiness code, `docs/sessions/`, `INBOX.md`, and the prototype's styles were not read; section 2's quotations were not checked against their source.
- The token estimate in section 7.3.
- Nothing from memory is used in this memo.
