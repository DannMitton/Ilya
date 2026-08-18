# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

What it names instead is a **FLOOR**: everything described below was true at or
before **`cb7a15a`**, raised from `58d7888` at the close of the second session of
2026-08-18, because N.67 step 4b shipped in `cb7a15a` and a floor that predates
its own content is the stale number this paragraph exists to prevent. A floor cannot go stale, because further commits only
move HEAD forward and never make the floor false. If the tree is ahead of it,
that is expected and tells you only that work has landed since.

**Ask Dann for the state in one line. You do not run git.**

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

**The night of 2026-08-16 built the save function.** N.67 steps 0, 1, 2, 3, 4a,
and step 5's single-song half; N.68, N.70, N.71 closed; N.55b repaired; N.72's
minimum shipped and walked; `bits-ui` removed; the Guide's false claim
corrected. Ilya keeps songs and score files in
IndexedDB, brings the score back on reload, cannot destroy a placement made by
hand, and now says so before a different piece replaces a song. **Every one of
those closures was walked by Dann on a real deploy**, which is the only reason
any of them count.

---

## THE ONE THING

> **N.67 step 5's remainder: export-all, multi-song import, and the collision
> rules.** Step 4b closed 2026-08-18 and was walked by Dann on the deploy, so
> songs are plural and everything step 5 was waiting on now exists. Fable's
> build order puts 5 next and then 6, the sweep. **N.58's real scope is still
> NOT ESTABLISHED**; a scoping brief was delivered 2026-08-14 and there is no
> record of it being run. **If Dann rules N.58, N.72's iPhone walk, or step 6
> ahead of step 5, this block is wrong, and he says so in one word.**

---

## THE FABLE GUI SESSION, 2026-08-18 EVENING. RULED, RECORDED, NOTHING BUILT

Dann displaced N.67 step 5 for one session of GUI design work with Fable in
Cowork. Step 5 remains THE ONE THING. Full record with rulings, artifact md5s,
and instrument notes: `docs/sessions/fable-gui-session-record_2026-08-18.md`.
The short form:

- **Ratified:** the eleven-principle Calm Authority slate and operational spec
  (colour, shape, grouping, typography, motion, error copy).
  Doc: `docs/sessions/fable-gui-audit-and-spec_r1_2026-08-18.md`. Also filed to
  project knowledge as a ruling.
- **Ruled: portrait treatment C.** Fitted true page as portrait's arrival, one
  tap into a reading aid stripped of all paper dress, one tap back. The
  interstitial is retired. Amends PRODUCT.md's portrait accommodation;
  rotation-as-mode-switch stands.
- **Ruled: NOTATION opens collapsed** (toggles are departures from Grayson,
  intentionally accessed).
- **Ruled: error copy voice** (honest, non-patronizing, next step where
  warranted, case by case).
- **Ratified by eye:** Learn and Guide chapter-opening bands (full-strength
  hue, oversized sans, untouched reading measure below).
- **Mockups:** `docs/sessions/fable-gui-mockup_r1_2026-08-18.html` and
  `_r2_`. r2 supersedes r1's portrait exhibit (r1 wrongly carried the four-tab
  bar into portrait).
- **Audit findings F1 to F9** in the audit doc. Code one-looks, non-blocking:
  F7 auto-name produced the song title `Я` from `Я вас любил:...`; F8 the song
  row still reads as an input. The GUI track still builds nothing before the
  beta line closes unless Dann names the displaced item.
- Not walked: Print, Safari, Fit with a loaded score, calibration.

**Second sitting, same day.** The control census ran (Sonnet,
`docs/sessions/sonnet-memo-control-census_2026-08-18.md`: 92 control templates,
every one with a `path:line` and a disposition; cost overran its bound, stated
in its header). Its 14 open dispositions are now all closed:
`docs/sessions/fable-gui-rulings-2_2026-08-18.md`. The short form: app bar
keeps and re-keys to three destinations; mobile gets one labelled drawer pull,
desktop's lip becomes the bookmark tab
(`docs/sessions/ilya-lip-options_r1_2026-08-18.html`, option A); the pairing
work gets a fifth station named **Underlay** (French not ruled) between Source
and Analysis; the slide operations are kept but demoted to the
**contextual-sentences design** (click a paired note to select it, verbs appear
as plain sentences, one automatic scope, Rotate on multi-select only,
insert-with-ripple rejected, N.55b untouched). Five further dispositions were
taken as stated defaults under tether 13, vetoable by one word. **Before Code
builds:** the E.44 S0 slate needs verifying or ruling, the full French strings
table needs Dann's eyes, Dann owes voice-profile texts and the mobile AI-slop
thread, and Dann names the displacement or the build waits for the beta line.

---

## N.67 STEP 4b IS DONE, 2026-08-18, `cb7a15a`, WALKED BY DANN ON THE DEPLOY

**Songs are plural.** The list, New song, rename, delete with confirmation,
switching, auto-naming, and the neutral-state fingerprint prompt all ship and
were all observed by Dann on `ilya-hg5dr7kl3`, ten steps, every one of them
matching a stated expectation or refuting one on the record.

Memo: `docs/sessions/n67-4b-library-door_r1_2026-08-18.md`.
Brief: `docs/sessions/brief-to-code-n67-4b_r1_2026-08-18.md`.

**What Dann saw.** A song auto-named `Я тебя любил` from its poem alone; the
control fixture uploaded to `5 / 5`; `бил` clicked onto note one to make `4 / 5`;
New song emptying everything and the list growing to two; **the switch back
restoring the score, the metadata, and `4 / 5` with `бил` still on note one**;
a rename surviving a reload; the recognition prompt naming the song by the name
**he** gave it rather than the auto-name; and a delete that took the song and
stayed gone across a reload.

**The vault was already plural and nobody had noticed.** `LIBRARY_STORES`
(`driver.ts:290-301`) has carried `by-updated` and `by-fingerprint` since step 1,
and `driver.idb.test.ts:92-114` already proved two songs coexist. **Every
one-song assumption lived in the application layer**, which is why 4b was
smaller than its description.

**The switch mechanism was decided by measurement, not by argument.** Code
expected `.musx` to be too slow and to need `location.reload()`. It measured the
opposite: **a warm `.musx` switch is 343 ms against a 448 ms reload**, and the
reload additionally throws away the tab, the drawer, the scroll position, and the
loaded dictionary. **`close()` then `open()` with a reactive document slot.**
Whole-gesture, two real `.musx` songs, press to drawn stave including the 175 ms
tab animation: **852 ms**. All Chromium; **Safari is NOT ESTABLISHED**. This
closes design §9.3 for Chromium only.

**`+page.svelte` grew 2,578 to 2,857 lines, 94,571 to 105,544 bytes**, far past
the brief's thirty-line allowance and past the design's own 74 KB warning. The
reason is stated in the memo §3 and is partly real: the page owns the document
slot, the dialog, and the arrival path. **This file is now a standing debt and
the next thing that touches it should shrink it.**

**Four defects the gates could not reach, all found by Code driving a browser:**
an English placeholder under a French UI, a song row that read as a text input,
a New song button whose classes did not apply because Svelte scopes styles per
component, and a dialog focus line firing before its buttons existed, which
would have put focus on the destructive answer.

---

## N.59 TIER 2 IS FINISHED, 2026-08-18. Two Opus Code sessions, both answered NO

**The photograph does not read, the cause is now fully characterised and
quantified, and no further instrument is authorised.** Photograph import stays
in the beta by Dann's ruling of 2026-08-17 and fails with an honest message.
`upload.err.pageReadFailed` no longer asserts a cause. Nothing here changes what
a singer sees.

Both memos are in `docs/sessions/`:
`e60-memo-n59-phase0_2026-08-18.md` and the slice-probe memo.
The design they killed is `e59-design-substrate-decider_r1_2026-08-17.md`.

### 1. PHASE 0 answered NO. The substrate decider is dead

No extent value at any `g` separates true staff rows from contamination. Best
margin **−587 px**, worst **−707**, unchanged at Otsu 118. The one window that
opens requires hand-removing the exact contamination class the decider exists to
reject, and it collapses under a ten-level threshold change.

**Extent inherited coverage's defect rather than curing it.** The design's §3
held that coverage fails because it is not a measurement of what a staff line
*is*. The truth is narrower and worse: **coverage and extent are both row-wise,
and on a warped page a staff line does not live in a row.** The median true staff
row on that page carries **7 % of a system**, 184 px against 2,583.

### 2. THE CAUSE, MEASURED. The deskew was fitted to staff 7, and only staff 7 is flat

Shear runs monotonically **−1.01° at the top to +1.47° at the bottom**, crossing
zero at staff 7. `s` runs **17.00 at staff 1 to 21.00 at staff 12**, monotone.
One staff line on staff 12 occupies **71 page rows**; on staff 7 it occupies 12.
The page is keystoned or curved, as a photograph of a bound book is. Whether it
is keystone, curvature, or lens distortion is NOT ESTABLISHED and needs a second
photograph.

**THE 17 / 19 COLLISION IS SETTLED, and neither measurement was wrong.**
`ENVIRONMENT.md`'s hand measurement of 17.0 is correct for staff 1; the E.59
probe's 19 is correct for staff 7, the band it measured. **The page varies by
region.** The run-length estimator's "smear" (19:2973, 18:2626, 21:2216,
20:2162, 17:1213) was never noise: it is the page's real `s`-distribution and its
peaks are its regions.

### 3. THE SLICE PROBE answered NO, on three independent grounds

Slicing the projection instead of flattening the page. The instrument had already
passed both controls inside Phase 0, so it was worth one session.

**Ground one, grouping.** Candidate generation worked: the tracker delivered 12
staves and 1,271 rows, cut into exactly twelve groups, one per real staff. Then
line grouping collapsed five lines into one on ten of them, group sizes
`[1,1,1,1,1,5,5,3,1,1,1,1]`. **On staff 12 line 2 begins 48 rows before line 1
ends.** No proximity rule separates lines that overlap in row space.
**Only the two staves within ±0.12° of flat survived, which are the two the
existing deskew was fitted to.**

> **THE NUMBER THE PROJECT WAS MISSING: line grouping needs |shear| ≲ 0.12°, and
> that page carries 2.48° end to end.** Any fix must cut shear roughly twentyfold.
> That is a dewarp, and a dewarp is a project, not a probe.

**Ground two, the fixture corpus. FORECLOSED: 0 of 23 pages survive.** Ten raise
outright, thirteen move line positions 1 to 3 px, two change staff count. The
ten raises are not shear, they are clean renders: **the comb matcher over-detects
on a clean page**, finding 9 to 12 combs where stock finds 6 to 10, because
**lyric baselines form five-line combs.** Phase 0 listed that as a way the
instrument could lie; the corpus proved it does. It was not tuned away, because
raising the threshold to suppress it is fitting against the test set.

**Ground three, cost.** **16.1× on fixtures, 58.8× on the photograph, 17.1× on
the control**, against a recorded envelope of 1.96 to 2.36 s per page. A singer
on a phone pays that.

### 4. TWO FINDINGS THAT OUTLIVE THE PROBE, AND ARE DANN'S TO RULE

**`K_S = 0.9737` is calibrated to Verovio renders and to nothing else.** It would
raise on **59 of 60 correct rows** on the photograph, at every `g`. It also went
from 0/40 to **11/40** on the control under a 3 px shift in line positions. The
sentinel is a render-envelope tripwire, and it has never been tested against any
other class of input.

**THE THREE 1.000 PAGES ARE UNDEFINED ANYWHERE IN THE TREE.** Fable's tier-1
gate is referenced in the design documents and cannot be run as specified,
because no document names which three pages they are. **A gate that cannot be
run is not a gate.** Found 2026-08-18 while trying to run it.

### 5. What was NOT built, and what is not authorised

No dewarp. No change to `substrate.py`, `K_S`, or `g`. `reader.py` unmodified.
Both sessions left the tree clean. **Nothing about Pyodide was established by
either session**; every number is desktop, at numpy 2.2 to 2.4 and cv2 4.11 to
5.0, and the browser is cv2 4.9.0, numpy 1.26.4, 32-bit.

**n = 1, unchanged.** One page, one photograph, one photographer, one book.

---

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

### The blocking set: TWO, plus one ruling

**Was THREE until 2026-08-18. N.59 left the blocking set by being answered, not
by being finished.** Its tier 2 is parked with a measured reason; see above.

| | item | state |
|---|---|---|
| `[ ]` | **N.67** the save function | **FIRST, by Dann's ruling 2026-08-16.** Designed in full by Fable, E.52. Seven steps, 0 through 6. **Steps 0, 1, 2, 3, 4a, 4b, and step 5's single-song half CLOSED**, all observed in a real browser, and 3, 4a, 5's half, and 4b walked by Dann himself. **The emergency is over and songs are plural.** **4b CLOSED 2026-08-18 `cb7a15a`, walked on the deploy: list, switch, New song, rename, delete, auto-naming, and the neutral-state fingerprint prompt.** What remains: **step 5's remainder** (export-all, multi-song import, the collision rules) and **step 6** the sweep. See the section above and the four documents below |
| `[ ]` | **N.72** no singer can ever receive a fix | **MINIMUM FIX BUILT, awaiting Dann's three-surface walk.** `static/sw.js` carries `__BUILD_VERSION__`, and `apps/web/scripts/stamp-sw.mjs` stamps SvelteKit's per-build version into `build/sw.js` after `vite build`. **The script exits non-zero if it cannot stamp**, because a silent failure would ship the placeholder and reproduce the bug while the build looked healthy. **PROVEN LOCALLY, with a positive control:** a stamped worker makes the browser INSTALL a new one (`registration.waiting` becomes non-null, a second cache appears); the old byte-identical worker NEVER does (`waiting` stays null, one cache). **NOT PROVEN LOCALLY: that the new code is then served.** A static server cannot honestly imitate two Vercel deployments, and three separate harness faults were found trying (a grep matching its own comment text, `cp -R` preserving mtimes so revalidation returned 304, and a build marker that never reached the bundle). **WALKED BY DANN 2026-08-16, Chrome on the desk: the new build arrived after ONE RELOAD**, better than the predicted close-the-tab, and it measured the case that matters, one stamped deploy to the next. **Why it was that quick rather than needing a close is NOT fully accounted for**, and is recorded as observed rather than dressed up as predicted. **NOT WALKED: Chrome on iPhone**, left for another day. **NOT APPLICABLE: the home-screen install.** Chrome on iOS offers no Add to Home Screen, and `InstallPrompt.svelte:48` already excludes `CriOS` and `FxiOS` so Ilya never asks for it. The path exists only in Safari, which Dann does not use. **A singer on Chrome for iPhone can therefore never install Ilya, which is now a known fact rather than a guess, and is Dann's to rule on.** DELIBERATELY EXCLUDED by Dann's ruling: `skipWaiting`, `clients.claim`, the update prompt |
| | | **The finding, as established 2026-08-16:** **ESTABLISHED by reading `static/sw.js`:** `CACHE_VERSION` is the literal `'ilya-v1'` and never changes, so every deploy ships a BYTE-IDENTICAL service worker and the browser never installs a new one; there is no `skipWaiting` and no `clients.claim` (zero occurrences); and the catch-all is `return cached || networkFetch`, so a cached `/` is served STALE and refreshed only for the next load. **Also established:** every deployment is its own frozen origin, so on a sha-pinned URL no reload can ever deliver a newer Ilya. **NOT ESTABLISHED:** the iPhone home-screen case, which cannot be driven from here, and the branch-alias two-reload behaviour, which needs two builds to observe. **Why it matters: Dann does not feel it because he scans sha-pinned URLs. Every singer on a stable URL or a home-screen install would never receive anything shipped tonight.** **The fix, one line:** derive `CACHE_VERSION` from the build so each deploy ships a different worker, add `skipWaiting` and `clients.claim`, and serve navigations network-first rather than stale. **Cost:** roughly fifteen lines in `sw.js` and an hour, of which most is verification, because it can only be proven on a stable URL across two deploys and on a real home-screen install. **Dann to rule where it sits against N.58 and N.59** |
| `[ ]` | **N.58** MIDI import | **"cheap" does not hold. Real scope NOT ESTABLISHED.** A scoping brief for a fresh Sonnet session was written and delivered to Dann 2026-08-14. **Whether he has run it is unknown. Ask before writing a second one** |
| `[~]` | **N.59** the reader in the browser | **TIER 2 CLOSED 2026-08-18, ANSWERED NO, two Opus Code sessions. THE ONE THING above carries the whole account and its numbers.** Phase 0 killed the substrate decider, best margin −587 px; the slice probe died three times over, on grouping, on the fixture corpus (0 of 23), and on cost (16 to 59×). **Line grouping needs \|shear\| ≲ 0.12° and the photograph carries 2.48°.** The only instrument left is a dewarp, which is a project and is **NOT AUTHORISED**. **PARKED AT TIER 2. What a singer sees is unchanged:** photograph import stays in the beta and fails honestly, Dann's ruling 2026-08-17. **STILL OPEN INSIDE N.59: step 3, the brace rule, is `WRITTEN` and not `DONE`.** **INCREMENT 1 DONE `0573c10`, WALKED BY DANN. Step 8 (PDF, `pdfjs-dist`) ruled in and done.** Pyodide v0.26.4 pinned from the jsdelivr CDN, cv2 4.9.0 / numpy 1.26.4 confirmed in a browser; matplotlib added because `envelope.run` needs it and the spike never did; both Leipzig caches committed at `tools/e16-harness/reader/fonts/` so no Node and no Verovio ship; the brace rule replaces `select_vocal` **but has never once fired, and returns the PIANO on piece 06, so step 3 stands WRITTEN**; `pieceId` and `measures_per_system` derived; `midiAssumedNatural` additive; `recognized-to-musicxml.ts` joins at the existing ingest seam; the two questions and the read report live in the drawer; the greyscale ink and the singer's answers persist and restore without re-asking. Load 3.36 s, `envelope.run` 1.96 to 2.36 s per page. **`ENVIRONMENT.md` §THE PAGE READER carries every measured number and every trap.** ~~Pyodide, not a rewrite. PIN THE VERSIONS.~~ Stand the eleven-module reader up under Pyodide with cv2 4.9.0 / numpy 1.26.4; ~~replace `rest_templates.py`'s Node-and-Verovio shell-out with Verovio WASM~~ (STRUCK E.57, see below); swap `reader.py:269-278`'s five-line staff heuristic for Dann's brace rule. **CORRECTED E.57: NEITHER Verovio shell-out is replaced.** `rest_templates.py` and `timesig.py` each shell out to Node, and each `load_font` returns the parsed JSON on a cache hit BEFORE any subprocess is reached, so the browser needs two committed cache files and no Verovio WASM at all. Metre ships free on the same finding. Measured floor 2.9s load, 0.867s per page. Spike at `~/Downloads/ilya-reader-spike.html`. `claude/e43-n59-the-reader-in-a-browser_2026-08-12.md` |

### Closed and parked

| | item | state |
|---|---|---|
| `[x]` | **N.70** the iPhone cannot load a score | **CLOSED 2026-08-16, `58f982c`, WALKED BY DANN ON HIS OWN IPHONE.** iOS matches `accept` by registered type and knows none of `.musicxml`, `.mnx`, `.musx`, `.mscz`, so it greyed out every format Ilya reads while leaving PDFs and photos selectable. **Dann's fix, better than either option offered: filtered list on desktop, no `accept` at all on mobile** (`ScoreUploader.svelte`, `acceptList`). Measured: attribute present at 1400 px, absent below 768. **What Dann saw:** the file that was grey at 03:08 was black and selectable at 03:52, as was an unrecognised `.com` file in the same folder |
| `[x]` | **N.71** the note click | **CLOSED 2026-08-16. Fix shipped in `046beec`, walked by Dann on the `58f982c` deployment.** The notehead glyph was painted over its own `[data-hit]` rectangle and still interactive, so a click on the note died; every `<g data-event-id>` is now `pointer-events="none"` and the rectangle takes clicks back with its own `all`, plus `cursor="pointer"`. **What Dann saw:** a click DEAD CENTRE on the first notehead, the exact spot that did nothing an hour earlier, gave `4 / 5` with бил under it. Two tests pin both halves |
| `[x]` | **N.68** the upload that erases placements | **CLOSED 2026-08-16, `6c0c719`, WALKED BY DANN on the real deploy.** Absorbed into N.67 and fixed by architecture, not patched: `mergeOnUpload` (`pairings.ts`) keeps the map by positional key, runs `firstPass` only into an empty map, reports orphans, and never rebuilds. **What Dann saw:** he moved бил onto the first note (5/5 to 4/5, Я turned black), re-uploaded the same score, and the counter stayed 4/5 with бил still on the first note. Positive control run first: the old code snapped back to 5/5 |
| `[x]` | **N.55b** Click Assignment | **DONE AGAIN 2026-08-16, and the history is kept on purpose: it was marked DONE 2026-08-13 while its central gesture was broken**, and it stayed that way until Dann walked it 2026-08-16: clicking a notehead did nothing, because the glyph was painted over its own hit rectangle and still interactive. **Dann's ruling: the tracker should be right rather than tidy.** Repaired and closed as N.71, walked by Dann. Rotate syllables PARKED 2026-08-14 |
| `[~]` | **N.56** draw the withheld page badly | PARKED 2026-08-14, Dann's ruling |
| `[x]` | **N.32** the Guide's false claims | DONE, shipped and observed 2026-08-14 |
| `[x]` | **N.55a** the score with no underlay | Closed 2026-08-13 |
| `[x]` | **N.47** print, from a phone, once | CLOSED 2026-08-15 |
| `[x]` | **N.69** print takes the paper | CLOSED 2026-08-15, six passes, observed on paper |

### The visible list. Built only if a day finishes early

**N.62** · **N.63** · **N.45's remainder** · the **French colon spacing** (eight
sites, mechanical) · **N.51** · **N.17** · **N.19** · **N.61** · **N.6**.
**N.27 now has a home:** Fable's step 6 routes `profileStore.saveStore` through
the library module's reporting seam. **N.28** ships on N.67's step 5 binder.

---

## N.67. THE FOUR DOCUMENTS, ALL IN THE REPOSITORY

**They are in `docs/sessions/`, not in project knowledge. Read the design first;
the other three are context.**

| file | what |
|---|---|
| `e52-fable-save-design_r1_2026-08-16.md` | **The design.** Architecture, what a saved song is, migration, failure handling, the binder, the weight, the build order, the copyright answer |
| `e52-fable-save-socket_r1_2026-08-16.md` | **The seam.** Options compared, the recommendation, multi-tab, and step 0 |
| `e52-fable-save-retention_r1_2026-08-16.md` | **File handling.** What is kept per input kind, and at what fidelity |
| `e52-brief-to-fable_r1_2026-08-16.md` | The brief they answer. Its §3 is a verified inventory of the tree as of `fd1f628` |

**The headline, so a session knows what it is walking into.** A saved song is
everything the singer supplied for one piece under one permanent random id, in a
new IndexedDB database **`ilya-library`**, separate from `loader.ts`'s
**`ilya-data`** because that one is pinned at version 1 and upgrading it would
break the dictionary. Continuous save, no button. Every failure visible. Export
is a `.ilya` **binder**, a ZIP built by promoting the tree's own test-fixture ZIP
builder, so **zero new dependencies and about 8 KB of bundle.** Uploads merge by
the positional event ids; only an explicit *Start placement over* rebuilds.

**Fable's recommended socket:** a rune-bearing `SongDocument` class in
`lib/library/document.svelte.ts`. **Built, E.53.** The restore race documented
at the old `+page.svelte:94-99` is impossible by construction and its guard flag
is deleted, not moved.

**Multi-tab:** `BroadcastChannel('ilya-library')` after each committed write. A
clean tab reloads, a dirty tab keeps the singer's work and shows one notice.

### Three corrections to the addendum, measured E.53

- **§7.1 is settled, and it split in two.** A `.svelte.ts` rune module compiles,
  type-checks, and builds with **no configuration work**. But **§5 is wrong that
  `flushSync` drives its effects in a test**: runes are INERT under this vitest
  suite. See `ENVIRONMENT.md`, "Runes under vitest." All logic therefore lives in
  the plain-TS facade, and `document.svelte.ts` holds only fields, the factory,
  and the teardown.
- **§4.4's `{#if doc}` is not needed.** `+layout.ts` sets `ssr = false`, so there
  is no hydration pass. Step 0 built the document synchronously at component
  init; step 1 moved the read into `+page.ts`'s load function, which runs before
  the component exists. Either way the page never holds a `null` document.
- **§3's blast-radius numbers were `grep -c`, which counts LINES, not
  occurrences.** The real figure was 44 compiler-named references, 8 shorthand
  props, and 7 deletions, and it omitted `openSyllabification`, which its own §1
  lists as a document field.

---

## RULED IN E.54, 2026-08-16

- **`fake-indexeddb` is IN**, on Dann's condition that its registry facts be
  checked first: **6.2.5, Apache-2.0, zero runtime dependencies, 4.63 million
  weekly downloads, last published 2025-11-07.** Dev-only, zero shipped bytes.
  **His reason, which is the durable part: the five gates are what protect a
  ship, and a Playwright lane outside them protects nothing automatically.**
  Confirmed against `ilya-ship.sh:76-80`, where `test:e2e` is indeed not a gate.
- **The `storage.otherTab` French was shown to Dann before it shipped.**
  `'onglet'` and `'chant'` are adopted, ordinary words. Nothing coined.

## RULED THIS SESSION, 2026-08-16

- **N.67 goes first and displaces N.58 and N.59.** Dann. Not re-openable.
- **The retention rule, ratified verbatim by Dann.** It NARROWS his own earlier
  *store what a human supplied*, and the narrowing was named rather than
  smuggled:
  > *Store what a human supplied: notation byte for byte, and a picture as its
  > ink, in greyscale at no less than the reader's working resolution with
  > margin, with the original's name and hash recorded whether or not its bytes
  > are kept.*
- **Never binarise a stored page.** Fable overruled the coordinator here.
  Turning grey into black-and-white is the extractor's own first derivation, and
  doing it early and permanently destroys what a better reader would need. Its
  precedent is the Xerox JBIG2 substitution incident. The checkable floor is
  **greyscale, interline at least 20 px, retained near 28 to 30**, expressed in
  staff-line spacing rather than DPI so it survives different page sizes.
- **`.musx` is kept byte for byte**, not as its conversion. 64 to 146 KB is no
  weight problem, the WASM ships regardless, and storing the conversion would
  freeze the song at today's converter.
- **Conversion is silent.** No mark on the page, ever. The original's hash and
  the rendition parameters live in the record and the binder, and one sentence
  goes in the Guide.

---

## N.67 STEP 4, SPLIT BY DANN 2026-08-16

**Step 4 does not go whole and does not wait whole.**

- **4a, CLOSED `d79020d`, WALKED BY DANN 2026-08-16.** He saw the warning name 3 of his 5 placements, chose Replace and got a coherent new song, then repeated and chose Keep and got his original back untouched, `5 / 5`, Я вас любил. **The chimera warning.** Ilya can now tell that a different piece
  has arrived and says so. Where the singer proceeds, the WHOLE song is
  replaced together, title, source, and placements, so the record is coherent.
  One song at a time, honestly.
- **5, SINGLE-SONG HALF CLOSED `23c05e1`, WALKED BY DANN 2026-08-16.** Export
  one song, restore a one-song binder into an emptied library. **What Dann saw:**
  the file downloaded as `test fixture, Я вас любил.ilya`, named from the score
  header with the Cyrillic intact; he cleared site data in DevTools; and after
  Import a song the whole song came back, including the five-note stave with
  Я те бя лю бил under it. Measured alongside: 1,757 bytes of score, five
  placements, five hit targets drawn.
  **Export-all, multi-song import, and the collision rules stay with 4b.**
  **NOT WALKED: the cross-device half.** Dann could not locate the `.ilya` on
  his phone, and the blocker is file transfer rather than Ilya. Worth doing,
  not worth an errand at five in the morning.
- **One absence that is NOT a bug, so nobody chases it.** After an import the
  SYLLABLES station is empty until the singer presses Transcribe: the station
  needs the pipeline to have run and a reload does not run it, which is the same
  reason `keepSurvivingGlosses` waits for the next Transcribe. The syllables
  UNDER THE NOTES come from the stored placements and appear immediately.
- **A DIVERGENCE FROM §8, ON DANN'S RULING.** Design §8 says "the UI copy says
  backup", and it argues the export sits on s. 29.24 backup grounds. **The
  buttons say "Export this song" and "Import a song" instead**, because a legal
  term belongs in prose a singer reads rather than in a button they press.
  §8's framing now lives in the GUIDE, in both languages, naming the threat it
  actually argues: a lost phone or a cleared browser.
- **4b, CLOSED `cb7a15a` 2026-08-18, WALKED BY DANN.** The list, rename, delete,
  switching between saved songs, New song, auto-naming, and the neutral-state
  fingerprint prompt. That is the feature, it is what makes songs plural, and it
  is not what ended the chimera. Full account in the section above.

**Two things the walk found that the harness had not.** The dialog rendered at
the viewport's top-left, because `app.css:88-94` resets `margin: 0` on every
element and that overrides the user-agent's `dialog { margin: auto }`, which is
what centres a modal. Measured before the fix at (0, 0) and after it at (444,
357) in a 1400 by 900 viewport. **My checks had read the dialog's state and text
and never once looked at where it landed**, which is tether five exactly. The
second is now RULED AND FIXED: the destructive button sat rightmost, where macOS
puts the safe default, and both carried the same weight. Replace is borderless
and unfilled, findable rather than inviting.

**CORRECTED 2026-08-18 AGAINST THE TREE, WHICH WINS.** This paragraph used to
say "Keep is now visually rightmost while staying FIRST in the DOM," and cited
Keep at x=825 against Replace at x=698. **That is not what ships, and the error
propagated into the N.67 4b brief before anyone checked it.** The shipped answer
is the opposite and is better: **DOM order IS the visual order**, so Keep is
**LAST in the DOM and rightmost**, focused programmatically on open, and a screen
reader and a sighted singer are told the same thing. `row-reverse` is gone. Read
in the file this session: `+page.svelte:1646-1649`, `:753-765`, `:2172-2174`.
**A stale comment at `+page.svelte:1612-1613` still carries the old wording and
contradicts `:1646-1649` in the same file. Repair it the next time that file is
touched.** Dann confirmed the shipped geometry on the deploy 2026-08-18: the
delete dialog is centred, the destructive answer is leftmost and unfilled, and
Keep this song is rightmost and carries the focus ring.

**The trigger, decided by Claude on Dann's instruction: the fingerprint differs
AND at least one placement would be orphaned.** A corrected note keeps every
position, so nothing is orphaned and nothing is asked, which is design §2.4's
own promise kept. **A pitch-proportion test was considered and REJECTED**: a
transposed edition changes every pitch while keeping every position, and in
vocal repertoire that is a common, legitimate re-upload where placements must
survive; the rule would fire on it at nearly 100%, indistinguishable from a
different piece. **The named miss that remains:** a different piece whose rhythm
matches the old one note for note across a whole score orphans nothing and
passes silently. That shape is an artefact of small fixtures, not of repertoire.

**Does 4a break §2.6?** No, it narrows it. §2.6's rule is "an upload never
destroys placements; only the singer does, on purpose", and 4a destroys them
only on a yes, the same shape as the *Start placement over* control §2.6 already
names. **Fable's own neutral-state branch cannot be had without 4b**: it ends in
"a new song is created", which needs a second reachable record.

## WHAT A SECOND SCORE DID BEFORE 4a. Measured at `5c9c7f3`, not modelled

**Walked in a browser: score one, then a structurally different score two,
reading `ilya-library` after each.**

- **Nothing is orphaned and nothing accumulates.** One record, one source, one
  id, one `ilya:activeSongId`, before and after. Storage is clean.
- **But song one is OVERWRITTEN IN PLACE.** Its title and its stored score file
  become score two's. Its placements survive onto music they were never made
  for, and **two of five silently landed on notes of the new piece**, because
  event ids are positional. The drawer reported *"3 placements have no note in
  this score. They have been kept."* and the counter still read `5 / 5`.
- **Why: §2.6 has TWO upload branches and only one is reachable.** "Upload into
  the open song" is built (step 3). "Upload from a neutral state (no open song,
  or the singer pressed New song)" cannot occur, because there is always an open
  song and there is no New song control. **A singer has no way to say "this is a
  different piece."**
- **The design's rule holds literally**: an upload never destroys placements.
  Nothing in it protects the SONG.

**Does step 5 depend on step 4?** Partly, and the split is sharp. **Works
single-song:** export one song, and restore a one-song binder into an emptied
library, which is the eviction fire escape §8 justifies. **Needs step 4:**
"unknown song id, imported whole" while keeping the current one; "keep both",
which re-ids the incoming copy and is plural by definition; and any multi-song
binder. The binder is not blocked by step 4, but everything that makes it a
LIBRARY backup rather than a SONG backup is.

## OWED, RULED BUT NOT YET DONE

- **TWO DOCUMENTS FROM 2026-08-17/18 LIVE IN PROJECT KNOWLEDGE, NOT HERE.**
  Nothing else in this folder names them and a session that does not read this
  line will never find them.
  - `claude/gould-beams-delta-pp16-25_2026-08-18.md` — Gould rules 245 to 284,
    Ground Rules pp. 16 to 25, closing v7's gaps item 1 beam pages. **Two
    independent readings, cross-checked.** One flat contradiction on p. 18's
    three-beam rule is recorded UNRESOLVED; do not implement three-beam outer
    placement from it. Four diagram numerals remain unverified.
  - `claude/ruling-semantic-stems-vs-gould-priors_2026-08-18.md` — **Dann's
    ruling: an engraving convention is a PRIOR, not a law.** His Appendices
    assign stem direction a semantic function, stems up for close timbre and
    stems down for open. A Gould prior may bound a DIMENSION; it may not decide
    a MEANING; where a score carries a legend, the legend outranks Gould.
    **This is a constraint on N.59 tier 3, not on tier 2.**
- **Trace `stem_dir`'s consumers in the reader.** `beams.py:264-265` computes
  it and `:310` carries it into the note record. **Whether any stage treats it
  as evidence is NOT ESTABLISHED.** If one does, it is a defect against Dann's
  own scores, which a photograph of Ilya's own output would expose.
  `beams.py:133` reads "S5: one rule, both directions, no directional term",
  read out of a grep and not in context; confirm it.
- **`staff-renderer.ts`'s `positionalUp` now has its citation.** v7 records that
  the helper's beamed-group stem direction is an inference derived from a chord
  rule. Gould p. 24 states it for beams directly, confirmed by both readers:
  the note furthest from the centre of the stave dictates the group's stem
  direction. **Apply the citation the next time that file is touched.**
- **The Gould re-shoot, four spots, would settle every open number.** p. 18's
  three-beam paragraph, and the small diagram numerals on pp. 16, 19, and 21.
- **Step 5's export, single-song half.** Established 2026-08-16: exporting one
  song and restoring a one-song binder into an emptied library both work without
  the list. It is the only thing that would give the chimera warning a detour
  instead of a stop sign. **Dann's ruling: deferred, recorded as owed against
  step 5, NOT folded into 4a.**
- **Remove `bits-ui` from `apps/web/package.json`.** Ruled 2026-08-16: native
  `<dialog>` + `showModal()` is the answer for the delete confirmation AND the
  fingerprint prompt, not bits-ui. **Dann's ruling on timing: not in step 4's
  commit.** It costs zero bytes while nothing imports it, so removing it is
  hygiene, not weight, and it is a lockfile operation. **Do it clean, on its own.**
  Measured before the ruling: one `AlertDialog` cost **+18.7 KB gzipped**
  (392,547 to 411,292), against Fable's ~8 KB budget for all of N.67.
- ~~`InstallPrompt.svelte:83`'s false `role="dialog"`~~ **DONE 2026-08-16**,
  Dann's ruling. It is a bottom banner, not a modal, and `showModal()` would
  have trapped a singer inside an install suggestion. Now `role="region"`, which
  keeps the `aria-label` exposed where a bare div would have dropped it.

## RULINGS DANN OWES. Ask one at a time, at the right moment

### New from N.67 step 4b, 2026-08-18. Four, all small, none blocking

- **Boot does not transcribe; a switch does.** Switching songs runs the pipeline
  and draws the transcription; a reload leaves the poem sitting there until the
  singer presses Transcribe. Code named the asymmetry in its memo §6.4 and asked
  which way to close it. **Observed on the deploy 2026-08-18 and confirmed:** the
  reload after the delete showed the poem present, the dictionary loaded, and
  nothing drawn. **Recorded honestly: the coordinator claimed the opposite from a
  pair of screenshots twenty seconds apart, which could not distinguish Ilya
  transcribing from Dann pressing the button, and had to withdraw it.**
- **A song named from its poem never picks up a better name from the score.**
  Memo decision 6.1: the name is written the first time there is material to
  build one from, and is the singer's from then on. Observed: a song auto-named
  `Я тебя любил` from the poem kept that name after a score arrived carrying
  `Я вас любил` and a composer. The rule cannot tell "Ilya guessed" from "Dann
  chose." Rename fixes it in one gesture, so this is a preference, not a defect.
- **The door is on the Transcription tab only.** The Fit tab has the twinned
  binder row by Dann's ruling of 2026-08-16 but no song list, so switching songs
  while working on a score means changing tabs. Code says twinning it is six
  lines and did not do it because the brief named one place.
- **Pressing Delete on a song you are not in appears to switch you into it before
  it asks.** Observed on the deploy: the open song was `Pushkin, control fixture`
  and the dialog opened over an emptied drawer with `Untitled` marked open.
  **NOT ESTABLISHED whether the Delete press caused it or Dann clicked the row
  first; he was asked and the walk moved on.** If Delete does move the singer,
  choosing Keep leaves them somewhere they did not ask to be. Nothing is lost,
  because saving is continuous.

- **The sage rules print faint in greyscale.** `--sage` is `#8B9A7D`
  (`app.css:33`), about 58% relative luminance, and print swaps `--paper-cream`
  for pure white. Three levers: leave it; darken `--sage` globally, which keeps
  print identical to screen; or darken at print only, which breaks the WYSIWYG
  principle he set in E.51. **Nothing depends on it.**
- ~~`pdfjs-dist`, for N.59 step 8~~ **RULED IN 2026-08-16, Dann: an enthusiastic
  yes.** Registry facts checked first, as he required for `fake-indexeddb`:
  6.2.108, Apache-2.0, zero runtime dependencies, 20.4 million weekly downloads,
  last published 2026-07-28. Built, walked by me, not yet by him.
- ~~THE PHOTOGRAPH COPY, and whether photographs belong in the beta~~ **RULED
  2026-08-17, Dann: photographs stay in the beta, and the copy was corrected in
  the same session. Both languages approved before either was written.**
- ~~Fable's six ratification items of 2026-07-24~~ **RULED 2026-08-17, Dann:
  items 1 and 2 ratified (T3 fence, T4 third precedent class). Items 3 to 6
  concern that session's build balance and wording; whether they were
  satisfied is NOT ESTABLISHED and none blocks anything.**
- ~~Which of N.58 and N.59 is next~~ **RULED 2026-08-16: N.59.** Increment 1
  shipped and was walked.
- **A singer on Chrome for iPhone can never install Ilya to the home screen.**
  Chrome on iOS offers no Add to Home Screen and `InstallPrompt.svelte:48`
  already excludes `CriOS` and `FxiOS`. Established by reading, carried over
  from N.72 where it was named and never ruled.
- **N.63.** Killing the interstitial is ruled; **where the honest residue goes is
  not.** Asked in E.45, still unanswered.
- **N.45's remainder.**
- **The French question mark.** Eleven strings carry U+00A0 before `?`.
- *(Not yet: what a deliberately empty note draws.)*

---

## THE SCHEMA. It has survived ten sessions

1. Only blocking work gets built.
2. **A new cardinal displaces a named one or waits. Say which.**
3. Half of every build day is reserved for what the previous day's walk found.
4. Every build day ends in a deploy and a walk.
5. N.48 may be unclosable; it needs a `[u]` that fails.

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

**This same walk is N.67 step 3's observation**, with the expectation stated
before the walk: re-uploading the control over placed syllables no longer erases
them.

**The print fixture, E.51.** Marshak's Russian of Shakespeare's Sonnet 90, under
Kabalevsky op. 52 no. 9, fourteen lines. **It fills exactly two letter sheets.**

---

## RULED 2026-08-16, ON E.55'S WALK FINDINGS

- **The walk's findings come before N.67 step 4**, per the schema's own rule
  that half of every build day is reserved for what the previous walk found.
- **N.70 and N.71 are numbered. The third finding, no cursor on a note, is
  FOLDED INTO N.71** rather than tracked: one CSS declaration on the same
  element as N.71's fix.
- **N.55b's row is corrected rather than left tidy**, Dann's words.
- **The N.70 fix is Dann's own third option**, better than either I posed:
  filtered on desktop, no `accept` at all on iOS. Named consequence, accepted:
  the tree's `isMobile` is a WIDTH test, so a narrow desktop window also gets
  the unfiltered picker.

## STILL UNSETTLED. Not yours to settle alone

- **Where the storage notices belong.** They render in the FIT drawer only, so a
  singer working in Transcription never sees a save failure or the two-tab
  notice. Inherited from when they were pairing notices; not moved in E.54
  because moving them is a placement decision, not a build step.
- **The three storage strings still say "syllable placements"** and the save is
  now the whole song. Design §7 puts that copy in step 6, with the French shown
  to Dann first, so it was left alone rather than rewritten twice.

- "The page carries no chrome." · "Do not introduce a slider."
- **N.51:** whether per-tab colour may propagate past the tab bar.
- Whether `claude/shane-project-map_2026-07-25.md` is stale. **Unopened for
  twelve sessions.**
- **D3's Job A**, per-verse reprints, ruled in E.36 and still unnumbered.
- **The per-format score arrival audit**, asked for in E.45 and never written.
- **`stripBackingRect` matches `fill="#FFFFFF"` while `staff-renderer.ts` paints
  `#F0EBE0`.**
- **The marks on the printed page.** E.51's prints carry a dashed `VERIFY` box
  and a `USER OVERRIDE` badge on paper. CONTRACT §6 forbids a mark that says Ilya
  is unsure. **Whether these are the ruled exception was not checked.**
- **`VoiceProfilePane.svelte:295-313` duplicates the old header arithmetic.**
  Fit's paper does not yet share the Transcribe paper's single `HEADER_GAP`.
- **Whether `.mscz` ingest actually succeeds in a browser.** The path is live in
  code (`ScoreUploader.svelte:106-137`) but `i18n.ts:272` still carries a
  "coming soon" string for it. Nobody has run it.

---

## Register corrections owed

`claude/ILYA-REGISTER_2026-08-11.md` is at revision 10 and needs revision 11.
Its N.55a row is FALSE (N.55a is CLOSED). It says "ten cardinals" over a list of
twelve; **five actually remain and none is in the tree: N.1, N.2, N.3, N.18,
N.21.** Its N.55b row is stale. **The blocking number is now THREE.**

**Or fold the register into this file and retire it.** It is the last piece of
canon still living in project knowledge.

---

## Log

| date | what changed |
|---|---|
| 2026-08-18 | **`cb7a15a`: N.67 STEP 4b SHIPPED AND WALKED BY DANN. SONGS ARE PLURAL.** `songs.ts` (227 lines, 35 tests), `SongList.svelte` (265), a `PluralStore` hung off `StorageDriver` as an optional property so the legacy driver can decline it, `name` made `$state` so a rename reaches the vault, and `backfillName` at boot because `SongRecord.name` had existed since step 0 with **nothing ever writing it**. Gate 4's baseline moved 555 to 590 with Dann's permission. Ten walk steps on the deploy, all matching a stated expectation or refuting one on the record. |
| 2026-08-18 | **THE SWITCH MECHANISM WAS SETTLED BY MEASUREMENT AND THE PREDICTION WAS WRONG.** Code expected `.musx` to be too slow to switch in place and to need `location.reload()`. Measured: **warm `.musx` switch 343 ms against a 448 ms reload**, `.musicxml` 49 ms against 97, vault read 0.2 ms. The reload is both slower and loses the tab, the drawer, the scroll position, and the dictionary. **`close()` then `open()`.** Design §9.3 is closed for Chromium and **still open for WebKit**. |
| 2026-08-18 | **THE VAULT HAD BEEN PLURAL SINCE STEP 1 AND NOBODY HAD LOOKED.** `by-updated` and `by-fingerprint` were defined at `driver.ts:290-301` and `driver.idb.test.ts:92-114` already proved two songs coexist and that a song is findable by fingerprint. **Every one-song assumption lived above the vault**, in `index.ts`, `document.svelte.ts`, and `+page.svelte`. An inventory read before the brief was written is what found it, and it made 4b smaller than its own description. |
| 2026-08-18 | **A MEMO'S SUBSTANCE CAN BE RIGHT WHILE ITS CITATIONS ARE WRONG.** The 4b memo correctly reported that the shipped dialog puts the safe answer last in the DOM, and cited `+page.svelte:1381-1384` and `:1347` for it. Those lines are the tab-change handler and a metadata function. **The real citations are `:1646-1649`, `:753-765`, and `:2172-2174`, found only by opening the file.** The same check found that `STATE.md` itself had carried the false version, and that a stale comment at `:1612-1613` still does. |
| 2026-08-18 | **`+page.svelte` 2,578 to 2,857 lines, 94,571 to 105,544 bytes.** Far past the brief's thirty-line allowance and past the design's own 74 KB warning. Recorded as a standing debt rather than argued away. |
| 2026-08-16 | **E.58: N.59 step 8 built, and the NaN that crashed Dann's own photograph guarded.** `pdfjs-dist` 6.2.108 ruled in by Dann, pinned exactly, lazy: **up-front JS for a singer who never drops a PDF is 30,546 bytes gzipped**, and pdf.js's 612 KB sits entirely in chunks that load on demand. A true vector PDF reads end to end at s = 29.0. `detect_staves` now raises its own `RuntimeError("no staff lines")` instead of leaking a NaN four frames into `beams.py`, and a Cardoso and Rebelo run-length fallback supplies a finite `s` on a rotated page. Gates 552 to 555. |
| 2026-08-16 | **A BUG IN MY OWN FIX THAT NO LOCAL RUN COULD SEE.** `np.bincount` on an int64 array works on 64-bit desktop numpy and **throws under Pyodide, because WASM is 32-bit and `np.intp` is int32**. Every Python proof passed; the browser found it on the very page the fallback exists to rescue. **The lesson is E.54's again: drive a real browser, the gates and the local runs structurally cannot reach this class.** |
| 2026-08-16 | **THE SAME MUSIC READS DIFFERENTLY AT DIFFERENT RESOLUTIONS, measured.** Musorgsky 01 page 1 gives 78 notes at s = 21 from a PNG and 79 notes with one pitch abstention at s = 29 from a PDF of the same engraving. E.43's 37-against-36 precedent, seen again from the other direction. A read is not reproducible across resolutions and must not be described as if it were. |
| 2026-08-16 | **The run-length estimator is sharp on a render and soft on a photograph, and the difference is the finding.** The fixture gives a single peak at 21 (6,895 against 2,090). Dann's photograph gives a smear across 17 to 22 with no dominant peak, mode 19, against a hand measurement of 17.0. Reported rather than reconciled. |
| 2026-08-16 | **E.58: `0573c10`. N.59 INCREMENT 1 SHIPPED AND WALKED BY DANN.** Steps 1 through 7. A photograph now becomes a score: Pyodide runs the eleven-module E.16 reader in a Worker, the brace rule replaces the struck gap heuristic, the recognized output becomes MusicXML and enters at the existing ingest seam, the singer answers clef and key in the drawer before the read, the read report counts every substitution without marking the page, and the greyscale ink persists so a reload restores without re-asking. **What Dann saw: thirteen syllables sitting on notes Ilya read off ink, `13 / 13`.** Gates 537 to 552. |
| 2026-08-16 | **A DEFECT OLDER THAN N.59, found by it: `validateRecord` never carried `source` through**, and had not since N.67 step 1. It returned `record.source === null` on every load. **Consequence nobody had noticed: step 4a's chimera warning cannot fire on the first upload after a reload**, because the stored fingerprint was always absent. It works within one session, which is exactly why Dann's own 4a walk passed. Fixed, four tests. **The lesson: a walk that never reloads cannot test anything that depends on what was stored.** |
| 2026-08-16 | **Three corrections to Fable's E.57 brief, all measured, none of them reopening a ruling.** (1) `measures_per_system` is `len(barlines)`, not `len(barlines) + 1`: the `+1` form is wrong on all six Musorgsky pieces by exactly the number of systems. (2) The spike's `loadPackage` list is `['numpy','opencv-python']` with no matplotlib, and it never writes the Leipzig caches, because it calls `read_page_pitch` rather than `envelope.run`; every matplotlib and leipzig string it contains is inside its embedded module blob. (3) `~/Downloads/ilya-test-page.png` is byte-identical to a repository fixture and is 8 staves at s = 21, not E.43's 12 at s = 17. |
| 2026-08-16 | **DANN'S BRACE RULE IS BUILT BUT ITS CENTRAL CASE IS UNPROVEN, and that is recorded rather than dressed up.** No fixture in this repository contains a brace at all: every Verovio render joins voice and piano with the system barline alone. The rule therefore falls back to staff 0 on every fixture system and COUNTS the fallback, which the read report declares out loud. On the Piano-first piece 06 that fallback picks the piano. **The old heuristic picked the piano too; the difference is that this one says so.** |
| 2026-08-16 | **E.57: `1e4081a`. No code shipped. N.59 briefed and nine environment traps recorded.** A Sonnet inventory read the eleven reader modules and found four things the E.43 summary did not carry: `select_vocal` is the ONLY staff-selection site (`reader.py:269-278`, one call site at `:400`); `timesig.py` carries a SECOND Node-and-Verovio shell-out; losing `rest_templates`' shell-out aborts the whole page rather than dropping rests; and **the reader detects neither clef nor key**, passing both through from a ground-truth file that does not exist in a browser. Fable then ruled all five open questions and wrote the build brief. |
| 2026-08-16 | **The scope enlargement reported at E.57's midpoint was WRONG, and the record keeps it.** "Two shell-outs, not one" was read as a doubling of the work. Fable opened both `load_font` functions and found the cache-hit early return, so the true cost is two committed JSON files and zero new WASM. **The lesson is tether 10: the inventory read the imports and not the function bodies, and a summary of a summary got one more layer wrong.** |
| 2026-08-16 | **Nine environment traps recorded that no gate could have found**, all learned across E.53 to E.56 and none previously written: `pnpm --filter` from `~` is destructive; the bundle-size instrument is noisy to 443 bytes; `autofocus` moves web-check to 8 warnings; `app.css:93` breaks native modals; service workers cannot be tested locally without patching the build; `cp -R` preserves mtimes so a local server lies about caching; the Vercel branch alias lags READY; there are two file inputs now; and Dann uses Chrome on his iPhone, not Safari. |
| 2026-08-16 | **E.56: `046beec` and `58f982c`. N.71 and N.70, both found by Dann walking and both closed by Dann walking.** The notehead swallowed its own click for three days behind a DONE mark; iOS silently refused every score format Ilya can read. **Neither was reachable by a gate, and both were found by a musician using the thing.** score-parser 442 to 444. |
| 2026-08-16 | **E.55: `6c0c719`, N.67 step 3 shipped and WALKED BY DANN. N.68 closed.** `mergeOnUpload` keeps the map by positional key, proposes only into an empty map, reports orphans, and never rebuilds; *Start placement over* is the singer's own and only destructive act. Seven new tests, gates 504 to 511. |
| 2026-08-16 | **The walk was built to be able to FAIL, and that is why it is worth anything.** Re-running the first pass over an unchanged transcription produces the same layout either way, so the walk needs one deliberate change in the middle. Positive control: the old code was temporarily restored and the identical walk snapped back to 5/5; the merge rule held at 4/5. |
| 2026-08-16 | **Three defects found by Dann walking, none by a gate.** The notehead swallows its own click, notes have no cursor affordance, and no iPhone can load a `.musicxml` at all. See the section above. **The instrument lesson: my Playwright harness had to DISPATCH the note click because a real click was intercepted, and I read that as a test artifact instead of as the bug it was.** |
| 2026-08-16 | **E.54: N.67 steps 1 and 2. The vault and the source.** `ilya-library` v1 with `songs` / `sources` / `meta`; the §3 migration, write-verify-then-remove; `persist()` and `estimate()` called for the first time in this project's life (Dann's Mac reports a **1.9 GB** quota against 3.4 KB used); `BroadcastChannel` for two tabs; the score kept byte for byte and re-ingested at boot. **34 new tests, gates 470 to 504.** |
| 2026-08-16 | **TWO BUGS THAT ALL FIVE GATES PASSED, both found only in a real browser.** (1) `$state` proxies cannot be structured-cloned, so **every IndexedDB write failed** until `$state.snapshot()` was applied; localStorage never showed it because `JSON.stringify` reads a proxy happily. (2) The effect's guards were in the wrong order, so **the singer's first edit was swallowed** as though it were the load echo. Both are in `ENVIRONMENT.md`. **The lesson is the instrument: drive Playwright yourself, it is installed and it takes thirty seconds.** |
| 2026-08-16 | **E.53: `4568e01`, N.67 step 0 shipped and observed.** The song document, the facade, the legacy driver, 32 new tests. `+page.svelte` 2,095 to 2,009 lines, its per-song localStorage sites to **zero**, 1,324 lines added under `lib/library/`. **Observed in a browser on Dann's Mac, not merely written:** a seeded pairing map survived an idle reload byte for byte, which is the race the deleted guard flag existed to prevent. **web-test baseline moved 438 to 470 with Dann's permission** (`ilya-ship.sh:79`). |
| 2026-08-16 | **The rename method worth reusing.** Delete the declarations FIRST, let `svelte-check` name every surviving reference, then insert at exactly the reported `line:col` after asserting the identifier is there. The compiler cannot report a comment, a string, or an import path, so nothing else can be hit, and 0 errors at the end is the proof. 44 of 44 applied, zero mismatches. |
| 2026-08-16 | **E.52 closed. No code shipped.** N.67 ruled first, displacing both blockers. Fable commissioned three times and returned the design, the socket, and the retention policy, all in `docs/sessions/`. The retention rule ratified. **The build moves to Claude Code in the desktop app's Code tab**, folder associated; see `ENVIRONMENT.md`. |
| 2026-08-16 | **Corrections to `claude/e45-n67-storage-architecture_2026-08-13.md`, measured:** Ilya already uses IndexedDB (`loader.ts:103-115`, `ilya-data` v1, store `cache`); `.musx` does not compress, so sources are 64 to 146 KB and stay there, not 15 to 25 KB. `navigator.storage.persist()` has never been called. |
| 2026-08-16 | **A process failure worth keeping.** Half an hour was spent measuring that no gate runs on the device VM. `ENVIRONMENT.md` already said so. Its read rule is "before you touch a tool, a path, or a gate," and it was not followed. |
| 2026-08-15 | **E.51 closed. N.69 and N.47 both CLOSED.** `STATE.md` rewritten, `ENVIRONMENT.md` gained the print, Vercel, container-renderer, and measurement sections. |
| 2026-08-15 | **`8af064e`: N.69 settled.** `HEADER_GAP = 16` on both pages; `HEADER_HEIGHTS_AT_LETTER` measured in headless Chromium. Verified in a container render before Dann printed it. Dann on paper: *"the spacing is correct."* |
| 2026-08-15 | **`bd811d3`: a wrong turn, recorded.** Generalised the broken mechanism instead of the working one. Also hid `vercel-live-feedback` at print, which survives. |
| 2026-08-15 | **`3187c40`: print stops re-typesetting the page.** |
| 2026-08-15 | **Vercel SSO turned OFF for project `ilya`.** Reversible in Settings, Deployment Protection. |
| 2026-08-15 | **Asked and answered from the code, no change made: is `с` in «если» regressively palatalized by `лʲ`?** No, by two independent mechanisms (`engine.ts:295`, `:898`, `:303`, `:998-999`). The code records that Grayson p. 209 and D&P pp. 76-87 disagree and that **Ilya follows D&P**. Changing it would reverse a ruling. |
| 2026-08-14 | **`aee9f4a`, `99ab8c5`, `55291e7`: N.69 passes one to three.** |
| 2026-08-14 | **N.47's gate RUN and it found N.69.** The tree wins. |
| 2026-08-14 | **N.59 explained in full. N.58's scoping brief written and delivered.** |
| 2026-08-14 | **`I.01` caught in `INBOX.md`.** |
| 2026-08-14 | **`b5e8777`: N.32 closed**, walked and observed. |
| 2026-08-13 | **STATE.md rewritten clean.** **A log that only appends drifts; rewrite this file at the close.** |
| 2026-08-13 | **RULED, Dann: the notes never move; the syllables slide along them.** In `PRODUCT.md`. |
| 2026-08-13 | **This folder created.** |

---
*Updated at the close of 2026-08-18, second session, against `cb7a15a`. Facts
added this session were read in the working tree, measured by Claude Code on
Dann's machine, or observed by Dann himself on the `ilya-hg5dr7kl3` deploy.
Read in full this session: `README.md`, `CONTRACT.md`, this file,
`e52-fable-save-design_r1_2026-08-16.md`, and
`n67-4b-library-door_r1_2026-08-18.md`. Read in part: `+page.svelte` and
`ilya-ship.sh`, both at the lines cited. The four N.67 documents are summarised
here; **read the design itself before building from this summary**, and read the
three corrections above with it.*
