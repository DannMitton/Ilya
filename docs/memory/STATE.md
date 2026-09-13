# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

What it names instead is a **FLOOR**: everything described below was true at or
before **`92b7d5d`**, "N.114b: items 6 to 9, air, binder order, collapse row
gone, Start over as a ghost pill", shipped 2026-09-10 04:24, Vercel
`dpl_E42mxc3bGuhkZAUNTMk6RmhrTRhE` READY on the branch alias, walked by Dann
(the previous floors, `8278429` and earlier, are in `../sessions/LOG.md`). A floor cannot go stale,
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

**Ask Dann for the state in one line. You do not run git.**

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

---

## THE ONE THING

> **The history of this section moved to `../sessions/LOG.md` on 2026-09-01.**
> Every entry from 2026-08-23 to 2026-08-27 that used to sit here is in that
> file, verbatim and in order. Nothing was rewritten. This section now carries
> the current one thing and nothing else, which is what `README.md` sends you
> here for.

> **Closed and moved to `../sessions/LOG.md` block 8 at the close of the
> 2026-09-07 session:** N.108 (five increments, `2c1cecf` to `5f6a2f3`),
> N.111 (`7875892`, `c574cf8`, `d5a49ff`, `a186f20`), N.112 (`b191867`,
> `1b3054a`), and N.113 (`e1bcb67`, walked 2026-09-07). All walked by Dann.
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
> **THE ONE THING, at the close of 2026-09-10 23:55: THE DRAWER AS A PATH,
> step 3 of 4. THE PATH PASS IS WALKED WHOLE AND INCREMENT 2 IS SHIPPED AND
> WALKED.** Walk of `a584ad8` by Dann in a fresh incognito profile at 1400 px
> and 390 px, all six steps of `brief-path-pass_r1` §5: passes, with
> findings. Increment 2 shipped `8032489` (Vercel
> `dpl_7TxVs9XHJksHW9nWBVfgLYBHbsPs`, READY 23:41, alias attached), from
> `docs/sessions/brief-path-pass-inc2_r1_2026-09-10.md` on Sonnet's anchor
> memo `memo-anchors-path-pass-inc2_r1_2026-09-10.md`; Code's memo
> `memo-path-pass-inc2_r1_2026-09-10.md`. Dann walked it on the alias at
> 390 px and 1400 px: three bands (PIECE, INPUT, SCORE MARKUP); the Text
> fold under the poem box, closed by default; `1 of 7 changed` after one
> toggle; band corners rounded on close at desktop width ("whatever was
> causing the problems seems to have been resolved"). Gate 4 moved
> 1103 → 1104; `ilya-ship.sh:79` moved with it before the ship.
>
> **RULED BY DANN 2026-09-10 late, all in this session:** (a) nothing under
> TEXT at default, ratified 21:55, then made moot by (b); (b) TEXT is not a
> band: it folds into INPUT as a section under the poem box, on trial
> ("if I don't like it we can revert"), shipped in `8032489`; (c) the
> `n of 7 changed` phrase belongs beside the `Notation` header, NOT the
> `Text` row where Code put it. **ONE LINE FOR CODE, OWED**, into the next
> brief. (d) The running header on page 2 and after should read
> Composer - Title (INBOX, unruled beyond the ask).
>
> **From the walk, settled:** the `.musx` drop works in the browser (denigma
> to MNX); a `.musx` can never carry `from score` because MNX has no work
> metadata (`mnx-parser.ts:743-755`, Sonnet, read); Dann had clicked PIECE
> and TEXT open himself (F4 withdrawn); the short INPUT line after reload is
> a timing race that resolves itself in about 4.6 s (Code, measured), no
> code changed; where the five PIECE fields came from on the `.musx` arrival
> is NOT ESTABLISHED (Code: the file fills none on a fresh profile; Dann's
> typing or a stored song are the two seams). Boot does not transcribe was
> seen again at 390 px, then on the next reload the page DID draw; not
> explained. Code's own NOT ESTABLISHED list is in its memo.
>
> **RULED 2026-09-11 00:00 to 00:12, after the close above, all Dann's:**
> (e) the Text fold is DELETED; `Notation` and `Analysis` are two plain
> rows under the receipts, both closed; (f) Undo and Redo leave the top bar
> (which keeps the sigil and the language toggle) and sit at the right end
> of the SCORE MARKUP band header as clickable text in the label style, not
> pills, shown only when a stack is non-empty; the loupe's own undo is
> unchanged; Code inventories the undo stack first and stops if anything on
> it originates outside Score markup. Brief WRITTEN, not run, UNTRACKED:
> `docs/sessions/brief-path-pass-inc3_r1_2026-09-11.md` (126 lines), which
> also carries (c) and a read-only inventory of filled pills at rest
> (`Dictionary` and `Calibrate` were both filled at 00:02).
>
> **INCREMENT 3 IS SHIPPED, WALKED, AND DONE, 2026-09-12.** Shipped
> `9026a56` (Vercel `dpl_CFgHDALExXjqsPbSDXke2UKsud5X`, READY, branch alias),
> from `brief-path-pass-inc3_r1_2026-09-11.md` on Code's memo
> `memo-path-pass-inc3_r1_2026-09-11.md`. Dann walked all four steps on the
> alias in his own profile at 1400 px: no `TEXT` band; `Notation` and
> `Analysis` two plain closed rows under the intake; `1 of 7 changed` beside
> `Notation`, open and shut, nothing beside `Analysis`; `SCORE MARKUP`
> carrying no pair at rest; and after one `▲ step` in the Corrections
> station, `↶ UNDO` on the band header. **Opening the SCORE MARKUP band did
> NOT dismiss the loupe at desktop width**, which was the desk's named
> likeliest failure. **On a desktop the loupe carries no correction verbs at
> all**: the second `CorrectionSurface` is gated `{#if isPhone}`
> (`+page.svelte:4785`), so the verbs live only in the drawer's Corrections
> station. Code's own phone finding stands unanswered: at 390 px no Undo is
> reachable at the moment of action.
>
> **THE ONE THING after this walk: the four ready briefs, in order.**
> `brief-loupe-typeface_r1_2026-09-12.md` (loupe typeface plus the `↰ ↱`
> marks restored), `brief-n128-stale-beat_r1_2026-09-12.md`,
> `brief-n117-dictionary-fill_r1_2026-09-12.md`,
> `brief-n125-slurs-as-objects_r1_2026-09-11.md`. One Code thread at a time,
> never two: this desk and Code share one working tree.
>
> **N.125, SLURS AS TAPERED OBJECTS, numbered 2026-09-11 00:30 at Dann's
> word, UNPLACED, its own Code thread (`staff-renderer.ts` only, off the
> drawer path).** Finding (Sonnet memo `memo-anchors-ties-slurs_r1_2026-09-11.md`,
> read in full): ties already taper (Dann's eye, `TIE_CENTRE_SP` 0.4 sp,
> 2026-08-27); the uniform-width arcs are SLURS, a 1.3 px stroke
> (`:2636-2670`); long arcs go flat because the slur lift is capped at
> 24 px (`:2658`) and tie depth is fixed at 0.9 lineGap (`:2602`). Gould
> 151: one design for both. Gould's slur pages 109-112 never photographed,
> so the arch height is Dann's eye: the brief asks Code for three renders
> per number. Brief WRITTEN, UNTRACKED:
> `docs/sessions/brief-n125-slurs-as-objects_r1_2026-09-11.md`.
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
> **N.128, THE BEAT A NOTE THINKS IT IS ON, numbered by Dann 2026-09-12,
> UNPLACED. A corrected duration does not move the following notes' stored
> rhythmic position, so beam grouping reads a stale beat.** Found on Dann's
> own Sunless 01 page: « на–я » is flagged and « ла–я » is beamed although
> both are drawn as two eighths in the last beat of their measure.
> **Dann's words, and they are the item, not the beaming:** *"I really don't
> care whether this kind of figure is beamed or flagged, but whatever it is,
> it has to follow a rule. This doesn't seem to, and I want to scrutinize
> what looks like arbitrary typesetting."*
> Measured from the live SVG in his browser: spacing identical for both
> pairs (тес→на 54.78 px = ми→ла 54.78 px; на→я 20.14 vs ла→я 19.67;
> я→rest 15.68 vs 15.69); all four stems down, so timbre did not break the
> group; the only eighth rests (SMuFL `e4e6`) sit at x 353.2, 490.85, 602.5,
> each AFTER the second « я », so no rest and no barline falls between
> either pair; the system's one beam runs x 563.89 to 583.56.
> Cause: the beam key is
> `measure | beatIndexOf(ev.rhythmicPosition.fraction, ts) | timbre`
> (`staff-renderer.ts:1611`), and `modification-engine.ts` has ZERO
> references to `rhythmicPosition` (grep, 0 hits). The x layout advances by
> duration, so the page redraws; nothing recomputes the following events'
> positions. On the page на is `m1-1-1` (4.0 quarters, beat 3 of 12/8) and
> я is `m1-5-4` (5.0, beat 4); ла is `m2-9-8` (4.5, beat 4) and я is
> `m2-5-4` (5.0, beat 4). Corroborating: the source file has тес as a PLAIN
> quarter at 3.0q (`~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls
> (engraved).musicxml`, md5 `265f7cb5fa359942b54826795cf10c4f`,
> byte-identical to `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`),
> while the page draws it 1.5 quarters wide.
> **NOT ESTABLISHED, named so it is not lost:** two other consumers compare
> the same field against tempo and marking positions, `sustain.ts:67-79` and
> `watchlist.ts:232-240`, so a corrected duration may also mis-assign a
> sustain marking or a watch-list entry.
> Brief WRITTEN, NOT RUN, UNTRACKED:
> `docs/sessions/brief-n128-stale-beat_r1_2026-09-12.md`.
>
> **NEXT, in order:** increment 3 (the brief above: `git add` it, paste the
> opener from `brief-path-pass-inc2`'s pattern, ship, walk); N.119; N.120 (drawing first, now carrying the `Tempo`
> station, see N.120 below); N.121 remainder; N.122; then step 4, the phone
> landing against portrait C. Usage 2026-09-10 22:26: Fable 71%, all-models
> 44%, reset Sunday 05:00. Two Sonnet subagents ran tonight from this desk
> at Dann's instruction ("I don't need to be involved"): 148k and 160k
> tokens against the all-models pool; the desk had quoted 60k for the
> first and owns the miss.
>
> **The superseded 06:15 block moved to `../sessions/LOG.md` block 10.**
>
> **Earlier the same session:** brief `docs/sessions/brief-path-pass_r1_2026-09-10.md`,
> built on Sonnet's read-only anchor memo
> `docs/sessions/memo-anchors-path-pass_r1_2026-09-10.md` (86 lines; its
> finding: no front-side band has an open or closed state today, only
> sub-stations toggle, `sections.svelte.ts:54`). Code returns
> `memo-path-pass_r1_…`; NOT walked until Dann walks it on the alias. Two
> DESK DEFAULTS in the brief for Dann to wave off: Input closes like its
> siblings; the bands join the station store. **Step 2 DONE:** drawing r2
> `docs/sessions/drawing-drawer-front-side_r2_2026-09-10.html`, Plates A to
> D plus the departures table, rendered and checked, Plate B corrected to
> the tree after the walk; nothing in it is open. Then: N.119, N.120
> (drawing first), N.121 remainder, N.122; (4) the phone landing against
> portrait C, its own drawing. Fable was at 62% on 2026-09-10 early; farm
> mechanical work to Sonnet. **Closed this session and moved to
> `../sessions/LOG.md` block 9:** N.113a and N.113b (walks and the item 3
> account), N.114 (done, walked), N.114a (done, walked), and N.114b items 1
> to 5 (done, walked). Details there, verbatim.
>
> **N.114b CLOSED WHOLE, items 1 to 9, 2026-09-10 04:36, walked by Dann on
> the alias** (`92b7d5d`, memo r3). Moved to `../sessions/LOG.md` block 9.
> Still owed from it: the Undo clause for Start placement over (N.121 d).
>

> **N.118, NUMBERED BY DANN 2026-09-09: punctuation travels in the slot.**
> A placed syllable never carries the poem's punctuation because
> `cyrOfSyllable` reads `cleanWord` (`pairings.ts:152-159`); the punctuated
> cells on the page are wherever the map has no entry (`pairedCyrillic`,
> `:702-712`, overrides only mapped ids; consistent with Dann's screens, not
> yet proven on a taken note). Ruled design, desk's recommendation taken
> over Dann's first idea of a Transcribe-and-fit restore pass: give the
> word's LAST syllable its trailing punctuation inside `buildSlotQueue`
> (`:192-226`), so every placement, shift, and re-seat carries it. NOT
> ESTABLISHED for Code: whether `WordStackData` holds the raw word beside
> `cleanWord`; whether `estimateCyrillicWidthPx` prices a trailing comma.
> Gould rule 10 (project extraction, snippet only): the Cyrillic line keeps
> the author's punctuation. Dann said N.115; N.115 was taken, N.118 is the
> DESK DEFAULT. After N.114 unless he places it.
>
> **DESIGN RETURNED, 2026-09-10 07:36, READ IN FULL, CRITIQUED, RULED ON.**
> Reply: `docs/sessions/design-reply-drawer-as-a-path_r1_2026-09-10.html`
> (bundled page; render it to read it). Critique:
> `docs/sessions/desk-critique-of-design-reply_r1_2026-09-10.md`. Design's
> two findings the desk missed: THE PHONE LANDING (a step's primary action
> changes nothing in view on a phone) and THE STALE STATE (done is not
> permanent; toggles = N.119). **Dann's rulings on it, all 2026-09-10:**
> lyric hands FIRST in Corrections, always, fixed (Design's swap-by-state
> rejected); the METADATA label on the Piece band is struck (DESK DEFAULT:
> the fields show whenever Piece is open); on a phone a step's primary
> action lands the singer on the page and Back brings them home (READ
> AGAINST PORTRAIT C before Code); the ⓘ on Russian-o stays as the ONE
> NAMED EXEMPTION to slate rule 11; no word on every unplaced syllable,
> count plus ink on the page, state in the accessible label. French table
> shown (INBOX); « saisir », « coller », « déposer » adopted from the tree;
> the rest stands unless he names a row. Design's corrections to the
> thesis ACCEPTED: state line is the collapsed form; empty drawer opens
> Input only, Piece collapsed; "committed is black" holds once placed.
> Usage: Fable 62%, all-models 38%, reset Sunday; Fable scarce.
>
> **NEXT, in order:** (1) transcribe the ratified grammar, the path rules,
> and the exemptions into `PRODUCT.md` (mechanical: Sonnet); (2) a drawing
> r2 of the drawer front side from Design's frames A, B, C with Dann's
> rulings applied (desk); (3) Code briefs: N.114b items 6 to 9 (ready),
> then the path pass (Piece collapsed on empty, state lines, one primary,
> Calibrate, placed, strings), then N.119, N.120 (lyric first), N.121,
> N.122; (4) the phone landing against portrait C, its own drawing.
>
> **THE ONE THING, 2026-09-10 03:20: THE DRAWER AS A PATH. Design is being
> consulted.** Brief `docs/sessions/brief-to-design-drawer-as-a-path_r1_2026-09-10.md`
> committed `a03cfdc`, package of five (brief, drawing r1, design system
> r2-3 md5 `3b0c9cf4c9f194245d6ab6914d7c52a8`, two screenshots). Dann hands
> it to Design himself. Asked of Design: a three-session walkthrough from
> the singer's chair measured by CONFIDENCE (knowing it worked before moving
> on), then mockups of the front side in three states and the calibration
> summary with the capture surface open in place, then a page of reasoning
> and a NOT ESTABLISHED section. While Design works: N.114b items 6 to 9
> are briefed for Code and independent of Design; N.119 is briefed-in-
> principle; N.120 to N.122 WAIT for Design's return before any drawing r2.
> Design's return goes into STATE.md and its rulings into PRODUCT.md.
>
> **N.114b, items 1 to 5 DONE on Dann's alias walk 2026-09-10 (`ec4fbe9`,
> `7665afa`, `8278429`); items 6 to 9 BRIEFED, NOT RUN**, all in
> `docs/sessions/brief-n114b-pills-over-the-drawer_r1_2026-09-10.md`: 6 air
> above the open syllable box; 7 Export and import order (all, this, import);
> 8 the calibration surface's collapse row goes; 9 Start over as a ghost
> pill. Done and seen: the pills tangent to the card with "Redo" on
> METADATA's line (`--band-inset`, `app.css`); air under every band; Start
> placement over as a ghost pill in the open syllable line's row. **Undo for
> Start placement over is NOT wired: no existing clause fits; the sentence
> is Dann's to rule (English and French), then one line in Code.**
>
> **NUMBERED BY DANN 2026-09-10 ("create cardinal numbers for what deserves
> it"), all UNPLACED, all after N.114b's items 6 to 9:**
>
> **N.119, the Notation toggles reach Score markup live.** Dann: "I want
> them to." Tree facts: the open-syllabification toggle clears syllable
> overrides (`+page.svelte:2391`); the IPA line under the notes comes from
> `underlayResolvers` (`VoiceProfilePane.svelte:748-755`), which takes
> `openSyllabification` only. Code reads which toggles reach it. Own brief.
>
> **N.120, the Corrections station redesigned: context before choice.**
> Dann: "a tangled junk drawer." About twenty controls drawn at once, one
> of four stations named. Desk's recommendation, unruled: each station is a
> sentence that opens ("Duration · dotted quarter", "Pitch · B♭3",
> "Accidental · flat", "Lyric · тес, 37 / 94"), one open at a time, and
> only what applies to the taken thing is shown (nothing taken: "Take a note
> to correct it"; a rest: no Pitch, Accidental, Lyric). DRAWING FIRST,
> citing the station shape ruled 2026-08-13 and Fable's E.44 amendment
> (tether 17), then a Fable pass if Dann wants one, then Code.
>
> **N.121, RULED IN PART 2026-09-10 late, the two sets of words:** the
> singer is never surprised by which words end up under the notes. A score
> arriving with words into an EMPTY box fills the box and tags the poem
> receipt "from score" (the Piece fields' own pattern); no question; never
> overwrite a singer's words. No difference reporting, ever. No narration on
> score arrival. Dann's earlier sketch of an in-place question is
> WITHDRAWN. Also under N.121: the PDF question asks only when neither tell
> fires (Cyrillic text layer = poem; staves = score), Code to wire.
>
> **N.121, the Input band's words and the way in.** (a) RULED 2026-09-10
> 04:50: placeholder "Paste, type, or drop your poem here." and, under the
> field while empty, "A score or a photograph can go here too, or you can
> choose a file." with the last three words as the link; the pill goes;
> "poem" kept over "text" because Text is the band. French shown and
> standing (table in the path-pass brief §6). In Code with the path pass.
> (b) RULED 2026-09-10: "37 / 94 placed", « 37 / 94 placées ». In Code. (c)
> "Transcribe and fit": since N.112 text transcribes live, so what the
> button still does is NOT ESTABLISHED; Code states it before any rename;
> if it only fits, "Fit to score" / « Ajuster à la partition », coined.
> (d) the undo clause for Start placement over, "placements rebuilt" or
> Dann's better word, both languages, then the push is one line.
>
> **N.123, THE AGGREGATION LAYER, numbered by Dann 2026-09-10 late,
> UNPLACED, displaces nothing until he places it.** One layer under four
> figures (E.19, 2026-07-30, found them sharing it): per-pitch and per-vowel
> phonation time in seconds; the TESSITURAGRAM (adopted from Titze and
> Maxfield, J Singing 77(5), 2021, pp. 653-661, read in full by Sonnet): the
> accumulated-duration histogram per pitch with the singer's turning points
> shaded; beneath it the half-mass band ("half the singing sits between D3
> and A3", the narrowest interval holding half the summed sung duration,
> DESK DEFAULT fraction one half, coined wording), the duration-weighted
> centre of gravity (Rastall, via Barcan 2013, formula NOT ESTABLISHED),
> Pacheco's half-maximum band drawn on the same histogram as a labelled
> second reading (Chapter 6 continuity), and CYCLE DOSE (Titze, Švec, and
> Popolo, JSLHR 46(4), 2003; primary NOT fetched, formulas from a citing
> review), which is Dann's fold-collision count: sum over sung notes of
> f0 × seconds, rests out. **RULED by Dann:** full-voiced classical singing,
> one collision per cycle in principle; the falsetto/breathy caveat is one
> line on the screen and never stops the figure. Amends E.20 ruling 9
> (2026-07-31, "a cute add-on, a learned guess"): it is a named, cited
> figure, carried with the tempo's band. Survey:
> `docs/sessions/memo-tessitura-literature_r1_2026-09-10.md` (218 lines;
> 10 sources full, 4 snippet only; Thurmer 1988 "tessiturogram" and Tessa
> 2020 not fetched). Guide paragraph, English only, r2 with dates:
> `docs/sessions/guide-tessituragram-paragraph_r2_2026-09-10.md` (N.84).
> Ruled out again: any ranking or difficulty score.
>
> **N.124, REPERTOIRE FOR A STUDIO, numbered by Dann 2026-09-10 late,
> UNPLACED, after N.123.** A teacher holding several students' voices,
> one song. Ilya gives a curation, not a table: the original key's
> challenges in sentences (range first, on held or exposed notes, ceiling
> AND floor; then how the song sits against the passaggi, counting which
> vowels land there per Shane's per-vowel sums), then up to THREE candidate
> keys inside the voice's window, each with its sentence and what it trades
> away, or the honest finding that no key fits and another song is the
> answer ("and that's ok"). Amends the 2026-08-07 ruling against suitability
> judgements in scope: Ilya may suggest keys with reasons on their face;
> never a score, never a rank. **Pianist's key, Dann's rule:** a proposed
> transposition landing in a key pianists resist is disfavoured (six sharps
> his example; five flats acceptable); DESK DEFAULT table until he names
> one: up to four sharps or five flats count as pianistic, beyond that
> shown with a one-clause note and never chosen over an equal pianistic
> key; enharmonics respelled (C♭ as B, C♯ as D♭). **The rule never touches
> the original key** ("some pieces are written in six or seven sharps"), nor
> a candidate that lands back in it. Needs: N.123; the singer's floor and
> ceiling from calibration (what the wizard captures today NOT ESTABLISHED);
> a multi-voice library, NOT ESTABLISHED as existing; sentence copy in both
> languages, Dann's, before Code.
>
> **N.120 gains a `Tempo` station, RULED by Dann 2026-09-10 late:** Ilya
> presets tempo from what it reads (encoded mark, or an editorial marking on
> an image or PDF), applies changes at the score's own tempo words, shows
> every one on the Score markup page (nothing hidden), and the singer
> overrides any of them without being made to articulate a tempo they did
> not choose ("death by a thousand cuts"). Shape, desk's: a sentence station
> `Tempo · ♩ = 72 · from score`, and on a taken note `from here`. The seam
> is built (E.20, 2026-07-31: override → mark → Quantz tier with band →
> abstain); per-region override NOT ESTABLISHED in the tree. Finale's
> handling of gradual cues (rit., rall., schnell) is an INBOX item, recorded
> at Dann's word, for the same station.
>
> **N.122, the capture surface as a landmark.** Dann, 2026-09-10: the
> lavender vowel-intake surface (the capture phase with the fry guide,
> `CalibrationWizard.svelte`, phase `capture`) is a surface "people will
> respond well to" and he wants it as a VISUAL LANDMARK that stays
> available to view. Ruled shape: the summary stays on screen; the capture
> surface lives inside it as a section that opens when Re-take or "Sing the
> three Ilya derived for you" is pressed, and folds when that vowel is done,
> so the table is never lost while singing. Still a phase in the wizard's
> logic; what changes is that phases no longer replace each other on the
> summary. DRAWING FIRST, citing wizard spec v1 and pacifier spec v11
> (project knowledge, tether 17) so nothing ruled there is re-decided.
> Unplaced; belongs with N.120 as "the drawer's surfaces".
> **DRAWN r1, 2026-09-10 late: `docs/sessions/drawing-calibration-surface_r1_2026-09-10.html`**,
> rendered and checked. Plate 1 is THE DRAWER GRAMMAR, every measure with
> its file and line, to go into `PRODUCT.md` once Dann ratifies it; Plates
> 2 and 3 redraw the summary to it (verbs by state, two station rows, one
> caption, Finish last) and show N.122's capture surface opening under the
> pressed row. Plate 5 asks four things, unanswered. Wizard spec v1 and
> pacifier spec v11 NOT OPENED; open them before Code is briefed.
>
> **For N.84 (Guide):** explain Revert to score header; a music file carries
> its own header text. Filed in INBOX with the mechanism.
>
> **N.115, the singer moves a measure between systems** (numbered
> 2026-09-06, UNPLACED): Finale's arrow-up on a selected measure. Research
> Finale first (his ask), then find the tree's orphaned-measure rule.
>
> **N.116, Learn as the book** (numbered 2026-09-07, UNPLACED). Step 1 DONE:
> `docs/sessions/inventory-n116-learn-grayson_r1_2026-09-07.md` and
> `n116-dann-lit-review-sung-russian_2026-09-07.md`. Step 2, the desk's
> proposed sequence for a singer, needs the inventory read in full and
> Grayson chapters 1, 8, 9. Rule: every chapter from Grayson cited as his;
> Dann's additions marked as his.
>
> **N.117, a progress bar on load** (numbered by Dann 2026-09-07 late,
> UNPLACED, ruled in from INBOX on the N.113a alias walk). The page takes a
> few seconds to load on reload with nothing to say so; Dann wants a progress
> bar, not a message. What the bar measures is NOT ESTABLISHED (dictionary
> load is the likeliest candidate: `input.transcribeLoading` already exists).
> Displaces nothing until he places it.
>
> **N.110, the [i] extractor harness**: set aside by Dann, briefed
> (`brief-n110-i-extractor-harness_r1_2026-09-02.md`), not built.
>
> **The print fix**: the page prints white; cause found
> (`staff-renderer.ts:2740` cream rect, `stripBackingRect` strips only the
> white page rect). Paste written 2026-09-07 (INBOX), never run; its own
> Code thread whenever, different files from the sequence.
>
> **French owed, one table after N.114:** every N.108, N.111, N.112 to
> N.114 string (`group.input`, `input.transcribe`, `input.watermark` as
> « poème », `intake.*`, `loupe.redo`, `loupe.undo.placed`,
> `loupe.undo.melisma*`, `loupe.melisma`, `paper.empty.mobile`).
>
> **Open and unplaced, small:** N.102 increment 1c (turning-layer
> courtesies), N.94, N.82 (the watch band's French), N.89 (document
> furniture, ratified from drawings), and the `#` marker in Dann's engraved
> IPA verse (his file, not Ilya).
>
> **Waiting, all Dann's to order:** N.83's walkthrough call, N.84 the Guide
> and Learn redo (after N.114), and the release order N.85 through N.88.

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

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

- **`columnAdvance` reserves no room for the turning layer**, and N.106
  widens what a turning unit can occupy on the right. Nothing crowds on
  Without Sun song 1. Closing it means teaching the layout pass an
  analysis-layer measurement; it belongs with N.103's spacing work. Source:
  `docs/sessions/memo-n106-turning-right_r1_2026-09-02.md`, NOT ESTABLISHED.
- **A third was being read as a second by the desk's own predicate**
  (`gap > o.lineGap`), caught by Code in N.106: a stave step is half a
  space, so intervals are counted in steps, never in `lineGap`. The old rule
  had the same flaw. Do not write that predicate again.
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
- ~~`InstallPrompt.svelte:83`'s false `role="dialog"`~~ **DONE 2026-08-16**,
  Dann's ruling. It is a bottom banner, not a modal, and `showModal()` would
  have trapped a singer inside an install suggestion. Now `role="region"`, which
  keeps the `aria-label` exposed where a bare div would have dropped it.

## RULINGS DANN OWES. Ask one at a time, at the right moment

- The binding squircle's footprint on Insights page one: Design proposes two
  treatments, Dann rules (2026-09-11).

### New from N.104, 2026-08-29. Three, none blocking the walk

- ~~THE BAR-NUMBERS DRAWING IS WAITING ON HIM.~~ **RULED 2026-09-11 00:40,
  numbered N.126, measure numbers on Score markup, UNPLACED.** Size: the
  lyric underlay's point size. Weight: regular, italic (Gould p484-d
  agrees). Clearance: "legible without emphasis", DESK DEFAULT 1.0
  stave-space (the drawing's middle of 0.6 / 1.0 / 1.4). Bare, never
  parenthesized ("to orient collaborating musicians quickly, not to trumpet
  our editorial decision"). Post-rest anchor: DESK DEFAULT the closing
  barline of the rest, explained to Dann and not waved off. System-start
  number above the clef per Gould p484 and his 2026-08-29 ruling. Drawing:
  `docs/sessions/drawing-bar-numbers_r1_2026-08-29.html`; source
  `gould-bar-numbers-p484_2026-08-29.md`. Original text kept:
- **THE BAR-NUMBERS DRAWING WAS WAITING ON HIM.** Thirty-two plates in
  `docs/sessions/drawing-bar-numbers_r1_2026-08-29.html`, built on
  `docs/sessions/gould-bar-numbers-p484_2026-08-29.md`. **Gould gives which bars
  are numbered, where, what slope and what framing, and gives no size, no
  weight, no clearance and no horizontal offset**, so five things are his and
  are all convention: size, weight, clearance, the post-rest anchor, and bare
  against parenthesized. **Sections B and C are not independent**: the
  parenthesis crosses back over the barline at two of the three anchors and is
  clear at the third, so width and placement have to be ruled together. Ilya
  draws no bar number today; nothing here is built or proposed.
- **The loupe draws the singer's words in a different typeface than the page
  does**, and has since before N.104. The loupe declares Source Serif 4, which
  is the renderer's own intent; the page's container overrides it to Source
  Sans 3. Measured on «тень»: the clone lays that text out 1.99 units further
  left than the head bound allows, on systems 2, 5, 6 and 7. **Looked at at 9×
  on all four: no ink enters the head**, the overlap falling inside the first
  letter's side bearing. A measured near-miss, not a guarantee. **The fix is
  either which face the loupe draws words in, which is his eye, or measuring
  the bound on the clone, which needs two passes.** Not built.
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

- ~~RULED 2026-08-21: **LEAVE IT**, on Dann's printed sheet rather than on
  arithmetic. Original text kept:~~ **The sage rules print faint in greyscale.** `--sage` is `#8B9A7D`
  (`app.css:33`), about 58% relative luminance, and print swaps `--paper-cream`
  for pure white. Three levers: leave it; darken `--sage` globally, which keeps
  print identical to screen; or darken at print only, which breaks the WYSIWYG
  principle he set in E.51. **Nothing depends on it.**
- ~~`pdfjs-dist`, for N.59 step 8~~ **RULED IN 2026-08-16, Dann: an enthusiastic
  yes.** Registry facts checked first, as he required for `fake-indexeddb`:
  6.2.108, Apache-2.0, zero runtime dependencies, 20.4 million weekly downloads,
  last published 2026-07-28. Built, walked by me, not yet by him.
- ~~THE PHOTOGRAPH COPY, and whether photographs belong in the beta~~ **RULED
  2026-08-17, Dann: photographs stay in the beta, and the copy was corrected in
  the same session. Both languages approved before either was written.**
- ~~Fable's six ratification items of 2026-07-24~~ **RULED 2026-08-17, Dann:
  items 1 and 2 ratified (T3 fence, T4 third precedent class). Items 3 to 6
  concern that session's build balance and wording; whether they were
  satisfied is NOT ESTABLISHED and none blocks anything.**
- ~~Which of N.58 and N.59 is next~~ **RULED 2026-08-16: N.59.** Increment 1
  shipped and was walked.
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
  `#F0EBE0`.~~ **SETTLED 2026-09-07 by Dann's print preview: the cream prints. Ruled: the page prints white. Paste written (INBOX), not yet run.**
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
