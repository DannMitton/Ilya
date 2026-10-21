# Brief for Code: batch C, r1, 2026-10-21 (QUEUE rows 139 and 151, and the «ну-те» entry)

For Code in a cloud session, Sonnet, on a new lane cut from `Shane` by Dann. Fable reviews this brief before Code gets it (`CONTRACT.md` section 1, item 19). **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code below carries a `path:line` the desk read on 2026-10-21, or says NOT ESTABLISHED. Do not write with git beyond one commit per row on the lane; no pull request; no branch other than the lane.

## 0. Rules for the whole batch

- Work the rows in this order, one commit each, and report after each: B1 the «ну-те» entry, B2 the update check (row 151), B3 the # (row 139).
- At the start, read the ship script's gate lines and report the eight baselines. Do not trust a number in this brief: the desk's last figures were web-test 2943, score-parser 775 and 5 skipped (780) at `b488bef9`, and NOT ESTABLISHED since.
- `+page.svelte` and `pipeline.ts` sit near their line ratchets (the desk read `pipeline.ts` at 1022 and `+page.svelte` at 5640 on 2026-10-19; NOT ESTABLISHED now). Read the ratchet table first. Where a change would cross a ceiling, move code out first into a new module; do not raise a ceiling.
- No IPA is written by hand. Every expected IPA below is an output of Ilya's engine, compared with another output of the same engine.
- No string a singer reads is added or changed in this batch. A string you find you need is listed in your report as owed to Dann; do not invent it.
- Return memo format at the end (section 5). Every row's report has a section "What I could not establish".

## B1. The «ну-те» entry in the singer supplement

**Goal.** Song 2 («Весёлый час», Mussorgsky) reads «Ну-те ж все разом» in Text. Today the gloss under «Ну-те» reads "chickpea, garbanzo", because the hyphenated word is joined and looked up as «нуте», a form of «нут» (`data/dictionary.86d83340-a.json:121160`, read by the desk on 2026-10-20, cause read not run). Dann ruled the gloss a modal equivalent in English and in French (2026-10-20 23:22, 23:23) and ratified the French (23:39).

**The entry, ratified, final as drafted:**

`"нуте": {"stress": 0, "gloss": {"en": "come now (urging)", "fr": "allons (exhortation)"}, "source": "supplement"}`

for `data/singer-supplement.json`, a flat object keyed by word (the desk read it 2026-10-21: «же» and «чём» are entries of this shape; «нуте» and «ну-те» are absent).

**What the engine does.** The supplement is checked before the dictionary: `SINGER_SUPPLEMENT[cleanWord]` returns the entry first (`packages/phonology/src/engine.ts:738-741`). So the entry shadows the real word «нуте» (chickpea) everywhere. The desk named that cost when it drafted the entry (`docs/memory/INBOX.md`, 2026-10-20 23:22) and it is not ruled out; if a score in the tree or a gate reads «нуте» as the plant and changes because of the entry, report which, and do not decide it.

**Open for you, NOT ESTABLISHED:** whether the key at lookup is «нуте» or «ну-те». The old-spelling code strips only a trailing hyphen (`apps/web/src/lib/old-spelling.ts:30`, the desk's reading from 2026-10-20), and where the inner hyphen goes is unread. Settle it by running song 2's line: the file is `~/Downloads/_colleague-pages/run-2026-10-19/run/drops/song2.musicxml` (md5 `1e9598075f8f2945108957121bd640c6`). Put the entry under the key that makes «Ну-те ж» read the new gloss, and say which key you used and how you found it.

**Done when.**
1. A test seats «Ну-те ж все разом» and asserts the gloss reads "come now (urging)" in English and "allons (exhortation)" in French, and fails on the tree before the entry.
2. The approval corpus (`apps/web/src/lib/approval/ipa-corpus.approval.test.ts`) and every other gate are at baseline. If adding the entry moves an approved IPA, stop and report which line moved.
3. `«ж»` keeps its own gloss "(emphasis)" and "(emphase)".

## B2. The update check (QUEUE row 151)

**Goal.** Ilya polls the host for a new build every 60 seconds. Dann (2026-10-20 22:25): *"Should Ilya poll the host for a new build every 60 seconds? That seems excessive. What about jsut one opening ILya? per session, I mean. It will cut down on pings. Evaluate?"* (transcribed as written). The desk's default, his to overrule:

- `pollInterval` goes from 60000 (`apps/web/svelte.config.js:20`, read 2026-10-21) to 0.
- App code calls `updated.check()` on mount, when the page returns to the foreground (at most once an hour), and on the `online` event. With `pollInterval` 0 the framework arms no timer, so a check on opening needs app code: Fable's memo reads `node_modules/@sveltejs/kit/src/runtime/client/utils.js:268` and `:297` (the desk did not re-read these; verify them).
- The notice never rises during a calibration take or a reading of a page (`PRODUCT.md:533`, NOT re-read by the desk; read it).
- The notice's Refresh button today deletes every cache whose name starts with `ilya-` and then reloads (`apps/web/src/routes/+page.svelte:4625-4633`, read 2026-10-21). With no network that can leave nothing to serve. Change it: fetch the new shell first; delete the caches only if that fetch succeeds; otherwise keep the caches and leave the notice up.

**Sites that decide when a check runs or what a reload does** (the brief names them as `CONTRACT.md` section 4 asks): `svelte.config.js:20`; the toast and its button at `+page.svelte:4620-4636`; the worker's fetch handler, `apps/web/static/sw.js:54`, `:68-72`, `:74-87` (Fable's memo, NOT re-read by the desk). Search for every other caller of `updated` (`grep -rn "updated" apps/web/src --include=*.svelte --include=*.ts`) and list them in your report.

**May bend.** The once-an-hour limit and the three triggers may change if a measure shows a reason; say what you measured.

**Done when.**
1. A unit test shows `pollInterval` is 0 and a check is attempted on mount, on return to the foreground (and not twice in one hour), and on `online`.
2. A test shows the Refresh path keeps the caches when the fetch of the new shell fails.
3. NOT ESTABLISHED, report it and do not guess: whether an unsaved edit survives the reload; whether a first open with no network works.

## B3. The # for a syntactic break (QUEUE row 139)

**The need, in Dann's words (2026-10-19 23:59):** *"When a coahc tells a singer that there is no voicing, they can inseert an octothrope and Ilya's transcription IPA will adjust."* (transcribed as written). Background, 23:54: the octothorpe marks a syntactic break and blocks regressive assimilation of voicing; no non-native speaker can place one reliably, so the singer places it on a coach's or a native speaker's word. The full ruling is `docs/memory/OPEN.md`, "THE # FOR A SYNTACTIC BREAK", read by the desk 2026-10-21.

**Ruled, as the design:**
- A typed # takes no note of its own. It is seated with a neighbouring word, as a clitic is.
- It always ends the word before it. The engine stores a word's right boundary as `'hard' | 'soft' | 'clitic'` with a source `'user' | 'auto' | 'punctuation' | 'score'` (`packages/phonology/src/engine.ts:112-113`). The # sets a hard boundary, as punctuation does.
- Regressive voicing assimilation does not cross a hard boundary. Today the punctuation test has no # (`engine.ts:1999` the regex, `:2007` its use, `:2023` where a punctuation boundary is stamped `'punctuation'`).
- It never prints in the Russian: not in Poem, not in Lyrics as drawn or printed, not under the notes, not in Text's Cyrillic.
- In the IPA it always appears as an enclitic, grafted after its parent syllable (Dann 2026-10-20 00:01: *"The IPA should always featuer the octothorpe as an enclitic grafter after its parent syllable."*, transcribed as written).
- DESK DEFAULTS, his to overrule: the Lyrics field shows a typed # while the singer edits, so it can be found and removed; Ilya never places a # itself.

**Sites that compute a word boundary or count the words of typed text.** This change alters how a word boundary is computed, so the brief names them. The desk read these on 2026-10-21; the first six are the ones to change or to prove unaffected:
1. `packages/phonology/src/engine.ts:1999-2023`, `autoDetectBoundaries`: the punctuation regex and the boundary stamp.
2. `apps/web/src/lib/pipeline.ts:52-53`, `PUNCTUATION_REGEX` and `TRAILING_PUNCT_REGEX`: neither contains #.
3. `pipeline.ts:182`: the typed line is split on whitespace; a # surrounded by spaces becomes its own token. Decide how a # joins its word before any token wants a note.
4. `pipeline.ts:590` (`toClean`), `:621-622` (the trailing punctuation match), `:676` (the lookup word): each strips punctuation by its own pattern.
5. `pipeline.ts:778-788`: an enclitic cannot attach leftward if punctuation separates it from the word before it (`prevHasPunct`), and a clitic test reads `wordData.punctuation`. A # must not change which words are clitics or enclitics.
6. `packages/phonology/src/engine.ts:794-818`: punctuation is stripped from the original and re-appended.
7. Sites that count or compare words and so can be thrown off by a stray token: `apps/web/src/lib/text/same-words.ts:26`, `apps/web/src/lib/library/songs.ts:52`, `apps/web/src/lib/score/score-seat.ts:85` (`seatScoreWords`), and the pairing code (`apps/web/src/lib/score/pairings.ts`). NOT ESTABLISHED: whether each is affected. Search for every other place that splits typed text on whitespace or counts its words (`grep -rn "split(/" apps/web/src --include=*.ts --include=*.svelte`, then read each hit) and list them in your report with a verdict.

**What depended on these sites agreeing.** A word's boundary decides voicing assimilation across words (engine), which word a punctuation mark belongs to (pipeline), whether an enclitic attaches (pipeline), and how many tokens want a note (the seating code). If the # changes one and not the others, a note can be seated to a # or an enclitic can attach across it. Prove they agree with the tests below.

**Done when.**
1. **Voicing.** For three word pairs where the engine's own output voices a final consonant across the boundary (find them by running pairs with no mark and no punctuation), the IPA of `X # Y` equals the IPA of `X, Y` for X and Y, and differs from the IPA of `X Y`. The only extra symbol is the # in the IPA, grafted after X's last syllable.
2. **Never in the Russian.** A # typed in Lyrics appears in the Lyrics field while editing and in no drawn or printed Russian: Poem, Lyrics as drawn, the words under the notes, Text's Cyrillic, Markup, Insights. One test per surface.
3. **No note.** A line with a # seats the same number of notes as the same line without it; the # takes no note and never shifts a syllable.
4. **Enclitic.** A # after a word that has an enclitic neighbour does not change which words are clitics.
5. **Gates.** All eight gates at baseline.

**May bend.** Where the # joins its word, and the IPA glyph's exact placement beside an existing enclitic graft, may change if a test shows a collision; say what you changed and why.

**Where would this wall a singer in?** Fable's question for every brief from this design. Answer it in your report: a case where a singer types a # and cannot get it out, or cannot tell why a word sounds different, or a # shows where the ruling says it must not.

**Not in this batch.** The Guide line in both languages that explains the # (the desk drafts it; French goes to Dann). Playing or auditioning the # is out of scope.

## 5. Return memo

One file per row, `docs/sessions/report-code-batch-c-<row>_r1_2026-10-21.md`, each with: what you changed (files and `path:line`); the tests added and which failed before; the eight gates before and after; a section "What I could not establish" (every NOT ESTABLISHED above, answered or still open); anything owed to Dann (a string, a ruling). Do not commit the brief, the reports, or any `docs/memory` file; the desk files them.

## 6. Cost and the order of the lane

State your token use per row in the report. If a row would cross a ceiling you cannot move code out of, stop and report rather than raise it.
