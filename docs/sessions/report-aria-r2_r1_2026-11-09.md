# Report: aria texts r2 (Sonnet helper, 2026-11-09; written to file by the desk from the helper's hand-back)

Input: tools/poems/arias-for-library_r1_2026-11-08.json (92). Spec: Fable's review, docs/sessions/review-fable-three-briefs_r1_2026-11-09.md, Brief 3, amendments 1 to 9 and 12.
Output: arias-for-library_r2_2026-11-09.json, md5 b8706cf9b642f24db14501010595bfa2, 415,916 bytes. Checker check-aria-r2.mjs: 0 failures (89 r2 + 14 library entries), re-run by the desk at 20:5x. Built merged poem file 492,927 bytes (103 entries, 42 works).

Kept 89. Held out 1: Tomsky's ballad (French in the sung text; desk default). Dropped 2: Judith's Aria and Holofernes (no death date found for Giustiniani or Lobanov).

Amendment 2: every entry has id and work (work = first 8 hex of MD5 of the NFC opera title; id = first 10 hex of MD5 of opera + "/" + first sung line); 29 works; no id repeats.
Amendment 3 (textModern only; textEdition untouched): speaker labels 83 lines in 39 entries; parenthesized directions 47 in 26; prose directions and headings 14 in 10; bracketed headings 7; number headings 6; «Вместе» 5; FEB page numbers 4; inline edits in 4. Two parentheses were sung words, unwrapped not deleted («(как знать?)», «(совесть в том порукой)»). «Визáнтию» now Cyrillic а + U+0301. Entry 5's capital stress marks became combining acutes.
Amendment 4: 83 other-role lines cut in 18 entries (Konchakovna, Onegin, Galitsky, Francesca, Snow Maiden, Marfa's arioso, Finn, Dubrovsky, Hermann arioso 1, Hermann's aria, Stranger, Aleko, Tomsky's song, Farlaf, Boris death scene, Pimen, Varangian guest, King René).
Amendment 5: «Ариозо Кумы» modernized (ѣ, і, final ъ).
Amendment 7: provenance.id, rights notes, and extraction fields removed; composer is a COMPOSERS key; parentheticals moved to provenance.notes. Grep for the removed source terms: 0 hits.
Amendment 8: source.site operalib.eu 60, FEB 9, Russian Wikisource 20.
Amendment 9: translator null on all 89. Adaptations flagged: Joan of Arc (Schiller via Zhukovsky), Clytemnestra (Venkstern after Aeschylus), Francesca (after Dante), Iolanta (after Hertz).

Rights (16 DOUBTFUL): 13 USABLE and shipped with rightsTrail and rightsResolution (Francesca; Liza; Polina, adds Batyushkov 1787-1855; Hermann arioso 1, arioso 2, aria; Yeletsky; Tomsky's song, adds Derzhavin d. 1816; three Khovanshchina entries; Clytemnestra, Venkstern 1855-1909; Joan of Arc). Dates read from Wikipedia.

Composer keys proposed, not edited: 'Verstovsky, Alexei' 1799-1862 fr 'Verstovski, Alexeï'; 'Napravnik, Eduard' 1839-1916 fr 'Nápravník, Eduard' (diacritics in the key: Dann's taste); 'Serov, Alexander' 1820-1871 (unused).

Could not establish: Giustiniani's and Lobanov's dates; whether Marfa's «Исходила младёшенька» words are traditional; which Joan of Arc lines come from which source; the FEB text itself (frameset); completeness of the borrowed Pique Dame verses list; speakers in unlabelled spans; twelve arias end mid-phrase as in r1; titles mix Russian and English, two titles repeat (ids differ).
