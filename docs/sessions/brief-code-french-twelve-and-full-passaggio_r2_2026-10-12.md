# Brief for Code: the twelve Insights strings in French, and "primo passaggio" and "secondo passaggio" in full (r2, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 11:51. **r2, about 11:55: applies Fable's seven amendments** (`docs/sessions/review-fable-brief-row85_r1_2026-10-12.md`, SEND WITH AMENDMENTS); r1 superseded. QUEUE row 85. **For Code on the Mac, after row 79, before Dann's ship** (`apps/web/src/lib/i18n.ts` and `insights/singer-blocks.ts` carry rows 78a to 79's uncommitted edits, so no other lane may touch them). Fable reviews this brief before Code gets it (`docs/memory/CONTRACT.md`, the paragraph of 2026-10-11 22:36).

## 1. What was observed

- Twelve Insights strings print English in both languages, each marked `[FR: desk draft owed]` (`apps/web/src/lib/i18n.ts`, the block after the comment "INSIGHTS FOR THE SINGER, Design round 2").
- Dann ratified the desk's twelve French drafts on 2026-10-12 at 11:48: *"I ratify the twelve as drafted"* (`docs/sessions/draft-french-owed_r1_2026-10-12.md`, section A).
- Dann ruled at 11:49: *"I think I prefer primo passaggio and secondo passaggio in full"* (`docs/memory/PRODUCT.md`, the paragraph after the Russian-o naming line). Eleven English strings use "primo" or "secondo" alone (the desk's grep of `i18n.ts`, 2026-10-12 11:47).

## 2. What is established, each line carrying its `path:line`

Read by the desk 2026-10-12 11:44 to 11:50, on the Mac's working tree (which already holds row 78a's edits; line numbers may move):

- The eleven keys with "primo" or "secondo" alone in English: `insights.fit.crossingsCount` (`i18n.ts:1616`), `insights.fit.passaggiTyped` (`:1618`), `insights.figure.primo` (`:1705`), `insights.figure.secondo` (`:1706`), `insights.r2.unlikely.shareHeld` (`:1747`), `insights.r2.unlikely.share`, `insights.r2.unlikely.held`, `insights.r2.inKey` (`:1759`), `insights.r2.inKeyShare`, `insights.r2.primo.none` (`:1769`), `insights.r2.primo.some`. Locate each by its key.
- `insights.r2.compare` fills `{interval}` from `key.ruler.interval.N` (`apps/web/src/lib/insights/singer-blocks.ts`, the `fill(T('insights.r2.compare')` call); the French values are capitalized (« Un ton », « Une tierce mineure », `i18n.ts:2100-2105`), and the English values are lower case.
- `data/blurb-composer.json`, `LearnContent.svelte`, and `GuideContent.svelte` hold no "primo" or "secondo" alone (desk's grep, 2026-10-12 11:50).

## 3. Measure before you change anything

1. Run the eight gates and record the counts (they include rows 78a to 79). If any gate fails before the change, stop and report; the failure belongs to rows 78a to 79 and is not this row's to fix.
2. Re-run the desk's search over every user-facing string (`i18n.ts`, Learn, the Guide, `data/blurb-composer.json`, `insights/comment-text.ts`) for "primo" or "secondo" not followed by "passaggio", in both languages, and list every hit. User-facing strings only: the comments at `i18n.ts:1768` and `:1861` say "secondo" alone and are not hits. If `insights/comment-text.ts` is not in the tree, say so under Could not establish rather than reporting it empty. A hit outside section 2's list is added to the work and named in the report.

## 4. The change

**A. The twelve French strings, verbatim** (ratified 11:48; rows 2, 7, and 9 carry the full terms per the 11:49 ruling, which is the only change from the drafts). Replace each key's French and remove its `[FR: desk draft owed]` marker; add a comment citing the ratification. The markers sit on comment lines, not on the keys: `i18n.ts:1749` (covers the five keys `share`, `held`, `range`, `alone`, `noBetterKey`), `:1760`, `:1771`, `:1773`, `:1776` stand alone and can be replaced by the ratification comment; `:1755` (`better.interval`), `:1765` (`range.outside`), and `:1768` (`primo.some`) carry the marker in a trailing clause, which is cut and the rest of the comment kept. `:1788` marks `insights.r2.vowels.noTurn`, which already carries French (`:1796`); strike that clause too. The header at `:1734` states the convention and stays.

| Key | French |
|---|---|
| `insights.r2.unlikely.share` | Dans cette tonalité, {n} % du chant se situe au-dessus de votre *primo passaggio*, {primo}. |
| `insights.r2.unlikely.held` | Dans cette tonalité, la mesure {bar} prolonge un {vowel} sur {pitch} pendant environ {s} secondes, au-dessus de votre *secondo passaggio*, {secondo}. |
| `insights.r2.unlikely.range` | La mesure {bar} atteint {pitch}, hors de votre ambitus, {low} à {high}, tel que vous l'avez indiqué. |
| `insights.r2.unlikely.alone` | Cet élément fait que la pièce, telle qu'écrite, a peu de chances de reposer avec aisance dans votre voix. |
| `insights.r2.noBetterKey` | Aucune autre tonalité, à un triton ou moins, ne convient mieux à votre voix. |
| `insights.r2.better.interval` | Cette tonalité convient à votre voix. {A} plus bas garderait une plus grande part de la ligne sous votre *passaggio*. |
| `insights.r2.inKeyShare` | En {key}, {n} % du chant se situe sur votre *primo passaggio* ou au-dessus. |
| `insights.r2.range.outside` | L'ambitus de la pièce, {low} à {high}, dépasse le vôtre, {lo} à {hi}, tel que vous l'avez indiqué. |
| `insights.r2.primo.some` | {n} % du chant se situe sur votre *primo passaggio*, {p}, ou au-dessus, et {m} % au-dessus de votre *secondo passaggio*, {s}. |
| `insights.r2.compare` | Transposée {interval} plus bas, la pièce ramènerait cette part à {m} %, et son ambitus, {low} à {high}, resterait dans le vôtre. |
| `insights.r2.fr1.many` | {count} notes rencontrent la première résonance (fR1) de leur voyelle, dans « {heading} ». |
| `insights.r2.nearPassaggioOne` | Dans la mesure {bars}, des notes se situent près de votre *passaggio*. |

The table above carries straight apostrophes and ordinary spaces for readability. In the file, write every apostrophe as U+2019 (’), as `i18n.ts:1766` and `:1774` do (rows 3, 4, and 8: « l’avez », « qu’écrite », « L’ambitus », « l’avez »), and write U+00A0 as the literal character, as this block does at `:1747`, `:1774`, and `:1777`: before « % » (rows 1, 7, 9 twice, and 10), before « : » (no row of the twelve), and inside « » (row 11, two places). `&#160;` appears nowhere in `i18n.ts`. The drift test must pass.

**B. The full terms, both languages.** In every hit from section 3 step 2, "primo" becomes "primo passaggio" and "secondo" becomes "secondo passaggio" (French: « *primo passaggio* », « *secondo passaggio* », italic as now; « Primo » at a sentence start becomes « *Primo passaggio* »). Change no other word. Agreement: « indiqués » in `passaggiTyped` still agrees with the two masculine nouns.

**C. The lower-case interval in French.** In `singer-blocks.ts`, add beside `capital` (`:396-398`) a `lowerFirst(s)` that lower-cases the first character, and apply it to the `interval` value at `:237` in both languages. The English values at `i18n.ts:2100-2105` already begin lower-case, so no language test is needed. Change nothing at `:201` (`capital` on `better.interval`) and nothing in `key.ruler.interval.*`.

## 5. Constraints

- Change only `apps/web/src/lib/i18n.ts`, `apps/web/src/lib/insights/singer-blocks.ts` (part C), and the tests that pin the changed strings. No other wording changes.
- **The figure labels** (`insights.figure.primo`, `.secondo`): after the change, take one picture of the Insights pitch figure at 390 px wide in each language. If a label collides or is clipped, keep the full term, report it with the picture, and stop; that case is Dann's (`PRODUCT.md`, the 11:49 ruling's condition). Take the same two pictures of the fit table's crossings row (`insights.fit.crossingsCount`, `:1616`, and `insights.fit.passaggiTyped`, `:1618`), which each grow by about twenty characters inside a three-column table (`:1604-1607`). A wrapped cell is fine; a clipped or overflowing cell is reported with the picture under the same condition.
- No git command that writes. Dann ships.
- **Displaces:** nothing.

## 6. Done when

- No user-facing string in either language says "primo" or "secondo" without "passaggio".
- The twelve keys carry the French above, verbatim, and no `[FR: desk draft owed]` marker remains on them.
- `insights.r2.compare` in French prints « Transposée une tierce mineure plus bas » (lower case), shown by a test.
- All eight gates pass; gate 4's new count is reported with the tests changed or added.
- `WRITTEN` on the code; DONE is Dann's look at Insights in French.

## 7. Report back

`docs/sessions/report-code-french-twelve-and-full-passaggio_r1_2026-10-12.md`: section 3's hit list, every string changed (key, before, after), the two pictures, the gates, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set row 85's State in `docs/memory/QUEUE.md` and stop.
