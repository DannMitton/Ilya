# Brief to Code: N.203 lane 60, the VOICE pane, the test fry, and the summary (slices 2 and 3)

r3, 2026-11-16, written by the desk (Opus 5.5). **r3 applies Fable's review of r2, all 25 amendments (section 9); where section 9 and an earlier section differ, section 9 wins.** r2 r2 applies the Sonnet scout's packet `docs/sessions/n203-voice-intake/packet-sonnet-n203-lane60-brief_r1_2026-11-16.md`. For a cloud Code session on branch `cloud-lane-60`, cut from the tip of `Shane` after lane 56 has merged. Not sent until Fable has reviewed it (`CONTRACT.md` §1 item 19). Lane 59 (`docs/sessions/brief-code-n203-lane59-the-take_r3_2026-11-16.md`) runs beside this lane on the screen with the ten vowels; read its sections 1, 4, and 9 before you start.

Paths are under `apps/web/src/` unless they begin with `docs/` or `apps/`. Lines were read by the desk at `Shane` `d9af5ac9` (2026-11-16 01:4x) or by plan r4 at `2c07ab75` (same code); Step 0 re-reads them on your tip.

## 1. What the singer gets

1. **The VOICE pane at rest shows the voice.** Its name with the list of voices (New, Duplicate, Rename, Delete), its voice type, one sentence saying what Ilya holds for it, and doors: **Record your vowels** (or **Carry on recording**, **Record a vowel again**), **Your vowel space**, **Describe your voice**, **What INSIGHTS shares, and how**. Today the open pane holds one line and one button, Calibrate or Re-calibrate (`lib/components/Drawer/VoiceAnchor.svelte`; mounted `routes/+page.svelte:4160-4165`).
2. **A voice type alone is a way to begin,** and the pane says so.
3. **The test fry says what is coming before anything runs,** waits for **Start**, runs on the same take line as the vowels (Quiet, Breathe, Fry), and refuses a sound that is not fry, with **Try again** and **Continue**.
4. **The summary becomes "Your vowel space":** the chart, one table of the ten readings with the roster's marks in it, the legend, the sources, Print, a way back to the ten vowels, Finish, and Start over.
5. **Finish returns to the Drawer at rest.**
6. **MELODY with no voice** points to VOICE in the singer's words.

## 2. The rulings, in Dann's words

In `docs/memory/INBOX.md` and `docs/memory/OPEN.md`, N.203, transcribed as written there; the full design is plan r4, `docs/sessions/n203-voice-intake/plan-voice-in-the-drawer_r4_2026-11-15.md`, sections 4.1, 4.2, 4.3, 4.5, 4.6 (the floor), 4.8, 7.1.

| When | His words (short) | What it rules |
|---|---|---|
| 2026-11-15 20:12 | "bless you for catching this, lets fix it / yes" | Whose voice moves to the VOICE pane at rest; the singer is told a voice type alone gives a working profile. |
| 2026-11-15 20:16 | "yes" | The roster's marks move into the one table. |
| 2026-11-15 18:13, 18:44 | "a single, stereamlined yet information-rich element ... (but preseving its footnote)"; "the retake buttons are redundant" | One readings table, the chart in the same view, the footnote kept, no Re-take buttons in it. |
| 2026-11-15 20:18 | "yes" | "Describe it" has its own door in the pane, open at any time, with no microphone. |
| 2026-11-15 20:20 | "Yes keep them in the Drawer, they are analogous to text;'s Notation section" | INSIGHTS' settings get their own door in the pane. |
| 2026-11-16 00:31 to 00:35 | "it wenbt by too fast and I wasn't aware of my responsibliuty in time ... Ilya is accepting anything as that test input"; "I was silent during the green abr. SUffling of clothes and hands" | The test fry accepts a rustle as fry; the singer does not know what to do. |
| 2026-11-16 00:33 | "Yes: \"the test fry works like the vowel take you ruled last night.\" ... let's do it" | Step 4's design. |
| 2026-11-16 01:14 | "what Ilya calls a band. is not german to the user" | No singer-facing word "band"; "pane" / « volet ». |
| 2026-11-16 01:13, 01:20, 01:35, 01:38 | "Yes to all your responses"; "I ratify all of the french"; "yes"; "yes" | The words, Step 7. |

DESK DEFAULTS this brief applies (Dann may strike any), from plan r4 section 8 as decided 2026-11-16 00:4x: D1, the two new doors open in place in the pane as NOTATION opens in ANALYSIS (`lib/components/Drawer/Drawer.svelte:540-548` by plan r4), built by lane 61; this lane builds the floor (Step 3); D4, Welcome still asks the voice type when the voice has none; D5, Finish returns to the Drawer at rest; D14, "Add voice characteristics" leaves the summary; D15, the notices stay where they are until after the release; D16, MELODY's empty state is reworded.

## 3. Steps

Each step is its own commit, test first where a test applies, its own report section with pictures, and a push.

### Step 0. Read and report. Change nothing.

On your tip: the eight gates with counts; every line this brief cites, re-read, with any that moved; the line counts of every file you own against `scripts/ratchets.json` (`lib/voice/CalibrationWizard.svelte` stood at 1,726 of 1,727 at `d9af5ac9`); read plan r4 sections 4.1 to 4.8 and 7.1, and its two Fable reviews in the same folder. Say whether seam B of plan section 7.1 holds; if it does not, stop and report.

### Step 1. The seam (plan r4 section 7.1, option B).

The voices live in the wizard: `store` (`lib/voice/CalibrationWizard.svelte:237` by plan r4) and every write. The wizard is mounted whenever VOICE is shown (`lib/components/Drawer/Drawer.svelte:819-823` by plan r4).

- The wizard publishes, beside `onActiveProfileChange` (`CalibrationWizard.svelte:836-850`; `routes/+page.svelte:3884-3891`), the list of voices, the active id, the active voice's type and usable count, and one object of commands: select, create, duplicate, rename, delete, set the voice type, set an own answer, and open (sing, summary, characteristics).
- `openRequest` (`CalibrationWizard.svelte:202`, answered at `:321-332`) grows from one phase to three: sing (Welcome for a voice with no reading, else the capture screen on the next vowel by `chart/tour.ts`), summary, characteristics. Today a request is refused while the phase is `capture` (`:330`); refuse only while a take runs.
- Lane 59 adds the takeover's visibility as a prop at the wizard's one mount (`routes/+page.svelte:3881-3903`) and owns Back during a take (lane 59 brief r3, section 9, amendments 2 and 3). Reuse that prop; do not re-implement it.
- A take-running flag reaches the page and the pane (it exists nowhere above `VowelCapture` today, packet section 2), so the pane's switcher and doors are inert while a take runs.
- With no voice saved, the pane's first-launch form names the voice; the takeover is never opened onto an empty wizard (packet section 2).
- A new callback closes the takeover from Finish (the mount passes no `onComplete` today, `routes/+page.svelte:3881-3896` by plan r4).
- Tests: a write from the pane changes the store and the page's active voice; a request during a take is refused and answered after it.

### Step 2. The VOICE pane at rest (plan r4 sections 4.1 and 4.2).

A new component replaces `VoiceAnchor` in `routes/+page.svelte:4160-4165`. In order:

1. **The voice line:** the voice's name with its chevron, the built `ProfileSwitcher` (`lib/voice/ProfileSwitcher.svelte`, mounted today at `CalibrationWizard.svelte:1032`) moved here with its list. Beside it the voice type, or **Choose a voice type**; a tap opens the built voice type control in place (`VoiceTypeIntake.svelte`). Inert only while a take runs (today `disabled={phase === 'capture'}`, `CalibrationWizard.svelte:1035`).
2. **The voice's sentence,** by state (sheet lines 1 to 6, line 5b as amended 2026-11-16 01:28, "Ilya works out the other {m} from your own vowels.", and the counted forms for one left). Seven sentence states; the eighth state of the pane is the first-launch form (item 4). "Recorded" means usable, the count the closed pane's line uses (`routes/+page.svelte:1636`, `usableReadingCount`). States: nothing recorded and no type; nothing recorded, a type with generic values (`hasPlaceholderProfile`, `lib/voice/engine/stand-ins.ts:81-87`); nothing recorded, contralto, countertenor, or bass-baritone; nothing recorded, "Not sure"; one to nine before the vowels Ilya needs (line 5); one to nine when every remaining vowel can be worked out (line 5b, the same rule as lane 59's Step 6 as amended by its review's amendment 10, computed by the same function, which lane 59 writes in `lib/voice/chart/finish-early.ts` (DESK DEFAULT name; lane 59 is told) and you import); ten recorded (line 6).
3. **The doors** (sheet line 7): the door to recording, named for the state; **Your vowel space**, shown once there is a type or a reading; **Describe your voice** and **What INSIGHTS shares, and how** (sheet line 8). No door is filled in these states; the one filled control in the pane is the first-launch **Start** (`ProfileSwitcher.svelte:251`), as plan r4 section 4.1 item 3 says (the Drawer fills one pill at rest, `docs/memory/PRODUCT.md:522`).
4. With no voice saved, the pane shows the built first-launch form (`ProfileSwitcher.svelte:225-253`) and nothing else.

Inside the takeover the voice's name becomes a plain label at the head of each screen. The notices (`routes/+page.svelte:4196-4256`) stay where they are (D15). Behind the wall (`INCLUDE_MARKUP_INSIGHTS` false) the pane shows nothing under its header, as today (`routes/+page.svelte:1714-1716`).

Tests: each of the seven sentence states and the first-launch form; a profile whose readings are all implausible prints the nothing-recorded sentence (`usableReadingCount` 0, while `sungSet` and `capturedCount` say 1, packet section 3); the type control from the pane writes the same stored value as Welcome; the switcher in the pane changes the page's voice; `voice-anchor-usable.test.ts` is rewritten for the new component (it pins page source, `:13`, `:40-42` by plan r4); `e2e/singer-paths.test.ts:92-110`, `:182-204` (the Calibrate button and MELODY's line, by plan r4) are rewritten.

### Step 3. The two doors open the built screen (the floor, plan r4 section 4.6).

**Describe your voice** and **What INSIGHTS shares, and how** open the built "Voice characteristics" screen in the takeover (`CalibrationWizard.svelte:1196-1280` by plan r4) by `openRequest`, at any time, with no microphone; Done returns to the Drawer at rest. Lane 61 later divides that screen into two sections that open in place. INSIGHTS' "Add your range" keeps opening it at the range (`routes/+page.svelte:1650-1660`).

### Step 4. The test fry (ruled 2026-11-16 00:33).

Today, after Begin, Ilya listens to the room, counts "Three. Two. One." over 2.1 s, and only then says "Fry now" for 3 s (`lib/voice/engine/readiness.ts:133-134`; `CalibrationWizard.svelte:646-714`), and the done screen says "Readiness check complete." for any sound louder than the room by the presence floor (silence is vetoed and routes to "Ilya did not hear fry", `engine/readiness.ts:306-340`, packet section 4). `assessReadiness` computes `fryHeard` and `fryAccepted`, and no screen reads them (grep); the fry detector's own verdict (six conditions, packet section 4) is never consulted, and it rejects synthetic noise bursts. Dann was silent and rustled his clothes, and Ilya reported his fry "near the edge of our range" (00:35): the presence floor `FRY_PRESENCE_MIN_SNR_DB = 6` (`engine/readiness.ts:108`) is a named placeholder that a rustle clears.

1. **Before:** "Getting ready" shows sheet line 9 and **Start** (line 10). Nothing listens until Start.
2. **The run:** lane 59's `voice/TakeLine.svelte` with three parts, Quiet, Breathe, Fry (line 11), weights DESK DEFAULT 1, 2, 3 (Quiet is the room's second, `READINESS` quiet step; Breathe 2 s; Fry the 3 s window). Cues (line 12). The spoken count "Three. Two. One." goes. Your clock drives the line; the line owns none.
3. **The verdict:** accept only when `fryHeard === true` **and** `fryAccepted === true`. Otherwise show line 13 with **Try again** and **Continue** (line 14). `null` from `fryHeard` (an unmeasurable ratio) is not acceptance: treat it as not heard here, and say so in the report. The built "Ilya could not reach your microphone" path stays (`calib.readiness.noMic`).
4. **The microphone:** the test fry and the vowels share one visit, so Chrome on iOS announces the microphone once (lane 59 brief r3, section 9, amendment 25): widen lane 59's visit predicate to "the test fry or the capture screen is showing". The built line `calib.readiness.guidance` ("each vowel asks for the microphone again") becomes false; line 13's own clause replaces it; mark the key UNUSED.
5. **Tests,** with recorded fixtures: silence; a rustle (record or synthesize broadband noise bursts, and say which); real fry from `lib/voice/engine/fry-synth.ts`. Only the last is accepted.

**This step waits for lane 59's Step 3 (the take line) to be on `Shane`.** The desk tells you when; merge `Shane` into your lane then. Do Steps 1, 2, 3, 5, 6 first.

### Step 5. The summary becomes "Your vowel space" (plan r4 section 4.5).

The phase `summary` (`CalibrationWizard.svelte:1141-1195` by plan r4) becomes, in order:

1. The note on readings outside Ilya's values with Keep them and Re-take, as built (`OutsideNote`).
2. The sheet's title, subtitle, and the voice's name (as built, `lib/voice/chart/VowelSpaceSheet.svelte`).
3. The whole chart.
4. **One table,** ten rows: a mark, the symbol, the vowel's name, fR1 in Hz with its note, fR2 in Hz with its note. A recorded vowel has a filled mark; a vowel not recorded a hollow mark and its placeholder values in lighter ink. The sheet's own table ("Your readings", `VowelSpaceSheet.svelte` near `:119` by OPEN N.203) is the one kept; the roster (`CalibrationWizard.svelte:916-1002` by plan r4) goes.
5. **The roster's marks in that table,** beside the vowel, only where they apply (sheet line 26): "Provisional"; "Beyond Ilya's reference values"; "Noise floor: Unmeasured"; the ⓘ beside [o] that opens LEARN (`:935-975` by OPEN N.203); "Try again" where a recorded vowel has no fR2. "placeholder" is the one word for a value not recorded (D2); the roster's "Estimated" leaves use.
6. The legend (with sheet line 26b, which lane 59 writes), the footnote on sources, Print.
7. **Back to the ten vowels** (line 25), Finish, Start over with its confirmation.

Gone: the title "Profile summary" and its two ledes; the roster with its Re-take buttons; Continue; "Sing the three Ilya derived for you" and its caption (`:894-903`); Add or Edit voice characteristics (`:910-914`). A re-take of one vowel is: back to the ten vowels, tap it, Re-take. The note's own Re-take walks its vowels as built (`:777-783`).

Done when the chart and all ten rows are in one view at 390 by 844 and in a desk Drawer 900 high; report the pixel heights. Print still prints the sheet alone (`lib/voice/chart/print-sheet.ts`).

### Step 6. Finish, and MELODY's line.

- Finish closes the takeover and returns to the Drawer at rest (D5), by the callback of Step 1.
- MELODY's empty state ("Calibrate your voice to begin.", `i18n.ts:1446` by plan r4) takes sheet line 30.

### Step 7. Words.

Ratified, character for character: `docs/sessions/n203-voice-intake/sheet-english_r2_2026-11-16.md` and `sheet-french_r1_2026-11-16.md`, lines 1 to 14, 25, 26, and 30, with the counted forms and consent captions at the end of each (for lines 5 and 5b with one left), and `sheet-supplement_r1_2026-11-16.md` where it touches your keys. Numbers: numerals in the pane's count, words in links and captions. Write no French of your own; run the OQLF sweep (`lib/i18n.test.ts:155`). Lines 15 to 24, 26b, and 27 to 29 are lane 59's; do not write them.

Every new or retired key moves the key index at the head of `lib/i18n.ts` and `i18n-index.test.ts`. A retired key is marked UNUSED and kept. Keys leaving use (plan r4 section 5, "Strings that leave use"): `calib.anchor.uncalibrated`, `.calibrate`, `.recalibrate` (`calib.anchor.named` stays, the closed pane reads it, `lib/components/Drawer/bandState.ts:245`); `calib.summary.title`, `.savedLede`, `.progressLedeSuffix`; `calib.challengingInvite.button`, `.caption`; `calib.characteristics.addButton`, `.editButton`; `calib.roster.actionsHeader`, `calib.roster.reading.estimated`; `calib.readiness.guidance`. List each key's pinning tests before you change it.

## 4. What this lane owns, and what it leaves

Owns: the new pane component and its tests (replacing `lib/components/Drawer/VoiceAnchor.svelte` and `voice-anchor-usable.test.ts`); in `routes/+page.svelte`, the VOICE group (`:4105-4258` by plan r4) and MELODY's empty line; `lib/voice/CalibrationWizard.svelte` (the seam, the switcher's move, Welcome, the test fry, the summary, Finish); `lib/voice/ProfileSwitcher.svelte` (its mount moves); `lib/voice/chart/VowelSpaceSheet.svelte` and `lib/voice/chart/readings.ts` (the table's marks); `lib/voice/engine/readiness.ts` (the verdict only); `e2e/singer-paths.test.ts`; in `e2e/calibrate-new.test.ts`, the entry helpers `open` and `toCapture` (`:13-34`), which every test there uses and which click "Calibrate" today.

End-to-end tests that pin what this lane removes or renames (Calibrate, Re-calibrate, Profile summary, the roster, Continue, the invitation, the characteristics buttons, the readiness strings, MELODY's line; listed with lines in packet section 7) are this lane's, except those inside `calibrate-new.test.ts` past its entry helpers, which are lane 59's. Back during the test fry ends it and keeps nothing, by lane 59's visit helper (its amendment 3).

Leaves: the screen with the ten vowels, the take, `voice/TakeLine.svelte`, the visit helper, the engine's microphone, INSIGHTS (lane 59); dividing "Voice characteristics" into two sections that open in place, links L1 and L2 (lane 61).

`CalibrationWizard.svelte` stands at its ceiling. Free lines before adding any: the roster, the invitation, the summary's ledes, and the characteristics buttons leave it. Move the pane's logic into its own module. Do not raise the ceiling. Lane 59 edits this file too (the visit, the finish-early wiring): when the desk tells you lane 59 has merged, merge `Shane` and resolve.

**Other sites that compute the same number.** The usable count is computed by `usableReadingCount` (`routes/+page.svelte:1636`) for the closed pane's line, by `sungSet` on the capture screen (`lib/voice/VowelCapture.svelte:88`, which counts implausible readings and readings with no fR2), and by the summary's `capturedCount`. Use `usableReadingCount` for the pane's sentence and say in the report where the three disagree. The readiness verdict is computed only in `engine/readiness.ts`; `engine/stub.ts:99` returns `fryAccepted: true`, so stub runs accept.

## 5. Constraints

- Change nothing under `docs/memory/`, and do not edit, rename, or replace a brief.
- No new dependency. Line ceilings hold; a new file stays under 1,000 lines.
- Push only `cloud-lane-60`; open no pull request.
- Singer-facing words follow `docs/house-style/interface-text.md`: "pane", never "band"; "record" for a vowel, "sing" for the modal part only.

## 6. Pictures and gates

After Steps 2, 4, and 5: pictures at 390 by 844 (phone, English and French) and in a desk Drawer at 1440 by 900, for each of the pane's eight states, the test fry's three screens (before, mid-run, no fry heard), and the summary at one, nine, and ten recorded. Look at every picture before you push it. All eight gates at the end, with counts, and the Playwright suites `calibrate-new` and `singer-paths`.

## 7. What the desk could not establish

NOT ESTABLISHED beats a complete invented answer.

- Whether seam B holds without a store module (Step 0 says).
- How much of `CalibrationWizard.svelte` the removals free, and whether that is enough for the seam and the pane's wiring.
- Whether a recorded rustle can be made deterministic enough for a unit test; if not, say what you used.
- Where the three usable counts disagree (section 4).
- How the pane's sentence reads at 390 px in French beside the voice line; show it.

## 8. Reports

`docs/sessions/report-code-n203-lane60-step<N>_r1_<date>.md` for each step, pictures in `docs/sessions/report-code-n203-lane60-pictures/`. Each: what changed with file and line, tests added, gates, what you could not establish, anything for Dann's eye.

## 9. Fable's review of r2, applied (r3)

The review is filed verbatim: `docs/sessions/review-fable-lane60-brief-r2_r1_2026-11-16.md` (verdict SEND WITH AMENDMENTS, five blockers). **Read its section 2 in full; every amendment, 1 to 25, is part of this brief as written there**, with these decisions by the desk:

- **Amendment 2, the cut:** cut `cloud-lane-60` from `Shane` at the tip the prompt names (lane 56 merged; lanes 57 and 58 not yet), as lane 59 was (DESK DEFAULT 2026-11-16 01:4x, in place of "after lanes 56, 57, and 58"). When the desk tells you lanes 57, 58, or 59 are on `Shane`, merge `Shane` and recount the key index (amendment 22). Everything else in amendment 2 stands: the order Step 0, 5, 6, 1, 2, 3, then wait for lane 59, then Step 4 and the end-to-end repairs it lists.
- **Amendment 8, the export lane 59 writes** (sent to lane 59 by the desk 2026-11-16 02:0x): `lib/voice/chart/finish-early.ts` exports `finishEarlyState(profile: Partial<Record<Vowel, CalibratedFormant>>, voiceType: string | undefined): { kind: 'work-out' | 'use-recorded'; remaining: Vowel[]; anyUsable: boolean }`. `restWorkedOut` is `kind === 'work-out'`. Until the merge, pass `false`.
- **Amendment 9:** applied (DESK DEFAULT, narrowing plan r4 section 4.1 item 3).
- **Amendments 13, 16:** `voice/readiness-view.ts` and the stub outcome `no-fry` are the names.
- **Amendment 17:** the desk asks Dann to rustle on purpose on his walk.
- **Amendment 25:** no change to this lane; the GUIDE's rewrite carries it.
- **The review's question 1 (line 5 for a voice with no generic values):** RATIFIED by Dann 2026-11-16 02:07: line 5 reads "You have recorded {n} of the 10 vowels. Ilya fills the other {m} from what you have recorded so far.", French and the one-left form at the end of both sheets ("Line 5" / « Ligne 5 »).
- **The review's question 2 (the first-launch words in the pane):** ship the built words; the desk puts new words to Dann with the pane's pictures, as a words-only amendment.
- **The review's section 5, first two items:** the counted forms and consent captions are at the end of both sheets ("Counted forms and consent captions" / « Formes comptées »), and `docs/sessions/n203-voice-intake/sheet-supplement_r1_2026-11-16.md` is on `Shane`; both were committed after the reviewer's copies.
