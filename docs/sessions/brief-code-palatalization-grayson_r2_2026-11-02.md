# Brief r2, 2026-11-02: regressive palatalization back into integrity with Grayson (2012)

Desk: Opus, 2026-11-02 00:2x. r2 applies all 14 amendments of Fable's review (`review-fable-brief-palatalization_r1_2026-11-02.md`, SEND WITH AMENDMENTS), read in full by the desk. r1 is superseded; do not send it. Lane: a new cloud lane cut from `Shane` AFTER Dann's next commit lands `docs/memory/` and this folder's new files (review amendment 11), so that the lane can read `docs/memory/OPEN.md` (section "REGRESSIVE PALATALIZATION FOLLOWS GRAYSON p. 209; THE RULE FOR ⟨р⟩") and the truth set. LEARN and GUIDE text are NOT in this brief.

## Why

Dann found Ilya's comment on ⟨д⟩ in «неподвижный» ("no palatalizing agent nearby") beside a soft [vʲ]. The engine adds two rules Grayson does not have, gets two of Grayson's own ⟨р⟩ examples wrong while citing them, and its comments are inferred from the output rather than from the rule that fired. Dann's rulings (2026-11-01 23:27, 23:53, 23:58; 2026-11-02 00:05, 00:07) are in OPEN.md.

## The rules Ilya implements (and nothing else)

1. **Boundaries** that stop a regressive chain (Grayson p. 206): ж, ш, ц; ъ, except that в, с, з before ъ are palatalized (p. 193 prose, p. 206 rule 2, p. 250; ruled over the p. 194 table); a vowel; a new palatalizing agent; the word boundary; punctuation. **The prefix boundary** (Grayson p. 249: palatalization does not cross the prefix/suffix boundary, except (i) the same consonant on both sides, the second palatalized, and (ii) a prefix ending in в, с, з before a palatalizing root). D&P p. 76 restriction 1 states the stop case.
   **DESK DEFAULT on how (review amendment 1, option a):** a prefix list checked at word start: от, под, над, пред, об, обо, ото, подо, надо, предо (stops), and в, с, из, раз, без, воз, вз, низ, роз, чрез, через (the в/с/з family, exception ii). Put the list and its known failures in a new module with tests. Name the failures you can find (e.g. «подвиг», where д is root-final; «отчий»?). Step 0 counts every word the list touches, separately, so Dann sees them before step 1 is kept.
2. **Limits** (p. 209): л only when doubled; н only before a soft н or a soft dental; velars only before a soft velar; labials б п в ф (p. 209 rule 5) and м (D&P p. 76 3P1, p. 78; Grayson pp. 211, 250) only before a soft labial. Cite both in the comment at `engine.ts:305`.
3. **Dentals** т д с з: palatalized before ANY soft consonant (no limit on p. 209; «сестрёнка» /sʲi ˈsʲtʲrʲon kɑ/ p. 210; «симметрический» p. 211), subject to the prefix boundary. ч and щ count as soft triggers (D&P p. 81 лётчик, кончать; Grayson silent on these pages: say so in the code comment).
4. **⟨р⟩**, verbatim as ratified: *"⟨р⟩ before a soft consonant is palatalized in two cases only: when it is doubled (⟨-ррь-⟩), or when it immediately follows ⟨и⟩, ⟨е⟩, or ⟨э⟩ and the stress falls either on that vowel or on the next vowel after the ⟨р⟩."* This is Dann's ratified reformulation of Grayson p. 209 rule 2 and D&P pp. 86 to 87, not D&P's wording: say so in every comment and test row that cites it. **DESK DEFAULT (review amendment 7, flagged to Dann):** D&P's three listed words with soft р (3R(c), p. 87: борщ, скорбь, церковь) are kept as lexical exceptions in a small set (pattern of `lexical-palatalization.ts`), reason `lexical-soft`.
5. **Soft р and л do not stop the chain.** Remove `regressivePalatalizationBlockers` (`engine.ts:299`) and its check (`:902-905`). This also repairs doubled л and р, broken today because the blocker runs before `canRegressivelyPalatalize` (`:903` before `:908`; probe: гулливая ɡuɫˈlʲivɑ, эллин ˈɛɫlʲin, иррегулярно irrʲɪ…).

## Every site that computes palatalization (CONTRACT §4)

- `engine.ts:855-951` `computeCompletePalatalizationMap` (pass 1 `:879-886`, pass 2 `:888-917`, pass 3 `:920-948`), called at `:1577`; `:954` the legacy wrapper; `:960-1008` `canRegressivelyPalatalize`.
- **`engine.ts:1252-1296` `transcribeConsonant`, its own р branch `:1267-1282`**, which returns 'rʲ' directly. Remove it; the р decision comes from the map alone.
- **`engine.ts:247-288` `cliticData`**, canonical IPA per clitic (для 'dlʲɑ' `:275`, без, при, через). Regenerate from the rules, and list each changed string in the report. The isolated-clitic path `:1540-1548` gets reasons too.
- **`packages/blurb/src/cluster-breakdowns.ts:54-108`**, hard-coded `soft` flags for special clusters: give each a reason id (`cluster`).
- **`engine.ts:1864-1876` `softTrigger`**, inferred from the IPA after the fact; it mislabels today (ч in кирпич as "regressive"; pass-3 р in первый). Replace it: the reason comes out of the map.
- в, с, з before ъ is handled nowhere today (probe: съесть ˈsjesʲtʲ, въезд ˈvjɛzt, безъязычный з hard). It is new code. The j-glide logging at `:1655-1680` and `:1748-1753` is its natural partner.
- Cross-word palatalization does not exist (`applyCrossWordAssimilation`, `:2160-2253`, does voicing and sibilant mergers only). Report that; do not build it here.
- Pins: `packages/phonology/tests/consonants-clusters.test.ts:150-175` (смерть, дверь) and the approval golden master `apps/web/src/lib/approval/__approved__/ipa-corpus.txt` (`ipa-corpus.approval.test.ts`). Re-approve only to values the rules give; list every changed line with its rule.
- **Ratchet:** `engine.ts` is at its ceiling (2291 of 2291, `scripts/ratchets.json`). New logic goes in new modules (pattern of `voicing-rule2.ts`, `reflexive.ts`); `engine.ts` may only shrink.

## Steps

**Step 0, measure only (keeps nothing).** In a scratch copy, apply rules 1 to 5 and run the approval corpus, every fixture with a lyric, and the truth set. Report every word whose IPA changes, grouped by rule (dental, р, blocker removal, ъ, prefix list, labial м, clitic strings), with counts, and a separate table of every word the prefix list touched. Push the report and stop. The desk shows it to Dann before step 1 is kept.

**Step 1, the engine.** Implement rules 1 to 5 in new modules. `computeCompletePalatalizationMap` returns, for each consonant, both softness and a reason (a `Map<number, {soft, reason}>` or a parallel map), consumed at `:1759`, `:1800`, `:1840`; never re-derived from the IPA string. Reason ids: `agent-vowel`, `agent-soft-sign`, `regressive-dental`, `regressive-dental-dp-differs` (a dental before рь or a soft velar), `regressive-homorganic`, `regressive-n`, `geminate`, `r-front-stressed`, `hard-sign-vzs`, `blocked-class`, `blocked-n`, `blocked-r`, `blocked-l`, `boundary-hard-sign`, `boundary-prefix`, `no-soft-follower`, plus `always-soft`, `always-hard`, `lexical-soft`, `reflexive-hard`, `adjectival-stage-hard`, `cluster`. Code comments cite the page for every rule, and no comment cites a word or page the code does not honour. The email is cited as "Grayson, personal communication, February 2026" with the words "Russian 'Stage' pronunciation (from which Russian lyric diction borrowed) palatalizes everything in similar clusters, except the 'always hard' consonants (of course)." (Do not choose between Feb 25 and Feb 26: the desk will.)

**Step 2, the truth set as a test.** A test in `packages/phonology/tests/` pinning consonant softness for every row below, each with its page in a comment:
- Grayson, as printed: объедать, обедать, сесть, вест, подъём, объять (p. 194); смерть, терпеть, кирпич (p. 209 n. 277); стол, столь, мать, мять, большой, сестрёнка (p. 210); симметрический (p. 211); обвить, отчёт, оттенок, изменять (p. 250).
- The hard-sign ruling (soft в, с, з before ъ, over p. 194): съесть, въезд, разъярять, съёмный; безъязычный (D&P p. 83).
- D&P, agreeing: первый, четверг, верх (р hard); персик, версия, первенец, мерси (р soft); партия, армия (р hard); неподвижный, дверь, четверть, зверь (dental soft, D&P p. 80); гулливая, эллин, иррегулярно (geminate, D&P p. 80); лётчик, медлить (D&P p. 81).
- Grayson over D&P (comment: "Grayson p. 209/210 over D&P p. 79/80 n/c"): ветки, три (dental soft).
- D&P 3R(c) lexical: борщ, скорбь, церковь (р soft).
- Gate: for every consonant in this test and the approval corpus, the softness in the IPA agrees with the softness its reason implies.

**Step 3, the comments.** `packages/blurb/src/composer.ts:184-186` maps from the reason, one process key per reason. Seat the ratified strings verbatim: `docs/sessions/ratified-palatalization-comments-en_2026-11-02.md` and `…-fr_2026-11-02.md`, each with its citation page, pinned in a test. The reasons outside the sixteen (`always-soft`, `always-hard`, `lexical-soft`, `reflexive-hard`, `adjectival-stage-hard`, `cluster`) keep their existing templates where one exists and is true; otherwise a neutral identity-only comment. **No fallback to the old `soft:X` / `hard:X` templates**: they are the wrong-reason text and retire (their French with them).

## Done when

All eight gates at baseline except the counts the new tests add; the truth-set test and the agreement gate pass; one report per step in `docs/sessions/`, each listing every changed pin; no file under `docs/memory/` touched; nothing pushed to `Shane` or `main`.

## What you could not establish

Every report ends with this section. NOT ESTABLISHED beats a complete invented answer.

## Addendum, 2026-11-02 00:2x: exception words (Dann's screenshot of «счастье», 00:21)

`exceptionWords` (`engine.ts:528-532`, applied at `:611-613`) forces [ɑ] in «счастье» and three other forms, and the comment shows no prose (`composer.ts:138`). (1) Every override records reason `lexical-exception` with the word, and the comment reads the ratified string at the end of `ratified-palatalization-comments-en_2026-11-02.md` and `…-fr_…` (Grayson 2012, 287). (2) The code comment's citation becomes "Grayson 2012, 287, ch. 6 section 5" (it says "Appendix F"; the desk read the passage on p. 287). (3) Grayson says "(including derivatives)": cover the stem счаст- (счастье, счастья, счастью, счастьем, счастлив, счастливый, счастливая, and the rest), not four forms; list in the report every form the stem matches in the dictionary, and name any that is not a derivative. (4) Step 2 adds rows счастье, счастливая. (5) Report why the panel shows the mapping twice ("а → ɑ" in two styles) and whether other exception words show the same.
