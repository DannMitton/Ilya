# Brief r1: N.198, a final voiced consonant keeps its voicing before a vowel, a sonorant, or в only after a preposition or particle (2026-10-26)

Written by the desk (Opus) 2026-10-26 about 17:1x. NOT Fable-reviewed; it goes to Fable before Code (`CONTRACT.md` §1 item 19). N.198 and QUEUE row 156 are DESK DEFAULT numbers, offered by the desk; Dann asked for the brief 2026-10-26 16:58: *"Please devise a brief explaining to Code the relevant issues and resolve it to more accurately reflect what Grayson says."* (transcribed as written).

For Code in a cloud session, Sonnet, on a lane cut from `Shane` by Dann, after batch C ships (batch C's B3 touches the same boundary layer). **"NOT ESTABLISHED beats a complete invented answer."** Every claim below carries a `path:line` the desk read on 2026-10-26 at `Shane` `e0f4ad9`, or says NOT RUN. One commit per step on the lane; no pull request; no other branch; no brief file in any commit.

Cost, a range and not measured: 60k to 150k Sonnet tokens.

## 1. The need

Ilya operationalizes Grayson (2012). Grayson's rule 2 for voicing across word boundaries, p. 251, verbatim: "Sonorants and vowels do not influence voicing assimilation across any boundary, but do allow final voiced consonants of prepositions, particle contractions, prefixes and word roots (boundary #4) to retain voicing." His examples, p. 252: «сад наш», «сад Анны», «сад ваш» are sung with a final [t] (ordinary words: the final consonant devoices); «меж нас» and «без Анны» keep [ʒ] and [z] (prepositions: voicing kept). On в before a vowel or sonorant, p. 251: it "follows the rules of a sonorant". Ilya's Learn already teaches this correctly ("sonorants and vowels beginning the next word allow a preceding preposition's final voiced consonant to keep its voicing": `apps/web/src/lib/components/Reading/LearnContent.svelte`, section "Do the Same Voicing Rules Apply between Words?").

## 2. What the code does (read, not run)

- `packages/phonology/src/engine.ts:2179-2188`, in `applyCrossWordAssimilation`: when the next word begins with a vowel, a sonorant, or в, and the left word ends in a voiced obstruent, it sets `leftWord.skipFinalDevoicing = true` on every boundary that is not hard, soft and clitic alike. Its comment cites "Grayson pp. 250-252 ... R7.14 Rule #2" and reads the rule as applying to every word.
- `:2247-2251`: final devoicing is then skipped for any word with `skipFinalDevoicing` true, and for any word whose `rightBoundary` is `'clitic'`.
- Boundaries are set by `apps/web/src/lib/boundaries.ts:58` (live): `'clitic'` when the word is a proclitic or the next word is an enclitic, else `'soft'` inside a line; called from `apps/web/src/lib/pipeline.ts:328`, and assimilation runs at `:335`. (`engine.ts:1994-2028` is the engine's own copy, with no caller, per batch C's review.)
- So «сад наш» at a soft boundary likely comes out [sad naʃ] where Grayson prescribes [sat naʃ]. NOT RUN.
- Two tests pin the current reading: `packages/phonology/tests/notation-edge-cases.test.ts:475` («глаз открыт» → `ˈɡɫɑz`, soft boundary) and `:493` («друг мой» → `ˈdruɡ`, soft boundary). No ruling by Dann on this reading was found (grep of `docs/` for "R7.14" and «друг мой», 2026-10-26).

## 3. Steps

**Step 0, measure, change nothing.** (a) Run the pipeline on these lines and report each word's surface IPA: «сад наш», «сад Анны», «сад ваш», «друг мой», «глаз открыт», «меж нас», «без Анны», «из окна», «под водой», «об этом». If «сад наш» already ends in [t], STOP and report: the premise is wrong. (b) Report every line of the approval corpus (`apps/web/src/lib/approval/ipa-corpus.approval.test.ts` and its `__approved__` files) whose IPA would change under step 1, by count and with the first twenty lines verbatim.

**Step 1, the rule.** In the vowel, sonorant, and в branch (`engine.ts:2183-2186`), keep the voicing only where Grayson's boundary #4 applies: the left word is a proclitic (a preposition) or a particle contraction. Elsewhere, leave `skipFinalDevoicing` false so the final loop devoices it. The clitic path at `:2249` already keeps a proclitic's voicing; confirm it by test, and say whether the branch then needs to set anything at all. Correct the comment to quote p. 251.

**Step 2, tests.** Rewrite `notation-edge-cases.test.ts:475` and `:493` to Grayson's expectation («глаз открыт» → `ˈɡɫɑs`; «друг мой» → `ˈdruk`), citing p. 251. Add pins for p. 252's examples: «сад наш», «сад Анны», «сад ваш» end in [t]; «меж нас» keeps [ʒ]; «без Анны» keeps [z]. Show each new or changed test failing on the old code.

**Step 3, approvals.** Do not re-approve the corpus. List each changed line in the report; the desk brings them to Dann.

## 4. Constraints and the cross-site line (`CONTRACT.md` §4)

This row changes how one number is computed: the voicing of a word's final consonant before a vowel, a sonorant, or в. Other sites that compute or depend on it:
- `apps/web/src/lib/boundaries.ts:37`, `:50`, `:58`: the boundary type the rule reads (batch C's B3 adds the typed # as a hard boundary here).
- `engine.ts:2190-2245`: the other branches of the same pass (sibilant mergers, voicing before a voiced obstruent, в before a voiceless consonant); unchanged, and their tests stay green.
- Stored placements carry IPA with no engine version (`Pairing.ipa`; `STATE.md`, pending debt): a song seated before this ships keeps its old IPA on Markup until re-seated. Report what a singer sees on an existing song; change nothing.
- Learn's explanation already matches Grayson; the Guide and the blurbs: grep for any sentence that states the old reading and report it, changing nothing.
- An enclitic after the word (for example «сад ли»): `boundaries.ts:58` marks it `'clitic'`, so `:2249` keeps the voicing. Whether ли counts as Grayson's "particle contraction" is NOT ESTABLISHED; leave the behaviour as it is and report how many corpus lines it touches.
- All eight gates before and after; the gate 1 and gate 4 counts will move by the tests added.

## 5. Report

`docs/sessions/report-code-n198_r1_2026-10-26.md`: step 0's table; the change with `path:line`; tests added and changed, each shown failing first; the changed approval lines; the eight gates before and after; "What I could not establish".
