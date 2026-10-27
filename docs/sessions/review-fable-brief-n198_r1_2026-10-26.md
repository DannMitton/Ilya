# Fable review: brief for Code, N.198 (voicing rule 2), r1 (2026-10-26)

Brief reviewed: `docs/sessions/brief-code-n198-voicing-rule2_r1_2026-10-26.md`, md5 `e0a1522599f2c01adcec64bd56a4aee8` (checked in the cloud clone 2026-10-26). Repository read at `Shane` `e0f4ad9`. Every `path:line` below was read by Fable this session; NOT ESTABLISHED beats a complete invented answer.

What was run. (1) `pnpm test:phonology`: 8 files, 267 tests, all green, so the two tests the brief rewrites pass today. (2) A temporary vitest probe under `apps/web` (deleted afterwards; the tree is as it was) that loaded the real dictionary the way `ipa-corpus.approval.test.ts:76-99` does, ran `processText` on the brief's ten lines and on 40 more, then re-ran them with `applyCrossWordAssimilation` replaced by a copy carrying step 1 exactly as the brief words it (keep voicing before a vowel, sonorant, or в only when the left word is a proclitic or is б or ж). Its output is `/root/review-out/probe-n198.txt` and `probe-n198-b.txt`. Grayson was read in the pdftotext file at PDF pages 264 to 268 (printed 248 to 252) and PDF 160 (printed 144), with the keyboard mapping applied by hand.

## Verdict: SEND WITH AMENDMENTS

The brief's reading of Grayson is right, and its premise is true in the code: «сад наш» comes out [ˈsɑd ˈnɑʃ] today where p. 252 prints [sat naʃ]. But step 1 as worded breaks two things that are right today and makes one of the brief's own pins unreachable. Amendments 1 to 3 change what Code would build; 4 and 5 give Code facts it needs to build step 1 at all; 6 to 9 correct cites, a test that cannot fail, and the NOT ESTABLISHED lines.

### The reading of Grayson, confirmed

- Boundary #4 is defined on p. 248 (PDF 264): "in between a preposition and its object or a prefix/suffix and a word root". Boundary #3 is "the individual word".
- Rule 2, p. 251 (PDF 267), is as the brief quotes it. Its p. 252 examples (PDF 268), decoded from Grayson's IPA font (r=s, @=a, s=t, m=n, R=ʃ, &=palatalized, a=b, y=z, Y=ʒ, q=r, 4=ɫ, k=l, j=k, t=u, H=e, 0=ɪ, u=v): «сад наш» [sat naʃ], «сад Анны» [sat ˈanɪ], «сад ваш» [sat vaʃ]; «меж нас» [mʲeʐ nas], «без Анны» [bʲez ˈanɪ]; and two the brief leaves out: «разлука» [razˈɫuka] (a prefix before a root inside one word) and «если б мог» [ˈjesʲlʲi b mok] (the particle contraction б before м). So "particle contractions" is ESTABLISHED as the vowelless particles б (for бы) and, by the same formation, ж (for же); ли is a full particle, not a contraction. "Word roots (boundary #4)" means the root side of a prefix or suffix junction inside a word («разлука»), not "any word". The brief's conclusion stands: an ordinary word at boundary #3 devoices before a vowel or sonorant.
- The в passage is on p. 251, not p. 250 as `engine.ts:2182` says; the brief's step 1 corrects that, rightly. Grayson's own technique: "ignore /u/ (-d-) [в] when it is in a position of regressive influence and ... look to the next letter in line to apply its particular influence across both the /u/-phoneme and the word boundary." Amendment 1 rests on that sentence.
- Under rule #4 on p. 252, «кот бы» is [kod bɪ] and «гость бы» [ɡozʲdʲ bɪ]: the enclitic case with a voiced obstruent is rule 4, not rule 2, and the engine already gets it (probe: «кот бы» → ˈkod bɨ).

### The premise, measured (probe, current tree)

| line | today | Grayson p. 252 |
|---|---|---|
| сад наш | ˈsɑd ˈnɑʃ | [sat naʃ] |
| сад Анны | ˈsɑd ˈɑn nɨ | [sat ˈanɪ] |
| сад ваш | ˈsɑd ˈvɑʃ | [sat vaʃ] |
| друг мой | ˈdruɡ ˈmoj | (devoice) |
| глаз открыт | ˈɡɫɑz ɑtk ˈrɨt | (devoice) |
| меж нас | ˈmʲɛʒ ˈnɑs | [mʲeʐ nas], agrees |
| без Анны | bʲɪz ˈɑn nɨ | [bʲez ˈanɪ], agrees |
| из окна, под водой, об этом | iz, pʌd, ɑb | agree (clitic boundary, `:2249`) |
| если б мог | ˈjɛs lʲib ˈmok | [ˈjesʲlʲi b mok], agrees |
| разлука | rɑz ˈɫu kɑ | agrees (within a word) |

Step 0's stop condition will not fire. The premise holds.

## Amendments, ranked

### 1. Step 1 as worded devoices a word before в + obstruent, which is right today and wrong after

Evidence. The branch at `engine.ts:2183` tests only the first segment of the right word; `getInitialConsonant` (`:2097-2115`) returns `'v'` for «вдали», «вдруг», «взор», «вдовы», and for the bare proclitic «в». Grayson p. 251: в followed by a consonant that is not a sonorant "follows the rules of a non-sonorant consonant", so «сад вдали» is rule 4, voiced obstruent д reaching back through в: [sad vdalʲi]. Today the branch keeps every voiced final before any в, so these come out right by accident. Under step 1 as worded the probe gives: «сад вдали» ˈsɑt, «глаз вдруг» ˈɡɫɑs, «муж вдовы» ˈmuʃ, «друг взглянул» ˈdruk, «сад взор» ˈsɑt, «сад в доме» ˈsɑt (each ˈsɑd, ˈɡɫɑz, ˈmuʒ, ˈdruɡ today). «сад в траве» moves ˈsɑd → ˈsɑt, which is the one of these that Grayson's technique also devoices (т after в).

Where it walls a singer in. «взор», «вдруг», «вдали», «вдоль», «взгляд», «вздох» sit in half the art-song repertoire. A singer handed [sat vzor] has no control that puts the [d] back; the typed # of batch C does the opposite.

Cost if not amended. Step 2's pin «сад ваш» ends in [t] passes, the Grayson examples pass, and a class of lines the engine gets right today goes wrong with no test watching it.

Replace step 1 with:

> **Step 1, the rule.** In `applyCrossWordAssimilation`, compute an *effective right initial* before the branches: starting at the right word's first segment, skip over `v`/`vʲ` (`isVPhoneme`) to the next segment of the same word; if the right word is the bare proclitic «в» (no segment after the v), look at the first segment of the word after it. Grayson p. 251: "ignore /u/ (-d-) when it is in a position of regressive influence and ... look to the next letter in line." Then:
> - If the effective initial is nothing (a vowel) or a sonorant: keep the left final's voicing only where boundary #4 applies, that is, the left word is a proclitic or is the particle contraction б or ж (amendment 4 says how the engine knows). Otherwise leave `skipFinalDevoicing` false and let the loop at `:2249` devoice it.
> - If the effective initial is a voiced obstruent: the existing voiced-before-voiced branch (`:2233-2240`): keep voicing. Pin: «сад вдали» → ˈsɑd, «сад в доме» → ˈsɑd, «глаз вдруг» → ˈɡɫɑz.
> - If the effective initial is voiceless: the existing devoicing branch (`:2224-2227`). Pin: «сад в траве» → ˈsɑt (the в word's own surface is still devoiced at its own boundary, as today: → ftrɑ ˈvʲɛ).
> The sibilant mergers (`:2190-2217`) and the в-before-voiceless branch (`:2228-2232`) are unchanged. Correct the comment at `:2179-2182` to quote p. 251.

Note for Code: when the right word begins with в + voiceless (e.g. «встречи», «всех»), the within-word pass has already made the initial `f` (probe: «без встречи» → bʲɪs ˈfstrʲe tʃʲi, «без всех» → bʲɪs ˈfsʲɛx, right today), so the look-through only matters for в + voiced obstruent and for the bare «в».

### 2. Step 1 kills the «бог» → [box] exception; the one corpus line that moves is this regression

Evidence. Grayson p. 144 (PDF 160) prints «бог» as /box/ (the comment at `engine.ts:1963` cites p. 242, where the word does not appear; the exception itself is right). `transcribe` writes [x] into `ipaSurface` and the last syllable (`engine.ts:1961-1977`) but leaves `ipaUnderlying` ending in ɡ; `applyCrossWordAssimilation` resets `ipaSurface = ipaUnderlying` at `:2161`. Today «Бог мой» survives as ˈbox only because the sonorant branch sets `skipFinalDevoicing` and the syllables are never rewritten. Under step 1 as worded the probe gives «Бог мой» ˈbok, «Бог один» ˈbok, and the corpus line «Как дай вам Бог любимой быть другим.» moves ˈbox → ˈbok. That is the only corpus line that moves (1 of 40), so step 0(b) will report exactly this line, and it is a regression, not the intended change. Already wrong today, out of this row's scope but to report: «Бог» alone → ˈbok and «Бог там» → ˈbok.

Cost if not amended. Gate 4 (web tests, pinned count in the ship script, `ENVIRONMENT.md:541`) goes red on the approval test, step 3 forbids re-approving, and the brief's "all eight gates" line cannot be met.

Add to step 1:

> The «бог» exception (Grayson p. 144, [box]) lives in `ipaSurface` and the syllables, not in `ipaUnderlying` (`engine.ts:1961-1977`), and `:2161` discards it. In the final loop at `:2249`, after `applyFinalDevoicing`, a word whose cleaned Cyrillic is «бог» and whose surface now ends in `k` ends in `x` instead. Pin: «Бог мой» → ˈbox, «Бог один» → ˈbox; the corpus line «Как дай вам Бог любимой» keeps ˈbox and the corpus moves 0 lines. Report, do not change: «Бог» alone and «Бог там» give ˈbok today; what Grayson says of бог before a voiceless consonant is NOT ESTABLISHED.

### 3. «меж» is not a proclitic in Ilya, so the pin «меж нас keeps [ʒ]» cannot pass through the pipeline

Evidence. `cliticData` (`engine.ts:243-287`) has no «меж»; `boundaries.ts:51` and `:58` therefore give it `'soft'`. Probe under step 1 as worded: «меж нас» → ˈmʲɛʃ ˈnɑs, against p. 252. The same happens to every voiced-final preposition outside the clitic list: «сквозь нас» → ˈskvosʲ, «вокруг нас» → ˈruk, «близ Анны» → ˈblʲis, «средь нас» → ˈsrʲetʲ, «из-под Анны» → pʌt (each voiced today). A hand-built `BoundaryWord` test in `notation-edge-cases.test.ts` can make «меж нас» pass by writing `rightBoundary: 'clitic'`, and the app would still sing [mʲɛʃ]: a test that lies.

Cost if not amended. Grayson's own example fails in the app while its pin passes in the suite.

Add to step 1 and step 2:

> Add «меж» to `cliticData` as a proclitic, `canonicalIpa: 'mʲɪʒ'` (pretonic reduction as «без» → `bʲɪz` at `:262`), gloss EN `between/amongst`, FR DRAFT « entre/parmi » (marked for Dann; neither word is in the file's existing French). Every p. 252 pin runs through `processText` with the real dictionary (the pattern of `apps/web/src/lib/approval/ipa-corpus.approval.test.ts:63-99`), or at least a `BoundaryWord` test whose `rightBoundary` is the one `boundaries.ts:58` would give («сад», «меж» without this entry, «друг», «глаз»: `'soft'`; «без», «из», «под», «об»: `'clitic'`). Report, do not change, the other voiced-final prepositions outside the list («вокруг», «сквозь», «близ», «средь», «из-под», «вслед», «вглубь», «промеж») and the lines they devoice; they are Dann's (Questions for Dann, 1).

### 4. Step 1 does not say how the engine learns that the left word is a proclitic or a contraction

Evidence. `BoundaryWord` (`engine.ts:108-116`) declares `rightBoundary`, `cleanWord?`, and an index signature; `'clitic'` is set both for a proclitic on the left and for an enclitic on the right (`boundaries.ts:58`), so the boundary type alone cannot tell «без Анны» from «сад ли». The pipeline does pass `isProclitic`, `isEnclitic`, and `cleanWord` on every word (`pipeline.ts:821-842`), and its `isProclitic` already excludes the «о» interjection and a word promoted from clitic (`:776-783`), which a bare `this.proclitics.has()` would not. Hand-built test words carry none of these.

The brief's own question ("say whether the branch then needs to set anything at all"): for a proclitic, no, `:2249` already skips devoicing at its `'clitic'` boundary (probe: «без Анны» is bʲɪz with or without the branch). For б and ж it must: «если б мог» gives б a `'soft'` right boundary (б is not a proclitic and мог is not an enclitic; probe boundary view), so without the branch the loop devoices it to [p] against p. 252.

Replace the clause "the left word is a proclitic (a preposition) or a particle contraction" with:

> Declare `isProclitic?: boolean` on `BoundaryWord` (`engine.ts:108-116`); the pipeline already supplies it (`pipeline.ts:829`). In the engine: `const clean = (leftWord.cleanWord ?? leftWord.cyrillic).replace(punctuation).toLowerCase(); const isProclitic = leftWord.isProclitic ?? this.proclitics.has(clean); const isContraction = clean === 'б' || clean === 'ж';` (the two vowelless enclitics in `cliticData` with a voiced final; «ль» ends in a sonorant and never devoices). Keep the voicing when `isProclitic || isContraction`. Pin «если б мог» → б stays `b` (Learn already prints /ˈjeslʲi b mok/, `LearnContent.svelte:3900`).

### 5. Step 2's "show each new test failing on the old code" cannot hold for the preposition pins

Evidence. The old code keeps every voiced final before a vowel or sonorant, so «меж нас» keeps [ʒ] and «без Анны» keeps [z] pass today; only the devoicing pins («сад наш», «сад Анны», «сад ваш», «глаз открыт» → ˈɡɫɑs, «друг мой» → ˈdruk) fail first. The two rewritten tests also assert `skipFinalDevoicing` true (`notation-edge-cases.test.ts:490`, `:508`); under step 1 it is false for those words.

Replace with: "Show failing first every pin where Grayson and the old code disagree; mark the preposition and contraction pins as regression guards that pass on both. Drop or flip the `skipFinalDevoicing` assertions at `:490` and `:508`."

### 6. The brief's gloss of boundary #4 needs Grayson's definition and his two missing examples

Evidence. §1 says the examples are the three «сад» lines, «меж нас», and «без Анны»; p. 252 also gives «разлука» and «если б мог» under rule #2, and p. 248 defines boundary #4. §4 says whether ли "counts as Grayson's 'particle contraction'" is NOT ESTABLISHED; what is established is that the contractions are б and ж («если б мог»), and ли is not one.

Replace the §4 enclitic bullet's last sentence with: "Grayson's particle contractions are б and ж (p. 252, «если б мог»); ли, же, бы are full particles. Whether a host word before an enclitic sits at boundary #3 or #4 is NOT ESTABLISHED (Grayson gives no host-before-ли example), so leave `:2249` as it is for «сад ли» → [ˈsɑd lʲi] and report how many corpus lines it touches." Add «разлука» and «если б мог» to §1's list.

### 7. Cites to correct

- `engine.ts:1994-2028` for the engine's own `autoDetectBoundaries`: the method runs `:1998-2037`; its only callers are none (grep this session: definition, plus `boundaries.ts:40` and `pipeline.ts:46`, `:328`, which are the live copy). Batch C's review amendment 1 says the same.
- §2 bullet 1 says the comment "reads the rule as applying to every word": true, and its в cite is p. 250 (`:2182`); the passage is p. 251.
- §4: "the Guide and the blurbs: grep for any sentence that states the old reading". Done this session: `GuideContent.svelte` has no sentence on sonorants and voicing (its one match, `:329`, is the general "applies consonant voicing and devoicing rules"); `LearnContent.svelte:3889` states Grayson's reading; `packages/blurb/src` has none. Code's grep will come back empty; say so in the brief so Code does not go looking for a sentence to change.
- QUEUE row 156 is not in the clone at `e0f4ad9`; the brief says it is a desk number. Fine, but the report's QUEUE cite will be to a row the lane cannot see.

### 8. The cross-site line (`CONTRACT.md` §4): one site missing, one dependency unstated

Evidence. The brief lists `boundaries.ts:37, :50, :58`, the sibling branches, `Pairing.ipa`, Learn, and the enclitic. Missing: `transcribe`'s own final devoicing at `engine.ts:1979` (`applyFinalDevoicing` on every non-clitic word in isolation) and the «бог» branch at `:1961-1977`, which compute the same final consonant a second time and which `:2161` then overwrites; amendment 2 is the consequence. Also unstated: what depended on the sites agreeing. Today they disagree for «бог» (isolation ˈbok, before a sonorant ˈbox) and nothing watched it.

Add to §4: "`engine.ts:1961-1979`: `transcribe` devoices the same final consonant for a word in isolation and writes the «бог» exception; `applyCrossWordAssimilation:2161` overwrites both. The pass at `:2249` must agree with `:1979` for every word whose boundary is hard and with `:1961-1977` for «бог»."

### 9. `Pairing.ipa` and the singer who has already seated a song

Evidence. `apps/web/src/lib/score/pairings.ts:113` and `:124` store `ipa: string` with no engine version; `STATE.md:28-30` carries the debt as pending, not ratified. The brief's handling ("report what a singer sees; change nothing") is right for this row. One line to add so Code's report says something a singer can act on: "Name the surface a singer uses to re-seat (or say NOT ESTABLISHED), since a song seated before this ships keeps [sad naʃ] on Markup with no sign that Lyrics now says [sat naʃ]."

## Questions for Dann

1. Voiced-final prepositions that are not in Ilya's clitic list («вокруг», «сквозь», «близ», «средь», «из-под», «вслед», «вглубь», «промеж»): under rule 2 they are prepositions and keep their voicing before a vowel or sonorant («сквозь нас» [skvozʲ nas]); under step 1 as worded they devoice. Recommendation: a small `prepositions` set in the engine, read by the voicing branch only, so stress and reduction are untouched («вокруг» keeps its own stress); cost, one more list to keep. The alternative, adding them to `cliticData`, makes them unstressed proclitics, which «вокруг» and «сквозь» are not. This is scholarly judgement about which words Grayson means, so it is yours. «меж» alone goes in now (amendment 3) because p. 252 prints it.

Marked French draft, not a question: the «меж» gloss « entre/parmi » (EN `between/amongst`); glossary source, none in the file, so flagged as coined for Ilya.

## What I could not establish

- What Grayson prescribes for a host word before ли or ль («сад ли»): no example found on pp. 248-257; the code keeps [d] via the clitic boundary and the brief leaves it.
- What Grayson prescribes for «бог» before a voiceless consonant or in isolation ([box] or [bok]); p. 144 gives the citation form /box/ only.
- Whether Grayson's "prepositions" in rule 2 includes stressed two-syllable prepositions («вокруг»); hence question 1.
- The effect of batch C's typed # on this row beyond the hard boundary at `:2171`, which this pass already honours; B3's own pins were not re-run here.
- The eight gates were not run; only `test:phonology` and the probe. The gate 1 and gate 4 counts after step 2 are Code's to report.
- The exact QUEUE row 156 text (not in the clone).
