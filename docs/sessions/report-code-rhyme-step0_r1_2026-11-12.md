# Report: rhyme matcher, step 0 (read and measure) (Code, cloud lane 49, r1, 2026-11-12)

Branch `cloud-lane-49`, cut from `origin/Shane` at `dc078b9` ("Scan reader's model for the build; ..."). The local `Shane` branch in the sandbox was stale (`4d73284`); the brief's tip is the remote's. Working tree clean at the cut. The branch's upstream was unset so a bare push cannot reach `Shane`. Fresh clone, `pnpm install --frozen-lockfile`, Node 22.23.4, pnpm 10.28.0, Linux. Nothing changed in this step but this file.

## The eight gates at `dc078b9`

| gate | result |
|---|---|
| phonology | 456 passed, 14 files |
| dictionary | 248 passed, 4 files |
| web-check | 0 errors, 12 warnings, 5 files |
| web-test | 5190 passed, 1 skipped (5191), 280 files |
| score-parser | 785 passed, 5 skipped (790), 35 files |
| blurb | 168 passed, 4 files |
| integration | 155 passed, 7 files |
| ratchets | OK |

Playwright was not run (outside the eight gates; it runs at step 6).

## Ceilings (`scripts/ratchets.json`) against `wc -l`

`engine.ts` 2048 of 2048. `pipeline.ts` 901 of 901. `InspectorPanel.svelte` 2431 of 2432. `+page.svelte` 5515 of 5534. `ScoreUploader.svelte` 867 (not touched here).

## Cited lines: read, and where they moved

Read at `dc078b9`. "Same" means within the brief's number; otherwise the current line is given.

- `engine.ts:27-28` `adjectival: 'stage' | 'modern'`: now `:28`, interface at `:26-29`. The stage-only velar test is `if (config.adjectival === 'stage')` at about `:1360` (brief `:1361`). The vowel branch (`vowelIpa = 'ɨ'; exception = 'velar-adjectival'`, guarded by `config.adjectival === 'stage'`) is at about `:1523-1527`. The `русский` family is in `exceptionWords` near `:516-530` and the guard at `:631-634`. Same within a line or two.
- `pipeline.ts`: `processText` at `:230` (same). `endsStanza` at `:257-260` (same). Stress rules at `:645-668` (same). `pos`, `isHomograph` at `:731`, `:733` (same). `chosenBySinger` (the `user-` test) at `:415-417` (brief `:417`). Engine call at `:805-811` (same).
- `composer.ts`: `composeBlurb` at `:284` (same), key `rule:char` built at `:297`, the null return after `console.warn("Missing process")` at `:341-342`, `word` var at `:358`, `standalone` skip at `:384-388`, ` + ` second source at `:110-117`. Same.
- `types.ts`: `ProcessTextOptions` at `:172-185` (same).
- `word-marks.svelte.ts`: `spot` at `:35`; `load`, `maps`, `clear`, `carry` at `:38-63` (same).
- `library/word-mark-rows.ts`: `MARK_KINDS` `:38`, `validValue` `:56-71`, the older-build drop `:94`, row writer `:125-136`, the bare `else spot.set(…)` `:163-166`. All same. `lib/word-reset.ts` `:21`, `:31`, `:57` (same).
- `InspectorPanel.svelte`: `spotCheckboxLabel` `:60-64`, `canSpotToggle` `:67-69`, the slot `:1009-1020`, null-blurb string `:1386`. Same.
- `witness-lines.ts:29-33`, `WitnessMarks` `:20-23`; `+page.svelte:444-447`, `:1806-1809`. Same.
- `underlay-seams.ts`: the brief says `:59`; the file is `lib/underlay-seams.ts` (not under `score/`) and `:59` is the one-line `processText(line, { language: 'en' })` default. Same line.
- `vowel-resolver.ts:476`, `clitic-seat.ts:491`, `poem-join-wire.ts:34`: each calls `processText` on one unbroken line of words. Same.

No cited line was found missing. I did not re-read `vowel-resolver.ts:334-341`, `underlay-donor.ts`, or `reconstitution.ts:63`; they are read when the step that depends on them runs.

## Things the brief asked me to report

- **The library:** `data/dictionary.poems.d77d09cd.json` holds `version` and `entries`, 327 entries, as the brief says.
- **What the Inspector draws today when `composeBlurb` returns null** (read from code, not run): `hasBlurb` (`InspectorPanel.svelte:439-444`) is false when `entry.blurbData?.blurb` is empty, and the branch at `:1386` then prints `inspector.noBlurb`, "No phonological note for this character." / « Aucune note phonologique pour ce caractère. ». The composer also logs `console.warn('[BlurbComposer] Missing process: "velar-adjectival:и"')`. I did not confirm by a render that a null result reaches that branch rather than hiding the box; step 4 will.

## What I could not establish

- Whether the Inspector actually draws the `noBlurb` string for a stage ‑кий ⟨и⟩ in the running app. Read from code only.
- Playwright's state at the cut (not run in step 0).
- The save's other sites the scout listed (`library/word-mark-rows.ts` and `word-reset.ts` are read above; I did not look for further ones beyond them).
- `underlay-donor.ts` and `vowel-resolver.ts:334-341`, unread so far.
