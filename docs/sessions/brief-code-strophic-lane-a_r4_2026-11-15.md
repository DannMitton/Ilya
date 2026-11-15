# Brief: MELODY unfolds a strophic song continuously (strophic lane A of five)

This brief is the desk's. Do not edit, rename, or replace it.

r4, 2026-11-15 00:1x, written by the desk (Opus). It replaces r3 (`brief-code-strophic-lane-a_r3_2026-11-12.md`), which Dann's ruling of 2026-11-12 13:41 superseded before it was sent: r3 printed the whole song once per verse, each verse on a new system; the ruling is one continuous line of music in the order it is sung. r4 keeps every r3 mechanism the ruling leaves standing (the verse view, the no-Cyrillic rule, the inert later verses, the per-verse build, the strings, the byte baseline; r3 applied all twelve amendments of Fable's review of r2) and replaces r3's pagination design with a performance-order render score. Not yet reviewed by Fable.

Citations were read by the desk at `Shane` `4e5b4ad9` on 2026-11-15 00:0x unless marked otherwise. Step 0 re-reads every line.

## Lane

- Branch `cloud-lane-56` (DESK DEFAULT number), cut from `Shane` at the commit the desk names when it starts the lane, **after lane 50 (key changes and grace notes) ships**, because lane 50 edits `staff-renderer.ts`, `page-layout.ts`, and the key-change drawing this lane reads.
- **This lane is A of five. It prints verses. It changes no pairing, no stored record, no selection, and nothing in the Loupe.** Lanes B (verses correctable), C (INSIGHTS by verse), D (repeat signs, voltas, jump marks drawn), and E (typed verses, receipt line, "Verse not sung") follow after the release (Dann 2026-11-12 01:44).
- Take every "before" reading first. Read old code with `git show <sha>:<path>`. No `git stash`, `checkout` of files, `reset`, or `restore`.
- Report after each step in `docs/sessions/report-code-strophic-a-step<N>_r1_<date>.md`: what changed (file and line), tests added, gate counts, pictures where the step draws, and "What I could not establish". NOT ESTABLISHED beats a complete invented answer.
- **Ratchets** (`scripts/ratchets.json`, read 00:0x): `MarkupPane.svelte` 1362 of 1364, `staff-renderer.ts` 3426 of 3427, `Loupe.svelte` ceiling 3012. **`MarkupPane.svelte` has two lines of room: extract before adding.** This lane edits neither `vowel-resolver.ts` nor `types.ts`, and edits `staff-renderer.ts` only if Step 0 shows the verse label cannot be placed from outside it; then it says so in the Step 0 report before any edit. Never raise a ceiling without saying so in the step report.

## What the singer gets (Dann 2026-11-12 13:41, `OPEN.md`, "STROPHIC SONGS: MELODY UNFOLDS THE SONG CONTINUOUSLY")

- **MELODY prints a strophic song in the order it is sung, as one continuous line of music.**
- **Bars outside the strophic passage (an introduction, an ending) print once.**
- **The strophic passage prints once per verse,** each pass carrying that verse's words, IPA, and marks, **each pass starting wherever the last ended, mid-system if that is where it falls.** No forced system or page break.
- **A bar inside the passage with one line of words (a refrain) appears in every pass with its words** (the "no print-once refrains" of 01:45).
- **A small "Verse 2" label stands above the bar where verse 2 begins.** Every bar keeps its printed number, tagged "· verse 2" where needed.
- **The repeat that bounds the passage is not drawn,** since the unfolding has carried it out. **Repeats whose words do not vary stay notated** (D3, Job B declined; CONTRACT §8: "Do not unspool a repeat whose text does not vary").
- **A song with one verse looks exactly as it does today.**
- Later verses are printed but not yet tappable (lane B).

## Rulings that bind this lane

- 2026-11-12 13:41 (above). It supersedes the 01:45 DESK DEFAULT "each verse starts on a new system under a Verse 2 label", and r2 and r3 of this brief.
- D3, E.36 (2026-08-10): *"we need each verse to receive its own set of pitches to interact with its own vowels. ... Unvaried text just needs to be printed once regardless of how many times the same text would be repeated temporally."* N.20 (`OPEN.md`, N.20).
- The strings, ratified 2026-11-12 12:58 (`OPEN.md`, "STROPHIC VERSE LABELS, EN AND FR"): label "Verse 2" / « Couplet 2 »; tag "12 · verse 2" / « 12 · couplet 2 », full word, no abbreviation.
- CONTRACT §8: "Do not delete `analyzePerVerse`; N.20 is built on it." "Do not change `VocalLineEvent`."
- CONTRACT §0.1: one vowel per note; a sung note that is not a continuation and carries no syllable is a mistake. This holds in every pass.
- 2026-11-12 13:21: "We serve the user. We ground our practice in established authorities and cite them scrupulously." 13:22: Ilya produces study editions, not performance editions.

## Design (DESK DEFAULT unless marked ruled)

### The machinery that already exists

`unfold` (`packages/score-parser/src/unfold.ts:150`) computes the sung order of source measures through repeats, voltas, and the jump family, as `UnfoldedMeasure { source, pass }` (`:85-90`), and flags rather than guesses (`:103-111`). `scoreInPerformanceOrder` (`performance-order.ts:64`) uses it for analysis only: it rebuilds `vocalLine` and leaves `measures` untouched, and each repeated event keeps the same id. MELODY paginates the notated score: `paginateScore(readingScore, ...)` at `MarkupPane.svelte:855`. The renderer draws no repeat sign or volta (scout packet `scout-packet-strophic_r1_2026-11-12.md`, section 5).

### D1. Verses known (r3 design 1, kept)

`sungVerseNumbers` (`verses.ts:22`) decides the verses, with one change: a lyric line whose syllables carry no Cyrillic letter is not a verse (the sunless fixtures carry IPA as `<lyric number="2">`). If no line carries a Cyrillic letter, the result is as today. Pass k of a passage sings the k-th sung verse, so a file with words on lines 1 and 3 and IPA on line 2 prints "Verse 2" for line 3.

### D2. The verse view (r3 design 0, kept)

One pure function in `verses.ts` returns the score as verse N sings it: on each sung note, `syllable` is verse N's entry (`verseNumber` 1, no `versesInfo`); in a one-line bar it is verse 1's syllable; anywhere else that verse N has no entry, the note has no syllable (a continuation). A one-line bar is a bar in which no note carries any verse's words but verse 1's. `vowel-resolver.ts` is not edited; verse 1 never passes through a view.

### D3. The passage and its passes

1. **With repeat or jump marks:** run `unfold` on the corrected score's markers (`markersFromMeasures`, `unfold.ts:677`). A pass p > 1 of a measure is **kept** only when the repeat or jump span that produced it carries words for the p-th sung verse somewhere in it; otherwise that later pass is dropped and the span prints once, as notated (CONTRACT §8). Voltas follow `unfold`: each pass prints only its own ending.
2. **Without marks, or when `unfold` flags:** if the score carries later verses, the passage is the span from the first bar in which any later verse has words to the last such bar. Bars before it print once, then the passage once per verse, then the bars after it once. The step report says which songs took this path, and that a refrain after the last bar carrying a later verse's words prints once on this path, because nothing in such a file says it belongs to the passage.
3. **One verse, or no later pass kept:** nothing changes; MELODY paginates the notated score by the same call as today.

### D4. The render score

One pure function in `packages/score-parser/src/` (a new module; `verses.ts` and `performance-order.ts` stay small) returns a `ParsedScore` whose `measures` and `vocalLine` are in the order D3 prints them:

- Each printed measure is a copy of its source measure with a new consecutive `index`, the source's printed `number` unchanged, and its repeat and ending markers removed (the bounding repeat is not drawn; the renderer draws none today).
- Its events are the source measure's events from the verse view of that pass's verse (D2). In pass 1 and in bars outside the passage, events keep their ids. In a later pass, each event takes a derived id, `<id>~v<k>` (DESK DEFAULT form; Step 0 checks that no id in the tree contains `~`), so analysis, marks, and widths of different verses never share a key.
- The function reports, per printed measure, its source index, its pass, and its verse place k, so MarkupPane can label and mark it.

Corrections are applied before MELODY sees the score (`bar-layer.ts`, per the scout packet); the render score is built from the corrected score, so a correction to a shared note shows in every pass. Key and time signatures need no special case: a later pass that returns to the opening key after a modulation shows the key change where the renderer already draws one; Step 4's pictures show it.

### D5. Each verse built the way verse 1 is (r3 design 4, adapted)

For each later verse, from its view: `buildUnderlayResolvers(view, 1, { openSyllabification })` (as at `MarkupPane.svelte:606`), then `resolveAdvice(analyzeScore(...))` (as at `:733`), the IPA channel through `applyNotationPreferences`, the withheld set, and the modern-spelling Cyrillic, keyed by the derived ids. No pairings, no blanks, no transcribed lines. This lives in a new module under `apps/web/src/lib/markup/`, with its own tests; `MarkupPane.svelte` only calls it. Verse 1 keeps today's live path. The legend reads every verse. `analyzePerVerse` stays, untouched.

### D6. Later passes are inert

Every element drawn for a later-pass event carries `data-verse="k"`, and its `data-hit`, `data-event-id`, `data-of-event`, and `data-ipa-of` are renamed with a `data-verse-` prefix (precedent: `Loupe.svelte:1131-1141`, r3 read). A system whose every sung event is a later pass carries `data-verse-system` in place of `data-system`; a system that holds any pass-1 event keeps `data-system`. So every existing lookup and every `[data-system]` sweep sees verse 1 only. Lane 50's grace notes use the same attribute names, so the rename covers them. Step 0 lists every reader.

### D7. The label and the tag

- **The label** "Verse %s" / « Couplet %s » (`markup.verseLabel`) stands above the staff at the first bar of each later pass, mid-system where it falls, upright, at the underlay's type size, left-aligned to that bar's first note, with a `data-verse-label` handle. The system's height includes it, so the label cannot part from its bar at a page foot. Prefer placing it at the page-layout seam from the bar's drawn position; if the render does not report that position, say so in Step 0 before touching `staff-renderer.ts`.
- **The tag** "%m · verse %v" / « %m · couplet %v »: at each system start that falls inside a later pass, the bar number carries the tag. The number stays where it is drawn today; `data-bar-number` keeps the bare number. No ink of the number or its tag falls left of the system's left edge; a test asserts it and the 390 px picture shows it. The bracketed courtesy number after a long rest takes no tag.
- Both strings are ratified (12:58); pin them in `ratified-lines.test.ts`.

### D8. Byte identity

Before Step 3 changes any code, commit a file of one hash per tracked `.musicxml` (under `apps/`, `docs/`, `tools/`, and `packages/`) of `paginateScore`'s pages at `markup-pages.test.ts`'s geometry, taken on the lane's base commit. A test recomputes and compares. Every one-verse score stays byte-identical.

## Interim limits, said once in the final report

- A later verse's IPA comes from the score's words through the fallback pipeline, with the singer's spelling settings but without Lyrics edits or hand pairings.
- Lyrics shows verse 1 only. INSIGHTS, the watch list, and phonation totals read as today (lane C).
- Repeat signs, voltas, and jump marks that stay notated are still not drawn (lane D).
- Stress acutes show in verse 1 only (lane B).
- Later verses cannot be tapped (lane B).
- On the no-marks path (D3.2), a refrain after the passage prints once.

## Steps

### Step 0. Read and measure. Change no code.

The eight gates and `node scripts/ratchets.mjs`, recorded. Re-read every line this brief cites and report any that moved. List every non-test reader of `data-hit`, `data-event-id`, `data-of-event`, `data-ipa-of`, and `[data-system]` (r3's list, Fable at `dc078b95`, is a start: `Loupe.svelte`, `selection-ring.ts`, `loupe-ink.ts`, `loupe.ts`, `loupe-hold.ts`, `crossing-ring.ts`, `MarkupPane.svelte`, `+page.svelte`, `TimeSignatureControls.svelte`, `system-ground.ts`), and confirm each sees pass 1 only under D6. List every reader keyed by event id between the render score and the page (marks, widths, IPA, withheld set) and confirm derived ids reach each. Check that no event id contains `~`. Establish whether the scan reader returns more than one verse, and whether it reads repeat barlines. Establish whether the render reports a bar's drawn x position to the page-layout seam (D7). Record and commit the D8 baseline.

### Step 1. Fixtures

Add to `packages/score-parser/src/fixtures/`, each with its source in a head comment:

1. `strophic-repeat.musicxml`: a two-bar introduction without words; a passage of six bars inside a forward and backward repeat, with three Cyrillic verses in bars 3 to 6 and a one-line refrain in bars 7 and 8; a two-bar ending after the repeat. In bar 4, verse 1 sings two syllables on two notes that verse 2 sings as one; in bar 5, the reverse. Make the passage end on beat 2 of a system's width at 390 px if you can, so a pass starts mid-system.
2. `strophic-volta.musicxml`: a repeated passage with first and second endings and two verses.
3. `strophic-stacked.musicxml`: three verses under the music with no repeat marks, an introduction, and an ending.
4. `repeat-one-verse.musicxml`: a repeat whose words do not vary.

Smoke tests that each parses with the verses and markers stated.

### Step 2. Verses known (D1 and D2)

The no-Cyrillic rule and the verse view, with tests: the repeat fixture gives three verses; in verses 2 and 3, bars 7 and 8 carry verse 1's syllables; in verse 2, bar 4's second note has no syllable and bar 5's two notes each have one; no sung note in any view lacks a syllable except a continuation. Both sunless fixtures (`apps/web/src/lib/score/ingestion/fixtures/`) give one verse. `vowel-resolver.ts` shows no diff.

### Step 3. The render score (D3 and D4)

Pure code in `packages/score-parser`, with tests: the repeat fixture prints introduction, passage three times, ending; printed numbers repeat per pass; the volta fixture prints ending 1 in pass 1 and ending 2 in pass 2; the stacked fixture takes D3.2; the one-verse repeat fixture returns the notated score unchanged; later-pass ids are derived and unique; the D8 baseline holds.

### Step 4. MELODY draws it (D5 to D7)

Wire the render score into MELODY's pagination in place of the notated score when D3 keeps a later pass. Tests on the repeat fixture: the three verses' syllables under bar 3 differ as the file has them; each verse's vowel mark follows its own vowel; the label stands above the first bar of passes 2 and 3; tags appear only at later-pass system starts; no `data-hit` and no `data-system` exist for later-pass events and systems; no tag ink falls left of a system edge; only the song's last bar draws the final barline.

### Step 5. Close

Merge `Shane`, run all eight gates and the Playwright suite (desktop and phone), and write the final report: the counts, the interim limits, and pictures of the repeat and volta fixtures in MELODY at desktop width and 390 px, English and French, with a printed PDF of the repeat fixture, letter size. Look at every picture before reporting it.

## Computations this lane changes (CONTRACT §4)

- Which verses are sung (`sungVerseNumbers`): a lyric line with no Cyrillic letter stops counting. Step 0 names every caller and what depended on the old count.
- What MELODY paginates: the render score in place of the notated score, for a song with a later pass kept. One-verse output is byte-identical against the committed baseline.

## What the desk could not establish

- Whether real strophic scores reach Ilya with repeat marks, stacked verses without marks, or both, and in what proportion. No committed fixture has a real second verse (scout packet, section 6).
- Whether the scan reader returns more than one verse or reads repeat barlines (Step 0).
- Whether the render reports a bar's x position to the page-layout seam (Step 0).
- How the browser breaks MELODY's sheets when printing a long unfolded song.
- Fable's sizing of r3 (2 Code sessions, 3 with a fix round) was for a different design; r4 is not yet sized.
