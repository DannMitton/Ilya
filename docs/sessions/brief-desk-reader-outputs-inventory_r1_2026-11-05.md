# Brief: everything the two readers give Ilya, and what Ilya keeps (Sonnet helper, r1, 2026-11-05)

Code reading and probes. Keep nothing in any repository. Every claim about Ilya's code carries a `path:line` you read in this run. NOT ESTABLISHED beats a complete invented answer.

## Why

Dann 2026-11-05 00:00: Ilya throws away much of what its readers know (for example, `wordsOf` keeps word text and box only, `apps/web/src/lib/omr/underlay-recognize.ts:55-57`, while tesseract.js returns per-symbol text, confidence, box, and, with `lstm_choice_mode=2` and hOCR, ranked alternatives: `/root/c181/match/report-desk-row181-read-as-matching-feasibility_r1_2026-11-04.md`, read it in full first). He wants an exact inventory, so the desk can connect every usable piece.

## Two readers, on `cloud-lane-34` (clone `/home/claude/ilya`, read with `git show origin/cloud-lane-34:<path>`)

1. **The words reader** (tesseract.js 7, `rus_prereform` r2). Every field and level it can return for one underlay row (blocks, paragraphs, lines, words, symbols; text, confidence, bbox, baseline, font attributes, choices, hOCR, TSV, word-level `is_dictionary` or similar flags, page segmentation and orientation results). Use the feasibility helper's probe setup and outputs under `/root/c181/match/` rather than probing again where they already answer.
2. **The notes reader** (homr, as Ilya runs it). Every element and attribute homr writes into its MusicXML or other outputs that Ilya receives (staff and system boxes, note positions or boxes if any, voices, slurs, ties, beams, stems, accidentals, dynamics, text directions, confidences if any, the staves list `result.staves`). Use a stored homr MusicXML from `/root/m0/` (unpack `/root/m0/m0-captures_2026-11-02.tgz` into `/root/c181/inv/cap/`; first Mussorgsky file only, never the second) and homr's integration code in the tree.

## For every item, one row

| reader | item | what it says | Ilya reads it? (path:line or "no") | Ilya keeps it after the reading? | where it would help, from the losses below |

The losses to aim at, on row 114 f1 (`docs/sessions/report-desk-row181-remeasure_r1_2026-11-04.md` and the T6 report `~/Downloads/_desk-2026-11-02/t6/` are not here; use these figures as given): of the syllables lost at 369, 78 wrong letters on the right note; 143 notes with no word (about 57 in systems never seated, 61 clean blanks, 14 with ink and no reading). Also: seating losses, token splitting, a system's row chosen wrongly ("is this row Russian?"), long dash against hyphen, a second voice sharing a note label.

The last column says which loss an item could reach and how, in one sentence, or "none seen". Do not size gains; the desk measures.

## Rules

- Scratch under `/root/c181/inv/`. Write nothing elsewhere. Another helper is building the app under `/root/c181/`: do not touch its folders, ports, or worktrees.
- Stop at 160,000 tokens and write what you have, saying where you stopped.

## Output

`/root/c181/inv/report-desk-reader-outputs-inventory_r1_2026-11-05.md`: the two tables, then a short list of the items Ilya ignores today that touch the largest losses, then what you could not establish. Reply with three lines: how many items each reader gives and how many Ilya keeps, the three most promising ignored items, the report path.
