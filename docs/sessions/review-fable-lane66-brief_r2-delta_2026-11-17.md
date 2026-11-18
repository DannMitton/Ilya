# Fable delta review of the lane 66 brief r2

Filed by the desk 2026-11-17 22:0x. The reviewer of r1, resumed with its context; harness count 62,220 tokens for this round (417,770 in all against 355,550 after the first), 9 tool uses, 7.0 min (cap 120k). r2's Step 5 held a guard the desk had designed on the first review's blocker B2. This memo found the guard needed more special cases; brief r3 withdraws it and takes the first review's own prescription (r3, section 8). The amendments that still apply are in r3. The memo, verbatim:

# Delta review of the lane 66 brief, r2

Read only, clone `/home/claude/desk/m65` at `2201330b`. Paths as in the brief. Every code claim carries a line I read this session.

## 1. Verdict

**SEND WITH AMENDMENTS.** Two blockers. As written, Step 5 still lets an outside reading anchor derived vowels, and it leaves three whole-profile flags undefined.

## 2. Blockers

### B1. A second derivation loop reads the outside reading

`fillStandIns` derives the four vowels again from the maps, not through `usableAnchor`: `cap[a] = { f1: m.fR1[a], f2: m.fR2[a] }` (`voice/engine/stand-ins.ts:214-219`). Today the map value of an excluded anchor is its stand-in. After Step 5 it is the outside reading, and with both anchors `'sung'` the result is labelled `'derived'` (`:221-222`).

- Today's golden, "bass | bad i (1063), no override" (`analysis/__golden__/adapter-snapshots.json`, read with Python): [ɨ] is 445.9 / 1101.3 and [ɪ] is 476.6 / 1599.5, both `'surrogate'`.
- By my arithmetic from `voice/engine/derivations.ts:30-31` (not run), r2 as written gives [ɨ] 1451.0 / 1281.2 as `'derived'`, and [ɪ] with fR2 1812.0.
- The existing test `analysis/analyze-score-adapter.test.ts:416-418` would fail on it (its `own` helper at `:31-32` keeps every value that is not `'surrogate'`), and Step 5's tripwire would stop the session.

Change: add `stand-ins.ts:214-232` to Step 5's table. For an anchor in the `implausible` list, the loop uses the fit's rounded prediction for both resonances (the rounding of `:204`, `:209`) and counts it as a stand-in for the source flag. That reproduces today's numbers.

The rest of check 1 holds:
- (a) The pool exclusion gives today's fits for fR1 and fR2, because both pools come from `sungOf` (`stand-ins.ts:195-201`). `retake` is unchanged (`:233-236`; the list is built at `voice/engine/resolve-values.ts:206-208`).
- (c) An outside derived vowel anchors nothing (`derivations.ts:49-54`) and is not in the pool (`stand-ins.ts:197`). With fR1 only, its fR2 is derived as for any sung vowel (`resolve-values.ts:191-194`).
- (e) No vowel can sit in both `implausible` and `offShape`, because `offShape` comes from the pool alone (`stand-ins.ts:160-167`).
- (d) Other readers are per-vowel lookups: `packages/score-parser/src/conditions.ts:368`, `packages/score-parser/src/overlay-engine.ts:165`, `insights/singer-page.ts:196`, `insights/comments.ts:164`. The one cross-vowel loop, `packages/score-parser/src/modification-engine.ts:73`, never changes what prints: the sourced target governs (`analysis/advice-resolver.ts:374-375`). The chart's placeholder dots and finish-early read `resolveVowelValues` (`voice/chart/zones.ts:93`, `voice/chart/finish-early.ts:35`), so they follow B1's fix.

### B2. `anySung`, `generic`, and the run condition are not ruled

`anySung` is "any `'sung'` source" (`resolve-values.ts:209`); `generic` and the decision to run stand-ins hang on it (`:210-212`). After Step 5 a voice whose only reading is outside has `anySung` true. Three things follow.

- **Five types gain nine template values.** A contralto, countertenor, bass-baritone, "Not sure", or no type gets no stand-ins today (`resolve-values.ts:201-205`). They would get the unshifted template: an empty pool returns it (`stand-ins.ts:127`). That breaks "every other vowel exactly as today".
- **The other five types change words, not numbers.** `generic` turns false, so the pages drop "placeholder values for a generic {voiceType}" and print "computed from your calibration" (`insights/identity.ts:41-42`, `:49-52`; `i18n.ts:1872-1873`, `:1877`).
- **A caption turns untrue.** `voice/chart/finish-early.ts:37` reads `anySung` as `anyUsable` and prints "Ilya fills the other {m} from what you have recorded so far" (`:67`). Its own header says that is untrue when the fill is the template alone (`:9-10`).

Change: keep two meanings and name them.
1. "A sung reading Ilya builds on" (today's `anySung`) decides whether stand-ins run and feeds `anyUsable`.
2. "Any sung reading" decides `generic` for the pages. My recommendation is `generic` false, since the per-vowel placeholder lines stay true (`packages/score-parser/src/overlay-engine.ts:231`); mark it DESK DEFAULT.

## 3. Amendments

1. **The golden expectation, with B1 and B2 fixed** (read from code, not run). In the twelve entries: [i]'s two values and two sources; the `i` key moves to third place in the four maps (inserted at `resolve-values.ts:131-135`, no longer in `fillStandIns`); and `standIns.steps` loses `i` (`stand-ins.ts:203-212`). Say all three, or the tripwire fires on the last two.
2. **Sort the test list.** It was written for r1's design.
   - Stays: `voice/engine/plausibility.test.ts:184-200`; `analysis/analyze-score-adapter.test.ts:416-418`; `analysis/stand-ins-snapshot.test.ts:19`, `:103`; `voice/chart/finish-early.test.ts:64-67`.
   - Changes: `analyze-score-adapter.test.ts:111`, `:247`, `:420`; `stand-ins-snapshot.test.ts:17-18`, `:101-102`; `finish-early.test.ts:54-57`, which becomes `work-out` because [o] anchors nothing (`derivations.ts:49-54`); and the three count tests (`components/Drawer/voice-pane.test.ts:44-52`, `components/Drawer/voice-pane-usable.test.ts:10-14`, `voice/profileStore.test.ts:104-115`).
3. **Make "Done when" two invariants in the new tree.** For an outside vowel v in profile P: v's values and sources equal those of P with v kept; every other vowel's equal those of P without v. Run them over the golden grid. They catch B1.
4. **"Set aside" cannot reach zero as defined.** Six of the 582 readings in `tools/n200-score/__golden__/path-600.json` have no fR2, and such a reading never has a sung fR2 (`resolve-values.ts:148`). Count fR2 only where the take read one.
5. **"The design not taken" measures size, not direction.** It is today's kept case, so the runner can compute it now by setting `plausibilityOverride`. Say so. Add, for each moved vowel, whether it lands nearer the set's truth or farther. A cross-type voice is coherently displaced, so entering the fit may help it where the 1063 Hz case harms; Dann needs both to rule on the default. Name the subsets for 1, 2, 3, and 6 vowels.
6. **The folder run has no truth.** Say what it reports without one, and that it uses the sidecar's stored reading. Note also that the runner judges with the whole profile's anchors, where the wizard judges with the anchors held at capture (`voice/CalibrationWizard.svelte:292`).
7. **The pane's sentence.** With the count at one and nothing built on, `calib.pane.fills` (`i18n.ts:1425`) says Ilya fills "from what you have recorded so far", and it does not. Recommendation: the sentence follows the count of readings Ilya builds on, and the door follows the sung count. The words are Dann's to rule.
8. **The note on the judged copy works.**
   - Keep on a reading with no verdict stores the override (`voice/engine/plausibility.ts:328`). `judgeUnchecked` then skips it (`resolve-values.ts:51`), and the note goes quiet (`voice/outside.ts:22`).
   - The wizard has no import from `resolve-values` (`voice/CalibrationWizard.svelte:60-69`), so it gains one line: 1121 of 1126. Owns says "one line"; make it two.
   - The union window contains every type's window (`plausibility.ts:98-110`, `:202-223`), so the typed sentence stays true.
9. **Section 1, item 3.** "Every outside reading" overstates: a reading with no stored verdict is named only when it is outside every type's values (`resolve-values.ts:37-39`). "Now also lets Ilya build on it" misleads: Keep does that today (`plausibility.ts:317-319`).
10. **Section 1, item 2.** "And nothing else" is true of numbers once B1 and B2 are fixed. The count, the door, and INSIGHTS' measured set still change.
11. **Step 2, the address line.** `voice/engine/capture-file.test.ts:174-175` pins `mountRecorderPanel(measurePicker(search))` in `voice/chart/stub-switch.ts`, which is not in Owns. Read the address inside `mountRecorderPanel`.

Steps 1, 3, and 6: nothing r2 broke, at a glance.

## 4. What I ran

Read-only Python on `tools/n200-score/__golden__/path-600.json` and `analysis/__golden__/adapter-snapshots.json`. No test run this round.

## 5. What I could not establish

- The golden's real difference: I cannot change code.
- Whether any seeded e2e store gains a note once the note reads the judged copy.
- Tokens: I cannot see the harness count; my estimate for this round is 60k.

Terms: "two invariants" is mine. The house-style rules in memory shaped the wording; nothing else came from memory, and nothing new is worth saving.
