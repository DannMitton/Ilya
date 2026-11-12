# Brief: the -кий rhyme reading, and the Inspector note on the stage reading

This brief is the desk's. Do not edit, rename, or replace it.

r3, 2026-11-12. FABLE-REVIEWED: SEND WITH AMENDMENTS, 10 amendments, appended below and binding.

r2, 2026-11-12. **Changes from r1d:** every string the lane needs is now written into the brief, as ratified 2026-11-11 22:53 to 23:05 (r1d pointed to them and still said "French: owed"); the line numbers the Sonnet scout found moved are corrected (`scout-packet-three-briefs_r1_2026-11-11.md`, rhyme section); step 3 names the two other callers of `processText`; step 5 says where the new checkbox sits when the word also offers spot reconstitution. Lines r2 adds or moves were read by the desk on `Shane` at `7fb9cd30`, 2026-11-12.

r1, 2026-11-11, written by the desk (Opus) from Fable's design review `docs/sessions/review-fable-rhyme-matcher_r1_2026-11-10.md` (PROCEED WITH CHANGES; read in full by the desk 2026-11-11). NOT YET FABLE-REVIEWED. Line numbers were re-read by the desk on `Shane` at `ad90f5a6`; where Fable's numbers (read on `cloud-lane-38`) have moved, this brief gives the new ones.

## Lane

- Branch `cloud-lane-49`, cut from `Shane` at the commit the desk names. Commit and push only that branch; no pull request.
- Take every "before" reading first. No `git stash`, `reset`, `restore`, or `checkout` of files; read old code with `git show <sha>:<path>`.
- Report after each step in `docs/sessions/report-code-rhyme-step<N>_r1_<date>.md`, with a section "What I could not establish". NOT ESTABLISHED beats a complete invented answer.

## What the singer gets

When a poem rhymes an unstressed ‑кий, ‑гий, or ‑хий with an unstressed ‑кой, ‑гой, or ‑хой («высокий» with «глубокой»), Ilya reads the ‑ий as [ʌj], so the pair rhymes, as Grayson asks (p. 302). Tapping the ⟨и⟩ explains why, naming the partner word. A checkbox in the Inspector sets the rhyme aside for that word. Where no rhyme is in force, tapping the ⟨и⟩ of a stage ‑кий explains the stage reading and cites Grayson and Avanesov.

## Rulings that bind this lane

All in `docs/memory/OPEN.md`.
- 2026-11-09 21:09: the rhyme matcher proceeds with Fable's changes (a probe through the engine, chained rhyme groups, inside `processText`, no stored flag); the Inspector note on unstressed ‑кий/‑гий/‑хий ships with the share.
- 2026-11-09 21:11: the partner may be an adjective or a noun (for example «улыбкой»): any unstressed line-final ‑кой/‑гой/‑хой. This replaces Fable's change 4 (adjectival only).
- 2026-11-09 20:53: the era control is closed. Ilya keeps Grayson's stage reading of unstressed ‑кий/‑гий/‑хий; there is no date switch. So the order is: the singer's set-aside, then the rhyme, then the stage default. Fable's "then the date" does not apply.
- 2026-11-11 22:53, 22:54, and 23:05: the three strings below (`OPEN.md`, THE STAGE NOTE ON UNSTRESSED -КИЙ, EN AMENDED AND FR; the checkbox ruling at the end of LICENCES AND ACKNOWLEDGMENTS). The 22:56 ruling of a two-sided switch is replaced by 23:05.

## Strings this lane needs, and their state

All ratified; copy them exactly. French: a no-break space before each colon (OQLF); typographic apostrophe ’.

**Stage note**, process `velar-adjectival` on ⟨и⟩ (ratified 2026-11-11 22:53). Citation: (Grayson, pp. 301–303; Avanesov 1989, p. 660).
- EN: "⟨{char}⟩ is [{ipa}] and the velar before it stays hard: the stage reading of the unstressed ending ⟨-ий⟩, which Grayson calls more appropriate for lyric diction. Avanesov records this reading and the soft one as both literary, the hard one following the older Moscow norm. Where the poem rhymes this ending with an unstressed ⟨-ой⟩, Ilya reads it [ʌj] instead, so that the rhyme holds (Grayson, p. 302)."
- FR: « ⟨{char}⟩ se prononce [{ipa}] et la vélaire qui le précède reste dure : c’est la prononciation scénique de la terminaison inaccentuée ⟨-ий⟩, que Grayson juge plus appropriée à la diction lyrique. Avanesov consigne cette prononciation et la prononciation molle comme toutes deux littéraires, la dure suivant l’ancienne norme moscovite. Lorsque le poème fait rimer cette terminaison avec un ⟨-ой⟩ inaccentué, Ilya la prononce plutôt [ʌj], afin que la rime soit respectée (Grayson, p. 302). »

**R1, the rhyme note**, process `velar-adjectival-rhyme` (ratified 2026-11-11 22:54). Citation: (Grayson, p. 302).
- EN: "⟨{char}⟩ is [{ipa}] here, and the velar before it stays hard, so that the ending rhymes with «{word}». In older Russian verse an unstressed ⟨-ий⟩ after a velar rhymes with an unstressed ⟨-ой⟩, and Grayson gives the rhyme precedence."
- FR: « ⟨{char}⟩ se prononce ici [{ipa}], et la vélaire qui le précède reste dure, afin que la terminaison rime avec «{word}». Dans la poésie russe ancienne, un ⟨-ий⟩ inaccentué après une vélaire rime avec un ⟨-ой⟩ inaccentué, et Grayson donne la priorité à la rime. »

**R2, the set-aside checkbox** (ruled 2026-11-11 23:05): EN "Stage reading"; FR « Prononciation scénique ».

## Steps

**Before each step, read the Amendments section at the end of this brief for that step.**

### Step 0. Read and measure

Run all eight gates and record each count. Read every line this brief cites and report any that has moved. Change nothing.

### Step 1. The engine's `'literary'` value

`EngineConfig.adjectival` is `'stage' | 'modern'` (`packages/phonology/src/engine.ts:27-28`). Add `'literary'`. Under it the velar stays hard (the test at `:1361` becomes "not modern") and the vowel of the ending is `ʌ`, with `exception: 'velar-adjectival-rhyme'` (the branch at `:1522-1527`, which today sets `exception = 'velar-adjectival'` for stage). Edit the existing lines; `engine.ts` is at its ratchet ceiling (2048, `scripts/ratchets.json`), so every line added is paid for in the same file.

Done when «высокий» under `'literary'` is [vɨˈsokʌj] with a hard velar; stage and modern are unchanged; «русский» is unchanged under all three (`engine.ts:518-530`, `:631-634`, per Fable). Tests: a literary block beside the existing stage and modern pins (`notation-edge-cases.test.ts`, `engine.test.ts`).

### Step 2. `rhyme-reading.ts`, a pure module

New file beside `apps/web/src/lib/ne-join.ts`. Input: the lines of a text as words (each with its letters, stress, `stressSource`, `isHomograph`, `pos`, and whether its line ends a stanza) and an injected probe (a function that transcribes one word under a given `adjectival` value). Output: a map from word key to its partner word.

The rule (Fable's findings 1, 3, 6 to 8, with the 21:11 ruling):
1. A trigger is a line-final word ending in unstressed ‑кий, ‑гий, or ‑хий. A partner is a line-final word ending in unstressed ‑кой, ‑гой, or ‑хой, an adjective or a noun.
2. Two line ends rhyme when the trigger, transcribed under `'literary'`, has the same sounds from its stressed vowel to the end as the partner. Stressed [i] and [ɨ] count as one vowel.
3. Within a stanza, line ends that rhyme form a group, chained while each member is within three lines of another. If a group holds a partner, every trigger in it is matched.
4. No match when either word's stress is unknown (`stress < 0` or `stressSource === 'inferred'`, `pipeline.ts:650`, `:666`) or it is a homograph the singer has not resolved (`isHomograph`, `pipeline.ts:733`, unless `stressSource` begins `user-`, `:417`).
5. Only the line-final word changes; the same word earlier in the line keeps the stage reading (Fable finding 7, DESK DEFAULT).

Tests: the case table in Fable's review, finding 13, rebuilt with the real dictionary, with one change: «зыбкий» / «улыбкой» (noun) is now literary (21:11).

### Step 3. Wire it into `processText`

Run the module inside `processText` (`apps/web/src/lib/pipeline.ts:230`; its other callers, `lib/syntactic-break.support.ts:32` and the scout's `tools/n168-frequency-run/frequency-run.run.ts:774`, get the rhyme reading too and need no change), after the overrides and before the engine call (`:805-811`); matched words go to the engine under `'literary'`, all others under the configured value. The partner word travels on the ⟨и⟩ entry's features (`features.word`, which the blurb composer already substitutes; `packages/blurb/src/composer.ts`, `:349-359`, `word` at `:358`). `pipeline.ts` is at its ceiling (901): put the work in the new module and pay for any added line.

Done when: typing the pair on two lines shows [kʌj] in Text; MELODY and INSIGHTS show it on a seated song (they receive Lyrics' transcription; Fable finding 6); the pair on one line keeps the default. Tests: Text and MELODY agree on one seated fixture; Reconstitution keeps the pair rhyming; a library pin test runs the matcher over every entry of the built poem file and pins the list of matches (Fable finding 5). Report that list: Fable counted none in the 14 shipped poems and one candidate in the arias; the library now holds 327 entries.

### Step 4. The two notes

- Process `velar-adjectival` on ⟨и⟩ (stage): the stage note above, EN and FR. Today tapping that ⟨и⟩ shows no note: `composeBlurb` (`packages/blurb/src/composer.ts:284`) derives the key `velar-adjectival:и` (`:297`), finds no such process, and returns null (`:341-342`); Fable finding 10. Report what the Inspector draws for that null today, before the change.
- Process `velar-adjectival-rhyme`: R1, with `{word}` the partner.
- `data/blurb-composer.json` (one file; `apps/web/static/data` is a symlink to it); `french-parity.test.ts`; pin each line.

### Step 5. The set-aside

One checkbox in the Spot Reconstitution slot, matching that checkbox (`components/Drawer/InspectorPanel.svelte:1009-1019`, label pattern `:60-64`), labelled "Stage reading" / « Prononciation scénique », drawn only while a rhyme reading is in force on the word. When the word also offers spot reconstitution (`canSpotToggle`), the two checkboxes stack in the slot, spot first (DESK DEFAULT). Ticked, the word takes the stage reading. A new map in `WordMarks` beside `spot` (`text/word-marks.svelte.ts:35`), added to `load`, `maps`, `clear`, and `carry` there (`:38-63`), saved with the song as the other maps are (row 184; the scout lists the save's sites at `library/word-mark-rows.ts` and `word-reset.ts`, read them in step 0), carried through an edit, cleared by the per-word reset. `InspectorPanel.svelte` is 1 line under its ceiling (2431 of 2432). No control forces a rhyme (Fable finding 9).

### Step 6. Close

Merge `Shane`, run all eight gates and Playwright, and write the final report: gate counts against step 0's, the strings added, and the library pin's list.

The GUIDE sentence on the rhyme (Fable's R3) goes into the GUIDE rewrite, not this lane.

## Computations this lane changes (CONTRACT §4)

The vowel of an unstressed ‑ий after a velar, for a matched line-final word. Every site that transcribes reaches it through `processText` or receives Lyrics' transcription (Fable finding 6: `+page.svelte` Lyrics, `witness-lines.ts` Poem, the donor rule in `vowel-resolver.ts` and `underlay-donor.ts`). `clitic-seat.ts`, `poem-join-wire.ts`, and `underlay-seams.ts` count syllables on one unbroken line and are unaffected. The INSIGHTS vowel tally counts the note as [ʌ] where it counted [ɨ] (`vowel-resolver.ts`, Fable's `:334-341`). The desk has not re-read these sites at `ad90f5a6`; step 0 reads them.

## What the desk could not establish

- The Glinka run Fable used for the chain test («дней, глубокой, речей, высокий, людей, далёкий») is from Fable's memory, not a score read; the test stands as a constructed text.
- What the Inspector draws today when `composeBlurb` returns null.

## Amendments from Fable's review, part of this brief

Source: `review-fable-three-briefs-r2_r1_2026-11-12.md` (Fable, 2026-11-12; 10 amendments), filed beside this brief. Applied by the desk as written, DESK DEFAULT on each, except where marked. **Where an amendment and a step's text disagree, the amendment wins.** Numbers are Fable's. Each names the step it changes.

1. **Step 4: both notes are standalone.** The composer prints a letter's identity sentence before a process unless the process is marked `standalone` (`packages/blurb/src/composer.ts:384-388`). The identity of ⟨и⟩ says it "usually sounds like /i/; in sung Russian, neither stress nor position reduces it" (`data/blurb-composer.json`, `identities.и`), which contradicts both notes. Both ratified notes open with their own "⟨{char}⟩ is [{ipa}]". Add to step 4: "Both processes carry `\"standalone\": true`, as 65 processes in the file do. Test: neither composed note contains the identity sentence."
2. **Step 4: how the two citations are stored.** A second source rides after ` + ` in a process's `citation` (`composer.ts:110-117`, `:140`; one process does this today, `regressive-dental-dp-differs`). Add: "Stage note: `\"citation\": \"pp. 301–303 + Avanesov 1989, p. 660\"`, which prints (Grayson, pp. 301–303; Avanesov 1989, p. 660). R1: `\"citation\": \"p. 302\"`. Pin both printed citations."
3. **The French colon in the stage note.** The brief's literal, and `OPEN.md:3686`, hold a plain space in « reste dure : c’est ». The blurb file has 43 no-break spaces before colons and no plain one. Under the French stage note, add: "The space before the colon is U+00A0; write it as `\u00a0` in the JSON, and pin it."
4. **Step 5: the checkbox shows while a rhyme is found, ticked or not.** As written ("drawn only while a rhyme reading is in force on the word"), ticking the box ends the rhyme reading, the box vanishes, and the singer cannot untick it. Replace that clause with:
   > drawn on every word the matcher matches, ticked or not. The match is computed before the set-aside is applied and rides on the word (a new optional field on the word's data, `types.ts`, holding the partner), so the Inspector can draw the box for a word that reads stage because the singer said so. A set-aside trigger still links its rhyme group. Test: tick, the reading is [kɨj] and the box is still drawn and ticked; untick, [kʌj] returns.

   This reads the 23:05 ruling ("shown only on a word with a rhyme reading in force") as "a word whose rhyme Ilya found". DESK DEFAULT.
5. **Step 5: how the set-aside reaches `processText`.** Add: "`ProcessTextOptions` (`types.ts:172-185`) gains the set of set-aside word keys. Three calls pass a witness's marks and pass this too: `+page.svelte:444-447`, `:1806-1809`, and `text/witness-lines.ts:29-33` (whose `WitnessMarks`, `:20-23`, gains the map). `+page.svelte` is 5515 of 5534."
6. **Step 5: the save's trap.** `mapsFromRows` ends in a bare `else spot.set(…)` (`library/word-mark-rows.ts:163-166`), so a new kind added to `MARK_KINDS` (`:38`) would be loaded into `spot`. Add: "Make that `else` name `spot`, and give the new kind its own branch there, in `validValue` (`:56-71`), and in the row writer (`:125-136`). An older build drops a row of a kind it does not know and keeps the rest (`:94`); test that. The per-word reset is `lib/word-reset.ts` (`:21`, `:31`, `:57`), not under `library/`."
7. **Step 5: paying for the Inspector, and the usual case.** `InspectorPanel.svelte` is 2431 of 2432, and a second checkbox costs about ten lines. A matched word reads [ʌ], which Reconstitution turns to [ɑ], so `canSpotToggle` (`InspectorPanel.svelte:67-69`) is true for nearly every matched word: two boxes is the usual case, not the rare one. Add: "Move the slot's contents (`:1009-1020`) into a small component that takes the boxes to draw, so `InspectorPanel.svelte` does not grow. Capture the Inspector with both boxes at 390 px and at desktop width, EN and FR, for the desk." The label's key is Code's to coin; pin both strings.
8. **Step 2: what is compared, and what is printed.** Add to rule 2: "Compare the engine's output, before any notation preference (ʌ or ə) and before Reconstitution." Add to step 3: "`features.word` is the partner's `cleanWord` as typed, without punctuation."
9. **Step 3: the library pin is read before it is accepted.** The library has grown from 14 to 327 entries of mostly nineteenth-century verse, so matches are likely. Add: "For each match, report the two lines, the poem's title, and both transcriptions. The desk reads each pair before the lane merges."
10. **Computations: one more site, and one known limit.** Add `+page.svelte:444` (the derived poem) to the list of sites that reach the reading through `processText`; `underlay-seams.ts:59` belongs with the one-line sites. Add: "Where Poem has verse lines and Lyrics does not, Poem shows [kʌj] and Lyrics, MELODY, and INSIGHTS show [kɨj] (Fable's review, finding 6, last bullet). Left as is for the share; do not build a carriage for it."
