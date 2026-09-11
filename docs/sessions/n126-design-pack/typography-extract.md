## TYPOGRAPHY IN THIS TREE. Learned the hard way, 2026-08-21

**BEFORE YOU COUNT A TYPOGRAPHIC CHARACTER HERE, ENUMERATE ITS SPELLINGS
FIRST.** The desk wrote four wrong counts into three briefs in one day, and
three of them share this cause.

**A non-breaking space is written in at least five ways in this repository:**

| spelling | where |
|---|---|
| `\u00a0` escape | `i18n.ts`, which is TypeScript string literals |
| `&#160;` numeric entity | the Svelte reading files, and it is the COMMONEST there |
| `&nbsp;` named entity | the Svelte reading files |
| a literal U+00A0 character | the Svelte reading files |
| `&#8239;` narrow no-break space | at least once in `LearnContent.svelte` |

**Measured on 2026-08-21:** `LearnContent.svelte` holds 124 guillemet pairs in
four spellings, not the 15 the desk reported by counting `&nbsp;` alone, and 150
occurrences of `&#160;:`, not the 62 the desk reported by reusing a guillemet
count for colons.

**Two traps a same-line grep cannot see.**

- **A `?` can sit on its own source line.** `LearnContent.svelte:1562` had one,
  where HTML collapses the newline to a space. It rendered as a defect and
  matched no same-line search. **Only the built bundle found it.**
- **`Drawer.svelte` holds French prose.** Its table-of-contents labels mirror
  the Guide's headings verbatim, so a change to a heading that skips the drawer
  puts the same sentence on screen two different ways in the same view.

**Scan the BUILT BUNDLE, not the source, when the question is what a singer
sees.** A naive tree sweep also drowns in JavaScript ternaries.

### THE RULE FOR CANADIAN FRENCH, ruled by Dann 2026-08-21

**No space before `?`, `!`, or `;`. A hard space before `:`.** Canada parts
company with France here. Sources, both checked before the ruling: the
Government of Canada's `Clés de la rédaction`
(`nos-langues.canada.ca/fr/cles-de-la-redaction/signes-de-ponctuation-et-espaces`)
and the OQLF's `Vitrine linguistique`, which says *"pas d'espace ou une espace
fine"* and favours none.
