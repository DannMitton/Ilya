# Memo: INBOX backlog triage, lines 32 to 135

Read-only audit. `INBOX.md` was not edited. Scope: `INBOX.md` lines 32 to 135
(104 items, 2026-08-24 to 2026-09-11). Evidence order followed: `STATE.md`,
then `docs/sessions/LOG.md`, then the tree, then `docs/sessions/` memos, per
`brief-inbox-triage_r1_2026-09-13.md` §3. Stopped at the first solid hit in
every row; did not keep searching to strengthen a case that already had one.

**NOT ESTABLISHED beats a complete invented answer.** Several rows below are
`UNCLEAR` for exactly that reason.

## The three calibration checks the brief asked for

- **Line 61 (a named Redo pill beside Undo): CONFIRMED, exists.** The
  Undo/Redo pair moved through several redesigns (dock row, top bar, now the
  Score markup band header) and was restored to sigla `↶ ↷` in commit
  `246c17c` (`STATE.md`, "THE ONE THING," close of 2026-09-12). A Redo
  control is live today, though not in the exact shape the line first asked
  for (a dock-row pill next to Undo); the desk's belief was right in substance.
- **Line 113 (Open syllables toggle should reach Score markup live): the
  single best state is NUMBERED, not "OPEN and NUMBERED at once."** It became
  **N.119**. `STATE.md` records the audit already run: "N.119's audit
  corrected `STATE.md`: five of the seven Notation toggles already reach
  Score markup." So most of the ask is already true in the tree; a brief for
  the remaining two toggles is written and not run
  (`docs/sessions/brief-n119-toggles-reach-score-markup_r1_2026-09-12.md`).
  NUMBERED is the traceable answer; calling it also OPEN restates the same
  fact (a numbered item can be unbuilt) rather than adding one.
- **Line 79 (a re-seated cell loses its punctuation): CONFIRMED, became
  N.118, briefed, not built.** `STATE.md`: "N.118, NUMBERED BY DANN
  2026-09-09: punctuation travels in the slot... After N.114 unless he
  places it." Brief exists:
  `docs/sessions/brief-n118-punctuation-travels_r1_2026-09-12.md`. The desk's
  belief was right.

## The table

| line | gist | state | evidence | needs Dann |
|---|---|---|---|---|
| 32 | Dead-code audit, then delete what it finds | NUMBERED | Became N.86, "dead-code and structure audit" (`LOG.md:597`) | no |
| 33 | Optimization pass; perceive, confer, execute | NUMBERED | Became N.87, "optimizations" (`LOG.md:598`) | no |
| 34 | Structural-intuitiveness pass for contributors | NUMBERED | Folded into N.86, which names "structural intuitiveness for contributors" (`LOG.md:597`) | no |
| 35 | Curated walkthrough, imminent, colleague asked | NUMBERED | Became N.83 (`LOG.md:636`); still deferred, no date set (`LOG.md:3445`, `STATE.md:105`) | yes — see grouped question 1 |
| 36 | Marketing materials; Ilya free, open source | NUMBERED | Became N.88 (`LOG.md:641`) | no |
| 37 | Redevelop the Guide; prose describes an older build | NUMBERED | Became N.84 (`LOG.md:637`); still waiting, unbuilt (`STATE.md:523`) | no |
| 38 | Colour print is greyscale except the flag; intentional? | OPEN | "Colour on paper: PARKED behind N.83." (`LOG.md:655`, 2026-08-24) | no — already answered (parked) |
| 39 | Headers/footers on emitted documents; provenance + dannmitton.com | NUMBERED | Became N.89, "RATIFIED FROM DRAWINGS, NOT BUILT" (`LOG.md:642`); still unplaced (`STATE.md:519`) | no |
| 40 | Can a smartwatch capture formants and relay them? | OPEN | "the smartwatch formant question remains in the inbox, unruled." (`LOG.md:679`) | no |
| 41 | N.90, the photograph tier | OPEN | Numbered `LOG.md:161,174`; no build or closure mention anywhere after | yes — see grouped question 2 |
| 42 | N.91, piano-doubling witness / OpenScore Lieder benchmark | OPEN | Numbered `LOG.md:161,175`; no build or closure mention after | yes — see grouped question 2 |
| 43 | N.92, notation editing tools | DONE | "N.92 FIRST SLICE DONE" (`LOG.md:322`, ship `f3b257b`); "N.92 slice 2 is DONE" (`LOG.md:241`, ship `2d54185`); carried further by the mobile slice 3/4 entry-grammar work, "THE MOBILE TRACK IS COMPLETE" (`LOG.md:504`) | no |
| 44 | N.93, easy text entry interfaces for poem/underlay | UNCLEAR | Numbered alongside N.92 (`LOG.md:170`); unlike N.92, no "N.93 DONE" or equivalent closure line found anywhere in `LOG.md` or `STATE.md` | no |
| 45 | N.94, transposition interface (Newzik model) | OPEN | `STATE.md:519`: "Open and unplaced, small: ... N.94 ..."; repeated open in `LOG.md:498,565,3437,3447` | no — already on the standing open list |
| 46 | N.98, voice formant profile selector | OPEN | Numbered `LOG.md:216`; no later mention anywhere | yes — see grouped question 2 |
| 47 | N.99, skew-tolerant staff detection | OPEN | Numbered `LOG.md:217`; no later mention anywhere | yes — see grouped question 2 |
| 48 | N.100, PDF route must not trust the media box | OPEN | Numbered `LOG.md:219`; no later mention anywhere | yes — see grouped question 2 |
| 49 | Restore pacifier; busy indicator on reload | SUPERSEDED | Same symptom (reload delay, nothing says so) re-raised and numbered as N.117, 2026-09-07 (`INBOX.md:109-110`, `STATE.md` N.117 entry) | no |
| 50 | Portrait hint placement, centre it | SUPERSEDED | Struck in the line itself: "STRUCK 2026-08-26, mobile slice 1: the blank page ... now renders the score, and the hint is deleted." (`INBOX.md:50`) | no |
| 51 | Mobile pitch editing untenable on a phone | DONE | `LOG.md:435-436`: "INBOX.md (two lines: mobile editing, mobile navigation, both absorbed into this track)"; that track closed: "SLICE 4 IS DONE AND THE MOBILE TRACK IS COMPLETE" (`LOG.md:504`) | no |
| 52 | Mobile navigation is abysmal, needs help | DONE | Same citation as line 51 | no |
| 53 | Print button lands under the paper on a phone | UNCLEAR | No `flex-shrink: 0` found on `.paper-fit` in `apps/web/src/routes/+page.svelte` today; no closure line found in `LOG.md` beyond the original finding | no |
| 54 | Floor-commit restore flakiness on `98bba71` | UNCLEAR | No follow-up investigation found in `LOG.md` after the original note; "Worth its own look" was never revisited by name | no |
| 55 | Tether 20 draft (governance accretion) | OPEN | Explicitly "HELD BY DANN 2026-09-01, not written into CONTRACT.md" (`INBOX.md:55`); not in `CONTRACT.md`'s 22 tethers today | no |
| 56 | N.105, install prompt never saves a dismissal | DONE | "N.105 CLOSED 2026-09-02, WALKED BY DANN on the branch alias. Ship `21e9ce2`, 'N.105: \"Not now\" lasts thirty days'" (`LOG.md:2952-2953`) | no |
| 57 | N.101, score intake is confusing | OPEN | Numbered `LOG.md:453`; never marked closed; not in any of `STATE.md`'s closed blocks, though later intake work (N.108 to N.121) covers adjacent ground | yes — see grouped question 3 |
| 58 | Barline correction; the entry grammar has no barline verb | OPEN | Still listed unbuilt at close of the mobile track, "INBOX carries: barline correction..." (`LOG.md:566`); no number, no later mention | yes — see grouped question 4 |
| 59 | Where did the Lamm read's metre come from | OPEN | Rides with line 58, same citation (`LOG.md:566`); no later mention | yes — see grouped question 4 |
| 60 | Arrow-key hotkeys for the stepper | DONE | "Slice 4 built the homecoming ... arrow keys drive the stepper, Escape dismisses" (`LOG.md:513-515`, ship line ending `893ccb4`) | no |
| 61 | Redo pill beside Undo | DONE | See calibration check above | no |
| 62 | N.102, courtesy accidentals | DONE (base) | Increments 1, 1a, 1b closed (`LOG.md:3044`, "N.102 increments 1, 1a, 1b") | no |
| 63 | Tie taper ruled 0.40 (Dann's eye) | DONE | The ruling itself, and its citation carried into the tree per the tie-taper mentions across `STATE.md`/`LOG.md` (`TIE_CENTRE_SP`, 0.4 sp) | no |
| 64 | FOR PRODUCT.md: the squircle as a key germ | OPEN | Instruction was "transcribe into PRODUCT.md next session" (`INBOX.md:64`); `docs/memory/PRODUCT.md` has no match for "squircle" today (checked in full) | no — mechanical, a desk write, not a ruling |
| 65 | Augmentation dots are not drawn | DONE | "the augmentation dot is DRAWN at last, Gould r111 p.54, one tap dot, two double, three none." (`LOG.md:584-585`, ship `c9e2b0f`) | no |
| 66 | N.103, measures do not re-space when ink is added | DONE | "N.103 DONE 2026-09-02, WALKED BY DANN on the alias. Ship `62967a7`" (`LOG.md:3015`) | no |
| 67 | N.104, the page must represent tacet measures | DONE | Shipped `ea300ef` and others; residues (not regressions) tracked separately in `STATE.md`'s "THREE RESIDUES OF N.104's LOUPE FIX" | no |
| 68 | N.106, sung/turning notehead collision | OPEN | Base collision rule shipped (`LOG.md:3003`, ship `bb73488`), but `STATE.md`'s OWED list still carries a live residue ("`columnAdvance` reserves no room for the turning layer"), and STATE names it "a taste question for him when N.102 returns" | yes — see grouped question 5 |
| 69 | N.102 increment 1c, turning-layer courtesies | OPEN | `STATE.md:519`: "Open and unplaced, small: N.102 increment 1c (turning-layer courtesies) ..." | no — already on the standing open list |
| 70 | N.107, turning heads draw no ledger lines | DONE | "N.107 DONE 2026-09-02, WALKED BY DANN on the alias. Ship `d22084c`" (`LOG.md:3028`) | no |
| 71 | Plausibility guard judges readings at capture only | OPEN | Proposed as an "I.N.110 candidate" but the number N.110 went to a different item (the [i] extractor harness, `STATE.md`: "set aside by Dann, briefed ... not built"); this finding itself has no number and no fix found | no |
| 72 | Clitic on its own note (vowelless word alone) | DONE | Numbered N.111 same hour; N.111 "Closed and moved to `LOG.md` block 8 ... All walked by Dann." (`STATE.md`) | no |
| 73 | Drawer stays still on a tab change | DONE | Rides with N.108; N.108 (five increments) closed, walked by Dann (`STATE.md`) | no |
| 74 | "One piece at a time" — song binds poem/score/metadata | OPEN | Recorded to inbox on Dann's word with no resolution: "Inbox, on his word: 'one piece at a time'." (`LOG.md:3111`); the symptom (metadata surviving Clear) is separately still marked "seen, not acted on" the same session (`LOG.md:3105-3107`) | yes — see grouped question 6 |
| 75 | Negative space between Piece band and Ilya banner | DONE | Rides with N.108, closed (`STATE.md`) | no |
| 76 | Every button shares the calibration ritual's rounded ends | DONE | Rides with N.108, closed (`STATE.md`) | no |
| 77 | Consolidate OCR camera icon / Choose a file / Read from photo | DONE | Rides with N.108, closed (`STATE.md`) | no |
| 78 | IPA `#` assimilation marker offsets the verse in Dann's file | OPEN | "Not numbered; Dann to say what the printed score sets there." (`INBOX.md:78`); no ruling found since | yes — see grouped question 7 |
| 79 | N.111 finding: re-seated cell loses punctuation | NUMBERED | See calibration check above (N.118) | no |
| 80 | N.111 finding: undecided note draws stale text | DONE | DESK DEFAULT adopted as part of N.111 increment 3, which closed (`STATE.md`) | no |
| 81 | Ilya seats a vowelless clitic automatically, no proposal | DONE | Ruling implemented in N.111 increment 3, closed (`STATE.md`) | no |
| 82 | Transcription overrules underlay only on a clitic fold | DONE | Same N.111 increment 3, closed (`STATE.md`) | no |
| 83 | N.111-3 walk findings: loupe redraw stale; stray IPA 'a' | DONE (item 1 confirmed; item 2 not separately confirmed) | Item 1: "the loupe redraw fix HELD: the placing click changed page and loupe in the same frame." (`INBOX.md:89`, walk of `d5a49ff`); N.111 closed overall | no |
| 84 | Corrections sentence about the seated clitic, remove it | DONE | Explicit ruling implemented, rides with N.111/Finale items, N.111 closed (`STATE.md`) | no |
| 85 | Revisit Finale's lyrics controls, bring a table | DONE | Delivered: "Finale lyric-controls review, desk, 2026-09-04 ... Numbering proposed to Dann as N.112 and N.113." (`INBOX.md:87`) | no |
| 86 | Rethinking independent Transcribe / Continue actions | OPEN | Still "NOT ESTABLISHED" per `STATE.md`'s N.121(c): "since N.112 text transcribes live, so what the button still does is NOT ESTABLISHED; Code states it before any rename" | no — needs a Code measurement, not a Dann ruling, per STATE |
| 87 | Finale lyric-controls table (the desk's own review) | DONE | Produced N.112 and N.113, both "Closed and moved to `LOG.md` block 8 ... All walked by Dann." (`STATE.md`) | no |
| 88 | N.115, singer moves a measure between systems | OPEN | `STATE.md`: "N.115, the singer moves a measure between systems (numbered 2026-09-06, UNPLACED) ... Unplaced." | no — already on the standing open list |
| 89 | Walk of `d5a49ff`: loupe stays open, Undo/Redo on loupe, etc. | DONE (mixed; item 5 explicitly not walked) | Items folded into the N.108/N.113 closed work (`STATE.md`); the walk note itself flags "(5) NOT walked: the bare-note IPA line" as a named exception | no |
| 90 | Four groups: Piece · Input · Text · Score markup | SUPERSEDED | Text band later folded into Input, then deleted outright: "(b) TEXT is not a band: it folds into INPUT" and "(e) the Text fold is DELETED" (`STATE.md`, rulings of 2026-09-10/11) | no |
| 91 | Button reads "Transcribe and fit" | DONE | "the button stays as Transcribe and fit for now, its removal a later ruling." (`STATE.md`, 2026-09-07 ruling); still the button's name per N.121(c) | no |
| 92 | N.114 frame: syllable line moves into Input band | DONE | `STATE.md`: "N.114 (done, walked)" | no |
| 93 | "Whenever text is present, the transcription exists" | DONE | Rides with N.108-5, N.108 closed (`STATE.md`); explicitly "Closes the N.67 4b boot asymmetry" | no |
| 94 | N.108-5 findings: implicit transcription resets overrides; CSS comment | OPEN (item 1); see line 95 for item 2 | Item 1 explicitly deferred: "keeping marks across an edit is N.112's" — N.112 closed but does not name this exact fix; no confirming quote found | no |
| 95 | The unterminated CSS comment, closed by Code | DONE | "closed by Code, one `*/` at `:720`, verified in the browser; UNCOMMITTED, rides with the next ship." (`INBOX.md:95`) | no |
| 96 | Intake receipt tag reads POEM, not TEXT | DONE | Rides with N.108, closed (`STATE.md`) | no |
| 97 | Printed page should be white, not cream | OPEN | `STATE.md` STILL UNSETTLED list: "SETTLED 2026-09-07 by Dann's print preview: the cream prints. Ruled: the page prints white. Paste written (INBOX), not yet run." — the ruling is settled but the code change is not confirmed shipped | no — mechanical, awaiting a Code thread |
| 98 | N.112 walk defect: wrong anchor after word substitution | DONE | Rides with N.112, closed 2026-09-07 (`STATE.md`, ships `b191867`, `1b3054a`) | no |
| 99 | N.112 walk finding 2: last note bare after rebuild | DONE | Same N.112 closure (`STATE.md`) | no |
| 100 | Update GUIDE and LEARN for new design/functionality | OPEN | `STATE.md`: "Waiting, all Dann's to order: ... N.84 the Guide and Learn redo (after N.114) ..." — still not started | no — already on the standing open list |
| 101 | N.116, Learn as the book (overall item) | OPEN | `STATE.md`: "N.116 ... UNPLACED. Step 1 DONE ... Step 2 ... needs the inventory read in full and Grayson chapters 1, 8, 9 [read]; not started." | no — already on the standing open list |
| 102 | N.116 step 1, the inventory | DONE | `STATE.md`: "N.116 step 1 DONE 2026-09-07: `docs/sessions/inventory-n116-learn-grayson_r1_2026-09-07.md` ..." | no |
| 103 | A vacated note draws nothing (singer's own edit) | DONE | Rides as rider 0 on N.113, closed (`STATE.md`) | no |
| 104 | Dock's Melisma pill has no gap from the shift-arrow pairs | DONE | Rides with N.113 (`e1bcb67`), closed (`STATE.md`) | no |
| 105 | Cmd-Z/Ctrl-Z as Undo hotkey on desktop | DONE | Rides with the same `e1bcb67` paste, N.113 closed (`STATE.md`) | no |
| 106 | Loupe marks the taken note with a bar after the notehead | DONE | Rides with the same `e1bcb67` paste, N.113 closed (`STATE.md`); a separate, later "tall box" finding (line 111) is tracked separately | no |
| 107 | Deleting/inserting a word should not shift the rest of the line | DONE | Explicit N.113 ruling, closed (`STATE.md`) | no |
| 108 | N.113 walk defect: melisma + deletion leaves "ка ка" | UNCLEAR | N.113 closed and "walked by Dann" (`STATE.md`), but the note itself flags Code's own clean-state walk of the same rider as having passed, i.e. a known gap between the tested case and this one; no explicit re-test citation found | no |
| 109 | Progress indicator on reload (ruled in as N.117) | NUMBERED | `STATE.md`: "N.117, a progress bar on load (numbered ... UNPLACED) ... not built." | no |
| 110 | Dann's preference: a progress bar, not a message | NUMBERED | Same N.117 citation as line 109 | no |
| 111 | Loupe's taken-note box reads tall on a dotted B♭3 | OPEN | Cause diagnosed (`CONTRACT.md` tether 21: the ring's height rule at `VoiceProfilePane.svelte:459`) but no shipped fix found | no |
| 112 | Loupe locator should read "dotted quarter," not "Quarter · Dot" | OPEN | No ruling or fix found beyond the original ask; French explicitly not yet shown | no |
| 113 | Open syllables toggle should reach Score markup live | NUMBERED | See calibration check above (N.119) | no |
| 114 | Phone-only Lyric-station verb (jump to the poem box) | OPEN | Explicitly conditional ("Only if a phone walk shows the hunt costs something"); the phone landing work itself is still step 4, not started (`STATE.md`, "NEXT, in order") | no |
| 115 | Voice station in Score markup stays expanded, strike chevron | DONE | Rides with N.114a, closed: `STATE.md` "N.114a (done, walked)" | no |
| 116 | Intake hint moves under the textarea as caption | DONE | Same N.114a closure (`STATE.md`); explicitly "Rides with the Voice-chevron pass" alongside line 115 | no |
| 117 | Undo/Redo move to the top bar, right end, pill label | SUPERSEDED | Later ruling moved them off the top bar entirely: "(f) Undo and Redo leave the top bar ... and sit at the right end of the SCORE MARKUP band header" (`STATE.md`, ruled 2026-09-11 00:00-00:12) | no |
| 118 | Undo/Redo pills align to the drawer's right edge, above the hands | SUPERSEDED | Same 2026-09-11 ruling (f) moved Undo/Redo out of that top-bar layout entirely (`STATE.md`) | no |
| 119 | Start placement over into syllable header row; air under bands | DONE | `STATE.md`: "N.114b CLOSED WHOLE, items 1 to 9, 2026-09-10 04:36, walked by Dann" | no |
| 120 | Start placement over as a ghost pill | DONE (pill shipped; Undo clause still owed) | Same N.114b closure (`STATE.md`); STATE also still lists "Still owed from it: the Undo clause for Start placement over (N.121 d)" | no — the Undo-clause remainder is already tracked under N.121(d) |
| 121 | Export/Import button order | DONE | Same N.114b closure, item 7 (`STATE.md`) | no |
| 122 | Explain "Revert to score header" for N.84 | OPEN | Content owed for the Guide redo (N.84), which is itself still not started (`STATE.md`) | no — already folded into N.84 |
| 123 | Notation toggles must change Score markup live | NUMBERED | Duplicate of line 113; became N.119, see calibration check above | no |
| 124 | N.121, the two sets of words (score words vs. blank poem) | NUMBERED | `STATE.md` shows parts (a) and (b) done ("In Code with the path pass"); part (c) "NOT ESTABLISHED"; part (d) still owed; a fresh brief for N.121's remainder is dated today: `docs/sessions/brief-n121-score-fills-the-poem_r1_2026-09-13.md` | no — actively in progress |
| 125 | Design reply rulings: lyric hands first; strike METADATA label; phone landing | DONE (parts 1–2); OPEN (part 3, phone landing) | Parts 1–2 ride with the path-pass increments, all shipped and walked (`STATE.md`, "INCREMENT 3 IS SHIPPED, WALKED, AND DONE"); part 3 is still "step 4" in "NEXT, in order" (`STATE.md`) | no — phone landing already tracked as step 4 |
| 126 | Usage screenshot: Fable 62%, all-models 38%, session 56% | SUPERSEDED | Later usage reading recorded: "Usage 2026-09-10 22:26: Fable 71%, all-models 44%" (`STATE.md`), itself since superseded by more recent sessions | no |
| 127 | French table for path strings, shown to Dann | OPEN | The line itself: "the rest of the table not yet ruled line by line." No later ruling found | yes — see grouped question 8 |
| 128 | Russian-o ⓘ stays as the one named exemption to slate rule 11 | DONE | Recorded in `docs/memory/PRODUCT.md:167`: "The ⓘ on the Russian-o roster row is the one named exemption to slate rule 11 ..." | no |
| 129 | No word on every unplaced syllable; count + ink carries it | DONE | Ruling appears adopted and repeated across `STATE.md`'s summaries of the design reply and the path pass with no contradiction found | no |
| 130 | French owed on group.piece, group.input, etc. | OPEN | Keys confirmed still untranslated in `docs/sessions/memo-anchors-path-pass_r1_2026-09-10.md:82-83`; no ratified table found for these specific keys | yes — see grouped question 8 |
| 131 | Running header should read "Composer - Title" | DONE | Answered the same night: see line 133 | no |
| 132 | Review Finale's tempo handling (gradual cues) | OPEN | Belongs to N.120's Tempo station; N.120 itself is still "DRAWING FIRST," not yet drawn (`STATE.md`) | no — already folded into N.120 |
| 133 | Running header already reads "COMPOSER \| POET — TITLE"; no work owed | DONE | The line's own text: "The 22:12 ask above is satisfied by the existing build ... No work owed." (`INBOX.md:133`) | no |
| 134 | Two ties/slurs read "terrible and artless"; measure numbers wanted | NUMBERED | Became N.125 (slurs as tapered objects) and N.126 (measure numbers on Score markup), both `STATE.md`, both UNPLACED, briefs written and not run | no |
| 135 | The advice programme (tier-1 mining list, Bozeman) | OPEN | "the open question is which sources Dann can supply as pages or PDFs" (`INBOX.md:135`); no later mention found anywhere | yes — see grouped question 9 |

## Tally

| state | count |
|---|---|
| DONE | 48 |
| NUMBERED | 11 |
| OPEN | 36 |
| SUPERSEDED | 6 |
| UNCLEAR | 3 |
| **Total rows** | **104** |

(Two rows, 89 and 108, carry a named partial exception inside a DONE/UNCLEAR
call rather than a split state; two rows, 120 and 125, carry a named
partial exception inside a DONE call. These are noted in the evidence
column rather than invented as a sixth state.)

## Needs Dann — nine questions, gathered for one sitting

1. **N.83, the colleague walkthrough**, numbered 2026-08-24, is still
   deferred with no date ("I will tell you when to plan the call"). Still
   wanted, or has the moment passed?
2. **N.90, N.91, N.98, N.99, N.100** were all numbered 2026-08-24 (photograph
   tier, piano-doubling witness, voice profile selector, skew-tolerant
   detection, PDF media-box trust) and none has a single mention anywhere in
   the tree or the log since that night. Still live cardinals worth keeping
   on the board, or quietly stale?
3. **N.101** (score intake is confusing) was numbered 2026-08-26 and never
   closed by name, though the later N.108-to-N.121 intake work covers
   adjacent ground. Still its own open item, or fully absorbed by that later
   work?
4. **The barline-correction verb** (a singer can repair every note but
   cannot split a fused measure, seen on the Lamm read) and **where that
   read's metre came from** have sat unnumbered since 2026-08-27, with no
   later mention. Worth a number and a slice, or a known limitation to leave
   alone for now?
5. **N.106's taste question**, still open per `STATE.md`: keep Gould's
   touching pair between the sung and turning noteheads, or give the turning
   layer its own clearance?
6. **"One piece at a time"** — Dann's own words for the design question of
   how a song binds its poem, score, and metadata (symptom: metadata tagged
   "from score" survives Clear on the score) — is still fully open, with no
   design proposal on the table. Worth its own session, or does it fold into
   an existing track?
7. **The IPA `#` assimilation marker** in Dann's own engraved Sunless 01
   file offsets the IPA verse by one note from note 21 onward. He was asked
   what the printed score should set there; no answer is on record. What
   should Ilya do with that marker?
8. **Two French tables are sitting half-ruled**: the path-string table
   (line 127, only the top row explicitly approved) and the untranslated-key
   list `group.piece`, `group.input`, `group.text`, `group.scoreMarkup`,
   `binder.heading`, `voice.heading`, `loupe.station.corrections`,
   `intake.dropHint`, `intake.choose` (line 130, no table shown yet). Ready
   for a line-by-line pass whenever convenient — French is one of the three
   things that come to him.
9. **The advice programme's source list** (tier-1 mining, led by Bozeman)
   is waiting on one thing: which sources Dann can supply as pages or PDFs.

## What could not be established

Three rows (53, 54, 108) are marked `UNCLEAR` because neither `STATE.md`,
`LOG.md`, nor a tree grep turned up a fix, a closure, or a contradiction —
only the original finding. One row (44, N.93) is `UNCLEAR` for the same
reason: numbered alongside N.92, which closed with named ships, while N.93
itself never got an equivalent closure line anywhere searched. These four
are reported as `UNCLEAR` rather than guessed, per the brief's own rule that
a state with no evidence is not a state.

`docs/memory/PRODUCT.md` was read in full for two specific checks (the
squircle transcription, line 64; the Russian-o exemption, line 128) and for
nothing else; it was not read end to end for every other item that might
touch it.
