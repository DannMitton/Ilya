# MEMO FROM CODE. N.77 ship 6: nine decks, and the band title scales

Worked on 2026-08-22 against the tree at `9f11490` plus ships 1 to 5. Two parts,
kept separate. Every number here was read off a render, not off the source.

**How the measurements were taken.** The dev server at `localhost:5183` for
Part A, and the production build served as static files at `localhost:5199` for
Part B's bundle check. Chromium viewports at 320, 360, 393, 420, 640, 768, 900,
955, 980, 1100, and 1400 px. A band title's painted extent is the maximum
`right` over `Range.getClientRects()` on the heading's text node, which reports
the real line boxes including any that overflow the block. A single word's width
is the same range narrowed to that word.

---

# PART A. The band title scales with the sheet

## What changed

`apps/web/src/lib/components/Paper/ReadingPaper.svelte:199`. One declaration in
the four-class band-title rule that starts at
`apps/web/src/lib/components/Paper/ReadingPaper.svelte:161`:

```
font-size: 40px;                                    →
font-size: clamp(26px, calc(2.5vw + 17px), 40px);
```

`apps/web/src/lib/components/Paper/ReadingPaper.svelte:167-198` is the comment
that derives the three terms. No breakpoint was added, and nothing else in the
rule moved.

## How the three terms were picked

The band's measure at phone widths is the viewport less the desk gutter and the
band's own padding. `.main-content` pads 24 px a side, `--sheet-pad-x` is 1rem
under 768 px, and `.chapter-band` pads 30 px a side, so the measure is
`vw - 108`. Measured: 252 px at 360 px, 285 px at 393 px.

The widest unbreakable word across all twenty-four bands is `Acknowledgments`,
and at 40 px it measures **311.83 px**. The next widest are `remerciements` at
255.05 px, `Collaborateurs` at 248.34 px, and `palatalisation` at 229.99 px, so
`Acknowledgments` leads by 22% and every other band is safe whenever it is.

Type scales linearly, which I checked rather than assumed: `Acknowledgments`
renders 202.69 px at 26 px, and `311.83 × 26 / 40` is 202.69. So the largest
safe size at any width is `40 × (vw - 108) / 311.83`. That is 32.33 px at
360 px and 36.56 px at 393 px.

- **The fluid term, `calc(2.5vw + 17px)`**, stays under that ceiling rather than
  following it. At 360 px it returns 26.0 px against a 32.33 px ceiling, which
  is 19% of headroom. The headroom is for a fallback face: every number here was
  measured with Source Sans 3 loaded, and a substitute has different metrics.
- **The floor, 26 px**, is what `2.5vw + 17px` returns at exactly 360 px. Below
  that width the title stops shrinking. 26 px stays inside the measure down to a
  311 px viewport, and at 320 px it leaves 9.31 px of slack, measured.
- **The ceiling, 40 px**, is Dann's ratified size. `2.5vw + 17px` passes 40 px at
  920 px of viewport, so every width from 920 px up renders exactly 40 px.

## Done conditions

### 1. 40.0 px at 1400 px, both rooms, both languages

`getComputedStyle(...).fontSize` on the band heading, at a 1400 px viewport:

| room | language | rendered |
|---|---|---|
| Guide | en | **40 px** |
| Guide | fr | **40 px** |
| Learn | en | **40 px** |
| Learn | fr | **40 px** |

The sheet is 816 px at that width, so the desk is the desk. The value is exact
because the clamp's upper bound is doing the work, not because the fluid term
lands there.

### 2. 360 px, English, Guide's `Acknowledgments`

Rendered size 26 px.

- Band's right edge: **336.00 px**. That is also the sheet's right edge, because
  the band bleeds to it.
- The word's right edge: **256.69 px**.
- Inside the sheet by **79.31 px**, and inside the band's 30 px padding box by
  **49.31 px**.

Before the change, measured on the same page: the word's right edge was
**365.83 px**, which is 29.83 px past the sheet and 5.83 px off a 360 px screen.
That reproduces ship 3's 29.8 and 5.8 exactly.

### 3. 393 px, English, Guide's `Acknowledgments`

Rendered size 26.825 px, which is `2.5 × 3.93 + 17`. The sheet is 345 px.

- Band's right edge: **369.00 px**.
- The word's right edge: **263.12 px**.
- Inside the sheet by **105.88 px**, inside the padding box by **75.88 px**.

### 4. All twelve bands, both languages, all three widths

Twelve chapters, two languages, three widths, so seventy-two measurements. The
number reported is the gap between the title's painted right edge and the band's
30 px padding box. Negative means inside. **Nothing paints past the sheet at any
of the three widths.**

| anchor | en 360 | en 393 | en 1400 | fr 360 | fr 393 | fr 1400 |
|---|---|---|---|---|---|---|
| `learn-unit-1` | -130.36 | -159.50 | -568.86 | -140.49 | -169.95 | -584.45 |
| `learn-unit-2` | -185.63 | -216.53 | -653.90 | -73.56 | -100.90 | -481.48 |
| `learn-unit-3` | -76.59 | -104.02 | -486.13 | -121.60 | -18.76 | -359.00 |
| `learn-unit-4` | -69.38 | -96.59 | -475.05 | **-4.05** | -29.18 | -374.53 |
| `learn-unit-5` | -76.42 | -103.85 | -485.88 | -93.90 | -121.88 | -512.77 |
| `learn-unit-6` | -102.88 | -131.15 | -526.59 | -71.62 | -98.90 | -478.49 |
| `learn-unit-7` | -70.35 | -97.59 | -276.38 | -90.41 | **-2.69** | -335.04 |
| `learn-coda` | -25.57 | **-5.65** | -233.63 | -78.10 | -105.59 | -488.47 |
| `guide-how` | -114.76 | -142.45 | -498.70 | -19.98 | **-0.19** | -331.30 |
| `guide-walkthrough` | -121.86 | -149.77 | -509.63 | -65.63 | -92.71 | -469.27 |
| `guide-contributors` | -142.34 | -170.91 | -541.13 | -90.58 | -118.45 | -507.66 |
| `guide-licences` | -49.31 | -75.88 | -222.05 | -86.22 | -113.95 | -309.69 |

The four tightest are bolded. **`guide-how` in French at 393 px clears by
0.19 px**, and that is a wrapping boundary rather than a near miss:
`Comment fonctionne Ilya` just fits on one line there, and at 360 px it takes
two lines and clears by 19.98 px. Either way it is inside. The same reading
applies to `learn-unit-4` in French at 360 px and `learn-unit-7` in French at
393 px.

### 5. Ship 2's landing positions

**Unchanged, and I changed nothing.**

The computed `scroll-margin-top` values are static `calc()` expressions that do
not reference `font-size`, so a smaller title cannot move them. Read off the
render at 1400 px: **116.5 px** on all eight Learn band headings, **102 px** on
all four Guide band headings, and **170.1 px** on the Learn band decks. Those are
ship 2's terms, unmoved.

A landing was then driven rather than computed. Clicking through to
`learn-unit-7` at 1400 px puts the band's top at **105.84 px** and the heading's
top at **164.34 px**, a difference of 58.5 px, which is ship 2's
`34 + 14.5 + 10`. The band clears the sticky chrome, whose bottom is at 90.78 px.

**One position does move, and it moves in the safe direction.**
`learn-u3-inventory` is the only anchor that lands on a deck, and ship 2's rule
for it hard-codes 41.6 px as the title's line box, which is `40 × 1.04`. A
shorter title means a shorter line box, so the band's top sits lower than that
arithmetic predicts. Measured at 360 px in English, with a control that forces
the title back to 40 px on the same page:

| | title line box | deck's top | band's top |
|---|---|---|---|
| forced back to 40 px | 83.19 px | 217.90 px | 64.21 px |
| this ship | 54.08 px | 218.09 px | 93.51 px |

**The deck lands in the same place**, which is what the anchor promises. What
changes is that 29.3 px more of the band is on screen. Ship 2's comment warned
that a wrapping title would clip the band's top, and shrinking the title is the
opposite pressure. **I changed nothing here, as instructed.**

## What Part A does not fix, and it is worth a ruling

**Between 768 px and about 956 px of viewport, with the drawer open, the band
title still paints off the screen.** This is not new and this ship improves it,
but it does not clear it, and the brief's reason for choosing this remedy was to
protect widths nobody had measured. So it is measured now.

At 768 px the drawer takes **520 px**, `.main-content` gets 248 px, and the sheet
is **192 px** wide. The band's measure is **132 px**. `Acknowledgments` renders
at 36.2 px, is 282.2 px wide, and its right edge sits **96.2 px off the right of
the screen**. With the title forced back to 40 px on the same page it is
125.83 px off. So the ship recovers 29.6 px of a 125.8 px problem.

| viewport | sheet | band measure | title size | word width | off the padding box |
|---|---|---|---|---|---|
| 768 px | 192 px | 132 px | 36.2 px | 282.20 px | +150.20 px |
| 900 px | 316 px | 256 px | 39.5 px | 307.93 px | +51.93 px |
| 955 px | 371 px | 311 px | 40 px | 311.83 px | +0.83 px |
| 980 px | 396 px | 336 px | 40 px | 311.83 px | -24.17 px |
| 1100 px | 516 px | 456 px | 40 px | 311.83 px | -144.17 px |

**The cause is that `vw` measures the window and the drawer takes 520 px of it.**
Below 768 px the drawer is not in the flow, so the viewport is a fair proxy for
the sheet, and the clamp works. Above 768 px it stops being one. Every band is
affected in this range, not only `guide-licences`, because a 192 px sheet is too
narrow for any of the twelve titles at any size the clamp will produce.

Two remedies, both small, neither taken because neither was ruled:

1. A container query. `container-type: inline-size` on `.chapter-band` and a
   `cqi` term instead of the `vw` term makes the title track the band's real
   measure whatever the drawer is doing. It is the correct instrument. It is
   also a second layout mode on the band, and this brief asked for one fluid
   declaration.
2. Leave it, on the grounds that a 192 px reading sheet is already unusable at
   768 px and the band is not the thing to fix first.

**This is Dann's to rule.** Ship 6 does what the brief asked at the three widths
the brief named.

---

# PART B. Nine decks

## What changed

Eighteen lines added, nine per language, each one a `.band-deck` `<div>`
immediately after its heading. No line was edited or removed.

| anchor | French | English |
|---|---|---|
| `learn-unit-1` | `LearnContent.svelte:44` | `LearnContent.svelte:2095` |
| `learn-unit-5` | `LearnContent.svelte:998` | `LearnContent.svelte:3049` |
| `learn-unit-6` | `LearnContent.svelte:1199` | `LearnContent.svelte:3248` |
| `learn-unit-7` | `LearnContent.svelte:1797` | `LearnContent.svelte:3802` |
| `learn-coda` | `LearnContent.svelte:2037` | `LearnContent.svelte:4042` |
| `guide-how` | `GuideContent.svelte:20` | `GuideContent.svelte:294` |
| `guide-walkthrough` | `GuideContent.svelte:82` | `GuideContent.svelte:357` |
| `guide-contributors` | `GuideContent.svelte:194` | `GuideContent.svelte:469` |
| `guide-licences` | `GuideContent.svelte:271` | `GuideContent.svelte:546` |

Both files are `apps/web/src/lib/components/Reading/`.

**The strings were checked against the brief by machine, not by eye.** A script
parsed the brief's own table out of
`docs/sessions/brief-n77-ship6-decks-and-scaling_r1_2026-08-21.md` and compared
each cell to the string in the tree. **All eighteen are identical, character for
character.**

## Done conditions

### 1. Twenty-four decks

Counted in the DOM of the production build, not the source, across four
combinations of room and language:

| room | language | bands | bands carrying a deck |
|---|---|---|---|
| Learn | en | 8 | **8** |
| Learn | fr | 8 | **8** |
| Guide | en | 4 | **4** |
| Guide | fr | 4 | **4** |

**Twenty-four of twenty-four.** `grep -c 'class="band-deck"'` over
`apps/web/build` also returns 24.

### 2. The hard space before `learn-unit-6`'s French colon

Verified twice in the built bundle, once as it is stored and once as it renders.

**In the bundle.** `apps/web/build/_app/immutable/chunks/TrwQczHy.js` carries the
string `Deux gestes simultanés&#160;: la consonne, ...`, with the entity intact.

**In the DOM of the built page**, served from `apps/web/build` at
`localhost:5199`. The three code points around the colon in the deck's
`textContent`:

| character | code point |
|---|---|
| `s` | U+0073 |
| (space) | **U+00A0** |
| `:` | U+003A |

**The hard space is there.**

**One correction to the brief.** It says `LearnContent.svelte` uses the
`&#160;:` spelling in 62 places. The file carried **150** before this ship and
carries **151** after. The spelling is exactly as the brief describes it, and
only the count is off.

### 3. No question marks, and ship 5's invariant holds

**No question mark appears in any of the eighteen new strings.** Checked in the
source and again in the rendered DOM of the built page, deck by deck.

**Ship 5's invariant holds.** Neither reading file contains any space of any kind
before a `?`. The sweep covered the literal characters U+0020, U+00A0, U+202F,
and U+2009, and the entity spellings `&#160;`, `&#8239;`, `&nbsp;`, `&#xa0;`, and
`&#x202f;`. No match in either file.

### 4. Chapters 2, 3, and 4 are unchanged

Their six decks, three per language, appear **once each** across both files. The
nine new strings also appear **once each**. Nothing is doubled and nothing was
lifted out of a body.

The eight `band-kicker` values are untouched, two of each from `Section 1` to
`Section 8`, so ship 5's `SECTION 8` still reads `SECTION 8`. All twenty
`<h2 id>` and `<h3 id>` values are unchanged, two of each. `Drawer.svelte` was
not opened. Both files still end in a single newline and neither contains a
carriage return.

### 5. All five gates at baseline

| gate | baseline | observed |
|---|---|---|
| phonology | 216 | `216 passed (216)` |
| dictionary | 235 | `235 passed (235)` |
| web-check | 0 errors, 7 warnings, 4 files | `found 0 errors and 7 warnings in 4 files` |
| web-test | 682 | `682 passed (682)` |
| score-parser | 444 passed, 5 skipped | `444 passed \| 5 skipped (449)` |

The baseline was re-run on this tree before any edit, and all five numbers
matched the ones in ship 5's memo.

## One thing the brief did not ask about

**The new decks set longer than the three that set the register.** At the desk,
inside `.band-deck`'s 330 px column, Learn's decks run two lines each in English
except `learn-unit-3` and `learn-unit-4`, which run one. In French,
**`learn-unit-7` runs three lines**, and its band is 207.3 px tall against
185.6 px for a two-line band and 163.8 px for a one-line band.

Nothing overflows and nothing is clipped. It is a 21.7 px difference in one band
out of twenty-four, and I am reporting it rather than acting on it.

---

# What I could not establish

* **The printed size of the band title. NOT ESTABLISHED.** The reading sheet is
  printable, and `@media print` at
  `apps/web/src/routes/+page.svelte:2959` lays `.main-content` out as a block for
  it. In paged media a `vw` unit resolves against the page box rather than the
  window, so `2.5vw + 17px` almost certainly returns less than 40 px on paper.
  **I could not measure it.** Emulating print media needs a devtools call this
  session does not have, and I will not put a number in this memo that I derived
  from the spec instead of from a render. If Dann wants the ratified 40 px
  guaranteed on paper, a three-line `@media print` rule pinning `font-size: 40px`
  does it, and I did not add one because this brief did not ask for it.
* **The phone was measured, not held.** 320, 360, and 393 px Chromium viewports,
  not Dann's device. Device pixel ratio was not emulated.
* **Every measurement was taken with Source Sans 3 loaded.** The 19% of headroom
  in the clamp is my allowance for a fallback face. **I did not measure a single
  band with the webfont blocked**, so I do not know the real margin under a
  fallback. NOT ESTABLISHED.
* **The drawer-collapsed layout was not measured.** I tried to set
  `ilya:drawerCollapsed` and reload, and the drawer stayed at 520 px, so the
  key alone does not restore that state. Every number in the 768 px to 956 px
  table is the drawer-open case, which is the default. **A collapsed drawer gives
  a wider sheet and may clear the problem entirely at those widths.** NOT
  ESTABLISHED either way.
* **`.reading-inner` measures 0 px wide at a 768 px viewport** while
  `.reading-paper` measures 192 px, and paragraph rectangles come back empty
  there. Something else is wrong with the reading layout in that range. I noticed
  it while measuring the band and **I did not investigate it**, because it is
  outside this brief. NOT ESTABLISHED what causes it.
* **I did not verify the 40 px ruling itself**, only that it still holds at the
  desk. The mockup, Exhibit 2 of
  `docs/sessions/fable-gui-mockup_r2_2026-08-18.html`, was not reopened.
* **I did not read the nine strings for sense in French.** They were ratified
  verbatim and transcribed verbatim. I checked characters, not meaning.
