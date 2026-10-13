# Brief for Code on the Mac: Markup draws no syllables on «Средь шумного бала» (r2, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 21:35. QUEUE row 93. For Code on Dann's Mac, Opus, after row 89. **r2, about 21:45: applies all six of Fable's amendments** (`docs/sessions/review-fable-brief-row93_r1_2026-10-12.md`, SEND WITH AMENDMENTS). **Measures only. Nothing kept in `apps/`, `packages/`, `third_party/`, or `static/`; no fix is made in this row.** Fable reviews this brief while it runs (`CONTRACT.md` §1 item 19, the condition for a brief that only measures).

Displaces: nothing.

## 1. What was observed

Observed by the desk 2026-10-12 21:28 to 21:31 in Dann's Chrome, on the alias `ilya-git-shane-dannmittons-projects.vercel.app` serving `72b564f` (deployment `dpl_5B3nydvcie5xQ1d2KHeC2WwynDT1`), on Dann's own library:

- The song «3. Средь шумного бала» (Tchaikovsky, Op. 38 no. 3) is a scan with a typed poem. Its score file is `Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf`; the Input drawer says « Cette partition ne contient aucun mot » and that the text sits under the notes one syllable per note.
- The console says `[Ilya] N.160 seats: 170 drawn live, 0 kept as stored, of 170 seated` and `[Ilya] N.160 dry run: 170 seated = 170 address + 0 anchor + 0 joined + 0 rejected + 0 unfound. Nothing written.`
- **Text** draws the whole poem with its IPA. **Markup** draws the notes on 3 pages and no syllable, no IPA, and no vowel mark: the 445 `<text>` elements in the page's SVGs are all music symbols.
- While the reading loaded, Markup's placeholder said Dann's [ɑ] Russian-o and [ɨ] velar-i are provisional. His voice reads "Dann · 8 of 10".
- On the same voice, «Within Four Walls» (score `Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`, lyrics in the file) draws its syllables in Markup and shows no provisional line.
- Whether Markup drew this song's syllables before `72b564f` is NOT ESTABLISHED: the desk has no view of the library from before the ship.

## 2. What is established, each line carrying its `path:line`

- Rows 78a, 78b, 78c, and 79 are in `72b564f` (`git log -1 --stat 72b564f`, read by the desk 2026-10-12: it lists `placeholder-line.ts`, `placeholder-mark.ts`, `ring-geometry.ts`, and `page-layout.ts`), the commit the alias serves, and change Markup: 78a's Markup top line (`apps/web/src/lib/analysis/placeholder-line.ts:47`, `MarkupPane.svelte:726` at the time of row 78a's report), 78b's hollow placeholder head (`packages/score-parser/src/placeholder-mark.ts`), 78c's red ring and room (`packages/score-parser/src/ring-geometry.ts`, `staff-renderer.ts`), 79's pagination (`packages/score-parser/src/page-layout.ts`). Line numbers are from the reports; re-read before use.
- Row 78c's measurements of this song were taken from the MusicXML fixture `tchaikovsky-op38-3-voice.musicxml`, lyrics in the file, not from the scan with a typed poem (`docs/sessions/rows-78-79-shots/rings.mjs:15`, `shoot.mjs:16`). Row 78b pictured *Without Sun* no. 1 only (`report-code-row78b_r1_2026-10-11.md:73-74`). Row 79's pictures: NOT ESTABLISHED from the desk's copy.

## 3. Measure

1. Run the eight gates at the tree as it stands; record the counts.
2. Reproduce on the dev server, on the tree as it stands (`72b564f` plus whatever row 89 left uncommitted; say which): a new song from the PDF `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` through the drop box, with the poem `docs/sessions/measure-markup-blank_2026-10-12/poem.txt` typed in the poem box, and a stored bass voice in which every vowel is sampled except [ɑ] Russian-o and [ɨ] velar-i (as `rows-78-79-shots/shoot.mjs` builds a voice), in French, as Dann saw it (`shoot.mjs` takes `fr`), with the voice built as `shoot.mjs` builds it under `sampled=i,e,ɪ,ɛ,a,ʌ,o,u` (`shoot.mjs:12, 22`). `shoot.mjs` feeds a fixture to the file input and types no poem (`:31-37`), so extend a copy of it under `docs/sessions/measure-markup-blank_2026-10-12/`, never under `apps/`. Report whether Markup draws the syllables, and count the lyric `<text>` elements.
2b. Reload the page and reopen the song from the library, with the same voice. Report whether Markup draws the syllables and the console's `N.160 seats` line. Dann's observation was on a stored song (`0 kept as stored`), not a fresh drop (`MarkupPane.svelte:224-228`, the pairing map stored at `ilya:pairings`).
3. Repeat step 2 with every vowel sampled. Then repeat both with the MusicXML fixture `tchaikovsky-op38-3-voice.musicxml` in place of the PDF, with the poem box left empty, so the fixture's own lyrics are the only text (the lyrics-in-file path). Report the four results as a table.
4. If any of the four is blank, repeat that case at `9f9e896` in a separate worktree outside the tree (`git worktree add` is a write: instead copy the tree with `git archive 9f9e896 | tar -x -C <a folder outside the repository>`, install, and run its dev server on another port), and report whether it was blank there too. Use a copy of the harness with `REPO` (`shoot.mjs:7`) and the port (`:31`) pointed at the archived copy. If the copy's install fails or its dev server draws primitive noteheads instead of Finale Maestro, report that case as NOT ESTABLISHED, not as blank: `git archive` omits ignored and untracked files.
5. Where it is blank, find where the syllables drop out between the seats (`N.160 seats` above) and the Markup SVG, and say the cause in one sentence with its `path:line`.

## 4. The rulings this serves

- Rows 78a, 78b, and 78c wait for Dann's walk on this song (`docs/memory/QUEUE.md`).
- `CONTRACT.md` §1 item 13, the need: IPA seated under the melody and Russian under that.

## 5. Constraints

- Measures only; no fix. No git command that writes (the `git archive` read is allowed; `git worktree` is not).
- Set 3's six sealed songs and set 4 stay unopened.
- Do not touch Dann's own browser or its library.

## 6. Done when

- The four-case table from step 3, step 4's answer for each blank case, and step 5's cause with `path:line`, or NOT ESTABLISHED with what was tried.
- Gates unchanged.

## 7. Report back

`docs/sessions/report-code-markup-blank-tchaikovsky_r1_2026-10-12.md`, with a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set row 93's State in `docs/memory/QUEUE.md` and stop.
