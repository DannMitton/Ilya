Returned by a Sonnet research agent, 2026-10-08, commissioned by the desk on Dann's request of 12:50. Web research only.

# Precedents: how notation editors handle correction and marking, and whether their controls change with selection

Instrument key: [VD] vendor documentation, [VV] vendor video (none used), [IR] independent review, [UF] user forum, [INF] my inference, marked as such.

Method note. The Sibelius Reference and the Sibelius mobile guide (PDFs) and the MuseScore handbook (llms-full.txt export) were read as raw text. LilyPond and Frescobaldi pages came back through the fetch tool's summariser, so their quotations are second-hand. Page numbers for Sibelius are the printed page numbers.

Sources:
- S1 Sibelius Reference Guide v2020.3, dated 03/20 in its part number: https://resources.avid.com/SupportFiles/Sibelius/2020.3/Sibelius_Reference.pdf [VD]
- S2 Using Sibelius for Mobile (iPhone, iPad, Android), created 14 Oct 2025: https://resources.avid.com/SupportFiles/Sibelius/Using_Sibelius_for_mobile_EN.pdf [VD]
- S3 Scoring Notes, Inspector in Sibelius 7 (undated): https://www.scoringnotes.com/tutorials/video-tutorial-using-the-inspector-in-sibelius-7/ [IR]
- M1 MuseScore Studio Handbook (undated; mentions 4.2 beta): https://handbook.musescore.org/llms-full.txt, pages "Editing notes and rests", "Using the palettes", "Properties panel", "Tuplets", "Dynamics and hairpins", "Tempo markings", "Other lines" [VD]
- M2 MuseScore forum, "Musescore Mobile Editor App", 26 Mar 2022: https://musescore.org/en/node/330729 [UF]
- L1 LilyPond Notation Reference 2.24.4: https://lilypond.org/doc/v2.24/Documentation/notation/ (pages expressive-marks-attached-to-notes, writing-rhythms, writing-pitches, displaying-rhythms, bars, writing-text) [VD]
- F1 Frescobaldi Manual (undated): https://frescobaldi.org/uguide.html [VD]

## 1. Summary tables

### Sibelius (desktop; Ultimate has the Inspector)

| Task | Method | Source |
|---|---|---|
| (a) wrong pitch | Select note, up/down arrow keys; Shift-PgUp/PgDn for a semitone; letters A to G; Re-input Pitches | S1 p.252, 255 |
| (b) accidental | Select note, press the Keypad accidental (# is key 8); Respell command. Double accidentals exist in all tiers. Which Keypad button gives a double sharp: NOT ESTABLISHED | S1 p.252, p.11 |
| (c) length or dot | Select note, choose new value on Keypad. Longer: following notes become rests. Shorter: rests pad the bar. Dot button: NOT ESTABLISHED | S1 p.252 |
| (d) triplet | Select the first note (unit length), Ctrl+3; rests appear for the rest of the tuplet. Unmake: select the number or bracket, Delete, which also deletes the notes | S1 p.275-276 |
| (e) delete | Delete turns note or passage into rests; Delete again on all-rest bars restores a bar rest. Mobile: Delete icon clears selected objects or a whole range | S1 p.253, 255; S2 |
| (f) tempo | Ctrl+Alt+T (Tempo text style), type it | S1 p.467 |
| (g) rit./accel. | Line from the Rit. and accel. gallery, "click and drag"; system line | S1 p.378 |
| (h) dynamic | Ctrl+E (Expression text), type it | S1 p.467, 476 |
| (i) hairpin | Select start note, H (cresc.) or Shift-H (dim.); Space extends, Shift-Space retracts | S1 p.383 |

### MuseScore 4 (desktop)

| Task | Method | Source |
|---|---|---|
| (a) pitch | Up/Down (semitone), Alt+Shift+Up/Down (diatonic), Ctrl+Up/Down (octave); single, list, or range selection | M1 Editing |
| (b) accidental | Note input toolbar accidental buttons or shortcuts toggle on selected notes; Accidentals palette. Double sharp is among standard accidentals. Natural carried through the bar: NOT ESTABLISHED | M1 Editing; Entering notes |
| (c) length or dot | Click duration icon or keys 1 to 9 on selection; Shift+W/Shift+Q step through dotted values (single note only); Q/W halve or double a range | M1 Editing |
| (d) triplet | Select note or rest, set duration of whole group, Ctrl+3. Unmake: NOT ESTABLISHED in the handbook | M1 Tuplets |
| (e) delete | Del: note becomes rest; list selection, each individually; range, replaced by correct rests. Ctrl+Del (Remove selected range) also removes the time | M1 Editing |
| (f) tempo | Select note or rest, click Tempo palette item; or Add > Text > Tempo marking | M1 Tempo |
| (g) rit./accel. | "Tempo change line" from Tempo palette; a line anchored to a range | M1 Tempo; Other lines |
| (h) dynamic | Select note(s), click Dynamics palette item; or Ctrl+D popup and type | M1 Dynamics |
| (i) hairpin | Select note(s) or range, click palette hairpin or press < or >; right end attaches to the note after the range | M1 Dynamics |

### LilyPond with Frescobaldi (text-based)

| Task | Method | Source |
|---|---|---|
| (a)-(c) pitch, accidental, length | Edit the text. Double sharp is `isis` (Dutch names). Dot is a suffix `.` | L1 writing-pitches, writing-rhythms |
| (d) triplet | `\tuplet 3/2 { b4 4 4 }`. Unmake: edit text [INF] | L1 writing-rhythms |
| (e) delete | Delete text [INF]. Frescobaldi has no separate delete model in its manual | F1 |
| (f) tempo | `\tempo 4 = 120`, or `\tempo "Allegro" 4 = 160` | L1 displaying-rhythms |
| (g) rit./accel. | Text spanner: `\startTextSpan` on first note, `\stopTextSpan` on last, with `TextSpanner.bound-details.left.text = "rit."` | L1 writing-text |
| (h) dynamic | Postfix on a note: `c4\ff` | L1 expressive marks |
| (i) hairpin | `\<` or `\>` on start note, ends at `\!`, a dynamic, or another hairpin | L1 expressive marks |

## 2. Per-app notes

### Sibelius

- Inspector (Ultimate only) is selection-dependent. Title reads "No selection", "Edit Note", "Edit Passage", "Edit Text", "Edit System Text", or "Edit Multiple Selection". It has up to six sections, "normally only two or three of them will be visible because only controls that are relevant to the current selection will be shown." Some options "are only present when certain types of object are selected." S1 p.227 [VD]. An undated Sibelius 7 video review agrees: "context-sensitive, so it only shows you options that are relevant." S3 [IR].
- Keypad has six fixed layouts (F7 to F12). It "shows and lets you edit the characteristics of the selected note(s), chord(s) or rest(s)." S1 p.245 [VD]. On mobile, "When you select a note, the Keypad indicates its properties": the half-note button highlights, and sharp and accent highlight if present. Tapping a highlighted button removes that property; tapping an unhighlighted one adds it. S2, "Viewing and Editing Note Properties" [VD]. So the layout is fixed and the buttons show state.
- Greying is by tier, not selection. In the mobile app "Unsupported options are grayed out" for Artist and First; in Command Search, commands not in your tier are grayed out and commands unsupported on mobile are not shown. S2 [VD]. On desktop, disabled features "do not disappear from the ribbon, but they are grayed out." S1 p.162 [VD]. Whether ribbon items grey out by selection state: NOT ESTABLISHED.
- Model is mixed: select then act (Keypad, H), choose then apply for lines (click and drag from gallery, S1 p.378), and type the thing (Ctrl+E, Ctrl+Alt+T, S1 p.467). Text can be typed during note input, S1 p.255.
- Mobile Pitch Correction tool: select a note, touch and hold the tool, drag up or down for pitch, left to flatten, right to sharpen. S2 [VD]. This is the closest precedent for a semitone nudge on a touch device.
- Mobile hairpins and tempo: select, tap the + Create menu, then the Lines or Text gallery. S2 [VD]. Mobile tuplet method: NOT ESTABLISHED (no text hit in the guide).
- Error handling: bars cannot silently fail when editing, since a shorter note pads with rests. Imported bars that "don't add up" are lengthened with rests or shortened by omitting notes at the end. S1 p.71, p.252 [VD]. Notes outside an instrument's range show red when View > Note Colors > Notes Out of Range is on. S1 p.207 [VD]. A highlight for rhythmically wrong bars: NOT ESTABLISHED.
- Vocal default: hairpins go "above vocal staves." S1 p.384 [VD].

### MuseScore 4

- Properties panel (formerly Inspector) is selection-dependent. Nothing selected: global score settings. Anything selected: General settings (Visible, Auto-place, Cue size, Play). "Under the Playback button, playback properties are shown if the selected elements have any"; Velocity and Tuning appear for notes only. M1 Properties panel [VD]. Getting started: "The properties panel will show settings that are specific to the object being selected." M1 [VD]. Hairpins have their own tab settings (height, Allow diagonal). M1 Dynamics [VD].
- Palettes panel is fixed. The handbook describes apply-to-selection only: "select the target elements ... then click the palette item." The same item behaves differently by selection: with a range selected, a text item (dynamics, tempo) goes on the first element only; system text on the top staff only. M1 Palettes [VD]. Greyed or hidden palette items: NOT ESTABLISHED.
- Mode matters more than selection: "Many of the most powerful commands are only available after you leave note input mode." M1 Editing [VD].
- Typing: Ctrl+D opens a dynamics popup; type `pp` or `mf`, then Esc. From a selected dynamic, drag its right handle to make a hairpin, and the popup returns for the end dynamic. M1 Dynamics [VD].
- Hairpin gotcha: it is anchored to the first note after the range, so "do not include the final note." M1 Dynamics [VD]. Tempo change lines have preset effects (rit. to 75 per cent, accel. to 133 per cent), changeable. M1 Tempo [VD].
- Error handling: rests "cannot normally be deleted completely, as removing them would leave a measure with fewer beats than it should have." M1 Editing [VD]. Measure properties have Nominal and Actual duration. M1 Measure properties [VD]. Out-of-range notes are red. M1 Staff/Part properties [VD]. A flag for wrong-length measures: NOT ESTABLISHED.
- Mobile editing: none. Forum, 2022: mobile versions are "only for playback." M2 [UF]. Not re-checked against 2026 releases.

### LilyPond and Frescobaldi

- Data model: dynamics are postfix commands on a note (`c4\ff`). A hairpin starts with `\<` or `\>` and ends with `\!`, an absolute dynamic, or another hairpin, at the right edge of the note carrying it. `\after` covers mid-note starts. L1 [VD]. Tuplets wrap music: `\tuplet 3/2 { ... }`. L1 [VD]. Tempo is an event: `\tempo 4 = 120`. Markup-built tempo marks do not change MIDI tempo. L1 [VD].
- Rit. is a text spanner, not a tempo event: `\startTextSpan`/`\stopTextSpan`, one spanner per voice. The page is silent on MIDI effect. L1 writing-text [VD].
- Bar checks: `|` warns in the log when a bar line falls in the wrong place. Example `\time 3/4 c2 e4 | g2 |` flags the second. Repeats of the same offset are suppressed. L1 bars [VD].
- Frescobaldi: Point & Click means "Click an object to move the text cursor to that object." F1 [VD]. Quick Insert panel adds elements "to the current note or selected music"; with a range selected, dynamic spanners terminate at the last note in the selection; with no selection, the cursor advances to the next pitch, rest, skip, or chord. F1 [VD]. Tools > Rhythm can double or halve lengths, add or remove dots. F1 [VD]. The manual says nothing about buttons disabling by selection.

## 3. Patterns

1. Fixed controls that display selection state. Sibelius's Keypad keeps six fixed layouts and lights up the selected note's properties (S2, S1 p.245). A toggle that is pressed means "this note has it"; pressing again removes it. This fits a singer correcting a reading: one persistent row, state visible.
2. Fixed-and-greyed versus changing-with-selection. No source documents greying by selection in any of the three apps. Greying documented is by tier or feature set (S1 p.162, S2). Changing-with-selection is documented for the detail panels: Sibelius Inspector (S1 p.227), MuseScore Properties (M1). Neither app changes its primary entry surface (Keypad, palettes) by selection; they keep those fixed and let selection decide the effect (M1: range puts text on the first element only). Precedent leans to: fixed primary row; a separate detail area that changes with what is selected.
3. Range-versus-point attachment is the sharp edge. MuseScore hairpins attach to the note after the range (M1); Sibelius extends with Space (S1 p.383); LilyPond ends at `\!` (L1). Users must say where a mark ends as well as where it starts.
4. Bars are kept legal by construction rather than flagged. Sibelius pads with rests (S1 p.252); MuseScore refuses to delete rests (M1); only LilyPond warns (L1 bars). No app found has a prominent "this bar is wrong" highlight. This is a gap for a tool whose input is a machine reading with whole-bar errors.
5. Typing and selecting coexist. Sibelius (Ctrl+E, Ctrl+Alt+T), MuseScore (Ctrl+D popup), and LilyPond all let you type the marking; lines and hairpins are select-then-apply or choose-then-drag. Tuplets are select-first-note-then-command in both GUIs; removal is delete, which in Sibelius takes the notes with it.

## 4. Could not establish

- Whether any of the three apps greys out ribbon, toolbar, or palette items by selection state. No documentation found says so.
- Sibelius: Keypad button for double sharp; dot button; mobile tuplet method; any rhythmic-error highlight.
- MuseScore 4: how to unmake a tuplet; how a natural is carried through a bar; palette greying; any wrong-length measure flag; current mobile editing status (only a 2022 forum post).
- LilyPond: whether text-spanner rit. affects MIDI; how accidentals carry through a bar (the page fetched did not say).
- Frescobaldi: tuplet and delete workflows (none in the manual); Re-pitch was not in the page returned.
- Source dates: Sibelius desktop guide is March 2020 (2020.3), not the current release; MuseScore handbook and Frescobaldi manual undated.
