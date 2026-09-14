# Brief: N.138, the loupe supplies the meter for every measure it shows

Revision 1, 2026-09-14. Written at the desk. Build in Claude Code.

**Item:** N.138. Spec: `docs/memory/OPEN.md`, section `N.138`. Read it first.

---

## The goal, in the singer's words

Dann, 2026-09-14: *"I want Ilya to insert the correct corresponding meter
signature for every measure the Loupe displays, even if that measure does not
feature a verbatim meter signature marking in the score. The point is to supply
all of the information the user needs, in order to make sense of these isolate
measures in Loupe."*

A measure raised in the loupe is cut out of its context. It shows a clef and a
key signature and nothing that says how to count the bar. Supply the meter.

**This item is the LOUPE only. It draws nothing on the page.** The page meter
signature is N.139 and is a separate build with a pagination cost.

---

## What is already established. Do not re-derive it

Every line read in the tree on 2026-09-14.

1. **Every measure already carries the meter in effect**, not only the ones that
   declare a change: `packages/score-parser/src/mnx-parser.ts:579` and
   `packages/score-parser/src/musicxml-parser.ts:600` both write
   `timeSignature: currentTime`. No lookup is needed, and `timeSignatureAt`
   (`tempo-seam.ts:269`) is not required.
2. **The caller already holds it.** `apps/web/src/routes/+page.svelte:770-773`
   finds the held measure by index and reads `m?.timeSignature` for `heldFill`.
3. **The prop pipeline exists.** `Loupe.svelte:53` takes `measureIndex`,
   `:69-73` takes `fill`, and the `<Loupe>` call site is `+page.svelte:4916-4926`.
4. **The fonts carry the digits.** `FinaleMaestro.json` has bounding boxes for
   all ten of `timeSig0` to `timeSig9`; so do Bravura and Leland. Finale Maestro
   is the default face (`apps/web/src/lib/shane/engine/notation-fonts.ts:5-6`).
   Maestro and Leland ship no `glyphAdvanceWidths`, which costs nothing:
   `packages/score-parser/src/smufl-metadata.ts:256` derives `widthSp` from the
   bounding box. `staff-renderer.ts:564` already declares the ten as
   `RequiredGlyphName`.
5. **The head is the right side for a time signature**, and the project had
   already reasoned this: `apps/web/src/lib/shane/loupe.ts:283-287`.

---

## The shape. A third panel, and nothing else moves

The loupe's head and body render the SAME markup, `frame.inner`, through two
viewBoxes (`Loupe.svelte:887` and `:900`). The head crops `[0, headBound]`, the
clipped window crops `[headBound, right]`, and `clipToHead` carries a written
proof that their union equals the unclipped pair's (`loupe.ts:315-357`). That
file warns in capitals that the bound is coupled to the window's left edge.

**So do not touch `headBound`, `clipToHead`, `measureWindow`, or `headViewBox`.**
Insert a third panel between the head and the body.

The arithmetic to extend, all in `Loupe.svelte`'s frame effect:

- `:584` `headWidthUnits = headBound(inkXs)`
- `:600-601` `view = clipToHead(win, headWidthUnits)`, `viewSpan`
- `:612` `drawnLineGap = lineGap * unitPx`
- `:620` `totalSpan = headWidthUnits + viewSpan`
- `:621` `drawn = Math.min(totalSpan * unitPx * magnification, width)`
- `:622` `scale = drawn / totalSpan`
- `:623-624` `contentWidth = viewSpan * scale`, `headWidth = headWidthUnits * scale`

Add `meterSpanUnits` to `totalSpan` at `:620`, derive
`meterWidth = meterSpanUnits * scale`, and add both to the `frame` object at
`:763-775`. Render the panel between the two existing `<svg>` elements at
`:876-901`, with `viewBox="0 {cropTop} {meterSpanUnits} {cropHeight}"`,
`width={frame.meterWidth}`, `height={frame.contentHeight}`.

The panel draws, in page units so it shares the neighbours' coordinate space:

- the five stave lines, at the same y values and the same thickness the renderer
  uses, so the stave runs unbroken through all three panels;
- the two digits, count over unit, in the selected notation face, placed the way
  an engraver places them: the count centred on the upper two spaces, the unit on
  the lower two.

`meterSpanUnits` is the widest of the two digit groups plus clearance on each
side, expressed in page units through `lineGap`. Derive it from the font's own
metrics, not from a chosen constant.

---

## The four DESK DEFAULTS this brief builds to

Dann may wave off any of them; if he has, the spec in `OPEN.md` says so and that
file wins over this one.

1. The meter draws on EVERY measure the loupe shows, whether or not its system
   declares one.
2. It draws identically to an engraved meter signature. **No editorial mark.**
   CONTRACT §6 forbids a mark that appears on everything.
3. Digits always. Never `timeSigCommon` or `timeSigCutCommon`, even where the
   MusicXML path recorded `symbol: 'common'` (`musicxml-parser.ts:454`). The MNX
   path records no symbol, so digits are the only form both paths produce
   identically.
4. The panel sits between head and body.

---

## The measurement this build owes, and it is not optional

`:621` caps `drawn` at the loupe's `width`, so raising `totalSpan` lowers
`scale`: **the examined measure is drawn SMALLER, the frame does not grow.**

State your expectation BEFORE you measure, per CONTRACT's control rule, then
report against it. Measure, at a 390 px viewport, on the engraved Without Sun
song 1:

- `headWidthUnits`, `viewSpan`, and `meterSpanUnits` on a representative measure;
- `scale` before and after;
- the resulting stave space in CSS pixels before and after.

If the measure drops below a readable stave, say so and stop. Do not tune the
magnification to hide it.

---

## Definition of done

1. The loupe is raised on a measure whose system declares no meter, and the
   correct meter draws between the clef-and-key head and the measure.
2. The stave lines run unbroken through all three panels, observed, not assumed.
3. `headBound`, `clipToHead`, `measureWindow` and `headViewBox` are unchanged.
4. All five gates green. Baselines are in `docs/memory/ENVIRONMENT.md`
   §`Gate baselines`; if gate 4 or 5 moves, say by how much and why.
5. The walk is observed in a browser. **WRITTEN is not DONE.**

Walk it on two scores, both in `~/Downloads`:

- `Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`, which
  declares 6/8 at measure 1 and 12/8 at measure 2, so the loupe must show 6/8 on
  measure 1 and 12/8 on every measure after it.
- `Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell.musx`, which
  declares 2/4 once at measure 1 and never changes, so every measure shows 2/4.

---

## What to return

A memo at `docs/sessions/memo-n138-loupe-meter_r1_2026-09-14.md`, holding:

1. What you changed, by file and line.
2. The measurement table, with your stated expectation beside each reading.
3. The gate results, with any baseline movement named.
4. **A section listing what you could not establish.** NOT ESTABLISHED beats a
   complete invented answer.
5. Any decision you made that this brief did not settle, marked as yours and
   reversible, so Dann can wave it off.

**Do not commit and do not stage.** No agent writes with git.
