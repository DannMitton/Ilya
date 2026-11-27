# Brief r2: the name a saved or printed page takes (QUEUE row 137)

2026-11-27, written by the desk (Opus 5) for Code. Branch: cut from `Shane` at `79d6d18e` or later.
**Supersedes r1 (md5 `bc63c7d3`), which Fable returned DO NOT SEND on with five blockers and eleven amendments**
(`review-fable-brief-row137_r1_2026-11-27.md`, md5 `b7ea350a`). Four of the five were the desk's; the fifth is
answered below from the thread, which the review could not read.

## What a singer meets

She prints MELODY for her lesson, then TEXT for her coach, then INSIGHTS for herself, and her browser proposes the
same filename all three times. Dann found it on 2026-11-26 at 23:07: *"Oh no! I thought it already worked like this"*.

## His ruling, and what it settles

2026-11-26 23:07, transcribed as written: *"Yes make it so. Yes the recorded default should be TEXT MELODY and
INSIGHTS and similarly updated for the correct French terms we chose"*.

**The case is ratified and nothing is owed to him on it.** He was shown `Alyabyev - Solovey - MELODY`, in mixed case,
in the message he answered. Fable's blocker 5 read only the recorded default in `QUEUE.md`, whose wording "after the
running header's composer and title" implies capitals, and concluded a taste question was owed. It is not.

**One departure IS the desk's and is flagged, DESK DEFAULT, his to overrule:** his default says "while printing", and
step 1 sets the title for the whole time a song is open, so the word "Ilya" leaves the browser tab while she works.
That is singer-visible and he has not seen it. It is in the done-when so his look catches it.

## What is true today, every line read 2026-11-27

- **Nothing sets `document.title`** anywhere under `apps/web/src`: no assignment, no `svelte:head` title. Verified
  twice, by the desk and by Fable.
- **`apps/web/src/app.html:45`** holds `<title>Ilya — Russian Lyric Diction</title>`. **`QUEUE.md` row 137 cites
  `app.html:13` and that citation is stale**; corrected in the same pass as this brief.
- **Two places print:** `routes/+page.svelte:2167` and `lib/voice/chart/print-sheet.ts:46`. A third path is the
  browser's own menu, which r1 did not name.
- **`routes/+page.svelte` IS AT ITS RATCHET CEILING:** `scripts/ratchets.json:8` sets 5533 and `wc -l` returns 5533.
  **One added line fails the gate.** r1 did not mention it.
- **`extractSurname` RETURNS UPPERCASE** (`lib/page-config.ts:169-178`, `:173`, `:177`; its comment says so at
  `:167`). r1 sent the composer through it and printed `Alyabyev` as the example. The step as r1 wrote it would give
  `ALYABYEV - Solovey - MELODY`.
- **The tree already names files from songs, which r1 said it did not.** `lib/library/binder.ts:73`
  `binderFileName` replaces `\ / : * ? " < > |` and control characters with a space, collapses whitespace, strips a
  leading dot, and caps the result at 180 BYTES because Cyrillic is two apiece (`:74-85`), then appends the binder's
  extension at `:85`. `lib/library/songs.ts:44` `proposeName` holds the fallback chain already: composer and title,
  then title, then composer, then the source file's base name, then the first four words of the poem (`:45-54`), with
  `Untitled, <date>` from `songs.untitled` (`lib/i18n.ts:1761`, "Untitled" and « Sans titre »).
- **The state is reachable:** `destination` (`routes/+page.svelte:355`), `studioDocument` (`:356`), `activeTab`
  (`:357`), `language` (`:238`), and `doc.metadata` (`:1725`).
- **For a song with no title the page shows the placeholder "Aria or song title"** (`TitleHeader.svelte:162-168`,
  `i18n.ts:305`) and the PRINTED page carries no title at all (`TitleHeader.svelte:409-412`).

## Scope

**In:** `document.title` while a song is open in the studio, on all three documents, in both languages; its fallbacks;
the characters a file system refuses; and holding the static title for the length of the vowel-space sheet's print.

**Out:** the running header; the printed layout; the binder's own naming rule, which stays as it is; row 134's
printed colours; any new control; any new string in either language.

## Steps

### Step 1, the name, built where it can be tested

**The name is built by a pure function in its own `.ts` file with its own unit test**, not inline in
`routes/+page.svelte`, which is at its ceiling. The page gains the fewest lines that can call it, and the lane
reports how many and what it gave up to pay for them. The tree's own precedent is `lib/score/bar-layer.ts:7`.

The name is `Composer - Title - <page name>`:

- **The page name** is the document on screen, from the key its tab already shows: `tab.text`, `tab.markedScore`,
  `tab.insights` (`i18n.ts:210`, `:228`, `:232`), so the French needs no new work.
- **The composer is the surname, in mixed case.** `extractSurname` uppercases, so the lane adds a
  non-uppercasing sibling beside it in `page-config.ts` and **does not edit `extractSurname`**, because the running
  header depends on its uppercase. Both share the same stripping rules, so the filename and the header name the same
  person the same way.
- **The title is not uppercased.**

**The condition is a song with a title or a composer, read from `doc.metadata` (`+page.svelte:1725`), not "a score is
open":** TEXT needs no score, and a singer can type words and a title.

### Step 2, the fallbacks, taken from the tree and not invented

**DESK DEFAULT, from what already exists:** the lane uses `proposeName`'s chain (`songs.ts:44-54`) for the
composer-and-title part, so a page falls back the way a song already falls back, and `songs.untitled` where that
chain is empty. **No composer:** the name drops the composer and its separator, never leaving a leading dash.
**Off the studio, on LEARN or GUIDE** (`lib/destinations.ts:35`; she can still print them from the browser's menu,
`+page.svelte:4445-4446`), **the static title stands.**

**Restore, do not copy:** the lane reads `document.title` once at start and puts that value back, rather than writing
`Ilya — Russian Lyric Diction` a second time into script.

### Step 3, one sanitizer, not two

**The lane extracts the sanitizing half of `binderFileName` (`binder.ts:74-84`, everything before the extension is
appended at `:85`) and both names go through it.** It already replaces the characters a file system refuses, keeps
Cyrillic, the pre-reform letters and accents, and caps at 180 bytes. r1 asked for a shorter character list and no
cap, which would have been a second, worse copy of code that ships.

### Step 4, the vowel-space sheet keeps its own name

`print-sheet.ts:46` prints the same document, so after step 1 it would propose a song's composer and title for a page
about her voice. **The sheet holds the static title for the length of its print and puts the song's back in its
existing `cleanUp` (`print-sheet.ts:31-38`).** This is a repair of a regression step 1 would otherwise ship, which is
why `print-sheet.ts` is in scope here and was not in r1.

## The sites that name a file or a page, corrected from r1

| site | what it names | this lane |
|---|---|---|
| `app.html:45` | the static title | unchanged; it is the off-studio and no-song name |
| `lib/page-config.ts:188` `formatRunningHeader`, `:169-178` `extractSurname` | the running header | **unchanged**; a mixed-case sibling is added beside `extractSurname` |
| `lib/library/binder.ts:73` `binderFileName`, `:55` `autoName` | the binder file a singer exports | unchanged as a rule; its sanitizer is extracted and shared |
| `lib/library/songs.ts:44` `proposeName`, `:81` `placeholderName` | a song's own name | unchanged; its chain is reused for the fallback |
| `lib/library/exchange.ts:106-108`, `:127-130`; `routes/+page.svelte:2981` | the binder's download name, where the singer's own name for the song wins | unchanged |
| `lib/voice/chart/print-sheet.ts:46` | the vowel-space sheet's print | **step 4**, so it keeps the static title |
| `apps/web/static/manifest.webmanifest:2-3`, `:7` | the installed app's name, `display: standalone` | unchanged, and the reason the always-on title is flagged |

**What depended on them agreeing:** after this lane one song can reach a singer's Downloads folder under two rules,
the binder as her own name or composer-comma-title, and the PDF as surname-hyphen-title-hyphen-page. **That is
deliberate and the brief says so, so a later desk does not "fix" it.** **Also deliberate:** a poem print and a lyrics
print of one song propose the same filename, because his ruling names the page TEXT (`text-header.ts:23-26`,
`i18n.ts:215-216`); the lane reports it for a later row and does not change it.

## The grep that was run

Run 2026-11-27: `document.title`, any `.title =`, `<title>`, `svelte:head`, `window.print`, `download`, and
`fileName` across `apps/web/src`, plus Fable's independent sweep. **r1's grep was `document.title` and `window.print`
only, and its conclusion that "nothing in the tree names a page today" was false.**

## Done when

1. **With a song open, printing to PDF from each of the three documents proposes three DIFFERENT filenames**, each
   reading `Composer - Title - <page name>`, read in Chrome's own print dialogue at the save step, with the three
   strings reported.
2. **The same three in French read « TEXTE », « CHANT », « APERÇUS »**, read the same way.
3. **Switching tabs changes the proposed name without a reload**, read in the same dialogue.
4. **A song with no title, and a song with no composer, each propose a name that is not empty, carries no stray
   dash, and still differs across the three documents.**
5. **A title carrying `/` or `:` produces the exact string the sanitizer's unit test expects**, compared against the
   function's output and not against the browser's cleanup.
6. **Off the studio, and with no song, the title is `Ilya — Russian Lyric Diction`.**
7. **The vowel-space sheet's print proposes the static title even with a song open.**
8. **The browser tab's label is reported**, in a screenshot, so Dann's look catches the always-on change.
9. **The new function has a unit test**, and the gate baseline it moves is reported with both figures.
10. **`routes/+page.svelte` is at or under 5533 lines**, and all eight gates at baseline on the Mac.

## What could not be established

- **What any browser proposes from `document.title`, and how it treats `/`, `:`, or length.** No browser was run.
  Step 1's report names what Chrome does and leaves the rest NOT ESTABLISHED.
- **Whether an installed copy shows `document.title` in its window.** The manifest line is read; the behaviour is not.
- **Whether a `svelte:head` title beside `app.html`'s produces two `<title>` elements in the built page**, if the
  lane takes that route.
- **Whether any singer-facing string promises a filename.** Not searched.

**NOT ESTABLISHED beats a complete invented answer.**

## Reporting

One report to `docs/sessions/`. Commit nothing.
