# Restoring ѣ by dictionary after OCR: measured (r1, 2026-10-12)

Measured by a Sonnet helper for the desk (Opus), 2026-10-12 about 14:40, on row 81's readings (`measure-underlay-baseline_2026-10-12/`), measure only, scratch outside the tree (`$HOME/desk-scratch/yat/` on the bridge, which does not persist). 126k tokens.

**The answer: the constrained correction is too weak to carry ѣ.** For every model it recovers 4 of the 21 printed ѣ and inserts 2 to 4 false ones. For і it recovers nothing.

**Method.** Words rebuilt with row 81's joint sewing. A word changes only when its modernised form is not in Ilya's dictionary and a candidate's is: first a word-final ъЪ collapsed to ъ, then each single look-alike {ъ Ъ Б б ћ Ђ в} replaced by ѣ, left to right, skipping a word-final ъ. First hit accepted.

| Model | ѣ recovered (of 21) | false ѣ | words broken | syllables right (of 493), before to after |
|---|---|---|---|---|
| c (`Cyrillic`) | 4 | 3 | 0 | 315 to 318 |
| a (`rus` best_int) | 4 | 2 | 0 | 295 to 304 |
| b (`rus` best) | 4 | 4 | 0 | 309 to 315 |

- Most of the syllable gain comes from collapsing the doubled hard sign (ъЪ to ъ), not from ѣ: with the collapse off, c 317, a 297, b 310. **The collapse alone is a cheap, safe gain** (row 81 counted 19, 12, and 2 doubled hard signs).
- False ѣ, c: СпитЪъ to Спитѣъ, ДИТЪ to ДИТѣ, сълю to сѣлю. On non-Russian rows the rule also fired (вй to ѣй, and others), so it needs the row's language decided first.
- і: the vowel rule never fired on a Russian row; the dictionary gate cannot tell іе from ие.

**Could not establish:** a rate on more songs (four songs, 21 ѣ); words split across rows; pairing used the helper's own edit-distance alignment, syllables reuse row 81's step 5.

**What it changes (the desk's reading).** The dictionary route is not the change of perspective it looked like; row 82's trained model stays the path for ѣ, ѳ, ѵ, and і. The ъЪ collapse is worth a small Code row on its own.
