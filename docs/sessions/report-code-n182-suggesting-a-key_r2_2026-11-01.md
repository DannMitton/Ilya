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
