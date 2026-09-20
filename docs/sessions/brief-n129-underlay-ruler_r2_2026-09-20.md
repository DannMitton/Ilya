# Brief: N.129, the underlay draws in the face its widths were measured from

Revision 2, 2026-09-20. Written at the desk. Build in Claude Code.

**REVISION 1 OF 2026-09-16 IS SUPERSEDED AND ITS DIRECTION IS WRONG.** It remeasured
the Cyrillic table into Source Sans 3. Dann ruled the opposite at 13:02 on 2026-09-20.
Do not build from r1.

**Item:** N.129. Spec: `docs/memory/OPEN.md`, the paragraph headed "N.129, THE UNDERLAY
IS SPACED IN THE WRONG FONT'S METRICS", the block under it headed "FOLDED IN 2026-09-14
ON DANN'S WORD", and the block headed "RULED BY DANN 2026-09-20, 13:02 and 13:09".
**Read all three in full.** Also read `docs/memory/PRODUCT.md`, "What Ilya produces",
the paragraph "AMENDED 2026-09-14 BY DANN", for his ruling that layout and spacing are
editorial.

---

## What Dann ruled, 2026-09-20

**The option was the desk's. The ruling is his.** The desk put two options to him:
remeasure the table into Source Sans 3, or draw the underlay in Source Serif 4, which
the table already measures. He chose serif.

**The rule, ratified 13:09.** Cyrillic the singer reads is serif, wherever it appears.
Cyrillic that instructs is sans. Any surface that draws Cyrillic at a size other than
12.5 px re-instances the width table at its own optical size rather than rescaling it.

`Reading voice` and `Instrument voice` are the tree's own terms, adopted rather than
coined, from `IntakePanel.svelte:762-764` and `:833-836`.

**An earlier wording, "Cyrillic on paper is serif, Cyrillic in the interface is sans",
was ratified at 13:07 and corrected at 13:09. Do not build to it.** It would have turned
the drawer's poem field and the loupe's syllable row sans.

---

## The goal, in the singer's words

Dann, 2026-09-14, after reading `не прог ляд – на я,` on the page and counting three
hyphens missing from one word: *"I don't want Ilya dropping hyphens. Instead, I want the
note spacing to shift to permit the appearance of hyphens properly."*

A singer reads every hyphen a word has, and the ink sits in the space that was reserved
for it, because the face the page draws is the face the widths were measured from.

---

## What the desk read in the tree, 2026-09-20, at HEAD `5ce6335`

- `packages/score-parser/src/underlay-widths.ts:690` declares the Cyrillic table as
  Source Serif 4, measured at 12.5 px. **It is already correct for the ruled face and
  it does not change.**
- `packages/score-parser/src/staff-renderer.ts:3327` is the only emission of Cyrillic
  underlay text. It carries no `font-family`, so it inherits the SVG root.
- `staff-renderer.ts:3462` sets that root to `'Source Sans 3'`. **The root also feeds
  measure numbers (`:2238`), tuplet numerals (`:2301`) and time-signature digits
  (`:2579`). Those are not Cyrillic and Dann's ruling does not touch them.**
- `staff-renderer.ts:1097` exports `CYR_FONT_SIZE = 12.5` and `:132` declares
  `CYR_FONT_PX = 12.5`. **Two constants, one number.**
- `staff-renderer.ts:1095` exports `IPA_FONT_FAMILY`. That is the file's existing
  pattern for a face constant.
- The hyphen omission: `staff-renderer.ts:3397-3399`, `from = rightEdgeOf(a) + 2`,
  `to = leftEdgeOf(b) - 2`, `if (to <= from) continue`. `clampHyphenX` (`:1193`)
  already handles a gap narrower than the hyphen and is never reached in that case.
- `INK_CLEAR_SP = 0.5` (`:1214`) is the one floor between columns and knows nothing
  about hyphens.
- `apps/web/src/app.html:16` already loads both faces. The ruled face costs no new
  font load.
- `Loupe.svelte:990-992` and `:1041` read the face off the page's own clef `<text>`,
  so the loupe follows the page. **Do not give the loupe its own face.**
- `Loupe.svelte:9`: the loupe is a view transform, not a second renderer, so the
  optical-size clause cannot bite today.

**Line numbers in r1 had drifted and are corrected here. Assert every anchor before
you write, and refuse on anything but exactly one match.**

---

## Build in this order, and ship the two steps separately

**DESK DEFAULT, reversible:** step 1 and step 2 ship as two commits with a walk between
them. Step 1 must not move a single column, and step 2 moves many. One commit would
make the walk unable to attribute what it sees.

### STEP 1. THE FACE. Change what is drawn, and nothing that is measured

1. **Export one face constant** beside `IPA_FONT_FAMILY` at `staff-renderer.ts:1095`,
   named `CYR_FONT_FAMILY`, holding the Source Serif 4 stack that `app.css:23` already
   defines. Use it at `:3327`.
2. **Do not touch the SVG root at `:3462`.** Measure numbers, tuplet numerals and
   time-signature digits inherit from it and are outside this ruling.
3. **Do not change `underlay-widths.ts`.** Its table is already the ruled face.
4. **Tie the drawn face to the measured face with a test that fails if they differ.**
   The table declares its face in its own header; assert against that, not against a
   second copy of the string.
5. **Collapse `CYR_FONT_SIZE` (`:1097`) and `CYR_FONT_PX` (`:132`) into one exported
   constant.** Two names for one number is the same class of drift this item exists to
   close. If you find a reason they must stay separate, say what it is and leave them.
6. **State your expectation before you measure, per the control rule.** The desk's
   expectation, and it is falsifiable: **no column moves, no hyphen endpoint moves, and
   pagination is byte-identical**, because the advance widths come from a table that
   does not change. **Only the letterforms change.** The desk's likeliest failure mode:
   a snapshot or golden-SVG test asserts on the absence of a `font-family` attribute at
   `:3327`, or on the rendered string, and fails for a reason that is not a defect.
7. Run the gates. **Report every test whose expected number moved and why.** Read the
   baselines from `docs/memory/ENVIRONMENT.md`, section `Gate baselines`, when you
   start. **Note that web-test moved to 1263 on 2026-09-20.** Do not edit an expected
   value without saying why the new one is right.

### STEP 2. HYPHENS ARE NEVER OMITTED. Ruled by Dann 2026-09-14

1. Remove the silent omission at `staff-renderer.ts:3399`. Every join between two
   syllables of one word draws at least one hyphen.
2. **Give a gap inside a word a larger floor than a gap between words**, sized to hold
   the hyphen plus its clearance, so the spacer widens the column rather than the
   hyphen overhanging. **The shape is DESK INFERENCE from the spec, item 5, and Dann
   can wave it off.** Say what value you chose and why.
3. `clampHyphenX`'s overhang case should now be unreachable in practice. Keep it as a
   guard, and say in its comment that Dann ruled against omission.

**Named cost, and it is accepted:** wider word-internal gaps mean fewer measures per
system and different pagination on every page. Dann's ruling of 2026-09-14 makes spacing
editorial, with justification as the standard.

---

## The optical-size obligation this ruling takes on

`underlay-widths.ts:65-71` warns in its own words that the table is pinned to
`opsz=12.5`, that Cyrillic drawn at a much larger size resolves a narrower instance, and
that you re-instance rather than rescale. Source Serif 4 has an `opsz` axis
(`app.html:16`, `opsz@8..60`). Source Sans 3 as loaded has none.

**This cannot bite today**, because the loupe is a view transform and the font-size never
changes. **It bites when N.153 re-engraves the held measure at its own spacing**, which
`SEQUENCE.md:43` puts directly behind this item.

**Leave a comment at the face constant saying so**, in one sentence, naming N.153. Do
not build anything for it now.

---

## What NOT to do

- **Do not remeasure the Cyrillic table.** That was r1's instruction and it is reversed.
- **Do not change the SVG root at `:3462`.**
- **Do not shrink the stave to fit more systems** (CONTRACT section 6).
- Do not change the IPA table or the Lato IPA face.
- Do not give the loupe its own face constant.
- Do not change `VocalLineEvent`.
- **No git command that writes:** no `add`, `commit`, `push`, `checkout`, `reset`,
  `restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`. To measure a
  before state, copy the file aside and copy it back.

---

## Definition of done

1. The Cyrillic underlay draws in Source Serif 4, from one exported constant, and a
   test fails if that constant and the table's declared face diverge.
2. **Step 1 moved no column and no hyphen endpoint.** Show this, do not assert it.
3. No hyphen is omitted anywhere, on any fixture.
4. On the word Dann read on the N.118 walk, `не прог ляд – на я,`, every hyphen draws.
   Say which song it is in; if you cannot find it, say so.
5. All five gates green, with any baseline movement named.
6. Walked in a browser by Dann, and in print. **WRITTEN is not DONE.**

---

## What to return

A memo at `docs/sessions/memo-n129-underlay-ruler_r1_<date>.md`:

1. What you changed, by file and line.
2. Your expectation before each measurement, and the measurement. **For step 1, the
   evidence that nothing moved.** For step 2, the change in systems per page on T05 and
   on the engraved Without Sun song 1.
3. The gate results, with any baseline movement named.
4. **A section listing what you could not establish. NOT ESTABLISHED beats a complete
   invented answer.**
5. Any decision this brief did not settle, marked as yours and reversible.

If you create a new file, name it in the memo so Dann can `git add` it before he ships.
