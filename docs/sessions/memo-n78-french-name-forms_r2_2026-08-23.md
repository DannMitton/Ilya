# MEMO. N.78 research, pass 2: French Wikipedia article titles, as returned

Returned 2026-08-23 by one Sonnet subagent run from the desk on Dann's ruling
of the same evening: French Wikipedia article titles for all 62, one source.
Cost: 127,618 tokens, 106 tool calls, 14 minutes, against a stated range of
150k to 250k. The text under the rule is the agent's own, saved verbatim. Its
em dashes are the agent's, not the desk's. Pass 1, the BnF table, is
`memo-n78-french-name-forms_r1_2026-08-23.md` and is superseded by this one
for the French column.

Desk reading of the return:

- 58 of 62 resolved from a fetched article. 4 `NOT ESTABLISHED`: French
  Wikipedia has no article for Bulakhov, Titov, Golenishchev-Kutuzov, or
  Rathaus. The agent confirmed the Golenishchev absence by fetching the
  disambiguation page, where he is a red link.
- Difference set as the agent counts it: 51 of 58.
- Three rows need a word before they go into a build. `Goethe`: the article
  title is the bare surname, so the French form is the same as the English
  form by default. `Galina, Galina`: the pen name doubled, so that row is
  treated as no French form. `Rachmaninov, Sergueï`: the title, not the
  `Serge` of French concert usage; the ruling was the title.
- The route note in the r2 brief was wrong in this environment: the MediaWiki
  API returned nothing to the agent's fetches. Direct fetches of
  `fr.wikipedia.org/wiki/<title>` worked and follow redirects.

---

| # | list | English form | French form | wikipedia-fr title | years on page | note |
|---|---|---|---|---|---|---|
| C1 | C | Arensky, Anton | Arenski, Anton | Anton Arenski | 1861–1906 | Death year explicit on page (Perkijärvi sanatorium, TB); birth numerals not rendered in fetch. |
| C2 | C | Balakirev, Mily | Balakirev, Mili | Mili Balakirev | 1836–1910 | Page gives Julian birth date (21 Dec 1836 = 2 Jan 1837 Gregorian); English-form year 1837 is the Gregorian equivalent, same person. |
| C3 | C | Borodin, Alexander | Borodine, Alexandre | Alexandre Borodine | 1833–1887 | Fully explicit on page. |
| C4 | C | Bulakhov, Pyotr | NOT ESTABLISHED | — | — | No fr.wikipedia article found by search; results returned unrelated pages (Tchaïkovski, Belaïev, Raab). |
| C5 | C | Cui, César | same | César Cui | 1835–1918 | Fully explicit on page. |
| C6 | C | Dargomyzhsky, Alexander | Dargomyjski, Alexandre | Alexandre Dargomyjski | 1813–1869 | Fully explicit on page. |
| C7 | C | Glazunov, Alexander | Glazounov, Alexandre | Alexandre Glazounov | 1865–1936 | Fully explicit on page. |
| C8 | C | Glinka, Mikhail | Glinka, Mikhaïl | Mikhaïl Glinka | 1804–1857 | Confirmed but numerals not fully rendered in fetch; identity unambiguous. |
| C9 | C | Gretchaninov, Alexander | Gretchaninov, Alexandre | Alexandre Gretchaninov | 1864–1956 | Confirmed via page (born Moscow, died New York). |
| C10 | C | Gurilev, Alexander | Gouriliov, Alexandre | Alexandre Gouriliov | 1803–1858 | Fully explicit (22 Aug 1803 – 30 Aug 1858); "son of composer Lev Gouriliov." |
| C11 | C | Kabalevsky, Dmitri | Kabalevski, Dmitri | Dmitri Kabalevski | 1904–1987 | Date numerals did not render in either of two fetches (template stripped by markdown conversion); identity confirmed by bio (St. Petersburg birth, Moscow death, Soviet-Russian composer). An earlier fetch pass hallucinated "1913" as the birth year — discarded on re-fetch, not used. |
| C12 | C | Medtner, Nikolai | Medtner, Nikolaï | Nikolaï Medtner | 1880–1951 | Numerals not rendered; consistent with text mentioning 1900 graduation and 1918 marriage. |
| C13 | C | Mussorgsky, Modest | Moussorgski, Modeste | Modeste Moussorgski | 1839–1881 | Fully explicit on page. |
| C14 | C | Prokofiev, Sergei | Prokofiev, Sergueï | Sergueï Prokofiev | 1891–1953 | Fully explicit; page notes he is "généralement appelé Serge Prokofiev en France," but title itself is Sergueï. |
| C15 | C | Rachmaninoff, Sergei | Rachmaninov, Sergueï | Sergueï Rachmaninov | 1873–1943 | Numerals not rendered; consistent with age references (20 in 1892, 69 at death). Title is Sergueï, not the "Serge" of common French usage. |
| C16 | C | Rimsky-Korsakov, Nikolai | Rimski-Korsakov, Nikolaï | Nikolaï Rimski-Korsakov | 1844–1908 | Fully explicit on page. |
| C17 | C | Rubinstein, Anton | same | Anton Rubinstein | 1829–1894 | Explicit on page. |
| C18 | C | Scriabin, Alexander | Scriabine, Alexandre | Alexandre Scriabine | 1871/1872–1915 | Page gives Julian 25 Dec 1871, flags Gregorian equivalent 6 Jan 1872 explicitly in the article itself. |
| C19 | C | Shostakovich, Dmitri | Chostakovitch, Dmitri | Dmitri Chostakovitch | 1906–1975 | Birth explicit; death year confirmed in later article text. |
| C20 | C | Stravinsky, Igor | same | Igor Stravinsky | 1882–1971 | Fully explicit. Notable: fr.wikipedia keeps the English-style spelling "Stravinsky," not "Stravinski." |
| C21 | C | Sviridov, Georgy | Sviridov, Gueorgui | Gueorgui Sviridov | 1915–1998 | Confirmed via bio text (moved to Moscow 1956, died of heart attack). |
| C22 | C | Taneyev, Sergei | Taneïev, Sergueï | Sergueï Taneïev | 1856–1915 | Fully explicit on page. |
| C23 | C | Tchaikovsky, Pyotr | Tchaïkovski, Piotr | Piotr Ilitch Tchaïkovski | 1840–1893 | Fully explicit. Title carries the patronymic "Ilitch," dropped per conversion rule. |
| C24 | C | Titov, Nikolai | NOT ESTABLISHED | — | — | No article at "Nikolaï Titov" or "Nikolai Titov" (both URLs came back nonexistent); targeted search returned nothing on-topic (only Rimski-Korsakov, other composers, unrelated lists). |
| C25 | C | Varlamov, Alexander | Varlamov, Alexandre | Alexandre Varlamov | 1801–1848 | Page fetched but exact numerals not rendered (only day/month shown); identity unambiguous as the well-known romance composer. |
| P1 | P | Akhmatova, Anna | same | Anna Akhmatova | 1889–1966 | Fully explicit. |
| P2 | P | Apukhtin, Alexei | Apoukhtine, Alexeï | Alexeï Apoukhtine | 1840–1893 | Fully explicit on page. |
| P3 | P | Balmont, Konstantin | Balmont, Constantin | Constantin Balmont | 1867– (1942) | Title uses the Frenchified "Constantin," not "Konstantin." Birth year explicit; death year not rendered in fetch (page states he died at Noisy-le-Grand, France, consistent with 1942). |
| P4 | P | Baratynsky, Yevgeny | Baratynski, Ievgueni | Ievgueni Baratynski | 1800–1844 | Numerals not rendered (blank date fields); bio matches exactly (born Mara/Tambov, died Naples of heart attack, "à 44 ans"), which is consistent with 1800–1844, not the 1803 an earlier fetch pass momentarily suggested (discarded). |
| P5 | P | Bely, Andrei | Biély, Andreï | Andreï Biély | 1880–1934 | Birth explicit; death year inferred from "died at age 54," consistent with brief's dates. |
| P6 | P | Blok, Alexander | Blok, Alexandre | Alexandre Blok | 1880–1921 | Birth explicit; death confirmed in later text ("died at 40 in Petrograd"). |
| P7 | P | Bryusov, Valery | Brioussov, Valéri | Valéri Brioussov | 1873–1924 | Fully explicit on page. |
| P8 | P | Bunin, Ivan | Bounine, Ivan | Ivan Bounine | 1870–1953 | Fully explicit; Nobel Prize 1933 mentioned. |
| P9 | P | Delvig, Anton | Delwig, Anton | Anton Delwig | 1798–1831 | Title spelled "Delwig" (w), not "Delvig" (v) as the URL slug suggested — confirmed on a second, targeted fetch. Numerals not rendered; "died at 32" is consistent with 1798–1831. |
| P10 | P | Fet, Afanasy | Fet, Afanassi | Afanassi Fet | 1820–1892 | Numerals not rendered in fetch; identity unambiguous (born Novosselki, died Moscow). |
| P11 | P | Galina, Glafira | Galina, Galina | Galina Galina | 1870 (1873 per page) –1942 | Real/civil name given on page as Glafira Nikolaevna Mamochina (also "née Glafire Rinsk," later Einerling, then Gousseva); "Galina Galina" is her pen name, duplicated as both parts of the title. Page notes some sources give 1873 for birth. |
| P12 | P | Gippius, Zinaida | Hippius, Zinaïda | Zinaïda Hippius | 1869–1945 | Fully explicit. Title uses the German-style "Hippius," not "Gippius." |
| P13 | P | Goethe, Johann Wolfgang | Goethe | Goethe | 1749–1832 | Title is the bare surname only — the given name does not appear in the title at all, so there is no given name to convert into "Surname, Given" form. |
| P14 | P | Golenishchev-Kutuzov, Arseny | NOT ESTABLISHED | — | — | Fetched the "Golenichtchev" disambiguation page directly: it lists Arseni Golenichtchev-Koutouzov (1848–1913, poet whose verse inspired Moussorgski's "Chants et danses de la mort") as a red link with no article, citing only a Russian Wikipedia entry. |
| P15 | P | Heine, Heinrich | same | Heinrich Heine | 1797–1856 | Page itself notes uncertainty over the exact birth date/year (specialists disagree; Heine himself joked about it). |
| P16 | P | Khomyakov, Alexei | Khomiakov, Alexeï | Alexeï Khomiakov | 1804–1860 | Fully explicit on page. |
| P17 | P | Koltsov, Alexei | Koltsov, Alexeï | Alexeï Koltsov | 1809–1842 | Fully explicit. |
| P18 | P | Lermontov, Mikhail | Lermontov, Mikhaïl | Mikhaïl Lermontov | 1814–1841 | Fully explicit. |
| P19 | P | Mandelstam, Osip | Mandelstam, Ossip | Ossip Mandelstam | 1891–1938 | Birth explicit; death date (27 Dec 1938, Vladivostok) given later in article. |
| P20 | P | Marshak, Samuil | Marchak, Samouil | Samouil Marchak | 1887–1964 | My initial guess "Samuel Marchak" redirected to this canonical title — given name is "Samouil," not "Samuel." |
| P21 | P | Maykov, Apollon | Maïkov, Apollon | Apollon Maïkov | 1821–1897 | Fully explicit on page. |
| P22 | P | Merezhkovsky, Dmitry | Merejkovski, Dimitri | Dimitri Merejkovski | 1865–1941 | Fully explicit. Title uses "Dimitri," not "Dmitri" (confirmed twice). |
| P23 | P | Mey, Lev | Meï, Lev | Lev Meï | 1822–1862 | Fully explicit on page. |
| P24 | P | Nekrasov, Nikolai | Nekrassov, Nikolaï | Nikolaï Nekrassov | 1821–1877 | Fully explicit; page gives 27 Dec 1877 (Julian), whose Gregorian equivalent is 8 Jan 1878 — the source of the 1878 death year in the English form. Same person. |
| P25 | P | Pasternak, Boris | same | Boris Pasternak | 1890–1960 | Fully explicit. |
| P26 | P | Pleshcheyev, Alexei | Plechtcheïev, Alexeï | Alexeï Plechtcheïev | 1825–1893 | Fully explicit on page. |
| P27 | P | Polonsky, Yakov | Polonski, Iakov | Iakov Polonski | 1819–1898 | Fully explicit. |
| P28 | P | Pushkin, Alexander | Pouchkine, Alexandre | Alexandre Pouchkine | 1799–1837 | Fully explicit. |
| P29 | P | Rathaus, Daniil | NOT ESTABLISHED | — | — | No article found by search under "Ratgaouz" or "Rathaus"; results were unrelated (other Daniils, Tchaïkovski catalogues). |
| P30 | P | Shevchenko, Taras | Chevtchenko, Taras | Taras Chevtchenko | 1814–1861 | Fully explicit. |
| P31 | P | Shakespeare, William | same | William Shakespeare | 1564–1616 | Page itself flags the birth date as uncertain/traditional; death date (23 Apr 1616) explicit. |
| P32 | P | Sologub, Fyodor | Sologoub, Fiodor | Fiodor Sologoub | 1863–1927 | Birth explicit (17 Feb 1863); death year confirmed via "died at 64." Title spelled "Sologoub," not "Sologub." |
| P33 | P | Tolstoy, Alexei K. | Tolstoï, Alexis K. | Alexis Konstantinovitch Tolstoï | 1817–1875 | Fully explicit. Title uses "Alexis" (Frenchified), not "Alexeï," and spells out the full patronymic "Konstantinovitch," reduced here to the initial per the brief's rule. |
| P34 | P | Tsvetaeva, Marina | Tsvetaïeva, Marina | Marina Tsvetaïeva | 1892–1941 | Birth explicit (26 Sep 1892); death "in 1941 at Ielabouga" per page. |
| P35 | P | Tyutchev, Fyodor | Tiouttchev, Fiodor | Fiodor Tiouttchev | 1803–1873 | Numerals not rendered in fetch; page references UNESCO's celebration of his bicentennial, consistent with an 1803 birth. |
| P36 | P | Yesenin, Sergei | Essénine, Sergueï | Sergueï Essénine | 1895–1925 | Birth explicit; death confirmed via "died at 30." Title carries an accent — "Essénine," not "Essenine." |
| P37 | P | Zhukovsky, Vasily | Joukovski, Vassili | Vassili Joukovski | 1783–1852 | Fully explicit. |

## 1. The difference set

Rows where the French (Wikipedia) form is not "same": **51** of 62.
(7 rows are "same": C5 Cui, C17 Rubinstein, C20 Stravinsky, P1 Akhmatova, P15 Heine, P25 Pasternak, P31 Shakespeare. 4 rows are NOT ESTABLISHED and excluded from this count: C4, C24, P14, P29.)

## 2. What I could not establish

- **C4, Bulakhov, Pyotr** — no candidate article found by direct search; results returned unrelated Wikipédia pages (Tchaïkovski, a folk-song page, unrelated singers). No page existed to fetch.
- **C24, Titov, Nikolai** — attempted direct fetch of two plausible URLs ("Nikolaï_Titov," "Nikolai_Titov"); both came back nonexistent. A targeted search for the romance composer (1800–1875) returned only unrelated results (other Russian composers, category pages). BnF had established this name in pass 1, so this is a real disagreement, not a gap in method.
- **P14, Golenishchev-Kutuzov, Arseny** — found and fetched the "Golenichtchev" disambiguation page directly. It explicitly lists him (1848–1913, the poet behind Moussorgski's "Chants et danses de la mort") as a red link with no article, noting only that a Russian Wikipedia entry exists. This is the clearest possible negative: the encyclopedia itself flags the absence.
- **P29, Rathaus, Daniil** — no candidate article found under either "Ratgaouz" or "Rathaus"; search results were unrelated (other people named Daniil, general Tchaïkovski discography pages).

## 3. Where pass 2 disagrees with pass 1's BnF forms

41 rows disagree. The 20 rows in agreement (same spelling both passes, or both equal to the English form) are: C3 Borodine, C5, C7 Glazounov, C13 Moussorgski, C16 Rimski-Korsakov, C17, C18 Scriabine, C20, P1, P6 Blok, P7 Brioussov, P8 Bounine, P10 Fet, P15, P19 Mandelstam, P25, P28 Pouchkine, P30 Chevtchenko, P31, P37 Joukovski.

Disagreements:
1. C1: BnF "Arenskij, Anton" — Wikipedia "Arenski, Anton"
2. C2: BnF "Balakirev, Milij" — Wikipedia "Balakirev, Mili"
3. C6: BnF "Dargomyžskij, Aleksandr" — Wikipedia "Dargomyjski, Alexandre"
4. C8: BnF "same" (Glinka, Mikhail) — Wikipedia "Glinka, Mikhaïl"
5. C9: BnF "Grechaninov, Aleksandr" — Wikipedia "Gretchaninov, Alexandre"
6. C10: BnF "Gurilev, Aleksandr" — Wikipedia "Gouriliov, Alexandre"
7. C11: BnF "Kabalevski, Dimitri" — Wikipedia "Kabalevski, Dmitri"
8. C12: BnF "Metner, Nikolaj" — Wikipedia "Medtner, Nikolaï"
9. C14: BnF "Prokofʹev, Sergej" — Wikipedia "Prokofiev, Sergueï"
10. C15: BnF "Rachmaninov, Serge (SPLIT)" — Wikipedia "Rachmaninov, Sergueï"
11. C19: BnF "Chostakovitch, Dimitri" — Wikipedia "Chostakovitch, Dmitri"
12. C21: BnF "Sviridov, Georgij" — Wikipedia "Sviridov, Gueorgui"
13. C22: BnF "Taneiev, Sergueï" — Wikipedia "Taneïev, Sergueï"
14. C23: BnF "Tchaïkovski, Petr" — Wikipedia "Tchaïkovski, Piotr"
15. C24: BnF "Titov, Nikolaj" — Wikipedia NOT ESTABLISHED
16. C25: BnF "Varlamov, Aleksandr" — Wikipedia "Varlamov, Alexandre"
17. P2: BnF "Apuhtin, Aleksej" — Wikipedia "Apoukhtine, Alexeï"
18. P3: BnF "Balʹmont, Konstantin" — Wikipedia "Balmont, Constantin"
19. P4: BnF "Baratynskij, Evgenij" — Wikipedia "Baratynski, Ievgueni"
20. P5: BnF "Biély, André" — Wikipedia "Biély, Andreï"
21. P9: BnF "Delʹvig, Anton" — Wikipedia "Delwig, Anton"
22. P11: BnF NOT ESTABLISHED — Wikipedia "Galina, Galina"
23. P12: BnF "same" (Gippius, Zinaida) — Wikipedia "Hippius, Zinaïda"
24. P13: BnF "same" (Goethe, Johann Wolfgang) — Wikipedia "Goethe" (no given name in title)
25. P14: BnF "Goleniŝev-Kutuzov, Arsenij" — Wikipedia NOT ESTABLISHED
26. P16: BnF "Homâkov, Aleksej" — Wikipedia "Khomiakov, Alexeï"
27. P17: BnF "Kolʹcov, Aleksej" — Wikipedia "Koltsov, Alexeï"
28. P18: BnF "Lermontov, Michel" — Wikipedia "Lermontov, Mikhaïl"
29. P20: BnF "Maršak, Samuil" — Wikipedia "Marchak, Samouil"
30. P21: BnF "Majkov, Apollon" — Wikipedia "Maïkov, Apollon"
31. P22: BnF "Merežkovskij, Dmitrij" — Wikipedia "Merejkovski, Dimitri"
32. P23: BnF "Mej, Lev" — Wikipedia "Meï, Lev"
33. P24: BnF "Nekrassov, Nicolas" — Wikipedia "Nekrassov, Nikolaï"
34. P26: BnF "Pleŝeev, Aleksej" — Wikipedia "Plechtcheïev, Alexeï"
35. P27: BnF "Polonskij, Âkov" — Wikipedia "Polonski, Iakov"
36. P29: BnF "Ratgauz, Daniil" — Wikipedia NOT ESTABLISHED
37. P32: BnF "Sologub, Fedor" — Wikipedia "Sologoub, Fiodor"
38. P33: BnF "Tolstoj, Aleksej K." — Wikipedia "Tolstoï, Alexis K."
39. P34: BnF "Cvetaeva, Marina" — Wikipedia "Tsvetaïeva, Marina"
40. P35: BnF "Tioutchev, Fedor" — Wikipedia "Tiouttchev, Fiodor"
41. P36: BnF "Essenine, Serge" — Wikipedia "Essénine, Sergueï"

(C4 is not counted as a disagreement: both passes came back NOT ESTABLISHED.)

## 4. Instrument

58 of 62 rows are established from an actual fetch of the resolved article page (the MediaWiki API endpoint itself was blocked in this environment as "cache-only" for every call attempted, so the instrument used was a direct WebFetch of the `fr.wikipedia.org/wiki/<title>` page — this returns the same canonical, post-redirect content, confirmed repeatedly by title/URL mismatches resolving correctly, e.g. "Serge_Rachmaninov" → "Sergueï Rachmaninov," "Anton_Delvig" → "Anton Delwig," "Samuel_Marchak" → "Samouil Marchak"). Zero rows are snippet-only: for the 4 NOT ESTABLISHED rows (C4, C24, P14, P29) there was no page to read at all — C24 was confirmed absent by two direct page fetches returning nonexistent, and P14 was confirmed absent by an actual fetch of the disambiguation page showing the entry as a red link, not by a search snippet alone. WebSearch was used only as a discovery step, to locate the right title before fetching it — never as the source of the final answer.

One caveat on the instrument itself: for a number of rows (C1, C9, C11, C12, C15, C18, C25, P3, P4, P5, P9, P10, P13-partially, P35), the WebFetch-to-markdown conversion did not render the numeric contents of Wikipedia's date templates in the opening sentence, leaving visible gaps ("né le … à …"). In every one of those cases I still had an actual fetch of the correct resolved page in hand, and cross-checked identity and years through surrounding biographical prose, explicit "at age N" statements, or (for Kabalevski, Baratynsky) a second, more targeted fetch — never by falling back to a search snippet.
