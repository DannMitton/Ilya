# Memo: build the loupe's ruled French

Revision 1, 2026-09-16. Built against
`docs/sessions/brief-loupe-french-build_r1_2026-09-16.md` and
`docs/sessions/spec-loupe-french_r1_2026-09-14.md`, both read in full. Built
after N.142 (`memo-n142-tie-prolongation_r1_2026-09-16.md`), per the brief's
own order.

## What changed, by file and line

**`apps/web/src/lib/i18n.ts`.** Every value copied from the spec, not
retyped from the brief's own table, per the brief's instruction. Every
touched entry's comment rewritten to say it was ruled, with the date, in
place of the stale "FRENCH OWED" note.

| key | line (today) | fr, before | fr, now |
|---|---|---|---|
| `loupe.redo` | 391 | `Redo: %s` (English) | `Refaire : %s` |
| `loupe.undo.placed` | 392 | `syllable placed` (English) | `syllabe placée` |
| `loupe.undo.startOver` | 395 | did not exist | `placement recommencé` (new key) |
| `loupe.undo.melisma` | 402 | `melisma set` (English) | `mélisme défini` |
| `loupe.undo.melismaOff` | 403 | `melisma cleared` (English) | `mélisme effacé` |
| `loupe.melisma` | 432 | `Melisma` (English) | `Mélisme` |
| `loupe.lyric.melisma` | 438 | `This note sustains the syllable` (English) | `Cette note prolonge la syllabe` |
| `loupe.beat` | 374 | `beat %b` (English) | `temps %b` |
| `loupe.beatPulse` | 375 | `beat %b, pulse %p` (English) | `temps %b, division %p` |
| `calib.common.retake` | 992 | `Refaire` (correct once, now the wrong word: `loupe.redo` needed it) | `Réessayer` |

That is the nine-row Step 1 table plus Step 2's new key, ten rows in total.
Line numbers are after this build's own edits; they move again with the next
one, as every brief in this tree's own convention says.

**`apps/web/src/lib/i18n.test.ts`.** A new describe block, `the loupe's
French`, matching the shape of the existing `N.62 accessible names` test
(expected values copied from the spec, not read back out of `i18n.ts`, so a
future edit that drifts from the ruling fails here rather than passing
silently): one test asserting all ten ruled keys carry their exact French,
never `[MISSING`, and differ from their English; one test asserting the two
keys the spec names as identical on purpose (`loupe.pitch.octave`,
`loupe.station.corrections`) stay that way.

**No other file changed.** Step 2's finding (below) means nothing in
`+page.svelte` needed editing.

## Step 2's finding: Start placement over is not undoable today

**Established by reading `handleStartPlacementOver` in full
(`+page.svelte:564-598`): it never calls `pushUndo`.** Every other
correction verb in this file pushes onto the one undo stack before or after
its write (`pushUndo({ kind: 'text', key: … })`, seventeen call sites
grepped, none of them inside this function). `handleStartPlacementOver`
mutates `doc.pairings` directly and returns; the undo pill after pressing it
today reads whatever it read before the press, because nothing new was
pushed.

**So, per the brief: the key is added, and it is not wired.**
`loupe.undo.startOver` now exists with its ruled French, ready for the
moment a later build makes the button undoable, which the brief itself
says is a design change out of this one's scope. Wiring it in without also
making the press undoable would be worse than leaving it unwired: the pill
would still read the PREVIOUS undoable action's clause, and the new key
would sit unused, which is indistinguishable from not having built it at
all except that it would misleadingly look finished.

## Gate results

All five run in full, individually, today, with N.142's changes already in
the tree:

| gate | baseline (after N.142) | this run |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216) |
| dictionary | 235 passed (235) | 235 passed (235) |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |
| web-test | 1199 passed (1199) | **1201 passed (1201)** |
| score-parser | 567 passed, 5 skipped (572) | 567 passed, 5 skipped (572), unchanged |

**Web-test moves: 1199 → 1201, two new tests, both passing.** Combined with
N.142's move earlier in this session, `docs/memory/ENVIRONMENT.md` §`Gate
baselines` and `~/Downloads/ilya-ship.sh:79` need the web-test row at `1201
passed (1201)` before Dann ships (N.142's memo already named the intermediate
1199). Not done here; the desk owns that table.

Also checked: no other test file in the repository references any of the ten
touched keys (grepped `apps/web/src/**/*.test.ts` for each key name outside
`i18n.test.ts`; none matched), so no test elsewhere was asserting the old
English-in-both-slots values.

## What could not be established

- Whether French text at the new lengths (`Refaire : %s`, `mélisme
  défini`, `Cette note prolonge la syllabe`, and the rest) fits the loupe's
  drawn cells without crowding or wrapping at the sizes Dann actually uses.
  The brief did not ask for a fit check on this item (unlike N.130's fit
  table, which named the risk explicitly for a different surface), and this
  build did not add one. A walk in French mode is what the brief's own
  definition of done asks for, and it is Dann's.
- Whether any song or transcript already open in a browser tab is showing a
  STALE cached copy of the English strings this build replaced. `i18n.ts`'s
  table is read at call time, not cached into a document; this is stated as
  a limit of what a static read of the source can confirm, not as a
  discovered problem.

## Decisions this brief did not settle, and are reversible

None. Every string, every key name, and every comment traces to a specific
ruling in the spec, and Step 2's finding (not undoable, so not wired) is the
outcome the brief's own conditional already anticipated rather than a
judgement call this build had to make on its own.

## Files touched

- `apps/web/src/lib/i18n.ts` (tracked, modified)
- `apps/web/src/lib/i18n.test.ts` (tracked, modified)
- `docs/sessions/memo-loupe-french-build_r1_2026-09-16.md` (this file, new,
  untracked)

Not committed and not staged. No git command that writes was run.
