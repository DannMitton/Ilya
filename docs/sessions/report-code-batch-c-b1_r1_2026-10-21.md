# Report, batch C, row B1: the «ну-те» entry (r1)

Branch `cloud-lane-13`, cut from `Shane` at `de5e96d0`. Working tree clean at the start. Read on a fresh `pnpm install --frozen-lockfile` in the Linux cloud sandbox, 2026-10-26.

## Baselines, measured before any change

All eight match the figures in the prompt. None differs.

| Gate | Measured | Prompt |
|---|---|---|
| 1 phonology | 267 passed (267) | 267 |
| 2 dictionary | 248 passed (248) | 248 |
| 3 web-check | 0 errors, 12 warnings in 5 files | same |
| 4 web-test | 2943 passed (2943) | 2943 |
| 5 score-parser | 775 passed, 5 skipped (780) | same |
| 6 blurb | 145 passed (145) | 145 |
| 7 integration | 55 passed (55) | 55 |
| 8 ratchets | OK | OK |

Commands: `pnpm --filter <pkg> test`, `pnpm --filter @ilya/web check`, `pnpm run test:integration`, `pnpm run ratchets`. The ship script is not in the repository, so these stand in for it.

Note: the ratchet script reports these ceilings can be lowered: `LearnContent.svelte` 4099 to 4086, `InsightsPane.svelte` 1351 to 760, `Loupe.svelte` 3013 to 3012, `+page.svelte` 5607 to 5606. I did not touch them in B1.

## What I changed

- `data/singer-supplement.json`: one entry, `"нуте"`, inserted after `"же"`, in the file's existing multi-line shape: `stress` 0, gloss "come now (urging)" and "allons (exhortation)", `source` "supplement". Parsed with `json.load` afterwards. `apps/web/static/data` is a symlink to `../../../data`, so this serves both (read: `ls -la apps/web/static/data`).
- `apps/web/src/lib/components/Paper/provenance-icon.test.ts:63`: the one expected string the brief predicted, `Ну-те:dictionary:-` to `Ну-те:supplement:-`, and the test's title to match. It failed with exactly that diff after the entry and passed before.
- `apps/web/src/lib/nute-gloss.test.ts`: new, four tests, using the real dictionary and supplement as `provenance-icon.test.ts` does.

## Tests added, and which failed before

Run on the tree before the entry: "reads come now" (English) and "reads allons" (French) failed; the supplement-verbatim and «ж» tests are the other two. The French assertion failed with `expected '' ...`, because the dictionary's «нуте» has no French gloss. The English received value was cut off in my terminal tail and I did not rerun the old tree to capture it. After the entry all four pass.

## Finding that changes done-when 1

The brief's done-when 1 says the test asserts the gloss reads "come now (urging)" and "allons (exhortation)". On the tree that is not what the word stack prints. The word stack's `gloss` goes through `truncateGloss`, which "strip[s] ALL parenthetical content for word stack display" (`packages/dictionary/src/gloss.ts:336-338`), so the singer reads:

- English: `come now`
- French: `allons`

Measured with `processText('Ну-те ж все разом', { language })`: `{"c":"Ну-те","g":"come now", ...}`. Clitics are exempt, which is why «ж» still prints "(emphasis)" (`pipeline.ts:347-353` uses `extractGloss`, not the truncating formatter), and curated glosses are returned as-is (`gloss.ts:408-414`).

I did not change the formatter and did not add a curated gloss, because either is a change to what a singer reads across many words, or a second copy of a ratified string. The test therefore asserts what the singer reads ("come now", "allons") and, separately, that the supplement holds the ratified strings verbatim. This is a deviation from the brief's wording, and it is the desk's to rule (see Owed to Dann).

## Done-when

1. Partly met, see the finding above. A test seats «Ну-те ж все разом», asserts both languages, and fails on the tree before the entry.
2. Met. `ipa-corpus.approval.test.ts` passes, and every gate is at baseline except web-test, which rose from 2943 to 2947 by exactly the four tests I added. The IPA of «Ну-те» did not move in the approval corpus. The probe printed `ˈnu tʲɪʃ` for the word with «ж» grafted on.
3. Met. «ж» keeps "(emphasis)" and "(emphase)", read from `GraysonEngine.cliticData.get('ж')` (`engine.ts:281`) and compared with the word's printed gloss.

## The eight gates after B1

| Gate | After |
|---|---|
| 1 phonology | 267 passed (267) |
| 2 dictionary | 248 passed (248) |
| 3 web-check | 0 errors, 12 warnings in 5 files |
| 4 web-test | 2947 passed (2947) |
| 5 score-parser | 775 passed, 5 skipped (780) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | OK |

## Does anything read «нуте» as the plant?

The brief asked me to report, not decide. `grep -rIl "нуте"` over the tree outside `docs` finds only `data/singer-supplement.json`, the two dictionary data files, and my new test. No score, fixture, or test other than `provenance-icon.test.ts` reads it, and every gate stayed at baseline. One place still shows the plant: the Inspector's dictionary panel field. `fullGlossEn` for «Ну-те» is still "chickpea, garbanzo", because `lookupFullEntry` reads only the dictionary (`gloss.ts:53-60`, measured in the probe: `"en":"chickpea, garbanzo","fr":""`). I read the field from `processText`; I did not render the Inspector.

## The key

«нуте» is the right key, by running: `provenance-icon.test.ts` passed at baseline with `Ну-те:dictionary:-` and failed after the entry with `Ну-те:supplement:-`. So the hyphen is dropped before lookup, as the brief read.

## What I could not establish

- What the Inspector's dictionary panel draws for «Ну-те» now. I measured the field it reads (`fullGlossEn`, still the plant), not the rendered panel.
- The English value the pre-entry tree returned for the gloss. French was `''`; English I did not capture.
- Whether the singer should see "(urging)" at all. That is a ruling.

## Owed to Dann

1. **Ruling.** The ratified gloss "come now (urging)" prints as "come now" in the word stack, and "allons (exhortation)" prints as "allons", because the stack strips parentheticals. Options: (a) accept that; (b) add «нуте» to `CURATED_GLOSSES` (`packages/dictionary/src/curated-glosses.ts`), which is returned as-is, so the singer reads the full string. (b) is a small change but touches the dictionary package and a second copy of the string; I did not do it.
2. **Decision.** Whether the Inspector panel's "chickpea, garbanzo" for «Ну-те» matters.

## Cost

About 139k tokens used through B1, including the eight baselines, the install, and reading the B2 and B3 sites.
