# Brief, lane 78: the blank states of TEXT, MELODY, and INSIGHTS

r2, 2026-11-20, by the Opus desk. Branch `cloud-lane-78`, cut from the `Shane` commit that carries this brief and the corrected companion.

**r2 applies every blocker and amendment of `review-fable-two-briefs_r1_2026-11-20.md`, which returned DO NOT SEND on r1 with three blockers. r1 is superseded; do not read it.** It also replaces `brief-code-lane71-blank-states_r2_2026-11-19.md`; do not read that either.

**One companion file is the authority for every word a singer reads:** `ratified-blank-state-blurbs_2026-11-19.md`. **Read its correction block of 2026-11-20 first**, which strikes the rule its section 2 still states, adds the one sentence that was missing, and lists the stale line numbers. **Cite keys into `i18n.ts`, never the companion's line numbers.** Where the companion and the tree differ on a live string's wording, the tree wins.

**The scope is the no-score blank pages only.** What a page shows when a score is present and the voice is not, and what it shows when a profile is deliberately unworkable, are both outside this lane.

## 1. What this is for, from where the singer stands

A singer opens Ilya and meets one of three pages before anything is loaded. That first screen is the whole of Ilya's welcome, and today the three do not look like one application: INSIGHTS ranges a roman paragraph under the title rule with a NOTES heading below it, while MELODY and TEXT float italic text near the middle of the sheet with no squircle and no heading. Two of them point at the DRAWER by a direction, and they disagree about which direction it is.

After this lane each of the three carries one squircle, in the same place on its own page, saying what the page is for and what to do next, with every section a singer must visit as a link.

Occasion: Dann's report of 2026-11-20 15:41, with three iPhone screenshots, transcribed as written: *"I'm botherd that the page layout between TEXT, MELODY, and INSIGHTS is dissimilar. / I askled yesterday to establish consistency. We designed vertically cenrted squircles. Where are they?"*

## 2. The ruling

Dann ruled the treatment 2026-11-19 08:45 to 09:17 and ratified the words at 09:17 and 09:25, with one sentence added 2026-11-20 17:17. The companion holds it verbatim and wins over this summary:

- **One squircle per blank page, centred vertically** in the space between the title rule and the footer rule (his 08:49).
- **Ordinary formatting inside it, ranged left** (his 08:51), **roman, not italic** (desk default of 08:55, not overruled).
- **Every section a singer must visit is a link** (his 08:40). **No directional words anywhere.**
- **The rule that decides what each page asks for, as he reworded it 09:35:** the ask names what is missing for the page to do what its own first sentence promises; NOTES says how complete what is already there is. Two jobs, never mixed in one sentence.

## 3. What is there today. Every line read by the desk on `47bd5c5c`, 2026-11-20

- **TEXT.** `components/Paper/TitlePage.svelte:127` opens `<div class="empty-directive">`. `:128` tests `emptyNotice === 'enter'` and `:129` draws `paper.empty.mobile` or `paper.empty` by device. `:130-131` draws `dict.loading` for `'loading'`; `'quiet'` draws nothing (`one-action.ts:150`). Styles at `:175`; `:210-212` keeps it off the print.
- **MELODY.** `markup/MarkupPane.svelte:1092` opens `<div class="profile-content">`, branching at `:1093` on `hasReadings` (`:450`, any sampled vowel at any count). With no readings, `:1113` draws `profile.emptyState`. Centred by `justify-content: center` at `:1197`, styles from `:1190`. The article's label is `profile.emptyStateAria` (`:1056`).
- **INSIGHTS, no score.** `insights/singer-blocks.ts:382-385`, `noScoreBlocks`, returns a `silence` block holding `insights.silence.noScore` and a `notes` block from `notesBlock` (`:377`).
- **The renderers.** `insights/SingerBlock.svelte:88-90` draws a `silence` block; `:172` draws a `notes` block; `:63`'s `withInput` snippet makes the INPUT link, reached at `:90` only when the line equals `T('insights.silence.noScore')` exactly.
- **The squircle to copy.** `insights/InsightsPane.svelte:622-630`: 12 px radius, 1 px `var(--rose)`, padding `16px 26px`, flex column, 12 px gap. Its comment at `:620-621` calls it the watch band's outline. **The border colour is hard-coded, so it becomes a parameter per page.**
- **The ratchets.** `scripts/ratchets.json:8` `+page.svelte` 5534, `:16` `MarkupPane.svelte` 1349, `:18` `InsightsPane.svelte` 677. The two panes sit at their ceilings and `+page.svelte` has two lines of room.

## 4. The steps

### Step 1, one component, three pages

**Build one component, `components/Paper/BlankState.svelte`, and render it from all three pages**, so they cannot drift apart again. Take the squircle from `InsightsPane.svelte:622-630` and make its accent a prop. Inside it: ordinary left-ranged roman.

- Centre it vertically in **each page's own window**, between that page's title rule and footer rule.
- **Do not touch `TITLE_HEADER_GAP`** (`MarkupPane.svelte:472`), which also sets the score's first-page window (`:795`) and the score's position (`:1004`): moving it moves every MELODY score page and can change pagination. The blank state takes its own top.
- **If the three headers differ in height, report the difference and do not force a common midpoint.** Centring in each page's own window wins.
- Both panes are at their ratchet ceilings and `+page.svelte` has two lines, so append props to existing lines and add no new handler function there. **Report every touched file's ratchet before and after.**

### Step 2, the words, and what each page asks for

Take every string verbatim from the companion, English and French: the three blurbs, the asks, and the NOTES bodies.

**The ask, on MELODY and INSIGHTS: score missing, and both missing.** The third form, voice missing with a score loaded, **is not built in this lane**: that page is not blank on either pane (`markup/MarkupPane.svelte:831`, `:1015`; `insights/InsightsPane.svelte:328-341`), and what it shows is still Dann's to rule. Its ratified strings enter `i18n.ts` with the others so the three forms sit together, and nothing reads the third yet. **TEXT keeps one ask**, because TEXT needs words and nothing else.

**The state table. This is the lane's contract; build to it.**

| Page, no score | Voice state, and its test | Ask | NOTES |
|---|---|---|---|
| MELODY | none: `!adapted.completeness.formants` (`MarkupPane.svelte:831`) | both missing | none |
| MELODY | a type chosen, nothing sung: `adapted.generic` | score missing | none; the title line already says whose values (`profile.subtitlePlaceholder`) |
| MELODY | sung, not yet complete: `!isPersonal(formants)` | score missing | `calib.pane.belowCore` through `statusLineFor` (`markup/profile-status.ts:39`) |
| MELODY | complete | score missing | the status line (`profile.statusSetPlain`, `profile.statusSetMeasuredSingular`, `profile.statusSetMeasuredPlural`), then the provisional sentence if any vowel is provisional, singular or plural as the count requires |
| INSIGHTS | none | both missing | none; `insights.method.noScore.none` no longer draws |
| INSIGHTS | a type chosen, nothing sung | score missing | `insights.method.noScore.generic` |
| INSIGHTS | sung | score missing | `insights.method.noScore.samples` |
| TEXT | none | its one ask | none |

The voice test both panes already hold is `adapted.completeness.formants` (`MarkupPane.svelte:550`, `:831`; `InsightsPane.svelte:204`). Use it; add no fourth test.

**NOTES sits under the squircle, unboxed, with the heading as INSIGHTS draws it today** (`insights.r2.notes`). DESK DEFAULT from the companion's own wording, Dann's to overrule.

### Step 3, the links

- **INPUT and VOICE are links. POEM and LYRICS are not** (DESK DEFAULT): they are views inside INPUT, not sections, and no handler exists for either.
- **The VOICE link reveals the band; it does not open the recording screen.** `routes/+page.svelte:1660-1668` is `openVoice`, which reveals the band only when the singer has no voice at all (`:1662-1664`) and otherwise enters the calibration takeover (`:1666-1667`). A saved voice with no type and nothing sampled is exactly the state the ask addresses. Use the band reveal as `leaveThen` does at `:1694`, written inline in the props.
- Matching is case-sensitive and walks the line by position, so a French line holding both « voix » and « VOIX » matches the first occurrence. The keys are `group.scoreMarkup` and `group.input`.
- **The two links under NOTES stay as built** (`insights/SingerBlock.svelte:178-182`).
- `SingerBlock.svelte:90` reaches its link by exact string equality on one key. If a blurb needs more than one link, replace that mechanism rather than adding a second equality test, and say in the report what you replaced it with.

### Step 4, what retires

`paper.empty`, `paper.empty.mobile` and the device split with them; `profile.emptyState`; `profile.lede`; `profile.provisional.noneMessage`; `insights.method.noScore.none`. The directional tails of `profile.provisional.sentenceSingular` and `sentencePlural` go with the companion's replacements.

**`'loading'` draws `dict.loading` alone in the squircle, roman, with no ask; `'quiet'` draws nothing, as today** (`one-action.ts:150`, `:166-173`). DESK DEFAULT; it has been owed since the r1 review of 2026-11-19.

**No blank state prints, and that default reaches the no-score pages only.** DESK DEFAULT, Dann's to overrule. `InsightsPane.svelte:328-341`'s withheld list is the page's content when a score is present and keeps printing.

### Step 5, the comments that cite superseded rulings

Rewrite these to the 2026-11-19 ruling rather than leaving them to contradict the code: `markup/MarkupPane.svelte:1184-1189`, `:1211-1213`, `:1236-1251`; `components/Paper/one-action.ts:153-163`; `e2e/core-loop.test.ts:45-46`.

### Step 6, the tests

- One test per page that the blank state draws one squircle, and that its text is the companion's, in both languages.
- A test that no retired string is read anywhere.
- A test that no blank state prints, and that the withheld list still does.
- A test that the VOICE link reveals the band rather than entering the takeover.
- Move or retire every test asserting today's italic, centred, directional text. Name each one you touched; do not delete a case to make a number pass.
- **Any fixture needing a complete profile uses all six core vowels, each with a second resonance**, so it survives lane 76.
- **Two files are also changed by lane 76**, which runs after this lane: `markup/profile-status.test.ts` and `e2e/melody-no-score-count.test.ts`. Keep your changes to them minimal and name them in the report.

## 5. What must not change

- No score page moves by a pixel. If one does, you have touched `TITLE_HEADER_GAP`, and step 1 forbids it.
- No string is invented, in either language. Every string is in the companion or already in the tree.
- `ONE VOWEL PER NOTE` (`CONTRACT.md` §0.1) is untouched here and nothing may weaken it.
- No agent writes with git beyond its own branch; nothing reaches `Shane` or `main`.

## 6. Done when

1. All eight gates at baseline, gate 4 reported for both the with-scipy and the without-scipy figures, and said which was measured.
2. The three blank pages, rendered at 390 by 667 and at 1024 wide in both languages, each show one squircle centred in its own page's window, with any difference between the three midpoints reported.
3. No directional word remains in any string the three blank pages draw.
4. Pictures of all six screens are in the report.
5. Every touched file's ratchet is reported before and after.

## 7. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Report under this heading whatever you could not settle from the tree, with the instrument you used for each. The desk expects at least these to be live: whether the three headers differ in height; whether MELODY's and INSIGHTS' blank content prints today, which was not read in full; and the full list of tests this lane breaks.
