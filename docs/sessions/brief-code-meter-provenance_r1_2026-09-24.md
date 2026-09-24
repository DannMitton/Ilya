# CODE BRIEF. Where wrong meters come from, and correcting Sunless 1's

**Written by the desk 2026-09-24 10:35. For Claude Code, in `~/Desktop/ilya-rewrite` on branch `Shane`. Run AFTER `brief-code-vowel-chart-all-ten_r1_2026-09-24.md` has shipped.** House rules: no git writes, gates before and after, Canadian spelling, no em dashes, `WRITTEN` is not `DONE`. **NOT ESTABLISHED beats a complete invented answer.**

## Why

Found on Dann's walk 2026-09-24. `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml` declares **6/8 at bar 1 and 12/8 from bar 2** (read from the file). The printed edition (`~/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf`, p. 1) and Dann's dissertation (Appendix B, p. 207) both print **6/4**. The file's header says `<software>musx2mxl 0.2.9</software>`, `<encoding-date>2026-07-22</encoding-date>`: it was converted from a Finale file. Sunless 2's `.musx`, read through denigma, showed the same shape the same morning (2/4 on a pickup, then 4/4); that is the fifth finding of the earlier brief.

**Dann, 10:29:** *"i'm mostly interested in why this error occured so we can preempt the next one."* So the cause comes first and the fix second.

**How it went unnoticed, the desk's own error:** `brief-n139-page-meter-signature_r1_2026-09-14.md:172` to `:173` recorded this file's meters as correct ("its meter declarations are not part of that damage") without checking a printed score.

## Establish, with evidence, before changing anything

1. **Does Dann's Finale file carry the 12/8?** Read `~/Documents/Finale Files/Mussorgsky - Sunless 01 - Within four walls.musx` through the tree's own `.musx` path (denigma to MNX) and report the meter per bar. Then do the same for all six Sunless `.musx` files.
2. **DESK INFERENCE, to be confirmed or refuted, not assumed:** Finale can store a bar's actual meter separately from the meter it displays. If the files carry a display meter (6/4) over a different actual meter (12/8, or a pickup's own length), find whether the MNX from denigma, or the musx2mxl output, carries the display meter anywhere. Name the field, or say it is absent.
3. Report the answer to "why" in three sentences at the top of the memo.

## Then

4. **If a display meter is available in what Ilya reads:** Ilya prints the display meter. DESK DEFAULT; this is the durable prevention.
5. **If it is not:** say so, and propose a detection (for example: a meter that changes only at bar 2, where bar 1 is short) that raises a warning in the drawer's format notice. Do not build the warning; the desk will put the wording to Dann.
6. **The Sunless 1 MusicXML file:** it is byte-identical to the fixture `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml` (`docs/memory/INBOX.md`, 2026-09-12 entry). Do NOT edit either. Report which tests pin its 12/8, so the desk can decide whether the fixture keeps the wrong meter as a regression case and a corrected copy is added beside it.

## Return

A memo of at most 300 words, headed by the three-sentence answer to "why", with a section headed "NOT ESTABLISHED", saved as `docs/sessions/memo-code-meter-provenance_r1_2026-09-24.md`.
