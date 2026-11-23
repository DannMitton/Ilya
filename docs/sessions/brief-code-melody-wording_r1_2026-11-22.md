# Code brief: MELODY's two legend lines, and its placeholder sentence

r1, 2026-11-22, by the desk (Opus 5), for Fable's review before the lane is cut. Branch when cut: `cloud-lane-85`, from `Shane` at whatever it is then.

**Ordering, DESK DEFAULT.** Consistency batch 3 (`brief-code-batch3-melody-and-determinism_r2_2026-11-22.md`) renames `apps/web/src/lib/markup/` to `melody/`, and two of the files below sit in it. The two lanes may not run at the same time. Batch 3 goes first, because it is the one thing. **If batch 3 has merged when this lane is cut, every `markup/` path below reads `melody/`, and the desk re-cites this brief before it is sent.**

## 1. What these lines are for

A singer opening MELODY meets a legend that names what each notehead on the page means, and, when her voice is not yet fully sampled, a line under the title that says which of her vowels rest on a placeholder and how Ilya draws a finding that rests on one.

Two of those lines say more than they need to, and one of them is no longer true of the page.

**The legend's two turning-head entries** describe the pitch where a vowel turns. Dann asked on 2026-11-22 12:45 for both to be said more directly, from the singer's side.

**MELODY's placeholder sentence** ends "drawn hollow or dashed". On MELODY a finding that rests on a placeholder is drawn hollow. The "or dashed" belongs to INSIGHTS, which draws dashed and keeps its own wording. Dann ruled the cut at 12:48. INSIGHTS' strings are not this lane's and do not change.

## 2. Dann's rulings, transcribed, and the exact strings

**2026-11-22 12:45, the two legend lines, his words:** *"can we shift the text in the legend of MELODY from "the pitch where this vowel turns, from your voice" to "your pitch of turning for this vowel," and "the same, from a placeholder value" to "the same, but using a placeholder value"?"* The trailing comma inside his first replacement was dropped by the desk as a typo (recorded in `../memory/INBOX.md` at 12:45 as a DESK FLAG; his to restore).

**2026-11-22 12:48, the placeholder sentence:** MELODY's line ends `drawn hollow`, cutting `or dashed`.

**2026-11-22 14:52, the French, all three final and his:** « = votre hauteur de changement de timbre pour cette voyelle », « = la même, mais à partir d'une valeur par défaut », and « Les constats qui en dépendent sont tracés évidés. » He chose « à partir d'une valeur par défaut » over « d'après ». « changement de timbre » is the desk's noun, made from the file's own « change de timbre »; everything else is adopted from the entries already in `legend.ts` and `i18n.ts`. **No French in this lane is owed to him.** Keep U+2019 for every apostrophe, as the file does today.

### 2a. The legend, `apps/web/src/lib/markup/legend.ts`

Read in the tree 2026-11-22 at `e8f64d4f`. `MARKUP_TURN_COPY` opens at `:73`.

| line | from | to |
|---|---|---|
| `:75` | `= the pitch where this vowel turns, from your voice` | `= your pitch of turning for this vowel` |
| `:76` | `= la hauteur où cette voyelle change de timbre, d’après votre voix` | `= votre hauteur de changement de timbre pour cette voyelle` |
| `:79` | `= the same, from a placeholder value` | `= the same, but using a placeholder value` |
| `:80` | `= la même, d’après une valeur par défaut` | `= la même, mais à partir d’une valeur par défaut` |

Each keeps its leading `= ` and its trailing full stop or absence of one, exactly as above.

### 2b. The placeholder sentence, `apps/web/src/lib/i18n.ts`

Four strings, `:2056` to `:2059`: `placeholder.line.markup.many`, `.one`, `.belowCore`, and `.belowCoreOne`.

- English: `drawn hollow or dashed` becomes `drawn hollow`. In `.many` and `.belowCore` and `.belowCoreOne` the clause reads `Findings that rest on a placeholder are drawn hollow or dashed`; in `.one` it reads `Findings that rest on it are drawn hollow or dashed`. **Cut only the two words ` or dashed` in each. Change nothing else in any of the four, including `.one`'s different subject.**
- French: « tracés évidés ou en pointillé » becomes « tracés évidés ». **Cut only « ou en pointillé ».**
- In `.belowCore` and `.belowCoreOne` the sentence is followed by `You can add new fry samples anytime...` and « Vous pouvez ajouter de nouveaux échantillons... »; those sentences stay.

**Do not touch** `placeholder.line.many`, `placeholder.line.one`, `placeholder.line.belowCore`, or `placeholder.line.belowCoreOne` (the keys without `.markup.`). Those are INSIGHTS' and end `drawn dashed` and « tracés en pointillé ». A diff that changes a key without `.markup.` in its name is wrong.

## 3. The pins and the stale comments, with three corrections to the project's own record

The desk's record named three test pins and one test line. Reading the files on 2026-11-22 found more. **Take this list, not the record's.**

**`apps/web/src/lib/markup/legend.test.ts`**
- `:115` asserts both English strings. Update.
- `:116` asserts both French strings. Update. **The record named `:115` only.**
- `:113`'s title reads `says what Dann ratified at 20:01, in both languages, the apostrophes typographic`. The 20:01 ratification was 2026-10-11 and is superseded for these two entries by his 12:45 and 14:52 rulings. **Rewrite the title to name the new date, and keep the apostrophe clause, which still holds.**

**`apps/web/src/lib/analysis/placeholder-line.test.ts`** (note the folder: `analysis/`, not `markup/`, so batch 3 does not move it)
- `:52` is a test TITLE reading `Markup, English, several: ends "drawn hollow or dashed" (row 78a)`. Update the title with the string.
- `:54` asserts the `.many` English string. Update.
- `:59` asserts the `.one` English string. Update.
- `:98` is a test TITLE reading `shows for a song that uses no placeholder vowel, and for MELODY with "hollow or dashed"`. Update.
- `:100` asserts `drawn hollow or dashed. You can add new fry samples anytime`. Update.
- `:101` asserts « tracés évidés ou en pointillé. Vous pouvez ». Update.
- Check the French `.many` and `.one` assertions in the same file and update any that carry « ou en pointillé » for a `markup` call. **The record named `:52`, `:59`, and `:100`; there are at least six sites and two of them are titles.**

**Stale comments, both confirmed read:**
- `apps/web/src/lib/analysis/placeholder-line.ts:61`: `The line at the top of the page, or null when there is none to show. Markup's ends "drawn hollow or dashed".` Rewrite to name MELODY and the new ending.
- `apps/web/src/lib/markup/MarkupPane.svelte:730`: `Markup's line ends "drawn hollow or dashed" (row 78a, Dann 2026-10-11 20:06).` Rewrite to name MELODY, the new ending, and Dann's ruling of 2026-11-22 12:48, keeping the pointer to where the ruling lives (`CONTRACT.md` section 1 item 6).

**Run the sweep yourself and report its counts before you change anything:** grep `apps`, `packages`, and `tests` for `hollow or dashed` and for `ou en pointillé`, and list every hit with its file and line. Do not take a count from this brief. If a hit is INSIGHTS' own wording, leave it and say so.

## 4. Gates

All eight at baseline, from `~/Downloads/ilya-ship.sh`. Gate 4's baseline at `e8f64d4f` is `6804 passed | 1 skipped (6805)` and gate 5's is `911 passed | 5 skipped (916)`; where numpy and scipy are absent the script expects `6800 passed | 5 skipped (6805)` instead (`~/Downloads/ilya-ship.sh:185`, read by the desk 2026-11-22/23). Say which you got.

This lane changes strings and the tests that pin them. **No test is added or removed, so gate 4's count should not move. If it moves, stop and report rather than adjusting a baseline.**

## 5. This brief changes no computation

No number Ilya computes moves, so `CONTRACT.md` section 4's rule on naming every site that computes the same number does not apply. Say so in the report if you find otherwise, and stop.

## 6. What you could not establish

**NOT ESTABLISHED beats a complete invented answer.**

Report rather than guess: whether any string outside `i18n.ts` and `legend.ts` carries either phrase in a form the greps in section 3 would miss; whether any snapshot, fixture, or generated artefact pins either phrase; and whether a MELODY page can reach an INSIGHTS placeholder string by some path, which would make the two wordings meet on one screen.

## 7. One commit, one report

One commit. One report at `docs/sessions/report-code-melody-wording_r1_2026-11-22.md`. Write nothing under `docs/memory/`.
