# Brief, lane 71: the blank states, and the voice types Ilya borrows for

r2, 2026-11-19, written by the desk (Opus 5) against `Shane` `f7e03836`.
r2 applies all seventeen amendments of `review-fable-lane71-brief_r1_2026-11-19.md`, which
returned DO NOT SEND on r1 with five blockers, and folds in QUEUE row 167, which Dann ruled
at 09:38 to 09:52 after that review exposed the hole. **r1 is superseded; do not read it.**

Two companion files are the authority for every word a singer reads. Read both in full
before anything else, and take every string from them verbatim:

- `ratified-blank-state-blurbs_2026-11-19.md` (md5 `a8875d7ecc96e1a39ba9055b158f2085`)
- `ratified-voice-type-stand-ins_2026-11-19.md` (md5 `770ddf03d110828a535cd1e6ace63b72`)

**Nothing in this lane is owed to Dann. Every English and French string it needs is ratified
in one of those two files.** If you find yourself needing a sentence that is in neither,
stop and report; do not write it.

## 0. What these three screens are for

A singer opens Ilya, meets one of the three pages before anything is loaded, and has to work
out what the page is and what to do next. That first screen is the whole of Ilya's welcome.

Today the three answer differently. TEXT centres one italic instruction. MELODY draws three
italic lines centred in its window. INSIGHTS ranges a roman paragraph under the title rule
and is the only one with a section heading and with links. Two of them point at the control
surface by a direction and disagree: TEXT says "at the bottom of the screen"
(`i18n.ts:1032`) and "on the left" (`:1014`), MELODY says "on the left" (`:1499`, `:1503`,
`:1504`). Dann met this on his iPhone on 2026-11-19 and ruled it.

## 1. The two rulings

### The blank states

The first companion governs. In summary: one squircle per blank page, centred vertically;
ordinary formatting inside it, ranged left, roman; every section a singer must visit is a
link; no directional words.

**The rule that decides what each page asks for, as Dann reworded it at 09:35 after the
review:** *the ask names what is missing for the page to do what its own first sentence
promises. NOTES says how complete what is already there is.* Two jobs, never mixed in one
sentence.

The earlier wording, "what stops the page drawing at all", was the desk's and is struck.
MELODY draws a score with no voice at all (`MarkupPane.svelte:961`, `:729-733`), and Dann
09:35: *"that is no MELODY's target function"*. Marking is what MELODY is for, so a
voiceless MELODY asks for the voice even though pixels would appear.

### Row 167, which this lane also closes

The second companion governs. `standInBucket` (`stand-ins.ts:58-66`) already maps all nine
voice types to a staff. What was missing is permission: `PLACEHOLDER_PROFILE_TYPES` (`:76`)
lists five, and its comment holds the other four back "until row 167 rules their staves".
Dann ruled them in. **All nine types join that list**, and each borrowing is named to the
singer on the page.

That is what makes step 2 computable: with all nine holding a starting profile, the voice
test is the plain thing Dann said at 09:13, anything sampled or any type chosen, with no
special case.

## 2. What is there today

Read 2026-11-19 from `Shane` `f7e03836`. Every line below was read by the desk or confirmed
by Fable's review of r1.

### TEXT

`components/Paper/TitlePage.svelte:127-133`, a `<div class="empty-directive">`.
`emptyNotice` has three values (`one-action.ts:150`, `:166-169`): `'enter'` draws the
directive, chosen by device at `:129`
(`isMobile ? t('paper.empty.mobile') : t('paper.empty')`, `i18n.ts:1032`, `:1014`);
`'loading'` draws `dict.loading` (`i18n.ts:119`) in the same box at `:130-131`; `'quiet'`
draws nothing. `emptyNotice` arrives from `Paper.svelte:35` and is set at
`+page.svelte:4302`. The box is centred by `flex: 1` and `align-items: center`
(`TitlePage.svelte:175-188`), capped at 480 px, italic, tertiary ink. **It does not print**
(`TitlePage.svelte:210-212`).

### MELODY

`markup/MarkupPane.svelte:1092-1115`, `<div class="profile-content">`, branching on
`hasReadings` (`:450`). With readings: `profile.lede` (`i18n.ts:1498`, whose only reader is
`MarkupPane.svelte:1096`), the status line from `statusLineFor`
(`markup/profile-status.ts:34-46`), and the provisional sentence assembled at `:1102-1108`
from `provisionalPartsFor`, `listSep`, and the `vowelGlyph` snippet (`:956-957`). With none:
`profile.emptyState` (`i18n.ts:1514`). The article carries `profile.emptyStateAria`
(`:1056`, `i18n.ts:1532`). Centred by `justify-content: center` (`:1197`). Styles at
`:1190-1262`.

`statusLineFor` returns `calib.pane.belowCore` (`i18n.ts:1443`) for any voice below five
stable core vowels (`profile-status.ts:39`), and otherwise the count line
(`profile.statusSetPlain`, `...Singular`, `...MeasuredPlural`, `i18n.ts:1500-1502`).

### INSIGHTS

Two blank pages, not one.

**No score:** `insights/singer-blocks.ts:382-387`, `noScoreBlocks`, called at
`InsightsPane.svelte:327`. It returns a `silence` block holding `insights.silence.noScore`
(`i18n.ts:1902`) and a `notes` block from `notesBlock` (`:377-379`), heading
`insights.r2.notes` (`i18n.ts:2081`, "Notes" in both languages). The method line is resolved
at `InsightsPane.svelte:292-294` by `methodLineKey` (`insights/identity.ts:66-70`), which
already has three no-score forms by voice state: `insights.method.noScore.samples`,
`.generic`, `.none` (`i18n.ts:1904-1906`).

**Score present, no measured voice:** `InsightsPane.svelte:328-341`, a `silence` block in a
`totals` squircle, heading `profile.withheld.heading`, line `insights.silence.unmeasured`,
two withheld items, then a notes block with `insights.method.silent` (`i18n.ts:1533`,
`:1537`, `:1892`, `:1899`, `:1900`; chosen at `:293`).

**The renderers:** the `silence` block at `insights/SingerBlock.svelte:88-91`; the `notes`
block at `:172-183`, with its link row at `:178-182` carrying
`calib.pane.door.insights` (`i18n.ts:1453`) and, when the method line is generic, the record
door (`links.recordKey`, `i18n.ts:1448-1450`).

### The INPUT link, and why it constrains this lane

`SingerBlock.svelte:90` makes the link by exact string equality,
`line === T('insights.silence.noScore')`, then `withInput` (`:63`) finds the word
`t('group.input')` in the line and wraps it in a `button type="button"` styled as text
(`:585-591`), which prints as plain text (`:625-628`). That mechanism links one word, in one
string, matched by identity, case-sensitively, taking the first occurrence. The ruled design
needs two section links across three forms of the ask on two pages, in two languages. Both
the identity test and the single-word snippet have to go.

## 3. The work

One commit per step, one report per step, at
`docs/sessions/report-code-lane71-step<n>_r1_2026-11-19.md`.

### Step 0. Hold or break the premise

Read every citation in section 2 against the tree. Report each as holds, wrong, or shifted.
If any does not hold, stop and report before changing anything. Then report every call site
that renders a blank or empty state on the three pages, and every i18n key those sites read,
and say what this brief missed.

### Step 1. Row 167: the nine types, and what each borrows

1. Add `contralto`, `countertenor`, `bass-baritone`, and the "Not sure" id to
   `PLACEHOLDER_PROFILE_TYPES` (`voice/engine/stand-ins.ts:76`), so a declared type alone
   gives a working profile for every type. Take the ids from `voice/voiceTypes.ts:19-29`;
   do not invent an id for "Not sure", use the one that exists.
2. Do not change `standInBucket` (`:58-66`). It already maps contralto and countertenor to
   `tenor-mezzo`, bass-baritone to `bass`, and "Not sure" and none to `middle`. **Dann's
   ruling of 09:38 named soprano for countertenor and the desk's amendment, which he took,
   keeps him on the mezzo and tenor staff, because resonance follows the tract's length and
   not the range sung.** The second companion records both.
3. Update the comment at `:70-74`, which says the four are "left out on purpose ... until row
   167 rules their staves". Row 167 is ruled. Say what it now does and cite the companion.
4. Two new strings, verbatim from the second companion, section 3: the templated line with
   its `{type}` and `{borrowed}` tokens, and the "Not sure" line. Both languages are
   ratified there. `{borrowed}` is "mezzo-soprano", "bass", or "mezzo and tenor"; those three
   need their own keys, since they are singer-facing words in two languages.
5. The link label "Why these values" / « Pourquoi ces valeurs », and the Guide passage behind
   it, both verbatim from the second companion, sections 3 and 4. Seat the passage in the
   Guide as the project seats ratified Guide text, and pin it.
6. These lines are method lines. They replace `insights.method.noScore.generic`
   (`i18n.ts:1905`) for a borrowing type, and MELODY needs the same words where it says how
   its values were arrived at. Report where each lands on each page.

### Step 2. The ask, resolved from what is missing

One pure function, beside the strings, not inside a pane, with tests. Both panes call it.

**A voice exists** when any vowel is sampled (`isSung`, as `MarkupPane.svelte:450` uses it)
or a voice type is chosen that has a placeholder profile (`hasPlaceholderProfile`,
`stand-ins.ts:78-81`). After step 1 that second test is true for all nine types, so in
practice: anything sampled, or any type chosen.

**A score exists** on MELODY when `scorePages` is non-empty (`MarkupPane.svelte:961`) and on
INSIGHTS when `analysisScore` is set (`InsightsPane.svelte:327`). Both derive from the parsed
score (`MarkupPane.svelte:574`, `:590`; `InsightsPane.svelte:172-173`).

The function takes those two booleans and returns one of three forms, verbatim from the first
companion, section 3. The voice comes before the score. TEXT takes one ask and no state.

Report a table of every state the function accepts and the form it returns, per page,
including **score present and no voice**, which is the state that owns the third form and
whose INSIGHTS call site is `InsightsPane.svelte:328-341`. Say in the report whether that
page keeps its withheld list alongside the new ask, or whether the ask replaces it; the desk
reads your answer before the merge.

### Step 3. One blank-state block for all three pages

Build one component every blank page renders, so the three cannot drift again. The desk's
name is `BlankState.svelte` under `components/Paper/`; rename if the folder's conventions
ask, and say so.

It takes: the page's accent colour, the lede sentence, the resolved ask, and an optional
notes block of a heading and **a snippet**, not a string. The snippet is required because
MELODY's provisional sentence is fragments around a glyph (`MarkupPane.svelte:1102-1108`,
`:956-957`), and French needs a noun English omits (`profile-status.ts:48-52`).

**The squircle.** The rule is `InsightsPane.svelte:622-630`: 12 px radius, 1 px border, no
background of its own, padding `16px 26px`. Its border is hard-coded `var(--rose)` (`:624`),
so the accent becomes a parameter. INSIGHTS keeps the rule for its ordinary pages (`:536`)
with the open-top and open-bottom forms (`:632-644`); do not delete those.

**The centring, in measurable terms.** The interval is the page's content window, the same
one each page already computes: TEXT `Paper.svelte:85-87`, MELODY `MarkupPane.svelte:472-474`
and `:494-496`, INSIGHTS `InsightsPane.svelte:284` (top) with no bottom on `.column`
(`:610-617`), so INSIGHTS computes its bottom as the other two do rather than inheriting
`.column`. MELODY's gap under the header is 18 where the others use 16; make the three agree
and report which you changed. On INSIGHTS the component is drawn in the `article`, not as a
block inside `.column`, because blocks are measured off screen and paginated from the top
(`:407-423`, `:459-468`) and cannot be centred; `paginate` returns one page for an empty list
(`insights/paginate.ts:76`, `:164`), so the article still draws.

**Require a test** at 816 by 1056 that the squircle's vertical midpoint is the same on all
three pages to a tolerance you state and justify.

**Ratchets.** `InsightsPane.svelte` is 677 of 677 and `MarkupPane.svelte` is 1349 of 1349
(`scripts/ratchets.json:18`, `:16`); both are at their ceilings. `+page.svelte` has two lines
(5532 of 5534), so new props are appended to the existing lines at `:4302`, `:4367`, and
`:4397` and no new handler function fits there. MELODY will fall, since it loses `:1093-1114`
and `:1201-1262`. Report every touched file's ratchet before and after.

### Step 4. Two section links, generalized

Replace the identity test (`SingerBlock.svelte:90`) and `withInput` (`:63`) with one
mechanism taking a line and a map of section name to handler.

- Matching is **case-sensitive**, so « dans VOIX » links VOIX and not « voix ».
- It **walks the line by position**, so both names link when both are present. Both languages
  put VOICE before INPUT.
- The keys are `group.input` (`i18n.ts:168`, INPUT and ENTRÉE) and `group.scoreMarkup`
  (`:163`, VOICE and VOIX).
- **Only the ask passes through it.** The NOTES lines name VOICE too ("measured in VOICE",
  `i18n.ts:1904`), and the first companion's rule is that a singer who has a voice is never
  sent back to it. Linking those would contradict the rule the words were written to serve.
- The link stays a `button type="button"` styled as text, as `SingerBlock.svelte:63` and
  `:585-591` do today, with the print rule of `:625-628`. No pill, no border, no added
  padding.
- DESK DEFAULT: **VOICE opens the VOICE pane** (`+page.svelte:1660-1668`), not the recording
  screen, because the ask covers both ways in and sampling is one of them. INPUT opens its
  pane (`:1683-1690`). Report what each link opened on each page.

Require a test of every form in both languages asserting which words are links.

### Step 5. The strings

Build a table, one row per page and state, naming the key, and whether its English and French
are already in the tree, ratified in a companion, or neither. **If a row is "neither", stop
and report.** The desk's reading of the gaps:

- `profile.statusSetPlain`, `...Singular`, `...MeasuredPlural` (`i18n.ts:1500-1502`) **do not
  change**. The first companion quotes the live plural sentence; the desk's earlier
  rewording of it was a transcription error and is withdrawn.
- The singular and the none-provisional sentences (`i18n.ts:1503`, `:1499`) keep their words
  and lose their directional tails.
- `calib.pane.belowCore` (`:1443`) keeps its words; it is the NOTES body for a voice below
  five stable core vowels.
- `insights.method.noScore.samples`, `.generic`, `.none` (`:1904-1906`) stay as the INSIGHTS
  NOTES bodies, with `.generic` replaced by step 1's new lines for a borrowing type.

Retire `paper.empty` and `paper.empty.mobile` (`:1014`, `:1032`) and the device branch at
`TitlePage.svelte:129` with them. Say what `'loading'` does now that the box has changed
(`TitlePage.svelte:130-131`). Reword `insights.silence.noScore` (`:1902`). After the device
branch goes, `isMobile` is unused in `TitlePage.svelte`; `Paper.svelte:179` still passes it,
so report whether it still has a reader.

Pin every ratified sentence in the tests that pin ratified lines. Repair the stale comments
that quote retired strings: `one-action.ts:15`, `:155`; `MarkupPane.svelte:1211`, `:1239`.

**Say whether the blank state prints.** TEXT's does not today (`TitlePage.svelte:210-212`).
DESK DEFAULT: it does not print, on any of the three; a blank page's furniture has nothing to
say on paper.

### Step 6. The tests this lane breaks

These are known and are the lane's to repair, not to work around:

Unit: `insights/ratified-lines.test.ts:418-419`; `insights/links.test.ts:41-42`, `:71-78`;
`markup/profile-status.test.ts:14-22`, `:47`, `:58`, and `:51-53`, which reads
`MarkupPane.svelte` as text and requires the `statusLineFor(...)` call to stay there
character for character.

`apps/web/e2e`: `core-loop.test.ts:47`, `:239`; `singer-paths.test.ts:98-102`, `:195-197`;
`melody-no-score-count.test.ts:24`, `:27`, `:39`; `insights-no-score.test.ts:31-32`, `:34-35`,
`:37-62`; `insights-links.test.ts:121`, `:131`, `:87`, `:170-177`, `:69-70`;
`tempo.test.ts:183-197`, which drives INSIGHTS at 390 by 844.

`apps/web/e2e-phone`: `insights-links.test.ts:60`, `:74-75`, `:84-90`.

No test uses `toHaveScreenshot` or `toMatchSnapshot`.

### Step 7. The pictures

At 390 by 844, English and French, one picture of each of the three blank pages in each state
it can reach, including a contralto and a "Not sure" voice so the new lines are seen. Save
under `docs/sessions/lane71-shots/` and name each in the report.

### Step 8. The gates

All eight against their baselines. Gate 4 has two forms; report which you got and why.
Do not move a baseline yourself.

## 4. What this brief changes about a computed number

Two things.

Which form of the ask a page shows, computed in exactly one place, the pure function of step
2, called by both panes. Nothing else in the tree decides what a blank page asks for.

Whether a declared type alone gives a working profile, which is `hasPlaceholderProfile`
(`stand-ins.ts:78-81`) and is read by `resolve-values.ts:153-154`. Widening its list changes
what `generic` is true for, which changes whether INSIGHTS draws findings
(`InsightsPane.svelte:204-214`, `analysis/analyze-score-adapter.ts:91-93`) for the four types
added. That is the intended effect of row 167 and the reason this lane carries it. Report
what moved on those four types, and confirm nothing moved on the other five.

## 5. Constraints

- No control on the page. The links are text-styled buttons, as today.
- No directional word in any new string, in either language.
- Do not write any string that is not in one of the two companions or already in the tree.
- Do not change `standInBucket`'s mapping, and do not invent a staff for any type.
- Do not touch `PageFit.svelte` or change what lane 70 built.
- Do not change any control's size, padding, or hit area, and add no coarse-pointer rule.
- Push to `cloud-lane-71`, cut from the tip of `Shane` once this brief is committed. Never
  push to `Shane` or `main`.
- Do not edit anything under `docs/memory/`.

## 6. Risks already found

1. The INPUT link's identity test fails quietly: a line that does not match renders with no
   link and no error. Test every form in both languages.
2. MELODY's provisional sentence is an assembly, not a string. The notes slot has to be a
   snippet or the assembly breaks.
3. `insights.r2.notes` is "Notes" in both languages, drawn in small caps by CSS. Do not add a
   second heading key.
4. TEXT has no voice state and no NOTES block. Do not give it one for symmetry.
5. `withInput` slices the line before `richParts` splits it (`:63`,
   `insights/text-parts.ts:52-69`), so a section name inside an italic span would be cut
   wrongly. No ratified sentence has one; the new mechanism should not make it possible.
6. `TitleHeader.svelte:130-141` compares scaled rectangles with unscaled widths under lane
   70's fit. Not this lane's; report if you meet it.

## 7. What you could not establish

End each report with a section headed "NOT ESTABLISHED".

**NOT ESTABLISHED beats a complete invented answer.**

## 8. Done when

- All three blank pages draw one centred squircle with the same geometry, type, and heading
  treatment, in both languages, proved by the test of step 3.
- The ask names only what is missing, by the first companion's rule, and every section named
  in it is a link in both languages.
- All nine voice types hold a starting profile, each borrowing named on the page in the
  ratified words, with the Guide passage seated and pinned.
- `paper.empty`, `paper.empty.mobile`, and their device branch are gone, and no new string
  carries a direction.
- The eight gates stand at their baselines, every touched ratchet reported.
- The pictures of step 7 exist.
