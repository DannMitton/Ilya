# Report: integration step 5, row 71 (N.182, how Ilya suggests a key), 2026-11-09

Branch `cloud-lane-38`. Source: `cloud-lane-29`, commits `2788cc88` to `930ba192` (five commits). Rulings: `docs/memory/OPEN.md`, "ROW 71 (N.182): A KEY IS SUGGESTED ONLY WHEN IT REDUCES THE CHALLENGES", "... THE 43 `insights.key.*` ENGLISH STRINGS, RATIFIED", "... FRENCH STRINGS, RATIFIED". Nothing pushed to `Shane` or `main`, no pull request, `docs/memory/` untouched (read only). **Playwright not run** (the desk's order of 12:4x).

## What I read first

The lane's one cumulative report, `report-code-n182-suggesting-a-key_r2_2026-11-01.md` (steps 0 to 4, "For Dann", "Could not establish"), in the tree after the pick.

## The pick: conflicts

Five commits landed (`002fe909`, `90fe6235`, `80467c7a`, `919615cd`, `7197a913`). Two stopped:

| Pick | File | Resolution |
|---|---|---|
| step 2 (`7d993e09`) | `apps/web/src/lib/i18n.ts`, the head index: the total (this branch 1,149; lane 1,164) and the `insights.` line (149; lane 185) | Kept this branch's lines for the moment; the right numbers (below) can only be known after the strings are seated, so I set them once, at the end. |
| step 3 (`a8931b16`) | the same two index lines (lane 1,158 and 179, after retiring six keys) | Same. |

Final index: **`insights.` 186 and 1,186 keys in all** (this branch's 1,149 and 149, plus the lane's net +37: 43 added, 6 retired). `i18n-index.test.ts` passes. The lane's step 3 also lowered `InsightsPane.svelte` 760 to 744 in `ratchets.json`; that merged without conflict.

## The rule: a key is suggested only when it reduces the challenges

**What was wrong.** The lane built `improves` looser than the ruling: a key qualified if it lost a challenge or lowered a share by ten points, so a key that traded one challenge for another was shown (its own report called that out: "Look at the one-group picture", call B1).

**What I built** (`apps/web/src/lib/insights/key-suggest.ts`):
- `challengeCount(set)`: one for the range above, one for the range below (so `both` is two), one each for the primo, the secondo, and a sustained note above the secondo. JUDGEMENT: the ruling counts "challenges" and names no unit, so each named axis is one. It reads the set only.
- `improves(k, w)` is now `challengeCount(k.set) < challengeCount(w.set)` and nothing else. A swap, a share that only falls, and a key that only adds challenges are never offered. `matters` stays, unused by the search, so a test can show the two differ. The unused `dropped` helper is gone.
- Its comment says what it checks, why, what follows when every key fails it (`noneBetter` or `noWorkable`, the page saying so as information for her decision, never a failure), and how it relates to `matters`.
- `KeySearchInput.maxGroups` (optional, default `MAX_KEY_GROUPS`), passed only by a test. Reason below.

**The cap test.** The lane's cap test used a piece found by a seeded search where four groups qualify. Under the new rule I searched for such a piece for 240 s (random 16-note tenor pieces, two runs) and found none. Reaching four distinct challenge sets that each have fewer challenges than the written key is rare. So that test now runs the same real piece with `maxGroups: 2`: three groups qualify (-4, -5, -2), the default shows all three with `capBound` false, and with a cap of two the third goes under the reveal and `capBound` is true. **Consequence for the page:** the cap of three now binds rarely, and the lane's "cap binds" picture (the BARITONE voice) may no longer show three lines. See "What I could not establish".

**Tests (`key-suggest.test.ts`):** the old `improves` test (share drops count) is replaced by three: offered only with fewer challenges; never a swap, a share that only falls, or a key that only adds; `challengeCount` per axis. +2 net.

## The 43 strings, seated

`apps/web/src/lib/i18n.ts`, the 43 `insights.key.*` lines, in the lane's order, which is the order of `OPEN.md`'s numbered French list (the names `OPEN.md` gives agree with the order at every numbered key it names, checked by script).

- **English.** The lane's proposals stand for 36, as ratified. Seven carry the ratified text, verbatim from `OPEN.md`: `suits.primo`, `suits.secondo`, `suits.range` ("No alternate key suggested: as it stands, …"), `noneBetter` ("No better key: no other key within a tritone eases these challenges."), `noWorkable` ("No key within a tritone brings this song inside your range. Taking it on as a technical project, or choosing other repertoire, is your decision."), `why.range` ("beyond the range you gave"), and `fraction.most` ("more than half"). **`OPEN.md` says "except five" and lists seven.** I seated all seven; the desk may want to correct the count.
- **French.** All 43, from the numbered list. Item 2 reads "… et sous {secondo}." in `OPEN.md`, which I took as item 1 with {secondo}. `OPEN.md`'s copy has an ordinary space before each colon; the ratification says U+00A0 before every colon (OQLF), so I wrote U+00A0 (` `, as the lane wrote its four). Apostrophes are U+2019 and *primo*, *secondo*, *passaggio* are in asterisk italics, as listed.
- The block comment above the keys (which said every English string was proposed and every French slot carried the English, `TODO-FR`) now says both are ratified. No `TODO-FR` remains in `i18n.ts`.
- **The pin:** `apps/web/src/lib/insights/key-strings.test.ts` (new, 88 tests): the 43 keys in order (checked against `i18n.ts`), each English value, each French value, written out in the test (not read back from `i18n.ts`), and an OQLF check on the French (a no-break space before every colon, none before a semicolon, no straight apostrophe).
- **Pins moved because the English changed** (listed under "Ratified text changed"): `key-lines.test.ts` (the "past the notes you typed as your limits" clause twice, the three "No key suggested" lines, the `noneBetter` line, and `is yours to decide`); `e2e/insights-key-lines.test.ts` (two "No key suggested" and one `noWorkable` sentence, not run); the comment in `singer-blocks.ts:53`.

## Overlap in meaning with row 180's teacher line (reported, nothing changed)

Row 180's `insights.r2.teacherA`, "Discuss this approach with your voice teacher." (`i18n.ts:1955`; French « Discutez de cette approche lors de vos cours de chant. »), is placed by `singer-blocks.ts:191-194`: where Ilya calls the key unlikely and no key is shown (`noWorkable` or `noneBetter`), it stands under the one-line answer. It now follows these two ratified sentences:
- After `noWorkable`, "Taking it on as a technical project, or choosing other repertoire, is your decision.": "this approach" reads as the technical project. That is close to the answer's own advice; the teacher line adds a person to ask, so it is not a contradiction.
- After `noneBetter`, "No better key: no other key within a tritone eases these challenges.": no approach has been named, so "this approach" has no clear referent. This is the one place the meaning does not follow.
- The plural `teacherA.many` (row 180, 2026-11-04) is not used by the key forward.

I changed nothing there. The lane's report says the teacher line under both answers is "today's behaviour kept" (its "Decisions I took").

## Gates (baseline on Shane, then this branch)

| Gate | Baseline | Now | Move |
|---|---|---|---|
| 1 phonology | 407 passed (407) | 435 passed (435) | +28, row 157 (unchanged by this step) |
| 2 dictionary | 248 passed (248) | 248 passed (248) | none |
| 3 web check | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files | none |
| 4 web unit | 4198 passed, 1 skipped (4199) | 4594 passed, 1 skipped (4595) | +396: 257 before this step, +139 now: the lane's row 71 net +49 (+30, +21, -2), my `key-strings.test.ts` +88, my `key-suggest.test.ts` +2 |
| 5 score-parser | 785 passed, 5 skipped (790) | same | none |
| 6 blurb | 148 passed (148) | 164 passed (164) | +16, row 157 |
| 7 integration | 125 passed (125) | 125 passed (125) | none |
| 8 ratchets | OK. | OK. (691 source files) | none; it offers `+page.svelte` 5549 to 5534 (steps 2 and 4) besides five Shane-own lowerings. I lowered none |

## What a singer would now see (that she did not on Shane)

On INSIGHTS, for a voice with a typed range (behind `PUBLIC_INCLUDE_MARKUP_INSIGHTS`, as the lane says):
1. **One search for a key** replaces the old "better key" block and its six strings.
2. **A key is offered only when it has fewer challenges** than the one she is reading. A key that trades one hurdle for another never appears.
3. **Each key line** reads "Down a whole tone · C minor: stays inside your range; …", naming bars (never pitches or counts of notes), with fractions ("about a third", "more than half") for the share of singing at or above her primo or above her secondo, and a "Try this key" chip that opens the ruler on MELODY.
4. **Where the key already suits:** "No alternate key suggested: as it stands, the song stays inside your range and below your primo." (secondo for a voice with no primo axis; the range alone where she has typed no passaggi).
5. **Where no other key helps:** "No better key: no other key within a tritone eases these challenges." **Where none brings the song inside her range:** "No key within a tritone brings this song inside your range. Taking it on as a technical project, or choosing other repertoire, is your decision." The teacher line follows these two.
6. **A disclosure** ("Show keys that reach higher", "… lower", "… higher or lower") on screen, not in print, holding the keys past the cap or beyond a tritone's two-semitone margin, each with how far ("by a minor third").
7. **French** for all of it, as ratified (« mélodie », « ambitus », « changement de timbre », « Afficher les tonalités plus aiguës »).
8. The six old "better key" sentences are gone.

## What I could not establish

- **Anything in a browser.** No Playwright run. The lane's `e2e/insights-key-lines.test.ts` (15 tests) was written against the looser rule: its "one group" (`BASS_B1`), "three groups" (`BASS_B2`), "reveal", and "cap binds" (`BARITONE`) states may no longer hold (the lane's own report calls `BASS_B1`'s key a swap: it loses a small primo share and gains a range challenge below, which now is not offered). I updated only its strings. **I did not recompute those states.** The Playwright run after step 7 will show it; expect reds there that belong to this step.
- **The lane's seven pictures** (`docs/sessions/n182-shots-r2/`) were taken under the looser rule and the proposed English; they are stale for any state that moved.
- **How a challenge should be counted.** `both` as two is my reading (JUDGEMENT). If Dann means "range" as one challenge, `challengeCount` changes by one line and tests move with it.
- **How often a key is now offered at all** on real songs and real voices. The lane's grid (1,680 voices, cap bound 2.6 percent) was run under the old rule; I did not rerun it.
- **Whether the new French reads right on the page**, including the French line's first word after the move words (the lane's step 3 note about « Un ton plus bas »).
- **The seven versus five** English strings discrepancy in `OPEN.md`: I seated what it lists.
- **The lane's own open items** (surrogate vowels on a real voice, the no-chip case, the phone project for INSIGHTS) carry over.
