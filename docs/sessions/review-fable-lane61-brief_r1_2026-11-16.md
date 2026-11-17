<!-- Filed verbatim by the desk (Opus 5.5) 2026-11-16 evening. Fable 5.2 subagent, read-only, at Shane 8f2f93ec, cap 400k; harness token count NOT ESTABLISHED (not shown to the desk). Map: packet-sonnet-lane61-brief_r1_2026-11-16.md. -->

# Review memo: brief r1 for N.203 lane 61 ("Describe your voice", "What INSIGHTS shares, and how", and the links)

Reviewed read-only at `Shane` `8f2f93ec` (`git log --oneline -3`: `8f2f93ec`, `079ce6d8`, `4df96a85`). Paths are under `apps/web/src/` unless they begin with `docs/`, `scripts/`, or `e2e`. I ran no test and no gate.

## 1. Verdict

**DO NOT SEND r1; send r2 once the amendments below are applied.** As written, the brief names seam commands that do not exist, a function that is gone, an Owns list that misses most of the files the four links are drawn in, and a "bring into view" that the Drawer's own comment forbids, so a Code session would have to guess on each.

## 2. Blockers

1. **The seam has no note setter.** Brief Step 1 says the writes go through "its published commands, `setOwn` and the note setters". `lib/voice/seam.ts:28-39` publishes `voices, activeId, nextDefaultName, select, create, duplicate, rename, remove, setOwn`, and nothing else. The only writer of the six notes is private to the wizard: `lib/voice/CalibrationWizard.svelte:405-417` (`setCharacteristic`), published nowhere (`:786-798`).
2. **`openRangeFields` is gone, and `openVoice` always enters the takeover.** Brief Step 2 and L2 cite `routes/+page.svelte:1657-1661` and `:4346`. At HEAD the function is `openVoice` (`routes/+page.svelte:1664-1672`); it ends in `enterCalibration()` (`:1671`), and `:4358` reads `onaddrange={() => openVoice('characteristics')}`. A request that "never opens the takeover" needs a page-side branch the brief does not specify.
3. **One request kind cannot serve three landings.** Both pane doors send `characteristics` (`lib/components/Drawer/VoicePane.svelte:69-70`), and so does "Add your range" (`routes/+page.svelte:4358`). `VoiceRequestKind` is `'record' | 'summary' | 'characteristics'` (`seam.ts:14`). The brief asks for three landings (the Describe station, the INSIGHTS station, the range inside Describe) and names one kind.
4. **"Brings it into view" is a third Drawer scroll, which the tree forbids in words.** `lib/components/Drawer/Drawer.svelte:968-974`: "N.108: the drawer never scrolls itself, except on entry to the calibration takeover ... N.201 names the second exception: a word tap ... A station opening, a band opening, or a pick still opens IN PLACE. Do not add a third scroll here." The one scroll effect looks only for `[data-band-head="analysis"]` (`Drawer.svelte:394-414`), and `reveal-scroll.ts:8-11` calls it "THE ONE EXCEPTION". Steps 2, 3 (L1), and 4 (L6) each need a scroll. `Drawer.svelte` and `reveal-scroll.ts` are not in Owns, and `Drawer.svelte` is 1,983 of 1,990 lines (`scripts/ratchets.json:15`). This is a ruling to cite or to obtain (item 6.1), not a detail for Code.
5. **The Owns list misses where L1, L4, L6, and L2 are drawn.** None of the four is drawn in `lib/insights/InsightsPane.svelte`:
   - L2's button: `lib/insights/SingerBlock.svelte:88`.
   - L6's sentence: built as one string at `InsightsPane.svelte:328`, drawn by `SingerBlock.svelte:84` through `rich` (`:56`), which has no link part (`lib/insights/text-parts.ts:52-63`).
   - L1's place "after the method line": `SingerBlock.svelte:165-170`; the block's shape is `lib/insights/singer-blocks.ts:377-379`, pinned exactly at `singer-blocks.test.ts:249`.
   - L4's sentence, if it is `insights.generic.lede`: passed as a string at `InsightsPane.svelte:518` and drawn by `lib/components/Paper/TitleHeader.svelte:202-203`, a component shared by `markup/MarkupPane.svelte` and `Paper/TitlePage.svelte` (grep for `TitleHeader`).
6. **The takeover case is unspecified for every link.** The takeover stows the Drawer's content (`Drawer.svelte:448`, `class:stowed={takeoverActive}`), and INSIGHTS stays on the page beside it at a desk. A press of "Add your range", L1, or L6 while the takeover is up would open a station or pane the singer cannot see. Today's rule refuses only over the capture screen (`seam.ts:57-59`; `CalibrationWizard.svelte:335`), and `e2e/voice-pane.test.ts:247-264` pins that. The brief says only "It never opens the takeover".
7. **No-voice case is unspecified for L1.** The pane draws nothing but the first-launch form when no voice is saved (`VoicePane.svelte:43`, `:56`), so the stations do not exist then; the notes block is drawn in every state, including no score and no voice (`InsightsPane.svelte:329`, `:342`).

## 3. Amendments (paste-ready for r2)

**A1. Header paragraph and Step 0.** Replace "Lines were read by the desk at `Shane` `16922501`" with: "Lines were re-read at `Shane` `8f2f93ec`; the table in section 9 gives each." Add the table from item 4 below. Replace the review file name in "Read first" with both lane 60 reviews: `review-fable-lane60-brief-r2_r1_2026-11-16.md` and `review-fable-lane60-as-built_r1_2026-11-16.md` (both exist in `docs/sessions/`). In Step 0, strike "Confirm that `voiceIntake.count.5` exists": it exists, `lib/i18n.ts:2169` ("Five" / "Cinq").

**A2. Step 1, the seam (replaces "The writes go through lane 60's seam ...").** "The seam (`lib/voice/seam.ts:28-39`) publishes `setOwn` and no note setter. Add one command, `setCharacteristic(field, pitch | undefined)`, publishing the wizard's existing function (`CalibrationWizard.svelte:405-417`) at `:786-798`; move the `CharacteristicField` type (`:379-385`) to `seam.ts`. Change nothing in how it writes. The intake writes go through `setOwn({ intake })`, as the wizard does today (`:1008`). The stations read the stored values the page already holds: `voiceCharacteristics` and `voiceIntake` (`routes/+page.svelte:362`, `:367`, set at `:3903-3910`), and `voiceTypeChoice?.voiceType` for each picker's clef (`NotePicker.svelte:53-57`). The inverted-pair tests (`CalibrationWizard.svelte:429-439`) move with the pickers into a pure function with a unit test. The Describe component loads the notation font itself with `loadNotationFont()` as the wizard does (`:364-377`)."

**A3. Step 1, what leaves and what stays.** Add: "The voice type control (`CalibrationWizard.svelte:941`) is not copied into a station: it lives in the voice line (`VoicePane.svelte:57-62`; plan r4 section 4.6, first bullet). `tidy` (`InsightsIntake.svelte:43-51`) is used by both components; put it in one module with a unit test, because each component writes the whole `intake` object (`:53-59`, `:113`, `:123`) and two copies of `tidy` could store different shapes."

**A4. Step 1, the file `InsightsIntake.svelte`.** Add: "`lib/voice/intake-symbols.test.ts:5` and `:33` import and render `InsightsIntake.svelte` to pin the acoustics stem's symbols and the French `<em>` in the stems (`:46-50`). The acoustics question goes to the INSIGHTS component and the `<em>passaggi</em>`, `<em>piano</em>` stems to the Describe component; move each assertion to the component that draws it. Lose none."

**A5. Step 1, the stations.** Replace the `STATION_IDS` sentence with: "`STATION_IDS` (`sections.svelte.ts:70`) gains two wire values. Both also join `UNPERSISTED_STATIONS` (`sections.svelte.ts:62`), which is what 'never stored open' means in this tree (read at `routes/+page.svelte:340`). `sections.test.ts:85` pins the id list; `:90`, `:99`, `:199-201` loop it; `:397` hard-codes `unpersisted: ['notation']`. On a phone, stations are one at a time across the whole station tier (`sections.svelte.ts:118-124`, `:140-142`, `:408-420`; `routes/+page.svelte:3604`): opening one of the two shuts the other, and shuts NOTATION. That is the ruled behaviour; test it and show it. Use `StationHeader.svelte` for each header (pass `ontoggle`, `expanded`, `controls`), as `NotationFields.svelte:115-121` does. The two doors at `VoicePane.svelte:69-70` are removed; the stations sit below the doors that remain."

**A6. Step 1, the intro.** Replace "The intro sentence counts the questions shown: five in 'Describe your voice'" with: "The Describe component draws `voiceIntake.intro` with `voiceIntake.count.5` above the five questions (below the pickers). The INSIGHTS component draws **no intro** until Dann rules one (see 'For Dann's eye'): with the built formula it would read 'Two quick questions so INSIGHTS understands your voice ...' (`InsightsIntake.svelte:39-40`; `i18n.ts:2165-2166`), a sentence nobody has seen in that form. `calib.characteristics.lede` (`i18n.ts:1444`) is not drawn until Dann rules it (same list)."

**A7. Step 2, replacement for the first bullet.** "`'characteristics'` leaves `VoiceRequestKind` and `Landing` (`seam.ts:14`, `:41`), the wizard's `Phase` (`CalibrationWizard.svelte:122`), its markup (`:929-1014`) and CSS (`.charx-*`, `:1193-1227`; move what the stations need, and note `VoiceTypeIntake.svelte:147` refers to `.charx-heading`), and the imports that become unused (`:59`, `:64`, `:71`). `seam.test.ts:9-13` and `:25` change with it. The page gets a second function beside `openVoice` (`routes/+page.svelte:1664-1672`), which never sets `calibrationRequest`: `openStation(which: 'describe' | 'insights', at?: 'range')`. It (a) does nothing while the takeover is up on the capture screen, and otherwise calls `exitCalibration()` first if the takeover is up [DESK DEFAULT, to confirm or change in r2; the wizard's phase is not published across the seam (`seam.ts:8-9`), so say how the page learns it or choose 'exit always']; (b) on a phone sets `drawerRaised = true`; (c) `sections.reveal(BAND_IDS.scoreMarkup)`, the VOICE band's id (`Drawer.svelte:550-556`); (d) with no voice saved stops there, as `openVoice` does (`:1666-1669`); (e) `sections.reveal(<station id>)`; (f) asks the Drawer to bring the station's header, or the Range heading when `at === 'range'`, into view. Step (f) is the third scroll of blocker 4: it is built only on Dann's ruling, in `Drawer.svelte:394-414` and `reveal-scroll.ts`, generalizing `revealRequest` to carry a target, with unit tests in `reveal-scroll.test.ts`. The stale comment at `routes/+page.svelte:1651-1656` and the wizard's at `:199-200` are rewritten."

**A8. Step 2, the GUIDE.** Replace the cite with: "`GuideContent.svelte:389` (English) and `:85` (French: « saisies depuis le sommaire du profil dans le Tiroir »). Both are already untrue at this tip; leave both and list both."

**A9. Step 3, L1.** Replace with: "L1 is drawn in `SingerBlock.svelte` after `:170`, as a control like `.offer-link` (`:562-568`). Add an optional callback through `InsightsPane.svelte` (`:89-144`, `:531-542`) to the page. Do not add a field to the notes block unless `singer-blocks.test.ts:249` moves with it. The link is not drawn when no voice is saved, and not drawn in the measuring pass if its height would change the page fill; it is hidden in print (`SingerBlock.svelte:593-606` hides `.try-key`, `.offer-decline`, `.tempo-link`). Run `e2e/print-pages.test.ts` and `e2e/pages-without-gaps.test.ts`, and show the notes section on a full page."

**A10. Step 4, L4.** Replace "(`insights.` key at `lib/i18n.ts:1827` by plan r4)" with a named key. Three built strings fit the brief's description: `insights.generic.lede` (`i18n.ts:1874`, in the page header through `TitleHeader.svelte:202-203`), `insights.method.generic.typed` and `.untyped` (`:1876-1877`, in the notes), and `insights.method.noScore.generic` (`:1884`). Recommended wording: "L4 follows the Method line when its key is one of the three generic ones (`identity.ts:66-70`), in the notes block beside L1, in `SingerBlock.svelte`. `TitleHeader.svelte` is not touched." Cost: the link sits at the foot of the page, not beside the lede; gain: no change to a component shared with the marked score. L4 calls `openVoice('record')`; over the capture screen it is refused as built (`seam.ts:57-59`).

**A11. Step 4, L6.** Add: "The French link word is ENTRÉE (`i18n.ts:168`; sentence at `:1881`). Both strings stay one key each, character for character (`ratified-lines.test.ts:418-419`; `e2e/insights-no-score.test.ts:30-32` reads the sentence as inner text). Draw the link by splitting the drawn string on `t('group.input', language)` in `SingerBlock.svelte` for the `silence` block (`:81-84`), not by editing `richParts` (`text-parts-notation.test.ts:21-23` reads `SingerBlock.svelte`'s source for `{#if p.sub}<sub>{p.text}</sub>`; keep that text). It opens with `sections.reveal(BAND_IDS.input)` (as `routes/+page.svelte:3187`) after raising the Drawer on a phone."

**A12. Section 4, Owns (replacement).** "Owns: `lib/voice/InsightsIntake.svelte` and the two components and one module it becomes; `lib/voice/intake-symbols.test.ts`; `lib/voice/seam.ts` and `seam.test.ts`; `lib/voice/CalibrationWizard.svelte` (the characteristics phase, the seam's publication, nothing else); `lib/components/Drawer/VoicePane.svelte` (the two doors leave; the stations mount) and `voice-pane.ts` if a rule moves there; `lib/components/Drawer/sections.svelte.ts` and `sections.test.ts`; `lib/components/Drawer/Drawer.svelte` and `reveal-scroll.ts` with its test (only if Dann rules the scroll); the VOICE group and `openVoice`'s neighbourhood in `routes/+page.svelte`; `lib/insights/InsightsPane.svelte`, `SingerBlock.svelte`, and, only if the notes block's shape changes, `singer-blocks.ts` with `singer-blocks.test.ts`; `e2e/voice-pane.test.ts`; new e2e files for the stations and links, with phone-size cases in `e2e-phone/`; `lib/i18n.ts` only to delete keys (A14). Not owned: `lib/components/Paper/TitleHeader.svelte`, `lib/voice/NotePicker.svelte`, `GuideContent.svelte`."

**A13. Section 4, line ceilings (new paragraph).** "`routes/+page.svelte` is 5,523 of 5,534 (11 free); `InsightsPane.svelte` 743 of 744 (1 free); `Drawer.svelte` 1,983 of 1,990 (7 free); `CalibrationWizard.svelte` 1,293 of a stale 1,727 (`scripts/ratchets.json:8`, `:18`, `:15`, `:14`; `wc -l`). The stations mount inside `VoicePane.svelte` (142 lines, no ceiling, 1,000 limit), not in the page: the page passes four more props on the existing `<VoicePane` lines (`routes/+page.svelte:4179-4180`), whose text `voice-pane-usable.test.ts:19-21` pins by pattern. Lines can be freed in the page at `:1651-1656` (a six-line comment that is now untrue) and in the long comment above the pane (`:4097-4168`), part of which describes the anchor that lane 60 replaced. `InsightsPane.svelte` needs about two lines for callbacks; free them by moving `methodLine` (`:288-293`) or the no-score block list (`:326-330`) into `singer-blocks.ts` or `identity.ts`. Lower the wizard's ceiling to its new count at the end."

**A14. Section 4, the count paragraph (replacement).** "The intro's count has one site, `InsightsIntake.svelte:39-40` (grep for `voiceIntake.count`, `questionCount`, `BEFORE_TOPICS` across `src`, `e2e`, `e2e-phone` finds no other). After the split the Describe component's count is `BEFORE_TOPICS.length` (five), and the INSIGHTS component computes none (A6). The stored shape does not change. Keys with no reader after Step 2: `calib.characteristics.title` (`i18n.ts:1443`), `.lede` (`:1444`, unless Dann keeps it), `.doneButton` (`:1458`); already without a reader at this tip: `.editButton` (`:1286`), `.addButton` (`:1288`), `calib.summary.savedLede` (`:1416`). [DESK DEFAULT to state: delete or leave.] If any key is deleted, the hand-written index at the head of `i18n.ts` changes its `calib.` count and total with it, or `i18n-index.test.ts` fails."

**A15. Step 1 and Step 2, tests (additions).** "`e2e/voice-pane.test.ts:120-130` (each door opens the heading 'Voice characteristics', then Done) and `:247-264` (the range link 'lands' on that heading) become untrue; rewrite both to the stations, keeping the assertions that `calibratedAt` does not move (`:128`) and that a press over the capture screen is dropped and never answered later (`:250-256`). `setCharacteristic` calls `touchVoice` (`CalibrationWizard.svelte:415`); assert that a note written from a station leaves `calibratedAt` as it was, since that is the date INSIGHTS prints (`:780-781`)."

**A16. Section 5 (addition).** "Name `sheet-supplement_r1_2026-11-16.md` with the two sheets. The station headers, links, and every question use built keys; no key is added."

**A17. Section 6 (addition).** "Pictures also of: both stations closed (what the pane looks like on arrival); the Describe station on a phone scrolled to its last question; the range link's landing with a filled range and with an inverted pair; L1 and L4 in French on a full INSIGHTS page; the printed INSIGHTS page (no link words printed)."

## 4. The cite table (question A)

| Brief cites | At HEAD `8f2f93ec` |
|---|---|
| `routes/+page.svelte:4028-4040` (NOTATION) | MOVED: `:4043-4055`; `expanded=` at `:4052` |
| `lib/components/Drawer/sections.svelte.ts:70` | MATCHES |
| `lib/voice/InsightsIntake.svelte:3` "one panel" | MATCHES; file is 216 lines |
| `InsightsIntake.svelte:29` `BEFORE_TOPICS` | WRONG: `:33` |
| `InsightsIntake.svelte:30` `TOPICS` | WRONG: `:34` |
| `InsightsIntake.svelte:15-16` | MATCHES |
| `InsightsIntake.svelte:35-37`, `:35` (the count) | WRONG: comment `:37-38`, count `:39` (seven today), sentence `:40` |
| `CalibrationWizard.svelte:1196-1280` (pickers) | MOVED: phase block `:929-1014`, pickers `:944-1002`, intake `:1008`, Done `:1010-1012`; `:1193-1227` is now its CSS |
| `sections.test.ts:85` | MATCHES |
| `routes/+page.svelte:1657-1661` `openRangeFields` | GONE: `openVoice` at `:1664-1672`; `:1657` is `calibrationRequest` |
| `GuideContent.svelte:372` | MOVED: `:389` (English); French twin `:85` |
| `routes/+page.svelte:4346` `onaddrange={openRangeFields}` | MOVED and changed: `:4358`, `onaddrange={() => openVoice('characteristics')}` |
| `lib/i18n.ts:1827` (placeholder sentence) | MOVED: `insights.generic.lede` at `:1874`; see A10 for the ambiguity |
| "sheets line 7 / 8", "sheet line 27" | Item numbers, not file lines: English r2 `:15`, `:16`, `:44`; French r1 `:14`, `:15`, `:34` |
| `InsightsPane.svelte` 743 lines, ceiling 744 | MATCHES (`wc -l`; `scripts/ratchets.json:18`) |
| `review-fable-lane60-brief-r2_r1_2026-11-16.md` | Exists; the as-built review also exists and is not named |
| `Drawer.svelte:540-548` (via plan; NOTATION in ANALYSIS) | The ANALYSIS band is `:540-549`; VOICE band `:550-558` |
| `CONTRACT.md` §1 item 19 | Not read (under `docs/memory/`, outside my map) |
| `@ilya/score-parser` `IntakeAnswers` | Imported at `InsightsIntake.svelte:18`; definition not read by me |

## 5. The strings table

| What the lane shows | Status |
|---|---|
| Station header "Describe your voice" / « Décrire votre voix » | EXISTS `calib.pane.door.describe`, `i18n.ts:1433`; RATIFIED English sheet r2 `:16`, French r1 `:15` |
| Station header and L1 "What INSIGHTS shares, and how" / « Ce que partagent les APERÇUS, et comment » | EXISTS `calib.pane.door.insights`, `:1434`; RATIFIED same lines |
| L4 "Record your vowels" / « Capter vos voyelles » | EXISTS `calib.pane.door.record`, `:1429`; RATIFIED English `:15`, French `:14` |
| L2 "Add your range" / « Indiquez votre ambitus » | EXISTS `insights.offer.link`, `:1847`; not on the N.203 sheets |
| L6 sentence and link word INPUT / ENTRÉE | EXISTS `insights.silence.noScore`, `:1881`; RATIFIED English `:44`, French `:34`; `group.input`, `:168` |
| Intro with "Five" / « Cinq » | EXISTS `voiceIntake.intro` `:2165`, `voiceIntake.count.5` `:2169`; not on the N.203 sheets |
| Range, working zone, passaggio headings, hints, labels, inverted notes | EXISTS `calib.characteristics.*`, `:1445-1457` |
| Five questions, topics, acoustics, "How comments appear" | EXISTS `voiceIntake.*`, `:2175-2225` and the imagery key (packet gives `:2271`; I did not open that line) |
| Intro for the INSIGHTS station | **MISSING** as a ruled sentence. The built formula would print "Two quick questions so INSIGHTS understands your voice ..." (`:2165-2166`) |
| A closed-state line for either station | **MISSING**; the brief already defaults to none. Plan r4 section 4.6 says each has one (D1) |
| A lede for the Describe station (why the notes are asked) | Exists only as `calib.characteristics.lede` (`:1444`), which names "values" and was written for the old screen; reuse is Dann's call |
| Anything saying how long, or that the voice stays on this device | **MISSING** on VOICE (item 7) |
| Station `aria` names | None needed: `StationHeader` takes the visible label |

French agreement and typography, for the strings this lane shows: « Ce que partagent les APERÇUS » plural verb with plural subject, correct. « Les APERÇUS mesurent ... et la relient » correct. « Méthode : » carries U+00A0 (`i18n.ts:1876-1885`). The five French stems end « ...secondaire? » with no space, which follows the stated rule. `i18n.test.ts:155` tests every French value against the OQLF table. I found no fault. One reading note, not a fault: after the French lede (« ... et non sur votre voix en particulier. ») an infinitive link « Capter vos voyelles » reads as a button label, as it does in the pane.

## 6. For Dann's eye

1. **A third Drawer scroll.** Links that open a station and bring it into view break the written rule "Do not add a third scroll here" (`Drawer.svelte:968-974`). Recommendation: yes, rule it, for links only, on the same ground as N.164 ("so the singer does not have to hunt", `routes/+page.svelte:1651-1653`). Without it, on a phone the range pickers open below the voice line, the sentence, and the doors, possibly off screen.
2. **An intro for "What INSIGHTS shares, and how".** Recommendation: none for this release; the station's name says what it is. The alternative is new words (DRAFT owed).
3. **A closed-state line for each station** (plan D1 said yes; the brief says none). Recommendation: none now. A singer sees two closed rows with no sign of what is answered; a count such as "3 of 11 answered" would be new words in both languages.
4. **The lede "These optional values sharpen MELODY and INSIGHTS ..."** (`i18n.ts:1444`). Recommendation: keep it at the head of the Describe station, as built words. It is the only text that says why the six notes are asked, and without it the key dies. It contains "simply" in English and « simplement » in French, which your style rules avoid; that is a wording change for you.
5. **Where L4 sits** (A10): beside the header's lede (touches a component shared with the marked score) or with the Method line in the notes. Recommendation: the notes.
6. **Retracting stations in VOICE reverse your 2026-09-09 ruling** that the Voice station does not retract (`routes/+page.svelte:4144-4152`). Plan r4 lists this as D14, default yes. I could not establish that you confirmed D14; the brief's rulings table does not show it.
7. **Order inside "Describe your voice".** The brief puts six pickers first, then five questions. Each picker's staff is 150 by 136 px (`NotePicker.svelte:116-117`) and its row wraps (`:312-316`), so six staves alone are 816 px of height before any question. Recommendation: keep the order (the range link lands at the top, and the passaggio hint precedes the questions that name the passaggio), and confirm from the pictures. Alternative: questions first, at the cost of the range link landing mid-station.

## 7. The Dillman check

- **What the files record about the method: nothing.** `grep -rli 'dillman\|tailored design' docs/sessions` returns no file. The packet does not use the name either. Every statement about what the Tailored Design Method prescribes is therefore **NOT READ IN FULL**, and I state none.
- **What the packet's inventory found** (its section 5, "whether any text says why a question is asked"), and my check of each:
  - No text on VOICE says how long anything takes, other than the test fry's "three seconds" (`i18n.ts:1298`). Verified for the strings I read: `calib.welcome.lede` (`:1290`) gives no duration; `voiceIntake.intro` (`:2165`) says "quick" and gives a count.
  - No text on VOICE says the voice stays on this device. Verified: `calib.summary.savedLede` (`:1416`, "Your profile is saved on this device ...") has no reader (grep of `src` outside `i18n.ts` finds none); `calib.switcher.deleteConfirm` (`:1261`) says "from this device" only at deletion. The store is `localStorage` (`lib/voice/profileStore.ts:20`, `:215`). Whether anything else sends voice data off the device: NOT ESTABLISHED.
  - Why each item is asked: stated for the screen as a whole by `calib.characteristics.lede` (`:1444`, drawn only at `CalibrationWizard.svelte:938-940`, which this lane deletes), for the questions by the intro (`:2165`), and for the passaggio pair by its hint (`:1455`). Not stated for the range pair, the working-zone pair, the acoustics question, the topics, or "How comments appear".
- **What this lane can do with no new words:** keep the lede at the head of the Describe station (item 6.4); keep the intro's true count of five, "Skip any you like", and save-on-change; keep the passaggio and working-zone hints; keep "Not sure" and "Clear answer" on every scaled question; keep the two stations separate so the self-report and the settings are not one long form; remove the Done button with the screen, so nothing reads as a submission.
- **What would need new words (drafts owed to Dann, none written here):** a line that the voice and its answers stay on this device (reusing `savedLede` would be untrue in a station, since it speaks of "any reading below"); any statement of how long the vowels or the questions take; a reason line for the range and working-zone pairs, the acoustics question, and the topics; a closed-state line; an intro for the INSIGHTS station.

## 8. What I could not establish

- Whether Dann confirmed D14 or ruled D1's state line. `docs/memory/OPEN.md:3956-3961`, the six lines I was given, hold the links note, the timing ruling, a corrected error, and the plan and review records. They do not hold "the map and sections 1 to 4" rulings; those are elsewhere in the file, which I did not read.
- Whether the stations and pickers fit at 390 px: no browser run. The takeover that holds the pickers today is inside the same Drawer (`Drawer.svelte:848-860`), which is a lead and not a measurement.
- Whether a link in the notes block changes the INSIGHTS page fill or the print: not run.
- The eight gates, vitest, and Playwright: not run. What "the eight gates" are: not read.
- `docs/memory/CONTRACT.md`, `INBOX.md`, `docs/house-style/interface-text.md`: not read. The brief's quotations of Dann are unchecked by me.
- The definition of `IntakeAnswers` in `packages/score-parser`, and `assignToVoice` and `touchVoice` in `profileStore.ts`: not read.
- How the page could learn the wizard's phase for the takeover rule in A7: no such channel exists in what I read (`seam.ts:8-9`).
- Lane 60's brief r3 was read at one line only (`:32`); the as-built review at seven grep lines.
- Packet lines longer than 2,500 characters were cut in my read; I verified in the tree every packet finding I rely on.

## 9. What I read

- `docs/sessions/brief-code-n203-lane61-describe-and-insights_r1_2026-11-16.md`: in full (95 lines).
- `docs/sessions/n203-voice-intake/packet-sonnet-lane61-brief_r1_2026-11-16.md`: in full (171 lines; long lines cut at 2,500 characters).
- `plan-voice-in-the-drawer_r4_2026-11-15.md`: ranges 200-232, 328-340, 370-393, and the heading list.
- `sheet-english_r2`, `sheet-french_r1`, `sheet-supplement_r1`: in full.
- `docs/memory/OPEN.md`: 3956-3961 only.
- `brief-code-n203-lane60-the-voice-pane_r3`: line 32 (grep). `review-fable-lane60-as-built_r1`: grep lines 7, 11, 25, 27, 30, 35, 55.
- `lib/voice/seam.ts`, `lib/components/Drawer/VoicePane.svelte`, `voice-pane.ts`, `reveal-scroll.ts`, `voice-pane-usable.test.ts`, `lib/voice/intake-symbols.test.ts`, `lib/voice/seam.test.ts` (1-30): in full.
- `lib/voice/InsightsIntake.svelte`: 1-131. `lib/voice/CalibrationWizard.svelte`: 322-345, 360-440, 766-800, 925-950, 1190-1232, plus a grep listing. `lib/voice/NotePicker.svelte`: 30-70, 150-200, 294-345, and greps.
- `routes/+page.svelte`: 1640-1673, 2140-2156, 3180-3190, 3836-3848, 3880-3922, 4025-4060, 4096-4112, 4140-4185, 4336-4362, and greps.
- `lib/components/Drawer/Drawer.svelte`: 368-420, 540-560, 844-860, 968-985. `sections.svelte.ts`: 20-146 and a grep of 354-516. `sections.test.ts`: 76-104, 194-203, 392-400. `StationHeader.svelte`: 1-110 and a CSS grep. `NotationFields.svelte`: grep only.
- `lib/insights/InsightsPane.svelte`: 284-296, 320-345, 505-545, greps. `SingerBlock.svelte`: 52-63, 70-95, 160-172, 540-606. `singer-blocks.ts`: 365-388. `singer-blocks.test.ts`: 243-256. `identity.ts`: 40-70. `text-parts.ts`: 52-63. `text-parts-notation.test.ts`: 14-30.
- `lib/components/Paper/TitleHeader.svelte`: 195-206 and a grep. `lib/components/Reading/GuideContent.svelte`: 83-86, 387-390.
- `lib/i18n.ts`: grep lines 163, 168, 1261, 1286-1298, 1416, 1429-1458, 1843-1885, 2055, 2165-2174, 2622. `lib/i18n-index.test.ts`: 1-40. `lib/i18n.test.ts`: test names only. `lib/voice/chart/ratified-strings.test.ts`: 1-30.
- `e2e/voice-pane.test.ts`: 112-130, 234-285. `e2e/insights-no-score.test.ts`: 20-34. Directory listings of `e2e`, `e2e-phone`.
- `scripts/ratchets.json` (grep), `scripts/ratchets.mjs` 55-75, `package.json` scripts (grep).

Nothing in memory was used for this memo beyond style conventions. Nothing new worth saving was learned about the user.
