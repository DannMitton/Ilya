# Review of brief-code-palatalization-grayson_r1_2026-11-02

Reviewer: Fable, adversarial pass, 2026-11-02. Sources read this session: Grayson 2012 pp. 193, 194, 206 to 211, 249, 250 (rendered pages); Derwing and Priestly 1980 pp. 76 to 87 (rendered pages); the brief, the truth set, and the OPEN.md ruling section (inputs.md); the code at `origin/Shane` 2b980e7 under the lanes clone; engine probes with a stress dictionary of only the probed words (tsx scripts `p.ts` and `q.ts` in the run folder).

## Verdict: SEND WITH AMENDMENTS

Amendment 1 blocks step 1. The rest are precision fixes to sites, sources, test rows, and the reason-id design. The rules themselves, as ruled, match the printed pages; the brief's description of what the engine does today is confirmed by probes at every point I tested.

## Amendments

### 1. Blocking: the prefix boundary is absent from the engine, and without it steps 1 and 2 contradict each other

Evidence, code: no prefix or morpheme information exists anywhere the engine can reach. `grep -i prefix packages/phonology/src/*.ts` finds only the IPA stress-prefix variable (`engine.ts:2213-2216`) and a comment in `voicing-rule2.ts:6-8` about boundary #4 for voicing across words. `packages/dictionary/src` carries stress and gloss, no morphology. `computeCompletePalatalizationMap` (`engine.ts:855-951`) sees only characters.

Evidence, source: Grayson p. 249 says palatalization "neither crosses the word boundary, including prepositions, nor the prefix/suffix boundary", with two exceptions: the same consonant doubled, and a prefix ending in в, с, з. His p. 250 prints обвить /ɑb ˈvʲitʲ/ and отчёт /ɑt ˈtʃʲot/ hard for that reason. D&P p. 79 print от/лично, под/бил, от/чёт all "n/c" for the same reason, and p. 81 print лётчик → льотьчик, so ч does palatalize a preceding т when no boundary intervenes.

Evidence, probe (engine today): отчёт → ɑtˈtʃʲot, отлично → ɑtˈlʲitʃʲnʌ, подвести → pʌdvʲisʲˈtʲi, обвить → ɑbʲˈvʲitʲ. The first three are right by accident of today's narrow dental rule; обвить is already wrong.

Consequence: rule 3 as written ("dentals before ANY soft consonant") plus `alwaysSoft` ч, щ, й entering `softIndices` in pass 1 (`engine.ts:837`, `:882-883`) softens т in отчёт, отлично, отвести, подвести, and every от-, под-, над-, пред- prefix before a soft root, with the explanation "regressive-dental". Step 2 pins отчёт and обвить to Grayson's hard forms. Code cannot pass step 2 without inventing the prefix heuristic the brief forbids.

Amendment: before step 1, the desk puts one question to Dann, with step 0's counts beside it: (a) a small ruled prefix list (от, под, над, пред, об; в, с, з and their раз/без/из/воз family for the p. 249 exception 2) checked at word start, with the known failure named (подвиг, where д is root-final, would be read as prefix-final); (b) no prefix handling, accepting the regressions step 0 counts, with отчёт, отлично, обвить marked as known-wrong in the truth-set test; or (c) something else Dann prefers. Step 0 must therefore also count, separately, the words whose change comes from a consonant that is prefix-final in Russian orthography, so he sees the size of (b). Until he answers, step 1 stops after the р rule, the blocker removal, and the в/с/з-before-ъ rule, all of which are boundary-independent.

Also: the brief's rule 1 restates p. 249 as "A stop (п б т д к г) is not palatalized across a prefix boundary unless the same stop follows". That sentence is D&P's 3P restriction 1 (p. 76, "stops are never palatalized by assimilation before the / boundary ... UNLESS they are the first consonant of a geminate cluster"), not Grayson's p. 249 wording, which covers every consonant and adds the в/с/з exception. Cite D&P p. 76 for the stops formulation, or restate Grayson. In practice the two agree, since the only consonant-final Russian prefixes end in б, д, т, в, с, з.

### 2. Unnamed site: the р rule is computed twice, and the second copy survives the brief

`transcribeConsonant` (`engine.ts:1252-1296`) carries its own progressive-р branch at `:1267-1282`: for р in a stressed syllable after и, е, э and before any consonant it returns `'rʲ'` directly, bypassing the map. Removing pass 3 (`:920-948`) as the brief instructs leaves this branch producing the old result. CONTRACT §4 requires it to be named. Both copies must go, and the р decision must come from the map alone.

Probe confirming the "any following consonant" premise and its reach: первый → ˈpʲerʲvɨj, четверг → tʃʲɪtˈvʲerʲk, верх → ˈvʲerʲx, зеркало → ˈzʲerʲkɑɫʌ, верфь → ˈvʲerʲfʲ, all р soft before a hard consonant today. D&P p. 87 print первый and четверг n/c. The truth-set test needs верх or зеркало as a second р-before-hard-velar row beyond четверг.

### 3. Unnamed site: `cliticData` holds precomputed softness

`engine.ts:247-288` stores canonical IPA per clitic: для → 'dlʲɑ' (`:275`), без → 'bʲɪz', при → 'prʲi', через → 'tʃʲɪrʲɪz'. Under rule 3 the д of для is a dental before soft л and would read dʲlʲɑ in the word path (probe today: для → ˈdlʲɑ, после → ˈposlʲɪ, если → ˈjɛslʲi, медлить → ˈmʲɛdlʲitʲ, all dental hard before lʲ; D&P p. 81 print медлить → мьедьльить). The brief must list `cliticData` as a site and say whether the canonical strings are regenerated from the rules or left as-is with the mismatch recorded. Also the isolated-clitic path at `engine.ts:1540-1548` emits consonant features without `soft` or any reason.

### 4. Unnamed site: `packages/blurb/src/cluster-breakdowns.ts` hard-codes `soft: true/false`

Lines 54 to 108 give per-character `features.soft` for special clusters (рдц, лнц, сч, зч, сш, зш, сж, зж). These entries reach `deriveRuleStandard` (`composer.ts:184-186`) with no `palReason`. Step 3 must say what rule key they map to; otherwise they fall into whatever default step 3 chooses, which is the wrong-reason path amendment 9 closes.

### 5. в/с/з before ъ: handled nowhere, as the brief suspects; make the brief say so instead of asking Code to look

`engine.ts:914` says "handled separately". Pass 1 (`:879-886`) softens only before ь or an indicator letter (`isPalatalized`, `:833-843`); ъ is neither. Pass 2 skips с at index 0 of съесть because its next character is not a consonant in `softIndices`. Probe: съесть → ˈsjesʲtʲ, въезд → ˈvjɛzt, съёмный → ˈsjomnɨj, безъязычный → bʲɪzjɪˈzɨtʃʲnɨj (з hard before ъ). So the ruled 23:58 rule is new code, not a fix. Note the engine's own word for "the sign ъ belongs to the j-glide" lives at `:1655-1680` and `:1748-1753`; the j-glide logging there (`source: 'after-sign'`) is the natural place for the `hard-sign-vzs` reason's partner.

Add to the test: съёмный (p. 194 prints /ˈsjom nɨj/ hard; ruled soft) and безъязычный (D&P p. 83, бьезь/йазычный). The truth set omits съёмный and вест /vʲɛst/ (p. 194); both belong.

### 6. Truth-set attribution: three "D&P rows" say the opposite of D&P

The brief's step 2 lists «ветки» and «три» among "D&P rows (dental soft)". D&P p. 80 print ВЕТКИ вьеткьи n/c (т hard before кь: restriction 2, dentals not before soft velars) and p. 79 print ТРИ трьи n/c (т hard before рь, with the footnote "NO consonants become palatalized before рь"). The soft values are Grayson's (p. 209 has no dental limit; p. 210 сестрёнка /sʲtʲrʲ/; p. 211 /tʲrʲ/), and Dann's ruling. Each row's comment must say "Grayson p. 209/210 over D&P p. 79 n/c" or the test lies about its source. «неподвижный», «дверь», «четверть», «зверь» are correct as D&P rows (p. 80 зьвьерь, чьетьвьерть; neither has a prefix-final dental, since the д of неподвижный is root-initial).

Probe today for the record: ветки → ˈvʲɛtkʲi, три → ˈtrʲi (т hard in both).

### 7. The р rule's D&P citation needs a caveat in the test comments

D&P 3R(b) (p. 86) requires the following vowel to be и or е, and says nothing about stress; 3R(a) requires stressed е or э before the р. The ratified rule ("stress falls either on that vowel or on the next vowel after the р") is Dann's synthesis and reads terпеть, кирпич, мерси correctly, but it is not D&P's condition. The test rows for мерси, терпеть, кирпич cite "D&P p. 86, 3R(b)"; the comment must add "ratified reformulation, OPEN.md 23:53" so a later reader does not "correct" the code back to D&P.

Also the DESK DEFAULT that drops 3R(c) (борщ, скорбь, церковь): D&P p. 87 report Panov's view that церковь is the one word still pronounced with рь before a consonant in CSR. Probe today: церковь → ˈtserʲkʌfʲ (soft, by accident of the old rule); after the brief it reads /tserkʌfʲ/. Recommendation: three lexical exceptions cost one small set in a new module (pattern of `lexical-palatalization.ts`); the default should go to Dann as a one-line flag, since it removes the single form every source agrees on.

### 8. Geminate л and р are broken today, and the truth set has no row to prove the fix

Pass 2 tests the blocker (`engine.ts:903`) before `canRegressivelyPalatalize` (`:908`), so the doubled-л and doubled-р exceptions at `:969-978` never run. Probe: гулливая → ɡuɫˈlʲivɑ, эллин → ˈɛɫlʲin, иррегулярно → irrʲɪɡuˈlʲɑrnʌ (first л or р hard). D&P p. 80 print гульльивайа, эльльин, ирьрьегулярно; Grayson p. 209 rules 1 and 2 give /lʲlʲ/ and /rʲrʲ/. Removing the blocker (brief rule 5) fixes this as a side effect. Add the three D&P p. 80 rows so the `geminate` reason has a pin.

### 9. Reason ids: close the paths that let a comment give a reason the engine did not use

(a) Today the log's `softTrigger` (`engine.ts:1864-1876`) is inferred from the output IPA after the fact, not read from the map. It labels every always-soft ч/щ "regressive" when no vowel follows (probe: кирпич ч:tʃʲ(regressive), матч, борщ, отлично, безъязычный), and labels pass-3 р "regressive" (первый р:rʲ(regressive)). The brief must require `palReason` to be carried out of `computeCompletePalatalizationMap` (return `Map<number, {soft, reason}>` or a parallel map), consumed at `:1759`, `:1800`, `:1840`, never re-derived from the IPA string.

(b) The list of ids lacks: `always-soft` (ч щ й), `always-hard` (ж ш ц, today `:913`), `lexical-soft` (ц, ш from `lexical-palatalization.ts`, seeded at `:857`), `reflexive-hard` (`:881`, `:1853`), `adjectival-stage-hard` (`:1855-1857`), `cluster` (special clusters). Without them Code must mislabel these with one of the sixteen.

(c) `composer.ts:184-186` must not keep `features.soft ? 'soft' : 'hard'` as the fallback for a missing `palReason`. The current `soft:X` and `hard:X` templates in `data/blurb-composer.json` are themselves the wrong-reason generator: `soft:д` reads "When ⟨д⟩ is followed by a palatalizing agent like it is here", `hard:д` reads "no palatalizing agent nearby" (the неподвижный complaint). The fallback for a missing reason must be a neutral key with no causal clause (identity only, or a `soft-unexplained:X` placeholder), and the thirty causal templates retire or move under `agent-vowel`/`agent-soft-sign` where they are true.

(d) Add a gate: for every consonant entry in the truth-set test and the approval corpus, `features.soft` (from the IPA, `:1864`) must agree with the softness `palReason` implies. Today `velarAdj` (`:1855`) and genitive г (`:1850`) override the map's result in the IPA; the map would say one thing and the output another.

### 10. Labial class membership: cite the source for м

Grayson p. 209 rule 5 lists labials as /b/, /p/, /v/, /f/ only. The engine's `labials` set (`engine.ts:305`) adds м, and the brief's rule 2 names no members and no source. Evidence for м: D&P 3P1 (p. 76, P → Pь / — Pь, P the labial class) and p. 78 explicitly, "the palatalization of м before пь by 3P1" (к кемпингу → кьемпьингу); Grayson p. 211 prints симметрический /mʲmʲ/ (first м soft before мʲ) and p. 250 в мире /vʲ ˈmʲi rʲɪ/ (м as the labial trigger). Amendment: rule 2 reads "labials б п в ф (Grayson p. 209 rule 5) and м (D&P p. 78; Grayson pp. 211, 250) only before a soft labial", and the code comment at `:305` cites both.

The same precision is owed for two other sets the brief leaves implicit: which consonants count as "soft" triggers for the dental rule (ч, щ, й are `alwaysSoft` and will trigger unless excluded; D&P p. 81 лётчик supports ч; Grayson's pages here do not speak to it: NOT ESTABLISHED), and which count as "dental" for the н rule (engine `dentals`, `:307`, is т д с з н ц; D&P p. 81 кончать → коньчать makes ч a trigger for н; Grayson's wording "dental consonant" on p. 209 does not list members). Step 0 must count the words each choice moves.

### 11. Lane inputs do not exist on `Shane`

`git show origin/Shane:docs/memory/OPEN.md | grep "REGRESSIVE PALATALIZATION FOLLOWS"` returns nothing; INBOX.md on the branch has no 2026-11-01 entries later than 12:19; `docs/sessions/truth-set-palatalization_r1_2026-11-01.md` is not in the tree. A lane cut from `Shane` cannot "read that section in full" or turn the truth set into a test. Either the desk pushes `docs/memory` and the truth set to `Shane` before cutting the lane, or the brief inlines the ruling text, the truth set, and the email quotation (the brief already forbids Code to touch `docs/memory`, so Code cannot fetch them itself).

### 12. `engine.ts` is at its ratchet ceiling

`scripts/ratchets.json` pins `packages/phonology/src/engine.ts` at 2291 lines; the file is 2291 lines. Step 1 adds reason recording and the в/с/з rule. The brief must say: new logic goes in a new module (the pattern of `voicing-rule2.ts`, `lexical-palatalization.ts`, `reflexive.ts`), and engine.ts may only shrink (the blocker set, pass 3, the duplicate р branch, and the dental-before-м comment block all come out, which buys room). "All eight gates at baseline" would catch a breach, but after the work is done.

### 13. The approval golden master is a pin the brief does not name

`apps/web/src/lib/approval/__approved__/ipa-corpus.txt` (94 lines) pins end-to-end IPA with the full dictionary through `ipa-corpus.approval.test.ts`. Step 1 changes it. Name it beside `consonants-clusters.test.ts:163-175`, and apply the same rule: re-approve only to values the rules give, each changed line listed in the report with its rule.

### 14. Small corrections

- Step 0 says "with steps 1 and 2 applied"; it means rules 1 to 5 of step 1. Step 2 is the test.
- "Cross-word palatalization (p. 249, prepositions) lives outside this map; leave it, and list where it lives" presumes it exists. `applyCrossWordAssimilation` (`engine.ts:2160-2253`) does voicing and sibilant mergers only; proclitic IPA is fixed in `cliticData`. I found no cross-word palatalization. Reword: "report whether it exists; if not, say so". Grayson p. 206 rule 5 (word boundary crossed when the next word begins with an indicator letter other than и and the preceding word ends in в, с, з) and p. 250's к киоску, под диваном, в мире, с ними (D&P p. 81) are the spec for that future brief.
- The email date: `engine.ts:1000` and `consonants-clusters.test.ts:154` say Feb 26, 2026; the ruling says 2026-02-25 01:09 Toronto. Which is right is NOT ESTABLISHED here (a UTC stamp and a Toronto stamp could differ by a day). The brief should instruct Code to copy the date from the INBOX quotation and not to "fix" a date it cannot see.
- Rule 1 could also cite p. 206 rule 2 for the в/с/з exception to ъ; p. 193 is the prose, p. 206 the rule list.
- The brief's own text (header) says "Dann found Ilya's comment ... beside a soft [vʲ]". Probe confirms: неподвижный → ɲɪpɑdˈvʲiʒnɨj, д hard, `hard:д` template says "no palatalizing agent nearby".

## Truth set: transcriptions checked against the images

Every Grayson IPA string in the truth set matches the rendered page: pp. 194 (объедать, обедать, съесть, сесть, въезд, подъём, объять, разъярять), 209 n. 277 (смерть, терпеть, кирпич), 210 (стол, столь, мать, мять, большой, сестрёнка), 211 (симметрический, final form), 250 (съесть, обвить, отчёт, оттенок, изменять). The truth set's "Ilya today" column matches my probes on 2b980e7 for every row I re-ran. Two notes, neither load-bearing for softness: the p. 194 table's low vowel may be [a] rather than [ɑ] in Grayson's font (not resolvable at this resolution), and въезд's voicing differs (Grayson /vjɛst/, Ilya ˈvjɛzt: the з before final devoiced д is not devoiced), which is a voicing matter outside this brief and worth an INBOX line.

## Rules against the pages

- Boundaries (p. 206, six items) and the в/с/з exception (pp. 193, 206, 249): brief matches.
- Limits (p. 209, five items): brief matches, with amendment 10 on the labial members and the undefined trigger sets.
- Dentals before any soft consonant: Grayson has no dental limit on p. 209, and pp. 210 to 211 print /sʲtʲrʲ/ and /tʲrʲ/. Grayson p. 210 attributes сестрёнка's р softness to the ё, not to the limits, so the dental chain starts from a vowel-softened р; consistent with the brief.
- The р rule: Grayson p. 209 rule 2 says "in the stressed syllable only"; the ratified rule widens it to the next vowel, which Grayson's own n. 277 examples require (терпеть, кирпич). Brief quotes the ruling verbatim.
- Removing the р/л blocker: Grayson p. 208 steps 3 to 5 treat a non-palatalizable consonant as a stop in the walk, not a boundary; nothing on pp. 206 to 209 makes a hard р or л a boundary. Brief matches.

## What I could not establish

- Whether Grayson palatalizes a dental before ч or щ inside a morpheme (лётчик, матч), or н before ч (кончать). Not on pp. 193 to 211 or 249 to 250 as rendered. D&P pp. 79 and 81 say yes for both.
- Whether Grayson counts л as a "dental consonant" for rule 3 on н. Not stated.
- Which date the Grayson email carries (02-25 Toronto or 02-26).
- Whether `apps/web` has a gate that rejects `TODO-EN`/`TODO-FR` strings in `blurb-composer.json`, or a French-parity gate that the placeholders would trip. Not in the checked-out paths.
- Whether the "song corpus" the brief's step 0 names is the 94-line approval corpus or another set. No other corpus is in the tree under that name.
- The [a]/[ɑ] glyph on p. 194 at the resolution supplied.
