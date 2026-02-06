# Phase D: Structural Consolidation -- Task Sequence

**Version:** 6.0.86 → target ~6.0.93
**Starting lines:** 11,287
**Goal:** Logical organization for open-source contributor legibility. No line count target.

---

## Guiding Principles

- One change per cycle. Propose, approve, implement.
- No functionality changes. No UI behaviour changes.
- GraysonEngine (2,034 lines) is untouchable.
- Dann's authored content is never edited by us.
- Every delivery includes: repo link, live link, commit message, test text, test steps.
- Quality over speed. Verify before delivering.
- The single-file architecture stays. No splitting `index.html` into multiple JS files.
- Animation timings are locked (see ILYA_STATE.md timing table).
- Event delegation stays centralized at the bottom of the file.

---

## Task Sequence

### D.1: Merge DocumentController + Paginator → PaperManager
**Version:** 6.0.87
**Estimated savings:** ~250 lines
**Risk:** Low

**Current state:**
- `DocumentController` (124 lines, 4790-4913): paper size, char counter, page count
- `Paginator` (268 lines, 4914-5181): overflow detection, page splitting

**The merge:**
Create a single `PaperManager` object that owns all paper-related concerns:
- Paper sizes and current size (`setSize()`, `getSize()`)
- Character counter (`updateCharCounter()`)
- Page count calculation and display (`calculatePageCount()`, `updatePageCount()`)
- Content pagination (`paginateContent()`, overflow measurement, page splitting)

**Implementation steps:**
1. Create `const PaperManager = { ... }` combining both objects
2. Move all DocumentController methods into PaperManager
3. Move all Paginator methods into PaperManager
4. Update all external references:
   - `DocumentController.getSize()` → `PaperManager.getSize()` (2 call sites)
   - `DocumentController.updatePageCount()` → `PaperManager.updatePageCount()` (2 call sites)
   - `DocumentController.init()` → `PaperManager.init()` (1 call site)
   - `Paginator.paginateContent()` → `PaperManager.paginateContent()` (call sites in DrawerController)
5. Remove both original object declarations
6. Update init sequence at bottom of file

**Savings source:** Eliminated duplicate init boilerplate, shared size/page state variables, removed cross-object communication overhead.

---

### D.2: Split DrawerController → PaperRenderer + InputManager
**Version:** 6.0.88
**Estimated savings:** ~200 lines
**Risk:** Medium

**Current state:** `DrawerController` (772 lines, 5373-6144) handles four unrelated jobs:
- Transcription orchestration (`transcribe()`, `transcribeAllLines()`)
- Paper DOM building (`renderToPaper()`, `createPageElement()`, `renderVerseLine()`)
- OCR coordination (`initOCR()`, `processOCRFile()`, `showOCRStatus()`, `hideOCRStatus()`)
- New Text/Clear flow (`clear()`)

**The split:**

`PaperRenderer`: owns paper DOM construction
- `render(lines, metadata)` (renamed from `renderToPaper()`)
- `createPageElement(pageNum, totalPages)`
- `renderVerseLine(transcribedWords)`
- Internal helpers for word stack building, data attribute assignment

`InputManager`: owns text input, transcription orchestration, and OCR
- `transcribe(rawText)` (calls GraysonEngine, stores in DocumentState)
- `transcribeAllLines()`
- `clear()` / `loadNewText()`
- `updateCharCounter()`
- OCR methods (delegates to OCRModule)
- `refreshDisplay()` (delegates to `PaperRenderer.render()`)

**Critical detail:** The 14 `DrawerController.renderToPaper()` call sites in DrawerState become `PaperRenderer.render()`. Update all of them.

**Event delegation stays at the bottom of the file.** Do not move paper-click handling into PaperRenderer. The centralized delegation block is the "wiring diagram" contributors need.

**Savings source:** Cleaner separation eliminates bridging code, redundant state checks, and shared variable overhead.

---

### D.3: Dissolve DashboardController
**Version:** 6.0.89
**Estimated savings:** ~100 lines
**Risk:** Low

**Current state:** `DashboardController` (191 lines, 5182-5372) handles:
- Welcome flow (~60 lines): first-visit name collection
- Metadata entry (~80 lines): composer, title, opus, poet form handling
- PDF export (~15 lines): `window.print()` wrapper with prep

**The dissolution:**
- **Welcome flow** folds into app initialization at the bottom of the file. It runs once, at startup. It belongs with other initialization logic.
- **Metadata form handling** folds into the drawer's Root mode logic (already conceptually part of the Root mode UI).
- **PDF export** becomes a standalone utility function: `function exportPDF() { ... }`.

**Do not create new objects.** The pieces go where a contributor would intuitively look for them. The DashboardController object declaration is removed entirely.

**Update references:** `DashboardController.init()` call in init sequence. Any `DashboardController.*` references throughout the file.

---

### D.4: Add commitChange() Helper to DocumentState
**Version:** 6.0.90
**Estimated savings:** ~30 lines
**Risk:** Low

**Current state:** 14 sites in DrawerState follow this pattern:
```javascript
DocumentState.updateStress(lineIdx, wordIdx, newStress);
DrawerController.renderToPaper();  // or PaperRenderer.render() after D.2
```

**The helper:**
```javascript
const DocumentState = {
  // ... existing properties ...
  
  commitChange(type, lineIdx, wordIdx, payload) {
    switch (type) {
      case 'stress':
        this.updateStress(lineIdx, wordIdx, payload);
        break;
      case 'gloss':
        this.updateGloss(lineIdx, wordIdx, payload);
        break;
      case 'stressSource':
        this.updateStressSource(lineIdx, wordIdx, payload);
        break;
    }
    PaperRenderer.render();
  },
  
  // ... existing methods ...
};
```

**Update all 14 call sites** from two lines to one:
```javascript
// Before:
DocumentState.updateStress(lineIdx, wordIdx, newStress);
PaperRenderer.render();

// After:
DocumentState.commitChange('stress', lineIdx, wordIdx, newStress);
```

**Why not an observer pattern:** The object graph is known and stable. Explicit calls are transparent. A contributor can grep for `commitChange` and see every trigger. Observer infrastructure would consume its own savings and hide the data flow behind indirection.

---

### D.5: Extract RibbonRenderer from DrawerState
**Version:** 6.0.91
**Estimated savings:** ~420 lines
**Risk:** Low

**Current state:** `renderRibbon()` (370 lines, starting ~9495) and `_recalculateSyllableIndices()` (52 lines, starting ~9862) live inside DrawerState. They were extracted from the dead Popup object in C.7.

**The extraction:**
Create a standalone `const RibbonRenderer = { ... }` utility object containing:
- `renderRibbon(wordData, targetContainer)`: builds phoneme ribbon HTML
- `recalculateSyllableIndices(displayLog, originalSyllables, displaySyllables)`: adjusts indices for custom boundaries

**Why this is safe:** Both methods are already functionally independent. They take their data as parameters. `renderRibbon` uses `this` only for the fallback container reference (`this.inspectorElements.ribbon`), which is already passed as the `targetContainer` parameter at both call sites. The `this` dependency is vestigial.

**Update DrawerState call sites:**
- `this.renderRibbon(...)` → `RibbonRenderer.renderRibbon(...)`
- `this._recalculateSyllableIndices(...)` → `RibbonRenderer.recalculateSyllableIndices(...)`

**Savings source:** 420 lines moved out of DrawerState into a clean, focused utility. DrawerState drops from 2,079 to ~1,659 lines.

---

### D.6: DrawerState Internal Reorganization
**Version:** 6.0.92
**Estimated savings:** ~100 lines
**Risk:** Low

**Current state (post-D.5):** DrawerState at ~1,659 lines with methods in roughly chronological order of implementation rather than logical grouping.

**The reorganization:**
Add a documented method index at the top of DrawerState, then reorder methods into logical groups:

```javascript
const DrawerState = {
  // ═══════════════════════════════════════════
  // METHOD INDEX
  // ═══════════════════════════════════════════
  // DRAWER MECHANICS: init, isOpen, mode, open, close, switchMode
  // INSPECTOR POPULATION: updateInspector, populateControls, _extractPhonemeList
  // WORD MORPHING: _morphToNewWord, _highlightChangedPhonemes
  // STRESS CONTROLS: handleStressChange, handleStressSourceSelect, showAttributionArrow, hideAttributionArrow
  // Ё CONTROLS: handleVariantToggle, stageVariantToggle, cancelVariantToggle, applyVariantToggle, showYoLockMessage, hideYoLockMessage, showYoToast, hideYoToast, undoYoToggle
  // BOUNDARY CONTROLS: handleAssimilationToggle, _setupDragHandlers, _attemptConsonantShed, _animateConsonantGhost, _flashInvalid, _cleanupGhost, _updateSyllableDisplay, _updateCustomizedState, _pulseAllConsonants
  // REFRESH: refreshAfterChange
  // NAVIGATION: _focusFirstElement, keyboard handlers
  // SETUP: _setupSwipeToDismiss, _setupViewportListener
  
  // ... methods grouped accordingly ...
};
```

**During reorganization, also:**
- Remove duplicate null checks (audit for patterns like `if (!this.currentWord) return` that appear in multiple adjacent methods)
- Consolidate redundant guard clauses
- Remove stale comments referencing Popup-era code

**Do not change any method signatures or `this` bindings.** This is purely organizational.

---

### D.7: CSS Variable Audit
**Version:** 6.0.93
**Estimated savings:** ~120 lines
**Risk:** Low

**Scope:** Audit the ~60 CSS custom properties in `:root` for actual usage. Remove any that are defined but never referenced, or referenced only once (inline the value). Look for verbose selector chains that can be simplified without changing specificity.

**Approach:**
1. List all `--variable-name` declarations in `:root`
2. For each, grep for `var(--variable-name)` usage
3. Remove unused variables
4. Inline single-use variables
5. Verify no visual changes

---

## Phase D Summary

| Task | Version | Estimated Savings | Risk |
|------|---------|-------------------|------|
| D.1: PaperManager merge | 6.0.87 | ~250 | Low |
| D.2: PaperRenderer + InputManager | 6.0.88 | ~200 | Medium |
| D.3: DashboardController dissolution | 6.0.89 | ~100 | Low |
| D.4: commitChange() helper | 6.0.90 | ~30 | Low |
| D.5: RibbonRenderer extraction | 6.0.91 | ~420 | Low |
| D.6: DrawerState reorganization | 6.0.92 | ~100 | Low |
| D.7: CSS variable audit | 6.0.93 | ~120 | Low |
| **Total** | | **~1,220** | |

**Projected result:** ~10,067 lines, logically organized for contributors.

---

## Stress Provenance Indicators (Interleaved)

The provenance icon feature is threaded through Phase D, off the critical path:

| After Task | Provenance Step |
|------------|-----------------|
| D.1 | Implement icon SVGs and basic CSS positioning |
| D.2 | Wire provenance data through PaperRenderer |
| D.5 | Add contextual legend logic to page footer |
| Final | Print testing and polish |

See ILYA_STATE.md for full provenance specifications.

---

## Test Protocol

**Test text:** Не пой красавица при мне
**After every commit, verify:**
1. Transcription produces correct IPA
2. Drawer inspector opens, shows phoneme ribbon, blurbs expand
3. Stress override works (syllable buttons, source attribution)
4. Ё/Е toggle works with undo
5. Language switch (EN/FR) animates and updates all UI
6. PDF export produces correct output
7. Clitic handling displays correctly
8. No console errors in browser DevTools
