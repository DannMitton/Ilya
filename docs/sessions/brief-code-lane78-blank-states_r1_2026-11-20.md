# Brief, lane 78: the blank states of TEXT, MELODY, and INSIGHTS

r1, 2026-11-20, by the Opus desk. Branch `cloud-lane-78`, cut from `Shane` `47bd5c5c`.

**This replaces `brief-code-lane71-blank-states_r2_2026-11-19.md`, which returned DO NOT SEND on `review-fable-lane71-brief_r2-delta_2026-11-19.md` with three blockers. Do not read r2.** Both of r2's blockers that needed Dann were about QUEUE row 167, which has since shipped in lanes 71 and 74 (`c8ced58f`, `47bd5c5c`), so they are gone. What remains of that review is its thirteen edits, applied here and named where they land.

**The scope is the layout and the words only.** What these pages say when a profile is deliberately unworkable belongs to the VOICE lane's half and is not in this lane. Occasion for the split: Dann's report of 2026-11-20 15:41, three iPhone screenshots, transcribed as written: *"I'm botherd that the page layout between TEXT, MELODY, and INSIGHTS is dissimilar. / I askled yesterday to establish consistency. We designed vertically cenrted squircles. Where are they?"*

**One companion file is the authority for every word a singer reads.** Read it in full before anything else and take every string from it verbatim: `ratified-blank-state-blurbs_2026-11-19.md` (md5 `a8875d7e`). **Nothing in this lane is owed to Dann: every English and French string it needs is ratified there.** If you need a sentence that is not in it, stop and report; do not write one.

## 1. What this is for, from where the singer stands

A singer opens Ilya and meets one of three pages before anything is loaded. That first screen is the whole of Ilya's welcome, and today the three do not look like one application: INSIGHTS ranges a roman paragraph under the title rule with a NOTES heading below it, while MELODY and TEXT float italic text near the middle of the sheet with no squircle and no heading. Two of them point at the DRAWER by a direction, and they disagree about which direction it is.

After this lane each of the three carries one squircle, in the same place, saying what the page is for and what to do next, with every section a singer must visit as a link.

## 2. The ruling

Dann ruled the treatment 2026-11-19 08:45 to 09:17 and ratified the words at 09:17 and 09:25. The companion holds it verbatim; in summary, and the companion wins over this summary:

- **One squircle per blank page, centred vertically** in the space between the title rule and the footer rule (companion §1, his 08:49).
- **Ordinary formatting inside it, ranged left** (his 08:51), **roman, not italic** (desk default of 08:55, not overruled).
- **Every section a singer must visit is a link** (his 08:40). **No directional words anywhere.**
- **The rule that decides what each page asks for, as he reworded it 09:35:** the ask names what is missing for the page to do what its own first sentence promises; NOTES says how complete what is already there is. Two jobs, never mixed in one sentence. The earlier wording, "what stops the page drawing at all", was the desk's and is struck: MELODY draws a score with no voice, and marking is what MELODY is for, so a voiceless MELODY asks for the voice even though pixels would appear.

## 3. What is there today. Every line read by the desk on `47bd5c5c`, 2026-11-20

- **TEXT.** `components/Paper/TitlePage.svelte:127` opens `<div class="empty-directive">`. `:128-129` draws `paper.empty.mobile` or `paper.empty` by device (`isMobile`); `:130-131` draws `dict.loading` for `emptyNotice === 'loading'`; `'quiet'` draws nothing. Styles at `:175`, and `:210` is where it is kept off the print.
- **MELODY.** `markup/MarkupPane.svelte:1092` opens `<div class="profile-content">`, branching at `:1093` on `hasReadings` (`:450`, any sampled vowel at any count, lane 68). With no readings, `:1113` draws `profile.emptyState`. The block is centred by `justify-content: center` at `:1197`, styles from `:1190`. The article's label is `profile.emptyStateAria` (`:1056`).
- **INSIGHTS, no score.** `insights/singer-blocks.ts:382-385`, `noScoreBlocks`, returns a `silence` block holding `insights.silence.noScore` and a `notes` block from `notesBlock` (`:377`).
- **The renderers.** `insights/SingerBlock.svelte:88-90` draws a `silence` block; `:172` draws a `notes` block. `:63`'s `withInput` snippet makes the INPUT link by finding `group.input` inside the line, and `:90` reaches it only when the line is exactly `T('insights.silence.noScore')`.

## 4. The steps

### Step 1, one shape, three pages

Give the three blank states one squircle, drawn the same way on each, centred vertically between the title rule and the footer rule of that page's own window, with ordinary left-ranged roman inside it.

- **Do not touch `TITLE_HEADER_GAP` and do not make the three headers agree.** (Review edit 8.) MELODY's 18 px gap also sets the score's first-page window and the score's position, so moving it moves every MELODY score page and can change pagination. The blank state takes its own top.
- **If the three headers' heights differ, report the difference and do not force a common midpoint.** (Review edit 8, and the delta review's section 5 item 5: "centred in each page's window" and "the same midpoint" cannot both hold when the headers differ. Centring in each page's own window wins.)
- The squircle's fill, radius, and padding follow the existing page squircles rather than a new token; name the one you took them from in the report.

### Step 2, the words

Take all of them verbatim from the companion, English and French:

- TEXT's blurb, MELODY's blurb, INSIGHTS' blurb (companion §3 and §4).
- The three forms of the ask, on MELODY and INSIGHTS both: score missing, voice missing, both missing. **TEXT keeps one ask**, because TEXT needs words and nothing else.
- NOTES on MELODY and NOTES on INSIGHTS.
- **`i18n.ts:1500-1502` in the tree wins over the companion's `:66` where they differ** (review edit 9), and the companion is corrected in the same commit with a line saying why.

### Step 3, the voice test

Use `adapted.completeness.formants` as the test of whether a voice is ready, which both panes already hold (review edit 6). Give the state table in the lane's report, per page, with its rows as the companion's §2 table has them.

### Step 4, the links

- Every section named in a blurb or an ask is a link: INPUT, VOICE, POEM, LYRICS as they appear.
- **The VOICE link reveals the VOICE band; it does not open the recording screen.** (Review edit 7.) `routes/+page.svelte`'s `openVoice` enters the calibration takeover when a voice is saved, and a saved voice with no type and nothing sampled is exactly the state the ask addresses. Use the band reveal inside `leaveThen`, written inline in the props, and cite the lines you used.
- `SingerBlock.svelte:90` reaches its link by exact string equality on one key. If a blurb needs more than one link, replace that mechanism rather than adding a second equality test, and say in the report what you replaced it with.

### Step 5, what retires and what does not print

- `paper.empty` and `paper.empty.mobile` retire, and the device split with them.
- `profile.emptyState` retires (review edit 9).
- Say what `'loading'` does under the new shape; it is still owed from the r1 review (review edit 13).
- **No blank state prints, and that default reaches the no-score pages only** (review edit 10). `InsightsPane.svelte`'s withheld list is the page's content when a score is present and keeps printing.

### Step 6, the tests

- One test per page that the blank state draws one squircle and that its text is the companion's, in both languages.
- A test that no retired string is read anywhere.
- A test that no blank state prints, and that the withheld list still does.
- A test that the VOICE link reveals the band rather than entering the takeover.
- Move or retire every test that asserts today's italic, centred, directional text; do not delete a case to make a number pass.

## 5. What must not change

- No score page moves by a pixel. If one does, you have touched `TITLE_HEADER_GAP` and step 1 forbids it.
- No string in this lane is invented, in either language.
- `ONE VOWEL PER NOTE` (`CONTRACT.md` §0.1) is untouched here and nothing may weaken it.

## 6. Done when

1. All eight gates at baseline, gate 4 reported for both the with-scipy and the without-scipy figures, and said which was measured.
2. The three blank pages, rendered at 390 by 667 and at 1024 wide in both languages, each show one squircle in the same vertical place with left-ranged roman inside.
3. No directional word remains in any of the six strings.
4. Pictures of all six screens are in the report.

## 7. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Report under this heading whatever you could not settle from the tree, with the instrument you used for each. The desk expects at least the header-height difference of step 1 and the link mechanism of step 4 to be live.
