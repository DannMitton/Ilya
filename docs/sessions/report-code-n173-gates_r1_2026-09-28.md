# Report from Code: the N.173 gates on Markup's box

**Code report r1, 2026-09-28.** Answers `brief-code-watch-band-says-less_r1_2026-09-28.md`, the update of 16:28 (build the gates). Branch `Shane`, base `2535f88`. The working tree was dirty before this work with the desk's edits (`STATE.md`, the brief), and the desk edited more files while Code worked (`ARCHITECTURE.md`, `OPEN.md`, `OWED.md`, `PRODUCT.md`, `SCHEDULE.md`, `LOG.md`, and two new briefs). Code did not touch those.

## What the box shows now, with Mitton's voice

Stakes threshold **3**, **2** entries per printed page. Voice: Mitton as the frequency run carries it (range A2 to E4, passaggio A♭3 to D♭4). Read from the real Finale files by the harness and confirmed line for line in the live app.

**«Скучай» (Sunless 04): 34 lines before, 2 after.**

- Bar 18: 'девственной' falls near your passaggio; expect the turn to want managing.
- Bar 19: 'мечты' falls near your passaggio; expect the turn to want managing.

Both are on score page 2 of 2, so the page limit did not bite.

**Sunless 01: 24 lines before, 3 after.**

- Bar 6: 'дума' falls near your passaggio; expect the turn to want managing.
- Bar 11: 'мгновеньем' falls near your passaggio; expect the turn to want managing.
- Bar 15: 'терпения' falls near your passaggio; expect the turn to want managing.

**Where the page limit bit (Sunless 01, page 1).** Four places passed gates 1 to 4 on page 1, so the limit dropped two:

- Bar 9: 'заветная' falls near your passaggio. Stakes 4, the same as the two it kept on that page. The watch list's own order broke the tie.
- **Bar 6: 'глубокая', the song's climax.** Stakes 3: one demand, weighed twice (climax and phrase top). **The limit dropped the climax.** Dann should judge this one.

In French the lines are the same, with « Mesure 18 : « девственной » tombe près de votre passaggio… ».

**Every line printed is a passaggio line, on both songs.** For this voice, every place the watch list finds in these two songs is a passaggio note, sometimes with a timbre turn. None carries a sourced thing to try. This is why gate 2 matters most (below).

## The gates as built

`apps/web/src/lib/analysis/gates.ts`, pure and framework-free. `applyGates` (`gates.ts:221`) runs them in the draft's order:

1. **The piece fits** (`gates.ts:238`). If any note lies outside the declared range, the box prints only the range line, which carries the transposition when one was found, and no list of notes. DESK DEFAULT: the lead names its own bar only, because the range lines' verbs are singular ("Bar 12 rises…").
2. **Something to offer** (`hasOffer`, `gates.ts:201`). The place passes if it carries advice, or if one of its kinds is rare in the score (at most three notes, the existing `RARE_KIND_MAX_NOTES`, `watchlist.ts:97`). **NOT ESTABLISHED:** a sourced thing to try exists only for the crossing and the three exposed hazards. Ilya has none for the passaggio, the timbre turn, or the sustain. **TRIAL `offer: 'pending'`** (`gates.ts:69`): a place whose kind has no advice case yet passes gate 2, and stakes decide. With `'strict'`, the box is **empty on both songs**, since every place is a common passaggio note with no advice.
3. **Stakes** (`demandsOf`, `gates.ts:137`; `weightsById`, `gates.ts:172`). Stakes = demands × (1 + weights).
   - Demands: register (passaggio); resonance (crossing, cover, tracking, turnover, sustain on the turning pitch); range edge (outside the range, or within 1 semitone of its top or bottom, DESK DEFAULT); endurance (a held note); transition (a timbre turn, or a leap of a fifth or more across a passaggio edge).
   - **Dynamic: NOT ESTABLISHED.** Dynamics are not parsed, so it never fires and never raises the stakes.
   - Weights: climax (the song's highest pitch), phrase top, final note (its tie chain included), held. "Held" appears as both a demand and a weight, because the draft lists it in both places. **Neither song has a held note:** none reaches 2.5 seconds (checked against the run's CSV), so both songs are judged here without it.
   - The leap is a fifth (`gates.ts:76`), Insights' `COMMENT_DEFAULTS.leapSemitones`, so the two documents agree. The conditions' own `leap-up` band starts at a minor third. With Dann's two edges a fourth apart, that band put nearly every passaggio note over the threshold.
4. **Patterns fold.** The same headline kind, vowel, pitch, and direction make one entry. It names every bar in performance order and drops the word, since its bars may carry different words. Neither song folds anything at threshold 3.
5. **No crowded page** (`gates.ts:280`). At most 2 per printed page, highest stakes kept. A tie keeps the watch list's order. An entry counts on the page of its anchor.
6. **Silence.** Nothing passes, and the box does not render.

The survivors print in performance order, which is `PRODUCT.md`'s "COMMENTS APPEAR IN THE ORDER THE SINGER MEETS THEM" (select by stakes, show in order). The box used to print hardest first (§7.2). DESK DEFAULT, so both documents read the same way.

**The threshold, TRIAL 3** (`gates.ts:58`). At 1, every flagged note speaks. At 2, one demand at a phrase top is enough. For a low voice in Sunless, nearly every phrase tops out at the passaggio, so 2 printed 16 lines on «Скучай» and 14 on Sunless 01: the general commentary Dann called of little value (16:18). At 3, a place needs two demands where the music leans, or one demand where it leans twice. Entries per threshold, with gate 5 applied:

| Threshold | 1 | 2 | 3 | 4 | 6 |
|---|---|---|---|---|---|
| «Скучай» | 4 | 4 | 2 | 2 | 0 |
| Sunless 01 | 4 | 4 | 3 | 3 | 0 |

At 1 and 2 the page limit does most of the work.

## How the ranking was computed before, for N.173

`buildWatchList` sorts by tier, then by the number of kinds on the note, then by harmonic density, then by score order (`watchlist.ts:495`). The tiers are in `TIER_OF` (`watchlist.ts:123`): range 1; crossing, cover, tracking, and turnover 2; passaggio 3; timbre 4; sustain 5. The gates keep this order only to break ties and to choose gate 1's lead. Stakes now do the ranking.

## One set of gates for both documents

`gateBand` (`gates.ts:352`) takes the analysis a document already holds and computes the note conditions the way `InsightsPane.svelte` does. Markup calls it (`MarkupPane.svelte:856`). **Insights does not call it yet.** Its findings are built from the same watch list (`insights.ts:366`), so wiring it is one call. That changes the Insights pages, so it waits for Dann's look at this box. DESK DEFAULT.

## Changes

- New: `analysis/gates.ts` and `gates.test.ts` (19 tests).
- `watchlist.ts`: `WatchList` gains an optional `kindCounts` (the counts before the dial, for gate 2), and `isRare` is exported.
- `MarkupPane.svelte`: the box prints `gatedLines(gateBand(…).shown)`. The file is now 1358 lines, and its ceiling in `scripts/ratchets.json` is lowered to 1358.
- `i18n.ts`: two new strings, below.
- The trial: `tools/n168-frequency-run/gates-trial.run.ts`, `gates-trial.config.ts`, and `gates-trial.pages.json` (each page's bars, read off the live render). It writes to the gitignored `apps/web/test-results/n173-gates-trial/gates-trial.md`, because the box's lines carry sung words. Run it from the repository root:

```bash
pnpm --filter @ilya/web exec vitest run --config ../../tools/n168-frequency-run/gates-trial.config.ts
```

**Refused, and not done:** adding each page's bars to `paginateScore`'s result in `packages/score-parser` was refused as a change to a shared package. The app reads them off the `data-system="from-to"` attribute each printed system already carries (`pageOfMeasureFrom`).

## New strings, French drafted by Code, for Dann

A folded entry needs a plural lead. It swaps each line's singular opening for the plural, and `Intl.ListFormat` joins the bars ("3, 7, and 9"; « 3, 7 et 9 »). A test checks that every `watch.line.*` template opens with the singular lead in both languages.

| Key | English | French (draft) |
|---|---|---|
| `watch.lead.one` | Bar {bar} | Mesure {bar} |
| `watch.lead.many` | Bars {bars} | Mesures {bars} |

Neither song folds anything at threshold 3, so neither string prints on these two songs today.

## Checked

- Gates run directly (`ilya-ship.sh` refuses while new files are untracked). 1 phonology 251, 2 dictionary 235, 3 check 0 errors and 12 warnings, **4 web 1665 (was 1646; 19 new)**, 5 score-parser 616 and 5 skipped, 6 blurb 145, 7 integration 55, 8 ratchets OK. Gate 4's baseline in `~/Downloads/ilya-ship.sh` needs to read `"1665 passed (1665)"`.
- Live, at the clean origins `gates.localhost:5173` («Скучай») and `gates1.localhost:5173` (Sunless 01), with the Mitton trial voice seeded into those origins only. The boxes match the harness line for line, in English and in French. «Скучай» has one notes sheet, and its window is 785 px with nothing past it.

## For Dann

1. **Gate 2, taste.** Is a passaggio note "something real to offer" before Ilya has advice for it? The build says yes, provisionally (`pending`). Strict leaves both songs silent.
2. **The climax on Sunless 01**, dropped by the page limit at bar 6. Should the climax, or the song's single highest-stakes place, be exempt from the page limit?
3. The two French strings above.

**Done when:** Dann looks at «Скучай» in Markup, in both languages, at `http://localhost:5173`, with his own voice. The change is uncommitted, so Vercel will not show it. His count can differ from this report's, because his stored voice is not the frequency run's Mitton.

## r2, strict gate 2

Answers `brief-code-n173-gates-strict_r1_2026-09-28.md`, after the draft's Revision r5 (Dann, 20:22 and 20:24). Still uncommitted, on the same tree. The desk's own edits in the tree (`ENVIRONMENT.md`, `draft-curation-rules_r1_2026-09-24.md`, and the rest) are untouched.

### What changed

- **Gate 5, the page limit, is gone.** `perPage`, the page grouping in `applyGates`, `pageDropped`, and `GatedEntry.page` are deleted. The page map `pageOfMeasureFrom` is deleted too: nothing else read it, only gate 5 through `gateBand`. `gateBand` no longer takes `pages` (`gates.ts:310`), and Markup no longer passes them (`MarkupPane.svelte:856`). The survivors of gate 4 are the result (`gates.ts:264`).
- **Gate 2 is strict, with no switch.** `offer` and `NO_ADVICE_CASE` are deleted. `hasOffer` (`gates.ts:187`) passes a place only with a sourced thing to try, or a kind rare in this score (the existing `isRare` path).
- **Weight never passes a place alone.** It cannot by construction: weight only multiplies, and gate 2 comes first. The test at `gates.test.ts:91` holds a passaggio note with no advice at the song's climax and a phrase top: it lands in `noOffer`, and the box prints nothing.
- **The header comment** now lists the five gates that remain and cites Revision r5 (`gates.ts:1-30`). The threshold's comment (`gates.ts:60`) now says 3 was chosen when gate 2 was loose, and that it ranks only places that already carry an offer.
- **Tests:** 19, as before. Removed: the `pending` test, the two page-limit tests, and the page-map test. Added: advice passes (`:80`), rarity passes (`:86`), the climax test (`:91`), and "no page limit: every place prints" (`:190`). The fold, gate 1, gate 3, order, and duplicate-line tests stay.
- **`watch.lead.one` and `watch.lead.many` stay** in `i18n.ts`. Their French is still to be ruled. No song in this trial folds, so neither string prints.
- **The trial** (`tools/n168-frequency-run/gates-trial.run.ts`) now runs all six Sunless songs, with no page map. `gates-trial.pages.json` is deleted. A new helper, `gates-trial.kinds.ts`, counts the kinds on the band and how many carry advice.

### Gates

1 phonology 251, 2 dictionary 235, 3 check 0 errors and 12 warnings, 4 web **1665** (unchanged from r1: four tests out, four in), 5 score-parser 616 and 5 skipped, 6 blurb 145, 7 integration 55, 8 ratchets OK. `MarkupPane.svelte` stays at 1358 lines, and no ceiling bit. Gate 4's baseline in `~/Downloads/ilya-ship.sh` still needs to read `"1665 passed (1665)"`.

### What the box prints, Mitton's voice

Gate 2 strict, threshold 3, no page limit. "Entries" counts note-level places before the band's duplicate-line check, which is why they outnumber the r1 line counts.

| Song | Places before the gates | Prints |
|---|---|---|
| Sunless 01 | 43 passaggio, 0 with advice | nothing |
| Sunless 02 | 15 passaggio, 0 with advice | nothing |
| Sunless 03 | 102 passaggio, 1 crossing with advice | nothing |
| Sunless 04, «Скучай» | 41 passaggio, 0 with advice | nothing |
| Sunless 05 | 105 passaggio, 3 crossings with advice | 2 lines |
| Sunless 06 | 52 passaggio, 0 with advice | nothing |

**Sunless 05 prints:**

- Bar 31: your [i] meets your first resonance here, so the tone will want to turn full and heady, toward a whoop. You might try relaxing the jaw and leaning the vowel toward [ɪ], giving it a touch more space, which can lift your first resonance clear of the pitch.
- Bar 36: your [i] meets your first resonance here, so the tone will want to turn full and heady, toward a whoop. Consider relaxing the jaw and leaning the vowel toward [ɪ], giving it a touch more space, which can lift your first resonance clear of the pitch.

Bar 31 has stakes 4 (register and resonance, at a phrase top). Bar 36 has stakes 6 (register, resonance, and transition, at a phrase top). The French prints « Mesure 31 : votre [i] rencontre ici votre première résonance… », with the openers rotated.

**Gate 3 dropped two places that carry advice.** Sunless 03 bar 35 and Sunless 05 bar 41 are both [i] crossings in the passaggio, with stakes 2 (two demands, no musical weight). At threshold 2 they would print. This is now the threshold's only work: it decides which advice speaks, not whether facts do. Dann should judge it with these two in mind.

**Live check:** «Скучай» at `http://gates.localhost:5173` (the Mitton trial voice) renders no box. Its notes sheet still prints for the octave notice alone.

### What I could not establish

- **Whether Dann's own voice gives the same result.** The trial uses the frequency run's Mitton profile, not the voice stored in his browser. NOT ESTABLISHED.
- **Whether «Скучай» and Sunless 1 have anything a singer needs coached** beyond what the watch list finds. Every place it finds there is a passaggio note, and Ilya has no sourced passaggio advice until N.168 supplies it. The empty box points to that gap. It is not a finding that the songs are easy.
- **Gate 2's rarity path** passes a place with no advice when its kind is rare in the score (three notes or fewer). In this trial no place passed that way. Whether a rare kind with no advice amounts to "a notable observation that says why it matters", as r5 words it, is NOT ESTABLISHED. That path is the one r1 carried over.
- **What Insights would print** under these gates. Insights still does not call `gateBand`.

### Threshold 2 (brief addendum, 20:33)

Ruled by Dann 20:32 (Revision r5). Still uncommitted.

- **`GATE_DEFAULTS.stakesThreshold` is 2** (`gates.ts:60`). Its comment now reads: stakes 1 is one demand on an unremarkable note, which the staff mark already carries. The first trial's 3 guarded against passaggio lines with nothing to try, which strict gate 2 now removes. At 2, an advised place speaks with two demands even where the music does not stress it, or with one demand where it does.
- **Tests: 20** (one new). "One demand on an unremarkable note is 1 × 1 = 1, under the threshold" (`gates.test.ts:109`) replaces the test that pinned 2 as under the threshold. "A passaggio note at a phrase top is 1 × 2 = 2, at the threshold, and passes" is new (`:114`). "A leap under a fifth is not a transition" (`:126`) now checks that the note's only demand is the register, and that it passes at 2. The climax test's title no longer says "passes"; it still pins stakes 3.

**Gates:** 1 phonology 251, 2 dictionary 235, 3 check 0 errors and 12 warnings, 4 web **1666** (was 1665), 5 score-parser 616 and 5 skipped, 6 blurb 145, 7 integration 55, 8 ratchets OK. `MarkupPane.svelte` is unchanged at 1358 lines. Gate 4's baseline in `~/Downloads/ilya-ship.sh` needs to read `"1666 passed (1666)"`.

**The six-song trial, Mitton's voice, strict gate 2, threshold 2:**

| Song | Prints |
|---|---|
| Sunless 01 | nothing |
| Sunless 02 | nothing |
| Sunless 03 | 1 line: bar 35 |
| Sunless 04, «Скучай» | nothing |
| Sunless 05 | 2 lines: bars 31 and 41 (folded), and bar 36 |
| Sunless 06 | nothing |

- **Sunless 03, bar 35:** "your [i] meets your first resonance here… You might try relaxing the jaw and leaning the vowel toward [ɪ]…". Stakes 2: register and resonance, with no musical weight.
- **Sunless 05, bars 31 and 41:** "Bars 31 and 41: your [i] meets your first resonance here… You might try relaxing the jaw…". Same vowel, same pitch, so gate 4 folds them. Stakes 4 at the anchor, bar 31, a phrase top.
- **Sunless 05, bar 36:** the same finding with "Consider relaxing the jaw…". Stakes 6.

No threshold between 1 and 2 changes any song. Gate 3 now drops nothing on these six songs.

**The fold now prints the plural strings, whose French is not ruled.** On Sunless 05, gate 4 folds bar 41 into bar 31, so `watch.lead.many` prints: "Bars 31 and 41:" and « Mesures 31 et 41 : ». The r2 brief said these strings do not ship until Dann rules the French. They cannot stay silent while folding runs. **Before shipping, Dann rules « Mesure {bar} » and « Mesures {bars} ».** If the ruling waits, the fallback is to switch gate 4's fold off, which would print bar 41 as its own line.

**What I could not establish** (added to the list above): whether a place with stakes 2 and no musical weight, such as Sunless 03 bar 35, reads to a singer as worth the box. That is Dann's judgement by reading.
