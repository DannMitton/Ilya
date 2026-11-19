# Review of the lane 71 brief, r1 (blank states of TEXT, MELODY, and INSIGHTS)

Reviewed 2026-11-19 against the clone at `/home/claude/dannmitton/ilya`, `f7e0383` (`git log --oneline -1`). Brief md5 `ddf0aa4dea4ee5827c034278d8f6257c`, companion md5 `9dc581971462403e793c23eb2bc67626` (`md5sum`, both match). Every claim below carries a `path:line` read in this session, a command run in this session, or the words "not established". Paths are relative to `apps/web/src/` unless they begin with `apps/`, `scripts/`, or `docs/`. No browser was run, so nothing here is a measurement of a drawn page.

Verdict, stated first: **DO NOT SEND.** Five blockers, in section 7.

## 1. The citations of section 2

| Brief's citation | Finding |
|---|---|
| `TitlePage.svelte:127-133`, `.empty-directive` | Holds (`lib/components/Paper/TitlePage.svelte:127-133`). |
| `TitlePage.svelte:129`, the device branch | Holds, verbatim (`:129`). |
| `i18n.ts:1014`, `:1032` | Hold (`lib/i18n.ts:1014`, `:1032`). |
| `Paper.svelte:35`, `+page.svelte:4302` | Hold (`lib/components/Paper/Paper.svelte:35`, passed on at `:192`; `routes/+page.svelte:4302`). |
| `MarkupPane.svelte:1092-1114` | Holds; the `div` closes at `:1115`. |
| `MarkupPane.svelte:450`, `hasReadings` | Holds. |
| `i18n.ts:1498`, `profile.lede` | Holds. |
| `profile-status.ts:34-46`, `statusLineFor` | Holds. |
| `MarkupPane.svelte:1102-1107` | Holds; the expression ends at `:1108`. |
| `i18n.ts:1514`, `profile.emptyState` | Holds. |
| `singer-blocks.ts:382-387`, `:377-379` | Hold. |
| `i18n.ts:1902`, `:2081` | Hold. |
| **`SingerBlock.svelte:88-91`, "They render at"** | **Wrong for one of the two blocks.** The `silence` block renders at `:88-91`. The `notes` block renders at `lib/insights/SingerBlock.svelte:172-183`, with its link row at `:178-182`. |
| `SingerBlock.svelte:90`, `:63`, `:181` | Hold. |
| `scripts/ratchets.json:18` | Holds (`grep -n InsightsPane scripts/ratchets.json` gives line 18, 677). |
| `i18n.ts:168`, `:1499`, `:1503`, `:1504` | Hold. |
| `profile-status.ts:48-52` (risk 3) | Holds as a comment; the function is `:53-58`. |
| `~/Downloads/ilya-ship.sh:180` (step 6) | Not established; the file is outside the clone. |

Two descriptive claims in section 0: "MELODY floats three italic lines about forty percent down" is not established, and the code centres them in the window (`lib/markup/MarkupPane.svelte:1190-1198`, `justify-content: center`). "TEXT says at the bottom of the screen, MELODY says on the left" holds (`lib/i18n.ts:1032`, `:1499`, `:1503`, `:1504`), and TEXT's desk string also says "on the left" (`:1014`).

Companion: its statement that Dann's words "are in `INBOX.md` under those times" is not established at this commit. `grep -n "squircle centred\|Same with Insights" docs/memory/INBOX.md` returns nothing, and the last 2026-11-19 entries shown are 00:00 to 00:08 (`docs/memory/INBOX.md:907-911`). Its `isPersonal (profile-status.ts:39)` is a use; the definition is `lib/voice/engine/sung.ts:41`.

## 2. What the brief missed

### Call sites and state

- **INSIGHTS has a second blank page the brief never names.** With a score and no measured voice, `lib/insights/InsightsPane.svelte:328-341` draws a `silence` block inside a squircle (group `totals`) with the heading `profile.withheld.heading`, the line `insights.silence.unmeasured`, and two withheld items, then a notes block. This is the "voice missing, score ready" state, the only place the second form of the ask could appear. Keys: `lib/i18n.ts:1533`, `:1537`, `:1899`, `:1900`, and `insights.method.silent` (`:1892`, chosen at `InsightsPane.svelte:293`).
- The call site of `noScoreBlocks` is `lib/insights/InsightsPane.svelte:327`. The method line it passes is resolved at `:292-294` by `methodLineKey` (`lib/insights/identity.ts:66-70`), which already has **three** no-score lines by voice state: `insights.method.noScore.samples`, `.generic`, and `.none` (`lib/i18n.ts:1904-1906`), ratified 2026-11-16 (`lib/i18n.ts:1903`, `identity.ts:61-64`). The companion ratifies one NOTES line for INSIGHTS, which is `.samples` verbatim.
- The notes block draws a link row under the method line: "What INSIGHTS shares, and how" (`calib.pane.door.insights`, `lib/i18n.ts:1453`) and, when the method line is generic, the record door (`links.recordKey`, `lib/i18n.ts:1448-1450`), at `lib/insights/SingerBlock.svelte:178-182`. The brief does not say whether these stay on the blank page.
- TEXT's box has a second tenant. `emptyNotice === 'loading'` draws `dict.loading` (`lib/i18n.ts:119`) in the same `.empty-directive` (`TitlePage.svelte:130-131`), and `'quiet'` draws nothing (`lib/one-action.ts:150`, `:166-169`). The brief retires the device branch and does not say what the loading notice does.
- TEXT's blank line does not print: `TitlePage.svelte:210-212` sets `.empty-directive { display: none }` under `@media print`. The INPUT link prints as plain text (`SingerBlock.svelte:625-628`). The brief is silent on print for the new component.
- After the device branch goes, `isMobile` is unused in `TitlePage.svelte` (`grep -n isMobile` gives `:27`, `:58`, `:129` only); `Paper.svelte:179` still passes it.
- MELODY: the article's `aria-label` (`MarkupPane.svelte:1056`, `profile.emptyStateAria`, `lib/i18n.ts:1532`); the header comment at `MarkupPane.svelte:22`; the `vowelGlyph` snippet (`:956-957`), which sets the glyph `aria-hidden` and adds the spoken name; the CSS at `:1190-1262`; the count words `profile.count.N` (`lib/markup/profile-status.ts:20-22`); the list joins (`lib/i18n.ts:1510-1512`); and `calib.pane.belowCore` (`lib/i18n.ts:1443`), which `statusLineFor` returns for every voice below five stable core vowels (`profile-status.ts:39`).
- `profile.lede` has one reader, `MarkupPane.svelte:1096` (a grep for `profile\.lede` across `apps`, `packages`, and `scripts`, outside `i18n.ts`, returned that line only). This answers risk 2.
- The handlers: `openInput` (`routes/+page.svelte:1683-1690`), `openVoice` (`:1660-1668`), the links object (`:4367`). MELODY receives no links today (`routes/+page.svelte:4384-4400`), and TEXT receives none (`:4302`).
- The VOICE band's name key is `group.scoreMarkup` (`lib/i18n.ts:163`, VOICE and VOIX). The brief says "the VOICE band's own name" and gives no key; the companion sources VOIX from a sentence (`:1904`).
- Stale comments that quote the retired string: `lib/one-action.ts:15`, `:155`; `MarkupPane.svelte:1211`, `:1239`.

### Tests that will break

Unit:
- `lib/insights/ratified-lines.test.ts:418-419` pins both languages of `insights.silence.noScore`.
- `lib/insights/links.test.ts:41-42` pins the shape `noScoreBlocks` returns; `:71-78` pins the linked sentence's text.
- `lib/markup/profile-status.test.ts:14-22`, `:47` pin "Your profile is now set with ..."; `:58` pins the provisional tail with "DRAWER on the left"; `:51-53` reads `MarkupPane.svelte` as text and requires the `statusLineFor(...)` call to stay there, character for character.

`apps/web/e2e`:
- `core-loop.test.ts:47`, `:239` (the TEXT sentence, EN and FR).
- `singer-paths.test.ts:98-102`, `:195-197` (`.profile-empty` and `profile.emptyState`, EN and FR).
- `melody-no-score-count.test.ts:24`, `:27` (the `.profile-status` selector), `:39` ("is now set with five vowels measured").
- `insights-no-score.test.ts:31-32` (the sentence), `:34-35` and `:37-62` (the three method lines by voice state, including a contralto at `:55-62`).
- `insights-links.test.ts:121`, `:131` (the sentence, read from `p.prose`), `:87` (the link found by role `button`), `:170-177` (print), `:69-70` (`.notes-links`).

`apps/web/e2e-phone`:
- `insights-links.test.ts:60`, `:74-75` (the link found as `button.offer-link` with the text INPUT), `:84-90` (the record link on the no-score page).

No test in either folder uses `toHaveScreenshot` or `toMatchSnapshot` (`grep -rln` returned nothing).

## 3. The design as specified

### a. Can one component serve all three pages

Yes for TEXT and MELODY, and for INSIGHTS only by leaving the block system. What each gives up:

- **TEXT** gives up `.empty-directive` (centred text, italic, tertiary ink, 480 px cap, `TitlePage.svelte:175-188`) and the device branch. It gains a link handler it has never had, threaded through `Paper.svelte` and `TitlePage.svelte` from `routes/+page.svelte:4302`. If the component sits inside `.page-content`, it inherits TEXT's own box: left 88 plus 4 of padding, 4 of top padding (`lib/page-config.ts:108`, `TitlePage.svelte:118`), where the other two pages use 96 (`MarkupPane.svelte:1192-1193`, `InsightsPane.svelte:612-613`).
- **MELODY** gives up `.profile-copy`, `.profile-line`, and `.profile-empty` (`MarkupPane.svelte:1201-1262`) and the `hasReadings` branch (`:1093`, `:1111`). It also has to hand its provisional sentence to the component, and that sentence is not a string: it is fragments around a snippet (`:1102-1106`, `:956-957`). Step 1 specifies "a heading and one or more sentences"; risk 3 says the assembly must be kept. Those two cannot both hold unless the notes slot accepts a snippet. The brief does not say so.
- **INSIGHTS** gives up the block system for its blank page. `.column` is positioned by `top` only (`InsightsPane.svelte:580`, `:610-617`), its blocks are measured off screen and paginated from the top (`:407-423`, `:459-468`), and the squircle is drawn by `segment` for non-`free` groups (`:532-540`). A block inside that flow cannot be centred. The component has to be drawn directly in the `article`, which costs lines in a file at its ceiling (section 5). `paginate` returns one page for an empty list (`lib/insights/paginate.ts:76`, `:164`), so the article still draws with no blocks.
- The shared squircle: `.squircle` is a scoped rule in `InsightsPane.svelte:622-630`, with the border hard-coded to `var(--rose)` (`:624`) and padding `16px 26px` (`:626`). It declares no background; "cream inside" is the page showing through (`:605`). INSIGHTS still needs the rule for its ordinary pages (`:536`), with the open-top and open-bottom forms (`:632-644`).

### b. Is "centred vertically between the title rule and the footer rule" well defined

Not as the three pages are built. They would not land in the same place.

| Page | Top of the content box | Bottom of the content box | Centring today |
|---|---|---|---|
| TEXT | `48 + title header + 16` (`Paper.svelte:87`, `page-config.ts:21`, `:41`), then 4 of padding | `48 + max(80, footer) + 8` (`Paper.svelte:85-86`) | `flex: 1` and `align-items: center` (`TitlePage.svelte:175-188`) |
| MELODY | `48 + header + 18`, a local constant (`MarkupPane.svelte:472-474`) | `48 + max(80, footer) + 8` (`:494-496`) | `justify-content: center` (`:1197`) |
| INSIGHTS | `48 + header + 16` (`InsightsPane.svelte:284`) | **None.** `.column` has no `bottom` and no height (`:610-617`). The page's room is `height - 48 - footHeight - 40 - top` (`:389`, `:460`) | None; content flows from the top |

Three reasons the midpoints differ:

1. MELODY's gap under the header is 18 and the other two use 16.
2. Each header is measured and carries different content (`TitlePage.svelte:105-113`; `MarkupPane.svelte:1074-1087`, with a legend; `InsightsPane.svelte:494-512`, with the identity line and a note), so equal header heights are not established.
3. "The space between the title rule and the footer rule" and "the content window" are different intervals. The window's bottom is a reserve with a floor of 80 (`page-config.ts:84`), while the footer is pinned at `bottom: 48px` and is as tall as its content (`lib/components/Paper/PageFooter.svelte:107-109`, hairline at `:92`). The drawn height of a blank page's footer is not established.

The brief has to say which interval it means and how Code proves all three agree.

### c. Does the generalized section link work in both languages

The current mechanism (`SingerBlock.svelte:63`, `:90`) links the first, case-sensitive occurrence of one word in one line that equals one key. Generalized as step 3 words it ("links every name it finds"), these break or are left open:

1. **Case.** The ratified French reads « Établissez votre voix dans VOIX ... ». A case-sensitive search finds VOIX once. A case-insensitive one links « voix » first. Step 3 does not fix the case rule.
2. **Order.** Both languages put VOICE before INPUT. A loop over the map that slices once per name, as `withInput` does (`:63`), loses the second name unless it walks the line by position. Step 3 does not say so.
3. **Which lines pass through it.** VOICE also stands in both NOTES lines ("set them in VOICE"; "measured in VOICE", `lib/i18n.ts:1904`). "Every name it finds" would link those too, in a state where the companion says the singer "is never sent back to VOICE" (companion `:41`). The brief does not say whether NOTES lines are linked.
4. **The element.** The link is a `button` styled as text (`SingerBlock.svelte:63`, `:585-591`), and three tests find it by role or tag (`e2e/insights-links.test.ts:87`, `e2e-phone/insights-links.test.ts:60`, `:74`). Constraint 5 says "The links are text, not buttons with their own furniture", which Code can read as "no `button` element".
5. **Print.** The link prints as plain text only because of `SingerBlock.svelte:625-628`; a new component needs the same rule, and `e2e/insights-links.test.ts:170-177` checks it.
6. **The rich text pass.** `withInput` slices the line before `richParts` splits it (`SingerBlock.svelte:63`, `lib/insights/text-parts.ts:52-69`). A name inside an italic `*...*` span or a bracket would be cut wrongly. None of the ratified sentences has one, so this is a hazard for the "directional census" the DESK DEFAULT anticipates, not for this lane.
7. **The French name.** Not a break, an omission: the key is `group.scoreMarkup` (`lib/i18n.ts:163`).

Removing the identity test at `:90` has no side effect on other `silence` lines: the only other one is `insights.silence.unmeasured` (`InsightsPane.svelte:335`), which names neither section (`lib/i18n.ts:1899`).

## 4. The state logic of step 2

**The brief is wrong, and this is a blocker.**

Step 2 says a voice exists when any vowel is sampled or a voice type is chosen, and "Either one is enough: the page draws." The code:

- A chosen type gives generic values only for five types: `generic = !anySung && hasPlaceholderProfile(voiceType)` (`lib/voice/engine/resolve-values.ts:153-154`). Soprano, mezzo-soprano, tenor, baritone, and bass qualify; "Contralto, countertenor, bass-baritone, 'Not sure', and no type keep the page that says nothing was measured" (`resolve-values.ts:148-152`; `lib/voice/engine/stand-ins.ts:64-79`). There are nine types (`lib/voice/voiceTypes.ts:19-29`).
- INSIGHTS draws its findings only when `adapted.completeness.formants` is true and a score is present (`InsightsPane.svelte:204-214`); `formants` is "at least one fR1 in the snapshot" (`lib/analysis/analyze-score-adapter.ts:91-93`). For a contralto with nothing sampled it is false, so once she adds a score INSIGHTS draws "No voice has been measured" (`InsightsPane.svelte:328-341`). The existing tests already treat a contralto as a voice with "nothing usable and no generic values" (`e2e/insights-no-score.test.ts:55-62`; `lib/insights/identity.test.ts:96`).
- So for four of nine types, the companion's row 2 ("A voice type chosen, nothing sampled: score only; the page draws from generic values") is false on INSIGHTS. The ruled row cannot be built as ruled for those four types.

Two further faults in the same step:

- **MELODY never needs a voice to draw.** Its score branch is `scorePages && scorePages.length > 0` (`MarkupPane.svelte:961`); `paginated` needs `readingScore && analyzed` (`:848-863`), and `analyzed` needs `analysisScore && vowelResolver` (`:729-733`). No voice term. With no measured voice it draws the score and a withheld statement (`:831`, `:1015`). The second form of the ask ("Set up your voice in VOICE to begin.") is therefore unreachable on MELODY, and by the ratified rule ("the ask names only what stops the page drawing at all") the voice never stops MELODY drawing, while the ratified table has MELODY asking for both.
- **The table and the forms do not match.** The table has four rows, all with no score, and yields two forms (both, score only). The third form, voice only, belongs to the state "score present, no measured voice", which is in no row, and whose only call site (`InsightsPane.svelte:328-341`) is not in the brief. "Tests for all four states of the table" cannot cover three forms.

"A score exists when the pane has its analysis" is also loose: MELODY's test is `scorePages` (`MarkupPane.svelte:961`) and INSIGHTS' is `analysisScore` (`InsightsPane.svelte:327`). Both derive from the parsed score (`MarkupPane.svelte:574`, `:590`; `InsightsPane.svelte:172-173`), so they agree in practice; the brief needs to name them.

## 5. The ratchets

`node scripts/ratchets.mjs` printed "ratchets: OK." and reported `+page.svelte` at 5532.

| File | Lines (`wc -l`) | Ceiling (`scripts/ratchets.json`) | Headroom |
|---|---|---|---|
| `lib/insights/InsightsPane.svelte` | 677 | 677 (`:18`) | 0 |
| `lib/markup/MarkupPane.svelte` | 1349 | 1349 (`:16`) | **0, and the brief does not say so** |
| `routes/+page.svelte` | 5532 | 5534 | 2 |
| `lib/i18n.ts` | exempt (`ratchets.json:4-6`) | | |
| New files | | 1000 (`ratchets.json:3`) | |
| `SingerBlock.svelte` 630, `TitlePage.svelte` 214, `Paper.svelte` 264, `singer-blocks.ts` 396, `profile-status.ts` 72 | | no ceiling entry | |

Does a ceiling block the work as specified:

- **`MarkupPane.svelte`** will fall. It loses `:1093-1114` and the rules at `:1201-1262`, and gains a few props.
- **`InsightsPane.svelte`** is the tight one. Drawing the component in the `article` and resolving the ask adds lines; the only sizeable thing it can lose is the `.squircle` rules (`:619-644`), and it still needs them for ordinary pages (`:536`). Whether the lane fits is not established. It does not block as written, because the brief already tells Code to match gains with losses.
- **`routes/+page.svelte`** has two lines. The three call sites are single lines (`:4302`, `:4367`, `:4397`), so props can be appended at no cost. A new handler function cannot fit in two lines.

## 6. The French

The prohibition is unambiguous: it is stated at brief `:6-7`, `:132-134`, and `:168`. But three steps cannot be completed without unratified French:

- **Step 4.** `strings` is `Record<string, Record<Language, string>>` (`lib/i18n.ts:113`), so every new key needs an `fr` value. The new TEXT blurb, the MELODY lede, the INSIGHTS lede, and the voice-only ask have French only as DRAFT (companion `:87-95`). "Reword `insights.silence.noScore`" drops the French lede sentence from `:1902` with only a DRAFT to replace it. "Take the directional tails off" `:1499`, `:1503`, `:1504` requires editing three French strings whose replacement tail is DRAFT (companion `:96-100`).
- **Step 5** asks for French pictures of all three pages. Each needs a DRAFT lede.
- **Section 8** says "in both languages" twice.

The brief does not say what goes in the `fr` slot meanwhile. The tree has a convention for owed French, an empty value that reads `[MISSING: key]` (`lib/i18n.ts:2660-2664`; `lib/i18n.test.ts:155-157`), and no key uses it today (`grep -c "fr: ''" lib/i18n.ts` gives 0).

The English has the same gap. Step 4 says every English string comes verbatim from the companion, and the companion does not hold:

- the singular provisional sentence, and the sentence for no provisional vowels (today `profile.provisional.sentenceSingular` and `.noneMessage`, `lib/i18n.ts:1499`, `:1503`). The ratified NOTES line is one instance with ten vowels and three provisional;
- MELODY's NOTES for rows 2 and 3 of the table. Row 3 has an existing sentence (`calib.pane.belowCore`, via `profile-status.ts:39`). Row 2 has none on MELODY;
- INSIGHTS' NOTES for rows 2 and 3. Row 2 has `insights.method.noScore.generic` (`lib/i18n.ts:1905`). Row 3 has no INSIGHTS sentence that says how many more;
- whether "Your profile is set, with ten vowels measured." replaces "Your profile is now set with {count} vowels measured." (`lib/i18n.ts:1502`). The words differ ("now" dropped, a comma added), step 4 does not list `profile.statusSet*`, and the French draft keeps « maintenant » (companion `:96`).

## 7. Verdict

**DO NOT SEND.** The blockers:

1. **Step 2's voice test is false for four of nine voice types** (section 4). A chosen contralto, countertenor, bass-baritone, or "Not sure" does not make INSIGHTS draw (`resolve-values.ts:148-154`, `InsightsPane.svelte:204-214`, `:328-341`). The companion's row 2 cannot be built as ruled for them. This needs Dann's ruling before r2, not a desk default.
2. **The table and the three forms do not match, and the state that owns the third form is not in the brief** (section 4). `InsightsPane.svelte:328-341` is uncited; MELODY cannot reach it (`MarkupPane.svelte:961`, `:729-733`).
3. **A wrong citation.** `SingerBlock.svelte:88-91` is given for both blocks; the notes block is at `:172-183`. Step 0 tells Code to stop on it.
4. **French.** Steps 4 and 5 and section 8 cannot be finished without the five DRAFT lines (section 6).
5. **English.** Step 4 forbids any English outside the companion, and the lane needs at least four sentences the companion does not hold (section 6).

What r2 needs, as precise edits, once Dann has ruled blocker 1 and the items under "For Dann's eye":

1. Section 2, INSIGHTS paragraph: change "They render at `SingerBlock.svelte:88-91`" to "The `silence` block renders at `SingerBlock.svelte:88-91` and the `notes` block at `:172-183`, with its link row at `:178-182`."
2. Section 2: add a paragraph citing `InsightsPane.svelte:327` (the call site), `:292-294` and `identity.ts:66-70` (the three no-score method lines, `i18n.ts:1904-1906`), and `:328-341` (score present, no measured voice), and say whether `:328-341` is in this lane.
3. Section 2, TEXT paragraph: add that `emptyNotice` has three values (`one-action.ts:150`), that `loading` shares the box (`TitlePage.svelte:130-131`), and state what the loading notice does in this lane.
4. Step 2: replace the first bullet with a predicate taken from the code, citing `resolve-values.ts:153-154` and `analyze-score-adapter.ts:91-93`, in whatever form Dann rules for the four types without generic values.
5. Step 2: replace "A score exists when the pane has its analysis" with "A score exists on MELODY when `scorePages` is non-empty (`MarkupPane.svelte:961`) and on INSIGHTS when `analysisScore` is set (`InsightsPane.svelte:327`)."
6. Step 2: replace "tests for all four states of the table" with a list of every state the function accepts and the form each returns, per page, including "score present, no measured voice" if it is in the lane.
7. Step 1: change "an optional notes block of a heading and one or more sentences" to say the notes body is a snippet, so MELODY can pass the assembly of `MarkupPane.svelte:1102-1106` with `vowelGlyph` (`:956-957`). This removes the conflict with risk 3.
8. Step 1: define the centring in measurable terms. Name the interval (the two drawn rules, or the content window), cite the three boxes (`Paper.svelte:85-87`, `MarkupPane.svelte:472-474` and `:494-496`, `InsightsPane.svelte:284` and `:610-617`), state that INSIGHTS' `.column` has no bottom and the component is drawn in the `article` there, and require a test at 816 by 1056 that the squircle's midpoint is the same on all three pages to a stated tolerance.
9. Step 1: correct the squircle description. The rule is `InsightsPane.svelte:622-630`: 12 px radius, 1 px border in `var(--rose)` (hard-coded, so the accent has to become a parameter), padding `16px 26px`, no background of its own. Say that INSIGHTS keeps the open-top and open-bottom forms (`:632-644`).
10. Step 1, the ratchet paragraph: add "`MarkupPane.svelte` is also at its ceiling, 1349 of 1349 (`ratchets.json:16`), and `+page.svelte` has two lines (5532 of 5534), so new props are appended to the existing lines at `:4302`, `:4367`, and `:4397`."
11. Step 3: name the VOICE key, `group.scoreMarkup` (`i18n.ts:163`). Add: matching is case-sensitive and walks the line by position, so that both names link in the order they stand; say which lines pass through it (the ask only, or the NOTES lines too); and require a test of each form in both languages that asserts which words are links.
12. Step 3: replace "confirm it is the same door `links.record` already opens" with the door Dann rules (see "For Dann's eye", item 3), citing `+page.svelte:1660-1668` and `:1683-1690`. Say whether the "What INSIGHTS shares, and how" and record links (`SingerBlock.svelte:178-182`) stay under NOTES on the blank page.
13. Section 5, first constraint: change "The links are text, not buttons with their own furniture" to "The links are `button type="button"` elements styled as text, as `SingerBlock.svelte:63` and `:585-591` do today; no pill, no border, no added padding."
14. Step 4: add a table, one row per page and state, naming the key, whether the English exists in the tree, is ratified in the companion, or is owed. State outright whether `profile.statusSetMeasuredPlural`, `...Singular`, and `statusSetPlain` (`i18n.ts:1500-1502`) change.
15. Step 4: say what the `fr` slot holds for each line not yet ratified, or hold the lane until the five are ruled. Remove the French pictures from step 5 and "in both languages" from section 8 if the lane goes first.
16. Step 4: say whether the blank state prints (`TitlePage.svelte:210-212` hides TEXT's today), and require the link's print rule (`SingerBlock.svelte:625-628`).
17. Add to section 6, as known breakage to repair in the lane: the unit and end-to-end tests listed in section 2 of this review, with the note that `profile-status.test.ts:51-53` requires the `statusLineFor` call to stay in `MarkupPane.svelte` as written.

## For Dann's eye

1. Four voice types (contralto, countertenor, bass-baritone, and "Not sure") have no generic values, so a singer who chose one and then adds a score reaches an INSIGHTS page that says no voice was measured; whether the blank page counts her as having a voice is yours.
2. MELODY draws a score with no voice at all, so by your rule the voice never stops MELODY drawing, yet the table has MELODY asking for both.
3. What tapping VOICE opens is yours: today's record door opens the recording screen when a voice is saved and the VOICE pane only when none is, while INPUT always opens its pane.
4. The ratified English "Your profile is set, with ten vowels measured." differs from the line now on the page, "Your profile is now set with ten vowels measured.", and the French draft keeps « maintenant ».
5. Under NOTES on the blank INSIGHTS page there are two links today ("What INSIGHTS shares, and how", and a record link), and TEXT's blank line does not print; whether the links stay, and whether the squircle prints, are yours.
