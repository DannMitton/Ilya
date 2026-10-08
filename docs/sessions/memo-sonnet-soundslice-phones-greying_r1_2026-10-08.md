Returned by a Sonnet research agent, 2026-10-08, commissioned by the desk on Dann's request of 12:50. Web research only.

Method note: pages were read through WebFetch, which summarises with a small model. Quotes below are as returned by that tool, not checked against the raw page. Apple HIG text was read from Apple's own JSON data feed for each page (developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json), which is the page's text. No YouTube transcripts were reached.

## 1. Findings by part

### Part 1. Soundslice

(a) Review screen
- Vendor documentation, https://www.soundslice.com/help/en/creating/pdf-import/344/reviewing/ : "Our review system asks you questions about the music, for specific details of the notation that it was unsure about." Example question: "Does this notehead have a sharp sign in front of it?" Email link after processing. "The number of questions depends on the quality of your scan and the complexity of your music." May be none, in which case you go straight to results. The page does not say whether you can skip, or how answers are submitted.
- Vendor blog, 22 Sep 2022, https://soundslice.com/blog/226/pdf-and-photo-scanning-beta : answers "help give the system a deeper, more nuanced knowledge"; after answering "the system creates a slice and opens it in the editor", original upload shown for comparison. Example question was about which side a stem is on. Not stated: yes/no format, skipping.
- Vendor blog, 26 Jan 2023, https://soundslice.com/blog/237/smart-grouping-of-music-scanning-questions : repeated questions with the same auto-guessed answer are grouped; "we'll group them together and simply ask you to click the ones that are *wrong*." It "takes up a lot less space and less mental energy." Limited to text-based question types, not graphical ones.
- Vendor blog, 27 Jul 2023, https://soundslice.com/blog/252/improvements-to-pdf-image-scanning : zoom button on review-question images, to give "enough context to answer the question".
- Vendor blog, 21 Sep 2023, https://soundslice.com/blog/256/improvements-to-pdf-image-importer-sept-21 : a question asks "whether two notes are played at the same time"; shown "in any case where our system isn't 100% sure". If you exclude fingerings, lyrics or chord names at upload, "we'll skip any review questions these notations may have triggered". So skipping is by category at upload, not per question (this is what the page says; per-question skip NOT ESTABLISHED).
- Vendor blog, 13 Aug 2026, https://www.soundslice.com/blog/311/sheet-music-scan-improvements/ : new review questions about instruments; final step of a scan; names auto-detected; best guesses prefilled.
- Does answering fix the notation directly? Not stated outright. The 2022 post implies the slice is generated after the answers (answers feed the scan before the editor opens). INFERENCE: answers are applied during slice creation, not as edits afterward.
- Number of questions: no number given anywhere; "will ask fewer and fewer questions over time" (reviewing page).

(b) "Highlighted errors"
- Vendor documentation, https://www.soundslice.com/help/en/creating/pdf-import/345/the-results-page/ : the only text is the banner "Please fix the highlighted errors." The page describes a two-pane results view (Soundslice rendering above, original image below) and says "click the Continue button at upper right."
- The same banner string came back from every Soundslice page fetched (blog posts on unrelated topics, the PDF import index page, the scan-editing page). INFERENCE: it is a hidden, site-wide form-validation message in the page template, not an OMR error-highlighting feature. The prior pass's reading of it as a feature is NOT supported by anything found.
- Editing scans page, https://www.soundslice.com/help/en/creating/pdf-import/346/editing-scans : the original upload sits in the bottom half so you can "spot-check for any errors or omissions"; "Scanned image" toggles it. No highlighting of errors is described. NOT ESTABLISHED that Soundslice highlights suspected errors on the results page.

(c) Phone editing
- Vendor blog, 10 Jun 2021, https://www.soundslice.com/blog/205/new-create-edit-sheet-music-on-your-tablet : editor "optimized for use on tablets"; names iPads and Android tablets; no phone statement.
- Vendor documentation, https://soundslice.com/help/en/creating/basics/255/tablet-interface : touch interface at the bottom of the screen; piano with 88 keys, swipe to move; refers to tablets and "other touchscreen device[s]"; does not mention phones.
- Vendor documentation, https://www.soundslice.com/help/notation-editor/ : assumes "you're using a computer with a keyboard"; tablet users go to a touchscreen page. No phone mention.
- Vendor blog, 12 Jan 2022, https://www.soundslice.com/blog/213/new-features-and-fixes-jan-12 : heading "Better editor support for smartphones"; "we've tightened the interface in various places, to provide more vertical screen space for your music." So phones are tolerated and improved, but no guide describes a phone workflow. NOT ESTABLISHED how a phone user edits.
- A "Select bar" feature was added for touchscreens (same post).

(d) Does the panel change with selection; hide or grey?
- Tablet interface page (URL above): tapping a piano key depends on selection. "If a rest is selected, tapping a key replaces the rest with that note. If a note is selected, tapping a key adds a note to form a chord, and tapping a selected note's key removes it." Selecting a tab note switches the piano to a fretboard. Shortcut buttons (duration up/down, dot, rest, enharmonic, cursor, select bar, auto-advance, undo/redo, copy/paste, delete) "Most act on the current selection." So the button row looks fixed while the meaning of the keyboard changes with selection. Vendor documentation.
- Desktop editor help (URL above): the bottom of the left panel "displays information about the currently selected note(s)". Vendor documentation.
- Hide versus grey: NOT ESTABLISHED. Neither page says.

### Part 2. Phone behaviour of other tools

ScanScore
- Independent review, Colin Dorman, 15 Jan 2020, https://colindorman.com/horn/scanscore-review/ : "there is no editing ability on your phone"; editing on a phone "would be an exercise in frustration". The phone app was for scanning only. Desktop flags uncertain measures with underlines: "purple means an incomplete bar", "blue line means a measure has too many notes". A missed triplet is fixed by selecting three notes and clicking "tuplet". Dated; may not reflect current versions.
- Vendor page, https://www.fortenotation.com/en/products/forte-apps : "ScanScore Capture" is for capture and sends to FORTE; editing is in the separate FORTE app, which has "a brand new in-app Editor" for tablet or smartphone. Detail on how it edits: NOT ESTABLISHED. Current ScanScore phone or tablet editing: NOT ESTABLISHED.

Flat
- Vendor blog, 25 Jun 2026, https://blog.flat.io/how-to-write-sheet-music-on-your-phone/ : "Pick a note value, then tap where it goes, and add rests, sharps and flats from the toolbar." "Tap a note again to change its length or delete it." Dynamics are said to be added "the same way". Triplets, tempo, hairpins: not mentioned.
- Vendor blog, 13 Jun 2023 (updated 23 Nov 2023), https://blog.flat.io/better-editing-on-your-touch-device-enhanced-usability-for-seamless-music-composition : tapping near a notehead selects it; long press starts a range selection; tapping a notehead shows an anchor that can be dragged to change pitch; a paste menu and a range-selection menu sit "above the staff". Contextual menus therefore exist for selection and paste.
- Vendor blog, https://blog.flat.io/amplifying-creativity-on-the-go (first published 31 May 2023, "last updated" 21 Sep 2026 per the page): toolbars were reorganised so "The score is no longer covered by interface buttons"; "Each toolbar category shows its tools directly below it"; dark mode revised "to make active, normal, and disabled buttons easier to tell apart", which shows Flat has a disabled button state.
- Vendor help, https://help.flat.io/en/music-notation-software/discover-the-interface/ : mobile web has the same tools as desktop, with "toolbars with notations tools and input keyboards at the bottom of the screen"; "tools are in the same places on mobile". Small piano for touch input. Whether the toolbar changes with selection: NOT ESTABLISHED.
- Triplet, tempo, hairpin placement on a phone: NOT ESTABLISHED.

Noteflight
- Vendor press release, 14 Apr 2016, https://notes.noteflight.com/noteflight-launches-new-interface-for-over-two-million-users/ : editor "works on any web browser and on all mobile devices"; "customizable notation palettes". Nothing on phone workflow, selection-dependent toolbars, or iPad specifics. The user guide (noteflight.com/guide) needs JavaScript and could not be read. Current phone or iPad behaviour: NOT ESTABLISHED.

### Part 3. Fixed-and-greyed versus hidden or changing controls

Practitioner and vendor guidance
- Jakob Nielsen, "Inactive GUI Controls: Show, Disable, or Hide?", UX Tigers, 13 Nov 2025, https://www.uxtigers.com/post/inactive-buttons (author's own site, not an NN/g article): "Hiding important features hurts discoverability"; a disabled control "must not be a communication dead end"; "If users expect a feature and don't see it, they may mistakenly conclude it doesn't exist." He reports no source recommended hiding inactive features generally; hide only what a user can never use. Expert opinion.
- Vitaly Friedman, "Hidden vs. Disabled In UX", Smashing Magazine, 21 May 2024, https://smashingmagazine.com/2024/05/hidden-vs-disabled-ux/ : "disable if you want the user to know a feature exists but is unavailable. Hide if the value shown is currently irrelevant and can't be used." Also "Both hiding and disabling features can be utterly confusing" and "Be sure to explain why a feature is disabled and also how to re-enable it." No research cited; practitioner opinion.
- NN/g, Rachel Krause, 10 Jan 2021, https://www.nngroup.com/articles/consistency-and-standards/ : "Ensure consistency in the placement of form fields and buttons"; example of a button that moved position and was clicked by mistake. Positional consistency, not disabled state. I did not find an NN/g article specifically on disabled versus hidden controls. NOT ESTABLISHED.
- Apple HIG, Menus, https://developer.apple.com/design/human-interface-guidelines/menus : "Show people when a menu item is unavailable. An unavailable menu item often appears dimmed and doesn't respond to interactions." Vendor guideline.
- Apple HIG, Edit menus, https://developer.apple.com/design/human-interface-guidelines/edit-menus : "Offer commands that are relevant in the current context, removing or dimming commands that don't apply. For example, if nothing is selected, avoid showing options that require a selection, such as Copy or Cut." So Apple permits either, and for a selection-driven floating edit menu leans to removing.
- Apple HIG, Toolbars, https://developer.apple.com/design/human-interface-guidelines/toolbars : "If your app can enter a modal state, consider offering contextually relevant toolbar controls." Also "Keep consistent groupings and placement across platforms" and "items on the toolbar's leading edge aren't customizable" to ensure they are "always available".
- Jensen Harris (Microsoft Office Ribbon), 3 Feb 2006, https://learn.microsoft.com/id-id/archive/blogs/jensenh/going-gray : "Communicating the disabled state at the top level means having a more accurate picture of what's available and what's not". Contextual tabs: "By showing the Picture Tools only when they could possibly work". "Nothing ever 'disappears' at any level, it just shows as disabled." A commenter: "Sometimes it is not immediately clear to a user why a command is greyed out." Vendor blog; shows Office used both patterns, disabling inside persistent groups and hiding whole contextual groups.
- Material Design 3: NOT ESTABLISHED. m3.material.io and m2.material.io are JavaScript-only and returned no guideline text. Do not cite M3.

Research
- Findlater and McGrenere, "A Comparison of Static, Adaptive, and Adaptable Menus", CHI 2004, https://www.cs.ubc.ca/labs/edapt/papers/findlater2004.pdf : "The static menu was found to be significantly faster than the adaptive menu"; "The majority of users preferred the adaptable menu overall" (15 of 27 adaptable, 8 adaptive, 4 static). Six participants complained adaptive menus were inconsistent and frustrating. Research paper (desktop menus, not touch).
- Findlater, Moffatt, McGrenere and Dawson, "Ephemeral Adaptation", CHI 2009, https://www.cs.ubc.ca/labs/edapt/papers/findlater2009.pdf : "Ephemeral adaptation maintains spatial consistency, thus addressing one of the main drawbacks of spatial adaptation"; spatially adaptive interfaces "are not often faster than their static counterparts"; "Higher adaptive accuracy results in faster performance and higher user satisfaction". Research paper.
- Findlater and Gajos, "Design Space and Evaluation Challenges of Adaptive Graphical User Interfaces", AI Magazine, 2009, https://www.eecs.harvard.edu/~kgajos/papers/2009/AIMag09-AUIs.pdf : mandatory adaptation may "prevent users from developing spatial memory of the menu layout"; adaptive split menus gave larger gains on a PDA-sized screen; automatic adaptation to motor ability made "motor-impaired users faster and more accurate"; adaptation can be "helpful to novices but not expert users". Survey paper.
- Gajos et al. primary papers (e.g. Supple): found in search but not read. NOT ESTABLISHED beyond the survey above.

## 2. Patterns

1. Soundslice's questions run before the editor, as a batch, and answers feed the scan. The evidence is that its review is a front-loaded confirmation step, with grouping to reduce effort ("click the ones that are wrong"). Nothing found shows Soundslice asking in the editor after the singer has begun correcting. INFERENCE: the Soundslice model is "ask once at import", which differs from asking about a bar mid-edit.
2. Soundslice's touch editor keeps a fixed row of shortcut buttons and lets selection change what the keyboard does. The button row is stable; the meaning varies. Hide-or-grey for the buttons themselves is not documented.
3. Nobody sourced here documents a phone workflow for fixing triplets, tempo or hairpins. Flat's phone path is "pick value, tap, add accidental from toolbar, tap note to change"; its toolbars are described as in the same places on mobile as on desktop. Only ScanScore's 2020 review says plainly that phone editing is absent.
4. On fixed-and-greyed versus changing controls, the sourced evidence favours showing unavailable controls disabled when the user should know they exist (Nielsen 2025; Friedman 2024; Apple Menus; Harris 2006), and hiding what can never apply. Apple's Edit menus line permits "removing or dimming". The research evidence is that spatial stability helps (Findlater 2009; Findlater and Gajos 2009 on spatial memory) and that mandatory adaptive layouts were slower than static (Findlater and McGrenere 2004). Caveats: the research is on desktop menus; the greyed-control claims are expert opinion, not experiment. The only audience-specific evidence found is that adaptation helped novices more than experts and helped motor-impaired users and small screens. INFERENCE: a fixed, greyed set suits learners who build spatial memory; no source tests it on a phone.
5. Greyed controls need an explanation. Friedman, Nielsen and a Harris commenter all name "why is it grey" as the failure. INFERENCE: if Ilya greys, it should say why on tap.

## 3. Could not establish

- Whether Soundslice answers can be skipped per question; how many questions a typical scan yields; whether answers edit notation or only train and steer the scan.
- Whether Soundslice highlights suspected errors on the results page. The banner looks like template text.
- How a phone user edits in Soundslice; whether its editor panel greys or hides unavailable commands.
- Current ScanScore/FORTE editing on phones and tablets.
- Flat on a phone: triplets, tempo, hairpins; whether toolbars change with selection.
- Noteflight on a phone or iPad: anything beyond a 2016 press line. The user guide did not load.
- Material Design 3 text on disabled states, toolbars, contextual action bars.
- An NN/g article on disabled versus hidden controls or on contextual menus (none found).
- Gajos primary studies; any peer-reviewed test of fixed-greyed versus contextual controls on phones.
- YouTube evidence of any of the above (not reached).
