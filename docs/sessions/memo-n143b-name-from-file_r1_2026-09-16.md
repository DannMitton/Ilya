# Memo: N.143 half B, a headerless score takes its file's name

Revision 1, 2026-09-16. Built against
`docs/sessions/brief-n143b-name-from-file_r1_2026-09-16.md`, after half A's
memo (`memo-n143-musx-verse-fill_r1_2026-09-16.md`).

## 1. What changed

**`apps/web/src/lib/library/songs.ts`.** `proposeName` (was lines 36-43) gains
one branch, between the composer/title check and the poem fallback: the base
name of `record.source?.fileName`, with its last extension stripped and the
result trimmed. A new private helper, `fileBaseName`, does the stripping
(`lastIndexOf('.')`; a leading dot, as in a dotfile, is not treated as an
extension). Nothing else in the function moved.

**`apps/web/src/lib/library/songs.test.ts`.** Six tests added under
`proposeName, design §2.3 layer 3`, in a nested
`the file name fallback, N.143 half B` block: a header beating the file name,
a file name beating the poem, an empty file name falling to the poem, the real
T05 file name (`Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and
fell.musx`) producing the exact name Dann's ruling asked for, a name with dots
inside it losing only its last extension, and a `null` source falling to the
poem.

**`apps/web/src/routes/+page.svelte:3062-3090`.** See §2. `applyArrival`
becomes `async`; the `void attachUploadedSource(…)` fire-and-forget call
becomes an `await`, wrapped in a `try`/`catch` that logs and continues on
failure. No other line in the function changed.

`autoName` (`apps/web/src/lib/library/binder.ts:53-59`) and `backfillName`
(`apps/web/src/lib/library/index.ts:229-247`) both call into `proposeName`
directly or through `nameFor`, so both pick up the new rank with no code
change; see §3.

## 2. The order inside `applyArrival`, and what was done about it

**Read in full, `+page.svelte:3062-3184`, before changing anything.** The
synchronous body of `applyArrival`, before this fix, ran in this order for a
fresh upload:

1. `:3072`, `void attachUploadedSource(ingested, file, arrivalPage ?? undefined)`.
   Fired, not awaited. `attachUploadedSource` (`:3647-3683`) is itself `async`:
   it awaits `file.arrayBuffer()`, then `Promise.all([hashBytes(bytes),
   fingerprintVocalLine(…)])`, and only THEN calls `doc.attachSource(…)`, which
   is the one place `doc.source` is set (`document.svelte.ts:311-314`, a plain
   synchronous field write with no naming call of its own).
2. `:3098`, `commitMetadataState(onScoreIngested(…))`, which calls
   `handleMetadataChange` (`:3704`), which calls `nameIfUnnamed()` (`:3711`)
   unconditionally, header or not.
3. `:3120-3124`, the poem fill: `doc.inputText` is set inside `handleInput`
   (`:2734-2738`), which itself calls `nameIfUnnamed()` again (`:2736`), after
   setting `doc.inputText` and before transcribing it.

**Steps 2 and 3 are both synchronous and both run in the same tick step 1
starts in.** `file.arrayBuffer()` is genuine async I/O (it yields at least one
microtask), so `attachUploadedSource`'s promise cannot have resolved by the
time step 2 runs, let alone step 3. `nameIfUnnamed` (`:3722-3730`) reads
`doc.toRecord()`, and a name, once written, is never reconsidered (its own
`doc.name !== ''` guard); nothing calls it again later when the source finally
attaches. So for every headerless upload, not only T05: `doc.source` was
`null` at both naming attempts, `proposeName` fell straight through the new
file-name branch to the poem (empty on the first attempt, filled by the
second), and the song was named from the poem's first four words before the
file name ever got a turn. This is the trap the brief named, confirmed rather
than assumed.

**What was done: `attachUploadedSource` is now awaited (`:3082-3090`)**, so
`doc.source` is set before `commitMetadataState` and `handleInput` run, and
both naming attempts see the file name. The call is wrapped in a `try`/`catch`
(`console.error`, then continue) because before this change a throw inside
`attachUploadedSource` (only `file.arrayBuffer()` is unguarded; the hashing
`Promise.all` already catches its own errors) was an unhandled rejection that
never touched the rest of `applyArrival`. Awaiting without a `catch` would have
let that same rare failure abort the fill and the seat that follow, over a
failure that is only the source recording. This is not a second save site:
it is the same single `attachSource` call, sequenced rather than backgrounded.

## 3. Expectation, then measurement

**Stated before writing the fix:** ranking the file name above the poem in
`proposeName` alone would not be enough, because of the ordering trap in §2;
both changes were needed together, and I expected the six new `songs.test.ts`
cases to pass on the first run once both were in place, since they exercise
`proposeName` directly and do not depend on `applyArrival`'s timing.

**Measured:** `pnpm --filter @ilya/web test`, all 1187 tests pass, including
the six new ones, on the first run after both changes (§4 has the full gate
table). The T05 case asserts the literal string
`Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell`, matching
Dann's own ruling exactly.

**Not measured, and named rather than assumed done:** `applyArrival`'s
reordering has no unit test (`+page.svelte` logic above the pure-function line
is not gate-checked, by this codebase's own convention; see the header note in
`songs.ts`), and this session's browser has no file-picker automation to drive
an actual drag-and-drop upload end to end. The brief's own definition of done
says a browser walk by Dann is what settles this, and it is not done here.

## 4. Gate results

All five run in full, individually, today, with both this brief's changes and
half A's already in the tree:

| gate | baseline | this run |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216) |
| dictionary | 235 passed (235) | 235 passed (235) |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |
| web-test | 1181 passed (1181) | **1187 passed (1187)** |
| score-parser | 564 passed, 5 skipped (569) | 567 passed, 5 skipped (572), from half A |

**Web-test moves: 1181 → 1187, six new tests, all passing.** Combined with
half A's score-parser move, `docs/memory/ENVIRONMENT.md` §`Gate baselines`
needs both rows moved, and `~/Downloads/ilya-ship.sh` lines 79 and 80, before
Dann ships: web-test to `1187 passed (1187)`, score-parser to
`567 passed | 5 skipped (572)`. Not done here; the desk owns that table.

## 5. What could not be established

- Whether `applyArrival`'s new `await` is perceptible to a singer as a delay
  in the fill. Reasoned in §2 that the awaited work is local-only (no
  network) and should cost single-digit milliseconds at most, but not
  measured against a clock, and not walked in a browser.
- Whether any other unawaited caller in this codebase relies on
  `applyArrival` completing synchronously. Read all four call sites
  (`+page.svelte:2944, 2985, 3003, 3012`); none reads a return value or runs
  code after the call that depends on `doc.source` or `doc.name` having
  already settled, so none needed a change, but this is read, not exhaustively
  proven for code added later.
- Whether the binder's or the exchange's own tests should gain a case for the
  file-name fallback. `binder.test.ts`'s existing `autoName` tests all pass
  unchanged (§1), because none of its fixtures pairs an empty header with a
  populated `source.fileName` other than the ones already covered by
  `songs.test.ts` through the shared `proposeName`. Not added, on the
  reasoning that the rule lives in one function and is tested once; reversible
  if Dann wants the coverage duplicated there too.

## 6. Decisions this brief did not settle, and are reversible

- **Wrapping the awaited `attachUploadedSource` in a `try`/`catch`** was not
  asked for in the brief. It restores a fault-isolation property the code had
  before this change (a source-attachment failure must not block the fill),
  which awaiting without a catch would have removed. Reversible: removing the
  `try`/`catch` returns to letting such a failure abort the rest of
  `applyArrival`, which the brief did not ask for and is very unlikely to
  matter in practice, but changes behaviour on a rare error path.

## Files touched

- `apps/web/src/lib/library/songs.ts` (tracked, modified)
- `apps/web/src/lib/library/songs.test.ts` (tracked, modified)
- `apps/web/src/routes/+page.svelte` (tracked, modified)
- `docs/sessions/memo-n143b-name-from-file_r1_2026-09-16.md` (this file, new,
  untracked)

Not committed and not staged.
