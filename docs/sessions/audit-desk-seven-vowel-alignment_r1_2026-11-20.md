# Audit: what the tree assumes about the vowel threshold, against the seven-vowel position

r1, 2026-11-20, by the desk (Opus 5), on Dann's instruction of 01:48. Tree read: `Shane` at `3bff3358`, with `cloud-lane-75` unmerged. Every line below was read this session.

The position being aligned to is `../memory/OPEN.md`, "THE FILL RULE, and why the asked-for set is SEVEN": Ilya fills a vowel only where the singer's own vowels bound the answer; [ʌ] and [ɪ] are filled, [a] and [ɨ] are asked for; the asked-for set is seven.

## 1. What does NOT have to move, which is the happiest finding

**The capture sets already are seven and three, and they already hold the right members.**

- `apps/web/src/lib/voice/CalibrationWizard.svelte:103-105`: `DEFAULT_VOWELS` is `['i','e','ɛ','a','ɑ','o','u']`, `CHALLENGING_VOWELS` is `['ɨ','ɪ','ʌ']`.
- `apps/web/src/lib/voice/chart/tour.ts:10-12`: `TOUR_SEVEN` and `TOUR_HARDEST`, the same members in the same order.

So the screen and the tour already ask for exactly the seven the fill rule requires. **Dann's ruling of 01:16, that the wizard regroup to six and four with [a] crossing into the optional set, is withdrawn by the 01:47 fill rule**, which puts [a] back among the asked-for. Nothing in either file changes.

## 2. The threshold constant and its readers

- `apps/web/src/lib/voice/engine/sung.ts:40`, `PERSONAL_CORE_MIN = 5`, and `:41` `isPersonal`.
- `:18` `CORE_VOWELS` is the six Bozeman vowels; the asked-for set is seven and adds [a].
- `:25-29` `stableCore` filters `CORE_VOWELS`; `:32` `coreCount`.
- Readers outside: `analysis/placeholder-line.ts:20`, `:55`; `components/Drawer/voice-pane.ts:18`, `:49`, `:56`.

The notion changes from "five of the six core are stable" to "the seven asked-for are stable". Whether the constant survives as a number or becomes a set membership test is the lane's to settle.

## 3. The derivations

`apps/web/src/lib/voice/engine/derivations.ts`:

- `:20-26` `expectedF1` and `:29-36` `derive` hold all four. Under the rule, [ɪ]'s `1.0315 × e.f1` is dropped in favour of her [e] unchanged; **[a] loses its derivation entirely** (both its values are multipliers); **[ɨ] loses its first-resonance derivation** and keeps a bounded second resonance only, or loses it too, which the lane decides with the scan's answer.
- `:50-55` `DERIVE_ANCHORS` loses [a] and [ɨ].

Readers that follow: `engine/resolve-values.ts:21`, `:132`; `engine/stand-ins.ts:35`, `:181`; **`engine/plausibility.ts:30`, `:219`**, where `expectedF1` sets the guard's window centres, so removing [ɨ] and [a] from it changes which readings the guard can judge. That is the one consequence outside the profile itself.

## 4. Finish early

`apps/web/src/lib/voice/chart/finish-early.ts:1-17` keys its `work-out` state on every remaining vowel being one of [ɪ], [ɨ], [a], [ʌ] and each being worked out from recorded anchors. Under the rule, [ɨ] and [a] are not worked out, so the state's definition narrows to [ɪ] and [ʌ] alone, and its caption's claim changes with it. It also says it shows "from the fifth core vowel", which moves.

## 5. The strings that name a number

`apps/web/src/lib/i18n.ts`, all of them ratified and all needing Dann's words again:

- `:1445-1446` `calib.pane.belowCore` and `belowCoreOne`, live, "{n} of the 6 core vowels", "at least 5 stable fry samples".
- `:2065-2066` `placeholder.line.belowCore` and `belowCoreOne`, live, "at least 5 of these 6 core vowels", with the direction already ratified out of them tonight.
- `:2072-2073` `placeholder.line.markup.belowCore` and its twin, the same.
- `:1440-1443` `calib.pane.coreGeneric`, `coreGenericOne`, `core`, `coreOne`, marked unused since lane 68 and kept in place; they name the same numbers and should move or be struck in the same pass.

## 6. The tests that pin any of it

`src/lib/voice/engine/sung.test.ts`, `src/lib/voice/chart/tour.test.ts`, `src/lib/voice/chart/finish-early.test.ts`, `src/lib/analysis/analyze-score-adapter.test.ts`, `src/lib/markup/profile-status.test.ts`, `src/lib/components/Drawer/voice-pane.test.ts`, `src/lib/stand-in-borrowing.test.ts`.

## 7. NOT ESTABLISHED

**NOT ESTABLISHED beats a complete invented answer.**

- Whether `plausibility.ts`'s guard has a fallback window for a vowel with no `expectedF1`, and so what happens to a sung [ɨ]'s plausibility verdict once its derivation goes. Read before the brief is written.
- Whether any site outside `apps/web/src` encodes the five or the six. `packages/` was not swept for it.
- What the scan returns about [ɨ]'s first resonance, which decides whether [ɨ] rejoins the filled set.
