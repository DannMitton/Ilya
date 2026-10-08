# Brief for Code: a lighter wait squircle, and pitch names that never overlap (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 01:08. Model: Sonnet. For Code on the Mac. QUEUE row 46.

## Part 1: the wait squircle takes a 20 percent wash

**What Dann saw:** on his iMac, 2026-10-08 01:03, the squircle's fill matches the desk around the Paper too closely. That is by construction: it is filled with the desk tokens (`--sage-desk`, `--lavender-desk`, `--rose-desk`, `apps/web/src/app.css:148-150`), which are each family's band at 40 percent over white (the comment above them).

**Ruled by Dann 2026-10-08 01:05**, option B of `docs/sessions/drawing-wait-tint-options_r1_2026-10-08.png` (offered by the desk): the fill is each family's band at **20 percent over white**. Name three new tokens beside the desk tokens (for example `--sage-wash`, `--lavender-wash`, `--rose-wash`), computed from the bands exactly as the desk tokens are (the desk drew them as about `#E6E9E3`, `#EAE7EC`, `#EEE5E5`; compute, do not copy). Use them for the squircle fill only (`waitColours` in `apps/web/src/lib/omr/wait.ts` and `ReadingWait.svelte`). The ink stays each family's label ink. Update the tests that pin the fill.

## Part 2: no two pitch names in the tessituragram overlap

**What Dann saw** on Grechaninov's figure (his iMac, 01:02): in the right column C♯5 sits on B♯4, F♯4 on E♯4, and G♯3, F♯3, and E♯3 overlap one another. Rows 42 and 43 checked collisions on the Tchaikovsky song only. A wide, chromatic song puts names a semitone apart in one column (`tessituragram-layout.ts`; the sung-names rule of row 43).

**The rule:** no label touches another label, a bar, or a line, in any song. Where two names in one column would touch, move the later one out of the column and join it to its row with a leader: a solid hairline, 0.6 px, `--rose-ink`, no arrowhead, as long as the distance needs (Dann's ruling of 2026-10-07, already in row 42's code). Choose the placement; keep the type size.

**Prove it on more than one song.** Build a unit fixture with a dense chromatic run (for example, every semitone from E3 to G♯3, and B♯4 with C♯5 above it) and assert no overlaps. Also render Grechaninov's figure from `~/Downloads/_desk-2026-10-07/heldout-scans/grechaninov_op20-4_uznik.pdf` (opened for diagnosis; drop no other file from that folder) and screenshot it, English and French. Its piano notes read as voice are a known reader fault, not yours to fix here; they make it a good stress test.

## Gates and report

All eight gates. Gate 4 baseline `1991`. Name any number that moves. Report `docs/sessions/report-code-wash-and-name-collisions_r1_2026-10-08.md` with changes at `path:line`, screenshots in `docs/sessions/tessituragram-shots/` (names with `-collisions`) and of the squircle on each tab (`docs/sessions/wait-shots/`, names with `-wash`), and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer.

No git writes of any kind. Dann ships.
