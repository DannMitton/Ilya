# Report: consistency batch 2, step 5, the key index (Code, cloud lane, r1, 2026-11-02)

Read at: branch `cloud-lane-27`, parent `4432c0a2` (step 4). Working tree clean before the step.

## What changed, file by file

- `apps/web/src/lib/i18n.ts` (header comment only; no key or value changed; the file is exempt from the size ratchet): the index is rewritten and stays hand-written, as review amendment 13 rules.
  - The total is counted, not typed: "This file holds 1,119 keys." (the old text said 881; the audit parsed 1,023; `stringKeys().length` is 1,119 at this cut). 63 prefixes, all with a dot.
  - The four prefixes that had keys and no line are added: `field` (1), `octave` (5), `placeholder` (7), `tempo` (3). Stale counts are corrected (for example `insights` 91 to 142, `loupe` 54 to 107, `intake` 20 to 36, `inspector` 32 to 36, `upload` 75 to 78, `toc` 83, `profile` 34); every count now comes from `stringKeys()`.
  - Each prefix's files were re-found by searching `apps/web/src` (tests, `i18n.ts`, and `names.ts` excluded) for string literals beginning with the prefix, then checked key by key where the count was low. `Tessituragram.svelte` is not named as a consumer any more. `app.title` has a consumer (`HeaderBar.svelte`); `app.subtitle` has none. `clitic`, `display`, `engraving`, `provenance`, `result`, `witness` have no literal consumer; `stress` is read through `stressSourceLabel`; `underlay.heading` is read only by `names.ts`.
  - A paragraph says some keys are built at run time (`watch.key.letter.${letter}`, `comment.<register>.<part>`), so a literal search can come back empty for a live key. In the tree, 18 prefixes have five or more keys with no literal reference (for example `loupe` 41 of 107, `voiceIntake` 53 of 60), which is why the index lists files by prefix.
  - "THREE LEGACY KEYS" is rewritten to what is true: `group.scoreMarkup` reads VOICE; `tab.markedScore` reads MELODY; `insights.fit.*` is the INSIGHTS measurement table read by `FitTable.svelte`, which nothing imports (checked: no reference outside its own file). Batch 3 renames the first two (`tab.melody`); batch 4 decides the third.
  - Paths: five lines name `lib/markup/` (`key`, `legend`, `profile`, `vowel`, `watch`, and `tab` through `MarkupPane`); batch 3 renames that folder and the same test re-runs.
- `apps/web/src/lib/i18n-index.test.ts` (new, 5 tests, about 50 lines, no dependency): reads `i18n.ts` as source, takes the lines between "THE KEY PREFIXES ARE THE FEATURE INDEX" and "THREE LEGACY KEYS", and fails when a prefix in `stringKeys()` has no line, a line names a prefix with no keys, a line's count differs from the real count, the stated total (or the sum of the lines) differs from `stringKeys().length`, or a path named on a line does not exist under `apps/web/src/`. It also checks it is not vacuous (more than 40 lines and 40 paths).
- `docs/house-style/code-conventions.md`: one more statement of fact corrected. It said "the 30 kebab-case `legend.*` keys". The tree has 94 keys with a hyphen in a segment (`legend.` 5, `toc.` 64, `voiceType.` 25), counted from `stringKeys()`. The ruling that they stay until batch 3 is unchanged.

## Why no script (amendment 13)

A regex over the file reads 1,114 keys against `stringKeys()`'s 1,119, so a script run by `scripts/ratchets.mjs` (which cannot import TypeScript) would start five short. The glosses and the dynamic consumers need a reader. A test imports the real key list for nothing.

## Positive control

Five plants against the real file, each restored from a saved copy (a clean diff and 5 of 5 passing afterwards): a stale count (`loupe` 106; failed the count test and the total test); a deleted line (`tempo`; failed the prefix test and the total test); a path that does not exist (`lib/tempo/Gone.svelte`; failed the path test); a wrong total ("881 keys"; failed the total test). One earlier plant was reverted with `git checkout`, which also discarded my uncommitted rewrite of the index; I regenerated it from the saved script and re-ran every check above.

## The eight gates

Phonology `Tests  407 passed (407)`; dictionary `248 passed (248)`; web-check `svelte-check found 0 errors and 12 warnings in 5 files`; web-test `Tests  3843 passed | 1 skipped (3844)` (3838 plus 5); score-parser `785 passed | 5 skipped (790)`; blurb `148 passed (148)`; integration `98 passed (98)` (after `svelte-kit sync`); `ratchets: OK.` (626 files).

## Legend lines whose truth depends on batch 3 (from steps 2, 3, and 5)

`ARCHITECTURE.md`: the `markup/` and `MarkupPane.svelte` bullet, invariant 13's list, the `shane.profiles.v2` clause, and the Names table's `code today` and `folder today` cells for MELODY and VOICE. `AGENTS.md`: "code name today: `markup/`". `i18n.ts` index: the five lines naming `lib/markup/`, the legacy-key paragraph, and `names.ts` `identifiers[].today`. `interface-text.md` and `code-conventions.md` section 1. The tests (`names-table.test.ts`, `i18n-index.test.ts`, `retired-names.test.ts`) re-run unchanged after batch 3.

## Not established

- Whether the index's file lists are the best three or four per prefix: they are the files with the most literal references, trimmed by hand.
