# Review, Fable: brief lane 77 r3 (md5 9d1776cc), 2026-11-21

Filed by the Opus desk from the helper's hand-back, 2026-11-21 19:4x. Actual cost 193,929 tokens, 22 tool uses, 7.9 min, against a 260k cap. The helper's own write to `/mnt/user-data/outputs/` did not reach a folder the desk can read; this file is the record.

Read through the bridge on `Shane` `ac4bc6d8`. Both md5s match. No gate run, nothing built. Every `path:line` is a line the reviewer read in this review. Paths are under `apps/web/src/lib/` unless they start with `docs/`.

## VERDICT: DO NOT SEND

The citations are sound. The lane is not: it replaces a sentence no screen reaches and leaves the counting one live, its done-when 2 cannot be met with the nine strings, and four states it creates have no true sentence.

## BLOCKERS

**77-B1. Step 5 and section 6.8 replace the dead key and leave the live one counting.** `components/Drawer/voice-pane.ts:62` picks `calib.pane.fills` only in state `some-fills`, and `calib.pane.worksOut` otherwise. Lane 76 r3 (its line 84) makes the kind `'work-out'` for every profile and says `calib.pane.fills` "becomes unreachable". The live sentence is then `i18n.ts:1447-1448`: "You have recorded {n} of the 10 vowels. Ilya works out the other {m} from your own vowels." `voice-pane.ts:61` computes `m = 10 - i.usable`, so {m} also counts [a]. The ratified 6.8 sentence never draws, and a count toward ten ships.

**77-B2. Done-when 2 cannot be met, and "the wording round is closed" is contradicted by lane 76 r3 section 0.** Code may write no string (brief line 9), and these have no replacement among the nine:
- `capture.count`, `i18n.ts:2588`, "{n} of 10", drawn at `voice/VowelCapture.svelte:297`. The brief never names it.
- `capture.hint.toGo`, `i18n.ts:2639`, "{count} to go ... Ilya keeps a placeholder for each", from `voice/chart/screen-logic.ts:67`.
- `capture.finish.workOut.many` and `.caption`, `i18n.ts:2610-2611`, "the other {m}", from `voice/chart/finish-early.ts:60-63`.
- `capture.hint.placed.typed` and `.untyped`, `i18n.ts:2637-2638` (`screen-logic.ts:62-66`); `capture.button.placed`, `i18n.ts:2645` (`screen-logic.ts:25`); `sheet.legend.placeholder`, `i18n.ts:2578`; `sheet.legend.zones`, `i18n.ts:2579`, which names [a] among "these four".
- `calib.pane.belowCore` and `belowCoreOne`, `i18n.ts:1445-1446`, "{n} of the 6 core vowels ... at least 5", reached at `voice-pane.ts:58` and `markup/profile-status.ts:39`; `placeholder.line.belowCore` and its three siblings, `i18n.ts:2065-2066` and `:2072-2073`, reached at `analysis/placeholder-line.ts:75`.

Lane 76 r3 lines 13 to 24 assign every one of these to the wording round and say the three merge together. Merging on done-when 5 as written ships them.

**77-B3. The branch base cannot build step 3 or two of step 6's tests.** The brief cuts `cloud-lane-77` "from `Shane`". Step 3 hangs on a function lane 76 adds; `cloud-lane-76` sits at `ac4bc6d8` with no lane commit. On `Shane`, `voice/engine/sung.ts:40` is still `PERSONAL_CORE_MIN = 5`, and [a] is still worked out (`voice/engine/derivations.ts:34`, `voice/engine/resolve-values.ts:130`), so the test "six core sung and [a] not sung reads complete, with [a] empty" fails there. Step 4 also edits the lines lane 76 step 2 rewrites (`resolve-values.ts:154-157`).

**77-B4. Step 4's switch is unspecified where a wrong guess is costly, and the contract line is owed (item 7: YES).** The claim itself is verified: `resolve-values.ts:155` is `const generic = !anySung && hasPlaceholderProfile(voiceType);`. The switch changes which fR1 and fR2 every page computes from for a singer who has sung. These sites each decide "her own or published" from the formants alone, and nothing but their agreement keeps one page from showing her values beside another showing the staff's: `resolve-values.ts:154-157`; `sung.ts:41` (`isPersonal`); `voice-pane.ts:38-40`; `placeholder-line.ts:74` and `:113`; `markup/profile-status.ts:39`; `voice/VowelCapture.svelte:282`; `voice/chart/finish-early.ts:36-38`. The brief names none and asks Code to report readers afterwards. Also unsaid: where the choice is stored (lane 76 r3 line 129: "Nothing is written to the stored profile"; a precedent for a stored singer's choice is `useEstimate`, `voice/engine/types.ts:81`), and what a "Not sure" or untyped singer gets, since `hasPlaceholderProfile` is false for her (`voice/engine/stand-ins.ts:92-94`; `resolve-values.ts:151-152`).

**77-B5. With the switch on, no ratified sentence is true, and none names the way back.** `calib.pane.typedGeneric`, `i18n.ts:1432`, ends "until you record your own"; `placeholder.borrowing`, `i18n.ts:2052`, ends "until you sample your own vowels in VOICE". Both are false for a singer who has sung and chosen the published profile. 6.7 gives one control label and one conditional sentence ("would consider"), nothing for the state after the tap, and no label for leaving it (step 4: "she can leave again").

**77-B6. 6.7's sentence contradicts a ratified one for three of the eight types.** `voice/voiceTypes.ts:104-108` and `:126-130`: a contralto would read "the published values for a contralto voice, scaled to the mezzo-soprano staff", against `i18n.ts:2052`, "The field has not yet published resonance values for a {type}". For the five published types `borrowedStaffLabel` returns the type's own name (`voiceTypes.ts:129`), so a soprano reads "for a soprano voice, scaled to the soprano staff". "Scaled" is also open: the tree calls the declared type's values "unscaled" (`resolve-values.ts:145-146`, `stand-ins.ts:24-26`); only the fR2 template is scaled (`stand-ins.ts:14-17`). The words are Dann's, so the ruling is his.

**77-B7. A core vowel she sang that does not count has no true sentence.** After lane 76 step 3, a core vowel with no steady second resonance does not count toward the six; today an unstable one does not (`sung.ts:26-30`). 6.3 would tell her "Ilya has not heard your [o] yet", which is false. 6.6 tells her nothing rests on a retake, while `docs/memory/OPEN.md` (A VOWEL WITH NO STABLE SECOND RESONANCE) says the take "does not complete that vowel". Done-when 3 is unmet for her either way.

**77-B8. No step draws 6.1, and [ɨ]'s wider mark is built nowhere.** Section 2 bullet 1 carries "[ɨ] with a wider uncertainty and [ɪ] and [ʌ] with the plain mark". Steps 1 to 6 never place `calib.vowel.workedOut`, and one string serves all three. Lane 76 r3 line 99 hands what a singer reads to this lane. The design says each "carries a mark wherever it appears"; the only site read that draws a worked-out value is `voice/chart/zones.ts:123`.

**77-B9. The brief says RATIFIED; the record it cites does not show that.** `docs/sessions/draft-lane77-strings_r2_2026-11-21.md` labels the French of items 1, 4, and 9 "(draft)" (its lines 18, 36, 70) and says of items 1, 2, 3, 5, and 8 only that "he did not object" (line 5). Only item 7's verb is marked RULED (line 57). `docs/memory/INBOX.md` has no entry after 2026-11-21 09:34 (line 961). `docs/memory/STATE.md:23` repeats the desk's summary, not his words. **CLOSED by the desk 19:4x: his words of 19:21, 19:23, 19:30, and 19:32 are now transcribed in `INBOX.md`.**

## AMENDMENTS

**77-A1.** Line 3, replace the branch sentence: "Branch `cloud-lane-77`, cut from the built head of `cloud-lane-76`, never from `Shane`. If `cloud-lane-76` is still at `ac4bc6d8`, stop and report."

**77-A2.** Line 5, replace the citation: "(`brief-code-lane76-threshold-and-no-borrowing_r3_2026-11-21.md`, section 0, which lists every sentence it makes untrue)". r3 line 5 says r2 is superseded, and section 0 lists more than six.

**77-A3.** Section 3, add: "`voice/VowelCapture.svelte:158` calls `nextVowel`; `:297` draws `capture.count`; `:338` draws the row in `VOWELS` order (`voice/engine/types.ts:26`: i, e, ɪ, ɨ, ɛ, a, ɑ, ʌ, o, u), which is not `TOUR_ORDER`. `voice/chart/screen-logic.ts:52-69` composes the hint line. `git diff --stat 47bd5c5c ac4bc6d8 -- apps packages` is empty, so no cited line moved."

**77-A4.** Section 3, tour bullet, replace the last two sentences: "On a first walk the tour also passes two unsung buttons, [ɪ] and [ɨ], between [e] and [ɛ], because the row and the tour are ordered differently. Which of the two skips Dann met at 01:20 is NOT ESTABLISHED. 6.2 and 6.4 answer the first; 6.5 answers the second and never draws for the first."

**77-A5.** Step 2, add: "{sung} is the vowels of `TOUR_ORDER` with a reading that lie between the vowel she finished and the one `nextVowel` returns, through `vowelList` (`voice/chart/finish-early.ts:45-52`). With none, the sentence does not draw. Compute it beside `nextVowel`; change nothing inside it."

**77-A6.** 6.3, add: "{vowels} is the members of `TOUR_SEVEN` for which `isSung` is false, in tour order, through `vowelList`. A vowel she sang is never listed, whatever its stability. This sentence replaces `capture.count` at `VowelCapture.svelte:297`." DESK DEFAULT to confirm.

**77-A7.** Step 5 and 6.8, replace "`calib.pane.fills` and `calib.pane.fillsOne`" with "`calib.pane.worksOut` and `calib.pane.worksOutOne` (`i18n.ts:1447-1448`), the keys `voice-pane.ts:62` reaches after lane 76. Mark `fills` and `fillsOne` UNUSED in place. {vowels} is the unsung members of [ɨ], [ɪ], [ʌ]; `voice-pane.ts:61-63` stops computing {n} and {m}." Add a table saying what the pane reads for: six core and nothing else; six core and [a]; six core and the three; ten. 6.8 and 6.9 both apply to the first, and their order is not ruled.

**77-A8.** Section 3, last bullet, strike "and says 'fills' where the design says 'synthesizes'". Section 6.10 bans that word.

**77-A9.** Section 1, strike "three of them called challenging". No reader of `calib.challengingInvite.*` (`i18n.ts:1282-1284`) exists outside `i18n.ts`; the word is an identifier at `voice/CalibrationWizard.svelte:104`.

**77-A10.** Step 6, last test, replace with: "`DEFAULT_VOWELS` and `CHALLENGING_VOWELS` are unexported constants in a component (`CalibrationWizard.svelte:103-104`), so pin them by reading the file's text; `voice/chart/tour.test.ts:7-9` already pins the other three. Do not export or move them."

**77-A11.** Section 6 preamble, add: "The French in this brief is typed with ASCII apostrophes. Write U+2019 in `i18n.ts`."

**77-A12.** Step 4, add after B4 and B5 are ruled: the contract line with the sites of B4; "the control draws only when `hasPlaceholderProfile(voiceType)` is true"; and "the control is one two-state button, so no second label is needed".

**77-A13.** Section 7, replace items 2, 3, and 5 once B2 is settled: "2. `grep` finds no reader of `capture.count`, `capture.hint.toGo`, or any key carrying {n} of a fixed total on a page a singer with a reading can reach; the report lists what remains. 3. With [i] and [e] sung, the capture screen names [ɛ], [a], [ɑ], [o], and [u] and prints no numeral. 5. Merges only with lane 76, after replacements for every sentence in lane 76 r3 section 0 are ratified." Add one item each for steps 2, 3, and 4.

## CITATION AUDIT

| citation | result |
|---|---|
| `CalibrationWizard.svelte:103-105`, the two lists | VERIFIED; lists at 103-104, `ALL_VOWELS` at 105 |
| `CalibrationWizard.svelte:95-102`, the 2026-08-04 comment | VERIFIED. Lines 91-93 still quote the old spec's "the optional three"; a comment, not a string |
| `tour.ts:10-12` | VERIFIED |
| `tour.ts:22-37`, `nextVowel` | VERIFIED; closes at 38 |
| `opening.ts:21` | VERIFIED |
| `tour.test.ts:7-9` | VERIFIED |
| `i18n.ts:1437-1438` | VERIFIED as text; WRONG as the target (B1) |
| `i18n.ts:1447`, « déduit » | VERIFIED |
| `i18n.ts:2052`, {type} and {borrowed} | VERIFIED |
| `resolve-values.ts:155` | VERIFIED |
| `CONTRACT.md` §0.1 | VERIFIED, `docs/memory/CONTRACT.md:9` |
| `OPEN.md`, THE FILL RULE and THE THRESHOLD IS NOT GATED ON [a] | VERIFIED |
| lane 76 r2, section 0 (line 5) | WRONG: r3 |
| draft in `_to_delete/` (line 7) | NOT ESTABLISHED |
| strings record's `sung.ts:19` for `CORE_VOWELS` | MOVED: `sung.ts:18` |

### Checks asked for, items 2 to 8

**Strings against the rules.** None of the nine prints a count, calls a vowel optional, or uses a directional word. No banned word, no em dash, no exclamation mark. Against the design: 6.2 (FOR DANN'S EYE, and B-level if he agrees), 6.6 (B7), 6.7 (B6).

**French, referent checked for each.** 6.2 « seule » with « voix ». 6.4 « Chantez-les » with « voyelles ». 6.6 « stable » with « résonance », « Chantez-la » with « voyelle », « valable » with « échantillon ». 6.7 « publiées » and « ajustées » with « valeurs », « conservé » and « l' » with « tout ce que vous avez chanté ». 6.8 « chantées » with the second « voyelles », through « que ». 6.9 « elle », « vide », « la » with « voyelle », « complet » with « profil ». 6.1, 6.3, and 6.5 need none. All sound. No French string takes a colon; « ; » has no space before it in 6.5 and 6.9. `fillVoiceType` elides « de » only before a vowel letter (`voiceTypes.ts:159`); no staff label begins with one (`i18n.ts:2280-2282`).

**Tokens.**

| token | supplier |
|---|---|
| {x} | `bracket`, `screen-logic.ts:14`; the three come from lane 76's tier table, not in the tree |
| {y}, {z} | `DERIVE_ANCHORS`, `derivations.ts:50-55`: two each for ɨ, ɪ, ʌ |
| {vowels} | `vowelList`, `finish-early.ts:45-52`, Oxford comma in English, none in French |
| {sung} | none in the tree; `tour.ts:22-38` returns the next vowel only (77-A5) |
| {next}, {vowel} | `bracket`; which vowel waits on a retake is lane 76's function, not in the tree |
| {type} | `voiceTypePrint`, `voiceTypes.ts:82`, as `placeholder-line.ts:114` uses it |
| {borrowed} | `borrowedStaffLabel`, `voiceTypes.ts:126`, filled by `fillVoiceType`, `:157` |

`tv` at `i18n.ts:2688` fills named tokens.

**Keys.** No collision. `i18n.ts` holds no `calib.wizard.*`, `calib.published.*`, or `calib.vowel.*` key, and no `calib.pane.completeAEmpty`. The capture screen's own strings live under `capture.*` (`i18n.ts:2587-2650`), so `calib.wizard.*` starts a new family.

**Step 4's home.** This lane. Lane 76 r3 line 130: "do not add an engine switch for it."

**Files both lanes touch.** `voice/engine/resolve-values.ts`, `voice/engine/sung.ts`, `components/Drawer/voice-pane.ts` and its test, `voice/chart/finish-early.ts` and its test, `voice/VowelCapture.svelte`, `voice/chart/screen-logic.ts` and its test, `analysis/placeholder-line.ts`, `markup/profile-status.ts` (lane 78 also, its brief r3 line 106), `voice/chart/zones.ts`. `i18n.ts` is this lane's alone, but `lane68-strings.test.ts:20-21` pins `belowCore`.

**Done-when.** 1 and 4 are observable. 2 cannot be met (B2). 3 names no screen and fails for B7's singer. 5 names a wording round the brief calls closed. Steps 2, 3, and 4 have no condition.

## FOR DANN'S EYE

1. **6.2, "Ilya reads your voice from your voice alone."** `OPEN.md` rules that "by a published proportion" is "never compressed back into 'hers'", and strikes "Not one number on any singer's page then comes from Dann's voice" as false. The three are worked out with constants at `derivations.ts:31-33`. The sentence is the desk's, not his.
2. **6.7** for the borrowing types, and the word "scaled" (B6).
3. **6.6 against his 01:03 ruling** that the take does not complete the vowel (B7).
4. **French, all nine**, since the record marks three as drafts (B9). 6.1 alone writes « votre {x} » where the other eight write « votre voyelle ». 6.6 turns "when you would like to" into « si vous le souhaitez ».
5. **`calib.pane.none` and `calib.pane.all`** (`i18n.ts:1431`, `:1449`) say "ten vowels". Whether naming the ten is a count is his.
6. **Where the published-profile choice is kept** (B4): a stored field is hard to take back.

## WHAT YOU COULD NOT ESTABLISH

NOT ESTABLISHED beats a complete invented answer.

- That Dann ratified at 19:21 to 19:23. Instrument: `grep` of `INBOX.md` for 2026-11-21; nothing after line 961. **Closed by the desk at 19:4x.**
- Which skip Dann met at 01:20 (77-A4). The tree supports both.
- The struck draft in `_to_delete/`. Instrument: `ls` filtered on "77", "six", "wizard"; no match.
- The name and shape of lane 76's waiting-on-fR2 function and tier table. The branch is unbuilt.
- Every site that draws a worked-out vowel to a singer. Only `zones.ts:123` was read.
- Which page is "the page where she meets the gap" in step 4, and whether it overlaps lane 78's blank states. Only lines 60 and 106 of lane 78 r3 were read.
- Whether an i18n key index gate exists and needs the new keys. `grep` for `calib.pane.fillsOne` found it in `i18n.ts` and session documents only.

Terms: none coined. "Dead key" means a key no screen reaches.
