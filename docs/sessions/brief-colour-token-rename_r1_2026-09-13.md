# Brief: the colour families take one-word names

RULED BY DANN 2026-09-13: **sage, rose, lavender, cobalt, umber.**

A pure rename. **No hex value changes anywhere.** If any value moves, you have
done something this brief did not ask for.

Read `docs/memory/CONTRACT.md` in full before you start.

## 1. The three renames

| today | becomes | uses | files |
|---|---|---|---|
| `--dusty-rose` | `--rose` | 25 | 12 |
| `--deeper-lavender` | `--lavender` | 49 | 22 |
| `--quiet-cobalt` | `--cobalt` | 21 | 15 |

`--sage` is already a one-word name and **does not move**.

Counts are the desk's, 2026-09-13, over `apps` and `packages`, excluding
`node_modules`. Confirm them; do not trust them.

## 2. What does NOT change

- **No hex literal changes.** `#A67B7B`, `#8E7E9B` and `#5C739E` stay exactly
  as they are, at their declarations and everywhere they appear inline.
- **The pacifier's `--muted-lavender` and `--light-lavender` stay.** They name
  values inside a family rather than families, which is a different axis.
  DESK DEFAULT, and Dann has not opposed it.
- **The derived tokens keep their own names.** `--surround-marked`,
  `--surround-learn`, `--surround-guide`, `--lang-chip-marked`,
  `--lang-chip-learn`, `--lang-chip-guide` are named for their DESTINATION, not
  for their hue, and destinations are not being renamed.
- Nothing in `docs/` is rewritten. The record says what it said at the time.

## 3. Watch for these

- **A fallback inside a `var()` carries the old name too.** The tree writes
  `var(--dusty-rose, #a67b7b)` in places. The token name changes; the fallback
  hex does not.
- **Comments name these tokens.** `app.css` explains how each chip was derived
  from its band by hand. Update the names in prose so the comment still tells
  the truth, and change nothing else in it.
- **Do not rename by blind find-and-replace across the repository.** Assert each
  site before you write it, per CONTRACT's edit-by-anchor rule.

## 4. Definition of done

- `grep -rn -- "--dusty-rose\|--deeper-lavender\|--quiet-cobalt"` over `apps`
  and `packages`, excluding `node_modules`, returns **nothing**.
- The same grep over `docs` is **untouched**, and you say how many hits remain
  there so the number is on the record.
- Five gates at baseline. **Gate 4 should not move**; if it does, stop and say
  why before changing the ship script.
- At 1400 px, open each of the four documents and confirm the desk, the band and
  the language chip are the colours they were. **State the expectation before
  you look.**

## 5. The return memo

`docs/sessions/memo-colour-token-rename_r1_<date>.md`. The confirmed counts.
Every file touched. The grep results from §4. A section listing what you could
not establish.

**NOT ESTABLISHED beats a complete invented answer.**
