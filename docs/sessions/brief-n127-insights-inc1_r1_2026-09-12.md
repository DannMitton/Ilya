# Brief: N.127 Insights, increment 1, the tab and the document without the compass

Serves **N.127**, numbered by Dann 2026-09-11. **Goal: Dann opens Ilya and finds
a third document that draws from his own voice and this score.**

Increment 1 builds the tab and every part of page one EXCEPT the compass. The
compass stave and its histogram are increment 2, because they need real drawing
work and Design's three clef passes, and they should not hold up the thing Dann
wants to look at.

Read `docs/memory/CONTRACT.md` in full before you start. Then read Design's
return, which is now in the pack:
`docs/sessions/n127-design-pack/design-return-insights_r3_2026-09-11.dc.html`
(it needs `design-return-insights_r3_support.js` beside it to render).

## 1. What is already ruled. Do not re-decide any of it

All Dann's, 2026-09-11 unless dated otherwise, recorded in `STATE.md`:

- Insights is **read-only, never an input surface**.
- **Every line is computed** from the singer's inputs, or is a sourced advice
  string a predicate fired. Nothing is hand-written.
- It is the **third member of the `DeskHead` pair**, sibling to Transcription
  and Score markup.
- It appears **the instant voice information exists**, thin to deep.
- Its content sits in a **squircle inheriting the watch band**:
  12 px radius, 1 px `--dusty-rose`, cream inside
  (`VoiceProfilePane.svelte:1532-1533`).
- Governing colour **dusty rose**, desk `#DBCACA`, label ink `#8A5C5C` so small
  caps clear 4.5 on cream, `#A67B7B` for lines and marks only. **Colour never
  carries information alone.**
- **Page one is fixed at one page.** A second page only when earned.
- Section headers take `TitleHeader.svelte`'s `.metadata-line` recipe in rose.
- The foot is **one apparatus block**; Insights' copy of `footer.attribution`
  drops the lieder.net clause, and its siblings are untouched.
- **The labelled teacher's blank is DEAD.** Unlabelled negative space stays.
- **Silence is a finding.** Helpful, not comprehensive.
- **French name: « Aperçus », ruled by Dann 2026-09-12.** English `Insights`.

## 2. The data is already there. This is the finding that unblocks the increment

`STATE.md` places Insights behind N.123, the aggregation layer. **It is not
blocked on it.** N.123 unifies four figures that each roll their own totals;
Insights can call the existing seam directly.

Read by the desk 2026-09-12, `packages/score-parser/src/phonation.ts`:

- `aggregatePhonation(parsed, options)` → `PhonationTotals` (`:298`).
- `PhonationTotals` carries `byPitch: Map<number, Fraction>` (`:242`),
  `byVowel?` (`:244`), `byPitchByVowel?` (`:246`), and the total sung time,
  which equals the sum of `byPitch` (`:247`).
- `secondsFor` (`:444`), `midiOf` (`:254`), `hzOf` (`:512`),
  `nominalOscillations` (`:500`), `totalFoldCycles` (`:540`).
- `PhonationCoverage` (`:208`) and `PhonationTrust` (`:221`) already exist to
  say when the reading cannot be trusted. **Use them rather than inventing a
  confidence of your own.**

The typed passaggi live in the calibration (`calib.characteristics.passaggio*`,
`i18n.ts:1102-1105`). Confirm where the profile stores them and say so.

## 3. The tab

`TabId` is a **wire value written to `localStorage` under `ilya:activeTab`**
(`destinations.ts:17-20`), so nothing existing may be renamed. Add a fourth
`StudioDocument`, `'insights'`, and a fifth `TabId`. Update `surfaceFor` and
`tabIdFor`, both of which are total over their unions today (`:52-68`), and
`DeskHead`'s `pairIds` (`DeskHead.svelte:43`) so the pair becomes three.

**Strings.** `tab.insights`: `{ en: 'Insights', fr: 'Aperçus' }`. That French is
ruled and is the only French this increment writes.

**DESKTOP ONLY IN THIS INCREMENT, and say so in the memo.** The desk head does
not fit three documents at 390 px. Measured by the desk on `9026a56`: the head
has 342 px, `Transcription` is 116.05 and `Score markup` 113.03, `Learn` 37.48
and `Guide` 36.15, and `Insights` measures 78.45 in the same style. Three
documents plus the links plus the 16 px gap is about 411.6 against 342.
**Dann has not ruled the direction, so do not invent one.** Leave the row as it
is, note in the memo what it does at 390 px, and let it be its own increment.

## 4. The document, in Design's order

On the rose desk, one squircle, in this order:

1. **Identity head.** Title, composer, then `Insights for <voice name> ·
   calibrated <date>`. The calibration date joining the identity line is a DESK
   DEFAULT Dann has already seen, and it closes N.19.
2. **The fit, in its terms.** A table, four columns: Term, Measured in this
   piece, Your reference range, Flag. Three rows: Range containment, Passaggio
   crossings, Tessitura containment. Then one sentence of plain verdict.
3. **What is flagged, heaviest first.** One entry per hazard, anchored by its
   weightiest instance, naming measure, pitch, vowel and word. If findings
   remain for page 2, say how many and that they print there in full.
4. **The footnote**, carrying the verification marker. **Every citation prints
   `CITATION NOT YET VERIFIED` for now**, because the advice programme has
   verified none. That marker is Design's and it is honest; keep it.
5. **The method line.** What the page was computed from.
6. **The foot**, one apparatus block, lieder.net clause struck.

**NOT the compass.** Leave the space it will occupy; do not draw a placeholder
and do not draw a labelled gap.

## 5. Silence, and what it looks like

Dann's ruling that **silence is a finding** governs every absence here.

- No calibration: Insights still appears, and says what it cannot say. There is
  precedent in the tree for withholding a reading of range and tessitura
  (`i18n.ts:1146-1148`); read those strings before you write new ones.
- A figure `PhonationTrust` distrusts is **not printed**, and the row says so.
- **No estimate, no guess, no placeholder number ever reaches the page.**

## 6. What NOT to do

- Do not make anything on the page clickable, editable, or focusable beyond
  ordinary reading. It is a document.
- Do not rename any existing `TabId` string.
- Do not write French beyond `tab.insights`. Every other new key carries the
  English in both slots with a comment saying the French is OWED, which is the
  tree's own precedent for the six owed names (`i18n.ts:38-56`).
- Do not touch `VocalLineEvent` or `lib/shane/reconciliation/`.
- Do not build N.123. Call `aggregatePhonation` and move on.
- Do not put a mark on the page to say Ilya is unsure. Absence is the mark.

## 7. Definition of done

- At 1400 px, `Insights` sits between `Score markup` and `Learn`, switches, and
  survives a reload with the stored `ilya:activeTab`.
- With Dann's Sunless 01 and his Voice 1 calibration, the document draws his
  title, his voice name, his calibration date, the three-row table with real
  numbers, and at least one flagged finding naming a real measure and vowel.
- With calibration cleared, the document still appears and says what it cannot
  say, with no number on it.
- Five gates at baseline; if gate 4 moves, say the number and move
  `~/Downloads/ilya-ship.sh:79` before the ship.

## 8. The return memo

`docs/sessions/memo-n127-insights-inc1_r1_<date>.md`. Files changed with
`path:line`. Where the profile stores the typed passaggi. What the desk head
does at 390 px with three documents, measured, not predicted. Every string you
added, with its English and the French marked OWED. The gate table. A section
listing what you could not establish.

**NOT ESTABLISHED beats a complete invented answer.**
