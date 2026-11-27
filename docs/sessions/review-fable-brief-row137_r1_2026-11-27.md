DO NOT SEND

# Review r1 of `brief-code-row137-page-name_r1_2026-11-27.md` (QUEUE row 137)

2026-11-27, Fable, for the desk. Brief md5 `bc63c7d32493c59c3bade01af865fd9b` (matches `bc63c7d3`). Tree: branch `Shane` at `79d6d18e1c81438733936b626ba37a63fb7ac5ea`, read through the bridge this session. Working tree differs from HEAD only in `docs/memory/ENVIRONMENT.md`, `docs/memory/STATE.md`, and the untracked brief. All paths below are under `apps/web/src/` unless they start elsewhere. No source file was modified and git was read only.

The brief's central claim holds: nothing under `apps/web/src` sets `document.title`. Five things stop it from going as written.

## Blockers

1. **`+page.svelte` sits exactly at its ratchet ceiling, and it is the only place the state lives.** `scripts/ratchets.json:8` sets the ceiling at 5533; `wc -l` on `routes/+page.svelte` returns 5533 this session. `destination` and `studioDocument` are component state there (`routes/+page.svelte:355`, `:356`), as are `language` (`:238`) and `doc` (`:271`). One added line fails the ratchet, so done-when 7 fails. The brief does not mention the ceiling. The tree's own precedent is to move logic out to a tested `.ts` file (`lib/score/bar-layer.ts:7`, "`+page.svelte` is at its line ceiling and a line of logic in a `.svelte` file has no test"). The brief has to say where the name is built (a pure function in a new `.ts` file with its own test), how few lines the page gains, and which lines the page gives up to pay for them.

2. **Step 1 contradicts itself on the composer.** It sends the composer "through `extractSurname`" and gives the example `Alyabyev - Solovey - MELODY`. `extractSurname` returns uppercase on both branches (`lib/page-config.ts:173`, `:177`; its doc comment says "Returns uppercase" at `:167`). The step as written yields `ALYABYEV - Solovey - MELODY`. A lane that wants the example has to write a second surname function, which breaks the brief's own stated dependency ("a change to `extractSurname` moves both") and edits or duplicates code in `page-config.ts`. The brief has to pick one and say it.

3. **The grep was too narrow, and the tree already names a file from a song.** The brief says "Nothing in the tree names a page today, so nothing is rebuilt." It searched `document.title` and `window.print` only. Three sites it did not find:
   - `lib/library/binder.ts:73`, `binderFileName`: replaces `\ / : * ? " < > |` and control characters with a space, collapses whitespace, strips a leading dot, keeps Cyrillic and accents, and caps the name at 180 bytes (`binder.ts:74-85`). Step 3 asks the lane to write this again, with a shorter character list (`/`, `:`, line break) and no length cap.
   - `lib/library/songs.ts:44`, `proposeName`: the existing fallback chain for a song's name: `Composer, Title`, then title, then composer, then the source file's base name, then the first four words of the poem (`songs.ts:45-54`). `binder.ts:55-60` (`autoName`) adds `Untitled, <date>` from `songs.untitled` (`lib/i18n.ts:1761`, "Untitled" and « Sans titre »).
   - `routes/+page.svelte:2981`, `anchor.download = result.fileName`, fed by `lib/library/exchange.ts:127-130`, with "THE SINGER'S NAME WINS" at `exchange.ts:106-108` (`record.name || autoName(...)`).
   This is the occasion of the CONTRACT section 4 rule "Search the tree before you propose to add anything" (`docs/memory/CONTRACT.md`, section 4). After this lane, one song lands in the singer's Downloads folder under two rules: the binder as full composer, comma, title (or her own name for the song), and the PDF as surname, hyphen, title, page. The brief has to name these sites in its section 4 table, say whether step 3 reuses the sanitizing half of `binderFileName` (it appends `.ilya` at `binder.ts:85`, so the reusable part needs extracting), and say that the two rules differ on purpose.

4. **Step 1 changes what the vowel-space sheet's print proposes, and makes it wrong.** `lib/voice/chart/print-sheet.ts:46` calls `window.print()` on the same document. Today it proposes the static title. After step 1, with a song open, it proposes that song's composer, title, and whichever tab is behind the sheet, for a page about her voice and not about a song. The brief's table lists this path as "out of scope" and asks only for a one-line report. That ships a regression on a surface the brief says it does not touch. The smallest repair needs no new string: `printVowelSheet` holds the `app.html` title for the length of its print and puts the song's back in its existing `cleanUp` (`print-sheet.ts:31-38`). That touches `print-sheet.ts`, so the scope line has to change to allow it.

5. **The case of the title, and the always-on title, are not his words, and a saved file's name cannot be taken back.** See check 2 below. One question to Dann is owed before the lane starts.

## Amendments

1. **Put the case question to Dann before sending (check 2).** The default he ratified reads, in QUEUE row 137: "while printing, the title reads Composer - Title - the page's name (Text, Markup, or Insights), after the running header's composer and title" (`docs/memory/QUEUE.md:247`). "After the running header's composer and title" is surname and title both uppercase (`page-config.ts:193`, `:197`). His own correction names the pages in capitals. The literal reading of what he said yes to is `ALYABYEV - SOLOVEY - MELODY`. The desk's mixed form is a taste call, and by blocker 2 it is not even the form the step produces. Recommendation to put to him: all capitals, matching the running header and the page names he typed; cost of the other path: a second surname rule and a filename that disagrees with the header on the page it names.

2. **Name the second departure, which the brief does not flag.** The ratified default says "while printing". Step 1 sets the title for the whole time a song is open. `document.title` has other readers the brief never names: the browser tab's label, history and bookmark entries, and the installed app's window (the manifest declares `"display": "standalone"`, `apps/web/static/manifest.webmanifest:7`). The word "Ilya" leaves the tab while she works. QUEUE row 137 extends the default to saved pages by the desk's own reasoning, which supports always-on; the tab label is still a singer-visible change he has not seen. Mark it DESK DEFAULT in the brief and put the tab label in the done-when so his look catches it.

3. **Replace "while a score is open" with the real condition.** TEXT needs no score: a singer can type words and a title. The condition the step can read is `doc.metadata.title` and `doc.metadata.composer` (read at `routes/+page.svelte:1725`). Done-when 6's "no score open" needs the same repair, or a typed song with a title has no ruled name.

4. **Say what the title is on LEARN and GUIDE.** `Destination` is `'studio' | 'learn' | 'guide'` (`lib/destinations.ts:35`); `studioDocument` keeps its value when she goes to LEARN. The Print button is studio only, but "A singer can still print those pages from the browser's own menu" (`routes/+page.svelte:4445-4446`). As written, LEARN printed with a song open would propose `Composer - Title - TEXT`. Recommended DESK DEFAULT: off studio, the static title stands.

5. **Step 2, item 1: the tree answers it; drop the report-first stop.** See check 6. Name the fallback in the brief as a DESK DEFAULT.

6. **Step 2, item 3: restore, do not copy.** The lane will want the string `Ilya — Russian Lyric Diction` in script to put back when a song closes. That makes a second copy of `app.html:45`. Have it read `document.title` once at start and restore that value.

7. **Step 3: one sanitizer.** Point the lane at `binder.ts:73-85` and have both names go through the same function. Add the byte cap the brief omits; a long Russian title at two bytes a letter reaches a file system's limit sooner than it looks.

8. **TEXT's two printed pages share one name.** The printed TEXT page is headed TEXT: POEM or TEXT: LYRICS (`lib/text/text-header.ts:23-26`; `lib/i18n.ts:215-216`; Dann 2026-11-03, "they must correspond", quoted at `i18n.ts:211-212`). His ruling of 2026-11-26 names the page TEXT, so `tab.text` is right by his words. The brief has to say that a poem print and a lyrics print of one song propose the same filename, so the lane does not "fix" it and the report names it for a later row.

9. **Rewrite the done-when (check 4).** Add a unit test of the pure function to the lane, with the gate baseline it moves. Tie items 2 to 5 to the same observation as item 1. Name the browser and the step where the filename appears.

10. **Section 4 table: add the binder sites and correct the `print-sheet.ts` row** (blockers 3 and 4).

11. **Small.** The brief's header says the surname comes "through `extractSurname` (`:196-197`)"; those lines are the call inside `formatRunningHeader`, and the function is defined at `page-config.ts:169-178`. Cite both. Also for the lane to know, not to change: `app.html:45` carries an em dash, and `page-config.ts:183-184` records "no em dash is shown to the singer". That is an existing condition and out of this row's scope.

## The eight checks

**1. Citations.** Table below. The `document.title` claim is TRUE: a search of `apps/web/src` for `document.title`, any `.title =` assignment, `<title>`, and `svelte:head` returns only `app.html:45`, an SVG `<title>` inside `lib/tempo/TempoReceipt.svelte:46`, `routes/notation-font-lab/+page.svelte:49-51` (a separate lab route with its own static title), and `lib/components/Paper/Paper.svelte:157-159`, a `svelte:head` holding only the `@page` style.

**2. The uppercase departure.** Yes, it is the desk inventing taste. Two competent people would differ on capitals in a filename and neither is wrong, which is his own definition of taste. It is also costly to redo: a PDF a singer has saved keeps its name. And the form he ratified reads uppercase (amendment 1). It goes to him. The always-on title is a second, unflagged departure (amendment 2).

**3. Does the name reach the filename.** Nothing in the tree overrides it. The two `@page` rules set size and margin only (`app.css:369-372`; `Paper.svelte:158`). The only `download` attributes are the binder (`routes/+page.svelte:2981`) and the capture zip (`lib/voice/engine/capture-file.ts:178`), neither on a print path. `static/sw.js` has no match for `title`, `print`, or `filename`. The manifest's `name` is the install name. `ssr = false` (`routes/+layout.ts`), so the title is set in the browser. So the done-when can be met as far as the tree goes. That Chrome, Safari, and Firefox take a print-to-PDF filename from `document.title`, and what each does to `/` and `:` in it, is NOT ESTABLISHED this session: it is browser behaviour, no source was read, and the brief already says so for the save path.

**4. The done-when, item by item. Could it pass while every page still proposes one name?**
   1. No. It names the behaviour and where to look. Gaps: it does not say which browser, or that the name shows at the save step; and it does not cover the saved page, though the row's title does.
   2. Yes, as worded. "Read" does not say where. It can be met by reading the tab bar or `document.title`. Tie it to item 1's look.
   3. Mostly no, but "the proposed name" is not tied to the dialogue; a changed tab label would satisfy it.
   4. Yes. Today's static title is not empty and has no stray dash. A lane that fell back to the static title for a song with no title would pass this with all three pages named alike. Require three different names here too.
   5. Yes. It passes today, and it passes if the browser cleans the name itself, with no step 3 at all (that the browser does so is an inference, not established). Require the expected string, compared against the function's output.
   6. Yes, by construction; it describes today. It is a guard, not evidence. See amendment 3 on "no score open".
   7. Yes. No gate tests the title today (no `toHaveTitle` and no pin on the static string anywhere outside build output). Without a new unit test the gates say nothing about this lane.
   Not named by any item: the vowel-space sheet's proposed name (blocker 4), LEARN and GUIDE (amendment 4), the tab label (amendment 2).

**5. Which document is on screen.** `destination` (`routes/+page.svelte:355`) and `studioDocument` (`:356`), with `activeTab` derived from both (`:357`). The types are at `lib/destinations.ts:35` and `:38`; the document ids are `'text' | 'markup' | 'insights'`, and `lib/components/DeskHead.svelte:57-66` maps them to `tab.text`, `tab.markedScore`, and `tab.insights`. All of it is in scope in `+page.svelte`, beside `language` (`:238`) and `doc.metadata` (`:1725`), so the state is reachable where the title would be set. The state is not the blocker; the ceiling on that file is (blocker 1).

**6. The no-title fallback.** The tree answers it, so the report-first stop is not needed. On screen the title block shows the placeholder `meta.title`, "Aria or song title" (`lib/components/Paper/TitleHeader.svelte:162-168`; `lib/i18n.ts:305`). In print the placeholder is hidden (`TitleHeader.svelte:409-412`), so the printed page carries no title at all. The running header is empty (`page-config.ts:189-191`). For naming, the tree's existing words are `proposeName`'s chain and `songs.untitled` (blocker 3). The brief was right not to invent a word; it was wrong that nothing existed. Which of the existing fallbacks the page name takes is reversible, so it is a DESK DEFAULT to mark, not a stop.

**7. Scope.** The running header: not reached, provided `extractSurname` is called and not edited; blocker 2 puts that at risk. The printed layout: not reached; `document.title` is not drawn on the page, and `@page` has `margin: 0` (`app.css:369-372`), which leaves no room for a browser's own header line (that a browser prints the title there by default is general behaviour, not read this session). The vowel-space sheet's print path: reached in effect (blocker 4).

**8. Sites the brief did not name.** `lib/library/binder.ts:55` and `:73`; `lib/library/songs.ts:44` and `:81` (`placeholderName`); `lib/library/exchange.ts:106-108` and `:127-130`; `routes/+page.svelte:2981`; `lib/voice/engine/capture-file.ts:178` (a download name, unrelated to songs); `apps/web/static/manifest.webmanifest:2-3` (the app's own name); `routes/notation-font-lab/+page.svelte:50` (a second static title); `document.svelte.ts:207` (`doc.name`, the singer's own name for the song, which the new filename ignores by his ruling).

## Citations checked

| brief's citation | verdict | what the line holds |
|---|---|---|
| `app.html:45`, the static title | TRUE | `<title>Ilya — Russian Lyric Diction</title>`. QUEUE row 137 still says `app.html:13`; that record is stale |
| `document.title` set nowhere under `apps/web/src` | TRUE | see check 1 |
| `routes/+page.svelte:2167`, `window.print()` | TRUE | inside `handlePrint`, `:2166-2168`; its one caller is the button at `:4453` |
| `lib/voice/chart/print-sheet.ts:46`, `window.print()` | TRUE | inside `printVowelSheet`, `:23` |
| "Two places print" | TRUE | no other `print()` call under `src`; the browser's own menu is a third path the brief does not name |
| `page-config.ts:188`, `formatRunningHeader(composer, title, poet)` | TRUE | `poet` is optional |
| `page-config.ts:189-191`, empty string with no title | TRUE | |
| `page-config.ts:193`, uppercases the title | TRUE | `title.trim().toUpperCase()` |
| `page-config.ts:196-197`, surname through `extractSurname` | TRUE for the call; the function is at `:169-178` | and it returns uppercase, `:173`, `:177`, which the brief's example ignores |
| `i18n.ts:210`, `tab.text` | TRUE | TEXT, TEXTE |
| `i18n.ts:228`, `tab.markedScore` | TRUE | MELODY, CHANT |
| `i18n.ts:232`, `tab.insights` | TRUE | INSIGHTS, APERÇUS |
| the ruling, "transcribed as written" | TRUE against the record | same words at `docs/memory/DANN.md:47`, `STATE.md:34`, `QUEUE.md:247`; the thread itself was not available to me |
| "Nothing in the tree names a page today, so nothing is rebuilt" | FALSE | blocker 3 |
| `print-sheet.ts` "unchanged" by this lane | FALSE in effect | blocker 4 |
| example `Alyabyev - Solovey - MELODY` from `extractSurname` | FALSE | blocker 2 |

## What I could not establish

- What any browser proposes as a print-to-PDF or save filename from `document.title`, and how it treats `/`, `:`, or length. No browser was run and no source read.
- Whether an installed copy of Ilya shows `document.title` in its window, and where. The manifest line is read; the behaviour is not.
- What Dann was shown at the moment he said "Yes make it so". I read the recorded default in QUEUE row 137, not the message put to him.
- Whether the ratchet script is one of the eight gates in `~/Downloads/ilya-ship.sh`. That file is outside the mounted folder. `package.json:12` defines the `ratchets` script and QUEUE line 158 speaks of files kept "under their ratchet ceilings" for a ship.
- Whether the vowel-space sheet can be printed while a song with a title is open in every layout. `SummarySheet` is mounted from `lib/voice/CalibrationWizard.svelte:866`; I did not trace when the wizard is reachable.
- Whether any singer-facing string promises a filename. I did not search the string table for it; the brief's own open item stands.
- How `svelte:head` with a `<title>` behaves beside the static one in `app.html` under `prerender = true`. If the lane takes that route it has to check for two `<title>` elements in the built page.

## Terms

Adopted from the tree and the record: running header, ratchet, ceiling, DESK DEFAULT, binder. Coined here: none.

Tool uses: 16.
