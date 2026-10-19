# Brief for the desk: the "deeper, not bigger" audit of Ilya (r1, 2026-10-18)

Dann, 2026-10-18 18:35, from a prompt he found: *"I want a deeper version of this task, not a bigger one. Before rewriting it: (1) say what a top professional in this field would do here that I'm not asking for; (2) name the rawest material they would start from instead of what has already been digested for me; (3) name the specific methods and tools they would use; (4) say what, other than you or me, would show the result is right. Then rewrite my prompt to ask for exactly that."* He asked for it adapted to Ilya as *"an audit and a clear path forward that will increase our chances of hitting that magic bullet, developmentally speaking"*, run on Fable, with questions first until consensus.

## The target (ruled 18:44, Dann's words)

*"a colleague drops a photocopied scan or pdf of a Russian song, and Ilya gives back the correct transcription (Text), the marked-up melody with the sung syllables seated under it, in IPA and syllabified modern Cyrillic (Markup), reading at least 9 of 10 syllables without anyone typing the poem, and reasonable, relevant, and human-sounding insights germane to the user's voice and the piece in the key presented (Insights)."*

## Questions still open at the close of the thread of 2026-10-16 to 18

Asked one at a time; the answers go here and into `../memory/OPEN.md`.

1. The rawest material: which real pages will colleagues bring (photocopies of Soviet editions, IMSLP pre-1918 scans, publisher PDFs, phone photographs), and can Dann supply a set of them, with their poems, that no model has trained on?
   **ANSWERED by Dann 2026-10-18 19:02:** *"Yes, I can compile a bunch of photographed songs in HEIC format. Does that work? Add it as our first post-audit task."* So the sealed set is Dann's own phone photographs of songs from his shelf, in HEIC, with the poem named for each, in `~/Downloads/_colleague-pages/` (DESK DEFAULT path). **First post-audit task, his.** Ilya refuses HEIC today (`apps/web/src/lib/i18n.ts:1069`, `upload.err.imageHeic`; `apps/web/src/lib/reader/page-image.ts:46-50`), so the desk measures on JPEG copies and the HEIC originals stay sealed as shot. That refusal is itself an audit finding: a colleague with an iPhone meets it first, and whether iOS transcodes HEIC through the unfiltered picker is NOT ESTABLISHED (`page-image.ts:48-50`, `IntakeCamera.svelte:43-46`).
2. Who, other than Dann or the desk, judges the result: the colleagues of 30 October, a truth file per page, Grayson's rules for the IPA, LiederNet's text for the poem, a second reader? And for Insights, whose ear?
   **ANSWERED by Dann 2026-10-18 19:06, on the desk's recommendation:** *"Yes, truth files for notes and syllables, Grayson and LiederNet for the IPA and the poem, two colleagues in writing for Insights."* So: a truth file per page, written by Dann from the print before any reading runs, scored by the harness; Grayson's rules as the tree encodes them for the IPA, LiederNet's text as the poem's authority; two of the colleagues of 2026-10-30, each asked the same three questions about one song in their own voice, in writing. Who offered it: the desk.

## What the audit reads before forming an opinion (CONTRACT tether 16)

`../memory/PRODUCT.md` whole; `../memory/OPEN.md` sections N.135, N.184, N.168, N.173; `report-desk-n135-float-form-in-chrome_r1_2026-10-15.md`; `report-code-n135-underlay-harness_r1_2026-10-15.md`; `report-code-row82-retrain_r1_2026-10-15.md`; `plan-scan-reader_r4_2026-10-01.md`; the Insights principles in PRODUCT.md; `plan-to-colleagues_r1_2026-10-18.md`.

## The deliverable

A dated draft, `audit-deeper-not-bigger_r1_<date>.md`: the four answers, each tethered (a path, a run, or NOT ESTABLISHED), then the rewritten prompt, then the path forward as numbered items for `QUEUE.md`. Scholarly prose defaults to scaffolding; this is operational and arrives finished.
