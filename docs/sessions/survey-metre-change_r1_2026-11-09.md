# Survey of time signature change in notation and OMR software, r1

Date: 2026-11-09. Purpose: model Ilya's planned correction "change the time signature from this bar" (for a misread such as 4/8 where the print has 3/4), alongside the barline add and remove corrections in the earlier survey (/home/claude/barline/survey-barline-handling_r1_2026-11-09.md, not repeated here).

Method: every URL below was opened this session (HTML, PDF text, or the MuseScore handbook's Markdown export). Quotation marks surround wording copied from the page; everything else is paraphrase. Anything marked "Inference" is mine. Finale is the primary model, at Dann's request, and gets the deepest section.

## Finale (primary model)

Sources opened:
- Time Signature tool (2014 Windows manual): https://usermanuals.finalemusic.com/Finale2014Win/Content/Finale/ID_MAINTOOL_TIMESIG.htm
- Time Signature dialog box, older wording (2012 Windows): https://usermanuals.finalemusic.com/Finale2012Win/Content/Finale/TIDLG.htm
- Time Signature dialog box, later wording: https://usermanuals.finalemusic.com/FinaleWin/Content/Finale/db-time-signature.htm
- Time signatures (encyclopedia, later wording): https://usermanuals.finalemusic.com/FinaleWin/Content/Finale/Time_signatures.htm
- Rebarring music (later and 2012 wording): https://usermanuals.finalemusic.com/FinaleWin/Content/Finale/Rebarring_music.htm and https://usermanuals.finalemusic.com/Finale2012Win/Content/Finale/Rebarring_music.htm
- Rebar Options dialog box: https://usermanuals.finalemusic.com/Finale2014Win/Content/Finale/REBAROPT.htm
- Rebar submenu: https://usermanuals.finalemusic.com/FinaleMac/Content/Finale/sub-rebar.htm
- Tutorial 2, "Changing the time signature": https://usermanuals.finalemusic.com/Finale2010Mac/Content/Finale/Tutorial_2__Adding_Details2.htm
- Pickup and Rebar pages from the earlier survey (MassEditORebar.htm, Pickup_measures.htm) are relied on for pickups.

### The action and its object

- Tool: "Time Signature tool". Page summary: "With this tool, you can change the time signature in any measure. Double-click the measure to display the Time Signature dialog box, from which you can select the new meter. You can also use the mouse to select a region of music with the Time Signature Tool."
- Dialog: "Time Signature dialog box". How to get there: "Choose the Time Signature tool and double-click a measure."
- Verbs and nouns Finale uses: "change the time signature", "specify a new meter", "meter change", "the measure where the time will change". The object is "time signature" in tool and dialog names and "meter" in explanatory text (US spelling, "measure", never "bar").
- The 2012 dialog page says the dialog specifies "a new meter for the measure you clicked (and following measures)."

### Every control in the dialog, exact names

From the later wording (db-time-signature.htm), with the 2012 wording (TIDLG.htm) where it differs:
1. "[Time signature preview]" (a preview of how the signature will look in the document).
2. "Composite" (button; opens the Composite Time Signature dialog box, for such as 3+2+2/8).
3. "More Options" and "Fewer Options" (expand and collapse the lower display portion). The 2012 page calls this one button "Options".
4. "Number of Beats" (the upper number; 2012 wording: "Use the upper scroll bar...").
5. "Beat Duration" (the lower number, "the rhythmic value of each beat").
6. "Rebar Music" (checkbox).
7. Scope, three mutually exclusive options:
   - "Measure ___ through ___" (two text boxes; "Finale displays the measure numbers for any region you have drag-selected in these text boxes").
   - "Measure ___ through end of piece" (the box proposes "the measure you initially selected").
   - "Measure ___ to next time change" ("change the meter from the measure you clicked until the next measure with a different time signature").
   The 2012 page capitalizes these as "Measure ___ Through ___", "Measure ___ Through End of Piece", "Measure ___ To Next Time Change".
8. "OK" and "Cancel" ("Click OK (or press ENTER) to confirm").
9. Lower portion after More Options: "Use a Different Time Signature for Display" (beam by one signature, show another; example in the page: beam as 6/8, display 3/4), a second "Composite", "Number of Beats", "Beat Duration", a second preview, and "Abbreviate" (use the common-time or cut-time symbol or not, per occurrence).
Not in the dialog, but related: Measure tool, Measure Attributes dialog (double-click the measure's barline handle), "Time Signature" dropdown with "Always Show" and "Always Hide". Document > Document Options > Time Signatures holds global display options such as courtesy signatures.

### Scope: from this measure until the next change

- The dialog's three scope options give exactly the choices Ilya asked about. "To next time change" is the until-next-change behaviour; "through end of piece" overwrites later changes; "through" a range ends at a chosen measure.
- Drag-selecting a region first pre-fills the range boxes, so the selection sets the default scope.
- Inference: the dialog does not say what it picks by default. I did not find a stated default radio option on these pages.

### What happens to existing notes and barlines

- The "Rebar Music" checkbox controls it. The Rebarring music page: "In the Time Signature dialog box, the Rebar Music option, when selected, rebars your music automatically whenever you change the time signature." Rebarring "redistributes the notes of your score so that each measure contains the right number of beats." Finale "is smart enough to split or combine notes as needed, rebeam the notes, and stop rebarring at points you designate (such as key or time changes); the program will also create measures as necessary."
- If the stopping point arrives without enough notes to fill a measure, "it will fill this final measure with the appropriate number of rests." Rebarring partly filled measures does not pad them: two quarter notes in each of two 4/4 measures become one measure of four quarters. Padding is done separately with Fill With Rests (Utilities > Check Notation submenu).
- Without rebar, the dialog page says only: "When deselected, Finale leaves the beaming of the notes as it currently appears in the score." The Tutorial says the opposite emphasis: "Uncheck Rebar music. Rebar Music redistributes the barlines to fit the same music given the new time signature." The Tutorial unchecks it for a change from 4/4 to 2/2 through end of piece, to keep the existing barlines. So Finale does have a "change the signature without moving barlines" mode (uncheck Rebar Music), and its own pages disagree on whether the checkbox also rebeams. The dialog pages say the checkbox governs rebeaming; the Rebarring music page and tutorial say it governs redistribution of notes across barlines. I cannot reconcile them from the documentation. This is the single most relevant fact for Ilya (see "What Ilya can adopt").
- The Rebarring page says the Rebar Music option rebars "automatically whenever you change the time signature", so rebar is on by default in the sense that the user must uncheck it. The Rebar submenu says: "Finale automatically rebars the piece each time you change the time signature unless you turn off this option in the Time Signature dialog box."
- Manual rebar: select a region with the Selection tool, Utilities > Rebar > Rebar Options, then Utilities > Rebar > Rebar Music. "Rebar Music: Use this command to manually rebar your score."

### Rebar Options dialog (exact names)

Reached with the Selection tool and a region selected: Utilities > Rebar > Rebar Options. Controls: "The End of the Region" (only rebar to the end of the selection); "Key Signature Changes", "Time Signature Changes", "Special or Repeat Barlines, or Forward Repeats" (the rebar will not proceed past the next such item); "Empty Frames" (stop at the next empty measure; "a frame is one measure of one staff"); "Rebeam"; "OK" and "Cancel". The page defines "special barline" as "a double, solid, dotted, or other unusual barline". If none is selected, Finale "rebars your score all the way to the end of the piece whenever it's asked to rebar."

### Which wins when barlines and time signature both act

- Finale rebar redistributes by the signature. A plain single barline is not protected from it. Only the stopping points above (special or repeat barlines, other signature or key changes, the region end, an empty measure) bound the rebar. This is the page's own mechanism for protecting a manually placed structure. Inference: a manually split measure survives a later signature change only if its barline is special, or the change is scoped to stop before it.
- Finale adds and deletes measures as needed during rebar ("the program will also create measures as necessary").

### Showing which bars no longer add up

- None found on the Finale pages opened. The earlier survey's Finale pages are likewise silent on a visual flag. NOT ESTABLISHED for Finale.

### Pickups

From the earlier survey: Document > Pickup Measure, with invisible rests behind the scenes; measure numbering skips the pickup. Not repeated here.

### Undo

The Rebar Options workflow in the earlier survey is "undo, adjust, rerun". The Time Signature dialog pages do not mention undo. NOT ESTABLISHED beyond that.

## Sibelius

Source: Avid, Sibelius Reference PDF, 4.3 "Time signatures" (pp. 362 to 365), 2.7 "Bars and bar rests" (pp. 213 to 214): https://resources.avid.com/SupportFiles/Sibelius/2020.3/Sibelius_Reference.pdf (downloaded and read as text).

- Names: "Creating time signatures". Path: Notations > Common > Time Signature (shortcut T) with a note, rest, line, or other object selected. Alternatives in the same gallery: type numerator, Tab, denominator, Return; a preset; or re-create one of those in the "Used" category. "The time signature is created at the beginning of the following bar." Sibelius says "bar" and "time signature"; "More Options" at the bottom of the gallery opens a dialog.
- Scope: music "up to the next time signature". "Sibelius only rebars the music up to the next time signature change in your score, if there is one." If a passage is selected first, "Sibelius will restore the original time signature at the end of the selection, and only rewrite music up to that point. This is very useful when you want to change the barring of a few bars in the middle of the score."
- Rebarring: "If you put a time signature into some existing music, Sibelius splits the existing music up into new bar-lengths, with ties across barlines where necessary."
- Change without rebarring: yes, an explicit mode. More Options > "Rewrite bars up to next time signature" (switch off). The manual describes it as "If you don't want Sibelius to rebar the music". Result: existing bars keep their contents and lengths; they become bars that do not match the prevailing signature (Sibelius's "irregular bars": "length different to that specified by the prevailing time signature").
- Deleting a signature: asks whether the bars following should be rewritten; "No" keeps them as they are. Page 363 recipe for bars that do not match the prevailing metre: select the time signature, delete it, answer No, then re-create the same signature with "Rewrite bars up to next time signature" on, which rebars them. The same No-answer technique is used to keep alternating 2/4 and 3/4 bars when only one signature stays in the score.
- Dragging: "You can also drag time signatures left and right to move them... We don't recommend you drag time signatures out of the bar they belong to."
- Changing one bar's length while keeping music: create an irregular bar of the desired length next to it, copy the music across as a passage, delete the original bar (p. 214).
- Pickup: "Start with bar of length" in the More Options dialog; the pickup is numbered bar 0. For a later-added pickup: Home > Bars > Add > Other, delete the first full bar's signature answering No, re-create the signature at the start of the pickup with Rewrite off, then Text > Numbering > Bar Number Change to 0.
- Showing mismatch: Sibelius manages irregular bars by creating them intentionally; the pages opened do not describe a flag for bars that fail to add up. NOT ESTABLISHED.
- Undo: not stated on these pages.

## MuseScore 4

Source: https://handbook.musescore.org/notation/rhythm-meter-and-measures/time-signatures.md (page "Time signatures"); the HTML version of the version 3 handbook page has the same wording (https://handbook.musescore.org/3/notation/time-signatures). Earlier survey pages (pickup, measure properties, measure numbering) cover the rest.

- Names: "Adding a time signature": "To add a time signature, or replace an existing one: Select a measure, note or rest, or time signature in the score. Click a time signature in the Time signatures palette." Or drag one from the palette to the measure. "Currently, time signature changes can only occur at the beginning of a measure." The word is "time signature"; "measure"; "re-barred".
- Effect on existing notes: "Changing a time signature will cause any existing music that follows to be re-barred, and some items may be lost in this process, so the changes should be checked carefully." No option to skip the rebar appears on the page.
- Scope: the page does not say "until the next time signature". I asked the handbook's own query endpoint whether selecting a range limits the change; its answer was that the change "is not limited to the selected range" and that the handbook "does not specify how an already-existing later time signature affects that re-barring." Treat that answer as a generated summary, not page text.
- Deleting: "select it and press Del". Deleting the signature at the start of the score treats the music "as though it is in a nominal 4/4 and re-barred accordingly."
- Local time signatures (Ctrl, or Cmd on Mac, while applying): apply to one staff, and "always result in bars of the same length as the global time signature; you can think of them as putting an invisible tuplet over each bar." They are a notation display device, not a way to make a different bar length. "It is not yet possible to have bars of differing lengths."
- Nominal versus actual duration (measure properties, earlier survey): the signature is the nominal duration; per-measure Actual duration can differ. This is MuseScore's route to "keep the barlines, override the length", but it is per measure, not a signature change.
- Showing mismatch: a small + or - above a measure whose content does not match the signature (earlier survey).
- Undo: not stated on this page.

## Dorico

Source: Steinberg, Dorico Pro 4.3.30 Operation Manual PDF, downloaded and read as text: https://www.steinberg.help/api/khub/documents/D2Ok9VboavczZ4vAHa~Pmg/content. Sections used: "Inputting time signatures with the popover" (p. 288 to 289), "Splits in bars", deletion of time signatures and barlines in the Write mode deletion section, and the glossary entry "Insert mode". The online current pages render by script and were not readable (see earlier survey).

- Names: "input a time signature". Popover: "time signatures popover", opened with Shift-M. Panel: "Time Signatures (Meter) panel" (the Notations toolbox "Popovers" then "Time Signatures (Meter)"). The manual says "time signature" and "meter" (US spelling in this edition: "open meters", "interchangeable time signature"), "bars", "barlines", "rebarred" is not used; its verb is "barred correctly".
- Placement: select an item at the rhythmic position, or start note input; the time signature goes at "the rhythmic position of the earliest selected item" and "to the right of barlines, key signatures, and clefs... even if this is in the middle of an existing bar." "If you selected an existing time signature, the new time signature directly replaces the existing one." Return inputs on all staves; Alt/Opt-Return only on the selected staves.
- Scope: "All subsequent bars follow the input time signature, until the next existing time signature or the end of the flow, whichever comes first."
- Existing music: "Dorico Pro automatically inputs and moves barlines as required so that subsequent music is barred correctly." Notes keep their rhythmic positions and durations; bars are derived. In open meters, "you must input barlines and add beats manually." A note says Dorico "does not automatically add beats to fill bars according to the new time signature at the end of the affected region unless Insert mode is activated" (Insert mode "also affects... inputting time signatures").
- Deleting a time signature: "subsequent bars are re-barred according to the previous time signature in the score, up until the next time signature or the end of the flow... Flows without time signatures are notated in an open meter, but notes and items retain their duration and positions."
- Deleting a barline: "the two bars on either side combine into one bar, containing the same number of beats but without changing the time signature. This might cause note, rest, and beam groupings to change."
- Which wins when both act: inputting a normal single barline inside a bar "resets the prevailing time signature from that point onwards" (earlier survey); a non-normal barline leaves the signature alone. Signposts mark manual barlines. A time signature change does not preserve barlines that were manually added; it re-moves them ("moves barlines as required"). Inference: manual normal barlines are effectively signature restarts in Dorico, so a later signature change replaces them.
- Splitting by signature: "You can split bars into two or more bars by changing the time signature at any rhythmic position." Advice: "If you change the time signature in the middle of an existing bar, we recommend inputting another time signature at the start of the preceding bar reflecting its new rhythmic duration to avoid confusion."
- No "change signature without rebarring" mode found, apart from open meter.
- Pickup: "4/4,1.5" style entry (earlier survey).
- Showing mismatch: not described in the pages opened (bars cannot be overfull in Dorico's model, except open meters).

## OMR tools

### Audiveris

Sources: https://audiveris.github.io/audiveris/_pages/guides/ui/ui_tools/time/ (Time signature), https://audiveris.github.io/audiveris/_pages/guides/ui/ui_tools/measure/ (Measure merge), https://audiveris.github.io/audiveris/_pages/guides/ui/ui_examples/trinitas/README/ (worked example), https://audiveris.github.io/audiveris/_pages/guides/ui/ui_foundations/inspection/.
- Correction verb: "assign". "If a time signature has not been detected or has been assigned a wrong value, we can select the underlying glyph and assign the desired value, either via a double-click in the shape palette or via the Glyphs... pop-up menu." Or drag a shape from the palette and drop it in place (whole signatures only). Choice is limited to predefined shapes: 4/4, 2/2, 2/4, 3/4, 5/4, 6/4, 3/8, 6/8, 12/8, plus common and cut time. A "custom combo (0/0)" can be dropped, then typed in the inter board as "numerator / denominator", each within 0 to 99.
- Deleting: select the inter and press DEL, or click "Deassign" in the inter board, or the "Inters" contextual menu.
- Re-checking after the change: the Trinitas example is the most useful OMR evidence. After the user replaced a misread common-cut signature with 4/2, the measures on that sheet turned from pink to white (the engine rechecks voice durations against the new signature); with no time signature at all, "no length-check can be performed on measures", so all measures go white. Other sheets needed a user action: "We update the rhythm on the whole sheet #2, via Page #1 > Reprocess rhythm, to benefit from the time signature fix." The page also records an Audiveris lesson that a misread signature produced a pink "disastrous rhythm result on a rather good input" while the real fault was the signature.
- Measure merge: Measure #N > Merge on right, "the intermediate barlines, if any" removed; undo/redo available. This is a measure-level merge, unrelated to the signature.
- Does it rebar? No. The engine keeps barlines as recognized and checks durations against the signature. This matches Ilya's model (printed barlines are authority).
- The inspection page: a pink measure means a voice's starting time is undeterminable or "the voice ending time exceeds the measure expected duration" (from the current signature). A voice line may end with "(ts:Num/Den)" showing the signature it resembles; the page says this "could be used to infer the actual time signature, but this feature is now disabled."

### ScanScore

Source: https://scanscore.zendesk.com/hc/en-us/articles/16768939499922-The-Organize-Menu-Scan-Mode (also Edit menu https://scanscore.zendesk.com/hc/en-us/articles/16768880613266-The-Edit-Menu-Scan-Mode, and the earlier survey's barline pages).
- Name: "Change Time Signature", in the Organize Menu. "First, select the bar or range of bars that a time signature change will apply to. To change the time signature of the entire document, you have to select everything. Then, select the time signature you wish to insert. ScanScore supports complex time signatures. Note: The time signature will be changed immediately!" Edit menu: "Select All... is important for globally changing the time signature."
- So ScanScore scopes by selection (a range), not by "until next change". "Bar", "time signature", "change", "insert" are its words.
- Whether it rebars, and what flagging does afterward: not stated on these pages. The earlier survey's light-blue dashed line (too many note values) and purple marker (too few) apply. NOT ESTABLISHED whether they update right after a signature change.

### PhotoScore (Neuratron)

Sources: https://neuratron.com/faq.htm and https://www.neuratron.com/phsctour_win.htm.
- "Most objects such as clefs, time signatures and barlines can be changed by double- or right-clicking over them to bring up an appropriate dialog box or menu." "You can create other objects (e.g. clefs, time signatures) from the Create menu... Choose an object from the menu, then click on the score to create it."
- Re-check workflow: "you must ensure that the timing in each bar adds up to the current time signature. This is because any excess notes are clipped, and any missing ones are replaced with rests." Order: "During editing, first place any missing time signatures and edit any incorrect ones. Bars highlighted with horizontal red dashed lines indicate bad timing." The user then fixes notes and rests, and the FAQ says to keep going until no bars are highlighted. That sets the sequence: signature first, then durations.
- The pages do not say whether editing a signature rebars the music. NOT ESTABLISHED. (The Neuratron PDF at /downloads/nashelp.pdf turned out to be the AudioScore guide, not PhotoScore; I did not use it.)

### SmartScore (Musitek)

Source: https://www.musitek.com/smartscore-online-help/midi/properties/properties_tool/time_signatures.php (last updated 2024-07-30 on the page).
- "Simply click to select and click again to drop a beginning or change-of-time signature anywhere in the score." To edit one already placed, use the Properties tool and click it: "This opens the Time Signature properties dialog box" with "Signature type" selecting "any new time signature from the list". To delete: Delete mode, click the symbol.
- Scope: "After closing the dialog box, SmartScore changes the time signature in all systems up and until another time signature is encountered."
- Flag: "Changing a time signature may change the background color of certain measures. Measures with yellow background color indicate that its total note+rest value does not equal the default time signature." So the changed signature immediately re-flags measures. The page does not mention rebarring or moving barlines. This is the closest documented match to Ilya's model: change scope, no rebar, immediate yellow flag.

### Newzik, PlayScore

No time signature correction described on the pages opened for the earlier survey. NOT ESTABLISHED.

## What Ilya can adopt

All items are my inference from the sources above unless a source is named.

### (a) Scope: from this bar until the next change

- Strongest convergence: Dorico ("until the next existing time signature or the end of the flow"), Sibelius ("only rebars the music up to the next time signature change"), Finale ("to next time change"), SmartScore ("up and until another time signature is encountered"). Adopt as the default and the only mode: "from this bar until the next time signature change". A later change already in the document ends the span.
- Finale offers two other scopes (a measure range; through end of piece). Sibelius gets a range by selecting first, and ScanScore scopes only by selection. For a scanned score, a range is rarely needed; Finale's selection-prefills-range pattern is the model if it is.
- Ilya can phrase the span in the dialog the way Finale words it: "From bar N until the next time signature change".

### (b) Rebar existing notes, or reinterpret existing barlines

- Established apps default to rebarring: Finale ("Rebar Music" on), Sibelius ("Rewrite bars up to next time signature" on), MuseScore (always), Dorico (moves barlines; notes stay). The three apps with an opt-out are Finale (uncheck "Rebar Music"; the tutorial uses that to keep barlines) and Sibelius (uncheck "Rewrite bars up to next time signature"; leaves bars that do not match the signature, which Sibelius calls irregular bars). Both keep the existing barlines and make the new metre govern only what the bars are checked against.
- All the OMR tools sit in the "no rebar" camp: Audiveris, SmartScore, PhotoScore check bar contents against the signature and flag; none moved barlines on a signature change in the pages opened.
- Recommendation: Ilya's mode is the OMR mode, and it equals Finale's unchecked "Rebar Music" and Sibelius's switched-off "Rewrite bars". The change replaces the signature that bars are checked against from the chosen bar; it moves no barline and no note. Make this the only behaviour; do not offer rebar. Rebarring would contradict the rule that printed barlines are the authority, and Finale's own docs show it can produce short measures without padding, and Sibelius's ties across barlines.
- Corollary: the barline add and remove corrections remain the only way to change structure, which matches Dorico's model in reverse (there the signature is the structure; in Ilya the barlines are).

### (c) Verb and noun placement users recognize

- Object: "time signature" is used in every app's tool name or menu (Finale "Time Signature tool", Sibelius "Time Signature", MuseScore "Time signatures palette", Dorico "time signatures popover", SmartScore "Time Signatures", ScanScore "Change Time Signature", Audiveris "Time signature"). "Metre/meter" appears in Finale's and Dorico's explanatory text and in Dorico's panel name "Time Signatures (Meter)". Recommendation: use "time signature" for the control and the label. Reserve "metre" (Canadian spelling) for prose.
- Verb: "change" (Finale "change the time signature"; ScanScore "Change Time Signature"; SmartScore "change-of-time signature"; PhotoScore "edit any incorrect ones"). "Insert" is used by Sibelius, ScanScore and SmartScore for adding where none exists. Audiveris says "assign". Recommendation: the label "Change time signature from here" (verb "change"; consistent with Ilya's planned "add a barline here" and "remove this barline"). "Bar" versus "measure": Sibelius, Dorico and ScanScore say "bar"; Finale, MuseScore, SmartScore and Audiveris say "measure". Use whichever word the rest of Ilya's UI uses.
- Placement: attach it to a bar (Finale: double-click the measure; MuseScore: select the measure; ScanScore: select the bar; Dorico: select an item at the position). Ilya: on the bar's correction menu, next to the barline verbs.
- A value picker listing the common signatures, plus a custom entry (Audiveris palette plus custom 0/0; Sibelius preset gallery plus typed numerator, Tab, denominator).

### (d) How the change is shown and undone

- Show: SmartScore recolours the affected measures (yellow) the moment the signature changes; Audiveris repaints pink/white after the signature fix; PhotoScore marks bars with red dashed lines; ScanScore uses dashed and coloured markers; MuseScore a + or - sign. After a change, Ilya should re-run its sum check at once and show the count of bars that now add up and that do not.
- Finale's Rebar workflow, "undo, adjust, rerun", and Sibelius's "No" at the delete prompt show that users expect to reverse a signature change. Audiveris records undo/redo for its merge. Recommendation: a visible span marker at the bar where the change starts (a signature chip), removable by one action ("Remove this change", the way Sibelius and SmartScore delete the symbol), which restores the previous signature for the span.
- Audiveris's Trinitas example shows a second effect: removing all signatures disables the check (all white). Ilya must not let a removal leave bars unchecked silently; fall back to the previous signature.

### (e) Order of work (from OMR sources)

- PhotoScore's FAQ states the sequence: fix signatures first, then durations. Audiveris's example shows the same: the signature fix turned most pink measures white and made the remaining errors visible. Recommend Ilya present the time signature correction before the barline corrections, and re-evaluate the automatic barline split after a signature change.

## Pitfalls

- Rebarring is the default in desktop notation apps; copying it moves barlines and breaks the "printed barlines are the authority" rule. Finale's rebar also produces short measures (no padded rests) and "creates measures as necessary"; Sibelius adds ties; MuseScore warns "some items may be lost".
- Finale's manual contradicts itself about what "Rebar Music" does when unchecked (rebeam only, or redistribute across barlines). Do not cite it as a clean model of "no rebar" without saying so.
- Dorico's manual barlines are overwritten by a later signature change, and a normal manual barline silently restarts the signature. Ilya's barline verbs and its signature change must be independent, and a signature change must never move or delete a manual barline.
- A signature removed with nothing behind it disables checking (Audiveris). Keep a fallback.
- A wrong signature makes a good score look "disastrous" (Audiveris Trinitas). If many bars go overfull or underfull in the same ratio, suggest a signature fault before offering barline splits. Inference; no app documents that suggestion.
- ScanScore applies the change "immediately" with no confirmation; SmartScore may change measure colours without telling the user why. Ilya should say what changed and how many bars it affects.
- Scope surprises: MuseScore's page is silent on a later existing signature; Finale's scope defaults are not stated. Ilya should state the span in plain words before and after the change.
- Pickups: a first bar shorter than the signature is not an error (earlier survey); a signature change must keep the pickup flag rather than re-flagging it.
- Names: Finale's "Rebar Music" is also the name of the menu command in Utilities > Rebar. Ilya should avoid "rebar" in its labels, since it would imply moving barlines.

## What I could not establish

- Whether Finale's Time Signature dialog proposes a default scope option, and what it does to barlines when Rebar Music is unchecked beyond the tutorial's phrasing (see the contradiction above).
- Whether Finale, Sibelius, Dorico, or MuseScore visually flags bars that do not add up in the pages opened for time signature change (Sibelius and Dorico pages are silent; MuseScore's + and - sign comes from the earlier survey).
- How Finale, MuseScore, and Dorico treat notes that cross the new barline beyond Sibelius's "ties" and Dorico's moved barlines. The MuseScore handbook is silent on ties.
- Whether PhotoScore, ScanScore, SmartScore rebars or only flags after a signature change; only SmartScore's yellow flag and its "up and until another time signature" scope are documented. PhotoScore's FAQ does not describe the signature edit; I did not find a PhotoScore user guide page for it.
- Whether Audiveris reprocesses the same sheet automatically after assigning a signature. The example implies the measure colours update on the same sheet, but another sheet needs "Reprocess rhythm"; the page does not state the trigger precisely.
- Newzik and PlayScore: no documentation found.
- Undo behaviour of any app's time signature change itself (only the Rebar workflow "undo, adjust, rerun" and Audiveris merge undo/redo are documented).
- The online current Dorico pages (they render by script). Dorico 4.3.30 text only.
- The user-visible default of Sibelius's "Rewrite bars" for scanned irregular bars; the manual describes it for typed music.
