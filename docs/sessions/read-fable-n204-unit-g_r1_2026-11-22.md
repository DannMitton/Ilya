# read-fable-n204-unit-g_r1_2026-11-22

N.204 phase 1, unit g: `apps/web/src/lib/components/Drawer/`. Read by Fable 5.2, 2026-11-22, commissioned by the Opus desk. 374,795 tokens, 31 tool uses, 9.6 min, against a 480k cap. Transcribed into the tree by the desk in the turn the memo landed (`ENVIRONMENT.md`, A FABLE REVIEW NEVER REACHES THE TREE BY ITSELF).

Path prefix below: `D/` = `apps/web/src/lib/components/Drawer/`. Every line number was read in that session. "ran" marks a claim settled by a command. Nothing was written into the repository by the reader.

**Three facts differ from the brief (all ran):**
- The tree was on `cloud-lane-82` at `13f34634`, not `Shane` at `c470e03d`. `git diff --stat c470e03d -- D/` is empty, so the unit is byte-identical at both.
- The unit is 33 files and 467,234 characters (`wc`), not about 109,000.
- `Drawer.svelte` has 101 commits in `git log`, not 53. `InspectorPanel.svelte` has 50.

## 1. The developer's paragraph

`D/` is the drawer: every control that changes something, and nothing that prints (`CONTRACT.md` section 8).

- **The shell.** `Drawer.svelte` draws three things by destination: Studio's five bands (REPERTOIRE, PIECE, INPUT, ANALYSIS, VOICE; `D/Drawer.svelte:512-564`), the LEARN and GUIDE tables of contents (`:565-823`), and the calibration takeover (`:853-868`). On a phone it also draws the pull bar (`:895-910`).
- **Where state lives.** The shell owns almost none. `+page.svelte` owns the state and passes band bodies in as snippets (`D/Drawer.svelte:57-62`). The band bodies are the other sixteen components.
- **Where decisions live.** Every decision a test must reach is in plain `.ts`, because vitest runs in node and renders no component (`D/bandState.ts:8-11`). The seven modules are `sections.svelte.ts` (open set), `bandState.ts` (closed-band lines), `layout.ts` (breakpoint), `gesture.ts` (swipe), `reveal-scroll.ts` (scroll), `voice-pane.ts` (VOICE sentence), and `drawer-width.ts`.

Four facts a newcomer needs first:
1. Band and station ids are stored on the singer's device (`D/sections.svelte.ts:68-72`). A rename needs a version step.
2. `Drawer.svelte` styles markup that other files write, through `:global(.station)` and `:global(.station-body)` (`:1257`, `:1306`). Those class names are a contract.
3. The takeover is always mounted and hidden, because the wizard publishes the voice from an effect (`:129-135`).
4. `Drawer.svelte` sits 4 lines under its ceiling and `InspectorPanel.svelte` 36 under (`scripts/ratchets.json:12,15`). New work goes in a new module.

## 2. Findings

### Tier 4: behaviour defects, in the order a singer meets them

Each becomes a release lane. None is refactoring. All established by reading unless marked; the reader had no browser.

**4.1 Composer, poet, and translator lists are cut off by the PIECE card.** `.group` (`D/Drawer.svelte:1037-1042`, `overflow: hidden`) against `.select-dropdown` (`D/SearchableSelect.svelte:316-329`). The dropdown is positioned inside `.searchable-select` (`:256-259`), inside the card, so the card clips it. Under the translator field only the reset row and 16 px of padding remain, about 50 px of a 220 px list. **NOT ESTABLISHED on screen**; no e2e test opens the list (ran grep). Fix: let the card's overflow show while a list is open, or render the list outside the card. *The reader's note: this is the one to confirm first; one tap on the translator field settles it.*

**4.2 A dictionary load failure prints a raw machine error.** `loaderState.error` (`D/IntakePanel.svelte:291-296`); `loader.ts:842-846` stores `error.message` as thrown, in English and in the machine's words, in either interface language. Fix: a ratified sentence in both languages. **Needs French from Dann.**

**4.3 On a phone, the word controls are 16 to 22 px and two rest at 25% opacity.** `.stress-circle` (`D/InspectorPanel.svelte:2158-2172`), `.yo-sigla` (`:1813-1827`), `.reset-button` (`:2361-2379`), `.provenance-choice` (`:2336-2347`). No `pointer: coarse` rule in the file and none in `app.css` (ran grep). Only hover lifts the opacity (`:2174`, `:1829`). Same for `.song-btn`, Rename and Delete (`D/SongList.svelte:276-286`). Fix: a coarse-pointer block with a 44 px hit area and full opacity at rest.

**4.4 A French singer reads English in the dictionary panel.** `formatPos` returns English part-of-speech labels (`D/InspectorPanel.svelte:910-918`, drawn at `:1058`); no `pos.` key exists in `i18n.ts` (ran grep). The syllable group's accessible name is the literal `Syllable {n}` (`:1137`), although `inspector.syllable` exists (`i18n.ts:776`). Fix: twelve new string pairs (**French to Dann as a draft**) and reuse of the existing key.

**4.5 Four of the seven NOTATION switches announce the opposite state to a screen reader.** `aria-label` at `D/NotationFields.svelte:147`, `:161`, `:175`, `:189` each names the left label, while `aria-checked` true means the right option is engaged (`:141`). A singer hears "Default [ʌ], on" when [ə] is shown. The other three use the right label (`:133`, `:203`, `:217`). Fix: the right label on all seven. No new string.

**4.6 "Reduce motion" is not honoured in three places.** The phone drawer's slide is `!important` (`D/Drawer.svelte:1913`) and the reduced-motion rule is not (`:1966-1968`). `.band-chevron` (`:1173`) has no reduced-motion rule. In `InspectorPanel.svelte`, `blurbFadeIn` (`:1884`, `:1905`, `:2220`), `.blurb-wrapper` (`:2205`), and `.blurb-caret` (`:2241`) have none. `app.css` has no global rule (ran grep).

**4.7 Moving a consonant between syllables by touch.** The drag handlers (`D/InspectorPanel.svelte:1178-1180`) have no `pointercancel` handler and the file has no `touch-action` (ran grep). If the browser takes the gesture as a scroll, `dragRibbonIndex` stays set and the ghost stays drawn (`:1285`). **NOT ESTABLISHED on a device.**

**4.8 The yo toggle cannot be reached by keyboard.** The sigil is a `span role="button" tabindex={-1}` inside the atom button (`D/InspectorPanel.svelte:1187-1199`); the ribbon's key handler never focuses it (`:324-362`).

**4.9 A pending chooser carries over to another instance of the same word.** The three reset effects key on `word.cleanWord` (`D/InspectorPanel.svelte:162-170`, `:511-514`, `:845-848`), as does the `{#key}` (`:988`); the page does not key the component (`+page.svelte:4104`). Tapping the same spelling elsewhere keeps the yo or stress chooser open, the blurb selected, and the dictionary panel open, now acting on the new word. Fix: key on line and word index.

**4.10 A long word widens the drawer past the breakpoint's arithmetic.** `calculateDrawerWidth` returns up to 720 (`D/drawer-width.ts:39`), while `layout.ts` proves the desk fits at 1400 only with a 520 drawer (`D/layout.ts:41-53`). Between 1400 and 1599 px, a word of about twelve letters leaves the 816 px sheet too little room; `.main-content` then scrolls sideways (`+page.svelte:4878-4881`). **NOT ESTABLISHED on screen.**

**4.11 The table-of-contents chevrons.** Twelve buttons share one name, "Expand or collapse", and carry no `aria-expanded` (`D/Drawer.svelte:588` and its eleven twins; `i18n.ts:254`). They take the 44 px size by width, not by pointer (`:1957-1960`), against the modality ruling `D/IntakeCamera.svelte:5-7` quotes. Ten headings with ids in `Reading/` have no entry (ran `comm`): `guide-witnesses`, `guide-markup-stand-ins`, `learn-u2-yo`, and seven `learn-u5-*`. Whether that is intended is NOT ESTABLISHED; it belongs to the GUIDE and LEARN rewrite.

**4.12 Smaller.** The file picker's filter keys on width, so every laptop under 1400 px gets the unfiltered picker (`D/IntakePanel.svelte:185-187`, `:196`), although the file already imports the pointer reading (`:6`). The character count uses the browser's locale, not the interface language (`:487`). The Lyrics placeholder is empty in French, recorded as owed (`D/IntakeViews.svelte:116-118`).

### Tier 3: splitting the two ratcheted hotspots

**3.1 `Drawer.svelte` (1,986 of 1,990).** Large Class with three unrelated jobs. Extract Class into `ReadingToc.svelte`: `learnUnitChildren`, `getParentIds`, `collapsibleIds`, the two effects (`:256-332`), `isActive` and `sectionContainsActive` (`:421-428`), the template (`:565-823`), and the CSS (`:1614-1856`). About 760 lines. Inside it, replace the 88 hand-written rows with one data table and a loop, which removes three of the hierarchy's homes (duplication 16). Extract the pull (`:895-910`, `:1546-1600`) and the takeover frame (`:853-868`, `:1374-1504`). Risk: scoped CSS and the `:global` station rules; the takeover's scroll stow (`:369-391`) reads two element refs. **No unit test pins the TOC.** Write a characterization test first that server-renders LEARN and GUIDE and snapshots the `data-heading-id` order and parent map; then the gates, plus `Reading/learn-opening.test.ts:38` and `Paper/blank-states.test.ts:197-198`, which read this file's text.

**3.2 `InspectorPanel.svelte` (2,396 of 2,432).** Large Class; decisions inside a component that no test can reach. Extract Function to a plain `inspector-ribbon.ts`: `reconstitutedIpaMap` (`:82-104`), `headerIpa` (`:116-136`), `ribbonEntries` (`:185-242`), `getGraysonPositionKey` (`:251-258`), `syllableGroups` (`:260-280`), `dragEligibility` (`:570-659`), and the boundary arithmetic of `commitDrag` (`:797-822`). Extract Class into `DictionaryPanel.svelte` (`:838-977`, `:1022-1098`, CSS `:1495-1725`) and a blurb component (`:1345-1390`, CSS `:2200-2322`). Risk: the drag arithmetic writes syllable overrides the singer stores; `commitDrag` moves only consonants and signs, which is how it keeps one vowel per syllable, and it rests on the hand-rolled vowel set (2.3). **No test in this folder exercises any of it**; `reading-boxes.test.ts:17-22` pins three source strings only. Write characterization tests of `dragEligibility` and `commitDrag` on four words (a cluster, a sign pair, a clitic, a monosyllable) before the move.

### Tier 2: moves across modules

- **2.1 `stackActions` and `StackAction`** (`D/bandState.ts:191-214`). Its one caller is `score/LoupeHeader.svelte:19`, so `score/` reaches into the drawer for a rule about the loupe. Move it beside its caller; `bandState.test.ts:168-186` moves with it.
- **2.2 `ACCEPT`** (`D/IntakePanel.svelte:195`) duplicates `ACCEPTED_EXTENSIONS` (`score/ingestion/format-detection.ts:54`), same members in another order. Import it.
- **2.3 Vowel and sign predicates** (`D/InspectorPanel.svelte:546-555`, `:929`). Hand-rolled, against `code-conventions.md` section 6 and `CONTRACT.md` section 8. Risk: this set has ten letters and `CYRILLIC_VOWEL` has thirteen (`score/vowel-resolver.ts:159`). Whether a pre-reform letter can reach `displayLog` is NOT ESTABLISHED; if it can, the drag treats ѣ as a consonant.
- **2.4 `getStressedLemma`** (`D/InspectorPanel.svelte:921-945`). `ARCHITECTURE.md` says `@ilya/dictionary` has a helper that marks stress in Cyrillic; its name is NOT ESTABLISHED.
- **2.5 Stress provenance icons** (`getStressIconSvg`, `:427-446`). Same paths as `Paper/WordStack.svelte:155,159` and `Paper/LegendItems.svelte:42,48`. One module.
- **2.6 The clitic-promotion sentence** (`:1365-1367`). Both languages written in the template, outside `i18n.ts` and outside the invariant 11 test. Move to a key; the words exist, so no new French.
- **2.7 CSS with several homes:** visually-hidden (dup 22), the pill button family (20), the "from score" tag (23), the chevron glyph (15), the station body column (21).
- **2.8 `520`** in `D/drawer-width.ts:39` and `+page.svelte:1594`. Import `DRAWER_WIDTH`; nothing imports it today (ran grep).
- **2.9 Rename `RootPanel.svelte`.** It draws REPERTOIRE's body (`:110-112`) and mostly forwards `songLibrary` field by field (`:113-125`, Middle Man). Rename with batch 3.
- **2.10 Nonblank line count** (`D/IntakePanel.svelte:159`, `+page.svelte:1722`). One function; the prop's own comment warns against two derivations (`:92-96`).

### Tier 1: dead code, comments, renames inside a file

Dead, each proven by grep (ran) and by reading: **1.1** `YO_CHARS` and `isYoChar` (`D/InspectorPanel.svelte:480-485`), no caller. **1.2** `.word-gloss`, `.word-gloss-missing`, the empty `.clitic-column` (`:1479-1493`, `:1760-1762`). **1.3** `?? 0` after `findIndex` (`:951`); confirm that "no entry highlighted" is the intent before deleting. **1.4** `canTranscribe` (`D/IntakePanel.svelte:45`, `:134`), declared, never read, passed at `+page.svelte:3991`. **1.5** `.action-btn`, `.btn-ghost`, `.btn-primary` (`D/IntakePanel.svelte:784-814`), unused by the file's own account (`:770-783`). **1.6** `tight`, `children`, `accent` on `StationHeader` (`:81-96`, `:168-176`) and `accent` on `NotationFields` (`:54`); each comment says nothing uses it. **1.7** `parseOpenSections` (`D/sections.svelte.ts:343-346`), called only by tests. **1.8** The camera diagnostic (`D/IntakeCamera.svelte:47-57`) decodes every photograph a second time to log its size; `ENVIRONMENT.md` has no camera entry (ran grep), so the answer it waits for is unrecorded. Dann's walk settles it, then it goes.

Tidying: **1.9** `D/MetadataFields.svelte:63-73`, three identical select handlers; the five field names listed twice (`:76-77`, `:81`). **1.10** `D/InspectorPanel.svelte:119-131` and `:140-150` state the same priority twice. **1.11** Consolidate the three reset effects (`:162`, `:511`, `:845`) with 4.9. **1.12** Replace literals with existing tokens: `D/Drawer.svelte:1380`, `:1237`, `:1258`, `:1411`, `:1478`; name the pull's 44 px once (`:1552`, `:1887`, `:1926`). **1.13** `D/NotationFields.svelte:127-222`, seven rows of one shape: a table and a loop, which also fixes 4.5 in one place. **1.14** `D/sections.test.ts:388-401` and `:505-517`, the same storage stub twice.

## 3. The hidden relationships

1. **Class names as contract.** `station` and `station-body` are styled from `D/Drawer.svelte:1257-1308` and written by `SongList`, `RootPanel`, `IntakePanel`, `NotationFields`, `AnalysisStation`, and `+page.svelte`.
2. **Reveal selectors.** `+page.svelte:1699` builds `[data-station="..."]` and the drawer queries it (`D/Drawer.svelte:406`). `VoicePane` marks two rows that way (`:88`, `:108`) and the third with `data-vp-row` (`:77`), so a link to the voice type row would find nothing. `data-band-head` is the word tap's default and is pinned by `Paper/blank-states.test.ts:198`.
3. **The breakpoint.** `1399px` is written in `Drawer.svelte` (1), `+page.svelte` (2), and `voice/VowelCapture.svelte` (1) (ran grep). `layout.test.ts:20` lists only the first two.
4. **The breakpoint's premise.** `layout.ts` copies 520, 816, and 32 from three places it cannot import (`D/layout.ts:28-33`). The drawer can be 720 (4.10).
5. **Ribbon geometry.** `drawer-width.ts:14-19` restates `InspectorPanel`'s CSS: atom 32 (`:1927`), gap 2 (`:1808`), molecule 3 plus 1.5 (`:1794-1795`), column gap 12 (`:1746`). Nothing binds them.
6. **Camera clearance.** `50px - 12px` in `D/IntakeViews.svelte:398`, `:524` is the camera's 44 plus 6 (`D/IntakeCamera.svelte:94-97`) less the frame's padding (`D/IntakePanel.svelte:573`). `.corner` repeats the 12 (`:534-535`).
7. **One pointer watcher.** `IntakeCamera.svelte:11-12` starts it at module load; `IntakePanel` and `IntakeViews` both read it.
8. **The takeover.** Unmounting it disables Print on MELODY (`D/Drawer.svelte:129-135`).
9. **The open set.** `+page.svelte` sets `exclusive`. The reuse of `piece` is safe only while the version is 3 or more (`D/sections.svelte.ts:106-111`).
10. **String shapes.** `stackActions` depends on `loupe.undo` ending in `: %s` (`D/bandState.ts:206`). `IntakePanel` splits a ratified sentence on `intake.captionLink` (`:404-412`). `ScanBanner` and `PoemLibraryCard` split on `{bars}` and `{site}`.
11. **Tests that read source text.** `reading-boxes.test.ts`, `scan-banner.test.ts:47-54,78-88`, `voice-pane-usable.test.ts:22-28`, `Reading/learn-opening.test.ts:38`, `composers-poets.test.ts:194`, and three poem-library tests. Any markup move breaks them by design.
12. **The N.23 rule.** `app.css` raises textareas to 16 px on a coarse pointer, and `IntakeViews` repeats it for the layer or the colours drift (`:374-382`).
13. **Focus by id.** `IntakeViews.svelte:115` focuses `intake-tab-{view}`, an id `ViewPair` builds from `idPrefix` (`:257`).
14. **Global query.** `InspectorPanel.svelte:366` queries `document`, not its own ribbon, for `data-cell-id`. Only this file writes it today (ran grep).
15. **Layer order.** Drawer 60, pull 70, dropdown and toast 200, loupe 9100 (`D/Drawer.svelte:1542-1545`, `D/SearchableSelect.svelte:328`).
16. **Line cites from outside.** `e2e/core-loop.test.ts:7,23` and `e2e/helpers.ts:7` cite `IntakePanel.svelte:233` and `layout.ts:62-64`.

## 4. The comment census

| measure | count |
|---|---|
| comments | 700 |
| characters of comment | 204,496 of 467,234 (44%) |
| cite a line number | 18 comments, 23 citations |
| carry a ruling (name a ruling or Dann, with a date) | 132 |
| tombstone comments (subject is code no longer in the file) | 67, of which 33 carry a ruling |
| divider labels (a rule line naming the next section) | 112 |

`Drawer.svelte` alone is 47,130 characters of comment in 99,920.

**Verdict, an estimate from the read and not a per-comment tally:** roughly 430 curate as written, the 112 dividers are navigation that mostly goes when the hotspots split, and roughly 160 do not pass.

**Line citations** are in `Drawer.svelte` (6), `IntakePanel.svelte` (4), `IntakeViews.svelte` (3), and one each in `InspectorPanel`, `NotationFields`, `PoemLibraryCard`, `VoicePane`, `bandState.ts`. Three are verified stale (ran): `i18n.ts:381` (`D/Drawer.svelte:1429`) is now `:774`; `i18n.ts:48` (`D/NotationFields.svelte:21`) is now the prefix index; `+page.svelte:1918` (`D/bandState.ts:112`) is now `:1544`.

**What fails:** the 34 tombstones with no ruling; one ruling pasted seven times ("PILL ENDS": `InspectorPanel:1497`, `:2328`; `IntakePanel:763`; `MetadataFields:236`; `RootPanel:202`; `SongList:267`, `:301`); comments restating the next line (`InspectorPanel:759`, `:766`); four fossils (`InspectorPanel:1394-1401`, `:2324`, `:2357`).

**Stale statements a newcomer would believe:** `bandState.ts:8` "FOUR PURE FUNCTIONS" (it exports eleven); `bandState.ts:173-177` Undo and Redo "on the SCORE MARKUP band"; `sections.test.ts:27`; `RootPanel.svelte:9-40`, `:103-107`; `MetadataFields.svelte:7`; `NotationFields.svelte:237`; `IntakePanel.svelte:26` "STILL NEVER CLOSED" against `Drawer.svelte:533`; `IntakeViews.svelte:20-22`; `StationHeader.svelte:25-28`, `:63`, `:75`; five files name `VoiceAnchor`, a file that is gone (ran `ls-files`); `SongList.svelte:5` cites CONTRACT section 6, the rule is in section 8; `Drawer.svelte:1318-1321`; `drawer-width.ts:2,10` use the retired names Inspector and ribbon.

## 5. The duplication census

Thirty facts with two or more homes.

1. Cyrillic vowel letters: `InspectorPanel:546`, `:929`. Elsewhere at least `WordStack:57`, `pairings:870`, `syllable-utils:22`, `typed-hyphens:43`, `clitic-merge:13`, `rhyme-reading:59`, `vowel-resolver:159`, three `omr/` files, four package files (ran).
2. "yo never takes an acute": `InspectorPanel:213`, `:938`.
3. When the stress acute is suppressed: `:110`, `:213`.
4. Syllabification priority: `:119-131`, `:140-150`.
5. Stress provenance icons: `:433`, `:439`, `:444`; `WordStack:155`, `:159`; `LegendItems:42`, `:48`.
6. The three provenance ids as plain strings: `:383-385`, `:431-437`, `:1307-1313`, `:1327-1333`.
7. The gloss cap of 20: `:864`, `:1036`; `i18n.ts:797`.
8. Drawer width 520: `layout.ts:41`, `drawer-width.ts:39`, `+page.svelte:1594`.
9. Breakpoint: `layout.ts:53`; `Drawer.svelte:1877`; `+page.svelte` twice; `VowelCapture.svelte`.
10. Pull height 44: `Drawer.svelte:1552`, `:1887`, `:1926`.
11. Drawer gutter: `app.css:97`; `Drawer.svelte:1024` (token), `:1380` (literal).
12. Station inset 18: `app.css:115`; `Drawer.svelte:1237`, `:1258`, `:1411`, `:1478`.
13. The uppercase label recipe: `Drawer.svelte:1059-1063`, `:1414-1418`, `:1489-1493`, `:1575-1579`, `:1624-1628`.
14. The chevron glyph: thirteen times in `Drawer.svelte`, plus `StationHeader:143`.
15. Chevron rotations: `Drawer.svelte:1172-1177`, `StationHeader:273-279`.
16. The LEARN and GUIDE hierarchy: `Drawer.svelte:258-277`, `:282-286`, `:290-293`, `:566-823`; the heading ids in `Reading/`; the `toc.*` keys.
17. Accepted file types: `IntakePanel:195`, `format-detection.ts:54`.
18. Nonblank line count: `IntakePanel:159`, `+page.svelte:1722`.
19. Ten vowels: `voice-pane.ts:39`, `:61`, `:75`; `VOWELS.length` in the page.
20. Pill buttons: `IntakePanel:784-814`, `RootPanel:213-245`, `SongList:307-318`, `MetadataFields:242-262`.
21. Station body column: `AnalysisStation:68`, `IntakePanel:822`, `RootPanel:278`, `SongList:199`.
22. Visually hidden: `IntakePanel:835`, `PoemLibraryCard:230`, `SearchableSelect:405`, six more outside (ran).
23. The "from score" tag: `Drawer.svelte:1219`, `IntakePanel:658`, `MetadataFields:198`. The first says it repeats the third (`:1214-1218`); they are 12 px and 0.62 rem.
24. Caret-and-lip panel: `InspectorPanel:1026-1029` with `:1568-1586`; `:1351-1361` with `:2234-2259`.
25. The atom: markup `:1163-1201` and `:1240-1253`; box `:1921-1929` and `:2014-2023`; type `:2084-2103` and `:2034-2053`.
26. The two choosers: `:1301-1318` with `:1873-1892`; `:1321-1343` with `:1894-1913`.
27. The seven notation toggles: `NotationFields:127-222`; `bandState.ts:122-143`, `:146`.
28. Quote marks by language: `PoemLibraryCard:49`, `sources.ts:493`, `insights/comment-sources.ts:173`.
29. Ribbon geometry: `drawer-width.ts:14-19` and `InspectorPanel`'s CSS.
30. Camera clearance: `IntakeViews:398`, `:524`, `:534`; `IntakeCamera:94-97`; `IntakePanel:573`.

## 6. Glossary lines

- Opening and closing a band, and the drawer remembering what I left open: the open set, `sections.svelte.ts`.
- The line under a closed band that says what it holds: the state line, `bandState.ts`.
- Raising and lowering the drawer on a phone, by the bar or a swipe: the pull, `Drawer.svelte` and `gesture.ts`.
- Whether I get the drawer beside the page or over it: the desk layout test, `layout.ts`.
- The drawer scrolling to what I asked for: reveal, `reveal-scroll.ts`.
- The contents list for LEARN and GUIDE: the table of contents, `Drawer.svelte`.
- Calibration filling the drawer, with Back to return: the takeover, `Drawer.svelte`.
- The drawer growing wider for a long word: `drawer-width.ts`.
- A row inside a band that opens and closes: the station header, `StationHeader.svelte`.
- My list of songs (open, new, rename, delete): `SongList.svelte`.
- Export and import: the binder station, `RootPanel.svelte`.
- Title, opus, composer, poet, translator: `MetadataFields.svelte`.
- Choosing a composer or poet from a list, or typing my own: `SearchableSelect.svelte`.
- Pasting, typing, or dropping my poem or score, and the receipts with Clear and Replace: the intake, `IntakePanel.svelte`.
- Poem and Lyrics, with the words my song adds or leaves out in colour: the two views, `IntakeViews.svelte`.
- Photographing a page with my phone: `IntakeCamera.svelte`.
- "Ilya filled Poem from its library": keep it or not, `PoemLibraryCard.svelte`.
- The notice that a scan was partly read, with bar numbers I can tap: `ScanBanner.svelte`.
- How the IPA is written (seven switches): NOTATION, `NotationFields.svelte`.
- "Tap a word", and the dictionary loading bar: `AnalysisStation.svelte`.
- A word letter by letter, with why Ilya chose each sound: `InspectorPanel.svelte`.
- Putting the stress on another syllable and saying where I learned it: `InspectorPanel.svelte`.
- Switching e to yo: `InspectorPanel.svelte`.
- Moving a consonant to the neighbouring syllable: `InspectorPanel.svelte`.
- The dictionary entry, choosing between readings, and writing my own gloss: `InspectorPanel.svelte`.
- Putting a word back as Ilya had it: reset, `InspectorPanel.svelte`.
- Spot reduction or reconstitution, and Stage reading: the reading boxes, `ReadingBoxes.svelte`.
- Using my gloss in my other songs: `GlossOffer.svelte`.
- My voices, voice type, describing my voice, what INSIGHTS shares, and the doors to recording and my vowel space: `VoicePane.svelte`.
- The sentence that says where my voice profile stands: `voice-pane.ts`.

## 7. What could not be established, and the instrument that failed

- 4.1, 4.7, and 4.10 on screen. The bridge VM has node and no browser (ran `which`).
- Whether pre-reform letters reach the inspector's `displayLog` (2.3). In `pipeline.ts` and the packages, outside the unit.
- The name of the dictionary package's stress-marking helper (2.4).
- Which e2e tests exercise the inspector's drag, stress, and yo paths, beyond the two named.
- Whether the ten headings without a TOC entry are intended.
- The svelte-check warning count. Not run.
- The comment verdict is an estimate; the four pattern counts are exact for the patterns the script used.
- `Drawer.svelte` lines 640 to 824 were read through a `sed` filter abbreviating the repeated row markup to its ids and keys; every id and key was shown, and the surrounding attributes were read in full on 566 to 639.

## 8. Files read: 33 of 33

**Components (17):** `AnalysisStation`, `Drawer`, `GlossOffer`, `InspectorPanel`, `IntakeCamera`, `IntakePanel`, `IntakeViews`, `MetadataFields`, `NotationFields`, `PoemLibraryCard`, `ReadingBoxes`, `RootPanel`, `ScanBanner`, `SearchableSelect`, `SongList`, `StationHeader`, `VoicePane`.
**Modules (7):** `bandState.ts`, `drawer-width.ts`, `gesture.ts`, `layout.ts`, `reveal-scroll.ts`, `sections.svelte.ts`, `voice-pane.ts`.
**Tests (9):** `bandState`, `gesture`, `layout`, `reading-boxes`, `reveal-scroll`, `scan-banner`, `sections`, `voice-pane-usable`, `voice-pane`.
**Standards read first:** `docs/house-style/code-conventions.md` (whole), `ARCHITECTURE.md` (whole), the N.204 plan sections 3, 4, 6, and `CONTRACT.md` section 8.
