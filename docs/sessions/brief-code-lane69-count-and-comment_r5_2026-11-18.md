# Brief to Code: lane 69, what MELODY's page says about a voice

r5, 2026-11-18 21:0x, written by the desk (Opus 5). It applies Fable's delta review of r4 (`docs/sessions/review-fable-lane69-brief_r2-delta_2026-11-18.md`: SEND WITH AMENDMENTS, seven amendments, no blocker, nothing for Dann), every one of them, and the desk re-read each line that review cites before writing them in. r4 rebuilt Step 1 on Dann's direction of 20:38 (*"Yes repair this. Are you unclear on the purpose of the user feedback? Please make our process, text, and its purpose align."*, transcribed as written): r3 made the count true and left the sentence around it false. r1 to r4 are superseded. r3 carried Fable's thirteen amendments to r2 (`docs/sessions/review-fable-lane69-brief_r1_2026-11-18.md`) and every one of them survives here. For a cloud Code session on branch `cloud-lane-69`, cut from the tip of `Shane`. No other lane is running.

Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `packages/`, `tools/`, `docs/`, `scripts/`, or are `vercel.json`. The desk read every line it cites at `Shane` `74579156` on 2026-11-18. Step 0 re-reads them on your tip.

## 1. What this line is for, and what it says today

MELODY's page with no score attached draws three lines (`markup/MarkupPane.svelte:1097-1113`). Their purpose, in order: where MELODY will appear, where the singer's voice stands, and what the singer can do next.

1. `profile.lede` (`i18n.ts:1498`): "MELODY will appear here after Ilya processes the score you upload." Correct, untouched.
2. The status line (`:1103`, built at `:949`): where the voice stands. **Wrong in two ways at once.**
3. The provisional sentence, or `profile.provisional.noneMessage` (`i18n.ts:1499`): "You can update these values anytime through the DRAWER on the left." Correct, untouched.

The two faults in line 2, for a singer who has sampled one vowel:

- **It says the profile is finished.** "Your profile is now set" (`i18n.ts:1500-1502`, through `markup/profile-status.ts:29-36`). Five stable core vowels complete a profile (`voice/engine/sung.ts:36-41`; `docs/memory/OPEN.md`, "VOICE: HOW ILYA MEETS A VOICE, AND A BREAK", item 2, ruled by Dann 2026-11-17 23:21: below five, "Ilya says how many more are needed"). This page is the only surface that tells a below-five singer otherwise: the VOICE pane (`components/Drawer/voice-pane.ts:57`), INSIGHTS, and MELODY with a score all print the below-five sentence.
- **It counts values the singer never gave.** `markup/MarkupPane.svelte:568` counts every vowel with an fR1 in the snapshot, placeholders included, so the number reads ten.

Fixing only the count would make the sentence worse, not better: "Your profile is now set with one vowel measured" reads as a finished profile built on one vowel.

**After this lane, line 2 says where the voice stands, in the words the other surfaces already use.** Below five stable core vowels: "You have sampled 1 of the 6 core vowels so far ([i]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 4 more, unsampled vowels are assigned placeholder values." At five or more: "Your profile is now set with five vowels measured", counting the vowels the singer sampled.

**No new string, and no new French.** Both sentences are already in the file and both are ratified by Dann: `calib.pane.belowCore` and `calib.pane.belowCoreOne` (`i18n.ts:1443-1444`, ratified 2026-11-18 13:53 to 14:00, English and French) and `profile.statusSetMeasuredSingular` and `...Plural` (`i18n.ts:1501-1502`).

**The alternative the desk did not take**, named once: route line 2 through `paneSentence` (`components/Drawer/voice-pane.ts:55-69`), which would give every state one function and one wording across the drawer and this page, and would retire the three `profile.status*` keys. Not taken: it rewrites the five-plus page Dann has already walked, and it trades "Your profile is now set" for a drawer pane's "You have recorded all ten vowels", which is a pane's wording, not a page's. DESK DEFAULT; Dann's to overrule.

## 2. The ruling this lane departs from, and why

Ratified by Dann 2026-11-18 20:38 (*"Yes repair this"*), on the departure as the desk reported it.

Two records of his section B.2 ruling of 2026-07-15 survive: the paraphrase at `markup/MarkupPane.svelte:554-558` (*the pane's count reports what the analysis used; capture quality is the drawer's job, where Re-take lives*) and commit `cfcd0ba6` (2026-07-15 20:45 -0400), whose message gives the reason as "the number no longer described the marks on screen" and "the count cannot drift from the analysis again". `markup/profile-status.ts:25` cites the same section. Dann's own words for it are NOT ESTABLISHED: a grep of `docs/memory/*.md` for "B.2" returns nothing.

This lane departs from the ruling's first clause as recorded, for every voice with fewer than ten sampled vowels, and keeps its second. What persists is the reason, and the reason has two halves.

- Capture quality never shrinks this count. Kept whole: an unstable or provisional take still counts, because `isSung` admits both (`voice/engine/sung.ts:14-15`).
- The number describes the marks on screen. On this page there are no marks: it is MELODY with no score (`markup/MarkupPane.svelte:1097`). A clause written to keep the number matching the analysis has no work to do where no analysis is drawn, and what the number can honestly mean there is what the singer sampled.

What changed under the ruling since July is the snapshot, not the sentence. QUEUE row 17 (Dann 2026-09-16, the method ruled 2026-10-01 02:56, `voice/engine/resolve-values.ts:144`) put stand-in values into `snapshot.fR1` for every unsampled vowel (`:153-156`; `voice/engine/stand-ins.ts:151-156`, `:173-175`), so "what the analysis used" stopped being "what the singer gave". Before lane 68 the sentence lied to a singer with five to nine sampled vowels and the page was hidden below that (`markup/MarkupPane.svelte:450` was `isPersonal(formants)` at `737228cb`); lane 68 opened the page to one to four, which is how it surfaced. Reported under `CONTRACT.md` section 1 item 12 and tether 19.

## 3. One number, and every site that computes it

This lane changes how a number is computed, so the line `CONTRACT.md` section 4 asks for. Every site that computes "how many vowels the singer sampled" tests `isSung` on the stored readings.

- `voice/profileStore.ts:196-198`, `usableReadingCount`: `Object.values(f).filter(isSung).length`. Read at `apps/web/src/routes/+page.svelte:1762`, `:4187`, `:4367`: the VOICE pane's sentence, its doors, and the Voice band's state line.
- `insights/InsightsPane.svelte:242-247`, `measuredVowels`.
- `markup/MarkupPane.svelte:450`, `hasReadings`: `Object.values(formants).some(isSung)`, which gates the block this line is printed in (`:1097`).
- `analysis/placeholder-line.ts:73`.
- `voice/engine/resolve-values.ts:153`, `anySung`, read at `voice/chart/finish-early.ts:38`; `voice/chart/finish-early.ts:35`, the vowels not yet sung; `voice/VowelCapture.svelte:109`, `sungSet`.

**What depended on them agreeing.** The sentence at `:1103` sits inside the block `hasReadings` opens, so one test decides whether the sentence appears and a different test decides the number inside it. They have disagreed for every voice with a gap since the stand-ins entered the snapshot (QUEUE row 17). After Step 1 all five read `isSung` on the same stored object.

**The second number this page now prints, by ruling.** `stableCore(...).length` (`voice/engine/sung.ts:26-30`), the stable core count, through `belowCoreText` (`analysis/placeholder-line.ts:53-57`). It is not the same number as the sampled count, and it must not be made the same: a voice with two stable core vowels and one unstable reads "sampled 2 so far" below five, and a voice at five stable with six sampled reads "six vowels measured" above it. Both are Dann's ratified design (`docs/memory/OPEN.md`, that section, items 2 and 4). Change neither number to make them match.

## 4. Steps

Each step is its own commit and its own report section, test first where a test applies, then pushed. Step 0 runs all eight gates as the baseline; Step 3 runs them again at the end.

Gate 4 at the parent, for your control: `docs/memory/STATE.md:19` records "6686 passed | 1 skipped (6687)" on the Mac at `aba5f76b`, the code tip this branch carries (`git diff --stat aba5f76b 74579156` is six files, all under `docs/`). Measure your own and report both.

Standing line: correct every comment your change makes false, in the same commit, and list them.

Ceilings (`scripts/ratchets.json:16`): `markup/MarkupPane.svelte` 1353 of 1353, at its ceiling. Step 1 is built to hold it: the branch between the two sentences lives in `markup/profile-status.ts`, which has no listed ceiling and sits under the 1000-line limit for unlisted files (`scripts/ratchets.json:3`), so the pane's `:949` stays one line and `:568` stays one line. The comment at `:444-446` stays three lines and the comment at `:554-567` is rewritten in fourteen lines or fewer. If the file ends below 1353, lower `scripts/ratchets.json:16` to the new count in the same commit, which is that file's own rule (`scripts/ratchets.json:2`); a file under its ceiling prints a notice and does not fail the gate (`scripts/ratchets.mjs:66-67`). `i18n.ts` is exempt (`scripts/ratchets.json:5`).

### Step 0. Read and report; change nothing

1. All eight gates.
2. Read and report the line each of these sits on at your tip: `markup/MarkupPane.svelte:64`, `:94-96`, `:442`, `:444-450`, `:553-568`, `:949`, `:1097-1113`; `markup/profile-status.ts:12-37`; `markup/profile-status.test.ts:6-16`; `voice/engine/sung.ts:14-15`, `:26-30`, `:36-41`; `voice/profileStore.ts:190-198`; `voice/engine/resolve-values.ts:74-83`, `:153-156`; `voice/engine/stand-ins.ts:151-156`; `analysis/placeholder-line.ts:53-57`, `:73`; `analysis/analyze-score-adapter.ts:117-129`; `components/Drawer/voice-pane.ts:38`, `:57`; `i18n.ts:1349-1356`, `:1443-1444`, `:1498-1504`.
3. Report every reader of `analysedVowels` and of `statusLineFor` at your tip. The desk's greps returned `:446`, `:568`, `:949` for the first, and `markup/MarkupPane.svelte:77`, `:949` plus `markup/profile-status.test.ts:2` for the second.

### Step 1. The status line says where the voice stands

1. **`markup/profile-status.ts`, the branch.** `statusLineFor` takes the state, not a bare count. New signature: `statusLineFor({ sampledCount, personal, core }: { sampledCount: number; personal: boolean; core: readonly Vowel[] }, language: Language): string`. When `personal` is false, return `belowCoreText('calib.pane.belowCore', core, language)` (imported from `$lib/analysis/placeholder-line`; `markup/` may import `analysis/`, `scripts/ratchets.mjs:83`, and the pane already does so at `:96`). When `personal` is true, today's words, unchanged: `profile.statusSetMeasuredSingular` at a count of one, `profile.statusSetMeasuredPlural` otherwise, the count spelled by `countWord`. Keep `profile.statusSetPlain` and its zero branch (`:31-32`) in place; see the report item below. Do not edit the comment at `:12-17`: it is about index 0 of `countWord` and it stays true. Add two imports under `:10`: `import type { Vowel } from '$lib/voice/engine/types';` and `import { belowCoreText } from '$lib/analysis/placeholder-line';`. Both pass the module table (`scripts/ratchets.mjs:83`), `analysis/` may not import `markup/` (`:82`), and `markup/profile-status.ts` is imported only by the pane (`:77`) and its own test (`:2`), so no cycle is possible.
2. **`markup/MarkupPane.svelte:568`**, the count. The filter becomes `isSung(formants[g])` in place of `adapted.snapshot.fR1[g] !== undefined`. `isSung` is already imported (`:64`). One line for one line.
3. **Rename**, so the name says what the thing is: `analysedVowels` becomes `sampledVowels` at `:446`, `:568`, and `:949`, and the parameter `analysedCount` becomes `sampledCount` in `markup/profile-status.ts`. No line count changes.
4. **`markup/MarkupPane.svelte:949`**, one line: `let statusLine = $derived(statusLineFor({ sampledCount: sampledVowels.length, personal: isPersonal(formants), core: stableCore(formants) }, language));`. Add `isPersonal` and `stableCore` to the existing import at `:64`.
5. **Comments.** Rewrite the two the change makes false, in the same commit:
   - `:444-446` points at `analysedVowels` as "what the forecast is built on". After this step it is what the singer sampled; the forecast still rests on placeholders as well. Three lines.
   - `:554-567` justifies reading the snapshot so the count "can never drift from what `analyzeScore` is actually given". Section 2 says why that is now the fault and not the safeguard. The new comment names section B.2 and `cfcd0ba6` as the ruling's records, `usableReadingCount` (`voice/profileStore.ts:196-198`) as the same count elsewhere, and `isSung` (`voice/engine/sung.ts:14-15`) as the one test. Fourteen lines or fewer, and it must not contain the text `snapshot.fR1[`, or the wiring guard of item 7 fails.
   - `markup/profile-status.ts:25-28` says "the count now spans every reading the forecast reads". After this step it spans every reading the singer sampled (`isSung`), provisional and unstable ones included. Rewrite that clause; keep the "DRAFT copy, flagged for Dann (§B.2)" marker.
   - `markup/profile-status.ts:7-8` says "PURE: counts and a language in, strings out". It now takes the voice's state. Rewrite in the same two lines.
6. **Tests**, in `markup/profile-status.test.ts`. The existing cases (`:8-16`) move to the new signature with `personal: true` and `core: ['i','e','ɛ','ɑ','o']`; keep every string they pin, including the zero case. Add, as the behaviour this lane is for:
   - `personal: false`, `core: ['i']`, `sampledCount: 1`: the English reads "You have sampled 1 of the 6 core vowels so far ([i]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 4 more, unsampled vowels are assigned placeholder values." The French of `calib.pane.belowCore` for the same input.
   - `personal: false`, `core: ['i','e','ɛ','ɑ']`, `sampledCount: 7`: the "1 more" form (`calib.pane.belowCoreOne`), so a high sampled count does not silence it. The English reads "You have sampled 4 of the 6 core vowels so far ([i], [e], [ɛ], and [ɑ]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 1 more, unsampled vowels are assigned placeholder values."
   - `personal: false`, `core: []`, `sampledCount: 1`: the list and its parentheses are left out (`analysis/placeholder-line.ts:56`). The English reads "You have sampled 0 of the 6 core vowels so far. To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 5 more, unsampled vowels are assigned placeholder values."
   - `personal: true`, `sampledCount: 5`: "Your profile is now set with five vowels measured."
   - `personal: true`, `sampledCount: 1`: pins the function's singular form. Unreachable from the pane, as the zero case is, because `isPersonal` needs five stable core vowels and each is sampled (`voice/engine/sung.ts:26-30`, `:41`).
7. **The wiring guard**, same file: read the pane as text, `readFileSync('src/lib/markup/MarkupPane.svelte', 'utf8')`, and assert it matches `/const sampledVowels = \$derived\(ROSTER_ORDER\.filter\(\(g\) => isSung\(formants\[g\]\)\)\);/`, matches `/statusLineFor\(\{ sampledCount: sampledVowels\.length, personal: isPersonal\(formants\), core: stableCore\(formants\) \}, language\)/`, and does not match `/snapshot\.fR1\[/` anywhere in the file. The whole-file negative is safe today: `snapshot.fR1[` occurs once in the pane, at `:568`. Title it "counts the vowels the singer sampled, never the values the forecast holds". The exact line is matchable: the tree holds no prettier, eslint, biome, or editorconfig file at the root or in `apps/web`, neither `package.json` names such a tool, and the pane already carries lines of 295 and 249 characters (`:1039`, `:1021`), so a prescribed 152-character line is never rewrapped. Precedent: `components/Drawer/voice-pane-usable.test.ts:23-24`.

**The form of the count, DESK DEFAULT.** Fable's as-built review of lane 68 prescribes `adapted.snapshot.fR1Source?.[g] === 'sung'`. It selects the same vowels, confirmed from the tree by the review of this brief: `voice/engine/resolve-values.ts:78-82` writes `'sung'` for exactly the entries where `isSung` holds, the derived loop writes only where the value is undefined (`:134-136`), the stand-ins likewise (`voice/engine/stand-ins.ts:152-154`, `:173-175`), `analysis/analyze-score-adapter.ts:129` passes `sampled` straight through, and the pane passes its own `formants` (`:550`). Build `isSung(formants[g])`: it is the form INSIGHTS and the placeholder line already use, and it reads the stored readings the pane was handed rather than a field computed from them. Importing `usableReadingCount` was dropped as a desk preference, not on a rule; the pane already imports a type from that module (`:146`). If your Step 0 read contradicts any of this, report it and build nothing until the desk answers.

**Two things to report, not to fix.**
1. `profile.statusSetPlain` (`i18n.ts:1500`) is unreachable from this pane before and after this step. Before: `hasReadings` (`:450`) is true only when a stored reading is `isSung`, and such a reading is counted. After: it is reached only when `personal` is true, which needs five stable core vowels. Leave the key, its branch (`markup/profile-status.ts:31-32`), and the test that pins its words in place.
2. One path could still reach the zero count: `hasReadings` tests every key of `formants`, while the count filters `ROSTER_ORDER` (`:442`), so a stored reading on a key outside the ten vowels (`voice/engine/types.ts:26`) would open the block with a count of zero. With this step that path prints the below-five sentence instead, which is true. Report whether your reading of `voice/profileStore.ts` says such a key can be stored; build no guard for it.

### Step 2. The comment order in `i18n.ts`

`i18n.ts:1351-1354`, comment order only, no string touched. The comment at `:1351` ("the far-off [ɨ]'s two buttons") sits above `calib.summary.unstableOne` (`:1353`), not above its own keys, because lane 68 inserted `:1352-1353` under it. Move `:1352-1353` above `:1351`. The file then reads: the `:1349` comment, `calib.summary.unstable`, the lane 68 comment, `calib.summary.unstableOne`, the two-buttons comment, `calib.summary.keepOne`, `calib.summary.useEstimate`. Same keys, same order of keys, same line count.

### Step 3. The page seen, `vercel.json`, the end gates

1. **The test that would have caught this.** New file `apps/web/e2e/melody-no-score-count.test.ts`, desktop, seeded as the pictures are: (a) one core vowel sampled, voice type soprano, no score, MELODY tab: the first `.profile-status` reads "You have sampled 1 of the 6 core vowels so far ([i]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 4 more, unsampled vowels are assigned placeholder values."; (b) five stable core vowels sampled: the first `.profile-status` reads "Your profile is now set with five vowels measured." Two paragraphs carry that class (`markup/MarkupPane.svelte:1102`, `:1105`), so "the first" is needed. Every seeded reading carries `confidence: 'high'`, as `apps/web/e2e/calibrate-new.test.ts:11` seeds: a reading with `confidence: 'low'` is not stable (`voice/engine/sung.ts:29`) and case (a) would print 0 of 6. Reason: the wiring guard of Step 1 cannot see the page, and no test in `apps/web/e2e/` or `apps/web/e2e-phone/` reads this sentence today (grep for "vowel measured" and "voyelle mesurée" returns nothing in either folder). The pane's line was unchanged from `737228cb` while the sentence went wrong.
2. **Pictures**, saved to `docs/sessions/pictures-lane69/`: MELODY with no score, English and French, phone and desktop, in two states, one core vowel ([i]) sampled and five stable core vowels sampled, voice type soprano. Eight pictures. Look at each, say what the three lines read, and say whether the below-five sentence sits whole on the phone: it is long, and this page gives it less room than INSIGHTS does.
3. `vercel.json` names `cloud-lane-69` alone, in both places (`:3`, `:47`).
4. All eight gates, and Playwright `voice-pane`, `voice-links`, `insights-links`, `calibrate-new`, and the new `melody-no-score-count` (desktop), `voice-stations` and `insights-links` (phone). Change an expectation only where section 1 says the singer now sees that, and list each.
5. **The phone flake.** `apps/web/e2e-phone/voice-stations.test.ts:62` and `apps/web/e2e-phone/insights-links.test.ts:32` flaked 2 of 3 runs at `737228cb`, before lane 68, cause NOT ESTABLISHED. Run those two files three times each and report each run. Change no test for a flake.

## 5. Owns and leaves

Owns: `markup/MarkupPane.svelte` (within its ceiling), `markup/profile-status.ts`, `markup/profile-status.test.ts`, `i18n.ts` (the comment move of Step 2 only), `scripts/ratchets.json` (line 16 only, and only to lower it), `apps/web/e2e/melody-no-score-count.test.ts` (new), `docs/sessions/pictures-lane69/` (new), `vercel.json`. Leaves: every string's text, every other count, `voice/`, `analysis/`, `insights/`, `components/`, `packages/`, `docs/memory/`, every brief.

## 6. Constraints

No pull request; push only `cloud-lane-69`. Change nothing under `docs/memory/`; do not edit a brief. Add no string and change no string's text: both sentences this lane prints are already in `i18n.ts` and both are ratified. One vowel per note is not in scope, and no path here touches seating. NOT ESTABLISHED beats a complete invented answer.

## 7. What the desk could not establish

- Whether the below-five sentence sits whole on this page on a phone. Step 3 item 2 answers it.
- Dann's own words for the section B.2 ruling of 2026-07-15. The tree holds a paraphrase (`markup/MarkupPane.svelte:554-558`) and the message of `cfcd0ba6`; a grep of `docs/memory/*.md` for "B.2" returns nothing.
- Whether a stored voice can hold a reading on a key outside the ten vowels (Step 1, second report item).
- Whether the new desktop Playwright test runs in a cloud session. Step 3 already runs Playwright there, so it is likely; not seen.
- Whether "measured" was ever ratified as the word in the five-plus sentence. `markup/profile-status.ts:25` still marks it "DRAFT copy, flagged for Dann". Outside this lane; no string changes here.
- The cause of the two phone flakes (2 of 3 before lane 68, 3 of 3 after, from lane 68's own runs).
