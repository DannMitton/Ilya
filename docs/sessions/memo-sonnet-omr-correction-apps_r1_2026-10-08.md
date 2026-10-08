Returned by a Sonnet research agent, 2026-10-08, commissioned by the desk on Dann's yes of 12:29. Web research only.

# Memo: how music-reading apps handle correction, with a focus on touch

Research on 8 Oct 2026. Source types: V = vendor documentation or video, R = independent review, U = user forum or store review, I = my inference (marked).

## 1. Summary table

| App | Q1 Platforms | Q2 Fixes (a pitch, b accidental, c length/dot, d triplet, e wrong staff, f missing note) | Q3 Flags | Q4 Context-responsive | Q5 Model | Q6 Tempo/dynamics/hairpins |
|---|---|---|---|---|---|---|
| PlayScore 2 | iOS, Android, Windows | No in-app note editing found; fixes are re-capture, page crop/mask, sliders, or MusicXML export. a-f NOT ESTABLISHED | Green "OK" dot for capture quality only. Auto-correction (not user-facing) | NOT ESTABLISHED | NOT ESTABLISHED | Playback tempo only. Export carries dynamics |
| Sheet Music Scanner | iOS/iPadOS, Mac (M1+); Android "Pro" listing | No in-app editing found. Double sharps/flats unsupported | NOT ESTABLISHED | NOT ESTABLISHED | NOT ESTABLISHED | Playback tempo 50-330 BPM. Dynamics unsupported |
| Newzik (LiveScores) | iOS app, web | No correction tool found. Export MusicXML and edit elsewhere. Key and clef changeable | "!" beside a piece whose conversion failed (web) | NOT ESTABLISHED | NOT ESTABLISHED | Tempo and dynamics only as text annotations on the PDF |
| Soundslice | Browser; touch editor on tablets; phones not documented | Scan review questions, then a full editor (see notes) | Review questions ("Does this notehead have a sharp sign in front of it?"); "highlighted errors" banner, unexplained | Partly: panel shows a tuplet icon for an existing tuplet | Select, then act; "type the thing" on keyboard; touch uses a piano keyboard | Yes: select a note, click dynamic, hairpin, or tempo button |
| ScanScore | Windows and Mac desktop; phone app captures only | Toolbars; tuplet button over three selected notes; others NOT ESTABLISHED | Dotted underlines: purple (missing notes), blue (too many) | Category icons open edit groups; flag clears on fix | Select, then act | Dynamics category exists. Tempo NOT ESTABLISHED |
| SmartScore | Desktop (Win/Mac); NoteReader on iOS/Android is capture and export only | Palette, Ctrl-click inherit value, X-click delete, Select tool mass delete, custom tuplet tool | Measures shaded for rhythm errors | Ctrl-click makes the cursor adopt the clicked note's attributes | Choose tool, then apply | NOT ESTABLISHED |
| PhotoScore / NotateMe | PhotoScore Mac and Windows; NotateMe iOS/Android (handwriting input, not a scan reader) | Select, then keypad button | Red dashed lines on bad-timing bars, beat totals, Bad Timing Navigator | Hovered staff shown in full contrast | Select then keypad; or keypad then click staff | NOT ESTABLISHED |
| Dorico (popovers) | Desktop and iPad | Not an OMR app. Popovers are the entry method | None | Popover palette is a separate mode | Type the thing | Yes, typed: mf, `<`, rit., q = 120, 3:2 |

## 2. Per-app notes

### PlayScore 2
- It runs on iOS, Android, and Windows: [PlayScore features](https://www.playscore.co/features/) (V, undated) and [PlayScore FAQ](https://www.playscore.co/faq/) (V, undated).
- The iPhone/iPad listing is version 3.66, with MusicXML and MIDI export: [App Store](https://apps.apple.com/app/id1449591118) (V, 2026 by inference from the 3.64 date of 12/16/2025).
- The App Store listing describes no in-app note editing, and it points users to MuseScore or Dorico via MusicXML export: [App Store](https://apps.apple.com/app/id1449591118) (V).
- The Sound On Sound review (June 2022) describes no note editing. Remedies are re-capturing a page, reordering, cropping, rotating, masking, and Advanced Settings sliders. The only quality flag is a green "OK" dot on the home screen: [Sound On Sound](https://www.soundonsound.com/reviews/playscore-2) (R).
- The FAQ mentions an "auto-correction feature that can spot mistakes in a score" and a reprocess option. It does not say the user sees or controls it: [FAQ](https://www.playscore.co/faq/) (V).
- Tempo can be changed during playback, and page-level edits are offered: [features](https://www.playscore.co/features/) (V).
- Net: PlayScore 2 offers no note-level correction that I could source.

### Sheet Music Scanner (David Zemsky / App Sub 1 LLC)
- The iOS listing says it recognizes accidentals and triplets. It does not support codas, percussion, dynamics, double sharps or flats, or grace notes: [App Store](https://apps.apple.com/us/app/sheet-music-scanner/id884984324) (V) and [sheetmusicscanner.com](https://sheetmusicscanner.com) (V).
- Neither page describes in-app editing. Reviewers there say they clean up in other software, and one asks for manual correction: [App Store](https://apps.apple.com/us/app/sheet-music-scanner/id884984324) (U).
- An Android "Sheet Music Scanner Pro" listing (version 1.060, March 2026) shows no editing tools. A reviewer asks to manually add notes: [AppBrain](https://www.appbrain.com/app/sheet-music-scanner-pro/com.xemsoft.sheetmusicscanner2) (U). That it is the same product as the iOS app is NOT ESTABLISHED; the vendor page links a Google Play listing without stating Android support.
- Net: a precedent for what a reader cannot represent. Its own limits list includes double sharps, which is also an error class in Ilya's measurements.

### Newzik (LiveScores; "Maestria" not established as the OMR name)
- The OMR is branded LiveScores. It is scanned in the iOS app, and the result sits in the LiveScore tab. A Newzik Web version is listed: [Newzik AI page](https://newzik.com/en/ai) (V, undated) and [Newzik maestria page](https://newzik.com/en/maestria) (V, undated). The latter page does not mention "Maestria" in the retrieved text.
- No correction tool is described. The vendor says to export MusicXML and edit in notation software, and the blog says to "manually check the generated MusicXML file and correct any transcription errors": [Newzik blog](https://en.blog.newzik.com/blog/convertir-partition-pdf-en-musicxml) (V, dated "Nov. 18", year not shown). Key and clef can be changed after conversion: [Newzik AI page](https://newzik.com/en/ai) (V).
- A failed conversion shows an exclamation mark beside the title (web): [Newzik support](https://support.newzik.com/en/support/solutions/articles/77000495898) (V, 28 Dec 2022). It is a per-piece flag, not per-note.
- Tempo and dynamics are text annotations in separate layers over the PDF, not notation: [Newzik professionals page](https://newzik.com/en/resources-sheet-music-app/most-complete-sheet-music-app-professionals) (V).
- Newzik runs on iOS, Android, and web: same page (V). Whether LiveScores runs on Android is NOT ESTABLISHED.

### Soundslice (the strongest touch precedent)
- Flow: upload, an emailed link to a **review** of questions the scanner was unsure about, a results page, then the notation editor.
  - The review help page gives one example question: "Does this notehead have a sharp sign in front of it?" It says the system "learns... and asks fewer questions": [Soundslice review](https://www.soundslice.com/help/en/creating/pdf-import/344/reviewing/) (V, undated).
  - A newer question type asks "whether two notes are played at the same time" in cases where "our system isn't 100% sure": [blog, 21 Sept 2023](https://soundslice.com/blog/256/improvements-to-pdf-image-importer-sept-21) (V).
  - Review questions are grouped automatically (26 Jan 2023) and show zoomable images (13 Aug 2026): [blog](https://www.soundslice.com/blog/music-scanning) (V) and [blog, 13 Aug 2026](https://www.soundslice.com/blog/311/sheet-music-scan-improvements/) (V).
  - The page layout (what a tap on an answer does) is NOT ESTABLISHED; the screenshot was not readable.
- The results page shows the engraving and the original image together. The vendor calls it "not the full-featured Soundslice interface". It carries the banner "Please fix the highlighted errors," which the help does not explain: [results page](https://www.soundslice.com/help/en/creating/pdf-import/345/the-results-page/) (V).
- The editor shows the scan in the lower half so the user can "spot-check for any errors or omissions": [editing scans](https://www.soundslice.com/help/en/creating/pdf-import/346/editing-scans/) (V).
- Touch editor, a separate interface: on a tablet it shows an 88-key piano at the bottom of the screen, swipeable. Shortcut buttons: [tablet interface](https://www.soundslice.com/help/en/creating/basics/255/tablet-interface/) (V, undated) and [blog, 10 June 2021](https://www.soundslice.com/blog/205/new-create-edit-sheet-music-on-your-tablet) (V).
  - Rest selected: a key tap replaces it with that note (missing note, f).
  - Note selected: a key tap adds a chord note, and tapping the same key removes it.
  - Buttons: lengthen/shorten, dot toggle, note to rest, enharmonic toggle, cursor left/right, select current bar, auto-advance, undo/redo/copy/paste, delete.
  - Multiple notes: select the current bar, then drag the selection edges.
  - The page does not describe phone behaviour, and the 2021 blog does not mention phones. Phone editing is NOT ESTABLISHED. The 2021 small-screen post covers viewing: [blog, 4 Feb 2021](https://soundslice.com/blog/196/a-better-soundslice-experience-on-small-screens) (V).
- Pitch (a): select the note and type A to G. Accidentals use Ctrl-Shift-9/7/8 for sharp/flat/natural. Double sharps are not mentioned: [note entry](https://www.soundslice.com/help/en/creating/basics/81/note-entry/) (V). On touch, the piano keys change pitch and the enharmonic toggle changes spelling (V, tablet page).
- Length and dot (c): buttons on touch (V, tablet page).
- Triplet (d): select the first note (or all three), then press the triplet icon in the Notes section. To remove one, click a note in the triplet and press the tuplet icon in the "current notations section": [triplets](https://soundslice.com/help/en/creating/notations/102/triplets-and-tuplets) (V). INFERENCE: that icon is context-responsive, since it appears to act as a toggle.
- Wrong staff (e): one-act removal NOT ESTABLISHED. The importer asks per staff for instrument assignment (13 Aug 2026 post), but a "delete this staff" action is not documented.
- Delete: select, then Delete/Backspace (keyboard) or the delete button (touch).
- Dynamics and hairpins: select the note(s), then use the Dynamics section of the top panel. Tempo: select a note, then use the "Bar" section's "Set tempo marking," which opens an edit screen for bpm, beat unit, and label: [dynamics](https://soundslice.com/help/en/creating/notations/111/dynamics-and-hairpins) (V) and [tempo](https://soundslice.com/help/en/creating/notations/131/tempo-markings) (V).
- The vendor says many commands are "only available via search": [note entry](https://www.soundslice.com/help/en/creating/basics/81/note-entry/) (V).
- Whether the controls change with the selection is not stated on the selecting page (V).

### ScanScore
- ScanScore runs on Windows and Mac. Phones and tablets are listed only as capture methods: [scan-score.com](https://scan-score.com/en/) (V, undated).
- The 2020 review describes a Windows-only program, a free phone app paired by QR code for capture, and "You can't edit on the phone": [Colin Dorman review](https://colindorman.com/horn/scanscore-review/) (R, 15 Jan 2020, sponsored). Current status is NOT ESTABLISHED.
- The original sits beside ScanScore's reading, with corrections made on the reading. Uncertain measures get dotted underlines: purple for incomplete or missing notes, blue for too many notes: same review (R).
- Triplet example: unrecognised triplets raised blue flags. Selecting the three notes and clicking the tuplet button fixed them, and the flag cleared: same review (R).
- Left-side icons open edit categories: note/rest, articulations/ornaments, text, clefs, dynamics, barlines: same review (R). Tapping a flag takes the user nowhere in the sources; navigation on flag tap is NOT ESTABLISHED.
- Vendor claim: "The correction of scanning errors using the toolbars is extensive and convenient"; the stated way to find errors is playback: [scan-score.com](https://scan-score.com/en/) (V).

### SmartScore (desktop) and SmartScore NoteReader
- NoteReader is on iOS and Google Play, captures and plays back, and the Premier upgrade ($9.99) exports MusicXML/MIDI: [Musitek mobile](https://www.musitek.com/mobile/) (V, footer 2014). The App Store lists version 1.2 dated 10/22/2017: [App Store](https://apps.apple.com/app/id826309591) (V). Editing is not described.
- Desktop SmartScore: the original sits above the recognised file. One staff is active at a time (Caps Lock locks it). A measure with a rhythm error is shaded reddish, and the example is a triplet read as sixteenth beams: [manual](https://www.musitek.com/SSXManual/Web/Using_SmartScoreX00016.html) (V, undated).
- Ctrl-click on a note makes the cursor adopt its value, "inherit its attributes." Values come from the Notes or Rests palettes. X-click deletes. The Select tool (O) deletes many objects, and the manual names whole areas of wrong ties, slurs, or hairpins as the use: [manual page](https://www.musitek.com/SSXManual/Web/Using_SmartScoreX00157.html) (V).
- Tuplets: a "D:B" custom tuplet tool, with a Nudge mode for the bracket: [manual page](https://musitek.com/SSXManual/Web/Using_SmartScoreX00056.html) (V). Model: choose tool or value, then apply. Pitch, accidentals, wrong staff, tempo, and dynamics are NOT ESTABLISHED.

### PhotoScore / NotateMe
- PhotoScore runs on Mac and Windows. NotateMe has iOS and Android counterparts (handwriting input, not a printed-music reader). No native mobile PhotoScore is mentioned: [Sound On Sound, Aug 2021](https://www.soundonsound.com/reviews/neuratron-photoscore-notateme-ultimate-2020) (R).
- Flags: "squiggly red lines and little beat under/over-run totals," plus a Bad Timing Navigator listing repairs in order: same review (R). The Windows demo says bars with red dashed lines indicate bad timing: [Neuratron tour](https://neuratron.com/phsctour_win.htm) (V).
- Fixes: select a note (it turns a different colour). Pitch is by mouse or cursor keys. An on-screen keypad edits accidental, articulation, and length. To add a note, pick a value on the keypad, then click the staff. Delete by key. A Reading preference toggle, "Tuplets (includes advanced rhythm detection)," can be switched off: [Neuratron tour](https://neuratron.com/phsctour_win.htm) (V). The reviewer calls the output a draft needing a "manual tidy-up job": [Sound On Sound](https://www.soundonsound.com/reviews/neuratron-photoscore-notateme-ultimate-2020) (R).
- Wrong staff, tempo, dynamics: NOT ESTABLISHED.

### Dorico popovers
- Dorico for iPad has them. A toggle at the top of the right tool area swaps the tool palette for a popover palette with "one on-screen button for each of Dorico's beloved popovers." A tap opens a text field above the selection and brings up the on-screen keyboard. A hardware keyboard uses the same Shift-letter shortcuts as desktop: [Scoring Notes](https://www.scoringnotes.com/reviews/dorico-arrives-on-ipad/) (R, updates dated 9 Aug 2021). Current iPad behaviour: NOT ESTABLISHED.
- Typing grammar (desktop, version 5):
  - Dynamics (Shift+D): mf, (f), `<`, `>`, `<>`, cresc., dim.
  - Tempo (Shift+T): q = 120, Adagio, rit., accel.
  - Tuplets: "3" or "3:2" is a triplet, "5:4" a quintuplet, "5:4q." a dotted-quarter quintuplet.
  - Suggestions appear as you type; the lists are examples, not complete: [Dorico 5 popovers PDF](https://archive.steinberg.help/dorico/v5/extra/dorico_5_popovers_230524.pdf) (V).
- Existing notes can be turned into tuplets. The help body did not render, so the steps are NOT ESTABLISHED: [Steinberg help](https://www.steinberg.help/r/dorico-pro/5.1/en/dorico/topics/notation_reference/notation_reference_tuplets/notation_reference_tuplets_turning_notes_into_t.html) (V).

## 3. Patterns

1. **Mobile OMR apps mostly do not correct; they export.** PlayScore 2, Sheet Music Scanner, Newzik LiveScores, and SmartScore NoteReader describe no in-app note correction and send the user to MusicXML in another editor. ScanScore's phone app captures only. Soundslice is the only touch-first correction path I found.
2. **Show the original beside the reading.** Soundslice, ScanScore, SmartScore, and PhotoScore all keep the scan next to the engraving. PhotoScore and SmartScore fade or highlight the matching staff.
3. **Flags are measure-level and typed by rhythm count.** ScanScore (purple for too few, blue for too many), SmartScore (shaded measure), and PhotoScore (red dashed lines, beat totals) flag by bar arithmetic. In both SmartScore's and ScanScore's examples the cause was a triplet, which matches Ilya's measured error. Soundslice instead asks targeted yes/no questions about specific glyphs.
4. **Triplet repair is "select the notes, press one tuplet button."** ScanScore, Soundslice (select first note or all three, press the icon), and SmartScore (a tuplet tool) all take selection then act, not typing. Dorico is the typed counterpart ("3").
5. **The touch editor replaces the keyboard with a pitch keyboard plus a few action buttons.** Soundslice's tablet interface uses a swipeable piano keyboard, with key-on-rest replacing and key-on-note toggling. Dorico for iPad swaps its tool palette for one on-screen button per popover, and a tap opens a text field with the system keyboard.
6. **Weak spot across the field: one-act removal of a wrongly read staff.** I found no documented one-gesture "this staff is not the voice" action. Soundslice asks per-staff instrument questions. SmartScore has mass delete with the Select tool, and the manual gives wrong ties and slurs as its use.

## 4. Could not establish

- PlayScore 2: any in-app correction (a to f), flags beyond the "OK" dot, context-responsive controls, selection model, adding dynamics or hairpins in the notation.
- Sheet Music Scanner: all of Q2, Q3, Q4, Q5; whether the Android "Pro" listing is the same product; hairpins.
- Newzik: any correction path (a to f); whether "Maestria" names the OMR; Android availability of LiveScores; per-note flags.
- Soundslice: phone behaviour of the editor; the review question screen layout and what a tap does; what the "highlighted errors" are; double-sharp entry; deleting a whole wrong staff in one act; whether the editor panel changes with selection (only inferred from the "current notations" wording).
- ScanScore: current platform status after 2020; tablet or phone editing; what tapping a flag does; pitch, accidental, length, wrong-staff, and missing-note tools; tempo marks; phone companion status today.
- SmartScore: platforms of the desktop product; pitch, accidental, and wrong-staff tools; tempo and dynamics; whether a mobile editor exists (NoteReader appears not to).
- PhotoScore: wrong-staff removal; tempo, dynamics, and hairpins; any mobile PhotoScore.
- Dorico: current iPad popover behaviour (the only touch source is a 2021 review); steps for turning existing notes into tuplets; the Dorico help bodies did not render.
