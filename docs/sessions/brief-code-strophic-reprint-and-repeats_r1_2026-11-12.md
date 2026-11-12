# Brief: MELODY prints each verse, and draws the repeats it does not unroll (N.20, D3 Job A)

This brief is the desk's. Do not edit, rename, or replace it.

r1, 2026-11-12, written by the desk (Opus) from the Sonnet scout's packet `scout-packet-strophic_r1_2026-11-12.md` (filed beside this brief; every line it cites was read on `Shane` at `dc078b95`). NOT YET FABLE-REVIEWED (CONTRACT §1 item 19). Fable's review also gives Dann the size of this work (he asked: "a two-hour job or a two-week job").

## Lane

- Branch `cloud-lane-51`, cut from `Shane` at the commit the desk names when it starts the lane. Commit and push only that branch. Never `Shane` or `main`. No pull request.
- Take every "before" reading first. To read old code, use `git show <sha>:<path>`. No `git stash`, `checkout` of files, `reset`, or `restore`.
- Report after each step in `docs/sessions/report-code-strophic-step<N>_r1_<date>.md`: what changed (file and line), tests added, gate counts, screenshots where the step draws, and "What I could not establish". NOT ESTABLISHED beats a complete invented answer.
- Other lanes may be open: `cloud-lane-48` (closing polish), `cloud-lane-49` (rhyme), `cloud-lane-50` (key changes and grace notes: it touches `staff-renderer.ts`, `page-layout.ts`, the Loupe, and `correction.ts`). Keep this lane's renderer work in new modules, and merge `Shane` before the close.

## What the singer gets

- **A strophic song is printed verse by verse.** MELODY prints the notated music once for each verse the song sings, each copy carrying only that verse's words, IPA, and marks. Every verse's pitch-and-vowel pairs are on the page.
- **A repeat whose words do not change is printed once,** with its repeat signs and volta brackets drawn as the print has them.
- **Bar numbers stay the printed ones.** Each verse opens with a small label, "Verse 2" / « Couplet 2 » (French: desk draft), above its first system, and the label stands beside the bar number at each later system start in that verse. INSIGHTS and the Loupe name a bar as "bar 12, verse 2".
- **Syllables can be placed in any verse,** and a correction to a pitch or a rhythm applies to every verse, because it is the same printed note.

## Rulings that bind this lane

- D3, ruled by Dann in E.36 (2026-08-10, project file `claude/e36-session-record_2026-08-10.md` §1.14, read by the desk 2026-11-12): *"we need each verse to receive its own set of pitches to interact with its own vowels. No to job B, the verbatim repeated text does not need to be unspooled. The reason we unpack strophic text is because that text varies. Unvaried text just needs to be printed once regardless of how many times the same text would be repeated temporally."* Job A: reprint the notated score once per verse with that verse's underlay. Job B (flattening repeats into a linear line): declined. Numbered N.20 (`docs/memory/OPEN.md:2686`).
- CONTRACT §8: "Do not delete `analyzePerVerse`; N.20 is built on it." "Do not unspool a repeat whose text does not vary."
- `OPEN.md` item 11 "Verses" (2026-10-20 22:03 to 22:06): later verses are the same song; the score's verse numbers decide which verses are sung; otherwise all are assumed sung, said once in Lyrics' receipt line ("6 verses, all assumed sung", ratified string, `INBOX.md:324`); one tap marks a verse unsung ("Verse not sung" / « Couplet non chanté », `INBOX.md:326`); an unconfirmed verse does not feed INSIGHTS' forecast as established.
- `OPEN.md`, "RULED 2026-11-12 01:05": bar numbers, option 1 (above). Final barline: unchanged.
- CONTRACT §0.1, one vowel per note, on every verse's seating.

## Design decisions (DESK DEFAULT, each for Fable's review)

1. **Reprint, not unspool (D3 Job A).** The notated score is paginated once per sung verse, as it is today, with that verse's channels (IPA, Cyrillic, withheld, syllable type, melisma, analysis). Event ids stay the printed ones; no id is duplicated inside one verse's render. Each verse's render sits in its own container carrying `data-verse="N"`, and every DOM lookup by `data-hit` (scout §3: `loupe.ts:66`, `crossing-ring.ts:90`, `MarkupPane.svelte:359`, the Loupe's readers) is scoped to the verse container, so a tap on verse 2 rings verse 2's note.
2. **Verses come from the score.** `sungVerseNumbers` (`verses.ts:22-34`) decides the verses. A song with one verse renders exactly as today, byte for byte. The IPA-in-lyric-2 hazard (scout §1e: `sunless-01-*.musicxml` carry IPA as `<lyric number="2">`): a lyric line whose syllables carry no Cyrillic letter is not a verse; it is excluded from `sungVerseNumbers` with a test on both fixtures.
3. **Pairings carry a verse.** `Pairing` gains an optional `verse` (absent means verse 1, so every stored pairing stays valid), or a second map per verse keyed the same way; Code chooses the one that changes fewer readers and says why in its report. Seating (`seatScoreWords`, `score-seat.ts:107-112`) runs once per sung verse. The literal `1` at `+page.svelte:405`, `:1943`, `:2786`, `MarkupPane.svelte:601-610` and `:~766` becomes the verse in hand.
4. **Lyrics holds every verse.** From a score, Lyrics fills with the verses one after another, separated by a blank line (a stanza break, which `processText` already keeps), each verse in the score's order. Typed Lyrics: each blank-line stanza after the first that matches the melody's syllable count is taken as the next verse. Where the counts do not match, Ilya does not guess (`OPEN.md` item 11, last sentence); the receipt line says which verses were matched.
5. **INSIGHTS and the watch list read every sung verse.** `analyzePerVerse` (`analyze-per-verse.ts:36-47`) is wired in place of the verse-1 analysis; comments name "bar 12, verse 2". An unconfirmed verse (assumed sung) is shown, and its findings are marked as assumed, per item 11.
6. **Repeat signs and voltas are drawn** from `Measure.repeatStart`, `repeatEnd`, and `ending` (`types.ts:273-306`), with the SMuFL glyphs of the default font (`repeatLeft`, `repeatRight`, `repeatRightLeft`; Maestro and Bravura hold them; Leland holds only `repeatDots`, so it composes strokes and dots), and a volta bracket at `repeatEndingLineThickness` with its pass numbers. Their room is reserved in `layoutColumns`, so `sliceWidth` and the render agree. D.C., D.S., Fine, segno, and coda: drawn where parsed (the text in the italic face, the two signs as glyphs). Repeats inside a verse are not unrolled (Job B declined).
7. **Corrections stay keyed by the printed note.** A pitch, rhythm, or barline correction applies to every verse (it is applied upstream, `bar-layer.ts:52-58`). A syllable placement belongs to the verse it was made in. A verse unsung (item 11) is one tap in Lyrics' receipt line and leaves MELODY without that verse.

## Steps

### Step 0. Read and measure

Run all eight gates and record each count. Read every line this brief and the scout's packet cite, and report any that has moved. Also establish: what `markup-pages.test.ts` and the renderer approval gate pin; every reader in `+page.svelte` of an event id or a `Measure.number` beyond the held-measure and pick paths (scout "could not establish" 6); whether `<ending number>` label text is kept; how the Loupe's re-render (`loupe-render.ts`) would take a verse. Change nothing.

### Step 1. Fixtures

Add `packages/score-parser/src/fixtures/strophic-three-verses.musicxml` (eight bars, three `<lyric number>` verses of Cyrillic words, one bar where verse 3 has an extra syllable on a split note) and `repeats-and-voltas.musicxml` (a backward repeat with first and second endings, one passage with the same words both times, and a D.C. al Fine), each with its source in a head comment.

### Step 2. Verses known, pairings per verse (decisions 2, 3, 4)

### Step 3. MELODY prints each verse (decisions 1, 5; bar numbers and verse labels)

Verse label strings (PENDING DANN, English drafts): `markup.verseLabel` "Verse %s"; FR draft « Couplet %s » (from the ratified « Couplet non chanté »).

### Step 4. Repeat signs, voltas, and jump marks drawn (decision 6)

### Step 5. The Loupe, Corrections, and INSIGHTS by verse (decisions 1, 5, 7)

Every first-match DOM lookup scoped to the verse; the Loupe's held bar knows its verse; "bar 12, verse 2" in the Loupe's tag (`loupe.measureTag` family) and in INSIGHTS' `commentTag`. Strings PENDING DANN: the verse-qualified bar tag, English draft "m. %m, verse %v".

### Step 6. Close

Merge `Shane`, run all eight gates and the Playwright suite, and write the final report with screenshots of both fixtures in MELODY at desktop width and 390 px, EN and FR, and a printed PDF of the strophic fixture.

## Computations this lane changes (CONTRACT §4)

- Which verses are sung (`sungVerseNumbers`): a lyric line with no Cyrillic letter stops counting as a verse.
- Seating, pairings, the underlay resolvers, the watch list, and INSIGHTS run per verse instead of verse 1 only; every site with a literal verse `1` (decision 3) is named in step 0's report.
- Pagination runs once per verse; `sliceWidth` gains repeat-sign and volta room.

## What the desk could not establish

- The text of `claude/e37-numbering-ruled_2026-08-10.md` (N.20's numbering record); only `OPEN.md:2686` summarises it.
- How a singer's typed multi-verse Lyrics is laid out in practice today (decision 4 is the desk's design).
- The size of this work. Fable's review estimates it.
