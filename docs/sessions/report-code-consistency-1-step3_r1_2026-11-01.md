# Report: consistency batch 1, step 3 (the screen words), r1, 2026-11-02

Branch `cloud-lane-24`, on top of step 2. Brief: `brief-code-consistency-1-screen-words_r2_2026-11-01.md` (its r2 section and Dann's six rulings win), Fable's 17 amendments (`review-fable-brief-consistency-1_r1_2026-11-01.md`), and Part 1 of `review-fable-style-guides_r1_2026-11-01.md`. This commit holds only the ruled French. Every other French change is in the next commit, "French drafts for Dann".

## What changed, file by file

- `apps/web/src/lib/i18n.ts` (values, both languages):
  - Tabs: `tab.text` TEXT / TEXTE, `tab.markedScore` MELODY / CHANT, `tab.insights` INSIGHTS / APERÇUS, `tab.learn` LEARN / LEÇONS, `tab.guide` GUIDE / GUIDE. Comment above `tab.markedScore` says MELODY / « CHANT », ruled 2026-10-31 20:07, keys unchanged until batch 3 (amendment 14).
  - The page (ruling 3): `drawer.paper` and `a11y.paper` read "the page" / « la page », lower case. The pull reads DRAWER / TIROIR (`drawer.pull`).
  - Named places in capitals (ruling 1), the value carries the capitals: `group.piece` PIECE / PIÈCE, `group.scoreMarkup` VOICE / VOIX, `group.input` INPUT / ENTRÉE, `voice.heading`, `cosmetic.heading` and `notation.heading` NOTATION, `songs.heading` REPERTOIRE / RÉPERTOIRE, `binder.heading` EXPORT AND IMPORT / EXPORTATION ET IMPORTATION, `underlay.heading`, `inspector.dictionary`, `console.placeholder` ANALYSIS / ANALYSE, `intake.view.poem` and `witness.poemLabel` POEM / POÈME, `intake.view.lyrics` LYRICS / PAROLES, the LOUPE stations DURATION / DURÉE, PITCH / HAUTEUR, ACCIDENTAL · ENTRY / ALTÉRATION · SAISIE, CORRECTIONS, `loupe.syllables` SYLLABLES / SYLLABES, and the station prefix in `loupe.station.pitchTakes` and `.pitchMiddle`.
  - Ruling 4: `loupe.station.lyric` UNDERLAY / PLACEMENT DES PAROLES; `loupe.station.lyricTake` "UNDERLAY · take a note to shift its syllable" / « PLACEMENT DES PAROLES · prenez une note pour décaler sa syllabe ».
  - In-sentence mentions: LYRICS / POEM / « champ PAROLES » / « champ POÈME » / « champ ENTRÉE » / « dans PAROLES » (11 keys: `intake.view.poemLine`, `.landedLyrics`, `.landedPoem`, `intake.poemReplace.body`, `upload.banner.reader`, `.noLyrics`, `.noLyricsScan`, `.wordsPartlyRead`, `.wordsPartlyReadOne`); the LOUPE in `insights.phonation.tempoPointer`; the DRAWER / TIROIR in nine keys (`paper.empty`, `paper.empty.mobile`, `profile.provisional.*`, `placeholder.line.*`); INSIGHTS / APERÇUS in `insights.identity`, `.identityUncalibrated`, `voiceIntake.intro`, `voiceIntake.topics.stem`; MELODY in `calib.characteristics.lede` and `profile.lede` (English only).
  - `profile.scoreRegionAria` reads "Melody" / « Chant », mixed case (ruling 2).
  - The Spot pair (`inspector.spot.reduction`, `.reconstitution`, the keys step 1 made): « Réduction ponctuelle », « Reconstitution ponctuelle ». `legend.spot-reconstitution` and LEARN already read « ponctuelle ». « Réduction » and « Reconstitution » are both feminine, so « ponctuelle » holds.
  - `toc.guide.markup-notation`: "The notation conventions used by MELODY" / « Les conventions de notation utilisées par le CHANT » (ruling 5, mirrors the Guide heading).
- `apps/web/src/lib/components/Reading/LearnContent.svelte` (4096 lines, unchanged; ceiling 4099): `<h1>` LEARN / LEÇONS; « l'onglet GUIDE » (`:39`) and "the GUIDE tab" (`:2080`); INPUT / ENTRÉE fields (`:677`, `:751`, `:2046`, `:2718`, `:2792`, `:4056`); NOTATION and the DRAWER / TIROIR in `:996`, `:2002`, `:2018`, `:2050`, `:3028`, `:3037`, `:4012`, `:4028`, `:4060`. English `<em>legato</em>` at `:2788` (the French sets it italic at `:747`).
- `apps/web/src/lib/components/Reading/GuideContent.svelte`, the six lines (amendment 1): `:80` heading (French, ruled), `:376` heading, `:378` ("MELODY draws"; "INSIGHTS describes"), `:581` ("MELODY and INSIGHTS implement"). Each is a single-line substitution; no line added. `:82` and `:285` are French drafts (next commit).
- `apps/web/src/lib/components/DeskHead.svelte`: the comment at `:60-63` now says MELODY and « CHANT » (amendment 14).
- Pins changed with their strings (CONTRACT §1 item 11a): `analysis/placeholder-line.test.ts`, `i18n.test.ts` (`a11y.paper`, `loupe.station.corrections`), `insights/identity.test.ts`, `insights/insights.test.ts`, `insights/ratified-lines.test.ts`, `markup/profile-status.test.ts`, `score/no-lyrics-notice.test.ts`, `score/scan-notice.test.ts`, `components/Reading/learn-opening.test.ts`, `no-fit-name.test.ts` (the two English pins; the two French pins wait for the drafts).
- e2e: the 12 name-based sites follow the new labels (`e2e/clef-controls.test.ts`, `e2e-phone/clef-controls.test.ts`, `e2e-phone/loupe-scan.test.ts`, `e2e/loupe-head-caret.test.ts`, `e2e/singer-paths.test.ts`); `e2e/helpers.ts` `expandStation` now matches the whole station name without regard to case, because `exact: true` is case-sensitive and every caller passes "Piece", "Voice", "Analysis", "Notation", "Repertoire". That is one edit instead of about 20.

## Every place a tab name is drawn, and the key it reads

| place | file | key |
|---|---|---|
| the tab bar | `DeskHead.svelte:59-68` | `tab.text`, `tab.markedScore`, `tab.insights`, `tab.learn`, `tab.guide` (CSS capitals stay, now redundant) |
| the LEARN and GUIDE contents headings | `Drawer.svelte:560`, `:730` | `tab.learn`, `tab.guide` (step 1) |
| printed running head, TEXT | `TitlePage.svelte:155`, `SubsequentPage.svelte:81` | `tab.text` |
| printed running head, MELODY | `MarkupPane.svelte:955` (drawn `:1001`, `:1023`, `:1044`, `:1087`) | `tab.markedScore` |
| printed running head, INSIGHTS | `InsightsPane.svelte:526`, `:619` | `tab.insights` |
| accessible name of the page region | `Paper.svelte:70`, `TextWitnessPair.svelte:34` | `a11y.paper` ("the page") |
| accessible name of the tablist | `DeskHead.svelte:113` | `a11y.tabs` (unchanged) |
| accessible name of the MELODY region | `MarkupPane.svelte` (`profile.scoreRegionAria`) | `profile.scoreRegionAria` ("Melody" / « Chant ») |
| accessible name of the INSIGHTS page | `InsightsPane.svelte` | `insights.pageAria` (unchanged, mixed case) |
| the document `<title>` | `apps/web/src/app.html:45` | none: the static text "Ilya — Russian Lyric Diction", no tab name; not read through a key |

The running head is capitals for TEXT in the printed page (screenshot: `docs/sessions/report-code-consistency-1-step3-print-text-head_2026-11-02.png`, print media, TEXT). `RunningHeader.svelte` has no CSS capitals of its own, but the screenshot shows capitals; `ReadingPaper.svelte:145` and `:440` set `text-transform: uppercase`. I did not capture a before screenshot, and I did not capture MELODY or INSIGHTS: NOT ESTABLISHED whether their heads read in mixed case before.

## Gates

| gate | result |
|---|---|
| web check | `svelte-check found 0 errors and 12 warnings in 5 files` |
| web test | `Tests  3789 passed \| 1 skipped (3790)` (baseline 3784 plus the 5 from step 2) |
| `pnpm ratchets` | `ratchets: OK.` |
| e2e, chromium: `singer-paths`, `clef-controls`, `loupe-head-caret`, `core-loop`, `typed-hyphens`, `text-witness-tools` | 6 and 7 and 23 passed; one failure, below |
| e2e, phone: `clef-controls`, `loupe-scan` | 4 passed, 1 skipped (as in the suite) |

The one e2e failure is `singer-paths.test.ts:169`, the stale pin Fable named: `:180` expects « pour chanteurs » and LEARN reads « pour chanteuses et chanteurs » (`LearnContent.svelte:19`). Reported, not fixed. I ran e2e on the changed tree only; I did not run it at `6f740dbf`, so I cannot say it passed there. Not re-run: phonology, dictionary, score-parser, blurb, integration (untouched).

## Counts

| | before | after |
|---|---|---|
| "Markup" / « Annotation » in `i18n.ts` values a singer reads | 4 EN, 4 FR | 0 EN, 2 FR (the two drafts) |
| the same in the six Guide lines | 3 EN, 3 FR | 0 EN, 2 FR (the two drafts) |
| unread keys that still carry a retired name | 5 groups | the same 5 (amendment 17): `input.transcribe`, `input.transcribeLoading`, `input.clear`, `meta.heading`, `inspector.spotRecon.*` |

## Decisions and judgement

1. **Station names whose value reads as a heading or label only** take capitals in the value. CSS capitals already showed them; the value now agrees (the printed page, tests, and a screen reader see one word).
2. **`binder.heading`** is "EXPORT AND IMPORT" / « EXPORTATION ET IMPORTATION », all capitals including "AND" / « ET ». JUDGEMENT: the heading is the name. Dann may prefer the conjunction in lower case.
3. **`drawer.collapse`, `drawer.expand`, `a11y.drawer`** are accessible names and keep ordinary case (ruling 2).
4. **"Transcribe" in LEARN stays.** The exercises say "Transcribe ⟨хорошо⟩" and « Transcrivez » as an ordinary verb (about 25 sites), not the retired button. Plan r2 item 4 names « Transcrire » as an ordinary-word collision. Dann may want a different verb.
5. **"Shift Lyrics"** (`shiftLyrics.title`) and the calibration anchor "Voice: not yet calibrated" (`calib.anchor.*`) are left alone: not established that they name the place.
6. **The Guide's `<h1>Guide</h1>` (`GuideContent.svelte:17`, `:312`) stays mixed case** while LEARN's `<h1>` is now LEARN. The Guide is row 171's. Amendment 10 (f): `toc.guide.markup-forecast` ("Insights forecasts, it does not declare") and « Les Aperçus prévoient » mirror Guide headings at `GuideContent.svelte:65`, `:361`; I left both to row 171 so the label keeps mirroring its heading.
7. **`Drawer`, `Text`, and the page.** The brief's amendment 9 and Fable's draft style guide say lower case for the drawer; ruling 1 (22:12) says DRAWER / TIROIR. The ruling won. Three LEARNs now stack on screen (the tab, the contents heading, the `<h1>`): legible, redundant, not this batch's to resolve (amendment 10 i).
8. **The spoken collision** between « le CHANT » and « ce chant » has no fix in capitals; the draft style guide should record it as a known limit (amendment 10 h). I did not edit the style guide.
9. **Foreign-term italics.** The one term the brief names, *zona di passaggio*, does not occur in LEARN. I compared the English and French LEARN for terms the French sets italic and the English does not: `legato` was the only one (done). `achlaut` at table row `:148` (French) and `:2189` (English) is plain in both; left as is.

## NOT ESTABLISHED

- A pronoun referring back to « l'Annotation » beyond the lines read in the drafts commit.
- Whether any screen reader spells TEXT, LEARN, or CHANT letter by letter.
- A visual check of the drawer's bands, the LOUPE's station labels, and the stacked LEARN headings after the change: I measured only the printed TEXT head.
- Whether `loupe.station.lyric`'s old key now misdescribes its content (key kept; batch 3 renames).

## Follow-up (same day, separate commit)

I missed one mention of the TEXT document in the six Guide lines: `GuideContent.svelte:378`, "imported from Text", now "imported from TEXT", with its pin in `no-fit-name.test.ts`. The French counterpart (`:82`, « importées du Texte ») sits on a draft line and is in the French drafts commit. Two other Guide mentions of the TEXT tab (`:38` « l'onglet Texte », `:333` "choose Poem in Text") are outside the six lines and stay row 171's.
