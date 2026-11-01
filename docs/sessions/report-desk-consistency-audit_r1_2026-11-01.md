# Report: the consistency audit, how Ilya names its own parts (r1, 2026-11-01)

Measure only. Tree `$HOME/mnt/ilya-rewrite`, branch `Shane`, HEAD `cab8d205` (confirmed with `git log -1`). Brief: `brief-desk-consistency-audit_r3_2026-11-01.md`. Every `path:line` below was read this session or comes from a command run this session. Scratch output sits in the session home (`audit-A.txt`, `A-scope.txt`); only this file was written in the tree.

How the counts were made. One `git grep -nwE 'Fit|Shane|Transcription|Transcribe|Markup|Annotation|Metadata|Ribbon|Inspector|MSR|Pyodide'` over the scope gave 3,892 lines; 3,479 of them sit in `docs/sessions/` and `docs/memory/` (history, counted only) and 413 sit in scope. Whole-word matching misses `MarkupPane`, `markup/`, `scoreMarkup`, and lowercase `markup`, so identifiers were counted separately (Section A, item 4). The category column below puts a hit into "comments" when its line holds a comment marker, so a few lines inside multi-line comment blocks land in "identifiers/other"; treat that column as an upper bound.

## A. Names census

### A.1 The current names, verified

| concept | EN | FR | read at |
|---|---|---|---|
| transcription document | Text | Texte | `apps/web/src/lib/i18n.ts:186` |
| score document | Markup (Melody ruled, not built) | Annotation (Chant ruled, not built) | `i18n.ts:197` |
| analysis document | Insights | Aperçus | `i18n.ts:201` |
| lessons | Learn | Leçons | `i18n.ts:187` |
| help | Guide | Guide | `i18n.ts:188` |

The key `tab.markedScore` still carries a name that is two renames old ("Marked score", "Score markup"). The document id in code is `markup` (`destinations.ts:105`).

### A.2 Counts per name per category (whole-word hits, in scope, 413 lines)

| name | 1 singer (i18n value) | 2 Guide/Learn | 3 legend | 4 identifiers/other | 5 comments | 6 tests/e2e |
|---|---|---|---|---|---|---|
| Fit | 0 | 2 | 3 | 14 | 11 | 14 |
| Shane | 0 | 0 | 4 | 7 | 2 | 0 |
| Transcription | 0 | 4 | 1 | 15 | 23 | 13 |
| Transcribe | 1 | 12 | 0 | 8 | 25 | 4 |
| Markup | 5 | 4 | 13 | 24 | 93 | 50 |
| Annotation | 2 | 3 | 2 | 0 | 3 | 5 |
| Metadata | 1 | 3 | 0 | 15 | 9 | 0 |
| Ribbon | 0 | 4 | 0 | 0 | 7 | 1 |
| Inspector | 0 | 4 | 0 | 4 | 15 | 19 |
| MSR, My Sung Russian | 0 | 0 | 0 | 0 | 0 | 0 |
| Pyodide | 0 | 0 | 0 | 0 | 1 | 0 |

"Shane" in the legend: `AGENTS.md:13`, `ARCHITECTURE.md:7` (codename note, correct as history). In code, `shane` (lowercase, in strings and file references) appears in 43 lines of 22 files (`git grep -c shane`), mostly the persisted key (Section A.7) and spec file names in comments (`voice/engine/readiness.ts:11`, `packages/score-parser/src/analysis-types.ts:4`, `overlay-engine.ts:6`, `voice/pacifier/contrast.ts:110,114`).

### A.3 Is each retired name still drawn

Established by reading the code, name by name.

- **Fit as a tab name.** Not drawn as a control. `DeskHead.svelte:61-63` says in a comment that the document "was never called Fit". It survives in the Guide figcaption (EN `GuideContent.svelte:398`, FR `:102`, one hit each) and in four comments (`i18n.ts:181,185,195`). The word "fit" in the sense of compatibility is drawn in `insights.verdict.fit` ("a good fit for you", `i18n.ts:1745`) and is not the retired name. The 21 `insights.fit.*` keys are the measurement table (`i18n.ts:1716-1736`); they are read only by `apps/web/src/lib/insights/FitTable.svelte`, which nothing imports (Section C).
- **Transcribe and fit (the button).** Not drawn. `input.transcribe` is `{ en: 'Transcribe and fit', fr: 'Transcribe and fit' }` (`i18n.ts:258`): the French slot holds English. No code reads the key; the only citations are a comment (`IntakePanel.svelte:528`) and the exemption list of the guard test (`no-fit-name.test.ts:32`). `core-loop.test.ts:28` records the button's removal. The Guide still tells the singer to click Transcribe (EN `GuideContent.svelte:437`, FR `:141`; row 171 owns this).
- **Transcription (the tab).** Not drawn as a tab. Drawn in the Guide (EN `:398,:427`, FR `:102,:131`). `Transcription` survives in 23 comments and as a stored value `transcription` that `restoreSurface` reads and migrates (`destinations.ts:111-114`).
- **Markup / Annotation.** Drawn: `tab.markedScore` (`i18n.ts:197`), `profile.scoreRegionAria` (`:1420`, an aria label), `profile.lede` (`:1390`), `calib.characteristics.lede` (`:1359`), the Guide (EN `GuideContent.svelte:376,378,581`; FR `:80,82,285`). All of these change under row 170.
- **Metadata (section).** Not drawn as a header: `MetadataFields.svelte` says "THIS COMPONENT DRAWS NO HEADER" (line 85) and `meta.heading` has no reader (Section C). It is drawn in the Guide as a section name (EN `:398,:426-427`, FR `:102,:130-131`). The component, `metadata-provenance.ts`, and the `meta.*` keys still carry the name.
- **Ribbon.** Not drawn in the interface (the string `inspector.ribbon` reads "Character breakdown", `i18n.ts:696`). Drawn in the Guide (EN `:455-456`, FR `:159-160`, Contributors `:558,:568`, `:262,:272`). It survives as comments and CSS comment banners in `InspectorPanel.svelte:126,145,160,1744` and in the `ribbon.*` keys (`i18n.ts:711-716`, drawn).
- **Inspector.** Not drawn. Survives as the component `InspectorPanel.svelte`, the key prefix `inspector.*` (32 keys, `i18n.ts:684-740`), `drawer-width.ts:2`, 15 comments, 19 test lines, and the Guide (EN `:455-456`).
- **The drawer handle.** Replaced by the pull (`i18n.ts:206`, `drawer.pull` reads "Drawer" / "Tiroir"). Guide still says handle (EN `:407-408`, FR `:111-112`; row 171).
- **MSR, My Sung Russian, `?reader=ilya`, Pyodide, "four tabs".** MSR and My Sung Russian: no hit in scope. `?reader=ilya`: no hit in scope. Pyodide: one comment only (`reader/staff-detect.ts:13`). "four tabs": Guide only (EN `:398`; FR `:102`, "quatre onglets" counted by row 171).
- **Shane as a name shown.** Not drawn. Env var is `PUBLIC_INCLUDE_MARKUP_INSIGHTS` (`apps/web/.env:1`; the file holds that one line); `PUBLIC_INCLUDE_SHANE` appears in 3 lines of 2 files (not re-opened this session: NOT ESTABLISHED whether they are live or history).

### A.4 Code identifiers, file and folder names

Case-sensitive `git grep` counts, `apps/web/src apps/web/e2e packages/*/src scripts tests apps/web/.env vercel.json`:

| string | files | lines |
|---|---|---|
| `markup` (any case-sensitive lowercase hit) | 72 | 271 |
| `MarkupPane` | 29 | 53 |
| `scoreMarkup` | 5 | 17 |
| `markedScore` | 6 | 9 |
| `INCLUDE_MARKUP_INSIGHTS` | 8 | 29 |
| `transcription` (lowercase) | 87 | 354 |
| `shane` | 22 | 43 |
| `annotation` (lowercase) | 1 | 6 |

Files and folders whose names carry a retired term (`git ls-files`, scope): the folder `apps/web/src/lib/markup/` with 15 files (`MarkupPane.svelte`, `NotesColumn.svelte`, `PieceKeyLine.svelte`, `TranspositionDock.svelte`, `TranspositionRuler.svelte`, `legend.ts`, `notes-pages.ts`, `profile-status.ts`, `transposition-ruler-state.svelte.ts`, `transposition-ruler.ts`, plus tests `legend.test.ts`, `markup-pages.test.ts`, `notes-pages.test.ts`, `profile-status.test.ts`, `transposition-ruler.test.ts`); `apps/web/e2e/markup-pages-lose-no-bars.test.ts`; `components/Drawer/InspectorPanel.svelte`; `components/Drawer/MetadataFields.svelte`; `lib/metadata-provenance.ts` and its test; `lib/insights/FitTable.svelte`; `lib/no-fit-name.test.ts`. `smufl-metadata.ts` and the `*_metadata.json` fonts are font metadata, not the drawer section, and need no rename.

Identifiers (non-comment code) with retired terms: `BAND_IDS.scoreMarkup` (`sections.svelte.ts:106`), `INCLUDE_MARKUP_INSIGHTS`, `StudioDocument` value `'markup'` (`destinations.ts`), the CSS class `.markup-paper-container` (`app.css:313`, comment), `stand-ins.ts:95` `interface Fit` and `fitResonance` (the verb "fit" in the voice engine; not the retired name, and a collision for the guard), `omr` and `reader` names are clean.

### A.5 Collisions (one word, two things)

1. `loupe.station.lyric` is `{ en: 'Lyric', fr: 'Texte' }` (`i18n.ts:507`), drawn at `score/CorrectionSurface.svelte:715` (and `lyricTake`, `i18n.ts:629`, same file). FR « Texte » there names the sung syllable, the same word as the Text document, while FR « Paroles » names Lyrics everywhere else (`intake.view.lyrics`, `input.watermarkLyrics`).
2. `a11y.paper` is `{ en: 'Text', fr: 'Texte' }` (`i18n.ts:225`): the Paper is named by its document, so Paper and Text share a name in the accessibility tree.
3. `a11y.drawer` is "Controls" / « Commandes » (`i18n.ts:222`) while `drawer.pull` is "Drawer" / « Tiroir » (`:206`): the drawer has two accessible names.
4. FR « Entrée » names the Input band (`group.input`, `:144`); FR « Saisie » names entry in `loupe.station.accidental` (`:506`) and EN "Entry" there; the English Input and Entry are two words, the French two words, so no collision, but Learn says "Input field"/« champ Entrée » (six hits, `LearnContent.svelte`), which matches the band.
5. `Transcribe` is both a retired control and an instruction verb in Learn (12 hits, e.g. `LearnContent.svelte:3025,3224,3946,4008-4018`). The guard cannot ban the bare word.
6. `fit` is a retired product name and a plain English word (`insights.verdict.fit`, `:1745`; `stand-ins.ts:95,103,130`).

### A.6 Capitals ruling (Dann 12:19), counts of singer-facing mentions not in capitals

Method: `cap.mjs`, comment lines stripped, Unicode word boundaries. These are upper bounds: sentence-initial words and non-document uses (for example "Text" as the noun, "Guide" as a book) are included, because a script cannot tell them apart.

| place | name (not capitals) | in capitals |
|---|---|---|
| Guide EN | Text 5, Markup 4, Insights 6, Learn 1, Guide 8 | LEARN 6, GUIDE 1 |
| Guide FR | Texte 5, Annotation 3, Aperçus 6, Leçons 4, Guide 9 | LEÇONS 2 |
| Learn EN | Learn 2, Guide 1 | LEARN 8 |
| Learn FR | Guide 1 | LEÇONS 8 |
| `i18n.ts` EN values | Text 3, Markup 4, Insights 7, Learn 2, Guide 1 | none |
| `i18n.ts` FR values | Texte 5, Annotation 4, Aperçus 7, Leçons 2, Guide 1 | none |

Typed in components, outside `i18n.ts`: `Drawer.svelte:560` draws the Learn table-of-contents heading as 'LEÇONS' / 'LEARN' typed into the component. The tab bar capitalises by CSS (`DeskHead.svelte:201,245`, row 171 review), so the same word is capitals on screen, mixed case in the key, and typed capitals in the contents heading.

### A.7 Persisted names

Ruled renamable (Dann 12:00). The five names `origin/main` also writes are not re-derived (see `review-fable-plan-consistency_r1_2026-11-01.md`, question 6). Other persisted keys whose name or value carries a retired term, on `Shane`:

| persisted name | where | carries | current term |
|---|---|---|---|
| localStorage `shane.profiles.v2` | `voice/profileStore.ts:73` (the file is under `voice/` on this branch; Fable cited `shane/profileStore.ts` on `main`) | Shane | a voice-profiles name (taste; not chosen here) |
| localStorage `shane.profile.v1` | `voice/profileStore.ts:72` | Shane | legacy read source only; keep as the migration key |
| `ilya:activeTab` value `markup` | written `+page.svelte:3473`, read `destinations.ts:105-106` | Markup | `melody` (desk default per Fable) with `markup` added to the legacy cases |
| `ilya:activeTab` values `transcription`, `shane` | read only, `destinations.ts:111-116` | old ids | already migrated; no change |
| `ilya:openStations` id `scoreMarkup` | `sections.svelte.ts:37` key, `:106` id (`BAND_IDS`), `bandState.ts:233` comment "a wire value" | Markup | the Voice band; `migrateOpenStations` exists (`sections.svelte.ts:190`) and takes a `SUCCESSOR` map |

Persisted keys checked and found clean: `ilya:notationPrefs`, `ilya:showStressDiacritics`, `ilya:language`, `ilya:activeSongId`, `ilya:evictionNoticeShown`, `ilya:pairings`, `ilya:installDeclinedAt`, `ilya:rangeOfferDeclined`, `ilya-ios-hint-shown`, `ilya-dict-manifest`, and the databases `ilya-data` and `ilya-library`. Saved song fields: a search of `library/` for `markup|shane|transcription` finds comments only (`library/types.ts:165,188,204`), so no stored field name carries a retired term. NOT ESTABLISHED: the field names inside an exported `.ilya` binder file beyond that search.

Not persisted but wire-named (renaming them touches i18n parity and `BAND_IDS` consumers): i18n keys `group.scoreMarkup`, `tab.markedScore`, and `insights.fit.*` (21 keys). `ARCHITECTURE.md:170-174` invariant 10 requires a migration that reads old and new for any stored id.

Count of persisted names needing a rename: 3 (`shane.profiles.v2` with a one-time read, the `markup` tab value, the `scoreMarkup` band id), plus 1 read-only legacy key (`shane.profile.v1`) that stays.

## A2. The user-facing text, English and French

Learn and `i18n.ts` took the budget; the Guide's control labels were taken as read from `review-fable-brief-row171_r1_2026-11-01.md`.

### A2.1 Controls named in text, against what is drawn

- **Spot controls (Dann 12:16).** The checkbox draws « Réduction ciblée » and « Reconstitution ciblée » from literals typed in the component (`InspectorPanel.svelte:60-61`, no other « ciblée » control hit; the only other « ciblée » in the tree are the ordinary word in `LearnContent.svelte:1058` heading and `:2035`, not controls). The unread key `inspector.spotRecon.right` says « Reconstitution ponctuelle » (`i18n.ts:721`); the printed legend reads « Reconstitution ponctuelle » (`legend.spot-reconstitution`, `i18n.ts:914`, drawn through `provenance.ts`). Learn FR tells the singer to click « Réduction ponctuelle » or « Reconstitution ponctuelle » (`LearnContent.svelte:991`), which is not the checkbox's wording. Learn EN says "Spot reduction" / "Spot reconstitution" (`:3027`), which matches. The Guide FR says « ciblée » at `GuideContent.svelte:153,165` (the lines found by grep are the Word Stack and Dictionary figcaptions; row 171 owns them). Count of « ciblée » for these controls: 2 (the component) plus the Guide hits just named; count of « ponctuelle » for them: 3 (`i18n.ts:721`, `:914`, `LearnContent.svelte:991`).
- **Learn to drawer.** Learn names "the Notation section of the Drawer" (`LearnContent.svelte:3027,4002`, FR `:1997`); the station heading is `cosmetic.heading` = "Notation" / "Notation" (`i18n.ts:286`). Match. It names "the Input field" / « champ Entrée » (six hits); `group.input` is "Input" / « Entrée » (`:144`). Match.
- **Learn names "Word Stack"** (`:3027` EN; FR « pile de mots », `:991`). The Guide keeps it by ruling (row 171). The checkbox sits in `InspectorPanel`, "tethered to stack's right edge" (`InspectorPanel.svelte:1010`), inside the Analysis station (`AnalysisStation.svelte:67-72`). Acceptable; the singer must first select a word (`AnalysisStation.svelte:102`).
- **A control named in text and drawn nowhere.** `input.transcribe` (above). `inspector.spotRecon.globalOn` says "Disable it in Cosmetic Options" (`i18n.ts:722`); the section is called Notation (`:286`) and nothing reads the string.

### A2.2 Labels typed into components, not read from `i18n.ts`

A search for `language === 'en' ? ... : ...` ternaries (and the `'fr'` form) outside tests finds 117 sites in 20 files: `Drawer.svelte` 84 (the Learn and Guide contents), `InspectorPanel.svelte` 4, `comment-sources.ts` 4, `SearchableSelect.svelte` 3, `gloss-resolve.ts` 3, `HeaderBar.svelte` 2, `insights.ts` 2, `singer-blocks.ts` 2, `singing-measures.ts` 2, and one each in `AnalysisStation.svelte:102`, `bandState.ts`, `ReadingPaper.svelte`, `ReadingAid.svelte`, `InsightsPane.svelte`, `Tessituragram.svelte`, `phonation-headline.ts`, `singer-page.ts`, `ingest.ts`, `ProfileSwitcher.svelte`, `+page.svelte`. These bypass `approval/i18n-keys.test.ts` and are invisible to any retirement guard that reads only `i18n.ts`. Full list: `git grep -nE "(language|lang|locale) *(===|==) *'(en|fr)' *\?"`.

### A2.3 One term per concept (two columns; flags)

| English | French | note |
|---|---|---|
| Text, Insights, Learn, Guide | Texte, Aperçus, Leçons, Guide | as keyed |
| Markup | Annotation | retiring (Melody, Chant) |
| Drawer | Tiroir | `a11y.drawer` is "Controls" / « Commandes » (second name) |
| Paper | Papier | `a11y.paper` is "Text" / « Texte » |
| Input (band) | Entrée | |
| Poem | Poème | `intake.view.poem` |
| Lyrics (plural, the field) | Paroles | |
| Lyric (singular, Loupe station) | Texte | collision with the Text document |
| placement / syllable placements | placement / « syllabes » | `storage.saveFailed.generic` and `storage.loadFailed` say "syllable placements" in EN and « Vos syllabes » in FR (`i18n.ts` near 1540); the French omits the concept |
| Underlay (heading) | Placement des paroles | `underlay.heading`, unread |
| Loupe | loupe | EN capital, FR lowercase (`insights.phonation.tempoPointer`) |
| Corrections | Corrections | `loupe.station.corrections` |
| Spot reduction / reconstitution | ciblée (component), ponctuelle (legend, Learn FR) | three states for one pair |
| Song | chant | consistent; generic label uses « mélodies » (`i18n.ts:277`, noted by row 171) |
| Voice (band) | Voix | |
| Piece (band) | Pièce | |
| Cosmetic Options | Options cosmétiques | stale name for Notation, unread key |

NOT ESTABLISHED: the French for "the Paper" in running text beyond the Guide (« Papier » appears at `GuideContent.svelte:148,153`); a full sweep of other concepts (a syllable seat has no i18n term: `seat` finds 0 rows).

### A2.4 Parity

- `input.transcribe` FR is English (`i18n.ts:258`).
- `storage.saveFailed.generic`, `storage.loadFailed`: EN "syllable placements", FR « syllabes » (see A2.3).
- `inspector.spotRecon.*` and `legend.spot-reconstitution` (« ponctuelle ») against the drawn literal (« ciblée »).
- `loupe.station.lyric` FR « Texte » against EN "Lyric" (a different concept from the Text document).

French is not drafted here.

### A2.5 Stale explanations

- `i18n.ts:11` says "this file's 881 keys"; a parse of the key lines finds 1,023 entries (the index at `:7-85` lists prefix counts that no longer sum to the file).
- `i18n.ts:76-85`, "THREE LEGACY KEYS": true today; false after the rename.
- `ARCHITECTURE.md:7-8` and `AGENTS.md:13`: "shown on screen as Fit until 2026-09" is accurate as history.
- `README.md:13`, `CONTRIBUTING.md:62`: "LEARN module" (third spelling; see Section B).
- `Drawer.svelte:560`: the contents heading is typed 'LEÇONS' / 'LEARN', separate from the tab's key.
- `inspector.spotRecon.globalOn` (above).

### A2.6 Ratified text among the findings

Ratification is approval at a moment (Dann 12:13); these change by ruling, and French goes to Dann as a marked draft.

- `tab.markedScore` (`i18n.ts:190-197`, "RATIFIED by Dann 2026-09-13"), pinned in tests `placeholder-line.test.ts:51-66` and `no-fit-name.test.ts:104-111`.
- Guide passages B and C (EN `GuideContent.svelte:378,581`, FR `:82,285`), pinned at `no-fit-name.test.ts:104-111`.
- The Guide's French conventions block (`GuideContent.svelte:291`, ratified 2026-10-11).
- `input.watermarkLyrics` (`i18n.ts:248`, RATIFIED 2026-10-16 01:18).
Whether other flagged strings are pinned in `ratified-lines.test.ts` was not searched string by string: NOT ESTABLISHED beyond the four above.

## B. The legend against the tree

Method: every backticked path or file name in `ARCHITECTURE.md`, `CONTRIBUTING.md`, `README.md`, and `AGENTS.md` checked against `git ls-files` (`paths.mjs`), then the false or doubtful ones read.

True and checked: the six-module list and import order (`ARCHITECTURE.md:185-188` equals `scripts/ratchets.mjs:78-85`); `__approved__/` exists (`apps/web/src/lib/approval/__approved__/`); `data/blurb-composer.json` at the repo root (`ARCHITECTURE.md:87-90`; `apps/web/data/` does not exist, as the text says); `apps/web/e2e/` and `apps/web/e2e-phone/` exist; `packages/{blurb,dictionary,phonology}/tests` exist; `.github/workflows/ci.yml` is tracked; the README Project Structure tree (`README.md:56-68`) lists real folders; `tesseract.js` is a dependency (`apps/web/package.json:28`); every path inside the codemap resolves by basename (a path in lines `:95-130` is relative to its folder and each file named exists).

`scripts/ratchets.json`: every ceiling path exists (script output "checked", no MISSING). Slack: 13 of 16 ceilings have zero lines of slack; `LearnContent.svelte` has 13 (4086 of 4099), `Loupe.svelte` has 1 (3012 of 3013), and `InsightsPane.svelte` is 760 lines against a ceiling of 1351 (591 of stale slack: lower it). `ratchets.mjs:72-74` fails a ceiling whose file is gone.

`apps/web/.env` is tracked and holds one line, `PUBLIC_INCLUDE_MARKUP_INSIGHTS=true` (`apps/web/.env:1`). `ARCHITECTURE.md:132-133` names the variable but not the file.

The key-prefix index (`i18n.ts:7-85`): each prefix and its named files still exist, except it lists `lib/insights/Tessituragram.svelte` as the `insights.` consumer; that file has no importer (Section C). Its "no consumer found" prefixes (`app`, `clitic`, `display`, `engraving`, `provenance`, `result`, `underlay`, `witness`) agree with the unread-key scan (Section C). It does not list `jsx`-style dynamic prefixes, so counts drift: stated 881 keys, parsed 1,023.

Findings against the legend:
1. `CONTRIBUTING.md:38` cites "the project's voice instruction"; no such file in `git ls-files` (grep for VOICE: no hit).
2. `README.md:13`, `CONTRIBUTING.md:62`: "LEARN" / "LEARN module" versus the key `Learn` (`i18n.ts:187`).
3. `README.md:33` and root `package.json` `engines.node >=18.0.0`; `apps/web/package.json` has no `engines`; Vercel builds on 24.x (Fable). Whether the build passes on Node 18: NOT ESTABLISHED.
4. `README.md:56-68` omits `docs/`, `third_party/`, `apps/web/e2e-phone/`.
5. `ARCHITECTURE.md:218` points to a dated memo in `docs/sessions/` that `:230-231` says is never authoritative (Fable item; confirmed at those lines).
6. Modules in the tree the codemap omits: `lib/components/Field/` (0 mentions in the three documents; contains `SavedNote.svelte`, `settle-field.ts`), `lib/tempo/` (1 mention), `lib/approval/` (4), `lib/omr/` (1). Top-level `lib/*.ts` files (for example `pipeline.ts`, `boundaries.ts`, `one-action.ts`) are named only in passing.
7. Repo-root clutter: `kimi-brief-cosmetic-critique-deferred_2026-07-13.md` is tracked at the repository root (`git ls-files`); the folders `_to_delete` and `Claude outputs` exist on disk but are untracked (`git ls-files` returns nothing for them). The 8 hits of retired names in that tracked file are history.
8. `AGENTS.md:49` cites `SHANE_ILYA_SOURCE_INDEX.md`, which is not in the tree (`paths.mjs` NOTFOUND, no basename match).
9. `ARCHITECTURE.md:120,185-188` and `scripts/ratchets.mjs:78-85` and `scripts/ratchets.json` all hard-code `markup` / `MarkupPane.svelte`: they move together (Fable amendment 3).

## F. Where a newcomer needs a comment

(Run before C and D by the brief's order; the findings are short.)

1. **Files with no comment in their first six lines: 25 of 301**, verified (`hdr.mjs` over `git ls-files`, excluding `.test.`, `.d.ts`, `vendor/`). What each header must name:
   - `components/Drawer/Drawer.svelte`: the single drawer shell; which stations it hosts; the Learn and Guide contents typed in it (84 typed labels); it is at its ceiling (1990).
   - `components/Drawer/InspectorPanel.svelte`: the word analysis panel (Analysis station); the Spot checkbox label typed here; at ceiling 2432.
   - `components/Drawer/IntakePanel.svelte`: Input band; Poem and Lyrics views; the removed Transcribe button.
   - `components/Drawer/IntakeViews.svelte`: the Poem and Lyrics views and the Cmd+Enter binding; must agree with `one-action.ts` `QUIET_MS`.
   - `components/Drawer/RootPanel.svelte`: Piece band (metadata, notation, export).
   - `components/Drawer/SearchableSelect.svelte`: shared select; typed EN/FR (3 sites).
   - `components/HeaderBar.svelte`: language pill; typed labels.
   - `components/InstallPrompt.svelte`: install prompt; must agree with `install-decline.ts` keys.
   - `components/Paper/PageFooter.svelte`, `Paper.svelte`, `ReadingPaper.svelte`, `SubsequentPage.svelte`, `TitleHeader.svelte`, `TitlePage.svelte`, `VerseLine.svelte`, `WordStack.svelte`: the Paper, what each page piece draws; one head and one foot (`one-head-one-foot.test.ts`); `WordStack.svelte` must agree with `score/pairings.ts:871` on the vowel list.
   - `components/Reading/GuideContent.svelte`, `LearnContent.svelte`: Guide and Learn bilingual text; the control names they must match; anchors checked by `guide-anchors.test.ts`; Learn at ceiling 4099.
   - `voice/engine/analyze.ts`, `derivations.ts`, `divergence.ts`, `extract.ts`, `guard.ts`: the voice engine stages; what each reads from the profile; the plausibility rule (`plausibility.ts:272`) they must agree with.
   - `routes/+layout.svelte`, `routes/+page.svelte`: the page that owns state; `+page.svelte` is at its ceiling (5586, zero slack).
2. **Relationships a reader cannot see from one file:**
   - Two databases opened in two files: `loader.ts:141` opens `ilya-data`; `library/driver.ts:397,430-434` opens `ilya-library` and its comment cites `loader.ts:105` (stale; open is at `:141`).
   - The band id `scoreMarkup` is a wire value in `ilya:openStations` (`sections.svelte.ts:37,106`; `bandState.ts:233`).
   - `restoreSurface` legacy cases (`destinations.ts:98-121`) against the stored `ilya:activeTab` (`+page.svelte:3473,3664`).
   - The wall: `wall.ts` and `apps/web/.env:1` and `vercel.json:42-47` (Git deployments for `Shane` and `main`).
   - The Cyrillic vowel list and the punctuation lists (Section D).
   - `QUIET_MS = 600` (`one-action.ts:41`) used at `+page.svelte:2556` and spoken to the singer in the Guide.
3. **Risks.** 13 of 16 ratchet ceilings have zero slack (A.7 / Section B); invariant 10 (a stored id changes only with a migration, `ARCHITECTURE.md:170-174`) applies to the three persisted renames; invariant 13 names the `markup` module (`ARCHITECTURE.md:185-188`); `old-reader-seats.ts:12` carries a known edge case in a comment.
4. **Stale or dead-line comments.** 167 citations of the form `file.ts:NNN` in non-test source (`git grep -noE '[A-Za-z+_-]+\.(ts|svelte|mjs):[0-9]+'` excluding tests, `vendor`, and JSON; the brief's 174 includes those). Top files: `score/pairings.ts` 22, `score/vowel-resolver.ts` 11, `score/Loupe.svelte` 7, `markup/MarkupPane.svelte` 7, `voice/engine/readiness.ts` 6, `score/loupe.ts` 6. Ten sampled at every 17th hit:

| citing comment | cited | what line holds now | verdict |
|---|---|---|---|
| `analysis/watchlist.ts:233` | `types.ts:26` | ambiguous: seven `types.ts` files; `library/types.ts:26` is unrelated | ambiguous |
| `i18n.ts:1306` | `LearnContent.svelte:2819` | `</tr>` | does not hold |
| `markup/MarkupPane.svelte:604` | `vowel-resolver.ts:384` | an interface member `ipa: (event) => string | undefined` | plausible |
| `provenance.ts:86` | `WordStack.svelte:165-166` | `{:else if word.stressSource === 'user-composer'}` | does not hold |
| `score/LoupeSyllables.svelte:155` | `Loupe.svelte:1513` | `getAttribute('x2')` | does not hold |
| `score/loupe-panel.svelte.ts:6` | `+page.svelte:1356` at commit `9ebfdc0` | text unrelated now | pinned to a commit by design |
| `score/pairings.ts:138` | `engine.ts:52-56` | `}` | does not hold |
| `score/tuplet-row.svelte.ts:8` | `+page.svelte:1139-1168` at `14e2ff8` | unrelated now | pinned to a commit by design |
| `sources.ts:337` | `LearnContent.svelte:2081` | `</div>` | does not hold |
| `dictionary/pre-reform-normalizer.ts:62` | `reconciliation/taxonomy.ts:15` | the `orthographic-trivia` line | holds |

   Result: 1 holds, 1 plausible, 2 pinned to commits, 1 ambiguous, 5 do not hold. Also confirmed: `library/driver.ts:432` against `loader.ts:105`.

## C. Dead code and dead references

Method: `dead.mjs` (import-path and name search over `git ls-files`). Confidence tags: certain means no file in the searched set names it; likely means dynamic access is possible.

1. **Files nothing imports (certain).** `apps/web/src/lib/insights/FitTable.svelte` (176 lines, the only reader of the 21 `insights.fit.*` keys) and `apps/web/src/lib/insights/Tessituragram.svelte` (197 lines; `ARCHITECTURE.md:123` and `i18n.ts:37` name it as a consumer). Searched for `FitTable` and `Tessituragram` across `apps`, `packages`, `scripts`, `ARCHITECTURE.md`: only the type name `TessituragramModel` is used elsewhere. Dynamic `import.meta.glob`: not searched for, so tag "certain" for static imports.
2. **Files only tests import (certain for non-test code):** `analysis/analyze-per-verse.ts`, `insights/cycle-dose.ts`, `reader/zip-fixture.ts`, `score/offers-for-a-bar.ts`, `score/reconciliation/witnesses.ts`, `score/row108.support.ts`, `syntactic-break.support.ts`, `voice/engine/fry-synth.ts`, `voice/pacifier/contrast.ts`, `packages/score-parser/src/mini-xml.test-support.ts`. Some are test support by design (`.support.`, `-support`, `zip-fixture`).
3. **Exports no other file names (certain, name search):** 12 not used even in their own file: `insights/comments.ts CLOSE_VOWELS`, `insights/insights.ts PAGE_ONE_FINDINGS`, `omr/homr-reader.ts omrStarted`, `page-config.ts ROW_GAP`, `reader/errors.ts DenigmaErrorCode` and `ResourceErrorCode`, `reader/page-image.ts pieceIdFor`, `reader/zip-fixture.ts FixtureMember`, `score/engraving.ts minGapFor`, `score/entry.ts TUPLET_COUNTS`, `voice/engine/errors.ts CaptureErrorCode`, `packages/phonology/src/lexical-palatalization.ts TS_SUFFIX_NORMAL`. A further 339 exports are used only inside their own file (the `export` keyword is unneeded). 303 exports are named only by tests.
4. **Dead method (certain).** `GraysonEngine.autoDetectBoundaries` at `packages/phonology/src/engine.ts:2000` has no caller anywhere (`git grep` over `apps`, `packages`, `tests` finds the definition and the web function of the same name in `boundaries.ts:62`, which `pipeline.ts:48,322` calls).
5. **i18n keys with no reader.** A scan of the 1,023 parsed keys against quoted literals in non-test source finds 375 with no literal reader; 235 of these share a prefix that code builds dynamically (for example `loupe.value.*`, `profile.count.*`, `vowel.name.*`) and are tagged likely-read; 140 have no literal and no dynamic prefix, tagged certain (a key passed through a computed string would escape the scan). By prefix, the 140: `upload` 28, `inspector` 14, `insights` 20, `notation` 11, `stress` 9, `witness` 8, `engraving` 5, `provenance` 5, `display` 5, `intake` 4, `placeholder` 4, `key` 4, `meta` 3, `clitic` 3, `shiftLyrics` 3, `input` 2, `dict` 2, `loupe` 3, and one each for `app.subtitle`, `drawer.expand`, `underlay.heading`, `result.words`, `calib.common.vowels`, `legend.inferred`, `station.startOver`. Row 155's count of 24 `upload.*` is now 28. The `insights.*` set includes `insights.findings.*`, `insights.finding.*`, and `insights.phonation.*` (some may be reached through a builder; `placeholder.line.markup.*` is read by `analysis/placeholder-line.ts`, so treat `placeholder` as likely-read).
6. **Comments citing dead things.** `library/driver.ts:432` (`loader.ts:105`); `i18n.ts:37` and `ARCHITECTURE.md:123` (`Tessituragram.svelte` as a consumer); `AGENTS.md:49` (`SHANE_ILYA_SOURCE_INDEX.md`); `CONTRIBUTING.md:38` (voice instruction); the five sampled citations in Section F.

## D. Duplicated logic

**Punctuation tests.** Sites and sets:
- `lib/boundaries.ts:46` `PUNCTUATION_AT_END = /[.,!?;:"""''–—«»]$/` (live, used at `:78`).
- `packages/phonology/src/engine.ts:2001` `/[.,!?;:"""''–—]$/` inside the dead `autoDetectBoundaries` (`:2000`), and `engine.ts:821` a trailing-punctuation capture `/[.,!?;:"""''–—]+$/` (live for the line it serves; not read in full).
- `lib/pipeline.ts:54` `PUNCTUATION_REGEX = /[.,!?;:"""''–—…()«»]/g`, `:55` `TRAILING_PUNCT_REGEX = /[.,!?;:"""''\-‐‑–—]+$/`, `:289` an inline test `/[.,!?;:"""''–—\-‐‑«»]/`.
- `lib/typed-hyphens.ts:132` `TRAILING_PUNCT = /[.,!?;:"""''\-‐‑–—]+$/`.
- `lib/score/clitic-seat.ts:345` `/[^\p{L}\p{M}]+$/u` (a different rule: everything that is not a letter or mark).
- `lib/analysis/watchlist.ts:628` and `lib/insights/text-parts.ts:12` the same `/^[\p{P}\s]+|[\p{P}\s]+$/gu` (identical to each other).
- `lib/score/pairings.ts:222` is a dash test `/[-–—]$/`, not the punctuation set (the lead is refuted for this line; it matches `pipeline.ts:289` only in the dash part).
They disagree today: `boundaries.ts` includes `«»` and not `…()`; the dead engine copy has neither `«»` nor `…`; `pipeline.ts:54` has all of `…()«»` but `:55` has the hyphen forms and not `«»`. Quote characters in the source may be curly in the files and are shown here as typed by the terminal; the sets were not byte-compared. What depends on agreement: the 'hard' boundary after a clause-ending mark (`boundaries.ts:78`) must see the same marks the pipeline strips as punctuation (`pipeline.ts:54`), or a word ending in `…` is cleaned but not treated as a hard boundary. Recommendation: one named, documented module `lib/punctuation.ts` exporting `TRAILING_CLAUSE_MARKS`, `STRIPPED_MARKS`, and a `endsWithClauseMark(word)` function, with a comment on each saying which stage uses it; delete the dead engine method and its regex; leave `watchlist.ts`/`text-parts.ts` to share one `trimPunctuation` function (identical today) and leave `clitic-seat.ts:345` alone, since it answers a different question.

**Cyrillic vowel list.** Sites:
- `lib/score/vowel-resolver.ts:159` `CYRILLIC_VOWEL = /[аеёиоуыэюяѣіѵ]/iu` (the reference; 13 uses).
- `lib/omr/underlay-units.ts:24-25` `VOWEL`, `VOWELS` with the same letters (the comment at `:20` and at `omr/underlay-clitics.ts:21`, `omr/vowels-per-note.ts:21` says "held equal ... by" a test).
- `lib/score/phrase-ends.ts:30` `HAS_VOWEL = /[аеёиоуыэюяѣіѵ]/i` (same letters).
- `lib/clitic-merge.ts:13` `CYRILLIC_VOWELS` a Set of 20 letters (upper and lower of the ten modern vowels only: lacks `ѣ і ѵ`).
- `lib/syllable-utils.ts:21` `CY_VOWELS` the same ten-letter modern set.
- `components/Drawer/InspectorPanel.svelte:534` and `:921` the modern ten-letter set; `components/Paper/WordStack.svelte:67` and `lib/score/pairings.ts:871` the string 'аеёиоуыэюяАЕЁИОУЫЭЮЯ'.
They agree on the ten modern vowels and disagree on `ѣ і ѵ`: the score and OMR side counts the old-spelling letters, the pipeline side (`clitic-merge`, `syllable-utils`, Inspector, WordStack, `pairings.ts:871`) does not. The pipeline side sees modernised text (intake modernises old spelling, `types.ts:127`), so the disagreement is probably deliberate, but nothing says so. Recommendation: one documented module `lib/cyrillic.ts` exporting `MODERN_VOWELS` and `OLD_SPELLING_VOWELS` and the two regexes, with a sentence stating which stage may see old letters; `vowel-resolver.ts` re-exports `CYRILLIC_VOWEL` so its 13 importers do not change. Not established: whether a test already pins the omr copies (the comments say so).

## E. Recommended order and size

Sizes from the counts above (files and line hits; line counts exclude blank lines of renamed folders).

1. **Singer-facing names (rows 169 to 171).** `i18n.ts` values: 9 value lines (Markup 5, Annotation 4 on 4 keys) plus the capitals ruling (about 24 singer-facing sites in `i18n.ts`, plus the Guide counts in A.6, plus `Drawer.svelte:560`); Guide and Learn: 18 + 10 retired-name hits in the files named in A.2, plus about 40 mentions of the five names; the two spot-control strings and the three French states (`InspectorPanel.svelte:60-61`, `LearnContent.svelte:991`, `i18n.ts:721,914`): 5 lines, French through Dann; `input.transcribe` and `input.clear` removal; 117 typed ternaries move to keys only if the capitals ruling is to be applied by editing `i18n.ts` alone. About 8 files for the strings, 3 for the typed labels.
2. **The legend and a names table.** `ARCHITECTURE.md` (9 retired-name lines, `:120`, `:185-188`, `:7-8`, `:23`), `README.md:11,13,33,56-68`, `CONTRIBUTING.md:13,38,62`, `AGENTS.md:11-19,49,68`; the `ratchets.json` slack for `InsightsPane`; the `i18n.ts:7-85` index regenerated (also fixes the 881 count). About 5 files, 40 lines.
3. **Code identifiers.** Folder `lib/markup/` (15 files) to the new document name; `MarkupPane` in 29 files (53 lines); `markup` in 72 files (271 lines); `StudioDocument` value; `BAND_IDS.scoreMarkup` (5 files, 17 lines); `markedScore` (6 files, 9 lines); `INCLUDE_MARKUP_INSIGHTS` (8 files, 29 lines, may stay: it names the wall, not the document); `FitTable.svelte` rename or deletion; `MetadataFields.svelte`, `metadata-provenance.ts`, `InspectorPanel.svelte`; e2e tab name lookups (8 sites in 6 files); `scripts/ratchets.mjs:78-85` and `ratchets.json`. About 100 files, about 450 lines touched, almost all mechanical. Persisted renames (A.7, three names) with their one-time reads: 3 files.
4. **Dead code.** Delete `FitTable.svelte` or wire it; decide `Tessituragram.svelte`; remove `engine.ts` `autoDetectBoundaries` (about 45 lines); remove the 140 certain-unread keys (from `i18n.ts`, about 140 lines) after the allow-list test; 12 unused exports; drop the `export` on 339 internal ones (optional). About 6 files for the first three items, 1 for the keys.
5. **Shared modules.** `lib/punctuation.ts` (4 files touched) and `lib/cyrillic.ts` (9 files touched), each with a test pinning the sets.
6. **Comments.** 25 file headers, the 5 stale citations found, the 167-citation sweep, the module-map generator, and the two header and citation tests (Fable question 7 and 8).

## Not established

- Whether anyone has saved data on `ilya.dannmitton.com` (Fable's finding stands; not re-checked).
- Whether `PUBLIC_INCLUDE_SHANE` (3 lines in 2 files) is live or history.
- The field names inside an exported `.ilya` binder.
- Which i18n keys among the 235 dynamic-prefix ones are truly unread.
- Whether any of the 10 test-only-imported files is imported through `import.meta.glob`.
- The byte-level quote characters in the punctuation sets.
- Pins in `ratified-lines.test.ts` for flagged strings beyond the four named.
- The full set of singer-facing nouns for syllable seat and placement in running text.

## Not done

- Section A.2 does not separate the 335 comment hits by file within each name (the full list is in the scratch `A-scope.txt`); the appendix lists only the singer-facing and persisted sites.
- A2 did not re-read the Guide's control labels (taken as read per the brief) or read all of Learn line by line: Learn was searched for controls, tabs, buttons, drawers, and the retired names only.
- Section D did not find or compare every punctuation test (the search covered `[.,!?` sets and `\p{P}`); `engine.ts:821` was not read in full.
- Not every one of the 167 citations was checked: ten were.

## Appendix: singer-facing and persisted sites

Singer-facing `i18n.ts` values with a retired name: `:197` (`tab.markedScore`, Markup / Annotation), `:258` (`input.transcribe`, unread), `:262` (`input.clear`, "Clear text" / « Effacer le texte », unread), `:273` (`meta.heading`, Metadata / Métadonnées, unread), `:1359` (`calib.characteristics.lede`), `:1390` (`profile.lede`), `:1420` (`profile.scoreRegionAria`), `:1716-1736` (`insights.fit.*`, key names only), `:1939-1940` (`placeholder.line.markup.*`, key names).

Guide sites (retired term, EN line / FR line), from the whole-word scan and row 171: Fit tab `:398` / `:102`; Transcription `:398,:427` / `:102,:131`; Transcribe `:437` / `:141`; Metadata `:398,:426-427` / `:102,:130-131`; Ribbon and Inspector `:455-456,:558,:568` / `:159-160,:262,:272`; handle `:407-408` / `:111-112`; Clear text `:491` / `:195`; Markup / Annotation `:376,:378,:581` / `:80,:82,:285`; four tabs `:398` / `:102`.

Persisted: `voice/profileStore.ts:72-73`, `destinations.ts:98-121`, `sections.svelte.ts:37,106,190`, `+page.svelte:3473,3664,3686`, `bandState.ts:233`.
