# Report: word marks saved, step 1, the record (Code, cloud-lane-42, r1, 2026-11-10)

Branch `cloud-lane-42`. Files changed: `apps/web/src/lib/library/types.ts`, `library.ts`, `document.svelte.ts` (one line), and two new files, `word-mark-rows.ts` and `word-mark-rows.test.ts`. No change to `+page.svelte`.

## What was built

- **`SongRecord.wordMarks?: { lyrics?: MarkRow[]; poem?: MarkRow[] }`**, optional and additive, `RECORD_SCHEMA` stays 1. A `MarkRow` is `[key, kind, value, anchor]`, `kind` one of `'stress' | 'yo' | 'syllables' | 'spot'`, `value` the map's value as the page holds it, `anchor` the word's clean form with ё folded (`glossAnchorForm`).
- **`spot`'s value is a boolean, the singer's choice** (`true` reconstituted, `false` reduced), by Dann's 22:20 ruling (option 2). The brief says `true`; the ruling is later and wins. A stored `true` is therefore "reconstituted", not "invert the setting". Nothing reads this yet; step 2 does, and the plan for the consumers is in the step 2 report.
- **`validateRecord`** keeps a well-formed field and drops a malformed row alone (Fable's amendment 8). Per kind: `stress` needs `stressIndex` a non-negative integer, `stressSource` one of the three, and `promotedFromClitic` absent or boolean; `yo` needs a three-part key and a `source`; `syllables` needs `boundaries` an array of non-negative integers; `spot` needs a boolean. A row needs a non-empty anchor and a key of its kind's shape (`"l-w"`, or `"l-w-c"` for ё).
- **`recordFromFields`** drops `wordMarks` from `base` before it writes, and writes it back only while a witness has a row (Fable's amendment 7). `SongFields` gained `wordMarks`, and `fieldsFromRecord` returns it.
- **`word-mark-rows.ts`**, plain TypeScript: `validRow`, `validateWordMarks`, `rowsFromMaps` (maps to rows in a fixed order, anchors from the grid the keys describe, re-keyed over the diff where the text has moved on), and `mapsFromRows` (rows to maps, each checked against the word at its key, dropped and counted on mismatch). Step 2 wires them to the document.
- **`document.svelte.ts`**: `#snapshot` passes `this.#base.wordMarks ?? {}`, so a document that does not touch marks writes back what it loaded. This is a placeholder that step 2 replaces; it is the one line that keeps `SongFields` complete.

## Decisions made here

1. **A `wordMarks` that is not an object is dropped, and does not call `malformed()`.** Every other field's wrong top-level type does, which makes the song read-only. The brief says "drops a malformed row (not the song)", and a damaged mark must not cost the song its saves. Tested.
2. **A row's `kind` is the only place an unknown future kind would be dropped.** An older Ilya that meets a newer kind drops that row; this build drops unknown kinds the same way.

## Tests (`word-mark-rows.test.ts`, 13 tests)

Round trip of each kind for each witness through `recordFromFields`, JSON, and `validateRecord`; one witness alone; a record without the field loads as today and writes none; removing every mark removes the stored field though `base` held rows; ten malformed rows each dropped alone with the song whole; five non-object values for the field; key shape by kind; rows in a fixed order with ё-folded anchors; the spot choice `false` stays `false`; anchor mismatch dropped and counted; ё against е; a word that moved is followed (amendment 4); a deleted word takes its mark.

## Gates

| # | gate | result |
|---|---|---|
| 1 | phonology | 456 passed |
| 2 | dictionary | 248 passed |
| 3 | web check | 0 errors, 12 warnings |
| 4 | web tests | 4720 passed, 1 skipped (baseline 4707, plus the 13 new) |
| 5 | score-parser | 785 passed, 5 skipped |
| 6 | blurb | 168 passed |
| 7 | integration | 125 passed |
| 8 | ratchets | OK, no ceiling touched |

## What I could not establish

- Whether any consumer outside the page (the binder, `migration.ts`, `driver.ts`) copies record fields by name rather than through `validateRecord`. I read `driver.ts:140`, `migration.ts:86`, and `binder.ts:238`, which all call `validateRecord`, and none lists fields. I did not read every file under `library/`.
- Whether the stored `kind` strings should be more compact. They cost a few bytes a row and I judged readability worth it; not measured against a real song.
