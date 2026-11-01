# Brief: row 172, TEXT follows INPUT's Poem | Lyrics pill (Code, r1, 2026-11-01)

Written by the desk (Opus). NOT Fable-reviewed until its review file sits beside it.

## What the singer sees, and the ruling

Today TEXT draws its own Poem | Lyrics pair above the sheet whenever both texts exist and differ (`apps/web/src/routes/+page.svelte:461`, `:4362`; `apps/web/src/lib/components/TextWitnessPair.svelte`), and its choice is kept apart from INPUT's pill (`apps/web/src/lib/text/input-views.svelte.ts:68-70`, `witnessChoice`). A singer meets two pills with the same two words that do different things.

**RULED by Dann 2026-11-01 13:04, design 1 of the desk's three (`docs/memory/INBOX.md`), amending N.186 (2026-10-16 20:37):** TEXT shows the witness the singer last tapped in INPUT's pill, and that is what prints; the pair on TEXT goes. Two safeguards, both part of the ruling: (1) TEXT follows only a singer's tap on INPUT's pill, never a view change Ilya makes by itself (`inputViews.open`, `input-views.svelte.ts:55-60`; `inputViews.land`, `:85-87`, reached from `+page.svelte:2398` and `:2831`); (2) one quiet line on TEXT, on screen only, names the source.

## Steps (one commit and one report each, `docs/sessions/report-code-row172-step<n>_r1_2026-11-01.md`)

**Step 0, read and record.** Read every line cited here and in N.186 (`docs/memory/OPEN.md`, grep "N.186" and "Ruling default 7 AMENDED"). Record what TEXT shows today for: both texts equal; both differ, no choice; both differ after choosing Poem; only Poem; only Lyrics.

**Step 1, the tap sets the witness.** The singer's tap on INPUT's pill is `IntakeViews.svelte:229` (`onchoose` calls `inputViews.show`). That handler also calls `inputViews.chooseWitness(songId, id)`. Nothing else calls `chooseWitness`. `open` and `land` stay as they are and never touch `witnessChoice`. The default stays Lyrics until the singer taps (N.186). Keep `shownWitness` (`apps/web/src/lib/text/witness-lines.ts:116`) as the one place that decides what TEXT shows; read its rules for a missing text and keep them.

**Step 2, the pair on TEXT goes.** Remove the `TextWitnessPair` line from the page (`+page.svelte:4362`) and delete `TextWitnessPair.svelte` if nothing else imports it (`git grep`). `ViewPair.svelte` stays (INPUT and the desk use it). Remove or repoint any test, e2e test, or i18n key that only the pair used; list each.

**Step 3, the source line.** Where the pair stood, one line in small type above the sheet, on screen only (no print: `CONTRACT.md` §8; hide it in `@media print` and check the print preview), shown only when both texts exist and differ (the same condition the pair had, `witnessDiffer`). English: "From your Lyrics" when TEXT shows Lyrics, "From the poem" when it shows the poem (desk drafts; Dann may amend). Two new i18n keys; each French value stays the English with a `// TODO-FR` comment, listed in the report: the desk drafts the French for Dann, and nothing French reaches `Shane` before he rules. The line is text, not a control.

**Step 4, the GUIDE and LEARN.** Grep both components and `i18n.ts` for every sentence that describes the pair on TEXT or tells the singer to choose a witness there (EN and FR). List them in the report with the line; change the English to say the INPUT pill decides, and mark each French sentence `TODO-FR` as in step 3. Row 171 rewrites the GUIDE later; say in the report which lines it must carry.

## Every other site (CONTRACT §4)

The witness decides `marks`, `shownText`, `shownGlosses`, `textLines`, the muted words, and the gloss and stress edits (`+page.svelte:462-475`, `:2235`, `:2277`, `:2299`). None changes here: they keep reading `shown`, which keeps reading `witnessChoice`. Report any reader of `witnessChoice` or `shown` this brief does not name.

## Gates and ratchets

Run all eight gates before step 1 and after each step; record the lines. `+page.svelte` sits at its ratchet ceiling (5586 of 5586, per the row 164 review): this brief removes a line there and adds none. If any file would pass its ceiling, stop and report.

## Lane

Sonnet. Cut from `Shane` after rows 165 and 163 merge (both touch nearby pills and colours); re-check every cited line on that tree. Never push `Shane` or `main`; commit nothing under `docs/memory/` and no `brief-*` or `review-*` file. NOT ESTABLISHED beats a complete invented answer.
