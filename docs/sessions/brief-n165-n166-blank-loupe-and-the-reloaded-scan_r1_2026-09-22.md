# BRIEF N.165 and N.166, and N.141's viewBox clamp. The loupe draws nothing, and a stored scan may re-read

**Written 2026-09-22 by the desk, on Dann's instruction. Shape from `BRIEF-TEMPLATE.md`.**
**THERE IS NO CAUSE SECTION. Three things are wrong and the desk has established none of
their causes. Do not build until section 3 is reported.**

---

## 1. What was observed

**All of this is Dann's own screen, 2026-09-22, in French, on the Annotation tab, with the
song `sunless-01-v-chetyryokh-stenakh_lamm-scan`** (the Lamm scan read from PDF, not the
MusicXML fixture).

- **N.165. He clicked a printed note and the loupe opened with NO NOTES IN IT.** Twice,
  on two different measures. **The loupe's own header knew what it held**, both times:
  - « mes. 5 · système 2 sur 5 · 6.5 sur 6, trop pleine » and « A4 · temps 4, division 2 · Noire »
  - « mes. 6 · système 2 sur 5 · 7.5 sur 6, trop pleine » and « C#4 · temps 2, division 2 · Noire »
  - **The loupe drew the clef, the two sharps, the 6/4 and the barlines. No noteheads.**
  - **The page above drew the same measures' notes correctly**, with the squircle around
    the taken note.
  - **His words:** *"There should be visible notes populating the Loupe but they are not
    appearing."* And: *"I assumed this was because there was no text, but that shouldn't
    matter."*
- **N.141's viewBox clamp, or a sibling of it. The squircle loses its bottom edge in the
  loupe** and is closed on the page above. Same mark, two drawings. **Dann: *"why is this
  squircle broken at the bottom?"***
- **N.166. The desk opened the SAME song from the SAME library on the same origin, in its
  own tab, and the score never drew at all.** The drawer sat on
  « Préparation du lecteur de page » for over twenty seconds with no PARTITION receipt and
  12 SVGs on the page, all of them chevrons. **A stored score should not need the OCR
  reader to redisplay.**

## 2. What is established, each line carrying its source

**The desk read these in the tree on 2026-09-22.**

- `loupe-render.ts:79` `renderLoupeMeasure(bundle, m, minGap): LoupeSystemRender | null`.
  **It can return null.**
- `loupe-render.ts:176` `renderLoupeSystem(...)`, same family.
- `loupe-render.test.ts:87` already asserts
  `expect(renderLoupeSystem(b, { fromMeasure: 17, toMeasure: 18 }, 500)).toBeNull()`,
  **so a null return is an expected outcome in at least one case today.**
- `selection-ring.ts` exports `RING_PAD_X` 4, `RING_PAD_Y` 9, `RING_MIN_W` 15,
  `RING_RADIUS` 6, `RING_STROKE` 2, `RING_REACH` = `RING_PAD_Y + RING_STROKE / 2`.
  `VoiceProfilePane.svelte:91` imports `RING_RADIUS` and `ringBox` from it.
- `i18n.ts:899` `upload.status.preparingReader` =
  "Preparing the page reader. This will only happen once." /
  « Préparation du lecteur de page. Cela n'arrivera qu'une fois. »
- It is shown at `ScoreUploader.svelte:530` and `:556`.

**MEASURED by the desk in Dann's Chrome on the alias build, 2026-09-22, and labelled as
browser observation rather than as a tree reading:**

- **The desk's instrument works.** The song `Kabalevsky - Shakespeare - T05` rendered in
  the same tab: 28 SVGs, 834 elements in the score SVG, page reader idle.
- **The score SVG carries no classes and no ids.** Its element tally is 87 `g`, 300 `line`,
  5 `path`, 77 `rect`, 5 nested `svg`, 360 `text`. **Noteheads are music-font `text`
  glyphs**, and nothing in it has a click handler, a role or a tabindex.

## 3. Measure before you change anything. REPORT ALL FOUR BEFORE WRITING CODE

1. **SEPARATE THE TWO HYPOTHESES. This is the point of the whole brief.**
   - **Dann's:** the loupe is blank because the score carries no lyrics.
   - **The desk's:** the loupe is blank because the measure is over-full (6.5 and 7.5 of 6).
   - **`~/Downloads/no-lyrics-control.musicxml` separates them in one run:** it has no
     lyrics AND its measures add up. **Notes in its loupe kills Dann's hypothesis. A blank
     loupe kills the desk's.** `STATE.md` §THE FIXTURE describes it: five pitched notes and
     one half rest, C4 D4 E4 F4 quarters, G4 half, then a half rest.
   - **If BOTH survive, say so.** A third cause is live and section 2's null return is where
     the desk would look first.
2. **Report what `renderLoupeMeasure` actually returns for the failing measure**, and
   whether the loupe's blankness is a null render, an empty render, or a render that draws.
   **The desk is NOT asserting the null path is the cause.**
3. **Report whether a stored scan-derived song re-runs the page reader on load**, and what
   the drawer was waiting for. **If it does, say what a reload costs**: Dann's 23-page PDF
   read took 97.2 s on 2026-09-17.
4. **For the squircle, report the ring's box and the SVG's viewBox in the loupe** when the
   held measure draws no notes, and the same two on the page for the same note. **N.141
   already carries a viewBox clamp as an open item**; say whether this is that item or a
   different one.

## 4. The rulings this serves

- **Dann's instruction of 2026-09-22**, quoted in section 1. **The numbers N.165 and N.166
  are DESK DEFAULTS and he can wave either off.**
- **N.151, ruled by Dann 2026-09-17, bears directly on this:** *"in cases of redrawing
  tuplets, the Ilya measure must tolerate having more beats than the measure allows."*
  **Both failing measures report « trop pleine ».** If an over-full measure draws no notes,
  that ruling is not met, and the fill line reporting "over" in a neutral voice is not
  enough on its own.
- **`PRODUCT.md` §"What the singer may do to a score":** the singer may break a score
  deliberately. **A measure that does not add up is a state Ilya must keep working in**,
  not an error state.

## 5. Constraints

- **DO NOT TOUCH DANN'S LIBRARY.** Work against the fixture and a dev server. **He has an
  empty song `8ff79b63-e6c1-4a13-8e24-25025e8eb6ea` that the desk created by accident while
  setting up the control test; leave it, he will delete it.** The song that was active
  before that is `0714215b-49d3-4be3-9c46-66f6bfc91a74`.
- **Do not fix the page reader's accuracy.** That the Lamm scan's meters disagree with its
  barlines is already recorded as N.146 finding 1 in `OWED.md` and is not this brief.
- **Do not change `renderLoupeMeasure`'s signature**, and do not delete the null path
  before section 3 says what it is for; `loupe-render.test.ts:87` depends on it.
- **Do not widen this to N.92 or N.153.** N.153 closed on scope and its remainder is N.162.
- **What this displaces:** nothing scheduled. `SCHEDULE.md` week 3 has not started. **Say if
  that trade looks wrong from the code's side.**

## 6. Done when

**WRITTEN:**

- The loupe draws the held measure's notes on the failing song, and on the control fixture.
- The squircle in the loupe is closed on all four sides.
- Five gates at baseline: 216, 235, 0 errors with 12 warnings, 1385, 575 passed with 5 skipped.
- **If N.166 turns out to be real, it is reported and NOT fixed in this ship.** It is its own
  item and its fix is a different path.

**DONE is Dann's walk:** the same song, the same two measures, in French, on the alias.

## 7. Report back

The commit, the results against section 6, **all four readings from section 3**, and **what
could not be established.**

**NOT ESTABLISHED beats a complete invented answer.**
