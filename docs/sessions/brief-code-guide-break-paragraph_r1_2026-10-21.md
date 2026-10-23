# Brief for Code: seat the Guide paragraph on the # break (QUEUE row 139, its Guide line), r1, 2026-10-21

DRAFT r1, NOT YET FABLE-REVIEWED. Not to be sent to Code until Fable has reviewed it (`CONTRACT.md` section 1, item 19; Fable's weekly limit resets Sunday 2026-10-25 05:00) and Dann says send. Written by the Sonnet desk of 2026-10-21 (13:3x); it travels to Fable with `brief-code-n194-loupe-break-button_r4_2026-10-21.md` (r4 replaced r3 on 2026-10-21; its current md5 is in `QUEUE.md` row 152).

For Code in a cloud session, Sonnet, on the lane that carries batch C and N.194 r3, AFTER both have shipped. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code carries a `path:line` the desk read on 2026-10-21, or says NOT ESTABLISHED or NOT READ. One commit on the lane; no pull request; no other branch; no `git add` of anything outside the files named in section 2.

## 0. Why this waits for batch C and r3

The paragraph says "you place it after the IPA for the last syllable of a word" and that a syntactic break stops regressive voicing assimilation. Both are true only once batch C's B3 (a typed # sets a hard boundary and is grafted after its parent syllable) and N.194 (the Loupe button) are on the lane. Seated earlier, the Guide describes behaviour the app does not have. If B3 is not on the lane, stop and report; do not seat the paragraph.

## 1. The text, and where it lives

The text to seat is the final section of `docs/sessions/ratified-guide-break-paragraph_2026-10-21.md` (md5 `914620c152e11c549fbf257d64d8711f`), headed "RATIFIED 2026-10-21 02:12, both languages (the text to seat)", subsections "English" and "French". Dann ratified it: English 01:52, amended through 02:11; French 02:12. Copy it from that file by script or by selection; do not retype it. Russian words stay in `<em>`. The French carries `&#160;` before each colon and U+2019 apostrophes.

## 2. The change

1. `apps/web/src/lib/components/Reading/GuideContent.svelte:380` (English) and `:84` (French): replace the whole `<p>` on each line with a `<p>` holding the ratified paragraph. Those two lines are today the only occurrences in `apps/web/src/lib` of "A phonation break is written" and "Une rupture de phonation s" (grep, 2026-10-21). The new paragraph drops the `<strong>` around `[#]` that the old one carried, because the ratified text has none. DESK DEFAULT, Dann's to wave off.
2. A pin in `apps/web/src/lib/insights/ratified-lines.test.ts`, in the style of the row 123 block at `:146-185`: read `GuideContent.svelte` as source, split on `{#if language === 'fr'}` and `{:else}`, decode `&#160;`, and assert that `en` contains the English paragraph and `fr` the French. Dann's ruling for this paragraph: the pins carry the literal characters, not escapes (ratified file, "Seating"). Add two negative assertions: `en` no longer contains "A phonation break is written" and `fr` no longer contains "Une rupture de phonation s'écrit".

Touch no other file. If any other test fails, report it; do not edit it to pass.

## 3. Other sites that name the same thing

`phonation break` also appears in `apps/web/src/lib/score/Loupe.svelte` and `apps/web/src/lib/score/loupe-ink.ts` (grep of `apps/web/src`, 2026-10-21; READ by the desk 2026-10-21 21:2x: `Loupe.svelte:1070` and `:1078` and `loupe-ink.ts:219` are code comments about analysis layers and ink, and none quotes the retired Guide sentence or the "junction" claim; a grep of `apps/web/src` for "junction of the two notes" finds only `GuideContent.svelte:380`, the English paragraph this brief replaces. Run the same grep after your change and report the count. Change nothing in the Loupe files. This brief changes no computation, so it omits the cross-site line `CONTRACT.md` section 4 asks of computation briefs.

## 4. Gates

Run the eight gates the ship script runs and report each against its baseline at the start (gate 4 and gate 5 baselines move with batch C and r3; read them from the ship script's gate lines before you edit). Six test files read `GuideContent.svelte`: `apps/web/src/lib/insights/ratified-lines.test.ts`, `sources.test.ts`, `french-italics.test.ts`, `no-fit-name.test.ts`, `i18n.test.ts`, and `components/footer-credit.test.ts` (grep, 2026-10-21). Run these six by name first and report each result. Gate 5 and the `+page.svelte` ceiling are untouched by this change; confirm by the gate output.

## 5. Return memo

`docs/sessions/report-code-guide-break-paragraph_r1_2026-10-21.md`: files changed with `path:line`; the new tests and the proof each fails on the unchanged file; the eight gates before and after; the section 3 findings; a section "What I could not establish".

## 6. Cost and order

Code on a cloud lane, Sonnet: DESK ESTIMATE 30k to 80k tokens, a range, worst case 120k, one commit. Fable's review of this brief alone: DESK ESTIMATE 40k to 100k, a range; the last reviews cost 137,554 and 175k, so quote the worst case as 150k. Sent with r3's review, the two reviews together are worst case about 350k. Order: batch C, then N.194 r4, then this.

## 7. Not in this brief

The French of the pill's label (Dann's); the one-line statement of purpose; whether the Guide says how to place a # by typing it after the word in Lyrics (owed to Dann; the ratified paragraph does not say); any change to the engine, the Loupe, or `phonationBreak`.

## 8. The two routes for placing a # (RATIFIED, both languages; added 2026-10-21 13:5x)

`draft-guide-break-how-to-place_r1_2026-10-21.md` holds the text, ratified by Dann: English 2026-10-21 13:52, French 13:54. It replaces the fifth and sixth sentences of the paragraph in `ratified-guide-break-paragraph_2026-10-21.md` (the two routes for placing a #, in place of "you place it after the IPA ... It is written [#] on the IPA line"). Seat the paragraph's first four sentences from the ratified file and the replacement sentences from the draft file, in both languages. Wrap the two button names as `<span class="guide-key">` (ruled by Dann 2026-10-21 13:52, replacing bold). Add the `guide-key` style (below). Add one test in `ratified-lines.test.ts` that reads the two labels from `i18n.ts` (the break's two keys are named in N.194 r4; the `loupe.place.*` family sits at `i18n.ts:479-485`) and asserts that the Guide contains each string in each language.

Before seating the sentence about "select a note, open Syllables": read the Loupe and report the order in which a singer reaches the button. If it differs from the order below, stop and report; do not seat a sentence that describes the wrong path. The order is READ by the desk 2026-10-21 21:2x (read, not run): the Loupe opens only from a tap on a note on Markup, which sets the cursor to that note and then sets `loupeOpen = true` (`+page.svelte:1410-1411`, the only line that sets it true), and it draws only while a cursor exists (`:4580`, `:1466`); it is available only on the Markup document with an ingested score (`:1026-1030`); the tab is named Syllables (`i18n.ts:503`). So a note must be selected first, and "select a note, open Syllables" describes the path.

### The `guide-key` style (if the draft is ratified)

One rule in the `<style>` of `GuideContent.svelte` (the file's style block opens at `:600`, read 2026-10-21). It makes an inline chip that looks like the Loupe's pill and is not a control. Read the pill's own rule in `apps/web/src/lib/score/LoupePlacementRow.svelte:51-90` (border `1px solid rgba(74, 69, 64, 0.35)`, `border-radius: 999px`, transparent background, colour `#4a4540`, `font-size: 12px`, hover border `var(--lavender, #9585a2)`, and a 44 px floor on a phone) and reuse its look, not its interactivity:
- inline, rounded ends, the same border, the same colour, a smaller padding that fits a line of body text;
- NO hover state, NO pointer cursor, NO 44 px floor (it is not pressable; the floor is for controls, `CONTRACT.md` section 8);
- use the Guide's own colour tokens if it has them, because the pill's colours are hard-coded in that file; Ilya has no dark theme, READ 2026-10-21 21:2x: no `prefers-color-scheme`, `color-scheme`, or `data-theme` in `apps/web/src`, `apps/web/static`, or `packages` (grep), so there is nothing to match; the Guide's style block takes its colours from `var(--…)` with light fallbacks (`GuideContent.svelte:603`, `:618-619`), so use the same variables, and report if a theme has appeared since;
- report a screenshot of the paragraph at a phone width and at a desktop width, since a chip that wraps mid-name is a defect: set `white-space: nowrap`.
The risk to report, not hide: a pill-shaped chip in the Guide can read as something to press. The absence of a hover state and cursor is the mitigation.

---
Amended 2026-10-21 21:2x by the desk, before Fable's review: three NOT READ items closed (section 3's Loupe sites, the order a singer reaches the button, and the dark theme). Evidence is read, not run. Previous md5 `e35c33cfdb3e330b024e5ab020a2891b`.
