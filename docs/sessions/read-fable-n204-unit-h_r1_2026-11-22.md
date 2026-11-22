# read-fable-n204-unit-h_r1_2026-11-22

Transcribed verbatim from Fable's return memo, 2026-11-22. Read-only; nothing
written to the tree by the reader. Filed by the desk in the turn the memo landed,
per ENVIRONMENT.md, "A FABLE REVIEW NEVER REACHES THE TREE BY ITSELF".

Unit h: `components/Paper/`, `components/Welcome/`, `components/Field/`, and the
loose components.

---

**Size (ran, `wc`):** 49 files, 6,790 lines, 266,526 characters (269,554 bytes). The plan's 85,000 is 3.1 times low. Paper/ 24 files, 155,191 bytes; Welcome/ 7, 46,804; Field/ 3, 7,261; loose 15, 60,298. `Reading/` (structure only) is a further 585,156 bytes.
**Read against:** working tree on `cloud-lane-82` at `13f34634`. `git diff --stat Shane -- <the unit's folders and loose files>` is empty (ran), so the unit is identical on `Shane` at `c470e03d`.
**Findings:** tier 4, nine; tier 3, none in the unit; tier 2, thirteen; tier 1, six groups (about 40 sites) plus the token table.

**The three that matter most, in a singer's words:**
1. **In French, page 1 names « Tchaïkovski » and every later page's running head names "TCHAIKOVSKY".** All three documents.
2. **The install banner reads its heading to a screen reader with the markup in it ("Make, less than, em, greater than, Ilya..."), and shows an em dash that the house rule forbids.**
3. **On the TEXT page, a line that begins with a clitic («И», «В», «Не») starts 3 px further out than every other line.** By reading; the page must confirm the size.

No browser was available. Every finding that needs the page says so and names its measurement. Path prefix: `C/` = `apps/web/src/lib/components/`. "ran" marks a claim settled by a command.

---

## 1. The paragraph a developer needs

`C/Paper/` is the printed page. **`Paper.svelte` is TEXT's whole document**: it cuts lines into pages from measured heights (`C/Paper/Paper.svelte:60-75`, the pure half is `$lib/page-fit.ts`) and draws `TitlePage` then `SubsequentPage`s. **MELODY and INSIGHTS do not live here**; their panes (`markup/MarkupPane.svelte`, `insights/InsightsPane.svelte`) borrow the shared furniture from here: `PageFit` (the phone's scale, `C/Paper/PageFit.svelte:2-25`), `TitleHeader`, `RunningHeader`, `PageFooter`, `LegendItems`, `BlankState`. The frame all three share is not in this folder either: it is `pageFrame` and `blankFrame` in `$lib/page-config.ts:66-95`. `WordStack` is one word (IPA over Cyrillic over gloss), `VerseLine` one line, `TextFitProbe` the hidden copy that is measured. `ReadingPaper.svelte` is a different sheet, LEARN's and GUIDE's, and is CSS only. Three plain modules hold rules a test must reach (`shown-ipa.ts`, `verify-words.ts`, `provenance-icon.ts`). `Welcome/` is the first-visit sheet; `Field/` settles a one-line field; the loose files are the app bar, the desk head, the install banner, the phone's reading aid, the reader's wait, and three small shared pieces. Four facts first: (a) the print reset is global, in `app.css:234-373`, and it styles this folder's class names; (b) headers must end at their rule or the 16 px gap breaks (`C/Paper/RunningHeader.svelte:38-42`); (c) nine test files pin exact source strings, so a pure refactor fails them; (d) `svelte/server` renders components under vitest (`C/Paper/word-stack-break.test.ts:6`), whatever five test headers say.

## 2. Findings

### Tier 4: behaviour defects, in the order a singer meets them

**4.1 The install banner.** Anchor: `InstallPrompt.svelte`. Three defects.
- `aria-label={isIos ? t.ios_heading : t.heading}` (`C/InstallPrompt.svelte:150`) passes strings that hold `<em>` tags (`:35`, `:39`, `:45`, `:49`), so the region's name is read with the tags.
- The body carries an em dash in both languages (`:36`, `:46`). `AGENTS.md:68`: "No em-dashes in user-facing copy."
- French mixes a straight apostrophe (`:45`, `:46`) with typographic ones (`:49-51`).
- Also: four custom properties it reads are defined nowhere (`--paper`, `--ink`, `--border`, `--surface-subtle`; grep over `apps/web/src` for a definition returned none, ran), so the banner is drawn from off-palette fallbacks (`:176`, `:196`, `:242`, `:248`).
- Risk: the strings are ratified, so the dash needs Dann's words. Proof: an SSR render asserting the label holds no `<`; `install-prompt-gate.test.ts` pins the source and changes with it.

**4.2 French running head spells names in English.** Page 1 formats names in the interface language (`C/Paper/TitlePage.svelte:88-90`; `composers-poets.ts:131`). The running head is built from the stored English form (`C/Paper/Paper.svelte:151-153`; `markup/MarkupPane.svelte:936`; `insights/InsightsPane.svelte:482`, while `:287` formats for display), through `extractSurname` (`page-config.ts:169-178`). `composers-poets.ts:52` holds both forms. Lane 81 did not see it because its fixture's metadata is Cyrillic. Fix: format before extracting the surname. Proof: extend `one-head-one-foot.test.ts:47` with a French case.

**4.3 Lines beginning with a clitic start 3 px out.** `.word-stack { padding: 2px 4px }` (`C/Paper/WordStack.svelte:211`) is overridden by `.is-clitic { padding-left: 1px }` (`:321-324`). `page-config.ts:143-152` derives the window's left edge from a fixed 4. Lane 80 measured the first glyph of the first row only. **Needs the page:** tight left edge of the first text node of every `.verse-row`'s first `.cyrillic-row` on the Tchaikovsky TEXT pages; expect 96 and 93.

**4.4 An English gloss loses its leading pronoun; a French one never does.** `C/Paper/WordStack.svelte:80-96` strips `i, you, he, she, it, we, they, one` when two or more words remain, from `glossOverride ?? word.gloss` (`:82`), so a gloss the singer typed is cut too ("I love you" prints "love you"). No other surface strips (grep for the list found this site only, ran), so the drawer and the page disagree. **This is Dann's to rule**, and his 04:49 ruling (source never changes treatment) bears on it; I propose no source-conditional fix.

**4.5 The desk's tabs have no 44 px touch floor.** `ViewPair.svelte:118-131` gives its members a 44 px strip on a coarse pointer; `DeskHead.svelte:193-205` (TEXT, MELODY, INSIGHTS) and `:236-248` (LEARN, GUIDE) have none, and `.pair { overflow: hidden }` (`:183`) would clip one. **Needs the page:** `.pair-member` and `.link` box heights at 390 px.

**4.6 The phone's reading aid offers buttons that do nothing.** `ReadingAid.svelte:68-75` passes no `onwordclick` and no `mutedWords`; `WordStack` is always `role="button"`, `tabindex=0`, with a pointer and a hover fill (`C/Paper/WordStack.svelte:141-146`, `:210`, `:219`). A screen reader hears every word as a button. Poem words the song does not set are grey on the page and full ink in the aid. Fix: interactive only when a handler is given, as `OctaveLine.svelte:45` does.

**4.7 Provenance icons draw at 40 percent until hovered.** `C/Paper/WordStack.svelte:341-350`. Touch and print have no hover; `#78716c` at 0.4 on white is about 1.7 to 1 (my arithmetic). The legend that decodes them prints at full strength. NOT ESTABLISHED whether the faintness is ruled. **Needs the page and a print.**

**4.8 The stress acute is derived twice, with a vowel list that omits ѣ, і, ѵ.** `C/Paper/WordStack.svelte:57`, while the page keeps some old spellings (`pipeline.ts:533`). By reading, «онѣ» would draw no acute. NOT ESTABLISHED how `stressIndex` counts there; instrument: one vitest case through `processText`.

**4.9 MELODY's provisional vowel is set in two faces.** With a score, the header note's bracketed vowel is `var(--font-sans)` (`C/Paper/TitleHeader.svelte:385-387`, though `:44` says "the IPA face"); on the blank page it is `'Lato IPA'` (`C/Paper/BlankState.svelte:131-134`). **Needs the page:** computed `font-family` of both.

### Tier 3
None. No file in the unit carries a ceiling. `Reading/LearnContent.svelte` is 4,097 lines under a 4,099 ceiling (`scripts/ratchets.json:9`); it belongs to the rewrite.

### Tier 2: moves across modules

| # | Anchor | Smell | Refactoring (Fowler) | Risk | Proof |
|---|---|---|---|---|---|
| 2.1 | `TitlePage` and `SubsequentPage` | The sheet, window, row loop, `tabName`, footer call, and three CSS rules written twice (`TitlePage.svelte:103-201`, `SubsequentPage.svelte:78-145`); `.verse-row` a third time (`TextFitProbe.svelte:120-124`) | Extract Component (`TextSheet`), header as a snippet | Source-pin tests break (`blank-states.test.ts:83`, `:204-207`; `one-head-one-foot.test.ts:28-38`) | Rewrite those as SSR renders first; `e2e/one-frame.test.ts`, `print-pages` |
| 2.2 | The nine drawing props | Data clump threaded through four levels (`Paper.svelte:178-224`) | Introduce Parameter Object | `drawn` (`Paper.svelte:107`) must list the same fields | `page-fit.test.ts`; `one-frame` |
| 2.3 | Provenance glyphs | Four SVG paths in two files (`WordStack.svelte:155-161`, `LegendItems.svelte:42-51`), their list in a third (`provenance-icon.ts:15`) | Extract Component | Low | Pixel compare of a stack icon and its legend entry |
| 2.4 | `displayCyrillic` | Re-derives what the pipeline already puts on the word (`WordStack.svelte:48-74`; `pipeline.ts:348`; `packages/dictionary/src/cyrillic.ts:33`; `score/pairings.ts:870`) | Substitute Algorithm | Overrides and clitic suppression differ | Characterization test over the approval corpus first |
| 2.5 | `displayGloss` | A display rule inside a component, unreachable by a test | Extract Function to plain `.ts` beside `shown-ipa.ts` | None until 4.4 is ruled | Unit cases written from today's output |
| 2.6 | The sigil | Markup and type written twice with two bracket faces (`HeaderBar.svelte:51-53`, `:122-123`; `TitleHeader.svelte:157-159`, `:239-241`) | Extract Component | Which face is right is Dann's eye | `sigil.test.ts` as SSR; computed font of both |
| 2.7 | `DeskHead`'s pair | Copy of `ViewPair` (`DeskHead.svelte:75-97`, `:113-128`, `:179-226`) | Replace with a call to `ViewPair` | `tab-{id}` ids, wall-closed single | `view-pair-fill.test.ts`; phone tab tests |
| 2.8 | `InstallPrompt` strings | Bilingual words outside `i18n.ts` (`:33-54`), against invariant 11 | Move to `i18n.ts` (keys added, none deleted) | Ratified strings; gate test pins source | The gate test as a render |
| 2.9 | `ReadingWait` in `DeskHead` | Mounted there because two files sit at ceilings (`ReadingWait.svelte:11-13`); `Italics.svelte:2-3` re-exports for the same reason | Move, when `+page.svelte` is split | Depends on another unit | `e2e` wait tests |
| 2.10 | `LegendItems` imports `$lib/markup/legend` (`:4`); two panes import `Paper/blank-state` | Page furniture and documents import each other | Move Field (`MARKUP_WITHHELD_TYPE` to `provenance.ts`) | Low | `pnpm check`, ratchets |
| 2.11 | `shown-ipa.ts`, `verify-words.ts`, `provenance-icon.ts` | Text rules filed under a component folder, read by the drawer | Move Module to `$lib/text/` | Import paths only | Their three tests |
| 2.12 | The 14 px, 600, 1.5 px small-caps look | Five homes in the unit, three line heights (`RunningHeader.svelte:79-91`, `:106-117`; `TitleHeader.svelte:265-277`, `:358-368`; `BlankState.svelte:111-120`) | Extract to one class, line height a parameter | Unifying the heights is a behaviour change | Lane 81's `census.mjs`, zero rows moved |
| 2.13 | Nine source-pin test files | They pin spelling, not behaviour | Replace with `svelte/server` renders where markup is asserted | CSS pins need Playwright | The suite's own count |

### Tier 1: inside a file

1. **Dead print rules.** `TitlePage.svelte:196-201`, `SubsequentPage.svelte:139-144`, and `WordStack.svelte:411-417` repeat what `app.css:306-309` and `:359-366` already force with `!important`. Proof: `print-pages.test.ts`.
2. **Dead code.** A commented-out SVG (`WordStack.svelte:163-166`); an empty rule (`ReadingPaper.svelte:54-56`); the `textOnly` branch, which no builder sets (`LegendItems.svelte:25-28`, `:38`; grep, ran); a redundant selector (`PageFooter.svelte:219-220`); `animate` as `$state` never assigned (`WelcomeSheet.svelte:47`); `.lang-pill` split in two rules (`HeaderBar.svelte:155`, `:173`); one comment block twice (`InstallPrompt.svelte:210-215`, `:231-236`). `ROW_GAP` (`page-config.ts:122`) has no reader (grep, ran).
3. **Tombstones.** Seven "the N.45 rule that stood here" blocks (`Paper.svelte:257-264`, `TitlePage.svelte:184-194`, `SubsequentPage.svelte:135-137`, `RunningHeader.svelte:119-122`, `TitleHeader.svelte:415-425`, `PageFooter.svelte:228-242`) and two in `HeaderBar.svelte:10-16`, `:137-141`. One paragraph in `PageFit.svelte` would carry the warning. `TitleHeader.svelte:423` points to a TitlePage comment that is not there.
4. **Stale comments.** `ViewPair.svelte:3-6` says two places; one caller exists (grep, ran). `OctaveLine.svelte:20` and `ReadingWait.svelte:7` cite CONTRACT section 6; it is section 8. `WordStack.svelte:37` says it matches the Inspector exactly while `Drawer/InspectorPanel.svelte:58` keeps its own copy. `WordStack.svelte:237-239` reasons from a 20 px gap that is now 18 to 28 (`TextFitProbe.svelte:16`). `WordStack.svelte:402` says ink-tertiary; the code is opacity 0.45. `HeaderBar.svelte:106` says umber. `ReadingPaper.svelte:160`, `:222`, `:288` cite lines that moved (the function is now `scroll-to-anchor.ts:20`; ran). Five test headers say components cannot render (`one-head-one-foot.test.ts:9`, `footer-credit.test.ts:3`, `sigil.test.ts:3`, `install-prompt-gate.test.ts:5`, `welcome-sheet.test.ts:2`).
5. **Renames.** `VerseLine.svelte:7` imports under an alias and then reuses the original name. `InstallPrompt.svelte:140` names its string table `t`. That file is indented with spaces; the tree uses tabs.
6. **Performance.** `TitleHeader.svelte:176-186` renders the legend four times (one live, three probes), each calling `stemLegendDrawing`. `Paper.svelte:107` stringifies two maps on every change. `CursiveGlyph.svelte:14` loads 65 SVGs eagerly. None measured.

### Token table (plan section 4a)

57 hex literals by the census's own pattern (ran), one of them in a comment. The census does not count `rgba()` or `white`; those are listed too.

| Class | Literal and site | Becomes |
|---|---|---|
| MIGRATE | `#78716c`: `WordStack.svelte:247`, `:341`, `:394`; `LegendItems.svelte:77`; `PageFooter.svelte:147`, `:225` | `--stone-500` |
| MIGRATE | Fallbacks beside a live token: `ReadingPaper.svelte` 13; `DeskHead.svelte` 8; `ViewPair.svelte` 4; `ReadingAid.svelte` 7; `OctaveLine.svelte:60`; `InstallPrompt.svelte:203`, `:240` and `TextSourceLine.svelte:39` (both hold a value the token does not) | Drop the fallback |
| MIGRATE | `InstallPrompt.svelte:196` `var(--ink, #1a1612)` | `--ink-primary` |
| MIGRATE, font | `InstallPrompt.svelte:193`, `:201`, `:217`, `:238`; 22 `var(--font-x, 'literal')` fallbacks | `--font-serif`, `--font-sans` |
| NEEDS A TOKEN | `#fdfbf6` `ReadingPaper.svelte:129`, `:202`; `#fff` `:215`, `WelcomeSheet.svelte:271`, `:404`, `InstallPrompt.svelte:221`; `white` `HeaderBar.svelte:125`, `:133`, `:159`, `:194` | One ink-tier name for text on a hue (proposed `--ink-on-hue`) |
| NEEDS A TOKEN | `ReadingPaper.svelte:449` `var(--stone-200, #e7e5e4)`: the name is used and never defined | `--stone-200`, stone family |
| NEEDS A TOKEN | `InstallPrompt.svelte:176` `#f5f0e8`, `:242` `#d4cec8`, `:248` `#ede8e0`: near `--paper-light` and `--stone-300`, not equal | Desk's choice; a forced fit moves pixels |
| NEEDS A TOKEN, font | `'Lato IPA'` `BlankState.svelte:132`, `WelcomePlate.svelte:123`; `'Courier New'` `TitleHeader.svelte:240` | `--font-ipa`; the bracket face with 2.6 |
| NEEDS A TOKEN | `rgba(26, 22, 18, 0.06)` `DeskHead.svelte:225`, `ViewPair.svelte:115`; scrim and hairlines `WelcomeSheet.svelte:219`, `:369`, `:378`, `:475` | Tints of existing inks |
| LOCAL BY RIGHT | `#f00`, `#fff` `WelcomeSheet.svelte:203-204`: the flag of Canada | |
| LOCAL BY RIGHT | `#b9b4ac` `WelcomeSheet.svelte:306`: its own comment (`:305`) says why no token holds it | |
| LOCAL BY RIGHT | `'Finale Maestro'` `WelcomePlate.svelte:77`, `:126`: a face name, pinned by `welcome-plate.test.ts:87-95` | |
| LOCAL BY RIGHT | `white` in print rules, `rgba(0,0,0,0.35)` sheet shadow (`TitlePage.svelte:161`, `SubsequentPage.svelte:112`, `ReadingPaper.svelte:49`): one value in three homes; a `--sheet-shadow` would serve | |

## 3. Hidden relationships

1. **`app.css`'s print block styles this unit by class name**: `.paper-page`, `.paper-container`, `.word-stack`, `.header-bar` (`app.css:276-366`), and `.ipa-break` (`app.css:439`) is the only style `WordStack.svelte:178` gets.
2. **`WORD_STACK_PAD = 4`** (`page-config.ts:144`) repeats `WordStack.svelte:211`, and `:321` breaks it (4.3).
3. **The probe and the page must draw the same line**: `VerseLine`'s 28 px hanging indent and 0.4 rem gap (`VerseLine.svelte:63-72`) decide every wrap; `TextFitProbe.svelte:99` matches width through `contentWidth`.
4. **`drawn`** (`Paper.svelte:107`) must name everything that changes a word's width, or pages are cut from stale measures.
5. **Headers end at their rule** (`RunningHeader.svelte:38-42`; `page-config.ts:105-107`). `.tab-mark { top: 24px }` assumes a 48 px margin (`RunningHeader.svelte:103-108`); lane 80's pin does not cover it.
6. **`min-width: 74px`** holds the divider (`PageFooter.svelte:199-201`); a longer page label moves it.
7. **`BLANK_ANCHOR`** was derived from an 86.6 px squircle (`page-config.ts:53-57`), so it depends on `BlankState.svelte:81-95`.
8. **z-index ladder with no home**: install banner 9000 (`InstallPrompt.svelte:181`), reader's wait 9000 (`ReadingWait.svelte:137`), cards 9290 and 9300, welcome 9400 (`WelcomeSheet.svelte:214-218`).
9. **`ReadingPaper`**: `--sheet-pad-x` and the band's bleed (`:34-46`, `:126-127`); a four-class selector that must outrank `+page.svelte`'s heading colours (`:148-164`); scroll offsets summed from the band's own sizes (`:261-309`); `--sticky-chrome: 42px` is `DeskHead`'s height (`:235-247`).
10. **DOM lookups by name**: `.main-content` (`ReadingWait.svelte:44`), `.app-shell` and `header` (`WelcomeSheet.svelte:81`, `:139-140`).
11. **`WelcomePlate`'s `@font-face` is global** and registers the music font for the whole app (`WelcomePlate.svelte:69-81`).
12. **The plate's zone opacities and radii copy `ChartLayers`** and are held to the prototype, not to the chart (`welcome-plate.ts:8-12`, `:34-36`).
13. **The phone hides the page off-stage, never `display: none`**, because the header measures itself (`+page.svelte:4307-4311`).
14. **`@page` has two homes**: `Paper.svelte:157-159`, present only while TEXT is mounted, and `app.css:369`.
15. **`BlankState` sets `--accent` and `--ink`** (`:53`) and INSIGHTS' own notes inherit them; `--ink` is also the name `InstallPrompt.svelte:196` reads.
16. **`blank-states.test.ts` pins five files outside this unit** (`:101-199`: `+page.svelte`, both panes, `Drawer.svelte`, `sections.svelte.ts`).
17. **Test-read hooks**: `tab-{id}`, `text-source`, `data-word-index`, `data-blank-state`, `data-octave-line`; `data-stems` appears four times in a MELODY header (2.13, tier 1 item 6).
18. **Breakpoint 767 or 768 in three files** (`ReadingWait.svelte:49`, `DeskHead.svelte:171`, `ReadingPaper.svelte:470`), apart from the drawer's 1400.

## 4. Comment census

- **About 943 comment lines of 6,790** (grep, ran; a lower bound, since block interiors without a leading `*` are missed).
- **Pass, carrying a ruling:** 71 lines name Dann, a ruling, or a ratification, nearly all with date and words. Keep.
- **Opening comment present:** 22 of 32 non-test modules. **Absent:** `Paper`, `TitlePage`, `SubsequentPage`, `PageFooter`, `TitleHeader`, `WordStack`, `VerseLine`, `ReadingPaper`, `HeaderBar`, `InstallPrompt`.
- **Tombstones:** 17 lines in nine blocks (tier 1 item 3).
- **Retired names:** 24 lines say Transcription, Transcribe, Markup, or Marked score where the screen says TEXT and MELODY (ran).
- **Line-number citations:** 12 (ran); three checked and stale.
- **Bare pointers that fail a cold reader:** "§B.5" (`PageFooter.svelte:16`, `:216`), "item 1.6" (`LegendItems.svelte:25`), "Task 4.8" (`WordStack.svelte:163`), "Gould rule 12" (`PageFooter.svelte:218`).
- **Best in the unit, as models:** `PageFit.svelte:2-25`, `Paper.svelte:60-75`, `ReadingPaper.svelte:34-44`.

## 5. Duplication census

| Fact | Homes |
|---|---|
| Sheet dress (cream, shadow, relative) | `TitlePage.svelte:157-163`; `SubsequentPage.svelte:108-114`; `ReadingPaper.svelte:47-49` |
| Content window and row CSS | `TitlePage.svelte:167-180`; `SubsequentPage.svelte:118-131`; `TextFitProbe.svelte:120-124` |
| `tabName` derivation | `TitlePage.svelte:93`; `SubsequentPage.svelte:70` |
| Print: white sheet, no shadow | `app.css:306-309`; `TitlePage.svelte:196-201`; `SubsequentPage.svelte:139-144` |
| Print: word stack | `app.css:359-366`; `WordStack.svelte:407-421` |
| `@page` size | `Paper.svelte:158`; `app.css:369` |
| 816 and 96 | `page-config.ts:15`, `:21`; `ReadingPaper.svelte:32`, `:45`; `DeskHead.svelte:157`; `TextSourceLine.svelte:33` |
| Provenance glyph paths | `WordStack.svelte:155-161`; `LegendItems.svelte:42-51`; list in `provenance-icon.ts:15` |
| 16 px circled mark | `WordStack.svelte:352-380`; `LegendItems.svelte:80-89`; `OctaveLine.svelte:63-77` |
| Stress acute walk | `WordStack.svelte:48-74`; `dictionary/src/cyrillic.ts:33`; `score/pairings.ts:870` |
| Cyrillic vowel list | `WordStack.svelte:57` and nine other files (grep, ran) |
| `reconActive` | `shown-ipa.ts:25`; `Drawer/InspectorPanel.svelte:58` |
| The sigil | `HeaderBar.svelte:51-53`; `TitleHeader.svelte:157-159` |
| Segmented pair, markup, keys, styles | `DeskHead.svelte`; `ViewPair.svelte` |
| Small-caps label type | five homes (2.12) |
| Broad-note type (sans 9.5 px, stone) | `PageFooter.svelte:142-148`, `:219-226` |
| Legend and subtitle gap, 24 | `TitleHeader.svelte:99`, `:289`, `:333` |
| Squircle, 12 px, 16 by 26 | `BlankState.svelte:81-88`; `InsightsPane` (named at `BlankState.svelte:11`) |
| Language pill | `HeaderBar.svelte:155-196`; `WelcomeSheet.svelte:269-278` |
| Pill-end button | `InstallPrompt.svelte:216-246`; `WelcomeSheet.svelte:400-410` |
| Fine print, twice in one template | `WelcomeSheet.svelte:183-186`, `:189-192` |
| Zone opacity and radius formulas | `welcome-plate.ts:34-36`, `:66-79`; `voice/chart/ChartLayers.svelte` |
| Install strings outside `i18n.ts` | `InstallPrompt.svelte:33-54` |
| Running-head name source | stored form at `Paper.svelte:152`; display form at `TitlePage.svelte:88-90` |

## 6. Glossary lines

- **The page I print.** TEXT's sheets, cut to fit: `Paper/Paper.svelte`.
- **A word with its sounds and meaning.** The stack of IPA, Cyrillic, and gloss: `Paper/WordStack.svelte`.
- **What the page shows as a word's IPA.** `Paper/shown-ipa.ts`.
- **The "verify" label on a word Ilya is unsure of.** `Paper/verify-words.ts`.
- **The little circled mark saying where a stress came from.** `Paper/provenance-icon.ts`; its key, `Paper/LegendItems.svelte`.
- **The title block on page 1.** `Paper/TitleHeader.svelte`.
- **The line at the top of later pages naming the piece.** `Paper/RunningHeader.svelte`.
- **The credit and page number at the foot.** `Paper/PageFooter.svelte`.
- **The page shrunk to fit my phone.** `Paper/PageFit.svelte`.
- **The box that tells me what to add when a page is empty.** `Paper/BlankState.svelte`.
- **The sheet LEARN and GUIDE are printed on.** `Paper/ReadingPaper.svelte`.
- **The welcome I see on my first visit.** `Welcome/WelcomeSheet.svelte`.
- **"Saved" beside a field.** `Field/settle-field.ts`.
- **The coloured bar with [*Ilya*] and the language button.** `HeaderBar.svelte`.
- **TEXT, MELODY, INSIGHTS, LEARN, GUIDE across the top.** `DeskHead.svelte`.
- **The Poem and Lyrics switch.** `ViewPair.svelte`.
- **"From LYRICS" above the page.** `TextSourceLine.svelte`.
- **The offer to install Ilya.** `InstallPrompt.svelte`.
- **The larger words-only view on my phone.** `ReadingAid.svelte`.
- **The card that says Ilya is reading my score.** `ReadingWait.svelte`.
- **The line saying my part is read an octave lower.** `OctaveLine.svelte`.

## 7. Not established, with the instrument that failed

1. **Every page-dependent claim** (4.3, 4.5, 4.7, 4.9, the sigil's two faces): no browser. Measurements are named in each.
2. **4.8:** how `stressIndex` counts ѣ. Instrument: one `processText` case.
3. **4.4:** whether French dictionary glosses begin with pronouns. Instrument: a scan of the gloss data.
4. **4.7:** whether the 40 percent is ruled. I did not search `OPEN.md`.
5. **"Saved" after a song change:** `settle-field.ts:37` records the value once, at mount. If a field outlives a song change, leaving it untouched would show "Saved". Not traced through `Drawer/MetadataFields.svelte:106-119`.
6. **`ReadingPaper.svelte:297-309`:** the deck's scroll offset assumes a 40 px title; on a phone the title is about 27 px. Arithmetic only.
7. **Gates:** none run. I ran `wc`, `grep`, and read-only `git` only. Nothing was written to the repository.
8. **Standards read in part:** `PRODUCT.md` headings and lines 92-183, 376-454, 1163-1177, 1275-1300; `CONTRACT.md` section 8 and section heads; plan sections 3, 4, 4a; `code-conventions.md`, `ARCHITECTURE.md`, and both lane reports whole.
9. **Token count against the 420,000 cap:** not visible to me.

## 8. Files read

**49 of 49 in the unit, whole.** Paper/ 24 of 24; Welcome/ 7 of 7; Field/ 3 of 3; loose 15 of 15. `C/.DS_Store` is untracked (ran) and was not read.

**`Reading/`, structure only:** `CursiveGlyph.svelte` and `GuideSources.svelte` whole; script, branch skeleton, and style block of `GuideContent.svelte` and `LearnContent.svelte`; the first 14 lines of its three tests; none of the 65 SVGs. Structure: each file is one `{#if language === 'fr'} ... {:else} ... {/if}` (`GuideContent.svelte:17`, `:322`, `:619`; `LearnContent.svelte:16`, `:2057`, `:4067`), so every heading id exists twice and parity between the halves is unchecked by structure. `GuideContent.svelte:624`, `:640` read two more undefined tokens.

No fact in this report came from memory.
