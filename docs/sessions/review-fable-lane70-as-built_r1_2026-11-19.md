# Review, lane 70 as built: INSIGHTS is WYSIWYG under 1400 px

r1, 2026-11-19, Fable 5.2. Read-only against `cloud-lane-70` `f7e03836`, cut commit `Shane` `61536a9f`.
The clone at `/home/claude/dannmitton/ilya` was not changed (`git status` clean at the close). Every run below was made in a scratch copy at `/tmp/l70/ilya` with its own `pnpm install --frozen-lockfile`; nothing was committed or pushed anywhere.

Every claim carries a `path:line` read this session, a command run this session, or the words "not established".

## Verdict in one line

**MERGE WITH FIXES.** No edit to the lane's code is needed before the merge. One record entry rides with the merge, and four edits follow. The tap sizes are a follow-up, and whether phones get the smaller taps before that follow-up lands is Dann's call.

## 1. The lane against its brief

History, from `git fetch --depth 12 origin cloud-lane-70` in the scratch copy, then `git log` and `git show --stat`: six commits on top of `61536a9f`, one per step, each carrying its own report (`e480478` step 0, `41f69cc` step 1, `ab0733e` step 2, `799593c` step 3, `634056b` step 3b, `f7e0383` step 4). The three hashes the reports quote (`e4804780`, `ab0733e3`, `634056b3`) match these.

| Step | Done as written | Notes |
| --- | --- | --- |
| 0 | yes | Every section 2 citation re-read by me against `61536a9f` with `git show`; all hold. |
| 1 | yes, all nine items | See section 4. |
| 2 | yes | `insights-key-lines.test.ts:42`, `:43`, `:69` changed; no `expect` line in the diff. |
| 3 | yes | Seven pictures exist; items 4, 5, and 6 reported. |
| 3b | yes, with two gaps the lane names itself | `.more summary` had no instance in any state; the `.input-link` form at `SingerBlock.svelte:63` was not measured. |
| 4 | yes, with one gap | The full `chromium` project was not run (step 4 report `:66`). |

**Done that the brief did not ask for** (each declared by the lane, none harmful):

1. One tab of indentation removed from the `PageFit` block (step 1 report `:21`).
2. `width` renamed `_width` in `rootOf` (`insights-key-lines.test.ts:43`). The parameter and both viewports are kept (`:84`).
3. Cut from `61536a9f`, not `3271b4da` as brief section 5 says. On the maintainer's tree, `git merge-base --is-ancestor 3271b4da 61536a9f` exits 0 and `git diff --stat` between them is three files under `docs/sessions/`, 704 insertions. No source line moved.
4. Two extra stored voices (`NORANGE`, `TIGHT`) in an off-repository script, and two extra page 1 pictures at the tablet sizes.
5. A gate 4 timing table and a second gate 4 baseline form, credited to an amendment Dann made inside the lane's session. That amendment is not established by me; it is not in the brief.

**Asked for and missing:**

1. `e2e/tempo.test.ts:183` to `:197` drives INSIGHTS at 390 by 844 inside the `chromium` project (`:184` `setViewportSize`), taps `.tempo-link`, and was not in the lane's list of suites. I ran the file on the lane: `5 passed (1.0m)`. The gap is closed.
2. `.more summary` and `.input-link` sizes: still not established.
3. `e2e/octave-line.test.ts`, `singer-paths.test.ts`, and `voice-pane.test.ts` also open INSIGHTS and were not run by the lane or by me. They run at 1440 px (`playwright.config.ts:36`, `singer-paths.test.ts:11`, `voice-pane.test.ts:9`), where `isMobile` is false and `PageFit` adds no class, style, or transform (`PageFit.svelte:44`, `:51`, `:70` to `:72`), the same as `fit={false}` before. By reading, unaffected. Not run.

**The sixteen amendments of the brief review.** All sixteen are in brief r2 (read in full). The ones with a consequence in the build: 5 (header comment, `InsightsPane.svelte:19`), 6 (measurer outside the fit, `:555` a sibling of `:566`), 7 (pictures at 768 by 1024 and 1024 by 768 exist), 8 (print count reported), 9 (test comment `:42`), 10 (label line counts reported), 11 (taps measured before and after), 12 (scroll height reported), 13 (voice with two or more pages), 14 (the grep under `apps/` returns nothing), 15 (gate 3 line reported). Honoured.

## 2. The reports' claims against the tree

**Confirmed by me:**

- Step 0, every row of its citation table (`git show 61536a9f:<file> | sed -n`), including `isMobile` at `:113`, `:146`, `:577` only; `scripts/ratchets.json:18` at 744; file length 742.
- Step 0, `apps/web/e2e-phone/` holds 22 files (`ls | wc -l`), none matching the old names.
- Step 1, 25 insertions and 90 deletions (`git diff --numstat`); `PageFit` block at `:565` to `:589`; `fit={isMobile}` at `:566`; measurer `:555`, foot probe `:559`; `Segment` at `:84`, `:459`, `:532`, `:544`.
- The ratchet: `scripts/ratchets.json:18` is 677; the file is 677 lines by the rule at `scripts/ratchets.mjs:63`; `node scripts/ratchets.mjs` ends `ratchets: OK.` and lists the same other files as lowerable.
- Step 2, the three changed lines, and fifteen tests by count (seven in the loop at `:89` to `:145`, two viewports at `:84`, one at `:158`).
- Step 3, scale `scale(0.419118)` and 3 pages in English for BASS_B2 at 390 by 844 (my own Playwright script, kept outside the repository). Picture sizes agree with a device scale of 2 (`file`: page 1 at 390 is 684 by 886).
- Step 3b, four of six rows, before and after, to the tenth of a pixel: `.try-key` 76.3 by 21.3 then 32.0 by 8.9; `.reveal summary` 310.0 by 17.3 then 261.5 by 7.2; `.tempo-link` 125.2 by 23.5 then 52.5 by 9.8; the shares link 181.2 by 16.1 then 76.0 by 6.7.
- Step 4, gate 3: `svelte-check found 0 errors and 12 warnings in 5 files`. Gate 8: OK.
- Step 4, gate 4: my run on the lane gave `Test Files 362 passed (362)`, `Tests 6691 passed | 1 skipped (6692)`, the brief's own baseline. The lane's `6687 | 5 skipped` is its sandbox lacking scipy, as it says.
- Step 4, the final grep: `git grep -nE "insights-flow|flow-head|flow-body|flow-foot|flowWidth|flowSegments" HEAD -- apps packages scripts` returns 0 lines.
- Step 4, the phone results for the files I ran (section 6).
- Step 3, section 5, the French asterisks: visible in `insights-p1-390x844-fr.png` ("votre *primo*"). The key line is drawn by the `prose` snippet (`SingerBlock.svelte:69`, `:65`), which has no `em` branch; `rich` (`:61`) has one. `SingerBlock.svelte` is not in the diff, so this predates the lane.

**Wrong:**

- Step 0 report `:52` says "19 matching lines, in two files". The count at `61536a9f` is 17 lines (15 and 2) holding 20 occurrences (`git grep -n` and `git grep -o`). The report's own list at `:54` to `:55` sums to 17. No consequence.

**Not established by me:**

- Gates 1, 2, 5, 6, and 7. The diff touches nothing under `packages/` or `tests/`.
- The per-file split of the twelve warnings.
- The printed page counts (3 and 3), the scroll heights (1551 and 1108), the French page count, the page counts of the other voices, and the tablet scales.
- The whole `phone` project total of 52 passed, 5 failed, 1 skipped; I ran six of its 22 files.
- The `.offer-link` "Add your range" and `.offer-decline` rows of step 3b.
- `TitleHeader.svelte:130` to `:141` (not opened by me); `InsightsPane.svelte:496` does open `<TitleHeader`.
- Step 3b's "51 after" for `.try-key`. In my BASS_B2 measurement the selector finds eight on-screen `.try-key` boxes, of which two are in the conclusion and six sit inside the closed "Show keys that reach higher" disclosure and are not drawn. The lane's instance counts appear to include controls inside a closed disclosure. The sizes are unaffected.

## 3. Scope, from the diff alone

`git diff --name-status 61536a9f HEAD`: three modified files outside `docs/sessions/` (`apps/web/e2e/insights-key-lines.test.ts`, `apps/web/src/lib/insights/InsightsPane.svelte`, `scripts/ratchets.json`), and thirteen added files, all under `docs/sessions/` (six reports, seven pictures).

- No string in either language: `i18n.ts` is not in the diff, and the pane's diff adds no text node.
- No control's size, padding, or hit area, and no coarse-pointer rule: `SingerBlock.svelte` is not in the diff; the pane's style diff is deletions only, all `.insights-flow`, `.flow-head`, `.flow-body`, and `.flow-foot` rules.
- No config file: `vitest.config.ts`, `package.json`, `svelte.config.js`, and `playwright.config.ts` are not in the diff. The one `.json` in the diff is `scripts/ratchets.json`, one line.
- No reporter setting written: `git grep -n reporter` over the config files finds only `playwright.config.ts:18` (`reporter: 'list'`), which the diff does not touch.
- `PageFit.svelte`, `Paper.svelte`, `MarkupPane.svelte`, and `+page.svelte`: not in the diff.
- `docs/memory/`: `git diff --name-only 61536a9f HEAD -- docs/memory` returns nothing.

Scope holds.

## 4. The repair itself

Read whole: `InsightsPane.svelte` as it stands, and `PageFit.svelte`.

- **Whitespace only.** `git diff -w` on the pane shows, as real changes: the header sentence (`:19`), the deleted `flowWidth` and `flowSegments` with their comment, the deleted branch with `{:else}` and `{/if}`, the new comment and `fit={isMobile}` (`:565`, `:566`), and the deleted style rules. None of the 23 re-indented lines between `:567` and `:589` appears under `-w`. The re-indent is whitespace only.
- **No dead import.** The deleted branch used `header`, `segment`, `PageFooter`, and the type `Segment`. All four are still used: `:576`, `:581`, `:560` and `:584`, `:459`.
- **No unused variable.** `isMobile` is read at `:566`. `tsconfig.json:15` to `:16` set `noUnusedLocals` and `noUnusedParameters`, and gate 3 reports 0 errors.
- **No orphaned CSS rule.** Every remaining selector has a user in the markup: `.insights-container` `:568`, `.paper-page` `:571`, `.column` `:580`, `.squircle` `:536`, `.part` `:546`, `.measurer` `:555`, `.foot-probe` `:559`, `.screen-only` `:546` and `:550`. Gate 3's warning count did not rise.
- **No lying comment in the pane.** `:14` to `:19` and `:565` say what the code does.
- **The measurer is outside the fit** (`:555` to `:562`, before `:566`), so `line-breaks.ts:27` and `:34` still read unscaled rectangles.

Two small things, neither a defect in the lane:

1. `InsightsPane.svelte:19` runs to about 90 characters where its neighbours wrap near 78. Cosmetic.
2. **Comments outside the lane's reach now understate.** `PageFit.svelte:6` says "ONE implementation, two documents", `:14` says "Both Studio documents", and `:29` says "True in portrait on the phone, false everywhere else". There are three callers now, and the flag is every layout under 1400 px. The brief forbade touching that file, so the lane was right to leave it. `e2e-phone/insights-label.test.ts:2` to `:6` still describes a phone cut of the label that is drawn nowhere now (brief risk 1).

## 5. The taps: blocker or follow-up

### What is ruled, quoted

- `docs/memory/OPEN.md:2684`: "**Control geometry answers to input modality, not to form factor or brand.**" Hook: "`@media (pointer: coarse)`, not a width query; the desktop keeps its sizes." Also: "touch geometry E, a 44 px floor with the exemption rule *\"Every exemption is named in the record with its justification. An exemption that is not named does not exist.\"*"
- `docs/memory/PRODUCT.md:595`: "The drawer also carries two existing 44 px touch-target exemptions, ruled in E.36: the table-of-contents rows and the stress circles. These are cited here as already settled, not restated or reopened."
- `docs/memory/CONTRACT.md:154` (section 8): "Do not create a third touch-geometry exemption. The cursor alone takes the 44 px floor (N.55b's station shape, ruled 2026-08-13, corrected 2026-08-14); every other syllable is plain text and stays directly tappable."
- `docs/memory/CONTRACT.md:149` (section 8): "Do not put a control on the paper: drawer manipulates, page displays and prints. **No control is part of the printed page; passing layers, the loupe, and the Transposition ruler float above it and never print**".
- `docs/memory/OWED.md:697`, N.15: "The touch-target repair | `RULED`, increment 1 specified and unapplied", and for N.55b: "Not a third exemption; a constraint the engraving imposes".
- `docs/memory/OPEN.md:4064`, the ruling this lane serves: "INSIGHTS IS WYSIWYG ON A PHONE, LIKE TEXT AND MELODY".

No line I read names the INSIGHTS controls, and none rules on a control inside a scaled page.

### Judgement: a follow-up, not a blocker

1. **The lane does not create the breach.** Before the lane, these controls were 16.1 to 23.5 px tall at 390 px, under the floor, with no named exemption (my measurement on `61536a9f`). `grep` for `pointer: coarse` and `44px` in `apps/web/src/lib/insights/*.svelte` returns nothing. The lane makes an existing breach about 2.4 times smaller on each axis.
2. **Nothing is lost, and a mis-tap is undone by the singer.** The viewport tag sets no scale limit (`app.html:37`) and pinch is kept on purpose (`app.css:395` to `:396`). "Add your range" and the shares link land on drawer bands that open on their own (`e2e-phone/voice-stations.test.ts:72` to `:74`, `e2e-phone/insights-links.test.ts:43`). The tempo control also opens from the receipt (`e2e/tempo.test.ts:143`). A wrong "Try this key" is cancelled on the ruler (`e2e/insights-key-lines.test.ts:158`).
3. **The merge is one revert away from undone.** Three source files.
4. **Holding the merge keeps INSIGHTS the odd one out**, against a ruling Dann gave for consistency, and the tap repair cannot be written without a design ruling (below).

The cost of calling it a follow-up, stated plainly: between the merge and the follow-up, a singer on a phone meets "Try this key" at 32.0 by 8.9 px, and the two disclosures, whose contents are reachable nowhere else on a phone, behind a line 7.2 px tall. That is a real loss of reach under the thumb. It is accepted by nobody yet. The brief says the question is Dann's (brief section 3, step 3b), and I agree. The memory listing names a release on 2026-11-27 (from memory, not read this session); if that date stands, the follow-up belongs ahead of it.

### Does the `ClefControls` pattern transfer

Read whole: `apps/web/src/lib/score/ClefControls.svelte`, 351 lines.

**The mechanism transfers.** Fixed buttons placed from `getBoundingClientRect` (`:54` to `:72`), re-read on scroll, resize, and a pointer change (`:85` to `:101`), moved to `<body>` (`:162` to `:165`), 44 px on a coarse pointer (`:51`, `:56`), hidden in print (`:346` to `:350`), under the drawer in the stacking order (`:243` to `:245`, `:258`). The hit-overlay part of the file (`:43` to `:101`, `:161` to `:165`, `:202` to `:218`, `:246` to `:264`, `:345` to `:350`) is 106 lines; the rest is the chip, the menu, and the sheet.

**The guarantee does not transfer whole.** The desk's sentence, that the file "already solves exactly this problem", overstates it. Four differences, each measured or read:

1. **The controls are closer together than 44 px.** At 390 px on the lane, the two "Try this key" buttons of BASS_B2 sit 20.4 px apart from top to top (y = 287.2 and y = 307.6, my measurement). Two 44 px boxes there overlap by 23.6 px. Before the lane the same two sat 87.7 px apart. "Add your range" and "No thanks" share one sentence (`SingerBlock.svelte:95`), and the two notes links sit side by side (`:180`, `:181`). `ClefControls` met this once, for one neighbour, and answered by clipping its own box to as little as 16 px (`:62` to `:70`). Six control kinds with neighbours on every side need a rule for who yields. That rule is a design, and the record already has one precedent for a target the layout holds under the floor (`OWED.md:697`, N.55b).
2. **A closed disclosure still reports boxes.** Six of the eight on-screen `.try-key` elements for BASS_B2 are inside the closed reveal and returned 32.0 by 8.9 boxes at y = 381.6 to 516.3, over the squircle below. An overlay placed from rectangles alone would lay live buttons over controls that are not drawn. It needs a visibility test the clef overlay never needed. It also needs to leave the measurer's copies out (`InsightsPane.svelte:555`).
3. **The clef button is a new named control; these would be doubles.** `ClefControls.svelte:206` to `:216` adds a real button with its own `aria-label`. The INSIGHTS controls already are buttons with names. A second named button would break `getByRole('button', { name: 'Add your range' })` (`e2e-phone/voice-stations.test.ts:59`), which expects one, and would read twice to a screen reader. The overlay has to be a nameless, pointer-only forwarder. The two `<summary>` lines (`SingerBlock.svelte:116`, `:121`) forward cleanly, since the pane owns their state (`InsightsPane.svelte:430` to `:433`, `:528`).
4. **When to re-measure.** The clef overlay re-reads when the score's pages change (`ClefControls.svelte:104` to `:112`). INSIGHTS re-pages when a disclosure opens (`InsightsPane.svelte:458` to `:485`), so the overlay re-reads on `pages`, `moreOpen`, `revealOpen`, and `language`.

**What it would cost.** One Code lane of about this lane's size:

- one new component of roughly 120 to 160 lines (the 106 above, plus the forwarder, the visibility test, and the yield rule);
- a mount, which needs a ratchet raised on purpose: `InsightsPane.svelte` sits at its ceiling with no slack (677 of 677), and `+page.svelte` has two lines (5532 of 5534, from `node scripts/ratchets.mjs`);
- one phone test that measures each hit box;
- no new string, if the forwarders are nameless;
- **one ruling from Dann before it starts**: what happens where two targets cannot both be 44 px. Whether the result counts as conforming, or as a named constraint in the manner of N.55b, is his.

## 6. The five phone failures

I ran `phrase-ends`, `relining`, `input-views`, `insights-links`, `insights-label`, and `voice-stations` in the `phone` project on the lane: 18 passed, 5 failed, the same five the step 4 report names, with the same messages. I then set `apps/` and `scripts/` to `61536a9f` in the scratch copy and ran the first four files again.

| Failure | On the lane (mine) | On `61536a9f` (mine) | The lane's? |
| --- | --- | --- | --- |
| `input-views.test.ts:134` | fails, "The words as sung..." received | fails, same message | no |
| `phrase-ends.test.ts:26` | fails, `[data-word-index="0-77"]` not found | fails, same | no |
| `relining.test.ts:70` | fails, 1 expected, 10 received | fails, same | no |
| `relining.test.ts:95` | fails, line shape differs | fails, same | no |
| `insights-links.test.ts:32`, Drawer open on VOICE | fails, `-0.0625` | see below | no |

The step 4 report's reasoning on the four holds, and there is a second, independent reason: none of those three files opens INSIGHTS (`grep` for `insights` and `#tab-` in them returns nothing), the pane is mounted only when `studioDocument === 'insights'` (`+page.svelte:4346`), the default is `'text'` (`+page.svelte:356`), and `+page.svelte:150` is the pane's only importer. The lane's code is not on their path. `relining.test.ts:112` passed on the base tree in my run too, as the lane said. Why the four fail in a cloud sandbox is not established. Whether they fail on the Mac is not established.

**The fifth is the known flake, and I can add a fact to it.** I ran the two L1 cases five times each on each tree (`--repeat-each=5`). On `61536a9f`: 9 passed, 1 failed, "Drawer open on VOICE", received `-0.0625`. On the lane: 9 passed, 1 failed, the same case, received `-0.0625`. The same value, on both trees, at the same rate. `STATE.md:23` records the flake with its cause not established and does not record the symptom. The symptom is now known: the station lands one sixteenth of a pixel above the top edge, and the assertion at `insights-links.test.ts:46` allows zero tolerance. The cause is still not established.

None of the five is this lane's.

## 7. Verdict

**MERGE WITH FIXES.**

Before the merge: no edit to the lane.

With the merge, in the same desk close (the desk's, in `docs/memory/`, which the lane could not touch):

1. Record the tap sizes as owed, with the measured table from the step 3b report and the 20.4 px spacing from this review, so the smaller targets are named in the record and not silent. An unnamed exemption "does not exist" (`OPEN.md:2684`), so the entry says "owed", not "exempt".

After the merge, each small:

2. `apps/web/src/lib/components/Paper/PageFit.svelte:6`, `:14`, `:29`: change "two documents" and "Both Studio documents" to three, and "True in portrait on the phone, false everywhere else" to "True under the desk layout (1400 px), false at or above it."
3. `apps/web/src/lib/insights/SingerBlock.svelte:65`: the `prose` snippet lacks the `em` branch that `rich` has at `:61`, so the French key lines print literal asterisks. A separate lane; it predates this one.
4. `apps/web/e2e-phone/insights-label.test.ts:2` to `:6`: reword the header so it says the figure is now drawn at its page width at every viewport (570 page pixels by the brief's arithmetic, section 6 item 1; not measured by me). Assertions untouched.
5. `docs/memory/STATE.md:23`: add the flake's symptom (`-0.0625` at `insights-links.test.ts:46`, 1 run in 5 on both trees).
6. The tap follow-up lane of section 5, after Dann rules on the overlap.

## FOR DANN'S EYE

1. On your iPhone, try to tap "Try this key" and "Show keys that reach higher" on the merged page before you ship it: they are now about 9 px and 7 px tall, and whether that is livable until the repair is yours to say.
2. The two "Try this key" buttons sit about 20 px apart on a phone, so no repair can give each a full 44 px; which one yields, or whether both get less, is a choice only you can make.
3. On an iPad in portrait the page now shows whole at about 88 percent by the lane's measurement, and page 1 ends with a wide empty band above the footer where the rose box breaks to page 2 (`insights-viewport-768x1024-en.png`, which I looked at); say whether that reads as right.
4. The French key lines show literal asterisks around *primo* and *secondo*; it is an older fault this lane's picture made visible, and it needs your nod to queue.
5. The footer on a phone now says "PAGE 1 OF 3" where it used to say 1 of 1.
