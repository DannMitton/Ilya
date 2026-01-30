# ILYA RECOVERY PACKAGE
## Upload This File to Start a New Claude Session

**Last Updated:** 2026-01-30  
**Current Version:** v5.11.11

---

## 🆘 QUICK START

1. Upload this file to Claude
2. Say: "I'm continuing work on Ilya. Please read the recovery package."
3. Claude will have full context to continue

---

## THE PROJECT IN 30 SECONDS

**Ilya** is a Russian-to-IPA transcription tool for classical singers.

- **Single HTML file** (~10,000 lines) at https://dannmitton.github.io/Ilya/
- **Authority:** Craig Grayson's dissertation "Russian Lyric Diction" (2012)
- **Dictionary:** 416,691 words from Wiktionary/kaikki.org

**Collaboration:**
- **Dann Mitton** — Creator, project owner (has AuDHD — one change at a time)
- **Claude** — Project manager, implements all code
- **Kimi** — UX/Design consultant (Dann bridges communication)

---

## CURRENT STATE (v5.11.11)

### Recently Fixed
- ✅ Clitic arrows (→ ←) and IPA fusion
- ✅ Ghost text collision on hyphenated words
- ✅ Monosyllable stress marks

### In Progress (19 issues, 7 phases)
1. **Phase 1:** Bug fixes (K✅, L⚠️, N❓)
2. **Phase 2:** Dictionary (P, C, I)
3. **Phase 3:** Grayson verification (H, S, T)
4. **Phase 4:** Page layout — 8 rows (B, Q, R)
5. **Phase 5:** Clitic spacing — vowel-aware (F, G, J, V, W)
6. **Phase 6:** Copy mechanism (E)
7. **Phase 7:** Future (M)

---

## KIMI'S KEY RECOMMENDATIONS

1. **Do Phase 4 BEFORE Phase 5** — Layout before clitic fusion (text width affects pagination)
2. **Dynamic vowel detection** — `hasVowel = /[аеёиоуыэюя]/i.test(cliticText)`
3. **CSS-first pagination** — Custom properties, not JS constants
4. **Double-click copy** — With 400ms accent glow feedback

---

## CRITICAL RULES

### Never Do
- ❌ Rely on general Russian phonetics (use Grayson only)
- ❌ Edit Dann's authored content without exact replacement text
- ❌ Make multiple changes at once
- ❌ Use em-dashes
- ❌ Output forbidden IPA: ɔ, ə, ɐ, nʲ, Latin g

### Always Do
- ✅ Propose one change → wait for "yes" → implement
- ✅ Update version in `<title>` tag
- ✅ Provide repo link, live link, commit message
- ✅ Test with Shostakovich *Станцы*

---

## CODE LOCATIONS

| Feature | Lines |
|---------|-------|
| Word parsing | 4800-4810 |
| Stress marks | 4890-4895 |
| Clitic fusion | 4900-4925 |
| cliticData | 5178-5220 |
| Cross-word assimilation | 6745-6795 |
| Print CSS | 2650-2760 |

---

## LINKS

- **Live:** https://dannmitton.github.io/Ilya/
- **Repo:** https://github.com/DannMitton/Ilya
- **Grayson:** Search "COMPLETE GRAYSON UPLOADED" in past chats

---

## DETAILED DOCUMENTATION

For comprehensive information, see these separate files:
- `ILYA_PROJECT_OVERVIEW.md` — Full context
- `ILYA_ISSUE_TRACKER.md` — All 19 issues with status
- `ILYA_ARCHITECTURE.md` — Code navigation
- `KIMI_CONSULTATION_RECORD.md` — Her recommendations
- `SESSION_LOG_2026-01-30.md` — What happened today

---

## TEST CORPUS

Shostakovich *Станцы* (Pushkin):

```
Станцы

Брожу ли я вдоль улиц шумных,
Вхожу ль во многолюдный храм,
Сижу ль меж юношей безумных,
Я предаюсь моим мечтам.

Я говорю: промчатся годы,
И сколько здесь не видно нас,
Мы все сойдём под вечны своды -
И чей-нибудь уж близок час.
```

(Full text in SESSION_LOG_2026-01-30.md)

---

## DANN'S PREFERENCES

- Canadian spelling, Oxford comma
- Never use em-dashes
- Scholarly warmth, not generic AI tone
- AuDHD: one step at a time, be direct, be patient
- He trusts you. Honour that.
