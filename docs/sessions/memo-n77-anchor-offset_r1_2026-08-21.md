# MEMO: N.77 ship 2, the anchored heading clears the chrome

Code, 2026-08-21. Answers `docs/sessions/brief-n77-anchor-offset_r1_2026-08-21.md`.
Read and built in the tree at `2b85d13`, branch `Shane`. The working tree is
dirty with `apps/web/src/lib/components/Paper/ReadingPaper.svelte` and this memo.

One file, one block of CSS. No anchor moved, no tag changed, `scrollToAnchor`
was not touched, and the observer's `rootMargin` was not touched.

---

## What changed

Everything is in `apps/web/src/lib/components/Paper/ReadingPaper.svelte:169-258`,
placed directly after ship 1's band block. There is no second copy in
`LearnContent.svelte` or `GuideContent.svelte`.

### The measured chrome, and the margin derived from it

`ReadingPaper.svelte:193-196` declares two custom properties on
`.reading-paper`, which every anchor inherits.

**`--sticky-chrome: 42px`.** Measured on the built page at 1600×1000:
`.desk-head` renders **41.78px**, identical on Learn and on Guide and identical
in both languages. Its `top: calc(-1 * var(--desk-pad-top))` sticks it flush to
`.main-content`'s top edge, so when it is stuck it covers exactly the top
41.78px of the scroll port. 42px is that height taken up to the whole pixel, so
the chrome is cleared rather than met.

**The window's `.header-bar` is not part of this number.** It measures 48px at
`y: 0` and `.main-content` begins at `y: 48`, so it sits above the scroll port
rather than over it and covers nothing.

**`--anchor-gap: 1rem`.** This one is a choice, not a measurement, and the memo
says so where the CSS says so. It is the visible gap the brief asked for and it
is one line to change.

**The margin for an ordinary anchor is therefore `calc(42px + 1rem)`, 58px.**

### The rules

* `ReadingPaper.svelte:206`: `.reading-inner :global([id])` carries
  `scroll-margin-top: calc(var(--sticky-chrome) + var(--anchor-gap))`.
* `ReadingPaper.svelte:226`: a Guide chapter heading adds `34px + 10px`.
* `ReadingPaper.svelte:230-231`: a Learn chapter heading adds
  `34px + 14.5px + 10px`.
* `ReadingPaper.svelte:256`: the band deck adds
  `34px + 14.5px + 10px + 41.6px + 12px`. This one goes past the brief; see
  section 3.

Every added term is a value already declared in ship 1's block: 34px is
`.chapter-band`'s `padding-top`, 14.5px is `.band-kicker`'s line box (its
`font-size: 10px` times its `line-height: 1.45`), 10px is the band title's
`margin-top`, 41.6px is the title's line box (`40px` times `1.04`), and 12px is
the deck's `margin-top`. Each total was then confirmed against the render.

The three band rules beat the `[id]` rule on specificity, a class and a type
against an attribute, so source order does not decide which applies.

### The selector is `[id]`, not the list the brief proposed

The brief proposed `h1, h2, h3, h4, p[id]` and asked me to establish that it
covers every target first. **It does not, and the miss is larger than it
looks.**

* **No `<p id>` survives in either content file.** Ship 1 moved
  `learn-u3-inventory` off its `<p>` and onto the band's deck `<div>`, and it
  was the only one. `p[id]` would have matched nothing at all.
* **Seven `h5` elements carry ids** in Learn's consonant chapter:
  `learn-u5-hard`, `learn-u5-soft`, `learn-u5-l`, `learn-u5-r`,
  `learn-u5-hushers`, `learn-u5-affricates`, and `learn-u5-x`. They are not
  table-of-contents entries but they are reachable by hash, and `h1, h2, h3, h4`
  misses all seven.

`[id]` reaches all 93 id-carrying elements in the two files: 1 `h1`, 9 `h2`,
11 `h3`, 64 `h4`, 7 `h5`, and the 1 `div`. It also cannot drift when a new
anchor lands on a tag nobody listed.

---

## The six done-conditions, as observed

Method: `pnpm --filter @ilya/web build`, then
`cd apps/web/build && python3 -m http.server 4200`, never `vite preview`.
Headless Chromium under the repository's own Playwright at 1600×1000. The pass
test is that the target's top edge sits at or below `.desk-head`'s bottom edge,
measured on the built page after the scroll settles.

### 1. Every Guide entry, both languages

Clicked all 27, in English and in French. **27 of 27 in each language land
clear of the chrome.** Named: `guide-how`, `guide-what`, `guide-paste`,
`guide-source`, `guide-ai`, `guide-role`, `guide-limits`, `guide-future`,
`guide-fit-forecast`, `guide-fit-characteristics`, `guide-fit-notation`,
`guide-walkthrough`, `guide-walk-interface`, `guide-walk-tabs`,
`guide-walk-metadata`, `guide-walk-transcribe`, `guide-walk-analysis`,
`guide-walk-notation`, `guide-walk-print`, `guide-contributors`,
`guide-grayson`, `guide-grayson-intro`, `guide-mitton`, `guide-mitton-note`,
`guide-claude`, `guide-kimi`, `guide-licences`.

Ordinary headings land 16px or 17px below the chrome, which is `--anchor-gap`
plus the quarter-pixel the 42px rounding adds. The four chapter entries land
their bands at 16px or 17px, with the heading itself 60px or 61px down.

### 2. Every Learn entry, both languages

Clicked all 58, in English and in French. **58 of 58 in each language land
clear.** That is `learn-title`, `learn-about`, `learn-arc`, the eight chapter
entries, the 44 `learn-uN-*` subsections, `learn-try`, and `learn-notation`.

`learn-u3-inventory`, the paragraph-style target the brief singled out, is a
`div.band-deck` today and lands with its whole band clear of the chrome. See
section 3.

`learn-notation` lands 288px below the chrome rather than 16px, because it is
the last heading in the document and there is no scroll room left beneath it.
That is the document's end, not the rule failing.

### 3. The control, and it is Dann's case

**Before**, measured on the build at `2b85d13`: clicking `Why only one source?`
put the heading's top edge exactly on the scroll port's top edge, the chrome's
bottom edge 41px below that, and the heading is only 30px tall. The whole
heading was covered, and the paragraph started at the chrome's bottom edge. That
is precisely what Dann reported.

**After**: the heading `Why does Ilya follow only one source?` sits **17px below
the tab row**, in full, with its paragraph beginning under it. Screenshotted
before and after from the same clip region.

### 4. A chapter's entry lands on its band

**Before**, and this was already failing: clicking `A Walkthrough` put the
heading on the port's top edge and its band's top edge 44px above that, so 85px
of a 116px band was either off the port or behind the chrome. The band arrived
decapitated.

**After**: the band's top edge lands 16px or 17px below the chrome, on all
twelve chapters in both languages. Screenshotted on `learn-unit-3`: the kicker
`SECTION 3`, the title `Stressed Vowels`, and the deck all arrive together, with
a strip of cream between the band and the tab row.

**The deck rule goes past the brief, and this is the flag.** Condition 4 names
"a chapter's own entry", and `learn-u3-inventory` is a subsection entry, so the
base rule was correct by the letter. It also produced a bad picture: the
sentence landed 16px below the chrome on a rose block whose kicker and title
were scrolled away, which reads as a rendering fault. The brief's own reason for
condition 4 is "the band is the arrival moment, so it must be what arrives", and
landing the band costs the deck nothing because the deck is inside the band and
stays on screen either way. So I extended the same recipe to it, at
`ReadingPaper.svelte:256`. Observed after: the deck sits 128px below the chrome
and its band's top edge 16px below, so the full band arrives and the sentence
the entry names is in it. **One selector to delete if you would rather it landed
on the sentence alone.**

### 5. Loading with a hash in the URL

`+page.svelte:1853` calls the same `scrollToAnchor`, so it lands the same way.
Tested as a full page load with the hash already in the address, not as a
click: **8 of 8.**

`guide-source` 17px below the chrome; `guide-walkthrough` band at 17px;
`guide-licences` band at 16px; `learn-unit-3` band at 16px;
`learn-u3-inventory` band at 16px; `learn-u5-hard` at 17px; `learn-u2-yo` at
16px; `learn-title` at 16px.

The last three matter: `learn-u5-hard` is one of the seven `h5` anchors and
`learn-u2-yo` is a non-table-of-contents `h4`. Neither is reachable from the
drawer, both are reachable by hash, and the brief's proposed selector list would
have left the `h5` behind the chrome.

### 6. All five gates at baseline

| gate | baseline | observed |
|---|---|---|
| phonology | 216 | `216 passed (216)` |
| dictionary | 235 | `235 passed (235)` |
| web-check | 0 errors, 7 warnings, 4 files | `found 0 errors and 7 warnings in 4 files` |
| web-test | 682 | `682 passed (682)` |
| score-parser | 444 passed, 5 skipped | `444 passed | 5 skipped (449)` |

### The highlight counts, since the brief asked

**The count did not move. The membership did.** Ten highlight misses in English
before this change and ten after, stable across two runs each. Nothing was
changed in response.

Left the set: `learn-unit-1`, `guide-fit-forecast`, `guide-walkthrough`,
`guide-walk-print`. Joined it: `learn-u2-try`, `learn-unit-6`, `learn-unit-7`,
`guide-contributors`. Unchanged in both: `learn-arc`, `learn-u2-sounds`,
`learn-u3-try`, `learn-try`, `guide-ai`, `guide-limits`.

That is what a 58px to 117px shift in landing position does to an observer whose
`rootMargin` is `-25% 0px -60% 0px`: a different heading becomes the topmost one
inside the band it watches. Still a separate problem, still not in this brief.

---

## What I could not establish

* **A cold load at `/#guide-source` on a browser that has never opened the
  Guide does not reach the anchor at all**, and this change cannot help it. The
  destination is restored from `ilya:activeTab` at `+page.svelte:1817`, and a
  hash does not select a destination, so the app opens on Transcription, the
  reading content never mounts, and `scrollToAnchor` retries for 90 frames and
  gives up. Every one of my eight hash tests therefore ran as a reload on a
  browser that had already been to the destination. **This is pre-existing
  routing and a `scroll-margin-top` cannot mount an element**, so I am confident
  it is untouched, but I did not measure it against `2b85d13` to prove the
  behaviour is identical. NOT ESTABLISHED as a measured before-and-after.
* **The deck rule is fragile in one direction.** Its offset assumes a
  single-line band title. A title that wrapped to two lines would push the deck
  lower and the fixed offset would clip the band's top again. Neither
  `Stressed Vowels` nor `Les voyelles accentuées` wraps at the 756px band
  measure, measured at 112.09px in both languages. The heading rules do not have
  this exposure, because nothing above a heading inside a band can reflow.
* **`42px` is a literal, not a live reading of the chrome.** If `.desk-head`'s
  padding or type ever changes, this number goes stale silently and anchors
  drift by the difference. The head publishes no custom property to bind to, and
  making it publish one means touching `+page.svelte` or `DeskHead.svelte`,
  which this brief rules out. Recorded as a known coupling.
* **Mobile was not walked.** Every measurement is at 1600×1000. Below the
  breakpoint `.main-content` goes `display: block; overflow: visible`
  (`+page.svelte:2957-2963`), so the scroll port and the sticky behaviour are
  different there and the 42px may not apply. NOT ESTABLISHED.
* **The rule reaches every anchor in the two reading files and nothing
  else.** It is scoped to `.reading-inner`, so an anchor outside the reading
  paper, if one is ever added, gets nothing. There is no such anchor today.

**I did not run `git`, and nothing is committed or staged.**
