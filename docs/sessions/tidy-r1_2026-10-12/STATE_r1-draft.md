# STATE — where we are

r1 draft, 2026-10-12. Updated at the close of every session; this is the handover. It holds only what is open. Closed rows, superseded floors, and the colophons of 2026-09-19 to 2026-09-22 are in `STATE-archive.md`, verbatim; the older archive is `../sessions/LOG.md`. Tripwire: over 200 lines means something failed to move.

Repository: branch `Shane`. **This file never names HEAD, and cannot.** It names a **floor**: everything below was true at or before the floor, and a tree ahead of it tells you only that work has landed since. **The push range is the check, not the memo.**

**Floor: `9f9e896`** (unchanged at the handover of 2026-10-12). The earlier floors, `9d1baa6` (2026-09-27, walked by Dann on the alias), `1987157` (2026-09-24), `f6d2184` (2026-09-22, walked in French: *"This looks as it should!"*), and the thirty-nine before them, are listed in `STATE-archive.md` and `../sessions/LOG.md`.

Ask Dann for the state in one line. Read-only git is allowed (`CONTRACT.md` section 4); asking is still the habit.

```
git -C ~/Desktop/ilya-rewrite --no-optional-locks --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-optional-locks --no-pager status --porcelain
```

---

## THE ONE THING

**The scan reader reads at least 95 of every 100 printed notes on unseen songs, on the singer's path.** Set 3 scored 93.8 (QUEUE row 76); its four low songs were opened and two fixes shipped (row 77, `b80b543`); set 4 is sealed and its final test is READY (row 86). The goal behind it: a working beta. PDF and photograph stay in it. MIDI is OUT, ruled by Dann 2026-10-01 01:25 (`PRODUCT.md`, "Closed and not to be reopened").

### HANDOVER OF 2026-10-12, the night thread from 01:28 (Opus desk, Dann asleep from about 01:37). READ FIRST.

> **Floor unchanged, `9f9e896`.** Nothing shipped; nothing committed. THE ONE THING is unchanged: the scan reader reads at least 95 of every 100 printed notes on unseen songs, on the singer's path.
>
> **Done this thread (each in its file):**
> 1. **Row 82 is READY** (`../sessions/brief-code-prereform-model_r2_2026-10-12.md`, all fifteen of Fable's amendments). For Code on the Mac after rows 78a to 79. It reads `~/Downloads/_desk-heldout-exclusions_2026-10-12.md` first (set 4 now listed).
> 2. **Held-out set 4 chosen and downloaded, sealed** in `~/Downloads/_desk-heldout4-private/` (ten pre-1918 songs, three bass-clef; J swapped to Glière Op.12 No.6 because set 2 holds Artsybushev Op.5 No.1; manifest there). Truth drafts: two Opus helpers running from about 01:53 (brief in the same folder).
> 3. **Baritone and bass ready to present**: `../sessions/present-voice-families-baritone-bass_r1_2026-10-12.md`. Draft r3 with eight new rows: `Insights Research/_synthesis/draft-voice-families_r3_2026-10-12.md`; claims from eight articles read whole: `claims-baritone-bass_r1_2026-10-12.md` there. Not read: Nava 1899, Nava 1872, Marzo 1906 (no text layer).
> 4. **French owed, drafted for Dann's ruling**: `../sessions/draft-french-owed_r1_2026-10-12.md` (row 66's twelve strings, row 70's five as built, row 67's three items: two now sourced from the OQLF, one closed by his 04:58 ruling).
> 5. **Rows 83 and 84 written and Fable-reviewed** (`../sessions/review-fable-briefs-83-84_r1_2026-10-12.md`). **Row 83 RUNNING in the cloud lane on a new branch `cloud-lane-2`** (session https://claude.ai/code/session_019AMrv87SSa5Rtk4X3pxvBk). Row 84 waits for the ship of rows 78a to 79.
> 6. **Debts paid:** SCHEDULE week 5 housekeeping (`PRODUCT.md` §"A hue names one idea"; INBOX-17 and -31 were already there); St-Pierre §3.1.1 re-verified against the PDF, and her Chapter 4 does give performance lengths (`OWED.md`).
>
> **Update 2026-10-12 11:42.** **Set 4's ten truth files are done**, all self-checked, in `~/Downloads/_desk-heldout4-private/truth/` (manifest updated; 4J is post-reform, so nine of ten are pre-reform). **Row 83 is built** on `cloud-lane-2` at `e7acf7f`, for Dann's merge. **Code on the Mac hit its usage limit:** rows 78a, 78b, 78c are WRITTEN and reported; row 79 is partly built (Text and Insights rules done; Insights line breaks, Markup's shared space, the 15 percent check, the after table, and its gates left). All uncommitted on `Shane`. Gates 4 and 5 moved (2461, 673 + 5 skipped) and the ship script's lines are the desk's to move. Code raised `staff-renderer.ts`'s ratchet 3486 to 3489 (DESK DEFAULT: accepted, the brief put the ring's reach in the renderer). One collision for Dann's eye at the walk: the tie between bars 56 and 57 of the Tchaikovsky song runs through two red rings. The section-heading back-fill is 6 of 19 files (`OWED.md`).
>
> **Not done, and why:** the `section_heading` back-fill (`OWED.md`) waits for a helper slot; it is about 1,700 rows across 25 files and needs a plan before a helper is sent.
>
> **This thread's mistakes, each owned when made:** told Dann at 14:13 that set 3's 93.8 was NOT ESTABLISHED on the singer's path without reading row 76's report; it was taken on headless Chrome, WebGPU, the deployed alias, through the file input (`../sessions/report-code-the-final-test-set3_r1_2026-10-11.md`, "The adapter"), corrected at 14:20; stamped six records about forty minutes ahead of the clock, corrected by search and replace (`ENVIRONMENT.md`, night of 2026-10-12); created an empty `docs/sessions/_stage` folder the bridge cannot remove (git ignores it).
>
> Older handovers: all in `../sessions/LOG.md`, the latest block "STATE.md handover of 2026-10-12 01:20, moved at the desk thread of 2026-10-12 01:28 onward".

---

## THE TRACKER

Marks: `[ ]` open · `[D]` Dann's to rule · `[~]` shipped, not walked, or parked. Specs live in `OPEN.md` (from 2026-09-13); build order in `SEQUENCE.md` (from 2026-09-15; six dependencies fix the order and everything else floats); the week plan in `SCHEDULE.md`; debts and unsettled questions in `OWED.md` (from 2026-09-20). Every row below was checked against `git log` on 2026-10-11 19:40 unless its date says otherwise.

### Numbered 2026-10-11

- `[ ]` **N.184. Ilya reads the pre-reform spelling (ѣ, ѳ, ѵ, і) in a score's underlay.** Ruled in by Dann 2026-10-11 23:32 (*"We need this capability"*); DESK DEFAULT number. Plan: rows 81 (baseline, measured) and 82 (a fine-tuned Russian model, READY). Spec in `OPEN.md`.
- `[~]` **N.183. The 32nd and the 64th in the editing controls (keys 2 and 1, as in Finale).** SHIPPED `fd1c86a` 2026-10-11 23:51 (QUEUE row 75); not walked. Offered by the desk 18:58 from the Mussorgsky bar; ruled in by Dann 18:59 (*"yes, add Finale's other two digits"*). DESK DEFAULT number. Spec: the brief, QUEUE row 75.

### Numbered 2026-10-09

- `[~]` **N.181. A word after «не» that the dictionary does not hold is looked up joined to «не».** Shipped `d0b65a9`; Dann's walk is not recorded. Offered by the desk 2026-10-09 01:21 from Dann's walk (*Without Sun*, no. 1: «не проглядная» drew [pro], unreduced); ruled in by Dann 01:23 (*"yes"*). DESK DEFAULT number (N.180 was struck as a duplicate of N.135). Spec in `OPEN.md`.

### Found unlisted 2026-10-02

- `[~]` **N.12, increment 2. The old spelling's endings.** Shipped `e3e2c33`; DONE is Dann's walk. Ruled in by Dann 2026-08-08 (*"let's aim for completeness"*, as `packages/dictionary/src/pre-reform-normalizer.ts:92-93` records it) and never built until Dann met its effect on 2026-10-02 19:40 ([go] under «шумнаго»). The desk takes his words as settling the one question the 2026-08-08 notes left open: -аго is sung as -ого. `QUEUE.md` row 25.

### Numbered 2026-10-01

- `[~]` **N.179. Clear placements by scope, and place from here (after Finale).** Shipped `a3dde11`; 'this measure' and Undo walked 2026-10-09; 'to the end', 'whole piece', and Place from here are not walked. Ruled ready for a brief by Dann 2026-10-01 02:43; DESK DEFAULT number. `QUEUE.md` row 14.
- `[ ]` **N.177. Dynamics: a layer the singer can add and edit, and dynamics read from MusicXML.** Numbered by Dann 2026-10-01 02:39. After N.120. Spec in `OPEN.md`.
- `[ ]` **N.178. Reading tempo words and dynamics from scans and photographs.** Numbered by Dann 2026-10-01 02:39. Widened to the scan reader; first reading by homr shipped `0976735`; tempo words and dynamics from scans are unbuilt. A research item, measured on real pages before any accuracy is promised. After N.177. Spec in `OPEN.md`.
- `[ ]` **N.175. Video walkthroughs, English and French, on an Ilya YouTube channel.** Numbered by Dann 2026-10-01 01:15. Made from the finished build; the Guide links to them. Spec in `OPEN.md`.

### Numbered 2026-09-24, evening

- `[ ]` **N.173. How Insights chooses what to say: the curation rules.** Numbered by Dann 2026-09-24 23:45, a living draft, deliberately not ruled. 2026-09-25: seven sections on how Insights speaks ruled into `PRODUCT.md`; the rules themselves still a living draft, `../sessions/draft-curation-rules_r1_2026-09-24.md`; spec in `OPEN.md`.
- `[ ]` **N.172. The singer says how experienced they are (Dreyfus's five stages), and Insights adjusts.** Numbered by Dann 2026-09-24 23:14. 2026-09-25: the intake is RATIFIED in both languages (14:27 to 14:51); built with N.168's first slice. Built with the first Insights connections that use the ranking, not before (the desk's placement; agreed by Dann 23:16). Spec in `OPEN.md`.

### Numbered 2026-09-23

- `[ ]` **N.168. Insights intake: filling the three stores.** Numbered by Dann 2026-09-23 17:29, *"we should engage in it ASAP."* The plan is `~/Documents/Voice Pedagogy Library/Insights Research/plan-intake_r1_2026-09-23.md` (seven steps: condition map, frequency run, coverage audit, targeted extraction, composing, Dann's vetting, encoding and tests), resting on the five Insights principles ratified the same afternoon (`PRODUCT.md`, "What Insights is for" to "How Insights stays trustworthy"). Steps 1 to 3 done, step 2 shipped `10e090c`, step 4 under way. Spec in `OPEN.md`.
- `[ ]` **N.170. Outside eyes: refine Ilya with singers and outside reviewers.** Numbered by Dann 2026-09-24 15:54; placed by Dann 2026-09-24 21:03 in weeks 5 and 6 (`SCHEDULE.md`). Seven steps, spec in `OPEN.md`; the review packet is step 2.

### Numbered 2026-09-22

- `[~]` **N.167. A French singer can sit through the whole reader wait reading English.** Shipped `350a2e5`; whether Dann saw it in French is not established. Ruled in by Dann 2026-09-22 on the desk's revised recommendation; found by Code. Code's reading of the mechanism, not established by the desk: the waiting line's text is fixed once from the `language` value in play (`ScoreUploader.svelte:134`) and never re-translated. Dann's own screenshot the same morning showed « Préparation du lecteur de page » in French on the alias. Why it is not a tidy-up: `PRODUCT.md` §"Both languages, start to finish". Row 41 (the wait on the Paper) folds it in. Spec in `OPEN.md`.
- `[ ]` **N.163. Ilya shows a singer a word that is not on the page.** Ruled in by Dann 2026-09-22 from N.146's walk finding 4, on the desk's recommendation that it meets the freeze rule's false-statement test. The OCR read «То» as «Го», and Transcription drew it as `'go` with the gloss "go". Spec in `OPEN.md`. NOT ESTABLISHED: whether the fix belongs at the OCR layer, at the dictionary seam, or in how an unknown word is presented.
- `[ ]` **N.166. A stored scan may need the page reader to redisplay.** DESK DEFAULT number, found 2026-09-22. Established real and measured by Code 2026-09-22: `ScoreUploader.svelte:771-776` restores by calling `handleFile(file, restore.answers)`, which re-reads the page (one-page PDF: 3.8 s to 61.3 s). Reloads are fast after the first since `bbe524b` (first reload 44 s, later 0.4 s; QUEUE row 38); the first-reload cost remains, and row 13's measure is still owed. The string says "This will only happen once."

### Numbered 2026-09-21

- `[ ]` **N.162. A caret and a note compete for the same thumb.** DESK DEFAULT number, split off at N.153's close on Dann's ruling to close N.153 rather than hold it open for this. Measured by Code 2026-09-21: a caret's hit centre sits 15.6 to 21.4 px from the nearest note's hit centre, and `nearestTarget` pools notes and carets by nearest centre, so the catchment round a caret is about eight to ten pixels. A different mechanism from N.153's spacing (caret-to-caret now clears 44 px). Clause 13's literal words are met and its reasoning is not. NOT ESTABLISHED: whether a note must stay tappable inside Corrections. Clause 3's fallback condition may be live, and Dann hears about it before a chip row is built. Spec not yet written.
- `[ ]` **N.160. The work, and its two views.** DESK DEFAULT number; the model is Dann's (`PRODUCT.md`). Steps 1 to 3 closed 2026-09-21 (`1d18514`, `2fb7516`, `46ac52f`, each walked); the heal wrote 14 of his 96 seats and the dry run reads 91 address, 1 rejected, 4 unfound. Steps 4 and 5 wait until after 2026-10-30. Spec in `OPEN.md`, plan `../sessions/memo-n160b-the-approach_r1_2026-09-21.md`. The deferred ruling is still not asked: five notes, all «одинокая», which Code reads as possibly blocked by a seat that already holds the word; settle that before putting it to Dann.

### Numbered 2026-09-20

- `[ ]` **N.157. Replacing a score does not re-derive the seats.** DESK DEFAULT number. A replacement keeps every stored seat with its old text, never seats the note the new file adds, and `refreshPairings` updates a seat only on an exact origin match. Spec in `OPEN.md`. The desk patched Dann's library by hand once (song `39ae51c9`, key `m17-1-2`, « я » to « я. »); that is not the fix.
- `[~]` **N.156. The Sunless 01 fixture is missing its final syllable and a note.** Shipped `b53a6df` and `9801308`; whether the lyric-line disagreement defect (lines 1 and 2 disagree about «непроглядная» from measure 4; line 2 lags by one note at the end) is fixed is not established. Ruled in by Dann 2026-09-20 14:21, who chose the real fix over retagging «ка». Brief `../sessions/brief-n156-sunless01-fixture_r1_2026-09-20.md`.

### Numbered 2026-09-17

- `[ ]` **N.151. The measure edit surface, with insert.** DESK DEFAULT number. Insertion is built as N.92 slice 3 (`correction.ts:48-100`, `:305-345`, `:496`, `:382-433`, reached through `CorrectionSurface.svelte:539-541`), so the item is tether 22: it exists and is hard to find. It carries nine of Dann's rulings of 2026-09-17, four of them product-level (WYSIWYG, *"if it appears on Ilya's page, it can be printed"*; no stopping rule for the singer; the edited score comes back out as an edited copy with the singer's own tempo counted; deliberate destruction only), transcribed to `PRODUCT.md` on 2026-09-22. Report `../sessions/report-n151-note-entry_r1_2026-09-17.md`. NOT ESTABLISHED: its size, and where it sits against the release.

### Numbered 2026-09-16

- `[ ]` **N.92. Notation editing.** Numbered by Dann 2026-08-24. Slices 1 to 3 shipped, insertion included; the caret reach is drawn (N.153 owned the phone). Open: the four singer's marks, tie to the note before, and the page flag for a measure left over. Spec `../sessions/spec-n92-edit-surface_r1_2026-09-17.md`, audit `../sessions/memo-n92-edit-audit_r1_2026-09-17.md`.
- `[~]` **N.152. Playback of the Markup.** LATER, its own cardinal, asked for by Dann 2026-09-17. Spec in `OPEN.md`.

### Numbered 2026-09-14

- `[ ]` **N.141. The squircle has no grammar.** The height rule closed 2026-09-21, `6101e01`, walked (*"Yes this is ideal"*); Dann amended his own one-height ruling on 2026-09-20 to get it (`OPEN.md` §N.141). Open: the squircle across a tie (no longer waits on N.142; counted zero 2026-09-24; no week carries it), and the viewBox clamp binding on two notes. DESK DEFAULT number. Spec in `OPEN.md`, including the permission to re-engrave the measure for the loupe and its cost. **His ruling of 2026-09-14, "I don't want Ilya dropping hyphens", sits at `OPEN.md:1250` inside this spec and must be rehomed before N.141 closes (`OWED.md`).**
- `[ ]` **N.140. The loupe guarantees a stave space, and scrolls rather than shrinking below it.** Dann's own design, ruled 2026-09-14, over the desk's recommendation to do nothing. Mostly built (code audit 2026-09-24, recorded on his instruction: *"That's great news, please update our records"*); only the sideways scroll against a syllable tap remains (`OPEN.md` §N.140). He owes the floor in CSS pixels, and whether the scroll may take a gesture on a surface where the swipe dismisses and the tap places a syllable.
- `[ ]` **N.135. The page reader reads the text underlay.** Ruled by Dann 2026-09-14. Cost measured in `../sessions/memo-n135-ocr-measurement_r1_2026-09-14.md`. N.180's notes sit under it in `OPEN.md`. N.184 and row 81's row reader lean on it.

### Older open residue

- **Nothing blocks the beta** (2026-08-21): N.67, N.72 closed; N.58 (MIDI import) deferred by Dann 2026-08-21; N.59 (the reader in the browser) parked at tier 2, answered no, 2026-08-18. Still open inside them: N.59 step 3, the brace rule, is `WRITTEN` and not `DONE`; a singer on Chrome for iPhone can never install Ilya to the home screen (Dann to rule). Full accounts in `../sessions/LOG.md` block 10; the closed and parked table in block 9.
- **The visible list, built only if a day finishes early:** N.45's remainder · N.51 · N.17 · N.19 · N.61 · N.6 · and, unnumbered, the watch band's English header (`watchlist.ts:92`, printed in French mode; Dann to rule). **N.27** has a home in the tree as a comment at the reporting seam (`library.ts`, `Library.save`), recorded by N.67 step 6 and deliberately not built: when N.27 is built, `profileStore.saveStore` (`profileStore.ts:217-225`) routes through that seam; it is the last catch-and-drop of its kind. **N.28** ships on N.67's step 5 binder.
- Open work the rulings audit found not truant (N.84, N.120, N.123, N.122, N.115, N.117, the poem-box warning) is listed in `QUEUE.md`, "Open work, not truant".

---

## THE SCHEMA

1. Only blocking work gets built.
2. A new cardinal displaces a named one or waits. Say which.
3. Half of every build day is reserved for what the previous day's walk found.
4. Every build day ends in a deploy and a walk.
5. N.48 may be unclosable; it needs a `[u]` that fails.

## THE FIXTURE. Read out of the file, do not re-derive it

`~/Downloads/no-lyrics-control.musicxml` is the only instrument that exercises the no-underlay path; all three of Dann's own scores carry lyrics. It holds five pitched notes and one half rest: C4 D4 E4 F4 quarters, G4 half, then a half rest. It is NOT six notes. Its stripped lyric line was five syllables, «Я тебя любил»; its header title is a different text. The walk: transcribe some Russian (or nothing draws); switch to Fit before touching any file input; upload the control; press *Continue to analysis*; expect `5 / 5`, syllables under the notes, the rest bare, no dashed boxes (walked 2026-08-13). The print fixture (E.51): Marshak's Russian of Sonnet 90 under Kabalevsky op. 52 no. 9, fourteen lines, fills exactly two letter sheets. *(DESK DEFAULT: this section belongs in `ENVIRONMENT.md`; it stays here until moved.)*

## Rulings whose only recorded home is this file (flagged for rehoming)

**RULED 2026-08-16, on E.55's walk findings** (N.70, N.71, N.55b are closed; LOG.md blocks 9 and 10 were not checked for these lines):
- The walk's findings come before N.67 step 4, per the schema's own rule that half of every build day is reserved for what the previous walk found.
- N.70 and N.71 are numbered. The third finding, no cursor on a note, is FOLDED INTO N.71 rather than tracked: one CSS declaration on the same element as N.71's fix.
- N.55b's row is corrected rather than left tidy, Dann's words.
- The N.70 fix is Dann's own third option, better than either I posed: filtered on desktop, no `accept` at all on iOS. Named consequence, accepted: the tree's `isMobile` is a WIDTH test, so a narrow desktop window also gets the unfiltered picker.

---
*r1 draft of 2026-10-12, from `STATE.md` as of that date. What moved, and where, is in `CHANGELOG_r1.md`.*
