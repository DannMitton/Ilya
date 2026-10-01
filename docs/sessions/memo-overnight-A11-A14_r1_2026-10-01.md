# Memo: overnight items A11 to A14

Agent A11-A14, 2026-10-01. Read only; HEAD `740dfe7`. Every `path:line` below was read this run. Paths are under `apps/web/src/` unless given in full.

## A11. Does a re-seated syllable carry the poem's punctuation?

**Question.** N.111 (Code, 2026-09-04): a re-seated cell loses its punctuation (« я, » becomes « я ») because the slot queue's Cyrillic is unpunctuated.

**Found.** The slot queue carries it now. `buildSlotQueue` appends the word's trailing punctuation to its last syllable (`lib/score/pairings.ts:239-240`, marked N.118) and keeps a clitic's own punctuation (`:218`). `placeSyllable`, the loupe's re-seat, copies `slot.cyrillic` into the pairing (`lib/score/pairings.ts:1385`). `refreshPairings` rewrites a stored seat's text from the current slot when the origin and word match (`lib/score/pairings.ts:460-479`), so a seat stored before N.118 picks the punctuation up on the page. The test file `lib/score/punctuation-slot.test.ts` covers placement, shift, re-seat, the refresh of an old seat (`:154-161`), and the clitic fold (`:182`). N.118 is recorded as numbered by Dann 2026-09-09 (`docs/memory/OPEN.md:95`) and its brief as run 2026-09-14 (`:1281`). I did not run the tests (rule 1); I read them.

**Overlap with N.157.** The « я » Dann saw on 2026-09-20 is not N.111. It is a seat whose origin no longer matches the slot queue after a score replacement, so `refreshPairings` leaves its old text alone (`pairings.ts:462-465`: `sameWord` needs an exact origin and word match). That is N.157's defect as `docs/memory/OPEN.md:2218-2243` states it, and its own note says "the period is already in the slot text" (`:2240`). The hand patch of song `39ae51c9` is a one-off, not a fix.

**Verdict: CLOSE.** N.111 is done by N.118. The residue is N.157, already open with its spec in OPEN.md; nothing new to brief.

## A12. Does any path reach "Start placement over"?

**Question.** INBOX 2026-09-16 (`docs/memory/INBOX.md:184`): the press breaks the score's melismas. The path map (`memo-n84-path-map_r1_2026-10-01.md:197`) says the handler exists and nothing calls it.

**Found.** `handleStartPlacementOver` is defined at `routes/+page.svelte:646`. A grep of `apps/web/src` for `handleStartPlacementOver`, `startOver`, `start-over`, and `station.startOver` finds no call site: the only hits are the definition, two comments (`+page.svelte:641`, `:4745-4748`, the latter saying N.147 deleted the drawer row that held the pill and named no new home), the i18n string (`lib/i18n.ts:1402`), a CSS note (`+page.svelte:5198`), and two comments in `lib/components/Drawer/IntakePanel.svelte:718,925` about the deleted `.syl-start-over`. `CalibrationWizard.svelte:1506` is a different button. So a singer has no control that runs it.

**On the melisma defect itself.** The handler already takes the `seatFilledPoem` branch when the poem text equals the score's own words (`+page.svelte:681-686`); the `firstPass` seat survives for a poem the singer typed (`:687-692`). If the button ever returns, the 2026-09-16 reading still applies to that second branch.

**Verdict: CLOSE** as unreachable. The INBOX line of 2026-09-16 and the two rulings of 2026-09-10 about the pill's home (`INBOX.md:113-114`) describe a control that no longer exists.

**NEEDS DANN (separate).** Does a singer need a way to place from scratch? Today the routes are: Clear the text and type again, or Replace the score. Recommendation: no new button until a walk shows a singer stranded; if one is wanted, it reuses `handleStartPlacementOver` with its undo (`:677`) and the `seatFilledPoem` branch for both cases. Cost of waiting: a singer with a half-placed score re-seats note by note in the loupe. Cost of building: the pill's home is a design ruling (N.147 removed its row) and the undo clause's French is still owed (`INBOX.md:114`).

## A13. Does the plausibility guard run on stored readings?

**Question.** INBOX "I.N.110 candidate" (`docs/memory/INBOX.md:65`): a stored Provisional reading with no verdict can anchor derivations.

**Found.** No. The guard runs once, at capture, in `withPlausibility` (`lib/voice/CalibrationWizard.svelte:308-327`, called at `:786`). The snapshot's gate `isUsable` fails only an explicit `implausible` (`lib/voice/engine/plausibility.ts:275-277`); an undefined verdict passes into fR1 and fR2 (`lib/analysis/analyze-score-adapter.ts:131-138`, `:150-162`) and into the derivation anchors (`lib/voice/engine/derivations.ts:77-86`, `deriveFrom` at `analyze-score-adapter.ts:190-199`). The adapter's comment at `:126-128` chooses this on purpose ("unchecked is kept"), written before the 1063 Hz case. The E.26 note (`CalibrationWizard.svelte:831-838`) records that build b6d2828 stored every reading with no verdict, so such profiles can still exist. No hydration path re-judges them (grep for `checkPlausibility` outside tests: the wizard only).

**Fix.** Clear and reversible: judge unjudged readings at snapshot time, computed and never stored, with no voice type so the union bands apply (Dann 2026-09-16: a declared voice type plays no part in choosing values; the union [i] ceiling of 440 Hz plus margin still fails 1063 Hz, `plausibility.ts:96-108`, `:127`). Readings with "Keep my reading" are left alone.

**Verdict: BRIEF.** `brief-code-guard-stored-readings_r1_2026-10-01.md`.

## A14. Ten vowels, Bozeman stand-ins, no vowel blank: what is built?

**Question.** Dann's ruling of 2026-09-16 (`docs/memory/INBOX.md:179`; `docs/memory/PRODUCT.md:199-203`).

**Found.** The ten-vowel constraint is built: `VOWELS` is Grayson's ten (`lib/voice/engine/types.ts:26`). The rest is not:
- A vowel the singer never sang, and that no anchor derives, is omitted from the snapshot (`analyze-score-adapter.ts:107-109`, "silence here is honest"); Insights then finds no fR1 for that vowel (`lib/insights/comments.ts:164`). So vowels are blank today, by design older than the ruling.
- Bozeman's values exist only as fR1 plausibility bands per voice-type bucket and their union (`plausibility.ts:50-108`), used as windows, never as values. There is no fR2 band.
- The four derived vowels need their anchors (`derivations.ts:19-25, 28-35`); with no [i] there is no [ɨ].
- `'bozeman-table'` is a declared `CalibratedFormant.source` (`types.ts:93`) that nothing writes or reads.
- Voice type still routes the guard's bands (`plausibility.ts:135-143`, `bucketFor`). The ruling amends this for VALUE choice only; the guard is a window, so I read it as untouched, and the A13 brief passes no voice type anyway.
- No per-vowel provenance reaches the snapshot (`packages/score-parser/src/analysis-types.ts:39-56`), so a surrogate, once it exists, could not be flagged downstream.
- No commit since 2026-09-16 touches this (`git log --since=2026-09-16 -- apps/web/src/lib/voice apps/web/src/lib/analysis`: voice type slice A, fry detector, French; none adds surrogates).

**Reversible part, briefed.** The provenance channel: `fR1Source` per vowel on the snapshot, filled `sung` or `derived` today. `brief-code-snapshot-vowel-provenance_r1_2026-10-01.md`.

**NEEDS DANN.** One question: what is the surrogate number for an unsampled vowel? The ruling leaves it open ("one number from a band", `INBOX.md:179`). Recommendation: the geometric centre of the union band for the six Bozeman vowels, flagged surrogate, until at least two Bozeman vowels are sampled; then shift every surrogate by the mean semitone offset of the sampled vowels from their own union centres (the "continuum between charts" as one scalar, no chart picked, no voice type read). The four unchartable vowels then derive from those surrogates through the existing ratios, flagged surrogate too. Cost: it reads as a rule the literature does not state, so Insights must show the flag wherever the number appears, and the fR2 side has no band at all; fR2 surrogates would be invented. The alternative, Dann names a chart-matching rule and a reliability threshold, is the full design and is his.

**Verdict: BRIEF for the channel; NEEDS DANN for the values.**

## What I could not establish

- Whether the tests cited pass on `740dfe7`: not run (rule 1). The brief for A13 asks Code to run them before and after.
- Whether Dann's live profile still holds the unjudged [i] at 1063 Hz; it is in his browser, not the repository.
- Whether `scoreTextQueue`, the fallback when the poem has no transcription (`+page.svelte:396-401`), carries punctuation the same way; `readScoreText` was not read. It does not bear on A11's verdict, because the poem queue wins whenever a transcription exists (`:401`).
- Whether the guard's own voice-type routing (`bucketFor`) is amended by the 2026-09-16 ruling. The ruling speaks of choosing values; I read the guard as a window and left it. If Dann meant the guard too, `bucketFor` collapses to union and the core bands become dead code.
