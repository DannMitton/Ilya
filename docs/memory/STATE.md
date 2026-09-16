# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

What it names instead is a **FLOOR**: everything described below was true at or
before **`76b24a3`**, "N.126 and N.141: measure numbers arrive on
Score markup, and the squircle's width holds its IPA syllable", shipped
2026-09-14 22:35, READY on the branch alias, sha checked by the desk before Dann
was sent to it, and walked by him on 2026-09-15 (the previous floors, `eb918ed`,
`d6580af`, `8bb406c`, `78f3db8`, `490c12d` and earlier, are in
`../sessions/LOG.md`). A floor cannot go stale,
because further commits only move HEAD forward and never make the floor false.
If the tree is ahead of it, that is expected and tells you only that work has
landed since.

**The ten superseded floors that used to be listed here, `2b81f5a` through
`2d54185`, are in `../sessions/LOG.md`, block 5.** They are closed, and closed
things do not live in this file.

**The push range is the check, not the memo.**
A floor that predates
its own content is the stale number this paragraph exists to prevent. A floor cannot go stale, because further commits only
move HEAD forward and never make the floor false. If the tree is ahead of it,
that is expected and tells you only that work has landed since.

**Ask Dann for the state in one line. You do not WRITE with git, ever.**
Read-only git is allowed under the narrowed CONTRACT §5, ratified 2026-09-13:
`status`, `log`, `diff`, `show`, `ls-files`, `check-ignore`. Asking Dann is
still the courtesy and still the habit.

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

---

## THE ONE THING

> ### UPDATED 2026-09-16, LATER. Read this before the block that follows
>
> - **Insights 01a and 01b are both done.** Dann's notes: `Insights Research/_synthesis/review-01a.md`
>   (R1 to R3) and `review-01b.md` (S1 and S2 ruled; **S3, the opened-vowel targets, is
>   OPEN and is the next question for Dann**).
> - **N.125 is DONE** (`570d76f`, walked). See THE TRACKER.
> - **Bozeman PVA2 batch C is extracted** (Ch. 1 to 3, 10, 11; 35 photos, 31 labelled,
>   4 duplicates skipped): `_extraction/claims_bozeman-PVA2_batch-C.csv`, 50 rows, 10
>   advice rows, checked by the desk (parses; longest quote 13 words). Input for
>   Insights pass 02. Ch. 12 is not wanted (no belting, `PRODUCT.md`).
> - **S3 to S5 are ruled** in `review-01b.md`. Still Dann's from the candidates:
>   tolerances (TOL2, and the crossing band), INS-P01-7's migration targets for six
>   vowels and replace-or-annotate, INS-P01-8's treble alternative, INS-P01-10's leap size.
> - **N.143's cause is found** (`OPEN.md` §N.143, Half A): fix queued behind N.139.
> - **N.139 is DONE**, shipped `eb7d220`, walked by Dann 2026-09-16: "Everything looks
>   exactly as it should." The system head now lays out forwards (`systemHead`,
>   `staff-renderer.ts:766`, shared with `sliceWidth`). Gate 5 moved 555/560 to
>   **564 passed, 5 skipped (569)**, nine new tests; the desk moved
>   `~/Downloads/ilya-ship.sh` line 80 and kept `ilya-ship.sh.bak-before-n139-2026-09-16`.
>   **Record correction:** Code's memo says Sunless 01 went to 6 systems on 1 page; Dann's
>   walk screenshot shows page 1 of 2 with 5 systems (mm. 1 to 15). The page is right;
>   the memo's page count is not. **Follow-up, unnumbered:** the loupe keeps its meter 2
>   spaces clear of the first ink, not the note, on measures without a meter change (T05
>   m. 9 37.28 px, m. 14 26.44 px). **Check at the close:** the Sonnet 90 print fixture
>   ("fills exactly two letter sheets") may have changed with the forward head.
> - **Loupe drops a measure's opening rest, found by Dann 2026-09-16** (T05 mm. 28, 35, 37,
>   57, 81; every mid-system measure that opens on a rest). Not a regression: the same code is
>   in the 570d76f bundle. Cause: rests carry no hit rectangle (`staff-renderer.ts:2626`), the
>   window opens at the first hit rectangle (`loupe.ts:79-89`), and the barline search rejects a
>   barline left of the window (`Loupe.svelte:696`). Fix approved as DESK DEFAULT and sent to Code,
>   bundled with the meter run-in follow-up.
> - **Next build: N.143 Half A** (`OPEN.md` §N.143), then the file-name fallback (Half B).
> - **N.139 is still briefed and ready.**
>
> ### ADDED AT THE CLOSE OF 2026-09-16 (late). One research thread IS in flight
>
> **Fable is running Stage 01a of the Insights synthesis** (started by Dann
> 2026-09-16, in its own thread; no code, no repository writes). Everything about
> it is in **INSIGHTS, THE EVIDENCE BASE** below and in the plan it points to.
> What the desk does with it, in order:
>
> 1. When Dann brings the 01a memo, help him review the files in
>    `~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/`, one
>    question at a time. His notes go in `_synthesis/review-01a.md`.
> 2. Then give him the 01b opener: *"Read ...brief-insights-step-b-core_r5_2026-09-16.md
>    first, then brief-insights-step-b-pass01_r5_2026-09-16.md in the same folder.
>    Carry out Stage 01b of pass 01."* (full path: `~/Documents/Voice Pedagogy
>    Library/Insights Research/`).
> 3. Candidates for later, each needing Dann's yes: a Sonnet re-extraction of
>    Bozeman's interventions (only 10 advice rows exist); photos of Bozeman PVA2
>    Ch. 1 to 3 and 10 to 12 (Ch. 12 is Belting); the Elsevier reply on Journal of
>    Voice access.
>
> The rest of this section, written 2026-09-15, still stands: the two briefed
> builds below are unaffected by the research thread.
>
> ### READ THIS FIRST. Written at the close of 2026-09-15, for the next instantiation
>
> **The thread before this one compacted mid-work and was closed deliberately.**
> Nothing is in flight and nothing is half-built. The tree at the floor is clean
> apart from the memory files of that close.
>
> **TWO THINGS ARE BRIEFED AND READY TO RUN, and neither needs a ruling first:**
>
> - **N.125, slurs as tapered objects.** Brief at
>   `../sessions/brief-n125-slurs-as-objects_r1_2026-09-11.md`, **amended at the
>   desk 2026-09-15 with §0.1 (the line numbers moved), §2.4 (measure the tie's
>   taper before touching the slur), and a corrected §2.3 (read `data-tie` and
>   `data-slur`, never judge a curve from a picture).** Dann has met this defect
>   twice on walks. **It is the desk's recommendation for the next thing built.**
> - **N.139, every meter assignment draws on the page.** Brief at
>   `../sessions/brief-n139-page-meter-signature_r1_2026-09-14.md`.
>
> **N.141's remaining increment is BLOCKED on N.142**, which is not built, so the
> heading below is accurate about the item and not about what to do next. **Ask
> Dann which he wants; do not choose for him.**
>
> ---
>
> ### THE ONE THING: N.141, THE SQUIRCLE'S GRAMMAR. IN CODE, 2026-09-15.
>
> **Spec in `OPEN.md` §N.141, brief at
> `../sessions/brief-n141-squircle-grammar_r1_2026-09-15.md`.** Every rule in it
> is Dann's, quoted and dated. **Two increments have shipped** (`debdf02` the
> grammar and the row spacing, `76b24a3` the width holding its IPA syllable, both
> walked). **What is left in N.141 is the tie-spanning increment, and it DEPENDS
> ON N.142**, which is not built.
>
> ---
>
> ### WHAT THE WALK OF `76b24a3` FOUND, 2026-09-15 late. Four things, all recorded
>
> 1. **N.143.** N.134 does not fire on a `.musx` score: the input field and
>    Transcription are both empty on T05, the song is `Untitled, 2026-09-15`, and
>    the Piece fields are blank, while Score markup draws the file's own words.
>    **Fourth sighting, first by Dann on a deploy.** Spec `OPEN.md` §N.143, three
>    candidate causes named, NOT BUILT. **This reopens the first half of N.134,
>    which the block below still records as DONE; it was walked on a
>    `.musicxml`.**
> 2. **N.141 case 2, with evidence.** Two loupe shots, m. 84 and m. 87 of T05
>    (**corrected 2026-09-16**; first recorded as Without Sun song 2), where a note's value carries past the barline and the squircle
>    stays closed. **m. 84 is the defect. m. 87 is a melisma slur, settled
>    2026-09-16 from `data-slur` (N.125 memo), so its closed box is correct.** `OPEN.md` §N.141
>    §EVIDENCE.
> 3. **N.125 raised again, with a challenge to the record.** Dann: *"These
>    constant-width arcs are noticeable and wrong. They need to be tapered."*
>    **Re-verified against the tree tonight and the finding holds**: ties are
>    filled tapered lenses (`staff-renderer.ts:2783`), slurs are a constant 1.3 px
>    stroke (`:2822`). The brief has ruled since 2026-09-11 that slurs become
>    tapered objects. **It needs a §2.4 added** and it needs PLACING; it has been
>    UNPLACED and untracked since 2026-09-11 and he keeps meeting it.
> 4. **N.126 CONFIRMED ON THE PAGE.** Dann, 2026-09-15: *"4 [28] reads exactly as
>    it should."* The system-start number bare, the post-rest courtesy number in
>    square brackets, side by side, and he read them without prompting. **The last
>    open question on N.126 is closed and the item is DONE.**
>
> **THE TIE / SLUR PREDICATE IS LOAD-BEARING FOR THREE ITEMS AT ONCE** (N.125,
> N.141 case 2, N.142), and none of them can be settled from a picture. **Read
> `data-tie` and `data-slur` off the rendered page.** Recorded in `OPEN.md`
> §N.125.
>
> ---
>
> **COLOUR STAGE 5 WAS DISPLACED BY DANN ON 2026-09-14 AND IS STILL DISPLACED.**
> He displaced it in favour of the 2026-09-13 walk's findings 2 and 3. Its scope
> is unchanged and is in
> `../sessions/plan-colour-story_r1_2026-09-13.md` §STAGE 5: `--stone-600`
> declared or its seven references rewritten, every other ghost the census found,
> and inline literals that duplicate a token replaced or explained. **No brief is
> written for it. It is hygiene and it is the least visible thing on the list.**
>
> **THE 2026-09-13 WALK'S FOUR FINDINGS ARE ALL RESOLVED OR NUMBERED.** 1 the
> `Transcribe and fit` pill, CLOSED 2026-09-14, **its fate still Dann's to rule**
> and both its acts known duplicates; 2 the missing meter signature, **numbered
> N.139**, brief written, not built; 3 the possibly halved rhythmic values,
> **CLOSED 2026-09-14 and never a defect**, T05 declares 2/4 once and Dann checked
> the printed score; 4 N.133, **DONE 2026-09-15**, `LOG.md` block 17.
>
> **SIX SHIPS ACROSS 2026-09-14 INTO 2026-09-15, ALL WALKED BY DANN.** `78f3db8`
> N.138 increment 1, `8bb406c` its increments 2 and 3, `d6580af` the ring and
> held-measure mark landing after the ground, `eb918ed` N.133, `debdf02` N.141's
> grammar, `76b24a3` N.126 and N.141's IPA width. **N.138's account is `LOG.md`
> block 16 and N.133's is block 17.** Gates moved across the night; the desk moved
> `~/Downloads/ilya-ship.sh` lines 79 and 80 each time and kept a backup per move.
> **At `76b24a3` the gate lines read 1173 and 555.**
>
> **THE REST OF THIS SECTION IS THE 2026-09-13 AND 2026-09-14 NARRATIVE.** Its
> closed material moved to `LOG.md` block 18 at this close. What remains is live:
> N.127's unreviewed decisions, the briefs list, N.129, N.94, the ratified names,
> the colour plan pointer, the text-to-score sequence, and the damage in Dann's
> own engraving.
>
> ---
>
> **DANN'S OWN ENGRAVING IS DAMAGED, AND IT IS NOT ILYA'S DOING. Measured
> 2026-09-14** on `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`:
>
> - Verse 1 gives the vowelless `в` a note of its own at index 36; verse 2 folds
>   it into `ˈvʲbʲu` at 37. **The two underlays are one note out of phase**, which
>   Dorico's own render of the file shows.
> - **Words are broken across rests in both verses**, 8 in the Cyrillic and 11 in
>   the IPA, counted from the file's own `begin`…`end` marks.
> - The last word is `одинока`, one syllable short of `одинокая`, **which is why
>   the last note draws bare.** Code proved it by appending the `я`.
>
> **He engraved the IPA verse himself in Finale during his doctorate**, so this is
> a file to repair and not a defect in Ilya. **Consequence for the project: this
> score is not a usable ruler for judging seating accuracy.** A clean fixture is
> wanted before anyone judges whether words land on the right notes.
>
> **INSIGHTS, WHAT IS OPEN.** Code made five decisions of its own on N.127
> increment 1, all listed in `../sessions/memo-n127-insights-inc1_r1_2026-09-13.md`,
> all reversible, none reviewed by Dann. One row prints nothing on his Sunless
> score because measure 17 does not add up to its time signature. At 390 px the
> head does not fit three documents: 237.97 px for labels needing 265.19.
> Increment 2 is the compass.
>
> **INSIGHTS, THE EVIDENCE BASE, set up 2026-09-15 (a research thread, no code).**
> The plan and Dann's rulings are in
> `~/Documents/Voice Pedagogy Library/Insights Research/Insights-Research-Plan.md`,
> with a copy in project knowledge at
> `claude/spec-insights-research-pipeline_2026-09-15.md`. The source list (153
> sources) sits beside it, in `Insights-Research-Sources.csv`, md5
> `049b1b0635e706f057ae4b8a5b603613`. **Status 2026-09-16:** 36 articles and
> Bozeman PVA 2nd ed. (Ch. 4 to 9, 13, Definitions, App. 2 and 3) extracted by
> Sonnet into `_extraction/`. Step B briefs written, NOT RUN: core
> `brief-insights-step-b-core_r5_2026-09-16.md` plus addendum
> `brief-insights-step-b-pass01_r5_2026-09-16.md`, in two stages (01a, Dann
> reviews, 01b). The plan's section "Purpose and design rulings (2026-09-16, late
> session)" holds twelve rulings from that night (tiers, blind spots, tethered
> abstraction, the ten-vowel set, Bozeman surrogates on a continuum between
> charts, no pronouncements on identity) and the rulings still owed. The build
> consequence is one line in INBOX.md. **Stage 01a is running in Fable** (started
> 2026-09-16 late); see THE ONE THING for what follows. Waiting: Elsevier's reply
> on Journal of Voice access.
>
> **BRIEFS WRITTEN AND NOT RUN, corrected 2026-09-14:**
> `brief-n117-dictionary-fill_r1_2026-09-12`,
> `brief-n125-slurs-as-objects_r1_2026-09-11`,
> `brief-n119-toggles-reach-score-markup_r1_2026-09-12`,
> `brief-colour-stage4_r1_2026-09-14`,
> `brief-n135-ocr-measurement_r1_2026-09-14` (its measurement RUN, memo landed).
> **N.118's brief ran on 2026-09-14 and the colour token rename is done.**
> **N.119's brief row on `Open syllables` is already corrected** (brief line 89,
> "NO. CORRECTED 2026-09-14"; checked by the desk 2026-09-16). See N.136.
>
> **THE COLOUR STORY, RULED AND PLANNED.** The principle, the five-hue map and
> the six-stage plan are in `../sessions/plan-colour-story_r1_2026-09-13.md`, with
> the full ruling in `INBOX.md`. Learn moves rose to umber; nothing else moves.
> **Stages 1, 2, 3a and 3b are done and walked. Stage 4 is the one thing above.**
>
> **N.129, THE UNDERLAY IS SPACED IN THE WRONG FONT'S METRICS. Numbered by
> Dann 2026-09-13. UNPLACED.** `underlay-widths.ts:690` declares its table as
> "Per-1000-em advance widths for **Source Serif 4** Cyrillic", and the
> renderer uses it for the syllable column advance
> (`staff-renderer.ts:754-762`) and for hyphen and extender endpoints
> (`:2742-2750`). The page has drawn those glyphs in **Source Sans 3** ever
> since the paginator began stripping the renderer's serif root
> (`page-layout.ts:376`). So every syllable's spacing and every hyphen and
> extender end on Score markup is computed from metrics the glyphs never had.
> Code measured about 5% on one word, « ночь » 27.72 serif against 26.34 sans.
> Candidate fixes, unruled: remeasure the table in Source Sans 3, or make the
> face a parameter so the two cannot diverge again. **Bears on N.118 and on
> the `columnAdvance` crowding item already in OWED.** Found by Code inside
> the loupe-typeface memo; the desk read all three sites itself.
>
> **FOLDED IN 2026-09-14 ON DANN'S WORD, found by him on the N.118 walk.**
> He read `не прог ляд – на я,` on the page and counted three hyphens missing
> from one word.
>
> 1. **Ilya omits a hyphen silently whenever two syllables' ink comes within
>    4 px.** `staff-renderer.ts:2761-2763`: `from = rightEdgeOf(a) + 2`,
>    `to = leftEdgeOf(b) - 2`, then `if (to <= from) continue`. The 4 is two
>    paddings, not a chosen engraving value.
> 2. **The file contradicts itself.** `clampHyphenX` handles a gap narrower
>    than the hyphen by centring it and letting it overhang, and says so in
>    its own comment: *"Omitting the hyphen instead is a Gould question (rules
>    26 to 40, unread), so it is not taken here."* The loop omits before
>    `clampHyphenX` is ever reached.
> 3. **Gould rules 26 to 40 are still unread**, recorded at
>    `../sessions/memo-n113-melisma_r1_2026-09-07.md:223`, and the book is not
>    on this machine.
> 4. **RULED BY DANN 2026-09-14:** *"I don't want Ilya dropping hyphens.
>    Instead, I want the note spacing to shift to permit the appearance of
>    hyphens properly."* So the omission goes, and the spacer widens instead.
> 5. **The fix's shape, DESK INFERENCE and his to wave off:** a gap between
>    two syllables of ONE WORD takes a larger floor than a gap between two
>    words, sized to the hyphen plus its clearance. Today there is one floor,
>    `INK_CLEAR_SP = 0.5` stave spaces (N.103), and it knows nothing about
>    hyphens.
> 6. **Named cost:** widening word-internal gaps means fewer measures per
>    system and different pagination on every page, not only on tight words.
> 7. **This work sits on top of the wrong-metrics fix, not beside it.** A
>    hyphen clearance tuned against a table that is 5% out is tuned against a
>    bad ruler.
>
> **SCOPE RULED 2026-09-14, and item 5 is unblocked.** The desk asked whether
> his ruling of 2026-08-13, "THE NOTES NEVER MOVE", barred widening a column to
> fit a hyphen. His answer, recorded in full in `PRODUCT.md`: *"Sometimes I want
> the notes to move to accommodate legibility in the text underlay. The
> engraving is not the composer's; it is a highly edited aspect of the
> musico-textual object that is subject to our scholarly intervention. We can
> freely rearrange the page layout and measure distribution to accommodate
> legibility and logic. We don't want to interfere with these elements without
> justification."* **So layout, measure distribution and horizontal spacing are
> editorial, and the standard is justification rather than prohibition.**
>
> **N.94 HAS A HOME AGAIN, 2026-09-13.** Numbered 2026-08-24 as "transposition
> interface, modelled on Newzik" and never built. It is now a **station inside
> the `Melody` band, sibling to Corrections**. Established: the ENGINE already
> exists and ships. `packages/score-parser/src/transposition.ts` exports
> `transposeScore`, `suggestTranspositions`, `spellPitch`,
> `keyNameAfterTransposition` and more, built so the watch list names computed
> keys rather than guesses (Dann's ruling 2026-07-20), wired at
> `watchlist.ts:476`. Only the control is missing. **Re-read
> `claude/e31-late-rulings-and-the-transposition-control_2026-08-07.md` first**
> (rulings 9 to 14, the detented-ruler spec); it is 37 days old and its
> amendments are unchecked, per tether 17.
>
> **THE NAMES, RATIFIED 2026-09-13, BOTH LANGUAGES.** Tabs: `Text` / « Texte »,
> `Markup` / « Annotation », `Insights` / « Aperçus ». Drawer band:
> `Melody` / « Mélodie ». The French mirrors the English throughout and
> nothing is coined. **Tab padding goes 0.7 rem to 0.5 rem** to fit the French
> row, returning 19.2 px; afterwards English has 55.07 px spare and French
> 15.64 at a 390 px viewport. **OWED: nobody has seen 0.5 rem on screen.**
> This supersedes the `MARKUP` band rename of 2026-09-12.
>
> **THE TEXT-TO-SCORE SEQUENCE, RULED BY DANN 2026-09-06**, one path through
> the pairing layer: 1 N.108-5 cleanup DONE; 2 N.112 the text is
> authoritative DONE; 3 N.113 the melisma DONE; 4 N.114 the syllable line
> under the poem DONE 2026-09-09 (narrowed from Type Into Score), N.114a
> and N.114b 1 to 5 DONE 2026-09-10. **Then, inserted by Dann 2026-09-10:
> the drawer as a path (Design consulted), carrying N.119 to N.122 and
> N.118.** Then N.110 (set aside, briefed), N.115, N.116, the release
> order N.85 to N.88, N.84 (Guide and Learn), N.83.
>
> **N.127, INSIGHTS, numbered by Dann 2026-09-11 evening (first ruled as
> N.126 in-session; renumbered after the desk missed `STATE.md:497`, the
> collision is the desk's error, owned in-thread). UNPLACED. Ilya's third
> document, sibling to Transcription and Score markup, third member of the
> `DeskHead` pair.** Rulings, all Dann's 2026-09-11: read-only, never an
> input surface; every line computed from the singer's inputs or a sourced
> advice string a predicate fired; appears the instant voice information
> exists, thin to deep, broad-analysis pattern inherited; content in a
> squircle inheriting the watch band (`VoiceProfilePane.svelte:1532-1533`),
> which migrates off Score markup wholly, leaving it pure notation;
> governing colour dusty rose `--dusty-rose #A67B7B`, inks luminance-keyed;
> page one fixed at one page, a second page only when earned, fired advice
> printed there in full; citations as footnotes, attribution in Guide and
> footer; page one ordered for the choosing moment; identity head carries
> voice name, composer, title (DESK DEFAULT: calibration date joins it,
> which would close N.19); section headers take `TitleHeader.svelte`
> `.metadata-line` recipe in rose ink; the compass stave's clef follows the
> SINGER via `chooseClef` on the declared range's median (tenor
> treble-8vb-by-range refinement recorded here, not yet designed); the foot
> is one apparatus block, Insights' copy of `footer.attribution` drops the
> lieder.net clause, siblings untouched; the labelled teacher's blank is
> DEAD, unlabelled negative space stays. Six curation criteria ruled as a
> LIVING list (see the brief), headline: helpful not comprehensive; one
> entry per hazard anchored by its weightiest instance in the Loupe's
> measure-tag grammar; Score markup answers where, Insights answers what,
> how much, and what to do; silence is a finding. Record:
> `docs/sessions/n127-design-pack/` (commits `e0c34c1`, `52517e6`). Design
> returned R1 to R3 the same evening; R3 carries the three clef passes and
> the French-proved foot; a six-item refinement message is with Design
> (stave to 8 px line gap, no note-name captions, mini-squircle collision
> law, G clef curl on the G line, binding-squircle footprint with two
> treatments for Dann to rule, foot daylight and right-indented hairline).
> **Design's returned HTML lives only in Dann's Downloads; commit the
> latest into the pack at the next touch.**
>

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

**The specs these marks point at live in `OPEN.md` from 2026-09-13.** This
section carries the marks; that file carries the items.

**AND THE ORDER THEY ARE BUILT IN LIVES IN `SEQUENCE.md` from 2026-09-15.** This
section says what is open; that file says what comes first and why. **Six
dependencies fix the order and everything else floats**; the rest of this file
does not repeat them.


### Placed 2026-09-15 at the close. Both were UNPLACED and untracked since 2026-09-11

- `[x]` **N.126. Measure numbers on Score markup. DONE, shipped in `76b24a3`,
  CONFIRMED BY DANN 2026-09-15:** *"4 [28] reads exactly as it should."* The
  system-start number bare above the clef, the post-rest courtesy number in
  square brackets beside it, and he read the pair on the page without being
  prompted. **The square brackets were his amendment of 2026-09-15**, because
  square brackets mean editorial in a score and that number is Ilya's own
  addition. Spec in the OWED section below; it stays there as the record of what
  was ruled.
- `[x]` **N.125. DONE 2026-09-16, walked by Dann on `570d76f`: "looks great".**
  Shipped in `34b143c` (slurs drawn as the tie's filled outline; tie and slur
  thickness read from the notation font's SMuFL `engravingDefaults`, Finale
  Maestro 0.25 and 0.05 sp; `TIE_CENTRE_SP` retired) and `570d76f` (slur ends sit
  0.73 sp from the notehead centre, as a tie's do; clearances in stave spaces).
  Account: `../sessions/memo-n125-slurs_r1_2026-09-11.md`. Lesson:
  `ENVIRONMENT.md` §ASK THE FONT FIRST. Left open, NOT ESTABLISHED: a melisma slur
  crossing a system break may clear a turning mark drawn on the other system.
  Move this entry to `LOG.md` at the close. The original entry follows.
- (was) **N.125. Slurs as tapered objects.** Numbered 2026-09-11, **never tracked
  until now, which is why Dann has met it twice.** Slurs draw as a constant
  1.3 px stroke (`staff-renderer.ts:2822`) where ties are filled tapered lenses
  (`:2783`); Gould 151 gives both one design. Brief written
  (`../sessions/brief-n125-slurs-as-objects_r1_2026-09-11.md`) and it **needs a
  §2.4** added before it runs: measure the rendered tie's centre thickness at the
  shipping `lineGap` of 5.5 and say whether `TIE_CENTRE_SP` 0.4 sp survives the
  size it is drawn at. Spec and tonight's re-verification: `OPEN.md` §N.125. Its
  own Code thread, `staff-renderer.ts` only, off the drawer path.

### Numbered 2026-09-15

- `[ ]` **N.143. N.134 does not fire on a `.musx` score.** Observed by Dann on the
  deploy `76b24a3`, 2026-09-15, after three sightings by Code that were each
  written off to the load. **Both halves are absent on T05:** the input field stays empty, no
  `from score` receipt, no name from the header. **N.134 was walked on MusicXML;
  T05 is `.musx` through denigma into MNX.** The gate is at
  `+page.svelte:3120-3123` and three conditions could be failing. **Half B's cause
  is already established: the converted MNX carries no title or composer at all.**
  Spec in `OPEN.md`. The number is a DESK DEFAULT.

- `[ ]` **N.142. A tie is prolongation, not a new syllable target.** Dann,
  2026-09-15: *"Ilya must understand that a tie is rhythmic prolongation."* The
  number is a DESK DEFAULT. **The data is already there and both parsers fill it**
  (`types.ts:572`, `musicxml-parser.ts:633`, `mnx-parser.ts:720`); nothing in the
  seating path reads it. **Rests are already excluded and nothing is owed there.**
  Spec in `OPEN.md`, including the one thing Dann must rule before it ships: what
  happens to syllables already sitting on tie continuations.

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

- `[x]` **N.138. The loupe supplies the meter for every measure it shows. DONE
  2026-09-14, all three increments, walked by Dann.** Increment 1 `78f3db8`,
  increments 2 and 3 `8bb406c`. Account and spec in `../sessions/LOG.md` block 16.
  **Three things it raised are still live and are NOT closed by it:** the
  selection ring landing under the system's ground (`INBOX.md`), whether a tap
  ever picked the wrong note (NOT ESTABLISHED), and N.140.
- `[ ]` **N.139. Every meter assignment in a score draws on the page.** Ruled by
  Dann 2026-09-14; **the number is a DESK DEFAULT** and he can collapse it into
  N.138 with a word. Finding 2 of the 2026-09-13 walk. Ilya draws no meter
  signature anywhere: the system head lays out the clef and the key signature and
  nothing else (`staff-renderer.ts:1654-1664`). Spec in `OPEN.md`. **Finding 3 of
  that walk is CLOSED and was not a defect.**

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
  half-built. Spec in `OPEN.md`. **Dann owes the French; nothing is coined.**
- `[x]` **N.133. The renderer stops painting its own ground. DONE 2026-09-15,
  shipped as `eb918ed` and walked by Dann.** Account and spec in
  `../sessions/LOG.md` block 17. Gate 5 moved to 550. **Still NOT ESTABLISHED, and
  small: no actual print preview was taken**, only a reading of the loaded print
  stylesheets.
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

- **THE UNDO SENTENCE FOR "START PLACEMENT OVER". Dann's to rule, English and
  French, then one line in Code.** Carried out of the 2026-09-10 walk narrative
  on 2026-09-13 before that narrative moved to `../sessions/LOG.md` block 12.
  **Confirmed live against the tree 2026-09-13:** the button exists
  (`i18n.ts:1328`, `station.startOver`, en "Start placement over", fr
  « Recommencer le placement »), it is drawn at `IntakePanel.svelte:554`, and
  **no `loupe.undo.*` clause fits it.** The clause list at `i18n.ts:377-392` and
  `:470-472` holds `deleted`, `dotOn`, `dotDouble`, `dotOff`, `lyrics`,
  `restored`, `placed`, `melisma`, `melismaOff`, `entered`, `rest` and `tie`,
  and none of them says that a whole placement was started over.
- **THREE FRENCH STRINGS ARE ENGLISH, found 2026-09-13 while checking the clause
  list above.** `i18n.ts:388` `loupe.undo.placed` reads fr 'syllable placed';
  `:391` `loupe.undo.melisma` reads fr 'melisma set'; `:392`
  `loupe.undo.melismaOff` reads fr 'melisma cleared'. **A singer in French mode
  is shown English in the loupe's undo line.** French is Dann's; nothing is
  coined here.
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
  a first public Ilya contains, freeze that list, and move the rest to a
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

## Register corrections owed

`claude/ILYA-REGISTER_2026-08-11.md` is at revision 10 and needs revision 11.
Its N.55a row is FALSE (N.55a is CLOSED). It says "ten cardinals" over a list of
twelve; **five actually remain and none is in the tree: N.1, N.2, N.3, N.18,
N.21.** Its N.55b row is stale. **The blocking number is now THREE.**

**Or fold the register into this file and retire it.** It is the last piece of
canon still living in project knowledge.

---


---
*Split 2026-09-01. `STATE.md` was 3,089 lines and 207 KB. The session history,
the `## Log` table, and three stale colophons moved to `../sessions/LOG.md`.
What stays is what `README.md` asks a new session to read: the one thing, the
tracker, and the rulings Dann owes. Backup of the pre-split file:
`STATE.md.bak-2026-09-01`.*

*Close of 2026-09-10 late: 673 lines, over the 600 tripwire after N.123, N.124, and the Tempo station were added. Two blocks moved to LOG.md block 10 tonight (the 06:15 one-thing block; the blocking-set table). What remains is open. The next thing to move is whatever Dann rules in RULINGS DANN OWES; the 2026-08-18 copy-gap and step-4b lists are the oldest.*

*Close of 2026-09-13, on Dann's word: the four stage 2 ruling records left this file for `../sessions/spec-colour_r1_2026-09-13.md`, verbatim. They were not closed work, so `LOG.md` was the wrong destination; they are the specification stage 4 builds from, and this file keeps the twenty values and a pointer. Per `ENVIRONMENT.md` §PRUNING A MEMORY FILE, no line count is written here, because the number is stale the moment anything else is added. The remaining excess is still the 2026-09-10 and 2026-09-11 walk narrative named above, with its three live residues, untouched tonight.*

*Close of 2026-09-13, the colour session. Stages 3a and 3b and the close of stage 2 moved to `../sessions/LOG.md` block 13, verbatim, with three live items lifted out of them first and kept in §THE ONE THING. The four stage 2 ruling records left earlier the same day for `../sessions/spec-colour_r1_2026-09-13.md`. Four items were numbered: N.130, N.131, N.132, N.133. Per `ENVIRONMENT.md` §PRUNING A MEMORY FILE, no line count is written here.*

*Close of 2026-09-14. N.134 and N.118 both shipped in `4d79f24` and were walked
by Dann; their accounts and the one-thing block they replaced are in
`../sessions/LOG.md` block 14, verbatim. Four things were lifted out and
rewritten fresh rather than moved: the stage 4 spec, the twenty values, INSIGHTS
WHAT IS OPEN, and BRIEFS WRITTEN AND NOT RUN. Numbered tonight: N.135 and N.136.
Extended tonight: N.129 with the hyphen omission and its ruling, N.115 with both
arrow directions and the reflow standard. Amended tonight: `PRODUCT.md` twice
(layout is editorial; agency is the justification; a vowelless clitic never holds
a note alone) and `CONTRACT.md` twice (no aphorisms and no hype; do not write his
rulings as absolutes). Per `ENVIRONMENT.md` §PRUNING A MEMORY FILE, no line count
is written here.*


*Close of 2026-09-14 late. Stage 4 of the colour story shipped as `aa2b419` and
was walked; N.137 was numbered, shipped as `490c12d`, and walked the same night.
Both moved to `../sessions/LOG.md` block 15, verbatim, with the two items stage
4's walk did not reach recorded there as UNWALKED rather than passed. The floor
moves to `490c12d`. `CONTRACT.md` tether 18 was amended: describe a glyph, never
substitute the nearest letter you can type. `ENVIRONMENT.md` gains the ё plus
U+0301 render trap with its index row, and a second dated sighting of the
stranded `index.lock`. THE ONE THING moves to colour stage 5 on the ruled order
of `plan-colour-story_r1_2026-09-13.md`, and Dann may displace it with a word.*

***TRIPWIRE: this file is over 600 lines. Per `README.md` that means something
failed to move, and it is not stage 4, which moved tonight. The oldest
candidates are still the 2026-08-18 copy-gap and step-4b lists and the RULINGS
DANN OWES block. Raised for Dann, not acted on.***
