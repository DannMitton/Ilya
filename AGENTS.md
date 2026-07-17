# AGENTS.md: Ilya

Guidance for AI agents working in this repository.

## The project

**Ilya** is a free, open-source, bilingual (English and French) Russian-to-IPA transcription tool for classical singers, built as a progressive web application. It operationalises Craig Grayson's *Russian Lyric Diction: A Practical Guide* (D.M.A., University of Washington, 2012).

**Ilya is not AI.** It is a rule-based, deterministic engine implementing a specific scholarly framework. Same input, same output, always. No machine learning, no neural model, no guesswork. This distinction is load-bearing for the project's credibility with singers and teachers. Never blur it, and never describe Ilya as AI-powered.

**Fit** (engine codename **Shane**, on branch `Shane`, behind `PUBLIC_INCLUDE_SHANE=true`) is a repertoire-fit voice-analysis pane inside Ilya. Where Ilya answers "how do I pronounce this?", Fit answers "does this piece suit my voice?" Fit operationalises Mitton (2020), *Sung Russian for the Low Male Voice* (D.M.A.).

## Layout

A pnpm workspace monorepo, Node 18+, TypeScript, SvelteKit with Svelte 5 runes, tested with vitest.

- `apps/web` (`@ilya/web`): the application. Four tabs: Transcription, Fit, Learn, Guide. Fit's code is at `apps/web/src/lib/shane/`.
- `packages/phonology` (`@ilya/phonology`): the GraysonEngine. Russian phonological analysis per Grayson (2012).
- `packages/dictionary` (`@ilya/dictionary`): dictionary loader, stress lookup, gloss pipeline.
- `packages/blurb` (`@ilya/blurb`): context-aware educational explanations for phonological processes.
- `packages/score-parser` (`@ilya/score-parser`): dual-canonical (MNX + MusicXML) ingestion into `ParsedScore`, staff rendering, Verovio output.

`node_modules` is macOS-built. `pnpm test` and the app build are authoritative **only in the maintainer's terminal**, never in an agent sandbox.

## Roles and write protocol

- **Dann Mitton**: author and sole decision-maker. Every ruling on taste, copy, design, and scope is his.
- **Claude (Opus)**: project manager and the sole writer of code. Claude audits, places files, and verifies.
- **Kimi**: GUI and UX authority. Specifies and reviews; Claude implements.
- **ChatGPT / Codex**: archivist and verifier. Owns the document record: guards the corpus against drift, contradiction, and superseded copies; answers "what did we decide and where is it written"; verifies claims against sources, including Claude's claims; runs research passes.

**Write protocol (v34, "place-files"), binding on every agent:**

- **Read this repository freely. Do not write to it.** Claude places files; Dann reviews and commits by hand via GitHub Desktop.
- **No agent commits. No agent opens a pull request.** Ever.
- The protocol assumes a **single writer**. Two agents editing one tree produces a working tree nobody can explain.
- When reporting on code, **quote it and name where you read it**: the branch, the commit, and whether the working tree was dirty. A confident report from a stale checkout is a known failure mode here.

## Source hierarchy

1. **The code** is authoritative for what exists. Audit it. Never claim from recollection, and never guess a type's shape from memory.
2. **The current handover** (`phonation-tool-handover_vN`, highest N) is the resume point and names the canonical document set. The chain is incremental: older handovers are history, not live guidance.
3. **The canonical specs** named by that handover.
4. **`SHANE_ILYA_SOURCE_INDEX.md`** is a convenience map, not an authority. If it and the handover disagree, the handover wins.
5. **Grayson** is the phonetics foundation. When a phonetics question arises, read Grayson. Do not re-derive from general phonetics.

## Gould protocol

Engraving rules come **only** from `gould-vocal-engraving-rules_v6` (226 rules). Never re-derive them, and never cite *Behind Bars* from memory.

If a rule number exceeds 226, you are misremembering. Say so.

When citing a rule, quote its words, then give your interpretation as a clearly separate line, mirroring the extraction's own paraphrase-then-*Fit:* shape. Tag every claim **SOURCED** (rule N, quoted), **INFERENCE** (drawn from rule N, not stated by it), or **JUDGEMENT** (design taste, unsourced). JUDGEMENT is a fully respected answer; honest taste beats a citation stretched to cover it. Any number, measurement, or threshold carries a rule number or is tagged JUDGEMENT.

Check the version marker on line 1 of any reference document before citing it. A superseded copy under a plausible filename has caused a real incident on this project.

## Terminology and copy constraints

- **Canadian spelling. Oxford comma.**
- **No em-dashes in user-facing copy.** Use discrete sentences, or colons and commas.
- **Agentless copy.** The app never speaks as "Shane", and never speaks as an agent at all. "Shane" is an internal engine codename and must never surface to users.
- **"Sustain", never "held".**
- The user-facing tab is **"Fit"** in both English and French. Invariant, a proper name like "Ilya", never translated.
- **IPA comes verbatim from the GraysonEngine.** The renderer never synthesizes IPA.

## Engraving constraints

- **Finale Maestro** is the default music font for all renderings.
- **Acceptance criterion:** a document legible to a singer, marked up as a traditional score, **never page-count minimization.** Correct information a human cannot read accurately is worthless. This criterion outranks density, elegance, and convenience.
- **Letter portrait** is the default page. A4 is available at the print-dialogue level.
- **Measure the live render. Never infer visual values from source CSS.**

## Scholarly integrity

Where Ilya departs from Grayson, the departure is documented transparently with citations. Grayson's restricted, singable IPA inventory is the notation: `ˈ ː a ɑ b d e ɛ f ɡ ɣ h i ɪ ɨ j ʲ k l ɫ m n ɲ o p r s ʃ t u v ʌ x z ʒ`. No retroflex diacritics, no tie bars, no alveolopalatal symbols.

Stress data and translation glosses derive from English and French Wiktionary via kaikki.org (CC BY-SA 4.0). Attribution is not optional on this project.
