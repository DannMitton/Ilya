# Brief: Poem and Lyrics each feed Text (rows 109 and 110, N.186) (r4, 2026-10-18)

Written by the desk (Opus) 2026-10-16 about 21:15; r4 2026-10-18 about 18:40. **REVIEWED by Fable 2026-10-18, SEND WITH AMENDMENTS (12): `review-fable-brief-rows109-110_r2_2026-10-18.md`. Apply every amendment in that review; where it differs from the text below, the review wins. The desk's decisions on its open choices are section 8.** **Replaces r1, r2, and r3** (`brief-code-row109-poem-only-transcription_r1_2026-10-16.md`, `brief-code-rows109-110-poem-transcription_r2_2026-10-16.md`): Dann's model of 21:06 drops their copy of Poem into Lyrics. Fable's review of r2 (`review-fable-brief-rows109-110_r1_2026-10-16.md`) still applies for its code facts: amendments 1, 5, 9, 12, 13, 14 stand; 2, 3, 4, 6, 8, 10, and 11 fall away (the copy is gone, and D gives the poem its own marks); 7 is answered by B. Lane: the cloud session on `cloud-lane-11`, before the merge.

## 1. Dann's model, 2026-10-16 21:06 (transcribed as written)

*"I think dropped text should always land in Poem. I think the implication is that Poem is directly entered by the user. I think LYrics shuld always be fed first from the score, establishing the syllable-to-note mapping. The user can go into Lyrics and manually repair garbled and missing text, and follow up with Corrections to remedy misalignments. So Poem is fed manually by the user and Lyrics is fed automatically first by the scan then, altered manually by the user. Lyrics is also subject to automatic reconciliuation by ILys where its strings differ from a Poem that has also been entered., WEithout a Poem, Lyrics has no means for ILya to execute auto-reconciliation. With just a Poem, it is the features content for Text's transcription. With just Lyrics, they are featured for text's transcriptions. With both textual witnesses, the user can choose but Lyricws is the default. Poem must be manually selected for display and print"*

Reconciliation is row 111, not this brief.

## 2. What the singer gets

- **A. Text shows the witness there is.** Lyrics when Lyrics holds text; otherwise Poem. With both, and their words differing (`comparePoem` reports an omitted word or a differing segment; review r2, amendment 11), Text shows Input's pair, Poem | Lyrics, same order, same ratified labels (`intake.view.poem`, `intake.view.lyrics`), Lyrics the first time; after that, the singer's choice is remembered per song for the session, not stored (review r2, amendment 10). Poem is shown, and printed, only when the singer chooses it (`window.print()` prints the one `Paper`, review amendment 9). The poem's transcription is the published poem whole, its own lines, the words the song does not set greyed as Input's Poem view greys them.
- **B. Lyrics is fed first by the score.** A score with words fills an empty Lyrics and seats (N.134, unchanged, `+page.svelte:2860-2878`). DESK DEFAULT, from review amendment 7: a score with no words (MusicXML without lyrics, and every scan today, since the reader does not yet read words, `upload.banner.reader`, `i18n.ts:1058` on `cloud-lane-11`) seats from Lyrics when Lyrics holds text, as today; when Lyrics is empty and Poem holds text, Lyrics takes the poem's text at that moment (arrival kind `'paste'`, review amendment 1), and the no-lyrics seat runs on it. The singer then repairs Lyrics by hand and in Corrections. "No score attached" and "no placements" as review amendment 5 names them.
- **C. Poem is entered by the singer.** Typed, pasted, or dropped; a dropped page goes to Poem (default 9, as row 104 built it, `poem-page.ts`). DESK DEFAULT, revising row 104's first-open rule: a song with no text opens Input on Poem; a song whose Lyrics holds text opens on Lyrics; otherwise row 104's rule. Typing or pasting in Lyrics with no score stays allowed, as the ratified placeholder says.
- **D. Each witness keeps its own marks.** Stress, the ё toggles, syllable boundaries, spot reconstitutions, and glosses on Lyrics stay keyed as today (`word-reset.ts:9-17`). The poem's marks are new maps keyed by the poem's own `"lineIndex-wordIndex"`, stored on the song beside `publishedPoem` only while not empty, carried in a binder, never derived. Text's word tools work on whichever witness Text shows, so a singer with only a poem keeps every tool Text has today. Stress and ё are inputs to `processText` and the rest are display-time (review amendment 10). Seeding Lyrics' marks from the poem's is row 111's, not this slice.
- **E. Unchanged:** Markup, the seats, and Insights read Lyrics only. No new string in the app.

## 3. Row 109 (A's fallback to Poem, B, C, D) and row 110 (A's pair and print)

Row 109 first: Text falls back to Poem when Lyrics is empty; B; C; D. Row 110 second: the pair in Text, Lyrics on open, Poem on choice, print follows the view. Where Text gets its text, the engine, and the pair component: review amendments 9 and 12 (extract `ViewPair.svelte`; `+page.svelte` stays at or under 5652).

## 4. Tests

a. Only Poem: Text transcribes it; a gloss on a poem word survives a reload and a binder round trip; a stress mark survives a view switch. b. Only Lyrics: as today. c. Both, differing: the pair; Lyrics on open; Poem on choice, whole, unset words greyed; back to Lyrics unchanged; seats unchanged across a switch. d. Both, the same words: no pair. e. A score with words onto an empty Lyrics with a Poem: Lyrics takes the score's words, Poem unchanged. f. A wordless score onto an empty Lyrics with a Poem: Lyrics takes the poem's text and seats; on a fixture Code builds in the test with the shape of `~/Downloads/no-lyrics-control.musicxml` (C4 D4 E4 F4 quarters, G4 half, a half rest; «Я тебя любил»), 5 of 5 seated; and the same with the dictionary still loading. g. A wordless score onto a Lyrics the singer wrote: Lyrics unchanged. h. A new empty song opens Input on Poem. i. Clearing Poem leaves Lyrics. j. A wordless score first, then a poem page: Lyrics takes the poem and seats. k. Reloading a Poem-only song with a wordless score: Lyrics stays empty. l. A mark on a poem word follows it when a line is inserted above.

## 5. Measure in headless Chromium, on the singer's path

A new song: paste row 104's test text into Poem; report the words Text transcribed and the time. Drop «Within Four Walls» (`apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`): Lyrics' word count (row 104 read 39), seats, Text on Lyrics, the pair shown. Choose Poem, print to PDF, and report what the PDF holds.

## 6. Gates, commits, report

Row 109: its own eight gates, commit "Row 109: Poem and Lyrics each feed Text", push. Row 110: its own eight gates, commit "Row 110: the singer chooses which witness Text transcribes (N.186)", push. One report, `docs/sessions/report-code-rows109-110_r1_2026-10-16.md`, a section each. Do not touch `docs/memory/`. The Guide paragraph on the two witnesses is the desk's (`docs/sessions/draft-guide-two-witnesses_r1_2026-10-16.md`, waiting for Dann's ruling); write no Guide string.

## 8. The desk's decisions on review r2 (each a DESK DEFAULT, Dann's to wave off)

- Amendments 1 to 4, 6, 8, 9, 12: taken as written.
- Amendment 5: parity. The poem's glosses are stored with the song; its stress, ё, syllable, and spot marks are session state, as Lyrics' are today.
- Amendment 7: taken. A wordless score first and a poem page second fills Lyrics and seats. A poem pasted into Poem takes the same path as a dropped page (carry the arrival kind, review r1 amendment 4); a poem typed key by key does not, because each keystroke would copy a fragment into Lyrics.
- Amendment 10: the ruling's wording. Lyrics the first time, then remembered per song for the session.
- Amendment 11: taken, with its cost: a difference only in ё, or only in punctuation, draws no pair.

## 7. What I could not establish

Every report carries this section. NOT ESTABLISHED beats a complete invented answer.
