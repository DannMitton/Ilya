# For ratification: the poem card and the gloss offer, taste and French (desk, r1, 2026-11-03 20:0x)

Dann 19:53: *"Please sequence the Taste and French choices outstanding. resolve those that you can justifiably resolve. Bring me great drafts with your recommendation."* Every French line is a desk draft built from `apps/web/src/lib/i18n.ts` (`cloud-lane-31` at `e4105a84`); adopted and coined words are named.

## Resolved by the desk (each reversible)

1. **Button order: Not this poem, then Keep this poem.** The page's rule is that the last answer is the safe one (`+page.svelte:2427`, `:2434`); keeping the poem changes nothing, so it goes last.
2. **«Utilisée» and «la» agree with «glose».** The French interface calls a gloss «la glose» («Modifier la glose», «Glose disponible en anglais seulement», `i18n.ts`).
3. **Nested guillemets: no case arises.** In the interface a title or a passage line is never inside other quotation marks; they appear one after another («Мцыри», then «Дитя моё…»). Closed.
4. **The dating line:** ruled by Dann 19:50 (kept in the library's record, never in POEM).

## For ratification, in order

**D1. Quotation marks around a Russian title.** The sentence's language chooses the marks: English “Весёлый час”, French « Весёлый час ». Today the English drafts use «», which no other English string in `i18n.ts` uses. Recommendation: English double quotes.

**D2. The colours sentence stays, shortened to the moment.** It is the only thing that tells her why LYRICS just turned colour; the line under LYRICS is standing text she has stopped reading.
- EN: "Coloured words in LYRICS now show where your song departs from this poem."
- FR: « Les mots en couleur du champ PAROLES montrent maintenant où la mise en musique s’écarte de ce poème. »

**D3. The site's name in each language.**
- EN: "Russian Wikisource"
- FR: « Wikisource en russe » (so the card reads « Tiré de Wikisource en russe. »)

**D4. A passage's opening line: enough words to recognize.** The card shows the passage's opening up to the first full line of at least four words, without its closing punctuation: «Дитя моё, останься здесь со мной». Today it shows «Дитя моё» (two words).

**D5. The poem card, all strings** (changes from the build in bold):

| key | English | French |
|---|---|---|
| `cardHeading` | Ilya found this poem for your song: | Ilya a trouvé ce poème pour votre chant : |
| `by` | {author}, translated by {translator} | {author}, traduit par {translator} |
| `passage` | a passage beginning **“{line}”** | un passage commençant par « {line} » |
| `cardSource` | From {site}. | Tiré de {site}. |
| `cardSourceModernized` | From {site}, in modern spelling. | Tiré de {site}, en orthographe moderne. |
| `cardColours` | **Coloured words in LYRICS now show where your song departs from this poem.** | **Les mots en couleur du champ PAROLES montrent maintenant où la mise en musique s’écarte de ce poème.** |
| `notThis` | Not this poem | Pas ce poème |
| `keep` | Keep this poem | Conserver ce poème |
| `view.libraryPoem` | {author}, **“{title}”**, from {site}. | {author}, « {title} », tiré de {site}. |
| `view.libraryPoemEdited` | Based on {author}, **“{title}”**, from {site}. | D’après {author}, « {title} », tiré de {site}. |
| `removed` | Poem removed. | Poème retiré. |
| `undo` | Undo | Annuler |

French adopted from the file: « poème », « chant », « les mots en couleur », « le champ PAROLES », « la mise en musique », « s’écarte », « Conserver », « Retirer », « Annuler ». Coined by the desk: « Tiré de », « en orthographe moderne », « Pas ce poème », « D’après », « traduit par », « un passage commençant par », « maintenant », « Wikisource en russe ».

**D6. The gloss offer, all strings.**

| key | English | French |
|---|---|---|
| `glossOffer` | Use for this word in your other songs | Utiliser pour ce mot dans vos autres chants (ruled 14:32) |
| `glossOfferDismiss` | Not now | Pas maintenant |
| `glossOfferDone` | Used in your other songs | Utilisée dans vos autres chants |
| `glossOfferFailed` | Could not be kept on this device | Impossible de la conserver sur cet appareil |
| `glossFromGlossary` | From your other songs | De vos autres chants |
| `glossStopUsing` | Stop using | Ne plus utiliser |

Coined (Fable, the desk adopting): « Pas maintenant », « Utilisée dans », « Impossible de la conserver sur cet appareil », « De vos autres chants », « Ne plus utiliser ».
