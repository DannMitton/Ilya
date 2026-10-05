# Russian word frequency for Ilya's dictionary: sources, measurements, and a prototype

> **Provenance, added by the desk (Fable), 2026-10-04 21:15.** Dann, 20:22: *"Is this something we can provide to enhance the dictionary? PLease research resources that offer reliable frequency data for common Russian words and let's see if we can extract that into useful data that correpsonds with our diciontary entries. We will build thid if it will help."* The desk spawned a Sonnet subagent at about 20:26; it returned at about 21:10. Cost: 336,050 tokens, 92 tool uses, 46 minutes (the desk had named a worst case of 300,000 and a wait of 15 to 25 minutes; both were exceeded). Saved as returned. **Its claims are its own.** The desk read sections 1 and 2 and checked five bands in `freq-prototype_r1_2026-10-04/prototype.tsv` (мне 8, мни 2, засыпаю 3, зазываю 1, была 7 against бала 4); they are as the memo says. The desk did not re-run its measurements or re-read its licence pages. The raw `prototype.tsv` (21 MB, md5 `9cba46ada24f09074cacfd9530529042`) stays out of the repository; `prototype.tsv.gz` (md5 `5ddfd9a1ed587fba2a6fb5d5a1bd7a3c`) holds the same lines. The desk then used the bands as a tie-breaker in its assembly (`assembly-a-scan-to-a-seated-song_r1_2026-10-04/assemble6.py`): words right went from 148 to 152 of 172 on the Tchaikovsky build song.


From: Sonnet research helper. To: the desk. Date: 2026-10-04. Revision 1.

Files: `/mnt/user-data/outputs/freq-prototype_r1_2026-10-04/` (scripts, prototype TSV, results, evidence). Nothing under `/home/claude/ilya` was changed. No git writes.

## 1. Summary

1. **Recommendation: build it.** Store one small number per form. Build it from three open lists (hermitdave, wordfreq, Google Books Ngrams) plus a count of 19th-century poetry that we make ourselves from Russian Wikisource.
2. **Both of tonight's cases separate widely in every source.** мне 6,960 per million words against мни 0.13 (hermitdave). засыпаю 2.06 against зазываю 0.026. In the prototype: band 8 against 2, and band 3 against 1.
3. **It will get some cases wrong, and the cause is built in.** In all six sources I measured, «была» outranks «бала» by 45 to 470 times. «морской» beats «мирской», «стал» beats «стан». About 23 in 100 tokens of 19th-century poetry are words below one per million in the blended modern figure.
4. **Test on 15,000 tokens of poetry, one letter unknown, same-length dictionary candidates, poet held out.** In the 54% of cases where more than one word fits: most common candidate right 72% of the time (modern lists), 77% (with our poetry count), 60% (the dictionary's own line order), 29% (random).
5. **Use it as a prior, not an override.** When the leader is two or more band steps ahead it is right 96% to 99.6% of the time (35% of contested cases). When the lead is under one step it is right 49% to 66% of the time.
6. **The 1800 to 1917 slice of Google Books did not beat the modern lists** on poetry words (0.836 against 0.841 to 0.845). Our own poetry count did (0.877), from only 1.2 million tokens. Era mattered less than genre.
7. **Size:** a `"q":N` field (0 to 9) adds 4.9 MB raw (+5.1%) and 295 KB gzipped (+5.2%) to the 96.4 MB dictionary. A 25-step version adds 631 KB gzipped.
8. **Licences:** hermitdave and wordfreq are CC BY-SA 4.0 (share-alike on the data file, as kaikki already is). Google Ngrams is CC BY 3.0. The Lyashevskaya and Sharov list is "(c)" with no licence grant. Leipzig is NOT ESTABLISHED, and the evidence I found points both ways.
9. **Surprise:** the dictionary's own line order already tracks commonness (rank correlation 0.43 with hermitdave). In the contested cases it picks right 60% of the time, against 29% at random and 72% to 77% for the real figures.
10. **Cost of the poetry count:** a 2.1 GB stream and about 10 minutes. It reaches only 9% of dictionary forms by themselves, so it works as a sharpener on top of the big lists, not a replacement.

## 2. Sources, sorted by licence

Method: each row was fetched from its own page or file today. "Read" says how much of the document I read. A link in the Link column is the one I fetched.

### 2.1 Usable in an MIT app's data file as is (attribution only)

| Source | Counts | Corpus and size | Licence line (quoted) | Read | Link |
|---|---|---|---|---|---|
| Google Books Ngrams, Russian, version 20200217 | Word forms as printed, per year, case-sensitive, with OCR noise and part-of-speech-tagged duplicates | Google Books scans. 13.1 million 1-gram lines in two files (840 MB and 1.44 GB gzipped). Slice 1800 to 1917 holds 2.6 billion tokens; 1950 to 2019 holds 82.2 billion | "This compilation is licensed under a Creative Commons Attribution 3.0 Unported License." | Page in part (licence sentence, Russian file listing); export page in full | http://storage.googleapis.com/books/ngrams/books/datasetsv3.html |

Format: tab-separated; word, then `year,match_count,volume_count` triples. Files: `http://storage.googleapis.com/books/ngrams/books/20200217/rus/1-00000-of-00002.gz` and `1-00001-of-00002.gz`. Totals: `.../rus/totalcounts-1`.

### 2.2 Usable with share-alike on the data file (CC BY-SA, as kaikki's is)

| Source | Counts | Corpus and size | Licence line (quoted) | Read | Link |
|---|---|---|---|---|---|
| hermitdave FrequencyWords, `ru_full` 2018 | Word forms, lower-cased, as written | OpenSubtitles 2018 Russian subtitles. 154,661,944 tokens; 1,423,050 forms (693,560 seen once) | README: "MIT License for code.<br>CC-by-sa-4.0 for content." | README in full; LICENSE in full (the MIT text); data file measured | https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/ru/ru_full.txt |
| `wordfreq` 3.1.1, Russian "large" list | Word forms as its tokenizer splits them | Blend of Wikipedia, subtitles, news (NewsCrawl 2014, GlobalVoices), Google Books Ngrams 2012, Twitter. 713,447 forms; frequencies rounded to 1 centibel (about 2.3%) | "`wordfreq` is freely redistributable under the Apache license (see `LICENSE.txt`), and it includes data files that may be redistributed under a Creative Commons Attribution-ShareAlike 4.0 license" | PyPI description in part (licence and sources sections, language table); LICENSE.txt first lines only | https://pypi.org/project/wordfreq/3.1.1/ (released 2023-11-21) |
| Poetry count made by the desk from Russian Wikisource | Word forms | 6,485 poems by 194 authors born 1780 to 1850 (foreign authors removed by a name list). 1,200,450 tokens; 117,684 forms | Texts: the one poem page I read in full carries "ЛИЦЕНЗИЯ = PD-old-70". Dump: "all information on Wikimedia projects may be freely shared, copied, remixed, and used for any purpose (including commercial purposes!) in perpetuity." I did not check the tag on each of the 6,485 pages | Poem page in full; dump legal page in part | https://dumps.wikimedia.org/legal.html |
| UD_Russian-Poetry (test set only) | Tokens with hand-corrected lemmas | 19th to 21st century poems from the Russian National Corpus poetry subcorpus. 64,112 tokens in all; 8,619 in the 19th-century documents I used | "The treebank is licensed under the Creative Commons License Attribution-ShareAlike 4.0 International." | README and LICENSE.txt in full; stats.xml counts only | https://github.com/UniversalDependencies/UD_Russian-Poetry |

Formats: hermitdave is `word count` per line. wordfreq ships as `data/large_ru.msgpack.gz` (4.5 MB) in the wheel. Wikisource is a 2,083,497,137-byte bz2 XML dump dated 2026-10-01. UD is CoNLL-U.

Note on hermitdave: the README is silent on the rights in the subtitle text underneath. I report the repo's own statement and nothing more.

### 2.3 Not usable

| Source | Why | Evidence |
|---|---|---|
| Lyashevskaya and Sharov, *Новый частотный словарь* (2009), CSV `freqrnc2011.csv` | Copyright notice with no licence grant. Counts lemmas (52,138 lemma and part-of-speech rows) from the Russian National Corpus, 1950 to 2007, 92 million tokens. Format: UTF-8 tab-separated. | `freqrnc_readme.txt`: "(c) О. Н. Ляшевская, С. А. Шаров, 2009-2011. (c) Национальный корпус русского языка, 2009-2011." and "При использовании ресурса просьба ссылаться на первоисточник". Read in full. Download `http://dict.ruslang.ru/Freq2011.zip`. I measured it as a reference only. |
| Kelly lists (Leeds) | Wiktionary says non-commercial | en.wiktionary page for Russian frequency lists: "(CC BY-ND-NC-SA 2.0)", and a footnote that it is "incompatible with wiktionary". Second-hand. Leeds host returned 503. |
| mc.hertzbeat.ru news list (Baksalyar, GitHub) | No licence stated | README read in full (about 840k words, news 2014 to 2016). `LICENSE` path returned 404. |

### 2.4 NOT ESTABLISHED (do not use until settled)

| Source | What I found |
|---|---|
| Leipzig Corpora Collection, Russian lists (I measured `rus_news_2020_1M`: 17,236,722 tokens, 538,765 forms) | Leipzig's own pages sit behind a proof-of-work bot wall (Anubis). I did not try to pass it. The tarball has no licence file (listing read in full). Two third-party statements conflict. Wiktionary's Russian frequency page says "(CC BY-4.0)". The re3data record for the Leipzig-linked repository lists "CC" at `creativecommons.org/licenses/by-nc/4.0/` and a second entry "Copyrights" pointing to `wortschatz-leipzig.de/en/usage`. A non-commercial term would not fit an MIT data file. Read the usage page by hand before any use. |
| Lyashevskaya and Sharov lemmas as re-posted on Wiktionary (20,000 lemmas, ranks only) | Posted under Wiktionary's CC BY-SA. Whether the poster had the right to licence it is NOT ESTABLISHED. Intro read only. |
| Serge Sharoff's older lemma list; OpenCorpora | Not reachable. `ruscorpora.ru/corpora-freq.html` returned 404, `artint.ru` returned 522, `opencorpora.org` returned 521 twice, and the Internet Archive refused with 403 (I stopped there). |
| Leeds Internet Corpus lists | Host returned 503. Wiktionary says "(CC BY-2.5)"; wordfreq's README names it among its Creative Commons sources. Neither is the source's own word. |
| OpenRussian dictionary data (Badestrand/russian-dictionary) | README and LICENSE: CC BY-SA 4.0 (README read in full, LICENSE heading only). Whether it carries a frequency field: NOT ESTABLISHED. The CSV path I tried returned 404 and the database sits on togetherdb. |
| RNC poetry subcorpus; `perechen/russian.poetry.length` | The second is a metadata CSV (README, 162 bytes, read in full) with no licence stated. The first is the source of the UD treebank and is not offered as open data in anything I read. |

Found only as search-result titles and not opened: `tonyamart/rus_elegies`, `madhav1k/OpenCorpus`, the Kaggle OpenCorpora page, several Hugging Face datasets.

## 3. Measurements

Definitions. Own form: the string, lower-cased, found in the source. For Ngrams I first apply Ilya's own pre-reform letter map (the one in `packages/dictionary/src/pre-reform-normalizer.ts`, read), then add the desk's endings rule (-аго to -ого, -яго to -его, -ыя to -ые, -ія to -ие, 1800 to 1917 only). Where the form has ё and the source lacks it, I fall back to е. Lemma-lent: the lemma's figure is the sum of the own-form figures of every form of that lemma in Ilya's dictionary (field `l`), lent to each form. "Hybrid": the form's own figure if it has one, else the lemma's mean per form.

Dictionary: 943,106 forms, 85,182 lemmas, 5,454 forms with pre-reform letters, 43,497 with ё.

### 3.1 (a) and (b): coverage of the 943,106 forms

| Source | (a) own form | (b) via lemma | Nouns (a / b) | Verbs (a / b) |
|---|---|---|---|---|
| hermitdave 2018 | 368,266 (39.0%) | 663,780 (70.4%) | 48% / 81% | 31% / 62% |
| wordfreq | 348,556 (37.0%) | 622,950 (66.1%) | 49% / 81% | 25% / 54% |
| Ngram 1800 to 1917 | 538,469 (57.1%) | 772,854 (81.9%) | 60% / 82% | 52% / 80% |
| Ngram 1950 to 2019 (reference) | 665,162 (70.5%) | 835,207 (88.6%) | 76% / 90% | 64% / 87% |
| Poetry count (Wikisource) | 87,089 (9.2%) | 292,972 (31.1%) | 12% / 34% | 7% / 28% |
| Leipzig news 2020 (reference, licence open) | 225,110 (23.9%) | 562,071 (59.6%) | 33% / 73% | 15% / 48% |
| Lyashevskaya and Sharov (reference, not usable) | lemma list only | 449,280 (47.6%) | n/a / 64% | n/a / 34% |

The per-form figures look low because most of the 943,106 forms are rare inflected verb forms. Counted over real tokens the picture is different (3.2).

### 3.2 (c): coverage of real poetry

**«Средь шумного бала»** (A. K. Tolstoy). Text from ru.wikisource.org, page id 9610, revision 4805021 of 2023-04-03, fetched today through the MediaWiki API (copy in `evidence/`). 94 tokens, 71 distinct forms, all 71 are exact forms in Ilya's dictionary.

| Source | Tokens found as own form | Distinct forms found | Via lemma |
|---|---|---|---|
| hermitdave, wordfreq, Ngram 1800 to 1917, Ngram 1950 to 2019, poetry count | 94 / 94 each | 71 / 71 each | 94 / 94 |
| Leipzig news 2020 | 90 / 94 | 68 / 71 (missing: очи, дивно, свирели) | 94 / 94 |
| Lyashevskaya and Sharov | lemma list | n/a | 94 / 94 |

The poem itself was left out of the poetry count (a page that quotes its first line is in the count).

**A larger real sample.** 8,619 word tokens from the 19th-century documents of UD_Russian-Poetry: 93.9% are exact forms in Ilya's dictionary. Of those, own-form coverage is hermitdave 98.6%, wordfreq 98.3%, Ngram 1800 to 1917 99.9%, poetry count 96.9%.

**Side finding, outside the question.** In the Wikisource count, 93.9% of tokens but only 72.4% of distinct forms are in the dictionary. The commonest forms it lacks include вкруг, ужель, ужели, молчанье, вдохновенья, желанья, страданья, вослед. Others are е for ё spellings (ждет, живет, огнем).

### 3.3 (d): the test pairs

Parts per million, own form, right word first. The last column is the prototype band (0 to 9).

| Pair (right / wrong) | hermitdave | wordfreq | Ngram 1800 to 1917 | Poetry count | Prototype band | Right word wins? |
|---|---|---|---|---|---|---|
| мне / мни | 6,960 / 0.13 | 2,140 / 0.33 | 364 / 0.87 | 5,140 / 2.5 | 8 / 2 | Yes, every source |
| засыпаю / зазываю | 2.06 / 0.026 | 1.07 / not found | 0.11 / 0.003 | 3.33 / not found | 3 / 1 | Yes, every source |
| бала / была | 5.4 / 1,540 | 3.6 / 1,320 | 2.2 / 927 | 15.8 / 704 | 4 / 7 | **No, every source** |
| мирской / морской | 0.34 / 16.1 | 1.1 / 38.9 | 6.3 / 25.7 | 14.2 / 35 | 4 / 5 | **No** (bands 4 and 5) |
| речь / печь | 96 / 5.5 | 117 / 9.3 | 44 / 7.5 | 196 / 21 | 6 / 4 | Yes |
| ночи / ноги | 208 / 98 | 120 / 96 | 30 / 34 | 476 / 118 | 6 / 5 | Yes, but Ngram alone prefers ноги |

Pairs 3 to 6 are mine, taken from the poem by changing one letter to another real word in the dictionary. The pair мне / мни is the one the brief gave. The Ngram 1800 to 1917 slice gives мни 2,283 occurrences in all (0.87 per million). The imperative is rare, so I report that figure and give no reason for it.

### 3.4 Does the figure pick the right word? A simulation

Assumptions, stated plainly. I did not read Ilya's candidate generator. As a stand-in: take a poetry word, blank one letter, and let the candidates be every dictionary form of the same length that matches. Pick the most common candidate. A hit is the true word. Ties count as a share. Words are exact dictionary forms of 3 or more letters.

Test sets: (A) the 71 forms of the Tolstoy poem; (B) the UD 19th-century sample; (C) a 15,000-token sample from the Wikisource poems of 28 poets with 30 or more poems each, where the count used for each token **leaves out that token's poet entirely**. The Wikisource test is the strict one.

46.0% of blanked positions have only one candidate and are trivially right. The table shows both the overall figure and the figure for the contested cases only (derived as (overall minus 0.460) divided by 0.540).

| Rule for choosing | Overall (C) | Contested only (C) |
|---|---|---|
| Random candidate | 0.615 | 0.29 |
| Dictionary line order (earlier line wins; no frequency data) | 0.783 | 0.60 |
| Ngram 1800 to 1917, own form | 0.836 | 0.70 |
| hermitdave, own form | 0.842 | 0.71 |
| wordfreq, own form | 0.845 | 0.71 |
| Blend of the three (mean of log figures, half-count floors) | 0.849 | 0.72 |
| Lemma-lent figure alone (Ngram) | 0.794 | 0.62 |
| Our poetry count alone, poet held out | 0.877 | 0.77 |
| **Blend of the three, 1 part, plus poetry count, 2 parts** | **0.876** | **0.77** |
| The same, stored as a 0 to 9 band | 0.861 | 0.74 |
| The same, stored as 25 steps | 0.874 | 0.77 |

Cross-checks. On set B the blend of three scores 0.851, hermitdave 0.848, Ngram 1800 to 1917 0.836, line order 0.783, random 0.619. On set A (71 forms, small) hermitdave 0.868, blend 0.851, line order 0.812, random 0.598. The lemma-lent figure used alone is worse than the own form in all three sets, so lend it only where the form has no figure of its own (the hybrid).

Resolution: raw 0.876; 6 steps 0.851; 9 steps 0.861; 12 steps 0.868; 18 steps 0.872; 23 steps 0.874; 35 steps 0.876.

### 3.5 How much to trust the leader (set C, final recipe)

| Leader's lead over the runner-up | Share of contested cases | Leader is right |
|---|---|---|
| Under half a band step | 25.8% | 49% |
| Half to one step | 18.1% | 66% |
| One to two steps | 21.0% | 85% |
| Two to three steps | 13.5% | 96% |
| Three or more steps | 21.6% | 99.6% |

One 0 to 9 step is a factor of about 4.6 in the blended figure. These rates hold for this simulation. They are not rates for Ilya's real candidates.

### 3.6 Where it misleads

By the true word's blended level (level 1 to 3 means below one per million), 23.4% of tokens in set B and 23.3% in set C sit at levels 1 to 3. For those, the modern blend is no better than line order: set B level 2, 0.797 against 0.809; set C level 2, 0.807 against 0.822. Our poetry count lifts level 2 to 3 in set C to 0.852 and 0.867. Above level 5 the blend wins clearly (set C level 7: 0.959 against 0.835).

## 4. Storage proposal

**One integer per form, field `q`.** Built from the recipe below. Omit the field when no source knows the form or its lemma (130,741 forms, 13.9%). A missing `q` means "no information", not "rare".

Recipe (script `build_prototype.py`):

1. For hermitdave, wordfreq, and Ngram 1800 to 1917, take the hybrid figure per million words, floor it at half a count of that corpus, and take log10.
2. Average the three. Take log10 of the form's own poetry-count figure (floor at half a count) and weigh it twice.
3. `score = (blend + 2 × poetry) / 3`.
4. Band 0 to 9: `clip(floor(1.5 × (score + 1.2)) + 1, 1, 9)`. Each step up is about 4.6 times as common. The finer scale uses 4 in place of 1.5: 25 steps, each about 1.8 times.

Band counts (0 to 9): 130,741 / 651,784 / 126,892 / 24,159 / 7,375 / 1,689 / 364 / 81 / 18 / 3. Most forms are rare, as in any language, so the upper bands hold few forms.

Coverage of the 943,106 forms: 812,365 (86.1%). Own-form figure from at least one source: 590,403. Lemma-lent only: 221,962. By part of speech: adjectives 96.2%, names 91.5%, nouns 89.3%, verbs 82.7%, other 37.8%.

The `source` column in the TSV: letters for the sources that had the form itself (h hermitdave, w wordfreq, n Ngram, p poetry count). If none had it, `l` then the letters of the sources whose lemma had data.

### Sizes (built in scratch; dictionary untouched)

| Design | Raw bytes | Added raw | gzip -9 | Added gzipped |
|---|---|---|---|---|
| Dictionary today (both files) | 96,381,998 | n/a | 5,626,268 | n/a |
| `"q":N` field, band 0 to 9, omitted when 0 | 101,256,190 | +4,874,192 (+5.1%) | 5,920,969 | +294,701 (+5.2%) |
| `"q":N` field, 25 steps | 101,261,713 | +4,879,715 (+5.1%) | 6,257,275 | +631,007 (+11.2%) |
| Side file, one byte per form, band 0 to 9 | 943,106 | n/a | 96,232 | n/a |
| Side file, one byte per form, 25 steps | 943,106 | n/a | 205,973 | n/a |
| Side file, two bands per byte | 471,553 | n/a | 93,260 | n/a |
| `prototype.tsv` (`form`, `band`, `source`; 812,365 rows) | 21,352,401 | n/a | 3,231,617 | n/a |

Brotli was not measured (no tool installed). A side file ties each byte to line position and breaks if the dictionary is rebuilt in another order, so the field is safer. Per-lemma storage (85,182 lemmas) is smaller still but loses accuracy: lemma figures alone scored 0.79 against 0.84 to 0.85 for own forms.

Two cautions on use. The 5,454 old-spelling forms in the dictionary (such as мнѣ) take Ngram values from their modernized spelling; their bands mean little, and Ilya modernizes before lookup anyway. And ё is folded to е where the source lacks ё, which merges все and всё in the Ngram figures.

## 5. What it would fix and what it would not

**It would fix:** the two cases from tonight. Any pair where one word is far more common than the other (two band steps or more), which is 35% of contested cases at 96% to 99.6% accuracy in the simulation. It also gives Ilya a number for later choices (homograph ordering, which candidate to show first).

**It would not fix:**

- Rare poetic or obsolete words against common modern neighbours (бала / была, мирской / морской, стан / стал). No modern list can. Our poetry count narrows the gap but does not close it.
- Near ties. Under one band step the leader is right about half the time.
- Words in none of the sources. Names fare best (91.5% covered); the "other" group (mostly affixes and phrases) fares worst.
- The old-ending problem. The header of `packages/dictionary/src/pre-reform-normalizer.ts` (line 86, "SCOPE, and it is deliberately partial", and line 96, "They are NOT built here") says the ending rules are not built. The Ngram 1800 to 1917 figures benefit from my endings rule, but Ilya's lookups do not. The same header (line 46) says Ilya modernizes at intake.

**Is a 19th-century poetry count worth it beside a modern list?** On these measurements yes, in a modest way. It added 2.7 points overall (0.849 to 0.876) and about 5 points in the contested cases (0.72 to 0.77), with poets held out. It cost one script and about 10 minutes of streaming. It reaches only 9% of forms directly, so keep it as one ingredient. The Ngram 1800 to 1917 slice, which matches the era but not the genre, did not improve on the modern lists. The count grows with more Wikisource poems, and it lets us measure the dictionary's gaps (3.2).

## 6. What I could not establish

- Leipzig's licence (2.4). Sharoff's older list, OpenCorpora, Leeds, Kelly at source: unreachable or refused.
- Whether OpenRussian's data carries a frequency field.
- Whether each of the 6,485 Wikisource pages carries a public-domain tag. I read one in full.
- How Ilya's real candidate generator behaves. The simulation stands in for it and its rates should not be quoted as Ilya's.
- Why the dictionary's line order tracks commonness (rank correlation 0.43 with hermitdave over 368,266 forms). I did not trace the build. The first lines are common words (собака, большой, палец, кошка) and the last are rare terms, but I do not know the rule.
- Why Ngram gives мни 2,283 counts in 1800 to 1917.
- The share of Ngram counts that are OCR noise.
- wordfreq's maintenance status. The PyPI listing shows 3.1.1 as the latest release, dated 2023-11-21. I did not open the GitHub page (the session cannot reach the GitHub API).

Held-out material: I opened no file whose name contains the held-out strings. As a precaution I left out of the Wikisource count, and out of the UD test set, poems by Golenishchev-Kutuzov and Pleshcheyev, my guess at the poets of the held-out songs (the brief gave file names only).

Wikimedia's MediaWiki API answered a burst of seven requests with a "too many requests" notice. I stopped using the API for anything but the one poem page and took the dump instead.

## 7. Documents read

| Document | Read |
|---|---|
| hermitdave README, LICENSE | In full |
| dict.ruslang.ru/freq.php, `freqrnc_readme.txt` | In full |
| `freq.pdf` (introduction, 10 pages) | In part: first 60 lines and a search for licence words |
| `freq_faq.html` | In part: search for licence and copyright words |
| wordfreq PyPI description | In part: licence, sources, and language-table sections |
| Google Books Ngram datasets page (v3) | In part: licence sentence and Russian listing |
| Ngram Russian 1-gram export page | In full |
| Leipzig download and usage pages | Not read (bot wall) |
| re3data record for the repository | In part: licence fields |
| Wiktionary Russian frequency page | Main text in full |
| Wiktionary Mixed web and RNC appendix pages | Introductions only |
| UD_Russian-Poetry README, LICENSE.txt | In full |
| Badestrand README | In full; LICENSE heading only |
| Baksalyar README | In full |
| Wikimedia dumps legal page | In part: opening paragraph |
| Wikisource poem page (via API) | In full |
| Search results (OpenCorpus, rus_elegies, Kaggle, Hugging Face) | Titles and links only |

## 8. How to repeat

The full sequence with download lines is in `scripts/reproduce.sh`. Edit `BASE` in `scripts/common.py` first. The long steps:

```
cd /tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq
python3 scripts/make_targets.py
bash scripts/run_ngrams.sh
python3 scripts/merge_ngrams.py
bash scripts/run_wikisource.sh
./venv/bin/python scripts/build_sources.py
python3 scripts/build_poetry.py
python3 scripts/measure.py > work/measure_out.txt
python3 scripts/coverage_tokens.py
python3 scripts/measure_quant.py
python3 scripts/measure_margin.py
python3 scripts/build_prototype.py
```

Timings here: Ngram stream about 1 minute; Wikisource stream about 10 minutes; `measure.py` about 5 minutes; the rest under a minute each. Raw files over 20 MB and their md5 sums are listed in `raw-md5.txt`. The "latest" Wikisource dump moves; fetch a dated one to repeat exactly.

Results from this run: `results/measure_out.txt` (all tables), `results.json`, `sizes.json`, `measure_quant_out.txt`, `measure_margin_out.txt`, `coverage_tokens_out.txt`. Licence evidence: `evidence/`.
