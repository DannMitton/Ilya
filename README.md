# Ilya

**Russian-to-IPA transcription for classical singers.**

Ilya transcribes Russian text into the International Phonetic Alphabet following
the phonological rules described in Craig Grayson's doctoral dissertation
"Russian Lyric Diction" (2012). It is designed for singers, voice teachers,
and coaches preparing Russian art song and opera repertoire.

## Project Structure

```
ilya/
├── apps/
│   └── web/                    # SvelteKit web application (Phase 2)
├── packages/
│   ├── phonology/              # GraysonEngine: phonological analysis
│   ├── dictionary/             # Dictionary loader and gloss pipeline
│   └── blurb/                  # IPI blurb composer (educational explanations)
└── fixtures/                   # Golden master and regression test data
```

## Development

This project uses [pnpm](https://pnpm.io/) workspaces.

```bash
pnpm install
pnpm test
```

## Status

Phase 1: Extracting and testing the scholarly core. See the
[live prototype](https://dannmitton.github.io/Ilya/) for current functionality.

## Licence

MIT. See [LICENSE](./LICENSE).

## Attribution

See [NOTICES.md](./NOTICES.md) for scholarly attribution and dependency licences.
