# Brief for Code: reconstituted я between two soft consonants becomes [a]

**Desk brief r1, 2026-09-26 21:50. Shape: `BRIEF-TEMPLATE.md`.** Build on `Shane`. If the `audit` branch with the approval tests is not merged yet, build after it, as `brief-code-grayson-soft-ts-sh_r1_2026-09-26.md` does, so the approval tests show exactly which outputs change.

## 1. What was observed

With reconstitution on (global switch or Spot reconstitution), an unstressed я between two soft consonants stays [i]. Grayson's chart would restore it. Every other reduced я reconstitutes.

## 2. What is established (read this session)

- The engine writes unstressed я as [ɪ], or [i] when interpalatal: pretonic at `packages/phonology/src/engine.ts:1209`, remote a few lines below it (`if (vowel === 'я' || vowel === 'э') return isInterpalatal ? 'i' : 'ɪ';`). The interpalatal flag is set in the transcription log at `engine.ts:1805`.
- Reconstitution is applied in the web app, not the engine: `apps/web/src/lib/reconstitution.ts:43` (`applyReconstitution`), called at `apps/web/src/lib/pipeline.ts:933` and for clitics at `:1013` and `:1045`.
- `reconstitution.ts:67` restores [ɪ] from я to [ɑ]. `:80` restores interpalatal [i] from е to [e]. **No rule handles interpalatal [i] from я**, so it falls through unchanged at `:91`.
- Grayson, *Russian Lyric Diction* (2012), read as page images by the desk this session (logical page = physical PDF page minus 16):
  - p. 125: fronting "extends to one reduced vowel allophone in an interpalatal position. The allophone is [ɪ] ... and it fronts to the /i/-phoneme when interpalatal." [a] "only occurs interpalatally".
  - p. 128, §8: reduced vowels "should be reconstituted to their unreduced form, which then adhere to the usual phonetic and phonemic rules." Chart: -я-: "[ɪ] or [jɪ] revert to /ɑ/ or /jɑ/"; -э- or -е-: the same, "and /i/ or /ji/ revert to [e] or [je], when interpalatal". The interpalatal clause is printed for е only.
- The Чайковский row on p. 128 is a settled exception, not an analogy (Dann, 2026-09-26 21:38).
- `engine.ts:35` carries a `reconstitution` preference and `packages/phonology/tests/notation-edge-cases.test.ts:159` says it is "not wired yet". That is an unused engine-level copy. **Do not wire it; do not build reconstitution a second time.** The one place for this change is `reconstitution.ts`.
- No unit test file for `applyReconstitution` was found under `apps/web/src/lib`.

## 3. The change

In `apps/web/src/lib/reconstitution.ts`, beside the е rule at `:80`, add one rule: [i] from я with `features.interpalatal` true reconstitutes to [a]. Comment it with Grayson pp. 125 and 128 and Dann's ruling. Stressed vowels are already excluded at `:56`. The /j/ glide is not a vowel in the walk, so word-initial [ji] becomes [ja] without extra code; confirm that with a test.

## 4. Measure before you change anything

1. Run `applyReconstitution` today on at least three dictionary words where the engine writes interpalatal [i] from unstressed я: one pretonic, one remote, one word-initial. Candidates, to be confirmed against the engine's own output: рябина, пятёрка, пятилетка. Report the engine IPA and today's reconstituted IPA for each.
2. Confirm no other path in `apps/web/src` rewrites reconstituted IPA per vowel (the desk's grep found only the calls in `pipeline.ts` and the display reads in `WordStack.svelte:49`, `InspectorPanel.svelte:105`, and `syllable-utils.ts:318`, `:344`).

## 5. The rulings this serves

- Dann, 2026-09-26 21:39, answering the desk's question "Should reconstituted я between two soft consonants become [a]?": *"yes. I'm sorry I thought it already worked that way. Please reexamine the current code to make sure we're not duplicating."* The desk offered the analogy with Grayson's е row; Dann ruled it in.
- `CONTRACT.md` §6: do not hand-roll a phonological predicate. The interpalatal flag already comes from the engine; use it, do not recompute it.

## 6. Constraints

- Change `reconstitution.ts` and add tests; nothing else.
- Reduced output (reconstitution off) must not change at all.
- Every approval file stays byte-identical except lines holding an affected word; list each changed line.
- No git command that writes.
- **Displaces:** nothing scheduled; a correctness fix.

## 7. Done when

- A new unit test file for `applyReconstitution` pins: the new я rule (pretonic, remote, word-initial with glide); the existing е rule at `:80`; [ɪ] from я to [ɑ] at `:67`; and a stressed я left alone.
- All gates pass, including `pnpm ratchets` and Playwright.
- `WRITTEN` on the code. `DONE` is Dann's walk: one of the test words, reconstitution toggled on, shows [a].

## 8. Report back

The words measured with before and after IPA, the commit, the results against section 7, and what could not be established. **NOT ESTABLISHED beats a complete invented answer.**
