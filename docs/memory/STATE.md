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
> **THE FLOOR MOVES TO `6ca97db`**, alias stamp `ilya-1789880588959`, checked by the
> desk. **HEAD was `d5e0927` when the session opened.**
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
> ### READ THIS FIRST. Written at the close of 2026-09-19 into 2026-09-20, about 00:20
>
> **THE ONE THING IS NOW N.149 AND N.153 TOGETHER: the loupe's two modes.** Dann ruled
> the whole shape of it on this walk and asked that the next thread start on it. N.153
> stage 1 shipped tonight; stages 2 to 5 are what give Corrections its spacing.
>
> **THE FLOOR MOVES TO `0028266`**, "N.153 stage 1: the squircle's box arithmetic moves
> to selection-ring.ts", shipped 2026-09-20 about 00:56 UTC-4, gates at baseline, alias
> stamp `ilya-1789873002682` checked by the desk, and **walked by Dann the same night**
> on the branch alias. HEAD was `55382d3` when the session opened.
>
> **WHAT SHIPPED.** N.153 stage 1 only. The five helpers (`glyphInk`, `markBox`,
> `eventInk`, `ipaBaselineOf`, `ipaFaceDescent`) and `inkCanvas` left
> `VoiceProfilePane.svelte` for `selection-ring.ts`, which now exports
> `ringBox(hit, group, id): RingBox | null`. **Verified two ways:** Code's own live scan
> gave byte-identical numbers on all 115 `[data-hit]` ids before and after, and the desk
> diffed the move, finding 276 of 288 removed lines byte-identical after a one-tab
> dedent, the other 12 being four import names, one rewritten import line, three guards
> that became `return null`, and four `setAttribute` lines now reading the returned box.
> `group.setAttribute('data-note-selected','')` still runs BEFORE the call, so the 19
> ids that return no ring keep the attribute; the rect scan was blind to that and it
> holds.
>
> ---
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
> #### RULED BY DANN ON THIS WALK
>
> 1. **THE LOUPE'S TWO MODES, AND OPTION A IS CHOSEN.** Corrections is a sibling STATE
>    reached by a pill it shares with Syllables, not a second section under Syllables.
>    **The design is `../sessions/design-n149-loupe-two-panels_r1_2026-09-17.html`**,
>    drawn by the desk 2026-09-17, chosen by Dann the same night, LOST for three days
>    because it was never written to disk, and recovered by Dann 2026-09-20. Its own
>    words for option A: *"Two segments in one pill on the left of the bar, the way the
>    desk selector already pairs Transcription and Fit. The chosen one is filled. Undo,
>    Redo and the chevron sit flush right."*
> 2. **THE LOUPE OPENS ON SYLLABLES**, the dominant mode. Whether it should instead open
>    on the mode last used is **still Dann's to consider**; he said so and did not rule.
> 3. **THE TWEEN RUNS SYLLABLES TO CORRECTIONS**, both directions. This refines clause 14,
>    which had it running from Reading. His reason, and it is the point of the whole
>    thing: *"having those carets fade in should intuitively tell the user that they are
>    controls interleaved with the notes on the page."*
> 4. **IN SYLLABLES MODE THERE ARE NO CARETS.** The carets belong to Corrections, and
>    **Corrections necessarily carries more generous spacing** to hold them without
>    collisions.
> 5. **THE PAPER AND THE LOUPE MAY ENGRAVE THE SAME MEASURE DIFFERENTLY.** His words:
>    *"We already accept that the engraved measure on Paper is not the same as the Loupe."*
>    The Paper is engraved as if to be played from; the Loupe is for navigation and closer
>    inspection.
> 6. **THE LOUPE'S ANCHOR: OPTION B. Anchor the music, and give the accordion its own
>    scroll.** The music sits at one vertical, every time; sections grow downward; when
>    the contents exceed the room the accordion scrolls inside itself rather than the card
>    moving. **He has now ruled this twice**: the 2026-09-17 mockup already says *"the
>    panel below swaps without the loupe moving"*, and it was never transcribed.
> 7. **THE METER RUN-IN IN THE LOUPE IS 1 STAVE SPACE.** The page keeps Gould's 2
>    (rule 240, p. 42, `staff-renderer.ts:150-169`). Loupe-local, by ruling 5.
> 8. **THE STAVE RUN-ON PAST THE CLOSING BARLINE IS 1 STAVE SPACE.** Measured before the
>    ruling: today it is 4.6 sp, being `CARET_MARGIN` 3.6 (`Loupe.svelte:1277`, which is
>    `lineGap * 2 + SQUIRCLE_CLEARANCE`, itself `lineGap * 1.6` at `:1266`) plus
>    `EXCERPT_TAIL_SP` 1 (`loupe.ts:598`). Confirmed independently by measuring his own
>    screenshots: 100 px of run-on at 21.75 px to the stave space, on both m. 9 and m. 12.
>    **1 sp lands on Gould rule 242, p. 42**, her barline-adjacent clearance. His
>    instruction: *"Do not overthink the width... just make it shorter than what it is
>    now, visually."*
> 9. **THE TIE RUNS INTO THE RUN-ON, FULLY REALIZED, WITH A TAPERED END**, as if it
>    reached a note that is not shown. Today it stops square at the barline (m. 12).
>    **The tail panel draws only `<line>` elements today** (`Loupe.svelte:2367-2375`), so
>    this is new drawing rather than a tweak.
> 10. **NO UNDO WHILE THE LOUPE IS CLOSED**, which answers N.149's only open question
>    (`OPEN.md:1340`), outstanding since 2026-09-17. Reopening any measure brings the
>    controls back; the stack is the app's own, as he ruled 2026-09-17.
> 11. **THE CARETS OCCUPY A DIFFERENT CONCEPTUAL PLANE FROM THE NOTATION.** His words.
>    This is what frees both quantities to go to 1 sp: if the carets are their own layer,
>    `CARET_MARGIN`'s 3.6 sp carved out of the notation was never theirs to need.
> 12. **ELAINE GOULD IS SHE/HER.** The desk wrote "he" twice and was corrected.
>
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
> ### READ THIS FIRST. Written at the close of 2026-09-19, about 22:00
>
> **THE ONE THING IS STILL N.153, AND 2026-09-19 DID NOT TOUCH IT.** Its account is
> below, under the close of 2026-09-18, and nothing in it has changed. **Stage 1, the
> squircle's box arithmetic extracted from `VoiceProfilePane.svelte` as a
> behaviour-preserving refactor, is where a fresh thread starts.**
>
> **THE FLOOR DOES NOT MOVE. It stays at `637acc1`.** Seven commits landed on
> 2026-09-19 and **not one of them is walked**, so by this file's own rule none of
> them can be a floor. **HEAD is `438f08f` and the tree is clean.**
>
> **WHAT 2026-09-19 WAS: canon, French, and one small removal. No N.153.**
>
> | commit | what |
> |---|---|
> | `02dd6d2` | **the ILYA REGISTER is retired.** Its 27 live rows, its gaps and eight unnumbered live items are in this file; the rest is `../sessions/LOG.md` block 24. **Its subject line is wrong**, from a heredoc error; Dann ruled it stands rather than force-push |
> | `71ae880` | **all 59 Insights entries in French**, and the canon rule that the desk drafts French |
> | `074f230` | **the held measure's page mark removed.** Clause 16 closed |
> | `9dfdab8` | **N.131's 25 real entries in French**, and 25 recorded as never having been defects |
> | `ea862e6` | the Guide acknowledges Roberge and the OQLF |
> | `ce1f4b9` | the OQLF link, verified against the page that states the rule |
> | `438f08f` | clause 16 closed in canon, a lost amendment rebuilt, the transfer fault recorded |
>
> **FIVE THINGS ARE OWED A WALK, and none of them is closed until they get one:**
> Aperçus in French (**Dann confirmed this one on 2026-09-19: "looks great"**); the
> intake and drawer strings in French; the witness line reading « mes. »; no sage
> rectangle on the page; and the Guide's Language paragraph with both links live.
>
> **THE RULE THAT CHANGED, AND IT OUTLIVES THE SESSION: THE DESK DRAFTS THE FRENCH
> AND DANN RULES ON IT.** *"I prefer to have you suggest translations that I can react
> to. That saves me cognitive bandwidth."* Never hand him blank slates. It is in this
> file's N.130 row and in `CONTRACT.md` §4. **And French musical terminology now has an
> authority: Roberge's GDRM, beside the OQLF for punctuation** (`INBOX.md`, 2026-09-19).
>
> **AN INSTRUMENT FAULT THAT BIT TWICE AND MUST NOT BITE AGAIN:** a file transfer to
> the Mac can report success and write nothing, silently, including for one file of a
> multi-file send. **Read every file back on the device before handing Dann a ship
> command.** `ENVIRONMENT.md`, `A FILE TRANSFER CAN REPORT SUCCESS AND WRITE NOTHING`.
>
> **OWED BY DANN, small, none of it blocking N.153:** the walk above; whether the
> comment **THE LOUPE ANCHORS FIXED AND NEVER TRAVELS** (his ruling of 2026-08-26,
> which still says the sage rectangle moves across the page) is amended or left;
> `underlay.heading`'s « Placement des paroles », a DESK DEFAULT he has not ruled on;
> and the four items carried from 2026-09-18 below.
>
> **NOT IN THE REPO ON PURPOSE:** nine legacy project-memory exports and
> `STATE.md.bak-2026-09-19` are in `~/Downloads`. **Dann ruled 2026-09-19 that the
> exports stay on disk, being archival**; Shane's duplicates the new memory system.
> The backup is the revert path for `02dd6d2`, by renaming it over `STATE.md`.
>
> ---
>
> ### The close of 2026-09-18, about 04:00. N.153's account is here
>
> **THE ONE THING IS N.153: the loupe re-engraves the held measure at its own spacing.**
> Numbered by Dann 2026-09-18. Spec and its five stages are in `OPEN.md`. Stage 1 is the
> squircle's box arithmetic, extracted from `VoiceProfilePane.svelte` as a
> behaviour-preserving refactor; stage 2 is one additive data channel; stage 3 is the render
> itself. **Each stage lands and is verified on its own.**
>
> **WHY IT MATTERS, and it is not what the desk thought at midnight. MEASURED 2026-09-18:
> the separation between a caret's hit centre and its neighbour's runs 1.13 px to 7.89 px at
> phone width, on all 17 held-able measures, against a 44 px floor.** `nearestTarget`
> resolves by centre, so **a caret is not reliably tappable on a phone anywhere in this
> score.** The desktop path works today, by stepper and by caret. **N.153 is what makes the
> insert reach work on a phone**, not a tidy-up of the 27 drawing collisions.
>
> **SHIPPED 2026-09-17 evening to 2026-09-18, six commits, all walked by Dann:**
> `f4e31a2` the carets themselves; `7e28272` their weight, plate C's grey at 0.32 with the
> squircle clearance; `8cb9b51` no caret inside the squircle, and a rest gets the hit
> rectangle every other event has; `fda5b9c` carets read ink rather than hit rectangles;
> `a86e985` the loupe shows one measure whole and may take the width it needs;
> `637acc1` no opening barline, the loupe fits its contents, 1.6 line-gaps of daylight.
>
> **DANN'S RULINGS OF THE NIGHT, all in `OPEN.md` section THE CARET, clauses 1 to 13.** They
> outlive the code they came from. The squircle is the one coloured thing in the loupe; a
> caret stands in the middle of the space it names; the loupe shows ONE MEASURE and nothing
> else, adjacent content included; its spacing is its own and does not bind the page; it may
> exceed the page's width, retracting his own ruling of 2026-08-27; and it is sized to its
> contents, keyed to the held measure and never to the selection.
>
> **STILL OPEN AND ALL WAITING ON N.153:** the 27 drawing collisions on 12 of 18 measures
> (18 ink-and-squircle, 9 beam-crossing); the 44 px tap floor, reached nowhere; and one
> hairline sliver of an adjacent syllable on m. 8, which Code kept deliberately rather than
> cut the closing barline.
>
> **OWED BY DANN, small, and none of it blocks N.153:** whether a measure left over may
> print; what Replace does to a night of corrections; the walk of the fill tag's SHORT
> state; and N.140's two numbers, the stave-space floor in CSS pixels and whether the loupe's
> horizontal scroll may take a gesture.
>
> **A PROCESS CHANGE LANDED TONIGHT, and it is in `ENVIRONMENT.md` under `A BRIEF THAT
> CARRIES A CAUSE COSTS A PASS`.** Three of the night's six passes were spent because the
> desk wrote a CAUSE into a brief from prose rather than from the file. `../sessions/BRIEF-TEMPLATE.md`
> has no slot for a cause: observations, then cited facts, then an instruction to Code to
> measure. **Use it for every brief.**
>
> **RULED AFTER THE CLOSE, 2026-09-18, in a design conversation with no code written.
> `OPEN.md` section THE CARET, clauses 14, 15 and 16.**
>
> - **Clause 14. The loupe has THREE states and a tween between two of them.** Reading is
>   the opening state, an enlarged view of the paper measure at the page's own spacing,
>   with NO carets. Syllables opens the accordion and keeps the measure essentially as it
>   was. **Corrections is the only state that shows carets**, and entering it tweens: the
>   notes and rests travel to their new positions while the carets fade in from zero
>   opacity to 0.32, the card's perimeter moving on the same curve and the same duration.
>   The technique is **FLIP**, and a cross-fade is ruled out because the teaching IS the
>   movement. The return is the same machinery reversed and faster. **The toggle is locked
>   for the tween's duration; dismissal stays live by Escape, swipe and chevron.**
> - **Clause 15. THE PERIMETER IS NEVER SMALLER THAN WHAT IT CONTAINS, at any frame.**
>   Promoted to a standing rule for the loupe, because every clipping defect of these two
>   days is that sentence broken while standing still.
> - **Clause 16, CLOSED 2026-09-19 by removing the mark, not by fixing it.**
>   Ruled by Dann over chasing the bug: the page no longer carries a held-measure
>   rectangle. **One of its three candidates was eliminated by reading** (`hitH` is
>   `own.nodes[0]` height at `Loupe.svelte:686-687`, and `lineGap = hitH / 11` at
>   `:689` feeds the loupe crop at `:1132`, so a zero would collapse the loupe he can
>   see); **which of the other two hid it is NOT ESTABLISHED and is now moot.**
>   Shipped `074f230`, six sites removed. **UNWALKED.** Account in `OPEN.md` clause 16.
> - **The tween work is DELIBERATELY UNNUMBERED**, on Dann's ruling: the number waits until
>   N.149 is closer, because N.149 is what makes the Corrections gate real. **Do not mint
>   one and do not read its absence as an oversight.**
>
> **Usage, 2026-09-18: NOT ESTABLISHED.** No screenshot was taken tonight. No subagents were
> spawned by the desk; all building ran in Claude Code on Dann's machine.
>
> ---
>
> ### LIVE CARRY-OVER FROM EARLIER CLOSES
>
> In `OPEN.md`, section "LIVE CARRY-OVER FROM STATE.md". Open it when one of those comes up.

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

**The specs these marks point at live in `OPEN.md` from 2026-09-13.** This
section carries the marks; that file carries the items.

**AND THE ORDER THEY ARE BUILT IN LIVES IN `SEQUENCE.md` from 2026-09-15.** This
section says what is open; that file says what comes first and why. **Six
dependencies fix the order and everything else floats**; the rest of this file
does not repeat them.


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
- `[ ]` **N.150. The drawer's SCORE MARKUP band becomes Voice.** Numbered 2026-09-17,
  DESK DEFAULT number. **Orphaned when N.149 shipped without it. NOT built, read
  2026-09-20: `i18n.ts:59` `group.scoreMarkup` is `Score markup` in both languages.**
  French owed: the desk proposes « Voix », adopted rather than coined. Spec in
  `OPEN.md`.
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

## OWED, RULED BUT NOT YET DONE

- **N.128'S TWO OTHER CONSUMERS. Carried out of the narrative 2026-09-13 and
  SHARPENED; the question is now a single one.** Both `sustain.ts:61-84` and
  `watchlist.ts:229-244` hold **the same duplicated `activeTempoAt`**, which
  compares `ev.rhythmicPosition.fraction` against each tempo marking's position.
  That is the field N.128 found stale. **What is newly established, read
  2026-09-13:** N.128's fix at `correction.ts:358-435` is not a beam-key patch.
  It is a line-wide pass that recomputes the onset of every event whose
  predecessors' durations changed and returns a new event carrying the corrected
  `rhythmicPosition` (`:431`). **So the whole question is which side of that pass
  these two read from.** If they consume the corrected line they are already
  right; if they consume the reader's events they are still wrong. The desk did
  not find the call chain and stopped rather than guess: **NOT ESTABLISHED.**
  Whoever picks this up answers one question, not three. **The duplication is its
  own small finding:** the same function lives in `packages/score-parser` and in
  `apps/web`, so a fix to one does not reach the other.
- **`columnAdvance` reserves no room for the turning layer**, and N.106
  widens what a turning unit can occupy on the right. Nothing crowds on
  Without Sun song 1. Closing it means teaching the layout pass an
  analysis-layer measurement; it belongs with N.103's spacing work. Source:
  `docs/sessions/memo-n106-turning-right_r1_2026-09-02.md`, NOT ESTABLISHED.
- **THREE RESIDUES OF N.104's LOUPE FIX. None is a regression, all three predate
  it, and all three want numbers.** (1) `Loupe.svelte:276-277` still bounds
  `pageMetrics`' head on `[data-hit]`, which is a different question from the
  head's crop: bringing it onto `MUSIC_MARK` makes system 1's tacet measure a
  candidate measure and resizes the loupe's window on every system of the page.
  (2) `Loupe.svelte:218` skips a whole system from the page's ink survey when it
  carries no notes, so a system of nothing but a tacet run draws a numeral the
  survey never sees. **Cannot bite on this document**, where every system with a
  run also carries notes. (3) **`MUSIC_MARK` is pinned by no test.**
  `headBound`'s arithmetic is pinned eight ways; the selector is not, because
  `apps/web`'s vitest has no DOM environment. Source:
  `docs/sessions/memo-n104-loupe-head_r1_2026-08-29.md` §4 and §9.

- **TWO DOCUMENTS FROM 2026-08-17/18 LIVE IN PROJECT KNOWLEDGE, NOT HERE.**
  Nothing else in this folder names them and a session that does not read this
  line will never find them.
  - `claude/gould-beams-delta-pp16-25_2026-08-18.md` — Gould rules 245 to 284,
    Ground Rules pp. 16 to 25, closing v7's gaps item 1 beam pages. **Two
    independent readings, cross-checked.** One flat contradiction on p. 18's
    three-beam rule is recorded UNRESOLVED; do not implement three-beam outer
    placement from it. Four diagram numerals remain unverified.
  - `claude/ruling-semantic-stems-vs-gould-priors_2026-08-18.md` — **Dann's
    ruling: an engraving convention is a PRIOR, not a law.** His Appendices
    assign stem direction a semantic function, stems up for close timbre and
    stems down for open. A Gould prior may bound a DIMENSION; it may not decide
    a MEANING; where a score carries a legend, the legend outranks Gould.
    **This is a constraint on N.59 tier 3, not on tier 2.**
- **Trace `stem_dir`'s consumers in the reader.** `beams.py:264-265` computes
  it and `:310` carries it into the note record. **Whether any stage treats it
  as evidence is NOT ESTABLISHED.** If one does, it is a defect against Dann's
  own scores, which a photograph of Ilya's own output would expose.
  `beams.py:133` reads "S5: one rule, both directions, no directional term",
  read out of a grep and not in context; confirm it.
- **`staff-renderer.ts`'s `positionalUp` now has its citation.** v7 records that
  the helper's beamed-group stem direction is an inference derived from a chord
  rule. Gould p. 24 states it for beams directly, confirmed by both readers:
  the note furthest from the centre of the stave dictates the group's stem
  direction. **Apply the citation the next time that file is touched.**
- **The Gould re-shoot, four spots, would settle every open number.** p. 18's
  three-beam paragraph, and the small diagram numerals on pp. 16, 19, and 21.
- **Step 5's export, single-song half.** Established 2026-08-16: exporting one
  song and restoring a one-song binder into an emptied library both work without
  the list. It is the only thing that would give the chimera warning a detour
  instead of a stop sign. **Dann's ruling: deferred, recorded as owed against
  step 5, NOT folded into 4a.**
- **Remove `bits-ui` from `apps/web/package.json`.** Ruled 2026-08-16: native
  `<dialog>` + `showModal()` is the answer for the delete confirmation AND the
  fingerprint prompt, not bits-ui. **Dann's ruling on timing: not in step 4's
  commit.** It costs zero bytes while nothing imports it, so removing it is
  hygiene, not weight, and it is a lockfile operation. **Do it clean, on its own.**
  Measured before the ruling: one `AlertDialog` cost **+18.7 KB gzipped**
  (392,547 to 411,292), against Fable's ~8 KB budget for all of N.67.

## RULINGS DANN OWES. Ask one at a time, at the right moment

- **RULED 2026-09-16, BUILD OWED: « placement recommencé » / "placement started
  over"**, in `../sessions/spec-loupe-french_r1_2026-09-14.md`. ~~**THE UNDO SENTENCE FOR "START PLACEMENT OVER". Dann's to rule, English and
  French, then one line in Code.**~~ Carried out of the 2026-09-10 walk narrative
  on 2026-09-13 before that narrative moved to `../sessions/LOG.md` block 12.
  **Confirmed live against the tree 2026-09-13:** the button exists
  (`i18n.ts:1328`, `station.startOver`, en "Start placement over", fr
  « Recommencer le placement »), it is drawn at `IntakePanel.svelte:554`, and
  **no `loupe.undo.*` clause fits it.** The clause list at `i18n.ts:377-392` and
  `:470-472` holds `deleted`, `dotOn`, `dotDouble`, `dotOff`, `lyrics`,
  `restored`, `placed`, `melisma`, `melismaOff`, `entered`, `rest` and `tie`,
  and none of them says that a whole placement was started over.
- **SUPERSEDED 2026-09-16: THESE THREE ARE RULED, NOT OWED.** Dann ruled all
  three on 2026-09-14 (« syllabe placée », « mélisme défini », « mélisme
  effacé »), with `loupe.redo` « Refaire\u00a0: %s », `loupe.melisma`,
  `loupe.lyric.melisma` and `calib.common.retake`, in
  `../sessions/spec-loupe-french_r1_2026-09-14.md`. **What is owed is the BUILD:
  the tree still carries English in all of those slots (`i18n.ts:387-392`,
  `:419`, `:422`, read 2026-09-16).** The desk offered them to him again on
  2026-09-16 before tether 16 caught it. `loupe.beat` and `loupe.beatPulse`
  were RULED 2026-09-16 (« temps %b », « temps %b, division %p »), same spec.
  **The loupe's French is now fully ruled and wholly unbuilt.**
  ~~**THREE FRENCH STRINGS ARE ENGLISH, found 2026-09-13 while checking the clause
  list above.** `i18n.ts:388` `loupe.undo.placed` reads fr 'syllable placed';
  `:391` `loupe.undo.melisma` reads fr 'melisma set'; `:392`
  `loupe.undo.melismaOff` reads fr 'melisma cleared'. **A singer in French mode
  is shown English in the loupe's undo line.** French is Dann's; nothing is
  coined here.~~
- **THE RELEASE DATE, RULED BY DANN 2026-09-16: FRIDAY 2026-10-30.** The desk
  proposed it as the far end of the 2026-09-13 estimate; his words: *"By
  Hallowe'en? Sounds good."* **It is a target that the scope gives way to, not
  a wall:** what does not fit by the date goes to FLAGGED or LATER. The dialogue
  that produced it continues below, one question at a time. The sort of the
  inventory into IN, FLAGGED and LATER is still owed.
- **SORT RULINGS, 2026-09-16** (proposal `../sessions/sort-release_r1_2026-09-16.md`): **N.94 IN**, and its place is ruled: *"it belongs in the Score Markup section between Corrections and Voice."* (supersedes the 2026-09-13 note placing it in a `Melody` band station). **N.131 IN**, whole. **N.123 IN** (his word, over the desk's LATER), restated 2026-09-16: *"we absolutely need to have this visual. Non-negotiable."* **The visual, in his words 2026-09-16:** *"'this visual' means the range and the tessituragram with passaggio zone indicated."* So **N.127 increment 2 (the compass stave: the piece's range against the singer's) is IN**, and N.123's tessituragram carries the passaggio zone shaded (already in its spec as "the singer's turning points shaded"). **N.85 IN, N.86 IN, N.87 LATER** (his words: *"this is fine as you have marked them"*); **N.88: Dann's own optional afternoon task, probably 2026-10-29** (his words: *"if I feel like it"*). **THE SORT IS DONE 2026-09-16 AND THE FREEZE RULE IS IN FORCE.** IN: 24 rows, listed in `../sessions/sort-release_r1_2026-09-16.md`. **SIZED 2026-09-16, DESK INFERENCE on Dann's request:** `../sessions/estimate-release_r1_2026-09-16.md`. About 45 to 75 build cycles needed against about 100 available at the week's pace: **achievable if the freeze holds, the three design rows (N.94, N.123, N.84) start early, and the pace holds.** DESK DEFAULT checkpoint: **Friday 2026-10-09**; a design row not in Code by then moves to LATER and the date stands. **THE SCHEDULE: `SCHEDULE.md`, written 2026-09-16, starts 2026-09-17.** INBOX-37 (the loupe tap) is numbered **N.147**, DESK DEFAULT number.
- ~~**FOR THE SORT: START PLACEMENT OVER CANNOT BE UNDONE.**~~ **FIXED BY N.144, `ceeb214`.** Established by
  Code 2026-09-16 (`memo-loupe-french-build_r1_2026-09-16.md`):
  `handleStartPlacementOver` never calls `pushUndo`, yet it rebuilds every
  placement. A singer who presses it by mistake loses their hand placements.
  **DESK READING: that is lost work, so it meets the freeze rule's exception.**
  The undo clause is ruled and built as a key, unwired.
- **N.142 STEP 2 IS WAITING ON A COUNT FROM DANN'S BROWSER.** Whether any song
  in his library holds a placement on a tie's continuation is a fact about his
  IndexedDB, which Code cannot read (`memo-n142-tie-prolongation_r1_2026-09-16.md`
  §5). The desk can read it through Chrome on the branch alias.
- **THE FREEZE RULE, RULED BY DANN 2026-09-16.** His word: *"I accept."* The
  wording he accepted: **"From the day the sort is done, a new finding goes to
  LATER by default. It joins this release only if Ilya would otherwise tell a
  singer something false, or lose a singer's work."** Cases put to him with it:
  "1 lines" goes to LATER; the loupe tap that reassigns syllables joins the
  release (lost work); N.143 would have joined (Transcription empty). **The
  desk's advice, given with it: keep the exception narrow; "confusing" and
  "ugly" are not in it.**
- **THE RELEASE CUT, and it is the biggest thing he owes. Raised 2026-09-13
  when he asked how close a fully working app is.** The answer is in
  `../sessions/memo-footprint-and-release-arithmetic_r1_2026-09-13.md` §4, and
  the arithmetic is this: about thirty-five units of ruled and unbuilt work
  stand open, throughput runs two to three units per session, so **twelve to
  eighteen sessions, three to six weeks, DESK INFERENCE and a range.** That
  range assumes nothing new is numbered. **In the seven days 2026-09-07 to
  2026-09-13, fifteen new numbers arrived, N.115 to N.129, and nine units
  closed, of which only N.128 was one of the fifteen.** The queue grew faster
  than it drained. **So the release date is set by when he stops numbering, not
  by how fast Code builds.** The ask, when the moment is right: name the items
  the next public iteration of Ilya contains (Ilya has been public since
  January, corrected by Dann 2026-09-16; see `PRODUCT.md`), freeze that list, and move the rest to a
  post-release file the way `OPEN.md` now holds unstarted specs. **Do not put
  this to him mid-item, and do not raise it twice.**
- **THE RELEASE ORDER CONTRADICTS ITSELF, and both halves are his. Found
  2026-09-13.** His ruling of 2026-08-24 set the order **N.83, N.84, N.85,
  N.86, N.87, N.88**, with walkthrough prep first, and N.82 and N.89 riding
  between (`../sessions/LOG.md`, the 2026-08-24 numbers table). His
  text-to-score sequence of 2026-09-06 lists it as **the release order N.85 to
  N.88, then N.84, then N.83**, which reverses both ends. Per tether 17 the
  later ruling stands, but **N.83 is the item that produces the first honest
  end-to-end reader accuracy datum, and nothing else in the tree produces one**,
  so putting it last has a cost he may not have intended. **One question,
  whichever order he wants.**
- The binding squircle's footprint on Insights page one: Design proposes two
  treatments, Dann rules (2026-09-11).

### New from N.104, 2026-08-29. One left, not blocking the walk

The bar numbers were ruled on 2026-09-11 and are now N.126, below. The loupe's
typeface closed with `246c17c` on 2026-09-13 and moved to `../sessions/LOG.md`
block 11.9. The tacet question is the one that is still his.

- ~~THE BAR-NUMBERS DRAWING IS WAITING ON HIM.~~ **RULED 2026-09-11 00:40,
  numbered N.126, measure numbers on Score markup, UNPLACED.** Size: the
  lyric underlay's point size. Weight: regular, italic (Gould p484-d
  agrees). Clearance: "legible without emphasis", DESK DEFAULT 1.0
  stave-space (the drawing's middle of 0.6 / 1.0 / 1.4). The SYSTEM-START number is bare, never
  parenthesized ("to orient collaborating musicians quickly, not to trumpet
  our editorial decision"). **AMENDED 2026-09-15: the POST-REST courtesy number
  takes SQUARE BRACKETS**, Dann's ruling, because square brackets mean editorial
  in a score and that number is Ilya's own addition rather than standard
  practice. Post-rest anchor: DESK DEFAULT the closing
  barline of the rest, explained to Dann and not waved off. System-start
  number above the clef per Gould p484 and his 2026-08-29 ruling. Drawing:
  `docs/sessions/drawing-bar-numbers_r1_2026-08-29.html`; source
  `gould-bar-numbers-p484_2026-08-29.md`. The original text it superseded moved
  to `../sessions/LOG.md` block 11.8 on 2026-09-13.
- **What the correction surface does over a tacet run.** Three proposals in
  `docs/sessions/memo-n104-tacet_r1_2026-08-27.md` §7, unruled since
  2026-08-27. The ship changed nothing there **on desk inference rather than on
  his word**, which is stated so he can wave it off.

### New from N.67 step 5, 2026-08-18. Three copy gaps, all named by Code, none invented

**Code refused to coin a string in all three, which was correct.** The approved
table has no word for these cases, and inventing one would have been writing
French Dann has not seen.

- **A run that only replaced or only skipped says NOTHING.** `importNoticeKey`
  returns null, so answering *Take* on a song you are not in produces no
  sentence. Code's reasoning: the song rises to the top of the list, which is
  visible. **If that reads as silence, it needs a "replaced" string in both
  languages.**
- **A PARTIAL WRITE FAILURE SAYS THE WRONG THING.** Two songs land, one refuses,
  and `binderError` shows `songs.err.write`, which ends "Nothing has changed."
  **Something did change.** The old code was worse, so this is an improvement on
  a defect rather than a new one, but it is not right and no approved string
  fits.
- **`(2) (2)`.** Re-importing a binder of a copy named `… (2)` produces
  `… (2) (2)`, because `uniqueName` numbers the base it is given and the base
  genuinely was `… (2)`. Correct per design §2.3, and it looks odd. Cosmetic.

### New from N.67 step 4b, 2026-08-18. Four, all small, none blocking

- **Boot does not transcribe; a switch does.** Switching songs runs the pipeline
  and draws the transcription; a reload leaves the poem sitting there until the
  singer presses Transcribe. Code named the asymmetry in its memo §6.4 and asked
  which way to close it. **Observed on the deploy 2026-08-18 and confirmed:** the
  reload after the delete showed the poem present, the dictionary loaded, and
  nothing drawn. **Recorded honestly: the coordinator claimed the opposite from a
  pair of screenshots twenty seconds apart, which could not distinguish Ilya
  transcribing from Dann pressing the button, and had to withdraw it.**
- **A song named from its poem never picks up a better name from the score.**
  Memo decision 6.1: the name is written the first time there is material to
  build one from, and is the singer's from then on. Observed: a song auto-named
  `Я тебя любил` from the poem kept that name after a score arrived carrying
  `Я вас любил` and a composer. The rule cannot tell "Ilya guessed" from "Dann
  chose." Rename fixes it in one gesture, so this is a preference, not a defect.
- **The door is on the Transcription tab only.** The Fit tab has the twinned
  binder row by Dann's ruling of 2026-08-16 but no song list, so switching songs
  while working on a score means changing tabs. Code says twinning it is six
  lines and did not do it because the brief named one place.
- **Pressing Delete on a song you are not in appears to switch you into it before
  it asks.** Observed on the deploy: the open song was `Pushkin, control fixture`
  and the dialog opened over an emptied drawer with `Untitled` marked open.
  **NOT ESTABLISHED whether the Delete press caused it or Dann clicked the row
  first; he was asked and the walk moved on.** If Delete does move the singer,
  choosing Keep leaves them somewhere they did not ask to be. Nothing is lost,
  because saving is continuous.

- **A singer on Chrome for iPhone can never install Ilya to the home screen.**
  Chrome on iOS offers no Add to Home Screen and `InstallPrompt.svelte:48`
  already excludes `CriOS` and `FxiOS`. Established by reading, carried over
  from N.72 where it was named and never ruled.
- ~~**N.63.** Where the honest residue goes~~ **RULED 2026-08-21: SAY NOTHING.**
  Still owed: deleting the gate itself, if it still ships. NOT ESTABLISHED
  whether it does; the last evidence is Fable's finding F5 of 2026-08-18.
- **N.45's remainder.**
- ~~**The French question mark.**~~ **RULED 2026-08-21: no space before `?` in
  Canadian French, a hard space before `:`.** It was 47 sites, not eleven. Shipped
  in `9f11490`. **The 63 `!` and `;` sites are NOT done.**
- *(Not yet: what a deliberately empty note draws.)*

---

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

## STILL UNSETTLED. Not yours to settle alone

- **Where the storage notices belong.** They render in the FIT drawer only, so a
  singer working in Transcription never sees a save failure or the two-tab
  notice. Inherited from when they were pairing notices; not moved in E.54
  because moving them is a placement decision, not a build step.
- **The three storage strings still say "syllable placements"** and the save is
  now the whole song. Design §7 puts that copy in step 6, with the French shown
  to Dann first, so it was left alone rather than rewritten twice.

- "The page carries no chrome." · "Do not introduce a slider."
- **N.51:** whether per-tab colour may propagate past the tab bar.
- Whether `claude/shane-project-map_2026-07-25.md` is stale. **Unopened for
  twelve sessions.**
- **D3's Job A**, per-verse reprints, ruled in E.36 and still unnumbered.
- **The per-format score arrival audit**, asked for in E.45 and never written.
- ~~`stripBackingRect` matches `fill="#FFFFFF"` while `staff-renderer.ts` paints
  `#F0EBE0`.~~ **SETTLED 2026-09-07 by Dann's print preview: the cream prints. Ruled: the page prints white. Paste written (INBOX), not yet run.** **BUILT 2026-09-14 as N.133, uncommitted.** The paste was never found: `INBOX.md:97` records it only as sent to a second Code thread, and no commit touches `stripBackingRect`. Its aim, no cream on paper, is part of N.133, which removed both rectangles and `stripBackingRect`.
- **The marks on the printed page.** E.51's prints carry a dashed `VERIFY` box
  and a `USER OVERRIDE` badge on paper. CONTRACT §6 forbids a mark that says Ilya
  is unsure. **Whether these are the ruled exception was not checked.**
- **`VoiceProfilePane.svelte:295-313` duplicates the old header arithmetic.**
  Fit's paper does not yet share the Transcribe paper's single `HEADER_GAP`.
- **Whether `.mscz` ingest actually succeeds in a browser.** The path is live in
  code (`ScoreUploader.svelte:106-137`) but `i18n.ts:272` still carries a
  "coming soon" string for it. Nobody has run it.

---

## THE REGISTER IS RETIRED, 2026-09-19. Its live rows are below

**Ruled by Dann 2026-09-19, over revision 11:** *"retire it into `STATE.md` and
`LOG.md`"*. `claude/ILYA REGISTER_2026-08-11.md` was revision 10, E.46,
13 August 2026, 233 lines. **Its closed rows, its E.46 measurements, its
primary-source verifications, and its corrections are in `../sessions/LOG.md`
block 24, verbatim. What was still live is here.** Nothing else points at it,
and the file in project knowledge can be deleted.

**WHY IT WAS RETIRED RATHER THAN REVISED, and the finding is against this file,
not against the register.** The instruction to produce revision 11 said **"The
blocking number is now THREE."** That is stale against this file's own
**"THE BLOCKING SET IS EMPTY, 2026-08-21."** Revision 11 as specified would have
written a stale number into canon. **Two further errors, found 2026-09-19:** the
register's own header and colophon both claim the blocking number is SEVEN while
only SIX of its rows carry the `BLOCKING` mark; and its gaps sentence says "ten
cardinals" over a list of twelve.

**THE REGISTER'S ROW FORMAT IS KEPT AS IT WAS**, because the value of these rows
is the primary source in the fourth column, and rewording them would cost that.
Its state vocabulary is in `../sessions/LOG.md` block 24.

### The live rows, 27 of them, verbatim from revision 10

**Read the state column against this file first.** These rows were last touched
on 13 August 2026, so any row this file contradicts is settled by this file.

| # | item | state | primary source |
|---|---|---|---|
| **N.15** | The touch-target repair | `RULED`, increment 1 specified and unapplied | `claude/e36-session-record_2026-08-10.md` §7.5; increment 1 at `claude/sonnet-memo-n15-inc1-touch-token-and-mapping_2026-08-10.md`. **E.46: N.55b's hit targets are 27.5 to 48.3 px wide, below the 44 px floor, and the column spacing is the bound. Not a third exemption; a constraint the engraving imposes** |
| **N.17** | Viewport repair. Partly a no-op as ruled | `OPEN` | `claude/e38-handover_v1_2026-08-10.md` §10 |
| **N.19** | The calibration date | `OPEN` | `claude/e38-ratified-goal-ledger-CORRECTED_2026-08-10.md` §3. Ruled to print, E.36 §7.4 |
| **N.22** | The English-only Fit drawer, in French | **`WRITTEN`** | `claude/e40-handover_v1_2026-08-11.md` §6. Its surviving `aria-label`s are inside **N.62** |
| **N.27** | The silent save. `saveStore` swallows its exception | `OPEN` | `profileStore.ts:220-224`. Gates N.28–N.29. **E.46: N.55b's `ilya:pairings` must NOT repeat it. A second silent save site is the same defect written twice** |
| **N.28 / N.28a / N.28b** | Export: one voice, all voices, the unexported mark, pseudonymous | `OPEN` | slate, revision 3. **E.45: this is where the copyright question is revisited, before the door is built** |
| **N.29** | Import, identity by id | `OPEN` | slate, revision 3 |
| **N.30** | Re-key the override maps from positional to linguistic | `OPEN`, deferred by Dann in E.40 | slate, revision 3. **Keys are `${lineIndex}-${wordIndex}`, verified E.45 at `+page.svelte` and `pipeline.ts:229`** |
| **N.31** | User glosses persist as `user-override` | `OPEN` | blocked behind N.30. **E.45, offered and unanswered: a user gloss is one bare string with no language on it, while the dictionary's glosses are bilingual `{en, fr}`** |
| **N.32a** | Say plainly that Ilya transmits nothing | `OPEN` | slate, revision 3. **E.45 verified it: every outbound call in `src` is a GET for Ilya's own assets** |
| **N.33** | The Guide's screenshot recapture, on Playwright | `RULED`, waits for the GUI | Fable, E.44: unblocked by N.66 |
| **N.35** | `SPOKEN_NAME` and `spoken()` are English | **`PART DONE`** | Shipped `6829161`. The four error captions are inside **N.62** |
| **N.37** | The stale `e16-harness` README | `OPEN` | slate, revision 3 |
| **N.38** | The C8 field audit | `RULED`, unscoped | slate, revision 3 |
| **N.39** | Scope the Learn overhaul | `RULED`, unstarted | `claude/e38-handover_v1_2026-08-10.md` §9 |
| **N.42** | The desk selector. **It selects a document, not a destination** | `RULED`, build-ready | `claude/e41-n42-assigned-desk-selector_2026-08-11.md`, **whose §2 is WRONG**. Two genuinely open: the luminance-keyed inks, and chip cream versus light |
| **N.45** | Transcribe's mobile content view | **`PART DONE`** | **E.45 DIAGNOSIS, RE-VERIFIED E.46 at `Paper.svelte:113-117`: the ruling said bypass pagination; the build set `gap: 0` instead. Portrait renders a STACK OF PAGES with the seam hidden.** **And the comment at `Paper.svelte:109-112` still asserts the pages must stay in the DOM for print, which Dann overruled. It is a live trap for the next reader.** Track switch offered and never answered |
| **N.46** | Fit's mobile presentation, shape A | **`PART DONE`**, shipped `4ec2840`, `b624631` | Landscape DONE, observed by Dann. UNOBSERVED: the provenance legend |
| **N.48** | The inescapable vowel | **`WRITTEN`**, shipped `f18c6ce`. **NOT EXERCISED** | Still needs a failing `[u]` |
| **N.49** | `[u]` extraction; the voice type never reaches the extractor | **`OPEN`** | `claude/e43-n49-assigned-extraction_2026-08-12.md`. INTERMITTENT |
| **N.50** | NotePicker joins the dictionary | **`PART DONE`**, shipped `f18c6ce` | Scope B, ten of fourteen. Eight strings inside N.62 |
| **N.51** | The Fit surface wears Transcription's accent | **`OPEN`** | E.43, Dann's `record` ruling. `--sage` at 39 sites across 12 files |
| **N.60** | The brace rule: the staff the brace does not span is the voice | `RULED` by Dann, 12 August 2026 | `claude/e43-n59-the-reader-in-a-browser_2026-08-12.md` §2 |
| **N.61** | The watch as a capture device | **`OPEN`, a question rather than a feature** | Whether a web app can reach that microphone is NOT ESTABLISHED |
| **N.64** | **Transcribe and Fit share one media input, the E.27 "Source" station** | **`RULED`, unstarted** | **`claude/e44-fable-ruling-studio-architecture_2026-08-13.md`, header table. E.46 CORRECTION: this is the INTAKE, not the text beside the notes. Opus mis-cited it from this register's own one-line summary** |
| **N.65** | The drawer's anchors | **`RULED`, half built** | `claude/e36-session-record_2026-08-10.md` §1.4. Built in the E.29 shape, not the E.36 shape. **E.46: N.55b's syllable station is a new tenant of this scroll** |
| **N.66** | The Studio consolidation | **`RULED`, unstarted** | `claude/e44-fable-ruling-studio-architecture_2026-08-13.md`. **E.46: Studio shows ONE document at a time. It would not put the text beside the stave, and Fable overturned the continuous packet page explicitly** |

### Ten rows closed since the register was written. Not carried

- **N.32** closed/parked table, LOG block 9
- **N.47** closed/parked table, LOG block 9
- **N.55a** closed/parked table, LOG block 9
- **N.55b** closed/parked table, LOG block 9
- **N.56** closed/parked table, LOG block 9
- **N.58** DEFERRED TO FUTURE DEVELOPMENT by Dann 2026-08-21
- **N.59** PARKED AT TIER 2, answered no, 2026-08-18 (step 3, the brace rule, still open)
- **N.62** closed/parked table, LOG block 9
- **N.63** closed/parked table, LOG block 9
- **N.67** CLOSED WHOLE 2026-08-18

### The gaps, carried forward and CORRECTED

**The register said "ten cardinals" and listed twelve.** Verbatim, its list was
N.1 through N.6, N.8, N.9, N.11, N.13, N.18, and N.21. **N.10b came off that
list in E.46**, located at `fit-legend.ts:80-104`.

**RECONCILED 2026-09-19. THE FIVE STANDS AND THE REGISTER'S TWELVE WAS STALE.**

**Method, so it can be checked:** a word-boundary grep for each cardinal
(`\bN\.<n>\b`, which does not match N.10 or N.146) across `docs/`, and
separately across `apps`, `packages` and `tools`.

**SEVEN OF THE TWELVE ARE IN THE TREE, each with an identity the register never
recorded:**

| # | what it is | read at |
|---|---|---|
| **N.4** | the unmeasured page | `packages/score-parser/src/staff-renderer.test.ts:1065`; `staff-renderer.ts:895`, `:2282` |
| **N.5** | the singer's notation preferences, 2026-08-05 | `apps/web/src/lib/shane/VoiceProfilePane.svelte:164`, `:844`, `:861` |
| **N.6** | ledger-line notes' stems, **recorded and NOT implemented** | `packages/score-parser/src/staff-renderer.ts:1791` |
| **N.8** | the singer's open-syllable preference, 2026-08-06 | `apps/web/src/lib/shane/vowel-resolver.ts:411`; `VoiceProfilePane.svelte:174` |
| **N.9** | the clitic rule: a word with no vowel can never own a slot | `apps/web/src/lib/shane/pairings.ts:102`, `:173`; `vowel-resolver.ts:512` |
| **N.11** | a hyphen's ink stays inside the gap between two syllables | `packages/score-parser/src/staff-renderer.ts:1175`, `:3404`; `staff-renderer.test.ts:53` |
| **N.13** | voicing preserved before a voiced-obstruent-initial word at a soft boundary | `packages/phonology/tests/notation-edge-cases.test.ts:528`, `:551` |

**N.6 BEING LOCATED IS THE ONE THAT MATTERS**, because it is on the visible list
as a live item, which a genuinely unlocated number could not be. Its code
comment says what it is and says it is not built.

**FIVE REMAIN GENUINELY UNLOCATED: N.1, N.2, N.3, N.18, N.21.** Zero references
in `apps`, `packages` or `tools`, and in `docs/` they appear **only inside the
gap listings themselves**. Nothing anywhere says what they are.

**The rows below are the register's, kept verbatim as its record. They are
superseded by the table above wherever the two disagree.**

Their rows, verbatim:

| # | item | state | primary source |
|---|---|---|---|
| N.1 – N.6 | — | **SUPERSEDED 2026-09-19: N.4, N.5 and N.6 are located; N.1, N.2, N.3 are not** | not located. See §Gaps |
| N.8 – N.9 | — | **SUPERSEDED 2026-09-19: both located** | not located |
| **N.10a, N.10b** | sub-items of N.10 | **N.10b LOCATED, E.46:** the withheld-syllable legend entry, `fit-legend.ts:80-104`. N.10a still NOT ESTABLISHED | **E.46: N.10b's French was replaced by Dann.** See §RULED |
| N.11 | — | **SUPERSEDED 2026-09-19: located** | not located |
| N.13 | — | **SUPERSEDED 2026-09-19: located** | not located |
| **N.14a, N.14b** | sub-items of N.14 | **NOT ESTABLISHED** | named in the commit history per the E.38 slate |
| N.18, N.21 | — | **NOT ESTABLISHED, confirmed 2026-09-19** | not located, and named nowhere but here |
| **N.20** | Built on `analyzePerVerse`. **Do not delete that function** | **NOT ESTABLISHED** | named in the E.41 opener §7.4; scope not located |

**Filling them is archaeology and it is optional. N.20's scope is genuinely
unknown**, and it matters more than the others. **The C-series is a separate
numbering** and was not in the register.

### Unnumbered and outstanding, carried forward

**5 of the register's 13 unnumbered rows are already in this file and are not
repeated here** (D3's Job A, French `?` spacing, French colon spacing, per-format score arrival audit, stripBackingRect). The
remaining 8 are:

| item | source | note |
|---|---|---|
| Three `notation.*.desc` keys write bare vowel glyphs | `e40-handover` §8 | |
| The stress-acutes toggle governs Transcription only | `NotationFields.svelte:14-21` | never numbered |
| A third touch-geometry exemption for the Notation header | E.41 | still unanswered |
| Three elements still measured in `100vh` | `+layout.svelte:12-17` | N.17 |
| The toggles are not freely combinable | E.38 audit | the Guide says *"freely combined"* |
| The rotation lock | E.44 | no string or code fixes it |
| **The teacher-with-a-studio copyright case** | E.45, raised by Dann, unanswered | |
| `ILYA_PROJECT_MAP_2026-08-10_r7.svg` has no cards for N.23 through N.67 | E.41 | **the map is an archive; the tracker is the instrument** |

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
