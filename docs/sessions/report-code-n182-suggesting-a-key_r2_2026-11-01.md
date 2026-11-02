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
