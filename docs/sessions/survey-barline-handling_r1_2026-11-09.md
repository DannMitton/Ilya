# Survey of barline handling in notation and OMR software, r1

Date: 2026-11-09. Purpose: inform Ilya's two corrections for a fused (overfull) measure: (A) automatic split from the metre's arithmetic, (B) manual "add a barline here" and "remove this barline".

Method: every URL below was opened this session (HTML page, PDF, or the documentation site's own Markdown export). Quotation marks surround wording copied from the page; everything else is paraphrase. Items in "Analysis" are marked as my inference. Where a page was silent, I say so under "What I could not establish".

## Finale

Sources opened:
- Rebar utility: https://usermanuals.finalemusic.com/Finale2012Mac/Content/Finale/MassEditORebar.htm
- Measure tool: https://usermanuals.finalemusic.com/Finale2012Win/Content/Finale/ID_MAINTOOL_MEASURE.htm
- Split Measure plug-in: https://usermanuals.finalemusic.com/Finale2014Win/Content/Finale/Split_Measure_Plug_in.htm
- Pickup measures: https://usermanuals.finalemusic.com/Finale2012Win/Content/Finale/Pickup_measures.htm

Verified:
- Rebar redistributes notes so each measure holds the number of beats its time signature requires. Finale rebars automatically when the time signature changes, unless that option is switched off in the Time Signature dialog.
- Rebar does not add rests to partly filled measures. The page's example: two measures of two quarter notes become one measure of four quarter notes, so the user enters rests to keep positions.
- Rebar Options controls how far rebarring extends (to the end of the piece, or only through the next empty measure). Workflow: select a region, run Rebar Music, and if the result is wrong, undo, change options, and rerun.
- The Rebar page does not mention ties or notes that cross a barline.
- Measure tool: "Add or delete measures with the Edit menu." The Measure tool's context menu has Insert Measure Stack (asks how many) and Delete Measure Stack. Measure Attributes (double-click a measure) holds barline type and other per-measure settings.
- Split Measure plug-in: "divid[es] a measure into two sections and edit[s] the measure number map accordingly." Options: Split measure after beats (a beat number or a fraction such as .25 or .5, validated against the time signature), barline style (Invisible or Dashed), and move the second part to the next system. Run by selecting the full measure, then Plug-ins > Measures > Split Measure. The page does not mention ties.
- Pickup: Document > Pickup Measure at the start of a piece; Finale plays the full measure because "there are invisible rests behind the scenes." Finale "will also automatically skip over your pickup measure when displaying measure numbers." For a pickup mid-piece, Measure Attributes has an "Include in Measure Numbering" checkbox to clear.

## Sibelius

Source opened (Avid, Sibelius Reference, 2020.3 PDF, downloaded and searched as text): https://resources.avid.com/SupportFiles/Sibelius/2020.3/Sibelius_Reference.pdf. Section titles below are the manual's.

Verified:
- Overfull and underfull bars are called "irregular bars": "An irregular bar is one that is not the length specified by the previous time signature. Pick-up (upbeat) bars are a common example." Created through Home > Bars > Add > Other > Irregular, choosing note values that add up to the length.
- Rebarring: "If you put a time signature into some existing music, Sibelius splits the existing music up into new bar-lengths, with ties across barlines where necessary." The option "Rewrite bars up to next time signature" (in the More Options dialog of the Time Signature gallery) switches this off. Sibelius rebars only up to the next time signature. Selecting a passage first restores the original time signature at the selection's end, so only that passage is rewritten.
- The manual's recipe for bars that do not match the prevailing metre: select the time signature, delete it, answer No to rewriting, reinsert the same signature with "Rewrite bars up to next time signature" on.
- Split bars: Home > Bars > Split. The user selects the note before which to split. A dialog offers the barline type for the end of the first half (Invisible by default) and whether bar numbering counts the two halves separately. The split makes "two irregular bars of appropriate lengths." The page frames it as splitting a bar across systems, not as repairing a missed barline.
- Join bars: select bars, Home > Bars > Join. "any unselected portions of the first and last bars in the selection will be split off as separate bars." Following bar numbers "can also be reset."
- Adding a barline into an existing long, irregular bar: the manual says the Draw Free Rhythm Barline plug-in can do this: "simply select the note after which you want to insert a barline, and run the plug-in." It inserts the barline "at that rhythmic position on all staves in the system" and can split tuplets on other staves. It also creates an appropriate time signature for each bar unless the user turns that off. It cannot place a barline inside a tuplet; the barline lands after the tuplet.
- Mid-bar barline (Notations > Common > Barline): input the music first, then add the barline between two notes. If a bar rest is present, split the rest on either side.
- Pickup: created together with the time signature ("Start with bar of length"). Sibelius "automatically number[s] the pick-up bar as bar 0" so the first complete bar is bar 1. Adding one later needs a Bar Number Change to bar 0 (Text > Numbering > Bar Number Change).

## MuseScore 4

Sources opened (MuseScore handbook, Markdown exports): 
- https://handbook.musescore.org/notation/rhythm-meter-and-measures/pickup-and-non-metered-measures
- https://handbook.musescore.org/notation/rhythm-meter-and-measures/measure-numbering
- https://handbook.musescore.org/notation/rhythm-meter-and-measures/measure-properties
- https://handbook.musescore.org/notation/rhythm-meter-and-measures/barlines
- https://handbook.musescore.org/notation/rhythm-meter-and-measures/regroup-rhythms
- https://handbook.musescore.org/basics/adding-and-removing-measures
- Older (version 3) handbook, for the menu paths of split and join: https://handbook.musescore.org/3/basics/measure-operations

Verified:
- Split: "This command inserts a barline before a selected note, splitting the measure into two." Three methods: select a note and Ctrl-click a barline in the palette; Ctrl-drag a palette barline onto the note; or Tools > Measures > Split Measure Before Selected Note/Rest.
- Join: "This command joins selected measures into one measure." Two ways: select the barline between two measures and press Ctrl+Del (or Tools > Remove selected range); or select measures and choose Tools > Measures > Join selected measures. Selecting one staff joins the same measures in every staff of the system. "Beaming may be automatically modified."
- Overfull and underfull measures are allowed and flagged: "a small + or - sign will be shown above the measure" when the content does not match the time signature. The handbook calls these "non-metered measures": "one which is less or greater in duration than the indicated time signature."
- Measure properties has a Measure duration section with Nominal (the time signature, not editable there) and Actual. Setting Actual smaller than Nominal makes a pickup. The version 3 page says a split changes the Actual properties and leaves the time signature alone, and that beam grouping "may be reset."
- Mid-measure barline from the palette (select a note, click a barline): "The barline is for visual purposes and does not factor into any measure operations." A real split uses the split command.
- Numbering: "Internally, MuseScore Studio always numbers the bars consecutively through the whole score, starting at 1." "Exclude from measure count" and "Add to measure number" change the displayed number only. "Exclude from measure count" is checked automatically for a pickup made in the New Score wizard. "By convention, measure numbering starts at the first complete measure."
- Regroup rhythms (Tools > Regroup rhythms) changes notation only: "The rhythm itself is not changed." It regroups notes, not barlines, so it does not repair a missing barline.
- Ties across a split: the handbook is silent (I asked the handbook's own query endpoint; its answer was "The docs don't specify what happens if a note or tie crosses that split.").

## Dorico

Source opened (Steinberg, Dorico Pro 4.3.30 Operation Manual PDF, downloaded and searched as text): https://www.steinberg.help/api/khub/documents/D2Ok9VboavczZ4vAHa~Pmg/content. Online equivalents I opened: https://steinberg.help/dorico/v2/en/dorico/topics/notation_reference/notation_reference_bars_splits_c.html and https://steinberg.help/dorico/v3/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_barlines_inputting_popover_t.html. The current online manual pages render by script, so I could not read their bodies; version differences from 4.3.30 are NOT ESTABLISHED.

Verified:
- Dorico bars come from the time signature. Splitting a bar by time signature: "You can split bars into two or more bars by changing the time signature at any rhythmic position." The new signature applies until the next one or the end of the flow.
- Inserting a barline: select an item at the rhythmic position, press Shift-B for the Bars and Barlines popover, type the barline, press Return (all staves) or Alt/Opt-Return (selected staves).
- Rule that matters for Ilya: inputting a non-normal barline inside a bar leaves the time signature alone, but "inputting a normal (single) barline anywhere within an existing bar resets the prevailing time signature from that point onwards." Example: a barline after the second quarter of a 4/4 bar leaves a 2/4-equivalent bar on the left and starts new 4/4 bars on the right. A signpost marks each manual barline.
- Result text on the popover page: "Surrounding music automatically adjusts to accommodate the barline. For example, note grouping, rests, and tied notes all adjust if necessary."
- Pick-up bars: entered with the time signature plus an extra value, such as 4/4,1.5 (dotted-quarter pickup) or 6/8,2. "The number after the comma indicates multiples of the rhythmic unit specified by the denominator of the time signature." The manual states pickup bars "do not contribute to the bar number count. Bar numbers are counted from the first full bar in the flow." Notes in a pickup are beamed backwards from the end of the bar (v2 page: https://steinberg.help/dorico/v2/en/dorico/topics/notation_reference/notation_reference_time_signatures_pick_up_defining_irregular_bars_as_t.html).
- The v2 page also says Dorico can decide automatically, using "internal heuristics," whether a leading irregular bar is a pickup or a normal irregular bar. The Properties option "Group first bar as pick-up" overrides it.

## OMR tools

### Audiveris

Source: https://audiveris.github.io/audiveris/_pages/guides/ui/ui_foundations/inspection (and an example session at https://audiveris.github.io/audiveris/_pages/ui_examples/eyes/README).
- Audiveris checks voices against the time signature. A measure is shown with a pink background when, for at least one voice, "The voice starting time cannot be determined" or "The voice ending time exceeds the measure expected duration." The expected duration comes from the current time signature.
- Pink is a hint, not a full check: a measure can look fine and still hold errors the engine "could not reliably detect."
- Correction is manual, glyph by glyph (assign a shape, drag a rest from the palette, deassign and reclassify). The example session says a dropped item "triggers a RHYTHM re-processing for the containing measure." Neither page mentions a missed or extra barline or an automatic split. The editors page (https://audiveris.github.io/audiveris/_pages/reference/editors) says a barline "can move only horizontally" and is snapped to staff height.

### ScanScore

Sources: https://scanscore.zendesk.com/hc/en-us/articles/16769191253778-Bar-Lines-and-Repeats and https://scanscore.zendesk.com/hc/en-us/articles/360019816160-How-can-I-correct-errors-in-ScanScore
- Closest match to Ilya's manual verbs. Add: click the add icon, then click the exact position in the document; "This splits the bar and adds a bar to the bar number count." Delete: click the delete icon, then click left of the barline; "This merges the two bordering bars and might fix wrong numbers of notes."
- Flagging: "If there are too many note values in a bar, you will see a light blue dashed line." A bar with too few notes gets a purple marker. The number on the marker is the voice. The correction page warns the markers are not always accurate, and that the marker clears itself once the bar is correct.
- The pages do not say whether ScanScore offers an automatic split, or what it does with notes that straddle a new barline.

### PhotoScore (Neuratron)

Source: https://neuratron.com/faq.htm
- "Bars highlighted with horizontal red dashed lines indicate bad timing." "you must ensure that the timing in each bar adds up to the current time signature." A red dashed line at the end of a staff "means the end barline is missing." The FAQ gives no automatic split and no barline-editing steps.
- PhotoScore Lite hands off to Sibelius (see the Sibelius reference, section 1.9), so Sibelius's irregular-bar and split tools are the downstream repair path. (From the Sibelius PDF above; I did not open a PhotoScore user guide, since the Neuratron help PDF URLs I tried returned HTML error pages.)

### SmartScore (Musitek)

Source: https://www.musitek.com/smartscore-online-help/midi/troubleshooting/recognition_results.php
- Troubleshooting says missed barlines come from the image: "Barlines were not recognized and dropped." The fixes offered are to deskew or rescan the page and recognize again. No in-editor duration check or barline repair was found. Its Properties tool edits barline attributes (visibility, system break) only (https://musitek.com/smartscore-online-help/professional/notation_editing/repeats_barlines/measure_barline_attributes.php?os=mac).

### Newzik and PlayScore

- Newzik (https://newzik.com/en/ai): no mention of measure checks or barline correction; the page points users to export MusicXML/MIDI and edit elsewhere.
- PlayScore (https://www.playscore.co/features/): no mention of editing bars or checking durations.
- Flat (https://help.flat.io/en/music-notation-software/omr), not on the requested list: output is editable and the user is told to compare against the original. No duration check described.

## MusicXML 4.0

Sources: schema text from the W3C repository, https://raw.githubusercontent.com/w3c/musicxml/v4.0/schema/musicxml.xsd (measure-attributes group, line 2383 onward), and the reference pages https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/measure-partwise and https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/measure-numbering.

Verified:
- `number` is required and typed `xs:token`. It is "often numeric" but "does not have to be." It groups measures across parts: in partwise files it "should be the same for measures in different parts that share the same left barline."
- `implicit="yes"` marks measures "where the measure number should never appear, such as pickup measures and the last half of mid-measure repeats." Default is "no." "For a pickup measure, the number attribute is typically set to '0' and the implicit attribute is typically set to 'yes'."
- Non-numeric `number` values "are typically used together with the implicit or non-controlling attributes being set to 'yes'."
- If numbers are not unique within a part, "this can cause problems for conversions between partwise and timewise formats." The `text` attribute carries a displayed number different from `number` and is ignored on implicit measures. The schema says `implicit` is preferred over an empty `text`.
- The measure element has no attribute named `index` in the 4.0 schema (searched the file for `name="index"`; no match). Measure position is document order. Any "index" in Ilya is Ilya's own, not MusicXML's.
- The spec does not describe a procedure for splitting a measure or renumbering afterward. A split is simply two `<measure>` elements.
- music21's importer (https://music21.org/music21docs/moduleReference/moduleMusicxmlXmlToM21.html, a third-party reader) parses a number such as `44b` as number 44 with suffix `b`, which shows that consumers cope with suffix-style numbers.

## What Ilya can adopt

All items in this section are my inference from the sources above, unless a source is named.

### (a) The arithmetic rule

1. Trigger: a measure's summed duration is an exact positive integer multiple (2 or more) of the metre's bar length. Boundaries fall at cumulative multiples of the bar length. This is what Finale's Rebar and Sibelius's "Rewrite bars" do in the general case; both start from the time signature, not from the notes.
2. Exactness gate. Finale's Rebar run on an inexact measure leaves partly filled measures and does not add rests; Audiveris and PhotoScore flag rather than guess. Adopt: when the total is not an exact multiple, do not split. Flag the measure and leave it to the manual verbs.
3. Straddling notes. Sibelius ("ties across barlines where necessary") and Dorico ("tied notes all adjust") tie. That is correct for a score being re-barred by intent. For a scan, a note that crosses a computed boundary is evidence the printed barline is somewhere else. Recommendation: refuse the automatic split when any note or rest crosses a computed boundary, and say so in the flag; allow the manual "add a barline here" at a chosen note, since there the singer has chosen the position. If Ilya wants tie behaviour, an offered (not automatic) tie matches what Sibelius and Dorico do. This is a taste decision for Dann.
4. Pickup convention. Pickups are short bars at the start, with the matching remainder in the last bar (MuseScore: "It is accepted musical practice to omit the same duration as the pickup from the final measure of the piece or of the same repeat section"). Adopt: a first measure shorter than the metre is not an error if first plus last equals one bar length (or equals one bar length within a repeat section). If the first measure is overfull, try an exact split first; a remainder shorter than one bar is a candidate pickup only if the last measure is complete by the above sum. Dorico decides pickup-versus-irregular by heuristics and offers an override ("Group first bar as pick-up"); Ilya can copy that: automatic guess plus an explicit toggle.
5. Order of preference when the first measure of a piece is overfull and the sums allow either reading: prefer the reading with no pickup (all bars full) and offer the pickup reading as the alternative. This is my suggestion; no app documents it.

### (b) Manual verbs

- Names singers already know: "Split measure before selected note" (MuseScore's exact wording: Split Measure Before Selected Note/Rest), "Join selected measures" (MuseScore) or "Join bars" (Sibelius). Finale and Sibelius say "Split." ScanScore pairs the add and delete barline pair, which is nearest to Ilya's planned "add a barline here" and "remove this barline." Suggest labels: "Add a barline here" (acts before the chosen note, as MuseScore does) and "Remove this barline" (merges the two neighbours, as ScanScore does: "This merges the two bordering bars").
- Behaviour: add is anchored to a note (MuseScore, Sibelius, Dorico all select a note or rhythmic position first). Remove merges and may produce an overfull measure that the flag then reports, which matches MuseScore's non-metered display.
- Keep "visual only" barlines out of scope. MuseScore's palette barline "does not factor into any measure operations"; Ilya's verbs are real barlines.
- Dorico's trap is the reverse of what Ilya wants: adding a normal barline silently restarts the metre. Ilya's verbs can avoid that by never changing the time signature.
- Show the effect before committing. Finale's Rebar workflow is "undo, adjust, rerun"; Notation Composer's rebar tools preview with "Show adjustments" before "Finalize" (https://www.notation.com/ComposerDocs5/using_the_rebar_tools_to_corre.htm; this is a MIDI-transcription tool, so treat it as a UI pattern only).

### (c) Stable numbers and references after a split

- MuseScore keeps an internal consecutive count and treats the displayed number as a separate layer ("Exclude from measure count", "Add to measure number"). Sibelius and Finale do the same through a "bar number change" and a "measure number map"; Finale's Split Measure plug-in edits the map as part of the split.
- Adopt: give every measure a stable internal id at read time that never changes, plus a derived display number. After a split, insert new measures with new ids; the display number of every later measure shifts by the count added. ScanScore does exactly this on add ("adds a bar to the bar number count") and on remove (merges).
- Pickups: carry an explicit flag. In MusicXML export write `number="0"` and `implicit="yes"` (spec's own typical case), and number the first full bar 1. This matches Sibelius (bar 0), Finale (skipped in numbering), Dorico (counted from the first full bar), and MuseScore (excluded from the count).
- Anything the singer has attached to a measure (corrections, notes, ids used in saved state) is keyed to the internal id, not the display number. When a split divides a measure, decide which half keeps the old id (suggest the first half) and record the pair, so saved references resolve.
- Do not use `text` to fake numbers; it is ignored on implicit measures and exists for display differences.

### (d) Caveat on checks

Audiveris states its pink flag is a hint that cannot detect every error. A measure that sums correctly can still contain a wrong note value; Ilya's arithmetic check proves only that the total fits.

## Pitfalls

- Rebar in Finale does not add rests, so measures can come out short; Ilya's split must not claim the measure is "fixed" beyond the arithmetic.
- Sibelius and MuseScore both warn that beaming changes on split and join (MuseScore: beaming "may be reset" or "automatically modified"). Ilya's notation may regroup beams after a correction.
- Dorico: a normal single barline restarts the metre from that point; signposts mark manual barlines. Do not copy that side effect.
- Sibelius's barline plug-in cannot split inside a tuplet; the barline lands after the tuplet. Tuplets spanning a computed boundary need the same refusal as straddling notes.
- MuseScore's palette barline looks like a barline but is visual only; users can think a split happened when it did not. Name the verbs so that "real" is unambiguous.
- Mid-bar barline plus bar rest: Sibelius says to split the rest on either side. In Ilya, a rest that spans a computed boundary is a straddler.
- MusicXML measure numbers that repeat inside a part cause partwise/timewise conversion problems; renumbering after a split must keep numbers unique, or use suffixes (`12a`, `12b`) deliberately. Consumers such as music21 parse suffixes.
- Do not assume a missed barline is the only cause of an overfull measure. Audiveris's own example shows augmentation-dot misreads (a stray glyph read as a dot) changing durations. An overfull bar whose total is not an exact multiple is more likely a duration misread; flag it, do not split it.

## What I could not establish

- What Finale's Rebar, Measure tool, or Split Measure plug-in does with notes that straddle a new barline (pages silent on ties).
- What MuseScore 4 does with a straddling note or tie on Split Measure (handbook silent; I did not test the program). The MuseScore 4 menu paths come from the version 3 handbook page plus the version 4 pickup page, which repeats the same Tools > Measures wording.
- The Dorico 5.1 and later online pages: they render by script and gave no body text. I relied on the 4.3.30 PDF and older online pages. The Dorico manual does not say how an automatic pickup guess interacts with bar numbering beyond "do not contribute."
- Whether Audiveris has any tool to add or remove a barline after recognition beyond the glyph tools; the pages I opened do not describe one (the "UI Tools" section was not opened).
- Whether SmartScore flags bars whose durations do not add up, and how; the SmartScore pages I opened are silent. PhotoScore's flagging comes from one FAQ page, and I did not open its user guide.
- Newzik and PlayScore: no documentation of measure checks or barline correction was found; absence of a page is not proof the apps lack the feature.
- Any app that automatically splits an overfull bar from the metre on import. I found none documented; the closest are Finale and Sibelius rebarring after a time signature change, which are not OMR repairs. This may mean Ilya's step (A) is novel; I cannot show that it is.
- The MusicXML spec gives no rule for renumbering after a split; the Ilya approach in (c) is my design, not a documented standard.
