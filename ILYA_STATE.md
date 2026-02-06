# Ilya -- Project State

**Version:** 6.0.78 | **Live:** https://dannmitton.github.io/Ilya/ | **Repo:** https://github.com/DannMitton/Ilya

---

## What Ilya Is

Russian-to-IPA transcription tool for classical singers, operationalizing Dr. Craig Grayson's dissertation (2012, University of Washington). Built by Dann Mitton. Single-file app (`index.html`) with externally loaded dictionary tiers. 1.29M-word dictionary (tiered loading). Grayson is the sole phonological authority.

**Design thesis:** Paper is product. Drawer is workbench. No floating popups.
**Aesthetic:** Calm Authority -- scholarly credibility with warm accessibility.

---

## What's Done

Phases 0--6, Phase A, Phase B, Phase B-fix, and Phase B-bugs complete. The app is functional for desktop: transcription, educational blurbs (136 bilingual EN/FR entries), stress override, syllable dragging, clitics, phrase boundaries, EN/FR glosses, bilingual gloss pipeline, keyboard navigation, first-run name collection.

**v6.0.54 (Phase A complete):** Full bilingual arc. `UI_LABELS` map and `setUILanguage()` i18n skin system. 42 `data-i18n` attributes. Breath animation (Kimi spec: 150ms out, 250ms in). Paper chrome i18n.

**Phase B (Regression Testing):** 84 test cases executed across 8 categories. Results: 55 pass, 10 fail, 9 issues, 10 blocked (mobile). Bugs and UX refinements catalogued.

**v6.0.66 (Phase B-fix complete):** All five Kimi-approved UX refinements resolved (3 implemented, 1 skipped/superseded, 1 simplified).

**v6.0.78 (Phase B-bugs complete):** All desktop bugs from regression testing resolved. Mobile deferred to post-Phase C.

---

## Current Focus: Phase C -- Audit Arc

### Goal
Strip the codebase from ~16,238 lines to ~10,917 lines while preserving all functionality and bilingual support. The full task sequence with verified estimates is in `PHASE_C_TASK_SEQUENCE.md`.

### Planning Process
Phase C was planned through a two-round Kimi consultation. Claude audited the codebase line by line, drafted an architectural brief for Kimi, verified her recommendations against the actual code, then sent a follow-up brief with corrections. Key outcomes:

- **Kimi's valuable catches:** ~267 lines of commented-out dead CSS from Phase 2C/3E removals; CSS media query consolidation opportunities (5 print blocks, 3 duplicate 768px blocks, a 767px/768px near-duplicate); Hybrid B/C extraction strategy for renderRibbon
- **Kimi's errors (corrected):** Claimed XHR usage (already uses fetch); invented a `sanitizeGloss()` function; claimed `popup-ribbon`/`popup-phoneme` classes exist (ribbon already uses `inspector-*` classes); overestimated CSS variable bloat
- **Critical finding:** The Popup object (~1,996 lines) is 79% dead code. Only `renderRibbon()` and `_recalculateSyllableIndices()` (~422 lines) are alive. This revised C.7 from ~150 lines to ~1,784 lines of savings.

### Task Summary

| Task | Version | Lines Saved | Cumulative |
|------|---------|-------------|------------|
| C.1: Strip console statements | 6.0.79 | ~84 | 16,154 |
| C.2: Golden Tests to `tests.html` | 6.0.80 | ~170 | 15,984 |
| C.3: Blank lines + decorative banners | 6.0.81 | ~450 | 15,534 |
| C.4: SINGER_SUPPLEMENT to JSON | 6.0.82 | ~325 | 15,209 |
| C.5: RuleRegistry to JSON | 6.0.83 | ~1,950 | 13,259 |
| C.6: CSS audit (expanded) | 6.0.84 | ~558 | 12,701 |
| C.7: Dead JS removal (Popup) | 6.0.85 | ~1,784 | 10,917 |

### Post-Phase C File Structure
- `index.html` (~10,917 lines)
- `tests.html` (Golden master test suite)
- `data/singer-supplement.json` (high-frequency vocabulary stress data)
- `data/rule-registry.json` (136 bilingual educational blurbs)

### Measurement Gate
After C.7, measure actual line count and CSS proportion. If CSS is still >3,500 lines, pursue additional mechanical CSS reductions as C.8 before moving to Phase D.

---

## File Anatomy (v6.0.78 -- ~16,238 lines)

| Section | Lines | Start | Notes |
|---------|-------|-------|-------|
| CSS + HTML | ~4,903 | 1 | 17 media queries, gradient dash system, square tile buttons |
| UI_LABELS + setUILanguage | ~293 | 4904 | 45 bilingual keys, `setUILanguage()` |
| Utilities + profiles | ~162 | 5197 | Dictionary analysis, profile system |
| SINGER_SUPPLEMENT | ~368 | 5358 | **Externalizable (C.4)** |
| CURATED_GLOSSES | ~208 | 5726 | ~80 bilingual glosses (stays inline) |
| Gloss utilities | ~560 | 5934 | formatGlossForDisplay, extractCleanGloss, etc. |
| DocumentController | ~431 | 6493 | Page size, char counter, paper chrome |
| DashboardController | ~193 | 6924 | Welcome flow, metadata, PDF export |
| DrawerController | ~856 | 7117 | transcribe(), renderToPaper(), createPageElement() |
| GraysonEngine | ~2,359 | 7973 | **Irreducible phonological core -- do not touch** |
| RuleRegistry/Blurbs | ~1,992 | 10332 | 136 bilingual entries. **Externalizable (C.5)** |
| DocumentState | ~32 | 12324 | lines[], userName, metadata, 3 update methods |
| Popup (MOSTLY DEAD) | ~1,996 | 12364 | **~1,574 lines dead. Extract renderRibbon, delete rest (C.7)** |
| DrawerState | ~1,592 | 14367 | Inspector, controls, attribution arrow, ё lock |
| Golden Tests | ~173 | 15959 | **Move to tests.html (C.2)** |
| Init + event wiring | ~107 | 16132 | Document-level click, drawer open/close |

---

## Key Technical Notes

### Popup Dead Code Map (C.7)
The Popup object (lines 12364--14360) was the original word-inspection UI, removed in Phase 3E. Only two methods are alive:
- `renderRibbon()` (~370 lines, line 13059): builds phoneme ribbon HTML. Called by DrawerState at lines 14738 and 15504.
- `_recalculateSyllableIndices()` (~52 lines, line 13426): adjusts syllable indices for custom boundaries.

Everything else is dead: `init()`, `open()`, `close()`, `positionPopup()`, `handleYoToggle()` (reimplemented as `DrawerState.handleVariantToggle()`), all event handlers, all staging/commit/revert methods, all UI update methods.

**Extraction plan:** Fold `renderRibbon` and `_recalculateSyllableIndices` into DrawerState, update `Popup.renderRibbon(...)` calls to `this.renderRibbon(...)`, then delete the entire Popup object.

**Also dead:** `formatGlossForPopup()` (lines 6051--6110, only caller is dead Popup code) and `analyzeGlossGaps()` (line 5190, console-only developer utility).

### Orphaned Blurb Entries (C.5)
Two entries use `stressed-interpalatal` keys that `deriveRule()` never generates:
- `'a:stressed-interpalatal:а'` (line 10351)
- `'e:stressed-interpalatal:е'` (line 10371)

Fix: In `deriveRule()` (line 11707), change `return features.interpalatal ? 'interpalatal' : 'stressed'` to return `'stressed-interpalatal'` when both stressed and interpalatal.

### CSS Dead Code Map (C.6)
- ~115 lines of active-but-dead popup selectors
- ~267 lines of commented-out CSS from Phase 2C and Phase 3E
- 5 `@media print` blocks to consolidate (lines 1330, 1415, 1661, 1995, 4343)
- 3 `@media (max-width: 768px)` blocks to merge (lines 1682, 3386, 3432)
- 1 `@media (max-width: 767px)` block to unify with 768px (line 3870)
- `--shadow-popup` variable (line 93) and its one reference (line 2519)

### Startup Pacifier (Planned)
Loading gate for externalized data. First login solicits username (intake wizard). Subsequent loads show animated pacifier with Russian-themed imagery. Occupies the user while dictionary tiers, SINGER_SUPPLEMENT, and RuleRegistry load. Infrastructure already exists for dictionary tier loading via `fetch()` with `await`.

### Clitic Transcription Logic
- Vowelless clitics (в, к, с, б, ль): Early return with canonical IPA at line ~9283
- Vowel-bearing clitics (же, ли, бы, то, ка, таки): Normal transcription path
- Condition: `cliticInfo && isClitic && !procliticPosition && this.countVowels(cleanWord) === 0`

### Ё Guard Architecture
Syllable buttons are never disabled. Two guards prevent stress reassignment in ё words:
- `DrawerState.updateStress()` (~line 14312): checks `hasYo`, shows lock message, returns early
- `DrawerController.handleStressChange()` (~line 15154): checks `hasYo`, shows lock message, returns early

### Gloss Utility Pipeline (Not Duplicates)
These serve distinct pipeline stages and should not be consolidated:
- `extractGloss()`: resolves bilingual `{en, fr}` objects (9 references)
- `extractCleanGloss()`: strips verbose dictionary patterns (5 references)
- `truncateGloss()`: enforces word/character limits for paper display (3 references)
- `formatGlossForDisplay()`: orchestrates the above for paper rendering (3 references)
- `formatGlossForPopup()`: **DEAD** -- only caller is dead Popup code (C.7 target)

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
- 136 bilingual educational blurbs in RuleRegistry.
- Custom glosses stored as `{en, fr}` objects (same text both languages).

### Language Switch Flow
1. User clicks pill -> `currentGlossLanguage` updates
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

## Phase D: Deep Refactoring (Future)

- Consolidate DocumentState and DrawerState render logic (~2,043 + ~1,592 lines with significant overlap)
- Refactor DocumentController/DrawerController boundary
- DrawerState internal audit (event handler consolidation, DOM query caching)
- This is where the sub-9,000 target becomes realistic
- Will likely benefit from a Kimi consultation for architecture

**Target:** Under 9,000 lines with full bilingual support, clean codebase, no architectural compromises.

---

## Deferred Items

| ID | Item | Reason |
|----|------|--------|
| 7.A | Mobile layout broken on iPhone 14 | Deferred to post-Phase C; requires dedicated mobile pass and Kimi consultation |
| -- | Startup pacifier (loading gate UI) | Planned but not yet built; needed before C.4/C.5 externalization goes live |

---

## Kimi Consultation Summary

### Phase B Consultation
**Accepted:** Counter visibility + min-width, gloss persistent dashed underline, stress source proximity grouping, Clear renamed to "New Text."
**Dann's modifications:** Pulsating arrow, deliberate attribution, small-caps rubric, overshoot slide-in, gradient dashes, square tile action buttons.
**Kimi's addition:** `aria-live="polite"` on stress source row.

### Phase C Consultation (Two Rounds)
**Round 1:** Kimi received full architectural brief with file anatomy, task list, and four specific questions. Provided CSS consolidation recommendations, renderRibbon extraction strategy (Hybrid B/C), Phase D preview suggestions.
**Round 2:** Claude sent follow-up correcting four errors (XHR claim, invented sanitizeGloss, popup class names, CSS variable bloat). Kimi recalibrated with verified data. Final consensus: Phase C reaches ~10,917 lines; Phase D required for 9,000.

---

## Working Rules

- **One change per cycle.** Propose -> "Proceed?" -> wait for "yes."
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
