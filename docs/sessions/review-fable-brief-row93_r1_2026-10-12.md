# Review: brief-code-markup-blank-tchaikovsky_r1 (row 93), Fable, 2026-10-12

Read whole: the brief, `shoot.mjs`, `rings.mjs`, `MarkupPane.svelte` (1349 lines), `placeholder-line.ts`, reports 78b and 78c. The upload holds no `docs/memory/`, no `CONTRACT.md`, no row 78a or 79 report, no `poem.txt`, and no fixtures folder.

## Verdict

SEND WITH AMENDMENTS (6). The brief measures and does not fix, section 1 is observation only, and the four cases separate two of the three causes. It misses the stored-song path, under-specifies the fixture cases and the language, and leans on a harness that cannot run step 2 or step 4 as written.

## Citations table

| Brief | Claim | Checked against | Holds |
|---|---|---|---|
| §2 l.20 | `placeholder-line.ts:47` is Markup's top line | `placeholder-line.ts:46-51`, `placeholderLine(..., page)` | yes |
| §2 l.20 | `MarkupPane.svelte:726` (78a) | `MarkupPane.svelte:724-726`, `placeholderNote` | yes, still at 726 |
| §2 l.20 | 78b: `placeholder-mark.ts` | report 78b:17 | yes |
| §2 l.20 | 78c: `ring-geometry.ts`, `staff-renderer.ts` | report 78c:17, 24, 28-33 | yes |
| §2 l.20 | 79: `page-layout.ts` | no row 79 report supplied | NOT ESTABLISHED |
| §2 l.20 | all four shipped in `72b564f` | reports 78b:5 and 78c:5 say tree `9f9e896`, work uncommitted | NOT ESTABLISHED |
| §2 l.21 | `rings.mjs:15`, `shoot.mjs:16` load the MusicXML fixture | `rings.mjs:14-15`, `shoot.mjs:15-16` | yes |
| §2 l.21 | 78b's pictures of this song came from the fixture | report 78b:73-74: pictures are of *Without Sun* no. 1 only | no, 78b pictured no Tchaikovsky |
| §2 l.21 | 78c's pictures of this song came from the fixture | report 78c:58, 67-74, 97-98 via `rings.mjs` | yes |
| §3 step 2 | `shoot.mjs` builds a stored bass voice | `shoot.mjs:18-24`, name `Dann`, `voiceType: 'bass'` | yes |
| §3 step 2 | "8 of 10" matches two unsampled vowels | `shoot.mjs:12, 22`: `sampled=` lists the sampled set | yes |
| §3 step 4 | `9f9e896` precedes rows 78a to 79 | report 78b:5 ("78a uncommitted before this row") | yes |
| §1, §3, §4 | `CONTRACT.md` §1 items 13 and 19; `QUEUE.md`; deployment id; counts 170 and 445 | not in the upload | NOT ESTABLISHED |

## Findings

1. Section 1 holds observation only. Line 16 marks the one thing it cannot see. No cause appears.
2. The four cases separate the voice axis (placeholders) from the source axis (typed poem versus lyrics in file), and step 4 separates the tree. One axis is missing: Dann saw a song reopened from his library, whose seats were "drawn live, 0 kept as stored"; step 2 makes a fresh drop. `MarkupPane.svelte:224-228` says the pairing map is owned by `+page.svelte` and stored at `ilya:pairings`, so a reload path exists that a fresh drop never exercises.
3. The fixture cases do not say whether the poem is typed. With the poem typed, the fixture case is no longer the lyrics-in-file path.
4. Dann observed in French (§1 l.11 quotes the drawer in French). The brief names no language for the repro; `shoot.mjs:4, 30` takes one.
5. `shoot.mjs` cannot run step 2 as written: it feeds a MusicXML fixture to `input[type="file"].hidden-input` (`:34`) and has no poem-typing step (`:31-37`). The PDF-plus-poem path needs an extended harness. Where a copy of it lives matters under §5's "nothing kept in `apps/`".
6. Step 4's `git archive 9f9e896 | tar -x -C <outside>` reads the object store and writes nothing to the repository or its index. `install` writes only inside the copy. Sound. Two costs: `shoot.mjs:7` resolves `REPO` to `~/Desktop/ilya-rewrite` and `:31` hardcodes `localhost:5173`, so the archived copy on another port needs its own copy of the script; and `git archive` omits untracked and ignored files, so if fonts or vendored inputs are ignored the copy may render in primitive mode or fail to install. Whether anything is ignored: NOT ESTABLISHED (no `.gitignore` or `.gitattributes` in the upload).
7. Step 5 asks for a cause in one sentence. That is analysis, not a fix, and stays within "measures only".

## Amendments

1. §2 l.21, replace with: "Row 78c's measurements of this song were taken from the MusicXML fixture `tchaikovsky-op38-3-voice.musicxml`, lyrics in the file, not from the scan with a typed poem (`docs/sessions/rows-78-79-shots/rings.mjs:15`, `shoot.mjs:16`). Row 78b pictured *Without Sun* no. 1 only (`report-code-row78b_r1:73-74`). Row 79's pictures: NOT ESTABLISHED from the desk's copy." Reason: 78b's report carries no picture of this song.
2. §3 step 2, after "typed in the poem box", add: "in French, as Dann saw it (`shoot.mjs` takes `fr`), with the voice built as `shoot.mjs` builds it under `sampled=i,e,ɪ,ɛ,a,ʌ,o,u` (`shoot.mjs:12, 22`). `shoot.mjs` feeds a fixture to the file input and types no poem (`:31-37`), so extend a copy of it under `docs/sessions/measure-markup-blank_2026-10-12/`, never under `apps/`." Reason: the harness named cannot run the case named, and the language is unstated.
3. §3, new step 2b: "Reload the page and reopen the song from the library, with the same voice. Report whether Markup draws the syllables and the console's `N.160 seats` line. Dann's observation was on a stored song (`0 kept as stored`), not a fresh drop (`MarkupPane.svelte:224-228`, the pairing map stored at `ilya:pairings`)." Reason: the stored path is a plausible cause the four cases never reach.
4. §3 step 3, replace "in place of the PDF" with: "in place of the PDF, with the poem box left empty, so the fixture's own lyrics are the only text (the lyrics-in-file path)". Reason: a typed poem over the fixture would collapse the source axis.
5. §3 step 4, append: "Use a copy of the harness with `REPO` (`shoot.mjs:7`) and the port (`:31`) pointed at the archived copy. If the copy's install fails or its dev server draws primitive noteheads instead of Finale Maestro, report that case as NOT ESTABLISHED, not as blank: `git archive` omits ignored and untracked files." Reason: the harness is pinned to the main tree and the archive may be incomplete.
6. §2 l.20, replace "shipped in `72b564f`" with "are on the alias Dann walked, serving `72b564f` (NOT ESTABLISHED from the reports, which record `9f9e896` with the rows uncommitted; confirm with `git log -1 --stat 72b564f`, a read)". Reason: no supplied file ties the four rows to that commit.

## Leads for the desk only

Not for the brief. Each decides whether a syllable reaches the renderer; none is a cause until step 5 measures it.

- `MarkupPane.svelte:613-647`, `ipaPreview`. A note's IPA comes from `pairings[ev.id]` only when `paired.kind === 'syllable'` (`:633-635`); `drawnUnderlay` is consulted on that branch alone (`:634`). Otherwise it comes from `underlayResolvers.ipa(ev)` (`:635`), the file's own lyric. A scan with no words in the file and no `syllable` pairing yields nothing, and `:646` returns `undefined`, so `:854` passes no `ipaPreview` at all.
- `MarkupPane.svelte:638-645`, the comment citing `staff-renderer.ts:2463` (`options.ipaPreview?.[ev.id] ?? a?.vowel`): with no `ipaPreview`, the renderer's fallback is the analysis vowel. Not read this session; a lead to verify.
- `MarkupPane.svelte:670-685`, `cyrPreview`: `pairedCyrillic(pairings, blankUnderlay)` (`:678`) plus the resolver's modern spelling (`:674-677`); `drawnUnderlay` only re-acutes what is already there (`:682-683`).
- `MarkupPane.svelte:629` and `:662`: `blankUnderlay` suppresses IPA and withheld sigla for a note with no `syllable` pairing.
- `MarkupPane.svelte:839-862`, `scorePages` needs `readingScore && analyzed`; `analyzed` (`:719-723`) needs `analysisScore && vowelResolver`. Notes drew, so this gate passed.
- `MarkupPane.svelte:592-599`, `buildUnderlayResolvers(readingScore, 1, { transcribedLines })`: `transcribedLines` (`:222`) is the donor pass from Transcribe; absent or empty means no donor pass. Whether the typed poem arrives here or as `pairings`: NOT ESTABLISHED from this file.

## Could not establish

- Whether rows 78a to 79 are in `72b564f`, and what row 89 left uncommitted.
- Row 79's report and `page-layout.ts`.
- `CONTRACT.md` §1 items 13 and 19 and the QUEUE entries.
- Whether `poem.txt` exists at the path step 2 names.
- Whether any file the dev server needs is gitignored and so absent from a `git archive` copy.
- How `+page.svelte` turns a typed poem into `pairings` or `drawnUnderlay`; only `MarkupPane.svelte`'s side was read.
