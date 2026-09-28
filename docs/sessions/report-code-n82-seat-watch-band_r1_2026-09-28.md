# Report from Code: N.82, the watch band in both languages

**2026-09-28.** Brief: `brief-code-n82-seat-watch-band_r1_2026-09-28.md`. Branch `Shane`, HEAD `7d2fcd6`. At the start the tree was dirty with calm-loupe slice 7, N.154's strings, the desk's `STATE.md`, and the desk's drafts and briefs. Before the first edit, a copy of every dirty file was saved, so the patch is measured against that tree and holds only this work. Nothing committed; no git command that writes was run.

**Status: WRITTEN.** Not DONE: DONE is Dann's look at the band in French.

## 1. What was built

- **Every band sentence is in `i18n.ts`**, in a new `watch.*` block (44 keys), English and French as ratified. The band renders through `t(key, language)`. `watchlist.ts` only chooses keys and fills them; `WATCH_HEADER` is gone.
- **The entry carries values, not English.**
  - `advice` is `{ action, target? }`. The action names `watch.advice.{action}`.
  - `transposition` is `{ semitones, keys? }`, the keys as `{ fifths, mode }`. It replaces `transpositionPhrase`.
- **The advice resolver names an action.** Each case carries `action` instead of an English `copy()`. `AnalyzedEvent.vowelModification` is now `{ action, target?, citation, register }` in `packages/score-parser/src/analysis-types.ts`.
- **The package passes numbers out.** New `keyAfterTransposition` in `transposition.ts` returns `{ fifths, mode }`, and each candidate carries it as `targetKeySignature`. The package's English `targetKey` and `intervalName` are unchanged, and nothing on the band reads them now. The package imports nothing from the app.
- **IPA in square brackets** on every line, both languages. The advice's literal `/o/` is now `[o]`.
- **Key names:** English `E flat major`; French in solfège, lowercase, `bémol` and `dièse` from `notePicker.acc.flat` and `.sharp`. French repeats « en » before a second key. The letter comes from the fifths: F C G D A E B, stepped `fifths + 1` places, 3 more for minor. The key's accidental comes from how many times that wraps.
- **The advice is an opener plus an action, then a period.** The five openers are `comment.opener.1` to `.5`. `watchBandLines` rotates them down the band so no two advice sentences share one. « de » elides as `comment-text.ts` does it.
- **`insights.finding.tighten`, `.turnover`, `.sustain`** now read « prolongé » and « pendant qu’il se prolonge ».
- **`MarkupPane.svelte`** renders `watchBandLines(watchList.entries, language)` and `T('watch.header')`. It stays at 1,490 lines, its ceiling.

## 2. Key names, where they differ from the draft

The draft's §3 names were one family per fragment. Where two would share a prefix, the names changed:

| Draft | Built |
|---|---|
| `watch.transpose.key.one` / `.two` | `watch.keyPhrase.one` / `.two` |
| `watch.transpose.interval.one` / `.shared` / `.mixed` | `watch.intervalPhrase.one` / `.shared` / `.mixed` |
| `watch.transpose.down` / `.up` | `watch.direction.down` / `.up` |
| `watch.transpose.interval.{n}` | `watch.interval.{1..6}` |

Also new: `watch.advice.{iCrossing, openOCrossing, oCover, openTracking, maleTurnover}`, `watch.key.name`, `watch.key.tonic`, `watch.key.letter.{C..B}`, `watch.key.mode.{major, minor}`, and the four timbre keys the draft named.

## 3. Defaults taken

- **DESK DEFAULT, the rotation's start.** The band starts at opener 1 and steps one opener per advice line, in band order. Insights starts from the song's seed. The band sits on one page, so the rotation runs the whole list. A sixth advice line repeats the first, since the pool holds five.
- **DESK DEFAULT, an unnamed interval.** The interval names cover 1 to 6 semitones, the window the band asks for. A move outside it would name the fact alone rather than an unruled interval. The window makes it unreachable today.
- **The opener check (brief §2.6).** Every English opener reads with every action: "You might try relaxing…", "Consider allowing…", "You can experiment with letting…", "One thing to explore is letting…", "Try relaxing…". A test runs all 25 pairs. Nothing to report.

## 4. Seen, not changed

- The band still quotes the raw word with its punctuation: « заветная, », « мгновения; ». The draft's §5 noted this; it is outside N.82.
- `i18n.ts:913` carries a raw character where the file uses escapes. It was in the tree before this work.

## 5. Gates

All eight pass on the tree with slice 7, N.154, and this work:

| Gate | Result | Script baseline |
|---|---|---|
| 1 phonology | 251 passed | 251 |
| 2 dictionary | 235 passed | 235 |
| 3 web-check | 0 errors, 12 warnings in 5 files | same |
| 4 web-test | 1640 passed (1640) | 1613 |
| 5 score-parser | 616 passed, 5 skipped (621) | 615 passed, 5 skipped (620) |
| 6 blurb | 145 passed | 145 |
| 7 integration | 55 passed | 55 |
| 8 ratchets | OK | OK |

**Gate 4 must move to 1640 and gate 5 to `616 passed | 5 skipped (621)` in `~/Downloads/ilya-ship.sh` before the ship.** This work adds 6 web tests and 1 score-parser test. Gate 4's other 21 come from slice 7 and N.154. That split is INFERENCE, from the arithmetic.

No approval file changed. `watchlist.test.ts` and `advice-resolver.test.ts` now expect the new English, brackets, and actions. That is the brief's intended change.

## 6. Seen on the dev server

At `http://localhost:5173`, with the test voice and `sunless-01-engraved.musicxml`, in Markup:

- English: the heading reads "Places to watch", and 19 range lines read "…you may want to transpose to F major or A flat major." The crossing line at bar 3 ends "You might try relaxing the jaw and leaning the vowel toward [ɪ], …".
- French: 60 lines and no English. The heading and its `aria-label` read « Points à surveiller ». « Mesure 7 : la note descend sous l’ambitus que vous avez indiqué; vous pouvez songer à transposer en fa majeur ou en la bémol majeur. »

This song gives only one advice line, so the rotation is proven by test, not on screen. Dann's look needs a song with two advice lines (brief §4).

## 7. The patch

`apps/web/test-results/_desk-n174/n82-seat-watch-band.patch`, with a copy in the session scratchpad. It applies after `calm-loupe-s7.patch` and `n154-seat-strings.patch`, on `7d2fcd6`. Checked with `git apply --check` on a `git archive` copy with those two applied first.
