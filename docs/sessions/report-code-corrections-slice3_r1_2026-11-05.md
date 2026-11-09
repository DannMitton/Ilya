# Report: Corrections slice 3, what the singer answered is kept with the song (Code, cloud, 2026-11-05)

Branch `cloud-lane-35`, cut from `origin/Shane` at `2e3803d`. Brief: `brief-code-corrections-slice3-answers-kept_r2_2026-11-05.md`, its Amendments winning. Step 0's report: `report-code-corrections-slice3-step0_r1_2026-11-05.md`. No pull request; `Shane`, `main`, `+page.svelte`, `CorrectionSurface.svelte`, `Loupe.svelte`, and `docs/memory/` untouched. Nothing the singer sees has changed. This brief changes no computation, so it names no other computing sites (`CONTRACT.md` §4, the condition).

## What was built

### The shape (amendment 7)

`{ bars: Record<string, { kind, fingerprint }>, putAway?: true }`, one entry per bar keyed by `String(measureIndex)`, the last answer replacing. `kind` is `matches-print` or `changed`. `putAway` is kept in the shape and marked NOT WIRED (amendment 3): nothing writes it, and the comments say plan r2 decides where Not now lives before slice 6R.

### The pure module, `apps/web/src/lib/score/bar-answers.ts` (new)

| Export | What it does |
|---|---|
| `fingerprintOfBar(score, measureIndex)` | A plain ordered string: the metre in force (`beats/beatType`), then each event of the bar in `vocalLine` order as type (`n` or `r`), base, dots, and tuplet ratio if any. Excludes event ids, onsets, pitch, and ties (amendment 4). Returns null where the bar has no measure to read a metre from. |
| `withBarAnswer(answers, score, measureIndex, kind)` | A new field with the bar's answer set, last answer replacing. Returns the input unchanged if the bar has no fingerprint, so the bar is asked again. |
| `answeredBars(answers)` | Every well-formed answer by bar index, ascending. Takes the field, not the record (amendment 7). Leaves out a malformed entry; never throws. |
| `stillToConfirm(bars, answers, score)` | Slice 1's bars minus those answered whose fingerprint still matches. An answer about changed events is not honoured and the bar is asked again. Stale answers stay in the record (amendment 6). |
| `barsToAsk(bars, answers, score)` | `[]` where `putAway`, else `stillToConfirm`. This is how "put-away hides the line and not the answers" is expressed. NOT WIRED. |
| `emptyBarAnswers`, `barAnswersEmpty`, `BAR_ANSWER_KINDS`, types | Helpers the record uses. |

Each function's comment says what it checks, why, and what follows when it fails (Dann's comment rule, 2026-11-01).

`withBarAnswer`, `barsToAsk`, and `fingerprintOfBar` are additions to the two functions the brief names (`answeredBars`, `stillToConfirm`). The brief asks for a fingerprint at the moment of the answer and a put-away test, and neither can be written without them. If you want the surface smaller, `barsToAsk` is the one slice 6 might fold elsewhere.

### The record carried in five places (amendment 2)

| Site | File | Change |
|---|---|---|
| `SongRecord` | `apps/web/src/lib/library/types.ts` | `barAnswers?: BarAnswers`, optional, additive, `RECORD_SCHEMA` stays 1. |
| `SongFields` | `apps/web/src/lib/library/library.ts` | `barAnswers: BarAnswers`, never absent on the page. |
| `fieldsFromRecord` | `library.ts` | Copies the answers (`copyBarAnswers`), empty where absent. |
| strip and write in `recordFromFields` | `library.ts` | `barAnswers` dropped from `base`, written back only when non-empty or put away. |
| `SongDocument` | `apps/web/src/lib/library/document.svelte.ts` | `$state` field, `#snapshot`, and `#apply`. |

### Validation (amendment 1)

`validateRecord` in `library.ts` validates the field as `publishedGlosses` is, in two levels. The field that is not an object (a string, number, array, boolean, or null) is `malformed()`. Inside the field, an answer is dropped and the rest kept if its bar key is not a whole number, it is not an object, its `kind` is unknown, or its fingerprint is missing, not a string, or empty. A `bars` that is not an object, or a `putAway` that is not `true`, is dropped the same way. If nothing sound remains, the field is absent.

Two choices of mine inside that rule, for you to confirm or overrule:
- An **empty-string fingerprint** is dropped as well. The brief names "missing or non-string". An empty one can never equal a real fingerprint, so honouring it would only ever ask the bar again; dropping it makes the stored record say so.
- A **negative or fractional bar key** ("-1", "1.5") is dropped as "bar not a whole number", reading the brief's phrase to include "not a non-negative whole number". Bars are 0-based, so a negative index cannot name a bar.

## Tests (34 new)

`apps/web/src/lib/score/bar-answers.test.ts` (22) and `apps/web/src/lib/library/bar-answers-record.test.ts` (12).

| Brief's required test | Where |
|---|---|
| A reload keeps every answer (write, `validateRecord`, read) | `a reload keeps every answer`, including put-away alone and the empty case |
| A malformed answer field is reported malformed | `a damaged answer field`, five bad shapes |
| One damaged answer never locks the song (amendment 1) | the same group: ten answers, two kept, `reason` undefined |
| A bar answered `matches-print` is not asked again | `a bar answered "Matches my score" is not asked again` |
| The same bar after one of its notes changes is asked again | dot, length, rest, delete, metre, tuplet |
| Undo after an applied offer changes the fingerprint (amendment 4) | `Undo after an applied offer …`, run on `applyCorrections` output |
| `put-away` hides the line and not the answers | `put-away hides the line and not the answers` |
| A replaced score drops answers whose fingerprints no longer match | `a replaced score drops answers …`, including that the stale answer is kept |
| The document carries the field | `SongDocument carries the field` |

The pitch, id, and onset exclusions are pinned too: a pitch nudge and a re-keyed id with moved onsets leave the answer honoured.

I checked that the document test guards the thing it names: with `barAnswers` deleted from `#snapshot`, `is carried into the record the document builds` failed; the file is restored.

## Gates

Clean Linux clone at `2e3803d`, `pnpm install --frozen-lockfile`, the commands CI and `gates-scratch.sh` use. Baseline from step 0 against the final run on this branch.

| Gate | Baseline | Final |
|---|---|---|
| 1 phonology | 407 passed | 407 passed |
| 2 dictionary | 248 passed | 248 passed |
| 3 web-check | 0 errors, 12 warnings, 5 files with problems | 0 errors, 12 warnings, 5 files with problems |
| 4 web unit | 4198 passed, 1 skipped (4199) | **4232 passed, 1 skipped (4233)**, +34, the new tests only |
| 5 score-parser | 785 passed, 5 skipped (790) | same |
| 6 blurb | 148 passed | same |
| 7 integration | 125 passed | same |
| 8 ratchets | OK, 655 source files | OK, 658 source files (the three new files) |

The Mac script's expected figures for gates 1, 5, and 6 are not in the tree in current form (`gates-scratch.sh` is from 2026-10-12 and reads 251, 680, 145), so "at the Mac's baseline" is established for gates 3, 4, and 7 against `STATE.md` and NOT ESTABLISHED for 1, 5, and 6. They did not move.

## NOT ESTABLISHED

- **Anything in a browser.** Nothing here is wired to a page. The round trip is tested through the facade and `SongDocument.toRecord` under vitest, where runes are inert (`library.ts` header). Whether the Svelte effect schedules a save when `doc.barAnswers` is assigned is the same code path as `poemSource` and was not observed.
- **A real scan's bars.** Every fixture is built from quarters and small corrections. I did not run `fingerprintOfBar` over the 17 opened songs, so I cannot say how many bars on real scores share a fingerprint with a different bar, or whether the fingerprint is ever unstable across two reads of the same bytes.
- **That excluding `tied` and the tuplet's `normalType` is safe.** The brief names type, base, dots, tuplet ratio, and metre. I followed it and left out ties; a tie does not change a bar's sum, but I tested neither on a real score.
- **Pitch.** Excluded as the brief's DESK DEFAULT. Dann may overrule; including it is one line in `eventPart` and one test.
- **How a replaced score's bar numbering compares.** A replacement that inserts a bar shifts every later `measureIndex`, so later answers meet the wrong bar. The fingerprint refuses an answer whose bar differs, but a shifted score whose bar happens to match a neighbour's fingerprint would honour it. I judge that rare and harmless (same notes, same metre) but did not measure it.
- **Where Not now lives and what writes `putAway`.** Plan r2, before slice 6R.
- **Scale.** A fingerprint is a short string per answered bar. I did not measure a record with every bar of a long song answered.
