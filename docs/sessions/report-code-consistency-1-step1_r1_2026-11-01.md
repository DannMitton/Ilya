# Report: consistency batch 1, step 1 (labels into `i18n.ts`), r1, 2026-11-01

Branch `cloud-lane-24`, cut from `Shane` at `6f740dbf` (the tip after row 165). Working tree clean at the cut. Brief: `brief-code-consistency-1-screen-words_r2_2026-11-01.md`, with Fable's amendments 3, 4, 5 and 12 (`review-fable-brief-consistency-1_r1_2026-11-01.md`).

## Step 0: baselines at `6f740dbf` (run after `pnpm install --frozen-lockfile`)

| gate | result | matches the brief |
|---|---|---|
| phonology | `Tests  291 passed (291)` | yes |
| dictionary | `Tests  248 passed (248)` | yes |
| web check | `svelte-check found 0 errors and 12 warnings in 5 files` | yes |
| web test | `Tests  3784 passed \| 1 skipped (3785)` | yes |
| score-parser | `Tests  785 passed \| 5 skipped (790)` | yes |
| blurb | `Tests  145 passed (145)` | yes |
| integration | `Tests  55 passed (55)` | yes |
| `pnpm ratchets` | `ratchets: OK.` | yes |

No difference to report. The e2e suite is outside the eight gates and was not run in this step.

## What changed, file by file

- `apps/web/src/lib/components/Drawer/Drawer.svelte`: 84 language ternaries and the literal `GUIDE` heading replaced one for one, on the same lines, by `t(...)` calls. No line added or removed. 82 read new `toc.*` keys; the two headings read the existing `tab.learn` and `tab.guide` (CSS `.toc-heading` already sets capitals, so the screen is unchanged); `Drawer.svelte:802` used a double-quoted English string and was done by hand (`toc.guide.mitton-note`).
- `apps/web/src/lib/i18n.ts`: 83 `toc.learn.*` / `toc.guide.*` keys under one banner comment (`THE TABLES OF CONTENTS, drawn by Drawer.svelte`), `en` first; key = `toc.<learn|guide>.<heading id without its prefix>` (for example `toc.learn.u1-song`, `toc.guide.markup-notation`), plus `toc.learn.aria` and `toc.guide.aria`. Nine more keys under a second banner: `app.title`, `console.selectWord`, `inspector.spot.reduction`, `inspector.spot.reconstitution`, `inspector.resetWordAria`, `inspector.editGlossAria`, `select.noResults`, `select.resultCount.one`, `select.resultCount.many` (the last two carry `{n}`). The prefix index gains one line, `toc.  83`. Every value is the old text, escape for escape.
- `AnalysisStation.svelte:102`, `InspectorPanel.svelte:60-61, :1002, :1044`, `SearchableSelect.svelte:76-79`, `HeaderBar.svelte:48`: the nine labels now read keys. `SearchableSelect` picks `.one` or `.many` by count and replaces `{n}`.

## Counts

| | before | after |
|---|---|---|
| language ternaries (the audit grep) | 117 in 20 files | 24 in 14 files |
| in `Drawer.svelte` | 84 | 0 |
| `Drawer.svelte` lines | unchanged | unchanged |

## The 24 ternaries that stay (not labels)

17 choose a locale, attribute, gloss field, or rule: `HeaderBar.svelte:32`, `ReadingPaper.svelte:13`, `ReadingAid.svelte:55`, `gloss-resolve.ts:37, :38, :43`, `insights.ts:665, :749`, `phonation-headline.ts:43`, `singing-measures.ts:177, :178`, `Tessituragram.svelte:104`, `ProfileSwitcher.svelte:209`, `+page.svelte:2926`, `bandState.ts:88`, `singer-page.ts:298`, `InsightsPane.svelte:290`. 7 are typographic glue (DESK DEFAULT: they stay): `comment-sources.ts:134, :143, :145, :169`, `singer-blocks.ts:126, :127`, `ingest.ts:112`. This matches amendment 3 exactly.

## Gates after

| gate | result |
|---|---|
| web check | `svelte-check found 0 errors and 12 warnings in 5 files` |
| web test | `Tests  3784 passed \| 1 skipped (3785)` (includes `approval/i18n-keys.test.ts`) |
| `pnpm ratchets` | `ratchets: OK.` |

Phonology, dictionary, score-parser, blurb, and integration are untouched by this step and were not re-run.

## For row 171's Code (amendment 5)

The `toc.guide.*` values moved verbatim from `Drawer.svelte` into `i18n.ts`. Row 171 rewords them there, not in `Drawer.svelte`, when it rewords the headings they mirror. `toc.guide.markup-notation` is the exception: step 3 changes it with the Guide heading.

## Noted, not changed (words move verbatim in this step)

- `app.title` is "Ilya — Russian Lyric Diction" with an em dash. It is a screen-reader-only `<h1>` (`HeaderBar.svelte:48`). The house rule bans em dashes in user-facing copy; this is a ruling for Dann, not changed here.
- `inspector.spot.reduction` / `.reconstitution` still read « ciblée »; step 3 changes them.
- Unread keys with retired names stay (amendment 17): `input.transcribe`, `input.transcribeLoading`, `input.clear`, `meta.heading`, `inspector.spotRecon.*`. Batch 4 removes them.
- `i18n.ts:11` still says "881 keys"; batch 3 regenerates it.

## NOT ESTABLISHED

- Visual equality of the two TOC headings and the TOC buttons on screen was not measured. It follows from the identical strings and the unchanged CSS, not from a render.
