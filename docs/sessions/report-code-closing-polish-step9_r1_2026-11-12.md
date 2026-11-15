# Report: closing polish lane, step 9, dead strings (Code, cloud-lane-48, r1, 2026-11-12)

## The count, before removing

Row 155 / L57 said 24 `upload.*` keys were unread. By a search that skips comments, over every `.ts`, `.svelte`, and `.js` file under `apps/web/src` except `i18n.ts`, tests, and the vendored `webmscore.js`, **28 of the 78 `upload.*` keys have no reader**; no key is built from a prefix (no `` `upload.${...}` `` or `'upload.' +`). A second search over `apps`, `packages`, `scripts`, `tests`, and the e2e folders finds each of the 28 only in `i18n.ts`. So the count is 28, not 24; four more than the queue's number. The five keys the comments call UNUSED (`i18n.ts:830-831`, `ScoreUploader.svelte:145-147`: `upload.drop.title`, `.browse`, `.release`, `.acceptedNow`, `.placeholder`) are among the 28. I did not establish where the queue's 24 came from.

## What was removed (each key with its English)

| key | English |
|---|---|
| `upload.drop.placeholder` | Drop a score here or click to browse. Accepted now: MNX, MusicXML, .mxl, Finale (.musx), MuseScore (.mscz), PDF, or photograph. |
| `upload.drop.title` | Drop a score here |
| `upload.drop.browse` | or click to browse |
| `upload.drop.acceptedNow` | MNX, MusicXML, .mxl, Finale (.musx), MuseScore (.mscz), PDF, or photograph |
| `upload.drop.release` | Release to add your score |
| `upload.scanTooltip` | Read a score from a photograph |
| `upload.continue` | Continue to analysis |
| `upload.ask.title` | Two things Ilya cannot see |
| `upload.ask.why` | Ilya reads the notes off the picture, but not the clef or the key signature. Read those off your own paper. |
| `upload.ask.key` | Key signature |
| `upload.ask.keyNone` | No sharps or flats |
| `upload.ask.keySharp` | 1 sharp |
| `upload.ask.keySharps` | %s sharps |
| `upload.ask.keyFlat` | 1 flat |
| `upload.ask.keyFlats` | %s flats |
| `upload.ask.read` | Read this page |
| `upload.confirm.title` | Two things Ilya read from the page |
| `upload.confirm.why` | Ilya read the clef and the key signature off the picture. Check them against your own paper, and change them if it read wrong. |
| `upload.report.title` | What Ilya read |
| `upload.report.systems` | %s systems, %s staves |
| `upload.report.spacing` | Staff spacing: %s px |
| `upload.report.events` | %s notes, %s rests, %s measures |
| `upload.report.seconds` | Read in %s s |
| `upload.report.pitchSubs` | Pitch assumed on %s notes (measures %s). |
| `upload.report.durationSubs` | Length assumed on %s notes (measures %s). |
| `upload.report.pageFailed` | Ilya could not read page %s. |
| `upload.report.staffFallback` | Ilya could not tell which staff carries the voice in %s systems, and read the top one. |
| `upload.err.pageReadFailed` | Ilya could not read this page. Reading photographs is new and does not yet work on every page. If you have the score as a MusicXML, MNX, or Finale file, Ilya reads those directly. |

Each key's directly attached comment lines went with it (the "UNUSED SINCE N.108" lines and the long ruling notes above `upload.drop.*`, which record Dann's 2026-08-20, 2026-08-21, and 2026-09-03 words for those strings, e.g. «ou» confirmed 2026-08-20 and "marked unused in place, not deleted" 2026-09-03). **That 2026-09-03 ruling is older than Dann's 2026-11-09 23:23 ruling that L57 joins the share, and the brief makes the removal a DESK DEFAULT; I followed the brief and say so here so the desk can reverse it from the history.** The French of each removed string is in git history (`dc078b9`). Comments elsewhere that cited a removed key by name now say "removed" (`i18n.ts` near `:192`, `:432`, `:446-449`, `:652-654`, `:826-828`, `:1219`).

## Also removed

- `station.startOver` and `loupe.undo.startOver` (no code reads either; `loupe.undo.startOver` was read only by the fixture below), with the comment above the second and the fixture line in `i18n.test.ts` (`:61`; the comma on the line above it went too). The comment at `:1203` that names `station.startOver` now says it was removed.
- `restoreFrom`'s `page` parameter (`routes/+page.svelte:3240`): no line of the function reads it; removed from the function and from both calls (`:3118`, `:3252`), and its comment at `:3232-3236` rewritten. `+page.svelte` is 5509 lines.
- `ScoreUploader.svelte:145-147`: the comment saying the `upload.drop.*` strings stay unused now says they were removed; the file is 865 lines (867 at entry).

## `insights.fit.*`

One comment above `insights.fit.heading` says why the keys keep the old name: INSIGHTS was shown as Fit until 2026-09; N.174 (2026-09-27) renamed the code and the screen but no string key; these keys are cited by name in `lib/insights/singer-blocks.ts` and in tests, and a key's name is not shown to a singer. The index's sentence "No comment says why these keys kept the name" is updated. The reason is from AGENTS.md and the grep of the tree, not from a ruling.

## Key index and gates

`i18n.ts` index: total 1,223 to 1,193; `upload.` 78 to 50; `station.` 2 to 1; `loupe.` 122 to 121 (`i18n-index.test.ts` holds the counts). Web unit suite: 285 files, 5278 passed, 1 skipped. Ratchets OK.

## What I could not establish

- Where the queue's 24 came from (above).
- That no French or English string is built from a removed key's text elsewhere (a copy of a sentence, not a key): not searched.
