# Brief: the closing polish lane, before the share

This brief is the desk's. Do not edit, rename, or replace it.

r3, 2026-11-12. FABLE-REVIEWED: SEND WITH AMENDMENTS, 16 amendments, appended below and binding. r2 text follows.

r2, 2026-11-12, written by the desk (Opus). Lines cited in r1 were read by the desk on `Shane` at `ad90f5a6` on 2026-11-11; every line r2 adds or moves was read by the desk on `Shane` at `7fb9cd30` on 2026-11-12.

**Changes from r1b** (the Sonnet scout's packet `scout-packet-three-briefs_r1_2026-11-11.md`, items (a) to (c), (e), (f), and one desk finding):
- NEW step 0b: the scan reader's files are never built into the site, so a colleague's scan reads no words. Found by the desk 2026-11-12 00:0x.
- Step 1 names every reader of "has readings" and what each does (scout (c)).
- Steps 2, 3, 4, and 7 name the further test pins of the strings they change (scout (b)).
- Step 5 names the further sites of the Latin test and corrects `latin.ts` lines.
- Step 6: `cdn.jsdelivr.net` IS reached, by the photo path; the step now self-hosts it and moves the header's pin (scout (a)); `app.html:46-51`.
- Step 9: `restoreFrom` has a second call (scout (e)); the `upload.*` count.
- Step 11: N.17's spec, read from the project file (scout (f)).

## Lane

- Branch `cloud-lane-48`, cut from `Shane` at the commit the desk names when it starts the lane. Commit and push only that branch. Never `Shane` or `main`. No pull request.
- Take every "before" reading first, before any edit. To read old code, use `git show <sha>:<path>`. No `git stash`, `checkout` of files, `reset`, or `restore`.
- Report after each step in `docs/sessions/report-code-closing-polish-step<N>_r1_<date>.md`: what changed (file and line), the tests added, the gate counts, and a section "What I could not establish". NOT ESTABLISHED beats a complete invented answer.

## What the singer gets

Every change here is small and ruled. Together they make the build that colleagues see on Friday: a scan that shows its words, the right button in the Drawer, the placeholder-voice lines in correct French, an install banner that shows where Chrome's Share button is, the aria card in French, Latin words handled as the rulings say, Ilya's fonts served from its own site, and the dead strings gone.

## Rulings that bind this lane

Each is in `docs/memory/OPEN.md` under the heading named.
- LANE 39 TASTE LEFTOVERS, RULED 2026-11-11: 39-6 (13:15), 39-7 (13:16), the French set (13:20, 13:23), and the d’ elision DESK DEFAULT.
- CHROME ON IPHONE: THE INSTALL LINE (22:10 EN, 22:11 FR) and its DESK DEFAULT glyph.
- THE ARIA CARD IN FRENCH (22:18).
- RULED by Dann 2026-11-09 23:32 (whole Latin-script words; the Seminarian's three IPA rows), 23:23 (batch 7), 23:27 (the Roberge guard test).

## Steps

**Before each step, read the Amendments section at the end of this brief for that step.**

### Step 0. Read and measure

Run all eight gates on the lane's first commit and record each count. Read every line this brief cites and report any that has moved or no longer says what the brief says. Change nothing.

### Step 0b. Serve the scan reader's words

Found by the desk 2026-11-12 00:0x. The scan reader's three files are never built into the site: `apps/web/package.json:9` (`dev`) and `:10` (`build`) run no `scripts/copy-underlay-model.mjs`, whose own header says "NOT WIRED" (`:5-10`). On the Shane alias, `/omr/models/underlay/worker.min.js`, `/omr/models/underlay/tesseract-core-simd-lstm.wasm.js`, and `/omr/models/underlay/rus_prereform_r2_29000.traineddata` each answer 404 (desk fetch, 2026-11-12 00:0x). So `startTesseract` rejects (`omr/underlay-recognize.ts:103-117`), and every scan is read with no words, without an error (`:21-23`). The share ruling of 2026-11-09 11:56 (scan words shown as a preview) depends on this step.

The model arrives on `Shane` before this lane is cut: the desk copies it to `apps/web/omr-underlay/rus_prereform_r2_29000.traineddata` (7,827,478 bytes, md5 `2ff2af3e33461cd64e7d2015ef21d10d`, the path `copy-underlay-model.mjs:34` reads), and Dann's ship adds it. If it is not on the lane's first commit, stop and report.

Change:
1. In both scripts, add `&& node scripts/copy-underlay-model.mjs` after `node scripts/copy-metre-model.mjs`.
2. Rewrite the script's header (`:5-10`) and the comment at `underlay-recognize.ts:21-23` to say the files are served.
3. A unit test that reads `apps/web/package.json` and fails if `dev` or `build` lacks the copy.

Done when the built site serves the three files (report their bytes under `build/omr/models/underlay/`; the desk counts 11,838,257 from the script's header, `:16-23`) and a scan read on the built site in Playwright seats at least one word. If the lane cannot run that read, write NOT ESTABLISHED; the desk reads a scan on the alias after the ship.

### Step 1. The Drawer's button reads Calibrate when no reading is usable (39-6)

Today the Drawer's voice anchor shows "Re-calibrate" when the voice holds any reading at all: `+page.svelte:1646` passes `hasAnyReadings(voiceFormants)` (`profileStore.ts:175-177`, a count of keys) to `VoiceAnchor` (`+page.svelte:4170`), which picks the button at `VoiceAnchor.svelte:45` and the status line at `:40-42`.

Change: the anchor's `calibrated` input is true only when at least one stored reading is usable, by the guard's own test (`isUsable`, `voice/engine/plausibility.ts:275`). The button and the status line follow it.

Other sites that compute "is this voice calibrated" or "has readings" (CONTRACT §4), read by the desk 2026-11-12:
- `voiceCalibrated` is defined at `+page.svelte:1646` and read by code once, at `:4170` (the anchor). `:1641`, `:1644`, and `:4156` are comments; correct the ones this step makes untrue.
- `CalibrationWizard.svelte:335`, `:511`, `:527`, `:548` choose the wizard's opening phase with `hasAnyReadings`. DESK DEFAULT: they keep it, so a singer whose readings were all refused still opens on the summary, where each reading can be retaken. The comment above `hasAnyReadings` (`voice/profileStore.ts:166-174`) says the wizard and the anchor share one predicate so they never disagree; rewrite it to say why they now differ.
- The Voice band's state line: `+page.svelte:1727-1735` passes `Object.keys(voiceFormants).length` to `scoreStateLine` (`components/Drawer/bandState.ts:235-249`), whose comment calls it the second reader of the anchor's rule (`:226-230`). It follows the anchor: its voice half prints only when the anchor's named line does, and its count counts usable readings. Otherwise the band would print the voice's name and a count above a Drawer that says "Voice: not yet calibrated".
- MELODY's `hasReadings` (`markup/MarkupPane.svelte:449`, a count of keys) gates the profile copy (`:1106`). DESK DEFAULT: unchanged in this lane. Report what MELODY shows for a voice whose readings are all refused. Add a test: a voice whose only readings are `implausible` without an override shows "Calibrate" and "Voice: not yet calibrated".

### Step 2. The placeholder-voice lines (39-7 and the French set)

Ratified 2026-11-11 13:23:
- `profile.subtitlePlaceholder` (`i18n.ts:1489`): EN unchanged. FR « Profil de formants : valeurs par défaut pour une voix type de {voiceType}, pas encore vos propres résonances. »
- `insights.generic.lede` (`i18n.ts:1891`): EN "These findings use placeholder values for a generic {voiceType}, not your specific voice." FR « Ces constats reposent sur des valeurs par défaut pour une voix type de {voiceType}, et non sur votre voix en particulier. »
- A new key `insights.r2.vowels.against.generic`: EN "against where each vowel turns in a generic {voiceType}"; FR « selon la hauteur où chaque voyelle change de timbre pour une voix type de {voiceType} ». `singer-blocks.ts:334` uses it in place of `insights.r2.vowels.against` (`i18n.ts:2030`) when the page is a placeholder page (`i.generic`, `singer-blocks.ts:113-114`), filled with the label `voiceTypePrint` gives (`voice/voiceTypes.ts:82-96`).

The elision (DESK DEFAULT): in French, « de {voiceType} » becomes « d’{voiceType} » when the label begins with a vowel letter (a, e, é, i, o, u, y, and their accented forms), never before h. One helper, used by the three fills (`markup/subtitle.ts:12`, `insights/identity.ts:52`, and the new one). Tests: « d’octaviste », « de basse », « de heldentenor ».

Move every pin of the old text with it: `insights/ratified-lines.test.ts:406-411`; `markup/subtitle.test.ts:6-7` (the French « le type générique »); `insights/identity.test.ts:88-93` (EN "for a ${en}", FR « le type ${fr} »). Pin the new key, and add a test of `singer-blocks.ts:334` on a placeholder page (`i.generic`, read at `:251`; no test covers `:334` today). The identity line (`insights/identity.ts:28`, keys `i18n.ts:1818-1819`) is a third caller of `voiceTypePrint`; it prints « · {voiceType} » with no « de », so it does not change.

### Step 3. The install banner shows where Chrome's Share button is

Ratified 2026-11-11 22:10 and 22:11, replacing `ios_chrome_body` at `components/InstallPrompt.svelte:41` (EN) and `:51` (FR):
- EN "In Chrome, tap the <strong>Share</strong> button at the right inside the address bar, tap <strong>View More</strong>, then choose <strong>Add to Home Screen</strong>."
- FR « Dans Chrome, appuyez sur le bouton <strong>Partager</strong>, à droite dans la barre d’adresse, puis sur <strong>Afficher plus</strong>, et choisissez <strong>Sur l’écran d’accueil</strong>. »

The glyph (DESK DEFAULT): a small inline SVG after the word Share / Partager in `ios_chrome_body` and in `ios_body` (`:40`, `:50`), drawn from plain shapes: an open-topped rounded square with an arrow rising from its middle. Not Apple's symbol file. `aria-hidden="true"`, `currentColor`, about 1em high, aligned to the text baseline. The pin test `components/install-prompt-gate.test.ts:22-28` reads each `ios_chrome_body` with `/ios_chrome_body: '([^'\n]+)',/g`: keep each line a single-quoted literal with no straight apostrophe inside (the French takes ’, as the ratified text does), and move its two expected values to the new lines. DESK DEFAULT: the glyph is not written into the strings. The component inserts it after the first `</strong>` of `ios_body` and of `ios_chrome_body` where it renders them (`InstallPrompt.svelte:147`, `{@html …}`), so the strings stay as ratified and the regex still reads them. The banner's other strings do not change.

### Step 4. The aria card in French

Today `operaLine` (`text/poem-metadata.ts:96-98`) prints Russian names in French: «Елецкий · Пиковая дама». Ratified 22:18: French takes the English shape, «Yeletski · La Dame de pique (Пиковая дама)».

- Data: add `opera_fr` and `character_fr` to the `provenance` of each of the 89 libretto entries in `tools/poems/library.json`, from the table below.
- Build: `OPERA_FIELDS` (`scripts/build-poem-library.mjs:249-258`) gains `['operaFr', 'opera_fr']` and `['characterFr', 'character_fr']`; `operaOf` then refuses an entry without them.
- App: `PoemOpera` (`text/poem-library.ts:29-45`) gains `operaFr` and `characterFr`; `OPERA_TEXT_KEYS` (`:123`) gains both; `operaLine`'s French branch returns `${characterFr} · ${operaFr} (${operaRu})`. Rewrite the comment at `:91-94` to match.
- Rebuild the poem file and report its bytes, gzip -9 and brotli, against 1,134,338 (247,522 gzip, 178,015 brotli; lane 45's report).
- Tests: one line per opera (29), each with one of its roles, in French; and the English line unchanged. Move the French pin at `text/poem-offer-metadata.test.ts:127-128` (today «Пимен · Борис Годунов»), and rename that test, whose name says no French name is in the data. `operaLine`'s one caller is `components/Drawer/PoemLibraryCard.svelte:53`.
- Measure the bytes with Node's zlib, as lane 45 did; Python's `gzip -9` gives a different figure (247,257 against 247,522).

The table (29 operas, 74 roles; typographic apostrophe U+2019; JSON, `opera_ru` and `character_ru` as in the data):

```json
{
 "version": 1,
 "ratified": "Dann 2026-11-11 22:18",
 "operas": [
  {
   "opera_ru": "Алеко",
   "opera_fr": "Aleko",
   "roles": [
    {
     "character_ru": "Алеко",
     "character_fr": "Aleko"
    },
    {
     "character_ru": "Молодой цыган",
     "character_fr": "Jeune gitan"
    }
   ]
  },
  {
   "opera_ru": "Аскольдова могила",
   "opera_fr": "La Tombe d’Askold",
   "roles": [
    {
     "character_ru": "Неизвестный",
     "character_fr": "L’Homme inconnu"
    }
   ]
  },
  {
   "opera_ru": "Борис Годунов",
   "opera_fr": "Boris Godounov",
   "roles": [
    {
     "character_ru": "Борис",
     "character_fr": "Boris"
    },
    {
     "character_ru": "Варлаам",
     "character_fr": "Varlaam"
    },
    {
     "character_ru": "Марина",
     "character_fr": "Marina"
    },
    {
     "character_ru": "Пимен",
     "character_fr": "Pimène"
    },
    {
     "character_ru": "Щелкалов",
     "character_fr": "Chtchelkalov"
    }
   ]
  },
  {
   "opera_ru": "Демон",
   "opera_fr": "Le Démon",
   "roles": [
    {
     "character_ru": "Демон",
     "character_fr": "Le Démon"
    }
   ]
  },
  {
   "opera_ru": "Дубровский",
   "opera_fr": "Doubrovski",
   "roles": [
    {
     "character_ru": "Дубровский",
     "character_fr": "Vladimir Doubrovski"
    }
   ]
  },
  {
   "opera_ru": "Евгений Онегин",
   "opera_fr": "Eugène Onéguine",
   "roles": [
    {
     "character_ru": "Гремин",
     "character_fr": "Grémine"
    },
    {
     "character_ru": "Ленский",
     "character_fr": "Lenski"
    },
    {
     "character_ru": "Ольга",
     "character_fr": "Olga"
    },
    {
     "character_ru": "Онегин",
     "character_fr": "Onéguine"
    },
    {
     "character_ru": "Татьяна",
     "character_fr": "Tatiana"
    }
   ]
  },
  {
   "opera_ru": "Жизнь за Царя",
   "opera_fr": "Une vie pour le tsar",
   "roles": [
    {
     "character_ru": "Антонида",
     "character_fr": "Antonida"
    },
    {
     "character_ru": "Собинин",
     "character_fr": "Sobinine"
    },
    {
     "character_ru": "Сусанин",
     "character_fr": "Soussanine"
    }
   ]
  },
  {
   "opera_ru": "Золотой петушок",
   "opera_fr": "Le Coq d’or",
   "roles": [
    {
     "character_ru": "Шемаханская царица",
     "character_fr": "La Reine de Chemakha"
    }
   ]
  },
  {
   "opera_ru": "Иоланта",
   "opera_fr": "Iolanta",
   "roles": [
    {
     "character_ru": "Водемон",
     "character_fr": "Vaudémont"
    },
    {
     "character_ru": "Иоланта",
     "character_fr": "Iolanta"
    },
    {
     "character_ru": "Король Рене",
     "character_fr": "Le Roi René"
    },
    {
     "character_ru": "Роберт",
     "character_fr": "Robert"
    }
   ]
  },
  {
   "opera_ru": "Каменный гость",
   "opera_fr": "Le Convive de pierre",
   "roles": [
    {
     "character_ru": "Лаура",
     "character_fr": "Laura"
    }
   ]
  },
  {
   "opera_ru": "Князь Игорь",
   "opera_fr": "Le Prince Igor",
   "roles": [
    {
     "character_ru": "Владимир Игоревич",
     "character_fr": "Vladimir Igorevitch"
    },
    {
     "character_ru": "Галицкий",
     "character_fr": "Galitski"
    },
    {
     "character_ru": "Князь Игорь",
     "character_fr": "Le Prince Igor"
    },
    {
     "character_ru": "Кончаковна",
     "character_fr": "Konchakovna"
    },
    {
     "character_ru": "Ярославна",
     "character_fr": "Jaroslavna"
    }
   ]
  },
  {
   "opera_ru": "Мазепа",
   "opera_fr": "Mazeppa",
   "roles": [
    {
     "character_ru": "Андрей",
     "character_fr": "Andreï"
    },
    {
     "character_ru": "Мазепа",
     "character_fr": "Mazeppa"
    }
   ]
  },
  {
   "opera_ru": "Майская ночь",
   "opera_fr": "Nuit de mai",
   "roles": [
    {
     "character_ru": "Левко",
     "character_fr": "Levko"
    }
   ]
  },
  {
   "opera_ru": "Ночь перед Рождеством",
   "opera_fr": "La Nuit de Noël",
   "roles": [
    {
     "character_ru": "Оксана",
     "character_fr": "Oxana"
    }
   ]
  },
  {
   "opera_ru": "Опричник",
   "opera_fr": "L’Opritchnik",
   "roles": [
    {
     "character_ru": "Наталья",
     "character_fr": "Natalia"
    }
   ]
  },
  {
   "opera_ru": "Орестея",
   "opera_fr": "Oresteïa",
   "roles": [
    {
     "character_ru": "Клитемнестра",
     "character_fr": "Clytemnestre"
    }
   ]
  },
  {
   "opera_ru": "Орлеанская дева",
   "opera_fr": "La Pucelle d’Orléans",
   "roles": [
    {
     "character_ru": "Иоанна",
     "character_fr": "Jeanne d’Arc"
    }
   ]
  },
  {
   "opera_ru": "Пиковая дама",
   "opera_fr": "La Dame de pique",
   "roles": [
    {
     "character_ru": "Герман",
     "character_fr": "Hermann"
    },
    {
     "character_ru": "Елецкий",
     "character_fr": "Yeletski"
    },
    {
     "character_ru": "Лиза",
     "character_fr": "Lisa"
    },
    {
     "character_ru": "Полина",
     "character_fr": "Pauline"
    },
    {
     "character_ru": "Томский",
     "character_fr": "Tomski"
    }
   ]
  },
  {
   "opera_ru": "Русалка",
   "opera_fr": "La Roussalka",
   "roles": [
    {
     "character_ru": "Княгиня",
     "character_fr": "La Princesse"
    },
    {
     "character_ru": "Князь",
     "character_fr": "Le Prince"
    },
    {
     "character_ru": "Мельник",
     "character_fr": "Le Meunier"
    }
   ]
  },
  {
   "opera_ru": "Руслан и Людмила",
   "opera_fr": "Rouslan et Ludmila",
   "roles": [
    {
     "character_ru": "Баян",
     "character_fr": "Bayan"
    },
    {
     "character_ru": "Горислава",
     "character_fr": "Gorislava"
    },
    {
     "character_ru": "Людмила",
     "character_fr": "Ludmila"
    },
    {
     "character_ru": "Ратмир",
     "character_fr": "Ratmir"
    },
    {
     "character_ru": "Руслан",
     "character_fr": "Rouslan"
    },
    {
     "character_ru": "Фарлаф",
     "character_fr": "Farlaf"
    },
    {
     "character_ru": "Финн",
     "character_fr": "Finn"
    }
   ]
  },
  {
   "opera_ru": "Садко",
   "opera_fr": "Sadko",
   "roles": [
    {
     "character_ru": "Варяжский гость",
     "character_fr": "Le Marchand varègue"
    },
    {
     "character_ru": "Веденецкий гость",
     "character_fr": "Le Marchand vénitien"
    },
    {
     "character_ru": "Волхова",
     "character_fr": "Volkhova"
    },
    {
     "character_ru": "Любава",
     "character_fr": "Lioubava"
    },
    {
     "character_ru": "Садко",
     "character_fr": "Sadko"
    },
    {
     "character_ru": "Индийский гость",
     "character_fr": "Le Marchand indien"
    }
   ]
  },
  {
   "opera_ru": "Сказка о царе Салтане",
   "opera_fr": "Le Conte du tsar Saltan",
   "roles": [
    {
     "character_ru": "Царевич Гвидон",
     "character_fr": "Tsarévitch Guidon"
    },
    {
     "character_ru": "Царевна Лебедь",
     "character_fr": "La Princesse-Cygne"
    }
   ]
  },
  {
   "opera_ru": "Снегурочка",
   "opera_fr": "Snégourotchka",
   "roles": [
    {
     "character_ru": "Лель",
     "character_fr": "Lel"
    },
    {
     "character_ru": "Снегурочка",
     "character_fr": "Snégourotchka"
    },
    {
     "character_ru": "Царь",
     "character_fr": "Le Tsar"
    }
   ]
  },
  {
   "opera_ru": "Франческа да Римини",
   "opera_fr": "Francesca da Rimini",
   "roles": [
    {
     "character_ru": "Франческа",
     "character_fr": "Francesca"
    }
   ]
  },
  {
   "opera_ru": "Хованщина",
   "opera_fr": "La Khovanchtchina",
   "roles": [
    {
     "character_ru": "Марфа",
     "character_fr": "Marfa"
    },
    {
     "character_ru": "Шакловитый",
     "character_fr": "Chaklovity"
    }
   ]
  },
  {
   "opera_ru": "Царская невеста",
   "opera_fr": "La Fiancée du tsar",
   "roles": [
    {
     "character_ru": "Грязной",
     "character_fr": "Griaznoï"
    },
    {
     "character_ru": "Лыков",
     "character_fr": "Lykov"
    },
    {
     "character_ru": "Любаша",
     "character_fr": "Lioubacha"
    },
    {
     "character_ru": "Марфа",
     "character_fr": "Marfa"
    },
    {
     "character_ru": "Собакин",
     "character_fr": "Sobakine"
    }
   ]
  },
  {
   "opera_ru": "Чародейка",
   "opera_fr": "L’Enchanteresse",
   "roles": [
    {
     "character_ru": "Князь",
     "character_fr": "Le Prince"
    },
    {
     "character_ru": "Кума",
     "character_fr": "Kouma"
    }
   ]
  },
  {
   "opera_ru": "Черевички",
   "opera_fr": "Les Souliers de la reine",
   "roles": [
    {
     "character_ru": "Вакула",
     "character_fr": "Vakoula"
    }
   ]
  },
  {
   "opera_ru": "Сон на Волге",
   "opera_fr": "Un rêve sur la Volga",
   "roles": [
    {
     "character_ru": "Старуха",
     "character_fr": "La Vieille"
    }
   ]
  }
 ]
}
```

### Step 5. Latin words, as ruled 2026-11-09 23:32

The ruling: a whole Latin-script word is deliberate foreign text (shown as printed, in italics, no IPA unless a ruled table gives it); a Latin letter inside a Russian word is garble; the poem library accepts whole Latin-script words and keeps refusing Latin letters inside Cyrillic words.

Today:
- The builder refuses any Latin letter in a poem (`TEXT_FAULTS`, `build-poem-library.mjs:110`), and narrows the rule for a libretto only (`GLUED_LATIN`, `:119`; `textFault`, from `:122`).
- The app's test for a Latin word is ASCII (`HAS_LATIN`, `latin.ts:67`, `/[A-Za-z]/`, read by `isLatinWord`, `:70-72`), so «à» is not marked and the line drops it (`components/Paper/VerseLine.svelte:26-28` keeps a word only when it is marked Latin or holds a Cyrillic letter; read by the desk).
- `seminarianIpa` (`latin.ts:75-78`) gives «et» `ɛt` in any song (`latin.ts:44`), and with it the Richter credit in the footer.
- `isLatinWord` has one caller, `markLatinWords` (`latin.ts:85-96`), run as the pipeline's last pass (`pipeline.ts:487`).
- Two more sites keep a word by a Cyrillic test, as `VerseLine.svelte:26-28` does: `page-fit.ts:71` (with `w.latin` at `:75` and `:130`, so they follow the new mark) and `provenance.ts:215`, which skips any word with no Cyrillic letter. DESK DEFAULT: `provenance.ts:215` is unchanged; report whether a Latin word reaches it.
- The Richter credit is drawn when `showsRichterIpa(lines)` is true (`Paper/TitlePage.svelte:140`, `SubsequentPage.svelte:100`, `Paper.svelte:155`; text `footer.richter` at `PageFooter.svelte:58`); item 4 below changes what that reads.

Change:
1. One definition of a word for both the builder and the app: a run of `[\p{L}\p{M}]` (a hyphen and an apostrophe divide words). A Latin word is a word whose letters are all `\p{Script=Latin}`.
2. The builder accepts whole Latin words in poems, and keeps two guards: a line that is only a Roman numeral is refused, and a one-letter Latin word between Cyrillic words is refused (a look-alike typed for a Russian word). Tests: «I» alone on a line fails; «Он пришёл c ней» with a Latin c fails; «à ce soir» passes; «мeня» with a Latin e fails.
3. `isLatinWord` (`latin.ts:70-72`) uses the same Unicode test, so «à» and «cœur» are marked Latin.
4. `seminarianIpa` applies only when the song's text holds at least two different nouns of the table (every key except `et` and `atque`). DESK DEFAULT. Test: «et» alone in a French line gets no IPA and no Richter credit; «Семинарист»'s text keeps every row.
5. The three rows aligned to Grayson's softening limits (p. 209): `pulvis` `ˈpul vʲis`, `amnis` `ˈɑm ɲis`, `axis` `ˈɑk sʲis` (`latin.ts:40`, `:43`, `:50`, read 2026-11-12). The credit's wording ("after Richter, adapted to Grayson's rules") waits for its French; do not change `footer.richter` in this lane.

Not in this lane: a Latin word on a scan marked for checking. Report where the scan reader would mark it (file and line) and stop.

### Step 6. Ilya's fonts from its own site (row 155, N.197)

Today the page loads Source Sans 3 and Source Serif 4 from Google (`app.html:46-51`), and Noto Sans and Noto Serif (`+page.svelte:3673-3675`); the content policy allows `fonts.googleapis.com`, `fonts.gstatic.com`, and `cdn.jsdelivr.net` (`vercel.json:37`).

Change: serve the same families, styles, and weights from `apps/web/static/fonts/` as woff2 with their OFL licence files; remove the preconnects and stylesheet links; remove the three outside hosts from the content policy. Before the change, take the screenshot set of `docs/sessions/n174-c2/` (desk and phone, EN and FR) and the print PDFs of one song's TEXT and MELODY; after it, the same; report every capture that differs and by how many pixels (Dann 2026-11-09: fonts move layout and print). Report the bytes added under `static/` (CONTRACT §8: Dann hears the count before the ship). `cdn.jsdelivr.net` IS still reached at run time, by the photo path: `score/ScoreUploader.svelte:373` calls `createWorker('rus')` with no paths, so tesseract.js fetches its worker, its core, and its Russian data from the CDN (`e2e/heic-reader-path.test.ts:42-45` records this). Give that call Ilya's own paths, as `omr/underlay-recognize.ts:36-42` and `:108-113` do for the scan reader: the worker and core that step 0b serves, and the same `rus` model the photo path reads today, served from Ilya's site. DESK DEFAULT: the model does not change, so what the photo path reads does not change. Report the model's bytes beside the fonts' (CONTRACT §8). Done when the HEIC path reads a picture in Playwright with no request to any outside host.

Then remove the three outside hosts from `vercel.json:37` and move the pin at `lib/vercel-headers.test.ts:38-41`, which lists the four origins today and lists none after this step. The header is `Content-Security-Policy-Report-Only`: a host left out is reported, not blocked, so the pin is the check.

### Step 7. Two Playwright faults

- `e2e/poem-library.test.ts:38` presses `Control+V`, which pastes nothing in Chromium on a Mac: use `ControlOrMeta+V`, and correct the comments at `:11` and `:33`. The same file presses `Control+A` (`:178`) and `Control+End` (`:225`, `:239`), and `e2e/glue-typed-marks.test.ts:46` presses `Control+z`: use `ControlOrMeta` for each that selects, pastes, or undoes, and report what `Control+End` does on a Mac.
- `e2e/singer-paths.test.ts:180` expects « La diction lyrique russe pour chanteurs » (the unit test `components/Reading/learn-opening.test.ts:18` already pins the right title); the title is « La diction lyrique russe pour chanteuses et chanteurs » (`components/Reading/LearnContent.svelte:20`).

### Step 8. The Roberge guard test

A test that fails if any French interface string, the French GUIDE, or the French LEARN names a pitch in solfège with an octave number (do3, ré4, la3, and the rest, with or without accents and with or without a space). Code comments are exempt.

### Step 9. Dead strings (L57, L59)

- Row 155 left 24 `upload.*` keys unread (QUEUE row 155). Remove every `upload.*` key no code reads, and list each removed key with its English in the report. DESK DEFAULT. Count readers with a search that skips comments: five keys are named UNUSED in comments (`i18n.ts:830-831`, `score/ScoreUploader.svelte:145-147`), and a plain grep finds those comments. Report the count before removing.
- Remove `station.startOver` (`i18n.ts:1729`) and `loupe.undo.startOver` (`:510`) if no code reads them, with their comments (`:508-509`, `:1314`) and the test fixture at `i18n.test.ts:61`.
- `restoreFrom`'s `page` parameter (`+page.svelte:3240`, called at `:3118` and at `:3252`), unused per QUEUE row 155: remove it from the function and from both calls if no line in the function reads it.
- `insights.fit.*`: add one comment saying why the keys keep the old name.

### Step 9b. The Licences paragraph names the poem sources

Ratified by Dann 2026-11-11 23:02 (EN) and 23:03 (FR), `docs/memory/OPEN.md`, LICENCES AND ACKNOWLEDGMENTS: THE POEM SOURCES. Insert the new sentences at the start of the Texts paragraph, before the LiederNet sentence, in English (`components/Reading/GuideContent.svelte:585`) and French (`:289`). *Ilya* in italics as elsewhere in the section; in French, a no-break space before the colon and inside the guillemets. Pin both in a test.

### Step 10. The audit for contributors (L58), report only

List, without deleting: exported symbols nothing imports, files nothing imports, packages in a `package.json` nothing imports. One table, each with its path and line. Nothing beyond step 9 is removed in this lane.

### Step 11. Two checks, report only

- `e2e/pages-without-gaps.test.ts:227` fails in the cloud sandbox (INSIGHTS prints 1 page against 2 sheets). Run it in CI and report the result there.
- N.17 ("viewport repair", numbered 2026-08-10; `docs/memory/STATE.md` tracker: "three lines in the cloud lane, then one look on Dann's phone"). Its spec is not in the tree: `docs/memory/OWED.md:698` points to the project file `claude/e38-handover_v1_2026-08-10.md` §10, read by the desk 2026-11-12. It says: N.17's four anchors are present, but the viewport meta has no `viewport-fit=cover`, so `env(safe-area-inset-*)` is zero on every iPhone; N.17 had no observed symptom. Today `app.html:37` is still `width=device-width, initial-scale=1`; four `safe-area-inset` uses remain in `.svelte` and `.css` files; three `100vh` remain (`routes/+layout.svelte:15`, `routes/+page.svelte:5396`, `:5401`). Report, building nothing: a phone capture at 390 × 844 with and without `viewport-fit=cover`, which of the four insets then takes a value, and whether each `100vh` hides content under the browser's address bar.

### Step 12. Close

Merge `Shane` into the lane, run all eight gates and the Playwright suite (desktop and phone), and write the final report: the gate counts against step 0's, every string changed (old and new), the bytes of the poem file and of `static/fonts/`, and the screenshot differences.

## Computations this lane changes (CONTRACT §4)

- Step 0b computes nothing; it serves files.
- Step 1 changes what "calibrated" means for the Drawer's anchor and the Voice band's state line; the other sites are named in step 1.
- Step 5 changes "is this word Latin" in the app (`latin.ts:69-72`) and in the builder (`build-poem-library.mjs:110`, `:119`, from `:122`); `VerseLine.svelte:26-28` depends on the app's test. Both now share one definition.
- No other number is computed differently.

## What the desk could not establish

- Chrome's French label for View More and for Add to Home Screen (not seen; « Afficher plus » is the desk's coinage, ratified by Dann).
- Whether the `rus` model loads with the core named by file (`tesseract-core-simd-lstm.wasm.js`); step 6's Playwright read settles it.
- The bytes of the self-hosted `rus` model.
- What MELODY shows for a voice whose readings are all refused.

## Amendments from Fable's review, part of this brief

Source: `review-fable-three-briefs-r2_r1_2026-11-12.md` (Fable, 2026-11-12; 16 amendments), filed beside this brief. Applied by the desk as written, DESK DEFAULT on each, except where marked. **Where an amendment and a step's text disagree, the amendment wins.** Numbers are Fable's. Each names the step it changes.

1. **Step 0b: scans kept while the files were missing stay wordless.** A reading is kept under the current stamp whether or not the words were read (`omr/scan.ts:98`; a page that answers null takes no words, `omr/underlay-song.ts:4-5`). `UNDERLAY_READER` has been part of the stamp since 2026-11-09 (`omr/stamp.ts:27-31`, `:50`), so every scan read on the alias since then is kept as current, with no words, and is never read again (`omr/restore.ts:41`). Add to step 0b's Change list:
   > 4. Move `UNDERLAY_READER` to `'underlay@6'` (`omr/stamp.ts:50`) and add one sentence to its comment: `underlay@6` reads nothing differently; it marks that the reader's files are served, so a scan kept while they were not is read again once. Move the pins in `omr/stamp.test.ts`. RULED by Dann 2026-11-11 23:37: "Yes, every scan read since 2026-11-09 should be read again once, so that it gets its words." Build it.
2. **Steps 0b and 6: licence texts for what Ilya now serves.** Ilya will serve tesseract.js's worker, its core, and a Tesseract model from its own origin. `NOTICES.md` names none of them (its "Dependencies" section begins at line 49 and lists the scan reader only); the HEIC decoder's licence is served beside it (`static/sw.js:39`). Add to step 0b:
   > 5. The copy script also copies each package's `LICENSE` into `static/omr/models/underlay/` (`LICENSE-tesseract.js.txt`, `LICENSE-tesseract.js-core.txt`), and `NOTICES.md` gains an entry under "Dependencies" for tesseract.js, tesseract.js-core, and (step 6) the `rus` model, each with its version and the licence its own package states. Report the licence text each package ships; write nothing from memory.
3. **Step 1: the band's name half does not change.** The brief says the band's "voice half prints only when the anchor's named line does". Today a named voice with no readings prints "Voice: Dann" in the band while the anchor says "Voice: not yet calibrated" (`components/Drawer/bandState.test.ts:207-209`, `VoiceAnchor.svelte:40-42`). The brief's wording would blank the band for every newly named voice, which no ruling asks for. Replace the bullet's last two sentences with:
   > It follows the anchor in its count only: the count is of usable readings, so a voice whose readings are all refused prints "Voice: {name}" with no count, as a named voice with no readings does today (`bandState.test.ts:207-209`, which stays).
4. **Step 1: one helper, and the further comments.** Add:
   > Put the count in one function beside `hasAnyReadings` (`voice/profileStore.ts:175`), for example `usableReadingCount`, read by both `+page.svelte:1646` and `:1731`. `+page.svelte` is 5515 of 5534. Also correct `VoiceAnchor.svelte:17-20` and `:27`, and `bandState.ts:226-230`, which describe the old rule.
5. **Step 2: where the label comes from.** `singerBlocks` has no voice type: `BlockInputs` carries `generic` and `language` only (`insights/singer-blocks.ts:84`, `:113-114`). Its one caller is `insights/InsightsPane.svelte:348`, a file at its ceiling (744 of 744, `scripts/ratchets.json`). Add to the third bullet:
   > `BlockInputs` gains an optional label (the string `voiceTypePrint` returns), passed at `InsightsPane.svelte:348` at no net cost in lines (744 of 744). Where the label is undefined ("Not sure" with no typed text, `voice/voiceTypes.ts:89`), the line keeps `insights.r2.vowels.against`, as `genericLede` prints nothing in that case (`insights/identity.ts:52`).
6. **Step 3: a fourth pin.** `components/install-prompt-gate.test.ts:34-36` matches the render expression `isChrome ? (t.ios_chrome_body ?? '') : t.ios_body` in the source. Add:
   > Keep that expression as written and wrap it (for example `withGlyph(isChrome ? (t.ios_chrome_body ?? '') : t.ios_body)`), so the pin at `install-prompt-gate.test.ts:34-36` still matches.
7. **Step 4: the fixtures, and the new file's name.** Add to the Tests bullet:
   > Every fixture that builds a libretto entry gains the two fields: `text/poem-library.test.ts`, `text/poem-source.test.ts`, `text/poem-offer-metadata.test.ts`, `tests/build-poem-library.test.ts`.

   Add to the Rebuild bullet:
   > The rebuilt file has a new hash in its name, and `.gitignore:12` ignores `data/dictionary.*.json`; the present file is tracked only because it was added by force. Add the new file with `git add -f`, remove `data/dictionary.poems.d77d09cd.json` with `git rm`, and confirm `data/dictionary-manifest.json` names the new one.
8. **Step 5, item 1: the app does not get a new tokenizer.** The app's word is the whitespace token with punctuation and dashes removed (`pipeline.ts:586`, `:671`), so «peut-être» is one `cleanWord`. A second definition inside `latin.ts` would disagree with it, and the builder is a plain `.mjs` that cannot import the app's TypeScript. Replace item 1 with:
   > 1. One test of a Latin word: at least one letter, and every `\p{L}` in it is `\p{Script=Latin}`. The app applies it to `cleanWord` as it stands (`pipeline.ts:586`, `:671`); it does not split words again. The builder applies it to each run of `[\p{L}\p{M}]`. The two copies are held equal by one test that runs the same word list through both («à», «cœur», «et», «мeня» with a Latin e, «c», «amen»).
9. **Step 5, item 2: the look-alike guard, and the builder's pins.** "Between Cyrillic words" misses a look-alike at a line's start or end («C тобой» with a Latin C). Replace the second guard with:
   > a one-letter Latin word in a line that also holds a Cyrillic word is refused (a look-alike typed for a Russian word). Add the test «C тобой» with a Latin C: fails.

   And add:
   > Move the builder's pins: `tests/build-poem-library.test.ts:176` (the fault table's Latin row, which stays a fault as a glued letter) and `:384-387`, where `textFault(quoted)` for a poem is pinned to `'a Latin letter'` and now passes. `textFault`'s second parameter (`scripts/build-poem-library.mjs:122`) goes if nothing needs it.
10. **Step 5, item 4: its scope, and the computations list.** `markLatinWords` sees the lines of one `processText` call (`pipeline.ts:487`), and several callers pass less than a song (`underlay-seams.ts:59`, `text/poem-join-wire.ts:34`, `score/vowel-resolver.ts:476`, `score/clitic-seat.ts:491`). Add to item 4:
    > "The song's text" is the lines of one `processText` call. Report, for «Семинарист» as a seated song, whether MELODY and INSIGHTS still show the table's IPA (they take Lyrics' transcription), and name any caller whose text is too short to hold two nouns.

    Add to "Computations this lane changes": "Step 5 also changes which Latin words carry IPA (`latin.ts:75-78`, item 4); its one reader is `markLatinWords`, and the Richter credit follows it (`latin.ts:99-101`)." Add to item 5: "`NOTICES.md:17-28` says the pronunciation is Richter's; do not edit it in this lane; report it as owed with the footer's wording."
11. **Step 6, the photo path: name the model and the cost.** Replace "the same `rus` model the photo path reads today, served from Ilya's site" and the two sentences after it with:
    > the model the photo path reads today: `4.0.0_best_int/rus.traineddata.gz` of `@tesseract.js-data/rus` 1.0.0 (2,679,598 bytes, md5 `9c66849e0afcfd659d613e71695d6f1c`; `tesseract.js/src/worker-script/index.js:130`). Add the package to `apps/web/package.json` at exactly `1.0.0`, and have `copy-underlay-model.mjs` copy the file, as it is, to `static/omr/models/underlay/rus.traineddata.gz`. Pass `workerPath`, `corePath`, and `langPath` only (from `recognizerPaths`, `omr/underlay-recognize.ts:36-42`); keep tesseract's defaults for `gzip` and `cacheMethod`, so the model is unpacked and kept on the device as it is today. Do not pass `gzip: false` or `cacheMethod: 'none'`. `ScoreUploader.svelte` is at its ceiling (867 of 867): the call's options come from one imported helper, and step 9's removal of the comment at `:145-147` pays for any line. Rewrite `e2e/heic-reader-path.test.ts:41-60` (`serveOcrLocally` and its jsDelivr route), which the change makes dead. DESK DEFAULT: the core is the SIMD core named by file, as for the scan reader; a browser with no WebAssembly SIMD then cannot start the photo read. Report whether such a browser reaches this path today (the page reader runs before it). The desk tells Dann 2,679,598 bytes before the ship (CONTRACT §8).
12. **Step 6, the fonts: which files.** Google serves these families as variable files cut into `unicode-range` subsets; Source Serif 4 carries an optical-size axis (`app.html:49`, `opsz 8..60`), and the underlay width table was measured from Google's own files (`packages/score-parser/src/underlay-widths.ts:46-57`). A different cut moves layout. Add:
    > Take the files Google serves today: fetch the two stylesheets (`app.html:49`, `+page.svelte:3675`) with a current Chrome user agent, download every woff2 they name, and keep their `@font-face` blocks unchanged (family, style, weight range, `unicode-range`, `font-display: swap`) with the URLs pointed at `static/fonts/`. List each file with its source URL, bytes, and sha256. If the lane cannot reach Google's hosts, stop and report; do not substitute another build of the fonts. GUIDE's Fonts sentence (`GuideContent.svelte:589` EN, `:302` FR) gains the four families, RATIFIED by Dann 2026-11-11 23:38. Replace the tail of each from Lato on. EN: "…; Lato, © 2010–2014 tyPoland Łukasz Dziedzic; Source Sans 3, © 2010–2020 Adobe; Source Serif 4, © 2014 The Source Serif 4 Project Authors; Noto Sans, © 2022 The Noto Project Authors; and Noto Serif, © 2022 The Noto Project Authors." FR: « …; Lato, © 2010–2014 tyPoland Łukasz Dziedzic; Source Sans 3, © 2010–2020 Adobe; Source Serif 4, © 2014 The Source Serif 4 Project Authors; Noto Sans, © 2022 The Noto Project Authors; et Noto Serif, © 2022 The Noto Project Authors. » The rest of each sentence is unchanged, its no-break space before the French colon included. Copyright lines from each font's `OFL.txt` as Google Fonts ships it (desk read 2026-11-11 23:3x); ship those four `OFL.txt` files in `static/fonts/`. Pin both sentences.
13. **Step 7: three presses in the phone suite.** Add: "`e2e-phone/text-witness.test.ts:80` (`Control+V`), `e2e-phone/relining.test.ts:88` (`Control+z`) and `:118` (`Control+End`) take the same treatment."
14. **Step 8: keep the guard from firing on ordinary French.** « la 2e », « si 3 mesures » would match a loose pattern. Add: "The octave digit is 0 to 8 and is not followed by a letter, a digit, or an ordinal mark; a name is matched as a whole word. Where a real sentence still trips the test, list it by file and line in the report; do not reword ratified text to pass."
15. **Step 9b: the glyphs follow the file.** `OPEN.md:3692-3693` holds the words with straight quotes and plain spaces. GUIDE uses ’ and “ ” in English (218 and 4 uses) and a literal U+00A0 before colons and inside guillemets in French (`GuideContent.svelte`, read as bytes). Add: "English takes ’ and “ ” as the section does; French takes U+00A0 as a literal character, not `&nbsp;`. « d’<em>Ilya</em> » keeps the apostrophe outside the italics."
16. **L17's place in this lane.** L17's brief (`brief-code-l17-insights-label_r3_2026-11-12.md`) rides here: its step 1 (measure) runs with step 0 and is reported there; its step 2 (fix) runs after step 11 and before step 12, only if the desk has answered its measure. If not, this lane closes without it.
