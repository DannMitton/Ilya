# N.204 unit a: the judgement read
Files read: 23 of 23. Findings: 62 (tier 1 43, tier 2 9, tier 3 4, and 6 behaviour defects that sit outside the tiers). Blockers: 0.

Read by Fable, 2026-11-19, tree `Shane` `b79e33e9`, brief `brief-fable-n204-unit-a_r1_2026-11-19.md` (md5 `c2990ee3db593c30f4039b1210d8f422`, confirmed). Every one of the 23 files was read whole, in this session.

How the count is made: the tier 1 total is F1 to F11 (11), K1 to K16 (16), and C1 to C16 (16). Tier 2 is G1 to G9. Tier 3 is H1 to H4. The six behaviour defects are D1 to D6. The labels D, F, G, H, K, C, and R, and the term "behaviour defect", are mine; the tier numbers are the brief's.

One departure from the brief, stated plainly. The brief says this is a read. For six claims a reading alone could not settle, I copied `packages/phonology/src`, `packages/blurb/src`, and `data/blurb-composer.json` to `/tmp` inside the bridge's VM, ran them there with `node --experimental-strip-types`, and deleted the copies. Nothing in the repository was written, no gate was run, and no test was run. Each claim that rests on that run says "ran". Every other claim rests on the source as read.

On ONE VOWEL PER NOTE: nothing in the 23 files puts text under a note, and nothing in them puts two vowels in one syllable. `GraysonEngine.vowels`, the `VOWELS` of `palatalization.ts`, `reflexive.ts`, and `cyrillic.ts` all leave «й» out, and `syllabifyOpenSyllable` closes a syllable at every vowel. The nearest thing to a bend is recorded as R1 below: `syllabify` returns one "syllable" for a vowelless word (ran: `syllabify('в')` gives `["в"]`, `syllabify('ль')` gives `["ль"]`), so `TranscriptionResult.syllables.length` is not a count of notes. Whether each consumer outside this unit folds that member into its host is NOT ESTABLISHED here. I did not count it as a blocker because the engine does not seat text; the desk may judge otherwise.

## The paragraph a developer needs

### `packages/phonology`

This package turns one Russian word, and then one line of words, into sung IPA with a per-letter log that says why each sound is what it is. `GraysonEngine.transcribe` does one word: it syllabifies, fixes the stress (ё wins, a one-vowel word that is not a clitic is stressed), asks `computePalatalization` for a soft or hard verdict and a reason for every consonant, walks the letters, then repairs voicing inside the word. `autoDetectBoundaries` and `applyCrossWordAssimilation` do the line: they decide what kind of boundary follows each word and let voicing cross it. The small files beside `engine.ts` exist for two reasons that a newcomer will not guess. First, the engine has no morphology, so every rule Grayson states morphologically (the reflexive -ся, the prefix boundary, the -ция suffix, the цвет family, the мягк- and лёгк- roots) is carried as a measured list or a spelling predicate with its known limits written in the header. Second, `engine.ts` sits exactly at its line ceiling (2,048 lines against 2,048 in `scripts/ratchets.json`), so new rules could not be added to it; `voicing-rule2.ts` says so in its header. What a newcomer would get wrong: the engine header still calls Grayson the sole authority, while `palatalization.ts`, `lexical-r.ts`, and `prefix-boundary.ts` rest in part on Derwing and Priestly 1980 and on Dann's dated rulings; the palatalization map is said to be the only source of softness and is not (D3); the within-word and cross-word voicing passes keep two separate sets of tables that disagree (D1, H3); and the stress dictionary lives here as module state, not in `@ilya/dictionary`.

### `packages/dictionary`

This package holds everything about a word that is not its sound: the gloss pipeline (`formatGlossForDisplay` and its helpers), a hand-written gloss table, two spelling normalisers that propose a modern or uncontracted form for the caller's dictionary to accept or decline, and two helpers that put an acute accent on Cyrillic. It imports nothing from the other packages. It is shaped as proposals because of two rulings recorded in `pre-reform-normalizer.ts`: the modernised spelling is what Ilya displays, transcribes, and looks up, and the caller adopts it only when the dictionary knows the result. What a newcomer would get wrong: the package is named "dictionary" and does not look up stress (`GraysonEngine.lookupStress` does); it holds its own second reference to the same dictionary data (`setGlossDictionary`), cleaned by a different rule; `normalizePoetic` changes the lookup only and never the page, while `modernisePreReform` changes the page too; and the order inside `modernisePreReform` (letters first, hard sign second) is load-bearing and has a test named for it.

### `packages/blurb`

This package turns the engine's log into the sentence a singer reads about one letter. `deriveRule` reduces an entry's features to a rule key, `composeBlurb` joins an identity sentence for the letter to a process sentence for the rule (and an optional third), and `buildDisplayLog` expands a cluster entry into one row per letter and merges a j-glide with its vowel. The sentences are data, in `data/blurb-composer.json`, injected with `setBlurbData`; the package imports nothing from the other two. What a newcomer would get wrong: the whole contract with the engine is made of strings that no type checks (`palReason`, `exception`, the glide `source`, a dozen boolean flags); the package keeps its own copy of the engine's log type, and the two have drifted; `blurb.test.ts` pins the composer against a hand-built fixture, so a rule key that the real data lacks falls through to the arrow fallback («я → a») with only a console warning (D2); and a handful of English-only sentences live in `lookupClusterCharBlurb`, outside the data file and outside French (G6).

## Hidden relationships, each proposed as a check

R1. **Syllables and vowels.** `addStressMarkToCyrillic` finds the stressed vowel by counting vowels up to the stressed syllable's index, so it relies on `syllabify` giving one vowel per syllable. `syllabify` does, except that a vowelless word comes back as one syllable. Check: a property test over the IPA corpus words (`apps/web/src/lib/approval/ipa-corpus.approval.test.ts` already loads one) asserting that every syllable holds exactly one member of `GraysonEngine.vowels`, or the word holds none and has one syllable. This is this unit's ONE VOWEL PER NOTE check.

R2. **Cluster keys in two packages.** `buildDisplayLog` expands a cluster only when `CLUSTER_BREAKDOWNS[entry.char]` exists. The engine's keys are those of `specialClusters`, `wordSpecificClusters`, and `reflexiveSuffixes`. Four engine keys have no breakdown: `стн`, `здн`, `тс`, `тьс`. `blurb.test.ts` pins the count at 16 and does not compare with the engine. Check: one test in `apps/web` (the only place that may import both) asserting that every engine cluster key is a `CLUSTER_BREAKDOWNS` key, and that each merged breakdown's `mergedIpa` equals the engine's value.

R3. **Rule keys and the data file.** A key that `deriveRule` can return and `data/blurb-composer.json` lacks is silent apart from `console.warn`. Check: a test that runs the corpus through `transcribe` and `buildDisplayLog` against the real data and fails on any row whose blurb is the arrow fallback of `lookupBlurb`. It fails today (D2).

R4. **`PalReason` as a string.** `palatalization.ts` defines the union; `blurb/src/types.ts` types `palReason` as `string`; `IDENTITY_ONLY_RULES` and the process keys of the data file repeat the names. Check: a test listing `SOFT_REASONS`, `HARD_REASONS`, and `cluster`, asserting each is either a process key or a member of `IDENTITY_ONLY_RULES`. Today that holds (I checked each name against the data file), with one caveat: for `cluster` the identity lookup fails first (D2).

R5. **Feature flags.** `lexicalGk`, `bogException`, `genitiveEnding`, `voicingAssimilation`, `devoiced`, `voiced`, `reflexive`, the `exception` values, and the glide `source` values are written in `engine.ts` and `lexical-gk.ts` and read in `deriveRule`; `finalDevoicing` and `retainedVoicing` are read there and written outside this unit (`apps/web/src/lib/voicing-log.ts` names them; I did not read it). The engine's `features` is `{ [key: string]: any }`. Check: export one `LogFeatures` type from one place and have both packages use it (G4); until then, R3's test covers the visible half.

R6. **One dictionary, two references.** `setStressDictionary` (phonology) and `setGlossDictionary` (dictionary) each hold module state; a loader that sets one and not the other gives stress without glosses or the reverse. Check: a test on `apps/web/src/lib/loader.ts` that both are called with the same object. Whether one exists is NOT ESTABLISHED; `loader.test.ts` was not read.

R7. **Two cleaners for one lookup.** `lookupStress` strips `[.,!?;:"""''–—]`, the acute, and case. `lookupFullEntry` strips those and also `«»…()` and a trailing hyphen. A token carrying a guillemet resolves in one and misses in the other unless the caller cleans first. Check: a shared `cleanForLookup` with one test (G1), or a test that feeds both the same punctuated tokens.

R8. **Order of the shcha clusters.** `findSpecialClusters` relies on the insertion order of `SHCHA_CLUSTERS` and on the "already covered" skip. The check exists: `shcha-clusters.test.ts` compares the first six keys of `specialClusters` with `SHCHA_CLUSTERS`. Nothing to add.

R9. **Segment count across the voicing repair.** `transcribe` re-cuts the word's IPA into syllables by counting `parseIPASegments` of each syllable before `applyRegressiveVoicing` and `lexicalGk` and slicing after. Any step between that changes the number of segments shifts every later syllable. Check: a corpus test asserting that the syllables' IPA, joined, equals `ipaUnderlying` with the stress mark removed.

R10. **Order inside `transcribe`.** Three orderings hold and no comment names them together: in pass 1 of `computePalatalization`, the reflexive с beats the stage velar, which beats a lexical soft; among vowel exceptions, `lexical-exception` beats `aya-suffix`, which beats `reflexive`, which beats `velar-adjectival`; after the walk, `applyRegressiveVoicing`, then `lexicalGk`, then the syllable re-cut, then `annotatePalatalization`, then the log repair, then final devoicing or «бог». Check: one named test per ordering, on a word that meets two rules at once (счастливая for the first two vowel exceptions; мягкий for voicing then `lexicalGk`).

R11. **«русский» in two tables.** The same twelve forms are keys of `wordSpecificClusters` (for `сс`) and of `exceptionWords` (for `skipVelarAdjectival`). Check: a test that the two key sets are equal, or one list (G3).

R12. **«бог» in two sites.** `transcribe` writes [x] for the isolated word; `finishBog` rewrites the final after the cross-word pass, and its comment explains why both are needed. They match the word by different cleaners (`cleanWord === 'бог'` and `lettersOf(...) === 'бог'`). Check: `voicing-rule2.test.ts` is the place; whether it covers a punctuated «Бог,» is NOT ESTABLISHED.

R13. **Stress sentinels.** `-1` and `-2` are bare numbers in `getSyllablePosition`, `transcribeWord`, `resolveCliticChain` (`hostStress: -2`), and, by the pre-reform header, `pipeline.ts`. `dictionary/src/types.ts` documents `-1` as "monosyllable"; the engine reads `-1` as "every vowel unstressed" and gives a monosyllable `0`. Check: two named constants exported from phonology (F6) and a test on each meaning.

R14. **The letter classes, five times.** The vowel list stands in `GraysonEngine.vowels`, `palatalization.ts` (`VOWELS`), `reflexive.ts` (`VOWELS`), `cyrillic.ts` (`VOWELS`), and as literals in `composer.ts`; the always-hard and always-soft letters stand in `GraysonEngine.alwaysHard` and `alwaysSoft`, in `palatalization.ts`, as literals in `transcribe` and `transcribeVowel`, and in `deriveRuleStandard`. Check: G2 inside phonology; across packages, a test in `apps/web` that the lists agree.

R15. **The compressed dictionary's short keys.** `normalizeEntry` (inside `lookupStress`), `lemmasOf`, and `entriesOf` each read `l` and `p` beside `lemma` and `pos`, all through `any`. A build that renames a key breaks three files with no type error. Check: type them with `DictionaryEntry` (G4).

R16. **`cleanWord` and the hyphen.** `VOICING_PREPOSITIONS` holds «изпод» because the caller's `cleanWord` has no hyphen. Check: a test at the caller that «из-под» reaches `keepsVoicingAtBoundary4` as «изпод». `apps/web/src/lib/voicing-rule2.pipeline.test.ts` exists; I did not read it.

R17. **The line ceiling as a design force.** `engine.ts` is at its ceiling to the line. Four places show the pressure: two imports on one line, three fields of `BoundaryWord` on one line, and two statements on one line twice in `applyCrossWordAssimilation`. The ratchet is doing its job; the note is that lines are being joined to pass it. Check: none needed beyond the ratchet; H1 removes the cause.

## Findings

### Behaviour defects met during the read (not refactorings, no tier)

Each changes what a singer sees or reads, so none is a refactoring and each needs the desk or Dann before it is touched. They are here because this is the last look before the GUIDE and LEARN are finalized.

D1. **Anchor: `voicedObstruents`, `voicedToVoiceless`, `voicelessToVoiced`.** The within-word voicing tables hold no palatalized velar. `assimilateClusterVoicing` therefore treats a soft [ɡʲ] as a voiceless agent. Ran: изгиб gives `isʲˈɡʲip`, сгиб gives `ˈsʲɡʲip`, разгибать gives `rʌsʲɡʲiˈbɑtʲ`, отгиб gives `ɑtˈɡʲip`. The engine's own comment on `applyRegressiveVoicing` quotes Grayson that the cluster takes the voicing of its last member, which would give [zʲɡʲ] and [dɡʲ]. The cross-word tables (`crossWordVoicedObstruentSet`) do hold `ɡʲ`. Risk of the fix: every word with a consonant before ги or ге. Proof: new cases in `consonants-clusters.test.ts`, then the IPA corpus approval. No test names these words today (searched).

D2. **Anchor: `deriveRuleStandard`, `composeBlurb`, `lookupBlurb`, against `data/blurb-composer.json`.** Keys the engine and composer produce and the data lacks, so the row falls to the arrow fallback. Ran, with the real data: пять gives the row «я → a» (`stressed-interpalatal:я`); пить gives «и → i» (`stressed-interpalatal:и`; the data has that rule for е and э only, and `transcribe` sets `interpalatal` on any vowel between two soft sounds); синяя gives «я → ɑ» (`aya-suffix:я`); боится gives «я → ʌ» (`reflexive:я`) and «тс → tːs» (no identity for a cluster); здании gives « → ji» (`j-ii-suffix:и`); счастье gives «сч → ʃʲʃʲ»; честный gives «стн → sn». `apps/web/src/lib/pipeline.ts` calls `buildDisplayLog`. Whether a later layer replaces these rows before the singer sees them is NOT ESTABLISHED. Proof of a fix: R3's test.

D3. **Anchor: `isPalatalized`, at its two calls inside `transcribe`.** The vowel's neighbours are judged soft by `softAt(palMap, …) || this.isPalatalized(…)`. `isPalatalized` is a letter rule that predates the map, and it overrules the map wherever the map holds a consonant hard before an indicator vowel: the stage velar of -кий, -гий, -хий and the reflexive с. Ran, stage profile: всякий gives `ˈfsʲakɨj`, некий gives `ˈɲekɨj`, пегий gives `ˈpʲeɡɨj`; the vowel fronts before a velar the map marks `adjectival-stage-hard`. The header of `palatalization.ts` says that hard velar "softens nothing before it". Which vowel Dann wants there is his ruling; the defect is that two sources answer and the comment says one. This is also the one hand-rolled phonological predicate I found in the unit, which the fixed list forbids. Proof: new cases in `e-allophone.test.ts`, then the corpus approval.

D4. **Anchor: `lexicalGk`.** Three things. It sets the log entry's `ipa` to `'x'` when the surface is `xʲ` (ran: мягкие gives `ˈmʲaxʲkʲijɪ` with the г entry logged as `x`, `soft: true`). It finds the entry with `log.find((e) => e.char === 'г')`, the first г of the word, not the root's; `lexicalGkIndex` returns the right index and it is used only as a yes or no. Its regex rewrites the first velar-before-к pair anywhere in the IPA, not the pair at the root. The second and third are harmless for every word I could think of and are unproven beyond that. `composer.ts`, in `deriveRule`, says "a plain [x] before a soft к too", which contradicts the header of `lexical-gk.ts`. Proof: `packages/phonology/tests/lexical-gk.test.ts` and `packages/blurb/tests/lexical-gk.test.ts`.

D5. **Anchor: the consonant branch of `transcribe`.** The log's `soft` is computed from the IPA string (`consonantIpa.includes('ʲ') || consonantIpa === 'ɲ'`), not from `pal.soft`. Ran: the «й» of мой is logged `soft: false` with `palReason: 'always-soft'`. A genitive г read as [v] is logged with the reason of the г. Risk: any reader of `features.soft`. Proof: `palatalization-map.test.ts` plus one new case.

D6. **Anchor: the punctuation class `[.,!?;:"""''–—]`, fifteen times in `engine.ts`.** The class holds the straight double quote three times and the straight single quote twice. That shape says curly quotes were flattened to straight ones when the file was extracted. Ran: `syllabify('“слово”')` gives `["“сло","во”"]`. Whether every caller strips curly quotes and guillemets before the engine is NOT ESTABLISHED. `lookupFullEntry` in `gloss.ts` has the same flattened class with `«»…()` added.

### Tier 1: inside one file

F1. **Anchor: the punctuation class in `engine.ts` (D6).** Smell: one literal fifteen times. Refactoring: Extract Variable, to one module constant, and Extract Function `stripPunctuation`. Risk: low; the class is identical at all fifteen sites (counted with grep). It frees about a dozen lines under the ceiling. Proof: `engine.test.ts`, `notation-edge-cases.test.ts`.

F2. **Anchor: `needsGlide`, `precededByJGlide`, `iotatedVowels`, `iotatedV` in `transcribe`.** Smell: the list е ё ю я written three times and one condition computed twice. Refactoring: Extract Variable. Risk: low; the -ии case is the only difference between the two conditions and must stay. Proof: `stress-vowels.test.ts`, `e-allophone.test.ts`.

F3. **Anchor: `isAfterAlwaysHard` in `transcribeVowel`, `vowelFeatures.afterHard` in `transcribe`.** Smell: the literal `['ж', 'ш', 'ц']` beside `this.alwaysHard`. Refactoring: Replace Magic Literal with the existing set. Risk: none. Proof: `e-allophone.test.ts`.

F4. **Anchor: `getFinalConsonant`, `getInitialConsonant`.** Smell: one 49-item `patterns` array written twice. Refactoring: Extract Variable to one constant. Risk: none. Proof: `voicing-rule2.test.ts`.

F5. **Anchor: `transcribeVowel`, `getSyllablePosition`.** Smell: the position is a bare string; the pretonic, post-tonic, and remote branches repeat the same lines for е, э, и, ы, у, ю. `getSyllablePosition` returns `'unstressed'`, which no branch names and which falls into the remote branch; the blurb's `position` union has `'initial'`, which the engine never returns, and lacks `'unstressed'`. `getSyllablePosition` takes a third parameter, `total`, that it never reads. Refactorings: a `SyllablePosition` union type; Consolidate Conditional Expression for the shared lines; Change Function Declaration to drop `total`. Risk: medium for the consolidation, because the three branches differ for а, о, and я. Proof: `stress-vowels.test.ts`, the corpus approval.

F6. **Anchor: the literals `-1` and `-2` (R13).** Refactoring: Replace Magic Literal with `STRESS_NONE` and `STRESS_UNKNOWN`, exported. Risk: low. Proof: `engine.test.ts`, `clitics.test.ts`.

F7. **Anchor: `exceptions` in `checkGenitiveEnding`, `ipaVowels` in `isIPAVowel`, `sibilantMergers` in `applyCrossWordAssimilation`, `velarEndings` in `checkVelarAdjectival`.** Smell: constant tables rebuilt on every call (`isIPAVowel` runs per segment; `checkVelarAdjectival` runs per letter and then again per vowel). Refactoring: Slide Statements out to module constants. Risk: none. Proof: package tests.

F8. **Anchor: `prefixBoundary`, `LookAlikeRoot`, the `look-alike` member of `PrefixBoundary`.** Smell: `prefix` and `look` always hold the same value. Refactoring: Remove Dead Code for one of them (Change Function Declaration on the union). Risk: `annotatePalatalization` and the blurb read `look`. Proof: `prefix-boundary.test.ts`.

F9. **Anchor: `composeBlurb`.** Smell: the identity-only path and the full path each build `vars`, loop over the two languages, collect citations, and fall back to English. Refactoring: Extract Function for the per-language assembly. Risk: low. Proof: `blurb.test.ts`, `french-parity.test.ts`.

F10. **Anchor: `formatGlossForDisplay`, `attemptLemmaFallback`.** Smell: the same five steps (lemma gloss, resolve, clean, grammatical test, truncate) twice; `truncateGloss(x, 5)` passes the default. Refactoring: Extract Function `semanticGlossOfLemma`. Risk: low. Proof: `dictionary.test.ts`, `french-grammatical.test.ts`, `cross-package.test.ts`.

F11. **Anchor: the four joined lines named in R17.** Smell: formatting bent to a ceiling. Refactoring: none until H1 or F1 frees lines; then one statement per line. Risk: none.

### Tier 2: moves across modules

G1. **Anchor: `lookupStress`, `STRESS_DICTIONARY`, `SINGER_SUPPLEMENT`, `setStressDictionary`, `setSingerSupplement`, `applyCasePattern` (phonology); `lookupFullEntry`, `_dictionary`, `setGlossDictionary`, `restoreCasing` (dictionary).** Smell: the dictionary is held twice and looked up by two functions with different cleaning and different fallbacks (`lookupStress`: supplement first, ё restored, ё folded; `lookupFullEntry`: poetic contraction, no supplement, no ё). Two functions restore case. Refactoring: Move Function for `lookupStress`, its state, and `applyCasePattern` into `@ilya/dictionary`, then Extract Function for one cleaner. `GraysonEngine.lookupStress` stays as a delegating method so no caller changes. Risk: high; some twenty test files and `loader.ts` call the setters. Proof: the corpus approval, `dictionary.test.ts`, `stress-vowels.test.ts`.

G2. **Anchor: the letter classes of R14 inside phonology.** Refactoring: Move Field to a leaf module, `letters.ts`, that imports nothing, read by `engine.ts`, `palatalization.ts`, and `reflexive.ts`. `palatalization.ts` and `voicing-rule2.ts` import nothing from the engine today, and that stays true. Risk: low. Proof: `palatalization-map.test.ts`, `truth-set-palatalization.test.ts`.

G3. **Anchor: `wordSpecificClusters`, `exceptionWords`.** Smell: about 190 lines of data inside `engine.ts`, keyed by inflected form, with «русский» listed twice (R11). The paradigms are partial as written: the сердце family has four forms and lacks сердцах, сердцами, and сердцам; the солнце family lacks its plural; the `vowelOverrides` shape that `getVowelOverride` reads appears in no entry. Refactoring: Move Field to a `lexical-clusters.ts` beside the other lexical files. Keying by lemma, as `lexical-palatalization.ts` does, would cover the missing forms and is a behaviour change, so it is named here and not folded into the move. Risk of the move alone: low. Proof: `consonants-clusters.test.ts`.

G4. **Anchor: `TranscriptionLogEntry` (declared in both phonology and blurb), `SyllableInfo` and `SyllableData`, `StressDictionary` and `SingerSupplement` (identical aliases), `StressLookupResult` (`gloss: any`, `allEntries?: any[]`), `LemmaLookup`, `ReflexiveLookup`.** Smell: one shape declared in several places and held together by `any`. Refactoring: phonology already lists `@ilya/dictionary` as a dependency and imports nothing from it in `src`; import `DictionaryEntry` there. For the log type, one declaration that both phonology and blurb use. Risk: medium; typing `features` will surface real disagreements (F5's `'initial'`). Proof: `tsc`, then all three packages' tests.

G5. **Anchor: `cliticData`'s `gloss` field.** Smell: glosses, with French, inside the phonology engine; «то» and «меж» are glossed here and again, differently, in `CURATED_GLOSSES`. Refactoring: Move Field to `@ilya/dictionary`. No string changes. Risk: `pipeline.ts` and `nute-gloss.test.ts` read `cliticData.get(...).gloss`. Proof: `nute-gloss.test.ts`.

G6. **Anchor: `lookupClusterCharBlurb`.** Smell: seven singer-visible sentences as English string literals in code, returned as a bare string where `lookupBlurb` promises a bilingual object (ran: конечно gives a bare string for its ч). Refactoring: Move the sentences to `data/blurb-composer.json` unchanged. The French for them does not exist and is Dann's; this arrives as a marked draft or not at all. Risk: the strings are singer-visible. Proof: `blurb.test.ts`, `french-parity.test.ts` (which counts 196 templates and would need its count changed with the move).

G7. **Anchor: `finishBog`, and the «бог» branch at the end of `transcribe` (R12).** Refactoring: Extract Function for one `bogFinal` that both sites call, in `voicing-rule2.ts`. Risk: low. Proof: `voicing-rule2.test.ts`.

G8. **Anchor: the export lists of `phonology/src/index.ts` and `blurb/src/index.ts`.** Smell: the public surface does not match use. Exported and used by no file outside the package and its tests (searched `apps/web/src`, `packages`, `scripts`): `STOP_PREFIXES`, `VZS_PREFIXES`, `LOOK_ALIKE_ROOTS`, `prefixBoundary`, `LEXICAL_SOFT_R_LEMMAS`, `lexicalSoftRIndices`, `lexicalExceptionVowelIndex`, `SOFT_REASONS`; in blurb `lookupClusterCharBlurb`, `deriveRuleStandard`, `getBlurbData`, `formatCitations`, `substituteVars`, `mergeJGlidePairs`, `CLUSTER_BREAKDOWNS`, `isMergedCluster`; in dictionary `getLemmaGloss`, `extractLemmaFromGloss`, `extractCleanGloss`, `isGrammatical`. Not exported, and imported by tests through deep paths: `lexicalGk`, `SHCHA_CLUSTERS`, `VOICING_PREPOSITIONS`. Refactoring: narrow the index to what `apps/web` uses; tests import from `../src/<file>`. `HARD_REASONS` was not searched for on its own. Risk: low. Proof: `tsc`.

G9. **Anchor: `formatGlossForDisplay`'s `pos` parameter.** Smell: never read in the body. Refactoring: Change Function Declaration to remove it. Risk: `pipeline.ts`, `dictionary.test.ts`, and `cross-package.test.ts` pass it. Proof: `tsc`.

### Tier 3: splitting the ratcheted hotspot

H1. **Anchor: `GraysonEngine` in `engine.ts`.** What it does that belongs elsewhere, with rough line counts from this read: lexical data (`wordSpecificClusters`, `exceptionWords`), about 190; the clitic registry (`cliticData`, `proclitics`, `enclitics`), about 55; dictionary lookup (G1), about 125; syllabification (`protectedSuffixes`, `syllabify`, `syllabifyOpenSyllable`, `countVowels`, `findYoSyllable`, `hasYo`), about 110; within-word voicing (four tables, `applyRegressiveVoicing`, `parseIPASegments`, `isIPAVowel`, `assimilateClusterVoicing`, `applyFinalDevoicing`), about 215; cross-word voicing (`autoDetectBoundaries` through `applyCrossWordAssimilation`), about 250; notation (`applyNotationPreferences`), about 35. That leaves the inventory, the vowel and consonant rules, and `transcribe`. Refactoring: Move Function and Move Field, file by file, with `GraysonEngine` kept as a facade whose methods delegate, so no caller changes. The methods call each other through `this`, so each move turns `this.x` into an import. Order: the data first (G3, then the clitic registry), then notation, then syllabification, then voicing. Lower the ceiling in `scripts/ratchets.json` after each. Risk: high in total, low per step. Proof: the IPA corpus approval after every step, plus the package tests.

H2. **Anchor: `transcribe`.** Smell: Long Function, about 450 lines, one closure over a dozen locals. Refactoring: Extract Function, in this order: the isolated-clitic return; the effective stress; the palatalization inputs; the j-glide; the vowel's neighbours (the block that computes `isPrecededByPal` and `isFollowedByPal`); the syllable re-cut; the log repair. Risk: medium; the closure state (`charIndexInWord`, `sylIpa`) has to become parameters. Proof: as H1.

H3. **Anchor: `voicedToVoiceless`, `voicelessToVoiced`, `sonorantIPA`, `voicedObstruents`, `voicelessObstruents`, `vPhonemes`; `crossWordVoicingMap`, `crossWordDevoicingMap`, `crossWordVoicelessSet`, `crossWordVoicedObstruentSet`, `crossWordSonorantSet`, `crossWordVSet`.** Smell: one body of knowledge in two sets of tables that disagree: only the cross-word set knows ɡʲ, kʲ, and x to ɣ; only the within-word set names `tʃ` and `ʃtʃ`, which the inventory never writes (ч is `tʃʲ`, щ is `ʃʲʃʲ`). `parseIPASegments` cuts `tʃʲ` into `tʃ` and a lone `ʲ`, and the lone `ʲ` can stand as the cluster's agent in `assimilateClusterVoicing`; the result is right by accident, because it is not in `voicedObstruents`. Refactoring: one table, after H1 puts both passes in one file. This is where D1 is fixed. Risk: high; a behaviour change rides on it. Proof: `consonants-clusters.test.ts`, `voicing-rule2.test.ts`, the corpus approval.

H4. **Anchor: the log repair after `annotatePalatalization` in `transcribe`.** Smell: whether a consonant was voiced or devoiced is inferred by asking whether its old IPA is still a substring of its syllable's IPA (`sylData.ipa.includes(originalIpa)`). A syllable with the same consonant twice, or `d` inside `dʲ`, answers wrongly. Refactoring: carry the segment index through the walk and compare segment by segment (Substitute Algorithm). Risk: medium. Proof: a new test on a word with a repeated consonant in one syllable, then the corpus approval. I did not find a failing word; this is a reading, not a run.

## Dead code candidates

K1. **`normalizePreReform`** (`pre-reform-normalizer.ts`). Its own header says the composition with `normalizePoetic` no longer exists. Used only by `pre-reform-normalizer.test.ts`. Proof: grep for the name across `apps/web/src`, `packages`, `scripts`.

K2. **`addAcuteToSyllable`** (`cyrillic.ts`). Used only by `dictionary.test.ts`. Same proof.

K3. **The `vowelOverrides` branch of `getVowelOverride`.** No entry of `exceptionWords` has the field; the счаст- family moved to `lexical-exception.ts`. Proof: grep for `vowelOverrides`.

K4. **The `consonants` field of `protectedSuffixes`.** Written, never read. Proof: grep.

K5. **`voicelessObstruents`.** Defined, never read. Proof: grep.

K6. **The `ʃtʃ` branch of `parseIPASegments`, the `ʊ` of `isIPAVowel`, the ASCII `g` and `gʲ` of `crossWordDevoicingMap` and `crossWordVoicedObstruentSet`, the `l` and `nʲ` of `crossWordSonorantSet`, `ʒʲ`.** The inventory and `transcribeConsonant` cannot write them. Proof: scan the corpus output for the set of characters the engine emits.

K7. **The final `else` of pass 2 in `computePalatalization`.** Every consonant that reaches it is л, р, н, a velar, a labial, or т д с з; ж ш ц ч щ й were decided in pass 1. Its reason, `no-soft-follower`, would also be false there. Proof: a coverage run of `palatalization-map.test.ts`.

K8. **The precedence test in `prefixBoundary`** (`stop.length >= vzs.length`). No stop prefix and в/с/з prefix can begin the same word: the stop prefixes begin with п, н, о, and of the others only «низ» shares a first letter with «над», and they differ at the second. The header already says the в/с/з family "has no effect on any output, by construction"; the family is kept as the record of Grayson's exception (ii).

K9. **Two lines of `syllabifyOpenSyllable`.** `splitPoint = Math.max(1, cluster.length - 1)` assigns the value `splitPoint` already has (the cluster has two or more members there). `!syllables.includes(current)` can only be reached with `syllables` empty. Proof: coverage, or reading.

K10. **The sonorant guard of `applyFinalDevoicing`.** No sonorant is a key of `voicedToVoiceless`, so the loop below it returns the same string. Its pattern also omits `ɲ` and `lʲ`, which its comment lists.

K11. **In `composeBlurb`: the "French missing" warning, and `if (!blurb.fr) blurb.fr = blurb.en` in both paths.** Each layer is read as `x[lang] || x.en`, so the French pass can lack an entry only when the English pass has already returned null. The consequence matters more than the dead lines: a missing French layer is replaced by English with no warning. The data has French for every identity and process today (checked: 0 without).

K12. **In `lookupClusterCharBlurb`: the `сч` and `зч` branches.** Both clusters are in merged format, and `buildDisplayLog` sends merged clusters to `lookupBlurb`. Reached only from `blurb.test.ts`, if at all.

K13. **In `deriveRuleStandard`: the `finalDevoicing` test** (unreachable through `deriveRule`, which tests it first) **and the `position === 'initial'` branch** (the engine never returns it; the data holds five `initial:` keys and `blurb.test.ts` uses the value).

K14. **`profile` in `composeBlurb`'s `vars`.** Always the empty string. `getBlurbData` is used only by `blurb.test.ts`.

K15. **In `oldEndingCandidates`: the test `lowerEnding !== 'аго' && lowerEnding !== 'яго'`.** The regex above it admits nothing else. In `lookupOnlyTwin`, the second `.normalize('NFC')`.

K16. **`NotationPreferences.reconstitution`.** `applyNotationPreferences` does not read it, and its comment says "Phase 3 — not wired yet". Whether any file outside the unit reads the field is NOT ESTABLISHED, so this is a candidate only.

Not dead, recorded so nobody removes them: `TS_SUFFIX_NORMAL` (its comment says the engine does not read it and the tests pin it); the `cluster` member of `PalReason` (never produced by `computePalatalization`, used as a literal in `CLUSTER_BREAKDOWNS`).

## Comments: false, redundant, or carrying a ruling that needs rehoming

### False, or now false

C1. **`engine.ts`, file header.** "Extracted from prototype v6.0.114 (index.html, lines 6169–8202). This is a clean extraction, not a rewrite. Internal logic is preserved identically." No longer true of a file that imports eight rule modules, and it cites line numbers. "The sole phonological authority" (also in `index.ts` and the description in `package.json`) is contradicted by `palatalization.ts`, `lexical-r.ts`, and `prefix-boundary.ts`. The header also does not say what the file must agree with, which the standard asks of every header.

C2. **`engine.ts`, the N.13 comment in `applyCrossWordAssimilation`.** It cites `:2221`; the file has 2,048 lines.

C3. **`engine.ts`, on `setStressDictionary` and `setSingerSupplement`.** "Called by @ilya/dictionary after load." `@ilya/dictionary` imports nothing from phonology; `apps/web/src/lib/loader.ts` holds the calls.

C4. **`engine.ts`, on `syllabifyOpenSyllable`.** "Maximum Onset Principle." The code leaves one consonant for the next syllable and keeps the rest in the coda.

C5. **`palatalization.ts` header ("nothing re-derives softness from the IPA string") and `engine.ts` on `transcribeConsonant` ("The map is the only source of softness").** Three sites re-derive it: `isPalatalized` (D3), `prevCluster.ipa.includes('ʲ')` and `clusterIPA[1] === 'ʲ'`, and the log's `soft` (D5).

C6. **`engine.ts`, three comments that sit over the wrong code.** "Direct softening by the letter that follows:" ends in a colon and is followed by `protectedSuffixes`. "Sync transcriptionLog to match surface IPA after voicing assimilation (v5.10.20)" sits over the call to `annotatePalatalization`. "Use canonical form from registry" sits over a branch that runs only for a clitic with no vowel.

C7. **`engine.ts`, over the palatalization map in `transcribe`.** "Regressive AND progressive palatalization (for р after front vowels)": `computePalatalization` has no progressive rule; the р rule is a condition on a regressive one.

C8. **`clitics.ts` header.** "Imports the derived Sets": it reads one, `proclitics`.

C9. **`blurb/src/types.ts`, on `lexicalGk`.** Cites "Grayson 2012 p. 17". The header of `lexical-gk.ts` says p. 240 and says p. 17 was an earlier wrong citation.

C10. **`composer.ts`.** In `deriveRule`: "a plain [x] before a soft к too" (see D4). On `deriveRule`'s return: the example key `"soft"`, which the comment in `deriveRuleStandard` says no longer exists. On `lookupBlurb`: "Always returns BilingualBlurb (never bare string)" (see G6).

C11. **`gloss.ts` header.** "Pure and testable without global state": `_dictionary` is module state read by `lookupFullEntry` and `getLemmaGloss`.

C12. **`pre-reform-normalizer.ts`.** (a) A JSDoc block that describes an array return ("Returns an array of candidate modern forms…") stands directly above the JSDoc of `hasAbolishedLetter` and belongs to nothing; `modernisePreReform` has no comment at its declaration. (b) On `ABOLISHED_LETTERS`: "it can never alter the IPA Ilya prints", while the header reports that дѣти transcribes to `ˈttʲi` as printed and `ˈdʲetʲi` modernised. (c) "The character map above" in the header; the map is below. (d) Five line-number citations: `GuideContent.svelte:291`, `LearnContent.svelte:2124-2127`, `reconciliation/taxonomy.ts:15` and `:20`, `engine.ts:232-233` twice.

C13. **`dictionary/src/types.ts`, on `stress`.** "-1 for monosyllable" (R13). Which side is right is NOT ESTABLISHED; the data was not read.

### Redundant, or history

C14. **Version tags that tell a newcomer nothing:** `v5.11.10`, `v5.11.45`, `v5.10.20` (twice), `v5.11.1` in `engine.ts`; `v5.5.1` in `composer.ts`; `v5.11.18`, `v5.11.21`, `v6.0.115`, and "Test words" in `curated-glosses.ts`. Prototype history: "In the prototype…" in the headers of `gloss.ts` and `composer.ts`, "This was RuleRegistry.deriveRule() in the prototype", "now renamed and called by the wrapper". Numbers with no date or words, against section 5: "Step 10" (`types.ts`, `composer.ts`), "N.13" (`engine.ts`), "(N.12)" (`dictionary/src/index.ts`). Comments that restate the next line: "If it's a vowel, just add it", "Skip hard boundaries", "Remove stress marks first", "Single entry", "Check if word ends in -ая or -яя", and the one-line JSDoc on `isVoicelessConsonant`, `isVoicedObstruent`, `isSonorantConsonant`. In `gloss.ts` and `composer.ts` every function has a banner and a JSDoc that say the same thing. The two credit lines in `poetic-normalizer.ts` ("Architecture: Kimi…", "Implementation: Claude…") answer none of the three purposes; whether credit stays in a header is Dann's taste.

### Carrying a ruling, or an open question

C15. **Rulings, each to keep with a pointer.** `pre-reform-normalizer.ts`: Dann 2026-07-16 (build it, silent, run pre-dictionary, never touch ь) and 2026-08-08 (modernise at intake; the dictionary disposes; abstain on stress; the endings "ruled in"), all with date and words, none with the document that records it. On -аго: the file says -аго and -яго "change for the page, the transcription, and the lookup" and that the endings were ruled in on 2026-08-08; the brief describes this as the ruling that -аго is sung as -ого. I found no sentence in the file that quotes Dann on how -аго is sung, so the pointer to where that ruling lives is the thing to add. The ATTRIBUTION paragraph is session history; it protects against a rule Dann never made, so it rehomes to its trace document (`claude/e33-a-rule-dann-never-made_2026-08-08.md`, named in the header) with one line left behind. `lexical-gk.ts` (2026-11-09 15:42), `voicing-rule2.ts` (2026-10-26 17:26 and 21:35), `prefix-boundary.ts` (2026-11-02 00:50), `palatalization.ts` (2026-11-01 23:53 and 23:58), `reflexive.ts` (2026-10-12 20:33), and `lexical-palatalization.ts` (2026-09-27) carry date and words and meet the standard as they stand.

C16. **Open questions living in comments, to rehome to `OPEN.md` with a pointer left in the file.** The GUIDE and LEARN cannot state any of these as Grayson's or as Dann's until they are closed:
- `LOOKUP_ONLY_TABLE`: "how these are sung is Dann's to say, and he has not been asked" (онѣ, однѣ and its forms, ея, нея, -ыя, -ія).
- `lexical-palatalization.ts`: the "NOT RULED, left as they were… for Dann" list of -ция and -ционн- words.
- `LOOK_ALIKE_ROOTS`: "NOT ESTABLISHED: whether Dann meant exactly these" four отч- stems.
- `N_TRIGGERS`: "NOT ESTABLISHED that Grayson counts ц so"; ч and щ as triggers rest on Derwing and Priestly, with Grayson silent.
- `VOICING_PREPOSITIONS`: "NOT ESTABLISHED in Grayson: whether his 'prepositions' take in these."
- `reflexive.ts`: clause 4 is marked DESK INFERENCE, and the [ʌ] to [ɑ] reconstitution is "the desk's reading, not one sentence of Grayson's".
- `lexical-r.ts`: the three words stay soft in every case form by DESK DEFAULT.
- `engine.ts`, the «бог» comment in `transcribe`: "a Church Slavonic preservation", with no source in the file.

## What I could not establish

- Whether any consumer outside the unit gives a note to the vowelless member of `syllables` (R1). This is the one open question that bears on ONE VOWEL PER NOTE.
- Whether the Inspector shows the arrow fallback rows of D2 to a singer, or replaces them.
- Whether curly quotes and guillemets reach the engine (D6).
- Which vowel Dann wants before a stage-hard velar and before the reflexive с (D3). The reflexive case was read, not run: without a dictionary loaded, the word I tried was not judged reflexive.
- Whether Grayson addresses a consonant before soft г on his voicing pages (D1). The engine's quoted sentence is all I read.
- What `-1` means in the dictionary data (C13).
- Whether `NotationPreferences.reconstitution` is read outside the unit (K16), and whether `HARD_REASONS` is (G8).
- What the test files pin beyond what a grep for names shows. The tests are not among the 23 files and I did not read them; "no test names these words" means a search for the words found none. The process keys `muscovite:щ` and `peterburgian:щ` in the data have no rule in this unit that derives them; where they are used is not established.
- The line counts in H1 are from this read and are approximate.
- The known gaps the brief names (the token-per-byte ratio, the fixture binder, consistency batches 3 and 4, the Sonnet packet) stay open.
