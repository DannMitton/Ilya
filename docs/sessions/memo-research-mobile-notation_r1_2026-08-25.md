# Memo: note-editing interfaces in mobile and tablet notation apps

Returned by a Sonnet research agent, 2026-08-25, commissioned by Dann in the
mobile design session. Quoted worst case ~60k tokens; actual spend 76k, over
by a quarter, owned in-thread. Web research only; every claim carries its
source and its instrument (vendor docs, review, or inference). Reproduced
verbatim below, desk header aside.

---

## Summary table

| App | Platform | Selection model | Control surface location | Portrait editing (phone) | Keeps selection visible how | Sources |
|---|---|---|---|---|---|---|
| **Dorico for iPad** | Tablet only (iPad, Vision Pro; no iPhone) | Tap/select note(s), an "Edit Notes Overlay" popup appears | Floating overlay over the score; also right zone/lower zone panels and secondary toolbar in Write mode | N/A, no phone version exists | Overlay floats over score, doesn't fully obscure it (vendor blog); one user reported the overlay is hard to reposition without Apple Pencil (comment) | Vendor blog: [Edit notes using the overlay](https://blog.dorico.com/2021/08/tip-edit-notes-using-the-overlay-in-dorico-for-ipad/); Steinberg docs: [steinberg.help](https://www.steinberg.help/r/dorico-for-ipad/6.1/en/dorico/topics/write_mode/write_mode_note_input/write_mode_tuplets_inputting_t.html); App Store listing confirms iPad/Vision-only: [apps.apple.com](https://apps.apple.com/au/app/dorico-compose-music/id1556625090) |
| **Notion Mobile (PreSonus)** | Phone-capable (iPhone, iPad, Android) | Tap to select; drag up/down to transpose pitch; drag left/right to change accidental; tap a duration icon in a menu for rhythm | Context menu on selection; duration menu separate; crosshairs shown during pitch-drag | NOT ESTABLISHED, vendor states the UI "adapts" but no explicit portrait-phone walkthrough found | Crosshair visual guide during drag (review) | iPhone support: [Gearspace thread](https://gearspace.com/threads/presonus-notion-for-ios-adds-iphone-support.1022119/); walkthrough: [ipadmusiced review](https://ipadmusiced.wordpress.com/2022/12/25/notion-mobile-what-a-feat/); vendor: [presonus.com blog](https://www.presonus.com/blogs/home/notion-mobile-is-here) |
| **StaffPad** | Tablet only, Apple Pencil required | Handwriting recognition is the sole input; long-touch on a bar opens a measure-level menu | Handwritten directly on the paper; contextual bar menu; no per-note popover | N/A, no phone version | Bar in focus shown via coloured staff lines (green focus, orange recognition error) | Review: [Scoring Notes, StaffPad for iPad](https://www.scoringnotes.com/reviews/staffpad-for-ipad/) |
| **Symphony Pro** | Phone-capable (iPhone and iPad) | Tap notehead to move cursor; long-press to edit; long-press drag for region select; double-tap opens a Note Adjust Menu | Context menu above the note; floating Note Adjust Menu with navigation arrows; deeper edits in a Note Properties dialog | **Yes**, vendor manual documents distinct iPhone and iPad layouts and portrait/landscape adaptation | Menus overlay the score without obscuring it (vendor manual) | Vendor manual: [symphonypro.net/manual](https://symphonypro.net/manual) |
| **MuseScore (mobile)** | NOT ESTABLISHED as a true mobile note-editor | NOT ESTABLISHED | NOT ESTABLISHED | NOT ESTABLISHED | NOT ESTABLISHED | Developer statement that no mobile editing app exists (2021): [musescore.org](https://musescore.org/en/node/302548); "MuseScore Studio for iPadOS" listing returned 403, capability unconfirmed: [musescore.org](https://musescore.org/en/node/381423) |
| **Newzik** | Phone-capable (iPad, iPhone, Web) | Not applicable, no note editing in-app | Annotation tools on the score surface | Not applicable | Not applicable | Vendor: [newzik.com/en/app](https://newzik.com/en/app), which directs users to notation software for transposition |
| **forScore** | Phone-capable, functionally a reader | Not applicable, PDF reader with annotation | Annotation tools over the PDF | Not applicable | Not applicable | Vendor: [forscore.co/twelve](https://forscore.co/twelve/) |
| **Komp / Komp Create** | Tablet only (iPadOS 16.4+) | Tap or circle with Pencil to select; drag note up/down for pitch; trash icon deletes | Floating radial menu; fixed right-side tool rail; deliberately minimal | N/A, no phone version | Drag-in-place editing keeps the score visible | Review: [Scoring Notes, Komp](https://www.scoringnotes.com/reviews/komp-beautiful-ambitious-new-scoring-app-ipad/); listing: [apps.apple.com](https://apps.apple.com/us/app/komp-create/id1103355632) |
| **Flat.io mobile** | Phone-capable (iOS, Android) | NOT ESTABLISHED in detail; a "note toolbar" with duration/ornament controls is shown | A note toolbar; fretboard editing for tab | NOT ESTABLISHED | NOT ESTABLISHED | Vendor: [help.flat.io](https://help.flat.io/en/general/mobile-app/); [blog.flat.io](https://blog.flat.io/amplifying-creativity-on-the-go/) |
| **Soundslice** | Touchscreen interface auto-activates; explicit phone support NOT ESTABLISHED | Tap a note, then tap a key on an on-screen piano or fretboard to change pitch | **Bottom-docked overlay**: 88-key piano (pannable, centred on middle C) plus buttons for duration up/down, dot, enharmonic, delete, convert-to-rest | NOT ESTABLISHED for phone-sized portrait | Score stays visible; the keyboard is an overlay, not a takeover | Vendor docs: [soundslice.com/help, tablet interface](https://www.soundslice.com/help/en/creating/basics/255/tablet-interface/) |
| **Enote** | Phone-capable | Not applicable, reader/annotation app | Drawing and highlighting tools | Not applicable | Not applicable | Listing: [apps.apple.com](https://apps.apple.com/us/app/enote-sheet-music-app/id1539408514) |
| **NotateMe (Neuratron)** | Phone-capable, vendor states tablets and smartphones | Handwriting recognition, finger or stylus; some drag-and-drop | NOT ESTABLISHED | NOT ESTABLISHED | NOT ESTABLISHED | Vendor: [neuratron.com/notateme.html](https://www.neuratron.com/notateme.html) |

Surfaced but not investigated within budget (all cells NOT ESTABLISHED):
Notation Pad, MusicPad, NoteAbilityPro, MusicJot.

## Patterns

1. Two dominant selection models, split by input method: tap-to-select with
   a contextual menu at or near the note (Dorico, Symphony Pro, Komp,
   Notion Mobile), and handwriting recognition with no per-note popover at
   all (StaffPad, NotateMe).
2. A distinct third pattern: the bottom-docked instrument keyboard.
   Soundslice keeps a persistent bottom control bar under a score that
   stays visible. Closest existing pattern to "controls live off the
   paper" as a permanent zone.
3. Manipulate-in-place: Notion's drag-to-transpose and drag-to-shift
   accidental, Komp's drag-note; pitch changes by touching the note
   itself.
4. Portrait editing on a PHONE is confirmed for exactly one app in this
   survey: Symphony Pro. Notion Mobile is a plausible second, NOT
   ESTABLISHED at the same confidence.
5. Several famous "mobile score" apps are not editors at all: forScore,
   Newzik, Enote. Their annotation UX is not evidence for note-editing UX.
6. The professional-engraving-grade editors (Dorico, Komp, StaffPad) have
   not shipped a phone form factor at all. Little precedent exists for
   portrait-phone note editing at high engraving fidelity.

## NOT ESTABLISHED, cross-cutting

Touch-target sizing was documented by no vendor surveyed; auto-pan and
zoom-during-edit behaviour is unestablished for nearly every app; MuseScore
mobile's current editing capability is unknown (one key page returned 403).
The survey ran roughly 20 searches and fetches under its budget; the niche
apps listed above are worth a follow-up pass if precedent-hunting
continues.


## Finale, the desktop template. Desk-authored addendum, same day

Finale is absent from the survey above by scope: the survey covered current
mobile and tablet apps, and Finale is a desktop application that MakeMusic
sunset in August 2024, ending development and sales and steering users to
Dorico. It is present in this project as the ruled interface template, and
the desk verified its grammar against the archived manuals in the same
session, separately from the survey:

- **The Speedy Entry editing frame**: a frame around one measure holding a
  vertical insertion bar and a horizontal pitch crossbar; arrow keys walk
  the bar; a duration digit at the bar changes that note in place; a digit
  with no pitch enters a rest; delete removes the entry; Option+2 through 8
  makes duplets through octuplets; 9 respells enharmonics. The z-axis
  magnification in Ilya's loupe is Dann's own extension; the manuals show a
  flat frame.
- **The two-tier tuplet grammar**: quick counts (Speedy's Option+2..8) and
  the Tuplet Definition's rhythmic half, "N of [value] in the space of
  M of [value]", with a save-as-default. The dialog's appearance half is
  not replicated; engraving answers to Gould in this project.

Sources: MakeMusic sunset announcement
(https://www.makemusic.com/press-room/press-releases-2024/makemusic-sunsets-finale/),
Scoring Notes report
(https://www.scoringnotes.com/news/makemusic-ends-development-and-availability-of-finale/),
Speedy Entry Tool, Finale 2012 Mac manual
(https://usermanuals.finalemusic.com/Finale2012Mac/Content/Finale/ID_MAINTOOL_SPEEDY.htm),
Editing with Speedy Entry, Finale 2010 Mac tutorial
(https://usermanuals.finalemusic.com/Finale2010Mac/Content/Finale/Tutorial_1b_Speedy_Entry4.htm),
Tuplet Definition dialog, Finale Mac manual
(https://usermanuals.finalemusic.com/FinaleMac/Content/Finale/TPDLG.htm),
Simple Entry Tuplet Definition, Finale Win manual
(https://usermanuals.finalemusic.com/FinaleWin/Content/Finale/SIMPLETUPLETS.htm).

---

*Desk note, appended at filing: Dann states from his own use that Newzik
also features a bottom-docked control surface; his knowledge supplements
the table's NOT ESTABLISHED cell and is recorded here as his statement.*
