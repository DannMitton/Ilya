# Brief r1, 2026-11-02: regressive palatalization back into integrity with Grayson (2012)

Desk: Opus, 2026-11-02 00:0x. NOT Fable-reviewed (CONTRACT §1 item 19: Fable reviews before Code gets it). Lane: a new cloud lane cut from `Shane` after this brief's review; it may run beside consistency batch 1, which does not touch `packages/phonology` or `data/blurb-composer.json`. LEARN and GUIDE text are NOT in this brief (batch 1 edits `LearnContent.svelte`; the LEARN draft waits for Dann's ratification and for batch 1's merge).

## Why

Dann found Ilya's comment on ⟨д⟩ in «неподвижный» ("no palatalizing agent nearby") beside a soft [vʲ]. The desk traced it to the engine: two rules in `packages/phonology/src/engine.ts` that are not in Grayson, and a ⟨р⟩ rule that gets two of Grayson's own examples wrong while citing them (`:921`). Dann's rulings are filed in `docs/memory/OPEN.md`, section "REGRESSIVE PALATALIZATION FOLLOWS GRAYSON p. 209; THE RULE FOR ⟨р⟩" (2026-11-01 23:27, 23:53, 23:58). Read that section in full before step 1.

## The rules Ilya implements (and nothing else)

Grayson 2012, pp. 206 to 209, with Dann's rulings:

1. **Boundaries** that stop a regressive chain (p. 206): ж, ш, ц; ъ, except that в, с, з before ъ are palatalized (p. 193, ruled 23:58); a vowel; a new palatalizing agent; the word boundary; punctuation. A stop (п б т д к г) is not palatalized across a prefix boundary unless the same stop follows (p. 249; «обвить» /ɑb ˈvʲitʲ/, «оттенок» /ɑtʲ ˈtʲɛ nʌk/, p. 250). If the engine has no prefix-boundary information for a word, say so in the report: NOT ESTABLISHED beats an invented heuristic.
2. **Limits** (p. 209): л only when doubled; н only before a soft н or a soft dental; velars only before a soft velar; labials only before a soft labial.
3. **Dentals** т д с з: palatalized before ANY soft consonant (no limit in p. 209; «сестрёнка» /sʲi ˈsʲtʲrʲon kɑ/, p. 210; «симметрический», p. 211).
4. **⟨р⟩**, verbatim as ratified: *"⟨р⟩ before a soft consonant is palatalized in two cases only: when it is doubled (⟨-ррь-⟩), or when it immediately follows ⟨и⟩, ⟨е⟩, or ⟨э⟩ and the stress falls either on that vowel or on the next vowel after the ⟨р⟩."* ⟨р⟩ before a hard consonant is never palatalized by this rule.
5. **Soft р and л do not stop the chain.** Remove the `regressivePalatalizationBlockers` set (`engine.ts:299`) and its check (`:902-905`). A hard р or л stops nothing either: it is simply not soft, so it carries nothing to the consonant before it (Grayson p. 208, steps 3 to 5).

## Sites (CONTRACT §4: every site computing the same thing)

- `engine.ts:855` `computeCompletePalatalizationMap` (pass 2 `:888-917`, pass 3 `:918-948`), called at `:1577`; `:954` the legacy wrapper; `:960-1008` `canRegressivelyPalatalize`.
- `:914` the hard-sign line says "в, с, з handled separately": find where, or report that it is not handled.
- Cross-word palatalization (p. 249, prepositions) lives outside this map; leave it, and list in the report where it lives.
- Tests that pin the old behaviour: `packages/phonology/tests/consonants-clusters.test.ts:163-175` (дверь), and any other found by running the suite. Change a pin only to the value the truth set or the rules above give, and list each change in the report.

## Steps

**Step 0, measure only (keeps nothing).** Before changing anything, run the whole song corpus and every fixture through the engine as it is, and again with steps 1 and 2 applied in a scratch copy. Report every word whose IPA changes, grouped by which rule changed it, with counts. Stop and push the report; the desk shows it to Dann before step 1 is committed.

**Step 1, the engine.** Implement the rules above. Every soft-or-hard decision for a consonant records a reason id in the transcription log's `features` (a new field, e.g. `palReason`), one of: `agent-vowel`, `agent-soft-sign`, `regressive-dental`, `regressive-homorganic`, `regressive-n`, `geminate`, `r-front-stressed`, `hard-sign-vzs`, `blocked-class`, `blocked-n`, `blocked-r`, `blocked-l`, `boundary-hard-sign`, `boundary-prefix`, `boundary-always-hard`, `no-soft-follower`. Fix the comments in the code: every rule cites the page it comes from; no comment cites a page or a word the code does not honour; the email is "Grayson, personal communication, 2026-02-25" and its words are quoted from `docs/memory/INBOX.md`, 2026-11-01 23:27.

**Step 2, the truth set as a test.** Turn `docs/sessions/truth-set-palatalization_r1_2026-11-01.md` into a test in `packages/phonology/tests/` that pins each word's consonant softness to Grayson's printed form (the hard-sign words to the 23:58 ruling, not to p. 194). Add the D&P rows from the desk's tables (OPEN.md section and `INBOX.md` 2026-11-01 23:05 to 23:58): «первый», «четверг» (р hard); «персик», «версия», «первенец», «мерси» (р soft); «партия», «армия» (р hard); «неподвижный», «дверь», «четверть», «зверь», «ветки», «три» (dental soft). Every row carries its page in a comment.

**Step 3, the comments.** `packages/blurb/src/composer.ts:184-186` maps every hard consonant to `hard`, every soft one to `soft`. Map from `palReason` instead, to one process key per reason. The strings are RATIFIED, EN and FR (Dann 2026-11-02 00:05 and 00:07): `docs/sessions/ratified-palatalization-comments-en_2026-11-02.md` and `docs/sessions/ratified-palatalization-comments-fr_2026-11-02.md`, one per reason id, with each comment's citation page as listed there. Seat them verbatim and pin them in a test. Do not reword. A comment never gives a reason its `palReason` did not record.

## Done when

All eight gates at baseline except the counts the new tests add; the truth-set test passes; step 0's report and one report per step in `docs/sessions/`; no file under `docs/memory/` touched; nothing pushed to `Shane` or `main`.

## What you could not establish

Every report ends with this section. NOT ESTABLISHED beats a complete invented answer.
