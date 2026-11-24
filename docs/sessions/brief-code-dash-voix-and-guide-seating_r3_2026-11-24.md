# Brief: the dash row, the VOIX comment, the GUIDE seating, and two string rulings (Code, cloud lane), r3

Written by the desk (Opus 5), 2026-11-24 00:3x. **r3 applies both blockers and all ten amendments of `review-fable-lane85-as-built-and-brief-dash-voix-guide-r2_r1_2026-11-24.md`**, Job 2, DO NOT SEND. r1 and r2 are superseded and kept.

Five items. **Nothing in it is owed to Dann**: every string it changes he has ruled, in both languages. **One item is a DESK DEFAULT that is his to overrule, and it is labelled as such below.**

## The search this brief owes, and what it returned

`CONTRACT.md` section 4. Every site was read from the tree by the desk, on `93edb360` or on the merge `021943563e`.

**Ilya already photographs part of itself**: two approval folders, a golden snapshot for the INSIGHTS adapter, a byte baseline for MELODY's strophic pages, and thirty tracked `.svg` files. None of them pins the strings or the drawing this lane changes, and `cloud-lane-86`'s step 0b read them in full and reached the same conclusion.

**One claim in r2 was wrong and r3 corrects it.** r2 said three times that "hollow or dashed" stays true of INSIGHTS. **It does not: INSIGHTS' own four strings already end "drawn dashed" and « tracés en pointillé »** (`i18n.ts:2048`, `:2049`, `:2051`, `:2052`, pinned at `lane68-strings.test.ts:16-17`). The instruction not to touch that family stands; its reason is that INSIGHTS keeps dashing and its wording is already correct, not that its wording says "hollow or dashed".

## Item 1. MELODY's crossing squircle is drawn solid. **DESK DEFAULT, Dann's to overrule**

**Its status, stated plainly because r2 got this wrong.** His recorded ask was a wording cut. This item turns that into a change in what MELODY draws **and prints**, since the ring prints as it shows (`crossing-ring.ts:37-38`). `OPEN.md:4515` and `:4523` record it as a DESK DEFAULT under his standing rule of 2026-11-18, his to overrule. **He was given the one line that rule requires, on 2026-11-24 at 00:1x**: a crossing resting on a stand-in will be marked by its hollow turning head alone.

**THE SAFETY QUESTION IS CLOSED, and the desk read the code rather than leaving it open.** Fable asked whether every placeholder crossing has a hollow turning head beside it; if some did not, those crossings would carry no sign of resting on a stand-in and Dann's ruling quoted at `placeholder-mark.ts:2-4` would stop being met. **Every analysed event carries `turningPitch`, which is not optional** (`analysis-types.ts:193`); **the renderer draws that head whenever an analysis exists, with no suppressing condition** (`staff-renderer.ts:2927`, `if (a) {`); and `placeholderMark(a.placeholder, …)` makes it hollow exactly when `overlay-engine.ts:231` set `placeholder` from a surrogate fR1. `crossing` sits on the same event (`analysis-types.ts:195`). **So the hollow head is always there.**

**The change.** `apps/web/src/lib/score/crossing-ring.ts`, the placeholder branch: drop `['stroke-dasharray', PLACEHOLDER_DASH]`, keep `['data-placeholder', 'true']`, which the loupe and the ink survey read. Drop the now-unused `PLACEHOLDER_DASH` import in that file.

**Every claim that becomes false. Find each by its words, not by a line number**, because two of r2's numbers were already stale:

- `crossing-ring.ts`, its header sentence that a crossing resting on a placeholder fR1 is dashed.
- `crossing-ring.test.ts`, the test title "is solid on a sung vowel and dashed on a placeholder", the variable named `dashed`, the `PLACEHOLDER_DASH` import, and the assertion that a dasharray is emitted. **The `data-placeholder` assertion stays.** Replace the dasharray assertion with one that no `stroke-dasharray` is emitted.
- `packages/score-parser/src/placeholder-mark.ts`, two claims: that MELODY's line says "hollow or dashed" and "these are the two ways", and that the crossing squircle keeps its dash. Say in the rewritten header that INSIGHTS still dashes and MELODY no longer does.
- `packages/score-parser/src/analysis-types.ts`, "The renderer draws the marks that rest on it dashed".

**Report, do not change:** after this, `PLACEHOLDER_DASH` is still read in the `'stroke'` branch of `placeholderMark` (`placeholder-mark.ts:79`), which no non-test caller selects. Say so; a dead branch is the audit's tier 1 work.

**The done-when, repaired. r2's version passed on the unchanged build.** `OPEN.md:4519` records the desk's own look at «Средь шумного бала», which found two crossings, both already solid and no dasharray anywhere on the page. So:

1. **Before the change**, find and name a voice and song state that draws at least one `[data-crossing-ring][data-placeholder="true"]` carrying `stroke-dasharray`. A crossing is dashed only when its note's vowel reads `'surrogate'` (`overlay-engine.ts:231`) and that note crosses (`MarkupPane.svelte:408`).
2. **After the change**, the same count of `[data-crossing-ring][data-placeholder="true"]`, and zero `stroke-dasharray` inside `.markup-paper-container`.
3. **If no state can be found that draws a dashed crossing, the lane stops and reports that**, and does not claim the done-when met.

**Who looks.** If the lane can reach a page through Playwright, it does both measurements and says so. If it cannot, **it does the code change and the counts in tests only, and the rendered look is the desk's after the merge**; the report says which happened. Lane 85 ran no page.

## Item 2. One comment that is now false

`apps/web/src/lib/i18n.ts`, the comment ending "and the French « Voix » is a desk proposal awaiting Dann's ratification." **He ratified it on 2026-11-23 at 22:10**, transcribed as written: *"Yes, I ratify « VOIX » as it stands."* That capture is in `INBOX.md` under that time, and `OWED.md`'s entry is closed. Rewrite the clause to record the ratification and its date. The key, the English, and the French all stay. Comment only, no behaviour.

## Item 3. Seat the two ratified GUIDE resonance paragraphs

Text from `../sessions/draft-french-guide-resonance_r2_2026-11-23.md`, never from this brief.

**NOT as an `h4`.** Every `h4` in that section is wired to the drawer's contents: a hard-coded id list at `Drawer.svelte:282`, a button per heading at `:759-760`, and a `toc.guide.*` key in two languages at `i18n.ts:2517-2519`. A new heading would need a new French contents label, which is French and which nobody has ruled, and `Drawer.svelte` stands at 1,986 lines against a ceiling of 1,990.

**Seat each as `<p id="…"><strong>lead.</strong> body</p>`**, which is the form the ratified text already has and the form Licences already uses (`GuideContent.svelte:296`, `:602`). No Drawer change, no new string, no contents entry.

**Ids, and the lane confirms each is unused before it writes it:** `guide-markup-how-ilya-reads` for paragraph 1, `guide-licences-method` for paragraph 2.

**Positions.** Paragraph 1 goes immediately after the paragraph that ends the voice-characteristics passage, in both languages, French under `guide-markup-characteristics` and English under its counterpart; name in the report the element it follows and the one it precedes. Paragraph 2 goes into Licences and acknowledgements, French under `guide-licences` and English under its own heading, after the paragraph naming the existing method credits; name both neighbours.

**Typography, DESK DEFAULT.** The draft says every apostrophe is U+2019; its English paragraph 2 holds U+0027 in "Ilya's". **Seat U+2019 throughout**, as the English Guide already does, and **italicize *Ilya* in the English too**, as `GuideContent.svelte:399`, `:600`, and `:602` already do. The words do not change.

**Pin all four passages** in `apps/web/src/lib/insights/ratified-lines.test.ts`, as the Guide lines there are pinned. That test splits the file at `{#if language === 'fr'}` and finds a passage by its `<p id="…">`, so each pin names its id and lands on the right side of the split. **The comparison basis:** the seated text with its tags stripped equals the draft's paragraph with its markdown markers stripped, after the apostrophe decision above. The existing pin already strips `<em>`.

**The dates, corrected.** Paragraph 2: English ratified 2026-11-22 21:44, French 2026-11-23 22:16. **Paragraph 1: Dann rewrote it himself and ratified both languages on 2026-11-23, at 22:28.** r2 carried paragraph 2's date for both.

## Item 4. The four MELODY placeholder strings, both languages

**He has ruled both.** The French is his, `INBOX.md:997`, 2026-11-22 14:52: **« Les constats qui en dépendent sont tracés évidés. »**, the clause already cut. **The English is his ruling of 2026-11-22 12:48, whose words were never transcribed**; `OPEN.md:4517` and `:4529` record that gap, and only the desk's paraphrase is on file. His 14:52 French corroborates it, being the French of that English. **The brief states it that way rather than citing a standing rule as a source for a string, which r2 wrongly did.**

**The sites, `placeholder.line.markup.*`.** `i18n.ts:2056` and `:2057` write the French with literal accents; **`:2058` and `:2059` write it in `é`-style escapes**, so a search for the literal French finds two of the four. Find all four by key.

- English: "…are drawn hollow or dashed." becomes "…are drawn hollow." The singular at `:2057` reads "Findings that rest on it are drawn hollow or dashed." and loses the same two words.
- French: « … sont tracés évidés ou en pointillé. » becomes « … sont tracés évidés. »

**Pins to move:** `analysis/placeholder-line.test.ts:54`, `:59`, `:64`, `:69`, `:100`, `:101`, and `lane68-strings.test.ts:18-19`, which builds its expectation from `INS_EN` and `INS_FR`. **Test titles that become false:** `placeholder-line.test.ts:52` and `:98`. **Comments that become false:** `analysis/placeholder-line.ts:61` and `melody/MarkupPane.svelte:730`.

**`placeholder.line.*` at `i18n.ts:2048-2052` keeps its wording**, because INSIGHTS still dashes and those strings already say so.

## Item 5. A ratified change that was never built, carried here

`INBOX.md:931`, **2026-11-20 00:33**: Dann ratified, in both languages, that `placeholder.line.belowCore` and `placeholder.line.belowCoreOne` lose "through the DRAWER on the left" for **"in VOICE"** and **« dans VOIX »**, to ride in the wording lane. **At `93edb360` both still say DRAWER and « TIROIR de gauche »** (`i18n.ts:2051-2052`), and no wording brief has carried it. r2's "change no string at `:2048-2052`" would have read as a ruling against it, which is how a ratified ask gets lost (`CONTRACT.md` section 1 item 20).

**Build it here**, those two keys only, in his words, with their pins. **NOT ESTABLISHED and the lane does not decide it:** whether MELODY's twins at `:2058-2059`, which carry the same DRAWER phrase, follow. Report it; the desk rules on the report.

## The lane

A cloud lane on its own branch, cut from `Shane` after `ac52a225`, which already carries lane 85's merge. The branch is created by Dann before the prompt is sent. **One commit per item, and ONE report with a section per item.** Push to that branch only; never `Shane`, never `main`. Dann merges. **Stage by explicit path; never `git add -A` and never `git add .`**

**Model and cost.** Sonnet. **Cap 250,000 tokens.**

## Done when

All eight gates at baseline except gate 4, **which rises because items 3 and 5 add pins**; name the new figure. Gate 5 at `911 passed | 5 skipped (916)`. No ratchet ceiling raised. Item 1's before-and-after as section 1 above defines it. The four GUIDE passages read back equal to the ratified draft on the stated basis.

## What this lane must not do

Change no string at `i18n.ts:2048`, `:2049`, or the wording of `:2051-2052` beyond item 5's DRAWER phrase. Touch no INSIGHTS drawing. Delete no export. Change no committed approval or golden file. Create no `.bak` file. Touch nothing under `docs/memory/`.

## What you could not establish

Carry a section with that heading. **NOT ESTABLISHED beats a complete invented answer.** Two the desk already knows: how often a singer meets a dashed crossing, and whether a cloud lane can render MELODY with a voice that draws one.

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks.
