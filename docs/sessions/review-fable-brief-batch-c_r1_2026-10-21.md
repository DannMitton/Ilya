# Fable review: brief for Code, batch C, r1 (2026-10-21)

Brief reviewed: `docs/sessions/brief-code-batch-c_r1_2026-10-21.md`, md5 `473a9be1c43bfc09534aeef30a0a3b11` (checked on the Mac 2026-10-21). Every `path:line` below was read by Fable this session; nothing was run. "NOT ESTABLISHED beats a complete invented answer."

## Verdict: SEND WITH AMENDMENTS

Three amendments change what Code would build (1, 2, 3). The rest correct a cite, close a test that cannot fail, or hand Dann a decision the brief leaves to Code. B1 is close to sendable as is once amendment 4 lands; B2 needs amendments 5 to 8; B3 needs 1 to 3 and 9 to 13.

## Amendments, ranked

### 1. B3 names a dead boundary site and misses the live one

Evidence. The brief's site 1 is `packages/phonology/src/engine.ts:1999-2023`, `autoDetectBoundaries`. That method is defined at `engine.ts:1998` and has no caller in `apps/`, `packages/`, or `tests/` (grep for `autoDetectBoundaries` this session: the only hits are the definition, `apps/web/src/lib/boundaries.ts:40`, and `pipeline.ts:46` and `:328`, which import and call the `boundaries.ts` one). The live punctuation test is `apps/web/src/lib/boundaries.ts:37` (`PUNCTUATION_AT_END = /[.,!?;:"""''–—«»]$/`), used at `:50`, stamped `'punctuation'` at `:65-67`. The engine then honours the boundary at `engine.ts:2171` (`if (leftWord.rightBoundary === 'hard') continue;`) and at `:2249` (final devoicing unless `'clitic'`).

Cost if not amended. Code adds # to the engine's regex, every voicing test passes only if Code also finds `boundaries.ts` on its own, and the OPEN.md ruling's cite (`engine.ts:1999`, `:2007`) stays wrong in the record.

Replace site 1 with:

> 1. `apps/web/src/lib/boundaries.ts:37` (`PUNCTUATION_AT_END`), `:50` (its use), `:65-67` (the `'punctuation'` stamp): the LIVE boundary test, called from `pipeline.ts:328`. The engine's own `autoDetectBoundaries` (`packages/phonology/src/engine.ts:1998-2035`) has no caller in the tree; leave it alone or mirror the change, and say which. The boundary is honoured at `engine.ts:2171` and `:2249`.

Desk: correct the cite in `OPEN.md`, "THE # FOR A SYNTACTIC BREAK", when filing.

### 2. B3 does not say that a # already enters Lyrics from scores today, and that the Markup already draws one

Evidence. `packages/score-parser/src/diction-marks.ts:67` (`PHONATION_BREAK_MARK = '#'`) and `:141-200`: a score whose lyric is a bare `#` has the mark folded onto the preceding syllable's text («я#»), at ingest, for every arrival (`apps/web/src/lib/score/ingestion/ingest.ts:323`, `:341-346`). `collectScoreWords` joins the syllables into the raw word «я#» (`apps/web/src/lib/score/vowel-resolver.ts:235`) and `scoreWordsText` (`:324-326`) is what fills the Lyrics box and what `processText` reads (`vowel-resolver.ts:475`, `clitic-seat.ts:489`). Test witness: `apps/web/src/lib/analysis/diction-fold-live.test.ts:111-113` expects `['я#', 'на', 'прав', 'ду']`. The fixture behind an approval gate carries two such marks: `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` has two `<text>#</text>` lyrics (counted this session), and `staff-renderer-real-fixture.approval.test.ts:7` reads it.

So today a «я#» word reaches `pipeline.ts` with `cleanWord` «я#» (`PUNCTUATION_REGEX`, `:52`, has no #), the dictionary misses it, and the engine deletes the unknown glyph silently (the pipeline's own account, `pipeline.ts:508-511`). B3 will change those scores' IPA and boundaries. That is the ruling working, but Code must expect it.

Also: the Markup already has a `[#]` drawing path on the IPA line, "at the junction of the two notes" (`packages/score-parser/src/staff-renderer.ts:2448-2453`, `:3311-3314`, Dann's ruling of 2026-07-12), driven by `phonationBreak` on an analysed event, and nothing in `apps/` or `packages/` sets that flag outside `demo-fixture.ts:163` (grep this session). The Guide already explains it in both languages (`apps/web/src/lib/components/Reading/GuideContent.svelte:380` EN, `:84` FR: "written [#] on the IPA line, at the junction of the two notes it separates"). The new ruling says the # is grafted after its parent syllable. Two conventions for one mark; which the Markup draws is Dann's, not Code's.

Add to B3, after "Sites that compute a word boundary":

> **The # is already in the tree, from scores.** `packages/score-parser/src/diction-marks.ts:67`, `:141-200` folds a score's bare `#` lyric onto the preceding syllable («я#») at ingest (`ingestion/ingest.ts:341-346`); `vowel-resolver.ts:235` and `:324-326` carry it into the Lyrics text, so `processText` already receives «я#» today. Treat a trailing # on a token and a # between spaces as the same mark. `sunless-01-engraved.musicxml` carries two; if `staff-renderer-real-fixture.approval.test.ts` moves, stop and report the diff, do not re-approve.
>
> **Markup's existing `[#]` path.** `staff-renderer.ts:3126` and `:3311-3314` draw `[#]` on the IPA line between two notes when `phonationBreak` is set; nothing sets it today. Do not wire the typed # to it. Report where the grafted # lands on the Markup IPA line and leave the choice (graft, `[#]` at the junction, or both) to Dann.

Owed to Dann (the brief's "Not in this batch" is wrong that no Guide line exists): the Guide paragraph at `GuideContent.svelte:380` and `:84` describes `[#]` at the junction and will contradict the graft. A rewrite is his, French included.

### 3. B3's `sameWords` site walls the singer in, and the brief lists it as "NOT ESTABLISHED: whether affected"

Evidence. `apps/web/src/lib/text/same-words.ts:21-27`: `sameWords` folds syllable hyphens between letters and whitespace, nothing else. Its header (`:4-10`) says four sites in `+page.svelte` use it to decide whether Lyrics still holds the score's words: the `from score` tag, the score's own seat on a placing press, the waiting seat, and the first seat after a transcription; `text/relining.ts:11` makes it rule 1 of relining. A singer who types one # into a Lyrics that arrived from a score therefore loses the score's own seating path and the tag, with no message. That is the wall for B3.

Replace the brief's item 7 clause for `same-words.ts` with:

> `apps/web/src/lib/text/same-words.ts:26`: fold a # as a syllable hyphen is folded (DESK DEFAULT), so a typed # does not clear the `from score` tag or turn off the score's own seat (`same-words.ts:4-10`, `relining.ts:11`). Test: `sameWords('я# на правду', 'я на правду')` is true, and false before the change.

### 4. B1 sends cloud Code to a file on Dann's Mac, and misses the test the entry will break

Evidence. The brief's "Settle it by running song 2's line: the file is `~/Downloads/_colleague-pages/.../song2.musicxml`". Code runs in a cloud lane; that path is on the Mac and is not in the tree (checked: not under the mounted repository). It is also unnecessary. `apps/web/src/lib/components/Paper/provenance-icon.test.ts:35` already runs «Ну-те ж все разом» through `processText` with the real dictionary and supplement (`:15`, `:32`), and `:62-64` asserts `['Ну-те:dictionary:-', 'ж:inferred:enclitic', 'все:supplement:-', 'разом:dictionary:-']`. `Ну-те:dictionary` establishes the key: the dictionary has «нуте» (`data/dictionary.86d83340-a.json:121160`) and no «ну-те» (grep this session), so the hyphen was dropped at resolution (`typed-hyphens.ts:80-105`, `pipeline.ts:590`, `:676`) and the lookup key is «нуте», lowercased at `engine.ts:701`. Read, not run; Code confirms by running that test.

The same assertion will fail once the entry lands: «Ну-те» becomes `supplement`. The brief does not name it.

Replace the "Open for you" paragraph with:

> **The key is «нуте»**, by reading: `provenance-icon.test.ts:64` expects `Ну-те:dictionary:-` on the line, and the dictionary holds «нуте» (`dictionary.86d83340-a.json:121160`) and no «ну-те», so the hyphen is dropped before lookup (`typed-hyphens.ts:80-105`, `pipeline.ts:676`, `engine.ts:701`). Confirm by running `provenance-icon.test.ts`, which seats the line with the real data (`:15`, `:32`, `:35`); no file outside the tree is needed. **Expect `provenance-icon.test.ts:64` to fail after the entry** («Ну-те» becomes `supplement`); update that one expected string and say so.

Also in B1: `data/singer-supplement.json` is reached by the app through `apps/web/static/data`, a symlink to `../../../data` (`ENVIRONMENT.md:3128`; `md5` equal this session), so one edit serves both; say so to Code so it does not edit a "copy". The «ж» gloss in done-when 3 lives in the engine's clitic table, `engine.ts:281`, not the supplement; cite it so the test reads the right source.

### 5. B2 cites a ruling that does not exist

Evidence. `PRODUCT.md:533` is "The two sets of words. N.121" (read this session); no line of `PRODUCT.md` mentions the update notice, a toast, or a calibration take (grep this session). The constraint comes from Fable's memo (`memo-fable-update-channel-and-data_r1_2026-10-20.md:92`, a CONSIDER line with the same wrong cite). Nothing in `+page.svelte` names a recording state Code could read (grep for `isRecording`, `calibrationOpen`: none), so Code cannot build or test it as written.

Replace the bullet with:

> DESK DEFAULT, not a ruling (the `PRODUCT.md:533` cite was wrong): the notice does not rise while the Calibration wizard is open. If no state in `+page.svelte` says so plainly, do not build it; list it as owed and move on.

### 6. B2's "fetch the new shell first" probe is answered by the worker from cache, so the test proves the wrong thing

Evidence. `apps/web/static/sw.js:74-87`: every GET not excepted above it is answered `cached || networkFetch`. A `fetch('/')` from the page goes through that handler and succeeds offline with the cached shell, so "delete the caches only if that fetch succeeds" deletes them anyway. `version.json` is network-first with a cache fallback (`:63-66`), so it too "succeeds" offline when a cached copy exists. A unit test with a mocked `fetch` (done-when 2) cannot see this.

Replace the Refresh paragraph's last sentence with:

> Probe with a request the worker cannot answer from cache: `/_app/version.json` with a cache-busting query (`sw.js:63-66` matches on pathname and falls back to `caches.match(request)`, which misses on a new query). Delete the `ilya-` caches only when that probe returns `ok`; otherwise keep them and leave the notice up. State in the report that the unit test mocks `fetch` and does not prove the worker path; the browser check stays NOT ESTABLISHED.

### 7. B2 forbids the string the safer Refresh needs

Evidence. The brief: "No string a singer reads is added or changed in this batch." With amendment 6, a Refresh pressed offline leaves the notice up and does nothing visible. That is B2's wall: the button appears broken. The three strings today are `i18n.ts:926-928` (`update.notice`, `update.action`, `update.dismiss`).

Add to B2's done-when 3: "A fourth string is owed to Dann: what the notice says after a Refresh that could not reach the host. Desk draft EN for his ruling: 'Ilya could not reach the host. Try again when you are online.' French to Dann. Until ruled, the notice stays as it is."

### 8. B2 needs a new module, and the brief does not say where

Evidence. `scripts/ratchets.json` (the ratchet table; the brief says "read the ratchet table" with no path): `+page.svelte` ceiling 5607, file 5606 lines; `pipeline.ts` ceiling 1022, file 1022; `engine.ts` ceiling 2291, file 2291 (wc this session). B2's mount, foreground, online, and Refresh logic cannot fit in `+page.svelte`.

Add to B2: "The ratchet table is `scripts/ratchets.json`; `+page.svelte` has one line of headroom. Put the check scheduling and the Refresh path in a new module, `apps/web/src/lib/update-check.ts` (DESK DEFAULT name), taking `check` and `fetch` as arguments so the unit tests inject them, and call it from `+page.svelte` in the lines the toast already occupies (`:4614-4637`). `updated.check` is exported at `node_modules/@sveltejs/kit/src/runtime/app/state/client.js:67`; the memo's `utils.js:268` and `:297` read as stated this session: with `pollInterval` 0 no timer is armed."

### 9. B3 done-when 3 passes on the unchanged tree

Evidence. A # between spaces survives the filter at `pipeline.ts:182-186` (the regex at `:52` has no #) and reaches `buildSlotQueue`, where a vowelless token is glued to the previous slot's Cyrillic and takes no slot of its own (`apps/web/src/lib/score/pairings.ts:213-226`; `:218` appends `w.cleanWord + w.punctuation`, `:222` joins it with a no-break space). A trailing # on a word is deleted by the engine (`pipeline.ts:508-511`), so the syllable count holds. Either way the note count is unchanged before the change, and the test cannot fail. What does change is the Russian under the notes: «#» printed, which the ruling forbids.

Replace done-when 3 with: "A line with a # seats the same number of notes as the line without it, AND no slot's `cyrillic` contains #, AND the last slot before the # carries the # in its `ipa` (`pairings.ts:218-222`, `:235-245`). The second and third assertions fail on the unchanged tree."

### 10. B3: do not carry the # in `punctuation`

Evidence. `TranscribedWord.punctuation` is printed in the Russian: under the notes at `pairings.ts:218` and `:240`, and read by the clitic guards at `pipeline.ts:778` and `:788`. `cyrillic` is "what was typed, hyphens back in" (`pipeline.ts:594-601`), so a # left in the raw token prints in Text's Cyrillic (`WordStack.svelte:156`).

Add to "Ruled, as the design": "Carry the mark as its own field on the word (DESK DEFAULT: `syntacticBreak: true`), never inside `punctuation` or `cyrillic`; strip it from the token at `pipeline.ts:182-186` and set the field on the word before it. `boundaries.ts:50` reads the field as it reads `PUNCTUATION_AT_END`."

### 11. B3 done-when 2 has a surface that cannot fail, and one that is unaddressed

Evidence. A # typed in Lyrics never reaches Poem (two fields, `IntakeViews.svelte:72-73`), so "Poem" cannot fail. A # typed in Poem is not ruled. `poem-compare.ts:83-88` already folds a letterless token as punctuation (`:161-167`), so «слово#» and a bare «#» match the poem's «слово» and colour nothing; `songs.ts:52` would show a # in a library title built from a Poem's first four words.

Replace "Poem" in done-when 2 with: "the Lyrics-to-Poem comparison colours nothing for the # (`poem-compare.ts:83-88`, `:161-167`; prove, do not change)". Add to NOT ESTABLISHED: "what a # typed in Poem does; desk default, it is ignored as punctuation there."

### 12. B3 done-when 4 needs the # on the right side of the enclitic

Evidence. `pipeline.ts:788-793`: an enclitic cannot attach if the word before it ends in punctuation. A # between a host and its enclitic is a contradiction (a break inside a clitic group); the test as written would either pass vacuously or assert the wrong thing.

Replace with: "«X же # Y»: «же» stays an enclitic of X (`pipeline.ts:789-793`), X's boundary is `'clitic'`, and the hard boundary sits after «же», so Y's initial consonant does not voice X's or «же»'s final. «X # же Y» is a singer's error; report what Ilya does with it, do not design for it."

### 13. Small cites

- B3 item 7: `score-seat.ts:85` is `rekeySeatsToLines` (`:86`); `seatScoreWords` is `:107`. The pairing site is `pairings.ts:203-250`, `buildSlotQueue`.
- B2: `sw.js:54` is the dictionary guard; the version probe is `:63-66`, the manifest `:69-72`, stale-while-revalidate `:74-87`.
- B2: the toast is `+page.svelte:4614-4637`; cache deletion `:4625-4628`; reload `:4632`.
- B3 "Ruled, as the design": "It always ends the word before it" is a DESK DEFAULT in `OPEN.md:3228`, not Dann's; mark it so (tether 19).
- Rule 0: the ratchet table is `scripts/ratchets.json`, not `ENVIRONMENT.md`.

## Checks that passed

- B1 entry text matches the ruling (`INBOX.md`, 2026-10-20 23:22 and 23:40) and the file's shape (`data/singer-supplement.json`: a flat object of 316 keys; «же» and «чём» have the same four fields; «нуте» and «ну-те» absent, checked with python this session). Valid JSON as a fragment.
- `engine.ts:738-741` (supplement before dictionary), `:701` (lowercase), `old-spelling.ts:30`, `pipeline.ts:52-53`, `:182`, `:590`, `:621-622`, `:676`, `:778-793`, `engine.ts:794-818`, `:112-113`, `svelte.config.js:20`, kit `utils.js:268`, `:297`: as the brief says.
- The brief's account of how a # token flows through `pipeline.ts` (own token after the whitespace split, not stripped by either regex, no `prevHasPunct`) is right. What it did not say is where the token then goes (amendment 9) and which boundary code is live (amendment 1).
- No hand-written IPA in any done-when.
- CONTRACT §4's "every other site" line is present for B2 and B3 and absent for B1, which changes no computation. The misses are amendments 1, 2, and 3.
- OPEN.md's ruling and the brief agree in substance; both carry the stale `engine.ts:1999` cite.

## Where it walls a singer in

- B1: a singer whose text has «нуте» as the plant reads "come now (urging)"; the brief names it. No other case found.
- B2: Refresh pressed offline does nothing visible and says nothing (amendment 7).
- B3: one typed # in a Lyrics that came from a score silently turns off the score's own seat and the `from score` tag (amendment 3). Second: the Guide tells the singer to look for `[#]` at a junction and the IPA shows a grafted # (amendment 2).

## Could not establish

- Whether `provenance-icon.test.ts` passes at baseline (read, not run).
- Whether `staff-renderer-real-fixture.approval.test.ts` runs the fixture through the fold and `processText` (its header `:22-30` says the IPA is not resolved that way; the approved SVG has no # glyph, grep this session), so whether B3 moves it.
- The eight gate baselines and current file lengths at Code's start (the brief leaves them NOT ESTABLISHED; right).
- What the engine emits today for a bare «#» token reaching `transcribe` (not run).
- Whether `kit.version.name` is set (not in `svelte.config.js:10-25`).
- Whether a cache-busted `version.json` request offline rejects in every browser, or resolves with an opaque response; Code reports.
