# MEMO. Audit of every ruled string against the tree

**Returned 2026-09-24, read-only, against `apps/web/src/lib/i18n.ts` (1591 lines) at the working tree.** Brief: `docs/sessions/brief-audit-rulings-vs-tree_r1_2026-09-24.md`. The eleven keys in `brief-code-n130-strings_r1_2026-09-24.md` are excluded throughout. Every line number below was read in this run.

## 1. MISSING and KEY GONE

All nine `spec-n131` rows below were ruled by Dann 2026-09-16 (`spec-n131-french_r1_2026-09-16.md:50-56`, *"All French translations otherwise ratified"*). The tree instead carries the desk's second draft of 2026-09-19 (`n131-french_r1_2026-09-19.md:96-152`, "Proposals only"), built in commit `9dfdab8` 2026-09-19. No file records Dann ruling on that second draft, and the 2026-09-19 close lists "the intake and drawer strings in French" as still owed a walk (`docs/sessions/LOG.md:6290-6291`). So the 2026-09-16 ruling is the latest ruling and the tree differs from it.

| key | `i18n.ts:line` | tree text | ruled text | ruling source, date |
|---|---|---|---|---|
| `group.piece` | :53 | fr `Pièce` | « Œuvre » | `spec-n131-french_r1_2026-09-16.md:14, :52-53`, 2026-09-16 |
| `group.input` | :62 | fr `Entrée` | « Saisie » | `spec-n131-french_r1_2026-09-16.md:15, :53`, 2026-09-16 |
| `binder.heading` | :81 | fr `Exportation et importation` | « Exporter et importer » | `spec-n131-french_r1_2026-09-16.md:17, :52-54`, 2026-09-16 |
| `intake.lines` | :646 | fr `%s lignes` | « %s vers » | `spec-n131-french_r1_2026-09-16.md:19, :53`, 2026-09-16 |
| `intake.clear` | :659 | fr `Effacer` | « Retirer » | `spec-n131-french_r1_2026-09-16.md:56`, ruled later 2026-09-16 (*"yes to retirer"*) |
| `intake.dropHint` | :664 | en `Drop the other kind here, or a new file of the same kind to replace it.` / fr `Déposez ici l’autre type de fichier, ou un nouveau fichier du même type pour le remplacer.` | en "Drop your file here." / fr « Déposez votre fichier ici. » (both languages) | `spec-n131-french_r1_2026-09-16.md:56, :63-66`, ruled later 2026-09-16 |
| `intake.pdf.reading` | :672 | fr `Lecture des mots dans le PDF…` | « Lecture des mots du PDF… » | `spec-n131-french_r1_2026-09-16.md:28, :53`, 2026-09-16 |
| `intake.picture.reading` | :691 | fr `Lecture des mots dans l’image…` | « Lecture des mots de l’image… » | `spec-n131-french_r1_2026-09-16.md:31, :53`, 2026-09-16 |
| `paper.empty.mobile` | :716 | fr `Touchez Tiroir au bas de l’écran pour ouvrir le tiroir.` | « Appuyez sur Tiroir au bas de l’écran pour ouvrir le tiroir. » | `spec-n131-french_r1_2026-09-16.md:32, :53`, 2026-09-16 |
| `underlay.heading` | :92 | fr `Placement des paroles` | « Répartition » | `fable-n73-french-strings_r1_2026-08-19.md:3, :11`, ratified whole 2026-08-19. The key is unused since N.114 (`i18n.ts:87-91`); the tree value is a DESK DEFAULT, stated in commit `9dfdab8`'s message. « Répartition » never appeared in `i18n.ts` (`git log -S` empty) |
| KEY GONE: chapter kicker "Chapter %s of %s" / « chapitre %s sur %s » | none, never keyed (`git log -S"chapitre %s sur"` empty) | Learn's kickers read `Section 8` in the component (`LearnContent.svelte:2033, :4038`) | « chapitre %s sur %s » | `fable-n73-french-strings_r1_2026-08-19.md:20`, 2026-08-19. A later ruling of 2026-08-21 (`brief-n77-ship5-french-question-mark_r1_2026-08-21.md:61-66`) made the kicker read "Section N", so this is likely SUPERSEDED rather than missing; whether Dann ruled the French kicker word is NOT ESTABLISHED |

**Caveat on `intake.pdf.reading` and `intake.picture.reading`:** both keys are still used (`ScoreUploader.svelte:389, :439`), so these two are live MISSING rows. The other seven are live too (`group.*`, `binder.heading`, `intake.*`, `paper.empty.mobile` are not marked unused in the file).

## 2. Counts per class per source file

| source | rows | SEATED | MISSING | KEY GONE | SUPERSEDED | excluded (N.130 brief) |
|---|---|---|---|---|---|---|
| 1. `spec-n131-french_r1_2026-09-16.md` (rows 1 to 21, ruled `:50-56`) | 21 | 6 (`drawer.paper`:33, `voice.heading`:95, `input.watermark`:165, `intake.words`:647, `intake.replace`:660, `fit.witness.measureAbbr`:761) | 9 | 0 | 6, rows 12, 13, 14, 15, 17, 18: left N.131 for N.146 (`:56`); N.146 CLOSED 2026-09-17 (`LOG.md:5929`) and did not reuse them (`ScoreUploader.svelte:51`; no call site for `intake.pdf.title/why/poem/score/noText`, `intake.picture.title`). Note `intake.pdf.why`:669 reads « lui-même » where row 13 ruled « seul »; dead key, not counted MISSING | 0 |
| 2. `insights-french_r1_2026-09-19.md` | 59 | counted under r3 | | | 59, superseded as a record by r2 then r3 (`r3:3`); its eight 2026-09-19 rulings (commit `71ae880` message; `r2:6-9`) are all present in the r3 as-built text | |
| 3. `insights-french-as-built_r2_2026-09-22.md` | 59 | counted under r3 | | | 59, superseded by r3 (`r3:3`) | |
| 3b. `insights-french-as-built_r3_2026-09-22.md` (rulings `:13-196`) | 59 | 48, every as-built row ratified 2026-09-22/24 matches the tree, en and fr (`i18n.ts:1458-1516`), checked by script | 0 | 0 | 0 | 11 |
| 4. `e38-n22-french-strings-drafted_2026-08-10.md` (project knowledge, not in `docs/sessions`) | 117 | not audited | | | | drafted, never ruled in-file; see §3 |
| 4. `e42-n34-n35-french-draft_2026-08-12.md` (project knowledge, not in `docs/sessions`) | 29 + 3 | not audited | | | | drafted, never ruled in-file; see §3 and §4 |
| 5. `fable-n73-french-strings_r1_2026-08-19.md` (ratified whole `:3`) | 12 | 5 (`portrait.read`:779, `portrait.thePage`:780, `aid.label`:781, `drawer.pull`:127, `aid.endOfVerse`:784) | 1 (`underlay.heading`) | 1 (chapter kicker) | 5: "Transcription" and "Marked score / Partition annotée" by N.132 ratified 2026-09-13 (`i18n.ts:108-114`, `OPEN.md:1334-1335`); the two slide strings by Finale's wording ratified 2026-08-14 (`i18n.ts:1229-1232`, `shiftLyrics.*`:1238-1240); "Rotate the selection" PARKED, no key (`i18n.ts:1235-1237`) | |
| 5. `spec-loupe-french_r1_2026-09-14.md` (rulings `:15-64`) with `brief-loupe-french-build_r1_2026-09-16.md:20-42` | 10 | 10 (`loupe.beat`:365, `loupe.beatPulse`:366, `loupe.redo`:382 with a literal U+00A0, `loupe.undo.placed`:383, `loupe.undo.startOver`:386, `loupe.undo.melisma`:393, `loupe.undo.melismaOff`:394, `loupe.melisma`:436, `loupe.lyric.melisma`:442, `calib.common.retake`:1006) | 0 | 0 | 0 | |
| 5. `brief-n77-ship5-french-question-mark_r1_2026-08-21.md` (a rule, not strings) | 1 rule | 0 sites in `i18n.ts` with a space or U+00A0 before `?` (three greps, all 0); `Section 8` kicker in place (`LearnContent.svelte:2033, :4038`) | 0 | 0 | 0 | |
| 5. `OPEN.md` RULED/RATIFIED strings (`:141-147`, `:1334-1336`) | 6 | 6 (`intake.placeholder`:631, `intake.caption`:643, `intake.captionLink`:644, `intake.placed`:655, `tab.transcription`:105, `tab.markedScore`:118, `tab.insights`:122) | 0 | 0 | `Melody` / « Mélodie » ratified 2026-09-13, never built and must not be (`PRODUCT.md:165`, `SEQUENCE.md:226`) | |
| 5. `PRODUCT.md` "Strings ruled with their French, 2026-09-10" (`:547-559`) and « Syllabes » (`:819`) | 8 | 4 (`calib.anchor.calibrate`:987, `intake.placed`:655, `notation.state.changed`:72, `loupe.syllables`:404) | 0 | 0 | 3: "Type or paste the poem." and "Drop the score here." by N.121 ruled 2026-09-10 04:50 (`OPEN.md:141-146`, now `intake.placeholder`:631 and `intake.caption`:643); "2 notes corrected" removed by N.149/N.150 (commit `c582892`, no `corrig` string in `i18n.ts`) | 1 NOT ESTABLISHED: "Voix : Dann · 10 sur 10" is composed from `calib.anchor.named`:986 and `voice.state.count`:77, both seated in parts |

Other `docs/sessions/*french*` files (`brief-n78-*`, `memo-n78-*`, `memo-loupe-french-build`, `brief-loupe-french-build`) carry no ruled strings beyond those counted above; the N.78 files rule name forms in data, not `i18n.ts` keys.

**Totals across sources:** SEATED 79, MISSING 10, KEY GONE 1, SUPERSEDED 14 rows plus two superseded whole files (r1, r2), excluded 11.

## 3. Drafted, never ruled

- `n131-french_r1_2026-09-19.md:96-152`, 25 rows, "Proposals only" (`:3`). These are what the tree holds today for the nine MISSING keys above, plus `underlay.heading` « Placement des paroles » (a DESK DEFAULT, commit `9dfdab8`) and `clitic.seated`, `clitic.seatedOne`, `clitic.undo` (unused, `spec-n131:41-43`).
- `e38-n22-french-strings-drafted_2026-08-10.md` §4, about 117 `calib.*` and `profile.*` rows, "Nothing here is in the code... until Dann rules" (closing note). §2's five recomposed keys are in the tree with the drafted French (`i18n.ts:1170-1174`); Dann approved the recomposition, not the French words, in that file.
- `e42-n34-n35-french-draft_2026-08-12.md`, the ten vowel names, the wrapper, 14 captions, 5 error captions and one aria-label, "applied to nothing" (closing note). The vowel names are in the tree (`i18n.ts:1094-1103`) and the tree's own comment says five were "proposals Dann ratified on 2026-08-12" (`i18n.ts:1093`); that ratification is recorded in the tree, not in the source file.
- `spec-n131-french_r1_2026-09-16.md` rows 12, 17, 18 were drafted and withdrawn to N.146 before ruling (`:56`).
- `OPEN.md:150` "Fit to score" / « Ajuster à la partition », marked coined, unruled.
- `insights-french-as-built_r3_2026-09-22.md:174-176`: the English of `fit.heading` "The fit, term by term" is a DESK DEFAULT, not done, awaiting Dann.

## 4. NOT ESTABLISHED

- Whether Dann ever saw or ruled the 2026-09-19 second draft (`n131-french_r1`) that overwrote his 2026-09-16 rulings. No file says so; the commit message of `9dfdab8` does not claim it; the 2026-09-19 close lists those strings as owed a walk (`LOG.md:6290-6291`). If he did rule it verbally and it went unrecorded, the nine MISSING rows become SUPERSEDED.
- Whether « Répartition » for Underlay was later withdrawn. N.114 (2026-09-07/09) removed the station and gave the syllable line no label (`i18n.ts:87-91`), which may make the ruling moot, but no file says the French word was struck.
- Whether the N.73 chapter kicker French (« chapitre %s sur %s ») was superseded by the N.77 "Section 8" ruling or simply never built. Only the English kicker is in the file read (`LearnContent.svelte:2033`).
- The e38 and e42 drafts: whether Dann ruled them elsewhere. They are project-knowledge files, not in `docs/sessions`, and neither carries a ruling record; the tree's comments cite rulings of 2026-08-12 and 2026-08-14 (`i18n.ts:1093`, `:1229-1232`) whose source files were not among this brief's sources. Not audited row by row.
- "Voix : Dann · 10 sur 10" (`PRODUCT.md:559`): whether the composed line renders exactly that; only the parts were checked.
- The 63 `!` and `;` sites without French spacing noted at `OPEN.md` §N.131 (`:503-504`) were not counted here; they are a known open item, not a string ruling.

*Read-only. No git command that writes was run. Files read: the brief, the two code briefs, the five source files, `n131-french_r1`, `fable-n73`, `spec-loupe-french`, `brief-loupe-french-build`, `brief-n77`, grep of every other `*french*` file, `OPEN.md`, `PRODUCT.md`, `STATE.md`, `LOG.md` lines cited, `ScoreUploader.svelte:45-57`, `LearnContent.svelte` greps, `git log` and `git show` of `9dfdab8`, `71ae880`.*

## DANN'S RULINGS ON THESE ROWS, 2026-09-24 evening

- `group.piece`: **« Pièce » stands** (18:47). His 2026-09-16 « Œuvre » is withdrawn. The desk offered consistency with the Insights prose (« cette pièce »). No change to the tree.
- `group.input`: **« Entrée » stands** (18:50). His 2026-09-16 « Saisie » is withdrawn. « Dépôt » was considered and declined on the desk's advice (mirror with "Input"; « dépôt » reads as storage beside « Répertoire »). No change to the tree.
- `binder.heading`: **« Exportation et importation » stands** (18:51). His 2026-09-16 « Exporter et importer » is withdrawn. Nouns, like the drawer's other headings. No change to the tree.
- `intake.lines` and `intake.line`: **« %s lignes » and « %s ligne » stand** (18:52). His 2026-09-16 « %s vers » is withdrawn: the receipt counts lines of text, not verses (Sunless 2's poem arrives as one line). No change to the tree.
- `intake.clear`: **« Retirer » restored** (18:52), his 2026-09-16 ruling reaffirmed. English "Clear" unchanged. `notePicker.clear` stays « Effacer ». **CHANGE TO THE TREE, owed to Code.**
- **18:53, Dann: *"I trust your recommendations for the remaining items. Proceed."*** The desk's recommendations, so ruled:
  - `intake.dropHint`: **his 2026-09-16 ruling restored in both languages**, "Drop your file here." / « Déposez votre fichier ici. » **CHANGE OWED.**
  - `intake.pdf.reading` and `intake.picture.reading`: **his 2026-09-16 rulings restored**, « Lecture des mots du PDF… » and « Lecture des mots de l’image… ». **CHANGE OWED.**
  - `paper.empty.mobile`: **« Touchez » stands, as built.** His 2026-09-16 « Appuyez sur Tiroir… » is withdrawn on the desk's advice: "Tap" is « Touchez » in all seven other strings (`i18n.ts:1068` onward), one term per concept.
  - `underlay.heading`: no change; the key is unused since N.114.
  - The chapter kicker « chapitre %s sur %s »: left as NOT ESTABLISHED (probably superseded by N.77); no change.
