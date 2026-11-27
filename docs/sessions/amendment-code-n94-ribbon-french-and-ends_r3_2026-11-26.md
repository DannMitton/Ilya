# Amendment r3 to brief r3: the French abbreviations, and room for the pair at the ends

2026-11-26, desk. **Supersedes r2** (md5 `47a86de0a9fabbd2f906025b09a7e607`) and r1. Reviews:
`review-fable-amendment-n94-french-and-ends_r1_2026-11-26.md` and `..._r2_2026-11-26.md` (md5
`8ae3f3ca10536581833698cbf275d942`). **r3 applies every blocker and amendment of both; Fable's r2 review states
that r3 does not come back to it.** Amends `brief-code-n94-ribbon-slider_r3_2026-11-26.md` for the lane as built
in `report-code-n94-ribbon-slider_r1_2026-11-26.md`, branch `mac-n94-ribbon-slider`, nothing committed.

**Dann's rulings:** 18:54, the French abbreviation forms. 19:13, room at the ends by padding rather than by
shifting the pair. Everything else below is the desk's and is his to strike.

**Every line cited was read in the working tree by the desk on 2026-11-26.**

**Struck from r2:** its claim that the drag clamp at `TranspositionRuler.svelte:164` needs bounds of 0 and 12.
`snapSemitone` already clamps to ±6 (`transposition-ruler.ts:397-400`). Do not touch `:164`.

## Item 1. The French interval abbreviations. RULED by Dann 2026-11-26 18:54

The six `fr` values at `i18n.ts:2401-2406`. Write them with the escape, as the file's neighbours do
(`i18n.ts:2362`, `:2364`), not a literal space:

| key | en, unchanged | fr, new, as source text | the French noun |
|---|---|---|---|
| `key.ruler.short.1` | `m2` | `'2de m'` | seconde mineure |
| `key.ruler.short.2` | `M2` | `'2de M'` | seconde majeure |
| `key.ruler.short.3` | `m3` | `'3ce m'` | tierce mineure (`i18n.ts:2377`) |
| `key.ruler.short.4` | `M3` | `'3ce M'` | tierce majeure (`i18n.ts:2378`) |
| `key.ruler.short.5` | `P4` | `'4te J'` | quarte juste (`i18n.ts:2379`) |
| `key.ruler.short.6` | `TT` | `'TT'` | triton (`i18n.ts:2380`) |

**The test changes in the same pass or gate 4 fails.** `transposition-ruler.test.ts:227` reads
`expect(shortInterval(2, 'fr')).toBe('M2');`. Replace it with one `toEqual` of all six French values, in the
shape `:225` uses for English, written with the ` ` escapes.

**Coined and adopted.** `2de` is the OQLF's form for the ordinal adjective *seconde*
(`vitrinelinguistique.oqlf.gouv.qc.ca`, id 24271, read by the desk). That page's general rule for other ordinals
gives `3e` and `4e`; **`3ce` and `4te` are the desk's analogy with `1re` and `2de`, not that page's method, and
their usage in French music writing is NOT ESTABLISHED**, with *GDRM* not opened. `m` and `M` are adopted from
the readout's « mineure » and « majeure ». **`J` for « juste » is the desk's coinage.** `TT` is unchanged.

**Typography, desk default.** The OQLF sets those letters raised and admits the line where raising is not
possible: *« il est admis de les écrire sur la ligne »*. The row is 10 px (`.interval`,
`TranspositionRuler.svelte:526-532`), so the letters stay on the line and the tolerance is named rather than
passed over.

**Unruled and not ratified by this lane:** `key.ruler.respell` (`i18n.ts:2399`) and `key.ruler.undo` (`:2400`).
`i18n.ts:2396-2397`'s comment saying these ship equal to the English goes false for `short.*`; correct it.

## Item 2. The docked window travels one slot past each end. RULED by Dann 2026-11-26 19:13

**The fault.** Report r1 item 3: on a 390 px phone « sol bémol » begins 17 px outside the screen at −6 and
« fa dièse » ends 7 px outside it at +6. The pair is a zero-width anchor at the node's centre (`.pair`,
`TranspositionRuler.svelte:559-566`) with two 96 px halves hung off it (`.spell`, `:568-595`), and the docked
window clips (`:401-404`), so a clipped word is not there at all.

**The build. The track does NOT grow.** It stays thirteen nodes wide, and the window is allowed to travel one
slot beyond each end, so an end node rests in slot two or slot six and its pair centres as ruling 17 has it.
Growing the track instead would break `centre()` (`TranspositionRuler.svelte:91`), the rail (`:243`), the fill
(`:247`), the drag's slot width (`:161`) and the CSS literal `calc(100% * 13 / 7)` (`:411-412`). None of those
is touched by this build.

**The whole logic edit is `transposition-ruler.ts:412`,** the clamp inside `slideWindow`. Today it is
`Math.min(count - WINDOW_SLOTS, Math.max(0, kept))`. It becomes a clamp whose low bound is −1 only while the
selected node is the first, and whose high bound is `count - WINDOW_SLOTS + 1` only while the selected node is
the last. In every other position the bounds are today's.

**So the blank leaves as soon as she steps off the end node.** DESK DEFAULT, Dann's to strike. Without this
clause the LATE trigger (`:411`) holds the blank on screen at −6, −5, −4, −3 and −2, and at the five highest
stops; with it, the blank shows only while −6 or +6 is the chosen stop.

**No blank element exists.** The blank is empty track revealed by the transform (`:241`), so nothing can take
focus, be tabbed to, be read aloud inside the `radiogroup` (`:232`), or be tapped (`:147-148`). A drag across it
lands on the end node, by ruling 9's clamp (`snapSemitone`, `transposition-ruler.ts:397-400`).

**No edit needed, confirmed by reading each:** `:241`, `:91`, `:243`, `:247`, `:161`, `:164`, `:114`
(`slideWindow(3, selectedIndex)` still returns 3 at node zero), `:307-308` (the fades' conditions stay true at
both bounds), and `:411-412` (CSS).

**The departure, stated in full.** Ruling 15 reads seven nodes on the phone. While −6 or +6 is the chosen stop,
six nodes show and one slot is blank. Dann ruled the padding at 19:13; the desk chose the clause that limits the
blank to those two stops, and the desk homes both in `OPEN.md`.

**The 44 px exemption.** Under r1's shifted pair the outer tap half at an end node was 27.5 px. With the end
node in slot two or six it returns to about 83 px at 390 and about 69 px at 320, which is above the floor but
**not the full 96 px**, so the exemption retires only if step 0 measures it so. The desk records it after.

## Step 0: the measurement. Keeps nothing, runs before the build

In the browser, in French:
1. The painted width of `.interval-text` (`TranspositionRuler.svelte:275-279`) for each of the six
   abbreviations at 10 px, against its own `.node`, each side measured separately, at 390, at the narrower of
   320 or 360, and at 1440. Report whether any overflows its node or its neighbour's.
2. The current, pre-build px by which each half of the pair at −6 and at +6 sits outside the docked window.
3. After the build: the two halves again, and the hit size of the outer half at an end node, at 390 and 320.

**If an abbreviation overflows its slot, stop and report.** The form is Dann's ruling; the fallback is his.

## Tests

**Unit** (`transposition-ruler.test.ts`): `:300-302`'s expected firsts become `[-1, 0, 6, 7]`; `:304-315` loops
`first` over −1..7 and asserts the selected node sits in slots two to six for every node; `:290-298` hold
unchanged. Add one case that the low bound −1 applies only at the first node and the high bound 7 only at the
last.

**Browser** (`apps/web/e2e/insights-key-lines.test.ts`):
- **`:608`'s last tuple `[-6, -6]` goes red by design.** `window7` (`:586-597`) returns six nodes at an end
  under this build. Update `:608` and the title at `:600`: the expected windows are `[-6..-1]` at −6 and
  `[+1..+6]` at +6. `:614-616`, `:626-630` and `:636-659` are expected to hold; **the whole file must pass**,
  and Playwright is in no gate, so this done-when is the only thing that requires it.
- **The French end test.** In the docked describe, on a fixture with `fifths: 0` (a pair at both ends:
  `transposition-ruler.test.ts:211-216`, `:235`; `e2e:377`), in French, at −6 and at +6, with each spelling live
  in turn: each `.spell span` rect lies inside the `.ribbon` rect by at least 5 px, which is `.spell`'s own
  horizontal padding (`:575`). Run at 390 and at the narrower of 320 or 360. **It waits for the 0.2 s slide**
  (`:411-414`), since the pair draws at once (`:283`). Add, as `e2e:385-388` does for the desktop, that the pair
  is centred on its node and that the end node sits in slot two or slot six.
- **Run it red on the tree first and report the −17 px and +7 px it catches.** A visibility check is not enough:
  the window is `overflow: clip`, and `getBoundingClientRect` ignores the clip, which is why the rect test works.
- **The French dock route at `fifths: 0` is not established.** `openInsights` hard-codes `'en'` (`e2e:59`) and
  `openDock` looks for "As written" (`e2e:573`); `openMelody` (`e2e:175`) takes both languages. Find the route,
  report which one you used, and stop and report if there is none.
- One test that a drag across the blank slot lands on the end node.

## Done when

- The six French values read as the table sets them, with the escapes, and no English value changes.
- `transposition-ruler.test.ts` pins all six, and gate 4 moves only by tests this amendment adds.
- The French end test passes at both widths, after being seen to fail on the tree.
- The whole of `insights-key-lines.test.ts` passes, `:608` included.
- The desktop is untouched: `e2e:374-389` keeps its assertions and they still pass.
- Seven gates at baseline.

## Comments that go false, and what this supersedes

Correct in the same pass: `transposition-ruler.ts:402` and `:405-409`; `TranspositionRuler.svelte:39-41`,
`:113`, `:163`, `:399-400`; `TranspositionDock.svelte:6-8`; `i18n.ts:2396-2397`. This supersedes
`brief-code-n94-ribbon-slider_r3_2026-11-26.md` `:202-204` (seven nodes always visible) and `:214-216` (the
end-node hit sizes).

## Every other site that computes the same thing

`shortInterval` (`transposition-ruler.ts:368-369`) is the only reader of `key.ruler.short.*` and returns
`key.ruler.orig` at zero (ruling 8). The pair's position is `.pair` (`:559-566`), `.spell.flat` (`:587-590`),
`.spell.sharp` (`:592-595`) and `.slash` (`:610-619`); this build moves none of them. The window's geometry is
`WINDOW_SLOTS` (`transposition-ruler.ts:403`), `slideWindow` (`:410-413`), the transform
(`TranspositionRuler.svelte:241`), and the clip (`:401-404`). `i18n-index.test.ts` counts keys, not values.

## What the agent could not establish

**NOT ESTABLISHED beats a complete invented answer.**

- `3ce` and `4te` in French music writing; *GDRM* not opened.
- This build on a screen: not drawn and not run. A positive `translateX` under `overflow: clip` in WebKit.
- Any painted width. The figures above are read from the code and from report r1, not measured.
- **Held, out of this lane:** the readout names one and two semitones in tone words in both languages
  (`i18n.ts:2375-2376`) while the abbreviation names them as seconds. English ships the same mismatch.
