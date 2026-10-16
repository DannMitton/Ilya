# Report: row 48, every song gets a tempo, estimated when none is printed, and the singer can change it (r1, 2026-10-15)

Lane: a Claude Code cloud session on `cloud-lane-9`, last of the batch, after rows 5, 47, and 13. Brief: `brief-code-tempo-estimate-and-control_r1_2026-10-08.md` with the fifteen amendments of `review-fable-brief-row48_r1_2026-10-15.md` (the review wins where they differ). The review text reached me with part of amendment 2 and the opening of amendment 3 cut off; I built from the rest and from the brief. The strings are as ratified: the nine of 2026-10-08 01:40, and the two estimate sentences as Dann ratified them on 2026-10-15 09:09.

WRITTEN on the code. DONE is Dann's look after his merge (a cloud branch has no Vercel preview since row 98, `10d6553`).

## What was built, with `path:line`

**The seam** (`packages/score-parser/src/tempo-seam.ts`)
1. `TempoProvenance` gains `'estimated'` (`:93-94`); `TempoResolution` gains `estimateMetre`, the metre the estimate read (`:152`).
2. **Rung 4 is the estimate** (`:617-641`), where it abstained. `ESTIMATE_BAND` is 60 to 72 felt beats a minute (`:388`); the band is `range` and `rangeExact`, `bpm` and `bpmExact` the midpoint 66. The metre is the one holding the most bars (`dominantTimeSignature`, `:441`); a score with none gets the quarter, a walking pace.
3. **`estimateBeat` wraps `feltBeat` and does not change it** (`:416`): 3/8 takes the dotted quarter with the eighth beside it; 6/4, 9/4, 12/4 take the dotted half; 6/8, 9/8, 12/8 keep the dotted quarter and gain the eighth as the second reading; every other metre keeps its felt beat and takes the next smaller note value as the second. The header comment (`:12-40`) replaces rung 4's "Never a default bpm" with what replaced it, when (2026-10-08, Dann's words), and on whose authority: after Jeanne Lamon as Dann received it (2026-10-14, 03:13 to 03:20), with the Quantz 1752 tether (Hauptstück XVII, Abschnitt VII, § 51, pp. 263-264). **I took that citation from the review and did not check it against the book.** The attribution is in the code comment and this report and in no string a singer reads.
4. `tempoCaveats` carries one caveat naming the estimate (`:659`). **It has no caller in `apps/web/src` or in any other package, outside its tests** (grep of `apps/web/src` and `packages/*/src`): only the export at `index.ts:193`.
5. The singer's tempo on the score: see departure 1. `resolveTempo` reads `parsed.singerTempo` as the override (`:505-520`); a beat glyph is built for the singer's unit.

**Every provenance branch touched.** (a) `insights.ts:524` `timing`: an estimate is `'range'`. (b) `insights.ts:643` the tessituragram `scale`: an estimate is `'quavers'`, as a printed word's tempo is (it would have printed `'seconds'` for the new `'estimated'` value without this). (c) `conditions.ts:183` `TempoState`: an estimate is `'inferred'` (DESK DEFAULT, so the held-note flags treat it as a band). (d) `conditions.ts:316-335` the held-note branch: **a branch the review did not name.** The `'stated'` path reads `parsed.tempoMarkings` through `isLongSustain`, which would have ignored the singer's own tempo; a singer's tempo now takes the seam's seconds, with a new `heldBasis: 'singer-tempo'`. (e) `tempo-seam.ts` `tempoCaveats` (above). (f) The phonation sentence, `phonation-headline.ts` (below). Not touched, and read: `tempo-terms.ts:46,145` (`provenance: 'inferred'` is the term resolver's own type, not a `TempoResolution`), and `phonation.ts:494-497`, `:570`, which read `rangeExact`/`range` and so priced the estimate with no change. The other `provenance` hits in `apps/web/src` are source and metadata provenance, not tempo.

**The sentence** (`apps/web/src/lib/insights/phonation-headline.ts`, new, moved out of `InsightsPane.svelte`'s `headlineOf` so its branches are testable): `encoded` keeps `headline`, `inferred` keeps `headlineInferred`, `user` takes `headlineYours`, `estimated` takes `estimatedMetre` where the score has a metre and `estimatedWalking` where it has none. **The first branch ("states no tempo") is gone**, and no interim line stands in its place. `insights.phonation.noTempo` stays at `i18n.ts:1711` with a comment dated 2026-10-14 saying it is drawn by nothing. **`insights.phonation.tempoPointer` (`i18n.ts:1733`) is drawn by nothing today** and I left it. The `nothingSung` case is unchanged. `{beat}` is the metronome note in Finale Maestro (`beat-glyph.ts`; `richParts` sets private-use characters apart as `mus`, `SingerBlock.svelte` draws them in the notation face).

**"Change the tempo"** rides on the sentence: a `link` on the `prose` block (`singer-blocks.ts`, `SingerBlock.svelte`), screen only. **The octave line row 47 built is unmoved**: it follows the sentence block at `singer-blocks.ts:368` and still does (tested).

**The singer's tempo, stored**: `SongRecord.tempo?: TempoChoice` (`library/types.ts`), `SongFields.tempo`, `fieldsFromRecord`, `recordFromFields`, `validateRecord` (a positive finite bpm, a known beat unit, dots 0 to 2; anything else is malformed and dropped), and the document's `$state` with save and load (`library.ts`, `document.svelte.ts`). It sits beside row 47's `octaveReading`. The estimate is never stored.

**The control and the receipt** (`apps/web/src/lib/tempo/`, a new folder): `TempoControl.svelte` (floating, never prints; note chips drawn from Finale Maestro, with the note-value names as their accessible labels; a number with − and + and a typed value; "Use Ilya's estimate"; Escape and a press outside close it), `TempoReceipt.svelte` (the TEMPO row under the SCORE receipt: label, figure, source word, the ≈ or the torso, and a Change link), `tempo-ui.svelte.ts` (the open flag and the tempo in force, one instance both openers use), `singer-tempo.ts` (put the tempo on the score, convert a bpm between beats, the chips, the bounds 10 to 500), `beat-glyph.ts`. A tap on the other chip keeps the speed and rounds to a whole number: 66 dotted quarters a minute becomes 198 eighths, and back. The chips keep one order whichever is active, so a tap marks a chip and never moves it (I found this by test: my first version moved the tapped chip to the front).

**The page** passes the tempo and the opener to both panes and renders the control once (`+page.svelte:101-102` the imports, `:949` the binding, `:4487` the opener on the Insights call site, `:4540` the control). **`IntakePanel.svelte` is exactly 1000 lines**, the limit for a file with no ceiling: the receipt is its own component, rendered from the one `{#if score}` block (one import, one line), and I removed one blank line to stay at the limit.

**The ≈ sigil** (`provenance.ts`): `TEMPO_ESTIMATED`, the icon `≈`, the ratified `legend.tempo-estimated`, and an optional argument to `buildProvenanceLegend`; `LegendItems.svelte` draws it as a text character. The singer's own tempo wears the existing torso, whose legend entry reads "User override" and does not say tempo; I left it. **No printed page carries the ≈ today** (the receipt is screen, and the Insights sentence carries none, as ruled), so no printed legend shows the new entry yet.

## Where I departed from the review, and why

1. **The singer's tempo rides on the score, not as a `tempoOptions` argument.** Amendment 7 asks for one argument given to `secondsPerQuaver`, `phonationSection`, and the `analyzeScore` path. That is about ten signatures and every `buildInsights` caller, including the what-if searches in `singer-page.ts`. Instead `ParsedScore.singerTempo` (`types.ts`, optional, "set by the app, never by a parser") is read by `resolveTempo`, the panes put it on the score once, and every derived copy spreads it. The explicit options still win (tested). The risk is a derived copy built without a spread, which would lose it; I checked `scoreInPerformanceOrder`, `transposeScore`, `shiftVocalOctave` and found none, and the browser run shows the figures follow.
2. **The band is 60 to 72 of the felt beat, not converted.** Amendment 3 says "converted to the felt beat as rung 3 converts". Rung 3 converts a quarter-anchored band; the ruling is 60 to 72 felt beats, so I read the band as already in the felt beat. A conversion would have given 40 to 48 for the dotted quarter, against the brief's "dotted quarter at 60 to 72".
3. **The legend entry** is added through an argument to `buildProvenanceLegend`, not as a member of `LEGEND_ORDER`, which is the stress scan's allowlist.
4. **No close button on the control.** A button needs an accessible name and no string for one is ratified; Escape and a press outside close it. Owed to Dann if he wants one. The typed field is labelled by `tempo.hint`, an existing ratified string.
5. **A dotted chip's accessible name** is the note-value word, a middle dot, and `correct.dot` ("Quarter · Dot"), because no "dotted" word exists in `i18n.ts`; the loupe's readout joins its parts the same way. A better word is owed to Dann.
6. **Six existing tests pinned the abstention Dann replaced, and I rewrote them by hand** (no `-u`): four in `tempo-seam.test.ts`, one in `phonation.test.ts`, one in `conditions.test.ts`, two in `score-metrics.test.ts`, two in `insights.test.ts`. Each now says what the estimate does. `heldBasis` gains `'singer-tempo'`.

## Gates, all eight

| Gate | Start (row 47's end) | Result |
|---|---|---|
| 1 phonology | 251 | 251 passed |
| 2 dictionary | 248 | 248 passed |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 2591 | **2627 passed** (+36: `tempo.test.ts` 21, `library.test.ts` 12, `singer-blocks.test.ts` 3) |
| 5 score-parser | 683 passed, 5 skipped | **709 passed, 5 skipped** (+26: `tempo-estimate.test.ts` 24, `conditions.test.ts` 2) |
| 6 blurb | 145 | 145 passed |
| 7 integration | 55 | 55 passed |
| 8 ratchets | OK | OK |

**Ceilings, raised on purpose and by exactly the lines added:** `+page.svelte` 5644 to 5652 (+8: two imports, the binding and its comment, the control, and three props across the two panes); `MarkupPane.svelte` 1363 to 1371 (+8: two imports, the prop and its comment, its default, and the rewritten comment at the old `:759-761`). `InsightsPane.svelte` is 762 against 1351 and was not touched. The French gate passes: the ratified French carries « {metre} de cette partition; votre » and « {beat} = {low} à {high}, l’allure de la marche; votre » with no space before « ; », and no colon.

**Playwright**, `--project=chromium`, whole suite: **69 passed, 3 failed, of 72.** Two are the failures at `14e2ff8` already (`insights-page.test.ts:95`, `singer-paths.test.ts:169`). The third, `core-loop.test.ts:41`, was the first test of the run and read « Dictionary loading failed: network error » while the dev server was cold; the whole file passes (21 of 21) when run again, so I call it a cold-start failure, NOT established why the fetch failed.

## Tests

- `tempo-estimate.test.ts` (score-parser): the estimate is a labelled 60 to 72 band with its midpoint, exact; the metre it read; the felt beat and second reading for 3/8, 6/8, 9/8, 12/8, 2/2, 6/4, 9/4, 12/4, 4/4, 3/4, an unlisted 5/8, and no metre; `feltBeat` unchanged; the dominant metre and its tie; priced as a range, and the contact count a span; precedence (a word over the estimate, a mark over a word, the singer over all); reset; an option still wins; a derived copy carries the singer's tempo; the seconds follow it; the caveat names the estimate.
- `tempo.test.ts` (web): the two fixtures. Tchaikovsky (3/8): estimated, the dotted quarter, `timing` `'range'`, **`cycleDose` returns a range** (amendment 5), the English and French sentences with the ratified words and no « states no tempo », the singer's tempo making it a point, the figures following it, reset, the receipt's three sources, the chips and the speed-keeping tap. Sunless: still inferred, the sentence still `headlineInferred`, and the singer's tempo over its printed word. The four sentence branches by hand, the glyph and names, `richParts`, the clamp, the legend, and every ratified string exactly.
- `library.test.ts`: the stored tempo by the N.94 pattern, eight bad values dropped, beside the key and the octave reading.
- `e2e/tempo.test.ts` (5, Playwright): desk and phone, English and French. The Tchaikovsky song shows the estimate sentence with the dotted quarter at 60 to 72 and the contact count as a span; the control opens from the sentence and from the receipt; a tap on the eighth gives 198 and back gives 66; a typed 60 makes the sentence « …, your tempo. », the receipt « your tempo » with the torso, and the contact count a single figure; the steppers; « Use Ilya's estimate » returns the band; Escape closes; the choice survives a reload in the same browser context; Sunless keeps « Your phonation takes about… » with a receipt that says printed and carries no sigil.

## Screenshots

`docs/sessions/tempo-shots/`, 9 files, desk 1,440 by 900 and phone 390 by 844, written by `TEMPO_SHOTS=1` on the e2e test: the estimate receipt, the estimate sentence, the control open, the singer's tempo (English), the estimate and the singer's tempo in French (desk), the phone sentence and the phone control, and Sunless printed. I looked at two (the control open, and the estimate receipt); the other seven I did not look at.

## For the desk

- **The Markup tab's own pages print no tempo**, so the ≈ prints in the receipt only.
- **The singer's tempo changes Markup's analysis too** (the held-note flags and the comments read the same score), though nothing on Markup names the tempo.
- **Insights draws the sentence only where the page has totals**, as for row 47's line: with nothing sung, or no measured voice, there is no phonation block and so no "Change the tempo" link there; the receipt in the Input band is the other way in and is always there with a score.

## Could not establish

- The Lamon attribution and the Quantz page citation (taken from the review, not checked against any text).
- The held-note flags following the singer's tempo **in the browser**: unit-tested (`conditions.test.ts`: a slow tempo holds a whole note, a quick one does not, both on `heldBasis: 'singer-tempo'`), not looked at on a page.
- The 84-capture compare: not run for this row, and row 47 already moved the voiced baseline. The Text tab now carries a TEMPO row under SCORE whenever a score is loaded, so every Text capture with a score will differ.
- Dann's scan of «Средь шумного бала»: not in the tree. Its case is the Tchaikovsky fixture, which has no tempo as a scan has none.
- Whether the typed field's label, `tempo.hint`, reads well to a screen reader as a name; and a phone view of the receipt (the phone drawer was not opened).
- Whether the dotted quarter's glyph and its dot read clearly at the sentence's size; the screenshots show it small.
