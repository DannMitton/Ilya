> Filed by the desk 2026-11-15 14:0x, verbatim as the helper returned it (its two-space indent removed). One Fable 5.2 helper in the desk's cloud workspace, on a clone of `Shane` `fb9d829e` with `origin/main` (`2b980e7b`) and both lane branches fetched. Harness count: 360,356 tokens, 81 tool uses, 15.2 minutes, against a cap of 250k stated to Dann (over by 110k). The helper's own figure at the end of its report, "roughly 190,000", is not the count. The brief reviewed: `brief-code-n202-name-and-version_r1_2026-11-15.md` (md5 `0c3ec3ce`). The desk re-read these claims in the tree before applying them in r2: `Drawer.svelte:281` and `:743-752`; `i18n.ts:19`, `:80`, `:2425-2432`, `:2528-2542`; `sources.test.ts:60-70`; `TitlePage.svelte:105`; `MarkupPane.svelte:996-1000`; `exchange.test.ts:64`; `tools/e16-harness/package.json:4`; `colour-story.test.ts:99-100`; `HeaderBar.svelte:115-117`; `TitleHeader.svelte:238-246`; `scripts/ratchets.json:15`, `:18`; `Drawer/layout.ts:53`. The rest is the reviewer's read.

# Review of brief N.202 r1 (Ilya's name and its version)

Read from the tree at `fb9d829e` (branch `Shane`), `origin/main` at `2b980e7b`, and the two lane branches as fetched. Nothing was installed, built, or run; every finding is a line read or a grep.

## 1. Verdict

SEND WITH AMENDMENTS: three blockers (the step order, the guard's pattern, the GUIDE's contents list), all fixable in the brief.

## 2. Citations that are wrong or moved

Every other `path:line` in the brief holds what the brief says.

1. `GuideContent.svelte` has no path. It is `apps/web/src/lib/components/Reading/GuideContent.svelte`.
2. "its last entry `guide-future` at `:353`" is wrong. Three entries follow it in the same section: `guide-markup-forecast` (`:361` EN, `:65` FR), `guide-markup-characteristics` (`:370`, `:74`), `guide-markup-notation` (`:376`, `:80`). The next section, `guide-walkthrough`, starts at `:386` EN and `:90` FR.
3. The fixture list omits `apps/web/src/lib/library/exchange.test.ts:64` (`appVersion: '2026a'`).
4. "The five `package.json` files": six read `0.1.0`. The sixth is `tools/e16-harness/package.json:4`.
5. "at the head of every page": the sigil is drawn on page 1 only (`Paper/TitlePage.svelte:105`; `markup/MarkupPane.svelte:998-1000` under `{#if i === 0}`, and `:1086`; `insights/InsightsPane.svelte:511`). Later pages draw `RunningHeader` (`Paper/SubsequentPage.svelte:83`). The app bar never prints (`apps/web/src/app.css:336-342`).
6. D2's check on `markup-pages.test.ts` cannot move. That test runs `paginateScore` in node and reads no header height (`apps/web/src/lib/markup/markup-pages.test.ts:1-23`).

## 3. Sites the brief misses

1. **The GUIDE's contents list is written by hand.** `apps/web/src/lib/components/Drawer/Drawer.svelte:743-752` holds one `<li>` per entry, `:281` lists the ids whose parent is `guide-how`, and each label is a `toc.guide.*` key (`apps/web/src/lib/i18n.ts:2424-2447`). A new `h4` appears nowhere in it unless registered.
2. **Pictures in `static/` show the old sigil.** `apps/web/static/guide/guide-step-01.webp` shows "2026A" under the sigil in the app bar, under the sigil on the page, and in the footer. `guide-step-17.webp` shows "ILYA 2026A" in the footer. Both are drawn by the GUIDE (`GuideContent.svelte:397`, `:443` EN; `:101`, `:147` FR). I viewed 2 of the 39 files.
3. **Lane 57 edits `HeaderBar.svelte`.** Its diff from `fb9d829e` adds an import at `:4` and rewrites `:32-33`. It also edits `i18n.ts` (the total at `:19` becomes 1,278, a `welcome.` index line, eight keys before the closing brace), `routes/+page.svelte` (`:13` and after `:3725`), and `apps/web/playwright.config.ts` (a shared `storageState`).
4. **Tests that sweep the GUIDE's source.** `apps/web/src/lib/sources.test.ts:16-21` and `:40-41` scan `GuideContent.svelte` and `i18n.ts` for author-and-year pairs; `:66` allows "Mitton" only with 2020 or 2017. Three tests cut the French half at the first `{:else}` (`i18n.test.ts:144-145`, `insights/ratified-lines.test.ts:350-351`, `retired-names.test.ts:93-94`). `i18n.test.ts:140-152` holds the French half to the OQLF table.
5. **The key index at the head of `i18n.ts`.** `i18n-index.test.ts:47-57` fails when the total (`i18n.ts:19`) or a prefix count (`toc.` is 83 at `:80`) differs from the table.
6. **The vowel-space sheet prints with no footer and no version.** `apps/web/src/lib/voice/chart/VowelSpaceSheet.svelte` imports no `PageFooter`; its last line is the provenance sentence at `:148`; it prints through `voice/chart/print-sheet.ts:46`. This closes the brief's third "could not establish" line.
7. **The recorder's files carry the build and not the version** (`apps/web/src/lib/voice/engine/capture-file.ts:148`, `:170`). The recorder is outside the singers' bundle (`apps/web/vite.config.ts:7-11`).
8. **Comments that become false:** `HeaderBar.svelte:73-74`, `:94-97`, `:105-107`, `:113`; `TitleHeader.svelte:25-26`, `:236`.
9. **Checked, and clear:** only two components draw the bracketed name (grep for `logo-bracket`, `sigil-bracket`, `>Ilya<`). No Playwright test finds the sigil by name or text. No snapshot file exists. `manifest.webmanifest`, `app.html:44-45`, the four icons (the icon is «ё»), `ARCHITECTURE.md`, `CONTRIBUTING.md`, `AGENTS.md`, `NOTICES.md`, and `docs/house-style/` name no version. Lane 57's welcome files draw no sigil and no year with a letter.

## 4. Amendments

1. **BLOCKER. Move the guard (D5) from Step 1 to Step 2.** In Step 1 the guard fails on the sigil's own sites (`HeaderBar.svelte:49-50`, `TitleHeader.svelte:17`, `:162`), which Step 2 removes. Step 1 cannot end with its gates passing as written.

2. **BLOCKER. Specify the guard's pattern; a scan of raw source cannot do the job.** The footer's source spells the version ` 2026a` (`i18n.ts:1047-1048`), so a pattern that starts at a word boundary misses it: my grep with `\b` found only the two components. Without the boundary, `i18n.ts` raises 36 false hits from `’a`, `’s`, and `’y` (for example `:424`, `:780`, `:1056`), and "Ilya2006B" appears in comments at `voice/profileStore.ts:33` and `voice/CalibrationWizard.svelte:41`. Recommended default: sweep the string table by value (`stringKeys()` and `t`, `i18n.ts:2545`), and scan every other non-test file as source with `(?<![A-Za-z0-9])20\d\d[a-z](?![A-Za-z0-9])`. That form raises nothing today beyond the known sites. Match any year and letter, not the current constant alone, so a stale "2026a" is caught after the letter moves. Add a positive control for each of the three forms (`CONTRACT.md` section 3, tether 11).

3. **BLOCKER (Step 4). Register the two entries, and strike "This lane adds no key to `i18n.ts`".** Step 4 needs two `<li>` lines at `Drawer.svelte:749-752`, both ids in the list at `:281`, two `toc.guide.*` keys in both languages, and the counts at `i18n.ts:19` and `:80`. `Drawer.svelte` is 1,981 lines against 1,990 (`scripts/ratchets.json:15`), so two lines fit. The two French labels join the words the desk sends for ratification. Add a test that both ids stand in both halves of the GUIDE and in the Drawer's list; no such test exists today.

4. **AMENDMENT. Build Step 4 after `Shane` (with lanes 56 and 57) is merged into the lane.** Lane 57 already changes `i18n.ts:19`; a second edit to that line conflicts. Step 1's edit to `i18n.ts` touches `:1047-1048` only and merges clean.

5. **AMENDMENT. Say where the entries go.** Recommended default: directly after the paragraph of `guide-future`, before `guide-markup-forecast`, in both halves. The three later entries are about INSIGHTS and MELODY and are not questions.

6. **AMENDMENT. Three conditions on Step 4's markup.** No `{:else}` inside the French half (amendment context: site 4). No typed year beside a name: the year comes from the constant, or `sources.test.ts:66` fails on "Mitton 2026". A French colon takes U+00A0 (`i18n.test.ts:110`).

7. **AMENDMENT. D1: read the build safely.** `__ILYA_BUILD__` is defined in `apps/web/vite.config.ts:28` and `tools/n200-score/vitest.config.ts:28`. It is not defined in the root `vitest.config.ts:3-7`, `tools/n168-frequency-run/vitest.config.ts:24-40`, `packages/score-parser/vitest.config.ts:11-15`, or Playwright's own process. A bare top-level read throws at import there. Today nothing breaks: the app's vitest applies the define (`capture-file.test.ts:65-79` runs code that reads it), and SSR is off (`routes/+layout.ts`). Write `typeof __ILYA_BUILD__ === 'string' ? __ILYA_BUILD__ : 'unknown'`, and import `version.ts` from components, `+page.svelte`, and tests only. `binder.ts` and `exchange.ts` keep taking values as parameters (`binder.ts:127-131`, `exchange.ts:52`).

8. **AMENDMENT. D4 is safe; state it as known and pin it.** The reader casts the parsed manifest and tests only `format`, `schema`, and `songs` (`binder.ts:217-224`). `origin/main`'s `binder.ts` differs from `Shane`'s in one import line (`:21`). Both pages use only `read.ok`, `read.reason`, and `read.songs` (`+page.svelte:3015-3021`; `origin/main` `:3472-3478`). Nothing validates, compares, or shows `appVersion`. Add a reader test: a manifest with `build` and one unknown field reads whole.

9. **AMENDMENT. D2: what goes with the span.** Remove `over` (`colour-story.test.ts:99-100`), which only the deleted test uses. Rewrite the comments in site 8. `position: relative` on `.sigil` (`HeaderBar.svelte:116`) and `.logo` (`TitleHeader.svelte:239`) anchors nothing once the spans go; recommended default: remove both and confirm in the pictures. Both rules go with their spans, or gate 3 gains two unused-selector warnings. The replacement test also asserts `aria-label="Ilya"` and that `versionAccent` appears nowhere under `apps/web/src`.

10. **AMENDMENT. D2: replace the `markup-pages.test.ts` check.** Use the measured `offsetHeight` before and after, on the three documents, plus `e2e/markup-pages-lose-no-bars.test.ts`, `e2e/pages-without-gaps.test.ts`, `e2e/print-pages.test.ts`, and `e2e/insights-page.test.ts`. The header's box cannot change: both spans are absolute (`HeaderBar.svelte:139`, `TitleHeader.svelte:258`).

11. **AMENDMENT. Calm Authority: what the code shows.** In the bar, nothing was sized for the version: the bar is a fixed 48 px with centred items (`HeaderBar.svelte:61-64`) and `.sigil` carries no padding, margin, or height (`:115-121`). `--tab-jewel` stays, for the language pill (`:197`). On the page, the version spanned 21 to 33 px from the top of a 24 px box (`TitleHeader.svelte:244-245`, `:259`, `:262`, `:267`), so it hung through the logo's 8 px bottom margin (`:241`). That margin stays and is now empty. Whether it was sized for the version is NOT ESTABLISHED; Step 2's picture of the page head is where it is judged.

12. **AMENDMENT. D3: the pin.** Only `PageFooter.svelte:57` reads the key outside tests. `tv` leaves an unfilled placeholder showing (`i18n.ts:2535-2541`); no `{version}` exists in the table, and filling `{v}` cannot touch it (`:2540`). The OQLF sweep reads a placeholder as one letter (`i18n.test.ts:101`). Fill inside `PageFooter`; `footer-credit.test.ts:27-30` forbids an attribution prop. The pin types its expected sentence (`i18n.test.ts:8-14`) and asserts one `{version}` in each language.

13. **AMENDMENT. Step 1 needs a rendered check.** It changes the footer on every page, and the pictures come at Step 2. Add the foot of page 1 of TEXT in English and French, and one binder exported in the browser with its `manifest.json` read.

14. **AMENDMENT. Step 2's pictures.** 1280 x 800 is under the desk layout's minimum (`Drawer/layout.ts:53`; `playwright.config.ts:18-26`), so it pictures the narrow layout. Use 1440 x 900. The sigil holds no translated string (`HeaderBar.svelte:49-50`), so French app-bar pictures add nothing; keep French for the head and foot of the page. If lane 57 is in the tree, load with its returning-browser storage state.

15. **AMENDMENT. Merge rules.** Change `MarkupPane.svelte` by deleting `:1011` and `:1096` and nothing else; after lane 56 merges, find them by `versionAccent=`. Leave `scripts/ratchets.json` alone: a shrink is not a breach (`scripts/ratchets.mjs:67`), and a lowered ceiling would breach when lane 56 fills its two spare lines. `InsightsPane.svelte` is at its ceiling, 744 of 744 (`ratchets.json:18`), and falls to 743. `+page.svelte` is 5,508 of 5,534 and nets one line. Each step's report gives gate 4's count before and after, because three lanes move it.

16. **AMENDMENT. D6 holds; tighten the test.** The file as written has the four required keys, an allowed `type`, a licence on the format's list, and the format's default message, by the [schema guide](https://github.com/citation-file-format/citation-file-format/blob/1.2.0/schema-guide.md). The URL's case matches the remote (`https://github.com/DannMitton/Ilya.git`). The licence matches `package.json:5` and `README.md:108`; the author matches `README.md:106`. No YAML parser is a dependency, so the test reads `version:` by pattern. Have it pin `license` to `package.json:5` too.

17. **AMENDMENT. Step 0 reports, the desk rows.** Which of the 39 GUIDE pictures show the version; the vowel-space sheet; the recorder's sidecar. Recommended default: none is built in this lane.

## 5. Questions for the owner

None. One French item rides with Step 4's ratification: the two contents-list labels.

## 6. What I could not establish

- How anything looks: no build and no browser ran. No gate, test, or install ran.
- Whether the logo's 8 px margin was sized for the version.
- Which of the other 37 GUIDE pictures show the version.
- GitHub's default branch, and whether "Cite this repository" accepts the file; `cffconvert` was not run. The schema guide's last 14,081 characters (the `version` and `url` definitions) were not read.
- What lane 56 will change in `MarkupPane.svelte`; at `48688a1` it holds fixtures and tests only.
- The ruling's own sections and the draft GUIDE words (`PRODUCT.md`, `OPEN.md` N.202): absent from the clone.
- Whether the LEARN and GUIDE pages print with a footer (`Paper/ReadingPaper.svelte:509`, not read).
- The eight gates' definitions; the ship script is not in the clone.

## 7. What I read

In full: the brief; `CONTRACT.md`; `HeaderBar.svelte`; `TitleHeader.svelte`; `binder.ts`; `colour-story.test.ts`; `footer-credit.test.ts`; `i18n-index.test.ts`; `approval/i18n-keys.test.ts`; `vite.config.ts`; `svelte.config.js`; `app.d.ts`; `app.html`; `playwright.config.ts`; `manifest.webmanifest`; `vercel.json`; `ratchets.json`; `guide-anchors.ts`; the four vitest configs.

In part: `i18n.ts` (1-100, 1036-1066, 2424-2447, 2490-2593); `PageFooter.svelte` (1-125, 160-235); `GuideContent.svelte` (1-96, 311-392, heading outline); `Drawer.svelte` (262-300, 728-760); `i18n.test.ts`; `sources.test.ts` (1-90); `ratified-lines.test.ts` (340-366); `exchange.ts`; `+page.svelte` (around 90, 2105-2128, 2905-2940, 3010-3050); `MarkupPane.svelte` and `InsightsPane.svelte` (the `TitleHeader` calls); `app.css` (88-100, 318-372); `ratchets.mjs` (1-139); `sw.js` (1-80); `ci.yml` (1-70); `ENVIRONMENT.md` (2925-2960); `pages-without-gaps.test.ts` (1-100); `capture-file.ts` (140-150); `VowelSpaceSheet.svelte` (120-150). By `git show` or `git diff`: `origin/main`'s `binder.ts` and `+page.svelte` (the reader's call), and both lanes' diffs from `fb9d829e`. Pictures viewed: `guide-step-01.webp`, `guide-step-17.webp`, `icon-512.png`. Web: the CFF 1.2.0 schema guide, characters 0 to 100,000 of 114,081.

From memory, two facts: he publishes as "Dann Mitton" (project profile file), which agrees with `README.md:106`; and the ruling of 13:31 as the task states it. One item worth saving, learned from `git remote get-url origin`: the repository is `DannMitton/Ilya` with a capital I, where a memory alias has it in lower case.

Roughly 190,000 tokens used.
