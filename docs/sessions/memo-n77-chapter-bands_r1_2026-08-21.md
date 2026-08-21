# MEMO: N.77 ship 1, chapter-opening bands for Learn and Guide

Code, 2026-08-21. Answers `docs/sessions/brief-n77-chapter-bands_r1_2026-08-21.md`.
Read and built in the tree at `46ab5e2`, branch `Shane`. The working tree is
dirty with `apps/web/src/lib/components/Paper/ReadingPaper.svelte`,
`apps/web/src/lib/components/Reading/LearnContent.svelte`,
`apps/web/src/lib/components/Reading/GuideContent.svelte`, and this memo.

Twenty-four bands. Nothing was coined in either language: every kicker, title,
and deck is a fragment of a string that already stood in the tree.

---

## What changed

### `apps/web/src/lib/components/Paper/ReadingPaper.svelte`

One block of CSS, `ReadingPaper.svelte:87-167`, placed after the `h4` rule and
before the body-text rules. It serves both Learn and Guide, so the geometry
exists once.

* `ReadingPaper.svelte:111`, `.chapter-band`: `padding: 34px 30px 30px`,
  `color: #fdfbf6`, and `margin: 3.5rem -96px 1.25rem -96px`.
* `ReadingPaper.svelte:117` and `:121`: `.band-learn` takes
  `var(--dusty-rose)`, `.band-guide` takes `var(--quiet-cobalt)`, both from
  `app.css:38` and `app.css:42` as the brief ruled.
* `ReadingPaper.svelte:125`, `.band-kicker`: sans, `10px`,
  `letter-spacing: 0.28em`, uppercase.
* `ReadingPaper.svelte:146-159`, the band title, on four selectors. The defect
  note in this section says why there are four and not one.
* `ReadingPaper.svelte:161`, `.band-deck`: serif italic, `15px`,
  `margin-top: 12px`, `max-width: 330px`.

The mockup's `opacity` on the kicker and the deck is dropped, as ruled. Both
render at `opacity: 1`.

### `apps/web/src/lib/components/Reading/LearnContent.svelte`

Sixteen bands, French then English, at `:41`, `:679`, `:765`, `:892`, `:994`,
`:1194`, `:1792`, `:2031`, `:2088`, `:2726`, `:2812`, `:2939`, `:3041`,
`:3239`, `:3792`, and `:4031`. Each wraps its own heading:

```
<div class="chapter-band band-learn">
	<div class="band-kicker">Section 3</div>
	<h3 id="learn-unit-3">Stressed Vowels</h3>
	<div class="band-deck" id="learn-u3-inventory">Stressed vowels are the targets.</div>
</div>
```

Six decks, at `:682`, `:768`, `:895`, `:2729`, `:2815`, and `:2942`. Each is the
chapter's own opening `<strong>` thesis line, lifted from the body, and the body
copy is deleted so the sentence appears once. The `<strong>` wrapper is dropped
because the deck's own rule already carries serif italic; the words are
unchanged.

### `apps/web/src/lib/components/Reading/GuideContent.svelte`

Eight bands, at `:18`, `:79`, `:190`, `:266`, `:288`, `:350`, `:461`, and
`:537`. Each carries the heading alone. No kicker and no deck, as ruled: the
Guide's headings carry no `·` fragment and its chapters open with no thesis
line, and Dann writes those strings later.

### A defect this shipped into and then out of

`+page.svelte:3051-3061` paints every reading heading in its tab's hue:
`.main-content.tab-learn :global(.reading-inner h3)`, three classes and one
type. The first build styled the band title at two classes and one type, so
that rule won, and every Learn title rendered dusty rose on a dusty-rose band
while every Guide title rendered cobalt on cobalt. The title was present,
40px, correctly spaced, and completely invisible. It was caught by looking at
the built page and by nothing else: the DOM survey read the band's colour and
reported the title as present and correct.

The fix is `ReadingPaper.svelte:146-149`, four selectors carrying four classes
and one type by adding `.reading-paper` and the band's own colour class. That
wins outright rather than on source order, so it cannot be undone by a later
component's stylesheet. `+page.svelte` was not touched.

---

## The six done-conditions, as observed

Method: `pnpm --filter @ilya/web build`, then
`cd apps/web/build && python3 -m http.server 4200`, never `vite preview`.
Headless Chromium under the repository's own Playwright, 1600×1000, both
languages, both tabs. Every number is read from the built page's computed
styles and bounding boxes.

### 1. Twenty-four bands

Observed: `document.querySelectorAll('.reading-inner .chapter-band')` returned
8 on Learn and 4 on Guide, in each of the two languages. Twenty-four.

The Learn ids in render order: `learn-unit-1` through `learn-unit-7`, then
`learn-coda`. The Guide ids: `guide-how`, `guide-walkthrough`,
`guide-contributors`, `guide-licences`. Every band's heading kept the tag it
had. Seven Learn chapters are `h3`, the coda is `h2`, all four Guide chapters
are `h2`.

Every band measured 816px wide with its left edge at the same x as
`.reading-paper`'s, so the bleed lands exactly on the sheet edges. Padding
computed as `34px 30px 30px`.

### 2. Learn carries kicker, title, and deck; Guide carries the title only

Observed, Learn, English: kickers `Section 1` through `Section 7`, then `8`.
Titles `The Letters`, `Stress`, `Stressed Vowels`, `Vowel Reduction`,
`The Consonants`, `Palatalization`, `Assimilation and Boundaries`,
`What These Rules Do Not Teach`. French: `Les lettres`, `L'accent tonique`,
`Les voyelles accentuées`, `La réduction vocalique`, `Les consonnes`,
`La palatalisation`, `Assimilation et frontières`, `Les inclassables`.

Decks rendered on chapters 2, 3, and 4 only, in both languages. Chapters 1, 5,
6, 7, and the coda have none. Section 4 of this memo says why for each.

Observed, Guide: all four bands returned `kicker: null` and `deck: (none)`, in
both languages. Titles `How Ilya Works`, `A Walkthrough`, `Contributors`,
`Licences and Acknowledgments`, and `Comment fonctionne Ilya`,
`Une visite guidée`, `Collaborateurs`, `Licences et remerciements`.

Computed type, on every band: title `Source Sans 3` 700 at `40px/41.6px`,
`letter-spacing: -0.4px`, `border-top-width: 0px`. Kicker `Source Sans 3` at
`10px`, `letter-spacing: 2.8px`, `text-transform: uppercase`. Deck
`Source Serif 4` italic at `15px`, `margin-top: 12px`, `max-width: 330px`.
`40px × -0.01em` is `-0.4px` and `10px × 0.28em` is `2.8px`, so the ratified
values landed.

### 3. The thesis sentence appears once

Observed: a query for `.reading-inner > p > strong` matching any of the six
thesis sentences returned an empty list on both tabs in both languages. Each
sentence is in its band and nowhere else. `grep -c` on the source agrees: one
occurrence each.

### 4. The control: every table-of-contents entry

Clicked every entry in both tables of contents, in both languages, with every
collapsible section expanded first. That is 58 Learn entries and 27 Guide
entries per language, 170 clicks. Named in full, they are `learn-title`,
`learn-about`, `learn-arc`, the eight chapter entries, the 44 `learn-uN-*`
subsections, `learn-try`, `learn-notation`, and on the Guide `guide-how`,
`guide-what`, `guide-paste`, `guide-source`, `guide-ai`, `guide-role`,
`guide-limits`, `guide-future`, `guide-fit-forecast`,
`guide-fit-characteristics`, `guide-fit-notation`, `guide-walkthrough`, the
seven `guide-walk-*` steps, `guide-contributors`, `guide-grayson`,
`guide-grayson-intro`, `guide-mitton`, `guide-mitton-note`, `guide-claude`,
`guide-kimi`, and `guide-licences`.

**Scrolling: 170 of 170.** Every entry found its element and brought it to the
top of the reading area. The only two that stopped short are `learn-try` at
47px and `learn-notation` at 330px, which are the last two headings in the
document and have no scroll room left below them. The pre-band control puts
them at 48px and 331px, so the bands did not move them.

**Highlighting: 11 misses out of 85 in English.** They are not what they look
like, and a control settles it.

I built the page WITHOUT the bands by reversing the transform, served it on the
same port, and ran the identical walk. Ten of the eleven misses reproduce
exactly on the pre-band page: `learn-unit-1`, `learn-u2-sounds`,
`learn-u3-try`, `learn-try`, `learn-notation`, `guide-ai`, `guide-limits`,
`guide-fit-forecast`, `guide-walkthrough`, and `guide-walk-print`. Four of
those ten are on headings that never receive a band at all. The behaviour is
`+page.svelte:1737`'s IntersectionObserver, whose
`rootMargin: '-25% 0px -60% 0px'` hands the highlight to a heading further down
once the scroll settles. Probed directly: clicking `learn-arc` scrolls it to
`top: 0` and the highlight lands on `learn-unit-1`; clicking `learn-unit-1`
scrolls it to `top: 0` and the highlight lands on `learn-u1-song`.

**The bands add exactly one new miss: `learn-arc`.** Stable across three runs
with the bands and absent from the control run. `learn-arc` is an `h2` with no
band, sitting directly above `learn-unit-1`'s band. Adding 164px of band below
it puts the next heading inside the observer's preferred zone at that scroll
position. It scrolls correctly and sets `#learn-arc`; only the highlight moves
one row down. Reported rather than fixed, because the observer's rootMargin is
not in this brief.

The files were restored from a checksum-verified snapshot after the control
build, and all five gates were re-run on the restored tree.

### 5. Nothing outside the band changed

Observed on the built page, in the first body element after every one of the 24
bands: `Source Serif 4` at `16.8px/29.4px` for `p` and `21.6px/29.16px` for the
Guide's `h4`, at a measured width of `624px`. That is the reading measure and
the body type as they already were. `.reading-paper` still measures 816px and
`.reading-inner` still measures 624px on both tabs.

The band's vertical margins are `h3`'s own `3.5rem` and `1.25rem`, so the gap
above a chapter and the gap below its title are unchanged.

### 6. All five gates at baseline

Run on the restored tree, after the control build and the specificity fix.

| gate | baseline | observed |
|---|---|---|
| phonology | 216 | `216 passed (216)` |
| dictionary | 235 | `235 passed (235)` |
| web-check | 0 errors, 7 warnings, 4 files | `found 0 errors and 7 warnings in 4 files` |
| web-test | 682 | `682 passed (682)` |
| score-parser | 444 passed, 5 skipped | `444 passed | 5 skipped (449)` |

### The measured contrast

Sampled from the built page's computed `background-color` and the heading's
computed `color`, and cross-checked against the WCAG relative-luminance formula
run over the tokens.

| band | background | text | ratio | 40px title, 3:1 | 10px kicker, 4.5:1 |
|---|---|---|---|---|---|
| Learn, `--dusty-rose` | `#a67b7b` | `#fdfbf6` | **3.54:1** | PASS | **FAIL** |
| Guide, `--quiet-cobalt` | `#5c739e` | `#fdfbf6` | **4.61:1** | PASS | no kicker |

Both numbers match the brief's to two decimal places. The rose was not
darkened, no band-only rose was invented, and the kicker is drawn at full
opacity, so 3.54:1 is what a singer sees. **This is Dann's to rule.** The Guide
has no kicker to fail, so its 4.61:1 has no exposure at the smaller size today.

---

## What I could not establish, and every empty slot

### Chapters that departed from the brief's pattern

The brief verified the opening thesis line on chapter 3 and asked for all eight.
**Only three of the eight have one**, and it is three in each language, not a
language difference.

| chapter | what follows the heading | deck |
|---|---|---|
| 1 | a plain `<p>` of running prose | none |
| 2 | `<p><strong>…</strong></p>` | lifted |
| 3 | `<p id="learn-u3-inventory"><strong>…</strong></p>` | lifted |
| 4 | `<p><strong>…</strong></p>` | lifted |
| 5 | a plain `<p>` of running prose | none |
| 6 | `<h4 id="learn-u6-what">` | none |
| 7 | `<h4 id="learn-u7-two">` | none |
| coda | `<p><em>…</em></p>` | none, see the note |

**The coda's opening line is a near miss and I left it alone.** It is
`<p><em>Did we cover everything? Can we? Who fills the gap(s)?</em></p>` and its
French counterpart. It is italic and it is one line, so it is deck-shaped, but
it is `<em>` and not `<strong>`, and it is a rhetorical question rather than a
thesis. Promoting it is a content decision, so it is Dann's. Say the word and it
is one line.

**The coda's kicker is a bare `8`, and it reads thin.** The brief asked me to
report rather than pad, so: the other seven kickers read `SECTION 1` through
`SECTION 7`, and the coda's reads `8` alone, a single character at 10px in the
corner of a 130px band. The heading numbers itself differently from its seven
siblings in the source, and the split is faithful to it. It is legible. It does
not match. No word exists in the tree to pad it with, so nothing was invented.

### Structural notes

* `learn-unit-7` stood at column 0 in both languages while every other chapter
  heading sat at six tabs. That was source indentation only, not a different
  structure; the file is one flat run of siblings with no per-chapter
  container. Its band is written at six tabs like the rest.
* `guide-walkthrough` sits one tab deeper than its three siblings, in both
  languages. Also indentation only. Its band keeps that deeper indent.

### The id I had to move, and it was not in the brief

`learn-u3-inventory` is a **table-of-contents target**, not just a paragraph id.
`Drawer.svelte:190` maps it to `learn-unit-3` and `Drawer.svelte:407` renders a
clickable subsection whose visible label is the thesis sentence itself. Lifting
that sentence into the band and deleting the body copy would have left that
entry pointing at nothing.

So the id travelled with its own sentence: the deck at
`LearnContent.svelte:768` and `:2815` carries `id="learn-u3-inventory"`. The
brief's constraint was that a chapter heading must keep its element and its id,
and every chapter heading did. This is a different id on a different element,
and it now sits on a `div` rather than a `p`. `scrollToAnchor` uses
`getElementById` and the observer collects `[id^="learn-"]`, so neither cares
about the tag. Walked and confirmed: the entry scrolls and highlights, and the
walk log records it as `DIV ... [in band]`.

### Slots left empty, all of them

* **Every Guide kicker.** Four chapters, both languages, eight slots. No source
  exists.
* **Every Guide deck.** Eight slots. No source exists.
* **Five Learn decks per language**, ten slots: chapters 1, 5, 6, 7, and the
  coda.
* **The meta line**, everywhere. Left out entirely as ruled. Reading time
  exists nowhere in the tree, and I re-grepped to confirm it.
* **The `room-next` row**, everywhere. Not in ruling 6.

### What I did not establish

* **The band's horizontal extent was not ruled, and I read it off the drawing.**
  The brief gave padding, type, and colour but not the width. In the mockup the
  sheet carries no padding of its own and `.room-band` is its first child at
  full width, so the band meets the sheet edge. `.reading-paper` carries
  `padding: 3rem 96px`, so I cancelled the horizontal half with
  `margin: 0 -96px` to land in the same place. **If Dann wanted the band inset
  to the 624px reading column instead, that is one line.** NOT ESTABLISHED which
  he wants.
* **The kicker's and the deck's `line-height` is `1.45`, taken from the
  mockup's `body` rule** at `fable-gui-mockup_r2_2026-08-18.html:21`, which both
  of them inherit there. The `.room-band` rules do not state it. This is a
  reading of the drawing, not a ruled value.
* **The vertical gap above the coda's band changed slightly.** Every band uses
  `h3`'s `3.5rem` top and `1.25rem` bottom. The coda is an `h2` and had `2rem`
  and `1rem`. Mixing gaps inside one component would have been worse, so the
  coda's band matches its seven siblings and its two gaps grew by `1.5rem` and
  `0.25rem`. Small, deliberate, and reversible.
* **Mobile was not walked.** Every measurement is at 1600×1000. The band's
  `-96px` side margins are tied to `.reading-paper`'s desktop padding, and I did
  not check what the narrow breakpoint does with them. NOT ESTABLISHED.
* **Print was not checked.** The brief said print media was not required and I
  did not test it. The band carries no `@media print` rule, so it prints as it
  screens, which may not be what Dann wants of a full-strength colour band on
  paper. NOT ESTABLISHED, and worth a look before anyone prints a chapter.

**I did not run `git`, and nothing is committed or staged.**
