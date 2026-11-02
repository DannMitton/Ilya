# Brief: consistency batch 1, the words a singer reads (Code, cloud lane, r1, 2026-11-01)

Written by the desk (Opus) from the consistency audit (`report-desk-consistency-audit_r1_2026-11-01.md`) and the plan (`plan-desk-consistency_r2_2026-11-01.md`). Carries QUEUE row 170 (MELODY / CHANT), row 169 (the interface-text convention) for `i18n.ts` and LEARN, and Dann's rulings of 2026-11-01 (`docs/memory/INBOX.md`, 11:52 to 12:28). The GUIDE is row 171's and is not touched here. NOT Fable-reviewed until its review file sits beside it.

## Lane

Model Sonnet. Branch `cloud-lane-23`, cut from `Shane` at `cab8d205`. Push only `cloud-lane-23`; never push `Shane` or `main`; open no pull request. Commit no file under `docs/memory/` and no `brief-*` or `review-*` file. One commit per step, each with its report at `docs/sessions/report-code-consistency-1-step<n>_r1_2026-11-01.md`.

## Read first

1. The audit: sections A.2, A.3, A.5, A.6, A2.2 to A2.6, and E item 1.
2. The plan r2, its last section ("r2: Fable's review applied") and items 8 and 9.
3. `docs/house-style/SKILL.md`, section "Interface text that singers read".
4. `docs/memory/CONTRACT.md` §1 item 11a (a ratified string and its pin change together) and §7 (French).

## Rulings this batch carries (Dann, 2026-11-01)

- The score document is MELODY in English and CHANT in French (row 170, ruled 2026-10-31 20:07).
- The five document and tab names are written in capitals wherever a singer reads them: TEXT, MELODY, INSIGHTS, LEARN, GUIDE; TEXTE, CHANT, APERÇUS, LEÇONS, GUIDE. French capitals keep every accent and cedilla (OQLF). Reason, his: it sets TEXT apart from text in prose.
- « Reconstitution ponctuelle » for Spot reconstitution; « Réduction ponctuelle » for Spot reduction (DESK DEFAULT on his ruling).
- A foreign term in singer-facing English is italic, as the French sets it (his yes on *zona di passaggio*, generalised as DESK DEFAULT).
- Ratified text is not frozen: change the text and its pin in the same commit (`CONTRACT.md` §1 item 11a).
- Code names, folders, and storage keys are NOT renamed in this batch (batch 3 does that); comments and the legend are batch 2.

## Steps

**Step 0, baselines.** Run all eight gates on the cut and record them: phonology "291 passed (291)", dictionary "248 passed (248)", web-check "found 0 errors and 12 warnings in 5 files", web-test "3718 passed | 1 skipped (3719)", score-parser "775 passed | 5 skipped (780)", blurb "145 passed (145)", integration "55 passed (55)", `pnpm ratchets` "ratchets: OK.". A difference is reported before step 1.

**Step 1, labels into `i18n.ts`.** Move every bilingual label typed into a component as a language ternary into `apps/web/src/lib/i18n.ts` keys, read through the existing translation function. The audit found 117 sites in 20 files (`git grep -nE "(language|lang|locale) *(===|==) *'(en|fr)' *\?" -- apps/web/src ':!*.test.ts'`; `Drawer.svelte` 84). Words move verbatim, English and French; no wording changes in this step. Key names follow the file's existing prefixes (read the index at `i18n.ts:7-85`). A ternary that chooses something other than a label (a locale code, a date format) stays and is listed. Done when the grep returns only listed exceptions, `approval/i18n-keys.test.ts` passes, and every gate is at baseline except gate 4 where tests were added.

**Step 2, `apps/web/src/lib/names.ts`.** One module, one array of records, one per concept (TEXT, MELODY, INSIGHTS, LEARN, GUIDE, and the controls the audit's A2.3 term list names): the concept; the i18n key of its on-screen name (English and French are read through the key, never copied); its code identifier and folder today and after batch 3; its retired names (screen words and identifiers); and for each retired-name pattern a comment saying whether it is a bare word or a phrase and why (ordinary-word collisions: « poignée » meaning a handful, lowercase "metadata" as a noun, « Transcrire » as a heading; plan r2 item 4). A header comment says what the module is for and what reads it. A small test asserts each i18n key it names exists. No guard reads it yet: row 171 widens the guard once the GUIDE is clean.

**Step 3, the screen words.** In `i18n.ts` values and in LEARN (`apps/web/src/lib/components/Reading/LearnContent.svelte`), both languages:
1. `tab.markedScore` reads MELODY / CHANT; the other tab values read TEXT, INSIGHTS, LEARN, GUIDE / TEXTE, APERÇUS, LEÇONS, GUIDE. The tab bar's CSS capitals (`DeskHead.svelte:201`, `:245`) stay; they are now redundant and harmless.
2. Every singer-facing mention of the five names in capitals (audit A.6 counts them).
3. Every retired name in a value a singer reads replaced by its current term (audit A.2 and A.3: Markup, Annotation, Transcribe, Transcription, Metadata, Ribbon, Inspector, Fit, as they occur in `i18n.ts` and LEARN).
4. The Spot pair in French as ruled, wherever it is drawn (after step 1, `InspectorPanel.svelte:60-61` reads keys; check `i18n.ts:721`, `:914`, and `LearnContent.svelte:991`).
5. Italics on foreign terms in English LEARN where the French sets them italic.
6. Every pin in a test that holds a changed string changes in the same commit.
7. End-to-end tests that find a tab by its label (audit E item 3: 8 sites in 6 files) follow the new labels.
**French:** a substitution of a ruled term (CHANT for « Annotation », the capitals, « ponctuelle ») is mechanical and goes in this commit. Any other French change (a sentence rebuilt around a removed control, an agreement that changes with a new noun: « l'Annotation » to « le CHANT ») is a DRAFT: put it in a separate commit "French drafts for Dann", and list each in the report as English, old French, new French, with the reason. Check every agreement against its new noun (CHANT is masculine; « l'Annotation » was feminine).

**Step 4, row 169's convention in `i18n.ts` and LEARN.** Apply `docs/house-style/SKILL.md` "Interface text that singers read" to every string that names a control, in both languages, where it helps a singer find the control; build the button chip once as a shared style and use it. French changes beyond the chip markup follow step 3's draft rule.

## Every other site (CONTRACT §4)

Not a computation change, but the same words are drawn from several places: the tab bar (`DeskHead.svelte`), the LEARN and GUIDE contents in `Drawer.svelte` (`Drawer.svelte:560` types 'LEÇONS' / 'LEARN'), the printed running heads and footers of each document, aria labels (`profile.scoreRegionAria`, `i18n.ts:1420`, and others), and the page title. List each place a tab name is drawn and say which key it now reads.

## Ratchets

13 of 16 ceilings have no slack (audit). `i18n.ts` is exempt (`scripts/ratchets.json:5`). `Drawer.svelte` (ceiling 1990) and `LearnContent.svelte` (4099) shrink or hold; if any file would pass its ceiling, stop and report rather than raising it.

## Report, each step

What changed, file by file; the gate lines; counts before and after (ternaries, retired names, capitals); every French draft as a table; what you could not establish. NOT ESTABLISHED beats a complete invented answer.

## r2 (2026-11-01 22:1x): Fable's reviews and Dann's rulings applied

Reviews: `docs/sessions/review-fable-brief-consistency-1_r1_2026-11-01.md` (SEND WITH AMENDMENTS, 17 amendments, 284,350 tokens) and, for the capitals and the terms, `docs/sessions/review-fable-style-guides_r1_2026-11-01.md` (Part 1). **All 17 amendments of the first review apply as written, with their exact replacement text; read it in full first. Where the reviews and the text above differ, the reviews win, except where a ruling below differs.** In particular: cut the lane from `Shane` at its tip after row 165 ships (row 163 shipped as `dcb36850`; row 165 is `cloud-lane-23`), take the gate baselines from that tip, and re-check every cited line there; this batch also changes the six GUIDE lines that name the score document (`GuideContent.svelte:80`, `:82`, `:285`, `:376`, `:378`, `:581`) and their pins, so the GUIDE never says Markup after this batch.

**Rulings (Dann 2026-11-01, `docs/memory/INBOX.md`), each to apply in English and French:**
1. **Capitals for every named place** (13:26), legibility first: the five tabs, INPUT, POEM, LYRICS, the LOUPE and its stations (DURATION, PITCH, ACCIDENTAL · ENTRY, UNDERLAY, CORRECTIONS, SYLLABLES; FR DURÉE, HAUTEUR, ALTÉRATION · SAISIE, PLACEMENT DES PAROLES, CORRECTIONS, SYLLABES; 22:13), and the DRAWER / le TIROIR (22:12) with its named sections. French keeps every accent. Articles and prepositions stay lower case.
2. **Screen-reader-only text stays in ordinary case** (22:14): aria labels and accessible names are not capitalized.
3. **The page:** "the page" / « la page », lower case, replaces "Paper" / « Papier » everywhere a singer meets it: the pull handle (`i18n.ts:115`), the GUIDE (« le Papier »), and the accessible name `a11y.paper` (`:225`, now "Text" / « Texte »).
4. **The CORRECTIONS row "Lyric" / « Texte »** (`loupe.station.lyric`, `i18n.ts:507`) becomes "Underlay" / « Placement des paroles »; `loupe.station.lyricTake` (`:629`) becomes "Underlay · take a note to shift its syllable" / « Placement des paroles · prenez une note pour décaler sa syllabe » (22:09).
5. **The GUIDE heading at `GuideContent.svelte:376`** reads "The notation conventions used by MELODY" / « Les conventions de notation utilisées par le CHANT » (22:10, 22:11; both RATIFIED).
6. **Earlier today:** MELODY / CHANT; « Reconstitution ponctuelle » and « Réduction ponctuelle »; foreign terms in English italic; ratified text changes with its pin.
These six are ruled French and go in the main commit. Any other French change is a draft in its own commit, as step 3 says.
