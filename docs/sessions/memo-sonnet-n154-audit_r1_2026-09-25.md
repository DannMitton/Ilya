# N.154 audit — English strings against the app as it now is

Snapshot audited: commit `b2fde8f` (clean), `apps/web/src/lib/i18n.ts` (1,597 lines, 641 keys) plus the components that call `t()`/`T()` against it. Read in full; every reference claim below was checked with `grep` against `apps/web/src`, not assumed from a comment.

## Count summary

| | count |
|---|---|
| Total dictionary keys | 641 |
| Live surfaces established (step 1) | 5 tabs, 3 drawer groups, ~14 drawer/station headings, plus Loupe/Correction/Calibration/Insights sub-surfaces (see below) |
| Live strings confirmed stale (name/describe something the code no longer has) | 3 |
| Dead keys confirmed (zero live reference, incl. dynamic-key checks) | 62, listed below |
| Code comments checked for staleness (step 5) | 3; none found stale |

## Step 1: the surfaces a singer can actually reach

- **Tab bar** (`DeskHead.svelte:53-65`), five destinations: `transcription` → `tab.transcription` ("Text"), `shane` → `tab.markedScore` ("Markup"), `insights` → `tab.insights` ("Insights"), `learn` → `tab.learn` ("Learn"), `guide` → `tab.guide` ("Guide"). Confirmed against `destinations.ts:46` (`TabId` union) and `+page.svelte:2090` (`TAB_ORDER`). There is no sixth tab and no tab renders the string "Fit".
- **Drawer groups** (`Drawer.svelte:516,539,553`): Piece (`group.piece`), Input (`group.input`), Score markup (`group.scoreMarkup`, labelled "Voice" since N.150).
- **Drawer stations**, confirmed by call site: Source (`source.heading`, `IntakePanel.svelte`), Metadata fields (`meta.title/opus/composer/poet/translator/reset/revertToScore/fromScore`, `MetadataFields.svelte`), Notation/Cosmetic options (`cosmetic.*`, `NotationFields.svelte:116-222`), Analysis/Word Console (`console.placeholder`, `AnalysisStation.svelte`), Correction controls (`correct.*` individual buttons, `CorrectionSurface.svelte`), Voice anchor line (`calib.anchor.*`, `VoiceAnchor.svelte`), Export/import (`binder.heading/export/import/exportFirst`, `RootPanel.svelte:150`), Repertoire/song list (`songs.*`, `SongList.svelte`).
- **Markup document** (`shane` tab): `CorrectionSurface.svelte` (the Loupe's four stations — Duration, Pitch, Accidental·Entry, Lyric — consolidated under one "Corrections" header per the 2026-08-27 ruling recorded at `i18n.ts:504-508`), `TextualWitnesses.svelte` (`fit.witness.*`), `analyze-score-adapter.ts` (`fit.broad.*`).
- **Voice pane / calibration**: `VoiceProfilePane.svelte` (`profile.*`), `CalibrationWizard.svelte` (`calib.*`), `Pacifier.svelte` (`pacifier.*`, `vowel.name.*` built dynamically as `` `vowel.name.${g}` ``).
- **Insights document**: `InsightsPane.svelte` (`insights.*`, with `insights.flag.*` built dynamically as `` `insights.flag.${flag}` ``).

No surface anywhere is named "Fit." The engine's internal codename for the Markup document is the literal string `'shane'` (`destinations.ts`), never rendered.

## Live stale strings

| Key | i18n.ts line | Current English | What's wrong | Evidence |
|---|---|---|---|---|
| `calib.welcome.lede` | 1056 | "**Fit** will measure your voice to build a formant profile, which is a map of your voice's resonances that will be applied to your repertoire to determine how well it suits your voice…" | Names "Fit" as the actor doing the measuring. Fit was folded into the Voice pane and the Markup document; there is no surface called Fit for this sentence to refer to. The wizard is part of Voice calibration, not a separate tool. | Rendered at `CalibrationWizard.svelte:1257`. No tab, station, or component in the tree is named "Fit" (see Step 1). |
| `calib.welcome.fryAnswer` | 1058 | "A low, creaky voice register, easy to sustain and gentle on the voice. **Fit** reads its resonances rather than your sung pitch, so comfort matters more than pitch here." | Same problem: attributes the fry-reading behaviour to "Fit." | Rendered at `CalibrationWizard.svelte:1265`. |
| `a11y.paper` | 145 | "Transcription" (screen-reader-only region name for the paper/score view) | This is the tab's pre-N.132 name. `tab.transcription`'s own visible text was changed to "Text" on 2026-09-13 (comment at `i18n.ts:109-111`: `"Text"` and `«Texte»` for `'tab.transcription'`, ratified by Dann). `a11y.paper` was not updated with it, so a screen-reader user hears the region called "Transcription" while every sighted singer sees the tab labelled "Text." | Rendered at `Paper.svelte:63` (`aria-label={t('a11y.paper', language)}`). `tab.transcription` at `i18n.ts:105` reads `'Text'`. |

**PROPOSAL** for `calib.welcome.lede` (voice in the register of neighbouring `calib.*` strings, which name Ilya as the actor and describe the wizard plainly, e.g. `calib.switcher.firstLaunchLede`):

> "This wizard will measure your voice to build a formant profile, which is a map of your voice's resonances that will be applied to your repertoire to determine how well it suits your voice. Follow the prompts. This wizard assumes you read IPA. Your device needs a working mic and you should be in a quiet space for the best capture of your resonances."

**PROPOSAL** for `calib.welcome.fryAnswer`:

> "A low, creaky voice register, easy to sustain and gentle on the voice. Ilya reads its resonances rather than your sung pitch, so comfort matters more than pitch here."

(I did not propose French for either, per instruction.)

**PROPOSAL** for `a11y.paper`: `'Text'` — the plain word `tab.transcription` already carries, so the spoken name agrees with the printed one. This is a smaller change than it looks: it's one string, spoken only, never printed (per the file's own note at `i18n.ts:141`).

I looked for other live strings naming "Fit" and found none: `grep -n "en: '[^']*\bFit\b[^']*'" apps/web/src/lib/i18n.ts` returns only `tab.fit` (dead, below) and the two `calib.welcome.*` keys above. The `fit.broad.*` and `fit.witness.*` families (Markup document, live) and the lower-case "repertoire fit" wording in `profile.lede`, `profile.scoreRegionAria`, `calib.characteristics.lede`, and `insights.fit.heading` describe the fit-analysis *concept*, not a defunct tool named Fit, and are rendered inside surfaces that do exist (Voice pane, Insights). I did not flag these.

**Out of scope but worth a note**: `GuideContent.svelte` (English, ~line 553; French, ~line 276) contains a hand-written, non-i18n.ts sentence, "Fit's analysis model implements the open and close timbre markup…", inside prose text, not a dictionary key. It has the same root problem as the two rows above but sits outside `i18n.ts` and this audit's scope. Flagging it here so it isn't lost; NOT individually verified against the Guide's surrounding paragraphs.

## Dead keys (zero live reference, `i18n.ts` excluded from the search; dynamic-key call sites — `` `vowel.name.${g}` ``, `` `insights.flag.${flag}` ``, `LEGEND_KEYS` in `provenance.ts` — checked and excluded from this list)

Already self-marked "unused"/"legacy"/"deleted"/"retired"/"parked" in the file's own comments, and confirmed by grep:
- `underlay.heading` (1 key; comment: unused since N.114)
- `input.placeholder`, `input.clear`, `result.words` (unused since N.108 increment 2)
- `clitic.seated`, `clitic.seatedOne`, `clitic.undo` (unused since N.108-5)
- `upload.drop.title`, `upload.drop.browse`, `upload.drop.acceptedNow`, `upload.drop.release`, `upload.drop.placeholder` (drop zone gone, N.108 increment 2)
- `upload.scanTooltip` (photograph button gone, N.108 increment 4)
- `calib.compact.vowelsSampled` (wizard's compact row gone, N.114b item 8)
- `insights.phonation.tempoPointer` (written, not shown — Loupe tempo control doesn't exist yet)
- `insights.figure.rangeLabel`, `insights.figure.captionFocus` (unrendered since Insights r2)
- `input.transcribe`, `input.transcribeLoading` (the one Transcribe button was removed, N.145; confirmed only in a comment at `IntakePanel.svelte:534-537`)

Confirmed dead by grep, **not** self-marked unused in `i18n.ts` (worth a second look against the file's own convention of marking retired strings in place):
- `tab.fit` — the seed finding. Only self-reference is its own comment block (`i18n.ts:97-117`).
- `meta.heading`, `correct.heading`, `shiftLyrics.title`, `engraving.heading`, `engraving.staveSize`, `engraving.noteSpacing`, `engraving.systemSpacing`, `engraving.reset` — the Engraving controls panel was removed by ruling 2026-07-15 (`+page.svelte:4623-4625`: "The EngravingControls panel is removed and the stave target is fixed"), and `shiftLyrics.title` lost its heading role while its child aria-labels (`shiftLyrics.forwardAria/backAria`) stayed live.
- `notation.heading`, `notation.reducedVowel(.desc)`, `notation.palatalNasal(.desc)`, `notation.geminates(.desc)`, `notation.shcha(.desc)`, `notation.reconstitution(.desc)` — the whole block the file's own comment (`i18n.ts:224`) calls "Legacy notation keys (kept for backward compatibility)"; superseded by the live `cosmetic.*` block.
- `display.heading`, `display.stressDiacritics`, `.left`, `.right`, `.desc` — the file's own "Legacy display keys" block (`i18n.ts:219`), same supersession.
- `intake.pdf.title`, `intake.pdf.why`, `intake.pdf.poem`, `intake.pdf.score`, `intake.pdf.noText`, `intake.picture.title` — **not** marked unused, but genuinely dead: N.146 (2026-09-16) removed the "is this the poem or the score?" question entirely (`ScoreUploader.svelte:41-53`, `staff-detect.ts:4-5`: "Every PDF and picture used to ask which it was… This answers instead"). `intake.pdf.reading` and `intake.picture.reading` (the busy-label strings) are still live; the question-and-answer strings around them are not.
- `loupe.station.pitch`, `loupe.station.accidental` — the base "Pitch" and "Accidental · Entry" station headers. The four-stations comment at `i18n.ts:395` reads as if all four still print separately, but the ruling recorded lower in the same file (`i18n.ts:504-508`) consolidated them under one "Corrections" header; only `loupe.station.duration` (tuplet-disclosure override) and `loupe.station.lyric` still render as their own labels.
- `station.startOver` ("Start placement over") — superseded by `loupe.undo.startOver` ("placement started over") on the Loupe's undo pill; confirmed at `+page.svelte:667`.
- `dict.words`, `dict.inflections` — only `dict.loading` renders (`AnalysisStation.svelte:88`); the word/inflection counts never print.
- `app.subtitle` — `app.html:13` hardcodes `<title>Ilya — Russian Lyric Diction</title>` as a literal, not through this key.
- `drawer.expand` — only `drawer.collapse` is called (`CorrectionSurface.svelte:531`), reused there as a dock-close label.
- The entire `stress.*` family (`stress.dictionary`, `.supplement`, `.yoRule`, `.yoRestored`, `.inferred`, `.unknown`, `.userDictionary`, `.userComposer`, `.userOverride`) — reachable only through the exported function `stressSourceLabel()` in `i18n.ts`, and that function itself has zero call sites anywhere in `apps/web/src`. Superseded by the live `inspector.stressAssign.*` keys in `InspectorPanel.svelte`.
- `provenance.dictionary`, `.supplement`, `.yo`, `.inferred`, `.unknown` — commented "for Inspector inline display" but no call site found, live or dynamic.
- `legend.inferred` — the sibling keys `legend.yo`, `legend.user-dictionary`, `legend.user-composer`, `legend.user-override`, `legend.spot-reconstitution` **are** live, reached dynamically through `LEGEND_KEYS` in `provenance.ts:118-124` — but `'inferred'` is not one of the five entries in that map, so this one sibling is dead while the rest are not.
- `inspector.stress`, `inspector.clitic`, `inspector.blurbs`, `inspector.provenance`, `inspector.notationDefault`, `inspector.unknownStress`, `inspector.glossMissing`, `inspector.cliticArrow.encliticLabel`, `inspector.cliticArrow.procliticLabel`, `inspector.cliticArrow.encliticBlurb`, `inspector.cliticArrow.procliticBlurb`, `inspector.spotRecon.heading`, `inspector.spotRecon.left`, `inspector.spotRecon.right`, `inspector.spotRecon.globalOn` — `InspectorPanel.svelte` calls `inspector.cliticArrow.enclitic`/`.proclitic` (the arrow aria-labels) but none of these fourteen sibling keys; they read as a removed explanatory/blurb layer of the panel.
- `correct.length`, `correct.none`, `correct.selected` — the individual correction buttons (`correct.dot`, `correct.stepUp`, etc.) are all live in `CorrectionSurface.svelte`; these three framing strings are not.
- `upload.continue` — no call site found.
- `meta.textBy`, `meta.transcriber` — `MetadataFields.svelte` renders title/opus/composer/poet/translator/reset/revertToScore/fromScore, not these two.

## Comments checked (step 5)

- **`i18n.ts:634`** (inside the `intake.caption` comment block): "…this one says what else the empty field takes, and that one says what a second file does to a field that already holds something." Checked against `IntakePanel.svelte:404` (`{#if !sourceIsEmpty || score}` → draws `intake.dropHint`) and `:429` (`{#if sourceIsEmpty && !score}` → draws `intake.caption`), with `sourceIsEmpty = inputText === ''` (`IntakePanel.svelte:150`). The guards match the comment's description exactly. No staleness found.
- **`IntakePanel.svelte:400`**: "The copy is `intake.dropHint` unchanged in both languages…" — true; `intake.dropHint`'s English and French are unchanged since N.114a per the surrounding block, and it is the string drawn at line 405.
- **`IntakePanel.svelte:415`**: "…says what else the EMPTY field takes, and `intake.dropHint` says what a second file does to a field that already holds something." Same guard check as above. No staleness found.
- **Page-reader "runs only once"**: no comment with that literal phrasing exists. The closest candidate, `page-reader.worker.ts:255` ("Instantiate Pyodide, the packages, and the reader once on startup"), is accurate as far as I could trace it: `WorkerPageReader` (`page-reader.ts:76-90`) is constructed lazily on first use and reused across reads within a component instance ("NOT RESTARTED ON FAILURE," `page-reader.ts:15-18`); `ScoreUploader.svelte:184` memoizes it (`pageReader ??= new WorkerPageReader()`) and disposes it only `onDestroy` (`:185-188`). I did not find a second worker instantiation path. No staleness found, but see "What I could not establish" below.

## What I could not establish

- Whether `paper.empty` ("Enter your Cyrillic text in the drawer on the left.") still correctly names the drawer's side. I found consistent "on the left" language in sibling strings (`profile.provisional.sentenceSingular/Plural`) and no comment describing a side-swap, but I did not trace the current desktop CSS layout order to confirm the drawer is still visually on the left. NOT ESTABLISHED.
- Whether any component constructs an `i18n.ts` key by string concatenation or prefix in a way my searches (literal quoted keys, plus the three template-literal patterns I found and checked: `` `vowel.name.${g}` ``, `` `insights.flag.${flag}` ``, and `LEGEND_KEYS`) missed. I did not find a fourth such pattern, but I did not read every `.ts` file in `apps/web/src/lib/shane/` line by line, so a rarer construction (e.g., built inside a `.ts` module rather than a `.svelte` file, or assembled through an object literal rather than a template string) could exist unseen. Any key in the dead list above should be treated as "no reference found," not "proven unreachable."
- The out-of-scope `GuideContent.svelte` "Fit's analysis model" sentence noted above: I did not check it against the rest of the Guide's prose for internal consistency or for other similar mentions elsewhere in that file's ~500+ lines of English/French copy.
- I did not verify every one of the roughly 580 keys that DID show up as referenced by my search; a handful of those references could themselves be inside dead code paths (e.g., a component that is imported but never mounted). Step 1's surface list should catch the major cases (Fit, Underlay, the old drop zone, the PDF/picture question), but a smaller, mounted-but-unreachable branch is possible and NOT ESTABLISHED either way.
