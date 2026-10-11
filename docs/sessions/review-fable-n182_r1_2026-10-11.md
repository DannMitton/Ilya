# Review: brief-code-n182-suggesting-a-key_r1 (Fable, 2026-10-11)

Read whole: `docs/sessions/draft-n182-suggesting-a-key_r1_2026-10-11.md` (the draft), `docs/sessions/brief-code-n182-suggesting-a-key_r1_2026-10-11.md` (the brief), `docs/sessions/report-code-insights-for-the-singer_r1_2026-10-11.md` (row 66's report), and in the clone at `f8d8ca3` (`cloud-lane`): `apps/web/src/lib/insights/singer-page.ts`, `insights.ts:286-356` and `:500-563`, `singer-blocks.ts:60-240`, `InsightsPane.svelte:300-338`, `comments.ts:92-115`, `packages/score-parser/src/analysis-types.ts:39-137`, `packages/score-parser/src/transposition.ts:571-620`, `apps/web/src/lib/voice/engine/stand-ins.ts:1-60` and `:161-208`, `apps/web/src/lib/analysis/analyze-score-adapter.ts:240-312`, `docs/memory/OPEN.md:431-463` and `:2727-2740`.

Two things the brief cites could not be found in the clone: `OPEN.md` has no heading "NO LOW-VOICE NORM" and none for "ROW 66's KEY SEARCH" (grep of `docs/memory/*.md` for "low-voice", "LOW-VOICE", "ROW 66", "KEY SEARCH", "smallest move": no hits). The clone's `docs/memory/` may lag Dann's tree, since Code never edits it. NOT ESTABLISHED; the brief's citations stand or fall on his copy.

## Ranked findings

### Must fix

**M1. "At or above the secondo" is not a figure the model has; Code will guess which one to build.**
Brief, rule 2: *"Passaggio time: time at or above the primo and at or above the secondo."*
The zones are: below means MIDI under the primo, above means MIDI over the secondo, and a note on either passaggio is counted between (`insights.ts:503-507`, `:543-546`). So "at or above the primo" is `between + above` (`singer-page.ts:49-52`, `shareAtOrAbovePrimo`) and exists; "at or above the secondo" does not: `shareAboveSecondo` is strictly above (`singer-page.ts:55-57`), and so is the held note (`toSecondo > 0`, `singer-page.ts:107`). Rewrite: *"Passaggio time: the share of sung time at or above the primo (`shareAtOrAbovePrimo`, `singer-page.ts:49`) and the share above the secondo (`shareAboveSecondo`, `:55`), the zones as `insights.ts:503-507` defines them, unchanged."*

**M2. Rule 4 is not the draft's grouping, and a three-band profile both splits and collapses the wrong things.**
Draft, principle 1: *"Workable keys are grouped by the set of challenges each brings; one key is shown per distinct set, the smallest move within it."* Brief, rule 4: *"primo time and secondo time, each in bands of 10 percentage points of sung time against the written key (less, about the same, more)."*
Three faults:
(a) Bands are not challenges. Two keys whose challenge set is identical (both leave some time above the primo, none above the secondo, no held note, range inside) land in different groups when one trims 9 points and the other 11. That is a spurious group at an arbitrary edge.
(b) "About the same" swallows a challenge vanishing. A secondo share of 6 percent going to 0 is "about the same" under a 10-point band, yet the singer has lost a whole challenge (no time above the secondo). The held-note axis catches only the held case. A real difference collapses.
(c) "Less" is unbounded. Down a tone (minus 12 points) and down a fourth (minus 45 points) share a group; the group shows the smaller move, so the singer is never told the larger one exists. The draft accepts this (one key per set, smallest move), but only if the set is a set of challenges; under bands it is a set of arbitrary buckets.
Proposed rule, which codifies "the number of keys follows the data" as the draft words it: *"A key's challenge set is discrete: range (inside; up to a tone beyond, above or below; beyond that, not workable), any time at or above the primo (yes or no), any time above the secondo (yes or no), a held note above the secondo (yes or no). Keys with the same set form one group. Within a group the smallest move is shown, but only a move that changes something that matters: a challenge gained or lost, or a share moved by at least 10 points against the written key (`BETTER_KEY_MIN_DROP`, `singer-page.ts:41`, JUDGEMENT). A group with no such key is not shown. Shares go on the line as figures; they never decide the group."* This keeps the 10 points as the materiality test Dann already saw (row 66's "smallest qualifying move") and keeps grouping on challenges, which is what he said.

**M3. Worse keys eat the cap.**
Brief, rule 5: *"At most three groups, ordered by smallest move."* Under rule 4 as written, up a tone with more primo time is a distinct profile and is shown; ordered by smallest move, up 2 outranks down 4. The draft wants harder keys available (Dann, 13:54: *"I like offering the singer agency even if they cause themselves more problems"*) but a "well-positioned suggestion" first (Why, 13:38). Rewrite: *"Groups are ordered by fewest challenges, then by the smaller share at or above the primo, then by smallest move, then the lower key. At most three are shown; the rest, and keys beyond the range margin, sit under the reveal."* With this, the cap cuts the worst, not the farthest.

**M4. The experience stage is not in the tree; rule 7 has no input.**
Brief, rule 7: *"The experience stage changes only the wording (N.172; a novice's line adds a clause of why; an expert's is terse)."*
`IntakeAnswers` carries per-question five-point answers and switches, no stage field (`analysis-types.ts:108-137`); no file under `apps/web/src` names "novice", "Dreyfus", or "proficient" (grep, tests excluded). The only built modulation is the register from Q7 (`registerFor`, `comments.ts:106-109`: plain, working, technical) and the per-question bands (`intakeBand`, `:98-101`). Rewrite: *"Wording follows the register from Q7 (`registerFor`, `comments.ts:106`): plain adds a clause of why; technical is terse; working is between. No stage field exists (`analysis-types.ts:108-137`); none is added here."* Or strike the rule and record that N.172's stage is owed.

**M5. Two "Try this key" sources today; the brief says which one it replaces but not what happens to the other.**
Brief, opening: *"It replaces row 66's single 'better key' (`searchBetterKey`)."* The pane takes `searchBetterKey` when nothing is out of range, else the watch list's key from the range finding (`InsightsPane.svelte:302-322`); `searchBetterKey` itself returns null unless the range is contained (`singer-page.ts:181`), and the watch list's search runs only when a note is out of range (`transposition.ts:584-586`). The new search must run in both states (rule 2 makes a key up to a tone beyond range workable). Rewrite, add: *"The new search runs whether or not the written key is in range, and is the only source of keys on Insights; the range finding's `transposition` (`InsightsPane.svelte:316-321`) no longer drives the way forward there. Markup's ruler is untouched."* Also say what replaces `insights.r2.noBetterKey` ("No other key within a tritone fits your voice better", `i18n.ts:1745`) and the unlikely branch's forward (`singer-blocks.ts:174-186`), since both assume one key.

**M6. Stand-in vowels can put a voice-type norm into the vowel line, unlabelled.**
Brief, rule 3, says only: *"A line mentions them only where keys differ meaningfully."* `vowelTurns` reads `profile.fR1` for every vowel (`singer-page.ts:255-256`, `:268`). Since row 17, a vowel the singer never sang takes a surrogate from the Bozeman staff chosen by the declared voice type (`analyze-score-adapter.ts:274-275`; `stand-ins.ts:174-188`; "Not sure" takes the middle of all five, `stand-ins.ts:52-55`), flagged `fR1Source: 'surrogate'` (`analysis-types.ts:69`). Nothing in `apps/web/src/lib/insights/` reads `fR1Source` (grep, no hits). So a key line could say more of the singing sits past the vowels' turn on the strength of a bass template, which is the norm the draft forbids, and present it as the singer's. The clone's `OPEN.md` has no "STAND-INS ARE LABELLED" section (NOT ESTABLISHED). Rewrite, add to rule 3: *"The vowel description counts only vowels whose fR1 is `'sung'` or `'derived'` (`fR1Source`, `analysis-types.ts:69`); a `'surrogate'` vowel is left out of the comparison, and if every sung vowel is left out the line is omitted. Report how many fixture vowels are surrogate."*

### Should fix

**S1. "Meaningfully" and "matters" have no number.**
Brief, rule 3: *"only where keys differ meaningfully"*; opening: *"changes the challenges in a way that matters."* Rewrite: *"Meaningfully and matters both mean the 10-point test (`BETTER_KEY_MIN_DROP`), applied to the share past the turn for rule 3."*

**S2. Tessitura is named as deciding but appears in no rule.**
Brief, rule 6: *"the typed range, tessitura, and passaggi decide."* The draft's agreed challenges are range and passaggio time only (Q2, Q3 amended). Today's search requires tessitura contained (`singer-page.ts:192`) and `isUnlikely` tests tessitura by `UNLIKELY_TESSITURA_MARGIN` (`:70-78`). Rewrite: *"Range and passaggi decide; tessitura is not a challenge and not a gate (today's tessitura gate at `singer-page.ts:192` goes). `isUnlikely` is untouched."* And say what the page does when a piece is unlikely by tessitura yet has workable keys: today's unlikely paragraph still runs (`singer-blocks.ts:147-186`), and the keys sit under it.

**S3. The crossings gate goes, silently.**
Today a key is rejected when it adds a crossing of either passaggio (`singer-page.ts:193-194`). The draft lists no crossing among the challenges; dropping the gate is consistent, but Code must be told. Add: *"The crossings gate (`singer-page.ts:194`) is removed; crossings are not a challenge (draft Q2)."*

**S4. Profile without passaggi or without a range is undefined.**
`searchBetterKey` returns null without range, tessitura, and both passaggi (`singer-page.ts:180`). Rule 4 assumes all axes. Add: *"Without typed passaggi the set has only the range axis; without a typed range there is no search and no line (genuine absence, `analysis-types.ts:74-78`)."*

**S5. The reveal's unit is unstated, and grouping would defeat it.**
Brief: *"'Show keys that reach higher' ... reveals keys beyond the range margin, each with its range challenge named plainly."* If grouped, every far key shares the set "range beyond" and collapses to one line, which is the opposite of what the singer asked for. Rewrite: *"The reveal lists keys, not groups, nearest first, each with how far past the range it reaches and the note that does it ('up a fourth: three notes up to a minor third above your range, the highest in bar 12')."*

**S6. "Ilya's recommendation" on three lines.**
The ruler readout appends "Ilya's recommendation" when the stop is the recommended one (`transposition-ruler-state.svelte.ts:133-135`, which passes `stop` as both the stop and the pick). Three keys each stamped as the recommendation contradict principle 5 (Ilya presents, the singer chooses). Add: *"Key lines use the readout without the recommendation suffix; no key is marked as Ilya's pick."* (Whether `readout` can omit the suffix: NOT ESTABLISHED; its implementation was not read.)

**S7. The label's corroboration or contrast is dropped without a pointer.**
Draft, principle 6: *"the declared voice type only corroborates, or, where it disagrees, is noted as a contrast (the courtesy check, QUEUE row 9, is its natural home)."* Brief, rule 6: *"the declared voice type is not an input to the search."* True, and right, but Code should know the contrast is row 9's and not build or expect it here. Add: *"Nothing here reads the label; the contrast line is QUEUE row 9's."*

**S8. The cap's labelling.**
Draft, principle 4: *"The desk's proposal against overwhelm; Dann's to strike."* Brief, rule 5, carries no label. Add *"DESK DEFAULT, Dann's to strike"* and keep the binding count.

**S9. The range margin reuses a tessitura constant by number only.**
Brief, rule 2: *"Up to two semitones beyond ... farther makes the key not workable."* `UNLIKELY_TESSITURA_MARGIN` (`singer-page.ts:34`) is about a tessitura band, not a note beyond the declared top. The number matching is a convenience. Rewrite: *"Its own constant, `RANGE_CHALLENGE_MARGIN = 2`, DESK DEFAULT, agreed by Dann 13:51; not a reuse of `UNLIKELY_TESSITURA_MARGIN`."*

**S10. "Suits the voice" is undefined.**
Brief: *"when the written key already suits the voice."* Rewrite: *"when the written key's challenge set is empty (range inside, nothing at or above the primo) and no key differs from it by the 10-point test"*, or tie it to `model.verdict === 'fit'` (`singer-blocks.ts:188`) and say which.

**S11. Fixture voices.**
Brief: *"Report how often the cap binds on the tree's fixtures."* Row 66's pictures used one synthetic bass (`report-code-insights-for-the-singer_r1`, line 48). Counting the cap on bass-shaped voices only builds a low-voice norm into the proof. Add: *"Fixture voices: at least one soprano, one tenor, one bass, typed range and passaggi; name them."*

### Minor

**m1.** Draft, principle 3: *"no line that is true of every key; no figure that does not help a decision."* The brief compresses to *"only what differs for this singer."* Carry both clauses verbatim; they are the test Code applies to each string.

**m2.** Brief, rule 4: *"range challenge (none, up to a semitone, up to a tone, above or below)."* Say whether it is a product of distance and direction, and that a compass wider than the range on both ends (`'wider'`, `insights.ts:296`) is not workable.

**m3.** Brief: *"(and lower, where that applies)"* is the desk's extension of the agreed "Show keys that reach higher" (13:54). Label it DESK DEFAULT.

**m4.** Rule 2's example string *"one note a tone above your range"* should scale: count and farthest ("three notes up to a tone above your range, the highest in bar 12"), PROPOSED.

**m5.** "sung time" in rule 4: say it is phonation total as `aggregatePhonation` sums it (`insights.ts:522-526`), so the percent matches the page's other figures.

**m6.** The brief's two `OPEN.md` citations (NO LOW-VOICE NORM; ROW 66's KEY SEARCH) are NOT ESTABLISHED in the clone. If they exist only in Dann's tree, Code on the cloud lane cannot read them; quote the ruling in the brief.

## Verdict

The brief carries the draft's substance in the main (two challenges, vowels described and never counted, two-semitone margin, six-semitone reach, the same keys for every singer, the reveal, consent), but its one piece of desk codification, rule 4, replaces Dann's "set of challenges" with 10-point bands, and that single substitution produces the three failures a singer would feel: a spurious extra key at an arbitrary edge, a vanished challenge reported as "about the same", and worse keys consuming the cap by being nearer. Four more gaps would make Code guess or ship something false: "at or above the secondo" names a figure the model does not have; the experience stage is not built; two key sources exist today and only one is replaced; and stand-in vowels from a voice-type template can enter the vowel line as the singer's own, which is the low-voice norm the draft forbids. None of this is hard to fix, and the proposed rule (discrete challenge sets, 10 points as the materiality test, shares as figures on the line) is closer to what Dann said than the bands are. Not ready to send as r1; ready as r2 after the six must-fixes.
