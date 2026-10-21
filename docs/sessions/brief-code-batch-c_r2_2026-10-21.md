# Brief for Code: batch C, r2, 2026-10-21 (QUEUE rows 139 and 151, and the «ну-те» entry)

For Code in a cloud session, Sonnet, on a new lane cut from `Shane` by Dann. Fable reviewed r1 (`docs/sessions/review-fable-brief-batch-c_r1_2026-10-21.md`, md5 `29e894f958450d0d37201077bd09ad98`, verdict SEND WITH AMENDMENTS, 13 amendments) and this r2 applies all 13 (`CONTRACT.md` section 1, item 19). The desk marks each amendment below as it lands. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code below carries a `path:line` the desk read on 2026-10-21, or says NOT ESTABLISHED. Do not write with git beyond one commit per row on the lane; no pull request; no branch other than the lane.

## 0. Rules for the whole batch

- Work the rows in this order, one commit each, and report after each: B1 the «ну-те» entry, B2 the update check (row 151), B3 the # (row 139).
- At the start, read the ship script's gate lines and report the eight baselines. Do not trust a number in this brief: the desk's last figures were web-test 2943, score-parser 775 and 5 skipped (780) at `b488bef9`, and NOT ESTABLISHED since.
- The ratchet table is `scripts/ratchets.json` (Fable read it 2026-10-21: `+page.svelte` ceiling 5607 with the file at 5606 lines, so one line of headroom; `pipeline.ts` ceiling 1022 with the file at 1022; `engine.ts` ceiling 2291 with the file at 2291). Read it first. Where a change would cross a ceiling, move code out first into a new module; do not raise a ceiling.
- No IPA is written by hand. Every expected IPA below is an output of Ilya's engine, compared with another output of the same engine.
- No string a singer reads is added or changed in this batch. A string you find you need is listed in your report as owed to Dann; do not invent it. One is already known: see B2 done-when 3.
- Return memo format at the end (section 5). Every row's report has a section "What I could not establish".

## B1. The «ну-те» entry in the singer supplement

**Goal.** Song 2 («Весёлый час», Mussorgsky) reads «Ну-те ж все разом» in Text. Today the gloss under «Ну-те» reads "chickpea, garbanzo", because the hyphenated word is joined and looked up as «нуте», a form of «нут» (`data/dictionary.86d83340-a.json:121160`, read by the desk on 2026-10-20, cause read not run). Dann ruled the gloss a modal equivalent in English and in French (2026-10-20 23:22, 23:23) and ratified the French (23:39).

**The entry, ratified, final as drafted:**

`"нуте": {"stress": 0, "gloss": {"en": "come now (urging)", "fr": "allons (exhortation)"}, "source": "supplement"}`

for `data/singer-supplement.json`, a flat object keyed by word (the desk read it 2026-10-21: «же» and «чём» are entries of this shape; «нуте» and «ну-те» are absent).

**What the engine does.** The supplement is checked before the dictionary: `SINGER_SUPPLEMENT[cleanWord]` returns the entry first (`packages/phonology/src/engine.ts:738-741`). So the entry shadows the real word «нуте» (chickpea) everywhere. The desk named that cost when it drafted the entry (`docs/memory/INBOX.md`, 2026-10-20 23:22) and it is not ruled out; if a score in the tree or a gate reads «нуте» as the plant and changes because of the entry, report which, and do not decide it.

**The key is «нуте», by reading (Fable, 2026-10-21; read, not run).** `apps/web/src/lib/components/Paper/provenance-icon.test.ts:64` expects `Ну-те:dictionary:-` on the line, and the dictionary holds «нуте» (`data/dictionary.86d83340-a.json:121160`) and no «ну-те», so the hyphen is dropped before lookup (`apps/web/src/lib/typed-hyphens.ts:80-105`, `pipeline.ts:676`, `engine.ts:701` lowercases). Confirm by running `provenance-icon.test.ts`, which seats the line with the real data (`:15`, `:32`, `:35`). No file outside the tree is needed: do not look for one. **Expect `provenance-icon.test.ts:64` to fail after the entry** («Ну-те» becomes `supplement`); update that one expected string and say so in your report.

`data/singer-supplement.json` reaches the app through `apps/web/static/data`, a symlink to `../../../data` (`docs/memory/ENVIRONMENT.md:3128`), so one edit serves both. Do not edit a copy.

**Done when.**
1. A test seats «Ну-те ж все разом» and asserts the gloss reads "come now (urging)" in English and "allons (exhortation)" in French, and fails on the tree before the entry.
2. The approval corpus (`apps/web/src/lib/approval/ipa-corpus.approval.test.ts`) and every other gate are at baseline. If adding the entry moves an approved IPA, stop and report which line moved.
3. «ж» keeps its own gloss "(emphasis)" and "(emphase)". That gloss lives in the engine's clitic table, `packages/phonology/src/engine.ts:281`, and not in the supplement; the test reads it from there.

## B2. The update check (QUEUE row 151)

**Goal.** Ilya polls the host for a new build every 60 seconds. Dann (2026-10-20 22:25): *"Should Ilya poll the host for a new build every 60 seconds? That seems excessive. What about jsut one opening ILya? per session, I mean. It will cut down on pings. Evaluate?"* (transcribed as written). The desk's default, his to overrule:

- `pollInterval` goes from 60000 (`apps/web/svelte.config.js:20`, read 2026-10-21) to 0.
- App code calls `updated.check()` on mount, when the page returns to the foreground (at most once an hour), and on the `online` event. With `pollInterval` 0 the framework arms no timer, so a check on opening needs app code: Fable read `node_modules/@sveltejs/kit/src/runtime/client/utils.js:268` and `:297` on 2026-10-21 as stated: with `pollInterval` 0 no timer is armed. Verify them.
- DESK DEFAULT, not a ruling (r1 cited `PRODUCT.md:533`, which is "The two sets of words. N.121" and says nothing of the notice): the notice does not rise while the Calibration wizard is open. If no state in `+page.svelte` says so plainly (Fable grepped `isRecording` and `calibrationOpen`: none), do not build it; list it as owed and move on.
- The notice's Refresh button today deletes every cache whose name starts with `ilya-` and then reloads (`apps/web/src/routes/+page.svelte:4625-4633`, read 2026-10-21; the toast is `:4614-4637`, cache deletion `:4625-4628`, reload `:4632`). With no network that can leave nothing to serve. Change it: delete the caches only if a probe of the host succeeds; otherwise keep the caches and leave the notice up. Probe with a request the worker cannot answer from cache: `/_app/version.json` with a cache-busting query. The worker answers every other GET `cached || networkFetch` (`apps/web/static/sw.js:74-87`), so a plain `fetch('/')` succeeds offline from the cached shell and would delete the caches anyway; `version.json` is matched on pathname and falls back to `caches.match(request)` (`:63-66`), which misses on a new query. Delete the `ilya-` caches only when that probe returns `ok`. State in your report that the unit test mocks `fetch` and does not prove the worker path; the browser check stays NOT ESTABLISHED, as does whether a cache-busted request offline rejects in every browser or resolves opaque.

**Where the code goes.** `+page.svelte` has one line of headroom. Put the check scheduling and the Refresh path in a new module, `apps/web/src/lib/update-check.ts` (DESK DEFAULT name), taking `check` and `fetch` as arguments so the unit tests inject them, and call it from `+page.svelte` in the lines the toast already occupies. `updated.check` is exported at `node_modules/@sveltejs/kit/src/runtime/app/state/client.js:67`.

**Sites that decide when a check runs or what a reload does** (the brief names them as `CONTRACT.md` section 4 asks): `svelte.config.js:20`; the toast and its button at `+page.svelte:4614-4637`; the worker's fetch handler, `apps/web/static/sw.js`: the dictionary guard `:54`, the version probe `:63-66`, the manifest `:69-72`, stale-while-revalidate `:74-87` (Fable read these 2026-10-21). Search for every other caller of `updated` (`grep -rn "updated" apps/web/src --include=*.svelte --include=*.ts`) and list them in your report.

**May bend.** The once-an-hour limit and the three triggers may change if a measure shows a reason; say what you measured.

**Done when.**
1. A unit test shows `pollInterval` is 0 and a check is attempted on mount, on return to the foreground (and not twice in one hour), and on `online`.
2. A test shows the Refresh path keeps the caches when the probe fails.
3. A Refresh pressed offline now leaves the notice up and does nothing visible, which would make the button look broken. One string is owed to Dann: what the notice says after a Refresh that could not reach the host. Desk draft, EN, for his ruling: "Ilya could not reach the host. Try again when you are online." French is Dann's. Until he rules, the notice stays as it is; do not add the string.
4. NOT ESTABLISHED, report it and do not guess: whether an unsaved edit survives the reload; whether a first open with no network works.

## B3. The # for a syntactic break (QUEUE row 139)

**The need, in Dann's words (2026-10-19 23:59):** *"When a coahc tells a singer that there is no voicing, they can inseert an octothrope and Ilya's transcription IPA will adjust."* (transcribed as written). Background, 23:54: the octothorpe marks a syntactic break and blocks regressive assimilation of voicing; no non-native speaker can place one reliably, so the singer places it on a coach's or a native speaker's word. The full ruling is `docs/memory/OPEN.md`, "THE # FOR A SYNTACTIC BREAK", read by the desk 2026-10-21.

**Ruled, as the design:**
- A typed # takes no note of its own. It is seated with a neighbouring word, as a clitic is.
- It always ends the word before it (a DESK DEFAULT, `docs/memory/OPEN.md:3228`, not Dann's ruling). The engine stores a word's right boundary as `'hard' | 'soft' | 'clitic'` with a source `'user' | 'auto' | 'punctuation' | 'score'` (`packages/phonology/src/engine.ts:112-113`). The # sets a hard boundary, as punctuation does.
- Regressive voicing assimilation does not cross a hard boundary. Today the live punctuation test has no # (`apps/web/src/lib/boundaries.ts:37` the regex, `:50` its use, `:65-67` where a punctuation boundary is stamped `'punctuation'`; the engine honours the boundary at `engine.ts:2171` and `:2249`). r1 named `engine.ts:1999`, which is dead code; see site 1.
- It never prints in the Russian: not in Poem, not in Lyrics as drawn or printed, not under the notes, not in Text's Cyrillic.
- In the IPA it always appears as an enclitic, grafted after its parent syllable (Dann 2026-10-20 00:01: *"The IPA should always featuer the octothorpe as an enclitic grafter after its parent syllable."*, transcribed as written).
- Carry the mark as its own field on the word (DESK DEFAULT: `syntacticBreak: true`), never inside `punctuation` or `cyrillic`: `punctuation` prints under the notes (`apps/web/src/lib/score/pairings.ts:218`, `:240`) and is read by the clitic guards (`pipeline.ts:778`, `:788`), and `cyrillic` is what was typed (`pipeline.ts:594-601`; it prints in Text at `WordStack.svelte:156`). Strip the # from the token at `pipeline.ts:182-186` and set the field on the word before it. `boundaries.ts:50` reads the field as it reads `PUNCTUATION_AT_END`.
- DESK DEFAULTS, his to overrule: the Lyrics field shows a typed # while the singer edits, so it can be found and removed; Ilya never places a # itself.

**Sites that compute a word boundary or count the words of typed text.** This change alters how a word boundary is computed, so the brief names them. The desk read these on 2026-10-21; the first six are the ones to change or to prove unaffected:
1. `apps/web/src/lib/boundaries.ts:37` (`PUNCTUATION_AT_END`), `:50` (its use), `:65-67` (the `'punctuation'` stamp): the LIVE boundary test, called from `pipeline.ts:328`. The engine's own `autoDetectBoundaries` (`packages/phonology/src/engine.ts:1998-2035`) has no caller in the tree; leave it alone or mirror the change, and say which. The boundary is honoured at `engine.ts:2171` and `:2249`.
2. `apps/web/src/lib/pipeline.ts:52-53`, `PUNCTUATION_REGEX` and `TRAILING_PUNCT_REGEX`: neither contains #.
3. `pipeline.ts:182`: the typed line is split on whitespace; a # surrounded by spaces becomes its own token. Decide how a # joins its word before any token wants a note.
4. `pipeline.ts:590` (`toClean`), `:621-622` (the trailing punctuation match), `:676` (the lookup word): each strips punctuation by its own pattern.
5. `pipeline.ts:778-788`: an enclitic cannot attach leftward if punctuation separates it from the word before it (`prevHasPunct`), and a clitic test reads `wordData.punctuation`. A # must not change which words are clitics or enclitics.
6. `packages/phonology/src/engine.ts:794-818`: punctuation is stripped from the original and re-appended.
7. Sites that count or compare words and so can be thrown off by a stray token. `apps/web/src/lib/text/same-words.ts:26`: fold a # as a syllable hyphen is folded (DESK DEFAULT), so a typed # does not clear the `from score` tag or turn off the score's own seat (`same-words.ts:4-10`, `apps/web/src/lib/text/relining.ts:11`); Fable found that today one typed # in a Lyrics that came from a score does exactly that, silently. Test: `sameWords('я# на правду', 'я на правду')` is true, and false before the change. `apps/web/src/lib/library/songs.ts:52` would show a # in a library title built from a Poem's first four words; Poem is not ruled for #, so the DESK DEFAULT is that a # typed in Poem is ignored as punctuation. `apps/web/src/lib/score/score-seat.ts:86` (`rekeySeatsToLines`) and `:107` (`seatScoreWords`), and the pairing site `apps/web/src/lib/score/pairings.ts:203-250` (`buildSlotQueue`; a vowelless token is glued to the previous slot's Cyrillic at `:213-226`). NOT ESTABLISHED: whether each is affected. Search for every other place that splits typed text on whitespace or counts its words (`grep -rn "split(/" apps/web/src --include=*.ts --include=*.svelte`, then read each hit) and list them in your report with a verdict.

**The # is already in the tree, from scores.** `packages/score-parser/src/diction-marks.ts:67` (`PHONATION_BREAK_MARK = '#'`) and `:141-200` fold a score's bare `#` lyric onto the preceding syllable («я#») at ingest (`apps/web/src/lib/score/ingestion/ingest.ts:323`, `:341-346`); `apps/web/src/lib/score/vowel-resolver.ts:235` and `:324-326` carry it into the Lyrics text, so `processText` already receives «я#» today (witness: `apps/web/src/lib/analysis/diction-fold-live.test.ts:111-113` expects `['я#', 'на', 'прав', 'ду']`). Today the dictionary misses «я#» and the engine deletes the unknown glyph silently (`pipeline.ts:508-511`). Treat a trailing # on a token and a # between spaces as the same mark. B3 will change the IPA and boundaries of those scores; that is the ruling working, so expect it. `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` carries two such marks and is read by `staff-renderer-real-fixture.approval.test.ts:7`; if that approval moves, stop and report the diff, do not re-approve.

**Markup already has a `[#]` path.** `packages/score-parser/src/staff-renderer.ts:3126` and `:3311-3314` draw `[#]` on the IPA line at the junction of two notes when `phonationBreak` is set (Dann's ruling of 2026-07-12); nothing sets it outside `demo-fixture.ts:163`. **RULED by Dann 2026-10-21 00:26: *"We should only see octothorpes in the IPa line, not in the staff or the Cyrillic text."* (transcribed as written).** The # is grafted after its parent syllable on the IPA line and appears nowhere else: not in the Cyrillic, not in the staff drawing, not as a `[#]` mark at a junction between notes. Do not wire the typed # to `phonationBreak` or to the `[#]` path. DESK DEFAULT reading, his to wave off: "the staff" means the notation and the junction mark drawn between notes, and "the IPA line" includes the IPA line printed under the notes in Markup. Report where the grafted # lands there, and whether any of the existing `[#]` code now needs removing; do not remove it.

**What depended on these sites agreeing.** A word's boundary decides voicing assimilation across words (engine), which word a punctuation mark belongs to (pipeline), whether an enclitic attaches (pipeline), and how many tokens want a note (the seating code). If the # changes one and not the others, a note can be seated to a # or an enclitic can attach across it. Prove they agree with the tests below.

**Done when.**
1. **Voicing.** For three word pairs where the engine's own output voices a final consonant across the boundary (find them by running pairs with no mark and no punctuation), the IPA of `X # Y` equals the IPA of `X, Y` for X and Y, and differs from the IPA of `X Y`. The only extra symbol is the # in the IPA, grafted after X's last syllable.
2. **Never in the Russian.** A # typed in Lyrics appears in the Lyrics field while editing and in no drawn or printed Russian: Lyrics as drawn, the words under the notes, Text's Cyrillic, Markup, Insights; and the Lyrics-to-Poem comparison colours nothing for it (`apps/web/src/lib/text/poem-compare.ts:83-88`, `:161-167`; prove, do not change). One test per surface. (A # typed in Lyrics never reaches Poem, which is a separate field, `IntakeViews.svelte:72-73`, so a test of Poem would pass on the unchanged tree.)
3. **No note.** A line with a # seats the same number of notes as the line without it, AND no slot's `cyrillic` contains #, AND the last slot before the # carries the # in its `ipa` (`pairings.ts:218-222`, `:235-245`). The second and third assertions fail on the unchanged tree; the first alone cannot, because the note count is unchanged today.
4. **Enclitic.** «X же # Y»: «же» stays an enclitic of X (`pipeline.ts:789-793`), X's boundary is `'clitic'`, and the hard boundary sits after «же», so Y's initial consonant does not voice X's or «же»'s final. «X # же Y» is a singer's error: report what Ilya does with it, do not design for it.
5. **Gates.** All eight gates at baseline.

**May bend.** Where the # joins its word, and the IPA glyph's exact placement beside an existing enclitic graft, may change if a test shows a collision; say what you changed and why.

**Where would this wall a singer in?** Fable's question for every brief from this design. Answer it in your report: a case where a singer types a # and cannot get it out, or cannot tell why a word sounds different, or a # shows where the ruling says it must not.

**Not in this batch.** The Guide line in both languages that explains the # (the desk drafts it; French goes to Dann). r1 was wrong that no Guide text exists: `apps/web/src/lib/components/Reading/GuideContent.svelte:380` (EN) and `:84` (FR) already describe `[#]` "on the IPA line, at the junction of the two notes it separates", and will contradict the graft. Do not edit them; report it. Playing or auditioning the # is out of scope.

## 5. Return memo

One file per row, `docs/sessions/report-code-batch-c-<row>_r1_2026-10-21.md`, each with: what you changed (files and `path:line`); the tests added and which failed before; the eight gates before and after; a section "What I could not establish" (every NOT ESTABLISHED above, answered or still open); anything owed to Dann (a string, a ruling; known so far: the B2 offline-Refresh string and the Guide paragraph). Do not commit the brief, the reports, or any `docs/memory` file; the desk files them.

## 6. Cost and the order of the lane

State your token use per row in the report. If a row would cross a ceiling you cannot move code out of, stop and report rather than raise it.
