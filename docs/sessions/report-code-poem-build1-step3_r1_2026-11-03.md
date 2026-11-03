# Report: poem library build 1, step 3, the matcher (Code cloud lane, r1, 2026-11-03)

Brief: `brief-code-poem-library-build1_r3_2026-11-03.md`, step 3. Branch `cloud-lane-31`, on top of step 2's commit. Earlier reports: `report-code-poem-build1-step0_r1_2026-11-03.md`, `-step1_`, `-step2_`.

## A finding that changes a rule, first

**Believed: the brief's three rules (score at least 0.15, margin at least 0.10, length at most 3 x) stop a wrong fill. Now known: they do not, for a short Lyrics. I added a floor of 80 letters (`MIN_QUERY_LETTERS`), which the brief does not have.**

The brief's numbers were measured on whole songs, the shortest 113 letters (`fixtures`: `r114-song3`). A short text that stands word for word in a long poem scores high by chance. `matchPoem('Привет')` filled «Мцыри» in my first run, because a six-letter stretch of «Мцыри» aligned perfectly: score 1.000. I then cut the three fixtures that have no poem in the library (`U4`, `U5`, `r114-song1`, 978 letters in all) into overlapping windows and ran the brief's three rules on each, against the shipped 13-work library:

| Window | Windows | False fills | Highest top score |
|---|---|---|---|
| 6 letters | 963 | **440** | 1.000 |
| 10 | 476 | 174 | 0.900 |
| 15 | 313 | 94 | 0.633 |
| 20 | 186 | 29 | 0.475 |
| 30 | 128 | 10 | 0.317 |
| 40 | 88 | 3 | 0.237 |
| 50 | 71 | 0 | 0.190 |
| 60 | 54 | 0 | 0.158 |
| 80 | 39 | 0 | 0.119 |
| 100 | 29 | 0 | 0.095 |

(Windows step by a quarter of their length, so they overlap and are not independent; three songs is a small sample.) At 50 and 60 letters nothing filled only because the margin rule held; at 80 the top score itself stays under 0.15. **I set the floor at 80 letters: DESK DEFAULT (mine), reversible, one constant.** It sits under the shortest build song (113), so every song in the build set keeps its fill (a test pins this). The cost: a Lyrics of fewer than 80 letters gets no library poem, even a true one. Where the Lyrics can be that short: a scan read in part (`homr-reader.ts:402-407`, `unreadBars`), or a few lines pasted. NOT ESTABLISHED: the false-fill rate on a library of 1,000 works. The desk's scale test (brief) measured chance at most 0.088 on whole songs; short Lyrics were not part of it, and a larger library only raises the chance of a verbatim hit. I recommend the floor stays at 80 or rises when the library grows, and that the measure above is repeated then.

A committed test reproduces the part that matters: it counts fills on 6- and 15-letter windows with the floor lifted (the control: more than 300 and more than 50), and requires none at 80 and 100.

## What was built

| File | State |
|---|---|
| `apps/web/src/lib/text/poem-match.ts` | new, 316 lines, pure |
| `apps/web/src/lib/text/poem-match.test.ts` | new, 414 lines, 40 tests |

The module has no DOM, no IndexedDB, no clock, no random value. It imports only the types and `decodeOffsets` from step 2's `poem-library.ts`. `lib/text/` is outside the six modules of `scripts/ratchets.mjs:78-85`, so no layering rule applies.

Exports: `foldLetters`, `align`, `shortlist`, `rankWorks`, `evaluate` (the decision and its reason), `matchPoem` (its answer), the constants `MIN_SCORE` 0.15, `MIN_MARGIN` 0.10, `MAX_LENGTH_RATIO` 3, `MIN_QUERY_LETTERS` 80, `SHORTLIST` 20, `ENTRY_TIE` 0.01.

- **The fold** is the reference's. The test pins it against the build's `letters` for all 14 entries (19,553 letters), so the app's fold and the data's cannot drift apart.
- **The alignment** is Smith-Waterman, +2 / -1 / -2, one row of the table kept. A test holds it to a full-matrix version on 300 random pairs (score equal on all 300).
- **The score** is the best local score over 2 x the Lyrics' letters; a work's score is its best entry's.
- **The shortlist**: with 20 works or fewer, all are aligned (the shipped library has 13). With more, the 20 sharing the most letter trigrams with the Lyrics. A test builds a 213-work library (the 14 real entries plus 200 invented poems of 300 letters) and checks that 20 are aligned and that the top work and its score equal the full run's for six fixtures.
- **The entry**: best-scoring; within 0.01, the `modern` one.

## The traceback (amendment 1), and how it differs from the usual one

The brief asks for "a traceback giving the matched stretch's start and end in the entry". I did not keep the full table (a song of 600 letters against «Мцыри» is 600 x 15,500 cells). With each cell I carry where its alignment began, in the poem and in the Lyrics, so the best cell names its own stretch with one row of memory. `PoemMatch` gives `letterStart` and `letterEnd` (inclusive, in `entry.letters`) and `start` and `end` (in `entry.textModern`; `end` is just past the last matched letter's character).

Two tests hold it: on 300 random pairs the stretch starts and ends on a matched letter, and aligning only the named stretches gives the same score as the whole (so nothing of the best alignment lies outside them). Where two alignments score alike, the one named is fixed (the first cell in row order to reach the best score) but is not a claim the other is wrong. The score does not depend on this choice.

**Where the stretches fall on the fixtures** (first 40 characters of the stretch in `textModern`, from a one-off run):

- `r114-song2`: «Весёлый час», stretch from «калы!» to «Видит заря», more than 90% of the poem's characters (a test pins it). The stretch begins inside the first word «бокалы», so step 4's cut to whole stanzas takes the whole poem, and step 5's first line is the line holding `start` («Дайте бокалы!»).
- `S`: «Мцыри», stretch from «ё,\nОстанься здесь со мной» on, less than a tenth of the poem (a test pins that it contains «Останься здесь со мной»). The stretch begins at the «ё» of «моё» in the line before. Walk item 8's passage wording will take the first line of the stanza; step 5 decides the line.
- `P`: «Средь шумного бала, случайно», a stretch from «но тайна» to «Лишь очи печально»: the song sets part of the poem.

## The tests

`apps/web`, `pnpm exec vitest run src/lib/text/poem-match.test.ts`: 40 tests.

- **Every fixture's top work, its score, the second work and its score, and the margin equal `expected_r1.txt` to three decimals** (12 tests, the reference rows parsed from the file, not typed in). The letter counts also match.
- Fills: P, S, T, U1, U6, and row 114 songs 2 to 5. No fill, for the reason `low-score`: U4, U5, row 114 song 1.
- Five-song concatenations do not fill. I measured four and all four refuse: row 114's five songs (1,180 letters: top «Весёлый час» 0.151, second 0.104, refused by **margin**), S+T+U1+U6+P (1,347: «Спящая княжна» 0.219, second 0.166, **margin**), a five of small poems (1,240: 0.164 and 0.144, **margin**), and U4+U5+song1+U4+U5 (1,795: 0.005, **score**).
- **The length rule did not decide any of those.** It decides when a poem is sung over and over: «Весёлый час» four times is 1,136 letters against 284, its score and margin pass, and the length rule refuses it; three times (exactly 3 x) fills. A test pins both, and checks that without the length rule the score and margin alone would have filled it.
- Entry choice: the library's one work with two entries (`f1a88510`, «Молитва», pre-reform and modern) fills with the modern entry; a synthetic pair with the pre-reform entry higher by under 0.01 fills with the modern one; one where the pre-reform entry is clearly better fills with it.
- Empty input; the margin refusal when two works fit alike; purity (the library is unchanged, the answer repeats).

**Controls** (a rule broken, to see a test fail): margin set to 0 fails 3 tests; the length rule removed fails 1; the match score 2 changed to 3 fails the alignment test and every fixture row; the floor removed fails 2. My first run of the modern-entry rule survived its mutation (the modern entry already scored highest on that fixture), so I added the synthetic pair above; the mutation now fails that test.

One mismatch with the reference before the tie rule: the reference names the second work with `sorted(..., reverse=True)`, so equal scores go to the larger work id. Mine ordered them the other way, and two rows (`r114-song1`, `r114-song2`) named a different second work at the same score. The scores were never different. I changed the tie order to match the reference.

## Speed

On this machine (a Linux cloud sandbox, Node 22), `rankWorks` over the 13 works took 14 to 70 ms per fixture (a one-off run; the 567-letter fixture U5 took 70 ms). The 213-work library test, which aligns 20 works for each of six fixtures and then runs fill and refuse checks, ran in 454 ms and 143 ms. NOT ESTABLISHED: the time on a phone.

## Gates after step 3

| Gate | Step 0 | Now |
|---|---|---|
| phonology, dictionary, blurb, score-parser | 407, 248, 148, 785 + 5 skipped | not rerun (no change in the packages) |
| web unit | 3898 + 1 skipped | **3958** + 1 skipped (step 2: 3918; +40) |
| integration (root) | 98 | 112 (step 1; not rerun) |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings (980 files) |
| ratchets | OK | OK |
| e2e | 82 passed, 8 failed | not rerun: no UI code changed. Step 6 reruns it. |
