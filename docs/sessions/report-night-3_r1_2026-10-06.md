> Provenance, added by the desk (Opus): a Sonnet helper in the desk's cloud workspace, 2026-10-06 overnight, under `/home/claude/night/brief-night-3.md`. 126,070 tokens. It opened no held-out file. Its claims are its own; the desk checked the md5 of `page-pdf.ts` delivered into Dann's tree.

# Night 3 report (2026-10-06)
Reproduced, fixed, verified. Full text is the final message of the Sonnet session; key facts:
- Synthetic: work/syn/tch-giant96.pdf (tch-1.png resized to 2480x3507, one JPEG image at 96 ppi; page 1860 x 2630.25 pt, same as the held-out pages). Before: engine_failed, log 7079312 (bare number), 9.8 s. After: read ok, 130.8 s.
- Rule: page-pdf.ts renderScaleFor (:52 TARGET_DPI, :74 function, :190 use). A page claiming more than 11 x 17 in is rendered as a tabloid sheet (max 4400 x 6800 px); real pages keep exactly 400 dpi.
- Normal PDFs: 24 PNGs (tch 3, sun-build 17, sun3 4) byte-identical before and after.
- Score vs Tchaikovsky truth, page 1 only: original 40/174 headline 22.99, synthetic 40/174 headline 22.99, identical (134 missing = pages 2-3 not read).
- Gates: web test 1930 -> 1935 (+5 new tests); ratchets 384 -> 385 files; all else unchanged; all exit 0.
- Patch: out/fix-night-3.patch (page-pdf.ts + page-pdf.test.ts), applies clean to HEAD page-pdf.ts.
