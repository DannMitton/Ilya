# Ilya

A free, open-source, bilingual (English/French) Russian-to-IPA transcription tool for classical singers. Ilya is affectionately named after the fictional Russian protagonist Ilya Rozenov from Nova Scotia-based author Rachel Reid (Rachelle Goguen)'s popular Game Changers hockey romance series.

Ilya operationalises Craig Grayson's doctoral dissertation *Russian Lyric Diction: A Practical Guide* (D.M.A., University of Washington, 2012) as a progressive web application. Singers paste Russian text and receive phonetic transcription using Grayson's closed IPA symbol inventory, with stress marking, vowel reduction, palatalization, and assimilation rules applied automatically. Ilya is a Canadian tool built for both English and French user bases.

## What Ilya Does

Ilya accepts Russian text in Cyrillic and produces a paginated, printable document containing three layers for each word: IPA transcription, stress-marked Cyrillic, and a translation gloss. The document renders on screen exactly as it will print. Singers use it as a recital preparation tool: paste a song text, study the transcription, click any word to see why Ilya made the choices it did.

The LEARN module, accessible from the drawer interface, teaches the phonological system that powers the transcription engine. Seven sections follow the singer's cognitive journey from the Cyrillic alphabet through stress, vowel quality, consonant inventory, palatalization, and assimilation. Every rule traces to Grayson's dissertation.

Ilya runs in any modern browser with no installation required. It is also installable as a self-contained app on most major platforms, including mobile: visit the URL, tap "Add to Home Screen," and Ilya works offline.

Ilya is not AI. It is a rule-based, deterministic transcription engine implementing a specific scholarly framework. Given the same input, it will always produce the same output. There is no machine learning, no neural model, and no guesswork. Every transcription decision traces to a documented rule in Grayson's dissertation.

## Scholarly Authority

Necessary simplifications for singing govern Ilya's restricted symbol inventory, eschewing speech-level detail in favour of optimally singable targets. No retroflex diacritics, no tie bars, no alveolopalatal symbols. A singer looking at Ilya's output and then at Grayson's dissertation sees the same notation.

Grayson's IPA inventory: [ˈ ː a ɑ b d e ɛ f ɡ ɣ h i ɪ ɨ j ʲ k l ɫ m n ɲ o p r s ʃ t u v ʌ x z ʒ]

Where Ilya departs from Grayson, the departure is documented transparently with supporting citations. The dictionary provides stress data and translation glosses drawn from English and French Wiktionary via kaikki.org (CC BY-SA 4.0), comprising 1.3 million word entries.

## Getting Started

Ilya runs in any modern browser. No installation required for end users.

### For Development

This project uses [pnpm](https://pnpm.io/) workspaces and requires Node.js v18 or later.

```bash
git clone git@github.com:DannMitton/Ilya.git
cd Ilya
pnpm install
cd apps/web && pnpm dev
```

Open `http://localhost:5173` in your browser.

### Running Tests

```bash
pnpm test           # Vitest unit and integration tests
pnpm test:e2e       # Playwright end-to-end tests (requires dev server)
```

## Project Structure

```
Ilya/
├── apps/
│   └── web/                        # SvelteKit web application
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/
│       │   │   │   ├── Paper/      # WYSIWYG paginated document
│       │   │   │   └── Drawer/     # Root panel and Word Console
│       │   │   ├── i18n.ts         # Bilingual string table (EN/FR)
│       │   │   ├── pipeline.ts     # Transcription orchestration
│       │   │   └── types.ts
│       │   └── routes/
│       │       └── +page.svelte    # Application shell and LEARN content
│       └── e2e/                    # Playwright E2E tests
├── packages/
│   ├── phonology/                  # GraysonEngine: rule-based phonological analysis
│   ├── dictionary/                 # Dictionary loader and gloss pipeline
│   └── blurb/                      # Pedagogical explanations for each transcription decision
├── data/                           # Dictionary and rule data
├── tests/
│   └── integration.test.ts         # Cross-package pipeline tests
└── fixtures/
    └── golden-master.json          # Validated engine outputs
```

Ilya is built in such a way that it can be improved and optimised. The three packages (`@ilya/phonology`, `@ilya/dictionary`, `@ilya/blurb`) are independently testable with clear boundaries. Russian linguistics aficionados can adjust the phonology and frontend developers can alter the interface.

## Design and Attribution

Ilya was conceived and directed by Dann Mitton (Doctor of Musical Arts, University of Toronto), who serves as strategist, decision-maker, scholarly authority, content author, reluctant programmer, and warm, scholarly voice of all user-facing text.

Claude (Opus 4.6 Extended, by Anthropic) served as project manager and implementation lead: writing the code, managing task sequencing, conducting the Grayson dissertation audit, and co-authoring the LEARN module content under Dann's editorial authority. He also served as a sounding board, toady, confidante, research assistant, makeshift tutor, and scribe.

Kimi (K2.5 Thinking, by Moonshot AI) contributed UX and architecture direction across six design briefs, shaping the drawer interface, the WYSIWYG page model, the Calm Authority design vocabulary, the dynamic width system, and the bilingual interaction patterns. She also wrangled AI and wrote important behavioural protocols to focus this work.

The phonological foundation belongs to Craig Grayson, whose dissertation represents a decade of work synthesising Russian lyric diction into a systematic, teachable framework. Dann has Craig's consent to build on his work.

## Contributing

If you find a transcription error, please open an issue with the Russian word, the expected IPA, and a citation from Grayson or another authoritative source. The engine implements a specific scholarly framework; corrections must be grounded in that framework or in documented departures from it.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contributor guidelines and the dictionary update pathway.

## Licence

Copyright (c) 2026 Dann Mitton. MIT. See [LICENSE](./LICENSE).

## Acknowledgements

Craig M. Grayson, *Russian Lyric Diction: A Practical Guide with Introduction and Annotations and a Bibliography with Annotations on Selected Sources* (D.M.A. dissertation, University of Washington, 2012).

Dictionary stress data and translation glosses from English and French Wiktionary via [kaikki.org](https://kaikki.org/) (CC BY-SA 4.0).

See [NOTICES.md](./NOTICES.md) for full scholarly attribution and dependency licences.
