# Memo: how Audiveris perceives, processes, and relays text (Sonnet subagent, 2026-10-01)

**Provenance.** Returned by a Sonnet subagent spawned by the desk (Fable) at about 15:47 on 2026-10-01, on Dann's instruction to look with fresh eyes. The agent was given the questions and none of the project's earlier conclusions. Saved here verbatim. **The desk has NOT opened the Audiveris source itself; every READ below is the agent's reading, not the desk's.** Cost: 220,372 tokens, 54 tool uses, 3.6 minutes.

---

Answers below are from a shallow clone of Audiveris `master`, and everything marked READ comes from files I opened there. Paths are relative to `app/src/main/java/org/audiveris/omr/`, and "Handbook" means the handbook markdown under `docs/_pages/` in the same clone.

**1. Where text reading sits and what the OCR sees**
- READ: The step order is LOAD, BINARY, SCALE, GRID, HEADERS, STEM_SEEDS, BEAMS, LEDGERS, HEADS, STEMS, REDUCTION, CUE_BEAMS, TEXTS, MEASURES, CHORDS, CURVES, SYMBOLS, LINKS (`step/OmrStep.java:~64-72`). So OCR runs after staves, heads, stems and beams are found. It runs before chords, measures and symbols, and syllable-to-note linking waits for LINKS.
- READ: The OCR gets one whole-sheet image, not one per system. `SheetScanner.getCleanImage` starts from `Picture.SourceKey.NO_STAFF`, so staff lines are already removed. `TextsCleaner.eraseInters` blanks every inter that is frozen or contextually good (`PageCleaner.canHide`), including head pixels and ledgers thickened by 2 px. It also fills each staff's core area (0.25 interline margin) and erases any glyph touching a core. `OcrUtil.scan` adds a 10 px white margin.
- READ: Per-system filtering happens afterwards. `TextBuilder.getSystemValidLines` keeps only words wholly inside the system area.

**2. Engine, mode, language**
- READ: It uses Tesseract through JavaCPP, in legacy mode (`TesseractOrder.process`: `OEM_TESSERACT_ONLY`). The segmentation mode is `PSM_AUTO` for the whole sheet (`TesseractOCR.getMode`). A 70 dpi source resolution is passed (`typicalImageResolution`).
- READ: The language is one "+"-joined string such as `fra+eng` (`Language.SEP_CHAR`). It resolves through global default `eng`, then book, then sheet (`sheet/Params.java:~274,312`; `SheetStub.getOcrLanguages`), and is passed to `api.Init`. So several languages can be active at once, but the choice is per sheet and never per text item. The Handbook (`guides/main/languages.md`) warns that too many languages slow recognition and add false recognitions.

**3. What a piece of text IS**
- READ: `TextRole.guess` is purely positional and geometric. Its inputs are the staff position (above, within or below the system), first or last system, left of the staves, page-centred, right-aligned, width (tiny/short), height of at least 2 interlines (title), distance from the nearest staff, majority italic, and whether every word parses as a chord name. `MetronomeInter.isLikely` handles metronome marks. Part names are matched against a regex that accepts any line containing a word character.
- READ: Text becomes Lyrics only if the `lyrics` switch is on (default true) or `lyricsAboveStaff` (default false), and its part position is below the staves, or above when the second switch is on.
- READ: Everything else defaults to Direction or UnknownRole. There is no dictionary of tempo or dynamics words. Words of 3 characters or fewer stay in the image for SYMBOLS to try as dynamics (`SymbolsFilter`, `maxSymbolLength=3`), while lyric items are erased there.
- READ: A `hasVowel` test is computed in `guess` but its use is commented out (`///&& hasVowel`).

**4. Lyric lines and multiple verses**
- READ: `mergeRawLines` chains OCR lines whose deskewed ordinate gap is at most 1.0 interline, then merges them left to right into "long lines". Each long line gets a role.
- READ: `mapLyricLines` assigns the staff. When staves above and below belong to different parts and `lyricsAboveStaff` is off, it picks the staff above, which would be the voice staff in a vocal-over-piano system. Otherwise it splits a gutter between parts with `partitionLines`/`findBreak`.
- READ: Each lyric line becomes one `LyricLineInter`. `Part.sortLyricLines` sorts them by ordinate and numbers them 1, 2, ... per staff and above/below. Each line is therefore one verse.
- INFERRED: A printed translation line would simply be the next numbered line. I found no special handling for it.

**5. Syllables**
- READ: For lyric lines, `TextLine.splitWords` uses `WordScanner.OcrScanner` with `bySyllable=true`. It splits on `-`, the undertie U+203F, and `_`, en dash and em dash (`StringUtil`), each returned as its own item. It also splits where the gap between characters exceeds `getMaxCharGap`, which carries the comment "very rough value to be refined and explained!".
- READ: `LyricItemInter.inferItemKind` types each item as Elision, Extension (more than one character), Hyphen (a single one, because "Tesseract often takes a hyphen for an isolated extension character"), Number, Punctuation or Syllable.
- READ: Isolated punctuation merges into the preceding syllable. A leading number such as "1." is split off as a Number item (`createValid`).
- READ: `defineSyllabicType` reads the neighbouring items. A hyphen before and after gives MIDDLE, a hyphen before only gives END, after only gives BEGIN, and neither gives SINGLE. `PageStep.refineLyrics` runs it and can look across parts through `getFollowingLine`.
- READ: Long dashes that OCR returns as a blank are rebuilt as underscore characters (`TextWord.adjust`).

**6. Syllable to note**
- READ: In `LyricItemInter.lookupLink`, the reference x is the item's centre. Candidate head chords are in the assigned staff, on the correct side of the text, with |dx| of at most 3 interlines (`maxItemDx`). The winner is the chord with the smallest squared Euclidean distance from the item's reference point (centre x, baseline y) to the chord centre.
- READ: Only Syllable items link (`mapToChord`, `searchLinks`). `ChordSyllableRelation` is single-source: one chord per syllable, while a chord may take syllables from different verses. If two syllables in one line want the same chord, the one whose x is closer to the head keeps it and the other looks for a second choice.
- READ: Syllable without a note: the item is kept and flagged abnormal (`checkAbnormal`). Note without a syllable: no relation is made and nothing is flagged.
- READ: Melismas have no dedicated code. A grep for "melisma" finds nothing. Extension items never link, and `PartwiseBuilder.processSyllable` exports only syllable text and syllabic type.

**7. Low confidence or garbage**
- READ: Dropped silently, with only a debug or trace log (`TextWord.checkValidity`, `TextLine.checkValidity`):
  - words with confidence below 0.30;
  - words containing a backslash or invalid XML characters;
  - bracket-only words;
  - tuplet-like dashed words;
  - whole lines with mean confidence below 0.65 (`TesseractOCR.minConfidence`);
  - lines with an oversized font (above 5 interlines, or 8 in the sheet header).
- READ: Words without Tesseract font info are skipped (`TesseractOrder.getLines`), and words that map to no pixel sections are removed (`mapGlyphs`).
- READ: The one visible flag is the abnormal state on syllables with no chord. The line grade combines OCR confidence with length and is capped at 0.90.

**8. Known weaknesses**
- READ: The Handbook TEXTS page says "Documentation not yet provided".
- READ: `TextItem.VOWELS` is Latin only, with the comment "Accents? Cyrillic?".
- READ: The `TextWord.adjust` javadoc says OCR output on long dashes is poor and font size is not reliable.
- READ: The Handbook `reference/limitations.md` says Tesseract cannot handle sharp and flat characters in chord names.
- READ: The 5.9 changelog line reads "Support for Cyrillic OCR'd characters". The code I read does not show what changed.
- READ via WebFetch summary only, so second-hand: issue #938 says the maintainer chose the legacy model because it handles lyric syllables and gives character bounding boxes. Issue #633 says misclassified lyrics cannot be re-typed as ordinary text without redoing the OCR. Issue #273 discusses legacy versus newer Tesseract.

**Ideas worth borrowing**
- Blank staff lines and good symbols, then fill the staff core and erase glyphs touching it, so lyric glyphs are not cut by staff remnants (Q1).
- Classify a text line by geometry relative to the staves, and do not use a vowel test; a Latin-only test would fail Cyrillic anyway (Q3, Q8).
- Group lines by vertical gap, number verses per staff, and sit the voice staff above the piano by default (Q4).
- Treat hyphens, extenders and elisions as their own items, derive BEGIN/MIDDLE/END from the neighbours, and rebuild blank-valued long dashes as extenders (Q5).
- Link by closest chord within a fixed dx, with one syllable per chord per verse and a closer-x tiebreak (Q6).
- Return the unlinked syllable and its flag instead of dropping it, and record why anything was dropped (Q6, Q7).

**Could not establish**
- GitHub issue and discussion search: the search pages are blocked by robots.txt for WebFetch, and the REST and gh paths returned 403. I fetched only issues #938, #273, #633 and #55 through WebFetch summaries, and found no Cyrillic-specific issue.
- What the 5.9 "Cyrillic OCR'd characters" change actually does: the clone is shallow, so there is no history to blame.
- The profile-dependent variants of `maxItemDx`, and the internals of `MetronomeInter.isLikely` and `ChordNameInter`.
- Anything about old typefaces: nothing in the Handbook or code.
- Whether the legacy engine's Cyrillic accuracy is good: the code can't show this.

Source: GitHub `Audiveris/audiveris` `master`, commit `7a36078e7ba0c006052c1f661b949cf9b729f505` (2026-08-13, no tags in the shallow clone).
