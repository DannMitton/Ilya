# Report: Corrections slice 3, step 0 (read and record), Code, cloud, 2026-11-05

Read on branch `cloud-lane-35`, cut from `origin/Shane` at `2e3803d` ("Desk 2026-11-04 night …"). Working tree clean at the start. No code changed in this step. Brief: `brief-code-corrections-slice3-answers-kept_r2_2026-11-05.md`, its Amendments winning.

## What I read

The brief, `plan-corrections-build_r1_2026-10-08.md` (the "What the tree has today" list and the slice table), `plan-corrections-build_r2_2026-11-05.md` (lines 12, 20, 29, 43 only: where "Not now" lives is open there), `OPEN.md` "THE CORRECTIONS REDESIGN" (items 1 to 18, line 2946 on), `CONTRACT.md` §4, `library.ts`, `types.ts` (`SongRecord`), `document.svelte.ts`, `bars-to-confirm.ts`, `offers-for-a-bar.ts`, `correction.ts`, `+page.svelte` (`applyArrival`), and the `Measure`, `VocalLineEvent`, `Duration`, and `TupletInfo` types in `packages/score-parser/src/types.ts`.

I did not read `review-fable-brief-slice3-and-plan-r2_r1_2026-11-05.md`. Its seven amendments are in the brief's own section, which wins, so I took them from there.

## The brief's line citations against today's tree

All of these held, or moved by a few lines.

| Brief | Today |
|---|---|
| `bars-to-confirm.ts:55` | `barsToConfirm` at `:55`. Held. |
| `offers-for-a-bar.ts:119` | `offersForABar` at `:119`. Held. |
| `library.ts:47-77` `SongFields` | Held. |
| `library.ts:102-110` copy | `fieldsFromRecord` return at `:88-111`; the optional-field copies at `:102-110`. Held. |
| `library.ts:125` strip | Held (the destructure, one line). |
| `library.ts:140-150` write | Held. |
| `library.ts:172` `validateRecord` | Held. |
| `library.ts:236-237` `seatedText` | Held. |
| `library.ts:273-279` `publishedGlosses` | Held. |
| `library.ts:282-291` `poemSource` | Held. |
| `document.svelte.ts:202`, `:313` | `:202` is `readOnly = loadFailure === 'malformed' \|\| …`; `:313` is `if (this.readOnly) return;` in `#write`; `:243` is the same guard in the effect. Held. |
| `document.svelte.ts:288-307`, `:340-363` | `#snapshot` and `#apply`. Held. |
| `correction.ts:109`, `:357`, `:444`, `:709`, `:738` | `CorrectionMap`, `applyCorrections`, `reflowOnsets`, `migrateCorrectionIds`, `orphanIds`. Held. |
| `+page.svelte:2849-2856` as `applyArrival` | **Moved.** `applyArrival` begins at `+page.svelte:2737`. Lines `:2849-2856` are inside it and hold the pairings re-key and merge (`rekeyOnArrival`, `mergeOnUploadObserving`), not the corrections. See question 2. |

## Answers

### 1. What identifies a bar stably across a reload and across later corrections?

**The measure index, with a fingerprint of the bar's corrected events.** Neither alone.

- `VocalLineEvent.measureIndex` and `Measure.index` are the parser's 0-based sequential index (`packages/score-parser/src/types.ts`, `Measure.index`; `bars-to-confirm.ts:35`, "as `VocalLineEvent.measureIndex` names it"). The song's bytes are stored and re-read the same way, so the index of a given bar is stable across a reload of the same score.
- The index does not say whether the bar still holds what the singer answered about. A correction changes a bar's events without changing its index (`amend`, `correction.ts:529`), and a replaced score can put different bars under the same index. So the index is the key and the fingerprint is the check.
- The event id is not usable as the bar's identity: ids are re-keyed on load by `migrateCorrectionIds` (`correction.ts:709`) and a hand-entered event has its own id from the correction map.
- The key for the field is `String(measureIndex)`, as `CorrectionMap` keys by string (`correction.ts:109`), per amendment 7.

### 2. What happens to stored answers when the score is replaced?

- **Corrections are not touched by a replacement.** In `applyArrival` (`+page.svelte:2737`), `replaceWholeSong` clears `doc.pairings` and re-seats `doc.seatedText` (`:2743-2747`). `doc.corrections` is assigned only through `setCorrections` (`:861`, `:915`), the Loupe's own writer. I found no `doc.corrections =` in the arrival path.
- **A correction that no longer lands is kept and counted.** `orphanIds` (`correction.ts:738`) lists the ids in the map that no event carries, derived on each read, and the drawer says so. Nothing is pruned.
- **The same design for answers, as the brief says:** keep the answers on a replacement, and let the fingerprint decide whether an answer is honoured. An answer whose bar now holds different events is not honoured and the bar is asked again. A stale answer stays in the record (amendment 6). Slice 6 may count them.
- **One thing this does not cover.** A replaced score whose bar happens to have the same events at the same index would honour the old answer. I judge that correct: the singer answered about those notes in that metre, and the fingerprint says they are the same notes in the same metre. I could not establish a case where it misleads, but I did not look at one on a real replaced score.

### 3. How a correction is stored per note

`CorrectionMap = Record<string, NoteCorrection>`, keyed by event id (`correction.ts:109`). Every field of `NoteCorrection` is optional and absence means untouched (`:48`): `pitch`, `base`, `dots`, `deleted`, `entered`, `type`, `tied`, `tuplet`. `applyCorrections` (`:357`) returns the corrected line, `amend` (`:529`) replaces duration, pitch, and type, and `reflowOnsets` (`:444`) moves later onsets. The corrected event keeps `duration.base`, `duration.dots`, and `duration.tuplet` (`actualNotes`, `normalNotes`, `normalType`), which is what the fingerprint reads (amendment 4).

### 4. The song record and where a new field has to be carried

The pattern, read from `seatedText`, `publishedGlosses`, and `poemSource`:

1. `SongRecord` (`types.ts`): an optional field with a comment, additive, `RECORD_SCHEMA` unchanged.
2. `SongFields` (`library.ts:47-77`): the page-side field.
3. `fieldsFromRecord` (`:88-111`): absent reads as the empty value.
4. `recordFromFields` (`:119-152`): the field is dropped from `base` in the destructure at `:125`, then written back only when non-empty.
5. `validateRecord` (`:172`): a field that is not the right shape is `malformed()`; inside `publishedGlosses` a bad row is filtered out and the rest kept (`:273-279`). Amendment 1 asks for that second behaviour inside the answers object.
6. `document.svelte.ts`: a `$state` field, a line in `#snapshot` (`:288-308`), and a line in `#apply` (`:340-363`). Without the last two, autosave rebuilds the record from fields and drops the new field (amendment 2).

`malformed()` costs the song its saves (`readOnly`, `document.svelte.ts:202`, `:243`, `:313`). Amendment 1 is why a damaged answer is dropped and not reported malformed.

### 5. What the arithmetic of a bar is, and who computes it

This brief changes no computation, so it names no other computing sites (`CONTRACT.md` §4, the condition). The fingerprint reads fields the parser and `applyCorrections` already produce.

## Baseline gates

Measured on the fresh clone at `2e3803d` after `pnpm install --frozen-lockfile`, with the commands CI and `gates-scratch.sh` use. 

| Gate | Command | Result |
|---|---|---|
| 1 phonology | `pnpm test:phonology` | 407 passed (407) |
| 2 dictionary | `pnpm test:dictionary` | 248 passed (248) |
| 3 web-check | `svelte-check` in `apps/web` | 0 errors, 12 warnings, 5 files with problems |
| 4 web unit | `pnpm --filter @ilya/web test` | 4198 passed, 1 skipped (4199) |
| 5 score-parser | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped (790) |
| 6 blurb | `pnpm test:blurb` | 148 passed (148) |
| 7 integration | `pnpm test:integration` | 125 passed (125) |
| 8 ratchets | `pnpm ratchets` | OK, 655 source files |

These are the baseline for steps 1 and 2. Gates 1, 5, and 6 differ from the numbers in the stale `gates-scratch.sh` (251, 680, 145); that script is from 2026-10-12. Gate 4 and gate 7 match the figures in `STATE.md` ("4198 passed | 1 skipped (4199)" and 125). I did not find a current list of the Mac script's expected figures for gates 1, 5, and 6, so whether these three are at the Mac's baseline is NOT ESTABLISHED; they are the figures from a clean Linux clone of `Shane`.

## NOT ESTABLISHED

- Whether Dann wants a pitch nudge to leave the fingerprint unchanged. The brief marks this DESK DEFAULT and leaves it to Dann (amendment 4). I follow the default.
- Where "Not now" lives (plan r2 decides before slice 6R). `put-away` is kept in the shape and marked NOT WIRED (amendment 3).
- That a fingerprint excluding `tied` and `normalType` is enough. The brief names type, base, dots, tuplet ratio, and metre. A tie does not change a bar's sum, and a tuplet's `normalType` does not change its ratio. I did not test either against a real score.
- How a hand-entered event (`entered`) counts in a bar's fingerprint. `applyCorrections` emits it as an ordinary event in its measure, so the fingerprint includes it. I read that from `emitEntered` and `synthesize` (`correction.ts:357-440`, `:579`), not from a run.
