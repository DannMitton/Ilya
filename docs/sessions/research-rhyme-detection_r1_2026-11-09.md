# Research: detecting -кий / -кой rhymes in Russian verse (r1, 2026-11-09)

Method: web reading only, no code written, no repository touched. Every link below was opened this session unless marked. Marks: NOT ESTABLISHED means I could not verify it.

## 1. Existing code and data

| Item | Language, licence | What it does | Input | Browser or TS port |
|---|---|---|---|---|
| Russian Poetry Scansion Tool (RPST), https://github.com/Koziev/RussianPoetryScansionTool | Python, MIT. 66 commits. Last commit date NOT ESTABLISHED (not shown). | End-rhyme detection on clausulas (stressed syllable at line end, plus an optional unstressed one-syllable word after the last ictus). Matches by sound, not spelling. Detects slant rhymes (scoring method not described on the page). Outputs a scheme string (`-` for unrhymed) and a rhyme graph of forward offsets. | Lines of text. Needs a model and pronunciation dictionary archive (hosted on Google Drive, size NOT ESTABLISHED) plus a separate Hugging Face "accentuator" stress model. | Not for browser as shipped. Algorithm could be ported, but the matching rules are not described on the page (the paper arXiv:2502.20931 does not describe them either, see below). Source files not opened (GitHub tree page blocked by robots). |
| rupo (IlyaGusev), https://github.com/IlyaGusev/rupo | Python 3.8 only, Apache-2.0. 147 commits, 178 stars. Last commit date NOT ESTABLISHED. PyPI releases seen: 0.1 (2017-03-18), 0.2.8 (2019-06-21), https://pypi.org/project/rupo/0.1/ | README lists `engine.is_rhyme`, stress prediction, metre classification, syllables, generation. | Words or lines; needs downloaded models and dictionaries (`download.sh`). | Heavy models, ageing; not suited to browser. I could not open the rhyme source file (fetch failed), so how `is_rhyme` works is NOT ESTABLISHED. |
| RIFMA dataset, https://github.com/Koziev/Rifma | MIT. | Poem fragments with stress marks (U+0301 primary, U+0302 secondary) and a rhyme scheme string (`-` for unrhymed lines; e.g. `A--A`, `AABB`). File `rifma_dataset.json`. README says 5,121 samples; the paper says about 3,600 fragments. The two disagree and I did not reconcile them. | n/a | Usable as test data (see section 5). Sources of the poems NOT ESTABLISHED (README does not name them). |
| rusrime, https://github.com/esbudylin/rusrime | Python, MIT. 36 commits, 0 stars. | Command-line scraper that searches the Russian National Corpus for rhymes to a word, using the corpus's own rhyme formulas. Skips irregular and blended rhymes and irregular stanzas. | A word; scrapes the live RNC site with Selenium. | Not a detector and not portable. Shows that RNC rhyme data is reachable only through the web interface. |
| rhymetagger, https://www.github.com/versotym/rhymetagger | Licence not stated on the page. 46 commits. | Statistical, collocation-driven rhyme recognition; pre-trained `ru` model built from about 45k poems. The page and its description disagree about which languages are covered. | Needs transcribed line endings (input format NOT ESTABLISHED, not read). | Statistical; wrong fit for one narrow, known pair. Not examined further. |
| rifmator_engine, https://pypi.org/project/rifmator-engine | Python, licence UNKNOWN, single release 2016-06-22. | Finds rhymes for a given word from a dictionary. | A word. | Abandoned; not a scheme detector. |
| Adams and Birnbaum, "Perspectives on Computer Programming for the Humanities" (1996), https://www.pitt.edu/~djbpitt/rhyme/ach.html | C (historical), licence NOT ESTABLISHED. | Four modules: STRESS (cut from last stressed vowel to line end, keep the preceding consonant for open masculine rhymes), ORTH (spelling to approximate phonetics: palatalization, voicing, softness assimilation, vowel reduction), WEIGHT (compare lines within a stanza; perfect if identical, imperfect types as bit flags), REPORT (capital letters for perfect, lowercase for imperfect). | Text with manually inserted stress tags. | The closest published precedent to the rule-based method. Code not published on that page. Same group's later XSLT rhyme stylesheets: https://akhmatova.obdurodon.org/rhyme.html (derives rhyme from a phonetics tier, compares every line with every other, authors say manual checking is still needed). |

Searches also surfaced npm packages `rhymer-js` and `rhyme-detector` (https://www.npmjs.com/package/rhymer-js, https://www.npmjs.com/package/rhyme-detector). I did not open them; whether either supports Russian is NOT ESTABLISHED. I found no JavaScript or TypeScript port of a Russian rhyme detector. That absence is based on two web searches only.

RPST paper: Koziev, arXiv 2502.20931, https://arxiv.org/abs/2502.20931v1. The HTML version gives no formal definition of Russian rhyme and no algorithm for scheme detection, and reports no accuracy figures for rhyme detection. Both RPST and RIFMA are MIT per the paper; the paper text itself is CC BY-NC-SA 4.0.

## 2. The academic definition and the computational method

- Standard definition: exact rhyme is sound identity from the last stressed vowel to the end of the line. Rich rhyme adds the preceding consonant or more. Source opened: https://www.krugosvet.ru/enc/kultura_i_obrazovanie/literatura/RIFMA.html (exact: волны : полны; rich: повеса : Зевеса; approximate and assonant types; masculine, feminine, dactylic by stress position).
- Gasparov: the page I opened (Outline of the History of European Verse, 2003 edition, https://medieval.hse.ru/data/2019/02/18/1191535492/2-%D0%93%D0%B0%D1%81%D0%BF%D0%B0%D1%80%D0%BE%D0%B2.pdf) defines full rhyme as consonance of the last stressed vowel and all following sounds, and assonance as consonance of the last stressed vowels. It is on Romance syllabics; the term clausula does not appear on that page. Gasparov on Russian rhyme specifically: NOT ESTABLISHED.
- Zhirmunsky: the document I opened is an unrelated 1970 article on Turkic verse. It states the conventional European view (rhyme from the last stressed vowel) but does not adopt it and does not mention -ий/-ой. His book on rhyme (Рифма, её история и теория): NOT ESTABLISHED, not opened.
- Russian National Corpus poetic subcorpus: the corpus has text-level parameters for rhyme pattern (рифмовка), clausula, and a metre-length-clausula formula (e.g. Я4мж), and marks a "rhyme zone" (from the word entering the stressed constant to line end), which supports searching by rhyme-position words. Source: https://ruscorpora.ru/media/publications/7991162618294f5e692624fa4a9de6c3.pdf (OCR was garbled in places). The article gives no accuracy figures for rhyme annotation, and no per-pair rhyme tag is described.
- Is a rule-based check the standard method? In every system I could read (Adams and Birnbaum, the Birnbaum XSLT, RPST's description), yes: take the line ending from the last stressed vowel, normalize to sounds, compare within a bounded window. RPST looks ahead two lines and treats stanzas independently. Statistical alternatives exist (rhymetagger). I read no survey that states "this is the standard"; that conclusion is my summary of the sources above.

## 3. Datasets that mark rhymes

- RIFMA (above): scheme per fragment, stress marked. Best candidate.
- RNC poetic subcorpus: has rhyme formula and clausula fields, but access I could establish is the web search interface only, and rusrime scrapes it. Bulk download: NOT ESTABLISHED.
- Birnbaum's Akhmatova and Pushkin pages: derived by stylesheet, not human-verified.
- None of these is annotated for the specific -кий : -кой case. A test set for it would have to be built by hand (see section 5).

## 4. Analysis for Ilya's narrow case

Orthographic point (my reasoning, not from a source): in высокий : глубокой both words are stressed on the penult (вы-СО-кий, глу-БО-кой), so the clausula is stressed о + к + unstressed ий / ой. The final vowels differ in spelling and in canonical pronunciation, which is why the rhyme is a convention-sensitive case. I did not find a second source for Grayson's reading rule or for the Pushkin example; both come from the brief. NOT ESTABLISHED independently.

### Recommended approach: a targeted check, not a general rhyme detector

Do not port RPST or rupo. They need heavy models, the shared rules are not published in the pages I read, and Ilya already has stress and IPA. Build a small rule-based matcher on Ilya's own data.

Algorithm in prose:
1. Segment. Split on line breaks. If the text has no line breaks, do not guess a scheme; see failure cases.
2. Candidate trigger. Take the last word of each line, strip punctuation, normalize ё and case. A line is a candidate only if that word ends in -кий, -гий, or -хий and Ilya's dictionary gives the stress as not on the final syllable (the ending is unstressed). Adjectives stressed on the ending (e.g. words ending stressed -ий) are excluded by the same stress check.
3. Partner search. Within the same stanza (stanza = block between blank lines; if no blank lines, a window of the next 3 lines, with a window of 4 for ABBA-type enclosure) and optionally one line backward, look at line-final words ending in -кой, -гой, or -хой with the stress not on the final syllable.
4. Comparison rule. Compare the stressed syllable onward. Require: same stressed vowel (after normalizing stress-driven phonetics, so о matches о); same consonant after it (к with к, г with г, х with х; the voicing at line end is not an issue because the consonant is intervocalic before the final vowel); and the remaining letters being exactly ий versus ой. Optionally require the same number of syllables after the stress (both feminine). Match means: the pair satisfies all of these.
5. Anchoring. For an ABAB or AABB scheme the partner must also be consistent with the other rhyme pair in the stanza. A cheap sanity check: the partner line's own predecessor or successor pair should also rhyme by the same clausula rule (exact stressed-vowel-onward match). This reduces false positives when two lines merely both end in -кой/-кий by accident.
6. Output. For each -кий line, return partner line number and confidence (found, ambiguous with multiple partners, not found). Ilya applies [kʌj] only when found.
7. Reverse check (optional): if a -кой line has a -кий partner, the same decision applies in the other direction, but Grayson's rule only concerns the -кий side.

Stress and the unstressed condition: both come from the existing dictionary and engine. If the dictionary has no stress for a word, or two stress options (homographs), treat the condition as unknown and return not found.

## 5. Robustness

False positives:
- Two lines ending in -кий and -кой by coincidence, not as a rhyme pair (both lines in a long, unrhymed passage, or lines from different stanzas flattened together).
- An unrhymed -кой ending adjacent to a -кий ending where the poem's real scheme pairs each with a different word (e.g. ABAB with an unrelated pair between). Step 5 mitigates but does not remove it.
- A refrain repeating the same -кий word: matches itself, not a -кой partner. Must exclude identical words.

False negatives:
- No line breaks or lost breaks: no reliable line-final word. Scan misreads (merged or split lines, hyphenation at line ends, OCR of ё, soft sign, й) break the ending test.
- Unknown or wrong stress in the dictionary: the unstressed condition fails and the pair is dropped.
- Partner more than a window away: refrains, long stanzas, or rhyme across stanzas (RPST itself misses these, per its README).
- Inexact rhymes where the stressed vowels differ or the partner is not an -ой ending: out of scope by design.
- Enjambment: rhyme is still on the line-final word, so this mostly does not hurt, but punctuation may hide the line end.
- Dactylic or masculine lines: out of scope; the ending test excludes them.
- Stanza forms: AABB is easy (adjacent), ABAB needs a window of at least 2 lines, ABBA needs 3. Window sizes above are my choice, not from a source; RPST uses 2 lines forward.

Mitigation: make the failure mode safe. If a pair is not found with confidence, keep the default reading. The cost of a miss is a diction nuance not applied; the cost of a false positive is a wrong reading displayed. Prefer missing to over-applying.

## 6. Viability

Could Code build and test it in about half a day in TypeScript? Yes for the narrow matcher (a few functions on top of the existing stress dictionary and engine). Test data: RIFMA gives stress-marked fragments and schemes, usable to check the scheme-aligned parts; the narrow case itself needs a small hand-built set. Suggested hand set: a dozen or so stanzas from public-domain Russian poems that contain -кий : -кой pairs, found by grepping RIFMA's texts for line-ending -кий/-гий/-хий and -кой/-гой/-хой, then verified by Dann. How many such pairs RIFMA contains: NOT ESTABLISHED (I did not download or search the file). Half a day assumes the dictionary lookup API already exists and RIFMA parses as plain JSON; I did not check Ilya's code.

## 7. Risks and gaps

1. Grayson's rule and the Pushkin example are not independently verified here; the search for a second source on -кий : -кой rhyme convention returned nothing I could confirm. The rule's exact conditions (is it required that both words be unstressed, or only the -кий?) rest on the brief.
2. Input quality: lyrics without line breaks and scan misreads make the line-final test unreliable; scheme detection cannot be done on unsegmented text, and I found no source that does it.
3. Dictionary stress gaps and homographs silently disable the match.
4. Gaps in my reading: rupo's and RPST's matching source code not read (fetch blocked or failed); last-commit dates of all repos not shown; Gasparov and Zhirmunsky's Russian-rhyme works not opened; RNC bulk data access, rhymetagger's licence and input format, and the two npm packages not checked; RIFMA's count discrepancy (5,121 versus about 3,600) not reconciled; RIFMA's poem sources unknown, so its licence status for the underlying texts is NOT ESTABLISHED.
