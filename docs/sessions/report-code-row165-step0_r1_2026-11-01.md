# Report: row 165, step 0, the census (r1, 2026-11-01)

Branch `cloud-lane-23`, cut from `Shane` at `bddc1e27` (the brief says `cab8d205`; Dann's prompt named `bddc1e27`, so that governs). Working tree clean at start. Step 0 keeps nothing: this report is the only file in the commit. Every row below was produced by one grep run on this tree on 2026-11-01 and then classified by hand where a judgement was needed.

## Baselines before step 1 (all eight match the brief)

| Gate | Result |
|---|---|
| phonology | 291 passed (291) |
| dictionary | 248 passed (248) |
| web check | found 0 errors and 12 warnings in 5 files |
| web test | 3718 passed, 1 skipped (3719) |
| score-parser | 775 passed, 5 skipped (780) |
| blurb | 145 passed (145) |
| integration | 55 passed (55) |
| `pnpm ratchets` | ratchets: OK. |

## Scope and method

Case-insensitive, word-bounded grep over `apps/web/src`, `apps/web/static`, and `packages/*/src` (excluding `__approved__/`, `node_modules`, `.svelte-kit`), for: the brief's old hex list (bands, deep/gloss, chips, inks, desks, washes, `8A5C5C`); the family literals from review amendment 3 (`b48a8a`, `d9c4c4`, `e2d2d2`, `F0D8D8`, `C28888`, `8ba48b`, `8a9b7e`, `6B7B5E`, `7c6bb0`, `6b5b7a`, `8E7E9B`, `9B8AA6`, `D8D0E0`); and `rgb(`/`rgba(` with the triplets 131,146,117; 171,127,127; 116,140,185; 149,133,162; 163,134,105; 124,107,176.

Result: **198 hits in 36 files**, 31 of them non-test source files and 5 test files, plus one test pin that has no `#` (`wait.test.ts:79`, `'E6E9E3', 'EAE7EC', 'EEE5E5'`). That is the six pinning tests the review named. The 25-file figure on the hex list alone and the nine `rgba()` files from the review reproduce; the larger total here is because the table also includes the family literals.

Also searched, with these results:

- `hsl(`: no match in any `.svelte` or `.css` file under `apps/web/src`.
- `fillStyle` / `strokeStyle`: one site, `ctx.fillStyle = '#FFFFFF'` at `reader/page-pdf.ts:210`, white, not a family colour. No family colour lives in a canvas (ESTABLISHED by that grep over `apps/web/src` and `packages/*/src`; images other than the icons were not opened).
- Service worker `static/sw.js`: no colour literal.
- `prefers-color-scheme`: none anywhere, so there is no dark mode to cover (review amendment 8, confirmed).
- `manifest.webmanifest:8-9` and `app.html:9`: in the table.
- **Icons carry sage, but not the old sage.** `static/icons/apple-touch-icon.png`, `icon-192.png`, `icon-512.png` are `#8B9A7D` on `#F5F0E8`; `icon-512-maskable.png` is `#64705A`. `static/favicon.png` is a 1x1 pixel (`#00FF00` at alpha 127). None equals `#839275`, so the guard will not catch them. Whether they should move to `#7D9D76` is **NOT ESTABLISHED** (a binary-art decision, not in the rulings); I leave them and ask in step 5's report.
- **Where the Voice drawer header lives (the review's open item): ESTABLISHED.** `Drawer.svelte:1118-1120` (`.group-score .group-band`, today `var(--lavender-chip)`); Voice is the `group-score` section (`Drawer.svelte:552`, id `scoreMarkup`). The calibration takeover band `.takeover-band` (`Drawer.svelte:1416`) also paints `var(--lavender-chip)` with white text. `VoiceAnchor.svelte:77,114` are a dot and a pill, as the review said.

## Token-name uses beyond hex (steps 1 and 2 will move these)

- `--*-chip`: 28 uses in 7 files (HeaderBar language pill `:211-228` and the per-tab badge `:152`; Drawer band headers `:1105-1120` and `.takeover-band` `:1416`; `Tessituragram.svelte:154`; `PitchSeconds.svelte:156`; ClefControls; InspectorPanel; the notation-font-lab page). Each becomes `--*-jewel` where words sit on it.
- `--umber*`: `app.css` 4, `Drawer.svelte` 4, `HeaderBar.svelte` 3, `ReadingPaper.svelte` 2, `+page.svelte` 5. Per the review, renamed to `--slate*` in this brief.
- `--sage-deep` (6 uses), `--sage-gloss` (1, `WordStack.svelte:298`), `--terracotta` (defined, one reference in a comment only): handled as the review says.

## The census table

Columns: file, line, old value, role, new token. "Role" is derived from the property on the line, and overridden by hand where the table says so. "(stays)" marks a value I judge a signal or out-of-scope colour and leave. Rows marked "stale fallback" are `var(--x, #old)` fallbacks whose old literal is dropped, since a fallback to the old hex would defeat the guard.

| File | Line | Old value | Role | New token |
|---|---|---|---|---|
| `~/app.css` | 42 | `#839275` | token / chrome | `--sage` |
| `~/app.css` | 43 | `#7A8A6C` | token / chrome | `--sage-jewel` |
| `~/app.css` | 44 | `#7A8A6C` | token / chrome | `--sage-ink (gloss line)` |
| `~/app.css` | 47 | `#AB7F7F` | token / chrome | `--rose` |
| `~/app.css` | 51 | `#748CB9` | token / chrome | `--cobalt` |
| `~/app.css` | 56 | `#9585A2` | token / chrome | `--lavender` |
| `~/app.css` | 59 | `#A38669` | token / chrome | `--slate` |
| `~/app.css` | 148 | `#CDD3C8` | token / chrome | `--sage-desk` |
| `~/app.css` | 149 | `#D5CEDA` | token / chrome | `--lavender-desk` |
| `~/app.css` | 150 | `#DDCCCC` | token / chrome | `--rose-desk` |
| `~/app.css` | 151 | `#C7D1E3` | token / chrome | `--cobalt-desk` |
| `~/app.css` | 152 | `#DACFC3` | token / chrome | `--slate-desk` |
| `~/app.css` | 156 | `#E6E9E3` | token / chrome | `--sage-wash` |
| `~/app.css` | 157 | `#EAE7EC` | token / chrome | `--lavender-wash` |
| `~/app.css` | 158 | `#EEE5E5` | token / chrome | `--rose-wash` |
| `~/app.css` | 178 | `#637156` | token / chrome | `--sage-jewel` |
| `~/app.css` | 179 | `#885F60` | token / chrome | `--rose-jewel` |
| `~/app.css` | 180 | `#556C96` | token / chrome | `--cobalt-jewel` |
| `~/app.css` | 181 | `#746580` | token / chrome | `--lavender-jewel` |
| `~/app.css` | 182 | `#82664A` | token / chrome | `--slate-jewel` |
| `~/app.css` | 189 | `#455238` | token / chrome | `--sage-ink` |
| `~/app.css` | 190 | `#554660` | token / chrome | `--lavender-ink` |
| `~/app.css` | 191 | `#674141` | token / chrome | `--rose-ink` |
| `~/app.css` | 192 | `#61472C` | token / chrome | `--slate-ink` |
| `~/app.css` | 193 | `#374D75` | token / chrome | `--cobalt-ink` |
| `~/app.css` | 211 | `#D8D0E0` | token (stays) | NONE: `--surround-voice` stays (ruled rose 2026-09-13, never built; not in this brief) |
| `~/app.html` | 9 | `#839275` | token / chrome | `--sage` |
| `~/lib/components/Reading/GuideContent.svelte` | 633 | `#748CB9` | text colour | `--cobalt` |
| `~/lib/components/Reading/LearnContent.svelte` | 4074 | `#F0D8D8` | fill (signal? family) | `--rose-desk` (GUIDE table highlight; family, moves with 4894 and `+page.svelte:4893`) |
| `~/lib/components/Reading/LearnContent.svelte` | 4075 | `#C28888` | border (family) | `--rose` |
| `~/lib/components/Paper/ReadingPaper.svelte` | 84 | `#A38669` | border / outline | `--slate` |
| `~/lib/components/Paper/ReadingPaper.svelte` | 133 | `#A38669` | fill | `--slate` |
| `~/lib/components/Paper/ReadingPaper.svelte` | 137 | `#748CB9` | fill | `--cobalt` |
| `~/lib/components/Paper/ReadingPaper.svelte` | 333 | `rgba(131,146,117)` | fill | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Paper/ReadingPaper.svelte` | 343 | `#839275` | border / outline | `--sage` |
| `~/lib/components/Paper/ReadingPaper.svelte` | 344 | `rgba(131,146,117)` | fill | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Paper/ReadingPaper.svelte` | 376 | `#AB7F7F` | text colour | `--rose` |
| `~/lib/components/Paper/ReadingPaper.svelte` | 451 | `rgba(131,146,117)` | fill | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Paper/ReadingPaper.svelte` | 459 | `rgba(131,146,117)` | fill | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Paper/one-head-one-foot.test.ts` | 28 | `#9585A2` | test pin | `--lavender` |
| `~/lib/components/Paper/one-head-one-foot.test.ts` | 57 | `#ab7f7f` | test pin | `--rose` |
| `~/lib/components/Paper/WordStack.svelte` | 229 | `rgba(131,146,117)` | fill | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Drawer/IntakeViews.svelte` | 306 | `#839275` | comment | reword: names the new sage band |
| `~/lib/components/Drawer/IntakeViews.svelte` | 418 | `#7A8A6C` | border / outline | `--sage-jewel` |
| `~/lib/components/Drawer/VoiceAnchor.svelte` | 14 | `#9B8AA6` | comment | reword or leave: historic stand-in, not a live value |
| `~/lib/components/Drawer/SearchableSelect.svelte` | 287 | `rgba(131,146,117)` | shadow / ring | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Drawer/SearchableSelect.svelte` | 380 | `rgba(131,146,117)` | fill | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Drawer/InspectorPanel.svelte` | 1527 | `#7A8A6C` | fill | `--sage-jewel` |
| `~/lib/components/Drawer/InspectorPanel.svelte` | 1536 | `#6B7B5E` | fill (family) | `--sage-jewel` (dictionary button, expanded state) |
| `~/lib/components/Drawer/InspectorPanel.svelte` | 1735 | `rgba(131,146,117)` | fill | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Drawer/InspectorPanel.svelte` | 1807 | `rgba(131,146,117)` | shadow / ring | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Drawer/InspectorPanel.svelte` | 1961 | `rgba(131,146,117)` | shadow / ring | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Drawer/InspectorPanel.svelte` | 1994 | `rgba(131,146,117)` | shadow / ring | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Drawer/InspectorPanel.svelte` | 2190 | `#7A8A6C` | fill | `--sage-jewel` |
| `~/lib/components/Drawer/InspectorPanel.svelte` | 2191 | `#7A8A6C` | border / outline | `--sage-jewel` |
| `~/lib/components/Drawer/InspectorPanel.svelte` | 2197 | `rgba(131,146,117)` | shadow / ring | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Drawer/IntakePanel.svelte` | 608 | `#839275` | comment | reword: names the new sage band |
| `~/lib/components/Drawer/IntakePanel.svelte` | 617 | `rgba(131,146,117)` | fill | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Drawer/IntakePanel.svelte` | 625 | `rgba(131,146,117)` | fill | `color-mix(var(--sage) x%, transparent)` |
| `~/lib/components/Drawer/Drawer.svelte` | 1638 | `#A38669` | text colour | `--slate` |
| `~/lib/components/Drawer/Drawer.svelte` | 1642 | `#748CB9` | text colour | `--cobalt` |
| `~/lib/components/Drawer/Drawer.svelte` | 1679 | `rgba(163,134,105)` | border / outline | `color-mix(var(--slate) x%, transparent)` |
| `~/lib/components/Drawer/Drawer.svelte` | 1680 | `rgba(163,134,105)` | fill | `color-mix(var(--slate) x%, transparent)` |
| `~/lib/components/Drawer/Drawer.svelte` | 1685 | `#839275` | border / outline | `--sage` |
| `~/lib/components/Drawer/Drawer.svelte` | 1693 | `#A38669` | border / outline | `--slate` |
| `~/lib/components/Drawer/Drawer.svelte` | 1696 | `rgba(163,134,105)` | fill | `color-mix(var(--slate) x%, transparent)` |
| `~/lib/components/Drawer/Drawer.svelte` | 1702 | `#A38669` | border / outline | `--slate` |
| `~/lib/components/Drawer/Drawer.svelte` | 1789 | `#A38669` | text colour | `--slate` |
| `~/lib/components/Drawer/Drawer.svelte` | 1802 | `rgba(116,140,185)` | border / outline | `color-mix(var(--cobalt) x%, transparent)` |
| `~/lib/components/Drawer/Drawer.svelte` | 1803 | `rgba(116,140,185)` | fill | `color-mix(var(--cobalt) x%, transparent)` |
| `~/lib/components/Drawer/Drawer.svelte` | 1807 | `#748CB9` | border / outline | `--cobalt` |
| `~/lib/components/Drawer/Drawer.svelte` | 1808 | `rgba(116,140,185)` | fill | `color-mix(var(--cobalt) x%, transparent)` |
| `~/lib/components/Drawer/Drawer.svelte` | 1812 | `#748CB9` | border / outline | `--cobalt` |
| `~/lib/components/Drawer/Drawer.svelte` | 1816 | `#748CB9` | text colour | `--cobalt` |
| `~/lib/components/Drawer/Drawer.svelte` | 1820 | `#839275` | border / outline | `--sage` |
| `~/lib/components/HeaderBar.svelte` | 74 | `#839275` | fill | `--sage` |
| `~/lib/components/HeaderBar.svelte` | 78 | `#A38669` | fill | `--slate` |
| `~/lib/components/HeaderBar.svelte` | 82 | `#748CB9` | fill | `--cobalt` |
| `~/lib/components/HeaderBar.svelte` | 94 | `#9585A2` | fill | `--lavender` |
| `~/lib/components/HeaderBar.svelte` | 103 | `#AB7F7F` | fill | `--rose` |
| `~/lib/components/HeaderBar.svelte` | 148 | `#7A8A6C` | fill | `--sage-jewel` |
| `~/lib/components/HeaderBar.svelte` | 152 | `#82664A` | fill | `--slate-jewel` |
| `~/lib/components/HeaderBar.svelte` | 159 | `#8E7E9B` | comment | delete with the five badge rules |
| `~/lib/components/HeaderBar.svelte` | 211 | `#637156` | fill | `--sage-jewel` |
| `~/lib/components/HeaderBar.svelte` | 215 | `#82664A` | fill | `--slate-jewel` |
| `~/lib/components/HeaderBar.svelte` | 219 | `#556C96` | fill | `--cobalt-jewel` |
| `~/lib/components/HeaderBar.svelte` | 224 | `#746580` | fill | `--lavender-jewel` |
| `~/lib/components/HeaderBar.svelte` | 228 | `#885F60` | fill | `--rose-jewel` |
| `~/lib/components/OctaveLine.svelte` | 86 | `#6b5b7a` | text colour (stale fallback) | `var(--lavender-ink)`, fallback dropped |
| `~/lib/components/OctaveLine.svelte` | 93 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/components/InstallPrompt.svelte` | 171 | `#839275` | border / outline | `--sage` |
| `~/lib/components/InstallPrompt.svelte` | 214 | `#839275` | fill | `--sage` |
| `~/lib/components/InstallPrompt.svelte` | 223 | `#7A8A6C` | hover fill | `--sage-jewel` |
| `~/lib/voice/pacifier/contrast.test.ts` | 197 | `#8E7E9B`, `#9585A2` | comment | reword with the re-pinned ratio |
| `~/lib/voice/pacifier/contrast.test.ts` | 430 | `#D8D0E0` | test control (stays) | NONE: mutates `--surround-voice`, which stays |
| `~/lib/voice/pacifier/contrast.ts` | 126 | `#9585A2` | Pacifier palette table | `#9F85BC` (must agree with `--lavender`, `contrast.test.ts:405-437`) |
| `~/lib/voice/pacifier/contrast.ts` | 127 | `#D8D0E0` | Pacifier palette table (stays) | NONE: `--surround-voice` stays |
| `~/lib/voice/pacifier/contrast.ts` | 284 | `#9585A2` | comment | reword with the new ratio if it changes |
| `~/lib/tempo/TempoControl.svelte` | 179 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/tempo/TempoControl.svelte` | 211 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/tempo/TempoControl.svelte` | 234 | `#9585a2` | fill | `--lavender` |
| `~/lib/tempo/TempoControl.svelte` | 242 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/tempo/TempoControl.svelte` | 276 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/tempo/TempoControl.svelte` | 298 | `#6b5b7a` | text colour (stale fallback) | `var(--lavender-ink)`, fallback dropped |
| `~/lib/markup/MarkupPane.svelte` | 1013 | `#9585A2` | running-header / footer prop | `--lavender` |
| `~/lib/markup/MarkupPane.svelte` | 1014 | `#9585A2` | running-header / footer prop | `--lavender` |
| `~/lib/markup/MarkupPane.svelte` | 1015 | `#9585A2` | running-header / footer prop | `--lavender` |
| `~/lib/markup/MarkupPane.svelte` | 1023 | `#9585A2` | running-header / footer prop | `--lavender` |
| `~/lib/markup/MarkupPane.svelte` | 1031 | `#9585A2` | running-header / footer prop | `--lavender` |
| `~/lib/markup/MarkupPane.svelte` | 1044 | `#9585A2` | running-header / footer prop | `--lavender` |
| `~/lib/markup/MarkupPane.svelte` | 1046 | `#9585A2` | running-header / footer prop | `--lavender` |
| `~/lib/markup/MarkupPane.svelte` | 1098 | `#9585A2` | running-header / footer prop | `--lavender` |
| `~/lib/markup/MarkupPane.svelte` | 1099 | `#9585A2` | running-header / footer prop | `--lavender` |
| `~/lib/markup/MarkupPane.svelte` | 1100 | `#9585A2` | running-header / footer prop | `--lavender` |
| `~/lib/markup/MarkupPane.svelte` | 1135 | `#9585A2` | running-header / footer prop | `--lavender` |
| `~/lib/markup/MarkupPane.svelte` | 1171 | `#9585a2` | SVG paint | `--lavender` |
| `~/lib/markup/NotesColumn.svelte` | 181 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/markup/NotesColumn.svelte` | 188 | `#9585A2` | comment | reword |
| `~/lib/markup/NotesColumn.svelte` | 202 | `#554660` | text colour | `--lavender-ink` |
| `~/lib/score/LoupePlacementRow.svelte` | 87 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/score/LoupePlacementRow.svelte` | 102 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/score/ClefControls.svelte` | 250 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/score/ClefControls.svelte` | 263 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/score/ClefControls.svelte` | 313 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/score/ClefControls.svelte` | 324 | `#9585a2` | fill | `--lavender` |
| `~/lib/score/ClefControls.svelte` | 329 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/score/ScoreUploader.svelte` | 776 | `#7c6bb0` | border (family: comment says lavender) | `--lavender` |
| `~/lib/score/ScoreUploader.svelte` | 777 | `rgba(124,107,176)` | fill | `color-mix(var(--lavender) x%, transparent)` |
| `~/lib/score/CorrectionSurface.svelte` | 821 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/score/CorrectionSurface.svelte` | 956 | `#9585a2` | text colour | `--lavender` |
| `~/lib/score/CorrectionSurface.svelte` | 979 | `#9585a2` | text colour | `--lavender` |
| `~/lib/score/CorrectionSurface.svelte` | 1060 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/score/CorrectionSurface.svelte` | 1061 | `#9585a2` | text colour | `--lavender` |
| `~/lib/score/CorrectionSurface.svelte` | 1071 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/score/CorrectionSurface.svelte` | 1206 | `#9585a2` | text colour | `--lavender` |
| `~/lib/score/LoupeSyllables.svelte` | 219 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/score/LoupeSyllables.svelte` | 224 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/score/Loupe.svelte` | 2762 | `#d5ceda` | fill | `--lavender-desk` |
| `~/lib/score/Loupe.svelte` | 2977 | `#9585a2` | SVG paint | `--lavender` |
| `~/lib/score/Loupe.svelte` | 3002 | `#839275` | border / outline | `--sage` |
| `~/lib/insights/FitTable.svelte` | 132 | `rgba(171,127,127)` | border / outline | `color-mix(var(--rose) x%, transparent)` |
| `~/lib/insights/SingerBlock.svelte` | 353 | `#6b5b7a` | text colour (stale fallback) | `var(--lavender-ink)`, fallback dropped |
| `~/lib/insights/SingerBlock.svelte` | 360 | `#9585a2` | border / outline | `--lavender` |
| `~/lib/insights/SingerBlock.svelte` | 379 | `#e2d2d2` | fill (family) | `--rose-wash` (UNDER segment) |
| `~/lib/insights/SingerBlock.svelte` | 380 | `#b48a8a` | ring (family) | `--rose` |
| `~/lib/insights/SingerBlock.svelte` | 384 | `#b48a8a` | fill (family) | `--rose` (WITHIN segment) |
| `~/lib/insights/SingerBlock.svelte` | 393 | `#d9c4c4` | fill (family) | `--rose-head` (BEFORE segment) |
| `~/lib/insights/SingerBlock.svelte` | 404 | `#b48a8a` | border (family) | `--rose` |
| `~/lib/insights/SingerBlock.svelte` | 467 | `#d9c4c4` | SVG stroke (family) | `--rose-head` |
| `~/lib/insights/InsightsPane.svelte` | 536 | `#AB7F7F` | running-header / footer prop | `--rose` |
| `~/lib/insights/InsightsPane.svelte` | 537 | `#AB7F7F` | running-header / footer prop | `--rose` |
| `~/lib/insights/InsightsPane.svelte` | 538 | `#AB7F7F` | running-header / footer prop | `--rose` |
| `~/lib/insights/InsightsPane.svelte` | 590 | `#ab7f7f` | running-header / footer prop | `--rose` |
| `~/lib/insights/InsightsPane.svelte` | 603 | `#ab7f7f` | running-header / footer prop | `--rose` |
| `~/lib/insights/InsightsPane.svelte` | 619 | `#ab7f7f` | running-header / footer prop | `--rose` |
| `~/lib/insights/InsightsPane.svelte` | 625 | `#ab7f7f` | running-header / footer prop | `--rose` |
| `~/routes/+page.svelte` | 4824 | `#8ba48b` | border (family) | `--sage` |
| `~/routes/+page.svelte` | 4877 | `#8ba48b` | text on paper (family) | `--sage-ink` |
| `~/routes/+page.svelte` | 4889 | `#A38669` | text colour | `--slate` |
| `~/routes/+page.svelte` | 4893 | `#F0D8D8` | fill (family) | `--rose-desk` |
| `~/routes/+page.svelte` | 4894 | `#C28888` | ring (family) | `--rose` |
| `~/routes/+page.svelte` | 5079 | `#CDD3C8` | fill | `--sage-desk` |
| `~/routes/+page.svelte` | 5083 | `#DACFC3` | fill | `--slate-desk` |
| `~/routes/+page.svelte` | 5087 | `#C7D1E3` | fill | `--cobalt-desk` |
| `~/routes/+page.svelte` | 5094 | `#DDCCCC` | fill | `--rose-desk` |
| `~/routes/+page.svelte` | 5106 | `#D5CEDA` | fill | `--lavender-desk` |
| `~/routes/+page.svelte` | 5277 | `#A38669` | border / outline | `--slate` |
| `~/routes/+page.svelte` | 5294 | `#A38669` | text colour | `--slate` |
| `~/routes/+page.svelte` | 5336 | `#A38669` | text colour | `--slate` |
| `~/routes/+page.svelte` | 5343 | `#748CB9` | text colour | `--cobalt` |
| `~/routes/+page.svelte` | 5347 | `#748CB9` | border / outline | `--cobalt` |
| `~/routes/+page.svelte` | 5549 | `#8a9b7e` | button fill, white text (stale fallback) | `--sage-jewel` |
| `apps/web/static/manifest.webmanifest` | 8 | `#839275` | token / chrome | `--sage` |
| `apps/web/static/manifest.webmanifest` | 9 | `#839275` | token / chrome | `--sage` |
| `pkg/score-parser/src/placeholder-mark.test.ts` | 35 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/placeholder-mark.test.ts` | 36 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/placeholder-mark.test.ts` | 40 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/placeholder-mark.test.ts` | 43 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 599 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 604 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 608 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 861 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 872 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 879 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 886 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 896 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 929 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 979 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 980 | `#839275` | test pin | `--sage` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 990 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 1074 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 1132 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.test.ts` | 2026 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/staff-renderer.ts` | 31 | `#9585A2` | comment | reword |
| `pkg/score-parser/src/staff-renderer.ts` | 93 | `#9585A2` | WITHHELD_SIGLA.colour (SVG attr, no CSS var) | `#6C4D8C` via the TURNING_COLOUR constant (DESK DEFAULT, see report) |
| `pkg/score-parser/src/staff-renderer.ts` | 890 | `#9585A2` | TURNING_COLOUR | `#6C4D8C` (lavender jewel) |
| `pkg/score-parser/src/stem-legend.test.ts` | 70 | `#9585A2` | test pin | `--lavender` |
| `pkg/score-parser/src/stem-legend.test.ts` | 80 | `#9585A2` | test pin | `--lavender` |


## What I judged family colour, and what I judged signal

Family (moves to a token in step 2): all of `SingerBlock.svelte:379-467` (the rose range bar: BEFORE `--rose-head`, UNDER `--rose-wash` with a `--rose` inset ring, WITHIN `--rose`, ABOVE and PAST stay `--rose-ink`); the GUIDE highlight pair (`LearnContent.svelte:4074-4075`, `+page.svelte:4893-4894`, which must stay one colour: the legend swatch has to match the cell it names); the sage `#8ba48b` pair at `+page.svelte:4824,4877`; `+page.svelte:5549` (a white-text button, so `--sage-jewel`, not the band); `InspectorPanel.svelte:1536`; `ScoreUploader.svelte:776-777`.

Signal or out of scope (stay): `--surround-voice #D8D0E0` (`app.css:211`, `contrast.ts:127`, `contrast.test.ts:430`; ruled rose 2026-09-13 and never built, not in this ratification; left alone). `#b23b3b`-class reds in the renderer (crossing squircles) are not on any list and are untouched.

Near misses I saw and did NOT add to scope, because they are not on the brief's or the review's list: `#ebeee8` (`+page.svelte`, the `.gt-cursive` cell background, a sage tint beside the text that becomes `--sage-ink`). I will leave it and flag it in step 2's report rather than widen the list.

## Decisions I made that the desk may want to reverse (DESK DEFAULT)

1. `WITHHELD_SIGLA.colour` (`staff-renderer.ts:93`, the withheld "?" mark) was the same `#9585A2` as the turning heads and the comment says it is "Markup's own accent". An SVG attribute cannot take a CSS variable, so it needs a literal. I will point it at `TURNING_COLOUR` (`#6C4D8C`) so the two keep agreeing, as they did before. Not in the brief; reversible in one line.
2. `--umber*` renamed `--slate*` (the review's DESK DEFAULT, from Dann's 2026-11-01 12:00 ruling).

## Ratchet slack, counted now (step 1 onward must end at or under each ceiling)

Your instruction overrides the brief's amendment 12: **if a file would pass its ceiling I stop and report; I do not raise it.**

| File | Lines now | Ceiling | Slack |
|---|---|---|---|
| `routes/+page.svelte` | 5586 | 5586 | 0 |
| `Drawer/Drawer.svelte` | 1990 | 1990 | 0 |
| `Drawer/InspectorPanel.svelte` | 2432 | 2432 | 0 |
| `markup/MarkupPane.svelte` | 1364 | 1364 | 0 |
| `score/CorrectionSurface.svelte` | 1227 | 1227 | 0 |
| `score-parser/src/staff-renderer.ts` | 3429 | 3429 | 0 |
| `score/ScoreUploader.svelte` | 867 | 867 | 0 |
| `score/Loupe.svelte` | 3012 | 3013 | 1 |
| `Reading/LearnContent.svelte` | 4086 | 4099 | 13 |
| `insights/InsightsPane.svelte` | 760 | 1351 | 591 (lower to 760, in step 1) |

## Test pins that will change with their colours (CONTRACT §1 item 11a)

`wait.test.ts:68-80` (arithmetic and three washes), `contrast.test.ts` (`:198-200`, `:406-409`), `one-head-one-foot.test.ts:28,57`, `staff-renderer.test.ts` (15 sites), `stem-legend.test.ts:70,80`, `placeholder-mark.test.ts:35-43`. Approval fixtures to regenerate: `apps/web/src/lib/approval/__approved__/sunless-01-engraved.primitive.svg` (148 hits of `9585A2`) and four `packages/score-parser/src/approval/__approved__/renderDemo*.svg`; the review names five and that is right: grep counts are `renderDemo.primitive`, `renderDemo.smufl`, `renderDemoDotted.primitive`, `renderDemoDotted.smufl` at 25 each, and `renderDemoUnmeasured.primitive` and `.smufl` at 0, so those two do not change.

## Not established

- Whether the PNG icons should move to the new sage (see above).
- Whether `--surround-voice` should become rose (left alone).
- The French pages' own overrides: no colour literal in any French-specific file turned up in the grep; there is no separate French stylesheet in the tree.
- Where the Learn and Guide *tab* classes in `+page.svelte` (`tab-learn`, `tab-guide`) are used beyond `:5332-5348`: step 2 re-greps.

No French changes in this step.
