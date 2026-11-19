# Brief, lane 71: the blank states of TEXT, MELODY, and INSIGHTS

r1, 2026-11-19, written by the desk (Opus 5) against `Shane` `f7e03836`.
Companion, and the authority for every word a singer reads in this lane:
`docs/sessions/ratified-blank-state-blurbs_2026-11-19.md` (md5 `9dc58197`).
**The five French lines marked DRAFT in that file are not ruled yet. They arrive in r2.
Do not invent them, and do not ship an unruled French string.**

## 0. What these three screens are for

A singer opens Ilya, meets one of the three pages before anything is loaded, and has to work
out what the page is and what to do next. That first screen is the whole of Ilya's welcome.

Today the three pages answer that differently. TEXT centres one italic instruction. MELODY
floats three italic lines about forty percent down. INSIGHTS ranges a roman paragraph flush
under the title rule and is the only one with a section heading and with links. Two of them
point at the control surface by a direction, and they disagree: TEXT says "at the bottom of
the screen", MELODY says "on the left". Dann met all of this on his iPhone on 2026-11-19
and ruled it.

## 1. What Dann ruled

Read `ratified-blank-state-blurbs_2026-11-19.md` in full before anything else. In summary,
and it is the companion that governs:

1. One squircle per blank page, centred vertically between the title rule and the footer
   rule. Ordinary formatting inside it, ranged left, roman.
2. Every section a singer must visit is a link. No directional words anywhere.
3. **The ask names only what stops the page drawing at all. NOTES says how complete what is
   already there is.** Two jobs, never mixed in one sentence.
4. The English of all three pages, and the three forms of the ask, are ratified verbatim in
   that file.

## 2. What is there today

Read 2026-11-19 from `Shane` `f7e03836`. Three pages, three different mechanisms.

**TEXT.** `apps/web/src/lib/components/Paper/TitlePage.svelte:127-133`, a
`<div class="empty-directive">` holding one paragraph, the key chosen by device:
`:129` is `{isMobile ? t('paper.empty.mobile', language) : t('paper.empty', language)}`.
The two strings are `i18n.ts:1014` ("Enter your Cyrillic text in the DRAWER on the left.")
and `:1032` ("Tap DRAWER at the bottom of the screen to open the DRAWER.", which names the
thing twice). `emptyNotice` arrives from `Paper.svelte:35` and is set at
`+page.svelte:4302`.

**MELODY.** `apps/web/src/lib/markup/MarkupPane.svelte:1092-1114`, a
`<div class="profile-content">` that branches on `hasReadings` (`:450`,
`Object.values(formants).some(isSung)`). With readings it draws three paragraphs:
`profile.lede` (`i18n.ts:1498`), the status line from `statusLineFor`
(`markup/profile-status.ts:34-46`), and the provisional sentence built at `:1102-1107` from
`provisionalPartsFor` and `listSep`. With none it draws one line, `profile.emptyState`
(`i18n.ts:1514`).

**INSIGHTS.** `apps/web/src/lib/insights/singer-blocks.ts:382-387`, `noScoreBlocks`, which
returns a `silence` block holding `insights.silence.noScore` (`i18n.ts:1902`) and a `notes`
block from `notesBlock` (`:377-379`), whose heading is `insights.r2.notes` (`i18n.ts:2081`,
"Notes" in both languages). They render at
`apps/web/src/lib/insights/SingerBlock.svelte:88-91`.

**The INPUT link, and why it constrains this lane.** `SingerBlock.svelte:90` makes the link
by exact string equality: `line === T('insights.silence.noScore')`, and then `withInput`
(`:63`) finds the word `t('group.input')` inside the line and wraps it in a button. That
mechanism links one word, in one string, matched by identity. The ruled design needs **two**
section links (INPUT and VOICE) across **three** forms of the ask on **two** pages, so the
identity test and the single-word snippet both have to go.

## 3. The work

One commit per step, one report per step, at
`docs/sessions/report-code-lane71-step<n>_r1_2026-11-19.md`.

### Step 0. Hold or break the premise

Read every citation in section 2 against the tree. Report each as holds, wrong, or shifted.
If any does not hold, stop and report before changing anything.

Then report, from the code: every call site that renders a blank state on the three pages,
and every i18n key those sites read. The desk's list is above; say what it missed.

### Step 1. One block for all three pages

Build one component that every blank page renders, so the three cannot drift again. The
desk's name for it is `BlankState.svelte`, under `apps/web/src/lib/components/Paper/`;
change the name if a better one fits the folder's conventions, and say so.

It takes: the page's accent, the lede sentence, the ask (already resolved to one of its
three forms by the caller, see step 2), and an optional notes block of a heading and one or
more sentences. It draws a squircle, centred vertically in the space between the title rule
and the footer rule, with its content ranged left and roman inside.

The squircle is the one Ilya already draws. Read `InsightsPane.svelte`'s `.squircle` rule
(the 12 px radius, the 1 px accent border, the cream inside) and take its geometry rather
than inventing a second squircle. If that rule cannot be shared without moving it, move it
to one place and say where.

**`InsightsPane.svelte` is at its ratchet ceiling, 677 of 677** (`scripts/ratchets.json:18`,
lowered by lane 70). Anything it gains has to be matched by something it loses, or the work
lands in the new component. Report the ratchet for every file you touch.

### Step 2. The ask, resolved from what is missing

Each of MELODY and INSIGHTS resolves the ask from the state it already holds, by the table
in the companion file, section 2:

- A voice exists when any vowel is sampled (`isSung`, as `MarkupPane.svelte:450` uses it)
  **or** a voice type is chosen (`voiceTypeChoice`, passed to both panes from
  `+page.svelte`). Either one is enough: the page draws.
- A score exists when the pane has its analysis.

Three forms follow, and only the missing things are asked for. The voice comes before the
score. TEXT takes one ask and no state.

Put the resolution in one pure function, with tests for all four states of the table, so
both panes answer the same way. It belongs beside the strings, not inside a pane.

### Step 3. Two section links, generalized

Replace the identity test at `SingerBlock.svelte:90` and the single-word `withInput` snippet
(`:63`) with one mechanism that takes a line and a map of section name to handler, and links
every name it finds. It must work for INPUT and VOICE today, in both languages, where the
names are `group.input` (`i18n.ts:168`, ENTRÉE) and the VOICE band's own name.

DESK DEFAULT: one map, one snippet, used by all three pages, because the directional census
that follows this lane turns more sentences into section pointers and each one will need the
same treatment. Do not hard-code a second snippet for VOICE.

Report what the VOICE link opens on each page, and confirm it is the same door `links.record`
already opens (`SingerBlock.svelte:181`).

### Step 4. The strings

Every English string comes verbatim from the companion file, section 3. Every French string
comes verbatim from its section 4, and **only from the part headed RATIFIED**. The five
lines headed DRAFT are not yours to write; they arrive in brief r2.

Retire `paper.empty` and `paper.empty.mobile` (`i18n.ts:1014`, `:1032`) and the device
branch at `TitlePage.svelte:129` with them. Reword `insights.silence.noScore` (`:1902`).
Take the directional tails off `profile.provisional.noneMessage` (`:1499`),
`sentenceSingular` (`:1503`), and `sentencePlural` (`:1504`) as the new NOTES wording
requires.

Pin every ratified sentence in the tests that already pin ratified lines, as the project
does for Guide text.

### Step 5. The pictures

At 390 by 844, English and French, one picture of each of the three blank pages, in each of
the states the table names that the page can reach. Save them under
`docs/sessions/lane71-shots/` and name each in the report. The desk looks at every one.

### Step 6. The gates

All eight, each against its baseline. Gate 4 has two forms; take them from
`~/Downloads/ilya-ship.sh:180` if you can read it, and otherwise report which form you got
and why. Do not move a baseline yourself.

## 4. What this brief changes about a computed number

It adds one: which of the three forms of the ask a page shows. That is computed in exactly
one place, the pure function of step 2, and both panes call it. Nothing else in the tree
decides what a blank page asks for. The states it reads from (`isSung`, `isPersonal`,
`stableCore`, `voiceTypeChoice`) are unchanged and are not recomputed here.

## 5. Constraints

- No control goes on the page. The links are text, not buttons with their own furniture.
- No directional word in any new string, in either language.
- Do not write, guess, or adapt any French line marked DRAFT in the companion file.
- Do not touch `PageFit.svelte`, and do not change what lane 70 built.
- Do not change any control's size, padding, or hit area, and add no coarse-pointer rule.
  The tap repair is its own lane and waits on Dann's ruling.
- Push to `cloud-lane-71`, cut from the tip of `Shane` once this brief is committed. Never
  push to `Shane` or `main`.
- Do not edit anything under `docs/memory/`.

## 6. Risks the desk has already found

1. The INPUT link's identity test (`SingerBlock.svelte:90`) is the thing most likely to
   break quietly: if a new ask form does not match the key exactly, the line renders with no
   link and no error. Test every form in both languages.
2. `profile.lede` (`i18n.ts:1498`) says "MELODY will appear here after Ilya processes the
   score you upload." The ruled lede replaces it. Check whether anything else reads that key.
3. MELODY's provisional sentence is assembled from fragments around a glyph snippet
   (`MarkupPane.svelte:1102-1107`, `provisionalPartsFor`, `listSep`). The new NOTES wording
   has to keep that assembly, because French needs a noun English omits
   (`profile-status.ts:48-52`).
4. `insights.r2.notes` is "Notes" in both languages and is drawn in small caps by CSS. Do
   not add a second heading key.
5. TEXT has no voice state and no NOTES block. Do not give it one for symmetry.

## 7. What you could not establish

End your report with a section headed "NOT ESTABLISHED", listing every claim in this brief
you could not confirm, and every question your work raised that you did not answer.

**NOT ESTABLISHED beats a complete invented answer.**

## 8. Done when

- All three blank pages draw one centred squircle, with the same geometry, type, and
  heading treatment, in both languages.
- The ask on MELODY and INSIGHTS names only what is missing, by the companion's table, and
  every section named in it is a link.
- `paper.empty`, `paper.empty.mobile`, and the device branch that chose between them are
  gone, and no new string carries a direction.
- The eight gates stand at their baselines, with every touched file's ratchet reported.
- The pictures of step 5 exist.
