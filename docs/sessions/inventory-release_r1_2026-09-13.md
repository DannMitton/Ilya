# Inventory — release cut, Ilya

Read-only inventory. Nothing here is sorted by priority, ranked, or recommended.
Inputs: `docs/memory/STATE.md` (765 lines), `docs/memory/OPEN.md` (216 lines),
`docs/memory/INBOX.md` (164 lines), `docs/sessions/memo-footprint-and-release-arithmetic_r1_2026-09-13.md`
(153 lines), all read in full. `docs/sessions/LOG.md` (3912 lines) was grepped,
not read, to check closure only.

**Method note on closure checks.** A number of INBOX lines carry the phrase
"rides with the next paste" or "same paste" attached to a small CSS/behaviour
fix, tied to a brief (N.108, N.112, N.113, N.114/N.114a) that LOG.md confirms
CLOSED. Where I found no exact matching sentence in LOG.md for that specific
sub-fix, I inferred it shipped with the closed parent brief rather than
grepping every line individually, and I EXCLUDED it from the table below on
that inference. This is named here, once, rather than hedged on every row.
Anywhere I kept an item in the table despite a plausible-but-unconfirmed
closure, that uncertainty is repeated in `WHAT I COULD NOT ESTABLISH`.

---

## Count

**114 open items found**, counted directly off the rows of the table below.

By build state:
- SHIPPED-PARTIAL: 2 (N.94, N.116)
- BUILT-NOT-SHIPPED: 0
- BRIEFED: 8 (N.110, N.114b items 6–9, N.117, N.118, N.119, N.125, UNSETTLED-7, COLOUR-5)
- SPEC-ONLY: 32
- NOT STARTED: 22
- NOT ESTABLISHED: 50 (the majority — most INBOX and STILL UNSETTLED lines state a question or a finding, not a build state)

By document touched:
- Text: 11
- Markup: 33
- Insights: 6
- more than one: 19
- none of the three: 28
- NOT ESTABLISHED: 17

These two breakdowns are counts of rows in the table below, not of engineering
effort — a one-line INBOX question and a six-stage colour plan both count once.

---

## The table

| id | name | source | build state | evidence | touches | blocked by | closed already? |
|---|---|---|---|---|---|---|---|
| N.6 | (named only, no spec in these five files) | STATE.md §THE TRACKER "The visible list" | NOT ESTABLISHED | "**N.6**" (no further text) | NOT ESTABLISHED | nothing stated | no |
| N.17 | 100vh remnants | STATE.md §THE TRACKER "The visible list"; LOG.md (audit finding) | NOT ESTABLISHED | "three `100vh` remain (N.17, unchanged)" | NOT ESTABLISHED | nothing stated | no |
| N.19 | `updatedAt` written, rendered nowhere | STATE.md §THE TRACKER "The visible list"; LOG.md (audit finding) | NOT ESTABLISHED | "`updatedAt` written five times, rendered nowhere (N.19, unchanged)" | NOT ESTABLISHED | nothing stated | no |
| N.27 | library save recommendation, not built | STATE.md §THE TRACKER | SPEC-ONLY | "the recommendation is IN THE TREE as a comment at the reporting seam... deliberately not built" | NOT ESTABLISHED | nothing stated | no |
| N.28 | (ships on N.67 step 5 binder) | STATE.md §THE TRACKER | NOT ESTABLISHED | "**N.28** ships on N.67's step 5 binder." | NOT ESTABLISHED | nothing stated | no |
| N.45 | N.45's remainder | STATE.md §THE TRACKER, §RULINGS DANN OWES | NOT ESTABLISHED | "**N.45's remainder.**" | NOT ESTABLISHED | nothing stated | no |
| N.48 | may be unclosable | STATE.md §THE SCHEMA | NOT ESTABLISHED | "N.48 may be unclosable; it needs a `[u]` that fails." | NOT ESTABLISHED | nothing stated | no |
| N.51 | per-tab colour past the tab bar | STATE.md §THE TRACKER, §STILL UNSETTLED | NOT ESTABLISHED | "whether per-tab colour may propagate past the tab bar" | NOT ESTABLISHED | nothing stated | no |
| N.61 | (named only) | STATE.md §THE TRACKER "The visible list" | NOT ESTABLISHED | "**N.61**" (no further text) | NOT ESTABLISHED | nothing stated | no |
| N.82 | the watch band's French | OPEN.md; LOG.md | SPEC-ONLY | "Bigger than the enumeration knew: header, all eight `watchEntryLine` branches... print English in French mode" | Markup | nothing stated | no |
| N.83 | walkthrough call | OPEN.md "Waiting, all Dann's to order"; LOG.md | NOT STARTED | "N.83's walkthrough call... his to schedule" | none of the three | nothing stated | no |
| N.84 | Guide and Learn redo | OPEN.md; STATE.md text-to-score sequence | SPEC-ONLY | "N.84 the Guide and Learn redo (after N.114)" | none of the three | N.114 (per OPEN.md ordering) | no |
| N.84 (Revert-to-score-header) | explain Revert to score header in the Guide | OPEN.md "For N.84 (Guide)" | SPEC-ONLY | "explain Revert to score header; a music file carries its own header text. Filed in INBOX with the mechanism." | Text | nothing stated | no |
| N.85 | the open-source front door | LOG.md (ratified-order table) | SPEC-ONLY | "README, CONTRIBUTING, code of conduct... Must carry: free on purpose, well-built on purpose" | none of the three | nothing stated | no |
| N.86 | dead-code and structure audit | LOG.md | SPEC-ONLY | "One reading pass, two outputs: dead code to delete... and structural intuitiveness for contributors" | none of the three | nothing stated | no |
| N.87 | optimizations | LOG.md | SPEC-ONLY | "Perceive, confer with Dann, then execute. Needs N.86's findings first" | none of the three | N.86 | no |
| N.88 | marketing materials | LOG.md | SPEC-ONLY | "Last on purpose: describes the cleaned-up product" | none of the three | N.85–N.87 (implied by "last on purpose") | no |
| N.89 | document furniture | OPEN.md; LOG.md | SPEC-ONLY | "ratified from drawings" (OPEN.md); "header/footer became N.89" (LOG.md) | Markup | nothing stated | no |
| N.90 | the photograph tier | INBOX.md 2026-08-24; LOG.md | SPEC-ONLY | "the photograph tier, mapped by the OMR field report and vocal-line brief" | NOT ESTABLISHED | nothing stated | no |
| N.91 | piano-doubling witness / OpenScore Lieder benchmark | INBOX.md 2026-08-24; LOG.md | SPEC-ONLY | "the piano-doubling witness as pitch verifier, and OpenScore Lieder as the CC0 accuracy-benchmark corpus" | NOT ESTABLISHED | nothing stated | no |
| N.93 | easy text entry interfaces | INBOX.md 2026-08-24; LOG.md | SPEC-ONLY | "easy text entry interfaces for the poem and underlay" | Text | nothing stated | no |
| N.94 | transposition interface | STATE.md §THE ONE THING "N.94 HAS A HOME AGAIN"; INBOX.md 2026-09-13(c) | SHIPPED-PARTIAL | "the ENGINE already exists and ships. `packages/score-parser/src/transposition.ts` exports `transposeScore`... Only the control is missing." | Markup | nothing stated | no |
| N.98 | voice formant profile selector | INBOX.md 2026-08-24 | SPEC-ONLY | "A dropdown for teachers with busy studios to switch among multiple stored voice profiles, modelled on the library save function." | NOT ESTABLISHED | nothing stated | no |
| N.99 | skew-tolerant staff detection | INBOX.md 2026-08-24 | SPEC-ONLY | "the primary row detector self-abstains... the slice fallback loses 6 of 55 line rows... the gap is skew tolerance" | none of the three (reader/ingest) | nothing stated | no |
| N.100 | PDF route must not trust the media box | INBOX.md 2026-08-24 | SPEC-ONLY | "the 400 dpi rasterization makes a 151-megapixel image and the route dies before the reader runs" | none of the three (ingest) | nothing stated | no |
| N.101 | score intake is confusing | INBOX.md 2026-08-26; LOG.md | SPEC-ONLY | "make intake legible to a new user, states named, nothing silent" | Text | nothing stated | no |
| N.102 increment 1c | courtesy accidentals on the turning layer | INBOX.md 2026-09-02; STATE.md §THE TRACKER | SPEC-ONLY | "courtesy accidentals on the TURNING layer too, parenthesized, in lavender... Dann expects the turning layer to carry them" | Markup | nothing stated | no |
| N.102 increment 2 | the singer's own courtesy-accidental control | LOG.md | NOT STARTED | "**Increment 2**, the singer's own control with its French, waits on Dann." | Markup | nothing stated | no |
| N.110 | the [i] extractor harness | OPEN.md | BRIEFED | "set aside by Dann, briefed (`brief-n110-i-extractor-harness_r1_2026-09-02.md`), not built" | NOT ESTABLISHED | nothing stated | no |
| N.114b items 6–9 | air, export/import order, collapse row, ghost pill | STATE.md §THE ONE THING (N.114b block) | BRIEFED | "items 6 to 9 BRIEFED, NOT RUN, all in `docs/sessions/brief-n114b-pills-over-the-drawer_r1_2026-09-10.md`" | Text | nothing stated | no |
| N.115 | move a measure between systems | OPEN.md; LOG.md | SPEC-ONLY | "Finale's arrow-up on a selected measure. Research Finale first (his ask), then find the tree's orphaned-measure rule." | Markup | nothing stated | no |
| N.116 | Learn as the book | OPEN.md | SHIPPED-PARTIAL | "Step 1 DONE... Step 2, the desk's proposed sequence, needs the inventory read in full and Grayson chapters 1, 8, 9" | none of the three | nothing stated | no |
| N.117 | a progress bar on load | OPEN.md; STATE.md (brief list) | BRIEFED | "Dann wants a progress bar, not a message... What the bar measures is NOT ESTABLISHED"; brief `brief-n117-dictionary-fill_r1_2026-09-12` | NOT ESTABLISHED | nothing stated | no |
| N.118 | punctuation travels in the slot | OPEN.md; STATE.md (brief list) | BRIEFED | "give the word's LAST syllable its trailing punctuation inside `buildSlotQueue`... After N.114 unless he places it" | Markup | N.114 (per OPEN.md) | no |
| N.119 | Notation toggles reach Score markup live | OPEN.md; STATE.md | BRIEFED | "Code reads which toggles reach it. Own brief." / "five of the seven Notation toggles already reach Score markup" | more than one | nothing stated | no |
| N.120 | Corrections station redesigned | OPEN.md | SPEC-ONLY | "DRAWING FIRST, citing the station shape ruled 2026-08-13... then a Fable pass if Dann wants one, then Code" | Markup | nothing stated | no |
| N.120 (Tempo station) | Tempo station inside N.120 | OPEN.md | SPEC-ONLY | "the seam is built (E.20)... per-region override NOT ESTABLISHED in the tree" | Markup | nothing stated | no |
| N.121(a) | placeholder text and the way in | OPEN.md | NOT ESTABLISHED | "placeholder \"Paste, type, or drop your poem here.\"... In Code with the path pass." | Text | nothing stated | no — not confirmed in LOG.md by exact quote |
| N.121(b) | "37 / 94 placed" string | OPEN.md | NOT ESTABLISHED | "RULED 2026-09-10: \"37 / 94 placed\", « 37 / 94 placées ». In Code." | Text | nothing stated | no — not confirmed in LOG.md by exact quote |
| N.121(c) | what "Transcribe and fit" still does | OPEN.md | SPEC-ONLY | "since N.112 text transcribes live, so what the button still does is NOT ESTABLISHED; Code states it before any rename" | Text | nothing stated | no |
| N.121(d) | Undo clause for Start placement over | OPEN.md; STATE.md (N.114b block); LOG.md | NOT STARTED | "Undo for Start placement over is NOT wired: no existing clause fits; the sentence is Dann's to rule" | Text | nothing stated | no — LOG.md itself still lists it owed ("Still owed from it: the Undo clause for Start placement over (N.121 d)") |
| N.121 (unbuilt half) | score's words never fill an empty poem box | OPEN.md; STATE.md §THE ONE THING | SPEC-ONLY | "No path anywhere fills the poem box from an ingested score's lyrics... Brief to be written under N.121, not a new cardinal." | more than one | nothing stated | no |
| N.122 | the capture surface as a landmark | OPEN.md | SPEC-ONLY | "DRAWN r1, 2026-09-10 late... Wizard spec v1 and pacifier spec v11 NOT OPENED; open them before Code is briefed" | more than one | nothing stated | no |
| N.123 | the aggregation layer / tessituragram | OPEN.md | SPEC-ONLY | "One layer under four figures... UNPLACED, displaces nothing until he places it" | Insights | nothing stated | no |
| N.124 | repertoire for a studio | OPEN.md | SPEC-ONLY | "UNPLACED, after N.123... Needs: N.123; the singer's floor and ceiling from calibration... a multi-voice library, NOT ESTABLISHED as existing" | Insights | N.123 | no |
| N.125 | slurs as tapered objects | OPEN.md | BRIEFED | "Brief WRITTEN, UNTRACKED: `docs/sessions/brief-n125-slurs-as-objects_r1_2026-09-11.md`" | Markup | nothing stated | no |
| N.126 | bar numbers on Score markup | STATE.md §RULINGS DANN OWES sub-section | SPEC-ONLY | "measure numbers on Score markup, UNPLACED" | Markup | nothing stated | no |
| N.127 increment 2 | Insights' compass | STATE.md §THE ONE THING | NOT STARTED | "Increment 2 is the compass." | Insights | nothing stated | no |
| N.129 | underlay spaced in wrong font's metrics | STATE.md §THE ONE THING; INBOX.md 2026-09-12/13 | SPEC-ONLY | "Candidate fixes, unruled: remeasure the table in Source Sans 3, or make the face a parameter" | Markup | nothing stated | no |
| OWED-1 | `columnAdvance` reserves no room for the turning layer | STATE.md §OWED | SPEC-ONLY | "Closing it means teaching the layout pass an analysis-layer measurement; it belongs with N.103's spacing work... NOT ESTABLISHED" | Markup | nothing stated | no |
| OWED-2 | three residues of N.104's loupe fix | STATE.md §OWED | NOT ESTABLISHED | "None is a regression, all three predate it, and all three want numbers." (three sub-findings quoted in source) | Markup | nothing stated | no |
| OWED-3 | trace `stem_dir`'s consumers in the reader | STATE.md §OWED | NOT ESTABLISHED | "Whether any stage treats it as evidence is NOT ESTABLISHED. If one does, it is a defect against Dann's own scores" | none of the three (reader) | nothing stated | no |
| OWED-4 | `positionalUp`'s Gould citation, apply next touch | STATE.md §OWED | NOT ESTABLISHED | "**Apply the citation the next time that file is touched.**" | Markup | nothing stated | no |
| OWED-5 | the Gould re-shoot, four spots | STATE.md §OWED | NOT STARTED | "p. 18's three-beam paragraph, and the small diagram numerals on pp. 16, 19, and 21" | none of the three | nothing stated | no |
| OWED-6 | step 5's export, single-song half | STATE.md §OWED | NOT STARTED | "Dann's ruling: deferred, recorded as owed against step 5, NOT folded into 4a" | none of the three | nothing stated | no |
| OWED-7 | remove `bits-ui` from `apps/web/package.json` | STATE.md §OWED | NOT ESTABLISHED | "Dann's ruling on timing: not in step 4's commit... Do it clean, on its own." | none of the three | nothing stated | CONTRADICTORY — LOG.md ("`bits-ui` removed") describes the 2026-08-16 session as having removed it, but STATE.md's own current §OWED still lists it as to-do. See WHAT I COULD NOT ESTABLISH. |
| OWED-8 | ILYA-REGISTER needs revision 11 | STATE.md "Register corrections owed" | NOT STARTED | "Its N.55a row is FALSE... Its N.55b row is stale. **The blocking number is now THREE.**" | none of the three | nothing stated | no |
| RULING-1 | the release cut | STATE.md §RULINGS DANN OWES | NOT ESTABLISHED | "name the items a first public Ilya contains, freeze that list, and move the rest to a post-release file" | more than one | nothing stated | no |
| RULING-2 | the release order contradicts itself | STATE.md §RULINGS DANN OWES | NOT ESTABLISHED | "His ruling of 2026-08-24 set the order N.83...N.88... His text-to-score sequence of 2026-09-06 lists it as...N.85 to N.88, then N.84, then N.83" | none of the three | nothing stated | no |
| RULING-3 | binding squircle's footprint on Insights page one | STATE.md §RULINGS DANN OWES | SPEC-ONLY | "Design proposes two treatments, Dann rules (2026-09-11)." | Insights | nothing stated | no |
| UNSETTLED-1 | where storage notices belong | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "They render in the FIT drawer only, so a singer working in Transcription never sees a save failure" | more than one | nothing stated | no |
| UNSETTLED-2 | storage strings still say "syllable placements" | STATE.md §STILL UNSETTLED | NOT STARTED | "the save is now the whole song. Design §7 puts that copy in step 6, with the French shown to Dann first" | more than one | nothing stated | no |
| UNSETTLED-3 | "The page carries no chrome." / "Do not introduce a slider." | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | quoted verbatim as two standing lines with no further context in these files | NOT ESTABLISHED | nothing stated | no |
| UNSETTLED-4 | whether `claude/shane-project-map_2026-07-25.md` is stale | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "Unopened for twelve sessions." | none of the three | nothing stated | no |
| UNSETTLED-5 | D3's Job A, per-verse reprints | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "ruled in E.36 and still unnumbered" | NOT ESTABLISHED | nothing stated | no |
| UNSETTLED-6 | the per-format score arrival audit | STATE.md §STILL UNSETTLED | NOT STARTED | "asked for in E.45 and never written" | NOT ESTABLISHED | nothing stated | no |
| UNSETTLED-7 | print white / `stripBackingRect` fix, ruled but not run | STATE.md §STILL UNSETTLED; OPEN.md "The print fix" | BRIEFED | "SETTLED 2026-09-07 by Dann's print preview: the cream prints. Ruled: the page prints white. Paste written (INBOX), not yet run." | Markup | nothing stated | no |
| UNSETTLED-8 | marks on the printed page (VERIFY box, USER OVERRIDE badge) | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "CONTRACT §6 forbids a mark that says Ilya is unsure. Whether these are the ruled exception was not checked." | Markup | nothing stated | no |
| UNSETTLED-9 | `VoiceProfilePane.svelte:295-313` duplicate header arithmetic | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "Fit's paper does not yet share the Transcribe paper's single `HEADER_GAP`." | more than one | nothing stated | no |
| UNSETTLED-10 | whether `.mscz` ingest succeeds in a browser | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "The path is live in code... but `i18n.ts:272` still carries a \"coming soon\" string for it. Nobody has run it." | none of the three (ingest) | nothing stated | no |
| COLOUR-1 | colour ramp spacing, ruling 1 of 4 | STATE.md §THE ONE THING | SPEC-ONLY | "RULED 1 OF 4, RATIFIED BY DANN 2026-09-13. THE RAMP IS EVEN... **Applies at STAGE 4, not before. Nothing reaches the screen until then.**" | more than one | stage 4 | no |
| COLOUR-2 | which neutrals consolidate, ruling 2 of 4 | STATE.md §THE ONE THING | NOT STARTED | "**The neutrals.** Which of them consolidate... two pairs inside 0.02 lightness of each other" | more than one | nothing stated | no |
| COLOUR-3 | the strays, ruling 3 of 4 | STATE.md §THE ONE THING | NOT STARTED | "`--light-sage`, `--light-lavender`, `--deeper-sage`, `--muted-lavender`: each becomes a role in the grammar, or goes." | Markup | nothing stated | no |
| COLOUR-4 | the fourth value's name, ruling 4 of 4 | STATE.md §THE ONE THING | NOT STARTED | "Rose's label ink is the inline `#8A5C5C` today. Every family gets a fourth name, or none does." | more than one | nothing stated | no |
| COLOUR-5 | colour token rename, stage 3a | STATE.md §THE ONE THING | BRIEFED | "already briefed as `brief-colour-token-rename_r1_2026-09-13.md`, about 95 call sites, no value changes, no gate movement" | more than one | rulings 1–4 (COLOUR-1..4) | no |
| COLOUR-6 | Text/Markup/Melody names + tab padding, not yet built | STATE.md §THE ONE THING ("THE NAMES") | NOT ESTABLISHED | "**OWED: nobody has seen 0.5 rem on screen.**" | Text, Markup | nothing stated | no |
| COLOUR-7 | transcribe colour principle into PRODUCT.md | INBOX.md 2026-09-13 | NOT STARTED | "RULED BY DANN. **THE COLOUR STORY, SETTLED. Transcribe into PRODUCT.md at the next touch.**" | none of the three | nothing stated | no |
| COLOUR-8 | umber adoption undecided | STATE.md §OWED-adjacent (INBOX.md 2026-09-13) | SPEC-ONLY | "SELECTED BY DANN, NOT ADOPTED... NOTHING IS ASSIGNED TO IT and no destination uses it; it is on the shelf." | none of the three | nothing stated | no |
| STRUCT-1 | Voice extracts from Score markup into its own band | STATE.md §THE ONE THING | SPEC-ONLY | "`Voice` extracts from Score markup to become a band sibling of Piece, Input and Melody." | more than one | colour story stage 4 (implied — "Applies at STAGE 4") | no |
| PROC-1 | sequential, linear release-readiness checklist | INBOX.md 2026-09-13 | NOT STARTED | "A sequential, linear checklist he can use as a roadmap to a satisfactory release... QUEUED FOR IMMEDIATELY AFTER THE COLOUR STORY CLOSES" | none of the three | colour story closing; RULING-1 (the release cut) | no |
| INBOX-1 | mid-system metre change placement | INBOX.md table, I.03 | NOT ESTABLISHED | "HIS RULING DOES NOT REACH A MID-SYSTEM METRE CHANGE... Still open, and still his." | Markup | nothing stated | no |
| INBOX-2 | WCAG accessibility in marketing capabilities list | INBOX.md 2026-08-18 | NOT STARTED | "Mention WCAG accessibility in Ilya's marketing capabilities list" | none of the three | nothing stated | no — LOG.md notes "The WCAG marketing line is not a build item and stays where it is," i.e. explicitly parked, not closed |
| INBOX-3 | hamburger menu alternative navigation | INBOX.md 2026-08-20 | NOT ESTABLISHED | "His own question: is this too much?" | more than one | nothing stated | no — LOG.md: "Parked: ... the hamburger menu." |
| INBOX-4 | "Français" toggle has no `lang` attribute | INBOX.md 2026-08-20 | NOT ESTABLISHED | "a screen reader pronounces it with English phonetics. WCAG language-of-parts." | none of the three | nothing stated | no — see WHAT I COULD NOT ESTABLISH (ambiguous LOG.md phrasing) |
| INBOX-5 | colour print prints greyscale except the flag | INBOX.md 2026-08-24 | NOT ESTABLISHED | "colour print prints greyscale except the flag; intentional?" | Markup | N.83 | no — LOG.md: "Colour on paper: PARKED behind N.83." |
| INBOX-6 | smartwatch formant capture | INBOX.md 2026-08-24 | NOT STARTED | "can a smartwatch capture formant readings and relay them to Ilya on a phone or laptop?" | none of the three | nothing stated | no — LOG.md: "the smartwatch formant question remains in the inbox, unruled." |
| INBOX-7 | restore/reload busy indicator | INBOX.md 2026-08-25 | NOT STARTED | "a reload takes a few seconds before the song reappears; offer a busy indicator saying nothing is wrong or lost" | Text | nothing stated | no |
| INBOX-8 | mobile pitch editing | INBOX.md 2026-08-25 | NOT ESTABLISHED | "locate-then-edit across two screens is untenable on a phone... Dann says this blocks release" | Markup | Studio ruling (per its own text) | no — see WHAT I COULD NOT ESTABLISH (LOG.md says this line was "absorbed" into a track, but the current INBOX.md carries it unstruck) |
| INBOX-9 | mobile navigation | INBOX.md 2026-08-25 | NOT ESTABLISHED | "navigation on mobile is abysmal, needs help... Own session after the Thursday walkthrough, Studio ruling open first" | more than one | Studio ruling (per its own text) | no — same LOG.md "absorbed" ambiguity as INBOX-8 |
| INBOX-10 | print button under paper on a phone | INBOX.md 2026-08-26 | NOT ESTABLISHED | "`.paper-fit` flex-shrinks 1528 to 793.4 px so the Print button lands beneath the paper in portrait... Dann to rule when it rides" | more than one | nothing stated | no — see WHAT I COULD NOT ESTABLISH (a later walk quote in LOG.md, "the print button appears just as you say," may or may not be this same defect) |
| INBOX-11 | floor-commit restore flakiness | INBOX.md 2026-08-26 | NOT ESTABLISHED | "the score reverted to the empty envelope in 3 of 6 automated runs... Unexplained by a CSS deletion; possibly the harness" | none of the three | nothing stated | no |
| INBOX-12 | tether 20 draft, held | INBOX.md 2026-09-01 | NOT ESTABLISHED | "HELD BY DANN, not written into CONTRACT.md... Reconsider it when the retirement pass runs" | none of the three (process) | nothing stated | no — note: the number "tether 20" was later used for a different, unrelated ruling ("put yourself in his position," per project doc list and LOG.md), so this draft's own number is stale even though the proposal itself was never ruled |
| INBOX-13 | barline correction | INBOX.md 2026-08-27 | NOT STARTED | "the entry grammar has no barline verb, so a singer can repair every note but cannot split a fused measure. Wants a number and a slice." | Markup | nothing stated | no |
| INBOX-14 | Lamm read's metre provenance | INBOX.md 2026-08-27 | NOT ESTABLISHED | "Which glyphs `timesig.py` matched on this plate, or what default fired, is NOT ESTABLISHED. One Code measurement answers it; rides with the barline-correction number." | none of the three | INBOX-13 | no |
| INBOX-15 | arrow-key hotkeys for the stepper | INBOX.md 2026-08-27 | NOT STARTED | "map keyboard left and right arrows to the stepper... Belongs to slice 4, the desktop slice." | Markup | nothing stated | no |
| INBOX-16 | a named Redo pill | INBOX.md 2026-08-27 | NOT ESTABLISHED | "a named Redo pill beside Undo, present only immediately after an undo... Wants a number; small." | Markup | nothing stated | no — see Items that may be duplicates |
| INBOX-17 | transcribe squircle ruling into PRODUCT.md | INBOX.md 2026-08-27 | NOT STARTED | "Recorded here because the desk had not read PRODUCT.md this session and would not write it blind. Transcribe into PRODUCT.md next session" | none of the three | nothing stated | no |
| INBOX-18 | plausibility guard only judges at capture | INBOX.md 2026-09-02 | NOT ESTABLISHED | "the plausibility guard judges readings at capture only... run `expectedF1`/the guard on stored readings at snapshot time" | Insights | nothing stated | no |
| INBOX-19 | "one piece at a time" design question | INBOX.md 2026-09-03 | NOT ESTABLISHED | "Design question about how a song binds poem, score, and metadata; the walk's own fixture-on-a-Mussorgsky-poem mismatch sharpened it." | more than one | nothing stated | no |
| INBOX-20 | `#` assimilation marker in engraved IPA verse | INBOX.md 2026-09-03; OPEN.md ("small" list) | NOT ESTABLISHED | "Not numbered; Dann to say what the printed score sets there." | Markup | nothing stated | no — see Items that may be duplicates (same finding named in both files) |
| INBOX-21 | re-seated cell loses its punctuation | INBOX.md 2026-09-04 | NOT ESTABLISHED | "a re-seated cell loses its punctuation (я, becomes я) because the slot queue's Cyrillic is unpunctuated. Inbox candidate for increment 3 or its own item." | Markup | nothing stated | no |
| INBOX-22 | last note of a seated piece can be undecided and stale | INBOX.md 2026-09-04 | NOT ESTABLISHED | "on a lyric-bearing score, undecided draws the file's stale text (ночь о ди но ка ка)... The engraving lost its final я off the end; Dann's file to fix." | Markup | nothing stated | no |
| INBOX-23 | stray IPA 'a' on a blanked note before seating | INBOX.md 2026-09-04 | NOT ESTABLISHED | "A blanked note draws a stray IPA 'a' in the loupe before the hand seats anything; the Cyrillic is bare as ruled but the IPA line is not." | Markup | nothing stated | no |
| INBOX-24 | Undo/Redo on the loupe itself | INBOX.md 2026-09-07 (walk of d5a49ff) | NOT ESTABLISHED | "RULED: Undo and Redo on the loupe, for placements as well as shifts. His words: \"we do not include an Undo/Redo button on the Loupe. We need one.\"" | Markup | nothing stated | no — see WHAT I COULD NOT ESTABLISH (later work put Undo/Redo in the top bar instead; whether that satisfies this ask on the loupe itself is NOT ESTABLISHED from these five files) |
| INBOX-25 | loupe taken-note box reads "tall" on a dotted note | INBOX.md 2026-09-09 | NOT ESTABLISHED | "Loupe's taken-note box reads weird (tall) on the dotted B♭3, Without Sun no. 1 m. 2; Dann: adjust it." | Markup | nothing stated | no |
| INBOX-26 | loupe locator phrasing "dotted quarter" | INBOX.md 2026-09-09 | NOT ESTABLISHED | "Dann wants \"dotted quarter\" (and the double-dot form) instead of \"Quarter · Dot\". French to be shown to him." | Markup | nothing stated | no |
| INBOX-27 | phone-only Lyric-station jump-to-word verb | INBOX.md 2026-09-09 | NOT ESTABLISHED | "Only if a phone walk shows the hunt costs something." | Markup | a phone walk (per its own text) | no |
| INBOX-28 | Voice station chevron struck | INBOX.md 2026-09-09 | NOT ESTABLISHED | "the Voice station in Score markup stays expanded always; strike its chevron... Small, unnumbered, Code's next pass over `+page.svelte`'s stations." | Markup | nothing stated | no |
| INBOX-29 | intake hint moves under the textarea | INBOX.md 2026-09-09 | NOT ESTABLISHED | "the intake hint (`intake.dropHint`, approved copy, unchanged) moves to sit directly under the textarea... Rides with the Voice-chevron pass." | Text | INBOX-28 (its own text says it rides with that pass) | no |
| INBOX-30 | phone: primary action lands on page, Back goes home | INBOX.md 2026-09-10 (Design reply rulings) | NOT STARTED | "on a phone, a step's primary action lands the singer on the page and Back brings them home (read against portrait C before Code)" | more than one | "portrait C" (read against it before Code, per its own text) | no |
| INBOX-31 | record the ⓘ Russian-o exemption in PRODUCT.md | INBOX.md 2026-09-10 | NOT STARTED | "opens the sung-[o] Learn note, ruled 2026-07-11... Record the exemption in PRODUCT.md with the grammar." | Text | nothing stated | no |
| INBOX-32 | French path-strings table, not ruled line by line | INBOX.md 2026-09-10 | NOT ESTABLISHED | "the rest of the table not yet ruled line by line" | more than one | nothing stated | no |
| INBOX-33 | file-naming scheme for a growing library | INBOX.md 2026-09-10 | NOT ESTABLISHED | "he is also thinking about how to name the files so a growing library stays organized... The file-naming half of that line stays open." | none of the three | nothing stated | no |
| INBOX-34 | advice programme sources for Insights | INBOX.md 2026-09-11 | NOT ESTABLISHED | "the open question is which sources Dann can supply as pages or PDFs" | Insights | nothing stated | no |

---

## Items that may be duplicates

No recommendation on any of these; they are given as separate rows above per
the task's own rule, and are flagged here only because the same fact appears
in more than one source or more than one place in the same source.

- **INBOX-16 (a named Redo pill, 2026-08-27, unbuilt at the time)** and **the
  shipped Undo/Redo pair in the top bar (N.114a, closed, and N.114b, DONE
  items 1–5)**. INBOX-16 was never struck or promoted to a number, and the
  later Undo/Redo work is a top-bar pair rather than a pill "beside Undo,
  present only immediately after an undo," so I could not establish whether
  INBOX-16 is the same ask, fully superseded, or still distinct.
- **INBOX-20 (the `#` assimilation marker, INBOX.md 2026-09-03)** and
  **OPEN.md's own "small" list line, "the `#` marker in Dann's engraved IPA
  verse (his file, not Ilya)"**. Same finding, described in both files;
  neither says it was promoted to a number.
- **INBOX-24 (Undo/Redo requested on the loupe itself, 2026-09-07)** and the
  **later, separately ruled Undo/Redo pills moved to the top bar** (N.114a,
  N.114b). Possibly the same ask resolved a different way, possibly two
  different asks (a loupe-local control versus a global one); not established
  which.
- **N.106 (closed, "the turning unit keeps to the right of the sung unit,"
  shipped `bb73488`)** and **OWED-1 (`columnAdvance` reserves no room for the
  turning layer)**. STATE.md's own OWED text calls OWED-1 downstream of N.106
  ("N.106 widens what a turning unit can occupy on the right"), so these are
  named as related, not identical, but the boundary between "N.106's scope"
  and "OWED-1's scope" is not drawn precisely in these five files.
- **The ties/slurs "terrible and artless" walk finding (INBOX.md, 2026-09-11
  00:07, cause "not established… not opened tonight")** and **N.125's own
  spec**, which independently states the mechanism ("long arcs go flat
  because the slur lift is capped at 24 px"). These read as the same
  underlying defect, one as a raw walk finding and one as the numbered,
  causally-explained item; I did not merge the rows because the walk finding
  is dated before N.125 was numbered and nothing in these five files says in
  so many words that N.125 IS that walk finding.
- **UNSETTLED-7 (print white / `stripBackingRect`, "Paste written (INBOX),
  not yet run")** and **OPEN.md's "The print fix" entry**, which describes the
  identical cause and the identical unrun paste. These are almost certainly
  one item under two headings in the source files themselves (STATE.md
  §STILL UNSETTLED and OPEN.md's catalogue); kept as one row (UNSETTLED-7)
  citing both sources rather than two, since the wording is close to
  identical rather than merely similar.

---

## WHAT I COULD NOT ESTABLISH

- **OWED-7 (`bits-ui` removal) is contradicted between sources.** STATE.md's
  current §OWED section lists it as still to remove ("Do it clean, on its
  own"), dated to a 2026-08-16 ruling. LOG.md's own account of that same
  night says plainly "`bits-ui` removed" as part of what shipped. I cannot
  establish, from these five files, whether the current STATE.md line is
  stale (the removal happened and nobody updated OWED) or whether it was
  removed and later reintroduced. Not resolved either way here.
- **The N.72 Chrome-for-iPhone home-screen residue is contradicted between
  sources.** STATE.md's current text (§THE TRACKER and §OWED-adjacent list)
  still calls it unruled: "A singer on Chrome for iPhone can never install
  Ilya to the home screen... Dann to rule." LOG.md, in a different block,
  reads "N.72 residue: CLOSED AS KNOWN, no build." Which of these is the
  live status is not established from these five files alone.
- **INBOX-8 and INBOX-9 (mobile pitch editing, mobile navigation).** LOG.md
  states that a later session's file list shows "INBOX.md (two lines: mobile
  editing, mobile navigation, both absorbed into this track)" — implying
  these two lines were meant to be removed from INBOX.md. The current
  INBOX.md (read in full for this inventory) still carries both lines,
  unstruck, exactly as INBOX-8 and INBOX-9 quote them. I kept them as open
  because the current file is what's in front of me and neither line carries
  a strikethrough (the file's own convention for "resolved but kept for the
  record," as used on the Portrait-hint line). Whether the underlying work
  is in fact done is NOT ESTABLISHED.
- **INBOX-4 (the "Français" toggle's missing `lang` attribute).** LOG.md
  contains the sentence "the `INBOX.md` item from the same day closes:
  ‘Français’ sits inside an English document..." I could not establish
  whether "closes" here means the defect was fixed, or means only that a
  session's narrative section ends on that observation. Left open on the
  weaker reading.
- **INBOX-10 (print button under the paper on a phone) versus a walked
  confirmation elsewhere in LOG.md** ("Yes the print button appears just as
  you say. Perfect."). I could not establish whether this quote answers the
  specific `.paper-fit` flex-shrink defect INBOX-10 names, or a different
  print-button observation from a different walk. Left open.
- **INBOX-28 and INBOX-29 (Voice station chevron struck; intake hint
  relocated).** Both are tagged "Code's next pass" / "rides with the
  Voice-chevron pass" in INBOX.md, dated 2026-09-09, shortly before the path
  pass shipped and was walked whole. Whether these two specific changes are
  inside what Dann walked and approved is NOT ESTABLISHED from these five
  files — the walk account in STATE.md does not mention either by name.
- **N.121(a) and N.121(b)** (the placeholder text, and the "37 / 94 placed"
  string) are recorded in OPEN.md as "In Code with the path pass" — this
  project's phrasing elsewhere sometimes means "sent to Code to build" and
  sometimes (once built and shipped) is followed by an explicit "DONE" or
  "SHIPPED" tag. Neither tag appears for these two lines in any of the five
  files, and I did not find an exact-quote confirmation in LOG.md either. I
  left them in the table as open rather than assert either way.
- **Many small "rides with the next paste" / "same paste" INBOX riders**,
  attached to N.108, N.112, N.113 or N.114/N.114a — all now-closed briefs —
  were excluded from the table on the inference that they shipped with their
  parent commit, per the Method note at the top of this document. I did not
  verify each one by an exact LOG.md quote. If any of them did not in fact
  ship, this inventory is missing it. The excluded lines were: the drawer
  staying still on a tab change; the top inset above the Piece band; every
  button taking the calibration ritual's rounded ends; consolidating the OCR
  camera icon, Choose a file, and the photograph button into one control; the
  melisma-pill/arrow-pair spacing; the Cmd-Z/Ctrl-Z hotkey; the loupe's
  taken-note mark style; reversing the slide-left default on delete/insert;
  the melisma-shift-then-delete tail defect; and the `IntakePanel.svelte`
  CSS-comment closure.
- **Whether the two 2026-08-17/18 documents living only in project knowledge
  (`claude/gould-beams-delta-pp16-25_2026-08-18.md` and
  `claude/ruling-semantic-stems-vs-gould-priors_2026-08-18.md`) name any
  further OPEN work of their own** is NOT ESTABLISHED — the task's instructions
  said not to read outside the five named files, and STATE.md's own citation
  of them is a pointer, not a restatement of open content, beyond the two
  already-quoted findings folded into OWED-3 and the Gould-prior note.
- **The exact scope of "N.6" and "N.61"** is NOT ESTABLISHED from these five
  files — both are named only, with no descriptive text anywhere in STATE.md,
  OPEN.md, or INBOX.md.
- **Whether the six items just below §RULINGS DANN OWES's numbered
  sub-heading ("New from N.104", "New from N.67 step 5", "New from N.67 step
  4b")** should be counted as still-open the same way as the rest of §OWED —
  I treated the ones with live, un-struck text as open (folded into the
  table above via their own N-numbers or, where unnumbered, omitted for being
  a "rides with next paste" case per the Method note) and could not fully
  verify each one's shipped status beyond what LOG.md's grep returned.
