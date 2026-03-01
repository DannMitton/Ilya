# French Gloss Pipeline: Repertoire-Driven Expansion

**Prepared by:** Claude (Anthropic), with architectural review by Kimi (Moonshot AI, K2.5)
**Ratified by:** Dann Mitton
**Date:** March 1, 2026
**Status:** Stages 1–2 complete. Stage 3 in progress.

---

## Purpose

Ilya's dictionary contains 943,096 entries. French gloss coverage stands at 21.8%. For a bilingual tool serving a Canadian audience, 100% French parity is non-negotiable.

The strategy is repertoire-driven: identify the Russian words that classical singers actually encounter in vocal literature, then ensure those words have French glosses. This avoids indiscriminate dictionary growth and focuses effort where it serves real users.

---

## Pipeline Overview

| Stage | Task | Status |
|-------|------|--------|
| 1 | Composer Registry | ✅ Done |
| 2 | Schema Design | ✅ Done |
| 3 | Catalogue Harvest | ← Current |
| 4 | Text Extraction | Not started |
| 5 | Vocabulary Extraction | Not started |
| 6 | Gap Analysis | Not started |
| 7 | Gloss Generation | Not started |

---

## Stage 1: Composer Registry ✅

Built a ranked registry of 96 Russian song composers with verified LiederNet ComposerIds, organized into three tiers:

- **Tier A (17 composers):** Core repertoire. Tchaikovsky, Rachmaninov, Rimsky-Korsakov, Glinka, Musorgsky, Cui, Borodin, Balakirev, Rubinstein, Dargomyzhsky, Taneyev, Medtner, Gretchaninov, Arensky, Shostakovich, Rebikov, Stravinsky.
- **Tier B (18 composers):** Secondary repertoire. Prokofiev, Glazunov, Aliabev, Varlamov, and others.
- **Tier C (61 composers):** Tertiary. Assessed after Tiers A and B.

**Output:** `stage1-composer-registry-clean.json` (in project knowledge).

---

## Stage 2: Schema Design ✅

Designed a normalized JSON schema with the poem as the primary unit, reviewed by Kimi.

Three collections:

- **poets:** Identity records (Cyrillic name, Latin name, LiederNet ID).
- **poems:** One record per unique poem text. Keyed by poet + title. Includes `first_line` for disambiguation, `language` enum (`ru`, `cu`, `uk`, `pl`), `canonical_text` field, and `text_status` for tracking extraction progress.
- **settings:** Join records linking composers to poems. Each setting carries opus number, song title as performed, LiederNet song ID, and variant notes. Uses `setting_id` (UUID) as primary key.

**Kimi's contributions:** `setting_id` UUID as primary key on settings, `first_line` field for disambiguating poems with identical titles, `language` enum supporting Church Slavonic, Ukrainian, and Polish texts alongside Russian.

**Key architectural insight:** Deduplication at harvest time. The same Pushkin poem set by five different composers produces one poem record and five setting records. This makes Stages 4–6 significantly more efficient: each text is fetched once, parsed once, and analyzed once.

**Output:** `docs/stage2-repertoire-corpus-schema.json` (committed to repo).

---

## Stage 3: Catalogue Harvest (Current)

**Goal:** For each Tier A composer, extract poem-poet-composer relationships from LiederNet and populate the schema.

**Method:** `web_search` with site-scoped queries (e.g., `site:lieder.net Tchaikovsky songs`). LiederNet pages are JavaScript-rendered, so `web_fetch` returns empty shells. Google's cached snippets contain the rendered Cyrillic title data.

**Procedure per composer:**

1. Run `web_search` queries to surface song catalogue pages.
2. Extract Cyrillic titles, transliterations, opus numbers, and poet attributions.
3. Create poet records for any new poets encountered.
4. Create poem records, deduplicating against existing entries (same poet + same title = same poem).
5. Create setting records linking this composer to each poem.
6. Save incrementally as `stage3-catalogue-{composer}.json`.

**Consent gate:** Ask Dann before starting each composer.

**Start with:** Tchaikovsky (ComposerId 2762, 186 known works).

---

## Stage 4: Text Extraction

**Goal:** Fetch the full Russian text of each unique poem from public domain sources.

**Sources:** lib.ru, Wikisource, and other public domain archives. Never LiederNet (copyrighted translations). Metadata-only from LiederNet; poem texts from PD sources exclusively.

**Procedure:**

1. For each poem with `text_status: "not_fetched"`, search PD sources for the canonical text.
2. Store in the `canonical_text` field. Update `source_url`, `retrieved_at`, and `text_status`.
3. Capture variant notations (spelling differences across sources) as deltas.

**Efficiency note:** Thanks to Stage 3 deduplication, each poem is fetched exactly once regardless of how many composers set it.

---

## Stage 5: Vocabulary Extraction

**Goal:** Parse the deduplicated poem corpus into unique Russian lemmas.

**Procedure:**

1. Tokenize all canonical texts.
2. Normalize word forms (lowercase, strip punctuation).
3. Lemmatize where possible (inflected forms map to dictionary headwords).
4. Produce a unique lemma list representing the vocabulary of Russian vocal repertoire.

---

## Stage 6: Gap Analysis

**Goal:** Cross-reference the repertoire lemma list against Ilya's 943,096-entry dictionary. Identify words missing French glosses.

**Procedure:**

1. For each lemma, look up the dictionary entry.
2. Check whether a French gloss exists.
3. Categorize gaps: missing entirely vs. present with English gloss but no French.
4. Produce a prioritized gap report.

---

## Stage 7: Gloss Generation

**Goal:** Produce and integrate the missing French glosses.

**Primary source:** kaikki.org French Wiktionary extraction (362,066 Russian word senses with French glosses). Same data pipeline and CC BY-SA licensing as Ilya's existing English dictionary.

**Secondary sources:**

- WikDict Russian-French SQLite databases.
- English-to-French mapping for common gloss vocabulary.

**Procedure:**

1. Match gap list against French kaikki.org data.
2. Fill remaining gaps from secondary sources.
3. Apply lemma fallback (inflected forms inherit lemma's French gloss).
4. Integrate into dictionary build pipeline.
5. Validate coverage target: 100%.

---

## Ethical Framework

- **LiederNet:** Metadata only (titles, opus numbers, poet attributions, ComposerIds). Never harvest copyrighted translations. $100 CAD donation committed to Emily Ezust. Attribution to LiederNet as catalogue source.
- **Poem texts:** Public domain sources only (lib.ru, Wikisource).
- **Dictionary data:** CC BY-SA compatible sources only (kaikki.org, WikDict).

---

## Revision History

This pipeline was originally conceived as five stages (Composer Registry → Song Catalogue Harvest → Text Extraction → Vocabulary Extraction → Gap Analysis). Revised to seven stages on March 1, 2026:

- **Schema Design** inserted as Stage 2. The original plan had no explicit design step before harvesting, which would have produced unstructured data.
- **Gloss Generation** added as Stage 7. The original plan ended at gap analysis without explicitly staging the fix.

Both additions emerged from collaborative review with Kimi, whose architectural insight (poem-centred normalization with deduplication at harvest time) shaped the schema and made the downstream stages significantly more efficient.

---

*This document lives at `docs/french-gloss-pipeline.md` in the Ilya repository.*
