# Memo: colour story stage 4, the values

**Answers:** `docs/sessions/brief-colour-stage4_r1_2026-09-14.md`, read in full this session. Also read in full as its context: `docs/memory/CONTRACT.md`, `docs/sessions/spec-colour_r1_2026-09-13.md`, `docs/memory/STATE.md`, and `docs/sessions/memo-colour-token-roles_r1_2026-09-13.md`.
**Date:** 2026-09-14.
**Status:** `WRITTEN`. All five gates are at baseline before and after, and the tokens and their paint were read in the browser at 1400 px. Dann has not walked it, so it is not `DONE`. **Not committed and not staged.** No git command that writes was run.

**The tree moved under this session.** It opened on `296b821` with three memory files modified. `HEAD` is now `8b24e50`, "Close of 2026-09-14…", which carries those three files. None of this pass's 24 files is in that commit; `git status` shows all 24 as modified against it.

---

## 1. Read first: where this pass went past the brief

Every item here is reversible, and each is marked DESK DEFAULT or names what forced it.

1. **Learn moves on 13 anchors, not the brief's exactly two.** The brief's two (`HeaderBar.svelte`, `.tab-learn .lang-pill`; `+page.svelte`, `.app-content.tab-learn`) are done. The tree holds 11 more Learn-scoped rose paints. With only the two moved, Learn would draw an umber chip and desk under a rose header band, rose chapter bands, and rose headings. Tether 3: the tree wins. Every one moves to the umber value in the same role, so a band use takes `--umber`, a chip use `--umber-chip`, and a tint takes umber's rgb at the same alpha. §3.2 lists all 13.
2. **Literal copies of a family value moved with their token**, not only `var()` fallbacks. Examples: `#8E7E9B` written bare in `SyllableStation.svelte`, `VoiceProfilePane.svelte`, and `IntakePanel.svelte`; the renderer's `TURNING_COLOUR`; `rgba(139, 154, 125, …)` sage tints; `theme-color` in `app.html`; and the PWA manifest. The ruling says cobalt's band moves "everywhere cobalt appears", and a literal copy that stayed behind would be a second lavender or a second sage on the same page. DESK DEFAULT. §3.3 lists them.
3. **`contrast.ts` PALETTE `'lavender'` moved, and one regression pin moved with it.** R20 pins the PALETTE copy to `app.css`, so the copy had to move or gate 4 fails. The pin at `contrast.test.ts`, "captured outline (owned)", then failed at 2.28 against 2.50, which is the controlled result in §5. **It is an exception Dann owned at 2.50:1 on 2026-05-22, and 2.28:1 is a value he has not seen.** DESK DEFAULT: the pin moved to 2.28 with a dated comment, and the note in `contrast.ts` gained one dated sentence rather than a rewrite.
4. **`--fit-accent` is declared nowhere**, so `TextualWitnesses.svelte`, `.measure-link` has always painted its fallback `#8e7e9b`. That is brief §5's trap, found live. It now reads `var(--lavender, #9585a2)`, the same colour through a name that resolves. DESK DEFAULT.
5. **`--lavender` joined the other four bands**, as the brief asked me to decide. It sits after `--cobalt` with `--umber` after it. The pacifier block keeps a one-line pointer saying where `--lavender` went, because the pacifier still uses it as the captured outline. DESK DEFAULT.
6. **Label ink is wired on three documents, not five.** §4 explains why, and §7 marks what the other two inks should paint as NOT ESTABLISHED.

---

## 2. §3 recomputed, and the commit is not refused

Instrument: `scratchpad/recompute.py`, run this session. The desk is `round(0.4 × channel + 0.6 × 255)` per sRGB channel.

**Positive control first.** The formula applied to today's four bands reproduced all four desks in the tree before any edit: `#8B9A7D` gives `#D1D7CB`, `#8E7E9B` gives `#D2CBD7`, `#A67B7B` gives `#DBCACA`, and `#5C739E` gives `#BEC7D8`. Four of four.

| family | ruled band | recomputed desk | brief §3 | result |
|---|---|---|---|---|
| sage | `#839275` | `#CDD3C8` | `#CDD3C8` | agree |
| rose | `#AB7F7F` | `#DDCCCC` | `#DDCCCC` | agree |
| lavender | `#9585A2` | `#D5CEDA` | `#D5CEDA` | agree |
| cobalt | `#748CB9` | `#C7D1E3` | `#C7D1E3` | agree |
| umber | `#A38669` | `#DACFC3` | `#DACFC3` | agree |

**Five of five agree, so the commit is not refused.**

**The twenty values, checked by the same script.** Each was converted back to OKLCH. Every band reads L 0.639 to 0.641, every chip L 0.529 to 0.531, and every ink L 0.419 to 0.421. Each family's hue stays within 2.1° across its three values; rose spreads widest, 17.4° to 19.5°. Chips on white read sage 5.21, rose 5.45, lavender 5.36, cobalt 5.29, and umber 5.32. Inks on cream `#F0EBE0` read 7.02, 7.33, 7.27, 7.12, and 7.22. The floors of 5.21 and 7.02 hold. Rose's band reads chroma 0.055 against the spec's 0.054, which is rounding.

---

## 3. The anchors asserted

**Method.** One script, `scratchpad/stage4_edit.py`, holds 89 anchored edits across 23 files. Each anchor asserts an exact occurrence count against the text as it will stand when that edit runs. The script refuses and writes nothing if any count is off. The dry run held 89 of 89, and then it wrote. The originals are copied under `scratchpad/pre-edit/`. The 24th file, `contrast.test.ts`, was one `Edit` after the gate failure in §5.

**Before the write,** a search over `apps/web/src`, `apps/web/static`, and `packages` for every old hex, including `#8A5C5C`, returned 113 lines (`git grep` on `HEAD`, rerun while writing this memo). A second search for the old values written as `rgb`/`rgba` triples returned 22 more lines, one of them a dated comment. **After the write,** the same search returns 2 lines, both comments that record the old value on purpose: `HeaderBar.svelte`, "Deeper shade of `--lavender` as it stood before stage 4 (#8E7E9B)", and `InsightsPane.svelte`, "it was the literal #8A5C5C". The dated record in `IntakePanel.svelte`, "`.dropzone.dragging` was `rgba(142, 126, 155, 0.12)`", is history and stays.

### 3.1 Declarations, `app.css`

The brief's §1 table was re-read against the tree before editing, and all twelve rows matched.

| token | was | now |
|---|---|---|
| `--sage` | `#8B9A7D` | `#839275` |
| `--rose` | `#A67B7B` | `#AB7F7F` |
| `--cobalt` | `#5C739E` | `#748CB9` |
| `--lavender` | `#8E7E9B`, in the pacifier block | `#9585A2`, with the bands |
| `--umber` | none | `#A38669` |
| `--sage-desk` | `#D1D7CB` | `#CDD3C8` |
| `--lavender-desk` | `#D2CBD7` | `#D5CEDA` |
| `--rose-desk` | `#DBCACA` | `#DDCCCC` |
| `--cobalt-desk` | `#BEC7D8` | `#C7D1E3` |
| `--umber-desk` | none | `#DACFC3` |
| `--sage-chip` | `#6C7A5F` | `#637156` |
| `--rose-chip` | `#9A6A6A` | `#885F60` |
| `--cobalt-chip` | `var(--cobalt)` | `#556C96` |
| `--lavender-chip` | `#806E8E` | `#746580` |
| `--umber-chip` | none | `#82664A` |
| `--sage-ink` | none | `#455238` |
| `--lavender-ink` | none | `#554660` |
| `--rose-ink` | none | `#674141` |
| `--umber-ink` | none | `#61472C` |
| `--cobalt-ink` | none | `#374D75` |

**Names.** `--umber-*` follows stage 3b's family-then-role pattern. DESK DEFAULT: the ink tokens are `--<family>-ink` for the same reason, not `--ink-<family>` beside the neutral `--ink-primary`. Nothing is coined in French.

**Comments that had become false were corrected.** The chip block said Guide's chip "is the band itself" and that "the other three were derived by hand". The desk block's "deeper lavender" and "dusty rose" labels now read "lavender" and "rose". Four new comments were added: one on the five bands and the ramp, one on the desks as not on the ramp, one on the label inks, and one on where `--lavender` went.

### 3.2 Learn, rose to umber: 13 anchors

| # | site | what a singer sees | now |
|---|---|---|---|
| 1 | `HeaderBar.svelte`, `.tab-learn .lang-pill` | the language chip | `var(--umber-chip, #82664A)`, **brief anchor** |
| 2 | `+page.svelte`, `.app-content.tab-learn` | the desk | `var(--umber-desk, #DACFC3)`, **brief anchor** |
| 3 | `HeaderBar.svelte`, `.header-bar.tab-learn` | the header band | `var(--umber, #A38669)` |
| 4 | `HeaderBar.svelte`, `.tab-learn .sigil-version` | the `2026a` badge in the sigil | `var(--umber-chip, #82664A)`, see §6 |
| 5 | `ReadingPaper.svelte`, `.band-learn` | the chapter bands | `var(--umber, #A38669)` |
| 6 | `ReadingPaper.svelte`, `.reading-inner h3` border | the rule over an `h3`; Guide overrides it to cobalt in `+page.svelte` | `var(--umber, #A38669)` |
| 7 | `+page.svelte`, `.main-content.tab-learn` h1 to h4 | Learn's headings | `var(--umber, #A38669)` |
| 8 | `+page.svelte`, `.learn-callout` border | the callout's left rule | `var(--umber, #A38669)` |
| 9 | `+page.svelte`, `.learn-callout::before` | the NOTE, DEPARTURE, METHOD, CONTEXT label | `var(--umber, #A38669)` |
| 10 | `+page.svelte`, `.gt-null` | the dash in the glyph table's empty cells, used only by `LearnContent.svelte` | `var(--umber, #A38669)` |
| 11 | `Drawer.svelte`, `.toc-heading-learn` | LEARN over the table of contents | `var(--umber, #A38669)` |
| 12 | `Drawer.svelte`, base `.toc-link:hover`, `.toc-link.active`, `.toc-link.active:hover` | the table of contents' hover and current-heading marks; `.guide-toc` overrides all three | `var(--umber, #A38669)` and `rgba(163, 134, 105, …)` at the old alphas |
| 13 | `Drawer.svelte`, base `.toc-chevron.contains-active` | the chevron over the open section; `.guide-toc` overrides it | `var(--umber, #A38669)` |

**Insights keeps rose.** Its two brief anchors, `HeaderBar.svelte` `.tab-insights .lang-pill` and `+page.svelte` `.app-content.tab-insights`, take rose's new values. The comment over `.app-content.tab-insights` said "as Learn does"; it now says Learn read rose's desk until stage 4. The comment over `.header-bar.tab-insights` said the same thing in other words, "the rose Learn already carries", and was corrected the same way.

**One rose rule on the reading sheet was deliberately left rose.** `ReadingPaper.svelte`, `.reading-inner a`, colours links. Learn has 0 links and Guide has 6 (`GuideContent.svelte`), so the rule paints only Guide, and the colour story ruling moves Learn and nothing else. It takes rose's new value.

### 3.3 Fallbacks and literal copies, every one moved in the same role

| file | sites | change |
|---|---|---|
| `HeaderBar.svelte` | sage, cobalt, and lavender header bands; four chip fallbacks | new fallback values; cobalt's is now `#556C96` |
| `+page.svelte` | four desk fallbacks; Guide's heading colour and `h3` rule | new values |
| `Drawer.svelte` | `.toc-heading-guide`; `.guide-toc` hover, active, active hover, and chevron; two sage focus outlines | new values, and `rgba(116, 140, 185, …)` for the cobalt tints |
| `ReadingPaper.svelte` | `.band-guide`; blockquote border; four sage tints; links | new values |
| `GuideContent.svelte` | `.about-website a` | `#748CB9` |
| `InstallPrompt.svelte` | 2 sage | `#839275` |
| `Loupe.svelte` | 2 sage | `#839275` |
| `CorrectionSurface.svelte` | 7 lavender | `#9585a2` |
| `TextualWitnesses.svelte` | 1 | `var(--lavender, #9585a2)`, §1 item 4 |
| `SyllableStation.svelte` | the cursor's border and focus outline, bare `#8E7E9B` | `#9585A2` |
| `IntakePanel.svelte` | `.syl-box` border, bare; two sage tints; three comments that quote a current value | `#9585a2`, `rgba(131, 146, 117, …)`, and the comments updated. One comment's ratio was recomputed: the text field's sage border on white is 3.32:1 now, against 2.99:1 before. |
| `WordStack.svelte`, `SearchableSelect.svelte`, `InspectorPanel.svelte` | 1, 2, and 5 sage tints | `rgba(131, 146, 117, …)` at the same alphas |
| `InsightsPane.svelte` | three `TitleHeader` accents, bare; three rose borders; the fit table's rule tint; the file's header comment | `#AB7F7F`, `#ab7f7f`, `rgba(171, 127, 127, 0.35)` |
| `VoiceProfilePane.svelte` | nine accent and hairline props, bare; the watch band's and the withheld block's borders and headings, bare; one fallback | `#9585A2` and `#9585a2` |
| `contrast.ts` | PALETTE `'lavender'`; captured-outline note | `#9585A2`; one dated sentence appended |
| `staff-renderer.ts` | `TURNING_COLOUR`, `WITHHELD_SIGLA.colour`, and the module comment | `#9585A2`. The module's own comment calls these a copy of `--lavender` to "keep in sync with the app token". |
| `staff-renderer.test.ts` | 14 occurrences of `#8E7E9B`; one absence check on `#8B9A7D` | `#9585A2`; `#839275`. Same tests, same count. |
| `app.html` | `theme-color` | `#839275` |
| `static/manifest.webmanifest` | `background_color`, `theme_color` | `#839275`. **690 bytes before and after**, as CONTRACT §6 asks for anything under `static/`. |

**Each file's convention was kept.** A file that wrote its hex in lowercase still does, a bare literal stayed bare, and no literal was turned into a token. The one exception is `TextualWitnesses.svelte`, whose token name was broken.

---

## 4. Label ink, ruling 4 of 4

**Where it paints now, and none of these carries a fallback.** The label-ink sites carry no fallback, so the paint alone proves each name resolves. That answers Code's caveat from stage 3b for these three families. DESK DEFAULT.

- **`TitleHeader.svelte`** gained a `labelInk` prop, defaulting to `var(--sage-ink)`, and set on `.metadata-block` as `style="color: {labelInk}"`. `.metadata-line` no longer sets `color: var(--ink-secondary)` and inherits the ink instead. The placeholder keeps its own `--ink-tertiary`. This follows the file's existing `markAccent` pattern.
- **Text** (`TitlePage.svelte`) takes the default, sage ink.
- **Markup** (`VoiceProfilePane.svelte`, both `TitleHeader`s) passes `labelInk="var(--lavender-ink)"`.
- **Insights** (`InsightsPane.svelte`) passes `labelInk="var(--rose-ink)"`, and `.section-head` is `color: var(--rose-ink)` instead of `#8a5c5c`.

**Two visible consequences the ruling did not spell out.** Insights' metadata line, the composer and identity under the title, was neutral and is now rose ink like its section heads. It follows from "every document's label ink is its own family", and it is named here so Dann is not surprised. On Text and Markup the metadata line moves from `#4A4540` at L 0.394 to an ink at L 0.420, so it gains a family tint at almost the same lightness.

**Learn and Guide: the inks are declared and paint nothing.** The drawing Dann ruled from, `drawing-the-fourth-value_r1_2026-09-13.html`, read this session, draws the label ink on a page head's metadata line: "Reading Russian · 3" for Learn and "Guide · 1" for Guide. **Neither page has that line in the tree.** `ReadingPaper.svelte` renders `LearnContent` and `GuideContent` with no `TitleHeader` and no metadata line (`+page.svelte`, the `ReadingPaper` block). Building a page head would add a new mark on the paper, and that is Dann's call. So `--umber-ink` and `--cobalt-ink` each have 1 occurrence, their declaration. Ruling 4's "every one of them painting" is not met for these two. §7.

**Small-caps labels in a family hue that were NOT given ink, and why.** Markup's `.watch-band-header` and `.withheld-heading` (`VoiceProfilePane.svelte`), and Learn's `.learn-callout::before`, are small-caps labels painted in the band colour. In role they are twins of Insights' `.section-head`, and each fails 4.5 on cream today (Learn's label reads 3.08). Moving them to ink would take each from L 0.64 to L 0.42. **The ruling told Dann that Insights' label ink was "THE ONE VISIBLE CHANGE"**, so these three moved as band colour and stayed band colour. That is the case for him to weigh, not a prohibition.

---

## 5. The umber collision check, and the gates

### 5.1 Collision check: zero

Instrument: `scratchpad/collide.py`, the stage 3b memo's method. It scans 279 `.svelte`, `.ts`, `.css`, `.js`, `.html`, `.mjs`, `.json`, and `.py` files under `apps/web/src` and `packages`, skipping `node_modules`, `dist`, `.svelte-kit`, and `build`. It counts three forms: `--name`, `'name'` quoted, and `name` as a bare word, case-insensitive.

**Run before any edit:**

| name | `--form` | quoted | bare |
|---|---|---|---|
| `umber` | 0 | 0 | 0 |
| `umber-desk` | 0 | 0 | 0 |
| `umber-chip` | 0 | 0 | 0 |
| `umber-ink` | 0 | 0 | 0 |
| `sage-ink` | 0 | 0 | 0 |
| `rose-ink` | 0 | 0 | 0 |
| `lavender-ink` | 0 | 0 | 0 |
| `cobalt-ink` | 0 | 0 | 0 |
| `sage-desk`, **positive control** | 2 | 0 | 0 |

**It returned zero for every new name in all three forms.** The control found its 2, so the instrument reads. The bare pattern excludes a word character on either side, so `number` cannot match `umber`.

**Run after the edits:** `umber-desk` 2, `umber-chip` 3, `umber-ink` 1, `sage-ink` 2, `rose-ink` 5, `lavender-ink` 3, `cobalt-ink` 1, `fit-accent` 0.

### 5.2 Gates

Run as the five commands in `~/Downloads/ilya-ship.sh`, with `NO_COLOR=1`. The script itself was not run.

**Prediction, stated before the run:** all five at baseline. Likeliest failure: gate 4, from a test that pins a hex in a notation the searches missed, or R20 reading the moved `--lavender` line. Second likeliest: gate 3's warning count, from the new inline `style` on `TitleHeader`.

| gate | baseline (`ilya-ship.sh`) | untouched tree | after the 89 edits | after the pin | against prediction |
|---|---|---|---|---|---|
| 1 phonology | 216 passed (216) | 216 passed (216) | 216 passed (216) | **216 passed (216)** | as predicted |
| 2 dictionary | 235 passed (235) | 235 passed (235) | 235 passed (235) | **235 passed (235)** | as predicted |
| 3 web-check | 0 errors and 7 warnings in 4 files | same | same | **same** | as predicted |
| 4 web-test | 1144 passed (1144) | 1144 passed (1144) | **1 failed, 1143 passed (1144)** | **1144 passed (1144)** | the likeliest gate, a different test: a regression pin, not R20 |
| 5 score-parser | 547 passed, 5 skipped (552) | same | same | **same** | as predicted |

**The one failure:** `contrast.test.ts`, "captured outline (owned) is ~2.50:1", received 2.2777. R20 held. The pin moved to 2.28 (§1 item 3), and all five gates then returned to baseline. **No gate number moves, so `ilya-ship.sh:79` needs no edit.**

---

## 6. What the browser showed

**Instrument:** `pnpm --filter @ilya/web dev` in the Browser pane at 1400 × 900, read through `getComputedStyle`. The pane was hidden (`document.visibilityState: hidden`), so every running animation was finished with `Animation.finish()` before each read, as the stage 3b memo records. **Start was not pressed, and no voice profile was created.**

**Tokens on `:root`:** all twenty values and the five desks computed exactly as declared in §3.1. `--terracotta` computes `#AB7F7F`.

**Stated before looking:** each tab's band, chip, and desk paint its family's new values. Learn is umber throughout. Text's metadata line paints rgb(69, 82, 56).

| tab | header band | chip | badge | desk, painted on `.app-content` | label ink |
|---|---|---|---|---|---|
| Transcription | rgb(131, 146, 117) | rgb(99, 113, 86) | rgb(122, 138, 108) | rgb(205, 211, 200) | metadata line rgb(69, 82, 56) |
| Score markup | rgb(149, 133, 162) | rgb(116, 101, 128) | rgb(116, 103, 127) | rgb(213, 206, 218) | metadata line rgb(85, 70, 96) |
| Insights | rgb(171, 127, 127) | rgb(136, 95, 96) | rgb(143, 106, 106) | rgb(221, 204, 204) | metadata line and section head rgb(103, 65, 65) |
| Learn | rgb(163, 134, 105) | rgb(130, 102, 74) | rgb(130, 102, 74) | rgb(218, 207, 195) | none, §4; chapter band and TOC heading rgb(163, 134, 105) |
| Guide | rgb(116, 140, 185) | rgb(85, 108, 150) | rgb(77, 99, 135) | rgb(199, 209, 227) | none, §4; chapter band and TOC heading rgb(116, 140, 185) |

**The instrument lied once, and it was caught before this table.** A second pass read Score markup's desk as sage. Its lookup had found the drawer's **Score markup** band button before the tab, and that button does not change tab. Clicked on the tab itself, the desk painted rgb(213, 206, 218). Every other row matches both passes.

**Observations for the walk, measured and not fixed:**

- **Learn's badge and chip are now one colour**, `--umber-chip`. DESK DEFAULT: no umber badge shade exists, and coining one would be taste. The other badges are hand-picked shades, not ramp values, and did not move: `#8F6A6A` (Insights), `#4D6387` (Guide), `#74677F` (Markup), and `--sage-deep` (Text).
- **Markup's badge `#74677F` and its new chip `#746580` differ by a contrast ratio of 1.02**, which is indistinguishable. They sit side by side in the header.
- **White text on the chapter bands drops.** `.chapter-band` paints `#fdfbf6`. On Guide's cobalt band it goes from 4.61 to 3.28, and on Learn from 3.54 on rose to 3.29 on umber. The 40 px titles clear 3:1. The 10 px kickers, "Section 1" and so on, sit under 4.5. This is the visible cost of ruling 1 on cobalt, which Dann accepted.
- **Guide's pill still draws its hairline.** It was drawn because the chip was the band, and the chip now has its own value. The rule was left as it was.
- **Learn's glyph table keeps two rose tints**, `#F0D8D8` and `#C28888`: `.gt-hi` in `+page.svelte` and in `LearnContent.svelte`'s style block. They are hand-picked and not among the twenty, so they were not re-derived. On an umber Learn they will read rose.
- **The installed app's splash and status bar** take `#839275` from the manifest and `theme-color`. Not observed on a device.

---

## 7. WHAT I COULD NOT ESTABLISH

- **What `--umber-ink` and `--cobalt-ink` paint.** Ruling 4 names umber ink for Learn and cobalt ink for Guide. The drawing places both on a page-head metadata line that neither page has in the tree. Both tokens are declared and paint nothing. **NOT ESTABLISHED.**
- **Brief §6's three unseen items, painted.** The `--stone-700` merge (the loupe's frame, the `ё` badge, hovered provenance icons), the note picker on `--ink-stave`, and the update toast's `--stone-300` border. None was reached in this session's browser. The note picker needs **Start**, which creates a voice profile, and was not pressed. **NOT ESTABLISHED;** this remains Dann's walk.
- **The renderer's lavender on a drawn score.** Gate 5 proves the renderer emits `#9585A2`. No score was loaded in the browser, so the turning layer and the withheld sigla were not seen painted. **NOT ESTABLISHED.**
- **How the pacifier's captured ring reads at 2.28:1.** Computed only. The ring appears inside calibration, which was not entered. **NOT ESTABLISHED.**
- **Whether any literal copy of a family value was missed.** The searches covered hex in any case and `rgb`/`rgba` triples with the exact channel values, over `apps/web/src`, `apps/web/static/manifest.webmanifest`, and `packages`. They would not find a value written as `hsl()`, as `color-mix()`, or in another file under `static/`. **NOT ESTABLISHED.**
- **Old values and names in `docs/`.** Not searched and not edited.
- **Print.** No print preview was taken. The metadata line's new ink and Learn's umber are unobserved on paper.

**NOT ESTABLISHED beats a complete invented answer.**

---

## 8. Every file touched

1. `apps/web/src/app.css`
2. `apps/web/src/app.html`
3. `apps/web/src/lib/components/Drawer/Drawer.svelte`
4. `apps/web/src/lib/components/Drawer/InspectorPanel.svelte`
5. `apps/web/src/lib/components/Drawer/IntakePanel.svelte`
6. `apps/web/src/lib/components/Drawer/SearchableSelect.svelte`
7. `apps/web/src/lib/components/HeaderBar.svelte`
8. `apps/web/src/lib/components/InstallPrompt.svelte`
9. `apps/web/src/lib/components/Paper/ReadingPaper.svelte`
10. `apps/web/src/lib/components/Paper/TitleHeader.svelte`
11. `apps/web/src/lib/components/Paper/WordStack.svelte`
12. `apps/web/src/lib/components/Reading/GuideContent.svelte`
13. `apps/web/src/lib/shane/CorrectionSurface.svelte`
14. `apps/web/src/lib/shane/InsightsPane.svelte`
15. `apps/web/src/lib/shane/Loupe.svelte`
16. `apps/web/src/lib/shane/SyllableStation.svelte`
17. `apps/web/src/lib/shane/TextualWitnesses.svelte`
18. `apps/web/src/lib/shane/VoiceProfilePane.svelte`
19. `apps/web/src/lib/shane/pacifier/contrast.test.ts`
20. `apps/web/src/lib/shane/pacifier/contrast.ts`
21. `apps/web/src/routes/+page.svelte`
22. `apps/web/static/manifest.webmanifest`
23. `packages/score-parser/src/staff-renderer.test.ts`
24. `packages/score-parser/src/staff-renderer.ts`

`git diff --stat`: 24 files, 205 insertions, 159 deletions. This memo is new and **needs a `git add` before a ship**, or `ilya-ship.sh` refuses on an untracked file.
