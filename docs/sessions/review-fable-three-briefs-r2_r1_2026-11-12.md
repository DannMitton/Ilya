# Review: three Code briefs, r2 (Fable, r1, 2026-11-12)

For the desk and Dann. Reviews `brief-code-closing-polish-lane_r2_2026-11-12.md`, `brief-code-rhyme-matcher_r2_2026-11-12.md`, and `brief-code-l17-insights-label_r2_2026-11-12.md`. Code was read in `/home/claude/ilya-shane` at `7fb9cd30` (read-only; nothing built, nothing run from the tree). Rulings were read in `docs/memory/OPEN.md:3564-3695`. The tesseract packages were read from npm this session (`tesseract.js@7.0.0`, `tesseract.js-core@7.0.0`, `@tesseract.js-data/rus@1.0.0`, unpacked in `/tmp/tess`); no code from them was run (the one attempt was refused by the harness). Paths below are under `apps/web/src/` unless they begin with `apps/`, `packages/`, `scripts/`, `tests/`, `data/`, or `docs/`. Terms coined here: "wordless reading" (a scan kept while the scan reader's files answered 404). All other terms are the briefs'.

## Verdicts

| brief | verdict | amendments |
|---|---|---|
| 1. Closing polish lane | SEND WITH AMENDMENTS | 16 |
| 2. Rhyme matcher | SEND WITH AMENDMENTS | 10 |
| 3. L17 | SEND WITH AMENDMENTS | 5 |

The scout's findings (a) to (f) are applied correctly in r2, with two gaps: the builder's test pins the scout listed for step 5 are not in the brief (brief 1, amendment 9), and the scout did not look in `e2e-phone/` (amendment 13). Every file:line the three briefs cite was opened and says what the brief says, within one or two lines. The ratified strings in briefs 1 and 2 match `OPEN.md` character for character, with one fault carried from `OPEN.md` itself (brief 2, amendment 3).

---

## Brief 1: the closing polish lane. SEND WITH AMENDMENTS

### What I checked for step 0b (special attention 1)

The plan works on Vercel. `vercel.json:3` runs `pnpm --filter @ilya/web build`, which is the `build` script the step edits (`apps/web/package.json:10`). The copy script resolves `tesseract.js` and `tesseract.js-core` from the installed packages (`apps/web/scripts/copy-underlay-model.mjs:35-37`); neither package has an `exports` field, so `require.resolve('…/package.json')` holds under pnpm. The destination `static/omr/` is git-ignored (`.gitignore:38`) and written at build, as the metre network is (`copy-metre-model.mjs:20-21`). The source folder `apps/web/omr-underlay/` matches no ignore rule, so the model can be committed as `apps/web/omr-metre/` is. The service worker returns early for `/omr/` (`static/sw.js:112`), so it neither blocks nor stores these files. The content policy needs nothing: the files are same-origin. The header's byte sum is right (7,827,478 + 3,899,472 + 111,307 = 11,838,257). CI builds the app on every push (`.github/workflows/ci.yml`, "Build web app"), and the copy fails loudly, so the lane's first commit must hold the model, as the brief says. Two things the plan misses are amendments 1 and 2.

### What I checked for step 6 (special attention 2)

- **What the photo path loads today.** `createWorker('rus')` (`score/ScoreUploader.svelte:373`) takes tesseract.js's defaults: `oem = OEM.LSTM_ONLY` (`tesseract.js/src/createWorker.js:19`), the worker from jsDelivr (`src/worker/browser/defaultOptions.js`), the core chosen from a jsDelivr directory (`src/worker-script/browser/getCore.js:14-41`), and the model from `https://cdn.jsdelivr.net/npm/@tesseract.js-data/rus/4.0.0_best_int/rus.traineddata.gz` (`src/worker-script/index.js:130`, `:141`; `gzip` defaults to true, `:79`).
- **The package that provides it.** `@tesseract.js-data/rus`, version 1.0.0 (the newest of two). Its file `4.0.0_best_int/rus.traineddata.gz` is 2,679,598 bytes, md5 `9c66849e0afcfd659d613e71695d6f1c`; unpacked it is 5,053,706 bytes. It is an integer model (the folder is named `best_int`).
- **Does `tesseract-core-simd-lstm.wasm.js` load it.** By tesseract.js's own design, yes: that core is the one `getCore.js:33-35` picks for this same default model on any browser with SIMD and without relaxed SIMD. I did not run it. The float-model abort in `ENVIRONMENT.md:4893` is about the relaxed-SIMD core and float models; neither applies here.
- **What naming the core by file changes.** Today a browser with relaxed SIMD gets the relaxed-SIMD core, and a browser with no SIMD gets the plain core. With the file named, every browser gets the SIMD core, and a browser with no WebAssembly SIMD cannot start the photo read. Amendment 10 keeps the brief's choice and asks Code to report it.

### Amendments

1. **Step 0b: scans kept while the files were missing stay wordless.** A reading is kept under the current stamp whether or not the words were read (`omr/scan.ts:98`; a page that answers null takes no words, `omr/underlay-song.ts:4-5`). `UNDERLAY_READER` has been part of the stamp since 2026-11-09 (`omr/stamp.ts:27-31`, `:50`), so every scan read on the alias since then is kept as current, with no words, and is never read again (`omr/restore.ts:41`). Add to step 0b's Change list:
   > 4. Move `UNDERLAY_READER` to `'underlay@6'` (`omr/stamp.ts:50`) and add one sentence to its comment: `underlay@6` reads nothing differently; it marks that the reader's files are served, so a scan kept while they were not is read again once. Move the pins in `omr/stamp.test.ts`. DESK DEFAULT, pending question 1.
2. **Steps 0b and 6: licence texts for what Ilya now serves.** Ilya will serve tesseract.js's worker, its core, and a Tesseract model from its own origin. `NOTICES.md` names none of them (its "Dependencies" section begins at line 49 and lists the scan reader only); the HEIC decoder's licence is served beside it (`static/sw.js:39`). Add to step 0b:
   > 5. The copy script also copies each package's `LICENSE` into `static/omr/models/underlay/` (`LICENSE-tesseract.js.txt`, `LICENSE-tesseract.js-core.txt`), and `NOTICES.md` gains an entry under "Dependencies" for tesseract.js, tesseract.js-core, and (step 6) the `rus` model, each with its version and the licence its own package states. Report the licence text each package ships; write nothing from memory.
3. **Step 1: the band's name half does not change.** The brief says the band's "voice half prints only when the anchor's named line does". Today a named voice with no readings prints "Voice: Dann" in the band while the anchor says "Voice: not yet calibrated" (`components/Drawer/bandState.test.ts:207-209`, `VoiceAnchor.svelte:40-42`). The brief's wording would blank the band for every newly named voice, which no ruling asks for. Replace the bullet's last two sentences with:
   > It follows the anchor in its count only: the count is of usable readings, so a voice whose readings are all refused prints "Voice: {name}" with no count, as a named voice with no readings does today (`bandState.test.ts:207-209`, which stays).
4. **Step 1: one helper, and the further comments.** Add:
   > Put the count in one function beside `hasAnyReadings` (`voice/profileStore.ts:175`), for example `usableReadingCount`, read by both `+page.svelte:1646` and `:1731`. `+page.svelte` is 5515 of 5534. Also correct `VoiceAnchor.svelte:17-20` and `:27`, and `bandState.ts:226-230`, which describe the old rule.
5. **Step 2: where the label comes from.** `singerBlocks` has no voice type: `BlockInputs` carries `generic` and `language` only (`insights/singer-blocks.ts:84`, `:113-114`). Its one caller is `insights/InsightsPane.svelte:348`, a file at its ceiling (744 of 744, `scripts/ratchets.json`). Add to the third bullet:
   > `BlockInputs` gains an optional label (the string `voiceTypePrint` returns), passed at `InsightsPane.svelte:348` at no net cost in lines (744 of 744). Where the label is undefined ("Not sure" with no typed text, `voice/voiceTypes.ts:89`), the line keeps `insights.r2.vowels.against`, as `genericLede` prints nothing in that case (`insights/identity.ts:52`).
6. **Step 3: a fourth pin.** `components/install-prompt-gate.test.ts:34-36` matches the render expression `isChrome ? (t.ios_chrome_body ?? '') : t.ios_body` in the source. Add:
   > Keep that expression as written and wrap it (for example `withGlyph(isChrome ? (t.ios_chrome_body ?? '') : t.ios_body)`), so the pin at `install-prompt-gate.test.ts:34-36` still matches.
7. **Step 4: the fixtures, and the new file's name.** Add to the Tests bullet:
   > Every fixture that builds a libretto entry gains the two fields: `text/poem-library.test.ts`, `text/poem-source.test.ts`, `text/poem-offer-metadata.test.ts`, `tests/build-poem-library.test.ts`.

   Add to the Rebuild bullet:
   > The rebuilt file has a new hash in its name, and `.gitignore:12` ignores `data/dictionary.*.json`; the present file is tracked only because it was added by force. Add the new file with `git add -f`, remove `data/dictionary.poems.d77d09cd.json` with `git rm`, and confirm `data/dictionary-manifest.json` names the new one.
8. **Step 5, item 1: the app does not get a new tokenizer.** The app's word is the whitespace token with punctuation and dashes removed (`pipeline.ts:586`, `:671`), so «peut-être» is one `cleanWord`. A second definition inside `latin.ts` would disagree with it, and the builder is a plain `.mjs` that cannot import the app's TypeScript. Replace item 1 with:
   > 1. One test of a Latin word: at least one letter, and every `\p{L}` in it is `\p{Script=Latin}`. The app applies it to `cleanWord` as it stands (`pipeline.ts:586`, `:671`); it does not split words again. The builder applies it to each run of `[\p{L}\p{M}]`. The two copies are held equal by one test that runs the same word list through both («à», «cœur», «et», «мeня» with a Latin e, «c», «amen»).
9. **Step 5, item 2: the look-alike guard, and the builder's pins.** "Between Cyrillic words" misses a look-alike at a line's start or end («C тобой» with a Latin C). Replace the second guard with:
   > a one-letter Latin word in a line that also holds a Cyrillic word is refused (a look-alike typed for a Russian word). Add the test «C тобой» with a Latin C: fails.

   And add:
   > Move the builder's pins: `tests/build-poem-library.test.ts:176` (the fault table's Latin row, which stays a fault as a glued letter) and `:384-387`, where `textFault(quoted)` for a poem is pinned to `'a Latin letter'` and now passes. `textFault`'s second parameter (`scripts/build-poem-library.mjs:122`) goes if nothing needs it.
10. **Step 5, item 4: its scope, and the computations list.** `markLatinWords` sees the lines of one `processText` call (`pipeline.ts:487`), and several callers pass less than a song (`underlay-seams.ts:59`, `text/poem-join-wire.ts:34`, `score/vowel-resolver.ts:476`, `score/clitic-seat.ts:491`). Add to item 4:
    > "The song's text" is the lines of one `processText` call. Report, for «Семинарист» as a seated song, whether MELODY and INSIGHTS still show the table's IPA (they take Lyrics' transcription), and name any caller whose text is too short to hold two nouns.

    Add to "Computations this lane changes": "Step 5 also changes which Latin words carry IPA (`latin.ts:75-78`, item 4); its one reader is `markLatinWords`, and the Richter credit follows it (`latin.ts:99-101`)." Add to item 5: "`NOTICES.md:17-28` says the pronunciation is Richter's; do not edit it in this lane; report it as owed with the footer's wording."
11. **Step 6, the photo path: name the model and the cost.** Replace "the same `rus` model the photo path reads today, served from Ilya's site" and the two sentences after it with:
    > the model the photo path reads today: `4.0.0_best_int/rus.traineddata.gz` of `@tesseract.js-data/rus` 1.0.0 (2,679,598 bytes, md5 `9c66849e0afcfd659d613e71695d6f1c`; `tesseract.js/src/worker-script/index.js:130`). Add the package to `apps/web/package.json` at exactly `1.0.0`, and have `copy-underlay-model.mjs` copy the file, as it is, to `static/omr/models/underlay/rus.traineddata.gz`. Pass `workerPath`, `corePath`, and `langPath` only (from `recognizerPaths`, `omr/underlay-recognize.ts:36-42`); keep tesseract's defaults for `gzip` and `cacheMethod`, so the model is unpacked and kept on the device as it is today. Do not pass `gzip: false` or `cacheMethod: 'none'`. `ScoreUploader.svelte` is at its ceiling (867 of 867): the call's options come from one imported helper, and step 9's removal of the comment at `:145-147` pays for any line. Rewrite `e2e/heic-reader-path.test.ts:41-60` (`serveOcrLocally` and its jsDelivr route), which the change makes dead. DESK DEFAULT: the core is the SIMD core named by file, as for the scan reader; a browser with no WebAssembly SIMD then cannot start the photo read. Report whether such a browser reaches this path today (the page reader runs before it). The desk tells Dann 2,679,598 bytes before the ship (CONTRACT §8).
12. **Step 6, the fonts: which files.** Google serves these families as variable files cut into `unicode-range` subsets; Source Serif 4 carries an optical-size axis (`app.html:49`, `opsz 8..60`), and the underlay width table was measured from Google's own files (`packages/score-parser/src/underlay-widths.ts:46-57`). A different cut moves layout. Add:
    > Take the files Google serves today: fetch the two stylesheets (`app.html:49`, `+page.svelte:3675`) with a current Chrome user agent, download every woff2 they name, and keep their `@font-face` blocks unchanged (family, style, weight range, `unicode-range`, `font-display: swap`) with the URLs pointed at `static/fonts/`. List each file with its source URL, bytes, and sha256. If the lane cannot reach Google's hosts, stop and report; do not substitute another build of the fonts. Do not edit GUIDE's Fonts sentence (`GuideContent.svelte:589`, `:302`); see question 2.
13. **Step 7: three presses in the phone suite.** Add: "`e2e-phone/text-witness.test.ts:80` (`Control+V`), `e2e-phone/relining.test.ts:88` (`Control+z`) and `:118` (`Control+End`) take the same treatment."
14. **Step 8: keep the guard from firing on ordinary French.** « la 2e », « si 3 mesures » would match a loose pattern. Add: "The octave digit is 0 to 8 and is not followed by a letter, a digit, or an ordinal mark; a name is matched as a whole word. Where a real sentence still trips the test, list it by file and line in the report; do not reword ratified text to pass."
15. **Step 9b: the glyphs follow the file.** `OPEN.md:3692-3693` holds the words with straight quotes and plain spaces. GUIDE uses ’ and “ ” in English (218 and 4 uses) and a literal U+00A0 before colons and inside guillemets in French (`GuideContent.svelte`, read as bytes). Add: "English takes ’ and “ ” as the section does; French takes U+00A0 as a literal character, not `&nbsp;`. « d’<em>Ilya</em> » keeps the apostrophe outside the italics."
16. **L17's place in this lane.** See brief 3, amendment 3: its measure joins step 0, its fix sits before step 12.

---

## Brief 2: the rhyme matcher. SEND WITH AMENDMENTS

### The order and the checkbox (special attention 3)

The order is right: the singer's set-aside, then the rhyme, then the stage default. It follows the 20:53 ruling (no date switch), the 21:09 and 21:11 rulings, and the 23:05 ruling (ticked, the word takes the stage reading). Nothing in `OPEN.md:3564-3695` conflicts with it. The placement is right in kind and needs two changes of substance: amendments 4 and 7.

### Amendments

1. **Step 4: both notes are standalone.** The composer prints a letter's identity sentence before a process unless the process is marked `standalone` (`packages/blurb/src/composer.ts:384-388`). The identity of ⟨и⟩ says it "usually sounds like /i/; in sung Russian, neither stress nor position reduces it" (`data/blurb-composer.json`, `identities.и`), which contradicts both notes. Both ratified notes open with their own "⟨{char}⟩ is [{ipa}]". Add to step 4: "Both processes carry `\"standalone\": true`, as 65 processes in the file do. Test: neither composed note contains the identity sentence."
2. **Step 4: how the two citations are stored.** A second source rides after ` + ` in a process's `citation` (`composer.ts:110-117`, `:140`; one process does this today, `regressive-dental-dp-differs`). Add: "Stage note: `\"citation\": \"pp. 301–303 + Avanesov 1989, p. 660\"`, which prints (Grayson, pp. 301–303; Avanesov 1989, p. 660). R1: `\"citation\": \"p. 302\"`. Pin both printed citations."
3. **The French colon in the stage note.** The brief's literal, and `OPEN.md:3686`, hold a plain space in « reste dure : c’est ». The blurb file has 43 no-break spaces before colons and no plain one. Under the French stage note, add: "The space before the colon is U+00A0; write it as ` ` in the JSON, and pin it."
4. **Step 5: the checkbox shows while a rhyme is found, ticked or not.** As written ("drawn only while a rhyme reading is in force on the word"), ticking the box ends the rhyme reading, the box vanishes, and the singer cannot untick it. Replace that clause with:
   > drawn on every word the matcher matches, ticked or not. The match is computed before the set-aside is applied and rides on the word (a new optional field on the word's data, `types.ts`, holding the partner), so the Inspector can draw the box for a word that reads stage because the singer said so. A set-aside trigger still links its rhyme group. Test: tick, the reading is [kɨj] and the box is still drawn and ticked; untick, [kʌj] returns.

   This reads the 23:05 ruling ("shown only on a word with a rhyme reading in force") as "a word whose rhyme Ilya found". DESK DEFAULT.
5. **Step 5: how the set-aside reaches `processText`.** Add: "`ProcessTextOptions` (`types.ts:172-185`) gains the set of set-aside word keys. Three calls pass a witness's marks and pass this too: `+page.svelte:444-447`, `:1806-1809`, and `text/witness-lines.ts:29-33` (whose `WitnessMarks`, `:20-23`, gains the map). `+page.svelte` is 5515 of 5534."
6. **Step 5: the save's trap.** `mapsFromRows` ends in a bare `else spot.set(…)` (`library/word-mark-rows.ts:163-166`), so a new kind added to `MARK_KINDS` (`:38`) would be loaded into `spot`. Add: "Make that `else` name `spot`, and give the new kind its own branch there, in `validValue` (`:56-71`), and in the row writer (`:125-136`). An older build drops a row of a kind it does not know and keeps the rest (`:94`); test that. The per-word reset is `lib/word-reset.ts` (`:21`, `:31`, `:57`), not under `library/`."
7. **Step 5: paying for the Inspector, and the usual case.** `InspectorPanel.svelte` is 2431 of 2432, and a second checkbox costs about ten lines. A matched word reads [ʌ], which Reconstitution turns to [ɑ], so `canSpotToggle` (`InspectorPanel.svelte:67-69`) is true for nearly every matched word: two boxes is the usual case, not the rare one. Add: "Move the slot's contents (`:1009-1020`) into a small component that takes the boxes to draw, so `InspectorPanel.svelte` does not grow. Capture the Inspector with both boxes at 390 px and at desktop width, EN and FR, for the desk." The label's key is Code's to coin; pin both strings.
8. **Step 2: what is compared, and what is printed.** Add to rule 2: "Compare the engine's output, before any notation preference (ʌ or ə) and before Reconstitution." Add to step 3: "`features.word` is the partner's `cleanWord` as typed, without punctuation."
9. **Step 3: the library pin is read before it is accepted.** The library has grown from 14 to 327 entries of mostly nineteenth-century verse, so matches are likely. Add: "For each match, report the two lines, the poem's title, and both transcriptions. The desk reads each pair before the lane merges."
10. **Computations: one more site, and one known limit.** Add `+page.svelte:444` (the derived poem) to the list of sites that reach the reading through `processText`; `underlay-seams.ts:59` belongs with the one-line sites. Add: "Where Poem has verse lines and Lyrics does not, Poem shows [kʌj] and Lyrics, MELODY, and INSIGHTS show [kɨj] (Fable's review, finding 6, last bullet). Left as is for the share; do not build a carriage for it."

---

## Brief 3: L17. SEND WITH AMENDMENTS

The citations are right (`insights/PitchSeconds.svelte:43-44`, `:99-104`, `:125-126`, `:133`, `:140`; `i18n.ts:2067`, `:2027`). By the figure's own arithmetic the label has 114 px (`:43-44`: 120 px kept right of the bracket, less the 6 px offset), and the French string is 66 characters, so a clip is likely in both languages. That is arithmetic, not a measurement; step 1 stands.

### Amendments

1. **Step 2: measure in the real font.** The page's fonts load with `display=swap` (`app.html:49`), and brief 1's step 6 keeps that. A width taken before the font arrives is the fallback font's. Add: "Measure after `document.fonts.ready`, and again if the fonts load later, so the lines are cut for Source Sans 3, not for the fallback."
2. **Step 2: the figure's height feeds the page breaks.** INSIGHTS measures every block at its printed width and places it by that height (`insights/paginate.ts:5`, `:66`). A figure that grows after it was measured prints over what follows. Add: "The pane measures the figure after the wrap has settled. Done when, in French and English at 390 px and at letter width, no page's content reaches its footer and the pages Chromium prints equal the sheets on screen (the checks of `e2e/pages-without-gaps.test.ts`), with a typed tessitura of two semitones (the tallest stack beside the shortest bracket)."
3. **Riding in lane 48.** Step 1 ends with a stop for the desk's read, which would hold lane 48's close. Replace "it may ride … as a last step" with: "In lane 48, step 1 (measure) runs with step 0's readings and is reported there; step 2 (fix) runs after step 11 and before step 12, only if the desk has answered. If the desk has not answered by then, lane 48 closes without it and L17 takes its own lane."
4. **A done state a test can hold.** Add to step 2: "A Playwright test asserts, at 390 × 844 in French and English, that the right edge of every line of the bracket's label is at or left of the svg's right edge, and that the label's words, joined, equal `insights.r2.yourTessitura`."
5. **Print.** Add to step 3: "Print INSIGHTS to PDF in French at letter size and report whether the label is whole there."

---

## Questions for Dann

1. **Scans read while the reader's files were missing.** Every scan read on the Shane address since 2026-11-09 was kept with no words and will never be read again as things stand. I have amended brief 1 so that each of those scans is read again once, on its next opening, with words. A second reading replaces the first, and I could not establish what happens to corrections you have already made on such a scan. Recommendation: yes, read them again. Cost of no: those songs stay wordless until the scan is uploaded again. Yes or no?
2. **GUIDE's Fonts sentence, English and French.** It says "Every embedded font" and names Bravura, Leland, Finale Maestro, and Lato. Once step 6 ships, Ilya also embeds Source Sans 3, Source Serif 4, Noto Sans, and Noto Serif. The sentence needs those four names and their copyright lines, in both languages, which is your text and your French. The desk drafts from each font's own licence file; the lane ships the fonts with the sentence unchanged unless you ratify the draft first.

## What I could not establish

- **Whether the SIMD core loads the integer `rus` model, by a run.** Read from tesseract.js's source only; the Node check was refused by the harness. Step 6's Playwright read settles it.
- **The licence of the `rus` model.** The npm package states MIT. That Tesseract's own tessdata is Apache 2.0 is my memory, not read this session. Amendment 2 has Code report what the package ships.
- **What `rus_prereform_r2_29000` was trained from**, and so what licence terms it carries into a public repository. The 7.8 MB file enters the repository's history on Dann's ship and cannot be taken back out in practice. Not a question for today, since the ship is already planned; the desk may want one line in `NOTICES.md` on the model's origin.
- **What a second reading does to a singer's corrections** on a scan (question 1).
- **Vercel's storage meter.** From the project's memory file (`vercel-deployment-storage.md`, 2026-10-23): the team sits near its 10 GB Deployment Storage limit, and a blocked deploy looks like a build that never appears. Steps 0b and 6 add about 15 MB plus the fonts to each deployment. Where the meter stands today is not known to me.
- **Whether the cloud lane can reach `fonts.gstatic.com`**, and how many woff2 files the two stylesheets name.
- **Whether the lane can run a scan read in Playwright** (it needs homr's 213 MB of models at build).
- **N.17's spec.** It is a project file; I have no tool that reads it here. Step 11's account of it is the desk's.
- **What MELODY shows for a voice whose readings are all refused**, and what the Inspector draws for a null blurb beyond the string at `InspectorPanel.svelte:1386` (`inspector.noBlurb`).
- **Whether any text in the 327-entry library trips the new one-letter guard.** One line in the library holds Latin letters today (Robert's aria, «С своими "benedicite" и "amen",»), and it passes.
- **The two test files step 1 of brief 2 names** (`notation-edge-cases.test.ts`, `engine.test.ts`) were not opened.
- **Whether anything clips at 390 px** in INSIGHTS' pitch figure: arithmetic only.
