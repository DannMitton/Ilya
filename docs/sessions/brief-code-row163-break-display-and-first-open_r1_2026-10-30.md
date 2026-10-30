# Brief: row 163, the # drawn apart, tidied, and listed; Input's active pill; the first open after a deploy; the French footer

r1, 2026-10-30, written by the desk (Opus) from Dann's walk on the alias, 13:58 to 14:40. NOT Fable-reviewed: Fable reviews it after Sunday 2026-11-01 04:00 (`CONTRACT.md` §1 item 19), and its amendments land before Code starts. Lane: the cloud lane, a new branch cut from `Shane` (`CONTRACT.md` §4, exception b). Model: Sonnet.

**NOT ESTABLISHED beats a complete invented answer.** Every claim about the code below carries the line the desk read on 2026-10-30. Re-read each before you change it; where the tree differs, the tree wins and your report says so.

## What the singer sees, and why (start here)

1. **A colleague who has opened Ilya before meets a blank page once after each deploy.** Seen in Dann's Chrome 2026-10-30 13:59: the active service worker (cache `ilya-1792630063404-static`) served its stored `/`, whose `_app/immutable/entry/start.BikemZ4X.js` returned 404; console: "Failed to fetch dynamically imported module". A second load showed the app. Dann 14:01: *"I believes this undermines Ilya's authority."*
2. **The # sits fused to its syllable** («tkʌ#») on Text and Markup. Dann 14:07: *"I need the user to understand that while the octothorpe serves the function of a syntactis break, it does not become part of its host syllable the way enclitics do."*
3. **Messy typing of a # is left as typed.** Dann 14:27: *"humans are going to be messy in their input and I believe this will keep Ilya organized."*
4. **The Loupe's Syllables list never shows the #**, so a singer finds a break only by tapping syllables.
5. **Input's Poem | Lyrics pill does not show which side is active.** Asked by Dann 2026-10-20 20:34 and 20:35 and again 2026-10-30 14:21.
6. **The French footer reads as a calque** (« Fait avec amour au Canada »).

## The rulings (all in `docs/memory/OPEN.md`, section "2026-10-30, FROM THE WALK OF N.194 AND ROWS 139, 134")

Read that section first. In short: a full word space before every # on Text, Markup, and the Syllables list (Dann 14:13, 14:17); copied and exported IPA stay «tkʌ#»; every typed form of # is tidied to «<unit> #» at the unit's end when the singer leaves Lyrics (Dann 14:27, departing from his 2026-10-21 02:18 and 02:19 rulings); the # shows in the Syllables list (desk default 14:09); Input's active pill takes `--sage-desk` (Dann 14:21); the server answers a missing old build file with a one-time reload stand-in, plus the page served network-first online (desk recommendation 14:01 to 14:04, Dann 14:04 *"Yes"*); the footer reads « Fait avec cœur au Canada » (ratified 14:40).

## Steps (one commit and one report each, `docs/sessions/report-code-row163-step<n>_r1_2026-10-30.md`)

**Step 0, measure, keep nothing.** On a preview build of `Shane` as it stands: (a) song 1 (Sunless no. 1 fixture) with a # after every word: record every column's x on Markup, so step 2's movement is measurable; (b) reproduce the blank page: deploy build A, open it in Playwright Chromium with its service worker, deploy build B (any one-byte change), open again, record what the first and second loads show. If (b) cannot be reproduced on a preview, say so and stop step 1 there.

**Step 1, the first open after a deploy.**
- `apps/web/static/sw.js:96-109` serves every request stale-while-revalidate, `/` included. Make navigations (and `/` itself) network-first when online, falling back to the stored page offline. Keep `:16-19` as ruled: no `skipWaiting`, no `clients.claim`.
- A request for a file under `/_app/immutable/` that does not exist returns a tiny JavaScript stand-in that reloads the page **once** (guard with `sessionStorage`; on a second miss it does nothing) and is **never cached**: `Cache-Control: no-store`, overriding `vercel.json`'s one-year rule for `/_app/immutable/(.*)` (`vercel.json`, first `headers` entry). One file, one rule; nothing per old name. Prove first that Vercel serves the stand-in only where no real file exists (a rewrite that applies after the filesystem); if it cannot, say so in the report and stop this half.
- Note for the review: an old worker stores any 200 reply (`sw.js:101`), so it may keep the stand-in under the old name until the new worker activates; activation deletes every older `ilya-` cache (`sw.js:58-67`).
- Done when: step 0's (b) run again shows the app on the first load after build B, and a missing name requested twice in one tab reloads once only.

**Step 2, the # drawn apart.**
- Markup: `apps/web/src/lib/syntactic-break.ts:54-56` (`graftBreak`) appends `#` to the last syllable's IPA. Text: `apps/web/src/lib/clitic-merge.ts:40-43` appends it to four strings. Keep the strings as they are for copy and export («tkʌ#»); draw the # as its own element, a full word space of the IPA font after its syllable, on Text, Markup, and the Loupe.
- On Markup the syllable stays centred on its own letters; the # hangs to its right.
- **Other sites that compute the same width (`CONTRACT.md` §4):** `underlayHalfWidth` (`packages/score-parser/src/staff-renderer.ts:1025-1042`) measures the wider of Cyrillic and IPA, centred on the note; its comment says `page-layout.ts` calls the same function rather than mirroring it. Change the width so the # and its space count on the right side only, and name every caller in the report. Done when: step 0's (a) rerun reports how many columns moved and by how much; if more than a handful move, report before going on.
- Copy on screen, print, and export: copied IPA has no space before the #.

**Step 3, the tidy on leaving Lyrics.**
- Today `glueTypedMarks` (`apps/web/src/lib/text/break-glue.ts:32-34`) turns only spaces or tabs before a # into one U+00A0; it runs on leaving the field (`apps/web/src/lib/components/Drawer/IntakeViews.svelte:200-205`, `lyricsOnLeave`, `break-glue.ts:41-45`).
- Widen it so every form becomes `<unit> #` at the end of the unit the break belongs to: no space («полёт#»), any number of spaces or U+00A0s, a mix, a # inside a word («ва#с» to «вас #»), a # after a proclitic («в# доме» to «в доме #»; the unit finder is `apps/web/src/lib/text/syntactic-break-unit.ts`). Two #s together become one. A # at the start of a line moves to the end of the line before. A # with no word before it is removed (Dann 2026-10-29 01:44).
- `peelSyntacticBreaks` (`syntactic-break.ts:33-49`) already reads all of these forms; the tidy changes the text, never the words, syllables, seats, or IPA. Prove that with a test over every form.
- Update the comment at `syntactic-break.ts:16-18`, which says Ilya never moves a typed #.
- Field showing the score's derived words: unchanged (`break-glue.ts:42`).

**Step 4, the # in the Loupe's Syllables list.** The list's component is NOT READ by the desk; find it from `apps/web/src/lib/score/Loupe.svelte`. Show the # after its unit's last syllable with the same full gap. It never appears in the Cyrillic under the notes or in the Poem.

**Step 5, Input's active pill.** `apps/web/src/lib/components/ViewPair.svelte:106-109` fills the active member with `--paper-cream`, which barely differs from the panel. The Loupe uses `--lavender-desk` (`apps/web/src/lib/score/Loupe.svelte:2761-2764`). Give Input's pair (`IntakeViews.svelte`, `<ViewPair` at `:223`) `--sage-desk` (`apps/web/src/app.css:148`) through a prop or a class; Text's witness pair (`TextWitnessPair.svelte`) and the desk's Text/Markup/Insights pair (`DeskHead.svelte`) keep their look.

**Step 6, the French footer.** `apps/web/src/lib/i18n.ts:921`: « Fait avec amour au Canada » becomes « Fait avec cœur au Canada » (ratified 2026-10-30 14:40; « œ » as the file writes it, `œ` in « met en œuvre »). Nothing else in the string changes.

## Gates and limits

All eight gates at baseline (`~/Downloads/ilya-ship.sh`); any change in a count is named in the report. No push to `Shane` or `main`. Nothing under `docs/memory/` in the lane.

## What the desk could not establish

Whether Vercel can serve a fallback only for missing files under a static output with `headers` (step 1); the Syllables list's component (step 4); how many Markup columns the gap moves (step 2); where the "break placed" Undo string shows (the Loupe's Undo reads "UNDO" on screen, `i18n.ts:493`; not in scope, report only).

## Step 7, added 2026-10-30 14:5x: the Poem field's words

- `apps/web/src/lib/i18n.ts:780` `intake.placeholder`: EN "Paste, type, or drop the published poem here." (RATIFIED 14:49). FR « Collez, saisissez ou déposez le poème publié ici. » (RATIFIED 14:51). Check whether any field other than Poem uses this key and report it.
- A new line under the Poem field, shown only while the Poem is empty and Lyrics shows the score's derived words (`scoreWords`, `apps/web/src/lib/components/Drawer/IntakeViews.svelte:63`): EN "Your score supplied the words in Lyrics. Add the published poem here to see where the song departs from it." (RATIFIED 14:49); FR « Votre partition a fourni les paroles du champ Paroles. Ajoutez ici le poème publié pour voir où la mise en musique s'en écarte. » (RATIFIED 14:51).

## Step 8, added 2026-10-30 15:0x: Learn opens as Guide does

Guide opens `<h1>Guide</h1>` then `<div class="chapter-band band-guide">` with an `h2` and a `band-deck` (`apps/web/src/lib/components/Reading/GuideContent.svelte:312-316`, FR `:17-21`). Learn opens `<h1 id="learn-title">` with its title and no band (`LearnContent.svelte:2052`, FR `:16`); its sections already use `band-learn` (umber, `apps/web/src/lib/components/Paper/ReadingPaper.svelte:132-134`). Change Learn's opening to `<h1>Learn</h1>` (FR « Leçons ») followed by `<div class="chapter-band band-learn">` with the existing title as its `h2` and the deck. Keep `id="learn-title"` on the element that carries the title, and report every reader of that id (sidebar, links, tests). EN deck (RATIFIED 14:59): "Grayson's rules for Russian lyric diction, taught so you can access Russian vocal literature on your own." FR deck (RATIFIED 15:00): « Les règles de Grayson pour la diction lyrique russe, enseignées pour que vous puissiez aborder par vous-même le répertoire vocal russe. »
