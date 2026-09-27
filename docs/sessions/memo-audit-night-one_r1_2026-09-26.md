# The architecture audit, night one: what landed and what it found

**Written by the desk, 2026-09-26, after an unattended run that began at 00:36.**
Plan: `audit-plan_r1_2026-09-26.md`. Rulings: `../memory/CONTRACT.md` §5, amended
2026-09-26 00:25 and 00:31.

## What landed

Six commits on branch `audit`, on top of `b7c2fc6`. Pushing from the cloud is
refused until the Claude GitHub App has the repository, so the branch arrived as a
bundle: `Claude outputs/ilya-audit-2026-09-26.bundle` (rebuilt 2026-09-26 morning
with nine commits, md5 `e383fc81b4d9423f5ea148c1d9d8300a`, checked on the Mac). No application code
changed. Every commit touches tests, CI, scripts, or documents.

| commit | what |
|---|---|
| `60f1517` | The one failing unit test, corrected (the test was wrong, not the code) |
| `58f0670` | The desktop end-to-end suite revived (21 tests), and 7 new singer-path tests |
| `f9493d3` | `scripts/ratchets.mjs` and `pnpm ratchets`; CI type-error baseline 23 to 0; CI runs the e2e suite |
| `4cedd53` | Approval tests: 6 staff SVGs, both parsers, and a 40-line IPA corpus with the full dictionary |
| `3979f33` | Grayson's IPA inventory as a tested invariant, with a positive control |
| `1213fd1` | `ARCHITECTURE.md` draft r1; `README.md` and `AGENTS.md` point to it |

**All gates green on the final commit, run in the cloud clone:** packages 1,206
passed (5 skipped); `apps/web` 1,472 passed of 1,472; root integration 55 passed;
svelte-check 0 errors, 12 warnings; build passes; ratchets OK; Playwright desktop
28 passed of 28 (four separate runs, no flakes).

**Gate baselines will move when this merges.** web-test goes from 1,466 passing to
1,472 passing; score-parser gains 12 tests. `ilya-ship.sh` is in `~/Downloads`,
which this session could not open, so its numbers are not moved.

## What the audit found

1. **The desktop end-to-end suite had tested nothing since 2026-09-07.** All 21
   tests waited for `.status-ok`, a class `5f6a2f3` (N.108-5) removed, and nothing
   ran the suite, so nobody saw. It also ran the phone layout by accident:
   Playwright's default 1,280 px is under the desk's 1,400 px breakpoint. Fixed,
   and CI now runs it on every push.
2. **One unit test had failed since the day it was written** (`7841fe7`,
   2026-09-13; bisected). The watch list fires within one semitone of either
   passaggio edge, inclusive (`watchlist.ts`, `PASSAGGIO_EDGE_WINDOW_CENTS = 100`,
   SOURCED §A.126). The fixture's E♭4 is one semitone above its D4 secondo, so it
   fires; the test expected it not to. The expectation now matches the rule.
3. **CI allowed 23 type errors while the tree had 0.** Twenty-three new errors
   could have landed unseen. The allowance is now 0.
4. **`+page.svelte` grew from 2,095 lines (74,413 bytes) to 6,225 lines
   (271,459 bytes)** after the save design of 2026-08-16 said it "must shrink or
   hold, never grow" (`e52-fable-save-design_r1_2026-08-16.md:227`; the 2,095 is
   `e52-fable-save-socket_r1_2026-08-16.md:9`). Nothing enforced it. The
   ratchet now does, for it and fifteen other large files.
5. **`README.md` listed three of the four packages**, and `PRODUCT.md:459` still
   gives `+page.svelte` as 1,948 lines.
6. **Two circular imports:** `library/driver.ts` with `library/library.ts`, and
   `score-parser` `phonation.ts` with `tempo-seam.ts`. Neither is a bug today.
7. **The phone e2e project has one failing test** (`e2e-phone/loupe-scan.test.ts`,
   rule 1 and 5a readings in measures 10 and 17). It predates the audit and is not
   in CI yet.
8. **`AGENTS.md` says the tab is "Fit", invariant.** The app shows Markup
   (« Annotation », N.132). And its write protocol ("no agent commits") predates
   your option-3 ruling. Both are yours; the audit left them.
9. **Recorded as is, not judged:** the MusicXML parser warns that measure 16 of
   the Mussorgsky fixture holds 7/4 against an expected 3/2.

## What waits for you

- **Phase 4, the refactor**, is Code's by your ruling. The brief is
  `brief-code-audit-correction-station_r1_2026-09-26.md`. It starts only after the
  `audit` branch is merged, because it relies on the new tests.
- `ARCHITECTURE.md` is a draft for your reading.

## Words

Adopted, not coined: approval test and characterization test (Feathers and
others), hotspot (Tornhill), codemap (matklad), ratchet (Fable, 2026-08-03).
Coined by the desk: none.

## The agents' working papers

Copied into `audit-2026-09-26/` beside this memo: the hotspot table, the
`+page.svelte` anatomy, the e2e coverage map, the codemap draft, the document
inventory, the invariant candidates, the tool trials (dependency-cruiser cannot
read `.svelte` files; Knip can), and the two phase 1 memos. They are Sonnet's,
checked by the desk where this memo cites them, and leads everywhere else.

## Morning addendum, 2026-09-26: the painless second pass

Three more commits on `audit`, bringing it to nine:

| commit | what |
|---|---|
| CI | svelte-check warnings ratchet at 12; a newer push cancels an older run; Playwright's browsers cached |
| `vercel.json` | a one-year immutable cache for `/_app/immutable/`, whose names carry content hashes. Measured on the live site: served with `max-age=0, must-revalidate` |
| `PRODUCT.md` | stops quoting `+page.svelte`'s size and points to its ratchet |

**Closed without work:** the dictionary is served Brotli-compressed
(`content-encoding: br` on all four files, measured on the live site). That check
had been owed since `e22-0.2-audit-returns_2026-08-03.md` §4.1.

**Looked at and left:**

- The dictionary files keep `max-age=0`. Their shared hash is not established to
  cover the gloss files, so a long cache could serve stale glosses.
- The page's main script chunk is 244 KB compressed and is the app's own code,
  not a library that could load later. Learn and Guide already load on demand.
- The two circular imports and the six `$effect` blocks that write state are code
  changes, for Code, after the Correction Station.


## Morning addendum 2: Fable's newcomer review

Fable read the tree as a newcomer at `cdd05b4` and reported
(`audit-2026-09-26/fable-newcomer-review.md`). The desk checked its five sharpest
claims against the tree; all five held. One more commit, `8220261`, acts on the
documentation and guardrail findings: ARCHITECTURE.md corrected in five places,
a root `pnpm test:e2e`, CONTRIBUTING's four packages, CI on every branch, and a
test that every literal string key exists in both languages. Ten commits in all;
bundle md5 `59f6f5e3c2ae2d4d686f68380ff4cc3a`.

Left for Dann: the 209 French explanation templates, the tracked `apps/web/.env`
that turns Fit on, and whether the stored `shane` id is renamed.
