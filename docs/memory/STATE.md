# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Rewritten again at the close
of E.51, 2026-08-15.** Updated at the close of every session. This is the only
file that changes often, and it is the handover.

Repository: branch `Shane`, HEAD **`99ab8c5`** as of the last ship. **The working
tree state at the close was NOT verified; ask Dann in one line. You do not run
git.** This file's own rewrite is uncommitted at the moment of writing, so at
minimum `docs/memory/STATE.md` and `docs/memory/ENVIRONMENT.md` are modified.

```
sh ~/Downloads/ilya-ship.sh "STATE + ENVIRONMENT: close E.51, N.69 written and awaiting a phone print"
```

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

E.51 shipped two commits, both with all five gates at baseline: **`55291e7`**
(N.69, the header and footer restored to paper) and **`99ab8c5`** (N.69, the page
geometry those two are positioned against). Deployment for `99ab8c5` is
`ilya-oyq5fb8wf-dannmittons-projects.vercel.app`, state READY, matched on
`githubCommitSha`.

---

## THE ONE THING

> **Ship N.69 pass three and print from Dann's phone again. Two of the three
> observables are now DONE and the third is not.**
>
> **Observed on `99ab8c5`, 2026-08-15**, from a PDF Dann printed off his phone:
>
> - **Page two is correct.** Running header at the top, clear of the first verse,
>   with its hairline. Footer at the foot. `PAGE 2 OF 2`. **DONE.**
> - **The footer is correct on both sheets.** At the foot, above the hairline,
>   with the page number at the right. **DONE.**
> - **Page one's title block still lands on top of the first two verses.**
>   NOT DONE, and **it is a different bug from the one N.69 started as.**
>
> **Pass three is written and unshipped**, `TitleHeader.svelte:201-214`. See the
> N.69 section for why.
>
> **The pagination failure mode I named is NOT confirmed.** Page one carries eight
> verse rows, which is exactly `rowConfig`'s designed fallback rung
> (`TitlePage.svelte:100-103`), so the white space above the footer may be the row
> budget behaving correctly rather than a defect. **Not established. Do not chase
> it without a control**: print the same fourteen lines from the Mac, where
> pagination is computed at letter width, and compare the verses-per-page count.
>
> **After that, in order:** N.68's explanation, which is the last unpaid piece of
> E.50's four-part ask; then Dann picks among **N.58**, **N.59**, and **N.47**.
> The sequence recommended in E.51 and not yet ruled on: N.47 first because it is
> cheap and can falsify the rest, N.59 next because it is the only remaining
> build whose cost can be stated, N.58 last with its scoping farmed out in
> parallel.

---

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

### The blocking set

| | item | state |
|---|---|---|
| `[x]` | **N.55b** Click Assignment | **DONE for its named active scope.** Increments 1, 2A, 2B, and the drift count shipped and OBSERVED. The station's ruled shape `87317a8`; Shift Lyrics `ccfdabd`; `ilya:pairings` storage `7b1a1d2`, all walked. **Rotate syllables `PARKED`**, dropped from active scope by Dann 2026-08-14 |
| `[~]` | **N.56** draw the withheld page badly, once | **PARKED, Dann's ruling, 2026-08-14.** The trigger for "once" and the meaning of "R7" are unrecoverable from Dann's memory. Browser-observed working honestly in steady state, but the trigger was never identified and so was never tested. Parked, not closed. Revisit only if a bad draw resurfaces on its own |
| `[ ]` | **N.58** MIDI import | **"cheap" does not hold.** Real scope NOT ESTABLISHED. **A scoping brief for a fresh Sonnet session was written and delivered to Dann 2026-08-14** (goal, inputs, definition of done, constraints, return-memo format). **Whether he has run it is unknown.** Ask before writing a second one |
| `[ ]` | **N.59** the reader in the browser | **Pyodide, not a rewrite. PIN THE VERSIONS.** Explained to Dann in full, E.51. Its content is: stand the existing eleven-module reader up under Pyodide with cv2 4.9.0 / numpy 1.26.4 pinned, replace `rest_templates.py`'s Node-and-Verovio shell-out with Verovio WASM, and swap `reader.py:269-278`'s five-line staff heuristic for Dann's brace rule. Spike exists at `~/Downloads/ilya-reader-spike.html`. `claude/e43-n59-the-reader-in-a-browser_2026-08-12.md` |
| `[x]` | **N.32** the Guide's false claims, prose only | **`DONE`.** Shipped `4cfa5f0`, `b617a4b`, observed on the live deployment |
| `[D]` | **N.47** print, from a phone, once | **THE GATE WAS RUN, 2026-08-14, and it found N.69.** Dann printed Kabalevsky op. 52 no. 9 from his iPhone to a Brother MFC-9340CDW, US Letter, two sheets. **Printing from a phone works.** The artefact was wrong, which is what the gate was for. **Dann's to rule: does N.47 close on "a print happened," or on "a correct print happened"?** If the latter, it closes with N.69 |
| `[ ]` | **N.69** print takes the paper, not portrait's concessions | **Two thirds `DONE`, one third `WRITTEN`. E.51's finding, from N.47's gate.** Passes one and two shipped (`55291e7`, `99ab8c5`) and OBSERVED: page two and both footers are correct. Page one's title block still overlays the first two verses; **pass three is written and unshipped**. See below |

**Closed 2026-08-13:** **N.55a**, the score with no underlay.
**Closed 2026-08-14:** **N.32**, the Guide's four remaining false claims.
**Parked 2026-08-14:** **N.56**.

---

## N.69. Print took portrait's concessions. WRITTEN 2026-08-15, unobserved

**The defect.** Ilya printed the mobile document, not the paper: no title header,
no running header, and the attribution footer on the last page only.

**The cause, and it is one thing five times.** A bare `@media (max-width: 767px)`
carries no media type, so it defaults to `all` and **matches `print`**. Every
portrait concession in the Paper components therefore applied to paper. On a desk
the width never matches and the bug is invisible; on a phone the paper inherits
the phone.

**Three of the five files carried comments asserting the opposite.**
`RunningHeader.svelte:39` and `TitleHeader.svelte:200` both read *"Unchanged for
print and for landscape."* `PageFooter.svelte:234-236` reads *"print overrides
it."* `SubsequentPage.svelte:117-118` reads *"the printed artefact is unchanged
because the @media print block below overrides this one."* **None of them was
true, and none had ever been true.**

**Pass one, `55291e7`,** scoped three to `screen and`:

- `TitleHeader.svelte:201`. Its `@media print` block sits at line **188**, before
  the width block. Equal specificity, later wins, so the width rule was
  overriding print.
- `RunningHeader.svelte:40`. **No `@media print` block in the file at all.**
- `PageFooter.svelte:248`. **No `@media print` block in the file at all.**

Result, observed on paper: all three restored, and all three landing on top of
the words. **That was the failure mode named in advance.**

**Pass two, `99ab8c5`,** scoped the two page components:

- `TitlePage.svelte:225` and `SubsequentPage.svelte:129` set
  `.paper-page { height: auto !important }` and
  `.page-content { position: static }`. Their `@media print` blocks set
  `box-shadow` and `background` and nothing else. **The page stopped being
  letter-height** (`!important` beats the inline
  `style="width: {dims.width}px; height: {dims.height}px"` at
  `TitlePage.svelte:122`), and the content flowed from the top of the box instead
  of being inset by `top: {contentTop}px; bottom: {contentBottom}px`. Against
  that, `.title-header`'s `position: absolute; top: 48px`
  (`TitleHeader.svelte:104-105`) and `.page-footer`'s `bottom: 48px`
  (`PageFooter.svelte:90-91`) had nothing correct to anchor to.

**A defect in my own audit, recorded so it is not repeated.** In pass one I
checked those two files, saw an `@media print` block *after* the width block, and
marked them fine. **I checked the source order and never read the declarations.**
Order is not override. Read what a block actually sets.

Result, OBSERVED on a PDF from Dann's phone 2026-08-15: **page two correct, both
footers correct, page one's title block still on top of the verses.** Two of
three DONE.

**Pass three, WRITTEN and unshipped: the last one is not a CSS bug at all.**

`TitlePage.svelte` derives `contentTop` from the title header's own measured
height: `TitleHeader.svelte:67` is `bind:offsetHeight={measuredHeight}`, reported
through the `$effect` at 60-62 to `handleHeaderHeight` at `TitlePage.svelte:115`,
which feeds the inline `style="top: {contentTop}px"` at `TitlePage.svelte:138`.

**`offsetHeight` of a `display: none` element is 0.** On a phone the title header
is hidden on screen, correctly, by Dann's N.45 ruling. So it measured zero, so the
content layer was laid out with no room for a title block, and at print the block
became visible with nowhere to go.

**A JS-computed inline style cannot be media-query-scoped**, so screen and print
cannot carry different `contentTop` values by CSS alone. The fix is to stop the
measurement depending on the breakpoint: `TitleHeader.svelte:211-213` now reads
`visibility: hidden` instead of `display: none`. **It costs nothing on screen**,
because the header is `position: absolute` and the mobile rule makes
`.page-content` `position: static` (`TitlePage.svelte:233`), so the inline `top`
is ignored there anyway. **Dann's N.45 ruling stands untouched**: the header is
still invisible on a phone.

**`ReadingPaper.svelte:235` carries the same bare query and was deliberately left
alone**: it governs the Guide's padding and font sizes, not the transcription
paper.

---

## N.68. Ruled OPEN, not built now, 2026-08-14

`+page.svelte:1147-1152`: any no-lyrics score upload sets `pairings =
firstPass(...)` unconditionally, with no check against what is already there.

**Verified in the browser, 2026-08-14.** `ilya:pairings` restores correctly on
reload; re-uploading the SAME no-lyrics file erases it. Since the score is never
persisted, re-upload is the ORDINARY path back into Fit after a reload, so R5's
save is real and currently invisible on the one workflow it looks built for.

**Not N.27**, **not ruled in the N.55b design doc**, **not N.67**.

**Ruled: OPEN, not built now.** A fix means deciding how a fresh first pass should
merge against a restored map, which is a design question.

**Still owed to Dann: the explanation itself.** It is the last unpaid piece of
E.50's four-part ask, and E.51 never got to it.

**A dependency worth carrying.** The reader returns pitch only (N.59 document
§4), so a score arriving through N.59 arrives with no lyrics and lands on exactly
this branch. Most MIDI carries no lyric events either. **N.68's merge question
will arrive attached to whichever of N.58 or N.59 gets built.** Sourced from
STATE.md and the N.59 document; `+page.svelte:1147-1152` was not opened in E.51.

---

### N.55b's station shape — RULED by Dann, 2026-08-13

- **Finale's Lyrics window is the model**: the lyric kept whole and readable,
  hyphenated at slot boundaries, with one moving highlight.
- **A read-out, not a field.** No border, no caret, Ilya's own type.
- **No IPA row.** The station reorients you in the poem as source text.
- **The whole verse is present.** The drawer's own scroll carries it, one scroll,
  never two.
- **The 44 px floor is not spent.** The *cursor* takes the handle, not every
  syllable. Pinch-zoom is live and deliberately protected (`app.html:5`,
  `app.css:247`).
- **Shift Lyrics lives in the pane.**
- **Accepted cost:** easier on desktop than on mobile, and that is fine. On a
  phone the drawer is the whole screen (`Drawer.svelte:958`).

**Arias:** running text scales; 400 slots is roughly 25 to 30 lines of prose.
Pagination is downstream and does not touch this.

### The GUI track. Ruled, none started, displaces nothing

**N.66** Studio · **N.42** the selector · **N.64** the shared intake · **N.65**
the anchors. **Fable's timing ruling: none of it is built before the beta
closes.** **Open `claude/e44-fable-ruling-studio-architecture_2026-08-13.md`
before any GUI opinion.**

### The visible list. Built only if a day finishes early

**N.62** · **N.63** · **N.45's remainder** · the **French colon spacing** (eight
sites, mechanical) · **N.51** · **N.17** · **N.19** · **N.27** · **N.61** ·
**N.6** · **N.68**.

---

## RULINGS DANN OWES. Ask one at a time, at the right moment

- **Does N.47 close on "a print happened" or on "a correct print happened"?**
  New, E.51. It decides whether the blocking set drops by one when N.69 closes.
- **Which of the open blocking items is next.** A sequence was recommended in
  E.51 and not ruled on: N.47, then N.59, with N.58's scoping farmed out in
  parallel.
- **The phone-testing origin.** New, E.51. Every ship produces a new deployment
  URL, which is a new origin with empty `localStorage`, so the test text must be
  re-pasted on every iteration. The branch alias
  `ilya-git-shane-dannmittons-projects.vercel.app` would persist across ships, at
  the cost that an observation on it is not pinned to a sha. `ENVIRONMENT.md`
  currently rules for the pinned URL.
- **N.63.** Killing the interstitial is ruled; **where the honest residue goes is
  not.** Asked in E.45, still unanswered.
- **N.45's remainder.**
- **N.67's displacement**, or it waits.
- **The French question mark.** Eleven strings carry U+00A0 before `?`.
- *(Not yet: what a deliberately empty note draws.)*

---

## THE SCHEMA. It has survived nine sessions

1. Only blocking work gets built.
2. **A new cardinal displaces a named one or waits. Say which.**
3. Half of every build day is reserved for what the previous day's walk found.
4. Every build day ends in a deploy and a walk.
5. N.48 may be unclosable; it needs a `[u]` that fails.

**E.51 is schema rule 3 working exactly as designed.** A ten-minute gate found a
defect and the rest of the session went to it.

---

## THE FIXTURE. Read out of the file, do not re-derive it

`~/Downloads/no-lyrics-control.musicxml` is the only instrument that exercises
the no-underlay path; all three of Dann's own scores carry lyrics.

**It holds five pitched notes and one half rest:** C4 D4 E4 F4 quarters, G4 half,
then a half rest. **It is NOT six notes.** Its stripped lyric line was five
syllables, «Я тебя любил». **Its header title is a different text from its lyric
line.**

**The walk, four steps.** Transcribe some Russian, or the queue is empty and
nothing draws. Switch to Fit **before touching any file input.** Upload the
control, press *Continue to analysis*. **Expect `5 / 5`, syllables under the
notes, the rest bare, no dashed boxes.** Walked and confirmed 2026-08-13.

**The print fixture, E.51.** Marshak's Russian of Shakespeare's Sonnet 90, the
text under Kabalevsky op. 52 no. 9, fourteen lines. It fills exactly two letter
sheets, which is what makes it the right instrument for a running header: **a
one-page text cannot test page two.**

---

## STILL UNSETTLED. Not yours to settle alone

- "The page carries no chrome." · "Do not introduce a slider."
- **N.51:** whether per-tab colour may propagate past the tab bar.
- Whether `claude/shane-project-map_2026-07-25.md` is stale. **Unopened for
  eleven sessions.**
- **D3's Job A**, per-verse reprints, ruled in E.36 and still unnumbered.
- **The per-format score arrival audit**, asked for in E.45 and never written.
- **The teacher-with-a-studio copyright case**, raised by Dann and unanswered.
- **`stripBackingRect` matches `fill="#FFFFFF"` while `staff-renderer.ts` paints
  `#F0EBE0`.**
- **The marks on the printed page.** E.51's prints carry a dashed `VERIFY` box and
  a `USER OVERRIDE` badge on paper. CONTRACT §6 forbids a mark that says Ilya is
  unsure. Whether these are the ruled exception was **not checked** and was
  deliberately not raised mid-build.

---

## Register corrections owed

`claude/ILYA-REGISTER_2026-08-11.md` is at revision 10 and needs revision 11.

- **Its N.55a row is FALSE.** N.55a is CLOSED.
- It says "ten cardinals" over a list of twelve. **Five actually remain and none
  is in the tree: N.1, N.2, N.3, N.18, N.21.**
- **N.6 is OPEN and unbuilt.**
- **Its N.55b row is stale.**

**Or fold the register into this file and retire it.** It is the last piece of
canon still living in project knowledge.

---

## Log

| date | what changed |
|---|---|
| 2026-08-15 | **E.51 closed.** `STATE.md` rewritten, `ENVIRONMENT.md` gained the print, Vercel, and container sections. |
| 2026-08-15 | **N.69 passes one and two OBSERVED** on a PDF Dann printed from his phone off `99ab8c5`. **Page two and both footers are correct.** Page one's title block still overlays the first two verses. **Pass three written, unshipped:** `TitleHeader.svelte` mobile rule changed from `display: none` to `visibility: hidden`, because `TitlePage` measures that header's `offsetHeight` to compute `contentTop` and a `display:none` element measures 0. **A layout bug wearing a CSS bug's clothes.** |
| 2026-08-15 | **The Vercel Toolbar appears on `_vercel_share` preview links.** Removed by setting `VERCEL_PREVIEW_FEEDBACK_ENABLED=0` in the project's preview environment on Vercel, per Vercel's own documentation. **Dann's to do, in the dashboard; not a code change and not mine to make.** |
| 2026-08-14 | **`99ab8c5`: N.69 pass two, the print page geometry restored.** `TitlePage.svelte:225` and `SubsequentPage.svelte:129` scoped to `screen and`, so `height: auto !important` and `.page-content { position: static }` stop applying to paper. Five gates at baseline. **Not yet observed.** |
| 2026-08-14 | **`55291e7`: N.69 pass one, the header and footer restored to paper.** `TitleHeader.svelte:201`, `RunningHeader.svelte:40`, `PageFooter.svelte:248` scoped to `screen and`. Five gates at baseline. **OBSERVED on paper from Dann's iPhone:** title block, running header, and per-page footer with `PAGE 1 OF 2` and `PAGE 2 OF 2` all present for the first time, **all three landing on top of the transcription**, which was the failure mode named before the ship. |
| 2026-08-14 | **N.47's gate RUN, and it found N.69.** Kabalevsky op. 52 no. 9 printed from Dann's iPhone to a Brother MFC-9340CDW, US Letter, two sheets. **A label corrected in the same session:** STATE.md claimed HEAD `b5e8777`; the push read `c325a25..55291e7`, so `c325a25` was HEAD. The tree wins. |
| 2026-08-14 | **N.59 explained to Dann in full**, from the E.43 document read in full. **N.58's scoping brief written and delivered**, for a fresh Sonnet session inside the Shane project. **N.68 not explained; still owed.** |
| 2026-08-14 | **`I.01` caught in `INBOX.md`**: on mobile the Notation section is anchored to the bottom and opens fully expanded, so the metadata fields cannot be reached without closing it. Not scoped, not costed, not ruled. |
| 2026-08-14 | **`b5e8777`: N.32 closed**, walked and observed. Four commits this day: `c6fc3ba`, `4cfa5f0`, `b617a4b`, `b5e8777`. |
| 2026-08-13 | **STATE.md rewritten clean.** **A log that only appends drifts; rewrite this file at the close, do not just patch it.** |
| 2026-08-13 | **`2868d58`: an Inspector re-division propagates instead of reporting drift.** web-test 408 → 416. **The design's §4.3 claim that boundary edits change how many slots a word has is WRONG.** |
| 2026-08-13 | **RULED, Dann: the notes never move; the syllables slide along them.** In `PRODUCT.md`. |
| 2026-08-13 | **RULED, Dann: N.55b's station shape.** |
| 2026-08-13 | **N.55a CLOSED.** |
| 2026-08-13 | **This folder created.** Project knowledge 85.7% → 74.8%, measured. |

---
*E.51. Facts above are SOURCED from files read in full this session — `README.md`,
`CONTRACT.md`, the previous `STATE.md`, `ENVIRONMENT.md`, the N.59 document — or
measured directly from the tree, from Dann's own terminal output, from Vercel's
deployment API, or from photographs Dann took of the printed sheets. Claims
resting on a comment beside code rather than on the code say so.*
