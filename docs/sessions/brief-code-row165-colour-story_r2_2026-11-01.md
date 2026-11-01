# Brief: row 165, Ilya's new colour story, with an audit that every colour moved

r1, 2026-10-30, written by the desk (Opus). NOT Fable-reviewed: Fable reviews it after Sunday 2026-11-01 04:00 (`CONTRACT.md` §1 item 19). Lane: cloud, Sonnet. **NOT ESTABLISHED beats a complete invented answer.** Every claim about the code carries the line the desk read on 2026-10-30; re-read each before changing it.

## What the singer sees, and why

Dann rebuilt the colour story on the live alias on 2026-10-30, 15:04 to 16:22, and ratified it 16:22 (*"I ratify all these changes and I want to adopt them immediately."*). The rulings, in his words and with times, are in `docs/memory/OPEN.md`, the 2026-10-30 section (from "Coloured text always uses the family's ink step" to the end). Why: every band colour failed as text on paper (2.79 to 2.91:1); the bands looked dusty beside cobalt; umber was disliked; Guide tired the eyes; the turning noteheads did not stand apart from black notes. Measures and mocks: `~/Downloads/ilya-colour-review/` (not in the tree; the ratified values are).

## The values

`docs/sessions/palette-ratified_2026-10-30.css` holds every value, as tokens, with each role. In short:

- Five families, each with **band** (top bar, chapter band), **desk** (page background), **head** (drawer section header, one step deeper than the desk, its label in ink), **wash**, **jewel** (buttons, pills, active states), **ink** (all coloured text on paper).
- Learn changes from umber to **slate** (`--umber` tokens keep their names until a rename step; say in the report whether to rename).
- Guide's cobalt band and desk are calmer (`#788DB1`, `#E1E6EF`); Piece's drawer header keeps the light blue `#B9CBEB`.
- Drawer section headers (Piece, Input, Voice) become the family's head tint with the label in ink, not white on a solid bar.
- Chapter-band subheaders (`.band-deck`, `apps/web/src/lib/components/Paper/ReadingPaper.svelte`, chapter band rules at `:126-140`): upright, 18.7px, weight 700, white, so they count as large text and pass 3:1 on every band.
- The `2026A` badge in the sigil: white on a 22 percent white veil over the band (the element is NOT READ by the desk; find it in the header).
- Turning noteheads: `TURNING_COLOUR` (`packages/score-parser/src/staff-renderer.ts:890`, now `#9585A2`) becomes lavender jewel `#6C4D8C`; opacity 0.85 (`:3051`, `:3053`) becomes 1; drawn at 82 percent of a notehead (cue size, Dann 16:08: *"we should keep this innovation for our finished design"*). **Other sites that use the same colour or size (`CONTRACT.md` §4):** the turning accidentals (`:3044`, `:3046`), the turning ledger lines (`:3034`), the legend in the Markup header ("= the pitch where this vowel turns"), and the Loupe's own filter (comment at `staff-renderer.ts:935`); and any spacing that measures the turning head's width (`PRIMITIVE_TURNING_ACC_W`, `:899` area, and `TURNING_CLEARANCE_SP`) must be re-checked against the smaller head.
- Coloured text on paper (Guide's and Learn's headings, the gloss line, links) uses the ink step (`+page.svelte:3051-3061` paints reading headings in the tab's colour, per the comment at `ReadingPaper.svelte:149-155`; NOT READ by the desk).

## Steps (one commit and one report each)

**Step 0, the census, keep nothing.** Every place an old colour is written: the desk found 23 non-test source files under `apps/web/src`, `apps/web/static`, and `packages` holding one or more of the old hex values (grep 2026-10-30 16:2x for 839275, 7A8A6C, 9585A2, AB7F7F, 748CB9, A38669, the chips, inks, desks, washes, and 8A5C5C). Also search `rgb(`, `rgba(`, and `hsl(` forms, `var(--x, #hex)` fallbacks, SVG `fill=` and `stroke=` literals, canvas `fillStyle`, print CSS, the service worker's offline page, `manifest.webmanifest` `theme_color`, and favicons. Report a table: file, line, old value, role, new token.

**Step 1, the tokens.** `apps/web/src/app.css` (families at `:36-60`, desks `:148-152`, washes `:156-158`, chips `:178-182`, inks `:189-193`) takes the ratified values; add the `head` and `jewel` steps.

**Step 2, every site from the census** moves to a token (never a new literal), with Guide, Learn, the drawer headers, the badge, and the subheaders as above.

**Step 3, the score renderer** (turning noteheads, accidentals, ledger lines, size, and spacing).

**Step 4, the guard.** A test that fails if any old hex value from step 0's list reappears in source, and a contrast test over the token pairs that carry words (ink on paper, ink on desk, white on jewel, white on band for large text only) at WCAG 2.2 AA.

**Step 5, the measure.** Screenshots of Text, Markup, Insights, Guide, Learn, and the drawer on song 1 (the Sunless no. 1 fixture), in English and French, and print previews of the three documents; the contrast table re-run on the live preview.

Gates at baseline; no push to `Shane` or `main`; nothing under `docs/memory/`.

## What the desk could not establish

The badge's element; how the drawer headers get their colour (the desk's preview overrode them by script); whether any colour lives in a canvas or an image; the French pages' own overrides, if any.

## r2 (2026-11-01): Fable's review and Dann's answers applied

Review: `docs/sessions/review-fable-brief-row165_r1_2026-11-01.md` (SEND WITH AMENDMENTS, 14 amendments, 170,897 tokens). **All 14 amendments apply as written in that file, with their exact replacement text; read it in full first. Where the review and the text above differ, the review wins, except where a ruling below differs.** In particular: the census is 25 non-test files plus 24 `rgba()` sites in 9 files, `apps/web/src/app.html:9` (theme-color), and `manifest.webmanifest:8-9`; six tests pin old colours and change in the same commit as the colours they pin (`docs/memory/CONTRACT.md` §1 item 11a); five approval SVGs are regenerated; `+page.svelte:3051-3061` reads `:5332-5348`; seven touched files sit at zero ratchet slack, so stop and report rather than raise a ceiling.

**Rulings (Dann 2026-11-01, `docs/memory/INBOX.md`):**
1. **INSIGHTS bars** (`Tessituragram.svelte:154`, `PitchSeconds.svelte:156`) take `--rose-jewel` (`#7C4E59`) in place of the retired `--rose-chip`; the passaggio lines stay `--rose-ink` (12:44, question 1).
2. **The 2026A badge passes contrast now** (12:45, question 2, against the review's recommendation): its veil takes 22 percent of the family's jewel step instead of white, with white text; measure the ratio on all five families and report each, at least 4.5:1.
3. **INPUT's active Poem | Lyrics side** is the soft sage desk tint, `var(--sage-desk)` (12:34; row 163 builds it, so use the token and do not touch that pill here).
4. Singer-facing mentions of the five document names are in capitals (12:19); this brief adds no such string.

**Lane and order (DESK DEFAULT):** cloud, Sonnet, branch `cloud-lane-23` cut from `Shane` at `cab8d205`; push only that branch, never `Shane` or `main`, no pull request; commit no `docs/memory/` file and no `brief-*` or `review-*` file; one commit and one report per step (`docs/sessions/report-code-row165-step<n>_r1_2026-11-01.md`). Row 163 is being built in parallel on the Mac (branch `mac-row163`); both touch colour tokens, so the desk resolves any overlap when it merges the two. Baselines at `cab8d205`: phonology "291 passed (291)", dictionary "248 passed (248)", web check "found 0 errors and 12 warnings in 5 files", web test "3718 passed | 1 skipped (3719)", score-parser "775 passed | 5 skipped (780)", blurb "145 passed (145)", integration "55 passed (55)", `pnpm ratchets` "ratchets: OK.".
