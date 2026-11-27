# Amendment r2 to brief r3: the French abbreviations, and room for the pair at the ends

2026-11-26, desk. **Supersedes r1** (md5 `f4e84e34007275adcaf7f307560a2fea`), which was returned **DO NOT SEND**
by `review-fable-amendment-n94-french-and-ends_r1_2026-11-26.md` (md5 `ade5c11e66079a5a99d7ceeec1feefb7`).
Amends `brief-code-n94-ribbon-slider_r3_2026-11-26.md` for the lane as built in
`report-code-n94-ribbon-slider_r1_2026-11-26.md`, branch `mac-n94-ribbon-slider`, nothing committed.

**Two rulings by Dann carry this revision.** 18:54, the French abbreviation forms ("A"). 19:13, the room at the
ends ("B", the padded track, over the desk's r1 proposal of a shifted pair).

**Every line cited below was read in the working tree by the desk on 2026-11-26, not taken from the review.**

## Item 1. The French interval abbreviations. RULED by Dann 2026-11-26 18:54

The six `fr` values at `i18n.ts:2401-2406`, which ship the English forms today. Write them with an explicit
no-break space, as the file writes its other spacing (` `), not a literal space:

| key | en, unchanged | fr, new, as source text | the French noun |
|---|---|---|---|
| `key.ruler.short.1` | `m2` | `'2de m'` | seconde mineure |
| `key.ruler.short.2` | `M2` | `'2de M'` | seconde majeure |
| `key.ruler.short.3` | `m3` | `'3ce m'` | tierce mineure (`i18n.ts:2377`) |
| `key.ruler.short.4` | `M3` | `'3ce M'` | tierce majeure (`i18n.ts:2378`) |
| `key.ruler.short.5` | `P4` | `'4te J'` | quarte juste (`i18n.ts:2379`) |
| `key.ruler.short.6` | `TT` | `'TT'` | triton (`i18n.ts:2380`) |

**The test changes in the same pass, or gate 4 fails.** `transposition-ruler.test.ts:227` reads
`expect(shortInterval(2, 'fr')).toBe('M2');`. Replace it with all six French values asserted together, in the
shape `:225` already uses for English. This is the blocker that would have failed the gate.

**Coined and adopted, corrected from r1.** `2de` is the OQLF's own form for *seconde*
(`vitrinelinguistique.oqlf.gouv.qc.ca`, id 24271, read by the desk 2026-11-26). `3ce` and `4te` follow that
page's method, a numeral followed by the word's raised final letters, applied by the desk to interval nouns;
the page does not list them and **their usage in French music writing is NOT ESTABLISHED**, with *GDRM* not
opened. `m` and `M` are adopted from the readout's own « mineure » and « majeure ». **`J` for « juste » is the
desk's coinage.** `TT` is unchanged because « triton » carries the same two letters as "tritone".

**Typography, desk default.** The OQLF sets those letters raised and admits the line where raising is not
possible: *« il est admis de les écrire sur la ligne »*. At the row's 10 px (`.interval`,
`TranspositionRuler.svelte:526-532`) raising is not available to us, so the letters stay on the line and this
amendment names the tolerance as taken rather than passing over it.

**Still unruled, and not to be treated as ratified by this lane:** `key.ruler.respell` (`i18n.ts:2399`,
« Écrire plutôt {tonic} ») and `key.ruler.undo` (`:2400`, « Annuler ») are desk drafts.

## Item 2. The docked track carries a blank slot beyond each end. RULED by Dann 2026-11-26 19:13

**The fault.** Report r1 item 3: on a 390 px phone, « sol bémol » begins 17 px outside the screen at −6 and
« fa dièse » ends 7 px outside it at +6. The pair is a zero-width anchor at the node's centre (`.pair`,
`TranspositionRuler.svelte:559-566`) with two 96 px halves hung off it (`.spell`, `:568-595`), and the docked
window clips (`.docked .ribbon`, `:401-404`), so a clipped word is simply not there.

**The rule to build.** The docked track gains one blank slot, one node wide, beyond node −6 and beyond node +6.
The window still shows seven slots (`WINDOW_SLOTS`, `transposition-ruler.ts:403`). Every node, the two ends
included, then rests in slots two to six, so **every pair centres on its node as ruling 17 has it**, and no
pair-shifting rule is built.

**What this touches, and it is all behind the docked and phone conditions:**
- `slideWindow` (`transposition-ruler.ts:410-413`) and its unit tests. Its comment and its clamp both carry the
  "except where the ribbon ends" case, which the blank slots retire.
- The track transform (`TranspositionRuler.svelte:241`), which divides by `nodes.length` and now spans the
  padded width.
- The drag clamp (`:164`), which today bounds the thumb to the window's slots. **It must bound to the real
  nodes, 0 to 12, so a drag cannot land on a blank slot.**
- The desktop never sees any of it: `:241` is `docked ? ... : undefined` and `:164` is behind `keyRuler.phone`.

**The departures, named.** Ruling 15 reads seven nodes on the phone; at the two ends one of the seven slots is
blank, so six nodes show there. Dann ruled this knowing that cost. The desk homes the ruling in `OPEN.md`.

**A consequence to measure, not to assume.** Under r1's shifted pair the outer tap half at an end node was
27.5 px, a ruled exemption to the 44 px floor (`CONTRACT.md`, tether; report r1's Measured section). With the
ends resting in interior slots the outer half should regain its full width, which would retire the exemption.
**The desk does not record that until step 0 measures it.**

## Step 0: the measurement. Keeps nothing, runs before the build

In the browser, in French:
1. The painted width of `.interval-text` (`TranspositionRuler.svelte:275-279`) for each of the six
   abbreviations at 10 px, against its own `.node`, **each side measured separately**, at 390, at the narrower
   of 320 or 360, and at 1440. Report whether any overflows its node or its neighbour's.
2. The current, pre-build px by which each half of the pair at −6 and at +6 sits outside the docked window.
3. After item 2 is built, the two halves again, and the hit size of the outer half at an end node.

**If an abbreviation overflows its slot, stop and report.** The form is Dann's ruling and the fallback is his.

## Done when

- The six French values read as the table sets them, with ` `, and no English value changes.
- `transposition-ruler.test.ts` pins all six French values, and gate 4 moves only by tests this amendment adds.
- **A browser test in the docked describe, in French, on a fixture with a pair at both ends** (`fifths: 0`, as
  `e2e/insights-key-lines.test.ts:375` sets one up; the docked tests at `:567-568` and `:49` open in English
  today, so the language is set explicitly). At −6 and at +6, with each spelling live in turn, it asserts that
  **each `.spell span` rect lies inside the `.ribbon` rect by at least 5 px**, which is `.spell`'s own
  horizontal padding (`TranspositionRuler.svelte:575`). Run at 390 and at the narrower of 320 or 360.
  **Code runs that test red on the tree first and reports the −17 px and +7 px it catches.** A visibility check
  is not enough: the window is `overflow: clip`, so a clipped word passes one.
- The desktop is unchanged: `e2e/insights-key-lines.test.ts:374-389` keeps its desktop centring assertions, and
  they still pass.
- Seven gates at baseline.

## Every other site that computes the same thing

- `shortInterval` (`transposition-ruler.ts:368-369`) is the only reader of `key.ruler.short.*`, and it returns
  `key.ruler.orig` at zero, which stays « ORIG. » in both languages under ruling 8.
- The pair's position is `.pair` (`:559-566`) plus `.spell.flat` (`:587-590`) and `.spell.sharp` (`:592-595`)
  and `.slash` (`:601` onward). Item 2 moves none of them; it moves what the track is wide.
- The window's geometry is `WINDOW_SLOTS` (`transposition-ruler.ts:403`), `slideWindow` (`:410-413`), the
  transform (`TranspositionRuler.svelte:241`), the drag clamp (`:164`), and the clip (`:401-404`).
- `i18n-index.test.ts` counts keys, not values, so no key count moves.

## What the agent could not establish

**NOT ESTABLISHED beats a complete invented answer.**

- `3ce` and `4te` in French music writing. *GDRM* not opened. The OQLF page gives the method, not these words.
- Option B on any screen. It is not drawn and not run; its figures in this file are the desk's reading of the
  code, and step 0 is what settles them.
- Anything on a real phone or in WebKit.
- **Held and not to be repaired here:** the readout names one and two semitones in tone words in both languages
  (`i18n.ts:2375-2376`) while the abbreviation names them as seconds. English ships the same mismatch. Separate
  question, out of this lane.
