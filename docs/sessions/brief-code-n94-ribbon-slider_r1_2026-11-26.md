# Brief: N.94's ribbon becomes a detented semitone slider (Code, Mac lane), r1

Written by the desk 2026-11-26 from Dann's design session of 12:50 to 13:37. Every `path:line` below was
read by the desk from the working tree in that session, and **the desk opened the live ruler on Dann's own
score before drawing any of it** (`CONTRACT.md` §0.3): printed D major, transposed to C major, sixteen
stops, three bracketed twin pairs with the busier spelling faded.

The ruling this builds is `../memory/OPEN.md`, **N.94 THE RIBBON IS A DETENTED SLIDER OF SEMITONES**.
QUEUE row 220.

## The ask, in his words

**13:30, the whole design:** *"I agree A is elegant. Those labels will be small tap-targets, but a determined user will arrive there. We can also mention this functionality in the trnsposition section of the guide. I loive it. make this our new reality."*

**12:57, the frame that produced it:** *"The purpose of the transposition ribbon is to transpose, not to attach a correct label."*

**13:09, on the August refusal:** *"Numbers on the ticks iare not decimal designations on a number line. They are semitone counts on a transposition ribboin."*

**13:18, the chrome:** *"I also don't htink we need a USe this key and Cancel buttons. The ribbon being touch-sensitive should be sufficient, with verification chrome after the touch selection."*

**13:28, the layout:** *"Can you sandwich the slider between the integer line and its interval labels?"*

**13:37, on `ORIG.`:** *"Yes it isn our repsonse to the demand for page real estate while facing the demands of bilingual interface."*

## What already exists, so it is not rebuilt

**The desk searched before proposing** (`CONTRACT.md:111`), and most of this lane is rendering, not logic:

- **The stops are already a semitone number line.** `transpositionRulerStops`
  (`packages/score-parser/src/transposition.ts`) iterates fifths −7 to +7 and sorts by
  `a.semitones - b.semitones`, so the order is already low pitch at the left. `DEFAULT_MAX_SEMITONES = 6`
  (`:37`) already gives the ±6 window.
- **The collapse is already written.** `stopGroups` (`transposition-ruler.ts:187`) returns runs of stops
  sharing a semitone. **The new ribbon renders one node per GROUP where today it renders one per STOP.**
  That is the whole structural change.
- **The default spelling is already chosen.** `dimmedStops` (`:222`) and `cleanerTwin` (`:233`) implement
  Dann's double-accidental ruling of 2026-09-28 21:41. The bold half of a pair is `cleanerTwin`'s answer.
- **The interval words exist.** `readoutInterval` (`:90`), `key.ruler.interval.*` (`i18n.ts:2376` onward),
  and `INTERVAL_NAMES` (`transposition.ts:506`).
- **Restoring the print exists three ways** and needs no new control: node zero, Undo, and "As printed"
  in the PIECE band (`key.band.backToPrinted`, `i18n.ts:2365`).

## What to build

### 1. One node per semitone, thirteen of them

Render from `stopGroups`, one node per group. Node zero is the printed key and keeps its grey home
marker (`.stop.home`, `TranspositionRuler.svelte:218`).

### 2. The sandwich

Top to bottom: **the integer** (`−6` … `0` … `+6`); **the track** with a detent tick under each integer
and the thumb riding on it; **the interval label**; and, on a node whose group has two members, **both
spellings**.

The track carries a filled portion from node zero to the thumb, so the distance travelled is visible
without reading a number.

### 3. The spelling switch IS the label

On a two-member node the two spellings print under the interval label, separated by a slash. The live
one is bold in `--lavender-jewel`; the other is `--ink-tertiary` at reduced opacity. **Tapping the faded
half swaps the spelling and respells the paper.** No other control. Dann accepted the small target
knowingly (13:30).

### 4. No standing buttons

**Delete `.actions` and both pills** (`TranspositionRuler.svelte:131-134`, styles `:255-290`). The tap
commits. After a commit the ribbon shows **Undo**; tapping away closes the ribbon and the change stands.

### 5. Node zero's label is `ORIG.`

In both languages, one string. **This is a deliberate second term for the printed key** beside
« Tonalité imprimée » and "As printed"; see the ruling's item 8. Do not unify them.

### 6. Drag to choose — DESK DEFAULT, Dann has not ruled it

Pointer down anywhere on the track, slide, the thumb and the readout follow, and **it lands on lift**.
While dragging, only the readout moves; the paper redraws once, on release. **Snap rules, RULED:** nearest
node on release; on an exact midpoint the node nearer zero; a drag past either end clamps to −6 or +6; a
lift with the pointer off the strip commits the node last under it.

**If Dann strikes drag, keep every snap rule for the tap and build nothing else here.**

## The sites

| site | what |
|---|---|
| `melody/TranspositionRuler.svelte:108-130` | renders one node per group, not per stop |
| `melody/TranspositionRuler.svelte:131-134`, `:255-290` | `.actions` and both pills go |
| `melody/TranspositionRuler.svelte:179-231` | the sandwich: integers, track, ticks, thumb, labels |
| `melody/TranspositionRuler.svelte:191-196`, `:214-216` | the pair bracket and the 30 px pair stop go |
| `melody/TranspositionDock.svelte:185-192`, `:285-345` | the same treatment at 44 px |
| `melody/transposition-ruler.ts:84` `stopLabel` | still names a key; now used for the spelling pair |
| `melody/transposition-ruler.ts:233` `cleanerTwin` | chooses which spelling is bold |
| `lib/i18n.ts` | new keys below |

**What depended on them agreeing** (`CONTRACT.md:99`): `stopGroups` is consumed by the ruler and the dock
alike, so both must change together or the dock will render the old doubled stops.

## Strings

New. **English is the desk's draft for Dann; French is his to rule.**

| key | English | French (DRAFT) |
|---|---|---|
| `key.ruler.orig` | ORIG. | ORIG. |
| `key.ruler.respell` | Spell it {key} instead | Écrire plutôt {key} |

The interval labels under the track use **m2, M2, m3, M3, P4, TT**. DESK DEFAULT: standard in theory
writing, but their use on a control is the desk's coinage. Ilya's own words shortened need 8.5 px type,
below anything it ships, and do not survive the phone dock.

## Constraints

- No file outside `apps/web/src/lib/melody/`, `apps/web/src/lib/i18n.ts` and their tests changes.
- Geometry in the existing units; the dock's 44 px target does not shrink.
- `transpositionRulerStops` is NOT changed. The stops are right; only their rendering moves.
- The double-accidental ruling of 2026-09-28 is NOT changed.
- No `git add`, `commit`, `push`, `checkout`, `reset`, `restore`, `clean`, `stash`, `rm`, `mv`, `merge`,
  `rebase` or `tag` (`CONTRACT.md:105`). Own branch; Dann merges.
- All gates at baseline; no baseline moves without saying which and why.

## Done when

- Thirteen nodes on a print in two sharps, and **exactly three of them show two spellings**, at −3, −1 and
  +4. State the three from the running app, not from this brief.
- Tapping a faded spelling respells the engraved paper and the readout, and tapping it again returns.
- Cancel and "Use this key" no longer exist anywhere in the ruler or the dock.
- Node zero reads `ORIG.` in both languages.
- Each snap rule has a test: nearest, midpoint-to-smaller, clamp at both ends, off-strip lift.
- A screenshot of the ruler and of the dock at 390 px, saved for the desk to look at (`CONTRACT.md` §0.3).

## NOT ESTABLISHED

**NOT ESTABLISHED beats a complete invented answer.**

- What a continuous redraw costs on a phone. The design avoids it by redrawing on lift, but the figure is
  unmeasured; report it.
- Whether `stopLabel` can produce a name for a score that states no mode. It cannot today: `keyTonic` and
  `keyName` require `mode: 'major' | 'minor'` (`lib/analysis/watchlist.ts:574`). **A modeless score's
  ribbon therefore shows integers and interval labels with no spellings and no key in the readout**, which
  is ruling 7. Say what you had to do to make that render without throwing.
- Whether any singer's stored transposition is keyed to a stop id (`stopId`, `:184`) that this change
  invalidates. Check and report; do not migrate without saying so.

## Return memo

One file at `docs/sessions/report-code-n94-ribbon-slider_r1_2026-11-26.md`: the three twin nodes as the
running app reports them; the snap tests; the two screenshots; the phone redraw figure; the stored-choice
finding; and what you could not establish.
