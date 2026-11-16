> Filed by the desk 2026-11-15 19:2x, verbatim as the helper returned it (its two-space indent removed). One Fable 5.2 helper in the desk's cloud workspace, on a read-only checkout of `cloud-lane-57` at `2463d03` (`/home/claude/lanes/lane57` there). Harness count: 296,375 tokens, 67 tool uses, 14.4 minutes, against a cap of 370k said to Dann. The helper's own figure, "about 220,000", is not the count. The desk re-read these claims in the lane's tree before acting on them: the scrim's timings (`welcome-motion.ts:22`, the prototype's line 24); the plate's name (`WelcomePlate.svelte:24`); `heic-offline`'s origin (`e2e/heic-offline.test.ts:20`, `:45`); the key totals (1,270 at `fb9d829e`, 1,272 on lane 56, 1,278 on lane 57). Pictures SEEN by the desk: `desktop-en-final.png`, `plate-five-images-and-icon.png`. The rest is the reviewer's read.

# Review of lane 57 (the welcome sheet), as built at 2463d03

Paths are in `/home/claude/lanes/lane57` unless a line says otherwise. `Sheet` = `apps/web/src/lib/components/Welcome/WelcomeSheet.svelte`; `Plate` = `.../Welcome/WelcomePlate.svelte`; `i18n` = `apps/web/src/lib/i18n.ts`; "prototype" = `docs/sessions/welcome-sheet/ilya-welcome-draft-17.html` (and `-fr`), read with the fonts stripped.

## 1. Verdict

**MERGE WITH FIXES.** The code builds what the brief and the amendment ask, every string matches its ratified source, and I found no blocker; the fixes are one merge-time edit and three gaps in evidence, none of which changes what a singer sees.

Fixes:
1. When lane 56 is also in the tree, `i18n.ts:19` conflicts; the resolved line reads `This file holds 1,280 keys.` (section 8).
2. The fourth plate image (the enlarged [ɑ] zone) has no saved picture. One picture, or Dann looks at it live.
3. The two desktop mid-wipe pictures do not show a lit label in its lit colour, and the report says they do (section 5). Retake after the 300 ms colour change, or correct the sentence.
4. `e2e/heic-offline.test.ts` is unverified with the sheet in the tree (section 7). Run it once on a machine that has a build, or give its context the flag for its own origin.

Owed to Dann by eye, not fixes: the note's horizontal place, Bravura against Maestro, the shadow's tail (all three reported by the lane), and the plate's inks (not reported, defect 2).

## 2. The brief's requirements

| # | Requirement | Where built | Status |
|---|---|---|---|
| 1a | New component over the app on first visit, before anything else is usable | `Sheet:43` (open decided at init), `:79-84` (`.app-shell` inert), `+page.svelte:13`, `:3728` | BUILT |
| 1b | `role="dialog"`, `aria-modal`, labelled by its title | `Sheet:150`, `:165` | BUILT |
| 1c | Focus moved in and trapped; Escape does nothing | `Sheet:87-129` (Escape `:95-99`, Tab `:100-117`, focusin guard `:119-121`, focus `:124`) | BUILT |
| 1d | Built as the existing cards are; not a native `<dialog>` | `Sheet:60-63` (portal), `:148-150` | BUILT |
| 1e | Stands over the install banner and other first-visit affordances | `Sheet:205` (9400; banner is 9000 at `InstallPrompt.svelte:181`, and sits inside the inert shell, `+page.svelte:3812`) | BUILT |
| 1f | Does not delay the dictionary or the service worker | `Sheet` awaits nothing; `+page.svelte:3672` (`loadDictionary` not awaited) | BUILT (by reading; the lane's browser test not re-run) |
| 1g | Never prints | `Sheet:475-479` | BUILT |
| 2a | Flag `ilya:welcomeSeen`, written on Begin, try and catch, storage that throws shows the sheet | `welcome-seen.ts:16`, `:28-34`, `:37-44`; `Sheet:136` | BUILT |
| 2b | Browser tests start as a returning browser by one shared setup; only the sheet's tests clear it; no existing test touched | `playwright.config.ts:10`, `:23`; `e2e/returning-browser.storage.json:5-6`; `e2e/welcome-sheet.test.ts:7`; `e2e-phone/welcome-sheet.test.ts:7`. The diff modifies no existing test file | BUILT |
| 3 | Follows the app's language; pill switches as the app's pill does; "reuse it; do not write a second language control" | `Sheet:52`, `:153`; `language-switch.ts:20-23`; `HeaderBar.svelte:33-35`; `+page.svelte:3728` (same `handleLanguageChange`) | PARTLY: the rule and the handler are shared; the button and its CSS are a second copy (`Sheet:153`, `:259-268`) |
| 4a | Eight `welcome.` keys, English and French, pinned by a test | `i18n:2529-2536`; `welcome-strings.test.ts:18-35` | BUILT |
| 4b | Index row and new total | `i18n:91`, `:19` (1,278; my own count of the keys is 1,278, `welcome.` 8) | BUILT |
| 4c | Stations reuse `tab.text`, `tab.markedScore`, `tab.insights`; Begin reuses an existing key | `Sheet:54-58`, `:180`; `i18n:209`, `:227`, `:231`, `:1283` (`calib.welcome.beginButton`) | BUILT |
| 5a | я in Source Serif 4 Bold; [ɑ] in Lato IPA | `Plate:27`, `:31`, `:110-116` | BUILT |
| 5b | Eighth note on a staff, Bravura U+E1D7, centred by its bounding box | `Plate:36-37`; `welcome-plate.ts:99`, `:108`, `:111-114` (box equals `bravura_metadata.json`, which I read) | BUILT |
| 5c | The [ɑ] zone; the vowel space from `computeZones({}, 'bass')` and the chart's geometry | `Plate:41-56`; `welcome-plate.ts:60-89` | BUILT (the radius formulas and opacities are copied from `ChartLayers.svelte:50-60`, not imported) |
| 5d | The icon: five equal stripes in jewel tokens, Илья in cream | `Plate:59-64`, `:128-137`; `welcome-plate.ts:122-123` | BUILT |
| 5e | "Contents in `--ink-stave`" | `Plate:36-37`, `:44`, `:50`, `:55` use it; `:27` uses `--ink-primary`, `:31` uses `--ink-secondary` | PARTLY (defect 2) |
| 6a | Motion once, about 5.5 s, 30-degree wipes | `welcome-motion.ts:11-22`, `:44-51`; `Plate:91-99`; `Sheet:66-76` | BUILT (last wipe ends at 6,070 ms, the prototype's own arithmetic) |
| 6b | Text readable and Begin usable from the first frame | nothing in `Sheet:150-181` is hidden or delayed | BUILT |
| 6c | Reduced motion shows the final state | `Sheet:45-48`, `:467-473`; `Plate:101-103`; `welcome-motion.ts:69-72` | BUILT |
| 6d | Plate is `role="img"` named Илья; pictures hidden from screen readers | `Plate:24`, layers `:26-59`; `Sheet:158` | BUILT |
| 7 | Phone: narrow layout, Begin full width in a fixed footer | `Sheet:415-466` | BUILT |
| n/a | No reopen control, no app icon files | none in the diff | BUILT (absent, as asked) |
| Step 1 | Pictures at 1280 x 800 and 390 x 844, both languages, final and mid-wipe | pictures folder; files are 2560 x 1600 and 780 x 1688 (2x) | BUILT; the fourth plate image is not pictured |
| Step 2 | Merge `Shane`, eight gates, Playwright both projects, one report | report Parts 2 and Amendment | PARTLY: the desktop suite is assembled from two runs, and the full suites were not re-run after the amendment (the report says both) |
| Amend. | English licence line, own commit, pin moved, English pictures retaken, Begin whole, report section | `i18n:2536`; commit 2463d03; `welcome-strings.test.ts:26`, `:48-62`; `desktop-en-final.png`, `phone-en-final-scrolled-to-end.png`; report `:222-254` | BUILT |

## 3. The strings, character for character

Method: a script decoded each `welcome.` value from `i18n.ts` and compared it with the prototypes (entities decoded), with `OPEN.md:3837-3839` (asterisks read as italics and semibold), with `GuideContent.svelte:579` and `:283`, and with the amendment's sentence.

| Key (`i18n` line) | English | French |
|---|---|---|
| `welcome.band` (2529) | identical to OPEN.md and prototype | identical |
| `welcome.title` (2530) | identical | identical |
| `welcome.lead` (2531) | identical, *Ilya* in `<em>` | identical |
| `welcome.body` (2532) | identical, four *Ilya* in `<em>`, semibold span as ratified | identical; three U+2019 apostrophes |
| `welcome.method` (2533) | words identical to prototype. Against OPEN.md: U+2019 in "Grayson’s" where `OPEN.md:3837` has a straight apostrophe (the prototype has U+2019) | words identical to prototype. Against OPEN.md: U+00A0 before the colon where the text of `OPEN.md:3838` has an ordinary space (the same line's closing note and the prototype call for the no-break space) |
| `welcome.maker` (2534) | identical | identical; no space before the semicolon; U+2019 in « l’argumentaire » |
| `welcome.madeIn` (2535) | identical; the en space U+2002 and the flag are added by `Sheet:171` and `:177`, as the prototype has them | identical |
| `welcome.licence` (2536) | **equals the amendment exactly** (190 characters): both "Ilya" in `<em>`, U+00A0 before the 3. Equals the first two sentences of `GuideContent.svelte:579` except that the GUIDE has an ordinary space before the 3 | **unchanged from the prototype**, exact. Against `OPEN.md:3839` (tags stripped there): U+00A0 before the 3 where OPEN.md has an ordinary space, and both "Ilya" in `<em>` |

Other differences and facts:
- Every link gained `target="_blank" rel="noopener"` (four per language, `i18n:2533-2534`). Markup, not words; reported by the lane as departure 4.
- The lane links dannmitton.com and ilya.dannmitton.com as the prototypes do; OPEN.md names only the two handle links.
- One ordinary space joins lead and body (`Sheet:166`), as the prototype has.
- Stations (`i18n:209`, `:227`, `:231`): TEXT, MELODY, INSIGHTS; TEXTE, CHANT, APERÇUS. Begin (`i18n:1283`): "Begin", « Commencer ». Pill words (`language-switch.ts:22`): "Français", "English". All equal the prototypes.
- Not in `i18n`: the flag's name "Canada" (`Sheet:189`) and the plate's name "Илья" (`welcome-plate.ts:123`), both as the prototype has them.
- No straight apostrophe stands in any lane string.

## 4. Defects

No blocker found. In order of weight:

1. **Bravura is fetched for the plate on a first visit (inference, not run).** `Plate:69-73` declares the font with `font-display: swap`; the glyph is at `Plate:37`; the file is 247,200 bytes; the app's default music font is Finale Maestro (`score/notation-fonts.ts:42`). On a slow connection a singer may see an empty staff or a missing-glyph box for the third image until the font arrives. The report's Bravura departure does not name this cost.
2. **Plate inks, an unreported departure.** я is `--ink-primary` (`Plate:27`) and the first [ɑ] is `--ink-secondary` (`Plate:31`); the brief's item 5 says `--ink-stave`. The lane followed the prototype's hexes (#1a1612, #4a4540, prototype line 84). A singer sees what the ratified prototype shows. Dann's or the desk's call.
3. **The note stands about 10 units to one side of the prototype's** (`welcome-plate.ts:111-114` gives 123.4; prototype line 84 has 134). Reported by the lane; visible in the pictures: the notehead sits off the staff's middle.
4. **The shadow is the prototype's literal, heavier than `--float-shadow`** (`Sheet:226-230` against `app.css:150-152`); `OPEN.md:3836` says "the app's float shadow". Reported by the lane.
5. **The scrim leaves in 180 ms** (`Sheet:213`, `welcome-motion.ts:22`); the prototype's scrim takes 260 ms (prototype line 24). Not in the lane's departures. Barely visible.
6. **Focus after Begin goes to the document, not to a control** (`Sheet:89`, `:137-140`): the remembered element is whatever held focus before the sheet took it, usually the body. A keyboard singer starts from the top of the page. No crash.
7. **Keyboard scrolling in a short window (inference).** Focus rests on `.sheet` (`Sheet:124`) and the scroller is `.body` (`Sheet:270-273`), so arrow and space keys may not scroll the text until Tab reaches a link. Nothing scrolls at 1280 x 800.
8. **The plate's name "Илья" carries no `lang="ru"`** (`Plate:24`); a screen reader in an English or French voice may mangle it. As the prototype and the brief have it.
9. **Every current singer sees the sheet once after release,** because no existing browser holds the flag (`Sheet:43`). By design; said so Dann is not surprised.
10. **The recorder's panel would sit over the sheet** when its switch is on (`voice/engine/capture-file.ts:201`, z-index 2,147,483,000). A research tool only.

## 5. The pictures (all ten opened)

| Picture | What it shows | Supports the report? |
|---|---|---|
| `desktop-en-final.png` | Sheet centred over the dimmed app; sage band, WELCOME, Français pill; icon at rest; three grey labels (sampled #68635D); title; care box; Grayson's line in the 208 px column on four lines; maker's line on three; footer with made-in line, flag, the amended licence line on two lines, Begin whole | Yes, including the amendment |
| `desktop-en-mid-wipe.png` | Staff and note, fifth line part drawn; MELODY underlined | **No** for "MELODY lit in lavender": sampled, MELODY is the resting grey (#B6B1A9) with a grey underline and TEXT is still sage (#355C2C). A capture caught before the colour change, not a fault in `Sheet:302-313` |
| `desktop-fr-final.png` | French final state; sheet about 680 px tall of 752 available; « Commencer » whole | Yes |
| `desktop-fr-mid-wipe.png` | As the English; CHANT underlined, sampled #A89DA3, TEXTE #4C6B43 | **No** for "CHANT lit in lavender", same reason |
| `phone-en-final.png` | Plate 76 px beside the title on two lines; care box; Grayson's line; the maker's line cut through by the footer's edge; Begin full width | Yes. The cut line is the only cue that more follows |
| `phone-en-final-scrolled-to-end.png` | Body at its end: maker's line, rule, made-in line with flag, amended licence line on three lines; Begin unmoved | Yes |
| `phone-en-mid-wipe.png` | Small plate on the note | Yes |
| `phone-fr-final.png` | French; the first screen ends at Grayson's line; « Commencer » whole | Partly: the report says the maker's line continues under the fold; in French none of it shows on the first screen |
| `phone-fr-mid-wipe.png` | As the English | Yes |
| `plate-five-images-and-icon.png` | я, [ɑ], note on staff, vowel space with the [ɑ] dot, icon twice | Yes; the fourth image is absent, as the report admits |

Layout judgement: nothing looks broken. Desktop matches the prototype's grid. Two places read as tight: Grayson's line in the narrow column (four lines, the prototype's own layout), and the phone's first screen, where the made-in and licence lines need a scroll in both languages. No picture shows the French phone body scrolled to its end.

## 6. The report's claims

Checked and true:
- The cut from fb9d829e; four commits; no existing test file edited; nothing added under `static/`.
- All six prototype fonts are byte-identical to files in `static/fonts/` (I decoded and hashed them); no `<img>` in the prototype.
- Line citations for the language control, `handleLanguageChange`, the reused keys, the index total, and the ratchet numbers (`+page.svelte` 5,511 of 5,534).
- Strings taken from the prototypes without change; the amendment's line; the GUIDE has an ordinary space before the 3.
- Test counts are consistent: I count 47 new unit tests in five files, 14 desktop and 3 phone browser tests.
- Motion arithmetic (5,350 and 6,070 ms); the glyph's bounding box; the `target="_blank"` precedent in `footer.attribution`.

False or inexact:
- "MELODY or CHANT lit in lavender" in the mid-wipe pictures (section 5).
- "Highest z-index in the tree today is 9300": `capture-file.ts:201` is higher.
- Part 2 says the phone suite is 15 files including the sheet's; `e2e-phone/` holds 16 test files with it.
- Part 0 gives `heic-offline`'s origin as 127.0.0.1; the file says 127.0.0.2 (`e2e/heic-offline.test.ts:20`). Part 2 has it right.

Could not check (nothing was run): every gate count, every Playwright result, the footer measurements, the cold-server timing.

**The two desktop failures.** The report's evidence is its own statement that it re-ran the six failing tests on a clean worktree of fb9d829e and all six failed; no log is committed and no error text is quoted.
- `loupe-header.test.ts:47`: independently supported. `docs/memory/SCHEDULE.md:20-21` and `docs/sessions/report-code-closing-polish-step12_r1_2026-11-12.md:55` record it failing before this lane, cause not established.
- `calibrate-new.test.ts:392`: supported only by the lane's word. I found no earlier record of it in STATE, SCHEDULE, ENVIRONMENT, or OPEN. By reading, the lane cannot reach it: the test measures a button's height at 375 px in French, the lane changes no file on that path, and a returning browser never builds the sheet (inference).

## 7. Side effects outside the sheet

- **`HeaderBar.svelte`** (`:4`, `:33-35`): the pill's two derivations now come from `languageSwitch`. Same values, same handler; nothing else in the header changed. The file grew by two lines, which moves every line number lane 58's brief cites there.
- **`+page.svelte`** (`:13`, `:3727-3728`): one import, one comment, one element. Ratchet 5,511 of 5,534. The sheet's CSS, including a global `@font-face` for Bravura (`Plate:69-73`), now loads with the page for everyone.
- **`i18n.ts`** (`:19`, `:91`, `:2522-2536`): total 1,270 to 1,278, one index row, eight keys. Begin is coupled to the calibration wizard's key (`:1283`).
- **New couplings in gate 4:** `welcome-strings.test.ts:70` and `welcome-plate.test.ts:6` read the two prototype files under `docs/sessions/welcome-sheet/`, so moving or pruning that folder fails the gate. `welcome-strings.test.ts:56-62` ties the English licence line to `GuideContent.svelte:579`, so a GUIDE edit to that paragraph fails the gate until the sheet's line is ruled again.
- **`playwright.config.ts`** (`:10`, `:23`): every pre-existing test now runs as a returning browser: 34 files in `e2e/` and 15 in `e2e-phone/`, since neither project overrides the setting (`:34-38`, `:48-55`). Exceptions:
  - `e2e/heic-offline.test.ts:45` runs on its own origin, where the stored flag does not apply, so the sheet stands over its page. By reading, its steps (`:75-78`, a hidden file input and visibility checks) do not need a click (inference). It skips without a build, and CI's job has no build step and runs only the desktop project (`.github/workflows/ci.yml:98-134`), so neither CI nor the lane has run it.
  - `e2e/insights-page.test.ts:84` opens extra contexts; the lane reports it passed, which fits inheritance of the setting.
  - **No test of first-visit behaviour lost its meaning:** a search of both folders found no test of the install banner or any other first-visit affordance, and no test that clears storage. The state file adds one key, so every other fresh-browser default is still exercised.

## 8. Merge risks

**Against `origin/Shane` 2c07ab75:** a trial merge is clean.

**Against lane 56 (`origin/cloud-lane-56`):** one conflict, `i18n.ts:19` ("1,272 keys" against "1,278 keys"). Resolve to **1,280**. Lane 56's index row (`markup.`, near `:53`) and its two keys (near `:1986`) merge without conflict with lane 57's row (`:91`) and keys (`:2529-2536`). No other file is changed by both lanes.

**Against lane 58 (N.202; no branch exists yet, so this is computed, not run):**
- `HeaderBar.svelte`: no textual conflict expected; lane 57's hunks end at line 35 and lane 58's begin at the sigil. Lane 58's cited lines move by two: `:49-50` becomes `:51-52`, `:116` becomes `:118`, `:138-158` becomes `:140-160`, and its comment lines likewise.
- `i18n.ts`: `footer.attribution` moves from `:1047-1048` to `:1048-1049` after lane 57, and to `:1049-1050` with lane 56 as well; no textual conflict. Lane 58's Step 4 edits `:19`, which conflicts with any lane not yet merged; after 56 and 57 it reads 1,280 and Step 4 makes it 1,282. Its `toc.` row moves from `:80` to `:81`.
- `+page.svelte`: lane 58's `:90` and `:2925` become `:91` and `:2926`; no conflict expected.
- Lane 58's version guard (a year followed by a letter): no hit in lane 57's new sources or strings by my search with its pattern.

## 9. What I could not establish

- Any gate count or Playwright result; nothing was run.
- Whether `calibrate-new.test.ts:392` fails on the untouched tip, beyond the lane's statement.
- Whether `heic-offline` passes with the sheet standing.
- How the fourth plate image looks; how a lit station label looks in its colour; the French phone body at its end.
- Anything on a real iPhone or in Safari, and the phone held sideways (844 x 390 takes the desktop layout with about 200 px of scrolling body, by arithmetic only).
- Whether a French-stored browser paints one English frame before the stored language is restored (`+page.svelte:234`, `:3598`).
- Whether the note's glyph shows late on a slow connection (defect 1).
- How Svelte orders the inert cleanup against the focus call in defect 6.

## 10. What I read, and what I ran

Read in full: the brief r2; `OPEN.md:3825-3867`; the lane's report; `WelcomeSheet.svelte`; `WelcomePlate.svelte`; `welcome-plate.ts`; `welcome-motion.ts`; `welcome-strings.test.ts`; `welcome-plate.test.ts`; both `welcome-sheet.test.ts` files; `playwright.config.ts`; `interface-text.md`; the English prototype with fonts stripped and the French one by diff against it; the lane's diff of the four shared files, `language-switch.ts`, and `welcome-seen.ts`; lane 58's brief; all ten pictures.

Read in part: `CONTRACT.md` (headings and the cited lines), `+page.svelte`, `HeaderBar.svelte`, `GuideContent.svelte:283` and `:579`, `app.css` tokens, `ChartLayers.svelte:50-63`, `heic-offline.test.ts`, `insights-page.test.ts`, `calibrate-new.test.ts`, `loupe-header.test.ts`, `i18n-index.test.ts`, `ci.yml`, the critique's headings, lane 56's diff of `i18n.ts`, and the test names of the three smaller unit test files.

Not read: `ENVIRONMENT.md`, `KeySignatureCard.svelte` beyond its z-index lines, brief r1.

Installed nothing and ran no test suite. Ran read-only git commands, Python scripts for the string comparison, the font hashes, the key count, and colour sampling of the pictures (Pillow was already present), and two trial merges with `git merge-tree` whose objects went to `/home/claude/reviews/lane57/objs`; a check found no file changed under `/home/claude/n202`. Scratch files are under `/home/claude/reviews/lane57/` only. Nothing in this report comes from memory.

One fact that may be worth adding to `ENVIRONMENT.md`, learned from `.github/workflows/ci.yml:98-134`: CI runs only the desktop Playwright project and has no build step in that job, so the phone suite and `heic-offline` never run in CI.

Rough count: about 220,000 tokens.
