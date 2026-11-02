# Report: N.182 (row 71), how Ilya suggests a key, the rebuild (Code, r2, 2026-11-01)

Brief: `docs/sessions/brief-code-n182-suggesting-a-key_r3_2026-11-01.md` with Fable's review `docs/sessions/review-fable-brief-n182-rebuild_r1_2026-11-01.md` (A1 to A12) and Dann's ruling of 2026-11-01 22:39 (no line enumerates pitches). Branch **`cloud-lane-29`** where the brief says `cloud-lane-25` (the session's prompt names it). One report file; one commit per step; this file grows by a section per step.

## Steps, as I define them (the brief does not number them)

0. Read, record, baseline.
1. The search: `key-suggest.ts` (pure), the fraction helper, tests.
2. The words: `key-lines.ts`, the `insights.key.*` strings, the six retired ratified keys and their pins, tests.
3. The wiring: `InsightsPane.svelte`, `singer-blocks.ts`, `SingerBlock.svelte`; `searchBetterKey` and `shareAfter` go; ratchets.
4. The proof: pictures at desktop and 390 px for the five states, "For Dann", what could not be established.

---

## Step 0: read, record, baseline

### State

Cut: `cloud-lane-29` at `8935781` (row 172 step 4) on `origin/Shane` `f9797acb`. Row 71 builds on the lane's own earlier commits, as the session's prompt orders three rows on one branch. Working tree clean at the start. `docs/memory/` untouched.

### Baseline gates (same as row 172 step 4; no source file changes between)

| # | Command | Result |
|---|---|---|
| 1 | `pnpm --filter @ilya/phonology test` | 407 passed |
| 2 | `pnpm --filter @ilya/dictionary test` | 248 passed |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings |
| 4 | `pnpm --filter @ilya/web test` | 3846 passed, 1 skipped (3847) |
| 5 | `pnpm test:integration` | 98 passed |
| 6 | `pnpm --filter @ilya/blurb test` | 148 passed |
| 7 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped (790) |
| 8 | `pnpm ratchets` | OK, nothing offered |

The mapping of numbers to gates is inferred (see row 172's step 0 report); the ship script's order is NOT ESTABLISHED.

### Citations on this cut (Fable's table in section 1, re-read here)

| Cite | Now |
|---|---|
| `i18n.ts` `insights.r2.noBetterKey`, `r2.better.tone`, `.interval`, `r2.inKey`, `r2.inKeyShare`, `r2.compare` | read again in step 2 (the file has moved by row 172's three lines and batch 2) |
| `singer-page.ts` `BETTER_KEY_MIN_DROP` `:41`, `KEY_SEARCH_WINDOW` `:44`, `shareAtOrAbovePrimo` `:49`, `shareAboveSecondo` `:55`, `isUnlikely` `:70-79`, `searchBetterKey` `:174-206`, `shareAfter` `:209` | hold |
| `InsightsPane.svelte` `better` block | `:309-338` holds; `shift` `:340-346`; the call into `singerBlocks` `better,` at `:382`; `tryKey` `:520`; `ontry` `:552`; file 760 of 760 |
| `singer-blocks.ts` `KeyForward` `:75-86`, the `forward` type `:50`, the unlikely branch's key `:190-202` | hold; file 414 lines |
| `SingerBlock.svelte` forward `:79-85` | holds; 584 lines |
| `transposition-ruler-state.svelte.ts` `stopFor` | `:95-98`, `readoutFor` `:133-135` hold |

### A1, answered: what `stopFor` measures

`stopFor` calls `stopForSuggestion(printed, choice, semitones, fifths)` (`transposition-ruler.ts:258-270`). Its doc comment and body read: `move = (base?.semitones ?? 0) + semitones`, where `base` is the song's chosen key (the drawn key). **So `semitones` is a move from the drawn key**, and the function adds the drawn key's own offset to find the stop against the printed key. The `fifths` it needs is the landing key's signature, which `keyAfterTransposition(source, s)` gives when `source` is the DRAWN score's first signature, as `searchBetterKey` does today (`singer-page.ts:185`, `score.keySignatures[0]`, with `score` the `analysisScore`). The new search therefore measures every offset from `analysisScore`, the drawn key, and names the landing key by `keyNameFor`. ESTABLISHED by reading; not yet exercised on a drawn-key song (step 3 does).

### Whether tests count against the size ratchet

`scripts/ratchets.mjs:30` (`IS_TEST = /\.(test|spec)\.ts$|\.d\.ts$/`) and `:55` skip test files in the size check. **Tests are not measured.** Closes the review's NOT ESTABLISHED.

### The old branch, read for shape only (A12)

`origin/cloud-lane:apps/web/src/lib/insights/key-suggest.ts` (259 lines) and `key-lines.ts` (124). Read; nothing cherry-picked; `0bb644b2` is not merged. The new code is written against this cut, and departs from the old at: the reference key (A1), the primo axis by declared voice type (A2), passages named by bars and never pitches or counts (A3 and Dann 22:39), fractions in place of percent figures (A3), `insights.key.*` strings (A10).

### Decisions I am making where the brief leaves a choice (all reversible, all listed again in "For Dann")

- **Steps** as above.
- **Passages, not notes.** A key's range part names at most two passages, ranked by sung time out of range in that key, as bar ranges, with `and elsewhere` when more exist. A "passage" is a run of consecutive bars that each hold a note out of range on that side; the time of a passage is the sum of its out-of-range notes' sounding length (`soundingFromNotation`, in whole-note units).
- **The "sustained" part names its bar** (one bar), never the pitch. The brief's `held` field stays an identifier; every string says "sustained".
- **`bass-baritone` counts with tenor, baritone, bass for the primo; `countertenor` counts as treble** (A2 DESK DEFAULTS), with no primo axis for `not-sure` or no declared type.
- **A "suits" key**, for a voice with the primo axis: range inside, nothing at or above the primo, nothing above the secondo, no sustained note above it. For a voice without it: range inside, nothing above the secondo, no sustained note above it (A2).
- **Teacher line** (`insights.r2.teacherA`) stays under "No workable key" (A4 recommends yes).
- **Fraction table** (A3): one table of constants, listed in step 1's section.
- **Reveal** is a `<details>` as the old build had it (A5), summary in `--ink-secondary`, key lines in the forward's rose ink (A6).

### Not established (yet)

- How a singer reaches the analysis in a suggested key from a line, in steps, and whether anything blocks it: traced in step 3, since it needs the wiring.
- The cap's binding count on fixtures: measured in step 4.
- Surrogate vowel counts on fixture voices: step 4.

---

## Step 1: the search (pure)

### What changed

- New `apps/web/src/lib/insights/key-fractions.ts` (33 lines): `fractionOf(share)` and the table.
- New `apps/web/src/lib/insights/key-suggest.ts` (344 lines): `suggestKeys`, `measureKey`, `improves`, `matters`, `suits`, `primoApplies`, `challengeWeight`, `stakesOf`, and the types `ChallengeSet`, `Passage`, `Beyond`, `KeyOption`, `KeySuggestion`, `KeySearchInput`. Nothing else is edited: `searchBetterKey`, `shareAfter`, and `BetterKey` still stand in `singer-page.ts` until step 3, and nothing reads the new modules yet.
- New `apps/web/src/lib/insights/key-suggest.test.ts` (30 tests).

### The fraction table (DESK DEFAULT, JUDGEMENT, one table: `key-fractions.ts`)

| Share of sung time | Said as |
|---|---|
| under 0.20 | no fraction (the line says "some", or says nothing) |
| 0.20 to under 0.29 | about a quarter |
| 0.29 to under 0.40 | about a third |
| 0.40 to under 0.48 | nearly half |
| 0.48 to under 0.55 | about half |
| 0.55 and over | most |

### Where this build departs from the old one, and from the brief's letter

1. **The reference key is the score as INSIGHTS analyses it** (A1): `KeySearchInput.score` is `analysisScore`; every `semitones` is a move from it. Step 3 passes `analysisScore`.
2. **The primo axis exists only for tenor, baritone, bass-baritone, and bass** (A2): `primoApplies`, `PRIMO_VOICES`. For any other type, "not sure", or no type: `set.primo` is absent and `primoShare` is null. The search takes the declared type as its own argument (`voiceType`), as A2 says it must.
3. **"Suits"** (A2's consequence for rule 4): range inside, no primo challenge where the voice has one, nothing above the secondo, no sustained note above it.
4. **Passages, never notes or pitches** (A3, Dann 2026-11-01 22:39): `Beyond` holds the farthest distance in semitones and the ranked bar runs (`Passage`: first bar, last bar, sung time out of range in whole notes). No pitch and no count of notes is in a `KeyOption`; a test fails if one appears.
5. **`improves` is narrower than the brief's "a challenge gained or lost".** The brief says a key qualifies when it gains or loses a challenge, or a share moves by 10 points. Read literally, that shows a key that only adds challenges to a key that already has some. I did not take that to be the intent ("keys that let the singer see, and consent to, the challenges each brings" is about options that bring something better), so a group's key qualifies only when it **loses** a challenge or **lowers** a share by `BETTER_KEY_MIN_DROP`; a key that gains one thing while losing another still shows, and its line (step 2) says both. `matters` (the brief's exact test) is kept and tested. A one-line change in `suggestKeys` restores the literal reading. DESK DEFAULT; Dann's to rule; listed in "For Dann".
6. **When the key read "suits"** the lines under it are empty (no key is offered that only adds challenges); the keys beyond the margin stay under the reveal.
7. **Sustained note**: the identifier is `sustained`, not `held`, and its test is `NoteCondition.held` as `longestAboveSecondo` uses it (`singer-page.ts:100-120`). It needs a tempo only through `chainSeconds` for choosing the longest; a missing tempo picks the first (A7: tempo does not move a share).

### Fixture voices (named, each with a typed range and typed passaggi)

| Name | Range | Primo | Secondo | Declared |
|---|---|---|---|---|
| `TENOR` | C3 to A4 | D4 | G4 | tenor |
| `SOPRANO` | C4 to C6 | E4 | F5 | soprano |
| `BASS` | E2 to E4 | B2 | E3 | bass |

These are test constants (the brief asks for "at least one soprano, one tenor, and one bass"; no low-voice norm in the proof). Step 4 uses real ones for the pictures.

### Tests (what they pin)

Fractions (bands, table ascending, a non-number); `primoApplies` for all nine Tier 1 ids plus none; the same E5 notes give a soprano no primo axis and a tenor one; the weights and `stakesOf`; passages ranked by sung time with bar runs merged; no pitch or count in the output; the two-semitone margin; a note below the range; no typed range gives nothing, no passaggi gives the range axis only; a sustained note moved by the key and a passing note not named; a surrogate vowel leaves the share past the turn and returns null when none is left, while a derived one counts; one group per challenge set, at most three, each improving; keys never worse; order by stakes, primo share, move, lower key; `suits`; `noneBetter`; `noWorkable` with all twelve keys under the reveal; the reveal nearest first; **the cap, on a real four-group piece found by a seeded search (the tenor, 16 quarters): three groups shown (-4, -5, -2), the fourth (-1) under the reveal, `capBound` true**; the intake changes the order and never which keys are shown.

### Gates, after step 1

| # | Result |
|---|---|
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 check | 0 errors, 12 warnings |
| 4 web unit | 3876 passed, 1 skipped (3877) (+30) |
| 5 root integration | 98 passed |
| 6 blurb | 148 passed |
| 7 score-parser | 785 passed, 5 skipped (790) |
| 8 ratchets | OK, nothing offered |

New files are 344 and 33 lines against the 1000-line ceiling; test files are not measured.

---

## Step 2: the words

### What changed

- New `apps/web/src/lib/insights/key-lines.ts` (175 lines): `keyWords`, `keyParts`, `moveWords`, `whereWords`; the types `KeyLine`, `KeyWords`, `NameKey`. Nothing reads it yet (step 3 does).
- `apps/web/src/lib/i18n.ts`: 43 new keys under **`insights.key.*`** (A10; the ruler's `key.*` is not added to). The index at the head of the file: `insights.` 142 to 185 and the total 1,121 to 1,164 (the prefix has a line already, so no new line; `i18n-index.test.ts` passes).
- New `apps/web/src/lib/insights/key-lines.test.ts` (21 tests).
- **The six retired ratified keys are NOT removed in this step.** The brief says they go with their pins in one commit; `singer-blocks.ts` still reads all six until step 3 rewires it, so removing them here would break the build. Step 3 removes them with the pin at `singer-blocks.test.ts:122` and lists them under "Ratified text changed" (A4, `CONTRACT.md` §1 item 11a). This moves the "retired keys and their pins" item from my step 2 to step 3 in the plan above.

### How a line is built

`{move} · {key it lands in}: {parts}.`, where the move is the ruler's own interval words from the key the singer is reading in (`key.ruler.down` and `.up`, `.interval.N`), and the key is the ruler's own naming (`keyNameFor`), so a line never carries "Ilya's recommendation" and never names the offset alone (A1). The page passes a `NameKey` function that returns the landing key's name and the stop; with neither, the line names the move alone. I do not use `readoutFor` for this: its interval is measured from the PRINTED key (`transposition-ruler.ts:102-110`), so on a page the singer already redrew it would describe a different move than the page's own search made.

Parts, each only where the key differs from the key read: the range (passages named by bars, the one or two with the most sung time, "and elsewhere" past two; never a pitch and never a count of notes); the share at or above the primo (a fraction, "some" when too small for one, "nothing" when the challenge is gone); the share above the secondo (same); a sustained note above the secondo, by its bar; the share past the vowels' turn as a fraction, only where it moved by 10 points and can be said as one. The order of the answers: Q1 for a range above, Q2 below, Q3 for the passaggio parts, Q4 for the sustained note; points 1 to 2 add a why, point 3 is plain, points 4 to 5 are terse where a terse form exists (the range only). The passaggi's nouns follow Q7 (`registerFor`). The answers never change which keys are shown (a test pins it).

A key under the reveal that reaches beyond the margin always says where and **how far** ("by a minor third", from the ruler's interval words; "by seven semitones" beyond a tritone: a distance, not a count of notes).

### French

Every French slot carries the English (`TODO-FR`, in the block comment above the keys in `i18n.ts`), nothing French reaches `Shane` before Dann rules. Two of the project's own French guards still apply to those values and are met: the OQLF spacing test needs a no-break space before each colon, so the four values with a colon carry `\u00a0:`; and the Italian-terms test needs `*passaggio*`, `*primo*`, and `*secondo*` in italics, so the seven values that name them carry the asterisks (as the old build's did). Neither changes the English.

### Every new English string, PROPOSED, Dann to rule

| Key | English |
|---|---|
| `insights.key.suits.primo` | No key suggested: as it stands, the song stays inside your range and below {primo}. |
| `insights.key.suits.secondo` | No key suggested: as it stands, the song stays inside your range and below {secondo}. |
| `insights.key.suits.range` | No key suggested: as it stands, the song stays inside your range. |
| `insights.key.noneBetter` | No other key within a tritone changes these challenges by much. |
| `insights.key.noWorkable` | No key within a tritone keeps this song within reach of your voice. Whether to pursue it, or to choose other repertoire, is yours to decide. |
| `insights.key.line` | {readout}: {parts}. |
| `insights.key.where.bar` | bar {n} |
| `insights.key.where.bars` | bars {from} to {to} |
| `insights.key.where.and` | {a} and {b} |
| `insights.key.where.elsewhere` | {where}, and elsewhere |
| `insights.key.part.inside` | stays inside your range |
| `insights.key.part.above` | reaches above your range in {where} |
| `insights.key.part.below` | reaches below your range in {where} |
| `insights.key.part.by` | {part}, by {interval} |
| `insights.key.part.semitones` | {n} semitones |
| `insights.key.part.primo` | {fraction} of the singing sits at or above {primo} |
| `insights.key.part.primoSome` | some of the singing sits at or above {primo} |
| `insights.key.part.primoNone` | nothing sits at or above {primo} |
| `insights.key.part.secondo` | {fraction} of the singing sits above {secondo} |
| `insights.key.part.secondoSome` | some of the singing sits above {secondo} |
| `insights.key.part.secondoNone` | nothing sits above {secondo} |
| `insights.key.part.sustained` | a sustained note above {secondo}, in bar {bar} |
| `insights.key.part.sustainedNone` | no sustained note above {secondo} |
| `insights.key.part.turn` | {fraction} of the singing sits past where your vowels turn |
| `insights.key.terse.above` | above your range in {where} |
| `insights.key.terse.below` | below your range in {where} |
| `insights.key.why.range` | past the notes you typed as your limits |
| `insights.key.why.passaggio` | where the voice turns |
| `insights.key.why.sustained` | a long note in the upper passaggio |
| `insights.key.fraction.quarter` | about a quarter |
| `insights.key.fraction.third` | about a third |
| `insights.key.fraction.nearHalf` | nearly half |
| `insights.key.fraction.half` | about half |
| `insights.key.fraction.most` | most |
| `insights.key.noun.primo.plain` | your first passaggio |
| `insights.key.noun.primo.working` | your primo |
| `insights.key.noun.primo.technical` | your primo passaggio |
| `insights.key.noun.secondo.plain` | your second passaggio |
| `insights.key.noun.secondo.working` | your secondo |
| `insights.key.noun.secondo.technical` | your secondo passaggio |
| `insights.key.reveal.higher` | Show keys that reach higher |
| `insights.key.reveal.lower` | Show keys that reach lower |
| `insights.key.reveal.both` | Show keys that reach higher or lower |

### Gates, after step 2

| # | Result |
|---|---|
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 check | 0 errors, 12 warnings |
| 4 web unit | 3897 passed, 1 skipped (3898) (+21) |
| 5 root integration | 98 passed |
| 6 blurb | 148 passed |
| 7 score-parser | 785 passed, 5 skipped (790) |
| 8 ratchets | OK, nothing offered |

Gates 1, 2, 5, 6, and 7 were measured at the start of the step and not re-run after the two French-guard fixes to `i18n.ts`, which no package reads; gates 3, 4, and 8 were re-run after them. `key-lines.ts` is 175 lines.

---

## Step 3: the wiring

### What changed

- `apps/web/src/lib/insights/InsightsPane.svelte` (760 to 744 lines; ceiling lowered): the `better` block and the `shift` helper (about 38 lines) are replaced by one `keys` `$derived` that calls `suggestKeys` on `analysisScore` with `voiceType?.voiceType`, the facts, the vowel resolver, and the intake, then `keyWords`. A `NameKey` function names the landing key: `keyAfterTransposition(source, semitones)` from the drawn score's own signature (A1), then `keyRuler.stopFor` and `keyNameFor`. `revealOpen` is a second screen-only disclosure beside `moreOpen` (see below). `readoutFor` is no longer called.
- `apps/web/src/lib/insights/singer-blocks.ts` (376 lines): `KeyForward` and the `better` input are gone; `keys?: KeyWords | null` is the input. The conclusion's `forward` is `{ lines, note?, teacher? }`. A new block kind `keyreveal` (screen only, directly after the conclusion) carries "Show keys that reach higher". The teacher line stands under the answer where Ilya calls the key unlikely and no key is shown (`noWorkable` or `noneBetter`; the old build and today's page did the same for "no better key"). The "What another key would change" compare line (`insights.r2.compare`) goes with its string.
- `apps/web/src/lib/insights/SingerBlock.svelte` (598 lines): each key line is a `<p class="forward">` (the rose ink it had) with the existing "Try this key" chip; the reveal is a `<details class="reveal">` whose summary is `--ink-secondary` (A6), hidden in print with the chip.
- `apps/web/src/lib/insights/singer-page.ts` (241 lines): `searchBetterKey`, `shareAfter`, and `BetterKey` are removed, with their eight tests; the header comment and the `BETTER_KEY_MIN_DROP` comment are corrected. `KEY_SEARCH_WINDOW` and `BETTER_KEY_MIN_DROP` stay (the search reads them).
- `apps/web/src/lib/insights/key-lines.ts`: `KeyWords` gains `kind`; `moveWords` no longer lowers the French interval (a French line starts with it: « Un ton plus bas »; a mid-sentence use, `reachWords`, still lowers it).
- `apps/web/src/lib/i18n.ts`: the six retired keys are removed (below); the index reads `insights.` 179 and 1,158 keys.
- `packages/score-parser/src/analysis-types.ts:66`: the `fR1Source` comment no longer says "nothing writes it yet"; it says `analyze-score-adapter.ts` writes `'surrogate'` (A11; `analyze-score-adapter.ts:188`, `:269`).
- `apps/web/src/lib/insights/singer-blocks.test.ts`: the pin at `:122` now expects the key words and the teacher line; the French "better key" test goes with its string; a new block of five tests pins the forward, the one-line answers, the reveal's place, and the retirement.

### Ratified text changed (`CONTRACT.md` section 1 item 11a): six keys retired, with their pin

Each named one key as the better one and lost its only reader. Removed from `i18n.ts` in this commit with the pin at `singer-blocks.test.ts:122` (rewritten) and the French test at `singer-blocks.test.ts:191-203` (removed). `insights.r2.teacherA` is not retired; it is still read.

| Key | English | French |
|---|---|---|
| `insights.r2.noBetterKey` | No other key within a tritone fits your voice better. | Aucune autre tonalité, à un triton ou moins, ne convient mieux à votre voix. |
| `insights.r2.better.tone` | This key suits your voice. A tone lower would keep more of the line below your passaggio. | Cette tonalité convient à votre voix. Un ton plus bas garderait une plus grande part de la ligne sous votre *passaggio*. |
| `insights.r2.better.interval` | This key suits your voice. {A} lower would keep more of the line below your passaggio. | Cette tonalité convient à votre voix. {A} plus bas garderait une plus grande part de la ligne sous votre *passaggio*. |
| `insights.r2.compare` | A key {interval} lower would bring that to {m} percent, and the compass, {low} to {high}, stays inside your range. | Transposée {interval} plus bas, la pièce ramènerait cette part à {m} %, et son ambitus, {low} à {high}, resterait dans le vôtre. |
| `insights.r2.inKey` | In {key}, {n} percent of the singing lies at or above your primo passaggio, and the {pitch} of bar {bar} becomes {pitch2}, under your secondo passaggio. | En {key}, {n} % du chant se situe sur votre *primo passaggio* ou au-dessus, et le {pitch} de la mesure {bar} devient {pitch2}, sous votre *secondo passaggio*. |
| `insights.r2.inKeyShare` | In {key}, {n} percent of the singing lies at or above your primo passaggio. | En {key}, {n} % du chant se situe sur votre *primo passaggio* ou au-dessus. |

### The reveal and the page's two disclosures

The Insights page is paginated by measuring each block off screen. Its one screen-only block, "N more observations", rides with the block before it while closed, is measured open, and is closed for print (`InsightsPane.svelte`, the comment block above `moreOpen`). The reveal needed the same treatment and its own state, or opening one would open the other. So: a new block kind `keyreveal`, screen only, directly after the conclusion; `revealOpen` beside `moreOpen`; `openOf(k)` picks the right one for the printed list, the riding rule, the measurer, and the `<details>`; both are closed on `beforeprint` and restored on `afterprint`; `BREAKS` includes `keyreveal` so a long list can break across pages when open. The reveal does not print (the line's chip and the whole disclosure are `display: none` in print), so paper keeps the pages it had.

### How a singer reaches the analysis in a suggested key, in steps (read in the code; the browser walk is in step 4)

1. On INSIGHTS the line reads, for example, "Down a whole tone · C minor: stays inside your range." with a "Try this key" chip (`SingerBlock.svelte`, `keyLine`).
2. The chip calls `keyRuler.tryKey(stop)` (`InsightsPane.svelte`, `tryKey`): it stores `requested = stop` and calls `tryAnother` (`transposition-ruler-state.svelte.ts`, `tryKey` and `tryAnother`).
3. `tryAnother` brings MELODY forward when INSIGHTS is showing (`toMarkup()`) and sets `open = true`: the ruler floats over MELODY with that stop selected, and MELODY draws the page in that key while the ruler is open (`drawn` is `ruler.selected` while `open`).
4. The singer taps "Use this key". `use(next)` writes `song().transposition` and closes the ruler. Cancelling or closing instead leaves the song's old choice (`drawn` falls back to it), and INSIGHTS is unchanged.
5. The singer goes back to INSIGHTS. `readingScore = keyRuler.draw(printedReading)` draws it in the chosen key, so `analysisScore`, the model, every share, the comments, and now the search all start from the new key; the page then reads "as it stands" about it, and the new search offers moves from there.
6. **What can block it:** (a) no chip, when the printed key has no named mode, so `printedKey` returns null and `stopFor` returns null: the line then names the move in the ruler's words and the singer moves the ruler by hand from MELODY; (b) the chip only opens the ruler: INSIGHTS does not change until "Use this key" is tapped (step 4); (c) the whole of this is behind `PUBLIC_INCLUDE_MARKUP_INSIGHTS`. Nothing else blocks it that I found.

### Decisions I took (reversible; listed again in "For Dann" in step 4)

- The "suits" line is shown on INSIGHTS whenever the key read suits (the brief: "No key suggested ... in one line").
- The teacher line stands under both "No workable key" and "No other key ... changes these challenges", for an unlikely piece, as today (A4 recommends it for "No workable key" only; the second is today's behaviour kept).
- `readoutFor` (`transposition-ruler-state.svelte.ts:134`, `insights.ts:68`) has no reader now. I left it: Markup's ruler is untouched (rule 1), and removing it is a one-line change for whoever wants it gone.

### Gates, after step 3

| # | Result |
|---|---|
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 check | 0 errors, 12 warnings |
| 4 web unit | 3895 passed, 1 skipped (3896) (-2: eight `searchBetterKey` tests and the French better-key test out, five forward and reveal tests in) |
| 5 root integration | 98 passed |
| 6 blurb | 148 passed |
| 7 score-parser | 785 passed, 5 skipped (790) |
| 8 ratchets | OK; `InsightsPane.svelte` 760 to 744, taken |

Not yet run in this step: the Playwright projects (step 4 runs the INSIGHTS and print specs).

---

## Step 4: the proof, "For Dann", and what could not be established

### What changed

- New `apps/web/e2e/insights-key-lines.test.ts`: 15 tests on the real INSIGHTS page, at 1440 px and at 390 px (the desk project with a 390 px viewport; the page's own phone layout, `.insights-flow`), with five named fixture voices on the one tracked engraved fixture (Sunless no. 1, C#3 to D4). `N182_SHOTS=<folder>` saves the pictures; without it the spec only asserts words.
- Pictures, English: `docs/sessions/n182-shots-r2/` (14 PNGs, desktop and phone for each of seven states).

### The named fixture voices (typed range, typed passaggi, declared type)

| Name | Type | Range | Primo | Secondo | State it shows |
|---|---|---|---|---|---|
| `TENOR_T` | tenor | C3 to F♯4 | E♭4 | G4 | a key that suits |
| `SOPRANO_S` | soprano | C4 to C6 | E4 | F5 | a key that suits, with no primo axis: the line names her secondo |
| `BASS_B1` | bass | C2 to F♯3 | C3 | E3 | one group; the reveal |
| `BASS_B2` | bass | D2 to C4 | E3 | G♯3 | three groups |
| `NOVICE_N` | baritone | A2 to F3 (eight semitones) | D3 | F3 | no workable key |
| `BARITONE` | baritone | G♯2 to B♭3 | B♭3 | D4 | more groups than the cap |

These are test voices, not norms (the brief: no low-voice norm in the proof). All ten of their vowels are `'sung'` in `fR1Source` (read by running `buildVoiceProfileSnapshot` on the spec's formant table); **no fixture vowel is a surrogate**, so the surrogate exclusion is proven by the unit tests (`key-suggest.test.ts`) and not by a picture. NOT ESTABLISHED: how many vowels a singer's real, partly calibrated voice leaves as surrogate.

### The pictures (read, not just taken)

| State | Desktop | 390 px |
|---|---|---|
| Suits (tenor) | `suits-tenor-desktop.png` | `suits-tenor-phone.png` |
| Suits, no primo axis (soprano) | `suits-soprano-desktop.png` | `suits-soprano-phone.png` |
| One group (bass) | `one-group-bass-desktop.png` | `one-group-bass-phone.png` |
| Three groups (bass) | `three-groups-bass-desktop.png` | `three-groups-bass-phone.png` |
| No workable key (novice) | `no-workable-novice-desktop.png` | `no-workable-novice-phone.png` |
| The reveal, open (bass) | `reveal-bass-desktop.png` | `reveal-bass-phone.png` |
| The cap binding (baritone) | `cap-binds-baritone-desktop.png` | `cap-binds-baritone-phone.png` |

Read: the key lines carry the rose ink they had; the "Try this key" chip is on each; the reveal's summary is grey and its lines are told apart by their words ("by a minor third", "by a major third", "by a perfect fourth"); the reveal opens in the flow and the page re-paginates around it; the novice's page shows "No key within a tritone keeps this song within reach of your voice. Whether to pursue it, or to choose other repertoire, is yours to decide." and the teacher line. I read the three-groups desktop picture, the reveal pictures at both widths, and the novice's desktop picture closely; the others only for structure (the spec asserts their words).

**One thing the pictures show that I did not expect:** because INSIGHTS analyses the score after the octave reading of row 47 (A7), the same fixture reads as a soprano's song an octave up. So `SOPRANO_S` gets "suits", not "no workable key", and the no-workable picture needed a voice whose range is narrower than the song itself (`NOVICE_N`).

### The path from a line to the analysis, walked in the browser

`insights-key-lines.test.ts`, "from a key line to the analysis": click "Try this key" on `BASS_B2`'s first line; MELODY comes forward with the ruler open ("Use this key" is visible); returning to INSIGHTS without using the key leaves the page byte for byte as it was (the ruler closes when MELODY is left); clicking the chip again and "Use this key", then returning to INSIGHTS, gives a page whose text differs (the song is read in the chosen key). Passes. This confirms the steps in step 3's section. Nothing blocked it for these voices. The one block I named there (no chip when the printed key has no named mode) is read in the code, not exercised: NOT ESTABLISHED in the browser.

### Regression: the INSIGHTS and print specs on the desk project

Ran `insights-page`, `octave-line`, `tempo`, `singer-paths`, `print-pages`, and `pages-without-gaps` (which pages every document in both languages and checks that nothing reaches a footer): 44 passed, 3 failed. The three are the ones that fail identically on the untouched cut `f9797acb` (row 172, step 2): `insights-page.test.ts:95` (it looks for the frame sentence "Ilya does not invent advice", which was rewritten on 2026-10-11), `print-pages.test.ts:20`, and `singer-paths.test.ts:169`. Nothing new fails. The phone project was not re-run for this row; it has no INSIGHTS spec.

### Gates, after step 4

| # | Result |
|---|---|
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 check | 0 errors, 12 warnings |
| 4 web unit | 3895 passed, 1 skipped (3896) |
| 5 root integration | 98 passed |
| 6 blurb | 148 passed |
| 7 score-parser | 785 passed, 5 skipped (790) |
| 8 ratchets | OK, nothing offered |

### How often the cap binds (the brief asks; the answer is for a grid, not for singers)

A grid of 5 declared types by range, span, and primo placements, run against the two tracked fixtures (840 voices each, 1,680 in all): the cap bound in 15 of 840 for Sunless no. 1 and 28 of 840 for the Tchaikovsky (2.6 percent overall; 563 and 412 of the voices got keys to show at all). The grid is not a sample of real singers, so this says only that the cap is reachable and rare on these two songs. NOT ESTABLISHED: the rate for real voices and repertoire; that needs the voices from Dann's usage, which this lane cannot read.

### For Dann

**A. Strings to rule (English; PROPOSED).** All 43, in step 2's table. The ones that carry the ruling's weight, as a singer reads them:

1. The key line: "Down a whole tone · C major: stays inside your range; most of the singing sits at or above your primo; some of the singing sits above your secondo."
2. The range part names bars, never pitches or a count: "reaches above your range in bar 6", "reaches below your range in bars 7 to 9 and bars 4 to 5, and elsewhere".
3. The reveal's reach: "…, by a minor third".
4. The three one-line answers (suits, none better, no workable key).

**B. Calls I made where the brief leaves a choice or reads two ways (each reversible).**

1. **A key must improve something** (`improves`). The brief's rule 4 says "a challenge gained or lost, or a share moved by at least 10 points". Read literally, a key that only adds challenges would show. I show a key only when it loses a challenge or lowers a share by 10 points. **Look at the one-group picture:** `BASS_B1` is offered "Down a minor third · B major: reaches below your range in bars 7 to 9 and bars 4 to 5, and elsewhere; nothing sits at or above your primo." It loses a small primo share (7 percent of the singing) and gains a range challenge below. By my rule that is an improvement; you may think it is a trade not worth offering. A stricter rule (the number of challenges must go down, so a swap is not shown) is a few lines. **Your call: which?**
2. **Teacher line under both "No workable key" and "No other key ... changes these challenges", for a piece Ilya calls unlikely**, as today (A4 recommends the first only).
3. **Fractions** (`key-fractions.ts`): under 0.20 no fraction (the line says "some"); 0.20 a quarter, 0.29 a third, 0.40 nearly half, 0.48 half, 0.55 most. One table; yours to change.
4. **The cap is three** (DESK DEFAULT, yours to strike); the reveal holds the rest.
5. **`bass-baritone` counts with the primo voices; `countertenor` is treble** (A2, DESK DEFAULT).
6. **The weights of the stakes** (1, 0.75, 0.5) are this row's own, not written back into N.173 (A8).
7. **A line names at most two passages** (by sung time out of range, in the key suggested), then "and elsewhere".
8. **French**: every `insights.key.*` French value is the English with `TODO-FR`; two project guards force a no-break space before four colons and asterisk italics on seven values, in the French only. The desk drafts the French after you rule the English.
9. **Ratified text changed (CONTRACT section 1, item 11a): six keys retired** with their pin: `insights.r2.noBetterKey`, `.better.tone`, `.better.interval`, `.inKey`, `.inKeyShare`, `.compare` (full text in step 3's table).

**C. Not asked, but you should know.**

- The primo axis follows the *declared* type. A singer with no declared type, or "not sure", gets lines with no primo at all, as you ruled. In the proof, a soprano and a novice baritone show what that looks like.
- INSIGHTS analyses the song after the octave reading, so the search is run on the song as that singer would read it, not as printed.
- `readoutFor` has no reader now (Markup's ruler is untouched; I left it).

### Could not establish

- The cap's rate for real singers (above).
- How many vowels of a real, partly calibrated voice are surrogate.
- The no-chip case (a printed key with no named mode) in the browser.
- The ship script's gate order (gate numbers are inferred, as in row 172's step 0).
- The French of every new string (owed).
- The phone project (`e2e-phone`) for INSIGHTS: the 390 px pictures come from the desk project at a 390 px viewport, which draws the page's phone layout but is not a touch device.

### Commits on `cloud-lane-29` for this row

Step 0 `2788cc88`, step 1 `a5e94cf9`, step 2 `7d993e09`, step 3 `a8931b16`, step 4 (this commit).
