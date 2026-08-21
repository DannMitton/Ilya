# Ship B: every header retracts, the score box says one sentence, and the syllable text joins Shift Lyrics

**Serves N.65. Built by Code, 2026-08-21. Floor `2238e8b`, branch `Shane`.
`WRITTEN`, not `DONE`: Dann has not walked it on a deploy.**

Brief: `docs/sessions/brief-to-code-retraction_r2_2026-08-21.md`, read in full
this session.

Read in full this session: `docs/memory/CONTRACT.md` including tethers 17 and
18, `README.md`, `docs/memory/STATE.md`'s head and its N.65 entries,
`docs/sessions/brief-to-code-retraction_r2_2026-08-21.md`,
`docs/sessions/retraction-shipA_r1_2026-08-20.md`.
**Not read, deliberately:** `brief-to-code-retraction_r1_2026-08-20.md`, which
r2 supersedes whole.

**Ship A was not rebuilt.** It is in history at `80c5e47` and nothing here
touches the older-Finale deletion, its six keys, or the lavender rule.

---

## 1. What shipped

Eleven files changed, one added. 679 insertions, 276 deletions.

### 1.1 The one mechanism

**NEW: `apps/web/src/lib/components/Drawer/sections.svelte.ts`, 169 lines.**
`Drawer.svelte`'s `expandedSections` and `toggleSection`, moved out as
`SectionSet`, per §B.2's "extract it so the drawer has one mechanism."

- `sections.svelte.ts:105`, `class SectionSet`, with `has`, `toggle`, `open`
  and `restore`. The reassign-rather-than-mutate discipline is the tree's own:
  Svelte does not proxy a `Set`, so a fresh set assigned to the field is what
  makes a reader run.
- `sections.svelte.ts:77`, `parseOpenSections`, a free function so the fallback
  decision sits in plain TypeScript rather than in a rune module.
- `sections.svelte.ts:37`, **`OPEN_STATIONS_KEY = 'ilya:openStations'`.** That
  is the exact key string §B.4 asks the memo to state.
- `sections.svelte.ts:43`, `FIRST_RUN_STATIONS = ['piece', 'source']`.
- `sections.svelte.ts:52`, `UNPERSISTED_STATIONS = ['notation']`.
- `sections.svelte.ts:63`, `STATION_IDS`, the six wire values:
  `piece`, `notation`, `source`, `songs`, `analysis`, `shiftLyrics`.

**TWO INSTANCES OF ONE MECHANISM, NOT TWO MECHANISMS.** `Drawer.svelte:165`
holds `const toc = new SectionSet()`, which persists nothing and holds Learn and
Guide's heading ids. `+page.svelte:208` holds the stations' instance, which
persists. They are separate state because they are separate things: one shared
set would have written Learn's open units into the stations' key.

`Drawer.svelte` lost 24 `expandedSections.has(` call sites and 12
`toggleSection(` call sites to `toc.has(` and `toc.toggle(`. Its
`handleTocClick` and its auto-expand effect became two `toc.open(...)` calls.

**The persistence is imperative, not an effect.** Every mutation runs through
`toggle` and `open`, so the write sits at the two mutation sites and needs no
effect context. `document.svelte.ts`'s own header gives the reason and it holds
here: this repository's vitest runs in the `node` environment, where `$state` is
a plain assignment and `$effect` compiles to nothing.

### 1.2 The chevron, and where it came from

**`StationHeader.svelte` is now the one owner of the disclosure as well as the
label.** `NotationFields.svelte`'s button, its chevron, its `aria-expanded`, its
44 px coarse-pointer floor and its two rotations came here whole. §B.2 named
that component as the pattern rather than the exception, so the pattern moved
rather than being copied to five more files.

- `StationHeader.svelte:114`, `.station-disclosure`, the button.
- `StationHeader.svelte:121`, the chevron, the table of contents' own 10x10
  glyph. No new affordance entered the vocabulary.
- `StationHeader.svelte:220-229`, the two rotations, unchanged in value and in
  reasoning: down when shut, up when open, for a panel that grows downward.
  **§B.3's rule was not re-derived.**
- `StationHeader.svelte:233`, `min-height: 44px` under `(pointer: coarse)`.
- `StationHeader.svelte:120`, `.station-status`, the slot the component's own
  header has reserved since ship one.

`NotationFields.svelte` lost 91 lines net: its button markup became three props
and its disclosure rules are gone rather than duplicated.

**`tight` is now derived, not remembered by each caller.** A header that is a
control and is shut carries no gap, which is what `NotationFields` did by hand.

### 1.3 The six stations

| station | file | id | header |
|---|---|---|---|
| Piece (METADATA) | `MetadataFields.svelte:65` | `piece` | `station-piece` |
| NOTATION | `NotationFields.svelte:102` | `notation` | `notation-toggles` |
| SOURCE | `RootPanel.svelte:219` | `source` | `station-source` |
| REPERTOIRE | `SongList.svelte:105` | `songs` | `station-songs` |
| ANALYSIS | `RootPanel.svelte:424` | `analysis` | `station-analysis` |
| SHIFT LYRICS | `ShiftLyricsControl.svelte:114` | `shiftLyrics` | `station-shift-lyrics` |

**The voice anchor takes no chevron**, on Dann's explicit ruling. It passes
neither `expanded` nor `ontoggle`, so `StationHeader` draws the plain `<h3>` it
always did. Verified in the running drawer: no `svg` inside
`.drawer-anchor-bottom`, and `Calibrate` measures 44 px inside the viewport
**with all six stations shut**.

**`notationExpanded` is gone from `+page.svelte`** and NOTATION joined the one
set. Its ruled behaviour did not change: it is the only id in
`UNPERSISTED_STATIONS`, so it is filtered on the way to storage and never read
back, and it keeps its collapsed-on-arrival default. `+page.svelte`'s comment
about a remembered collapse hiding the toggles stands and is unedited.

### 1.4 The score field's action row (§B.6)

`RootPanel.svelte:361`, `.output-row`, moved into SOURCE's `.station-body`. The
`.output-section` wrapper is **deleted**, not emptied, and its `border-top:
none` rule went with it. That rule carried Dann's ruling of 2026-08-20 that no
horizontal line sits between the score field and the Print row; **the ruling is
not reversed, it is satisfied by construction**, because there is no boundary
left to draw a line across.

`ScoreUploader.svelte:820`, `.dz-wrap` lost its 8 px `margin-bottom` and became
a flex column. Ship A named that margin as the one lever inside its scope and
left it, saying ship B would dissolve the question. It did.

**`Print` stays in the row**, per §B.6. `RootPanel` is still the only Print
control in the application.

### 1.5 The score box says one sentence (§B.7)

`ScoreUploader.svelte:98`, `dropPlaceholder`, assembled at the render seam from
`upload.drop.title` and `upload.drop.browse` with a space and `…`. Rendered
at `:557`. **No new English and no new French.** The ellipsis is the character
its sister already uses at `i18n.ts`'s `input.placeholder`.

`ScoreUploader.svelte:593`, `.dz-formats`, rendering `upload.drop.acceptedNow`
verbatim, as its own line inside `.dz-wrap`. Inside the wrap rather than beside
it, so it belongs to the box it describes and unmounts with it when a score
arrives. **Confirmed in the browser: dropping a score removed the box and the
line together and left the Print row standing.**

`upload.drop.placeholder` is **retained, not deleted**, marked no longer
rendered. See §4, decision 1.

### 1.6 The merged station (§B.8)

`SyllableStation.svelte` lost its `.station-head`, its `<h3>`, and their
recipe. `ShiftLyricsControl.svelte` gained a `syllables` snippet, a `placed` and
`total` pair, and the retraction props. `+page.svelte:2117` composes the two.

**A snippet rather than props**, twinning `RootPanel`'s `sourceScore` and
`consoleContent`, so `SyllableStation`'s six props stay where the rest of the
score work is wired and nothing is drilled through the wrapper.

`ShiftLyricsControl.svelte:161`, `.shift-lyrics` keeps the lavender
`border-top`. **The rule needed no work**, exactly as §B.8 predicted: it sits on
this component's own root, so putting the text inside put the rule above both.

`+page.svelte:273`, `placedSlotCount`, derived from `shownPairings` and
`slotQueue` by `SyllableStation`'s own rule, keyed by origin. **It reads
`shownPairings`, not `doc.pairings`**, which is what `SyllableStation` was
passed: the counter and the grey on a placed syllable have to agree, and they
only agree if they read the same map.

**`station.syllables` is deleted**, `i18n.ts:639`. Checked before deleting, the
way ship A checked its six: **grepping `station.syllables` across `apps/`,
`packages/` and `tests/` returned exactly two hits, the declaration and
`SyllableStation.svelte`'s `<h3>`. No test and no end-to-end spec named it.**
After the change the grep returns the declaration alone, and then nothing.

---

## 2. The measurements

Every number here was read out of a running browser. **The desk figures are the
Chromium pane at 1400 x 900, where `(pointer: coarse)` is false. The phone
figures are its mobile emulation, where it is true.** That difference matters
and is reported wherever it changes a number.

### Done 1 and 2. Six headers, six chevrons, both directions

All six are `<button>`s carrying `aria-expanded`, all six draw a chevron, and
all six flipped on a click, on the desk and at 390 x 844. Every body appeared
or disappeared with its header.

**Settled reading of the six chevrons**, `rotate(90deg)` being down and
`rotate(-90deg)` being up:

| station | state | points | correct |
|---|---|---|---|
| Metadata | open | up | yes |
| Notation | shut | down | yes |
| Source | open | up | yes |
| Repertoire | shut | down | yes |
| Analysis | open | up | yes |
| Shift Lyrics | open | up | yes |

**AN INSTRUMENT FAULT, RECORDED BECAUSE IT NEARLY BECAME A FINDING.** Reading
`getComputedStyle().transform` in the same call that clicks returns the
pre-transition value, and `.chevron-icon` carries `transition: transform 150ms`.
Two reads taken that way reported every chevron inverted. **The settled read
above is the true one**, and the first two were the measurement, not the build.

### Done 3. The metadata anchor, ten numbers

`.drawer-content`'s `clientHeight`, metadata open and shut, at the five sizes.

| viewport | open | shut | returned |
|---|---|---|---|
| 430 x 932 | 525 | **752** | 227 |
| 390 x 844 | 437 | **664** | 227 |
| 393 x 727 | 320 | **547** | 227 |
| 375 x 667 | 260 | **487** | 227 |
| 360 x 640 | 233 | **460** | 227 |

**The middle clears 365 px at every one of the five sizes with metadata shut.**
That is the second half of the desk's expectation and it holds.

**THE FIRST HALF DOES NOT. The desk expected roughly 270 px back; the
measurement is 227 px, at every size, exactly.** I stated before measuring that
it would come in under 270, and named the reason in advance: ship B puts a 44 px
coarse-pointer floor on five more headers, and two of them sit in the top
anchor.

**The arithmetic, measured rather than reasoned.** The open top anchor was
315.75 px on `2238e8b` and is 342.95 px now, **+27.20 px**, which is the two new
44 px floors on Piece and NOTATION. The shut anchor is 116.00 px. 342.95 minus
116.00 is 226.95, which is the 227. Add back the 27.20 the ship spent and the
figure is 254.15, still short of 270; the remainder was an estimate rather than
a measurement.

**Against `2238e8b`, the middle is 27 px SHORTER with everything open and 200 px
TALLER with metadata shut.** Both are consequences of the same ruling.

**The 44 px cost is a phone cost only.** At 1400 x 900 every station header
measures 16.80 px, unchanged, because `(pointer: coarse)` is false there.

### Done 4. The reload restores the open set

Opened Analysis, Notation and Shift Lyrics, shut Piece, then reloaded.

| | before reload | stored | after reload |
|---|---|---|---|
| Metadata | shut | absent | **shut** |
| Notation | **open** | **absent, by design** | **shut** |
| Source | open | present | **open** |
| Repertoire | shut | absent | **shut** |
| Analysis | open | present | **open** |
| Shift Lyrics | open | present | **open** |

`ilya:openStations` held `["source","analysis","shiftLyrics"]`. **NOTATION was
open on screen and absent from the stored array**, and came back collapsed.

**The corrupt-value fallback, tested rather than reasoned.** Writing
`{not json at all` to the key and reloading gave Piece and Source open, the
drawer rendered, and nothing threw.

**The empty array is not corrupt.** Shutting all six stored `[]`, and a reload
returned all six shut rather than falling back to the first-run default.

### Done 5. First run

With the key absent: **Metadata open, Source open, and Notation, Repertoire,
Analysis and Shift Lyrics shut.** Nothing is written to the key until the singer
touches a header.

### Done 6. Any number open at once

At 390 x 844 with a coarse pointer, all six were open simultaneously. **No
exclusivity and no auto-collapse.** The stored array read
`["piece","source","analysis","shiftLyrics","songs"]`, five ids for six open
stations, `notation` being the sixth and unpersisted.

### Done 7. The voice anchor

No `svg` inside `.drawer-anchor-bottom`. `Calibrate` measures 44 x 44,
`top: 791`, `bottom: 835` in an 844 px viewport, inside both the viewport and
the drawer, **with all six stations shut**.

### Done 8. One sentence, and the format list

| | English | French |
|---|---|---|
| inside the box | `Drop a score here or click to browse…` | `Déposez une partition ici ou cliquez pour parcourir…` |
| its sister above | `Paste Russian text here…` | `Collez le texte russe ici…` |
| the line below | `Accepted now: MNX, MusicXML, .mxl, Finale (.musx), MuseScore (.mscz), PDF, a photograph` | `Acceptés maintenant : MNX, MusicXML, .mxl, Finale (.musx), MuseScore (.mscz), PDF, une photographie` |

Both languages read off the running drawer. The French non-breaking space
before its colon is intact.

**THE DIFFERENCE §B.7 ASKS ME TO NAME RATHER THAN RECONCILE, AND IT IS DANN'S,
ONE CHARACTER.** The format line ends `PDF, a photograph` with **no full stop**.
The sentence it replaces ended `PDF, or photograph.` with one. The retained key
is used as written. Two further differences ride along in the same key and are
his to keep or change: **`a photograph` where the old sentence read
`or photograph`**, and the French **`une photographie`** where it read
**`ou une photographie`**. The « ou » was his own word, added on his walk of
`39d60e0`; it lives in `upload.drop.placeholder`, which is retained, so nothing
is lost.

### Done 9. The four edges, and the arithmetic that does not close

At 1400 x 900:

| edge | px |
|---|---|
| textarea bottom | 249.51 |
| `Clear text` / `Transcribe` top | 255.51 |
| **textarea to its row** | **6.00** |
| score box bottom | 417.90 |
| format line top | 423.90 |
| format line bottom | 443.09 |
| `Print` / `Export` / `Import` top | 449.09 |
| **score box to the format line** | **6.00** |
| **format line to its row** | **6.00** |
| **score box to its row** | **31.20** |

**EVERY SIBLING GAP IN SOURCE IS 6.00 px, AND THAT IS THE RELATIONSHIP DANN
ASKED FOR.** The row sits the same 6.00 px from the element above it that
`Clear text` and `Transcribe` sit from the textarea, and the box sits the same
6.00 px from the element below it that the textarea does. Both are
`.station-body`'s own flex gap, one element, one value.

**BUT THE RAW BOX-TO-ROW DISTANCE IS 31.20 px, NOT 6.00, AND IT CANNOT BE
6.00.** §B.7 puts a line of type between them, so the two demands cannot both be
met literally: 6.00 + 19.19 + 6.00 = 31.19, which is the 31.20 within rounding.
**I have not forced them equal and I am not calling this a match.** What is
equal is the sibling gap; what is not is the distance across the new line. This
is Dann's to look at.

**ON `2238e8b` THE SAME DISTANCE WAS 26.00 px, NOT SHIP A's 20.00.** I measured
26.00 twice on the floor commit before touching anything. **The tree wins over
the document, tether 3.** Ship A's decomposition named 8 px of `.dz-wrap` margin
plus 12 px of station boundary and did not name `.output-section`'s own 6 px of
top padding from the `.section` recipe, which is the difference. Ship B removes
all three.

### Done 10. No SYLLABLES header, and the order

Read off the DOM with a score and a transcription loaded:

1. the lavender rule, `2px solid rgb(142, 126, 155)` on `.shift-lyrics`
2. the SHIFT LYRICS header, carrying `0 / 11`
3. `.syllable-station`, holding `Я вас лю-бил лю-бовь е-щё быть мо-жет`
4. `to the End of the Lyric`
5. `to the Next Open Note`

A search for an `<h3>` reading `Syllables` or `Syllabes` anywhere in the
document returns **an empty list**.

### Done 11. The counter

**Before any text is pasted the counter does not render at all.** The
`.station-status` span is present and empty, so the header measures the same as
every other header. After transcribing it read `0 / 11`; after the score
arrived and the first pass ran it read `11 / 11`.

**Its position, measured:** the label starts at x = 16, the counter runs
459.50 to 484.00, the chevron runs 492.00 to 502.00, and the button's own right
edge is 502.00. **The chevron is outermost right, flush, and the counter sits
immediately to its left.** The pattern Dann ruled is not broken on this header.

**The counter's top sits 1 px above the label's** (1214.44 against 1215.44).
That is `align-items: baseline` doing its job: the counter is 12 px and the
label 11.2 px, so two boxes on a shared baseline have different tops. It is the
arrangement `StationHeader`'s own header note asked for.

### Done 12. The move did not cost the gesture

- **Clicking a syllable moves the cursor.** Clicking the fourth `.slot` moved
  `.is-cursor` from index 0 (`Я`) to index 3 (`бил`), one cursor in the
  document, `aria-current="true"`, and the 44 x 44 floor intact.
- **Clicking a notehead places it.** With the cursor on `Я`, clicking the last
  `[data-hit]` rectangle (`m5-1-2`) placed the syllable and advanced the cursor
  to `вас`, which is Finale's behaviour and the tree's.

Driven with a real MusicXML ingest: `tools/e16-harness/close-fixture/close-fixture.musicxml`
dropped on the drop zone, 24 events, 11 slots, first pass placing all 11.

**AN INSTRUMENT FAULT, RECORDED.** My first attempt clicked `[data-event-id]`
and nothing happened. The click target is `[data-hit]`, which
`VoiceProfilePane.svelte:213` reads through a delegated listener. **The first
result was my selector being wrong, not the build.**

### Done 13. The 360 x 640 watermark overlap

| | `2238e8b` | ship B |
|---|---|---|
| box height | 138.00 | **114.00** |
| placeholder height | 120.00 | **48.00** |
| glyph band | 41.60 | 41.60 |
| **vertical overlap** | **41.60** | **20.80** |

**The overlap is halved, not gone.** I said before measuring that I expected it
near zero and named the failure mode that would stop that: the placeholder is
top-aligned and the band is centred, so a short placeholder still reaches the
band's top. That is what happened. The box is back to its ruled `min-height` of
114 px, having stretched to 138 px to hold six lines.

**The watermark is untouched, as §B.9 requires.** This is a measurement, not a
judgment: 20.80 px of the 41.60 px band still sits behind type.

### Done 14. The five gates

| gate | baseline | this run |
|---|---|---|
| phonology | 216 passed (216) | **216 passed (216)** |
| dictionary | 235 passed (235) | **235 passed (235)** |
| web-check | 0 errors, 7 warnings in 4 files | **0 errors, 7 warnings in 4 files** |
| web-test | 682 passed (682) | **682 passed (682)** |
| score-parser | 444 passed, 5 skipped (449) | **444 passed, 5 skipped (449)** |

**Nothing moved, so no permission was needed. No test was added**, deliberately:
adding one would move `web-test` and §B.10 item 14 says to ask first.

**THE CHECK GATE MOVED ONCE AND WAS PUT BACK, AND THE WARNING WAS REAL.** The
first full build gave **8 warnings in 5 files**. I did not assume the baseline;
I restored HEAD's eleven files, re-ran, and confirmed 7 in 4. The extra was
`RootPanel.svelte`, `non_reactive_update` on `fileInputEl`. **It is describing a
real consequence, not a style:** the hidden OCR file input is inside SOURCE's
body now, so it unmounts when a singer shuts the station, and the binding has to
be able to say so. `RootPanel.svelte:118` is `$state<HTMLInputElement |
undefined>(undefined)`. Its one reader already optional-chained.

---

## 3. Where the tree disagreed with the brief

**1. The gap ship A reported.** §B.6 quotes 20.00 px from the score box to the
Print row on `80c5e47`. **The floor commit measures 26.00 px.** I followed the
tree. The 6 px ship A's decomposition did not name is `.output-section`'s own
top padding. See done 9.

**2. §B.7's watermark figures are stale.** The brief says the sentence "wraps to
five lines and fills 120 px of a 152 px box." **The box measures 138 px, not
152**, because the three-quarters ruling of 2026-08-20 set `min-height: 114px`
and the box grew to 138 to hold the text. The 120 px figure is exact. I followed
the tree and report both numbers. See done 13.

**3. §B.6 and §B.7 cannot both be satisfied literally.** §B.6 asks for the box
to row gap to equal the textarea to row gap; §B.7 puts a line of type between
the box and the row. I built the sibling gap and reported the distance. See done
9. **This is named rather than reconciled.**

**Nothing else disagreed.** `NotationFields.svelte:96-106` was exactly the
pattern §B.2 said it was. The lavender rule was exactly where §B.8 said, and
moving the text inside put it above both with no work, as predicted.
`station.syllables` had exactly one consumer. The three retained i18n keys
carried both halves in both languages.

---

## 4. Decisions this brief did not rule, stated as decisions

1. **`upload.drop.placeholder` is retained, not deleted.** It has no consumer
   now. Ship A's precedent deletes single-consumer keys, but this is the one
   string Dann added a word to by hand, « ou », on his walk of `39d60e0`.
   Deleting it would drop that provenance and the brief did not ask. It is
   marked no longer rendered, the same treatment the three keys it supersedes
   already carry. Reversible in one line.

2. **The drift line stayed with the text, not the header.** §B.8 asks where it
   landed. It is inside `SyllableStation`, above `.station-text`, and it renders
   only when drift is above zero, unchanged. It uses `.station-count` too, but
   it is not the counter Dann named: it reports a re-transcription against the
   text it sits under.

3. **The counter renders as an empty span rather than not rendering.** The
   `{#if total > 0}` sits inside the `status` snippet, so the slot exists and
   holds nothing before a singer pastes. That keeps the shut header's geometry
   identical to every other header's. Rendering the snippet conditionally would
   have worked too and measures the same.

4. **NOTATION joined the one open set** rather than keeping its own `$state`.
   Its behaviour is unchanged and its exemption is now one entry in
   `UNPERSISTED_STATIONS` with the reason beside the key it is filtered from.
   The alternative left one header on a second mechanism, which is the thing
   §B.2 forbids.

5. **The station ids are wire values and are documented as such.** Renaming one
   drops that singer's stored set back to the first-run default.
   `destinations.ts` carries the same warning for `ilya:activeTab`.

6. **`ScoreUploader`'s `.uploader` keeps its 8 px `margin-top`, and its comment
   is now false.** The comment says it matches "the Transcription
   textarea-wrapper's 8px top margin." **`.textarea-wrapper` has no `margin-top`
   at all.** That 8 px sits on top of `.station-body`'s 6 px gap, so the space
   above the score box is 14 px where the space above every other sibling is 6.
   It is above the box, not below it, so §B.6 does not name it. **I did not pull
   it: it is a visible spacing change nobody asked for, and Dann rules spacing by
   looking.** Named here so the next session does not have to find it.

7. **`aria-controls` is omitted while a section is shut**, on
   `NotationFields`'s existing pattern, because an absent reference beats a
   broken one. Carried to all six rather than changed.

### Where the closed-header status slot goes, and whether it can share

§B.9 asks. **The slot is `StationHeader`'s `status` snippet**, between the label
and the chevron, and it is already built and already occupied on one header.
Adding the status line later needs no markup rework anywhere: it is a second
prop on this one component.

**Whether the two can coexist there is NOT ESTABLISHED and is Dann's.** They
would render into the same span. Structurally nothing stops it; whether
`SHIFT LYRICS   11 / 11   nothing placed yet   ⌄` reads as one thing or two is a
copy judgment, and he has not written the copy. **I invented no strings.**

---

## 5. NOT ESTABLISHED

**NOT ESTABLISHED BEATS A COMPLETE INVENTED ANSWER.**

1. **Whether the closed-header status slot and the counter can share one
   header.** Carried forward from the brief unchanged. **Settled by:** Dann
   writing the status copy.

2. **Whether 227 px is enough.** The brief's 365 px target is met at all five
   sizes with metadata shut, but 365 is what the placeholder reserves, and §B.10
   is explicit that the figure it was chosen against sits in a document this
   desk has not opened. **Settled by:** the populated Inspector's real height.

3. **Whether 20.80 px of watermark overlap reads as a collision to Dann.**
   Measured and reported, not judged. **Settled by:** his walk.

4. **Whether the 44 px floor on five more phone headers is worth its height.**
   It costs 27.20 px in the top anchor and roughly the same again per header in
   the scroll. It follows E.36 and creates no new exemption, and shutting one
   station returns eight times what one header costs. **Settled by:** his walk.
   **Reversible**, and the lever is one media query at
   `StationHeader.svelte:232`.

5. **Whether a real window resize leaves `bind:clientHeight` stale.** Carried
   forward from the silhouette pass and from ship A. **Not seen while working
   this ship**, but every phone figure here came from a viewport set before the
   page settled rather than from a live drag, so this ship does not test it.

6. **Safari.** Every measurement is Chromium.

7. **The `.mus` path**, carried forward from ship A. Untouched by this ship.

### One thing about the instrument, stated plainly

**The dictionary would not finish loading in the Browser pane, and the cause was
the pane, not the app.** `loader.ts:383` yields with
`await new Promise(r => setTimeout(r, 0))` every 1500 entries, and a hidden tab
clamps zero-delay timers to about a second. At roughly 870 chunks that is about
fifteen minutes. **The Browser pane reports `document.visibilityState ===
"hidden"` even when fronted**, so it never unclamps.

I shimmed `window.setTimeout` in the page so that zero-delay calls run through a
`MessageChannel`, which is not clamped, **and verified the shim: 200 zero-delay
timers in 4.70 ms.** The dictionary then finished immediately.

**This changes only WHEN the merge yields, never what it produces**, and every
measurement in section 2 was taken after the load completed. It is stated here
because it is a modified instrument and the memo has to say so. **It is not a
finding about the app**, and nothing in this ship touches `loader.ts`.

---

## 6. What Dann walks

1. Every station header has a chevron and opens and shuts on a tap, on the phone
   and on the desk.
2. The voice anchor has no chevron and `Calibrate` never leaves.
3. Shutting Piece gives the middle of the drawer its height back.
4. A reload brings the drawer back the way he left it, except NOTATION.
5. The score box says one sentence ending in `…`, and the formats sit on their
   own line beneath it. **In both languages.**
6. Whether the format line reads right ending without a full stop, and whether
   `a photograph` should be `or photograph`. **One character and one word, and
   they are his.** See done 8.
7. Whether 31.20 px from the score box down to `Print` reads as the same
   relationship the textarea has to `Transcribe`, now that a line of type sits
   in between. See done 9.
8. SHIFT LYRICS: rule, header with the counter at its right, the syllabified
   text, then the two rows. No SYLLABLES header.
9. Clicking a syllable and clicking a notehead both still work.
10. **Shutting SOURCE takes `Print` with it.** Transient, until the desk-head
    ship. See §B.6.

---
*Written by Claude Code, 2026-08-21, against the working tree. Every gap, every
height and every string here was read out of a running browser, and the two
places my instrument lied are recorded beside the numbers they nearly spoiled.*
