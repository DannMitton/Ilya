# Brief to Code: N.202, Ilya's name and its version

r1, 2026-11-15 13:4x, from the desk (Fable 5.2). NOT YET Fable-reviewed; it is not sent before that review is applied (`CONTRACT.md` section 1 item 19). Ruled by Dann 2026-11-15 13:31 and 13:35: `docs/memory/PRODUCT.md`, last section, "ILYA'S NAME AND ITS VERSION"; the spec is `docs/memory/OPEN.md`, last section, N.202. Read both in full first.

Lane: `cloud-lane-58` (DESK DEFAULT number), cut from `Shane` at the commit the desk names. Lanes 56 (strophic lane A) and 57 (the welcome sheet) run beside it: lane 56 edits `markup/MarkupPane.svelte`, and both add keys to `i18n.ts`. This lane adds no key to `i18n.ts`.

No git writes outside your lane. Change nothing under `docs/memory/`, and do not edit, rename, or replace a brief. Gates before and after every step. Canadian spelling, the Oxford comma, no em dashes. NOT ESTABLISHED beats a complete invented answer.

## What the singer gets

1. **The sigil reads [Ilya] and nothing else,** in the app bar and at the head of every page, on screen and in print. "The sigil" is Dann's word for that device (13:31). In comments and reports it is never "the badge" or "the mark".
2. **The footer of every page names the version, 2026b,** in both languages. The ratified words of the footer do not change; only the version does.
3. **A binder exported from Ilya names its version and its build.**
4. **The GUIDE says which Ilya this is, and how to cite it** (Step 4, built only after Dann ratifies the words).
5. **The repository carries a citation file.**

The rule behind the letter (ruled 13:31): it advances each time `main` moves, and at no other time. The release of 2026-11-20 is 2026b. The public app shows 2026a today.

## Where the version is typed by hand today

Read by the desk in the tree at `fb9d829e`, 2026-11-15 13:3x. Step 0 re-reads every line.

- **The sigil in the app bar:** `apps/web/src/lib/components/HeaderBar.svelte:49-50` (`aria-label="Ilya 2026a"`, and `<span class="sigil-version">2026a</span>`); its rule `.sigil-version` at `:138-158`.
- **The sigil at the head of a page:** `apps/web/src/lib/components/Paper/TitleHeader.svelte:162` (`<span class="logo-version" style="color: {versionAccent}">2026a</span>`); the prop `versionAccent` at `:17-21` and `:72`; the rule `.logo-version` at `:257-268`. Callers that pass `versionAccent`: `insights/InsightsPane.svelte:520`, `markup/MarkupPane.svelte:1011`, and `:1096`.
- **The footer:** `apps/web/src/lib/i18n.ts:1047-1048`, `footer.attribution`, English and French, each holding `<em>Ilya</em> 2026a`; read at `Paper/PageFooter.svelte:57` and drawn at `:96`. `footer-credit.test.ts` names the string.
- **The badge's contrast test:** `apps/web/src/lib/colour-story.test.ts:126-135`.
- **The binder:** `routes/+page.svelte:90` imports `version` from `$app/environment` and `:2925` passes it as `appVersion` (its only two uses in that file, by grep). `svelte.config.js:18-22` names no version, so the value is SvelteKit's build stamp. It travels through `library/exchange.ts:52` and `:121` into the manifest, `library/binder.ts:36`, `:129`, `:142-146`; the reader's schema test is `:223`. `binder.ts` holds bytes that make `grep` call it binary: use `grep -a`.
- **Tests that use `'2026a'` as a fixture value:** `library/binder.test.ts` (asserted at `:175`), `library/salvage.test.ts`, `library/barline-record.test.ts`.
- **The build id:** `apps/web/vite.config.ts:13-20` and `:28` define `__ILYA_BUILD__`, the commit's first eight characters; declared at `src/app.d.ts:13`.
- No file under `e2e/`, `e2e-phone/`, or `static/` names the version (grep for `2026a`, case-insensitive).
- The five `package.json` files read `"version": "0.1.0"`. They are not part of this lane: npm's field cannot hold "2026b".

## Design (DESK DEFAULT unless marked ruled)

### D1. One home for the version

A new module, `apps/web/src/lib/version.ts`, holds: `ILYA_VERSION = '2026b'`; `ILYA_BUILD`, which is `__ILYA_BUILD__`; and the version's year, its first four characters as a number. Nothing else in `apps/web/src` outside tests types a version. At a release the desk changes this one line.

### D2. The sigil carries the name alone (ruled)

- `HeaderBar.svelte`: the `sigil-version` span and its rule go; `aria-label` becomes "Ilya".
- `TitleHeader.svelte`: the `logo-version` span, the `versionAccent` prop, and the rule go, and the three callers stop passing the prop. Class names that say `logo` stay as they are; a comment the lane touches says "the sigil".
- `colour-story.test.ts:126-135` goes with the badge. In its place, a test that neither component's markup holds a version.
- Both version spans are `position: absolute`, so nothing else is expected to move. Step 0 measures the title header's height before any edit (`bind:offsetHeight` at `TitleHeader.svelte:159`); Step 2 shows it unchanged, and shows that the page counts of the tracked scores in `markup-pages.test.ts` do not move.
- Calm Authority: look at the sigil in the bar and at the head of the page once nothing hangs under the name. If it reads as off-centre or crowded, say so with the picture and change nothing; the desk decides.

### D3. The footer reads the constant

`footer.attribution` takes a `{version}` placeholder where "2026a" stands, in both languages, and `PageFooter.svelte` fills it through `tv` (`i18n.ts:2538`) with `ILYA_VERSION`. Every other character of both strings stays as it is. Step 0 lists every reader of the key, because a reader that calls `t` would print the placeholder. The pin in `footer-credit.test.ts` moves with it and asserts the filled sentence in both languages.

### D4. The binder names what made it

`appVersion` becomes `ILYA_VERSION`. The manifest gains one optional field, `build`, holding `ILYA_BUILD`; the schema number stays 1, because the field is additive. Step 0 reads what today's reader does with a manifest field it does not know, here and at `origin/main` (`git show origin/main:apps/web/src/lib/library/binder.ts`), because a binder written by 2026b may be opened by a copy of the public 2026a build that has not yet updated. If either reader refuses an unknown field, stop and report before adding it. If `version` from `$app/environment` has no other use in `+page.svelte`, its import goes.

### D5. A guard

A test fails if any file under `apps/web/src`, tests and `version.ts` aside, holds a year-and-letter version beside the name Ilya (the three forms found today: `Ilya 2026a` in an attribute, ` 2026a` after `<em>Ilya</em>`, and a bare `>2026a<` in the sigil). It reads `ILYA_VERSION` so it holds for the next letter too. Step 0 reports any false hit, such as an author-date citation with a letter.

### D6. The citation file

`CITATION.cff` at the repository's root, with a test that its `version` equals `ILYA_VERSION`. Its content, and nothing more:

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

The message is the format's own standard sentence. `date-released` is added by the desk on the day `main` moves. No abstract: Dann has ratified no words for one.

### D7. The GUIDE's two entries (Step 4, after ratification only)

Two entries at the end of "How Ilya Works" (`GuideContent.svelte`, English `guide-how` at `:315`, its last entry `guide-future` at `:353`; French `:20` and `:58`), with the ids `guide-version` and `guide-cite`, in the form the section's entries already have (an `h4` question and a paragraph). They read `ILYA_VERSION`, the year, and `ILYA_BUILD` from D1; nothing is typed by hand. The words are drafts before Dann (`OPEN.md`, N.202) and are NOT RATIFIED. Until the desk sends the ratified English and French to this session, Step 4 is not built. When it is built, both languages are pinned in `ratified-lines.test.ts`.

## Steps

0. **Read and report. Change nothing.** The eight gates. Every line this brief cites, with any that moved. Every reader of `footer.attribution`. What the binder's reader does with an unknown manifest field, here and at `origin/main`. The title header's measured height on a TEXT page, a MELODY page, and an INSIGHTS page. Every printed or saved thing Ilya makes (pages, the binder, the vowel-space sheet from Calibrate, anything else) and whether it carries `PageFooter` or any version: report only. How the GUIDE's contents list picks up a new `h4`. The ratchet line of every file you will touch (`markup/MarkupPane.svelte` stood at 1362 of 1364 before lane 56). Any false hit for D5.
1. **The constant, the footer, the binder, the guard** (D1, D3, D4, D5), with tests. One commit, one report.
2. **The sigil** (D2), with tests. Pictures before and after, each looked at: the app bar on TEXT, MELODY, INSIGHTS, LEARN, and GUIDE at 1280 x 800 and at 390 x 844, in English and in French; the head and the foot of page 1 of TEXT, MELODY, and INSIGHTS; a printed PDF of one TEXT page, letter size. One commit, one report.
3. **The citation file** (D6), with its test. One commit.
4. **The GUIDE's entries** (D7), only on the desk's message with the ratified words.
5. **Close.** Merge `Shane`, all eight gates, the Playwright suite (desktop and phone), and the final report, `docs/sessions/report-code-n202-name-and-version_r1_<date>.md`, with its pictures in `docs/sessions/report-code-n202-pictures/`.

## Computations this lane changes (`CONTRACT.md` section 4)

None. One stored value changes its meaning: a binder's `appVersion` goes from a build stamp to the version's name. By grep, nothing reads it back (`exchange.ts:52`, `:121`, `+page.svelte:2925`, and `binder.ts` are its only sites outside tests); Step 0 confirms.

## Not in this lane

The licence sentences of `README.md` and `NOTICES.md` (the desk's, done). The git tag, the GitHub release, and the announcement (Dann's and the desk's, on the day `main` moves). The five `package.json` versions. A mark for a development build. The welcome sheet (lane 57), which names no version.

## What the desk could not establish

- Whether the sigil looks balanced with nothing under the name. Step 2's pictures show it.
- What a 2026a copy does with a 2026b binder (D4, Step 0).
- Whether the vowel-space sheet or any other printed thing carries a footer today (Step 0).
- Whether GitHub's "Cite this repository" accepts the file as written; a `cffconvert` check is welcome if the tool installs.
