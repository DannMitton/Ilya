# Brief r1: the name a saved or printed page takes (QUEUE row 137)

2026-11-27, written by the desk (Opus 5) for Code. Branch: cut from `Shane` at `79d6d18e` or later.
Serves QUEUE row 137. **Fable review owed before this ships.**

## What a singer meets, and why this lane exists

She prints MELODY for her lesson, then TEXT for her coach, then INSIGHTS for herself, and her browser proposes the
same filename all three times. Dann found it himself on 2026-11-26 at 23:07 and said: *"Oh no! I thought it already
worked like this"*. A singer who keeps a growing library of printed and saved pages cannot tell them apart.

## What is true today, read from the tree 2026-11-27

- **Nothing sets `document.title`.** A grep of `apps/web/src` for `document.title` returns nothing.
- **So every page inherits the one in the markup:** `apps/web/src/app.html:45`, `Ilya — Russian Lyric Diction`. That
  is what the browser proposes as the filename for a print to PDF and for a save.
- **Two places print:** `routes/+page.svelte:2167` and `lib/voice/chart/print-sheet.ts:46`, both `window.print()`.
- **The page already knows how to name itself for a reader:** `formatRunningHeader(composer, title, poet)`
  (`lib/page-config.ts:188`) builds the running header, taking the composer's surname through `extractSurname`
  (`:196-197`) and uppercasing the title (`:193`). It returns an empty string where there is no title (`:189-191`).

## What Dann ruled

2026-11-26 23:07, transcribed as written: *"Yes make it so. Yes the recorded default should be TEXT MELODY and
INSIGHTS and similarly updated for the correct French terms we chose"*.

**So the name is `Composer - Title - the page's name`**, and the page's name is TEXT, MELODY, or INSIGHTS in English
and « TEXTE », « CHANT », or « APERÇUS » in French, which are `tab.text`, `tab.markedScore`, and `tab.insights`
(`apps/web/src/lib/i18n.ts:210`, `:228`, `:232`, read 2026-11-26).

**The desk default this replaces named "Text, Markup, or Insights" and was stale**: the tab has read MELODY since
row 170 closed.

## Scope

**In:** `document.title` while a score is open, on all three documents, in both languages, and what it falls back to.

**Out:** the running header itself; the printed page's layout; the vowel-space sheet's own print path
(`print-sheet.ts`), which prints a sheet and not a document; row 134's printed colours; any new control.

## Steps

### Step 1, the title follows the document on screen

`document.title` becomes `Composer - Title - <page name>`, where the page name is the document the singer is looking
at, taken from the same key the tab shows, so it is already translated. **It changes when she changes tab**, because
a save or a print proposes the name at the moment she asks, not the name from when the song opened.

**The composer's form is the running header's:** the surname alone, through `extractSurname` (`page-config.ts:196`),
so a page reads `Alyabyev - Solovey - MELODY` and not the full name from the file. **The title is NOT uppercased**,
unlike the running header: a filename in capitals reads as shouting in a folder listing, and the uppercase at
`page-config.ts:193` is a typographic choice for the printed page, not a naming one. **Flag for the review: this is
the desk's reading of his ruling and not his words; he wrote `Composer - Title - the page's name`.**

### Step 2, the fallbacks, named rather than guessed

A filename cannot be empty and must not read as broken. In order:

1. **No title:** the song has no title in its file and none typed. `formatRunningHeader` returns an empty string in
   this case (`:189-191`). The lane reports what Ilya shows in the title block today for such a song and names the
   fallback from it rather than inventing one.
2. **No composer:** the name drops the composer and its separator, never leaving a leading dash.
3. **No score open at all:** the blank state. The title stays `app.html`'s `Ilya — Russian Lyric Diction`.

### Step 3, the characters a file system refuses

A title can carry `/`, `:`, or a line break, any of which breaks or silently mangles a filename on macOS, Windows, or
Linux. The lane replaces them with a single space and collapses runs of whitespace. **Cyrillic, the pre-reform
letters, accents, and the no-break space are left exactly as they are**: they are legal in a filename on every system
Ilya runs on, and a singer's Russian title is the point of the name.

### Step 4, the French is the tab's own string

No new string is written in either language. The page name comes from `tab.text`, `tab.markedScore`, and
`tab.insights`, so when the app is in French the name reads « TEXTE », « CHANT », « APERÇUS » with no further work,
and a later rename of a tab carries through by itself.

## The numbers this lane changes, and every other site that computes them

`CONTRACT.md` section 4. The thing computed is **the name a page carries**, and the sites are:

| site | what it does | this lane |
|---|---|---|
| `app.html:45` | the static `<title>` | unchanged; it stays the blank-state and no-score name |
| `lib/page-config.ts:188` `formatRunningHeader` | the running header's composer and title | **unchanged**; step 1 reuses `extractSurname` and does not alter the header |
| `routes/+page.svelte:2167` | `window.print()` on the document | unchanged; it reads whatever `document.title` holds |
| `lib/voice/chart/print-sheet.ts:46` | `window.print()` on the vowel-space sheet | **out of scope, and the lane says in one line what the sheet's print proposes as a name, so a later row can take it** |

**What depended on them agreeing:** nothing reads `document.title` today, because nothing writes it. **The new
dependency this lane creates is that the filename and the running header name the same song by the same rule**, so a
change to `extractSurname` moves both. The lane says so in a comment at the site.

## The grep that was run before proposing this

`CONTRACT.md` section 4. Run 2026-11-27 in `apps/web/src`: `grep -rn "document.title"` across `.ts` and `.svelte`,
which returns nothing, and `grep -rn "window.print\|print()"`, which returns the two call sites above. **Nothing in
the tree names a page today, so nothing is rebuilt.**

## Done when

1. **With a score open, printing to PDF from each of the three documents proposes three different filenames**, each
   reading `Composer - Title - <page name>`, looked at in the browser's own print dialogue and not in the source.
2. **The same three in French read « TEXTE », « CHANT », « APERÇUS »**, with the app in French.
3. **Switching tabs changes the proposed name without a reload.**
4. **A song with no title, and a song with no composer, each propose a name that is not empty and carries no stray
   dash**, with the fallback the lane reported in step 2.
5. **A title carrying `/` or `:` produces a filename the system accepts**, tested on at least one such title.
6. **With no score open the title is unchanged** from today.
7. All eight gates at baseline on the Mac; any baseline moved is reported with both figures.

## What could not be established

- **What Ilya shows in the title block for a song with no title.** Step 2 reports it before naming a fallback.
- **Whether a browser's save-page path uses `document.title` the same way its print path does** on every browser
  Dann walks. The lane reports what Chrome does and names the rest NOT ESTABLISHED.
- **Whether any singer-facing string anywhere promises a filename.** None was found, but the search was of
  `document.title` and the print sites, not of every string.

**NOT ESTABLISHED beats a complete invented answer.**

## Reporting

One report, written to `docs/sessions/` by the lane itself. Commit nothing.
