# Report: rows 90 and 94, ratified lines into the Guide and Insights

Cloud lane, branch `cloud-lane-5`, after row 97 (`00517a0`). Line numbers below are in the tree as committed with this report, which is after rows 95 and 97 and after this row's own insertions.

## The answer in three lines

1. Row 90: the two French conventions lines are seated, the Insights frame line lost its clause in both languages, and the pins follow. Row 94: the teacher-as-intermediary paragraph sits directly after paragraph A in both Guides.
2. Every string was built from the briefs' text with the typographic rules below; five tests pin them.
3. Gates: only web test moved, 2507 to 2512 (+5, all in `ratified-lines.test.ts`). The row 97 guard needed a one-test change because these rows add lines (see "Found").

## Where each line was seated

**Row 90 (a), French conventions list** (`GuideContent.svelte`, the `<ul>` that begins under the comment « QUEUE row 67 »):
- **Item 1** is the last sentence of the existing « Noms de personnes » `<li>` (`:290`), after « …une formulation neutre le remplace. » (Fable's amendment 6, the desk's reversible recommendation.)
- **Item 3** is a new `<li>` (`:293`) directly after « Plis vocaux » (`:292`).
- The English Guide's counterpart is the one paragraph beginning "Language." (not a list); no English added, and a test pins that neither OQLF page is linked from the English branch.

**Row 90 (b), `insights.r2.frame`** (`apps/web/src/lib/i18n.ts:1748`): only the first sentence's clause removed. Pins at `ratified-lines.test.ts:10-19`.

**Row 94, the teacher paragraph:** a new `<p>` directly after paragraph A (the paragraph under `id="guide-markup-forecast"`), which row 97 had already replaced with the ratified text. French at `:63`, English at `:352`. The brief says "the Guide has no Insights section"; the heading is now « Ce que prévoient les Aperçus » / « What Insights forecasts », so the new paragraph sits under it.

## Each string as built, quoted from the tree

**`insights.r2.frame`, first sentence** (`i18n.ts:1748`):
- EN: « Ilya’s advice is drawn from the intersection of your voice as you calibrate and describe it, and the demands of the music you are investigating. » The second and third sentences are unchanged.
- FR: « Les conseils d’Ilya sont tirés de la rencontre entre votre voix, telle que vous la calibrez et la décrivez, et les exigences de la musique que vous étudiez. » The rest is unchanged.

**Item 1** (end of `:290`):
`Le féminin en premier&#160;: l’<a href="https://vitrinelinguistique.oqlf.gouv.qc.ca/23991/" target="_blank" rel="noopener">OQLF</a> laisse l’ordre libre et recommande de placer le masculin le plus près de l’adjectif qui s’accorde; <em>Ilya</em> place donc le féminin en premier.`

**Item 3** (`:293`):
`<li><strong>Références</strong>&#160;: selon la <a href="https://vitrinelinguistique.oqlf.gouv.qc.ca/23245/" target="_blank" rel="noopener">notice bibliographique de l’OQLF</a> (lieu, éditeur, année).</li>`

**Row 94, English** (`:352`):
`<p><em>Ilya</em>’s advice gathers what a wide range of established singing voice pedagogy literature says about the conditions it finds in a piece and in your voice. Without a teacher in the conversation, that advice can mislead you, or not suit your voice. Bring anything <em>Ilya</em> offers about technique to your voice teacher. <em>Ilya</em> is made to work in partnership with a teacher’s informed ear.</p>`

**Row 94, French** (`:63`):
`<p>Les conseils d’<em>Ilya</em> rassemblent ce qu’un large éventail de la littérature établie en pédagogie du chant dit des conditions qu’il relève dans une pièce et dans votre voix. Sans professeure ou professeur de chant dans la conversation, ces conseils peuvent vous induire en erreur, ou ne pas convenir à votre voix. Discutez de tout ce qu’<em>Ilya</em> propose sur la technique avec votre professeure ou professeur de chant. <em>Ilya</em> est conçu pour travailler en partenariat avec l’oreille avertie d’une professeure ou d’un professeur.</p>`

**Rules applied, and where the ratified text was changed in form (not in words):**
- **Apostrophe: typographic U+2019** (the briefs' straight marks in « l'OQLF », « qu'un », « d'Ilya », « teacher's », and the like became ’), matching `:564` and `:277` as amendment 10 says, and the surrounding new passages of row 97.
- **French colons:** U+00A0, written `&#160;` as the neighbouring list items write it, before the colons in « Le féminin en premier » and « Références ». The ratified lines carry ASCII spaces there; `i18n.test.ts:111` would fail on them.
- **`<em>Ilya</em>`** in every occurrence, as the Guide's body does.
- **The label « Références »** is bold, like every other item's label, and keeps its colon (so it reads « Références : selon… »). The existing items put a full stop after the bold label; this one keeps the ratified colon. If Dann prefers « Références. Selon… », that is a change of punctuation only.
- **Item 1 inside the Noms de personnes item** reads, in full: « …le féminin en premier : « votre professeure ou professeur ». Là où le doublet alourdirait une phrase qui revient souvent, une formulation neutre le remplace. Le féminin en premier : l’OQLF laisse l’ordre libre… ». « Le féminin en premier » therefore appears twice in one item. This is what Fable's amendment 6 recommended, and it is reversible; whether it reads as duplication is the desk's and Dann's call. The alternative, a separate `<li>`, changes no words.
- **Link text:** the brief names the pages but not the words to link. I linked « OQLF » in item 1 and « notice bibliographique de l’OQLF » in item 3. That is my choice.

## The tests

`apps/web/src/lib/insights/ratified-lines.test.ts`:
- The EN and FR frame pins updated to the new sentence (`:10-19`); their titles now say which clause was dropped.
- Five new tests in a second `describe` that reads `GuideContent.svelte` as source: item 1 (and that it sits inside the Noms de personnes item); item 3 (and that it follows « Plis vocaux » inside the list); no OQLF link in the English branch; the row 94 paragraph EN and FR, each directly after paragraph A's last words.

## The eight gates

| Gate | Baseline (`50a5f85`) | After row 95 | After row 97 | After rows 90 and 94 |
|---|---|---|---|---|
| 1 phonology | 251 | 251 | 251 | 251 |
| 2 dictionary | 248 | 248 | 248 | 248 |
| 3 web check | 0 errors, 12 warnings in 5 files | same | same | same |
| 4 web test | 2474 | 2483 | 2507 | **2512** (+5, `ratified-lines.test.ts`) |
| 5 score-parser | 675 passed, 5 skipped | same | same | same |
| 6 blurb | 145 | 145 | 145 | 145 |
| 7 integration | 55 | 55 | 55 | 55 |
| 8 ratchets | OK | OK | OK | OK (454 files) |

## Found

- **A fix to my own row 97 test.** The guard of row 97 listed its two known figcaptions by line number (94 and 381). Rows 90 and 94 added lines above them and the test failed (the French caption moved to `:96`, the English to `:386`). I changed the test to name the two figcaptions by their words ('Transcription, Fit, Leçons et Guide' and 'Transcription, Fit, Learn, and Guide'), which does not drift. The row 97 report's statement of the guard ("two listed lines, 94 and 381") describes the version as committed in that row; this is the version that stands. The change is in `no-fit-name.test.ts`.
- **Found, not fixed:** the brief's item (the Markup conventions paragraph still saying "Fit", "sage", and « A red rounded box marks an fR1/fo crossing ») is **omitted, as amendment 11 says**: row 97 replaced that paragraph (B) before this row ran. Nothing else found.

## Could not establish

- **The source file** the brief cites for row 94 (`~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/draft-musical-analysis-module_r1_2026-10-13.md`, lines 162 to 168) is not in the tree, as the lane amendment (f) says. The text above is the brief's copy; I could not compare it to that file. Fable verified it on 2026-10-14 according to the brief, which I could not check.
- **Whether the built pages look right.** I did not draw the Guide page in either language, so how the two new list items and the new paragraphs read on screen is not seen.
- **That the OQLF pages say what the lines claim.** I did not open `vitrinelinguistique.oqlf.gouv.qc.ca/23991/` or `/23245/`; the sandbox's network allows only some hosts and I did not try. The lines are ratified by Dann; the links are as the brief gives them.
