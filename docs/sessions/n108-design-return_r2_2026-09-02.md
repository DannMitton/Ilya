# N.108 revision 2 return: the prototype and the five answers

**From:** Claude (design desk). **To:** Dann, and Code. **Date:** 2026-09-02.
**Revision 1 of the return to brief r2**
(`docs/sessions/n108-design-pack/brief-to-design-n108_r2_2026-09-02.md`).

Open `n108-drawer-prototype_r1_2026-09-02.html` beside this. It works offline.
Its toolbar (viewport, intake state, Voice phase, Opening state) is prototype
chrome, not drawer. The readout under the toolbar measures the drawer live:
content height against the viewport, which stations are open, the Voice
station's height by phase, and the three band contrast ratios computed from
the tokens in the file.

Suggested filing:

```
docs/sessions/n108-drawer-prototype_r1_2026-09-02.html
docs/sessions/n108-design-return_r2_2026-09-02.md
```

## 1. What was built, against §1 and §3 of the brief

- Choice 2, frames, no fold. Three `section.group` frames at 20 px, flush,
  divots between them. A station body grows inside its group; nothing else
  moves; `.drawer-scroll` scrolls. The fold and its grey sentences are gone.
- Bands with reverse text: Piece cobalt, Text sage, Score markup lavender,
  with the contrast fix of §4.1.
- Piece, Text, Score markup. English only. Every shipped string carries its
  `i18n.ts` line; every other string is marked `PLACEHOLDER` in a comment or a
  visible mono tag.
- Desktop any number open; phone one at a time, opening a second closes the
  first. The rule keys off the frame width in the prototype and off `isMobile`
  in Svelte.
- Opening state: Piece with the intake waiting, Text and Score markup showing
  their station names, nothing toggled open. Desktop 787 of 804 px, 17 px
  slack. Phone 823 of 932 px, 109 px slack. Both measured in the readout.
- The intake in four states with Replace per line. The Transcribe action sits
  under the intake in Piece because the intake is where the poem is.
- Voice expands in place through the five phases of
  `CalibrationWizard.svelte:116`, entered only from **Calibrate**, left by
  **Back**.
- Motion: `--motion: 180ms ease-out`, opacity and transform only. Height is
  not animated, so a body appears in place while the layout below it steps.
- The pull: 20 × 152, centred, `--drawer-bg` fill, hairline, outward corners
  only, as ruled 2026-08-18 through 2026-08-21.
- Fonts: `--font-sans` is declared as `app.css:23` declares it. Source Sans 3
  is not in `static/fonts`, so the file falls through to `system-ui`, which
  is what the app does without the webfont.

## 2. The five answers

### 4.1 The band contrast, measured

The ruled hues fail with cream, and cobalt fails too: cream `#F5F1E8` on
`--sage` 2.66:1, on `--deeper-lavender` 3.32:1, on `--quiet-cobalt` 4.23:1.
The drawing's 5.1:1 for cobalt is not what the tokens give.

The fix is inside the ruling and inside the token set. `app.css:96-108`
already derives, for each band hue, "the band's own hue taken one step down,
with white text on it", ratified 2026-08-20 from a drawing (option D). Those
tokens are the language-pill chips: `--lang-chip-transcription #6C7A5F`
(sage), `--lang-chip-marked #806E8E` (lavender), and `--lang-chip-guide`,
which is cobalt itself because cobalt already carries white. The bands take
those three, and the text is white, not cream. Measured, and printed in each
band in the prototype:

- Piece, white on `#5C739E`: 4.77:1
- Text, white on `#6C7A5F`: 4.58:1
- Score markup, white on `#806E8E`: 4.63:1

All three pass 4.5:1 at label size. No new hex, no larger label. A larger
label was the alternative and it fails anyway: cream on ruled sage is 2.66:1,
under even the 3:1 large-text floor. Cream on the chip tokens is 4.06 to
4.23, which also fails, so the light neutral has to be white.

*What would have to be true:* that the chip tokens may carry a band as well
as a pill. `app.css` names them for the pills and says they were derived by
hand from the bands; a band that uses them is the same derivation used once
more. If Dann wants the ruled hues at full strength on the band regardless,
the label cannot pass on Text, and the honest move is to say so rather than
ship 2.66:1.

### 4.2 The pull's place, drawn

Centred, as ruled, and it now belongs to something. The change that makes it
work is that the drawer slab keeps its footprint and takes the desk's own
surround as its fill (`--surround-transcription`), and `--drawer-bg` moves
onto the three groups. The pull sits on the slab's outer edge at its centre,
20 × 152, and the slab is what it belongs to. The divots are cut from the
slab, so the tab never meets a divot, and at the opening state its 152 px run
spans the Text band's neighbourhood without attaching to it, because the tab
and the band do not touch: 18 px of slab and a group corner lie between them.
On the phone the pull sits in the 20 px desk strip exactly where N.65 item 3
put it, and the slab is the strip's colour, so the two read as one desk.

The header-band alternative from revision 1 is withdrawn. With the slab
carrying the desk colour, the centred tab reads as the drawer's, and the
2026-08-20 silhouette drawing survives: the outline is the slab's edge, which
is continuous; only the groups inside it are divoted.

*What would have to be true:* that the slab may change fill from
`--drawer-bg` to the surround. Today `.drawer-body` is `--drawer-bg`
(`Drawer.svelte:743`). On desktop the slab then matches the desk beside it
and the drawer's footprint is marked by the groups and the tab alone. If Dann
wants the footprint itself visible on desktop, the slab takes
`--surround-marked` or a tint of its own, and that is a hex he has to pick.

### 4.3 Voice open on the phone, capture phase, measured

In the prototype's phone frame, with only Voice open and the ritual in the
capture phase, the Voice station measures 520 px and the drawer's content
measures 1 299 px in 932, so the drawer scrolls by 367 px. Piece's map above
it costs the height: 48 head, 356 Piece, 40 Text band and its three rows
(about 180), then Score markup's band and two rows before Voice. The capture
surface itself, at 520, would fit alone.

By phase, in the mock, measured: welcome 299, readiness 441, capture 520,
summary 630, characteristics 434. Summary is the tallest and the least
compressible, a seven-row roster at 44 px per row plus its head and two
actions.

Does any phase need its own scroll inside the station? No, and it should not
have one: a scroll inside a scroll on a phone is the thing that loses a
singer's thumb. The drawer scrolls as one surface, the ritual's head with
**Back** and the phase rail scrolls with it, and the singer reaches the
capture control by one scroll of about 370 px. What the drawer must do
instead is scroll the Voice station's header to the top when the ritual
starts, so the singer lands on the ritual and not on Piece. That is one
`scrollTo` on entry, not a second scroll region.

*What would have to be true:* that the real capture phase is near 520 px on
a 430 px phone. The mock's meter and hold control are placeholders for the
Pacifier, which was not read; if the Pacifier's wheel is taller than about
250 px, capture passes summary as the tallest phase. And the roster's row
count follows the vowel set, which I did not retype; seven rows are drawn.

### 4.4 The returning singer, for Code

`ilya:openStations` (`sections.svelte.ts`, `OPEN_STATIONS_KEY`) holds a JSON
array of station ids from the set `piece`, `source`, `songs`, `analysis`,
`shiftLyrics`, with `notation` never written. The new drawer has ten stations
and the intake has no closed state, so on restore: read the array with
`parseOpenSections` as today; map each old id to its successor, `piece` to
`metadata`, `songs` to `repertoire`, `analysis` to `analysis`, `shiftLyrics`
to `underlay`, and drop `source`, because the intake is always open and has
no id to store; drop anything unrecognized; on a phone keep only the first
survivor, because the phone holds one open station; then write the mapped
array back under the same key so the migration runs once. The first-run
default becomes the empty array: `FIRST_RUN_STATIONS` was `['piece',
'source']` because those two were the first things a singer needed, and
both are now visible without a toggle, Metadata as a row and the intake as
the waiting field. `notation` stays unpersisted for the reason the file
already gives. The new ids are wire values from the day they ship, so they
are named here and should not be renamed after: `repertoire`, `metadata`,
`binder`, `transcribe`, `notation`, `analysis`, `underlay`, `corrections`,
`voice`. A returning singer therefore sees the map, plus whichever of their
old open stations still exist under a new name, plus nothing they did not
have open before.

*What would have to be true:* that the migration may rewrite the stored
array in place. If Dann wants the old array preserved, the mapped set goes
under a new key and the old key is left as it is, which `E.27 §3.4` also
allowed ("persists under a new key").

### 4.5 Build less

Cut the ritual in place. Keep the takeover for calibration exactly as it
ships, entered from **Calibrate** inside the Voice station, and ship the
three frames, the bands, the unified intake, and the migration.

What a singer loses: the paper stays covered during calibration, which is
what happens today, so the loss is against the brief and not against the
product. What the build sheds: the tallest unknown in this brief. The five
phases have four placeholder surfaces in this prototype (readiness, capture,
summary rows, characteristics labels), the Pacifier's real height is not
established, the microphone prompt is browser chrome, and the in-place form
needs the scroll-to-header behaviour of §4.3 and a rule for what a tap on
another station does mid-recording. None of that blocks the frames. The
takeover already has restore-on-exit, its own scroll, and a walk behind it.

*What would have to be true for the cut to be wrong:* that seeing the paper
during calibration is worth more to a singer than shipping the frames a
week earlier. Nothing in the rulings says so, and the takeover was ruled
"one takeover" twice.

## 3. Every number and hex, with its source

Sourced from `apps/web/src/app.css` on branch `Shane`: `--font-sans` (:23),
`--font-mono` (:24), `--ink-primary #1a1612` (:27), `--ink-secondary #4a4540`
(:28), `--ink-tertiary #6A655F` (:29), `--sage #8B9A7D` (:32), `--light-sage`
(:33), `--quiet-cobalt #5C739E` (:41), `--stone-300 #d6d3d1` (:44),
`--paper-cream #F0EBE0` (:49), `--paper-light #F5F1E8` (:50), `--drawer-bg
#FAF8F5` (:51), `--desk-surface #D8D4C8` (:52), `--portrait-gutter 24px`
(:63), `--surround-transcription #D1D7CB` (:84), `--surround-marked #D2CBD7`
(:85), `--lang-chip-transcription #6C7A5F` (:105), `--lang-chip-guide` (:107),
`--lang-chip-marked #806E8E` (:108), `--light-lavender #C4BACF` (:117),
`--deeper-lavender #8E7E9B` (:118), the 16 px coarse-pointer font floor (the
N.23 block).

Sourced from the tree: 520 px drawer width (`+page.svelte:1581`); pull 20 ×
152, corner R 6.43, hairline `rgba(26,22,18,.18)`, shadow, the 44 px coarse
extension (`Drawer.svelte`, `LIP_W`, `LIP_H`, `R`, `.drawer-lip`,
`.drawer-lip::before`); phone width `calc(100% - var(--lip-w))`, fixed at top
0 (`Drawer.svelte`, the 767 px rule); the station label recipe 0.7rem, 600,
0.12em, uppercase, status 0.75rem 500 tabular, chevron 10 × 10 rotated 90 and
minus 90, 44 px min height on coarse (`StationHeader.svelte`); the voice line
9 px padding, 10 px dot, 0.75rem status, lavender button radius 4
(`VoiceAnchor.svelte`); back affordance 0.8rem `--ink-secondary`
(`Drawer.svelte:901-904`); toggle radius 9 (`NotationFields.svelte:277`); the
five phases (`CalibrationWizard.svelte:116`), the compact label shape
(:360-362), the six characteristics fields (:1511-1563).

Ruled: 20 px surface radius, the three band hues, Piece, frames, phone one
open, English only (N.108, 2026-09-02); 180 ms ease-out, opacity and
transform only, three radii now four (2026-08-18 spec as amended); 44 px
coarse floor (ruling 7); the pull as bookmark tab (2026-08-18, item 7).

Strings sourced from `i18n.ts`: `drawer.pull` "Drawer" (:46), `meta.heading`
(:86), `meta.title`, `meta.composer`, `meta.poet`, `meta.opus` (:87-90),
`cosmetic.heading` (:99), the fourteen toggle labels (:100-113),
`loupe.station.corrections` (:304), `source.heading` (:392),
`console.placeholder` "Analysis" (:395), `upload.scanTooltip` (:555),
`calib.anchor.uncalibrated`, `calib.anchor.calibrate` (:663, :665),
`calib.welcome.title` (:712), `calib.welcome.beginButton` (:716),
`calib.readiness.title` (:717), `calib.summary.title` (:791),
`calib.characteristics.title` (:799), `shiftLyrics.title` (:895, today's
name for Underlay), `binder.export`, `binder.import`, `binder.exportAll`
(:976, :977, :1009), `songs.heading`, `songs.new`, `songs.rename`,
`songs.delete` (:1061-1071).

Mine, marked `PLACEHOLDER` in the file: the 56 px desktop app bar; the 48 px
drawer head; 18 px group side padding; 40 px band; 4 px group bottom pad; 12
px scroll bottom pad; the station hairline at ink .10; 72 px intake field;
`--paper-light` as the intake and ritual fill; the meters and the hold
control; every status string; the receipt and drop-hint copy; "Export and
import" as a station name; "Capture" as a phase title; the roster rows;
"Back", "Continue", "Finish", "Done", "Save", "Skip this vowel", "Close".

## 4. NOT ESTABLISHED

- The real height of the capture phase. The Pacifier (`pacifier/Pacifier.svelte`)
  was not read; the mock stands in.
- The vowel set and its count. Seven rows are drawn; `ALL_VOWELS` and
  `DEFAULT_VOWELS` were not read.
- `HeaderBar.svelte` height on desktop. 56 px is drawn.
- Today's `.text-input` and drop-zone fills, borders, and placeholder copy.
  `RootPanel.svelte` was copied and not read to those lines.
- The action key for Transcribe and Clear, and the Underlay station's queue
  and cursor markup (`SyllableStation.svelte` not read).
- Whether the chip tokens may name a band (§4.1) and whether the slab may
  take the surround (§4.2). Both are drawn and both are the desk's reading.
- What a tap on a folded or closed station does while the ritual is
  recording. The takeover made the question moot; in place it is open.
- The migration's home: rewrite in place, or a new key. In place is drawn.
- Whether "one open at a time" on the phone counts the intake. The intake is
  never closed, so it is not counted; that reading is mine.
- The desk under the drawer when the Score markup document is showing:
  `--surround-marked` by the four-desks ruling, and the prototype draws only
  the transcription desk.

## 5. Words

Coined here: "slab" for the drawer's outer footprint; "band" for the group
header. Adopted: divot, squircle, frame, station, ritual, takeover, receipt
line, the three group names, Underlay, and every i18n string named in §3.
