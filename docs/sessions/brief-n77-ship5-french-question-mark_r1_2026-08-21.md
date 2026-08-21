# BRIEF FOR CODE. N.77 ship 5: the French question mark, and the coda's kicker

Two small, unrelated changes. Both are Dann's rulings of 2026-08-21.

Everything below was measured in the tree at `0fcaa6e` on 2026-08-21.

---

# PART A. No space before a question mark in Canadian French

## The ruling

**Dann, 2026-08-21, after the two Canadian authorities were checked:** Ilya
adopts Canadian French usage.

- **Before `?`, `!`, `;`: no space.** The Government of Canada's `Clés de la
  rédaction` gives no space before and one after. The OQLF gives *"pas d'espace
  ou une espace fine"* and favours no space.
- **Before `:`: a non-breaking space.** Both authorities agree, and **this ship
  changes nothing about colons.**

Ilya currently follows the convention of France, which puts a hard space before
`?`. That is what changes.

## The 24 sites, measured

| file | form | count |
|---|---|---|
| `apps/web/src/lib/i18n.ts` | the escape ` ` before `?` | **12** |
| `apps/web/src/lib/components/Reading/LearnContent.svelte` | a plain space before `?` | **3** |
| `apps/web/src/lib/components/Reading/GuideContent.svelte` | a plain space before `?` | **8** |
| `apps/web/src/lib/components/Reading/GuideContent.svelte` | a literal NBSP character before `?` | **1** |

**All 24 are French by construction**, because English never puts a space before
a question mark. **Verify that before you change anything** and report any site
that turns out to be English.

## The change

Remove the space, in whichever form it takes, so the question mark sits directly
against the word before it. **The invariant afterwards: no space of any kind
precedes a `?` anywhere in either file or in `i18n.ts`.** Assert it and give the
count you removed.

## DO NOT TOUCH

- **Colons.** `i18n.ts` carries ` ` before a colon 25 times. Every one is
  correct and stays. There is a separate, larger colon audit that this ship is
  not.
- **Guillemets.** `LearnContent.svelte` carries **15** pairs written
  `«&nbsp;…&nbsp;»`. That spacing is correct in Canadian and French usage alike.
  Leave all 30 alone.
- **`!` and `;`.** There is no space before either anywhere. Confirm that and
  change nothing.
- **English text**, in any file.

---

# PART B. The coda's kicker reads `Section 8`

## The ruling

**Dann, 2026-08-21:** *"we can stay consistent and the kicker can read Section
8."*

Learn's chapters 1 to 7 are headed `Section N · Title`, so N.77's band splits
them into the kicker `SECTION N` and the title. Chapter 8 is headed `8 · Title`,
so its kicker renders as a bare `8`.

## The change, in three places

1. `LearnContent.svelte`, the French heading `id="learn-coda"`:
   `8 · Les inclassables` becomes `Section 8 · Les inclassables`.
2. `LearnContent.svelte`, the English heading `id="learn-coda"`:
   `8 · What These Rules Do Not Teach` becomes
   `Section 8 · What These Rules Do Not Teach`.
3. `Drawer.svelte:496`, the table of contents entry, which carries both
   languages inline and reads `8 · …` in each. **Match whatever form its seven
   sibling entries use.** Establish that first and say what it is; if the
   siblings' entries do not carry `Section`, then this entry does not either,
   and you say so rather than making it inconsistent.

**No French is coined.** The French headings already read `Section 2 ·
L'accent tonique` and so on, so `Section 8` uses only a word already in the
file.

**Do not change the `id`.** `learn-coda` stays exactly as it is: the table of
contents finds it by id and the scroll-spy observes it by id.

---

## Done when

Report the rendered result, not the source. Production build.

1. **Part A.** No space precedes a `?` in the French of either reading file or
   in any `i18n.ts` string. Give the count removed per file.
2. The 25 colons in `i18n.ts` still carry their ` `. Give the count.
3. The 15 guillemet pairs in `LearnContent.svelte` are unchanged. Give the
   count.
4. **Part B.** Learn's chapter 8 band shows the kicker `SECTION 8` in both
   languages, and its seven siblings are unchanged.
5. The table of contents entry for the coda matches its siblings, and clicking
   it still scrolls to the chapter.
6. All five gates at baseline.

## What you owe back

A memo in the same commit, Part A and Part B in separate sections.

- **What changed**, each with `path:line`.
- **The six conditions**, each with what you observed, not what you expected.
- **What I could not establish.** `NOT ESTABLISHED` beats a complete invented
  answer.

Do not run `git`. Do not commit.
