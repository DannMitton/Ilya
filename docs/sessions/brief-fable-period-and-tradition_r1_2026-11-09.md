# Brief: review a design, readings that depend on the work (Fable, r1, 2026-11-09)

From the desk (Opus) 2026-11-09. A design review, not a build: nothing is committed or pushed. Cap: 350k tokens; stop and report at the cap. Report to `/home/claude/fpt/review-fable-period-and-tradition_r1_2026-11-10.md`, then a 120-word hand-back.

## Scope change (Dann, 2026-11-09 20:22)

This ships with the colleague share, not after it. Code builds it on Tuesday 2026-11-10; the freeze is Wednesday 2026-11-11 at noon. So your build plan (question 8) must fit one Code lane in one day, with its gates, and must say what to cut if it does not. Dann's further input (20:14, 20:15, 20:19): detect the date from the composer's dates; consider the poet's or librettist's dates; and flag -кий/-ой rhymes ahead of time in the onboard poem corpus (checked data on each library entry, inherited by a song matched to that poem) instead of a live rhyme test. The desk measured the shipped library: 14 poems, 2 line-final -кий, no -ой rhyme; the 92 aria texts (being cleaned tonight, `/home/claude/aria-r2/`) hold 13 line-final -кий, mostly speaker-label names. Weigh the corpus-flag approach against a live test and recommend.

Files are on Dann's Mac: reach `~/Downloads/...` and `~/Desktop/ilya-rewrite/...` through the device tools (mcp__remote-devices__device_bash; connected folders under `$HOME/mnt/`). The repository tip `cloud-lane-38` is also checked out in the container at `/home/claude/gates` (read-only for you).

## The idea

Russian lyric diction has sounds whose reading depends on the work. Ilya today sings one reading for each: Grayson's preferred one. Dann (2026-11-09 20:03 to 20:14) wants Ilya to choose the reading from criteria the sources give, show the reasoning in GUIDE and in the Inspector on demand, and give the singer a control that is a fact about the song, not a style option. His standing ruling holds (2026-11-01 23:16): "The idea of an optional softening should really come from a coach. Ilya is going to take a defensible position."

The desk's design: `docs/sessions/proposal-period-and-tradition_r1_2026-11-09.md` (read it in full first). In short: a precedence of the singer's per-word choice, then the rhyme, then the date (for -кий only), then Grayson's default; the date from an optional Year field in PIECE, else from the composer's dates where they decide it; щ and жж offered as information and per-word choice, not switched by date; the Inspector's note in two layers; one GUIDE section.

## Sources to read yourself (do not trust the proposal's quotations)

- Grayson 2012, `~/Downloads/Grayson - 2012 - Russian Lyric Diction.pdf` (PDF page = printed + 16): pp. 64, 172 to 175, 240, 301 to 303, and Chapter 9 wherever it treats the adjective ending. The IPA font does not survive `pdftotext`; render the page (`pdftoppm -r 140`) and look where a symbol matters, above all the rhyme vowel on p. 302.
- `docs/memory/OPEN.md` and `INBOX.md` for every ruling on palatalization, -ся, the stage profile (the DESK DEFAULTS of 2026-11-02 00:4x), and the "one-line note… information for the singer, not a second pronunciation" ruling of 2026-11-01 23:27.

## Code to read (on `origin/Shane`, then on the tip the desk names in the prompt)

`packages/phonology/src/engine.ts` (the velar-adjectival guard near `:635-650`; `:307`; how a lexical rule hooks in, as `lexical-gk.ts` does on `cloud-lane-38`); `apps/web/src/lib/composers-poets.ts`; `components/Drawer/MetadataFields.svelte` and how the composer string is stored ("Modest Mussorgsky (1839–1881)"); the NOTATION toggles (`i18n.ts` `cosmetic.*`, `NotationFields.svelte`); `InspectorPanel.svelte` (the reading chooser near `:1056-1095`; the phonological notes); the blurb composer (`data/blurb-composer.json`, `packages/blurb`); the corrections store the Loupe uses; where the poem's lines are kept (POEM, LYRICS) for a rhyme test.

## What to answer

1. **The sources.** Is each sentence the proposal attributes to Grayson on the page, in that sense? Is there a criterion in the source the design misses (Grayson Chapter 9 above all)? Is "only -кий has a machine-applicable rule" right?
2. **The precedence.** Is per-word choice, then rhyme, then date, then default the right order by the sources and by Dann's 2026-11-01 ruling? Does a per-word choice break that ruling, or is it the coach's channel he described?
3. **The date.** Is composer-dates inference sound? List every `COMPOSERS` entry whose dates do not decide a 1950 line, and say what share of the bundled songs and the poem library that leaves undecided. Is 1950 a defensible cut-off year, and what are the alternatives? Dann asked (20:15) whether the poet's or librettist's dates are the right witness instead of the composer's: answer from the source (Grayson's rhyme argument about older poetry, p. 302), with the case of a Soviet setting of Pushkin worked through.
4. **The rhyme test.** Can Ilya find line-end rhymes reliably from what it holds (POEM text, line breaks, stress from the engine)? Name the failure cases (enjambment, a lyric without line breaks, a scan with words only partly read). Recommend: build it, build it behind a confidence floor, or leave rhyme to the per-word choice.
5. **Controls.** Year field in PIECE, a NOTATION toggle, and the Inspector's per-word choice: is the ranking right? Is there a better device or place, judged by Ilya's GUI principles (the Fable GUI rulings of 2026-08-18 in project knowledge, `claude/fable-ruling-gui-principles-and-portrait-c_2026-08-18.md`)?
6. **The Inspector and GUIDE.** Are the two layers right? Are the desk's draft lines true to the sources and in house style (Canadian spelling, Oxford comma, no em dashes, no "should", "simply", "just", or "easy")? Redraft any that are not. French is Dann's; mark where a French draft is needed.
7. **What it touches** (`CONTRACT.md` §4, "every other site"): the dictionary build, the bundled songs, PAPER, the blurb, the ratified-lines tests, stored songs and their stamps (a stored song re-read when its year changes?), LEARN's tables pinned to the engine.
8. **A build plan** for Code in steps, each with a done state and tests, and the strings each step needs ratified before it starts.

## Form

Verdict first (PROCEED, PROCEED WITH CHANGES, or RETHINK), then numbered findings, each with the file:line or page read, then the build plan, then "Questions only Dann can answer" (taste, the irreversible, French), then "What I could not establish". NOT ESTABLISHED beats a complete invented answer. Every code claim carries a line read this session (`CONTRACT.md` §0).
