# BRIEF TO CODE. N.78 build: the French display form of composers and poets

Serves N.78. Ruled by Dann 2026-08-21: DISPLAY ONLY. Authority ruled by Dann
2026-08-23: French Wikipedia article titles, one source for all 62. Research
memo: `docs/sessions/memo-n78-french-name-forms_r2_2026-08-23.md`. The BnF
pass, `memo-n78-french-name-forms_r1_2026-08-23.md`, is superseded for the
French column and is not an input to this build.

Floor: `0f034ab`. Every anchor below was read on that commit. Trust the name
over the number if they disagree.

## What this changes, in one paragraph

A song stores its composer, poet, and translator as a string, and every song
already saved stores the English form. That stays so forever. When the
interface is in French, the dropdown and the paper draw the French form of a
known name instead; when the name is not in the list, or has no French form,
they draw whatever is stored. Picking from the dropdown writes the English form
whatever the language. Nothing in storage changes shape.

## The tree, as read

- `apps/web/src/lib/composers-poets.ts`. `PersonEntry` at `:8` has `latin`,
  `cyrillic`, `dates`. `COMPOSERS` at `:14`, `POETS` at `:42`.
  `formatNameForPaper(raw, list)` at `:102` matches a stored string against
  three forms of each entry and returns `formatForPaper(entry)`, the English
  `Given Surname (dates)`. `formatPersonDisplay` follows it.
- `apps/web/src/lib/components/Drawer/SearchableSelect.svelte`. Filter at
  `:25-32` matches `latin` and `cyrillic`. `selectedEntry` at `:35-37`.
  `displayText` at `:40-44`. **`selectEntry` at `:86-89` writes
  `formatForPaper(entry)`: this is the line that must not change meaning.**
  The component already receives `language` (passed from
  `MetadataFields.svelte:118`).
- `apps/web/src/lib/components/Drawer/MetadataFields.svelte`. Three
  `SearchableSelect` sites: composer `entries={COMPOSERS}` at `:115`, poet
  `entries={POETS}` at `:127`, translator `entries={POETS}` at `:139`. **The
  translator draws on `POETS`, so it is covered by the table.**
- `apps/web/src/lib/components/Paper/TitlePage.svelte`. Already receives
  `language` (`:16`, `:32`). `composerDisplay`, `poetDisplay`,
  `translatorDisplay` at `:49-51` call `formatNameForPaper` with no language.
- `apps/web/src/lib/metadata-provenance.ts:74-76`. Same three calls, no
  language. Read what consumes its output before touching it: if that output
  is ever stored, it must stay English.

## The build

1. In `composers-poets.ts`, add an optional `french?: string` to `PersonEntry`,
   in `Surname, Given` form, on exactly the 49 entries in the table at the
   end. Entries without a French form get no field. Do not change `latin`,
   `cyrillic`, or `dates` on any entry. Two rows disagree with Wikipedia on a
   year by the Julian calendar (Balakirev, Nekrasov); leave them.
2. Add a display helper that takes an entry and a `Language` and returns
   `Given Surname (dates)` built from `french` when the language is French and
   the field exists, else from `latin`. Give `formatNameForPaper` and
   `formatPersonDisplay` an optional trailing `language` parameter that routes
   through it. With no language, behaviour is unchanged byte for byte.
3. In `SearchableSelect.svelte`: the filter also matches `french`; the list
   rows and `displayText` draw through the helper with `language`;
   **`selectEntry` still writes `formatForPaper(entry)`, the English form.**
   Add a test that pins this: select an entry with the language set to French
   and assert the value handed to `onchange` is the English form.
4. `TitlePage.svelte:49-51` pass `language`. `metadata-provenance.ts:74-76`
   pass the language only if the result is display-only; if it reaches
   storage, leave it English and say so in the memo.
5. The Guide's French prose says `Moussorgski`. Leave it. After this build the
   dropdown says the same thing in French, which is the defect N.78 was
   numbered for.

## Done when

- Five gates at baseline: 216, 235, 0 errors and 7 warnings in 4 files, 682,
  444 passed and 5 skipped, plus the new test.
- In French, the composer dropdown lists `Modeste Moussorgski (1839–1881)`;
  picking it stores `Modest Mussorgsky (1839–1881)`; the title page draws
  `Modeste Moussorgski (1839–1881)`. Switching the pill to English redraws the
  same song as `Modest Mussorgsky (1839–1881)` with no reload and no write.
- A song saved before this build, reopened in French, draws the French form.
  A custom entry draws unchanged in both languages.
- Typing `Pouchkine` in the French poet search finds Pushkin.
- Byte count of the built bundle before and after, stated.

## Do not

- Do not write a French form to storage, anywhere.
- Do not add, remove, rename, or re-date any entry.
- Do not touch `lib/shane/`, `VocalLineEvent`, or the Guide's prose.
- Do not coin a French form for any entry not in the table.

## Return memo

`docs/sessions/memo-n78-build-french-display_r1_<date>.md`: every anchor
touched with `path:line`, the five gate numbers, the test name, the bundle
byte count, and a section titled `What I could not establish`.
**NOT ESTABLISHED beats a complete invented answer.**

## The table: 49 French forms

Source: French Wikipedia article title, converted to `Surname, Given`,
patronymic dropped. Entries absent here have no `french` field: Bulakhov,
Titov, Golenishchev-Kutuzov, Rathaus (no French article); Goethe (title is
the bare surname); Galina (title is the pen name doubled); Cui, Rubinstein,
Stravinsky, Akhmatova, Heine, Pasternak, Shakespeare (same in French).

| latin | french |
|---|---|
| Arensky, Anton | Arenski, Anton |
| Balakirev, Mily | Balakirev, Mili |
| Borodin, Alexander | Borodine, Alexandre |
| Dargomyzhsky, Alexander | Dargomyjski, Alexandre |
| Glazunov, Alexander | Glazounov, Alexandre |
| Glinka, Mikhail | Glinka, Mikhaïl |
| Gretchaninov, Alexander | Gretchaninov, Alexandre |
| Gurilev, Alexander | Gouriliov, Alexandre |
| Kabalevsky, Dmitri | Kabalevski, Dmitri |
| Medtner, Nikolai | Medtner, Nikolaï |
| Mussorgsky, Modest | Moussorgski, Modeste |
| Prokofiev, Sergei | Prokofiev, Sergueï |
| Rachmaninoff, Sergei | Rachmaninov, Sergueï |
| Rimsky-Korsakov, Nikolai | Rimski-Korsakov, Nikolaï |
| Scriabin, Alexander | Scriabine, Alexandre |
| Shostakovich, Dmitri | Chostakovitch, Dmitri |
| Sviridov, Georgy | Sviridov, Gueorgui |
| Taneyev, Sergei | Taneïev, Sergueï |
| Tchaikovsky, Pyotr | Tchaïkovski, Piotr |
| Varlamov, Alexander | Varlamov, Alexandre |
| Apukhtin, Alexei | Apoukhtine, Alexeï |
| Balmont, Konstantin | Balmont, Constantin |
| Baratynsky, Yevgeny | Baratynski, Ievgueni |
| Bely, Andrei | Biély, Andreï |
| Blok, Alexander | Blok, Alexandre |
| Bryusov, Valery | Brioussov, Valéri |
| Bunin, Ivan | Bounine, Ivan |
| Delvig, Anton | Delwig, Anton |
| Fet, Afanasy | Fet, Afanassi |
| Gippius, Zinaida | Hippius, Zinaïda |
| Khomyakov, Alexei | Khomiakov, Alexeï |
| Koltsov, Alexei | Koltsov, Alexeï |
| Lermontov, Mikhail | Lermontov, Mikhaïl |
| Mandelstam, Osip | Mandelstam, Ossip |
| Marshak, Samuil | Marchak, Samouil |
| Maykov, Apollon | Maïkov, Apollon |
| Merezhkovsky, Dmitry | Merejkovski, Dimitri |
| Mey, Lev | Meï, Lev |
| Nekrasov, Nikolai | Nekrassov, Nikolaï |
| Pleshcheyev, Alexei | Plechtcheïev, Alexeï |
| Polonsky, Yakov | Polonski, Iakov |
| Pushkin, Alexander | Pouchkine, Alexandre |
| Shevchenko, Taras | Chevtchenko, Taras |
| Sologub, Fyodor | Sologoub, Fiodor |
| Tolstoy, Alexei K. | Tolstoï, Alexis K. |
| Tsvetaeva, Marina | Tsvetaïeva, Marina |
| Tyutchev, Fyodor | Tiouttchev, Fiodor |
| Yesenin, Sergei | Essénine, Sergueï |
| Zhukovsky, Vasily | Joukovski, Vassili |
