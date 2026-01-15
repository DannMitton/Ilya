# Design Consultation: Visual Treatment for Unstressed Clitics

Hi KIMI! Dann and I are working on MSR (My Sung Russian), an IPA transcription tool for singers learning Russian vocal repertoire. We've hit a UX challenge and would love your design insight.

## The Problem

Russian has small words called **clitics** — prepositions and particles like во, ко, со, не, ни — that are inherently unstressed. They attach prosodically to the following word, functioning as lead-ins rather than independent units.

**The singer's need:** Know the vowel quality (we transcribe it), but understand that this word should be minimized in performance — the stress that follows is what matters.

**Current state:** All words render as equal-weight cards in the UI. A clitic like "во" looks just as prominent as the stressed word it precedes.

## Our Initial Thought

Grey out or reduce opacity on clitic word cards. This would subtly signal "this exists but defer to what follows."

But we don't know what we don't know. There may be better approaches we haven't considered.

## Questions We're Open To

1. Is opacity reduction the right approach, or does it create accessibility issues?
2. Should clitics visually connect to their host word somehow?
3. Are there typographic or spacing conventions that signal prosodic subordination?
4. How do music scores or linguistic texts handle this kind of hierarchical stress?
5. What about colour, size, or position treatments we haven't thought of?

## Current UI Context

- Word cards display: Cyrillic text on top, IPA transcription below
- Users click syllables to assign stress (green circle indicates stressed syllable)
- Clean, minimal aesthetic with a warm paper-tint background
- Accessibility matters — singers of all ages use this

## Visual Reference

The app uses:
- Warm cream/paper background tints
- Terracotta accents for interactive elements
- Green for stress indicators
- Card-based layout with subtle shadows

## What Would Help

Your perspective on how to visually communicate "this word is real but prosodically lightweight" without:
- Making it look like an error or disabled state
- Confusing users about whether the transcription is valid
- Breaking the visual rhythm of the text

We're open to unconventional solutions. What patterns have you seen work for hierarchical or subordinate text elements?

---

*Context: MSR is an open-source tool (AGPL-3.0) implementing Craig Grayson's Russian Lyric Diction for singers. Live at https://dannmitton.github.io/msr/*
