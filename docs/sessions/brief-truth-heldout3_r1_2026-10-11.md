# Brief: truth files for held-out set 3, r1

Written by the desk (Opus) 2026-10-11 17:15. For two Opus helpers in the desk's cloud workspace, five songs each. They never run a reader and never share these files with any Code session.

## Why

Ilya's goal is to read at least 95 of every 100 printed notes on songs it has never seen. The earlier sealed songs are opened or spent. These ten songs are fresh: chosen from a treble repertoire list, downloaded from IMSLP, never opened by any reader lane. Each needs a truth file so it can be scored.

## Inputs (all under `/mnt/user-data/uploads/`)

- Scans: `Downloads/_desk-heldout3-private/*.pdf` and its `MANIFEST.md` (which song is in each file; the editions are from a helper memo and two are marked CHECK).
- The method and schema, read whole first: `ilya-rewrite/docs/sessions/memo-heldout2-truth_r1_2026-10-08.md`.
- Two finished examples, read whole: `Downloads/_desk-2026-10-08/heldout2-truth-r2/truth/catoire_op1_no1_*.{truth.json,notes.md}` and `blumenfeld_op42_no2_*`.
- Scripts from that work: `Downloads/_desk-2026-10-08/heldout2-truth-r2/scripts/` (`prep.py`, `staves.py`, `staffcrop.py`, `heads.py`, `heads_r2.py`, `tint.py`, `zoom.py`, `vstrips.py`, `work.py`, `gen_truth.py`, `check_truth.py`, `assemble2.sh`, `load_like_score_ts.mjs`). Read each before use; paths inside them may need changing.
- The scorer's converter: `ilya-rewrite/docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py` and `score.ts`.

Copy inputs into your own work folder (`/home/claude/heldout3/<A or B>/`) and work there. Do not edit the files under `/mnt/user-data/uploads/`.

## The work, per song

1. Find the song in its file (sets hold several songs; use the title page, contents, or headings). Cut its pages into `<slug>.pdf` (`qpdf` or `pdfseparate`/`pdfunite`). Slug: `composer_opN_noM_transliterated_title`, lower case, as in the examples.
2. Confirm on the page: composer, title in Cyrillic, opus and number, that the text is Russian (Cyrillic under the voice), and the publisher and plate if printed. Where the page disagrees with `MANIFEST.md`, the page wins; say so.
3. Read the voice line, bar by bar, and write the truth in the heldout2 schema: pitch, length, rests, ties, tuplets, pickup, printed metre per bar, and the syllable under each note where legible. Mark anything you cannot settle from the page `UNSURE`, with the reason, rather than guessing.
4. Self-check exactly as heldout2 did: every bar sums to its metre, `onsetAbsolute` agrees with the bar lengths, ids unique, and a MusicXML round trip through `conv.py` returns the same events, bars, and lengths.

Helper A: S1 to S5. Helper B: M1 to M5. Do the songs in that order. If a song's reading runs past about 60 tool calls without finishing, stop it, keep what is read as a partial in `partial/`, and move to the next song: five finished songs beat one perfect one.

## Never

- Never run Ilya, homr, or any score reader on these files.
- Never put these files, their names, or their contents in the `ilya-rewrite` repository.
- Never guess a note to make a bar add up. UNSURE is the honest answer.

## Return

A memo under 800 words: per song, the slug, pages cut, bars, notes, UNSURE count with each bar named, what the page said against `MANIFEST.md`, and the self-check result. Then "Could not establish". NOT ESTABLISHED beats a complete invented answer. Leave all outputs in `/home/claude/heldout3/<A or B>/out/`: `<slug>.pdf`, `<slug>.truth.json`, `<slug>.notes.md`, `selfcheck-log.txt`.
