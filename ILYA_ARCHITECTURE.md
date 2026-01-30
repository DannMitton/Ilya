# Ilya Architecture Guide

**Last Updated:** 2026-01-30  
**File:** `index.html` (~10,057 lines)

---

## File Structure

The entire application lives in a single HTML file with embedded CSS and JavaScript. This simplifies deployment (just copy the file) but requires careful navigation.

```
index.html
├── <style> (lines 1-2800)
│   ├── CSS Variables & Theme (1-100)
│   ├── Layout & Components (100-1500)
│   ├── Popup/Ribbon Styles (1500-1850)
│   ├── Print Styles (2650-2800)
│   └── Media Queries (scattered)
│
├── <body> (lines 2800-3400)
│   ├── Paper Stack Container
│   ├── Input Drawer
│   ├── Word Detail Popup
│   └── Toast Container
│
└── <script> (lines 3400-10057)
    ├── Dictionary Loading (3175-3220)
    ├── Utility Functions (3400-3700)
    ├── Document State & Controllers (4050-4950)
    ├── GraysonEngine (5150-6800)
    ├── BlurbLibrary (7100-7700)
    ├── PopupController (8000-9800)
    └── Initialization (9900-10057)
```

---

## Core Objects

### DocumentState (line ~4050)

Global state container for the current document.

```javascript
const DocumentState = {
  title: '',
  composer: '',
  composerDates: '',
  opus: '',
  poet: '',
  poetDates: '',
  lines: [],           // Array of arrays of word objects
  currentPage: 1,
  totalPages: 1
};
```

**Word object structure:**
```javascript
{
  cyrillic: 'слово',           // Original input
  stress: 0,                    // Syllable index (0-based)
  stressSource: 'dictionary',   // dictionary | yo-rule | yo-restored | user
  gloss: 'word',
  pos: 'noun',
  lemma: 'слово',
  hasYo: false,
  originalInput: null,          // If ё was restored
  dictionaryForm: null,         // What Ilya found
  yoSource: null,               // yo-restored | user-yo-edit | null
  rightBoundary: 'soft',        // soft | hard | clitic
  boundarySource: 'auto'        // auto | punctuation | user
}
```

---

### DrawerController (line ~4200)

Manages the input drawer and orchestrates transcription.

**Key methods:**

| Method | Purpose |
|--------|---------|
| `init()` | Set up event listeners, load dictionary |
| `transcribe()` | Parse input, run GraysonEngine, render |
| `renderToPaper()` | Generate paginated HTML output |
| `transcribeAllLines()` | Phase 1-2.6 transcription pipeline |
| `buildVerseLine()` | Create word stack HTML |
| `createPageElement()` | Generate single page with header/footer |

**Transcription pipeline (inside `transcribeAllLines()`):**

```
Phase 1: Parse words, lookup stress, detect clitics
Phase 2: Apply cross-word assimilation (GraysonEngine)
Phase 2.5: Sync syllable IPA with surface forms
Phase 2.6: Clitic IPA fusion (arrows + concatenation)
```

---

### GraysonEngine (line ~5150)

The core transcription engine implementing Grayson's rules.

**Key data structures:**

```javascript
GraysonEngine = {
  cliticData: Map,              // Clitic definitions with glosses
  proclitics: Set,              // Derived from cliticData
  enclitics: Set,               // Derived from cliticData
  voicedToVoiceless: Object,    // Devoicing map
  voicelessToVoiced: Object,    // Voicing map
  regressivePalatalizationBlockers: Set,
  specialClusters: Map,         // Cluster-specific transcriptions
  // ... more
};
```

**Key methods:**

| Method | Line | Purpose |
|--------|------|---------|
| `lookupStress(word)` | ~5500 | Dictionary lookup with ё-restoration |
| `transcribe(word, stress, isClitic, position)` | ~6170 | Full IPA transcription |
| `syllabify(word)` | ~5750 | Split word into syllables |
| `autoDetectBoundaries(words)` | ~6570 | Set soft/hard/clitic boundaries |
| `applyCrossWordAssimilation(words)` | ~6745 | Voicing assimilation across words |
| `applyFinalDevoicing(ipa)` | ~6156 | Devoice final obstruents |
| `applyRegressiveVoicing(ipa)` | ~6100 | Within-word voicing assimilation |

**Transcription flow:**

```
transcribe(word, stress)
  → syllabify(word)
  → For each syllable:
      → Determine position (stressed/pretonic/remote)
      → Transcribe consonants (with palatalization)
      → Transcribe vowels (with reduction rules)
  → applyRegressiveVoicing(ipa)
  → Return { ipa, ipaUnderlying, syllables, transcriptionLog }
```

---

### PopupController (line ~8000)

Manages the word detail popup with ribbon, stress controls, and boundary settings.

**Key methods:**

| Method | Purpose |
|--------|---------|
| `open(wordStack)` | Initialize popup for clicked word |
| `close()` | Hide popup, apply staged changes |
| `renderRibbon(wordData)` | Build phoneme-by-phoneme breakdown |
| `handleStressChange(newIndex)` | Stage stress change |
| `handleBoundaryChange(boundary)` | Stage boundary change |
| `handleYoToggle()` | Toggle ё↔е |
| `applyChanges()` | Commit staged changes to DocumentState |

**Popup structure:**

```
┌─────────────────────────────────┐
│ Syllable Display (clickable)    │
├─────────────────────────────────┤
│ Phoneme Ribbon (vertical list)  │
│   - Each row: Cyr › IPA         │
│   - Expandable blurbs           │
├─────────────────────────────────┤
│ Variant Row (ё↔е toggle)        │
├─────────────────────────────────┤
│ Assimilation Row (boundary)     │
└─────────────────────────────────┘
```

---

### BlurbLibrary (line ~7100)

Educational content for the phoneme ribbon.

**Structure:**
```javascript
BlurbLibrary = {
  blurbs: {
    'ɑ:stressed:а': { blurb: '...', citation: 'pp. 81-85', notable: false },
    'ɑ:pretonic:о': { blurb: '...', citation: 'pp. 108, 127', notable: true },
    // ... ~150 entries
  },
  
  lookup(ipa, rule, char) { /* ... */ },
  getClusterBlurb(cluster, features) { /* ... */ }
};
```

**Key pattern:** `'IPA:rule:char'` for lookup keys

---

## CSS Architecture

### Variables (line ~30)

```css
:root {
  /* Colors */
  --stationery-cream: #f5f2eb;
  --ink-primary: #2a2520;
  --ink-secondary: #4a4540;
  --ilya-accent: #c47a5a;
  
  /* Typography */
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-ipa: 'Doulos SIL', 'Charis SIL', 'Gentium', serif;
  
  /* Spacing */
  --paper-width: 8.5in;
  --paper-height: 11in;
}
```

### Key Classes

| Class | Purpose |
|-------|---------|
| `.paper-stack` | Container for all pages |
| `.paper-page` | Individual page |
| `.verse-line` | Single line of word stacks |
| `.word-stack` | IPA + Cyrillic + Gloss stack |
| `.word-stack.proclitic` | Proclitic styling |
| `.word-stack.enclitic` | Enclitic styling |
| `.phoneme-row` | Single row in ribbon |
| `.page-footer` | Footer with attribution |

### Print Styles (line ~2650)

```css
@media print {
  .paper-page {
    page-break-after: always;
    height: 11in;
    overflow: visible;
  }
  
  .page-footer {
    position: absolute;
    bottom: 0;
    left: 0.75in;
    right: 0.75in;
  }
}
```

---

## Data Flow Diagrams

### Transcription Flow

```
User types text
       ↓
DrawerController.transcribe()
       ↓
Parse into lines → words
       ↓
For each word:
  ├── GraysonEngine.lookupStress()
  │     ├── Check STRESS_DICTIONARY
  │     ├── Try ё-restoration
  │     └── Return stress index + metadata
  │
  └── GraysonEngine.transcribe()
        ├── Syllabify
        ├── Transcribe each syllable
        └── Apply voicing rules
       ↓
GraysonEngine.autoDetectBoundaries()
       ↓
GraysonEngine.applyCrossWordAssimilation()
       ↓
Phase 2.5: Sync syllable data
       ↓
Phase 2.6: Clitic fusion
       ↓
DrawerController.renderToPaper()
       ↓
DOM updated
```

### Popup Interaction Flow

```
User clicks word stack
       ↓
PopupController.open()
       ↓
Extract data from data-* attributes
       ↓
Render syllable display
       ↓
Render phoneme ribbon
       ↓
Render variant row (if ё present)
       ↓
Render assimilation row (if not last word)
       ↓
User interacts (click syllable, toggle, etc.)
       ↓
Stage changes (don't commit yet)
       ↓
User clicks away / closes
       ↓
PopupController.close()
       ↓
Apply staged changes to DocumentState
       ↓
Re-render affected word stack
```

---

## Common Patterns

### Finding Code by Feature

| Feature | Search Term |
|---------|-------------|
| Stress marking | `isStressed` |
| Clitic handling | `isProclitic`, `isEnclitic`, `cliticData` |
| Vowel reduction | `pretonic`, `remote`, `position` |
| Palatalization | `softIndices`, `isInterpalatal` |
| Final devoicing | `applyFinalDevoicing`, `voicedToVoiceless` |
| Cross-word assimilation | `applyCrossWordAssimilation` |
| Syllabification | `syllabify`, `syllableData` |
| Popup ribbon | `renderRibbon`, `phoneme-row` |
| Print layout | `@media print`, `.page-footer` |

### Debugging Tips

1. **Console logging:** GraysonEngine methods log detailed transcription info
2. **Transcription log:** Each word has `transcriptionLog` array with step-by-step breakdown
3. **Data attributes:** Word stacks store all state in `data-*` attributes for inspection

---

## External Dependencies

| Library | Purpose | Loading |
|---------|---------|---------|
| pako | Gzip decompression | Inline (minified) |
| Tesseract.js | OCR | Lazy-loaded from CDN |

**No build process required.** The file is self-contained and runs directly in browser.

---

## Testing Approach

1. **Golden test corpus:** Shostakovich *Станцы* (Pushkin text)
2. **Manual verification:** Compare output against expected IPA
3. **Console inspection:** Check for errors during transcription
4. **Print preview:** Verify pagination matches screen

**Test text:**
```
Станцы

Брожу ли я вдоль улиц шумных,
Вхожу ль во многолюдный храм,
...
```
