# Contributing to Ilya

Thank you for your interest in improving Ilya. This document explains how the
project is organised, what kinds of contributions are welcome, and where the
boundaries lie.

## The scholarly foundation

Ilya implements one source: Craig Grayson's doctoral dissertation *Russian
Lyric Diction: A Practical Guide* (D.M.A., University of Washington, 2012).
This is not a limitation. It is the point. Grayson's work synthesises Russian
lyric diction into a systematic, teachable framework, and Ilya's value depends
on faithfully operationalising that framework.

Contributions that improve how Ilya implements Grayson are welcome.
Contributions that substitute a different phonological authority are not. If
you believe Grayson is wrong about something, you may well be right, but Ilya
is not the venue for that argument. Where Dann has departed from Grayson, he
has done so transparently, with supporting citations and a visible callout in
the interface. The same standard applies to any proposed departure.

## The architecture, and what must not change

Read [ARCHITECTURE.md](ARCHITECTURE.md) before changing how the pieces fit
together. It lists the codemap and the invariants every change must keep,
including that packages never import the application, that the application
reaches a package only through its `@ilya/` name, and that large files stay
under their ceiling in `scripts/ratchets.json` rather than growing further.

A few of those invariants are worth stating plainly here, because they mark
where a well-intentioned pull request most often goes wrong:

- **IPA comes only from the GraysonEngine (`@ilya/phonology`).** No component,
  renderer, or analysis module writes IPA, hand-rolls a phonological
  predicate, or re-derives a phonological rule of its own.
- **The IPA stays inside Grayson's closed inventory:**
  `ˈ ː a ɑ b d e ɛ f ɡ ɣ h i ɪ ɨ j ʲ k l ɫ m n ɲ o p r s ʃ t u v ʌ x z ʒ`. Do
  not add symbols (tie bars, retroflex diacritics, alveolopalatal notation),
  and do not rename an existing vowel.
- **`VocalLineEvent` does not change shape.** Much of the Markup and Insights
  documents are built on it. Do not change it, and do not rebuild
  `apps/web/src/lib/score/reconciliation/`.
- **The notes never move; the drawer manipulates, the page displays and
  prints.** No control belongs on the printed page.
- **Store what the singer said, never what Ilya derived.** Everything derived
  is recomputed when a song reopens.
- **A stored identifier changes only with a migration** that reads both the
  old and the new value, because destination and library identifiers are
  written to the singer's own device.

## Bilingual parity

Ilya serves English and French users equally. A feature that works in one
language and not the other is incomplete. Interface strings live in
`apps/web/src/lib/i18n.ts`, and every literal key is checked against both
languages by an approval test.

**French strings ship only after Dann ratifies them.** If your change adds or
changes user-facing text, propose the French alongside the English in your
pull request, and say which entries you drew on or adapted, but expect the
French wording itself to be ruled on before it ships. This applies to
interface strings, Learn and Guide content, and the word-explanation
templates in `data/blurb-composer.json`.

## Reporting transcription errors

If you find a word that Ilya transcribes incorrectly, open an issue and
include:

1. The Russian word in Cyrillic.
2. The IPA output Ilya produces.
3. The IPA output you expect.
4. A citation: a page number from Grayson, or another authoritative source
   with full bibliographic detail.

An issue without a citation is not ignored, but it waits until the maintainer
can verify it. An issue with a citation moves to the front of the queue.

## Dictionary contributions

Ilya's dictionary draws stress data and translation glosses from English and
French Wiktionary via kaikki.org. If you notice a missing word, an incorrect
stress assignment, or a misleading gloss, an issue is the right starting
point. Dictionary changes affect every transcription that touches the
modified entry, so they pass through review before merging.

Glosses serve singers, not linguists. A good gloss is short (twenty characters
or fewer), captures the word's meaning in context, and exists in both English
and French. French glosses are not translations of the English gloss. They
are independently well-formed.

## Working with the code

Ilya is a pnpm workspace monorepo. The four packages are independently
testable, and [ARCHITECTURE.md](ARCHITECTURE.md) maps them.

- **`@ilya/phonology`** contains the GraysonEngine, the rule-based
  transcription logic. Changes here need Vitest tests demonstrating the
  expected behaviour, grounded in Grayson's rules. If you add a phonological
  rule, cite the page number.
- **`@ilya/dictionary`** handles dictionary loading, stress lookup, and gloss
  retrieval. Changes here must not break the loading pipeline or degrade
  French gloss coverage.
- **`@ilya/blurb`** generates the pedagogical explanations a singer sees after
  tapping a word.
- **`@ilya/score-parser`** parses MusicXML and MNX into one score type,
  analyzes it, and engraves it. It needs no browser.
- **`apps/web`** is the SvelteKit application. `src/lib/` is split into six
  modules (`reader/`, `score/`, `voice/`, `analysis/`, `markup/`, and
  `insights/`), and `scripts/ratchets.mjs` checks that a module imports only
  what its place in that split allows.

### Running the gates

Run these from the repository root before opening a pull request:

```bash
pnpm test          # unit and integration tests, every package
pnpm test:e2e       # Playwright end-to-end tests (starts its own dev server)
pnpm ratchets       # architecture checks: file size, layering, package surface
```

`pnpm test` runs each package's own Vitest suite (`test:phonology`,
`test:dictionary`, `test:blurb`) and the cross-package integration suite.

In `apps/web`, also run the type check:

```bash
cd apps/web
pnpm check          # svelte-check
```

CI (`.github/workflows/ci.yml`) runs the same gates, plus the desktop
Playwright suite, on every push. It allows zero new type errors above a
tracked baseline. All gates must pass before a pull request is reviewed.

### What the ratchets enforce

`scripts/ratchets.mjs` (configuration in `scripts/ratchets.json`) checks four
things and fails, naming each breach, when any is true:

1. **File size.** A source file listed in `scripts/ratchets.json` has grown
   past its ceiling, or an unlisted source file is longer than 1,000 lines. A
   ceiling may fall and never rise except on purpose, changed in the same
   commit with the reason stated. New work goes into a new module rather than
   into an already large file.
2. **Layering.** Code under a package's `src/` imports from the application
   (`apps/`, or SvelteKit's `$lib` alias). Dependencies run one way: the
   application uses the packages, and the packages know nothing about the
   application.
3. **Package surface.** Application source reaches into a package's files by
   a relative path (`../packages/...`) instead of through its `@ilya/` name.
   Tests are exempt, because they may load a package's fixtures directly.
4. **Modules.** A file under one of the six `apps/web/src/lib/` modules
   imports another module it is not allowed to import, per the module map.
   Tests are not exempt from this check.

## What will not be merged

- **Changes to the IPA symbol inventory.** Ilya uses Grayson's closed set.
  Adding symbols changes what Ilya is, not how well it works.
- **Changes to user-facing text that do not match the project's voice.** Ilya
  speaks with a specific register: scholarly warmth, precision without
  condescension, and quiet confidence. UI text, blurbs, and Learn content are
  authored, not generated. If you would like to suggest improvements to
  user-facing language, open an issue rather than a pull request. Dann writes
  or approves the final text.
- **Changes that break bilingual parity.** A feature that works in one
  language and not the other is incomplete.
- **Changes that introduce an external phonological authority** without
  transparent documentation and the maintainer's approval as scholarly
  curator.

## How to propose a change

Open an issue or a pull request on
[GitHub, `DannMitton/Ilya`](https://github.com/DannMitton/Ilya). For anything
beyond a small fix, open an issue first to discuss the approach before you
invest time in a pull request, especially where a change touches the
protected areas above.

## A note on the spirit of this project

Ilya exists to serve singers and teachers of Russian lyric diction. It is
free, it is open source, and it was built with care over many months by a
small team. Part of the reason Ilya was conceived as self-contained, free,
and open source was to foster independence and relieve Dann of ongoing legacy
updates. The architecture is designed so the tool can outlive his attention to
it. If you can improve Ilya, you should not need to wait for him.

If you are here because you want to help singers prepare Russian repertoire
more confidently, this project is working toward the same thing, and Dann is
glad you are here.

Dann Mitton
Toronto, 2026
