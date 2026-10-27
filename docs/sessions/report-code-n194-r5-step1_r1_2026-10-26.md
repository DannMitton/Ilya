# Report: Code, N.194 r5, step 1 (the unit logic and its two doors), 2026-10-26

Lane `cloud-lane-15`, after step 0 (`7e68bcf`). Read and run in the Linux cloud sandbox at `Shane` `54c01bc3` plus this lane. Nothing under `docs/memory/` was edited, the brief and its companions were not edited, and no approval was re-approved.

## What I changed

All new files, all under `apps/web/src/lib/text/`. No existing file changed.

- `syntactic-break-unit.ts` (95 lines): the desk's draft seated WITHOUT `toggleBreak` and `normalizeBreaks` (`code-n194-...unit_r1:48-81`, the per-song map r4 does not store). What stays: `UnitWord`, `unitEnd`, `SlotAt`, `terminalSlotIndex`, `breakTarget`, byte for byte except the header, which now names the ratified "Break after this word" where the draft said "Insert break here".
- `syntactic-break-adapters.ts` (62 lines): two entry points over the one `unitEnd`.
  - `unitWordsFromPre(words, sets)` for the pipeline's boundary pass (step 2). It tests a proclitic and an enclitic the way `boundaries.ts:52-55` does, from `cleanWord` and `promotedFromClitic`, and adds the two guards the pipeline's own flags carry and `boundaries.ts` lacks: a word after punctuation is not an enclitic (`pipeline.ts:783-788`, `prevHasPunct`), and «о» as an interjection is not a proclitic (`pipeline.ts:772-778`). The second guard is mine, not the brief's: without it «О дай» disagrees with the finished words (see below).
  - `unitWordsFromStacks(words)` for the button (step 4), reading `isProclitic` and `isEnclitic` from the word.
  - In both, `hyphenToNext` is true when `punctuation` is exactly one of `-`, U+2010, U+2011.
- `syntactic-break-unit.test.ts`: the desk's tests ported to vitest.
- `syntactic-break-adapters.test.ts`: the pipeline-built tests.

## Tests added, and which failed before

Neither module existed, so every test fails on the previous tree by import; the meaningful check is the mutants below.

| file | count |
|---|---|
| `apps/web/src/lib/text/syntactic-break-unit.test.ts` | **19** |
| `apps/web/src/lib/text/syntactic-break-adapters.test.ts` | **37** |

Total **56**; gate 4 moved 3057 to 3113, which is 56.

The 19 are the draft's 22 minus its 3 (`toggleBreak`, `normalizeBreaks`, and the property test of `normalizeBreaks`), with every remaining assertion, the property tests, and the independent oracle kept. The draft's 3 removed are `.test:84-105`; I ported by translating `assert.equal`, `assert.deepEqual`, and `assert.ok` into `expect(...).toBe`, `.toEqual`, `.toBe(true)` with a script, not by hand.

**Mutants of `unitEnd`** (remove one joining condition from `syntactic-break-unit.ts:43`, run the file, restore):

| condition removed | result |
|---|---|
| `here.isProclitic` | 5 failed, 14 passed |
| `here.hyphenToNext` | 4 failed, 15 passed |
| `next.isEnclitic` | 5 failed, 14 passed |

**Mutants of the pre-flag door** (`syntactic-break-adapters.ts`): drop the `prevHasPunct` guard, 2 fail (`«тень, же дом»` and the guard's own test); drop the interjection guard, 2 fail (`«О дай»`, `«О, дай»`); make the hyphen never join, 3 fail (`«велит-ли»` twice, `«слово - слово»`). Each file restored and diffed identical.

## Done-when

**1. Ported tests pass, each mutant fails.** Met, above.

**2. The four lines.** On `processText`'s own output (the real dictionary, `GraysonEngine` as the clitic sets), each door gives the unit's last word:

| line | unit end of each word |
|---|---|
| «велит-ли» | [1, 1] |
| «сказал бы» | [1, 1] |
| «не в силах» | [2, 2, 2] |
| «тень непроглядная» | [0, 1] |

The two doors give the same ends on those four and on eleven more (the 15 in the `the two doors agree` block). The pre-flag door is fed the finished words from `processText`, because `PreTranscribeWord` is not exported and `WordStackData` has the same four fields it reads (`cyrillic`, `cleanWord`, `punctuation`, `promotedFromClitic?`). **That is not the pre-flag words themselves**: the real call, in step 2, runs after `joinAfterNe` has merged a «не» into its word. NOT established until step 2 calls it in place.

**The merge agreement (section 5, item 5).** For every word the merge pass fused ('→' forward, '←' back) on «не в силах», «сказал бы», «если б мог», «сад ли», «Ты же дом», «в доме», «я не в силах», `unitEnd` puts the clitic and the word it was fused into in one unit. The test asserts at least one merged word per line, so it cannot pass by looking at nothing. It found no disagreement on those lines. **A divergence by reading, NOT RUN:** `pairings.ts:218` fuses ANY vowelless word that is not a proclitic into the previous slot (`!w.isProclitic && lastInLine !== null`), where `unitEnd` treats a vowelless word that is not an enclitic as its own unit. The only words that differ are vowelless non-clitics, and a vowelless word after punctuation («тень, б мог»: «б» is not an enclitic after a comma). That word owns no slot, the unit before it ends in a hard boundary, and the pill is off there, so no press reaches it. I report it and pick neither.

**3. What a hyphen does where the particle is not in `HYPHENATED_PARTICLES`.** Measured: «кое-что», «вот-вот», «чёрно-белый», «ну-ка», «пойдём-ка» each come out as ONE word, `cleanWord` with the hyphen removed («коечто», «вотвот», «нука», «пойдёмка»), `punctuation` empty. So `hyphenToNext` is false, the unit is the word, and the `#` goes after the whole token. A break cannot land between the parts. Only ли ль бы б же ж split a host from its particle (`typed-hyphens.ts:131`), and a split leaves the hyphen as the host's trailing `punctuation` (measured: «велит-ли» is «велит-», `cleanWord` «велит», `punctuation` «-»; «сад-ли» is the same).

**Which field carries the hyphen (the brief's test).** `punctuation`, confirmed for «велит-ли». For a spaced dash:

- «слово – слово» (en dash): the dash token is dropped, two words, as the brief said.
- **«слово - слово» (ASCII hyphen, spaces): NOT dropped. The brief's claim that the lone dash "has no letters and is dropped at `pipeline.ts:183-186`" is wrong for the ASCII hyphen.** That filter is now `peelSyntacticBreaks`' `isWord` (`pipeline.ts:177`: `word.replace(PUNCTUATION_REGEX, '').length > 0`), and `PUNCTUATION_REGEX` (`pipeline.ts:54`) holds no hyphen. The result is three words: «слово», then a word with `cyrillic` «-», `cleanWord` «», `punctuation` «-», then «слово». My test pins this. Consequence for the adapter: the «-» word has `hyphenToNext` true, so it joins the word after it, and «слово» before it still ends its own unit. The button before a spaced hyphen therefore works (Dann 23:53), and the unit of the second «слово» is [«-», «слово»], whose end is the same word. No wrong target follows. I changed nothing in the pipeline.

## What this does not close (his to rule)

**«слово- слово» (hyphen touching the left word, space after) reads as a joiner.** The host is «слово-», `punctuation` «-», so `hyphenToNext` is true, and the unit is both words. A press from the first «слово» would place the `#` after the second. The brief's DESK DEFAULT says a hyphen with a space beside it is a dash and not a joiner, but the tokenizer keeps no record of the space, so a door that reads the word cannot tell. The fix I would propose: have `splitIntoPreLines` mark the pieces of one hyphenated token (they already come out of one `expandHyphenatedParticles` call) instead of the adapter inferring from `punctuation`. That adds lines to `pipeline.ts`, which is at its ceiling, so I did not build it; step 3's offsets give the same fact for free (pieces of one token share one offset pair), so I will test it there and report. It is a typed-text edge, but it is the one place the unit can be wrong.

## Sites that compute a unit, a boundary, or a syllable target (section 5), verdicts so far

1. Batch C's list: re-read in `report-code-batch-c-b3_r1_2026-10-21.md`; it holds. Its `syntacticBreak` field exists as `pipeline.ts:70`, `:119` and `types.ts:59`.
2. `boundaries.ts:37` and `engine.ts` copy: the button will read the engine's verdict, not the pattern. Nothing built yet.
3. **The three hyphen sites need no change for the break to behave.** `typed-hyphens.ts` splits only the six particles, and a split host keeps its hyphen as `punctuation`; `pipeline.ts:788` makes the particle not an enclitic after that hyphen, which `hyphenToNext` covers; `pairings.ts:222` (`/[-–—]$/`) is display-only, choosing the joiner between a host's Cyrillic and a fused clitic's. Changed none.
4. Whitespace splits: not yet; step 3 and 5a.
5. Sites that compute a unit: `pipeline.ts` clitic merge, `clitics.ts` `resolveCliticChain`, `boundaries.ts:52-55`, `pairings.ts:213-226`: compared above. `unitEnd` is the sixth. `seatCliticFolds` / `clitic-seat.ts` NOT READ by me in this step.
6. The syllable target: `terminalSlotIndex` against `buildSlotQueue` (`pairings.ts:203-250`): the vowelless-clitic branch and `lastInLine` match what the module's header says. The jump will read `slotQueue`, not a second walk of the words (step 4).

## Where would this wall a singer in? (step 1's part)

- A typed «слово- слово» puts the `#` after the wrong word (above).
- A song that reads «О дай» with the capital: «О» is a first-word interjection, so the pill does not treat it as leaning on «дай». That agrees with the finished words and with Text.

## The eight gates

Baselines are the task's, measured on `Shane` at `54c01bc3`; my own run before step 0 matched all eight. I could not read the ship script.

| gate | command | baseline | after step 1 |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 291 passed (291) | 291 passed (291) |
| 2 | `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) |
| 3 | `pnpm --filter @ilya/web check` | found 0 errors and 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 3057 passed (3057) | **3113 passed (3113)**, +56, both new files |
| 5 | `pnpm --filter @ilya/score-parser test` | 775 passed \| 5 skipped (780) | 775 passed \| 5 skipped (780) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | ratchets: OK. | ratchets: OK. |

The approval corpus and the staff-renderer approval did not move (gate 4 and gate 5 pass unchanged). Ceilings: none changed; `+page.svelte` 5581 of 5597, `pipeline.ts` 925 of 925, `Loupe.svelte` 3012 of 3013.

## What I could not establish

- Whether the pre-flag door agrees with the real pre-flag words after `joinAfterNe`: NOT RUN until step 2.
- The divergence between `pairings.ts:218` and `unitEnd` on a vowelless non-clitic after punctuation: by reading, NOT RUN.
- `lineEndsWithQuestion` in the interjection guard: the pipeline reads the raw line text (`pipeline.ts:761`), the door reads the last word's `cyrillic`. They differ only where a `#` follows a final «?», because the peel has removed it from the word. Not tested.
- `seatCliticFolds` and `clitic-seat.ts`: NOT READ.
- The ship script's gate lines: NOT READ (unreachable).

## Strings owed to Dann

None. Step 1 adds no string.
