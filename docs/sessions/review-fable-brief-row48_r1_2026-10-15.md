# Fable review of the row 48 brief (every song gets a tempo, estimated when none is printed, and the singer can change it), r1

Reviewer: Fable 5.1, 2026-10-15. Brief: `docs/sessions/brief-code-tempo-estimate-and-control_r1_2026-10-08.md` (r1, 2026-10-08). Checked against a fresh clone of `Shane` at `14e2ff8`. Every `path:line` below was read this session at that commit. Lane: a Claude Code cloud session (Sonnet) on branch `cloud-lane-9`, third of rows 5, 47, 48, 13. Folded in as the desk asked: (a) the cycles line restored, (b) the false "states no tempo" line removed, (c) the estimate's authority, (d) no interim "no tempo" line.

## Verdict

SEND WITH AMENDMENTS (1 to 15), with amendment 1 a precondition: **two ratified strings now open with the sentence Dann struck on 2026-10-14, and their replacement is owed to him before the cloud prompt is typed.** Everything else in the brief is executable, and the tree already carries most of the plumbing the brief leaves to invention: the cycles line prints a span with no new string once the estimate is a range (amendment 5), the override options exist at the seam and are passed by nothing (amendment 8), and the metronome glyphs with their accessible names exist (amendment 10). One ratchet trap: the Input band's file is one line under the new-file limit (amendment 9).

## Citations checked

| Citation | Status at `14e2ff8` |
|---|---|
| `insights.phonation.noTempo`, `i18n.ts:1665` (QUEUE says `:1674`) | MOVED to `apps/web/src/lib/i18n.ts:1680`. Drawn by `headlineOf` at `apps/web/src/lib/insights/InsightsPane.svelte:280` when `ph.timing === 'none' \|\| !ph.phonation \|\| !ph.tempo`. |
| homr emits no tempo, `generate-main.ts` | CONFIRMED in substance; the sentence is at `third_party/homr-web/src/musicxml/generate.ts:4` ("no metronome, no tempo"). |
| Text recognition off, `homr-reader.ts:158` | MOVED: `apps/web/src/lib/omr/homr-reader.ts:305`, `ocr: false`. |
| The singer has no way to set a tempo, `MarkupPane.svelte:725-727` | MOVED to `apps/web/src/lib/markup/MarkupPane.svelte:759-761` ("No tempo override is passed, because the singer has no way to set one yet"). |
| `resolveTempo` at `tempo-seam.ts:387`; rung 4 "abstain" at `:12-19` | CONFIRMED: `packages/score-parser/src/tempo-seam.ts:387` and `:518-519` (`// ── 4. Nothing. Abstain. ──`); the precedence comment is `:12-19`. |
| `feltBeat` at `:243` | CONFIRMED: `tempo-seam.ts:243-268`; 3/8 defaults to the eighth with the dotted quarter as `alternative` unless the tier is fast (`:258-262`). |
| `headlineInferred`, `insights.ts:502` | WRONG FILE. The range sentence is chosen at `InsightsPane.svelte:281-286`; `insights.ts:488-498` is `secondsPerQuaver`, which prices a range when the resolution carries one (`:495`). |
| `cycleDose` returns null without a tempo, `singing-measures.ts:113-118` | CONFIRMED: `apps/web/src/lib/insights/singing-measures.ts:116-118` (`if (!price \|\| rows.length === 0) return null`), the comment at `:112-114`. |
| `phonation.ts:437-444` assumes one tempo | NOT RE-READ (out of scope: "Not in this brief"). |
| `provenance.ts:5-6` normal operation shows no sigil; `user-override` is the torso | CONFIRMED: `apps/web/src/lib/provenance.ts:5-6`, `:124` (`'user-override': 'torso'`); legend label `legend.user-override` at `i18n.ts:827` ("User override" / « Correction manuelle »). |
| Gate 4 baseline "rows 46 and 47 ship with" | STALE; tonight's baseline is 2512 plus rows 5 and 47. |
| "Walk finding 2026-10-14 03:10 … «Средь шумного бала» prints *This score states no tempo* while the print reads *Moderato*" (QUEUE row 48) | The mechanism is confirmed: a scan reaches Ilya as homr's MusicXML with no tempo (`generate.ts:4`) and no text read (`homr-reader.ts:305`), so `resolveTempo` abstains (`tempo-seam.ts:518-519`) and `headlineOf` prints `noTempo` (`InsightsPane.svelte:280`). The scan itself is not in the tree. |

## The strings, against Dann's words of 2026-10-14

The ratified `insights.phonation.estimatedMetre` and `estimatedWalking` (brief, strings table) open with "This score states no tempo." / « Cette partition n’indique aucun tempo. » For a MusicXML or MNX file with no tempo element that sentence is true. For a scan it is the same claim Dann struck at 03:10 (*"We must not declare indefensible statements with confidence"*), because Ilya does not read a scan's words (`homr-reader.ts:305`) and cannot know whether the print carries *Moderato*. The brief has no scan-specific variant and the desk's amendment (d) forbids an interim "no tempo" line. So both estimate sentences must change, and a changed string is Dann's.

What survives, in both languages, is everything after the first sentence. In the French, « Ilya **l’**estime à … d’après **sa** mesure » loses its antecedent (« tempo », « partition ») when the first sentence goes, so the French is a redraft, not a cut; the desk builds it from the ratified French in the brief's table and puts it to Dann with that one choice flagged. The English can be a cut. DESK DRAFT for the English, for Dann's ruling, not for the tree:

> `insights.phonation.estimatedMetre`: Ilya estimates {beat} = {low} to {high} from this score's {metre} metre, so you phonate for about {t1} to {t2}.
> `insights.phonation.estimatedWalking`: Ilya estimates {beat} = {low} to {high}, a walking pace, so you phonate for about {t1} to {t2}.

The French is NOT DRAFTED here (the brief's reviewer does not write French Dann has not seen; `CONTRACT.md:110`). The other nine strings in the table claim nothing about the page and stand as ratified.

## Amendments

### 1. Precondition: the two estimate strings

Add at the top of the strings section:

> **Two strings replaced since ratification.** `insights.phonation.estimatedMetre` and `insights.phonation.estimatedWalking` no longer begin "This score states no tempo" (Dann, 2026-10-14 03:10: Ilya cannot know what a scanned print says, since it reads no words from a scan, `apps/web/src/lib/omr/homr-reader.ts:305`). Their text is: [the desk pastes the EN and FR Dann ratified, with the date]. The remaining nine strings are as ratified 2026-10-08 01:40. Write no other new text; if a sentence is needed that is not in this table, stop that part and report.

The desk does not type the cloud prompt until this paragraph is filled.

### 2. Header: the lane

Replace "For Code on the Mac. QUEUE row 48. Runs after rows 46 and 47." with:

> Lane: a Claude Code cloud session (Sonnet) on branch `cloud-lane-9`, after rows 5 and 47 in the same session. Commit this row with its report; push only `cloud-lane-9`; never `Shane` or `main`; no pull request; never edit `docs/memory/`; do not commit this brief. Read `InsightsPane.svelte`, `singer-blocks.ts`, `+page.svelte`, and the library files fresh after row 47's commit, and read row 47's report line on where its octave line sits in `singerBlocks`; this row rewrites the sentence above it. Line numbers below are at `14e2ff8`.

### 3. Ruled item 1: the estimate as a fourth provenance, and every branch that reads provenance

Append to ruled item 1:

> Build the estimate as a fourth value of `TempoProvenance` (`packages/score-parser/src/tempo-seam.ts:66-72`; name it `estimated`), returned by `resolveTempo` where rung 4 abstains today (`:518-519`), with `range` and `rangeExact` set to the 60 to 72 band converted to the felt beat as rung 3 converts (`:470-477`), `bpm` the band's midpoint, `beatUnit`, `beatUnitDots`, `beatGlyph`, and `beatAlternative` from the wrapped `feltBeat`, and `steadyMarkingCount` and `gradualCues` as the other rungs carry them. Then make every branch on provenance say what an estimate does: `apps/web/src/lib/insights/insights.ts:524` (`timing`: an estimate is `'range'`); `packages/score-parser/src/conditions.ts:183` (`TempoState`: DESK DEFAULT, an estimate is `'inferred'`, so the held-note flags treat it as a band); `tempo-seam.ts:528-566` (`tempoCaveats`: add one caveat in the same register naming the estimate; nothing in `apps/web/src` outside tests calls this function today, say so in the report); `InsightsPane.svelte:279-292` (`headlineOf`: an estimate chooses `estimatedMetre` when the score has a metre and `estimatedWalking` when it has none, a `user` tempo chooses `headlineYours`, `inferred` keeps `headlineInferred`, `encoded` keeps `headline`). Search for every other `provenance ===` and `provenance:` on `TempoResolution` and list them in the report.

### 4. Ruled item 2: the wrapped felt beat, with its authority in the code

Replace the parenthetical "(DESK DEFAULT values, JUDGEMENT, editable by the singer)" and the sentence "Do not change `feltBeat` itself … say in a comment why" with:

> Wrap `feltBeat` (`tempo-seam.ts:243`) for the estimate only; do not change it or the word path. The wrapper's comment, replacing rung 4's "Never a default bpm" at `:12-19` and `:518-519`, says what replaced it, when (2026-10-08, Dann: *"Failing all three, it returns something, and this something can be edited easily by the user"*), and on whose authority: **after Jeanne Lamon, as Dann Mitton received it** (2026-10-14 03:13 to 03:20): the felt beat is where a dancing body lands; flight is bounded by gravity, so a slow tempo is felt in subdivisions, not in a longer beat; the felt beat stays within the range a body can step or sway to; 3/8 in three or in one. Written tether: Quantz 1752, *Versuch einer Anweisung die Flöte traversiere zu spielen*, Hauptstück XVII, Abschnitt VII, § 51, pp. 263-264, which gives each metre and tempo word its note value per *Pulsschlag*. The 60 to 72 band and the two departures (3/8 to the dotted quarter with the eighth as `alternative`; 6/4, 9/4, 12/4 to the dotted half) are the desk's values under that principle, JUDGEMENT, editable by the singer. The attribution appears in the code comment and the report and in no string a singer reads.

### 5. The cycles line (N.123), restored with no new string

Add a ruled item 7:

> **The contact count is always shown, as a range when the tempo is estimated** (Dann, 2026-10-14 23:25). The tree already does this once the estimate is a tempo with a `range`: `secondsPerQuaver` (`apps/web/src/lib/insights/insights.ts:488-498`) prices a range at `:495`; `cycleDose` (`singing-measures.ts:116-135`) returns `{ kind: 'range' }`; `cycleDoseSplit` (`:150-164`) follows; `doseText` (`singer-blocks.ts:123-127`) prints it through `insights.fit.span` (`i18n.ts:1618`, "{low} to {high}" / « {low} à {high} »), and the cycles block is pushed at `singer-blocks.ts:300-315`. Build nothing new for it; test it: a unit test that `cycleDose` on the Tchaikovsky fixture's rows with an estimated price returns a range, and the browser check below shows the cycles block with a span. If any step above does not hold as described, report the line and stop that part.

### 6. (b) and (d): the "states no tempo" line leaves, with no interim

Replace "`insights.phonation.noTempo` stays in `i18n.ts` with a comment that nothing shows it now; do not delete it" with:

> After this row `resolveTempo` never returns `undefined` for a score with a metre or without one, so `timing` is never `'none'` (`insights.ts:524`) and the first branch of `headlineOf` (`InsightsPane.svelte:280`) is unreachable; remove that branch, keep `insights.phonation.noTempo` at `i18n.ts:1680` with a comment dated 2026-10-14 that it is drawn by nothing (Dann: *"We must not declare indefensible statements with confidence"*), and do not delete it. Ship no interim line of any kind (Dann, 2026-10-14 23:31). `insights.phonation.tempoPointer` (`i18n.ts:1702`) is drawn by nothing today; leave it and say so in the report. The `nothingSung` case (`insights.ts:530`, `InsightsPane.svelte:384`) is unchanged.

### 7. Ruled item 4: the singer's tempo, stored and passed

Append to ruled item 4:

> **Store it** as N.94 stores the key: an optional field on `SongRecord` (`apps/web/src/lib/library/types.ts:127`), its `SongFields` counterpart (`library.ts:60`, `:87`, `:100`), the document's `$state`, save, and load (`document.svelte.ts:91`, `:258`, `:307`), and `validateRecord` (`library.ts:135`) dropping a value that is not a positive finite bpm with a known beat unit and dots 0 to 2. Row 47 adds its own field the same way immediately before you; add yours beside it. **Pass it** from the page at the two pane call sites (`+page.svelte:4826-4842`, `:4854-4874`) and to the Input band. **Thread it to the seam:** `ResolveTempoOptions` already has `overrideBpm`, `overrideBeatUnit`, `overrideBeatUnitDots` (`tempo-seam.ts:363-373`, read at `:412-424`), and nothing passes them: `secondsPerQuaver(score)` takes no options (`insights.ts:488`), `phonationSection` (`:516-521`) neither, and `MarkupPane.svelte:759-761` records the gap. Give `secondsPerQuaver`, `phonationSection`, and the `analyzeScore` path (`apps/web/src/lib/analysis/score-metrics.ts:124`, `conditions.ts:182`) one `tempoOptions` argument from the stored choice, so phonation time, the cycle dose, the held-note flags, and comments follow at once, as ruled. Rewrite the comment at `MarkupPane.svelte:759-761`.

### 8. Ruled item 5: the TEMPO receipt, and the ratchet it would trip

Append to ruled item 5:

> The SCORE receipt is `apps/web/src/lib/components/Drawer/IntakePanel.svelte:467-472` (`.intake-receipt.receipt-score`, tag `upload.watermark`, buttons `intake.clear` and `intake.replace`, `i18n.ts:762-763`). That file is 999 lines, is not in `scripts/ratchets.json`'s ceilings, and the unlisted-file limit is 1000 (`scripts/ratchets.json:3`; `scripts/ratchets.mjs:9-11`), so a row added inside it fails gate 8. DESK DEFAULT: build the TEMPO row as its own small component beside `IntakePanel.svelte`, rendered from the one `{#if score}` block under the SCORE receipt, with the same `.intake-receipt` classes. No "Change" string exists in `i18n.ts` (the receipt buttons are Clear and Replace); DESK DEFAULT: the receipt's link uses the ratified `tempo.change` ("Change the tempo" / « Modifier le tempo ») rather than stopping, because a receipt with no way in would leave the control reachable from Insights only. The source words are the ratified `intake.tempo.printed`, `.estimated`, `.yours`.

### 9. The beat chips and the glyphs: what exists

Replace "No new words: the chips are glyphs from the notation font, with the existing note-value names as their accessible labels if they exist (report if they do not)" and "The beat glyph: draw it from the notation font …" with:

> The chips draw SMuFL metronome-note glyphs from Finale Maestro as the DURATION cells do: `LENGTH_CELLS` (`apps/web/src/lib/score/correction.ts:128-137`) pairs each base with its `metNote…Up` code point (U+E1D2 whole to U+E1DD 64th) and its name key (`correct.lenWhole` to `correct.len64th`, drawn by `CorrectionSurface.svelte`); the dot is `metAugmentationDot` U+E1E7, present in `apps/web/static/fonts/finale-maestro/FinaleMaestro.json`. Those name keys are the chips' accessible labels; a dotted chip's label is the base's name plus the existing dotted word if one exists in `i18n.ts`, otherwise report and leave the chip's label as the base's name. The `{beat}` in the Insights sentence and the receipt is the same glyph in a span set in the notation font; `TempoResolution.beatGlyph` (`tempo-seam.ts:246-247`) carries text-font characters (U+2669, U+266A) and is not what you draw.

### 10. Ruled item 6: the ≈ sigil and the legend

Append:

> `≈` joins `LEGEND_ORDER` (`provenance.ts:76-`) and the icon map (`:124`) as a text character, as `ё` does; its legend label is the ratified `legend.tempo-estimated`. The torso's legend entry `legend.user-override` reads "User override" / « Correction manuelle » (`i18n.ts:827`); it does not say tempo, so leave it and report, as the brief already allows. Where the sigil prints: the TEMPO receipt and any printed page that names the tempo; the Insights sentence carries none, as ruled.

### 11. Browser checks without the Mac

Replace the second bullet of "Tests, checks, gates" with:

> Browser checks in Playwright with `PW_CHROMIUM_PATH` set (`docs/memory/ENVIRONMENT.md:4395-4400`; desk viewport 1,440 or wider, `:4399`; phone project as `apps/web/playwright.config.ts:36-44` defines it), English and French. The song: `apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml`, 3/8 (`:8`), 99 measures, no `<words>` and no `<per-minute>`: it is the case a scan produces, since homr's MusicXML carries no tempo (`third_party/homr-web/src/musicxml/generate.ts:4`), and no reader run is needed. Dann's scan of «Средь шумного бала» is not in the tree; its case is this one. Check: the estimate sentence with the dotted quarter at 60 to 72 and a phonation range; the cycles block with a span; set a tempo in the control and see the sentence (`headlineYours`), the receipt (`your tempo`), the cycle dose, and the held-note flags follow; "Use Ilya's estimate" returns; the choice survives a reload in the same browser context; the torso and `≈` in the legend where they print. Screenshots into `docs/sessions/tempo-shots/`, committed with the row, named for tab, language, device, and state. A printed-word song for the unchanged path: `sunless-01-engraved.musicxml` carries *Andante tranquillo*; its sentence must still be `headlineInferred`.

### 12. Unit tests, named to the tree

Replace the first bullet with:

> Unit tests: the precedence order with an estimate at rung 4 (`tempo-seam.ts`), the wrapped felt beat for 3/8, 6/8, 2/2, 6/4, 4/4, an unlisted metre, and no metre; the band converted to each felt beat exactly (`rangeExact`); `secondsPerQuaver` pricing a range from an estimate; `cycleDose` returning a range (amendment 5); `timing === 'range'` at `insights.ts:524`; `conditions.ts:183` mapping; a `user` tempo over a printed mark and over an estimate; reset to the estimate; `validateRecord` dropping a bad stored tempo; `headlineOf`'s four branches (extract it to a pure function if it is not already testable).

### 13. Gates

Replace the third bullet with:

> All eight gates after the row: phonology 251, dictionary 248, web-check 0 errors 12 warnings, web-test 2512 plus rows 5, 47, and this row, score-parser 675 passed 5 skipped plus this row's, blurb 145, integration 55, ratchets OK (`docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117`). Start from the numbers row 47 left; name every number that moves. The French gate (`apps/web/src/lib/i18n.test.ts:90-122`) refuses any space before « ; » and requires U+00A0 before « : »; the ratified French carries « {metre}; votre » with no space, and the new strings have no colon. `+page.svelte` is under a ceiling row 5 lowered and row 47 raised by its count; raise it again by exactly the lines you add, in this commit, with the count in the message (`scripts/ratchets.json:2`).

### 14. Report

Replace the Report section with:

> `docs/sessions/report-code-tempo-estimate-and-control_r1_<date>.md`: changes with `path:line`; the list of every provenance branch touched (amendment 3); each gate with its number; the screenshots; the line that `tempoCaveats` has no caller in `apps/web/src`; the line that `tempoPointer` is undrawn; a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. WRITTEN is not DONE: a cloud branch has no Vercel preview since row 98 (`10d6553`), so DONE is Dann's look after his merge. No git writes beyond this lane's own commits and the push of `cloud-lane-9`.

### 15. "Not in this brief": one line added

Append to "Not in this brief":

> Reading a scan's printed tempo word is N.178 (QUEUE row 48's state cell). This row estimates wherever the seam finds no tempo, which on a scan is always; when N.178 lands, rung 3 will take the printed word before rung 4 and nothing here changes.

## What the brief forbids or invites, checked

- "Do not store anything derived" (`CONTRACT.md:124`): the singer's tempo is a choice, not a derivation; the estimate is derived and is never stored (amendment 7 stores only the singer's value).
- "Do not add a second silent save site while N.27 is open" (`CONTRACT.md:125`): the choice saves through the document as `transposition` does.
- "Do not print an aggregate that is not crossed with his own measurements" (`CONTRACT.md:129`): the cycles split is already crossed with the typed tessitura (`InsightsPane.svelte:388-391`).
- The brief's "stop that part and report" for the Change link is replaced by a DESK DEFAULT (amendment 8); the desk may wave it back.

## What I could not establish

- Whether Dann's 2026-10-14 03:10 words apply to a MusicXML file with no tempo element, where "states no tempo" is true. Amendment 1 removes the claim for every source; a source-specific variant would be a new string and more words on the page, and the desk may put that alternative to him instead.
- Whether any renderer draws `tempoCaveats` (no caller in `apps/web/src` outside tests by grep; `packages/` not searched for callers).
- Whether a dotted-note word exists in `i18n.ts` for the chips' labels (not searched); amendment 9 tells Code to look and report.
- The held-note flags' behaviour under an estimate's band (`conditions.ts:183` mapping is a DESK DEFAULT; the browser check shows what the flags do).
- The phone layout of the floating control; the phone screenshots show it.
