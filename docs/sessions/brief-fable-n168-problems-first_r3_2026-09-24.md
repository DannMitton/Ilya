# Brief: N.168, Insights from the problems singers bring

Written by the desk 2026-09-24 22:40 for a Fable subagent. Supersedes `brief-fable-n168-p1-redraft_r2_2026-09-24.md`, which was never run.

## Read first, in full

`~/Desktop/ilya-rewrite/docs/memory/PRODUCT.md`, from "What Insights is for" to "No belting", and above all the two newest sections: "What Ilya is for, and why a data dump defeats it" (Dann, 2026-09-24 22:35) and "Every observation answers 'why should I care?'" (22:19 to 22:23). They are the whole reason for this brief.

## Also read: the curation rules (N.173, a living draft)

`docs/sessions/draft-curation-rules_r1_2026-09-24.md`, to its end, including revision r3 (23:50) and Dann's acceptance of the six demands (23:48). Tag every candidate with its demand (register, resonance, range edge, endurance, dynamics, transition), rank by stakes as the draft defines them, and group by pattern (rule 6). Where your work shows a rule failing, say so: the draft is meant to be refined by this work.

## The method, reversed

Until tonight, connections started from an acoustic event and looked for a reason the singer should care. That produced true sentences with no point. **Start instead from the problems singers actually bring**, as the pedagogy books record them, then find where Ilya can detect that problem's conditions in a score, for this singer's voice. Acoustic sources come last, as explanation and support.

## Sources of problems, in this order

In `~/Documents/Voice Pedagogy Library/Insights Research/_extraction/`:
1. `claims_miller-2004_2026-09-24.csv` (Miller 2004, *Solutions for Singers*, a question-and-answer book built from singers' questions; the section titles in `../long-works-toc-screen_miller-2004_r1_2026-09-24.md` are themselves a list of problems).
2. `claims_mckinney-1994_batch-A.csv`.
3. `claims_reid-1975_2026-09-24.csv`, under Dann's rule for imagistic sources in `../needs_r1_2026-09-23.md`: scrutinize every claim, and where it does not check out, give the better fact-based view.
4. `claims_millers_2026-09-23.csv` and `claims_miller-RIS_batch-A.csv` (Miller 1986 and 2008).
Acoustic support: the Bozeman, Howell, and other rows in the same folder.

## What Ilya can detect

Per note: pitch, vowel (with the singer's fR1 and, where sampled, fR2), duration and ties, dynamic marking (not yet parsed by the run), approach interval, rest before, phrase position, highest of phrase, and the singer's declared range and passaggi. Per piece: range, tessitura, and share of sung time by region. The per-note data for sixteen songs and seven voices is in `~/Desktop/ilya-rewrite/tools/n168-frequency-run/out/notes-<voice>.csv`; read one header before you plan.

## What to produce

1. **The problem list.** Every singer problem in those sources that Ilya could plausibly detect from a score and a voice profile. One line each: the problem in the singer's words, the source row and page. Leave out problems Ilya cannot see (breath, posture, health), in one line saying how many you left out.
2. **Ranked candidates**, at most twelve: for each, why the singer should care (one plain sentence); the form ("Something to try" or "Notice this"); what the singer might try, or what they might notice, with its source; the detection rule; and the count of firing notes for Mitton and for each literature voice, computed from the CSVs.
3. **Worked in full, the top three:** the template, populated on one real note for Mitton and one for a treble voice (song, bar, pitch, vowel), with the three checks from `PRODUCT.md` ("A singer-specific claim is a template").
4. **Piece-level suggestions**, if the sources support any: "a great fit", "better transposed", "range too wide for what you declared". Say which already exist in Ilya's tree (`packages/score-parser/src/transposition.ts` exists; read its header) and which are new.
5. **What you dropped and why.**
6. **At most three questions for Dann**, each answerable in a word or a sentence.
7. **NOT ESTABLISHED.**

Fewer, better candidates beat many. A candidate with no answer to "why should I care?" is dropped, however well sourced.

## Output

`~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/draft-problems-first_r1_2026-09-24.md`. English only. Edit no other file. Never run git. Canadian spelling, Oxford comma, no em dashes, no hype, no aphorisms. **NOT ESTABLISHED beats a complete invented answer.**

## Return memo

Under 250 words: the path, the count of problems found, the top three candidates with their "why care" sentence and Mitton's count, and the questions for Dann.
