# Report: row 85, the twelve Insights strings in French, and "primo passaggio" and "secondo passaggio" in full (r1)

Code (Opus 5.5) on Dann's Mac, 2026-10-12, brief `brief-code-french-twelve-and-full-passaggio_r2_2026-10-12.md`, read whole.

- **Tree:** `9f9e896` on `Shane`, with rows 78a to 79 uncommitted in the tree.
- **No git command that writes.** The work is left uncommitted for Dann's ship.
- **Changed:** only `apps/web/src/lib/i18n.ts`, `apps/web/src/lib/insights/singer-blocks.ts` (part C), and the tests that pin the changed strings.

## 1. The gates before the change (section 3, step 1)

All eight passed before anything changed:

| Gate | Before row 85 |
|---|---|
| 1 phonology | 251 |
| 2 dictionary | 242 |
| 3 web-check | 0 errors, 12 warnings, 5 files |
| 4 web-test | 2477, all passed |
| 5 score-parser | 675 passed, 5 skipped (680) |
| 6 blurb | 145 |
| 7 integration | 55 |
| 8 ratchets | OK |

These are rows 78a to 79's counts. The ship script still reports gates 4 and 5 against its old baselines (2448 and 663), which the desk has not moved; no test failed.

## 2. The search (section 3, step 2)

- **What was searched.** "primo" or "secondo" not followed by "passaggio", in user-facing strings only, both languages, across the five files the brief names:
  - `apps/web/src/lib/i18n.ts`
  - `data/blurb-composer.json`
  - `apps/web/src/lib/components/Reading/LearnContent.svelte`
  - `apps/web/src/lib/components/Reading/GuideContent.svelte`
  - `apps/web/src/lib/insights/comment-text.ts`
- **Hits.** All in `i18n.ts`, in exactly the eleven keys of section 2, each in both languages:
  - `insights.fit.crossingsCount`, `insights.fit.passaggiTyped`
  - `insights.figure.primo`, `insights.figure.secondo`
  - `insights.r2.unlikely.shareHeld`, `insights.r2.unlikely.share` (French only, which was English), `insights.r2.unlikely.held`
  - `insights.r2.inKey`, `insights.r2.inKeyShare`
  - `insights.r2.primo.none`, `insights.r2.primo.some`
- **No hit outside the list.** The other four files have none in a user-facing string.
- **Not hits:** the comments at `i18n.ts:1768` and `:1861`; `comment-text.ts`'s comments (`:11`, `:320`); its code (`const secondo = secondoPart(...)`, `:349-350`); and `PitchSeconds.svelte:70-71`, where `'primo'` and `'secondo'` are internal keys, not printed text.
- **One correction to my own search.** My first filter missed the English figure labels (`'primo'`, `'secondo'`, a whole string value). I caught that and changed them.

## 3. Every string changed

The "before" values are `HEAD`'s, which rows 78a to 79 did not touch for these keys. Rows marked fr in the twelve are verbatim from the brief's table. The file uses U+2019 for apostrophes and U+00A0 before « % » and inside « » (rows 1, 7, 9 twice, 10, and 11 twice), which this table shows as plain characters.

| Key | Language | Before | After |
|---|---|---|---|
| `insights.fit.crossingsCount` | en | {primo} of the primo, {secondo} of the secondo | {primo} of the primo passaggio, {secondo} of the secondo passaggio |
| `insights.fit.crossingsCount` | fr | {primo} du *primo*, {secondo} du *secondo* | {primo} du *primo passaggio*, {secondo} du *secondo passaggio* |
| `insights.fit.passaggiTyped` | en | Primo {primo}, secondo {secondo}, typed | Primo passaggio {primo}, secondo passaggio {secondo}, typed |
| `insights.fit.passaggiTyped` | fr | *Primo* {primo}, *secondo* {secondo}, indiqués | *Primo passaggio* {primo}, *secondo passaggio* {secondo}, indiqués |
| `insights.figure.primo` | en | primo | primo passaggio |
| `insights.figure.primo` | fr | *primo* | *primo passaggio* |
| `insights.figure.secondo` | en | secondo | secondo passaggio |
| `insights.figure.secondo` | fr | *secondo* | *secondo passaggio* |
| `insights.r2.unlikely.shareHeld` | en | In this key, {n} percent of the singing lies above your primo passaggio, {primo}, and bar {bar} holds {a} {pitch} {vowel} for about {s} seconds, above your secondo, {secondo}. | In this key, {n} percent of the singing lies above your primo passaggio, {primo}, and bar {bar} holds {a} {pitch} {vowel} for about {s} seconds, above your secondo passaggio, {secondo}. |
| `insights.r2.unlikely.shareHeld` | fr | Dans cette tonalité, {n} % du chant se situe au-dessus de votre *primo passaggio*, {primo}, et la mesure {bar} prolonge un {vowel} sur {pitch} pendant environ {s} secondes, au-dessus de votre *secondo*, {secondo}. | Dans cette tonalité, {n} % du chant se situe au-dessus de votre *primo passaggio*, {primo}, et la mesure {bar} prolonge un {vowel} sur {pitch} pendant environ {s} secondes, au-dessus de votre *secondo passaggio*, {secondo}. |
| `insights.r2.unlikely.share` | fr | In this key, {n} percent of the singing lies above your *primo passaggio*, {primo}. | Dans cette tonalité, {n} % du chant se situe au-dessus de votre *primo passaggio*, {primo}. |
| `insights.r2.unlikely.held` | en | In this key, bar {bar} holds {a} {pitch} {vowel} for about {s} seconds, above your secondo, {secondo}. | In this key, bar {bar} holds {a} {pitch} {vowel} for about {s} seconds, above your secondo passaggio, {secondo}. |
| `insights.r2.unlikely.held` | fr | In this key, bar {bar} holds {a} {pitch} {vowel} for about {s} seconds, above your *secondo*, {secondo}. | Dans cette tonalité, la mesure {bar} prolonge un {vowel} sur {pitch} pendant environ {s} secondes, au-dessus de votre *secondo passaggio*, {secondo}. |
| `insights.r2.unlikely.range` | fr | Bar {bar} reaches {a} {pitch}, outside the range you typed, {low} to {high}. | La mesure {bar} atteint {pitch}, hors de votre ambitus, {low} à {high}, tel que vous l’avez indiqué. |
| `insights.r2.unlikely.alone` | fr | This makes the song unlikely to sit comfortably in your voice as written. | Cet élément fait que la pièce, telle qu’écrite, a peu de chances de reposer avec aisance dans votre voix. |
| `insights.r2.noBetterKey` | fr | No other key within a tritone fits your voice better. | Aucune autre tonalité, à un triton ou moins, ne convient mieux à votre voix. |
| `insights.r2.better.interval` | fr | This key suits your voice. {A} lower would keep more of the line below your *passaggio*. | Cette tonalité convient à votre voix. {A} plus bas garderait une plus grande part de la ligne sous votre *passaggio*. |
| `insights.r2.inKey` | en | In {key}, {n} percent of the singing lies at or above your primo, and the {pitch} of bar {bar} becomes {pitch2}, under your secondo. | In {key}, {n} percent of the singing lies at or above your primo passaggio, and the {pitch} of bar {bar} becomes {pitch2}, under your secondo passaggio. |
| `insights.r2.inKey` | fr | En {key}, {n} % du chant se situe sur votre *primo* ou au-dessus, et le {pitch} de la mesure {bar} devient {pitch2}, sous votre *secondo*. | En {key}, {n} % du chant se situe sur votre *primo passaggio* ou au-dessus, et le {pitch} de la mesure {bar} devient {pitch2}, sous votre *secondo passaggio*. |
| `insights.r2.inKeyShare` | en | In {key}, {n} percent of the singing lies at or above your primo. | In {key}, {n} percent of the singing lies at or above your primo passaggio. |
| `insights.r2.inKeyShare` | fr | In {key}, {n} percent of the singing lies at or above your *primo*. | En {key}, {n} % du chant se situe sur votre *primo passaggio* ou au-dessus. |
| `insights.r2.range.outside` | fr | Compass {low} to {high} reaches outside your range, {lo} to {hi}, typed. | L’ambitus de la pièce, {low} à {high}, dépasse le vôtre, {lo} à {hi}, tel que vous l’avez indiqué. |
| `insights.r2.primo.none` | en | {n} percent of the singing lies at or above your primo passaggio, {p}, and none above your secondo, {s}. | {n} percent of the singing lies at or above your primo passaggio, {p}, and none above your secondo passaggio, {s}. |
| `insights.r2.primo.none` | fr | {n} % du chant se situe sur votre *primo passaggio*, {p}, ou au-dessus, et rien au-dessus de votre *secondo*, {s}. | {n} % du chant se situe sur votre *primo passaggio*, {p}, ou au-dessus, et rien au-dessus de votre *secondo passaggio*, {s}. |
| `insights.r2.primo.some` | en | {n} percent of the singing lies at or above your primo passaggio, {p}, and {m} percent above your secondo, {s}. | {n} percent of the singing lies at or above your primo passaggio, {p}, and {m} percent above your secondo passaggio, {s}. |
| `insights.r2.primo.some` | fr | {n} percent of the singing lies at or above your *primo passaggio*, {p}, and {m} percent above your *secondo*, {s}. | {n} % du chant se situe sur votre *primo passaggio*, {p}, ou au-dessus, et {m} % au-dessus de votre *secondo passaggio*, {s}. |
| `insights.r2.compare` | fr | A key {interval} lower would bring that to {m} percent, and the compass, {low} to {high}, stays inside your range. | Transposée {interval} plus bas, la pièce ramènerait cette part à {m} %, et son ambitus, {low} à {high}, resterait dans le vôtre. |
| `insights.r2.fr1.many` | fr | {count} notes meet a vowel’s first resonance (fR1), in “{heading}.” | {count} notes rencontrent la première résonance (fR1) de leur voyelle, dans « {heading} ». |
| `insights.r2.nearPassaggioOne` | fr | Notes in bar {bars} sit near your *passaggio*. | Dans la mesure {bars}, des notes se situent près de votre *passaggio*. |

**The comments.**

- The `[FR: desk draft owed]` markers on these keys are replaced by one ratification comment each. It cites Dann 2026-10-12 11:48 (`docs/sessions/draft-french-owed_r1_2026-10-12.md`, section A) and 11:49 for the full terms. The places:
  - the comment over the five "unlikely" keys;
  - `better.interval`, `inKeyShare`, `range.outside`, `primo.some`, `compare`, `fr1.many`, and `nearPassaggioOne`.
- The clause on `insights.r2.vowels.noTurn` is struck.
- The header at `:1734` still states the convention, as the brief says.
- No marker remains on any of the twelve; the only `[FR: desk draft owed]` left in the file is that header line.

**Part C.**

- `apps/web/src/lib/insights/singer-blocks.ts:401`: `lowerFirst`, beside `capital`.
- Applied to the `interval` value of `insights.r2.compare` at `:237`, in both languages.
- `capital` on `better.interval` (`:201`) and `key.ruler.interval.*` are unchanged.

**Tests.**

- `singer-blocks.test.ts` +2:
  - French prints « Transposée une tierce mineure plus bas, la pièce ramènerait cette part à 7 » (lower case);
  - English is unchanged, "A key a minor third lower".
- `singer-blocks.test.ts`: the "unlikely" English sentence is re-pinned with "secondo passaggio".
- `french-italics.test.ts:67`: `insights.figure.secondo` is re-pinned to `*secondo passaggio*`.
- `tessituragram-layout.test.ts:494`, re-pinned. See section 4.
- The French spacing drift test passes.

## 4. The pictures (section 5)

**The pitch figure at 390 px.** In `docs/sessions/rows-78-79-shots/85/`, taken with `figure85.mjs` (headless Chrome, phone width, localhost:5173, a bass voice):

- `sunless-pitch-figure-en-390.png` and `-fr-390.png`;
- `tchaikovsky-pitch-figure-en-390.png` and `-fr-390.png`.

**The passaggio labels fit.** « secondo passaggio D♯4 » and « primo passaggio A3 » stand inside the 276 px figure, their right edges at 198 and 178 px. Neither box touches another text. The same holds in both languages and both songs.

**A clipped label that is not this row's.** The bracket label for the singer's comfortable working zone runs past the figure's right edge at 390 px, in both languages:

- "your comfortable working zone, typed" / « votre zone de travail confortable, telle que vous l’avez indiquée ».
- Its strings are `insights.r2.yourTessitura` and `insights.fit.span`, which this row did not change.
- The same French label already ran to the edge at desktop width in row 78a's pictures (`rows-78-79-shots/78a/after-sunless-insights-fr-p2.png`).
- It is reported here; it is not this row's to fix.

**The figure's layout test.**

- `tessituragram-layout.test.ts` checks that a wall placed beside the tessitura bracket adds two leader lines. In French it now adds one.
- **Why.** With « primo passaggio » in full, the French layout without the wall already gives the "centre" label its leader.
- **What still holds.** The test's own assertions that nothing touches and nothing is unplaced still pass.
- The test is re-pinned to 1 in French and 2 in English.
- **A caution about the model.** The test's stub measure counts the italic asterisks as letters. The live picture is the better witness, and it shows no collision.

**The fit table's crossings row.** NOT pictured. `FitTable.svelte` is imported nowhere in `apps/web/src`, so no page draws `insights.fit.crossingsCount` or `insights.fit.passaggiTyped`. The strings are changed, as the brief asks, but no surface shows them.

## 5. The gates after

| Gate | Before row 85 | After row 85 |
|---|---|---|
| 1 phonology | 251 | 251 |
| 2 dictionary | 242 | 242 |
| 3 web-check | 0 errors, 12 warnings, 5 files | the same |
| 4 web-test | 2477 | **2479**, all passed |
| 5 score-parser | 675 passed, 5 skipped (680) | the same |
| 6 blurb | 145 | 145 |
| 7 integration | 55 | 55 |
| 8 ratchets | OK | OK |

- **Gate 4: +2.** `insights/singer-blocks.test.ts` 12 to 14, the two interval tests. The re-pinned tests change no count.
- **A failure on the way, recorded.** My first gate run after the change had one failure, `french-italics.test.ts`, which pinned the old `*secondo*`. I had missed it in my targeted test run. It is re-pinned, and the second run passed all eight.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **The fit table's row on a page:** no page draws `FitTable.svelte` (section 4).
- **Whether the comfortable-zone label was clipped at 390 px before rows 78a to 85.** I did not take a 390 px picture before. It is not this row's string.
- **Dann's look at Insights in French.** DONE is his. Walk on **http://localhost:5173** (uncommitted; Vercel will not show this until you commit and push).
