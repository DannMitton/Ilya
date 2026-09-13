# Memo: colour story stage 3b, family and role

**Answers:** `docs/sessions/paste-colour-3b_r1_2026-09-13.md`, read in full this session, with `docs/memory/CONTRACT.md` and `docs/sessions/spec-colour_r1_2026-09-13.md` read in full as its context.
**Date:** 2026-09-13.
**Status:** WRITTEN and walked at 1400 px, so DONE by CONTRACT §5, including the `--deeper-sage` split as Dann ruled it later the same day (§1). **Not committed.** No git command that writes was run.

---

## 1. The `--deeper-sage` split: stopped, ruled, finished

**The first pass stopped on the brief's own rule.** `HeaderBar.svelte:149`, `.tab-transcription .sigil-version { background: var(--deeper-sage, #7A8A6C); }`, is the resting fill of the small version badge in the header's Ilya sigil on Transcription. It is neither a page use nor a pointer state, which were the brief's two halves, so all 9 sites were left as they were and the site was named.

**RULED BY DANN 2026-09-13, after that stop.** His words: *"the division is the paper versus everything on the screen, not the paper versus the pointer. My brief's framing was wrong, which is why the badge had nowhere to go."* The ruling names the tokens: `--sage-gloss` takes the one paper use, `--sage-deep` takes the other eight, including the badge, both hold `#7A8A6C`, and `--sage-deep` keeps the meaning `--deeper-sage` carried.

**Done as ruled.** Nine anchors, each asserted before writing:

| site | what it is | now |
|---|---|---|
| `app.css:35` and `:36` (was `:35` alone) | the declaration | two declarations: `--sage-deep: #7A8A6C;` and `--sage-gloss: #7A8A6C;` |
| `WordStack.svelte:275` | the gloss line under every word, **on the paper** | `var(--sage-gloss)` |
| `IntakePanel.svelte:1060` | the poem field's focus border | `var(--sage-deep, #7A8A6C)` |
| `InspectorPanel.svelte:1522` | the **Dictionary** button's hover | `var(--sage-deep, #7A8A6C)` |
| `InspectorPanel.svelte:2185`, `:2186` | a stressed stress circle's hover, fill and border | `var(--sage-deep, #7A8A6C)` |
| `HeaderBar.svelte:149` | the version badge on Transcription | `var(--sage-deep, #7A8A6C)` |
| `InstallPrompt.svelte:205` | the install button's hover | `var(--sage-deep, #7A8A6C)` |
| `CalibrationWizard.svelte:1705` | a comment, "sage has a darker partner" | names `--sage-deep` |

That is 1 paper use and 8 others: the declaration, six paints, and the comment. The comment on each new declaration is a DESK DEFAULT: "sage one step deeper: fills, borders, and pointer states on screen", and "the gloss line under every word on the paper".

## 2. Counts, confirmed before editing, against the desk's

Instrument: a Python scan of every `.svelte`, `.ts`, `.css`, `.js`, and `.html` file under `apps/web/src` and `packages/score-parser/src`, tests included. It counts three forms:

- **`--form`:** `--name` not followed by a word character or a hyphen.
- **quoted:** `'name'`, `"name"`, or `` `name` ``.
- **bare word:** the name not preceded or followed by a word character or hyphen, counted for hyphenated names only.

For the brief's §1 bare column, the quoted form is the one that matches a string key.

| token | desk `--` | this run `--` | desk bare | this run, quoted | this run, bare word | agree |
|---|---|---|---|---|---|---|
| `--sage` | 92 | **94** | 0 | 0 | not counted | **no, 2 more** |
| `--rose` | 20 | 20 | 0 | 0 | not counted | yes |
| `--lavender` | 44 | 44 | 2 | 2 (`contrast.ts:128`, `:283`) | not counted | yes |
| `--cobalt` | 13 | 13 | 0 | 0 | not counted | yes |
| `--surround-transcription` | 2 | 2 | 0 | 0 | 0 | yes |
| `--surround-learn` | 3 | 3 | 0 | 0 | 0 | yes |
| `--surround-guide` | 2 | 2 | 0 | 0 | 0 | yes |
| `--surround-marked` | 5 | 5 | 0 | 0 | 0 | yes |
| `--surround-insights` | 2 | 2 | 0 | 0 | 0 | yes |
| `--surround-shane` | 5 | **6** | 10 | **22** | 23 | **no** |
| `--lang-chip-transcription` | 3 | 3 | 0 | 0 | 0 | yes |
| `--lang-chip-guide` | 3 | 3 | 0 | 0 | 0 | yes |
| `--lang-chip-learn` | 3 | 3 | 0 | 0 | 0 | yes |
| `--lang-chip-marked` | 6 | 6 | 0 | 0 | 0 | yes |
| `--deeper-sage` | 9 | 9 | 0 | 0 | 0 | yes |
| `--stone-700` | 3 | 3 | 0 | 0 | 0 | yes |
| `--light-sage` | 1 | 1 | 0 | 0 | 0 | yes |
| `--light-lavender` | 1 | 1 | 1 | **2** | 2 | **no** |
| `--muted-lavender` | 2 | 2 | 1 | 1 | 1 | yes |
| `#3A352F` | 42 | **43** | | | | **no, 1 more** |

**Where they part, read line by line:**

- **`--surround-shane`, `--form` 6:** `app.css:126` (a comment), `app.css:168` (the declaration), `Pacifier.svelte:758`, `+page.svelte:5367` (a comment), and `contrast.test.ts:428` twice on one line. **Quoted 22:** `contrast.ts:129` (PALETTE), 2 comments (`:22`, `:183`), 1 correction note (`:113`), and 9 obligations naming it twice each, as `fillToken` and `backgroundToken` (`:258` to `:332`). The desk's 10 matches the PALETTE entry plus nine obligation lines. The 23rd bare word is `contrast.test.ts:431`, inside a message string.
- **`--light-lavender`, quoted 2:** the PALETTE entry at `contrast.ts:127`, and `contrast.ts:113`, a dated correction note.
- **`#3A352F`, 43:** 29 in `staff-renderer.ts`, 9 in `NotePicker.svelte`, and 5 in `staff-renderer.test.ts`.
- **`--sage`, 94:** not broken down, because `--sage` does not move in this pass.

**Collision check, before editing:** every new name (`--sage-desk` through `--lavender-chip`, `--sage-gloss`, `--sage-hover`, `--ink-stave`) returned 0 in both forms. `--sage-deep`, named by the ruling, was checked before its edit and also returned 0.

---

## 3. What changed

### 3.1 Part 1: desks and chips take family and role

| old | new | sites | value, unchanged |
|---|---|---|---|
| `--surround-transcription` | `--sage-desk` | 2 | `#D1D7CB` |
| `--surround-learn` | `--rose-desk` | 2; its third hit was a comment inside the deleted Insights block | `#DBCACA` |
| `--surround-guide` | `--cobalt-desk` | 2 | `#BEC7D8` |
| `--surround-marked` | `--lavender-desk` | 5, three of them comments | `#D2CBD7` |
| `--lang-chip-transcription` | `--sage-chip` | 3 | `#6C7A5F` |
| `--lang-chip-learn` | `--rose-chip` | 3 | `#9A6A6A` |
| `--lang-chip-guide` | `--cobalt-chip` | 3 | `var(--cobalt)`, `#5C739E` |
| `--lang-chip-marked` | `--lavender-chip` | 6, two of them comments | `#806E8E` |

Every `var()` fallback kept its hex: `var(--sage-chip, #6C7A5F)`, `var(--lavender-desk, #D2CBD7)`, and so on.

The bands, `--sage`, `--rose`, `--lavender`, and `--cobalt`, are untouched, as briefed. No ink token was declared for a family.

### 3.2 Part 2: `--surround-insights` deleted, `--surround-shane` untouched

- **`--surround-insights`:** its declaration and its three-line comment are gone from `app.css`. Its one reader, `+page.svelte:5358`, now reads `var(--rose-desk, #DBCACA)`. The comment above that rule said "Its own token, at the value Learn's surround carries", which is now false. It now reads "It reads rose's own desk token, as Learn does." **Same value before and after, so this is not a value change.**
- **`--surround-shane`:** after the edits, 6 `--form` and 22 quoted, the same as before (§5).

### 3.3 Part 3: `#3A352F` gets a token, and `--stone-700` merges

**`--ink-stave: #3A352F;`** is declared in `app.css`, directly after `--ink-tertiary`, with the comment "the stave's furniture: staff lines, clefs, barlines, rests".

**The split of the 43 `#3A352F` occurrences:**

| group | count | now | why |
|---|---|---|---|
| `NotePicker.svelte:203`, `:209`, `:213`, `:222`, `:225`, `:226`, `:228`, `:229`, `:239` | 9 | **`var(--ink-stave)`** | Svelte markup rendered in the DOM, so a CSS custom property reaches it. The tree already does this in SVG attributes: `Pacifier.svelte:758` writes `stroke="var(--surround-shane)"`, and `:768` writes `fill="var(--sage)"`. A probe run in the browser this session gave `stroke="var(--ink-stave)"` a computed stroke of rgb(58, 53, 47), which is `#3A352F`. |
| `staff-renderer.ts`, 29 sites | 29 | **literal** | The renderer builds SVG strings with no DOM and no stylesheet (`staff-renderer.ts:615` and `:616`: "pure and DOM-free"). |
| `staff-renderer.test.ts`, 5 sites | 5 | **literal** | The tests assert the renderer's output string, which still carries the literal. |

**The renderer's sync note.** One note covers all 29 sites, appended to the existing comment line `// Staff lines.` at `staff-renderer.ts:1666`, the module's first stave-ink use. It now reads: "Every #3a352f in this module is the stave's ink, `--ink-stave` in app.css. Baked as hex because this module is pure and DOM-free; keep in sync with the app token."

DESK DEFAULT: one note on an existing line rather than 29 notes or a new line. A new line would shift every `staff-renderer.ts:NNN` citation that code comments carry, for example `Loupe.svelte:397`, `pairings.ts:681`, and `clitic-seat.test.ts:293`.

So the literal count in `staff-renderer.ts` now reads 30 by grep: 29 paints plus the note.

**`--stone-700` merged into `--ink-secondary`**, and its declaration is deleted:

| site | was | now |
|---|---|---|
| `Loupe.svelte:931`, the loupe's frame | `var(--stone-700, #44403c)` | `var(--ink-secondary, #4a4540)` |
| `InspectorPanel.svelte:1867`, the ё inside the ё/е sigla | `var(--stone-700, #44403c)` | `var(--ink-secondary, #4a4540)` |
| `WordStack.svelte:323`, the hovered provenance icons | `#44403c` | `var(--ink-secondary)`, matching the IPA row's own `var(--ink-secondary)` at `:259` |

**This is one of two ordered repaints in the pass,** and the brief's headline "no value changes" does not cover it. It is ruling 2, item 1 of 2026-09-13, merged as briefed. Those three sites now paint `#4A4540` instead of `#44403C`, ΔE 0.020 in OKLab (census, §6.1).

DESK DEFAULT: at the two merge sites the fallback hex follows the new token. The brief's rule "the name changes, the fallback hex does not" was written for renames. At a merge it would leave `var(--ink-secondary, #44403c)`, a fallback that disagrees with its own token.

### 3.4 Part 4: deletions

- **`--light-sage`:** its declaration is deleted. It had no reader.
- **`--light-lavender`:** its declaration and its PALETTE entry (`contrast.ts:127`) are deleted. **No change to `contrast.test.ts` was needed or made.** The brief called `contrast.test.ts:233` "the R20 assertion that holds the two equal". Line 233 is R20's header comment. The assertion is the generic loop at `:354` over `Object.keys(PALETTE)`, and no test names `light-lavender`, by grep of `contrast.test.ts`. Removing both sides keeps R20 whole, and gate 4 confirmed it.
- **`--muted-lavender`:** its declaration and its PALETTE entry (`contrast.ts:126`) are deleted. **No obligation named it**: in `contrast.ts` the name appeared only at `:126`. Its one paint, the update toast's border (`+page.svelte:5795`), now reads `var(--stone-300, #d6d3d1)`. **This is the second ordered repaint:** that border goes from `#A89BB5` to `#D6D3D1`. The toast was not on screen in the walk (§6).
- **`--deeper-sage`:** split into `--sage-gloss` and `--sage-deep`, both `#7A8A6C`, as ruled. See §1.

### 3.5 Citations repaired by naming, because the edits shift lines

`app.css` lost 8 lines and gained 1, and `contrast.ts` lost 2. CONTRACT §5 asks for citations into a shifted file to be repaired by naming. I grepped every `app.css:NNN` and `contrast.ts:NNN` citation in `apps/web/src` and `packages/*/src`.

**All four `app.css` citations were already stale before this pass.** Each now names its target:

| site | was | now |
|---|---|---|
| `app.css:285` | `(app.css:102-108: …)` | `(the \`body\` rule in this file: …)` |
| `Drawer.svelte:1543` | `` (`app.css:124`) `` | `` (its declaration in `app.css`) `` |
| `+page.svelte:4967` | `` `app.css:88-94` resets margin `` | `` The reset in `app.css` sets margin `` |
| `staff-renderer.ts:75` | `` `--lavender`, `app.css:69`. `` | `` `--lavender` in `app.css`. `` |

No citation into `contrast.ts` exists in code. The `.svelte` files kept their line counts.

---

## 4. Every file touched

1. `apps/web/src/app.css`
2. `apps/web/src/lib/components/Drawer/Drawer.svelte`
3. `apps/web/src/lib/components/Drawer/InspectorPanel.svelte`
4. `apps/web/src/lib/components/HeaderBar.svelte`
5. `apps/web/src/lib/components/Paper/WordStack.svelte`
6. `apps/web/src/lib/shane/Loupe.svelte`
7. `apps/web/src/lib/shane/NotePicker.svelte`
8. `apps/web/src/lib/shane/pacifier/contrast.ts`
9. `apps/web/src/routes/+page.svelte`
10. `packages/score-parser/src/staff-renderer.ts`
11. `apps/web/src/lib/components/Drawer/IntakePanel.svelte`, for the split
12. `apps/web/src/lib/components/InstallPrompt.svelte`, for the split
13. `apps/web/src/lib/shane/CalibrationWizard.svelte`, for the split, a comment only

`git diff --stat`: 13 files, 57 insertions, 65 deletions. Plus this memo, which is new and **needs a `git add` before a ship**.

Two items were already in `git status` when this pass started, and neither is mine: `docs/memory/STATE.md` modified, and `docs/sessions/paste-colour-3b_r1_2026-09-13.md` untracked. `docs/memory/ENVIRONMENT.md` showed as modified by the time of the split, and that is not mine either. Nothing under `docs/` was edited by this pass except this memo.

---

## 5. Definition of done

**1. Both forms return nothing** over `apps/web/src` and `packages/score-parser/src`, for `--surround-transcription`, `--surround-learn`, `--surround-guide`, `--surround-marked`, `--surround-insights`, all four `--lang-chip-*`, `--stone-700`, `--light-sage`, `--muted-lavender`, and, after the ruled split, `--deeper-sage`. That is 0 `--form`, 0 quoted, and 0 bare word for each. `--sage-deep` holds 8 and `--sage-gloss` 2.

**One exception, named:**

- **`light-lavender`: 1 bare hit,** `contrast.ts:113`. The line is inside a comment headed "CORRECTION, 2026-07-30", which records what `app.css` declared "as of `app.css` md5 cf7bd6350fed1945c9aba775f957d618, read 2026-07-30". It is a dated record and stays true, so I left it, as `docs/` is left. DESK DEFAULT.

A grep for `lang-chip` also finds the CSS class `.gloss-lang-chip` (`InspectorPanel.svelte:1062`, `:1690`). It is a class, not a token, and is not a hit.

**2. `--surround-shane` is unchanged:** 6 `--form` and 22 quoted, before and after, and computed `#D8D0E0` on `:root` in the browser.

**3. The four families are unchanged,** `--form` before and after:

| family | `--form` | quoted | computed on `:root` |
|---|---|---|---|
| `--sage` | 94 | 0 | `#8B9A7D` |
| `--rose` | 20 | 0 | `#A67B7B` |
| `--lavender` | 44 | 2 | `#8E7E9B` |
| `--cobalt` | 13 | 0 | `#5C739E` |

**4. No declared hex value moved.** This is the complete list of every hex that the word-level diff (`git diff --word-diff=porcelain` over `apps` and `packages`) shows leaving or arriving:

| hex in the diff | why |
|---|---|
| `#3a352f` ×9 out, `var(--ink-stave` ×9 in | same value, now named: `--ink-stave: #3A352F` |
| `#3A352F` in, at `--ink-stave`'s declaration | the new declaration of an existing value |
| `#3a352f` in, inside the `staff-renderer.ts:1666` comment | the sync note, not a paint |
| `#A8B5A0` out | `--light-sage`'s declaration, which painted nothing |
| `#C4BACF` out ×2 | `--light-lavender`'s declaration and its PALETTE copy, which painted nothing |
| `#A89BB5` out ×3, `#d6d3d1` in | `--muted-lavender`'s declaration, its PALETTE copy, and the toast's border: **ordered repaint 2** |
| `#44403c` out ×4, `#4a4540` in ×2 | `--stone-700`'s declaration and its three sites: **ordered repaint 1** |
| `#DBCACA` out ×2 | `--surround-insights`'s declaration and its deleted comment; its reader still carries `#DBCACA` |
| `#7A8A6C` in ×1 | the split: `--deeper-sage: #7A8A6C` became `--sage-deep: #7A8A6C` plus a second declaration, `--sage-gloss: #7A8A6C`. Same value. |

Every surviving declaration kept its hex: `--sage-deep: #7A8A6C`, `--sage-gloss: #7A8A6C`, `--sage-desk: #D1D7CB`, `--lavender-desk: #D2CBD7`, `--rose-desk: #DBCACA`, `--cobalt-desk: #BEC7D8`, `--sage-chip: #6C7A5F`, `--rose-chip: #9A6A6A`, `--cobalt-chip: var(--cobalt)`, `--lavender-chip: #806E8E`.

**5. Gates**, run as the five commands in `~/Downloads/ilya-ship.sh:76` to `:80`, with the script's match strings and ANSI stripping.

**My prediction, stated before the run:** no gate moves. The likeliest failure was gate 4, from a contrast test pinning PALETTE's size or naming a deleted key. The second likeliest was gate 3's warning count, from the new SVG `var()` attributes.

| gate | baseline | untouched tree | after the edits | against prediction |
|---|---|---|---|---|
| 1 phonology | 216 passed (216) | OK | **OK** | as predicted |
| 2 dictionary | 235 passed (235) | OK | **OK** | as predicted |
| 3 web-check | 0 errors and 7 warnings in 4 files | OK | **OK** | as predicted |
| 4 web-test | 1123 passed (1123) | OK | **OK** | as predicted |
| 5 score-parser | 547 passed, 5 skipped (552) | OK | **OK** | as predicted |

**The split, run again after it.** My prediction, stated before the run: all five at baseline, because no test or type names `deeper-sage` (grep over both source trees, tests included). The likeliest failure was gate 4's R20 precondition halting on one of the two new `:root` declarations. **Result: all five OK at the same baselines, as predicted.**

The desk's claim that gates 3 and 4 were at risk was tested and did not hold for this pass. Gate 4 has shown it can move on a key mismatch: stage 3a's control run failed 3 tests when a PALETTE key and its `app.css` token disagreed.

**6. The walk, 1400 × 900, `pnpm --filter @ilya/web dev`, all five documents.**

*Stated before looking:* every desk, header band, chip, and drawer band matches stage 3a's walk. `--ink-stave` computes `#3A352F`, every new name computes its old value, and the deleted names compute empty.

**The instrument lied once, and I caught it before reporting.** The first reading gave every header band and chip as sage on every document, while the `.header-bar` class was correct (`tab-guide`) and the CSS rules were correct. The pane was hidden (`document.visibilityState: hidden`). Both the header and the chip carry a 0.3 s `background-color` transition, and both transitions sat at `currentTime 0`, so they reported their starting colour. I finished each running CSS transition with `Animation.finish()` before reading. That changes no code.

| document | desk | header band | chip | version badge | drawer bands (Piece, Input, Score markup) | result |
|---|---|---|---|---|---|---|
| Transcription | rgb(209, 215, 203) | rgb(139, 154, 125) | rgb(108, 122, 95) | rgb(122, 138, 108) | rgb(92, 115, 158), rgb(108, 122, 95), rgb(128, 110, 142) | match |
| Score markup | rgb(210, 203, 215) | rgb(142, 126, 155) | rgb(128, 110, 142) | rgb(116, 103, 127) | same three | match |
| Insights | rgb(219, 202, 202) | rgb(166, 123, 123) | rgb(154, 106, 106) | rgb(143, 106, 106) | same three | match |
| Learn | rgb(219, 202, 202) | rgb(166, 123, 123) | rgb(154, 106, 106) | rgb(143, 106, 106) | not shown on Learn | match |
| Guide | rgb(190, 199, 216) | rgb(92, 115, 158) | rgb(92, 115, 158) | rgb(77, 99, 135) | not shown on Guide | match |

**Tokens on `:root`, computed:** `--ink-stave` `#3A352F`, `--ink-secondary` `#4a4540`, `--stone-300` `#d6d3d1`, `--sage-desk` `#D1D7CB`, `--rose-desk` `#DBCACA`, `--cobalt-desk` `#BEC7D8`, `--lavender-desk` `#D2CBD7`, `--sage-chip` `#6C7A5F`, `--rose-chip` `#9A6A6A`, `--cobalt-chip` `#5C739E`, `--lavender-chip` `#806E8E`. `--surround-insights`, `--surround-learn`, `--lang-chip-guide`, `--stone-700`, `--light-sage`, `--light-lavender`, and `--muted-lavender` all compute empty.

**Painted checks that no fallback can mask:**

- **Chips and desks:** the drawer's Piece band (`Drawer.svelte:1179`, `var(--cobalt-chip)`, no fallback) painted rgb(92, 115, 158). The Input band (`:1188`, `var(--sage-chip)`) painted rgb(108, 122, 95). The Score markup band (`:1192`, `var(--lavender-chip)`) painted rgb(128, 110, 142).
- **Lavender, which 3a could not show painted:** opening the Score markup band and pressing **Calibrate** mounted the voice anchor. Its dot (`VoiceAnchor.svelte:77`, `var(--lavender)`, no fallback) painted rgb(142, 126, 155). The takeover's **Start** button painted the same, and its band painted rgb(128, 110, 142).

I took screenshots of all five documents at 1400 px after settling the transitions. **Start was not pressed**, so no voice profile was created.

**The walk, again after the split, same instrument and same settling.** *Stated before looking:* every value in the table is unchanged, `--sage-deep` and `--sage-gloss` both compute `#7A8A6C`, `--deeper-sage` computes empty, and the badge and gloss paint rgb(122, 138, 108).

- **Every desk, header band, chip, version badge, and drawer band** matched the table, on all five documents.
- **On `:root`:** `--sage-deep` `#7A8A6C`, `--sage-gloss` `#7A8A6C`, `--deeper-sage` empty. `--sage`, `--rose`, `--lavender`, `--cobalt`, `--surround-shane`, and every desk and chip token are unchanged.
- **The paper use, painted, with no fallback to mask it.** I typed "Я помню чудное мгновенье" into the poem field and pressed **Transcribe**. All four gloss lines on the page ("I", "to remember", "marvelous, wonderful", "moment") painted rgb(122, 138, 108) through `var(--sage-gloss)` (`WordStack.svelte:275`). On the same words, the IPA rows painted rgb(74, 69, 64), `--ink-secondary`, and the Cyrillic rows rgb(26, 22, 18), `--ink-primary`.
- **The badge:** Transcription's version badge painted rgb(122, 138, 108). Its rule carries a `#7A8A6C` fallback, so the `:root` readout is what proves `--sage-deep` resolves.

---

## 6. WHAT I COULD NOT ESTABLISH

- **The note picker, painted.** It mounts only inside a voice profile's characteristics, and reaching it means pressing **Start** and creating a profile in the browser pane's storage, which I did not do. The evidence that its 9 sites paint `#3A352F` is the probe in §3.3: an SVG `line` and `text` with `var(--ink-stave)` as presentation attributes computed rgb(58, 53, 47). That is not the note picker's own pixels.
- **The three `--stone-700` merge sites, painted.** The loupe needs a score, the ё sigla needs a word containing ё open in the inspector, and the provenance icons appear only on words that carry one. After the transcription, the page held words, but `.icon-area`, `.yo-sigla`, and `.loupe` all counted 0. A probe `div` with `color: var(--ink-secondary)` computed rgb(74, 69, 64), `#4A4540`. Whether a singer can see the ΔE 0.020 change was not observed.
- **The update toast's new border, painted.** The toast appears only when a new service worker is waiting. The probe gave `var(--stone-300, #d6d3d1)` rgb(214, 211, 209). How the toast reads with a stone border instead of lavender was not observed.
- **Why the desk counted `--sage` at 92 and `--surround-shane` at 5 and 10.** This run found 94, 6, and 22. §2 lists every `--surround-shane` site; the desk's instrument is not in the brief.
- **Old names in `docs/`.** The grep for every deleted or renamed name over `docs/` returned **633 lines before this memo was written, and 635 at the time of the split**, not counting this memo. The 2 extra lines arrived in `docs/memory/`, which this pass did not edit. This memo adds more, and I did not count them.
- **The sample poem left in the browser pane.** The walk typed a line of Pushkin into the poem field of the preview browser's own profile, not Dann's Chrome. Whether the app saved it to that profile's storage was not checked.

**NOT ESTABLISHED beats a complete invented answer.**
