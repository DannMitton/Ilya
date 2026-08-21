# MEMO: the `inferred` row leaves the transcription legend

Code, 2026-08-21. Answers `docs/sessions/brief-inferred-legend-drop_r1_2026-08-21.md`.
Read and built in the tree at `52eda23`, branch `Shane`. The working tree is
dirty with `apps/web/src/lib/provenance.ts`,
`apps/web/src/lib/components/Paper/PageFooter.svelte`, and this memo.

---

## What changed

Two files. Nothing else was opened for writing.

**`apps/web/src/lib/provenance.ts`**

* `provenance.ts:59-64`: `'inferred'` is gone from `LEGEND_ORDER`, which now
  ends at `'user-override'`.
* `provenance.ts:55-58`: the comment that introduces `LEGEND_ORDER` said "then
  inferred last (the warning state)". It now reads "ё-rule first, then the
  user-attributed types". The brief did not list this one. It described a member
  that no longer exists, which is the defect the brief is closing.
* `provenance.ts:95`: `LEGEND_DISPLAY_ORDER` is
  `[...LEGEND_ORDER, SPOT_RECONSTITUTION]`. The `flatMap` is gone.
* `provenance.ts:85-94`: the comment that introduces `LEGEND_DISPLAY_ORDER`
  argued spot reconstitution against `inferred`. It now says spot reconstitution
  prints last because it is not a stress source: it is read from the
  `spotReconstitution` map rather than from any word's `stressSource`.
* `provenance.ts:103-111`: the `'inferred': 'question'` entry is gone from
  `PROVENANCE_ICONS`.
* `provenance.ts:118-124`: the `'inferred': 'legend.inferred'` entry is gone
  from `LEGEND_KEYS`.
* `provenance.ts:16`, `provenance.ts:134`, `provenance.ts:171`: three
  incidental lines of prose that counted or named the removed member:
  the `LegendItem.type` example, "ё first, inferred last", and "the other five".
  Now `'user-override'`, "ё first, spot reconstitution last", and "the other
  four".
* `provenance.ts:78`: "a sixth member of `LEGEND_ORDER`" is now "a fifth
  member". `LEGEND_ORDER` has four entries.

**`apps/web/src/lib/components/Paper/PageFooter.svelte`**

* `PageFooter.svelte:49`: the `{:else if item.type === 'inferred'}` branch and
  its traced question-mark SVG are gone. The chain now runs
  `user-dictionary` → `user-composer` → `user-override` → `yo-restored` →
  `fit-withheld` → `spot-reconstitution`.

Untouched, as ruled: `WordStack.svelte`, `pipeline.ts`, `i18n.ts` (its
`legend.inferred` is now referenced by nothing but its own definition at
`i18n.ts:206`), `showProvenance()`, `lib/shane/fit-legend.ts`, and `textOnly`.

---

## The four done-conditions, as observed

How they were run: `pnpm --filter @ilya/web build`, then
`cd apps/web/build && python3 -m http.server 4200`, never `vite preview`. A
headless Chromium under the repository's own Playwright drove the app, and every
measurement here was taken with `emulateMedia({ media: 'print' })` active, so
the numbers are the print rendering and not the screen one. Source text on the
sheet, two lines:

```
Я помню чудное мгновенье
бракадабрень зюзюкатель
```

The two invented words are absent from the dictionary, so the pipeline gives
each `stressSource = 'inferred'`. The app's own selection log confirmed it on
the page: `[Ilya] Selected: бракадабрень ... {stress: -2, source: inferred}`.

### 1. A page with a `verify` word prints no question-mark row and no `Verify stress` row

Observed: two word stacks carried `.is-inferred`, and two `.verify-label`
elements printed, reading `verify`. The footer held zero `<svg>` with the
question mark's viewBox `208 315 493 751`, and zero `.legend-item` of any kind,
because there was no `.provenance-legend` element to hold one. No row reading
`Verify stress` printed.

### 2. A page with a `verify` word and a `user-dictionary` word still prints the `user-dictionary` row, unchanged and in place

Method: on the same two lines, `бракадабрень` was given syllable 2 in the
inspector and attributed to **Dictionary**, leaving `зюзюкатель` inferred.

Observed: one `.is-inferred` stack and one `verify` label remained.
`бракадабрень` gained the book sigil on the word. The footer legend printed one
row and one only:

* label `Verified in dictionary`
* the icon circle present
* the book SVG, viewBox `0 0 16 16`
* no question-mark SVG anywhere in the footer

Position, in print: the legend box measured 101×16 with its right edge at x=720,
which is the right content margin; the sage hairline sat at y=942 and the legend
at y=918, so 8px of clear space between the legend's foot and the rule. That is
`.provenance-legend`'s own `bottom: 100%; margin-bottom: 8px`, unchanged.
Flush right, one line above the rule, as before.

### 3. The control: a page whose only special provenance is `inferred` prints no legend block at all

This is case 1's page, and it is the case the brief called the likeliest
failure.

Observed: `document.querySelector('.provenance-legend')` returned **null**. The
element is not in the DOM, so there is nothing present-but-empty to leave a
hairline, a border, or a reserved band.

The geometry says the same thing. In print, the footer's own bounding box began
at y=942 and the sage hairline sat at y=942, identically in both cases: the
legend is absolutely positioned outside the footer's border box, so its absence
cannot move the rule. A 62px band was then cropped from the print rendering,
spanning 44px above the hairline down to 14px below it, at the full content
width. On this page the band is **blank above the rule**: no glyph, no circle,
no second hairline, no tint. The rule and the attribution follow in their normal
places.

The negative has a positive control, and it is the same crop: the identical band
taken from case 2 shows the circled book and `VERIFIED IN DICTIONARY` sitting in
it. The band is capable of showing a legend row. On the inferred-only page there
is none to show.

### 4. All five gates at baseline

Run in this session, on this machine, against the working tree with both edits
in place. Not the ship script, which runs `git`.

| gate | baseline | observed |
|---|---|---|
| phonology | 216 | `216 passed (216)` |
| dictionary | 235 | `235 passed (235)` |
| web-check | 0 errors, 7 warnings, 4 files | `found 0 errors and 7 warnings in 4 files` |
| web-test | 682 | `682 passed (682)` |
| score-parser | 444 passed, 5 skipped | `444 passed | 5 skipped (449)` |

No baseline moves. No test was added or removed.

---

## What I could not establish

**The `inferred` row appears to have been unreachable before this change too,
and I could not prove the negative by rendering the old code.** The scan in
`buildProvenanceLegend` skips any word with `stressIndex < 0`, and both branches
in `pipeline.ts` that set `stressSource = 'inferred'` set `stress = -2` beside
it. `stressIndex` in `LineData` is `effectiveStressIndex >= 0 ? … : stress`, and
`effectiveStressIndex` is `findIndex(s => s.isStressed)`, which returns -1 when
no syllable is stressed. The live app corroborated one instance: its selection
log printed `{stress: -2, source: inferred}`. So the row the brief describes as
decoding a glyph nowhere on the sheet looks to have been a row that never
printed at all. **I did not rebuild `52eda23` and render it to confirm**, so
this is read from the code and from one console line, not measured against the
old build. NOT ESTABLISHED as a rendered fact.

That does not change the ruling or the edit. The mapping, the icon, and the SVG
were all real and all reachable by anything that fed the builder a word with
`stressSource = 'inferred'` and a non-negative `stressIndex`; removing them
removes the row and its glyph for good. It does mean the change is not expected
to alter any page a singer has printed to date, and none of the three rendered
cases showed a difference I can attribute to it.

**Print was measured with CSS print-media emulation and a headless PDF, not
from the OS print dialogue.** `PageFooter.svelte` carries no `@media print`
block of its own, and the footer's measurements were identical under screen and
print media except for the page's own left offset, so I have no reason to think
the dialogue would differ. I did not open it.

**I did not exercise the French sheet.** `legend.inferred` still carries its
French copy at `i18n.ts:206` and is now unreferenced. Every case here ran in
English.

**I did not run `git`, and nothing is committed or staged.**
