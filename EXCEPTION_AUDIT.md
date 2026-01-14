# Exception Dictionary Audit

## Categories of Exceptions

### 1. TRUE EXCEPTIONS — Keep (cannot be computed)

These have silent letters, irregular pronunciations, or loanword rules MSR can't compute:

| Word | Rule | Why it's a true exception |
|------|------|---------------------------|
| сердце | д silent | Cluster simplification рдц → рц |
| солнце | л silent | Cluster simplification лнц → нц |
| здравствуй | в silent | Cluster simplification вств → ств |
| чувство | в silent | Cluster simplification вств → ств |
| что | чт → шт | Irregular pronunciation |
| конечно | чн → шн | Irregular pronunciation |
| скучно | чн → шн | Irregular pronunciation |
| церковь | р soft | Old Muscovite tradition |
| ангел | н stays hard | Borrowed word exception |
| русский | single с | Despite сс spelling |
| счастье | а not fronted | Exception to interpalatal rule |
| All loanwords (100+) | C unpalatalized before е | Foreign pronunciation preserved |

**Verdict: ~130 entries are TRUE exceptions. Keep.**

---

### 2. LIKELY REDUNDANT — Test and possibly remove

These might match MSR's normal output:

| Word | Exception IPA | Possible issue |
|------|---------------|----------------|
| день | dʲeɲ | We just fixed this — interpalatal е should work now |
| няня | ɲa.ɲɑ | Added as workaround — core logic issue |
| вода | vɑ.dɑ | Basic akanye — should compute correctly |
| весна | vʲɪ.snɑ | Basic ikanye — should compute correctly |
| молоко | mʌ.ɫɑ.ko | Basic reduction — should compute correctly |
| она | ɑ.nɑ | Word-initial о → ɑ — should compute correctly |
| был | bɨɫ | Hard л → ɫ — should compute correctly |
| соль | solʲ | Soft л → lʲ — should compute correctly |
| жить | ʒɨtʲ | Always-hard ж — should compute correctly |
| шить | ʃɨtʲ | Always-hard ш — should compute correctly |
| час | tʃʲɑs | ч = tʃʲ — should compute correctly |
| щи | ʃʲʃʲi | щ = ʃʲʃʲ — should compute correctly |
| хлеб | xlʲɛp | Final devoicing — should compute correctly |
| друг | druk | Final devoicing — should compute correctly |
| год | ɡot | Final devoicing — should compute correctly |
| нож | noʃ | Final devoicing — should compute correctly |
| раз | rɑs | Final devoicing — should compute correctly |
| кровь | krofʲ | Final devoicing — should compute correctly |
| стол | stoɫ | Basic transcription |
| столь | stolʲ | Basic transcription |
| мать | mɑtʲ | Basic transcription |
| мять | mʲatʲ | Interpalatal — should compute correctly |
| большой | bɑlʲ.ʃoj | Basic transcription |

**Verdict: ~25 entries may be redundant. Need to test.**

---

### 3. COMPLEX EXAMPLES — Keep for now

These demonstrate complex palatalization chains. Even if MSR computes them correctly, they serve as regression tests:

| Word | Rule |
|------|------|
| сестрёнка | Multiple palatalization zones |
| симметрический | Most complex example |
| смерть, терпеть, кирпич | р after stressed front vowel |
| вернуть, черника | р stays hard (contrast examples) |

**Verdict: ~10 entries. Keep as verified examples.**

---

## Recommended Action

1. **Run the audit script** in browser to get exact match/mismatch data
2. **Remove confirmed redundant entries** (basic transcription rules)
3. **Keep все entries for**: silent letters, irregular clusters, loanwords, complex examples
4. **Keep день and няня** until core interpalatal logic is fixed properly

## Quick Test

To test if an entry is redundant, temporarily delete it from EXCEPTION_WORDS and see if MSR produces the same IPA.

```javascript
// In console:
delete EXCEPTION_WORDS['был'];
processWord('был', 0).syllables.map(s => s.ipa).join('.')
// If output is 'bɨɫ', the exception was redundant
```
