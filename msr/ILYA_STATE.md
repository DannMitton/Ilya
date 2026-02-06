# Ilya -- Project State

**Version:** 6.0.86 | **Live:** https://dannmitton.github.io/Ilya/ | **Repo:** https://github.com/DannMitton/Ilya

---

## What Ilya Is

Russian-to-IPA transcription tool for classical singers, operationalizing Dr. Craig Grayson's dissertation (2012, University of Washington). Built by Dann Mitton. Single-file app (`index.html`) with externally loaded dictionary tiers and data files. 1.29M-word dictionary (tiered loading). Grayson is the sole phonological authority.

**Design thesis:** Paper is product. Drawer is workbench. No floating popups.
**Aesthetic:** Calm Authority -- scholarly credibility with warm accessibility.

---

## What's Done

Phases 0--6, Phase A, Phase B, Phase B-fix, Phase B-bugs, and Phase C complete. The app is functional for desktop: transcription, educational blurbs (136 bilingual EN/FR entries), stress override, syllable dragging, clitics, phrase boundaries, EN/FR glosses, bilingual gloss pipeline, keyboard navigation, first-run name collection.

**v6.0.54 (Phase A complete):** Full bilingual arc. `UI_LABELS` map and `setUILanguage()` i18n skin system. 42 `data-i18n` attributes. Breath animation (Kimi spec: 150ms out, 250ms in). Paper chrome i18n.

**Phase B (Regression Testing):** 84 test cases executed across 8 categories. Results: 55 pass, 10 fail, 9 issues, 10 blocked (mobile). Bugs and UX refinements catalogued.

**v6.0.66 (Phase B-fix complete):** All five Kimi-approved UX refinements resolved (3 implemented, 1 skipped/superseded, 1 simplified).

**v6.0.78 (Phase B-bugs complete):** All desktop bugs from regression testing resolved. Mobile deferred to post-Phase C.

**v6.0.86 (Phase C complete):** Audit Arc. Reduced codebase from 16,238 to 11,287 lines. Eight tasks:

| Task | Version | Lines Saved |
|------|---------|-------------|
| C.1: Console statements | 6.0.79 | 84 |
| C.2: Golden Tests to `tests.html` | 6.0.80 | 170 |
| C.3: Blank lines + banners | 6.0.81 | 607 |
| C.4: SINGER_SUPPLEMENT to JSON | 6.0.82 | (merged with C.5) |
| C.5: RuleRegistry to JSON | 6.0.83 | 1,322 |
| C.6: CSS audit | 6.0.84 | 621 |
| C.7: Dead JS (Popup removal) | 6.0.85 | 1,670 |
| C.8: CSS dead classes | 6.0.86 | 477 |

---

## Current Focus: Phase D -- Structural Consolidation

### Goal
Reorganize the codebase for logical clarity and open-source contributor legibility. This is not about reaching a line count target. The remaining code is all live. The goal is that a contributor encountering the codebase for the first time can understand where things live and why.

### Planning Process
Phase D was planned through a Kimi consultation (two rounds of briefs). Claude proposed modifications to Kimi's recommendations. Key agreements:

- **PaperManager merge** instead of keeping DocumentController and Paginator separate
- **DrawerController split** into PaperRenderer + InputManager
- **DashboardController dissolution** into neighbours (not split into two new objects)
- **commitChange() helper** instead of observer pattern (explicit over implicit)
- **Two-stage DrawerState decomposition:** extract RibbonRenderer first, then internal reorganization with documented sections (not a three-way object split)
- **CSS variable audit** for remaining cleanup

### Task Summary

| Task | Estimated Savings | Primary Value |
|------|-------------------|---------------|
| D.1: DocumentController + Paginator to PaperManager | ~250 | Clear paper ownership |
| D.2: DrawerController to PaperRenderer + InputManager | ~200 | Rendering/input separation |
| D.3: DashboardController dissolution | ~100 | Pieces where contributors expect them |
| D.4: commitChange() helper on DocumentState | ~30 | Eliminate render trigger duplication |
| D.5: RibbonRenderer extraction from DrawerState | ~420 | Standalone rendering utility |
| D.6: DrawerState internal reorganization | ~100 | Documented sections, duplicates removed |
| D.7: CSS variable audit | ~120 | Cleaner stylesheet |
| **Total** | **~1,220** | |

**Projected result:** ~10,067 lines, well-organized.

---

## Stress Provenance Indicators (Post-Phase D Feature)

### Agreed Design
Tiny black silhouetted SVG icons in the upper-right corner of word stacks, showing where stress came from. Three categories:

| Provenance | Icon | Meaning |
|------------|------|---------|
| Dictionary | Open book silhouette | Ilya looked this up (includes Singer's Supplement) |
| Composer | Eighth note silhouette | Stress adjusted for the musical setting |
| User override | Genderless torso silhouette | User changed this manually |

**Categories not marked:**
- ё-restoration: the letter ё is its own indicator
- Unverified: already handled by the dashed verification box
- Singer's Supplement: merged into Dictionary (implementation detail, not user-facing)

### Specifications (Kimi-designed, Claude-modified)
- **Size:** 0.5em (7-8px at typical text sizes)
- **Colour:** Pure black `#000`, no gray
- **Fill:** Solid silhouettes, minimal interior detail (book gets one page line, note is unified shape, torso is pure silhouette)
- **Placement:** `position: absolute; top: 0.2em; right: 0.2em` inside word stack
- **Reserved space:** No (add ghost spacing only if jitter is distracting in practice)
- **Dashed box interaction:** Both appear simultaneously (ship and observe)
- **SVG:** Inline, 16x16 viewBox, 1px rounded corners, optically balanced (narrower torso, taller note)
- **Legend:** Full words beside icons in footer (Dictionary, Composer, User / Dictionnaire, Compositeur, Utilisateur). Contextual: only categories present on that page appear. Same format on every page, no abbreviations.
- **Print:** Pure black survives B/W. No colour dependence.

### Implementation Sequence
Threaded through Phase D milestones, off the critical path:
1. After D.1 (PaperManager): implement icon SVGs and basic positioning
2. After D.2 (PaperRenderer): wire provenance data through to rendering
3. After D.5 (RibbonRenderer): add contextual legend logic
4. Final polish: print testing

---

## File Structure (v6.0.86)

| File | Purpose |
|------|---------|
| `index.html` | The entire application (~11,287 lines) |
| `tests.html` | Golden master test suite |
| `data/singer-supplement.json` | High-frequency vocabulary stress data |
| `data/rule-registry.json` | 136 bilingual educational blurbs |

---

## File Anatomy (v6.0.86 -- 11,287 lines)

| Section | Lines | Range | Notes |
|---------|-------|-------|-------|
| CSS | 3,274 | 20-3293 | 1 print block, 1 768px block, ~60 custom properties |
| HTML | 353 | 3295-3647 | |
| JS total | 7,638 | 3647-11284 | |

### JavaScript Object Map

| Object | Lines | Range | Role |
|--------|-------|-------|------|
| UI_LABELS + setUILanguage | ~160 | 3648-3886 | Bilingual i18n: 45 keys |
| Standalone functions | ~250 | 3887-4491 | Gloss pipeline, stress marks, dictionary loading |
| TRANSCRIPTION_PROFILES | 41 | 4492-4532 | Predefined transcription settings |
| TabController | 50 | 4533-4582 | Tab switching in drawer |
| SearchableSelect | 148 | 4583-4730 | Dropdown with search |
| ProfileController | 59 | 4731-4789 | Transcription profile management |
| DocumentController | 124 | 4790-4913 | Paper size, char counter, page count |
| Paginator | 268 | 4914-5181 | Overflow detection, page splitting |
| DashboardController | 191 | 5182-5372 | Welcome flow, metadata, PDF export |
| DrawerController | 772 | 5373-6144 | transcribe(), renderToPaper(), createPageElement(), OCR |
| COMPOSERS / POETS | 70 | 6145-6214 | Lookup tables for metadata autofill |
| GraysonEngine | 2,034 | 6215-8248 | Phonological core. UNTOUCHABLE. |
| OCRModule | 300 | 8249-8548 | Image-to-text |
| RuleRegistry | 389 | 8549-8937 | Blurb loading, lookup, display log building |
| IpaTokenizer | 114 | 8938-9051 | Tokenizes IPA for ribbon display |
| BoundaryStack | 120 | 9052-9171 | Custom syllable boundary offsets |
| DocumentState | 33 | 9172-9204 | Data store: lines[], userName, metadata |
| DrawerState | 2,079 | 9205-11283 | Inspector UI, renderRibbon, all controls, drag, animations |

---

## Key Technical Notes

### Two Render Paths (Core Architectural Tension)
**Paper rendering** (what goes on simulated pages):
- `DrawerController.renderToPaper()` builds page DOM
- `DrawerController.createPageElement()` builds individual pages
- `DrawerController.renderVerseLine()` builds word stacks
- `Paginator` handles overflow detection and page splitting
- `DocumentController` manages paper size and page count

**Inspector rendering** (what goes in the drawer when inspecting a word):
- `DrawerState.updateInspector()` populates all inspector fields
- `DrawerState.renderRibbon()` builds the phoneme ribbon (370 lines)
- `DrawerState.populateControls()` sets up stress/ё/assimilation/boundary controls
- `DrawerState._setupDragHandlers()` enables syllable boundary dragging

**The overlap:** Both paths update when the user makes changes. DrawerState calls `DrawerController.renderToPaper()` after most changes (14 call sites). Phase D addresses this with the commitChange() helper and the PaperRenderer/InputManager split.

### Cross-Reference Map
- DrawerState calls `DrawerController.renderToPaper()` at 7 sites
- DrawerController calls `DrawerState.open()`, `.close()`, `.switchMode()` in event delegation
- DrawerController accesses `DocumentState.lines` extensively during transcription
- DrawerController calls `DocumentController.getSize()`, `.updatePageCount()`
- DrawerController calls `Paginator.paginateContent()` during renderToPaper()
- Event delegation (lines ~10920-11060) routes clicks/keys to DrawerState

### Clitic Transcription Logic
- Vowelless clitics (в, к, с, б, ль): Early return with canonical IPA at line ~9283
- Vowel-bearing clitics (же, ли, бы, то, ка, таки): Normal transcription path
- Condition: `cliticInfo && isClitic && !procliticPosition && this.countVowels(cleanWord) === 0`

### Ё Guard Architecture
Syllable buttons are never disabled. Two guards prevent stress reassignment in ё words:
- `DrawerState.updateStress()`: checks `hasYo`, shows lock message, returns early
- `DrawerController.handleStressChange()`: checks `hasYo`, shows lock message, returns early

### Gloss Utility Pipeline (Not Duplicates)
These serve distinct pipeline stages:
- `extractGloss()`: resolves bilingual `{en, fr}` objects (9 references)
- `extractCleanGloss()`: strips verbose dictionary patterns (5 references)
- `truncateGloss()`: enforces word/character limits for paper display (3 references)
- `formatGlossForDisplay()`: orchestrates the above for paper rendering (3 references)

### Action Button Layout
Three equal square tiles with `flex: 1`, `aspect-ratio: 1`, `border-radius: 12px`:
- New Text (btn-secondary) | Export PDF (btn-export, sage green) | Transcribe (btn-primary)

---

## Bilingual Architecture

### i18n Skin System
- `UI_LABELS`: Flat map of 45 keys, each `{en, fr}`. Top-level scope.
- `setUILanguage(lang)`: Iterates all `[data-i18n]` elements, swaps `textContent`, `placeholder`, or `innerHTML`.
- 42 HTML elements tagged with `data-i18n`.

### Gloss Pipeline
- `extractGloss(g)`: Resolves `{en, fr}` objects via `currentGlossLanguage`.
- `extractBlurbText(blurbData)`: Resolves bilingual blurb, wraps IPA in `nowrap` spans.
- `CURATED_GLOSSES`: ~80 bilingual glosses for function words.
- 136 bilingual educational blurbs in `data/rule-registry.json`.
- Custom glosses stored as `{en, fr}` objects (same text both languages).

### Language Switch Flow
1. User clicks pill, `currentGlossLanguage` updates
2. All pills sync (Root + Drill)
3. Breath animation: 150ms fade-out, text swap, 250ms settle
4. `setUILanguage()` + `renderToPaper()` (always, including empty pages) + inspector refresh
5. Cleanup: animation classes removed
6. Confirm dialogs use `currentGlossLanguage` for bilingual messages

---

## Animation Timing

| Duration | Use |
|----------|-----|
| 150ms | Fast micro-interactions, breath-out |
| 250ms | Word-to-word morph, breath-in |
| 300ms | Drawer open/close, pill indicator |
| 350ms | Stately expansions |
| 400ms | Soft content fades |
| 900ms | Stress source slide-in (overshoot spring) |

Easing: `cubic-bezier(0.25, 0.1, 0.25, 1.0)` (default)
Stress source spring: `cubic-bezier(0.22, 1.2, 0.36, 1.0)` (overshoot settle)

---

## Deferred Items

| ID | Item | Reason |
|----|------|--------|
| 7.A | Mobile layout broken on iPhone 14 | Deferred to post-Phase D; requires dedicated mobile pass and Kimi consultation |
| -- | Startup pacifier (loading gate UI) | Planned but not yet built; needed for user experience during dictionary/JSON loading |
| -- | Blurb contextual rewrite | Many blurbs explain phonemes in isolation without addressing what user sees in context. Dann authors all replacement text. Also resolves 3 duplicate-key entries and soft-н synonymy issue. |
| -- | Additional phonological engine bugs | Flagged during Phase B regression testing, catalogued but deferred |

---

## Kimi Consultation Summary

### Phase B Consultation
**Accepted:** Counter visibility + min-width, gloss persistent dashed underline, stress source proximity grouping, Clear renamed to "New Text."
**Dann's modifications:** Pulsating arrow, deliberate attribution, small-caps rubric, overshoot slide-in, gradient dashes, square tile action buttons.
**Kimi's addition:** `aria-live="polite"` on stress source row.

### Phase C Consultation (Two Rounds)
**Round 1:** Kimi received full architectural brief. Provided CSS consolidation, renderRibbon extraction strategy (Hybrid B/C), Phase D preview.
**Round 2:** Claude corrected four errors (XHR claim, invented sanitizeGloss, popup class names, CSS variable bloat). Kimi recalibrated.

### Phase D Consultation (Two Rounds)
**Round 1:** Kimi proposed six priorities: PaperManager merge, DrawerController split, DashboardController split, observer pattern, three-way DrawerState split, CSS consolidation.
**Claude's modifications (all accepted by Kimi):** DashboardController dissolution instead of split, commitChange() helper instead of observer pattern, two-stage DrawerState (RibbonRenderer extraction + internal reorganization) instead of three-way split, centralized event delegation instead of scattered listeners.

### Provenance Indicator Consultation
**Kimi proposed:** Classical footnote sigla (*, †, ‡, §, ‖) with abbreviated legend labels.
**Dann's refinement:** Bespoke silhouetted SVG icons (book, eighth note, torso). Three categories instead of five. Full-word legend labels instead of abbreviations.
**Kimi's accepted specifications:** 0.5em sizing, pure black fill, minimal interior detail, 16x16 viewBox, optical balancing, 0.2em offset positioning, contextual legend, dashed box coexistence.

---

## Working Rules

- **One change per cycle.** Propose, "Proceed?", wait for "yes."
- **Never edit Dann's authored content.** He provides replacement text.
- **Every delivery:** repo link, live link, commit message, test text, test steps.
- **Canadian spelling, Oxford comma, no em dashes.**
- **Quality over speed.** Verify before delivering.
- **Test text:** Не пой красавица при мне

---

## Collaboration

- **Claude:** Project manager, code implementation
- **Kimi:** UX/Design lead, architecture specs (no persistent memory -- provide full context)
- **Dann:** Decision-maker, scholarly content, Grayson authority
