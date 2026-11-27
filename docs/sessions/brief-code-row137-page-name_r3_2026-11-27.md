# Brief r3: the name a saved or printed page takes (QUEUE row 137)

2026-11-27, written by the desk (Opus 5) for Code. Branch: cut from `Shane` at `79d6d18e` or later.
**Supersedes r2 (md5 `4031fb04`), which Fable returned SEND WITH AMENDMENTS on, four of them must-apply**
(`review-fable-brief-row137_r2_2026-11-27.md`, md5 `2d3efff5`); r2 superseded r1 (md5 `bc63c7d3`), which came back
DO NOT SEND. **That review says this lane needs no third review if the amendments are applied as written.** They are.

## What a singer meets

She prints MELODY for her lesson, then TEXT for her coach, then INSIGHTS for herself, and her browser proposes the
same filename all three times. Dann, 2026-11-26 23:07: *"Oh no! I thought it already worked like this"*.

## His ruling, and the one departure from it

*"Yes make it so. Yes the recorded default should be TEXT MELODY and INSIGHTS and similarly updated for the correct
French terms we chose"* (2026-11-26 23:07, transcribed as written). **He was shown `Alyabyev - Solovey - MELODY`, in
mixed case, in the message he answered**, so the mixed case, the surname-only composer, and the spaced hyphen are all
ratified.

**The one departure, DESK DEFAULT, his to overrule:** his default says "while printing"; this lane sets the title
whenever she is in the studio, so the word "Ilya" leaves the browser tab while she works. **The literal path costs
the row its own purpose**: a title set only around a print never reaches a page she SAVES, which row 137 includes.
Done-when 8 puts the tab's label in front of him.

## What is true today, every line read 2026-11-27

- **Nothing sets `document.title`** anywhere under `apps/web/src`. **`app.html:45`** holds the static title.
- **`routes/+page.svelte` is at its ratchet ceiling:** `scripts/ratchets.json:8` reads 5533 and `wc -l` returns 5533.
- **`extractSurname` (`page-config.ts:169-178`) returns UPPERCASE** on both branches. **A second function of that
  name already exists**, `lib/composers-poets.ts:200`, returning mixed case, with no importer found under `src`.
- **`proposeName` (`songs.ts:44-55`)** returns `${composer}, ${title}` when both are present, then title, then
  composer, then the source file's base name, then the poem's first four words. **It cannot produce this row's name**
  and `fileBaseName` is not exported.
- **`placeholderName(createdAt, untitled)` (`songs.ts:81-83`)** returns `${untitled}, ${createdAt.slice(0, 10)}`, an
  ISO date that reads alike in both languages.
- **`binderFileName` (`binder.ts:73-85`)**: sanitizing is `:75-81`; **`:82` is an English-only fallback**,
  `Untitled, ${today}`; the byte cap is `:83-84`; the extension is appended at `:85`. Its only callers are
  `exchange.ts:129` and `:130`, pinned by `binder.test.ts:81-99`.
- **`printVowelSheet` (`print-sheet.ts:23`)** guards `typeof document === 'undefined'` at `:24`, adds a body class at
  `:29`, and `cleanUp` (`:31-38`) runs once, on `afterprint` (`:39`) or straight after `print()` (`:49`).
- **The state is readable:** `destination` (`+page.svelte:355`), `studioDocument` (`:356`), `activeTab` (`:357`),
  `language` (`:238`), `doc.metadata` (`:1725`), `doc` itself (`:271`).
- **She can print LEARN and GUIDE from the browser's own menu** (`+page.svelte:4440-4441`; **r1 and r2 cited
  `:4445-4446` and both were wrong**).

## Scope

**In:** `document.title` on the studio, its parts and fallbacks, the characters a file system refuses, and the
vowel-space sheet keeping its own name.

**Out:** the running header; the printed layout; the binder's naming rule; `doc.name`, her own name for the song,
which wins for the binder (`exchange.ts:106-108`) and has no part in a page's name (DESK DEFAULT); any new control;
any new string in either language.

## Steps

### Step 1, the name is always built on the studio

**r2 said the name is built only when the song has a title or a composer. That is the row's own bug**: a pasted poem
with neither would have taken the static title on all three documents, and every done-when item would have passed.

**On the studio the name is always built.** Off it, on LEARN or GUIDE (`lib/destinations.ts:35`), the static title
stands, DESK DEFAULT.

The name is `<song part> - <page name>`:

- **The page name** is the document on screen, from the key its tab shows (`i18n.ts:210`, `:228`, `:232`), so the
  French needs no new string.
- **The song part**, in order: surname and title; then title; then surname; then the chain's tail; then
  `placeholderName(doc.createdAt, t('songs.untitled', language))`, which is ISO and language-neutral. **Not
  `todayInWords()`** (`+page.svelte:2931-2937`), which is neither.
- **The surname is mixed case**, from a new sibling of `extractSurname`. **It is not named `extractSurname`**, since
  two functions already carry that name. **`page-config.ts:169-178` is not edited**: the running header depends on
  its uppercase, pinned at `one-head-one-foot.test.ts:47-49`. The sibling repeats its stripping rules, and **a test
  ties them**: for "First Last", "Last, First", and a name with parenthesized dates, the sibling uppercased equals
  `extractSurname`.
- **The title is not uppercased.**

**The name is built by a pure function in its own `.ts` file with its own test**, because `+page.svelte` is at its
ceiling. The page gains the fewest lines that can call it, and the lane reports how many and what it gave up.
**No comment carrying a ruling pays for them** (`+page.svelte:4440-4450` among others) and **no lines are joined**.
One candidate the tree offers: `handlePrint` (`:2166-2168`), three lines with one caller (`:4453`).

### Step 2, the chain's tail is exported, not copied

`proposeName` cannot be called for this name. **The lane exports its tail (`songs.ts:50-54`, the file base name and
the poem's first four words) as its own function taking plain strings, and `proposeName` calls it.**
`songs.test.ts:52-133` stays unedited and is the guard that `proposeName` is unchanged. That is one edit in
`songs.ts`, and the site table says so.

### Step 3, one sanitizer, and the cap applied where it cannot eat the page name

**The shared function is `binder.ts:75-81` plus the byte cap at `:83-84`**: string in, string out, empty allowed.
**`:82`'s English `Untitled, ${today}` stays inside `binderFileName`**, so no English word reaches a French filename
and `songs.untitled` keeps its place. `binder.test.ts:81-99` stays unedited.

**Each part is sanitized before the chain tests it for empty**, because a title of `///` sanitizes to nothing, which
`binder.test.ts:95` already pins. **The cap is applied to the song part alone and the page name is appended after
it**, because the cap trims from the end (`:84`): capping the whole name would eat ` - MELODY` first and put all
three documents back on one filename.

### Step 4, the vowel-space sheet keeps its own name

After step 1 the sheet would propose a song's composer and title for a page about her voice.

**The captured static title lives in the new file of step 1**, which sits outside `melody/` and `insights/` so the
module layering holds (`scripts/ratchets.mjs:78-85`: `voice/` may import only `reader` and `score` among the six; a
file outside the six is free). The sheet asks that file for the static title at `print-sheet.ts:29` and asks it for
the song's name again in `cleanUp` (`:31-38`). **It must not read `document.title` when it opens**: a second press
before the first dialogue closes would read the static title as "the song's" and leave it there. **`document` is
guarded as `:24` already guards it**, since `routes/+layout.ts` sets `prerender = true`.

## The sites that name a file or a page

| site | what it names | this lane |
|---|---|---|
| `app.html:45` | the static title | unchanged; the off-studio name |
| `page-config.ts:188`, `:169-178` | the running header and its uppercase surname | **unchanged**; a mixed-case sibling is added beside it |
| `lib/composers-poets.ts:200` | a second `extractSurname`, mixed case, no importer found | unchanged; the reason the sibling takes another name |
| `binder.ts:73` `binderFileName`, `:55` `autoName` | the binder file she exports | rule unchanged; `:75-81` and `:83-84` extracted and shared |
| `songs.ts:44` `proposeName` | a song's own name | **its tail at `:50-54` is exported; `proposeName` calls it and is otherwise unchanged** |
| `songs.ts:81` `placeholderName` | the untitled fallback | reused as the last link |
| `exchange.ts:106-108`, `:127-130`; `+page.svelte:2981` | the binder's download name, where `doc.name` wins | unchanged |
| `lib/library/document.svelte.ts:201-207` | `doc.name`, her own name for the song | **no part in a page's name, DESK DEFAULT** |
| `print-sheet.ts:46` | the vowel-space sheet's print | **step 4** |
| `lib/voice/engine/capture-file.ts:178` | a capture download, unrelated to songs | unchanged |
| `static/manifest.webmanifest:2-3`, `:7` | the installed app's name, `display: standalone` | unchanged, and why the always-on title is flagged |
| `routes/notation-font-lab/+page.svelte:50` | a second static title on its own route | unchanged |

**Deliberate and stated so no later desk "fixes" it:** one song can reach her Downloads under two rules, the binder
as her own name or composer-comma-title, and the PDF as surname-hyphen-title-hyphen-page. **Also deliberate:** a poem
print and a lyrics print of one song propose the same filename, because his ruling names the page TEXT
(`text-header.ts:23-26`); the lane reports it for a later row.

## Done when

**Who reads what.** The lane proves every string by its unit test and by reading `document.title` in the running page
in each state. **The print dialogue is read by the desk or by Dann, in Chrome, and is not the lane's to open**:
whether a lane can read a native dialogue is NOT ESTABLISHED.

1. **`document.title` differs across the three documents**, with a song open, reported as three strings.
2. **The same three in French read « TEXTE », « CHANT », « APERÇUS ».**
3. **Switching tabs changes it without a reload.**
4. **Four cases each give a name that is not empty, carries no stray dash, and still differs across the three
   documents:** no title; no composer; **neither, with words pasted**; and a title long enough to reach the byte cap,
   **with the page name still present**.
5. **The literal:** composer `Nikolai Rimsky-Korsakov`, title `A/B: C`, MELODY, English, gives
   `Rimsky-Korsakov - A B C - MELODY`, asserted on the name function and not on the sanitizer.
6. **Off the studio the title is `Ilya — Russian Lyric Diction`.**
7. **The vowel-space sheet's print proposes the static title with a song open, and the song's name is back after its
   dialogue closes.**
8. **The browser tab's label is shown in a screenshot, with a song open and with none**, for Dann's look.
9. **The unit test covers:** three documents by two languages, all six different; the four cases of item 4; item 5's
   literal; and the tie test of the surname sibling.
10. **`routes/+page.svelte` is at or under 5533 lines**; all eight gates at baseline; any baseline moved reported with
    both figures.

## What could not be established

- What any browser proposes from `document.title`, what it does to `/`, `:` or length, and whether it reads the title
  when the dialogue opens or when the file is saved.
- Whether a state with no `doc` exists beyond `+page.svelte:271`.
- Whether the vowel-space sheet can be printed with a titled song open, and whether its Print can be pressed twice.
- Whether a `svelte:head` title beside `app.html:45` yields two `<title>` elements, if the lane takes that route.
- When `doc.name` is filled (`songs.ts:179-186`); if it is filled before a print it could stand in for the chain's
  tail with no edit to `songs.ts`, which would make step 2 unnecessary. **The lane checks this first and reports.**

**NOT ESTABLISHED beats a complete invented answer.**

## Reporting

One report to `docs/sessions/`. Commit nothing.
