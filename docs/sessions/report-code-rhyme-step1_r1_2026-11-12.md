# Report: rhyme matcher, step 1 (the engine's `'literary'` value) (Code, cloud lane 49, r1, 2026-11-12)

Branch `cloud-lane-49`, on `dc078b9` plus the step 0 report.

## What changed

`packages/phonology/src/engine.ts`, seven lines edited in place, none added (2048 of 2048 before and after):

- `EngineConfig.adjectival` is `'stage' | 'modern' | 'literary'` (`:28`), with its comment.
- The velar-hard set is built when `config.adjectival !== 'modern'` (`:1361`, was `=== 'stage'`), so the velar stays hard under `'literary'`.
- The vowel branch (`:1525-1527`) fires for `!== 'modern'`; the vowel is `ʌ` and `exception` is `'velar-adjectival-rhyme'` under `'literary'`, `ɨ` and `'velar-adjectival'` as before under `'stage'`.

`DEFAULT_ENGINE_CONFIG` stays `'stage'`. No other file in `packages/` or `apps/web/src` reads `'velar-adjectival'` or compares `config.adjectival`, so nothing else needed an edit (grep, whole tree).

## Tests

A literary block in `packages/phonology/tests/notation-edge-cases.test.ts`, beside the stage and modern blocks, and two test-dictionary entries (`высокий`, `глубокой`, both stress 1). It pins: «высокий» is [vɨˈsokʌj]; the logged ⟨и⟩ is `ʌ` with exception `velar-adjectival-rhyme`; «долгий» and «тихий» keep the velar hard ([ˈdoɫɡʌj], [ˈtʲixʌj]); literary differs from stage only in the final vowel; stage ([vɨˈsokɨj]) and modern (`kʲij`) are unchanged; «русский» is [ˈruskʲij] under all three. I did not add to `engine.test.ts`; its stage pin at `:306-312` stays green.

## Gates after the change

phonology 462 passed (456 + 6 new), dictionary not re-run (untouched), web-check 0 errors and 12 warnings, web-test 5190 passed and 1 skipped (unchanged), blurb 168, integration 155, ratchets OK. score-parser not re-run (does not import the engine's config). Ratchets prints "shrank" notices for files that were already under their ceilings at step 0 (`+page.svelte` 5534 to 5515, `staff-renderer.ts` 3427 to 3426, others); they are not from this step.

## What I could not establish

- Whether the Inspector's ⟨и⟩ blurb path breaks on the new exception value. Nothing reads `features.exception` for this process in the code I grepped, but the composer's `deriveRule` was not opened for this step; step 4 does.
- Reconstitution's treatment of the literary [ʌ] (brief: [ʌ] becomes [ɑ] by `reconstitution.ts:63`). Not read yet; step 3's test covers it.
