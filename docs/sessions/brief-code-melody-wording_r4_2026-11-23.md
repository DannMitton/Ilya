# Code brief: MELODY's two legend lines, and « conduit vocal »

r4, 2026-11-23, by the desk (Opus 5). Branch when cut: `cloud-lane-85`, created at `Shane` `ac06d520`.

r1, r2, and r3 are superseded and kept. **Fable returned DO NOT SEND on r3** (`review-fable-melody-wording-r3_r1_2026-11-23.md`) with one blocker and twelve amendments. **r4 splits the lane on Fable's recommendation:** the two items it cleared go now; the third is held for Dann.

## 0. What is held out, and why, because it is the important part

r3 carried a third item: cutting " or dashed" from MELODY's placeholder sentence so it ends "drawn hollow". **It is not in this lane.**

r3 said MELODY draws a placeholder finding hollow and that "or dashed" belongs to INSIGHTS. **The tree says otherwise, and the desk read it:** `apps/web/src/lib/score/crossing-ring.ts:34-35` states in its own header that a crossing resting on a placeholder fR1 is dashed; `:72-76` sets `stroke-dasharray` when `placeholder` is true and `:96` applies it per crossing; `apps/web/src/lib/melody/MarkupPane.svelte:94` imports `drawCrossingRings` and `:409` calls it on `.markup-paper-container`; `crossing-ring.test.ts:47` pins the dash.

So "hollow or dashed" is true of MELODY today, and "drawn hollow" alone would under-describe the page a singer is looking at. **That is Dann's to settle, with the page in front of him**, and it waits.

## 1. What these lines are for

A singer opening MELODY meets a legend naming what each notehead on the page means. Two of its entries describe the pitch where a vowel turns, and Dann asked on 2026-11-22 12:45 for both to be said more directly, from the singer's side.

Separately, two French sentences in the GUIDE still say « tractus vocal » where the project's term is « conduit vocal ».

## 2. The changes

### 2a. The legend, `apps/web/src/lib/melody/legend.ts`

Read in the merged tree 2026-11-23 at `ac06d520`. `MARKUP_TURN_COPY` opens at `:73`. **The constant keeps its name**; renaming it belongs to a later slice of consistency batch 3.

| line | from | to |
|---|---|---|
| `:75` | `= the pitch where this vowel turns, from your voice` | `= your pitch of turning for this vowel` |
| `:76` | `= la hauteur où cette voyelle change de timbre, d’après votre voix` | `= votre hauteur de changement de timbre pour cette voyelle` |
| `:79` | `= the same, from a placeholder value` | `= the same, but using a placeholder value` |
| `:80` | `= la même, d’après une valeur par défaut` | `= la même, mais à partir d’une valeur par défaut` |

**How the apostrophe is written matters and differs by file.** In `legend.ts` the accented letters are literal and only the apostrophe is an escape, so `:80` is written `'= la même, mais à partir d’une valeur par défaut'`, exactly as the line is written today. In `legend.test.ts` the apostrophe is the literal character U+2019.

Each entry keeps its leading `= ` and takes no full stop, as today.

**Dann's words, transcribed, 2026-11-22 12:45:** *"can we shift the text in the legend of MELODY from "the pitch where this vowel turns, from your voice" to "your pitch of turning for this vowel," and "the same, from a placeholder value" to "the same, but using a placeholder value"?"* The trailing comma inside his first replacement is dropped as sentence punctuation inside the quotation marks (`../memory/INBOX.md`, 2026-11-22 12:45, a standing DESK FLAG; his to restore).

**The French, ruled by Dann 2026-11-22 14:52, final and his:** « = votre hauteur de changement de timbre pour cette voyelle » and « = la même, mais à partir d'une valeur par défaut ». He chose « à partir de » over « d'après ». « changement de timbre » is the desk's noun, built from the file's own « change de timbre ». **No French in this lane is owed to him.**

### 2b. « tractus vocal » becomes « conduit vocal », two sentences

**This is not new French and nothing here is owed to Dann.** « conduit vocal » is the project's term, ruled 2026-09-30, confirmed by him 2026-11-13 10:28 to 10:30 while he ratified the pause line's French, and said again 2026-11-22 22:47 (*"We decided conduit not tractus"*). The ruling's home is `../memory/OPEN.md`, « CONDUIT VOCAL », NEVER « TRACTUS VOCAL ».

| site | the words | change |
|---|---|---|
| `apps/web/src/lib/components/Reading/GuideContent.svelte:53` | « des instructions chorégraphiques pour le tractus vocal » | « pour le conduit vocal » |
| `apps/web/src/lib/components/Reading/GuideContent.svelte:93` | « car la résonance suit la longueur du tractus vocal plutôt que l’étendue chantée » | « la longueur du conduit vocal » |
| `apps/web/src/lib/insights/ratified-lines.test.ts:472` | the pin of the sentence above, verbatim | the same change, **in the same commit** |

**Change the word and nothing else in either sentence.** Both are otherwise ratified text. The agreement does not move: « tractus » and « conduit » are both masculine singular, so « pour le » and « du » stand.

**Why the pinned line changes without going back to Dann:** `CONTRACT.md` section 1 item 6a, a ratified decision is applied and never put to him again, together with the ruling's home above, where he answered this exact stray on 2026-11-22 22:47. `CONTRACT.md` section 1 item 11a is what allows the pin to move with the text, and it requires the report to list what changed. Section 7 of this brief carries that requirement.

## 3. The pins and the stale comments

Take this list, not any earlier record's; the record under-counted and Fable found more.

**`apps/web/src/lib/melody/legend.test.ts`**
- `:115` asserts both English strings. Update.
- `:116` asserts both French strings, with a literal U+2019. Update.
- `:113` is a test title naming the 2026-10-11 20:01 ratification. Rewrite it to name Dann's rulings of 2026-11-22 12:45 and 14:52, keeping the clause about typographic apostrophes, which still holds.
- `:105` is a test title reading `the "from your voice" entry is left out`. That wording leaves the file. Rewrite the title to name the entry by what it now says.

**`apps/web/src/lib/melody/legend.ts`**
- `:65-68`, the doc comment above `MARKUP_TURN_COPY`. It cites the 2026-10-11 20:01 ratification, explains the choice of "from your voice" over "from your sample", and describes how « d'après » is written. All three are superseded. Rewrite it to cite Dann's 2026-11-22 12:45 and 14:52 rulings and to describe the apostrophe as the file now writes it. **Keep the sentence recording that each entry is drawn with its head, in lavender, before the words.**
- `:108`, inside `buildMarkupLegend`'s doc comment, refers to the filled entry as `("from your voice")`. Update the shorthand to the entry's new words.

**Run the sweep yourself and report its counts before you change anything:** grep `apps`, `packages`, and `tests` for `from your voice`, for `d’après`, and for `tractus`. List every hit with its file and line. Do not take a count from this brief.

## 4. What is NOT in this lane

- **MELODY's placeholder sentence.** Held, per section 0. Do not touch `i18n.ts`'s `placeholder.line.markup.*` keys, `apps/web/src/lib/analysis/placeholder-line.ts` or its test, `apps/web/src/lib/lane68-strings.test.ts`, `packages/score-parser/src/placeholder-mark.ts`, or `melody/MarkupPane.svelte:730`.
- **Any i18n key, identifier, file name, CSS selector, or stored value.** Nothing in this lane renames anything; `MARKUP_TURN_COPY`, `MARKUP_TURN_FILLED_TYPE`, and `MARKUP_TURN_HOLLOW_TYPE` keep their names.
- **The rest of consistency batch 3.** Its first slice shipped as N.211 (`ac06d520`); the remainder is inventoried in `brief-code-batch3-slice1-melody-folder-and-determinism_r3_2026-11-22.md` section 4.

## 5. Gates

All eight at baseline, from `~/Downloads/ilya-ship.sh`. Gate 4 is `6804 passed | 1 skipped (6805)` where numpy and scipy are installed and `6800 passed | 5 skipped (6805)` where they are not (`:185`); gate 5 is `911 passed | 5 skipped (916)` (`:187`). Say which you got.

**No test is added or removed; two titles are rewritten.** So gate 4's count should not move. **If it moves, stop and report rather than adjusting a baseline.**

Two phone tests are known to fail on an untouched tree and are not yours: `e2e-phone/insights-links.test.ts:32` and `e2e-phone/voice-stations.test.ts:62`, both sub-pixel.

## 6. This brief changes no computation

No number Ilya computes moves, so `CONTRACT.md` section 4's rule on naming every site that computes the same number does not apply. Say so in the report if you find otherwise, and stop.

## 7. What to report, and what you could not establish

**List every changed string in the report, before and after, in both languages.** That list is what `CONTRACT.md` section 1 item 11a requires of a change to a ratified line, and it goes to Dann.

**NOT ESTABLISHED beats a complete invented answer.**

Report rather than guess: whether any string outside `legend.ts` and `GuideContent.svelte` carries the old wording in a form the section 3 greps would miss; whether any snapshot, fixture, or generated artefact pins either phrase; and whether `tractus` appears anywhere beyond the three sites in section 2b.

## 8. One commit, one report

One commit. One report at `docs/sessions/report-code-melody-wording_r1_2026-11-23.md`. Write nothing under `docs/memory/`. Push to `cloud-lane-85` only, never `Shane` and never `main`, and open no pull request.
