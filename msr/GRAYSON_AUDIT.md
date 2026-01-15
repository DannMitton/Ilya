# GRAYSON RULES AUDIT FOR MSR
## Systematic Check: Chapters 3 & 6

Legend:
- ✅ Implemented & tested
- ⚠️ Partial/needs verification  
- ❌ Missing
- 🧪 Needs golden test

---

## CHAPTER 3: VOWELS

### 3.1 Stressed Cardinal Vowels (p. 81-96)

| Letter | Phoneme | Context | MSR | Test |
|--------|---------|---------|-----|------|
| а | /ɑ/ | Default stressed | ✅ | 🧪 |
| а | /a/ | Interpalatal (between soft C) | ✅ | ✅ |
| о | /o/ | Stressed (NOT /ɔ/) | ✅ | ✅ |
| е | /ɛ/ | Default stressed | ✅ | ✅ |
| е | /e/ | Interpalatal stressed | ✅ | ✅ |
| ё | /o/ | Always stressed | ✅ | ✅ |
| и | /i/ | Stressed | ✅ | ✅ |
| ы | /ɨ/ | Stressed | ✅ | ✅ |
| у | /u/ | Stressed | ✅ | ✅ |
| ю | /u/ | Stressed (after soft C) | ✅ | 🧪 |
| я | /ɑ/ | Stressed default | ✅ | 🧪 |
| я | /a/ | Stressed interpalatal | ✅ | 🧪 |
| э | /ɛ/ | Stressed | ✅ | 🧪 |

### 3.2 The j-glide (p. 93-96)

| Rule | MSR | Test |
|------|-----|------|
| й = /j/ | ✅ | ✅ |
| Iotated vowels word-initial: е,ё,ю,я = /j/+V | ✅ | ✅ |
| Iotated vowels after vowel: = /j/+V | ✅ | ✅ |
| Iotated vowels after ъ/ь: = /j/+V | ✅ | 🧪 |

### 3.3 Unstressed Cardinal Vowels (p. 97-107)

| Letter | Position | Phoneme | MSR | Test |
|--------|----------|---------|-----|------|
| а | Immediate pretonic | /ɑ/ | ✅ | ✅ |
| а | Remote | /ʌ/ | ✅ | ✅ |
| о | Immediate pretonic (akanye) | /ɑ/ | ✅ | ✅ |
| о | Remote | /ʌ/ | ✅ | ✅ |
| о | Word-initial | /ɑ/ | ✅ | ✅ |
| о | Loanwords (unstressed) | /o/ | ✅ | 🧪 |
| е | Default unstressed | /ɪ/ | ✅ | ✅ |
| е | After ж,ш,ц | /ɨ/ | ✅ | ✅ |
| и | ANY position | /i/ (never reduces!) | ✅ | ✅ |
| ы | Unstressed | /ɨ/ | ✅ | 🧪 |
| у | Unstressed | /u/ | ✅ | 🧪 |

### 3.4 Intermediate Allophones - Stressed Only (p. 103-107)

| Rule | MSR | Test |
|------|-----|------|
| /a/ only stressed interpalatal | ✅ | ✅ |
| /e/ only stressed interpalatal | ✅ | ✅ |

### 3.5 Reduced/Centralized Allophones (p. 108-113)

| Phoneme | Context | MSR | Test |
|---------|---------|-----|------|
| /ʌ/ | Remote unstressed а/о | ✅ | ✅ |
| /ɪ/ | Unstressed е/я | ✅ | ✅ |

### 3.6 j-glide + Vowel Clusters (p. 114-124)

| Cluster | Phoneme | MSR | Test |
|---------|---------|-----|------|
| е word-initial | /jɛ/ or /je/ | ✅ | ✅ |
| ё word-initial | /jo/ | ✅ | ✅ |
| ю word-initial | /ju/ | ✅ | 🧪 |
| я word-initial | /jɑ/ or /ja/ | ✅ | 🧪 |
| е after vowel | /jɪ/ unstressed | ✅ | ✅ |
| ё after vowel | /jo/ | ✅ | ✅ |

### 3.7 Vowel Assimilation and Reduction (p. 125-128)

| Rule | Page | MSR | Test |
|------|------|-----|------|
| Interpalatal fronting: а→/a/, е→/e/ | p.125 | ✅ | ✅ |
| Unstressed /ɪ/ fronts to /i/ when interpalatal | p.126 | ✅ | ✅ |
| /ɛ/ fronts to /e/ before soft C (even after ж,ш,ц) | p.126 | ⚠️ | 🧪 |

### 3.8 Vowel Reconstitution (p. 129-132)

| Rule | MSR | Test | Notes |
|------|-----|------|-------|
| Singers may reconstitute reduced vowels | N/A | N/A | UI feature, not transcription |

---

## CHAPTER 6: CONSONANTS & ASSIMILATION

### 6.1a Consonant Clusters (p. 213-214)

| Rule | MSR | Test |
|------|-----|------|
| Clusters analyzed regressively | ✅ | ✅ |

### 6.1b Regressive Assimilation of Voicing (p. 215-224)

| Pattern | Example | MSR | Test |
|---------|---------|-----|------|
| б→п before voiceless | трубка | ✅ | ✅ |
| г→к before voiceless | ногти | ✅ | ✅ |
| д→т before voiceless | водка | ✅ | ✅ |
| ж→ш before voiceless | ложка | ✅ | ✅ |
| з→с before voiceless | лезть | ✅ | ✅ |
| к→г before voiced | вокзал | ✅ | ✅ |
| с→з before voiced | сбор | ✅ | ✅ |
| т→д before voiced | отбой | ✅ | ✅ |
| Word-final devoicing | год→/ɡot/ | ✅ | ✅ |

### 6.2.1 Double Consonants / Geminates (p. 225-234)

| Rule | MSR | Test |
|------|-----|------|
| Double consonants = geminate /Cː/ | ⚠️ | 🧪 |
| сс in русский = single /s/ | ✅ | ✅ |

### 6.2.2 Special Letter Clusters (p. 235-248)

| Cluster | Reading | MSR | Test |
|---------|---------|-----|------|
| чн → /ʃn/ (some words) | конечно | ✅ | ✅ |
| чт → /ʃt/ (что, чтобы) | ⚠️ | 🧪 |
| гк → /xk/ or /xʲkʲ/ | мягкий | ✅ | ✅ |
| стн → /sn/ (д silent) | ⚠️ | 🧪 |
| здн → /zn/ (д silent) | поздно | ⚠️ | 🧪 |
| рдц → /рц/ (д silent) | сердце | ✅ | ✅ |
| лнц → /нц/ (л silent) | солнце | ✅ | ✅ |
| вств → /ств/ (в silent) | чувство | ✅ | ✅ |
| стск → /сск/ | ⚠️ | 🧪 |

### 6.3 Assimilation Across Word Boundaries (p. 249-257)

| Rule | Page | MSR | Test |
|------|------|-----|------|
| No assimilation across punctuation | p.250 | ❌ | ❌ |
| No assimilation across implied phrase | p.250 | ❌ | ❌ |
| Sonorants don't trigger voicing | p.250 | ❌ | ❌ |
| в has no assimilative power | p.251 | ❌ | ❌ |
| Cross-boundary voicing: к Дмитрию → /ɡ.../ | p.252 | ❌ | ❌ |
| Cross-boundary devoicing: без Тани → /bʲɪs.../ | p.252 | ❌ | ❌ |
| ч → /dʒʲ/ before voiced (across boundary) | p.256 | ❌ | ❌ |
| ц → /dz/ before voiced (across boundary) | p.256 | ❌ | ❌ |
| х → /ɣ/ before voiced (across boundary) | p.257 | ❌ | ❌ |

---

## SUMMARY

### Well Implemented ✅
- Stressed vowels (all cardinal + allophones)
- Unstressed vowel reduction (akanye, ikanye)
- Interpalatal fronting
- и never reduces
- Word-internal voicing assimilation
- Word-final devoicing
- Silent letter exceptions (сердце, солнце)
- Cluster exceptions (конечно, мягкий)

### Partially Implemented ⚠️
- Gemination (needs more tests)
- Some special clusters (чт, стн, здн)
- /ɛ/ fronting after hard sibilants

### Missing ❌
- **Cross-word-boundary voicing assimilation** (entire 6.3 section)
  - Preposition voicing: к берегу → /ɡ.../
  - Preposition devoicing: без Тани → /bʲɪs.../
  - Special allophones: ч→/dʒʲ/, ц→/dz/, х→/ɣ/

### Needs Golden Tests 🧪
- ю stressed/unstressed
- я stressed interpalatal
- э stressed
- ъ/ь + iotated vowel
- Loanword unstressed о
- чт cluster (что)
- стн cluster (честный)
- здн cluster (поздно)
- Geminates

---

## PRIORITY FOR PRE-KIMI WORK

1. **HIGH: Cross-word-boundary voicing** (6.3) — Major missing feature
2. **MEDIUM: Add missing golden tests** — Ensure coverage
3. **LOW: Special clusters** — Rare but should work

