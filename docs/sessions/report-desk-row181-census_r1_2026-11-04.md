# Report: tree census for row 181, joining POEM to LYRICS on a scan (desk helper, Sonnet, r1, 2026-11-04)

Read-only census on `Shane` at `0c3977f9` and `origin/cloud-lane-31` at `a0772f8f`. Cost: 162,622 tokens against 100k stated (over by 63k; owned by the desk). Every line below was read by the helper in its run; the desk has not re-read them. Under the ALPHA RULE each line is re-read before it goes into the brief.

## Findings that shape the brief

1. No band picture, band position, or ink measure is kept after reading: a kept reading is `{musicXml, stamp}` only (`apps/web/src/lib/omr/stamp.ts:52-56`; `omr/unread-bars.ts:13`). Band geometry is in page pixels with the page size known (`omr/underlay-band.ts:45-55`, `:94`); staff space is page pixels; homr's staff boxes are page fractions until `staffIn` (`omr/metre-windows.ts:36-42`, `:199-206`).
2. `underExtender` is declared and read (`omr/underlay-seat.ts:93`, `:108-110`) and set nowhere in source; the scan path builds `NotePlace` without it at `omr/underlay-prepare.ts:180`. Underscore-only tokens are kind `extender` (`underlay-seat.ts:142-153`); their effect beyond marking a syllable `sustained` is NOT ESTABLISHED.
3. A band with no ink and a band with unreadable ink both report `'no Russian row'` (`omr/underlay-page.ts:281-285`). Ink is measured per line inside `cutRows` only (`omr/underlay-rows.ts`, `INK_BELOW_PAPER` 60, `LINE_SHARE` 0.02), with no band-level flag.
4. Ties on the scan path: `underlay-prepare.ts:134`. Slur stack pairing: `:86-110`; the per-system count gate: `underlay-page.ts:249-257`. `syllableTargetIds`: `score/pairings.ts:297-307`.
5. One-vowel checks: `assertVowelPerNote` (`omr/assert-vowel-per-note.ts:56-65`, one caller `underlay-page.ts:240`); `vowelsPerNote` with `no-syllable`, `many-vowels`, `no-vowel` (`omr/vowels-per-note.ts:73-95`, counted at `underlay-page.ts:292`, never repaired); `oneToANote` (`omr/underlay-words.ts:61-72`).
6. Poem side: the library match is Smith-Waterman on folded letters returning only a span and score, no letter-to-letter map (`cloud-lane-31:apps/web/src/lib/text/poem-match.ts:104-173`); `PoemMatch` carries coverage, not `queryStart`/`queryEnd` (`:310-314`). On `Shane`, `comparePoem` aligns words (LCS, folded with `modernisePreReform` and old endings) and returns word pairs (`text/poem-compare.ts:162-168`). No syllable-level or note-level poem alignment exists; no writer of poem words into Lyrics found in the files read (repo-wide absence NOT ESTABLISHED).
7. Word test: `Seams.isWord` = known or known after `modernisePreReform` (`lib/underlay-seams.ts:15-21`, `:81`); `isKnownWord` = `GraysonEngine.lookupStress(word) !== null` (`pipeline.ts:225-227`). No confusion-pair or Latin look-alike list found in the omr files.
8. Ceilings: no `underlay-*` or `text/*` file has its own ceiling (1000-line default, `scripts/ratchets.json:3`); `pipeline.ts` at 925 of 925; `pairings.ts` 1420 of 1422.

## Corrections to earlier desk citations

- `text/poem-offer.svelte.ts:26-27` is on `cloud-lane-31` (`:27`), not `Shane`.
- The scan path's `NotePlace` is built at `underlay-prepare.ts:180`, not `:40-53`; ties at `:134`, not `:70`.

## Not established

`sewWords` beyond `:80`; `omr/underlay-recognize.ts` and the worker; exact lines inside `underlay-rows.ts`; where IndexedDB stores the kept reading; `poem-offer.svelte.ts` `:80-244`; `pre-reform-normalizer.ts`.
