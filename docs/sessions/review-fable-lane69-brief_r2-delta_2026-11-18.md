# Review: lane 69 brief r4 (delta), r1, 2026-11-18

Reviewer: Fable 5.2, as a subagent of the Opus desk. Filed verbatim by the desk from the helper's hand-back. Helper cost: 163,310 tokens by the harness count, 9 tool uses, 2.9 min, against a cap of 200k and a quoted range of 60k to 200k; the helper's own estimate of its cost was about 75,000, less than half the harness count. The desk re-read every line this review cites, at `Shane` `74579156`, before applying its amendments in brief r5.

---

Reviewer: Fable 5.2, as a subagent of the desk. I read the tree at `$HOME/mnt/ilya-rewrite`, branch `Shane` `74579156`, through the bridge, read-only. Nothing was written and no git write was run. Read in full this session: brief r4, my review of r2, `markup/profile-status.ts`, `markup/profile-status.test.ts`, `analysis/placeholder-line.ts`, `voice/engine/sung.ts`, `scripts/ratchets.mjs`, `scripts/ratchets.json`, `components/Drawer/voice-pane.ts:1-80`, the cited ranges of `markup/MarkupPane.svelte` and `i18n.ts`, the last section of `docs/memory/OPEN.md` (`:3991-4003`), and `docs/house-style/interface-text.md` section 4. The r3 to r4 diff was read in part (the tool truncated it), so r4 was read whole instead. Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `scripts/`, or `docs/`. Cost: about 75,000 tokens against the 200,000 cap.

## Verdict

SEND WITH AMENDMENTS.

Step 1 builds what it claims, the ceiling holds, the import passes the module table, and both strings are true on a page with no score. The amendments close small gaps: two imports r4 does not name, two comments it does not list, test inputs it leaves open, and two guards that r4 weakened from r3.

## Blockers

None.

Findings on the eight checks, in the order asked:

1. **Buildable as written: yes, with amendment 1.** `statusLineFor` today takes `(analysedCount, language)` (`markup/profile-status.ts:29`). The pane imports only `isSung` at `markup/MarkupPane.svelte:64`; `isPersonal` and `stableCore` are exported from the same module (`voice/engine/sung.ts:26`, `:41`), so the import stays one line. `belowCoreText(base, stable, language)` has the signature r4 assumes (`analysis/placeholder-line.ts:53`). The new signature uses the type `Vowel`, which `markup/profile-status.ts` does not import today (`:10` is its only import).
2. **The ceiling holds.** The pane is 1353 lines (`wc -l`), and `:64`, `:568`, and `:949` each stay one line. The prescribed `:949` is 152 characters with its tab. Nothing breaks it: the root and `apps/web` hold no prettier, eslint, biome, or editorconfig file, neither `package.json` names such a tool, and the pane already holds lines of 295 characters (`:1039`) and 249 (`:1021`). `markup/profile-status.ts` has no listed ceiling (`scripts/ratchets.json:7-24`); the 1000-line limit for unlisted files applies (`scripts/ratchets.json:3`, `scripts/ratchets.mjs:68`), and the file is 63 lines.
3. **Module rules: passes, no cycle.** `markup` may import `analysis` and `voice` (`scripts/ratchets.mjs:83`). `analysis/placeholder-line.ts:17-20` imports `@ilya/score-parser`, `$lib/i18n`, `voice/engine/types`, and `voice/engine/sung`, none of which is under `markup/`; `analysis` may not import `markup` at all (`scripts/ratchets.mjs:82`). `markup/profile-status.ts` is imported only by `markup/MarkupPane.svelte:77` and `markup/profile-status.test.ts:2`.
4. **The strings: right for this page.** `calib.pane.belowCore` and `calib.pane.belowCoreOne` (`i18n.ts:1443-1444`), English and French, carry three clauses: how many core vowels are sampled, what completes the vowel space, and that unsampled vowels take placeholder values. None mentions a score, a finding, or a mark, and each is true with no score drawn. `placeholder.line.markup.belowCore` (`i18n.ts:2067`) carries "Findings that rest on a placeholder are drawn hollow or dashed", false on this page, and ends "You can add new fry samples anytime through the DRAWER on the left", which would repeat line 3 (`i18n.ts:1499`). r4's rejection of it holds. No new string is needed. Line 3's "these values" now follows "placeholder values", and reads as the next step.
5. **Tests.** The arithmetic is right: with four stable core vowels, `m` is 5 minus 4 (`analysis/placeholder-line.ts:54`, `voice/engine/sung.ts:40`), the "One" key is chosen (`:55`), `{n}` prints 4, and `sampledCount: 7` takes no part. Cases 1 to 4 are reachable in the app. Case 5 (`personal: true`, `sampledCount: 1`) is not: `isPersonal` needs five stable core vowels, each of which is `isSung` and in `ROSTER_ORDER` (`voice/engine/sung.ts:26-30`, `:41`; `markup/MarkupPane.svelte:442`), so the count is five or more. The item 7 regexes match the code Step 1 prescribes, character for character. See amendments 4 to 6.
6. See the section below.
7. See amendments 1 to 7. Nothing needs a ruling.
8. **The declined alternative: the desk's reason holds.** `paneSentence` needs `restWorkedOut` and `voiceType` (`components/Drawer/voice-pane.ts:19-31`), which this page would have to be handed, and at five to nine sampled it prints "You have recorded {n} of the 10 vowels. Ilya fills the other {m}" (`:58-61`, `i18n.ts:1435`) in place of the sentence Dann has walked. That is a larger change than his direction of 20:38 asks for, on a file at its ceiling.

## Amendments

1. **Step 1 item 1, name the two imports.** Add: "In `markup/profile-status.ts`, add `import type { Vowel } from '$lib/voice/engine/types';` and `import { belowCoreText } from '$lib/analysis/placeholder-line';` under `:10`. Both pass `scripts/ratchets.mjs:83`."
2. **Step 1 item 5, two more comments the change makes false.** Add two bullets:
   - "`markup/profile-status.ts:25-28` says 'the count now spans every reading the forecast reads'. After this step it spans every reading the singer sampled (`isSung`), provisional and unstable ones included. Rewrite that clause; keep the 'DRAFT copy, flagged for Dann (§B.2)' marker."
   - "`markup/profile-status.ts:7-8` says 'PURE: counts and a language in, strings out'. It now takes the voice's state. Rewrite in the same two lines."
3. **Step 1 item 5, second bullet.** Add: "The rewritten comment must not contain the text `snapshot.fR1[`, or the wiring guard of item 7 fails."
4. **Step 1 item 6, the existing cases.** Replace "The existing cases (`:8-16`) move to the new signature" with: "The existing cases (`:8-16`) move to the new signature with `personal: true` and `core: ['i','e','ɛ','ɑ','o']`." Replace the reason on the last added case ("so the five-plus wording is still pinned at every count") with: "pins the function's singular form; unreachable from the pane, as the zero case is, because `isPersonal` needs five sampled vowels (`voice/engine/sung.ts:41`)."
5. **Step 1 item 6, the second and third added cases, expected text in full.** Second case, English: "You have sampled 4 of the 6 core vowels so far ([i], [e], [ɛ], and [ɑ]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 1 more, unsampled vowels are assigned placeholder values." Third case, English: "You have sampled 0 of the 6 core vowels so far. To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 5 more, unsampled vowels are assigned placeholder values."
6. **Step 1 item 7, restore the assertion on the call.** r3 pinned what the pane passes to `statusLineFor`; r4 pins only `personal:`. Replace `/personal: isPersonal\(formants\)/` with `/statusLineFor\(\{ sampledCount: sampledVowels\.length, personal: isPersonal\(formants\), core: stableCore\(formants\) \}, language\)/`. No formatter runs in this tree, so the exact line is matchable.
7. **Step 3 item 1, the selector and the seed.** Replace "the status line is the below-five sentence naming 1 of 6 and 4 more" with: "the first `.profile-status` reads 'You have sampled 1 of the 6 core vowels so far ([i]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 4 more, unsampled vowels are assigned placeholder values.'" Add: "Every seeded reading carries `confidence: 'high'`, as `apps/web/e2e/calibrate-new.test.ts:11` seeds; a reading with `confidence: 'low'` is not stable (`voice/engine/sung.ts:29`) and would print 0 of 6." Two paragraphs carry the class (`markup/MarkupPane.svelte:1102`, `:1105`), so "the first" is needed. In the Ceilings paragraph, change "which has no ceiling" to "which has no listed ceiling and sits under the 1000-line limit for unlisted files (`scripts/ratchets.json:3`)".

## My r2 amendments: carried or dropped

- 1 (`analysis/placeholder-line.ts:73`): carried (section 3; Step 0 item 2).
- 2 (the history): carried, moved to section 2.
- 3 (the size of the departure, item 12 and tether 19): carried (section 2).
- 4 (`profile.statusSetPlain` unreachable; leave `:12-17`): carried, and correctly updated for the new branch.
- 5 (the rename): carried.
- 6 (the ceiling, and lowering `scripts/ratchets.json:16`): carried.
- 7 (the wiring guard): **weakened.** The first and third assertions survive; the second, on the call to `statusLineFor`, was replaced by a narrower one. Amendment 6 above restores it.
- 8 (the Playwright test): carried, **weakened** by the loss of "the first `.profile-status`". Amendment 7 above restores it. The move from six sampled to five in case (b) is right.
- 9 (the complete list of sites): carried; the third bullet is rewritten as "The second number this page now prints", correctly.
- 10 (the form): carried, both parts.
- 11 (Step 0 lines): carried.
- 12 (the seed and the picture folder): carried, widened to eight pictures.
- 13 (the phone flake files): carried.

## For Dann

Nothing.

## What I could not establish

- The exact commands of the eight gates. The ship script is outside the repository (`docs/memory/ENVIRONMENT.md:806` places it at `~/Downloads/ilya-ship.sh`). I found no formatter in the tree; a gate defined only in that script was not read.
- Whether the below-five sentence sits whole on this page on a phone. Step 3 item 2 answers it.
- Whether the three other tests that read the pane as text (`components/Paper/one-head-one-foot.test.ts`, `components/footer-credit.test.ts`, `markup/markup-pages.test.ts`) match any line Step 1 changes. Not opened. A grep of `apps/web/src`, `apps/web/e2e`, and `apps/web/e2e-phone` for `analysedVowels`, `analysedCount`, and `statusLineFor` returned only the pane and `markup/profile-status.test.ts`.
- Whether "unsampled vowels are assigned placeholder values" is true for a declared type that has no generic values. `voice/engine/stand-ins.ts` was not opened in this pass; the string is ratified and prints on the VOICE pane for every type (`components/Drawer/voice-pane.ts:6`), so this is not r4's change.
- No gate and no test was run. Every finding is from reading.

## Terms

Coined here: none.

Adopted: "wiring guard" (coined in my r2 review), and from the tree and the brief "sampled", "stable core", "placeholder", "personal", "below-five sentence", "ceiling", "DESK DEFAULT", "NOT ESTABLISHED".

For the main session's memory, if wanted (source: the tree, this session): the repository holds no prettier or eslint configuration at the root or in `apps/web`, so a prescribed line is never rewrapped; an unlisted source file is limited to 1000 lines (`scripts/ratchets.json:3`). Nothing in this report came from the memory store.
