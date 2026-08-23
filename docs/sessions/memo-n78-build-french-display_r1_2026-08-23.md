# MEMO. N.78 build: the French display form of composers and poets

Built against floor `0f034ab`. Brief:
`docs/sessions/brief-n78-build-french-display_r1_2026-08-23.md`.

Done. In French the dropdown and the paper draw the French spelling of a known
composer or poet. Storage still holds the English form, and nothing this build
added can write a French one.

**Gate 4 moved. It needs your permission before you ship.** 682 to 705, for the
23 tests in `composers-poets.test.ts`. The `sed` and the `chmod` are at the end
of this memo.

**`composers-poets.test.ts` is a new file, and `git add -u` will not stage it.**
The ship script commits with `git add -u`, which touches tracked files only, so
the test would gate at 705 on your machine and then be absent from the commit.
Stage it by hand first.

## Every anchor touched

`apps/web/src/lib/composers-poets.ts`

- `:9` imports `Language` from `./i18n`. `i18n.ts` imports nothing from this
  file, so there is no cycle.
- `:11-26` `PersonEntry` gains `french?: string`, in `Surname, Given` form,
  documented as display-only.
- `:28-54` and `:56-94` the 49 entries in the brief's table each gain a
  `french` field. `latin`, `cyrillic`, and `dates` are byte-identical on all
  62 entries. Verified by stripping the `french` field from every changed line
  in the diff and confirming the added and removed lines then match exactly.
- `:96-108` `proseWithDates`, new and private. It holds the
  `Surname, Given` to `Given Surname (dates)` conversion that `formatForPaper`
  used to hold inline, so that the English and French paths cannot drift.
- `:110-119` `formatForPaper` now calls `proseWithDates(entry.latin, …)`. It
  takes no language and its output is unchanged for every entry.
- `:121-130` `personNameForDisplay(entry, language?)`, new and exported. It
  returns the `Surname, Given` name a reader sees.
- `:132-141` `formatEntryForDisplay(entry, language?)`, new and exported. It
  returns `Given Surname (dates)` in the reader's language. With no `language`
  it returns exactly what `formatForPaper` returns, pinned across all 62
  entries by a test.
- `:143-183` `formatNameForPaper(raw, list, language?)`. Matching is untouched
  and still runs against the English forms only. All three match branches now
  return through `formatEntryForDisplay`. The third branch used to return
  `trimmed`, and its guard is `trimmed === formatForPaper(entry)`, so with no
  language the returned bytes are the same string.
- `:185-193` `formatPersonDisplay(entry, language?)` routes through
  `personNameForDisplay`. It has no call sites anywhere in the tree; it is
  exported and tested.

`apps/web/src/lib/components/Drawer/SearchableSelect.svelte`

- `:2-7` imports `formatEntryForDisplay` and `personNameForDisplay` beside
  `formatForPaper`.
- `:30-43` the filter matches `french` as well as `latin` and `cyrillic`.
- `:46-48` `selectedEntry` is unchanged. It matches `e.latin` and
  `formatForPaper(e)`, which are the only two forms that reach storage.
- `:50-59` `displayText` draws through `formatEntryForDisplay(selectedEntry,
  language)`.
- `:101-110` **`selectEntry` is unchanged.** It still calls
  `onchange(formatForPaper(entry), entry)`. A comment above it says why, and a
  test reads the source and fails if the word `language` appears inside the
  function body.
- `:234` the dropdown row's primary line draws through
  `personNameForDisplay(entry, language)`.

`apps/web/src/lib/components/Paper/TitlePage.svelte`

- `:48-56` `composerDisplay`, `poetDisplay`, and `translatorDisplay` pass
  `language` to `formatNameForPaper`. They are `$derived`, so the language pill
  redraws them with no reload and no write.

`apps/web/src/lib/metadata-provenance.ts`

- `:62-84` **left English, as the brief allowed for.** The three
  `formatNameForPaper` calls at `:80-82` pass no language. What
  `scoreHeaderAsFields` returns lands in `doc.metadata` through
  `applyScoreHeader` and `revertToScoreHeader`, both of which reach
  `commitMetadataState` at `+page.svelte:1604`, which calls
  `handleMetadataChange`. That is the persisted document, read back out of the
  `songs` store in `ilya-library`. This is a write, so it stays English. A
  comment at `:68-72` records the trace so the next reader does not have to
  redo it.

`apps/web/src/lib/composers-poets.test.ts`, new, 23 tests.

## The test name

`composers-poets.test.ts`, and the test the brief asked for is:

> selecting from the dropdown writes English, whatever the language
> › writes the English form for Mussorgsky while French is on screen

Two more tests in the same block carry the same invariant:

> › pins selectEntry to formatForPaper, which takes no language
> › stores the English form for every entry that has a French one

**Read the first of those three with your eyes open.** `vitest` never compiles
a `.svelte` file, so the component cannot be mounted and the click cannot be
simulated. That test reads `SearchableSelect.svelte` as text, asserts the line
`onchange(formatForPaper(entry), entry);` is present, and asserts that the body
of `selectEntry` contains neither `language` nor either display helper. A
source-text assertion is a weaker instrument than a mounted click. It is the
only instrument this project's test lane has, and the memo says so rather than
letting the count imply more than it proves.

## The five gates

Run on this machine on 2026-08-23, after every edit in this memo.

| gate | baseline | this build |
|---|---|---|
| phonology | 216 | 216 passed |
| dictionary | 235 | 235 passed |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |
| web-test | 682 | **705 passed** |
| score-parser | 444 passed, 5 skipped | 444 passed, 5 skipped |

Gate 4 is the only one that moved, by exactly the 23 new tests.

## The bundle byte count

Measured with a clean rebuild, `rm -rf apps/web/build apps/web/.svelte-kit/output`
before the second build, so no stale chunk is counted.

| measure | before | after | delta |
|---|---|---|---|
| all client JS under `build/_app` | 1,767,108 | 1,768,778 | +1,670 |
| whole `build/` tree | 203,304,716 | 203,306,388 | +1,672 |

The table itself lives in one chunk, which grew from 530,739 to 532,405 bytes,
a rise of 1,666. Its content-addressed name changed from `D3EOaTdB.js` to
`CmJiXklJ.js`. The whole-tree number is dominated by the shipped dictionary
JSON and is included only because the brief asked for the built bundle.

## What the browser showed

Driven at 1280×720 against `vite dev`, with a song whose composer, poet, and
translator were set through the drawer. Console clean, no errors.

- With the interface in English, picking Mussorgsky stored
  `Modest Mussorgsky (1839–1881)` in the `songs` store.
- Typing `Pouchkine` in the poet search filtered the list to the single row
  `Pushkin, Alexander`, with the interface still in English. Picking it stored
  `Alexander Pushkin (1799–1837)`.
- Switching the pill to French redrew the drawer triggers as
  `Modeste Moussorgski (1839–1881)` and `Alexandre Pouchkine (1799–1837)`, and
  the paper header as `MODESTE MOUSSORGSKI (1839–1881)` and
  `ALEXANDRE POUCHKINE (1799–1837) | UNE PERSONNE INCONNUE (TRAD.)`. Storage
  re-read after the switch was byte-identical. No reload, no write.
- With French on screen, the dropdown listed `Arenski, Anton`,
  `Balakirev, Mili`, `Borodine, Alexandre`, and `Bulakhov, Pyotr`. Bulakhov has
  no French form and drew as stored.
- Picking `Borodine, Alexandre` while French was on screen stored
  `Alexander Borodin (1833–1887)`. **This is the clause the whole build turns
  on, and the browser confirmed it.**
- Switching back to English redrew composer, poet, and paper as
  `Alexander Borodin (1833–1887)` and `Alexander Pushkin (1799–1837)`, with
  storage unchanged again.
- A full page reload with the pill on French drew the French forms from the
  English strings already in the `songs` store. That is the "song saved before
  this build, reopened in French" case: what the store held was written by the
  English path and is exactly what a pre-build save contains.
- The custom translator `Une personne inconnue` drew unchanged in both
  languages.

## One reading I had to settle

The brief's done-when says the French composer dropdown "lists"
`Modeste Moussorgski (1839–1881)`. That string is the trigger's format, not a
row's. A row draws `Surname, Given` on its primary line and
`Cyrillic · dates` on its secondary, and prose order with dates would put the
dates on the row twice.

I changed the spelling on the row and left its shape alone. The trigger now
reads exactly `Modeste Moussorgski (1839–1881)`, and the row reads
`Moussorgski, Modeste` over `Мусоргский, Модест · 1839–1881`. If you wanted the
rows themselves reshaped, that is a separate change and I did not make it.

## What I could not establish

- **Whether the source-text test would survive a refactor of
  `SearchableSelect.svelte`.** It matches the literal string
  `onchange(formatForPaper(entry), entry);`. Rename the callback prop, or
  reformat that call across two lines, and the test fails on a change that is
  harmless. It fails loudly rather than silently, which is the right direction,
  but it is a brittle instrument and I did not find a better one inside this
  project's test lane.
- **Whether any French form in the table is right.** I did not check one of
  them against French Wikipedia. The brief ruled the authority and supplied the
  49 rows, and I transcribed them. If a row is wrong, this build shipped it
  wrong. The transcription itself is verified: 49 rows in, 49 fields out, no
  duplicate `latin` key, no row matching two entries, and 13 entries left
  without a field, which are exactly the 13 the brief named.
- **Whether the two Julian-calendar disagreements matter to a reader.** The
  brief said to leave Balakirev's and Nekrasov's dates alone and I did. Nothing
  in this build touches `dates`, so a French reader sees the same year an
  English reader does, and French Wikipedia shows a different one for those two.
- **Whether `formatPersonDisplay` is reachable.** It has no call site in the
  tree. I gave it the optional `language` parameter the brief asked for and
  tested it, but nothing in the running app exercises it, so the browser could
  not confirm its behaviour.
- **What happens on iOS Safari.** Every browser observation in this memo is
  Chromium at 1280×720 on this machine. The changed strings are longer in
  French than in English on several entries, and the drawer trigger clips with
  `text-overflow: ellipsis`, so a narrow screen may ellipsize a French name
  that fit in English. I did not measure that on a phone.

## To ship

Stage the new test file, then move the gate 4 baseline, then run the ship
script.

```bash
git -C ~/Desktop/ilya-rewrite add apps/web/src/lib/composers-poets.test.ts
```

```bash
sed -i '' 's/682 passed (682)/705 passed (705)/' ~/Downloads/ilya-ship.sh && chmod +x ~/Downloads/ilya-ship.sh
```

The `chmod` is not optional. macOS `sed -i ''` rewrites the file rather than
editing it, and the replacement comes out without its execute bit.
