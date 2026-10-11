# Report: Insights as Design round 2 drew it (r1, 2026-10-11)

**QUEUE row 66, state: WRITTEN on the code, pushed to `cloud-lane`. DONE is Dann's look.** Three calls in this report are his (the findings list, the tritone pick, and the English italics), each under "For Dann". The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-insights-for-the-singer_r1_2026-10-11.md`. Built on `cloud-lane` after row 63's commit, with a clean tree before the first edit. One commit on `cloud-lane`, under Dann's instruction for this session and `CONTRACT.md` §5's cloud-lane amendment; nothing pushed to `Shane` or `main`, no pull request.

The boards were read with the Artifact tool (version `1791704797-463b`, all twelve). The French is the ratified table `docs/sessions/french-insights-r2_r1_2026-10-11.md` with its 04:12 and 04:14 rulings, the teacher lines from `OPEN.md` (00:12 to 00:21), and the "unlikely" sentence (`OPEN.md`, 03:19).

## What the singer sees now

Page 1: the header, then teacher line B as the opening frame, then "How this key sits for you", unboxed: the verdict in body type, one paragraph; the way forward (the ruler's readout, **Try this key** on screen, and a sentence in the better key); then the reasons, **Range** and **What another key would change**. Then three squircles, which break across pages open at the break: **Where this piece meets your voice** (the comments, teacher line A on each that suggests an approach), **The measures behind these reasons** (the cycle dose and its split bar, the per-pitch chart, the vowel ring and bars, the phonation sentence, the sources line), and **More to explore, and why** (teacher line C, then each comment's further suggestions and its references, as endnotes). On a phone the same blocks run in one column.

## Each change

### The model, pure and tested

- `apps/web/src/lib/insights/singer-page.ts` (new):
  - `isUnlikely` (`:70`): `outside-range`, or `outside-tessitura` with the piece's band past the typed tessitura by more than `UNLIKELY_TESSITURA_MARGIN` (2 semitones) at either end. **DESK DEFAULT, the brief's.**
  - `longestAboveSecondo` (`:99`): the longest **held** note above the typed secondo over its tie chain. "Held" is `NoteCondition.held`, the sustain test the comments use (**DESK DEFAULT**: without it, a passing C♯4 of about 1 second was printed as "holds … for about 1 seconds").
  - `firstOutsideRange`: the first sung note outside the typed range.
  - `searchBetterKey` (`:174`): the second key search, as the brief words it: within ±6 semitones (the watch list's window), a key qualifies when range and tessitura stay contained, neither passaggio gains a crossing, and the share at or above the primo drops by at least `BETTER_KEY_MIN_DROP` (0.10, **JUDGEMENT**, one constant). Largest drop wins, then the smaller move, then the lower key. It runs only when nothing is out of range; otherwise the watch list's own key (the range finding's `transposition`) is the way forward, as built.
  - `vowelTurns` (`:244`): seconds per vowel, before and past its turn (fo at or above fR1 ÷ 2 from the snapshot, as `comments.ts:166` computes it), in `VOWELS` order, every vowel printed and an unsung one at zero (Dann 2026-09-24 09:53). A vowel with no fR1 gets its bar without a turn and says so.
  - `countWord`, `articleFor`, `suggestsApproach` (teacher line A sits where a comment shows at least one suggestion).
- `singing-measures.ts:150` `cycleDoseSplit`: under, within, and above the typed tessitura, the edges within.
- `insights.ts`: `secondsPerQuaver` exported; `passaggioBars` on the model from the gated watch list (`barsNearPassaggio`, `:784`); `SungKey` gains `readoutFor` and `keyNameFor` (`:68`), implemented in `markup/transposition-ruler-state.svelte.ts:134` with the ruler's own `readout` and `keyName`, so the readout is one function's words.
- `voice/note-picker.ts:150` `pitchName`: French in solfège with the French octave index (A3 → « la2 »). Used by the page, the compass stave (`compass-stave.ts`), and the comment frames (`comment-text.ts`, pitch names only, no wording changed).

### The page

- `singer-blocks.ts` (new): every sentence, in order, as blocks with their squircle. `singerBlocks` at `:127`.
- `paginate.ts` (new): breaks measured blocks into pages; a squircle continuing across a break is open at both sides; nothing passes a page's room except a single block taller than a page.
- `SingerBlock.svelte` (new): draws one block. `PitchSeconds.svelte` (new): the per-pitch chart, the board's layout, no grey clef and no leaders; a passaggio's dashed line runs half a semitone under its pitch, between two bars, so it never crosses one.
- `InsightsPane.svelte`: rewritten from the chain down. It renders every block once off screen at its printed width, measures it after `tick()` (as the old page-one fit did), measures the tallest footer (with the footnote), and paginates with 40 px clear above the footer's notes (**DESK DEFAULT**: Unlikely page 3's spacing, which Dann held up at 03:42). Page 2 on uses row 64's running head; every page uses row 64's footer. 1,186 lines became 706.
- `text-parts.ts` `richParts`: italics, IPA, accidentals, and fR1 with its subscript, as text nodes.
- `i18n.ts`: 44 `insights.r2.*` strings (the list under "Strings").
- `sources.ts`: the five works the sources line cites and the registry does not hold go on `OWED` (Bozeman 2010, Titze 2007, Titze 2012, Titze 2008, and "Popolo 2003", which is Titze, Švec, and Popolo 2003).

### Tests

- `singer-page.test.ts` (20): the unlikely gate (outside-range; outside-tessitura by 3 semitones at the top and at the floor, yes; by 2 and by 1, no; a fit, no); the held note (the longest above the secondo, a passing note skipped, nothing held); the better-key search (qualifies with a 75-point drop; the tie on the drop goes to the smaller move; a 50-point drop beats a 25-point drop at a smaller move; a 9-point drop does not qualify; no search with a note out of range); the cycle-dose split (edges within, the three sum to the whole, zero for an empty part, nothing without a tempo or a typed tessitura); the vowels in Mitton (2020) Figure 4.2 order, a note past its turn only at or above fR1 ÷ 2, no turn without fR1; teacher line A; the count words, "an" before A, E, F; French pitch names.
- `paginate.test.ts` (5) and `singer-blocks.test.ts` (6): the order of the squircles, teacher line A on approach comments only, teacher line C first in the sources, the verdict and "nothing flagged" as one paragraph, the ratified "unlikely" sentence with "no other key" and the teacher line, the bar list with its Oxford comma.
- `comments.test.ts` and `compass-stave.test.ts`: the French expectations now spell pitches in solfège (« Ce [i] sur mi3 … », « Ambitus do♯2 à ré3 »). The r7 words are unchanged; the pitch style postdates them (Dann 03:17 and 04:12), and a comment above the texts says so.
- `one-head-one-foot.test.ts` (row 64's): follows the pane, which now draws its pages in one loop and measures a probe footer.
- `e2e/insights-page.test.ts` (Playwright, outside the eight): the compass test unchanged; the order test now checks the frame, the conclusion, the moments, and the totals in order, and that on **every page** the last block ends above the footer; the label test now reads the new chart and adds "no passaggio line crosses a bar". All 3 pass, and `e2e/print-pages.test.ts` passes (Insights prints the pages it numbers).

## The pictures

`docs/sessions/insights-r2-shots/`, made by `shots66.mjs` in the same folder against the dev build, *Without Sun*, no. 1, a synthetic bass whose [u] first resonance is 240 Hz (so the board's own comment, m. 6 · A3 · [u], fires). Three typed voices:

- **quiet**: the board's voice (range B♭1 to F♯4, tessitura D3 to B♭3, primo A3, secondo D♯4). No key qualifies.
- **better**: tessitura widened to B2 to B♭3. The search finds down a minor third (39 to 7 percent at or above the primo).
- **unlikely**: range D2 to C4, tessitura B2 to A3, primo G3, secondo C4. Outside the range; the watch list's key is down a whole tone.

`before-*` were taken with the old pane and the old comment renderer swapped back in, so before and after are the same voice: quiet, better, and unlikely in English, unlikely in French, and the phone (unlikely, English), 3 pages each. `after-*`: 4 pages each on letter; the phone column in 7 pieces (`after-unlikely-en-phone-p1` to `-p7`), captured element by element because one screenshot of an element taller than the viewport came back blank. The phone pieces show the app's own top bar and drawer over the page where they overlap a scrolled element; that is the screen, not the page.

**Collisions:** checked by eye on every letter page of all four after sets, and by the Playwright page test on the English unlikely case. None found: every squircle ends above the footer's notes, and no chart label touches a label, a bar, or a line, in English and French. Pages carry more white space than the boards (a tall block, the vowel chart, moves whole to the next page); nothing is clipped.

## Strings

Ratified and built verbatim: the frame (B), teacher lines A and C, the "unlikely" sentence with both reasons and its "Together" sentence, table rows 1 to 4, 6 to 23 (rows 11 and 21 with « plis vocaux »), and the squircle headings.

**Set in English in both languages, `[FR: desk draft owed]`** (each marked in `i18n.ts`):

1. `insights.r2.unlikely.share`: the "unlikely" opening with the share only.
2. `insights.r2.unlikely.held`: with the held note only.
3. `insights.r2.unlikely.range`: "Bar {bar} reaches {a} {pitch}, outside the range you typed, {low} to {high}."
4. `insights.r2.unlikely.alone`: "This makes the song unlikely …", for one reason.
5. `insights.r2.noBetterKey`: "No other key within a tritone fits your voice better."
6. `insights.r2.better.interval`: row 1 for an interval other than a whole tone.
7. `insights.r2.inKeyShare`: row 2 without the held note.
8. `insights.r2.range.outside`: row 6 for a compass outside the range.
9. `insights.r2.primo.some`: row 7 with time above the secondo.
10. `insights.r2.compare`: the better-key board's comparison line.
11. `insights.r2.fr1.many`: row 8 for more than one note.
12. `insights.r2.nearPassaggioOne`: row 9 for one bar.
13. `insights.r2.vowels.noTurn`: a vowel with no fR1.

**Desk-drafted by Code, for Dann's eye, not in the table:** the French of row 21's parenthetical sources (« Bozeman 2010 et 2014; Titze 2007, p. 200 … Titze, Švec et Popolo 2003 »), and the French pitch key « (la3 = 440 Hz) » after the method line.

## DESK DEFAULTS taken

- The findings list ("What is flagged") leaves the page, as the drawing has it. Passaggio findings feed "Notes in N bars sit near your passaggio"; "Nothing in this piece is flagged" still joins the verdict when the list is empty.
- "What practice changes" never prints: no rule yet earns it a line (Dann's finding 3, thresholds NOT ESTABLISHED).
- The verdict says row 1, "This key suits your voice. A tone lower would …", only when the verdict is a fit; a milder `outside-tessitura` keeps its line and gains the readout.
- The comments' inline tap is gone; its suggestions and references print in the sources squircle, on screen and on paper alike. "More observations" stays a screen-only tap.
- Every vowel prints, unsung ones at zero, as the 2026-09-24 ruling has it; the boards drew only sung vowels.
- On a phone, the blocks reflow into one column (the phone board), and a print from the phone prints that column.

## For Dann

1. **The largest drop can pick a big move.** With the e2e bass voice (tessitura G2 to D4), every key down to a tritone qualifies, and the rule as written picks the tritone, because it drops the share furthest. The brief's order is followed; the quiet board's voice is quiet because its tessitura fits the piece exactly. If that reads wrong, the alternative is "the smallest move that clears the 10 points".
2. **English italics.** The boards set *primo passaggio* in italics in English. A standing test (`french-italics.test.ts`) holds that English sets these terms roman, so the English strings carry no italics; the French does.
3. **The findings list leaving the page** (DESK DEFAULT, above): it drops what the watch list says about crossings, timbre, and sustain from Insights. Markup still draws them.

## The eight gates

| # | Gate | Before (row 63) | After row 66 |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 251 passed (251) | 251 passed (251) |
| 2 | `pnpm test:dictionary` | 235 passed (235) | 235 passed (235) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors and 12 warnings in 5 files | same |
| 4 | `pnpm --filter @ilya/web test` | 2094 passed (2094) | **2125 passed (2125)** |
| 5 | `pnpm --filter @ilya/score-parser test` | 650 passed, 5 skipped (655) | same |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | OK | OK |

Gate 4: 2088 before row 64, 2094 after it, 2125 now (+31: 20, 5, and 6 in the three new files). Ratchets say `InsightsPane.svelte`'s ceiling can drop from 1,351 to 706; `scripts/ratchets.json` is untouched.

## Could not establish

- **Dann's voice and songs.** Every picture is the fixture and a synthetic voice. Only one comment fires on it, so the moments squircle never breaks across a page in these pictures; the break is shown by the totals squircle, and by `paginate.test.ts`.
- **The Kabalevsky "unlikely" case of the boards.** No Kabalevsky fixture is tracked; the unlikely pictures use *Without Sun*, no. 1 with a range topping at C4.
- **Print on paper.** The print test counts pages; nobody looked at a printed page.
- **The phone in a real phone browser.** Headless Chromium at 390 px only.
- **`Tessituragram.svelte`, `FitTable.svelte`, and `cycle-dose.ts`** are no longer drawn by the pane. They and their tests stay; removing them is a separate, reversible step.
- **The full references in the sources squircle** are the comments' full references, as built; the boards drew short ones. Which Dann wants is NOT ESTABLISHED.
