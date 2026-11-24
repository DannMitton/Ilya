# Brief: the VOIX comment, the GUIDE seating, and one ratified string pair (Code, cloud lane), r4

Written by the desk (Opus 5), 2026-11-24 00:4x. **r4 strikes two of r3's five items on Dann's ruling of 2026-11-24 00:37.** r1 to r3 are superseded and kept. Fable's review of r2 (`review-fable-lane85-as-built-and-brief-dash-voix-guide-r2_r1_2026-11-24.md`, two blockers and ten amendments) is applied in full; its blocker 2 and four of its amendments concerned the struck items and fall away with them.

**Three items. Nothing in it is owed to Dann.** Every string it changes he has already ratified, in both languages.

## What was struck, and why, so no later desk rebuilds it

r3's item 1 made MELODY's crossing squircle solid, and r3's item 4 cut "or dashed" from the four `placeholder.line.markup.*` strings. **Both are struck.** Dann ruled on 2026-11-24 at 00:33 that a dashed squircle means verification is necessary, and at 00:37, transcribed as written: *"Functionally I see \"rests on a stand in\" as then same basic gesture as \"verify this\"? It's a good correspindence."* A crossing resting on a stand-in resonance is a value he has not verified by singing it, **so the dash is correct usage and the sentence "drawn hollow or dashed" is already true of the build.** `OPEN.md`, MELODY'S CROSSING SQUIRCLE KEEPS ITS DASH.

**Nothing about the dash is built, and `placeholder-mark.ts`'s header claim that the crossing squircle keeps its dash stays as it is.**

## The search this brief owes, and what it returned

`CONTRACT.md` section 4. Every site was read from the tree by the desk on `ac52a225`.

**Ilya already photographs part of itself**: two approval folders, a golden snapshot for the INSIGHTS adapter, a byte baseline for MELODY's strophic pages, and thirty tracked `.svg` files. None pins the strings or the passages this lane touches, and `cloud-lane-86`'s step 0b read them all and said the same.

**One correction carried from r2, which had it wrong three times.** INSIGHTS' own four strings at `i18n.ts:2048`, `:2049`, `:2051`, `:2052` end "drawn dashed" and « tracés en pointillé », not "hollow or dashed". Both families are correct as they stand and **neither changes in this lane, apart from item 3's two keys.**

## Item 1. One comment that is now false

`apps/web/src/lib/i18n.ts`, the comment ending "and the French « Voix » is a desk proposal awaiting Dann's ratification." **He ratified it on 2026-11-23 at 22:10**, transcribed as written: *"Yes, I ratify « VOIX » as it stands."*, captured in `INBOX.md` under that time, and `OWED.md`'s entry is closed. Rewrite the clause to record the ratification and its date. The key, the English, and the French all stay. **Comment only, no behaviour.**

## Item 2. Seat the two ratified GUIDE resonance paragraphs

Text from `../sessions/draft-french-guide-resonance_r2_2026-11-23.md`, never from this brief.

**NOT as an `h4`.** Every `h4` in that section is wired to the drawer's contents: a hard-coded id list at `Drawer.svelte:282`, a button per heading at `:759-760`, and a `toc.guide.*` key in two languages at `i18n.ts:2517-2519`. A new heading would need a new French contents label nobody has ruled, and `Drawer.svelte` stands at 1,986 lines against a ceiling of 1,990.

**Seat each as `<p id="…"><strong>lead.</strong> body</p>`**, the form the ratified text already has and the form Licences already uses (`GuideContent.svelte:296`, `:602`). No Drawer change, no new string, no contents entry.

**Ids, each confirmed unused before it is written:** `guide-markup-how-ilya-reads` for paragraph 1, `guide-licences-method` for paragraph 2.

**Positions.** Paragraph 1 goes immediately after the paragraph that ends the voice-characteristics passage, in both languages, French under `guide-markup-characteristics` and English under its counterpart. Paragraph 2 goes into Licences and acknowledgements, French under `guide-licences` and English under its own heading, after the paragraph naming the existing method credits. **Name both neighbours of each, in the report.**

**Typography, DESK DEFAULT.** The draft says every apostrophe is U+2019; its English paragraph 2 holds U+0027 in "Ilya's". **Seat U+2019 throughout**, as the English Guide already does, and **italicize *Ilya* in the English too**, as `GuideContent.svelte:399`, `:600`, and `:602` already do. The words do not change.

**Pin all four passages** in `apps/web/src/lib/insights/ratified-lines.test.ts`, as the Guide lines there are pinned. That test splits the file at `{#if language === 'fr'}` and finds a passage by its `<p id="…">`, so each pin names its id and lands on the right side of the split. **The comparison basis:** the seated text with its tags stripped equals the draft's paragraph with its markdown markers stripped, after the apostrophe decision above. The existing pin already strips `<em>`.

**The dates.** Paragraph 2: English ratified 2026-11-22 21:44, French 2026-11-23 22:16. **Paragraph 1: Dann rewrote it himself and ratified both languages on 2026-11-23 at 22:28.**

## Item 3. A ratified change that was never built

`INBOX.md:931`, **2026-11-20 00:33**: Dann ratified, in both languages, that `placeholder.line.belowCore` and `placeholder.line.belowCoreOne` lose "through the DRAWER on the left" for **"in VOICE"** and **« dans VOIX »**, to ride in the wording lane. **At `ac52a225` both still say DRAWER and « TIROIR de gauche »** (`i18n.ts:2051-2052`), and no wording brief has carried it (`CONTRACT.md` section 1 item 20).

**Build it, those two keys only, in his words, with their pins.** **NOT ESTABLISHED and the lane does not decide it:** whether MELODY's twins at `:2058-2059`, which carry the same DRAWER phrase, follow. Report it; the desk rules on the report.

## The lane

A cloud lane on its own branch, cut from `Shane` at `ac52a225`, which already carries lane 85's merge. **The branch is created by Dann before the prompt is sent**, because the Code branch picker lists only branches that exist (`ENVIRONMENT.md`, THE CODE BRANCH PICKER DOES NOT CREATE BRANCHES).

**First git commands, in this order and no others:** `git fetch origin`, then `git checkout -B <lane> origin/Shane`. **Do not use `git reset --hard`** (`ENVIRONMENT.md`, A CLOUD LANE STALLS ON ITS OWN BASE BRANCH).

**One commit per item, and ONE report with a section per item.** Push to that branch only; never `Shane`, never `main`. Dann merges. **Stage by explicit path; never `git add -A` and never `git add .`**

**Model and cost.** Sonnet. **Cap 200,000 tokens**, quoted at the measured range for a small string, comment, and seating lane.

## Done when

All eight gates at baseline except gate 4, **which rises because items 2 and 3 add pins**; name the new figure. Gate 5 at `911 passed | 5 skipped (916)`. No ratchet ceiling raised. The four GUIDE passages read back equal to the ratified draft on the stated basis.

## What this lane must not do

Change no string at `i18n.ts:2048`, `:2049`, `:2056-2059`, or the wording of `:2051-2052` beyond item 3's DRAWER phrase. **Touch no crossing squircle, no dash, and no placeholder drawing anywhere.** Change no committed approval or golden file. Create no `.bak` file. Touch nothing under `docs/memory/`.

## What you could not establish

Carry a section with that heading. **NOT ESTABLISHED beats a complete invented answer.**

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks.
