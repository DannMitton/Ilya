# Brief for Code: ⟨ц⟩ and ⟨ш⟩ palatalize where Grayson says they do

**Desk brief r1, 2026-09-26. Shape: `BRIEF-TEMPLATE.md`.** Build on `Shane`
after the `audit` branch is merged, because the approval tests on that branch
will show exactly which outputs change.

## 1. What was observed

Ilya's output today (`transcribeWord`, 943,106 dictionary entries loaded, run by
the desk 2026-09-26):

| word | Ilya |
|---|---|
| цвет | `ˈtsvʲɛt` |
| цветок | `tsvʲɪˈtok` |
| революция | `rʲɪvɑˈlʲutsɨjɪ` |
| декламация | `dʲɪkɫɑˈmɑtsɨjɪ` |
| лекция | `ˈlʲɛktsɨjɪ` |
| пшют | `ˈpʃut` |
| цирк | `ˈtsɨrʲk` |

Grayson prints the ⟨ц⟩ palatalized in цвет, цветок, революция, and декламация,
and the ⟨ш⟩ palatalized in пшют. He prints лекция and цирк hard.

## 2. What is established

- `packages/phonology/src/engine.ts:237`: `alwaysHard: new Set(['ж', 'ш', 'ц'])`.
  `:908`: `if (this.alwaysHard.has(char)) continue; // ж, ш, ц never palatalize`.
- Grayson, *Russian Lyric Diction* (2012), `~/Downloads/Grayson - 2012 - Russian
  Lyric Diction.pdf`. **Logical page = physical PDF page minus 16.** His
  Cyrillic and IPA use a keyboard-mapped font, so the text layer is garbled
  there: read the IPA from the rendered page image, never from the text layer.
  - p. 163: ⟨ш⟩ "generally cannot be palatalized"; one word, пшют ("fop",
    obsolete) and its forms, has a palatalized ⟨ш⟩.
  - p. 166: ⟨ц⟩ stays "unpalatalized under almost all conditions".
  - p. 168: exceptions. Some proper and geographical names where ⟨я⟩, ⟨ю⟩, or ⟨ё⟩
    follows ⟨ц⟩ (Цюрих, "though [the hard form] is fine, too"); "certain
    declensional endings" covered in his Chapter 8; and цвет with its
    derivatives, where ⟨ц⟩ is palatalized "within the cluster" before ⟨е⟩ or ⟨ё⟩.
  - pp. 283–284: the suffixes -ция and -ционный palatalize ⟨ц⟩, and the ⟨и⟩
    after it stays [i] rather than becoming [ɨ], "only when [-ция] is analogous
    to the English suffixes -tion or -ence". Where -ция answers to *-ture*, as
    in лекция, "the normal rules apply".
- Dictionary counts, desk's scan of `data/dictionary.86d83340-{a,b}.json`:
  755 forms contain цве or цвё; 3,950 end in a form of -ция; 1,206 contain
  -ционн-; 34 have ⟨ц⟩ before ⟨ю⟩, ⟨я⟩, or ⟨ё⟩; пшют is absent. **Not every
  -ция word answers to -tion or -ence** (греция, Greece, is one), so spelling
  alone cannot decide it. Dann's ruling is a word list.

## 3. Measure before you change anything

1. Read Grayson pp. 163, 166–168, and 283–284 as page images, and his Chapter 8
   section on declensional endings with palatalized ⟨ц⟩ (find its page). Report
   each rule in his words with its page.
2. Build the candidate word list: group the dictionary's -ция and -ционн- forms
   by lemma, and show each lemma's English gloss from the dictionary. Mark each
   lemma "palatalize" when the gloss answers to -tion, -sion, -ence, or -ance,
   and "normal" otherwise. List every "normal" lemma, and every lemma you could
   not classify, for Dann. Do the same for the цве/цвё forms, listing any whose
   root is not цвет.
3. Find where a word-level exception can enter the engine without a new
   phonological predicate: the singer supplement (`data/singer-supplement.json`,
   which already holds `цветов`) or an equivalent the engine already reads.
   Report which, and why.

## 4. The rulings this serves

- Dann, 2026-09-26 09:34: *"The engine should follow Grayson especially since he
  has devoted text to these anomalies. Yes to the word list."*
- `CONTRACT.md` §6: do not hand-roll a phonological predicate; IPA comes from the
  engine.

## 5. Constraints

- **⟨ж⟩ is out of scope.** Grayson presents its palatalized variants as matters
  of style (pp. 165, 174), not as rules. That is a separate ruling.
- Change nothing else in the engine. Every approval file must stay byte-identical
  except for lines containing an affected word; list each changed line.
- No git command that writes.
- **Displaces:** nothing scheduled; this is a correctness fix.

## 6. Done when

- Each word in section 1's table matches Grayson's printed transcription for it,
  read from the page image, with a unit test per word citing the page.
- лекция and цирк are unchanged, and each has a test that pins it.
- The approved IPA corpus changes only on lines holding affected words, and the
  change is re-approved deliberately (`vitest -u` on that file only).
- All gates pass, including `pnpm ratchets` and Playwright.
- `WRITTEN` on the code. `DONE` is Dann's walk on революция, цветок, and лекция.

## 7. Report back

The word list with its classifications, the lemmas left for Dann, the commit,
the results against section 6, and what could not be established. **NOT
ESTABLISHED beats a complete invented answer.**
