# Review: brief-code-strophic-reprint-and-repeats_r1_2026-11-12.md

r1, 2026-11-12, Fable. Read in full: the brief, the scout's packet, `OPEN.md` item 11 (`:2851`) and `:2686`, `CONTRACT.md` §0.1 (`:9-11`) and §8 (`:139-152`). Every code line named here was read this session on `/home/claude/ilya-shane` at `dc078b95`. Terms I coined: "strophic span" (the bars that carry more than one line of words), "inert verse" (a later verse's print that cannot yet be tapped), and the lane names A to E. Everything else is the brief's or the tree's.

## Size

**It is not a two-hour job. As written, the brief is 6 to 12 Code sessions, which sits at the two-week end of Dann's question once walks and fix rounds are counted. The core (every verse printed with its own words and IPA, read-only) is 1 to 2 sessions.**

Calendar time is NOT ESTABLISHED: it depends on how many lanes run per night and on Dann's walks, neither of which the tree records.

Why it is not one session. Tonight's lanes had 7 to 12 written steps. This brief has seven step headings, and four of them (steps 2, 3, 4, and 5) have no body or one sentence. Each of those four is a lane's worth of work on its own:

| part | what it touches (read this session) | sessions |
|---|---|---|
| A. Verses printed, read-only | `verses.ts:22-34`, `MarkupPane.svelte:604-611` and the channel chain after it, `page-layout.ts:254-467`, two fixtures | 1 to 2 |
| B. Verses correctable: pairings per verse, seating, Lyrics from the score, selection and Loupe by verse | 59 `doc.pairings` sites and 19 `selectedEventId` sites in `+page.svelte`; 33 non-test modules that read pairings; 48 id lookups across 8 files; the stored song record | 2 to 4 |
| C. INSIGHTS, the watch list, and phonation totals by verse | `InsightsPane.svelte:169-190`, `MarkupPane.svelte:591`, `:733`, `:750`, `:787-793`; the unfolder's pass count (`unfold.ts:249`, `:622`) | 1 to 2 |
| D. Repeat signs, voltas, jump marks drawn | `staff-renderer.ts` (3,426 of 3,427 lines), `layoutColumns`, three fonts, the byte-stable approval gate | 1 to 2 |
| E. Typed verses, the receipt line, "Verse not sung" | no code exists (`i18n.ts` holds no verses key); design not settled | 1 to 2, NOT ESTABLISHED |

**The riskiest part is B.** It changes the singer's saved work. A pairing is stored under an event id (`pairings.ts:135`), the map rides in the song record (`library/types.ts:122`), in undo (`undo-history.svelte.ts:46`), and through reseat, heal, replace, and the waiting seat. A mistake there loses or misplaces syllables in songs people have already corrected. The second risk is the id lookups: the scout traced only the pick and held-measure paths of a 5,515-line file.

**What would make it bigger:**

1. Verses whose syllable counts differ from the melody (the brief's "split note"). Item 11 rules that Ilya does not guess; what it shows instead is not designed.
2. The relation between repeat passes and verses (finding 2.1). It is not in the brief, and parts A, C, and D all depend on it.
3. Ratchets. Five files this lane must edit are at or within two lines of their ceilings: `Loupe.svelte` 3012/3012, `InsightsPane.svelte` 744/744, `staff-renderer.ts` 3426/3427, `pairings.ts` 1421/1422, `MarkupPane.svelte` 1362/1364; `types.ts` is at 999 of the 1,000 new-file limit. Every edit needs an extraction first.
4. Lane 50 is open on `staff-renderer.ts`, `page-layout.ts`, the Loupe, and `correction.ts` (its r3 brief names `layoutColumns`, `sliceWidth`, or `page-layout` 11 times). Parts A and D edit the same functions.
5. Whether the scan reader ever yields a second verse. NOT ESTABLISHED; not traced.

## Verdict

**HOLD.** Split it, and send lane A as its own brief after the amendments here. The whole brief is too large for one lane, four of its steps are unwritten, one of its two pairing options cannot work, and it is silent on the one design point that decides what a verse's copy contains.

## 1. Is "reprint per verse" the right shape for the singer?

Yes, with two changes.

**Why reprint is right.** MELODY's marks sit on the note (`AnalyzedScore.events`, read at `staff-renderer.ts:2115` and four more sites), and each verse puts a different vowel on that note. Stacked word lines under one staff, as the print has them, would leave one notehead carrying three verdicts. A verse switcher shows one verse at a time, so the other verses' pairs are off the page, against the ruling. Reprint is the only shape of the three that keeps one note, one vowel, one mark (CONTRACT §0.1).

**Change 1: a verse starts on the next system, not on a new page.** The brief paginates once per verse (decision 1), so each verse opens a page and ends on a short one. MELODY is paged sheets, fitted to the phone's width (`MarkupPane.svelte:970`, `PageFit`). A one-page song with five verses becomes five sheets to scroll and five to print; flowed, it is about three. Engraved written-out strophic songs flow this way. Cost: `paginateScore` packs and stacks in one function (`page-layout.ts:254-467`); it has to be divided into "systems for a verse" and "stack systems onto pages". Also missed by the brief: with one call per verse, every verse's first page would take page 1's shorter window (`pageHeight: page1WindowHeight`, `MarkupPane.svelte:858`) and leave a blank band where the title is; and `lastPage` (`:887-890`) places the commentary after the last verse only if the calls are joined. This is taste, so it is a question for Dann (Q2), with flow as the recommendation.

**Change 2: decide what a later verse's copy shows under bars with one line of words.** This is the largest gap. See 2.1 and Q1.

**Phone and print.** The verse label is on the paper and prints; that agrees with §8 (a label is not a control). A way to jump between verses on a phone would be a control and belongs in the drawer; not needed for a first lane. NOT ESTABLISHED: how the browser breaks the sheets when printing; the print rules were not traced beyond `MarkupPane.svelte:1179` and `:1356`.

## 2. The seven decisions: what breaks, what is missed

### 2.1 Missed entirely: repeat passes and verses are the same thing in a strophic print

The commonest strophic print is one repeated span with two or three lines of words. The brief treats verses (decisions 1 to 5) and repeats (decision 6) as separate. Three consequences, each read in the tree:

- **A later verse gets the wrong vowel on one-line bars.** For verse 2, a note with no verse-2 syllable is treated as a continuation of the previous syllable (`vowel-resolver.ts:268-276`, with `verseSyllableOf` at `:210-221` returning undefined for a single-line note whose `verseNumber` is 1). A refrain or a coda printed with one line of words would therefore be drawn bare in verses 2 and 3 and forecast on the previous syllable's vowel. That is a false pitch-and-vowel pair, and a sung note with no syllable, which §0.1 counts as a mistake.
- **The analysis would count passes twice.** `scoreInPerformanceOrder` unrolls a repeat to `times ?? 2` passes (`unfold.ts:249`, `:622`) and has no verse concept (grep of `unfold.ts` and `performance-order.ts` for "verse" finds header comments only). Running it once per verse gives verses times passes. Three verses under one repeat would be measured as six passes of the music, or as two if left as today.
- **Drawing the strophic repeat's signs in every verse's copy tells the singer to repeat inside the verse.** Once the verses are reprinted, that repeat has been used up. Decision 6 says "drawn as the print has them" without this case. Voltas have the same problem: a second ending's words are usually lyric line 1 in the file and are sung only on the last pass.

What I recommend, as a rule for the desk to rule or put to Dann (Q1): the strophic span is the bars carrying more than one line of words; a verse's copy is that span; bars outside it print once, with the first or last verse's copy. Where a repeat bounds the span, pass N is verse N, the pass count is the verse count, and that repeat's signs are not drawn. This is also the closer reading of Dann's words in the brief: "The reason we unpack strophic text is because that text varies. Unvaried text just needs to be printed once."

### 2.2 Decision 1 (containers and `data-hit`)

- **Put `data-verse` on the system wrapper, not on a per-verse container.** The system `<svg data-system>` is written at `page-layout.ts:455`. A per-verse container forces one page run per verse and rules out the flow in change 1.
- **The lookup list is short by a wide margin.** The brief names three sites. Grep finds 48 lookups of `data-hit`, `data-event-id`, `data-of-event`, or `data-ipa-of` in non-test code: `Loupe.svelte` 20, `selection-ring.ts` 11, `loupe-ink.ts` 7, `loupe.ts` 4, `loupe-hold.ts` 3, `crossing-ring.ts` 2, `MarkupPane.svelte` 1, `+page.svelte` 1. Also first-match and unnamed: `Loupe.svelte:514` (`document.querySelector('.markup-paper-container')`).
- **The pick carries no verse.** The click handler passes an id only (`MarkupPane.svelte:315-318`), and `handleNotePick` sets an id-only cursor (`+page.svelte:740-742`). Selection has to become an id and a verse wherever it is held; `systemIndexOf` (`loupe.ts:57-59`) assumes one system per measure index and would return verse 1's system.
- **The Loupe's re-render** takes one bundle with one set of channels (`loupe-render-bundle.ts:17-29`, `loupe-render.ts:59-70`, `:88-98`). It needs the held verse's bundle; that is a clean seam (one bundle per verse, handed by the page), and the brief's step 0 is right to ask for it.
- **Not broken:** 16 Playwright selectors on `data-hit` or `data-event-id` keep working on one-verse songs, since a one-verse song renders as today.

### 2.3 Decision 2 (verses from the score)

- The no-Cyrillic rule is sound and does more than the brief says: it also drops a singing translation printed as a second line, which is common in Russian song editions (my inference from repertoire, not from the tree).
- Missed: a sparse second line (a few alternative words for the repeat). `sungVerseNumbers` (`verses.ts:22-34`) would count it as a verse and reprint the whole song for it. The strophic-span rule in 2.1 handles it.
- "Byte for byte" for one-verse songs is the right bar. `markup-pages.test.ts:10-14` pins every bar on exactly one page through `paginateScore` over every score in the tree, the new fixtures included; a divided `paginateScore` has to keep that test's meaning or the test has to be restated per verse.

### 2.4 Decision 3 (pairings carry a verse)

- **The first option cannot work.** `PairingMap` is `Record<string, Pairing>` keyed by event id (`pairings.ts:135`). An optional `verse` field on `Pairing` still leaves one pairing per note, so verse 2 would overwrite verse 1. Only the second option (a map per verse) is possible. Remove the choice.
- **Seating a later verse seats nothing as written.** `seatScoreWords` aligns the verse's score words against every Lyrics line from word 0 (`score-seat.ts:116-118`; `align` walks forward from `j = 0` and returns null on lost sync, `clitic-seat.ts:183-213`), and skips any note already holding a pairing (`score-seat.ts:144`). With all verses in Lyrics, verse 2's first word is compared with verse 1's first word and the seat fails. Seating needs the verse's own slice of the lines, with word ordinals offset so `SlotOrigin` still points into the whole Lyrics.
- **The literal-1 list is half the sites.** Named: `+page.svelte:405`, `:1943`, `:2786`, `MarkupPane.svelte:606`, and the watch list (the brief says `:~766`; it is `:750`). Not named: `+page.svelte:396` (`readScoreText`), `:547` (`findCliticFolds`), `:672-676`, `:1974`, `:2681`, `:2825` (seats that take the default verse), `InsightsPane.svelte:172` and `:188`, `waiting-seat.ts:45-46`, `replace-seat.ts:76`, and the defaults at `clitic-seat.ts:146`, `:458`, `:485`.
- **Stored songs.** The record has a pattern for this: an additive field, filled empty on older records by `validateRecord`, no schema bump (`library/types.ts:126-131`, `:143-145`). A field such as `versePairings` beside `pairings` (verse 1 stays in `pairings`) means no stored song changes and no migration. The known cost of the pattern, stated in the tree: an older Ilya importing a newer binder drops the field, so later-verse placements are lost on that path. Undo snapshots (`undo-history.svelte.ts:46`) and the migration equality check (`library/migration.ts:117`) need the new field too.
- **The library fingerprint is unaffected,** provided ids stay the printed ones: it hashes `id|pitch|duration` of the vocal line (`library/fingerprint.ts:42-52`) and reads no words.

### 2.5 Decision 4 (Lyrics holds every verse)

- "A blank line, which `processText` already keeps": nearly. `processText` drops blank lines and records `endsStanza` on the line before (`types.ts:156-166`). The flag is what the verse slice reads.
- A blank line is not only a verse boundary. A poem's own stanza breaks can be laid over Lyrics (row 108 A, `score-seat.ts:33-35`), so stanza and verse boundaries are not the same set. For a score with verses, the boundary has to come from Ilya's own fill, or be re-found by matching the score's verse words, never from every blank line.
- Typed verses ("each stanza that matches the melody's syllable count") is new design with nothing under it; the scout marked it NOT ESTABLISHED, and so do I. It is also where most real cases will fail the count, since later verses often split or join notes. Defer it to lane E with its own design.
- A song already in the library was filled with verse 1 only. Nothing in the brief says how its Lyrics gains the later verses. Appending text to a singer's Lyrics on load is a silent write; the tree's precedent is that a fill happens on the singer's act (`+page.svelte:2780-2783`).
- The ratified receipt string is misquoted. `INBOX.md:325` (not `:324`): "6 verses assumed sung" / « 6 couplets présumés chantés ». Dann dropped "all" and the comma.

### 2.6 Decision 5 (INSIGHTS and the watch list)

- **`analyzePerVerse` cannot be "wired in place" as it stands.** It calls `buildVowelResolver(parsed, verse)` on the notated score (`analyze-per-verse.ts:42-45`). The live analysis runs on the performance-order score with `openSyllabification`, the singer's transcribed lines, hand pairings through `withPairedVowel`, and `resolveAdvice` (`MarkupPane.svelte:604-616`, `:733`; `InsightsPane.svelte:169-183`). A straight swap would drop every hand correction from the forecast. It has to be extended to take a resolver per verse, which keeps §8's "do not delete".
- **Phonation totals are not mentioned.** `scoreMetrics` (`MarkupPane.svelte:787-793`) reads one score and one resolver. The per-vowel totals are this project's purpose; they have to sum across verses, with passes counted as in 2.1.
- **"Marked as assumed" has no design and no string,** and §8 says "Do not put a mark on the page to say Ilya is unsure." Under item 11, a verse the score numbers is sung, not assumed; "assumed" applies only to verses the score does not number. So for score-borne verses the state does not arise. Move it to lane E.
- Comment order is already ruled: performance order, later verses unrolled (`PRODUCT.md:1068`). `commentPitch` finds an event by first match (`InsightsPane.svelte:267`); with ids shared across verses it still returns the right pitch, since the note is the same.

### 2.7 Decision 6 (repeat signs and voltas)

- Font facts confirmed from the three metadata files this session: `repeatLeft`, `repeatRight`, and `repeatRightLeft` are in Bravura and Finale Maestro and absent from Leland; `repeatDots`, `segno`, and `coda` are in all three; `repeatEndingLineThickness` is 0.16, 0.13, and 0.11. `SMUFL_CODEPOINTS` lists none of them (grep of `smufl-metadata.ts`), so the lane adds them.
- This part is independent of verses except for 2.1 (which repeats are drawn). It has to live in `staff-renderer.ts`'s column layout, which the brief's "new modules" line cannot fully avoid, and it must leave the approval gate's bytes unchanged on scores with no repeats.
- No fixture in the code tree has a repeat, a volta, or a jump (scout §6, not re-counted by me). `<ending number>` is parsed to passes only (`musicxml-parser.ts:99`, `:571-597`); whether a printed label other than the pass numbers exists is NOT ESTABLISHED.

### 2.8 Decision 7 (corrections)

Sound. Corrections apply before MELODY sees the score (`bar-layer.ts:55-59`), so every verse inherits them with no change to `CorrectionMap`. The "Verse not sung" tap needs a stored field and the receipt line, neither of which exists; lane E.

## 3. The split

| lane | the singer gets | depends on |
|---|---|---|
| **A. Verses printed** | Every verse the score carries is printed with its own words, IPA, and marks, labelled, flowing system to system; later verses are inert (a tap does nothing); one-verse songs unchanged byte for byte | Q1, Q2, the French labels |
| **B. Verses correctable** | Lyrics holds every verse; syllables can be placed in any verse; the Loupe opens on the verse tapped; "m. 12, verse 2" | A |
| **C. INSIGHTS by verse** | Comments, the watch list, and phonation totals read every verse, passes counted once | A, and the pass rule of 2.1 |
| **D. Repeat signs, voltas, jump marks** | Unvaried repeats drawn as printed | lane 50 merged; 2.1 for which repeats are drawn |
| **E. Typed verses, receipt line, "Verse not sung"** | Verses the score does not carry | B, and a desk design |

How lane A stays small and safe: later-verse systems are made inert at the page-layout seam by renaming their id attributes, as the Loupe already does for its clone (`Loupe.svelte:1131-1141`, `data-hit` to `data-loupe-hit`). Every first-match lookup then still finds verse 1 only, and no selection, Loupe, or pairing code changes. Lane A needs per-verse analysis for the marks it draws (a loop over the existing `analyzeScore` with each verse's resolver), and nothing else from C.

Lane A's interim limits, to be said in its brief: a later verse's IPA comes from the score's words through the fallback pipeline (`vowel-resolver.ts:472-476`), without the singer's Lyrics edits; Lyrics shows verse 1 only; INSIGHTS reads verse 1 only.

## 4. Amendments

1. **Split the brief** into lanes A to E as in section 3; send A first. Replace the lane line with: "This lane is A of five. It prints verses. It changes no pairing, no stored record, no selection, and nothing in the Loupe."
2. **Decision 1, replace** "Each verse's render sits in its own container carrying `data-verse="N"`" **with:** "Each system's wrapper (`page-layout.ts:455`) carries `data-verse="N"`. In lane A, systems of verse 2 and later have `data-hit`, `data-event-id`, `data-of-event`, and `data-ipa-of` renamed with a `data-verse-` prefix at the page-layout seam, so every existing lookup finds verse 1 only (precedent: `Loupe.svelte:1131-1141`)."
3. **Decision 1, replace** "paginated once per sung verse, as it is today" **with** the answer to Q2. If flow: "`paginateScore` is divided into two exported stages, systems for one verse and systems stacked onto pages; verse 2 opens on the next system; `data-score-page` runs on; `lastPage` is the last verse's. A one-verse song's output is byte-identical, with a test."
4. **Add decision 0, the strophic span** (text per Q1's answer). At minimum: "A note carrying one line of words is never drawn bare or forecast as a continuation in a later verse (`vowel-resolver.ts:268-276` does this today). Test on the strophic fixture."
5. **Decision 3, delete** "`Pairing` gains an optional `verse` ... or". State: "A map per verse. Verse 1 stays in `pairings`; later verses go in an additive `versePairings` field, filled empty by `validateRecord` (`library/types.ts:126-131` is the pattern). Lane B." Add the unnamed literal-1 sites listed in 2.4.
6. **Decision 3, add:** "Seating verse N aligns against verse N's slice of the Lyrics lines, with word ordinals offset to the whole text (`score-seat.ts:116-118`, `:144`; `clitic-seat.ts:183-213`). Lane B."
7. **Decision 4, correct the citation and string:** "`INBOX.md:325`, 'N verses assumed sung' / « N couplets présumés chantés »". Replace "which `processText` already keeps" with "recorded as `endsStanza` (`types.ts:156-166`)". Move typed verses to lane E. Add: "A song already in the library gains its later verses in Lyrics only on the singer's act."
8. **Decision 5, replace** "`analyzePerVerse` ... is wired in place of the verse-1 analysis" **with:** "`analyzePerVerse` is extended to take, per verse, the resolver the live path builds (`MarkupPane.svelte:604-616`: open syllabification, transcribed lines, hand pairings) and the performance-order score, then `resolveAdvice`. Passes are counted once per verse (decision 0). `scoreMetrics` (`MarkupPane.svelte:787-793`) sums across verses. Lane C." Delete "its findings are marked as assumed"; move to lane E.
9. **Decision 6, add:** "A repeat whose passes carry different verses is not drawn in a verse's copy. Lane D, cut after lane 50 merges."
10. **Step 0, add:** "List every lookup of `data-hit`, `data-event-id`, `data-of-event`, and `data-ipa-of` (48 found by grep: `Loupe.svelte` 20, `selection-ring.ts` 11, `loupe-ink.ts` 7, `loupe.ts` 4, `loupe-hold.ts` 3, `crossing-ring.ts` 2, `MarkupPane.svelte` 1, `+page.svelte` 1) and `Loupe.svelte:514`. Record `node scripts/ratchets.mjs` and the line count of each listed file."
11. **Add a ratchet line to the lane section:** "`Loupe.svelte`, `InsightsPane.svelte`, `staff-renderer.ts`, `pairings.ts`, and `MarkupPane.svelte` are at or within two lines of their ceilings, and `types.ts` is at 999. Extract before adding; never raise a ceiling without saying so in the step report."
12. **Step 1, define the fixture's hard bar:** "split note" is undefined. Say what the file contains (for example, verse 3 carries two syllables where verses 1 and 2 carry one note), and what Ilya is expected to show there under item 11's "does not guess". If that is not designed, leave the bar out of lane A's fixture and say so.
13. **Rulings section:** the "RULED 2026-11-12 01:05" entry is not in `OPEN.md`, `INBOX.md`, `STATE.md`, or `PRODUCT.md` at `dc078b95`. Transcribe it, with Dann's words, before the lane is cut (README close step 2: a brief is not a ruling's home).
14. **Correct the drifted citations:** `MarkupPane.svelte:601-610` to `:604-611` (literal at `:606`); `:~766` to `:750`; `types.ts:273-306` to `:287-288` and `:304-308`; `bar-layer.ts:52-58` to `:55-59`.
15. **Steps 2 to 5 need bodies** in whichever lane brief carries them: files, tests, and the done state for each, as steps 0, 1, and 6 have.

## 5. Citations in the brief

| citation | finding |
|---|---|
| `OPEN.md:2686` (N.20) | Confirmed |
| `OPEN.md` item 11, and its last sentence | Confirmed at `:2851` |
| `OPEN.md`, "RULED 2026-11-12 01:05" | NOT in the tree at `dc078b95` |
| `claude/e36-session-record_2026-08-10.md` §1.14 | Could not read (project knowledge; no tool reaches it here) |
| CONTRACT §8, both quotations | Confirmed, `CONTRACT.md:147`, `:148` |
| CONTRACT §0.1 | Confirmed, `:9-11` |
| `INBOX.md:324`, "6 verses, all assumed sung" | Wrong line and wrong string: `:325`, "6 verses assumed sung" |
| `INBOX.md:326` | Confirmed |
| `loupe.ts:66` | Confirmed |
| `crossing-ring.ts:90` | Confirmed |
| `MarkupPane.svelte:359` | Confirmed |
| `verses.ts:22-34` | Confirmed |
| `score-seat.ts:107-112` | Confirmed (the call is `:113`) |
| `+page.svelte:405`, `:1943`, `:2786` | Confirmed |
| `MarkupPane.svelte:601-610` | Drifted: `:604-611`, literal at `:606` |
| `MarkupPane.svelte:~766` | Wrong: `buildWatchList(..., 1, ...)` is `:750` |
| `analyze-per-verse.ts:36-47` | Confirmed |
| `types.ts:273-306` | Loose: `repeatStart` `:287`, `repeatEnd` `:288`, `ending` `:304-308` |
| `bar-layer.ts:52-58` | Loose: `applyCorrections` `:55`, `rebar` `:59` |
| `loupe.measureTag` family; `commentTag` | Confirmed, `i18n.ts:468`, `:471`; `InsightsPane.svelte:263-265` |
| `loupe-render.ts` | Confirmed; `renderLoupeMeasure` `:88-98` |
| Glyphs in the three fonts | Confirmed from the metadata files |
| `sunless-01-*.musicxml` lyric 2 is IPA | Not re-read; the scout's count stands unchecked by me |
| `markup-pages.test.ts` | Read: pins the stylesheet rule and every bar on exactly one page (`:10-14`) |

## Questions for Dann

1. In verses 2 and 3, some bars have only one line of words under them (a refrain, or a coda sung once). Print each later verse only as far as its own words go, with the one-line bars printed once (recommended: it is your "unvaried text prints once", and fewer pages; costs about one more session), or reprint the whole song for every verse with the one-line words repeated in each copy (smaller build; a once-only coda would show in every verse)?
2. Does verse 2 start on the next system under verse 1 (recommended: fewer pages to scroll and print), or at the head of a new page (each verse findable at a page top; a five-verse one-page song becomes five pages)?
3. French, marked drafts, built from the file's « fin du couplet %s » (`i18n.ts:1089`) and « mes. %m » (`i18n.ts:471`); no glossary source beyond those two strings. Verse label: "Verse 2" / « Couplet 2 ». Bar tag: "m. 12, verse 2" / « mes. 12, couplet 2 ». Open choice: the existing tags join their parts with a middle dot ("m. 12 · system 2 of 5"), so "m. 12 · verse 2" / « mes. 12 · couplet 2 » would match them; the comma is from the brief's account of your 01:05 ruling, which I could not read.

## What I could not establish

- The text of the E.36 ruling and of the 2026-11-12 01:05 ruling. Neither is in the tree; I have only the brief's quotations.
- Calendar time for any lane.
- Whether every reader of an event id or a bar number in `+page.svelte` has been found. I counted sites by grep; I did not trace them.
- How often real files carry later verses under the notes, against printing them as a text block (which would make lane E the common case). My remark on repertoire is inference.
- Whether the scan reader can return more than one verse.
- How the browser paginates MELODY's sheets in print.
- Whether lane 50's edits and lane A's division of `paginateScore` conflict line by line; I read lane 50's step headings and a grep count, not its diff.
- The sunless fixtures' lyric-2 content, and the fixture counts in scout §6; taken from the scout.
- The session ranges are my judgement from the sites counted here against tonight's reference lanes; no lane of this kind has been timed.
