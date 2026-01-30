# KIMI HANDOFF: KAIKKI EXTRACTION BUG
**Date:** 2026-01-30  
**From:** Claude  
**Priority:** Medium (stopgap in place)

---

## The Problem

Our Russian dictionary extraction script (`extract_ilya_dictionary.py`) successfully extracts 416,692 words from kaikki.org's Wiktionary dump, but **ALL adjective lemmas are missing**.

Examples of missing words:
- красивый (beautiful)
- молодой (young)
- старый (old)
- новый (new)
- большой (big)
- хороший (good)

Inflected forms of these adjectives ARE present (красивая, красивого, etc.), but the base nominative masculine singular forms are not.

---

## The Data IS Good

Raw kaikki JSONL for красивый:
```json
{
  "word": "красивый",
  "pos": "adj",
  "head_templates": [{
    "args": {"1": "краси́вый"},  // ← STRESS HERE
    "expansion": "краси́вый • (krasívyj) ..."
  }],
  "forms": [
    {"form": "краси́вый", "tags": ["canonical"]},  // ← AND HERE
    {"form": "krasívyj", "tags": ["romanization"]},
    // ... many inflected forms
  ],
  "senses": [{"glosses": ["beautiful, handsome"]}]
}
```

The accent mark (и́ = и + U+0301) is present in multiple locations.

---

## What Claude Tried

### Strategy 1: Check head_templates first
```python
for tmpl in head_templates:
    args = tmpl.get('args', {})
    candidate = args.get('1', '')
    if candidate and '\u0301' in unicodedata.normalize('NFD', candidate):
        stressed_form = candidate
        stress_pos = extract_stress_position(candidate)
```

### Strategy 2: Check forms[] with canonical tag
```python
for form_entry in forms:
    tags = form_entry.get('tags', [])
    if 'canonical' in tags:
        stressed_form = form_entry.get('form', '')
        stress_pos = extract_stress_position(stressed_form)
```

### Strategy 3-4: Fallbacks to first accented form, word field

### Added Debug Tracing
```python
test_words = {'красивый', 'молодой', 'старый', 'большой', 'хороший'}
if clean_word(word_raw) in test_words:
    print(f"TRACE: Found '{word_raw}' (pos={pos})")
    print(f"  stress_pos={stress_pos}")
    print(f"  lookup_key='{lookup_key}'")
```

### Results
- Script runs successfully
- 416,692 words extracted
- Only 3,853 entries skipped for "no stress"
- BUT: No TRACE output appears for test adjectives
- AND: Test adjectives still missing from final dictionary

---

## The Mystery

If these entries were being skipped, we'd see debug output like:
```
DEBUG: Skipped adj 'красивый' - no stress found
```

But we DON'T see that. The skipped adjectives in the output are all short-form stems like `стар`, `нов`, `мал`.

So the entries ARE being processed (not skipped), but they're NOT appearing in the final output.

---

## Theories

1. **Duplicate detection discarding them?**
   - Maybe an inflected form is being stored first under the same key?

2. **Key mismatch?**
   - `lookup_key = clean_word(word_raw)` vs what's in the entry?

3. **Unicode normalization issue?**
   - `clean_word()` removes accents; maybe something's wrong with the key?

4. **Forms[] loop processing inflections first?**
   - Each JSONL line can have many forms; maybe we're iterating in wrong order?

5. **Script version mismatch?**
   - Dann may be running an old version of the script

---

## Suggested Debug Approach

1. **Isolate one adjective:**
   ```bash
   grep '"красивый"' kaikki.org-dictionary-Russian.jsonl > test_adj.jsonl
   python3 extract_ilya_dictionary.py test_adj.jsonl
   ```

2. **Add entry-level tracing:**
   Before any processing, print every word where `pos == 'adj'` and word matches test set.

3. **Check the extraction loop structure:**
   - Are we iterating over entries or over forms within entries?
   - Where exactly does `word_raw` come from?

4. **Verify clean_word output:**
   ```python
   print(f"word_raw={word_raw}, clean={clean_word(word_raw)}")
   ```

---

## Files

**Extraction script (with debug code):**
`/mnt/user-data/outputs/extract_ilya_dictionary.py`

**On Dann's machine:**
- Input: `~/Downloads/kaikki.org-dictionary-Russian.jsonl`
- Output: `~/Downloads/ilya_dictionary.json.gz`

---

## Stopgap in Place

39 common adjectives added manually to SINGER_SUPPLEMENT in `index.html`. The app works for typical singer use cases. This bug is not blocking, but should be fixed for dictionary completeness.

---

## Expected Outcome

Dictionary should include all adjective lemmas with:
- Correct stress position
- Part of speech: "adj."
- Gloss: "beautiful, handsome" etc.

---

**Thanks, Kimi!**
