# Ilya Quick Start — For New Claude Sessions

**Read this first. It takes 2 minutes and prevents mistakes.**

---

## The One-Sentence Summary

Ilya is a Russian-to-IPA transcription tool for classical singers, built as a single HTML file, following Craig Grayson's dissertation as the sole authority.

---

## Your Relationship with Dann

Dann Mitton is the creator. He has AuDHD. This means:
- **One change at a time.** Propose → wait for "yes" → implement.
- **Be direct.** No fluff, no hedging, no excessive apologies.
- **Be honest.** If you're unsure, say so. Never hallucinate.
- **Be patient.** If he's frustrated, slow down. Don't escalate.

He trusts you. He depends on you. Honour that.

---

## Your Relationship with Kimi

Kimi is another AI who handles UX and architecture. Dann bridges communication. When you need her input:
1. Draft a comprehensive request with context
2. Give it to Dann
3. He'll share it with Kimi and bring back her response

---

## The Golden Rule

**Grayson is the sole authority.** Every IPA rule must trace to his dissertation. Do not rely on general Russian phonetics knowledge. When uncertain, search the Grayson chapters in past chats before answering.

---

## Current State (v5.11.11)

**What's working:** Basic transcription, stress marking, clitic detection, cross-word assimilation, print pagination.

**What's in progress:** Bug fixes (ghost text, stress glyphs), clitic spacing refinement, dictionary gaps.

**Active issue tracker:** See `ILYA_ISSUE_TRACKER.md`

---

## How to Make Changes

1. **View the file:** Use `view` tool on `/home/claude/index.html`
2. **Make ONE change:** Use `str_replace` with exact old/new strings
3. **Update version:** Change `<title>Ilya — vX.Y.Z description</title>`
4. **Copy to outputs:** `cp /home/claude/index.html /mnt/user-data/outputs/`
5. **Present to Dann:** Use `present_files` tool
6. **Provide commit info:**
   - Repo: https://github.com/DannMitton/Ilya
   - Live: https://dannmitton.github.io/Ilya/
   - Commit message + extended description

---

## Common Code Locations

| Need to change... | Look at lines... |
|-------------------|------------------|
| Word parsing | 4800-4810 |
| Stress mark display | 4890-4895 |
| Clitic fusion | 4900-4925 |
| Clitic glosses | 5178-5220 |
| Final devoicing | 6156-6170, 6788-6795 |
| Cross-word assimilation | 6745-6795 |
| Page layout CSS | 275-500 |
| Print CSS | 2650-2760 |

---

## Test Corpus

Always test with Shostakovich *Станцы*:

```
Станцы

Брожу ли я вдоль улиц шумных,
Вхожу ль во многолюдный храм,
Сижу ль меж юношей безумных,
Я предаюсь моим мечтам.
```

---

## If You're Lost

1. Read `ILYA_PROJECT_OVERVIEW.md` for full context
2. Read `ILYA_ISSUE_TRACKER.md` for current priorities
3. Read `ILYA_ARCHITECTURE.md` for code navigation
4. Ask Dann what to do next

---

## Never Do These Things

- ❌ Rely on general Russian phonetics (use Grayson only)
- ❌ Edit Dann's authored content without exact replacement text
- ❌ Make multiple changes at once
- ❌ Hallucinate sources or citations
- ❌ Use em-dashes (use commas, colons, semicolons)
- ❌ Output forbidden IPA glyphs: ɔ, ə, ɐ, nʲ, Latin g

---

## Links

- **Live site:** https://dannmitton.github.io/Ilya/
- **Repository:** https://github.com/DannMitton/Ilya
- **Grayson chapters:** Search "COMPLETE GRAYSON UPLOADED" in past chats
