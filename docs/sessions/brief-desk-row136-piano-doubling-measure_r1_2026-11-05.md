# Brief: row 136, the piano doubling, measure first (Sonnet helper, r1, 2026-11-05)

Measure only, one question. Keep nothing in any repository. NOT ESTABLISHED beats a complete invented answer. Dann 2026-11-05 00:57 asked the desk to pursue it.

## The question

QUEUE row 136 (N.91, numbered by Dann 2026-08-24): where the piano doubles the voice, its notes could check the voice's read pitches. Before any design: on row 114's first file (songs 1 to 4 have homr readings with the piano), how many voice notes have a doubling in the piano (same pitch or an octave apart, sounding at the same moment), and how many of the reader's wrong or missing voice notes sit where the piano doubles them?

## Inputs

- Truth per song: `/root/m0/_colleague-pages/run-2026-10-19/truth-song/song{1..4}.truth.json` (voice; the 2026-10-19 row 114 measure scored notes against these).
- homr's readings with every part: `/root/m0/_colleague-pages/run-2026-10-19/run/drops/` and `run/*.read.json`; the measure's report `docs/sessions/report-code-row114-measure_r1_2026-10-19.md` (read with `git -C /home/claude/ilya show origin/Shane:<path>`) says how voice notes were scored (513 of 529) and which were wrong.
- First Mussorgsky file only. Never open the second.

## Steps

1. Find the piano part(s) in each song's homr reading; say how you found them.
2. For each truth voice note (the voice's pitches as printed), is there a piano note at the same onset (by bar and position in the bar), same pitch class, any octave? Count per song: doubled, not doubled.
3. For each voice note the reader got wrong or missed (from the 2026-10-19 scoring; reproduce its 513 of 529 first, or say why you could not), is it doubled in the piano's READING, and does the piano's reading give the right pitch class? Count.
4. Caveat the instrument: the piano's own reading may be wrong; say how often, where truth for the piano is absent (NOT ESTABLISHED is fine).

## Rules

Scratch under `/root/c181/r136/`. Stop at 90,000 tokens. Do not write a report file (the Write tool refuses here); return the report as your final message: the answer first (doubled share; of the wrong voice notes, how many the piano would have corrected), a per-song table, the control, what you could not establish.
