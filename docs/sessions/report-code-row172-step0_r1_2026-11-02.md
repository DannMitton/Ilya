# Report: row 172, step 0, read and record (Code, r1, 2026-11-02)

Read on branch `cloud-lane-29`, cut from `origin/Shane` at `f9797acb`, working tree clean at the time of reading. Brief: r2 (6,781 characters; saved to `/tmp/briefs/`, not committed). Nothing in this step changes code.

## Baseline gates (before step 1)

The brief does not name the eight gates and `package.json` does not either. I ran the eight that the project's QUEUE counts match, and the mapping of numbers to gates 1 to 8 below is INFERRED from the scripts, not read from the ship script (`~/Downloads/ilya-ship.sh` is not in this checkout). NOT ESTABLISHED: the ship script's own order.

| # | Command | Result |
|---|---|---|
| 1 | `pnpm --filter @ilya/phonology test` | 407 passed (13 files) |
| 2 | `pnpm --filter @ilya/dictionary test` | 248 passed (4 files) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings |
| 4 | `pnpm --filter @ilya/web test` | 3843 passed, 1 skipped (3844) |
| 5 | `pnpm test:integration` | 98 passed (6 files) |
| 6 | `pnpm --filter @ilya/blurb test` | 148 passed |
| 7 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped (790) |
| 8 | `pnpm ratchets` | OK; offers 6 lower ceilings (see below) |

The Playwright projects (desk `chromium`, and the phone project) are run in step 2.

`pnpm ratchets` offers: `Drawer.svelte` 1990 to 1975, `LearnContent.svelte` 4099 to 4096, `Loupe.svelte` 3013 to 3011, `CalibrationWizard.svelte` 2124 to 2112, `+page.svelte` 5586 to 5585, `staff-renderer.ts` 3427 to 3426. These predate this row.

## Citations: which moved on this cut

| Brief cite | On this cut |
|---|---|
| `+page.svelte:97` import | `:97`, holds |
| `+page.svelte:4362` element | `:4360` (moved) |
| `+page.svelte:462-475` | `:455-475`, `shown` at `:462`, the `shown` effect at `:470-473`, holds |
| `+page.svelte` `:2235`, `:2277`, `:2299` | `:2233`, `:2275`, `:2297` (each moved 2) |
| `+page.svelte:2398` (`land`) | `:2396` (moved) |
| `+page.svelte:2831` (`land`) | `:2829` (moved) |
| `IntakeViews.svelte:229` (`onchoose`) | `:225` (moved) |
| `IntakeViews.svelte:67` (`songId`) | `:67`, a prop, holds |
| `input-views.svelte.ts:54-59` `open` | holds |
| `input-views.svelte.ts:68-70` `chooseWitness` | `:68-71`, call at `:69-70`, holds |
| `input-views.svelte.ts:85-87` `land` | `:85-87`, holds |
| `witness-lines.ts:116` | holds, body `:116-119` |
| `TextWitnessPair.svelte:52-56` print rule | `:52-56`, holds |
| `GuideContent.svelte:333`, `:38` | checked in step 4 |

## What TEXT shows today (`shownWitness`, `witness-lines.ts:116-119`)

`shownWitness(lyricsHas, poemHas, differ, choice)`: if Lyrics holds no text, Poem when Poem holds text, else Lyrics; otherwise Poem only when Poem holds text AND the two differ AND the choice is `'poem'`. The choice is `inputViews.witnessChoice[doc.id] ?? 'lyrics'` (`+page.svelte:462`). The pair is drawn when `witnessDiffer` (`+page.svelte:461`, `:4360`).

1. Both texts equal: Lyrics. No pair.
2. Both differ, no choice: Lyrics. Pair drawn, Lyrics active.
3. Both differ, after choosing Poem on the pair: Poem. Pair drawn, Poem active. (A choice made while they differed does not stick once they agree: `differ` goes false, Lyrics shows.)
4. Only Poem: Poem. No pair.
5. Only Lyrics: Lyrics. No pair.

Also: neither text: Lyrics, no pair.

## The two paths the ruling creates (recorded, neither changed)

(a) Poem pasted first (INPUT opens on Poem because Lyrics is empty, `initialView`, `input-views.svelte.ts:31-33`), then a score fills Lyrics (`+page.svelte:2829`, `inputViews.land('lyrics', poemBlank=false)`). `land` leaves the view on Poem (its guard needs `poemBlank`, `:87`). INPUT's active pill reads POEM, `witnessChoice` was never set, so TEXT reads Lyrics, and the source line will say "From LYRICS". Correct under safeguard 1.

(b) Lyrics holds text and the singer taps POEM to type a poem. After step 1 the tap calls `chooseWitness(songId, 'poem')`. `shownWitness` returns `'poem'` only once `poemHas` and `differ` are both true, so TEXT flips to the poem at the first typed word that makes the poem differ from Lyrics, and then transcribes key by key. Unchanged by this row.

## Readers of `witnessChoice` and `shown`

`witnessChoice`: read only at `+page.svelte:462` (and the `chooseWitness` write at `:4360` today; `input-views.test.ts:136-142` exercises it). No reader the brief does not name.

`shown`: `+page.svelte:463-469`, `:471`, `:475`, `:2233`, `:2275`, `:2297`, `:4360` (the pair's `witness`). The `shown` at `:1848` is a local variable, not the derived. No reader the brief does not name.

## References the brief does not name

1. `apps/web/src/lib/components/view-pair-fill.test.ts:29` reads `TextWitnessPair.svelte` from disk (`expect(src('TextWitnessPair.svelte')).not.toContain('activeFill')`). Deleting the file in step 2 makes that test throw. Step 2 removes that one assertion line; its sibling assertions (IntakeViews passes it, DeskHead does not) stay.
2. `apps/web/src/lib/i18n.ts:25`, the key index, lists `lib/components/TextWitnessPair.svelte` under `a11y.`. `i18n-index.test.ts` fails when a named path does not exist. Step 2 replaces it in the index with the file that still uses `a11y.` keys (`lib/components/Paper/Paper.svelte`).
3. Step 3 adds the prefix `text.` (two keys). `i18n-index.test.ts` requires a line for every prefix, the count, and the header total (`This file holds 1,119 keys.` becomes 1,121). Step 3 edits those lines.

## Open

Row 163's `ViewPair` change (`activeFill`, `ViewPair.svelte:27-54`, commit `dcb3685`) is an ancestor of this cut: it LANDED before the cut. Deleting `TextWitnessPair.svelte` is safe against it.

NOT ESTABLISHED: the ship script's gate order (see above); the print preview of the source line (step 3).
