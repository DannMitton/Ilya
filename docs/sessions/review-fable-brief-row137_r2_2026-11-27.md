SEND WITH AMENDMENTS

# Review r2 of `brief-code-row137-page-name_r2_2026-11-27.md` (QUEUE row 137)

2026-11-27, Fable, for the desk. Brief md5 `4031fb04cb1eb390c5058fd72747f4b2` (matches `4031fb04`). Tree: branch `Shane` at `79d6d18e1c81438733936b626ba37a63fb7ac5ea`, read through the bridge this session; nothing under `apps/` or `packages/` is modified. Paths are under `apps/web/src/` unless they start elsewhere. No source file was modified and git was read only.

r2 as written does not go. Amendments 1 to 4 are must-apply: each one is a place where a lane following the brief to the letter ships the row's own bug or cannot finish. None needs Dann, and none needs a third review if applied as written.

## The five r1 blockers

1. **Ratchet ceiling: CLOSED, with amendment 7.** `scripts/ratchets.json:8` still reads 5533 and `wc -l routes/+page.svelte` returns 5533 at `79d6d18e`. r2 `:62-64` puts the name in a pure `.ts` file with a test and has the lane report the lines gained and given up; done-when 10 (`:143`) pins the ceiling. That is enough to stop a breach. It leaves the lane free to choose what the page gives up, which amendment 7 bounds.

2. **`extractSurname`: CLOSED, with amendment 5.** r2 `:70-73` adds a sibling and forbids the edit. The running header is untouched by that: `extractSurname` (`lib/page-config.ts:169-178`) is imported by no file outside `page-config.ts`; its only callers are inside `formatRunningHeader` (`:188`), which `Paper.svelte:152`, `MarkupPane.svelte:936`, and `InsightsPane.svelte:482` call. Nothing depends on there being one such function: there are already two by that name. `lib/composers-poets.ts:200` exports an `extractSurname(entry: PersonEntry)` that returns mixed case, and I found no importer of it under `src`.

3. **Naming sites: PARTLY CLOSED.** The sites are named and the sanitizer is shared, but (a) the range r2 gives for the extraction is wrong (amendment 3), (b) `proposeName` cannot be called for the name r2 wants (amendment 2), and (c) the table still omits four sites (amendment 10). `binderFileName`'s only callers are `lib/library/exchange.ts:129` and `:130`, and its behaviour is pinned at `lib/library/binder.test.ts:81-99`, so a clean extraction leaves them unaffected.

4. **Vowel-space sheet: CLOSED in design, with amendment 6.** `cleanUp` (`lib/voice/chart/print-sheet.ts:31-38`) already runs once, on `afterprint` (`:39`) or right after `print()` where `afterprint` is absent (`:49`), and already undoes a body-level change (`:37`). A title held from `:29` to `cleanUp` has the same lifetime as the body class, so the path can carry it. r2 does not say where the sheet gets either title from.

5. **The case: ACCEPTED on the desk's attestation, not verified.** I cannot read the thread. The tree now records it at `docs/memory/QUEUE.md:248` ("he was shown `Alyabyev - Solovey - MELODY` in mixed case"). `docs/memory/DANN.md:48`, the ruling's own record, does not carry the example he was shown; add it there. The surname-only composer and the spaced hyphen ride on the same example. Remaining unflagged choices, all reversible and all DESK DEFAULT to mark, none owed to him: the name for a song with neither title nor composer (amendment 1), the date form in an untitled name (amendment 1), and whether her own name for the song (`doc.name`) has any part (amendment 10).

## Check 2: the always-on title

Flagging it with done-when 8 is enough; it does not go to him first. It is reversible, the lane commits nothing (r2 `:158`), and his look comes before anything reaches the tree. Two additions: state the cost of the literal path in the brief (setting the title only around a print does not reach a saved page, which QUEUE row 137 includes), and have done-when 8 show the tab's label with a song open and with none. No e2e test pins the title: `toHaveTitle`, `page.title`, and the static string return no hit in `apps/web/e2e` or `apps/web/e2e-phone`.

## Must-apply amendments

1. **Step 1's condition contradicts step 2's chain (r2 `:76-77` against `:81-83`; done-when 6, `:139`).** Step 1 names a page only when the song has a title or a composer. Step 2 uses a chain whose later links (file base name, poem words, `songs.untitled`) are reached only when it has neither. A lane that follows step 1 gives a pasted poem with no title the static title on all three documents: the row's own bug, on the commonest first use, and all ten done-when items pass. "With no song" names no state I could find: the page builds `doc` at `routes/+page.svelte:271` and I found no path with none (NOT ESTABLISHED beyond that line). Apply: on the studio the name is always built; the chain decides its first part; when the chain is empty the first part is `placeholderName(doc.createdAt, t('songs.untitled', language))` (`lib/library/songs.ts:81-83`; `document.svelte.ts:200`), which is ISO and reads alike in both languages, not `todayInWords()` (`routes/+page.svelte:2931-2937`). Mark it DESK DEFAULT. Done-when 6 becomes "off the studio" only, and done-when 4 gains a third case: a song with words and neither title nor composer.

2. **`proposeName` cannot be called for this name (r2 `:81-82`, table `:111`).** With both fields present it returns the full composer, a comma, and the title (`songs.ts:47`), not surname, hyphen, title. Its tail (`songs.ts:50-54`) has no seam, and `fileBaseName` is not exported (`songs.ts:65`). It takes a whole `SongRecord`; the page's route to one is `doc.toRecord()` (`document.svelte.ts:584-586`), and what a reactive title would then re-run on is NOT ESTABLISHED. So "reuse the chain" as written means a copy or a call that yields the wrong form. Apply one, and say which: (a) recommended: the lane exports the tail (`songs.ts:50-54`) as its own function, `proposeName` calls it, `songs.test.ts:52-133` stays unedited as the guard, the new function takes plain strings, and the table's `songs.ts` row changes from "unchanged" to say so; cost: one edit in `songs.ts`. (b) the chain stops at composer and goes to the placeholder; cost: a pasted poem with no title is named "Untitled".

3. **The sanitizer range is wrong and the cap eats the page name (r2 `:92-94`).** The sanitizing is `binder.ts:75-81`. Line `:82` is a fallback, `Untitled, ${today}`, in English, with a `today` parameter; the cap is `:83-84`. Extracting `:74-84` whole carries an English word into a French filename and bypasses `songs.untitled`. Apply: the shared function is `:75-81` plus `:83-84`, string in, string out, empty allowed; `:82` stays in `binderFileName`; the existing cases at `binder.test.ts:81-99` stay unedited. Second: the cap trims from the end (`:84`), so on the whole name a long title loses ` - MELODY` first and three documents propose one filename again. Apply: each part is sanitized before the chain tests it for empty (a title of `///` sanitizes to nothing, the case `binder.test.ts:95` already pins), the composer-and-title part is capped, and the page name is appended after the cap.

4. **Done-when 1, 2, 3, and 7 are read in a native dialogue; say who reads it.** Whether the lane can open and read Chrome's save step is NOT ESTABLISHED, and a lane that cannot will either stall or report from `document.title` and call it the dialogue. Apply: the lane proves the string (the unit test, and `document.title` read in the running page in each state); the dialogue read is named as the desk's or Dann's look, with the browser named.

## Further amendments

5. **The sibling (r2 `:70-73`).** "Share the same stripping rules" and "do not edit" together mean two copies of `page-config.ts:170-177`. Keep "do not edit", since only the "First Last" form is pinned today (`components/Paper/one-head-one-foot.test.ts:47-49`). Tie the copies with a test: for "First Last", "Last, First", and a name with parenthesized dates, the sibling uppercased equals `extractSurname`. Give the sibling a name that is not `extractSurname`, given `composers-poets.ts:200`.

6. **Step 4's mechanics (r2 `:99-102`).** `print-sheet.ts` is under `lib/voice/`, which may import only `reader` and `score` among the six modules (`scripts/ratchets.mjs:78-85`); a file outside the six is free (`:87-91`). Say that the new file lives outside `melody/` and `insights/`, that it holds the title captured at start, and that the sheet takes the static title from it. The sheet's restore has to come from that file's record of the song's name, not from `document.title` read when the sheet opens: a second press before the first dialogue closes would read the static title as "the song's" and leave it there (whether a second press is reachable is NOT ESTABLISHED). Guard `document` as `print-sheet.ts:24` does, since `routes/+layout.ts` sets `prerender = true`. Add a done-when: after the sheet's dialogue closes, the title is the song's again. As written, a sheet that never restores passes all ten.

7. **What the page may give up (r2 `:63-64`).** Say that no comment carrying a ruling pays for the lines (for example `routes/+page.svelte:4440-4450`), and that no lines are joined to pay. One candidate from the tree: `handlePrint` (`:2166-2168`) is three lines with one caller (`:4453`).

8. **Done-when 5 is circular (r2 `:137-138`).** It passes today on `binder.test.ts:87` with no work. Write the literal: composer `Nikolai Rimsky-Korsakov`, title `A/B: C`, document MELODY, English, gives `Rimsky-Korsakov - A B C - MELODY`, asserted on the name function, not on the sanitizer.

9. **Done-when 9 passes with any test (r2 `:142`).** List the cases: three documents by two languages, all six different; no title; no composer; neither; a title long enough to reach the cap, with the page name still present and the three still different; the literal of amendment 8; the tie test of amendment 5.

10. **Table gaps (r2 `:106-114`).** Add `lib/library/document.svelte.ts:201-207` (`doc.name`, her own name for the song, which wins for the binder at `exchange.ts:106-108` and has no part in the page's name; mark that DESK DEFAULT), `lib/composers-poets.ts:200`, `lib/voice/engine/capture-file.ts:178` (a download name, unrelated to songs), and `routes/notation-font-lab/+page.svelte:50` (a second static title on its own route).

11. **A wrong line, and it was mine.** r2 `:85` cites `+page.svelte:4445-4446` for "A singer can still print those pages from the browser's own menu". The words are at `:4440-4441`. r1's amendment 4 gave the wrong lines and r2 carried them.

## Check 3: what is new in r2

- **Mixed-case sibling:** sound; amendment 5.
- **Shared sanitizer:** right idea; amendment 3.
- **`doc.metadata` condition:** citation true (`routes/+page.svelte:1725`); wrong as the gate; amendment 1. That condition came from r1's amendment 3, so the fault is partly mine.
- **Off-studio rule:** sound. `destination` (`:355`) is readable where the name is built, and the Print button is studio only (`:4451-4453`).
- **Restore, do not copy:** sound; amendment 6 says where the captured value lives.
- **Other citations in "What is true today":** `:238`, `:355`, `:356`, `:357` hold; `lib/i18n.ts:210`, `:228`, `:232`, `:305`, `:1761` hold; `binder.ts:73` and `:85`, `songs.ts:44` and `:81` hold. `TitleHeader.svelte` lines were not re-read this session.

## Check 4: the ten done-when items

| item | passes while every page proposes one name? | fails on a correct repair? |
|---|---|---|
| 1 | No | Only if nobody can read the dialogue (amendment 4) |
| 2 | No | Same |
| 3 | No | Same |
| 4 | No for the two cases named; the neither case is not named, and there one name passes (amendment 1) | No |
| 5 | Yes: it passes today (amendment 8) | No |
| 6 | Yes: it describes today; a guard | Yes: "with no song" fails a lane that follows step 2 (amendment 1) |
| 7 | Yes: a guard; no restore is checked (amendment 6) | Only by amendment 4 |
| 8 | Yes: a report, no pass or fail | No |
| 9 | Yes: any test satisfies it (amendment 9) | No |
| 10 | Yes: true today; a guard | No |

Not covered by any item: a title past the cap (amendment 3), and the restore after the sheet's print (amendment 6). The running header needs no item: `one-head-one-foot.test.ts:47-49` pins its uppercase.

## What I could not establish

- The thread. Blocker 5 closes on the desk's word and `QUEUE.md:248`.
- What any browser proposes from `document.title`, what it does to `/`, `:`, or length, and whether it reads the title when the dialogue opens or when the file is saved. No browser was run.
- Whether the lane can read a native print or save dialogue.
- Whether the vowel-space sheet can be printed with a titled song open (`CalibrationWizard.svelte:866` mounts it; reachability not traced), and whether its Print can be pressed twice.
- Whether a state with no `doc` exists beyond `routes/+page.svelte:271`.
- What `doc.toRecord()` reads reactively; `#snapshot` was not read.
- When `doc.name` is filled (`songs.ts:179-186` derives it from `proposeName`; its callers were not traced). If it is filled before a print, it could stand in for the chain's tail with no edit to `songs.ts`.
- Whether a `svelte:head` title beside `app.html:45` yields two `<title>` elements. Not read.
- Which eight gates the ship script runs. It is outside the mounted folder.

## Terms

Adopted from the tree and the record: running header, ratchet, ceiling, DESK DEFAULT, binder, sibling. Coined here: tie test (amendment 5).

Tool uses: 11, counting the write of this file and the hand-back.
