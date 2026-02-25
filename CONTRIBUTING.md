# Contributing to Ilya

Thank you for your interest in improving Ilya! This document explains how the project is organised, what kinds of contributions are welcome, and where the boundaries lie.

## The Scholarly Foundation

Ilya implements one source: Craig Grayson's doctoral dissertation *Russian Lyric Diction: A Practical Guide* (D.M.A., University of Washington, 2012). This is not a limitation; it is the point. Grayson's work synthesises Russian lyric diction into a systematic, teachable framework, and Ilya's value depends on faithfully operationalising that framework.

Contributions that improve how Ilya implements Grayson are welcome. Contributions that substitute a different phonological authority, however well-intentioned, are not. If you believe Grayson is wrong about something, you may well be right, but Ilya is not the venue for that argument. Where I have departed from Grayson, I have done so transparently, with supporting citations and a visible callout in the interface. The same standard applies to any proposed departure.

## Reporting Transcription Errors

If you find a word that Ilya transcribes incorrectly, please open an issue and include:

1. The Russian word in Cyrillic.
2. The IPA output Ilya produces.
3. The IPA output you expect.
4. A citation: page number from Grayson, or another authoritative source with full bibliographic detail.

Issues without citations will not be ignored, but they will wait until I can verify them. Issues with citations move to the front of the queue.

## Dictionary Contributions

Ilya's dictionary draws stress data and translation glosses from English and French Wiktionary via kaikki.org. If you notice a missing word, an incorrect stress assignment, or a misleading gloss, an issue is the right starting point. Dictionary changes affect every transcription that touches the modified entry, so they pass through review before merging.

Glosses serve singers, not linguists. A good gloss is short (twenty characters or fewer), captures the word's meaning in context, and exists in both English and French. French glosses are not translations of English glosses; they are independently well-formed.

## Working With the Code

Ilya is a monorepo using pnpm workspaces. The three core packages are independently testable:

**`@ilya/phonology`** contains the GraysonEngine: the rule-based transcription logic. Changes here require Vitest tests demonstrating the expected behaviour, grounded in Grayson's rules. If you are adding a phonological rule, cite the page number.

**`@ilya/dictionary`** handles dictionary loading, stress lookup, and gloss retrieval. Changes here should not break the loading pipeline or degrade French gloss coverage.

**`@ilya/blurb`** generates the pedagogical explanations that appear when a singer clicks a word. Blurb content follows the voice and register documented in the project's voice instruction.

The web application lives in `apps/web/` and is built with SvelteKit and TypeScript.

### Running Tests

```bash
pnpm test           # Vitest unit and integration tests
pnpm test:e2e       # Playwright end-to-end tests (requires dev server)
```

All tests must pass before a pull request will be reviewed.

## What Will Not Be Merged

To save you time and effort, here is what falls outside Ilya's scope:

**Changes to the IPA symbol inventory.** Ilya uses Grayson's closed set. Adding symbols (tie bars, retroflex diacritics, alveolopalatal notation) changes what Ilya is, not how well it works.

**Changes to user-facing text that do not match the project's voice.** Ilya speaks with a specific register: scholarly warmth, precision without condescension, and quiet confidence. UI text, blurbs, and LEARN content are authored, not generated. If you would like to suggest improvements to user-facing language, please open an issue rather than a pull request; I will write or approve the final text.

**Changes that break bilingual parity.** Centring Canadian bilingualism, Ilya serves English and French users equally. A feature that works in one language but not the other is incomplete.

**Changes that introduce external phonological authorities** without transparent documentation and my approval as scholarly curator.

## A Note on the Spirit of This Project

Ilya exists to serve singers and teachers of Russian lyric diction. It is free, it is open source, and it was built with care over many months by a small team. Part of the reason Ilya was conceived as self-contained, free, and open-source was to foster independence and deburden myself from copious legacy updates. The architecture is designed so that the tool can outlive my attention to it: if you can improve Ilya, you should not need to wait for me.

If you are here because you want to help singers prepare Russian repertoire more confidently, we are working toward the same thing, and I am glad you are here. Take care of my baby, make him more robust with the alterations you introduce. And thank you! :) <3

Dann Mitton
Toronto, 2026
