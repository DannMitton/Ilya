# Memo: N.143 half A, the input field fill on a `.musx` score

Revision 1, 2026-09-16. Built against
`docs/sessions/brief-n143-musx-verse-fill_r1_2026-09-16.md`.

## 1. What changed

**`packages/score-parser/src/mnx-parser.ts:376-390`.** In the verse-ordering
branch, `order` is now `rawOrder` filtered to the lineIds actually seen on the
vocal part's events (`seenLineIdsInOrder`), instead of `rawOrder` verbatim. A
lineId that `global.lyrics.lineOrder` lists but no event ever uses no longer
claims a verse slot. The append step that follows (an observed lineId missing
from `lineOrder` gets pushed to the end with a `verse-count-mismatch` warning)
is unchanged.

**`packages/score-parser/src/mnx-parser.test.ts`**, three tests added to the
`diagnostics and degraded sources` block, after the existing
`lineorder-missing` test:

- an unused id first in `lineOrder` (`['v3', 'v1', 'v2']`, `v3` unused): the
  first used id becomes verse 1.
- an unused id in the middle (`['v1', 'v3', 'v2']`): the two used ids number 1
  and 2, with no gap at 2 or 3.
- the Patterson shape, four lines, all used, `['v2', 'v4', 'v6', 'v8']`:
  numbering is 1, 2, 3, 4 in `lineOrder`'s order, unchanged from today.

No other file changed. The fill gate at `+page.svelte:3120-3123` was not
touched, per the brief.

## 2. Expectation, then measurement

**Stated before running anything:** T05's verse 1 becomes `v1`, and
`collectScoreWords(score, 1)` returns the 73 Cyrillic words the 2026-09-16
diagnosis found sitting under verse 2. The likeliest way this could fail: the
`lineOrder` filter also drops a used id by mistake, if `seenLineIdsInOrder` is
built from a different scan than the one that assigns `verseNumber` to
syllables. It is not: both read the same `forEachEvent(vocalPart, …)` walk.

**Measured, real file, real conversion.** T05
(`~/Downloads/Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and
fell.musx`) converted through the project's own denigma WASM
(`tools/e16-harness/src/denigma-convert.ts`, the same artifact
`score-reader.worker.ts` uses) and parsed with `MnxScoreParser` directly, in
Node, before and after the fix:

| | before | after |
|---|---|---|
| `lineOrder` read from the file | `['v3', 'v1', 'v2']` | (unchanged; the fix reads it, does not rewrite it) |
| events with a syllable | 146 | 146 |
| events at verse 1 | 0 | 146 |
| first verse-1 syllables | (none) | `Бог Ку пи дон дре мал в ти ши …`, matching Dann's screenshot |
| whole/start syllables at verse 1 (≈ word count) | 0 | 73 |
| verse 2 | Cyrillic, 146 events, wrongly numbered | the second lyric line (not Cyrillic; see §5) |

The 73 matches the diagnosis's count exactly, and the syllable stream reads
« Бог Ку­пи­дон дре­мал в ти­ши лес­ной », the same words in the same order Dann's
screenshot showed on Score markup. Reverting the fix and re-running (`git
stash` on the one file) reproduces the 0 exactly, confirming the measurement is
of this change and not of something else in the pipeline.

`r.errors` is empty and `r.warnings` carries five `unrecognised-element`
entries, present identically before and after; they are pre-existing and out
of this brief's scope.

## 3. The four checks

**1. Every other reader of verse numbers.** `lineIdToVerse` is read in exactly
one place inside the parser, `mnx-parser.ts:975`, which sets each syllable's
own `verseNumber` and, where more than one verse sings on an event,
`versesInfo`. Nothing downstream reads `lineIdToVerse` directly; every
consumer reads the `verseNumber` the parser already wrote onto the syllable.
That makes the fix's effect uniform across every reader, and each of the
following take `verseNumber = 1` as their own default, so each was silently
reading the phantom empty slot on a `.musx` file with an unused declared verse
and now reads the Cyrillic line:

- `collectScoreWords` (`apps/web/src/lib/shane/vowel-resolver.ts:198`), which
  is what the input-field fill gate calls.
- `findCliticFolds` (`apps/web/src/lib/shane/clitic-seat.ts:145`), called
  directly on the ingested score at `+page.svelte:459` to drive the
  correction surface's clitic-fold proposals. This one is independent of the
  input field: it reads the score at ingest, so a `.musx` singer was also
  silently getting no clitic-fold proposals, a second symptom the desk had
  not named.
- `buildUnderlayResolvers` (`apps/web/src/lib/shane/vowel-resolver.ts:437`,
  called from `VoiceProfilePane.svelte:849`), which resolves the IPA line
  under the notes.
  `buildWatchlist`'s underlying call (`apps/web/src/lib/shane/watchlist.ts:347`)
  takes the same default.
  `sungVerseNumbers` (`packages/score-parser/src/verses.ts`, consumed by
  `apps/web/src/lib/shane/analyze-per-verse.ts:42`) collects whichever verse
  numbers are actually present on the syllables rather than assuming 1, so it
  was already correct in the sense of not crashing, but on T05 it would have
  reported `[2, 3]` before this fix and reports `[1, 2]` after. Its consumer,
  `analyzePerVerse`, feeds a per-verse acoustic overlay whose rendering is
  parked (the file's own comment, `analyze-per-verse.ts:22-24`, cites §A.107),
  so nothing on screen changes today from this one.

**Score markup itself (the staff engraving) is unaffected either way**, and
this is why Dann's screenshot showed the Cyrillic words drawing correctly
even while the input field was empty:
`mnx-parser.ts:967-1001` picks the syllable with the LOWEST verse number
present ON THAT EVENT as the "primary" one it hands to the renderer,
regardless of what that number literally is. Before the fix, T05's events
carried only `v1` (numbered 2) and `v2` (numbered 3); 2 is still the lower of
the two, so the primary was still the Cyrillic syllable. The bug only bites
code that compares to the literal value 1, which every listed reader above
does.

**2. Anything stored that keys on a verse number.** Not established as a
concern, and the record shape rules it out rather than leaving it open. Read
`apps/web/src/lib/library/types.ts` in full: `SongRecord` stores `pairings`
(`PairingMap`) and `corrections` (`CorrectionMap`), both keyed by event id, and
nothing in the record stores a verse number. A score is re-parsed from its
saved bytes on every load (`SongSource` stores `fileName`, `byteLength`,
`contentHash`, `fingerprint`, and an optional `page` provenance block for a
photograph; no parsed structure). So a T05 song saved before this fix has
nothing keyed on the number 2 to become stale: the next load re-parses and
gets the corrected numbering with nothing to migrate.

**3. The existing MNX tests.** Grepped every `lineOrder` in
`mnx-parser.test.ts` before adding the new ones: two, at the old line 89
(`mainFixture`, `['v1', 'v2']`) and the old line 362, both fully used with no
unused id. Neither test's asserted verse numbers move.

**4. Other `.musx` files.** Not established from the repository's own
fixtures: no `.musx` or `.mnx` file is committed (the T08 integration test is
gated on `SHANE_T08_MNX`, unset in this environment, and skipped silently, as
designed). `~/Downloads` and `~/Downloads/samples` on this machine hold six
more `.musx` files (T09, Sunless 04, a Sharp excerpt, T08, a Verdi excerpt, and
T05 itself), none committed to the tree and none checked here: checking them
was not part of the brief's scope and would be inventing a check the brief did
not ask for. Whether the phantom `v3` slot is a Finale artifact or a denigma
one stays NOT ESTABLISHED, as the spec already said; nothing in this build
bears on that question.

## 4. Gate results

All five run in full, individually, today:

| gate | baseline | this run |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216) |
| dictionary | 235 passed (235) | 235 passed (235) |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |
| web-test | 1181 passed (1181) | 1181 passed (1181) |
| score-parser | 564 passed, 5 skipped (569) | **567 passed, 5 skipped (572)** |

**Score-parser moves, and only there: 564 → 567, three new tests, all
passing.** `docs/memory/ENVIRONMENT.md` §`Gate baselines` needs its
score-parser row and its `~/Downloads/ilya-ship.sh:80` line moved from
`564 passed | 5 skipped (569)` to `567 passed | 5 skipped (572)` before Dann
ships. Not done here: this brief did not ask for it and the desk owns that
table.

## 5. What could not be established

- Whether the phantom `v3` slot is written by Finale itself or introduced by
  denigma's conversion. Out of scope for this brief; named again because it
  bears on whether other Finale files carry the same slot.
- Whether any of the six other `.musx` files sitting in `~/Downloads` on this
  machine carry an unused `lineOrder` slot. Not checked; not asked for.
- What T05's second lyric line (`v2`) actually contains. The parser reads it
  as the literal text `box` on the first event, not IPA transcription. That
  reads as placeholder or test content in the source file rather than a parser
  defect (the fix does not touch line content, only its verse number), and it
  is outside this brief, which only asked about verse 1. Flagged here so it is
  not mistaken for something the fix caused.
- Whether the T08 integration test in `mnx-parser.test.ts` (gated on
  `SHANE_T08_MNX`) would show the same phantom-verse shape. Not run: the
  environment variable is unset on this machine and the file it would name is
  not committed.

## 6. Decisions this brief did not settle

None taken. The fix is exactly the one the brief specified (filter `order` to
seen ids, keep the existing append-and-warn path for the reverse case), and
every check above answers a question the brief already posed rather than
introducing a new judgement call.

## Files touched

- `packages/score-parser/src/mnx-parser.ts` (tracked, modified)
- `packages/score-parser/src/mnx-parser.test.ts` (tracked, modified)
- `docs/sessions/memo-n143-musx-verse-fill_r1_2026-09-16.md` (this file, new,
  untracked)

Not committed and not staged.
