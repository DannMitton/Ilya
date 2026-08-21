# MEMO: N.77 ship 3, the band's bleed tracks the sheet's padding

Code, 2026-08-21. Answers `docs/sessions/brief-n77-ship3-band-bleed_r1_2026-08-21.md`.
Read and built in the tree at `e52b1c9`, branch `Shane`. The working tree is
dirty with `apps/web/src/lib/components/Paper/ReadingPaper.svelte` and this memo.

One file. No value changed. The desk still pads 96px, the phone still pads 1rem,
print still sets no padding of its own.

---

## What changed

### The property, and the two rules that read it

* `ReadingPaper.svelte:45` declares `--sheet-pad-x: 96px` on `.reading-paper`,
  beside the padding it feeds.
* `ReadingPaper.svelte:46` sets `padding: 3rem var(--sheet-pad-x)`. The vertical
  3rem is untouched.
* `ReadingPaper.svelte:127` sets the band's margin to
  `3.5rem calc(-1 * var(--sheet-pad-x)) 1.25rem calc(-1 * var(--sheet-pad-x))`.
  The vertical 3.5rem and 1.25rem are untouched.
* `ReadingPaper.svelte:445-447`, inside `@media (max-width: 767px)`, redeclares
  `--sheet-pad-x: 1rem` and carries the block's existing 1.5rem on
  `padding-top` and `padding-bottom`. The horizontal padding is no longer stated
  here at all; it follows the property.

No rule anywhere now sets `.reading-paper`'s horizontal padding to a literal,
and no rule sets the band's horizontal margin to a literal. Confirmed by grep:
`-96px` survives in no declaration in the file.

### The count you asked for

**The file holds two media queries. Exactly one of them sets the sheet's
horizontal padding.**

* `ReadingPaper.svelte:434`, `@media (max-width: 767px)`: set
  `padding: 1.5rem 1rem`, and is the one this ship rewrites.
* `ReadingPaper.svelte:473`, `@media print`: sets `box-shadow: none` and
  nothing else. It never set padding, so it needed no property and got none.
  Print therefore inherits the desk's 96px, which is what it already did.

`.reading-paper` appears in no other stylesheet in the tree. `+page.svelte:2880`
mentions it in a comment only.

### The comment that was itself the defect

`ReadingPaper.svelte:113-122` is ship 1's bleed note, and it said
"`.reading-paper` here carries `padding: 3rem 96px`, so the band has to cancel
the horizontal half of that". That sentence was true of the desk and wrong on
the phone, which is exactly the fault it sat beside. It now names the property
and records what the literal used to be.

`ReadingPaper.svelte:37-44` carries the binding note the brief asked for: change
the property, never the horizontal padding, because the band's bleed is the
negative of it.

---

## The six done-conditions, as observed

Method: `pnpm --filter @ilya/web build`, then
`cd apps/web/build && python3 -m http.server 4200`, never `vite preview`.
Headless Chromium under the repository's own Playwright. Every measurement is a
`getBoundingClientRect()` on the built page, taken at the same viewport before
and after the change.

### 1. The control, at 393px

**Before.** The sheet spanned x **24 to 369**. The band spanned x **-56 to
449**, so it overhung the sheet by **80px on each side** and hung **56px off
the left of the screen**. The title `How Ilya Works` began at x **-26**, off
the screen. That is Dann's `ow Ilya Works`, and the numbers say why: 96px of
bleed cancelling 16px of padding.

**After.** The sheet spans x **24 to 369**. The band spans x **24 to 369**.
Sheet-to-band delta **0.0px left and 0.0px right**. The title begins at x
**54**, which is the sheet's left edge plus the band's own `padding-left: 30px`.
Screenshotted: `How Ilya Works` reads whole, inside the sheet.

### 2. The same at 360px

**Before.** Sheet x **24 to 336**. Band x **-56 to 416**. Overhang **80px each
side**, **56px off the left of the screen**, title at x **-26**.

**After.** Sheet x **24 to 336**. Band x **24 to 336**. Delta **0.0 / 0.0**.
Title at x **54**.

### 3. The desk at 1400px did not move

Measured with the identical script before and after.

| | sheet | band | delta L / R |
|---|---|---|---|
| before | 552 to 1368 | 552 to 1368 | 0.0 / 0.0 |
| after | 552 to 1368 | 552 to 1368 | 0.0 / 0.0 |

Computed band margin reads `56px -96px 20px` in both, which is
`3.5rem / 96px / 1.25rem`. Identical on Learn and Guide, in both languages.

### 4. Print is unchanged

Measured at a 1400px viewport under `emulateMedia({ media: 'print' })`, before
and after.

| | sheet | band | delta L / R |
|---|---|---|---|
| before | 292 to 1108 | 292 to 1108 | 0.0 / 0.0 |
| after | 292 to 1108 | 292 to 1108 | 0.0 / 0.0 |

The print block sets no padding, so `--sheet-pad-x` resolves to the desk's 96px
there, which is the value print already used.

### 5. Learn and Guide, both languages, three widths

Twelve combinations, 393px, 360px, and 1400px, each on both tabs in both
languages. **Every band in every combination measures a sheet-to-band delta of
0.0px on both sides**, and no band box falls outside the viewport. Band counts
came out 4 on Guide and 8 on Learn every time, so all 24 were measured.

**One band's text still overruns its box, and it is not the bleed.** At 360px in
English, the Guide's `Licences and Acknowledgments`: the band's content box is
252px and the single word `Acknowledgments` sets 312px at the ruled 40px, so the
word's ink reaches x **365.8** against a sheet right edge of **336** and a
viewport of **360**. It paints **29.8px past the sheet and 5.8px off the right
of the screen**. Screenshotted; the final `s` is cut by the screen edge.

The same title at 393px overflows its box by 27px but stops at x 365.8 against a
sheet edge of 369, so it stays on the sheet and on the screen while sitting hard
against the band's right edge with none of its 30px padding showing. French is
clear at both widths, the worst being `remerciements` at 3px over its box and
27px inside the sheet. Learn is clear at every width in both languages.

**This ship exposed it rather than caused it, and the distinction is worth
stating.** Before, the band was 472px wide at a 360px viewport, so a 312px word
fitted its box easily. It fitted inside a box that was itself hanging off both
edges of the screen. Narrowing the band to the sheet is correct and it leaves a
40px title on a 252px measure, which one long English word does not fit. **The
cure is in the band's type or its wrapping, both of which this brief rules out
of scope.** Reported, not touched.

### 6. All five gates at baseline

| gate | baseline | observed |
|---|---|---|
| phonology | 216 | `216 passed (216)` |
| dictionary | 235 | `235 passed (235)` |
| web-check | 0 errors, 7 warnings, 4 files | `found 0 errors and 7 warnings in 4 files` |
| web-test | 682 | `682 passed (682)` |
| score-parser | 444 passed, 5 skipped | `444 passed | 5 skipped (449)` |

### Ship 2's landings did not move

The brief asked me to say so and change nothing. Re-measured at 1400px after the
binding, against the numbers ship 2's memo recorded: `guide-source` 17px below
the chrome, `guide-walkthrough` band 17px, `guide-how` band 16px, `learn-unit-3`
band 16px, `learn-u3-inventory` deck 128px with its band at 16px. **Every one
identical to ship 2's memo.** Nothing was changed.

---

## What I could not establish

* **The phone was measured, not held.** Every phone number here is a 393px and
  a 360px Chromium viewport, not Dann's actual device. The fault he reported
  reproduces exactly at those widths and the fix measures clean at both, but a
  real phone adds a device pixel ratio, a dynamic viewport, and a browser
  chrome that Chromium's viewport does not. NOT ESTABLISHED on hardware.
* **I did not walk the breakpoint itself.** Measurements are at 393px, 360px,
  and 1400px. The `max-width: 767px` boundary and the widths just either side of
  it were not measured, so a tablet-width sheet is NOT ESTABLISHED.
* **The 5.8px of `Acknowledgments` off a 360px screen is the only clipping I
  found, and I looked only at the band.** Body copy, tables, and figures at
  phone widths were not surveyed. This ship touches nothing below the band, so
  anything there predates it, but I did not check.
* **Print was measured through CSS media emulation at a 1400px viewport, not
  from the print dialogue or a real sheet of paper.** At that viewport the
  `max-width: 767px` query does not match, so print took the desk's 96px. **If a
  print context ever computes a viewport narrower than 767px, the mobile query
  would match and print would take 1rem.** That was true before this ship too,
  because the mobile block already set the padding. Recorded as a coupling
  nobody has tested, not as a change.
* **`--sheet-pad-x` is declared on `.reading-paper` and read by a `:global`
  descendant.** That works because custom properties inherit, and it is the same
  device ship 2 uses for `--sticky-chrome`. A band rendered outside
  `.reading-paper` would get no value and its `calc(-1 * var(--sheet-pad-x))`
  would be invalid. There is no such band today.
* **The desk's 96px is still a literal, and it is still the same number as
  `MARGINS.horizontal` in `$lib/page-config.ts`.** Binding those two is the
  separate question the brief set aside, and I did not touch it.

**I did not run `git`, and nothing is committed or staged.**
