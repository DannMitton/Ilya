# Audit B: are these 22 Code briefs built in the tree?

Tree read: `/home/claude/tree/` (working tree, uncommitted changes included). Paths below are relative to `apps/web/src/` unless they start with `packages/`, `tools/`, `docs/` or `scripts/`. Nothing under the tree was changed. No test, build or browser could be run here, so gate counts and on-screen behaviour are taken from the reports only and are listed under "What I could not establish".

Later rulings were checked in `docs/memory/OPEN.md`, `PRODUCT.md`, `STATE.md`, `QUEUE.md` and `docs/sessions/LOG.md`. Where a later ruling changed a brief, the tree was checked against the later ruling.

## Verdict table

| # | Brief | Verdict | One-line evidence |
|---|---|---|---|
| 1 | n174-d3-names-and-words r1 | DONE | No old voice variables, old CSS classes or `data-fit-page` anywhere (empty greps). `lib/guide-anchors.ts:10-12` maps old anchors; `routes/+page.svelte:4016-4018` reads and `replaceState`s; `routes/notation-font-lab/+page.svelte:50,54`; `lib/wall.ts` reads one name; `MNX_T08_PATH` at `mnx-parser.test.ts:648`; `ARCHITECTURE.md:9` history line. |
| 2 | n82-seat-watch-band r1 | DONE | 44 `watch.*` keys at `lib/i18n.ts:1771-1820`, French matches the ratified draft. `analysis/watchlist.ts:578-690` composes from keys, IPA in `[ ]`. Heading later renamed by a ruling (see below). |
| 3 | n94-key-ruler r1 | DONE | `engraveInKey` at `packages/score-parser/src/transposition.ts:331`, with the triple-accidental and double-accidental tests (`transposition.test.ts:392-470`). All nine ratified strings at `lib/i18n.ts:1823-1831`. Ceilings `MarkupPane` 1302 and `+page` 6016 are under 1358 and 6028. |
| 4 | n94-slice2 r1 | DONE | Seven strings at `lib/i18n.ts:1848-1854`, twin tests at `markup/transposition-ruler.test.ts:115-181`, `TranspositionDock.svelte`, `InsightsPane.svelte:505` and `:1054` (inline pill), dock reserve at `TranspositionDock.svelte:98`. |
| 5 | phonation-time r1 | DONE, two items amended | Section, headline, per-finding seconds, tempo states all present. Zone strings 5 to 7 and the row 8 heading were replaced by later rulings (tessituragram; fixed vowel order). Tree matches the later rulings. |
| 6 | phone-photo r1 | DONE | Diagnosis-only brief ("stop before any build"). The memo is on file. Its cited `staff-detect.ts` `rowGate: 0.4` is at `lib/reader/staff-detect.ts:46`. No decoder was added (`package.json` has no `heic2any` or `libheif`). |
| 7 | photo-messages r1 | DONE | `upload.err.pictureUnclear` and `upload.err.imageHeic` at `lib/i18n.ts:961-962`, exact ratified text. `isHeifImage` at `lib/score/ingestion/format-detection.ts:121`. Helper at `ScoreUploader.svelte:488`, used at `:355` and `:595`. |
| 8 | tessituragram-fit r1 | DONE | `InsightsPane.svelte:270-352`: measured fit loop, page two only when earned (`hasPageTwo`, line 352). `crossingsUncounted` printed once (`:666`). No `insights.phonation.zone*` keys remain. |
| 9 | tessituragram-fix r1 | DONE | `packages/score-parser/src/vocal-octave.ts:51-73` (no double shift); tests at `vocal-octave.test.ts:71,78` and `insights.test.ts:298`; `insights.phonation.byVowelShare` at `lib/i18n.ts:1553`. |
| 10 | tessituragram r1 | SUPERSEDED | Replaced in part by `brief-code-tessituragram_r2_2026-09-23.md` (circled numbers, two-tone focus segment, paired thin bars, range field, inner frame all struck). The r1 items r2 kept are present: strings at `lib/i18n.ts:1574-1586`, unit on page one, `chooseClefForSpan` (`clef-select.ts:76`). |
| 11 | tessituragram r2 | DONE | `insights/Tessituragram.svelte` implements every r2 item (see section below). `insights.phonation.byVowel` reads "Seconds of phonation per vowel" (`lib/i18n.ts:1550`). |
| 12 | two-save-fixes r1 | DONE | Fix 1 at `routes/+page.svelte:2741-2742`; Fix 2 at `lib/library/document.svelte.ts:328-335`; `lib/library/remote-write.test.ts` exists. Fix 1 has no vitest, which the brief allowed (see note). |
| 13 | vowel-chart-all-ten r1 | DONE | All five findings present (detail below). |
| 14 | watch-band-says-less r1 | PARTIAL | Four fixes present and the gates built (`analysis/gates.ts`, used by `markup/MarkupPane.svelte:839-840`). One item missing: Insights does not call the gates. |
| 15 | grayson-soft-ts-sh r1 | DONE | `packages/phonology/src/lexical-palatalization.ts` (lemma lists), used at `engine.ts:1570`; tests for цвет, цветок, революция, декламация, пшют, лекция, цирк at `tests/lexical-palatalization.test.ts:55-135`. |
| 16 | reconstitute-interpalatal-ya r1 | DONE | Rule at `lib/reconstitution.ts:79-84`; new `lib/reconstitution.test.ts` with the я cases (`:53-74`), е rule, `я to ɑ`, stressed я. |
| 17 | richter-credit-wording r1 | DONE | `footer.richter` at `lib/i18n.ts:739-742` is exactly the ratified English and French. `RICHTER_CITATION` has no match anywhere (empty grep). |
| 18 | n154-seat-strings r1 | DONE | All twelve rows seated (detail below). No "Transcription tab" text remains in Learn or Guide prose. |
| 19 | n168-passaggio r1 | DONE, outputs not checkable | `tools/n168-frequency-run/frequency-run.run.ts:94`: Mitton primo A♭3, secondo D♭4, cited. The memo has the addendum (`memo-code-n168-frequency-run_r1`, "Addendum, 2026-09-23"). The regenerated `out/` files are not in the tree. |
| 20 | n168-six-voices r1 | DONE, outputs not checkable | Six profiles at `frequency-run.run.ts:226-273`, values match the brief; per-note CSV and P1a writers at `:978-993`. Memo has "Addendum 2". `out/` is not in the tree. |
| 21 | undo-cleared-on-song-switch r1 | DONE | `clear` at `lib/score/undo-history.svelte.ts:136`; called at `routes/+page.svelte:3577` as `switchSong` begins; tests at `undo-history.test.ts:166,186`. |
| 22 | n171-hash-fold r1 | DONE | `withDictionMarksFolded` called at `lib/score/ingestion/ingest.ts:304`, defined `:322`; `vowelResolverAbstentions` used at `lib/score/vowel-resolver.ts:613`; `analysis/diction-fold-live.test.ts` (8 tests); comment updated at `analysis/score-metrics.ts:50-53`. |

## PARTIAL: brief 14, watch-band-says-less

The brief as amended (its 16:28 update) says the fixed count of three is withdrawn and the desk is to build the gates from `docs/sessions/draft-curation-rules_r1_2026-09-24.md`, "one set of gates for Markup's box and Insights".

Present:
- Fix 1, heading: `markup/NotesColumn.svelte:187-196` (14 px, weight 600, `--lavender-ink`).
- Fix 2, nothing clipped: `markup/notes-pages.ts` and `NotesColumn.svelte`, with `notes-pages.test.ts`.
- Fix 3, bare words: `analysis/watchlist.ts:622` (`bareWord`).
- Fix 4, no duplicate line: `watchBandLines`, `analysis/watchlist.ts:680-690`.
- The gates: `analysis/gates.ts` (`stakesThreshold: 2` at `:60`, strict gate 2, page limit withdrawn per draft r5), called from `markup/MarkupPane.svelte:839-840`.

Missing:
1. **Insights does not use the gates.** Evidence: `grep -rn "gates'\|gateBand\|applyGates\|gatedLines" lib/insights routes` returns nothing. The only caller outside `gates.ts` is `MarkupPane.svelte:839-840`. The module's own header says Insights "is to call the same function" (`analysis/gates.ts:23`), and Code's report says "Insights does not call it yet ... waits for Dann's look at this box" (`docs/sessions/report-code-n173-gates_r1_2026-09-28.md:63`). This was a stated hold, not an oversight, but the ruling of 16:28 is that one set of gates serves both documents, so it is not built yet.

Superseded inside this brief (not counted as missing): the "three hardest spots" rule (withdrawn 16:23) and the page limit (gate 5, withdrawn in draft r5 at 20:24). The box heading in the tree is "For your consideration" / « À considérer » (`lib/i18n.ts:1771`), which a later ruling of 2026-09-28 19:47 to 19:48 (`docs/memory/PRODUCT.md:912`) made the heading, replacing "Places to watch" / « Points à surveiller ».

## Checks behind the DONE rows that needed more than one line

**Brief 1 (n174 D.3).** Remaining `shane` hits (52 lines across `apps`, `packages`, `scripts`, `tools`, `AGENTS.md`, `ARCHITECTURE.md`, excluding build output) are in the files Code listed as kept or as history: `destinations.ts`, `profileStore.ts`, `scripts/ratchets.mjs`, `wall.ts`, `wall.test.ts`, history comments. Five more are under `apps/web/test-results/_desk-n174/*.patch`, which are the desk's patch copies, not source. Remaining `Fit` as a name is in the Guide prose (`Reading/GuideContent.svelte:60,73,93,276,336,350,370,553`), which the brief leaves to N.154 and N.84, and in dated quotations or history comments.

**Brief 2 (n82).** Advice actions, openers and the key, interval and direction families are at `lib/i18n.ts:1624-1628` and `:1792-1820`. `insights.finding.tighten`, `.turnover`, `.sustain` use « prolongé » and « pendant qu’il se prolonge » (`:1528,1529,1533`). `keyName` and `transpositionPhrase` in `analysis/watchlist.ts:578-611`. The package exports `keyAfterTransposition` (`packages/score-parser/src/index.ts:89`) and passes numbers, not English.

**Brief 11 (tessituragram r2).** One stave with clef, compass, barline and faint stave and dotted ledgers under the bars (`Tessituragram.svelte:246-262`); rows only for sung accidentals, names in `--rose-ink` weight 600 (`:157-175`, `:315-319`); enharmonic names joined with " / " (`:174`); 3 px thin bars and the taller step (`:91`, `:157-170`); dark bars with "m. N · [v]" tags (`:157-170`); tessitura shaded once (`:238-244`); passaggi drawn before the bars (`:294-300`); zone shares at the right edge; no range field; title above the bars (`:343`); only the longest bar prints its value (`:157-170`). The vowel chart follows `VOWELS`, flagged rows dark (`InsightsPane.svelte:555-567`, `:1142-1147`). The r2 default "a vowel never sung does not print" was later replaced by brief 13 (ten rows, zeros), and the tree follows brief 13.

**Brief 13 (vowel-chart-all-ten).** (1) `vowelChartRows` at `insights/insights.ts:632-644` emits all ten, test at `insights.test.ts:440-449`. (2) Derived, never stored: `routes/+page.svelte:405-453` (`scoreText`, `derivedPoem`, `shownPoem`), Replace without Clear at `Drawer/IntakePanel.svelte:462`. (3) `intake.line` and `intake.word` at `lib/i18n.ts:648-649`, chosen in `components/Drawer/bandState.ts:87-91`. (4) Flat set in the sans, `InsightsPane.svelte:948-950` and `:1267`. (5) `packages/score-parser/src/pickup.ts` with `adoptPickupMeter` imported by `mnx-parser.ts:73` and `musicxml-parser.ts:79`, tests `pickup.test.ts:14,29,40`.

**Brief 18 (n154).** Rows 1 to 4: `lib/i18n.ts:1203`, `:1186`, `:1155`, `:913` (row 4 in the amended "type them into the Input field" form, French « dans le champ Entrée »). Rows 5 and 6: `Drawer/Drawer.svelte` Guide table of contents (French « Les Aperçus prévoient, ils ne déclarent pas », « Conventions de notation de l’Annotation »; English "Insights forecasts, it does not declare", "Markup’s notation conventions"). Rows 7 and 8: `Reading/GuideContent.svelte:58,71,335,348`. Rows 9 to 12 in the redrafted "Input field" and "in the drawer" form: `Reading/LearnContent.svelte:672,746,2054,2058` (French) and `:2721,2795,4059,4063` (English). The replaced text is gone (empty grep for "Transcription tab", "onglet Transcription", "Fit forecasts", "Fit prévoit", "notation de Fit" in `components/Reading` and `Drawer`, except two Guide figcaptions at `GuideContent.svelte:122,370,399`, which are in the "Guide prose, listed only" group the brief excludes).

## Observations that are not missing deliverables

- **Apostrophe mismatch on two Guide headings (brief 18).** The table of contents uses U+2019 (`Conventions de notation de l’Annotation`, `Markup’s notation conventions` in `Drawer.svelte`), while the headings themselves use a straight apostrophe (`GuideContent.svelte:71`, `:348`). The ratified text in the draft is itself inconsistent on this, so I did not call either wrong.
- **Doubled narrow no-break space (brief 5 strings).** `lib/i18n.ts:1547`, `:1563`, `:1564` read `  ;` (two U+202F before the semicolon). The other 14 French semicolons in the file use one (`grep -o '\\u202f;'` gives 14). This looks like an accident from the later semicolon brief. Not part of any of the 22 briefs, so not scored.
- **Brief 12, Fix 1 has no test.** The brief said to say so and propose a home if the function was unreachable from a test. Code did (`memo-code-two-save-fixes_r1_2026-09-27.md`). No `survivingGlosses` module exists (empty grep), so the proposal was not taken up.

## What I could not establish

- **Gate counts and any test result.** No tests, `svelte-check` or ratchets were run. I confirmed that named tests exist and read them; I did not confirm that they pass. Report figures (for example web 1495 after D.3, 1640 after N.82) are Code's, not mine.
- **Anything seen only in a browser:** the Guide anchor redirect on localhost, `/notation-font-lab` returning 200 and `/fit-font-lab` 404, French and English rendering of the watch band, Sunless 1 page-one heights, the phone dock, the twin dimming, the photo messages on the real HEIC and JPEG, and the pickup meter on Sunless 2. I checked only the code and strings that produce them.
- **The `out/` directory of `tools/n168-frequency-run` (briefs 19 and 20).** It is not in the tree (no `out/`, no `frequency-run.md`, no `notes-*.csv`), so the regenerated tables, per-note CSVs and P1a counts could not be checked. The memo addenda and the runner code are present. Whether `packages/` and `apps/` were left untouched by these two briefs cannot be known without git.
- **Approval-file discipline (briefs 15 and 16).** "Every approval file stays identical except lines holding an affected word" needs a diff against the prior tree. There is no git here. I found no phonology approval corpus containing the affected words, so I could not check this.
- **`docs/memory/` present-tense names (brief 1, Part B item 5).** Not audited. Only the code, scripts, top-level documents and `tools/` were searched for leftover names.
- **That the `TextualWitnesses.svelte` section renders.** Code's memo says it is mounted nowhere, so the `witness.*` keys are checked by the approval test only. I confirmed the keys and readers (`lib/score/TextualWitnesses.svelte:44-93`), not that any screen shows them.
- **Whether Dann's own "walk" (the DONE condition several briefs name) has happened.** Every verdict here means "present in the code", not "walked and accepted".
