# Review: lane 69 brief r2, r1, 2026-11-18

Reviewer: Fable 5.2, as a subagent of the Opus desk. Filed verbatim by the desk from the helper's hand-back (the helper returns text in the thread, not a file; `ENVIRONMENT.md`, "A subagent's hand-back arrives as text"). Helper cost: 176,112 tokens, 13 tool uses, 4.7 min, against a cap of 370k and a quoted range of 160k to 370k. The desk re-read every line this review cites, at `Shane` `74579156`, before applying its amendments in brief r3.

---

Reviewer: Fable 5.2. I read the tree, at `$HOME/mnt/ilya-rewrite`, `Shane` `74579156`, through the desk's bridge, read-only. Nothing was written and no git write was run. Every line below was read this session. Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `packages/`, `scripts/`, `docs/`, or are `vercel.json`.

## Verdict

SEND WITH AMENDMENTS.

The build in Step 1 is right and the form the desk chose is sound. The brief's history and its account of the departure are smaller than what the tree shows, one comment instruction rests on a misreading, and one citation is three lines off.

## Blockers

None to the build. Amendments 1 to 4 must be applied before sending, because they correct statements of fact in the brief.

## Amendments

1. **Section 3, wrong line.** Change `analysis/placeholder-line.ts:76` to `analysis/placeholder-line.ts:73`. The `isSung` test sits on `:73`; `:76` is `if (vowels.length === 0) return null;`. Every other citation in the brief matches the tree: `markup/MarkupPane.svelte:64`, `:444-450`, `:554-568`, `:949`, `:1097`, `:1103`; `markup/profile-status.ts:14-17`, `:29-36`; `voice/engine/sung.ts:14-15`; `voice/profileStore.ts:196-198`; `voice/engine/resolve-values.ts:78-83`; `analysis/analyze-score-adapter.ts:117-118`, `:129`; `insights/InsightsPane.svelte:242-247`; `packages/score-parser/src/analysis-types.ts:69`; `components/Drawer/voice-pane-usable.test.ts:23-24`; `i18n.ts:1351-1355`, `:1500`, `:1502`; `scripts/ratchets.json:5`, `:16`; `vercel.json:3`, `:47`; `docs/memory/STATE.md:19` (gate 4, "6686 passed | 1 skipped (6687)", at `aba5f76b`). `git diff --stat aba5f76b 74579156` shows six files, all under `docs/`, so "memory and house-style files only" holds.

2. **Sections 1, 2, and 3, the history.** Replace every statement that lane 68 created the false count. The tree shows it is older and wider:
   - At `737228cb`, `voice/engine/resolve-values.ts:152` already ran `fillStandIns` whenever `anySung`, and `markup/MarkupPane.svelte:450` was `isPersonal(formants)`. A singer with five to nine sampled vowels therefore read "ten vowels measured" before lane 68.
   - The comment at `voice/engine/resolve-values.ts:144` dates the stand-ins to QUEUE row 17 (Dann 2026-09-16, method ruled 2026-10-01).
   - At the tip the same is true for every voice with one to nine sampled vowels (`voice/engine/resolve-values.ts:153-156`; `voice/engine/stand-ins.ts:151-155`, `:173-175`).
   Write in section 1: "Today a singer with one to nine sampled vowels reads ten. Before lane 68 that was five to nine; lane 68 widened it to one to four." Write in section 3, in place of "Lane 68 made them disagree for every voice below ten sampled vowels": "They have disagreed for every voice with a gap since the stand-ins entered the snapshot (QUEUE row 17); lane 68 opened the block to voices below five." Strike from section 2: "in July the snapshot held a value only where the singer had sung one" stays; "Lane 68 put the declared type's template values into the snapshot" becomes "QUEUE row 17 put stand-in values into the snapshot for every unsampled vowel, and lane 68 opened this page to voices below five."

3. **Section 2, the size of the departure.** Replace the last paragraph's closing sentence ("Reported under `CONTRACT.md` section 1 item 12, and as the drop of a stale implementation, not of the ruling.") with: "This lane departs from the ruling's first clause as recorded ('the pane's count reports what the analysis used') for every voice with fewer than ten sampled vowels, and keeps its second clause (capture quality never shrinks the count). Reported under `CONTRACT.md` section 1 item 12 and tether 19." Also strike "carries the only record": commit `cfcd0ba6` (2026-07-15 20:45 -0400) is a second record, and its message gives the reason as "the number no longer described the marks on screen" and "the count cannot drift from the analysis again". `markup/profile-status.ts:25` also cites section B.2.

4. **Step 1, "One consequence to report, not to fix".** Replace the whole paragraph with: "`profile.statusSetPlain` (`i18n.ts:1500`) is unreachable from this pane before and after this step: `hasReadings` (`:450`) is true only when a stored reading is `isSung`, and that reading is counted (`:568` today through `voice/engine/resolve-values.ts:79-81`, after this step directly). Report it; leave the key, its branch (`markup/profile-status.ts:31-32`), and the test at `markup/profile-status.test.ts:8` in place. Do not edit `markup/profile-status.ts:12-17`: that comment is about `profile.count.0`, and it stays true." The brief's reading of `:14-17` is wrong: the lines say index 0 of `countWord` never renders because `statusLineFor` routes zero to `statusSetPlain`. They make no claim about `statusSetPlain` itself.

5. **Step 1 item 1, decide the name.** Replace "Keep the name or rename it" with: "Rename `analysedVowels` to `sampledVowels` at `:446`, `:568`, and `:949`. In `markup/profile-status.ts`, rename the parameter `analysedCount` to `sampledCount` at `:29`, `:31`, `:33`, and `:36`." The rename changes no line count. The test in item 3 depends on the name, so Code cannot be left to choose.

6. **Step 1, the ceiling.** Add: "The comment at `:444-446` stays three lines. The comment at `:554-567` is rewritten in fourteen lines or fewer. If the file ends below 1353 lines, lower `scripts/ratchets.json:16` to the new count in the same commit (`scripts/ratchets.json:2`)." Add `scripts/ratchets.json` (line 16 only) to section 5, Owns. The swap at `:568` is one line for one line, and neither comment needs to grow, so nothing has to be cut or moved. A shorter file does not fail the gate (`scripts/ratchets.mjs:67` only prints), but the file's own rule asks for the lower number.

7. **Step 1 item 3, the test, made exact.** Replace the item with: "In `markup/profile-status.test.ts`, add `readFileSync('src/lib/markup/MarkupPane.svelte', 'utf8')` and assert three things: it matches `/const sampledVowels = \$derived\(ROSTER_ORDER\.filter\(\(g\) => isSung\(formants\[g\]\)\)\);/`; it matches `/statusLineFor\(sampledVowels\.length, language\)/`; it does not match `/snapshot\.fR1\[/` anywhere in the file. Title: 'counts the vowels the singer sampled, never the values the forecast holds'." The whole-file negative is safe today: `snapshot.fR1` occurs once in the pane, at `:568`.

8. **Step 3, add the guard that would have caught this.** Add item 1a: "One desktop Playwright test, new file `apps/web/e2e/melody-no-score-count.test.ts`, seeded as the pictures are: (a) one core vowel sampled, voice type soprano, no score, MELODY tab: the first `.profile-status` reads 'Your profile is now set with one vowel measured.'; (b) six core vowels sampled: it reads 'Your profile is now set with six vowels measured.'" Add the file to Owns. Reason: the source assertion guards the pane's wiring, and it is the right unit-level guard given the precedent. It cannot see the page. No test in `apps/web/e2e/` or `apps/web/e2e-phone/` reads this sentence today, and the pane's line was unchanged from `737228cb` while the sentence went wrong.

9. **Section 3, complete the list.** Add three lines:
   - "`voice/engine/resolve-values.ts:153`, `anySung`, read by `voice/chart/finish-early.ts:38`; `voice/chart/finish-early.ts:35` (the vowels not yet sung); `voice/VowelCapture.svelte:109`, `sungSet`. All test `isSung`."
   - "Readers of `usableReadingCount`: `apps/web/src/routes/+page.svelte:1762`, `:4187`, `:4367`."
   - "A different number by ruling, not changed here: `analysis/placeholder-line.ts:53-56` and `:74` print `stableCore(...).length` as 'You have sampled {n}' (`i18n.ts:1443`, `:2060`, `:2067`; `voice/engine/sung.ts:26-30`). It counts stable core vowels only. After this lane, a voice with one unstable core vowel and two stable ones reads 'three vowels measured' on MELODY with no score and 'sampled 2 so far' on MELODY with a score."

10. **"The form", two corrections.** (a) Replace "`voice/profileStore.ts` is persistence, and MELODY's paper has no business importing it" with "the pane already imports a type from it (`markup/MarkupPane.svelte:146`) and `scripts/ratchets.mjs:83` allows `markup/` to import `voice/`; the import is dropped as a desk preference, not on a rule." (b) Delete section 7's third bullet; it is now established.

11. **Step 0 item 2.** Add `analysis/placeholder-line.ts:73` and `voice/engine/stand-ins.ts:151-155` to the list of lines to re-read.

12. **Step 3 item 1, where the pictures go and what is seeded.** Add: "Seed one core vowel ([i]), voice type soprano, no score. Save to `docs/sessions/pictures-lane69/`." Add that folder to Owns.

13. **Step 3 item 4, name the files and the scope.** Replace "Run the phone project three times" with "Run `apps/web/e2e-phone/voice-stations.test.ts` and `apps/web/e2e-phone/insights-links.test.ts` three times each and report each run." The two cited lines, `:62` and `:32`, are in `apps/web/e2e-phone/`, not `apps/web/e2e/`.

### Findings behind the amendments, by the question asked

- **Item 2, the equivalence: confirmed.** `voice/engine/resolve-values.ts:78-82` writes `'sung'` for exactly the entries of `sampled` where `isSung` holds. Nothing overwrites it: the derived loop writes only where `fR1[vowel] === undefined` (`:134-136`), and the stand-ins write only where the value is undefined (`voice/engine/stand-ins.ts:152-154`, `:173-175`). `analysis/analyze-score-adapter.ts:129` passes `sampled` straight through, and the pane passes its own `formants` (`markup/MarkupPane.svelte:550`). `ROSTER_ORDER` (`:442`) and `VOWELS` (`voice/engine/types.ts:26`) hold the same ten vowels. The desk's three reasons for `isSung(formants[g])` stand; the second is weaker than stated, since the adapter always sets `fR1Source` (`analysis/analyze-score-adapter.ts:157`).
- **Item 3: holds, and can fall.** See amendment 6.
- **Item 4: the source assertion is adequate as a wiring guard and matches the precedent; it is not sufficient alone.** See amendments 7 and 8.
- **Item 7: the conclusion is true, the cause is false.** See amendment 4.
- **Item 8: correct.** After the move the order is: `:1349` comment, `calib.summary.unstable`, the lane 68 comment, `calib.summary.unstableOne`, the two-buttons comment, `calib.summary.keepOne`, `calib.summary.useEstimate`. The keys and their order are unchanged, and the line count is unchanged.

## For Dann

One item, because the departure is larger than the brief says (amendment 3).

**Question.** MELODY's page with no score: the sentence counts only the vowels the singer sampled, at every count. A singer with six sampled reads "six vowels measured", though the forecast uses ten values. Yes or no?

**Recommendation.** Yes. The word on the page is "measured", and a placeholder was never measured.

**Cost of yes.** The July clause "the count reports what the analysis used" stops being true on this page for any voice with a gap.

**Cost of no.** A singer with one sampled vowel keeps reading "ten vowels measured".

The lane can run while this waits: nothing reaches `Shane` without his ship.

## What I could not establish

- Dann's own words for the section B.2 ruling of 2026-07-15. The tree holds a paraphrase (`markup/MarkupPane.svelte:556-558`) and a commit message (`cfcd0ba6`). `grep` of `docs/memory/*.md` for "B.2" returned nothing, and a search of project knowledge returned no hit.
- Whether a stored voice can hold a key outside the ten vowels. `voice/profileStore.ts` shows no filter on `VOWELS`. If one can, `hasReadings` (`:450`) could be true with a count of zero, and `statusSetPlain` would render. No count shows this is common.
- Whether the new Playwright test of amendment 8 runs in the cloud session. Step 3 already runs Playwright there, so it is likely; not seen.
- Whether "measured" was ever ratified. `markup/profile-status.ts:25` still marks it "DRAFT copy, flagged for Dann". Outside this lane; no string changes here.
- No gate and no test was run. Every finding is from reading.

## Terms

Coined here: "wiring guard" (a test that asserts which object a component reads, by its source text).

Adopted from the tree and the brief: "sampled", "placeholder", "stand-in", "stable core", "personal", "DESK DEFAULT", "NOT ESTABLISHED", "ceiling", "ratchet".

Learned this session, for the main session's memory if wanted (source: the tree): `scripts/ratchets.mjs:78-85` holds the module import table, and `markup/` may import `voice/`; Playwright specs live in `apps/web/e2e/` (desktop) and `apps/web/e2e-phone/` (phone), not `apps/web/tests/`; a file below its ceiling prints a notice and does not fail the gate.

---

## The desk's disposition of the "For Dann" item, 2026-11-18 20:5x

NOT put to Dann, and the reason is on the record. `CONTRACT.md` section 1 item 12 and tether 19 give the drop of a stale implementation to the desk, section 5 says write for the singer and settle the build yourself, and section 5 forbids handing Dann his own ruling as the reason for a thing he is asking about. The page prints the word "measured", and a value the singer never sang was never measured, so this is a correctness fix and not taste (two competent people would not differ). Brief r3 section 2 carries the one-line departure report that item 12 requires, and the desk reported the departure to Dann in one line in the thread. He may strike it.
