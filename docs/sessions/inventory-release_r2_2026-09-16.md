# Inventory: release cut, Ilya. Revision 2

Read-only inventory, refresh of `docs/sessions/inventory-release_r1_2026-09-13.md`
(114 items). Nothing here is sorted by priority, ranked, or recommended, and no
closure is inferred: where a commit or an exact `LOG.md` line could not be
found, the row is marked `NOT ESTABLISHED` rather than assumed closed.

**Inputs, all read in full:** `docs/sessions/inventory-release_r1_2026-09-13.md`
(290 lines), `docs/memory/STATE.md` (848 lines), `docs/memory/OPEN.md`
(1,363 lines), `docs/memory/SEQUENCE.md` (176 lines), `docs/memory/INBOX.md`
(187 lines). **Grepped, not read in full:** `docs/sessions/LOG.md` (5,214
lines), for `N.72`, `bits-ui`, `neutral`, `N.137`, and the four colour-ruling
numbers, to check closure and to settle two of r1's contradictions. **Checked
directly in the tree:** `apps/web/package.json` (for `bits-ui`) and
`docs/memory/PRODUCT.md`'s section headings (for the colour story and the
drawer grammar).

**Two extra sources, current at the time of this refresh, not in r1's method:**
this session's own record that N.143 shipped as `7abb5ae` (walked by Dann,
"correct"), and that N.142 and the loupe French build are now BUILT-NOT-SHIPPED
(`docs/sessions/memo-n142-tie-prolongation_r1_2026-09-16.md`,
`docs/sessions/memo-loupe-french-build_r1_2026-09-16.md`), and that N.129 is
now BRIEFED (`docs/sessions/brief-n129-underlay-ruler_r1_2026-09-16.md`). Where
this contradicts a plain reading of the memory files as they stand (for
example, an item the files still describe as owed but which shipped since),
the more recent, more specific source is used and the discrepancy is named on
the row.

**Method, following r1's own convention.** The table below holds items that
are still open. An item confirmed closed since r1, with a commit or an exact
`LOG.md`/tree citation, moves to the CHANGES section instead and is not
carried in the open table, the same way r1 never listed closed work. An item
r1 carried as open but which this refresh could not re-confirm as open OR
closed is kept in the table with `closed already?` marked `NOT ESTABLISHED`,
never inferred either way.

---

## Count

**115 open items in the table below**, counted directly off its rows. r1 had
114; 12 of r1's rows closed (see CHANGES), 13 rows are new (see CHANGES), net
+1.

By build state:
- SHIPPED-PARTIAL: 3 (N.94, N.116, N.141)
- BUILT-NOT-SHIPPED: 3 (N.121(d), N.142, the loupe French build)
- BRIEFED: 5 (N.110, N.114b items 6-9, N.117, N.119, N.129)
- SPEC-ONLY: 28
- NOT STARTED: 26
- NOT ESTABLISHED: 50

By document touched:
- Text: 14
- Markup: 34
- Insights: 7
- more than one: 16
- none of the three: 26
- NOT ESTABLISHED: 18

These are counts of rows, not of engineering effort, matching r1's own note.

## The table

| id | name | source | build state | evidence | touches | blocked by | closed already? |
|---|---|---|---|---|---|---|---|
| N.6 | (named only, no spec in these five files) | STATE.md §THE TRACKER "The visible list" | NOT ESTABLISHED | "**N.6**" (no further text) | NOT ESTABLISHED | nothing stated | no |
| N.17 | 100vh remnants | STATE.md §THE TRACKER "The visible list" | NOT ESTABLISHED | "three `100vh` remain (N.17, unchanged)" | NOT ESTABLISHED | nothing stated | no |
| N.19 | `updatedAt` written, rendered nowhere | STATE.md §THE TRACKER "The visible list" | NOT ESTABLISHED | "`updatedAt` written five times, rendered nowhere (N.19, unchanged)" | NOT ESTABLISHED | nothing stated | no |
| N.27 | library save recommendation, not built | STATE.md §OWED | SPEC-ONLY | "the recommendation is IN THE TREE as a comment at the reporting seam... deliberately not built" | NOT ESTABLISHED | nothing stated | no |
| N.28 | (ships on N.67 step 5 binder) | STATE.md §OWED | NOT ESTABLISHED | "**N.28** ships on N.67's step 5 binder." | NOT ESTABLISHED | nothing stated | no |
| N.45 | N.45's remainder | STATE.md §RULINGS DANN OWES | NOT ESTABLISHED | "**N.45's remainder.**" | NOT ESTABLISHED | nothing stated | no |
| N.48 | may be unclosable | STATE.md §THE SCHEMA | NOT ESTABLISHED | "N.48 may be unclosable; it needs a `[u]` that fails." | NOT ESTABLISHED | nothing stated | no |
| N.51 | per-tab colour past the tab bar | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "whether per-tab colour may propagate past the tab bar" | NOT ESTABLISHED | nothing stated | no |
| N.61 | (named only) | STATE.md §THE TRACKER "The visible list" | NOT ESTABLISHED | "**N.61**" (no further text) | NOT ESTABLISHED | nothing stated | no |
| N.82 | the watch band's French | OPEN.md catalogue; N.130's own text | SPEC-ONLY | "N.82 is 'the watch band's French' and may overlap. Read it before starting" | Markup | nothing stated | no |
| N.83 | walkthrough call | OPEN.md; SEQUENCE.md Tier 7 | NOT STARTED | "N.83's walkthrough call... his to schedule" | none of the three | nothing stated | no |
| N.84 | Guide and Learn redo | OPEN.md; SEQUENCE.md Tier 7 | SPEC-ONLY | "N.84 the Guide and Learn redo (after N.114)" | none of the three | N.114 (closed) | no |
| N.84 (Revert-to-score-header) | explain Revert to score header in the Guide | OPEN.md "For N.84 (Guide)" | SPEC-ONLY | "explain Revert to score header; a music file carries its own header text." | Text | nothing stated | no |
| N.85 | the open-source front door | LOG.md (ratified-order table); SEQUENCE.md Tier 7 | SPEC-ONLY | "README, CONTRIBUTING, code of conduct... Must carry: free on purpose, well-built on purpose" | none of the three | nothing stated | no |
| N.86 | dead-code and structure audit | LOG.md | SPEC-ONLY | "One reading pass, two outputs: dead code to delete... and structural intuitiveness for contributors" | none of the three | nothing stated | no |
| N.87 | optimizations | LOG.md | SPEC-ONLY | "Perceive, confer with Dann, then execute. Needs N.86's findings first" | none of the three | N.86 | no |
| N.88 | marketing materials | LOG.md | SPEC-ONLY | "Last on purpose: describes the cleaned-up product" | none of the three | N.85–N.87 (implied) | no |
| N.89 | document furniture | OPEN.md catalogue "Open and unplaced, small" | SPEC-ONLY | "ratified from drawings" | Markup | nothing stated | no |
| N.90 | the photograph tier | INBOX.md 2026-08-24 | SPEC-ONLY | "the photograph tier, mapped by the OMR field report and vocal-line brief" | NOT ESTABLISHED | nothing stated | no |
| N.91 | piano-doubling witness / OpenScore Lieder benchmark | INBOX.md 2026-08-24 | SPEC-ONLY | "the piano-doubling witness as pitch verifier, and OpenScore Lieder as the CC0 accuracy-benchmark corpus" | NOT ESTABLISHED | nothing stated | no |
| N.93 | easy text entry interfaces | INBOX.md 2026-08-24 | SPEC-ONLY | "easy text entry interfaces for the poem and underlay" | Text | nothing stated | no |
| N.94 | transposition interface | STATE.md §THE ONE THING; SEQUENCE.md Tier 3 | SHIPPED-PARTIAL | "the ENGINE already exists and ships... Only the control is missing." | Markup | drawer grammar ratification (SEQUENCE.md) | no |
| N.98 | voice formant profile selector | INBOX.md 2026-08-24 | SPEC-ONLY | "A dropdown for teachers with busy studios to switch among multiple stored voice profiles" | NOT ESTABLISHED | nothing stated | no |
| N.99 | skew-tolerant staff detection | INBOX.md 2026-08-24 | SPEC-ONLY | "the primary row detector self-abstains... the gap is skew tolerance" | none of the three | nothing stated | no |
| N.100 | PDF route must not trust the media box | INBOX.md 2026-08-24 | SPEC-ONLY | "the 400 dpi rasterization makes a 151-megapixel image and the route dies" | none of the three | nothing stated | no |
| N.101 | score intake is confusing | INBOX.md 2026-08-26 | SPEC-ONLY | "make intake legible to a new user, states named, nothing silent" | Text | nothing stated | no |
| N.102 increment 1c | courtesy accidentals on the turning layer | OPEN.md catalogue | SPEC-ONLY | "courtesy accidentals on the TURNING layer too, parenthesized, in lavender" | Markup | nothing stated | no |
| N.102 increment 2 | the singer's own courtesy-accidental control | INBOX.md 2026-08-27 | NOT STARTED | "**Increment 2**, the singer's own control with its French, waits on Dann." | Markup | nothing stated | no |
| N.110 | the [i] extractor harness | OPEN.md; SEQUENCE.md Tier 6 | BRIEFED | "set aside by Dann, briefed... not built" | NOT ESTABLISHED | nothing stated | no |
| N.114b items 6–9 | air, export/import order, collapse row, ghost pill | STATE.md text-to-score sequence ("N.114a and N.114b 1 to 5 DONE") | BRIEFED | "items 6 to 9 BRIEFED, NOT RUN" (r1, unchanged in tree: items 1–5 only are named DONE) | Text | nothing stated | no |
| N.115 | move a measure between systems | OPEN.md, extended 2026-09-14; SEQUENCE.md Tier 1 | SPEC-ONLY | "Now unblocked by his ruling of 2026-09-14... layout, measure distribution and horizontal spacing are editorial" | Markup | N.129 (ruler), per SEQUENCE.md's ordering | no |
| N.116 | Learn as the book | OPEN.md; SEQUENCE.md Tier 7 | SHIPPED-PARTIAL | "Step 1 DONE... Step 2... needs the inventory read in full and Grayson chapters 1, 8, 9" | none of the three | nothing stated | no |
| N.117 | a progress bar on load | OPEN.md; SEQUENCE.md Tier 3; STATE.md "BRIEFS WRITTEN AND NOT RUN" | BRIEFED | "brief-n117-dictionary-fill_r1_2026-09-12", still in the not-run list | NOT ESTABLISHED | nothing stated | no |
| N.119 | Notation toggles reach Score markup live | OPEN.md; SEQUENCE.md Tier 0/1 | BRIEFED | "brief-n119-toggles-reach-score-markup_r1_2026-09-12", still in the not-run list; SEQUENCE narrows it: "N.136 comes before N.119, and shrinks it" | more than one | N.136 (per SEQUENCE.md) | no |
| N.120 | Corrections station redesigned | OPEN.md; SEQUENCE.md Tier 3 | SPEC-ONLY | "DRAWING FIRST... then a Fable pass if Dann wants one, then Code" | Markup | drawer grammar ratification | no |
| N.120 (Tempo station) | Tempo station inside N.120 | OPEN.md | SPEC-ONLY | "the seam is built (E.20)... per-region override NOT ESTABLISHED in the tree" | Markup | nothing stated | no |
| N.121(a) | placeholder text and the way in | OPEN.md | NOT ESTABLISHED | "placeholder \"Paste, type, or drop your poem here.\"... In Code with the path pass." | Text | nothing stated | no, no exact LOG.md confirmation found this session either |
| N.121(b) | "37 / 94 placed" string | OPEN.md | NOT ESTABLISHED | "RULED 2026-09-10: \"37 / 94 placed\", « 37 / 94 placées ». In Code." | Text | nothing stated | no, same as (a) |
| N.121(c) | what "Transcribe and fit" still does | OPEN.md; SEQUENCE.md Tier 3 | SPEC-ONLY | "N.121(c) and (d) both wait on rulings from Dann... the pill's fate" | Text | Dann's ruling on the pill's fate | no |
| N.121(d) | undo clause for Start placement over | STATE.md §RULINGS DANN OWES | BUILT-NOT-SHIPPED | "The undo clause is ruled and built as a key, unwired." « placement recommencé » / "placement started over" ruled 2026-09-16 | Text | wiring the key (unwired) | no |
| N.122 | the capture surface as a landmark | OPEN.md; SEQUENCE.md Tier 3 | SPEC-ONLY | "DRAWN r1, 2026-09-10 late... Wizard spec v1 and pacifier spec v11 NOT OPENED" | more than one | drawer grammar ratification | no |
| N.123 | the aggregation layer / tessituragram | OPEN.md; SEQUENCE.md Tier 4 | SPEC-ONLY | "One layer under four figures... UNPLACED, displaces nothing until he places it" | Insights | nothing stated | no |
| N.124 | repertoire for a studio | OPEN.md; SEQUENCE.md Tier 4 | SPEC-ONLY | "Needs: N.123... a multi-voice library, NOT ESTABLISHED as existing" | Insights | N.123 | no |
| N.127 increment 2 | Insights' compass | STATE.md §THE ONE THING; SEQUENCE.md Tier 4 | NOT STARTED | "Increment 2 is the compass." Increment 1's five decisions are unreviewed. | Insights | nothing stated | no |
| N.129 | underlay spaced in wrong font's metrics | STATE.md; SEQUENCE.md Tier 0 | BRIEFED | "Brief written 2026-09-16, `brief-n129-underlay-ruler_r1_2026-09-16.md`... runs after N.142 and the loupe French" | Markup | N.142, the loupe French build (per SEQUENCE.md) | no |
| OWED-1 | `columnAdvance` reserves no room for the turning layer | STATE.md §OWED | SPEC-ONLY | "Closing it means teaching the layout pass an analysis-layer measurement... NOT ESTABLISHED" | Markup | nothing stated | no |
| OWED-2 | three residues of N.104's loupe fix | STATE.md §OWED | NOT ESTABLISHED | "None is a regression, all three predate it, and all three want numbers." | Markup | nothing stated | no |
| OWED-3 | trace `stem_dir`'s consumers in the reader | STATE.md §OWED | NOT ESTABLISHED | "Whether any stage treats it as evidence is NOT ESTABLISHED." | none of the three | nothing stated | no |
| OWED-4 | `positionalUp`'s Gould citation, apply next touch | STATE.md §OWED | NOT ESTABLISHED | "**Apply the citation the next time that file is touched.**" | Markup | nothing stated | no |
| OWED-5 | the Gould re-shoot, four spots | STATE.md §OWED | NOT STARTED | "p. 18's three-beam paragraph, and the small diagram numerals on pp. 16, 19, and 21" | none of the three | nothing stated | no |
| OWED-6 | step 5's export, single-song half | STATE.md §OWED | NOT STARTED | "Dann's ruling: deferred, recorded as owed against step 5" | none of the three | nothing stated | no |
| OWED-8 | ILYA-REGISTER needs revision 11 | STATE.md "Register corrections owed" | NOT STARTED | "The blocking number is now THREE." | none of the three | nothing stated | no |
| OWED-9 | N.128's two other consumers, `sustain.ts` and `watchlist.ts` share a stale field | STATE.md §OWED | NOT ESTABLISHED | "the same duplicated `activeTempoAt`... the desk did not find the call chain and stopped rather than guess: **NOT ESTABLISHED.**" | NOT ESTABLISHED | nothing stated | no, new since r1; may have existed in narrative before r1 but was not a table row |
| RULING-1 | the release cut | STATE.md §RULINGS DANN OWES | SPEC-ONLY | "name the items the next public iteration of Ilya contains... freeze that list, and move the rest to a post-release file"; the release DATE and the FREEZE RULE are now ruled, "the sort of the inventory into IN, FLAGGED and LATER is still owed" | more than one | nothing stated | no |
| RULING-2 | the release order contradicts itself | STATE.md §RULINGS DANN OWES; SEQUENCE.md "THE ONE THING IN THIS SEQUENCE THE DESK CANNOT DECIDE" | NOT ESTABLISHED | "His ruling of 2026-08-24 set the order N.83...N.88... His text-to-score sequence of 2026-09-06 lists it as...N.85 to N.88, then N.84, then N.83" | none of the three | nothing stated | no |
| RULING-3 | binding squircle's footprint on Insights page one | STATE.md §RULINGS DANN OWES | SPEC-ONLY | "Design proposes two treatments, Dann rules (2026-09-11)." | Insights | nothing stated | no |
| UNSETTLED-1 | where storage notices belong | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "They render in the FIT drawer only, so a singer working in Transcription never sees a save failure" | more than one | nothing stated | no |
| UNSETTLED-2 | storage strings still say "syllable placements" | STATE.md §STILL UNSETTLED | NOT STARTED | "the save is now the whole song... left alone rather than rewritten twice" | more than one | nothing stated | no |
| UNSETTLED-3 | "The page carries no chrome." / "Do not introduce a slider." | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | quoted verbatim as two standing lines with no further context | NOT ESTABLISHED | nothing stated | no |
| UNSETTLED-4 | whether `claude/shane-project-map_2026-07-25.md` is stale | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "Unopened for twelve sessions." | none of the three | nothing stated | no |
| UNSETTLED-5 | D3's Job A, per-verse reprints | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "ruled in E.36 and still unnumbered" | NOT ESTABLISHED | nothing stated | no |
| UNSETTLED-6 | the per-format score arrival audit | STATE.md §STILL UNSETTLED | NOT STARTED | "asked for in E.45 and never written" | NOT ESTABLISHED | nothing stated | no |
| UNSETTLED-8 | marks on the printed page (VERIFY box, USER OVERRIDE badge) | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "CONTRACT §6 forbids a mark that says Ilya is unsure. Whether these are the ruled exception was not checked." | Markup | nothing stated | no |
| UNSETTLED-9 | `VoiceProfilePane.svelte:295-313` duplicate header arithmetic | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "Fit's paper does not yet share the Transcribe paper's single `HEADER_GAP`." | more than one | nothing stated | no |
| UNSETTLED-10 | whether `.mscz` ingest succeeds in a browser | STATE.md §STILL UNSETTLED | NOT ESTABLISHED | "The path is live in code... but `i18n.ts:272` still carries a \"coming soon\" string. Nobody has run it." | none of the three | nothing stated | no |
| COLOUR-6 | Text/Markup/Melody names + tab padding, not yet built | STATE.md §THE TRACKER `[ ] N.132`; OPEN.md §N.132 | NOT STARTED | "**OWED: nobody has seen 0.5 rem on screen.**" i18n.ts:106,117,59 still read "Transcription"/"Score markup" | more than one | nothing stated | no, see duplicates: this is the same item as N.132, tracked below under its own number |
| COLOUR-7 | transcribe colour principle into PRODUCT.md | INBOX.md 2026-09-13 | NOT STARTED | "RULED BY DANN. **THE COLOUR STORY, SETTLED. Transcribe into PRODUCT.md at the next touch.**" | none of the three | nothing stated | no, checked in the tree: `grep -n "^##" docs/memory/PRODUCT.md` has no colour-story heading as of this read |
| STRUCT-1 | Voice extracts from Score markup into its own band | STATE.md §THE ONE THING; OPEN.md 2026-09-13 brainstorm | SPEC-ONLY | "`Voice` extracts from Score markup to become a band sibling of Piece, Input and Melody." Colour assignment now ruled (Voice is rose, 2026-09-13). `PRODUCT.md:317` already lists "Voice" in the drawer path text, dated to an earlier ruling (2026-09-09/10), so the tree and the brainstorm's dating do not fully line up | more than one | drawer grammar ratification (SEQUENCE.md) | no |
| PROC-1 | sequential, linear release-readiness checklist | INBOX.md 2026-09-13 | NOT STARTED | "A sequential, linear checklist he can use as a roadmap... QUEUED FOR IMMEDIATELY AFTER THE COLOUR STORY CLOSES", the colour story (stages 1–5 minus stage 5's hygiene) is now largely closed, see CHANGES | none of the three | the release cut's sort (RULING-1) | no |
| INBOX-1 | mid-system metre change placement | INBOX.md table, I.03 | NOT ESTABLISHED | "HIS RULING DOES NOT REACH A MID-SYSTEM METRE CHANGE... Still open, and still his." | Markup | nothing stated | no |
| INBOX-2 | WCAG accessibility in marketing capabilities list | INBOX.md 2026-08-18 | NOT STARTED | "Mention WCAG accessibility in Ilya's marketing capabilities list" | none of the three | nothing stated | no |
| INBOX-3 | hamburger menu alternative navigation | INBOX.md 2026-08-20 | NOT ESTABLISHED | "His own question: is this too much?" | more than one | nothing stated | no |
| INBOX-4 | "Français" toggle has no `lang` attribute | INBOX.md 2026-08-20 | NOT ESTABLISHED | "a screen reader pronounces it with English phonetics. WCAG language-of-parts." | none of the three | nothing stated | no |
| INBOX-5 | colour print prints greyscale except the flag | INBOX.md 2026-08-24 | NOT ESTABLISHED | "colour print prints greyscale except the flag; intentional?" | Markup | N.83 | no |
| INBOX-6 | smartwatch formant capture | INBOX.md 2026-08-24 | NOT STARTED | "can a smartwatch capture formant readings and relay them to Ilya" | none of the three | nothing stated | no |
| INBOX-7 | restore/reload busy indicator | INBOX.md 2026-08-25 | NOT STARTED | "a reload takes a few seconds before the song reappears; offer a busy indicator" | Text | nothing stated | no |
| INBOX-8 | mobile pitch editing | INBOX.md 2026-08-25 | NOT ESTABLISHED | "locate-then-edit across two screens is untenable on a phone... Dann says this blocks release" | Markup | Studio ruling | no |
| INBOX-9 | mobile navigation | INBOX.md 2026-08-25 | NOT ESTABLISHED | "navigation on mobile is abysmal, needs help" | more than one | Studio ruling | no |
| INBOX-10 | print button under paper on a phone | INBOX.md 2026-08-26 | NOT ESTABLISHED | "the Print button lands beneath the paper in portrait... Dann to rule when it rides" | more than one | nothing stated | no |
| INBOX-11 | floor-commit restore flakiness | INBOX.md 2026-08-26 | NOT ESTABLISHED | "the score reverted to the empty envelope in 3 of 6 automated runs" | none of the three | nothing stated | no |
| INBOX-12 | tether 20 draft, held | INBOX.md 2026-09-01 | NOT ESTABLISHED | "HELD BY DANN, not written into CONTRACT.md... Reconsider it when the retirement pass runs" | none of the three | nothing stated | no |
| INBOX-13 | barline correction | INBOX.md 2026-08-27 | NOT STARTED | "the entry grammar has no barline verb... Wants a number and a slice." | Markup | nothing stated | no |
| INBOX-14 | Lamm read's metre provenance | INBOX.md 2026-08-27 | NOT ESTABLISHED | "Which glyphs `timesig.py` matched on this plate... is NOT ESTABLISHED." | none of the three | INBOX-13 | no |
| INBOX-15 | arrow-key hotkeys for the stepper | INBOX.md 2026-08-27 | NOT STARTED | "map keyboard left and right arrows to the stepper... Belongs to slice 4" | Markup | nothing stated | no |
| INBOX-16 | a named Redo pill | INBOX.md 2026-08-27 | NOT ESTABLISHED | "a named Redo pill beside Undo, present only immediately after an undo... Wants a number; small." | Markup | nothing stated | no, see duplicates |
| INBOX-17 | transcribe squircle ruling into PRODUCT.md | INBOX.md 2026-08-27 | NOT STARTED | "Transcribe into PRODUCT.md next session", CHECKED IN TREE: `PRODUCT.md` §The squircle now carries the ruling and is DONE, but the item as filed also asked for the Calm Authority shape rule alongside it, and that half is NOT ESTABLISHED as transcribed | none of the three | nothing stated | PARTIAL, squircle-as-germ ruling is in `PRODUCT.md` §The squircle (confirmed by grep); kept open on the untraced half |
| INBOX-18 | plausibility guard only judges at capture | INBOX.md 2026-09-02 | NOT ESTABLISHED | "the plausibility guard judges readings at capture only... run `expectedF1`/the guard on stored readings at snapshot time" | Insights | nothing stated | no |
| INBOX-19 | "one piece at a time" design question | INBOX.md 2026-09-03 | NOT ESTABLISHED | "Design question about how a song binds poem, score, and metadata" | more than one | nothing stated | no |
| INBOX-20 | `#` assimilation marker in engraved IPA verse | INBOX.md 2026-09-03; OPEN.md ("small" list) | NOT ESTABLISHED | "Not numbered; Dann to say what the printed score sets there." | Markup | nothing stated | no, see duplicates |
| INBOX-21 | re-seated cell loses its punctuation | INBOX.md 2026-09-04 | NOT ESTABLISHED | "a re-seated cell loses its punctuation (я, becomes я)" | Markup | nothing stated | no |
| INBOX-22 | last note of a seated piece can be undecided and stale | INBOX.md 2026-09-04 | NOT ESTABLISHED | "undecided draws the file's stale text (ночь о ди но ка ка)" | Markup | nothing stated | no |
| INBOX-23 | stray IPA 'a' on a blanked note before seating | INBOX.md 2026-09-04 | NOT ESTABLISHED | "A blanked note draws a stray IPA 'a' in the loupe before the hand seats anything" | Markup | nothing stated | no |
| INBOX-24 | Undo/Redo on the loupe itself | INBOX.md 2026-09-07 | NOT ESTABLISHED | "we do not include an Undo/Redo button on the Loupe. We need one.", Undo/Redo shipped in the TOP BAR (N.114a/b); whether that satisfies the loupe-itself ask is still NOT ESTABLISHED | Markup | nothing stated | no, see duplicates |
| INBOX-25 | loupe taken-note box reads "tall" on a dotted note | INBOX.md 2026-09-09 | NOT ESTABLISHED | "Loupe's taken-note box reads weird (tall) on the dotted B♭3" | Markup | nothing stated | no |
| INBOX-26 | loupe locator phrasing "dotted quarter" | INBOX.md 2026-09-09 | NOT ESTABLISHED | "Dann wants \"dotted quarter\"... instead of \"Quarter · Dot\". French to be shown to him." | Markup | nothing stated | no |
| INBOX-27 | phone-only Lyric-station jump-to-word verb | INBOX.md 2026-09-09 | NOT ESTABLISHED | "Only if a phone walk shows the hunt costs something." | Markup | a phone walk | no |
| INBOX-28 | Voice station chevron struck | INBOX.md 2026-09-09 | NOT ESTABLISHED | "the Voice station in Score markup stays expanded always; strike its chevron" | Markup | nothing stated | no |
| INBOX-29 | intake hint moves under the textarea | INBOX.md 2026-09-09 | NOT ESTABLISHED | "the intake hint... moves to sit directly under the textarea... Rides with the Voice-chevron pass." | Text | INBOX-28 | no |
| INBOX-30 | phone: primary action lands on page, Back goes home | INBOX.md 2026-09-10; PRODUCT.md §The drawer grammar and the path | NOT STARTED | "on a phone, a step's primary action lands the singer on the page and Back brings them home", ratified in `PRODUCT.md` as principle, but marked there "to be read against the portrait C ruling... before it is built" | more than one | portrait C | no |
| INBOX-31 | record the ⓘ Russian-o exemption in PRODUCT.md | INBOX.md 2026-09-10 | NOT STARTED | "opens the sung-[o] Learn note, ruled 2026-07-11. Record the exemption in PRODUCT.md" | Text | nothing stated | no |
| INBOX-32 | French path-strings table, not ruled line by line | INBOX.md 2026-09-10 | NOT ESTABLISHED | "the rest of the table not yet ruled line by line" | more than one | nothing stated | no |
| INBOX-33 | file-naming scheme for a growing library | INBOX.md 2026-09-10 | NOT ESTABLISHED | "he is also thinking about how to name the files so a growing library stays organized... stays open." | none of the three | nothing stated | no |
| INBOX-34 | advice programme sources for Insights | INBOX.md 2026-09-11 | NOT ESTABLISHED | "the open question is which sources Dann can supply as pages or PDFs" | Insights | nothing stated | no |
| N.130 | Insights has no French | OPEN.md §N.130; SEQUENCE.md Tier 2 | NOT STARTED | "Every string on Insights is English in both languages... about 58 consecutive entries" | Insights | N.132 (per SEQUENCE.md, so strings are not translated twice) | no, NEW SINCE R1 |
| N.131 | French parity everywhere else | OPEN.md §N.131; SEQUENCE.md Tier 2 | NOT STARTED | "The 64 or so entries outside Insights whose French is identical... **Its real size is NOT ESTABLISHED** until a triage separates the genuinely untranslated..." | more than one | N.130, N.132 (per SEQUENCE.md) | no, NEW SINCE R1 |
| N.132 | the ratified names are not built | OPEN.md §N.132; STATE.md §THE TRACKER `[ ]`; SEQUENCE.md Tier 2 | NOT STARTED | "nothing tracked building them... `i18n.ts:106` `tab.transcription` = \"Transcription\", both languages" | more than one | nothing stated | no, NEW SINCE R1; same item as r1's COLOUR-6, kept as a separate row per the no-merge rule, see duplicates |
| N.135 | the page reader reads the text underlay | STATE.md §THE TRACKER `[ ]`; SEQUENCE.md Tier 6 | NOT STARTED | "Ruled by Dann 2026-09-14. Cost measured the same night in `memo-n135-ocr-measurement_r1_2026-09-14.md`." | Text | nothing stated | no, NEW SINCE R1 |
| N.136 | open syllabification never reaches Score markup's drawn text | STATE.md §THE TRACKER `[ ]`; SEQUENCE.md Tier 0 | NOT STARTED | "the toggle moves, and neither the Cyrillic nor the IPA on the page changes... Not a regression from N.134 or N.118" | Markup | nothing stated | no, NEW SINCE R1 |
| N.140 | the loupe guarantees a stave space, and scrolls rather than shrinking below it | OPEN.md §N.140; STATE.md §THE TRACKER `[ ]`; SEQUENCE.md Tier 5 | NOT STARTED | "a contextual horizontal scroll with notation remaining at a pre-set point size seems preferable to shrinking the contents?" Two things Dann owes: the floor in CSS pixels, and whether the scroll may take the gesture | Markup | Dann's floor number and gesture ruling | no, NEW SINCE R1 |
| N.141 | the squircle has no grammar | OPEN.md §N.141; STATE.md §THE ONE THING; SEQUENCE.md Tier 5 | SHIPPED-PARTIAL | "Two increments shipped (`debdf02` the grammar and the row spacing, `76b24a3` the width holding its IPA syllable, both walked). What is left in N.141 is the tie-spanning increment, and it DEPENDS ON N.142" | Markup | N.142 | no, NEW SINCE R1 |
| N.142 | a tie is prolongation, not a new syllable target | OPEN.md §N.142; STATE.md §THE TRACKER `[ ]`; SEQUENCE.md Tier 1 | BUILT-NOT-SHIPPED | "`memo-n142-tie-prolongation_r1_2026-09-16.md`" (this session's context). STATE.md: "**N.142 STEP 2 IS WAITING ON A COUNT FROM DANN'S BROWSER.** Whether any song in his library holds a placement on a tie's continuation is a fact about his IndexedDB, which Code cannot read" | Markup | the IndexedDB count (readable by the desk through Chrome on the branch alias) | no, NEW SINCE R1 |
| (unnumbered) | the loupe French build | STATE.md §RULINGS DANN OWES; `brief-loupe-french-build_r1_2026-09-16.md` | BUILT-NOT-SHIPPED | "The loupe's French is now fully ruled and wholly unbuilt." (this session's context: memo says it is now BUILT-NOT-SHIPPED) `memo-loupe-french-build_r1_2026-09-16.md` | Markup | nothing stated | no, NEW SINCE R1 |
| INBOX-35 | should dropping a score be as instant as dropping text | INBOX.md 2026-09-16 | NOT ESTABLISHED | "should dropping a score be as instant as dropping text, with no \"Continue to analysis\" pause?... His ruling is not yet given." | Text | Dann's ruling | no, NEW SINCE R1 |
| INBOX-36 | poem receipt reads "1 lines" | INBOX.md 2026-09-16 | NOT STARTED | "the poem receipt reads \"1 lines\". `intake.lines`... has no singular, and its French slot is English (\"%s lines\")." Per the freeze rule this joins LATER by default (STATE.md: "'1 lines' goes to LATER") | Text | nothing stated | no, NEW SINCE R1 |
| INBOX-37 | the loupe tap both navigates and places | INBOX.md 2026-09-16 | NOT ESTABLISHED | "in the loupe a tap on a note both navigates and places the armed syllable... He wants navigation and placement separated... His ruling is not yet given." Per the freeze rule this joins the release if ruled in (STATE.md: "the loupe tap that reassigns syllables joins the release (lost work)") | Markup | Dann's ruling among four offered designs | no, NEW SINCE R1 |


---

## Changes since r1

### Closed since r1 (12 rows removed from the open table)

- **N.118.** Its brief ran 2026-09-14. "N.134 and N.118 both shipped in `4d79f24` and were walked by Dann." (STATE.md, close of 2026-09-14.)
- **N.121 (unbuilt half): the score's words never fill an empty poem box.** "N.121's unbuilt half closed on 2026-09-14 when N.134 shipped." (`LOG.md` block 14.) This is the same defect N.143 later reopened for `.musx` files specifically; see N.143 in the closed list below.
- **N.125, slurs as tapered objects.** "Closed this session: N.125 (`34b143c`, `570d76f`)... walked by Dann." (STATE.md §THE ONE THING.)
- **N.126, measure numbers on Score markup.** Shipped `76b24a3`, confirmed by Dann 2026-09-15 ("4 [28] reads exactly as it should"); "the last open question on N.126 is closed and the item is DONE" (STATE.md, 2026-09-16 walk findings).
- **UNSETTLED-7 (print white / `stripBackingRect`).** "The ruling it carried is now built anyway, as N.133 in `eb918ed`" (OPEN.md, 2026-09-15 correction); N.133 is DONE and walked per STATE.md §THE TRACKER `[x]`.
- **OWED-7 (`bits-ui` removal).** RESOLVED BY THE TREE, PER THE BRIEF'S OWN RULE. `grep -n "bits-ui" apps/web/package.json` returns nothing this session; the package is not in the file. STATE.md's current §OWED still lists it as owed ("Do it clean, on its own"). The tree wins: it has been removed, and the memory-file line is stale.
- **COLOUR-1 through COLOUR-4 (the four colour rulings).** "STAGE 2 CLOSED 2026-09-13. All four rulings are Dann's and all four are recorded below... Nothing in stage 2 is open." (`LOG.md`, block 13.) Ruling 1 (the ramp) and ruling 4 (the fourth value, ink) are built into the twenty-value table and shipped at stage 4, `aa2b419`, walked. Rulings 2 (the neutrals) and 3 (the strays) are also ruled closed, but this refresh could not independently confirm from these files that every individual neutral or stray token's disposition (declare, consolidate, or remove) was carried into code beyond the ruling itself; see WHAT I COULD NOT ESTABLISH.
- **COLOUR-5 (colour token rename, stage 3a).** "Stages 1, 2, 3a and 3b are DONE, committed, pushed, deployed and walked by Dann at 1400 px on 2026-09-13. Their accounts are in `../sessions/LOG.md` block 13. Six commits, `45f7cd4` through `6a24169`." (`LOG.md`, block 14.)
- **COLOUR-8 (umber adoption undecided).** "RULED BY DANN. THE COLOUR STORY, SETTLED... **umber = the book** (Learn)." (OPEN.md, 2026-09-13.) Built at stage 4: "Learn moved from rose to umber" (STATE.md, twenty-values block).
- **N.133** (not an r1 row on its own, but the built form of UNSETTLED-7 above), see UNSETTLED-7.
- **N.137, N.138, N.139, N.143** were not r1 rows (numbered after r1) but shipped and closed this window; carried here for completeness since a session reading only the changes section should see them: N.137 (dictionary wrong letter on ё) shipped `490c12d`, "closed the night it was numbered"; N.138 (loupe supplies meter) DONE 2026-09-14, `78f3db8` and `8bb406c`, walked; N.139 (missing meter signature) DONE 2026-09-16, `eb7d220`; N.143 (`.musx` score fills no input field) DONE 2026-09-16, `7abb5ae`, walked by Dann ("correct"). N.134 is also closed overall: shipped `4d79f24` for MusicXML, and its `.musx` gap is now closed too, via N.143.

### New since r1 (13 rows added to the open table)

N.130, N.131, N.132, N.135, N.136, N.140, N.141, N.142, the loupe French build (unnumbered), OWED-9, INBOX-35, INBOX-36, INBOX-37. Full detail on each is in the table above. N.132, N.135, N.136, N.137, N.138, N.139, N.140, N.141, N.142, N.143 were all numbered 2026-09-14 through 2026-09-16, after r1 was written; N.130, N.131, N.132, N.133 were numbered 2026-09-13, the same day as r1, and appear not to have been captured under their own numbers in r1's table (r1 instead carried their substance as COLOUR-6, COLOUR-7 and COLOUR-8, and as an unnamed print-fix note folded into UNSETTLED-7). This refresh keeps both: the new N-numbered rows, and r1's COLOUR-6/7 rows carried forward, flagged as likely duplicates rather than merged.

### r1 rows whose build state changed, and are still open

- **N.129.** SPEC-ONLY → BRIEFED. `brief-n129-underlay-ruler_r1_2026-09-16.md` now exists (this session's context; also named in SEQUENCE.md Tier 0).
- **N.121(d), the undo clause for Start placement over.** NOT STARTED → BUILT-NOT-SHIPPED. "The undo clause is ruled and built as a key, unwired." (STATE.md §RULINGS DANN OWES.)
- **RULING-1, the release cut.** NOT ESTABLISHED → SPEC-ONLY. The release date (Friday 2026-10-30) and the freeze rule are now ruled and quoted in full in STATE.md §RULINGS DANN OWES; the sort into IN/FLAGGED/LATER, which is the ruling's actual deliverable, remains undone.
- **COLOUR-6 (Text/Markup/Melody names + tab padding).** NOT ESTABLISHED → NOT STARTED. The item now has a tracked number, N.132, with an explicit unbuilt `[ ]` mark in STATE.md §THE TRACKER, which is firmer evidence than r1 had.

---

## The contradictions r1 could not settle

- **OWED-7, `bits-ui`. SETTLED THIS SESSION FROM THE TREE.** `apps/web/package.json` does not carry `bits-ui` (checked this session, `grep -n "bits-ui" apps/web/package.json` returns nothing). STATE.md's own current §OWED text still lists it as owed. Per the brief's own rule, the tree wins: it has been removed. Moved to CLOSED above.
- **The N.72 Chrome-for-iPhone home-screen residue. STILL NOT SETTLED, and grepping `LOG.md` this session did not settle it.** `LOG.md` (2026-08-21, two places) reads "N.72 residue: CLOSED AS KNOWN, no build" and, in the same block, "**Still his to rule, carried over and never asked:** a singer on Chrome for iPhone can never install Ilya to the home screen." STATE.md's current text (§OWED, "New from N.67 step 4b") still reads "A singer on Chrome for iPhone can never install Ilya to the home screen... Dann to rule." So even `LOG.md`'s own account holds both "closed as known" and "still his to rule" in the same breath, and STATE.md's current text agrees with the second half. Read as: the parent item N.72 is closed; this specific residue is not ruled on and is not built. Not carried as its own table row (r1 did not give it one either), but repeated here since it was one of r1's named contradictions.
- **INBOX-8 and INBOX-9 (mobile pitch editing, mobile navigation).** Unchanged. Both lines are still present, unstruck, in the current `INBOX.md`, read in full this session. No further evidence found either way.
- **INBOX-4 (the "Français" toggle's missing `lang` attribute).** Unchanged. No further evidence found this session.
- **INBOX-10 (print button under the paper on a phone) versus the later walked confirmation.** Unchanged. No further evidence found this session.
- **INBOX-28 and INBOX-29 (Voice station chevron; intake hint relocation).** Unchanged. No further evidence found this session about whether either shipped inside a walked build.
- **N.121(a) and N.121(b) ("In Code with the path pass").** Unchanged. No exact `LOG.md` confirmation found this session either.
- **The scope of "N.6" and "N.61".** Unchanged. Still named only, nowhere else in the five files or in this session's `LOG.md` greps.
- **The two 2026-08-17/18 documents in project knowledge only.** Unchanged; out of scope for this refresh, which reads the tree and the five memory files, not project knowledge.

## Items that may be duplicates

Carried forward from r1, unresolved, plus two new ones. No recommendation on any of these.

- **INBOX-16** (a named Redo pill) and the shipped Undo/Redo pair in the top bar (N.114a/N.114b). Unchanged from r1.
- **INBOX-20** (the `#` assimilation marker) and OPEN.md's own "small" list line naming the same marker. Unchanged from r1.
- **INBOX-24** (Undo/Redo requested on the loupe itself) and the Undo/Redo pair later built into the top bar. Unchanged from r1.
- **N.106 (closed)** and **OWED-1** (`columnAdvance` reserves no room for the turning layer). Unchanged from r1; related, not identical.
- **The ties/slurs "terrible and artless" walk finding** and **N.125's spec.** N.125 is now CLOSED (see above), which narrows this: whichever defect N.125 fixed is done; whether the original 2026-09-11 00:07 walk line named exactly that defect or something else is still not established from these files.
- **NEW: COLOUR-6 and N.132.** Both describe the same unbuilt work, the ratified Text/Markup/Insights/Melody names and the 0.5 rem tab padding. r1 filed it as COLOUR-6 (from STATE.md's narrative); OPEN.md and STATE.md's tracker now carry it as N.132 with its own number. Kept as two rows per the no-merge rule.
- **NEW: N.130/N.131 and COLOUR-6/COLOUR-7's INBOX.md 2026-09-13 French-parity note.** The measurement behind N.130 and N.131 (122 of 622 `i18n.ts` entries carry identical French) is the same measurement r1 described informally around COLOUR-6. Kept separate for the same reason.

---

## WHAT I COULD NOT ESTABLISH

**NOT ESTABLISHED beats a complete invented answer.**

- **Whether COLOUR-2 and COLOUR-3's specific per-token dispositions (which neutrals consolidate; whether `--light-sage`, `--light-lavender`, `--deeper-sage`, `--muted-lavender` each become a role or go) were carried into code.** The ruling stage that decided them is closed ("STAGE 2 CLOSED 2026-09-13... Nothing in stage 2 is open"), and the stage that builds from the rulings, stage 4, has shipped (`aa2b419`). But this refresh found no line naming the strays' individual fates the way it found the ramp and the fourth value (ink) named in the twenty-values table. Marked closed on the ruling; the granular build detail is NOT ESTABLISHED.
- **The N.72 Chrome-for-iPhone home-screen residue**, as above: `LOG.md` and STATE.md's current text do not agree with each other even internally, and grepping did not resolve it.
- **Whether STRUCT-1 (Voice extracting from Score markup into its own band) is already reflected in the tree or only in documentation.** `docs/memory/PRODUCT.md`'s drawer-path text (line 317) already names "Voice" as a band alongside Piece, Input, Text and Score markup, under a section dated "Ruled 2026-09-09 and 2026-09-10", which predates the 2026-09-13 brainstorm where Dann proposed extracting Voice as a new band. Whether this is the tree anticipating a ruling, a stale draft, or evidence the extraction is further along than STATE.md's narrative suggests, is NOT ESTABLISHED from these files.
- **INBOX-17's second half.** `PRODUCT.md` §The squircle carries the squircle-as-identity ruling (confirmed by reading the file), but INBOX-17's original line also asked for the Calm Authority shape rule to be transcribed alongside it, and this refresh could not confirm that half was written in.
- **Whether N.121(a) and N.121(b) shipped.** Same as r1: "In Code with the path pass" is not confirmed by an exact `LOG.md` quote, this session's grep included.
- **Whether the specific INBOX lines behind INBOX-8, INBOX-9, INBOX-10, INBOX-28 and INBOX-29 are already satisfied by later, unrelated work**, per the contradictions section above.
- **The exact scope of "N.6" and "N.61".** Still named only, nowhere else in any file read this session.
- **Whether every one of r1's "rides with the next paste" exclusions actually shipped.** This refresh did not re-verify them individually; r1's own Method note named the inference and this refresh relied on it rather than re-deriving it, since the brief's instrument for this refresh is the five memory files plus targeted tree checks, not a full re-audit of `LOG.md`.
- **Whether every one of r1's 114 rows not flagged above as closed, new, or changed is still accurately described.** This refresh re-read all five source files in full and grepped `LOG.md` for specific terms (`N.72`, `bits-ui`, `neutral`, `N.137`, the four colour-ruling names), plus checked `apps/web/package.json` and `docs/memory/PRODUCT.md`'s headings directly, but did not grep `LOG.md` line by line for all 114 rows individually, per the brief's own instruction to grep rather than read `LOG.md` in full.
