# Brief for Code: Pacheco's citation is verified; remove the marker (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 02:12. Model: Sonnet. For Code on the Mac. QUEUE row 50. Small; may run alongside or after row 48.

## What changes for the singer

Insights' printed footnote ends with "CITATION NOT YET VERIFIED" beside Pacheco 2013 (`insights.citationUnverified`, `apps/web/src/lib/i18n.ts:1653`; the reference in `apps/web/src/lib/sources.ts:143-155`). The desk verified it 2026-10-08 02:10, so the marker comes off.

## What the desk checked, and against what

- **The index:** the NATS *Journal of Singing* index, searched from Dann's logged-in Chrome: "Angelica Catalani's Voice According to a Method of Statistical Analysis", Pacheco, Alberto José Vieira, 2013 May/Jun, volume 69, issue 5, start page 557.
- **The article:** Dann's copy, `~/Documents/Voice Pedagogy Library/V-Z/Vieira_Pacheco_AJ (2013) - Angelica Catalanis Voice According to a Method of Statistical Analysis - JOS 069_05.pdf`, an image-only scan, read by text recognition. The article runs pp. 557 to 566. **On p. 559** (the PDF's third page, header "MAY/JUNE 2013"), under "Tessitura": he divides the maximum value of the graph's vertical axis by two, draws a horizontal line, and designates the interval between the most extreme bars it cuts as the tessitura. Ilya's footnote paraphrase ("the span from the lowest to the highest pitch sung for at least half as long as the longest-sung pitch") and its pinpoint "p. 559" are faithful.

## The change

1. Stop printing `insights.citationUnverified` beside the Pacheco footnote. Leave the key in `i18n.ts` with a comment that nothing prints it now (it may serve a future unverified source); do not delete it.
2. Update the comment at `sources.ts:155` to record the verification: date, the index entry, the file, and the page. Change no reference text.
3. Update any test that pins the marker.

All eight gates; name any number that moves. Report `docs/sessions/report-code-pacheco-verified_r1_2026-10-08.md` with changes at `path:line` and a section **Could not establish**. No git writes of any kind. Dann ships.
