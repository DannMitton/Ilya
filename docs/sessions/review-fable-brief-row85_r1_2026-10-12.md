# Fable's review of row 85's brief (r1, 2026-10-12)

Reviewed against the upload at `/mnt/user-data/uploads/ilya-rewrite/`: the brief, `docs/sessions/draft-french-owed_r1_2026-10-12.md`, `apps/web/src/lib/i18n.ts` (2156 lines), `apps/web/src/lib/insights/singer-blocks.ts` (398 lines), and `docs/sessions/BRIEF-TEMPLATE.md`. Line numbers below are the upload's; the brief says the Mac's may move.

## Verdict: SEND WITH AMENDMENTS

The brief's facts hold. Every key and line it cites is where it says, the twelve strings are the ratified drafts with the full term added in rows 2, 7, and 9 and nowhere else, and the eleven-key list of "primo" or "secondo" alone is complete for `i18n.ts`. The amendments close gaps in the character conventions (the table carries straight apostrophes and ordinary spaces, which the file does not), one line citation, the marker lines Code must edit, the exactness of part C, and two sequencing guards.

## 1. What was checked and holds

**The eleven keys and their lines.** `insights.fit.crossingsCount` (`i18n.ts:1616`), `insights.fit.passaggiTyped` (`:1618`), `insights.figure.primo` (`:1705`), `insights.figure.secondo` (`:1706`), `insights.r2.unlikely.shareHeld` (`:1747`), `insights.r2.unlikely.share` (`:1750`), `insights.r2.unlikely.held` (`:1751`), `insights.r2.inKey` (`:1759`), `insights.r2.inKeyShare` (`:1761`), `insights.r2.primo.none` (`:1769`), `insights.r2.primo.some` (`:1770`). All six cited line numbers match. A case-insensitive search of `i18n.ts` for primo, secondo, primi, and secondi finds no other user-facing hit: the remaining matches are "primo passaggio" or "secondo passaggio" already in full (`:1747`, `:1750`, `:1769`, `:1770`, `:1860` to `:1864`), the plural "passaggi" (`:1617`, `:1728`, `:1942`, `:1971`), and two code comments (`:1768` "time above the secondo", `:1861` "against the secondo"). The only capitalised form is « Primo » at `:1618`, which part B names. Outside `i18n.ts`, the upload's only hits are identifiers in `singer-blocks.ts:147-232` and `analysis/notation-overlay.ts:65,72`, none user-facing.

**The twelve strings against the drafts.** A row-by-row diff of the brief's table (`brief:30-41`) against the drafts (`draft:13-24`) finds three differences, each the insertion of " passaggio" after the italic term: row 2 `unlikely.held` (« *secondo passaggio* »), row 7 `inKeyShare` (« *primo passaggio* »), row 9 `primo.some` (« *secondo passaggio* »). The other nine rows are character-identical to the drafts. The draft's note (`draft:7`) names rows 1, 2, 7, and 9 as the rows that would change; row 1 already carried « *primo passaggio* » in the draft, so the brief's "2, 7, and 9" is the correct count.

**Agreement after the full term.** `passaggiTyped`: « *Primo passaggio* {primo}, *secondo passaggio* {secondo}, indiqués » keeps « indiqués », which the ratified line already uses for the same two nouns elided (`i18n.ts:1618`). `crossingsCount`: « {primo} du *primo passaggio*, {secondo} du *secondo passaggio* » keeps « du » (`:1616`). In `shareHeld`, `inKey`, `primo.none`, and the three changed draft rows, the term follows « votre » or « sous votre » with no adjective or participle referring to it, so nothing else agrees with it. No referent changes anywhere in the eleven keys.

**Part C and `better.interval`.** `insights.r2.compare` takes `interval` from `t(\`key.ruler.interval.${Math.abs(better.semitones)}\`, language)` with no case change (`singer-blocks.ts:236-237`). `insights.r2.better.interval` takes `A` through `capital(...)` (`singer-blocks.ts:201`; `capital` at `:396-398` upper-cases the first character). The French interval values are capitalised and the English lower-case (`i18n.ts:2100-2105`), so `capital` leaves French unchanged and gives English "A minor third"; the ratified « {A} plus bas » (`draft:18`) matches `key.ruler.down` fr « {a} plus bas » (`i18n.ts:2098`). `{A}` stays correct after this brief.

**The ruling condition on the figure labels.** `insights.figure.primo` and `.secondo` are one-word labels (`i18n.ts:1705-1706`); the brief's picture-and-stop instruction (`brief:52`) covers them.

## 2. Amendments

1. **`brief:43`, the character conventions.** Replace the sentence with: "The table above carries straight apostrophes and ordinary spaces for readability. In the file, write every apostrophe as U+2019 (’), as `i18n.ts:1766` and `:1774` do (rows 3, 4, and 8 of the table: « l’avez », « qu’écrite », « L’ambitus », « l’avez »), and write U+00A0 as the literal character, as this block does at `:1747`, `:1774`, and `:1777`, before « % » (rows 1, 7, 9 twice, and 10), before « : » (no row of the twelve), and inside « » (row 11, two places). `&#160;` appears nowhere in `i18n.ts`. The drift test must pass." Reason: "verbatim" at `brief:26` and "the file's conventions" at `brief:43` contradict each other on eight characters, and the brief's rule omits the non-breaking space before « % » that the ratified neighbours use (`i18n.ts:1747`, `:1769`, `:1790`).

2. **`brief:16`, the citation.** Replace "`i18n.ts:2097-2102`" with "`i18n.ts:2100-2105`". Reason: lines 2094 to 2097 are a comment; the six interval values sit at 2100 to 2105.

3. **`brief:26`, the markers.** After "remove its `[FR: desk draft owed]` marker", add: "The markers sit on comment lines, not on the keys: `i18n.ts:1749` (covers the five keys `share`, `held`, `range`, `alone`, `noBetterKey`), `:1760`, `:1771`, `:1773`, `:1776` stand alone and can be replaced by the ratification comment; `:1755` (`better.interval`) and `:1765` (`range.outside`) and `:1768` (`primo.some`) carry the marker in a trailing clause, which is cut and the rest of the comment kept. `:1788` marks `insights.r2.vowels.noTurn`, which already carries French (`:1796`, `draft:9`); strike that clause too, as a stale marker in the same block. The header at `:1734` states the convention and stays." Reason: three of the markers hide inside a clause, and Code searching the twelve keys' lines would find none of them on the line.

4. **`brief:47`, part C made exact.** Replace with: "In `singer-blocks.ts`, add beside `capital` (`:396-398`) a `lowerFirst(s)` that lower-cases the first character, and apply it to the `interval` value at `:237` in both languages. The English values at `i18n.ts:2100-2105` already begin lower-case, so no language test is needed. Change nothing at `:201` (`capital` on `better.interval`) and nothing in `key.ruler.interval.*`." Reason: "pass the French interval with its first letter lower-cased" leaves Code to choose between a language gate and an unconditional helper, and the unconditional helper is the one the data makes safe.

5. **`brief:52`, the pictures.** After the figure-label sentence, add: "Take the same two pictures of the fit table's crossings row (`insights.fit.crossingsCount`, `:1616`, and `insights.fit.passaggiTyped`, `:1618`), which each grow by about twenty characters inside a three-column table (`:1604-1607`). A wrapped cell is fine; a clipped or overflowing cell is reported with the picture under the same condition." Reason: the ruling's collision condition is about space, and these two cells lengthen more than the figure labels do.

6. **`brief:21`, the baseline gates.** After "record the counts", add: "If any gate fails before the change, stop and report; the failure belongs to rows 78a to 79 and is not this row's to fix." Reason: the working tree carries uncommitted work from another row, and a red baseline would otherwise invite Code to repair it.

7. **`brief:22`, the search.** After "list every hit", add: "User-facing strings only: the comments at `i18n.ts:1768` and `:1861` say 'secondo' alone and are not hits. If `insights/comment-text.ts` is not in the tree, say so under Could not establish rather than reporting it empty." Reason: the upload's `apps/web/src/lib/insights/` holds only `singer-blocks.ts`, so the file's existence on the Mac is not established, and the two comments would otherwise be counted as misses.

## 3. Sequencing

The brief places the row after row 79 and before Dann's ship, with both files under a one-lane rule (`brief:3`). That is right. Two risks remain, both covered by amendments 6 and 7: a red baseline from rows 78a to 79, and line drift (the brief already says "locate each by its key", `brief:15`). No other lane touches `i18n.ts` by the brief's own rule, so the hand-off is a single commit by Dann after his look at Insights in French.

## 4. Template

Section 4 is titled "The change" where the template has "The rulings this serves" (`BRIEF-TEMPLATE.md:29`); the two rulings are quoted and dated in section 1 instead (`brief:8-9`). The brief carries no cause, which is the template's point. Displacement is stated (`brief:54`). No amendment.

## Could not establish

- Whether `apps/web/src/lib/insights/comment-text.ts`, `data/blurb-composer.json`, `LearnContent.svelte`, or `GuideContent.svelte` exist on the Mac or hold "primo" or "secondo" alone: none is in the upload. The brief's step 2 re-runs the search, which covers it.
- What the "drift test" and the "eight gates" are, and which tests pin the twelve strings: the upload holds only `markup-pages.test.ts` and `notation-overlay.test.ts`, neither of which mentions these keys.
- The rulings' source text in `docs/memory/PRODUCT.md` and `CONTRACT.md`: not in the upload. Dann's words are taken from the brief (`brief:8-9`) and the draft file (`draft:7`).
- That French treats *passaggio* as masculine: Fable's knowledge, not verified against a source this session; the ratified file already writes « indiqués » for the two nouns (`i18n.ts:1618`) and « votre *passaggio* » throughout, so the brief's agreement claim rests on the file, not on me.
- The maximum value of `Math.abs(better.semitones)`: not read; `key.ruler.interval.*` defines 1 to 6 (`i18n.ts:2100-2105`) and part C changes none of them.
