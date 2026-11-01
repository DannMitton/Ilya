# Fable review: brief row 172, TEXT follows INPUT's Poem | Lyrics pill (r1, 2026-11-01)

Reviewed against `Shane` at `bddc1e27`. Every line below was read this session. Changes nothing; writes nothing with git.

## Verdict

SEND WITH AMENDMENTS (seven). The design holds: `shownWitness` stays the one decider, `witnessChoice` keeps every reader it has, and the two safeguards are already the code's shape (`open` and `land` never touch `witnessChoice`, `apps/web/src/lib/text/input-views.svelte.ts:54-59`, `:85-88`). Lead finding: step 3 cannot land in `+page.svelte` as written. The page sits at its ceiling (5586 lines, `scripts/ratchets.json:8`) and step 3 adds a template line plus a print rule there while step 2 removes two lines (`:97` the import, `:4362` the pair). Amendment 1 moves the source line into a component so the page edit is a swap.

## Citations checked

Hold: `+page.svelte:461`, `:462-475`, `:2235`, `:2277`, `:2299`, `:2398`, `:2831`, `:4362`; `input-views.svelte.ts:68-70`, `:85-87`; `witness-lines.ts:116`; `IntakeViews.svelte:229`; page at 5586 of 5586.

Off: `input-views.svelte.ts:55-60` for `open` (the method is `:54-59`); `IntakeViews.svelte` lacks its folder (the file is `apps/web/src/lib/components/Drawer/IntakeViews.svelte`; `songId` is its prop at `:67`).

## Amendments

**1. Ratchet (step 3 and "Gates and ratchets").** The brief says it "removes a line there and adds none". Step 3 adds at least one template line and a `@media print` rule to `+page.svelte`. Replace step 3's placement with: "Build the line as `apps/web/src/lib/components/TextSourceLine.svelte` (props `language`, `witness`), carrying its own `@media print { display: none }` as `TextWitnessPair.svelte:52-56` does. In `+page.svelte`, swap the import at `:97` and the `TextWitnessPair` element at `:4362` for the new component, one line each; `+page.svelte` ends at or under 5586 and the new file under 1000 (`scripts/ratchets.json`, `newFileMaxLines`). Run `pnpm ratchets` after each step and lower any ceiling the script offers." Evidence: `+page.svelte:97` and `:4362` are the only two references (`git grep TextWitnessPair`).

**2. Phone (new paragraph under "What the singer sees").** Below 1400 px the drawer is a fixed, full-height overlay above the desk (`apps/web/src/lib/components/Drawer/Drawer.svelte:1882-1890`, `z-index: 60`), so a tap on INPUT's pill changes TEXT under a drawer that hides it; the singer sees the change on the "Paper" pull (`Drawer.svelte:899`, `drawer.paper`). Nothing else hides it: the drawer lowers by transform and `inert`, not `display: none` (`Drawer.svelte:418-422`, `:1929-1936`), so `IntakeViews` stays mounted and `inputViews.open` at `IntakeViews.svelte:73` keeps running. The `shown` effect clears the selected word on every witness change (`+page.svelte:470-473`); say in step 1 that this is kept. Add: "Step 1 verification at phone width: tap Poem in INPUT, lower the drawer, TEXT shows the poem and the source line; raise, tap Lyrics, lower, TEXT shows Lyrics."

**3. Tests, named (step 2).** The brief says "remove or repoint any test" and names none. Name them: `apps/web/e2e/text-witness-tools.test.ts:18-34` clicks `#text-tab-poem` and `#text-tab-lyrics` and asserts `aria-selected` on them; repoint each to `#intake-tab-poem` and `#intake-tab-lyrics`, and replace the `aria-selected` assertion at `:33` (after reload, Lyrics is the default) with an assertion on the source line's text. `apps/web/e2e-phone/text-witness.test.ts:177-184` taps `#text-tab-*` after closing the drawer; rewrite as raise, tap `#intake-tab-*`, lower, assert. Its `:201` and `:209` assert no pair; make them assert no source line. Unit tests stay: `apps/web/src/lib/text/witness-lines.test.ts:22-38` (`shownWitness` unchanged) and `apps/web/src/lib/text/input-views.test.ts:136-142` (`chooseWitness` unchanged). Add the phone project to the gates line: the brief's e2e path is desk width only.

**4. Step 0 records two singer paths the ruling creates.** (a) Poem pasted first (INPUT opens on Poem because Lyrics is empty, `input-views.svelte.ts:31-33`), then a score fills Lyrics (`+page.svelte:2831`, `land('lyrics', poemBlank=false)` leaves the view on Poem, `:87`): INPUT's active pill reads Poem, TEXT reads Lyrics (`witnessChoice` default), the source line says "From your Lyrics". By the ruling's safeguard 1 this is correct; record it so the report and the GUIDE sentence can say it. (b) Lyrics holds text; the singer taps Poem to type one: `chooseWitness('poem')` fires on the tap, and TEXT flips to the poem on the first typed word that differs (`shownWitness`, `witness-lines.ts:116-119`), transcribing key by key. Record it; do not change it.

**5. Line fixes.** `input-views.svelte.ts:55-60` becomes `:54-59`. `IntakeViews.svelte:229` becomes `apps/web/src/lib/components/Drawer/IntakeViews.svelte:229`, and step 1 names the `songId` prop at `:67` as the id to pass.

**6. i18n (steps 2 and 3).** Say that no key is the pair's alone: `a11y.paper` is `Paper.svelte:70`'s (`TextWitnessPair.svelte:34` borrowed it) and `intake.view.poem` and `intake.view.lyrics` (`i18n.ts:795-796`) are INPUT's; nothing in `i18n.ts` is removed. Name the two new keys so the report and the GUIDE can cite them (desk default: `text.source.lyrics`, `text.source.poem`). Lane: consistency batch 1 (`brief-code-consistency-1-screen-words_r1_2026-11-01.md`) also writes `i18n.ts`; cut after it merges too, or expect a merge in that file.

**7. GUIDE and LEARN, named (step 4).** The sentences are `apps/web/src/lib/components/Reading/GuideContent.svelte:333` (EN, "To review the authoritative poem itself anytime, choose Poem in Text") and `:38` (FR, « choisissez Poème dans l'onglet Texte »). `LearnContent.svelte` has none (grep for poem, poème, witness, témoin: no hit). Row 171 r2 names neither line (grep for witness and `guide-witnesses`: no hit), so the brief must say the report hands both lines to row 171 by number. `GuideContent.svelte` has no ceiling (640 lines).

## Questions for Dann

1. Taste: the two lines are asymmetric ("From your Lyrics" / "From the poem"; one possessive, one article, one capitalised as the field, one not). Recommendation: "From Lyrics" and "From Poem", the pill's own words (`i18n.ts:795-796`), so the line names the control it follows. Reason: one term per concept.
2. French (flag only): two new keys and the GUIDE sentence at `GuideContent.svelte:38` await his ruling; the desk drafts from `intake.view.*`.

## Not established

- Whether row 163 r2's `ViewPair` prop lands before this cut (its step 5 names `TextWitnessPair.svelte` as keeping its look; deleting the file after that merge is safe, before it is a conflict).
- The eight gates' names: `apps/web/package.json:13-17` lists check, test, test:e2e; `pnpm ratchets` is `package.json:12`. The remaining gates were not located in this session.
- Print preview of the source line: not run; the component's print rule is the claim.
