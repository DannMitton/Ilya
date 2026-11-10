# Brief: review a design, the barline correction (QUEUE row 138), arithmetic first, a Loupe verb second (Fable, r1, 2026-11-09)

From the desk (Opus) 2026-11-09 21:2x. A design review that ends in a Code-ready build plan; you build, commit, and push nothing. Cap: 300k tokens; at the cap, write what you have. Report to `/home/claude/fpt/review-fable-barline-correction_r1_2026-11-10.md`, then a hand-back under 150 words.

## 1. Why, in Dann's words

QUEUE row 138: the reader fuses measures on the Lamm scans (m. 1 read as 29 eighths: missed barlines, the N.95 weak channel), and Corrections has no barline verb, so a singer can repair every note but cannot split a fused bar (`INBOX.md` 2026-08-27; grep of `correction.ts`, `CorrectionSurface.svelte`, `entry.ts` under `apps/web/src/lib/score/`, 2026-10-19). Dann ruled 2026-11-09 21:17 that it ships with the colleague share (freeze Wednesday 2026-11-11 noon): "If this is a known error … then we need a control to respond to it." He asked whether the arithmetic can solve it invisibly: "While some initial measures may contain fewer beats than the metre allows (anacrusis), every other measure (except sometimes the terminal measure) gets the value of the declared metre that applies. Is it possible to work backward from the note values to fill up presumed measures so our 29 eighth notes becomes just a solvable overflow issue?" He also ruled at 20:32 that Ilya's priority is authoritative information traceable to its source, and at 20:44 that the singer's corrections are saved with the song.

## 2. The desk's proposal

**A. The arithmetic repair (automatic, shown, undoable).** Ilya already sums each bar against the metre: `apps/web/src/lib/omr/metre-witness.ts` (`barFacts` at `:157`, `lengthOf` at `:91`, `countable` at `:183`, `witness` at `:212`). Where a bar's sum is more than its metre allows, Ilya splits it at the metre's boundaries, walking the note values in order, when all of these hold:
1. the metre in force is known (read, or witnessed with confidence);
2. the overflow is exact: the sum is k × the bar length (k ≥ 2), or, for the first bar only, a pickup r plus k × L where r + the last bar's sum = L (the usual anacrusis convention), or the last bar is the short one;
3. every boundary falls between notes: no note or rest straddles a boundary (a straddling note means a duration was misread, and Ilya does not invent a tie);
4. no metre change, repeat sign, or clef change is read inside the fused bar.

The split is not silent. It shows as a correction like any other (a mark on the bar, a note that says the bar was divided by the metre's arithmetic, and Revert), is counted in the receipt, and the reader banner already tells her to check against her source. When any condition fails, nothing is split and the bar is flagged as it is today.

**B. The Loupe verb (manual), for every case A cannot solve.** In the Loupe's CORRECTIONS pane, two verbs: "Add a barline after this note" and its inverse, "Remove this barline" (for a barline the reader invented). Each is a correction, saved with the song, undoable, and shown with the print strip above so the singer places it against the printed bar.

## 3. The hard part: everything keyed by bar

Splitting or joining a bar renumbers every bar after it. Fable, find and judge every site keyed by bar index or `Measure.number` and say how each survives: corrections keyed by score event id (`library/types.ts:108`); bar answers keyed by bar index (`bar-answers.ts`, `library.ts:315-318`, lane 35); the print strip's bar mapping (`firstNoteOfBar`, `loupe-print.svelte.ts:188-192`, which matches `Measure.number` first, then index); the unread-bars banner's numbers; the underlay's systems and seating (`underlay-band.ts`, `underlay-page.ts`); the poem join's runs (`poem-join-wire.ts`); the metre witness itself; MELODY and PAPER's bar numbers; INSIGHTS' bar-based findings and key passages; the stored reading's stamp (`omr/stamp.ts`). Recommend whether the split happens in the reading (before anything else consumes it) or as a correction layer applied over it, and why.

## 4. What to answer

1. **The arithmetic.** Is conditions 1 to 4 the right test? Measure it: on the row 114 f1 scans and any Lamm reading the repository or `~/Downloads/` holds, how many fused bars does A split correctly, how many does it refuse, and how many would it split wrongly? Work the 29-eighths case explicitly: what metre is in force there, and does A solve it? If no stored reading is reachable, say so and specify the fixture Code builds.
2. **The anacrusis and the last bar.** Is the pickup convention (pickup plus last bar = one bar) reliable enough to act on, or does A leave a short first bar alone and split only full multiples?
3. **Where it lives.** Reading-time (in the reader, before seating) or correction-time (a layer the singer can revert). Stamp consequences either way.
4. **The verb.** Its grammar in `correction.ts` and `entry.ts`; how the Loupe presents it beside the existing CORRECTIONS tools; how "remove a barline" handles the merged bar's sum; storage and Revert.
5. **Every site keyed by bar** (§3), each with file:line and a verdict.
6. **Strings**, EN drafts in house style (the verb labels, the correction note for A, any receipt line); Dann's French follows. Use the Loupe's existing words (`loupe.station.corrections`, `loupe.syllables`) and say where a new word is coined.
7. **A build plan** for Code on Tuesday 2026-11-10, in steps with done states and tests, the strings each step needs ratified first, and the cut order if the day runs short. Say whether A or B ships first if only one fits.

## 5. Form

Verdict first (PROCEED, PROCEED WITH CHANGES, or RETHINK), numbered findings with file:line read this session, the build plan, "Questions only Dann can answer" (taste, the irreversible, French), and "What I could not establish". Files on Dann's Mac through the device tools (`$HOME/mnt/`); the integration tip is checked out read-only at `/home/claude/gates`. House style: Canadian spelling, Oxford comma, no em dashes, none of "should", "simply", "just", "easy". NOT ESTABLISHED beats a complete invented answer. Every code claim carries a line read this session (`CONTRACT.md` §0).
