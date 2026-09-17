# Brief: N.143 half B, a score with no header takes its file's name

Revision 1, 2026-09-16. Written at the desk. Build in Claude Code, AFTER half A
(`brief-n143-musx-verse-fill_r1_2026-09-16.md`) has returned its memo.

**Item:** N.143, half B. Spec: `docs/memory/OPEN.md`, section `N.143`, the three
HALF B sections, ending with "HALF B's RANKING, RULED BY DANN 2026-09-16". **Read
them first and in full.**

---

## The goal, in the singer's words

Dann, 2026-09-16: *"When a dropped score has no title or composer inside it, the
song should be called by the file name, then the poem's opening words in my
library. T05 becomes "Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and
fell"."*

A `.musx` converted through denigma carries no header, so today the song is named
from its poem, or shows the dated placeholder. The singer named the file; the
library should use that name.

---

## The rule

`proposeName` at `apps/web/src/lib/library/songs.ts:36-43` becomes, in order:

1. `composer, title`, then `title`, then `composer`, exactly as today;
2. **the base name of `record.source.fileName`**, extension removed, trimmed
   (`SongSource.fileName`, `apps/web/src/lib/library/types.ts:59`; the record's
   `source` field, `types.ts:96`);
3. the poem's first four words, exactly as today;
4. the empty string, so the dated placeholder shows, exactly as today.

Strip only the LAST extension (`.musx`, `.mxl`, `.musicxml`, `.xml`, `.mnx`,
`.pdf`, an image type). A name that is empty after stripping falls through to
step 3.

**Do not parse the file name into the Piece fields.** The whole base name is the
song's name; composer, poet, and title stay empty for the singer. Ruled
2026-09-15, `OPEN.md` §N.143.

**DESK DEFAULT, 2026-09-16:** this applies to every dropped score, including a
PDF or a photograph. Dann can narrow it.

---

## The trap. Establish this before you change anything

A name is written once: `nameIfUnnamed` (`apps/web/src/routes/+page.svelte:3722`)
returns early when `doc.name` is not empty. `handleInput` calls it at `:2736`, and
N.134's fill reaches `handleInput` from `applyArrival`. `doc.attachSource` runs at
`:3673`.

**If the fill runs before `attachSource`, the poem names the song and the file
name never gets a turn.** The desk has not read the order inside `applyArrival`;
it is NOT ESTABLISHED. Read it, say which comes first, and if the poem wins, make
the naming happen after the source is attached. Do not add a second silent save
site (CONTRACT §6, while N.27 is open).

**State your expectation before you measure**, and name your likeliest failure
mode.

---

## Things that must not change

- **A name, once written, stays the singer's.** N.67 step 4b. This build changes
  what the FIRST name is built from, not when it is written, and never renames an
  existing song.
- `backfillName` in `apps/web/src/lib/library/index.ts` calls the same
  `nameFor`. Say whether any song already in a browser could be renamed by it at
  boot. It should not: it returns early on a non-empty name.
- The binder and the exchange (`binder.ts`, `exchange.ts:106`) use `autoName`.
  Say whether they should follow the same order, and if the answer is not
  obvious, leave them and report it.

---

## Tests

In `apps/web/src/lib/library/songs.test.ts`, block
`proposeName, design §2.3 layer 3`:

- a header beats the file name;
- no header, a file name and a poem: the file name wins;
- no header, an empty file name: the poem wins;
- `Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell.musx` gives
  `Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell`;
- a name with dots inside it (`Op. 45 no. 2.musicxml`) loses only `.musicxml`.

---

## Definition of done

1. A fresh drop of T05 names the song
   `Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell`.
2. A fresh drop of Sunless 01 is still named from its header.
3. A song that already has a name keeps it.
4. All five gates green. Baselines: `docs/memory/ENVIRONMENT.md` §`Gate baselines`.
5. Walked in a browser by Dann on the deploy. **WRITTEN is not DONE.**

---

## What to return

A memo at `docs/sessions/memo-n143b-name-from-file_r1_<date>.md`:

1. What you changed, by file and line.
2. The order inside `applyArrival`, with lines, and what you did about it.
3. Your expectation, stated before the measurement, and the measurement.
4. The gate results, with any baseline movement named.
5. **A section listing what you could not establish.** NOT ESTABLISHED beats a
   complete invented answer.
6. Any decision this brief did not settle, marked as yours and reversible.

**Do not commit and do not stage.** No agent writes with git. If you create a new
file, name it in the memo so Dann can `git add` it before he ships; the ship
script refuses untracked files.
