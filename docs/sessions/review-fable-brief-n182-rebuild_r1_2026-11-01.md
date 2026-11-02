# Review: brief r2 for N.182 (row 71) against `6f740dbf`, for the rebuild (Fable, 2026-11-01)

**Verdict: REWRITE as r3.** The design holds (two challenges, discrete sets, the 10-point test, stakes order, the reveal, consent). Three things since 2026-10-11 overturn the brief's own text rather than decorate it: Dann's ruled key lines of 2026-10-11 23:14 to 23:20 (`docs/memory/OPEN.md:3121`) contradict rule 7 and every proposed string; INSIGHTS now analyses the score as drawn in the singer's chosen key and octave (`apps/web/src/lib/insights/InsightsPane.svelte:164-166`), so "against the written key" no longer names one thing; and the lane, cut point, report path, and capitals rulings all change. An r3 that carries the amendments below is shorter than r2 plus a patch sheet.

Read this session, at `6f740dbf` on `Shane`: the brief r2, the draft r1, the Fable review r1, the old branch's report and `--stat` (`origin/cloud-lane`, one commit `0bb644b2`, 23 files, +827/-240), `OPEN.md:3121`, `QUEUE.md:124`, `STATE.md:214`, `CONTRACT.md:26` (item 11a), the INBOX tail (2026-10-30 to 2026-11-01 22:23), `docs/house-style/interface-text_r1_2026-11-01.md`, `docs/house-style/SKILL.md:148-157`, `brief-code-consistency-1-screen-words_r2_2026-11-01.md`, `scripts/ratchets.json`, `scripts/ratchets.mjs:1-60`, and the code lines cited below.

## 1. The brief's `path:line` citations at `6f740dbf`

| Brief r2 cites | Now | Note |
|---|---|---|
| `i18n.ts:1745` (`insights.r2.noBetterKey`) | `apps/web/src/lib/i18n.ts:1888` | moved; `r2.better.tone` `:1890`, `.interval` `:1891`, `r2.compare` `:1906`, `r2.inKey` `:1893`, `r2.inKeyShare` `:1895` |
| `singer-page.ts:70` (`isUnlikely`) | `:70-79` | unchanged |
| `singer-page.ts:174-205` (`searchBetterKey`) | `:174-206` | unchanged; tessitura gate `:192`, crossings gate `:193-194`, typed-range read `:180` |
| `singer-page.ts:41`, `:44`, `:49`, `:55` | same | `BETTER_KEY_MIN_DROP`, `KEY_SEARCH_WINDOW`, `shareAtOrAbovePrimo`, `shareAboveSecondo` unchanged; `shareAfter` `:209` |
| `InsightsPane.svelte:302-322` (the two sources) | `:309-338` | moved; `searchBetterKey` call `:319`, range finding's `transposition` `:324-327`, `stopFor`/`readoutFor` `:331-334`; import `:73` |
| `singer-blocks.ts:174-186` (unlikely branch's key) | `:190-202` | moved; `KeyForward` `:75-86`; `forward` type `:50`; the fit branch `:203-212`; the compare line `:241-250` |
| `insights.ts:503-507` (zones) | `:505-509` (comment), `:540-550` (code) | moved |
| `insights.ts:522-526` (`aggregatePhonation`) | `:524` | moved |
| `transposition-ruler-state.svelte.ts:133-135` | same | `readoutFor` still passes `stop` as the pick (`:135`); `readout` at `transposition-ruler.ts:102-110` takes `pick: KeyChoice | null` and chooses `key.ruler.readout` when `pick` is null, so the suffix can be omitted without a new option (`i18n.ts:2225-2226`). The r1 review's NOT ESTABLISHED on this is closed. |
| `comments.ts:98-101`, `:106-109`, `:426-433` | same | `intakeBand`, `registerFor`, `byStakes` unchanged |
| `analysis-types.ts:69`, `:113-137` | `:69`, `:115-137` | `fR1Source`; `IntakeAnswers` at `:115` |

Gone: nothing the brief cites has been deleted. New and uncited: `InsightsPane.svelte:158` (`withSingerTempo`, row 48), `:162-166` (`readingClef`, `shiftVocalOctave`, `keyRuler.draw`, `scoreInPerformanceOrder`: the score the search must start from), `:95` and `:156` (`voiceType` prop, passed to `buildVoiceProfileSnapshot`), `SingerBlock.svelte:79-85` (the forward block as drawn), `:159-160` (the octave line).

## 2. Amendments, numbered

**A1. The reference key is the key as drawn, not the written key.** `analysisScore` is the printed reading shifted by the octave choice (`:164`), engraved in the singer's chosen key (`:165`, `keyRuler.draw`), in performance order (`:166`). Every "against the written key" in rules 1, 4, and 6 and in the one-line answers must read "against the key INSIGHTS analyses, which is the key the singer has chosen on MELODY (or the printed key when none is chosen), after the octave reading of row 47". Add: *"The search window of six semitones is measured from the drawn key. Whether `stopFor` (`transposition-ruler-state.svelte.ts:95-98`, `stopForSuggestion`) maps a semitone offset from the drawn key or from the printed key is NOT ESTABLISHED; Code reads `stopForSuggestion` first and reports which, and the lines name the landing key by `keyNameFor`, never by the offset alone."* Replacement for the opening: *"On INSIGHTS, under 'How this key sits for you', in place of today's way forward, for the key the singer is reading in."*

**A2. Rule 7 is overturned by the ruled key lines; replace it.** `OPEN.md:3121` (3): the primo is measured for tenor, baritone, and bass only, until the voice-family table exists; this reads the declared voice type, allowed by Dann's 2026-09-29 23:23 ruling; with no type or "Not sure" the primo line is not shown; secondo lines stay for every voice. Replacement text: *"7. **Data first, label second, except the primo** (Dann 2026-10-11 23:20, `OPEN.md`, ROW 71's KEY LINES (3)): the typed range and passaggi decide. The primo axis (time at or above the primo) exists only when the declared Tier 1 type is `tenor`, `baritone`, `bass-baritone`, or `bass` (`apps/web/src/lib/voice/voiceTypes.ts:20-29`); for every other type, `not-sure`, or no type, the challenge set has no primo axis and no line names the primo. The declared type reaches the pane as `voiceType?.voiceType` (`InsightsPane.svelte:95`, `:156`) and is not on `VoiceProfileSnapshot` (`analysis-types.ts:39-80`, no such field), so the search takes it as its own argument. `bass-baritone` counted with the three named is a DESK DEFAULT; `countertenor` counted as treble is a DESK DEFAULT; Dann's to overturn."* Consequence for rule 4's empty set: *"for a voice without the primo axis, 'suits' means range inside, nothing above the secondo, and no sustained note above it."* Without this the written key of every soprano reads as never suiting (`key.none` as built named the primo for all voices, old report "For Dann" 1).

**A3. Strings follow the three rulings; every PROPOSED string of the old build is void.** (1) Shares as plain fractions ("about a third", "nearly half"); a share too small for a fraction is not given as one; no "{n} percent" in any line (the old build's parts "{n} percent of the singing at or above {primo}" and "{n} percent past where the vowels turn" go). (2) "Notes" are pitches named with bars: "above your secondo: the F5 in bar 12 and the G5 in bar 14"; the old build's "{count} notes up to {interval} above your range" becomes a list of pitches with bars, capped (DESK DEFAULT: three named, then "and {k} more"). (3) "sustained", never "held" (`QUEUE.md:124`): "a sustained note above your secondo, in bar {bar}". Add to the Words section: *"A fraction helper is pure and tested: thresholds for 'about a quarter', 'about a third', 'about half', 'nearly half', 'most', and the floor under which no fraction is said are one table of constants, DESK DEFAULT, listed in the report."* The tests on ratified lines (`ratified-lines.test.ts`) pin none of the strings this row retires; the pin that does is `singer-blocks.test.ts:122` (`insights.r2.noBetterKey`), which changes in the same commit (`CONTRACT.md:26`, item 11a).

**A4. Retiring ratified strings is now permitted and must be listed.** `insights.r2.noBetterKey` (`:1888`), `r2.better.tone` and `.interval` (`:1890-1891`), `r2.compare` (`:1906`), `r2.inKey` and `r2.inKeyShare` (`:1893`, `:1895`) each named one key as the better one and lose their only reader. Replace the brief's "Replaces `insights.r2.noBetterKey`" with: *"These six ratified keys are removed with their pins in one commit, and the report lists them under 'Ratified text changed' (`CONTRACT.md` §1 item 11a)."* Not retired: `insights.r2.teacherA` (`:1879`), still read at `singer-blocks.ts:201`; say whether the teacher line stays under "No workable key" (recommend yes, DESK DEFAULT).

**A5. Capitals and names.** Replace "Insights" with INSIGHTS and "Markup" with MELODY throughout the brief's singer-facing text; "**Try this key** applies it on MELODY". Code identifiers, folders, and the `keyRuler`/`markup/` paths stay as they are (Dann 12:28). Screen-reader text stays in ordinary case (22:14). The reveal is a `<details>` (old build, `SingerBlock.svelte:70-84` of that branch); its summary is visible text, so capitals apply only if it names a place (it does not). Add: *"No line in this row names a tab; if one is added, it reads MELODY / CHANT."*

**A6. Colour story (row 165, `6f740dbf`).** `SingerBlock.svelte:216-222` sets `.forward` in `var(--rose-ink)`; `.try-key` is an outlined chip in `--ink-primary` (`:537-547`) and is hidden in print (`:572-577`). Add: *"Key lines take the forward's existing rose ink; the reveal's summary takes `--ink-secondary`; no meaning rests on colour alone: a key under the reveal is told apart by its words (how far it reaches), never by shade."* Also: the chip is a button, and the interface-text draft §4 says a button is named by its exact label in a chip; "Try this key" already is one.

**A7. Octave and tempo.** Add: *"The octave reading (row 47) is already in `analysisScore` (`InsightsPane.svelte:162-164`): the search transposes that score, so a bass reading the line down an octave is searched where he sings it. The tempo (row 48, `:158`) does not move a share: zones are fractions of quaver totals (`insights.ts:545-550`), so the shares and the challenge sets are tempo-independent; only a sustained note's seconds would be, and this row names bars, not seconds."* The octave block (`singer-blocks.ts:61-62`) and the tempo link (`:103-105`) sit in the same `BlockInputs`; the key lines join them as a field, not a new block kind, so `SingerBlock.svelte` grows by the forward's rewrite only.

**A8. Curation rules (N.173) touch the order only.** `OPEN.md:414` says N.173 is a living draft, not ruled; rule 5 cites it as a rubric for stakes. Add: *"N.173 is unruled (`OPEN.md:414`); rule 5's weights are this row's own DESK DEFAULT and are not written back into N.173."* Nothing else in N.173 touches the row.

**A9. Lane, cut, gates, report.** Replace "Commit and push to `cloud-lane` only" with: *"Branch `cloud-lane-24`, cut from `Shane` at its tip after consistency batch 1 merges (see 4 below); push only that branch; never `Shane` or `main`; no edits under `docs/memory/`. Gate baselines are taken on the cut and reported before step 1. Report at `docs/sessions/report-code-n182-suggesting-a-key_r2_2026-11-01.md`."* `origin/cloud-lane-24` does not exist yet (`git ls-remote`, 2026-11-01: `cloud-lane-23` is the highest).

**A10. i18n keys.** The old build put 31 keys under `key.*`, the ruler's prefix (`i18n.ts:34`: `key.` is the key ruler, 23 keys). Add: *"New strings go under `insights.key.*` and the prefix index at `i18n.ts:7-85` gains the line; the ruler's `key.*` is not added to."*

**A11. Surrogate vowels: the doc comment lies.** `analysis-types.ts:66` says of `'surrogate'` "nothing writes it yet"; `analyze-score-adapter.ts:188` declares the map and `:269` writes surrogates. Add to rule 6: *"Correct the comment at `analysis-types.ts:66` in passing."*

**A12. The old branch is reference, not source.** Add: *"Read `origin/cloud-lane:apps/web/src/lib/insights/key-suggest.ts` and `key-lines.ts` for shape only; rebuild against `6f740dbf` or later, since `analysisScore`, the octave, the tempo, and the ruled lines postdate them. Cherry-picking `0bb644b2` is not allowed."*

## 3. Strings the row adds, and their status

Every English string is PROPOSED (Dann to rule) and every French is OWED to Dann; none is ratified. Existing and already ratified: "Try this key" / « Essayer cette tonalité » (`insights.tryKey`, `i18n.ts:2250`), the ruler's intervals (`key.ruler.interval.*`, `:2234-2245`), and `key.ruler.readout` (`:2226`). The old build's French was English marked `[FR: owed]`; under `CONTRACT.md` §7 the French arrives as the desk's marked drafts for Dann, in a separate commit, never typed by Code. The brief says so once; keep it.

Lines to propose, English only, after A2 and A3:
- the one-line answers: "No key suggested", "No key within a tritone changes these challenges by much", "No workable key" (the second sentence, "Whether to pursue it, or to choose other repertoire, is yours to decide", is Dann's substance from 13:45 and stays);
- the key line "{readout}: {parts}." with parts for range (pitches with bars), passaggio time (fractions), the sustained note (bar), and the vowels' turn (fraction, only where the 10-point test passes);
- the why clauses (points 1 to 2) and terse forms (points 4 to 5);
- the passaggio nouns in three registers;
- the reveal labels (higher, lower, higher or lower).

## 4. Collisions with consistency batch 1, and the order

Batch 1 (`brief-code-consistency-1-screen-words_r2`, running on `cloud-lane-23`) edits `i18n.ts` values and pins (step 3), moves language ternaries into `i18n.ts` (step 1; `InsightsPane.svelte:290` holds one, so that file is touched), and creates `apps/web/src/lib/names.ts` (step 2; absent at `6f740dbf`). Row 71 edits `i18n.ts`, `InsightsPane.svelte`, `singer-blocks.ts`, `SingerBlock.svelte`, `singer-page.ts`, `insights.ts`, and tests. Shared files: `i18n.ts` (appends, low conflict) and `InsightsPane.svelte` (same region is unlikely, but the file has zero ratchet slack, so two lanes cannot both add lines to it). Order: batch 1 merges to `Shane` first; row 71 cuts after. Reason: batch 1 is mechanical and nearly done; row 71 is the longer build and must not inherit a merge of `i18n.ts` pins mid-flight. The 2026-10-15 DESK DEFAULT ("rebuilt fresh from `Shane`", `STATE.md:214`) is kept.

## 5. Ratchets on every file touched

Measured 2026-11-01 (`wc -l` against `scripts/ratchets.json`):
- `apps/web/src/lib/insights/InsightsPane.svelte` 760/760, slack 0. The `better` block (`:309-338`) and `shift` (`:340-346`) go, about 38 lines; the replacement wiring (one `$derived` calling the new search, `voiceType` passed) must fit inside that. Lower the ceiling to the new count in the same commit.
- `apps/web/src/lib/i18n.ts` exempt (`ratchets.json:5`).
- Unlisted files are held to `newFileMaxLines` 1000 (`ratchets.mjs:8-10`): `insights.ts` 850 (gains an optional parameter only, or nothing if `readoutFor` takes `null` as the pick); `SingerBlock.svelte` 584; `singer-blocks.ts` 414; `singer-page.ts` 310 (shrinks: `searchBetterKey` and `shareAfter` go); `transposition-ruler-state.svelte.ts` 148.
- New modules `key-suggest.ts` and `key-lines.ts` (old build 259 and 124 lines) sit under 1000 with room for the fraction helper and the pitch lists.
- Whether test files are measured by the size ratchet: NOT ESTABLISHED (`ratchets.mjs:60` onward not read).
- `+page.svelte` 5586/5586 is not touched by this row; "Try this key" is already wired (`InsightsPane.svelte:520`, `:552`).

## Questions for Dann (taste, French, irreversible only)

1. **French.** Every new string's French is owed; the desk drafts after the English is ruled. Recommendation: rule the English from the report's "For Dann" first, then one French draft sheet. Reason: fewer rounds.
2. **Taste: the pitch list cap.** "Notes are pitches, named with their bars" can run long on a key three semitones up (the old reveal had "34 notes up to a tritone above your range"). Recommendation: name three pitches with bars, then "and 31 more". Reason: the ruling's example names two; a full list is the overwhelm the draft forbids.

Everything else above is reversible and marked DESK DEFAULT.

## Not established

- Whether `stopForSuggestion` measures its semitones from the printed key or the drawn key (A1).
- Whether the size ratchet counts test files (§5).
- `countertenor` and `bass-baritone` under ruling (3): the ruling names tenor, baritone, bass only; the defaults in A2 are the desk's.
- Whether the "voice profiles" named in today's context mean anything beyond the `voiceType` prop (`InsightsPane.svelte:95`) and MELODY's profile status lines (`markup/profile-status.ts:1-9`); nothing else in `apps/web/src/lib/insights/` reads a profile name or type (grep `voiceType`, hits only `identity.ts:12-32`).
- The cap's binding count on fixtures: still unestablished from the old report; the r3 brief keeps the ask.
