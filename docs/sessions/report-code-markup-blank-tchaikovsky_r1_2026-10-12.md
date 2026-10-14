# Report: Markup draws no syllables on «Средь шумного бала» (row 93, r1, 2026-10-12)

Written by Code (Opus 5.5) on Dann's Mac, 2026-10-12, for the brief `brief-code-markup-blank-tchaikovsky_r2_2026-10-12.md`. Measures only. Nothing in `apps/`, `packages/`, `third_party/`, or `static/` was touched. No git command that writes was run.

## The tree

- Branch `Shane` at `1ec2ef2`, not `72b564f`. Row 89 was committed in `1ec2ef2`, so it left nothing uncommitted in code. The working tree was dirty only in `docs/memory/` (`QUEUE.md` at the start; `ENVIRONMENT.md`, `SCHEDULE.md`, `STATE.md`, and `STATE-archive.md` by the gates run, edited by the desk meanwhile).
- Between `72b564f` and `1ec2ef2`, `MarkupPane.svelte` changed in comments only (`git diff 72b564f 1ec2ef2 -- apps/web/src/lib/markup/MarkupPane.svelte`, every changed line a comment). The other code changes are `notation-overlay.ts` removed (dead), `triplets.ts`, and the new `offers-for-a-bar.ts`.
- To cover `72b564f` itself, the same harness was also run against that commit's own deployment (`dpl_5B3nydvcie5xQ1d2KHeC2WwynDT1`, `ilya-8err5uy8u-dannmittons-projects.vercel.app`, which is the deployment Dann walked) and against the alias, which now serves `1ec2ef2` (`dpl_CBfLHxYShiNrT4uQVmtgnQcygs3v`). Both are read off the Vercel deployment list.

## Gates (step 1)

From a scratch copy of `~/Downloads/ilya-ship.sh` with the untracked-file refusal and everything after the gates removed (it cannot stage or commit). All eight at baseline:

| Gate | Result |
|---|---|
| 1 phonology | 251 passed (251) |
| 2 dictionary | 248 passed (248) |
| 3 web-check | 0 errors and 12 warnings in 5 files |
| 4 web-test | 2448 passed (2448) |
| 5 score-parser | 675 passed, 5 skipped (680) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | OK |

## The harness

`docs/sessions/measure-markup-blank_2026-10-12/case.mjs`, extended from `rows-78-79-shots/shoot.mjs`: the same voice store (a bass voice "Dann", the same formants and characteristics), French, a fresh headless Chrome context with WebGPU on and service workers blocked. For `pdf` it types `poem.txt` into the poem box (`textarea.text-input`) and drops `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` on the file input; for `fixture` it drops `tchaikovsky-op38-3-voice.musicxml` and leaves the poem box empty. It waits for the `N.160 seats` line, opens Markup, waits 9 s, and counts every `<text>` in the Markup SVGs by kind: Cyrillic, Latin or IPA, SMuFL only, other (bar numbers and the `[8]` bracket). With `reopen`, it then reloads the page in the same context (same IndexedDB and localStorage), lets the stored song reopen on its own, and counts again. Results, logs, and a picture of page 1 at each stage are in `measure-markup-blank_2026-10-12/out/`.

Step 2b's reload reopened the song by itself; no library list was shown, so no song was picked from one.

## The four cases (steps 2, 2b, 3), dev server at `1ec2ef2`

| Case | Source | Voice | Fresh: Cyrillic / IPA `<text>` | Reopened: Cyrillic / IPA `<text>` | `N.160 seats` line (both stages) | Pages with systems |
|---|---|---|---|---|---|---|
| A | PDF, poem typed | 8 of 10 (no [ɑ], no [ɨ]) | 340 / 340 | 340 / 340 | 170 drawn live, 0 kept as stored, of 170 seated | 3 |
| B | PDF, poem typed | 10 of 10 | 340 / 340 | 340 / 340 | 170 drawn live, 0 kept as stored, of 170 seated | 3 |
| C | fixture, poem box empty | 8 of 10 | 344 / 348 | 344 / 348 | none logged | 3 |
| D | fixture, poem box empty | 10 of 10 | 344 / 348 | 344 / 348 | none logged | 3 |

**None of the four is blank.** Markup draws the syllables and their IPA in all of them, fresh and reopened. The first Cyrillic cells read «Средь», «шум», «но», «го»; the first IPA cells read ˈsrʲetʲ, ˈʃum, nʌ, vʌ, verbatim from the page. The PDF cases log the same dry-run line Dann saw: `170 seated = 170 address + 0 anchor + 0 joined + 0 rejected + 0 unfound. Nothing written.` The fixture cases log no `N.160 seats` line, because the file's own lyrics are the text and nothing is seated. The counts take every `<text>` in every SVG inside the Markup container: 32 SVGs for 13 systems. 340 is exactly twice 170 seats, so each syllable is probably drawn in two SVGs (for example a page and a copy of it); not checked further, and it does not change the answer. No page error in any log.

Further cases, beyond the brief, run to close the gap with what Dann saw:

| Case | Where | Fresh | Reopened |
|---|---|---|---|
| E | the alias, now serving `1ec2ef2`, case A's set-up | 340 / 340 | 340 / 340 |
| F | `72b564f`'s own deployment, case A's set-up | 340 / 340 | 340 / 340 |
| G | dev server, case A with the poem typed after the score arrived | 340 / 340 | 340 / 340 |

## Step 4

Not run: no case is blank, and step 4 applies only to a blank case. Case F already ran `72b564f`'s own production build.

## Step 5

Not run: no case is blank, so there is no point between the seats and the Markup SVG where the syllables drop out.

## Could not establish

- **Why Markup was blank for Dann. NOT ESTABLISHED.** Every case tried draws the syllables, including the exact deployment he walked (case F) and the stored-song path (2b). What differs between these cases and his, none of it tried, since the brief forbids touching his browser and library:
  - his library's own stored record for this song (written before `72b564f`, possibly by an older build) and its `ilya:pairings`, as against a song created fresh in each case here;
  - his own voice record, as against the synthetic one;
  - his settings beyond language (notation preferences, the stress diacritics switch, Open syllables, Reconstitution), all at their defaults here;
  - his browser (Chrome with its service worker, which these runs block), as against headless Chrome.
- **Two readings of Dann's page that these runs do not match**, which may help the desk:
  - The desk counted 445 `<text>` elements, all music symbols. Every run here counts 1269 to 1325 SMuFL elements and 26 bar numbers on 3 pages. Whether Dann's 445 covered one page, a page drawn before the rest, or a different drawing: NOT ESTABLISHED.
  - The desk saw a provisional line naming [ɑ] and [ɨ] while the reading loaded. With the same two vowels unsampled, every run here names [ɑ] alone in the settled page (« Votre voyelle [ɑ] repose sur une valeur par défaut … »). The transient line during loading was not captured.
- **A lead, not a cause.** The renderer draws a note's IPA as `options.ipaPreview?.[ev.id] ?? a?.vowel` and its Cyrillic as `options.cyrPreview?.[ev.id] ?? syl?.text` (`packages/score-parser/src/staff-renderer.ts:3157-3158`). A page with no Cyrillic, no IPA, and no vowel mark at all on a seated scan needs both previews to miss every note and the analysis to give no vowel. That fits Markup drawing an event list whose ids match none of the stored pairings' keys (`pairings` is keyed by event id, `MarkupPane.svelte:224-228`), for example a stored reading whose ids differ from the ids the pairings were written against. Not measured.
- **Next step that would settle it**, for the desk to brief: export Dann's stored record for this song (the `ilya-library` IndexedDB entry and `ilya:pairings`) from his own browser, by his hand, and load that record into a fresh origin on the dev server.

## Done when

- The four-case table: above. None blank.
- Step 4: not applicable (no case blank).
- Step 5: NOT ESTABLISHED; not reproduced.
- Gates unchanged: all eight at baseline.
