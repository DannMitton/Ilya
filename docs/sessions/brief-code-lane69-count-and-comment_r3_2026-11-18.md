# Brief to Code: lane 69, the count MELODY prints, and one comment's place

r3, 2026-11-18 20:5x, written by the desk (Opus 5). It applies Fable's review of r2 (`docs/sessions/review-fable-lane69-brief_r1_2026-11-18.md`: SEND WITH AMENDMENTS, thirteen amendments), every one of them, and the desk re-read each line the review cites before writing them in. r1 and r2 are superseded. For a cloud Code session on branch `cloud-lane-69`, cut from the tip of `Shane` (`74579156`). No other lane is running. Source: `docs/sessions/review-fable-lane68-as-built_r1_2026-11-18.md`, Fixes 1 and 2.

Paths are under `apps/web/src/lib/` unless they begin with `apps/`, `packages/`, `tools/`, `docs/`, `scripts/`, or are `vercel.json`. The desk read every line it cites at `Shane` `74579156` on 2026-11-18. Step 0 re-reads them on your tip.

## 1. What the singer gets

MELODY's page with no score tells the singer how many vowels are measured. Today that count is every vowel the forecast holds a value for, placeholders included (`markup/MarkupPane.svelte:568`, `adapted.snapshot.fR1[g] !== undefined`), so a singer with one to nine sampled vowels reads "Your profile is now set with ten vowels measured" (`:949`, `:1103`; `markup/profile-status.ts:29-36`; `i18n.ts:1502`). The page tells that singer to stop, while every other line on it tells them to go on.

Before lane 68 the same sentence lied to a singer with five to nine sampled vowels, and the page was hidden below that (`markup/MarkupPane.svelte:450` was `isPersonal(formants)` at `737228cb`). Lane 68 opened the page to one to four as well, which is how it came to the desk's notice.

After this lane the sentence counts the vowels the singer sampled, and nothing else: one sampled reads "Your profile is now set with one vowel measured", six sampled reads "six".

No string changes in this lane. Step 2 moves a comment; nothing a singer sees changes from it.

## 2. The ruling this lane departs from, and why

Two records of Dann's section B.2 ruling of 2026-07-15 survive: the paraphrase at `markup/MarkupPane.svelte:554-558` (*the pane's count reports what the analysis used; capture quality is the drawer's job, where Re-take lives*) and commit `cfcd0ba6` (2026-07-15 20:45 -0400), whose message gives the reason as "the number no longer described the marks on screen" and "the count cannot drift from the analysis again". `markup/profile-status.ts:25` cites the same section. Dann's own words for it are NOT ESTABLISHED: a grep of `docs/memory/*.md` for "B.2" returns nothing.

**This lane departs from the ruling's first clause as recorded, for every voice with fewer than ten sampled vowels, and keeps its second.** What persists is the reason, and the reason has two halves.

- Capture quality never shrinks this count. That half is kept whole: an unstable or provisional take still counts here, because `isSung` admits both (`voice/engine/sung.ts:14-15`).
- The number describes the marks on screen. On this page there are no marks: it is MELODY with no score attached (`markup/MarkupPane.svelte:1097`, the block that draws when nothing is uploaded). The clause that was written to make the number match the analysis cannot do any work on a page with no analysis on it, and what the number can honestly mean there is what the singer sampled.

What changed under the ruling since July is the snapshot, not the sentence. QUEUE row 17 (Dann 2026-09-16, the method ruled 2026-10-01 02:56, `voice/engine/resolve-values.ts:144`) put stand-in values into `snapshot.fR1` for every unsampled vowel (`:153-156`; `voice/engine/stand-ins.ts:151-156`, `:173-175`), so "what the analysis used" stopped being "what the singer gave". The implementation is stale, not the ruling.

Reported under `CONTRACT.md` section 1 item 12 and tether 19. Settled at the desk, not put to Dann: the page prints the word "measured", and a value the singer never sang was never measured, so this is a correctness fix and not a matter two competent people would read differently.

## 3. One number, and every site that computes it

This lane changes how a number is computed, so the line `CONTRACT.md` section 4 asks for. Every site that computes "how many vowels the singer sampled" tests `isSung` on the stored readings.

- `voice/profileStore.ts:196-198`, `usableReadingCount`: `Object.values(f).filter(isSung).length`. Read at `apps/web/src/routes/+page.svelte:1762`, `:4187`, and `:4367`: the VOICE pane's sentence, its doors, and the Voice band's state line.
- `insights/InsightsPane.svelte:242-247`, `measuredVowels`: `Object.entries(formants).filter(([, f]) => isSung(f))`.
- `markup/MarkupPane.svelte:450`, `hasReadings`: `Object.values(formants).some(isSung)`, which gates the very block this count is printed in (`:1097`).
- `analysis/placeholder-line.ts:73`: `Object.values(stored.formants).some(isSung)`.
- `voice/engine/resolve-values.ts:153`, `anySung`, read at `voice/chart/finish-early.ts:38`; `voice/chart/finish-early.ts:35`, the vowels not yet sung; `voice/VowelCapture.svelte:109`, `sungSet`. All test `isSung`.

**What depended on them agreeing.** The sentence at `:1103` sits inside the block `hasReadings` opens, so one test decides whether the sentence appears and a different test decides the number inside it. They have disagreed for every voice with a gap since the stand-ins entered the snapshot (QUEUE row 17); lane 68 opened the block to voices below five. After Step 1 all five read `isSung` on the same stored object.

**A different number, by ruling, not changed here.** `analysis/placeholder-line.ts:53-56` and `:74` print `stableCore(...).length` as "You have sampled {n}" (`i18n.ts:1443`, `:2060`, `:2067`; `voice/engine/sung.ts:26-30`), counting stable core vowels only. After this lane a voice with two stable core vowels and one unstable reads "three vowels measured" on MELODY with no score and "sampled 2 so far" on MELODY with a score. That difference is Dann's ratified design (`docs/memory/OPEN.md`, "VOICE: HOW ILYA MEETS A VOICE, AND A BREAK", items 2 and 4; the lane 68 review's "For Dann's eye" item 1, already before him for his walk). Change neither number to make them match.

## 4. Steps

Each step is its own commit and its own report section, test first where a test applies, then pushed. Step 0 runs all eight gates as the baseline; Step 3 runs them again at the end.

Gate 4 at the parent, for your control: `docs/memory/STATE.md:19` records "6686 passed | 1 skipped (6687)" on the Mac at `aba5f76b`, the code tip this branch carries (`git diff --stat aba5f76b 74579156` is six files, all under `docs/`). Measure your own and report both.

Standing line: correct every comment your change makes false, in the same commit, and list them.

Ceilings (`scripts/ratchets.json:16`): `markup/MarkupPane.svelte` 1353 of 1353, at its ceiling. The swap at `:568` is one line for one line, the comment at `:444-446` stays three lines, and the comment at `:554-567` is rewritten in fourteen lines or fewer, so nothing has to be cut or moved. If the file ends below 1353 lines, lower `scripts/ratchets.json:16` to the new count in the same commit, which is what that file's own rule asks for (`scripts/ratchets.json:2`); a file under its ceiling prints a notice and does not fail the gate (`scripts/ratchets.mjs:66-67`). `i18n.ts` is exempt (`scripts/ratchets.json:5`).

### Step 0. Read and report; change nothing

1. All eight gates.
2. Read and report the line each of these sits on at your tip: `markup/MarkupPane.svelte:64` (the `isSung` import), `:442`, `:444-450`, `:553-568`, `:949`, `:1097-1103`; `markup/profile-status.ts:12-37`; `voice/engine/sung.ts:14-15`; `voice/profileStore.ts:190-198`; `voice/engine/resolve-values.ts:74-83`, `:153-156`; `voice/engine/stand-ins.ts:151-156`; `analysis/placeholder-line.ts:73`; `analysis/analyze-score-adapter.ts:117-129`; `i18n.ts:1349-1356`, `:1498-1504`.
3. Report every reader of `analysedVowels` at your tip. The desk's grep of the whole file returned three lines: `:446` (a comment), `:568` (the declaration), `:949` (the one reader).

### Step 1. The count names what the singer sampled

1. `markup/MarkupPane.svelte:568`. The filter becomes `isSung(formants[g])` in place of `adapted.snapshot.fR1[g] !== undefined`. `isSung` is already imported (`:64`), so the line count holds.
2. Rename `analysedVowels` to `sampledVowels`, at `:446`, `:568`, and `:949`. In `markup/profile-status.ts`, rename the parameter `analysedCount` to `sampledCount`, at `:29`, `:31`, `:33`, and `:36`. Neither rename changes a line count. The reason: the word the page prints is "measured", and the old name says "analysed". The test in item 4 depends on the new name.
3. Rewrite the two comments the change makes false, in the same commit:
   - `:444-446` points at `analysedVowels` as "what the forecast is built on". After this step it is what the singer sampled; the forecast still rests on placeholders as well. Three lines.
   - `:554-567` justifies reading the snapshot so the count "can never drift from what `analyzeScore` is actually given". Section 2 says why that is now the fault and not the safeguard. The new comment names section B.2 and `cfcd0ba6` as the ruling's records, `usableReadingCount` (`voice/profileStore.ts:196-198`) as the same count elsewhere, and `isSung` (`voice/engine/sung.ts:14-15`) as the one test. Fourteen lines or fewer.
4. Test, in `markup/profile-status.test.ts`. Read the pane as text, `readFileSync('src/lib/markup/MarkupPane.svelte', 'utf8')`, and assert three things: it matches `/const sampledVowels = \$derived\(ROSTER_ORDER\.filter\(\(g\) => isSung\(formants\[g\]\)\)\);/`; it matches `/statusLineFor\(sampledVowels\.length, language\)/`; and it does not match `/snapshot\.fR1\[/` anywhere in the file. The whole-file negative is safe today: `snapshot.fR1[` occurs once in the pane, at `:568`. Title the test "counts the vowels the singer sampled, never the values the forecast holds". The precedent for a source assertion is `components/Drawer/voice-pane-usable.test.ts:23-24`, which reads `+page.svelte` the same way.

**The form, DESK DEFAULT.** Fable's as-built review of lane 68 prescribes `adapted.snapshot.fR1Source?.[g] === 'sung'`. It selects the same vowels, and the review of this brief confirmed it from the tree: `voice/engine/resolve-values.ts:78-82` writes `'sung'` for exactly the entries where `isSung` holds, the derived loop writes only where the value is undefined (`:134-136`), the stand-ins write only where it is undefined (`voice/engine/stand-ins.ts:152-154`, `:173-175`), `analysis/analyze-score-adapter.ts:129` passes `sampled` straight through, and the pane passes its own `formants` (`:550`). Build `isSung(formants[g])` instead, for two reasons: it is the form INSIGHTS and the placeholder line already use (section 3), and it reads the stored readings the pane was handed rather than a field computed from them. Importing `usableReadingCount` was considered and dropped as a desk preference, not on a rule: the pane already imports a type from that module (`markup/MarkupPane.svelte:146`) and `scripts/ratchets.mjs:83` allows `markup/` to import `voice/`. If your Step 0 read contradicts any of this, report it and build nothing until the desk answers.

**Two things to report, not to fix.**
1. `profile.statusSetPlain` (`i18n.ts:1500`) is unreachable from this pane before and after this step: `hasReadings` (`:450`) is true only when a stored reading is `isSung`, and such a reading is counted, today through `voice/engine/resolve-values.ts:79-81` and after this step directly. Leave the key, its branch (`markup/profile-status.ts:31-32`), and the test at `markup/profile-status.test.ts:8` in place. Do not edit `markup/profile-status.ts:12-17`: that comment is about index 0 of `countWord`, and it stays true.
2. One path can still reach it: `hasReadings` tests every key of `formants`, while the count filters `ROSTER_ORDER` (`:442`), so a stored reading on a key outside the ten vowels would open the block with a count of zero. Nothing shows that a stored voice can hold such a key, and no count shows it happening. Report it if your reading of `voice/profileStore.ts` says it can; build no guard for it.

### Step 2. The comment order in `i18n.ts`

`i18n.ts:1351-1354`, comment order only, no string touched. The comment at `:1351` ("the far-off [ɨ]'s two buttons") sits above `calib.summary.unstableOne` (`:1353`), not above its own keys, because lane 68 inserted `:1352-1353` under it. Move `:1352-1353` above `:1351`. The file then reads: the `:1349` comment, `calib.summary.unstable`, the lane 68 comment, `calib.summary.unstableOne`, the two-buttons comment, `calib.summary.keepOne`, `calib.summary.useEstimate`. Same keys, same order of keys, same line count.

### Step 3. The guard, pictures, `vercel.json`, the end gates

1. **The test that would have caught this.** New file `apps/web/e2e/melody-no-score-count.test.ts`, desktop, seeded as the pictures are: (a) one core vowel sampled, voice type soprano, no score, MELODY tab: the first `.profile-status` reads "Your profile is now set with one vowel measured."; (b) six core vowels sampled: it reads "Your profile is now set with six vowels measured." Reason: the source assertion of Step 1 guards the pane's wiring and cannot see the page, and no test in `apps/web/e2e/` or `apps/web/e2e-phone/` reads this sentence today (grep for "vowel measured" and "voyelle mesurée" returns nothing in either folder). The pane's line was unchanged from `737228cb` while the sentence went wrong.
2. **Pictures.** One core vowel ([i]) sampled, voice type soprano, no score, of MELODY's page: English and French, phone and desktop. Four pictures, saved to `docs/sessions/pictures-lane69/`. No picture of this page exists; it is the page Fix 1 is about (`docs/sessions/review-fable-lane68-as-built_r1_2026-11-18.md`, "What I could not establish"). Look at each and say what the sentence reads, and whether it sits whole on the phone.
3. `vercel.json` names `cloud-lane-69` alone, in both places (`:3`, `:47`).
4. All eight gates, and Playwright `voice-pane`, `voice-links`, `insights-links`, `calibrate-new`, and the new `melody-no-score-count` (desktop), `voice-stations` and `insights-links` (phone). Change an expectation only where section 1 says the singer now sees that, and list each.
5. **The phone flake.** `apps/web/e2e-phone/voice-stations.test.ts:62` and `apps/web/e2e-phone/insights-links.test.ts:32` flaked 2 of 3 runs at `737228cb`, before lane 68, cause NOT ESTABLISHED. Run those two files three times each and report each run. Change no test for a flake.

## 5. Owns and leaves

Owns: `markup/MarkupPane.svelte` (within its ceiling), `markup/profile-status.ts` (the parameter rename and its comments), `markup/profile-status.test.ts`, `i18n.ts` (the comment move of Step 2 only), `scripts/ratchets.json` (line 16 only, and only to lower it), `apps/web/e2e/melody-no-score-count.test.ts` (new), `docs/sessions/pictures-lane69/` (new), `vercel.json`. Leaves: every string's text, every other count, `voice/`, `analysis/`, `insights/`, `packages/`, `docs/memory/`, every brief.

## 6. Constraints

No pull request; push only `cloud-lane-69`. Change nothing under `docs/memory/`; do not edit a brief. One vowel per note is not in scope here, and no path in this lane touches seating. NOT ESTABLISHED beats a complete invented answer.

## 7. What the desk could not establish

- Dann's own words for the section B.2 ruling of 2026-07-15. The tree holds a paraphrase (`markup/MarkupPane.svelte:554-558`) and the message of `cfcd0ba6`; a grep of `docs/memory/*.md` for "B.2" returns nothing, and a search of project knowledge returned no hit.
- Whether a stored voice can hold a reading on a key outside the ten vowels (Step 1, second report item). `voice/profileStore.ts` shows no filter on `VOWELS` (`voice/engine/types.ts:26`).
- Whether the new desktop Playwright test of Step 3 item 1 runs in a cloud session. Step 3 already runs Playwright there, so it is likely; not seen.
- Whether "measured" was ever ratified as the word. `markup/profile-status.ts:25` still marks it "DRAFT copy, flagged for Dann". Outside this lane; no string changes here.
- The cause of the two phone flakes, and whether lane 68's longer pane sentence makes them more frequent (2 of 3 before, 3 of 3 after, from lane 68's own runs).
