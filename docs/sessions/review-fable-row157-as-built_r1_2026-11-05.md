# Review (Fable): QUEUE row 157 as built, `cloud-lane-29` `c16b9b81` to `0ceeb22a` (2026-11-05)

Reviewed from a fresh clone at `/root/c157/ilya`, lane tip `0ceeb22a`, against `Shane` `2e3803da`. Every `path:line` below was read on the lane tip (or on the pick worktree, which holds the same lines) this session. Rows 172 and 71 (`c4584256` to `930ba192`) were not reviewed.

## Verdict: MERGE WITH AMENDMENTS

The phonology does what the ruling says on every word the ruling names, with tests that fail first against the pre-row engine (16 of 52 in `voicing-rule2.test.ts`, run by me against `930ba192`'s `engine.ts` and `voicing-rule2.ts`). All 24 ratified strings sit in `data/blurb-composer.json` verbatim by code point. One amendment is to the text the singer reads: the French implication carries a no-break space before the semicolon, which the OQLF rule the tree enforces everywhere else forbids. One amendment is to the report. Nothing else blocks the merge.

## Findings

**1. The French implication puts a no-break space before « ; », against the OQLF rule (amend).**
`data/blurb-composer.json:1766`, `:1776`, `:1786`, `:1796`, `:1806`, `:1816` (the six `retained-voicing:<letter>` implications, `fr.template`): `…se dévoiserait ici ; une préposition…`. The standing rule is a no-break space before « : » and none before « ; » (`docs/memory/CONTRACT.md:134`, Dann 2026-11-02 09:02 and 09:28; `docs/memory/ENVIRONMENT.md:2384`, ruled 2026-08-21, reaffirmed 2026-09-30), and the tree's own checker calls ` ;` a fault (`apps/web/src/lib/i18n.test.ts:110`, `:121`). The seated text matches the ratified file (`docs/sessions/ratified-retained-voicing-blurb_2026-10-26.md`, md5 `80e954f303c9bc427bf6aabfc107b62f`, two U+00A0, one before the colon and one before the semicolon), so Code seated what it was given; the fault is the desk's draft of 2026-10-26, which the brief then named as "the two French no-break spaces". The process line's `voisement : [{ipa}]` is right. No gate caught it because `french-parity.test.ts` does not run the OQLF table over the blurb templates. CONTRACT 6a says apply the OQLF ruling and do not ask; 11a says change the text and its pin together and list the change.
Fix: in the six implication lines, `ici ; une` becomes `ici; une`; in `packages/blurb/tests/retained-voicing.test.ts:21` drop `${NBSP}` before the semicolon, at `:39` pin `ici; une`, and correct the header at `:5-6` ("before the colon and before the semicolon" becomes "before the colon"). The desk records the correction against the ratified file in `OPEN.md` ("N.198 AND ROW 157", third bullet), which stays as the record of what was ratified. Lead, not for this row: add the `faults` check of `i18n.test.ts:103-116` to `french-parity.test.ts` over every `fr.template`; after the fix the file has 0 spaces before « ; » and every colon carries U+00A0 (my count over 194 French templates), so it would pass.

**2. The report misstates two things about the data file (amend the report).**
`docs/sessions/report-code-row157_r1_2026-11-02.md:213`: (a) "written as the six characters ` ` (never a literal)" shows a literal U+00A0 between the backticks where the six characters ` ` were meant (read by code point: 0x60 0xA0 0x60). The data itself is right: the twelve new templates hold 12 escapes and 0 literals (my scan). (b) "The file's existing 68 lines with a literal U+00A0 are untouched": the file holds 46 literal U+00A0 on 41 lines before and after the row (my count at `930ba192` and at the tip); the brief's "52" is also off. The diff is 120 insertions and no deletions (`git show --stat c7e95cf6`), which is the claim that matters.
Fix: write the six characters as ` ` inside the backticks, and either correct 68 to 41 lines or drop the number.

**3. Reachability of `retained-voicing:в` (no change; a lead).** The mark is set only where `isVoicedObstruent(leftFinal)` holds (`engine.ts:1946-1947`), and `v`, `vʲ` are in `crossWordVSet`, not `crossWordVoicedObstruentSet` (`engine.ts:1828`, `:1830`). So the ⟨в⟩ pair (`blurb-composer.json:839`, `:1770`) cannot be reached from the engine. It is as ratified (six letters, the shape of the `final-devoicing` pairs), and `french-parity.test.ts` counts it; row 175 retired unreached templates, so the desk may want to decide whether this one stays. Not a defect of the build.

**4. «Бог-то» sings [bok] (no change; a lead, pre-existing).** With a hyphenated particle the token is «Бог-то», `lettersOf` gives «богто», and neither `transcribe`'s exception (`engine.ts:1726`, `cleanWord === 'бог'`) nor `finishBog` (`voicing-rule2.ts:100`) sees «бог»: display `bok to` on the lane and on `Shane` alike (my probe through `processText`). The ruling says "never [bok]". Dann's call whether a hyphen-joined «бог» is «бог»; not this row's brief.

**5. Two statements folded onto one source line (note, no change).** `engine.ts:1947` reads `leftWord.skipFinalDevoicing = true; if (!viaV) leftWord.retainedVoicing = true; // row 157…`. A reader scanning for the `if` will miss it after the semicolon. The fold is forced by the ceiling (`engine.ts` is 2048 of 2048, `scripts/ratchets.json:13`), and the same reason packs `:120` and `pipeline.ts:142`. Acceptable; when the file next gains headroom, unfold it.

**6. The Inspector on the bare «в» after a look-through (no change; context for lead 2 of the report).** «Бог в траве» and «лес в траве» show the «в» ribbon as ⟨в⟩ → [f] with the `final-devoicing` blurb ("falls at the end of a word"), because the cross-word devoicing branch sets no log feature and `writeSurfaceToWord` marks every surface change as final devoicing (`apps/web/src/lib/voicing-log.ts:43-52`, the block moved verbatim). Pre-existing, the devoicing twin of the gap the report names; belongs with that lead when Dann sees the lines.

### What checked out (so the desk need not re-read it)

- Every ruled «бог» line through `processText` with the real dictionary on the pick worktree (`Shane` + row 157): «Бог», «Бог там», «Бог мой», «Бог один», «Бог ли», «Бог в траве», «Бог в мае», «Бог, мой», «бог», «БОГ», «Бог с ним» → `ˈbox`; «Бог даст», «Бог в доме», «Бог же», «Бог бы», «Бог был», «Бог вдруг», «Бог жив», «Бог знает» → `ˈboɣ`; «небог» → `ɲɛ bok`. The ribbon follows (`⟨г⟩ → [ɣ]` or `[x]`, `bogException` true, `finalDevoicing` false) and the blurb prints "[ɣ]" or "[x]" through `{ipa}`, EN and FR. `finishBog` (`voicing-rule2.ts:94-111`) matches the brief's step 1 to the letter, runs after the final loop (`engine.ts:2009`), reads the в through `initialPastV`, and replaces only a final `ɡ`, `k`, or `x` (`:101`). The p. 242 comment is now p. 144 (`engine.ts:1724`).
- The look-through: «лес вдали», «лес в доме» → `ˈlʲɛz`; «кот вдруг» → `ˈkod`; «лес в траве», «лес вот», «лес в лесу» → `ˈlʲɛs`; «сад вдали» → `ˈsɑd`; «дух вдали» → `ˈduɣ`; the one-line removal at the old `:1944` is the whole change (`git show d1f54ab1`), and `rightInitial` stays narrowed by the `continue` at `:1945-1950`, so `check` is clean.
- The mark: set in one place (`engine.ts:1947`), cleared at the start of every pass (`:1924`), declared on `BoundaryWord` (`:120`), `TranscribedWord` (`pipeline.ts:142`), `SurfaceWord` (`voicing-log.ts:29`), and `TranscriptionFeatures` (`packages/blurb/src/types.ts:88`); `deriveRule` ranks it after `silent` and the two `regressive-*` and before `final-devoicing` (`composer.ts:247-249`). Through the pipeline: «меж», «без», «б» (in «если б мог»), «сквозь», «вокруг», «близ», «средь», «из-под», «вслед», «об» are marked and blurbed with the citations the brief pinned (⟨ж⟩ `pp. 165, 174, 251–252`, ⟨з⟩ `pp. 143, 251–252`, ⟨б⟩ `pp. 144, 251–252`, ⟨г⟩ `pp. 145, 251–252`, ⟨д⟩ `pp. 146, 251–252`); «сад наш», «муж дома», «под водой», «без вас», «из воды», «Бог мой» are not. «сквозь» loses its soft-sign sentence for the kept-voicing one, as the brief said it would.
- Strings: all 24 (process and implication, EN and FR, six letters) equal the ratified file by code point; « d’un » keeps U+2019; the escapes are the six characters ` ` in the JSON source (12 escapes, 0 literals in the new keys; the 46 older literals untouched); citations `pp. 251–252` on all four slots of every pair, so `french-parity.test.ts:40-47` holds. Static data: `data/blurb-composer.json` 78,876 to 85,020 bytes, as reported.
- Counts moved by the row: `french-parity.test.ts:29-33` 181 → 193; `tests/palatalization-comments.test.ts:151-152` 41 → 47 implications; `ratchets.json` `engine.ts` 2051 → 2048, `pipeline.ts` 925 → 901.
- The move of the `finishLine` block into `voicing-log.ts` is verbatim (`git show 9a2548c5 -- apps/web/src/lib/pipeline.ts` against `voicing-log.ts:33-58`); `finishLine` calls it once (`pipeline.ts:852`).

## The cherry-pick onto `Shane` `2e3803da`, without rows 172 and 71

Done in a scratch worktree `/root/c157/wt-pick`, branch `pick-157`, `git cherry-pick c16b9b81^..0ceeb22a`. Row 157's 14 files are disjoint from the 221 files `Shane` changed since the lane's base `f9797acb` (intersection empty; the desk's claim holds for every source file). Two conflicts, both in `scripts/ratchets.json` and both context-only: the lane's rows 172 and 71 lowered `CalibrationWizard.svelte` and `Drawer.svelte` on the lines beside `engine.ts`, which `Shane` has not. Resolution each time: keep `Shane`'s neighbours and take the row's `engine.ts` value (2049 at step 1, 2048 at step 2); `pipeline.ts` 901 auto-merged. Six commits land (`2490b4bf` to `9b862d26`), nothing committed outside the worktree, nothing pushed.

Gates on the pick (`Shane` + row 157), with the lane tip and `Shane` alone beside them:

| # | Gate | Pick | Lane tip `0ceeb22a` | `Shane` `2e3803da` |
|---|---|---|---|---|
| 1 | `pnpm --filter @ilya/phonology test` | 435 (13 files) | 435 | 407 |
| 2 | `pnpm --filter @ilya/dictionary test` | 248 | 248 | 248 |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings | 0 errors, 12 warnings | NOT RUN |
| 4 | `pnpm --filter @ilya/web test` | 4230 passed, 1 skipped (235 files) | 3927 passed, 1 skipped (222 files) | NOT RUN (the row adds 32; 4198 by subtraction, not measured) |
| 5 | `pnpm test:integration` | 125 (7 files) | 98 (6 files) | 125 |
| 6 | `pnpm --filter @ilya/blurb test` | 164 (3 files) | 164 | 148 |
| 7 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped | 785 passed, 5 skipped | NOT RUN |
| 8 | `pnpm ratchets` | OK; offers six lowerings | OK, nothing offered | OK; offers the same six |

The six lowerings ratchets offers on the pick (`Drawer.svelte` 1990 → 1975, `LearnContent.svelte` 4099 → 4096, `Loupe.svelte` 3013 → 3011, `pairings.ts` 1422 → 1420, `CalibrationWizard.svelte` 2124 → 2112, `staff-renderer.ts` 3427 → 3426) are `Shane`'s own, offered identically on a clean `Shane` checkout; none is row 157's. Gate 5's 125 on the pick against 98 on the lane is `Shane`'s seventh integration file, not the row. The lane-tip counts confirm the desk's evaluation (phonology 435, blurb 164).

So: yes, row 157 cherry-picks onto today's `Shane` without rows 172 and 71, with the two `ratchets.json` resolutions above, and every gate passes at the counts in the Pick column (plus amendment 1's test edits, which change no count).

## What I could not establish

- The browser: no Playwright or page run here. The report's Drawer walk (merged proclitic ribbons open) and its `refreshPairings` reading for an already-seated song (`pairings.ts:444-480`) were not re-run; the pipeline tests they rest on pass.
- Gates 3, 4, 7 on plain `Shane` (not run; the pick's counts stand on their own).
- Whether an installed app fetches the larger `blurb-composer.json` on its next online start (N.195's loader; not run).
- What Grayson prescribes for «бог» beyond p. 144, and whether the х → ɣ, ц → dz, ч → dʒʲ allophones at a word boundary are his: as the brief and report say, NOT ESTABLISHED; they predate this row.
- Gate names and order: inferred from `package.json` and the report, as rows 172 and 71 inferred them.

## Token total

About 240,000 by the session's budget counter at the time of writing (the clone, two worktrees, the full web suite twice, and the failing-first run are the bulk); over the 200,000 line the brief set, by the gates rather than the reading.
