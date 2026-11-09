# Report: integration step 9, г before к is [x] in мягк- and лёгк-/легк-, 2026-11-09

Branch `cloud-lane-38`. Ruled by Dann 2026-11-09 15:42: the letter name is `[ˈmʲɑx kɨj ˈznɑk]`; Grayson 2012 p. 17 (PDF p. 33) gives «мягкий» as /ˈmʲɑx-kʲij/ (read by the desk; the [kɨj] ending stays as the engine has it). Two code commits (the rule; the LEARN table) and this report. Nothing pushed to `Shane` or `main`; no pull request; `docs/memory/` untouched.

## The rule (`packages/phonology/src/lexical-gk.ts`, new, beside `lexical-exception.ts` and `lexical-r.ts`)

- **Why [k] before:** regressive devoicing turns the г of «гк» into [k] (before a soft к, the engine left it as palatalized [ɡʲ]); no rule gave [x]. I read `engine.ts` (the consonant map at `:222`, `applyRegressiveVoicing`, and the word-final rule near `:1727`) and found none, as the desk did.
- **What it does:** a word containing the roots мягк or легк (ё folded to е, so лёгк- is covered) has the first [k], [kʲ], [ɡ] or [ɡʲ] that is followed, through an optional stress mark, by [k], made a plain [x]. The log's г entry follows (`ipa 'x'`, `features.lexicalGk`), and the syllable sync after it carries the change into the syllables.
- **Hook:** one existing engine line, `ipa = lexicalGk(cleanWord, this.applyRegressiveVoicing(ipa), transcriptionLog);`, and its import on an existing import line, so `engine.ts` stays at 2048 of 2048 and the ceiling is untouched.
- **Restricted to the two roots,** not every гк: «смягчить» (мягч-, no гк) is untouched, and so is any гк in a word without the roots (`дагка`, `подгонка` in the tests). The match is on the root anywhere in the word, so a derivative that keeps it is covered (нелегко, слегка, легковой, мягкосердечный, легкомыслие, легкоатлет).
- **Plain [x], not [xʲ]**, also before a soft к (мягкие → [ˈmʲax kʲi jɪ]): Grayson prints plain /x/ before his soft /kʲ/.
- **Tests** (`tests/lexical-gk.test.ts`, +21): 15 listed forms (мягкий, мягкая, мягко, мягкость, мягкие, мягким, мягки, лёгкий, лёгкая, лёгкие, лёгких, легки, легко, лёгкость, нелегко) each show [xk] and no [ɡ] or [kk]; «мягкий» is `mʲɑxkɨj`; the log flag; the syllables in step; «смягчить» and a non-root гк are untouched; the index of the г per root. Phonology: 435 to 456.

## The table (LEARN row «мягкий знак», both languages)

Step 5d's check, re-run: the engine's output for «мягкий знак» is now `[ˈmʲɑx kɨj ˈznɑk]`, which is Dann's ruled form; both copies of the row now print it, and `learn-letter-names.test.ts` (75 tests) follows (it compares to the engine, so no pin was hand-edited). This also closes the doubt in step 5d's report about that row's [k].

## Every other word whose IPA changes

Full list with before and after: **`report-code-integration-step9-changed-words_r1_2026-11-09.md`**. I ran the real engine (`processText`, real dictionary and singer supplement) at the parent commit and at the rule commit over every dictionary headword that matches the roots (368) and over every line of the bundled song texts that matches (the poems library, `tools/poems/library.json`, the arias file: 15 lines).

- **368 of 368** matching headwords change, each only in that one segment (for example «мягкий» `ˈmʲɑk kɨj` to `ˈmʲɑx kɨj`, «лёгкий» `ˈlʲok kɨj` to `ˈlʲox kɨj`, «легко» `lʲɪk ˈko` to `lʲɪx ˈko`, «мягкие» `ˈmʲaɡʲ kʲi jɪ` to `ˈmʲax kʲi jɪ`). None matches the roots and stays unchanged.
- **15 song lines** change, all «легко», «лёгкий», «лёгкою», «мягка», «слегка» (listed in the file).
- **For the desk to judge,** since the rule matches the roots wherever they occur: the compounds (мягкосердечный, легкомыслие, легкоатлет, слегка), the phrase entries (мягкая власть, мягкий знак), and «лёгкие/лёгких» as the noun "lungs" («воспаление лёгких»), all now take [x]. I think the compounds and «слегка» are right (same root); the lungs noun is the same spelling and I applied the rule to it. If the desk wants any of these out, it is a lexeme list in `lexical-gk.ts`.
- **Words outside the roots:** none changes (the scan is of the roots' matches only; I did not diff the whole dictionary, since the rule is gated on the roots by construction and the web, blurb, and integration suites show no other IPA moving).

## Gates (baseline on Shane, then at this step)

| Gate | Baseline | Now | Move |
|---|---|---|---|
| 1 phonology | 407 | 456 | +49: 28 (row 157), +21 here |
| 2 dictionary | 248 | 248 | none |
| 3 web check | 0 errors, 12 warnings, 5 files | same | none |
| 4 web unit | 4198, 1 skipped | 4683, 1 skipped (4684) | +485, no move this step |
| 5 score-parser | 785, 5 skipped | same | none |
| 6 blurb | 148 | 164 | +16 (row 157) |
| 7 integration | 125 | 125 | none |
| 8 ratchets | OK. | OK. | none |

## Playwright (both projects)

**160 passed, 11 failed, 2 skipped** (37.1 min): the same 11 that are red on Shane, none new (step 7's report lists them). No spec reads «мягкий».

## What I could not establish

- **That [x] is right for every form** (I rely on Grayson's «мягкий» and Dann's ruling; no second source for лёгк-, the plural «мягкие», or the compounds).
- **How the Inspector explains the г.** The log flag is `lexicalGk`, which the blurb package does not know; I did not read what blurb it composes for a г shown as [x] with that flag (the console printed "Missing identity" lines for some letters in step 5d's run; I did not check this one). Likely the generic consonant text; not verified.
- **The rest of the dictionary:** not diffed (above).
