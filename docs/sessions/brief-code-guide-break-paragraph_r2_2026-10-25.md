# Brief for Code: seat the Guide paragraph on the # break (QUEUE row 139, its Guide line), r2, 2026-10-25

r2, 2026-10-25. Fable-reviewed 2026-10-25 (`../sessions/review-fable-brief-guide-break-paragraph_r1_2026-10-25.md`), all 6 amendments applied. Replaces r1 (md5 `1bb61a328603b061569814a1619ab6a9`). Written by the Sonnet desk of 2026-10-25; Dann says send.

For Code in a cloud session, Sonnet, on the lane that carries batch C and N.194, AFTER batch C and N.194 r5 have shipped. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code carries a `path:line` the desk read in the clone at `e0f4ad9` on 2026-10-25, or says NOT ESTABLISHED or NOT READ. One commit on the lane; no pull request; no other branch; no `git add` of anything outside the files named in section 2.

Dann's rulings on this brief, 2026-10-25, quoted as transcribed:
- 23:38, *"bare octothorpe is fine"*, then *"Ratified"* for the French: the paragraph says the break writes `#`, not `[#]`, on the IPA line.
- 23:50, *"yes"* to the route sentence in both languages (the Loupe is opened by clicking a note on Markup, then Syllables is opened, then the button is pressed).

## 0. Why this waits for batch C and N.194 r5

The paragraph says a typed # sets a hard boundary, that a syntactic break stops regressive voicing assimilation, and that the Loupe has a button named "Break after this word". Those are true only once batch C's B3 (a typed # sets a hard boundary and is grafted after its parent syllable) and N.194 (the Loupe button) are on the lane. Seated earlier, the Guide describes behaviour the app does not have. If B3 or the button is not on the lane, stop and report; do not seat the paragraph.

The glyph is settled. N.194 r5 writes a bare `#` after the syllable's IPA on the IPA line, and Dann ratified the Guide to say so (23:38). There is no condition on the glyph. For the report only: read the seated slot's `ipa` after the build and state the glyph the engine wrote. If it is not a bare `#`, report it and seat anyway; the desk decides.

N.194 r5 is not in the clone at `e0f4ad9` (the newest N.194 brief there is r4, `docs/sessions/brief-code-n194-loupe-break-button_r4_2026-10-21.md`). Whether r5 changes the Loupe cites in section 8 is NOT ESTABLISHED; re-read them after it ships.

## 1. The text, and where it lives

Two source files, read by the desk on 2026-10-25:

| Source | Lines | md5 of the file |
|---|---|---|
| `docs/sessions/ratified-guide-break-paragraph_2026-10-21.md` | `:49` (English), `:53` (French): the paragraph's first four sentences, through "(Grayson 2012, p. 255)." | `3727ed5d2de3b123b0921b6d71b2f818` |
| `docs/sessions/draft-guide-break-how-to-place_r1_2026-10-21.md` | `:15` (English), `:19` (French): the ratified route sentences, from "The # comes from linguistics." and "Le # vient de la linguistique." to the end | `896508ae6030e33f34715eedf423e0e3` |

The r1 brief quoted the ratified file at `914620c152e11c549fbf257d64d8711f`; that md5 is stale (the file gained its 13:52 pointer). Check both md5s before you start. If either differs, stop and report.

The text Code seats is copied by script from those two files, never retyped, and the test's string literals come from the same script's output. The seated paragraph is: the ratified file's line up to (not including) "The # comes from linguistics" (English) or "Le # vient de la linguistique" (French), followed by the draft file's whole line. Dann's route sentences, as they stand in the draft lines:

- English: "Click a note on Markup to open the Loupe, open Syllables, and press `<span class="guide-key">Break after this word</span>`." The paragraph ends: "... and writes # on the IPA line after that word's last syllable. To take a break back, press `<span class="guide-key">Remove break</span>` in Syllables, or delete the # in Lyrics."
- French: « Cliquez sur une note dans l’Annotation pour ouvrir la loupe, ouvrez Syllabes, puis appuyez sur `<span class="guide-key">Frontière après ce mot</span>`. » and « ... et la frontière s’écrit alors # sur la ligne API, après la dernière syllabe de ce mot. »

Script (Python 3, run with `-I`; prints the two strings and their md5s; adapt it to write the two strings to files Code then splices into the Svelte and the test):

```
D='/root/shane/docs/sessions/'
rat=open(D+'ratified-guide-break-paragraph_2026-10-21.md',encoding='utf8').read().split('\n')
dr=open(D+'draft-guide-break-how-to-place_r1_2026-10-21.md',encoding='utf8').read().split('\n')
en_head,fr_head,en_tail,fr_tail=rat[48],rat[52],dr[14],dr[18]
en=en_head[:en_head.index('The # comes from linguistics')]+en_tail
fr=fr_head[:fr_head.index('Le # vient de la linguistique')].replace('&#160;',' ')+fr_tail
```

The desk ran this on 2026-10-25. The expected md5 of each assembled string (UTF-8, no trailing newline, no `<p>` wrapper) is:

| String | md5 | Length in characters |
|---|---|---|
| English | `af8343b697e3d98929dff5ff0e62c698` | 1046 |
| French | `6f937bd951499a784b7416180a397a32` | 1215 |

If your md5s differ, stop and report; do not hand-edit to match.

Bytes, named by code point:
- The ratified file writes the French pre-colon space as the entity `&#160;`. The one transform in the script is `&#160;` to a literal U+00A0 (NO-BREAK SPACE), because the Guide's own French paragraphs write the literal character (`GuideContent.svelte:38`; 35 lines carry the literal and 6 carry the entity, counted by the desk on 2026-10-25). The assembled French holds 2 U+00A0 and no `&#160;`.
- The assembled French holds 7 U+2019 (RIGHT SINGLE QUOTATION MARK) apostrophes; the assembled English holds none. Keep every U+2019 as the sources have it. Do not normalize apostrophes to U+0027 anywhere in the new text or its pins.
- Russian words stay in `<em>`. The new text has no `<strong>`.

## 2. The change

1. `apps/web/src/lib/components/Reading/GuideContent.svelte:380` (English) and `:84` (French): replace the whole `<p>` on each line with a `<p>` holding the assembled paragraph. Those two lines are today the only occurrences in `apps/web/src/lib` of "A phonation break is written" and "Une rupture de phonation s" (grep, 2026-10-25). Both old paragraphs wrap `[#]` in `<strong>` (`:84`, `:380`); the new paragraphs write a bare `#` and no `<strong>`. The old English paragraph also says "at the junction of the two notes"; that phrase leaves with it.
2. Add the `guide-key` rule to the `<style>` block (opens at `:600`; the file is 640 lines, under the 1000-line limit, and `scripts/ratchets.json` holds no ceiling for it). Section 8 gives the rule.
3. A pin in `apps/web/src/lib/insights/ratified-lines.test.ts`, in the style of the row 123 block (`:146-168`, the file is 168 lines today): read `GuideContent.svelte` as source, split on `{#if language === 'fr'}` and `{:else}`, and assert that `en` contains the assembled English paragraph and `fr` the assembled French. Dann's ruling for this paragraph: the pins carry the literal characters, not escapes (ratified file, "Seating"). The row 123 block's `decode` step for `&#160;` may stay; it is harmless against a literal.
4. Negative assertions, with the bytes the tree has today (`od` the lines before relying on this):
   - `en` does not contain `A phonation break is written <strong>[#]</strong>`.
   - `fr` does not contain `Une rupture de phonation s'écrit`, with an ASCII apostrophe U+0027 as `GuideContent.svelte:84` is written today.
   - Report the proof for each pin: the positive pins fail on the unchanged file because the paragraphs are absent; the negative pins pass on the new file and fail on the unchanged file because the old strings are present.
5. A label pin (section 8, last paragraph).

Touch no other file. If any other test fails, report it; do not edit it to pass.

## 3. Other sites that name the same thing

`phonation break` also appears in `apps/web/src/lib/score/Loupe.svelte` and `apps/web/src/lib/score/loupe-ink.ts`. Read by the desk: `Loupe.svelte:1070`, `:1078`, and `loupe-ink.ts:219` are code comments about analysis layers and ink; none quotes the retired Guide sentence or the "junction" claim. A grep of `apps/web/src` for "junction of the two notes" finds only `GuideContent.svelte:380`, the English paragraph this brief replaces. Run the same grep after your change and report the count. Change nothing in the Loupe files. This brief changes no computation, so it omits the cross-site line `CONTRACT.md` section 4 asks of computation briefs.

## 4. Gates

Run the eight gates the ship script runs and report each against its baseline taken at the start. The script itself is on Dann's Mac (`~/Downloads/ilya-ship.sh`) and is not in a cloud clone. The in-tree copy of its gate lines is `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh`, gates 1 to 5 at `:78-82` and gates 6 to 8 at `:109-118`. Its baselines are stale (gate 4 reads 2433 there); read the counts from your own run before you edit, because gates 4 and 5 move with batch C and N.194.

Six test files read `GuideContent.svelte` (grep, 2026-10-25). Run these six by name first and report each result:
- `apps/web/src/lib/insights/ratified-lines.test.ts`
- `apps/web/src/lib/sources.test.ts`
- `apps/web/src/lib/french-italics.test.ts`
- `apps/web/src/lib/no-fit-name.test.ts`
- `apps/web/src/lib/i18n.test.ts`
- `apps/web/src/lib/components/footer-credit.test.ts`

Facts read about them: `i18n.test.ts:141-153` strips both `&#160;` and `&nbsp;` to U+00A0 and asserts more than five `U+00A0:` sequences in the French branch; the new paragraph adds two and cannot lower it. "Grayson 2012, p. 255" passes the citation pattern (`sources.test.ts:40-41`), and Grayson 2012 is registered (`sources.ts:49-55`). The new French holds no Italian musical term (read), so `french-italics.test.ts` is not expected to move; NOT ESTABLISHED until you run it. Gate 5 and the `+page.svelte` ceiling are untouched by this change; confirm by the gate output.

## 5. Return memo

`docs/sessions/report-code-guide-break-paragraph_r2_2026-10-25.md`: files changed with `path:line`; the md5 of each assembled string against section 1; the glyph the engine writes (section 0); the new tests and the proof each fails on the unchanged file; the eight gates before and after; the section 3 findings; the two screenshots (section 8); a section "What I could not establish".

## 6. Cost and order

Code on a cloud lane, Sonnet: DESK ESTIMATE 30k to 80k tokens, a range, worst case 120k, one commit. Order: batch C, then N.194 r5, then this.

## 7. Not in this brief

The French of the pill's label (ratified 13:42, and it lives in N.194); the one-line statement of purpose; any change to the engine, the Loupe, or `phonationBreak`. Do not wire the typed # to `phonationBreak` or to the `[#]` path (`staff-renderer.ts:3311-3313`); the Guide no longer promises that glyph.

## 8. The route, the `guide-key` style, and the label pin

The route sentence is ratified (Dann, 2026-10-25 23:50, *"yes"*): "Click a note on Markup to open the Loupe, open Syllables, and press ...". The earlier wording, "In the Loupe, select a note, open Syllables", is retired and must not appear. Code does not choose between "tap" and "click"; the text is copied from the draft file.

The order the code enforces (read by the desk, 2026-10-25, in the clone at `e0f4ad9`): a click on a note on Markup sets the cursor and opens the Loupe (`apps/web/src/routes/+page.svelte:1408-1411`, `:1411` the only `loupeOpen = true`); the Loupe draws only while a cursor exists (`:4580`, and `:1466` closes it without one); it is available only on the Markup document with an ingested score (`:1026-1030`). The panel arrives shut with Syllables as its mode (`apps/web/src/lib/score/loupe-panel.svelte.ts:74-75`, and `reset` at `:124-127`), so Syllables is opened by a press: on the Syllables pill (`choose`, `:105-113`) or on the chevron (`toggle`, `:117-121`). The Syllables list draws inside `{#if syllablesOpen}{#if mode === 'syllables'}` (`Loupe.svelte:2564-2567`), fed by `loupePanel.open` and `loupePanel.mode` (`+page.svelte:4603-4606`). The tab is named Syllables (`apps/web/src/lib/i18n.ts:503`; French « Syllabes »). So the ratified sentence's order matches. After N.194 r5 ships, re-read these cites. If the order has changed, stop and report; do not seat a sentence that describes the wrong path.

Glossary cites for the French: « Syllabes » `i18n.ts:503`; « Paroles » `i18n.ts:787`; « la loupe », lowercase, `i18n.ts:1809`; « l’Annotation » `GuideContent.svelte:80` and `:82`.

### The `guide-key` style

One rule in the `<style>` of `GuideContent.svelte` (opens at `:600`). It makes an inline chip that looks like the Loupe's pill and is not a control. The pill's own rule is `apps/web/src/lib/score/LoupePlacementRow.svelte:51-95`, `.loupe-place-pill` at `:58-68`: border `1px solid rgba(74, 69, 64, 0.35)`, `border-radius: 999px`, transparent background, colour `#4a4540`, `font-size: 12px`, `line-height: 1`, `padding: 7px 12px`, a hover border, and a 44 px floor on a phone. Reuse its look, not its interactivity or its box:
- inline, `border-radius: 999px`, `border: 1px solid var(--border-light, #ddd9d4)` (the Guide's own border token, `:603`), `color: var(--ink-secondary, #4a4540)` (`:618`; the pill's `#4a4540` is this token's fallback, and its `rgba(74, 69, 64, 0.35)` is that colour at 35 percent), `padding: 0 0.5em`, `line-height: inherit`, `font-size: 0.9em`, so the line box does not grow;
- NO hover state, NO pointer cursor, NO 44 px floor (it is not pressable; the floor is for controls, `CONTRACT.md` section 8);
- use the Guide's own tokens, not the pill's hard-coded colours. The style block uses `--border-light`, `--ink-secondary`, `--surface-subtle`, and `--cobalt` (`:603`, `:618`, `:619`, `:633`). Ilya has no dark theme, read by the desk 2026-10-25: no `prefers-color-scheme`, `color-scheme`, or `data-theme` in `apps/web/src`, `apps/web/static`, or `packages` (grep). Report if a theme has appeared since;
- `white-space: nowrap` only if the longest label fits at 320 px inside the Guide's paragraph measure; otherwise let it wrap and report the screenshot. Report a screenshot of the paragraph at 320 px and at 1024 px either way. The longest label is « Frontière après ce mot », four words.

The risk to report, not hide: a pill-shaped chip in the Guide can read as something to press. The absence of a hover state and cursor is the mitigation. The Guide names none of the Loupe's existing pills today (grep for "Clear placements", "Place from here", « Retirer le placement », « Placer à partir »: none), so these two labels are the first `guide-key` uses; every later pill the Guide names takes the same class.

### The label pin

Add one test in `ratified-lines.test.ts` that reads the two labels from `i18n.ts` and asserts that the Guide contains `<span class="guide-key">LABEL</span>` for each label in each language (`en` for the English branch, `fr` for the French). The `loupe.place.*` family sits at `i18n.ts:479-485` today and holds no break key (grep, 2026-10-25). The two keys are `loupe.place.breakAfter` and `loupe.place.breakRemove`, DESK DEFAULT in Fable's review of N.194 r4. If N.194 shipped other names, read them from `i18n.ts` by their English values "Break after this word" and "Remove break" and report the names. The expected French values are « Frontière après ce mot » and « Retirer la frontière » (ruled 13:42). How the test imports the table is NOT READ; copy the way `i18n.test.ts` does it.

## Appendix: the six amendments

| # | Amendment (Fable, 2026-10-25) | Applied | Section |
|---|---|---|---|
| 1 | The Guide said `[#]`; N.194 writes a bare `#` | Yes, with Dann's 23:38 ruling. The STOP-before-seating condition is dropped; N.194 r5 writes a bare `#`; Code reports the glyph read from the slot's `ipa` and does not stop | 0, 1, 7 |
| 2 | "Select a note, open Syllables" put the selection inside the Loupe | Yes, with Dann's 23:50 ruling. The ratified route sentence is copied from the draft's `:15` and `:19`; the order cites replace the r1 paragraph, with the Loupe cites re-read after r5 | 1, 8 |
| 3 | Pins could not fail, and the French colon byte was unstated | Yes. Literal U+00A0 (35 lines against 6), U+2019 kept, the negative pins carry the ASCII U+0027 `s'écrit` | 1, 2 |
| 4 | The `guide-key` chip could overflow or change line height | Yes, with the review's replacement bullets 1 and 4 (tokens `:603`, `:618`; `nowrap` only if 320 px fits; screenshots at 320 px and 1024 px) | 8 |
| 5 | The label pin read keys N.194 r4 does not name | Yes, with the review's parenthesis (`loupe.place.breakAfter`, `loupe.place.breakRemove`, DESK DEFAULT; fallback by English value) | 8 |
| 6 | Small cites and facts | Yes. Stale md5 replaced and the draft's md5 stated; in-tree gate file named (`gates-scratch.sh:78-82`, `:109-118`); test paths corrected; `i18n.ts:503`, `:787`, `:1809` confirmed; the no-dark-theme and no-existing-pills reads kept | 1, 3, 4, 8 |

## What I could not establish

- N.194 r5 and batch C are not in the clone at `e0f4ad9`: whether the button, its two i18n keys, and the bare `#` on the IPA line exist as described is NOT ESTABLISHED until they ship. The Loupe cites in section 8 are to the tree as it stands.
- Whether a four-word chip fits the Guide's paragraph measure at 320 px (a render, not a reading).
- The eight gate baselines in the cloud lane after batch C and N.194 r5.
- How `i18n.ts` exports its table to a test (NOT READ for this brief).
- Fable's review file is at `/root/review-out/` in this session; its path in the repository, `docs/sessions/review-fable-brief-guide-break-paragraph_r1_2026-10-25.md`, is the header's cite and is NOT CHECKED in the clone.
- The row numbers in `ratified-lines.test.ts`: the r1 brief said `:146-185` and the review `:146-168`; the file is 168 lines, so `:146-168` is used here.
