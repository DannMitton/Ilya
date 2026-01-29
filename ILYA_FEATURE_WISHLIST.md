# Ilya (formerly MSR) — Complete Feature Wishlist
**Compiled**: January 28, 2026  
**Source**: Comprehensive audit of all past project conversations  
**Purpose**: Roadmap planning reference — every idea ever expressed, regardless of feasibility

---

## Legend
- ✅ **Implemented** — Currently working in the app
- 🚧 **In Progress** — Partially built or actively being developed
- 📋 **Queued** — Agreed upon, waiting for implementation
- 💭 **Wishlist** — Mentioned as desirable, not yet committed
- 🔮 **Future (v2.0+)** — Explicitly deferred to post-release

---

## 1. CORE TRANSCRIPTION ENGINE

### Phonological Rules ✅
- [x] Cross-word boundary voicing assimilation (Grayson Ch. 6.3)
- [x] Final consonant devoicing
- [x] Within-word regressive voicing assimilation
- [x] Regressive palatalization with categorical restrictions
- [x] Interpalatal fronting (е/ɛ distinction)
- [x] Vowel transcription after always-hard consonants (ж, ш, ц)
- [x] Progressive palatalization of /r/ after front vowels
- [x] Feminine adjective suffix exception (-ая/-яя → /ɑjɑ/)
- [x] Reflexive verb endings (-тся/-ться → /tːsʲʌ/)
- [x] Old Muscovite adjectival rule (-кий/-гий/-хий endings)
- [x] русский exception (single /s/ not geminate)
- [x] Proclitic reduction (host-stress-aware: /ɑ/ vs /ʌ/)
- [x] Preposition "о" interjection vs. preposition detection

### Phonological Rules 📋
- [ ] Palatalization exception for в/с/з prepositions before soft consonants
- [ ] из Петербурга syllabification edge case

### Phonological Rules 💭
- [ ] Slow-tempo mode (reconstitute reduced vowels for sustained notes)
- [ ] Swipe sections to mark as "slow" (Grayson-justified vowel reconstitution)
- [ ] Tempo-aware transcription (automatic reconstitution detection)

---

## 2. STRESS & SYLLABIFICATION

### Stress System ✅
- [x] Dictionary-based stress assignment (51,643+ entries from OpenRussian)
- [x] Wiktionary harvest system for unknown words
- [x] ё-detection with smart lookup (е→ё substitution fallback)
- [x] User stress reassignment with provenance tracking
- [x] Stress provenance indicators (dictionary/composer/user choice)
- [x] Default first-syllable stress for unknown words
- [x] ё stress locking (words with ё auto-lock stress)

### Syllabification ✅
- [x] Sonority-based syllabification algorithm
- [x] Soft/hard sign handling
- [x] Protected suffixes system (placeholder strategy)

### Stress & Syllabification 💭
- [ ] Syllable boundary drag-and-drop editing
- [ ] Consonant cluster simplification (drag to shed consonants)
- [ ] Visual indication of provisional/guessed stress (grey styling)

---

## 3. OCR INTEGRATION

### OCR Features ✅
- [x] Tesseract.js v5 multilingual OCR (rus+eng)
- [x] Cyrillic density filtering (≥50% threshold)
- [x] Garbage pattern detection
- [x] Latin→Cyrillic post-processing
- [x] Line structure preservation for verse
- [x] Mobile camera capture
- [x] 1200px image resize for memory protection

### OCR Phase 2 💭
- [ ] Provenance tags for OCR-sourced text
- [ ] Dark mode inversion for scanned images
- [ ] Rotation detection
- [ ] Memory usage monitoring on low-end devices
- [ ] Confidence thresholds (40% skip, 80% dubious)

---

## 4. USER INTERFACE

### Current Interface ✅
- [x] Document-like paper view with IPA transcription
- [x] Word popups for stress reassignment
- [x] Phrase boundary controls (soft/hard)
- [x] Syllable buttons with click-to-stress
- [x] Real-time IPA updates
- [x] Narrated progress messages
- [x] Bottom-anchored collapsible drawer for input
- [x] Letter-sized paper proportions (816×1056px)

### Confirmation Flow & Staging 🚧
- [x] Staging pattern for stress source attribution (pencil→pen metaphor)
- [x] Apply/Revert buttons for sensitive controls
- [ ] IPA preview with dimming for staged changes
- [ ] 5-minute timeout for abandoned staged edits
- [ ] Batched "Apply All" when multiple changes staged
- [ ] Pulse animations to prompt metadata capture

### Visual & Aesthetic 💭
- [ ] Skins/theming system
- [ ] Dark mode
- [ ] Fancy bracket visuals around phrase units
- [ ] Stress circle colour coding (green/yellow provenance)
- [ ] Underline affordance for clickable elements
- [ ] Ghost text labels
- [ ] Opacity spotlight effects for contextual syllables

### Layout & Responsiveness 💭
- [ ] Responsive drawer layout (input 2/3, dashboard 1/3 on desktop)
- [ ] Mobile tabs navigation
- [ ] Pinch-zoom PDF viewport for mobile
- [ ] Touch-optimized 56px tap targets
- [ ] Thumb-accessible controls (bottom-right positioning)

---

## 5. EDUCATIONAL FEATURES ("WHY THIS TRANSCRIPTION?")

### Phoneme Ribbon 🚧
- [x] Three-layer architecture: summary, phoneme ribbon, citations
- [x] 85 phoneme explanation blurbs
- [x] Grayson page citations
- [ ] Syllable-grouped expandable explanations
- [ ] Context-aware dynamic explanations (Layer 2)
- [ ] Inline golden tests for regression checking

### Educational Content ✅
- [x] Generic lookup table (85 phoneme entries)
- [x] Multi-language examples (English, French, German, Italian)
- [x] Consistent notation standards (⟨⟩ // [])

### Educational Features 💭
- [ ] "Ghost step" pattern for obsolete letters (ѣ → е → ɪ)
- [ ] Interactive tongue position diagrams (SVG)
- [ ] Audio pronunciation examples
- [ ] Spaced repetition for vocabulary

### LEARN Module 🔮
- [ ] Mobile-friendly Grayson lessons
- [ ] Lesson navigation UI
- [ ] Progress tracking (localStorage)
- [ ] "Try it" input fields with real-time transcription

---

## 6. DASHBOARD & METADATA

### Document Controls 💭
- [ ] Metadata entry: title, composer (name/dates), poet (name/dates), opus, publication date
- [ ] Searchable select components for composer/poet lookup
- [ ] Real-time metadata updates to paper header
- [ ] Gloss field with tiret placeholder
- [ ] Font attributes control
- [ ] Paper size changes (Letter/A4) with realtime layout
- [ ] Print and export functions
- [ ] Print-lock feature (@media print + micro-banner)

### Transcription Profiles 💭
- [ ] Old Muscovite (default): ikanye, shshokanye, stage pronunciation [ɨj]
- [ ] Peterburgian: ekanye, modern pronunciation [ij]
- [ ] Choral: ikanye with reduced intensity
- [ ] Regional accent toggles (Moscow/St. Petersburg)
- [ ] Akanye/ikanye/ekanye presets
- [ ] Literary vs. Stage pronunciation modes
- [ ] Щ pronunciation toggle (shshokanye vs. shchokanye)
- [ ] Palatalized n vs. nasal palatal notation toggle (ɲ/nʲ)

### Composer-Specific Settings 🔮
- [ ] "Performance Edition" layer
- [ ] Composer-specific textual choices (deletions, repetitions, substitutions)
- [ ] JSON profiles for each composer/work
- [ ] Text modifications database

### Dictionary Expansion 💭
- [ ] Expand composer table: 25→500 entries
- [ ] Expand poet table: 35→500 entries
- [ ] Singer's Supplement dictionary with glosses
- [ ] Taruskin "On Russian Music" for anglicized spellings
- [ ] Exception dictionaries for borrowed words
- [ ] Appendix F lexicon integration

---

## 7. INTERACTION & EDITING

### Interaction Modes 💭
- [ ] Quick-mark lasso mode (batch selection)
- [ ] Keyboard shortcuts (Space to commit+advance, Shift+arrows)
- [ ] Developer mode (triple-click activation)
- [ ] Undo ring-buffer (50 ops, survives reload)
- [ ] Prev/next carousel in batch mode

### Warnings & Validation 💭
- [ ] Orphan clitic warnings (isolated proclitics/enclitics)
- [ ] Provisional stress visual indicators
- [ ] Confidence thresholds for dictionary matches

---

## 8. ALTERNATIVE RULE ENGINES (v2.0+)

### Multi-Schema Support 🔮
- [ ] Challis transcription system
- [ ] Belov transcription system
- [ ] Piatak & Avrashov transcription system
- [ ] Cox, Griffiths, Montgomery, Olin, Richter systems
- [ ] Walters/Sheil system
- [ ] Swappable rule engine architecture
- [ ] "Authority Compare" feature (side-by-side Grayson vs. Authority-X)

### Corpus Engine 🔮
- [ ] TSV corpora per authority in `/data/corpora/`
- [ ] Auto-diff vs Grayson (JSON delta per authority)
- [ ] Micro-engines for authorities with predictable rule differences
- [ ] Legal shield: store only IPA strings, never prose

---

## 9. ABOUT & DOCUMENTATION

### About Panel 💭
- [ ] Biographical info about Grayson
- [ ] Biographical info about Dann
- [ ] Links to studios and dissertations
- [ ] Feedback mechanism (gratitude/frustration)
- [ ] Analytics beacon
- [ ] Attribution page listing sources & years

### Onboarding 💭
- [ ] First-launch modal (name prompt for PDF attribution)
- [ ] Country selection for copyright calculation
- [ ] First-time tooltips with animated demos
- [ ] Help icon to replay demos

---

## 10. EXPORT & INTEGRATION

### PDF Export ✅
- [x] Canvas-based PDF generation
- [x] IPA/Cyrillic font embedding via html2canvas
- [x] Document metadata in PDF properties

### Export Features 💭
- [ ] Multi-page PDF support
- [ ] Word document export
- [ ] Print stylesheet refinement
- [ ] PDF cataloguing system (if copyright permits)
- [ ] Export learned vocabulary (Wiktionary harvest) as JSON

---

## 11. TECHNICAL ARCHITECTURE

### Code Organization ✅
- [x] External CSS extraction
- [x] Vuizur dictionary JSON extraction
- [x] Exception dictionaries as separate JS files
- [x] Protected suffixes system
- [x] Event delegation for syllable buttons
- [x] Golden master test suite (66 tests passing)

### Planned Refactoring 💭
- [ ] inlineCard.js container stub
- [ ] Full modularization (transcribe.js, engine.js, phonology.js, etc.)
- [ ] Dead code removal audits
- [ ] Build system consideration (currently vanilla JS, no framework)

---

## 12. QUALITY ASSURANCE

### Testing ✅
- [x] Golden test suite (66 test cases)
- [x] Inline regression tests
- [x] Browser automation testing
- [x] Hard refresh protocol for GitHub Pages caching

### Testing 💭
- [ ] Corpus-golden tests (assert MSR-authority-X === published IPA)
- [ ] Systematic testing against complete songs
- [ ] Edge case test expansion

---

## 13. ACCESSIBILITY

### Accessibility 💭
- [ ] Keyboard navigation (arrow keys implemented, expand coverage)
- [ ] Screen reader compatibility review
- [ ] High contrast mode
- [ ] Clear focus indicators (2px sage outline implemented)

---

## 14. BRANDING

### Branding ✅
- [x] Project renamed: MSR → Ilya
- [x] Repository: https://github.com/DannMitton/Ilya
- [x] Live site: https://dannmitton.github.io/Ilya/

### Branding 💭
- [ ] KLUCH branding explored (not finalized due to slang concerns)
- [ ] Logo design
- [ ] Favicon

---

## 15. MISCELLANEOUS IDEAS

### From Various Sessions 💭
- [ ] Pre-revolutionary orthography normalization (ѣ→е, і→и, ѵ→и, ѳ→ф)
- [ ] Proper noun exception handling (frozen reduction)
- [ ] Secondary stress marking for compound words
- [ ] Syllable-level audio playback
- [ ] Community contribution system for dictionary expansion
- [ ] Version history/changelog visible to users
- [ ] Offline mode (PWA consideration)

---

## PRIORITY TIERS (Dann's Expressed Preferences)

### Tier 1: Core Release Requirements
- Complete Grayson operationalization (all chapters)
- Stable, beautiful interface
- Educational "Why" explanations
- PDF export working reliably

### Tier 2: Near-Term Enhancements
- Dashboard with metadata entry
- Transcription profile toggles
- Skins/theming
- About panel

### Tier 3: Future Expansion (v2.0+)
- Alternative rule engines (Belov, Challis, etc.)
- LEARN module with lessons
- Authority Compare feature
- Composer-specific editions

---

## NOTES

1. **Grayson Authority**: All transcription decisions must trace to Grayson's dissertation. General Russian phonetics knowledge is explicitly forbidden as a source.

2. **Regional Features**: Moscow/St. Petersburg variations are core Grayson content, not optional enhancements — required for claiming MSR operationalizes Grayson completely.

3. **Release Philosophy**: "Stable, beautiful, well-received by the niche community" — no artificial deadlines, quality over speed.

4. **Collaboration**: Kimi (UX/Design Lead) provides architectural guidance; Claude serves as Project Manager and implementer.

5. **AuDHD Accommodations**: One change per cycle, explicit approval before proceeding, clear handoffs between sessions.

---

*This document captures every feature idea from project inception through January 28, 2026. Items may be promoted, demoted, or removed as development priorities evolve.*
