# ILYA PROJECT HANDOVER
## Complete Context Recovery Document
**Date:** January 30, 2026  
**Prepared by:** Claude (Project Manager)  
**For:** Future Claude sessions  

---

## CRITICAL: READ THIS ENTIRE DOCUMENT BEFORE RESPONDING

You are resuming work on Ilya, a Russian lyric diction IPA transcription tool. This document contains everything you need to understand the project, the people involved, and where we are in development.

**Do not:**
- Ask Dann to re-explain things covered here
- Make assumptions about Grayson's rules without checking sources
- Rush implementations
- Expand scope beyond what's requested

**Do:**
- Follow the one-change-per-cycle protocol
- Verify against Grayson before implementing phonological rules
- Include both GitHub repo and live site links when sharing builds
- Accommodate Dann's AuDHD needs

---

## PART 1: THE PEOPLE

### Dann Mitton (Project Owner)

**Who he is:**
- Canadian singer-educator with a music doctorate
- Teaches voice in Toronto, specializing in low male voices
- Voice pedagogy researcher, evidence-based vocal science practitioner
- Located in Toronto, Ontario, Canada

**Working style:**
- Has AuDHD (Autism + ADHD). This is not incidental — it shapes how we work together.
- Requires clear, sequential workflows
- One change per cycle: propose → ask "Proceed?" → wait for "yes" → implement
- Gets overwhelmed by nested complexity, long unbroken lists, dense text
- Needs breaks acknowledged; knows when he's at capacity
- Values kindness and grace alongside directness

**Communication preferences:**
- Canadian spelling, Oxford comma, Chicago-style citations
- Never use em-dashes (use commas, colons, semicolons instead)
- Scholarly warmth — precise, calm, grounded, never generic
- No filler language, hype, apology padding, or motivational fluff
- Mirror his tone back to him
- When frustrated, slow the pace rather than mirror the frustration

**Trust and integrity:**
- Integrity is primary — attribution, accurate citation, no hallucination
- Never edit Dann's authored content (blurbs, glosses, scholarly text) — he provides exact replacement text
- Quality over speed — rushing leads to bugs that require extensive rework
- Trust is built through accuracy, restraint, and follow-through

**When sharing builds:**
- ALWAYS include both links:
  - GitHub repo: https://github.com/DannMitton/Ilya
  - Live site: https://dannmitton.github.io/Ilya/
- Include test text if relevant
- Include commit message and extended description
- Clear directions on which tasks to carry out

### Kimi (UX/Design Lead)

**Who she is:**
- Another AI collaborator (not Claude)
- Lends expertise in architecture, design, and UX
- Has been part of this project from early stages
- Dann consults her on major interface decisions

**Working relationship:**
- Claude spots potential issues in Kimi's designs
- Kimi optimizes UX and provides architectural guidance
- Major interface decisions require Kimi consultation
- She's particularly good at progressive disclosure and mobile accessibility
- She handles data pipeline debugging well

**Communication with Kimi:**
- Dann acts as intermediary (copy-pastes between us)
- Handoffs should be clean, specific, actionable
- Include all relevant context — she doesn't share our memory

### Claude (You — Project Manager)

**Your role:**
- Project manager and primary implementer
- You change the code; Kimi advises on design
- Your opinions hold weight because you've built this from idea to UX
- Dann appreciates the collaboration between you and Kimi

**Your responsibilities:**
- Maintain project continuity across sessions
- Verify all phonological rules against Grayson before implementing
- Follow the one-change-per-cycle protocol strictly
- Create comprehensive handover documentation (like this)
- Never expand scope without explicit approval

---

## PART 2: WHAT IS ILYA?

### Overview

**Ilya** (formerly MSR — My Sung Russian) is a web application that transcribes Russian Cyrillic text to IPA for classical singers. It uses Craig Grayson's 2012 dissertation "Russian Lyric Diction" as the sole phonological authority.

**Live at:** https://dannmitton.github.io/Ilya/  
**Repository:** https://github.com/DannMitton/Ilya  
**License:** AGPL-3.0

### Primary Audiences

1. **Undergraduate music students** — Need basic pronunciation guidance
2. **Voice teachers and coaches** — Require detailed phonological explanations

### Core Philosophy

- **"Trustworthy through playfulness"** — Scholarly accuracy with warm, approachable UI
- **"Calm Authority" aesthetic** — Professional but not intimidating
- **Sung Russian, not spoken Russian** — Rules reflect theatrical/operatic tradition rooted in Old Muscovite pronunciation
- **Grayson is the sole authority** — Never substitute general Russian phonetics knowledge

### Technical Stack

- Single HTML file with embedded CSS and JavaScript
- GitHub Pages hosting
- No build process, no dependencies
- Modular architecture within the single file

### Key Features (Current)

1. **Transcription engine** — Operationalizes Grayson's complete phonological system
2. **Interactive stress marking** — Click syllables to set stress, IPA updates live
3. **Stress dictionary** — 416K words from Kaikki/Wiktionary + Singer's Supplement
4. **Vowel reduction** — Akanye/ikanye based on position relative to stress
5. **Consonant rules** — Palatalization, regressive voicing assimilation, deletion clusters
6. **ё toggle** — Toggle between ё and е for publisher variants
7. **Cross-word boundary assimilation** — Final devoicing, voicing across word boundaries
8. **Educational popups** — "Why this transcription?" with phoneme ribbons
9. **PDF generation** — Multi-page documents with proper pagination
10. **Composer/poet attribution** — Searchable dropdowns with dates
11. **Glosses** — Word meanings from dictionary, with smart extraction for clean display

### The Grayson Principle

**CRITICAL:** Grayson's dissertation is the ONLY authority for transcription rules.

- Never substitute general Russian phonetics knowledge
- When in doubt, check Grayson source files
- Include page citations for educational transparency
- The distinction between phonological accuracy and singer utility is crucial

**Grayson source files** are uploaded to the project as:
- `MSR_CH_2_*.docx` through `MSR_CH_7_*.docx`
- `MSR_Appendix_D.docx`
- `Grayson_TOC.pdf`

---

## PART 3: CURRENT STATE (v5.10.12)

### What Was Accomplished This Session (2026-01-29/30)

#### v5.10.5 — Name Display Reordering
- Dropdown: "Lastname, Firstname (dates)" for sorting
- Title page: "Firstname Lastname (dates)" for reading
- Running header: "SURNAME — TITLE" for identification

#### v5.10.6 — Keyboard Input on Dropdowns
- Composer/poet dropdowns now respond to typing
- Type any character to open and start filtering

#### v5.10.7 — Composer Reselection Bug Fix
- Fixed stale `filteredData` when reopening dropdown after selection

#### v5.10.8 — Acute Stress Marks on Cyrillic
- Cyrillic vowels now show combining acute (◌́) on stressed syllables
- Exception: ё/Ё already indicates stress, so no acute added
- Applied to both word stack and popup displays

#### v5.10.9 — Gloss Truncation + ё Lookup Fallback
- PDF stack glosses truncated to 5 words max
- Dictionary lookup tries ё→е normalization when exact match fails

#### v5.10.10 — Smart Gloss Extraction
- `extractCleanGloss()` strips verbose dictionary entries
- "translated as X" → X
- "diminutive of Y: Z" → Z

#### v5.10.11 — Strip Verbose Parenthetical Glosses
- "I (first-person singular subject pronoun)" → "I"
- "house, building (a residential building)" → "house, building"
- Keeps useful clarifications like "birch (tree or wood)"

#### v5.10.12 — Add Missing Adjectives to SINGER_SUPPLEMENT
- Added 39 common adjectives manually
- Stopgap for kaikki extraction bug

### Known Bug: Kaikki Adjective Extraction

**The problem:**
- Our 416K-word dictionary is missing EVERY adjective lemma
- Nominative masculine singular forms (красивый, молодой, etc.) were not extracted
- All inflected forms exist, but base forms are missing
- This is a kaikki.org extraction bug, not a data source issue

**Root cause (identified by Kimi):**
- Kaikki extracts Wiktionary's "forms" tables literally
- For Russian adjectives, the lemma itself is NOT in the `forms` array
- It's the headword, not an inflected form
- Our script looks for `'canonical'` in tags, but for adjectives the canonical form is often implicit

**The fix (partially implemented):**
- Updated extraction script to check multiple locations:
  1. `head_templates[].args.1`
  2. `head_templates[].expansion`
  3. `forms[]` with `canonical` tag
  4. First form with any accent
- BUT: The fix isn't working yet — entries still missing
- Debug tracing added but not yet run with full output capture

**Stopgap:**
- Added 39 common adjectives to SINGER_SUPPLEMENT manually
- This covers immediate needs for singers

**Status:**
- Extraction script updated: `/mnt/user-data/outputs/extract_ilya_dictionary.py`
- Needs further debugging — entries are being processed but not appearing in final output
- Kimi may be better suited to debug this data pipeline issue

### Files in Current Build

**Main application:**
- `/mnt/user-data/outputs/index.html` (v5.10.12)

**Dictionary:**
- `/mnt/user-data/outputs/data/ilya_dictionary.json.gz` (416K words, but missing adjective lemmas)

**Extraction script:**
- `/mnt/user-data/outputs/extract_ilya_dictionary.py` (updated with debug tracing)

**Documentation created this session:**
- `USER_GUIDE_NOTES.md` — Content for user documentation
- `LEARN_MODULE_NOTES.md` — Pedagogical content about sung vs spoken Russian

---

## PART 4: ARCHITECTURE NOTES

### GraysonEngine

The core transcription engine. Key methods:

- `transcribe(word, stress, isClitic, procliticPosition)` — Main entry point
- `syllabify(word)` — Split word into syllables
- `lookupStress(word)` — Dictionary lookup with ё fallback
- `applyCrossWordAssimilation(transcribedWords)` — Handle word boundaries

### Dictionary Lookup Order

1. `STRESS_DICTIONARY` — Main kaikki-derived dictionary
2. `SINGER_SUPPLEMENT` — Hand-curated common words
3. ё-restoration — Try substituting е→ё if not found
4. ё-normalization — Try substituting ё→е if not found

### Display Functions

- `formatGlossForDisplay(gloss, pos, lemma)` — For PDF stack (5 word max)
- `formatGlossForPopup(gloss, pos, lemma)` — For popup (more detail allowed)
- `extractCleanGloss(gloss)` — Strip verbose patterns
- `addStressMarkToCyrillic(word, syllables)` — Add acute to stressed vowel
- `addAcuteToSyllable(syllable)` — Add acute to single syllable

### SearchableSelect

Custom dropdown component for composer/poet selection:
- `SearchableSelect.instances` — Stores all instances
- Must reset `filteredData` on `open()` to prevent stale index bugs
- Keyboard navigation: typing opens and filters immediately

---

## PART 5: PENDING WORK

### Immediate (Ready to Implement)

1. **Commit v5.10.12 to GitHub** — Current build ready for deployment

### Short-term (Needs Kimi or Fresh Session)

2. **Debug kaikki extraction** — Entries being processed but not appearing in output
   - Kimi handoff prepared (see PART 6)

### Medium-term (Planned Features)

3. **Complete "Why this transcription?" system** — Phoneme ribbons in popup
4. **Syllable button redesign** — Drag-and-drop consonants, open syllable toggle
5. **OCR integration** — For printed scores

### Long-term (Future Phases)

6. **Multi-schema support** — Toggle between Grayson vs Belov/Walters
7. **Mobile optimization**
8. **Comprehensive educational features**

---

## PART 6: KIMI HANDOFF — KAIKKI EXTRACTION BUG

### For Kimi: Debugging the Adjective Extraction

**Context:**
We're extracting a Russian dictionary from kaikki.org (Wiktionary dump) for Ilya. The extraction works for most words (416K extracted), but ALL adjective lemmas are missing.

**The raw data is good:**
```json
// grep '"красивый"' kaikki.org-dictionary-Russian.jsonl shows:
{
  "word": "красивый",
  "pos": "adj",
  "forms": [
    {"form": "краси́вый", "tags": ["canonical"]},  // Stress IS here
    ...
  ],
  "senses": [{"glosses": ["beautiful, handsome"]}]
}
```

**What Claude tried:**
1. Updated extraction to check `head_templates[].args.1` first
2. Added fallbacks: `expansion`, `forms[]` with canonical, first accented form
3. Added debug tracing for test words
4. BUT: Running the script shows no TRACE output for these words

**Theory:**
The entries might be getting processed but lost somewhere:
- Duplicate detection discarding them?
- Key mismatch between processing and lookup?
- Unicode normalization issue?

**Debug points added:**
- `TRACE: Found '{word}'` after stress detection
- `Added to dictionary as '{key}'` after insertion
- `Pre-flatten check:` before final output

**Files:**
- Extraction script: `extract_ilya_dictionary.py`
- Input: `kaikki.org-dictionary-Russian.jsonl` (on Dann's machine)
- Output: `ilya_dictionary.json.gz`

**What Kimi could do:**
1. Review the extraction logic flow
2. Identify where entries are being lost
3. Fix the bug so adjective lemmas are captured

**Stopgap in place:**
39 common adjectives manually added to SINGER_SUPPLEMENT. App works for typical use cases.

---

## PART 7: COMMIT INFORMATION

### Ready to Commit: v5.10.12

**Commit message:**
```
v5.10.12 Add missing adjectives to SINGER_SUPPLEMENT
```

**Extended description:**
```
Session 2026-01-29/30 changes:
- v5.10.5: Reorder names for title page display
- v5.10.6: Keyboard input on composer/poet dropdowns
- v5.10.7: Fix composer/poet reselection bug
- v5.10.8: Acute stress marks on Cyrillic display
- v5.10.9: Gloss truncation + ё lookup fallback
- v5.10.10: Smart gloss extraction (extractCleanGloss)
- v5.10.11: Strip verbose parenthetical glosses
- v5.10.12: Add 39 common adjectives as stopgap for kaikki bug

Known issue: Kaikki extraction missing adjective lemmas.
Stopgap in place; full fix pending.
```

---

## PART 8: RECOVERY CHECKLIST

When starting a new session on Ilya:

### Before Doing Anything:
- [ ] Read this handover document completely
- [ ] Check for any newer handover documents in project files
- [ ] Note the current version number
- [ ] Understand what was last accomplished

### For Any Code Changes:
- [ ] Follow one-change-per-cycle protocol
- [ ] Propose change → Ask "Proceed?" → Wait for explicit "yes"
- [ ] Never expand scope without approval
- [ ] Test before delivering

### For Phonological Rules:
- [ ] Check Grayson source files before implementing
- [ ] Include page citations
- [ ] Never substitute general Russian phonetics knowledge

### When Sharing Builds:
- [ ] Include GitHub repo link: https://github.com/DannMitton/Ilya
- [ ] Include live site link: https://dannmitton.github.io/Ilya/
- [ ] Include test text if relevant
- [ ] Provide commit message and extended description

### For Dann's Wellbeing:
- [ ] Watch for signs of overwhelm
- [ ] Keep explanations sequential, not nested
- [ ] One question at a time
- [ ] Acknowledge when breaks are needed
- [ ] Mirror his tone; slow down if frustrated

---

## PART 9: GLOSSARY

**Akanye** — Vowel reduction pattern where unstressed о reduces toward а  
**Ikanye** — Vowel reduction pattern where unstressed е/я reduce toward и  
**Grayson** — Craig Grayson, author of "Russian Lyric Diction" (2012), the sole authority for Ilya's rules  
**Kaikki** — kaikki.org, a structured dump of Wiktionary data  
**Lemma** — The dictionary headword form of a word  
**Old Muscovite** — Historical Moscow stage pronunciation, the basis for sung Russian diction  
**Proclitic** — Unstressed word that attaches phonologically to the following word (e.g., в, к, с)  
**Enclitic** — Unstressed word that attaches phonologically to the preceding word (e.g., же, ли)  
**SINGER_SUPPLEMENT** — Hand-curated dictionary of common monosyllables and words missing from kaikki  

---

## PART 10: SESSION LOG

### 2026-01-29/30 (This Session)
- Versions: v5.10.5 → v5.10.12
- Major: Acute stress marks, gloss cleaning, keyboard dropdowns
- Bug found: Kaikki missing all adjective lemmas
- Stopgap: 39 adjectives added to SINGER_SUPPLEMENT
- Status: Ready to commit to GitHub

### Previous Sessions
- See `/mnt/transcripts/` for full conversation logs
- See project files for earlier handover documents:
  - `SESSION_SUMMARY_2026-01-08.md`
  - `MSR_STATE_HANDOFF.md`
  - `MSR_RECOVERY_PACKAGE.md`

---

**END OF HANDOVER DOCUMENT**

*Future Claude: Read this completely. Dann depends on your reliability. Behave with integrity.*
