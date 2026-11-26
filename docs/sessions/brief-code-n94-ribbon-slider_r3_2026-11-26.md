# Brief: N.94's ribbon becomes a detented semitone slider (Code, Mac lane), r3

Written by the desk 2026-11-26. **r1 was refused by Fable** (DO NOT SEND, seven blockers, seventeen
amendments); **r2 cleared most of them and was returned SEND WITH AMENDMENTS with four more.** r3 applies
those four, reverses one desk default that removed a shipped capability, and carries the rulings Dann
made between 13:51 and 14:08. Every
`path:line` below was read by the desk from the working tree in this session, and the desk opened the
live ruler on Dann's own score before any of it (`CONTRACT.md` §0.3): printed D major, transposed to
C major, sixteen stops, three bracketed twin pairs with the busier spelling faded.

**r1's fault, so it is not repeated:** it described the rendering and left out the behaviour. `use()` is
the only write to `song().transposition`, so deleting the two pills removed the only commit path. Section
0 below exists because of that.

The ruling is `../memory/OPEN.md`, **N.94 THE RIBBON IS A DETENTED SLIDER OF SEMITONES**, items 1 to 18.
QUEUE row 220.

**Drawings, and they are the design:** `mockup-ribbon-dots_r2_2026-11-26.svg` (md5 `db46730b`, the
desktop ribbon as ruled), `mockup-ribbon-tap-regions_r1_2026-11-26.svg` (md5 `0c19b790`, the tap band),
`mockup-ribbon-french_r2_2026-11-26.svg` (md5 `3c1aa9e3`, French and the padded ends),
`mockup-ribbon-dock-390_r1_2026-11-26.svg` and `mockup-ribbon-dock-travel_r1_2026-11-26.svg` (the phone).
**What in those drawings is superseded, and it is more than r2 said.** The grey box behind node zero is
gone; the “—” under zero is `ORIG.`; the visible “Spell it C♯ instead” line is gone; pairs order flats
first, not the tree's sharp first (`packages/score-parser/src/transposition.ts:295`). **In
`mockup-ribbon-french_r2` the second panel draws the REJECTED option** (the pair shifted inward); Dann
ruled the padded card instead, so only its first panel is the design, and **its 2m / 2M / 4J labels are a
sketch, not a ruling.** **In `mockup-ribbon-dock-390_r1` only panel C is ruled**, chosen over D and E; its
caption “the thumb stays centred” and its 53 px figure are superseded by §6 below.

## The ask, in his words

**13:30:** *"I agree A is elegant. Those labels will be small tap-targets, but a determined user will arrive there. We can also mention this functionality in the trnsposition section of the guide. I loive it. make this our new reality."*

**12:57:** *"The purpose of the transposition ribbon is to transpose, not to attach a correct label."*

**13:09:** *"Numbers on the ticks iare not decimal designations on a number line. They are semitone counts on a transposition ribboin."*

**13:18:** *"I also don't htink we need a USe this key and Cancel buttons. The ribbon being touch-sensitive should be sufficient, with verification chrome after the touch selection."*

**13:59, and it governs every later simplification:** *"I defend Four channels for one fact as multiple ways to serve users."* And: *"users need to be served in the way they speak, keeping the options costs us nothing as long as they message consistently with one another"*.

## Section 0. What a tap is

**Read this before anything else. r1 omitted it and was refused for it.**

Today: `select()` previews only (`transposition-ruler-state.svelte.ts:90-92`); `use()` is the only write
to `song().transposition` and it closes the ribbon (`:109-112`); `close()` discards by construction
(`:113-115`, with `drawn` falling back to the stored choice at `:57`), as the file's own comment at
`:116-120` says. **This holds for the dock too, and r2 missed it: the dock's only `use()` sits inside the
pills at `TranspositionDock.svelte:207`, which §5 deletes. Every other dock route previews — the scroll
settle (`:122`), the arrows (`:151`), both chips (`:158`, `:162`) and the node tap (`:187`). See §6.**

Change the state so that:

- **A tap on a node, or on a spelling half, writes `song().transposition` AND `ruler.selected`, and leaves
  the ribbon open.** `null` for the song when the node is the printed key at its printed signature.
  **Both writes, in one synchronous step.** `drawn` follows `ruler.selected` while the ribbon is open
  (`:57`), so a commit that writes only the song stores a key and leaves the page unchanged.
- **A tap on a pair node, away from its two spellings, commits the bold half** (the live spelling if that
  node is already selected, else the twin that is not dimmed, else on a tie the flat spelling).
- **Arrow keys commit**, the same as a tap. A keyboard user has no other route.
- **Undo** appears after a commit made while the ribbon is open, restores both the stored choice and
  `ruler.selected` as they were before that commit, and goes when the ribbon closes. One level, the last
  commit. DESK DEFAULT for its lifetime and for where it is drawn; `mockup-ribbon-no-buttons_r2` shows it.
- **Closing keeps what is stored.** **A TAP outside the ribbon closes it, not a pointer-down**: on a phone
  a page scroll begins with a pointer-down, and the dock reserves room so she can scroll the page while it
  is open (`TranspositionDock.svelte:20-22`, `:94-106`), so a pointer-down rule would close the dock the
  moment she scrolled to look at the result. Escape closes.
- **A drag holds its node in a third value** that feeds the readout only; `drawn` does not follow it, so
  the paper redraws once, on lift.
- **The ribbon opens with the thumb on the stored key**, node zero when there is none. **DESK DEFAULT,
  and it departs from “the opening at Ilya's recommendation” in `OPEN.md`: under tap-commits, opening on
  Ilya's pick would be a commit she did not make.** `rulerOpening` never sees the stored choice
  (`transposition-ruler.ts:308` returns `clean(requested) ?? clean(pick) ?? home`), and `MarkupPane.svelte`
  is outside this lane's file list, so **the override belongs in `prepare` (`state:122-128`)**.
  Ilya's pick keeps `key.ruler.readoutPick`, and **a mark on its node is NEW, not kept**: today the ruler
  has only `home`, `sel`, `run` and `dim` (`TranspositionRuler.svelte:116-119`), and the runner-up's dotted
  underline hangs on `.stop-name` (`:246-248`), which this lane removes. **Draw both marks and report what
  you drew; neither is in a mockup.**
- **“Try this key” commits the stop it names** and opens the ribbon on it with Undo showing. DESK DEFAULT.
  **Watch one thing:** `rulerOpening` moves a requested key to its cleaner twin (`transposition-ruler.ts:306-308`)
  while `tryKey` does not know the dimmed set, so the key committed and the key opened can differ. Commit
  the stop the ribbon actually opens on. Leaving Markup closes the ribbon (`state:59-61`) and Undo goes.
- `PieceKeyLine.svelte:32` keeps calling the same write.

Arrow keys step nodes, thirteen, not sixteen stops. A spelling half is a sibling button of the node's
radio, reachable by Tab. Every accessible name is unabbreviated (`i18n.ts:639-641`).

## What already exists, so it is not rebuilt

**The search** (`CONTRACT.md:113`): `grep -rn "stopGroups\|stopId\|cleanerTwin\|keyRuler" apps/web/src
apps/web/e2e apps/web/e2e-phone` returned the ruler, the dock, the state, `PieceKeyLine`,
`MarkupPane:718`, `:961`, `InsightsPane:178`, `:334-335`, `:483`, `+page.svelte:990`, and one e2e file.

- **The stops are already a semitone number line**, sorted `a.semitones - b.semitones` ascending
  (`packages/score-parser/src/transposition.ts`), so pitch already rises left to right. **The ±6 window is
  the fold inside `transpositionRulerStops` itself (`:289-290`); `DEFAULT_MAX_SEMITONES` (`:37`) is the
  watch list's search window, read only at `:584`, and the ruler never reads it.**
- **The collapse is already written.** `stopGroups` (`transposition-ruler.ts:187`) returns runs sharing a
  semitone. The ribbon renders one node per GROUP where today it renders one per STOP. **That is the
  rendering change only; the behaviour change is section 0.** `stopGroups` is also read by `twinCounts`
  (`:208`) and `dimmedStops` (`:224`); neither changes.
- **No stored choice is invalidated.** A song stores two numbers (`library.ts:270-276`); `stopId`
  (`:184`) is a string for in-memory sets only; the stops themselves do not change. **No migration.**
- **One of the three ways back exists:** "As printed" in the PIECE band (`PieceKeyLine.svelte:32`,
  `key.band.backToPrinted`, `i18n.ts:2365`). The other two are built here: a tap on node zero commits the
  print, and Undo.

## What to build

### 1. Thirteen nodes, one per group

Node zero is the printed key. **It carries no grey box** (ruled 13:59): the ring on the track and the
word `ORIG.` mark it, and a word reads aloud where a tint does not.

### 2. The sandwich

Top to bottom: **the integer**; **the track**, with a **dot** at each detent and the thumb riding on it;
**the interval label**; and, on the selected node only, **both spellings**.

**Detents are dots, not dashes** (ruled 13:56). Node zero's dot is a ring. Dots inside the travelled
stretch invert to white against the filled bar. The track carries a filled portion from node zero to the
thumb.

### 3. The spelling pair, on the selected node only

**Only the node she stands on shows its spellings** (ruled 13:59). **The flat spelling sits left, the
sharp right** (ruled 14:01) — **this departs from the tree's order, which is sharp first
(`transposition.ts:296`); do not "correct" it.** The live spelling is bold in `--lavender-jewel`; the
other is `--ink-tertiary` at reduced opacity. **Tapping the faded half swaps the spelling and respells
the paper.**

**French prints the words in full on this row**, « ré bémol / do dièse », as `watch.key.tonic` spells
them (`i18n.ts:2339`, with « bémol » `:1538` and « dièse » `:1540`). **RULED by Dann 2026-11-26 14:1x,
knowing the cost:** French already prints the GLYPH on the stop faces and the dock chips today
(`stopLabel`, `transposition-ruler.ts:84-87`, returns « do♯ » in both languages), so the same ribbon
carries both forms. He ruled that acceptable because the two rows do different jobs: the face names a stop
compactly, the pair row is where she reads before choosing. **A later desk does not unify them.**

**Where the worded tonic comes from, because r2 did not say and it is not exported.** `keyName` composes
it privately (`lib/analysis/watchlist.ts:583-593`) and appends the mode, and `watchlist.ts` is outside this
lane's file list. **Add a small exported helper beside `stopLabel` in `transposition-ruler.ts`** that
composes from the same three i18n families (`watch.key.letter.*`, `watch.key.tonic`, `notePicker.acc.flat`
and `.sharp`) and returns the tonic alone, no mode. English returns “D♭” as `stopLabel` does; French
returns « ré bémol ».

**The card gains padding so the ends can centre** (ruled 14:07). « sol bémol / fa dièse » is the longest
pair, about 92 px at 9.5 px type, so each end needs about 46 px of clearance from the outermost node's
centre. **Today that clearance is about 35 px**: 14 px of card padding (`TranspositionRuler.svelte:162`,
`padding: 10px 14px 12px`) plus 4 px on `.stops` (`:183`) plus half a 34 px stop (`:202`). **The card is
pinned `left: 14px; right: 14px` (`:156-157`), so it can only grow 14 px a side before the track shortens.
Measure it and report what you did.** The track does not grow; the card does.
This matters because −6 and +6 are themselves pair nodes on prints of one flat, none, or one sharp.

**The busier twin's count line** (`countLines`, `TranspositionRuler.svelte:65-66`, `:105`) stays in the
readout when that spelling is live.

**Node zero DOES offer its respelling, like any other pair node.** The desk first ruled the opposite and
reversed it on review: on a print in seven sharps, D♭ major is a real stop at 0 semitones
(`transposition.ts:285-295`; `isHome` is false for it, `transposition-ruler.ts:79-81`, so `drawInKey`
respells), and that is among the most useful respellings Ilya offers. **The desk's rule would have deleted
a shipped capability.** Node zero is a pair node on prints of five, six and seven accidentals, and both
ends are pair nodes on prints of one flat, none, or one sharp.

### 4. The spelling tap regions

**A band below the track** (ruled 14:01, and it goes further than he asked because §3 leaves that row
empty for every other node): the regions need not stay inside the node's own width. **Each half is about
96 × 46 px**, past the 44 px floor rather than near it. **They are invisible.** Inside the band but
outside the two halves, a tap selects the node above. **The band's top edge sits BELOW the interval-label
row**, not at the track: starting it at the track would put a neighbour's “M2” inside a spelling region.

**Report the hit size of each half in px.** Name this as a ruled exemption to `CONTRACT.md:180` if it
still falls short, citing the ruling, so a later desk does not repair it.

### 5. No standing buttons

**Delete `.actions` and both pills** (`TranspositionRuler.svelte:132-135`, styles `:255-287`). **Leave
`:289-293` alone: it is the `@media print` rule that keeps the ribbon off the page (`CONTRACT.md:175`).**
In the dock, the pills at `TranspositionDock.svelte:203-210`, styles `:390-415`, and the `.pill-hit` half
of the selector at `:243-244`. Delete `key.ruler.cancel` and `key.ruler.use` (`i18n.ts:2366-2367`).

### 6. The phone keeps every stop by sliding the ribbon

**Ruled 13:52 and 13:55**, panel C of `mockup-ribbon-dock-390_r1`, chosen over two stacked rows and a
vertical ribbon. Thirteen nodes at the 44 px floor need 572 px against a 390 px phone.

**One rule, two appearances: keep the thumb inside the visible window, and slide the ribbon only when it
would otherwise leave.** On desktop all thirteen fit, so it never fires and the control is exactly the
desktop drawing. On a phone seven fit.

**The window rule REPLACES the dock's present scrolling; the two cannot coexist, and r2 was wrong to keep
both.** The dock today is a native horizontal scroller (`.win`, `overflow-x: auto`,
`scroll-snap-type: x mandatory`, `TranspositionDock.svelte:270-277`) whose three parts all assume the
selection sits at centre: `settle()` selects the stop nearest centre after any scroll (`:113-123`), the
centring effect scrolls the selection back to centre on every change (`:131-137`), and the strip carries
half a window of padding at each end for that (`:289`). **That is a thumb pinned at centre, the opposite
of a roaming one.** Followed together, any selection re-centres and the trigger never shows.

**So: delete `settle()`, the `onscroll` handler, the centring effect, the scroll snap, and the `:289`
padding.** The window stops being natively scrollable; set `touch-action` so a drag on the track is not
taken by the browser as a pan. Node spacing is the window's width divided by seven. **The thumb holds
slots two to six**, except at the ends; a selection that would land on slot one or seven slides the ribbon
by the least that returns it.

**DESK DEFAULT on the trigger: LATE**, the thumb roaming five of the seven slots before the ribbon moves,
because the ends are a tritone away and a singer reaching one is deliberate rather than browsing. **Stated
once, here: "past the window's edge" elsewhere in this brief means exactly this.**

**Every dock route commits**, since section 5 removes the pills that held its only `use()`: the node tap
(`:187`), both chips (`:158`, `:162`), the arrows (`:151`), and a drag's lift. `select()` then has no
caller and the preview state goes with it. The chips keep their strings.

**At an end node the outer spelling half is clipped.** In slot one the node sits about 27 px from the
screen edge, so that half falls under 44 px. Report its measured size; do not shrink the inner half to
compensate.

### 7. Snap, clamp, and the off-strip lift

**Ruled 13:33 and 13:35.** Snap to the nearest node on release. On an exact midpoint, the node nearer
zero; where the tie straddles zero that is the printed key. A drag past either end clamps to −6 or +6. A
lift with the pointer off the strip commits the node last under it.

## The sites

| site | what |
|---|---|
| `melody/transposition-ruler-state.svelte.ts:47-57`, `:90-128` | commit, Undo, the drag's node, close, opening — section 0 |
| `melody/TranspositionRuler.svelte:75-95` | `selectedIndex`, arrows, Escape, focus: nodes, not stops |
| `melody/TranspositionRuler.svelte:108-130` | one node per group |
| `melody/TranspositionRuler.svelte:132-135`, `:255-287` | `.actions` and both pills go; `:289-293` stays |
| `melody/TranspositionRuler.svelte:156-157`, `:162` | the card's padding grows; the track does not |
| `melody/TranspositionRuler.svelte:179-231` | the sandwich: integers, track, dots, thumb, labels, spellings |
| `melody/TranspositionRuler.svelte:191-196`, `:214-216` | the pair bracket and the 30 px pair stop go |
| `melody/TranspositionDock.svelte:57`, `:113-137`, `:171-194`, `:203-210`, `:270-277`, `:285-347`, `:390-415` | the window rule replaces the scroller; every route commits |
| `melody/transposition-ruler.ts:84-87` and after | the worded-tonic helper beside `stopLabel`; pure helpers for nodes, snap, the window |
| `transposition-ruler.ts:11-13`, `TranspositionRuler.svelte:1-31`, `TranspositionDock.svelte:1-26` | three header comments describe drawing r4 and become false |
| `lib/i18n.ts` | the keys below |
| `apps/web/e2e/insights-key-lines.test.ts:158-177` | rewritten: it clicks "Use this key" today |

**What depended on them agreeing** (`CONTRACT.md:101`): the ruler and the dock share one state object, so
a commit-on-select would commit on every dock scroll. Hence the split in §6.

**Do not edit the text of** `key.ruler.readout`, `key.ruler.down`, `key.ruler.up` or
`key.ruler.interval.*` (`i18n.ts:2369`, `:2375`, `:2376`, `:2377-2382`): INSIGHTS reads them (`insights/key-lines.ts:60`, `:65`,
`:153`).

## Strings

English is the desk's draft; **French is Dann's to rule and is marked.**

| key | English | French (DRAFT) | where it shows | coined or adopted |
|---|---|---|---|---|
| `key.ruler.orig` | ORIG. | ORIG. | node zero's label | RULED 2026-11-26 13:36 |
| `key.ruler.respell` | Spell it {tonic} instead | Écrire plutôt {tonic} | accessible name of the faded half; never visible | phrase coined by the desk |
| `key.ruler.undo` | Undo | Annuler | the Undo control | adopted from `clitic.undo` (`i18n.ts:428`) |

`{tonic}` is `stopLabel`, as in `key.dock.*`, **not** `{key}`, which holds a full key name everywhere
else.

**The interval labels** are `key.ruler.short.1` to `.6`, six keys. English: **m2, M2, m3, M3, P4, TT**.
DESK DEFAULT; standard in theory writing, but their use on a control is the desk's coinage. **The French
set is NOT RULED and is Dann's**: French abbreviates the other way round (2m, 2M, 4J). Ship the French
equal to the English until he rules.

**Flagged to Dann and not resolved here:** his consistency rule of 13:59 is strained in both languages at
the first two labels. The readout says "a semitone" and "a whole tone", which are tone-words; m2 and M2
are interval-words. The rest of the row agrees. Do not resolve it in code; report it.

## Constraints

- Files that change: in `apps/web/src/lib/melody/`, the ruler, the dock, the state,
  `transposition-ruler.ts` and its test; `apps/web/src/lib/i18n.ts`;
  `apps/web/e2e/insights-key-lines.test.ts`. Nothing else.
- **`printedKey`, `NamedKey`, and `transposition-ruler.test.ts:76-80` are not touched: the mode gate is
  lane A's.**
- **`ORIG.` is a deliberate second term for the printed key** beside « Tonalité imprimée » and “As
  printed” (`i18n.ts:2365`, `:2391`), ruled knowingly. **Do not unify them.**
- **Drag is a DESK DEFAULT Dann has not ruled** (sections 0 and 7). If he strikes it, keep every snap rule
  for the tap and build nothing else for the gesture.
- **The Guide's transposition paragraph is owed (`OPEN.md` item 5) and is OUT of this lane**, with a QUEUE
  row of its own. Write no documentation here.
- `transpositionRulerStops` is NOT changed. The stops are right; only their rendering moves.
- The double-accidental ruling of 2026-09-28 is NOT changed. At render the busier twin is the one whose id
  is in `ruler.dimmed` (`TranspositionRuler.svelte:119`); `cleanerTwin` runs only at opening
  (`transposition-ruler.ts:306`). **On the selected node the bold half is the live spelling. On a tie
  neither is dimmed (`transposition-ruler.ts:227`); bold the flat spelling. DESK DEFAULT for the tie.**
- No `git add`, `commit`, `push`, `checkout`, `reset`, `restore`, `clean`, `stash`, `rm`, `mv`, `merge`,
  `rebase` or `tag` (`CONTRACT.md:109`). Own branch; Dann merges.
- All gates at baseline; no baseline moves without saying which and why.

## Done when

- On `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` (fifths 2, mode major, at
  its `:37-38`): thirteen nodes reading
  −6 to +6 left to right, and exactly three show two spellings, at −3, −1 and +4. **State the three, and
  the order each pair prints in, from the running app.**
- **Tap −2, tap the paper: the ribbon closes, the PIECE band reads "Key: C major, transposed", and it
  still does after a reload.** INSIGHTS reads the song in C major.
- Tap −2, then Undo: the paper, the band, and the stored choice are as before the tap.
- Tap node zero from a transposed song: the band reads "as printed".
- Tapping a faded spelling respells the paper, the readout and the band; tapping the other returns; the
  choice survives a reload.
- On a print in five sharps, node zero carries two spellings **and its swap works**, and a song stored as
  the printed key's twin opens with that twin live. On a print with no sharps or flats, −6 and +6 both
  carry two; report whether they centre inside the padded card or are clipped.
- In French, « ré bémol / do dièse » prints in full and centres, at −1 and at both ends.
- Arrow keys walk thirteen nodes; Tab reaches the faded spelling; no accessible name is abbreviated.
- Nothing named Cancel or "Use this key" in the ruler or the dock; `key.ruler.cancel` and `key.ruler.use`
  are gone from `i18n.ts`.
- Each snap rule has a unit test, **and one browser test drags from 0 to −2 and asserts the paper redraws
  once, on release.** Say which file holds the browser tests, since the only e2e file this lane may touch is
  `insights-key-lines.test.ts`; if a new file is needed, stop and report rather than creating one.
- **A keyboard-only pass commits**: arrow to −2 and the band reads “transposed” with no pointer used.
- **A tap outside closes the ribbon; a page scroll with the dock open does not.**
- At 390 px the ribbon shows seven nodes and slides only past the window's edge; the thumb never leaves.
- Print preview shows no ribbon.
- Screenshots saved for the desk (`CONTRACT.md` §0.3): the ruler at 1440 px open on Sunless 01 at −1, and
  the dock at 390 px.

## NOT ESTABLISHED

**NOT ESTABLISHED beats a complete invented answer.**

- **A modeless score is out of this lane.** Its ribbon never opens today: `printedKey` returns null
  (`transposition-ruler.ts:49-51`), so `PieceKeyLine.svelte:28` draws nothing and `MarkupPane.svelte:961`
  never mounts it. Lane A of TRANSPOSITION ON DEMAND opens that gate. **Build nothing for it here.**
- What a continuous redraw costs on a phone. The design avoids it by redrawing on lift; the figure is
  unmeasured. Report it.
- Whether any gate fails on unused i18n keys, now that two are deleted.
- The French interval abbreviations. Dann's.

## Return memo

One file at `docs/sessions/report-code-n94-ribbon-slider_r1_2026-11-26.md`: the three twin nodes and each
pair's printed order as the running app reports them; the snap and drag tests; both screenshots; the
spelling half's hit size in px; the phone redraw figure; and what you could not establish.
