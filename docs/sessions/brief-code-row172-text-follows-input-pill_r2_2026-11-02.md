# Brief: row 172, TEXT follows INPUT's Poem | Lyrics pill (Code, r2, 2026-11-02)

Written by the desk (Opus). r2 applies all seven amendments of Fable's review (`docs/sessions/review-fable-brief-row172_r1_2026-11-01.md`, SEND WITH AMENDMENTS, reviewed against `Shane` `bddc1e27`), and Dann's capitals ruling of 2026-11-01 13:26 (the five names and the pill's words in capitals on screen; French keeps its accents, OQLF). Read the review in full before step 0; where it and this text differ, the review wins. r1 is superseded. **Since `bddc1e27`, consistency batches 1 and 2, rows 164 and 175 have merged: re-locate every cited line on your cut before you edit it, and say in the report which moved.**

## What the singer sees, and the ruling

Today TEXT draws its own Poem | Lyrics pair above the sheet whenever both texts exist and differ (`apps/web/src/routes/+page.svelte`, the import near `:97` and the element near `:4362`; `apps/web/src/lib/components/TextWitnessPair.svelte`), and its choice is kept apart from INPUT's pill (`apps/web/src/lib/text/input-views.svelte.ts:68-70`, `witnessChoice`). A singer meets two pills with the same two words that do different things.

**RULED by Dann 2026-11-01 13:04, design 1 of the desk's three (`docs/memory/INBOX.md`), amending N.186 (2026-10-16 20:37):** TEXT shows the witness the singer last tapped in INPUT's pill, and that is what prints; the pair on TEXT goes. Two safeguards: (1) TEXT follows only a singer's tap on INPUT's pill, never a view change Ilya makes by itself (`inputViews.open`, `input-views.svelte.ts:54-59`; `inputViews.land`, `:85-87`, reached from `+page.svelte` near `:2398` and `:2831`); (2) one quiet line on TEXT, on screen only, names the source.

**On a phone** (review amendment 2): below 1400 px the drawer is a fixed overlay above the desk (`apps/web/src/lib/components/Drawer/Drawer.svelte:1882-1890`), so a tap on INPUT's pill changes TEXT under the drawer; the singer sees it when the drawer lowers. The drawer lowers by transform and `inert` (`Drawer.svelte:418-422`, `:1929-1936`), so `IntakeViews` stays mounted. The `shown` effect clears the selected word on every witness change (`+page.svelte:470-473`); keep it.

## Steps (one commit and one report each, `docs/sessions/report-code-row172-step<n>_r1_2026-11-02.md`)

**Step 0, read and record.** Read every line cited here and in N.186 (`docs/memory/OPEN.md`, grep "N.186" and "Ruling default 7 AMENDED"). Record what TEXT shows today for: both texts equal; both differ, no choice; both differ after choosing Poem; only Poem; only Lyrics. Record also the two paths the ruling creates (review amendment 4): (a) Poem pasted first, then a score fills Lyrics: INPUT's pill reads POEM, TEXT reads Lyrics, the source line says "From LYRICS"; correct under safeguard 1; (b) Lyrics holds text, the singer taps POEM to type one: TEXT flips to the poem on the first typed word that differs (`witness-lines.ts:116-119`). Record both; change neither.

**Step 1, the tap sets the witness.** The singer's tap on INPUT's pill is `apps/web/src/lib/components/Drawer/IntakeViews.svelte:229` (`onchoose` calls `inputViews.show`). That handler also calls `inputViews.chooseWitness(songId, id)`, with `songId` the component's prop (`:67`). Nothing else calls `chooseWitness`. `open` and `land` stay as they are and never touch `witnessChoice`. The default stays Lyrics until the singer taps (N.186). `shownWitness` (`apps/web/src/lib/text/witness-lines.ts:116`) stays the one place that decides what TEXT shows. Verify at phone width: tap POEM in INPUT, lower the drawer, TEXT shows the poem and the source line; raise, tap LYRICS, lower, TEXT shows Lyrics.

**Step 2, the pair on TEXT goes.** Delete `TextWitnessPair.svelte` (its only references are the import and the element in `+page.svelte`; confirm with `git grep`). `ViewPair.svelte` stays. No i18n key is the pair's alone (`a11y.paper` is `Paper.svelte:70`'s; `intake.view.poem` and `intake.view.lyrics` are INPUT's); remove nothing from `i18n.ts`. Tests: `apps/web/e2e/text-witness-tools.test.ts:18-34` clicks `#text-tab-poem` and `#text-tab-lyrics`: repoint to `#intake-tab-poem` and `#intake-tab-lyrics`, and replace the `aria-selected` assertion at `:33` with an assertion on the source line's text. `apps/web/e2e-phone/text-witness.test.ts:177-184`: rewrite as raise, tap `#intake-tab-*`, lower, assert; its `:201` and `:209` assert no source line where they asserted no pair. `witness-lines.test.ts:22-38` and `input-views.test.ts:136-142` stay. Run the phone e2e project as well as the desk one.

**Step 3, the source line.** Build it as `apps/web/src/lib/components/TextSourceLine.svelte` (props `language`, `witness`), with its own `@media print { display: none }` as `TextWitnessPair.svelte:52-56` had. In `+page.svelte`, swap the import and the element for the new component, one line each; the page ends at or under its ceiling, the new file under 1000 lines. Shown only when both texts exist and differ (`witnessDiffer`, the pair's condition). Small type above the sheet; text, not a control. Two new keys, `text.source.lyrics` "From LYRICS" and `text.source.poem` "From POEM" (Dann 2026-11-01 13:26, capitals). Each French value stays the English with a `// TODO-FR` comment, listed in the report: the desk drafts the French for Dann, and nothing French reaches `Shane` before he rules. Check the print preview: the line does not print.

**Step 4, the GUIDE and LEARN.** The sentences are `apps/web/src/lib/components/Reading/GuideContent.svelte:333` (EN, "To review the authoritative poem itself anytime, choose Poem in Text", or its form after batches 1 and 2) and `:38` (FR). Change the English to say INPUT's pill decides, in the capitals the file now uses; mark the French `TODO-FR`. `LearnContent.svelte` has none. Hand both lines to row 171 by number in the report.

## Every other site (CONTRACT §4)

The witness decides `marks`, `shownText`, `shownGlosses`, `textLines`, the muted words, and the gloss and stress edits (`+page.svelte:462-475`, `:2235`, `:2277`, `:2299`, before re-location). None changes: they keep reading `shown`, which keeps reading `witnessChoice`. Report any reader of `witnessChoice` or `shown` this brief does not name.

## Gates and ratchets

Run all eight gates before step 1 and after each step; record the lines. Run `pnpm ratchets` after each step and lower any ceiling it offers. If any file would pass its ceiling, stop and report.

## Lane

Sonnet, on the lane the session's prompt names. Never push `Shane` or `main`; commit nothing under `docs/memory/` and no `brief-*` or `review-*` file. Open in the report: whether row 163's `ViewPair` change landed before the cut (review, Not established). NOT ESTABLISHED beats a complete invented answer.
