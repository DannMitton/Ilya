# Ilya — Session Handoff: Phase 2B
**Date:** February 2, 2026
**From:** Claude (Session 4)
**Version:** v6.0.3 (Phase 2A complete)
**Live:** https://dannmitton.github.io/Ilya/
**Repo:** https://github.com/DannMitton/Ilya

---

## Quick Start

Say: "Continuing Ilya v6.0 Drawer Architecture. Phase 2A complete (metadata migrated to drawer Root). Starting Phase 2B: migrate Cyrillic textarea, Transcribe/Clear/OCR buttons into drawer Root, plus language selection buttons. Handoff document attached."

Upload with this handoff:
- `index.html` (current v6.0.3, from outputs or repo)
- `language-buttons-v5.html` (authentic SVG flag buttons, also in project knowledge)
- `DRAWER_IMPLEMENTATION_PLAN_FINAL.md` (already in project knowledge)

---

## What Was Completed: Phase 2A (v6.0.3)

Metadata fields migrated from old `.dashboard-zone` into `.drawer-root`:
- Title, Opus, Composer (searchable select), Poet (searchable select), Transcriber
- Transcription Profile selector (Old Muscovite, Peterburgian, Choral)
- Document Settings section (Paper Size segmented control, Export PDF button)
- Drawer header with "[ Ilya ]" wordmark (plain text, not italicised)
- Scrollable `.drawer-body` with warm `--ilya-binding` background
- Section labels dividing "Song Setup" and "Page" groups
- Old `.dashboard-zone` emptied but shell preserved (removed in Phase 2C)

All verified working. Drawer opens/closes, header pins, body scrolls, dropdowns functional.

---

## What To Build: Phase 2B

**Scope:** Migrate the Cyrillic textarea and action buttons from the old bottom input-drawer into the drawer Root.

### Components to migrate

| Component | Current Location | Target | Spec |
|-----------|-----------------|--------|------|
| Cyrillic textarea | `.input-drawer .drawer-content` | `.drawer-root .drawer-body`, below metadata | 312×360px, `resize: vertical`, bilingual placeholder |
| OCR icon | Near textarea | Inside textarea, top-right corner | Existing Tesseract.js integration |
| "Transcribe to IPA" button | `.input-drawer` | Full-width below textarea | Primary action button |
| Clear button | `.input-drawer` | Beside or below Transcribe | Secondary action |
| Language selection buttons | NEW (design ready) | Below textarea, bottom-left | See section below |

### Language Selection Buttons (NEW)

Design file: `language-buttons-v5.html` (in project knowledge and repo at `design/language-buttons-v5.html`)

Both buttons use authentic SVG path data:
- **Canadian flag:** Official Government of Canada maple leaf from Ilya's own footer (9600×4800 coordinate system)
- **Quebec Fleurdelisé:** Official Wikimedia Commons paths (CC BY-SA 4.0), `Flag_of_Quebec_(modified_for_visibility).svg`

Implementation approach:
- Define both flags as `<symbol>` elements (already done in v5 file — copy the `<svg style="position:absolute...">` block with `#canada-flag` and `#quebec-flag` symbols)
- Two small buttons, scaled to button size, positioned under bottom-left of textarea
- English button: `title="English translations"`
- French button: `title="Traductions en français"`
- French button is **non-functional for now** — glosses not yet built. Can show a tooltip or gentle "Coming soon" state.
- Quebec blue in SVG is `#002495`. Official Pantone 293 sRGB is `#003399`. Keep as-is unless Dann asks to change.

### Textarea Spec (from Kimi review)

- Width: 312px (fits within 360px drawer with padding)
- Height: 360px default
- `resize: vertical` (user can drag taller, not wider)
- Bilingual placeholder: "Paste Russian lyrics here... / Вставьте русский текст здесь..."
- Character counter below (if present in current implementation)
- On first load (empty document): drawer opens in Root, textarea auto-focused (this is Phase 2D, but keep in mind)

### Transcribe Button Behaviour

After transcription:
- Drawer auto-closes (300ms)
- Paper fills with rendered content
- User enters analysis mode

This wiring is Phase 2C/2D territory, but the button placement happens in 2B.

---

## Phase Roadmap (for context)

| Phase | Status | Scope |
|-------|--------|-------|
| 0 | ✅ Complete | Rollback to v5.11.46 baseline |
| 1 | ✅ Complete | Drawer shell (DOM, CSS, open/close, paper shift, click zones) |
| 2A | ✅ Complete | Root state: metadata fields |
| **2B** | **➡️ NOW** | **Root state: textarea, OCR, transcribe, language buttons** |
| 2C | Next | Remove old bottom drawer (`input-drawer`, `DrawerController`) |
| 2D | Next | First-load experience (drawer open, textarea focused) |
| 3 | Queued | Drill state (ribbon, blurbs, controls, kill popup) |
| 4 | Queued | Polish (word-to-word morph, focus, keyboard, copy context menu) |
| 5 | Queued | Mobile bottom sheet |

---

## Pending Decisions

| Decision | Status |
|----------|--------|
| Italicise "Ilya" in drawer header | Dann to decide: now vs. defer to Phase 4 SVG wordmark |
| Composer dropdown alphabetisation | Inherited behaviour (by first name). Dann aware, not flagged as priority |

---

## Future Features (Updated)

| Feature | Status |
|---------|--------|
| French glosses | NEW — build bilingual gloss data to back the French language button. kaikki.org has French translations. |
| Multilingual glosses (DE, IT) | Future module, kaikki.org data |
| Phrase-level copy | v6.1 |
| Alternative rule engine comparisons | Future expansion module |
| Stylistic variants | Future expansion module |

---

## Key Design Documents

| Document | Where | Purpose |
|----------|-------|---------|
| `DRAWER_IMPLEMENTATION_PLAN_FINAL.md` | Project knowledge | Complete spec: DOM, CSS, state machine, animations, phases |
| `language-buttons-v5.html` | Project knowledge + `design/` in repo | Authentic SVG flag buttons (ready to extract symbols) |
| `ILYA_RECOVERY.md` | Project knowledge | Recovery package with locked design decisions |
| `ILYA_STATE.md` | Project knowledge | Current project state |

---

## Dann's Working Style

- AuDHD: One change per cycle, explicit approval before proceeding
- Quality over speed — slow down, verify before delivering
- Ask "Proceed?" and wait for "yes"
- Never edit Dann's authored content (blurbs, glosses, scholarly text)
- Canadian spelling, Oxford comma, no em dashes
- Provide repo link, live link, commit text, and test steps with every change

## Collaboration

- **Claude:** Project Manager, code implementation
- **Kimi:** UX/Design Lead, architecture specs
- **Dann:** Decision-maker, scholarly content, bridge between AI assistants
