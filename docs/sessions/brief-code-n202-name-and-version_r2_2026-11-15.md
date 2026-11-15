# Brief to Code: N.202, Ilya's name and its version

r2, 2026-11-15 14:1x, from the desk (Fable 5.2). r2 applies all seventeen amendments of Fable's review of r1 (`review-fable-brief-n202_r1_2026-11-15.md`, SEND WITH AMENDMENTS, three blockers) and its six corrections to r1's citations; "Where each amendment went" is the last section. r1 is superseded. Ruled by Dann 2026-11-15 13:31 and 13:35: `docs/memory/PRODUCT.md`, last section, "ILYA'S NAME AND ITS VERSION"; the spec is `docs/memory/OPEN.md`, last section, N.202. Read both in full first.

Lane: `cloud-lane-58` (DESK DEFAULT number), cut from `Shane` at the commit the desk names. Two lanes run beside it, cut from `fb9d829e`:

- Lane 56 (strophic lane A) edits `apps/web/src/lib/markup/MarkupPane.svelte` and adds keys to `i18n.ts`.
- Lane 57 (the welcome sheet) edits `apps/web/src/lib/components/HeaderBar.svelte` (an import at `:4`, and `:32-33`), `i18n.ts` (the total at `:19`, a `welcome.` line in the index, eight keys), `routes/+page.svelte`, and `apps/web/playwright.config.ts` (a shared `storageState` for a returning browser).

Steps 1 to 3 add no key to `i18n.ts`. Step 4 adds two, and is built only after `Shane` with lanes 56 and 57 has been merged into this lane.

No git writes outside your lane. Change nothing under `docs/memory/`, and do not edit, rename, or replace a brief. Gates before and after every step, and each step's report gives gate 4's count before and after, because three lanes move it. Canadian spelling, the Oxford comma, no em dashes. NOT ESTABLISHED beats a complete invented answer.

## What the singer gets

1. **The sigil reads [Ilya] and nothing else,** in the app bar and at the head of page 1 of TEXT, MELODY, and INSIGHTS, on screen and in print. "The sigil" is Dann's word for that device (13:31). In comments and reports it is never "the badge" or "the mark".
2. **The footer of every page names the version, 2026b,** in both languages. The ratified words of the footer do not change; only the version does.
3. **A binder exported from Ilya names its version and its build.**
4. **The GUIDE says which Ilya this is, and how to cite it** (Step 4, built only after Dann ratifies the words).
5. **The repository carries a citation file.**

The rule behind the letter (ruled 13:31): it advances each time `main` moves, and at no other time. The release of 2026-11-20 is 2026b. The public app shows 2026a today.

## Where the version is typed by hand today

Read by the desk and by the reviewer in the tree at `fb9d829e`. Step 0 re-reads every line. Paths are under `apps/web/src/lib/` unless they begin elsewhere.

- **The sigil in the app bar:** `components/HeaderBar.svelte:49-50` (`aria-label="Ilya 2026a"`, and `<span class="sigil-version">2026a</span>`); its rule `.sigil-version` at `:138-158`. The app bar never prints (`apps/web/src/app.css:336-342`).
- **The sigil on a page:** `components/Paper/TitleHeader.svelte:162` (`<span class="logo-version" style="color: {versionAccent}">2026a</span>`); the prop `versionAccent` at `:17-21` and `:72`; the rule `.logo-version` at `:257-268`. It is drawn on page 1 only: `components/Paper/TitlePage.svelte:105`; `markup/MarkupPane.svelte:998-1000` (under `{#if i === 0}`) and `:1086`; `insights/InsightsPane.svelte:511`. Later pages draw `RunningHeader` (`components/Paper/SubsequentPage.svelte:83`). Callers that pass `versionAccent`: `insights/InsightsPane.svelte:520`, `markup/MarkupPane.svelte:1011`, and `:1096`.
- **The footer:** `i18n.ts:1047-1048`, `footer.attribution`, English and French, each holding the name in `<em>`, the escape for a no-break space, then `2026a`. `components/Paper/PageFooter.svelte:57` is its only reader outside tests, drawn at `:96`. `components/footer-credit.test.ts` names the string, and `:27-30` forbids an attribution prop on the footer.
- **The old version's contrast test:** `colour-story.test.ts:126-135`, with the helper `over` at `:99-100`, which nothing else uses.
- **The binder:** `apps/web/src/routes/+page.svelte:90` imports `version` from `$app/environment`, and `:2925` passes it as `appVersion` (its only two uses in that file). `apps/web/svelte.config.js:18-22` names no version, so the value is SvelteKit's build stamp. It travels through `library/exchange.ts:52` and `:121` into the manifest (`library/binder.ts:36`, `:129`, `:142-146`). The reader casts the parsed manifest and tests only `format`, `schema`, and `songs` (`library/binder.ts:217-224`); `origin/main`'s reader is the same but for one import line. `binder.ts` holds bytes that make `grep` call it binary: use `grep -a`.
- **Tests that use `'2026a'` as a fixture value:** `library/binder.test.ts` (asserted at `:175`), `library/salvage.test.ts`, `library/barline-record.test.ts`, `library/exchange.test.ts:64`.
- **The build id:** `apps/web/vite.config.ts:13-20` and `:28` define `__ILYA_BUILD__`, the commit's first eight characters; declared at `apps/web/src/app.d.ts:13`. `tools/n200-score/vitest.config.ts:28` defines it too. The root `vitest.config.ts`, `tools/n168-frequency-run/vitest.config.ts`, `packages/score-parser/vitest.config.ts`, and Playwright's own process do not.
- **Pictures:** `apps/web/static/guide/guide-step-01.webp` and `guide-step-17.webp` show the old version (the reviewer viewed 2 of the 39 files there). Not this lane's to change.
- No file under `e2e/` or `e2e-phone/` finds the sigil by name or text, and no snapshot file exists.
- Six `package.json` files read `"version": "0.1.0"` (the five packages and `tools/e16-harness/package.json:4`). They are not part of this lane: npm's field cannot hold "2026b".

## Design (DESK DEFAULT unless marked ruled)

### D1. One home for the version

A new module, `apps/web/src/lib/version.ts`, holds: `ILYA_VERSION = '2026b'`; `ILYA_BUILD`, read safely as `typeof __ILYA_BUILD__ === 'string' ? __ILYA_BUILD__ : 'unknown'`, because a bare read throws at import where the constant is not defined; and the version's year, its first four characters as a number. Import it from components, `+page.svelte`, and tests only. `binder.ts` and `exchange.ts` keep taking their values as parameters. At a release the desk changes the one line.

### D2. The sigil carries the name alone (ruled)

- `HeaderBar.svelte`: the `sigil-version` span and its whole rule go; `aria-label` becomes "Ilya".
- `TitleHeader.svelte`: the `logo-version` span, the `versionAccent` prop, and the whole rule go, and the three callers stop passing the prop. In `MarkupPane.svelte` delete the two `versionAccent=` lines and change nothing else there; after lane 56 merges, find them by that text, not by number.
- Both rules go with their spans, or gate 3 gains two unused-selector warnings.
- `position: relative` on `.sigil` (`HeaderBar.svelte:116`) and on `.logo` (`TitleHeader.svelte:239`) anchors nothing once the spans go. Remove both and confirm in the pictures that nothing moved.
- Comments that become false are rewritten: `HeaderBar.svelte:73-74`, `:94-97`, `:105-107`, `:113`; `TitleHeader.svelte:25-26`, `:236`. Class names that say `logo` stay; a comment the lane touches says "the sigil".
- `colour-story.test.ts:126-135` goes with the version, and `over` (`:99-100`) with it. In its place, a test that neither component's markup holds a version, that the app bar's sigil has `aria-label="Ilya"`, and that `versionAccent` appears nowhere under `apps/web/src`.
- **Nothing else is expected to move:** both spans are `position: absolute` (`HeaderBar.svelte:139`, `TitleHeader.svelte:258`). Show it by the title header's measured `offsetHeight` before and after on TEXT, MELODY, and INSIGHTS (`bind:offsetHeight` at `TitleHeader.svelte:159`), and by `e2e/markup-pages-lose-no-bars.test.ts`, `e2e/pages-without-gaps.test.ts`, `e2e/print-pages.test.ts`, and `e2e/insights-page.test.ts`.
- **Calm Authority, as the code reads.** In the bar nothing was sized for the version: the bar is a fixed 48 px with centred items (`HeaderBar.svelte:61-64`), and `.sigil` carries no padding, margin, or height. On the page the version hung through the sigil's 8 px bottom margin (`TitleHeader.svelte:241`); that margin stays and is now empty. Whether it was sized for the version is NOT ESTABLISHED. Change no spacing. Look at the sigil in the bar and on the page once nothing hangs under the name, and if either reads as off-centre or loose, say so beside its picture; the desk decides.

### D3. The footer reads the constant

`footer.attribution` takes a `{version}` placeholder where "2026a" stands, in both languages. `PageFooter.svelte` fills it itself through `tv` (`i18n.ts:2538`) with `ILYA_VERSION`; no prop carries it. Every other character of both strings stays as it is. The pin moves with it: it types its expected sentence in each language (as `i18n.test.ts:8-14` does) and asserts exactly one `{version}` in each stored string.

### D4. The binder names what made it

`appVersion` becomes `ILYA_VERSION`. The manifest gains one optional field, `build`, holding `ILYA_BUILD`; the schema number stays 1. This is safe by the reader's own lines (`library/binder.ts:217-224`, here and at `origin/main`): nothing validates, compares, or shows `appVersion`, and an unknown field is ignored. Pin it with a reader test: a manifest that carries `build` and one field the reader does not know reads whole. If `version` from `$app/environment` has no other use in `+page.svelte`, its import goes.

### D5. A guard (in Step 2, after the sigil's sites are gone)

A test fails if a year and a letter stand as a version anywhere a singer could read it:

- It sweeps the string table by value, in both languages (`stringKeys()` and `t`, `i18n.ts:2545`).
- It scans every other non-test file under `apps/web/src`, `version.ts` aside, as source, with `(?<![A-Za-z0-9])20\d\d[a-z](?![A-Za-z0-9])`.
- It matches any year and letter, not the current constant alone, so a stale "2026a" is caught after the letter moves.
- It carries a positive control for each of the three forms found today (the attribute, the footer's string, the bare span), so the pattern is shown to catch what it is for (`CONTRACT.md` section 3, tether 11).
- A hit that is a true citation with a letter, should one ever appear, is allowed by name in the test with its reason.

By the reviewer's grep, that pattern raises nothing today beyond the known sites. Step 0 repeats the grep and reports any other hit.

### D6. The citation file

`CITATION.cff` at the repository's root. Its content, and nothing more:

```
cff-version: 1.2.0
message: "If you use this software, please cite it using the metadata from this file."
title: "Ilya"
type: software
authors:
  - family-names: "Mitton"
    given-names: "Dann"
version: "2026b"
url: "https://ilya.dannmitton.com"
repository-code: "https://github.com/DannMitton/Ilya"
license: "AGPL-3.0-only"
```

The message is the format's own default sentence. `date-released` is added by the desk on the day `main` moves. No abstract: Dann has ratified no words for one. No YAML parser is a dependency, so the test reads the file by pattern: its `version` equals `ILYA_VERSION`, and its `license` equals the licence in the root `package.json:5`.

### D7. The GUIDE's two entries (Step 4, after ratification and after the merge)

- **Where:** in `components/Reading/GuideContent.svelte`, directly after the paragraph of `guide-future` and before `guide-markup-forecast`, in both halves (English `guide-future` at `:353`, `guide-markup-forecast` at `:361`; French `:58` and `:65`). Ids `guide-version` and `guide-cite`, in the form the section's questions have: an `h4` and a paragraph.
- **The contents list is written by hand, so register both:** two `<li>` lines after the `guide-future` item in `components/Drawer/Drawer.svelte` (`:749`; the file is 1,981 lines against a ceiling of 1,990, `scripts/ratchets.json:15`); both ids in the list of `guide-how`'s children at `:281`; two `toc.guide.*` keys in both languages beside `i18n.ts:2432`; and the counts in the index at the head of `i18n.ts` (the total at `:19`, `toc.` at `:80`), which `i18n-index.test.ts:47-57` checks.
- **The values come from D1:** the version, the year, and the build. Nothing is typed by hand. In particular no year is typed beside the name Mitton: `sources.test.ts:66` allows that name only with 2020 or 2017.
- **Two conditions on the French half:** no `{:else}` inside it (three tests cut the French half at the first one: `i18n.test.ts:144-145`, `insights/ratified-lines.test.ts:350-351`, `retired-names.test.ts:93-94`), and a no-break space, U+00A0, before each colon (`i18n.test.ts:110`).
- **The words** are drafts before Dann (`OPEN.md`, N.202): two headings, two paragraphs, and two contents-list labels, each in English and French. They are NOT RATIFIED. Until the desk sends the ratified words to this session, Step 4 is not built.
- **Tests:** both languages pinned in `insights/ratified-lines.test.ts`; and a new test that both ids stand in both halves of the GUIDE and in the Drawer's list.

## Steps

0. **Read and report. Change nothing.** The eight gates. Every line this brief cites, with any that moved. The title header's `offsetHeight` on TEXT, MELODY, and INSIGHTS. The guard's grep (D5). The ratchet line of every file you will touch. Three rows for the desk, report only, nothing built: which of the 39 pictures in `apps/web/static/guide/` show the version; the vowel-space sheet, which prints with no footer and no version (`voice/chart/VowelSpaceSheet.svelte`, through `voice/chart/print-sheet.ts:46`); the recorder's files, which carry the build and not the version (`voice/engine/capture-file.ts:148`, `:170`). Whether LEARN and GUIDE pages print a footer (`components/Paper/ReadingPaper.svelte`).
1. **The constant, the footer, the binder** (D1, D3, D4), with tests. A rendered check, looked at: the foot of page 1 of TEXT in English and in French; and one binder exported in the browser, its `manifest.json` read. One commit, one report.
2. **The sigil and the guard** (D2, D5), with tests. Pictures before and after, each looked at: the app bar on TEXT, MELODY, INSIGHTS, LEARN, and GUIDE at 1440 x 900 and at 390 x 844, in English only (the sigil holds no translated string); the head and the foot of page 1 of TEXT, MELODY, and INSIGHTS, in English and in French; a printed PDF of one TEXT page, letter size. 1440 is used because 1280 is under the desk layout's least width (`components/Drawer/layout.ts:53`). If lane 57 is in the tree, load with its returning-browser storage state. One commit, one report.
3. **The citation file** (D6), with its test. One commit.
4. **The GUIDE's entries** (D7). Only after two things: `Shane`, with lanes 56 and 57 merged, has been merged into this lane; and the desk has sent the ratified words. One commit, with pictures of both entries and of the contents list, English and French.
5. **Close.** Merge `Shane`, all eight gates, the Playwright suite (desktop and phone), and the final report, `docs/sessions/report-code-n202-name-and-version_r1_<date>.md`, with its pictures in `docs/sessions/report-code-n202-pictures/`.

If Step 4's two conditions are not met when Step 3 is done, do Step 5 for Steps 1 to 3, push, and stop. Step 4 follows on the desk's message.

## Merge rules

- `MarkupPane.svelte`: the two deleted lines and nothing else (D2).
- Leave `scripts/ratchets.json` alone. A file that shrinks is not a breach (`scripts/ratchets.mjs:67`), and a lowered ceiling would breach when lane 56 uses its two spare lines in `MarkupPane.svelte`. `InsightsPane.svelte` stands at its ceiling, 744 of 744, and falls to 743. `+page.svelte` stands at 5,508 of 5,534.
- Step 1's edit to `i18n.ts` touches `:1047-1048` only. Step 4's edit to the index at `:19` waits for the merge, because lane 57 changes that line.

## Computations this lane changes (`CONTRACT.md` section 4)

None. One stored value changes its meaning: a binder's `appVersion` goes from a build stamp to the version's name. Nothing reads it back (D4).

## Not in this lane

The licence sentences of `README.md` and `NOTICES.md` (the desk's, done). The git tag, the GitHub release, and the announcement (Dann's and the desk's, on the day `main` moves). The six `package.json` versions. A mark for a development build. The GUIDE's pictures. A footer for the vowel-space sheet. The welcome sheet (lane 57), which names no version.

## What the desk could not establish

- Whether the sigil looks balanced with nothing under the name, and whether the 8 px under the page's sigil was sized for the version. Step 2's pictures show it.
- Which of the other 37 GUIDE pictures show the version (Step 0).
- Whether GitHub's "Cite this repository" accepts the file as written; a `cffconvert` check is welcome if the tool installs.
- Whether LEARN and GUIDE pages print a footer (Step 0).
- The review ran no code and no browser: every finding in it is a line read or a grep.

## Where each amendment went

Citations: 1 and 2, D7 and the paths' note; 3 and 4, "Where the version is typed by hand today" and "Not in this lane"; 5, "What the singer gets" and the sigil's entry; 6, D2. Amendments: A1, Steps 1 and 2. A2, D5. A3, the Lane section and D7. A4, the Lane section, Step 4, and the merge rules. A5 and A6, D7. A7, D1. A8, D4. A9 and A10, D2. A11, D2 (Calm Authority). A12, D3. A13, Step 1. A14, Step 2. A15, D2 and the merge rules. A16, D6. A17, Step 0.
