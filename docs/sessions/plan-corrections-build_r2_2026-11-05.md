# Plan: Corrections, reconciled with row 181's Loupe (r2, 2026-11-05, desk, Opus)

Replaces the order of `plan-corrections-build_r1_2026-10-08.md` for slices 3, 5, 6, and 11 (r1 stays the record of the slicing and its reasons). Asked by Dann 2026-11-05 01:08: reconcile slices 5 and 6 with row 181's Loupe into one review, salvage what is excellent, and decide what is useful. Read in full for it this session: plan r1; `design-corrections_r3_2026-10-08.md` (Design round 3); `report-code-row181-step6_r1_2026-11-04.md` on `cloud-lane-34`; `OPEN.md` JOINING items 1 to 16. Not read this session: Design rounds 1 and 2 in full, the round 3 drawings themselves, `OPEN.md` "THE CORRECTIONS REDESIGN" items 1 to 18 in full (the slice briefs read them).

## The one review

Two lists of "bars to check" were designed apart: slice 1's bars whose rhythm does not add up in the metre (`barsToConfirm`, shipped `322015f6`), and row 181's bars whose words Ilya could not read (the scan banner, built on `cloud-lane-34`, not merged). A singer meets one list. **DESK DEFAULT: one list, one counter, one walk.** A bar is on it if either kind applies; its finding says which (or both).

What the singer meets, built mostly from row 181 as built:
1. **The banner names the bars to check**, each a link (row 181 item 8, built). Its sentence covers both kinds; new wording owed (EN and FR drafts to Dann).
2. **The Loupe opens itself once on the first bar** (row 181 item 12, built), with the ratified tag «m. 14 · to check, 1 of 3», Previous and Next (built), and the print strip always open on every bar (items 9 and 13, built).
3. **Under the strip, for a bar on the list:** the finding in notation (slice 6's ratified patterns, "Measure 9 reads as only 3 beats in 4/4.") and the offers (slice 2, shipped `98b22102`: dot, tuplet A or B, and "Add the missing rest", `OPEN.md` Corrections item 18), with "Matches my score". For a words bar, "Fill from the poem" (built). The answer is kept with the song (slice 3, brief r1 2026-11-05).
4. **The result line** after an act ("✓ Half note dotted.", ratified strings of 2026-10-08), then Next.

## Salvaged, dropped, and changed

| From | Decision | Why |
|---|---|---|
| Slice 11, the scan strip in the review only | **DROPPED: superseded** by row 181 step 6 (strip on every bar, pinch, desktop zoom with the notes) | Dann's 2026-11-04 rulings went further than Design's proposal |
| Slice 6, the Paper line ("⚑ 5 bars may not match your score", Compare, Not now) | **DESK DEFAULT: folded into the banner**, which already lists bars as links; one notice, not two. Departs from `OPEN.md` Corrections item 10 (2026-10-08 23:15); Dann's to overrule | Two notices for one list would compete |
| Slice 6, the filled mark over each bar in Markup's wash (item 10) | **KEPT**, on listed bars only, never printed | Ruled; shows where the list's bars are on the page |
| Slice 6, the review strip with its own Previous and Next | **DROPPED: row 181's Previous and Next serve** | Same control, already built and its strings ratified |
| Slice 6, findings, offers, "Matches my score", result lines, "most of the scan unclear" (§08) | **KEPT**, seated in the Loupe under the strip | The strings are ratified; they are what the strip lacks: a question the score answers |
| Slice 5, the rail of six (three until slice 8), greying table, fixed footer, Remove with a reach, rests after a removal | **KEPT** as Design round 3 drew it, **after a re-measure**: the Loupe now carries the LOUPE header (row 164) and the always-open strip (row 181), and round 3 already measured the strip leaving 2 px at the foot of an 844 px phone | The panel is the excellent part of round 3; its height budget is out of date |
| Slices 7, 9, 10 | Unchanged, after slice 5 | |

## Order

1. **Slice 3** (pure; brief r1 written, Fable review tonight).
2. **Row 181 merges** (its re-measure, Fable as built, Dann's walk).
3. **Slice 6R, the one review** (above): needs slices 1, 2, 3 and row 181; no longer needs slice 5, because the offers sit in their own row under the strip. Brief after row 181 merges.
4. **Slice 5, the rail**: first a measure of the Loupe's height on a 390 by 844 phone and a desk with header and strip; then the panel.
5. Slices 7, 9, 10 as r1; slice 8 after N.120 and N.177.

## Open, for the briefs

The banner's sentence for both kinds (EN and FR); whether a bar both unread and short shows two findings or one; the height budget on a phone; Design's open items (the safe area, « Stable », the French remove labels).

## Fable's review of this plan (2026-11-05, `review-fable-brief-slice3-and-plan-r2_r1_2026-11-05.md`): to carry into r3 before slice 6R's brief

- One list is right for the singer; two costs are unstated: (a) the lifetimes differ (a filled words bar stays in the banner and its state is in memory only; an answered rhythm bar is stored), so after a reload "1 of 3" is untrustworthy: a words bar needs an answer too; (b) the keys differ (rhythm by 0-based `measureIndex`, `bars-to-confirm.ts:39-42`; words by printed bar number, row 181 report §2 item 1); a pickup numbered 0 shifts them by one. One key is owed.
- A bar both unread and short: two findings, one under the other, each with its own act; it leaves the list when both are answered (Fable; not taste). DESK DEFAULT, adopted.
- Folding the Paper line into the banner: (a) the banner lives in the drawer, which lowers on a phone when the Loupe opens; (b) the banner and strip exist only on a scan, so an imported MusicXML with a short bar loses its only entry to the review: the one notice must show for any song with bars of either kind; (c) "Not now" loses its home. **Paper or drawer for the notice is taste: Dann's question**, with (b) and (c) settled by the desk.
- Name as DESK DEFAULTS: the lavender mark extended to words bars; the Loupe opening itself once extended to rhythm bars on any score (against Corrections item 2's "never imposed"; put to Dann with the notice question if it bites).
- The lane for 6R: it edits `+page.svelte` and `Loupe.svelte`, hotspot files kept on the Mac by the 2026-09-26 ruling; row 181 edited them in the cloud under a ratchet. Decide before the brief.
- Owed: the banner's sentence for both kinds, EN and FR drafts to Dann.
