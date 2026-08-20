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
| Analysis onto that owner | `RootPanel.svelte:378` |
| Songs onto that owner, and its 6px double-gap fixed | `SongList.svelte:22,105,114,183-190` |
| The fifth declaration renamed, not folded | `Drawer.svelte:264,434,909-925` |
| SOURCE, a labelled station | `RootPanel.svelte:195-197` |
| Clear and Transcribe at Source's foot | `RootPanel.svelte:273-295` |
| Print beside Export and Import | `RootPanel.svelte:319-334` |
| The `1fr 1fr 2fr` grid deleted | `RootPanel.svelte:698-710` |
| The station body box, so the header owns the gap | `RootPanel.svelte:798`, `SongList.svelte:187` |
| The placeholder's italic deleted, RULED | `RootPanel.svelte:577` |
| Both field perimeters 3px to 1px, NOT RULED | `RootPanel.svelte:538`, `ScoreUploader.svelte:722` |
| The `!important` global that actually painted the border, deleted | `+page.svelte:2863-2877` |
| `source.heading` | `i18n.ts:186` |

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
are on `.text-input` now (`RootPanel.svelte:538,569`) and the `!important` is
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
not invent one.** The row is grouped as a station (`RootPanel.svelte:319`) and the
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

`grid-template-columns: 1fr 2fr` (`RootPanel.svelte:698`), which is the 1fr Clear and the 2fr Transcribe
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
| `1px solid var(--stone-300)`, top | `.mus-help`, `ScoreUploader.svelte:952` | the score drop zone from the older-Finale micro-help | **neither. Named and left. Dann rules.** |

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
`ScoreUploader.svelte:722` was the one edit I made to that file at the time, and
§3.6 instructs it by name.** §9 added two more, both instructed by the watermarks
brief.

**One difference from the ratified mockup, recorded not acted on.**
`fable-gui-mockup_r1_2026-08-18.html:89,106-107` draws station boundaries at 1px
and anchor boundaries at 2px, a deliberate hierarchy. The tree draws the station
boundary at 2px sage. **The tree wins per tether 3**, and it is what shipped and
what Dann walked without objecting. Worth one word from him on this walk.

### Item 6. The textarea's placeholder renders roman

`RootPanel.svelte:577`. `font-style: italic` deleted, colour untouched.
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
   seen it.** `i18n.ts:186` ships `{ en: 'Source', fr: 'Source' }`. « Source » is
   the same word and the same standard noun in French, so no French was written.
   **The brief said not to ship a French string he has not approved, and an empty
   slot was not available**: `t()` returns `[MISSING: source.heading]` for an
   absent value (`i18n.ts:822-826`), which would print that string in the drawer
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
`.drawer-anchor-bottom`, and `.takeover-head`. Built at `Drawer.svelte:689`,
`:702`, and `:724`.

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

**The comment above `.drawer-anchor-top` is rewritten** (`Drawer.svelte:667`). The
old one explained the rule's direction and its padding and never once said why the
style was `double`, which is the question Dann had to ask. The new one states what
the rule means, names him and the date, names all four sites that draw it, records
what he gave up, and says not to restore it as a fix.

**ONE `2px double` SURVIVES AND I LEFT IT: `.drawer-body`'s `border-right`
(then `Drawer.svelte:600`).** He named three sites and this is not one of them. It is
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

**That last 6px is 12px since the second walk. §8.3 has the ruling.**

It is `RootPanel.svelte:767` and every station answers to it.

**One rule per boundary, drawn by the station BELOW it.** Analysis used to draw
both its own, which is the whole reason it was the only station with lines: its
neighbours drew none. Output and Songs draw their own top rule now, so Analysis's
`border-bottom` is deleted rather than doubled (`RootPanel.svelte:824`).

**Two stations are exceptions, and each is one line with a reason:**

- **Piece draws no rule above** (`MetadataFields.svelte:148`). It is first in the
  drawer and the app header already bounds it. A rule there would draw against that
  band and separate nothing. Notation draws the rule between the two
  (`NotationFields.svelte:222`).
- **Source draws no rule above** (`RootPanel.svelte:788`). The top anchor's own
  boundary sits directly above it, and the two would land within 20px of each
  other. **That is the double line again, so this exception exists specifically to
  prevent re-creating the defect this repair closes.** The anchor's rule is Source's
  top boundary and it is the same 2px sage.

**Two containers stopped owning vertical measure**, because they were spending it
on top of each station's own and making the space above a label depend on which
station it was: `.root-panel` lost its `gap: 6px` and its `20px` top padding
(`RootPanel.svelte:434`), and `.drawer-anchor-top` lost its `gap: 6px` and its
`12px` vertical padding (`Drawer.svelte:667`).

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

## 8. THE SECOND WALK. Dann's reorder and four repairs from `f59f7d2`

Still ship one's walk. **Ship two is not started.** Metadata's retraction chevron
was asked for and is brief §4's; no retraction is built in this pass.

### 8.1 THE ARRANGEMENT, ruled by Dann

**Source, then Output, then Songs, then Analysis**, with shanePanel's score work
and notices following and the voice anchor still pinned below all of it. Built by
moving one block in `RootPanel.svelte`; nothing inside any station changed. The
scroll now reads, measured from the live DOM:

| position | station | padding |
|---|---|---|
| 1 | Source | `6px 0 12px` |
| 2 | Output, unlabelled | `6px 0 12px` |
| 3 | Songs | `6px 0 12px` |
| 4 | Analysis | `6px 0 12px` |

**THIS REVERSES N.73 S3 SHIP TWO, KNOWINGLY, AND THAT IS HIS RULING.** Ship two put
Analysis above Output on the spec's station order
(`fable-gui-audit-and-spec_r1_2026-08-18.md:119-121`) and the ratified mockup's four
stations (`fable-gui-mockup_r1_2026-08-18.html:313-329`). **Both documents were
written before the anchors existed**, so neither weighed a 365px Inspector against a
pinned drawer, and he overturned them on what the drawer actually became. Tether 17
is the whole of it: a ruling is a source, and these two are now amended.

**His reason, in his terms:** the song comes in and goes out at the top, the
performance sits together at the bottom, and Print stops being stranded across 365px
of empty Analysis from the fields it belongs with.

The old comment on that block argued the opposite from those two documents. It is
replaced rather than left standing (`RootPanel.svelte:354`).

### 8.2 One inset for every rule

**The line above SOURCE ran full bleed and NOTATION's started 1rem in.** The cause is
mechanical: a border draws on the border box, so the 1rem of PADDING that
`.drawer-anchor-top`, `.drawer-anchor-bottom`, and `.takeover-head` each carried sat
INSIDE the border and the rule spanned the whole drawer. Every station rule in
`RootPanel` was already inset, because those boxes sit inside `.root-panel`'s own
1rem.

**The fix is the same 1rem moved to the other side of the border**: side margin
instead of side padding, at `Drawer.svelte:688`, `:701`, and `:723`.
`VoiceAnchor.svelte:69` gave its 1rem up to the shelf above it and keeps its 9px.
No pseudo-elements, no compensation arithmetic, and the left edge of every pinned
line is unchanged.

**Measured after the change**, every sage rule in the drawer, against the drawer
body's own box at 1440x900:

| rule | left inset | right inset |
|---|---|---|
| `.cosmetic-section` top, above Notation | 16px | 18px |
| `.drawer-anchor-top` bottom, above Source | 16px | 18px |
| `.output-section` top | 16px | 18px |
| `.song-section` top | 16px | 18px |
| `.console-section` top, above Analysis | 16px | 18px |
| `.drawer-anchor-bottom` top, above the voice line | 16px | 18px |
| `.takeover-head` bottom, inside the ritual | 16px | 18px |

16px is 1rem. The right figure is 18px on every row because the drawer's own 2px
spine sits outside the content. **One inset, seven rules, no exceptions.**

### 8.3 More room below a station body

`.section`'s padding goes from `6px 0` to **`6px 0 12px`** (`RootPanel.svelte:767`).
**12px is the step this drawer already used between stations** before this ship
folded that step into the recipe; no new value enters the scale.

**Applied to every station, not to Source alone**, and the asymmetry is deliberate: a
label belongs to the rule above it, so 6px keeps it close, and a body has finished
saying its piece, so 12px gives it air before the next rule. Spending 12px on both
would push each label away from the line that names it.

### 8.4 THE PLACEHOLDERS. Measured first, then changed

**The desk fixed the wrong difference twice. The table in this section is the reason
it will not happen a third time: it was taken before anything was touched.** Both
displays, every placeholder-bearing control in the drawer, computed from the live
DOM. The phone run emulates touch, and `matchMedia('(pointer: coarse)')` was
confirmed `true` before reading anything.

**Before, on `f59f7d2`:**

| control | tag | family | size | style | weight | colour |
|---|---|---|---|---|---|---|
| **desktop 1440x900** | | | | | | |
| `.meta-input`, title | `input` | Source Sans 3 | 12.8px | normal | 400 | `rgb(106, 101, 95)` |
| `.meta-input`, opus | `input` | Source Sans 3 | 12.8px | normal | 400 | `rgb(106, 101, 95)` |
| `.select-trigger`, composer | `button` | Source Sans 3 | 12.8px | normal | 400 | `rgb(106, 101, 95)` |
| `.select-trigger`, poet | `button` | Source Sans 3 | 12.8px | normal | 400 | `rgb(106, 101, 95)` |
| `.select-trigger`, translator | `button` | Source Sans 3 | 12.8px | normal | 400 | `rgb(106, 101, 95)` |
| `.select-search`, filter | `input` | Source Sans 3 | **12.48px** | normal | 400 | `rgb(106, 101, 95)` |
| `.text-input`, paste | `textarea` | **Source Serif 4** | **14.4px** | normal | 400 | `rgb(106, 101, 95)` |
| **phone 375x667, touch** | | | | | | |
| `.meta-input`, title | `input` | Source Sans 3 | **16px** | normal | 400 | `rgb(106, 101, 95)` |
| `.meta-input`, opus | `input` | Source Sans 3 | **16px** | normal | 400 | `rgb(106, 101, 95)` |
| `.select-trigger`, composer | `button` | Source Sans 3 | **12.8px** | normal | 400 | `rgb(106, 101, 95)` |
| `.select-trigger`, poet | `button` | Source Sans 3 | **12.8px** | normal | 400 | `rgb(106, 101, 95)` |
| `.select-trigger`, translator | `button` | Source Sans 3 | **12.8px** | normal | 400 | `rgb(106, 101, 95)` |
| `.select-search`, filter | `input` | Source Sans 3 | **16px** | normal | 400 | `rgb(106, 101, 95)` |
| `.text-input`, paste | `textarea` | **Source Serif 4** | **16px** | normal | 400 | `rgb(106, 101, 95)` |

**Style, weight, and colour were never the difference.** They were already
`normal / 400 / rgb(106, 101, 95)` on all seven, on both displays. **The italic two
earlier passes deleted was real but it was the smallest of three differences and not
the one Dann was pointing at.**

**THREE CAUSES, all measured, none of them in the rules the earlier passes read.**

1. **`app.css`'s N.23 block does not name `button`.** It sets
   `input, select, textarea { font-size: max(1rem, 16px) !important }` under
   `@media (pointer: coarse)`, for iOS Safari's focus zoom, and it is right to
   exist. `.select-trigger` is a `<button>`, so on the phone title and opus jump to
   16px and composer, poet, and translator stay at 12.8px. **That is Dann's two
   sizes among five fields, reproduced.** The three files he named declare sans 0.8,
   sans 0.8, and serif 0.9, and none of them could explain it, because what explains
   it is in a fourth file and is an `!important` in a media query.
2. **`.text-input`'s placeholder inherits the poem's serif.** A `::placeholder`
   takes its control's font, and that control is deliberately `var(--font-serif)` at
   0.9rem for the Russian it holds. So the placeholder rendered Source Serif 4 where
   every sibling rendered Source Sans 3.
3. **`.select-search` declared `0.78rem`**, a third size at 12.48px, for no reason
   anyone recorded.

**THE ONE TREATMENT I CHOSE, and why:** *every placeholder in the drawer is the
Instrument voice at the field size for that display.* `var(--font-sans)`, roman,
weight 400, `--ink-tertiary`, at 0.8rem on a fine pointer and 16px on a coarse one.

**Brief §3.6 already ruled the principle** and the desk had only half-applied it:
"The placeholder is instruction, so it belongs to the Instrument voice." Instruction
is sans at the same size as the field beside it. **The textarea's BODY is untouched
and stays Source Serif 4 at 14.4px**, verified after the change, because §3.6 also
rules that its contents are a poem and the Reading voice is correct there. **The two
voices now split at the right seam**: what Ilya says to you is sans, what you give
Ilya is serif.

Three edits: `app.css:312` adds `.select-trigger` to the coarse-pointer list,
`app.css:321` carries the same size to `::placeholder` so an explicitly sized one
cannot fall behind, and `RootPanel.svelte:577` moves the textarea's placeholder to
sans 0.8rem. `SearchableSelect.svelte:317` takes 0.78rem to 0.8rem;
`.custom-option` keeps its own 0.78rem, being a dropdown row rather than a field.

**A button cannot take Safari's focus zoom**, so `.select-trigger` does not need
16px for N.23's own reason. It takes it to stand beside its siblings, because those
five are one row of fields and a singer reads them together.

**After, measured the same way:**

| display | all seven controls |
|---|---|
| desktop 1440x900 | Source Sans 3, **12.8px**, normal, 400, `rgb(106, 101, 95)` |
| phone 375x667, touch | Source Sans 3, **16px**, normal, 400, `rgb(106, 101, 95)` |

One treatment, one size per display, no exceptions.

### 8.5 The last double line

`.drawer-body`'s `border-right` is `2px solid var(--sage)`
(`Drawer.svelte:606`). **Dann's ruling, and he is right: the desk's "vertical spine,
not a horizontal rule" is a distinction in the stylesheet and not in anyone's eye.
It is the same mark.** There is no `double` border left anywhere in the drawer.

### 8.6 Gates, re-run after the second walk

| gate | baseline | this run |
|---|---|---|
| phonology | 216 | **216 passed (216)**, 7 files |
| dictionary | 235 | **235 passed (235)**, 4 files |
| web-check | 0 errors, 7 warnings, 4 files | **0 errors and 7 warnings in 4 files** |
| web-test | 682 | **682 passed (682)**, 38 files |
| score-parser | 444 passed, 5 skipped | **444 passed, 5 skipped (449)**, 20 files |

**Nothing moved.** No page errors on load, on entering the calibration takeover, or
on backing out of it.

### 8.7 What this walk changes in the rest of this memo

- **§3.5's station step is gone.** The 12px `margin-top` it described was folded into
  the recipe on the first walk and the recipe's own `padding-bottom` is 12px now.
- **§7.3's ladder still holds for spacing** (6px from every rule to its label) but its
  y figures are from the old order. §8.1 has the order.
- **§4 item 5's inventory is superseded twice over.** §7.3 made every rule sage;
  §8.2 gave every rule one inset. `.mus-help`'s 1px stone rule inside `ScoreUploader`
  (`ScoreUploader.svelte:952`) is the one horizontal in the drawer that is still
  neither a station nor an anchor boundary, and it is still Dann's to rule.
- **§7.2's recipe quote reads 6px below the body.** It is 12px since §8.3.
- **§2.1's account of the double line stands as measured** and is now moot: no
  `double` border survives anywhere.

---

## 9. THE INTAKE WATERMARKS

**Built against `docs/sessions/brief-to-code-drawer-watermarks_r1_2026-08-20.md`,
read in full this session, on Dann's ruling of 2026-08-20. Ship two of the
stations brief is still NOT started, and nothing here retracts.**

### 9.1 What shipped

| what | where |
|---|---|
| One owner for the watermark | `apps/web/src/lib/components/Drawer/IntakeWatermark.svelte`, new file |
| `text` in light sage, empty textarea only | `RootPanel.svelte:7,208` |
| `score` in light lavender, idle drop zone only | `ScoreUploader.svelte:23,516` |
| The white fill moved to the wrapper so the mark can sit under the placeholder | `RootPanel.svelte:521,538` |
| The drop zone's three lines lifted above the mark | `ScoreUploader.svelte:699,781` |
| `input.watermark`, `upload.watermark` | `i18n.ts:57,291` |

**A component rather than two copies**, for the reason the brief itself gives in
§4: this mark defines the oversized-sans convention rather than inheriting one, so
it needs a single place to be defined in. Same argument as `StationHeader`.

### 9.2 The size, and the constraint that turned out not to bind

**40px, weight 700, `letter-spacing: -0.01em`, `line-height: 1.04`, on the
project's own `--font-sans`.**

**All four shape values are ADOPTED, not invented.** They are
`fable-gui-mockup_r2_2026-08-18.html:94-95`, the `.room-band h2` of Exhibit 2,
which is the only oversized sans this project has drawn. The family is the
project's `--font-sans` rather than the mockup's stand-in, per §4.

**THE BRIEF'S BINDING CONSTRAINT DOES NOT BIND, and this is where the tree
disagrees with it.** §3 says to size the mark so `partition` fits in the narrower
box at 360x640 and then use that size everywhere, expecting `partition` to set the
ceiling. Measured at 360x640 with touch emulated and `Source Sans 3` confirmed
loaded before any width was read:

| font-size | `partition` | `texte` | `text` | `score` | fits the 262.8px drop zone |
|---|---|---|---|---|---|
| 28px | 103.73px | 58.72px | 45.25px | 62.67px | yes |
| 32px | 118.55px | 67.11px | 51.72px | 71.63px | yes |
| 36px | 133.36px | 75.50px | 58.17px | 80.56px | yes |
| **40px** | **148.19px** | **83.88px** | **64.64px** | **89.52px** | **yes** |
| 44px | 163.00px | 92.27px | 71.11px | 98.47px | yes |
| 48px | 177.81px | 100.66px | 77.56px | 107.42px | yes |
| 52px | 192.64px | 109.05px | 84.03px | 116.38px | yes |
| 56px | 207.45px | 117.42px | 90.50px | 125.33px | yes |
| 60px | 222.27px | 125.81px | 96.95px | 134.28px | yes |

**The boxes at 360x640**, measured rather than computed: the drop zone's content
box is **262.8px** and the textarea's is **237.2px**. The coordinating desk's
prediction before the measurement was about 305px for the drop zone, so the drawer
is narrower at 360 than the desk expected, and the measured figure is the one used.

**`partition` fits at every size probed, up to 60px.** Nothing in the width forces a
choice, so the brief's method could not pick a number. **I took the mockup's 40px
rather than maximizing**, because 40px is a value this project has already drawn and
any larger number would be one I invented. **The headroom is 114.61px at 360x640,
and the table is here so Dann can name a bigger number on the walk without anyone
re-measuring.**

**What DOES constrain the size is height, not width**, and the brief did not name
it: the drop zone is 152px tall and already full of centred text. §9.4 has that.

**`partition` at 360x640: 148.19px in a 262.8px box. No wrap, no clip**, confirmed
by measurement and by screenshot. It is one word with no space in it, so it has no
wrap opportunity at any size that fits.

**Why `40px` and not a `rem`:** the mockup names 40px and this adopts it whole. The
mark is decorative and `aria-hidden`, and both boxes are percentage-width, so a rem
would grow the word while its box stayed put. The placeholder underneath carries the
instruction and still scales with a raised base font, which is the part that must.

### 9.3 THIS DEFINES THE CONVENTION. The chapter bands must match it

Dann asked for the watermark to match "the large sans-serif font we use in our
colour-blocked Learn and Guide meta headers." **Those headers do not exist.** They
are drawn in `fable-gui-mockup_r2_2026-08-18.html`, Exhibit 2, and that file's own
caveat says its typefaces are stand-ins. His instruction was "the mockup can inspire
our choice. Let's see it first and adapt if it needs tweaking."

**So the direction of inheritance is reversed, and it should be recorded as such:
`IntakeWatermark.svelte` is now the project's definition of oversized sans.** When
the chapter bands are built, next in the sequence after the stations, **they match
this component**, not the mockup. The component's own comment says so at its head so
the next session does not have to find this memo.

### 9.4 THE COLLISION. Measured, reported, and LEFT, per the brief

**The brief predicted it and told me not to solve it: "Report what it actually looks
like, with a measurement, and leave it. Do not move the existing text to make room
unless Dann tells you to. It is his to rule on the walk."**

**On the desk, 1440x900**, `score` is 89.52px wide, its glyph band runs y 557.34 to
598.94, and the word spans x 214.24 to 303.76. Every one of the drop zone's three
lines crosses it, and every one of them overlaps the full 89.52px of the word
horizontally:

| line | vertical overlap with the word | horizontal overlap |
|---|---|---|
| "Drop a score here" | 8.77px | 89.52px, the whole word |
| "or click to browse" | 15.00px, the whole line | 89.52px, the whole word |
| "Accepted now: MNX, …" | 7.44px | 89.52px, the whole word |

**What it looks like: "or click to browse" is struck through by the middle of the
word, and `score` itself is close to unreadable.** The bold first line clips the tops
of the letters and the accepted-formats line crosses the descenders. **It is the
worst case of the two fields and it is worse on the desk than on the phone**, because
at 360x640 the accepted-formats line wraps to two lines, which pushes the text block
up and leaves more of `partition` in the clear.

**The textarea has no collision.** Its placeholder is one line at the top and the
mark is centred, so they do not meet. `text` reads cleanly.

**Not fixed, and the options are named rather than taken**, because this is Dann's:
move the drop zone's text block off centre, shrink the mark in that field alone
(which costs the one-size ruling), or accept it. **Build neither is live: the drop
zone still says everything it said before, and a singer who reads the words rather
than the watermark loses nothing.**

### 9.5 What the wrapper changed, per the brief's second warning

§5 asked me to say so if the textarea's wrapper changed the field's resize behaviour
or the OCR icon's position. **Measured before and after, on the desk:**

| | before | after |
|---|---|---|
| textarea box | x 16, y 340.67, 486 x 147.47 | **unchanged** |
| textarea `resize` | `vertical` | **`vertical`** |
| OCR button box | x 468, y 346.67, 28 x 28 | **unchanged** |
| wrapper height | 154.47px | **147.47px** |
| gap between wrapper and textarea | 7px | **0px** |

**One thing changed and it is the 7px.** The textarea was `display: inline-block`, so
it sat on a text baseline and left a 7px strip of wrapper beneath it. That strip was
invisible while the wrapper had no background. It would be a white shelf under the
field now that the wrapper carries the white, so the textarea is `display: block`.
**That 7px was never a designed gap**, and removing it tightens the space between the
textarea and the drop zone below by the same 7px. Reported rather than preserved,
because preserving it would mean writing an accident down as a value.

**Why the white moved at all:** a `::placeholder` belongs to the textarea, so a mark
can only get behind it by getting behind the textarea, and a mark behind an opaque
textarea is a mark nobody sees. The fill moved up one box and the field looks
identical. The drop zone needed no such surgery: its three lines are real elements,
so they take `z-index: 1` and the mark stays where it is.

### 9.6 §6, item by item

1. **`text` centred in the textarea in light sage, `score` centred in the drop zone
   in light lavender.** Measured: `rgb(168, 181, 160)` is `--light-sage` #A8B5A0 and
   `rgb(196, 186, 207)` is `--light-lavender` #C4BACF. Both 40px, weight 700,
   Source Sans 3, `-0.4px` tracking, which is `-0.01em` at this size.
2. **Both vanish and return.** Read from the live DOM: two marks with an empty
   field, one after typing `Я вас любил`, two again after `Clear text`. The drop
   zone's mark needs no predicate of its own, because that branch only renders while
   `ui.kind === 'idle'`, which is the empty state.
3. **The placeholder and the drop zone's lines are still readable.** The placeholder
   is, with no overlap at all. **The drop zone's three lines are readable and the
   WATERMARK is the thing that loses.** §9.4.
4. **French reads `texte` and `partition`.** Verified on both viewports, and no
   `[MISSING:]` anywhere in the drawer in either language.
5. **`partition` neither wraps nor clips at 360x640**, and both fields use 40px.
   §9.2.
6. **Dragging to select does not catch the watermark.** Two checks: dragging across
   the empty textarea leaves `window.getSelection()` empty, and select-all after
   typing returns `"Я вас любил"` and nothing else. `user-select: none` and
   `pointer-events: none`, and `document.elementFromPoint` at the centre of each
   field returns the textarea and `p.dz-browse`, never the mark.
7. **All five gates at baseline.**

| gate | baseline | this run |
|---|---|---|
| phonology | 216 | **216 passed (216)**, 7 files |
| dictionary | 235 | **235 passed (235)**, 4 files |
| web-check | 0 errors, 7 warnings, 4 files | **0 errors and 7 warnings in 4 files** |
| web-test | 682 | **682 passed (682)**, 38 files |
| score-parser | 444 passed, 5 skipped | **444 passed, 5 skipped (449)**, 20 files |

**Nothing moved.** No page errors on load, on typing, on clearing, or on dragging.

### 9.7 Decisions this brief did not rule

- **The keys are namespaced by surface, not by concept.** `input.watermark` and
  `upload.watermark`, because every other string in `i18n.ts` is grouped by the
  surface that shows it. A `watermark.*` namespace would split one field's strings
  across two places.
- **40px rather than the largest size that fits.** §9.2.
- **`px` rather than `rem`.** §9.2.
- **The mark is a child of `.textarea-wrapper`, not of a new element.** That wrapper
  already existed and already held the OCR button absolutely, so it was already the
  containing block this needed.
- **`.dropzone` gained `position: relative`** and nothing else. It was `static`.

### 9.8 NOT ESTABLISHED

1. **What Dann wants done about the drop zone collision.** Three paths are named in
   §9.4 and none is taken. **Settled by: his walk.**
2. **Whether 40px is the size he wants.** The measured headroom is 114.61px at
   360x640 and the full table is in §9.2, so a larger number costs one edit and no
   re-measurement. **Settled by: his walk.**
3. **Whether the chapter bands will in fact match this.** §9.3 records the reversed
   inheritance as a claim about what SHOULD happen. Nothing enforces it, and the
   bands are not built. **Settled by: building them against
   `IntakeWatermark.svelte` rather than against the mockup.**
4. **How the mark reads on a real phone screen rather than an emulated one.** Every
   figure here comes from Chromium with touch emulated at 360x640 and
   `pointer: coarse` confirmed true. **A light sage word at 12% lightness difference
   from white has not been seen on real glass in daylight.** Settled by: Dann's walk
   on his own phone.

---
*Written by Code, 2026-08-20 late. Every measurement in this memo was taken in a
real Chromium through Playwright against the dev server, not read out of the
source. Every count came from a gate run on this machine.*
