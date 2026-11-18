# Review: brief lane 67 r1 (`docs/sessions/brief-code-lane67-voice-threshold_r1_2026-11-18.md`), r1, 2026-11-18

Reviewer: Fable 5.2. Read at `/home/claude/ilya`, `f2b87049`. Nothing changed, no test run (every finding is from reading). Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `docs/`, `tools/`.

## Verdict

SEND WITH AMENDMENTS. The design matches the ruling: two paths, five of six, no reference-value comparison, one note on the take's own evidence. Three blockers are in the brief's text, not in the design. Apply amendments 1 to 15, then send r2.

## Blockers

1. **The ruling the brief tells Code to "read in full first" is not in the tree.** Brief `:9` cites `docs/memory/OPEN.md`, last section, "VOICE: HOW ILYA MEETS A VOICE, AND A BREAK". `grep -rn "HOW ILYA MEETS A VOICE" docs/memory/` at `f2b87049`: no match; the last heading of `OPEN.md` is `:3967` (N.200 FIDELITY). Brief `:18` cites "`CONTRACT.md` section 5, the edge-case line"; section 5 (`CONTRACT.md:105-120`) has no such line (`grep -n "calamit\|rare\|broken" CONTRACT.md`: one unrelated hit, `:150`). Code would start from the brief's paraphrase alone.
2. **"Unstable" as `reading === 'provisional'` (brief `:25`, `:63`) is not the take's own evidence on stored data.** A fresh take's status is its confidence (`voice/engine/analyze.ts:173`). Before lane 64 the guard and the [ɨ] pass also wrote `provisional` on readings with good evidence; `OPEN.md:3800` records Dann's own [ɨ] (407/1246) as Provisional "for that reason alone". Such a stored reading would be named in "These readings were unstable". `keepReading` already treats `confidence` as the truth (`voice/engine/plausibility.ts:325`). Whether such a reading is still stored on any device: NOT ESTABLISHED.
3. **Step 4 cannot run where it sits, and cannot decide what it is asked to decide.** (a) Step 3 deletes `fitWithoutOutliers` (`stand-ins.ts:151`), then Step 4 asks for "today's fit at `f2b87049`"; the runner's `resolve` calls the live `resolveVowelValues` (`tools/n200-score/lane66-core.ts:132`), which Steps 2 and 3 have changed by then. (b) The synthetic truth IS the declared type's template: `tools/n200-score/fidelity-set.ts:12-14`, `:49-58` (`truthFor` reads `template(BUCKET[type])`). "Declared type's template times k" therefore wins by construction, and the run says nothing about `middle` on a real voice. A desk reading it could put the voice type back above the threshold, against brief `:15`.

## Amendments

1. **Section 1, `:9` and `:18`.** Commit the ruling section to `OPEN.md` before the branch is cut and cite it by line, or paste Dann's 23:21 to 23:38 words into section 1. Replace "`CONTRACT.md` section 5, the edge-case line" with his 23:38 words, quoted.
2. **Section 2, Unstable.** Change to: "`confidence === 'low'` on a sung reading (`isSung`), and not kept." Change Step 5.1 to match. Step 5.2 says Keep changes "no `reading` field"; `keepReading` rewrites it from `confidence` (`plausibility.ts:325`). Say: "`keepReading` is unchanged."
3. **Section 2, Core count.** Dann 23:31 said "five proper vowel samples". The brief counts an unstable reading toward five. Add after "An unstable reading counts": "DESK DEFAULT on his word 'proper', from `PRODUCT.md:1269-1270` (a status never blocks a reading); put to Dann with the strings."
4. **Step order.** New order: 0, 1, 4, 2, 5, 6, 7, 3, 8. Step 4 runs on the untouched engine, so "today's fit" is the tree's own. Strike "Then stop and push ... If nothing is heard within 30 minutes" and write: "Push the report and go on. Step 3 uses `middle`." How an unattended cloud session would wait or hear the desk: NOT ESTABLISHED, and with 3(b) the wait buys nothing.
5. **Step 4, first line of its report.** Add: "The truths are Ilya's own templates by type (`fidelity-set.ts:12-14`). The declared-type arm is exact by construction. This run measures how far Bozeman's staves differ in shape from their middle, and how far one odd [i] moves a missing vowel. It does not test `middle` against a real voice." Keep the odd-[i] part as written (`analysis/adapter-grid.ts:29`, correct).
6. **Section 2, Tract scale.** Sound and testable as written (`template('middle')` exists, `stand-ins.ts:97-106`; its fR2 is a bass's row scaled by the fR1 ratio, `:102-104`). Add one sentence: "Per resonance: a sung core vowel with no usable fR2 (`resolve-values.ts:141`) takes shape fR2 times k for that resonance only, as `stand-ins.ts:208` does today (grid case 'no fR2 on [e]', `adapter-grid.ts:31`)."
7. **Step 2.2.** Strike "still returned in `formants` for the VOICE pane and the chart's dots": the pane and the chart read the stored profile, not `ResolvedValues.formants` (`voice/chart/zones.ts:121`, `:134`; lane 66 review check 1). Fix the cites: `resolveVowelValues` is `:95`, the fR2 test `:141`.
8. **Step 2.3, name the sites that read the stored readings and bypass `resolveVowelValues`.** Step 0's list would need to find each; name them:
   - `insights/InsightsPane.svelte:242-246`, `measuredVowels` by `isSung`, read at `insights/comment-text.ts:123`: below five it would call a generic number the singer's measured value. Gate on `isPersonal`.
   - `markup/MarkupPane.svelte:449`, `hasReadings` (any stored key), read at `:1096`: below five MELODY's page with no score prints "Your profile is now set" (`markup/profile-status.ts:29-32`; `i18n.ts:1482-1484`), with "ten vowels measured" for a generic type, where a voice with nothing recorded gets `profile.emptyState` (`i18n.ts:1496`). Gate on `isPersonal`. The file is 1352 of 1353 lines (`scripts/ratchets.json:16`).
   - `voice/chart/finish-early.ts:36-38`, read at `voice/VowelCapture.svelte:281`: below five the link still reads "Use what I've recorded" (`i18n.ts:2566`) with no caption, and Ilya will not use it. Recommendation: the control does not show below five core vowels; no new string. Desk's call.
   - `components/Drawer/bandState.ts:246-249` through `routes/+page.svelte:1761`: the closed band prints the count of all sung vowels ("3 of 10"). True as it stands; say "unchanged" so Code does not touch it.
   - For a voice with no generic values (contralto, countertenor, bass-baritone, "Not sure", none), INSIGHTS below five says "No voice has been measured" (`i18n.ts:1874`, `:1881`) to a singer who has recorded up to four vowels. The VOICE pane explains; INSIGHTS does not. Against his 23:21 ("transparent ... why outcomes may not match"), put this one sentence to Dann; build nothing new unless he asks.
9. **Step 2.4.** The golden moves in Step 2, not only Step 3: every grid entry under five core vowels collapses to its none-sung twin (`analysis/adapter-grid.ts:25-33`: 'i,e,ɑ', 'e,ɛ,ɑ,o', 'bad i (1063)', 'no fR2 on [e]', 'provisional [u], [ɨ] sung'). Add to Step 2: "regenerate `adapter-snapshots.json` by its script and list every moved entry."
10. **Step 5.3.** `judgeUnchecked` has three more sites than the one named: the definition `resolve-values.ts:49`, its call `:102`, and the re-export `analysis/analyze-score-adapter.ts:42`. Name all, with the wizard's `:61` and `:331`.
11. **Step 5.1 and 5.4.** The retired mark has readers the brief does not name: `voice/chart/VowelSpaceSheet.svelte:124`, the string `calib.roster.kept` (`i18n.ts:1337`), and pins at `voice/outside.test.ts:55-63`, `voice/chart/VowelSpaceSheet.test.ts:107-110`, `voice/chart/readings.test.ts:149`. That makes three retired keys, where section 4 allows two. On "keys removed": this file's habit for a ratified string with no reader is "kept and marked in place" (`i18n.ts:1347`, `:1349`). Say which rule Code follows.
12. **Step 6.** `PaneSentenceInput` carries `usable` (all ten) only (`voice-pane.ts:15-25`). Add a `core` field, passed through `components/Drawer/VoicePane.svelte:42`, `:54`, `:57` from `routes/+page.svelte:4186`. Define the new state as "anything sung and core count under 5", not "1 to 4 core": a voice with only a hard vowel sung has `usable >= 1` and core 0, and would print "Ilya fills the other 9 from what you have recorded" (`:30`; `i18n.ts:1425`), which is false below the threshold. `recordDoorKey` is `:61-63`.
13. **Step 7.** `isDivergent` is reachable: it is stripped only at `CalibrationWizard.svelte:272`, and a pure function in `voice/outside.ts` can call `applyIghDivergence` (`divergence.ts:17-25`) on a clone with no wizard lines. Four gaps:
    - "`isSung` treats a marked [ɨ] as not sung for resolution only" contradicts the one test (`sung.ts:13`, read by the count `profileStore.ts:197`, the chart `zones.ts:121`, `:134`, INSIGHTS `InsightsPane.svelte:245`). Rule one way. Recommendation: the mark sits inside `isSung`, so every site shows Ilya's estimate; the reading stays stored.
    - Say what quiets the [ɨ] note: Keep (`plausibilityOverride`), the mark, or a re-take. The brief names none.
    - Show it only for a personal voice. Below five, "Ilya has an estimate ready, built from your own [i] and [u]" (`i18n.ts:1345`) is untrue: Ilya uses generic values or none.
    - Say what happens when [ɨ] is both unstable and far-off. Recommendation: it appears in the [ɨ] note only, so the summary keeps one note per vowel.
    Nothing stored conflicts: the store is parsed whole (`profileStore.ts:251`), and a new take replaces the reading object (`CalibrationWizard.svelte:647`). A re-take that is less clear does not replace (`i18n.ts:2595`), so the mark then stays; state it.
14. **Section 4, Owns.** Steps 2, 5, 6, and 7 must edit files the list leaves out: `insights/InsightsPane.svelte`, `markup/MarkupPane.svelte`, `voice/chart/finish-early.ts`, `voice/chart/VowelSpaceSheet.svelte`, `components/Drawer/VoicePane.svelte`, `routes/+page.svelte` (one prop), `voice/engine/types.ts` (the new field, and the comment at `:65-73`), `voice/engine/plausibility.ts` (comment at `:315-323`), `analysis/analyze-score-adapter.ts` (Step 1 fix 2, and `:42`), `voice/VowelCapture.svelte`. Add them.
15. **Section 6, strings (errors and inconsistencies only).**
    - `calib.summary.unstable`, French: the table has a plain space before the colon (brief `:101`), and Step 8.1 says "exactly as written". Its neighbours hold U+00A0 (`i18n.ts:1341`, `:1345`). Write `instables : {vowels}`.
    - "your own profile" / « votre propre profil » sits beside "your resonance profile" / « votre profil de résonances » (`i18n.ts:1421`, `:1424`, `:1429`). Two names for one thing.
    - "{n} of the six core vowels" mixes a numeral and a word; `calib.pane.fills` has "{n} of the 10 vowels" (`i18n.ts:1425`).
    - The [ɨ] note names one vowel and its first button is "Keep them" / « Les garder » (`i18n.ts:1346`).
    - French agreement is correct throughout (« une de plus », « instables », « Captez-en »). « voix type de {voiceType} », « valeurs par défaut », « capter » match `i18n.ts:1422`. « reprise » matches `:2595`. `calib.summary.useEstimate` matches `tempo.useEstimate` (`:1902`) and the ratified « Pour l'instant » (`:1345`).

## The seven checks, in one line each

1. Ruling: built as ruled. Nothing in the brief adds a reference-value comparison. Extra beyond his words: Step 4's three-way measure (amendments 4, 5) and Step 7 (a ruling of 2026-11-13, `OPEN.md:3800-3801`, not of 23:21 to 23:38; it puts a second note on the summary).
2. Cites: correct except `resolve-values.ts:96` (is `:95`), `:140` (is `:141`), `voice-pane.ts:62-64` (is `:61-63`), and blocker 1. Verified correct: `sung.ts:13`, `resolve-values.ts:197-200`, `voice-pane.ts:28-35`, `:54-57`, `plausibility.ts:325`, `readings.ts:51`, `:132`, `VowelCapture.svelte:108`, `CalibrationWizard.svelte:331`, `divergence.ts:16-24`, `adapter-grid.ts:29`, `i18n.ts:1075`, `:1240`, `:1345`, `:1422`, `:1877`, `:1879-1880`, `:1887`, `:1902`, `:2052`.
3. Definitions: amendments 2, 3, 6, 8.
4. Order and the wait: amendment 4.
5. Ceilings: Step 5 nets zero or fewer wizard lines (`:61`, `:331`). Step 7 fits in the four free lines (1122 of 1126) only with its logic in `outside.ts` and `OutsideNote.svelte`, which the brief's standing line already requires. `InsightsPane.svelte` (742 of 744) and `+page.svelte` (5531 of 5534) take amendment 8 and 12 as in-line edits. `withPlausibility` (`:292-302`) needs no edit in any step.
6. Step 7: amendment 13.
7. Strings: amendment 15.

## What I could not establish

- Any test or gate count. None was run.
- How often the far-off [ɨ] note would fire. `divergence.ts:3`, `:23` use 50 Hz and 100 Hz; `OPEN.md:3800` says Dann's own [ɨ] exceeds them. `docs/sessions/n200-lane64-step5-counts_2026-11-17.md` holds no divergence count (grep "divergent": none).
- Whether an exported file carries vowel values. I found no voice export under `voice/` beyond the recorder's capture file (`voice/engine/capture-file.ts`), which I did not read.
- Whether `tools/n200-score/lane66-core.test.ts` still passes after Steps 2 and 3 change what `resolve` returns (`lane66-core.ts:132`).
- The "key count line": `i18n.ts:14-17` describes an index of counts by prefix; I did not read the test that checks it.
- Step 1's six fixes against the tree beyond fixes 1 and 2 (`readings.ts:51`, `analyze-score-adapter.ts:64-65`, both as the review states).

## Terms

Adopted from the brief: "core count", "personal", "tract scale", "unstable", "the mark". Coined here: none.
