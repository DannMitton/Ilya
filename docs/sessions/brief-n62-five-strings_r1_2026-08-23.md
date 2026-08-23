# BRIEF TO CODE. N.62: the five strings that still reach a screen reader in English

Serves N.62, the accessibility sweep. French ratified by Dann 2026-08-23.
Floor: `b54be1a`. Read the enumeration first,
`docs/sessions/memo-n62-enumeration_r1_2026-08-23.md`. Its table is superseded
by the one here where they differ.

## The ratified table

Every French word here has been seen and ratified by Dann. Do not alter any
of it, and do not add French anywhere else.

| # | file:line at the floor | attribute | today | en | fr |
|---|---|---|---|---|---|
| 1 | `Drawer.svelte:299` | `<aside aria-label>` | `Controls` | `Controls` | `Commandes` |
| 2 | `Drawer.svelte:365, 384, 401, 419, 435, 454, 473, 520, 542, 561, 571, 582` | twelve `.toc-chevron` buttons, `aria-label` | `Toggle` | `Expand or collapse` | `Développer ou réduire` |
| 3 | `DeskHead.svelte:98` | `role="tablist" aria-label` | `Navigation` | `Navigation` | `Navigation` |
| 4 | `Paper.svelte:63` | `role="region" aria-label` | `Transcription` | `Transcription` | `Transcription` |
| 5 | `InspectorPanel.svelte:1039` | `aria-label` ternary | `Modifier le glose` | `Edit gloss` | `Modifier la glose` |

Correction to the memo: row 2 is twelve buttons, not thirteen. The memo's
line list had twelve entries and its prose said thirteen. `grep -c
'aria-label="Toggle"'` on `Drawer.svelte` at the floor returns 12. If you
find a thirteenth, say so in the memo; do not invent one.

No guillemets in the attribute values. The strings are spoken, not printed.

## The change

1. Add four keys to `strings` in `lib/i18n.ts`, in the existing `Drawer`
   block or a new `a11y` block, one comment naming N.62:
   `a11y.drawer` (row 1), `a11y.tocToggle` (row 2), `a11y.tabs` (row 3),
   `a11y.paper` (row 4). Rows 3 and 4 are identical `en`/`fr` values; key
   them anyway, the way `tab.transcription` already is, so parity stays
   total.
2. Rows 1 to 4: replace each literal with `t(key, language)`. `Drawer.svelte`
   and `DeskHead.svelte` already import `t` and receive `language`.
   `Paper.svelte` imports only `type Language` (`Paper.svelte:4`) and
   receives `language` (`Paper.svelte:14`); add `t` to the import.
3. Row 5: change `le` to `la` at `InspectorPanel.svelte:1039`. Leave the
   inline ternary as it is; moving it into `i18n.ts` is out of scope.
4. Assert every anchor before editing. Row 2 must match exactly twelve
   occurrences; refuse on any other count.
5. Tests: if a test pins any of the five English strings, update it. If
   none does, add one test in the existing i18n test file asserting the
   four new keys return their ratified `fr` values and never `[MISSING`.

## Done when

- Five gates at baseline. State gate 4's number before the ship script
  runs. Baseline at the floor is 724 (`ENVIRONMENT.md`).
- `grep -rn 'aria-label="Controls"\|aria-label="Toggle"\|aria-label="Navigation"\|aria-label="Transcription"\|le glose' apps/web/src` returns nothing.
- Bundle byte count before and after.

## Do not

- Do not change any visible text.
- Do not touch `watchlist.ts` or `VoiceProfilePane.svelte`; the English
  watch-band header is a separate item Dann has not numbered.
- Do not move the four `language === 'en' ? … : …` ternaries the memo lists
  under "Already bilingual".
- Do not run git. Dann ships with `sh ~/Downloads/ilya-ship.sh`.

## Return memo

`docs/sessions/memo-n62-five-strings_r1_<date>.md`: anchors with
`path:line` after the edit, the gate numbers, the test names, the byte
counts, the grep result, and `What I could not establish`. NOT ESTABLISHED
beats a complete invented answer.
