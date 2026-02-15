# [Ilya]

**Russian-to-IPA transcription for classical singers.**

Ilya transcribes Russian text into the International Phonetic Alphabet following the phonological rules described in Craig Grayson's doctoral dissertation *Russian Lyric Diction* (2012). It is designed for singers, voice teachers, and coaches preparing Russian art song and opera repertoire.

Ilya is a bilingual Canadian tool. The full interface is available in English and French.

## What Ilya Does

Paste Russian text and Ilya produces a paginated, print-ready transcription document with:

- **Three-row word stacks** following lyric diction convention: IPA, Cyrillic, and word-for-word gloss
- **Stress assignment** from a 1.29-million-entry dictionary with supplement data
- **Phonological analysis** for every character via the Inspector panel, with Grayson positional rubric labels and educational blurbs
- **Provenance indicators** showing where stress comes from: dictionary lookup, composer setting, user assignment, or algorithmic inference
- **Clitic handling** with directional arrows on the page and full IPA in the Inspector
- **Open syllabification** toggle for legato singing, with per-word drag-and-drop consonant migration
- **Five notation preferences** (reduced vowels, shcha, palatal nasal, geminates, reconstitution) with instant visual updates
- **Stress diacritics** toggle for combining acute accents on Cyrillic text
- **WYSIWYG pagination** in Letter or A4 format, exportable to PDF via `Ctrl+P` / `Cmd+P`

## Getting Started

Ilya runs in the browser. No installation required for end users.

### For Development

This project uses [pnpm](https://pnpm.io/) workspaces and requires Node.js v18 or later.

```bash
git clone git@github.com:dannmitton/Ilya.git
cd Ilya
pnpm install
pnpm dev
```

Open http://localhost:5173 in your browser.

### Running Tests

```bash
pnpm test        # 370 Vitest unit/integration tests
pnpm test:e2e    # Playwright end-to-end tests
```

## Project Structure

```
ilya/
├── apps/
│   └── web/                    # SvelteKit web application
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/
│       │   │   │   ├── Paper/          # WYSIWYG paginated document
│       │   │   │   ├── Drawer/         # Root panel and Inspector panel
│       │   │   │   └── HeaderBar.svelte
│       │   │   ├── i18n.ts             # Bilingual string table
│       │   │   ├── pipeline.ts         # Transcription orchestration
│       │   │   ├── syllable-utils.ts   # Open syllabification transforms
│       │   │   └── types.ts
│       │   └── routes/
│       │       └── +page.svelte        # Application shell
│       └── e2e/
│           └── core-loop.test.ts       # Playwright E2E tests
├── packages/
│   ├── phonology/              # GraysonEngine: phonological analysis (199 tests)
│   ├── dictionary/             # Dictionary loader and gloss pipeline (152 tests)
│   └── blurb/                  # Blurb composer: educational explanations (140 tests, not yet wired)
├── tests/
│   └── integration.test.ts     # Cross-package pipeline tests (19 tests)
└── fixtures/
    ├── golden-master.json      # 196 validated engine outputs
    └── regression-cases.md     # Catalogued corrections
```

## Scholarly Authority

Ilya uses only Grayson-approved IPA symbols. Craig Grayson's *Russian Lyric Diction: A Phonological Approach* (DMA diss., University of Washington, 2012) is the sole phonological reference for the transcription engine. The dictionary data is sourced from kaikki.org's Wiktionary extract (CC BY-SA 4.0).

## Design

Ilya was designed collaboratively by Dann Mitton (decision-maker and scholarly authority), Kimi from Moonshot AI (UX and architecture lead), and Claude from Anthropic (project manager and implementation lead). The design follows a Calm Authority aesthetic: the information serves the transcription, not the application.

## Contributing

Ilya is built so that Russian linguistics students can fix the phonology and frontend developers can improve the interface. The three packages (`@ilya/phonology`, `@ilya/dictionary`, `@ilya/blurb`) are independently testable with clear boundaries.

If you find a transcription error, please open an issue with the Russian word, the expected IPA, and a citation from Grayson or another authoritative source.

## Licence

MIT. See [LICENSE](./LICENSE).

## Attribution

See [NOTICES.md](./NOTICES.md) for scholarly attribution and dependency licences.
