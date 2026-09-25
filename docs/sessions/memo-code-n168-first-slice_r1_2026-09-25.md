# Memo from Code, r1: N.168's first slice, the three comments, with N.172's intake

Written by Code (Claude Opus 5.5) 2026-09-25, about 15:40, under `docs/sessions/brief-code-n168-first-slice_r2_2026-09-25.md`, read in full. Branch `Shane`, from commit `f5decd3` with a clean tree. Nothing is committed. The working tree also carries the desk's own edits of 14:59 to `docs/memory/ENVIRONMENT.md`, `docs/memory/STATE.md`, and `docs/sessions/LOG.md`; Code did not touch them.

**Status: WRITTEN, not DONE.** The render of Kabalevsky T01 is in the Browser pane in both languages, and it is DONE only when Dann walks it.

## What was built

| File | What it holds |
|---|---|
| `apps/web/src/lib/shane/comments.ts` (new) | `noteFacts`, the derivations lifted from the frequency run; the three firing tests; the merge; the topic switches; rarity (off); the stakes fallback; the budget and performance order. Every r1 build default is in `COMMENT_DEFAULTS`. |
| `apps/web/src/lib/shane/comment-text.ts` (new) | The seven suggestions with their kind tags; which suggestion leads (r2 §0 rules 1 and 2, its own function); the rotation and the page rule; the frame and suggestion assembly; register lookup with the working fallback. |
| `apps/web/src/lib/shane/comment-sources.ts` (new) | One registry: five works and eleven extraction rows, each with page, heading (none read, so none printed), and quotation copied from `_extraction/claims_*.csv`. Short citation, full reference, "Sources cited" order. |
| `apps/web/src/lib/shane/comments.test.ts` (new) | 46 tests. The known-answer notes are copied row for row from `out/notes-mitton.csv`. |
| `apps/web/src/lib/shane/InsightsIntake.svelte` (new) | N.172's panel: questions 1 to 5, question 6's checkboxes, question 7, then "How comments appear". |
| `apps/web/src/lib/i18n.ts` | 134 lines: the comment parts (`comment.*`), the intake (`voiceIntake.*`), and `hasString`. The intake keys are `voiceIntake.*` because `intake.*` already names the text intake panel (`intake.clear` collided). |
| `packages/score-parser/src/analysis-types.ts` | `IntakeAnswers`, `IntakePoint`, `IntakeTopic`, and `intake?` on `VoiceProfileSnapshot`, beside `range`, `tessitura`, and `passaggio`. |
| `profileStore.ts`, `analyze-score-adapter.ts`, `CalibrationWizard.svelte`, `+page.svelte` | `StoredVoice.intake` (stored, as the singer's own statements); the adapter carries it into the snapshot; the wizard saves it on every change and publishes it; the page passes it to Insights. |
| `InsightsPane.svelte` | A comments page after the findings: up to five comments in performance order, "More to try, and why" per comment, "more observations", the hidden-by-settings count, and "Sources cited" in its own squircle. The tap and "more observations" do not print. |
| `tools/n168-frequency-run/frequency-run.run.ts`, `comments-oracle.ts` (new) | The run now calls `noteFacts`, and writes `out/comments-oracle.md`. |

**The lift is proven, not assumed.** After the run switched to `noteFacts`, every file it writes (`notes-*.csv` for all eight voices, `frequency-run.csv`, `frequency-run.md`, `p1a-counts.csv`) is byte-identical to the copy taken before the change.

## The oracle comparison

Run inside the frequency-run harness on the sixteen Finale files, 2026-09-25 15:16. Counts are events; rows; patterns; songs, as r1 §4 counts them. The full table, with every cell, is `tools/n168-frequency-run/out/comments-oracle.md`.

| Comment, default intake | Mitton | Bass | Baritone | Tenor |
|---|---|---|---|---|
| 1, sustained at the top (2.5 s) | 9; 18; 9; 4 MATCH | 3; 6; 3; 3 MATCH | 5; 9; 5; 3 MATCH | 6; 11; 6; 4 MATCH |
| 2, open vowel turning (-1 to +3) | 6; 7; 5; 4 MATCH | 4; 5; 3; 3 MATCH | 10; 12; 7; 7 MATCH | 19; 22; 15; 10 MATCH |
| 3, closed [u], sustained or phrase top (events; patterns; songs) | 5; 5; 5 MATCH | 1; 1; 1 MATCH | 8; 8; 8 MATCH | 25; 21; 13 MATCH |

The treble voices match at the default intake too (contralto, mezzo, soprano, and Godin), and every cell of r1's by-answer table matches except one:

- **Comment 2 at points 1 to 2, soprano: r1 55; 40; 14, module 59; 44; 14.** r1 contradicts itself here. Its §2.1 sets the treble edge at 3 semitones for points 1 to 2; its §4 table header says "treble edge 2", and its numbers are edge 2's. The module follows §2.1. The four notes edge 3 adds are the soprano's D♯5 [ɛ] in Sunless 01 bar 2, Sunless 06 bar 31, Kabalevsky T01 bar 9, and T03 bar 49. Nothing was adjusted to match. Which edge is right is Dann's call.

## The known-answer cases

All pass, on the real files in the harness and on the copied rows in `comments.test.ts`:

- Dann's E4 [i], T01 bar 37, fires at every answer to question 4.
- His E♭4 [o], T04 bar 10, fires at points 1 to 3 and not at 4 and 5.
- His E♭4 [ɛ], T02 bar 50, is one merged comment (sustained and turning).
- His E4 [ɛ], Sunless 05 bar 39, fires at points 1 to 3 of question 3 and not at 4 and 5.
- **N.172's own test:** the E♭4 [o] appears for a novice (question 4, point 1) and not for an expert (point 5). The mechanism is the desk's proposal: the answer moves the threshold.

**The ratified text is reproduced word for word.** With the openers and frame shape the templates show, the module renders the three ratified comments of 13:45 (English) and 13:50 (French) exactly, one assertion per comment per language.

## Where a comment and a shipped finding fire together

Mitton, default intake. Every other comment fires on a note with no finding.

| Song | Bar | Note | Comment | Finding |
|---|---|---|---|---|
| Kabalevsky T01 | 47 | C4 [ɨ] | sustained | passaggio, timbre |
| Kabalevsky T02 | 69 | C4 [i] | sustained | passaggio |
| Kabalevsky T04 | 38 | C4 [ɛ] | sustained | passaggio, timbre |
| Kabalevsky T08 | 17 | C4 [e] | sustained | passaggio, timbre |

**r1 §1.3's worry does not occur.** No shipped finding fires on the E4 [i] of T01 bar 37: T01's findings for Mitton are all passaggio and timbre findings, none at bar 37 (the list is in the oracle file). So comment 1 absorbs nothing there. Whether the four findings above retire is Dann's call; they are left as they are.

## What the ranking fallback put first on Dann's library

Stakes as a number is NOT ESTABLISHED, so the fallback ranks by the number of challenges the comment names, then summed seconds, then place. No song of Dann's has more than four comments, so the budget of five never bites, and "more observations" never appears on his library.

| Song | Ranked first |
|---|---|
| Kabalevsky T01 | bar 37 E4 [i]: sustain, leap, resonance; 4.29 s |
| Kabalevsky T02 | bar 50 E♭4 [ɛ]: sustain, leap, turn; 2.92 s |
| Kabalevsky T04 | bar 38 C4 [ɛ]: sustain; 8.40 s |
| Sunless 05 | bar 39 E4 [ɛ]: turn; 0.56 s |
| Kabalevsky T10 | bar 55 E4 [ɛ]: turn; 0.71 s |

Six songs carry no comment for Dann: Sunless 01, 02, and 06, and Kabalevsky T05, T06, and T07. The full list is in the oracle file.

**Rarity (off):** it would change nothing on Dann's library. It would move comments for the soprano (four songs) and the tenor (Kabalevsky T08).

## The render, Kabalevsky T01

In the Browser pane at `http://kabalevsky.localhost:5173`, a fresh origin, so Dann's own stored library is untouched. The voice is his frequency-run profile (fR1 from `modification-engine.test.ts`, range A2 to E4, passaggi A♭3 and D♭4), seeded by the desk, not his stored voice. **The E4 ceiling is the run's fixture, not a value he typed** (templates, fact of 13:51); the "highest comfortable note you gave" clause fires because of it.

The page shows four comments in performance order (bars 37, 47, 53, and 61), each with its tap, and "Sources cited" with McKinney, Miller, and Reid. The text on the page is character for character the text in `comments-oracle.md`, "Kabalevsky T01". Setting question 4 to point 5 in the panel dropped bars 47 and 61 on the page at once, as the oracle predicts. No console errors.

## Gates

| Gate | Result | Baseline (`~/Downloads/ilya-ship.sh:76-80`) |
|---|---|---|
| 1 phonology | 216 passed | 216, at baseline |
| 2 dictionary | 235 passed | 235, at baseline |
| 3 web-check | 0 errors, 12 warnings, 5 files | at baseline |
| 4 web-test | **1467 passed (1467)** | **1421: MOVED by 46**, all in `comments.test.ts` |
| 5 score-parser | 603 passed, 5 skipped (608) | at baseline |

**`ilya-ship.sh:79` must move from 1421 to 1467 before the ship**, or the script refuses it.

## Desk defaults Code took, all reversible

1. **Treble comments are computed and not shown.** Their wording (the treble resonance clause, comment 2's treble form) is not ruled, so a treble singer sees no comment in this slice. Treble is read from the typed secondo: at or above B4 is treble (an INFERENCE from Miller 1986, p. 117 and pp. 134 to 135).
2. **Miller's weak region (MIL04-021) is not applied** to treble comment 2: it needs a voice category Ilya does not ask. The treble counts matched r1 without it.
3. **Comment 1's resonance clause is worded for the front vowels only** ([i ɪ ɨ e]). The back-vowel wording (RMR-057) has no ratified form, so an [o] gets no resonance clause, and an [u] is served by comment 3.
4. **Three frame shapes**, all ratified: the leap in the second sentence ([i]), the leap attached to the first ([ɛ]), and the same with its starting note ([u], "from D3").
5. **In a sustained-and-phrase-top frame, the seconds and the ceiling clause drop**, as in the ratified [ɛ].
6. **Opener 6 is left out.** "See how it feels, in this phrase, to…" is not in the ruled English set in `PRODUCT.md`.
7. **", and notice …" only follows an invitation** (openers 1, 2, 3, and 5). After "One thing to explore is…" or "[Author] suggests…" it does not parse, so those openers are skipped for that suggestion. The skipped share spreads evenly across the rest.
8. **The page rule:** a closer that would repeat on the page is dropped (a closer is optional); a frame shape repeats only when no other fits; lead openers never repeat within six comments.
9. **Kind tags (JUDGEMENT):** Miller's "second half at the level of the first" and Reid's decrescendo are dynamics; the jaw and the tract are tract shaping; the [œ] onset and the [i] preface are vowel modification; McKinney's "more energy, space, and depth" is imagery, so "Include imagery and metaphor cues" unchecked hides it.
10. **Topics:** comment 1 answers to "Sustained notes", comment 2 to "Moving through the passaggi", comment 3 to none (templates, 13:28). A merged comment keeps the part whose topic is on.
11. **The comments get a page of their own after the findings,** because page one is fixed and full. That page grows on screen when a tap is open.
12. **The tap holds** the other suggestions and every cited row in full, with the quotation. "Why" is the quotation.
13. **The corpus test's threshold:** an opener flagged above twice its even share (2 in 6). Across 41 pages and 90 comments, nothing is flagged.
14. **"just past" under 2 semitones over the turning pitch, "past" at 2 or more.**

## French: what is ruled and what is owed

Ruled and in `i18n.ts`: every part of the three ratified comments, the openers (settled or ruled 13:04 to 13:05), and the whole intake (14:46 to 14:51).

**Composed from ruled parts, in a combination Dann has not read** (each marked COMPOSED in `i18n.ts`): « se prolonge environ 1 seconde »; « Il arrive par {saut}. » alone; « après la hauteur où… » (the "past" form); the intervals « quinte juste », « septième mineure », « septième majeure », « plus d'une octave ».

**OWED, carrying the English in both slots per the `drawer.paper` precedent.** The desk's drafts for Dann to rule, one per line:

| Key | English | Draft French |
|---|---|---|
| `comment.heading` | Comments on this piece | Commentaires sur cette pièce |
| `comment.tap` | More to try, and why | Autres pistes, et pourquoi |
| `comment.count.one` / `many` | 1 more thing to try / {n} more things to try | 1 autre chose à essayer / {n} autres choses à essayer |
| `comment.more.one` / `many` | One more observation / {n} more observations | Une autre observation / {n} autres observations |
| `comment.hidden.one` / `many` | One observation hidden by your settings / {n} … | Une observation masquée par vos réglages / {n} observations masquées par vos réglages |
| `comment.sourcesCited` | Sources cited | Sources citées |

**Two suggestions are OWED in both languages:** the [œ] onset (MIL04-010) and the [i] preface (MIL04-008). Their English is the desk's offer-shaped paraphrase of r1, not yet read by Dann. **A French page leaves them out** rather than print English inside French, so the French [u] comment shows no count and the French [ɛ] shows one more thing to try where the English shows two.

**Agreement, checked:** « atteinte » agrees with « la note », which only the phrase-top frame names, so the attached leap is offered only there. « Il arrive », « Il se situe », « quand il s'ouvre » take the vowel, masculine. « d' » elides before « aborder ».

## NOT ESTABLISHED

- **Stakes as a number.** The ranking is the fallback above.
- **Which treble edge r1 meant** for points 1 to 2: its §2.1 says 3, its table says 2.
- **Comment 1's "notice this" clause** (the phrase coming down through the passaggio). It is computed (`descent`) and not printed. r1's wording, "the stretch of a climbing line that Miller counts as asking the most", does not match RMR-016's quotation, which is about redescending after a climax. The clause needs a new reading of Miller 1986 pp. 108 to 109.
- **McKinney's crescendo phrase** (MCK-049, "if the lower note is long enough"): no ratified wording, so not printed.
- **Imprints never read:** Bozeman 2025's publisher and ISBN; McKinney's ISBN; Howell's subtitle (the two batch records disagree). They print nothing.
- **Section headings:** none of the eleven rows records one, so none prints. PVA2-B-014's is recorded as "unclear".
- **Imprint notes in French references** ("reissued 2005", "third printing 1999") stay in English, as the source records give them.
- **How the comments page reads on a phone, and in print.** Not rendered at phone width or printed this session.
- **Whether the intake panel belongs in the Voice characteristics phase.** Code put it after the passaggio fields, with no heading of its own; the panel's intro sentence opens it.
- **The plain and technical registers.** Not written; every register reads the working one.

## For Dann

1. Walk the T01 page in the Browser pane, English and French, with one tap open.
2. Rule the treble edge at points 1 to 2: 3 (r1 §2.1) or 2 (r1's table).
3. Rule the owed French in the table above.
4. Before the ship, move `ilya-ship.sh:79` to `1467 passed (1467)`.
