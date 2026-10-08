Returned by a Sonnet research agent, 2026-10-08, commissioned by the desk on Dann's yes of 12:29. Web research only.

**Memo: precedents for a compact note-correction and performance-marking panel (touch)**

Method: WebSearch and WebFetch only. Instrument labels: VD = vendor documentation, VB = vendor blog or marketing, IR = independent review, UF = user forum, STORE = App Store listing, INF = my inference.

Apple's HIG pages are scripted, so I read them from Apple's own published JSON for those pages. The Dorico for iPad 1.2.0 Operation Manual PDF was read in full text.

Where a search result named a page but the fetch returned only a menu or a stub, the cell says NOT ESTABLISHED.

---

## (1) Summary tables

### Group A: performers' marking apps

| App | Dynamic / tempo / hairpin / breath / text | Palette, typed, or pencil | Custom stamp | Anchor | Layers |
|---|---|---|---|---|---|
| forScore | Stamps (80 defaults), Shapes (default is a slur), text; pencil | Palette + pencil | Yes (draw, import PNG, SF Symbols in Pro) | NOT ESTABLISHED | Yes, up to 8 per page |
| MobileSheets | Pen, highlighter, text, stamps, shape, arrow, crescendo tool, piano staff tool | Palette + pen | Yes | NOT ESTABLISHED | Yes |
| Henle Library | Symbol palette (dynamics first), text, 4 pens | Palette + pen | NOT ESTABLISHED | NOT ESTABLISHED (placed "to any position on the page") | Yes, unlimited, shareable |
| Newzik | Pencil, text box, stamps NOT ESTABLISHED; drawn symbols auto-vectorized | Pencil + text | NOT ESTABLISHED | Marks free-dragged; also see Patterns 1 | Yes, shared and personal |
| piaScore | Six pens, stamps for dynamics and others, text boxes | Palette + pen | NOT ESTABLISHED | NOT ESTABLISHED | NOT ESTABLISHED |

### Group B: touch notation editors

| App | Fix pitch | Accidental | Duration, dot | Triplet | Delete range | Tempo | Dynamic | Hairpin | Model |
|---|---|---|---|---|---|---|---|---|---|
| Dorico iPad | Select, then Edit Notes Overlay or Opt+arrows (hardware) | Notes panel; double sharp in a right-hand panel | Notes panel; Dotted Notes button | Popover, during note input only | Secondary toolbar Delete (selection) | Popover | Popover | Popover (`<`, `>`) | Select, then act, plus typed popovers |
| StaffPad | Pen hold on note, move up or down | Recognized from handwriting | NOT ESTABLISHED | Recognized; tuplet endpoints draggable | Pressure erase | Tempo staff | Handwrite, type, or palette | Draw or palette | Handwriting; select by pen |
| Symphony Pro | NOT ESTABLISHED | NOT ESTABLISHED | Choose value, then tap (store listing) | Custom Tuplets (listing) | Select mode erase | "Change tempo anywhere" | Expressions menu | NOT ESTABLISHED | Pencil mode vs Select mode |
| Flat | Drag handle (touch) | Toolbar | Select, then Note toolbar | Cursor in tuplet, apply tuplet tool again | NOT ESTABLISHED | Select measure(s), Measure toolbar, enter BPM | Dynamic toolbar | Select start note, then button; drag handle | Select, then toolbar; also tool-first on phone |
| Noteflight | NOT ESTABLISHED (iPad: pitch palette up/down) | NOT ESTABLISHED | NOT ESTABLISHED | Select, then Triplet button or key `3` | NOT ESTABLISHED | NOT ESTABLISHED | NOT ESTABLISHED | NOT ESTABLISHED | Select, then palette button |

### Group C: platform conventions

| Source | Bearing on an 8-tool panel at 390 px |
|---|---|
| Apple segmented controls | No more than about five segments on iPhone |
| Apple toolbars | Avoid overcrowding; contextual controls in a modal state |
| Apple edit menus | Show only commands relevant to the current context |
| Apple pickers | For medium-to-long lists; short lists suit a pull-down button |
| Material 3 | NOT ESTABLISHED |

---

## (2) Per-app notes

### Group A

**forScore**
- Stamp palette: select the Stamps tool, tap it again to open the palette, tap a symbol, touch and hold the page, drag to see a preview loupe, lift to place. Palette hides while touching and returns, so several stamps can go in a row. 80 default stamps ("numbers, sharps, flats"). Slider resizes. VD, https://forscore.co/stamps-basics (undated; footer 2010-2026).
- Custom stamps: draw by hand, import a PNG (144x144 suggested), drag-and-drop on iPad; Pro users can type an SF Symbol name. Edit by touch-and-hold, "edit". VD, https://forscore.co/kb/adding-stamps/ (undated).
- Stamps and Shapes: Stamps tool first on the second toolbar row; Shapes second, default is a slur. Colour tint applies only to new marks. Page says stamps are for symbols that "cannot be typed into a text box or drawn precisely." VD, https://forscore.co/kb/using-stamps-and-shapes-for-common-markings/ (undated).
- Layers: stamps, shapes, drawing, and text belong to a layer; links and buttons do not. Each page has 1 to 8 layers, per-layer visibility icon, reorder by drag, merge, duplicate. Up to four score layers apply across all pages (forScore 11). VD, https://forscore.co/kb/working-with-annotation-layers/ (undated).
- Dedicated tempo, dynamic, hairpin, or breath-mark stamp types: NOT ESTABLISHED. The knowledge-base index lists no article on them. VD, https://forscore.co/kb/category/11-editing-your-scores/
- Anchor to musical position: NOT ESTABLISHED.
- Context-responsive controls: NOT ESTABLISHED. The palette hides while touching the page (above), which is the only state change I could source.

**MobileSheets**
- Tools: pen, highlighter, text, stamps (resizable, custom stamps with adjustable opacity and colour), shape, arrow, crescendo, piano staff, eraser, nudge tool, favourites for tool presets. VD, https://www.zubersoft.com/mobilesheets/features/annotations (undated).
- Gestures: two-finger tap switches tools; three-finger tap enters or exits the editor. Same source.
- Layers: separate layers, choose which are visible. Same source.
- A forum thread reports that annotations on any layer can be selected, even from an inactive layer, and a stamp cannot be locked individually. UF, https://www.zubersoft.com/mobilesheets/forum/thread-11647.html (June and July 2024; vendor reply quoted).
- Anchor: NOT ESTABLISHED. Context-responsive controls: NOT ESTABLISHED.

**Henle Library**
- Annotation mode opens by press-and-hold on a page centre, or the pen icon. Creates a copy ("user setup") so the Urtext stays unchanged. Unlimited layers; send by e-mail or AirDrop. VD, https://henle-library.com/en/features/ (undated).
- Symbol palette: hold the black bar at the screen bottom and drag to browse Henle music-font signs; it begins with dynamic signs, then fingerings, bowings, prefixes, embellishments. Drag a sign to "any position on the page"; it resizes to context. Same source.
- Pen: four widths. Each lift is a separate stroke, so a hand-drawn crescendo needs separate erasing unless drawn in one motion. Text: "T" tool, keyboard. Same source.
- Edit: Eraser (tap a mark to delete), Arrow tool (tap to select, then move or recolour). Same source.
- A 2021 post said "interpretation layers" from known teachers were "coming soon." VB, https://blog.henle.de/en/2021/03/01/the-henle-library-app-is-five-years-old/ (1 March 2021).
- Custom stamps: NOT ESTABLISHED. Anchor to musical position: NOT ESTABLISHED. Context-responsive controls: after tapping a mark, the Arrow tool allows move or recolour (same source); nothing further sourced.

**Newzik**
- Annotation tools: freehand pencil (finger or Apple Pencil, adjustable weight and opacity), text box (adjustable size). Drawn symbols such as a slur or crescendo are converted to a clean vector version. Moving a mark: arrow icon, tap, drag. VD, https://newzik.com/en/resources-sheet-music-app/how-to-annotate-sheet-music-ipad (last updated 29 May 2026).
- Layers: "shared" and "personal" layers "can be shown or hidden independently." Same source. Markings are stored as a layer over the PDF; new marking layers can be created per piece. VD, https://support.newzik.com/en/support/solutions/articles/77000500860-how-are-our-markings-cuts-and-changes-stored- (undated).
- Smart Annotations: for scores converted to a LiveScore, toggles highlight dynamics (p, f, mf, crescendo, decrescendo), articulations, and accidentals including double sharps, each category with its own colour. These are highlights of existing notation, not user marks. VD, https://support.newzik.com/en/support/solutions/articles/77000595613 (undated).
- Stamps, custom stamps: NOT ESTABLISHED (not in the sources read). The Newzik Academy outline lists a lasso for "selecting, moving and copy/pasting" and "Multiple layers," with no detail. VD, https://academy.newzik.com/courses/annotations
- Anchor: the vendor page says "annotations remain scaled to the original score" and does not state whether marks bind to measures. NOT ESTABLISHED.
- Context-responsive controls: NOT ESTABLISHED.

**piaScore**
- App Store listing: six pens (colour, thickness, nib), "stamps for dynamics and other markings," text boxes, a Pencil-only mode, and erase options. STORE, https://apps.apple.com/app/piascore/id406141702 (version 7.0.9, "Oct 1", year not shown).
- Layers: not mentioned in the listing; NOT ESTABLISHED. Custom stamps, anchor, context-responsive controls: NOT ESTABLISHED.

### Group B

**Dorico for iPad (manual 1.2.0; the manual itself is dated by version, not day)**
All claims: VD, https://archive.steinberg.help/dorico_ipad/v1/en/Dorico_iPad_1_Operation_Manual_en.pdf
- Layout: left Notes toolbox and Notes panel (durations, accidentals, articulations), an "Edit Notes Overlay" (pitch, rhythmic position, and duration of selected notes, "both during note input and for existing notes"), a secondary toolbar (Copy, Paste, Delete, context menu), a right Notations toolbox that toggles between panel buttons and popover buttons, and a lower zone with Properties and Keyboard panels.
- Fix a pitch: select notes; in the Edit Notes Overlay choose Octave, Staff Position, or Octave Division, then Transpose Up or Down. Keyboard alternative is Opt+arrows.
- Accidental: start note input or select existing notes, then click the accidental in the Notes panel. Double sharps and flats are "in the Accidentals section of the Key Signatures, Tonality Systems, and Accidentals panel on the right."
- Dot: "Dotted Notes" button; touch-and-hold chooses the number of dots.
- Triplet: tuplets popover, entered as a ratio with a beat unit (for example `3:2e`); "can only be input during note input." Removing a tuplet from existing notes: NOT ESTABLISHED.
- Select a range: secondary toolbar "Extend Selection", then click items at the start and end; or marquee; click a beam to select its group; click empty staff to select a bar.
- Delete a stretch: "Deleting notes/items" exists (page 333); the steps were not read. Delete is a button on the secondary toolbar. The exact touch steps are NOT ESTABLISHED.
- Tempo: select an item at the position (or items spanning a duration for a gradual change), open the tempo popover (button in the Notations toolbox), type `q=72` or `Allegretto`, press Return. A gradual change such as rallentando "span[s] the duration of the selected items." During note input it defaults to a quarter note and can be lengthened or shortened afterwards.
- Dynamic and hairpin: same pattern in the dynamics popover. Typed entries include `p`, `p<f>p`, `f>`, `<`, `>`, `cresc`, `dim`. "Select items on the staff that span that duration" to set a hairpin's length. `<` and `>` also work as direct keys.
- Model: select, then act; typed popovers for tempo, dynamics, tuplets.
- Context-responsive: a selected existing dynamic plus Return reopens the popover; popover opens "when either an item is selected or the caret is active"; the Notations toolbox swaps between panels and popovers; with the caret active, tool changes apply to input. The Edit Notes Overlay applies "both during note input and for existing notes."
- A review (IR, https://www.scoringnotes.com/reviews/dorico-arrives-on-ipad/, update notes 9 August 2021) says the right tool area toggles to a popover palette, one button per popover, and a tap shows a text field above the selection and slides up the on-screen keyboard.

**StaffPad**
- Review (IR, https://www.scoringnotes.com/reviews/staffpad-for-ipad/, 1 August 2020): handwriting is interpreted per measure; double-tap a bar to select, keep tapping to extend; lasso via menu or double-tap Pencil; accidentals recognized, double-flat recognition not found by the reviewer; erase by pen pressure; tempo on a dedicated tempo staff; dynamics handwritten or typed (typing "f" shows a suggestion bar); hairpins drawn or from the symbol palette; a long-touch on a bar opens clef, key, time, instrument, text, chords, lyrics, divisi.
- Pitch fix by touch: the review found none and erases and rewrites. The vendor article says tap-and-hold the pen on a note, move up or down changes pitch. VD, https://staffpad.zendesk.com/hc/en-us/articles/360002336558-Selecting-Items (26 August 2019). These differ; the vendor source is the primary.
- Selecting hairpins, tuplets, slurs: by endpoint, drag left or right to extend (same vendor article). A tuplet turns red if its note count mismatches its numeral.
- Duration and dot editing: NOT ESTABLISHED. Triplet creation and removal: NOT ESTABLISHED. Delete a range (beyond the erase gesture): NOT ESTABLISHED.
- Model: handwriting plus select by pen; type-the-thing for dynamics. Context-responsive: the long-touch menu is on a bar; beyond that NOT ESTABLISHED.

**Symphony Pro**
- App Store listing: Pencil mode, tap a bar to place notes; Select mode transposes, erases, cuts, pastes multiple notes; multi-note select edits properties; "Change tempo or clef anywhere"; Custom Tuplets; notes' properties settable "before or after placing." STORE, https://apps.apple.com/app/id412380315 (version 6.7.7 dated "Feb 4"; 6.7 dated 09/10/2025).
- A 2019 user thread (UF, https://applevis.com/comment/94317, latest comment 18 October 2019, app 4.4.4) shows users unable to find tempo removal or a 12-note tuplet. The vendor forum is named but not read.
- Hairpins, accidentals, pitch correction by touch, dot editing: NOT ESTABLISHED. Model: two explicit modes, Pencil (tool, then apply) and Select (select, then act). Context-responsive: NOT ESTABLISHED.

**Flat (flat.io)**
- Phone: pick a note value from the toolbar, tap the staff to place; rests, sharps, flats, and dynamics "the same way"; tapping an existing note again changes its length or deletes it; zoom before placing, use landscape. VB, https://blog.flat.io/how-to-write-sheet-music-on-your-phone/ (25 June 2026).
- Touch editing update: tap near a notehead to select; clicking a notehead shows an anchor you drag to change its pitch; range selection starts by long press, with draggable anchors; scrolling will not start a selection; double tap opens a paste menu above the staff. VB, https://blog.flat.io/better-editing-on-your-touch-device-enhanced-usability-for-seamless-music-composition (13 June 2023, updated 23 November 2023).
- Mobile app toolbars: note toolbar with editing and duration modes, ornament, and text toolbars; dynamic anchors. VB, https://blog.flat.io/amplifying-creativity-on-the-go (31 May 2023, page updated 26 June 2026).
- Seven toolbars (Note, Tab, Articulation, Ornament, Dynamic, Measure, Text). Tempo marks and tempo changes sit in Measure; crescendo and diminuendo in Dynamic. VD, https://help.flat.io/en/music-notation-software/notation-features/ (undated).
- Duration: select note or rest, open Note toolbar, pick. VD, https://help.flat.io/en/music-notation-software/changeduration/ . Dot: page links elsewhere; NOT ESTABLISHED.
- Tuplet: enter a note with the member value, open the tuplet tool in the Notation tab, choose Triplet; to remove, put the cursor inside it and apply the tool again. Application over a selected range is not described. VD, https://help.flat.io/en/music-notation-software/tuplet/ (tagged for the mobile app, no mobile steps).
- Tempo: select the measure (or several), Measure toolbar tempo tool, enter BPM; with nothing selected it applies to the next mark or the end. Gradual changes (rit.): not on that page. VD, https://help.flat.io/en/music-notation-software/addtempo/
- Hairpin: select the start note, press the crescendo or diminuendo button at the end of the Dynamics section, then double-click and drag a handle at either end to change length. No touch steps. VD, https://help.flat.io/en/music-notation-software/wedges/
- Double sharp: not in the shortcuts table; NOT ESTABLISHED. VD, https://help.flat.io/en/music-notation-software/keyboard-shortcuts/
- Model: select, then toolbar (desktop), with tool-first note entry on phone. Context-responsive: toolbars are grouped by category (seven); whether they change on selection is NOT ESTABLISHED.

**Noteflight**
- Triplet: select the note value, click the Triplet button in the Rhythm palette or press `3`; removal not stated. VD, https://support.noteflight.com/hc/en-us/articles/5584069565972-Entering-Triplets-and-other-Tuplets (22 July 2022).
- iPad entry: built-in piano keyboard "the best way"; use the pitch palette up and down buttons to nudge a wrong pitch; chords by touching multiple notes; range selection is a three-step multi-touch gesture (tap first note, hold last, re-tap first). VD, https://support.noteflight.com/hc/en-us/articles/360023099211--Do-You-Have-Any-Tips-for-Best-Practices-with-Note-Entry-on-iPad (1 March 2019).
- Double sharp: a staff reply says the existing "x" is the standard sign; the palette is not mentioned. UF, https://support.noteflight.com/hc/en-us/community/posts/22485056054292-New-double-sharp-sign (January 2024).
- The User Guide (noteflight.com/guide) is scripted and unreadable by this tool. Dot, tempo, dynamic, hairpin, delete: NOT ESTABLISHED. Context-responsive: NOT ESTABLISHED.

### Group C

- **Segmented controls**: "Aim for no more than about five to seven segments in a wide interface and no more than about five segments on iPhone." Use for "closely related choices that affect an object, state, or view"; prefer text or images, not a mix; nouns or noun phrases; do not mix selection-state segments with action segments. VD, https://developer.apple.com/design/human-interface-guidelines/segmented-controls (last change listed 21 June 2023).
- **Toolbars**: "Choose items deliberately to avoid overcrowding"; "don't add an overflow menu manually, and avoid layouts that cause toolbar items to overflow by default"; "minimize the number of groups"; "If your app can enter a modal state, consider offering contextually relevant toolbar controls." VD, https://developer.apple.com/design/human-interface-guidelines/toolbars (last change 9 June 2025).
- **Edit menus**: on iOS a compact horizontal list from touch-and-hold or double-tap, with a chevron to expand to a context menu; "Offer commands that are relevant in the current context, removing or dimming commands that don't apply"; "Avoid overwhelming people with too many custom commands"; short verb labels. VD, https://developer.apple.com/design/human-interface-guidelines/edit-menus (last change 21 June 2023).
- **Pickers**: for "medium-to-long lists"; for a short list, "consider using a pull-down button"; avoid switching views to show a picker; show it in context at the bottom or in a popover. VD, https://developer.apple.com/design/human-interface-guidelines/pickers (last change 5 June 2023).
- **Material Design 3**: segmented buttons "help people select options, switch views, or sort elements," with icons, text, or both; segment-count guidance NOT ESTABLISHED. VD, https://m3.material.io/components/segmented-buttons/guidelines

---

## (3) Patterns

1. **Performers' apps mark the page; they do not mark the music.** forScore, MobileSheets, Henle, Newzik, and piaScore all describe marks as stamps, shapes, pen strokes, or text boxes placed on a page image (Henle: "any position on the page"). None of the documentation I read states that a mark binds to a bar or beat. The one partial exception is Newzik's Smart Annotations, which highlight existing dynamics in a LiveScore, and are not performer marks. Every Group A anchor cell is NOT ESTABLISHED as "bound to a musical position."
2. **Mark vocabulary is a scrollable palette, with a pen as escape hatch.** forScore (80 stamps), Henle (dynamics first, then fingerings), MobileSheets (stamps plus a crescendo tool), piaScore. Dynamics come first in Henle's order. Newzik instead converts a drawn crescendo to a clean vector.
3. **Layers with a per-layer visibility toggle are the norm.** forScore (1 to 8 per page), MobileSheets, Henle, Newzik (shared and personal). MobileSheets users report friction when hidden-or-not layers stay selectable (forum, 2024).
4. **Editors split between "select, then act" and typed popovers for time-spanning marks.** Dorico: select items spanning the duration, then type `q=72`, `p<f>p`, or `rit.`. Flat: select a measure for tempo, a start note for a hairpin, then drag a handle to set the end. Selection sets the span in both. StaffPad handles spans by dragging endpoints (hairpins, tuplets, slurs) rather than by a menu.
5. **Controls that change with the selection appear only in Dorico and Flat, partly.** Dorico: the Edit Notes Overlay acts on selected notes; the Notations toolbox swaps panels for popovers; the dynamics popover reopens on a selected dynamic. Flat groups tools by category (Note, Dynamic, Measure), and the tempo tool sits under Measure, where selecting measures sets scope. INF: this fits a design where the selection type (note, bar, mark) chooses which of the toolbars is shown. I could not source this behaviour for the other apps.
6. **Apple's guidance caps a visible choice set near five and favours showing only the relevant commands.** Segmented controls: about five segments on iPhone; edit menus: relevant, short, verb labels; toolbars: avoid overflow by default. INF: an 8-tool panel at 390 px exceeds the segmented-control cap, so a two-level arrangement (a mode row of five or fewer, with a contextual second row) matches all three pages. This is a recommendation, not a sourced precedent.

---

## (4) Could not establish

- forScore: dedicated tempo, dynamic, hairpin, breath-mark stamp types; musical-position anchoring; context-responsive controls.
- MobileSheets: symbols tool specifically; anchoring; context-responsive controls.
- Henle: custom stamps; musical-position anchoring; context-responsive controls beyond tap-to-move with the Arrow tool.
- Newzik: stamps, custom stamps; whether marks bind to measures; context-responsive controls.
- piaScore: layers; custom stamps; anchoring; context-responsive controls.
- Dorico for iPad: removing a tuplet from existing notes; the exact touch steps to delete a range; current-version (post 1.2.0) changes; whether touch-only users have a hairpin-length handle.
- StaffPad: duration and dot editing by touch; triplet creation and removal; range deletion beyond erase; toolbar changes on selection.
- Symphony Pro: pitch correction, accidentals, dots, hairpins, selection-dependent controls (the vendor forum was not read).
- Flat: dot steps; double-sharp entry; delete-range steps; gradual tempo (rit.) steps; touch-specific steps for tempo, hairpin, and tuplet; whether toolbars change on selection.
- Noteflight: pitch fix, accidentals, dots, tempo, dynamics, hairpin, delete, tuplet removal, and context-responsive controls (the User Guide is not readable by this tool).
- Material Design: segment-count and toolbar guidance (page scripted; content not retrieved).
- Dates: forScore, MobileSheets, Newzik (except the annotation article), Henle features, and Flat help pages carry no visible date.

Nothing was written to disk beyond scratch files used to read Apple's JSON and the Dorico PDF.
