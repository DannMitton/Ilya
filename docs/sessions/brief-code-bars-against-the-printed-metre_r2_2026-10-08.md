# Brief for Code: every bar against the metre printed on the page (r2, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 21:20. **Replaces r1** (`brief-code-bars-against-the-printed-metre_r1_2026-10-05.md`), which was written before the drop-box harness, the cover rule, and the new test sets; its two facts and its Part A and Part B stand, updated here. For Code on the Mac, in the window that did rows 49 to 54, after row 54. QUEUE row 37. Model: Opus.

## What the singer needs

A singer who drops a scan sees the metre the composer printed, at every change, and sees which bars do not fit it before singing from them. Dann, 2026-10-05 15:16, on the Tchaikovsky: Ilya drew 9/8 where the page prints 3/8, and nothing flagged it. Dann, 2026-10-08 21:12, on hearing how homr states a metre: *"how does it handle a sequence of 12/8 4/4/ 3/2 ? Weird. Sounds like we should enact QUEUE row 37?"*

## The facts

1. **homr never reads a time signature's top number.** Model 465 has tokens for the bottom number only; homr's writer sets the top number to the median bar length of that part on that page (`docs/sessions/report-opus-the-checks-measured_r1_2026-10-05.md`, item 5 and line 136, citing `generate-main.ts:131-165`, `:979-990`, `:1026-1035`). Ilya's join says the same (`apps/web/src/lib/omr/join-pages.ts:235-238`). So a page that changes metre gets one guessed numerator, and a check against homr's own metre is circular. Seen in row 49: Grechaninov's printed 6/8 at bar 10 is stated 4/8.
2. **Ilya already has a reader for both numerals:** `apps/web/static/reader/timesig.py` (template matching, both figures, read after every barline per row 31's table, `:637-669`, `:671-700`). It has never been run on the scans (row 31's report: NOT ESTABLISHED, not run).
3. The fill arithmetic and its words exist: `measureFill` (`apps/web/src/lib/score/entry.ts`, near `:412`), and the Loupe's « short » / « over » tag (`Loupe.svelte`, ruled by Dann 2026-09-17). Check those lines before citing them; they were read on 2026-10-05.

## Part A: measure first

1. Run `timesig.py` on every page of the songs that may be opened: the 14 build songs, Grechaninov, Varlamov, and Gurilyov (row 53's PDFs and drop-box harness). For each printed time signature, report what `timesig.py` reads, what homr states, and what the truth says, and where `timesig.py` abstains.
2. Count, per song, bars that do not fit (a) homr's metre and (b) the printed metre, and how many of each are real misreads against the truth.
3. **Teach the scorer to score the metre**: for each bar, whether the metre in force in Ilya's reading equals the truth's. Report it as a new field in row 52's line format ("metre right N of M bars"), so "reliably" becomes a number.

## Part B: build, if Part A reads the printed metre right on every page where it answers

1. Where `timesig.py` reads a printed time signature, Ilya uses it in place of homr's numerator, at that bar, including changes in the middle of a page. Where it abstains, Ilya keeps homr's and says so in the console.
2. Every bar whose lengths do not fit the metre in force is flagged in the Loupe with the existing words; read `docs/memory/OPEN.md` for how a flag on the page is ruled (N.92; the over-full ruling near `:1526`) and build to that, or flag in the Loupe only and say so. Do not invent a mark. The Corrections review that will use these flags is being designed now (`OPEN.md`, "THE CORRECTIONS REDESIGN"); this row only has to leave the flag where that review can find it.
3. Tests for both.

## Prove it

- Before and after through the drop box, the 17 opened and build songs, with the new metre field. No song may get worse in notes.
- A, B, C, E, F once, one line each, never opened.
- **Do not open, read, or run anything on the new unseen set** (any folder or archive in `~/Downloads/_desk-2026-10-08/` whose name begins `heldout2`). Four of its ten songs change metre; it is the final test.
- All eight gates, against the baseline row 54 leaves.

## Report

`docs/sessions/report-code-bars-against-the-printed-metre_r1_2026-10-08.md`: the Part A table, the metre field per song before and after, each change with `path:line`, tests, gates, the five unseen lines, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. No git command that writes; Dann ships. Set QUEUE row 37, say so in one line, and stop.
