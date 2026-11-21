# Delta review of two Code briefs, r2: lane 78 (blank states) and lane 76 (threshold and no borrowing)

r2 delta, 2026-11-21, by Fable. Tree read through the device bridge: `Shane` `47bd5c5c2979fbe56bac2a77dea813f9963c111c` (`git --no-optional-locks --no-pager log -1 --format=%H`). **The working tree is not clean:** `ENVIRONMENT.md`, `INBOX.md`, `OPEN.md`, `QUEUE.md`, `SCHEDULE.md`, `STATE.md`, and the companion are modified and uncommitted; both r2 briefs, both r1 briefs, the r1 review, and a lane 77 brief are untracked. md5s read: lane 78 r2 `82ffa8cc`, lane 76 r2 `f652de21`, companion `804f7316`. Paths are relative to `apps/web/src/lib/` unless they begin with `apps/`, `packages/`, `tools/`, `scripts/`, `routes/`, `e2e`, or `docs/`. No test, gate, or browser was run; every consequence here is read from source.

**A correction from the desk arrived mid-review** and is folded in: `docs/memory/OPEN.md`, "THE FILL RULE", now opens with "STRUCK 2026-11-21 01:3x, BY DANN, AND THE DESK WAS WRONG." The state is seven asked for and three synthesized; [a] is asked for and never filled. I read that block in the file. It changes lane 76's premise and is treated in section 4 as items 76-N1 to 76-N5. Lane 78 is touched by it in one fixture line only (78-N7).

Labels of the form 78-N1 and 76-N1 are mine, coined for this review. The r1 labels (78-B1, 76-A4, and so on) are adopted from the r1 review.

## 1. Verdicts

- **Lane 78, blank states: SEND WITH AMENDMENTS.** All three r1 blockers are closed. Seven new items, none a blocker, each with replacement text in section 4. The desk can apply them without another review. It cannot be cut until Dann commits: the brief and the corrected companion exist only in the working tree.
- **Lane 76, threshold and no borrowing: DO NOT SEND r2 as it stands.** The four r1 blockers are closed, and section 0's hold is sound. What stops it is new: the brief is written to six and four, and the record now says seven and three. An r3 that applies 76-N1 to 76-N9 as written needs **no further brief review**, provided one question is answered first (section 6, item 1). If the desk takes my recommended answer as a marked DESK DEFAULT, r3 can go on the desk's own authority, since the lane is built and held and nothing in it reaches a singer.

## 2. The r1 blockers

### Lane 78

| Blocker | Status | Evidence |
|---|---|---|
| 78-B1, the companion carried the struck rule and was named as winning | **CLOSED** | Companion `:133-139`, correction 1, strikes "what stops the page drawing at all" and states the 09:35 wording. Brief `:7` sends Code to that block first; brief `:26` states the 09:35 rule; the state table is in the brief (`:56-65`) and no longer handed to Code. `OPEN.md:4187-4197` homes it. |
| 78-B2, the third form of the ask had no place to go | **CLOSED** | Brief `:9` limits the lane to the no-score pages; `:52` says the third form is not built, carries my replacement text, and enters its strings unread. `OPEN.md:4195` records the question as open and his. The false sentence about r2's blockers is gone from `:5`. |
| 78-B3, an unratified singular and four NOTES bodies left to Code | **CLOSED** | Singular ratified: companion `:141-148`, and `INBOX.md:958` (Dann 2026-11-20 17:17, *"Yes I ratify both"*). The other four are settled by table rows `:59` and `:62` and by step 4's retire list (`:81`). |

### Lane 76

| Blocker | Status | Evidence |
|---|---|---|
| 76-B1, untrue sentences shipped, published values gone with no way back | **CLOSED as a hold; its list is incomplete** | Brief `:7-17` holds the branch unmerged, and Done-when 6 (`:129`) repeats it. The list of sentences misses several: 76-N6. |
| 76-B2, the borrowing line becomes false | **CLOSED** | Brief `:74`, with the comment rewrite at `placeholder-line.ts:100-103`. Its tests are not named: 76-N9. |
| 76-B3, the brief contradicted the desk's record of 02:15 | **CLOSED** | Brief `:33` says the clause is not built and that the lane keeps today's rule. `OPEN.md:4199-4203` records it as ruled and not yet built, with its reach left to Dann. |
| 76-B4, a sung vowel with no usable fR2 still got one filled | **CLOSED** | Brief `:41` states the fault and `:73` carries the repair. |

## 3. The r1 amendments

### Lane 78

| Amendment | Status |
|---|---|
| 78-A1, wrong commit names; false sentence on blockers | Applied by removal (`:5`). Defensible. |
| 78-A2, stale line numbers; name keys | Applied (`:7`, `:61`; companion `:150-152`). **The "tree wins" rule was widened in the process and is now wrong: 78-N2.** |
| 78-A3, ratchets and one component | Applied (`:35`, `:41`, `:46`). |
| 78-A4, name the squircle; accent as a parameter | Applied (`:34`, `:41`). |
| 78-A5, links | Citations applied (`:74`). POEM and LYRICS applied (`:73`). NOTES links applied (`:76`). **The case rule was applied wrongly (78-N3), and the VOICE link is underspecified on a phone (78-N4).** |
| 78-A6, the state table and the three further retirements | Applied (`:56-65`, `:81`). One row drops a sentence the page draws today: 78-N5. |
| 78-A7, state what `'loading'` does | Applied (`:83`). |
| 78-A8, Done-when 2 | Applied (`:111`). |
| 78-A9, where NOTES sits | Applied as a DESK DEFAULT (`:69`), marked as Dann's to overrule. Defensible: it is reversible and follows the companion's `:22-23`. It was item 2 of r1's section 6 and is not repeated here. |
| 78-A10, mark no-print as DESK DEFAULT | Applied (`:85`). |
| 78-A11, the shared test files, the fixture rule, and the list of tests the lane breaks | First two applied (`:98-99`). **The list was dropped** and handed to Code as "name each one you touched" (`:97`, `:120`). Not defensible when the list is cheap: 78-N6 gives it. |
| 78-A12, comments citing superseded rulings | Applied (`:89`), **with one wrong path: 78-N1.** |
| 78-A13, home the ruling in `OPEN.md` | Applied (`OPEN.md:4187-4197`). `INBOX.md` still holds nothing of 2026-11-19 08:40 to 09:35 (section 7). |

### Lane 76

| Amendment | Status |
|---|---|
| 76-A1, cut from the commit that carries the amended `OPEN.md` | Applied (`:3`). **Its stated reason is now half wrong: 76-N1.** |
| 76-A2, line corrections | Applied (`:37-49`). |
| 76-A3, step 0 | Applied (`:59-61`), and marked as not verified by the desk, which is right. |
| 76-A4, name the readers | Applied (`:75-80`). **One reader I missed in r1 breaks silently: 76-N7. And I overstated the `finish-early` break: 76-N8.** |
| 76-A5, the dead branch | Applied (`:77`). |
| 76-A6, one predicate | Applied (`:84`). |
| 76-A7, where the tier travels | Applied (`:92`). |
| 76-A8, step 5's three additions | Applied (`:100-102`). |
| 76-A9, name the tests | Applied (`:106`). Incomplete, and the incompleteness is mine from r1: 76-N9. |
| 76-A10, say the formulas do not change | Applied (`:93`). |
| 76-A11, the one-tap return is lane 77's | Applied (`:119`). |

## 4. New in r2 and wrong

### Lane 78

**78-N1. A path that does not exist.** Brief `:89` cites `components/Paper/one-action.ts:153-163`. The file is `one-action.ts` at the root of `lib/` (`apps/web/src/lib/one-action.ts`; its comment is at `:153-163`). `components/Paper/` holds no such file. Brief `:30` and `:83` cite it correctly. Replace `components/Paper/one-action.ts:153-163` with `one-action.ts:153-163`.

**78-N2. "The tree wins" now reaches strings the lane exists to change.** r1 gave that rule to three status lines. Brief `:7` and companion `:152` state it for every live string. Three live strings differ from the companion on purpose: `insights.silence.noScore` (the tree says "in the INPUT pane" and « dans le volet ENTRÉE »; the ratified ask says "in INPUT" and « dans ENTRÉE »), and `profile.provisional.sentenceSingular` and `sentencePlural` (the tree's directional tails). Read as written, Code keeps the tree's wording for all three. Replacement for the last sentence of brief `:7`, and the same in companion `:152`:

> The tree wins over the companion for these keys only: `profile.statusSetPlain`, `profile.statusSetMeasuredSingular`, `profile.statusSetMeasuredPlural`, `insights.method.noScore.samples`, and `insights.method.noScore.generic`. Every other string a blank page draws is the companion's, and where the tree differs the tree changes.

**78-N3. The case rule contradicts itself.** Brief `:75` says matching is case-sensitive "so a French line holding both « voix » and « VOIX » matches the first occurrence". A case-sensitive match of « VOIX » does not match « voix » at all. Today's mechanism is `text.indexOf(word)` (`insights/SingerBlock.svelte:63`), which is case-sensitive and takes the first match. Replacement:

> - Matching is case-sensitive, so in « Établissez votre voix dans VOIX » the lower-case « voix » is not a link and « VOIX » is. It walks the line by position, so each section name is linked once, where it stands. The keys are `group.scoreMarkup` (VOICE, VOIX) and `group.input` (INPUT, ENTRÉE).

**78-N4. The VOICE link, as specified, does nothing visible on a phone and does not leave the takeover.** Brief `:74` says to use the band reveal "as `leaveThen` does at `:1694`, written inline in the props". `:1694` is the reveal inside `openStation`; `leaveThen` is `:1677-1681`. The working pattern is `openInput` (`routes/+page.svelte:1683-1690`): it goes through `leaveThen`, raises the drawer on a phone (`if (isMobile) drawerRaised = true`), reveals the band, and sets `revealTarget` and `revealRequest` so the Drawer scrolls to what it opened (Dann 2026-11-16 20:13, cited at `:1672`). A bare `sections.reveal` in a prop skips all three. Replacement for the last sentence of `:74`:

> Mirror `openInput` (`routes/+page.svelte:1683-1690`) for the VOICE band: through `leaveThen`, raising the drawer on a phone, revealing `BAND_IDS.scoreMarkup`, and scrolling to the band's head as `openInput` does. If that cannot fit the two lines `+page.svelte` has, report it and stop; do not drop the phone step. Band heads carry `data-band-head={id}` (`components/Drawer/Drawer.svelte:477`), so the target is the VOICE band's id in that attribute; confirm the id's value.

**78-N5. The table's third MELODY row drops the provisional sentence the page draws today.** Today, with any reading, MELODY draws the status line and then the provisional sentence, whatever the profile's completeness (`markup/MarkupPane.svelte:1098-1108`). The table gives the provisional sentence to the "complete" row only (`:61`), so a singer with three vowels, one of them provisional, stops being told. Replacement for the NOTES cell of row 3 (`:60`), DESK DEFAULT:

> `calib.pane.belowCore` through `statusLineFor` (`markup/profile-status.ts:39`), then the provisional sentence if any vowel is provisional, as in the row below

**78-N6. The tests this lane breaks, which r2 again left to Code.** Read by grep for the retired and reworded keys:

- `insights/ratified-lines.test.ts:418-419` pins `insights.silence.noScore` in both languages, and `:425-426` pins `insights.method.noScore.none`. These are ratified-line pins: move the first to the ratified ask, and retire the second citing the companion's table (no voice, no score: NOTES none), which is the ruling that supersedes his 2026-11-16 01:28 line.
- `stand-in-borrowing.test.ts:148-150` asserts `.none` "is still reachable".
- `insights/identity.ts:67` returns `.none` from `methodLineKey`, pinned at `insights/identity.test.ts:87`, `:99`, `:100`. The brief does not say what `methodLineKey` returns once the key is gone. DESK DEFAULT to add to step 4: "`methodLineKey` returns `null` for a page with no score and no voice, and `noScoreBlocks` then emits no notes block."
- `insights/links.test.ts:42`, `:71-78` tests the equality mechanism step 3 may replace.
- `e2e/core-loop.test.ts:45-46`, `:235` and `e2e/singer-paths.test.ts:189` read the retired TEXT and MELODY strings.
- `i18n-index.test.ts`: the hand-written key index at the head of `i18n.ts` states a count per prefix and a total, and fails when either moves. This lane adds and removes keys under `paper.`, `profile.`, and `insights.`, so the index lines and the total move with them.

Add these to step 6 in place of "Name each one you touched", and keep that sentence for any others.

**78-N7. The fixture rule no longer survives lane 76 for certain.** Brief `:98` says a complete profile "uses all six core vowels, each with a second resonance". Under seven and three, whether six core vowels without [a] is a complete profile is not settled (section 6, item 1). Replacement:

> - **Any fixture needing a complete profile uses all ten vowels sung, each with a second resonance**, so it survives lane 76 whichever way the threshold is ruled.

Two smaller points, neither needing a ruling. Done-when 4 (`:113`) says "all six screens" while Done-when 2 asks for three pages at two widths in two languages, which is twelve; say twelve. And brief `:3` cuts from "the `Shane` commit that carries this brief and the corrected companion", which does not exist yet.

**The state table against the tree.** Every test it names is real: `adapted.completeness.formants` (`MarkupPane.svelte:550`, `:831`; `InsightsPane.svelte:204`), `adapted.generic` (`MarkupPane.svelte:552`; `InsightsPane.svelte:292`), `isPersonal(formants)` and `statusLineFor` (`MarkupPane.svelte:945`; `profile-status.ts:34-46`). Every NOTES cell is an existing key or a ratified string: `profile.subtitlePlaceholder`, the three `profile.statusSet*` keys, `insights.method.noScore.samples` and `.generic`, `insights.r2.notes`, `calib.pane.belowCore`, and the provisional sentences of companion `:66-67`, `:100-101`, and `:145-146`. The one gap is 78-N5. The borrowing line is not in the table and need not be: on INSIGHTS it is drawn by the header (`InsightsPane.svelte:503`), which this lane does not touch.

### Lane 76

**76-N1. The brief is written to six and four; the record is seven and three.** Affected lines, with replacements:

- `:3`. The reason given for the cut point is now half wrong: seven is correct. Replace the clause after the colon with: "at `47bd5c5c` that file still says [ɨ] is 'asked for, never invented', which this lane contradicts. Read the block at the head of 'THE FILL RULE' dated 2026-11-21 01:3x before anything else in that section; the 15:4x amendment under it is struck."
- `:21`. "Ilya works out the four hardest" becomes "Ilya works out three, [ɨ], [ɪ], and [ʌ], from her own vowels, and each says so wherever it appears. [a] is asked for and is never worked out."
- `:91`, step 4's table. Replace with: "Add one exported table giving each of the **three** its tier: `ɨ` wider, `ɪ` and `ʌ` plain. Its comment carries his 02:15 words. **[a] has no tier because it is never synthesized for a sampling singer. No third tier exists; do not invent one.**" The desk default on [a]'s tier is deleted, and item 4 of r1's section 6 is withdrawn with it.
- `:108`. "the other three the plain one" becomes "[ɪ] and [ʌ] the plain one, and [a] none".
- `:126`, Done-when 3. Replace with: "A singer with the six core vowels sung and no [a] has nine values: six sung, three synthesized and tiered, and no [a] in any of the four maps. With [a] sung as well she has ten." This sentence depends on section 6, item 1.

**76-N2. Stopping [a] is a change step 2 does not carry, and the obvious way to make it breaks Done-when 4.** Today the loop at `resolve-values.ts:130` runs over `Object.keys(DERIV_SOURCE)`, which includes `a` (`derivations.ts:4-6`), and `derive` builds it at `:34`. If Code removes `a` from `DERIV_SOURCE` or `DERIVE_ANCHORS`, the published profile loses its [a] too: `fillStandIns` builds the four from `DERIVE_ANCHORS` (`stand-ins.ts:181-188`), and [a] is not one of the staff's own six (`BOZEMAN_VOWELS`, `:167`). That contradicts Done-when 4, "unchanged from `Shane`". The guard's window for a sung [a] also reads the 1.15 ratio (`derivations.ts:24`, `plausibility.ts:219`). Add to step 2:

> - `resolve-values.ts:130`: the synthesis loop runs over the three in the tier table, never over `DERIV_SOURCE`'s keys. **[a] is not synthesized for a singer who has sung anything**; it has no entry in any of the four maps until she sings it. **Leave `DERIV_SOURCE`, `DERIVE_ANCHORS`, `derive`, and `expectedF1` as they are** (`derivations.ts:4-6`, `:20-26`, `:29-36`, `:50-55`): the published profile still takes its [a] through `stand-ins.ts:181-188`, and the guard still reads the 1.15 ratio for a sung [a]. DESK DEFAULT, Dann's to overrule: the published profile keeps its [a].

Step 5 stands as written: 1.15 still occurs twice in `derivations.ts`.

**76-N3. `finish-early` now needs a real rule, not a tidy-up.** Brief `:76` tells Code to "decide the test on what is actually missing". Under seven and three that decision has content: with the six core sung and [a] not, `remaining` includes [a] (`voice/chart/finish-early.ts:35`), and both existing captions are false for it ("it can work out the other {m} from them: {vowels}" would list [a]). Replace the last sentence of `:76` with:

> `'work-out'` counts and lists only [ɨ], [ɪ], and [ʌ]. [a] is never listed as worked out. When [a] is the only vowel not recorded, the control is not offered. Say in the report what the screen then says about [a]; the sentence for it is the wording round's.

**76-N4. The capture wizard already asks for seven and calls three challenging** (`voice/CalibrationWizard.svelte:103-104`). So the regrouping `OPEN.md` assigned to lane 77 under six and four is no longer wanted, and the untracked `docs/sessions/brief-code-lane77-six-and-four_r1_2026-11-20.md` carries the struck premise in its name. I did not read it. Section 0 chains this lane to lane 77, so that brief wants the same correction before either merges.

**76-N5. `CORE_VOWELS` and the threshold.** Step 1 sets `PERSONAL_CORE_MIN` to 6 over `CORE_VOWELS`, the six without [a] (`sung.ts:18`, `:40`). `OPEN.md` is of two minds on whether [a] joins the gate: "So the asked-for set is SEVEN... which amends the threshold of six ruled at 00:51", and, under "What it amends", "The threshold moves from five to six". The correction block says the table "stands as written" and does not say which. None of the three formulas reads [a] (`derivations.ts:51-53`). Section 6, item 1. Step 1 cannot be final until it is answered.

**76-N6. Section 0's list of sentences is incomplete.** It names the `belowCore` family. These also become untrue or unreachable, each read at the line cited, each in both languages:

- `capture.hint.placed.typed` and `capture.hint.placed.untyped` (`voice/chart/screen-logic.ts:62-66`): "Ilya has placed {v} from its {borrowed} values for now. Its placeholder moves as you record." Drawn whenever some vowels are sung and the selected one is not. After step 2 no such placeholder exists from the first sample on.
- `capture.hint.toGo` (`screen-logic.ts:67`): "Ilya keeps a placeholder for each until you record it." False from the first sample on.
- `capture.button.placed` (`screen-logic.ts:25`; `voice/chart/VowelSpaceSheet.svelte:116`): the spoken label "placeholder" on every unsung vowel's button and summary row.
- `sheet.legend.placeholder` (`VowelSpaceSheet.svelte:148`): a legend entry for a dot the chart no longer draws once she has sung.
- `sheet.legend.zones` (`i18n.ts:2579`): "The lavender areas mark [ɪ], [ɨ], [a], and [ʌ]: Ilya can work out these four from your samples of the other six". False for [a] under seven and three. `voice/chart/colours.test.ts:18` pins the four sharing one colour; the colour is not this lane's to change.
- `calib.pane.worksOut` and `worksOutOne` (`components/Drawer/voice-pane.ts:60-63`): "Ilya works out the other {m} from your own vowels", where {m} is ten less the count sung and so includes [a].
- `capture.finish.workOut.caption` and `captionLast` (`finish-early.ts:61-63`): the same fault, repaired in behaviour by 76-N3.
- `calib.pane.fills`, `fillsOne`, `capture.finish.useRecorded.caption`, and `captionLast`: no screen reaches them after this lane (76-N8). They are for the wording round to retire.

Replace "six sentences" at `:11` with a count that matches the list, or drop the count.

**76-N7. Chart taps on an unsung vowel's zone die silently.** `voice/chart/tap.ts:50-61` picks the tapped vowel by its sung dot or its placeholder dot, and skips a zone that has neither (`if (!dot) continue`). After step 2 and the `zones.ts` guard, every unsung vowel of a sampling singer has neither, so tapping its zone selects nothing. The vowel buttons still select. I missed this reader in r1's 76-A4. Add to step 2:

> - `chart/tap.ts:50-61`: a zone whose vowel has neither a sung dot nor a placeholder is still tappable; measure the tap against the zone's own centre. Add a test.

**76-N8. A correction to my own r1 amendment 76-A4, which the brief adopted at `:76`.** I called `finish-early` a silent break "including one whose missing vowels are core". No screen reaches that state after this lane: the capture screen offers the control only when `isPersonal` (`voice/VowelCapture.svelte:282`), and the pane tests below-core first (`voice-pane.ts:38`), so wherever the result is drawn every core vowel is already sung. The pure function still answers wrongly for a profile below the threshold, and `finish-early.test.ts:62` pins that case, so the repair stands. Under seven and three the live fault is [a], which is 76-N3. Strike "including one whose missing vowels are core" from `:76`.

**76-N9. Step 6's named tests miss these,** found by grep for the functions the lane changes; the gap is from r1:

- `stand-in-borrowing.test.ts` and `e2e/borrowing-with-score.test.ts`: the borrowing line's draw rule (step 2).
- `voice/engine/stand-ins.test.ts`: `:60` ("fills all ten from zero, one, two, and five sung vowels") and `:152` ("the four derived vowels are still derived from sung anchors") test the branch step 2 removes.
- `voice/chart/zones.test.ts` (`:19` lists [a] among the personal four), `voice/chart/screen-logic.test.ts`, `voice/outside-igh.test.ts`, `analysis/every-sung-reading-counts.test.ts`, `lane67-strings.test.ts`, `lane68-strings.test.ts`.
- **Tests that assume [a] is synthesized:** `voice/chart/finish-early.test.ts:78` (expects `work-out` with `remaining` `['ɪ', 'ɨ', 'a', 'ʌ']`), `resolve-values.test.ts:40` ("all ten values"), `zones.test.ts:19`, `stand-ins.test.ts:152`, and every "six" row of `adapter-golden.test.ts:79`, which loses its [a] on regeneration. `components/Drawer/voice-pane.test.ts` pins the `worksOut` sentences by count.

## 5. Build order and remaining collisions

1. **Dann commits first.** Both briefs, the corrected companion, and the amended `OPEN.md` are uncommitted, and both lanes are cut from the commit that carries them.
2. **Lane 78 builds and merges first,** with section 4's amendments.
3. **Lane 76 r3 builds after,** takes `Shane` into its branch once lane 78 has landed, repairs `markup/profile-status.test.ts` and `e2e/melody-no-score-count.test.ts` there, and is held under its section 0.

No source file is named by both briefs. What remains between them:

- The two shared test files, which both briefs now name (`:99` in lane 78, `:112` in lane 76). Handled by the order.
- Lane 78's table places `calib.pane.belowCore` in MELODY's NOTES; lane 76 makes that sentence false. Handled by lane 76's hold, and only by it.
- Lane 78's fixtures of a complete profile: 78-N7.
- Both move gate 4's count; the second to merge re-baselines.
- Lane 76's hold depends on lane 77 and a wording round, and lane 77's brief carries the struck premise (76-N4). The hold has no end until that brief is corrected.

## 6. For Dann's eye

1. **When she has sung the six core vowels and not [a], does Ilya work out [ɨ], [ɪ], and [ʌ] then, or wait for [a]?** His because it is the threshold he ruled at 00:51 ("six") against the 01:47 text that says seven "amends the threshold of six", and the 2026-11-21 correction does not say which governs. Recommendation: work them out at six and name [a] as still needed, because none of the three is computed from [a]. Cost of that path: one more state for pages to describe, "complete but for [a]". Cost of waiting for seven: one plainer sentence, and three values her own vowels already bound are held back.

Withdrawn, not repeated: r1's item 4, [a]'s mark, which the correction makes moot.

## 7. What I could not establish

NOT ESTABLISHED beats a complete invented answer.

- **Dann's words of 2026-11-21 01:27.** They reach me only through `OPEN.md`'s correction block. `INBOX.md` ends at 2026-11-20 17:17 (958 lines, read to its end).
- **Dann's verbatim words of 2026-11-19, 08:40 to 09:35,** including the 09:35 rewording the companion's correction 1 now quotes. Still not in `INBOX.md`; they reach me through the companion, brief r2 of lane 71, and `STATE-archive.md`.
- **Whether `OPEN.md` still carries the struck 15:4x amendment under the new block.** I read the head of the section after the correction and not the section again in full.
- **The lane 77 brief.** Not read; only its file name.
- **The value of the VOICE band's id in `data-band-head`** (78-N4). The attribute is at `components/Drawer/Drawer.svelte:477`; I did not read `BAND_IDS`.
- **Whether any test fails on an `i18n.ts` key that nothing reads,** which would catch the third ask's unread strings. I found the index-count test and no such test; I did not read every test.
- **Whether the published profile's [a], at 1.15 times the staff's [ɑ], counts as a published value** under the corrected rule. 76-N2 keeps it by DESK DEFAULT.
- **Whether anything breaks at run time.** No test, gate, or browser was run. The tap fault (76-N7) is read from `tap.ts:50-61` alone.
- **Carried from r1 and still open:** how often a singer other than Dann lacks a usable second resonance; whether the three headers differ in height; whether MELODY's and INSIGHTS' blank content prints today; whether `tools/n200-score` runs inside the eight gates; the full list of browser fixtures that build a five-vowel voice.
