# Memo from Code: the drawer's stations, ship one

**Serves N.65. Built 2026-08-20 late against
`docs/sessions/brief-to-code-drawer-stations_r1_2026-08-20.md` §3, read in full
this session, including §3.6, which arrived mid-build. Floor: `8d5b175`. Branch
`Shane`.**

Ship one is `WRITTEN`, not `DONE`. It is done when Dann walks §3.5's eight items
on a real deploy.

Read in full this session: `docs/memory/README.md`, `CONTRACT.md`,
`ENVIRONMENT.md` (in part, as a lookup), `STATE.md`'s "THE DRAWER'S STATIONS",
the brief, `Drawer.svelte`, `RootPanel.svelte`, `MetadataFields.svelte`,
`NotationFields.svelte`, `SongList.svelte`, `VoiceAnchor.svelte`, and
`fable-gui-mockup_r1_2026-08-18.html`'s drawer exhibit and its station CSS.
Not read: E.27 itself, E.36 §2.2, `InspectorPanel.svelte`.

---

## 1. What shipped

| what | where |
|---|---|
| One owner for the station label | `apps/web/src/lib/components/Drawer/StationHeader.svelte`, new file |
| Piece onto that owner | `MetadataFields.svelte:16,66` |
| Notation onto that owner, accent and no-gap as props | `NotationFields.svelte:29,96-106` |
| Analysis onto that owner | `RootPanel.svelte:299` |
| Songs onto that owner, and its 6px double-gap fixed | `SongList.svelte:22,105,114,183-190` |
| The fifth declaration renamed, not folded | `Drawer.svelte:264,434,884-900` |
| SOURCE, a labelled station | `RootPanel.svelte:194-196` |
| Clear and Transcribe at Source's foot | `RootPanel.svelte:261-283` |
| Print beside Export and Import | `RootPanel.svelte:367-381` |
| The `1fr 1fr 2fr` grid deleted | `RootPanel.svelte:636-648` |
| The station body box, so the header owns the gap | `RootPanel.svelte:725`, `SongList.svelte:187` |
| The placeholder's italic deleted, RULED | `RootPanel.svelte:532` |
| Both field perimeters 3px to 1px, NOT RULED | `RootPanel.svelte:505`, `ScoreUploader.svelte:709` |
| The `!important` global that actually painted the border, deleted | `+page.svelte:2863-2877` |
| `source.heading` | `i18n.ts:178` |

---

## 2. Where the tree disagreed with the brief, and what I followed

**The tree won every time. Four disagreements, and two of them changed the
build.**

### 2.1 The double line under NOTATION is not the seam the brief describes

The brief §1 says NOTATION "is two things at once: a pinned anchor whose wrapper
draws a boundary, and a station that draws its own. Both fire." **It does not.**
`NotationFields` declares no border at all, and never did. Measured in the
browser on the pre-build tree, there is exactly one CSS rule under NOTATION:
`.drawer-anchor-top`'s `border-bottom: 2px double var(--ink-primary)`. §3.2 asks me to decide which of two rules owns the line
and delete the other. There is no other, so nothing was deleted there.

**What Dann is seeing is two rules 28 px apart, not two rules touching.** At
1440x900 the anchor's near-black rule painted at y=315.5, and the textarea's own
`3px solid var(--sage)` top border painted at y=343.5, both spanning the drawer's
full inner width, with empty drawer between them. Two heavy full-width lines with
a gap read as one double rule.

I also ruled out the other reading. `border-style: double` paints two lines by
definition, so `2px double` could have been the whole answer on its own. It is
not: screenshotted at 8x device pixel ratio, Chromium renders `2px double` as one
solid 2 px band. The screenshot is in the session scratchpad and is not committed.

**So the fix came from §3.6 rather than §3.2**, and the two sections turn out to
be the same defect. Taking the textarea to 1px drops the second line's weight to a
third of the first's.

**SUPERSEDED IN PART BY DANN'S WALK.** This paragraph used to end by keeping the
anchor's `2px double`. He ruled it out the same evening. §7 carries what replaced
it and why.

### 2.2 `.text-input`'s border is not set where §3.6 says it is

§3.6 says "`.text-input` is `3px solid var(--sage)`". True of the source and false
of the screen. `+page.svelte` carried
`:global(.drawer-content textarea) { border: 3px solid var(--sage) !important }`,
which outranked `RootPanel`'s own rule. **Editing `.text-input` alone changed
nothing, and the first measurement after the edit still read 3px.** Found by
enumerating every stylesheet rule the element matches, rather than by trusting
the file.

There is exactly one `<textarea>` in the whole app, so a global reaching into the
drawer to style it bought nothing. Both the resting border and the focus colour
are on `.text-input` now (`RootPanel.svelte:505,524`) and the `!important` is
gone with them. **This is the same defect as the label declared five times: one
thing, more than one owner.**

### 2.3 The drawer holds seven heading recipes, not five

The brief counts five declarations of `.section-label`. Measured, the drawer
draws **seven** heading recipes, and the two the brief does not name are the two
that differ most:

- `SyllableStation.svelte:142-149`, `.station-head h3`
- `ShiftLyricsControl.svelte:88-95`, `.shift-lyrics h3`

Both are `0.6875rem / 0.08em / #6a655f`, a hardcoded hex rather than a token,
against the station label's `0.7rem / 0.12em / var(--sage)`. Measured live, SHIFT
LYRICS renders at 11px, 0.88px letter-spacing, `rgb(106, 101, 95)`, against every
station's 11.2px, 1.344px, `rgb(139, 154, 125)`. **On the desk it sits nine rows
below SONGS in the same scroll, so the two are comparable by eye.**

**Left alone, deliberately.** Neither is on the ruled station list, which is
Piece, Notation, Source, Analysis, Output, and Songs (`STATE.md`, ruling 5), and
the brief scopes this ship to "the drawer's stations and nothing else." **Dann
rules whether they join.** The cost if he says yes is small and known: delete two
rules, add two `StationHeader` call sites, and the two components stop declaring
type at all.

### 2.4 The station the mockup calls Piece is labelled Metadata

`fable-gui-mockup_r1_2026-08-18.html:310` draws the label as **Piece**. The tree
renders `meta.heading`, which is "Metadata" and « Métadonnées ». Every ruling and
every memo since has called the station Piece. **Not changed: Dann writes copy,
and both strings are already ratified French.** Naming it is one i18n edit
whenever he wants it.

---

## 3. Decisions this brief did not rule

### 3.1 A component, not a `:global` rule or a token set

`StationHeader.svelte`. **A `:global` rule fixes the CSS and leaves five copies of
the markup**, so ruling 2's gap would still be kept by hand at each site, which is
precisely how it drifted. It also gives ship two nothing: ship two has to turn
every header into a control with `aria-expanded` and a key, and that would be five
edits instead of one. The markup is the thing that has to stay identical, not only
the values. A token set has the same problem one level down.

`NotationFields`' two differences came through as props, not as exceptions:
`accent` (defaulting to `var(--sage)`, unconditional, per N.73 S3 ship two) and
`tight`, which is the collapsed no-gap case with its original reasoning kept.

### 3.2 The gap is `0.4rem`, and it is the tree's own value

Four of the five declarations already carried `margin-bottom: 0.4rem`, and it
measured 6.39 px. No new step was invented. **The one station that broke it was
SONGS**, at 12.39 px, because `.song-list` was a flex column with `gap: 6px` and
the header sat inside it, so the column's gap added to the header's margin. The
fix is structural rather than numeric: a station's body is its own box and the
header is not in it (`.station-body`). Every station now measures 6.39 px.

### 3.3 The result summary moved inside Analysis

The words-and-milliseconds line stood between two stations. Source's new boundary
leaves it nowhere to stand, and the ratified r1 mockup draws it inside Analysis
beside "select a word to inspect it"
(`fable-gui-mockup_r1_2026-08-18.html:322-324`). It reports a reading of the text
rather than an act on it. Its `margin-top: -4px` went with the move: that value
tightened it against an uploader that is no longer above it.

`RootPanel`'s own comment said merging the summary INTO the Analysis header is "a
station boundary nobody has ruled." It is still not merged. It is a separate first
entry inside the station.

### 3.4 Output has no label, and that is the do-nothing

Dann's ruling 4 names Source and only Source. The r1 mockup draws an OUTPUT label
(`:325`), he has not ruled it, and its French is NOT ESTABLISHED. **Ship one does
not invent one.** The row is grouped as a station (`RootPanel.svelte:367`) and the
header's slot is that element's first child, the same position `StationHeader`
takes in the other four. Ship two has to give every station a retractable header
anyway, so it lands there with his string and no rework.

### 3.5 Station spacing in the scroll is 12px, three times

`.console-section`, `.output-section`, and `.song-section` share one
`margin-top: 12px` (deleted on the walk; see §7.2). 12px was the value the tree
already spent between Analysis and Songs; with `.root-panel`'s own 6px flex gap
it is 18px at each of the three steps. Source takes none, being first under the
anchor's rule.

### 3.6 Source's two buttons keep their old widths

`grid-template-columns: 1fr 2fr` (`RootPanel.svelte:636`), which is the 1fr Clear and the 2fr Transcribe
held inside the deleted `1fr 1fr 2fr`. Output is `repeat(3, 1fr)`. `Export all
songs` was that grid's 2fr third column and is now a fourth cell that wraps to the
first column of a second row, still shown only above one song.

### 3.7 The fifth declaration was renamed, not folded

`Drawer.svelte`'s `.section-label` heads the table of contents in Learn and Guide.
It is **not** a station label: its colour is those rooms' ruled rose and cobalt,
not sage, and its 1rem gap belongs to a nav list. Folding it in would fail §3.5's
own test, which says every station label matches on colour. It carried the station
label's name anyway, which is how a fifth copy of that recipe came to exist and
drift, so it is `.toc-heading` now, values unchanged. **One name for one concept.**

---

## 4. §3.5, item by item

### Item 1. Every station label measures identically

Measured live at 1440x900 and again at 375x667. **The two viewports returned the
same table**, so nothing below is display-dependent.

| station | text | font-size | weight | letter-spacing | text-transform | colour | gap to first entry |
|---|---|---|---|---|---|---|---|
| Piece | Metadata | 11.2px | 600 | 1.344px | uppercase | `rgb(139, 154, 125)` | 6.39px |
| Notation | Notation | 11.2px | 600 | 1.344px | uppercase | `rgb(139, 154, 125)` | none, collapsed |
| Source | Source | 11.2px | 600 | 1.344px | uppercase | `rgb(139, 154, 125)` | 6.39px |
| Analysis | Analysis | 11.2px | 600 | 1.344px | uppercase | `rgb(139, 154, 125)` | 6.39px |
| Songs | Songs | 11.2px | 600 | 1.344px | uppercase | `rgb(139, 154, 125)` | 6.39px |

`rgb(139, 154, 125)` is `--sage`, #8B9A7D. Every value is identical across all
five. **Before the build, SONGS measured 12.39px** and the other three measured
6.39px; SOURCE did not exist.

NOTATION collapsed carries no gap because nothing follows it, which is its
original ruling kept as the `tight` prop.

**The sixth heading in the drawer, SHIFT LYRICS, does NOT match: 11px, 0.88px,
`rgb(106, 101, 95)`.** It is not a station. §2.3 above.

### Item 2. One line under NOTATION

One CSS rule, and only ever one: `.drawer-anchor-top`'s `2px double
var(--ink-primary)`, which §7.1 then made sage on Dann's ruling. The second heavy line 28 px beneath it
was the textarea's 3px sage border, now 1px. §2.1 above carries the measurement
and the instrument check.

### Item 3. SOURCE is labelled, Clear and Transcribe sit under the textarea

Rendered order inside the SOURCE station, read from the live DOM: the label, the
textarea with its OCR scanner, the character warning and OCR error when they
exist, the score drop zone and its Finale disclosure, then `Clear text` and
`Transcribe`, then the transcription error when it exists.

`.source-actions` reads `["Clear text", "Transcribe"]`. Two buttons, not three.
The transcription error moved inside Source: it reports the failure of the button
that produced it.

### Item 4. Print sits beside Export and Import

`.output-row` reads `["Print", "Export this song", "Import a song"]`.

### Item 5. Every remaining horizontal rule, and what it separates

Measured in the browser after the build, at 1440x900, on Studio/Transcription.
**Field and control perimeters are omitted**: a box drawn around an input is not a
divider, and the drawer holds eleven of them (five metadata fields, the textarea,
the drop zone, and the action buttons).

| rule | where | what it separates | verdict |
|---|---|---|---|
| `2px double var(--ink-primary)`, bottom | `.drawer-anchor-top` | the pinned Piece-and-Notation anchor from the scroll | **anchor boundary. Kept.** |
| `2px double var(--ink-primary)`, top | `.drawer-anchor-bottom` | the scroll from the pinned voice anchor | **anchor boundary. Kept.** |
| `2px solid var(--sage)`, top | `.console-section` | Analysis from Source | **station boundary. Kept.** |
| `2px solid var(--sage)`, bottom | `.console-section` | Analysis from Output | **station boundary. Kept.** |
| `2px double var(--ink-primary)`, bottom | `.takeover-head` | the calibration takeover's one back affordance from the ritual | **neither. Named and left. Dann rules.** |
| `1px solid var(--stone-300)`, top | `.mus-help`, `ScoreUploader.svelte:927` | the score drop zone from the older-Finale micro-help | **neither. Named and left. Dann rules.** |

**Nothing was deleted under ruling 3, and nothing was added.** Every rule in the
drawer already had a function or is named above for Dann. Adding boundaries above
Output and above Songs, so all four scrolling stations were separated the same
way, was considered and rejected: ruling 3 is about deleting lines without a
function, and the drawer Dann called over-ruled is not improved by two more.

**Two notes on the two I left.**

`.takeover-head`'s rule is arguably an anchor boundary by analogy, since it pins
the exit above a scrolling ritual and uses the anchors' own 2px double. It is
inside the takeover, which is not a station, so I did not stretch the word.

`.mus-help`'s rule separates a station's body from an aside inside the same
station. Brief §2 also says to stop and report rather than edit `ScoreUploader`
internals, so two rules point the same way. **The border-width change at
`ScoreUploader.svelte:709` is the one edit I made to that file, and §3.6
instructs it by name.**

**One difference from the ratified mockup, recorded not acted on.**
`fable-gui-mockup_r1_2026-08-18.html:89,106-107` draws station boundaries at 1px
and anchor boundaries at 2px, a deliberate hierarchy. The tree draws the station
boundary at 2px sage. **The tree wins per tether 3**, and it is what shipped and
what Dann walked without objecting. Worth one word from him on this walk.

### Item 6. The textarea's placeholder renders roman

`RootPanel.svelte:532`. `font-style: italic` deleted, colour untouched.
`.meta-input::placeholder` was already colour only, so the two match now. **RULED
by Dann, 2026-08-20: "just make it consistent with its twin."**

`.text-input`'s body font is still `var(--font-serif)` and was not touched. §3.6
says why.

### Item 7. Both intakes at 1 px in their existing hue. **THIS ONE IS NOT RULED.**

**Dann rules this by looking at it. The desk proposed it and I built the
proposal, so a walk that dislikes it is the ruling, not a defect.**

| field | before | after, measured live |
|---|---|---|
| `.text-input` | `3px solid var(--sage)`, painted by an `!important` global | `1px solid rgb(139, 154, 125)` |
| `.dropzone` | `3px solid var(--deeper-lavender)` | `1px solid rgb(142, 126, 155)` |

`rgb(139, 154, 125)` is `--sage` #8B9A7D. `rgb(142, 126, 155)` is
`--deeper-lavender` #8E7E9B. **No hue changed.** Sage still names the text intake
and lavender still names the score intake, which Dann ruled right.

The drop zone's `min-height: 152px` is `box-sizing: border-box`, so it kept its
outer height and gained 4 px of interior.

### Item 8. All five gates at baseline

Run on this machine, after the build, in this order.

| gate | baseline | this run |
|---|---|---|
| phonology | 216 | **216 passed (216)**, 7 files |
| dictionary | 235 | **235 passed (235)**, 4 files |
| web-check | 0 errors, 7 warnings, 4 files | **0 errors and 7 warnings in 4 files** |
| web-test | 682 | **682 passed (682)**, 38 files |
| score-parser | 444 passed, 5 skipped | **444 passed, 5 skipped (449)**, 20 files |

**Nothing moved, so no permission is needed and the ship script's counts stay
where they are.**

---

## 5. NOT ESTABLISHED

1. **The French for SOURCE is adopted by identity, not coined, and Dann has not
   seen it.** `i18n.ts:178` ships `{ en: 'Source', fr: 'Source' }`. « Source » is
   the same word and the same standard noun in French, so no French was written.
   **The brief said not to ship a French string he has not approved, and an empty
   slot was not available**: `t()` returns `[MISSING: source.heading]` for an
   absent value (`i18n.ts:811-815`), which would print that string in the drawer
   in French. The precedent for recording an invariant as identical en/fr values
   rather than as an absence is this file's own tab-bar comment on
   `tab.transcription` and `tab.guide`. **Settled by: Dann, in one word, on the
   walk.** Verified live: the French drawer reads Métadonnées, Notation, Source,
   Analyse, Chants, with no `[MISSING:]` anywhere in it.
2. **The label for Output, English and French both.** §3.4 above. Settled by Dann,
   and ship two is where it lands.
3. **The populated Inspector's height.** Unchanged from the brief: 365px is what
   `.console-placeholder-body` reserves and I did not measure a populated one.
   Settled by selecting a word with the Inspector open.
4. **Whether SHIFT LYRICS and the syllable station join the station recipe.**
   §2.3. Settled by Dann.
5. **Whether the station boundary should be 1px, as the mockup draws it, or the
   2px sage the tree ships.** Item 5. Settled by Dann on this walk.
6. **The drawer's height on a real phone.** `.drawer-content`'s `clientHeight`
   read 347 at a 375x667 viewport in this session, against the 300 `STATE.md`
   records for `63c2bb4`. **Do not use that number.** Playwright at 375 wide is
   not a touch device: `pointer: coarse` never matched, so the coarse-pointer
   rules did not apply and Ilya's own mobile gate did not fire. The instrument was
   not the one that produced the recorded figures. **Ship two asks for ten
   numbers at five sizes, and it must emulate a real phone to get them.**

---

## 6. What I did not touch

No `ProfileSwitcher`, no `CalibrationWizard`, no `SearchableSelect`. **No collapse
mechanism was retired**, per brief §2. `ScoreUploader` was touched once, at
`:709`, for the border width §3.6 instructs by name, and nothing else in it moved.

Nothing retracts yet. Every station header is inert text, exactly as before, and
NOTATION's disclosure is the one control among them, exactly as before. **Ruling 1
and ruling 5 are ship two.**

---

## 7. THE WALK REPAIR. Dann's rulings of 2026-08-20 on ship one, built and re-gated

Two rulings, and both are his. **Neither is a consequence I noticed.**

### 7.1 One boundary treatment for the whole drawer

**HIS RULING.** The three horizontal `2px double var(--ink-primary)` rules become
`2px solid var(--sage)`, the sage horizontal that `.console-section` already drew
above Analysis. Three sites, all named by him: `.drawer-anchor-top`,
`.drawer-anchor-bottom`, and `.takeover-head`. Built at `Drawer.svelte:672`,
`:680`, and `:699`.

**HE GAVE UP THE FRAME-VERSUS-STATION DISTINCTION KNOWINGLY, AND RULED THAT IT IS
WORTH GIVING UP.** The old pair said two different things: the ink double marked a
FRAME boundary, around the pinned shelves and the takeover, and the sage marked a
STATION boundary, between Analysis and its neighbours. One treatment cannot say
which is which, and after this the drawer no longer tells a singer that a pinned
shelf is a different kind of thing from a station. **That is his call, made with
the trade in front of him, and it is not a defect to repair later.** A drawer with
one horizontal is worth more to him than a drawer that grades its horizontals.

**The reasoning that argued the other way is deleted rather than left standing.**
`Drawer.svelte`'s anchor comment used to say the shelves must take the drawer's ink
rather than sage "because these shelves are shared by two documents and must not
carry either one's identity colour." That argument was already spent before his
ruling: N.73 S3 ship two made NOTATION's accent unconditionally sage and the S0
slate kept lavender to the voice anchor alone, so every station label in the drawer
is sage on both documents already.

**The comment above `.drawer-anchor-top` is rewritten** (`Drawer.svelte:661`). The
old one explained the rule's direction and its padding and never once said why the
style was `double`, which is the question Dann had to ask. The new one states what
the rule means, names him and the date, names all four sites that draw it, records
what he gave up, and says not to restore it as a fix.

**ONE `2px double` SURVIVES AND I LEFT IT: `.drawer-body`'s `border-right`
(`Drawer.svelte:600`).** He named three sites and this is not one of them. It is
the drawer's outer edge against the desk, a vertical spine rather than a rule
inside the drawer, so no singer sees it beside a sage horizontal. **If "one
boundary treatment for the whole drawer" is meant to reach it, that is one word
and one line.**

### 7.2 The station recipe, modelled on Analysis

**HIS RULING, in his words: "consistent spacing and consistent section dividing
lines modelled after Analysis, make Notation and Source and Metadata match."**

Analysis is the model, and the recipe is measured off what `.console-section`
already drew:

> a 2px sage rule, 6px, the label, the label's own 0.4rem, the body, 6px, the next
> station's rule

It is `RootPanel.svelte:705` and every station answers to it.

**One rule per boundary, drawn by the station BELOW it.** Analysis used to draw
both its own, which is the whole reason it was the only station with lines: its
neighbours drew none. Output and Songs draw their own top rule now, so Analysis's
`border-bottom` is deleted rather than doubled (`RootPanel.svelte:751`).

**Two stations are exceptions, and each is one line with a reason:**

- **Piece draws no rule above** (`MetadataFields.svelte:148`). It is first in the
  drawer and the app header already bounds it. A rule there would draw against that
  band and separate nothing. Notation draws the rule between the two
  (`NotationFields.svelte:222`).
- **Source draws no rule above** (`RootPanel.svelte:715`). The top anchor's own
  boundary sits directly above it, and the two would land within 20px of each
  other. **That is the double line again, so this exception exists specifically to
  prevent re-creating the defect this repair closes.** The anchor's rule is Source's
  top boundary and it is the same 2px sage.

**Two containers stopped owning vertical measure**, because they were spending it
on top of each station's own and making the space above a label depend on which
station it was: `.root-panel` lost its `gap: 6px` and its `20px` top padding
(`RootPanel.svelte:412`), and `.drawer-anchor-top` lost its `gap: 6px` and its
`12px` vertical padding (`Drawer.svelte:661`).

### 7.3 The ladder, measured after the repair

Read from the live DOM at 1440x900, top to bottom. **Every rule is 2px solid
`rgb(139, 154, 125)`, which is `--sage` #8B9A7D. There is no other horizontal rule
in the drawer.**

| rule, at y | station below it | clear space to that label |
|---|---|---|
| none, drawer top | Piece | 6px |
| 278.69, `.cosmetic-section` | Notation | 6px |
| 311.48, `.drawer-anchor-top` | Source | 6px |
| 758.30, `.console-section` | Analysis | 6px |
| 1184.48, `.output-section` | Output, unlabelled | 6px |
| 1232.86, `.song-section` | Songs | 6px |
| 947.63, `.drawer-anchor-bottom` | the voice line, not a station | 9px, `VoiceAnchor`'s own |

The voice anchor's row is out of sequence in that list because it is pinned, so its
viewport y falls among the scrolling figures rather than after them.

**The label table in §4 item 1 is unchanged by this repair.** All five station
labels still measure 11.2px, 600, 1.344px, uppercase, `rgb(139, 154, 125)`, with a
6.39px gap to the first entry.

### 7.4 Gates, re-run after the repair

| gate | baseline | this run |
|---|---|---|
| phonology | 216 | **216 passed (216)**, 7 files |
| dictionary | 235 | **235 passed (235)**, 4 files |
| web-check | 0 errors, 7 warnings, 4 files | **0 errors and 7 warnings in 4 files** |
| web-test | 682 | **682 passed (682)**, 38 files |
| score-parser | 444 passed, 5 skipped | **444 passed, 5 skipped (449)**, 20 files |

**Nothing moved.**

### 7.5 What this repair changes in the rest of this memo

§4 item 5's divider inventory is superseded by §7.3. Two rows of it are now wrong:
the two `2px double` anchor rules are sage, and Analysis's `border-bottom` no longer
exists. **`.takeover-head` and `.mus-help` still stand exactly as §4 item 5 reports
them**: the takeover's rule is sage now but still separates a back affordance from a
ritual, which is neither a station nor an anchor boundary, and `.mus-help`'s 1px
stone rule is untouched inside `ScoreUploader`. **Both are still Dann's to rule.**

§4 item 5 also recorded that the r1 mockup draws station boundaries at 1px against
the anchors' 2px, a hierarchy the tree did not follow. **That question is closed:
his ruling is one treatment at 2px, and the mockup's hierarchy is the thing he
declined.**

---
*Written by Code, 2026-08-20 late. Every measurement in this memo was taken in a
real Chromium through Playwright against the dev server, not read out of the
source. Every count came from a gate run on this machine.*
