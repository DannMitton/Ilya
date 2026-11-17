# Brief to Code: N.203 lane 61, "Describe your voice", "What INSIGHTS shares, and how", and the links (slices 4 and 6)

r3, 2026-11-16 evening, written by the desk (Opus 5.5) from r1, Fable's review of r1 (`docs/sessions/review-fable-lane61-brief_r1_2026-11-16.md`: DO NOT SEND r1, 7 blockers, 17 amendments), and Fable's delta review of r2 (`docs/sessions/review-fable-lane61-brief-r2-delta_r1_2026-11-16.md`: SEND WITH AMENDMENTS, R1 to R9). Every amendment of both reviews is applied here. r1 and r2 are superseded and kept. For a cloud Code session on branch `cloud-lane-61`, cut from the tip of `Shane` (lane 60 is merged: `079ce6d8`; the desk names the tip in the prompt).

Read first: plan r4 sections 4.6 and 4.7 (`docs/sessions/n203-voice-intake/plan-voice-in-the-drawer_r4_2026-11-15.md`); lane 60's brief r3 and both its reviews (`docs/sessions/brief-code-n203-lane60-the-voice-pane_r3_2026-11-16.md`, `docs/sessions/review-fable-lane60-brief-r2_r1_2026-11-16.md`, `docs/sessions/review-fable-lane60-as-built_r1_2026-11-16.md`); Fable's review of r1, sections 2 to 5.

Paths are under `apps/web/src/` unless they begin with `docs/`, `scripts/`, or `e2e`. Lines were re-read at `Shane` `8f2f93ec`, by Fable's review and by the desk for the seam, `openVoice`, the pane's doors, `STATION_IDS`, the intake's counts, the Drawer's scroll effect, the line ceilings, and the i18n keys named below. Step 0 re-reads every one on your tip.

## 1. What the singer gets

1. In the VOICE pane at rest, **Describe your voice** opens in place, as NOTATION opens in ANALYSIS: the range, the comfortable working zone, and the passaggio (two notes each), then the five questions on how the voice is doing. No microphone, no recorded vowel, nothing to submit: every answer saves as it changes.
2. **What INSIGHTS shares, and how** opens in place beside it: the topics to comment on, the question on acoustics terms, and how comments appear (how many suggestions, imagery).
3. The INSIGHTS page links to **What INSIGHTS shares, and how**, and its "Add your range" opens **Describe your voice** at the range.
4. Two more links on the INSIGHTS page: where it says its findings rest on placeholder values for a voice type, a link to record vowels; and in its sentence for a piece with no score, INPUT opens the INPUT pane.
5. A link that opens a part of the Drawer brings that part into view, so the singer does not hunt for it.
6. The old "Voice characteristics" screen inside the recording takeover is gone.

## 2. The rulings, in Dann's words

In `docs/memory/INBOX.md` and `docs/memory/OPEN.md`, N.203.

| When | His words (short) | What it rules |
|---|---|---|
| 2026-11-15 20:03 | "in Voice there is a whol intakle apparatus for self-reposted voice qualities. We need that in our plan" | Sections 3 and 4 are in scope. |
| 2026-11-15 20:18 | "yes" | "Describe it" has its own door in the pane, open at any time, with no microphone. |
| 2026-11-15 20:20 | "Yes keep them in the Drawer, they are analogous to text;'s Notation section. … yes section 4 gets its own door in the VOICE band, and a link from the INSIGHTS page" | INSIGHTS' settings stay in the Drawer, with their own door and a link from the INSIGHTS page. The two sections behave as NOTATION does. |
| 2026-11-15 20:20 | "I lkike the practice of linking parts of the complex app to one another … I'm open to other such opportunities for helpful connectivity" | Links between parts. |
| 2026-11-16 01:13, 01:20 | "Yes to all your responses"; "I ratify all of the french" | The sections' names, EN and FR (sheets, item 8). |
| 2026-11-16 20:13 | "yes" | A link that opens a part of the Drawer scrolls the Drawer to bring it into view. |

**The scroll ruling, and the comment it changes.** The Drawer's comment "Do not add a third scroll here" (`lib/components/Drawer/Drawer.svelte:973-979`) and the header of `lib/components/Drawer/reveal-scroll.ts:8-11` record a line the desk derived on 2026-09-02 from Dann's principle that the Drawer's opening state is the map of everything and fits without scrolling (`docs/sessions/brief-to-design-n108-drawer-three-groups_r1_2026-09-02.md:20-32`). Its reason, in `reveal-scroll.ts:8-9`: the rule "stood against movement the singer did not ask for". A link the singer presses is her own request, as a word tap is. Rewrite both comments to state the reason, not a count: the Drawer moves only when the singer asks for something it holds (entering the calibration takeover, a word tap, a link that opens a pane or station); opening a station, opening a band, or a pick still opens in place and never scrolls. Cite N.108, N.201, and "Dann 2026-11-16 20:13" in the comment.

DESK DEFAULTS (plan r4 section 8 and this brief): D1, the two sections are stations that open in place, closed on arrival and never stored open, as NOTATION is, with no state line when closed (no words for one are ratified); D6, links L4 and L6 in this lane, L3 and L5 after the release; D14, the one-panel intake (ratified 2026-09-25, `lib/voice/InsightsIntake.svelte:3`) becomes two, on Dann's ruling of 20:20.

## 3. Steps

Each step is its own commit, test first where a test applies, its own report section with pictures, and a push.

### Step 0. Read and report. Change nothing.

The eight gates with counts; every line cited here, re-read on your tip (the table in section 9 is where each stood at `8f2f93ec`); line counts of every file you own against `scripts/ratchets.json` (section 4 gives them). How lane 60 built the pane and its doors (`lib/components/Drawer/VoicePane.svelte`, `voice-pane.ts`) and its seam (`lib/voice/seam.ts`). `voiceIntake.count.5` exists (`lib/i18n.ts:2169`, "Five" / "Cinq"); no check needed.

### Step 1. The two stations.

**The seam.** `lib/voice/seam.ts:28-39` publishes `voices`, `activeId`, `nextDefaultName`, `select`, `create`, `duplicate`, `rename`, `remove`, `setOwn`, and no note setter. Add one command, `setCharacteristic(field, pitch | undefined)`, publishing the wizard's existing function (`CalibrationWizard.svelte:405-417`) where the wizard builds its seam (`:786-798`); move the `CharacteristicField` type (`:379-385`) to `seam.ts`. Change nothing in how it writes. The intake writes go through `setOwn({ intake })`, as the wizard does today (`:1008`). The stations read the stored values the page already holds: `voiceCharacteristics` and `voiceIntake` (`routes/+page.svelte:362`, `:367`, set at `:3903-3910`), and `voiceTypeChoice?.voiceType` for each picker's clef (`NotePicker.svelte:53-57`). The inverted-pair tests (`CalibrationWizard.svelte:429-439`) move with the pickers into a pure function with a unit test. The Describe component loads the notation font itself with `loadNotationFont()`, as the wizard does (`:364-377`). `setCharacteristic` calls `touchVoice` (`:415`). `touchVoice` (`lib/voice/profileStore.ts:163-166`) sets `calibratedAt` only when it is absent, to the previous `updatedAt`, then moves `updatedAt`; the wizard publishes `calibratedAt ?? updatedAt` (`CalibrationWizard.svelte:780`), so the date INSIGHTS prints stays. Keep `touchVoice`, and test that a note written from a station leaves `calibratedAt` as it was.

**The split.** `lib/voice/InsightsIntake.svelte` (216 lines; "one panel", `:3`) divides along its own line: the five questions on the voice (`BEFORE_TOPICS`, `:33`) go to a "Describe your voice" component; the topics (`TOPICS`, `:34`), the acoustics-terms question, and "How comments appear" go to a "What INSIGHTS shares, and how" component. Neither holds state; both call back for every write, as today (`:15-16`). `tidy` (`:43-51`) is used by both: put it in one module with a unit test, because each component writes the whole `intake` object (`:53-59`, `:113`, `:123`) and two copies of `tidy` could store different shapes. The voice type control (`CalibrationWizard.svelte:941`) is not copied into a station: it lives in the voice line (`VoicePane.svelte:57-62`).

**What each component draws.** "Describe your voice", in order: the lede `calib.characteristics.lede` (`i18n.ts:1444`, built words, kept as they are; Fable's A6 held this back for a ruling; the desk draws it on the review's recommendation 6.4, DESK DEFAULT, and Dann may strike or reword it); the six `NotePicker`s (range, comfortable working zone, passaggio) with their headings, hints, and the inverted-pair notes (`calib.characteristics.*`, `i18n.ts:1445-1457`; markup today `CalibrationWizard.svelte:944-1002`); then `voiceIntake.intro` with `voiceIntake.count.5` (`i18n.ts:2165`, `:2169`), counted as `BEFORE_TOPICS.length`; then the five questions. "What INSIGHTS shares, and how": the topics, the acoustics question, and "How comments appear", with **no intro** (DESK DEFAULT: the built formula would print "Two quick questions so INSIGHTS understands your voice ..." (`InsightsIntake.svelte:39-40`), a sentence nobody has seen in that form; the station's name says what it holds).

**The tests that move.** `lib/voice/intake-symbols.test.ts:5` and `:33` import and render `InsightsIntake.svelte` to pin the acoustics stem's symbols and the French `<em>` in the stems (`InsightsIntake.svelte:46-50`). The acoustics question goes to the INSIGHTS component and the `<em>passaggi</em>`, `<em>piano</em>` stems to the Describe component; move each assertion to the component that draws it. Lose none.

**The stations.** `STATION_IDS` (`lib/components/Drawer/sections.svelte.ts:70`) gains two wire values. Both also join `UNPERSISTED_STATIONS` (`:62`), which is what "never stored open" means in this tree (read at `routes/+page.svelte:340`). `sections.test.ts:85` pins the id list; `:90`, `:99`, `:199-201` loop it; `:397` hard-codes `unpersisted: ['notation']`. On a phone, stations are one at a time across the whole station tier (`sections.svelte.ts:118-124`, `:140-142`, `:408-420`; `routes/+page.svelte:3604`): opening one of the two shuts the other, and shuts NOTATION. That is the ruled behaviour; test it and show it. Use `StationHeader.svelte` for each header (pass `ontoggle`, `expanded`, `controls`), as `NotationFields.svelte:115-121` does. The stations mount inside `VoicePane.svelte`, not in the page (section 4, ceilings). The two doors that open the takeover for these sections (`VoicePane.svelte:69-70`, both `onopen('characteristics')`) are removed; the stations sit below the doors that remain.

**Tests:** each answer and each note written from a station reaches the stored voice; `calibratedAt` does not move; the stations are closed after a reload; the intro counts five; on a phone the stations are one at a time.

### Step 2. The characteristics screen leaves the takeover, and the page opens stations.

**What leaves.** `'characteristics'` leaves `VoiceRequestKind` and `Landing` (`seam.ts:14`, `:41`), the wizard's `Phase` (`CalibrationWizard.svelte:122`), its markup (`:929-1014`) and CSS (`.charx-*`, `:1193-1227`; move what the stations need, and note `VoiceTypeIntake.svelte:147` refers to `.charx-heading`), and the imports that become unused (`:59`, `:64`, `:71`). `seam.test.ts:9-13` and `:25` change with it. Lower the wizard's ceiling in `scripts/ratchets.json` to its new count at the end of the lane.

**`openStation`.** The page gets a function beside `openVoice` (`routes/+page.svelte:1664-1672`): `openStation(which: 'describe' | 'insights', at?: 'range')`. In order:

1. **The takeover.** If the takeover is up (`calibrating`), the press goes to the wizard so that it applies `requestRefused` (`seam.ts:57-59`) from its own phase (`CalibrationWizard.svelte:335`; the page already sends `fromRest: !calibrating`, `routes/+page.svelte:1670`): over the capture screen it is dropped and never answered later, as "Add your range" is today (`e2e/voice-pane.test.ts:247-264`); over any other takeover screen the wizard leaves the takeover and the steps below run. DESK DEFAULT. Add no take-running flag to the seam (`seam.ts:8-9`). Since `'characteristics'` leaves `VoiceRequestKind` (above), this press needs its own kind: add `'leave'` to `VoiceRequestKind` (`seam.ts:14`), not to `Landing`, and keep `requestRefused` as it is. In the wizard's effect (`CalibrationWizard.svelte:330-340`), a `'leave'` request that is not refused calls a new callback and does not call `landingFor` or `resetFlow`. The page opens the station from that callback only. Do not use `onComplete` (`:742`; `routes/+page.svelte:3900`) for this: Finish calls it too, and a press refused over the capture screen would then be answered at the next Finish (`seam.ts:55`; `e2e/voice-pane.test.ts:258-261`). Add `'leave'` to `seam.test.ts`. Leaving from the test fry already releases the microphone (`CalibrationWizard.svelte:561`, `:575`); test it.
2. On a phone, `drawerRaised = true`.
3. `sections.reveal(BAND_IDS.scoreMarkup)`, the VOICE band's id (`Drawer.svelte:550-556`).
4. With no voice saved, stop there, as `openVoice` does (`routes/+page.svelte:1666-1669`): the pane shows its first-launch form (`VoicePane.svelte:43`, `:56`).
5. `sections.reveal(<station id>)`.
6. Ask the Drawer to bring the station's header into view, or the Range heading when `at === 'range'` (section 2, the scroll ruling). Generalize the Drawer's reveal (`revealRequest`, `Drawer.svelte:394-414`, which today looks only for `[data-band-head="analysis"]`) to carry a target, and put the decision in `reveal-scroll.ts` with unit tests in `reveal-scroll.test.ts`. Keep the word tap's behaviour unchanged; its tests change none of their expectations: `reveal-scroll.test.ts:12-34`, `e2e-phone/word-tap-opens-analysis.test.ts`, `e2e/word-tap-opens-analysis.test.ts`. Two things in the tree stand against a link's reveal, and both are yours: (i) leaving the takeover restores the stowed scroll in a `requestAnimationFrame` (`Drawer.svelte:373-387`, write at `:383-385`), after the reveal's `tick()` (`:399`), so a reveal asked for in the same turn as the exit must win over the restore; (ii) `revealScrollTop` sends a phone to 0 for every request (`reveal-scroll.ts:38`). Keep that for the word tap. For a link's target on a phone, use the desk rule (`:39-42`): move only when the target is outside the window, and align its top to the window's top (DESK DEFAULT). Unit-test both. The e2e case that leaves the takeover and lands asserts the target is in view after the restore has run.

Rewrite the comment at `routes/+page.svelte:1651-1656` (it names `openRangeFields`, now gone) and the wizard's at `:199-200`, and the two scroll comments (section 2).

**"Add your range"** (`routes/+page.svelte:4358`, today `onaddrange={() => openVoice('characteristics')}`) calls `openStation('describe', 'range')`.

**The GUIDE.** `GuideContent.svelte:389` (English) and `:85` (French: « saisies depuis le sommaire du profil dans le Tiroir ») say the characteristics are entered from the profile summary. Both are already untrue at this tip. Leave both and list both in the report for the GUIDE's rewrite.

**Keys.** After this step `calib.characteristics.title` (`i18n.ts:1443`) and `.doneButton` (`:1458`) have no reader. DESK DEFAULT: delete none. `.editButton`, `.addButton`, and `calib.summary.savedLede` are already marked (`i18n.ts:1285`, `:1287`, `:1415`, "UNUSED SINCE N.203 lane 60 Step 5"); leave them. Mark `.title` and `.doneButton` in the same form, `UNUSED SINCE N.203 lane 61 Step 2`. No test reads for a key's reader (`i18n-index.test.ts:40-64`), and `i18n.ts` has no line ceiling (`scripts/ratchets.json:5`). `calib.characteristics.lede` stays in use (Step 1).

**Tests:** `e2e/voice-pane.test.ts:120-130` (each door opens the heading "Voice characteristics", then Done) and `:247-264` (the range link lands on that heading) become untrue; rewrite both to the stations, keeping the assertions that `calibratedAt` does not move (`:128`) and that a press over the capture screen is dropped and never answered later (`:250-256`). New: "Add your range" with the Drawer closed and with it open, on desktop and phone sizes, lands on the range pickers in the station and they are in view; the takeover does not open; with the takeover up on Welcome or the summary, it leaves the takeover and lands; with no voice saved, the pane shows its first-launch form.

### Step 3. Links L1 and L2.

**L1.** A link whose words are `calib.pane.door.insights` ("What INSIGHTS shares, and how" / « Ce que partagent les APERÇUS, et comment », `i18n.ts:1434`), drawn in `lib/insights/SingerBlock.svelte` after the Method line (`:165-170`), styled as `.offer-link` is (`:562-568`). It calls `openStation('insights')`. Add an optional callback through `lib/insights/InsightsPane.svelte` (`:89-144`, `:531-542`) to the page. Do not add a field to the notes block (`lib/insights/singer-blocks.ts:377-379`) unless `singer-blocks.test.ts:249` moves with it. The link is not drawn when no voice is saved; it is not drawn in the measuring pass if its height would change the page fill; it is hidden in print, as `.try-key`, `.offer-decline`, and `.tempo-link` are (`SingerBlock.svelte:593-606`).

**L2.** "Add your range" (`SingerBlock.svelte:88`) opens "Describe your voice" at the range, by Step 2.

**Tests:** `e2e/print-pages.test.ts` and `e2e/pages-without-gaps.test.ts` pass; L1 lands with the Drawer closed and open, on desktop and phone sizes.

### Step 4. Links L4 and L6 (slice 6).

**L4.** Where the Method line's key is one of the three generic keys (`insights.method.generic.typed`, `.untyped`, `insights.method.noScore.generic`; `identity.ts:66-70`, `i18n.ts:1876-1877`, `:1884`), a link follows it in the notes block, beside L1, in `SingerBlock.svelte`. `SingerBlock.svelte` receives the Method line as a string (`:170`, `{block.method}`), not its key: pass one boolean from `InsightsPane.svelte`, computed where `methodLineKey` is called (`:288-293`) from `adapted.generic` (`identity.ts:66-70`: every generic key has `generic` true), unless the notes block's shape changes with `singer-blocks.test.ts:249`. `InsightsPane.svelte` has 1 free line (743 of 744). The link's words are the pane's record door's own words for the voice's state, `recordDoorKey(usable)` (`voice-pane.ts:61-63`; `i18n.ts:1429-1431`: "Record your vowels", "Carry on recording", "Record a vowel again"), so the page and the pane name the same door alike (DESK DEFAULT). `InsightsPane.svelte` holds no usable count (grep, `8f2f93ec`); the page computes it for the pane already (`usableReadingCount(voiceFormants)`, `routes/+page.svelte:4179`), so the page passes the key with L4's callback, and the free lines come from the moves named in section 4. It calls `openVoice('record')`; over the capture screen it is refused as built (`seam.ts:57-59`). DESK DEFAULT: the notes block, not beside the header's lede (`insights.generic.lede`, drawn by `lib/components/Paper/TitleHeader.svelte:202-203`, a component shared with the marked score); `TitleHeader.svelte` is not touched. Hidden in print, as L1.

**L6.** In the sentence for a piece with no score (`insights.silence.noScore`, `i18n.ts:1881`; built as one string at `InsightsPane.svelte:328`, drawn by `SingerBlock.svelte:84` through `rich`, `:56`), the word INPUT / ENTRÉE (`group.input`, `i18n.ts:168`) is a link. Both strings stay one key each, character for character (`ratified-lines.test.ts:418-419`; `e2e/insights-no-score.test.ts:30-32` reads the sentence as inner text). Draw the link by splitting the drawn string on `t('group.input', language)` in `SingerBlock.svelte` for the `silence` block (`:81-84`), not by editing `richParts` (`text-parts-notation.test.ts:21-23` reads `SingerBlock.svelte`'s source for `{#if p.sub}<sub>{p.text}</sub>`; keep that text). It raises the Drawer on a phone, calls `sections.reveal(BAND_IDS.input)` (as `routes/+page.svelte:3187`), and brings the INPUT band's head into view through the Step 2 reveal. With the takeover up, L6 goes through the same path as `openStation` item 1: dropped over the capture screen, otherwise the takeover is left and INPUT opens. The reveal does nothing while the takeover is up (`Drawer.svelte:401`).

No new words: both links use words already built and ratified.

**Tests:** each link lands where it says, with the Drawer closed and open, on desktop and phone sizes; L6 with the takeover up on the summary; the no-score sentence's inner text is unchanged in both languages (`e2e/insights-no-score.test.ts:30-32`); nothing of either link prints.

## 4. What this lane owns, and what it leaves

**Owns:** `lib/voice/InsightsIntake.svelte` and the two components and one module it becomes; `lib/voice/intake-symbols.test.ts`; `lib/voice/seam.ts` and `seam.test.ts`; `lib/voice/CalibrationWizard.svelte` (the characteristics phase and the seam's publication, nothing else); `lib/components/Drawer/VoicePane.svelte` (the two doors leave, the stations mount) and `voice-pane.ts` if a rule moves there; `lib/components/Drawer/sections.svelte.ts` and `sections.test.ts`; `lib/components/Drawer/Drawer.svelte` (the reveal effect, the takeover's stow and restore at `:373-387`, the prop's comment at `:148-152`, and the scroll comment) and `reveal-scroll.ts` with `reveal-scroll.test.ts`; the VOICE group and `openVoice`'s neighbourhood in `routes/+page.svelte`; `lib/insights/InsightsPane.svelte`, `SingerBlock.svelte`, and, only if the notes block's shape changes, `singer-blocks.ts` with `singer-blocks.test.ts`; `e2e/voice-pane.test.ts`; new e2e files for the stations and links, with phone-size cases in `e2e-phone/`; `lib/i18n.ts` only for the UNUSED comments (Step 2); `scripts/ratchets.json` only to lower the wizard's ceiling.

**Not owned:** `lib/components/Paper/TitleHeader.svelte`, `lib/voice/NotePicker.svelte` (used as built), `GuideContent.svelte`, the take and the capture screen (lane 59), the pane's voice line, sentence, remaining doors, Welcome, the test fry, and the summary (lane 60).

**Line ceilings** (`scripts/ratchets.json`; `wc -l` at `8f2f93ec`): `routes/+page.svelte` 5,523 of 5,534 (11 free, `:8`); `InsightsPane.svelte` 743 of 744 (1 free, `:18`); `Drawer.svelte` 1,983 of 1,990 (7 free, `:15`); `CalibrationWizard.svelte` 1,293 of a stale 1,727 (`:14`). Raise no ceiling. The stations mount inside `VoicePane.svelte` (142 lines, no ceiling, 1,000 limit): the page passes its new props on the existing `<VoicePane` lines (`routes/+page.svelte:4179-4180`), whose text `voice-pane-usable.test.ts:19-21` pins by pattern. Free lines in the page at `:1651-1656` (a comment that is now untrue) and in the long comment above the pane (`:4097-4168`), part of which describes the anchor lane 60 replaced. `InsightsPane.svelte` needs about two lines for callbacks: free them by moving `methodLine` (`:288-293`) or the no-score block list (`:326-330`) into `singer-blocks.ts` or `identity.ts`. In `Drawer.svelte`, lines come from the comments: the scroll comment is 7 lines (`:973-979`), and the reveal effect's comment (`:389-393`) and the prop's (`:148-152`) are 5 each; all three name the word tap alone and are rewritten together.

**Other sites that compute the same number.** The intro's question count has one site, `InsightsIntake.svelte:39-40` (Fable's grep for `voiceIntake.count`, `questionCount`, `BEFORE_TOPICS` across `src`, `e2e`, `e2e-phone` found no other). After the split the Describe component's count is `BEFORE_TOPICS.length` (five); the INSIGHTS component computes none. The answers are read by INSIGHTS (`lib/insights/`) from the stored voice's `intake`; the split changes where they are written, never their shape (`@ilya/score-parser`'s `IntakeAnswers`, imported at `InsightsIntake.svelte:18`). The Drawer's scroll decision has one site after Step 2, `reveal-scroll.ts`, shared by the word tap and the links.

## 5. Constraints

- Change nothing under `docs/memory/`, and do not edit, rename, or replace a brief.
- No new dependency. Line ceilings hold; a new file stays under 1,000 lines.
- Push only `cloud-lane-61`; open no pull request.
- Write no English or French beyond the ratified sheets (`docs/sessions/n203-voice-intake/sheet-english_r2_2026-11-16.md`, `sheet-french_r1_2026-11-16.md`, `sheet-supplement_r1_2026-11-16.md`) and the keys this brief names. The station headers, links, and every question use built keys; no key is added. If a word proves necessary, stop that step and say so.
- Singer-facing words follow `docs/house-style/interface-text.md`: "pane", never "band".

## 6. Pictures and gates

After Steps 1, 2, 3, and 4: pictures at 390 by 844 (phone, English and French) and in a desk Drawer at 1440 by 900, of: the VOICE pane with both stations closed (what it looks like on arrival); each station open; the Describe station on a phone scrolled to its last question; the range link's landing with a filled range and with an inverted pair; each link's landing; L1 and L4 in French on a full INSIGHTS page; the printed INSIGHTS page (no link words printed). Look at every picture before you push it. All eight gates at the end, with counts, and the Playwright suites `calibrate-new`, `singer-paths`, `print-pages`, and `pages-without-gaps`.

## 7. What the desk could not establish

NOT ESTABLISHED beats a complete invented answer.

- Whether the six note pickers with their staves fit a 390 px phone's pane width. Each staff is 150 by 136 px and its row wraps (`NotePicker.svelte:116-117`, `:312-316`), so six staves are about 816 px of height before the first question. Show it.
- How the wizard hands control back to the page after leaving the takeover for a station (Step 2, item 1).
- Whether a link in the notes block changes the INSIGHTS page fill or the print.

## 8. Reports

`docs/sessions/report-code-n203-lane61-step<N>_r1_<date>.md`, pictures in `docs/sessions/report-code-n203-lane61-pictures/`. Each: what changed with file and line, tests added, gates, what you could not establish, anything for Dann's eye. The last report lists the GUIDE lines left untrue (Step 2) and the keys marked UNUSED.

## 9. Where each cite stood at `8f2f93ec`

From Fable's review, section 4, with r1's cites corrected.

| Thing | At `8f2f93ec` |
|---|---|
| NOTATION station | `routes/+page.svelte:4043-4055`; `expanded=` at `:4052` |
| `STATION_IDS`, `UNPERSISTED_STATIONS` | `sections.svelte.ts:70`, `:62` |
| `BEFORE_TOPICS`, `TOPICS`, count, intro | `InsightsIntake.svelte:33`, `:34`, `:39`, `:40` |
| Characteristics phase | `CalibrationWizard.svelte:929-1014`; pickers `:944-1002`; CSS `:1193-1227` |
| `openVoice` (was `openRangeFields`) | `routes/+page.svelte:1664-1672` |
| "Add your range" | `routes/+page.svelte:4358`; drawn `SingerBlock.svelte:88` |
| The two doors | `VoicePane.svelte:69-70` |
| The seam's commands | `seam.ts:28-39` |
| The Drawer's reveal | `Drawer.svelte:394-414`; comment `:973-979` |
| GUIDE | `GuideContent.svelte:389` (EN), `:85` (FR) |
| Placeholder lede | `insights.generic.lede`, `i18n.ts:1874` |
| No-score sentence | `insights.silence.noScore`, `i18n.ts:1881` |
| Sheet items 7, 8, 27 | English r2 `:15`, `:16`, `:44`; French r1 `:14`, `:15`, `:34` |
