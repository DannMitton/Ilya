# Report, row 175, step 3 (r1), 2026-11-02: the comments

Lane: cloud-lane-26, on top of step 2 (ec9d9f9a). Step 3 stops the row, as asked. Nothing pushed to `Shane` or `main`; nothing under `docs/memory/` touched.

## 1. What changed

| File | Change |
|---|---|
| `data/blurb-composer.json` | The 30 `soft:*` and `hard:*` processes retire, with their French. 18 processes are seated, keyed by reason, one string per reason, English and French: the sixteen ratified (the dental and dental-differs pair counts as two ids), `lexical-exception`, and `look-alike-root`. Each carries `standalone: true`, so the comment is exactly the ratified string. |
| `packages/blurb/src/composer.ts` | `deriveRuleStandard` returns the engine's `palReason` for a consonant; there is no `'soft'` or `'hard'` fallback. A rule-wide process key serves every letter. `{trigger}`, `{base_ipa}`, `{word}`, `{look}`, `{root}` are filled from the log. A citation may name a second source after ` + `. Reasons with no causal sentence get their identity alone. |
| `packages/blurb/src/cluster-breakdowns.ts` | Every consonant entry of the special clusters carries `palReason: 'cluster'` (28 entries). |
| `packages/blurb/src/types.ts` | `palReason`, `baseIpa`, `word`, `look`, `root` on the features. |
| `tests/palatalization-comments.test.ts` | New: 42 tests. The ratified strings are pinned verbatim; each is composed from a real engine log entry. |
| `packages/blurb/tests/blurb.test.ts`, `french-parity.test.ts` | Seven pins changed (section 6). |

## 2. The comments, one per reason

The strings are the ratified ones. I extracted the EN and FR sixteen and the `lexical-exception` pair from the desk's two files by script, not by retyping, and took `look-alike-root` from the desk's message of 2026-11-02. The test file holds a copy of each string and asserts the data equals it, template and citation, in both languages.

| Reason | Citation | Basis of the page |
|---|---|---|
| `agent-vowel`, `agent-soft-sign` | p. 169 | the page the retired `soft:*` templates cited; the ratification note names no page for these |
| `regressive-dental` | pp. 209–210 | p. 209 sets no limit; p. 210 prints сестрёнка. My assignment. |
| `regressive-dental-dp-differs` | pp. 209–210 + D&P 1980, p. 79 | the note names D&P p. 79 for the everyday-speech line |
| `regressive-homorganic`, `regressive-n`, `geminate`, `r-front-stressed`, `blocked-class`, `blocked-n`, `blocked-r`, `blocked-l` | p. 209 | the note: "209 (limits, ⟨р⟩)" |
| `hard-sign-vzs` | p. 193 | the note: "193 (hard sign)" |
| `boundary-hard-sign` | p. 206 | the note: "206 (boundaries)" |
| `no-soft-follower` | p. 206 | my assignment (boundaries: a vowel, a hard consonant, the word end) |
| `boundary-prefix` | p. 249 | the note: "249 (prefix)" |
| `look-alike-root` | p. 249 | the message: "Grayson 2012, 249" |
| `lexical-exception` | p. 287 | addendum: "Grayson 2012, 287, ch. 6 section 5" |

The reasons outside these (`always-soft`, `always-hard`, `lexical-soft`, `reflexive-hard`, `adjectival-stage-hard`, `cluster`, and an entry with no reason, `unexplained`): ч щ й and ж ш ц keep their existing identity-only templates. The other four get the letter's identity alone. A ц softened by lemma now gets the ц identity (which names цвет) and not "always hard". **No fallback to `soft:X` or `hard:X`** exists in the code, and a test fails if the data holds one or holds the old phrases "no palatalizing agent nearby" or "like it is here".

## 3. The comment for подвиг

Composed by the real composer from the real engine log entry (`tests/palatalization-comments.test.ts`):

- **EN:** ⟨д⟩ softens to [dʲ] before the soft [vʲ]. «подвиг» looks as if it begins with the prefix «под-», but ⟨д⟩ belongs to the root «двиг-», so the softening reaches it. *(Grayson, p. 249)*
- **FR:** ⟨д⟩ se palatalise en [dʲ] devant le [vʲ] palatalisé. «подвиг» semble commencer par le préfixe «под-», mais ⟨д⟩ appartient à la racine «двиг-» : la palatalisation l'atteint donc. *(Grayson, p. 249)*

«неподвижный» does not get this comment: its д is plain `regressive-dental`, because the look-alike list returns nothing there (the prefix list alone would not have blocked it). The test pins that too.

## 4. A point for the desk: the French colon

The desk's message says the space before the French colon is a no-break space U+00A0 "as in the other ratified French comments". The ratified French file has **no** U+00A0 anywhere: the sixteen use an ordinary space before the colon (16 of 16 checked). I matched the file, and the `look-alike-root` French has an ordinary space too. If Dann wants U+00A0, it is a change to all seventeen colons, in the data and in the test. NOT ESTABLISHED which he means.

## 5. The addendum: why the panel shows the mapping twice

`InspectorPanel.svelte` always prints a header, `{char} → {ipa}` (line 1377 to 1379), and then the blurb text. When `composeBlurb` finds no process, it warns "Missing process" and returns null, and `lookupBlurb` substitutes the fallback text `{char} → {ipa}` (`composer.ts`, the end of `lookupBlurb`). So the same "а → ɑ" appears twice. For «счастье» the key was `word-override:а`, and `blurb-composer.json` had no process of that name. It now has the ratified `lexical-exception` string.

**Other entries that show the same.** I composed every log entry of the 40-line approval corpus (890 entries, raw engine log). Entries that still return null, so show the doubled mapping:

| Rule | Null of total | Examples |
|---|---|---|
| `stressed-interpalatal` (vowels) | 10 of 25 | печалить, виденье, снились, свищет |
| `aya-suffix` | 6 of 6 | особенная, Короткая |
| `pretonic-interpalatal` | 1 of 8 | ничем |
| `velar-adjectival` | 1 of 1 | одинокий |
| `reflexive` | 1 of 1 | гнётся |

Six more `cluster` entries return null in the raw log; the app expands clusters before display (`lookupClusterCharBlurb`), and I did not run that path, so I do not claim they show twice. I did not fix these: they need processes (or a ruling that the header suffices), and that is the desk's. No consonant entry of the corpus returns null.

## 6. Changed pins

| Pin | Was | Now | Why |
|---|---|---|---|
| `blurb.test.ts` deriveRule, hard consonant | `'hard'` | the reason, `'no-soft-follower'` | the key is the reason |
| `blurb.test.ts` deriveRule, soft consonant | `'soft'` | `'regressive-dental'` | same |
| `blurb.test.ts` deriveRuleStandard, soft and plain consonant | `'soft'`, `'hard'` | `'agent-vowel'`, `'blocked-class'` for given reasons; `'unexplained'` with none | no fallback |
| `blurb.test.ts` fixture keys `hard:д`, `soft:д` | old keys | `final-fixture:д` | the fixture follows the composer |
| `blurb.test.ts` "composes identity + process" | features with no reason | `palReason: 'final-fixture'` | same |
| `french-parity.test.ts` template count | 209 | 197 | 30 retired, 18 seated |

Added: three tests in `blurb.test.ts` (the palReason mapping, `unexplained`, `lexical-soft`) in place of two, and the 42 in `tests/palatalization-comments.test.ts`. Blurb 145 to 146; integration 55 to 97.

## 7. Gates

| Gate | Baseline | Got |
|---|---|---|
| phonology | 291 | 390 passed |
| dictionary | 248 | 248 passed |
| web check | 0 errors, 12 warnings | 0 errors, 12 warnings in 5 files |
| web test | 3789 passed, 1 skipped | 3803 passed, 1 skipped (217 files): unchanged from step 2; no web test changed in this step |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 145 | 146 passed |
| integration | 55 | 97 passed |
| pnpm ratchets | OK | OK |

## 8. For the desk to rule

- **The sixteen articulatory sentences are orphaned.** The `implications` for `soft:*` (15) and `hard:л` (1), "Like when we shape [i], the tongue rises toward the hard palate…" (pp. 204 to 205), used to follow every soft-consonant comment. They are true, not wrong-reason text, so I did not delete them. But the ratified comment is one economical sentence, so I stopped attaching them: the composer no longer reaches them. They stay in the data, unreferenced. Re-attaching is one line in `composer.ts`; retiring them is a deletion in the data. Which one is Dann's.
- **The D&P citation.** `formatCitations` now prints a second source after ` + ` as given: "(Grayson, pp. 209–210; D&P 1980, p. 79)". The format is mine.
- **Page assignments** marked "my assignment" in section 2.

## 9. What I could not establish

- **That the panel renders the new strings correctly in a browser.** I tested the composer and the data through the engine, not the Svelte panel, and I ran no screenshot.
- **Whether the six `cluster` entries show twice in the panel** (section 5).
- **The natural words for `blocked-n`, `blocked-r`, and `blocked-l`.** The comment test uses the non-words анви, парви, and алви, which isolate the rule. I did not look for natural words.
- **Whether Dann wants U+00A0 before the French colon** (section 4).
- **That the pages in section 2 marked "my assignment" are the ones Dann wants.**
- **The suffix boundary of Grayson p. 249:** not built, by the desk's ruling 4; listed here as required.
