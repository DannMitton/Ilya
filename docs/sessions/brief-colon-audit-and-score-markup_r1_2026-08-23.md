# BRIEF TO CODE. The colon audit, and the Score markup rename

Serves the one thing, ruled by Dann 2026-08-23. Floor: `cc3b912`. Working
tree clean at the open.

## The ruling this enforces

Dann, 2026-08-21, checked against the Government of Canada's *Clés de la
rédaction* and the OQLF's *Vitrine linguistique*: **Canadian French puts a
hard space before `:` and no space before `?`, `!`, or `;`.** Ship 5
(`9f11490`) repaired the 47 question-mark sites. The colon, exclamation, and
semicolon sites were flagged and left. Ilya's French still follows France on
those three marks.

## Part A. The rename, first, one string

`apps/web/src/lib/i18n.ts:41`:
`'tab.markedScore': { en: 'Marked score', fr: 'Partition annotée' }`.
Change `en` to `Score markup`. **Leave `fr` exactly as it is**; Dann ruled
the French stays. The key name stays `tab.markedScore`. Code comments that
say "Marked score" (`HeaderBar.svelte:77`, `DeskHead.svelte:9` and `:50`,
`destinations.ts:22`, `+page.svelte:2878`, `app.css:78`) may be updated or
left; they are not the singer's. The Guide and Learn prose never use the
phrase, checked case-insensitively on `cc3b912`.

## Part B. The audit

Three files: `apps/web/src/lib/components/Reading/LearnContent.svelte`,
`apps/web/src/lib/components/Reading/GuideContent.svelte`, and
`apps/web/src/lib/i18n.ts`. **Both Svelte files hold English and French in
one file, split on `{#if language === 'fr'}` blocks. `i18n.ts` holds them
side by side in `{ en, fr }` objects.** English takes no space before any of
the four marks, so every decision needs to know which language the site is
in.

**Step 1. Enumerate the spellings before you count anything.** This tree
writes a non-breaking space at least five ways: `&#160;`, `&nbsp;`, the
literal U+00A0, the narrow U+202F, and a site where the mark sits at the
start of its own source line so the newline becomes the space. STATE.md
records four wrong counts in one day from skipping this. Report the
spelling census per file before you change a byte.

**Step 2. The rules, per site, French only.**

- `:` in French prose: exactly one hard space before it. Desk survey on
  `cc3b912`, rough and to be replaced by yours: `LearnContent` already
  carries about 151 hard-space colons and about 91 ASCII-space colons;
  `GuideContent` carries none hard and about 27 ASCII; `i18n.ts` about 8
  ASCII. An ASCII space before a French colon becomes a hard space. A bare
  French colon with no space gets one. Use one spelling for every hard space
  you write, the spelling the file already uses most.
- `!` and `;` in French prose: no space before them, of any kind. About 63
  sites across the three files by the 2026-08-21 count, 38 and 22 and 1 by
  the desk's rough survey; yours governs.
- `?` is done; touch nothing unless you find one ship 5 missed, and report it.

**Exclusions, and they matter more than the rule.** Colons inside `<code>`,
URLs, `style=` attributes, time and ratio values, TypeScript syntax in
`i18n.ts` (the file has about 1,500 colons and almost all are object keys),
and anything inside an English block. An English `!` or `;` preceded by a
space is an English typo; fix it and list it separately.

**Step 3. Verify the rendered result, not the source.** Build, then read the
French Learn and Guide pages in a browser and confirm no colon wraps to the
start of a line at 360 px, which is the whole point of a hard space. Spot
check five sites of each kind.

## Done when

- `i18n.ts:41` `en` reads `Score markup`; `fr` is byte-identical.
- Every French colon site in the three files carries one hard space; every
  French `!` and `;` carries none; no English site changed except typos
  listed.
- Five gates at baseline: 216, 235, 0 errors and 7 warnings in 4 files, 705,
  444 passed and 5 skipped.
- Bundle byte count before and after.

## Do not

- Do not touch the French text beyond the space before these three marks.
- Do not change `fr` on `tab.markedScore`.
- Do not count from a single spelling. Do not report a number you have not
  read out of a census.

## Return memo

`docs/sessions/memo-colon-audit-and-score-markup_r1_<date>.md`: the spelling
census per file, sites changed per file per mark, English typos fixed, the
gate numbers, the byte counts, and `What I could not establish`.
**NOT ESTABLISHED beats a complete invented answer.**
