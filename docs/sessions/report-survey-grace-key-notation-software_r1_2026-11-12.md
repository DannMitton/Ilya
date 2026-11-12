# Survey: grace notes and key changes in four notation programs

Date: 2026-11-12. Revision r1.

## Method and limits

- Sources are each vendor's own manual, read through WebFetch. WebFetch returns a model-made extract of each page, not the page itself. Every claim below is the extract's reading of the page, and none was checked against the full text. Verify any item you will build on.
- Where an extract said a manual does not cover a point, I write NOT ESTABLISHED. Nothing is filled from memory.
- Inference is marked "(inference)".
- Short quotations are used at most once per source and stay under 15 words.

## Versions used

| Product | Manual read | Version evidence |
|---|---|---|
| Finale | Finale for Mac online manual (unversioned URL folder, the current one), supplemented by the Finale 2012 for Mac and Windows manuals where the current pages failed to load | The current pages show "Finale for Mac" with no version number. Version NOT ESTABLISHED. The 2012 pages are old and are flagged where used. |
| Sibelius | Sibelius Reference Guide PDF | Version 2020.3 on the title page. A newer Reference PDF was not found (the 2026.5 path failed). |
| Dorico | Dorico Pro Operation Manual PDF | Dorico Pro 6.2.30, file dated 2026-06-03. Page numbers below are that PDF's. |
| MuseScore 4 | handbook.musescore.org (current handbook, titled "MuseScore Studio") | No version stated on the pages. Version NOT ESTABLISHED. |

## Finale

Sources (all usermanuals.finalemusic.com):
- Grace notes overview, current: https://usermanuals.finalemusic.com/FinaleMac/Content/Finale/Grace_notes.htm
- Simple Entry grace note, 2012 Mac: https://usermanuals.finalemusic.com/Finale2012Mac/Content/Finale/Grace_notes9.htm
- Speedy Entry grace note, 2012 Mac: https://usermanuals.finalemusic.com/Finale2012Mac/Content/Finale/Grace_notes1.htm
- Slashes, individual, 2012 Mac: https://usermanuals.finalemusic.com/Finale2012Mac/Content/Finale/Grace_notes5.htm
- Slashes, global, 2012 Mac: https://usermanuals.finalemusic.com/Finale2012Mac/Content/Finale/Grace_notes4.htm
- Key Signature tool: https://usermanuals.finalemusic.com/FinaleMac/Content/Finale/tool-key-signature.htm
- Key Signature dialog: https://usermanuals.finalemusic.com/FinaleMac/Content/Finale/KEDLG.htm
- Key signatures overview: https://usermanuals.finalemusic.com/FinaleMac/Content/Finale/Key_signatures.htm
- Document Options, Key Signatures, 2012 Windows: https://usermanuals.finalemusic.com/Finale2012Win/Content/Finale/IDD_KEYSIG_OPTIONS.htm

### Grace notes

- G1. Two routes, both in Simple Entry. (a) Select the Grace Note tool and a duration in the Simple Entry Palette, then click where the note goes: one placing action. (b) Enter a normal note, then press Option+G (Mac) to convert it. In Speedy Entry, enter the note normally, open the frame, move the cursor to it with the arrow keys, and press ; or G. Source: current Grace_notes.htm. Windows shortcuts: NOT ESTABLISHED (only Mac pages read). The page does not describe a single action on a note that was already selected in the score for the "missing grace note" case beyond the conversion routes above.
- G2. Convert to grace: Option+G on the selected note (Simple Entry), or ; or G (Speedy). Or double-click the Grace Note tool with no other tool active and click an existing note. Back to normal: ; or G again in Speedy Entry (Grace_notes1.htm). In Simple Entry the 2012 page says Option+G cycles three states, regular, grace, slashed grace, then back to regular (Grace_notes9.htm). The current page does not repeat that cycle. Treat the cycle as 2012 behaviour until checked.
- G3. Flagged grace notes: slash display is a global setting, "Always Slash Flagged Grace Notes", in Document > Document Options > Grace Notes (Grace_notes4.htm). For one note, turn that setting off, then in Speedy Entry place the cursor on the flagged note and press the accent (grave) key (Grace_notes5.htm). Removing a single slash: NOT ESTABLISHED. Beamed grace notes take a slash by a custom expression (current Grace_notes.htm).
- G4. A group: Command+G toggles the Grace Note tool, enter several notes, Command+G again. Beamed pairs and groups in Speedy Entry: place the cursor on the second note and press /, repeat for each further note. In Simple Entry: Option-click the second note and press /. After-graces: NOT ESTABLISHED (the pages do not cover them).
- G5. Size is set in Document Options > Grace Notes (default 60 percent, per the current page). Re-pitching a grace note, changing its duration, and deleting one: NOT ESTABLISHED in the pages read. Only deletion by quantization ("Remove Grace Notes") in MIDI transcription is mentioned.
- G6. Simple Entry: Option-click the note. Speedy Entry: arrow keys in the editing frame. Clicking a grace note directly: NOT ESTABLISHED.

### Key signatures

- K1. Choose the Key Signature tool and double-click the measure where the change begins. The dialog has a key display with step arrows, a key-system menu (major, minor, keyless, nonstandard), and a Hide key signature and show all accidentals checkbox. Scope has three choices: Measure __ Through __, Measure __ Through End of Piece, Measure __ To Next Key Change. The text boxes start at the clicked measure. Keyboard shortcut: NOT ESTABLISHED. Sources: tool-key-signature.htm, KEDLG.htm.
- K2. Editing an existing change by a stated procedure: NOT ESTABLISHED (the tool page describes adding only). The dialog's "Transpose All Keys Proportionally" option, when cleared, removes existing key changes in the chosen region. To hide a key signature in one measure, set Key Signature to Always Hide in Measure Attributes (Key_signatures.htm). Outright removal of a key change: NOT ESTABLISHED.
- K3. Courtesy key: when a change falls at a line break, the new key appears at the end of the system and again at the start of the next. It is hidden everywhere by clearing a courtesy option in Document Options > Key Signatures, or in one place by Hide Cautionary Clefs, Key and Time Signatures in that measure's Measure Attributes (Key_signatures.htm). In the 2012 Windows manual the option is "Display Courtesy Key Signature at End of Staff System", and the extract noted that its description refers to time signatures, so its scope is unclear (IDD_KEYSIG_OPTIONS.htm, 2012). Cancelling naturals: the 2012 manual has "Cancel Outgoing Key Signature", which shows naturals in the courtesy key when moving to fewer sharps or flats; when cleared, no naturals appear. A separate 2012 option repeats naturals at the start of a system after a change to C. Whether the current version matches: NOT ESTABLISHED. Double barline at a key change: NOT ESTABLISHED. Defaults: NOT ESTABLISHED.
- K4. The user is offered the choice in the same dialog. Options named: Transpose Notes (Up or Down), Hold Notes to Original Pitches Chromatically (keeps spelling), Hold Notes to Original Pitches Enharmonically (re-spells), Hold Notes to Same Staff Lines (Modally) (no accidentals added), plus Transpose All Keys Proportionally and Wrap Keys if Necessary (KEDLG.htm). Default choice: NOT ESTABLISHED.

## Sibelius

Sources (Sibelius Reference Guide 2020.3, https://resources.avid.com/SupportFiles/Sibelius/2020.3/Sibelius_Reference.pdf):
- Section 4.23 Grace notes, pp. 450 to 452.
- Section 3.4, p. 254 and p. 255 (note input and grace notes).
- Section 3.2 Keypad, pp. 245 to 248.
- Section 4.2 Key signatures, pp. 359 to 361.
- Section 4.5 Barlines, pp. 369 to 374.

### Grace notes

- G1. Two routes. Fast: with nothing selected, choose a duration (Keypad layout 1, F7) and the grace note kind (Keypad layout 2, F8), then click where the grace note goes. A note without a chosen value comes in as an eighth note and can be changed later (p. 450 to 452). Or in note input, choose appoggiatura or acciaccatura on the F8 layout, then input the note (p. 254).
- G2. To grace: select a normal note and type a semicolon (p. 254). Back to normal: NOT ESTABLISHED (the extract says the page does not say).
- G3. Chosen by the appoggiatura or acciaccatura button on the F8 Keypad layout before inputting (p. 254, p. 450). Sibelius calls a note with a diagonal stem line an acciaccatura and one without an appoggiatura. Toggling the type of an existing grace note: NOT ESTABLISHED.
- G4. A group: after the first, type A to G (or play a MIDI keyboard) to add more grace notes; type 1 to 9 for chords (Shift for downward). After-graces: NOT ESTABLISHED as a feature. The manual says grace notes always attach to the next normal note, so none can be created at the end of a bar. Workaround: enter them before a note in the next bar, then move them before the barline with the X parameter in the Inspector, and afterwards move them only by the Inspector, since otherwise they may reattach to another note (p. 450 to 452).
- G5. The section says editing works as for normal notes: dragging, copying, deleting, changing note value, accidentals, beaming, notehead. It gives no dedicated procedure for each. Re-pitch specifically: NOT ESTABLISHED. Re-inputting pitches skips over grace notes before a note (p. 255).
- G6. Selecting a grace note by click or arrow keys: NOT ESTABLISHED.

### Key signatures

- K1. Notations tab > Common > Key Signature, shortcut K. Pick a major or minor key. With a note or rest selected the key goes after it; with nothing selected, click a position with the mouse. To change key for a span and return afterwards, select the bars first and Sibelius restores the old key at the span's end. No dialog scope field is described. A One staff only option exists for per-staff keys (p. 359 to 361).
- K2. Move a key change by dragging or with the arrow keys. To delete one mid-piece, select it and press Delete. To remove a key at the start of a system, delete the cautionary key at the end of the previous system. To remove the opening key, place C major, A minor, or Open key/Atonal over it (p. 359 to 361).
- K3. A mid-piece key change is automatically preceded by a double barline that can be deleted. Cancelling naturals: the Engraving Rules option Cautionary naturals adds naturals cancelling the previous key. When it is off, naturals appear only for a change to C major, A minor, or Open key/Atonal. Cautionary key at the end of the previous system: shown for a change at a system start. For a new section, More Options at the bottom of the Key Signature menu has a Hide switch. An existing one is hidden with Home > Edit > Hide or Show (Ctrl+Shift+H). The previous system should end with a system or page break, or the hidden change may land mid-system (p. 359 to 361).
- K4. NOT ESTABLISHED. The extract says the text does not clearly state whether existing notes keep their sounding pitch. It says to transpose the music as well as the key, use Note Input > Transpose. No choice is offered in the key-signature feature as described (inference from the absence).

## Dorico

Sources (Dorico Pro 6.2.30 Operation Manual PDF, https://www.steinberg.help/api/khub/documents/RCumcJRCDB6rUBXGSJP8bg/content; also listed at https://www.steinberg.help/v/u/dorico_pro_6_1_operation_manual_en.pdf):
- Inputting grace notes, pp. 331 to 332.
- Input methods for key signatures, pp. 363 to 368.
- Key signatures, pp. 1363 to 1373.
- Grace notes sections, pp. 1422 to 1430.

### Grace notes

- G1. In Write mode, select an item at the rhythmic position, start note input (Shift+N, the Start Note Input button, or double-click on the staff), then start grace note input with / or the Grace Notes button in the Notes toolbox. Press a duration number (for example 5 for eighth), input pitches, then press / again to return to normal input (p. 331 to 332). This is a mode within note input, not one action on a selected note. The extract says the text does not state whether the grace notes land before or after the caret note. The conversion route below is the other option.
- G2. Select notes in Write mode, then press the grace notes shortcut or click Grace Notes in the Notes toolbox. The notes keep their notated duration and lose rhythm dots. By default slashed grace notes attach to the position after the last selected note in each range and unslashed ones to the position of the first selected note. This default can be changed in Preferences > Note Input and Editing > Editing (p. 1424). The exact key symbol was missing from the extract, so the shortcut is NOT ESTABLISHED here, apart from / during input. Back to normal: select the grace notes, optionally turn on Insert mode (I), and press the same shortcut or click Grace Notes (p. 1425).
- G3. During input or before converting: Alt/Opt+/ toggles slashed and unslashed, or click and hold Grace Notes in the Notes toolbox and choose Slashed or Unslashed (p. 331, p. 1424). After the fact: select the grace notes and set Grace note type in the Properties panel, Grace Notes group, to Slashed stem or Unslashed stem (p. 1426).
- G4. Several at one position: no limit on the number at one rhythmic position (p. 331). Grace notes can be shown before a barline: select them and switch on Grace note before barline in the Properties panel (p. 1425). Whether that counts as an after-grace in the sense wanted here: NOT ESTABLISHED. An after-grace as its own feature: NOT ESTABLISHED.
- G5. Duration: input with the number keys; grace notes accept any rhythmic value but no dots (p. 331). Re-pitch, delete, and change duration of an existing grace note: NOT ESTABLISHED in the extracts.
- G6. Selecting a grace note: NOT ESTABLISHED in the extracts. Grace notes are selected for conversion in Write mode (p. 1425), but the manner is not described.

### Key signatures

- K1. Write mode: select an item (or start note input) at the position. Open the popover with Shift+K, or Notations toolbox > Popovers > Key Signatures. Type a key: uppercase letter for major, lowercase for minor, a count such as 3# or 4b, or "open" for atonal. Return applies to all staves. Alt/Opt+Return applies to the selected or caret staves, or set the Local/Global indicator. Mouse path: Notations toolbox > Panels > Key Signatures, Tonality Systems, and Accidentals, click a key (Alt/Opt+click for the selected staves). The key starts at the earliest selected item's rhythmic position and runs to the next key signature or the end of the flow (p. 363 to 368). The scopes "selected region" and "until next" as popover fields: NOT ESTABLISHED.
- K2. Selecting an existing key signature and entering a new one replaces it (p. 363 to 368). A removal procedure is not described in that section. The Key signatures overview says you cannot hide key signatures and that you avoid showing one by inputting an open key signature or deleting key signatures from the flow or project (p. 1363).
- K3. Cancelling naturals: controlled in Engraving Options > Key Signatures, in three styles (Common practice, Traditional, Russian), shown before or after barlines. When naturals are omitted: NOT ESTABLISHED. Barline: a key change mid-piece customarily follows a double barline, which is the default, and the barline can be changed on the Barlines page of Engraving Options. Courtesy key: when a change falls at a system break the new key also appears at the end of the preceding system, as one item with the one at the next system's start. It can be hidden per item (Properties panel) or by default per flow (Notation Options). Not shown between flows (p. 1363 to 1373).
- K4. NOT ESTABLISHED. The extract says only that later notes follow the new key and that MIDI-input accidentals are spelled by the key. It does not state whether written pitches stay or transpose, and no choice is offered in the popover or panel as described.

## MuseScore 4

Sources:
- Grace notes: https://handbook.musescore.org/notation/expressive-markings/grace-notes
- Key signatures: https://handbook.musescore.org/notation/pitch/key-signatures

### Grace notes

- G1. One action on a selected note: select the parent note, then click a symbol in the Grace notes palette. Dragging a symbol from the palette onto a note also works. Shortcut: / (slash) adds an acciaccatura to the selected note. Other kinds can be given custom shortcuts in Preferences > Shortcuts. Several parent notes can be selected at once in normal mode.
- G2. Converting an existing note to a grace note, and back: NOT ESTABLISHED. The page offers no conversion procedure.
- G3. Chosen by the palette item (Acciaccatura, Appoggiatura, Grace note after). Acciaccatura is usually drawn with a stroke through the flag or beam. After adding, the property Show stem slash (Properties > Note > Stem) toggles the slash, and in a beamed group setting it on one note applies to the group.
- G4. Several: repeat the shortcut, palette click, or drag. Grace note chords on standard staves: add one, then Shift+letter A to G, Alt+1 to 9, or Add > Intervals. After-graces: the palette has an item "Grace note after" described there as used for trill endings. Its placement rules: NOT ESTABLISHED.
- G5. Duration: in normal mode, click the grace note and choose a duration from the note input toolbar or by shortcut. Pitch: by the methods in "Editing notes and rests" (not read). Delete: NOT ESTABLISHED on the page. Size: Format > Styles > Sizes > Grace note size, separate from small note size.
- G6. Click the grace note in normal mode. Arrow-key selection: NOT ESTABLISHED.

### Key signatures

- K1. Select a measure, note, or rest, then click a key in the Key signatures palette, or drag it onto the measure. Changes normally begin at the start of a measure unless local. A key change can go on any note or rest. Hold Ctrl (Cmd on Mac) while adding for a local (single-staff) key signature. Scope as "to next change" or "to end": NOT ESTABLISHED, no such field is described. The starting key is set on the second page of the New Score dialog.
- K2. Replace: select and click another key in the palette. Remove: select it and press Delete. The key signature at the very start of a score cannot be deleted (it gives an error), so add the wanted key to the first bar instead. Hide on one staff, throughout: Staff/Part properties > Advanced style properties, uncheck Show key signature. Hide one instance: Visible in the Properties panel, or V.
- K3. Courtesy key at a system start: shown by default at the end of the previous system. Toggle all with Show courtesy key signatures in the Style dialog, or one with Show courtesy key signature on previous system in the Properties panel. Cancelling naturals: governed by the Style setting Naturals in key signatures. The page does not list the options, so when naturals are omitted is NOT ESTABLISHED. Double barline: Style > Barlines > Use double barlines before key signatures, with three options (Always, Never, Only before courtesy key signatures). The default among these: NOT ESTABLISHED.
- K4. NOT ESTABLISHED. The page says it does not state what happens to existing notes when a key signature changes. No choice is offered on the page.

## Patterns

Agreement
- All four place a grace note by choosing a duration and a type (slashed or unslashed) before or while inputting, and all four allow runs of several grace notes before one note.
- All four have a conversion route in some form, except MuseScore, where it is NOT ESTABLISHED: Finale (Option+G, or ; or G), Sibelius (semicolon), Dorico (grace notes shortcut on a selection).
- All four draw a courtesy key at a system break, and all four let the user hide it (Finale in Document Options or Measure Attributes, Sibelius with Hide, Dorico in Properties or Notation Options, MuseScore in Style or Properties).
- All four have a mechanism for cancelling naturals, and all four control it in a settings dialog (Finale Document Options, Sibelius Engraving Rules, Dorico Engraving Options, MuseScore Style).
- None of the four documents after-graces as a first-class, step-by-step feature in the pages read. Sibelius and Dorico describe attaching grace notes before a barline, and MuseScore has a "Grace note after" palette item.

Differences
- Grace note entry: MuseScore is the only one with one action on a selected note (palette click or /), and its shortcut is a single key. Sibelius and Finale click at a position or convert after entry. Dorico runs a grace note input mode (/) or converts a selection.
- Slash toggle: Dorico has the clearest after-the-fact control (Properties panel, Grace note type, plus Alt/Opt+/). MuseScore has Show stem slash in Properties. Finale works through a global option plus a Speedy Entry key. Sibelius chooses at input only (toggling later NOT ESTABLISHED).
- Key change scope: Finale alone puts three scope choices in the dialog (through a measure, to end, to next change). Dorico runs the key to the next key signature or the end of the flow. Sibelius and MuseScore have no scope field in the pages read, though Sibelius restores the old key at the end of a selected span.
- Written pitches at a key change: only Finale documents a choice (four options in its dialog). For Sibelius, Dorico, and MuseScore it is NOT ESTABLISHED.
- Double barline: Sibelius adds one automatically (deletable). Dorico defaults to one and offers a setting. MuseScore has a three-way style setting. Finale: NOT ESTABLISHED.
- Removing a key change: MuseScore and Sibelius say select and Delete. Dorico says replace it, and that deleting key signatures from the flow is the way to avoid showing any. Finale: NOT ESTABLISHED.

What a user correcting a scanned score would find fastest (inference, from the above, not from any manual)
- Missing grace note: MuseScore (select the parent note, press /, then set duration and pitch) looks fastest for an acciaccatura. Dorico is next if the user converts a note already entered (select, press the shortcut), then uses the Properties panel for slashed or unslashed. Sibelius and Finale are comparable: place with the Keypad or palette and a click, or enter and convert.
- Misread key: Finale's dialog is the one that states a scope and a pitch-handling choice in one place, which suits a key that was misread across the whole piece. Sibelius (K, then a click) and MuseScore (palette click on the measure) are the quickest to apply but their pages do not state what happens to the notes already entered. In Dorico, selecting the existing key signature and typing a new key in the Shift+K popover replaces it.
- A caution on this inference: the pitch-handling behaviour for Sibelius, Dorico, and MuseScore needs a test in the program itself before anyone relies on it.
