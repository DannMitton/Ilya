# Phase C: Audit Arc -- Formalized Task Sequence

**Version:** 6.0.78 → target ~6.0.85
**Starting lines:** 16,238
**Phase C target:** ~10,700--11,000
**Ultimate target:** 9,000 (requires Phase D)

---

## Guiding Principles

- One change per cycle. Propose, approve, implement.
- No functionality changes. No UI behaviour changes.
- GraysonEngine (2,359 lines) is untouchable.
- CURATED_GLOSSES (~208 lines) stays inline.
- Dann's authored content is never edited by us.
- Every delivery includes: repo link, live link, commit message, test text, test steps.
- Quality over speed. Verify before delivering.

---

## Task Sequence

### C.1: Strip Console Statements
**Scope:** Remove all 84 `console.log`, `console.warn`, `console.error` calls.
**Details:**
- Some are single-line, some span multiple lines (template literals with variables)
- Remove only the console calls; preserve surrounding logic
- Verify none are error telemetry (expected: all are debug logs)
**Estimated savings:** ~84 lines
**Risk:** None

---

### C.2: Move Golden Tests to `tests.html`
**Scope:** Extract lines 15959--16131 to a standalone `tests.html` file.
**Details:**
- Create `tests.html` that loads GraysonEngine and runs the test suite
- Tests call `GraysonEngine.transcribe()` directly; no DocumentState/DrawerState mocks needed
- Remove `window.GOLDEN_TESTS` export (line 16131)
- Remove `processWord()`, `normalizeForComparison()`, `runGoldenTests()`, `testWord()` wrapper functions
- Keep test runner UI functional in the new file
- `tests.html` must be committed to the repo
**Estimated savings:** ~170 lines (net of any boilerplate in `tests.html`)
**Risk:** None

---

### C.3: Clean Blank Lines and Decorative Banners
**Scope:** Remove excess whitespace and decorative comment formatting.
**Details:**
- 339 blank lines: reduce to single blank lines between logical sections
- ~186 decorative banner lines (`========`, `--------`, phase markers, decorative `*` rows)
- Remove multi-line decorative comment blocks
- Preserve meaningful single-line section headers (e.g., `// --- VOWELS ---`)
- Preserve JSDoc comments and functional inline comments
**Estimated savings:** ~400--500 lines
**Risk:** None

---

### C.4: Externalize SINGER_SUPPLEMENT to JSON
**Scope:** Move lines 5358--5725 to `data/singer-supplement.json`.
**Details:**
- Current format: JS object with `{ stress, type }` entries keyed by Cyrillic word
- Convert to JSON (keys remain Cyrillic strings)
- Add async loader: `fetch('data/singer-supplement.json')` at startup
- Loader assigns result to `SINGER_SUPPLEMENT` (or equivalent) before transcription is available
- Loading gated by the startup pacifier (already planned)
- Used by `GraysonEngine.lookupStress()` -- must be loaded before any transcription
- JSON file committed to repo, served via GitHub Pages
**Estimated savings:** ~325 lines net (368 removed, ~43 loader code added)
**Risk:** Low. Verify `lookupStress()` works identically after loading.

---

### C.5: Externalize RuleRegistry/Blurbs to JSON
**Scope:** Move lines 10332--12323 to `data/rule-registry.json`.
**Details:**
- 136 bilingual blurb entries with nested `{ en: {...}, fr: {...} }` structure
- Blurbs contain HTML (`<strong>`, `<em>`) -- these are preserved as JSON string values
- Add async loader; blurbs used by `lookupBlurb()` in DrawerState
- Loading gated by the startup pacifier
- `deriveRule()` stays in `index.html` (it's part of the engine logic)
- `buildDisplayLog()` stays in `index.html` (it orchestrates blurb lookups)
- **Fix orphaned entries during externalization:** `deriveRule()` at line 11707 currently returns `'interpalatal'` when stressed + interpalatal. Two blurb entries at lines 10351 and 10371 use key `'stressed-interpalatal'`. Fix `deriveRule()` to return `'stressed-interpalatal'` when both `features.position === 'stressed'` and `features.interpalatal` are true.
- JSON file committed to repo, served via GitHub Pages
**Estimated savings:** ~1,950 lines net (1,992 removed, ~42 loader + `deriveRule`/`buildDisplayLog` residual)
**Risk:** Low-medium. Verify blurb lookup works for all 136 entries after loading. Verify `stressed-interpalatal` fix reaches the two orphaned blurbs.

---

### C.6: CSS Audit (Expanded)
**Scope:** Remove dead CSS, commented-out blocks, and consolidate fragmented media queries.
**Details:**

**A. Dead popup selectors (~115 lines):**
- `.popup-overlay`, `.popup-card`, `.popup-arrow`, `.popup-body`, `.popup-footer-controls`, `.popup-cyrillic` (lines ~2486--2600 and scattered)
- `.popup-body.fading` (line 3741--3745)
- Mobile popup overrides (line 2555 block)
- `--shadow-popup` CSS variable (line 93) and its reference (line 2519)

**B. Commented-out code blocks (~267 lines):**
- `.input-drawer` block (~10 lines, line 2010)
- `.drawer-handle` + children (~90 lines, line 2023)
- `.drawer-content` block (~13 lines, line 2117)
- `.popup-overlay` commented block (~18 lines, line 2489)
- `.popup-card` commented block (~41 lines, line 2511)
- Mobile popup commented block (~34 lines, line 2554)
- `.drawer-zones` + children (~28 lines, line 3839)
- Mobile zones + tabs (~25 lines, line 3869)
- Mobile ribbon scroll disabled (~9 lines, line 3431)
- Smaller scattered blocks (~49 lines, various)

**C. Media query consolidation (~150--200 lines):**
- Consolidate 5 `@media print` blocks (lines 1330, 1415, 1661, 1995, 4343) into a single block
- Merge 3 `@media (max-width: 768px)` blocks (lines 1682, 3386, 3432) into one
- Unify `@media (max-width: 767px)` (line 3870) into the 768px block -- the 1px gap is a mistake
- After consolidation, verify no cascade-order dependencies were broken

**D. Popup HTML comment (1 line):**
- Line 4884: `<!-- Popup removed in Phase 3E - all functionality now in drawer inspector -->`

**Estimated savings:** ~533--583 lines
**Risk:** Low. Print consolidation is zero-risk. 768px merge needs a visual check at 767px, 768px, and 769px viewport widths.

---

### C.7: Remove Dead JS (Revised)
**Scope:** Remove the dead Popup object and related dead functions.
**Details:**

**A. Popup object gutting (~1,574 lines):**
- The Popup object (lines 12364--14360, ~1,996 lines) is mostly dead
- **Extract first:** `renderRibbon()` (~370 lines starting at line 13059) and `_recalculateSyllableIndices()` (~52 lines starting at line 13426). Fold both into DrawerState as internal methods.
- **Then delete:** everything else in the Popup object, including:
  - `init()`, `open()`, `close()`, `positionPopup()` (reference non-existent DOM)
  - `handleYoToggle()` (reimplemented as `DrawerState.handleVariantToggle()`)
  - `refreshPopupContent()` (only called internally)
  - `stageStressSource()`, `stageBoundary()`, `commitAllStaged()`, `revertAllStaged()` (reimplemented in DrawerState)
  - `populateYoToggle()`, `populateAssimilationRow()` (reimplemented in `DrawerState.populateControls()`)
  - `selectAttribution()`, `clearAttributionSelection()`, `generateCitation()` (dead)
  - `updateStressSourceUI()`, `updateBoundaryUI()`, `updateSharedFooterUI()`, `updateAllUI()` (reimplemented in DrawerState)
  - All event handlers in `init()` (wired to non-existent popup DOM)
  - All state properties (`isOpen`, `currentWord`, `stressWasChanged`, `staged`, etc.)
- **Update DrawerState references:** Change `Popup.renderRibbon(...)` calls at lines 14738 and 15504 to `this.renderRibbon(...)` (or equivalent after folding in)
- Remove the `const Popup = { ... };` declaration entirely after extraction

**B. Dead standalone functions (~60 lines):**
- `formatGlossForPopup()` (lines 6051--6110): only caller is dead Popup code at line 13785

**C. Dead developer utility (~150 lines):**
- `analyzeGlossGaps()` (line 5190): console-only developer tool, not used in production
- Its comment header says "Run from console: analyzeGlossGaps()"

**Estimated savings:** ~1,784 lines
**Risk:** Medium. Requires careful extraction of `renderRibbon` before deletion. After extraction, verify:
- Phoneme ribbon renders correctly in the drawer inspector
- Blurb overlays open/close properly
- Syllable boundary adjustments display correctly
- Cluster grouping and keyboard navigation in the ribbon still work

---

## Phase C Summary

| Task | Version | Lines Saved | Cumulative |
|------|---------|-------------|------------|
| C.1: Console statements | 6.0.79 | ~84 | 16,154 |
| C.2: Golden Tests | 6.0.80 | ~170 | 15,984 |
| C.3: Blank lines + banners | 6.0.81 | ~450 | 15,534 |
| C.4: SINGER_SUPPLEMENT | 6.0.82 | ~325 | 15,209 |
| C.5: RuleRegistry | 6.0.83 | ~1,950 | 13,259 |
| C.6: CSS audit | 6.0.84 | ~558 | 12,701 |
| C.7: Dead JS | 6.0.85 | ~1,784 | 10,917 |
| **Total** | | **~5,321** | **~10,917** |

**Post-Phase C file structure:**
- `index.html` (~10,917 lines)
- `tests.html` (Golden master test suite)
- `data/singer-supplement.json` (high-frequency vocabulary stress data)
- `data/rule-registry.json` (136 bilingual educational blurbs)

---

## Post-Phase C: Measurement Gate

After C.7, we measure the actual line count and CSS proportion. If CSS is still >3,500 lines, we pursue additional mechanical CSS reductions (verbose selectors, duplicate properties across media queries) as a C.8 task before moving to Phase D.

---

## Phase D Preview (Future)

Phase D targets the remaining ~1,900 lines to reach 9,000:
- Consolidate DocumentState/DrawerState render logic (~800--1,000 lines of overlap)
- Refactor DocumentController/DrawerController boundary
- Likely requires a Kimi consultation for architecture
- DrawerState internal audit (event handler consolidation, DOM query caching)

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
