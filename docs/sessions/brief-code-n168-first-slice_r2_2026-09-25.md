# Brief for Code, r2 DRAFT: N.168's first slice, the three comments, with N.172's intake

r1 written by the desk 2026-09-25 about 04:40; **r2 by the desk 14:25 the same day**, after Dann vetted and ratified the three comments in English and French (13:39 to 13:52). **READY as of 14:55, 2026-09-25**, once Dann says go. Its two waits are cleared:

1. **N.172's intake is ratified in both languages**: English `docs/sessions/draft-n172-intake-survey_r1_2026-09-24.md`, section "Final wording, ratified one question at a time" and the rulings after it (14:27 to 14:45); French `docs/sessions/draft-n172-intake-french_r1_2026-09-25.md`, section "r2" (14:46 to 14:51). **Build the whole panel, all seven questions, even though this slice reads only questions 3, 4, and 7** (Dann 14:27: ask all eight now; answers act as their comments land).
2. **The budget was already accepted by Dann on 2026-09-24 at 23:06** (`draft-curation-rules_r1_2026-09-24.md`, rule 7 of r2): five visible comments at most, the rest behind "more observations", the count following distinct challenges above a stakes threshold. r1 of this brief called it unruled; that was the desk's error, found 14:55. N.173 remains a living draft, so five stays one constant.

## r2: WHAT CHANGED SINCE r1. These override anything below that disagrees

- **The wording source is now `docs/sessions/templates-n168-working-register_r1_2026-09-25.md`**, sections "The grammar, one comment", "Revision, 13:45", and "French, r2". **English and French ratified by Dann 13:48 and 13:52.** Build the strings from the rendered examples there, not from r2 of the drafts.
- **Scope now includes comment 3, the [u].** DESK DEFAULTS of 13:28 (templates file, top): no intake question or switch for it; it fires only on a sustained or phrase-top [u], non-treble voices only, inside r1 §3.1's window.
- **The frame is short sentences, not one long one** (Dann 13:39): the note and its sustain or phrase position; then the leap and the resonance or turn clause.
- **"is the highest note of its phrase"**, never "tops its phrase"; French « est la note la plus aiguë de sa phrase ».
- **"on the highest comfortable note you gave"** / « sur la note la plus aiguë confortable que vous avez indiquée » replaces "the top note you declared"; it fires when the note equals the singer's typed range ceiling.
- **A closed [u] "is unlikely to hold its shape"** / « a peu de chances de garder sa forme » (Dann 13:25).
- **No conditional in the offers:** "You can experiment with" (French keeps opener 3, « Il peut être intéressant de »). **Opener 5 is "Try…"** / « Essayez de… »: "If it suits your voice," is deleted (Dann 13:39).
- **A closer appears only where the source states an outcome the singer can hear or feel.** The desk invents none. "and notice what happens to…" is allowed beside "and notice whether…".
- **"[Author] suggests"** is the attributed opener, never "also suggests"; the citation after it drops the author.
- **Citations carry the year** (Miller 2004, Bozeman 2025, Reid 1975, McKinney 1994), per the templates file.
- **The leap clause joins the frame** whenever the approach is an ascending leap of 7 semitones or more (r1 §1.1, clause 3).
- **The second visible suggestion, until N.173 ranks challenges:** sustained before leap (DESK DEFAULT, templates file).

## The intake panel, as ratified 2026-09-25

- Seven questions with warm stems; points 1 to 5 plus "Not sure" as one **radio group** each, with a "Clear answer" link (back to no answer = point 3). "Not sure" = point 2.
- Question 6 is **checkboxes, all checked**, moments only.
- A section "How comments appear": a **radio pair** for the suggestion count (Two, the rest a tap away, default; All of them) and a checkbox "Include imagery and metaphor cues", checked. Unchecked, suggestions tagged imagery do not show.
- **Every suggestion carries a kind tag:** registration, dynamics, vowel modification, tract shaping, imagery (Dann 14:44). Not a filter yet, except imagery.
- The intro's number is computed from the questions shown.
- **French italics:** *piano* and *forte* as `<em>` in the i18n values, rendered as HTML the way `i18n.ts:731-735` is.

## What the singer will see

Inside Insights, under a heading for the piece's comments, up to five comments, ranked by stakes. Each comment shows two sentences: what the note asks of this voice, then one thing to try, with a short citation (author, short title, page). Under it, a control labelled "More to try, and why" opens the other suggestions, the "notice this" clauses, and the full references. **Ruled by Dann 2026-09-25 03:35** (one visible suggestion, the rest behind a tap) and **03:06** (the two-layer citation).

A piece may show no comments. That is a correct result (N.173 r3, rule 3, Dann's edit of 2026-09-24 23:45).

## Inputs you already have

- **`noteConditions`** (`packages/score-parser/src/conditions.ts`, `NoteCondition` at `:75`) computes per-note conditions: held over the tie chain, approach and its size, phrase index and position, seconds, the fR1 band. Nothing in `apps/web/src` calls it yet.
- **The frequency run** (`tools/n168-frequency-run/frequency-run.run.ts`) derives the rest from `noteConditions` plus the profile: the turning pitch (fR1 ÷ 2, `:597-598`), semitones to each passaggio, and highest of phrase. Its per-note CSVs (`out/notes-<voice>.csv`) are the oracle for the tests.
- **The Insights model** (`apps/web/src/lib/shane/insights.ts`, `buildInsights` at `:672`) and its pane (`InsightsPane.svelte`).

## The build

1. **Lift the derivations out of the frequency run into one tested module** that the app and the run both call, so the oracle and the app cannot drift apart. DESK PROPOSAL for the name: `apps/web/src/lib/shane/comments.ts`. Pure functions, no DOM.
2. **The two firing tests and their clauses, exactly as r1 specifies them:** comment 1 in r1 §1.1, comment 2 in r1 §2.1. Every threshold named "build default" in r1 goes in one exported constants object, so Dann can move a number without anyone reading code.
3. **Merging.** Where both comments fire on one note, emit one comment. The opening sentence names each challenge in one clause, and the note counts once against the budget. **Ruled by Dann 2026-09-25 02:44** ("All of them"). How the frame joins the clauses is the DESK READING in r2 §0.
3a. **How many suggestions show.** **AMENDED 2026-09-25 13:00, Dann: "yes" to the desk's proposal**, after he said he was uneasy with one suggestion per comment (*"Multiple suggestions per comment may be justified... We do not want to inundate the user... We want Ilya to be helpful and as precise as the user wants."*): one suggestion for each challenge the comment names, alternatives for the same challenge behind the tap; at most two visible by default, highest stakes first, with a count ("1 more thing to try"); and an intake switch, "Show every suggestion", which the singer can change at any time. The switch is one more stored intake answer, beside the topic switches.
4. **Which suggestion shows first**: r2 §0, rules 1 to 3. **A DESK PROPOSAL, not ruled.** Implement it as one small function with its own tests, so it can change without touching the firing tests.
5. **Ranking and the budget.** Rank by stakes as N.173 r3 defines them (the size of the demands for this singer, adjusted by their intake answers, times the note's musical weight). **Stakes as a number is NOT ESTABLISHED** in any document the desk has read. Until it is, rank by: the number of demands met, then the note's summed seconds, then its place in the piece. Report what you used. Show five at most (one constant). **Then display the selected comments in performance order** (the order `scoreInPerformanceOrder` gives, repeats and verses unrolled), not in stakes order (`docs/memory/PRODUCT.md`, "COMMENTS APPEAR IN THE ORDER THE SINGER MEETS THEM"). The rest go behind "more observations" (r1 §4, step 5).
6. **Rarity (r1 §4, step 4): a DESK PROPOSAL, not ruled.** Build it behind a constant that defaults to OFF, and report what it would change on Dann's library.
7. **Strings. Ruled by Dann 2026-09-25 12:15: user-facing text says "sustained", never "held".** Internal names such as `held` in `NoteCondition` stay as they are. **Ruled by Dann 12:17 to 12:19: every suggestion is an offer, with an opener and a closer chosen by the comment's place on the page** (`docs/memory/PRODUCT.md`, "A SUGGESTION IS AN OFFER"). Build the openers and closers as their own i18n entries and the rotation as a pure, tested function. The rotation starts from a value derived from the song (stable across loads), then steps by place on the page; no two comments on one page share an opener, closer, or frame shape; and a corpus test flags any construction repeated too often across the frequency run's songs and voices (`docs/memory/PRODUCT.md`, the rotation line). Every sentence is an i18n entry with placeholders (`{vowel}`, `{pitch}`, `{seconds}`, `{semitones}`, `{bars}`). Pitches go through `pitchLabel` (`note-picker.ts:94`), as the rest of Insights does. English from r2; French only as Dann ruled it. **No French that he has not ruled goes into `i18n.ts`** (CONTRACT §6).
7a. **Registers.** Every visible-line part carries a register key (plain, working, technical), read from intake question 7 (points 1 to 2, 3, 4 to 5; "not sure" as 2; skipped as 3). **Write only the working register in this slice**; a missing register falls back to working. `docs/memory/PRODUCT.md`, "THE SAME POINT IN THREE REGISTERS".
8. **Citations.** One registry of sources: citekey, author, short title, full reference, and, for each cited row, the page, the section heading, and a short quotation. The visible citation reads author, short title, year, and page. The tap reads the rest, including edition and ISBN or DOI. **In print, Insights ends with "Sources cited" in its own squircle:** alphabetical, only the works cited in that print, each in full (`docs/memory/PRODUCT.md`, "A TRAIL OF BREADCRUMBS", ruled 2026-09-25). **Section headings are missing for most extraction rows.** Where one is missing, print no heading. Do not invent one.
9. **N.172's intake.** Add optional fields to the profile, each an answer from 1 to 5, "not sure", or absent, beside `range`, `tessitura`, and `passaggio` (`packages/score-parser/src/analysis-types.ts:63-77`). **Ruled by Dann 2026-09-24:** one panel with the questions and the topic switches (23:21); "Not sure" is an answer, and it counts as point 2 (23:22 and 23:37); skipped counts as point 3. This slice reads only question 3 (moving through the passaggio: comment 2's window) and question 4 (long held notes: comment 1's threshold), with the values from r1 §1.1 and §2.1. The topic switches hide a comment and count it; they never lose it (r1 §1.1, "Drops").

## What not to touch

- `VocalLineEvent` (CONTRACT §6).
- The existing findings (`buildWatchList`, `groupFindings` at `insights.ts:366`). **Leave them as they are in this slice, DESK DEFAULT.** r1 §1.3 found that comment 1 absorbs the shipped [i]-above-fR1 finding (INS-P01-1) on Dann's E4 [i]. Report every note where a comment and a finding fire together. Whether the finding retires is Dann's call.
- Nothing is stored that can be derived (CONTRACT §6). The intake answers are the singer's own statements, so they are stored. Comments are computed.

## Done when

1. **The oracle agrees.** Run inside the frequency-run harness, the module reproduces r1 §4's counts at the default intake exactly: comment 1, Mitton 9 events in 4 songs; comment 2, Mitton 6 events in 4 songs; and the same table for the bass, baritone, and tenor. Any difference is reported with the note that caused it, and never adjusted to match.
2. **The known-answer cases pass, from r1's populated examples:** Dann's E4 [i] (Kabalevsky T01, bar 37) fires at every answer to question 4. His E♭4 [o] (T04, bar 10) fires at points 1 to 3 and not at points 4 and 5. His E♭4 [ɛ] (T02, bar 50) produces one merged comment. His E4 [ɛ] (Sunless 05, bar 39) fires at points 1 to 3 of question 3 and not at points 4 and 5.
3. **N.172's own test** (`OPEN.md` §N.172, "Done when"): one comment appears for a novice and not for an expert on the same note. **Its mechanism is a DESK PROPOSAL** (the stage moves the thresholds); if the ruled survey changes it, this test follows.
4. All five gates at baseline, with any moved baseline stated.
5. A render in both languages, sent to the desk, of the Insights page for Kabalevsky T01 on Dann's library. **WRITTEN, not DONE, until Dann walks it.**

## Report

A memo in `docs/sessions/`: what was built, the oracle comparison as a table, every overlap between a comment and a finding, what the ranking fallback put first on Dann's library, the gate results, and a section titled "NOT ESTABLISHED". **NOT ESTABLISHED beats a complete invented answer.**
