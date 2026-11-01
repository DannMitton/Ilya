# Ilya's code conventions: names, files, and comments

Draft r1, 2026-11-01, written by the desk (Opus) for Dann's ratification and Fable's review. Asked for by Dann 2026-11-01 13:26: align all internal code with the best programming traditions, and keep internal names consistent with the names a singer sees unless a tradition gives a compelling reason not to. Each convention carries its reason and its source.

## 1. Names in code follow the names on screen

A concept's code name is its English screen name, in the case the identifier's kind requires: MELODY is `melody/` (folder), `MelodyPane.svelte` (component), `melodyPages` (function), `tab.melody` (i18n key). **Reason:** a newcomer goes from the screen to the code without a lookup (Fable's review of the plan, question 5). `apps/web/src/lib/names.ts` records each concept's screen name, code name, and retired names.

## 2. Case by kind of name (Google TypeScript Style Guide, "Naming")

| kind | style | example |
|---|---|---|
| class, interface, type, enum, Svelte component | UpperCamelCase | `InputViews`, `MelodyPane` |
| variable, parameter, function, method, property | lowerCamelCase | `shownWitness`, `chooseWitness` |
| module-level value meant never to change | CONSTANT_CASE | `CYRILLIC_VOWEL` |

**Why capitals stay out of other names (Dann 12:28).** CONSTANT_CASE tells every reader "this value is not meant to change" (the guide: it "indicates that a value is intended to not be changed"). A component or folder in capitals would tell them something false. The tree already holds 519 module-level constants in CONSTANT_CASE.

**Acronyms are words:** `ipaLine`, not `IPALine`; `loadHttpUrl`, not `loadHTTPURL` (the same guide), except where a platform name requires otherwise.

## 3. File names

- A module: kebab-case, `witness-lines.ts`, `input-views.svelte.ts`. **Reason:** the tree's own practice (155 modules, none in snake_case). The Google guide's snake_case files are declined, because changing 155 file names buys a newcomer nothing and breaks the SvelteKit ecosystem's common form.
- A Svelte component: UpperCamelCase, `MelodyPane.svelte` (65 in the tree), as Svelte's documentation writes them.
- SvelteKit's route files keep the names the framework requires (`+page.svelte`).
- A test sits beside its module: `witness-lines.test.ts`.

## 4. Storage keys and i18n keys

- **Storage keys** start with `ilya:`, name the concept in lowerCamelCase, and carry a version when their shape can change: `ilya:voiceProfiles.v2`. Today's keys mix `shane.` and `ilya:` (consistency audit, A.7); batch 3 renames them (Dann 2026-11-01 12:00 and 12:25: no carry-over read).
- **i18n keys** are dotted lowerCamelCase by prefix, named for the concept, not the wording: `tab.melody`, never `tab.markedScore`. The prefix index at the head of `i18n.ts` lists each prefix and its reader; it is regenerated, not hand-kept.

## 5. Comments (Dann 2026-11-01 12:05 to 12:07)

- Every source file opens with a comment saying what it is for and what it must agree with. A test checks that the comment exists, never its wording.
- A comment answers one of three things: purpose (why this exists), function (what it does where the code does not say so plainly), or consequences (what else changes or breaks if this changes). One that answers none is not written.
- Relationships an import search can find (who imports whom) live in the generated module map in `ARCHITECTURE.md`; a comment names only what that search cannot show: two sites that must agree, an event a distant part listens for, a value another package depends on.
- A comment cites a name (a function, a constant, a file), never a line number, which goes stale on the next edit.
- In comments and the legend, a place a singer sees is written as the singer sees it: "draws the MELODY page".
- A comment names a ruling by its date and its words where the reason matters; a ticket number alone ("N.174") tells a newcomer nothing.

## 6. One home for one fact

Logic needed in two places lives in one named, documented module both import (the punctuation sets, the Cyrillic vowels: audit section D). Prefer a plain function called from several places over a copy, and a plain name over a clever one: the code stays approachable to people reading it to understand and improve it (Dann 2026-11-01 11:52).

## 7. Sources

Google TypeScript Style Guide, "Naming" (read 2026-11-01, https://google.github.io/styleguide/tsguide.html); the tree's own counts (2026-11-01, `git ls-files`, `git grep`); Dann's rulings of 2026-11-01 (`docs/memory/INBOX.md`).
