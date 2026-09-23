# BRIEF. A literature-rooted, defensible way for Ilya to address leaps

**Written 2026-09-22 by the desk on Dann's instruction, 23:34:** *"I agree leaps are not negligible. Christensen's work also weights them as a measure of difficulty. Let's find a way to responsibly and defensibly address leaps. One that is rooted in the literature is best for our purposes."* And the purpose of the whole thread, his words the same message: *"this current work is at the service of enhancing Insights by way of providing more nuanced evidence for the user."*

**This brief produces a METHOD, not code.** The desk does not build (`CONTRACT.md` §5). The output is a specification Dann rules on and Claude Code builds from. Nothing here is numbered.

**NOT ESTABLISHED beats a complete invented answer.** That sentence governs every section below.

## 0. How you reach the files

Dann's computer is reached through the `mcp__remote-devices__*` tools (load them with ToolSearch if they are deferred). Run shell commands with `mcp__remote-devices__device_bash`; the connected folders are mounted at `$HOME/mnt/ilya-rewrite`, `$HOME/mnt/Voice Pedagogy Library`, `$HOME/mnt/Voice Pedagogy Research`, and `$HOME/mnt/Downloads`. `pdftotext` is installed there. **You cannot delete files there, and you must not try.** Write your output into `$HOME/mnt/ilya-rewrite/docs/sessions/`. Scratch files go in `$HOME` outside `mnt/`.

## 1. What is already known. Read these first

In `$HOME/mnt/ilya-rewrite/docs/sessions/`:

- `harvest-nix-2002-and-christensen-2024_r1_2026-09-22.md`: Nix 2002 asks how the extremes are approached, "By leap or by step?" (p. 218), and warns that with descending wide leaps less experienced singers "would need to be careful not to overshoot the lower note" (p. 220). Christensen 2024 lists "frequent large or awkward leaps or augmented or diminished intervals" among challenges to a unified scale (p. 539, quoting his 2023 dissertation, pp. 16-17).
- `st-pierre-extraction-A-chapters-3-4_r1_2026-09-22.md`: St-Pierre's grid element for leaps, thresholds and rationale (printed p. 75).
- `st-pierre-evaluation-C-fable_r1_2026-09-22.md`: Fable recommended dropping leaps because St-Pierre's rationale is one unsourced sentence and a leap landing high is already flagged. **Dann has overruled that: leaps stay.** Fable's point that a second flag on the same note is noise still stands and should shape the design.
- `proposal-st-pierre-elements-for-ilya_r2_2026-09-22.md`, adoption 1: score a leap by where it lands against the singer's own passaggi and range.

The desk's position, for you to test and not inherit: **a leap is best presented as part of how a flagged note is reached, and as its own finding only where the literature says the leap itself is the demand** (for example, a leap that crosses a register transition).

## 2. The work

### Stage A. Research

1. **Dann's library first.** Search `$HOME/mnt/Voice Pedagogy Library/` and `$HOME/mnt/Voice Pedagogy Research/` by filename and by `pdftotext` grep for: leap, interval, skip, disjunct, register transition, passaggio, onset, registration. Likely authors: Miller (registration, *The Structure of Singing*), Doscher, Titze, Vennard, McKinney, Bozeman, Nix, Hopkin, Arneson, Ralston. Open what bears on leaps.
2. **Then the web**, for: Ralston 1999 (*Journal of Research in Music Education* 47, no. 2), whose rubric had the lowest rater variation in Christensen's study; Arneson 2014; Christensen's 2023 University of Toronto DMA; motor-learning or voice-science work on large intervals, register transitions across an interval, and pitch-matching accuracy after leaps (overshoot, undershoot).
3. For every source: what it says makes a leap demanding, any threshold it gives, and the page. **Mark each as read in full, snippet only, or not read.**

### Stage B. Analysis. What Ilya can see

Verify each by reading the file, with `path:line` (a claim about the code without one is not made):
- the interval between consecutive sung notes is computable from `VocalLineEvent.pitch` (`packages/score-parser/src/types.ts`);
- whether a rest between two notes should break a leap (does a leap across a breath count?);
- what Insights already flags on a landing note (`apps/web/src/lib/shane/insights.ts`, and the strings at `apps/web/src/lib/i18n.ts:1454-1512`);
- how the singer's primo and secondo passaggi and typed range are held.

### Stage C. The method

Specify, with a source or a named DESK DEFAULT for every rule:

1. **Which leaps matter.** Size alone, or size plus what it crosses (a passaggio), where it lands (relative to the singer's own range and passaggi), direction, the landing note's duration, and the vowel on it. Rank these by the strength of their literature.
2. **Singer-relative, never fach-normed.** Dann ruled 2026-09-16 that a declared voice type plays no part in choosing values. A threshold that applies to everyone may be used only as vocabulary (interval names), never as a verdict.
3. **How it is shown, and how it avoids double-flagging.** Draft the English sentence or clause a singer reads, in the register of the current Insights strings, following the pattern Fable found in St-Pierre: a qualitative word stands only with its "as" clause beside it. Show where it attaches to an existing finding and where it stands alone.
4. **Softening.** Christensen frames a demanding element as "a specific learning opportunity" (p. 538). Say whether and how the wording can carry that without becoming advice (`PRODUCT.md`: Insights gives insight, not intervention).
5. Edge cases: a leap into or out of a melisma; a leap across a rest; a leap onto a turning pitch; octave displacement in an editorial variant.

### Stage D. Defence and test

Work it by hand on three of Dann's scores. Name the likeliest way it misleads a singer and show it. Give Code a test list: input, expected finding, expected wording.

## 3. Constraints

- Do not write application code; do not edit `apps/` or `packages/`. Do not write with git (read-only `git --no-optional-locks` is allowed).
- No term on the singer's page that the field does not use (`PRODUCT.md`, 2026-09-22).
- Canadian spelling, no em dashes.

## 4. Output

Write to `$HOME/mnt/ilya-rewrite/docs/sessions/method-leaps_r1_2026-09-22.md`, stage by stage, as you go.

Return a memo of at most 300 words: the method in five sentences; the strongest two sources and their pages; the sentence a singer would see; the weakest rule and why; and **a section headed "NOT ESTABLISHED"**.
