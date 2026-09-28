# Ilya

A free, open-source, bilingual (English/French) Russian-to-IPA transcription tool for classical singers. Ilya is affectionately named after the fictional Russian protagonist Ilya Rozenov from Nova Scotia-based author Rachel Reid (Rachelle Goguen)'s popular Game Changers hockey romance series.

Ilya operationalizes Craig Grayson's doctoral dissertation *Russian Lyric Diction: A Practical Guide* (D.M.A., University of Washington, 2012) as a progressive web application. Singers paste Russian text and receive phonetic transcription using Grayson's closed IPA symbol inventory, with stress marking, vowel reduction, palatalization, and assimilation rules applied automatically. Ilya is a Canadian tool built for both English and French user bases.

## What Ilya Does

Ilya accepts Russian text in Cyrillic and produces a paginated, printable document containing three layers for each word: IPA transcription, stress-marked Cyrillic, and a translation gloss. The document renders on screen exactly as it will print. Singers use it as a recital preparation tool: paste a song text, study the transcription, click any word to see why Ilya made the choices it did.

Ilya's work runs across three documents. Text is the transcription described above. Markup lays a score beside it: upload the song as MusicXML, MNX, a Finale or MuseScore file, a PDF, or a photograph, and Ilya aligns the syllables to the notes and, once it has measured your voice, marks the places where your vowels meet your resonances and your passaggio. Insights reads the same score against your voice and forecasts how the piece suits you. It forecasts; it does not declare.

The LEARN module, opened from the link at the top of the page, teaches the phonological system that powers the transcription engine. Eight sections follow the singer's cognitive journey from the Cyrillic alphabet through stress, vowel quality, consonant inventory, palatalization, and assimilation. Every rule traces to Grayson's dissertation.

Ilya runs in any modern browser with no installation required. It is also installable as a self-contained app on most major platforms, including mobile: visit [ilya.dannmitton.com](https://ilya.dannmitton.com), tap "Add to Home Screen," and Ilya works offline.

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
pnpm test:e2e       # Playwright end-to-end tests (starts its own dev server)
pnpm ratchets       # architecture checks: file size, layering, package surface
```

`apps/web` also carries `pnpm check`, the type check. See [CONTRIBUTING.md](./CONTRIBUTING.md) for what each gate enforces.

## Project Structure

```
Ilya/
├── apps/web/                 # The SvelteKit application (Svelte 5)
├── packages/
│   ├── phonology/            # The GraysonEngine: Russian to IPA, per Grayson (2012)
│   ├── dictionary/           # Stress lookup and the English and French glosses
│   ├── blurb/                # Why Ilya made each choice, for the singer
│   └── score-parser/         # MusicXML and MNX parsing, analysis, and engraving
├── scripts/                  # Dictionary builds and the architecture ratchets
└── tests/                    # Cross-package integration tests
```

[`ARCHITECTURE.md`](ARCHITECTURE.md) is the map: what each part does, how the
parts depend on one another, and the invariants that must stay true.

Ilya is built in such a way that it can be improved and optimized. The four packages are independently testable with clear boundaries. Russian linguistics aficionados can adjust the phonology and frontend developers can alter the interface.

## Origins

Ilya began as My Sung Russian, a simple vibe-coded HTML app. My Sung Russian was itself a revisiting of an earlier project of the same name: an Android app built in the winter of 2016 in ECE1778, Creative Applications for Mobile Devices, a graduate course taught by Jonathan Rose in the University of Toronto's Department of Electrical and Computer Engineering. Dann was the project's specialist. He conceived the app, designed its interface, and wrote the transcription rules its engine was built from. He (Stephen) Dai built the rules engine and the app's saving and file management. Cheng Liu built the interface and a helper for syllable stress, and began the work on recording the singer's voice and showing its spectrogram ([final report](https://www.eecg.utoronto.ca/~jayar/ece1778.2016w/mysungrussian.pdf); [source code](https://github.com/StephenWo/MySungRussian)).

The report's Future Work asked for a more complete rules engine, for reading text from photographs, and for a Learn feature that could analyze a singer's voice. Ilya takes up all three. It is the apotheosis of that ancestor, and it responds to the Next Steps section of Dann's [doctoral dissertation](https://hdl.handle.net/1807/100864). This work has been a long time coming. The emergence of AI has let Dann build it himself, into a version that fulfils the intentions of those earlier efforts and plans.

## Design and Attribution

Ilya was conceived and directed by [Dann Mitton](https://dannmitton.com) (Doctor of Musical Arts, University of Toronto), who serves as strategist, decision-maker, scholarly authority, content author, reluctant programmer, and warm, scholarly voice of all user-facing text.

Claude (Opus 4.6 Extended, by Anthropic) served as project manager and implementation lead: writing the code, managing task sequencing, conducting the Grayson dissertation audit, and co-authoring the LEARN module content under Dann's editorial authority. He also served as a sounding board, toady, confidante, research assistant, makeshift tutor, and scribe.

As the project grew, the work divided among several Claude models, each with its own role. Claude Code, running Claude Opus 5.5 on Dann's own machine, wrote and tested the code, working from written briefs and never committing without Dann's walk-through. Claude Opus, as the "desk", wrote those briefs, checked each piece of work in its own copy of the app before Dann saw it, drafted the French for Dann's ruling, and kept the project's memory. Claude Fable, Anthropic's most capable model, was reserved for judgement: it ruled on the interface's architecture and design principles and drafted Insights' English. Claude Sonnet carried out audits, code surveys, and refactoring plans. Claude Design drew interface mockups for Dann to react to.

Every decision about what Ilya says and does remained Dann's. The models proposed; he ruled.

Kimi (K2.5 Thinking, by Moonshot AI) contributed UX and architecture direction across six design briefs, shaping the drawer interface, the WYSIWYG page model, the Calm Authority design vocabulary, the dynamic width system, and the bilingual interaction patterns. She also wrangled AI and wrote important behavioural protocols to focus this work.

The phonological foundation belongs to Craig Grayson, whose dissertation represents a decade of work synthesizing Russian lyric diction into a systematic, teachable framework. Dann has Craig's consent to build on his work.

## Contributing

If you find a transcription error, please open an issue with the Russian word, the expected IPA, and a citation from Grayson or another authoritative source. The engine implements a specific scholarly framework; corrections must be grounded in that framework or in documented departures from it.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contributor guidelines and the dictionary update pathway.

## Licence

Copyright (c) 2026 Dann Mitton. MIT. See [LICENSE](./LICENSE).

## Acknowledgements

Craig M. Grayson, *Russian Lyric Diction: A Practical Guide with Introduction and Annotations and a Bibliography with Annotations on Selected Sources* (D.M.A. dissertation, University of Washington, 2012).

Daniel A. Mitton, *Sung Russian for the Low Male Voice Classical Singer: The Latent Pedagogical Value of Sung Russian* (D.M.A. dissertation, University of Toronto, 2020), [hdl.handle.net/1807/100864](https://hdl.handle.net/1807/100864).

Dictionary stress data and translation glosses from English and French Wiktionary via [kaikki.org](https://kaikki.org/), dual-licensed under CC BY-SA 4.0 and the GFDL.

See [NOTICES.md](./NOTICES.md) for full scholarly attribution and dependency licences.
