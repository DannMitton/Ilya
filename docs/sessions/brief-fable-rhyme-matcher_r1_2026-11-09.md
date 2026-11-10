# Brief: review a design, the ‑кий rhyme matcher on Ilya's own stress data (Fable, r1, 2026-11-09)

From the desk (Opus) 2026-11-09 20:5x, at Dann's request (20:47). A design review that ends in a Code-ready build plan; nothing is built, committed, or pushed by you. Cap: 300k tokens; stop and write what you have at the cap. Report to `/home/claude/fpt/review-fable-rhyme-matcher_r1_2026-11-10.md`, then a hand-back under 150 words.

## 1. Why

Grayson 2012 p. 302 (read on the page by the desk and by Fable this session): where older verse rhymes an unstressed adjective ending ‑кий/‑гий/‑хий with an unstressed ‑кой/‑гой/‑хой, "the singer must read the -ий suffix as [ʌj] (or /əj/)", and "in the end, the rhyme takes precedence" (n. 328 extends the principle beyond velars; out of scope here). His worked example rhymes «глубокой» with «высокий», both [kʌj]. Ilya today gives «высокий» [vɨˈsokɨj] and «глубокой» [ɡɫuˈbokʌj] (Fable, `review-fable-period-and-tradition_r1_2026-11-10.md` finding 7d): it breaks Grayson's own example.

Dann (2026-11-09 20:19 to 20:47) wants Ilya to detect the rhyme. His rulings in force: Ilya takes a defensible position, and a second pronunciation is not offered as an option (2026-11-01 23:16); the date criterion needs a source of its own (20:40); per-word Inspector marks are saved with the song (20:44); the era control ships with the share (20:22; freeze Wednesday 2026-11-11 noon).

## 2. The proposed design (desk, from the research)

Research: `docs/sessions/research-rhyme-detection_r1_2026-11-09.md` (read it in full). No browser-ready Russian rhyme detector exists; RPST (MIT) and rupo (Apache-2.0) are Python with heavy models. The closest precedent is the rule-based method of the Pittsburgh Akhmatova project (stressed vowel to line end, compared within the stanza). The desk proposes:

1. **Trigger.** A line-final word ending ‑кий/‑гий/‑хий whose ending is unstressed (the engine's stress, not spelling).
2. **Partner.** A line-final word ending ‑кой/‑гой/‑хой, ending unstressed, within the same stanza and within three lines either side (covers AABB, ABAB, ABBA).
3. **Match.** Identical from the stressed vowel onward, comparing the engine's phonetic material, except the final ий against ой. The stressed vowel and every consonant after it must agree (rich rhyme not required).
4. **Uncertainty keeps the default.** No line breaks, an unknown stress on either word, a homograph the dictionary cannot resolve, or a line read from a scan with unread words: no match, and Ilya's default reading stands. The matcher never guesses toward the rhyme.
5. **Result.** The triggering word takes the rhyme reading [kʌj] (the engine's third value, `'literary'` in Fable's naming; it does not exist today), with an Inspector note citing p. 302 that names the partner word.
6. **Precedence** (Fable era review, finding 7): the singer's per-word choice, then the rhyme, then the date, then the default.

## 3. What to read

- Grayson p. 302 and p. 303 as rendered images (`~/Downloads/Grayson - 2012 - Russian Lyric Diction.pdf`, PDF page = printed + 16), for the exact vowel and the exact conditions; Fable's own working files `/home/claude/fpt/pages/` may hold them.
- `review-fable-period-and-tradition_r1_2026-11-10.md` (your earlier review) and the proposal it reviewed; `docs/memory/OPEN.md`, the sections ruled 2026-11-09 from 20:12 on.
- Code on the tip the desk names (`cloud-lane-38` is checked out at `/home/claude/gates`, read-only for you): the engine's stage/modern switch (`packages/phonology/src/engine.ts:27-28`, `:146`, `:1525`) and the velar-adjectival guard (`:635-650`); how stress is assigned and how an unknown stress is marked; where POEM and LYRICS keep line breaks (`text/witness-lines.ts`, the input views), and the four sites that produce IPA (`+page.svelte:443`, `:1805`, `text/witness-lines.ts:29`, `score/vowel-resolver.ts:476`, which reads the score's words as one line with no breaks); the poem join's inheritance of a matched poem (`poemSource`); the blurb composer (`data/blurb-composer.json` and its twin under `apps/web/static/data/`); `word-marks.svelte.ts` and the Spot Reconstitution path (`InspectorPanel.svelte:54`).
- Test material: RIFMA (`https://github.com/Koziev/Rifma`, MIT), as the research describes it; the shipped poem library (`data/dictionary.poems.*.json`, 14 entries) and the cleaned aria texts (`/home/claude/aria-r2/arias-for-library_r2_2026-11-09.json`, 89 entries).

## 4. What to answer

1. **The rule against the source.** Are the trigger, partner, and match conditions exactly Grayson's? Does p. 302 require the partner to be adjectival, unstressed, and after a velar? Does the stressed syllable before the ending have to rhyme too, or only the ending? What does Grayson do when a ‑кий word rhymes with another ‑кий word (both stay stage)?
2. **Where the rhyme is found, for each kind of song.** A typed POEM with line breaks; a LYRICS with or without breaks; a scanned score (words read per note, lines unknown); a song joined to a library poem. For the last, compare running the matcher live on the poem's text against flagging rhymes when an entry enters the library (Dann's 20:19 idea). Which path carries the result to the score's notes, given that Markup transcribes the words as one line?
3. **The window and the stanza.** Is "three lines either side, same stanza" right for the verse Ilya meets? Name the forms it misses and the false matches it invites (refrains, repeated lines, a song text that repeats a stanza).
4. **The third value.** The engine has stage and modern only. Specify `'literary'` for a single word ([kʌj], the velar hard), how it reaches all four IPA sites so Text, Markup, and INSIGHTS agree, and what the vowel tallies count.
5. **Precedence and the per-word choice.** Confirm the order; specify how a rhyme reading appears in the Inspector (the note, the partner word, the citation) and how the singer's per-word choice overrides it on the Spot Reconstitution paradigm, saved with the song per the 20:44 ruling.
6. **Test set.** Count the true cases in RIFMA, the shipped library, and the cleaned arias. If there are too few, specify a hand-built set (at least the Pushkin pair on p. 302, plus negative cases: stressed ‑ой partner, a non-velar ‑ий, a line without breaks, an unknown stress).
7. **What it touches** (`CONTRACT.md` §4, "every other site"): the dictionary build, LEARN's pinned rows, PAPER, the blurb tests, stored songs.
8. **A build plan** for one Code lane on Tuesday 2026-11-10, in steps with done states and tests, the strings each step needs ratified first (EN, then Dann's French), and the cut order if the day runs short. Say whether the matcher fits beside the era control in one lane or needs its own.

## 5. Form

Verdict first (PROCEED, PROCEED WITH CHANGES, or RETHINK), then numbered findings with the page or file:line read this session, then the build plan, then "Questions only Dann can answer" (taste, the irreversible, French), then "What I could not establish". House style: Canadian spelling, Oxford comma, no em dashes, none of "should", "simply", "just", "easy". NOT ESTABLISHED beats a complete invented answer. Every code claim carries a line read this session (`CONTRACT.md` §0).
