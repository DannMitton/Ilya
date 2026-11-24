# Brief: the dash row, the VOIX comment, and seating two ratified GUIDE paragraphs (Code, cloud lane), r1

Written by the desk (Opus 5), 2026-11-23 23:5x. **NOT SENT. Fable review owed** (`CONTRACT.md` section 1 item 19).

Three small owed items in one lane. None of them is a design question and nothing in it is Dann's, except one deletion held back at the end.

## The search this brief owes, and what it returned

`CONTRACT.md` section 4. Every site below was read from the tree on `93edb360` by the desk. The search was for `PLACEHOLDER_DASH`, `stroke-dasharray`, `placeholder.line`, and the GUIDE anchors.

**What it found that changes the work:** `apps/web/src/lib/insights/SingerBlock.svelte:150` draws a dashed placeholder ring on INSIGHTS. **So "hollow or dashed" stays true of INSIGHTS after this lane, and only MELODY's four lines change.** The two string families are already separate: `placeholder.line.*` at `i18n.ts:2048-2052` is INSIGHTS' and is untouched; `placeholder.line.markup.*` at `:2056-2059` is MELODY's.

## Item 1. MELODY's crossing squircle is drawn solid

**Why.** Dann's standing rule of 2026-11-18: where his words and the build differ, the desk changes the build to make his words true. He wrote MELODY's line to read `drawn hollow`. `OPEN.md`, MELODY'S CROSSING SQUIRCLE LOSES ITS DASH.

**The sites, each read this session:**

- `apps/web/src/lib/score/crossing-ring.ts:72-76`. The placeholder branch emits two attributes. **Remove `['stroke-dasharray', PLACEHOLDER_DASH]`. Keep `['data-placeholder', 'true']`**, because the loupe and the ink survey read it. The import at `:40` loses `PLACEHOLDER_DASH` if nothing else in the file uses it.
- `apps/web/src/lib/score/crossing-ring.ts:34-35`. The file's own header says a crossing resting on a placeholder fR1 is dashed. It is a claim about the code and it becomes false. Rewrite it.
- `apps/web/src/lib/score/crossing-ring.test.ts:47`. The pin asserts `dashed['stroke-dasharray']` equals `PLACEHOLDER_DASH`. **It becomes an assertion that no `stroke-dasharray` is emitted**, and the `data-placeholder` pin on the next line stays as it is.
- `packages/score-parser/src/placeholder-mark.ts`, two claims in its header. **Lines 10 to 12**: "Markup's line names the vowels and says 'Findings that rest on a placeholder are drawn hollow or dashed', and these are the two ways." **Lines 26 to 27**: "A stroked mark that is not a notehead, the crossing squircle, keeps its dash." Both are now false of MELODY. Rewrite them, and say in the header that INSIGHTS still dashes.

**Report, do not change:** after this, is anything still drawn with `PLACEHOLDER_DASH`? `packages/score-parser/src/index.ts` exports it and `placeholder-mark.test.ts` pins it. If nothing draws with it any more, say so and leave it; a dead export is the audit's tier 1 work, not this lane's.

**The done-when is a look at the page, not a reading of the source** (`CONTRACT.md` section 0.3). On «Средь шумного бала» with a placeholder fR1, the crossing squircle renders with no dash, and nothing else on MELODY changes.

## Item 2. One comment that is now false

`apps/web/src/lib/i18n.ts:155-158` ends: "and the French « Voix » is a desk proposal awaiting Dann's ratification." **He ratified it on 2026-11-23 at 22:10**, transcribed as written: *"Yes, I ratify « VOIX » as it stands."* Rewrite that clause to record the ratification and its date. The key, the English, and the French all stay exactly as they are. Comment only, no behaviour.

## Item 3. Seat the two ratified GUIDE resonance paragraphs

Both are ratified in English and in French: `../sessions/draft-french-guide-resonance_r2_2026-11-23.md`, English 2026-11-22 21:44, French 22:16 and 22:28. **Take the text from that file, not from this brief.**

**Paragraph 1, "How Ilya reads your vowel" / « Comment *Ilya* lit votre voyelle ».** Seat it as its own `h4` beside the voice-characteristics heading: French at `GuideContent.svelte:83` (`guide-markup-characteristics`), English at `:389`. **DESK DEFAULT on the placement**, which the draft left open between Reference and About Ilya: it goes beside the characteristics heading, because that is where what Ilya hears in a voice is already explained. Dann's to overrule.

**Paragraph 2, "The method is published work" / « La méthode provient de travaux publiés ».** Into Licences and acknowledgements, `GuideContent.svelte:290` (`guide-licences`) and its English counterpart.

**Pin all four passages** in `apps/web/src/lib/insights/ratified-lines.test.ts`, as the ratified Guide lines there are already pinned; that test reads `GuideContent.svelte` as text and splits it at `{#if language === 'fr'}`, so a pin must land on the right side of that split. **Keep the literal characters, not escapes**, and keep *Ilya* in italics in the French, as the house form already is in that file.

## Held back, and it is the one thing Dann has not ruled

**The four MELODY strings at `i18n.ts:2056-2059` do NOT change in this lane.** Their English ends "drawn hollow or dashed" and their French ends « tracés évidés ou en pointillé ». Item 1 makes the "or dashed" half false of MELODY, so both languages need the clause cut. **The English cut follows from his ruling; the French cut is French, and nothing French reaches the tree until he rules it** (`CONTRACT.md` section 7). Cutting the English alone would leave the two languages saying different things about the same page, which is worse than leaving both. **So all four strings ride in the next wording lane, after he rules the two French words.** This lane leaves them alone and the report says so.

## The lane

A cloud lane on its own branch, cut from `Shane`. The branch is created by Dann before the prompt is sent. One commit per item with its own report. Push to that branch only; never `Shane`, never `main`. Dann merges. **Stage by explicit path; never `git add -A` and never `git add .`**

**Model and cost.** Sonnet. **Cap 200,000 tokens**, quoted at the measured range for a small multi-site string and comment lane.

## Done when

All eight gates at baseline, with any count change named: gate 4 `6804 passed | 1 skipped (6805)` and gate 5 `911 passed | 5 skipped (916)` as of `93edb360`, both measured on Dann's Mac. No ratchet ceiling raised. The rendered MELODY page shows the squircle undashed. The four GUIDE passages read back identical to the ratified file, checked by hash and not by eye.

## What this lane must not do

Change no string at `i18n.ts:2048-2052` or `:2056-2059`. Touch no INSIGHTS placeholder drawing. Delete no export. Create no `.bak` file. Touch nothing under `docs/memory/`.

## What you could not establish

Carry a section with that heading. **NOT ESTABLISHED beats a complete invented answer.**

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks.
