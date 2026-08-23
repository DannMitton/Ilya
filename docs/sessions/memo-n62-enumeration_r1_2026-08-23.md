# MEMO. N.62 enumeration: what still reaches a screen reader in English

Written 2026-08-23 by the desk (Fable), read-only against the tree at `2440bf5`.
Nothing built. Dann approves or strikes every French line before any of it
reaches the tree. Every proposed French word is marked coined or adopted.

## Method, and what could make it lie

Four greps over `apps/web/src`, all `.svelte` files: literal `aria-label`,
`aria-description`, `aria-valuetext`, `title`, `alt`, and `placeholder`
attributes; the same attributes bound with `{}` on a line that calls neither
`t(` nor `T(`; `visually-hidden` and `sr-only` elements with literal text; and
English literals assigned to label or caption variables in `lib/shane`.

What the instrument misses: a label built in script from an English literal on
a different line, and text a component receives as a prop. The register's count
of twenty-nine (E.43, E.44) was not reproduced. The Pacifier, NotePicker, and
wizard greps returned no English literals outside `t()` or `T()`, so N.35's
four captions and N.50's strings appear to be done since; NOT ESTABLISHED
whether twenty-nine was ever a tree count or a sum of three memos.

## The table. Invisible to a sighted user, English in both languages

| # | file:line | reaches | today | proposed en | proposed fr | status of the French |
|---|---|---|---|---|---|---|
| 1 | `Drawer.svelte:299` | the drawer landmark, `<aside aria-label>` | `Controls` | `Controls` | « Commandes » | coined |
| 2 | `Drawer.svelte:365, 384, 401, 419, 435, 454, 473, 520, 542, 561, 571, 582` | thirteen TOC chevron buttons, Learn and Guide | `Toggle` | `Expand or collapse` | « Déplier ou replier » | coined |
| 3 | `DeskHead.svelte:98` | the tab list landmark | `Navigation` | `Navigation` | « Navigation » | adopted, same word |
| 4 | `Paper.svelte:63` | the paper region landmark | `Transcription` | `Transcription` | « Transcription » | adopted, same word. NOTE: this region now also carries Fit, Learn, and Guide; whether `Transcription` is still the right name is a ruling, not a translation |
| 5 | `InspectorPanel.svelte:1039` | the gloss edit button | « Modifier le glose » | `Edit gloss` (unchanged) | « Modifier la glose » | correction; the register's third clause, still in the tree |

Rows 1 to 4 are one job: each string moves into `i18n.ts` under a key and the
site calls `t(key, language)`. Row 5 is one character.

## Already bilingual, left alone

`RootPanel.svelte:277-278`, `Drawer.svelte:343, 513`, and
`InspectorPanel.svelte:997` carry inline `language === 'en' ? … : …` ternaries.
Functionally correct. Moving them into `i18n.ts` is tidiness, not N.62; do it
only if Code is already in the file.

## Language-neutral, left alone

`HeaderBar.svelte:41` `Ilya 2026a` (a name). `InspectorPanel.svelte:1193`
`ё → е`. `CalibrationWizard.svelte:1123` `f R n`. `ProfileSwitcher.svelte:263`
`${name}, options`, where « options » is the same word in French; the comma
phrasing reads the same to a French screen reader. NOT ESTABLISHED: how a
French speech engine reads `f R 1`.

## Out of N.62, and bigger than it. Dann to rule

**`watchlist.ts:92` `WATCH_HEADER = 'Places to watch'` is VISIBLE and PRINTED
in English in French mode**, at `VoiceProfilePane.svelte:791`, and a test pins
the English at `watchlist.test.ts:262`. The entry lines from `watchEntryLine`
were not read and may be English too. This is printed copy on the Fit paper, so
it is a French-copy item with the same rule as every other: Dann sees the French
first. Recommended: number it, do not fold it into N.62.

## NOT ESTABLISHED

- Whether any label is built in script from an English literal the greps
  cannot see. A render-and-read with a screen reader is the only full test.
- Whether `watchEntryLine` prints English.
- Whether the register's twenty-nine was ever a count of the tree.

NOT ESTABLISHED beats a complete invented answer.
