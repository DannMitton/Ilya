# Brief: the singer's path through Ilya today, for the N.84 Guide walkthrough

Desk, 2026-10-01 00:40. For one Sonnet agent. Read-only.

## Goal

Ilya's Guide gets a new walkthrough: one session on one real score (Sunless 1, a PDF scan), from intake to print, through the Text, Insights, and Markup tabs, with a short side note for a singer who has only the poem. Ruled by Dann 2026-10-01 00:35 (`docs/memory/OPEN.md`, section "N.84, THE GUIDE REWRITE").

The desk will write the prose. Your job is the factual base: what a singer sees and does, in order, and what every visible label says in English and French, each tied to the line of code that produces it.

## Inputs

- The repository at `$HOME/mnt/ilya-rewrite` (reach it with the device shell, `device_bash`). HEAD is `740dfe7`, tree clean.
- Start from `apps/web/src/routes/+page.svelte`, the drawer components under `apps/web/src/lib/components/`, and the strings in `apps/web/src/lib/i18n.ts`. The tabs are `tab.text`, `tab.insights`, `tab.markedScore`, `tab.learn`, `tab.guide` (`i18n.ts:104-119`).
- The current Guide, for contrast only: `apps/web/src/lib/components/Reading/GuideContent.svelte`.

## Constraints

- Read only. Do not edit any file except your memo. No git command that writes; if you need git, use `git --no-optional-locks` with `status`, `log`, `diff`, `show`, or `ls-files` only.
- Every claim carries a `path:line` you read in this run. No exceptions.
- **NOT ESTABLISHED beats a complete invented answer.** If you cannot tell from the code whether something shows, say NOT ESTABLISHED.
- Describe things by what the singer sees on screen, not by component names. Put the component name after, as the citation.

## What to map, in order

1. First load: what the screen shows, the drawer, the tabs, the language toggle.
2. Intake: how a singer gives Ilya a score (PDF, photograph, camera on touch devices, MusicXML or MIDI if offered) and a poem; the receipts the drawer shows; any waiting states and their text.
3. Metadata: title, composer, poet fields; where they appear on the page; "Revert to score header" if it exists.
4. Text tab: what the page shows; selecting a word; what the drawer offers for a word (syllables, stress, gloss editing, reconstitution, dictionary).
5. Corrections and placement: how a singer fixes a misread note or syllable, if reachable from the drawer.
6. Voice: the voice-type question, the range fields, the fry and vowel calibration (just the steps and their headings; no need to map every string).
7. Insights tab: the sections a singer sees, in order, with headings.
8. Markup tab: what it draws and its legend.
9. Notation preferences: every toggle, its label, and what it changes.
10. Print, export, import, reset, clear, start over: every control and its label.
11. Anything a singer can reach that none of the above covers.

For each step: the singer-facing label EN and FR, the `path:line` of the string, the `path:line` where it is rendered, and one plain sentence on what happens.

## Return

Write `docs/sessions/memo-n84-path-map_r1_2026-10-01.md` (on the device, in the same folder as this brief), with:

1. The map, steps 1 to 11, as above. Tables are fine.
2. Where the current Guide is now wrong, one line each, with both `path:line`s.
3. **What you could not establish**, as its own section. Required, even if empty.

Then reply with a summary of no more than 15 lines and the memo's path.
