# Report: integration step 11 (11a, 11b, 11c), 2026-11-10

Branch `cloud-lane-38`. The desk read Grayson 2012 p. 240 (PDF p. 256): «гк» is /xk/ in мягко and легко and /xʲkʲ/ in мягкий and лёгкий, "within a word"; p. 17 was a correction of another author, not the rule. Nothing pushed to `Shane` or `main`; no pull request; `docs/memory/` untouched.

## 11a. The rule follows the к (`packages/phonology/src/lexical-gk.ts`)

- ⟨г⟩ is **[x] before a hard [k]** and **[xʲ] before a soft [kʲ]**, in the roots мягк- and лёгк-/легк-. The replacement is `[kɡ]ʲ?(?=ˈ?k(ʲ?))` to `xʲ` when the к that follows is soft, `x` otherwise.
- **«мягкий»** keeps [x]: the engine's stage profile keeps the к of -кий hard (`mʲɑxkɨj`), so Dann's letter name `[ˈmʲɑx kɨj ˈznɑk]` stands and LEARN's row is unchanged (its pin test passes). «мягкие», «мягким», «мягки», «лёгкие», «лёгких», «легки» take [xʲ] before [kʲ] (`mʲaxʲkʲijɪ`). «лёгкий» keeps [x] by the same stage profile, where Grayson prints /xʲkʲ/; the desk accepted this for «мягкий», and I did not widen it.
- **The file's comment is rewritten:** it cites p. 240 as the rule, quotes the sentence, says p. 17 is a correction of another author and not the rule, says it holds only within a word, and drops the claim that Grayson's [x] is plain before [kʲ].
- **Tests (`tests/lexical-gk.test.ts`, 15):** nine hard-к forms (мягкий, мягкая, мягко, мягкость, лёгкий, лёгкая, легко, лёгкость, нелегко) show [xk] and no [ɡ], [k], or [xʲ]; six soft-к forms show [xʲkʲ]; «смягчить» and a non-root гк are untouched.

### Dictionary headwords whose IPA now changes from step 9's output

**57 headwords and 3 song lines,** all the soft-к forms, each only in the г: [x] becomes [xʲ] (for example «мягкие» `ˈmʲax kʲi jɪ` to `ˈmʲaxʲ kʲi jɪ`, «лёгких» `ˈlʲox kʲix` to `ˈlʲoxʲ kʲix`, «легки» `lʲix ˈkʲi` to `lʲixʲ ˈkʲi`). The three lines are the two «лёгких/лёгким» lines and the «легки» line. Full list with the original, step 9's, and the present form: `report-code-integration-step11-changed-words_r1_2026-11-10.md`. The hard-к forms (мягкий, мягкая, мягко, мягкость, лёгкий, легко and the compounds) are unchanged from step 9.

## 11b and 11c. The blurb sentences, as ratified

`data/blurb-composer.json`, `lexical-gk:г`: the two sentences exactly as Dann ratified them (2026-11-09 20:12), replacing the ones I had proposed, with **citation `p. 240`** (the process's alone; the composer prints it beside the г identity's own page, so the Inspector shows "(Grayson, pp. 145, 240)"). EN "Within a word, ⟨г⟩ before ⟨к⟩ is read [x], or [xʲ] before a soft [kʲ]: Grayson’s мягко/мягкий rule, found in a few very common words such as мягкий and лёгкий." FR "À l’intérieur d’un mot, ⟨г⟩ devant ⟨к⟩ se prononce [x], ou [xʲ] devant un [kʲ] palatalisé : c’est la règle мягко/мягкий de Grayson, propre à quelques mots très courants comme мягкий et лёгкий." with U+2019 apostrophes and U+00A0 before the French colon (written as ` ` in the JSON, as the file's other no-break spaces are). **Cyrillic checked by script:** every Cyrillic word in both sentences uses letters of the Cyrillic block only (the «л» is U+043B, CYRILLIC SMALL LETTER EL, and «ё» is the single character U+0451).

- **The held test:** `packages/blurb/tests/lexical-gk.test.ts` pins both sentences and the citation (it passes on the ratified text; it was written to fail until the text arrived). `apps/web/src/lib/insights/ratified-lines.test.ts` has a new block pinning the data file's two sentences, the citation, and the «л» (+2). The blurb package still prints no "stays" or "softens" for this г.
- **The blurb text has no {ipa} placeholder** (it names [x] and [xʲ] itself), so it reads the same for «мягкий» and «мягкие».

## Gates (baseline on Shane, then at step 12's code; step 11 itself ran the same suite)

Gates were run at the end of steps 11 and 12 together (the desk's order was one run for both): all eight pass; phonology 456 (+21 from step 9; step 11a replaced 15 tests with 15), blurb 168, web 4707 (see step 12's table), the others unchanged.

Playwright, both projects, on the same final code: **160 passed, 11 failed, 2 skipped** (36.0 min), both projects, `--trace off`, Chromium `/opt/pw-browsers/chromium`, on the final code. The 11 are the same ones red on Shane (listed in step 7's report): `glue-typed-marks` ×2, `heic-reader-path`, `insights-page`, `loupe-header`, `print-pages`, `singer-paths`, phone `input-views:134`, `phrase-ends:26`, `relining:70`, `relining:95`. None is new.

## What I could not establish

- **That Grayson's /xʲkʲ/ for лёгкий should be reached:** the engine's hard к makes it [x] (as for «мягкий»); I did not change the stage profile.
- **How «мягкие» (soft) reads against the Inspector's earlier "softens" line:** now the ratified line.
