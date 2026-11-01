# Report: row 163, step 7 (the Poem field's words)

2026-11-01, Code (Sonnet), branch `mac-row163`, on `af1bacbb`. Review amendments 16, 17, 18, and 23 applied; the brief's 14:49 empty-state line was superseded by the 20:38 replacement (amendment 18).

## What changed

- `i18n.ts`: `intake.placeholder` EN "Paste, type, or drop the published poem here." (ratified 14:49), FR « Collez, saisissez ou déposez le poème publié ici. » (14:51). `intake.view.landedLyrics` EN "Your score supplied the words in Lyrics. Add the whole published poem here to see where the song departs from it.", FR « Votre partition a fourni les paroles du champ Paroles. Ajoutez ici le poème publié en entier pour voir où la mise en musique s’en écarte. » (ratified 2026-10-30 20:38). The apostrophe in « s’en » is the escape `’`, as the file's French writes it (`intake.placeholderLyrics`); the ratified words are unchanged (amendment 23).
- `ratified-lines.test.ts`: the pins for both keys updated in the same commit (amendment 17).
- **Where the line shows** (amendment 16, DESK DEFAULT, reversible): new `text/input-line.ts` (`introLine`), called from `IntakeViews.svelte`. `landedLyrics` shows only while the view is Poem, Poem is empty, and Lyrics holds the score's words (`scoreWords`, `IntakeViews.svelte`'s prop), whether or not a file was just dropped, so a reopened song shows it too. Under Lyrics the line is `lyricsLine`. `landedPoem` still shows after a page that read as a poem, in either view. `input-views.test.ts` (which asserts `landed`) is green and unchanged.
- `input-line.test.ts` (5, new).

## `intake.placeholder`: who else uses it

Only the Poem field: `IntakeViews.svelte` reads it when `view === 'poem'`. No other field uses the key (grep over `src`; the Lyrics field uses `intake.placeholderLyrics`).

## French beyond the ratified strings

None. The two ratified French strings above are the only French touched. Each row is English, old French, new French:

| English (new) | Old French | New French |
|---|---|---|
| Paste, type, or drop the published poem here. | Collez, saisissez ou déposez votre poème ici. | Collez, saisissez ou déposez le poème publié ici. |
| Your score supplied the words in Lyrics. Add the whole published poem here to see where the song departs from it. | Les paroles chantées de votre partition sont dans le champ Paroles. Collez ou saisissez ici le poème publié, en entier. | Votre partition a fourni les paroles du champ Paroles. Ajoutez ici le poème publié en entier pour voir où la mise en musique s’en écarte. |

(Both are ratified text with their pins; `CONTRACT.md` §1 item 11a lets them land with this step, so they are in this commit and not a separate French commit.)

## Not established

- Whether `scoreWords` (`IntakePanel.svelte:377`, `poemDerived`) is true in every case the line should show; I read the prop's definition ("the field is showing the score's derived words") and its single call site, and did not walk each arrival path. Not seen on the live page.
- The line is a single wrapped `<p>`; its length in French on a phone was not measured.

## Gates

| Gate | Before this step | Now |
|---|---|---|
| 3 web check | 0 errors, 12 warnings, 5 files | same |
| 4 web test | 3749 | **3754 passed, 1 skipped (3755)** (+5) |
| 8 ratchets | OK | OK |
