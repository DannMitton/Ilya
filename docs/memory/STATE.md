# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Rewritten again at the close
of E.51, 2026-08-15.** Updated at the close of every session. This is the only
file that changes often, and it is the handover.

Repository: branch `Shane`, HEAD **`8af064e`** as of the last ship. **The working
tree state was not verified at the close; ask Dann in one line. You do not run
git.** This file's own rewrite and `ENVIRONMENT.md`'s are uncommitted at the
moment of writing.

```
sh ~/Downloads/ilya-ship.sh "STATE + ENVIRONMENT: close E.51, N.69 and N.47 closed"
```

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

**E.51 shipped six commits, all five gates at baseline every time:** `55291e7`,
`99ab8c5`, `aee9f4a`, `3187c40`, `bd811d3`, `8af064e`. All six are N.69. The last
deployment is `ilya-qelnsu4xa-dannmittons-projects.vercel.app`, READY, matched on
`githubCommitSha`.

---

## THE ONE THING

> **N.68's explanation, which is the last unpaid piece of E.50's four-part ask,
> and then Dann picks between N.58 and N.59.**
>
> **N.69 is `DONE`** and **N.47 is `DONE`**. Both were observed on paper from
> Dann's own phone on `8af064e`: *"Yes. the spacing is correct."* The blocking
> set is down to **N.58** and **N.59**.
>
> **One question is open and unruled, and it is small:** the sage rules print
> faint in greyscale. See RULINGS DANN OWES.
>
> **The sequence recommended in E.51 and never ruled on:** N.59 before N.58,
> because N.59 is the only remaining build whose cost can be stated, while
> N.58's scope is still NOT ESTABLISHED and its next action is a farm-out that
> runs off the main thread.

---

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

### The blocking set: TWO

| | item | state |
|---|---|---|
| `[ ]` | **N.58** MIDI import | **"cheap" does not hold. Real scope NOT ESTABLISHED.** A scoping brief for a fresh Sonnet session was written and delivered to Dann 2026-08-14: goal, exact inputs and paths, definition of done, constraints, return-memo format. **Whether he has run it is unknown. Ask before writing a second one** |
| `[ ]` | **N.59** the reader in the browser | **Pyodide, not a rewrite. PIN THE VERSIONS.** Explained to Dann in full in E.51. Its content: stand the existing eleven-module reader up under Pyodide with cv2 4.9.0 / numpy 1.26.4 pinned; replace `rest_templates.py`'s Node-and-Verovio shell-out with Verovio WASM; swap `reader.py:269-278`'s five-line staff heuristic for Dann's brace rule. Measured floor 2.9s load, 0.867s per page. Spike at `~/Downloads/ilya-reader-spike.html`. `claude/e43-n59-the-reader-in-a-browser_2026-08-12.md` |

### Closed and parked

| | item | state |
|---|---|---|
| `[x]` | **N.55b** Click Assignment | DONE for its named active scope. Rotate syllables PARKED 2026-08-14 |
| `[~]` | **N.56** draw the withheld page badly | PARKED 2026-08-14, Dann's ruling. Trigger unrecoverable from memory, never tested. Revisit only if a bad draw resurfaces |
| `[x]` | **N.32** the Guide's false claims | DONE, shipped and observed 2026-08-14 |
| `[x]` | **N.55a** the score with no underlay | Closed 2026-08-13 |
| `[x]` | **N.47** print, from a phone, once | **CLOSED 2026-08-15.** The gate ran on Dann's iPhone to a Brother MFC-9340CDW, US Letter, two sheets. It found N.69. Both readings of the gate are now satisfied: a print happened, and the artefact is correct |
| `[x]` | **N.69** print takes the paper, not portrait's concessions | **CLOSED 2026-08-15**, six passes, observed on paper. See below |

### The visible list. Built only if a day finishes early

**N.62** · **N.63** · **N.45's remainder** · the **French colon spacing** (eight
sites, mechanical) · **N.51** · **N.17** · **N.19** · **N.27** · **N.61** ·
**N.6** · **N.68**.

---

## N.69. CLOSED 2026-08-15. Six passes, and what each one was

**The defect.** Ilya printed the mobile document rather than the paper: no title
header, no running header, the attribution footer on the last page only, and once
those appeared they landed on top of the verses.

**One cause, in three forms.** Every failure was a screen-derived value reaching
paper.

**Form one: CSS that did not say `screen`.** A bare `@media (max-width: 767px)`
has no media type, defaults to `all`, and matches `print`. Five files carried
portrait concessions that way. **Four of them had comments asserting the
opposite** (`RunningHeader.svelte:39`, `TitleHeader.svelte:200`,
`PageFooter.svelte:234-236`, `SubsequentPage.svelte:117-118`). None was true.
Fixed in `55291e7` (TitleHeader, RunningHeader, PageFooter) and `99ab8c5`
(TitlePage, SubsequentPage).

**Form two: print re-typesetting the page.** `app.css` set
`font-size: 16px; line-height: normal` on `.paper-page` at print only, while the
screen uses `line-height: 1.5` from `body` (`app.css:106`). `normal` is about 1.2,
so print re-metriced every line box *after* the layout had been measured against
1.5. Fixed in `3187c40`: those two declarations now equal the screen's.

**Form three: a measurement taken at the wrong width.** `TitlePage` derives
`contentTop` from `TitleHeader`'s `bind:offsetHeight`. `offsetHeight` of a
`display: none` element is 0, so on a phone the content was laid out with no room
for a title block (fixed in `aee9f4a`: `visibility: hidden`, which still
measures). But the measurement is still taken at whatever width the page has on
screen, and on a phone `.paper-page` is 100% wide, where the song title wraps to
a second line. That is **40 CSS px** of phantom header. Fixed in `8af064e`.

**`bd811d3` was a wrong turn and is recorded as one.** It made page two use the
live measurement like page one, which generalised the broken mechanism and made
page two match page one's wrong spacing. Dann caught it immediately.

**The settlement, `8af064e`.**

- `HEADER_GAP = 16` in `page-config.ts`, **one constant for both pages**.
- `HEADER_HEIGHTS_AT_LETTER = { title: 127, subsequent: 29 }`, measured in
  headless Chromium at 816px with the real fonts loaded.
- Below the breakpoint both pages use those constants instead of the live
  measurement. Above it, the live measurement is used, so a title of any length
  still works on a desk.
- **Both header components end at their rule** (it is the last child; verified:
  title rule bottom 127.38 of a 127px box, running rule bottom 29.0 of a 29px
  box). That is what makes `contentTop − (MARGINS.vertical + headerHeight)`
  exactly `HEADER_GAP` on every page.
- **Page two's spacing is bit-for-bit what it was before any of this:** old
  `contentTop = 48 + 37 + 8 = 93`; new `= 48 + 29 + 16 = 93`.
- `vercel-live-feedback` hidden at print (`app.css`), tag name read out of
  Vercel's own `feedback.js`.

**Verified before Dann saw it**, rendered here at 816px: page one rule bottom
175.38 to first text 195.00, gap **19.63**; page two 77.00 to 97.00, gap
**20.00**. The 0.37 is `offsetHeight` rounding 127.38 to 127.

**The process failure, recorded because it cost more than the bug.** Five of the
six passes were shipped on a model of the code and verified by making Dann print.
He was clear from his first message — *"only the WYSIWYG GUI should print"* — and
that framing was correct throughout; the disagreement was mine. **The correction
is in `ENVIRONMENT.md` under "Render it here before he prints it."**

---

## N.68. Ruled OPEN, not built now, 2026-08-14. Explanation still owed

`+page.svelte:1147-1152`: any no-lyrics score upload sets `pairings =
firstPass(...)` unconditionally, with no check against what is already there.
Verified in the browser 2026-08-14: `ilya:pairings` restores correctly on reload,
and re-uploading the same no-lyrics file erases it. Since the score is never
persisted, re-upload is the ordinary path back into Fit after a reload.

**Not N.27, not ruled in the N.55b design doc, not N.67.** A fix means deciding
how a fresh first pass should merge against a restored map, which is a design
question.

**The dependency worth carrying.** The reader returns pitch only (N.59 document
§4), so a score arriving through N.59 arrives with no lyrics and lands on this
branch. Most MIDI carries no lyric events either. **N.68's merge question arrives
attached to whichever of N.58 or N.59 gets built.**

**Owed: the explanation itself.** Start E.52 there.

---

### N.55b's station shape — RULED by Dann, 2026-08-13

Finale's Lyrics window is the model: the lyric kept whole and readable,
hyphenated at slot boundaries, one moving highlight. **A read-out, not a field.**
No IPA row. The whole verse present, carried by the drawer's own scroll, one
scroll never two. **The 44 px floor goes on the cursor alone**, not on every
syllable; pinch-zoom is live and deliberately protected (`app.html:5`,
`app.css:247`). Shift Lyrics lives in the pane. **Accepted cost:** easier on
desktop than on mobile. On a phone the drawer is the whole screen
(`Drawer.svelte:958`).

### The GUI track. Ruled, none started, displaces nothing

**N.66** Studio · **N.42** the selector · **N.64** the shared intake · **N.65**
the anchors. **Fable's timing ruling: none of it is built before the beta
closes.** **Open `claude/e44-fable-ruling-studio-architecture_2026-08-13.md`
before any GUI opinion.**

---

## RULINGS DANN OWES. Ask one at a time, at the right moment

- **The sage rules print faint in greyscale.** New, E.51, and unruled. `--sage`
  is `#8B9A7D` (`app.css:33`), unchanged all session; it converts to about 58%
  relative luminance, and a 1px hairline at that value is near the thinnest mark
  a laser printer holds. It also reads more luminous on paper than on screen
  because the print block swaps `--paper-cream` for pure white. Three levers:
  leave it; darken `--sage` globally, which keeps print identical to screen; or
  darken the rules at print only, which breaks the WYSIWYG principle Dann set in
  E.51. **His call, and nothing depends on it.**
- **Which of N.58 and N.59 is next.**
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

**E.51 was rule 3 running the whole day.** A ten-minute gate found N.69 and the
session went to it.

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
text under Kabalevsky op. 52 no. 9, fourteen lines. **It fills exactly two letter
sheets, which is what makes it the right instrument for a running header: a
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
- **The marks on the printed page.** E.51's prints carry a dashed `VERIFY` box
  and a `USER OVERRIDE` badge on paper. CONTRACT §6 forbids a mark that says Ilya
  is unsure. **Whether these are the ruled exception was not checked.**
- **`VoiceProfilePane.svelte:295-313` duplicates the old header arithmetic**, its
  own local `TITLE_HEADER_GAP = 18` and `HEADER_HEIGHTS.subsequent + GAP`. It was
  deliberately left untouched in E.51 to keep the blast radius small. **Fit's
  paper therefore does not yet share the Transcribe paper's single `HEADER_GAP`.**

---

## Register corrections owed

`claude/ILYA-REGISTER_2026-08-11.md` is at revision 10 and needs revision 11.
Its N.55a row is FALSE (N.55a is CLOSED). It says "ten cardinals" over a list of
twelve; **five actually remain and none is in the tree: N.1, N.2, N.3, N.18,
N.21.** N.6 is OPEN and unbuilt. Its N.55b row is stale. **The blocking number is
now TWO, not six.**

**Or fold the register into this file and retire it.** It is the last piece of
canon still living in project knowledge.

---

## Log

| date | what changed |
|---|---|
| 2026-08-15 | **E.51 closed. N.69 and N.47 both CLOSED, blocking set down to two.** `STATE.md` rewritten, `ENVIRONMENT.md` gained the print, Vercel, container-renderer, and measurement sections. |
| 2026-08-15 | **`8af064e`: N.69 settled.** `HEADER_GAP = 16` on both pages; `HEADER_HEIGHTS_AT_LETTER` measured in headless Chromium; `isMobile` threaded to `SubsequentPage` through `Paper.svelte`. **Verified in a container render before Dann printed it**, gaps 19.63 and 20.00. Dann on paper: *"the spacing is correct."* |
| 2026-08-15 | **`bd811d3`: a wrong turn, recorded.** Made page two use the live measurement like page one, generalising the broken mechanism instead of the working one. Also hid `vercel-live-feedback` at print, tag name read out of Vercel's `feedback.js`, which was correct and survives. |
| 2026-08-15 | **`3187c40`: print stops re-typesetting the page.** `app.css`'s print-only `line-height: normal` replaced with the screen's `1.5`. |
| 2026-08-15 | **Vercel SSO turned OFF for project `ilya`** (was `all_except_custom_domains`), so phone QRs need no share token and do not expire. **Reversible in the dashboard: Settings, Deployment Protection.** |
| 2026-08-15 | **Asked and answered from the code, no change made: is `с` in «если» regressively palatalized by `лʲ`?** No, by two independent mechanisms. `engine.ts:295` lists `л` in `regressivePalatalizationBlockers` and `engine.ts:898` blocks the chain there; independently `engine.ts:303`'s `dentals` set excludes `л`, so `canRegressivelyPalatalize('с','л')` at `engine.ts:998-999` is false. No `wordSpecificClusters` entry for «если». **The `[ɛ]` rather than `[e]` is downstream of the same decision** (`engine.ts:1187-1188`). The code's own comments record that Grayson p. 209 and D&P pp. 76-87 disagree and that **Ilya follows D&P**. Changing it would be reversing a ruling, not fixing a bug. |
| 2026-08-14 | **`aee9f4a`, `99ab8c5`, `55291e7`: N.69 passes one to three.** The `screen and` scoping, and `visibility: hidden` so a hidden header still measures. |
| 2026-08-14 | **N.47's gate RUN and it found N.69.** STATE.md's claimed HEAD `b5e8777` corrected: the push read `c325a25..55291e7`. The tree wins. |
| 2026-08-14 | **N.59 explained in full. N.58's scoping brief written and delivered.** N.68 not explained; still owed. |
| 2026-08-14 | **`I.01` caught in `INBOX.md`**: on mobile the Notation section opens fully expanded and blocks the metadata fields. Not scoped, not costed, not ruled. |
| 2026-08-14 | **`b5e8777`: N.32 closed**, walked and observed. |
| 2026-08-13 | **STATE.md rewritten clean.** **A log that only appends drifts; rewrite this file at the close.** |
| 2026-08-13 | **`2868d58`: an Inspector re-division propagates instead of reporting drift.** web-test 408 → 416. |
| 2026-08-13 | **RULED, Dann: the notes never move; the syllables slide along them.** In `PRODUCT.md`. |
| 2026-08-13 | **N.55a CLOSED.** |
| 2026-08-13 | **This folder created.** Project knowledge 85.7% → 74.8%, measured. |

---
*E.51. Facts above are SOURCED from files read in full or in targeted extracts
this session, from Dann's own terminal output, from Vercel's deployment API, from
photographs and a PDF Dann produced, or measured directly in a headless Chromium
render in the session container. Claims resting on a comment beside code rather
than on the code say so.*
