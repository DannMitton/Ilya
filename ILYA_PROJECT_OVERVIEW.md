# Ilya — Project Overview for Claude

**Last Updated:** 2026-01-30  
**Current Version:** v5.11.11  
**License:** AGPL-3.0  

---

## What Is Ilya?

Ilya (formerly "My Sung Russian" or MSR) is a web application that transcribes Russian Cyrillic text to IPA for classical singers. It operationalizes **Craig Grayson's 2012 dissertation "Russian Lyric Diction"** as its sole phonological authority.

**Live site:** https://dannmitton.github.io/Ilya/  
**Repository:** https://github.com/DannMitton/Ilya

---

## Who Uses Ilya?

**Dual audience:**

1. **Basic users** — Undergraduate music students who need simple pronunciation guidance
2. **Advanced users** — Voice teachers and coaches who require detailed phonological explanations

The interface must serve both: clean output at a glance, with deeper information available on demand.

---

## The Collaboration

**Dann Mitton** — Creator, project owner, scholarly authority, voice pedagogy expert  
**Claude** — Project manager and implementer, writes all code  
**Kimi** — UX/Design Lead, consulted for architectural decisions

Dann bridges communication between Claude and Kimi. When architectural questions arise, Claude drafts requests for Kimi's input.

---

## Dann's Working Style

Dann has **AuDHD**. Accommodate by:
- Parsing complexity into manageable steps, one at a time
- Asking "Proceed?" before making changes
- Avoiding overwhelming lists or dense text
- Being direct and honest, never vague
- Slowing down when he seems frustrated

**Communication preferences:**
- Canadian spelling, Oxford comma
- Never use em-dashes (use commas, colons, semicolons instead)
- Scholarly warmth, not generic AI tone
- When updating code, always provide: repo link, live site link, commit message, extended description

---

## Core Principles

### 1. Grayson Is the Sole Authority
Every transcription rule must trace to Grayson's dissertation. Do not rely on general Russian phonetics knowledge. When uncertain, search the uploaded Grayson chapters before answering.

### 2. Scholarly Integrity
- Never hallucinate sources or quotations
- Never edit Dann's authored content (blurbs, glosses, educational text)
- Only replace with exact text Dann provides

### 3. Quality Over Speed
- Propose one change at a time
- Wait for explicit approval before implementing
- Verify thoroughly before delivering

### 4. Calm Authority Aesthetic
The interface should feel "trustworthy through playfulness" — scholarly accuracy delivered through warm, approachable design. No visual clutter, no aggressive UI elements.

---

## Technical Architecture

Ilya is a **single-file HTML application** (~10,000 lines) with embedded CSS and JavaScript. No build process, no external frameworks except:
- **pako** — gzip decompression for dictionary
- **Tesseract.js** — OCR (lazy-loaded)

### Key Components

| Component | Lines (approx) | Purpose |
|-----------|----------------|---------|
| CSS variables & styles | 1–2800 | Theming, layout, print styles |
| HTML structure | 2800–3400 | DOM skeleton |
| Dictionary loading | 3175–3220 | Loads 416k-word dictionary |
| Gloss formatting | 3460–3610 | Truncation, cleanup for display |
| DocumentState & DrawerController | 4050–4950 | State management, UI orchestration |
| GraysonEngine | 5150–6800 | Core transcription engine |
| BlurbLibrary | 7100–7700 | Educational explanations |
| PopupController | 8000–9800 | Word detail popup with ribbon |

### Data Flow

```
User Input → DrawerController.transcribe()
  → Parse lines into words
  → GraysonEngine.lookupStress() for each word
  → GraysonEngine.transcribe() for IPA
  → GraysonEngine.autoDetectBoundaries()
  → GraysonEngine.applyCrossWordAssimilation()
  → DrawerController.renderToPaper()
```

---

## The Dictionary

**Source:** English Wiktionary via kaikki.org (CC BY-SA 4.0)  
**Size:** 416,691 inflected forms  
**Format:** Gzipped JSON at `data/ilya_dictionary.json.gz`

Each entry contains:
- `stress` — syllable index (0-based)
- `pos` — part of speech
- `gloss` — English translation(s)
- `lemma` — base form (for inflected words)

**Coverage:** ~80-90% of forms in vocal literature

---

## Key Files in Repository

```
index.html          — The entire application
data/
  ilya_dictionary.json.gz  — Compressed dictionary
  (other data files)
```

---

## IPA Conventions (Grayson)

### Vowels — Stressed
| Cyrillic | IPA | Notes |
|----------|-----|-------|
| а | ɑ | Back open (default) |
| а | a | Front open (interpalatal context) |
| о | o | NOT ɔ — Grayson p. 86 explicit |
| е | ɛ | Default |
| е | e | Interpalatal context |
| ё | o | Same as stressed о |
| и | i | Never reduces |
| ы | ɨ | Close central |
| у | u | Close back rounded |

### Vowels — Unstressed
| Position | а/о | е/я |
|----------|-----|-----|
| Pretonic immediate | ɑ | ɪ |
| Remote | ʌ | ɪ |
| Word-initial | ɑ | jɪ |

### Forbidden Glyphs
Never output: `ɔ`, `ə`, `ɐ`, `nʲ` (use ɲ), Latin `g` (use ɡ)

---

## Current Feature Status

### ✅ Working
- Text input with Cyrillic normalization
- OCR scanning (Tesseract.js)
- Word stacks (IPA / Cyrillic / Gloss)
- Stress marking (click syllables)
- Syllable boundary adjustment
- Phoneme ribbon with educational blurbs
- ё/е toggle with provenance tracking
- Cross-word voicing assimilation
- Clitic detection and IPA fusion
- Print pagination (8 rows target)
- Footer attribution

### ⚠️ In Progress
- Clitic spacing refinement (vowel-aware fusion)
- Dictionary gap audit
- Cluster simplification verification

### ❌ Not Yet Built
- Provenance badges on word stacks
- Copy-to-clipboard for stack elements

---

## Active Issue Tracker (v5.11.11)

See `ILYA_ISSUE_TRACKER.md` for complete details.

**Phase 1 (Bug fixes):** K ✅, L ⚠️, N ❓  
**Phase 2 (Dictionary):** P, C, I — pending  
**Phase 3 (Grayson verification):** H, S, T — pending  
**Phase 4 (Layout):** B, Q, R — pending  
**Phase 5 (Clitic fusion):** F, G, J, V, W — pending  
**Phase 6 (UX):** E — pending  

---

## How to Resume Work

1. **Read this document first**
2. **Read `ILYA_ISSUE_TRACKER.md`** for current priorities
3. **Read `ILYA_ARCHITECTURE.md`** for code navigation
4. **Ask Dann** which issue to tackle next
5. **Propose one change** → wait for approval → implement

---

## Resources

- **Grayson chapters:** Search "COMPLETE GRAYSON UPLOADED" in past chats
- **Kimi consultations:** Draft comprehensive requests; Dann bridges communication
- **Testing:** Always use Shostakovich *Станцы* as test corpus

---

## A Note on Trust

Dann depends on Claude's reliability and integrity. He cannot build this himself and trusts Claude to:
- Be honest about limitations
- Admit mistakes promptly
- Follow through consistently
- Protect the scholarly integrity of the work

This trust has been earned through careful collaboration. Honour it.
