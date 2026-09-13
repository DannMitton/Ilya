# Plan: the colour story, from census to canon

Dann's ask, 2026-09-13: *"I want to go through the code and ensure that
everything fits a logical, coherent colour story with a set number of colours
that are employed predictably."* And, after the map was ruled: *"it's wise to
run an audit to resolve ghost calls for colours and to resolve those neutrals
and to make sure we aren't using six lavenders instead of five."*

**Six stages. Each one ends in something Dann can rule on or walk. Nothing in a
later stage starts before the earlier one closes**, because every later stage
touches the same declarations and doing them out of order means touching them
twice.

---

## THE PRINCIPLE, RULED 2026-09-13

**A hue names ONE IDEA, and a band takes the hue of the idea it holds, wherever
that band appears.** A hue travelling into another room is the system working,
not a collision. Evidence: the Input band wears Transcription's token inside
Score markup's drawer, by Dann's own N.108-5 ruling
(`Drawer.svelte:1187`), and the Piece band wears Guide's
(`:1178`).

## THE MAP, RULED 2026-09-13

| hue | the idea | where it appears |
|---|---|---|
| sage | the words | Transcription, the Input band |
| lavender | notation and voice | Score markup, its band, the turning layer, the pacifier |
| cobalt | information | Guide, the Piece band |
| rose | your voice, explained | Insights |
| umber | the book | Learn |

**Learn moving from rose to umber is the only destination that changes.**

---

## STAGE 1 · THE CENSUS. Read only

**Brief:** `brief-colour-census_r1_2026-09-13.md`. Sonnet, read-only.

Every colour token and every inline literal, one row per use site, with what it
colours and what it sits on. Answers three things nothing else can: how many
distinct lavenders and sages actually exist, which tokens are ghosts, and which
inline literals duplicate a token that already holds the value.

**Closes when:** the memo lands. **Blocks:** stages 2 and 3.

## STAGE 2 · THE RULINGS THE CENSUS INFORMS. Dann only

Four, and none can be answered honestly before stage 1:

1. **The ramp.** Do the three marks space evenly, L 0.64 / 0.53 / 0.42 in steps
   of 0.11, against today's 0.23 / 0.05 / 0.05? Costs: four of five bands move
   by under 0.03 and are invisible; cobalt moves 0.084 and is visible. Gains:
   band and chip stop being mistakable, every chip clears 5.16 on white against
   today's 4.5, every ink clears 6.9 on cream against rose's 4.69.
   Drawing: `drawing-warm-brown_r1_2026-09-13.html` carries the method.
2. **The neutrals.** Which of the eleven consolidate, from the census table.
3. **The strays.** `--light-sage`, `--light-lavender`, `--deeper-sage`,
   `--muted-lavender`: each becomes a role in the grammar, or goes.
4. **The fourth value's name.** Rose's label ink is an inline `#8A5C5C` today.
   Every family gets one, or none does.

**Closes when:** Dann has ruled all four. **Blocks:** stages 3 and 4.

## STAGE 3 · THE RENAME. No value changes

Two passes, and they must be separate commits.

**3a, the one-word families.** Already briefed:
`brief-colour-token-rename_r1_2026-09-13.md`. `--dusty-rose` to `--rose`,
`--deeper-lavender` to `--lavender`, `--quiet-cobalt` to `--cobalt`. About 95
call sites. Tests assert hex literals, not token names, so no gate can move.

**3b, family and role.** `--surround-marked` becomes `--lavender-desk`,
`--lang-chip-marked` becomes `--lavender-chip`, and so on for all five families
across desk, band, chip and ink. Destination-named tokens go. **This is what
makes stage 4 cheap:** afterwards, changing a family's values is four
declarations, not a hunt.

**Why the rename comes before the values:** a rename is mechanical and provable
by grep with the gates unmoved, so it can be shipped and walked with no visual
risk. Doing it after the value changes would mean touching every declaration
twice and walking a visual change through unstable names.

**Closes when:** grep returns nothing for the old names and five gates hold.

## STAGE 4 · THE VALUES

In one commit, because they must be walked together:

- the ramp from stage 2 ruling 1, applied to all five families;
- **umber declared**, its four values entering the tree for the first time;
- **Learn moved from rose to umber**;
- `--surround-insights` deleted, Insights taking rose's own tokens.

**Closes when:** Dann walks all five destinations at 1400 px and agrees each
desk, band, chip and ink is what it should be.

## STAGE 5 · THE GHOSTS AND THE DUPLICATES

- `--stone-600`: declared or its seven references rewritten.
- Every other ghost the census found.
- Inline literals that duplicate a token: replaced by the token, or the reason
  they are literals written down beside them.

**This is last on purpose.** It is hygiene, it is the least visible, and doing
it earlier would churn files that stages 3 and 4 are already rewriting.

## STAGE 6 · CANON

The principle, the map, the grammar and the derivation rules go into
`PRODUCT.md`, which is where settled things live. Including the two recipes
worth keeping: **the desk is 40 % hue plus 60 % white, exactly**, verified
against all four families; and **the marks are spaced in OKLCH lightness**, not
picked by eye.

**Closes when:** a new session can read `PRODUCT.md` and add a sixth hue
correctly without asking anyone.

---

## The order, in one line

Census, then Dann's four rulings, then rename with no value changes, then values
with a walk, then hygiene, then canon.

## What is already written and waiting

- `brief-colour-census_r1_2026-09-13.md` (stage 1)
- `brief-colour-token-rename_r1_2026-09-13.md` (stage 3a)
- `drawing-chip-board_r1_2026-09-13.html` (the evidence base)
- `drawing-warm-brown_r1_2026-09-13.html` (umber's derivation)
- `drawing-piece-band-neutral_r1_2026-09-13.html` (superseded: the Piece band
  stays cobalt, ruled 2026-09-13; kept because it records what was considered)
