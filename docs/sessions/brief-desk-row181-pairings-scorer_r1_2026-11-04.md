# Brief: row 181, why the pairings' note ids do not match the MusicXML, and a scorer over the seated pairings (Sonnet helper, r1, 2026-11-04)

Code reading and one small script. Keep nothing in any repository. NOT ESTABLISHED beats a complete invented answer. Every claim about the code carries a `path:line` you read in this run.

## The question

Row 181's join (`apps/web/src/lib/text/poem-join.ts`, wired in `poem-join-wire.ts` and `poem-join.svelte.ts`) writes LYRICS and the pairings, not the MusicXML the page ingests, so the row 114 scorer (`/root/m0/score114.py`) cannot see it. The evening helper rebuilt MusicXML from the post-join pairings and found the pairings' note ids absent from the page's MusicXML on four of five songs (song 1: 52 of 65 missing; song 3: 11 of 43; song 4: 55 of 107; song 5: 35 of 93; song 2: 0, but 155 pairings for 203 notes). See `docs/sessions/report-desk-row181-remeasure_r1_2026-11-04.md` on `Shane`, section "The join", read in full.

1. What is a pairing's note id, where is it minted, and from what (file and line)? What id does the MusicXML the page ingests carry, if any, and where is that set?
2. Why do they disagree on songs 1, 3, 4, 5 and not on song 2? Candidates to rule in or out from the code, not to assume: ids minted per page or per system and renumbered when pages join (`join-pages.ts`); the second look re-seating a page whole (step 2 report on `cloud-lane-34`); ids minted before a multi-page merge; tied or chord notes. Name the one the code supports.
3. Why does song 2 have 155 pairings for 203 notes: which notes carry no pairing (tied, slur continuation, unseated), from the code?
4. Write `/root/c181/scorer/score_pairings.py`: given a song's pairings JSON and the MusicXML captured on the same run, map each pairing to its note by the id scheme you established (or, where ids cannot be trusted, by bar and pitch and order within the bar, as `score114.py`'s `map_notes` does), write that song's MusicXML lyrics from the pairings, and hand the result to `score114.py`'s `score()` so the credits are the same (b), (a), (c). Test it: song 2's pairings must reproduce what the page's own MusicXML scores when the join changed nothing on a note (say how you checked that). The first helper writes the dumps to `/root/c181/pairings/songN.json` with the MusicXML beside them; they may not exist yet when you start. If they do not exist when your script is ready, test on a pairing set you build from a page MusicXML in `/root/m0/` captures (`/root/m0/m0-captures_2026-11-02.tgz`), and say so.

## Inputs

- Clone `/home/claude/ilya` (GitHub `DannMitton/Ilya`; read with `git show origin/cloud-lane-34:<path>`; `git fetch origin cloud-lane-34` if needed). Do not change its checkout.
- Scorer and its imports: `/root/m0/score114.py`; unpack `/root/m0/_desk-2026-10-28/desk-n135-a2-lean_2026-10-28.tgz` into `/root/m0/unpacked/` if absent (another helper may have done it; do not unpack twice over a running job's files: check first).
- Truth: `/root/m0/_colleague-pages/truth/`. First Mussorgsky file only; never open the second.

## Rules

- Scratch under `/root/c181/scorer/`. Write nothing elsewhere.
- Stop at 100,000 tokens and write what you have, saying where you stopped.

## Output

`/root/c181/scorer/report-desk-row181-pairings-scorer_r1_2026-11-04.md`: answers 1 to 3 with lines; the scorer, how it was tested, and its result; what you could not establish. Reply with three lines: the id cause, the song 2 coverage cause, and the report path.
