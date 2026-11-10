# Review: readings that depend on the work (Fable, r1, 2026-11-10)

For the desk and Dann. Reviews `proposal-period-and-tradition_r1_2026-11-09.md` against `brief-fable-period-and-tradition_r1_2026-11-09.md`. Nothing is built, committed, or pushed. Code was read on the tip `cloud-lane-38` (`e4eeaa96`) in `/home/claude/gates`; line numbers are the tip's. Grayson was read from the PDF (text layer plus rendered pages 173, 175, 302, 303). Terms coined here: "text-date witness", "poet veto", "inert" (of a criterion that changes no reading). Adopted: "Stage pronunciation", "Literary", "Old Muscovite" (Grayson); "period-sensitive sound" (the desk).

## Verdict

**PROCEED WITH CHANGES.** The core is sound and cheaper than the proposal thinks: the engine already has the switch (`engine.ts:27-28`, `:146`, `:1525`), tested in both positions. Four changes:

1. The date witness is the words, not the music. Use the typed year with a poet veto (finding 5).
2. Drop composer-dates inference. It is inert: it never changes a reading (finding 4).
3. Do not build a rhyme test on Tuesday, live or corpus. No bundled text has the rhyme, and no rhyme code exists (finding 7).
4. Defer the per-word choice. It has no stored channel today (finding 9).

## Findings

### The sources (question 1)

1. **Grayson's quotations hold.** p. 303, rendered: "Strictly, the [ɨj] pronunciation is more appropriate for Russian lyric diction, but the modern, version (/ij/) would not be considered unacceptable." p. 302: "In the end, the rhyme takes precedence", with n. 328 on non-velar endings. p. 173: [ʃʲtʃʲ] "might be appropriate", "As a general practice, though, sing /ʃʲʃʲ/". pp. 174 to 175: "often perfectly acceptable, even desired". The proposal's NOT ESTABLISHED vowel is settled: p. 302 prints **[ʌj] "(or /əj/)"**, and transcribes both «глубокой» and «высокий» as [kʌj].
2. (Removed 2026-11-09 at Dann's direction.)
3. **Criteria the design misses.**
   - **The rhyme partner is narrower than "-ой".** Grayson, p. 302: "unstressed, adjectival endings written as -ой ... when following letters for velar consonants". The partner is an unstressed -кой, -гой, -хой («глубокой»), never a stressed -ой («тоской»). The second pairing, with -ый, is already met by the stage reading [ɨj]; a date switch to [kʲij] would break it, so rhyme must outrank date, as proposed.
   - **Grayson rejects a date rule for щ outright.** pp. 47 to 48 and 398: he quotes Piatak and Avrashov ("depends on the date the poem was written") and Belov, then writes "this view of historical phonology is inaccurate". His own period remark concerns Soviet-era work, [ʃʲtʃʲ]. This confirms the desk default: щ is not switched by date.
   - **жж is root-only.** p. 174's table: "only when in the root of a word and spoken in an affected style". Any later soft choice must not reach a prefix boundary («разжечь»).
   - **Grayson's own period principle**, p. 172: performers kept the old reading "with the understanding that they were performing mostly pre-revolutionary works and so should speak like the authors and composers of that time"; p. 29: opera pronunciation "continues to resist modernization". Authors and composers both.
   - **Grayson's printed examples are not uniform.** p. 240 prints «мягкий» and «лёгкий» with the soft ending; the engine treats «русский» as soft, citing p. 233 (`engine.ts:518-530`). This is the practice behind "not unacceptable".
   - "Only -кий has a machine-applicable rule": **right**. Grayson gives no date for -кий.

### The date (question 3)

4. **Composer inference is inert.** `COMPOSERS` (`composers-poets.ts:29-55`) has 25 entries. None was born in 1950 or later, so inference can only answer "earlier", which is the default. Seven straddle a 1950 line, not the proposal's three: Gretchaninov, Kabalevsky, Medtner (d. 1951), Prokofiev, Shostakovich, Stravinsky, Sviridov (28 per cent undecided). `POETS` (`:57-95`): 4 of 37 lived past 1950 (Akhmatova, Bunin, Marshak, Pasternak); none decides "later". Poem library, 14 entries: every author died before 1950. The r1 aria file, 92 entries: latest rights-holder death 1946. **No bundled text flips under any date rule; only a typed year can produce the modern reading.**
5. **The poet's dates are the better witness. Dann's 20:15 question: yes.** Grayson's p. 302 argument is about "older Russian poetry". Worked case, Shostakovich's 1952 Pushkin settings: under the proposal a typed 1952 turns every -кий soft in a Pushkin poem, against the source, and the rhyme test would rescue only the one rhymed word, leaving three readings in one song. **Recommended rule (mine, an inference, not stated by Grayson):** modern only when the typed year is at or past the cut-off **and** the author of the Russian words (translator when present, else poet) is not known to have died before it. Pushkin vetoes 1952; Pasternak set in 1958 goes modern. Residual error: an early poem by a poet who lived past the line (Akhmatova 1912, set in 1965) reads modern; the note says why, and clearing the year restores the default. Dann's 2026-11-08 ruling already pointed here: "the dates come from the poet and translator lists" (`OPEN.md:3521`).
6. **1950 is defensible** as a cut-off year. Alternative: 1918 (Grayson's line, "up to and a bit past the Bolshevik Revolution", p. 295). Dann's (question 2).

### The precedence (question 2) and the rhyme test (question 4)

7. **Order: right by the sources.** Grayson ranks rhyme over the singer's stage-or-modern decision; a software override still sits on top because it is the correction channel. **Recommendation: leave rhyme out on Tuesday.** Reasons: (a) zero cases bundled. My count agrees with the desk's: 14 poems, 2 line-final («тонкий», «звонкий», rhyming with each other); 92 arias (r1 harvest file; `/home/claude/aria-r2/` did not exist when I looked), 13 line-final, 12 of them speaker labels, 1 real («широкий»), no -кой partner. (b) No rhyme code exists anywhere in `apps`, `packages`, or `scripts` (grep, this session). (c) Markup's path transcribes the score's words as one line with no breaks and no options (`vowel-resolver.ts:476`), so a rhyme reading found in POEM would need per-word carriage to the notes. (d) The engine has no third value: «высокий» is [vɨˈsokɨj] and «глубокой» [ɡɫuˈbokʌj] (run this session), so Ilya breaks Grayson's own p. 302 example today.
8. **Corpus flag against live test: the corpus flag, after the share.** Checked data has no false positives and matches Dann's 20:19 idea; a live test fails on a lyric without line breaks, a partly read scan, and an unknown stress on either word. Cost of the flag: `PoemEntry` carries no dates and no per-word data (`poem-library.ts:26-45`), so the build script, the shape, and the inheritance through `poemSource` all change, for zero entries today. A live test earns a place later only as a prompt to the singer, never a silent switch. Until then the Inspector note tells her what Grayson says (finding 10).
9. **The per-word choice does not break the 2026-11-01 ruling**, provided it is a correction and not two buttons on every -кий, щ, and жж; that would be "a second pronunciation". But the proposal's mechanism is wrong on the tree: the N.14b chooser writes a stress mark (`InspectorPanel.svelte:958-969`), and word marks "are session state and are never stored" (`word-marks.svelte.ts:11-13`); the Loupe's corrections are keyed by score event id (`library/types.ts:108`). A coach's instruction would vanish on reload. Storing it is new design. Defer.

### Controls (question 5)

10. **Ranking right; B's rejection stands** on the Guide's own words ("they affect the display only", `GuideContent.svelte:481`) and on the per-song point. Changes: the faint inferred period is cut (finding 4: it would announce an assumption that changes nothing). The "Why this reading?" disclosure is a new device the Inspector does not need: the blurb already opens on demand when a ribbon atom is tapped (`InspectorPanel.svelte:1350-1387`), which is principle 10. Use one blurb of two sentences, the shape of `regressive-dental-dp-differs` in `data/blurb-composer.json`, whose citation "pp. 209–210 + D&P 1980, p. 79" is the precedent for a second source in the citation line. Today no `velar-adjectival` process exists in that file, so ⟨и⟩ in -кий has no note of its own, and ⟨к⟩ shows identity only (`tests/palatalization-comments.test.ts:216`).

### The strings (question 6)

11. **The desk's drafts, redrafted.** Faults: they lead with "[kɨj]:" though a blurb belongs to one letter; "lets the rhyme decide" understates "takes precedence"; "below" is directional; the disclosure promises a rhyme test and a choice that Tuesday does not build. EN drafts, not ratified:
    - **S1, stage (default), on ⟨и⟩:** "⟨{char}⟩ is [{ipa}] and the velar before it stays hard: the stage reading of the unstressed ending ⟨-ий⟩, which Grayson calls more appropriate for lyric diction. Where a poem rhymes this ending with an unstressed ⟨-ой⟩, he gives the rhyme precedence, [ʌj]; Ilya does not test for the rhyme." Citation: pp. 301–303.
    - **S2, modern (by date), on ⟨и⟩:** "⟨{char}⟩ is [{ipa}] and the velar before it softens: the modern reading of the unstressed ending ⟨-ий⟩, sung here because the year entered for this song is {cutoff} or later. Grayson calls the stage reading [ɨj] more appropriate and the modern one not unacceptable." Citation: pp. 301–303.
    - **S3, the field:** "Year composed".
    - **GUIDE**, a scaffold for Dann's voice, not prose: the default and why (p. 303); the one thing that changes it today (a year at or past the cut-off, unless the author of the words died before it); what Ilya does not do (test the rhyme, p. 302; switch щ or жж, pp. 173 to 175); where to look (tap ⟨и⟩ in the ending). It must sit with "Why does Ilya follow only one source?" (`GuideContent.svelte:337-339`) without contradicting it.
    - **French needed** for S1, S2, S3, and the GUIDE section. Dann's; drafts to be built from the file's own French («se palatalise», «vieux-moscovite», U+00A0 before the colon).

### What it touches (question 7)

12. **Every site that computes the same vowel.** Four call sites produce IPA the singer sees and none passes `engineConfig` today: `+page.svelte:443` (reactive), `+page.svelte:1805` (imperative: it needs a re-run when the year or poet changes), `text/witness-lines.ts:29`, `score/vowel-resolver.ts:476`. The last feeds Markup and the vowel tallies; if it is missed, Text shows [i] while Insights counts [ɨ]. `underlay-seams.ts:59` reads only the word and its clitic flags. `clitic-seat.ts:491` and `poem-join-wire.ts:34` were not read.
13. **Storage.** Nothing derived is stored (`library/types.ts:136-137`), so a year change re-reads nothing; the IPA is recomputed. The year is additive: `validateRecord` fills a missing metadata key with the empty string (`library.ts:216-224`), an older Ilya drops it, no schema bump. Reset and the "has any" test name the fields one by one (`MetadataFields.svelte:76-81`).
14. **Unchanged:** the dictionary build (it does not transcribe), LEARN's pinned rows (the default does not move), PAPER (it prints what the page computed). `data/blurb-composer.json` has a twin in `apps/web/static/data/`. Under the modern value the consonant before the velar softens as well (`engine.ts:1361`), which wants one pinned test («симметрический»).
15. **Found on the way, outside this design:** «кий» (billiard cue) reads [ˈkɨj] because the guard ignores stress (`engine.ts:635-650`); Ilya writes «позже» [ˈpoʒːɨ] and «вожжи» [ˈvoʒʒɨ] where p. 175 prints /ʒʒ/ for both; LEARN's French line 1141 still prints «мягкий» soft beside the stage row at line 103.

## Build plan (question 8)

**Size against one Code lane on Tuesday: it fits only with the rhyme test, the per-word choice, and the inferred-period display cut. What remains is four steps and, on my estimate (an inference, not a measurement), the whole lane-day. Step 1 ships alone if the day runs short.**

| step | work | done state | tests | strings ratified first |
|---|---|---|---|---|
| 1 | The stage note: process `velar-adjectival:и` in both copies of `blurb-composer.json` | Tapping ⟨и⟩ in «великий» shows S1 with "(Grayson, pp. 301–303)", EN and FR | blurb package test; the line pinned as ratified lines are; `palatalization-comments.test.ts:216` still green | S1 EN, FR |
| 2 | `period-reading.ts`: year, poet, translator in; `'stage'` or `'modern'` and a reason out. Engine marks the ending under `modern` so the blurb can key on it | A pure function; no caller yet | table: no year; 1949; Pushkin with 1952 (stage); Pasternak with 1958 (modern); translator beats poet; unknown poet with 1960 (modern). Engine: «великий» modern [vʲiˈlʲikʲij], feature set; «симметрический» pinned | cut-off year (question 2); S2 EN, FR |
| 3 | The year on the song, the field in PIECE, and the config passed at the four sites of finding 12 | A typed year at or past the line turns the endings soft in Text and Markup alike; clearing it restores them; an old song opens unchanged | agreement test (Text and Markup give the same vowel for one -кий word under both values); export and import round-trip; record without a year validates | S3 EN, FR |
| 4 | The GUIDE section | Seated EN and FR, pinned | ratified-lines pin; `i18n` parity | the section, with Wednesday's Guide |

Gates after each step: the full suite, `tsc`, and the ratchets. **Cut order if it does not fit:** step 4 (it is ratified Wednesday regardless), then step 3 with step 2 (the switch waits; the note ships). After the share, in order: the third engine value `'literary'` with corpus flags; a stored per-word choice; жж and щ information notes from Grayson's own conditions.

## Questions only Dann can answer

1. (Removed 2026-11-09 at Dann's direction.)
2. **The cut-off year:** 1950 (recommended) or 1918.
3. **French** for S1, S2, S3, and the GUIDE section; and the GUIDE section's English in your voice.

## What I could not establish

- `/home/claude/aria-r2/` did not exist in the container or on the Mac during this review; aria counts are from the r1 aria file.
- "The bundled songs": I found none shipped in `apps/web/static` or `src`, only seven test fixtures (Mussorgsky, Tchaikovsky). NOT ESTABLISHED whether the brief meant those.
- What the Inspector shows today for ⟨и⟩ in -кий (the path after a missing process key was not run).
- The translator's dates for the library's Heine entry; the library shape carries no dates.
- `clitic-seat.ts:491`, `poem-join-wire.ts:34`, the exchange code, `omr/stamp`, and PAPER's title page were not read; the claims about them in finding 14 rest on the call-site grep and `library/types.ts` only.
- Grayson Chapter 9 was read at pp. 294 to 305 through the text layer; only pp. 302 and 303 were checked as images. The page of the «русский» example cited as p. 233 was not checked.
- The lane-day estimate is a judgement; nothing was timed.

Working files: rendered pages in `/home/claude/fpt/pages/`; Grayson text layer at `/home/claude/fpt/g.txt`. Nothing was written under `/home/claude/gates`, the Mac's folders, or `aria-r2`.
