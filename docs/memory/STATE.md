# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

What it names instead is a **FLOOR**: everything described below was true at or
before **`637acc1`**, "N.92: no opening barline, the loupe fits its contents, and more
daylight at the squircle", shipped 2026-09-18, READY, the alias serving it (sw.js stamp
`ilya-1789745706089`, checked by the desk), walked by Dann the same night (the previous floors,
`a86e985`, `fda5b9c`, `8cb9b51`, `7e28272`, `f4e31a2`, `6e98057`,
`fe4d2c7`, `7c596f7`, `aca2dbb`, `76b24a3`, `eb918ed`,
`d6580af`, `8bb406c`, `78f3db8`, `490c12d` and earlier, are in
`../sessions/LOG.md`). A floor cannot go stale,
because further commits only move HEAD forward and never make the floor false.
If the tree is ahead of it, that is expected and tells you only that work has
landed since.

**The ten superseded floors that used to be listed here, `2b81f5a` through
`2d54185`, are in `../sessions/LOG.md`, block 5.** They are closed, and closed
things do not live in this file.

**The push range is the check, not the memo.** A floor that predates its own content
is the stale number this paragraph exists to prevent.

**Ask Dann for the state in one line. You do not WRITE with git, ever.**
Read-only git is allowed under the narrowed CONTRACT §5, ratified 2026-09-13:
`status`, `log`, `diff`, `show`, `ls-files`, `check-ignore`. Asking Dann is
still the courtesy and still the habit.

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

---

## THE ONE THING

> ### READ THIS FIRST. Written 2026-09-20, about 11:30
>
> **N.149 IS CLOSED. WALKED AND ACCEPTED BY DANN 2026-09-20, 11:29.** His words:
> *"Acceptable for now, but later revision needed."* Shipped `6ca97db`, "N.149: the
> loupe's two modes, a segmented pill, and the carets move to Corrections", pushed
> about 01:03, five gates at baseline, six files, 695 insertions and 314 deletions.
>
> **THE FLOOR MOVES TO `c582892`**, alias stamp `ilya-1789921329592`, checked by the
> desk and walked by Dann. **HEAD was `d5e0927` when the session opened**, and the
> morning's five ships were `6ca97db`, `be792b6`, `38dac87`, `dc45966`, `c582892`,
> **every one of them walked.**
>
> **HOW IT WAS WALKED, and the method is new.** Dann declined the phone walk: he had
> no notation file on the phone and said the transfer dysregulates him. **The desk
> drove his own Chrome through the extension and sent him screenshots; he ruled on
> those.** His library and his songs were never altered, nothing was placed, and his
> window size was recorded and restored. **This is a walk. Record it as one, and
> reach for it again when a phone walk would cost him more than it returns.**
>
> #### WHAT THE DESK OBSERVED ON `6ca97db`, in his Chrome, on T05 m. 10
>
> - **The loupe opens on Syllables**, pill on the left with SYLLABLES filled, chevron
>   flush right, **and no carets.**
> - **Corrections draws the carets**, three in that measure, arrowheads inward, and
>   the correction cells are in the loupe.
> - **THE MUSIC DOES NOT MOVE.** `.loupe-window` top is **512.19 px in both modes** at
>   desk width and **355.78 px before and after scrolling** at narrow width. Identical,
>   not approximate. The card grows downward, 374.7 px to 705.8 px.
> - **THE PANEL SCROLLS INSIDE ITSELF AND THE CARD HOLDS.** Scrolling past the duration
>   row reached Tie, Restore and the lyric controls with `.loupe` top steady at
>   304.69 px. **That is ruling 6 of 2026-09-20, observed.**
>
> #### WHAT ELSE THIS COMMIT CLOSED AND DID NOT CLOSE, read in the tree 2026-09-20
>
> - **N.148 IS CLOSED, inside `6ca97db`.** The Drawer's `stackActions`, `undoLabel`,
>   `onundo` and their CSS are gone from `Drawer.svelte`, and Undo appears in the
>   loupe's bar after a correction. It was ruled to ride with N.149 and it did.
> - **N.150 IS NOT BUILT.** `i18n.ts:59` `group.scoreMarkup` still reads
>   `{ en: 'Score markup', fr: 'Score markup' }`. The band did not become Voice.
>   **It is the orphaned third of the trio.**
>
> #### N.150 IS CLOSED, AND SO IS THE REST OF N.149. Shipped `c582892`, walked 12:29
>
> **Corrections has LEFT the drawer**, the band is **Voice / « Voix »**, and the
> corrected-count sentence is gone with `correct.count`, `correct.countOne`,
> `correct.state` and `correct.stateOne`. Walked by Dann on desk-driven screenshots
> in both languages.
>
> **« VOIX » IS RATIFIED, 2026-09-20.** He saw it on screen and said *"It looks
> good."* Adopted, not coined.
>
> **THE DOUBLING IS NOT A DEFECT. RULED BY HIM, 2026-09-20.** The band header reads
> VOICE and the line under it reads "Voice: Dann"; in French, VOIX over
> « Voix : « Dann » ». **The desk raised it as a finding and proposed stripping the
> label from `calib.anchor.named` and `calib.anchor.uncalibrated`. He looked and
> asked what the issue was.** *"It looks good."* **The proposal is WITHDRAWN and the
> strings stand. DO NOT RE-RAISE IT.**
>
> **What he ruled on was the BAND. The drawer's TAKEOVER doubles the word too**
> (`Drawer.svelte:850` the band name, `:853` `voice.heading`), and that surface was
> never put to him and is still unexamined. **It is hidden until Calibrate is
> pressed.** Whether his ruling covers it is NOT ESTABLISHED; do not assume either way.
>
> **THE GATE MOVED, with his permission, per `ENVIRONMENT.md:533`:** web-test
> 1265 to 1263. Backup `ilya-ship.sh.bak-1265-2026-09-20`. **The deletion was
> verified off `git diff`, not off the build report**, which had said two tests when
> three left and one arrived; the third's assertion survives inside the new one.
>
> #### `OWED.md` EXISTS AS OF 2026-09-20, ON DANN'S RULING
>
> **`STATE.md` went 1,141 lines to 547 and is under its own 600-line tripwire for the
> first time.** The tripwire's premise had stopped holding: what was left was not
> material that had failed to move to `LOG.md`, it was long-lived OPEN material that
> cannot move, because nothing in it has closed.
>
> **What left, verbatim:** §OWED, RULED BUT NOT YET DONE; §RULINGS DANN OWES with its
> three subsections; §STILL UNSETTLED; and the retired register's live rows.
> **What stayed:** the one thing, the tracker, the schema, the fixture.
>
> **`README.md` carries it** in the read order as item 8, in the lifespans table, and
> in the closing ritual. **Four live citations were repaired** in `SCHEDULE.md` and
> `SEQUENCE.md`; the dated historical ones in `INBOX.md` and `ENVIRONMENT.md` were
> left, because rewriting a record of what was read on a given night falsifies it.
>
> **AND A TRAP WAS FOUND IN THE RITUAL ITSELF, now written into `README.md`:** moving
> a closed item's account to `LOG.md` can carry Dann's rulings into the archive, which
> the README itself calls not authoritative. **Six of his rulings went that way in one
> pass today and were caught only because the next move was checked first.** Grep each
> ruling before moving an account.
>
> #### OWED AT THE NEXT CLOSE, and it was deferred on purpose
>
> **N.148's and N.149's accounts have NOT moved out of `OPEN.md` into `LOG.md`.** They
> are marked CLOSED in place at the head of their section, so nothing reads as open,
> **but the section covers three items with N.150 still open, and the spacing table
> inside it belongs to N.153.** The split wants care. Give it its own LOG block.
>
> #### THE NEXT ONE THING IS NOT RULED. DESK DEFAULT, and he can wave it off
>
> **DESK DEFAULT: N.150, to finish the trio.** It is small, it was ruled to ride with
> N.149, and it is now the only unbuilt third. **Then week 2 opens on N.129**, because
> `SEQUENCE.md` dependency 1 puts the ruler correction before every piece of
> horizontal spacing work, **and N.153 stage 3's derived spacing is horizontal spacing
> work.** Whether N.153 stages 2 to 5 may proceed ahead of N.129 is **NOT ESTABLISHED
> and is a real sequencing question**, not a formality.
>
> #### RULED BY DANN 2026-09-20, 11:31, AFTER THE WALK. BUILD OWED
>
> **THE CHOSEN PILL SEGMENT TAKES A LAVENDER FILL.** His words: *"The active portion
> of the Syllable/Corrections pill should have a lavender fill to reinforce to the
> user which mode they are in."* Today it is `--paper-cream`, the card's own ground
> (`Loupe.svelte:2660-2663`), so the chosen segment is barely marked.
>
> **THIS ADDS A SECOND COLOURED THING TO THE LOUPE**, against his ruling of
> 2026-09-17 that the squircle is the one coloured thing. **The later ruling stands;
> the older one is the reason the fill is a tint rather than full weight.** DESK
> DEFAULT, his to overturn with a word: `--lavender-desk` (#D5CEDA, lavender at 60%,
> `app.css:149`) rather than `--lavender` (#9585A2, `app.css:56`).
>
> **REFINED BY HIM 11:33, and it changes the rule:** *"on open state neither half
> should bear colour. Selecting the mode gives it colour. When the accordion is
> retracted there is no colour."* **The desk read it back as three states and he
> answered "correct": panel retracted, neither half coloured; panel open, the current
> mode's half takes the lavender; retract, the colour goes. So THE FILL MARKS AN OPEN
> PANEL, NOT A MODE**, gated on `mode === m` AND `syllablesOpen` (`Loupe.svelte:2432`,
> `:145`). `aria-selected` and the roving tabindex stay on `mode === m` alone.
>
> Brief: `../sessions/brief-n149-pill-lavender_r2_2026-09-20.md`. **Revision 1 is
> superseded and wrong; it tied the fill to the mode.**
>
> **RULED 2026-09-20 11:54, AFTER WALKING `be792b6`. THE CARET GATE MOVES, and it
> overturns a desk default.** His words: *"retracting the panel should restore the
> measure to its opening state appearance. The carets are unique to the Corrections
> mode. When Corrections is active we should see carets. When Syllables is active or
> the Loup is in open state, we should not see carets."* **The desk had observed the
> carets staying up on a retract and chose to leave it; he ruled against that.**
> `Loupe.svelte:1393` gains `&& syllablesOpen`, so **the carets and the pill's fill
> become one condition.** Amendment 5c in the r2 brief.
>
> **BUILT AND WALKED 2026-09-20, shipped `38dac87`.** Verified in his own Chrome on
> T05 m. 10, by identity rather than by eye: **`.loupe-window`'s `innerHTML.length` is
> 28031 in all three caret-free states** (raised and retracted, Syllables open,
> retracted from Corrections) **and 29833 with Corrections open.** Character for
> character, so "restore the measure to its opening state appearance" is the same
> drawing, not a resemblance. Body paths and lines go 1 and 41 to 7 and 44 and back.
> **Dann said "let's ship" on seeing it.**
>
> **AND THE CARETS ARE COUNTABLE AFTER ALL**, which closes the hole where both Code
> and the desk reported zero from a class selector: a caret is two arrowhead `path`
> elements plus one stem `line`, so `(paths - 1) / 2` gives three on this measure.
> Recorded in `ENVIRONMENT.md`, `THE CARETS CARRY NO CLASS`.
>
> #### THE ONE FINDING FROM THE WALK, HIS, AND DEFERRED BY HIM
>
> **THE DURATION ROW WRAPS: the dot and Tuplet drop to a second row.** Seen at 555 px.
> **Dann ruled it acceptable for now and said a later revision is needed.** It is
> UNNUMBERED: he deferred it, he did not rule it in. **By the freeze rule of
> 2026-09-16 it is LATER** (it tells a singer nothing false and loses no work).
> Number it only when he says so.
>
> #### WHAT CODE REPORTED, and every line of it is now DONE rather than WRITTEN
>
, `WRITTEN` ON EVERY LINE OF THE BRIEF'S SECTION 6
>
> Measured at 390 x 844 on T05 in a fresh `[::1]` origin, Dann's library untouched.
> The music's top is **290.1 px in all four states** on the phone and **389.5 px** on
> the desk at 1440 x 900. **0 carets in Syllables across all 64 tappable measures; 17
> in Corrections on m. 9.** `tsc` clean, 1,265 web tests pass. The Score Markup header's
> Undo and Redo are retired and the phone dock is gone.
>
> **The card now hangs from the music's top; the panel region grows downward with a
> DERIVED height**, the room between the music's bottom and the viewport foot less 8 px:
> 358.1 px on the phone against 545 px of Corrections content, so it scrolls inside
> itself; 207.7 px against 449 px on the desk.
>
> #### CODE'S NOT ESTABLISHED LIST, none of it ruled, all of it for the walk
>
> - **The correction cells are cramped**, about 322 px against the dock's 366, so the
>   duration row wraps and the dot and Tuplet drop to a second row. The 44 px floors
>   hold. **Dann's eye.**
> - **The desk gets only a 207.7 px window** because the anchor sits at page centre.
>   A higher anchor gives more room and is a taste call.
> - **A swipe inside the panel now scrolls it and does not dismiss the loupe.** Clause
>   14 ruled that dismissal stays live by Escape, swipe and chevron. **Whether this
>   breaks that ruling is NOT ESTABLISHED and is a walk question.**
> - **Landscape phone is untested.** The 380 px left inset for the dock is gone.
> - **`CorrectionSurface`'s `dock` variant now has no mount.** The code is left in
>   place; removing it is its own decision.
> - **The drawer's Corrections station is untouched**, so both copies exist on the desk.
> - **Of measure numbers 8 to 89, only 64 carry hit rectangles.** Whether the other 18
>   are empty measures is NOT ESTABLISHED.
>
> #### DESK DEFAULTS OF THIS SESSION, all reversible, all free for Dann to wave off
>
> - **READING IS RETIRED**, leaving two modes. Clause 14 of 2026-09-18 ruled three
>   states with Reading opening (`OPEN.md:1878`); the rulings of 2026-09-20 refine it
>   (`OPEN.md:1380`). **He has not ruled on the retirement.**
> - **The library is never touched for a measurement.** Code was told to answer
>   *Replace this song* with neither and to measure in a fresh origin. Standing.
> - Segment tap opens the panel; the chevron takes the current mode's name; the pill
>   reuses `a11y.tabs`. No new strings and no new French.
>
> #### CORRECTED THIS SESSION
>
> **The "18 measures" figure is NOT T05's.** It belongs to the fixture the 27
> collisions were counted on, which this file already records as NOT ESTABLISHED.
> **T05 carries measure numbers to at least 88.** The desk wrote 18 into a brief and
> Code caught it.
>
> #### OPEN AND UNBUILT
>
> - **N.153 stages 2 to 5.** Stage 2's brief is written and unbuilt:
>   `../sessions/brief-n153-s2-data-channel_r1_2026-09-20.md`. **It carries a finding
>   worth keeping: `page-layout.ts:180-182` resolves the clef ONCE for the whole score,
>   with the comment that a slice-level heuristic could flip clefs between systems, so
>   the loupe's one-measure slice must be handed the resolved clef or it can draw a
>   different clef from the page.**
> - **The tween, deliberately unnumbered.** N.149 shipped as an instant swap.
> - **`STATE.md` is over its own 600-line tripwire.** It was 930 lines at this
>   session's open. Something failed to move to `LOG.md`.
>
> ---
>
> ### Three superseded closes moved to `../sessions/LOG.md` block 26 on 2026-09-20
>
> **The closes of 2026-09-18 (04:00), 2026-09-19 (22:00) and 2026-09-19 into
> 2026-09-20 (00:20).** Each still asserted a floor and a one thing that today's
> close makes false, which is exactly what this file's own rule exists to prevent.
> **The walk of 2026-09-19 into 2026-09-20 stays below: it still holds live items.**
>
> ### THE WALK OF 2026-09-19 INTO 2026-09-20. Sixteen items, all on T05
>
> **READ THIS BEFORE THE LIST. DANN'S OWN FRAMING, 2026-09-20:** *"most of my notes will
> be obviated by our new understanding of the carets/spacing conflation. That's why I'm
> pushing to work on the two modes and the tweening between them."*
>
> **He is right, and it collapses the list.** Nearly every spacing complaint on this walk
> is one fault seen from several angles: **the loupe has no mode gate, so it shows
> Corrections' spacing and calls it the default.** The padding he kept finding is room
> reserved for carets in a view that should not have carets at all. **So do not build
> against the individual spacing complaints. Build the two modes, and they go.**
>
> **What the mode split does NOT fix, and these are the live items:** the tie-or-melisma
> question on m. 31 and mm. 40-41; the glyph overlap on m. 22; the loupe vanishing; the
> incoming tie meeting the sharp on m. 45; and the tacet run's missing hit rectangle.
> Everything else in the list below is either a ruling to build or a symptom of the
> conflation.
>
> **THE DOCUMENT IS T05**, `Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and
> fell.musx`, Marshak's Sonnet 153. **NOT Sunless 01**, which is what Code's stage 1 scan
> used. Keep the two apart: stage 5's acceptance scan must run on the document the 27
> collisions were counted on, and which that is remains NOT ESTABLISHED.
>
> #### The twelve rulings of this walk moved to `OPEN.md`, THE CARET, on 2026-09-20
>
> **Verbatim, under the heading THE LOUPE'S TWO MODES.** Six of them lived only here,
> and a ruling that lives only in a close block is one rewrite from gone. **They are
> all built as of `c582892` except the tie's tapered run-on, which is N.153's.**
> #### DESK FINDINGS, each read this session
>
> - **A tacet run carries no hit rectangle**, so a tap on a multibar rest resolves to the
>   NEAREST event that has one. The renderer emits one `data-hit` per event
>   (`staff-renderer.ts:2662`, `:2936`) and `:1600` says a tacet run is a column, not an
>   event. **Dann's two shots are the control: m. 28 gave the measure after, m. 49 the
>   measure before.** Nearest, not next.
> - **Nothing suppresses a caret for want of room.** `Loupe.svelte:1529` pushes a mark on
>   every branch; the `MIN_SPACE` paths at `:1496` fall back to the bare stroke and at
>   `:1505-1514` nudge the barline outward. So "the gap was too tight" never explains an
>   absent caret.
> - **The loupe sacrifices its TOP when the open card is too tall for its room.**
>   `centreOnPage` (`loupe.ts:869-883`) clamps between `lowest` and `highest`, and when
>   they conflict `Loupe.svelte:2183` takes `Math.min(centreY, lowest)`. The music is at
>   the top. **This is what put the card under the browser chrome on m. 57**, and option B
>   removes the conflict rather than retuning it.
> - **THE TIE PREDICATE EXISTS. The record saying it does not is STALE.** `pairings.ts:304`
>   computes `continuesTie` off the PREVIOUS note's `tied.type`, and `:372` states
>   *"a tie's continuation may never begin a syllable."* Both parsers populate `tied`
>   (`musicxml-parser.ts:633`, `mnx-parser.ts:724`). **And the `.musx` path does not parse
>   slurs at all** (`mnx-parser.ts:23`).
>
> #### OPEN FROM THIS WALK, none of it ruled
>
> - **m. 31 and mm. 40-41: a sustained note carries a vowel with no Cyrillic under it.**
>   Dann reads them as ties; the underlay draws the melisma extender, which
>   `OPEN.md:886-887` calls the melisma's own mark. **The two have opposite correct
>   answers** (`OPEN.md:850-851`). **Settle by reading `data-tie` / `data-slur` off the
>   rendered page, never from the picture** (`OPEN.md:892`, which this project already
>   learned on m. 84 and m. 87 of this same score). **If they are ties, N.142 step 2's
>   count is not zero and that build is unblocked** (`OPEN.md:1258-1261`).
> - **m. 22: two IPA glyphs overlap at one x.** The desk first called the `o` on the
>   melisma note a defect and **withdrew that**: a melisma's continuation is a new sounded
>   event, so the vowel is by design. Only the overlap is unexplained. **Dann was asked to
>   look at m. 22 on the page and had not reported back.**
> - **The loupe stopped appearing entirely at 23:31**, while the selection ring still drew.
>   Suspect is the same position arithmetic. **Reload result not reported.**
> - **m. 45: an incoming tie collides with the first note's sharp.** The head's carry panel
>   has no clearance rule against an accidental. Wants a quantity in stave spaces.
> - **The tacet-run practice, proposed by the desk and NOT ruled:** a tacet run is always
>   tappable and raises the loupe on itself; the loupe names its span in words, not only
>   the numeral; and the count carries its provenance where the singer asks for it. **The
>   argument is that a wrong multirest count is the one read error a singer cannot
>   discover**, which puts it inside the freeze rule's own exception.
>
> ---
>
> ### LIVE CARRY-OVER FROM EARLIER CLOSES
>
> In `OPEN.md`, section "LIVE CARRY-OVER FROM STATE.md". Open it when one of those comes up.

## THE ONE THING FOR THE NEXT THREAD: N.129, THE RULER

**Set at the close of 2026-09-20, when N.148, N.149 and N.150 closed together.**

**What `SEQUENCE.md` says, and it is SEQUENCE's claim rather than a reading of the
tree:** N.129 is dependency 1 and comes before every piece of horizontal spacing work.
`underlay-widths.ts:690` declares its table as Source Serif 4 metrics while the page
has drawn Source Sans 3 since the paginator began stripping the serif root, about
**12.2%** out on one measured word (**corrected 2026-09-20 from "about 5%", measured
on `e75d6f3`; see `OPEN.md` §N.129**). **N.153's derived spacing is horizontal spacing work, so it
sits behind this.**

**NOT ESTABLISHED: none of those files was opened on 2026-09-20.** The next thread
opens them before it writes a brief, per tether 21.

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

**The specs these marks point at live in `OPEN.md` from 2026-09-13.** This
section carries the marks; that file carries the items.

**AND THE ORDER THEY ARE BUILT IN LIVES IN `SEQUENCE.md` from 2026-09-15.** This
section says what is open; that file says what comes first and why. **Six
dependencies fix the order and everything else floats**; the rest of this file
does not repeat them.


### Numbered 2026-09-20

- `[ ]` **N.156. The Sunless 01 fixture is missing its final syllable and a note.**
  Numbered 2026-09-20, **ruled in by Dann at 14:21**, who chose the real fix over
  retagging «ка». **Found by N.155's line-end hyphen on the first page it was drawn on.**
  The Lamm scan sets «о-ди-но-ка-я» on five notes; the fixture has four and never closes
  the word. **A second defect rides with it: lyric lines 1 and 2 disagree about
  «непроглядная» from measure 4 and line 2 lags by one note at the end.** Brief
  `../sessions/brief-n156-sunless01-fixture_r1_2026-09-20.md`.

- `[x]` **N.129. The underlay is spaced in the wrong font's metrics, and hyphens are
  never omitted. CLOSED 2026-09-20, both steps walked.** Step 1 shipped `e75d6f3`, the
  Cyrillic underlay drawing in the face its widths were measured from; Dann walked it in
  a browser and in print (*"it looks fabulous"*). Step 2 shipped `7bd3d04`, the omission
  removed and a word-internal gap reserving `HYPHEN_GAP_PX`; Dann walked it on
  « неп-рог-ляд-на-я » in Without Sun no. 1 and passed it. **The face ruling and the
  reading-versus-instrument rule are in `OPEN.md` §N.129.** Brief
  `../sessions/brief-n129-underlay-ruler_r2_2026-09-20.md`, memos
  `../sessions/memo-n129-underlay-ruler_r1_2026-09-20.md` and
  `../sessions/memo-n129-step2-hyphens_r1_2026-09-20.md`.
- `[ ]` **N.155. A word broken across a system takes a hyphen at the line end.** Numbered
  2026-09-20, DESK DEFAULT number. **Design proposed by the desk, ruled in by Dann** at
  14:07. It is the last case of his hyphen ruling of 2026-09-14. Spec in `OPEN.md`.
  **Two things are his and unruled: where the hyphen sits horizontally, and whether a
  melisma extender crossing a break wants the same.**

### Numbered 2026-09-16

- `[x]` **N.146. Ilya tells a poem from a score itself, for a PDF or a picture.** **CLOSED 2026-09-17: walk 5 passed in Incognito; step 2c built nothing (`OPEN.md`, N.146 findings, 9). Spec and account move to `LOG.md` at this session's close.** Numbered 2026-09-16, DESK DEFAULT number; design adopted on Dann's instruction (*"we will go with that"*). Spec `OPEN.md` §N.146. IN. No switch, no new strings (struck by Dann the same night). Brief `../sessions/brief-n146-poem-or-score-detected_r1_2026-09-16.md`. **2026-09-17: steps 1, 2, 2b shipped (`fe4d2c7`, `6e98057`); walk 5 outstanding; step 2c open** (THE ONE THING).
- `[x]` **N.147. CLOSED 2026-09-17.** The syllables moved into the loupe, and a note tap
  only selects. Shipped `55c04d9`, walked by Dann the same evening. Account in
  `../sessions/LOG.md` block 22.
- `[ ]` **N.92. Notation editing.** Numbered by Dann 2026-08-24. Slices 1 to 3 are
  shipped, insertion included. **The caret reach is DRAWN and shipped over six commits
  2026-09-17 to 2026-09-18, and is not usable on a phone: see N.153, which owns that.**
  Open here: the four singer's marks, tie to the note before, and the page flag for a
  measure left over.
  Spec `../sessions/spec-n92-edit-surface_r1_2026-09-17.md`, audit
  `../sessions/memo-n92-edit-audit_r1_2026-09-17.md`.
- `[x]` **N.148. CLOSED 2026-09-20** inside `6ca97db`. Undo and Redo moved into the
  loupe's bar and the Score Markup header's pair is deleted (`Drawer.svelte`, read
  2026-09-20: no `stackActions`, no `undoLabel`, no `onundo`).
- `[x]` **N.149. CLOSED 2026-09-20.** The loupe's two modes, design A's segmented
  pill, and the carets confined to Corrections. Shipped `6ca97db`, walked by Dann on
  desk-driven screenshots the same morning: *"Acceptable for now, but later revision
  needed."* **One finding deferred by him and UNNUMBERED: the duration row wraps, so
  the dot and Tuplet drop to a second row.** Brief
  `../sessions/brief-n149-both-modes_r1_2026-09-20.md`.
- `[x]` **N.150. CLOSED 2026-09-20.** The drawer's band is Voice / « Voix », and
  Corrections left the drawer in the same ship, `c582892`. **« Voix » ratified by
  Dann on screen the same morning.** The key `group.scoreMarkup` is unchanged; only
  its values moved, because `sections.test.ts:67` asserts on `BAND_IDS`.
- `[~]` **N.152. Playback of the Markup.** LATER, its own cardinal, asked for by Dann
  2026-09-17. Spec in `OPEN.md`.
- `[ ]` **N.153. The loupe re-engraves the held measure at its own spacing.**
  Numbered by Dann 2026-09-18. Spec in `OPEN.md`, five stages, each landing on its
  own. **It is what closes the 27 caret collisions**, which are scale-invariant and
  reachable no other way. Account of the stop that produced it:
  `../sessions/memo-n92-loupe-reengraves_r1_2026-09-18.md` §1. **AND IT IS BIGGER THAN
  THAT: measured 2026-09-18, the tap separation between a caret and its neighbour
  runs 1.13 px to 7.89 px at phone width against a 44 px floor, on all 17 measures.
  The insert reach does not work on a phone at all until N.153 lands.**

### Numbered 2026-09-14

- `[D]` **N.141. The squircle has no grammar.** Found by Dann on the walk of
  `d6580af`, 2026-09-14: the ring takes the IPA on one measure and not on three,
  it is trimmed inside the measure region only sometimes, and an accidental of the
  taken note can meet its edge. **Marked `[D]` because two of its three questions
  are his taste, not the desk's:** what the squircle encloses, and whether it may
  extend past the measure's region. The number is a DESK DEFAULT. Spec in
  `OPEN.md`, including the permission to re-engrave the measure for the loupe and
  what that permission costs.

- `[ ]` **N.140. The loupe guarantees a stave space, and scrolls rather than
  shrinking below it.** Dann's own design, ruled 2026-09-14, over the desk's
  recommendation to do nothing; both cases are recorded in `OPEN.md`. **A
  phone-portrait item:** the desktop branch already derives its magnification to
  hit a 12 px target (`Loupe.svelte:152`, `:686-691`), and Dann reads the loupe
  well on his desk. **He owes two things: the floor in CSS pixels, and whether
  the scroll may take a gesture on a surface where the swipe dismisses and the
  tap places a syllable.**

- `[ ]` **N.136. Open syllabification never reaches Score markup's drawn text.**
  Found by Dann on the N.118 walk: the toggle moves, and neither the Cyrillic
  nor the IPA on the page changes. Spec in `OPEN.md`. **Not a regression from
  N.134 or N.118**; those made a partial gap total.
- `[ ]` **N.135. The page reader reads the text underlay.** Ruled by Dann
  2026-09-14. Cost measured the same night in
  `../sessions/memo-n135-ocr-measurement_r1_2026-09-14.md`. Spec in `OPEN.md`.

### Numbered 2026-09-13

- `[ ]` **N.130. Insights has no French.** About 58 entries at `i18n.ts:1417-1475`,
  all English in both languages, found while checking the loupe's undo clauses.
  **Belongs in the release cut's IN bucket:** the ruled release sentence names
  Insights, and a document in the wrong language is wrong rather than
  half-built. Spec in `OPEN.md`. **THE DESK DRAFTS THE FRENCH AND DANN RULES ON IT, ruled 2026-09-19**, superseding *"Dann owes the French; nothing is coined"*. His words: *"I prefer to have you suggest translations that I can react to. That saves me cognitive bandwidth."* **So never hand him blank slates.** Draft from the French already in the file, say which entries the glossary came from, flag the choices that are genuinely his, and let him ratify, edit, or decline. **Nothing reaches the tree until he ratifies it**, which is the one clause of the old rule that survives. **BUILT 2026-09-19: all 59 Insights entries are French** (`71ae880`), drafts and rulings in `../sessions/insights-french_r1_2026-09-19.md`. **UNWALKED.** **AND THE ROW'S OWN RANGE WAS WRONG: only 12 of the 59 sat in `:1417-1475`; the other 47 ran `:1476` to `:1522`.** A brief written to the cited range would have fixed twelve strings and reported Insights done.
- `[ ]` **N.132. The ratified names are not built.** `Text`, `Markup`, `Melody`,
  ruled 2026-09-13 in both languages, and the tree still says "Transcription" and
  "Score markup" (`i18n.ts:106`, `:117`, `:59`). **Found because Dann walked the
  colour deploy and read the tabs.** Carries the ruled tab padding of 0.5 rem,
  which nobody has seen on screen. Spec in `OPEN.md`.
- `[ ]` **N.131. French parity everywhere else.** The 64 or so untranslated
  entries outside Insights. **DESK DEFAULT on splitting this from N.130, and Dann
  can merge them with a word:** the two differ in urgency, and one number would
  bury the release-blocking half. **Its real size is NOT ESTABLISHED** until a
  triage separates the genuinely untranslated from the words that are identical
  in French on purpose. Not release-blocking. Spec in `OPEN.md`.

### THE BLOCKING SET IS EMPTY, 2026-08-21

**Nothing blocks the beta.** N.67 (the save function) CLOSED WHOLE 2026-08-18;
N.72 (no singer can ever receive a fix) CLOSED 2026-08-21; N.58 (MIDI import)
DEFERRED TO FUTURE DEVELOPMENT by Dann 2026-08-21; N.59 (the reader in the
browser) PARKED AT TIER 2, answered no, 2026-08-18. **The four rows with their
full accounts moved to `../sessions/LOG.md` block 10 at the close of
2026-09-10 late.** Still open inside them and carried here: N.59 step 3, the
brace rule, is `WRITTEN` and not `DONE`; a singer on Chrome for iPhone can
never install Ilya to the home screen (Dann to rule).

> **The "Closed and parked" table (N.80, N.81, N.79, N.62, N.63, the colon audit, N.78, N.70, N.71, N.68, N.55b, N.56, N.32, N.55a, N.47, N.69) moved to `../sessions/LOG.md` block 9 at the close of 2026-09-10.** All closed or parked; nothing in it is open.

### The visible list. Built only if a day finishes early

~~**N.62**~~ (now THE ONE THING, 2026-08-23) · ~~**N.63**~~ (closed 2026-08-23) ·
**N.45's remainder** · ~~the **French colon spacing**~~ (closed as the colon
audit, `9d314de`) · **N.51** · **N.17** · **N.19** · **N.61** · **N.6** · and,
unnumbered, **the watch band's English header** (`watchlist.ts:92`, printed
in French mode; Dann to rule).
**N.27 now has a home, and the recommendation is IN THE TREE** as a comment at
the reporting seam (`library.ts`, `Library.save`), recorded by N.67 step 6 and
deliberately not built: when N.27 is built, `profileStore.saveStore`
(`profileStore.ts:217-225`, which the step 6 brief cited as `:216-224`) routes
through that seam. It is the last catch-and-drop of its kind in the tree.
**N.28** ships on N.67's step 5 binder.

---


> **Five sections moved to `../sessions/LOG.md` on 2026-09-01, Dann's ruling.**
> The N.67 document list, the E.54 and 2026-08-16 ruling records, the N.67
> step 4 split, and the second-score measurement. All verbatim, block 4.

## OWED, and the rulings Dann owes, moved to `OWED.md` on 2026-09-20

**Both sections, with their three subsections, are verbatim in `OWED.md`.** They are
open and not moving, which is why they are no longer here.


## THE SCHEMA. It has survived ten sessions

1. Only blocking work gets built.
2. **A new cardinal displaces a named one or waits. Say which.**
3. Half of every build day is reserved for what the previous day's walk found.
4. Every build day ends in a deploy and a walk.
5. N.48 may be unclosable; it needs a `[u]` that fails.

---

## THE FIXTURE. Read out of the file, do not re-derive it

`~/Downloads/no-lyrics-control.musicxml` is the only instrument that exercises
the no-underlay path; all three of Dann's own scores carry lyrics.

**It holds five pitched notes and one half rest:** C4 D4 E4 F4 quarters, G4 half,
then a half rest. **It is NOT six notes.** Its stripped lyric line was five
syllables, «Я тебя любил». **Its header title is a different text from its lyric
line.**

**The walk, four steps.** Transcribe some Russian, or the queue is empty and
nothing draws. Switch to Fit **before touching any file input.** Upload the
control, press *Continue to analysis*. **Expect `5 / 5`, syllables under the
notes, the rest bare, no dashed boxes.** Walked and confirmed 2026-08-13.

**This same walk is N.67 step 3's observation**, with the expectation stated
before the walk: re-uploading the control over placed syllables no longer erases
them.

**The print fixture, E.51.** Marshak's Russian of Shakespeare's Sonnet 90, under
Kabalevsky op. 52 no. 9, fourteen lines. **It fills exactly two letter sheets.**

---

## RULED 2026-08-16, ON E.55'S WALK FINDINGS

- **The walk's findings come before N.67 step 4**, per the schema's own rule
  that half of every build day is reserved for what the previous walk found.
- **N.70 and N.71 are numbered. The third finding, no cursor on a note, is
  FOLDED INTO N.71** rather than tracked: one CSS declaration on the same
  element as N.71's fix.
- **N.55b's row is corrected rather than left tidy**, Dann's words.
- **The N.70 fix is Dann's own third option**, better than either I posed:
  filtered on desktop, no `accept` at all on iOS. Named consequence, accepted:
  the tree's `isMobile` is a WIDTH test, so a narrow desktop window also gets
  the unfiltered picker.

## STILL UNSETTLED and the retired register's live rows moved to `OWED.md` on 2026-09-20

**Verbatim.** Same reason: open, and not moving.



---


---
*Split 2026-09-01; backup `STATE.md.bak-2026-09-01`. The closing colophons of
2026-09-10 to 2026-09-17 (early morning) moved to `../sessions/LOG.md` block 21 at the
close of 2026-09-17, about 02:00.*

*Close of 2026-09-17, about 02:00. N.146 steps 1, 2, and 2b shipped (`fe4d2c7`,
`6e98057`); step 2c under investigation by Code. Findings 1 to 8 of the N.146 walk moved
to `OPEN.md`; the Howell extraction and the previous close's standing-rules paragraph
moved to LOG block 21. `PRODUCT.md` gained "Why Ilya exists"; `ENVIRONMENT.md` gained
`THE ALIAS CHECK THAT WORKED` and `THE EXTENSION CANNOT SEE HIS TAB`; `SCHEDULE.md`
gained the per-format samples. The floor moves to `6e98057`. Memory NOT committed.*

*Close of 2026-09-19, about 22:00. Seven commits, `02dd6d2` to `438f08f`, all
pushed, none walked, so the floor stays at `637acc1`. The ILYA REGISTER is retired
and project knowledge now holds no canon. Insights and N.131's real 25 are French;
N.130's recorded range was wrong and is corrected. The held measure's page mark is
gone and clause 16 is closed. The desk drafts the French from now on, ruled by Dann.
`SCHEDULE.md` gained N.154 and gated N.84 on it; `ENVIRONMENT.md` gained the
transfer fault; `INBOX.md` gained two N.84 notes; `OPEN.md` closed clause 16. The
twelve-versus-five gaps count is reconciled: five remain, and seven were located.
N.153 was not touched. Memory NOT committed.*
