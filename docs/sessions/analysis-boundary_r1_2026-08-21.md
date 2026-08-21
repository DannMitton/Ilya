# The last shut boundary that was not its siblings' height

**Serves N.65. Built by Code, 2026-08-21. Floor `7294b42`, branch `Shane`.
`WRITTEN`, not `DONE`: Dann has not walked it on a deploy.**

Read in full this session: `docs/memory/CONTRACT.md`. Two files changed, 60
insertions and 4 deletions.

Dann's ruling, measured on the deploy of `7294b42` at a 430 px viewport: a shut
station is the same height as its siblings, and the ANALYSIS boundary was the
last one that was not. **His four numbers reproduce exactly**, rule to rule, and
so does his diagnosis: the 40 px was `.root-panel`'s bottom padding sitting
between ANALYSIS and the Fit panel, and it was never ANALYSIS's.

---

## 1. What shipped

**`RootPanel.svelte:484`.** `.root-panel` goes from `padding: 0 1rem 40px` to
`padding: 0 1rem`, the declaration now at `:500`. ANALYSIS's own `.section.shut` 6 px is now the whole gap, and
SHIFT LYRICS brings the 2 px rule, which is the recipe every other station
boundary in the column already uses.

**`RootPanel.svelte:521`.** `.root-panel:last-child { padding-bottom: 40px }`.
See §2.

**`+page.svelte:2435`.** `.shane-panel`'s comment is replaced. It recorded that
N.73 S2 dropped this panel's 20 px top padding **because** `.root-panel`'s 40 px
bottom already closed the gap. That reason is gone with the padding, so the
sentence no longer described the tree.

**The zero is now load-bearing rather than incidental.** The gap above
`.shane-panel` is ANALYSIS's 6 px and SHIFT LYRICS's own rule. A top padding
there would land on top of that and make this the one boundary spaced
differently, which is the defect just removed. **The two panels read as one
drawer more strictly than before**, because the seam that separated them is now
the same recipe as every other boundary in the column. Confirmed on the screen,
not only in the numbers: six stations on one rhythm, and the lavender SHIFT
LYRICS rule sits at the same spacing as the sage rules above it.

---

## 2. The check, and it found the case

**Yes, a destination renders `.root-panel` with no Fit panel below it.**

`INCLUDE_SHANE` gates the whole body of the `shanePanel` snippet
(`+page.svelte:2124`), so a build with `PUBLIC_INCLUDE_SHANE` unset renders no
`.shane-panel` at all. `apps/web/.env` sets it to `true`, so the deploy Dann
walked has the wall open, but `.env.example:1-2` documents unset as the
production build. **The case is real, not hypothetical.**

Left alone, removing the 40 px would put ANALYSIS's 6 px directly against the
bottom anchor's lavender rule in that build.

**So the foot moved to whichever panel ends the column** rather than back where
it was. `.shane-panel` carries the same 40 px and ends the column when the wall
is open; `.root-panel:last-child` carries it when the wall is closed.
`:last-child` rather than a class, because the question it asks is exactly "does
anything follow me". No new value enters: 40 px is what this panel already
spent.

**Verified on a real wall-closed build, not by assuming.** `.env` was set to
`PUBLIC_INCLUDE_SHANE=` (original recorded first: `PUBLIC_INCLUDE_SHANE=true`),
the dev server restarted, and the drawer read:

| | wall open | wall closed |
|---|---|---|
| `.shane-panel` in the DOM | yes | **no** |
| `.root-panel` is last element child | no | **yes** |
| `.root-panel` computed `padding-bottom` | **0px** | **40px** |

Only comment and whitespace nodes follow `.root-panel` in the closed build, so
`:last-child` is safe. **`.env` was restored and verified byte-identical.**

---

## 3. Measurements

Rule to rule, in CSS px, every station shut. This is Dann's own definition,
which counts the top anchor's own bottom border as the rule above SOURCE.

**At 430, coarse pointer, 44 px label:**

| station, shut | before | after |
|---|---|---|
| METADATA | 56.0 | **56.0** |
| NOTATION | 58.0 | **58.0** |
| SOURCE | 58.0 | **58.0** |
| REPERTOIRE | 58.0 | **58.0** |
| ANALYSIS | **98.0** | **58.0** |

**At desk width, 1280 viewport, 520 px drawer, fine pointer, 16.8 px label:**

| station, shut | before | after |
|---|---|---|
| METADATA | 28.8 | **28.8** |
| NOTATION | 30.8 | **30.8** |
| SOURCE | 30.8 | **30.8** |
| REPERTOIRE | 30.8 | **30.8** |
| ANALYSIS | **70.8** | **30.8** |

**Open, ANALYSIS gives 6 px above and 12 px below**, read from the computed
style and identical to an open SOURCE measured beside it. Dann's asymmetry
stands untouched.

**METADATA is 56.0 and 28.8 rather than 58.0 and 30.8**, and that is unchanged
by this ship. It is the only station with no rule above it at all, because it
opens the column. SOURCE reads its siblings' number because the top anchor's own
bottom border is the rule above it.

---

## 4. The gates

| gate | baseline | result |
|---|---|---|
| 1 phonology | `216 passed (216)` | **216 passed (216)** |
| 2 dictionary | `235 passed (235)` | **235 passed (235)** |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | **0 errors, 7 warnings, 4 files** |
| 4 web-test | `682 passed (682)` | **682 passed (682)** |
| 5 score-parser | `444 passed \| 5 skipped (449)` | **444 passed, 5 skipped (449)** |

**All five at baseline.** Gate 3 was the one at risk, because
`.root-panel:last-child` tests a sibling that lives outside the component and
could have been flagged as an unused selector. It was not.

---

## 5. Not repaired, and why

This ship shifts `RootPanel.svelte` by 35 lines below `:487` and `+page.svelte`
by 21 lines below `:2439`. Three citations in `docs/memory/STATE.md` point below
those marks: `RootPanel.svelte:875-888` at `STATE.md:84`,
`RootPanel.svelte:628` at `:811`, and `+page.svelte:2718-2733` at `:69`.

**They were left alone deliberately.** All three sit inside dated records:
`:69` and `:84` are inside the quoted list of Dann's 2026-08-21 walk, which is
the list this ship closes, and `:811` is narrative marked "read in the tree
2026-08-20". Rewriting a dated record to match today's tree falsifies the
record. No citation in code shifted; the four in `document.svelte.ts`,
`types.ts`, and `pairings.ts` all point above both edit marks.

---

## 6. NOT ESTABLISHED

**NOT ESTABLISHED BEATS A COMPLETE INVENTED ANSWER.**

1. **Whether the wall-closed drawer looks right with `.root-panel` ending the
   column.** The 40 px foot is confirmed present, and the bottom anchor draws
   its lavender rule with no voice line under it, because
   `Drawer.svelte:603` tests the snippet's truthiness rather than its output.
   **That is pre-existing and not this ship's.** Settled by: someone walking a
   wall-closed build, which nobody has asked for.

---

*Written by Code, 2026-08-21, from Dann's ruling of the `7294b42` walk. Every
anchor asserted at write time by a one-match-or-refuse editor.*
