# BRIEF. N.149: BUILD BOTH LOUPE MODES

Written by the desk 2026-09-20. Shape from `BRIEF-TEMPLATE.md`.

**DANN'S DIRECTION, 2026-09-20, verbatim:** *"most of my notes will be obviated
by our new understanding of the carets/spacing conflation. That's why I'm
pushing to work on the two modes and the tweening between them."* And: **"BUILD
BOTH MODES."**

**THIS IS THE ONE THING. The spacing complaints of the 2026-09-19 walk are not
the work.** They are room reserved for carets in a view that should not carry
carets. **Build the modes and they go.** Do not build against the individual
spacing complaints.

## 1. What was observed

- **Dann, 2026-09-20:** *"In Syllables mode there are no carets."* The carets
  belong to Corrections, and **Corrections necessarily carries more generous
  spacing** to hold them without collisions.
- **Dann, 2026-09-20:** *"having those carets fade in should intuitively tell the
  user that they are controls interleaved with the notes on the page."*
- **Dann, 2026-09-17, on the design, chosen and restated 2026-09-20:** *"I chose
  A, segmented pair."*
- **Dann, 2026-09-20:** *"We already accept that the engraved measure on Paper is
  not the same as the Loupe."*
- **Dann, 2026-09-17:** *"My plan is to get it off that header entirely and
  populate dedicated Undo/Redo controls into the Loupe's syllables and next,
  into the Corrections, which will also now be relocated to the Loupe to
  economize focus."*

## 2. What is established, each line read this session

**THE CARET GATE ALREADY EXISTS AND IT IS ONE LINE.**

- `apps/web/src/lib/shane/Loupe.svelte:1373`
  `if (!syllablesOpen && positions.length > 1) {` is what decides whether any
  caret is drawn.
- `Loupe.svelte:1307`, the comment over it, states the carets are *"drawn only
  while the syllables row is closed."*
- **So today the loupe already has two caret states. They are keyed to the wrong
  thing: the accordion's open/closed, not a mode.**

**THE BAR AS IT STANDS, from N.147:**

- `Loupe.svelte:139-146` props `syllablesOpen: boolean` and
  `ontogglesyllables: () => void`.
- `Loupe.svelte:2396-2417` the full-width disclosure button carrying
  `aria-expanded`, `aria-controls="loupe-syllables"`, the label
  `T('loupe.syllables')`, and the chevron.
- `Loupe.svelte:2418-2419` renders `LoupeSyllables` when open.

**THE CORRECTION CELLS EXIST AND ARE NOT BUILT HERE.**

- `apps/web/src/lib/shane/CorrectionSurface.svelte`, 1265 lines. `interface
  Props` at `:49`. Its cells include rest (`:96`, `:101`), restore (`:104-105`),
  and accidental (`:128`, `'flat' | 'natural' | 'sharp'`).
- It is mounted from `apps/web/src/routes/+page.svelte`: imported at `:134`,
  drawn at `:4615` and again at `:5006`. **Two mount sites. Establish which is
  the phone dock and which is the desk before moving either.**

**THE SEGMENTED PILL HAS A PRECEDENT IN THE TREE. Copy it, do not invent one.**

- `apps/web/src/lib/components/DeskHead.svelte:108` is
  `<div class="pair" role="tablist">`, with `.pair-member` buttons at `:110-119`
  carrying `role="tab"`, `aria-selected`, a roving `tabindex`
  (`activeTab === id ? 0 : -1`) and `handlePairKeydown`.
- **`DeskHead.svelte:100-107` records a ruled trap: NO `aria-controls` on the
  pair members.** It pointed at an id that was never in the DOM. Do not add one.

**THE UNDO AND REDO PAIR EXISTS.**

- `apps/web/src/lib/components/Drawer/Drawer.svelte:189`
  `stackActions(undoLabel, redoLabel, language)`, imported from `./bandState`
  at `:5`.
- `Drawer.svelte:143-146` the props `undoLabel`, `redoLabel`, `onundo`,
  `onredo`; `:562-564` the click and the `↰` / `↱` glyphs.
- **Reuse this pair and its labels. No new strings and no new French.**

**LEADS, not evidence:** `docs/memory/OPEN.md:1334-1392` (N.148, N.149, N.150 and
the recovered design), and
`../sessions/design-n149-loupe-two-panels_r1_2026-09-17.html`, which is the
chosen drawing. **Open the drawing before you build the bar.**

## 3. Measure before you change anything, and report before writing code

1. **The two `CorrectionSurface` mount sites.** `+page.svelte:4615` and `:5006`:
   which is which, what each is gated on, and what props each passes. Report
   both before moving either.
2. **What else reads `syllablesOpen`.** `Loupe.svelte:647`, `:1285`, `:1307`,
   `:1373` are known. List every other reader, in the loupe and outside it.
   **The mode replaces this flag's job in the caret gate and must not silently
   change its other jobs.**
3. **Whether `LoupeSyllables` and `CorrectionSurface` can share the loupe's
   panel region without either one resizing the card.** Report the measured
   height of each at phone width on T05.

**The cause of anything you find is yours to state. This brief supplies none.**

## 4. The rulings this serves

- **Design A, the segmented pair. Chosen by Dann 2026-09-17, restated
  2026-09-20.** Its own words: *"Two segments in one pill on the left of the
  bar, the way the desk selector already pairs Transcription and Fit. The chosen
  one is filled. Undo, Redo and the chevron sit flush right."*
- **The loupe opens on Syllables. Ruled 2026-09-20.** Whether it should instead
  open on the mode last used is **still Dann's to consider. He raised it and did
  not rule. Do not build the last-used behaviour.**
- **No carets in Syllables. Ruled 2026-09-20.** Corrections is the only mode that
  shows them.
- **The panel below swaps without the loupe moving.** Drawn 2026-09-17, ruled
  again 2026-09-20 as option B: **anchor the music at one vertical, sections grow
  downward, and the accordion scrolls inside itself rather than the card moving.**
- **No Undo while the loupe is closed. Ruled 2026-09-20**, closing N.149's only
  open question.
- **Clause 15, a standing rule:** the perimeter is never smaller than what it
  contains, at any frame.
- **DESK DEFAULT of 2026-09-20, NOT Dann's ruling, free for him to wave off:**
  Reading is retired, leaving two modes. Clause 14 of 2026-09-18 had three states
  with Reading opening; the 2026-09-20 rulings refine it (`OPEN.md:1380`).

## 5. Constraints

**CORRECTION BY THE DESK, 2026-09-20. THE "18 MEASURES" FIGURE IS NOT T05's.**
The 18 belongs to the fixture the 27 collisions were counted on, and
`docs/memory/STATE.md` records that **which document that is remains NOT
ESTABLISHED.** T05 carries measure numbers to at least 88 (measured by Code
2026-09-20). **Do not scope any check to 18 measures.** Check every measure.

**THE ANCHORING IS ALREADY RULED, AND TODAY'S CARD BREAKS IT.** Measured by Code
2026-09-20 at 390 x 844 on m. 9: opening Syllables adds 44 px and the card's
bottom stays at 356, so **the card grows UPWARD and the music's top moves 165.4
to 121.4.** Dann's ruling 6 of 2026-09-20, option B, ruled twice: *"the music
sits at one vertical, every time; sections grow downward; when the contents
exceed the room the accordion scrolls inside itself rather than the card
moving."*

**SO, AND IT IS HIS RULING APPLIED RATHER THAN A NEW DECISION:**

- **The music's top is the anchor and does not move between modes.**
- **The panel region grows DOWNWARD from under the music.**
- **The panel region's height is DERIVED, never chosen:** the room between the
  music's bottom and the bottom of the available viewport. **Report the number
  you derive; do not take one from this brief.**
- **Corrections scrolls INSIDE the panel region** when its content exceeds that
  room. Measured: `CorrectionSurface` dock variant is 487 px of content against
  a 241.6 px card, 730 px of an 844 px viewport, so it is close and it will
  sometimes exceed.
- **Clause 15 still holds at every frame:** the perimeter is never smaller than
  what it contains.


- **The tween is NOT in this brief.** Build the two modes and the switch between
  them as an instant swap. The FLIP tween is deliberately unnumbered on Dann's
  ruling and lands separately.
- **Do not build the spacing change.** Corrections' more generous spacing is
  N.153 stages 2 and 3. **This item builds the GATE, not the engraving.**
- **Do not build the last-used-mode memory.** Not ruled.
- Do not change `VocalLineEvent`, and do not rebuild anything in
  `apps/web/src/lib/shane/reconciliation/`.
- No `aria-controls` on the pill members (`DeskHead.svelte:100-107`).
- **THE MODE MUST KEEP `Loupe.svelte:647`'s DEPENDENCY. Established by Code
  2026-09-20.** `void syllablesOpen` at `:647` re-frames the loupe when the panel
  opens or closes. **`syllablesOpen` has two jobs besides the caret gate:** that
  re-frame, and the accordion's own open state. If the mode takes over the caret
  gate without also being read at `:647`, **the frame goes stale on a swap.**
- **DO NOT TOUCH THE BROWSER LIBRARY. Ruled by the desk 2026-09-20, standing.**
  Measure in a fresh, empty browser context. Never answer *Replace this song* on
  Dann's own library to get a measurement. Precedent: walk 5 of N.146 ran in
  Incognito.
- No new strings and no new French. **« Corrections » is the existing band's
  word; if the pill needs a key that does not exist, STOP and report it rather
  than coining one.**
- **No agent commits and no agent stages.** Read-only git only.

## 6. Done when

`WRITTEN` on all of these:

- The loupe's bar carries a two-segment pill on the left, Syllables and
  Corrections, the chosen one filled, with Undo, Redo and the chevron flush
  right.
- **The loupe opens on Syllables.**
- **In Syllables, no caret is drawn on ANY measure of T05**, whether the
  accordion is open or closed.
- **In Corrections, the carets draw as they do today**, and the correction cells
  are in the loupe.
- **The panel swaps without the loupe's music moving.** Measure the music's
  vertical position in both modes on the same measure: it is the same number.
- The Score Markup header's Undo and Redo retire in this same ship, never before.
- `tsc` clean, existing tests at baseline, and the page and print output
  unchanged.

`DONE` is Dann's walk. **Do not report this item as done.**

## 7. Report back

The commit, the results against every line of section 6, the three measurements
of section 3, and **what could not be established.**

**NOT ESTABLISHED beats a complete invented answer.**
