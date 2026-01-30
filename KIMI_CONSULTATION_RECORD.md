# Kimi Consultation Record

This document preserves Kimi's architectural recommendations for reference.

---

## Consultation: 2026-01-30

### Context
Claude drafted a comprehensive issue triage request covering 19 issues (A-W) identified during Dann's review of Shostakovich *Станцы* output.

### Kimi's Key Recommendations

#### 1. Sequencing Correction

**Original sequence:** Clitic fusion (Phase 4) → Layout optimization (Phase 5)

**Kimi's correction:** Invert these phases.

> "Clitic fusion alters text width measurably—`кˈмʲi` vs `k ˈмʲi` changes line breaking behavior. If you optimize pagination for 8 rows *before* tightening clitic spacing, you'll likely see reflow artifacts that force you to redo the layout work."

**Revised sequence:**
- Phase 4: Layout optimization (establish 8-row baseline)
- Phase 5: Clitic fusion (fine-tune spacing within optimized containers)

---

#### 2. Clitic Fusion: Dynamic Vowel Detection

**Kimi's recommendation:** Do NOT add static `hasVowel` flag to cliticData. Derive dynamically.

```javascript
const vowellessClitics = new Set(['к', 'в', 'с', 'ль', 'б', 'ж', 'н']);

function fuseClitic(hostIPA, cliticText, cliticPosition) {
  const hasVowel = /[аеёиоуыэюя]/i.test(cliticText);
  const separator = hasVowel ? ' ' : ''; // Voweled = space, vowelless = no space
  
  // Stress repositioning for vowelless proclitics
  if (!hasVowel && cliticPosition === 'proclitic') {
    return hostIPA.replace(/^(ˈ?)(.*)$/, `${cliticText}$1$2`);
  }
  
  return cliticPosition === 'proclitic' 
    ? cliticText + separator + hostIPA
    : hostIPA + separator + cliticText;
}
```

**Rationale:** Clitics are a closed class (~20 items). Maintaining canonical forms and deriving properties dynamically prevents data desynchronization.

**Performance note:** Embed stress shift during construction (O(1) per clitic) rather than post-processing (requires second regex pass).

---

#### 3. Page Layout: CSS-First Approach

**Kimi's recommendation:** Use CSS custom properties, not JS paginator constants.

```css
:root {
  --verse-line-height: 1.6;      /* Reduce from ~1.8 */
  --stanza-gap: 1.5rem;          /* Reduce from ~2.2rem */
  --page-top-margin: 2rem;       /* Reduce from ~3rem */
}
```

**Rationale:** 
- Issue R (row overflow) proves container CAN hold 8 rows
- Failure on pages 1-2 is likely cumulative margin collapse
- CSS adjustments use flex space distribution, more resilient when text widths shift during clitic fusion

**Target metric:** Reduce total vertical rhythm by ~12% to gain 8th row without affecting font size (IPA legibility).

---

#### 4. Copy-to-Clipboard: Double-Click

**Kimi's recommendation:** Use double-click as dormant gesture.

```javascript
wordElement.addEventListener('dblclick', (e) => {
  e.stopPropagation(); // Prevent card flip
  const text = extractStackText(wordElement);
  navigator.clipboard.writeText(text);
  
  // Micro-feedback: 400ms accent glow
  wordElement.style.transition = 'box-shadow 0.2s ease';
  wordElement.style.boxShadow = '0 0 0 2px var(--color-accent)';
  setTimeout(() => wordElement.style.boxShadow = '', 400);
});
```

**Rationale:**
- Double-click is dormant in current interaction model
- stopPropagation prevents card flip
- Micro-animation provides confirmation without persistent UI
- Add `title="Double-click to copy"` for accessibility

---

#### 5. Dictionary Coupling Warning

**Kimi's observation:** Issue P (pronoun gloss truncation) may affect Issue C audit.

> "When you audit Issue C (Missing glosses), verify that your dictionary harvester isn't rejecting entries based on string length—if it is, fixing P first prevents false negatives in the C audit."

**Action:** Fix P before auditing C.

---

#### 6. Stress Glyph Issue (N)

**Kimi's observation:** The `"` vs `ˈ` problem is likely upstream.

> "Fix at the data source, not the display layer."

**Action:** Before clitic fusion work, audit dictionary JSON for entries containing wrong character.

---

#### 7. Ghost Text Regression Test

**Kimi's warning:** Issue K (string concatenation error) may indicate state pollution.

> "Verify that `renderSingersView` clears `wordClickRegions` completely before repopulating, or the 'ghost' may reappear during clitic fusion work."

---

### Final Implementation Sequence (Kimi-Approved)

1. **Phase 1:** K, L, N (Rendering bugs + regression test)
2. **Phase 2:** P, then C/I (Dictionary audit with length filter fixed)
3. **Phase 3:** H, S, T (Grayson verification—non-blocking research)
4. **Phase 4:** B, Q, R (Layout optimization to 8 rows via CSS)
5. **Phase 5:** F, G, J, V, W (Clitic fusion with dynamic vowel detection)
6. **Phase 6:** E (Double-click copy mechanism)
7. **Phase 7:** M (Future consideration)

---

### Clarification Exchange

**Claude asked:** For stress repositioning, does the regex produce `kˈmʲi` (stress after clitic) correctly?

**Kimi confirmed:** Yes. The regex `^(ˈ?)(.*)$` captures stress only when word-initial. When clitic prepends, stress mark remains immediately before host's first syllable.

**Scope boundary:** This logic applies ONLY to vowelless proclitics. Voweled proclitics preserve space and don't need stress repositioning.

**Edge case warning:** If IPA generation ever produces stress marks mid-word without leading spaces (e.g., `mʲiˈlɑ` instead of `mʲi ˈlɑ`), the regex won't catch it. Ensure IPA tokenizer normalizes to space-delimited syllables.
