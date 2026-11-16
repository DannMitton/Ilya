# Brief to Code: N.203 lane 61, "Describe your voice", "What INSIGHTS shares, and how", and the links (slices 4 and 6)

r1, 2026-11-16, written by the desk (Opus 5.5). For a cloud Code session on branch `cloud-lane-61`, cut from the tip of `Shane` **after lane 60 has merged** (the desk names the commit in the prompt). Not sent until Fable has reviewed it (`CONTRACT.md` §1 item 19). Read first: plan r4 sections 4.6 and 4.7 (`docs/sessions/n203-voice-intake/plan-voice-in-the-drawer_r4_2026-11-15.md`), and lane 60's brief r3 with its review (`docs/sessions/brief-code-n203-lane60-the-voice-pane_r3_2026-11-16.md`, `docs/sessions/review-fable-lane60-brief-r2_r1_2026-11-16.md`), which built the pane this lane adds to.

Paths are under `apps/web/src/` unless they begin with `docs/`. Lines were read by the desk at `Shane` `16922501` (2026-11-16 02:3x) and will have moved after lanes 59 and 60; Step 0 re-reads every one.

## 1. What the singer gets

1. In the VOICE pane at rest, **Describe your voice** opens in place, as NOTATION opens in ANALYSIS: the range, the comfortable working zone, and the passaggio (two notes each), and the five questions on how the voice is doing. No microphone, no recorded vowel, and every answer saves as it changes.
2. **What INSIGHTS shares, and how** opens in place beside it: the topics to comment on, the question on acoustics terms, and how comments appear (how many suggestions, imagery).
3. The INSIGHTS page links to **What INSIGHTS shares, and how**, and its "Add your range" opens **Describe your voice** at the range.
4. Two more links on the INSIGHTS page: where it says its findings rest on generic values for a voice type, a link to record vowels; and in its sentence for a piece with no score, INPUT opens the INPUT pane.
5. The old "Voice characteristics" screen inside the recording takeover is gone.

## 2. The rulings, in Dann's words

In `docs/memory/INBOX.md` and `docs/memory/OPEN.md`, N.203.

| When | His words (short) | What it rules |
|---|---|---|
| 2026-11-15 20:03 | "in Voice there is a whol intakle apparatus for self-reposted voice qualities. We need that in our plan" | Sections 3 and 4 are in scope. |
| 2026-11-15 20:18 | "yes" | "Describe it" has its own door in the pane, open at any time, with no microphone. |
| 2026-11-15 20:20 | "Yes keep them in the Drawer, they are analogous to text;'s Notation section. … yes section 4 gets its own door in the VOICE band, and a link from the INSIGHTS page" | INSIGHTS' settings stay in the Drawer, with their own door and a link from the INSIGHTS page. |
| 2026-11-15 20:20 | "I lkike the practice of linking parts of the complex app to one another … I'm open to other such opportunities for helpful connectivity" | Links between parts. |
| 2026-11-16 01:13, 01:20 | "Yes to all your responses"; "I ratify all of the french" | The sections' names: "Describe your voice" / « Décrire votre voix »; "What INSIGHTS shares, and how" / « Ce que partagent les APERÇUS, et comment » (sheets line 8). |

DESK DEFAULTS (plan r4 section 8, decided 2026-11-16 00:4x): D1, the two sections are stations that open in place, closed on arrival and never stored open, as NOTATION is (`routes/+page.svelte:4028-4040`; `lib/components/Drawer/sections.svelte.ts:70`); D6, links L4 and L6 in this lane, L3 and L5 after the release; D14, the one-panel intake (ratified 2026-09-25, `lib/voice/InsightsIntake.svelte:3`) becomes two, on Dann's ruling of 20:20.

## 3. Steps

Each step is its own commit, test first where a test applies, its own report section with pictures, and a push.

### Step 0. Read and report. Change nothing.

The eight gates with counts; every line cited here, re-read on your tip; line counts of every file you own against `scripts/ratchets.json` (`lib/insights/InsightsPane.svelte` stood at its ceiling, 744 of 744 at `2c07ab75`, 743 after lane 58); how lane 60 built the pane's doors for these two sections (its Step 3, the floor: they open the built characteristics screen in the takeover) and where its pane component lives. Confirm that `voiceIntake.count.5` (the intro's count of five questions) exists in `lib/i18n.ts`, English and French; if it does not, stop and report, because it is new words.

### Step 1. The two stations.

- `lib/voice/InsightsIntake.svelte` (216 lines; "one panel", `:3`) divides along its own line: the five questions on the voice (`BEFORE_TOPICS`, `:29`) go to a "Describe your voice" component; the topics (`TOPICS`, `:30`), the acoustics-terms question, and "How comments appear" go to a "What INSIGHTS shares, and how" component. Neither holds state; both call back for every write, as today (`:15-16`). The intro sentence counts the questions shown (`:35-37`): five in "Describe your voice".
- "Describe your voice" holds, in order: the six `NotePicker`s (range, comfortable working zone, passaggio; today in the characteristics screen, `lib/voice/CalibrationWizard.svelte:1196-1280` by plan r4, with the inverted-pair notes), then the five questions.
- Each is a station of the VOICE pane: a header row that opens it in place, closed on arrival, never stored open, as NOTATION (`routes/+page.svelte:4028-4040`, `expanded={sections.has(STATION_IDS.notation)}`). `STATION_IDS` (`lib/components/Drawer/sections.svelte.ts:70`) gains two wire values; `sections.test.ts:85` pins the list and moves with it. No state line when closed (DESK DEFAULT: none is ratified; words come later if Dann wants one).
- They replace lane 60's two doors that open the takeover. The writes go through lane 60's seam (its published commands, `setOwn` and the note setters); add a command only where lane 60's seam lacks one, and say so.
- Tests: each answer written from a station reaches the stored voice; the stations are closed after a reload; the intro counts five.

### Step 2. The characteristics screen leaves the takeover.

- The phase `characteristics` and its markup leave `lib/voice/CalibrationWizard.svelte`. The request kind `characteristics` (lane 60's `openVoice`) now opens the VOICE pane, opens the station "Describe your voice", and brings it into view; on a phone it raises the Drawer first, as "Add your range" does today (`routes/+page.svelte:1657-1661`, `openRangeFields`). It never opens the takeover.
- The GUIDE's sentence that the characteristics are "entered from the profile summary in the drawer" (`lib/components/Reading/GuideContent.svelte:372`) becomes untrue; leave it and list it in the report for the GUIDE's rewrite.
- Tests: "Add your range" with the Drawer closed and with it open lands on the range pickers in the station; the takeover does not open.

### Step 3. Links L1 and L2.

- **L1.** The INSIGHTS page shows a link whose words are the station's name, "What INSIGHTS shares, and how" / « Ce que partagent les APERÇUS, et comment », in its notes section after the method line (DESK DEFAULT). It opens the VOICE pane, opens that station, and brings it into view; on a phone it raises the Drawer first.
- **L2.** "Add your range" (`routes/+page.svelte:4346`, `onaddrange={openRangeFields}`) opens "Describe your voice" at the range, by Step 2.
- `lib/insights/InsightsPane.svelte` stands at its ceiling. Free lines first (move logic into a module); do not raise the ceiling.

### Step 4. Links L4 and L6 (slice 6).

- **L4.** Where INSIGHTS says its findings rest on placeholder values for a generic voice type (`insights.` key at `lib/i18n.ts:1827` by plan r4), the words of the built sentence stay; a link follows it whose words are the pane's ratified door, "Record your vowels" / « Capter vos voyelles » (sheets line 7), and it opens the takeover on the `record` request (lane 60's `openVoice`).
- **L6.** In the sentence for a piece with no score (sheet line 27, "… Add a score in the INPUT pane to begin."), the word INPUT is a link that opens the INPUT pane and brings it into view; on a phone it raises the Drawer.
- No new words: both links use words already ratified.
- Tests: each link lands where it says, with the Drawer closed and open, on desktop and phone sizes.

## 4. What this lane owns, and what it leaves

Owns: `lib/voice/InsightsIntake.svelte` and the two components it becomes; the two stations in the VOICE group of `routes/+page.svelte`; `lib/components/Drawer/sections.svelte.ts` and its test (the two ids); the `characteristics` phase in `lib/voice/CalibrationWizard.svelte`; `lib/insights/InsightsPane.svelte` (L1, L4, L6); their tests.

Leaves: the take and the capture screen (lane 59), the pane's voice line, sentence, doors, Welcome, the test fry, the summary (lane 60). `lib/voice/NotePicker.svelte` is used as built.

**Other sites that compute the same number.** The intro's question count is computed in the intake component (`InsightsIntake.svelte:35`); after the split each component counts its own. The answers are read by INSIGHTS (`lib/insights/`) from the stored voice's `intake`; the split changes where they are written, never their shape (`@ilya/score-parser`'s `IntakeAnswers`).

## 5. Constraints

- Change nothing under `docs/memory/`, and do not edit, rename, or replace a brief.
- No new dependency. Line ceilings hold; a new file stays under 1,000 lines.
- Push only `cloud-lane-61`; open no pull request.
- Write no English or French beyond the ratified sheets (`docs/sessions/n203-voice-intake/sheet-english_r2_2026-11-16.md`, `sheet-french_r1_2026-11-16.md`); if a word proves necessary, stop that step and say so.
- Singer-facing words follow `docs/house-style/interface-text.md`: "pane", never "band".

## 6. Pictures and gates

After Steps 1, 3, and 4: pictures at 390 by 844 (phone, English and French) and in a desk Drawer at 1440 by 900, of the VOICE pane with each station open, and of each link's landing. Look at every picture before you push it. All eight gates at the end, with counts, and the Playwright suites `calibrate-new` and `singer-paths`.

## 7. What the desk could not establish

NOT ESTABLISHED beats a complete invented answer.

- How lane 60 builds the pane and its seam; Step 0 reads it.
- Whether the six note pickers with their staves fit the pane's width on a 390 px phone; show it.
- Whether `voiceIntake.count.5` exists in both languages.
- Where exactly in INSIGHTS' notes section L1 reads best; place it and show it.

## 8. Reports

`docs/sessions/report-code-n203-lane61-step<N>_r1_<date>.md`, pictures in `docs/sessions/report-code-n203-lane61-pictures/`. Each: what changed with file and line, tests added, gates, what you could not establish, anything for Dann's eye.
