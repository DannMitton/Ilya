# CODE BRIEF. Page one fits by measurement (N.123 part 1, follow-up to the tessituragram build)

**Written by the desk 2026-09-23 02:20. For Claude Code in `~/Desktop/ilya-rewrite`, branch `Shane`, working tree uncommitted on top of `1dfee32`. Continues `docs/sessions/brief-code-tessituragram_r1_2026-09-23.md`; everything there still holds.** Your memo is `docs/sessions/memo-code-tessituragram_r1_2026-09-23.md`.

**NOT ESTABLISHED beats a complete invented answer.** Re-read every `path:line` before relying on it.

## What is wrong

1. **Page two now prints on every score** (`InsightsPane.svelte:177-178`). The vowel list moved there unconditionally, off one measurement of one French page. That breaks the ruling of 2026-09-11 (`docs/memory/OPEN.md`, the Insights rulings): *"page one fixed at one page, a second page only when earned."* In English on the same score it fit with room to spare.
2. **The worst case runs 213.9 px over**, and nothing handles it.
3. **"Not counted without both passaggi" prints twice**, once in the unit and once in the fit table.

## What to build. Every item is DESK DEFAULT, decided by the desk, reversible

1. **Page one is filled by measuring what it renders, not by a fixed count.** In this order, each step taken only while page one still overflows the foot:
   1. Start from everything on page one: the unit including the vowel list, and up to `PAGE_ONE_FINDINGS` findings (`insights.ts`, the constant).
   2. Move the vowel list to the top of page two.
   3. Move the lightest findings to page two one at a time, heaviest first staying, through the existing remainder line and deferred-findings list. Keep at least one finding on page one.
   4. If it still overflows with one finding, stop, shrink nothing, and report the heights.
   Page two prints only when it has something: deferred findings, untrusted measures, or the vowel list. Use the page's existing measurement machinery if there is one (`runningHeight`, `contentTop`); say what you used. Measure in the browser, per language, per score. Nothing is hard-coded from tonight's numbers, and the comment at `InsightsPane.svelte:173-176` goes.
2. **Print `crossingsUncounted` once**, in the fit table. The unit draws no lines and no shares and says nothing.
3. **Delete the three unrendered `insights.phonation.zone*` strings** only if nothing reads them. Say which you did.

## Not in this build

The clef for a voice far from the song, and treble-8vb for a tenor, both listed in your memo. The desk is holding them; do not change `chooseClefForSpan`.

## Done when

- Gates at baseline or moved only by named tests you added.
- Seen rendered, each with page one's end against the foot: Sunless 1 in English (expect one page), Sunless 1 in French, and the injected worst case in French (expect findings deferred and page one fitting).
- Dann walks it in both languages on the alias.

## Return

A memo of at most 250 words, with a section headed "NOT ESTABLISHED", saved as `docs/sessions/memo-code-tessituragram-fit_r1_<date>.md`.
