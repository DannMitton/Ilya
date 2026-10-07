# Dynamics, tempo markings, and hairpins: what Ilya holds, what the reader gives, and the Finale model (r1, 2026-10-07)

> Provenance, added by the desk (Opus): a Sonnet helper in the desk's cloud workspace, 2026-10-07 about 01:35 to 01:40, on a clone at `5c0f557`, read only. 230,607 tokens. For the Corrections design. Its final message, transcribed by script, unedited. Its claims are its own.

**Brief D: dynamics, tempo markings and hairpins in Ilya, and the Finale model**

Paths are under `/home/claude/heldout/harness/ilya/` unless stated. I did not open `scans/` or `truth/`, and nothing was written outside `work-D/`. The Finale pages I fetched as raw HTML and stripped to text, so those quotes are exact. They sit under `/home/claude/heldout/work-D/f/`, with the script `strip.py` beside it.

## 1. What Ilya holds

**Tempo is parsed from MusicXML and from MNX. Dynamics and hairpins are held nowhere.**
- **Tempo marks:** `ParsedScore.tempoMarkings` is a list of `TempoMarking` (`packages/score-parser/src/types.ts:76`, `:440-459`). Each has measure, `rhythmicPosition`, `bpm`, `beatUnit`, `beatUnitDots` and optional `text`.
- **Tempo words:** `tempoWords` (`types.ts:83`, `TempoWord` at `:433-438`) and `metricModulations` (`:89`) are optional lists.
- **Where they are filled:** the MusicXML `case 'direction'` (`musicxml-parser.ts:492-507`) calls `readTempo` (`:972-1000`, which reads `<metronome>` and `<sound tempo>`), `readMetricModulation` (`:1023`) and `readDirectionWords` (`:1006-1016`).
- **MNX:** the MNX parser fills `tempoMarkings` only, at `mnx-parser.ts:466-480`. It collects no words and no dynamics.
- **Dynamics and hairpins:** the parser has no reader for `<dynamics>` or `<wedge>`. A search of `packages` and `apps/web/src` finds no dynamics field anywhere. The comment at `musicxml-parser.ts:1002-1004` says a dynamic glyph or wedge gives no words, so it is skipped.
- **Words include everything printed:** `readDirectionWords` joins every `<words>` in a direction, so expressive text such as "dolce" also lands in `tempoWords`.
- **Stored per song:** no. `SongRecord` (`apps/web/src/lib/library/types.ts:71-136`) has no tempo or dynamics field. The singer's per-song edits are `corrections: CorrectionMap` (`:96`). Its entries are `NoteCorrection` (`apps/web/src/lib/score/correction.ts:48-98`), whose fields are pitch, base, dots, deleted, entered, type, tied and tuplet. There is no mark field.
- **Drawn:** no. `apps/web/src/lib/score/loupe.ts:586` says "The renderer draws no tempo mark, dynamic or rehearsal mark anywhere". The plan says the same of Markup (`docs/sessions/plan-scan-reader_r4_2026-10-01.md:33`).
- **Editable anywhere:** no. `MarkupPane.svelte:725-727` says no tempo override is passed "because the singer has no way to set one yet (A9 is unbuilt)".
- **Slicing:** `sliceScore` copies `tempoMarkings` but not `tempoWords` (`packages/score-parser/src/page-layout.ts:109`).
- **Ruled design, none of it built:** marks go in their own layer, by measure and beat, and `VocalLineEvent` does not change (`docs/memory/OPEN.md:2718`, N.178 item 3). N.177 and N.178 are unchecked (`docs/memory/STATE.md:102-103`).

## 2. What the reader gives

**homr's writer, as Ilya uses it, cannot emit a dynamic, tempo word, metronome mark or hairpin.**
- **What it writes:** `third_party/homr-web/src/musicxml/generate-main.ts` creates only structural elements: part-list, attributes, clef, key, time, notes, rests, ties, barlines and repeats. The only "direction" is the repeat attribute (`:883`).
- **What it never creates:** a search for `direction`, `sound`, `metronome`, `words`, `dynamics` and `wedge` finds none of them. The older port says so at `generate.ts:3-5` ("no metronome, no tempo").
- **Note-level marks:** `buildArticulations` (`generate-main.ts:307-385`) emits only these:
  - fermata, arpeggiate, accent, mordent, staccato, staccatissimo, tenuto and caesura
  - doit, breath-mark, tremolo, trill-mark and inverted-turn
  - slur and tied
  - Anything else throws "Unsupported articulation".
- **The model's vocabulary:** `ARTICULATION_TOKENS` (`third_party/homr-web/src/transformer/vocabulary.ts:366`) has no dynamic or tempo token. I searched the vocabulary file for dynamic, tempo, hairpin, forte and similar words and found nothing.
- **The join:** `apps/web/src/lib/omr/join-pages.ts` keeps the first part and first staff, and numbers measures and carries key, metre and clef across pages (header `:5-40`). It has no handling of `<direction>` because the writer never produces one.
- **Text OCR is switched off:** homr-web can read text strips (`third_party/homr-web/README.md:80-88`; the Kesh fixture reads "小=85" at 0.96 in `docs/design/phase-11-findings.md:63`). Ilya passes `ocr: false` (`apps/web/src/lib/omr/homr-reader.ts:158`), and nothing in `apps/web/src` reads `.texts`.
- **The other reader:** Ilya's own page reader (`?reader=ilya`, `apps/web/src/lib/omr/scan.ts:11-17`) reads "clef, key, time signature, metre, beams, rests only" (`OPEN.md:2716`). `recognized.ts:29-70` has no place for words, ties, tempo or dynamics (`plan-scan-reader_r4:29`).

## 3. What depends on them

**No singer-added marking can change a number on screen today.** No caller passes a tempo override: `MarkupPane.svelte:741-747`, `InsightsPane.svelte:162-199` and `gates.ts:346` pass none.

| Readout | Function | What it reads | When the value is missing |
|---|---|---|---|
| Seconds, phonation time | `secondsFor` (`phonation.ts:455`), via `resolveTempo` (`tempo-seam.ts:387`) | **One tempo per piece.** Precedence: override (`:411-424`), then the first encoded mark in array order (`firstEncoded` `:374`, used `:426`), then the first steady word resolved to a Quantz band (`:441`), else nothing (`:519`). Later marks change nothing except `steadyMarkingCount` and the caveats. | `undefined`, "never a default bpm" (`:14-19`; `phonation.ts:451-453`) |
| Cycle dose | `totalFoldCycles` (`phonation.ts:551`), shown by `cycleDose` (`apps/web/src/lib/insights/singing-measures.ts:117`) through `phonationSection` (`insights.ts:494`) | the same single tempo | `null`, line omitted (`singing-measures.ts:112-115`). A word tempo gives a range, an encoded or user tempo a point (`insights.ts:502`). |
| Insights phonation section | `secondsPerQuaver` (`insights.ts:466`) calls `secondsFor(…, score)` with no options | the same single tempo | `timing:'none'`, copy `insights.phonation.noTempo` (`InsightsPane.svelte:434`) |
| Fold collision | Not a separate figure. The "fold collisions" wording is the cycle dose label (`i18n.ts:1708`). The `collision` hits in `PRODUCT.md` are layout, not folds. | | |
| Held-note flag from seconds | `noteConditions` (`conditions.ts:175`) calls `resolveTempo` (`:182`). Stated tempo: `isLongSustain(…, parsed.tempoMarkings)` (`:318`). Inferred tempo: seconds of at least 2.5 (`:322`). | | Fermata only (`:325`) |
| Per-note seconds in comments | the same function, `seconds` (`conditions.ts:193-199`, `:352`) | | absent, "untimed" copy (`comment-text.ts:361`) |
| Sustained-ceiling and watch-list "sustain" | `isLongSustain` (`sustain.ts:98`; local copy `watchlist.ts:281`), called at `overlay-engine.ts:221-222` and `watchlist.ts:434`. **This is the only code that reads `tempoMarkings` by position.** `activeTempoAt` (`sustain.ts:61`) takes the latest mark at or before the note. | | No active tempo, so only a fermata flags (`sustain.ts:57-59`) |
| Dynamics | `Demand` includes `'dynamic'`, but `gates.ts:90-92` says "NOT ESTABLISHED: dynamics are not parsed, so it never fires". The `decrescendo` advice text (`comment-text.ts:84`, `i18n.ts:1771`) is static and reads no score dynamic. | | |

**Where a singer-added mark would change a number**, if it were put into the parsed data:
- **A tempo mark:**
  - It changes the piece's seconds, cycle dose and Insights figures only if it comes first in `tempoMarkings` array order. Position does not matter there. That is a consequence of `firstEncoded` taking the first match, not something the code says.
  - It changes the held-note flags by position (`sustain.ts:61`).
  - The mid-piece change is not carried into the totals, because `secondsFor` is single-tempo (`phonation.ts:437-444`).
- **A tempo word:** it matters only when no encoded mark exists, and only the first steady word is used (`tempo-seam.ts:441`). A rit. or accel. word is counted for a caveat and never changes seconds (`:394-403`; `tempoCaveats` `:528-565`).
- **A dynamic or hairpin:** it would change nothing.
- **Dann's rulings for tempo:**
  - Gradual cues are shown as a range, at 75% (rit., rall., allarg.) and about 133% (accel., stringendo), linear, held until a tempo (`OPEN.md:240-241`).
  - A singer's own tempo is legitimate input, the figure says so, and the export says so (`PRODUCT.md:767-785`).
  - Per-region override is "NOT ESTABLISHED in the tree" (`OPEN.md:238-239`).

## 4. The Finale model (public documentation)

**Domain note:** the manual is hosted at `usermanuals.finalemusic.com`, not `makemusic.com`. Pages are Finale 2012 for Windows unless stated.

**Expressions (dynamics and tempo text)**
- **Role:** "Dynamic markings, tempo indications, expressive text, technique text, and rehearsal marks are all generally added as expressions." The page also says "Expressions have the ability to adjust according to spacing changes in the music." (https://usermanuals.finalemusic.com/Finale2012Win/Content/Finale/ID_MAINTOOL_EXPRESSION.htm)
- **Note versus measure:**
  - "Double-click on, above, or below the note or measure to which you want to attach the marking." (https://usermanuals.finalemusic.com/Finale2012Win/Content/Finale/Expressions1.htm)
  - The right-click menu "will also state whether the expression is attached to a note or a measure." (Expression Tool page above)
  - The first page above does not define the two attachments further.
  - Articulations are a third thing: "Markings that apply to a single note/beat are added as Articulations." (https://usermanuals.finalemusic.com/Finale2012Win/Content/Finale/Expressions.htm)
- **Assignment to staff:**
  - "Any expression that is not a tempo mark, tempo alteration, or rehearsal mark … can be assigned to any number of staves."
  - Staff lists and "Assign to Specific Staves" exist.
  - "An attachment indicator line displays the expression's attachment point." (Expressions1)
  - Tempo marks are the Score List exception.
- **Reassigning:**
  - "Click and drag the expression to change the expression's attachment point (to a different beat or measure). To position the expression relative to a different staff, drag the expression over the desired staff." (Expressions1)
  - "ALT-click and drag or nudge an expression to move it without changing its attachment point." (Expression Tool page)
  - "Select an expression handle and press BACKSPACE to clear manual positioning changes."
  - Add to the staff above or below with CTRL+Up or CTRL+Down.
- **Positioning:**
  - The Expression Assignment dialog has "Alignment Point … the point at which the expression will be attached" and horizontal and vertical offsets. (https://usermanuals.finalemusic.com/FinaleWin/Content/Finale/STAFFEXP.htm)
  - The Positioning tab offers alignment choices such as "Left of Primary Notehead", "Left Barline", "Center Between Barlines" and "Horizontal Click Position". (https://usermanuals.finalemusic.com/FinaleWin/Content/Finale/IDD_DEFAULT_ENTRY_POSITIONING_PAGE.htm)
  - Category settings are shared. An expression's own settings are unlocked by unchecking "Use Category Positioning".

**Hairpins (Smart Shapes)**
- **Creating:**
  - "Position the cursor in the measure where you want the marking to begin so that the cursor arrow points to the staff to which you're attaching it. … Double-click; on the second click, hold the button down and drag to the right until the hairpin is the correct length." (https://usermanuals.finalemusic.com/Finale2012Win/Content/Finale/Crescendo_Decrescendo1.htm)
  - The tool page says note-attached shapes "highlight the appropriate end note." (https://usermanuals.finalemusic.com/Finale2012Win/Content/Finale/ID_SMART_TOOL_FIRST.htm)
- **Endpoints attach to a note or a measure:**
  - "Choose Attach to Measures to determine whether the next smart shape you create will be attached to measures (no notes or rests need be present)." (https://usermanuals.finalemusic.com/Finale2010Mac/Content/Finale/ID_MENU_SMART_ATTACH_MEAS.htm)
  - A measure-attached Metatool is for "items that extend over more than one note, or need to be positioned relative to the measure."
  - The Align Horizontally menu item lists "measure-attached Smart Shapes, such as Hairpins".
- **Editing by handles:**
  - "Click the handle of the shape you want to modify. The shape displays handles … Drag the appropriate handle to change the width, angle, or height of the hairpin." (https://usermanuals.finalemusic.com/Finale2012Win/Content/Finale/Crescendo_Decrescendo2.htm)
  - "Drag either endpoint of the hairpin across the other to change a crescendo into a decrescendo and vise versa."
  - "Finale automatically constrains to horizontal dragging … uncheck Make Horizontal".
  - Delete removes the shape.
  - Tool page: TAB selects the next secondary handle; arrow keys nudge.
- **System breaks:** the shape's menu offers "Make Horizontal Over System Break" and "Maintain Angle Over System Break" for hairpins. (Smart Shape tool page)
- **Options:** the Smart Shape Options dialog sets the default opening width, line thickness and Make Horizontal. (https://usermanuals.finalemusic.com/Finale2012Win/Content/Finale/SSOPTION.htm)

**MuseScore (contrast)**, https://musescore.org/en/handbook/4/dynamics
- **Dynamics:** "Select one or more notes, and then click an item in the Dynamics palette, or drag an item … onto a note."
- **Hairpin endpoints:**
  - The handbook says "The right-hand end of a hairpin is attached to the first note (or rest) after the range to which you apply it, though it will be drawn to end just before that note."
  - A single selected note draws the hairpin "up to the next note". A dragged palette hairpin "will extend to the end of the measure".
  - The drag-handle method on a dynamic: the new end dynamic at a lower level switches the hairpin from crescendo to decrescendo.
- **Moving:** "Dynamics, and the endpoints of hairpins, do not have to be attached only to notes or rests, but can be moved to rhythmic positions within longer durations."
- **Snapping:** hairpin endpoints follow a dynamic they are snapped to. Properties offer "Snap to previous" and "Snap to next".
- **Height and angle:** a handle sets the height. "Allow diagonal" frees the start and end handles.
- **Voice assignment:** dynamics are assigned to all voices by default, or to one voice.
- **Barlines:** dynamics shift sideways to avoid barlines.
- **Tempo** (https://musescore.org/en/handbook/4/tempo-markings):
  - Words are text, and the player does not read them. Each carries a preset tempo.
  - "rit." and "rall." slow to 75%, and "accel." speeds to 133%.
  - A tempo-change line applies "along the object's anchored range".

## 5. What a singer is likely to need to fix

Dann's ruling (`OPEN.md:2744`, item 1, 2026-10-01 15:11) is that the melody includes "the dynamics, the tempo indications, and the pickup". Item 6 (23:06) calls tempo text, dynamics and hairpins "new essential functionality that we need to build and install". N.178 is "measured on real pages before any accuracy is promised" (`STATE.md:103`).

| Item | homr (the default reader) | Status |
|---|---|---|
| Dynamics | Omitted by construction. The writer has no element for them (section 2). | Omission is **established from code**. Whether homr misreads dynamic ink as notes or marks is **NOT ESTABLISHED**. No measurement of it exists in the docs I searched, including the homr yardstick memos. |
| Hairpins | Omitted by construction. | Same. |
| Tempo words and metronome marks | Omitted by construction. OCR is off (`homr-reader.ts:158`). | Omission **established from code**. Whether the OCR would read them well is **NOT ESTABLISHED**. The only datum is one fixture reading "小=85" at 0.96, which is homr-web's own test and not an Ilya scan. |
| Misplacement | If a mark were read, where it lands in measure and beat is **NOT ESTABLISHED**. No code exists. | |

| Item | Ilya's own reader (`?reader=ilya`) | Source |
|---|---|---|
| Dynamic ink confused with heads | A dynamic's bracket scored 0.780 against heads at 0.829 or above, with a 0.05 margin. Its reach is 6.0 against heads at 3.0 to 4.46. | Measured in a code comment, `apps/web/static/reader/reader.py:1296-1301` |
| Tempo text read as a false beam | Duplicated tempo text above the first system produced a false beam on piece 02 p1, "visually confirmed". | Measured in a code comment, `apps/web/static/reader/run_page2.py:53-62` |
| Dynamic letter read as a flag branch | "a dynamic's letter" abstains. | `apps/web/static/reader/shape.py:45` |

Measured here means a code comment's own claim on named pages, not a re-run by me. The desk's own draft lists "Touching ink (a dynamic's letter on a stem's tip)" as a reason to mark a note unsure (`docs/sessions/draft-gould-expectations-for-the-scan-reader_r1_2026-10-02.md:41`).

**What follows for a singer, from code alone:**
- With a scan read by homr, every dynamic, hairpin and tempo word must be added by hand. The reader produces none.
- With a MusicXML file, tempo marks and words arrive, but every dynamic and hairpin is dropped (`musicxml-parser.ts:1002-1004`).
- The reader's misplacement of a tempo or dynamic mark, and its misreading of a dynamic as a note, are untested for homr.

## Tokens used

About 217,000 by the harness counter (15,000,000 down to 14,778,000). That is under the 250,000 ceiling, and no farm-out was used.

## Could not establish

- **How Finale splits a hairpin across a system break.** The manual gives only the two menu items. It does not describe the split drawing, and I did not find a page for it.
- **How Finale defines the two endpoint attachments in detail.** The manual says "measure-attached" and "note-attached" but gives no beat-position or free-position unit for a Smart Shape end. I did not find its Smart Shape assignment dialog. Expressions have "Alignment Point" (value and unit) in `STAFFEXP.htm`.
- **What "measure expression" and "note expression" mean as separate categories in Finale.** The pages say only that an expression attaches to either.
- **MuseScore's behaviour for hairpins across system breaks.** I did not read that page.
- **Whether homr misreads dynamic, hairpin or tempo ink as notes or other symbols.** No measurement was found in the docs I searched.
- **Per-region tempo override in Ilya.** `OPEN.md:238-239` says NOT ESTABLISHED, and nothing in the code supplies it.
- **Whether a mid-piece tempo change should enter the totals.** Today it cannot, because `secondsFor` uses one tempo (`phonation.ts:437-444`).

I read `OPEN.md` (N.120, N.123, N.177, N.178 items 1 and 6) and `PRODUCT.md` by section search, and did not read either file whole.