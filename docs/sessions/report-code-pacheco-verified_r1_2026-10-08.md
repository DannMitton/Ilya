# Report: Pacheco's citation is verified; the marker is removed (r1)

**QUEUE row 50, state: WRITTEN, pushed to `cloud-lane`.** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-pacheco-verified_r1_2026-10-08.md`. The brief names the Mac and "no git writes"; Dann's instruction for this session hands the row to the cloud lane, so it is one commit on `cloud-lane`, under `CONTRACT.md` §5's cloud-lane amendment. Nothing pushed to `Shane` or `main`, no pull request. Built after row 36, clean tree before the first edit.

The brief's line numbers are from 2026-10-08. Row 66 rewrote the Insights pane, so the marker now printed from one place, the footer's apparatus.

## The changes

1. `apps/web/src/lib/insights/InsightsPane.svelte:470`: the Pacheco footnote no longer prints `insights.citationUnverified` after it. A comment records why. The `.unverified` style, which nothing used after this, is removed.
2. `apps/web/src/lib/i18n.ts:1656`: `insights.citationUnverified` stays, with a comment that nothing prints it since this row, kept for a future unverified source.
3. `apps/web/src/lib/sources.ts:155`: the comment records the verification as the brief gives it: the desk, 2026-10-08 02:10; the NATS *Journal of Singing* index entry (vol. 69, no. 5, May/Jun 2013, start page 557); Dann's file; the article's pages, 557 to 566; and p. 559, "Tessitura". The `record` field, provenance metadata that nothing prints, now says "verified against the article, p. 559". **No reference text changed.**
4. Tests: none pinned the marker (searched `apps/web/src`, `apps/web/e2e`, and `packages`).

## The eight gates

All eight as row 36 left them; no number moved: 251; 235; 0 errors and 12 warnings in 5 files; 2125; 653 passed and 5 skipped (658); 145; 55; ratchets OK.

## Could not establish

- **The verification itself.** This session did not see the index or the article; it carries the desk's record of them. Dann's PDF is on his Mac.
- **The pictures.** Row 66's pictures in `docs/sessions/insights-r2-shots/` were taken before this row and still show the marker on page 2's footnote.
