# Report from Code, r1: the four voice-state entries are out of Markup's footer legend

Brief: `brief-code-markup-legend-four-out_r1_2026-09-28.md`. Base `de31e22` on `Shane`. The working tree was already dirty with the desk's `docs/memory/STATE.md` and `OPEN.md` and two untracked briefs; none of those are mine. Nothing committed, staged, stashed, checked out, or restored.

## What changed

1. **`apps/web/src/lib/markup/legend.ts`** (175 lines to 68). Removed `MARKUP_LEGEND_ORDER`, `MarkupLegendType`, `MARKUP_LEGEND_COPY` (the eight Captured, Provisional, Estimated, and Unmeasured strings), and `markupLegendTypes`. Kept `MARKUP_WITHHELD_TYPE` (`legend.ts:39`) and the withheld copy unchanged in both languages. `buildMarkupLegend` (`legend.ts:56`) no longer takes `formants`: its signature is now `buildMarkupLegend(language, { withheldSyllables })`, and it returns `[]` or the one withheld entry. The `CalibratedFormant` and `Vowel` imports went with it.
2. **The module header** (`legend.ts:1-29`) now says the legend is one entry for the one mark on the page that needs a key. The section "WHAT WAS HERE, AND WHY IT IS GONE" (`legend.ts:10`) records the removal, your words of 22:17 and 22:18, the three reasons the desk found, and that `reading` and `noiseFloor` stay on `CalibratedFormant`.
3. **The one caller**, `apps/web/src/lib/markup/MarkupPane.svelte:688`: `buildMarkupLegend(language, { withheldSyllables: !!withheldIpa })`. Its doc comment (`MarkupPane.svelte:421`) no longer describes a four-line glossary of voice readings. The file went from 1312 to 1302 lines.
4. **`apps/web/src/lib/markup/legend.test.ts`** (210 lines to 65). The ten tests of the four are gone. The withheld tests stay, rewritten for the new signature: absent without the flag, the whole legend with it, the constant `PageFooter` compares against, copy in both languages that differs, and the drawn sigla. One test is new: neither language's label may contain any of the four removed words. The old test "sits last, after every voice state" had nothing left to sit after, so it is gone.
5. **Comments only, DESK DEFAULT.** `LegendItem.textOnly` existed only for the four, and now no builder sets it. I left the field and its `PageFooter` branch in place (a shared type, harmless, and outside the brief) and said so where each is defined: `provenance.ts:32` and `PageFooter.svelte:57`. The withheld entry no longer sets `textOnly: false` explicitly. Absent already means "draw the circle", and the test checks that it is falsy.

**Not touched:** `CalibratedFormant.reading` and `noiseFloor`, or anything that reads them. `i18n.ts` never held the four, so nothing changed there.

## Gates

| Gate | Result | Baseline |
|---|---|---|
| 1 phonology | 251 passed (251) | 251 |
| 2 dictionary | 235 passed (235) | 235 |
| 3 web check | 0 errors and 12 warnings in 5 files | same |
| 4 web test | **1671 passed (1671)** | 1681 |
| 5 score-parser | 633 passed, 5 skipped (638) | same |
| 6 blurb | 145 passed (145) | 145 |
| 7 integration | 55 passed (55) | 55 |
| 8 ratchets | ratchets: OK. | OK |

**Gate 4 moves 1681 to 1671.** That is 15 legend tests out and 5 in. Update the baseline in `~/Downloads/ilya-ship.sh` line 90 to `"1671 passed (1671)"` before shipping, or the script refuses. No file grew. `MarkupPane.svelte` is at 1302 against its ceiling of 1358.

## Screenshots

Taken on `http://localhost:5173`, the dev server already running from this tree. It served the new `legend.ts`, which I confirmed by fetching the module. Each screenshot used a fresh scratch origin. Files are in `apps/web/test-results/_legend-four-out/`, which is gitignored:

- `en-clean-voiced.jpg`, `fr-clean-voiced.jpg`: the unedited `sunless-01-engraved.musicxml` with a desk-built **test voice that carries all four old states**: Captured, Provisional (ɪ, ɑ), Estimated (ɨ, ʌ), and Unmeasured on a. The header reads "Formant profile: a map of Test voice's resonances". The footer has no legend row. Before this change, this page printed the four lines.
- `en-withheld.jpg`, `fr-withheld.jpg`: a page with a withheld syllable and no voice. The footer shows one line with its sigla.
- `en-withheld-voiced.jpg`, `fr-withheld-voiced.jpg`: the same page with the test voice. It still shows exactly one line with one sigla. The DOM confirms one `.legend-circle` in both languages.

**How I got a withheld syllable on a page.** On an uploaded score, the poem seat places every syllable. A placed note is never withheld (`MarkupPane.svelte`, `withheldIpa`), and an unplaced note inside the seated run is blanked (`vacatedNotes`, `lib/score/pairings.ts:661`). So a plain edit to the fixture gave no withheld syllable. I made two changes. In a copy of the fixture, I changed the last syllable `я.` to `яя.`, so the last word has six syllables on five notes. Then, on that scratch origin only, I deleted the stored pairings for that last word from IndexedDB. Those notes then sit after the seated run, with the queue unfinished, so they keep the file's words, and the resolver withholds the word. This is a constructed state, not an ordinary walk. The staged fixture copies are deleted. The scratch origins (`legendw`, `legendw2`, and `legendc.localhost`) still hold their test song and voice in the pane's storage.

## What I could not establish

- **Whether an ordinary upload can produce a withheld syllable at all.** Every route I tried without editing storage ended with the note either seated or blanked. I tried an elided word mid-song and an elided word at the end. The legend entry is correct when the flag is set, but whether a singer can reach that state today without a hand edit is NOT ESTABLISHED. It may deserve its own look. It is not part of this brief.
- **The withheld sigla on the stave itself** for this constructed page. I looked only at the footer, and the elided word sits on the page-2 system.
- **The stale comment at `MarkupPane.svelte:1076-1078`** ("No provenance legend items yet; the legend row simply stays empty…") predates this change and was already wrong. I left it, because it is outside the brief.
- **Playwright** was not run. The brief did not name it, and the desk's 84-capture comparison is the desk's.
