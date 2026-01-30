# Ilya Issue Tracker — v5.11.11

**Last Updated:** 2026-01-30  
**Test Corpus:** Shostakovich *Станцы* (Pushkin text)

---

## Implementation Sequence

Per Kimi's architectural review (2026-01-30), issues are sequenced to respect dependencies:

1. **Phase 1:** Rendering bugs (K, L, N) — isolated, low risk
2. **Phase 2:** Dictionary fixes (P, then C/I) — fix truncation before auditing gaps
3. **Phase 3:** Grayson verification (H, S, T) — non-blocking research
4. **Phase 4:** Layout optimization (B, Q, R) — establish 8-row baseline
5. **Phase 5:** Clitic fusion (F, G, J, V, W) — text condensation after layout
6. **Phase 6:** UX enhancement (E) — copy mechanism
7. **Phase 7:** Future (M) — doubled consonant drag

**Critical insight from Kimi:** Do layout (Phase 4) BEFORE clitic fusion (Phase 5). Clitic changes alter text width, which affects line breaking. Optimize pagination first, then fine-tune spacing.

---

## Phase 1: Rendering Bugs

### Issue K — Ghost Text Collision ✅ FIXED

**Symptom:** `чей-нибудь` displayed as `чейнибудьчей-нибудь`

**Root cause:** 
```javascript
// OLD (broken):
const cleanWord = wordData.cyrillic.replace(/[.,!?;:"""''–—\-]/g, '');
const punct = wordData.cyrillic.replace(cleanWord, '');
// For "чей-нибудь": cleanWord = "чейнибудь", punct = "чей-нибудь" (no match!)
```

**Fix (v5.11.11):**
```javascript
const trailingPunctMatch = wordData.cyrillic.match(/[.,!?;:"""'']+$/);
const punct = trailingPunctMatch ? trailingPunctMatch[0] : '';
const cleanWord = wordData.cyrillic
  .replace(/[.,!?;:"""'']+$/, '')  // Remove trailing punct
  .replace(/[-–—]/g, '');           // Remove hyphens/dashes (keep word intact)
```

**Location:** Lines 4800-4804

---

### Issue L — Monosyllable дуб ⚠️ PARTIAL

**Symptom:** `дуб` shows no stress mark, possibly wrong final consonant

**Sub-issues:**

1. **Stress mark missing** ✅ FIXED
   - Old code: `s.isStressed && tw.syllables.length > 1`
   - New code: `s.isStressed` (all stressed syllables get marks)
   - Location: Line 4892

2. **Final devoicing question** ❓ NEEDS GRAYSON VERIFICATION
   - Current behavior: `дуб` before `уединенный` shows `/dub/` not `/dup/`
   - Final devoicing only applies at phrase boundaries (last word OR hard boundary)
   - Is this correct? Check Grayson for devoicing before vowel-initial words

3. **Ribbon labels** ❓ NEEDS TESTING
   - Dann asked: "Are we still labelling STRESSED MONOSYLLABLE?"
   - Verify ribbon shows appropriate monosyllable message

---

### Issue N — Wrong Stress Glyph ❓ NEEDS TESTING

**Symptom:** `лесов` shows `lʲɪ "sof` with quote instead of `ˈ`

**Investigation results:**
- Code uses correct character: `'ˈ'` (U+02C8 MODIFIER LETTER VERTICAL LINE)
- Verified via byte inspection: `313 210` = ˈ in UTF-8
- All 12 instances in code use correct glyph

**Possible causes:**
1. Font rendering issue (fallback font doesn't have ˈ?)
2. Copy/paste artifact in screenshot
3. Dictionary data contains wrong character

**Next step:** Test live and report if still occurring. If yes, inspect dictionary JSON for affected entries.

---

## Phase 2: Dictionary Fixes

### Issue P — Pronoun Gloss Too Long

**Symptom:** `он` shows "third-person mascu..." instead of "he"

**Solution:** Create curated pronoun gloss table (like cliticData):

```javascript
const pronounGlosses = new Map([
  ['я', 'I'],
  ['ты', 'you'],
  ['он', 'he'],
  ['она', 'she'],
  ['оно', 'it'],
  ['мы', 'we'],
  ['вы', 'you (pl/formal)'],
  ['они', 'they'],
  ['меня', 'me'],
  ['тебя', 'you'],
  ['его', 'him/his'],
  ['её', 'her'],
  // ... etc
]);
```

**Implementation:** Check pronoun table before dictionary lookup in `formatGlossForDisplay()`

---

### Issue C — Missing Glosses Throughout

**Symptom:** Multiple blank glosses across 5 pages

**Audit needed:** List all words with blank glosses, determine if:
1. Dictionary genuinely missing entry
2. Harvesting logic failing to extract gloss
3. Gloss truncation removing valid content

**Depends on:** Issue P (fix truncation first to avoid false negatives)

---

### Issue I — здесь Missing

**Symptom:** Very common word `здесь` (here) has no gloss

**Action:** Check dictionary for entry. If missing, investigate harvesting pipeline.

---

## Phase 3: Grayson Verification

### Issue H — моим J-Glide

**Question:** Does `и` trigger j-glide after another vowel?

**Current output:** `mɑ ˈim`  
**Alternative:** `mɑ ˈjim`

**Grayson reference needed:** Chapter 3 Section 6 (The /j/+Vowel Clusters, p. 114)

**Context:** Grayson's j-glide rule applies to iotated vowels (е, ё, ю, я) after vowels. Does plain `и` also trigger this?

---

### Issue S — -вств- Cluster Simplification

**Word:** `бесчувственному`  
**Current output:** `ˈbʲeʃʲʃʲ ufst vʲɪn nʌ mu`  
**Question:** Should first в in -вств- be silent?

**Expected if simplified:** `ˈbʲeʃʲʃʲ ust vʲɪn nʌ mu`

**Grayson reference needed:** Chapter 6 (Applied Assimilation) — cluster simplification rules

**Note:** This is a common pattern (чувство, здравствуй, etc.)

---

### Issue T — стл- Cluster Simplification

**Word:** `истлевать`  
**Current output:** `ist lʲɪ ˈvɑtʲ`  
**Question:** Should т delete in стл- cluster?

**Expected if simplified:** `is lʲɪ ˈvɑtʲ`

**Grayson reference needed:** Same as Issue S

---

## Phase 4: Page Layout

### Issues B, Q, R — Achieve 8 Rows Per Page

**Symptom:** Pages 1-2 have excessive negative space before footer. Page 4 shows 8th row is possible via overflow.

**Current settings:**
```javascript
const linesPage1 = 5;
const linesSubsequent = 7;
```

**Kimi's recommendation:** Use CSS custom properties, not JS constants:

```css
:root {
  --verse-line-height: 1.6;      /* Reduce from ~1.8 */
  --stanza-gap: 1.5rem;          /* Reduce from ~2.2rem */
  --page-top-margin: 2rem;       /* Reduce from ~3rem */
}
```

**Target:** Reduce total vertical rhythm by ~12% to gain 8th row without affecting font size.

**Implementation approach:**
1. Audit current CSS spacing values
2. Create CSS variables for adjustable rhythm
3. Test with Станцы corpus
4. Update paginator constants if needed

---

## Phase 5: Clitic Fusion Logic

### Issues F, G, J, W, V — Vowel-Aware Spacing + Stress Repositioning

**Current behavior:** All clitics fuse with space between.

**Required behavior:**

| Clitic | Has Vowel? | Fusion | Example |
|--------|------------|--------|---------|
| ль | No | No space | `ˈvʲidʲɪlʲlʲi` |
| б | No | No space | `fsʲop` |
| во | Yes | Space | `vɑ ˈmʲi` |
| не | Yes | Space | `ɲɪ ˈvʲit` |

**Stress repositioning (Issue V):**
- Vowelless proclitic + initially-stressed host: stress mark stays syllable-initial
- `к` + `ˈmʲilɑmu` → `kˈmʲilɑmu` (not `ˈkmʲilɑmu`)

**Kimi's implementation:**

```javascript
const vowellessClitics = new Set(['к', 'в', 'с', 'ль', 'б', 'ж', 'н']);

function fuseClitic(hostIPA, cliticIPA, cliticText, cliticPosition) {
  const hasVowel = /[аеёиоуыэюя]/i.test(cliticText);
  const separator = hasVowel ? ' ' : '';
  
  if (!hasVowel && cliticPosition === 'proclitic') {
    // Stress repositioning
    return hostIPA.replace(/^(ˈ?)(.*)$/, `${cliticIPA}$1$2`);
  }
  
  return cliticPosition === 'proclitic' 
    ? cliticIPA + separator + hostIPA
    : hostIPA + separator + cliticIPA;
}
```

**Location to modify:** Lines 4900-4925 (Phase 2.6 clitic fusion)

---

## Phase 6: UX Enhancement

### Issue E — Copy-to-Clipboard

**Symptom:** Stacks are clickable hotspots, blocking text selection.

**Kimi's solution:** Double-click to copy

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

**Accessibility:** Add `title="Double-click to copy"` to stack containers.

---

## Phase 7: Future Consideration

### Issue M — Doubled Consonant Drag

**Context:** Dann wants special behavior for consonant drag on doubled consonants (e.g., `уединенный`).

**Status:** Parked. Dann will explain requirements when ready.

**Reminder text:** "Discuss уединенный consonant drag behavior"

---

## Testing Checklist

After each change, verify with Станцы corpus:

- [ ] No ghost text on hyphenated words (чей-нибудь)
- [ ] Monosyllables show stress marks (дуб, нас, час)
- [ ] Correct stress glyph ˈ not "
- [ ] Clitic arrows display correctly (→ ←)
- [ ] Clitic IPA fuses to host words
- [ ] 8 rows fit per page (except final page)
- [ ] Footer aligns with content margins
- [ ] Print preview matches screen pagination

---

## Quick Reference: Code Locations

| Feature | Lines |
|---------|-------|
| Punctuation/cleanWord parsing | 4800-4810 |
| Stress mark addition | 4890-4895 |
| Clitic fusion logic | 4900-4925 |
| cliticData with glosses | 5178-5220 |
| Cross-word assimilation | 6745-6795 |
| Page layout CSS | 275-500 |
| Print CSS | 2688-2760 |
