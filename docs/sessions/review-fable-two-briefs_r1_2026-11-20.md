# Review of two Code briefs: lane 78 (blank states) and lane 76 (threshold and no borrowing)

r1, 2026-11-20, by Fable. Tree read through the device bridge: `Shane` `47bd5c5c2979fbe56bac2a77dea813f9963c111c` (`git --no-optional-locks --no-pager log -1 --format=%H`), as expected. Working tree: `INBOX.md`, `OPEN.md`, `QUEUE.md`, and `STATE.md` modified and uncommitted; both briefs untracked. Brief md5s: lane 78 `31c3b3e4`, lane 76 `779a4569`; companion `a8875d7e` (matches the brief). Paths are relative to `apps/web/src/lib/` unless they begin with `apps/`, `packages/`, `tools/`, `scripts/`, `routes/`, `e2e`, or `docs/`. No test and no browser was run; every "breaks" here is read from source.

## 1. Verdicts

- **Lane 78, blank states: DO NOT SEND.** Three blockers. Two are the desk's to close in an r2; one needs one sentence from Dann, in English and French.
- **Lane 76, threshold and no borrowing: DO NOT SEND.** Four blockers. All four can be closed by the desk in an r2; one of them rests on a ruling the desk recorded and the brief contradicts.

Nothing either brief asks for is already built: no blank-state component and none of the ratified blurbs are in the tree (grep for `BlankState`, "marks your own resonances", "Set up your voice"), `PERSONAL_CORE_MIN` is 5 (`voice/engine/sung.ts:40`), and no tier on a synthesized value exists (grep over `voice`, `insights`, `analysis`, `components`, `packages`).

## 2. Blockers

### Lane 78

**78-B1. The brief names as its authority a file that still carries the rule the brief strikes, and says that file wins.** The companion's section 2 reads "The ask names only what stops the page drawing at all", under RATIFIED 09:17, with the four-row table built on it (`docs/sessions/ratified-blank-state-blurbs_2026-11-19.md:27-39`). The brief strikes that wording (brief `:24`) and also says "the companion wins over this summary" (`:19`), and step 3 tells Code to give the table "with its rows as the companion's §2 table has them" (`:54`). The companion is byte-identical to the file the delta review read (md5 `a8875d7e`), so that review's edit 12 was not applied. The 09:35 wording exists only in brief r2, which this brief tells Code not to read, and in `STATE-archive.md:1198`. Close it by correcting the companion's section 2 before the brief goes, and by giving the state table in the brief (amendment 78-A6).

**78-B2. The third form of the ask has no place to go, and the brief's reason for dropping r2's blockers is false.** The brief says both r2 blockers that needed Dann were about row 167 (`:5`). Blocker C of the delta review was not: it was MELODY with a score and no voice, where the rule and the code disagree, and its question to Dann (whether the page asks for the voice there, and whether the score still draws) has no answer in `INBOX.md` or `OPEN.md`. The brief still requires "the three forms of the ask, on MELODY and INSIGHTS both" (`:48`). "Voice missing, score ready" is not a blank page on either: MELODY draws the score with the withheld statement (`markup/MarkupPane.svelte:831`, `:1015`), and INSIGHTS draws its withheld list (`insights/InsightsPane.svelte:328-341`). No step says where the ask appears on either, and Done-when counts six screens, which is the no-score pages only. Recommended close, the desk's to take: limit the lane to the no-score pages and say so. Replacement for brief `:48`:

> - The ask, on MELODY and INSIGHTS: **score missing** and **both missing**. The third form, voice missing with a score loaded, is not built in this lane: that page is not blank on either pane (`markup/MarkupPane.svelte:831`, `:1015`; `insights/InsightsPane.svelte:328-341`), and what it shows is still Dann's to rule. Its two ratified strings enter `i18n.ts` with the others so the three forms sit together. **TEXT keeps one ask.**

**78-B3. MELODY's NOTES needs a sentence nobody has ratified, and four NOTES bodies are left to Code.** "Nothing in this lane is owed to Dann" (`:9`) does not hold.

- One provisional vowel. The tree's sentence is directional and cannot stay ("...anytime through the DRAWER on the left", `i18n.ts:1505`). The companion ratifies only the plural, "are provisional; set them in VOICE." and « sont provisoires; réglez-les dans VOIX. » (companion `:66-67`, `:100-101`). The singular is in neither language. The delta review raised this as For Dann's eye item 4 and nothing has ruled it since.
- A type chosen and nothing sung, on MELODY. Today that state draws `profile.emptyState` (`MarkupPane.svelte:1113`), which this lane retires. No ratified MELODY line says the page draws from published values. The title line already does (`profile.subtitlePlaceholder`, `i18n.ts:1489`), so NOTES can carry nothing here with no new string, but the brief has to say so.
- No provisional vowel. `profile.provisional.noneMessage` (`i18n.ts:1501`) is all direction; the brief does not say it retires.
- `profile.lede` (`i18n.ts:1500`, "MELODY will appear here after Ilya processes the score you upload."). The blurb and the ask replace it; the brief does not say it retires.
- `insights.method.noScore.none` (`i18n.ts:1908`). The companion's table gives no NOTES for a page with no voice and the line repeats the ask; the delta review's edit 9 asked the brief to say whether it draws, and the brief does not.

The last four the desk can settle with no new wording (amendment 78-A6). The first needs Dann: section 6, item 1.

### Lane 76

**76-B1. Merged alone, the lane puts untrue sentences on a singer's page and takes the published values away with no way back.** "No string moves in this lane" (`:86`) holds only by leaving these in place after the lane has made them false. Fable's review of the synthesis brief made the same finding as its blocker 4 this morning; this brief repeats the fault.

- `calib.pane.belowCore` and `belowCoreOne` (`i18n.ts:1445-1446`), on the VOICE pane and on MELODY with no score (`markup/profile-status.ts:39`): "Ilya needs at least 5 stable fry samples. Until you provide {m} more, unsampled vowels are assigned placeholder values." `{m}` is `PERSONAL_CORE_MIN` minus the stable count (`analysis/placeholder-line.ts:55`). With five stable, step 1 makes it read "You have sampled 5 of the 6 core vowels... needs at least 5... Until you provide 1 more". Step 2 makes its last clause false at every count.
- `placeholder.line.belowCore`, `belowCoreOne`, and the two `markup` forms (`i18n.ts:2065-2066`, `:2072-2073`): the same two faults, plus "Findings that rest on a placeholder are drawn dashed" when no placeholder is left.
- Step 3 makes "You have sampled {n} of the 6 core vowels so far ({vowels})" undercount, because `stableCore` feeds it (`placeholder-line.ts:54-58`, `components/Drawer/voice-pane.ts:58`, `routes/+page.svelte:4187`) and would drop a vowel she did sing.
- `e2e/melody-no-score-count.test.ts:33` and `markup/profile-status.test.ts:27`, `:36`, `:42` pin those sentences with their counts, so "move them with it" (`:75`) means pinning a sentence that contradicts itself.
- A singer with one to five core vowels today has ten values; after step 2 she has only what she sang, and the one-tap return to the published profile is lane 77.

Replacement for brief `:86`:

> - No string moves in this lane, in either language. **The lane therefore makes these sentences untrue and leaves them: [the list above].** It reaches `Shane` only together with lane 77 and the wording round's replacements for them, never ahead. Its branch is built, reviewed as built, and held.

**76-B2. The borrowing line becomes false, and this one the lane can repair with no new string.** `borrowingLine` draws for a borrowing type whenever the voice is not personal (`analysis/placeholder-line.ts:113`), and its own comment grounds that in the fill step 2 removes (`:100-103`). After step 2 a contralto who has sung one vowel still reads "Ilya is using its mezzo-soprano values until you sample your own vowels in VOICE" (`i18n.ts:2052`) with no mezzo-soprano value in her set. Add to step 2:

> - `analysis/placeholder-line.ts:113`: the borrowing line draws only while nothing is sung (`!Object.values(formants).some(isSung)`), not while the voice is not personal. Rewrite its comment at `:100-103`. No string changes.

**76-B3. The brief contradicts the desk's own record of the 02:15 ruling.** `INBOX.md:954` records ruling (1) as: Ilya synthesizes [ɨ], "a sample supersedes it, and a sample Ilya cannot read steadily does not, with Ilya saying which of the two it is using", from Dann's "A sample is always best, but a bad sample is no good." The brief's section 6 says the opposite as a thing that must not change: "A sung reading is never displaced, demoted, or discarded by anything in this lane" (`:83`), and the code agrees with the brief today (`voice/engine/resolve-values.ts:119-120`, `isSung` at `voice/engine/sung.ts:14-15` ignores confidence). That clause of the ruling is not in `OPEN.md` either. The brief has to say which it builds. If the lane keeps today's rule, say so in section 2 and record the clause in `OPEN.md` as not yet built; section 6, item 3.

**76-B4. A vowel she sang with no usable second resonance still gets one filled, by a path the brief does not name.** The ruling: Ilya invites the retake "and fills nothing" (`docs/memory/OPEN.md`, "A VOWEL WITH NO STABLE SECOND RESONANCE"). Step 2 deletes the stand-in rule for it and says "That resonance stays empty" (`:55`). For a hard vowel the synthesis loop fills each resonance separately (`resolve-values.ts:134-141`): a sung [ɨ] with no usable fR2 keeps her fR1 and takes a synthesized fR2, `fR1Source` `'sung'` beside `fR2Source` `'derived'`. Add to step 2:

> - `resolve-values.ts:130-142`: a vowel with a sung first resonance takes nothing from the synthesis loop (`if (fR1Source[vowel] === 'sung') continue;`). Its second resonance stays empty until she sings it again, as for a core vowel.

## 3. Amendments

### Lane 78

**78-A1.** Brief `:5`. Lane 71 is `496047c0` and lane 74 is `c8ced58f`; `47bd5c5c` is the merge of lane 75. Replace "(`c8ced58f`, `47bd5c5c`)" with "(`496047c0`, `c8ced58f`)", and replace the sentence on blockers with: "Two of r2's three blockers concerned QUEUE row 167. The third, MELODY with a score and no voice, is still open and is outside this lane (step 2)."

**78-A2.** Brief `:50`. `i18n.ts:1500-1502` is stale by two lines and now lands on `profile.lede` and the directional `profile.provisional.noneMessage`. Replace with: "**`i18n.ts:1502-1504` (`profile.statusSetPlain`, `profile.statusSetMeasuredSingular`, `profile.statusSetMeasuredPlural`) win over the companion's `:66` where they differ.**" The companion's own line numbers are stale the same way (its `:1502` is `:1504`, `:1504` is `:1506`, `:1499` is `:1501`, `:1503` is `:1505`, `:1514` is `:1516`, `:1902` is `:1904`, `:1904` is `:1906`, `:2081` is `:2086`); name keys beside them.

**78-A3.** Add the ratchets, which r2 carried and r1 lost. `markup/MarkupPane.svelte` is 1349 of 1349 and `insights/InsightsPane.svelte` is 677 of 677; `routes/+page.svelte` is 5532 of 5534 (`scripts/ratchets.json:16`, `:18`, `:8`; `wc -l`). Add to step 1:

> - **One component, rendered by all three pages**, so they cannot drift again; the desk's name is `components/Paper/BlankState.svelte`. Two panes are at their ceilings and `+page.svelte` has two lines, so new props are appended to existing lines there and no new handler function is added. Report every touched file's ratchet before and after.

**78-A4.** Brief `:41`. Name the squircle: `insights/InsightsPane.svelte:622-630` (12 px radius, 1 px border, padding `16px 26px`), whose border is hard-coded `var(--rose)`, so the accent becomes a parameter per page.

**78-A5.** Step 4, links.
- Cite the lines the claim rests on (`CONTRACT.md` §0): `routes/+page.svelte:1660-1668` (`openVoice`; `:1666-1667` enters the takeover), `:1677-1681` (`leaveThen`), `:1694` (the band reveal).
- Restore r2's two rules: matching is case-sensitive and walks the line by position. « Établissez votre voix dans VOIX » holds both "voix" and "VOIX"; the keys are `group.scoreMarkup` (`i18n.ts:163`) and `group.input` (`:168`).
- "POEM, LYRICS as they appear" is new in r1, names no destination, and no handler exists for either. POEM and LYRICS are views inside INPUT, not sections. Replace brief `:58` with: "Every section named in a blurb or an ask is a link: INPUT and VOICE. POEM and LYRICS are views inside INPUT and are not links (DESK DEFAULT)."
- Say that the two links under NOTES stay as built (`insights/SingerBlock.svelte:178-182`), which the delta review's edit 7 asked for.

**78-A6.** Give the state table in the brief, as the delta review's edit 6 asked. The desk's to confirm; no row needs a new string except the one in 78-B3:

| Page, no score | Voice state and its test | Ask | NOTES |
|---|---|---|---|
| MELODY | none: `!adapted.completeness.formants` (`MarkupPane.svelte:831`) | both missing | none |
| MELODY | a type chosen, nothing sung: `adapted.generic` | score missing | none; the title line says whose values (`i18n.ts:1489`) |
| MELODY | sung, not yet complete: `!isPersonal(formants)` | score missing | `calib.pane.belowCore` through `statusLineFor` (`markup/profile-status.ts:39`) |
| MELODY | complete | score missing | the status line (`i18n.ts:1502-1504`), then the provisional sentence if any vowel is provisional |
| INSIGHTS | none | both missing | none; `insights.method.noScore.none` no longer draws |
| INSIGHTS | a type chosen, nothing sung | score missing | `insights.method.noScore.generic` (`i18n.ts:1907`) |
| INSIGHTS | sung | score missing | `insights.method.noScore.samples` (`i18n.ts:1906`) |
| TEXT | none | its one ask | none |

Retire with it: `profile.lede`, `profile.provisional.noneMessage`, and `insights.method.noScore.none`, beside the three the brief names.

**78-A7.** Brief `:66`. `'loading'` has been handed to Code three times. State it: "`'loading'` draws `dict.loading` alone in the squircle, roman, with no ask; `'quiet'` draws nothing, as today (`one-action.ts:150`, `:166-173`)." DESK DEFAULT.

**78-A8.** Done-when 2 says "the same vertical place", which step 1 has already ruled out where headers differ. Replace with: "each show one squircle centred in its own page's window, with any difference between the three midpoints reported".

**78-A9.** Say where NOTES sits. The companion keeps the heading "as INSIGHTS already draws it" (`:22-23`), which is unboxed; the brief is silent on whether NOTES is inside the squircle or under it, and whether it is centred with it. Section 6, item 2.

**78-A10.** Step 5's "No blank state prints" is r2's DESK DEFAULT with the label removed. Mark it DESK DEFAULT, Dann's to overrule.

**78-A11.** Tests. Name the two files both lanes change (section 5), and add: "Any fixture that needs a complete profile uses all six core vowels, each with a second resonance, so it survives lane 76." Restore r2's list of the tests this lane breaks (r2 step 6), which r1 replaced with one general sentence.

**78-A12.** Comments that cite superseded rulings and have to be rewritten with the 2026-11-19 ruling: `markup/MarkupPane.svelte:1184-1189`, `:1211-1213`, `:1236-1251`; `one-action.ts:153-163`; `e2e/core-loop.test.ts:45-46`.

**78-A13. For the desk, not for Code.** The blank-state ruling has no home in `OPEN.md` (grep for "blank state" finds only `:4248`), against `README.md`'s closing step 2. The companion says Dann's words are in `INBOX.md` under 08:45 to 09:17; `INBOX.md` has no entry between 2026-11-19 00:08 and 11:55.

### Lane 76

**76-A1. Before sending.** The lane is cut "from `Shane` `47bd5c5c`" and names `OPEN.md` with the 15:4x amendment as the design's home (`:18`). That amendment is uncommitted. At `47bd5c5c` the same section says the asked-for set is seven and [ɨ] is "asked for, never invented". Cut from the commit that carries the amended `OPEN.md`, or paste the amendment into the brief.

**76-A2. Line corrections,** none of which changes a claim: `sung.ts:25-29` is `:26-30`; `sung.ts:21` is `:18`; `resolve-values.ts:131` is `:130`; `resolve-values.ts:155-157` is `:154-157`; `stand-ins.ts:29-31` is `:24-26` (`:28-30` is step 5, a different rule); `Provenance` is `stand-ins.ts:39`, not `:46`; `derivations.ts:22-25` is `:20-26`; `resolve-values.ts:36-39` is `:37-38`.

**76-A3. Step 0 cannot answer its question from a cloud lane.** The only capture set the repository tracks is synthetic (`tools/n200-score/__golden__/path-600.json`, 600 synthesized takes). Real captures are in Dann's Downloads, which a cloud lane cannot reach. I counted them through the bridge: his two capture archives of 2026-11-15 and 2026-11-17 hold 22 readings with a first resonance (13 core, 9 of the four), and none lacks a usable second resonance. One voice, a bass, in fry. Replace step 0's first sentence with: "The desk has counted Dann's own stored captures (0 of 22 lack a usable second resonance; one voice). Count the same over the synthesized set at `tools/n200-score/__golden__/` and report it as synthetic. No treble voice has been counted, and the report says so."

**76-A4. Step 2, name the readers.** "Find them all" is right, and these are the ones I found, with what each does with a gap today:

- `voice/chart/zones.ts:121-124`: builds a dot for every unsung vowel from `now.fR1[vowel]` with no guard, and labels anything not `'derived'` as `'surrogate'`. A missing vowel becomes a dot with `undefined` coordinates, which `voice/chart/model.ts:28` feeds to the view's bounds. This is the crash the brief warns of.
- `voice/chart/finish-early.ts:37-38`: decides "work out" against "fills" by whether any source is `'surrogate'`. After step 2 none is once she has sung, so the answer is "work out" for every profile, including one whose missing vowels are core. **This is a silent break the brief does not name.** It reaches the screen only where the voice is personal (`voice/VowelCapture.svelte:282`) and through `routes/+page.svelte:4188` into `components/Drawer/voice-pane.ts:40`, where `calib.pane.fills` becomes unreachable.
- `voice/chart/readings.ts:95-96`: guarded (`!(p.f1 > 0)`), no row.
- `analysis/analyze-score-adapter.ts:131`, then `packages/score-parser/src/overlay-engine.ts:165` and `:231`, `conditions.ts:368`, `modification-engine.ts:66-73`, `insights/comments.ts:164`, `insights/singer-page.ts:196` and `:209`, `insights/key-suggest.ts:291`: each reads one vowel and tolerates a gap by reading. `modification-engine.ts:73` will offer only vowels she has sung.
- `tools/n200-score/lane66-core.ts:132` and `lane67-core.ts:52`: say for each whether it moves or is frozen as a record.
- The control the capture screen shows "from the fifth core vowel" moves to the sixth (`voice/chart/finish-early.ts:11`, `voice/VowelCapture.svelte:280-282`), and so does the far-off [ɨ] note (`voice/outside.ts:37`).

**76-A5. Step 2, the dead branch.** Once `fillStandIns` runs only with nothing sung, its `personal` path never runs (`stand-ins.ts:160-165`, `:184`, `:187`), and header steps 2, 3, and 5 (`:18-30`) are false, as is line 2's "no vowel is ever blank", which `OPEN.md` already calls a desk gloss. Tell Code to remove the branch and rewrite the header, and to leave `tractScale` exported (`:122`), since the synthesis lane will want it.

**76-A6. Step 3, one predicate.** The test of a usable second resonance already exists three times with two meanings: `resolve-values.ts:95` and `voice/outside.ts:39` (positive and not `'absent'`), and `derivations.ts:80-82` (positive only). `analyze.ts:95` can return `'absent'` beside a number. Have all three read the exported predicate.

**76-A7. Step 4, where the tier travels.** INSIGHTS and MELODY read `VoiceProfileSnapshot`, not `ResolvedValues`, and that type is in another package with its own copy of the three provenance words (`packages/score-parser/src/analysis-types.ts:69`, `:72`), which section 4's search did not reach. Say whether the tier is carried into the snapshot in this lane.

**76-A8. Step 5.** The list of sites is complete: the literals 1.365 and 0.67 occur in source only at `derivations.ts:21`, `:31` and `divergence.ts:22` (grep over `apps`, `packages`, `tools`, `scripts`). Three additions. (a) `derivations.ts` holds 1.365, 1.0315, and 1.15 twice inside itself (`:21-24` and `:31-34`); name each constant once and have `expectedF1` and `derive` both read it. (b) The callers that are not copies: `stand-ins.ts:185`, `plausibility.ts:219`, `tools/n200-score/fidelity-set.ts:55`, `tools/n168-frequency-run/frequency-run.run.ts:180`. (c) For the agreement test of step 6: `derive` rounds to a tenth (`:36`) and `divergence.ts` does not, and the two gate differently (`divergence.ts:6-8` refuses a provisional anchor; `derivations.ts:80-82` accepts one). State a tolerance and use anchors both accept.

**76-A9. Step 6, name the tests.** `voice/engine/sung.test.ts`, `resolve-values.test.ts`, `analysis/analyze-score-adapter.test.ts`, `adapter-golden.test.ts` (regenerated on purpose, with the changed rows reported), `placeholder-line.test.ts`, `components/Drawer/voice-pane.test.ts`, `markup/profile-status.test.ts`, `voice/chart/finish-early.test.ts`, `e2e/melody-no-score-count.test.ts`, `tools/n200-score/lane66-core.test.ts`.

**76-A10. Say what does not change.** The four formulas stay as they are in this lane. `OPEN.md`'s fill-rule table still reads, for [ɪ], "Ilya uses her [e] and the constant is dropped", and the 15:4x amendment says only its [a] and [ɨ] rows are superseded. A reader of both finds a departure unless the brief says the method belongs to the synthesis lane (QUEUE row 197).

**76-A11.** The one-tap return to the published profile needs an engine switch, since `generic` requires nothing sung (`resolve-values.ts:155`). Say it is lane 77's, so Code does not build one.

## 4. The citation audit

### Lane 78

| Citation | Finding |
|---|---|
| `components/Paper/TitlePage.svelte:127` | True. |
| `:128-129`, the two strings by `isMobile` | True; `:128` is the `'enter'` test, `:129` draws. |
| `:130-131`, `dict.loading`; `'quiet'` draws nothing | True (`one-action.ts:150`). |
| `:175`, `:210` | True (`:175-188`, `:210-212`). |
| `markup/MarkupPane.svelte:1092`, `:1093`, `:450`, `:1113`, `:1197`, `:1190`, `:1056` | All true. |
| `insights/singer-blocks.ts:382-385`, `:377` | True (the function closes at `:387`). |
| `insights/SingerBlock.svelte:88-90`, `:172`, `:63`, `:90` | All true. |
| `i18n.ts:1500-1502` | **Stale.** The three status lines are `:1502-1504` (78-A2). |
| Companion `:66` | True. |
| Companion md5 `a8875d7e` | True. |
| `c8ced58f`, `47bd5c5c` as lanes 71 and 74 | **Wrong** (78-A1). |
| "Both of r2's blockers that needed Dann were about row 167" | **False** (78-B2). |
| "Every English and French string it needs is ratified there" | **False** (78-B3). |
| "What remains of that review is its thirteen edits, applied here" | **False for four of them**; see the table that follows. |
| `openVoice` enters the takeover when a voice is saved | True, and uncited: `routes/+page.svelte:1660-1668`. |
| `TITLE_HEADER_GAP` sets the score's window and position | True, and uncited: `MarkupPane.svelte:472`, `:474`, `:795`, `:1004`. |
| Both panes hold `adapted.completeness.formants` | True, and uncited: `MarkupPane.svelte:550`, `:831`; `InsightsPane.svelte:204`. |
| Delta review, section 5 item 5 | True. |
| Dann 2026-11-20 15:41 | True, `INBOX.md:957`. |
| Dann 08:40 to 09:35, 2026-11-19 | Match the companion and r2; not in `INBOX.md` (section 7). |

**The thirteen edits of the delta review, one by one.**

| # | Edit | In the new brief | Defensible |
|---|---|---|---|
| 1 | Correct the `stand-ins.ts` citations | Dropped | Yes; row 167 shipped and the brief cites none. |
| 2 | Readers of `hasPlaceholderProfile`, the per-type table | Dropped | Yes; shipped (`components/Drawer/voice-pane.ts:43`). |
| 3 | `{type}` takes the Tier 1 name | Dropped | Yes; shipped (`analysis/placeholder-line.ts:114`). |
| 4 | The Guide link and anchor | Dropped | Yes as scope; it stays owed in `STATE.md`. |
| 5 | `isGenericMethodKey`; MELODY's NOTES key for a type with nothing sung | First half shipped; second half dropped | **No** (78-B3). |
| 6 | Name the voice test; give the state table in the brief | First half applied; table handed to Code again, on the struck table | **No** (78-B1, 78-A6). |
| 7 | The band reveal; say whether the two NOTES links stay | First half applied; second dropped | **No** (78-A5). |
| 8 | Do not touch `TITLE_HEADER_GAP`; report header differences | Applied | Done-when 2 still disagrees (78-A8). |
| 9 | Tree wins over companion `:66`; correct the companion; say whether `.none` draws; `profile.emptyState` retires | Applied with a stale citation; `.none` dropped | **Partly** (78-A2, 78-B3). |
| 10 | No-print reaches the no-score pages only | Applied | Yes. |
| 11 | The tests row 167 breaks | Dropped | Yes; shipped. |
| 12 | Record the 09:35 rule in the companion | **Not applied** | **No** (78-B1). |
| 13 | State what `'loading'` does | Handed to Code again | **No** (78-A7). |

### Lane 76

| Citation | Finding |
|---|---|
| `voice/engine/sung.ts:40` | True. |
| `sung.ts:25-29`, `stableCore`; fR2 takes no part | True at `:26-30`. |
| `sung.ts:21`, `CORE_VOWELS` | True at `:18`. |
| `resolve-values.ts:131`, the synthesis gate | True at `:130`. |
| `resolve-values.ts:155-157`, the `anySung` term | True at `:154-157`. |
| `stand-ins.ts:21-22` | True. |
| `stand-ins.ts:29-31`, step 3 | True at `:24-26`; the cited lines are step 5. |
| `derivations.ts:29-36`, `:4-6` | True. |
| `derivations.ts:22-25`, flagged single source | True at `:20-26`; the flag is `:13-14`. |
| `divergence.ts:22` | True. |
| `chart/tour.ts:10-12`, `CalibrationWizard.svelte:103-105` | True. |
| `Provenance` at `stand-ins.ts:46` | True at `:39`. |
| `resolve-values.ts:36-39`, `:26-30` | True at `:37-38`, `:25-32`. |
| "No confidence tier exists anywhere" | True by grep. `reading: 'estimated'` (`derivations.ts:36`) and `PlaceholderDot.source` (`chart/zones.ts:65`) are the nearest existing marks. |
| "Every caller already reads the constant" | True: `sung.ts:41`, `analysis/placeholder-line.ts:55`, `components/Drawer/voice-pane.ts:38`. The strings do not (76-B1). |
| Step 5's list of ratio sites | Complete (76-A8). |
| `PRODUCT.md:1269-1273` | True (item 3, `:1270`). |
| Dann 00:48, 00:51, 01:03, 01:04, 02:15 | All match `INBOX.md:935`, `:936`, `:939`, `:940`, `:954`. The brief leaves out the second half of 02:15 (76-B3). |
| `OPEN.md`, the section and the 15:4x amendment | Present in the working tree, uncommitted (76-A1). |

## 5. Scope collisions

No source file is named by both briefs. Two test files are changed by both, so the branches do not merge independently:

- `markup/profile-status.test.ts`: lane 76 moves `:16` and `:25-46` with the threshold; lane 78 moves `:53`, which reads `MarkupPane.svelte` as text.
- `e2e/melody-no-score-count.test.ts`: lane 76 changes its counts and sentences (`:33`, `:37-39`); lane 78 changes the page it reads.

Three collisions of meaning, with no shared line:

- Lane 78 places `calib.pane.belowCore` in MELODY's NOTES; lane 76 makes that sentence false (76-B1).
- Lane 78's fixtures and pictures of "profile set" at five core vowels read "not set" once lane 76 lands (78-A11).
- Both move gate 4's count, so the second to merge re-baselines.

Order: lane 78 first, as `QUEUE.md` already has it. Lane 76 then takes `Shane` into its branch, repairs the two tests, and is held under 76-B1. `i18n.ts`, `MarkupPane.svelte`, `InsightsPane.svelte`, and `routes/+page.svelte` are lane 78's alone, provided lane 76 keeps to "change no caller".

## 6. For Dann's eye

1. **One sentence, both languages (lane 78).** With exactly one provisional vowel MELODY has no ratified line. Assembled from words he has already ratified, as a marked draft: "Your {vowels} is provisional; set it in VOICE." and « Votre voyelle {vowels} est provisoire; réglez-la dans VOIX. » The first half of each is in the tree (`i18n.ts:1505`); « réglez-les » is his of 09:25, here in the singular. Open choice: « réglez-la », agreeing with « voyelle ». His because French is always his.
2. **Where NOTES sits on a blank page (lane 78):** inside the squircle with the blurb, or under it, unboxed, as INSIGHTS draws it today. His because it is layout taste on the screen he reported.
3. **"A bad sample is no good" (lane 76).** The desk recorded that an unsteady take of [ɨ] does not replace Ilya's synthesis; the brief and the code keep her take. His because it is his ruling's reach, and only he can say whether it covers [ɨ] alone or all four.
4. **[a]'s mark (lane 76).** [a] takes the plain mark by desk default, though the desk's own ranking of 01:43 calls it the most exposed of the four. Already flagged as his to overrule; listed so it is not lost.

Not for him now: MELODY with a score and no voice (78-B2), if the desk takes the deferral.

## 7. What I could not establish

NOT ESTABLISHED beats a complete invented answer.

- **Dann's verbatim words of 2026-11-19, 08:40 to 09:35.** Not in `INBOX.md`. The 09:35 rule, the fragment "that is no MELODY's target function", and his 09:13 "anything sampled or any type chosen" reach me only through brief r2 and `STATE-archive.md:1198`.
- **Whether anything here breaks at run time.** No test, gate, or browser was run. The chart's failure on a missing vowel is read from `chart/zones.ts:123` and `chart/model.ts:28`; I did not read `chart/geometry.ts`.
- **How often a singer other than Dann lacks a usable second resonance.** One voice counted, 22 readings (76-A3).
- **Whether the three headers differ in height.** Not measured.
- **Whether MELODY's and INSIGHTS' blank content prints today.** TEXT's does not (`TitlePage.svelte:210-212`); I did not read the other two panes' print rules in full.
- **Whether a positive `f2` beside `f2Quality: 'absent'` exists in any stored profile.** `analyze.ts:90-95` can produce it by reading; none seen.
- **The full list of browser tests lane 76 moves.** I grepped for the sentences and the constant, not for every fixture that builds a five-vowel voice.
- **Whether `tools/n200-score` runs inside the eight gates.**
- **From which commit the lanes will be cut,** and so whether Code will see the amended `OPEN.md` and a corrected companion.
