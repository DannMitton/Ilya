# N.108 increment 4, the four finishings

Written by Claude Code, 2026-09-03. Floor `42f6871`, "N.108-3: the takeover in
the new dress". Commit message: `N.108-4: the four finishings`.

Four things Dann ruled on his walks of increments 2 and 3, built in one commit.
Three came from `docs/memory/INBOX.md`, dated 2026-09-03; the fourth was owed
from `memo-n108-takeover_r1_2026-09-03.md` §9.

**Nothing here is shipped.** The gates are run and the work is walked; the ship
and Dann's own walk are next.

**One file must be added before the ship:** this memo. Everything else is a
modification to a tracked file. The ship script refuses on untracked files.

```bash
git -C ~/Desktop/ilya-rewrite add docs/sessions/memo-n108-finishings_r1_2026-09-03.md
```

---

## 1. The five gates

Run for real on this machine, all five, before the work and again after it. No
line of `~/Downloads/ilya-ship.sh` changes.

| gate | baseline | before | after |
|---|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same | same |
| 4 web-test | `959 passed (959)` | `959 passed (959)` | `959 passed (959)` |
| 5 score-parser | `534 passed \| 5 skipped (539)` | same | same |

Gate 3 was the one at risk. Deleting the camera icon leaves its CSS unused, and
`svelte-check` counts an unused selector as a warning, which would have moved 7
to 11. The four rules were deleted with the markup: `.ocr-btn` and its two
states, `.ocr-file-input`, `.ocr-spinner`, the `ocr-spin` keyframes, and
`.ocr-error`.

---

## 2. What changed, in one list

| # | the finishing | files |
|---|---|---|
| 1 | a 16 px top inset on the drawer, so the Piece band clears the banner | `Drawer.svelte` |
| 2 | every button that draws a box takes the ritual's 999 px ends | 8 files, §5 |
| 3 | one Choose a file button; a picture asks the poem or the score | `RootPanel.svelte`, `ScoreUploader.svelte`, `i18n.ts` |
| 4 | the empty-paper hint names the bottom pull, not a left chevron | `i18n.ts` |

---

## 3. Finishing 1: the top inset

**His ruling, 2026-09-03, on the increment 3 walk:** "negative space between the
Piece band and the Ilya banner. This will increase the illusion that the
controls float. On my screen, simply moving the controls down a few pixels would
be sufficient."

Built as the DESK DEFAULT recorded in `INBOX.md`: a top inset equal to the
groups' own 16 px side inset, desk and phone alike.

- `Drawer.svelte:917` `.drawer-content` is `padding: 16px 16px 12px`, was
  `0 16px 12px`.
- `Drawer.svelte:1145` `.drawer-takeover` takes the same. The two boxes never
  exist at once and neither can be the other's parent, so the value is repeated
  rather than shared, as it already was for the sides and the foot. **If only
  the groups took it, the ritual's frame would jump 16 px up the moment a singer
  entered the ritual**, which is a motion this drawer does not make.

**This reverses a measured rejection**, and the comment at `:906` now carries
both sides so the next reader does not undo him. The increment 1a note said 16 px
at the top "costs 16 px of height, and at 1366 x 768 on a coarse pointer the
opening state then overruns its box by 10 px". That measurement was taken three
increments ago, against a drawer that still had the slab, the watermarks, two
intake fields and the old takeover. **It was not re-measured then, and it is
re-measured here.** See §7.

---

## 4. Finishing 4: the empty-paper hint

**Owed from `memo-n108-takeover_r1_2026-09-03.md` §9.** The pull has been a
horizontal bar on the bottom edge since increment 1a, carrying the word DRAWER
with the paper up. The hint still sent the singer to a chevron on the left, on
every screen under 1400 px.

`i18n.ts:504`, `paper.empty.mobile`:

| | |
|---|---|
| **old English** | `Tap the chevron on the left to open the drawer.` |
| **new English** | `Tap Drawer at the bottom of the screen to open the drawer.` |
| **old French** | `Appuyez sur le chevron à gauche pour ouvrir le tiroir.` |
| **new French** | **OWED.** The English stands in both slots. |

The new line names the control by the word printed on it, `drawer.pull`
(`Drawer` / `Tiroir`), which is the one thing on that bar a singer can read.

**The old French is deleted from the shipped string and preserved in the comment
above it**, because it describes a control that no longer exists and would
otherwise be the only French on that page, telling a French singer to press
something that is not there. `t()` prints `[MISSING: key]` for an absent
variant, so the slot cannot simply be emptied.

`paper.empty` (the desk line, "Enter your Cyrillic text in the drawer on the
left.") is untouched: at 1400 px and above the drawer is on the left and the
sentence is true. Its French is ratified and stays.

---

## 5. Finishing 2: the pill ends

**His ruling, 2026-09-03:** "The buttons shown here can form the template. Can we
make other buttons share its rounded ends?" The template is
`CalibrationWizard.svelte:1739`, `border-radius: 999px`, shared by
`.wizard-primary` (filled lavender) and `.wizard-secondary` (outlined).

### 5.1 The rule this audit applied

Dann ruled the three shapes keep their shapes and gain the radius, and that
**fields, frames, receipts and bands keep their radii**. Applied as:

- **A button that DRAWS A BOX takes 999 px.** A box is a background other than
  transparent, or a visible border. Filled and outlined both.
- **A button that draws NO box is left alone.** There are no ends to round: no
  border, no fill, nothing on screen changes. These are the text links.
- **A circle is already there.** 50 % on a square box is the limit of a pill.
- **Excluded by his own carve-out:** fields, frames, receipts, bands.
- **Excluded as none of the three shapes:** list rows, disclosure headers, the
  table-of-contents rows in the Guide, notation marks and seats, and the one
  segmented tab pair. Each is named below with its reason.

### 5.2 The audit: every `<button>` in `apps/web`

**227 buttons in 21 files**, read out of the tree this session by a script that
walks every `.svelte` file, finds each `<button` and its `class` attribute, and
groups by rule. The script returns 228 hits; one, `HeaderBar.svelte:148`, is the
word `<button>` inside a comment and is not a button. It was 229 buttons before
this increment; the camera icon and the photograph button are the two that left.

The six groups below account for all 227: 54 changed, 26 already 999 px, 2
already circles, 26 with no box, 118 that are not one of the three shapes, and
1 judgment call.

Line numbers are AFTER this increment's edits. The first column is every markup
site; the rule column is the CSS rule that shapes it.

#### CHANGED to 999 px, 54 buttons at 16 rules

| markup sites | rule | was |
|---|---|---|
| `RootPanel.svelte:468,557,558,560` (ghost), `:504` (primary) | `RootPanel.svelte:905` `.action-btn` | 4px |
| `MetadataFields.svelte:151,155` | `MetadataFields.svelte:232` `.btn-reset` | 4px |
| `SongList.svelte:142,145,158,162` | `SongList.svelte:287` `.song-btn` | 4px |
| `SongList.svelte:190` | `SongList.svelte:318` `.new-btn` | 4px |
| `VoiceAnchor.svelte:55` | `VoiceAnchor.svelte:107` `.voice-action` | 4px |
| `InstallPrompt.svelte:132` | `InstallPrompt.svelte:192` `.install-btn-primary` | 4px |
| `InstallPrompt.svelte:134` | `InstallPrompt.svelte:213` `.install-btn-ghost` | 4px |
| `ScoreUploader.svelte:724,761,844` (primary), `:713,714,760,843,850,855` (secondary) | `ScoreUploader.svelte:1034` `.btn-primary, .btn-secondary` | 4px |
| `InspectorPanel.svelte:984` | `InspectorPanel.svelte:1502` `.dict-button` | 4px |
| `InspectorPanel.svelte:1306,1309,1312,1326,1329,1332,1336` | `InspectorPanel.svelte:2335` `.provenance-choice` | 3px |
| `CorrectionSurface.svelte:557,568,578,593,602,611,620,638,651,660,670,683` | `CorrectionSurface.svelte:995` `.cell` | 4px |
| `CorrectionSurface.svelte:717,724,734,741` (`cell cell-arrow`), `:396` (`cell nolet-value`) | same rule, inherited | 4px |
| `+page.svelte:3731` | `+page.svelte:4726` `.portrait-action` | 4px |
| `+page.svelte:3828` | `+page.svelte:4341` `.sheet-print-btn` | 4px |
| `+page.svelte:3569` | `+page.svelte:4083` `.start-over` | 4px |
| `+page.svelte:3132,3141` | `+page.svelte:4053` `.replace-actions button` | 4px |

**The correction grid is where this shows most.** A cell is 44 px tall at its
floor, so 999 px draws a 22 px end and the grid reads as rows of pills. That is
the ruling applied where it is loudest, and it is his to wave off. A screenshot
came with this memo.

`.sheet-print-btn` carries a ruling of its own, 2026-08-21, that its look is
untouched. That ruling governs POSITION and IDIOM (uppercase, tracking, weight,
ink border, transparent fill), all of which stand; the corners are neither, and
the 2026-09-03 ruling names every button.

#### ALREADY 999 px, 26 buttons, nothing changed

| markup sites | rule |
|---|---|
| `CalibrationWizard.svelte:1301,1348,1356,1402,1477,1570` | `:1734` `.wizard-primary` **(the template)** |
| `CalibrationWizard.svelte:1124,1139` | `:1734` `.wizard-secondary` **(the template)** |
| `CalibrationWizard.svelte:1422,1423,1483,1484` | `:2061` `.wizard-hold-actions button` |
| `CalibrationWizard.svelte:1222` | `:1927` `.wizard-roster-action button` |
| `ProfileSwitcher.svelte:251,335` | `:514` `.ps-primary` |
| `ProfileSwitcher.svelte:303,304,309,310,311,313` | `:459` `.ps-verbs button` |
| `CorrectionSurface.svelte:471` | `:890` `.undo-pill` |
| `+page.svelte:3910` | `:4860` `.update-toast-action` |
| `HeaderBar.svelte:45` | `:159` `.lang-pill` (9999px) |
| `fit-font-lab/+page.svelte:66,73` | `:137` `.lab-chip` (a dev route) |

#### ALREADY ROUND, 2 buttons

| markup site | rule | radius |
|---|---|---|
| `InspectorPanel.svelte:995` | `:2392` `.reset-button` | 50% (a 22 px circle) |
| `InspectorPanel.svelte:1215` | `:2157` `.stress-circle` | 50% |

#### LEFT ALONE: no box drawn, so no ends to round, 26 buttons

Every one has `background: transparent` or `none` and no border. A radius on
these changes nothing a singer can see.

| markup sites | rule |
|---|---|
| `DeskHead.svelte:116` (LEARN, GUIDE) | `:219` `.link` (an underline, not a box) |
| `Drawer.svelte:444` | `:1007` `.band-link` (METADATA on the band) |
| `Drawer.svelte:759` | `:1217` `.takeover-back` (← Back) |
| `RootPanel.svelte:442,443,450,451` | `:716` `.receipt-btn` (Clear, Replace) |
| `StationHeader.svelte:135` | `:215` `.station-disclosure` (every station header) |
| `ScoreUploader.svelte:777` | `:972` `.banner-dismiss` |
| `NotePicker.svelte:281` | `:356` `.np-clear` (underlined) |
| `ProfileSwitcher.svelte:336` | `:529` `.ps-quiet` (underlined) |
| `CalibrationWizard.svelte:1431,1436,1490` | `:2077` `.wizard-pause` (underlined) |
| `CalibrationWizard.svelte:1251` | `:1621` `.wizard-compact-toggle` |
| `CalibrationWizard.svelte:1167` | `:1944` `.wizard-info-glyph` |
| `CalibrationWizard.svelte:1447` | `:2105` `.wizard-toast-dismiss` |
| `TextualWitnesses.svelte:58` | `:118` `.witnesses-header` |
| `TextualWitnesses.svelte:87` | `:171` `.measure-link` |
| `CorrectionSurface.svelte:539` | `:1153` `.back` ("a NAVIGATION MARK... carries no box") |
| `CorrectionSurface.svelte:482,490,515,381,385` | `:916` `.mark` ("A NAVIGATION MARK IS BARE") |
| `+page.svelte:3924` | `:4876` `.update-toast-dismiss` |

#### LEFT ALONE: not one of the three shapes, 118 buttons

| markup sites | rule | what it is |
|---|---|---|
| `Drawer.svelte:474,479,484,493,512,529,547,563,582,601,622,628,633,723` (`toc-link`, 13); `:498-504,517-521,534-539,552-555,568-574,587-593,606-614,653-662,675-681,699,710,717,718` (`toc-link toc-sub`, 66); `:702,713` (`toc-deep`, 2); `:474,648,670,689` (`toc-title`, 4) | `:1433` `.toc-link`, `:1496` `.toc-sub`, `:1511` `.toc-deep` | the Guide's table of contents: a nav list of text rows, no box (a 2 px radius on the focus ring only) |
| `Drawer.svelte:492,511,528,546,562,581,600,647,669,688,698,709` (12) | `:1540` `.toc-chevron` | that list's disclosure chevrons, bare |
| `SongList.svelte:149` | `:232` `.song-open` | the row that NAMES the song. `.is-open` draws it with a rule down its left edge and `0 4px 4px 0`, ruled 2026-08-20 as "not a text field"; a pill would undo that mark |
| `ProfileSwitcher.svelte:260` | `:370` `.ps-header` | a disclosure header, boxless until hover |
| `ProfileSwitcher.svelte:286` | `:417` `.ps-voice` | a row in the voice list |
| `SearchableSelect.svelte:181` | `:263` `.select-trigger` (3px) | **a field.** His carve-out |
| `SearchableSelect.svelte:225,238` | `:364` `.select-option` | a listbox option |
| `NotationFields.svelte:113,127,141,155,169,183,197` | `:272` `.toggle-switch` (9px) | a switch. 9 px on an 18 px track is already fully round |
| `InspectorPanel.svelte:1162,1239,1117,1266` | `:1920` `.atom` (4px) | words in the analysed text, not controls with ends |
| `InspectorPanel.svelte:1073` | `:1633` `.dict-entry` | a dictionary row |
| `SyllableStation.svelte:137` | `:188` `.slot` (2px) | a syllable seat under a note |
| `ReadingAid.svelte:56` | `:102` `.aid-return` (`border-radius: 0`) | a full-bleed bar across the aid's foot. **A band** |
| `Drawer.svelte:798` | `:1321` `.drawer-pull` | the pull. **A band**, full width on the bottom edge |

#### THE ONE JUDGMENT CALL, 1 button, and it is yours to overturn

| markup site | rule | radius |
|---|---|---|
| `DeskHead.svelte:100` | `:178` `.pair-member`, `:202` `.pair.single .pair-member.active` | 0, and 4px on the single form |

TRANSCRIPTION and SCORE MARKUP. It **does** draw a box: the active one takes a
cream card. It is left alone because it is a segmented pair, divided by a
1 px rule between the two members (`:192`), and rounding both members' outer
ends turns a divided pair into two separate buttons that happen to touch. It is
the only drawn box in the tree this increment did not round. **One line changes
it if you want it changed.**

### 5.3 Read off the running page, not off the source

At 1400 x 900 on the local production build, every button in the opening state
reports its computed radius: `Choose a file` 999px, `Transcribe` 999px, `Rename`
999px, `New song` 999px, `Export this song` 999px, `Import a song` 999px,
`Reset` 999px, `Calibrate` 999px, `PRINT` 999px, `Français` 9999px, and the
boxless ones 0px. With a score loaded and a note held, all 22 correction cells
report 999px at a 44 px height.

---

## 6. Finishing 3: one picker

**His ruling, 2026-09-03:** the OCR camera icon, Choose a file, and Read a score
from a photograph "all serve the same function. Please consolidate these and
find a reasonable place for the user to perform their file retrieval."

### 6.1 What a singer sees now

One `Choose a file` button under the field, taking every kind. The camera icon
in the field's top-right corner is gone. The second button is gone. **When a
picture arrives, by that button or by a drop, the intake asks in place, under
the field: "Is this picture the poem, or the score?" with Cancel, The poem, The
score.** The poem answer runs the same OCR the camera icon ran. The score answer
goes to the page reader, exactly as before.

### 6.2 Where the code went

- `RootPanel.svelte`: the camera button, its hidden `image/*` input, the
  photograph button, the second hidden picker, `choosePhotograph`,
  `photoInputEl`, `photoAcceptList`, `ocrProcessing`, `ocrError`,
  `ocrFileInputEl`, `handleOcrClick` and `handleOcrFile` are all gone, with
  their CSS.
- `ScoreUploader.svelte`: `readPictureAsPoem` is `handleOcrFile`'s body, moved
  not rewritten. The same dynamic `tesseract.js` import, the same `rus` worker,
  the same `terminate`, and the same two failure messages in the same English
  and the same French.
- `ScoreUploader.svelte` `take()`: was `isPdf(file)`, is now
  `readableKind(file)`, which already existed and already returned
  `'image' | 'pdf' | null` off the same `detectScoreFormat` sniff dispatch uses.
  Both kinds now stop and ask; `isPdf` is deleted because `readableKind` says
  everything it said.
- `askKind` carries a `picture: boolean`, which chooses the title and the poem
  route. Nothing else in the panel changes.

### 6.3 N.70 holds on the one picker

`ACCEPT` still lists every format including `image/*`, and `acceptList` is still
`isMobile ? undefined : ACCEPT`. **Measured at 430 x 932 on the build: the one
file input's `accept` attribute is `null`.** So an iPhone greys nothing out,
which is the whole of the 2026-08-16 ruling. On a fine pointer the filter is
back and a photograph is still pickable, because `image/*` is in the list.

### 6.4 Strings

**Two new English strings, no French, listed as ruled:**

| key | English | French |
|---|---|---|
| `intake.picture.title` | `Is this picture the poem, or the score?` | **owed** (English in both slots) |
| `intake.picture.reading` | `Reading the words out of the picture…` | **owed** (English in both slots) |

**Three strings reused word for word rather than twinned**, because none of them
names a format: `intake.pdf.why` ("Ilya cannot tell from the file itself. %s"),
`intake.pdf.poem` ("The poem"), `intake.pdf.score` ("The score").

**One string marked unused in place, not deleted**, on his word:
`i18n.ts:690` `upload.scanTooltip`, "Read a score from a photograph" /
« Lire une partition à partir d'une photographie ». Its ratified French is kept.

**Two literals moved, not written:** the OCR failures, "No text recognised in
image." / « Aucun texte reconnu dans l'image. » and "OCR processing failed." /
« Échec du traitement OCR. » They were inline literals in `RootPanel` and are
inline literals in `ScoreUploader`, unchanged in both languages.

### 6.5 A departure, named

**A dropped picture used to go straight to the score reader.** The increment 2
brief ruled it: "a photograph goes to the reader." That rule was written while
the camera icon existed to mean the other thing, and the icon is what said "this
picture is text". With one picker there is no button left to say it, so the drop
asks too. The alternative was a drop that guesses and a picker that asks, which
is two behaviours for one act.

---

## 7. The walk

On a local production build (`pnpm --filter @ilya/web build`, then
`vite preview` on port 4319, entry `app.B9gvNNmp.js` confirmed served), driven
in the browser pane and in Playwright. Three viewports.

### 7.1 1400 x 900, the desk

| what | reading |
|---|---|
| `.drawer-content` padding | `16px 16px 12px` |
| header bar's bottom | 48 px |
| Piece band's top | 64 px |
| **desk between them** | **16 px**, the side inset exactly |
| the takeover, entered from Calibrate | frame top 64 px, same 16 px gap, `padding: 16px 16px 12px` |
| the intake | one `Choose a file` button; no camera icon |
| every drawn button | 999 px, listed in §5.3 |
| the empty page | "Enter your Cyrillic text in the drawer on the left." unchanged |

A picture dropped on the field gave, in place, "Is this picture the poem, or the
score?" with the file name under it. **The poem answer ran the OCR and reported
"No text recognised in image."** under the field, which is the honest answer for
a favicon. **The score answer gave "Preparing the page reader. This will only
happen once."**, so it takes the page-reader route and not the OCR one.

A `.mxl` dropped on the field gave "Format: MusicXML (.mxl)", accepted through
Continue to analysis, and the receipt read `SCORE · within-four-walls.mxl ·
Clear · Replace` with the one Choose a file button under it.

### 7.2 1366 x 768

This width takes the phone's layout (the breakpoint is 1400).

| what | reading |
|---|---|
| the empty page | **"Tap Drawer at the bottom of the screen to open the drawer."** |
| the pull, paper up | `DRAWER`, a bar on the bottom edge |
| the pull, drawer up | `PAPER` |
| the drawer raised | Piece band at 16 px from the viewport top |
| `ilya:openStations` | `{"v":2,"open":[]}`, unchanged |

**The fit, measured rather than assumed.** In the opening state, with the open
set empty, the slack between the last group's bottom and the scroll box's
content-box bottom:

| | slack |
|---|---|
| with the 16 px top (as built) | **94 px** |
| with the top forced back to 0, live, same page | 110 px |

So the inset costs exactly 16 px and 94 px of room remain. `scrollHeight` is
useless for this: it clamps to `clientHeight` when the content is shorter, and
reported 724 = 724 in both states. The last child's rectangle is the honest
instrument.

### 7.3 430 x 932, the phone

The pane emulates a coarse pointer at this width; `matchMedia('(pointer:
coarse)')` reported true, so the 44 px floors were live.

| what | reading |
|---|---|
| `.drawer-content` padding | `16px 16px 12px`, band at 16 px from the top |
| the empty page | "Tap Drawer at the bottom of the screen to open the drawer." |
| the pull | `DRAWER`, then `PAPER` once raised |
| the one picker's `accept` | **null.** N.70 holds |
| the intake | one `Choose a file` button, 999 px |
| slack in the opening state | **251 px** with the inset, 267 px without |
| a dropped picture | asked in place, three 999 px buttons |

---

## 8. Seen on the walk, not acted on

- **The kind question's buttons are 33 px tall on a coarse pointer.**
  `ScoreUploader`'s `.btn-primary` and `.btn-secondary` carry no
  `@media (pointer: coarse)` floor, so Cancel, The poem and The score are all
  under the 44 px target on a phone. **This is not new** and this increment did
  not touch it; it is the same rule that has drawn every answer in that panel
  since N.59. Worth a number.
- **The service-worker update toast** fires on a local production build after a
  rebuild, as `memo-n108-takeover_r1` §9 already recorded.
- The correction cells' 44 px floor and the new 999 px ends interact: an empty
  glyph cell is now a 44 px circle. Deliberate, and drawn in the screenshot.

---

## 9. NOT ESTABLISHED

**NOT ESTABLISHED beats a complete invented answer.**

- **The opening state's fit at 1366 x 768 with a COARSE pointer.** The browser
  pane forces coarse only below 768 px of width, so this configuration could not
  be produced with the instruments here. What IS established: 1366 x 768 with a
  fine pointer leaves 94 px of slack, and 430 x 932 with a coarse pointer leaves
  251 px. The increment 1a comment predicted a 10 px overrun for
  1366-and-coarse, but that prediction was made against the increment 1a drawer,
  three increments and four changes ago, and nothing re-measured it. It is not
  evidence about this tree, and it is not treated as any.
- **Whether Dann wants the correction grid as pills.** The ruling says every
  button and this is a button; the grid is where the change is loudest, and that
  is taste, not correctness.
- **Whether the tab pair should round too.** §5.2 explains why it was left; the
  reasoning is the desk's, not his.
- **The French.** Three strings are owed: the new `paper.empty.mobile`, and the
  two new `intake.picture.*` keys. The English stands in both slots meanwhile,
  which is the pattern the six N.108 strings already set. **No French was
  written.**
- **Whether the OCR's two failure messages should become i18n keys.** They were
  inline literals before this increment and they are inline literals after it.
  Making them keys would be new English and new French, and neither was ruled.
- **Whether a picture that a singer answered "the poem" for, and which held no
  words, should offer the score answer again in one press.** The PDF path has a
  string for this (`intake.pdf.noText`, "drop it again and choose The score");
  the picture path shows the moved OCR message and a "Try another file" way out.
  Not made the same, because making them the same is a new string.
- **How the drop path behaves for a picture on a real iPhone.** Every picture
  observation here was a synthetic `DragEvent` carrying a real `File`, and the
  two clicks on the kind question were one real pointer click
  (`page.mouse` / the pane's `left_click` at real coordinates) and one dispatched
  `.click()`. Named because a dispatched click bypasses hit testing and has
  hidden a real bug on this project before.

---

## 10. What this spends and what it leaves

**Spends:** the two INBOX rulings of 2026-09-03 about the inset and the buttons,
the one about the picker, and the §9 debt from the takeover memo. All four are
built.

**Leaves open:** the ritual's inner scroll (memo `memo-n108-takeover_r1` §2,
DESK DEFAULT, not waved off), and the French table for every N.108 string.

**After this: N.108 is finished.** The one thing returns to N.111, the clitic
seat.
