# Ilya

Ilya is a free, open-source, bilingual (English and French) tool that transcribes
Russian text into IPA for classical singers. It operationalises Craig Grayson's
doctoral dissertation, *Russian Lyric Diction: A Practical Guide* (D.M.A.,
University of Washington, 2012), as a progressive web application.

Ilya is not AI. It is a rule-based, deterministic engine: the same input always
produces the same output. There is no machine learning and no guesswork. Every
transcription decision traces to a documented rule in Grayson's dissertation.

## Who this is for

Singers and teachers preparing Russian repertoire, and anyone who wants to run,
study, or extend the code. If you are looking to understand how the engine works
or to change it, see [ARCHITECTURE.md](ARCHITECTURE.md) and
[CONTRIBUTING.md](CONTRIBUTING.md).

## Try it

Ilya runs at [ilya.dannmitton.com](https://ilya.dannmitton.com). No installation
is required, and no account is required. It also installs as a self-contained app
on most platforms, including mobile: visit the URL and use your browser's "add to
home screen" option to use it offline.

## Quick start (development)

Ilya is a pnpm workspace monorepo and requires Node.js 18 or later.

Clone the repository and install dependencies:

```bash
git clone git@github.com:DannMitton/Ilya.git
cd Ilya
pnpm install
```

Start the development server:

```bash
cd apps/web
pnpm dev
```

Open `http://localhost:5173` in your browser.

Run the gates from the repository root:

```bash
pnpm test          # unit and integration tests, every package
pnpm test:e2e       # Playwright end-to-end tests (starts its own dev server)
pnpm ratchets       # architecture checks: file size, layering, package surface
```

`apps/web` also carries `pnpm check` (`svelte-check`) for the type check. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the full set of gates and what each one
enforces.

## Repository map

- `apps/web` (`@ilya/web`): the SvelteKit application (Svelte 5 runes). The
  singer's three documents, Text, Markup, and Insights, live here.
- `packages/phonology` (`@ilya/phonology`): the GraysonEngine. The one place a
  Russian phonological rule may live.
- `packages/dictionary` (`@ilya/dictionary`): stress lookup and the English and
  French gloss pipeline.
- `packages/blurb` (`@ilya/blurb`): the pedagogical explanation a singer reads
  after tapping a word.
- `packages/score-parser` (`@ilya/score-parser`): MusicXML and MNX ingestion,
  score analysis, and staff engraving. Needs no browser.
- `scripts/`: dictionary builds and the architecture ratchets.

[ARCHITECTURE.md](ARCHITECTURE.md) is the map: what each part does, how the
parts depend on each other, and the invariants that must stay true. Read it
before changing how the pieces fit together.

## Scholarly authority

Grayson's dissertation is the sole phonological authority for Russian in this
software. His restricted, singable IPA inventory is the notation:
`ˈ ː a ɑ b d e ɛ f ɡ ɣ h i ɪ ɨ j ʲ k l ɫ m n ɲ o p r s ʃ t u v ʌ x z ʒ`. No
retroflex diacritics, no tie bars, no alveolopalatal symbols. Where Ilya departs
from Grayson, the departure is documented transparently with citations.

The dictionary's stress data and translation glosses come from English and
French Wiktionary via [kaikki.org](https://kaikki.org/) (CC BY-SA 4.0).

## Credits

Ilya was conceived and directed by [Dann Mitton](https://dannmitton.com) (Doctor
of Musical Arts, University of Toronto), who serves as strategist,
decision-maker, scholarly authority, content author, reluctant programmer, and
warm, scholarly voice of all user-facing text.

Claude (Opus 4.6 Extended, by Anthropic) served as project manager and
implementation lead: writing the code, managing task sequencing, conducting the
Grayson dissertation audit, and co-authoring the LEARN module content under
Dann's editorial authority. He also served as a sounding board, toady,
confidante, research assistant, makeshift tutor, and scribe.

Kimi (K2.5 Thinking, by Moonshot AI) contributed UX and architecture direction
across six design briefs, shaping the drawer interface, the WYSIWYG page model,
the Calm Authority design vocabulary, the dynamic width system, and the
bilingual interaction patterns. She also wrangled AI and wrote important
behavioural protocols to focus this work.

The phonological foundation belongs to Craig Grayson, whose dissertation
represents a decade of work synthesising Russian lyric diction into a
systematic, teachable framework. Dann has Craig's consent to build on his work.

## Acknowledgements

> Grayson, Craig M. "Russian Lyric Diction: A Practical Guide with Introduction
> and Annotations and a Bibliography with Annotations on Selected Sources." DMA
> diss., University of Washington, 2012.

Dictionary stress data and translation glosses from English and French
Wiktionary via [kaikki.org](https://kaikki.org/), dual-licensed under CC BY-SA
4.0 and the GFDL.

See [NOTICES.md](NOTICES.md) for full scholarly attribution and dependency
licences.

## Contributing

If you find a transcription error, open an issue with the Russian word, the IPA
Ilya produces, the IPA you expect, and a citation from Grayson or another
authoritative source. See [CONTRIBUTING.md](CONTRIBUTING.md) for contributor
guidelines, the gates a change must pass, and the dictionary update pathway.

## Licence

Copyright (c) 2026 Dann Mitton. MIT. See [LICENSE](LICENSE).
